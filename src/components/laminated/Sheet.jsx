// The laminated sheet — color-coded situation blocks with empty/filled slots.

import { useEffect, useRef, useState } from 'react'

// Kenny's own note on a play — click to edit, Enter/blur saves, Escape cancels.
// Lives alongside (not instead of) the plan's coaching note.
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

function Slot({ index, play, color, onAdd, onRemove, onNote }) {
  if (!play) {
    return (
      <div
        className="slot slot--empty"
        style={{ '--block-c': color }}
        onClick={onAdd}
      >
        + Add play
      </div>
    )
  }
  return (
    <div className="slot slot--filled">
      <span className="slot__num">{index + 1}</span>
      <span className={'slot__dot slot__dot--' + play.type} />
      <div className="slot__main">
        <div className="slot__name">{play.name}</div>
        <div className="slot__form">{play.formation}</div>
        {play.note && <div className="slot__note">{play.note}</div>}
        <MyNote play={play} onSave={onNote} />
      </div>
      <button
        className="slot__x"
        title="Remove"
        aria-label={`Remove ${play.name}`}
        onClick={onRemove}
      >
        ×
      </button>
    </div>
  )
}

function Block({ situation, plays, live, slotCount, onAdd, onRemove, onNote }) {
  const rows = Math.max(slotCount, plays.length)
  return (
    <section
      className={'block' + (live ? ' block--live' : '')}
      style={{ '--block-c': situation.color }}
    >
      <div className="block__hd">
        <div className="block__titles">
          <div className="block__name">{situation.name}</div>
          <div className="block__sub">{situation.sub}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {live && <span className="block__live-dot">LIVE</span>}
          <button
            className="block__add"
            title="Add play"
            onClick={() => onAdd(situation.id)}
          >
            +
          </button>
        </div>
      </div>
      <div className="block__body">
        {Array.from({ length: rows }).map((_, i) => (
          <Slot
            key={i}
            index={i}
            play={plays[i]}
            color={situation.color}
            onAdd={() => onAdd(situation.id)}
            onRemove={() => onRemove(situation.id, plays[i].playId)}
            onNote={(note) => onNote(situation.id, plays[i].playId, note)}
          />
        ))}
      </div>
    </section>
  )
}

function Sheet({
  situations,
  assignments,
  liveIds,
  slotCount,
  gloss,
  onAdd,
  onRemove,
  onNote,
}) {
  return (
    <div className="sheet-wrap">
      <div className={'sheet' + (gloss ? '' : ' no-gloss')}>
        <div className="sheet__grid">
          {situations.map((s) => (
            <Block
              key={s.id}
              situation={s}
              plays={assignments[s.id] || []}
              live={liveIds.has(s.id)}
              slotCount={slotCount}
              onAdd={onAdd}
              onRemove={onRemove}
              onNote={onNote}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sheet
