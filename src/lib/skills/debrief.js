// built by nnnsightnnn — signal from noise
// Game Debrief — the two-minute post-game diagnosis.
//
// A game is worth exactly what you extract from it. The debrief is a fixed
// set of taps: what game, how it ended, whether the week's focus skill held,
// where the points leaked, what held, how long. Every leak/hold chip maps to
// a skill id in the taxonomy, so a handful of games become a ranked list of
// what to lab next — and a Log line the Vault note already knows how to count.

import { ALL_SKILLS, skillById } from '../../data/skills';

export const GAMES = [
  { id: 'madden', label: 'Madden 27' },
  { id: 'cfb', label: 'CFB 27' },
];

export const MODES = [
  { id: 'solo', label: 'Solo vs CPU', hint: 'lab, franchise, dynasty' },
  { id: 'h2h', label: 'Online H2H', hint: 'ranked, friends' },
];

export const RESULTS = [
  { id: 'W+', label: 'Comfortable W', win: true },
  { id: 'W', label: 'Close W', win: true },
  { id: 'L', label: 'Close L', win: false },
  { id: 'L-', label: 'Blowout L', win: false },
];

// How the active lab week's focus skill fared in this game.
export const FOCUS_OUTCOMES = [
  { id: 'held', label: 'Held', hint: 'did the job under live pressure' },
  { id: 'leaked', label: 'Leaked', hint: 'it broke, and I know where' },
  { id: 'untested', label: 'Not tested', hint: 'never came up' },
];

export const MINUTES = [30, 45, 60, 90];

// Leak chips. Plain-English symptoms, each pinned to the skill that owns the
// fix. `modes` limits a chip to solo or h2h; absent means both. Order matters:
// this is how they render, offense → defense → head.
export const LEAKS = [
  // ── Offense ──────────────────────────────────────────────────────────────
  { id: 'l.blind', side: 'off', label: 'Threw into coverage I never ID’d', skill: 'presnap.shell-id' },
  { id: 'l.manzone', side: 'off', label: 'Guessed man/zone wrong', skill: 'presnap.man-zone' },
  { id: 'l.sacks', side: 'off', label: 'Sacks / bailed the pocket early', skill: 'pass.pocket' },
  { id: 'l.forced', side: 'off', label: 'Forced the first read, INT', skill: 'pass.progressions' },
  { id: 'l.blitz', side: 'off', label: 'Blitz got home, no hot answer', skill: 'presnap.blitz-id' },
  { id: 'l.noanswer', side: 'off', label: 'No beater for their coverage', skill: 'pass.zone-beaters' },
  { id: 'l.run', side: 'off', label: 'Run game went nowhere', skill: 'run.lane-id' },
  { id: 'l.redzone', side: 'off', label: 'Stalled in the red zone', skill: 'sch.core' },
  // ── Defense ──────────────────────────────────────────────────────────────
  { id: 'd.deep', side: 'def', label: 'Gave up the deep middle / post', skill: 'usr.safety' },
  { id: 'd.crossers', side: 'def', label: 'Crossers / drags ate me alive', skill: 'usr.mlb' },
  { id: 'd.switch', side: 'def', label: 'Switched late, wrong player', skill: 'usr.switch-stick' },
  { id: 'd.bait', side: 'def', label: 'Bit on the bait, left my zone', skill: 'usr.bait' },
  { id: 'd.run', side: 'def', label: 'Got run on, never adjusted', skill: 'sch.adjustments' },
  { id: 'd.money', side: 'def', label: 'Same play beat me 3+ times', skill: 'sch.counterpunch', modes: ['h2h'] },
  { id: 'd.mismatch', side: 'def', label: 'They hunted one matchup all game', skill: 'sch.matchups', modes: ['h2h'] },
  { id: 'd.disguise', side: 'def', label: 'My looks were readable pre-snap', skill: 'sch.disguise', modes: ['h2h'] },
  // ── Head ─────────────────────────────────────────────────────────────────
  { id: 'h.tilt', side: 'head', label: 'Tilted — chased points, sped up', skill: 'mind.tilt' },
  { id: 'h.clock', side: 'head', label: 'Clock / timeouts cost me', skill: 'mgmt.clock' },
  { id: 'h.fourth', side: 'head', label: '4th-down / 2-pt call was wrong', skill: 'mgmt.fourth' },
  { id: 'h.tempo', side: 'head', label: 'Lost the tempo battle', skill: 'mgmt.clock', modes: ['h2h'] },
];

// What held. Fewer chips: the point is to notice a win, not catalogue it.
export const HOLDS = [
  { id: 'w.shell', side: 'off', label: 'Read the shell, threw where it wasn’t', skill: 'presnap.shell-id' },
  { id: 'w.pocket', side: 'off', label: 'Stayed in the pocket, hit the 2nd read', skill: 'pass.progressions' },
  { id: 'w.run', side: 'off', label: 'Run game carried drives', skill: 'run.lane-id' },
  { id: 'w.safety', side: 'def', label: 'Deep middle stayed closed', skill: 'usr.safety' },
  { id: 'w.mlb', side: 'def', label: 'User took away the middle', skill: 'usr.mlb' },
  { id: 'w.counter', side: 'def', label: 'Killed their money play', skill: 'sch.counterpunch' },
  { id: 'w.calm', side: 'head', label: 'Stayed level after a bad break', skill: 'mind.tilt' },
  { id: 'w.clock', side: 'head', label: 'Managed the clock on purpose', skill: 'mgmt.clock' },
];

export const SIDES = [
  { id: 'off', label: 'Offense' },
  { id: 'def', label: 'Defense' },
  { id: 'head', label: 'Head' },
];

