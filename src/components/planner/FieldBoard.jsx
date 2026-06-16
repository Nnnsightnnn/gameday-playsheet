// Interactive SVG board: renders the field + draggable tokens.
// Movement is handled by usePointerDrag; taps bubble up for select/swap.

import { useRef } from 'react';
import { BOARD } from '../../lib/field/fieldConfig';
import { usePointerDrag } from '../../hooks/usePointerDrag';
import FieldBackground from './FieldBackground';
import PlayerToken from './PlayerToken';

export default function FieldBoard({
  players,
  side,
  snap,
  selectedId,
  byPlayer,
  onMove,
  onTap,
}) {
  const svgRef = useRef(null);
  const startDrag = usePointerDrag({ svgRef, snap, side, onMove, onTap });

  return (
    <svg
      ref={svgRef}
      className="board"
      viewBox={`0 0 ${BOARD.w} ${BOARD.h}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <FieldBackground />
      {players.map((p) => (
        <PlayerToken
          key={p.id}
          player={p}
          side={side}
          selected={selectedId === p.id}
          invalid={Boolean(byPlayer[p.id])}
          onPointerDown={(e) => startDrag(e, p.id)}
        />
      ))}
    </svg>
  );
}
