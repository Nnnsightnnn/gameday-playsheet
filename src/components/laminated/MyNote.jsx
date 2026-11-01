// Kenny's own note on a play — click to edit, Enter/blur saves, Escape cancels.
// Lives alongside (not instead of) the plan's coaching note.

import { useEffect, useRef, useState } from 'react'

function MyNote({ play, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const start = () => {
    setDraft(play.myNote || '')
    setEditing(true)
  }
  const commit = () => {
    setEditing(false)
    const next = draft.trim()
    if (next !== (play.myNote || '')) onSave(next)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="slot__mynote-input"
        value={draft}
        maxLength={140}
        placeholder="Your note…"
        aria-label={`Note for ${play.name}`}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape') setEditing(false)
        }}
      />
    )
  }
  if (play.myNote) {
    return (
      <div className="slot__mynote" title="Edit your note" onClick={start}>
        {play.myNote}
      </div>
    )
  }
  return (
    <button className="slot__addnote" onClick={start}>
      + note
    </button>
  )
}

export default MyNote
