// Add plays to the open section without leaving it. Enter adds and keeps the box
// focused, so several plays go in as fast as you can type them.

import { forwardRef, useState } from 'react'
import { searchQuick } from '../../lib/callmap/quickAdd.js'

const QuickAdd = forwardRef(function QuickAdd(
  { section, side, playbooks, sideAssign, onAdd },
  inputRef,
) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const onSection = new Set(section.plays.map((p) => p.playId))
  const results = searchQuick(playbooks, query, side, sideAssign)
  const typed = query.trim().length >= 2
  // The highlight only lands on plays you can add, so Enter always does something.
  const addable = results.filter((p) => !onSection.has(p.playId))
  const current = addable[Math.min(active, Math.max(addable.length - 1, 0))] ?? null

  const add = (play) => {
    if (!play || onSection.has(play.playId)) return
    onAdd(section.id, play)
    setQuery('')
    setActive(0)
    inputRef.current?.focus()
  }

  const onKeyDown = (e) => {
    const at = addable.indexOf(current)
    if (e.key === 'ArrowDown' && addable.length) {
      e.preventDefault()
      setActive((at + 1) % addable.length)
    } else if (e.key === 'ArrowUp' && addable.length) {
      e.preventDefault()
      setActive((at - 1 + addable.length) % addable.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      add(current)
    } else if (e.key === 'Escape') {
      if (query) setQuery('')
      else e.currentTarget.blur()
    }
  }

  return (
    <div className="quickadd">
      <input
        ref={inputRef}
        className="quickadd__input"
        value={query}
        placeholder={`Add a play to ${section.name}`}
        aria-label={`Search for a play to add to ${section.name}`}
        autoComplete="off"
        spellCheck="false"
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
        }}
        onKeyDown={onKeyDown}
      />
      {typed && (
        <ul className="quickadd__results">
          {results.map((p) => {
            const added = onSection.has(p.playId)
            return (
              <li key={p.playId}>
                <button
                  className={
                    'quickadd__row' + (p === current ? ' quickadd__row--on' : '')
                  }
                  disabled={added}
                  // Keep focus in the box, so the next play can be typed straight away.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => add(p)}
                >
                  <span className={'slot__dot slot__dot--' + p.type} />
                  <span className="quickadd__main">
                    <span className="quickadd__name">{p.name}</span>
                    <span className="quickadd__path">
                      {p.formation}, {p.playbook}
                      {added ? ', already here' : ''}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
          {!results.length && (
            <li className="quickadd__none">No plays match. Check the spelling or try fewer letters.</li>
          )}
        </ul>
      )}
    </div>
  )
})

export default QuickAdd
