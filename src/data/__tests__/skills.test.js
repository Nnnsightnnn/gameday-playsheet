// Skill taxonomy integrity — the assessment is only as good as its skeleton.
import { describe, it, expect } from 'vitest';
import {
  SKILL_CATEGORIES,
  ALL_SKILLS,
  RATING_ANCHORS,
  skillsForGame,
  categoryAverages,
  gapList,
  focusSkill,
} from '../skills';

describe('skill taxonomy', () => {
  it('has at least 5 categories with 3+ skills each', () => {
    expect(SKILL_CATEGORIES.length).toBeGreaterThanOrEqual(5);
    for (const c of SKILL_CATEGORIES) {
      expect(c.skills.length, c.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('every skill has unique id and the full teaching payload', () => {
    const ids = new Set();
    for (const s of ALL_SKILLS) {
      expect(ids.has(s.id), `duplicate id ${s.id}`).toBe(false);
      ids.add(s.id);
      expect(s.name.length).toBeGreaterThan(2);
      expect(s.def.length, s.id).toBeGreaterThanOrEqual(25);
      expect(s.elite.length, s.id).toBeGreaterThanOrEqual(25);
      expect(s.drill.length, s.id).toBeGreaterThanOrEqual(25);
      expect(['both', 'madden', 'cfb']).toContain(s.games);
    }
  });

  it('has a 1-5 rating scale with labeled anchors', () => {
    expect(RATING_ANCHORS.map((a) => a.value)).toEqual([1, 2, 3, 4, 5]);
    for (const a of RATING_ANCHORS) expect(a.label.length).toBeGreaterThan(3);
  });

  it('marks a small set of high-leverage skills, spread across categories', () => {
    const lev = ALL_SKILLS.filter((s) => s.leverage);
    expect(lev.length).toBeGreaterThanOrEqual(5);
    expect(lev.length).toBeLessThanOrEqual(10);
    expect(new Set(lev.map((s) => s.catId)).size).toBeGreaterThanOrEqual(4);
  });

  it('game filters include shared skills and exclude the other game', () => {
    const cfb = skillsForGame('cfb');
    const madden = skillsForGame('madden');
    expect(cfb.some((s) => s.id === 'run.option')).toBe(true);
    expect(madden.some((s) => s.id === 'run.option')).toBe(false);
    expect(madden.some((s) => s.id === 'presnap.shell-id')).toBe(true);
    expect(skillsForGame('both').length).toBe(ALL_SKILLS.length);
  });

  it('gap math: weakest first, leverage floats ties, focus prefers leverage', () => {
    const ratings = {
      'presnap.shell-id': 2, // leverage
      'pass.mechanics': 2, // not leverage — same rating
      'usr.mlb': 4,
      'sch.core': 1,
    };
    const gaps = gapList(ratings);
    expect(gaps[0].id).toBe('sch.core');
    const twos = gaps.filter((s) => s.rating === 2).map((s) => s.id);
    expect(twos[0]).toBe('presnap.shell-id');
    expect(focusSkill(ratings).id).toBe('presnap.shell-id');
  });

  it('category averages skip unrated skills and round to one decimal', () => {
    const avgs = categoryAverages({ 'presnap.shell-id': 3, 'presnap.man-zone': 4 });
    const presnap = avgs.find((c) => c.id === 'presnap');
    expect(presnap.avg).toBe(3.5);
    expect(presnap.rated).toBe(2);
    const empty = avgs.find((c) => c.id === 'usr');
    expect(empty.avg).toBeNull();
  });
});
