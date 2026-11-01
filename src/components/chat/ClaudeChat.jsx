// The Claude panel. Appears only where the local chat server answers, so the
// deployed site shows nothing to anyone without that server on their machine.

import { useEffect, useRef, useState } from 'react'
import { useClaudeChat } from '../../hooks/useClaudeChat'
import { chatOptedIn, serverIsUp } from '../../lib/chat/client'

const ACTION_LABEL = { add: 'Add', remove: 'Remove', set_note: 'Note' }

function ProposalCard({ proposal, onDecide }) {
  return (
    <div className="chat__card">
      <div className="chat__cardhd">
        {proposal.summary}
        <span>{proposal.game === 'cfb' ? 'CFB' : 'Madden'} · {proposal.side}</span>
      </div>
      <ul className="chat__changes">
        {proposal.changes.map((c, i) => (
          <li key={i}>
            <b>{ACTION_LABEL[c.action]}</b> {c.play.name}
            <span> {c.play.formation} · {c.situationName}</span>
            {c.note && <em>{c.note}</em>}
          </li>
        ))}
      </ul>
      {proposal.status === 'open' ? (
        <div className="chat__cardbtns">
          <button className="chat__btn chat__btn--on" onClick={() => onDecide(true)}>Apply</button>
          <button className="chat__btn" onClick={() => onDecide(false)}>Skip</button>
        </div>
      ) : (
        <div className="chat__cardstate">
          {proposal.status === 'applied'
            ? `Applied. Undo by loading the auto-backup in Tweaks.${proposal.outcome?.skipped ? ` ${proposal.outcome.skipped} no longer fit.` : ''}`
            : 'Skipped.'}
        </div>
      )}
    </div>
  )
}

function Message({ message, proposals, onDecide }) {
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
        <ProposalCard
          key={i}
          proposal={proposals[b.id]}
          onDecide={(apply) => onDecide(b.id, apply)}
        />
      )
    }
    return null
  })
}

function Panel({ game, side, view, playbooks, onClose }) {
  const { thread, live, error, send, stop, decide, reset } = useClaudeChat({ game, side, view, playbooks })
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)
  const messages = thread?.messages ?? []

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
            Build the call sheet together. Claude can read your sheet, debriefs, plans, packages
            and the play catalog. Changes come back as a card you apply or skip.
          </div>
        )}
        {messages.map((m, i) => (
          <Message
            key={i}
            message={m}
            proposals={thread.proposals}
            onDecide={decide}
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
