// Popover to change a selected token's body type (position) and jersey number.

import { POSITIONS } from '../../lib/field/fieldConfig';

export default function PositionPicker({ player, side, onSetPos, onSetJersey, onClose }) {
  if (!player) return null;
  const options = POSITIONS[side] || [];

  return (
    <div className="picker">
      <div className="picker__head">
        <span>
          Edit {player.label} <b>#{player.jersey}</b>
        </span>
        <button className="picker__x" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div className="picker__row">
        {options.map((pos) => (
          <button
            key={pos}
            className={'picker__pos' + (player.pos === pos ? ' is-on' : '')}
            onClick={() => onSetPos(player.id, pos)}
          >
            {pos}
          </button>
        ))}
      </div>

      <label className="picker__jersey">
        Number
        <input
          type="number"
          min={0}
          max={99}
          value={player.jersey ?? ''}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            onSetJersey(player.id, Number.isNaN(v) ? 0 : v);
          }}
        />
      </label>
    </div>
  );
}
