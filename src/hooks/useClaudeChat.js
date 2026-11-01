import { useCallback, useEffect, useRef, useState } from 'react'
import { GAME_PLANS } from '../data/gameplans'
import { packagesForGame } from '../data/packages'
import { PERSONNEL_PLANS } from '../data/personnelPlans'
import {
  applyChatChange,
  backupCurrentSheet,
  chatChangeIsCurrent,
  clearChatThread,
  getChatThread,
  getCallSheets,
  getGameDebriefs,
  getLabPlans,
  getMacroArsenal,
  getMacroPackages,
  getPersonnelCharts,
  getSheetAssignments,
  getSkillAssessments,
  saveCallSheet,
  saveMacroSlot,
  saveChatThread,
  undoChatChange,
} from '../lib/db'
import { fetchArt, fetchResearch, streamTurn } from '../lib/chat/client'
import { contentForHistory, runTool } from '../lib/chat/tools'

const GAME_LABEL = { madden: 'Madden 27', cfb: 'CFB 27' }
const PLAYBOOK_FILES = { madden: 'data/playbooks.json', cfb: 'data/playbooks-cfb27.json' }
const asset = (path) => import.meta.env.BASE_URL + path

async function loadGuide(file) {
  const r = await fetch(asset(file))
  if (!r.ok) throw new Error(`Could not load ${file}.`)
  const doc = new DOMParser().parseFromString(await r.text(), 'text/html')
  doc.querySelectorAll('style, script').forEach((el) => el.remove())
  return doc.body.textContent.replace(/\s+/g, ' ').trim()
}

// Empty team means the index of all opponents.
async function loadScouting(team) {
  const file = team ? `${team.toUpperCase()}.json` : 'index.json'
  const r = await fetch(asset(`data/scouting/${file}`))
  if (!r.ok) throw new Error(`No scouting file for "${team}".`)
  return r.json()
}

async function loadTrends(game) {
  const r = await fetch(asset('data/trends.json'))
  if (!r.ok) throw new Error('Could not load the trends digest.')
  const data = await r.json()
  return { updatedAt: data.updatedAt, ...data.games[game] }
}

// The app's copy is empty while it loads, and an empty catalog would read to
// Claude as "that play doesn't exist", so fetch it rather than answer wrongly.
async function loadCatalog(game, playbooks) {
  if (playbooks.length) return playbooks
  const r = await fetch(asset(PLAYBOOK_FILES[game]))
  if (!r.ok) throw new Error('Could not load the play catalog.')
  return (await r.json()).playbooks || []
}

// Read fresh for every batch of tools, so Claude sees edits Kenny just made.
async function toolContext(game, playbooks) {
  const [row, debriefs, arsenal, catalog, custom, labPlans, assessments, savedSheets, personnelCharts] = await Promise.all([
    getSheetAssignments(),
    getGameDebriefs(),
    getMacroArsenal(game),
    loadCatalog(game, playbooks),
    getMacroPackages(game),
    getLabPlans(),
    getSkillAssessments(),
    getCallSheets(),
    getPersonnelCharts(),
  ])
  return {
    game,
    playbooks: catalog,
    debriefs,
    arsenal,
    sheet: row.byGame?.[game],
    plans: GAME_PLANS,
    packages: [...packagesForGame(game), ...custom],
    labPlans,
    assessments,
    savedSheets,
    personnelPlans: PERSONNEL_PLANS,
    personnelCharts,
    saveSheet: saveCallSheet,
    saveSlot: saveMacroSlot,
    loadResearch: fetchResearch,
    loadArt: fetchArt,
    loadScouting,
    loadGuide,
    loadTrends: () => loadTrends(game),
  }
}

