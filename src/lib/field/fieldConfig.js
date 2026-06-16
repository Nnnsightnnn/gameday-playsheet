// Formation Planner — single source of truth for the field coordinate system.
// Positions are stored in NORMALIZED field units and converted to board (SVG
// viewBox) units only at render time, so saved formations are resolution-free.
//
//   x ∈ [0,1]  sideline → sideline (0.5 = center of the field)
//   y          signed depth from the line of scrimmage (LOS = 0)
//                offense lines up at y ≥ 0 (back from the ball)
//                defense lines up at y ≤ 0
//   1 x-unit = 53.333 yds (full field width)
//   1 y-unit = 15 yds      (the visible window is LOS ± 15 yds)

export const FIELD = { widthYds: 53.333, halfDepthYds: 15 };

// SVG viewBox space the board is drawn in. SVG scales this to the rendered size,
// so these are not pixels — getScreenCTM() handles the device mapping.
// Taller than wide-feeling so backfield depth has room to separate cleanly.
export const BOARD = { w: 1000, h: 900 };

// A player is "on the line" when |y| is within this band (~0.5 yd each way).
export const ON_LINE_EPS = 0.033;

// NFL hash marks: 70'9" (≈23.58 yds) from each sideline.
export const HASH_LEFT_X = 23.58 / FIELD.widthYds; // ≈ 0.4422
export const HASH_RIGHT_X = 1 - HASH_LEFT_X; // ≈ 0.5578

// Yard lines every 5 yds → every 5/15 of a y-unit.
export const YARD_STEP_Y = 5 / FIELD.halfDepthYds; // ≈ 0.3333

// Snap grid (normalized). 1/48 of the width ≈ 1.1 yd horizontally.
export const GRID = 1 / 48;

export const POSITIONS = {
  offense: ['QB', 'RB', 'FB', 'WR', 'TE', 'OL'],
  defense: ['DL', 'LB', 'S', 'CB', 'DB'],
};

// Roles that are eligible receivers by position (offense). OL is ineligible.
export const ELIGIBLE_POS = new Set(['QB', 'RB', 'FB', 'WR', 'TE']);

// Jersey numbers 50–79 are ineligible unless a player reports eligible.
export const INELIGIBLE_NUMBER_MIN = 50;
export const INELIGIBLE_NUMBER_MAX = 79;

export function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

// normalized field point → board (viewBox) point
export function toPx({ x, y }) {
  return {
    px: x * BOARD.w,
    py: BOARD.h / 2 + y * (BOARD.h / 2),
  };
}

// board (viewBox) point → normalized field point
export function toField({ px, py }) {
  return {
    x: px / BOARD.w,
    y: (py - BOARD.h / 2) / (BOARD.h / 2),
  };
}

export function snapVal(v, grid = GRID) {
  return Math.round(v / grid) * grid;
}

// Snap + clamp a normalized point into legal bounds for a given side.
export function snapPoint({ x, y }, { snap = true, side = 'offense' } = {}) {
  let nx = snap ? snapVal(x) : x;
  let ny = snap ? snapVal(y) : y;
  nx = clamp(nx, 0, 1);
  // keep each side on its own half (allow a small spill across the LOS)
  if (side === 'offense') ny = clamp(ny, -ON_LINE_EPS, 1);
  else ny = clamp(ny, -1, ON_LINE_EPS);
  return { x: nx, y: ny };
}

export function isOnLine(p) {
  return Math.abs(p.y) <= ON_LINE_EPS;
}

// Backfield = off the line on your own side of the ball.
export function inBackfield(p, side = 'offense') {
  return side === 'offense' ? p.y > ON_LINE_EPS : p.y < -ON_LINE_EPS;
}

// Eligibility: explicit override wins, else jersey 50–79 is ineligible,
// else the position decides.
export function isEligible(p) {
  if (p.eligibleOverride === true) return true;
  if (p.eligibleOverride === false) return false;
  if (
    typeof p.jersey === 'number' &&
    p.jersey >= INELIGIBLE_NUMBER_MIN &&
    p.jersey <= INELIGIBLE_NUMBER_MAX
  ) {
    return false;
  }
  return ELIGIBLE_POS.has(p.pos);
}
