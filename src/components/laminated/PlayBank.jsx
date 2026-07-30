// Sliding play-bank drawer.
// Drill down playbook → formation group → formation → plays, or search.
// Tap a play to drop it into the active situation block.

import { useEffect, useRef, useState } from 'react'

function playbooksFor(playbooks, side, category) {
  return playbooks.filter((pb) => pb.type === side && pb.category === category)
}

function searchPlays(playbooks, query, side, limit = 40) {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const out = []
  for (const pb of playbooks) {
    if (pb.type !== side) continue
    for (const g of pb.formationGroups || []) {
      for (const f of g.formations || []) {
        for (const p of f.plays || []) {
          if (p.name.toLowerCase().includes(q)) {
            out.push({
              ...p,
              playbook: pb.name,
              formationGroup: g.name,
              formation: f.name,
            })
            if (out.length >= limit) return out
          }
        }
      }
    }
  }
  return out
}

function PlayRows({ plays, assignedIds, onAdd, empty }) {
  if (!plays.length) return <div className="dempty">{empty}</div>
  return (
    <div>
      {plays.map(({ play, path }) => {
        const added = assignedIds.includes(play.id)
        return (
          <div
            key={play.id + '|' + path.formation}
            className={'prow' + (added ? ' prow--added' : '')}
            onClick={() => !added && onAdd(play, path)}
          >
            <span className={'prow__type prow__type--' + play.type}>
              {play.type}
            </span>
            <div className="prow__main">
              <div className="prow__name">{play.name}</div>
              <div className="prow__path">
                {path.playbook} · {path.formation}
              </div>
            </div>
            <button
              className="prow__add"
              onClick={(e) => {
                e.stopPropagation()
                if (!added) onAdd(play, path)
              }}
            >
              {added ? '✓' : '+'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

const GAME_LABELS = { madden: 'Madden 26', cfb: 'CFB 27' }

function PlayBank({
  open,
  side,
  game,
  setGame,
  playbooks,
  loading,
  situations,
  targetId,
  setTargetId,
  assignedIds,
  onAdd,
  onClose,
}) {
  // Drill-down state. Parent passes key={side} so it remounts on side flip,
  // which resets these without triggering set-state-in-effect.
  const [category, setCategory] = useState('team')
  const [pbId, setPbId] = useState(null)
  const [groupName, setGroupName] = useState(null)
  const [formName, setFormName] = useState(null)
  const [query, setQuery] = useState('')

  // Modal-dialog lifecycle: ESC to close, return focus to the opener
  const returnFocusRef = useRef(null)
  useEffect(() => {
    if (!open) return
    returnFocusRef.current = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      returnFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  const reset = () => {
    setPbId(null)
    setGroupName(null)
    setFormName(null)
  }

  const pb = pbId ? playbooks.find((p) => p.id === pbId) : null
  const groups = pb?.formationGroups || []
  const group = groups.find((g) => g.name === groupName)
  const formations = group?.formations || []
  const formation = formations.find((f) => f.name === formName)
  const plays = formation?.plays || []

  const target = situations.find((s) => s.id === targetId)
  const searching = query.trim().length >= 2
  const results = searching ? searchPlays(playbooks, query, side) : []

  const handleAdd = (play, path) => {
    onAdd({
      playId: play.id,
      name: play.name,
      type: play.type,
      formation: path.formation,
      playbook: path.playbook,
    })
  }

  return (
    <>
      <div
        className={'scrim' + (open ? ' scrim--on' : '')}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={'drawer' + (open ? ' drawer--on' : '')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="play-bank-title"
        {...(open ? {} : { 'aria-hidden': true })}
      >
        <div className="drawer__hd">
          <div className="drawer__top">
            <span id="play-bank-title" className="drawer__kicker">
              {side} · Play Bank
            </span>
            <button
              className="drawer__close"
              onClick={onClose}
              aria-label="Close play bank"
            >
              ×
            </button>
          </div>
          <div className="drawer__target">
            <span className="tdot" style={{ background: target?.color }} />
            {target?.name || 'Select block'}
          </div>
          <select
            className="target-pick"
            value={targetId || ''}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {situations.map((s) => (
              <option key={s.id} value={s.id}>
                Filling → {s.name} ({s.sub})
              </option>
            ))}
          </select>
        </div>

        <div className="search">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6f6b56"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            placeholder={'Search ' + side + ' plays…'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="drawer__close"
              style={{ width: 22, height: 22, fontSize: 14 }}
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {!searching && (
          <div className="crumbs">
            <button onClick={reset}>{side}</button>
            {pb && (
              <>
                <span className="sep">/</span>
                <button
                  onClick={() => {
                    setGroupName(null)
                    setFormName(null)
                  }}
                >
                  {pb.name}
                </button>
              </>
            )}
            {group && (
              <>
                <span className="sep">/</span>
                <button onClick={() => setFormName(null)}>{group.name}</button>
              </>
            )}
            {formation && (
              <>
                <span className="sep">/</span>
                <span className="cur">{formation.name}</span>
              </>
            )}
          </div>
        )}

        <div className="dlist">
          {loading ? (
            <div className="dloading">Loading playbooks…</div>
          ) : searching ? (
            <PlayRows
              plays={results.map((r) => ({
                play: r,
                path: { formation: r.formation, playbook: r.playbook },
              }))}
              assignedIds={assignedIds}
              onAdd={handleAdd}
              empty={'No plays match "' + query + '"'}
            />
          ) : !pb ? (
            <>
              <div className="cat-toggle">
                {['madden', 'cfb'].map((g) => (
                  <button
                    key={g}
                    className={'cat-btn' + (game === g ? ' cat-btn--on' : '')}
                    onClick={() => setGame(g)}
                  >
                    {GAME_LABELS[g]}
                  </button>
                ))}
              </div>
              <div className="cat-toggle">
                {['team', 'alternate'].map((c) => (
                  <button
                    key={c}
                    className={'cat-btn' + (category === c ? ' cat-btn--on' : '')}
                    onClick={() => setCategory(c)}
                  >
                    {/* CFB 27 has no team defensive books — the catalog is
                        base schemes + variants, so label the split that way */}
                    {game === 'cfb' && side === 'defense'
                      ? c === 'team'
                        ? 'Base Schemes'
                        : 'Variants'
                      : c === 'team'
                        ? 'Team'
                        : 'Alternate'}
                  </button>
                ))}
              </div>
              <div className="dsection">Select a playbook</div>
              <div className="pgrid">
                {playbooksFor(playbooks, side, category).map((p) => (
                  <button
                    key={p.id}
                    className="pbtn"
                    onClick={() => {
                      setPbId(p.id)
                      setGroupName(null)
                      setFormName(null)
                    }}
                  >
                    <div className="pbtn__name">{p.name}</div>
                    <div className="pbtn__sub">
                      {p.formationGroups?.length || 0} sets
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : !group ? (
            <>
              <div className="dsection">Formation groups</div>
              <div className="pgrid">
                {groups.map((g) => (
                  <button
                    key={g.name}
                    className="pbtn"
                    onClick={() => {
                      setGroupName(g.name)
                      setFormName(null)
                    }}
                  >
                    <div className="pbtn__name">{g.name}</div>
                    <div className="pbtn__sub">
                      {g.formations.length} formations
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : !formation ? (
            <>
              <div className="dsection">Formations</div>
              <div className="pgrid">
                {formations.map((f) => (
                  <button
                    key={f.slug}
                    className="pbtn"
                    onClick={() => setFormName(f.name)}
                  >
                    <div className="pbtn__name">{f.name}</div>
                    <div className="pbtn__sub">{f.plays.length} plays</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <PlayRows
              plays={plays.map((p) => ({
                play: p,
                path: { formation: formation.name, playbook: pb.name },
              }))}
              assignedIds={assignedIds}
              onAdd={handleAdd}
              empty="No plays here"
            />
          )}
        </div>
      </aside>
    </>
  )
}

export default PlayBank
