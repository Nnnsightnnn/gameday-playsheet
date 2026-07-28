// built by nnnsightnnn — signal from noise
// Coverage Lab — the resolution engine.
//
// makeContext()  builds the offensive picture + route releases for a snap
// buildDefense() resolves every coverage defender's assignment against them
// defenderAt()   interpolates a defender's position at snap-time t ∈ [0,1]
//
// Everything here is pure, so the whole thing is unit-testable without a DOM.

import { buildFormation } from './formations';
import { CONCEPTS } from './concepts';
import { classify, pathFor, pointAt } from './routes';
import { COVERAGES, TRIGGER_T } from './coverages';
import { fieldSideOf } from './labField';

const lerp = (a, b, t) => a + (b - a) * t;
const lp = (A, B, t) => ({ x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t) });
const ease = (t) => 1 - (1 - t) * (1 - t);

/**
 * @param {object} opts
 * @param {string} opts.formation  key into FORMATIONS
 * @param {string} opts.concept    key into CONCEPTS
 * @param {number} opts.ball       ball x in yards
 * @param {boolean} opts.flip      mirror the formation
 */
export function makeContext({ formation, concept, ball, flip = false }) {
  const form = buildFormation(formation, ball, flip);
  const cpt = CONCEPTS[concept] || CONCEPTS.verts;

  const byKey = {};
  const recs = [];

  form.recs.forEach((r) => {
    const side = r.k[0];
    const o = side === 'R' ? 1 : -1;
    const route = cpt.r[r.k] || 'hitch';
    const rr = { ...r, side, o, route, cl: classify(route) };
    rr.path = pathFor({ x: r.x, y: r.y }, route, o);
    byKey[r.k] = rr;
    recs.push(rr);
  });

  const b = form.back;
  const bo = b.x >= ball ? 1 : -1;
  const broute = cpt.r.RB || 'check';
  const bb = { ...b, side: bo > 0 ? 'R' : 'L', o: bo, route: broute, cl: classify(broute) };
  bb.path = pathFor({ x: b.x, y: b.y }, broute, bo);
  byKey.RB = bb;
  recs.push(bb);

  return {
    ball,
    flip,
    formation,
    concept,
    form,
    recs,
    byKey,
    strong: form.strong,
    weak: form.weak,
    fieldSide: fieldSideOf(ball),
    g: (k) => byKey[k],
    n: (side, i) => byKey[`${side}${i}`],
  };
}

// Derive a pre-snap alignment from the defender's label so each coverage only
// has to declare responsibility, not geometry.
function alignmentFor(label, ctx) {
  let m;
  if ((m = label.match(/^CB\s*([LR])/))) {
    const r = ctx.n(m[1], 1);
    return r ? { x: r.x + r.o * 1.4, y: 7 } : { x: ctx.ball, y: 7 };
  }
  if ((m = label.match(/^(?:NB|SS)\s*([LR])/))) {
    const side = m[1];
    const r = ctx.n(side, 2);
    if (!r) return { x: side === 'L' ? ctx.ball - 6.5 : ctx.ball + 6.5, y: 4.8 };
    const o = side === 'R' ? 1 : -1;
    const tight = Math.abs(r.x - ctx.ball) < 7;
    return { x: r.x + (tight ? o * 2.4 : -o * 2.6), y: 4.8 };
  }
  if ((m = label.match(/^S\s*([LR])/))) {
    const side = m[1];
    const two = ctx.n(side, 2);
    const o = side === 'R' ? 1 : -1;
    return {
      x: two ? two.x - o * 2 : ctx.ball + o * 13,
      y: 11.5,
    };
  }
  if (label.startsWith('FS')) return { x: ctx.ball + (ctx.strong === 'R' ? -4 : 4), y: 12.5 };
  if (label.startsWith('SS')) {
    const s = ctx.strong;
    const two = ctx.n(s, 2);
    const o = s === 'R' ? 1 : -1;
    return { x: two ? two.x - o * 2.4 : ctx.ball + o * 12, y: 10.5 };
  }
  if (label.startsWith('MIKE')) return { x: ctx.ball + 1.8, y: 5.2 };
  if (label.startsWith('WILL')) return { x: ctx.ball - 3.6, y: 5.2 };
  if (label.startsWith('SAM')) return { x: ctx.ball + (ctx.strong === 'R' ? 7 : -7), y: 5 };
  return { x: ctx.ball, y: 6 };
}

export function buildDefense(coverageId, ctx) {
  const cov = COVERAGES[coverageId];
  if (!cov) return [];
  const defenders = cov.build(ctx);
  const seen = Object.create(null);
  defenders.forEach((d) => {
    const base = d.p;
    let n = 1;
    while (seen[d.p]) {
      n += 1;
      d.p = `${base} ${n}`;
    }
    seen[d.p] = true;
    d.align = alignmentFor(d.p, ctx);
  });
  return defenders;
}

// Generic four-man rush, drawn for context only.
export function rushers(ctx) {
  return [-4.4, -1.8, 2.2, 5.2].map((dx, i) => ({
    id: `DL${i}`,
    x: ctx.ball + dx,
    y: 1.4,
  }));
}

export function defenderAt(d, ctx, t) {
  const r = d.res;
  if (r.mode === 'zone') {
    return lp(d.align, r.target, ease(Math.min(1, t * 1.15)));
  }
  if (r.mode === 'man') {
    const rec = ctx.g(r.key);
    if (!rec) return d.align;
    const rp = pointAt(rec.path, Math.max(0, t - 0.1));
    return lp(d.align, { x: rp.x + r.off.x, y: rp.y + r.off.y }, ease(Math.min(1, t * 2.2)));
  }
  if (r.mode === 'match') {
    if (t < TRIGGER_T) return lp(d.align, r.target, ease(t / TRIGGER_T) * 0.3);
    const rec = ctx.g(r.key);
    if (!rec) return r.target;
    const from = lp(d.align, r.target, 0.3);
    const rp = pointAt(rec.path, Math.max(0, t - 0.08));
    const k = ease(Math.min(1, ((t - TRIGGER_T) / (1 - TRIGGER_T)) * 1.6));
    return lp(from, { x: rp.x - 0.9, y: rp.y + 0.9 }, k);
  }
  return d.align;
}

export function receiverAt(rec, t) {
  return pointAt(rec.path, t);
}

// Which defenders actually play differently between two calls on this snap.
export function divergingPositions(defsA, defsB) {
  return defsA
    .filter((a) => {
      const b = defsB.find((x) => x.p === a.p);
      return b && b.rule !== a.rule;
    })
    .map((a) => a.p);
}

export function phaseLabel(t) {
  if (t < 0.02) return 'Pre-snap alignment';
  if (t < TRIGGER_T) return 'Stems — rules have not triggered yet';
  if (t < 0.6) return 'TRIGGER — match rules firing';
  if (t < 0.85) return 'Routes declared, coverage settled';
  return 'Ball out';
}

export { TRIGGER_T };
