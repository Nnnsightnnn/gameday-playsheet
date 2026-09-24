// Adjustment vocabulary for custom adjustment packages (Madden 27 macros).
//
// Every adjustment a package can stack lives here, with the controller path
// that sets it, whether a macro stores it, and a confidence tag using the
// same spine as the Personnel Lab (src/data/personnel.js CONFIDENCE):
//   ea   EA gameplay deep dive / EA tips / EA patch notes
//   m27  Madden 27 specific, credible non-EA (Civil.GG, AceMadden editor
//        mirror, 818 Madden, Madden School)
//   m26  carryover from the previous game, not yet confirmed in 27
//   read inference; test it in the lab before trusting it
// `conf` is how sure we are the adjustment exists with these options.
// `macroConf`, where present, is lower: the thing exists but whether a
// custom adjustment stores it is less certain.
//
// Research pass 2026-09-23 (55 defensive + 29 offensive items) merged here.
// Ids from the first pass are kept so saved Dexie packages keep loading;
// renamed option labels migrate through VALUE_ALIASES / normalizeAdjustment.
// Deliberately left out: the Custom Adjustment container itself and EA's
// preset macros (QB Scramble, Go Vertical, Slants...), which are whole
// macros, not a step inside one.

const EA27 = 'EA M27 Gameplay Deep Dive https://www.ea.com/games/madden-nfl/madden-nfl-27/news/madden-27-gameplay'
const EA_SHELL = 'EA M27 Tips: How to Use Coverage Shells https://www.ea.com/games/madden-nfl/madden-nfl-27/tips-and-tricks-hub/m27-how-to-use-coverage-shells'
const EA_RUN = 'EA M27 Tips: How to Stop the Run https://www.ea.com/games/madden-nfl/madden-nfl-27/tips-and-tricks-hub/m27-how-to-stop-the-run'
const EA26_SHELL = 'EA M26 Tips: Coverage Shells, Custom Stem Zones, Route Commit https://www.ea.com/games/madden-nfl/madden-nfl-26/tips-and-tricks-hub/m26-how-to-use-coverage-shells'
const EA26 = 'EA M26 Gameplay Deep Dive https://www.ea.com/games/madden-nfl/madden-nfl-26/news/madden-26-gridiron-notes-gameplay-deep-dive'
const EA_CTRL = 'EA M27 PS pre-play offense controls https://www.ea.com/games/madden-nfl/madden-nfl-27/controls-hub/m27-ps-preplay-offense'
const TU16 = 'EA M27 TU Sep 16 https://www.ea.com/games/madden-nfl/madden-nfl-27/news/madden-nfl-27-title-update-september-16'
const ACE = 'AceMadden M27/CFB27 Macro Builder (mirror of the in-game Custom Adjustments editor) https://acemadden.com/tools/macro-builder'
const CIVIL_D = 'Civil.GG M27 in-game/global defensive adjustments https://www.civil.gg/tips/madden-27-in-game-defensive-adjustments'
const CIVIL_MACRO = 'Civil.GG M27 macro setup https://www.civil.gg/tips/madden-27-custom-adjustment-macros-setup'
const CIVIL_CFB = 'Civil.GG CFB 27 defense guide https://www.civil.gg/tips/cfb-27-complete-defense-guide'
const CIVIL_PROT = 'Civil.GG M27 pass protection basics https://www.civil.gg/tips/madden-27-pass-protection-basics'
const CIVIL_OFF = 'Civil.GG M27 offense guide https://www.civil.gg/tips/madden-27-complete-offense-guide'
const TURF = 'MaddenTurf CFB 27 macros guide https://maddenturf.com/cfb-27-macros/'
const MS_SEP3 = 'M27 TU Sep 3 notes via Madden School https://www.madden-school.com/madden-27-september-3rd-2026-title-update/'
const MS_HOT = 'Madden School, every hot route in M26 https://www.madden-school.com/every-hot-route-in-madden-26-there-are-lots-of-new-ones/'
const BWT = 'M27 TU Sep 16 notes via ButWhyTho https://butwhytho.net/2026/09/madden-27-september-title-update-franchise/'
const GGWTB = 'GGWTB M27 defensive adjustments guide https://ggwtb.com/blog/madden-nfl-27-defensive-adjustments-guide-best-coverage--d-line--and-linebacker-controls'
const MUTGG40 = 'MUT.GG Ask Huddle #40 (M26) https://www.mut.gg/news/ask-huddle-40-how-pass-blocking-actually-works-in-madden/'
const M818 = '818 Madden M27 position adjustments https://www.818madden.com/tools/position-adjustments'
const src = (...s) => s.join(' ; ')

// Menu order a recipe is entered in. Global coverage first, individual
// assignments after the fronts, QB contain last so nothing downstream of it
// can reset it. Offense: protection, then blocking, then hot routes; the
// manual steps (audible, motion, at the line) always sort after the macro.
export const MENUS = {
  coverage: { order: 1, label: 'Coverage menu', ps: 'Hold L2', xbox: 'Hold LT' },
  coach: { order: 2, label: 'Coach adjustments', ps: 'Pre-play coaching', xbox: 'Pre-play coaching' },
  dline: { order: 3, label: 'D-line menu', ps: 'R-stick ←', xbox: 'R-stick ←' },
  lb: { order: 4, label: 'Linebacker menu', ps: 'R-stick →', xbox: 'R-stick →' },
  individual: { order: 5, label: 'Individual assignment', ps: '△ + player', xbox: 'Y + player' },
  read: { order: 6, label: 'Pass/run read', ps: 'R1', xbox: 'RB' },
  protection: { order: 1, label: 'Protection', ps: 'Hold L2 at the line', xbox: 'Hold LT at the line' },
  blocking: { order: 2, label: 'Blocking', ps: 'Pre-play blocking', xbox: 'Pre-play blocking' },
  hot: { order: 3, label: 'Hot route', ps: '△ + receiver', xbox: 'Y + receiver' },
  audible: { order: 7, label: 'Audible', ps: '□ at the line', xbox: 'X at the line' },
  motion: { order: 8, label: 'Motion', ps: 'Select player, hold L-stick ←/→', xbox: 'Select player, hold L-stick ←/→' },
  line: { order: 9, label: 'At the line', ps: 'Manual', xbox: 'Manual' },
}

