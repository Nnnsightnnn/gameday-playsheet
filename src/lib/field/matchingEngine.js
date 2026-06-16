// Formation Planner — match an extracted feature set against a named library.
// Each library entry has a `sig` of feature constraints; the score is the
// fraction of those constraints the arrangement satisfies (1 = perfect).

// A constraint value may be a string (exact match), an array (membership),
// or a {min,max} range object.
function satisfies(value, constraint) {
  if (constraint == null) return true;
  if (Array.isArray(constraint)) return constraint.includes(value);
  if (typeof constraint === 'object') {
    if (constraint.min != null && value < constraint.min) return false;
    if (constraint.max != null && value > constraint.max) return false;
    return true;
  }
  return value === constraint;
}

export function scoreEntry(features, entry) {
  const keys = Object.keys(entry.sig || {});
  if (keys.length === 0) return 0;
  let hit = 0;
  for (const k of keys) {
    if (satisfies(features[k], entry.sig[k])) hit += 1;
  }
  return hit / keys.length;
}

// Returns { name, score } for the best library match on this side, or null.
export function matchLibrary(features, library, side, threshold = 0.75) {
  const candidates = (library || []).filter((e) => e.side === side);
  let best = null;
  for (const entry of candidates) {
    const score = scoreEntry(features, entry);
    if (!best || score > best.score) best = { name: entry.name, score };
  }
  if (!best || best.score < threshold) return null;
  return best;
}
