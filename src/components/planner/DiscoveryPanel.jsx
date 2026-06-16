// Names the active side's formation: a compositional label always, plus the
// closest canonical match from the library when confidence is high enough.

export default function DiscoveryPanel({ side, features, match }) {
  if (!features) return null;

  return (
    <div className="disc">
      <div className="disc__label">{side} formation</div>
      <div className="disc__name">{features.name}</div>

      <div className="disc__chips">
        {features.chips.filter(Boolean).map((c, i) => (
          <span key={i} className="disc__chip">
            {c}
          </span>
        ))}
      </div>

      {match ? (
        <div className="disc__match">
          Closest named: <b>{match.name}</b>
          <span className="disc__pct"> {Math.round(match.score * 100)}%</span>
        </div>
      ) : (
        <div className="disc__match disc__match--none">
          No canonical name matched — using the descriptive label above.
        </div>
      )}
    </div>
  );
}
