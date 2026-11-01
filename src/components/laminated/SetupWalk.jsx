// One play at a time, in favoriting order. Built so a trip back from the game
// needs no searching: the page already shows the next play and one press moves
// on. Position comes from the setup checks, so it is saved per game + side.

import { useEffect, useRef } from 'react'
import { walkPosition } from '../../lib/setup/walk.js'

function SetupWalk({ sequence, checks, onToggle }) {
  const walk = walkPosition(sequence, checks)
  const { current, previous, upcoming, index, total } = walk

  // A check takes a moment to come back through useLiveQuery. A second press
  // before then would toggle the same play again and silently undo the first.
  const pending = useRef(false)
  useEffect(() => {
    pending.current = false
  }, [index])

  const toggle = (entry) => {
    if (!entry || pending.current) return
    pending.current = true
    Promise.resolve(onToggle(entry.play.playId)).catch(() => {
      pending.current = false
    })
  }
  const next = () => toggle(current)
  const back = () => toggle(previous)

  // Arrows only: Space or Enter would also click a focused button and fire twice.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="walk">
      <div
        className="walk__ruler"
        aria-hidden="true"
        style={{ '--n': total, '--i': index }}
      >
        <span className="walk__ruler-fill" />
      </div>
      {current ? (
        <div className="walk__card" aria-live="polite">
          <div className="walk__count">
            Play {index + 1} of {total}
          </div>
          <div className="walk__path">
            <span>{current.play.playbook}</span>
            <span className="walk__formation">{current.play.formation}</span>
          </div>
          <div className="walk__name">
            <span className={'slot__dot slot__dot--' + current.play.type} />
            {current.play.name}
          </div>
        </div>
      ) : (
        <div className="walk__card walk__card--done" aria-live="polite">
          <div className="walk__name">All {total} added</div>
        </div>
      )}

      <div className="walk__controls">
        <button className="walk__back" onClick={back} disabled={!previous}>
          Back
        </button>
        <button className="walk__next" onClick={next} disabled={!current}>
          Next
        </button>
      </div>

      {upcoming.length > 0 && (
        <ol className="walk__upcoming" aria-label="Coming up">
          {upcoming.map((e) => (
            <li key={e.play.playId}>
              <span className="walk__upcoming-name">{e.play.name}</span>
              <span className="walk__upcoming-path">{e.play.formation}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default SetupWalk
