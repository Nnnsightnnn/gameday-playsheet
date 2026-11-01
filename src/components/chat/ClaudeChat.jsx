// The Claude panel. Appears only where the local chat server answers, so the
// deployed site shows nothing to anyone without that server on their machine.

import { useEffect, useRef, useState } from 'react'
import { useClaudeChat } from '../../hooks/useClaudeChat'
import { chatOptedIn, serverIsUp } from '../../lib/chat/client'

const ACTION_LABEL = { add: 'Add', remove: 'Remove', move: 'Move', set_note: 'Note' }

function ChangeCard({ change, canUndo, onUndo }) {
  return (
    <div className="chat__card">
      <div className="chat__cardhd">
        {change.summary}
        <span>{change.game === 'cfb' ? 'CFB' : 'Madden'} · {change.side}</span>
      </div>
      <ul className="chat__changes">
        {change.changes.map((c, i) => (
          <li key={i}>
            <b>{ACTION_LABEL[c.action]}</b> {c.play.name}
            <span> {c.play.formation} · {c.situationName}</span>
            {c.note && <em>{c.note}</em>}
          </li>
        ))}
      </ul>
      <div className="chat__cardbtns">
        <span className="chat__cardstate">
          {change.status === 'applied' && (change.skipped ? `Done. ${change.skipped} no longer fit.` : 'Done.')}
          {change.status === 'undone' && 'Undone.'}
          {change.status !== 'applied' && change.status !== 'undone' && 'Not applied.'}
        </span>
        {canUndo && <button className="chat__btn" onClick={onUndo}>Undo</button>}
      </div>
    </div>
  )
}

function Message({ message, proposals, undoableId, onUndo }) {
  const blocks = typeof message.content === 'string'
    ? [{ type: 'text', text: message.content }]
    : message.content
  if (message.role === 'user') {
    // A person's message is [app_state, text]; tool results have no text to show.
    const said = blocks.filter((b) => b.type === 'text').at(-1)
    return said ? <div className="chat__msg chat__msg--me">{said.text}</div> : null
  }
  return blocks.map((b, i) => {
    if (b.type === 'text' && b.text.trim()) {
      return <div className="chat__msg" key={i}>{b.text}</div>
    }
    if (b.type === 'tool_use' && proposals[b.id]) {
      return (
        <ChangeCard
          key={i}
          change={proposals[b.id]}
          canUndo={b.id === undoableId}
          onUndo={() => onUndo(b.id)}
        />
      )
    }
    return null
  })
}

function Panel({ game, side, view, playbooks, onClose }) {
  const { thread, live, error, send, stop, undo, reset } = useClaudeChat({ game, side, view, playbooks })
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)
  const messages = thread?.messages ?? []
  // Newest change only: undoing in order means each one restores a known sheet.
  const undoableId = live
    ? null
    : Object.keys(thread?.proposals ?? {}).filter((id) => thread.proposals[id].status === 'applied').at(-1)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, live?.text, live?.status])

  const submit = () => {
    const text = draft.trim()
    if (!text || live) return
    setDraft('')
    send(text)
  }

  const newChat = () => {
    if (window.confirm('Start a new chat? This conversation is deleted. Your sheet is not touched.')) reset()
  }

  return (
    <aside className="chat" aria-label="Claude">
      <header className="chat__hd">
        <b>Claude</b>
        <span>{game === 'cfb' ? 'CFB 27' : 'Madden 27'} · {side}</span>
        <button className="chat__link" onClick={newChat} disabled={Boolean(live)}>New chat</button>
        <button className="chat__x" onClick={onClose} aria-label="Close">✕</button>
      </header>

      <div className="chat__log">
        {thread && messages.length === 0 && (
          <div className="chat__empty">
            Build the whole game plan together. Claude can see your sheet, every playbook, the meta
            research, packages, scouting, personnel and debriefs, and can change the sheet when you
            ask. Every sheet change gets an Undo.
          </div>
        )}
        {messages.map((m, i) => (
          <Message
            key={i}
            message={m}
            proposals={thread.proposals}
            undoableId={undoableId}
            onUndo={undo}
          />
        ))}
        {live?.text && <div className="chat__msg">{live.text}</div>}
        {live?.status && <div className="chat__status">{live.status}…</div>}
        {error && <div className="chat__error">{error}</div>}
        <div ref={endRef} />
      </div>

      <div className="chat__compose">
        <textarea
          rows={3}
          value={draft}
          placeholder="What are we working on?"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
        />
        {live ? (
          <button className="chat__btn" onClick={stop}>Stop</button>
        ) : (
          <button className="chat__btn chat__btn--on" onClick={submit} disabled={!draft.trim()}>Send</button>
        )}
      </div>
    </aside>
  )
}

export default function ClaudeChat(props) {
  const [available, setAvailable] = useState(false)
  const [open, setOpen] = useState(false)

  // Re-checked on focus so starting the server shows the button without a reload.
  useEffect(() => {
    if (!chatOptedIn()) return undefined
    let alive = true
    const check = () => serverIsUp().then((up) => alive && setAvailable(up))
    check()
    window.addEventListener('focus', check)
    return () => {
      alive = false
      window.removeEventListener('focus', check)
    }
  }, [])

  if (!available && !open) return null
  if (!open) {
    return (
      <button className="chat__fab" title="Chat with Claude" onClick={() => setOpen(true)}>
        Claude
      </button>
    )
  }
  return <Panel {...props} onClose={() => setOpen(false)} />
}
