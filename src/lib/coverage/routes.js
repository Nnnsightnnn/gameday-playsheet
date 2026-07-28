// built by nnnsightnnn — signal from noise
// Coverage Lab — route shapes and the release classification that drives every
// pattern-match rule in the engine.
//
// A route is a 3-point polyline expressed as yard offsets from the receiver's
// alignment. `o` is the receiver's OUTWARD direction (+1 when the sideline is
// to his right, -1 when it is to his left), so one definition mirrors cleanly.

export const ROUTES = {
  go: (o) => [[0, 0], [0.4 * o, 7], [0.7 * o, 20]],
  seam: (o) => [[0, 0], [-1.2 * o, 7], [-1.6 * o, 20]],
  bender: (o) => [[0, 0], [-1.5 * o, 8], [-5 * o, 19]],
  post: (o) => [[0, 0], [0.2 * o, 8], [-8 * o, 19]],
  corner: (o) => [[0, 0], [-0.6 * o, 8], [6.5 * o, 17]],
  wheel: (o) => [[0, 0], [3.2 * o, 1.2], [4.2 * o, 15]],
  out: (o) => [[0, 0], [0.2 * o, 10], [6.5 * o, 10.6]],
  flat: (o) => [[0, 0], [3.4 * o, 2.6], [7.5 * o, 3.8]],
  arrow: (o) => [[0, 0], [3.0 * o, 2.2], [7.0 * o, 3.4]],
  bubble: (o) => [[0, 0], [1.6 * o, -2.2], [6.0 * o, -0.4]],
  swing: (o) => [[0, 0], [5 * o, -2.4], [10 * o, -0.6]],
  hitch: (o) => [[0, 0], [0, 6.5], [0.6 * o, 5.4]],
  curl: (o) => [[0, 0], [0, 11], [-1.2 * o, 9.8]],
  dig: (o) => [[0, 0], [0, 13], [-11 * o, 13.4]],
  drag: (o) => [[0, 0], [-3 * o, 3.2], [-15 * o, 4.2]],
  slant: (o) => [[0, 0], [-2 * o, 2.2], [-9 * o, 7.5]],
  stalk: (o) => [[0, 0], [0, 1.4], [0 * o, 2.2]],
  check: (o) => [[0, 0], [1.5 * o, -1], [4 * o, 1.5]],
};

const VERT = ['go', 'seam', 'bender', 'post', 'corner', 'wheel'];
const OUTB = ['out', 'flat', 'arrow', 'bubble', 'swing'];
const INB = ['dig', 'drag', 'slant'];
const SHRT = ['hitch', 'curl', 'stalk', 'check'];

// The release bucket every match rule keys on.
//   VERT  — declared vertical: locks man rules in Quarters, Match, Palms
//   OUT   — broke outside inside 5: the Palms / 2-Read trigger
//   IN    — crossed inside: what a Buzz safety and a Cover 1 rat rob
//   SHORT — sat down: a run key to a quarters safety
export function classify(route) {
  if (VERT.includes(route)) return 'VERT';
  if (OUTB.includes(route)) return 'OUT';
  if (INB.includes(route)) return 'IN';
  if (SHRT.includes(route)) return 'SHORT';
  return 'NONE';
}

// Build an absolute path (yards) for a receiver running `route`.
export function pathFor(start, route, o) {
  const shape = ROUTES[route] || ROUTES.hitch;
  return shape(o).map(([dx, dy]) => ({ x: start.x + dx, y: start.y + dy }));
}

// Position along a polyline at normalized time t ∈ [0,1].
export function pointAt(path, t) {
  if (t <= 0) return { ...path[0] };
  const segs = path.length - 1;
  const ft = Math.min(1, t) * segs;
  const i = Math.min(segs - 1, Math.floor(ft));
  const k = ft - i;
  return {
    x: path[i].x + (path[i + 1].x - path[i].x) * k,
    y: path[i].y + (path[i + 1].y - path[i].y) * k,
  };
}
