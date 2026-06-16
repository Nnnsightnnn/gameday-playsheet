// A single draggable player token rendered as an SVG group.

import { toPx } from '../../lib/field/fieldConfig';

const R = 22;

export default function PlayerToken({
  player,
  side,
  selected,
  invalid,
  onPointerDown,
}) {
  const { px, py } = toPx(player);
  const fill =
    side === 'offense' ? 'var(--token-off)' : 'var(--token-def)';

  return (
    <g
      className="token"
      transform={`translate(${px} ${py})`}
      onPointerDown={onPointerDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      {selected && (
        <circle r={R + 6} fill="none" stroke="var(--token-sel)" strokeWidth={3} />
      )}
      <circle
        r={R}
        fill={fill}
        stroke={invalid ? 'var(--token-bad)' : 'rgba(0,0,0,0.35)'}
        strokeWidth={invalid ? 4 : 2}
      />
      <text
        className="token__label"
        textAnchor="middle"
        dy="-1"
        fontSize="16"
        fontWeight="700"
        fill="#fff"
      >
        {player.label || player.pos}
      </text>
      <text
        className="token__num"
        textAnchor="middle"
        dy="14"
        fontSize="10"
        fill="rgba(255,255,255,0.85)"
      >
        {player.jersey}
      </text>
    </g>
  );
}
