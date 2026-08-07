// Falcons (Madden 27) offense + defense — built 2026-08-07, Madden 27
// launch window (early access Aug 6, no title update yet). Every playId is
// validated against public/data/playbooks.json (version 27, huddle.gg) by
// src/data/__tests__/gameplans.test.js.
//
// Doctrine (see docs/falcons-gameplan.md):
// - Underdog ball: shorten the game, bleed clock, take the checkdown.
// - Offense lives in 4 pictures: Pistol Bunch TE (base), Gun Bunch (money
//   page), Gun Trips TE Flex (quick game), Gun Tight Y Off (motion/run) —
//   with Singleback Wing Slot as the under-center counter-look and
//   Gun Tight Flex / Y Off Trips Close as low-usage identity sets.
// - Defense lives in ONE package: Nickel 2-4 Dbl Mug. Base / Tempo holds the
//   four blind-safe calls (C3 Sky / Tampa 2 / C2 Invert / Blitz Loop 3).
//   Blind blitzes only with a 3-deep net. MID BLITZ 0 is seen-look only.
// - Launch-window notes: new WR/DB hand-fighting punishes press with bad
//   corners (play off/cloud — this plan already does); watch the CFB-engine
//   C3 Match-vs-bunch bug — fall back to Tampa 2 / Cover 6 vs bunch if it
//   shows up in M27 before the first title update.

const OFF = 'Falcons'
const DEF = 'Falcons'

