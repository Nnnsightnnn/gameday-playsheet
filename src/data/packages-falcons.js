// Falcons (Madden 27) custom adjustment packages — built 2026-09-22 against
// the post TU Sep 3 / TU Sep 16 meta.
//
// Five macros, three defense and two offense. Each one is a single call from
// Kenny's own book plus an adjustment stack, aimed at a named meta threat in
// src/lib/packages/metas.js. The defensive three share one idea: show the
// picture the meta has trained the offense to answer, then play the coverage
// that eats that answer.
//
//   GHOST ZERO   shows Loop Man 0, plays Cover 3 Sky with a mug dropping
//                into the hot window                  vs quick-game hot answers
//   CLAMP ROLL   shows two-high, rolls Cover 3 Cloud to the stack
//                                                     vs Clamp Stack / flood
//   PALM READER  shows Cover 1 press, plays Cover 4 Palms
//                                                     vs return routes / shots
//   ZERO TAX     six-man protection + built-in rubs    vs Loop Man 0 / hover
//   LIGHT BOX    inside zone with a double on the nose vs three-high / match
//
// Personnel assumptions come from src/data/personnel-falcons.js and the
// Falcons plan header: Bates (FS, user him deep), Watts (SS, zone not man),
// Deablo (MIKE, coverage backer), Harris (WILL, PUR 84, the free runner),
// Clark Phillips III to the slot on man calls.
//
// Honest limits: huddle.gg ships play names, not assignments, so the stock
// rush count of each base call is a read until it is checked in practice
// mode. Every adjustment carries a conf tag; `read` means test it first.

const DEF = 'falcons-def'
const OFF = 'falcons-off'

