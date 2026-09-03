import { describe, it, expect } from 'vitest';
import {
  LEAKS,
  HOLDS,
  chipSkillIds,
  chipsForMode,
  emptyDebrief,
  isComplete,
  skillSignals,
  recommendFocus,
  vaultLine,
  MAX_LEAKS,
} from '../debrief';

const mk = (over) => ({ ...emptyDebrief({ playedAt: '2026-09-03T02:00:00.000Z' }), result: 'L', ...over });

describe('debrief chips', () => {
  it('every leak and hold chip maps to a real skill id', () => {
    expect(chipSkillIds()).toEqual([]);
  });
  it('chip ids are unique', () => {
    const ids = [...LEAKS, ...HOLDS].map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('h2h-only chips are hidden from solo', () => {
    const solo = chipsForMode(LEAKS, 'solo');
    expect(solo.some((c) => c.id === 'd.money')).toBe(false);
    expect(chipsForMode(LEAKS, 'h2h').some((c) => c.id === 'd.money')).toBe(true);
  });
  it('a debrief with a result and at least one chip is complete', () => {
    expect(isComplete(mk({}))).toBe(false);
    expect(isComplete(mk({ leaks: ['d.deep'] }))).toBe(true);
    expect(MAX_LEAKS).toBe(3);
  });
});

describe('recommendation', () => {
  it('ranks the skill that leaks most, recency-weighted', () => {
    const rows = [
      mk({ leaks: ['d.deep', 'h.tilt'] }),
      mk({ leaks: ['d.deep'] }),
      mk({ leaks: ['l.sacks'] }),
    ];
    const rec = recommendFocus(rows, null);
    expect(rec.skill.id).toBe('usr.safety');
    expect(rec.reason).toMatch(/2 of your last 3/);
    expect(rec.same).toBe(false);
  });
  it('a held chip pulls the score back down', () => {
    const rows = [mk({ leaks: ['d.deep'], holds: ['w.safety'] }), mk({ leaks: ['l.sacks'] })];
    const sig = skillSignals(rows);
    expect(sig[0].skillId).toBe('pass.pocket');
  });
  it('a leaked focus outcome counts against the focus skill', () => {
    const rows = [mk({ focusSkillId: 'usr.mlb', focusOutcome: 'leaked' })];
    expect(recommendFocus(rows, 'usr.mlb').same).toBe(true);
  });
  it('returns null with nothing to say', () => {
    expect(recommendFocus([], null)).toBeNull();
    expect(recommendFocus([mk({ holds: ['w.calm'] })], null)).toBeNull();
  });
});

describe('vault export', () => {
  it('matches the Madden-Elite.md log contract', () => {
    const line = vaultLine(
      mk({ game: 'madden', mode: 'h2h', result: 'L', minutes: 45, leaks: ['d.deep'], holds: ['w.calm'], note: 'post killed me' }),
    );
    expect(line).toMatch(/^- 2026-09-03 · game · 45m · M27 H2H Close L · leaked: /);
    expect(line).toContain('held: Stayed level after a bad break');
    expect(line.endsWith('· post killed me')).toBe(true);
  });
});
