// Generic SVG pointer-drag for the formation board.
// Distinguishes a drag (token moved past a threshold) from a tap (select/swap).
//
// Usage:
//   const startDrag = usePointerDrag({ svgRef, snap, side, onMove, onTap })
//   <g onPointerDown={(e) => startDrag(e, token.id)} />

import { useCallback } from 'react';
import { toField, snapPoint } from '../lib/field/fieldConfig';

const TAP_THRESHOLD = 6; // client px of movement before it counts as a drag

export function usePointerDrag({ svgRef, snap = true, side = 'offense', onMove, onTap }) {
  // client coords → normalized field point
  const clientToField = useCallback(
    (clientX, clientY) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
      return snapPoint(toField({ px: loc.x, py: loc.y }), { snap, side });
    },
    [svgRef, snap, side],
  );

  const startDrag = useCallback(
    (e, id) => {
      e.preventDefault();
      const state = { startX: e.clientX, startY: e.clientY, moved: false };

      const handleMove = (ev) => {
        const dist = Math.hypot(ev.clientX - state.startX, ev.clientY - state.startY);
        if (!state.moved && dist > TAP_THRESHOLD) state.moved = true;
        if (state.moved) {
          const point = clientToField(ev.clientX, ev.clientY);
          if (point) onMove?.(id, point);
        }
      };

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        if (!state.moved) onTap?.(id);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    },
    [clientToField, onMove, onTap],
  );

  return startDrag;
}
