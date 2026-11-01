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
  NEW_THREAT,
  answersFor,
  normalizeDebrief,
  threatBoard,
  threatsForGame,
} from '../debrief';
import { packagesForGame } from '../../../data/packages';

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

describe('threat faced', () => {
  const faced = (over) => ({ threatId: 'm27-o-clamp', note: '', packageId: null, call: 'Cover 3 Cloud', outcome: 'stopped', ...over });
  const h2h = (over) => mk({ mode: 'h2h', faced: faced(), ...over });

  it('rows saved before this field existed still work', () => {
    const { faced: _gone, ...old } = mk({ mode: 'h2h', leaks: ['d.deep'] });
    expect(isComplete(old)).toBe(true);
    expect(vaultLine(old)).not.toMatch(/faced/);
    expect(threatBoard([old], 'madden')).toEqual([]);
    expect(normalizeDebrief(old).faced).toBeUndefined();
  });
  it('a CPU game never counts as what opponents run', () => {
    expect(normalizeDebrief(h2h({ mode: 'solo' })).faced).toBeUndefined();
    expect(threatBoard([h2h({ mode: 'solo' })], 'madden')).toEqual([]);
  });
  it('a threat left over from the other game is dropped', () => {
    expect(normalizeDebrief(h2h({ game: 'cfb' })).faced).toBeUndefined();
  });
  it('an untouched step saves nothing and does not complete the form', () => {
    const d = mk({ mode: 'h2h' });
    expect(normalizeDebrief(d).faced).toBeUndefined();
    expect(isComplete(d)).toBe(false);
  });
  it('naming a threat is enough to complete the form', () => {
    expect(isComplete(h2h())).toBe(true);
  });
  it('no answer clears any call that was typed first', () => {
    const f = normalizeDebrief(h2h({ faced: faced({ outcome: 'noanswer', packageId: 'x' }) })).faced;
    expect(f.call).toBe('');
    expect(f.packageId).toBeNull();
    expect(vaultLine(h2h({ faced: f }))).toMatch(/faced Clamp Stack \+ motion shuffle: no answer/);
  });
  it('the log line names the threat, call and outcome', () => {
    expect(vaultLine(h2h())).toMatch(/faced Clamp Stack \+ motion shuffle, called Cover 3 Cloud: stopped it/);
  });
  it('a new threat keeps its note and shows it in the log', () => {
    const d = normalizeDebrief(h2h({ faced: faced({ threatId: NEW_THREAT, note: ' Bunch TE stick ' }) }));
    expect(d.faced.note).toBe('Bunch TE stick');
    expect(vaultLine(d)).toMatch(/faced new: Bunch TE stick/);
  });
  it('the board counts games, record and calls per threat, most faced first', () => {
    const rows = [
      h2h({ result: 'W' }),
      h2h({ result: 'L', faced: faced({ outcome: 'failed' }) }),
      h2h({ result: 'W', faced: faced({ threatId: 'm27-d-match', call: '' }) }),
      h2h({ game: 'cfb', faced: faced({ threatId: 'cfb-o-power' }) }),
    ];
    const board = threatBoard(rows, 'madden');
    expect(board.map((t) => t.key)).toEqual(['m27-o-clamp', 'm27-d-match']);
    expect(board[0]).toMatchObject({ games: 2, wins: 1, outcomes: { stopped: 1, failed: 1 } });
    expect(board[0].calls[0]).toMatchObject({ call: 'Cover 3 Cloud', games: 2, stopped: 1, failed: 1 });
  });
  it('the same new threat typed twice groups together', () => {
    const rows = [
      h2h({ faced: faced({ threatId: NEW_THREAT, note: 'Bunch TE' }) }),
      h2h({ faced: faced({ threatId: NEW_THREAT, note: 'bunch te ' }) }),
    ];
    expect(threatBoard(rows, 'madden')[0].games).toBe(2);
  });
  it('every Madden threat is offered, and curated packages resolve as answers', () => {
    expect(threatsForGame('madden').length).toBeGreaterThan(0);
    const answers = answersFor('m27-o-clamp', packagesForGame('madden'));
    expect(answers.length).toBeGreaterThan(0);
    expect(answers.every((p) => p.name)).toBe(true);
  });
});
