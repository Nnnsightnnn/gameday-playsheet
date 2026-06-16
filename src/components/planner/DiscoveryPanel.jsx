// Names the active side's formation: a compositional label always, the closest
// canonical match from the library (with confidence + a runner-up), and — for
// defense — the safety shell plus the coverages it COULD be. We never claim a
// single coverage: pre-snap alignment gives the shell, not the call.

export default function DiscoveryPanel({ side, features, match }) {
  if (!features) return null;

  const pct = match ? Math.round(match.score * 100) : null;

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
          {match.lowConfidence ? 'Closest named' : 'Named'}:{' '}
          <b>{match.name}</b>
          <span className="disc__pct"> {pct}%</span>
          {match.lowConfidence && (
            <span className="disc__match--none"> (low confidence)</span>
          )}
          {match.aliases?.length > 0 && (
            <div className="disc__alias">aka {match.aliases.join(' / ')}</div>
          )}
          {match.runnerUp && (
            <div className="disc__alias">
              could also be <b>{match.runnerUp.name}</b> (
              {Math.round(match.runnerUp.score * 100)}%)
            </div>
          )}
        </div>
      ) : (
        <div className="disc__match disc__match--none">
          No canonical name matched — using the descriptive label above.
        </div>
      )}

      {side === 'defense' && features.inferredCoverages?.length > 0 && (
        <div className="disc__cov">
          <span className="disc__cov-shell">{features.shell} shell</span>
          {features.pressureLook && (
            <span className="disc__cov-blitz">pressure look</span>
          )}
          <div className="disc__cov-list">
            possible coverages: {features.inferredCoverages.join(', ')}
          </div>
          <div className="disc__cov-note">
            shell is from alignment — coverage is {features.coverageConfidence}
          </div>
        </div>
      )}
    </div>
  );
}
