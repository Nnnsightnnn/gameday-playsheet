// Iowa (CFB 27) offense + 4-2-5 Man Pressure defense, built from the
// Aug 2026 online H2H meta (post-1.006). Every playId validated against
// public/data/playbooks-cfb27.json (see validation-report.txt).
//
// Doctrine (see docs/iowa-gameplan.md):
// - Underdog ball: shorten the game, bleed clock, take the checkdown.
// - Offense lives in 4 pictures: Wing Close (wide zone + fake-reverse family),
//   Deuce Close (12-personnel everything), Bunch X Nasty (identity — the
//   Singleback cheat-split set only 11 books carry), Gun Y Trips Wk (3rd downs).
// - Defense lives in ONE package (Nickel 3-3 Cub) so hurry-up can't rush you.
//   Base / Tempo block = the four preset audibles. Audible, don't browse.
//   Two TEs on the field → get out of Cub, into 4-3 Even 6-1 (heavy block).
//
// Install: append IOWA_PLAN to GAME_PLANS in src/data/gameplans.js.

const OFF = 'Iowa'
const DEF = '4-2-5 Man Pressure'

export const IOWA_PLAN = {
  game: 'cfb',
  name: 'Iowa · CFB 27',
  guide: 'gameplan-iowa.html',
  offense: {
    openers: [
      { playId: 'cfb27:iowa-off:singleback-wing-close:wide-zone', name: 'WIDE ZONE', type: 'pass', formation: 'Wing Close', playbook: OFF, note: 'Your bread; flip to the weaker front pre-snap' },
      { playId: 'cfb27:iowa-off:singleback-deuce-close:mtn-duo', name: 'MTN DUO', type: 'pass', formation: 'Deuce Close', playbook: OFF, note: 'Motion chased = man · passed off = zone' },
      { playId: 'cfb27:iowa-off:singleback-bunch-x-nasty:cheat-hb-zone-wk', name: 'CHEAT HB ZONE WK', type: 'run', formation: 'Bunch X Nasty', playbook: OFF, note: 'Zone away from the bunch; plants the cheat picture' },
      { playId: 'cfb27:iowa-off:singleback-wing-close:hb-toss-fk-reverse', name: 'HB TOSS FK REVERSE', type: 'run', formation: 'Wing Close', playbook: OFF, note: 'Fake reverse freezes the edge; sets the PA twins' },
    ],
    first: [
      { playId: 'cfb27:iowa-off:singleback-wing-close:wide-zone', name: 'WIDE ZONE', type: 'pass', formation: 'Wing Close', playbook: OFF, note: 'Auto vs 6-man box; run it until he stops it' },
      { playId: 'cfb27:iowa-off:singleback-deuce-close:hb-stretch', name: 'HB STRETCH', type: 'run', formation: 'Deuce Close', playbook: OFF, note: 'When they pinch inside to kill wide zone' },
      { playId: 'cfb27:iowa-off:singleback-bunch-x-nasty:cheat-counter-y', name: 'CHEAT COUNTER Y', type: 'run', formation: 'Bunch X Nasty', playbook: OFF, note: 'Counter back weak vs overflow to your zone lean' },
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:rpo-peek-slant', name: 'RPO PEEK SLANT', type: 'run', formation: 'Y Trips Wk', playbook: OFF, note: 'Soft slot → throw the peek; vs man, give' },
    ],
    '2short': [
      { playId: 'cfb27:iowa-off:singleback-deuce-close:pa-stretch-shot', name: 'PA STRETCH SHOT', type: 'run', formation: 'Deuce Close', playbook: OFF, note: 'Free-shot down off the stretch you hammered' },
      { playId: 'cfb27:iowa-off:singleback-deuce-close:motion-zone-toss', name: 'MOTION ZONE TOSS', type: 'run', formation: 'Deuce Close', playbook: OFF, note: 'Motion adds a blocker; take the easy four' },
      { playId: 'cfb27:iowa-off:singleback-wing-close:duo', name: 'DUO', type: 'pass', formation: 'Wing Close', playbook: OFF, note: 'Low-variance; keeps 3rd & inches alive' },
      { playId: 'cfb27:iowa-off:singleback-bunch-x-nasty:pa-cheat-deep-corner', name: 'PA CHEAT DEEP CORNER', type: 'pass', formation: 'Bunch X Nasty', playbook: OFF, note: 'Corner over the flat vs C2/C3 run cheats' },
    ],
    '2long': [
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:mesh', name: 'MESH', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: 'Take the checkdown; live for 3rd & 4' },
      { playId: 'cfb27:iowa-off:singleback-deuce-close:spacing-switch', name: 'SPACING SWITCH', type: 'pass', formation: 'Deuce Close', playbook: OFF, note: 'Five outlets from your run picture' },
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:hb-slip-screen', name: 'HB SLIP SCREEN', type: 'run', formation: 'Y Trips Wk', playbook: OFF, note: 'Answer to the pass-rush tee-off' },
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:hb-mid-draw', name: 'HB MID DRAW', type: 'run', formation: 'Y Trips Wk', playbook: OFF, note: 'Vs 2-man and deep-drop shells' },
    ],
    '3short': [
      { playId: 'cfb27:iowa-off:goal-line-normal:qb-sneak', name: 'QB SNEAK', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Under a yard; audible out vs pinch' },
      { playId: 'cfb27:iowa-off:singleback-deuce-close:0-1-trap', name: '0 1 TRAP', type: 'run', formation: 'Deuce Close', playbook: OFF, note: 'Quick trap beats penetration fronts' },
      { playId: 'cfb27:iowa-off:gun-tight-slot-open:hb-direct-snap', name: 'HB DIRECT SNAP', type: 'run', formation: 'Tight Slot Open', playbook: OFF, note: 'Best direct snap in the game; RS flips it' },
      { playId: 'cfb27:iowa-off:i-form-wing-over:hb-lead', name: 'HB LEAD', type: 'run', formation: 'Wing Over', playbook: OFF, note: 'Downhill iso from the set nobody labs' },
    ],
    '3med': [
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:stick', name: 'STICK', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: 'Throw off the flat defender; sticks money' },
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:spacing-snag', name: 'SPACING SNAG', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: 'Blitz-proof five-across at the sticks' },
      { playId: 'cfb27:iowa-off:singleback-deuce-close:flood-trail', name: 'FLOOD TRAIL', type: 'pass', formation: 'Deuce Close', playbook: OFF, note: 'Flood + trail from an under-center run look' },
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:mesh', name: 'MESH', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: 'Vs man tells: pressed, no zone eyes' },
    ],
    '3long': [
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:strong-flood', name: 'STRONG FLOOD', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: 'Sail lands at the sticks vs Cover 3' },
      { playId: 'cfb27:iowa-off:gun-trey-open-hb-str:mtn-stick-wheel', name: 'MTN STICK WHEEL', type: 'pass', formation: 'Trey Open HB Str', playbook: OFF, note: 'Streak-wheel-drag combo; wheel kills zone' },
      { playId: 'cfb27:iowa-off:gun-trey-open-hb-str:h-mtn-mesh-post', name: 'H MTN MESH POST', type: 'pass', formation: 'Trey Open HB Str', playbook: OFF, note: 'Mesh under, post in the vacated hole' },
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:verts-slot-nod', name: 'VERTS SLOT NOD', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: '1-high only; nod bakes a lurking safety' },
    ],
    shots: [
      { playId: 'cfb27:iowa-off:singleback-deuce-close:pa-mtn-spider-y-leak', name: 'PA MTN SPIDER Y LEAK', type: 'pass', formation: 'Deuce Close', playbook: OFF, note: 'TE leaks behind flowing zones; elite vs users' },
      { playId: 'cfb27:iowa-off:singleback-wing-close:pa-fk-toss-wheel', name: 'PA FK TOSS WHEEL', type: 'run', formation: 'Wing Close', playbook: OFF, note: 'Wheel behind the overhang chasing the toss' },
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:pa-shot', name: 'PA SHOT', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: 'Max pro; cash the run respect from gun' },
    ],
    redzone: [
      { playId: 'cfb27:iowa-off:singleback-deuce-close:pa-rz-crossers', name: 'PA RZ CROSSERS', type: 'pass', formation: 'Deuce Close', playbook: OFF, note: 'Built for here; crossers beat man AND zone' },
      { playId: 'cfb27:iowa-off:singleback-bunch-x-nasty:crack-toss', name: 'CRACK TOSS', type: 'run', formation: 'Bunch X Nasty', playbook: OFF, note: 'Bunch cracks down; walks in vs inside shade' },
      { playId: 'cfb27:iowa-off:gun-trey-open-hb-str:slot-fade', name: 'SLOT FADE', type: 'pass', formation: 'Trey Open HB Str', playbook: OFF, note: 'Vs man press; back-shoulder the slot iso' },
      { playId: 'cfb27:iowa-off:gun-trey-open-hb-str:mtn-spot-y-corner', name: 'MTN SPOT Y CORNER', type: 'pass', formation: 'Trey Open HB Str', playbook: OFF, note: 'Spot-corner triangle vs red-zone zone' },
    ],
    goalline: [
      { playId: 'cfb27:iowa-off:goal-line-normal:power-o', name: 'POWER O', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Follow the pullers' },
      { playId: 'cfb27:iowa-off:goal-line-normal:qb-sneak', name: 'QB SNEAK', type: 'run', formation: 'Goal Line', playbook: OFF, note: '4th & inches, always; check the pinch first' },
      { playId: 'cfb27:iowa-off:strong-i-close:quick-toss', name: 'QUICK TOSS', type: 'run', formation: 'Strong I Close', playbook: OFF, note: 'Two-book set; beats the goal-line pinch' },
      { playId: 'cfb27:iowa-off:goal-line-normal:pa-spot', name: 'PA SPOT', type: 'pass', formation: 'Goal Line', playbook: OFF, note: 'After two pounds; TE flat walks open' },
    ],
    twomin: [
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:y-sail', name: 'Y SAIL', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: 'Sail = free out-of-bounds chunks' },
      { playId: 'cfb27:iowa-off:gun-tight-slot-open:bench-smash', name: 'BENCH SMASH', type: 'pass', formation: 'Tight Slot Open', playbook: OFF, note: 'Boundary double outs stop the clock' },
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:stick', name: 'STICK', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: 'No-huddle repeatable five yards' },
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:all-go', name: 'ALL GO', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: 'Need-it-all verts; slot nod vs 1-high' },
    ],
    backedup: [
      { playId: 'cfb27:iowa-off:singleback-wing-close:duo', name: 'DUO', type: 'pass', formation: 'Wing Close', playbook: OFF, note: 'Never loses yards; breathe' },
      { playId: 'cfb27:iowa-off:singleback-deuce-close:hb-dive', name: 'HB DIVE', type: 'run', formation: 'Deuce Close', playbook: OFF, note: 'Zero-risk exit from the shadow' },
      { playId: 'cfb27:iowa-off:singleback-wing-close:pa-ctr-waggle', name: 'PA CTR WAGGLE', type: 'pass', formation: 'Wing Close', playbook: OFF, note: 'Rolls away from the EZ rush; throwaway safe' },
      { playId: 'cfb27:iowa-off:gun-y-trips-wk:quick-unders', name: 'QUICK UNDERS', type: 'pass', formation: 'Y Trips Wk', playbook: OFF, note: 'Ball out in 1.5s; no sack-safety risk' },
    ],
  },
  defense: {
    base: [
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:cover-4-show-2', name: 'COVER 4 SHOW 2', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: '#1 blind call: sound vs run, verts, RPO' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:cover-3-buzz', name: 'COVER 3 BUZZ', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: 'Blind call #2; buzz eats drags and RPO' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:tampa-2', name: 'TAMPA 2', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: 'Vs mesh/drag scripts; user the hole LB' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:mike-blitz-0', name: 'MIKE BLITZ 0', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: 'Preset 4th audible; spring it, never blind' },
    ],
    vs10: [
      { playId: 'cfb27:4-2-5-man-pressure-def:dime-3--2:cover-4-palms', name: 'COVER 4 PALMS', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Traps smash and corner-route spam' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-double-mug:cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: 'Nickel Double Mug', playbook: DEF, note: 'Show 6, drop out; wrecks his hot read' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:nickel-blitz-3', name: 'NICKEL BLITZ 3', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: 'Slot heat with a 3-deep net' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:cover-1-robber', name: 'COVER 1 ROBBER', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: 'Robber sits at the sticks' },
    ],
    vs12: [
      { playId: 'cfb27:4-2-5-man-pressure-def:4--3-even-6--1:cover-3-buzz', name: 'COVER 3 BUZZ', type: 'pass', formation: '4-3 Even 6-1', playbook: DEF, note: 'Force set: buzz safety in the run fit' },
      { playId: 'cfb27:4-2-5-man-pressure-def:4--3-even-6--1:cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', formation: '4-3 Even 6-1', playbook: DEF, note: '2-high; safeties trigger run, carry PA' },
      { playId: 'cfb27:4-2-5-man-pressure-def:4--3-even-6--1:cover-1-hole', name: 'COVER 1 HOLE', type: 'pass', formation: '4-3 Even 6-1', playbook: DEF, note: 'Man + rat; hole player robs PA cross' },
      { playId: 'cfb27:4-2-5-man-pressure-def:4--3-even-6--1:sam-blitz-3', name: 'SAM BLITZ 3', type: 'pass', formation: '4-3 Even 6-1', playbook: DEF, note: 'Run blitz: edge set, 3-deep behind' },
    ],
    heavy: [
      { playId: 'cfb27:4-2-5-man-pressure-def:4--3-even-6--1:cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', formation: '4-3 Even 6-1', playbook: DEF, note: 'Never light here; stops stretch/toss' },
      { playId: 'cfb27:4-2-5-man-pressure-def:4--3-even-6--1:sam-will-blitz', name: 'SAM WILL BLITZ', type: 'pass', formation: '4-3 Even 6-1', playbook: DEF, note: 'Both edges set; run blitz vs 22/31' },
      { playId: 'cfb27:4-2-5-man-pressure-def:4--3-even-6--1:tampa-2', name: 'TAMPA 2', type: 'pass', formation: '4-3 Even 6-1', playbook: DEF, note: 'Sound vs PA off run action' },
      { playId: 'cfb27:4-2-5-man-pressure-def:goal-line-5--3:gaps-all', name: 'GAPS ALL', type: 'pass', formation: 'Goal Line 5-3', playbook: DEF, note: 'Bone/31 check: every gap owned' },
    ],
    '3short': [
      { playId: 'cfb27:4-2-5-man-pressure-def:4--3-even-6--1:sam-will-blitz', name: 'SAM WILL BLITZ', type: 'pass', formation: '4-3 Even 6-1', playbook: DEF, note: 'Edge heat, stacked box' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-double-mug:mid-blitz', name: 'MID BLITZ', type: 'pass', formation: 'Nickel Double Mug', playbook: DEF, note: 'A-gap surge; pinch the DL' },
      { playId: 'cfb27:4-2-5-man-pressure-def:4--3-even-6--1:mike-will-blitz', name: 'MIKE WILL BLITZ', type: 'pass', formation: '4-3 Even 6-1', playbook: DEF, note: 'Double A-gap run blitz' },
      { playId: 'cfb27:4-2-5-man-pressure-def:4--3-even-6--1:cover-1-mlb-blitz', name: 'COVER 1 MLB BLITZ', type: 'pass', formation: '4-3 Even 6-1', playbook: DEF, note: 'Man + extra rusher; no free pick route' },
    ],
    '3long': [
      { playId: 'cfb27:4-2-5-man-pressure-def:dime-3--2:cover-4-drop', name: 'COVER 4 DROP', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Everything in front; rally and tackle' },
      { playId: 'cfb27:4-2-5-man-pressure-def:dime-3--2:tampa-2-drop', name: 'TAMPA 2 DROP', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Kills the crosser AND the hole shot' },
      { playId: 'cfb27:4-2-5-man-pressure-def:dime-3--2:hot-blitz-3', name: 'HOT BLITZ 3', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Speed heat before verts develop' },
      { playId: 'cfb27:4-2-5-man-pressure-def:dime-3--2:cover-6-willie', name: 'COVER 6 WILLIE', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Vs boundary-iso spam' },
    ],
    pressure: [
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:mike-blitz-0', name: 'MIKE BLITZ 0', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: 'Money blitz this cycle; needs run answers' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-double-mug:mid-blitz', name: 'MID BLITZ', type: 'pass', formation: 'Nickel Double Mug', playbook: DEF, note: 'Meta nano: pinch DL, mug LB bails' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:3-sam-will-blitz', name: '3 SAM WILL BLITZ', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: 'Overload look, 3-deep net; safest heat' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:olb-blitz-1', name: 'OLB BLITZ 1', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: 'Man-free edge when Mike 0 gets scouted' },
    ],
    redzone: [
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:cover-4-show-2', name: 'COVER 4 SHOW 2', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: 'Match the corner/slant windows; no islands' },
      { playId: 'cfb27:4-2-5-man-pressure-def:4--2--5-even:cover-2-man', name: 'COVER 2 MAN', type: 'pass', formation: '4-2-5 Even', playbook: DEF, note: 'Vs fade / slant spam' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-3--3-cub:cover-1-robber', name: 'COVER 1 ROBBER', type: 'pass', formation: 'Nickel 3-3 Cub', playbook: DEF, note: 'Robber takes the backside slant' },
      { playId: 'cfb27:4-2-5-man-pressure-def:nickel-double-mug:cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: 'Nickel Double Mug', playbook: DEF, note: 'Passes off the bunch traffic' },
    ],
    goalline: [
      { playId: 'cfb27:4-2-5-man-pressure-def:goal-line-6--2:60-pinch', name: '60 PINCH', type: 'pass', formation: 'Goal Line 6-2', playbook: DEF, note: 'Vs sneak / dive' },
      { playId: 'cfb27:4-2-5-man-pressure-def:goal-line-6--2:60-out-jacks', name: '60 OUT JACKS', type: 'pass', formation: 'Goal Line 6-2', playbook: DEF, note: 'Edge-sound vs toss / rollout PA' },
      { playId: 'cfb27:4-2-5-man-pressure-def:goal-line-6--2:guts', name: 'GUTS', type: 'pass', formation: 'Goal Line 6-2', playbook: DEF, note: 'The 4th-and-goal-from-the-1 gamble' },
    ],
    prevent: [
      { playId: 'cfb27:4-2-5-man-pressure-def:dime-3--2:cover-4-drop', name: 'COVER 4 DROP', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Better than prevent in most 2-min' },
      { playId: 'cfb27:4-2-5-man-pressure-def:dime-3--2:1-double-wr1', name: '1 DOUBLE WR1', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Bracket the guy the drive runs through' },
      { playId: 'cfb27:4-2-5-man-pressure-def:dime-3--2:dbl-safety-go', name: 'DBL SAFETY GO', type: 'pass', formation: 'Dime 3-2', playbook: DEF, note: 'Vs desperation shots' },
      { playId: 'cfb27:4-2-5-man-pressure-def:prevent-3-deep:prevent', name: 'PREVENT', type: 'pass', formation: 'Prevent 3 Deep', playbook: DEF, note: 'Only up 2+ scores under 1:00' },
    ],
  },
}

// Install: import IOWA_PLAN and append —
