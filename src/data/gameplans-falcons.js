// Falcons (Madden 27) — REFRESHED 2026-08-19 (patch: TU1 Aug 10 + LCU Aug 17).
// Prior build 2026-08-10 was PRE-LAUNCH lab intel. The game shipped Aug 13, so
// this is the first refresh against a real, playable build and real launch
// ratings. Every playId validated against public/data/playbooks.json (v27).
//
// TWO STRUCTURAL CHANGES THIS PASS (both Kenny's call, 8/19):
// 1. OFFENSE is now DRIVE SCRIPTS, not down/distance. Each drive block =
//    1–2 core calls + 1–2 tagged counters. Plus five COUNTERS blocks keyed to
//    what the defense SHOWS. Drawn from the whole 618-play book, but each
//    block stays inside 1–2 formations so tempo can't rush you.
// 2. DEFENSE is rebased on 2-4-5 OVER WIDE — Kenny's actual base, which the
//    old plan used exactly once (buried in `pressure`). Three safeties on the
//    grass; true slot CB only when the call is man.
//
// ── WHAT THE LAUNCH RATINGS SAY (EA first-party, ea.com + maddenratings) ──
// BATES 94 FS: archetype Zone-S. ZCV 93 / MCV 85, PRC 95, PUR 93 — but
//   BSH 56 and STR 59. His Superstar "Deep In Zone KO" only fires 20+ YARDS
//   FROM THE LoS INSIDE THE HASHES, and "Lurker" pays for zone depth. Playing
//   him in the box switches off both abilities and exposes his two worst
//   numbers. USER HIM DEEP. Box only on short yardage. This is the single
//   biggest correction in this refresh.
// WATTS 79 SS: ZCV 81 (best of any slot candidate) but MCV 72 and AGI/COD
//   82/82 — 7–9 pts below every corner. Big nickel is a ZONE package. Want
//   man? Clark Phillips III (MCV 78, ACC 94, COD 90) takes the slot.
// DEABLO 81: archetype Pass Coverage. TAK 87 / PUR 87 are real, BSH 67 and
//   STR 69 are not. He is a FREE RUNNER, not a run-stuffer. Keep him clean.
// HARRIS 72 (Christian Harris, WILL, Run Stopper): PUR 84, the best of any
//   Falcons LB, on 89 SPD / 93 ACC. Kenny's "chase-down LB" read is correct.
//   He is also +11 MCV over Andersen — start him, not Andersen.
// EBUKAM 76: BSH 80 / STR 83, best edge shed on the roster — but his
//   archetype is Smaller Speed Rusher, and no Falcon is a Run Stopper. Pair
//   him WITH Jalon Walker (TAK 84 / PUR 84) on run downs; sit Pearce (BSH 70).
//
// ── QB CORRECTION (the old header had this backwards) ──
// TUA TAGOVAILOA 74 is QB1 on the M27 launch roster; PENIX 72 is the backup.
// The 8/10 header said "Penix 92 THP / 76 DAC" and built a driven-throw,
// shot-heavy passing game on it. Wrong quarterback. Tua is TAS 90 / TAM 84 /
// TAD 84 / AWR 69 — a rhythm thrower on a defined read, not a full-field
// progression reader and not a deep-ball guy. So: this offense lives 0–18
// yards on timing. The shot calls in `driveattack` and `ctr1high` are
// SITUATIONAL — take them off play-action or a confirmed 1-on-1, not as
// staples. If you want the vertical threat, that is the reason to sub Penix,
// and you pay for it with worse rhythm throws everywhere else.
//
// ── DEPTH CHART BEFORE YOU LOAD THIS (all EA launch ratings) ──
// • START CHRISTIAN HARRIS OVER TROY ANDERSEN. Harris 72 vs Andersen 70, but
//   MCV 65 vs 54 and ZCV 65 vs 58. Andersen is the single biggest coverage
//   hole on the field and a TE seam or back's wheel is a free completion on
//   him. This is the cheapest fix available to you.
// • MAN CALLS: Clark Phillips III (MCV 78, ACC 94, COD 90) to the slot.
//   Watts stays on the field as the third safety, just not matched.
// • RUN DOWNS: Ebukam AND Jalon Walker on the edges; sit Pearce (BSH 70).
//   PASSING DOWNS: flip it — Pearce (FMV 81) and Walker rush, Ebukam sits.
// • INTERIOR: Da'Shawn Hand (STR 88) at 1-tech, Brandon Dorlus (BSH 79,
//   PMV 77) at 3-tech, Zach Harrison (POW 85) as the pass-rush sub.
//
// ── THE HOLE, STATED HONESTLY ──
// 2-4-5 Over Wide has NO interior-gap run-fit call in its 18 plays — no pinch
// blitz, no A-gap fire. No Falcons DT is above 74 OVR and no Falcons LB can
// shed (BSH 67/67/68). So inside zone and duo at the A gap is the structural
// hole in this defense and you cannot personnel your way out of it. Answers:
// pinch the D-line manually (RS-left → LS-down), and CHECK OUT of 2-4-5 vs
// 12/21/22 personnel. That is what the vs12 and heavy blocks are for.
//
// ── META HONESTY ──
// Madden 27 is six days old. MaddenTurf edited its playbook tier list on 8/18
// and STILL refused to rank, on the record: "anyone publishing a settled
// Madden 27 tier list this week is guessing." No creator has covered 2-4-5
// Over Wide at all. Treat this defense as a hypothesis you are testing, not a
// scheme with community backing. Any "M27 tier list" circulating now is
// recycled M26 — MaddenTurf's own formation database is dated 2026-03-15.
//
// ── PATCH FACTS ──
// TU1 (Aug 10): removed an unintended Speed Boost on certain cut moves.
// LCU (Aug 17): Untarget Defender no longer works on RPO plays; Buck Sweep
//   handoff warp fixed. The untarget change HELPS you — it removes the
//   cleanest offensive answer to a user rusher, on RPOs only.

