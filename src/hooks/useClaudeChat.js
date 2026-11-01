import { useCallback, useEffect, useRef, useState } from 'react'
import { GAME_PLANS } from '../data/gameplans'
import { packagesForGame } from '../data/packages'
import {
  applyChatProposal,
  clearChatThread,
  getChatThread,
  getGameDebriefs,
  getMacroArsenal,
  getSheetAssignments,
  saveChatThread,
} from '../lib/db'
import { streamTurn } from '../lib/chat/client'
import { contentForHistory, runTool } from '../lib/chat/tools'

const GAME_LABEL = { madden: 'Madden 27', cfb: 'CFB 27' }
const asset = (path) => import.meta.env.BASE_URL + path

async function loadGuide(file) {
  const r = await fetch(asset(file))
  if (!r.ok) throw new Error(`Could not load ${file}.`)
  const doc = new DOMParser().parseFromString(await r.text(), 'text/html')
  doc.querySelectorAll('style, script').forEach((el) => el.remove())
  return doc.body.textContent.replace(/\s+/g, ' ').trim()
}

async function loadTrends(game) {
  const r = await fetch(asset('data/trends.json'))
  if (!r.ok) throw new Error('Could not load the trends digest.')
  const data = await r.json()
  return { updatedAt: data.updatedAt, ...data.games[game] }
}

// Read fresh for every batch of tools, so Claude sees edits Kenny just made.
async function toolContext(game, playbooks) {
  const [row, debriefs, arsenal] = await Promise.all([
    getSheetAssignments(),
    getGameDebriefs(),
    getMacroArsenal(game),
  ])
  return {
    game,
    playbooks,
    debriefs,
    arsenal,
    sheet: row.byGame?.[game],
    plans: GAME_PLANS,
    packages: packagesForGame(game),
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

        const ctx = await toolContext(game, playbooks)
        const outcomes = await Promise.all(
          content.filter((b) => b.type === 'tool_use').map((b) => runTool(b, ctx)),
        )
        const proposals = { ...withReply.proposals }
        for (const o of outcomes) {
          if (o.proposal) proposals[o.result.tool_use_id] = o.proposal
        }
        commit({
          ...withReply,
          proposals,
          messages: [
            ...withReply.messages,
            { role: 'user', content: outcomes.map((o) => o.result) },
          ],
        })
      }
    },
    [commit, game, playbooks],
  )

  const send = useCallback(
    async (text) => {
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
          { role: 'user', content: [{ type: 'text', text: state }, { type: 'text', text }] },
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

  const decide = useCallback(
    async (id, apply) => {
      const cur = threadRef.current
      const proposal = cur.proposals[id]
      if (!proposal || proposal.status !== 'open') return
      const outcome = apply ? await applyChatProposal(proposal) : null
      const status = apply ? 'applied' : 'skipped'
      const note = apply
        ? `Kenny applied "${proposal.summary}" (${outcome.applied} changes, ${outcome.skipped} no longer fit).`
        : `Kenny skipped "${proposal.summary}".`
      commit({
        ...cur,
        proposals: { ...cur.proposals, [id]: { ...proposal, status, outcome } },
        pendingNotes: [...cur.pendingNotes, note],
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

  return { thread, live, error, send, stop, decide, reset }
}
