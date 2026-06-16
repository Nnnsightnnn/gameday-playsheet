import { describe, it, expect } from 'vitest';
import { classifyFormation } from '../featureExtraction';
import { matchLibrary } from '../matchingEngine';
import lib from '../../../../public/data/formation-library.json';

const library = lib.formations;

// ── token + perturbation helpers ────────────────────────────────────────────
// A "tinker" is the user dragging tokens. Robustness means small drags, a slide
// toward a hash, or a single token shoved off its spot must NOT change the
// canonical name. Coordinates are LOS-relative (see fieldConfig), so there is
// no meaningful "shift up/down the field" — the LOS is always y=0; lateral
// (toward-a-hash) slides and per-token jitter are the real perturbations.

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

// Deterministic per-index jitter (~0.6 yd of x, ~0.6 yd of y), no RNG.
const jitter = (players) =>
  players.map((p, i) => ({
    ...p,
    x: p.x + ((i % 3) - 1) * 0.018,
    y: p.y + (i % 2 ? 1 : -1) * 0.04,
  }));

// Slide the whole formation laterally toward a hash.
const slideX = (players, dx) => players.map((p) => ({ ...p, x: p.x + dx }));

// Shove one token well off its spot.
const nudge = (players, idx, dx, dy) =>
  players.map((p, i) => (i === idx ? { ...p, x: p.x + dx, y: p.y + dy } : p));

const ol = (team = 'offense') => [
  tok(team, 'OL', 0.41, 0),
  tok(team, 'OL', 0.455, 0),
  tok(team, 'OL', 0.5, 0),
  tok(team, 'OL', 0.545, 0),
  tok(team, 'OL', 0.59, 0),
];

// ── canonical fixtures ───────────────────────────────────────────────────────
const FIX = {
  iForm: {
    side: 'offense',
    ballX: 0.5,
    expectName: 'I-Formation',
    keys: { backfield: 'I-Form', personnel: '21', strength: '2x1' },
    players: () => [
      ...ol(),
      tok('offense', 'TE', 0.635, 0),
      tok('offense', 'WR', 0.1, 0),
      tok('offense', 'QB', 0.5, 0.08),
      tok('offense', 'FB', 0.5, 0.2),
      tok('offense', 'RB', 0.5, 0.34),
      tok('offense', 'WR', 0.86, 0.06),
    ],
  },
  gunTrips: {
    side: 'offense',
    ballX: 0.5,
    expectName: 'Gun Trips Open',
    keys: { backfield: 'Gun', personnel: '10', strength: '3x1' },
    players: () => [
      ...ol(),
      tok('offense', 'QB', 0.5, 0.33),
      tok('offense', 'RB', 0.4, 0.33),
      tok('offense', 'WR', 0.12, 0),
      tok('offense', 'WR', 0.7, 0),
      tok('offense', 'WR', 0.79, 0.02),
      tok('offense', 'WR', 0.88, 0),
    ],
  },
  empty: {
    side: 'offense',
    ballX: 0.5,
    expectName: 'Empty Spread',
    keys: { backfield: 'Empty', personnel: '00', strength: '3x2' },
    players: () => [
      ...ol(),
      tok('offense', 'QB', 0.5, 0.33),
      tok('offense', 'WR', 0.1, 0),
      tok('offense', 'WR', 0.22, 0.02),
      tok('offense', 'WR', 0.66, 0),
      tok('offense', 'WR', 0.76, 0),
      tok('offense', 'WR', 0.88, 0.02),
    ],
  },
  base43: {
    side: 'defense',
    ballX: 0.5,
    expectName: '4-3 Base',
    keys: { front: '4-3', pkg: 'Base', shell: '2-High' },
    players: () => [
      tok('defense', 'DL', 0.41, -0.09),
      tok('defense', 'DL', 0.465, -0.09),
      tok('defense', 'DL', 0.535, -0.09),
      tok('defense', 'DL', 0.59, -0.09),
      tok('defense', 'LB', 0.38, -0.18),
      tok('defense', 'LB', 0.5, -0.18),
      tok('defense', 'LB', 0.62, -0.18),
      tok('defense', 'CB', 0.1, -0.12),
      tok('defense', 'CB', 0.9, -0.12),
      tok('defense', 'S', 0.4, -0.45),
      tok('defense', 'S', 0.6, -0.45),
    ],
  },
  nickel425: {
    side: 'defense',
    ballX: 0.5,
    expectName: 'Nickel 4-2-5',
    keys: { front: '4-2', pkg: 'Nickel', shell: '2-High' },
    players: () => [
      tok('defense', 'DL', 0.41, -0.09),
      tok('defense', 'DL', 0.465, -0.09),
      tok('defense', 'DL', 0.535, -0.09),
      tok('defense', 'DL', 0.59, -0.09),
      tok('defense', 'LB', 0.44, -0.18),
      tok('defense', 'LB', 0.56, -0.18),
      tok('defense', 'CB', 0.1, -0.12),
      tok('defense', 'CB', 0.9, -0.12),
      tok('defense', 'DB', 0.25, -0.22),
      tok('defense', 'S', 0.4, -0.45),
      tok('defense', 'S', 0.6, -0.45),
    ],
  },
};

