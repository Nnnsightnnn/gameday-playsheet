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
//   WHIPSAW      TE whip into the flat the fired slot corner left
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
  // against G1-G9 (docs/packages/package-scout-SKILL.md). Every one passed;
  // none is proven until its practice reps are run and logged.
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
  //   madden.tools, Nickel 2-4 Cover 1 Robber (page text): "Four defensive
  //     linemen rush off the snap while the linebackers and corners lock up in
  //     man across from every eligible receiver, leaving the deep safety alone
  //     on top and the robber (yellow zone) as the second level trap defender."
  //     The robber keys the QB's eyes and "sits right in" mesh, drag and
  //     crossing traffic. Weakness: "offenses attacking the flat or running backs
  //     leaking out to the boundary since the robber is occupied inside".
  //     The art shows a safety as the robber.
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
  //   2. Watts, not Bates, gets the robber zone once the macro sets the depth and
  //      midpoint (rep 1).
  //   3. The spy step takes Harris off his man, most likely the back, which
  //      leaves the back free on a pass (rep 1 shows who; rep 3 punishes it).
  //   4. TAMPA 2's flat corners and contain take the back's flat route and the
  //      sprint-out with the macro stacked on it (rep 3).
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
        role: 'Same single-high rotation, with no robber and every underneath defender in man; the macro still puts Harris on the QB. Use it against a pocket QB who throws the dig into the robber.',
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
      coverage: 'Cover 1 Robber, per madden.tools: four rush, linebackers and corners in man, one deep safety, and a safety in the robber zone. The macro adds contain on both edges and makes Harris the QB spy. At the snap the box holds four contain rushers, Harris and Deablo, the six that the zone scheme set its seven blockers on. Watts is a zone player here, not man. He drops from twelve yards into the robber hole over the ball, keys the QB\'s eyes, and when the QB keeps it he fills the B/C gap. No blocker was assigned to a defender who was at twelve at the snap, so Watts arrives unblocked as the seventh defender. Contain means the QB Wrap cannot bounce, so it cuts inside the wrap block into Watts. Deablo\'s man is the back; when the back leads or blocks, Deablo stays clean and flows to the ball as a free runner, never taking on the block (plan doctrine: keep him clean). If the shell step fails, the depth and midpoint steps still hold both safeties high. Even with no disguise, contain, a spy and a robber still leave QB Zone with no spare blocker; the shell only makes them more likely to call it.',
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
        why: 'Stores QB Contain on both edges so it carries onto TAMPA 2 with the macro. Since TU Sep 3 tackles pick up contain, so here it only squeezes the wrap inside to Watts and turns the sprint-out back.',
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
    gauntlet: { passed: '2026-09-24', rounds: 4 },
  },

  // SHOT CLOCK — Falcons defensive package, slot 5. Final revision 2026-09-24,
  // built against m27-o-return (Return Bench and Y Ohio Return out of Gun
  // Doubles Clamp Stack, Cheat Flat X Post out of Gun Normal Y Off Close).
  //
  // PALM READER beats return routes with coverage: a Cover 4 Palms trap.
  // SHOT CLOCK beats them with the clock. A return route is a double move, up
  // and in and then back out, and the QB has to hold the ball through both
  // breaks. Show the stock Nickel 2-4 two-high picture, then let the macro turn
  // a four-man Cover 3 Sky into a six-man fire zone. The strong safety rolls
  // down into the window the return comes back to.
  //
  // The front. Nickel 2-4 is two interior tackles (DT Dexter, DT Dorlus), two
  // edges (LEDG Ebukam, REDG Za'Darius Smith) and two off-ball backers (Deablo,
  // Harris). The "front four" is the two DTs plus the two edges.
  // Madden 27 files the edges as LEDG/REDG, not DE or OLB (personnel-falcons.js).
  //
  // What each source says, and what it is used for:
  //   madden.tools COVER 3 SKY page: "let the front four win with a standard
  //     four man rush". It "rolls the strong safety down into the box as the
  //     extra run support and short zone defender", and "the deep safety" and
  //     both corners carry thirds: "three deep, four under".
  //   madden.tools COVER 3 CLOUD page: "rolls the strong safety down into the
  //     flat" with "three deep" and "four defenders" underneath.
  //   The alignment claim is a read of the madden.tools diagrams, not their
  //     text: SKY, CLOUD, QUARTERS and PALMS show the same pre-snap spots, with
  //     the nickel off the ball and both backers at depth.
  //   EDGE BLITZ 3 was rejected. Its page describes "both outside linebackers
  //     crashing off the corners", and its diagram puts extra defenders on the
  //     line before the snap.
  //   Timesaver's TU Sep 16 notes: fixed "Coverage Shell not always being
  //     respected".
  // The six rushers (front four + SLOT + WILL) are set by the macro, not taken
  // from play art. Rep 1 counts them.
  {
    id: 'falcons-pkg-shot-clock',
    game: 'madden',
    side: 'defense',
    name: 'SHOT CLOCK',
    tagline: 'Show stock quarters, bring six. The return route needs a second break, and the rush arrives before it. The Sky safety is sitting where it comes back to.',
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
        role: 'The honest version of the picture: two really stay deep and the front four rush. The madden.tools diagram shows the same pre-snap spots (read). Call it twice for every SHOT CLOCK so the look keeps meaning quarters.',
      },
      {
        playId: 'falcons-def-nickel-2--4-cover-3-cloud',
        name: 'COVER 3 CLOUD',
        type: 'pass',
        role: 'The answer to the quick hot. Once they start getting the ball out to the flat or a slant before six arrive, call this plain with no macro. The madden.tools diagrams show the same spots. The front four rush and seven drop. The page says the strong safety rolls down into the flat, while the diagram reads as a corner squatting it (read; rep 3 checks which). Either way that flat has a defender, and Bowman and two hooks are underneath.',
      },
      {
        playId: 'falcons-def-nickel-2--4-cover-4-palms',
        name: 'COVER 4 PALMS',
        type: 'pass',
        role: 'The answer to max protect. Call it plain with no macro when they keep the back and TE in. The madden.tools diagram shows the same pre-snap spots (read). The front four rush and seven drop into palms, so three receivers run into seven droppers and the palms corner traps the return.',
      },
    ],
    counters: [
      'm27-o-return',
    ],
    user: 'FS Bates. Middle third of the fire zone. The macro rolls Watts down to the stack-side curl-flat, where the return comes back out; you sit over the post and the Cheat Flat X Post, and drive on anything that crosses your face.',
    look: {
      shell: 2,
      rush: 4,
      press: false,
      picture: 'The stock Nickel 2-4 zone alignment. In the madden.tools diagrams it reads the same for COVER 3 SKY, COVER 4 QUARTERS, COVER 4 PALMS and COVER 3 CLOUD (read). Two safeties level and high, corners off, and a front four: Dexter and Dorlus inside, Ebukam and Za\'Darius Smith on the edges. Bowman is just off the ball over the slot, and Deablo and Harris are at linebacker depth. Nobody is walked up. The Cover 4 shell is stored in the macro. A return-route player reads this as quarters and has already chosen his answer: the Y return or Return Bench, thrown when the quarters flat defender passes the stem off and the route comes back to grass.',
    },
    truth: {
      shell: 1,
      rush: 6,
      deep: 3,
      coverage: 'Cover 3 fire zone: six rush, five drop. The stock Cover 3 Sky rushes the front four: Dexter and Dorlus inside, Ebukam and Za\'Darius Smith off the edges. The madden.tools page calls it "a standard four man rush". The macro adds Bowman (SLOT, SPD 92) from over the slot and Harris (WILL, PUR 84) from linebacker depth. The protection has six blockers at most. If the back releases into the return pattern, one blitzer is unblocked by count. If he stays, it is six on six, and the back has to pick Bowman or Harris up in space. The return cannot be thrown until its second break, and the six are built to arrive before it (rep 2 times this). Behind the rush, the stock Sky rotation holds. The madden.tools page has the strong safety rolling down and "the deep safety" carrying the middle third. That puts Watts on the stack-side curl-flat at ten (roll to pass strength), and Bates in the middle, which is where the return comes back out. Deablo stays in the hook under the in-cut, and Terrell and Hughes take the outside thirds. The pre-coded return is thrown late into the Sky safety or not thrown at all. The flat that Bowman vacated is the price.',
    },
    lab: { shown: 'c4', played: 'c3sky', formation: 'stack', concept: 'curlflat' },
    adjustments: [
      {
        adj: 'coverage-shell',
        value: 'Cover 4',
        why: 'Stores the quarters picture so the macro holds it to the snap. The madden.tools Sky diagram already shows two level safeties (read), and TU Sep 16 fixed shells not being respected. Whether Nickel 2-4 lists Cover 4 on the right-stick picker for Cover 3 Sky is checked in rep 1.',
        conf: 'read',
      },
      {
        adj: 'cov-leverage',
        value: 'Over the Top',
        why: 'Only three are deep behind six rushers, and TU Sep 16 extended the lead on vertical throws. Off corners shaded over the top keep a panic go ball in front of them. This changes shading only, not alignment, so the picture stays stock.',
        conf: 'ea',
      },
      {
        adj: 'roll',
        value: 'Pass Strength',
        why: 'Points the Sky rotation at the strength side of Clamp Stack and Y Off Close, where the Y return and Return Bench are thrown. The down safety then lands on the return side. The madden.tools page says Sky rolls the strong safety down, which is Watts. Whether Roll moves him to the stack side is checked in rep 1.',
        conf: 'read',
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
        why: 'Bowman (SPD 92) blitzes from his stock spot over the slot, so nothing about the picture changes before the snap. He is rusher five. His stock curl-flat is left empty, and that flat is the price.',
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
        why: 'Pins Deablo (ZCV 78) in the stock hook, under the return\'s first cut. Against six, the QB\'s hot answer is that in-cut, and it gets thrown into a linebacker who never left.',
        conf: 'read',
      },
    ],
    beats: [
      'Return Bench and Y Ohio Return from Gun Doubles Clamp Stack. They are called against the quarters picture and need the second break, and six rushers are built to arrive before it.',
      'Cheat Flat X Post from Gun Normal Y Off Close. The post needs a full drop and a hitch, and the cheat flat is thrown to the strength side, where the Sky safety rotates down.',
      'The pre-decided read: the QB has read two-high and holds the ball through a double move against a blitz he never saw.',
    ],
    losesTo: [
      'Max protect: the back and TE stay in. Six rushers against seven blockers leaves nobody free, and the return has time. This is the first adjustment after a sack. Answer with COVER 4 PALMS from the same picture.',
      'The quick hot: a flat or slant into the side Bowman vacated, out before the second break. This is the second adjustment. Answer with COVER 3 CLOUD from the same picture.',
      'HB screen or draw behind the rush. Six are upfield and only Deablo and the Sky safety are underneath. This is the standard fire-zone price.',
      'Motion that flips strength after the macro is set. If the roll does not follow it, the Sky safety comes down on the side the return is not thrown to.',
    ],
    checkout: {
      playId: 'falcons-def-nickel-2--4-cover-4-palms',
      name: 'COVER 4 PALMS',
      when: 'After a SHOT CLOCK sack, when they show seven-man protection (TE attached plus the back set to his side), or they kept both in on the last one. Call it plain with no macro. The stock alignment is the same picture, so they still read quarters, and three receivers run into seven droppers.',
    },
    tells: [
      'Before the snap it matches COVER 4 QUARTERS, COVER 4 PALMS and COVER 3 CLOUD, because the madden.tools diagrams show the same pre-snap spots for all four (read). The blitzers are set by the macro, not by alignment, so nothing walks up.',
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
        note: 'Jessie Bates III: stay level with Watts pre-snap so the Cover 4 picture is honest, then take the middle third at the snap. Watts rotates down by roll (CPU).',
      },
      {
        id: 'bail-safety',
        phase: 'post',
        player: 'FS',
        note: 'Bates: the six arrive before the return breaks, so the throw that comes out early is the post. Stay on top of it.',
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
        verify: 'Rep 1, the count check. Practice mode, SHOT CLOCK against Y OHIO RETURN from Gun Doubles Clamp Stack (Cardinals book). Pause before the snap and confirm the picture matches COVER 4 QUARTERS: two level safeties and Bowman off the ball. After the snap, count six rushers (Dexter, Dorlus, Ebukam, Za\'Darius Smith, Bowman, Harris) and five droppers (three deep, the Sky safety in the curl-flat, Deablo in the hook), and confirm the down safety is Watts on the stack side. If the count is not six, or Watts is not the one who comes down, the package is false as written. Then call COVER 3 CLOUD and COVER 4 PALMS plain, pause each before the snap, and confirm the same two-level-safety picture with Bowman off the ball. If either differs, the shared-picture premise is false.',
      },
      {
        setup: '',
        verify: 'Rep 2, the clock. Same call, same offense, back released. Watch the Y: pass if a rusher reaches the QB before the return breaks back outside. If it is thrown, it should land on the Sky safety at ten. Repeat against RETURN BENCH. If the ball comes out cleanly on the second break in both, the timing claim is false.',
      },
      {
        setup: '',
        verify: 'Rep 3, the counters. Offense runs CHEAT FLAT X POST (Falcons book, Gun Normal Y Off Close) with the back and TE set to block: call COVER 4 PALMS plain and confirm the pre-snap picture did not change. Then run a quick slant-flat into Bowman\'s side: call COVER 3 CLOUD plain and confirm a corner or Bowman is on the flat inside two seconds.',
      },
    ],
    conf: 'read',
    gauntlet: { passed: '2026-09-24', rounds: 3 },
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
  // madden.tools (Nickel 2-4 Wide, Sep 2026): Cover 2 Man = five underneath in
  // press or trail man, two safeties splitting the field; rush count not listed
  // (4 is arithmetic). No diagrams published yet.
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
        role: 'The real zero, and the answer to the inside run. Under the same macro the safeties sit at the same nine yards, and this time they stay in the box: the eight-man front the picture promised is real. Call it once early so the lid is believable.',
      },
      {
        playId: 'falcons-def-nickel-2--4-wide-cover-3-match',
        name: 'COVER 3 MATCH',
        type: 'pass',
        role: 'The answer to bunch, stack and mesh. Under the same Cover 0 shell: hook and curl zone defenders pass the rubs off instead of chasing through them, and #2 vertical is still carried (madden.tools). Also the checkout.',
      },
      {
        playId: 'falcons-def-nickel-2--4-wide-silver-shoot-pinch',
        name: 'SILVER SHOOT PINCH',
        type: 'pass',
        role: 'Second run answer when a blitz is too loud: pinched backers for gap integrity vs inside zone and stretch, split deep zones still over the top (madden.tools).',
      },
      {
        playId: 'falcons-def-nickel-2--4-wide-cover-1-robber-press',
        name: 'COVER 1 ROBBER PRESS',
        type: 'pass',
        role: 'Vs a scrambling QB or a crosser-only offense: press man with a robber on the in-cuts; hold the robber as a spy by hand vs a runner.',
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
      picture: 'Cover 0 press: both safeties walked to nine yards, Deablo and Harris creeping the A gaps, every corner in press with no help showing. It is the look the offense has pre-coded its shot answer to: hot-route the outside receiver to a go and the slot to a post, because with zero deep and TU Sep 16\'s longer lead, one step of separation is a touchdown.',
    },
    truth: {
      shell: 2,
      rush: 4,
      deep: 2,
      coverage: 'Cover 2 Man. Four linemen rush; Deablo and Harris peel off the fake blitz to man the back and the #3; Terrell, Hughes and Bowman trail their men from underneath; Bates and Watts bail from nine to deep halves. The pre-coded go and post now run into a bracket: a trail defender on the hip taking the low shoulder, a half safety on top taking the high one, and the extended lead carries the ball past the trailer and into the safety.',
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
        call: 'DBL SAFETY BLITZ under the same shell. The safeties stay where they showed.',
        playId: 'falcons-def-nickel-2--4-wide-dbl-safety-blitz',
      },
      {
        if: 'They run inside zone on second and short.',
        call: 'SILVER SHOOT PINCH under the same shell. Pinched backers fit the gaps, split deep zones stay over the top.',
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
        why: 'Nine yards reads as zero or a pressure look to the QB but leaves Bates and Watts a nine-yard bail to their half landmark, which beats a go ball that needs roughly 40 yards of air. Five would sell harder and arrive late.',
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
      'Identical to DBL SAFETY BLITZ pre-snap: same nine-yard safeties, same creeping backers. Only the bail at the snap gives it away.',
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
    gauntlet: { passed: '2026-09-24', rounds: 2 },
  },

  // WHIPSAW — Falcons offense vs sim / fire-zone pressure (m27-d-sim).
  // Built 2026-09-24, revision 2 (final). One formation (Gun Y Off Trips Close), five calls, one macro.
  //
  // Sources, with what each one actually says (anything past its wording is tagged read):
  // - madden.tools, DB Fire 2 https://madden.tools/playbooks/formation/dime/2-3-6-will/db-fire-2
  //   "brings pressure from the slot corners while dropping the two deep safeties
  //   into a Cover 2 shell"; "The two underneath defensive backs and the middle
  //   linebacker zone drop into shallow window spots to take away quick hitters";
  //   "the box shows five rushers"; "Cover 2 hard flat and shallow drag combos with
  //   a seam route can exploit this if the underneath zone defenders overcommit to
  //   the flat ... the void between the blitzers and the deep safeties"; defensive
  //   read: "Key the slot receivers at the snap, since the underneath zone
  //   defenders are reading their initial release before sinking into their
  //   landmarks."
  // - madden.tools, TE Whip https://madden.tools/playbooks/formation/shotgun/y-off-trips-close/te-whip
  //   "the inside receiver runs a whip route ... that snaps outside then settles
  //   back underneath"; "the outside trips receiver clears vertically before
  //   breaking back to the sideline"; "The primary read starts with the whip route
  //   underneath since it is the built-in man beater against off coverage or a
  //   blitzing defender, then progresses outside to the deep comeback". The page
  //   does not name the inside receiver; Pitts there is read (Y off = TE).
  // - madden.tools, Mtn Y PoCo / WR Screen / HB Mid Draw / X Curl pages under
  //   /playbooks/formation/shotgun/y-off-trips-close/ (fetched 2026-09-24). The
  //   pages are generated text and partly inconsistent, and they list the plays as
  //   "not in any team playbook", but huddle.gg ships all five in falcons-off.
  // - The Madden Academy, DB Fire 2 guide https://themaddenacademy.com/2026/08/mastering-the-san-francisco-db-fire-2-blitz-in-madden-27
  //   offenses that untarget the slot corners get answered with linebacker blitzes.
  //   Applying that to an untargeted Mike is read.
  // - src/data/personnel-falcons.js off.slot: Branch is a vertical decoy / screen
  //   piece (51 AWR), not the short-route chain-mover.
  {
    id: 'falcons-pkg-whipsaw',
    game: 'madden',
    side: 'offense',
    name: 'WHIPSAW',
    tagline: 'They fire the slot and park the Mike in the quick-hitter window. Pitts snaps out into the flat the corner left; if the Mike widens, Pitts settles back underneath where he was. Branch runs the seam past both.',
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
        role: 'The answer once they widen a defender into the flat to meet the whip. madden.tools: "the Y (slot) runs the post corner breaking to the numbers" while the two outside trips receivers clear deep; tagged a Cover 2 beater. The corner break lands over the widened flat defender and under the half safety (read). The macro still fits: the WR3 Streak matches the clear-outs.',
      },
      {
        playId: 'falcons-off-gun-y-off-trips-close-wr-screen',
        name: 'WR SCREEN',
        type: 'pass',
        role: 'The Cover 0 answer only. madden.tools names Cover 0 and Cover 1 blitzes as the shells most vulnerable to it, and warns that a trips-side corner blitz gets it jumped by a lurker, so do not call it against DB Fire 2 itself. Call it without the macro: the WR3 hot would pull one of the two inside blockers.',
      },
      {
        playId: 'falcons-off-gun-y-off-trips-close-hb-slip-screen',
        name: 'HB SLIP SCREEN',
        type: 'run',
        role: 'Five rushers run past Bijan. Do not fire the macro on this call: HB Pass Block cancels the slip.',
      },
      {
        playId: 'falcons-off-gun-y-off-trips-close-hb-mid-draw',
        name: 'HB MID DRAW',
        type: 'run',
        role: 'madden.tools: the line "fans out like dropback protection" before Bijan hits "the natural crease between the guards", built to punish "overzealous blitz packages". The droppers turn to their windows and the Mike leaves the middle (read). Keeps the droppers from cheating outside.',
      },
    ],
    counters: [
      'm27-d-sim',
    ],
    user: 'Stay on Tua. Pre-snap: find the fire (the slot corner creeping over Branch, two safeties deep) and check that the flame is off the Mike. After the snap, read the Mike, not Pitts. If the Mike holds his shallow window, throw Pitts on the snap outside into the empty flat. If the Mike widens to meet the snap, hold the ball a half-beat and throw Pitts as he settles back underneath, into the window the Mike just left. If the underneath DB who keys Branch\'s release also overcommits to the flat, Branch is alone in the seam between the rush and the two safeties. Never throw the slant or the stick: the Mike is sitting there. Branch stays at WR3 because the macro only asks him to run a straight line. If you sub Olamide Zaccheaus in by hand for third down, the macro follows the WR3 depth slot and gives him the Streak.',
    userObjectives: [
      {
        id: 'pass-pro-pickup',
        phase: 'pre',
        player: 'HB',
        note: 'Bijan Robinson stays in and owns the fifth rusher. With the Mike untargeted, the line counts the fired slot and Bijan takes the first free man inside-out. If the slot walks down on the backside, flick the slide there by hand; the macro holds no direction.',
      },
      {
        id: 'user-catch-timed',
        phase: 'post',
        player: 'TE',
        note: 'Kyle Pitts Sr. is the short answer: either the snap outside into the flat the fired corner left, or the settle back underneath if the Mike chases. Switch to him while the ball is in the air and release in the green window. The job sits on him, not on Zachariah Branch (51 AWR).',
      },
      {
        id: 'qb-scramble-user',
        phase: 'post',
        player: 'QB',
        note: 'Tua Tagovailoa: if a corner squats the flat and the Mike sits on the settle, it is still six blockers on five rushers. Climb and slide at the sticks. Do not force the slant into the Mike.',
      },
    ],
    look: {
      picture: 'Gun Y Off Trips Close: three to one side (outside WR, Branch in the slot, Pitts off the line as the inside receiver) and London alone backside. The sim shows four and fires a slot corner. It is built for the answer every offense has pre-coded against a fired slot: the quick hitter (slant, stick, hook) to the uncovered man. madden.tools says DB Fire 2 drops "the two underneath defensive backs and the middle linebacker ... into shallow window spots to take away quick hitters", so the pre-decided hot throw goes straight into a dropper.',
    },
    truth: {
      blockers: 5,
      releases: 5,
      concept: 'A horizontal hi-lo on one dropper. The fired trips-side slot corner was the defender who would have played the flat, so the flat is empty at the snap (read: that is where his zone would have been). Pitts, the inside trips receiver, runs the whip as madden.tools draws it: he "snaps outside then settles back underneath". That puts the Mike, sitting in his shallow window, in a bind he cannot solve alone. If he holds the window, Pitts\'s snap outside is uncovered in the vacated flat. If he widens to it, Pitts settles back underneath into the window he just left. Branch (WR3, macro hot Streak) releases straight up the seam. The underneath DB reads the slot\'s release, so he carries Branch vertically and is not the flat help. If he or the Mike "overcommit to the flat", Branch is in the "void between the blitzers and the deep safeties", the weakness madden.tools names. Bijan stays in (six on five), and the untargeted Mike means no lineman blocks a man who drops.',
    },
    adjustments: [
      {
        adj: 'protect',
        value: 'Base',
        why: 'Base, not a slide. A slide is stored with a direction, and slot fire can come from either side, so a flipped call would slide away from it. Bijan in Base takes the free man on whichever side he comes from, and a manual flick handles a late walk-down.',
        conf: 'm27',
      },
      {
        adj: 'untarget',
        value: 'MIKE',
        why: 'madden.tools has the Mike zone-drop to a shallow window in DB Fire 2. Untargeting takes the flame off him, so the center and guard block the four who come plus the fired corner, not a man who drops. Whether he drops in every sim is read; see losesTo.',
        conf: 'read',
      },
      {
        adj: 'ind-block',
        target: 'HB',
        value: 'Pass Block',
        why: 'Bijan stays in: six blockers against a five-man fire ("the box shows five rushers"). The whip needs its settle beat, and only the fifth rusher takes that beat away.',
        conf: 'm27',
      },
      {
        adj: 'hot-route',
        target: 'WR3',
        value: 'Streak',
        why: 'The macro-safe hot, and Branch\'s documented job: a straight vertical release with 95 speed and no option read. The stock page has the trips receivers "stem upfield before turning back", so the Streak removes the turn-back. The underneath DB reading his release has to carry him out of Pitts\'s flat, and it is the seam throw DB Fire 2 is weak to. Bound to WR3, not WR1/WR2, so a flipped call keeps it on the slot.',
        conf: 'm27',
      },
    ],
    beats: [
      'DB Fire 2: the fired slot corner leaves the flat empty for Pitts\'s snap outside, and the Mike in his window can take the snap or the settle, not both.',
      'Will Go Fire 3 and any fire zone with one dropper in the hook: the whip stretches that dropper sideways and the Streak runs past him vertically (read for Will Go Fire 3, whose drops are not in a source).',
      'The pre-decided hot-throw habit the sim exists to pick off: the macro takes the slant out of the play, and the read is the dropper, not the uncovered man.',
    ],
    losesTo: [
      'A fire zone that also drops the trips-side corner into the flat (a cloud or squat corner) while the slot fires: the snap outside runs into him and the Mike sits on the settle. Go to MTN Y POCO, or check to X CURL.',
      'A true Cover 0 send of seven: six blockers cannot hold seven. Throw the snap outside on rhythm, or check to WR SCREEN from the same look.',
      'A Mike who comes instead of dropping. The Madden Academy says offenses that untarget the fired corners get answered with linebacker blitzes, and the same answer to an untargeted Mike is read. Untargeted, he walks through the A gap and only Bijan in Base is left to stop him. If it happens twice, remove the untarget row by hand.',
    ],
    sequence: [
      {
        if: 'Base look: slot corner creeping, two high, Mike stacked over the ball. Call TE WHIP with the macro; read the Mike.',
        call: 'TE WHIP',
        playId: 'falcons-off-gun-y-off-trips-close-te-whip',
      },
      {
        if: 'After one whip completion they widen a defender to sit in the trips flat, so the snap outside is covered and the Mike plays the settle. Tell: a DB aligned outside Pitts at 5 to 6 yards. MTN Y POCO with the macro applied: the post stem turns the hook defender inside, then the corner break goes over the widened flat defender and under the Cover 2 half safety (madden.tools: Cover 2 beater; the landing spot is read).',
        call: 'MTN Y POCO',
        playId: 'falcons-off-gun-y-off-trips-close-mtn-y-poco',
      },
      {
        if: 'Or they stop sim-ing and send true Cover 0 from the same dime look. Tell: both safeties at 8 yards or closer, corners pressed. Stay in TE WHIP with the macro (madden.tools: the whip is "the built-in man beater against off coverage or a blitzing defender"; Branch\'s Streak has no safety over it). If more than six show, check to WR SCREEN without the macro; madden.tools names Cover 0 as its most vulnerable shell.',
        call: 'WR SCREEN',
        playId: 'falcons-off-gun-y-off-trips-close-wr-screen',
      },
      {
        if: 'They squat the trips corner and sit the underneath DB on Pitts before the snap: the whole trips side is capped. Check to X CURL: madden.tools has the backside X climbing the seam as the primary read against man, away from both droppers.',
        call: 'X CURL',
        playId: 'falcons-off-gun-y-off-trips-close-x-curl',
      },
    ],
    checkout: {
      playId: 'falcons-off-gun-y-off-trips-close-x-curl',
      name: 'X CURL',
      when: 'The trips-side corner walks down to squat the flat and a DB sits on Pitts pre-snap: the whip side is capped. madden.tools has the backside X "climbs vertically up the seam as the primary read against man coverage"; London as that X is read.',
    },
    tells: [
      'Slot corner creeping to the line over Branch while two safeties stay deep: that is DB Fire 2. Throw the whip, not the slant.',
      'The Mike stacked over the center who backpedals at the snap is the dropper. Read him: holds means the snap outside, widens means the settle underneath.',
      'A DB aligned outside Pitts pre-snap means they have adjusted to the whip. Call MTN Y POCO.',
      'Five calls from one trips picture, two of them runs: the Mike cannot cheat outside without opening the draw and the settle.',
    ],
    call: 'Second and 4 to 9 and third and medium when the slot walks down with two high. Snap on the walk-down. After one completed whip, expect the flat to widen and call MTN Y POCO.',
    practice: [
      {
        setup: 'DB Fire 2 (Dime 2-3-6 Will; Buccaneers, Giants, Jets, Raiders, Ravens or Steelers defensive book) · Call TE WHIP and fire the macro. On the replay, confirm that Pitts is the inside trips receiver, that he snaps outside and then settles underneath, that Branch runs the Streak, and where the Mike lands.',
        verify: 'Pass: Pitts is open on the snap or the settle on 4 of 5 reps. The Mike drops (so the untarget is safe). No sacks.',
      },
      {
        setup: 'Will Go Fire 3 (set it from any defensive book that carries it; search the name in practice) · Same call and macro. Watch Bijan pick up the Will and where the dropper lands.',
        verify: 'Pass: The dropper is in the hook, not the flat. Pitts is open on the snap outside or the settle on 4 of 5 reps.',
      },
      {
        setup: 'DB Fire 2 again, with a second pad putting the nickel DB outside Pitts in the flat · Call MTN Y POCO with the macro applied.',
        verify: 'Pass: Pitts breaks to the corner over the flat defender and under the half safety. If the half safety gets over the top every rep, drop POCO and make X CURL the answer.',
      },
    ],
    conf: 'read',
    gauntlet: { passed: '2026-09-24', rounds: 3 },
  },

  // SWITCHBOARD — offensive pass package vs m27-d-match (Cover 3 Match /
  // Quarters / Palms). Built 2026-09-24 against the post TU Sep 16 meta.
  // Revision 1: the mechanism now runs on the stock route art, with no hot
  // route in it.
  //
  // Route art: madden.tools Shotgun Bunch Offset play diagrams (the M26 art,
  // carried into the M27 book under the same play names; the carryover is a
  // read until practice rep 1 confirms it):
  //   SPEED DIG   bunch #1 (outside) takes an outside-vertical stem and breaks
  //               in at ~17 (the primary). #2 (point) runs up the seam and bends
  //               into a deep over at ~15. #3 (inside) goes under and out to a
  //               short corner in the flat. The backside X runs a deep out, and
  //               the back runs a short angle.
  //   PA CHEAT SWITCH DIG  a bunch receiver cheat-motions across to join the X
  //               (two backside verticals). After the fake, the middle of the
  //               bunch digs over an inside-man shallow, and the back leaks to
  //               the bunch-side flat.
  //   SPACING SWITCH  quick spacing: short sit and short corner in the bunch, a
  //               deeper out, the X on a skinny in-cut, the back to the flat.
  //   CHOICE SHALLOW DIG  inside shallow, point-man choice, outside man
  //               vertical then over the top, X dig, back on a wheel/swing.
  // Which Falcon stands at #1/#2/#3 (Dotson, Branch, Pitts) is not on the art.
  // Rep 1 is the numbering check.
  //
  // The mechanism: match gives #1 to the corner and #2 to the apex while both
  // run vertical. SPEED DIG bends both of them inside, two yards apart in
  // depth, in the same beat, so each defender has to pass his man to the same
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
        role: 'The answer to the bunch check. The cheat motion sends a bunch receiver across, so an in/out check has to re-declare. The fake holds the hook, then the dig goes over the shallow.',
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
    user: 'QB Tua Tagovailoa. Your eyes go to the middle safety, not to a receiver. When #2 bends across at 15, the safety either drives on him or sits: if he drives, throw the dig (#1) two yards behind him; if he sits on the dig, throw the over. If neither is clean, the back is on the angle underneath. It is a defined two-man read on rhythm, the kind of throw Tua is rated for.',
    userObjectives: [
      {
        id: 'pass-pro-pickup',
        phase: 'snap',
        player: 'HB',
        note: 'Bijan Robinson checks for a fifth rusher before he runs his angle. Match rushes four, so most snaps he releases; if a mug or a sim comes, he picks it up and the two in-breakers still get their time.',
      },
      {
        id: 'user-catch-timed',
        phase: 'post',
        player: 'WR3',
        note: 'Take whichever bunch receiver rep 1 shows on the dig (Zachariah Branch if WR3 is the outside man, otherwise Jahan Dotson) and time the catch into a covered window: the corner is trailing him from outside leverage.',
      },
    ],
    look: {
      picture: 'Gun Bunch Offset: three receivers bunched (#1 outside, #2 point, #3 inside), London alone on the backside, the back offset. Match numbers the bunch before the snap: the corner has #1 vertical, the apex has #2 vertical, the hook has #3. SPEED DIG bends #1 and #2 inside two yards apart at the same moment, so both of them get passed to one middle safety at once. Whichever he takes, the other in-breaker is open. The same picture as PA CHEAT SWITCH DIG, SPACING SWITCH and the split-zone run.',
    },
    truth: {
      blockers: 5,
      releases: 5,
      concept: 'Double pass-off to one safety. Cover 3 Match has the corner carry #1 vertical and the apex carry #2 vertical, each handing his man to the middle safety when he breaks inside. SPEED DIG runs #2 up the seam and across at 15 and #1 on an outside stem breaking in at 17, while #3 goes under and out to the flat and pulls the hook with him. The middle safety gets both pass-offs in the same beat: drive on the over and the dig is open behind him, sit on the dig and the over is open in front. Quarters / Palms vs the bunch: the safety over the bunch carries #2 vertical, so when #2 bends across he takes that safety out of the dig window, and the corner is trailing the dig from the outside leverage #1\'s stem gave him. Five linemen block, the back checks for a blitzer and then runs his angle, and every route is stock: nothing depends on a hot route.',
    },
    lab: { shown: 'c3sky', played: 'c3match', formation: 'bunch', concept: 'dagger' },
    adjustments: [
      {
        adj: 'block-style',
        value: 'Balanced',
        why: 'Both in-breakers break at 15 to 17 yards, so the line has to hold a full drop, and Aggressive draws holding since TU Sep 3. Option names are unconfirmed.',
        conf: 'read',
      },
      {
        adj: 'protect',
        value: 'Base',
        why: 'Keeps the back on his blitz check before the angle so a fifth rusher never gets a free run at a long drop. It does not touch any route, so the art stays as drawn and the macro survives a flipped call.',
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
      'Man across the board (Cover 1 or 2 Man): man defenders trail both in-breakers with no pass-off to be late on. Check to CHOICE SHALLOW DIG and throw the rub shallow.',
      'A bail: the corner and the apex sink under the in-breakers at 15 (Cover 3 Drop / Sky). The deep windows close and the flat opens. Throw SPACING SWITCH.',
    ],
    checkout: {
      playId: 'falcons-off-gun-bunch-offset-choice-shallow-dig',
      name: 'CHOICE SHALLOW DIG',
      when: 'The corner presses the outside bunch man and a defender walks out over the point with his eyes on him, not the QB: that is man, so there is nothing to pass off. Throw the shallow off the bunch rub.',
    },
    tells: [
      'Watch the middle safety on the first SPEED DIG. If he drives on the over, the dig was open behind him; if he sits, the over was open. That is the read every snap.',
      'Two defenders standing level over the bunch before the snap means a bunch in/out check, not match. That is the adjustment the caller makes after losing once.',
      'Corners and the apex opening to the sideline at the snap and sinking to 15 means a bail. The flat is empty.',
      'Four calls from one bunch, one of them a run. The macro only sets protection and blocking style, so it rides every twin and a flipped call unchanged.',
    ],
    call: 'First and ten and second and 4 to 9 against any match shell. The sequence: (1) SPEED DIG until the match caller loses one. (2) He adjusts. If he goes to a bunch check (two level over the bunch), run PA CHEAT SWITCH DIG from the same bunch: the motion pulls a bunch man across, the check has to re-declare, and the dig goes over the shallow. If he goes man (press on the outside bunch man), CHOICE SHALLOW DIG and throw the rub shallow. If he bails (corners and apex sinking), SPACING SWITCH and throw the flat. (3) Back to SPEED DIG once he returns to match. The macro stays on for every step.',
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
        verify: 'Numbering check first. Pause at the snap and name #1, #2 and #3 in the bunch (Dotson, Branch or Pitts) and who runs the dig, the over and the short corner. Confirm the M27 art matches the M26 diagram. Then watch the middle safety at 15: does he take one in-breaker and leave the other?',
      },
      {
        setup: '3-3-5 Penny COVER 4 QUARTERS, then COVER 4 PALMS, same call.',
        verify: 'Does the bunch-side safety carry #2 across and leave the dig window? Does the corner trail the dig from outside leverage? Throw the dig and check whether the catch window is green.',
      },
      {
        setup: 'Play the counter-adjustments: 3-3-5 Penny COVER 1 ROBBER (man), then any bunch or in/out check the defensive book offers, then a Cover 3 Drop or Sky.',
        verify: 'Man: is CHOICE SHALLOW DIG\'s shallow clean off the rub? Bunch check: does the PA CHEAT SWITCH DIG motion make it re-declare, and is the dig open over the shallow? Bail: is the flat on SPACING SWITCH open on rhythm?',
      },
    ],
    conf: 'read',
    gauntlet: { passed: '2026-09-24', rounds: 2 },
  },

  // VACANCY — offense package vs the A-gap hover (m27-d-hover).
  // metas.js lists the stock counter: "ID the man in the A gap and keep the
  // back in". ZERO TAX already runs that and blocks the hover. VACANCY does the
  // opposite on purpose. It leaves the hover as the one free rusher, blocks
  // everyone he was hiding, and wins both branches of his choice:
  //   forward (rushes)  -> the ball is out into the hook zone he left before he can get home
  //   back (bails)      -> the drag goes underneath him before he can get to his drop depth
  // Built 2026-09-24 against the post TU Sep 16 meta.
  {
    id: 'falcons-pkg-vacancy',
    game: 'madden',
    side: 'offense',
    name: 'VACANCY',
    tagline: 'The hover is built to pull your protection onto him so the walked-up Will comes free. Leave the hover unblocked, block the Will, and read his first step. Forward means the slant into the hook he left, out before he arrives. Back means the drag underneath him.',
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
        role: 'Same slant with a run tag, for when he adjusts by staying square in the A gap and reading the QB. If he and the linebackers hold the box, throw the slant. If they widen, give it to Bijan.',
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
        role: 'For when a robber comes down on the slant at 5 to 8 yards. The crosser runs underneath him through the middle the hover left.',
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
    user: 'QB Tua Tagovailoa. Before the snap: R2/RT + right stick up and confirm the flame is on the hovering Mike and the M icon is on the Will. If the hover is a different player, flick the flame onto him by hand. Then one hard count. At the snap, the only key is the hover\'s first step. Forward means throw the Pitts slant on the third step into the hook he just left. Back means throw the Branch drag underneath him. No second read, and never hold it: he is unblocked on purpose.',
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
        note: 'Kyle Pitts Sr. (CIT 81, SPC 87): the FORWARD branch. The slant crosses into the hook the hover emptied with the free safety closing from depth. Secure it with a possession catch to move the chains.',
      },
      {
        id: 'user-rac-catch',
        phase: 'post',
        player: 'WR3',
        note: 'Zachariah Branch (R) (SPD 95): the BACK branch. The drag runs at 2 yards under a hover who is still backpedaling toward the hook. RAC catch in stride and turn it up. It is a defined throw, so his 51 AWR does not matter.',
      },
    ],
    look: {
      picture: 'Gun Spread Y Slot Wk: 2x2 with Pitts in the Y slot, Branch in the other slot and Bijan offset weak. Their built-in answer is a user hovering an A-gap mug with the linebackers walked up. It is meant to drag your ID and slide onto the hover so the Will comes clean. The same picture also runs a slant, an RPO slant, a crosser, a draw and a screen, so it tells him nothing.',
    },
    truth: {
      blockers: 5,
      releases: 5,
      concept: 'This is deliberately the inverse of the stock counter (ID the A-gap man and keep the back in, which is ZERO TAX). The Mike, as the hovering user, is untargeted, so he is the one free man. The Will is ID-d, and Bijan blocks him before releasing. Protection math: the hover meta shows six and brings five, the user plus four CPU rushers. Five linemen plus Bijan is six blockers for those four, so every CPU rusher is picked up and only the user is free. FORWARD: the hover has left the middle hook he was coded to cover. From the gun, the Pitts slant breaks inside at 3 to 5 yards and is thrown on the third step of the drop, about 1.0 s. A user starting a yard off the ball has to cover about 6 yards through a gap nobody blocks, about 1.3 s, so the ball is gone first. BACK: to cover the slant he has to backpedal from the line of scrimmage to 5 to 6 yards, so the Branch drag at 2 yards is open underneath him, and so is Bijan if the Will dropped. The QB never reads anyone but him.',
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
        value: 'Slant',
        why: 'The FORWARD answer. Pitts from the Y slot breaks inside at 3 to 5 yards, into the hook the hover was coded to cover. Slant is on both the TE and slot menus, and TE is flip-safe in a macro. It fixes the route whatever the stock DOUBLE SLANTS assignments are.',
        conf: 'm27',
      },
      {
        adj: 'hot-route',
        target: 'WR3',
        value: 'Drag',
        why: 'The BACK answer. Branch runs 2 yards under a hover who bails to the slant depth. On the slot menu, and WR3 is macro-safe.',
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
      'The A-gap hover with show blitz, in both branches. Forward: the slant is gone before he arrives. Back: the drag is underneath him.',
      'The protection-confusion snap Civil warns about ("hover at the line and never actually come"). The only protection decision is in the macro, so nothing gets re-flicked with the play clock running.',
      'The user shifting from the A gap to the B gap. Untarget follows the player, not the gap.',
    ],
    losesTo: [
      'A ghost hover that drops exactly to the drag\'s depth (2 to 3 yards) instead of the hook. Then the slant is behind him again, and it is still a binary read. If he sits at 5 to 6 on the slant, throw the drag.',
      'A hover by a different player. If he switches his user to the SS or the Will and mugs, the macro has untargeted the wrong man. Flick the flame onto the real user by hand (protection on the fly) before the snap.',
      'A robber at 8 to 10 over the ball with inside-shaded slot defenders. The hook refills from above. INSIDE CROSS or CURL OUTS.',
      'A seven-man send. Six blockers plus a deliberately free user is not enough. It is a throw-it-now down, or HB SLIP SCREEN.',
    ],
    sequence: [
      {
        if: 'He stops rushing and drops to the hook every snap (hover, then bail).',
        call: 'He is no longer pressure. Six blockers now handle four CPU rushers with nobody free. Take the drag underneath him. Once he starts sitting on the drag, check to CURL OUTS from the same Gun Spread Y Slot Wk look with the macro still on: outside breakers away from where he lands.',
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
      'Five endings from one 2x2 with the back offset weak: slant, RPO slant, crosser, draw, screen. The hover cannot sit in the window and still guard his gap.',
      'The macro only touches TE, WR3, HB and protection, so it survives a flipped call. WR1/WR2 stay stock.',
      'After the macro, R2/RT + right stick up: the flame should be on the hovering Mike. If it landed anywhere else, the untarget did not take, so fix it by hand.',
      'The hover\'s first step is the whole read: forward means slant, back means drag. If he steps forward on the hard count, the slant is already the answer.',
    ],
    call: 'Second and 3 to 8 and third and short to medium, any time a user parks in an A gap with the linebackers walked up. Set the macro, confirm the flame, one hard count, snap, read his first step.',
    practice: [
      {
        setup: 'Practice Mode, defense set to falcons-def Nickel 2-4 Single Mug · 1 LB DOG (one A-gap mug, a linebacker comes) · DOUBLE SLANTS + VACANCY macro',
        verify: 'Before the snap, R2/RT + right stick up shows the flame on the mug (Mike) and the M icon on the Will. At the snap, the mug goes unblocked, Bijan picks up the dogging linebacker, and the Pitts slant is released on the third step before the mug reaches Tua. Pass: completion, no sack.',
      },
      {
        setup: 'falcons-def Nickel 2-4 Single Mug · COVER 3 (the mug bails into zone: the BACK branch) · DOUBLE SLANTS + VACANCY macro',
        verify: 'The mug\'s first step is back. Check that the Branch drag at 2 yards is open underneath him, with Bijan leaking once the Will drops. Pass: the drag is open by a step. If not, log it and run CURL OUTS from the same look.',
      },
      {
        setup: 'falcons-def Nickel 2-4 Dbl Mug · MID BLITZ 0 (both A gaps mugged, linebackers walked up: the double-mug adjustment) · HB SLIP SCREEN, then CURL OUTS, same look, macro on',
        verify: 'The screen: the rush runs past Bijan. CURL OUTS: the outside breakers are open away from the mugs. The CPU does not hover like a user, so this confirms alignment and who comes, not a human\'s timing.',
      },
    ],
    conf: 'read',
    gauntlet: { passed: '2026-09-24', rounds: 2 },
  },

]