const OFF = 'Falcons'
const DEF = 'Falcons'

export const FALCONS_PLAN = {
  game: 'madden',
  name: 'Falcons · Madden 27',
  guide: 'gameplan-falcons.html',
  offense: {
    // ── DRIVE 1: the script. Call these in order, diagnose, then commit. ──
    openers: [
      { playId: 'falcons-off-singleback-wing-tight-hb-stretch', name: 'HB STRETCH', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: '1 · Identity. Hold LT to read the run fit first' },
      { playId: 'falcons-off-gun-trips-te-flex-stick', name: 'STICK', type: 'pass', formation: 'Gun Trips TE Flex', playbook: OFF, note: '2 · Rhythm. Flat taken = zone. Safe vs all' },
      { playId: 'falcons-off-singleback-y-trips-close-mtn-jet-wide-zone', name: 'MTN JET WIDE ZONE', type: 'pass', formation: 'Singleback Y Trips Close', playbook: OFF, note: '3 · Jet motion = your man/zone tell' },
      { playId: 'falcons-off-gun-bunch-te-mesh', name: 'MESH', type: 'pass', formation: 'Gun Bunch TE', playbook: OFF, note: '4 · Press test. Rubs tell you if it is man' },
      { playId: 'falcons-off-singleback-wing-tight-pa-boot-flood', name: 'PA BOOT FLOOD', type: 'pass', formation: 'Singleback Wing Tight', playbook: OFF, note: '5 · Cash the stretch: 3 levels, take the flat' },
    ],

    // ── BALL-CONTROL: ahead or even. Grind, stay on schedule. ──
    drivecontrol: [
      { playId: 'falcons-off-singleback-wing-tight-hb-stretch', name: 'HB STRETCH', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'CORE · Bijan behind Lindstrom. Run it till it dies' },
      { playId: 'falcons-off-singleback-wing-tight-hb-duo', name: 'HB DUO', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'CORE · Same picture, downhill track' },
      { playId: 'falcons-off-pistol-bunch-te-cross-drag', name: 'CROSS DRAG', type: 'pass', formation: 'Pistol Bunch TE', playbook: OFF, note: 'CTR loaded box · Be patient, drag hits late' },
      { playId: 'falcons-off-singleback-wing-tight-fake-hb-zone-qb-boot', name: 'FAKE HB ZONE QB BOOT', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'CTR overflow · They sell out on zone, walk in' },
    ],

    // ── ATTACK: behind, or they have stopped the run. Chunks. ──
    driveattack: [
      { playId: 'falcons-off-gun-trey-y--flex-dagger', name: 'DAGGER', type: 'pass', formation: 'Gun Trey Y-Flex', playbook: OFF, note: 'CORE · Seam clears, dig sits at 12-15. Driven' },
      { playId: 'falcons-off-gun-deuce-close-pa-deep-over', name: 'PA DEEP OVER', type: 'pass', formation: 'Gun Deuce Close', playbook: OFF, note: 'CORE · PA pulls LBs, over crosses empty middle' },
      { playId: 'falcons-off-gun-tight-flex-pa-post-shot', name: 'PA POST SHOT', type: 'pass', formation: 'Gun Tight Flex', playbook: OFF, note: 'CTR man · London 92 on the post. Confirm first' },
      { playId: 'falcons-off-gun-tight-flex-hb-draw', name: 'HB DRAW', type: 'run', formation: 'Gun Tight Flex', playbook: OFF, note: 'CTR rush · They tee off, Bijan takes the void' },
    ],

    redzone: [
      { playId: 'falcons-off-gun-bunch-smash-return', name: 'SMASH RETURN', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'CORE · Smash beats 2-high, return beats man' },
      { playId: 'falcons-off-gun-tight-y-off-te-corner', name: 'TE CORNER', type: 'pass', formation: 'Gun Tight Y Off', playbook: OFF, note: 'CORE · Pitts 86 spd on a LB. Only he gets it' },
      { playId: 'falcons-off-gun-y-off-trips-close-mtn-corners', name: 'MTN CORNERS', type: 'pass', formation: 'Gun Y Off Trips Close', playbook: OFF, note: 'CTR 2-high · Motion corners vs a RZ shell' },
      { playId: 'falcons-off-singleback-wing-tight-hb-duo', name: 'HB DUO', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'CTR light box · Take the 4 and the fresh set' },
    ],

    goalline: [
      { playId: 'falcons-off-goal-line-normal-qb-sneak', name: 'QB SNEAK', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Under a yard. Free yardage, take it' },
      { playId: 'falcons-off-goal-line-normal-power-o', name: 'POWER O', type: 'run', formation: 'Goal Line', playbook: OFF, note: 'Follow the puller. Read the fit on LT' },
      { playId: 'falcons-off-goal-line-normal-pa-waggle', name: 'PA WAGGLE', type: 'pass', formation: 'Goal Line', playbook: OFF, note: 'CTR · Keeper after two pounds inside' },
    ],

    twomin: [
      { playId: 'falcons-off-gun-bunch-bench-pivot', name: 'BENCH PIVOT', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'CORE · Double sideline breakers, clock stops' },
      { playId: 'falcons-off-gun-deuce-close-bench-dig-curl', name: 'BENCH DIG CURL', type: 'pass', formation: 'Gun Deuce Close', playbook: OFF, note: 'CORE · Bench for OB, dig if overplayed' },
      { playId: 'falcons-off-gun-bunch-te-mtn-return-flood-stick', name: 'MTN RETURN FLOOD STICK', type: 'pass', formation: 'Gun Bunch TE', playbook: OFF, note: 'CTR any shell · Return, flood and stick in one' },
      { playId: 'falcons-off-gun-bunch-verticals', name: 'VERTICALS', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'CTR soft · Chunk or checkdown, repeatable' },
    ],

    backedup: [
      { playId: 'falcons-off-singleback-wing-tight-hb-stretch', name: 'HB STRETCH', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: 'CORE · Run out of the shadow. No negatives' },
      { playId: 'falcons-off-singleback-wing-tight-y-stick', name: 'Y STICK', type: 'pass', formation: 'Singleback Wing Tight', playbook: OFF, note: 'CORE · Safe rhythm throw off the run picture' },
      { playId: 'falcons-off-singleback-wing-tight-pa-boot-slide', name: 'PA BOOT SLIDE', type: 'pass', formation: 'Singleback Wing Tight', playbook: OFF, note: 'CTR pressure · Boot away, flat comes free' },
      { playId: 'falcons-off-gun-empty-chips-quads-hb-screen', name: 'HB SCREEN', type: 'run', formation: 'Gun Empty Chips Quads', playbook: OFF, note: 'CTR blitz · Chips empty, no free runner' },
    ],

    // ── COUNTERS: read the shell pre-snap, jump straight to the block. ──
    ctr2high: [
      { playId: 'falcons-off-singleback-wing-tight-hb-duo', name: 'HB DUO', type: 'run', formation: 'Singleback Wing Tight', playbook: OFF, note: '2-high = light box. Punish it on the ground' },
      { playId: 'falcons-off-gun-y-off-trips-close-mtn-empty-smash-y--post', name: 'MTN EMPTY SMASH Y-POST', type: 'pass', formation: 'Gun Y Off Trips Close', playbook: OFF, note: 'Post splits them. Safety widens = smash corner' },
      { playId: 'falcons-off-singleback-y-trips-close-mtn-x--go-dig', name: 'MTN X-GO DIG', type: 'pass', formation: 'Singleback Y Trips Close', playbook: OFF, note: 'Go clears the CB, dig lands in the vacated hole' },
      { playId: 'falcons-off-i-form-y-off-close-double-dig', name: 'DOUBLE DIG', type: 'pass', formation: 'I Form Y Off Close', playbook: OFF, note: 'Two digs same depth. Throw off the hook man' },
    ],

    ctr1high: [
      { playId: 'falcons-off-gun-trips-te-flex-mtn-y-post', name: 'MTN Y POST', type: 'pass', formation: 'Gun Trips TE Flex', playbook: OFF, note: 'Pitts on the post. Read the FS hips, work away' },
      { playId: 'falcons-off-gun-spread-y-slot-wk-hitch-seam', name: 'HITCH SEAM', type: 'pass', formation: 'Gun Spread Y Slot Wk', playbook: OFF, note: 'Two seams, one MOF defender. He picks one' },
      { playId: 'falcons-off-gun-trips-y-slot-go-dbl-post', name: 'GO DBL POST', type: 'pass', formation: 'Gun Trips Y Slot', playbook: OFF, note: 'Two posts bracket the single high. Best shot' },
      { playId: 'falcons-off-gun-y-off-trio-close-flood', name: 'FLOOD', type: 'pass', formation: 'Gun Y Off Trio Close', playbook: OFF, note: 'Hi-lo the curl-flat: sinks = flat, widens = sail' },
    ],

    ctrman: [
      { playId: 'falcons-off-gun-bunch-wide-nasty-cheat-drag-rub-crosser', name: 'CHEAT DRAG RUB CROSSER', type: 'pass', formation: 'Gun Bunch Wide Nasty', playbook: OFF, note: 'Tightest split in the book. Built-in rub' },
      { playId: 'falcons-off-gun-bunch-te-mesh-dig', name: 'MESH DIG', type: 'pass', formation: 'Gun Bunch TE', playbook: OFF, note: 'Crossers pick each other, dig is the 3rd level' },
      { playId: 'falcons-off-gun-y-off-trips-close-x-curl', name: 'X CURL', type: 'pass', formation: 'Gun Y Off Trips Close', playbook: OFF, note: 'London isolated backside. Take the 1-on-1' },
      { playId: 'falcons-off-gun-bunch-l-spot', name: 'L SPOT', type: 'pass', formation: 'Gun Bunch', playbook: OFF, note: 'Release traffic frees the spot sitter vs man' },
    ],

    ctrblitz: [
      { playId: 'falcons-off-gun-trips-te-flex-stick', name: 'STICK', type: 'pass', formation: 'Gun Trips TE Flex', playbook: OFF, note: 'Best hot in the book. HB flat is the valve' },
      { playId: 'falcons-off-gun-spread-y-slot-wk-double-slants', name: 'DOUBLE SLANTS', type: 'pass', formation: 'Gun Spread Y Slot Wk', playbook: OFF, note: 'Ball out in 1.2s into the vacated blitz side' },
      { playId: 'falcons-off-gun-empty-base-flex-jailbreak-slot-screen', name: 'JAILBREAK SLOT SCREEN', type: 'pass', formation: 'Gun Empty Base Flex', playbook: OFF, note: 'Whole line releases. Best vs an all-out look' },
      { playId: 'falcons-off-gun-bunch-te-hb-slip-screen', name: 'HB SLIP SCREEN', type: 'run', formation: 'Gun Bunch TE', playbook: OFF, note: 'Bijan 95 in space. Punish the over-pursuit' },
    ],

    ctrtempo: [
      { playId: 'falcons-off-gun-trips-te-flex-mtn-fork-h-choice', name: 'MTN FORK H CHOICE', type: 'pass', formation: 'Gun Trips TE Flex', playbook: OFF, note: 'Option route self-corrects vs man OR zone' },
      { playId: 'falcons-off-gun-trips-te-flex-inside-zone', name: 'INSIDE ZONE', type: 'run', formation: 'Gun Trips TE Flex', playbook: OFF, note: 'Same look, no sub. Punishes a light box' },
      { playId: 'falcons-off-gun-bunch-te-spacing', name: 'SPACING', type: 'pass', formation: 'Gun Bunch TE', playbook: OFF, note: 'Five windows, one at the sticks. Never wrong' },
      { playId: 'falcons-off-gun-tight-y-off-choice-pivot-return', name: 'CHOICE PIVOT RETURN', type: 'pass', formation: 'Gun Tight Y Off', playbook: OFF, note: 'Three self-correcting routes. Bail-out call' },
    ],
  },

  defense: {
    // ── BASE: 2-4-5 Over Wide. Three safeties. Bates DEEP as the user. ──
    base: [
      { playId: 'falcons-def-2--4--5-over-wide-cover-3-sky', name: 'COVER 3 SKY', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Blind-safe #1. Bates deep middle, abilities ON' },
      { playId: 'falcons-def-2--4--5-over-wide-tampa-2', name: 'TAMPA 2', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Blind-safe #2. Deablo runs the pipe, kept clean' },
      { playId: 'falcons-def-2--4--5-over-wide-cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Blind-safe #3. Watts ZCV 81 plays here, not man' },
      { playId: 'falcons-def-2--4--5-over-wide-cover-1-robber', name: 'COVER 1 ROBBER', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Blind-safe #4. Man call: put Phillips in the slot' },
    ],

    vs10: [
      { playId: 'falcons-def-2--4--5-over-wide-cover-6', name: 'COVER 6', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Qtr-qtr-half. Roll the half to their field side' },
      { playId: 'falcons-def-2--4--5-over-wide-cover-3-cloud-show-2', name: 'COVER 3 CLOUD SHOW 2', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Shows 2, plays 3. Cloud kills the sideline' },
      { playId: 'falcons-def-dime-2--3-1-double-wr1', name: '1 DOUBLE WR1', type: 'pass', formation: 'Dime 2-3', playbook: DEF, note: 'Erase the alpha. Bates free as the user' },
      { playId: 'falcons-def-2--4--5-over-wide-cover-2-man', name: 'COVER 2 MAN', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Man under 2 deep. Phillips slot or do not call' },
    ],

    // ── CHECK OUT of 2-4-5 here. It has no interior gap answer. ──
    vs12: [
      { playId: 'falcons-def-nickel-2--4-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Leave 2-4-5. Real front, sound vs PA' },
      { playId: 'falcons-def-3--4-over-cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', formation: '3-4 Over', playbook: DEF, note: 'Split-field partner call, +1 in the box' },
      { playId: 'falcons-def-3--4-over-ss-2-trap', name: 'SS 2 TRAP', type: 'run', formation: '3-4 Over', playbook: DEF, note: 'Trap the force. Kills the flat and the toss' },
    ],

    heavy: [
      { playId: 'falcons-def-3--4-odd-pinch-buck-o', name: 'PINCH BUCK O', type: 'pass', formation: '3-4 Odd', playbook: DEF, note: 'Never light vs 22. Pinch and buck the gaps' },
      { playId: 'falcons-def-3--4-cub-gap-press', name: 'GAP PRESS', type: 'pass', formation: '3-4 Cub', playbook: DEF, note: 'Press man-man. Hand at 1-tech, Dorlus at 3' },
      { playId: 'falcons-def-nickel-2--4-cover-2-match', name: 'COVER 2 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'If they are heavy but throwing, jump the flats' },
    ],

    '3short': [
      { playId: 'falcons-def-3--4-cub-olb-blitz', name: 'OLB BLITZ', type: 'pass', formation: '3-4 Cub', playbook: DEF, note: 'Show blitz, force it wide. Ebukam + Walker in' },
      { playId: 'falcons-def-2--4--5-over-wide-thunder-smoke', name: 'THUNDER SMOKE', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Only 2-4-5 short-yardage call. Pinch the line' },
      { playId: 'falcons-def-2--4--5-over-wide-cover-1-sting', name: 'COVER 1 STING', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Bates in the box HERE and only here' },
    ],

    '3long': [
      { playId: 'falcons-def-2--4--5-over-wide-cover-3-sim-pressure', name: 'COVER 3 SIM PRESSURE', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Show heat, rush 4, keep 7. Best call on the page' },
      { playId: 'falcons-def-2--4--5-over-wide-invert-2-sim', name: 'INVERT 2 SIM', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Second sim look. Same rush, different picture' },
      { playId: 'falcons-def-dime-3--2-rush-mug-sim-pressure', name: 'MUG SIM PRESSURE', type: 'pass', formation: 'Dime 3-2 Rush', playbook: DEF, note: 'Show 6 from dime, rush 4. Pearce + Walker' },
      { playId: 'falcons-def-quarter-normal-3-double-mable', name: '3 DOUBLE MABLE', type: 'pass', formation: 'Quarter Normal', playbook: DEF, note: 'Mable quarters. Flats walled, doubled deep' },
    ],

    pressure: [
      { playId: 'falcons-def-2--4--5-over-wide-free-fire-3', name: 'FREE FIRE 3', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Wide-9 speed off the edge, 3-deep parachute' },
      { playId: 'falcons-def-2--4--5-over-wide-will-blitz-3', name: 'WILL BLITZ 3', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Harris PUR 84 is your best free runner' },
      { playId: 'falcons-def-2--4--5-over-wide-sam-blitz-3', name: 'SAM BLITZ 3', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Mirror it the other way. Same 3-deep rules' },
      { playId: 'falcons-def-2--4--5-over-wide-double-cb-blitz', name: 'DOUBLE CB BLITZ', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Changeup only. Show it twice a game, no more' },
    ],

    redzone: [
      { playId: 'falcons-def-2--4--5-over-wide-cover-1-hole', name: 'COVER 1 HOLE', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Hole sits the middle. Phillips to the slot' },
      { playId: 'falcons-def-nickel-2--4-1-double-wr1', name: '1 DOUBLE WR1', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Bracket their fade guy, user stays free' },
      { playId: 'falcons-def-2--4--5-over-wide-fire-man', name: 'FIRE MAN', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Heat before they can set the fade' },
      { playId: 'falcons-def-nickel-2--4-cover-2-match', name: 'COVER 2 MATCH', type: 'pass', formation: 'Nickel 2-4', playbook: DEF, note: 'Flats jumped at the goal line' },
    ],

    goalline: [
      { playId: 'falcons-def-goal-line-6--2-60-pinch', name: '60 PINCH', type: 'pass', formation: 'Goal Line 6-2', playbook: DEF, note: 'Everyone inside. Sneak and push are dead' },
      { playId: 'falcons-def-goal-line-6--2-guts', name: 'GUTS', type: 'pass', formation: 'Goal Line 6-2', playbook: DEF, note: 'Holds up if they throw it instead' },
    ],

    prevent: [
      { playId: 'falcons-def-prevent-3-deep-prevent', name: 'PREVENT', type: 'pass', formation: 'Prevent 3 Deep', playbook: DEF, note: 'Up big: boundary and clock, nothing else' },
      { playId: 'falcons-def-dime-2--3-cover-3-buzz-match', name: 'COVER 3 BUZZ MATCH', type: 'pass', formation: 'Dime 2-3', playbook: DEF, note: 'Rally and tackle. Nothing over the top' },
      { playId: 'falcons-def-2--4--5-over-wide-mikesam-cross-3', name: 'MIKESAM CROSS 3', type: 'pass', formation: '2-4-5 Over Wide', playbook: DEF, note: 'Crossing heat if they need a chunk, not a TD' },
    ],
  },
}
