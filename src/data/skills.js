// built by nnnsightnnn — signal from noise
// Skill taxonomy — what separates elite from good, made rateable.
//
// Distilled from MCS champion interviews (Fancy, Henry Leverette), Madden
// School, Civil.GG, Operation Sports, MaddenTurf and community research
// (Aug 2026). The recurring theme: the elite gap is knowledge + reads +
// adaptation, not stick speed. Rate 1–5 against the elite marker:
//   1 unaware · 2 aware but can't execute · 3 inconsistent ·
//   4 reliable under pressure · 5 the elite marker is true of you.
//
// `games`: 'both' | 'madden' | 'cfb'. `leverage: true` marks the skills the
// sources agree move you from intermediate to elite fastest.

export const RATING_ANCHORS = [
  { value: 1, label: 'Unaware' },
  { value: 2, label: 'Aware, can’t execute' },
  { value: 3, label: 'Inconsistent' },
  { value: 4, label: 'Reliable under pressure' },
  { value: 5, label: 'Elite marker true' },
];

export const SKILL_CATEGORIES = [
  {
    id: 'presnap',
    name: 'Pre-Snap Recognition',
    blurb: 'The most-cited separator at every level. Knowledge of what the defense is in beats raw skill.',
    skills: [
      {
        id: 'presnap.shell-id',
        name: 'Coverage shell ID',
        games: 'both',
        leverage: true,
        def: 'Identify the shell (1-high / 2-high / 0) from safety depth and alignment before the snap.',
        elite: 'Reads safety depth bands automatically within the first 3 seconds of the play clock, every snap.',
        drill: '2-controller practice: cycle random defensive calls, verbalize the shell before snapping; track hit rate.',
      },
      {
        id: 'presnap.man-zone',
        name: 'Man/zone confirmation',
        games: 'both',
        leverage: true,
        def: 'Use motion, trips alignment, and slot-corner leverage to confirm man vs zone, Cover 1 vs 3.',
        elite: 'Sends one motion or checks one alignment cue and commits to a read; never guesses post-snap.',
        drill: 'Motion a slot man every rep vs mixed calls; log correct/incorrect diagnosis.',
      },
      {
        id: 'presnap.blitz-id',
        name: 'Blitz ID + protection',
        games: 'both',
        def: 'Spot free rushers and overload pressure; know the protection answer.',
        elite: 'Identifies the unblocked man, slides protection or keeps RB/TE before the snap; rarely sacked by scheme.',
        drill: 'Have a lab partner run known pressure setups; rep the protection answer until automatic.',
      },
      {
        id: 'presnap.disguise-read',
        name: 'Seeing through disguise',
        games: 'both',
        def: 'Combine alignment with first-step post-snap confirmation instead of trusting the pre-snap picture.',
        elite: 'Disguise shells rarely fool you twice; you confirm with the first post-snap step.',
        drill: 'Review your film; mark every snap where a disguise fooled you and name the missed cue.',
      },
      {
        id: 'presnap.tendency',
        name: 'Opponent tendency tracking',
        games: 'both',
        def: 'Track formation, personnel, and down-and-distance habits in-game.',
        elite: 'By the 2nd quarter you call out their 3rd-and-medium play before it happens.',
        drill: 'After each ranked game, write 3 tendencies you noticed and when you noticed them.',
      },
    ],
  },
  {
    id: 'pass',
    name: 'Passing Execution',
    blurb: 'Mechanics, progressions, and pocket craft — the fundamentals that separate elite from good.',
    skills: [
      {
        id: 'pass.mechanics',
        name: 'Throw mechanic mastery',
        games: 'both',
        def: 'Full command of the passing system: placement, touch vs bullet vs lob, free-form leads.',
        elite: 'Places the ball away from leverage on contested throws; never a one-throw-type QB.',
        drill: '15 min/day placement-only reps: same route vs same coverage, place to all four quadrants.',
      },
      {
        id: 'pass.progressions',
        name: 'Progression reads',
        games: 'both',
        def: 'Read areas of the field, not one receiver; work the designed progression.',
        elite: 'Eyes move 1→2→3→checkdown; throws away or checks down instead of forcing.',
        drill: 'Call one play 20x vs rotating coverages; forbid throwing to the primary read.',
      },
      {
        id: 'pass.pocket',
        name: 'Pocket management',
        games: 'both',
        leverage: true,
        def: 'Climb and drift in the pocket; avoid sacks; stay throw-ready.',
        elite: 'Steps up before deep throws, drifts away from pressure; sub-3% sack rate on non-blitz downs.',
        drill: 'Rep vs 4-man rush only; goal: 10 straight dropbacks with no sack and no scramble.',
      },
      {
        id: 'pass.zone-beaters',
        name: 'Coverage answers loaded',
        games: 'both',
        def: 'Know the concept answer for every shell — stems, flood, hi-lo, split-safety beaters.',
        elite: 'Sees Cover 3, immediately has 2 answers loaded from your own scheme; punishes any shell within a drive.',
        drill: 'Build a vs-each-coverage cheat card for your sheet; lab each answer 10x.',
      },
      {
        id: 'pass.stems',
        name: 'Route stem manipulation',
        games: 'cfb',
        def: 'Custom-stem route depths and breaks to attack zone landmarks and exact yardage.',
        elite: 'Stems curls/outs/corners to sit in zone gaps; converts exact-yardage situations by design.',
        drill: 'Take one curl concept; stem it 5 depths vs Cover 3 and note which windows open.',
      },
    ],
  },
  {
    id: 'run',
    name: 'Run Game & Option',
    blurb: 'Patience, lane discipline, and (in CFB) the whole option sub-discipline.',
    skills: [
      {
        id: 'run.patience',
        name: 'Block patience',
        games: 'both',
        def: 'Wait for blocks to develop; early sprint triggers block-shed animations.',
        elite: 'Never touches sprint until through the hole; turns 2-yard losses into 20-yard gains via patience.',
        drill: 'Run inside zone 20x with the sprint button banned until past the LOS.',
      },
      {
        id: 'run.lane-id',
        name: 'Lane ID + cutback timing',
        games: 'both',
        def: 'Hit the designed hole; recognize cutback vs designed lane from front and leverage.',
        elite: 'Reads the front pre-snap, bounces only when the count dictates it.',
        drill: 'Practice mode vs each front (4-3, 3-4, odd); narrate the lane pre-snap.',
      },
      {
        id: 'run.option',
        name: 'Option reads',
        games: 'cfb',
        def: 'Execute read/speed/triple option decisions off the keyed defender.',
        elite: 'Reads the key defender correctly >90%; pitches only when the alley is clean.',
        drill: 'Run triple option vs random keys; chart keep/give/pitch accuracy.',
      },
      {
        id: 'run.rpo',
        name: 'RPO decisions',
        games: 'both',
        def: 'Post-snap give/throw decision off the conflict defender, never predetermined.',
        elite: 'Decision made off one defender’s first step, every time.',
        drill: 'Rep one RPO vs man/zone/blitz mix; log the conflict-defender read each rep.',
      },
      {
        id: 'run.moves',
        name: 'Ball-carrier moves',
        games: 'both',
        def: 'Right-stick precision moves at the right moment — one move per defender.',
        elite: 'One move max per defender, timed at contact range; routine carries become first downs.',
        drill: 'Open-field return reps using only one move type per session.',
      },
    ],
  },
  {
    id: 'usr',
    name: 'User Defense',
    blurb: 'The biggest behavioral gap between average and elite. The switch stick alone won an MCS belt.',
    skills: [
      {
        id: 'usr.mlb',
        name: 'Mid-hook user control',
        games: 'both',
        leverage: true,
        def: 'User a deep hook defender in the middle; react to the throw, don’t chase routes.',
        elite: 'Takes away the entire middle of the field; breaks on the throw, not the anticipation.',
        drill: '30 min practice: sit 10 yards deep, react-only rule (no pre-throw movement).',
      },
      {
        id: 'usr.safety',
        name: 'Safety usering',
        games: 'both',
        leverage: true,
        def: 'Graduate from LB to safety user — hardest, most impactful. CFB pros: safety > linebacker.',
        elite: 'Robber/deep-half user who erases seams and posts without getting beat over the top.',
        drill: 'Solo Practice: script seams/posts/benders yourself, user the deep safety, react-only — allow nothing behind you.',
      },
      {
        id: 'usr.switch-stick',
        name: 'Switch stick',
        games: 'both',
        def: 'Late-window switch to the nearest defender at the catch point; play the ball.',
        elite: 'Switches mid-ball-flight and swats/picks with proper timing on contested throws.',
        drill: 'Lab jump-ball and corner-route scenarios; switch + play ball, 20 reps/day.',
      },
      {
        id: 'usr.bait',
        name: 'Bait discipline',
        games: 'both',
        def: 'Show open windows, then break on the throw — create picks, not just deflections.',
        elite: 'Deliberately vacates a window, QB throws it, you close it.',
        drill: 'Ranked review metric: baited INTs per 5 games.',
      },
      {
        id: 'usr.press',
        name: 'Press + shading',
        games: 'both',
        def: 'Manual press timing and shading to disrupt route timing for the rush.',
        elite: 'Presses the right receivers (not all) to buy time for a 4-man rush; knows which matchups auto-lose.',
        drill: 'Lab press vs streak/slant/out releases; chart which matchups hold.',
      },
    ],
  },
  {
    id: 'sch',
    name: 'Scheme & Adjustment',
    blurb: 'Own a compact scheme, adjust to the opponent, never give up the same play twice.',
    skills: [
      {
        id: 'sch.core',
        name: 'Compact core scheme',
        games: 'both',
        def: 'Own 1-2 formations deep with every coverage answered, rather than 50 loose plays.',
        elite: 'Runs the whole offense from one formation with plays that all look alike; nothing can be keyed.',
        drill: 'Maintain the call sheet; prune anything not repped 10+ times.',
      },
      {
        id: 'sch.adjustments',
        name: 'Coaching adjustments',
        games: 'both',
        def: 'Deep command of zone drops, matchups, auto-alignment, option keys — set first, every game.',
        elite: 'Adjusts zone drops mid-game to take away the opponent’s favorite depth.',
        drill: 'Keep a default-adjustments card per side of ball; review it after each loss.',
      },
      {
        id: 'sch.counterpunch',
        name: 'Counterpunching',
        games: 'both',
        leverage: true,
        def: 'Never give up the same play twice; adapt calls to the opponent, not your preference.',
        elite: 'Identifies what the opponent hates defending by drive 2 and hammers it; kills their money play with one targeted adjustment.',
        drill: 'Post-game: list every play that gained 10+ on you and the adjustment that would have stopped it.',
      },
      {
        id: 'sch.disguise',
        name: 'Disguise calling',
        games: 'both',
        def: 'Vary your own looks: shells, blitz-show-drop-out, mixed man/zone from the same picture.',
        elite: 'Opponent’s pre-snap reads are wrong half the time.',
        drill: 'Script paired plays (same look, opposite coverage) into the call sheet.',
      },
      {
        id: 'sch.matchups',
        name: 'Mismatch hunting',
        games: 'both',
        def: 'Identify and hunt personnel/ability mismatches; know which abilities are active.',
        elite: 'Knows the opponent’s weakest DB by drive 1 and isolates him.',
        drill: 'Pre-game: write the 3 mismatches you’ll hunt before kickoff.',
      },
    ],
  },
  {
    id: 'mgmt',
    name: 'Game Management & Mental',
    blurb: 'Clock craft, decision math, composure, and the review loop that compounds everything else.',
    skills: [
      {
        id: 'mgmt.clock',
        name: 'Clock craft',
        games: 'both',
        def: 'Chew-clock and tempo control, timeout economics, situational urgency.',
        elite: 'Up 4 with 3:00 left is a routine win; forces opponent timeouts and stays inbounds by habit.',
        drill: 'Scenario practice: play out "up 4, 3:00, opponent has 2 TOs" until it’s automatic.',
      },
      {
        id: 'mgmt.fourth',
        name: '4th-down + 2-pt math',
        games: 'both',
        def: 'Pre-decided go/kick rules by field position and score state.',
        elite: 'Never burns a possession on tilt-aggression or scared punting.',
        drill: 'Write a personal 4th-down chart; grade compliance in game reviews.',
      },
      {
        id: 'mgmt.wear-tear',
        name: 'Wear & tear management',
        games: 'cfb',
        def: 'Manage limb-specific wear-and-tear, dynamic subs, keep-fresh rotation.',
        elite: 'Stars stay above ability-tier thresholds into the 4th quarter.',
        drill: 'Track the W&T panel every drive for a full game; note when debuffs actually cost a play.',
      },
      {
        id: 'mind.tilt',
        name: 'Tilt control',
        games: 'both',
        leverage: true,
        def: 'Composure after turnovers, bad beats, and cheese; process over outcome.',
        elite: 'Same call-sheet discipline down 10 as up 10; never revenge-calls.',
        drill: 'After every INT in ranked: fixed reset ritual — breath, next call from the sheet.',
      },
      {
        id: 'mind.review',
        name: 'Review loop',
        games: 'both',
        def: 'Honest post-game review; own flaws instead of blaming the game.',
        elite: 'Names the real cause of each loss and converts it to next week’s lab focus.',
        drill: 'Weekly: one concept installed → tested in a game → reviewed.',
      },
      {
        id: 'mind.labbing',
        name: 'Focused labbing',
        games: 'both',
        def: 'Deliberate practice on one thing at a time with a measurable exit criterion.',
        elite: 'Every lab session has a single stated goal and a metric (e.g. 10 straight correct shell IDs).',
        drill: 'Timebox 30-minute labs with one metric. Stop when you hit it.',
      },
    ],
  },
];