export const DEF_POSITIONS = [
  'LEDG', 'REDG', 'DT', 'MIKE', 'WILL', 'SAM', 'CB1', 'CB2', 'SLOT', 'FS', 'SS',
]
export const OFF_POSITIONS = ['HB', 'TE', 'WR1', 'WR2', 'WR3', 'QB']

// Macros bind to depth-chart slots, not field spots, so a flipped formation
// swaps WR1/WR2 while their assignments stay put (Civil.GG macro guide).
export const FLIP_FRAGILE = new Set(['WR1', 'WR2'])

// Receivers a defensive adjustment can point at (the receiver icon under L2).
const RECEIVERS = ['WR1', 'WR2', 'WR3', 'TE', 'HB', 'Slot']
const FRONT_SEVEN = ['LEDG', 'REDG', 'DT', 'MIKE', 'WILL', 'SAM']
const GRADES = ['Aggressive', 'Balanced', 'Conservative']
const DEPTHS = ['Default', '0', '5', '10', '15', '20', '25', '30']

// ── Coverage Shell ───────────────────────────────────────────────────────
// The pre-snap safety picture, chosen on the play-call screen with the right
// stick and stored in a custom adjustment (AceMadden editor: Secondary >
// Coverage Shell). Mapped to the lab's shell number: deep safeties the QB
// reads pre-snap (0 none, 1 middle closed, 2 middle open).
export const COVERAGE_SHELLS = ['Cover 0', 'Cover 2 Man', 'Cover 2', 'Cover 3', 'Cover 4', 'Cover 6']
export const SHELL_OF_COVERAGE_SHELL = {
  'Cover 0': 0,
  'Cover 2 Man': 2,
  'Cover 2': 2,
  'Cover 3': 1,
  'Cover 4': 2,
  'Cover 6': 2,
}
// CFB 27 names the same picker differently and has no Cover 6 shell.
export const CFB_SHELL_OF_COVERAGE_SHELL = {
  'CV Zero': 0,
  'CV Two Man': 2,
  'CV 2': 2,
  'CV 3': 1,
  'CV 4': 2,
}
const SHELL_ADJ = {
  'coverage-shell': SHELL_OF_COVERAGE_SHELL,
  'cfb-coverage-shell': CFB_SHELL_OF_COVERAGE_SHELL,
}
export const isShellAdjustment = (id) => id in SHELL_ADJ
// Shell number an adjustment programs, or undefined if it is not a shell.
export const shellOfAdjustment = (a) => SHELL_ADJ[a?.adj]?.[a.value]

// The editor mirror shows "Default" where the research list shows Balanced;
// they are the same middle setting.
const SMART_ZONE = ['Ultra Aggressive', 'Aggressive', 'Balanced', 'Conservative', 'Ultra Conservative']
const MATCH_CHECKS = [
  'Default', 'Box', 'Bingo', 'Triangle', 'Point Triangle', 'Skate', 'Skinny',
  'Skinny Meg', 'Stress', 'Stubbie', 'Stump', 'Solo', 'Solo Cut', 'Zone It',
  'Seam', 'Quarters', 'Palms',
]
// Which match checks the editor offers per coverage family and structure
// (AceMadden editor mirror). The flat list above is their union.
export const MATCH_CHECK_MATRIX = {
  '3 Match: Stack': ['Default', 'Seam', 'Zone It'],
  '3 Match: Bunch': ['Default', 'Skate', 'Skinny', 'Skinny Meg', 'Zone It'],
  '3 Match: Trips': ['Default', 'Skate', 'Skinny', 'Skinny Meg', 'Zone It'],
  'Quarters: Stack': ['Default', 'Quarters', 'Zone It'],
  'Quarters: Bunch': ['Default', 'Box', 'Bingo', 'Zone It'],
  'Quarters: Trips': ['Default', 'Quarters', 'Stress', 'Zone It'],
  'Quarters: 1 Rec': ['Default', 'Solo', 'Solo Cut', 'Quarters'],
  'Palms: Stack': ['Default', 'Palms', 'Zone It'],
  'Palms: Bunch': ['Default', 'Box', 'Bingo', 'Zone It'],
  'Palms: Trips': ['Default', 'Stubbie', 'Stump', 'Zone It'],
  'Palms: 1 Rec': ['Default', 'Solo', 'Solo Cut', 'Quarters'],
  'Cover 6: Stack': ['Default', 'Palms', 'Zone It', 'Quarters'],
  'Cover 6: Bunch': ['Default', 'Box', 'Bingo', 'Zone It'],
  'Cover 6: Trips': ['Default', 'Stubbie', 'Stump', 'Zone It'],
}
// Individual zone palette per position (AceMadden editor mirror; the live
// game may offer more). No Buzz, Robber, Lurk or Rat label exists in M27.
export const ZONES_BY_POSITION = {
  CB: ['Outside Third', 'Cloud Flat', 'Hard Flat', 'Curl Flat', 'Deep Half', 'Inside Quarter', 'Soft Squat'],
  SLOT: ['Seam Flat', 'Vertical Hook', 'Hard Flat', 'Curl Flat', 'Deep Half', 'Hook Curl'],
  S: ['Middle Read', 'Hook Curl', 'Inside Third', 'Curl Flat', 'Deep Half', 'Outside Third', 'Inside Quarter'],
  LB: ['Seam Flat', 'Vertical Hook', 'Hard Flat', 'Curl Flat', 'Deep Half', 'Hook Curl'],
  MIKE: ['Middle Read', 'Hook Curl', 'Hard Flat', 'Curl Flat', 'Middle Third', '3 Rec Hook'],
  EDGE: ['Vertical Hook', 'Hook Curl', 'Hard Flat', 'Curl Flat', 'Soft Squat', '3 Rec Hook'],
  DL: ['Hook Curl Left', 'Hook Curl Right', 'Curl Left', 'Curl Right', '3 Rec Hook'],
}
const ZONES = [
  'Outside Third', 'Cloud Flat', 'Hard Flat', 'Curl Flat', 'Deep Half',
  'Inside Quarter', 'Soft Squat', 'Seam Flat', 'Vertical Hook', 'Hook Curl',
  'Middle Read', 'Inside Third', 'Middle Third', '3 Rec Hook',
  'Hook Curl Left', 'Hook Curl Right', 'Curl Left', 'Curl Right',
]
const STUNTS = [
  'Left Exit 2 Man', 'Left Tex 2 Man', 'Left Tom 2 Man', 'Left Pirate 3 Man', 'Left Tempe 4 Man',
  'Right Exit 2 Man', 'Right Tex 2 Man', 'Right Tom 2 Man', 'Right Pirate 3 Man', 'Right Tempe 4 Man',
  'El Paso 4 Man', 'Texas 4 Man',
]

