// built by nnnsightnnn — signal from noise
// Coverage Lab engine tests.
//
// These lock down the FOOTBALL, not the rendering: the value of the lab is that
// two coverages diverge exactly where the rules say they should and nowhere
// else. If a rule edit accidentally makes Palms differ from Quarters against
// four verticals, that is a bug and these tests catch it.

import { describe, it, expect } from 'vitest';
import {
  makeContext,
  buildDefense,
  defenderAt,
  divergingPositions,
} from '../engine';
import { COVERAGES } from '../coverages';
import { FORMATIONS } from '../formations';
import { CONCEPTS } from '../concepts';
import { differenceFor } from '../differences';
import { ballYards, FIELD_W } from '../labField';

const COV_IDS = Object.keys(COVERAGES);
const FORM_IDS = Object.keys(FORMATIONS);
const CPT_IDS = Object.keys(CONCEPTS);

const ctxFor = (formation, concept, opts = {}) =>
  makeContext({
    formation,
    concept,
    ball: ballYards(opts.ruleset || 'ncaa', opts.ballSpot || 'left'),
    flip: opts.flip || false,
  });

describe('coverage engine — structural soundness', () => {
  it('resolves every coverage against every formation and concept', () => {
    const problems = [];
    for (const f of FORM_IDS) {
      for (const c of CPT_IDS) {
        const ctx = ctxFor(f, c);
        for (const id of COV_IDS) {
          const defense = buildDefense(id, ctx);
          if (defense.length < 6) problems.push(`${id}/${f}: only ${defense.length} defenders`);
          for (const d of defense) {
            if (!d.rule || d.rule.length < 25) problems.push(`${id}: thin rule on ${d.p}`);
            if (Number.isNaN(d.align.x) || Number.isNaN(d.align.y)) {
              problems.push(`${id}/${f}: bad alignment for ${d.p}`);
            }
            if (d.align.x < 0 || d.align.x > FIELD_W) {
              problems.push(`${id}/${f}: ${d.p} aligned off the field`);
            }
            if ((d.res.mode === 'man' || d.res.mode === 'match') && !ctx.g(d.res.key)) {
              problems.push(`${id}/${f}/${c}: ${d.p} keys missing receiver ${d.res.key}`);
            }
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('never produces a NaN position across the whole snap', () => {
    const problems = [];
    for (const f of FORM_IDS) {
      const ctx = ctxFor(f, 'flood');
      for (const id of COV_IDS) {
        for (const d of buildDefense(id, ctx)) {
          for (let t = 0; t <= 1.0001; t += 0.05) {
            const p = defenderAt(d, ctx, t);
            if (Number.isNaN(p.x) || Number.isNaN(p.y)) problems.push(`${id}/${f}/${d.p}@${t}`);
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('gives every defender a unique label so compare-mode diffing lines up', () => {
    for (const f of FORM_IDS) {
      const ctx = ctxFor(f, 'verts');
      for (const id of COV_IDS) {
        const labels = buildDefense(id, ctx).map((d) => d.p);
        expect(new Set(labels).size).toBe(labels.length);
      }
    }
  });

  it('never puts two defenders on the same receiver by accident', () => {
    // Doubling is a real coaching tool, but it has to be deliberate. Only the
    // explicitly-bracketed calls are allowed to key one receiver twice.
    const bracketing = new Set([]);
    const problems = [];
    for (const f of FORM_IDS) {
      for (const c of CPT_IDS) {
        const ctx = ctxFor(f, c);
        for (const id of COV_IDS) {
          if (bracketing.has(id)) continue;
          const keys = buildDefense(id, ctx)
            .filter((d) => d.res.mode === 'man' || d.res.mode === 'match')
            .map((d) => d.res.key);
          const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
          if (dupes.length) problems.push(`${id}/${f}/${c}: doubled ${[...new Set(dupes)].join(',')}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('keeps defenders from converging on the same point at the end of the snap', () => {
    // Genuine brackets are allowed — two defenders SHOULD end up on top of a
    // bunch corner route in Cover 3 Match. Anything else is a rules collision.
    const ALLOWED_BRACKETS = new Set([
      'c3match/bunch/smash: CB R~SS R', // third corner + seam carry = the bracket smash creates
    ]);
    const problems = [];
    for (const f of FORM_IDS) {
      for (const c of CPT_IDS) {
        const ctx = ctxFor(f, c);
        for (const id of COV_IDS) {
          const defense = buildDefense(id, ctx);
          const pts = defense.map((d) => ({ p: d.p, ...defenderAt(d, ctx, 1) }));
          for (let i = 0; i < pts.length; i += 1) {
            for (let j = i + 1; j < pts.length; j += 1) {
              if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) < 0.9) {
                const key = `${id}/${f}/${c}: ${pts[i].p}~${pts[j].p}`;
                if (!ALLOWED_BRACKETS.has(key)) problems.push(key);
              }
            }
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('does not stack two defenders on the same pre-snap spot', () => {
    const problems = [];
    for (const f of FORM_IDS) {
      const ctx = ctxFor(f, 'verts');
      for (const id of COV_IDS) {
        const defense = buildDefense(id, ctx);
        for (let i = 0; i < defense.length; i += 1) {
          for (let j = i + 1; j < defense.length; j += 1) {
            const a = defense[i].align;
            const b = defense[j].align;
            if (Math.hypot(a.x - b.x, a.y - b.y) < 1.2) {
              problems.push(`${id}/${f}: ${defense[i].p} overlaps ${defense[j].p}`);
            }
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('coverage engine — the football', () => {
  const diverge = (a, b, f, c, opts) => {
    const ctx = ctxFor(f, c, opts);
    return divergingPositions(buildDefense(a, ctx), buildDefense(b, ctx));
  };

  it('Palms is indistinguishable from Quarters when #2 releases vertical', () => {
    expect(diverge('c4', 'palms', 'doubles', 'verts')).toEqual([]);
    expect(diverge('c4', 'palms', 'doubles', 'smash')).toEqual([]);
  });

  it('Palms flips BOTH the corner and the safety when #2 breaks out', () => {
    const d = diverge('c4', 'palms', 'doubles', 'curlflat');
    expect(d).toContain('CB R');
    expect(d).toContain('S R');
    expect(d).toContain('CB L');
    expect(d).toContain('S L');
    // the apex and the Mike are untouched by the Palms trigger
    expect(d).not.toContain('MIKE');
  });

  it('the bubble RPO fires the same Palms trigger as stick-flat', () => {
    expect(diverge('c4', 'palms', 'doubles', 'bubble')).toContain('CB R');
  });

  it('Cover 2 and Tampa 2 differ only in the Mike', () => {
    expect(diverge('c2', 'tampa2', 'doubles', 'verts')).toEqual(['MIKE']);
  });

  it('Sky and Buzz differ only in the rotated safety and the Mike he helps', () => {
    const d = diverge('c3sky', 'c3buzz', 'doubles', 'dagger');
    expect(d).toContain('SS');
    expect(d).not.toContain('FS');
    expect(d).not.toContain('CB L');
    expect(d).not.toContain('CB R');
  });

  it('Cover 6 and Cover 9 mirror each other across the formation', () => {
    const ctx = ctxFor('trips', 'flood');
    const six = buildDefense('c6', ctx);
    const nine = buildDefense('c9', ctx);
    const strongCbSix = six.find((d) => d.p === `CB ${ctx.strong}`);
    const strongCbNine = nine.find((d) => d.p === `CB ${ctx.strong}`);
    // Cover 6 matches quarters to the strength; Cover 9 clouds it
    expect(strongCbNine.rule).toMatch(/Cover 2 half|jam and funnel/i);
    expect(strongCbSix.rule).not.toEqual(strongCbNine.rule);
  });

  it('Solo poaches only when #3 declares vertical', () => {
    const vert = buildDefense('solo', ctxFor('trips', 'verts'));
    const notVert = buildDefense('solo', ctxFor('trips', 'curlflat'));
    const weak = (defs, ctx) => defs.find((d) => d.p === `S ${ctx.weak}`);
    const ctxV = ctxFor('trips', 'verts');
    const ctxN = ctxFor('trips', 'curlflat');
    expect(weak(vert, ctxV).rule).toMatch(/POACH/);
    expect(weak(notVert, ctxN).rule).toMatch(/forget the poach/i);
  });

  it('Cover 3 Match plays man on a vertical #1 and zone on a shallow one', () => {
    const vert = buildDefense('c3match', ctxFor('doubles', 'verts'));
    const shallow = buildDefense('c3match', ctxFor('doubles', 'curlflat'));
    expect(vert.find((d) => d.p === 'CB R').res.mode).toBe('match');
    expect(shallow.find((d) => d.p === 'CB R').res.mode).toBe('zone');
  });

  it('Cover 0 leaves nobody deep', () => {
    const defense = buildDefense('c0', ctxFor('doubles', 'verts'));
    expect(defense.some((d) => d.type === 'deep')).toBe(false);
    expect(defense.some((d) => d.type === 'rush')).toBe(true);
  });
});

describe('coverage engine — field and boundary', () => {
  it('moving the ball to the other hash flips which side has the grass', () => {
    const left = ctxFor('trips', 'verts', { ballSpot: 'left' });
    const right = ctxFor('trips', 'verts', { ballSpot: 'right' });
    expect(left.fieldSide).toBe('R');
    expect(right.fieldSide).toBe('L');
  });

  it('a middle spot has no field or boundary', () => {
    expect(ctxFor('doubles', 'verts', { ballSpot: 'middle' }).fieldSide).toBe(null);
  });

  it('flipping the formation moves the passing strength', () => {
    expect(ctxFor('trips', 'verts').strong).toBe('R');
    expect(ctxFor('trips', 'verts', { flip: true }).strong).toBe('L');
  });

  it('keeps every receiver inbounds at every hash and ruleset', () => {
    for (const ruleset of ['nfl', 'ncaa']) {
      for (const ballSpot of ['left', 'middle', 'right']) {
        for (const f of FORM_IDS) {
          for (const flip of [false, true]) {
            const ctx = ctxFor(f, 'verts', { ruleset, ballSpot, flip });
            for (const r of ctx.recs) {
              expect(r.x).toBeGreaterThanOrEqual(0);
              expect(r.x).toBeLessThanOrEqual(FIELD_W);
            }
          }
        }
      }
    }
  });
});

describe('coverage library — content', () => {
  it('every coverage carries a full briefing', () => {
    for (const id of COV_IDS) {
      const c = COVERAGES[id];
      expect(c.name).toBeTruthy();
      expect(c.one.length).toBeGreaterThan(40);
      expect(c.runfit).toBeTruthy();
      expect(c.call).toBeTruthy();
      expect(c.stress.length).toBeGreaterThan(0);
      expect(c.cfb.checks.length).toBeGreaterThan(0);
      expect(c.cfb.tips.length).toBeGreaterThan(0);
    }
  });

  it('has a written head-to-head for the pairings worth studying', () => {
    const pairs = [
      ['c4', 'palms'],
      ['c6', 'c9'],
      ['c3sky', 'c3buzz'],
      ['c2', 'tampa2'],
      ['c1', 'c0'],
      ['c4', 'solo'],
    ];
    for (const [a, b] of pairs) {
      expect(differenceFor(a, b)).toBeTruthy();
      expect(differenceFor(b, a)).toBe(differenceFor(a, b));
    }
  });
});
