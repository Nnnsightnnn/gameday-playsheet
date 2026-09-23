// built by nnnsightnnn — signal from noise
// Package Forge — build custom adjustment packages (Madden 27 macros) that
// show one picture and play another, aimed at a named meta, and fold them
// into the 20-slot / 10-active arsenal.
//
// Curated packages are static data (src/data/packages-*.js); Kenny's own
// live in Dexie (macroPackages) along with one arsenal row per game
// (macroArsenal). The football lives in src/lib/packages/.

import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  getMacroPackages,
  saveMacroPackage,
  deleteMacroPackage,
  getMacroArsenal,
  saveMacroSlot,
} from '../../lib/db'
import { packagesForGame } from '../../data/packages'
import { SITUATIONS } from '../../data/situations'
import {
  analyzePackage,
  arsenalChecks,
  resolveArsenal,
  metaCoverage,
  buildCatalog,
  blankPackage,
  nextFreeSlot,
  MACRO_CAP,
} from '../../lib/packages/engine'
import PackageCard from './PackageCard'
import PackageEditor from './PackageEditor'
import MetaMap from './MetaMap'

const DEFAULT_BOOK = { defense: 'falcons-def', offense: 'falcons-off' }

export default function PackageForge({ game, playbooks, loading, onAddToSheet, onStudy }) {
  const [side, setSide] = useState('defense')
  const [lens, setLens] = useState('arsenal')
  const [selectedId, setSelectedId] = useState(null)
  const [editing, setEditing] = useState(null)

  const custom = useLiveQuery(() => getMacroPackages(game), [game], [])
  const arsenalRow = useLiveQuery(() => getMacroArsenal(game), [game], null)

  const all = useMemo(() => [...packagesForGame(game), ...(custom || [])], [game, custom])
  const arsenal = useMemo(() => resolveArsenal(all, arsenalRow?.slots), [all, arsenalRow])
  const catalog = useMemo(() => buildCatalog(playbooks), [playbooks])

  const mine = all
    .filter((p) => p.side === side)
    .sort((a, b) => (arsenal[a.id]?.slot || 99) - (arsenal[b.id]?.slot || 99) || a.name.localeCompare(b.name))
  const slotted = mine.filter((p) => arsenal[p.id]?.slot)
  const active = slotted.filter((p) => arsenal[p.id]?.active)
  const capIssues = arsenalChecks(all, arsenal).filter((c) => c.side === side)
  const selected = mine.find((p) => p.id === selectedId) || mine[0] || null
  const analysis = selected ? analyzePackage(selected, catalog.size ? catalog : null) : null
  const situations = SITUATIONS[side].filter((s) => game === 'cfb' || !s.legacy)

  const startNew = () => {
    const book = playbooks.find((b) => b.id === DEFAULT_BOOK[side]) ? DEFAULT_BOOK[side] : playbooks.find((b) => b.type === side)?.id
    setEditing(blankPackage({ game, side, playbook: book }))
  }
  const fork = (pkg) => {
    const copy = structuredClone(pkg)
    delete copy.slot
    delete copy.active
    setEditing({ ...copy, id: `my-${Date.now().toString(36)}`, custom: true, name: pkg.custom ? `${pkg.name} II` : pkg.name, conf: 'read' })
  }
  const save = async (pkg) => {
    const isNew = !all.some((p) => p.id === pkg.id)
    await saveMacroPackage(pkg)
    if (isNew) {
      const slot = nextFreeSlot(all, arsenal, pkg.side)
      if (slot) await saveMacroSlot(game, pkg.id, { slot, active: false })
    }
    setSelectedId(pkg.id)
    setEditing(null)
  }
  const remove = async (pkg) => {
    if (!window.confirm(`Delete “${pkg.name}”? This frees its macro slot.`)) return
    await deleteMacroPackage(pkg)
    setSelectedId(null)
  }
  const setSlot = (pkg, slot) => saveMacroSlot(game, pkg.id, slot ? { slot } : { slot: null, active: false })
  const setActive = (pkg, on) => saveMacroSlot(game, pkg.id, { active: on })

  if (loading) return <div className="pkg"><p className="pkg-hint">Loading the playbook…</p></div>

  return (
    <div className="pkg">
      <div className="pkg-hd">
        <div>
          <h1 className="pkg-h1">Package Forge</h1>
          <p className="pkg-sub">Custom adjustment packages: one call, one stack, one lie, aimed at a named meta.</p>
        </div>
        <div className="pkg-hd__ctl">
          <div className="trends-tabs">
            {['defense', 'offense'].map((s) => (
              <button key={s} className={'trend-tab' + (side === s ? ' trend-tab--on' : '')} onClick={() => { setSide(s); setSelectedId(null); setEditing(null) }}>
                {s === 'defense' ? 'Defense' : 'Offense'}
              </button>
            ))}
          </div>
          <div className="trends-tabs">
            {[['arsenal', 'Arsenal'], ['meta', 'Meta map']].map(([id, label]) => (
              <button key={id} className={'trend-tab' + (lens === id ? ' trend-tab--on' : '')} onClick={() => { setLens(id); setEditing(null) }}>
                {label}
              </button>
            ))}
          </div>
          <span className="pkg-caps">
            <b>{slotted.length}</b>/{MACRO_CAP.built} built · <b>{active.length}</b>/{MACRO_CAP.active} active
          </span>
          <button className="pkg-btn pkg-btn--primary" onClick={() => { setLens('arsenal'); startNew() }}>
            + New package
          </button>
        </div>
      </div>

      {game === 'cfb' && !mine.length && (
        <p className="pkg-hint">No CFB 27 packages yet. The macro system is shared with Madden 27, so the same method applies: pick a call, stack it, name the meta.</p>
      )}
      {capIssues.map((c, i) => (
        <p key={i} className="pkg-check pkg-check--error pkg-cap-issue">{c.msg}</p>
      ))}

      {lens === 'meta' ? (
        <MetaMap
          side={side}
          rows={metaCoverage(all, arsenal, game, side)}
          onOpen={(id) => { setSelectedId(id); setLens('arsenal') }}
        />
      ) : editing ? (
        <PackageEditor
          key={editing.id}
          initial={editing}
          playbooks={playbooks}
          catalog={catalog}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <div className="pkg-body">
          <nav className="pkg-list" aria-label="Packages">
            {mine.map((p) => {
              const a = arsenal[p.id]
              return (
                <button
                  key={p.id}
                  className={'pkg-row' + (selected?.id === p.id ? ' pkg-row--on' : '') + (a?.active ? ' pkg-row--active' : '')}
                  onClick={() => setSelectedId(p.id)}
                >
                  <span className="pkg-row__slot">{a?.slot ?? '·'}</span>
                  <span className="pkg-row__main">
                    <span className="pkg-row__name">
                      {p.name}
                      {p.custom && <span className="pkg-row__mine">yours</span>}
                    </span>
                    <span className="pkg-row__tag">{p.tagline}</span>
                  </span>
                  {a?.active && <span className="pkg-row__live" title="Active this week" />}
                </button>
              )
            })}
            {!mine.length && <p className="pkg-hint">Nothing here yet. Build the first one.</p>}
          </nav>
          {selected && analysis && (
            <PackageCard
              key={selected.id}
              pkg={selected}
              analysis={analysis}
              slotInfo={arsenal[selected.id]}
              situations={situations}
              onSlot={(slot) => setSlot(selected, slot)}
              onActive={(on) => setActive(selected, on)}
              onEdit={() => setEditing(structuredClone(selected))}
              onFork={() => fork(selected)}
              onDelete={() => remove(selected)}
              onAddToSheet={(sit) => onAddToSheet(selected, sit)}
              onStudy={onStudy}
            />
          )}
        </div>
      )}
    </div>
  )
}
