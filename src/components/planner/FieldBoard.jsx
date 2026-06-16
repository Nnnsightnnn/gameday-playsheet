// Interactive SVG board: renders the field, the ball at its hash spot, and all
// 22 draggable tokens (offense + defense). Movement is handled by
// usePointerDrag; taps bubble up for select/swap.

import { useRef } from 'react';
import { BOARD, HASH_LEFT_X, HASH_RIGHT_X, toPx } from '../../lib/field/fieldConfig';
import { usePointerDrag } from '../../hooks/usePointerDrag';
import FieldBackground from './FieldBackground';
import PlayerToken from './PlayerToken';

const BALL_SPOT_X = { left: HASH_LEFT_X, middle: 0.5, right: HASH_RIGHT_X };

export default function FieldBoard({
  players,
  activeTeam,
  snap,
  selectedId,
  byPlayer,
  ballSpot,
  onMove,
  onTap,
}) {
  const svgRef = useRef(null);
  const startDrag = usePointerDrag({ svgRef, snap, onMove, onTap });

  const ball = toPx({ x: BALL_SPOT_X[ballSpot] ?? 0.5, y: 0 });

  return (
    <svg
      ref={svgRef}
      className="board"
      viewBox={`0 0 ${BOARD.w} ${BOARD.h}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <FieldBackground />

      {/* the ball — drag left/right to set the hash spot */}
      <g
        className="ball"
        transform={`translate(${ball.px} ${ball.py})`}
        onPointerDown={(e) => startDrag(e, '__ball__', 'offense')}
        style={{ cursor: 'ew-resize', touchAction: 'none' }}
      >
        <ellipse rx={11} ry={7} fill="#7a3b18" stroke="#2a1408" strokeWidth={1.5} />
        <line x1={-5} x2={5} y1={0} y2={0} stroke="#fff" strokeWidth={1.5} />
      </g>

      {players.map((p) => (
        <PlayerToken
          key={p.id}
          player={p}
          selected={selectedId === p.id}
          dimmed={activeTeam && p.team !== activeTeam}
          invalid={Boolean(byPlayer[p.id])}
          onPointerDown={(e) => startDrag(e, p.id, p.team)}
        />
      ))}
    </svg>
  );
}