// The browser runs the conversation loop; the server only forwards each turn.
export function useClaudeChat({ game, side, view, playbooks }) {
  const [thread, setThread] = useState(null)
  const [live, setLive] = useState(null) // { text, status } while a turn runs
  const [error, setError] = useState(null)
  const threadRef = useRef(null)
  const abortRef = useRef(null)

  const commit = useCallback((next) => {
    threadRef.current = next
    setThread(next)
    saveChatThread(next)
  }, [])

  useEffect(() => {
    getChatThread().then((t) => {
      threadRef.current = t
      setThread(t)
    })
  }, [])

  const runLoop = useCallback(
    async (signal) => {
      for (;;) {
        setLive({ text: '', status: 'Thinking' })
        const message = await streamTurn(
          threadRef.current.messages,
          (event) =>
            setLive((cur) => {
              if (event.t === 'text') return { ...cur, text: cur.text + event.d, status: null }
              if (event.t === 'note') return { ...cur, status: event.d }
              if (event.t === 'tool') return { ...cur, status: `Using ${event.name.replace(/_/g, ' ')}` }
              return cur
            }),
          signal,
        )

        // A declined or cut-off turn is never added: its tool calls can't run,
        // and an unanswered tool call would break every later request.
        const hasTool = message.content.some((b) => b.type === 'tool_use')
        if (message.stop_reason === 'refusal') {
          setError('Claude declined that turn. Try rewording it.')
          return
        }
        if (message.stop_reason === 'max_tokens' && hasTool) {
          setError('That turn ran out of room mid-tool. Ask for a smaller change.')
          return
        }

        const content = contentForHistory(message.content)
        const withReply = {
          ...threadRef.current,
          messages: [...threadRef.current.messages, { role: 'assistant', content }],
        }
        commit(withReply)
        if (!hasTool) return

        // One at a time, because a sheet change has to be visible to the next call.
        const ctx = await toolContext(game, playbooks)
        const proposals = { ...withReply.proposals }
        const backedUp = { ...withReply.backedUp }
        const results = []
        for (const block of content.filter((b) => b.type === 'tool_use')) {
          const { result, change } = await runTool(block, ctx)
          if (!change) {
            results.push(result)
            continue
          }
          // The Tweaks auto-backup holds the sheet from before Claude's first
          // change in this chat, because it only keeps one row per game.
          if (!backedUp[change.game]) {
            await backupCurrentSheet(change.game, 'Claude chat')
            backedUp[change.game] = true
          }
          const applied = await applyChatChange(change)
          proposals[block.id] = { ...change, ...applied, status: 'applied' }
          ctx.sheet = (await getSheetAssignments()).byGame?.[game]
          results.push({
            ...result,
            content: `Applied ${applied.applied} of ${change.changes.length} changes. ${applied.skipped} no longer fit the sheet.`,
          })
        }
        commit({
          ...withReply,
          proposals,
          backedUp,
          messages: [...withReply.messages, { role: 'user', content: results }],
        })
      }
    },
    [commit, game, playbooks],
  )

  const send = useCallback(
    async (text, attachments = []) => {
      const cur = threadRef.current
      if (!cur || abortRef.current) return
      setError(null)
      const notes = cur.pendingNotes.length ? ` ${cur.pendingNotes.join(' ')}` : ''
      const state = `<app_state>Open: ${GAME_LABEL[game]}, ${side} side, ${view} view.${notes}</app_state>`
      commit({
        ...cur,
        pendingNotes: [],
        messages: [
          ...cur.messages,
          {
            role: 'user',
            content: [
              { type: 'text', text: state },
              ...attachments.flatMap((a) => [
                ...(a.label ? [{ type: 'text', text: a.label }] : []),
                { type: 'image', source: { type: 'base64', media_type: a.media_type, data: a.data } },
              ]),
              { type: 'text', text },
            ],
          },
        ],
      })
      const controller = new AbortController()
      abortRef.current = controller
      try {
        await runLoop(controller.signal)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(`${err.message} Is the chat server still running?`)
        }
      } finally {
        abortRef.current = null
        setLive(null)
      }
    },
    [commit, game, runLoop, side, view],
  )

  const stop = useCallback(() => abortRef.current?.abort(), [])

  // Asks first if the sheet changed since, because Undo restores the whole side.
  const undo = useCallback(
    async (id) => {
      const cur = threadRef.current
      const change = cur.proposals[id]
      if (!change || change.status !== 'applied') return
      if (!(await chatChangeIsCurrent(change))) {
        const ok = window.confirm(
          `The ${change.side} sheet has changed since this. Undo anyway? Edits made after it on that side are lost too.`,
        )
        if (!ok) return
      }
      await undoChatChange(change)
      commit({
        ...cur,
        proposals: { ...cur.proposals, [id]: { ...change, status: 'undone' } },
        pendingNotes: [...cur.pendingNotes, `Kenny undid "${change.summary}".`],
      })
    },
    [commit],
  )

  const reset = useCallback(async () => {
    await clearChatThread()
    const fresh = await getChatThread()
    threadRef.current = fresh
    setThread(fresh)
    setError(null)
  }, [])

  return { thread, live, error, send, stop, undo, reset }
}
