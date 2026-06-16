// Presentational SVG field: turf, yard lines, ruleset-aware hash marks, the
// line of scrimmage, and (when the ball is on a hash) field/boundary shading.
// Pure / memoized — re-renders only when ruleset or ballSpot change.

import { memo } from 'react';
import {
  BOARD,
  YARD_STEP_Y,
  hashX,
  ballSpotX,
  toPx,
} from '../../lib/field/fieldConfig';

function FieldBackgroundBase({ ruleset = 'nfl', ballSpot = 'middle' }) {
  const { w, h } = BOARD;
  const losY = toPx({ x: 0, y: 0 }).py;

  // yard lines at y = 0, ±step, ±2·step, ±3·step (within the ±1 window)
  const yardYs = [];
  for (let k = -3; k <= 3; k += 1) {
    const y = k * YARD_STEP_Y;
    if (y >= -1 && y <= 1) yardYs.push(y);
  }

  const hash = hashX(ruleset);
  const hashLeftPx = hash.left * w;
  const hashRightPx = hash.right * w;
  const tick = 12;

  // Ball on a hash → the larger side of the field is the wide "field" side,
  // the smaller is the "boundary". Shade them so the room is visible at a glance.
  const onHash = ballSpot === 'left' || ballSpot === 'right';
  const ballPx = ballSpotX(ruleset, ballSpot) * w;
  const fieldIsRight = ballPx < w / 2; // ball left of center → field is to the right

  const columns = [
    { px: hashLeftPx, active: ballSpot === 'left' },
    { px: hashRightPx, active: ballSpot === 'right' },
  ];

  return (
    <g className="board__bg">
      <rect x={0} y={0} width={w} height={h} fill="var(--turf)" rx={10} />

      {/* field / boundary shading (only when the ball is on a hash) */}
      {onHash && (
        <>
          <rect
            x={fieldIsRight ? ballPx : 0}
            y={0}
            width={fieldIsRight ? w - ballPx : ballPx}
            height={h}
            fill="var(--turf-line)"
            opacity={0.06}
          />
          <rect
            x={fieldIsRight ? 0 : ballPx}
            y={0}
            width={fieldIsRight ? ballPx : w - ballPx}
            height={h}
            fill="#000"
            opacity={0.1}
          />
          <text
            x={fieldIsRight ? w - 16 : 16}
            y={30}
            textAnchor={fieldIsRight ? 'end' : 'start'}
            fontSize={20}
            fontWeight={700}
            fill="var(--turf-line)"
            opacity={0.55}
            style={{ letterSpacing: 2 }}
          >
            FIELD
          </text>
          <text
            x={fieldIsRight ? 16 : w - 16}
            y={30}
            textAnchor={fieldIsRight ? 'start' : 'end'}
            fontSize={20}
            fontWeight={700}
            fill="var(--turf-line)"
            opacity={0.4}
            style={{ letterSpacing: 2 }}
          >
            BDRY
          </text>
        </>
      )}

      {/* yard lines */}
      {yardYs.map((y) => {
        const py = toPx({ x: 0, y }).py;
        return (
          <line
            key={`yl-${y.toFixed(3)}`}
            x1={0}
            x2={w}
            y1={py}
            y2={py}
            stroke="var(--turf-line)"
            strokeWidth={y === 0 ? 0 : 2}
          />
        );
      })}

      {/* Both hash columns. Each is a group translated to its column X so it
          smoothly slides when the ruleset (NFL ↔ NCAA) changes the spacing.
          A faint full-height dashed corridor guide + a tick on every yard line;
          the active ball-spot column glows in the LOS color. */}
      {columns.map(({ px, active }, i) => (
        <g
          key={`hashcol-${i}`}
          className="hashcol"
          style={{
            transform: `translateX(${px}px)`,
            transition: 'transform 0.25s ease',
          }}
        >
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={h}
            stroke={active ? 'var(--turf-los)' : 'var(--turf-line)'}
            strokeWidth={active ? 2 : 1.5}
            strokeDasharray="2 14"
            opacity={active ? 0.75 : 0.45}
          />
          {yardYs.map((y) => {
            const py = toPx({ x: 0, y }).py;
            return (
              <line
                key={`t-${y.toFixed(3)}`}
                x1={-tick / 2}
                x2={tick / 2}
                y1={py}
                y2={py}
                stroke={active ? 'var(--turf-los)' : 'var(--turf-line)'}
                strokeWidth={active ? 4 : 3.5}
                opacity={active ? 1 : 0.95}
              />
            );
          })}
        </g>
      ))}

      {/* line of scrimmage */}
      <line
        x1={0}
        x2={w}
        y1={losY}
        y2={losY}
        stroke="var(--turf-los)"
        strokeWidth={4}
        strokeDasharray="2 0"
      />

      {/* sideline frame */}
      <rect
        x={1}
        y={1}
        width={w - 2}
        height={h - 2}
        fill="none"
        stroke="var(--turf-line)"
        strokeWidth={2}
        rx={10}
      />
    </g>
  );
}

export default memo(FieldBackgroundBase);
