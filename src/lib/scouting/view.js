// built by nnnsightnnn — signal from noise
// Pure shaping for the Scouting Room charts. No React here so it stays testable.

export const UNIT_LABELS = [
  ['qb', 'Quarterback'],
  ['receivers', 'Receivers'],
  ['run', 'Run game'],
  ['passPro', 'Pass protection'],
  ['passRush', 'Pass rush'],
  ['runDefense', 'Run defense'],
  ['coverage', 'Coverage'],
];

export const THREAT_LABELS = {
  1: 'Soft',
  2: 'Favorable',
  3: 'Even',
  4: 'Dangerous',
  5: 'Nightmare',
};

// Tale of the tape: one row per unit, both teams, league rank for the opponent.
export function tapeRows(facts) {
  return UNIT_LABELS.map(([key, label]) => ({
    key,
    label,
    them: facts.units[key],
    us: facts.falconsUnits[key],
    rank: facts.ranks[key],
    diff: Math.round((facts.falconsUnits[key] - facts.units[key]) * 10) / 10,
  }));
}

// Rank 1-5 is a unit to respect, 25-32 a unit to attack.
export function rankTone(rank) {
  if (rank <= 5) return 'elite';
  if (rank >= 25) return 'weak';
  return 'mid';
}

// Edge bars sorted biggest Falcons edge first.
export function edgeRows(list) {
  return [...list].sort((a, b) => b.edge - a.edge);
}

export function edgeDomain(rows) {
  const m = Math.max(10, ...rows.map((r) => Math.abs(r.edge)));
  return Math.ceil(m / 5) * 5;
}

// Speed strip: who is on which side of the ball for a given fork.
export function speedRows(facts, fork) {
  const theirs = fork === 'attack' ? facts.speedMap.defense : facts.speedMap.offense;
  const ours = fork === 'attack'
    ? facts.matchups.attack.filter((m) => m.kind === 'pass').map((m) => m.falcons)
    : facts.matchups.defend.filter((m) => m.kind === 'pass').map((m) => m.falcons);
  const seen = new Set();
  const usRows = ours.filter((p) => !seen.has(p.name) && seen.add(p.name)).map((p) => ({ name: p.name, slot: p.slot, SPD: p.SPD }));
  return { us: usRows, them: theirs.map((p) => ({ name: p.name, slot: p.slot, SPD: p.SPD })) };
}

export function speedDomain({ us, them }) {
  const all = [...us, ...them].map((p) => p.SPD).filter(Boolean);
  const lo = Math.min(75, ...all);
  return [Math.floor(lo / 5) * 5, 100];
}

export function starterIndex(facts) {
  const m = new Map();
  for (const side of ['offense', 'defense', 'special'])
    for (const p of facts.starters[side]) m.set(p.name, { ...p, side });
  return m;
}