export const ALL_SKILLS = SKILL_CATEGORIES.flatMap((c) =>
  c.skills.map((s) => ({ ...s, catId: c.id, catName: c.name })),
);

export const skillById = (id) => ALL_SKILLS.find((s) => s.id === id);

// Skills visible for a given game filter ('both' shows everything).
export const skillsForGame = (game) =>
  game === 'both'
    ? ALL_SKILLS
    : ALL_SKILLS.filter((s) => s.games === 'both' || s.games === game);

// Category average for one assessment's ratings (null-safe; unrated skipped).
export function categoryAverages(ratings) {
  return SKILL_CATEGORIES.map((c) => {
    const vals = c.skills
      .map((s) => ratings?.[s.id])
      .filter((v) => typeof v === 'number');
    return {
      id: c.id,
      name: c.name,
      avg: vals.length
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
        : null,
      rated: vals.length,
      total: c.skills.length,
    };
  });
}

// Weakest-first list of rated skills; leverage skills float on ties.
export function gapList(ratings) {
  return ALL_SKILLS.filter((s) => typeof ratings?.[s.id] === 'number')
    .map((s) => ({ ...s, rating: ratings[s.id] }))
    .sort(
      (a, b) =>
        a.rating - b.rating ||
        (b.leverage ? 1 : 0) - (a.leverage ? 1 : 0) ||
        a.name.localeCompare(b.name),
    );
}

// The single suggested focus: lowest-rated high-leverage skill (falls back
// to the overall weakest skill when no leverage skill is rated).
export function focusSkill(ratings) {
  const gaps = gapList(ratings);
  return gaps.find((s) => s.leverage) || gaps[0] || null;
}
