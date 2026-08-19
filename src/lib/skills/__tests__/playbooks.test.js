// Skill playbooks — a playbook may enrich a week, never break its shape.
import { describe, it, expect } from 'vitest';
import { SKILL_PLAYBOOKS, playbookFor, applyPlaybook } from '../playbooks';
import { buildWeekPlan, planMinutes, sessionMinutes } from '../labPlan';
import { skillById, ALL_SKILLS } from '../../../data/skills';

describe('playbook integrity', () => {
  it('every playbook keys a real skill and carries the teaching payload', () => {
    const ids = new Set(ALL_SKILLS.map((s) => s.id));
    for (const [key, pb] of Object.entries(SKILL_PLAYBOOKS)) {
      expect(ids.has(key), `unknown skill id ${key}`).toBe(true);
      expect(pb.skillId).toBe(key);
      expect(pb.label.length).toBeGreaterThan(4);
      expect(pb.premise.length).toBeGreaterThanOrEqual(40);
      expect(pb.watch.length).toBeGreaterThanOrEqual(40);
      expect(pb.setup.length).toBeGreaterThanOrEqual(3);
      expect(pb.cues.length).toBeGreaterThanOrEqual(4);
      for (const s of pb.setup) {
        expect(s.label.length).toBeGreaterThan(1);
        expect(s.text.length).toBeGreaterThanOrEqual(25);
      }
      for (const c of pb.cues) expect(c.length).toBeGreaterThanOrEqual(25);
    }
  });

  it('playbook sessions stay inside the 60-minute session budget', () => {
    for (const pb of Object.values(SKILL_PLAYBOOKS)) {
      for (const [idx, s] of Object.entries(pb.sessions)) {
        const mins = s.blocks.reduce((a, b) => a + b.min, 0);
        expect(mins, `${pb.skillId} s${idx}`).toBe(60);
        expect(s.metric.length, `${pb.skillId} s${idx}`).toBeGreaterThanOrEqual(25);
        expect(s.goal.length, `${pb.skillId} s${idx}`).toBeGreaterThanOrEqual(25);
      }
      const idxs = Object.keys(pb.sessions).map(Number);
      for (const i of idxs) expect(i).toBeGreaterThanOrEqual(0);
      expect(Math.max(...idxs)).toBeLessThanOrEqual(6);
    }
  });

  it('playbookFor returns null for a skill with no playbook', () => {
    expect(playbookFor('presnap.shell-id')).toBeNull();
    expect(playbookFor('nope')).toBeNull();
  });
});

describe('safety-user week', () => {
  const plan = buildWeekPlan(skillById('usr.safety'), '2026-08-19');

  it('still builds a 7 x 60 minute week', () => {
    expect(plan.sessions.length).toBe(7);
    expect(planMinutes(plan)).toBe(420);
    for (const s of plan.sessions) expect(sessionMinutes(s)).toBe(60);
  });

  it('keeps the deliberate-practice spine but swaps in real drills', () => {
    const titles = plan.sessions.map((s) => s.title.toLowerCase());
    expect(titles[0]).toContain('baseline');
    expect(titles.filter((t) => t.includes('pressure')).length).toBe(2);
    expect(plan.playbookId).toBe('usr.safety');
    const allText = plan.sessions.flatMap((s) => s.blocks.map((b) => b.text)).join(' ');
    expect(allText).toContain('DEEP MIDDLE 30');
    expect(allText).toContain('Bates');
    expect(allText).not.toContain('Warm-up reps.');
  });

  it('every session ships a countable metric and stays checkable', () => {
    for (const s of plan.sessions) {
      expect(typeof s.metric, s.title).toBe('string');
      expect(s.done).toBe(false);
      expect(s.note).toBe('');
      expect(s.idx).toBeGreaterThanOrEqual(0);
    }
  });

  it('applyPlaybook is idempotent and leaves unknown skills alone', () => {
    expect(applyPlaybook(applyPlaybook(plan))).toEqual(applyPlaybook(plan));
    const generic = buildWeekPlan(skillById('presnap.shell-id'), '2026-08-19');
    expect(applyPlaybook(generic)).toEqual(generic);
    expect(applyPlaybook(null)).toBeNull();
  });
});
