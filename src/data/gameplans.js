// Curated game plans — loadable onto the laminated sheet.
// Ole Miss (CFB 27) offense + defense, built from the Aug 2026 online H2H
// meta. Every playId is validated against public/data/playbooks-cfb27.json
// by src/data/__tests__/gameplans.test.js.
// 2026-08-04: defense rebuilt around PLAIN 4-2-5 — Ole Miss's stock book in
// regs — so no pregame playbook switch is needed. Home package is now
// Nickel 3-3 Mint (same 3-down nickel geometry the old Cub home had).
// 2026-08-04 (v2): counter-look pass. The sheet was 100% gun spread, so
// opponents were keying short yardage (and everything else). Added a second
// identity — I-Form Heavy / Pistol / Strong Wing / jet-motion pictures —
// threaded through first, 2short, 2long, 3short, shots, redzone, goalline,
// backedup. Adjustments arsenal added to the guide (post-TU 2.5).
//
// Doctrine (see docs/olemiss-gameplan.md):
// - Underdog ball: shorten the game, bleed clock, take the checkdown.
// - Offense lives in 4 formations; Wide Y Off Trips Stack is the identity.
// - Defense lives in ONE package (Nickel 3-3 Mint) so hurry-up can't rush
//   you. Base / Tempo block = the four blind-safe calls. Audible, don't browse.

import { IOWA_PLAN } from './gameplans-iowa'

const OFF = 'Ole Miss'
const DEF = '4-2-5'

