// built by nnnsightnnn — signal from noise
// Package Forge — small shared pieces: shell glyph, disguise meter, checks
// list, confidence chip, user objectives (editor rows and read view).

import { CONFIDENCE } from '../../data/personnel'
import { SHELLS, DEF_POSITIONS, OFF_POSITIONS } from '../../lib/packages/vocab'
import {
  PHASES,
  phaseLabel,
  objectiveById,
  objectiveGroups,
  blankObjective,
  defaultPhase,
} from '../../lib/packages/userObjectives'

// A defense seen from behind the offense: rushers on the line, safeties in
// the shell, corners pressed or off. Enough to see the lie at a glance.
export function ShellGlyph({ shell = 0, rush = 4, press = false, label }) {
  const W = 150
  const H = 78
  const los = 58
  const safeX = { 0: [], 1: [0.5], 2: [0.3, 0.7], 3: [0.2, 0.5, 0.8] }[shell] || []
  const rushers = Math.max(0, Math.min(8, rush))
  const span = 0.56
  const rushX = Array.from({ length: rushers }, (_, i) =>
    rushers === 1 ? 0.5 : 0.5 - span / 2 + (span * i) / (rushers - 1),
  )
  const cbY = press ? los - 7 : los - 22
  return (
    <figure className="pkg-glyph">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${SHELLS.find((s) => s.id === shell)?.label}, ${rush} rushing${press ? ', press' : ''}`}>
        <line x1="4" x2={W - 4} y1={los} y2={los} className="pkg-glyph__los" />
        {safeX.map((x, i) => (
          <circle key={'s' + i} cx={x * W} cy={14} r="5" className="pkg-glyph__deep" />
        ))}
        {[0.07, 0.93].map((x, i) => (
          <circle key={'c' + i} cx={x * W} cy={cbY} r="4.5" className="pkg-glyph__cb" />
        ))}
        {rushX.map((x, i) => (
          <circle key={'r' + i} cx={x * W} cy={los - 6} r="4" className="pkg-glyph__rush" />
        ))}
      </svg>
      {label && <figcaption>{label}</figcaption>}
    </figure>
  )
}

const BAND_LABEL = { none: 'No disguise', light: 'Light', solid: 'Solid', heavy: 'Heavy' }

export function DisguiseMeter({ disguise, side }) {
  return (
    <div className={`pkg-meter pkg-meter--${disguise.band}`}>
      <div className="pkg-meter__row">
        <span className="pkg-meter__label">{side === 'defense' ? 'Disguise' : 'One look, many endings'}</span>
        <span className="pkg-meter__val">
          {disguise.score} · {BAND_LABEL[disguise.band]}
        </span>
      </div>
      <div className="pkg-meter__track">
        <div className="pkg-meter__fill" style={{ width: `${disguise.score}%` }} />
      </div>
    </div>
  )
}

const LEVEL_ICON = { error: '✕', warn: '!', info: 'i' }

export function ChecksList({ checks }) {
  if (!checks.length)
    return <p className="pkg-checks__clean">Sound. No errors, nothing unpriced.</p>
  const order = { error: 0, warn: 1, info: 2 }
  return (
    <ul className="pkg-checks">
      {[...checks]
        .sort((a, b) => order[a.level] - order[b.level])
        .map((c, i) => (
          <li key={c.code + i} className={`pkg-check pkg-check--${c.level}`}>
            <span className="pkg-check__icon" aria-label={c.level}>
              {LEVEL_ICON[c.level]}
            </span>
            {c.msg}
          </li>
        ))}
    </ul>
  )
}

export function Conf({ conf }) {
  const c = CONFIDENCE[conf]
  if (!c) return null
  return (
    <span className={`pers-conf pers-conf--${conf}`} title={c.blurb}>
      {c.label}
    </span>
  )
}

// One objective's brief: the job, the cue, what it takes away, what it costs.
function ObjectiveBrief({ o }) {
  return (
    <div className="pkg-uobj__brief">
      <p className="pkg-uobj__job">{o.job}</p>
      <p className="pkg-uobj__line"><span>Cue</span> {o.cue}</p>
      <p className="pkg-uobj__line pkg-uobj__line--good"><span>Beats</span> {o.beats.join(' · ')}</p>
      <p className="pkg-uobj__line pkg-uobj__line--bad"><span>Gives up</span> {o.exposes.join(' · ')}</p>
    </div>
  )
}

// Editor rows. Missing userObjectives (blank or older saved packages) reads
// as an empty list; the parent stores whatever array comes back.
export function UserObjectivesEditor({ side, rows, onChange }) {
  const list = rows || []
  const groups = objectiveGroups(side)
  const allPositions = side === 'defense' ? DEF_POSITIONS : OFF_POSITIONS
  const update = (i, patch) => onChange(list.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const remove = (i) => onChange(list.filter((_, j) => j !== i))
  const pickObjective = (i, id) => {
    const o = objectiveById(id)
    const cur = list[i]
    update(i, {
      id,
      phase: defaultPhase(id),
      player: o && !o.positions.includes(cur.player) ? o.positions[0] : cur.player,
    })
  }

  return (
    <div className="pkg-uobj">
      {list.map((r, i) => {
        const o = objectiveById(r.id)
        const fits = o?.positions || []
        const others = allPositions.filter((p) => !fits.includes(p))
        return (
          <div key={i} className="pkg-uobj__row">
            <div className="pkg-uobj__ctl">
              <label className="pkg-field pkg-uobj__obj"><span>Objective</span>
                <select value={r.id} onChange={(e) => pickObjective(i, e.target.value)}>
                  {!o && <option value={r.id}>{r.id || 'Pick an objective'}</option>}
                  {groups.map((g) => (
                    <optgroup key={g.group} label={g.group}>
                      {g.items.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </label>
              <label className="pkg-field"><span>Phase</span>
                <select value={r.phase} onChange={(e) => update(i, { phase: e.target.value })}>
                  {PHASES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </label>
              <label className="pkg-field"><span>Player</span>
                <select value={r.player} onChange={(e) => update(i, { player: e.target.value })}>
                  {!!fits.length && (
                    <optgroup label="Built for it">
                      {fits.map((p) => <option key={p} value={p}>{p}</option>)}
                    </optgroup>
                  )}
                  <optgroup label={fits.length ? 'Off script' : 'Positions'}>
                    {others.map((p) => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                </select>
              </label>
              <label className="pkg-field pkg-uobj__note"><span>Note</span>
                <input value={r.note || ''} placeholder="Bates. Stay over the dig." onChange={(e) => update(i, { note: e.target.value })} />
              </label>
              <button type="button" className="pkg-btn pkg-btn--small pkg-uobj__rm" aria-label="Remove objective" onClick={() => remove(i)}>
                Remove
              </button>
            </div>
            {o && (
              <div className="pkg-uobj__panel">
                <Conf conf={o.conf} />
                <ObjectiveBrief o={o} />
              </div>
            )}
          </div>
        )
      })}
      <button type="button" className="pkg-btn pkg-btn--small" onClick={() => onChange([...list, blankObjective(side)])}>
        + Add user objective
      </button>
    </div>
  )
}

// Read view for the package card.
export function UserObjectivesView({ rows, note }) {
  const list = (rows || []).filter((r) => objectiveById(r.id))
  if (!list.length && !note) return null
  return (
    <div className="pkg-uview">
      {list.map((r, i) => {
        const o = objectiveById(r.id)
        return (
          <div key={i} className="pkg-uview__item">
            <div className="pkg-uview__hd">
              <span className={`pkg-uview__phase pkg-uview__phase--${r.phase}`}>{phaseLabel(r.phase)}</span>
              <strong>{o.label}</strong>
              {r.player && <b className="pkg-uview__player">{r.player}</b>}
              <Conf conf={o.conf} />
            </div>
            {r.note && <p className="pkg-uview__note">{r.note}</p>}
            <ObjectiveBrief o={o} />
          </div>
        )
      })}
      {note && (
        <p className="pkg-user">
          <span>User notes</span> {note}
        </p>
      )}
    </div>
  )
}
