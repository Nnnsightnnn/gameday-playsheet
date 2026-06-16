// Formation Planner — match an extracted feature set against a named library.
//
// Each library entry has a `sig` of feature constraints. The score is a
// WEIGHTED, GRADED fraction of those constraints the arrangement satisfies:
// numeric ranges give partial credit by distance (a count one off still scores
// well), and the structural axes that define a formation (backfield, front,
// personnel, package) are weighted above cosmetic ones (strong side, spacing).
// This keeps the closest real name stable as the user nudges tokens around.

// Relative importance of each feature key. Unlisted keys default to 1.
const WEIGHTS = {
  // offense
  backfield: 3,
  personnel: 2.5,
  strength: 2,
  nBacks: 1.5,
  nTE: 1.5,
  nWR: 1,
  teAttach: 0.75,
  spacing: 1.25,
  strongSide: 0.5,
  // defense
  front: 3,
  pkg: 2.5,
  shell: 2,
  dl: 1.5,
  lb: 1.5,
  nDB: 1.5,
  frontTag: 0.75,
};

// Graded satisfaction in [0,1]. Strings/arrays are exact membership (1 or 0);
// {min,max} ranges give full credit inside the band and decay with distance
// outside it, so a count that's one off still contributes ~0.5.
function gradedSatisfy(value, constraint) {
  if (constraint == null) return 1;
  if (Array.isArray(constraint)) return constraint.includes(value) ? 1 : 0;
  if (typeof constraint === 'object') {
    if (typeof value !== 'number') return 0;
    let dist = 0;
    if (constraint.min != null && value < constraint.min) {
      dist = constraint.min - value;
    } else if (constraint.max != null && value > constraint.max) {
      dist = value - constraint.max;
    }
    return Math.max(0, 1 - 0.5 * dist);
  }
  return value === constraint ? 1 : 0;
}

// Weighted graded score in [0,1] for one library entry, plus the feature keys
// that fully matched (the "drivers" we can surface to explain the call).
export function scoreEntry(features, entry) {
  const keys = Object.keys(entry.sig || {});
  if (keys.length === 0) return { score: 0, drivers: [] };
  let num = 0;
  let den = 0;
  const drivers = [];
  for (const k of keys) {
    const w = WEIGHTS[k] ?? 1;
    const s = gradedSatisfy(features[k], entry.sig[k]);
    num += w * s;
    den += w;
    if (s >= 0.999) drivers.push(k);
  }
  return { score: den ? num / den : 0, drivers };
}

// Best library match on this side. Returns the closest real name even when it
// falls below `threshold` (flagged `lowConfidence`), so the panel always lands
// on a canonical name rather than blanking out. Includes the runner-up.
export function matchLibrary(features, library, side, threshold = 0.7) {
  if (!features) return null;
  const candidates = (library || []).filter((e) => e.side === side);
  if (!candidates.length) return null;

  const ranked = candidates
    .map((e) => {
      const { score, drivers } = scoreEntry(features, e);
      return { name: e.name, aliases: e.aliases || [], score, drivers };
    })
    // Best score wins; ties break toward the MORE SPECIFIC match (more
    // satisfied constraints) so "4-3 Over" outranks the subset "4-3 Base".
    .sort((a, b) => b.score - a.score || b.drivers.length - a.drivers.length);

  const best = ranked[0];
  const runnerUp = ranked[1] && ranked[1].score > 0 ? ranked[1] : null;

  return {
    name: best.name,
    aliases: best.aliases,
    score: best.score,
    drivers: best.drivers,
    lowConfidence: best.score < threshold,
    runnerUp: runnerUp
      ? { name: runnerUp.name, score: runnerUp.score }
      : null,
  };
}