// Hot route menus differ by alignment (818 Madden M27 position adjustments).
// The hot-route adjustment offers the union; the engine warns when a route
// is not on the menu of the player it is given to.
export const HOT_ROUTES_BY_ALIGNMENT = {
  outside: ['Fade', 'Out', 'In', 'Curl', 'Post', 'Corner', 'Slant', 'Drag', 'Deep Over', 'Sluggo', 'Post Sit', 'Return', 'Comeback', 'Smoke Screen', 'Smart Route'],
  slot: ['Streak', 'Speed Out', 'In', 'Curl', 'Post', 'Corner', 'Slant', 'Drag', 'Deep Cross', 'Zig', 'Short Cross', 'Return', 'Slot Fade', 'Flat', 'Smart Route'],
  te: ['Streak', 'In', 'Out', 'Curl', 'Post', 'Slant', 'Corner', 'Drag', 'Deep Cross', 'Wheel', 'Zig', 'Return', 'Stick Nod', 'Smart Route'],
  hb: ['Streak', 'In', 'Out', 'Curl', 'Flat', 'Swing Left', 'Swing Right', 'Triple Option', 'Texas', 'Post', 'Corner', 'Wheel', 'Smart Route'],
}
// Which menus a depth-chart slot can be standing in: WR3 and TE move between
// the slot and the boundary / the line depending on formation.
export const HOT_ALIGNMENTS_FOR = {
  WR1: ['outside', 'slot'],
  WR2: ['outside', 'slot'],
  WR3: ['slot', 'outside'],
  TE: ['te', 'slot'],
  HB: ['hb'],
}
const ROUTES = [...new Set(Object.values(HOT_ROUTES_BY_ALIGNMENT).flat())]

