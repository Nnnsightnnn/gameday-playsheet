// Falcons (Madden 27) offense + defense — rebuilt 2026-08-07 around the
// REAL 2026 Falcons: Kevin Stefanski / Tommy Rees wide-zone identity and the
// M27 roster, not the underdog clock-bleed doctrine. Pre-TU1 (early access
// Aug 6); refresh after first patch. Every playId validated against
// public/data/playbooks.json (version 27) by gameplans.test.js.
//
// Doctrine (see docs/falcons-gameplan.md):
// - IDENTITY BALL: impose wide zone (Bijan 95 behind Lindstrom 96 RBK) until
//   they overcommit, then manufacture explosives off the same run action —
//   boots, drag-wheel, deep overs, Pitts (90 spd) seams.
// - Offense home: Singleback Wing Tight (the whole stretch/duo/boot series
//   in one picture). Y Trips Close = jet dressing (Branch 95 spd).
//   I Form Close = 21-personnel shots. Gun Bunch = 3rd-down money page.
// - QB modes: Penix 92 THP / 76 DAC → DRIVEN throws (seams, digs, overs),
//   no moonballs. London (97 CTH/JMP) is the one exception: 1-on-1, throw it.
// - Defense = Ulbrich: boring on purpose early (C3/quarters binary), violent
//   on 3rd (mug sims, robber press: Terrell 95 PRS presses, Bates 94 robs).
//   Bates IS the user. Tempo block unchanged — blind-safe Dbl Mug audibles.

const OFF = 'Falcons'
const DEF = 'Falcons'

