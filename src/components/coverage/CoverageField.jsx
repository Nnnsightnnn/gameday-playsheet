// built by nnnsightnnn — signal from noise
// Coverage Lab — the SVG board.
//
// Presentational only: it is handed a context, a resolved defense and a
// snap-time t, and draws that frame. All motion math lives in the engine.

import { memo } from 'react';
import {
  LAB_BOARD,
  BACK_YDS,
  DEEP_YDS,
  FIELD_W,
  bx,
  by,
  hashYards,
} from '../../lib/coverage/labField';
import { defenderAt, receiverAt, rushers, TRIGGER_T } from '../../lib/coverage/engine';
import { TYPE_COLOR } from '../../lib/coverage/labConfig';

const YARD_MARKS = [-5, 0, 5, 10, 15, 20, 25];

function Backdrop({ ball, ruleset }) {
  const { w, h } = { w: LAB_BOARD.w, h: LAB_BOARD.h };
  const hash = hashYards(ruleset);
  const mid = FIELD_W / 2;
  const onHash = Math.abs(ball - mid) > 0.5;
  const fieldIsRight = ball < mid;

  return (
    <g>
      <rect x={0} y={0} width={w} height={h} fill="var(--turf)" rx={10} />

      {onHash && (
        <>
          <rect
            x={fieldIsRight ? bx(ball) : 0}
            y={0}
            width={fieldIsRight ? w - bx(ball) : bx(ball)}
            height={h}
            fill="var(--turf-line)"
            opacity={0.06}
          />
          <rect
            x={fieldIsRight ? 0 : bx(ball)}
            y={0}
            width={fieldIsRight ? bx(ball) : w - bx(ball)}
            height={h}
            fill="#000"
            opacity={0.1}
          />
        </>
      )}

      {YARD_MARKS.filter((y) => y >= -BACK_YDS && y <= DEEP_YDS).map((y) => (
        <g key={`yl${y}`}>
          <line
            x1={0}
            x2={w}
            y1={by(y)}
            y2={by(y)}
            stroke={y === 0 ? 'var(--turf-los)' : 'var(--turf-line)'}
            strokeWidth={y === 0 ? 4 : 2}
            opacity={y === 0 ? 1 : 0.5}
          />
          {y > 0 && (
            <>
              <text x={10} y={by(y) - 6} fontSize={17} fontWeight={700} fill="var(--turf-line)" opacity={0.45}>
                {y}
              </text>
              <text x={w - 26} y={by(y) - 6} fontSize={17} fontWeight={700} fill="var(--turf-line)" opacity={0.45}>
                {y}
              </text>
            </>
          )}
        </g>
      ))}

      {[hash.left, hash.right].map((hx, i) => {
        const active = Math.abs(hx - ball) < 0.5;
        return (
          <g key={`hash${i}`}>
            <line
              x1={bx(hx)}
              x2={bx(hx)}
              y1={0}
              y2={h}
              stroke={active ? 'var(--turf-los)' : 'var(--turf-line)'}
              strokeWidth={active ? 2 : 1.5}
              strokeDasharray="2 14"
              opacity={active ? 0.7 : 0.4}
            />
            {Array.from({ length: DEEP_YDS + BACK_YDS + 1 }, (_, k) => k - BACK_YDS).map((y) => (
              <line
                key={`t${i}-${y}`}
                x1={bx(hx) - 6}
                x2={bx(hx) + 6}
                y1={by(y)}
                y2={by(y)}
                stroke={active ? 'var(--turf-los)' : 'var(--turf-line)'}
                strokeWidth={active ? 3 : 2.5}
                opacity={active ? 0.95 : 0.8}
              />
            ))}
          </g>
        );
      })}

      {onHash && (
        <>
          <text
            x={fieldIsRight ? w - 14 : 14}
            textAnchor={fieldIsRight ? 'end' : 'start'}
            y={by(-6.6)}
            fontSize={19}
            fontWeight={700}
            fill="var(--turf-line)"
            opacity={0.5}
            style={{ letterSpacing: 2 }}
          >
            FIELD
          </text>
          <text
            x={fieldIsRight ? 14 : w - 14}
            textAnchor={fieldIsRight ? 'start' : 'end'}
            y={by(-6.6)}
            fontSize={19}
            fontWeight={700}
            fill="var(--turf-line)"
            opacity={0.36}
            style={{ letterSpacing: 2 }}
          >
            BDRY
          </text>
        </>
      )}

      <rect x={1} y={1} width={w - 2} height={h - 2} fill="none" stroke="var(--turf-line)" strokeWidth={2} rx={10} />
    </g>
  );
}

