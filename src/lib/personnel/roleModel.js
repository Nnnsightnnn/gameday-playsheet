// built by nnnsightnnn — signal from noise
// Personnel engine — pure functions over a team role sheet. No React here,
// which is why the football in it is testable.

import { CONFIDENCE, KNOW_ANCHORS } from '../../data/personnel';

export const GRADES = {
  fit: { id: 'fit', label: 'Fits the role', rank: 0 },
  stretch: { id: 'stretch', label: 'Playable, not ideal', rank: 1 },
  hole: { id: 'hole', label: 'Roster hole', rank: 2 },
};

export function rolesForSide(plan, side) {
  if (!plan?.roles) return [];
  if (!side || side === 'both') return plan.roles;
  return plan.roles.filter((r) => r.side === side);
}

export function roleById(plan, id) {
  return plan?.roles?.find((r) => r.id === id) || null;
}

// The ratings that define the job, split by how much they carry.
export function coreRatings(role) {
  return (role?.ratings || []).filter((r) => r.tier === 'core');
}

export function supportRatings(role) {
  return (role?.ratings || []).filter((r) => r.tier !== 'core');
}

// A one-line answer to "what am I sorting this room by?" — the reason the
// depth-chart procedure works at all.
export function sortKey(role) {
  const keys = coreRatings(role).map((r) => r.key);
  return keys.length ? keys.join(' → ') : '—';
}

export function confidenceOf(id) {
  return CONFIDENCE[id] || null;
}

// Roster health: how many roles are actually filled by a body that fits.
export function gradeSummary(plan, side) {
  const roles = rolesForSide(plan, side);
  const counts = { fit: 0, stretch: 0, hole: 0 };
  roles.forEach((r) => {
    const g = r.holder?.grade;
    if (counts[g] != null) counts[g] += 1;
  });
  return { ...counts, total: roles.length };
}

// The roles this roster cannot fill, worst first. This is the honest list —
// it is derived from the holder grade, not from anything Kenny self-reports.
export function rosterHoles(plan, side) {
  return rolesForSide(plan, side)
    .filter((r) => r.holder?.grade === 'hole' || r.holder?.grade === 'stretch')
    .sort(
      (a, b) =>
        (GRADES[b.holder.grade]?.rank ?? 0) - (GRADES[a.holder.grade]?.rank ?? 0),
    );
}

// The roles KENNY doesn't know, worst first. Separate axis from rosterHoles:
// a role can be well-staffed and still be one you can't coach.
export function knowledgeGaps(plan, know, side) {
  const roles = rolesForSide(plan, side);
  return roles
    .map((r) => ({ role: r, rating: know?.[r.id]?.rating ?? null }))
    .filter((x) => x.rating != null)
    .sort((a, b) => a.rating - b.rating);
}

export function unratedRoles(plan, know, side) {
  return rolesForSide(plan, side).filter((r) => know?.[r.id]?.rating == null);
}

// Average knowledge across rated roles, on the 1–5 KNOW_ANCHORS scale.
export function knowAverage(plan, know, side) {
  const rated = rolesForSide(plan, side)
    .map((r) => know?.[r.id]?.rating)
    .filter((v) => typeof v === 'number');
  if (!rated.length) return null;
  return Math.round((rated.reduce((a, b) => a + b, 0) / rated.length) * 10) / 10;
}

// The single role to study next: lowest knowledge, breaking ties toward the
// role the roster is worst at — that's where ignorance costs the most.
export function focusRole(plan, know, side) {
  const gaps = knowledgeGaps(plan, know, side);
  if (!gaps.length) return null;
  const low = gaps[0].rating;
  const tied = gaps.filter((g) => g.rating === low);
  tied.sort(
    (a, b) =>
      (GRADES[b.role.holder?.grade]?.rank ?? 0) -
      (GRADES[a.role.holder?.grade]?.rank ?? 0),
  );
  return { ...tied[0].role, rating: low };
}

export function anchorFor(value) {
  return KNOW_ANCHORS.find((a) => a.value === value) || null;
}

// Between-play reads, filtered for the side you're on and grouped by phase
// so the panel reads like a sideline card rather than a list.
export function readsByPhase(plan, side) {
  const list = (plan?.inGame || []).filter(
    (r) => !side || side === 'both' || r.side === side,
  );
  const order = ['Pre-snap read', 'Between plays', 'By drive'];
  const groups = new Map();
  list.forEach((r) => {
    if (!groups.has(r.phase)) groups.set(r.phase, []);
    groups.get(r.phase).push(r);
  });
  return [...groups.entries()]
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([phase, items]) => ({ phase, items }));
}

// Every rating the sheet flags as a trap, de-duplicated, so you can see the
// "do not pick on this" list in one place.
export function trapDigest(plan, side) {
  const seen = new Map();
  rolesForSide(plan, side).forEach((role) => {
    (role.traps || []).forEach((t) => {
      const cur = seen.get(t.key);
      if (cur) cur.roles.push(role.name);
      else seen.set(t.key, { ...t, roles: [role.name] });
    });
  });
  return [...seen.values()];
}