export const FALCONS_PACKAGES = [
  // ── DEFENSE ─────────────────────────────────────────────────────────────
  {
    id: 'falcons-pkg-ghost-zero',
    game: 'madden',
    side: 'defense',
    name: 'GHOST ZERO',
    tagline: 'Show Loop Man 0. Play Cover 3 with a mug in the hot window.',
    playbook: DEF,
    slot: 1,
    active: true,
    base: { playId: 'falcons-def-nickel-2--4-dbl-mug-cover-3-sky', name: 'COVER 3 SKY', formation: 'Nickel 2-4 Dbl Mug', type: 'pass' },
    twins: [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-mid-blitz-0', name: 'MID BLITZ 0', type: 'pass', role: 'The real zero. Same mugs, same front: show the ghost twice, then send it.' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-field-sim-3', name: 'FIELD SIM 3', type: 'pass', role: 'A second sim from the identical picture, pressure from the field side.' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-cover-3-seam', name: 'COVER 3 SEAM', type: 'pass', role: 'Checkout vs four vertical stems. Same look, seam defenders carry.' },
    ],
    counters: ['m27-o-quickhot'],
    user: 'FS Bates. Start at eight yards, bail to the deep middle at the snap. You are the insurance on the seam, and Deep In Zone KO only fires deep inside the hashes.',
    look: {
      shell: 0,
      rush: 6,
      press: true,
      picture: 'Double A-gap mugs, pressed corners, both safeties walked down: the Loop Man 0 picture every opponent has pre-coded an answer to.',
    },
    truth: {
      shell: 1,
      rush: 4,
      deep: 3,
      coverage: 'Cover 3 Sky. Harris and three linemen rush; Deablo bails from his mug into the hook; an edge drops to the other hook.',
    },
    lab: { shown: 'c0', played: 'c3sky', formation: 'doubles', concept: 'curlflat' },
    adjustments: [
      { adj: 'cov-align', value: 'Press', why: 'Sells man zero. Cover 3 corners press and bail into their thirds.', conf: 'm27' },
      { adj: 'cov-leverage', value: 'Commit Inside', why: 'The zero answer is a slant, stick or drag. Inside leverage makes the corner part of the trap, and TU Sep 16 punishes press with no shade.', conf: 'm27' },
      { adj: 'safety-depth', value: 'Shallow', why: 'Both safeties walked down so the shell reads zero. Bates rotates to the middle third at the snap.', conf: 'read' },
      { adj: 'dl-align', value: 'Pinch', why: 'Matches the Loop Man 0 front exactly, so the pre-snap picture is identical to MID BLITZ 0.', conf: 'm27' },
      { adj: 'ind-blitz', target: 'WILL', value: 'Default', why: 'Harris (PUR 84) is the mug who actually comes. Four rush: both tackles, the right edge, Harris.', conf: 'm27' },
      { adj: 'ind-zone', target: 'MIKE', value: 'Hook/Curl', why: 'Deablo (TAK 87) bails from the mug straight into the window the pre-decided hot throw is aimed at.', conf: 'read' },
      { adj: 'ind-zone', target: 'LEDG', value: 'Hook/Curl', why: 'The left edge drops to the boundary hook, closing the second hot window. This is the zone-blitz half of the call.', conf: 'read' },
      { adj: 'smart-zone', value: 'Aggressive', why: 'Underneath defenders break on the ball. The hot throw is out in a beat, so they need to jump it, not read it.', conf: 'read' },
    ],
    beats: [
      'The pre-decided hot throw: slant, stick or drag thrown into Deablo or the dropping edge.',
      'The max-protect check: seven stay in against four rushers and three receivers run into seven droppers.',
      'Green timing-catch rhythm: the ball is out before the read, into a defender who was not there pre-snap.',
    ],
    losesTo: [
      'Four vertical stems with a seam. Cover 3 has three deep for four verticals. Check to COVER 3 SEAM.',
      'Outside run to the dropping edge. One edge drops and the other rushes upfield, so a stretch gets outside.',
      'A patient QB who reads the post-snap safety. The disguise buys one wrong read, not a sack.',
    ],
    checkout: { playId: 'falcons-def-nickel-2--4-dbl-mug-cover-3-seam', name: 'COVER 3 SEAM', when: 'Gun Trips or Empty with a tight end or slot on the seam.' },
    tells: [
      'Identical to MID BLITZ 0 before the snap. Only the rotation after it gives the call away.',
      'If they check to max protect every time the mugs show, stop showing the ghost and send the real zero.',
    ],
    call: 'Third and 3 to 8, after they have seen MID BLITZ 0 at least once. Two ghosts for every real zero.',
    conf: 'read',
  },

  {
    id: 'falcons-pkg-clamp-roll',
    game: 'madden',
    side: 'defense',
    name: 'CLAMP ROLL',
    tagline: 'Show two-high. Roll Cover 3 Cloud to the stack.',
    playbook: DEF,
    slot: 2,
    active: true,
    base: { playId: 'falcons-def-2--4--5-over-wide-cover-3-cloud-show-2', name: 'COVER 3 CLOUD SHOW 2', formation: '2-4-5 Over Wide', type: 'pass' },
    twins: [
      { playId: 'falcons-def-2--4--5-over-wide-cover-6', name: 'COVER 6', type: 'pass', role: 'Stays two-high: quarter to the stack, half to the single side. Checkout when the stack is to the boundary.' },
      { playId: 'falcons-def-2--4--5-over-wide-cover-2-man', name: 'COVER 2 MAN', type: 'pass', role: 'Same picture, man under two deep. Phillips to the slot or do not call it.' },
      { playId: 'falcons-def-2--4--5-over-wide-tampa-2', name: 'TAMPA 2', type: 'pass', role: 'Same picture, Deablo runs the pipe. The fourth answer they cannot rule out.' },
    ],
    counters: ['m27-o-clamp', 'm27-o-flood'],
    user: 'FS Bates. Middle third after the rotation. Read the seam out of the stack first, then the dig.',
    look: {
      shell: 2,
      rush: 4,
      press: false,
      picture: 'Two safeties deep and wide over the numbers, corners off: middle of the field open, the picture Flood Seam and Motion Shuffle are called against.',
    },
    truth: {
      shell: 1,
      rush: 4,
      deep: 3,
      coverage: 'Cover 3 Cloud rolled to pass strength: the stack-side corner squats the flat, the safety over him takes the deep third, Bates closes the middle.',
    },
    lab: { shown: 'c2', played: 'c3cloud', formation: 'stack', concept: 'flood' },
    adjustments: [
      { adj: 'safety-depth', value: 'Deep', why: 'Both safeties at depth: the honest two-high picture that COVER 6, COVER 2 MAN and TAMPA 2 also show.', conf: 'read' },
      { adj: 'safety-width', value: 'Wide', why: 'Safeties over the numbers make the middle look open, which is where Flood Seam wants to throw.', conf: 'read' },
      { adj: 'roll', value: 'Pass Strength', why: 'The rotation goes to the stack. The cloud corner lands in the flat the flood needs, the sail runs into a deep third.', conf: 'ea' },
      { adj: 'zone-behavior', value: 'Look For Work', why: 'Hook defenders go find the return and the whip out of the stack instead of guarding air.', conf: 'ea' },
      { adj: 'smart-zone', value: 'Balanced', why: 'The cloud corner has to sit, not jump. Aggressive underneath gets the sail thrown over his head.', conf: 'read' },
    ],
    beats: [
      'Flood Seam and Motion Shuffle Smash: the flat is squatted, the sail meets a deep third, the seam meets Bates.',
      'Any throw decided by a two-high pre-snap read. The QB throws to where the middle was open.',
    ],
    losesTo: [
      'The flood away from the roll. Motion that flips strength after the macro is set can leave the cloud on the wrong side; re-roll by hand or check to COVER 6.',
      'Four verticals. Cover 3 carries three deep, so the fourth vertical is on a hook defender.',
      'Inside zone at a 2-4-5 box. The structural hole of Over Wide does not go away because the coverage is clever.',
    ],
    checkout: { playId: 'falcons-def-2--4--5-over-wide-cover-6', name: 'COVER 6', when: 'The stack or bunch is into the boundary.' },
    tells: [
      'Four calls from one picture: Cloud Show 2, Cover 6, Cover 2 Man, Tampa 2. Nothing pre-snap rules any of them out.',
      'Watch the rotation follow motion. Until the auto-flip patch is confirmed, it may not; that is the price.',
    ],
    call: 'First and ten and second and long against Gun Doubles Clamp Stack or any stack or bunch to the field.',
    conf: 'read',
  },

  {
    id: 'falcons-pkg-palm-reader',
    game: 'madden',
    side: 'defense',
    name: 'PALM READER',
    tagline: 'Show Cover 1 press. Play Cover 4 Palms.',
    playbook: DEF,
    slot: 3,
    active: true,
    base: { playId: 'falcons-def-3--3--5-penny-cover-4-palms', name: 'COVER 4 PALMS', formation: '3-3-5 Penny', type: 'pass' },
    twins: [
      { playId: 'falcons-def-3--3--5-penny-cover-1-robber', name: 'COVER 1 ROBBER', type: 'pass', role: 'The real single-high press. Call it when the box gets heavy.' },
      { playId: 'falcons-def-3--3--5-penny-cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', role: 'Straight quarters from the same look, no palms trap.' },
      { playId: 'falcons-def-3--3--5-penny-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', role: 'Checkout vs 3x1 with the back to the trips side.' },
    ],
    counters: ['m27-o-return', 'm27-o-vertical'],
    user: 'FS Bates. Field quarter. Stay on top of #1 vertical; the palms corner takes the out-breaker, you take what goes deep.',
    look: {
      shell: 1,
      rush: 4,
      press: true,
      picture: 'Corners pressed, one safety deep and the other offset toward the boundary: a single-high man look that invites the return route and the go ball.',
    },
    truth: {
      shell: 2,
      rush: 4,
      deep: 4,
      coverage: 'Cover 4 Palms. Two-read on each side: if #2 goes out the corner traps it, if #1 goes deep the safety carries him.',
    },
    lab: { shown: 'c1', played: 'palms', formation: 'doubles', concept: 'curlflat' },
    adjustments: [
      { adj: 'cov-align', value: 'Press', why: 'Sells Cover 1. Press man is what the return route and the back-shoulder go are called against.', conf: 'm27' },
      { adj: 'cov-leverage', value: 'Shade Over Top', why: 'Required with press since TU Sep 16. Over the top keeps the corner on the go while the palms rule handles the return.', conf: 'm27' },
      { adj: 'safety-midpoint', value: 'Field', why: 'Offsets the pair so the boundary safety looks rolled down: a single-high picture from a two-high call.', conf: 'read' },
      { adj: 'safety-width', value: 'Pinch', why: 'Pinched safeties read as one in the middle and one creeping. They still reach their quarters vs 2x2.', conf: 'read' },
      { adj: 'match-check', value: 'Solo', why: 'Vs 3x1 the backside corner goes solo and both safeties key the trips side, where the return comes from.', conf: 'read' },
      { adj: 'plaster', value: 'Aggressive', why: 'If he extends, the quarter defenders attach to the nearest route, which is where a return route ends up.', conf: 'ea' },
    ],
    beats: [
      'Return routes out of 2x2. The corner traps the out-breaking return, the safety sits on #1 vertical.',
      'Shot plays called against a single-high press look. There are two over the top at the snap, not one.',
    ],
    losesTo: [
      'Runs at a 3-3-5 box with four deep. Inside zone and duo get five a carry; mix in COVER 1 ROBBER.',
      'Quick flat-curl to the field. Quarters corners squat late, so short and fast beats it.',
      'A slot fade against the rotated safety if he is late to his quarter.',
    ],
    checkout: { playId: 'falcons-def-3--3--5-penny-cover-3-match', name: 'COVER 3 MATCH', when: '3x1 trips with the back set to the trips side.' },
    tells: [
      'Pressed corners in both COVER 1 ROBBER and this call. Their man-beater is the same throw every time.',
      'If they stop throwing the return and start running, you are winning the pass and losing the box. Send ROBBER.',
    ],
    call: 'Second and 6 to 10, and the next snap after they complete a return route.',
    conf: 'read',
  },

  // ── OFFENSE ─────────────────────────────────────────────────────────────
  {
    id: 'falcons-pkg-zero-tax',
    game: 'madden',
    side: 'offense',
    name: 'ZERO TAX',
    tagline: 'Six in protection, rubs built in. Make the mug pay.',
    playbook: OFF,
    slot: 1,
    active: true,
    base: { playId: 'falcons-off-gun-bunch-wide-nasty-cheat-drag-rub-crosser', name: 'CHEAT DRAG RUB CROSSER', formation: 'Gun Bunch Wide Nasty', type: 'pass' },
    twins: [
      { playId: 'falcons-off-gun-bunch-wide-nasty-l-spot', name: 'L SPOT', type: 'pass', role: 'Release traffic frees the spot sitter vs man. Same bunch, different winner.' },
      { playId: 'falcons-off-gun-bunch-wide-nasty-branch-return', name: 'BRANCH RETURN', type: 'pass', role: 'The return route when a ghost sim drops a hook into the crossers.' },
      { playId: 'falcons-off-gun-bunch-wide-nasty-inside-zone', name: 'INSIDE ZONE', type: 'run', role: 'If the mugs back out, the box is light. Keeps the mug honest.' },
      { playId: 'falcons-off-gun-bunch-wide-nasty-hb-slip-screen', name: 'HB SLIP SCREEN', type: 'run', role: 'Against a real six-man send. Bijan in space behind the rush.' },
    ],
    counters: ['m27-d-loop0', 'm27-d-hover'],
    look: {
      picture: 'Gun Bunch Wide Nasty: tight 3x1 bunch with the tightest split in the book. The same picture as four other calls, including a run and a screen.',
    },
    truth: {
      blockers: 5,
      releases: 5,
      hotBuiltIn: true,
      concept: 'Rub crossers under man coverage with a drag underneath. The rub picks the trail defender before the loopers arrive.',
    },
    lab: { shown: 'c0', played: 'c1', formation: 'bunch', concept: 'mesh' },
    adjustments: [
      { adj: 'id-mike', value: 'Mike', why: 'Points the protection at the mug who is actually coming. Loop 0 shows six and brings four; naming the right one kills the loop.', conf: 'm27' },
      { adj: 'ind-block', target: 'HB', value: 'Pass Block', why: 'Six in protection against a front that shows six. The back is the half-second the rub needs.', conf: 'm26' },
      { adj: 'block-style', value: 'Balanced', why: 'Aggressive draws holding since TU Sep 3. A flag on third down is a sack you paid for.', conf: 'm27' },
    ],
    beats: [
      'Man zero behind a mug front. The rub picks the trail man before the loopers get home.',
      'The A-gap hover. The back and the ID take away the gap the user is sitting in.',
    ],
    losesTo: [
      'Ghost-zero sims that drop a hook into the crossers. Throw BRANCH RETURN instead.',
      'Cover 2 Invert or a robber sitting in the middle: crossers run into a safety.',
    ],
    checkout: { playId: 'falcons-off-gun-bunch-wide-nasty-flood-switch', name: 'FLOOD SWITCH', when: 'Mugs show but both safeties stay deep: that is a sim with two over the top, so go outside.' },
    tells: [
      'The macro touches only the HB and the protection, so it survives a flipped call. Routes stay stock; the rub is built in.',
      'Four calls from one bunch, two of them runs. The mug cannot sit on the crosser.',
    ],
    call: 'Any time the double mug shows on second or third and medium. Snap it quickly: the loop needs a beat to develop.',
    conf: 'read',
  },

  {
    id: 'falcons-pkg-light-box',
    game: 'madden',
    side: 'offense',
    name: 'LIGHT BOX',
    tagline: 'Three high means six in the box. Run it.',
    playbook: OFF,
    slot: 2,
    active: true,
    base: { playId: 'falcons-off-gun-trips-te-flex-inside-zone', name: 'INSIDE ZONE', formation: 'Gun Trips TE Flex', type: 'run' },
    twins: [
      { playId: 'falcons-off-gun-trips-te-flex-stick', name: 'STICK', type: 'pass', role: 'Seven in the box: throw the stick to the vacated side. Best hot in the book.' },
      { playId: 'falcons-off-gun-trips-te-flex-rpo-zone-alert-omaha', name: 'RPO ZONE ALERT OMAHA', type: 'pass', role: 'The same run with a built-in throw when the overhang crashes.' },
      { playId: 'falcons-off-gun-trips-te-flex-mtn-fork-h-choice', name: 'MTN FORK H CHOICE', type: 'pass', role: 'Option route that self-corrects vs match or man.' },
    ],
    counters: ['m27-d-3high', 'm27-d-match'],
    look: {
      picture: 'Gun Trips TE Flex: three receivers to the field and a flexed tight end. The same picture as STICK and the RPO, flagged as one of the best stock formations in the game.',
    },
    truth: {
      blockers: 6,
      releases: 3,
      concept: 'Inside zone at a six-man box, with a double team on the nose so the Mike is the only unblocked fit.',
    },
    adjustments: [
      { adj: 'double-team', value: 'Nose / 1-tech', why: 'Three-high leaves six in the box. Double the nose and climb to the Mike.', conf: 'm27' },
      { adj: 'block-style', value: 'Balanced', why: 'Aggressive draws holding since TU Sep 3, and zone blocking got its own fix in the same patch.', conf: 'm27' },
      { adj: 'motion', target: 'WR3', value: 'Across', why: 'By hand at the line. Match coverage re-declares strength on motion, and the safety that moves tells you the box count before the snap.', conf: 'read' },
    ],
    beats: [
      'Three-high shells: six in the box against six blockers and a double.',
      'Match coverage. Match rules govern routes, not run fits.',
    ],
    losesTo: [
      'Pinch and loop fronts like Loop Man 0: inside zone runs into a pinched line. Check to STICK.',
      'A seventh man walked down. The numbers are gone; throw it.',
    ],
    checkout: { playId: 'falcons-off-gun-trips-te-flex-stick', name: 'STICK', when: 'Seven in the box, or both mugs in the A gaps.' },
    tells: [
      'Count the safeties: three high, run it. Two high with the nickel walked down, the RPO. One high, STICK.',
    ],
    call: 'First and ten and second and medium against any three-high look.',
    conf: 'm27',
  },
]
