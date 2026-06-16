import { describe, it, expect } from 'vitest';
import { alignFront } from '../gapAlignment';
import { classifyFormation } from '../featureExtraction';
import { matchLibrary } from '../matchingEngine';
import lib from '../../../../public/data/formation-library.json';

const library = lib.formations;

let n = 0;
const tok = (team, pos, x, y) => ({
  id: `${team[0]}${(n += 1)}`,
  team,
  pos,
  x,
  y,
  jersey: 0,
  label: pos,
});

// A standard offensive line at the ball, optionally with an attached TE on the
// right (the strength reference for over/under).
const offLine = (te = false) => {
  const ps = [
    tok('offense', 'OL', 0.41, 0),
    tok('offense', 'OL', 0.455, 0),
    tok('offense', 'OL', 0.5, 0),
    tok('offense', 'OL', 0.545, 0),
    tok('offense', 'OL', 0.59, 0),
  ];
  if (te) ps.push(tok('offense', 'TE', 0.635, 0));
  return ps;
};

const findGap = (al, side, gap) => al.find((a) => a.side === side && a.gap === gap);

describe('DL technique read against the real offensive line', () => {
  it('names a 1-tech nose, 3-tech, and 5-tech end correctly', () => {
    const dl = [
      tok('defense', 'DL', 0.482, -0.08), // shade left of center → 1-tech
      tok('defense', 'DL', 0.56, -0.08), // outside right guard → 3-tech
      tok('defense', 'DL', 0.395, -0.08), // outside left tackle → 5-tech
      tok('defense', 'DL', 0.64, -0.08), // outside right tackle → 5/9
    ];
    const { alignments } = alignFront(dl, offLine(), 0.5);
    const byTech = Object.fromEntries(
      alignments.map((a) => [`${a.side}${a.tech}`, a]),
    );
    expect(byTech['L1']).toBeTruthy(); // nose shaded to the weak (left) A gap
    expect(byTech['L1'].gap).toBe('A');
    expect(byTech['R3']).toBeTruthy(); // 3-tech in the right B gap
    expect(byTech['R3'].gap).toBe('B');
    expect(alignments.some((a) => a.tech === '5')).toBe(true);
  });

  it('reports the gaps the down line covers', () => {
    const dl = [
      tok('defense', 'DL', 0.41, -0.08),
      tok('defense', 'DL', 0.465, -0.08),
      tok('defense', 'DL', 0.535, -0.08),
      tok('defense', 'DL', 0.59, -0.08),
    ];
    const { gapsCovered } = alignFront(dl, offLine(), 0.5);
    expect(gapsCovered).toContain('LB');
    expect(gapsCovered).toContain('RC');
  });
});

describe('structural fronts inferred from techniques', () => {
  const fullDef = (dl, lbCount) => {
    const lbs = Array.from({ length: lbCount }, (_, i) =>
      tok('defense', 'LB', 0.4 + i * 0.1, -0.18),
    );
    return [
      ...dl,
      ...lbs,
      tok('defense', 'CB', 0.1, -0.12),
      tok('defense', 'CB', 0.9, -0.12),
      tok('defense', 'S', 0.4, -0.45),
      tok('defense', 'S', 0.6, -0.45),
    ];
  };

  it('detects a Bear / 46 front (0 nose + two 3-techs)', () => {
    const dl = [
      tok('defense', 'DL', 0.5, -0.08), // 0
      tok('defense', 'DL', 0.44, -0.08), // 3 left
      tok('defense', 'DL', 0.56, -0.08), // 3 right
      tok('defense', 'DL', 0.395, -0.08), // 5
      tok('defense', 'DL', 0.605, -0.08), // 5
    ];
    const { frontTag } = alignFront(dl, offLine(), 0.5);
    expect(frontTag).toBe('bear');
  });

  it('detects a Tite front (0 nose + two 4i)', () => {
    const dl = [
      tok('defense', 'DL', 0.5, -0.08), // 0
      tok('defense', 'DL', 0.425, -0.08), // 4i left
      tok('defense', 'DL', 0.575, -0.08), // 4i right
    ];
    const { frontTag } = alignFront(dl, offLine(), 0.5);
    expect(frontTag).toBe('tite');
  });

  it('detects Wide-9 (both ends in 9-techniques)', () => {
    const dl = [
      tok('defense', 'DL', 0.36, -0.08), // 9
      tok('defense', 'DL', 0.44, -0.08), // 3
      tok('defense', 'DL', 0.56, -0.08), // 3
      tok('defense', 'DL', 0.64, -0.08), // 9
    ];
    const { frontTag } = alignFront(dl, offLine(), 0.5);
    expect(frontTag).toBe('wide-9');
  });

  it('detects Over (3-tech to the tight-end side) and names it 4-3 Over', () => {
    const dl = [
      tok('defense', 'DL', 0.482, -0.08), // 1 weak
      tok('defense', 'DL', 0.56, -0.08), // 3 strong (TE) side
      tok('defense', 'DL', 0.395, -0.08), // 5 weak end
      tok('defense', 'DL', 0.66, -0.08), // 9 strong end
    ];
    const players = fullDef(dl, 3);
    const feat = classifyFormation(players, 'defense', 0.5, offLine(true));
    expect(feat.front).toBe('4-3');
    expect(feat.frontTag).toBe('over');
    const m = matchLibrary(feat, library, 'defense');
    expect(m.name).toBe('4-3 Over');
  });
});

describe('over/under stays neutral without a strength reference', () => {
  it('a symmetric 4-3 with no offense reads as base, not over/under', () => {
    const dl = [
      tok('defense', 'DL', 0.41, -0.08),
      tok('defense', 'DL', 0.465, -0.08),
      tok('defense', 'DL', 0.535, -0.08),
      tok('defense', 'DL', 0.59, -0.08),
    ];
    const { frontTag } = alignFront(dl, null, 0.5);
    expect(frontTag).toBe('base');
  });
});

describe('technique read is robust to small drags', () => {
  it('a 3-tech stays a B-gap player after jitter', () => {
    const base = [
      tok('defense', 'DL', 0.482, -0.08),
      tok('defense', 'DL', 0.56, -0.08),
      tok('defense', 'DL', 0.395, -0.08),
      tok('defense', 'DL', 0.64, -0.08),
    ];
    const jittered = base.map((p, i) => ({
      ...p,
      x: p.x + ((i % 3) - 1) * 0.01,
      y: p.y + (i % 2 ? 1 : -1) * 0.03,
    }));
    const a1 = alignFront(base, offLine(), 0.5);
    const a2 = alignFront(jittered, offLine(), 0.5);
    expect(findGap(a2.alignments, 'R', 'B')).toBeTruthy();
    expect(a2.frontTag).toBe(a1.frontTag);
  });
});