function shortLabel(p) {
  return p.replace(/\s+\d$/, '').replace(/\s+/g, '');
}

function CoverageFieldBase({ ctx, defense, t, ruleset }) {
  const trail = (d) => {
    const pts = [];
    for (let s = 0; s <= t + 1e-6; s += 0.05) {
      const q = defenderAt(d, ctx, Math.min(s, t));
      pts.push(`${bx(q.x)},${by(q.y)}`);
    }
    const last = defenderAt(d, ctx, t);
    pts.push(`${bx(last.x)},${by(last.y)}`);
    return pts.join(' ');
  };

  return (
    <svg className="board cvboard" viewBox={`0 0 ${LAB_BOARD.w} ${LAB_BOARD.h}`}>
      <Backdrop ball={ctx.ball} ruleset={ruleset} />

      {/* route stems */}
      {ctx.recs.map((r) => (
        <polyline
          key={`rt-${r.k}`}
          points={r.path.map((p) => `${bx(p.x)},${by(p.y)}`).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={2}
          strokeDasharray="4 5"
        />
      ))}

      {/* offensive line + QB */}
      {ctx.form.line.map((p) => (
        <rect
          key={p.id}
          x={bx(p.x) - 7}
          y={by(p.y) - 7}
          width={14}
          height={14}
          rx={2}
          fill="rgba(255,255,255,0.28)"
          stroke="rgba(0,0,0,0.35)"
          strokeWidth={1.5}
        />
      ))}
      <g>
        <circle cx={bx(ctx.form.qb.x)} cy={by(ctx.form.qb.y)} r={12} fill="var(--token-off)" stroke="rgba(0,0,0,0.35)" strokeWidth={2} />
        <text x={bx(ctx.form.qb.x)} y={by(ctx.form.qb.y) + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">
          QB
        </text>
      </g>

      {/* four-man rush */}
      {rushers(ctx).map((p) => (
        <circle
          key={p.id}
          cx={bx(p.x)}
          cy={by(p.y)}
          r={11}
          fill="var(--token-def)"
          opacity={0.5}
          stroke="rgba(0,0,0,0.35)"
          strokeWidth={2}
        />
      ))}

      {/* receivers */}
      {ctx.recs.map((r) => {
        const p = receiverAt(r, t);
        return (
          <g key={`rec-${r.k}`}>
            <circle cx={bx(p.x)} cy={by(p.y)} r={13} fill="var(--token-off)" stroke="rgba(0,0,0,0.35)" strokeWidth={2} />
            <text x={bx(p.x)} y={by(p.y) + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
              {r.id}
            </text>
          </g>
        );
      })}

      {/* coverage defenders */}
      {defense.map((d) => {
        const p = defenderAt(d, ctx, t);
        const col = TYPE_COLOR[d.type] || TYPE_COLOR.under;
        const fired = d.res.mode === 'match' && t >= TRIGGER_T;
        return (
          <g key={`def-${d.p}`}>
            <polyline points={trail(d)} fill="none" stroke={col} strokeWidth={2.5} opacity={0.5} />
            <circle
              cx={bx(p.x)}
              cy={by(p.y)}
              r={16}
              fill="rgba(12,16,10,0.9)"
              stroke={col}
              strokeWidth={fired ? 4 : 2.5}
            />
            <text x={bx(p.x)} y={by(p.y) + 4} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={col}>
              {shortLabel(d.p)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default memo(CoverageFieldBase);
