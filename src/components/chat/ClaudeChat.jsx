// The Claude panel. Appears only where the local chat server answers, so the
// deployed site shows nothing to anyone without that server on their machine.

import { useEffect, useRef, useState } from 'react'
import { useClaudeChat } from '../../hooks/useClaudeChat'
import { chatOptedIn, serverIsUp } from '../../lib/chat/client'
import { filesToAttachments } from '../../lib/chat/media'

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

function Thumbs({ images }) {
  if (!images.length) return null
  return (
    <div className="chat__thumbs">
      {images.map((b, i) => (
        <img key={i} src={`data:${b.source.media_type};base64,${b.source.data}`} alt="" />
      ))}
    </div>
  )
}

function Message({ message, proposals, undoableId, onUndo }) {
  const blocks = typeof message.content === 'string'
    ? [{ type: 'text', text: message.content }]
    : message.content
  if (message.role === 'user') {
    // A person's message ends in their text. Tool results have none, but play art
    // Claude looked at is shown too, so you both see the same diagram.
    const said = blocks.filter((b) => b.type === 'text').at(-1)
    const images = [
      ...blocks.filter((b) => b.type === 'image'),
      ...blocks.flatMap((b) =>
        b.type === 'tool_result' && Array.isArray(b.content) ? b.content.filter((c) => c.type === 'image') : [],
      ),
    ]
    return (
      <>
        <Thumbs images={images} />
        {said && <div className="chat__msg chat__msg--me">{said.text}</div>}
      </>
    )
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
  const [attachments, setAttachments] = useState([])
  const [attachError, setAttachError] = useState(null)
  const [reading, setReading] = useState(false)
  const fileRef = useRef(null)
  const endRef = useRef(null)
  const messages = thread?.messages ?? []
  // Newest change only: undoing in order means each one restores a known sheet.
  const undoableId = live
    ? null
    : Object.keys(thread?.proposals ?? {}).filter((id) => thread.proposals[id].status === 'applied').at(-1)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, live?.text, live?.status])

  const addFiles = async (files) => {
    if (!files.length) return
    setAttachError(null)
    setReading(true)
    try {
      const added = await filesToAttachments(files)
      setAttachments((cur) => [...cur, ...added])
    } catch (err) {
      setAttachError(err.message)
    } finally {
      setReading(false)
    }
  }

  const canSend = (draft.trim() || attachments.length > 0) && !reading

  const submit = () => {
    if (!canSend || live) return
    const text = draft.trim() || 'What do you see here?'
    setDraft('')
    setAttachments([])
    send(text, attachments)
  }

  const newChat = () => {
    if (window.confirm('Start a new chat? This conversation is deleted. Your sheet is not touched.')) reset()
  }

  return (
    <aside
      className="chat"
      aria-label="Claude"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        addFiles([...e.dataTransfer.files])
      }}
    >
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
            ask. Every sheet change gets an Undo. Paste images or drop clips from your games.
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

      {(attachments.length > 0 || reading || attachError) && (
        <div className="chat__tray">
          {attachments.map((a, i) => (
            <button
              key={i}
              className="chat__tray-item"
              title={`Remove ${a.label || a.name}`}
              onClick={() => setAttachments((cur) => cur.filter((_, j) => j !== i))}
            >
              <img src={`data:${a.media_type};base64,${a.data}`} alt={a.label || a.name} />
            </button>
          ))}
          {reading && <span className="chat__status">Reading…</span>}
          {attachError && <span className="chat__traynote">{attachError}</span>}
        </div>
      )}
      <div className="chat__compose">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles([...e.target.files])
            e.target.value = ''
          }}
        />
        <button className="chat__btn chat__attach" title="Attach images or a clip" onClick={() => fileRef.current?.click()}>+</button>
        <textarea
          rows={3}
          value={draft}
          placeholder="What are we working on?"
          onChange={(e) => setDraft(e.target.value)}
          onPaste={(e) => {
            const files = [...e.clipboardData.files]
            if (files.length) {
              e.preventDefault()
              addFiles(files)
            }
          }}
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
          <button className="chat__btn chat__btn--on" onClick={submit} disabled={!canSend}>Send</button>
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