export const FALCONS_PLAN = {
  game: 'madden',
  name: 'Falcons · Madden 27',
  guide: 'gameplan-falcons.html',
  offense: {
    openers: [
      { playId: 'falcons-off-singleback-wing-tight-hb-stretch', name: 'HB STRETCH', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'Wide zone right: Bijan behind Lindstrom' },
      { playId: 'falcons-off-singleback-wing-tight-hb-duo', name: 'HB DUO', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'Body blow; watch which LB fills' },
      { playId: 'falcons-off-singleback-wing-tight-pa-boot-flood', name: 'PA BOOT FLOOD', type: 'pass', formation: 'Singleback Wing Tight', playbook: OFF, note: 'Off the stretch; 3 levels, take the flat' },
      { playId: 'falcons-off-gun-trips-te-flex-stick', name: 'STICK', type: 'pass', formation: 'Gun Trips TE Flex', playbook: OFF, note: 'Rhythm check: flat taken = zone' },
    ],
    first: [
      { playId: 'falcons-off-singleback-wing-tight-hb-stretch', name: 'HB STRETCH', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'The identity; run till they overcommit' },
      { playId: 'falcons-off-singleback-wing-tight-hb-zone-wk', name: 'HB ZONE WK', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'Same picture, opposite track' },
      { playId: 'falcons-off-singleback-y-trips-close-mtn-jet-wide-zone', name: 'MTN JET WIDE ZONE', type: 'pass', formation: 'Singleback Y Trips Close', playbook: OFF, note: 'Jet motion widens the edge for Bijan' },
      { playId: 'falcons-off-singleback-y-trips-close-jet-6-soar', name: 'JET 6 SOAR', type: 'pass', formation: 'Singleback Y Trips Close', playbook: OFF, note: 'Branch 95 speed around the corner' },
      { playId: 'falcons-off-singleback-wing-pair-pa-te-seam', name: 'PA TE SEAM', type: 'pass', formation: 'Singleback Wing Pair', playbook: OFF, note: 'Pitts 90 spd vs LB: drive the seam' },
    ],
    '2short': [
      { playId: 'falcons-off-singleback-wing-tight-hb-duo', name: 'HB DUO', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'Duo moves the pile; sticks first' },
      { playId: 'falcons-off-i-form-close-hb-iso', name: 'HB ISO', type: 'run', formation: 'I Form Close', playbook: OFF, note: '21-personnel hammer downhill' },
      { playId: 'falcons-off-singleback-wing-tight-fake-hb-zone-qb-boot', name: 'FAKE HB ZONE QB BOOT', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'They sell out on zone → walk-in boot' },
    ],
    '2long': [
      { playId: 'falcons-off-gun-bunch-hb-slip-screen', name: 'HB SLIP SCREEN', type: 'run', formation: 'Gun Bunch', playbook: OFF, note: 'Bijan in space; 97 juke does the rest' },
      { playId: 'falcons-off-singleback-wing-tight-z-pa-y--drag-wheel', name: 'PA Y-DRAG WHEEL', type: 'pass', formation: 'Singleback Wing Tight Z', playbook: OFF, note: 'Stefanski staple: wheel sneaks out' },
      { playId: 'falcons-off-gun-trips-te-flex-hb-angle', name: 'HB ANGLE', type: 'run', formation: 'Gun Trips TE Flex', playbook: OFF, note: 'Bijan on a LB; option the leverage' },
      { playId: 'falcons-off-singleback-wing-tight-z-drive', name: 'DRIVE', type: 'pass', formation: 'Singleback Wing Tight Z', playbook: OFF, note: 'Layered crossers; shallow + YAC' },
    ],
    '3short': [
      { playId: 'falcons-off-singleback-wing-tight-y-stick', name: 'Y STICK', type: 'pass', formation: 'Singleback Wing Tight', playbook: OFF, note: 'Stick off the run picture; ball out' },
      { playId: 'falcons-off-gun-bunch-spacing', name: 'SPACING', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Five windows; one at the sticks' },
      { playId: 'falcons-off-singleback-y-trips-close-mesh', name: 'MESH', type: 'pass', formation: 'Singleback Y Trips Close', playbook: OFF, note: 'Man answer: rubs, London option late' },
    ],
    '3med': [
      { playId: 'falcons-off-gun-bunch-mesh-spot', name: 'MESH SPOT', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Drags man, spot zone' },
      { playId: 'falcons-off-singleback-wing-tight-z-curl-flat-seam', name: 'CURL FLAT SEAM', type: 'pass', formation: 'Singleback Wing Tight Z', playbook: OFF, note: 'Rhythm triangle; Pitts seam alert' },
      { playId: 'falcons-off-singleback-wing-tight-stick-nod-vertical', name: 'STICK NOD VERTICAL', type: 'pass', formation: 'Singleback Wing Tight', playbook: OFF, note: 'After sticks all day: nod goes top' },
      { playId: 'falcons-off-gun-bunch-y-curl', name: 'Y CURL', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Curl-flat vs C3; throw the break' },
    ],
    '3long': [
      { playId: 'falcons-off-gun-trey-y--flex-dagger', name: 'DAGGER', type: 'pass', formation: 'Gun Trey Y-Flex', playbook: OFF, note: 'Seam clears, dig at 15; drive it' },
      { playId: 'falcons-off-gun-bunch-dig-return', name: 'DIG RETURN', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Return settles vs zone at sticks' },
      { playId: 'falcons-off-gun-trey-y--flex-cross-flood', name: 'CROSS FLOOD', type: 'pass', formation: 'Gun Trey Y-Flex', playbook: OFF, note: 'Three-level flood; sail at sticks' },
      { playId: 'falcons-off-gun-y-off-trips-close-y--option-wheel', name: 'Y-OPTION WHEEL', type: 'run', formation: 'Gun Y Off Trips Close', playbook: OFF, note: 'TE option or HB wheel; both convert' },
    ],
    shots: [
      { playId: 'falcons-off-i-form-close-pa-deep-cross-go', name: 'PA DEEP CROSS GO', type: 'pass', formation: 'I Form Close', playbook: OFF, note: '21-pers shot: go clears, cross behind' },
      { playId: 'falcons-off-gun-deuce-close-pa-deep-over', name: 'PA DEEP OVER', type: 'pass', formation: 'Gun Deuce Close', playbook: OFF, note: 'Deep over off zone action; drive it' },
      { playId: 'falcons-off-singleback-wing-slot-pa-cross-shot', name: 'PA CROSS SHOT', type: 'pass', formation: 'Singleback Wing Slot', playbook: OFF, note: 'Same picture as the wide zone' },
      { playId: 'falcons-off-singleback-wing-slot-four-verticals', name: 'FOUR VERTICALS', type: 'pass', formation: 'Singleback Wing Slot', playbook: OFF, note: 'London wins the outside vert 1-on-1' },
    ],
    redzone: [
      { playId: 'falcons-off-gun-bunch-smash-return', name: 'SMASH RETURN', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Hole shot vs C2 · return vs man' },
      { playId: 'falcons-off-gun-tight-y-off-te-corner', name: 'TE CORNER', type: 'pass', formation: 'Gun Tight Y Off', playbook: OFF, note: 'Pitts corner; only he gets it' },
      { playId: 'falcons-off-i-form-y-off-close-pa-pylon-sail', name: 'PA PYLON SAIL', type: 'pass', formation: 'I Form Y Off Close', playbook: OFF, note: 'Pylon sail; London to the corner' },
      { playId: 'falcons-off-gun-y-off-trips-close-mtn-corners', name: 'MTN CORNERS', type: 'pass', formation: 'Gun Y Off Trips Close', playbook: OFF, note: 'Motion corners vs 2-high RZ shells' },
    ],
    goalline: [
      { playId: 'falcons-off-goal-line-normal-qb-sneak', name: 'QB SNEAK', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Under a yard: free yardage' },
      { playId: 'falcons-off-goal-line-normal-power-o', name: 'POWER O', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Follow the puller' },
      { playId: 'falcons-off-goal-line-normal-pa-waggle', name: 'PA WAGGLE', type: 'pass', formation: 'Goal Line', playbook: OFF, note: 'Keeper after two pounds inside' },
      { playId: 'falcons-off-goal-line-normal-strong-toss', name: 'STRONG TOSS', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Edge vs a pinched 6-2' },
    ],
    twomin: [
      { playId: 'falcons-off-gun-bunch-bench-pivot', name: 'BENCH PIVOT', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Double sideline breakers; clock stops' },
      { playId: 'falcons-off-gun-deuce-close-bench-dig-curl', name: 'BENCH DIG CURL', type: 'pass', formation: 'Gun Deuce Close', playbook: OFF, note: 'Bench for OB; dig if overplayed' },
      { playId: 'falcons-off-gun-bunch-verticals', name: 'VERTICALS', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Chunk or checkdown; repeatable' },
      { playId: 'falcons-off-gun-trey-y--flex-dagger', name: 'DAGGER', type: 'pass', formation: 'Gun Trey Y-Flex', playbook: OFF, note: 'FG-drive window: the dig is catchable' },
    ],
    backedup: [
      { playId: 'falcons-off-singleback-wing-tight-hb-stretch', name: 'HB STRETCH', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'Run out of the shadow' },
      { playId: 'falcons-off-singleback-wing-tight-y-stick', name: 'Y STICK', type: 'pass', formation: 'Singleback Wing Tight', playbook: OFF, note: 'Safe rhythm throw' },
      { playId: 'falcons-off-singleback-wing-tight-pa-boot-slide', name: 'PA BOOT SLIDE', type: 'pass', formation: 'Singleback Wing Tight', playbook: OFF, note: 'Boot away from the rush; flat free' },
      { playId: 'falcons-off-gun-empty-chips-quads-hb-screen', name: 'HB SCREEN', type: 'run', formation: 'Gun Empty Chips Quads', playbook: OFF, note: 'Chip empty; no free rusher' },
    ],
  },
  defense: {
    base: [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-cover-3-sky', name: 'COVER 3 SKY', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Blind default; Bates owns the post' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-cover-3-seam', name: 'COVER 3 SEAM', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Seams carried; same C3 rules' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-tampa-2', name: 'TAMPA 2', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Crosser eraser; Bates poles it' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-blitz-loop-3', name: 'BLITZ LOOP 3', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Only blind blitz: 3-deep parachute' },
    ],
    vs10: [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-nickel-sim-2', name: 'NICKEL SIM 2', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Show 6, rush 4, 2-high; punish hots' },
      { playId: 'falcons-def-nickel-2--4-cover-2-match', name: 'COVER 2 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Flats jumped; match caps verts' },
      { playId: 'falcons-def-nickel-2--4-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Verts carried; corners get help' },
    ],
    vs12: [
      { playId: 'falcons-def-3--4-odd-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: '3-4 Odd', playbook: DEF, note: 'Ulbrich early-down anchor' },
      { playId: 'falcons-def-3--4-odd-cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', formation: '3-4 Odd', playbook: DEF, note: 'The split-field partner call' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-nickel-dog-3-buzz', name: 'NICKEL DOG 3 BUZZ', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Extra box hats, still 3 deep' },
    ],
    heavy: [
      { playId: 'falcons-def-3--4-odd-pinch-buck-o', name: 'PINCH BUCK O', type: 'pass', formation: '3-4 Odd', playbook: DEF, note: 'Pinch + buck heat; run stuffed' },
      { playId: 'falcons-def-3--4-cub-sting-pinch', name: 'STING PINCH', type: 'pass', formation: '3-4 Cub', playbook: DEF, note: 'Cub heavy front; gaps stung' },
      { playId: 'falcons-def-3--4-odd-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: '3-4 Odd', playbook: DEF, note: 'Sound vs PA off heavy sets' },
    ],
    '3short': [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-blitz-loop-3', name: 'BLITZ LOOP 3', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'A-gap loop; heat with a 3-deep net' },
      { playId: 'falcons-def-nickel-2--4-cover-2-match', name: 'COVER 2 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Kills the quick-out conversion' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-cover-2-invert', name: 'COVER 2 INVERT', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Safeties crash flats; sturdy vs toss' },
      { playId: 'falcons-def-nickel-2--4-dbl-mug-mid-blitz-0', name: 'MID BLITZ 0', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Seen-look only — never call blind' },
    ],
    '3long': [
      { playId: 'falcons-def-dime-3--2-rush-mug-sim-pressure', name: 'MUG SIM PRESSURE', type: 'pass', formation: 'Dime 3-2 Rush', playbook: DEF, note: 'Show 6 from dime, rush 4' },
      { playId: 'falcons-def-dime-3--2-rush-cover-1-robber-press', name: 'COVER 1 ROBBER PRESS', type: 'pass', formation: 'Dime 3-2 Rush', playbook: DEF, note: 'Terrell presses; Bates robs the dig' },
      { playId: 'falcons-def-dime-2--3-cover-3-sammie', name: 'COVER 3 SAMMIE', type: 'pass', formation: 'Dime 2-3', playbook: DEF, note: 'Built for 3rd & 8+; rally under' },
      { playId: 'falcons-def-quarter-normal-overload-3', name: 'OVERLOAD 3', type: 'pass', formation: 'Quarter Normal', playbook: DEF, note: 'Overload rush, 3-deep umbrella' },
    ],
    pressure: [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-ss-blitz-3', name: 'SS BLITZ 3', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Best disguised 5-man; 3 behind' },
      { playId: 'falcons-def-nickel-2--4-load-mug-nickel-blitz-3', name: 'NICKEL BLITZ 3', type: 'pass', formation: 'Nickel 2-4 Load Mug', playbook: DEF, note: 'Slot heat; brutal vs weak slide' },
      { playId: 'falcons-def-2--4--5-over-wide-free-fire-3', name: 'FREE FIRE 3', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Wide-9 speed: Pearce + Walker fly' },
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
