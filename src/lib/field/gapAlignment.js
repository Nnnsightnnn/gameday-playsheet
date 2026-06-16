// Formation Planner — defensive front: technique numbers + gap responsibility.
//
// A defensive lineman's alignment is named by a "technique number" — which
// offensive lineman he's over and which shoulder — and that technique implies
// the gap he owns. Techniques are defined RELATIVE TO THE OFFENSIVE LINE, so
// when both teams are on the board we read each DL against the real O-line; with
// no offense present we fall back to a standard evenly-spaced line at the ball.
//
//   tech  over (shoulder)            gap
//   0     center, head-up            A (both)
//   1     center, outside (shade)    A
//   2i    guard, inside              A
//   2     guard, head-up             B
//   3     guard, outside             B
//   4i    tackle, inside             B
//   4     tackle, head-up            C
//   5     tackle, outside            C
//   6     tight end, head-up         C
//   7     tight end, inside          C
//   9     outside the TE/tackle      D (edge)
//
// Sources: viQtory, Big Blue View, CoachParker, Wikipedia "Gap" — cross-checked.

import { ON_LINE_EPS } from './fieldConfig';

// Head-up tolerance (~0.2 yd): inside this of a lineman's center it's "head-up".
const HEAD = 0.013;
// Standard O-line half-spacings from center (guard, tackle, tight end) when we
// must synthesize a line. Matches the planner's default OL spacing (~0.045).
const STD = { G: 0.045, T: 0.09, Y: 0.135 };

const TECH_GAP = {
  '0': 'A',
  '1': 'A',
  '2i': 'A',
  '2': 'B',
  '3': 'B',
  '4i': 'B',
  '4': 'C',
  '5': 'C',
  '6': 'C',
  '7': 'C',
  '9': 'D',
};

// Per-side outward offsets of the guard / tackle / tight-end landmarks, derived
// from the opposing personnel when given, else the standard line.
function landmarks(oppLine, centerX) {
  const ol = (oppLine || []).filter((p) => p.pos === 'OL');
  const tes = (oppLine || []).filter(
    (p) => p.pos === 'TE' && Math.abs(p.y) <= ON_LINE_EPS,
  );

  if (ol.length >= 5) {
    const sorted = [...ol].sort((a, b) => a.x - b.x);
    let ci = 0;
    let cd = Infinity;
    sorted.forEach((p, i) => {
      const d = Math.abs(p.x - centerX);
      if (d < cd) {
        cd = d;
        ci = i;
      }
    });
    const cx = sorted[ci].x;
    const leftIn = sorted.slice(0, ci).reverse(); // nearest-to-center first
    const rightIn = sorted.slice(ci + 1);
    const sideOf = (arr, dir) => {
      const o = {};
      if (arr[0]) o.G = Math.abs(arr[0].x - cx);
      if (arr[1]) o.T = Math.abs(arr[1].x - cx);
      const te = tes.find((t) => (t.x < cx ? -1 : 1) === dir);
      if (te) o.Y = Math.abs(te.x - cx);
      return o;
    };
    return { centerX: cx, L: sideOf(leftIn, -1), R: sideOf(rightIn, 1) };
  }

  const std = { G: STD.G, T: STD.T };
  return { centerX, L: { ...std }, R: { ...std } };
}

// Classify one DL's outward distance `a` (≥0) against a side's landmarks.
function techniqueFor(a, side) {
  const marks = [{ name: 'C', o: 0 }];
  if (side.G != null) marks.push({ name: 'G', o: side.G });
  if (side.T != null) marks.push({ name: 'T', o: side.T });
  if (side.Y != null) marks.push({ name: 'Y', o: side.Y });

  let L = marks[0];
  let bd = Infinity;
  for (const m of marks) {
    const d = Math.abs(a - m.o);
    if (d < bd) {
      bd = d;
      L = m;
    }
  }
  const delta = a - L.o;
  const head = Math.abs(delta) < HEAD;
  const inside = delta < 0;

  switch (L.name) {
    case 'C':
      return head ? '0' : '1';
    case 'G':
      return head ? '2' : inside ? '2i' : '3';
    case 'T':
      // A defender well outside the tackle with no TE outside him is a wide-9.
      if (!head && !inside && side.Y == null && delta > 0.022) return '9';
      return head ? '4' : inside ? '4i' : '5';
    case 'Y':
      return head ? '6' : inside ? '7' : '9';
    default:
      return '9';
  }
}

// Read the whole defensive front. Returns per-DL alignment, the gaps covered by
// down linemen, and a structural front tag inferred from the techniques.
export function alignFront(dlTokens, oppLine, ballX = 0.5) {
  const lm = landmarks(oppLine, ballX);
  const teSide =
    (oppLine || []).filter(
      (p) => p.pos === 'TE' && Math.abs(p.y) <= ON_LINE_EPS,
    )[0]?.x ?? null;

  const alignments = [...dlTokens]
    .sort((a, b) => a.x - b.x)
    .map((p) => {
      const sign = p.x < lm.centerX ? -1 : 1;
      const a = Math.abs(p.x - lm.centerX);
      const side = sign < 0 ? lm.L : lm.R;
      const tech = techniqueFor(a, side);
      return {
        id: p.id,
        label: p.label || p.pos,
        side: sign < 0 ? 'L' : 'R',
        tech,
        gap: TECH_GAP[tech] || 'D',
      };
    });

  const gapsCovered = [
    ...new Set(
      alignments.flatMap((al) =>
        al.tech === '0' ? ['LA', 'RA'] : [`${al.side}${al.gap}`],
      ),
    ),
  ].sort();

  const frontTag = tagFromTechniques(alignments, teSide, lm.centerX);
  return { alignments, gapsCovered, frontTag };
}

function tagFromTechniques(alignments, teSide, centerX) {
  const techs = alignments.map((a) => a.tech);
  const count = (t) => techs.filter((x) => x === t).length;
  const has = (t) => techs.includes(t);
  const nines = count('9');

  // Bear / 46: nose (0/1) flanked by two 3-techniques over the guards.
  if ((has('0') || has('1')) && count('3') >= 2) return 'bear';
  // Tite / Mint: nose (0/1) with both ends in 4i (inside the tackles).
  if ((has('0') || has('1')) && count('4i') >= 2) return 'tite';
  // Wide-9: both edges aligned outside in 9-techniques.
  if (nines >= 2) return 'wide-9';

  // Over / Under: the 3-technique's side relative to the offense's strength
  // (the attached TE). Over = 3-tech to the TE side; Under = away from it.
  if (alignments.length === 4 && has('3') && teSide != null) {
    const threeSide = alignments.find((a) => a.tech === '3').side;
    const strong = teSide < centerX ? 'L' : 'R';
    return threeSide === strong ? 'over' : 'under';
  }
  // Over/under is undefined without a strength reference — stay neutral until
  // the offense (and its tight end) is on the board.
  return 'base';
}
