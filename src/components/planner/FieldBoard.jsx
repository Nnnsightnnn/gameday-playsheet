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

  const spot = toPx({ x: BALL_SPOT_X[ballSpot] ?? 0.5, y: 0 });

  return (
    <svg
      ref={svgRef}
      className="board"
      viewBox={`0 0 ${BOARD.w} ${BOARD.h}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <FieldBackground />

      {/* ball spot — a bright hash notch on the LOS marking where the ball sits */}
      <g className="ballspot" transform={`translate(${spot.px} ${spot.py})`}>
        <line x1={0} x2={0} y1={-16} y2={16} stroke="var(--turf-los)" strokeWidth={5} />
        <polygon points="-8,-26 8,-26 0,-16" fill="var(--turf-los)" />
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
