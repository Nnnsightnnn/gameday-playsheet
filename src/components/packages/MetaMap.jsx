// built by nnnsightnnn — signal from noise
// Package Forge — the meta map: every live threat for this side of the ball,
// the active packages that answer it, and the holes nothing answers.

import { Conf } from './PackageBits'

export default function MetaMap({ rows, side, onOpen }) {
  const gaps = rows.filter((r) => r.gap).length
  return (
    <div className="pkg-meta">
      <p className="pkg-meta__lede">
        {side === 'defense' ? 'Offensive' : 'Defensive'} metas you will see, against the packages active this week.{' '}
        {gaps ? (
          <strong className="pkg-meta__gapcount">{gaps} unanswered.</strong>
        ) : (
          <strong>Every one has an answer.</strong>
        )}
      </p>
      {rows.map(({ threat, answers, gap }) => (
        <div key={threat.id} className={'pkg-meta__row' + (gap ? ' pkg-meta__row--gap' : '')}>
          <div className="pkg-meta__threat">
            <div className="pkg-meta__name">
              {threat.name} <Conf conf={threat.conf} />
            </div>
            <p>{threat.what}</p>
            <p className="pkg-meta__beat">
              <span>Beaten by</span> {threat.beatenBy}
            </p>
          </div>
          <div className="pkg-meta__answers">
            {gap ? (
              <span className="pkg-meta__hole">No active package</span>
            ) : (
              answers.map((p) => (
                <button key={p.id} className="pkg-chip" onClick={() => onOpen(p.id)}>
                  {p.name}
                </button>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
