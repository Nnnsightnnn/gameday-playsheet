import { describe, it, expect } from 'vitest';
import {
  rolesForSide,
  roleById,
  coreRatings,
  supportRatings,
  sortKey,
  confidenceOf,
  gradeSummary,
  rosterHoles,
  knowledgeGaps,
  unratedRoles,
  knowAverage,
  focusRole,
  anchorFor,
  readsByPhase,
  trapDigest,
} from '../roleModel';
import { planById } from '../../../data/personnelPlans';

const plan = planById('falcons-m27');

describe('role selection', () => {
  it('splits by side and returns everything for both', () => {
    const off = rolesForSide(plan, 'offense');
    const def = rolesForSide(plan, 'defense');
    expect(off.every((r) => r.side === 'offense')).toBe(true);
    expect(def.every((r) => r.side === 'defense')).toBe(true);
    expect(rolesForSide(plan, 'both').length).toBe(off.length + def.length);
    expect(rolesForSide(null, 'offense')).toEqual([]);
  });

  it('finds a role by id and returns null for a miss', () => {
    expect(roleById(plan, 'def.fs').pos).toBe('FS');
    expect(roleById(plan, 'nope')).toBeNull();
  });
});

describe('rating tiers', () => {
  const fs = roleById(plan, 'def.fs');

  it('separates core from support without dropping any rating', () => {
    expect(coreRatings(fs).length + supportRatings(fs).length).toBe(
      fs.ratings.length,
    );
    expect(coreRatings(fs).every((r) => r.tier === 'core')).toBe(true);
  });

  it('builds the sort key from core ratings in order', () => {
    expect(sortKey(fs)).toBe('ZCV → PRC');
    expect(sortKey({ ratings: [] })).toBe('—');
  });
});

describe('roster grading', () => {
  it('tallies grades and the total matches the role count', () => {
    const s = gradeSummary(plan, 'defense');
    expect(s.fit + s.stretch + s.hole).toBe(s.total);
    expect(s.total).toBe(rolesForSide(plan, 'defense').length);
  });

  it('lists holes before stretches', () => {
    const holes = rosterHoles(plan, 'defense');
    expect(holes.length).toBeGreaterThan(0);
    expect(holes[0].holder.grade).toBe('hole');
    const grades = holes.map((r) => r.holder.grade);
    expect(grades.lastIndexOf('hole')).toBeLessThan(
      grades.indexOf('stretch') === -1 ? Infinity : grades.indexOf('stretch'),
    );
    expect(holes.every((r) => r.holder.grade !== 'fit')).toBe(true);
  });
});

describe('knowledge tracking', () => {
  const know = {
    'def.fs': { rating: 5 },
    'def.mike': { rating: 2 },
    'def.1t': { rating: 2 },
    'def.cb1': { rating: 4 },
  };

  it('sorts gaps weakest first and ignores unrated roles', () => {
    const gaps = knowledgeGaps(plan, know, 'defense');
    expect(gaps.length).toBe(4);
    expect(gaps[0].rating).toBe(2);
    expect(gaps[gaps.length - 1].rating).toBe(5);
  });

  it('lists everything not yet rated', () => {
    const un = unratedRoles(plan, know, 'defense');
    expect(un.some((r) => r.id === 'def.fs')).toBe(false);
    expect(un.some((r) => r.id === 'def.will')).toBe(true);
  });

  it('averages only the rated roles', () => {
    expect(knowAverage(plan, know, 'defense')).toBe(3.3);
    expect(knowAverage(plan, {}, 'defense')).toBeNull();
  });

  it('breaks a knowledge tie toward the role the roster is worst at', () => {
    // def.mike is graded fit; def.1t is a roster hole. Both rated 2 — the
    // hole wins, because not knowing a role you can't staff costs more.
    const focus = focusRole(plan, know, 'defense');
    expect(focus.id).toBe('def.1t');
    expect(focus.rating).toBe(2);
  });

  it('returns no focus when nothing is rated', () => {
    expect(focusRole(plan, {}, 'defense')).toBeNull();
  });

  it('resolves anchors by value', () => {
    expect(anchorFor(1).label).toMatch(/No idea/);
    expect(anchorFor(9)).toBeNull();
  });
});

describe('in-game reads', () => {
  it('groups by phase in sideline order and filters by side', () => {
    const groups = readsByPhase(plan, 'defense');
    expect(groups.map((g) => g.phase)).toEqual([
      'Pre-snap read',
      'Between plays',
      'By drive',
    ]);
    groups.forEach((g) =>
      g.items.forEach((r) => expect(r.side).toBe('defense')),
    );
  });

  it('returns every read when no side is given', () => {
    const total = readsByPhase(plan, 'both').reduce(
      (n, g) => n + g.items.length,
      0,
    );
    expect(total).toBe(plan.inGame.length);
  });
});

describe('trap digest', () => {
  it('de-duplicates a rating flagged at more than one role', () => {
    const traps = trapDigest(plan, 'defense');
    const keys = traps.map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
    const pow = traps.find((t) => t.key === 'POW');
    expect(pow.roles.length).toBeGreaterThan(1);
  });
});

describe('confidence lookup', () => {
  it('resolves known levels and rejects unknown ones', () => {
    expect(confidenceOf('ea').label).toBe('EA / M27');
    expect(confidenceOf('made-up')).toBeNull();
  });
});