// kind: what the adjustment does to the rush/drop arithmetic.
//   rush   the target becomes a rusher      drop  the target drops into coverage
//   block  the target stays in to block     none  alignment / behaviour only
// macro: true = stored in a custom adjustment; false = set by hand.
// game: set only when the adjustment exists in one game.
export const ADJUSTMENTS = [
  // ── defense: coverage menu (L2/LT hub) ───────────────────────────────────
  { id: 'coverage-shell', side: 'defense', menu: 'coverage', label: 'Coverage shell', options: COVERAGE_SHELLS, kind: 'none', macro: true, conf: 'ea', macroConf: 'm27', game: 'madden',
    source: src(EA_SHELL, ACE, TU16),
    hint: 'The safety picture they see pre-snap while the called coverage plays after it. Picked on the play-call screen with the right stick (options vary by formation) and stored in a custom adjustment under Secondary > Coverage Shell per the AceMadden macro builder. TU Sep 16: shells are now respected when called. EA tip: https://www.ea.com/games/madden-nfl/madden-nfl-27/tips-and-tricks-hub/m27-how-to-use-coverage-shells' },
  { id: 'cfb-coverage-shell', side: 'defense', menu: 'coverage', label: 'Coverage shell (CFB 27)', options: Object.keys(CFB_SHELL_OF_COVERAGE_SHELL), kind: 'none', macro: true, conf: 'm27', game: 'cfb',
    source: src(CIVIL_CFB, TURF),
    hint: 'CFB 27 version of the shell picker, right stick on the play-call screen. MaddenTurf reports a launch bug where macros misalign shells: check it in practice.' },
  { id: 'cov-align', side: 'defense', menu: 'coverage', label: 'Press / back off', options: ['Press', 'Back Off'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'Editor: Secondary > Alignment (Give Cushion | Press). Press sells man and zero; since TU Sep 16 a press corner shaded the wrong way pays for it at the release, so set leverage with it. Per-receiver version: Press / leverage on one man.' },
  { id: 'cov-leverage', side: 'defense', menu: 'coverage', label: 'Coverage shading', options: ['Inside', 'Outside', 'Over the Top', 'Underneath'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'Editor: General > Coverage Shading. Inside takes away slants and crossers; Over the Top protects the go ball. Shading corners does not move deep zones.' },
  { id: 'pass-commit', side: 'defense', menu: 'coverage', label: 'Route commit', options: ['Default', 'Inside', 'Outside'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE, EA26_SHELL),
    hint: 'Editor: General > Route Commit. Jump inside breakers (slants, digs) or outside breakers (outs, corners). Moved into the L2 hub in M27.' },
  { id: 'smart-zone', side: 'defense', menu: 'coverage', label: 'Smart Zone strategy', options: SMART_ZONE, kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'Editor: Coverage Strategy > Zone Strategy. How hard zone defenders break on throws in front of them: Ultra Aggressive jumps the quick game, Ultra Conservative caps verticals.' },
  { id: 'zone-behavior', side: 'defense', menu: 'coverage', label: 'Look For Work', options: ['On', 'Off'], kind: 'none', macro: true, conf: 'ea', macroConf: 'read',
    source: EA27,
    hint: 'When a zone empties, the defender hunts the next route instead of guarding grass, which is how you catch a return route coming back into you.' },
  { id: 'red-zone-awareness', side: 'defense', menu: 'coverage', label: 'Red Zone Awareness', options: ['On', 'Off'], kind: 'none', macro: true, conf: 'ea', macroConf: 'read',
    source: EA27,
    hint: 'Tightens zone spacing near the goal line where the field shrinks.' },
  { id: 'ind-deep-focus', side: 'defense', menu: 'coverage', label: 'Deep zone focus', options: [...RECEIVERS, 'Clear'], kind: 'none', macro: true, conf: 'ea', macroConf: 'read',
    source: EA27,
    hint: 'L2, select the receiver icon: deep coverage leans over the top of the one receiver who cannot beat you. EA Smart Zones calls this Focus.' },
  { id: 'plaster', side: 'defense', menu: 'coverage', label: 'Plaster', options: ['Off', 'Conservative', 'Aggressive'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'On extended plays, backside (Conservative, the default) or all (Aggressive) zone defenders lock onto the nearest receiver.' },
  { id: 'plaster-trigger', side: 'defense', menu: 'coverage', label: 'Plaster trigger', options: ['Out of Pocket and Time', 'Out of Pocket', 'Time'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'What fires plaster: the QB leaving the pocket, the clock, or both (the default and the safest).' },
  { id: 'plaster-time', side: 'defense', menu: 'coverage', label: 'Plaster time', options: ['Aggressive', 'Default', 'Conservative'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'How soon plaster kicks in: Aggressive against scramblers, Conservative to keep zone structure longer.' },
  { id: 'roll', side: 'defense', menu: 'coverage', label: 'Roll coverage', options: ['Highest OVR', 'Fastest', 'Field', 'Boundary', 'Pass Strength', 'WR1', 'WR2', 'WR3', 'TE1', 'TE2'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'Where the rotation and the help go after the snap (default Highest OVR). This is the heart of a roll disguise.' },
  { id: 'ind-double', side: 'defense', menu: 'coverage', label: 'Double team receiver', options: RECEIVERS, kind: 'none', macro: true, conf: 'ea', macroConf: 'read',
    source: src(EA27, CIVIL_D),
    hint: 'L2, select the receiver icon, Square/X: brackets him automatically. Moved from the individual menu to the L2 hub in M27.' },
  { id: 'cross-man', side: 'defense', menu: 'coverage', label: 'Cross man (match defender)', options: RECEIVERS, kind: 'drop', target: true, macro: true, conf: 'ea', macroConf: 'read',
    source: EA27,
    hint: 'L2, select the receiver icon, pick the defender: your best cover man on their best receiver regardless of alignment.' },
  { id: 'corner-matchup', side: 'defense', menu: 'coverage', label: 'Corner matchup', options: ['By OVR', 'By Speed', 'By Height', 'By Route Running', 'By Depth Chart'], kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'Auto-assigns corners to receivers by a trait, e.g. tallest CB on the tallest WR. Editor field under Secondary; the in-game path is not confirmed.' },
  { id: 'ballhawk', side: 'defense', menu: 'coverage', label: 'Ballhawk', options: ['Aggressive', 'Conservative'], kind: 'none', macro: true, conf: 'm27',
    source: src(ACE, BWT),
    hint: 'How hard defenders play the ball in the air versus securing the tackle. TU Sep 16 lets the user strafe while in Ballhawk.' },
  { id: 'man-check-stack', side: 'defense', menu: 'coverage', label: 'Man check vs stack', options: ['Default', 'Combo', 'Triangle', 'Top Hat', 'Lock'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'The man rule vs stacked receivers so the release does not become a rub. Triangle is Cover 2 Man only (EA); the editor mirror shows only Default/Combo/Lock.' },
  { id: 'man-check-bunch', side: 'defense', menu: 'coverage', label: 'Man check vs bunch', options: ['Default', 'Point Combo', 'Point Triangle', 'Lock'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'Lock the point and switch the rest, or stay locked. Point Triangle is Cover 2 Man only (EA).' },
  { id: 'match-check', side: 'defense', menu: 'coverage', label: 'Match coverage check', options: MATCH_CHECKS, kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'How Cover 3 Match, Quarters, Palms and Cover 6 handle stack, bunch, trips and the single-receiver side. 3 Match: Seam/Skate/Skinny; Quarters: Box/Bingo/Stress/Solo; Palms and Cover 6 trips: Stubbie/Stump. CFB 27 gets only basic checks.' },
  { id: 'zone-drop-flats', side: 'defense', menu: 'coverage', label: 'Zone drop depth: flats', options: DEPTHS, kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'Yards. 0 squats the flat; deeper sinks under corners and outs.' },
  { id: 'zone-drop-curls', side: 'defense', menu: 'coverage', label: 'Zone drop depth: curls', options: DEPTHS, kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'Yards. Sit on curls and comebacks, or carry deeper.' },
  { id: 'zone-drop-hooks', side: 'defense', menu: 'coverage', label: 'Zone drop depth: hooks', options: DEPTHS, kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'Yards. Shallow vs drags and mesh, deep to wall off digs.' },
  { id: 'cb-depth', side: 'defense', menu: 'coverage', label: 'CB depth', options: ['Default', 'Press', '3', '5', '7', '9', '12', '20'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'Yards off the ball. Slider stops are from the editor mirror.' },
  { id: 'cb-width', side: 'defense', menu: 'coverage', label: 'CB width', options: ['Default', 'Tight', 'Wide'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'Inside or outside the receiver to take away inside- or outside-breaking routes.' },
  { id: 'safety-depth', side: 'defense', menu: 'coverage', label: 'Safety depth', options: ['Default', '5', '9', '12', '16', '25', '32'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE, CIVIL_CFB),
    hint: 'Yards. The main shell-disguise lever: 5 reads as zero or a rotated single-high, 16 and deeper as two-high. CFB 27 range is 5-16.' },
  { id: 'safety-width', side: 'defense', menu: 'coverage', label: 'Safety width', options: ['Default', 'Pinch', 'Spread', 'Wide'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'Pinch protects the middle, wide protects the sidelines; both change the shell the QB reads.' },
  { id: 'safety-midpoint', side: 'defense', menu: 'coverage', label: 'Safety midpoint', options: ['Default', 'Left', 'Right', 'Strong', 'Weak', 'Field', 'Boundary'], kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, ACE),
    hint: 'Offsets the pair so a two-high shell can look like a single-high rotated one way.' },
  { id: 'protect-sticks', side: 'defense', menu: 'coverage', label: 'Protect the sticks', options: ['On'], kind: 'none', macro: false, conf: 'read',
    source: GGWTB,
    hint: 'Drops zone defenders to the first-down marker. Only GGWTB lists it for M27 (L2 + L1); not in the editor mirror, so set it by hand.' },

  // ── defense: coach adjustments (editor General tab) ─────────────────────
  { id: 'defender-aggression', side: 'defense', menu: 'coach', label: 'Defender aggression', options: GRADES, kind: 'none', macro: true, conf: 'm27',
    source: src(ACE, EA27),
    hint: 'Aggressive plays downhill: bigger wins, bigger mistakes (bites on play action, more penalties, tires faster).' },
  { id: 'gap-integrity', side: 'defense', menu: 'coach', label: 'Gap integrity', options: GRADES, kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'How strictly defenders stay in their gap versus chasing the ball.' },
  { id: 'strip-ball', side: 'defense', menu: 'coach', label: 'Strip ball', options: GRADES, kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'Trade sure tackles for strip attempts.' },
  { id: 'tackling', side: 'defense', menu: 'coach', label: 'Tackling', options: GRADES, kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'Big-hit versus wrap-up tackling tendency.' },
  { id: 'auto-flip', side: 'defense', menu: 'coach', label: 'Auto flip play call', options: ['Enabled', 'Force Disabled'], kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'Defense flips with the offense’s formation strength; TU Sep 3 made slot DBs follow flipped slot WRs. Force Disabled keeps a roll pointed where you set it.' },
  { id: 'motion-response', side: 'defense', menu: 'coach', label: 'Motion response', options: ['Enabled', 'Force Disabled'], kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'Whether defenders auto-adjust to motion; disable it to hold a disguise.' },
  { id: 'option-keys', side: 'defense', menu: 'coach', label: 'Option / RPO keys',
    options: ['Option Read Key', 'Option Pitch Key', 'RPO Read Key', 'RPO Pass Key'].flatMap((k) => GRADES.map((g) => `${k}: ${g}`)),
    kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'Each key set Aggressive/Balanced/Conservative decides who takes the QB, the pitch, the run or the pass on option and RPO. Stack one row per key.' },

  // ── defense: fronts ─────────────────────────────────────────────────────
  { id: 'dl-align', side: 'defense', menu: 'dline', label: 'D-line technique', options: ['Pinch', 'Spread', 'Left', 'Right'], kind: 'none', macro: true, conf: 'ea',
    source: src(CIVIL_D, ACE),
    hint: 'Pinch vs inside runs, spread vs outside runs and contain, shift toward strength.' },
  { id: 'dl-slant', side: 'defense', menu: 'dline', label: 'D-line slant', options: ['Inside', 'Outside'], kind: 'none', macro: false, conf: 'm27', macroConf: 'read',
    source: CIVIL_D,
    hint: 'Slant the front to beat zone-run blocking angles. The editor mirror has no slant field, so set it by hand (it may be the Point of Attack field).' },
  { id: 'dl-poa', side: 'defense', menu: 'dline', label: 'Point of attack', options: ['Outside', 'Inside', 'Left', 'Right'], kind: 'none', macro: true, conf: 'm27',
    source: src(CIVIL_D, ACE),
    hint: 'Aim the whole front’s charge at a side or gap. Inside POA plus pinch is the Loop Man 0 recipe.' },
  { id: 'dl-stunt', side: 'defense', menu: 'dline', label: 'D-line stunt', options: STUNTS, kind: 'none', macro: true, conf: 'm27',
    source: src(EA_RUN, ACE),
    hint: 'R-stick left, then R1/RB and browse with the D-pad, or hold the play button on the play-call screen. Texas 4 Man (ends loop in) vs inside runs; El Paso 4 Man with a spread line vs stretch and toss (EA).' },

  // ── defense: linebackers ────────────────────────────────────────────────
  { id: 'lb-shift', side: 'defense', menu: 'lb', label: 'Shift linebackers', options: ['Spread', 'Pinch', 'Left', 'Right'], kind: 'none', macro: true, conf: 'm27',
    source: ACE,
    hint: 'Move the linebacker level wider, tighter or toward strength.' },
  { id: 'lb-mode', side: 'defense', menu: 'lb', label: 'Linebacker assignments', options: ['Zone All', 'SAM Blitz', 'WILL Blitz', 'Blitz All'], kind: 'none', macro: true, conf: 'm27',
    source: src(ACE, CIVIL_D),
    hint: 'Blitz all, one or two linebackers, or drop them all into zone.' },
  { id: 'lb-custom-zone', side: 'defense', menu: 'lb', label: 'Custom LB zone', options: ['Shallower', 'Deeper'], kind: 'drop', target: true, macro: false, conf: 'read',
    source: GGWTB,
    hint: 'Hold L1/LB while adjusting one linebacker’s drop. GGWTB only, unverified; set it by hand.' },

  // ── defense: individual assignments (need a target) ─────────────────────
  { id: 'ind-blitz', side: 'defense', menu: 'individual', label: 'Blitz', options: ['Blitz', 'Bluff Blitz'], kind: 'rush', target: true, macro: true, conf: 'm27',
    source: src(ACE, CIVIL_D),
    hint: 'Send one defender. Bluff Blitz shows pressure then drops; it appears only in the D-line palette of the editor mirror.' },
  { id: 'ind-contain', side: 'defense', menu: 'individual', label: 'Contain', options: ['Left', 'Right'], kind: 'rush', target: true, macro: true, conf: 'read',
    source: src(CIVIL_D, MS_SEP3),
    hint: 'Individual edge contain. Not in the editor palettes (QB contain exists globally). Since TU Sep 3 tackles pick up contain rushers: contain keeps the QB in the pocket, it no longer manufactures pressure.' },
  { id: 'ind-spy', side: 'defense', menu: 'individual', label: 'QB spy', options: ['QB Spy'], kind: 'drop', target: true, macro: true, conf: 'm27',
    source: ACE,
    hint: 'Mirror a mobile QB with a linebacker, slot or lineman.' },
  { id: 'ind-zone', side: 'defense', menu: 'individual', label: 'Zone assignment', options: ZONES, kind: 'drop', target: true, macro: true, conf: 'm27',
    source: ACE,
    hint: 'Hand-set one defender’s zone. The palette depends on position: Cloud Flat is a corner’s, Middle Read a safety’s, 3 Rec Hook a Mike’s or edge’s.' },
  { id: 'def-custom-stem', side: 'defense', menu: 'individual', label: 'Custom stem (zone depth)', options: ['Up 5 yd', 'Up 10 yd', 'Back 5 yd', 'Back 10 yd'], kind: 'none', target: true, macro: true, conf: 'm26', macroConf: 'read',
    source: EA26_SHELL,
    hint: 'Moves one zone defender’s drop depth. M26: hold L1/LB + left stick, D-pad for 5-yard steps; the M27 path is unconfirmed.' },
  { id: 'ind-man', side: 'defense', menu: 'individual', label: 'Man on receiver', options: RECEIVERS, kind: 'drop', target: true, macro: true, conf: 'm27',
    source: src(CIVIL_CFB, EA27),
    hint: 'Put one defender on a chosen receiver.' },
  { id: 'ind-press', side: 'defense', menu: 'individual', label: 'Press / leverage on one man', options: ['Press', 'Back Off', 'Inside', 'Outside', 'Over the Top'], kind: 'none', target: true, macro: true, conf: 'ea', macroConf: 'read',
    source: EA27,
    hint: 'L2, select one receiver icon: adjust only the defender over him.' },
  { id: 'ind-route-commit', side: 'defense', menu: 'individual', label: 'Route commit on one man', options: ['Inside', 'Outside', 'Reset'], kind: 'none', target: true, macro: true, conf: 'm26', macroConf: 'read',
    source: EA26_SHELL,
    hint: 'Commit one man defender to an inside or outside break.' },

  // ── defense: read + user ────────────────────────────────────────────────
  { id: 'show-blitz', side: 'defense', menu: 'read', label: 'Show blitz', options: ['Linebackers', 'Secondary', 'Both'], kind: 'none', macro: true, conf: 'm27',
    source: src(ACE, CIVIL_D, GGWTB),
    hint: 'Walk defenders up to fake pressure without changing assignments.' },
  { id: 'contain-all', side: 'defense', menu: 'read', label: 'QB contain', options: ['Left', 'Right', 'Both'], kind: 'none', macro: true, conf: 'm27',
    source: src(ACE, CIVIL_D, MS_SEP3),
    hint: 'R1 then L1 (RB then LB). Edge rushers keep outside contain. No longer wipes hot routes (TU Sep 16).' },
  { id: 'guess-pass', side: 'defense', menu: 'read', label: 'Guess play', options: ['Pass', 'Run Left', 'Run Right', 'Run Up Middle'], kind: 'none', macro: true, conf: 'm27',
    source: src(ACE, CIVIL_D, CIVIL_CFB),
    hint: 'Guess Pass sheds blocks faster vs the pass at the cost of run fits; guess the run by direction.' },
  { id: 'hover', side: 'defense', menu: 'line', label: 'User hover', options: ['A Gap', 'B Gap', 'Edge'], kind: 'none', macro: false, conf: 'm27',
    hint: 'Hold L2/LT over a gap pre-snap. A user skill, never stored in a macro.' },

  // ── offense: protection ─────────────────────────────────────────────────
  { id: 'protect', side: 'offense', menu: 'protection', label: 'Pass protection', options: ['Base', 'Empty', 'Full Slide Left', 'Full Slide Right', 'Half Slide Left', 'Half Slide Right'], kind: 'none', macro: true, conf: 'm27',
    source: src(MUTGG40, TU16, CIVIL_MACRO),
    hint: 'Hold L2/LT: left stick picks Base, Empty, Full Slide; right stick picks Half Slide. Slide toward the pressure and let the back take the other side. TU Sep 16 fixed Half Slide flipping to Full Slide.' },
  { id: 'max-protect', side: 'offense', menu: 'protection', label: 'Max protect', options: ['On'], kind: 'none', macro: true, conf: 'm26',
    source: src(MUTGG40, CIVIL_MACRO),
    hint: 'Every back and attached tight end stays in on top of Base rules (the engine counts two unless truth.maxProtectIn says otherwise). The answer to a sure blitz when two-man routes can still win.' },
  { id: 'id-mike', side: 'offense', menu: 'protection', label: 'ID the Mike', options: DEF_POSITIONS, kind: 'none', macro: true, conf: 'ea',
    source: src(EA27, MUTGG40, CIVIL_MACRO),
    hint: 'Move the M icon onto the defender the back owns in Base or Slide protection. Useless in Empty, because the back is releasing.' },
  { id: 'untarget', side: 'offense', menu: 'protection', label: 'Untarget defender', options: DEF_POSITIONS, kind: 'none', macro: true, conf: 'ea',
    source: src(EA26, MUTGG40, CIVIL_MACRO),
    hint: 'Move the flame icon off a mugged user defender so the line stops spending a blocker on a player who drops. Stack one row per defender; the only protection call that also changes run blocking.' },
  { id: 'untarget-user-lurk', side: 'offense', menu: 'protection', label: 'Leave user lurker untargeted', options: ['On', 'Off'], kind: 'none', macro: false, conf: 'ea',
    source: EA27,
    hint: 'New in M27: ignore the user lurker by default (coaching adjustment or protection menu). Macro storage not confirmed.' },
  { id: 'protect-fly', side: 'offense', menu: 'protection', label: 'Protection on the fly', options: ['Flick Right: slide right', 'Flick Left: slide left', 'Double-click Right: full slide right', 'Double-click Left: full slide left', 'Flick Up: target/untarget'], kind: 'none', macro: false, conf: 'm27',
    source: src(CIVIL_PROT, EA26),
    hint: 'Right stick at the line, the fastest way to move the slide toward the hot rusher; R2/RT + right stick up shows the flame on the unblocked defender.' },
  { id: 'default-protection', side: 'offense', menu: 'coach', label: 'Default pass protection', options: ['Base', 'Empty', 'Half Slide Left', 'Half Slide Right', 'Full Slide Left', 'Full Slide Right'], kind: 'none', macro: false, conf: 'm26',
    source: MUTGG40,
    hint: 'Coach Adjustments setting, not a macro step: the protection every pass play comes out in. Otherwise each play ships its own (back releasing = Empty, back blocking = Base, check-release = Half Slide away).' },
  { id: 'double-team', side: 'offense', menu: 'protection', label: 'Double team', options: DEF_POSITIONS, kind: 'none', macro: true, conf: 'm27',
    source: src(MUTGG40, CIVIL_MACRO),
    hint: 'Move the icon onto one defender and two linemen take him. Mostly a pass tool: on runs it only blunts abilities like Inside Stuff, except on HB Draw.' },

  // ── offense: blocking ───────────────────────────────────────────────────
  { id: 'block-style', side: 'offense', menu: 'blocking', label: 'Blocking style', options: GRADES, kind: 'none', macro: true, conf: 'read',
    source: src(CIVIL_MACRO, MS_SEP3),
    hint: 'Civil says a macro stores a blocking style but no source names its options; Balanced/Conservative/Aggressive is unconfirmed. Aggressive draws real holding (TU Sep 3).' },
  { id: 'chip-block', side: 'offense', menu: 'blocking', label: 'Chip block', options: FRONT_SEVEN, kind: 'block', target: true, macro: true, conf: 'ea', macroConf: 'read',
    source: EA27,
    hint: 'TE or HB chips a named rusher on the way out. A won chip knocks the edge off his path; a lost one distorts the route. Counts as a blocker for the first beat only.' },

  // ── offense: hot routes ─────────────────────────────────────────────────
  { id: 'ind-block', side: 'offense', menu: 'hot', label: 'Stay in and block', options: ['Pass Block', 'Chip and Release', 'Block and Release'], kind: 'block', target: true, macro: true, conf: 'm27',
    source: src(M818, CIVIL_MACRO),
    hint: 'Pass Block keeps him in (pair it with ID the Mike). Block and Release checks his blitz first and leaks late. Chip and Release (new in M27, HB and attached TE) blocks for the first beat and runs after.' },
  { id: 'hot-route', side: 'offense', menu: 'hot', label: 'Hot route', options: ROUTES, kind: 'none', target: true, macro: true, conf: 'm27',
    source: src(M818, MS_HOT),
    hint: 'The menu depends on where he is aligned: outside WR (Sluggo, Post Sit, Smoke Screen), slot or flexed TE (Zig, Speed Out, Slot Fade), attached TE (Wheel, Stick Nod), backfield (Swing, Texas, Triple Option). Smart Route pushes the route to the sticks.' },
  { id: 'custom-stem', side: 'offense', menu: 'hot', label: 'Custom stem (route depth)', options: ['Shorter', 'Deeper'], kind: 'none', target: true, macro: true, conf: 'm26',
    source: src(M818, EA26),
    hint: 'Sets the break depth of the route. M26 input was hold L1 inside the hot route menu; the M27 input is unconfirmed because L1 now opens Custom Adjustments.' },

  // ── offense: manual at the line ─────────────────────────────────────────
  { id: 'audible', side: 'offense', menu: 'audible', label: 'Audible', options: ['Audible list play'], kind: 'none', macro: false, conf: 'ea',
    source: src(EA_CTRL, EA27),
    hint: 'Square/X at the line. In Coach Mode the headset cuts off at 15 on the play clock; no audible or hot route after that.' },
  { id: 'flip', side: 'offense', menu: 'audible', label: 'Flip the play', options: ['On'], kind: 'none', macro: false, conf: 'read',
    source: CIVIL_MACRO,
    hint: 'Mirrors the play. The M27 input is not in any source found. Flipping swaps WR1/WR2 on the field while a macro keeps them on their old assignments.' },
  { id: 'motion', side: 'offense', menu: 'motion', label: 'Motion', options: ['Left', 'Right'], kind: 'none', target: true, macro: false, conf: 'ea',
    source: src(EA_CTRL, MS_HOT),
    hint: 'Select an eligible player and hold the left stick to send him across. No source confirms named motion types (Jet, Return, Orbit) as selectable, and macro storage of motion is unconfirmed, so set it by hand.' },
  { id: 'run-flip', side: 'offense', menu: 'line', label: 'Flip run', options: ['Left', 'Right'], kind: 'none', macro: false, conf: 'm27',
    source: CIVIL_OFF,
    hint: 'Right stick flips the run to the open side after reading the box, without an audible. Under center and pistol only.' },
  { id: 'formation-shift', side: 'offense', menu: 'line', label: 'Formation shift', options: ['On'], kind: 'none', macro: false, conf: 'ea',
    source: EA27,
    hint: 'Toggled on the play-call screen: break in one formation and shift to another with the same personnel before the snap.' },
  { id: 'preplay-subs', side: 'offense', menu: 'line', label: 'Pre-play subs', options: ['Dynamic Subs (D-pad →)', 'Play-call screen subs'], kind: 'none', macro: false, conf: 'ea',
    source: src(EA_CTRL, EA27),
    hint: 'Get a matchup piece on the field without the pause menu.' },
  { id: 'fake-snap', side: 'offense', menu: 'line', label: 'Fake snap', options: ['On'], kind: 'none', macro: false, conf: 'ea',
    source: EA_CTRL,
    hint: 'R1/RB hard count to draw offside or make a user defender show his hover early.' },
  { id: 'snap-ball', side: 'offense', menu: 'line', label: 'Quick snap', options: ['On'], kind: 'none', macro: false, conf: 'ea',
    source: EA_CTRL,
    hint: 'Snap right after the set to beat a defense still adjusting; each defensive adjustment must get set before the next one.' },
]

const BY_ID = new Map(ADJUSTMENTS.map((a) => [a.id, a]))
export const adjustmentById = (id) => BY_ID.get(id)

export const adjustmentsForSide = (side) =>
  ADJUSTMENTS.filter((a) => a.side === side)

// ── legacy values ─────────────────────────────────────────────────────────
// Option labels from the first vocabulary pass, mapped onto the corrected
// ones so packages saved in Dexie before the research pass still load. A
// string keeps the adjustment and swaps the value; an object moves it to a
// different adjustment. Anything not listed fails as bad-value, on purpose:
// there is no honest translation (e.g. motion "Across" has no direction).
export const VALUE_ALIASES = {
  'smart-zone': { Default: 'Balanced' },
  'cov-leverage': { 'Shade Over Top': 'Over the Top', 'Shade Underneath': 'Underneath', 'Commit Inside': 'Inside', 'Commit Outside': 'Outside' },
  'zone-behavior': {
    'Look For Work': 'On',
    'Red Zone Awareness': { adj: 'red-zone-awareness', value: 'On' },
    Plaster: { adj: 'plaster', value: 'Conservative' },
  },
  'match-check': {
    Combo: { adj: 'man-check-stack', value: 'Combo' },
    'Top Hat': { adj: 'man-check-stack', value: 'Top Hat' },
    Lock: { adj: 'man-check-stack', value: 'Lock' },
    'Point Combo': { adj: 'man-check-bunch', value: 'Point Combo' },
  },
  'cb-depth': { Tight: '3', Base: 'Default', Deep: '9' },
  'cb-width': { Inside: 'Tight', Base: 'Default', Outside: 'Wide' },
  'safety-depth': { Shallow: '5', Base: 'Default', Deep: '16' },
  'safety-width': { Base: 'Default' },
  'safety-midpoint': { Middle: 'Default', 'Pass Strength': 'Strong' },
  'dl-align': { 'Shift Left': 'Left', 'Shift Right': 'Right' },
  'dl-slant': { 'Slant Inside': 'Inside', 'Slant Outside': 'Outside' },
  'show-blitz': { On: 'Linebackers' },
  'ind-blitz': { 'A Gap': 'Blitz', 'B Gap': 'Blitz', Edge: 'Blitz', Default: 'Blitz' },
  'ind-spy': { On: 'QB Spy' },
  'ind-zone': { 'Hook/Curl': 'Hook Curl', 'Curl/Flat': 'Curl Flat', 'Deep Third': 'Outside Third', 'Deep Quarter': 'Inside Quarter' },
  'contain-all': { On: 'Both' },
  'guess-pass': { On: 'Pass' },
  roll: { 'Highest OVR (Default)': 'Highest OVR' },
  plaster: { 'Conservative (Default)': 'Conservative' },
  protect: { 'Empty Base': 'Empty', 'Max Protect': { adj: 'max-protect', value: 'On' } },
  'id-mike': { Mike: 'MIKE' },
  'double-team': { 'Nose / 1-tech': 'DT', '3-tech': 'DT', 'Left Edge': 'LEDG', 'Right Edge': 'REDG' },
  'ind-block': { 'Chip then Release': 'Chip and Release' },
}
// id-mike "Left/Right Mug" and "Untarget" are deliberately absent: which
// defender is in a mug depends on the front, and Untarget is now its own
// adjustment, so the user has to re-point those by hand.

// Returns the adjustment on the current vocabulary. Leaves it untouched when
// the value is already valid or has no alias. Never mutates the input.
export function normalizeAdjustment(a) {
  if (!a) return a
  const def = BY_ID.get(a.adj)
  if (def && def.options.includes(a.value)) return a
  const alias = VALUE_ALIASES[a.adj]?.[a.value]
  if (alias == null) return a
  if (typeof alias === 'string') return { ...a, value: alias }
  const next = { ...a, adj: alias.adj, value: alias.value }
  if (!BY_ID.get(alias.adj)?.target) delete next.target
  return next
}

export const normalizeAdjustments = (list) => (list || []).map(normalizeAdjustment)

// Coverage shells, as the number of deep safeties the offense sees or faces.
export const SHELLS = [
  { id: 0, label: 'Zero', short: '0-high' },
  { id: 1, label: 'Single high', short: '1-high' },
  { id: 2, label: 'Two high', short: '2-high' },
  { id: 3, label: 'Three high', short: '3-high' },
]
