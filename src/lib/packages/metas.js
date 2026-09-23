// Meta threats a package is built to beat.
//
// `threat` is the side that RUNS the meta: an offensive meta is countered by
// a defensive package, a defensive meta by an offensive one. `shows` is how
// many rushers the look presents pre-snap and `rush` how many actually come,
// so the engine can check an offensive package's protection against it.
// `beatenBy` is the football principle, not a play; packages carry the plays.
// `trend` points at the Trends board entry the threat was drawn from, when
// there is one. Confidence tags follow src/data/personnel.js CONFIDENCE.

export const META_THREATS = [
  // ── Madden 27: offensive metas (beat them with a defensive package) ─────
  { id: 'm27-o-return', game: 'madden', threat: 'offense', name: 'Return routes',
    what: 'Cheat Flat X Post, Ohio Return, Return Bench: a receiver runs up, stops and comes back into grass the zone just left. The strongest M27 books are built on it.',
    beatenBy: 'Match rules or Look For Work, so the zone that passed the route off finds it again on the way back.',
    conf: 'm27', source: 'Timesaver money plays (Sep 2026)' },
  { id: 'm27-o-clamp', game: 'madden', threat: 'offense', name: 'Clamp Stack + motion shuffle',
    what: 'Gun Doubles Clamp Stack (Cardinals): Flood Seam, Motion Shuffle Smash and Mesh Rail. Stacks break man leverage and motion re-declares strength.',
    beatenBy: 'Rotate the help to the stack after the snap and squat the flat, so the flood runs into a corner instead of grass.',
    conf: 'm27', source: 'Timesaver money plays; trends m27-off-book-tiers', trend: 'm27-off-book-tiers' },
  { id: 'm27-o-flood', game: 'madden', threat: 'offense', name: 'Flood / PA Flood',
    what: 'Three levels to one sideline: flat, sail, go. Stresses the curl-flat defender and the corner in one throw.',
    beatenBy: 'A cloud corner in the flat and a deep third over the sail, rolled to the flood side.',
    conf: 'm27', source: 'Timesaver money plays' },
  { id: 'm27-o-quickhot', game: 'madden', threat: 'offense', name: 'Quick-game hot answers',
    what: 'The universal answer to a zero look: slant, stick or drag out in a beat, caught on a green timing release.',
    beatenBy: 'Show zero, drop a defender into the hot window, and let the QB throw the ball into him.',
    conf: 'read', source: 'Follows from trends m27-loop-man-0 and m27-timing-catch-standard', trend: 'm27-loop-man-0' },
  { id: 'm27-o-vertical', game: 'madden', threat: 'offense', name: 'Vertical shots (post Sep 16)',
    what: 'TU Sep 16 extended the default lead on downfield throws, so the go and the post land better than they did in August.',
    beatenBy: 'Keep two over the top at the snap even when the look says one, and shade corners over the top.',
    conf: 'ea', source: 'EA TU Sep 16 patch notes (effect on the meta is a read)' },
  { id: 'm27-o-qbrun', game: 'madden', threat: 'offense', name: 'QB run and scramble',
    what: 'QB Zone / QB Wrap from Pistol and Gun Wing Slot Offset, plus the extend-and-run escape.',
    beatenBy: 'Contain both edges or spy, and plaster the zones once he breaks the pocket.',
    conf: 'm27', source: 'Timesaver money plays; trends m27-plaster-logic', trend: 'm27-plaster-logic' },

  // ── Madden 27: defensive metas (beat them with an offensive package) ────
  { id: 'm27-d-loop0', game: 'madden', threat: 'defense', name: 'Loop Man 0',
    what: 'Nickel 2-4 Double Mug Mid Blitz 0: shows six, rushes four with pinch technique, inside point of attack and contain both sides, man behind with 15-yard hook drops.',
    beatenBy: 'Hold six in protection, then beat man with a rub or a crosser before the loopers arrive.',
    shows: 6, rush: 4, conf: 'm27', source: 'MMOExp Loop Man 0 guide via trends m27-loop-man-0', trend: 'm27-loop-man-0' },
  { id: 'm27-d-hover', game: 'madden', threat: 'defense', name: 'A-gap hover and show blitz',
    what: 'A user hovering a mug in the A gap plus linebackers showing blitz, so protection sets to the wrong man.',
    beatenBy: 'ID the man in the A gap and keep the back in; the free rusher is the one you did not name.',
    shows: 6, rush: 5, conf: 'm27', source: 'Civil.GG defense guide (hover concept)' },
  { id: 'm27-d-match', game: 'madden', threat: 'defense', name: 'Match coverage (Cover 3 / Quarters / Palms Match)',
    what: 'Zone that passes routes off like man. It is the money answer to return routes and floods this year.',
    beatenBy: 'Force the pass-off: bunch releases, crossers and switch routes, or run it at a light box.',
    shows: 4, rush: 4, conf: 'm27', source: 'Timesaver money plays' },
  { id: 'm27-d-3high', game: 'madden', threat: 'defense', name: 'Three-high shells',
    what: 'Three High Penny / Three High Over (Cardinals) and 4-2-5 3 High: three deep, six in the box.',
    beatenBy: 'Run it. Six in the box is a numbers win for inside zone with a double team on the nose.',
    shows: 4, rush: 4, conf: 'm27', source: 'Trends m27-def-book-pairing; Civil.GG defense guide', trend: 'm27-def-book-pairing' },
  { id: 'm27-d-sim', game: 'madden', threat: 'defense', name: 'Sim and fire-zone pressure',
    what: 'DB Fire 2, Will Go Fire 3: pressure from a coverage look, with droppers sitting in the hot windows.',
    beatenBy: 'Throw away from the dropper: screens and routes that break outside the hook.',
    shows: 4, rush: 5, conf: 'm27', source: 'Timesaver money plays; Madden Prodigy blitz guide' },

  // ── CFB 27 ──────────────────────────────────────────────────────────────
  { id: 'cfb-o-power', game: 'cfb', threat: 'offense', name: 'Gun Power I run bludgeon',
    what: 'The August West Virginia run game. Cooled by the Aug 27 holding change, still live.',
    beatenBy: 'Pinch the front and fit the gap with a spill linebacker.',
    conf: 'm27', source: 'Trends cfb-run-cooled', trend: 'cfb-run-cooled' },
  { id: 'cfb-d-cub', game: 'cfb', threat: 'defense', name: '3-3 Cub pressure',
    what: 'UCLA 3-3 Cub Mike Blitz 0 that can also drop into coverage as a disguise. Tackles now ID wide linebackers.',
    beatenBy: 'Six-man protection and a quick throw to the vacated side.',
    shows: 6, rush: 5, conf: 'm27', source: 'Trends cfb-3-3-cub-tempered', trend: 'cfb-3-3-cub-tempered' },
  { id: 'cfb-d-match', game: 'cfb', threat: 'defense', name: 'Match coverage after TU3',
    what: 'Cover 3 Match, Palms and Quarters now play by the book.',
    beatenBy: 'Crossers and switch releases that make the pass-off late.',
    shows: 4, rush: 4, conf: 'm27', source: 'Trends cfb-match-coverage-trustworthy', trend: 'cfb-match-coverage-trustworthy' },
]

const BY_ID = new Map(META_THREATS.map((t) => [t.id, t]))
export const threatById = (id) => BY_ID.get(id)

// The threats a package on `side` is meant to beat: a defensive package beats
// offensive metas and vice versa.
export const threatsFor = (game, side) =>
  META_THREATS.filter(
    (t) => t.game === game && t.threat === (side === 'defense' ? 'offense' : 'defense'),
  )
