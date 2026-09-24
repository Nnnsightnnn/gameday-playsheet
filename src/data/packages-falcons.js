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
// Gauntlet additions (2026-09-24, package-scout skill, blind critics vs G1-G9):
//   SEVENTH HAT  shows two-high, plays Cover 1 Robber: Watts is the unblocked
//                seventh hat                          vs QB run / scramble
//   SHOT CLOCK   shows quarters, sends a six-man Cover 3 fire zone
//                                                     vs return routes
//   ZERO LID     shows Cover 0 press, plays Cover 2 Man vs vertical shots
//   WHIPSAW      whip holds the cloud corner, the #1 post splits the halves
//                                                     vs sim / fire zone
//   SWITCHBOARD  bunch speed dig: two in-breakers, one match safety
//                                                     vs match coverage
//   VACANCY      untarget the hover, throw where he left
//                                                     vs A-gap hover
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
    userObjectives: [
      { id: 'bail-safety', phase: 'pre', player: 'FS', note: 'Jessie Bates III walks down to eight with Watts so the shell reads zero. Hold it through any check or motion.' },
      { id: 'mof-deep-user', phase: 'snap', player: 'FS', note: 'Bates turns and bails to the deep middle at the snap. Carry the seam; the hot throw underneath belongs to Deablo.' },
    ],
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
      { adj: 'coverage-shell', value: 'Cover 0', why: 'Programs the zero picture into the macro itself: both safeties down before the snap, Cover 3 Sky after it. Confirm Dbl Mug offers the Cover 0 shell for this call in practice.', conf: 'read' },
      { adj: 'cov-align', value: 'Press', why: 'Sells man zero. Cover 3 corners press and bail into their thirds.', conf: 'm27' },
      { adj: 'cov-leverage', value: 'Inside', why: 'The zero answer is a slant, stick or drag. Inside leverage makes the corner part of the trap, and TU Sep 16 punishes press with no shade.', conf: 'm27' },
      { adj: 'safety-depth', value: '5', why: 'Both safeties walked down to five yards so the shell reads zero. Bates rotates to the middle third at the snap.', conf: 'read' },
      { adj: 'dl-align', value: 'Pinch', why: 'Matches the Loop Man 0 front exactly, so the pre-snap picture is identical to MID BLITZ 0.', conf: 'm27' },
      { adj: 'ind-blitz', target: 'WILL', value: 'Blitz', why: 'Harris (PUR 84) is the mug who actually comes. Four rush: both tackles, the right edge, Harris.', conf: 'm27' },
      { adj: 'ind-zone', target: 'MIKE', value: 'Hook Curl', why: 'Deablo (TAK 87) bails from the mug straight into the window the pre-decided hot throw is aimed at.', conf: 'read' },
      { adj: 'ind-zone', target: 'LEDG', value: 'Hook Curl', why: 'The left edge drops to the boundary hook, closing the second hot window. This is the zone-blitz half of the call.', conf: 'read' },
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
    userObjectives: [
      { id: 'mof-deep-user', phase: 'snap', player: 'FS', note: 'Jessie Bates III closes the middle third after the roll. Seam out of the stack first, then drive on the dig.' },
    ],
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
      { adj: 'coverage-shell', value: 'Cover 2', why: 'Stores the two-high picture in the macro. The call is literally Cloud Show 2, so the Cover 2 shell is the look it was built to give.', conf: 'm27' },
      { adj: 'safety-depth', value: '16', why: 'Both safeties at sixteen yards: the honest two-high picture that COVER 6, COVER 2 MAN and TAMPA 2 also show.', conf: 'read' },
      { adj: 'safety-width', value: 'Wide', why: 'Safeties over the numbers make the middle look open, which is where Flood Seam wants to throw.', conf: 'read' },
      { adj: 'roll', value: 'Pass Strength', why: 'The rotation goes to the stack. The cloud corner lands in the flat the flood needs, the sail runs into a deep third.', conf: 'ea' },
      { adj: 'zone-behavior', value: 'On', why: 'Hook defenders go find the return and the whip out of the stack instead of guarding air.', conf: 'ea' },
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
    userObjectives: [
      { id: 'mof-deep-user', phase: 'snap', player: 'FS', note: 'Jessie Bates III plays the field quarter from the pinched look. Stay on top of #1 vertical; the palms corner owns the out-breaker.' },
    ],
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
      { adj: 'coverage-shell', value: 'Cover 3', why: 'Stores a single-high shell over the palms call, so the QB reads one safety in the middle and throws the man-beater into two-deep.', conf: 'read' },
      { adj: 'cov-align', value: 'Press', why: 'Sells Cover 1. Press man is what the return route and the back-shoulder go are called against.', conf: 'm27' },
      { adj: 'cov-leverage', value: 'Over the Top', why: 'Required with press since TU Sep 16. Over the top keeps the corner on the go while the palms rule handles the return.', conf: 'm27' },
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
    userObjectives: [
      { id: 'pass-pro-pickup', phase: 'snap', player: 'HB', note: 'Bijan Robinson stays in and takes the mug the Mike ID points at. If both mugs bail, he is the checkdown.' },
    ],
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
      { adj: 'id-mike', value: 'MIKE', why: 'Moves the M icon onto the Mike mug so the back owns the man who is actually coming. Loop 0 shows six and brings four; naming the right one kills the loop.', conf: 'm27' },
      { adj: 'ind-block', target: 'HB', value: 'Pass Block', why: 'Six in protection against a front that shows six. The back is the half-second the rub needs.', conf: 'm27' },
      { adj: 'block-style', value: 'Balanced', why: 'Aggressive draws holding since TU Sep 3. A flag on third down is a sack you paid for. Option names are unconfirmed.', conf: 'read' },
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
    userObjectives: [
      { id: 'read-option-user', phase: 'post', player: 'HB', note: 'User Bijan Robinson after the handoff. Press the A gap behind the double on the nose, cut back if the Mike fills fast.' },
    ],
    look: {
      picture: 'Gun Trips TE Flex: three receivers to the field and a flexed tight end. The same picture as STICK and the RPO, flagged as one of the best stock formations in the game.',
    },
    truth: {
      blockers: 6,
      releases: 3,
      concept: 'Inside zone at a six-man box: six blockers for six, with the nose doubled so his run-stop abilities do not blow up the play.',
    },
    adjustments: [
      { adj: 'double-team', value: 'DT', why: 'Two linemen on the nose. On the run it only blunts his run-stop abilities (Inside Stuff and the like), it does not build a combo to the Mike; its real value is protection on the STICK and RPO twins.', conf: 'm26' },
      { adj: 'block-style', value: 'Balanced', why: 'Aggressive draws holding since TU Sep 3, and zone blocking got its own fix in the same patch. Option names are unconfirmed.', conf: 'read' },
      { adj: 'motion', target: 'WR3', value: 'Left', why: 'By hand at the line, back across the formation away from trips. Match coverage re-declares strength on motion, and the safety that moves tells you the box count before the snap.', conf: 'read' },
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

  // ── GAUNTLET ADDITIONS (2026-09-24) ─────────────────────────────────────
  // Six packages built by the package-scout gauntlet: builder + blind critic
  // against G1-G9 (docs/packages/package-scout-SKILL.md), then reconciled with
  // civil.gg M27 play art. Every one passed; none is proven until its
  // practice reps are run and logged.
  // Gauntlet slice d1 (revision 3): defensive package vs m27-o-qbrun
  // (QB Zone / QB Wrap / extend-and-run). Same shape and voice as
  // src/data/packages-falcons.js.
  //
  // House rules honoured: Watts (SS, MCV 72) plays zone, never man
  // (src/data/gameplans-falcons.js); Kenny users FS Bates deep; Harris is the
  // programmed CPU spy. Clark Phillips III was traded (personnel-falcons.js),
  // so no man job is handed to him.
  //
  // Research (Sep 2026):
  //   civil.gg M27 play art, Falcons Nickel 2-4 (conf m27; diagrams read by the
  //     coordinator): https://www.civil.gg/playbooks/team/nfl/defense/falcons/nickel/2-4
  //     COVER 1 ROBBER  four straight rushers (no contain marks); the offense-left
  //                     safety goes to the deep middle; the offense-right safety
  //                     drops into the robber zone at about 10 yards in the middle;
  //                     both corners, the slot and both LBs are in man.
  //     COVER 1 CONTAIN built-in QB spy on the offense-left LB, contain rushes
  //                     on both edges, one deep safety, the other safety in man.
  //     TAMPA 2         safeties in deep halves, one LB in the deep middle hook,
  //                     the slot and the other LB in hook/curl, corners in the flats.
  //     COVER 2 MAN     two deep halves, five under in man, four rush.
  //     Pre-snap, all four calls draw both safeties at the same depth.
  //   madden.tools, Nickel 2-4 Cover 1 Robber (page text): "Four defensive
  //     linemen rush off the snap while the linebackers and corners lock up in
  //     man across from every eligible receiver, leaving the deep safety alone
  //     on top and the robber (yellow zone) as the second level trap defender."
  //     The robber keys the QB's eyes and "sits right in" mesh, drag and
  //     crossing traffic. Weakness: "offenses attacking the flat or running backs
  //     leaking out to the boundary since the robber is occupied inside".
  //     https://madden.tools/playbooks/formation/nickel/2-4/cover-1-robber
  //   madden.tools Nickel 2-4 TAMPA 2 art: corners in the flats, safeties in
  //     halves, three hook/middle defenders.
  //     https://madden.tools/playbooks/formation/nickel/2-4/tampa-2
  //   Timesaver M27 money plays: QB Zone and QB Wrap "from Pistol and QB-run sets
  //     like Gun Wing Slot Offset" https://timesaver.gg/blog/madden-nfl-27-best-money-plays
  //   madden.tools QB Zone: inside zone, line steps playside, HB leads.
  //     https://madden.tools/playbooks/formation/shotgun/wing/qb-zone
  //   Civil.GG M27 containing rollouts: QB Contain holds the edges.
  //     https://www.civil.gg/tips/madden-27-containing-qb-rollouts
  //   MUT.GG M27 forum: "send the spy sooner"; contain alone is mixed.
  //   Trends m27-plaster-logic: zones attach once the QB leaves the pocket.
  //
  // Dependencies (read, each falsified by a practice rep):
  //   1. The Coverage Shell picker offers Cover 2 Man over Cover 1 Robber (rep 1).
  //   2. The art puts the robber on the offense-right safety. Whether that is
  //      Watts or Bates depends on alignment and strength, which the art cannot
  //      show, and the midpoint step may move it (rep 1).
  //   3. The spy step takes Harris off his man, most likely the back, which
  //      leaves the back free on a pass (rep 1 shows who; rep 3 punishes it).
  //   4. TAMPA 2's corners are in the flats (confirmed by the art); whether they
  //      and contain beat the back's flat route and the sprint-out with the macro
  //      stacked on is rep 3.
  {
    id: 'falcons-pkg-seventh-hat',
    game: 'madden',
    side: 'defense',
    name: 'SEVENTH HAT',
    tagline: 'Show a two-high, six-man box and they check to QB Zone. Watts, the robber, comes down from 12 into the hole as the unblocked seventh defender.',
    playbook: 'falcons-def',
    slot: 4,
    active: true,
    base: {
      playId: 'falcons-def-nickel-2--4-cover-1-robber',
      name: 'COVER 1 ROBBER',
      formation: 'Nickel 2-4',
      type: 'pass',
    },
    twins: [
      {
        playId: 'falcons-def-nickel-2--4-tampa-2',
        name: 'TAMPA 2',
        type: 'pass',
        role: 'Move two, from the same formation, the same two-high picture and the same macro. Contain stays on, plaster stays armed and Harris still spies, but the corners squat the flats. When they answer the stuffed QB Zone by throwing to the back Harris left (JET SPRINT HB SLIDE), the corner is already in the flat and contain has turned the sprint-out.',
      },
      {
        playId: 'falcons-def-nickel-2--4-cover-2-man',
        name: 'COVER 2 MAN',
        type: 'pass',
        role: 'The honest version of the picture: both safeties really stay deep. Call it once a half so the two-high look keeps meaning two-high.',
      },
      {
        playId: 'falcons-def-nickel-2--4-cover-1-contain',
        name: 'COVER 1 CONTAIN',
        type: 'pass',
        role: 'Same two-high picture (civil.gg art), with contain rushes and a built-in QB spy on the offense-left LB. The macro also makes Harris a spy, so if Harris is not that LB you get two spies and one fewer man defender. Use it against a pocket QB who throws the dig into the robber.',
      },
    ],
    counters: [
      'm27-o-qbrun',
    ],
    user: 'FS Bates. Deep middle over the top of everything. Stand level with Watts at twelve so the shell reads two-high, then bail to the middle at the snap. You are the only deep defender once Watts drops into the hole; on a QB run, come down only after he crosses the line.',
    look: {
      shell: 2,
      rush: 4,
      press: false,
      picture: 'Two safeties level at twelve yards, corners off, six in the box (four down, Deablo and Harris). The pre-coded answer is QB Zone from Gun Wing Slot Offset or Pistol, or QB Wrap from Gun Bunch TE: five linemen, the wing and the lead back are seven blockers for six defenders, and the QB is the runner, so the offense has a hat for every box defender.',
    },
    truth: {
      shell: 1,
      rush: 4,
      deep: 1,
      coverage: 'Cover 1 Robber, per the civil.gg M27 art and madden.tools: four straight rushers, both corners, the slot and both linebackers in man, the offense-left safety deep in the middle, and the offense-right safety in the robber zone at about ten yards. The macro adds contain on both edges (the stock rush has none) and makes Harris the QB spy. At the snap the box holds four contain rushers, Harris and Deablo, the six that the zone scheme set its seven blockers on. Watts is a zone player here, not man. As the robber (read: that he is the offense-right safety), he drops from twelve yards into the hole at about ten over the ball, keys the QB\'s eyes, and when the QB keeps it he fills the B/C gap. No blocker was assigned to a defender who was at twelve at the snap, so Watts arrives unblocked as the seventh defender. Contain means the QB Wrap cannot bounce, so it cuts inside the wrap block into Watts. Deablo\'s man is the back; when the back leads or blocks, Deablo stays clean and flows to the ball as a free runner, never taking on the block (plan doctrine: keep him clean). If the shell step fails, the depth and midpoint steps still hold both safeties high. Even with no disguise, contain, a spy and a robber still leave QB Zone with no spare blocker; the shell only makes them more likely to call it.',
    },
    lab: { shown: 'c2', played: 'c1', formation: 'doubles', concept: 'mesh' },
    adjustments: [
      {
        adj: 'coverage-shell',
        value: 'Cover 2 Man',
        why: 'Stores the two-high picture over a single-high call so the QB-run user reads a light box. Whether the picker offers Cover 2 Man over this call is rep 1. If it does not, the safety-depth step below still carries the look.',
        conf: 'read',
      },
      {
        adj: 'safety-depth',
        value: '12',
        why: 'The load-bearing step: both safeties level at twelve, so the box counts six and QB Zone looks like a numbers win. It also keeps Watts out of the box count when the zone scheme assigns blockers, so the robber drop makes him the unblocked seventh.',
        conf: 'read',
      },
      {
        adj: 'safety-midpoint',
        value: 'Strong',
        why: 'Slides the pair toward the wing, so Bates starts nearer the deep middle (a shorter, later rotation) and Watts starts nearer the hole over the wing side. Whether it also keeps Watts as the robber is rep 1.',
        conf: 'read',
      },
      {
        adj: 'cov-align',
        value: 'Back Off',
        why: 'Off corners complete the soft two-high picture a run-first opponent audibles against. Press would read as man and invite the scramble instead of the designed run.',
        conf: 'ea',
      },
      {
        adj: 'cov-leverage',
        value: 'Over the Top',
        why: 'After the rotation only Bates is deep, so the off man corners stay on top of the go ball. That matters more since TU Sep 16 extended the lead on vertical throws.',
        conf: 'ea',
      },
      {
        adj: 'ind-spy',
        target: 'WILL',
        value: 'QB Spy',
        why: 'The macro, not the play, creates the spy: Christian Harris (SPD 89, ACC 93, PUR 84) mirrors the QB. He was likely manning the back, so the back is free on a pass; TAMPA 2 is the answer when they find him.',
        conf: 'm27',
      },
      {
        adj: 'contain-all',
        value: 'Both',
        why: 'Adds the contain that COVER 1 ROBBER lacks: the civil.gg art shows four straight rushers with no contain marks. It is stored so it also carries onto TAMPA 2. Since TU Sep 3 tackles pick up contain, so here it only squeezes the wrap inside to Watts and turns the sprint-out back.',
        conf: 'm27',
      },
      {
        adj: 'plaster',
        value: 'Aggressive',
        why: 'Covers extend-and-run: once he escapes, Watts in the robber zone (and every TAMPA 2 zone) attaches to the nearest receiver instead of guarding grass, so there is no scramble-drill throw.',
        conf: 'ea',
      },
      {
        adj: 'plaster-trigger',
        value: 'Out of Pocket',
        why: 'Fires plaster the moment he leaves the pocket, not on the clock, so the attach happens before he can throw back across the field.',
        conf: 'ea',
      },
    ],
    beats: [
      'QB Zone from Gun Wing Slot Offset or Pistol: seven blockers are set on six box defenders, and the robber comes from twelve as the unblocked seventh.',
      'QB Wrap from Gun Bunch TE: contain turns the bounce back, and the QB cuts inside the wrap block into Watts, with Harris mirroring.',
      'Extend-and-run: Harris mirrors the escape lane and plaster attaches the robber and deep zone, so neither the run nor the late throw is there.',
      'MESH SPOT from the same set: the robber sits in the crossing traffic (madden.tools), so the usual rub answer to man runs into Watts.',
    ],
    losesTo: [
      'The competent answer after one stuffed QB Zone: throw to the back Harris left, a flat or slide route such as JET SPRINT HB SLIDE from Gun Wing Slot Offset. madden.tools names the flat and a leaking back as this call\'s weakness. Move two is TAMPA 2 from the same picture.',
      'FOUR VERTICALS from the same set: after the rotation, Bates is alone against two seams. The disguise costs a deep defender.',
      'TAMPA 2 against QB Zone: move two has a light box. Call it only after they have turned to the pass, and go back to COVER 1 ROBBER the snap they go back to the run.',
    ],
    checkout: {
      playId: 'falcons-def-nickel-2--4-tampa-2',
      name: 'TAMPA 2',
      when: 'The snap after they answer a stuffed QB Zone by throwing to the back in the flat, or whenever they go Empty: flat corners, zone underneath, contain and plaster still on.',
    },
    tells: [
      'Wing on the line with an offset back (Gun Wing Slot Offset), Pistol with a tight end, or Gun Bunch TE: those are the QB Zone and QB Wrap sets. Call this against them.',
      'An audible after they see the two-high shell usually goes to the QB run. That check is what this package is built to catch.',
      'Before the snap, if a safety sits at nine or shallower, the depth step did not hold and the box count is honest. Re-set it by hand.',
      'COVER 1 ROBBER, COVER 1 CONTAIN, TAMPA 2 and COVER 2 MAN all draw both safeties at the same depth (civil.gg M27 art). Nothing before the snap tells them robber, spy, halves or man.',
      'If the back releases on the first pass snap and nobody goes with him, that is the price of the spy. The next call is TAMPA 2.',
    ],
    call: 'First and ten and second and short to medium against Pistol, Gun Wing Slot Offset or Gun Bunch TE with a mobile QB. Also third and 2 to 6 after he has run for a first down. The sequence: COVER 1 ROBBER until they throw to the back, then TAMPA 2 once, then back.',
    sequence: [
      {
        if: 'They line up in Pistol, Gun Wing Slot Offset or Gun Bunch TE with a mobile QB (QB Zone / QB Wrap threat)',
        call: 'COVER 1 ROBBER',
        playId: 'falcons-def-nickel-2--4-cover-1-robber',
      },
      {
        if: 'After a stuffed QB Zone they stay in the set and throw to the back Harris left (flat, slide or swing)',
        call: 'TAMPA 2',
        playId: 'falcons-def-nickel-2--4-tampa-2',
      },
      {
        if: 'They go back to QB Zone or QB Wrap against the TAMPA 2 light box',
        call: 'COVER 1 ROBBER',
        playId: 'falcons-def-nickel-2--4-cover-1-robber',
      },
    ],
    userObjectives: [
      {
        id: 'mof-deep-user',
        phase: 'snap',
        player: 'FS',
        note: 'Jessie Bates III: from twelve yards, get to the deep middle and stay over the deepest inside route. You are the only deep defender once Watts drops into the robber hole.',
      },
      {
        id: 'bail-safety',
        phase: 'post',
        player: 'FS',
        note: 'Jessie Bates III: the shell showed two-high and you bailed to one-high. Drive on the post or seam once they declare; on a QB keep, come down only after he crosses the line, behind Watts and Harris.',
      },
    ],
    practice: [
      {
        setup: '',
        verify: 'Offense runs QB ZONE from Gun Wing Slot Offset (Cardinals book); expect Bates and Watts level at 12 before the snap (shell and depth held), Harris to show the spy assignment, and Watts to drop into the robber hole and fill the B gap unblocked for a tackle inside 3 yards. If Bates takes the robber drop instead, the midpoint step flipped them.',
      },
      {
        setup: '',
        verify: 'Offense runs QB WRAP from Gun Bunch TE (Cardinals book); expect the contain end to turn the QB inside the wrap block and Watts (robber) to fill that cut for 2 yards or less.',
      },
      {
        setup: '',
        verify: 'Offense runs JET SPRINT HB SLIDE from Gun Wing Slot Offset (Cardinals book) against TAMPA 2 with the macro on; expect the flat corner to meet the back at the catch and contain to turn the sprint-out back inside.',
      },
    ],
    conf: 'read',
    gauntlet: { passed: '2026-09-24', rounds: 5, art: 'civil.gg M27 diagrams' },
  },

  // SHOT CLOCK — Falcons defensive package, slot 5. Reconciled 2026-09-24 with
  // civil.gg play art for the Falcons book. Built against m27-o-return (Return
  // Bench and Y Ohio Return out of Gun Doubles Clamp Stack, Cheat Flat X Post out
  // of Gun Normal Y Off Close).
  //
  // PALM READER beats return routes with coverage: a Cover 4 Palms trap.
  // SHOT CLOCK beats them with the clock. A return route is a double move, up
  // and in and then back out, and the QB has to hold the ball through both
  // breaks. Show the stock Nickel 2-4 two-high picture, then let the macro turn
  // a four-man Cover 3 Sky into a six-man fire zone. The right-side Sky safety
  // comes down into the curl-flat, which is where a return comes back to.
  //
  // The front. Nickel 2-4 is two interior tackles (DT Dexter, DT Dorlus), two
  // edges (LEDG Ebukam, REDG Za'Darius Smith) and two off-ball backers (Deablo,
  // Harris). The "front four" is the two DTs plus the two edges.
  // Madden 27 files the edges as LEDG/REDG, not DE or OLB (personnel-falcons.js).
  //
  // Sources:
  //   civil.gg Falcons Nickel 2-4 play art (https://www.civil.gg/playbooks/team/nfl/defense/falcons/nickel/2-4):
  //     The pre-snap alignment is identical across COVER 3 SKY, COVER 3 CLOUD,
  //       COVER 4 QUARTERS and COVER 4 PALMS.
  //     COVER 3 SKY: four rush; both corners take the deep outside thirds; the
  //       offense-left safety takes the deep middle; the offense-right safety
  //       comes down to the right curl-flat; the SLOT takes the left curl-flat;
  //       both linebackers take hooks.
  //     COVER 3 CLOUD: the right corner takes the cloud flat, the right safety
  //       the deep right third, the left safety the deep middle, the left corner
  //       the deep left third, the SLOT the left curl-flat, both linebackers hooks.
  //     QUARTERS and PALMS (identical diagrams, a match tag): four deep, the SLOT
  //       to the left curl-flat, one linebacker to the right curl-flat, the
  //       other to the middle hook.
  //   madden.tools COVER 3 SKY page: "a standard four man rush", and "rolls the
  //     strong safety down". This is the only source that the Sky safety is the
  //     SS (Watts). The art fixes him on the right; it does not name him.
  //   Timesaver TU Sep 16 notes: fixed "Coverage Shell not always being respected".
  //   EDGE BLITZ 3 was rejected: its madden.tools diagram puts extra defenders
  //     on the line before the snap.
  // The six rushers (front four + SLOT + WILL) are set by the macro. Rep 1
  // counts them.
  //
  // Roll step removed: the art fixes the Sky safety on the right, so no roll
  // step is needed.
  {
    id: 'falcons-pkg-shot-clock',
    game: 'madden',
    side: 'defense',
    name: 'SHOT CLOCK',
    tagline: 'Show stock quarters, bring six. The return route needs a second break, and the rush arrives before it. The right-side Sky safety sits where it comes back to.',
    playbook: 'falcons-def',
    slot: 5,
    active: true,
    base: {
      playId: 'falcons-def-nickel-2--4-cover-3-sky',
      name: 'COVER 3 SKY',
      formation: 'Nickel 2-4',
      type: 'pass',
    },
    twins: [
      {
        playId: 'falcons-def-nickel-2--4-cover-4-quarters',
        name: 'COVER 4 QUARTERS',
        type: 'pass',
        role: 'The honest version of the picture: two really stay deep and the front four rush. The civil.gg art shows the same pre-snap alignment, with four deep and three under (m27). Call it twice for every SHOT CLOCK so the look keeps meaning quarters.',
      },
      {
        playId: 'falcons-def-nickel-2--4-cover-3-cloud',
        name: 'COVER 3 CLOUD',
        type: 'pass',
        role: 'The answer to the quick hot. Once they start getting the ball out to the flat or a slant before six arrive, call this plain with no macro. The civil.gg art shows the same pre-snap alignment (m27). The front four rush and seven drop. The right corner squats the cloud flat, Bowman stays in the left curl-flat he vacates in SHOT CLOCK, and both backers sit in the hooks on the slant. Both flats are covered.',
      },
      {
        playId: 'falcons-def-nickel-2--4-cover-4-palms',
        name: 'COVER 4 PALMS',
        type: 'pass',
        role: 'The answer to max protect. Call it plain with no macro when they keep the back and TE in. The civil.gg art shows the same pre-snap alignment (m27). The front four rush and seven drop: four deep, Bowman in the left curl-flat, a backer in the right curl-flat and one in the hook. Three receivers run into seven droppers, and the palms corner traps the return.',
      },
    ],
    counters: [
      'm27-o-return',
    ],
    user: 'FS Bates. Kenny users Jessie Bates III in the deep middle third. Pre-snap: sit level with Watts, square and still at safety depth, with no creep, so the QB sees honest quarters. At the snap: open to the middle third and stay over the post. On Cheat Flat X Post, the X post is yours. Watts is the CPU Sky safety coming down to the right curl-flat, per the civil.gg art. Leave the return to him and the rush. Once the ball is out, drive on anything thrown inside the hashes over Deablo.',
    look: {
      shell: 2,
      rush: 4,
      press: false,
      picture: 'The stock Nickel 2-4 zone alignment. The civil.gg art shows it identical for COVER 3 SKY, COVER 4 QUARTERS, COVER 4 PALMS and COVER 3 CLOUD (m27). Two safeties level and high, corners off, and a front four: Dexter and Dorlus inside, Ebukam and Za\'Darius Smith on the edges. Bowman is just off the ball over the slot, and Deablo and Harris are at linebacker depth. Nobody is walked up. The Cover 4 shell is stored in the macro. A return-route player reads this as quarters and has already chosen his answer: the Y return or Return Bench, thrown when the quarters flat defender passes the stem off and the route comes back to grass.',
    },
    truth: {
      shell: 1,
      rush: 6,
      deep: 3,
      coverage: 'Cover 3 fire zone: six rush, five drop. The stock Cover 3 Sky rushes the front four: Dexter and Dorlus inside, Ebukam and Za\'Darius Smith off the edges. The madden.tools page calls it "a standard four man rush". The macro adds Bowman (SLOT, SPD 92) from over the slot and Harris (WILL, PUR 84) from linebacker depth. The protection has six blockers at most. If the back releases into the return pattern, one blitzer is unblocked by count. If he stays, it is six on six, and the back has to pick Bowman or Harris up in space. The return cannot be thrown until its second break, and the six are built to arrive before it (rep 2 times this). Behind the rush, the stock Sky rotation holds (civil.gg art). The offense-right safety comes down to the right curl-flat at ten, which is Watts per madden.tools ("rolls the strong safety down"; rep 1 confirms it). The left safety, Bates, takes the deep middle. Terrell and Hughes take the outside thirds, and Deablo stays in a hook under the in-cut. A return on the right is thrown late into Watts or not thrown at all. A return on Bowman\'s side, the left, comes back into the curl-flat he vacated, so it has to be beaten by the rush alone. That flat is the price, and COVER 3 CLOUD is the answer when they go there.',
    },
    lab: { shown: 'c4', played: 'c3sky', formation: 'stack', concept: 'curlflat' },
    adjustments: [
      {
        adj: 'coverage-shell',
        value: 'Cover 4',
        why: 'Stores the quarters picture so the macro holds it to the snap. The civil.gg Sky art already shows two level safeties (m27), and TU Sep 16 fixed shells not being respected. Whether Nickel 2-4 lists Cover 4 on the right-stick picker for Cover 3 Sky is checked in rep 1.',
        conf: 'read',
      },
      {
        adj: 'cov-leverage',
        value: 'Over the Top',
        why: 'Only three are deep behind six rushers, and TU Sep 16 extended the lead on vertical throws. Off corners shaded over the top keep a panic go ball in front of them. This changes shading only, not alignment, so the picture stays stock.',
        conf: 'ea',
      },
      {
        adj: 'zone-drop-curls',
        value: '10',
        why: 'Sets the curl-flat drop at ten yards, the depth where the return breaks back outside. The Sky safety sits on the landing spot rather than above it.',
        conf: 'read',
      },
      {
        adj: 'dl-poa',
        value: 'Inside',
        why: 'An inside charge is the shortest path to a gun QB. The whole mechanism is the rush beating the second break, and contain gets no free pressure since TU Sep 3.',
        conf: 'm27',
      },
      {
        adj: 'ind-blitz',
        target: 'SLOT',
        value: 'Blitz',
        why: 'Bowman (SPD 92) blitzes from his stock spot over the slot, so nothing about the picture changes before the snap. He is rusher five. His stock left curl-flat (civil.gg art) is left empty, and that flat is the price.',
        conf: 'm27',
      },
      {
        adj: 'ind-blitz',
        target: 'WILL',
        value: 'Blitz',
        why: 'Harris (SPD 89, PUR 84) comes from linebacker depth as rusher six. That makes six against six blockers at most: if the back releases, somebody is free.',
        conf: 'm27',
      },
      {
        adj: 'ind-zone',
        target: 'MIKE',
        value: 'Hook Curl',
        why: 'Pins Deablo (ZCV 78) in his stock hook: the civil.gg art has both backers in hooks, and this keeps the non-blitzing one there. He sits under the return\'s first cut. Against six, the QB\'s hot answer is that in-cut, and it gets thrown into a linebacker who never left.',
        conf: 'm27',
      },
    ],
    beats: [
      'Return Bench and Y Ohio Return from Gun Doubles Clamp Stack. They are called against the quarters picture and need the second break, and six rushers are built to arrive before it.',
      'Cheat Flat X Post from Gun Normal Y Off Close. The post needs a full drop and a hitch. If the cheat flat goes to the right, it lands on Watts coming down. If it goes left, it is the quick hot, and CLOUD answers it.',
      'The pre-decided read: the QB has read two-high and holds the ball through a double move against a blitz he never saw.',
    ],
    losesTo: [
      'Max protect: the back and TE stay in. Six rushers against seven blockers leaves nobody free, and the return has time. This is the first adjustment after a sack. Answer with COVER 4 PALMS from the same picture.',
      'The quick hot: a flat or slant into the side Bowman vacated, out before the second break. This is the second adjustment. Answer with COVER 3 CLOUD from the same picture.',
      'HB screen or draw behind the rush. Six are upfield and only Deablo and the Sky safety are underneath. This is the standard fire-zone price.',
      'The return thrown to Bowman\'s side. The left curl-flat is empty, so that return has to be beaten by the rush alone. If they keep going there, call COVER 3 CLOUD.',
    ],
    checkout: {
      playId: 'falcons-def-nickel-2--4-cover-4-palms',
      name: 'COVER 4 PALMS',
      when: 'After a SHOT CLOCK sack, when they show seven-man protection (TE attached plus the back set to his side), or they kept both in on the last one. Call it plain with no macro. The stock alignment is the same picture, so they still read quarters, and three receivers run into seven droppers.',
    },
    tells: [
      'Before the snap it matches COVER 4 QUARTERS, COVER 4 PALMS and COVER 3 CLOUD, because the civil.gg art shows an identical pre-snap alignment for all four (m27). The blitzers are set by the macro, not by alignment, so nothing walks up.',
      'The counter sequence: SHOT CLOCK until the back stays in, then PALMS. If the ball starts coming out to the vacated flat, go to CLOUD. When the back releases again, go back to SHOT CLOCK. They see the same picture all game.',
      'If Bowman creeps toward the line or the Sky safety cheats down before the snap, the picture is gone. Both are user habits, not the call, so do not user either of them pre-snap.',
      'Their own tell is the formation. Gun Doubles Clamp Stack and Gun Normal Y Off Close are where their return book lives.',
    ],
    call: 'Second and 7 or more, and third and 6 to 10, against Gun Doubles Clamp Stack or Gun Normal Y Off Close. Call it at most once per series, with two COVER 4 QUARTERS or CLOUD snaps for every SHOT CLOCK.',
    userObjectives: [
      {
        id: 'mof-deep-user',
        phase: 'snap',
        player: 'FS',
        note: 'Jessie Bates III: at the snap, open to the deep middle third and stay over the deepest inside route. The X post on Cheat Flat X Post is yours, so do not trigger on the return or the cheat flat.',
      },
      {
        id: 'bail-safety',
        phase: 'post',
        player: 'FS',
        note: 'Jessie Bates III: hold your depth after the throw. Only six rushed and two dropped underneath, so you are the last man. Break on a dig or post behind Deablo, and let Watts, the CPU safety, own the right curl-flat.',
      },
    ],
    sequence: [
      {
        if: 'Max protect: back and TE stay in to block',
        call: 'COVER 4 PALMS',
        playId: 'falcons-def-nickel-2--4-cover-4-palms',
      },
      {
        if: 'Quick hot to the vacated flat or a slant before six arrive',
        call: 'COVER 3 CLOUD',
        playId: 'falcons-def-nickel-2--4-cover-3-cloud',
      },
    ],
    practice: [
      {
        setup: '',
        verify: 'Rep 1, the count check. Practice mode, SHOT CLOCK against Y OHIO RETURN from Gun Doubles Clamp Stack (Cardinals book). Pause before the snap and confirm the picture matches COVER 4 QUARTERS: two level safeties and Bowman off the ball. After the snap, count six rushers (Dexter, Dorlus, Ebukam, Za\'Darius Smith, Bowman, Harris) and five droppers (three deep, the Sky safety in the curl-flat, Deablo in the hook), and confirm the down safety on the right is Watts. The art fixes the side, and madden.tools says it is the strong safety. If the count is not six, or Bates comes down instead, the package is false as written. Then call COVER 3 CLOUD and COVER 4 PALMS plain, pause each before the snap, and confirm the same two-level-safety picture with Bowman off the ball. The civil.gg art already shows it; this rep confirms the macro\'s Cover 4 shell step does not change it.',
      },
      {
        setup: '',
        verify: 'Rep 2, the clock. Same call, same offense, back released. Watch the Y: pass if a rusher reaches the QB before the return breaks back outside. If it is thrown, it should land on the Sky safety at ten. Repeat against RETURN BENCH. If the ball comes out cleanly on the second break in both, the timing claim is false.',
      },
      {
        setup: '',
        verify: 'Rep 3, the counters. Offense runs CHEAT FLAT X POST (Falcons book, Gun Normal Y Off Close) with the back and TE set to block: call COVER 4 PALMS plain and confirm the pre-snap picture did not change. Then run a quick slant-flat into Bowman\'s side: call COVER 3 CLOUD plain and confirm the right corner squats the cloud flat and Bowman holds the left curl-flat.',
      },
    ],
    conf: 'read',
    gauntlet: { passed: '2026-09-24', rounds: 5, art: 'civil.gg M27 diagrams' },
  },

  // ZERO LID — Falcons defensive package vs the post-TU Sep 16 shot game.
  // Shows Cover 0 press (both safeties walked down, both backers on the line),
  // plays Cover 2 Man: five trail defenders underneath, Bates and Watts bailing
  // to halves. The offense's pre-coded answer to a zero press look is the go
  // ball and the post with nobody deep; at the snap every vertical has a man
  // underneath it and a safety on top of it.
  //
  // Distinct from PALM READER (Cover 4 Palms, zone two-read, corners Over the
  // Top, single-high shell): this is MAN underneath with trail (Underneath)
  // leverage, a ZERO shell with phantom pressure, and the bracket comes from
  // the half safety over a trailing corner, not a quarters read.
  // Repeatability (G9): the macro rides over any Nickel 2-4 Wide call, so the
  // same walk-down fronts COVER 3 MATCH (vs rubs), DBL SAFETY BLITZ / SILVER
  // SHOOT PINCH (vs inside run) and COVER 1 ROBBER PRESS (vs scramble).
  // Play art: civil.gg M27 Falcons Nickel 2-4 Wide (https://www.civil.gg/playbooks/team/nfl/defense/falcons/nickel/2-4-wide) confirms
  // every twin's stock assignments (tagged m27). The macro-over-call shell and
  // depth stay read: art shows stock alignments, not what the macro does.
  // madden.tools (Nickel 2-4 Wide, Sep 2026): Cover 2 Man = five underneath in
  // press or trail man, two safeties splitting the field; rush count not listed
  // there; civil.gg art confirms four rush.
  {
    id: 'falcons-pkg-zero-lid',
    game: 'madden',
    side: 'defense',
    name: 'ZERO LID',
    tagline: 'Show zero press, they throw the go or the post with nobody deep. Play 2-Man: a trail corner under it, a half safety on top of it.',
    playbook: 'falcons-def',
    slot: 6,
    active: true,
    base: {
      playId: 'falcons-def-nickel-2--4-wide-cover-2-man',
      name: 'COVER 2 MAN',
      formation: 'Nickel 2-4 Wide',
      type: 'pass',
    },
    twins: [
      {
        playId: 'falcons-def-nickel-2--4-wide-dbl-safety-blitz',
        name: 'DBL SAFETY BLITZ',
        type: 'pass',
        role: 'The real zero, and the answer to the inside run. Stock art (civil.gg, m27): both safeties aligned walked down at 6-7 yards and blitzing, four DL plus two safeties is six rush, Cover 0 man behind. Its stock alignment IS the walk-down picture ZERO LID copies; under the macro both sit at nine, and here the safeties come and fill the box the picture promised. Call it once early so the lid is believable.',
      },
      {
        playId: 'falcons-def-nickel-2--4-wide-cover-3-match',
        name: 'COVER 3 MATCH',
        type: 'pass',
        role: 'The answer to bunch, stack and mesh. Under the same Cover 0 shell: art (civil.gg, m27): corners deep thirds, offense-left safety deep middle, offense-right safety down to the right curl-flat, slot to the left curl-flat, both backers hooks. Zone defenders pass the rubs off instead of chasing through them, three deep keep the lid. The down safety landing in the curl-flat means the walked-down macro picture costs it nothing. Also the checkout.',
      },
      {
        playId: 'falcons-def-nickel-2--4-wide-silver-shoot-pinch',
        name: 'SILVER SHOOT PINCH',
        type: 'pass',
        role: 'Second run answer on second and short. Art (civil.gg, m27): the line pinches and the slot plus one backer blitz, six rush, both safeties stay deep. The coverage behind it has no zone marks in the art, so what the other four play underneath is a read: expect man and test it before trusting it on a pass down.',
      },
      {
        playId: 'falcons-def-nickel-2--4-wide-cover-1-robber-press',
        name: 'COVER 1 ROBBER PRESS',
        type: 'pass',
        role: 'Vs a scrambling QB or a crosser-only offense. Art (civil.gg, m27): offense-left safety deep middle, offense-right safety robber at about ten, four rush, the rest man. The robber sits at roughly the depth the macro already shows; hold him as a spy by hand vs a runner.',
      },
    ],
    counters: [
      'm27-o-vertical',
      'm27-o-flood',
    ],
    user: 'FS Bates. Sit at nine yards next to Watts so the picture reads zero; do not creep further or the bail is late. At the snap open to the field half at 18 over the hash. Key #2: if he goes vertical inside, you own the post; if #1 goes, stay on top of the go and let Terrell trail it. Never trigger on anything under 12 yards: Bowman and the backers trail it.',
    userObjectives: [
      {
        id: 'bail-safety',
        phase: 'pre',
        player: 'FS',
        note: 'Bates walks down to nine beside Watts to sell Cover 0. Hold there through the QB\'s check; if he hot-routes a fade or a post, that is the answer the lid was built for, so do not move. Bail on the snap every time.',
      },
      {
        id: 'mof-deep-user',
        phase: 'post',
        player: 'FS',
        note: 'Bates in his half at 18: the post from #1 or #2 runs at your inside shoulder, the go runs to your outside. Drive only once the stem declares; the longer TU Sep 16 lead drops the ball in your landmark, over Terrell or Bowman trailing underneath.',
      },
    ],
    look: {
      shell: 0,
      rush: 6,
      press: true,
      picture: 'Cover 0 press: both safeties walked to nine yards, Deablo and Harris creeping the A gaps, every corner in press with no help showing. It copies the stock DBL SAFETY BLITZ alignment (civil.gg art: safeties walked down at 6-7 yards), so the offense has seen this exact picture turn into a real six-man zero. It is the look the offense has pre-coded its shot answer to: hot-route the outside receiver to a go and the slot to a post, because with zero deep and TU Sep 16\'s longer lead, one step of separation is a touchdown.',
    },
    truth: {
      shell: 2,
      rush: 4,
      deep: 2,
      coverage: 'Cover 2 Man (assignments confirmed in the civil.gg M27 art: both safeties deep halves, five under in man, four rush). Four linemen rush; Deablo and Harris peel off the fake blitz to man the back and the #3; Terrell, Hughes and Bowman trail their men from underneath; Bates and Watts bail from nine (stock alignment is about twelve) to deep halves. The pre-coded go and post now run into a bracket: a trail defender on the hip taking the low shoulder, a half safety on top taking the high one, and the extended lead carries the ball past the trailer and into the safety.',
    },
    sequence: [
      {
        if: 'Shot down: they hot-route the go or the post against the zero look.',
        call: 'ZERO LID',
        playId: 'falcons-def-nickel-2--4-wide-cover-2-man',
      },
      {
        if: 'They go bunch, stack or mesh to rub the man.',
        call: 'COVER 3 MATCH under the same shell. Zone passes the rub off; three deep keep the lid.',
        playId: 'falcons-def-nickel-2--4-wide-cover-3-match',
      },
      {
        if: 'They run inside zone at the bailing safeties.',
        call: 'DBL SAFETY BLITZ under the same shell. The safeties stay where they showed and come: six rush, Cover 0 behind.',
        playId: 'falcons-def-nickel-2--4-wide-dbl-safety-blitz',
      },
      {
        if: 'They run inside zone on second and short.',
        call: 'SILVER SHOOT PINCH under the same shell. Six rush with the line pinched (slot and a backer), both safeties stay deep; the coverage behind is a read.',
        playId: 'falcons-def-nickel-2--4-wide-silver-shoot-pinch',
      },
      {
        if: 'They scramble.',
        call: 'COVER 1 ROBBER PRESS, robber held as a spy by hand.',
        playId: 'falcons-def-nickel-2--4-wide-cover-1-robber-press',
      },
    ],
    lab: { shown: 'c0', played: 'c2man', formation: 'doubles', concept: 'verts' },
    adjustments: [
      {
        adj: 'coverage-shell',
        value: 'Cover 0',
        why: 'Stores the zero picture in the macro: both safeties down pre-snap, Cover 2 Man after it. TU Sep 16 fixed shells not being respected; whether Nickel 2-4 Wide offers the Cover 0 shell on this call is the first thing to confirm in practice.',
        conf: 'read',
      },
      {
        adj: 'safety-depth',
        value: '9',
        why: 'Nine yards reads as zero or a pressure look to the QB but leaves Bates and Watts a nine-yard bail to their half landmark, which beats a go ball that needs roughly 40 yards of air. Five would sell harder and arrive late. Stock Cover 2 Man starts them at about twelve and stock DBL SAFETY BLITZ at 6-7 (civil.gg art), so nine sits between the two real pictures; whether the macro depth holds on each call is still the practice check.',
        conf: 'read',
      },
      {
        adj: 'show-blitz',
        value: 'Linebackers',
        why: 'Walks Deablo and Harris up to the line so the picture shows six coming. Assignments do not change: they peel to the back and #3 in man. Six shown, four rushing.',
        conf: 'm27',
      },
      {
        adj: 'cov-align',
        value: 'Press',
        why: 'Press is what makes the zero picture believable and what the go ball is called against. Terrell is PRS 95, the best press number on the defense.',
        conf: 'ea',
      },
      {
        adj: 'cov-leverage',
        value: 'Underneath',
        why: 'Trail technique: the corner plays the receiver\'s low hip and gives up the top shoulder on purpose, because the half safety owns it. Whether Underneath shading counts as the wrong shade under the TU Sep 16 press penalty is untested; rep 1 checks it.',
        conf: 'read',
      },
      {
        adj: 'man-check-bunch',
        value: 'Point Triangle',
        why: 'EA lists Point Triangle as a Cover 2 Man-only bunch check: the point is locked and the other two switch, so a bunch release cannot rub the trail defenders off the vertical.',
        conf: 'ea',
      },
      {
        adj: 'ballhawk',
        value: 'Aggressive',
        why: 'The half safeties play the ball in the air instead of the tackle. On a go ball thrown into a bracket that is the difference between a breakup and a pick; the price is a missed tackle if they break it.',
        conf: 'm27',
      },
    ],
    beats: [
      'The go ball called against press with no safety: the trail corner is on the hip, the half safety is over the top, and the longer lead lands it on the safety.',
      'The post-vs-man hot route: from #1 it runs straight at the half safety\'s inside shoulder with a trail defender underneath it.',
      'PA Flood\'s sail and go: the corner route meets a trailing man plus a half safety, the flat meets a manned backer.',
      'Any pre-snap check to max protect with two releases against a zero look: seven in, two out, into five man defenders and two deep.',
    ],
    losesTo: [
      'Rubs and mesh from a tight stack or bunch. Man under gets picked; Point Triangle only fixes the bunch. Next snap: COVER 3 MATCH under the same shell.',
      'The QB scramble. Five trail defenders have their backs to him and four rush with no contain or spy; a mobile QB walks for eight.',
      'A #2 seam or post from 3x1 that splits the halves if Bates is late out of the walk-down. That is the user\'s rep, not the CPU\'s.',
      'Inside zone and duo once the safeties bail. The picture shows eight in the box and the snap leaves six. Next snap: DBL SAFETY BLITZ, where they stay.',
    ],
    checkout: {
      playId: 'falcons-def-nickel-2--4-wide-cover-3-match',
      name: 'COVER 3 MATCH',
      when: 'Gun Trips, Bunch or a tight stack: 3x1 or any release built to rub man. Match passes the rub off and still has three deep for the vertical.',
    },
    tells: [
      'Under the macro, identical to DBL SAFETY BLITZ pre-snap: same nine-yard safeties, same creeping backers. The stock blitz shows them at 6-7 (civil.gg art); the macro puts both calls at nine, so only the bail at the snap gives it away.',
      'Watch the QB\'s hot routes after the zero look: a fade on the outside receiver or a post on the slot is the pre-coded shot. You are already in the call that eats it; do not audible.',
      'The adjustment they make after losing the shot shows up in the formation before the snap: a bunch or tight stack means the rub is coming (COVER 3 MATCH), a back offset with 12 personnel or a TE in-line means inside zone at the bail (DBL SAFETY BLITZ). The picture does not change; only the ending does.',
      'Why it repeats: every ending shows the same nine-yard safeties and creeping backers, so each counter they call is a guess against five calls, and the one that beats the lid (rub, run) is a call they have to show you first.',
      'Macro-over-twin caveats: Point Triangle is Cover 2 Man-only and is ignored on the other calls; the Underneath shade on COVER 3 MATCH corners does not move their deep thirds.',
      'If the QB scrambles on the first rep, bench this against him; the price is structural, not a bad read.',
      'Pairs with GHOST ZERO: both show zero, GHOST ZERO drops a mug into the quick hot window, ZERO LID puts a lid on the shot. Their two answers to zero are now both wrong.',
    ],
    call: 'The macro sits at the line over any Nickel 2-4 Wide call, so the Cover 0 walk-down is one picture with five endings, picked from what their formation tells you. Shot down: ZERO LID. They answer with bunch, stack or mesh: COVER 3 MATCH under the same shell. They answer with inside zone or a heavy 11/12 set: DBL SAFETY BLITZ (or SILVER SHOOT PINCH on second and short). They scramble: COVER 1 ROBBER PRESS with a hand spy. Base down: second and 7 or longer and third and 6 to 12 against 2x2 or 3x1 open sets, after they have seen DBL SAFETY BLITZ once. The snap after any completed go ball or post is the best time: they will reach for it again.',
    practice: [
      {
        setup: 'Practice mode, offense set to Gun Doubles four verticals (or Go/Post hot routes on #1 and #2). Load ZERO LID, user Bates.',
        verify: 'Pre-snap: both safeties sit at nine and both backers show on the line (the Cover 0 shell is stored and respected). Post-snap: corners trail from the low hip, not over the top, and no press corner loses the release because of the Underneath shade. Pass: Shell reads zero pre-snap on three of three snaps and every go ball has a safety over it within 30 yards.',
      },
      {
        setup: 'Same call, offense on a single post from the slot with the outside receiver on a go. Throw the post on time with a normal lead, then with a bullet.',
        verify: 'The post runs at Bates\'s inside shoulder with Bowman trailing underneath, and the extended lead lands the ball on the safety, not behind him. Pass: Bates reaches the post window before the ball on the lob and the touch pass; the bullet is at worst contested.',
      },
      {
        setup: 'Keep ZERO LID applied at the line, then call COVER 3 MATCH vs Gun Bunch mesh, and DBL SAFETY BLITZ vs Gun Doubles inside zone.',
        verify: 'The macro carries over: both twins show the same nine-yard safeties and creeping backers as ZERO LID. Match passes the mesh off without a free crosser; the safeties on DBL SAFETY BLITZ fit the run inside instead of bailing. Pass: Screenshots of the three pre-snap pictures are indistinguishable, mesh is held under 6 yards, and inside zone is held under 4. If the shell drops on either twin, that twin leaves the sequence.',
      },
    ],
    conf: 'read',
    gauntlet: { passed: '2026-09-24', rounds: 3, art: 'civil.gg M27 diagrams' },
  },

  // WHIPSAW: Falcons offense vs sim / fire-zone pressure (m27-d-sim).
  // Built 2026-09-24, revision 4. One formation (Gun Y Off Trips Close), five calls, one macro.
  //
  // Sources and what each one actually shows (anything past them is tagged read):
  // - civil.gg, DB Fire 2 play art (M27)
  //   https://www.civil.gg/playbooks/madden/plays/dime/2-3-6-will/db-fire-2
  //   A Cover 2 fire zone. Both safeties play deep halves. BOTH corners take cloud
  //   flats, squatting at about 5 yards. Both inside linebackers drop to hook/curl
  //   zones shaded outside toward the numbers. Both slot/nickel DBs blitz off the
  //   edges, with three DL rushing: 5 rush, 4 under (2 flats + 2 hooks), 2 deep.
  //   Nobody is drawn in the middle between the hooks, under and between the halves.
  // - madden.tools, DB Fire 2 https://madden.tools/playbooks/formation/dime/2-3-6-will/db-fire-2
  //   Names "a seam route" and "the void between the blitzers and the deep
  //   safeties" as the weakness. Defensive read: "the underneath zone defenders
  //   are reading their initial release before sinking into their landmarks."
  // - civil.gg, Falcons Gun Y Off Trips Close art, TE WHIP (as read by the
  //   coordinator 2026-09-24; the page did not render for this builder)
  //   https://www.civil.gg/playbooks/team/nfl/offense/falcons/gun/y-off-trips-close
  //   Trips to the offense's right with the TE close.
  //     TE (red, primary): one step up, then flat outward to the trips sideline at about 2 yards.
  //     Inside trips receiver: quick out at about 5.
  //     Outside trips receiver: vertical to about 12, then a deep post breaking INSIDE into the middle.
  //     Single receiver on the left: deep post/over.
  //     HB: swing to the left flat.
  //   The art does not show who is in which slot. Pitts = TE is solid; Branch as
  //   the inside trips receiver (WR3) and London as the single receiver are read.
  // - madden.tools, Y Off Trips Close pages (Mtn Y PoCo, WR Screen, HB Mid Draw,
  //   X Curl): generated route text, no art read for these calls, tagged m27 for
  //   what they state and read for fit.
  // - The Madden Academy https://themaddenacademy.com/2026/08/mastering-the-san-francisco-db-fire-2-blitz-in-madden-27
  //   Offenses that untarget the slot blitzers get answered with linebacker blitzes.
  // - src/data/personnel-falcons.js off.slot: Branch is a vertical decoy/screen
  //   piece (SPD 95, AWR 51), not a short-route chain-mover.
  {
    id: 'falcons-pkg-whipsaw',
    game: 'madden',
    side: 'offense',
    name: 'WHIPSAW',
    tagline: 'DB Fire 2 is Cover 2 behind five rushers: cloud corners squat, hooks shade wide, and the middle is empty. Branch\'s Streak drives the trips-side half safety deep, and the stock post breaks into the void he left.',
    playbook: 'falcons-off',
    slot: 3,
    active: true,
    base: {
      playId: 'falcons-off-gun-y-off-trips-close-te-whip',
      name: 'TE WHIP',
      formation: 'Gun Y Off Trips Close',
      type: 'pass',
    },
    twins: [
      {
        playId: 'falcons-off-gun-y-off-trips-close-mtn-y-poco',
        name: 'MTN Y POCO',
        type: 'pass',
        role: 'The G9 answer once they squeeze the middle: the trips-side half sits on the post and a hook sinks under it. madden.tools text: "the Y (slot) runs the post corner breaking to the numbers", with the outside trips receivers clearing deep; tagged a Cover 2 beater. The post stem pulls the squeezed safety further inside, and the corner break goes outside to the sideline hole behind the squatting cloud corner (read). The macro still fits: the WR3 Streak is a clear-out.',
      },
      {
        playId: 'falcons-off-gun-y-off-trips-close-hb-mid-draw',
        name: 'HB MID DRAW',
        type: 'run',
        role: 'The run twin. In the DB Fire 2 art both hooks shade outside toward the numbers and five rush upfield, so the middle between the guards is empty. madden.tools text: the line "fans out like dropback protection" and Bijan hits "the natural crease between the guards". Keeps the hooks from sinking onto the post.',
      },
      {
        playId: 'falcons-off-gun-y-off-trips-close-hb-slip-screen',
        name: 'HB SLIP SCREEN',
        type: 'run',
        role: 'Five rushers, two of them DBs off the edges, run past Bijan, and both hooks are shaded wide. Do not fire the macro on this call: HB Pass Block cancels the slip.',
      },
      {
        playId: 'falcons-off-gun-y-off-trips-close-wr-screen',
        name: 'WR SCREEN',
        type: 'pass',
        role: 'The Cover 0 answer only. Against DB Fire 2 the trips-side cloud corner squats at 5 yards, right on the screen. madden.tools names Cover 0 and Cover 1 as its most vulnerable shells. Call it without the macro, because the WR3 hot would pull a blocker.',
      },
    ],
    counters: [
      'm27-d-sim',
    ],
    user: 'Stay on Tua. Pre-snap: two safeties deep, the slot DBs creeping toward the edges, the corners off at about 5. That is DB Fire 2. Check that the flames are off the Mike and the Will. After the snap, read the trips-side half safety, and nobody else. He carries Branch\'s Streak deep: throw the outside receiver\'s post as it breaks into the middle underneath him. He sits on the post: Branch is alone over the top up the hash. Both are covered (a hook sinks under the post): Pitts\'s whip is the checkdown in the flat. Never throw the slant or a 5-yard out: the hooks and the cloud corner sit there. The macro changes two stock routes, and both changes are deliberate:\n- Branch\'s 5-yard quick out becomes the Streak. That is his documented job, a straight line at 95 speed, and here it moves the safety.\n- Bijan\'s left swing becomes a block.\nThe post is a stock route on WR1/WR2, so the macro never touches it. If you sub Olamide Zaccheaus in at WR3 by hand, the macro follows the depth slot and gives him the Streak.',
    userObjectives: [
      {
        id: 'pass-pro-pickup',
        phase: 'pre',
        player: 'HB',
        note: 'Bijan Robinson stays in: the programmed Pass Block replaces his stock left swing. DB Fire 2 sends both slot DBs off the edges. With the Mike and Will untargeted, the line takes the three DL and one edge blitzer, and Bijan takes the other: six on five, enough time for a post at 12 to 15 yards. If a slot walks down late, flick the slide toward him by hand; the macro stores no direction.',
      },
      {
        id: 'user-catch-timed',
        phase: 'post',
        player: 'WR2',
        note: 'The outside trips receiver on the post (Jahan Dotson at WR2 is read; on a flipped call it is whoever lines up outside in trips). Switch to him as the ball arrives in the void under the half safety and release in the green window. Dotson\'s 83 catching means a normal window, not a forgiving one, so be on time.',
      },
      {
        id: 'qb-scramble-user',
        phase: 'post',
        player: 'QB',
        note: 'Tua Tagovailoa reads only the trips-side half safety. He carries Branch: throw the post. He sits on the post: throw Branch. A hook sinks under the post too: throw Pitts on the whip. If all three are covered, it is still six blockers on five: climb, then slide at the sticks.',
      },
    ],
    look: {
      picture: 'Gun Y Off Trips Close (civil.gg art: trips to the offense\'s right, TE close), with Pitts as the close TE and a single receiver backside. The sim looks like a two-high coverage shell with two slot DBs creeping. It is built for the answer every offense has pre-coded against slot pressure: a quick throw to the man the fired slot left, whether a slant, stick or quick out. The civil.gg DB Fire 2 art is ready for exactly that. Both inside backers drop to hooks shaded toward the numbers and both corners squat cloud flats at about 5, so every quick window has a dropper in it. The pre-decided hot is thrown into a zone defender.',
    },
    truth: {
      blockers: 5,
      releases: 5,
      concept: 'A vertical that moves the half safety, and a post into the void he leaves. In the civil.gg DB Fire 2 art, the four underneath defenders are two cloud corners squatting the flats at about 5 and two hooks shaded outside toward the numbers. Nobody is drawn in the middle, under and between the two deep halves, the "void between the blitzers and the deep safeties" madden.tools names. Three trips-side routes (from the civil.gg TE WHIP art; who runs each is read):\n- Branch (WR3, macro hot Streak) replaces the stock 5-yard out and runs straight up the hash at 95 speed. He is the #2 vertical in the trips-side half, and the shaded hook is not carrying him, so that half safety has to open and carry him deep or give up the ball over his head.\n- The outside trips receiver runs his stock route: vertical to about 12, then the post. The post breaks inside under the retreating safety into the middle the safety just left. That post is the throw.\n- Pitts\'s whip (one step, then flat at 2 yards) pulls the cloud corner down so he cannot sink under the post, and it is the checkdown.\nIf the safety refuses Branch and sits on the post, Branch is alone over the top. One defender, two answers.\nTiming and leverage (read, checked in practice rep 1): both release at the snap, but Branch runs a straight line at 95 speed from the inside alignment. The post only breaks inside at about 12 from the numbers, so it reaches Branch\'s line on the hash around 15 to 17 yards, by which time Branch is 3 to 5 yards past it. The post crosses under him and in front of the safety, not into him.\nThe backside half is held by the single receiver\'s deep post/over. That route also angles to the middle, so it can squeeze the window (read, checked in rep 1).\nBijan stays in: three DL plus two edge DBs is five against five linemen plus Bijan. The untargeted Mike and Will mean no lineman blocks a backer who drops.',
    },
    adjustments: [
      {
        adj: 'protect',
        value: 'Base',
        why: 'Base, not a slide. DB Fire 2 fires a DB off both edges, so no slide direction is right. A slide is stored with a direction, and a flipped call would send it the wrong way. Bijan in Base takes whichever edge DB is left free.',
        conf: 'm27',
      },
      {
        adj: 'untarget',
        value: 'MIKE',
        why: 'The civil.gg DB Fire 2 art has the Mike dropping to a hook/curl zone shaded outside. Untargeting him keeps the center and guards on the three DL, not on a backer who bails.',
        conf: 'm27',
      },
      {
        adj: 'untarget',
        value: 'WILL',
        why: 'The other inside backer drops to the opposite hook in the same art. Untargeting both frees the line to take three DL and one edge DB, with Bijan on the second. Whether the macro stores two untarget rows is read.',
        conf: 'm27',
      },
      {
        adj: 'ind-block',
        target: 'HB',
        value: 'Pass Block',
        why: 'A programmed step that overrides the stock left-flat swing in the civil.gg art. Five rush (three DL plus both slot DBs), so Bijan makes it six on five. The post breaks at 12 and needs the extra count. The cost is the backside checkdown.',
        conf: 'm27',
      },
      {
        adj: 'hot-route',
        target: 'WR3',
        value: 'Streak',
        why: 'The macro-safe hot that makes the post work. It replaces the inside trips receiver\'s stock 5-yard out, which ran straight into the squatting cloud corner, with a straight vertical up the hash. The trips-side half safety has to carry it, and that opens the middle for the stock post. It is Branch\'s documented job, occupying a safety with pure speed and no option read. Bound to WR3, not WR1/WR2, so a flipped call keeps it on the slot and the post stays stock.',
        conf: 'm27',
      },
    ],
    beats: [
      'DB Fire 2: with two cloud flats, two hooks shaded wide and two deep halves, the middle is the one area nobody is drawn in. Branch drives the trips-side half deep, and the post breaks into the space he left.',
      'A half safety who guesses: he carries Branch and the post is open under him, he sits on the post and Branch is open over him. One read, one defender.',
      'The pre-decided hot throw the sim exists to pick off: the macro removes the 5-yard out and the slant, the two throws the hooks and cloud corner are sitting on.',
      'Will Go Fire 3 and other two-high fire zones with hooks shaded wide: the same vertical-and-post stretch (read for Will Go Fire 3, whose art was not checked).',
    ],
    losesTo: [
      'A squeezed middle: the trips-side half sits at 12 to 15 on the post and a hook sinks under it. Branch is still over the top, and if that is also taken, go to MTN Y POCO, whose corner route goes outside to the sideline hole behind the cloud corner.',
      'Cover 3 fire (the middle closed by a single-high safety): the post runs into the post safety. Check to X CURL.',
      'A true Cover 0 send of six or seven: a post at 12 takes too long against seven. Check to WR SCREEN from the same look, or throw the whip off the one step.',
      'A backer who comes instead of dropping. The Madden Academy says offenses that untarget the slot blitzers get answered with linebacker blitzes; the same answer to an untargeted Mike or Will is read. Only Bijan can pick him up. If it happens twice, remove the untarget rows by hand.',
    ],
    sequence: [
      {
        if: 'Base look: two deep, slot DBs creeping, corners off at about 5. Call TE WHIP with the macro and read the trips-side half safety: he carries Branch, throw the post; he sits on the post, throw Branch; a hook sinks too, throw the whip.',
        call: 'TE WHIP',
        playId: 'falcons-off-gun-y-off-trips-close-te-whip',
      },
      {
        if: 'After the post hits, a good caller squeezes the middle: the trips-side half plays the post and a hook sinks under it. Tell: the trips-side safety creeps inside to 12 to 14 and a backer walks toward the middle. Call MTN Y POCO with the macro applied. The post stem pulls the squeezed defenders further inside, and the corner break goes outside to the sideline hole behind the squatting cloud corner (madden.tools text tags it a Cover 2 beater; the landing spot is read).',
        call: 'MTN Y POCO',
        playId: 'falcons-off-gun-y-off-trips-close-mtn-y-poco',
      },
      {
        if: 'Or he rotates to a single-high fire (Cover 3 behind the same pressure). Tell: one safety walks to the middle pre-snap. The post and the seam are dead; check to X CURL, whose curl-flat on the trips side stresses the single flat defender (madden.tools text; fit read).',
        call: 'X CURL',
        playId: 'falcons-off-gun-y-off-trips-close-x-curl',
      },
      {
        if: 'Or he stops sim-ing and sends a true Cover 0 from the same dime look. Tell: both safeties at 8 yards or closer and the corners pressed. Check to WR SCREEN without the macro; madden.tools names Cover 0 as its most vulnerable shell, and with no cloud corner squatting, the perimeter is empty (read).',
        call: 'WR SCREEN',
        playId: 'falcons-off-gun-y-off-trips-close-wr-screen',
      },
    ],
    checkout: {
      playId: 'falcons-off-gun-y-off-trips-close-x-curl',
      name: 'X CURL',
      when: 'One safety rotates to the middle pre-snap (a Cover 3 fire behind the same pressure look): the middle is closed, so take the curl-flat on the trips side and the backside X on the seam (madden.tools text; London as that X is read).',
    },
    tells: [
      'Two safeties deep, corners off at about 5, slot DBs creeping toward the edges: that is DB Fire 2. Throw the post, not the slant.',
      'Both backers backpedal wide at the snap: those are the shaded hooks. They open the middle; they are not in it.',
      'The trips-side half safety is the only read. Turns and runs with Branch means the post; stays flat-footed at 12 to 15 means Branch over the top.',
      'The trips-side safety creeping inside with a backer walking to the middle means they have adjusted to the post. Call MTN Y POCO.',
      'Five calls from one trips picture, two of them runs: the hooks cannot sink onto the post without opening the draw.',
    ],
    call: 'Second and 5 to 10 and third and medium or long against a two-high pressure look. Snap on the walk-down. After one post completion, expect the middle to squeeze and call MTN Y POCO.',
    practice: [
      {
        setup: 'DB Fire 2 (Dime 2-3-6 Will; Buccaneers, Giants, Jets, Raiders, Ravens or Steelers defensive book) · Call TE WHIP, fire the macro and do not throw for three reps: watch the replay. Check that WR3 is the inside trips receiver and runs the Streak up the hash. Check that the outside trips receiver\'s post crosses UNDER Branch (Branch is deeper when the post reaches the hash). Check whether the trips-side half carries Branch, and whether the backside post/over drags the backside safety into the middle. Then throw five.',
        verify: 'Pass: The post never collides with Branch. The half safety carries Branch on at least 3 of 5 reps, and the post or Branch is open on 4 of 5. Both backers drop (so the untargets are safe). No sacks. If the post crosses into Branch or the backside safety closes the middle every rep, the read is wrong: make Branch the only deep throw and the whip the checkdown.',
      },
      {
        setup: 'Will Go Fire 3 (set it from any defensive book that carries it; search the name in practice) · Same call and macro. Record the shell (two-high or single-high) and where each dropper lands.',
        verify: 'Pass: If it is two-high, the post or Branch is open on 4 of 5 reps. If it is single-high, the middle is closed: confirm X CURL is the answer by running it on the next rep.',
      },
      {
        setup: 'DB Fire 2 again, with a second pad putting the trips-side safety on the post at 12 to 14 and a hook sinking under it · First rep: TE WHIP, throw Branch over the top. Then call MTN Y POCO with the macro applied.',
        verify: 'Pass: Branch is open over the squeezed safety, and the POCO corner route breaks outside the squeeze and over the cloud corner. If neither is open, X CURL is the answer.',
      },
    ],
    conf: 'read',
    gauntlet: { passed: '2026-09-24', rounds: 6, art: 'civil.gg M27 diagrams' },
  },

  // SWITCHBOARD — offensive pass package vs m27-d-match (Cover 3 Match /
  // Quarters / Palms). Built 2026-09-24 against the post TU Sep 16 meta.
  // Revision 2: route art reconciled against the M27 Falcons book diagrams on
  // civil.gg (https://www.civil.gg/playbooks/team/nfl/offense/falcons/gun/bunch-offset),
  // so the art claims below are now m27. No hot routes are in the mechanism.
  //
  // Route art (M27, civil.gg; bunch on the offense's right):
  //   SPEED DIG   #1 (outside, red primary) stems outside-vertical to ~15, then
  //               breaks back inside on a deep dig at ~16. #2 (point) goes
  //               vertical ~8, then angles over into a deep crosser at ~15-16
  //               heading left. #3 (innermost) runs a short out to the right
  //               flat. The back swings to the left flat. The single receiver on
  //               the left runs a deep corner / post-corner.
  //   PA CHEAT SWITCH DIG  after the fake, the TE / inside man runs the dig at
  //               ~12 across, a second in-breaker sits shallower at ~7, the back
  //               leaks to the right flat, and two verticals run on the left
  //               (one a wheel from the far side).
  //   CHOICE SHALLOW DIG  a ~3-yard shallow crossing left to right under the
  //               bunch, a dig at ~12 from the left, an option route at ~6 from
  //               the bunch, a deep go from the bunch, the back swinging wide
  //               left.
  //   SPACING SWITCH  not in the civil.gg read. The M26 madden.tools art (quick
  //               spacing: short sit and short corner in the bunch, a deeper out,
  //               the back to the flat) stays read.
  // The art does not name who stands at #1/#2/#3 (Dotson, Branch, Pitts). That
  // stays read, and rep 1 is the numbering check.
  //
  // The mechanism: match gives #1 to the corner and #2 to the apex while both
  // run vertical. SPEED DIG bends both of them inside at 15-16, about a
  // yard apart, in the same beat, so each defender has to pass his man to the same
  // middle-of-field safety at the same moment. One safety cannot take two
  // pass-offs: whichever in-breaker he takes, the other one is open. #3 going
  // out to the flat drags the hook away from the underneath help.
  {
    id: 'falcons-pkg-switchboard',
    game: 'madden',
    side: 'offense',
    name: 'SWITCHBOARD',
    tagline: 'Match hands a vertical that breaks inside to the middle safety. Break #1 and #2 inside in the same beat and he gets two pass-offs at once: the dig or the over is open.',
    playbook: 'falcons-off',
    slot: 4,
    active: true,
    base: {
      playId: 'falcons-off-gun-bunch-offset-speed-dig',
      name: 'SPEED DIG',
      formation: 'Gun Bunch Offset',
      type: 'pass',
    },
    twins: [
      {
        playId: 'falcons-off-gun-bunch-offset-pa-cheat-switch-dig',
        name: 'PA CHEAT SWITCH DIG',
        type: 'pass',
        role: 'The answer to the bunch check. The cheat motion sends a bunch receiver across, so an in/out check has to re-declare. The fake holds the hook, then the TE / inside man\'s dig at ~12 goes over the in-breaker at ~7.',
      },
      {
        playId: 'falcons-off-gun-bunch-offset-spacing-switch',
        name: 'SPACING SWITCH',
        type: 'pass',
        role: 'The answer to a bail. If the corner and apex sink under the in-breakers, the flat, the short corner and the sit are empty. The ball is out on rhythm.',
      },
      {
        playId: 'falcons-off-gun-bunch-offset-inside-zone-split',
        name: 'INSIDE ZONE SPLIT',
        type: 'run',
        role: 'Keeps the hook honest and sells the PA twin. Match plays two-high over a six-man box.',
      },
    ],
    counters: [
      'm27-d-match',
    ],
    user: 'QB Tua Tagovailoa. Your eyes go to the middle safety, not to a receiver. When #2 bends across at 15, the safety either drives on him or sits: if he drives, throw the dig (#1) a yard behind him; if he sits on the dig, throw the over. If neither is clean, the back is swinging to the left flat and #3 is in the right flat. It is a defined two-man read on rhythm, the kind of throw Tua is rated for.',
    userObjectives: [
      {
        id: 'pass-pro-pickup',
        phase: 'snap',
        player: 'HB',
        note: 'Bijan Robinson checks for a fifth rusher before he swings to the left flat. Match rushes four, so most snaps he releases; if a mug or a sim comes, he picks it up and the two in-breakers still get their time.',
      },
      {
        id: 'user-catch-timed',
        phase: 'post',
        player: 'WR3',
        note: 'Take whichever bunch receiver rep 1 shows on the dig (Zachariah Branch if WR3 is the outside man, otherwise Jahan Dotson) and time the catch into a covered window: the corner is trailing him from outside leverage.',
      },
    ],
    look: {
      picture: 'Gun Bunch Offset: three receivers bunched (#1 outside, #2 point, #3 inside), London alone on the backside, the back offset. Match numbers the bunch before the snap: the corner has #1 vertical, the apex has #2 vertical, the hook has #3. SPEED DIG bends #1 and #2 inside at 15 to 16 yards, a yard apart, at the same moment, so both of them get passed to one middle safety at once. Whichever he takes, the other in-breaker is open. The same picture as PA CHEAT SWITCH DIG, SPACING SWITCH and the split-zone run.',
    },
    truth: {
      blockers: 5,
      releases: 5,
      concept: 'Double pass-off to one safety. Cover 3 Match has the corner carry #1 vertical and the apex carry #2 vertical, each handing his man to the middle safety when he breaks inside. SPEED DIG (M27 art, civil.gg) runs #2 vertical to 8 and then across at 15-16, and #1 on an outside-vertical stem to 15 breaking back in at ~16, while #3 runs a short out to the flat and pulls the hook with him. The middle safety gets both pass-offs in the same beat: drive on the over and the dig is open behind him, sit on the dig and the over is open in front. Quarters / Palms vs the bunch: the safety over the bunch carries #2 vertical, so when #2 bends across he takes that safety out of the dig window, and the corner is trailing the dig from the outside leverage #1\'s stem gave him. Five linemen block, the back checks for a blitzer and then swings to the backside flat, and every route is stock: nothing depends on a hot route.',
    },
    lab: { shown: 'c3sky', played: 'c3match', formation: 'bunch', concept: 'dagger' },
    adjustments: [
      {
        adj: 'block-style',
        value: 'Balanced',
        why: 'Both in-breakers break at 15 to 16 yards, so the line has to hold a full drop, and Aggressive draws holding since TU Sep 3. Option names are unconfirmed.',
        conf: 'read',
      },
      {
        adj: 'protect',
        value: 'Base',
        why: 'Keeps the back on his blitz check before his swing so a fifth rusher never gets a free run at a long drop. It does not touch any route, so the art stays as drawn and the macro survives a flipped call.',
        conf: 'm27',
      },
    ],
    beats: [
      'Cover 3 Match: the corner and the apex each pass an in-breaker to the same middle safety in the same beat. He takes one; throw the other.',
      'Quarters / Palms vs the bunch: the bunch-side safety carries #2 across, which vacates the dig window, and the corner trails the dig from outside leverage.',
      'Any match call whose hook runs with #3 to the flat: nobody is under the dig.',
    ],
    losesTo: [
      'A bunch check that plays in/out instead of reading releases (Box Check or a banjo): the inside defender takes the first in-breaker and the deep one plays the second. Go to PA CHEAT SWITCH DIG, where the motion breaks up the bunch the check is built on.',
      'Man across the board (Cover 1 or 2 Man): man defenders trail both in-breakers with no pass-off to be late on. Check to CHOICE SHALLOW DIG and throw the shallow under the bunch traffic.',
      'A bail: the corner and the apex sink under the in-breakers at 15 (Cover 3 Drop / Sky). The deep windows close and the flat opens. Throw SPACING SWITCH.',
    ],
    checkout: {
      playId: 'falcons-off-gun-bunch-offset-choice-shallow-dig',
      name: 'CHOICE SHALLOW DIG',
      when: 'The corner presses the outside bunch man and a defender walks out over the point with his eyes on him, not the QB: that is man, so there is nothing to pass off. Throw the shallow: it crosses left to right at ~3 under the bunch traffic, which rubs off a trailing man defender.',
    },
    tells: [
      'Watch the middle safety on the first SPEED DIG. If he drives on the over, the dig was open behind him; if he sits, the over was open. That is the read every snap.',
      'Two defenders standing level over the bunch before the snap means a bunch in/out check, not match. That is the adjustment the caller makes after losing once.',
      'Corners and the apex opening to the sideline at the snap and sinking to 15 means a bail. The flat is empty.',
      'Four calls from one bunch, one of them a run. The macro only sets protection and blocking style, so it rides every twin and a flipped call unchanged.',
    ],
    call: 'First and ten and second and 4 to 9 against any match shell. The sequence: (1) SPEED DIG until the match caller loses one. (2) He adjusts. If he goes to a bunch check (two level over the bunch), run PA CHEAT SWITCH DIG from the same bunch: the motion pulls a bunch man across, the check has to re-declare, and the TE / inside man\'s dig at ~12 goes over the ~7 in-breaker. If he goes man (press on the outside bunch man), CHOICE SHALLOW DIG and throw the shallow under the bunch traffic. If he bails (corners and apex sinking), SPACING SWITCH and throw the flat. (3) Back to SPEED DIG once he returns to match. The macro stays on for every step.',
    routeArt: {
      conf: 'm27',
      source: 'civil.gg M27 Falcons offense, Gun Bunch Offset https://www.civil.gg/playbooks/team/nfl/offense/falcons/gun/bunch-offset',
      confirms: [
        'SPEED DIG',
        'PA CHEAT SWITCH DIG',
        'CHOICE SHALLOW DIG',
      ],
      stillRead: [
        'SPACING SWITCH route art (M26 madden.tools)',
        'which named Falcon is #1 / #2 / #3 in the bunch',
      ],
    },
    sequence: [
      {
        if: 'Bunch check: two defenders stand level over the bunch (in/out, Box Check or banjo).',
        call: 'PA CHEAT SWITCH DIG',
        playId: 'falcons-off-gun-bunch-offset-pa-cheat-switch-dig',
      },
      {
        if: 'Man: the corner presses the outside bunch man and a defender walks out over the point.',
        call: 'CHOICE SHALLOW DIG',
        playId: 'falcons-off-gun-bunch-offset-choice-shallow-dig',
      },
      {
        if: 'Bail: the corners and the apex open to the sideline and sink to 15.',
        call: 'SPACING SWITCH',
        playId: 'falcons-off-gun-bunch-offset-spacing-switch',
      },
    ],
    practice: [
      {
        setup: 'Practice mode, Falcons defense: Nickel 2-4 COVER 3 MATCH. Run SPEED DIG with the macro on.',
        verify: 'Numbering check first. Pause at the snap and name #1, #2 and #3 in the bunch (Dotson, Branch or Pitts) and who runs the dig, the over and the short out. The routes are confirmed on the M27 civil.gg art; this rep confirms the names. Then watch the middle safety at 15: does he take one in-breaker and leave the other?',
      },
      {
        setup: '3-3-5 Penny COVER 4 QUARTERS, then COVER 4 PALMS, same call.',
        verify: 'Does the bunch-side safety carry #2 across and leave the dig window? Does the corner trail the dig from outside leverage? Throw the dig and check whether the catch window is green.',
      },
      {
        setup: 'Play the counter-adjustments: 3-3-5 Penny COVER 1 ROBBER (man), then any bunch or in/out check the defensive book offers, then a Cover 3 Drop or Sky.',
        verify: 'Man: is CHOICE SHALLOW DIG\'s shallow clean under the bunch traffic? Bunch check: does the PA CHEAT SWITCH DIG motion make it re-declare, and is the TE / inside man\'s dig open over the ~7 in-breaker? Bail: is the flat on SPACING SWITCH open on rhythm?',
      },
    ],
    conf: 'read',
    gauntlet: { passed: '2026-09-24', rounds: 3, art: 'civil.gg M27 diagrams' },
  },

  // VACANCY — offense package vs the A-gap hover (m27-d-hover).
  // metas.js lists the stock counter: "ID the man in the A gap and keep the
  // back in". ZERO TAX already runs that and blocks the hover. VACANCY does the
  // opposite on purpose. It leaves the hover as the one free rusher, blocks
  // everyone he was hiding, and wins both branches of his choice:
  //   forward (rushes)  -> Pitts (TE hot In) at 8-10 over the ball, the spot the hover left
  //   back (bails)      -> Branch (WR3 hot Drag) at 2 yards, underneath his backpedal
  // Built 2026-09-24 against the post TU Sep 16 meta.
  // Stock DOUBLE SLANTS (Civil.GG M27 play art, CIVIL_ART): 2x2, HB offset to the
  // offense's left. Left outside receiver (primary) quick slant inside at ~6-8.
  // Left slot stems ~5 then overs to the middle at ~10. HB to the left flat.
  // Right slot out/flat at ~3. Right outside receiver stems ~5 then slants inside.
  // VACANCY hot-routes BOTH slots (TE In, WR3 Drag), so the pattern does not
  // depend on which slot Pitts or Branch stands in. That alignment is still a
  // read: "Wk" suggests Pitts right, Branch left.
  {
    id: 'falcons-pkg-vacancy',
    game: 'madden',
    side: 'offense',
    name: 'VACANCY',
    tagline: 'The hover is built to pull your protection onto him so the walked-up Will comes free. Leave the hover unblocked, block the Will, and read his first step. Forward means Pitts on the In at 8 to 10 through the spot he left. Back means Branch on the drag underneath his bail.',
    playbook: 'falcons-off',
    slot: 5,
    active: true,
    base: {
      playId: 'falcons-off-gun-spread-y-slot-wk-double-slants',
      name: 'DOUBLE SLANTS',
      formation: 'Gun Spread Y Slot Wk',
      type: 'pass',
    },
    twins: [
      {
        playId: 'falcons-off-gun-spread-y-slot-wk-rpo-peek-slant',
        name: 'RPO PEEK SLANT',
        type: 'pass',
        role: 'Same look with a run tag, for when he adjusts by staying square in the A gap and reading the QB. If he and the linebackers hold the box, throw it. If they widen, give it to Bijan.',
      },
      {
        playId: 'falcons-off-gun-spread-y-slot-wk-hb-mid-draw',
        name: 'HB MID DRAW',
        type: 'run',
        role: 'For when the hover has been taken away (he backs out to the hook pre-snap) but the CPU linebackers keep showing blitz and rushing upfield. The draw goes under that charge. Do not call it while he is still sitting in the A gap. The macro leaves him unblocked, and the draw path runs through him.',
      },
      {
        playId: 'falcons-off-gun-spread-y-slot-wk-inside-cross',
        name: 'INSIDE CROSS',
        type: 'pass',
        role: 'For when a robber sits at 8 to 10 on the Pitts In. The crosser runs underneath the robber through the middle the hover left.',
      },
      {
        playId: 'falcons-off-gun-spread-y-slot-wk-hb-slip-screen',
        name: 'HB SLIP SCREEN',
        type: 'run',
        role: 'For when he adjusts by mugging both A gaps and sending six. Every rusher runs past Bijan, and the screen goes behind all of them.',
      },
    ],
    counters: [
      'm27-d-hover',
    ],
    user: 'QB Tua Tagovailoa. Before the snap: R2/RT + right stick up and confirm the flame is on the hovering Mike and the M icon is on the Will. If the hover is a different player, flick the flame onto him by hand. Then one hard count. At the snap, the only key is the hover\'s first step. Forward means throw the Pitts In on his break into the 8 to 10 yard spot over the ball the hover just left, leading him away from the safety. Back means throw the Branch drag at 2 yards underneath him. Ignore the outside slants: they go on rhythm and do not answer the hover. No second read, and never hold it: he is unblocked on purpose.',
    userObjectives: [
      {
        id: 'pass-pro-pickup',
        phase: 'pre',
        player: 'HB',
        note: 'Bijan Robinson: the M icon is on the Will who is showing blitz, the man the hover was built to free. Bijan blocks him first. If the Will drops, Bijan leaks to the flat, the outlet under a hover who bailed.',
      },
      {
        id: 'user-possession-catch',
        phase: 'post',
        player: 'TE',
        note: 'Kyle Pitts Sr. (CIT 81, SPC 87): the FORWARD branch and the contested window. The In breaks across at 8 to 10 over the ball, between the hook the hover emptied and a free safety closing from depth. Possession catch through the hit to move the chains. That is exactly the traffic catch his CIT and SPC are for.',
      },
      {
        id: 'user-rac-catch',
        phase: 'post',
        player: 'WR3',
        note: 'Zachariah Branch (R) (SPD 95, ACC 95): the BACK branch and the space job. The drag at 2 yards runs under a hover who is backpedaling toward the In. Nobody is within a step, so RAC catch in stride and outrun the pursuit. It is a defined, uncontested throw, which keeps his 51 AWR and 76 CIT out of traffic, as personnel-falcons.js asks.',
      },
    ],
    look: {
      picture: 'Gun Spread Y Slot Wk: 2x2 with Bijan offset to the offense\'s left (Civil.GG play art), Pitts and Branch in the slots. Their built-in answer is a user hovering an A-gap mug with the linebackers walked up. It is meant to drag your ID and slide onto the hover so the Will comes clean. The same picture also runs an RPO, a crosser, a draw and a screen, so it tells him nothing.',
    },
    truth: {
      blockers: 5,
      releases: 5,
      concept: 'This is deliberately the inverse of the stock counter (ID the A-gap man and keep the back in, which is ZERO TAX). The Mike, as the hovering user, is untargeted, so he is the one free man. The Will is ID-d, and Bijan blocks him before releasing. Protection math: the hover meta shows six and brings five, the user plus four CPU rushers. Five linemen plus Bijan is six blockers for those four, so every CPU rusher is picked up and only the user is free. FORWARD, depth: a centered hover whose first step goes forward is heading from 1 yard toward the QB, away from 8 to 10, so the only defender coded to that depth is now behind the line of scrimmage. FORWARD, lateral: Pitts\'s In (hot, replacing his stock slot route) breaks flat across the middle, through the exact spot over the ball the hover aligned on, 2 yards above where the stock outside slants break at 6 to 8. Timing: it is thrown on his break at about 1.1 to 1.2 s, against a hover who needs about 1.3 s to cover about 6 yards through an unblocked gap (read: both times are estimates; practice rep 1 times them). The In\'s depth and both times are reads, and the margin is thin, which is why there is no second read. BACK, depth: to take away the In he has to backpedal about 8 yards from the line, so a drag at 2 yards is under him the whole way. BACK, lateral: Branch\'s drag (hot, replacing his stock slot route) crosses the same spot over the center in the opposite direction to the In, under his feet while his hips face upfield, and Bijan leaks to the left flat if the Will dropped. The stock outside slants run on rhythm off the numbers whatever the hover does, so they are not part of the key.',
    },
    adjustments: [
      {
        adj: 'protect',
        value: 'Base',
        why: 'Base, not a slide. Per Civil M27 (paraphrase), a slide moves the flame by itself: the flame icon moves to the opposite side, and the man there comes free. You lose control of who is free. Base keeps the line on rules so the untarget and the ID put the free man exactly where you chose. Civil.GG https://www.civil.gg/tips/madden-27-pass-protection-basics',
        conf: 'm27',
      },
      {
        adj: 'untarget',
        value: 'MIKE',
        why: 'Takes the flame off the hovering user so the line stops spending a blocker on a man who may drop. The strategy is Civil M27: "Un-target the user first. Make HIM the hot man." (https://www.civil.gg/tips/madden-27-pass-protection-basics). Untarget binds to the player, not the gap, so it still holds if he shifts to the B gap. Assumes the hover is the Mike.',
        conf: 'm27',
      },
      {
        adj: 'id-mike',
        value: 'WILL',
        why: 'Moves the M icon onto the Will who is showing blitz, the rusher the hover exists to free. In Base the back owns the ID-d man. Point it at the Will and the hover trick has nobody left to free. The M icon mechanic is from EA and MUT.GG. Pointing it at the show-blitz backer is the Civil-style use.',
        conf: 'm27',
      },
      {
        adj: 'ind-block',
        target: 'HB',
        value: 'Block and Release',
        why: 'Bijan blocks the ID-d Will first and leaks to the flat if the Will drops. That is six blockers on the first beat with all five receivers still in the pattern. ZERO TAX instead keeps him in on a Pass Block.',
        conf: 'm27',
      },
      {
        adj: 'hot-route',
        target: 'TE',
        value: 'In',
        why: 'The FORWARD answer. Pitts breaks flat across the middle at 8 to 10 over the ball, the depth and spot the hover vacates, with a CIT 81 / SPC 87 body for the contested window. In is on the TE and slot menus (818 Madden), and TE is flip-safe in a macro. It replaces his stock slot route in the Civil.GG art (https://www.civil.gg/playbooks/team/nfl/offense/falcons/gun/spread-y-slot-wk), whichever slot that is. Read: the M27 In break depth is not confirmed as 8 to 10. Check it in rep 1.',
        conf: 'read',
      },
      {
        adj: 'hot-route',
        target: 'WR3',
        value: 'Drag',
        why: 'The BACK answer. Branch (SPD 95) runs 2 yards under a hover backpedaling toward the In. It is a space and RAC throw, not a contested one. It crosses opposite the In and below the 6 to 8 outside slants, so no two receivers share a window. On the slot menu, and WR3 is macro-safe. It replaces his stock slot route.',
        conf: 'm27',
      },
      {
        adj: 'fake-snap',
        value: 'On',
        why: 'One hard count at the line. The hard count is an EA control. The claim that a user timing the snap from the A gap flinches in or backs out and so shows his branch early is our read.',
        conf: 'read',
      },
    ],
    beats: [
      'The A-gap hover with show blitz, in both branches. Forward: Pitts\'s In lands in the spot he left before he arrives. Back: Branch\'s drag is underneath his backpedal.',
      'The protection-confusion snap Civil warns about ("hover at the line and never actually come"). The only protection decision is in the macro, so nothing gets re-flicked with the play clock running.',
      'The user shifting from the A gap to the B gap. Untarget follows the player, not the gap.',
    ],
    losesTo: [
      'A ghost hover that drops only to the drag\'s depth (2 to 3 yards). The In at 8 to 10 is then behind him again, so it is still a binary read: he sits shallow, throw Pitts.',
      'A hover by a different player. If he switches his user to the SS or the Will and mugs, the macro has untargeted the wrong man. Flick the flame onto the real user by hand (protection on the fly) before the snap.',
      'A robber at 8 to 10 over the ball. He sits on the Pitts In from above. INSIDE CROSS or CURL OUTS.',
      'A seven-man send. Six blockers plus a deliberately free user is not enough. It is a throw-it-now down, or HB SLIP SCREEN.',
    ],
    sequence: [
      {
        if: 'He stops rushing and drops to the hook every snap (hover, then bail).',
        call: 'He is no longer pressure. Six blockers now handle four CPU rushers with nobody free. Take the Branch drag underneath him. Once he starts sitting on the drag, check to CURL OUTS from the same Gun Spread Y Slot Wk look with the macro still on: outside breakers away from where he lands.',
        playId: 'falcons-off-gun-spread-y-slot-wk-curl-outs',
      },
      {
        if: 'He backs out of the mug pre-snap and plays from depth, while the CPU linebackers keep showing blitz.',
        call: 'The A gap is no longer his. HB MID DRAW from the same look: the showing linebackers rush upfield past the mesh, and the untargeted Mike is 5+ yards deep and out of the draw path.',
        playId: 'falcons-off-gun-spread-y-slot-wk-hb-mid-draw',
      },
      {
        if: 'He switches his user to a mugged safety or doubles the mugs and sends six.',
        call: 'Flick the flame onto the new user by hand. If six are coming, HB SLIP SCREEN from the same look lets the whole rush run past Bijan.',
        playId: 'falcons-off-gun-spread-y-slot-wk-hb-slip-screen',
      },
    ],
    checkout: {
      playId: 'falcons-off-gun-spread-y-slot-wk-curl-outs',
      name: 'CURL OUTS',
      when: 'The hover has bailed into the hook two snaps running, or a robber sits at 8 to 10 over the ball. The middle is refilled, so throw outside-breaking routes away from where he lands, same look, macro on.',
    },
    tells: [
      'Five endings from one 2x2 with the back offset left: DOUBLE SLANTS (Pitts In or Branch drag), RPO, crosser, draw, screen. The hover cannot sit in the window and still guard his gap.',
      'The macro only touches TE, WR3, HB and protection, so it survives a flipped call. WR1 and WR2 stay stock.',
      'After the macro, R2/RT + right stick up: the flame should be on the hovering Mike. If it landed anywhere else, the untarget did not take, so fix it by hand.',
      'The hover\'s first step is the whole read: forward means Pitts, back means Branch. If he steps forward on the hard count, the In is already the answer.',
    ],
    call: 'Second and 3 to 8 and third and short to medium, any time a user parks in an A gap with the linebackers walked up. Set the macro, confirm the flame, one hard count, snap, read his first step.',
    practice: [
      {
        setup: 'Practice Mode, defense set to falcons-def Nickel 2-4 Single Mug · 1 LB DOG (one A-gap mug, a linebacker comes: the FORWARD branch) · DOUBLE SLANTS + VACANCY macro',
        verify: 'Time it: count from the snap to the throw leaving Tua and to the mug reaching him (slow-motion replay); log both. The forward branch only holds if the throw is out first. Before the snap, R2/RT + right stick up shows the flame on the mug (Mike) and the M icon on the Will. At the snap, the mug goes unblocked, Bijan picks up the dogging linebacker, and the Pitts In is thrown on its break over the ball before the mug reaches Tua. Note the In\'s actual break depth. If it is under 7, the throw still works but meets the outside slants, so log it. Pass: completion, no sack.',
      },
      {
        setup: 'falcons-def Nickel 2-4 Single Mug · COVER 3 (the mug bails into zone: the BACK branch) · DOUBLE SLANTS + VACANCY macro',
        verify: 'The mug\'s first step is back. Check that the Branch drag at 2 yards is open underneath him, crossing opposite the Pitts In, with Bijan leaking once the Will drops. Pass: the drag is open by a step and Branch catches in stride. If not, log it and run CURL OUTS from the same look.',
      },
      {
        setup: 'falcons-def Nickel 2-4 Dbl Mug · MID BLITZ 0 (both A gaps mugged, linebackers walked up: the double-mug adjustment) · HB SLIP SCREEN, then CURL OUTS, same look, macro on',
        verify: 'The screen: the rush runs past Bijan. CURL OUTS: the outside breakers are open away from the mugs. The CPU does not hover like a user, so this confirms alignment and who comes, not a human\'s timing.',
      },
    ],
    conf: 'read',
    gauntlet: { passed: '2026-09-24', rounds: 5, art: 'civil.gg M27 diagrams' },
  },

]
