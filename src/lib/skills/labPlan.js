// built by nnnsightnnn — signal from noise
// Lab Plan — turn the latest skill snapshot into a week of deliberate practice.
//
// The shape of a week: one focus skill, seven ~60-minute couch sessions.
// Baseline it, rep it, pressure-test it, rep what broke, pressure-test again,
// then review and re-rate. Sessions are numbered, not weekday-bound — rotating
// shifts don't care what day it is.

import { applyPlaybook, playbookFor } from './playbooks';

const SESSION_MINUTES = 60;

export function buildWeekPlan(skill, weekOf) {
  if (!skill) return null;
  const sessions = [
    {
      idx: 0,
      title: 'Baseline',
      goal: 'Get a starting number. You cannot know the week worked without a before picture.',
      blocks: [
        { min: 10, text: 'Warm-up: light, unscored reps of the drill to settle in.' },
        { min: 30, text: `Baseline drill — ${skill.drill} Record your starting number; this is the week's before picture.` },
        { min: 20, text: `One game with a single watch-item: ${skill.name}. Ignore the score; grade only that skill.` },
      ],
    },
    {
      idx: 1,
      title: 'Volume 1',
      goal: 'Build the habit with pure reps in a controlled setting — chase the elite marker.',
      blocks: [
        { min: 10, text: 'Warm-up reps.' },
        { min: 35, text: `Drill volume — chase the metric. Elite marker you're building toward: ${skill.elite}` },
        { min: 15, text: 'Short application: one half or scenario set, focus skill only.' },
      ],
    },
    {
      idx: 2,
      title: 'Volume 2 — vary the look',
      goal: 'Generalize the skill: change the pictures so you learn the read, not one look.',
      blocks: [
        { min: 10, text: 'Warm-up reps.' },
        { min: 35, text: 'Same drill, different pictures: vary the opposing calls, formations, or situations so the read generalizes instead of memorizing one look.' },
        { min: 15, text: 'Short application vs a look you have not practiced.' },
      ],
    },
    {
      idx: 3,
      title: 'Pressure test 1',
      goal: 'Find out what survives real opponents. The output is a list of what broke.',
      blocks: [
        { min: 10, text: 'Warm-up reps.' },
        { min: 45, text: 'Online/ranked game(s). Grade every rep of the focus skill live — a simple hit/miss count is enough.' },
        { min: 5, text: 'Write down exactly what broke under pressure. That list is the next session.' },
      ],
    },
    {
      idx: 4,
      title: 'Repair volume',
      goal: 'Fix only what broke under pressure — targeted repair, not general practice.',
      blocks: [
        { min: 10, text: 'Warm-up reps.' },
        { min: 35, text: 'Attack only what broke in Pressure test 1. Rep the specific failure until it stops failing.' },
        { min: 15, text: 'Short application to confirm the repair held.' },
      ],
    },
    {
      idx: 5,
      title: 'Pressure test 2',
      goal: 'Prove the repair held: beat your Pressure test 1 hit/miss count.',
      blocks: [
        { min: 10, text: 'Warm-up reps.' },
        { min: 45, text: 'Online/ranked again. Same live grading — compare your hit/miss count to Pressure test 1.' },
        { min: 5, text: 'Note the delta. Improvement here is the week working.' },
      ],
    },
    {
      idx: 6,
      title: 'Review + re-rate',
      goal: 'Measure the week against the baseline, re-rate the skill, then play for fun.',
      blocks: [
        { min: 15, text: 'Re-run the baseline drill. Compare to session 1: that number is your week.' },
        { min: 15, text: `Re-rate ${skill.name} in the Assess lens (save a snapshot) and skim the Gaps lens for next week's focus.` },
        { min: 30, text: 'Free play. Couch, family, no grading. You earned the fun game — protect it.' },
      ],
    },
  ].map((s) => ({ ...s, done: false, note: '' }));

  return applyPlaybook({
    weekOf,
    skillId: skill.id,
    skillName: skill.name,
    skillDrill: skill.drill,
    skillElite: skill.elite,
    sessions,
  });
}

// Plans are persisted, so a week generated before a playbook existed still
// holds the generic blocks. Resolve at render time and old weeks upgrade
// themselves without a rebuild.
export function resolvePlan(plan) {
  return plan && playbookFor(plan.skillId) ? applyPlaybook(plan) : plan;
}

export function planMinutes(plan) {
  return (plan?.sessions || []).reduce(
    (sum, s) => sum + s.blocks.reduce((a, b) => a + b.min, 0),
    0,
  );
}

export function sessionMinutes(session) {
  return (session?.blocks || []).reduce((a, b) => a + b.min, 0);
}

export const PLAN_SESSION_MINUTES = SESSION_MINUTES;
