// Situation blocks for the call sheet, per side.
// Each block: id, name, sub, color, optional match(ctx) used to auto-highlight
// the live situation from down/distance/field position.

const inOppRedZone = (c) => c.fieldSide === 'opp' && c.yardLine <= 20;
const inGoalLine = (c) => c.fieldSide === 'opp' && c.yardLine <= 5;
const backedUp = (c) => c.fieldSide === 'own' && c.yardLine <= 10;

export const OFFENSE = [
  { id: 'openers',  name: 'Openers',      sub: 'Script · First 15', color: '#2a4a7f' },
  { id: 'first',    name: '1st Down',     sub: '1st & 10',          color: '#2f7d4f', match: (c) => c.down === 1 },
  { id: '2short',   name: '2nd & Short',  sub: '2nd & 1–3',         color: '#1f7d77', match: (c) => c.down === 2 && c.distance <= 3 },
  { id: '2long',    name: '2nd & Long',   sub: '2nd & 4+',          color: '#45597e', match: (c) => c.down === 2 && c.distance >= 4 },
  { id: '3short',   name: '3rd & Short',  sub: '3rd & 1–2',         color: '#b3862a', match: (c) => c.down === 3 && c.distance <= 2 },
  { id: '3med',     name: '3rd & Med',    sub: '3rd & 3–6',         color: '#c0612a', match: (c) => c.down === 3 && c.distance >= 3 && c.distance <= 6 },
  { id: '3long',    name: '3rd & Long',   sub: '3rd & 7+',          color: '#b3392f', match: (c) => c.down === 3 && c.distance >= 7 },
  { id: 'shots',    name: 'Shot Plays',   sub: 'Take a shot',       color: '#6a4a9c' },
  { id: 'redzone',  name: 'Red Zone',     sub: 'Inside +20',        color: '#9c2f2f', match: inOppRedZone },
  { id: 'goalline', name: 'Goal Line',    sub: 'Inside +5',         color: '#7a2838', match: inGoalLine },
  { id: 'twomin',   name: '2-Minute',     sub: 'Hurry-up',          color: '#3a4a96' },
  { id: 'backedup', name: 'Backed Up',    sub: 'Own ≤10',           color: '#4a4940', match: backedUp },
];

export const DEFENSE = [
  // Personnel-first (Aug 2026): read their backfield/TE count pre-snap and
  // pick the personnel block; the blocks below those are situational
  // overlays. Personnel can't auto-highlight (the LIVE ctx only knows
  // down/distance/spot) — that read is yours.
  // Post-CFB27-1.006 your package persists vs no-huddle: Base / Tempo holds
  // the blind-safe calls you audible between when tempo hits.
  { id: 'base',     name: 'Base / Tempo',  sub: 'vs 11 · Blind-safe',     color: '#2a4a7f' },
  { id: 'vs10',     name: 'vs 10 / Empty', sub: '4+ WR — get light',      color: '#45597e' },
  { id: 'vs12',     name: 'vs 12 / 21',    sub: 'TE run threat · +1 box', color: '#2f7d4f' },
  { id: 'heavy',    name: 'vs 22 / 31',    sub: 'Heavy — never light',    color: '#4a4940' },
  { id: '3short',   name: 'Short Yardage', sub: '3rd/4th & 1–2',          color: '#b3862a', match: (c) => c.down >= 3 && c.distance <= 2 },
  { id: '3long',    name: 'Obvious Pass',  sub: '3rd & 7+ / 2nd & 12+',   color: '#b3392f', match: (c) => (c.down === 3 && c.distance >= 7) || (c.down === 2 && c.distance >= 12) },
  { id: 'pressure', name: 'Blitz / Heat',  sub: 'Bring pressure',         color: '#6a4a9c' },
  { id: 'redzone',  name: 'Red Zone',      sub: 'Inside +20',             color: '#9c2f2f', match: inOppRedZone },
  { id: 'goalline', name: 'Goal Line',     sub: 'Inside +5',              color: '#7a2838', match: inGoalLine },
  { id: 'prevent',  name: 'Prevent',       sub: '2-Min / Hail',           color: '#3a4a96' },
];

export const SITUATIONS = { offense: OFFENSE, defense: DEFENSE };
