// Lab plan builder — the week's structure is the product; pin it.
import { describe, it, expect } from 'vitest';
import { buildWeekPlan, planMinutes, sessionMinutes } from '../labPlan';
import { skillById } from '../../../data/skills';

const skill = skillById('presnap.shell-id');

describe('buildWeekPlan', () => {
  const plan = buildWeekPlan(skill, '2026-08-12');

  it('returns null without a skill', () => {
    expect(buildWeekPlan(null, '2026-08-12')).toBeNull();
  });

  it('carries the skill payload and week', () => {
    expect(plan.weekOf).toBe('2026-08-12');
    expect(plan.skillId).toBe('presnap.shell-id');
    expect(plan.skillName).toBe(skill.name);
    expect(plan.skillElite).toBe(skill.elite);
  });

  it('has 7 sessions of exactly 60 minutes each, ~8h total', () => {
    expect(plan.sessions.length).toBe(7);
    for (const s of plan.sessions) {
      expect(sessionMinutes(s), s.title).toBe(60);
      expect(s.blocks.length).toBeGreaterThanOrEqual(2);
      expect(s.done).toBe(false);
      expect(s.note).toBe('');
    }
    expect(planMinutes(plan)).toBe(420);
  });

  it('follows the deliberate-practice arc: baseline → pressure → review', () => {
    const titles = plan.sessions.map((s) => s.title.toLowerCase());
    expect(titles[0]).toContain('baseline');
    expect(titles.filter((t) => t.includes('pressure')).length).toBe(2);
    expect(titles[6]).toContain('re-rate');
  });

  it('embeds the drill and elite marker into session text', () => {
    const allText = plan.sessions
      .flatMap((s) => s.blocks.map((b) => b.text))
      .join(' ');
    expect(allText).toContain(skill.drill);
    expect(allText).toContain(skill.elite);
    expect(allText).toContain(skill.name);
  });

  it('session indexes are sequential and unique', () => {
    expect(plan.sessions.map((s) => s.idx)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});
