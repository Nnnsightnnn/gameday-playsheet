// Real-time legality readout for the current formation.

export default function ValidationPanel({ validation, onHighlight }) {
  const { valid, errors, warnings } = validation;

  return (
    <div className="vpanel">
      <div className={'vpanel__status ' + (valid ? 'is-legal' : 'is-illegal')}>
        {valid ? '✓ Legal formation' : `✕ ${errors.length} issue${errors.length === 1 ? '' : 's'}`}
      </div>

      {errors.map((e) => (
        <button
          key={e.rule}
          className="vrow vrow--error"
          onClick={() => onHighlight?.(e.playerIds)}
        >
          {e.message}
        </button>
      ))}

      {warnings.map((w) => (
        <button
          key={w.rule}
          className="vrow vrow--warn"
          onClick={() => onHighlight?.(w.playerIds)}
        >
          {w.message}
        </button>
      ))}

      {valid && warnings.length === 0 && (
        <div className="vrow vrow--ok">All checks pass.</div>
      )}
    </div>
  );
}
