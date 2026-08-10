// Falcons (Madden 27) offense + defense — rebuilt 2026-08-07 around the
// REAL 2026 Falcons: Kevin Stefanski / Tommy Rees wide-zone identity and the
// M27 roster, not the underdog clock-bleed doctrine. Refreshed 2026-08-10:
// still pre-TU1 (worldwide launch Aug 13 — NO patches have shipped), so this
// was a lab-intel enrichment, not a rebuild: folded in the early meta
// consensus (return routes, Gun Tight Flex page, HB Scissors) from
// Civil.GG / MaddenProdigy / MaddenTurf. Refresh again after the first real
// title update (expected in the Aug 13+ launch window). Every playId
// validated against public/data/playbooks.json (version 27) by
// gameplans.test.js.
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
// - Defense v3 (2026-08-10, Kenny's doctrine — replaces the Dbl-Mug home):
//   personnel-first 3-4. Base = TWO homes, Kenny-curated 8/10: 3-4 Under
//   4 Tech (SAW 1 / 2 INVERT HARD FLAT / C6 / C1 HOLE) + plain Nickel 2-4
//   (1 DBL WR1 / PALMS / SAMMIE / C3 MATCH); vs10 = Nickel 2-4 Wide;
//   passing downs = SINGLE Mug (spread DEs, stunts without a coverage tell)
//   + Dime 3-2 Rush; Dbl Mug survives only as labeled changeup looks.
//   Athleticism over AI awareness: speed subs, Ebukam run downs only.
//   Bates IS the user. Tempo audibles = the 3-4 Odd base menu.

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
      { playId: 'falcons-off-gun-tight-y-off-hb-scissors', name: 'HB SCISSORS', type: 'run', formation: 'Gun Tight Y Off', playbook: OFF, note: 'Easiest just-snap-it play in the book' },
      { playId: 'falcons-off-singleback-wing-tight-z-drive', name: 'DRIVE', type: 'pass', formation: 'Singleback Wing Tight Z', playbook: OFF, note: 'Layered crossers; shallow + YAC' },
    ],
    '3short': [
      { playId: 'falcons-off-singleback-wing-tight-y-stick', name: 'Y STICK', type: 'pass', formation: 'Singleback Wing Tight', playbook: OFF, note: 'Stick off the run picture; ball out' },
      { playId: 'falcons-off-gun-bunch-spacing', name: 'SPACING', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Five windows; one at the sticks' },
      { playId: 'falcons-off-singleback-y-trips-close-mesh', name: 'MESH', type: 'pass', formation: 'Singleback Y Trips Close', playbook: OFF, note: 'Man answer: rubs, London option late' },
      { playId: 'falcons-off-gun-tight-y-off-choice-pivot-return', name: 'CHOICE PIVOT RETURN', type: 'pass', formation: 'Gun Tight Y Off', playbook: OFF, note: 'Return settles at sticks; man or zone' },
    ],
    '3med': [
      { playId: 'falcons-off-gun-bunch-mesh-spot', name: 'MESH SPOT', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Drags man, spot zone' },
      { playId: 'falcons-off-singleback-wing-tight-z-curl-flat-seam', name: 'CURL FLAT SEAM', type: 'pass', formation: 'Singleback Wing Tight Z', playbook: OFF, note: 'Rhythm triangle; Pitts seam alert' },
      { playId: 'falcons-off-singleback-wing-tight-stick-nod-vertical', name: 'STICK NOD VERTICAL', type: 'pass', formation: 'Singleback Wing Tight', playbook: OFF, note: 'After sticks all day: nod goes top' },
      { playId: 'falcons-off-gun-tight-flex-inside-hi-lo', name: 'INSIDE HI LO', type: 'pass', formation: 'Gun Tight Flex', playbook: OFF, note: 'Hi-lo the hook LB; easy sticks read' },
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
      { playId: 'falcons-off-gun-tight-flex-pa-post-shot', name: 'PA POST SHOT', type: 'pass', formation: 'Gun Tight Flex', playbook: OFF, note: 'Lab-consensus man destroyer; the post' },
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
      { playId: 'falcons-def-3--4-under-4-tech-saw-blitz-1', name: 'SAW BLITZ 1', type: 'pass', formation: '3-4 Under 4 Tech', playbook: DEF, note: 'Menu heat: saw edges, man-free behind' },
      { playId: 'falcons-def-3--4-under-4-tech-2-invert-hard-flat', name: '2 INVERT HARD FLAT', type: 'pass', formation: '3-4 Under 4 Tech', playbook: DEF, note: 'Inverted 2 that spins to a C3 look' },
      { playId: 'falcons-def-3--4-under-4-tech-cover-6', name: 'COVER 6', type: 'pass', formation: '3-4 Under 4 Tech', playbook: DEF, note: 'Qtr-qtr-half; roll to their field side' },
      { playId: 'falcons-def-3--4-under-4-tech-cover-1-hole', name: 'COVER 1 HOLE', type: 'pass', formation: '3-4 Under 4 Tech', playbook: DEF, note: 'Man; hole sits the middle, user free' },
      { playId: 'falcons-def-nickel-2--4-1-double-wr1', name: '1 DOUBLE WR1', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Nickel home: erase the alpha, user free' },
      { playId: 'falcons-def-nickel-2--4-cover-4-palms', name: 'COVER 4 PALMS', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'The panic call; squats the quick out' },
      { playId: 'falcons-def-nickel-2--4-covers-sammie', name: 'COVERS SAMMIE', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'C9 look with man under; crossers chased' },
      { playId: 'falcons-def-nickel-2--4-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Blind-safe; verts carried, Bates post' },
    ],
    vs10: [
      { playId: 'falcons-def-nickel-2--4-wide-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: 'Nickel 2-4 Wide', playbook: DEF, note: 'Wide DEs = your tweeners in space' },
      { playId: 'falcons-def-nickel-2--4-wide-cover-4-palms', name: 'COVER 4 PALMS', type: 'pass', formation: 'Nickel 2-4 Wide', playbook: DEF, note: 'Your panic call; squats the quick out' },
      { playId: 'falcons-def-nickel-2--4-wide-cover-1-robber-press', name: 'COVER 1 ROBBER PRESS', type: 'pass', formation: 'Nickel 2-4 Wide', playbook: DEF, note: 'Terrell presses; Bates robs the dig' },
      { playId: 'falcons-def-nickel-2--4-wide-nickel-blitz-3', name: 'NICKEL BLITZ 3', type: 'pass', formation: 'Nickel 2-4 Wide', playbook: DEF, note: 'Slot heat with the 3-deep parachute' },
    ],
    vs12: [
      { playId: 'falcons-def-3--4-over-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: '3-4 Over', playbook: DEF, note: 'Strength-shifted; sound vs PA' },
      { playId: 'falcons-def-3--4-over-cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', formation: '3-4 Over', playbook: DEF, note: 'The split-field partner call' },
      { playId: 'falcons-def-3--4-over-ss-2-trap', name: 'SS 2 TRAP', type: 'pass', formation: '3-4 Over', playbook: DEF, note: 'Trap the force; kills flat + toss' },
    ],
    heavy: [
      { playId: 'falcons-def-3--4-odd-pinch-buck-o', name: 'PINCH BUCK O', type: 'pass', formation: '3-4 Odd', playbook: DEF, note: 'Pinch + buck heat; run stuffed' },
      { playId: 'falcons-def-3--4-cub-sting-pinch', name: 'STING PINCH', type: 'pass', formation: '3-4 Cub', playbook: DEF, note: 'Cub heavy front; gaps stung' },
      { playId: 'falcons-def-3--4-odd-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: '3-4 Odd', playbook: DEF, note: 'Sound vs PA off heavy sets' },
    ],
    '3short': [
      { playId: 'falcons-def-3--4-under-4-tech-2-invert-hard-flat', name: '2 INVERT HARD FLAT', type: 'pass', formation: '3-4 Under 4 Tech', playbook: DEF, note: 'Safeties crash flats; sturdy vs toss' },
      { playId: 'falcons-def-3--4-under-4-tech-pinch-buck-o', name: 'PINCH BUCK O', type: 'pass', formation: '3-4 Under 4 Tech', playbook: DEF, note: 'Inside run dead; 4-tech anchors' },
      { playId: 'falcons-def-nickel-2--4-single-mug-cover-1-hole', name: 'COVER 1 HOLE', type: 'pass', formation: 'Nickel 2-4 Single Mug', playbook: DEF, note: 'Man sticks coverage; hole robs in' },
      { playId: 'falcons-def-nickel-2--4-single-mug-dt-mike-loop-3', name: 'DT MIKE LOOP 3', type: 'pass', formation: 'Nickel 2-4 Single Mug', playbook: DEF, note: 'Stunt, no coverage tell; 3-deep net' },
    ],
    '3long': [
      { playId: 'falcons-def-nickel-2--4-single-mug-blitz-tex-3-sim-3', name: 'BLITZ TEX 3 SIM 3', type: 'pass', formation: 'Nickel 2-4 Single Mug', playbook: DEF, note: 'Tex stunt sim; DEs spread, 3 deep' },
      { playId: 'falcons-def-dime-2--3-1-double-wr1', name: '1 DOUBLE WR1', type: 'pass', formation: 'Dime 2-3', playbook: DEF, note: 'Your staple: erase the alpha, user free' },
      { playId: 'falcons-def-dime-3--2-rush-mug-sim-pressure', name: 'MUG SIM PRESSURE', type: 'pass', formation: 'Dime 3-2 Rush', playbook: DEF, note: 'Show 6 from dime, rush 4' },
      { playId: 'falcons-def-quarter-normal-3-double-mable', name: '3 DOUBLE MABLE', type: 'pass', formation: 'Quarter Normal', playbook: DEF, note: 'Mable quarters: flats walled, dbl deep' },
      { playId: 'falcons-def-quarter-normal-3-dbl-mable-cloud', name: '3 DBL MABLE CLOUD', type: 'pass', formation: 'Quarter Normal', playbook: DEF, note: 'Mable + cloud corner; sideline dead' },
    ],
    pressure: [
      { playId: 'falcons-def-nickel-2--4-dbl-mug-ss-blitz-3', name: 'SS BLITZ 3', type: 'pass', formation: 'Nickel 2-4 Dbl Mug', playbook: DEF, note: 'Dbl Mug changeup — show it sparingly' },
      { playId: 'falcons-def-nickel-2--4-load-mug-nickel-blitz-3', name: 'NICKEL BLITZ 3', type: 'pass', formation: 'Nickel 2-4 Load Mug', playbook: DEF, note: 'Slot heat; brutal vs weak slide' },
      { playId: 'falcons-def-2--4--5-over-wide-free-fire-3', name: 'FREE FIRE 3', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Wide-9 speed: Pearce + Walker fly' },
      { playId: 'falcons-def-3--3--5-penny-slot-blitz-3', name: 'SLOT BLITZ 3', type: 'pass', formation: '3-3-5 Penny', playbook: DEF, note: 'Fresh picture, same 3-deep rules' },
    ],
    redzone: [
      { playId: 'falcons-def-3--4-over-2-invert-hard-flat', name: '2 INVERT HARD FLAT', type: 'pass', formation: '3-4 Over', playbook: DEF, note: 'Corners squat; no fade islands' },
      { playId: 'falcons-def-nickel-2--4-1-double-wr1', name: '1 DOUBLE WR1', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Bracket their fade guy; user free' },
      { playId: 'falcons-def-nickel-2--4-load-dbl-mug-redzone-dt-drop', name: 'REDZONE DT DROP', type: 'pass', formation: 'Nickel 2-4 Load Dbl Mug', playbook: DEF, note: 'Dbl Mug changeup; DT sits low hole' },
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