export const FALCONS_PLAN = {
  game: 'madden',
  name: 'Falcons · Madden 27',
  guide: 'gameplan-falcons.html',
  offense: {
    openers: [
      { playId: 'falcons-off-pistol-bunch-te-hb-zone', name: 'HB ZONE', type: 'run', formation: 'Pistol Bunch TE', playbook: OFF, note: 'Count the box: 6 or fewer, hand it' },
      { playId: 'falcons-off-pistol-bunch-te-cross-drag', name: 'CROSS DRAG', type: 'pass', formation: 'Pistol Bunch TE', playbook: OFF, note: 'Drag hits late behind flowing LBs' },
      { playId: 'falcons-off-gun-trips-te-flex-stick', name: 'STICK', type: 'pass', formation: 'Gun Trips TE Flex', playbook: OFF, note: 'Flat taken = zone · trailed = man' },
      { playId: 'falcons-off-gun-bunch-mesh-spot', name: 'MESH SPOT', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Drags win = man · spot sits = zone' },
    ],
    first: [
      { playId: 'falcons-off-pistol-bunch-te-strong-power', name: 'STRONG POWER', type: 'run', formation: 'Pistol Bunch TE', playbook: OFF, note: 'Downhill; same picture as the jet pair' },
      { playId: 'falcons-off-gun-tight-y-off-duo', name: 'DUO', type: 'pass', formation: 'Gun Tight Y Off', playbook: OFF, note: 'Double teams; tempo in off Scissors' },
      { playId: 'falcons-off-gun-bunch-hb-base', name: 'HB BASE', type: 'run', formation: 'Gun Bunch', playbook: OFF, note: 'Run from the money page; no telegraph' },
      { playId: 'falcons-off-pistol-bunch-te-jet-touch-pass', name: 'JET TOUCH PASS', type: 'pass', formation: 'Pistol Bunch TE', playbook: OFF, note: 'Free edge yards; FK HB twin off it' },
      { playId: 'falcons-off-gun-wing-slot-offset-mtn-jet-touch-pass', name: 'MTN JET TOUCH PASS', type: 'pass', formation: 'Gun Wing Slot Offset', playbook: OFF, note: 'Jet page: same motion, three outcomes' },
      { playId: 'falcons-off-gun-wing-slot-offset-mtn-jet-hb-duo', name: 'MTN JET HB DUO', type: 'run', formation: 'Gun Wing Slot Offset', playbook: OFF, note: 'Duo handoff off identical jet motion' },
    ],
    '2short': [
      { playId: 'falcons-off-gun-tight-y-off-0-1-trap', name: '0 1 TRAP', type: 'run', formation: 'Gun Tight Y Off', playbook: OFF, note: 'Fastest 3 yards in the book' },
      { playId: 'falcons-off-singleback-wing-slot-hb-zone-wk', name: 'HB ZONE WK', type: 'run', formation: 'Singleback Wing Slot', playbook: OFF, note: 'Weak zone away from the loaded box' },
      { playId: 'falcons-off-pistol-u-off-trips-pa-y-corner', name: 'PA Y CORNER', type: 'pass', formation: 'Pistol U Off Trips', playbook: OFF, note: 'Free-shot down; eat it if capped' },
    ],
    '2long': [
      { playId: 'falcons-off-gun-bunch-hb-slip-screen', name: 'HB SLIP SCREEN', type: 'run', formation: 'Gun Bunch', playbook: OFF, note: 'Beats blitz AND soft zone; Bijan in space' },
      { playId: 'falcons-off-gun-trips-te-flex-hb-angle', name: 'HB ANGLE', type: 'run', formation: 'Gun Trips TE Flex', playbook: OFF, note: 'Bijan on a LB; option the leverage' },
      { playId: 'falcons-off-gun-bunch-speed-dig', name: 'SPEED DIG', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Dig behind the hooks; back on schedule' },
      { playId: 'falcons-off-gun-trey-y--flex-hb-draw', name: 'HB DRAW', type: 'run', formation: 'Gun Trey Y-Flex', playbook: OFF, note: 'Vs 2-man / soft shells playing sticks' },
    ],
    '3short': [
      { playId: 'falcons-off-gun-trips-te-flex-stick', name: 'STICK', type: 'pass', formation: 'Gun Trips TE Flex', playbook: OFF, note: 'Stick vs zone, flat vs man; ball out' },
      { playId: 'falcons-off-gun-bunch-spacing', name: 'SPACING', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Five windows; one sits at the sticks' },
      { playId: 'falcons-off-pistol-bunch-te-spot-y-option', name: 'SPOT Y OPTION', type: 'run', formation: 'Pistol Bunch TE', playbook: OFF, note: 'Option route reads leverage for you' },
      { playId: 'falcons-off-gun-tight-y-off-cheat-spot-y-quick', name: 'CHEAT SPOT Y QUICK', type: 'pass', formation: 'Gun Tight Y Off', playbook: OFF, note: 'Cheat motion spot; instant throw' },
    ],
    '3med': [
      { playId: 'falcons-off-gun-bunch-mesh-spot', name: 'MESH SPOT', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Best 3rd&5 call: drags man, spot zone' },
      { playId: 'falcons-off-gun-tight-y-off-hb-scissors', name: 'HB SCISSORS', type: 'run', formation: 'Gun Tight Y Off', playbook: OFF, note: 'TE, HB seam, backside in — clean read' },
      { playId: 'falcons-off-gun-bunch-y-curl', name: 'Y CURL', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Curl-flat vs C3; throw at the break' },
      { playId: 'falcons-off-gun-deuce-close-stick-switch', name: 'STICK SWITCH', type: 'pass', formation: 'Gun Deuce Close', playbook: OFF, note: 'Switch-release stick beats press zone' },
    ],
    '3long': [
      { playId: 'falcons-off-gun-trey-y--flex-dagger', name: 'DAGGER', type: 'pass', formation: 'Gun Trey Y-Flex', playbook: OFF, note: 'Seam clears it, dig arrives at 15' },
      { playId: 'falcons-off-gun-bunch-dig-return', name: 'DIG RETURN', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Return settles vs zone at the sticks' },
      { playId: 'falcons-off-gun-y-off-trips-close-y--option-wheel', name: 'Y-OPTION WHEEL', type: 'run', formation: 'Gun Y Off Trips Close', playbook: OFF, note: 'TE option or HB wheel; both convert' },
      { playId: 'falcons-off-gun-bunch-wide-nasty-flood-switch', name: 'FLOOD SWITCH', type: 'pass', formation: 'Gun Bunch Wide Nasty', playbook: OFF, note: 'Nasty-split flood nobody labs' },
    ],
    shots: [
      { playId: 'falcons-off-gun-tight-flex-pa-post-shot', name: 'PA POST SHOT', type: 'pass', formation: 'Gun Tight Flex', playbook: OFF, note: 'Man destroyer; one per half vs C1' },
      { playId: 'falcons-off-singleback-wing-slot-pa-cross-shot', name: 'PA CROSS SHOT', type: 'pass', formation: 'Singleback Wing Slot', playbook: OFF, note: 'Same picture as MTN WIDE ZONE WK' },
      { playId: 'falcons-off-gun-tight-y-off-mtn-pa-spinner', name: 'MTN PA SPINNER', type: 'pass', formation: 'Gun Tight Y Off', playbook: OFF, note: 'Spinner freezes LBs; crosser clean' },
      { playId: 'falcons-off-gun-y-off-trips-close-mtn-empty-hb-sluggo', name: 'MTN EMPTY HB SLUGGO', type: 'run', formation: 'Gun Y Off Trips Close', playbook: OFF, note: 'Bijan sluggo on a LB; take the top' },
    ],
    redzone: [
      { playId: 'falcons-off-gun-bunch-smash-return', name: 'SMASH RETURN', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Hole shot vs C2 · return vs man' },
      { playId: 'falcons-off-gun-tight-y-off-te-corner', name: 'TE CORNER', type: 'pass', formation: 'Gun Tight Y Off', playbook: OFF, note: 'Back-corner ball only the TE gets' },
      { playId: 'falcons-off-gun-tight-flex-double-spot', name: 'DOUBLE SPOT', type: 'pass', formation: 'Gun Tight Flex', playbook: OFF, note: 'Twin triangles; take the vacated LB' },
      { playId: 'falcons-off-gun-y-off-trips-close-mtn-corners', name: 'MTN CORNERS', type: 'pass', formation: 'Gun Y Off Trips Close', playbook: OFF, note: 'Motion corners vs 2-high RZ shells' },
    ],
    goalline: [
      { playId: 'falcons-off-goal-line-normal-qb-sneak', name: 'QB SNEAK', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Under a yard: free yardage' },
      { playId: 'falcons-off-goal-line-normal-power-o', name: 'POWER O', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Follow the puller' },
      { playId: 'falcons-off-goal-line-normal-pa-spot', name: 'PA SPOT', type: 'pass', formation: 'Goal Line', playbook: OFF, note: 'After two pounds; they sell out' },
      { playId: 'falcons-off-pistol-bunch-te-strong-power', name: 'STRONG POWER', type: 'run', formation: 'Pistol Bunch TE', playbook: OFF, note: 'From the 2-3: no heavy telegraph' },
    ],
    twomin: [
      { playId: 'falcons-off-gun-bunch-bench-pivot', name: 'BENCH PIVOT', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Double sideline breakers; clock stops' },
      { playId: 'falcons-off-gun-deuce-close-bench-dig-curl', name: 'BENCH DIG CURL', type: 'pass', formation: 'Gun Deuce Close', playbook: OFF, note: 'Bench for OB; dig if overplayed' },
      { playId: 'falcons-off-gun-bunch-verticals', name: 'VERTICALS', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Chunk or checkdown; tempo repeatable' },
      { playId: 'falcons-off-gun-trey-y--flex-dagger', name: 'DAGGER', type: 'pass', formation: 'Gun Trey Y-Flex', playbook: OFF, note: 'FG-drive window: the dig is catchable' },
    ],
    backedup: [
      { playId: 'falcons-off-pistol-bunch-te-hb-zone', name: 'HB ZONE', type: 'run', formation: 'Pistol Bunch TE', playbook: OFF, note: 'Zero-risk breathing room' },
      { playId: 'falcons-off-gun-trips-te-flex-stick', name: 'STICK', type: 'pass', formation: 'Gun Trips TE Flex', playbook: OFF, note: 'Safest dropback; HB flat vs heat' },
      { playId: 'falcons-off-gun-empty-chips-quads-hb-screen', name: 'HB SCREEN', type: 'run', formation: 'Gun Empty Chips Quads', playbook: OFF, note: 'Chip empty: no free rusher, safe air' },
      { playId: 'falcons-off-singleback-wing-slot-mtn-wide-zone-wk', name: 'MTN WIDE ZONE WK', type: 'pass', formation: 'Singleback Wing Slot', playbook: OFF, note: 'Motion wide zone; flow from danger' },
    ],
  },
  defense: {
    base: [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-cover-3-sky', name: 'COVER 3 SKY', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Blind default: 3-deep, sky run fit' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-tampa-2', name: 'TAMPA 2', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Blind #2 vs crosser / drag diets' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-cover-2-invert', name: 'COVER 2 INVERT', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Blind vs quick outs & flat tempo' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-blitz-loop-3', name: 'BLITZ LOOP 3', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Only blind blitz: 3-deep parachute' },
    ],
    vs10: [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-nickel-sim-2', name: 'NICKEL SIM 2', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Show 6, rush 4, 2-high; punish hots' },
      { playId: 'falcons-def-nickel-2--4-cover-2-match', name: 'COVER 2 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Flats jumped; match caps verts' },
      { playId: 'falcons-def-nickel-2--4-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Verts carried; corners get help' },
    ],
    vs12: [
      { playId: 'falcons-def-nickel-2--4-cover-4-palms', name: 'COVER 4 PALMS', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Safeties trigger the run; PA capped' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-nickel-dog-3-buzz', name: 'NICKEL DOG 3 BUZZ', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Extra box hats, still 3 deep' },
      { playId: 'falcons-def-nickel-2--4-cover-6', name: 'COVER 6', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Squat the bunch/TE side; qtrs away' },
    ],
    heavy: [
      { playId: 'falcons-def-3--4-odd-pinch-buck-o', name: 'PINCH BUCK O', type: 'pass', formation: '3-4 Odd', playbook: DEF, note: 'Pinch + buck heat; run stuffed' },
      { playId: 'falcons-def-3--4-odd-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: '3-4 Odd', playbook: DEF, note: 'Sound vs PA off heavy sets' },
      { playId: 'falcons-def-3--4-odd-cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', formation: '3-4 Odd', playbook: DEF, note: 'Vs 21 PA shots; safeties fit late' },
    ],
    '3short': [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-blitz-loop-3', name: 'BLITZ LOOP 3', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'A-gap loop; heat with a 3-deep net' },
      { playId: 'falcons-def-nickel-2--4-cover-2-match', name: 'COVER 2 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Kills the quick-out conversion' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-cover-2-invert', name: 'COVER 2 INVERT', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Safeties crash flats; sturdy vs toss' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-mid-blitz-0', name: 'MID BLITZ 0', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Seen-look only — never call blind' },
    ],
    '3long': [
      { playId: 'falcons-def-dime-2--3-cover-3-sammie', name: 'COVER 3 SAMMIE', type: 'pass', formation: 'Dime 2-3', playbook: DEF, note: 'Built for 3rd & 8+; rally under' },
      { playId: 'falcons-def-quarter-normal-overload-3', name: 'OVERLOAD 3', type: 'pass', formation: 'Quarter Normal', playbook: DEF, note: 'Overload rush, 3-deep umbrella' },
      { playId: 'falcons-def-nickel-2--4-tampa-2', name: 'TAMPA 2', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Pole runner erases the dig' },
      { playId: 'falcons-def-dime-2--3-field-sim-3', name: 'FIELD SIM 3', type: 'pass', formation: 'Dime 2-3', playbook: DEF, note: 'Sim heat without leaving the shell' },
    ],
    pressure: [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-ss-blitz-3', name: 'SS BLITZ 3', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Best disguised 5-man; 3 behind' },
      { playId: 'falcons-def-nickel-2--4-load-mug-nickel-blitz-3', name: 'NICKEL BLITZ 3', type: 'pass', formation: 'Nickel 2-4 Load Mug', playbook: DEF, note: 'Slot heat; brutal vs weak slide' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-field-sim-3', name: 'FIELD SIM 3', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'QB reads blitz, gets four' },
      { playId: 'falcons-def-3--3--5-penny-slot-blitz-3', name: 'SLOT BLITZ 3', type: 'pass', formation: '3-3-5 Penny', playbook: DEF, note: 'Fresh picture, same 3-deep rules' },
    ],
    redzone: [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-2-invert-hard-flat', name: '2 INVERT HARD FLAT', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Corners squat; no fade islands' },
      { playId: 'falcons-def-nickel-2--4-load-dbl-mug-redzone-dt-drop', name: 'REDZONE DT DROP', type: 'pass', formation: 'Nickel 2-4 Load Dbl Mug', playbook: DEF, note: 'DT sits the low hole vs crossers' },
      { playId: 'falcons-def-nickel-2--4-cover-2-match', name: 'COVER 2 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Flats jumped at the goal line' },
    ],
    goalline: [
      { playId: 'falcons-def-goal-line-6--2-60-pinch', name: '60 PINCH', type: 'pass', formation: 'Goal Line 6-2', playbook: DEF, note: 'Everyone inside; sneak/push dead' },
      { playId: 'falcons-def-goal-line-6--2-guts', name: 'GUTS', type: 'pass', formation: 'Goal Line 6-2', playbook: DEF, note: 'Holds up if they throw it' },
    ],
    prevent: [
      { playId: 'falcons-def-prevent-3-deep-prevent', name: 'PREVENT', type: 'pass', formation: 'Prevent 3 Deep', playbook: DEF, note: 'Up big: boundary + clock' },
      { playId: 'falcons-def-dime-2--3-cover-3-buzz-match', name: 'COVER 3 BUZZ MATCH', type: 'pass', formation: 'Dime 2-3', playbook: DEF, note: 'Rally & tackle; nothing over top' },
    ],
  },
}
