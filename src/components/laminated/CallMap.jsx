// The call sheet as a map. Every section name stays in the rail, one section is
// open, and the play you pick stays pinned so a look back from the game lands on
// it with no searching. Formation reads first because that is how you find a
// play in the game's menu. The place is saved per game + side.

import { useEffect, useRef, useState } from 'react'
import {
  afterRemove,
  buildSections,
  resolvePlace,
  stepPlay,
  stepSection,
} from '../../lib/callmap/place.js'
import MyNote from './MyNote'
import QuickAdd from './QuickAdd'

const SWIPE_PX = 48
const UNDO_MS = 8000

function CallMap({
  situations,
  assignments,
  saved,
  paused,
  side,
  playbooks,
  onPlace,
  onBrowse,
  onAdd,
  onRemove,
  onRestore,
  onNote,
}) {
  const sections = buildSections(situations, assignments)
  // Local state answers instantly; the Dexie write only has to survive a reload.
  const [place, setPlace] = useState(saved ?? null)
  const [showEmpty, setShowEmpty] = useState(false)
  const swipeFrom = useRef(null)
  const railRef = useRef(null)
  const addRef = useRef(null)
  const [undo, setUndo] = useState(null)

  const { sectionId, playId } = resolvePlace(sections, place)
  const section = sections.find((s) => s.id === sectionId) ?? null
  const plays = section?.plays ?? []
  const index = plays.findIndex((p) => p.playId === playId)
  const pinned = plays[index] ?? null

  // On a phone the rail scrolls sideways, so keep the open section in view. Set
  // scrollLeft directly because scrollIntoView could also move the page.
  useEffect(() => {
    const rail = railRef.current
    const on = rail?.querySelector('[aria-current]')
    if (!on || rail.scrollWidth <= rail.clientWidth) return
    rail.scrollLeft = on.offsetLeft - rail.offsetLeft - (rail.clientWidth - on.offsetWidth) / 2
  }, [sectionId])

  const go = (next) => {
    setPlace(next)
    onPlace(next)
  }
  const openSection = (id) => go(resolvePlace(sections, { sectionId: id }))
  const movePlay = (delta) => {
    const next = stepPlay(section, playId, delta)
    if (next !== playId) go({ sectionId, playId: next })
  }
  const moveSection = (delta) => {
    const next = stepSection(sections, sectionId, delta)
    if (next !== sectionId) openSection(next)
  }

  // Sheet writes build on the last sheet read. A second one before that read comes
  // back would overwrite the first, so hold it until the new sheet arrives.
  const writing = useRef(false)
  useEffect(() => {
    writing.current = false
  }, [assignments])

  // Removing is instant, with Undo in place of a confirm dialog, so clearing out
  // a section stays quick and a slip costs one key.
  const remove = (play) => {
    if (!section || !play || writing.current) return
    writing.current = true
    const at = plays.findIndex((p) => p.playId === play.playId)
    if (play.playId === playId) go({ sectionId, playId: afterRemove(section, play.playId) })
    onRemove(sectionId, play.playId)
    setUndo({ sectionId, sectionName: section.name, play, at })
  }
  const restore = () => {
    if (!undo || writing.current) return
    writing.current = true
    onRestore(undo.sectionId, undo.play, undo.at)
    go({ sectionId: undo.sectionId, playId: undo.play.playId })
    setUndo(null)
  }

  useEffect(() => {
    if (!undo) return
    const t = setTimeout(() => setUndo(null), UNDO_MS)
    return () => clearTimeout(t)
  }, [undo])

  useEffect(() => {
    const onKey = (e) => {
      if (paused || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return
      const act = {
        ArrowRight: () => movePlay(1),
        ArrowLeft: () => movePlay(-1),
        ArrowDown: () => moveSection(1),
        ArrowUp: () => moveSection(-1),
        a: () => addRef.current?.focus(),
        '/': () => addRef.current?.focus(),
        x: () => remove(pinned),
        Delete: () => remove(pinned),
        Backspace: () => remove(pinned),
        z: restore,
      }[e.key]
      if (!act) return
      e.preventDefault()
      act()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const onTouchEnd = (e) => {
    const from = swipeFrom.current
    swipeFrom.current = null
    if (!from) return
    const t = e.changedTouches[0]
    const dx = t.clientX - from.x
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(t.clientY - from.y)) {
      movePlay(dx < 0 ? 1 : -1)
    }
  }

  // Coverage sections stay listed while empty: they are there to be filled.
  const shownWhenEmpty = (s) => s.coverage || s.id === sectionId
  const hiddenCount = sections.filter((s) => !s.plays.length && !shownWhenEmpty(s)).length
  const railSections = sections.filter(
    (s) => showEmpty || s.plays.length > 0 || shownWhenEmpty(s),
  )
  const coverageCount = railSections.filter((s) => s.coverage).length

  return (
    <div className="sheet-wrap">
      <div className="callmap">
        <nav className="callmap__rail" aria-label="Sections" ref={railRef}>
          {coverageCount > 0 && <div className="callmap__group">Beat the coverage</div>}
          {railSections.map((s, i) => (
            <button
              key={s.id}
              className={
                'callmap__sec' +
                (i === coverageCount && coverageCount > 0 ? ' callmap__sec--after' : '') +
                (s.id === sectionId ? ' callmap__sec--on' : '') +
                (s.plays.length ? '' : ' callmap__sec--empty')
              }
              aria-current={s.id === sectionId ? 'true' : undefined}
              onClick={() => openSection(s.id)}
            >
              <span className="callmap__key" style={{ background: s.color }} />
              <span className="callmap__sec-name">{s.name}</span>
              <span className="callmap__sec-n">{s.plays.length}</span>
            </button>
          ))}
          {hiddenCount > 0 && (
            <button
              className="callmap__more"
              onClick={() => setShowEmpty((v) => !v)}
            >
              {showEmpty ? 'Hide empty sections' : `Show ${hiddenCount} empty sections`}
            </button>
          )}
        </nav>

        <section className="callmap__pin" aria-live="polite">
          {pinned ? (
            <div
              className="callmap__card"
              onTouchStart={(e) => {
                const t = e.touches[0]
                swipeFrom.current = { x: t.clientX, y: t.clientY }
              }}
              onTouchEnd={onTouchEnd}
            >
              <div className="callmap__where">
                {section.name}, play {index + 1} of {plays.length}
              </div>
              <div className="callmap__book">{pinned.playbook}</div>
              <div className="callmap__formation">{pinned.formation}</div>
              <div className="callmap__name">
                <span className={'slot__dot slot__dot--' + pinned.type} />
                {pinned.name}
              </div>
              {pinned.note && <p className="callmap__note">{pinned.note}</p>}
              <div className="callmap__mynote" key={pinned.playId}>
                <MyNote
                  play={pinned}
                  onSave={(note) => onNote(sectionId, pinned.playId, note)}
                />
              </div>
            </div>
          ) : (
            <div className="callmap__card callmap__card--empty">
              <div className="callmap__formation">{section?.name}</div>
              <p className="callmap__note">No plays in this section yet.</p>
              <button className="callmap__add" onClick={() => addRef.current?.focus()}>
                Add a play
              </button>
            </div>
          )}
          {pinned && (
            <div className="callmap__controls">
              <button onClick={() => movePlay(-1)} disabled={index <= 0}>
                Previous
              </button>
              <button
                className="callmap__next"
                onClick={() => movePlay(1)}
                disabled={index >= plays.length - 1}
              >
                Next
              </button>
            </div>
          )}
        </section>

        {section && (
          <section className="callmap__list" aria-label={section.name}>
            <div className="callmap__list-hd">
              <div>
                <div className="callmap__list-name">{section.name}</div>
                <div className="callmap__list-sub">{section.sub}</div>
              </div>
              <button className="callmap__browse" onClick={() => onBrowse(sectionId)}>
                Browse
              </button>
            </div>
            <QuickAdd
              key={sectionId}
              ref={addRef}
              section={section}
              side={side}
              playbooks={playbooks}
              sideAssign={assignments}
              onAdd={onAdd}
            />
            <ol className="callmap__plays">
              {plays.map((p, i) => (
                <li key={p.playId} className="callmap__row">
                  <button
                    className={
                      'callmap__play' + (p.playId === playId ? ' callmap__play--on' : '')
                    }
                    aria-pressed={p.playId === playId}
                    onClick={() => go({ sectionId, playId: p.playId })}
                  >
                    <span className="callmap__play-n">{i + 1}</span>
                    <span className={'slot__dot slot__dot--' + p.type} />
                    <span className="callmap__play-main">
                      <span className="callmap__play-form">{p.formation}</span>
                      <span className="callmap__play-name">{p.name}</span>
                    </span>
                  </button>
                  <button
                    className="callmap__x"
                    title="Remove"
                    aria-label={`Remove ${p.name}`}
                    onClick={() => remove(p)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>
            {undo && (
              <div className="callmap__undo" role="status">
                <span>
                  Removed {undo.play.name} from {undo.sectionName}
                </span>
                <button onClick={restore}>Undo</button>
              </div>
            )}
            <p className="callmap__keys">A adds, X removes the pinned play, Z undoes.</p>
          </section>
        )}
      </div>
    </div>
  )
}

export default CallMap
