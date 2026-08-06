// built by nnnsightnnn — signal from noise
// Learn track validation.
//
// The curriculum is data, and data drifts. These tests pin every lesson to the
// engine it teaches about: setups must reference real coverages, formations
// and concepts; quizzes must be answerable; and the specific engine facts the
// lesson text asserts (Palms trap triggers, poach rules, corner = VERT) must
// still be true after any rule edit.

import { describe, it, expect } from 'vitest';
import { MODULES, ALL_LESSONS, lessonById, missKey, questionForMiss } from '../lessons';
import { COVERAGES } from '../coverages';
import { FORMATIONS } from '../formations';
import { CONCEPTS } from '../concepts';
import { classify } from '../routes';

describe('lesson curriculum integrity', () => {
  it('has modules with at least one lesson each', () => {
    expect(MODULES.length).toBeGreaterThanOrEqual(3);
    MODULES.forEach((m) => {
      expect(m.lessons.length).toBeGreaterThan(0);
      expect(m.name.length).toBeGreaterThan(0);
    });
  });

  it('lesson ids are unique', () => {
    const ids = ALL_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  ALL_LESSONS.forEach((lesson) => {
    describe(`lesson "${lesson.id}"`, () => {
      it('pins the lab to a valid snap', () => {
        expect(['study', 'compare']).toContain(lesson.setup.view);
        expect(COVERAGES[lesson.setup.coverage]).toBeTruthy();
        expect(FORMATIONS[lesson.setup.formation]).toBeTruthy();
        expect(CONCEPTS[lesson.setup.concept]).toBeTruthy();
        if (lesson.setup.view === 'compare') {
          expect(COVERAGES[lesson.setup.compareWith]).toBeTruthy();
          expect(lesson.setup.compareWith).not.toBe(lesson.setup.coverage);
        }
      });

      it('teaches and checks', () => {
        expect(lesson.why.length).toBeGreaterThan(20);
        expect(lesson.teach.length).toBeGreaterThan(0);
        expect(lesson.watch.length).toBeGreaterThan(20);
        expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);
        lesson.quiz.forEach((q) => {
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          expect(q.answer).toBeGreaterThanOrEqual(0);
          expect(q.answer).toBeLessThan(q.options.length);
          expect(q.explain.length).toBeGreaterThan(20);
        });
      });
    });
  });
});

describe('lesson content agrees with the engine', () => {
  it('corner routes classify VERT, so the Palms trap must not fire on Smash', () => {
    // The "smash-stress" lesson teaches exactly this.
    expect(classify('corner')).toBe('VERT');
    expect(classify('flat')).toBe('OUT');
    expect(classify('out')).toBe('OUT');
  });

  it('the trigger concept for the Palms lesson actually breaks #2 out', () => {
    const lesson = lessonById('palms-trigger');
    const cpt = CONCEPTS[lesson.setup.concept];
    expect(classify(cpt.r.R2)).toBe('OUT');
  });

  it('the Solo lesson concept sends #3 vertical so the poach fires', () => {
    const lesson = lessonById('solo-poach');
    const cpt = CONCEPTS[lesson.setup.concept];
    expect(classify(cpt.r.R3)).toBe('VERT');
  });

  it('the seam-player lesson (Dagger) sends #2 vertical for the carry', () => {
    const lesson = lessonById('seam-player');
    const cpt = CONCEPTS[lesson.setup.concept];
    expect(classify(cpt.r.R2)).toBe('VERT');
  });
});

describe('miss-key round trip', () => {
  it('encodes and decodes back to the same question', () => {
    const lesson = ALL_LESSONS[0];
    const key = missKey(lesson.id, 1);
    const info = questionForMiss(key);
    expect(info.lesson.id).toBe(lesson.id);
    expect(info.qIdx).toBe(1);
    expect(info.question).toBe(lesson.quiz[1]);
  });

  it('returns null for stale keys', () => {
    expect(questionForMiss('deleted-lesson:0')).toBeNull();
    expect(questionForMiss(`${ALL_LESSONS[0].id}:99`)).toBeNull();
  });
});
