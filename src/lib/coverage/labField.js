// built by nnnsightnnn — signal from noise
// Coverage Lab — board geometry.
//
// The Formation Planner's window is LOS ± 15 yds, which is too shallow to show
// a deep-third landmark or a Tampa-2 drop. The Lab therefore keeps its own
// depth window but reuses fieldConfig as the single source of truth for field
// WIDTH and HASH placement, so both views agree on where the ball can sit.
//
// Engine coordinates are plain yards:
//   x  0 → 53.333   left sideline → right sideline
//   y  signed depth from the LOS, POSITIVE = downfield (the defense's side)
// Board coordinates are SVG viewBox units with downfield UP the screen.

import { FIELD, hashX, ballSpotX } from '../field/fieldConfig';

export const FIELD_W = FIELD.widthYds; // 53.333

// Visible window: 8 yds behind the LOS (backfield) to 25 yds downfield.
export const BACK_YDS = 8;
export const DEEP_YDS = 25;

export const LAB_BOARD = {
  w: 1000,
  get h() {
    return Math.round((1000 / FIELD_W) * (BACK_YDS + DEEP_YDS));
  },
};

const SCALE = LAB_BOARD.w / FIELD_W; // board units per yard

export function toBoard({ x, y }) {
  return {
    px: x * SCALE,
    py: LAB_BOARD.h - (y + BACK_YDS) * SCALE,
  };
}

export const bx = (x) => x * SCALE;
export const by = (y) => LAB_BOARD.h - (y + BACK_YDS) * SCALE;

// Hash columns in YARDS for a ruleset (college hashes sit 40 ft apart).
export function hashYards(ruleset = 'ncaa') {
  const h = hashX(ruleset);
  return { left: h.left * FIELD_W, right: h.right * FIELD_W };
}

// Ball x in YARDS for a ruleset + spot.
export function ballYards(ruleset = 'ncaa', spot = 'left') {
  return ballSpotX(ruleset, spot) * FIELD_W;
}

// Which side of the formation has more grass. Returns 'L' | 'R' | null.
export function fieldSideOf(ball) {
  const mid = FIELD_W / 2;
  if (Math.abs(ball - mid) < 0.5) return null;
  return ball < mid ? 'R' : 'L';
}

export const clampX = (x) => Math.min(FIELD_W - 2, Math.max(2, x));
