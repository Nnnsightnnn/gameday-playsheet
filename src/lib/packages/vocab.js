// Adjustment vocabulary for custom adjustment packages (Madden 27 macros).
//
// Every adjustment a package can stack lives here, with the controller path
// that sets it, whether a macro stores it, and a confidence tag using the
// same spine as the Personnel Lab (src/data/personnel.js CONFIDENCE):
//   ea   EA gameplay deep dive / EA patch notes
//   m27  Madden 27 specific, credible non-EA (Civil.GG, Madden School)
//   m26  carryover from the previous game, not yet confirmed in 27
//   read inference; test it in the lab before trusting it
//
// Sources: EA "Madden 27 Gameplay Deep Dive" (Smart Zones, alignment
// control, plaster, roll coverage, match checks, custom adjustments),
// Civil.GG global + in-game defensive adjustment guides (menu paths),
// Civil.GG macro setup (macros store routes, protections, double teams,
// defender ID; tied to depth chart slots), EA TU Sep 16 (press shading
// penalty, shells respected, contain no longer wipes hot routes),
// Madden School TU Sep 3 (tackles now pick up contain rushers, Aggressive
// Blocking draws holding, no-huddle keeps adjustments).

// Menu order a recipe is entered in. Global coverage first, individual
// assignments after the fronts, QB contain last so nothing downstream of it
// can reset it.
export const MENUS = {
  coverage: { order: 1, label: 'Coverage menu', ps: 'Hold L2', xbox: 'Hold LT' },
  coach: { order: 2, label: 'Coach adjustments', ps: 'Pre-play coaching', xbox: 'Pre-play coaching' },
  dline: { order: 3, label: 'D-line menu', ps: 'R-stick ←', xbox: 'R-stick ←' },
  lb: { order: 4, label: 'Linebacker menu', ps: 'R-stick →', xbox: 'R-stick →' },
  individual: { order: 5, label: 'Individual assignment', ps: '△ + player', xbox: 'Y + player' },
  read: { order: 6, label: 'Pass/run read', ps: 'R1', xbox: 'RB' },
  protection: { order: 1, label: 'Protection', ps: 'Pre-play protection', xbox: 'Pre-play protection' },
  blocking: { order: 2, label: 'Blocking', ps: 'Pre-play blocking', xbox: 'Pre-play blocking' },
  hot: { order: 3, label: 'Hot route', ps: '△ + receiver', xbox: 'Y + receiver' },
  line: { order: 9, label: 'At the line', ps: 'Manual', xbox: 'Manual' },
}

export const DEF_POSITIONS = [
  'LEDG', 'REDG', 'DT', 'MIKE', 'WILL', 'SAM', 'CB1', 'CB2', 'SLOT', 'FS', 'SS',
]
export const OFF_POSITIONS = ['HB', 'TE', 'WR1', 'WR2', 'WR3', 'QB']

// Macros bind to depth-chart slots, not field spots, so a flipped formation
// swaps WR1/WR2 while their assignments stay put (Civil.GG macro guide).
export const FLIP_FRAGILE = new Set(['WR1', 'WR2'])

const ZONES = [
  'Hook/Curl', 'Buzz', 'Hard Flat', 'Cloud Flat', 'Curl/Flat',
  'Vertical Hook', 'Deep Third', 'Deep Half', 'Deep Quarter',
]
const SMART_ZONE = [
  'Ultra Aggressive', 'Aggressive', 'Balanced', 'Conservative', 'Ultra Conservative',
]
const MATCH_CHECKS = [
  'Combo', 'Triangle', 'Top Hat', 'Lock', 'Point Combo', 'Box', 'Bingo',
  'Skate', 'Skinny', 'Stress', 'Solo', 'Zone It',
]
const ROUTES = [
  'Slant', 'Drag', 'Streak', 'Fade', 'Out', 'In', 'Curl', 'Comeback',
  'Flat', 'Wheel', 'Post', 'Corner', 'Return', 'Zig', 'Smart Route',
]