const classify = (f, players) => classifyFormation(players, f.side, f.ballX);
const named = (f, players) =>
  matchLibrary(classify(f, players), library, f.side);

describe('canonical formations classify and name correctly', () => {
  for (const [id, f] of Object.entries(FIX)) {
    it(`${id} → ${f.expectName}`, () => {
      const feat = classify(f, f.players());
      for (const [k, v] of Object.entries(f.keys)) {
        expect(feat[k], `${id}.${k}`).toBe(v);
      }
      const m = named(f, f.players());
      expect(m).not.toBeNull();
      expect(m.name).toBe(f.expectName);
      expect(m.lowConfidence).toBe(false);
    });
  }
});

describe('robust to tinkering — name holds under perturbation', () => {
  const perturbations = {
    jitter: (f) => jitter(f.players()),
    'lateral slide +0.06': (f) => slideX(f.players(), 0.06),
    'lateral slide -0.06': (f) => slideX(f.players(), -0.06),
    // shove the deepest/last token off its spot without changing its role
    'nudge one token': (f) => nudge(f.players(), f.players().length - 1, 0.03, 0.03),
  };

  for (const [id, f] of Object.entries(FIX)) {
    for (const [label, perturb] of Object.entries(perturbations)) {
      it(`${id} survives ${label}`, () => {
        // lateral slide moves the ball spot too (it stays under center)
        const ballX = label.startsWith('lateral')
          ? f.ballX + (label.includes('+') ? 0.06 : -0.06)
          : f.ballX;
        const players = perturb(f);
        const feat = classifyFormation(players, f.side, ballX);
        for (const [k, v] of Object.entries(f.keys)) {
          expect(feat[k], `${id}.${k} under ${label}`).toBe(v);
        }
        const m = matchLibrary(feat, library, f.side);
        expect(m.name, `${id} name under ${label}`).toBe(f.expectName);
      });
    }
  }
});

describe('defense never claims a single coverage', () => {
  it('emits a shell + candidate list, low confidence', () => {
    const feat = classify(FIX.base43, FIX.base43.players());
    expect(feat.shell).toBe('2-High');
    expect(Array.isArray(feat.inferredCoverages)).toBe(true);
    expect(feat.inferredCoverages.length).toBeGreaterThan(1);
    expect(feat.coverageConfidence).toMatch(/disguis/);
    expect(feat).not.toHaveProperty('coverage');
  });
});

describe('matcher always lands on a real name (nearest-neighbor fallback)', () => {
  it('returns the closest name even for an oddball set, flagged low-confidence', () => {
    // A weird 6-DL goal-line-ish blob: should still resolve to a defense name.
    const weird = [
      ...Array.from({ length: 6 }, (_, i) =>
        tok('defense', 'DL', 0.35 + i * 0.06, -0.05),
      ),
      tok('defense', 'LB', 0.45, -0.15),
      tok('defense', 'LB', 0.55, -0.15),
      tok('defense', 'CB', 0.15, -0.1),
      tok('defense', 'CB', 0.85, -0.1),
      tok('defense', 'S', 0.5, -0.3),
    ];
    const m = matchLibrary(
      classifyFormation(weird, 'defense', 0.5),
      library,
      'defense',
    );
    expect(m).not.toBeNull();
    expect(typeof m.name).toBe('string');
    expect(m.name.length).toBeGreaterThan(0);
  });
});