export const OLE_MISS_PLAN = {
  game: 'cfb',
  name: 'Ole Miss · CFB 27',
  guide: 'gameplan-olemiss.html',
  offense: {
    openers: [
      { playId: 'cfb27:ole-miss-off:gun-wide-trips:rpo-alert-bubble-stick', name: 'RPO ALERT BUBBLE STICK', type: 'run', formation: 'Wide Trips', playbook: OFF, note: 'Overhang crashes → throw; widens → give' },
      { playId: 'cfb27:ole-miss-off:gun-tight-open:mesh-spot', name: 'MESH SPOT', type: 'pass', formation: 'Tight Open', playbook: OFF, note: 'Drags win = man · spot sits = zone' },
      { playId: 'cfb27:ole-miss-off:gun-wing-trips-wk:mtn-verticals', name: 'MTN VERTICALS', type: 'pass', formation: 'Wing Trips Wk', playbook: OFF, note: 'Motion IDs man/zone; test the safeties' },
      { playId: 'cfb27:ole-miss-off:gun-wide-y-off-trips-stack:hb-direct-snap', name: 'HB DIRECT SNAP', type: 'run', formation: 'Wide Y Off Trips Stack', playbook: OFF, note: 'Your exclusive set; RS flips direction' },
    ],
    first: [
      { playId: 'cfb27:ole-miss-off:gun-wide-y-off-trips-stack:rpo-duo-glance', name: 'RPO DUO GLANCE', type: 'run', formation: 'Wide Y Off Trips Stack', playbook: OFF, note: 'Box safety steps down → glance post' },
      { playId: 'cfb27:ole-miss-off:gun-wide-trips:pa-slot-choice', name: 'PA SLOT CHOICE', type: 'pass', formation: 'Wide Trips', playbook: OFF, note: 'Choice route wins vs man AND zone' },
      { playId: 'cfb27:ole-miss-off:gun-wide-y-off-trips-stack:y-cross', name: 'Y CROSS', type: 'pass', formation: 'Wide Y Off Trips Stack', playbook: OFF, note: 'Peek TE quick, crosser late' },
      { playId: 'cfb27:ole-miss-off:gun-wide:read-option', name: 'READ OPTION', type: 'run', formation: 'Wide', playbook: OFF, note: 'Keeps the end honest all game' },
      { playId: 'cfb27:ole-miss-off:pistol-strong-slot:zone-fake-jet', name: 'ZONE FAKE JET', type: 'pass', formation: 'Pistol Strong Slot', playbook: OFF, note: 'Jet eye candy; hits behind the chase' },
      { playId: 'cfb27:ole-miss-off:pistol-full-house-strong-over:hb-stretch', name: 'HB STRETCH', type: 'run', formation: 'Pistol Full House', playbook: OFF, note: 'Full house wide track; beats pinched box' },
    ],
    '2short': [
      { playId: 'cfb27:ole-miss-off:gun-y-off-trips:pa-zone-shot', name: 'PA ZONE SHOT', type: 'pass', formation: 'Y Off Trips', playbook: OFF, note: 'Free-shot down: take the top off' },
      { playId: 'cfb27:ole-miss-off:gun-wide-y-off-trips-stack:0-1-trap', name: '0 1 TRAP', type: 'run', formation: 'Wide Y Off Trips Stack', playbook: OFF, note: 'Fast interior hit vs light box' },
      { playId: 'cfb27:ole-miss-off:gun-wide-stack:fk-screen-go', name: 'FK SCREEN GO', type: 'pass', formation: 'Wide Stack', playbook: OFF, note: 'After showing screens; kills squatters' },
      { playId: 'cfb27:ole-miss-off:gun-tight-open:speed-option', name: 'SPEED OPTION', type: 'run', formation: 'Tight Open', playbook: OFF, note: 'Edge stress; floor is 2-3 yds' },
      { playId: 'cfb27:ole-miss-off:strong-wing:hb-toss', name: 'HB TOSS', type: 'run', formation: 'Strong Wing', playbook: OFF, note: 'Wing seals edge; #1 vs mugged A-gaps' },
      { playId: 'cfb27:ole-miss-off:pistol-full-house-strong-over:hb-duo', name: 'HB DUO', type: 'run', formation: 'Pistol Full House', playbook: OFF, note: 'Double teams; lean on a stacked box' },
    ],
    '2long': [
      { playId: 'cfb27:ole-miss-off:gun-wide-trips-hb-wk:levels', name: 'LEVELS', type: 'pass', formation: 'Wide Trips HB Wk', playbook: OFF, note: 'Dig ladder vs zone; shallow hot vs blitz' },
      { playId: 'cfb27:ole-miss-off:gun-tight-open:hb-slip-screen', name: 'HB SLIP SCREEN', type: 'run', formation: 'Tight Open', playbook: OFF, note: 'Answer to the pass-rush tee-off' },
      { playId: 'cfb27:ole-miss-off:gun-wide-trips-hb-wk:air-raid-under', name: 'AIR RAID UNDER', type: 'pass', formation: 'Wide Trips HB Wk', playbook: OFF, note: 'Drag-to-dig read; safe chunk' },
      { playId: 'cfb27:ole-miss-off:gun-wide-trips:hb-mid-draw', name: 'HB MID DRAW', type: 'run', formation: 'Wide Trips', playbook: OFF, note: 'Vs 2-high shells playing the sticks' },
      { playId: 'cfb27:ole-miss-off:pistol-strong-slot:jet-touch-pass', name: 'JET TOUCH PASS', type: 'pass', formation: 'Pistol Strong Slot', playbook: OFF, note: 'Jet flip; free yards while edge stays honest' },
    ],
    '3short': [
      { playId: 'cfb27:ole-miss-off:gun-tight-open:stick', name: 'STICK', type: 'pass', formation: 'Tight Open', playbook: OFF, note: 'Flat-stick high-low on the overhang' },
      { playId: 'cfb27:ole-miss-off:gun-y-off-trips:rpo-alert-shock', name: 'RPO ALERT SHOCK', type: 'run', formation: 'Y Off Trips', playbook: OFF, note: 'Either answer converts' },
      { playId: 'cfb27:ole-miss-off:gun-wide-trips:power-read', name: 'POWER READ', type: 'run', formation: 'Wide Trips', playbook: OFF, note: 'End crashes → QB keep for the sticks' },
      { playId: 'cfb27:ole-miss-off:gun-wide-trips:triple-slant', name: 'TRIPLE SLANT', type: 'pass', formation: 'Wide Trips', playbook: OFF, note: 'Vs off coverage: pitch and catch' },
      { playId: 'cfb27:ole-miss-off:i-form-heavy:te-tight-power-o', name: 'TE TIGHT POWER O', type: 'run', formation: 'I Form Heavy', playbook: OFF, note: 'Bully ball if nickel stays on the field' },
      { playId: 'cfb27:ole-miss-off:i-form-heavy:te-tight-pa-boot', name: 'TE TIGHT PA BOOT', type: 'pass', formation: 'I Form Heavy', playbook: OFF, note: 'Same I-Form picture; boot when front crashes' },
    ],
    '3med': [
      { playId: 'cfb27:ole-miss-off:gun-tight-open:mesh-spot', name: 'MESH SPOT', type: 'pass', formation: 'Tight Open', playbook: OFF, note: 'Best 3rd&5 call: drags man, spot zone' },
      { playId: 'cfb27:ole-miss-off:gun-normal-flex-snug:whips-curls', name: 'WHIPS CURLS', type: 'pass', formation: 'Normal Flex Snug', playbook: OFF, note: 'Whips beat man; curls sit at sticks' },
      { playId: 'cfb27:ole-miss-off:gun-wide-bunch:slot-slant', name: 'SLOT SLANT', type: 'pass', formation: 'Wide Bunch', playbook: OFF, note: 'Bunch traffic frees the slant vs press' },
      { playId: 'cfb27:ole-miss-off:gun-tight-open:dig-z-spot', name: 'DIG Z SPOT', type: 'pass', formation: 'Tight Open', playbook: OFF, note: 'Dig at sticks; spot holds the hook' },
    ],
    '3long': [
      { playId: 'cfb27:ole-miss-off:gun-wide-trips-hb-wk:deep-flood', name: 'DEEP FLOOD', type: 'pass', formation: 'Wide Trips HB Wk', playbook: OFF, note: 'Sail lands at the sticks vs Cover 3' },
      { playId: 'cfb27:ole-miss-off:gun-empty-base-flex:levels-switch', name: 'LEVELS SWITCH', type: 'pass', formation: 'Empty Base Flex', playbook: OFF, note: 'Empty IDs the blitz; switch beats press' },
      { playId: 'cfb27:ole-miss-off:gun-wide-trips:switch-verts', name: 'SWITCH VERTS', type: 'pass', formation: 'Wide Trips', playbook: OFF, note: 'Throw the bender vs 1-high' },
    ],
    shots: [
      { playId: 'cfb27:ole-miss-off:gun-y-off-trips:pa-double-post', name: 'PA DOUBLE POST', type: 'pass', formation: 'Y Off Trips', playbook: OFF, note: 'Posts split the deep safety (1-high killer)' },
      { playId: 'cfb27:ole-miss-off:gun-wide-bunch:fake-screen-verticals', name: 'FAKE SCREEN VERTICALS', type: 'pass', formation: 'Wide Bunch', playbook: OFF, note: 'After feeding them RPO screens' },
      { playId: 'cfb27:ole-miss-off:gun-split-slot-offset:mtn-pa-stutter-go', name: 'MTN PA STUTTER GO', type: 'pass', formation: 'Split Slot Offset', playbook: OFF, note: 'Once a game vs an aggressive user CB' },
      { playId: 'cfb27:ole-miss-off:pistol-u-off-trips:pa-wheel-shot', name: 'PA WHEEL SHOT', type: 'pass', formation: 'Pistol U Off Trips', playbook: OFF, note: 'Wheel sneaks out behind a sold-out box' },
    ],
    redzone: [
      { playId: 'cfb27:ole-miss-off:gun-empty-base-flex:redzone-up', name: 'REDZONE UP', type: 'pass', formation: 'Empty Base Flex', playbook: OFF, note: 'Quick-breaking EZ routes from empty' },
      { playId: 'cfb27:ole-miss-off:gun-wide-trips-hb-wk:rz-dusty', name: 'RZ DUSTY', type: 'pass', formation: 'Wide Trips HB Wk', playbook: OFF, note: 'Purpose-built red-zone rub' },
      { playId: 'cfb27:ole-miss-off:gun-tight-open:mtn-mesh-spot', name: 'MTN MESH SPOT', type: 'pass', formation: 'Tight Open', playbook: OFF, note: 'Motion mesh = free rubs vs RZ man' },
      { playId: 'cfb27:ole-miss-off:gun-empty-quads-hb:curl-flat-corner', name: 'CURL FLAT CORNER', type: 'pass', formation: 'Empty Quads HB', playbook: OFF, note: 'Corner route: best RZ throw in the engine' },
      { playId: 'cfb27:ole-miss-off:i-form-heavy:te-fade', name: 'TE FADE', type: 'pass', formation: 'I Form Heavy', playbook: OFF, note: 'Heavy look, TE iso fade vs single cover' },
    ],
    goalline: [
      { playId: 'cfb27:ole-miss-off:goal-line-normal:power-o', name: 'POWER O', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Follow the puller' },
      { playId: 'cfb27:ole-miss-off:goal-line-normal:pa-waggle', name: 'PA WAGGLE', type: 'pass', formation: 'Goal Line', playbook: OFF, note: 'After pounding Power O twice' },
      { playId: 'cfb27:ole-miss-off:goal-line-normal:qb-sneak', name: 'QB SNEAK', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Under a yard; audible out vs pinch' },
      { playId: 'cfb27:ole-miss-off:wildcat-deuce-wing-dt:blast', name: 'BLAST', type: 'run', formation: 'Deuce Wing DT', playbook: OFF, note: 'DT wildcat: 330 lbs falls forward' },
      { playId: 'cfb27:ole-miss-off:goal-line-normal:strong-toss', name: 'STRONG TOSS', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Outside a pinched 6-2 selling out inside' },
      { playId: 'cfb27:ole-miss-off:goal-line-normal:fb-dive-weak', name: 'FB DIVE WEAK', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Weak-side hit vs strong overload' },
    ],
    twomin: [
      { playId: 'cfb27:ole-miss-off:gun-empty-base-flex:hoss-y-juke', name: 'HOSS Y JUKE', type: 'pass', formation: 'Empty Base Flex', playbook: OFF, note: 'One read, ball out; hitches go OB' },
      { playId: 'cfb27:ole-miss-off:gun-tight-open:bench', name: 'BENCH', type: 'pass', formation: 'Tight Open', playbook: OFF, note: 'Double outs stop the clock' },
      { playId: 'cfb27:ole-miss-off:gun-empty-base-flex:verticals-under', name: 'VERTICALS UNDER', type: 'pass', formation: 'Empty Base Flex', playbook: OFF, note: 'Chunk or checkdown; both fine on tempo' },
      { playId: 'cfb27:ole-miss-off:gun-empty-quads-hb:stick', name: 'STICK', type: 'pass', formation: 'Empty Quads HB', playbook: OFF, note: 'No-huddle repeatable' },
    ],
    backedup: [
      { playId: 'cfb27:ole-miss-off:gun-split-slot-offset:inside-zone-split', name: 'INSIDE ZONE SPLIT', type: 'run', formation: 'Split Slot Offset', playbook: OFF, note: 'Safest run; wing seals backside' },
      { playId: 'cfb27:ole-miss-off:gun-wide-trips:rpo-base-hitches', name: 'RPO BASE HITCHES', type: 'run', formation: 'Wide Trips', playbook: OFF, note: 'Give unless the hitch is free' },
      { playId: 'cfb27:ole-miss-off:gun-wide:pa-seams', name: 'PA SEAMS', type: 'pass', formation: 'Wide', playbook: OFF, note: 'Banked shot when they crowd the box' },
      { playId: 'cfb27:ole-miss-off:i-form-heavy:te-tight-lead', name: 'TE TIGHT LEAD', type: 'run', formation: 'I Form Heavy', playbook: OFF, note: 'FB iso; fastest heavy hit vs light box' },
    ],
  },
  defense: {
    base: [
      { playId: 'cfb27:4-2-5-def:nickel-3--3-mint:cover-4-palms', name: 'COVER 4 PALMS', type: 'pass', formation: 'Nickel 3-3 Mint', playbook: DEF, note: 'Panic #1: trap CB jumps the short routes' },
      { playId: 'cfb27:4-2-5-def:nickel-3--3-mint:1-double-wr1', name: '1 DOUBLE WR1', type: 'pass', formation: 'Nickel 3-3 Mint', playbook: DEF, note: 'Panic #2: WR1 erased — hunt the 2nd threat' },
      { playId: 'cfb27:4-2-5-def:nickel-3--3-mint:cover-3-buzz-match', name: 'COVER 3 BUZZ MATCH', type: 'pass', formation: 'Nickel 3-3 Mint', playbook: DEF, note: 'Default vs RPO / quick game' },
      { playId: 'cfb27:4-2-5-def:nickel-3--3-mint:tampa-2', name: 'TAMPA 2', type: 'pass', formation: 'Nickel 3-3 Mint', playbook: DEF, note: 'Mesh/drag eraser; user the hole LB' },
    ],
    vs10: [
      { playId: 'cfb27:4-2-5-def:dime-3--2:cover-4-palms', name: 'COVER 4 PALMS', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Trap rules with six DBs' },
      { playId: 'cfb27:4-2-5-def:dime-3--2:cover-1-contain-spy', name: 'COVER 1 CONTAIN SPY', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Empty = QB run threat; spy him' },
      { playId: 'cfb27:4-2-5-def:dime-3--2:hot-blitz-3', name: 'HOT BLITZ 3', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Empty can’t max protect; free heat' },
      { playId: 'cfb27:4-2-5-def:dime-3--2:1-double-wr1', name: '1 DOUBLE WR1', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Erase WR1; roam on the other four' },
    ],
    vs12: [
      { playId: 'cfb27:4-2-5-def:4--2--5-over-g:cover-3-sky', name: 'COVER 3 SKY', type: 'pass', formation: '4-2-5 Over G', playbook: DEF, note: 'Force set: sky safety owns the edge run' },
      { playId: 'cfb27:4-2-5-def:4--2--5-over-g:cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', formation: '4-2-5 Over G', playbook: DEF, note: '2-high; safeties trigger run, carry PA' },
      { playId: 'cfb27:4-2-5-def:4--2--5-over-g:cover-1-hole', name: 'COVER 1 HOLE', type: 'pass', formation: '4-2-5 Over G', playbook: DEF, note: 'Man + rat; hole player robs PA cross' },
      { playId: 'cfb27:4-2-5-def:4--2--5-over-g:pinch-blitz', name: 'PINCH BLITZ', type: 'pass', formation: '4-2-5 Over G', playbook: DEF, note: 'Run blitz: interior surge, edges set' },
    ],
    heavy: [
      { playId: 'cfb27:4-2-5-def:3--4-tite:cover-3-sky', name: 'COVER 3 SKY', type: 'pass', formation: '3-4 Tite', playbook: DEF, note: 'Odd front, 8-man fit; never light here' },
      { playId: 'cfb27:4-2-5-def:3--4-tite:cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', formation: '3-4 Tite', playbook: DEF, note: 'Safeties trigger; carries PA shots' },
      { playId: 'cfb27:4-2-5-def:3--4-tite:saw-blitz-1', name: 'SAW BLITZ 1', type: 'pass', formation: '3-4 Tite', playbook: DEF, note: 'Sam+Will edges; kills toss / stretch' },
      { playId: 'cfb27:4-2-5-def:goal-line-5--3:gaps-all', name: 'GAPS ALL', type: 'pass', formation: 'Goal Line 5-3', playbook: DEF, note: 'Bone/31 check: every gap owned' },
    ],
    '3short': [
      { playId: 'cfb27:4-2-5-def:nickel-3--3-mint:sam-mike-1', name: 'SAM MIKE 1', type: 'pass', formation: 'Nickel 3-3 Mint', playbook: DEF, note: 'Double LB heat, man behind it' },
      { playId: 'cfb27:4-2-5-def:nickel-double-mug:mid-blitz-0', name: 'MID BLITZ 0', type: 'pass', formation: 'Nickel Double Mug', playbook: DEF, note: 'A-gap hit; pinch the DL' },
      { playId: 'cfb27:4-2-5-def:nickel-load-mug:cover-1-lb-blitz', name: 'COVER 1 LB BLITZ', type: 'pass', formation: 'Nickel Load Mug', playbook: DEF, note: 'Man + extra rusher; no free pick route' },
      { playId: 'cfb27:4-2-5-def:nickel-3--3-mint:pinch-0', name: 'PINCH 0', type: 'pass', formation: 'Nickel 3-3 Mint', playbook: DEF, note: 'Only if they’ve shown zero quick game' },
    ],
    '3long': [
      { playId: 'cfb27:4-2-5-def:dime-3--2:cover-4-drop', name: 'COVER 4 DROP', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Everything in front; rally and tackle' },
      { playId: 'cfb27:4-2-5-def:dime-3--2:hot-blitz-3', name: 'HOT BLITZ 3', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Speed heat before verts develop' },
      { playId: 'cfb27:4-2-5-def:dime-3--2:tampa-2-drop', name: 'TAMPA 2 DROP', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Kills the crosser AND the hole shot' },
      { playId: 'cfb27:4-2-5-def:dime-3--2:cover-6', name: 'COVER 6', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Vs boundary-iso spam' },
    ],
    pressure: [
      { playId: 'cfb27:4-2-5-def:nickel-double-mug:mid-blitz-0', name: 'MID BLITZ 0', type: 'pass', formation: 'Nickel Double Mug', playbook: DEF, note: 'Meta nano: pinch DL, mug LB bails' },
      { playId: 'cfb27:4-2-5-def:3--3--5-penny:mike-blitz-0', name: 'MIKE BLITZ 0', type: 'pass', formation: '3-3-5 Penny', playbook: DEF, note: 'Best confusion pressure this cycle' },
      { playId: 'cfb27:4-2-5-def:nickel-double-mug:buck-zone-blitz', name: 'BUCK ZONE BLITZ', type: 'pass', formation: 'Nickel Double Mug', playbook: DEF, note: 'Low-risk heat: 3-deep behind it' },
      { playId: 'cfb27:4-2-5-def:dime-3--2:edge-blitz-3', name: 'EDGE BLITZ 3', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Obvious-pass edge heat, corner safe' },
    ],
    redzone: [
      { playId: 'cfb27:4-2-5-def:4--2--5-even:cover-2-man', name: 'COVER 2 MAN', type: 'pass', formation: '4-2-5 Even', playbook: DEF, note: 'Vs fade / slant spam' },
      { playId: 'cfb27:4-2-5-def:nickel-double-mug:cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: 'Nickel Double Mug', playbook: DEF, note: 'Passes off the bunch traffic' },
      { playId: 'cfb27:4-2-5-def:dime-3--2:cover-1-robber-press', name: 'COVER 1 ROBBER PRESS', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Robber sits in the slant window' },
    ],
    goalline: [
      { playId: 'cfb27:4-2-5-def:goal-line-6--2:60-pinch', name: '60 PINCH', type: 'pass', formation: 'Goal Line 6-2', playbook: DEF, note: 'Vs sneak / dive' },
      { playId: 'cfb27:4-2-5-def:goal-line-6--2:60-out-jacks', name: '60 OUT JACKS', type: 'pass', formation: 'Goal Line 6-2', playbook: DEF, note: 'Edge-sound vs toss / rollout PA' },
      { playId: 'cfb27:4-2-5-def:goal-line-6--2:guts', name: 'GUTS', type: 'pass', formation: 'Goal Line 6-2', playbook: DEF, note: 'The 4th-and-goal-from-the-1 gamble' },
    ],
    prevent: [
      { playId: 'cfb27:4-2-5-def:dime-3--2:cover-4-drop', name: 'COVER 4 DROP', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Better than prevent in most 2-min' },
      { playId: 'cfb27:4-2-5-def:dime-3--2:1-double-wr1', name: '1 DOUBLE WR1', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Bracket the guy the drive runs through' },
      { playId: 'cfb27:4-2-5-def:dime-3--2:dbl-safety-go', name: 'DBL SAFETY GO', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Vs desperation shots' },
      { playId: 'cfb27:4-2-5-def:prevent-3-deep:prevent', name: 'PREVENT', type: 'pass', formation: 'Prevent 3 Deep', playbook: DEF, note: 'Only up 2+ scores under 1:00' },
    ],
  },
}

export const GAME_PLANS = [OLE_MISS_PLAN, IOWA_PLAN]
