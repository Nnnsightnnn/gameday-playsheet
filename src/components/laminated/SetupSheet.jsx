// Favorites-setup view. CFB 27 sorts favorites by recency — the LAST play
// favorited lands on TOP of the in-game menu. So the default mode here is a
// numbered favoriting sequence: the sheet's priority order reversed. Favorite
// in checklist order (1, 2, 3…) and the finished menu mirrors the call sheet,
// slot 1 of block 1 on top. A second mode groups by playbook → formation for
// finding plays while navigating the add menu. Checks persist per game + side.

import { useState } from 'react'

// Flatten in sheet priority order: situations top-to-bottom, slots in order.
// Dedupe by playId — a play keeps its highest (first) occurrence.
function flattenBySide(situations, sideAssign) {
  const byId = new Map()
  for (const s of situations) {
    for (const p of sideAssign[s.id] || []) {
      const cur = byId.get(p.playId)
      if (cur) {
        if (!cur.situations.some((x) => x.id === s.id))
          cur.situations.push({ id: s.id, name: s.name, color: s.color })
      } else {
        byId.set(p.playId, {
          play: p,
          situations: [{ id: s.id, name: s.name, color: s.color }],
        })
      }
    }
  }
  return [...byId.values()]
}

// Order formations to match the in-game menu: playbooks in catalog order,
// formations in each book's formationGroups order. Unknowns sort last, alpha.
function groupForSetup(entries, playbooks) {
  const pbIndex = new Map(playbooks.map((pb, i) => [pb.name, i]))
  const formIndex = new Map()
  for (const pb of playbooks) {
    let i = 0
    for (const g of pb.formationGroups || [])
      for (const f of g.formations || [])
        formIndex.set(pb.name + '|' + f.name, i++)
  }

  const books = new Map()
  for (const e of entries) {
    const pbName = e.play.playbook || 'Unknown book'
    if (!books.has(pbName)) books.set(pbName, new Map())
    const forms = books.get(pbName)
    const fName = e.play.formation || 'Unknown formation'
    if (!forms.has(fName)) forms.set(fName, [])
    forms.get(fName).push(e)
  }

  const orderIdx = (map, key) => (map.has(key) ? map.get(key) : Infinity)
  return [...books.entries()]
    .sort(
      (a, b) =>
        orderIdx(pbIndex, a[0]) - orderIdx(pbIndex, b[0]) ||
        a[0].localeCompare(b[0]),
    )
    .map(([pbName, forms]) => ({
      playbook: pbName,
      formations: [...forms.entries()]
        .sort(
          (a, b) =>
            orderIdx(formIndex, pbName + '|' + a[0]) -
              orderIdx(formIndex, pbName + '|' + b[0]) ||
            a[0].localeCompare(b[0]),
        )
        .map(([fName, plays]) => ({ formation: fName, plays })),
    }))
}

function SetupRow({ entry, checked, seq, next, showPath, onToggle }) {
  const { play, situations } = entry
  return (
    <button
      className={
        'setup-row' +
        (checked ? ' setup-row--done' : '') +
        (next ? ' setup-row--next' : '')
      }
      onClick={() => onToggle(play.playId)}
    >
      {seq != null && <span className="setup-seq">{seq}</span>}
      <span className={'setup-check' + (checked ? ' setup-check--on' : '')}>
        {checked ? '✓' : ''}
      </span>
      <span className={'slot__dot slot__dot--' + play.type} />
      <span className="setup-row__main">
        <span className="setup-row__name">{play.name}</span>
        {showPath && (
          <span className="setup-row__path">
            {play.playbook} · {play.formation}
          </span>
        )}
        <span className="setup-row__sits">
          {situations.map((s) => (
            <span key={s.id} className="setup-sit" title={s.name}>
              <span className="tdot" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}

function SetupSheet({
  situations,
  assignments,
  playbooks,
  checks,
  gloss,
  onToggle,
  onClear,
}) {
  const [mode, setMode] = useState('sequence')

  const entries = flattenBySide(situations, assignments)
  const groups = groupForSetup(entries, playbooks)
  const total = entries.length
  const done = entries.filter((e) => checks[e.play.playId]).length

  // Favoriting order: reverse of sheet priority, so the last play you
  // favorite (your #1 call) ends up on top of the recency-sorted menu.
  const sequence = [...entries].reverse()
  const nextId = sequence.find((e) => !checks[e.play.playId])?.play.playId

  return (
    <div className="sheet-wrap">
      <div className={'sheet' + (gloss ? '' : ' no-gloss')}>
        <div className="setup-hd">
          <div className="setup-hd__titles">
            <div className="setup-hd__name">Favorites Setup</div>
            <div className="setup-hd__sub">
              {mode === 'sequence'
                ? 'CFB 27 puts the last play favorited on top. Favorite in this exact order and the finished menu mirrors your call sheet.'
                : 'Grouped like the playbook add-menu — use this to find where each play lives.'}
            </div>
            <div className="setup-modes">
              <button
                className={
                  'setup-mode' + (mode === 'sequence' ? ' setup-mode--on' : '')
                }
                onClick={() => setMode('sequence')}
              >
                Favoriting Order
              </button>
              <button
                className={
                  'setup-mode' + (mode === 'formation' ? ' setup-mode--on' : '')
                }
                onClick={() => setMode('formation')}
              >
                By Formation
              </button>
            </div>
          </div>
          <div className="setup-hd__right">
            <span
              className={
                'setup-progress' + (total && done === total ? ' setup-progress--done' : '')
              }
            >
              {done} / {total} added
            </span>
            <button
              className="setup-reset"
              onClick={() => {
                if (window.confirm('Clear all checkmarks for this side?')) onClear()
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {!total && (
          <div className="dempty" style={{ color: 'var(--ink-faint)' }}>
            Nothing on the sheet yet — fill the call sheet first.
          </div>
        )}

        {mode === 'sequence' && total > 0 && (
          <div className="setup-seq-list">
            {sequence.map((e, i) => (
              <SetupRow
                key={e.play.playId}
                entry={e}
                seq={i + 1}
                next={e.play.playId === nextId}
                showPath
                checked={!!checks[e.play.playId]}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}

        {mode === 'formation' && groups.map((book) => (
          <section key={book.playbook} className="setup-book">
            <div className="setup-book__name">{book.playbook}</div>
            <div className="setup-grid">
              {book.formations.map((f) => {
                const fDone = f.plays.filter((e) => checks[e.play.playId]).length
                return (
                  <div
                    key={f.formation}
                    className={
                      'setup-form' +
                      (fDone === f.plays.length ? ' setup-form--done' : '')
                    }
                  >
                    <div className="setup-form__hd">
                      <span className="setup-form__name">{f.formation}</span>
                      <span className="setup-form__count">
                        {fDone}/{f.plays.length}
                      </span>
                    </div>
                    <div className="setup-form__body">
                      {f.plays.map((e) => (
                        <SetupRow
                          key={e.play.playId}
                          entry={e}
                          checked={!!checks[e.play.playId]}
                          onToggle={onToggle}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default SetupSheet