// kind: what the adjustment does to the rush/drop arithmetic.
//   rush   the target becomes a rusher      drop  the target drops into coverage
//   block  the target stays in to block     none  alignment / behaviour only
// macro: true = stored in a custom adjustment; false = set by hand at the line.
export const ADJUSTMENTS = [
  // ── defense: global coverage ────────────────────────────────────────────
  { id: 'cov-align', side: 'defense', menu: 'coverage', label: 'Coverage alignment', options: ['Press', 'Base', 'Back Off'], kind: 'none', macro: true, conf: 'm27',
    hint: 'Press sells man and zero. Since TU Sep 16 a press corner shaded the wrong way pays for it at the release, so set leverage with it.' },
  { id: 'cov-leverage', side: 'defense', menu: 'coverage', label: 'Leverage / shade', options: ['Shade Over Top', 'Shade Underneath', 'Commit Inside', 'Commit Outside'], kind: 'none', macro: true, conf: 'm27',
    hint: 'Commit Inside takes away slants and crossers; Over Top protects the go ball. Shading corners does not move deep zones.' },
  { id: 'smart-zone', side: 'defense', menu: 'coverage', label: 'Smart Zone strategy', options: SMART_ZONE, kind: 'none', macro: true, conf: 'ea',
    hint: 'How hard zone defenders break on throws in front of them.' },
  { id: 'zone-behavior', side: 'defense', menu: 'coverage', label: 'Zone behavior', options: ['Look For Work', 'Plaster', 'Focus', 'Red Zone Awareness'], kind: 'none', macro: true, conf: 'ea',
    hint: 'Look For Work makes an empty-zone defender go find a route, which is how you catch a return route coming back into you.' },
  { id: 'plaster', side: 'defense', menu: 'coverage', label: 'Plaster logic', options: ['Off', 'Conservative', 'Aggressive'], kind: 'none', macro: true, conf: 'ea',
    hint: 'Zones attach to the nearest receiver once the QB extends the play.' },
  { id: 'roll', side: 'defense', menu: 'coverage', label: 'Roll coverage', options: ['Pass Strength', 'Field', 'Boundary', 'Fastest', 'Highest OVR'], kind: 'none', macro: true, conf: 'ea',
    hint: 'Where the rotation and the help go after the snap. This is the heart of a roll disguise.' },
  { id: 'match-check', side: 'defense', menu: 'coverage', label: 'Match check', options: MATCH_CHECKS, kind: 'none', macro: true, conf: 'ea',
    hint: 'Formation-specific rules: Combo/Triangle/Top Hat/Lock vs stacks and bunch in man, Box/Stress/Solo/Skate vs trips in match zone.' },

  // ── defense: alignment control ──────────────────────────────────────────
  { id: 'cb-depth', side: 'defense', menu: 'coach', label: 'CB depth', options: ['Tight', 'Base', 'Deep'], kind: 'none', macro: true, conf: 'ea',
    hint: 'Option names are the lab’s shorthand; the slider exists in the EA deep dive.' },
  { id: 'cb-width', side: 'defense', menu: 'coach', label: 'CB width', options: ['Inside', 'Base', 'Outside'], kind: 'none', macro: true, conf: 'ea' },
  { id: 'safety-depth', side: 'defense', menu: 'coach', label: 'Safety depth', options: ['Shallow', 'Base', 'Deep'], kind: 'none', macro: true, conf: 'ea',
    hint: 'The main shell-disguise lever: shallow safeties read as zero or a rotated single-high, deep ones as two-high.' },
  { id: 'safety-width', side: 'defense', menu: 'coach', label: 'Safety width', options: ['Pinch', 'Base', 'Wide'], kind: 'none', macro: true, conf: 'ea' },
  { id: 'safety-midpoint', side: 'defense', menu: 'coach', label: 'Safety midpoint', options: ['Field', 'Middle', 'Boundary', 'Pass Strength'], kind: 'none', macro: true, conf: 'ea',
    hint: 'Offsets the pair so a two-high shell can look like a single-high rotated one way.' },

  // ── defense: fronts ─────────────────────────────────────────────────────
  { id: 'dl-align', side: 'defense', menu: 'dline', label: 'D-line alignment', options: ['Pinch', 'Spread', 'Shift Left', 'Shift Right'], kind: 'none', macro: true, conf: 'm27' },
  { id: 'dl-slant', side: 'defense', menu: 'dline', label: 'D-line slant', options: ['Slant Inside', 'Slant Outside'], kind: 'none', macro: true, conf: 'm27' },
  { id: 'dl-poa', side: 'defense', menu: 'dline', label: 'Point of attack', options: ['Inside', 'Outside'], kind: 'none', macro: true, conf: 'm27',
    hint: 'Inside POA plus pinch is the Loop Man 0 recipe.' },
  { id: 'dl-stunt', side: 'defense', menu: 'dline', label: 'D-line stunt', options: ['Tackle-End (Tex)', 'End-Tackle', 'Tackle-Tackle', 'Loop'], kind: 'none', macro: true, conf: 'read',
    hint: 'Stunts cycle on the bumper inside the D-line menu; the labels here are the football names, not confirmed menu text.' },
  { id: 'lb-mode', side: 'defense', menu: 'lb', label: 'Linebacker call', options: ['Blitz All', 'Blitz One', 'Blitz Two', 'Zone All'], kind: 'none', macro: true, conf: 'm27' },
  { id: 'show-blitz', side: 'defense', menu: 'lb', label: 'Show blitz', options: ['On'], kind: 'none', macro: true, conf: 'm27',
    hint: 'Only the linebackers creep, not the whole defense.' },

  // ── defense: individual assignments (need a target) ─────────────────────
  { id: 'ind-blitz', side: 'defense', menu: 'individual', label: 'Blitz', options: ['A Gap', 'B Gap', 'Edge', 'Default'], kind: 'rush', target: true, macro: true, conf: 'm27' },
  { id: 'ind-contain', side: 'defense', menu: 'individual', label: 'QB contain', options: ['On'], kind: 'rush', target: true, macro: true, conf: 'm27',
    hint: 'Since TU Sep 3 tackles pick up contain rushers: contain keeps the QB in the pocket, it no longer manufactures pressure.' },
  { id: 'ind-spy', side: 'defense', menu: 'individual', label: 'QB spy', options: ['On'], kind: 'drop', target: true, macro: true, conf: 'm26' },
  { id: 'ind-zone', side: 'defense', menu: 'individual', label: 'Zone drop', options: ZONES, kind: 'drop', target: true, macro: true, conf: 'm27' },
  { id: 'ind-man', side: 'defense', menu: 'individual', label: 'Man on', options: ['HB', 'TE', 'WR1', 'WR2', 'WR3', 'Slot'], kind: 'drop', target: true, macro: true, conf: 'm27' },
  { id: 'ind-double', side: 'defense', menu: 'individual', label: 'Double team', options: ['WR1', 'WR2', 'TE', 'Slot'], kind: 'drop', target: true, macro: true, conf: 'ea' },
  { id: 'ind-deep-focus', side: 'defense', menu: 'individual', label: 'Deep zone focus', options: ['On'], kind: 'drop', target: true, macro: true, conf: 'ea' },

  // ── defense: read + user ────────────────────────────────────────────────
  { id: 'contain-all', side: 'defense', menu: 'read', label: 'QB contain (both edges)', options: ['On'], kind: 'none', macro: true, conf: 'm27',
    hint: 'R1 then L1. Works out of any coverage. No longer wipes hot routes (TU Sep 16).' },
  { id: 'guess-pass', side: 'defense', menu: 'read', label: 'Guess pass', options: ['On'], kind: 'none', macro: true, conf: 'm27' },
  { id: 'hover', side: 'defense', menu: 'line', label: 'User hover', options: ['A Gap', 'B Gap', 'Edge'], kind: 'none', macro: false, conf: 'm27',
    hint: 'Hold L2/LT over a gap pre-snap. A user skill, never stored in a macro.' },

  // ── offense: protection + blocking ──────────────────────────────────────
  { id: 'protect', side: 'offense', menu: 'protection', label: 'Protection', options: ['Full Slide Left', 'Full Slide Right', 'Half Slide Left', 'Half Slide Right', 'Max Protect', 'Empty Base'], kind: 'none', macro: true, conf: 'm27',
    hint: 'TU Sep 16 fixed Half Slide flipping to Full Slide on its own.' },
  { id: 'id-mike', side: 'offense', menu: 'protection', label: 'ID the Mike', options: ['Left Mug', 'Right Mug', 'Mike', 'Untarget'], kind: 'none', macro: true, conf: 'm27',
    hint: 'Points the protection at the defender who is actually coming.' },
  { id: 'block-style', side: 'offense', menu: 'blocking', label: 'Blocking style', options: ['Balanced', 'Conservative', 'Aggressive'], kind: 'none', macro: true, conf: 'm27',
    hint: 'Aggressive now draws real holding (TU Sep 3).' },
  { id: 'double-team', side: 'offense', menu: 'blocking', label: 'Double team', options: ['Nose / 1-tech', '3-tech', 'Left Edge', 'Right Edge'], kind: 'none', macro: true, conf: 'm27' },
  { id: 'ind-block', side: 'offense', menu: 'hot', label: 'Stay in and block', options: ['Pass Block', 'Chip then Release'], kind: 'block', target: true, macro: true, conf: 'm26',
    hint: 'Chip then Release counts as a blocker for the first beat and a receiver after.' },
  { id: 'hot-route', side: 'offense', menu: 'hot', label: 'Hot route', options: ROUTES, kind: 'none', target: true, macro: true, conf: 'm27' },
  { id: 'motion', side: 'offense', menu: 'line', label: 'Motion', options: ['Across', 'Jet', 'Return', 'Shift to Bunch'], kind: 'none', target: true, macro: false, conf: 'm27',
    hint: 'Motion is set by hand at the line; a macro cannot store it.' },
  { id: 'flip', side: 'offense', menu: 'line', label: 'Flip the play', options: ['On'], kind: 'none', macro: false, conf: 'm27',
    hint: 'Flipping swaps WR1/WR2 on the field while a macro keeps them on their old assignments.' },
]

const BY_ID = new Map(ADJUSTMENTS.map((a) => [a.id, a]))
export const adjustmentById = (id) => BY_ID.get(id)

export const adjustmentsForSide = (side) =>
  ADJUSTMENTS.filter((a) => a.side === side)

// Coverage shells, as the number of deep safeties the offense sees or faces.
export const SHELLS = [
  { id: 0, label: 'Zero', short: '0-high' },
  { id: 1, label: 'Single high', short: '1-high' },
  { id: 2, label: 'Two high', short: '2-high' },
  { id: 3, label: 'Three high', short: '3-high' },
]
