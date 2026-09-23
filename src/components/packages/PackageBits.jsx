// built by nnnsightnnn — signal from noise
// Package Forge — small shared pieces: shell glyph, disguise meter, checks
// list, confidence chip.

import { CONFIDENCE } from '../../data/personnel'
import { SHELLS } from '../../lib/packages/vocab'

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
