// built by nnnsightnnn — signal from noise
// Coverage Lab — the glossary.
//
// Every term the lab uses, written from the play-caller's chair. `see` links
// must reference other glossary terms by exact `term` string — the tests
// enforce it. Keep definitions to 2-3 sentences; this is a dictionary, not a
// second curriculum.

export const GLOSSARY = [
  /* ── coverage logic ── */
  {
    term: 'Match',
    aka: 'Pattern match',
    def: 'A coverage rule that starts with zone eyes and converts to man once a route declares vertical. "Zone until threatened, man after." Exists because spot-drop zones cannot solve four verticals.',
    see: ['Spot-drop', 'Trigger', 'MOD', 'MEG'],
  },
  {
    term: 'Spot-drop',
    aka: 'Landmark zone',
    def: 'Pure zone technique: run to a landmark, read the QB, break on the throw. Routes do not change the drop. Cover 3 Sky and base Cover 2 are spot-drop calls.',
    see: ['Match'],
  },
  {
    term: 'Trigger',
    aka: 'Declaration',
    def: 'The moment a route declares what it is — roughly the first 10-12 yards of a stem. Match rules do nothing until the trigger; quick game wins by getting the ball out before it.',
    see: ['Match'],
  },
  {
    term: 'MOD',
    aka: 'Man On Deep',
    def: 'Conditional man on #1: zone against anything short (sink, rob the curl from on top), locked man once he declares vertical. The Rip/Liz corner technique.',
    see: ['MEG', 'Rip/Liz'],
  },
  {
    term: 'MEG',
    aka: 'Man Everywhere he Goes',
    def: 'True man with no depth trigger — locked from the snap regardless of route. A MEG corner chases the curl a MOD corner would zone off. In CFB 27, the Skinny Meg check creates one.',
    see: ['MOD', 'Skinny Meg'],
  },
  {
    term: 'Carry',
    def: 'Run man-for-man with a vertical route after the trigger fires. The seam player "carries #2" — the single rule that lets one-high match survive four verticals.',
    see: ['Trigger', 'Seam-hook conversion'],
  },
  {
    term: 'Seam-hook conversion',
    def: 'The seam player\'s other branch: #2 did NOT go vertical, so pass him off and re-read the next threat into your zone. Carry or convert — there is no third option.',
    see: ['Carry'],
  },
  {
    term: 'Wall',
    def: 'Get in a crosser\'s path and force him to bubble over or under you, denying the clean lane. Linebackers wall #3 and crossers; it is a collision with a purpose, not a cover.',
    see: ['Collision'],
  },
  {
    term: 'Collision',
    aka: 'Re-route',
    def: 'Physically disrupt a receiver\'s stem (legally, inside 5 in NFL rules) to buy time for deep defenders. Zone defenders collision the seam even when they will not carry it.',
    see: ['Wall'],
  },
  {
    term: 'Squat',
    def: 'Sit shallow instead of sinking — a flat corner "squats" on the hitch. What Smash punishes: the corner route lands behind any corner who squats.',
    see: ['Cloud', 'High-low'],
  },
  {
    term: 'Cap',
    def: 'Play over the top of a receiver — be the lid. A safety "caps #1" when the corner trapped #2, taking away the vertical while the trap takes the short throw.',
    see: ['Trap'],
  },
  {
    term: 'Funnel',
    def: 'Use leverage to steer a receiver toward your help. Cover 1 defenders play inside leverage to funnel routes at the rat and free safety; outside leverage funnels to empty grass.',
    see: ['Leverage', 'Rat'],
  },
  {
    term: 'Leverage',
    aka: 'Inside/outside leverage',
    def: 'Which shoulder you align on and defend from. Leverage is dictated by where your help is: help inside and deep means play inside, force the route long and toward friends.',
    see: ['Funnel'],
  },

  /* ── people and spots ── */
  {
    term: '#1 / #2 / #3',
    aka: 'Receiver count',
    def: 'Receivers numbered outside-in on each side of the formation. #1 is the widest. Every match rule keys on these numbers, not on names — a motion that changes the count changes every assignment.',
  },
  {
    term: 'Apex',
    aka: 'Overhang, nickel, slot defender',
    def: 'The defender aligned between the slot (#2) and the box — nickel, Sam, or rolled safety. Owns the run/pass bind: flat routes, #2 out-breaks, and force all live at the apex.',
    see: ['Force'],
  },
  {
    term: 'Rat',
    aka: 'Hole player, robber',
    def: 'Cover 1\'s free defender sitting in the middle underneath, reading the QB and jumping in-breakers. CFB 27 naming: RAT = a dropping DE, LURK = the LB opposite the back, HOLE = strong safety down, CROSS = weak safety down. User him.',
    see: ['Robber', 'Funnel'],
  },
  {
    term: 'Robber',
    def: 'Any defender assigned to sit in a throwing window and rob a route from underneath rather than cover a man — Buzz safeties and Cover 1 hole players are robbers.',
    see: ['Rat', 'Buzz'],
  },
  {
    term: 'Force',
    aka: 'Contain, edge',
    def: 'The run-fit job of turning outside runs back inside. Every coverage assigns force to someone — Sky\'s rolled safety, Cloud\'s corner, Cover 2\'s corners. Knowing your force player tells you who the offense reads for RPOs.',
    see: ['Alley', 'Run fit'],
  },
  {
    term: 'Alley',
    def: 'The gap between the box and the force player where cutback and bounce runs live. Quarters safeties are alley players by design — that is the extra hat the coverage buys.',
    see: ['Force'],
  },
  {
    term: 'Run fit',
    aka: 'Fit',
    def: 'The assignment structure against the run: who has each gap, who forces, who fills the alley. Coverage and run fit are one call — trade a safety deep and you traded a run defender.',
    see: ['Force', 'Alley'],
  },

  /* ── shells and structure ── */
  {
    term: 'Shell',
    def: 'The pre-snap safety picture: 2-high, 1-high, or 0. Disguise means showing one shell and playing another. The QB\'s first read is your shell, which is why identical-shell pairs like Quarters/Palms matter.',
    see: ['MOFC / MOFO'],
  },
  {
    term: 'MOFC / MOFO',
    aka: 'Middle of field closed/open',
    def: 'MOFC: a safety occupies the deep middle (Cover 1, Cover 3). MOFO: the middle is open between two-high safeties (Cover 2, Quarters). QBs sort coverages by this first — post and dagger attack MOFO seams, crossers attack MOFC.',
    see: ['Shell'],
  },
  {
    term: 'Strength',
    aka: 'Field/boundary',
    def: 'The passing-strength side of the formation (more receivers). Field = the wide side of the hash, boundary = the short side. Split-field calls point different rules at each, so strength-into-boundary flips the math.',
    see: ['Split-field'],
  },
  {
    term: 'Split-field',
    def: 'Playing two different coverages on the two halves of the field — Quarters one side, Cover 2 the other. Cover 6 and Cover 9 are the lab\'s split-field calls; the Mike is the stitch between them.',
    see: ['Strength'],
  },
  {
    term: 'High-low',
    def: 'Two routes at different depths on one defender — hitch under, corner over. He cannot take both; the QB reads him and throws the other. Smash high-lows the flat corner; the answer is structure, not effort.',
    see: ['Squat'],
  },

  /* ── the calls ── */
  {
    term: 'Sky',
    def: 'Cover 3 rotation with the STRONG SAFETY down as flat/force. The base way to get an eight-man box while keeping three deep.',
    see: ['Cloud', 'Buzz', 'Force'],
  },
  {
    term: 'Cloud',
    def: 'Cover 3 (or 2) rotation with the CORNER as the flat/force player and a safety replacing him deep. Strong against perimeter quick game; the corner route behind the squatted corner is the tax.',
    see: ['Sky', 'Squat'],
  },
  {
    term: 'Buzz',
    def: 'Cover 3 rotation with the safety sinking INSIDE to the hook/curl instead of the flat — a robber on digs, spots, and mesh. Buys the dagger window, costs the perimeter run fit.',
    see: ['Sky', 'Robber'],
  },
  {
    term: 'Rip/Liz',
    aka: 'Cover 3 Match',
    def: 'Saban-tree match Cover 3: MOD corners, seam players carrying #2 vertical. Rip = strength right, Liz = strength left. The base MOFC answer to four verticals.',
    see: ['MOD', 'Carry', 'MOFC / MOFO'],
  },
  {
    term: 'Quarters',
    aka: 'Cover 4',
    def: '2-high match: corner reads #1, safety reads #2 — vertical means lock him, anything else means he is a run key and the safety folds to the alley. As much a run coverage as a pass coverage.',
    see: ['Palms / 2-Read', 'Alley'],
  },
  {
    term: 'Palms / 2-Read',
    def: 'Quarters\' twin with the opposite #2 rule: #2 breaking out inside 5 fires the trap — corner jumps the out, safety caps #1. Identical shell to Quarters, opposite reaction, invisible pre-snap.',
    see: ['Quarters', 'Trap', 'Cap'],
  },
  {
    term: 'Trap',
    def: 'A corner conditionally jumping #2\'s out-break while the safety takes #1 over the top. The Palms mechanic, also available as Cover 2 Trap. Fires on OUT breaks only — corner routes are vertical and belong to the safety.',
    see: ['Palms / 2-Read'],
  },
  {
    term: 'Solo',
    aka: 'Poach',
    def: 'Quarters vs trips with the backside safety keying #3: vertical = poach the deep middle, else = help the iso corner. Solo cheats pre-snap (and tips it); Poach reacts post-snap. The backside corner plays MEG either way.',
    see: ['MEG', 'Quarters'],
  },
  {
    term: 'Cover 6 / Cover 9',
    aka: 'Quarter-quarter-half',
    def: 'The split-field pair. Cover 6: Quarters to the strength, Cover 2 to the single side. Cover 9: the mirror — cloud the strength, Quarters weak. Offset safeties are the pre-snap tell. (Fangio\'s NFL "Cover 9" is a different, weak-rotation Cover 3.)',
    see: ['Split-field', 'Cloud'],
  },
  {
    term: 'Tampa 2',
    def: 'Cover 2 with the Mike sprinting to 18-25 yards as a third deep-middle defender. The hole beside him at 15-20 is the famous soft spot; you need a rangy Mike or the drop is cosmetic.',
    see: ['High-low'],
  },
  {
    term: 'Bracket',
    aka: 'Double',
    def: 'Two defenders on one receiver, usually one under and one over. In CFB 27 you build a private bracket by assigning a second defender to a star individually — the rest of the call never changes.',
    see: ['Cap'],
  },

  /* ── CFB 27 checks and tools ── */
  {
    term: 'Zone It',
    def: 'The CFB 27 check that kills all matching — everyone spot-drops and reads the QB. The panic button when quick game beats the trigger or the AI matches wrong on rub releases.',
    see: ['Spot-drop', 'Trigger'],
  },
  {
    term: 'Skinny',
    def: 'CFB 27\'s trips check for Cover 3 Match: the seam defender takes #2 vertical/outside — the true Rip/Liz rule pointed at 3x1.',
    see: ['Rip/Liz', 'Skinny Meg'],
  },
  {
    term: 'Skinny Meg',
    def: 'Skinny plus a locked backside corner: he skips the depth trigger and plays pure MEG man on every route. Buys glue on the iso X, pays in run support and rub vulnerability.',
    see: ['Skinny', 'MEG'],
  },
  {
    term: 'Skate',
    def: 'CFB 27 bunch check that slides the zone drops toward the compressed surface — the in-game answer to Flood/Sail out of bunch.',
  },
  {
    term: 'Lock / Combo / Triangle',
    def: 'The stack checks in man. Lock = no switching, fight through the rub. Combo = the nearest two defenders swap on crossing releases. Triangle = 3-over-2 bracket on the stack.',
    see: ['Rub', 'Point Combo / Point Triangle'],
  },
  {
    term: 'Point Combo / Point Triangle',
    def: 'The bunch versions. Point Combo: the point man locks, the other two swap. Point Triangle: 4-on-3 with a safety bracketing the bunch — the strongest man check in the game against compressed sets.',
    see: ['Lock / Combo / Triangle'],
  },
  {
    term: 'Stress',
    def: 'CFB 27\'s Cover 4 trips check that converts all-verts into even spacing instead of letting the seams bind two defenders. The fix for the four-verts spacing problem out of Quarters vs 3x1.',
    see: ['Quarters'],
  },
  {
    term: 'Box / Bingo',
    def: 'Cover 4 bunch checks. Box = defend the bunch in quadrants rather than chasing bodies. Bingo = Box plus the corner locking #1 if he stays outside.',
  },
  {
    term: 'Stubbie',
    def: 'Palms\' trips check: corner MEGs #1 while the apex and safety share #2 and #3. What you actually get when you call Palms against 3x1 — not true full-field 2-Read.',
    see: ['Palms / 2-Read', 'MEG'],
  },
  {
    term: 'Shade',
    aka: 'Over the top / underneath',
    def: 'CFB 27 per-play adjustment biasing man defenders: over the top protects vertical (concede the quick game), underneath jumps the quick game (concede the fade). Set it by what the opponent has been throwing.',
  },
  {
    term: 'Press / Off',
    def: 'Alignment at the line versus cushion. Press disrupts timing and is mandatory in Cover 0; off protects against the double move at the cost of free short releases.',
    see: ['Leverage'],
  },

  /* ── offense-side vocabulary ── */
  {
    term: 'Rub',
    aka: 'Pick',
    def: 'A route run through a defender\'s path to free a teammate — legal-ish when disguised as a route. Stacks and bunches exist to build rubs; switch checks exist to beat them.',
    see: ['Lock / Combo / Triangle'],
  },
  {
    term: 'Switch release',
    def: 'Two receivers trading release lanes at the snap (post-wheel is the classic). Scrambles who "#2" is mid-play, which is exactly the count match rules key on.',
    see: ['#1 / #2 / #3'],
  },
  {
    term: 'RPO',
    aka: 'Run-pass option',
    def: 'A run play with a built-in throw, read off one defender — usually your force/flat player. Palms and invert looks exist largely to bait and punish that read.',
    see: ['Force', 'Trap'],
  },
  {
    term: 'Hot / Sight adjust',
    def: 'The QB and receiver converting a route to a quick slant or hitch against blitz. The reason Cover 0 loses to prepared offenses — the bet is that pressure arrives before the hot does.',
    see: ['Press / Off'],
  },
  {
    term: 'Stem',
    def: 'The first portion of a route before the break, where the receiver sells one thing to run another. Match defenders read the stem; that is what "declaring" means.',
    see: ['Trigger'],
  },
];

export const GLOSSARY_BY_TERM = Object.fromEntries(GLOSSARY.map((e) => [e.term, e]));