export const MAX_LEAKS = 3;
export const MAX_HOLDS = 2;

export const chipsForMode = (chips, mode) =>
  chips.filter((c) => !c.modes || c.modes.includes(mode));

export const leakById = (id) => LEAKS.find((l) => l.id === id);
export const holdById = (id) => HOLDS.find((h) => h.id === id);

export function emptyDebrief(defaults = {}) {
  return {
    game: defaults.game || 'madden',
    mode: defaults.mode || 'solo',
    result: null,
    focusSkillId: defaults.focusSkillId || null,
    focusOutcome: null,
    leaks: [],
    holds: [],
    minutes: 60,
    opponent: '',
    note: '',
    playedAt: defaults.playedAt || new Date().toISOString(),
  };
}

// A debrief is complete once the parts that feed the recommendation exist.
export function isComplete(d) {
  return Boolean(d && d.game && d.mode && d.result && (d.leaks.length || d.holds.length || d.note));
}

// ── Recommendation ─────────────────────────────────────────────────────────
// Weight leaks by recency (last WINDOW games count full, older count half),
// bump high-leverage skills, and let a "held" chip pull the score back down.
// A "leaked" focus outcome counts as a leak on the focus skill.

const RECENT = 4;
const LOOKBACK = 10;

export function skillSignals(debriefs) {
  const rows = (debriefs || []).slice(0, LOOKBACK); // newest-first
  const acc = new Map();
  const bump = (skillId, w, kind, i) => {
    if (!skillId || !skillById(skillId)) return;
    const cur = acc.get(skillId) || { skillId, score: 0, leaks: 0, holds: 0, games: new Set() };
    cur.score += w;
    if (kind === 'leak') cur.leaks += 1;
    else cur.holds += 1;
    cur.games.add(i);
    acc.set(skillId, cur);
  };
  rows.forEach((d, i) => {
    const recency = i < RECENT ? 1 : 0.5;
    d.leaks.forEach((id) => {
      const l = leakById(id);
      if (l) bump(l.skill, recency, 'leak', i);
    });
    if (d.focusOutcome === 'leaked' && d.focusSkillId) bump(d.focusSkillId, recency, 'leak', i);
    d.holds.forEach((id) => {
      const h = holdById(id);
      if (h) bump(h.skill, -0.5 * recency, 'hold', i);
    });
    if (d.focusOutcome === 'held' && d.focusSkillId) bump(d.focusSkillId, -0.5 * recency, 'hold', i);
  });
  return [...acc.values()]
    .map((s) => {
      const skill = skillById(s.skillId);
      const leverage = Boolean(skill?.leverage);
      return {
        ...s,
        games: s.games.size,
        leverage,
        name: skill?.name || s.skillId,
        score: Math.round(s.score * (leverage ? 1.25 : 1) * 100) / 100,
      };
    })
    .sort((a, b) => b.score - a.score || b.leaks - a.leaks || a.name.localeCompare(b.name));
}

// The single recommended next focus, with a reason a human can act on.
export function recommendFocus(debriefs, activeSkillId) {
  const signals = skillSignals(debriefs);
  const top = signals.find((s) => s.score > 0);
  if (!top) return null;
  const n = Math.min((debriefs || []).length, LOOKBACK);
  const skill = skillById(top.skillId);
  const same = activeSkillId === top.skillId;
  return {
    skill,
    signal: top,
    same,
    reason: same
      ? `Still leaking — ${top.leaks} of your last ${n} game${n === 1 ? '' : 's'}. Stay on it; the repair is not automatic yet.`
      : `Leaked in ${top.leaks} of your last ${n} game${n === 1 ? '' : 's'}${top.holds ? `, held in ${top.holds}` : ''}.${skill?.leverage ? ' High-leverage skill.' : ''}`,
  };
}

// ── Vault export ───────────────────────────────────────────────────────────
// Matches the Log contract in Notes/10 Projects/Madden-Elite.md:
//   YYYY-MM-DD · game|study · Nm · what you learned
export function vaultLine(d) {
  const day = (d.playedAt || '').slice(0, 10);
  const g = d.game === 'cfb' ? 'CFB' : 'M27';
  const mode = d.mode === 'h2h' ? 'H2H' : 'CPU';
  const res = RESULTS.find((r) => r.id === d.result)?.label || '?';
  const parts = [`${g} ${mode} ${res}`];
  const fs = d.focusSkillId ? skillById(d.focusSkillId) : null;
  if (fs && d.focusOutcome) parts.push(`focus ${fs.name.toLowerCase()}: ${d.focusOutcome}`);
  if (d.leaks.length) parts.push(`leaked: ${d.leaks.map((id) => leakById(id)?.label).filter(Boolean).join('; ')}`);
  if (d.holds.length) parts.push(`held: ${d.holds.map((id) => holdById(id)?.label).filter(Boolean).join('; ')}`);
  if (d.opponent) parts.push(`vs ${d.opponent}`);
  if (d.note) parts.push(d.note.trim());
  return `- ${day} · game · ${d.minutes}m · ${parts.join(' · ')}`;
}

export function vaultBlock(debriefs) {
  return [...(debriefs || [])]
    .sort((a, b) => a.playedAt.localeCompare(b.playedAt))
    .map(vaultLine)
    .join('\n');
}

// Sanity: every chip must point at a real skill. Tests pin this.
export const chipSkillIds = () =>
  [...LEAKS, ...HOLDS].map((c) => c.skill).filter((id) => !ALL_SKILLS.some((s) => s.id === id));
