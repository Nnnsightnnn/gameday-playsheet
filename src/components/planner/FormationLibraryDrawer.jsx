// Sliding drawer to save / load / delete saved formations.
// Mirrors the laminated PlayBank drawer pattern.

export default function FormationLibraryDrawer({
  open,
  side,
  formations,
  onLoad,
  onDelete,
  onClose,
}) {
  const list = (formations || []).filter((f) => f.side === side);

  return (
    <div className={'flib' + (open ? ' flib--open' : '')}>
      <div className="flib__scrim" onClick={onClose} />
      <aside className="flib__panel" role="dialog" aria-label="Saved formations">
        <header className="flib__head">
          <h3>Saved {side} formations</h3>
          <button className="flib__x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        {list.length === 0 ? (
          <p className="flib__empty">No saved {side} formations yet.</p>
        ) : (
          <ul className="flib__list">
            {list.map((f) => (
              <li key={f.id} className="flib__item">
                <button className="flib__load" onClick={() => onLoad(f)}>
                  <span className="flib__name">{f.name}</span>
                  <span className="flib__meta">
                    {f.ruleset?.toUpperCase()} · {f.players?.length ?? 0} players
                  </span>
                </button>
                <button
                  className="flib__del"
                  onClick={() => onDelete(f.id)}
                  aria-label={`Delete ${f.name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
