// Presentational SVG field: turf, yard lines, hash marks, line of scrimmage.
// Pure / memoized — no interactivity.

import { memo } from 'react';
import {
  BOARD,
  YARD_STEP_Y,
  HASH_LEFT_X,
  HASH_RIGHT_X,
  toPx,
} from '../../lib/field/fieldConfig';

function FieldBackgroundBase() {
  const { w, h } = BOARD;
  const losY = toPx({ x: 0, y: 0 }).py;

  // yard lines at y = 0, ±step, ±2·step, ±3·step (within the ±1 window)
  const yardYs = [];
  for (let k = -3; k <= 3; k += 1) {
    const y = k * YARD_STEP_Y;
    if (y >= -1 && y <= 1) yardYs.push(y);
  }

  const hashLeftPx = HASH_LEFT_X * w;
  const hashRightPx = HASH_RIGHT_X * w;
  const tick = 10;

  return (
    <g className="board__bg">
      <rect x={0} y={0} width={w} height={h} fill="var(--turf)" rx={10} />

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

      {/* hash mark ticks along each yard line */}
      {yardYs.map((y) =>
        [hashLeftPx, hashRightPx].map((hx) => {
          const py = toPx({ x: 0, y }).py;
          return (
            <line
              key={`hash-${y.toFixed(3)}-${hx.toFixed(0)}`}
              x1={hx - tick / 2}
              x2={hx + tick / 2}
              y1={py}
              y2={py}
              stroke="var(--turf-line)"
              strokeWidth={3}
            />
          );
        }),
      )}

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
