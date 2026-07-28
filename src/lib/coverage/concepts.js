// built by nnnsightnnn — signal from noise
// Coverage Lab — route concepts.
//
// Each concept assigns a route by receiver key (side + number). The engine
// resolves every defender's assignment from these releases, so the same
// coverage genuinely behaves differently concept to concept.

export const CONCEPTS = {
  verts: {
    name: '4 Verticals',
    note:
      'Every match coverage looks nearly identical here — vertical releases lock man rules everywhere. Use this to study seam math, not trigger differences.',
    r: { L1: 'go', L2: 'seam', L3: 'bender', R1: 'go', R2: 'seam', R3: 'bender', RB: 'check' },
  },
  curlflat: {
    name: 'Curl–Flat / Stick',
    note:
      'THE trigger concept. #2 breaks out inside 5. Quarters and Palms diverge completely right here — watch the corner.',
    r: { L1: 'curl', L2: 'flat', L3: 'flat', R1: 'curl', R2: 'flat', R3: 'flat', RB: 'check' },
  },
  smash: {
    name: 'Smash',
    note:
      '#1 hitch under a #2 corner route. The classic high-low on any squatting flat defender and on a lone deep-half player.',
    r: { L1: 'hitch', L2: 'corner', L3: 'flat', R1: 'hitch', R2: 'corner', R3: 'flat', RB: 'check' },
  },
  flood: {
    name: 'Flood / Sail',
    note:
      'Three levels to one side. Punishes rotation away from the flood and any coverage with a single underneath defender out there.',
    r: { L1: 'drag', L2: 'check', L3: 'flat', R1: 'go', R2: 'out', R3: 'flat', RB: 'swing' },
  },
  mesh: {
    name: 'Mesh',
    note:
      'Two shallow crossers under a corner route. Man beater — watch the man calls tangle while the zone calls pass it off.',
    r: { L1: 'drag', L2: 'corner', L3: 'drag', R1: 'corner', R2: 'drag', R3: 'drag', RB: 'swing' },
  },
  dagger: {
    name: 'Dagger',
    note:
      '#2 seam clears the hook, #1 digs in behind it. Cover 3 Buzz exists specifically to take this away.',
    r: { L1: 'dig', L2: 'seam', L3: 'check', R1: 'dig', R2: 'seam', R3: 'check', RB: 'check' },
  },
  bubble: {
    name: 'Bubble / Now RPO',
    note:
      'A pre-snap numbers game. Whichever defender is your force / flat player decides whether the QB pulls it.',
    r: { L1: 'stalk', L2: 'bubble', L3: 'bubble', R1: 'stalk', R2: 'bubble', R3: 'bubble', RB: 'check' },
  },
  wheel: {
    name: 'Post–Wheel (Switch)',
    note:
      'Switch release. Breaks any coverage where two defenders have to trade responsibility on the fly.',
    r: { L1: 'post', L2: 'wheel', L3: 'seam', R1: 'post', R2: 'wheel', R3: 'seam', RB: 'check' },
  },
};
