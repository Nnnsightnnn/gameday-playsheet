// built by nnnsightnnn — signal from noise
// Skill playbooks — the difference between "practice usering" and knowing
// exactly what to load, who to control, what the offense runs, and what
// number you write down.
//
// The generic week in labPlan.js is a container. A playbook fills it with
// title-, team-, and player-specific work. Keyed by skill id; a skill with
// no playbook still gets the generic week, unchanged.
//
// usr.safety is built on Kenny's actual Madden 27 build (Falcons, 2-4-5 Over
// Wide, Bates 94 FS as the deep user) and is SOLO — no second controller.
// Every drill is scriptable in Practice against an offense you call yourself.

export const SKILL_PLAYBOOKS = {
  'usr.safety': {
    skillId: 'usr.safety',
    game: 'madden',
    label: 'Madden 27 · Falcons · solo lab',
    guide: 'safety-user-guide.html',
    premise:
      'You are not learning to "user better." You are learning one job: be the last man, inside the hashes, 20+ yards deep, and move only after the ball is out. Everything below serves that.',

    setup: [
      {
        label: 'Mode',
        text: 'Practice (Play Now → Practice, or Franchise → Practice). Call BOTH sides: your defense and the offense you want to see. Ball on your own 25 so there is real field behind you — a drill on the +40 teaches you nothing about getting beat deep.',
      },
      {
        label: 'Your call',
        text: 'Falcons, 2-4-5 Over Wide. Cover 3 Sky is the home call for the first two sessions. Three safeties on the grass is why this base exists — use it.',
      },
      {
        label: 'Your user',
        text: 'Bates (FS), switched to before every snap. If Bates is not the deep man on the call you picked, the call is wrong for this drill. Never user him from the box outside of short yardage.',
      },
      {
        label: 'The 5-shot menu',
        text: 'Script the offense from these five: 4 VERTS, HITCH SEAM (two seams, one of you), MTN Y POST, GO DBL POST, DAGGER. These are the shapes built to beat a single deep user — they are the same calls your own ctr1high block uses when someone does this to you.',
      },
      {
        label: 'The bait menu',
        text: 'Three more shots, live from session 3 on: MESH, DRIVE (dig over drag), PA CROSSERS. The five vertical shots teach you to hold depth. These teach you not to chase — every one dangles a shallow route to pull the deep man out of the middle. Drill only verticals and you never practice the mistake that actually beats you.',
      },
      {
        label: 'The run tax',
        text: 'Script INSIDE ZONE, COUNTER and STRETCH into the later sessions. A deep user who cannot diagnose run is a spectator with good positioning. You need reps where the correct answer is "that was run, and I stayed home anyway."',
      },
      {
        label: 'Grading',
        text: 'One line in the session note, every session: "behind me: 0/30 · PBU+INT: 4 · early moves: 3". Three numbers, ten seconds. A rep you did not count did not happen.',
      },
    ],

    cues: [
      'Landmark: deep middle, inside the hashes, 20+ yards off. That is not taste — Bates\' Deep In Zone KO only fires 20+ yards from the LoS inside the hashes, and Lurker charges you for zone depth. His abilities are telling you where to stand.',
      'React only. Do not move until the ball leaves the hand. Every deep completion you have ever given up started with forward momentum before the throw.',
      'Shuffle pre-throw, sprint post-throw. R2/RT is a ball-in-air button, not a coverage button.',
      'Eyes on the QB\'s shoulders, not the routes. The throw animation is the only honest tell in this game.',
      'Two seams and one of you: split the difference and let the throw declare. Picking one early is how a good player gets a free six.',
      'One job per call — Cover 3 Sky: deep middle, honest. Cover 4 Quarters: top-down from the hash on the seam. Tampa 2: your half only, Deablo owns the pipe. Cover 1 Robber: sit 10–12 and rob the dig, never chase deep.',
      'Early = pick (Y/△). Late = swat (X/□). Reaching for a pick you are late to is a 40-yard gain with extra steps.',
      'Pre-snap, three things in this order: personnel, fastest man, your own job. 12/21/22 in a compressed set means run, play-action or deep crossers. Trips, bunch or empty means seams, flood and RPO. You get about two seconds — spend them on the formation, not the playart.',
      'Find their fastest receiver pre-snap and know where he lined up. In the slot, the seam, slot fade, deep over and post are all live and all of them come at you. That one read tells you which half of the field to cheat.',
      'Run read: linemen firing forward is run, linemen retreating is pass, a pulling guard means counter, power or sweep. Read the near guard and tackle, never the back. And when it is run, take an outside-in angle so you force the ball back into pursuit instead of flying past it.',
      'Play-action: delay the downhill trigger one full beat — count one-one-thousand through the mesh. If the QB still has the ball after the fake, forget the run and find the deepest route entering your area. Every PA touchdown you have given up was a trigger you could not take back.',
      'The internet will tell you to user a safety from 10-15 yards, and one popular guide says set safety depth to 9. Ignore both. Your build is Bates with a Deep In Zone KO that only fires 20+ yards from the LoS inside the hashes. The ability tells you where to stand, and it disagrees with the advice.',
      'Baiting is next week, not this week. Once react-only is automatic you hover the window you need to kill, drift toward the secondary threat to sell it open, then break on the throw. Do it before the discipline is automatic and you have only invented a new way to get beat deep.',
    ],

    watch:
      'Honest trade: a deep user is not in the run fit, and 2-4-5 Over Wide already has no interior gap answer. You will bleed inside zone and duo while you learn this. Do not solve it by abandoning the deep user mid-drive — call THUNDER SMOKE, or check out of 2-4-5 entirely vs 12/21/22 personnel. Change the call, not the discipline. The run read in the cues makes you a faster diagnoser, not a run defender; knowing it is counter does not buy you permission to leave the middle of the field empty.',

    sessions: {
      0: {
        goal: 'Get the number. You cannot know the week worked without a before picture — and you have never actually counted this.',
        metric:
          'Baseline = completions allowed BEHIND you out of 30. Elite bar: 0 behind you and 6+ PBU/INT.',
        blocks: [
          {
            min: 10,
            text: 'Warm-up, unscored: Cover 3 Sky vs 4 VERTS, ~10 reps. One job — find the deep-middle landmark and then stop moving. Get bored on purpose.',
          },
          {
            min: 30,
            text: 'DEEP MIDDLE 30 — 30 scripted reps, Cover 3 Sky, Bates usered, react-only rule. Rotate the 5-shot menu. Count three things: completions behind you, PBU+INT, and reps where you moved before the throw.',
          },
          {
            min: 20,
            text: 'One CPU game (All-Madden). Score is irrelevant. Cover 3 Sky on every passing down, Bates usered every snap, grade only that. Write the three numbers again.',
          },
        ],
      },
      1: {
        goal: 'Burn in the one habit that fixes most of this: hands still until the ball is out.',
        metric:
          'Pre-throw movement count. Target: under 4 of 40. That number — not the picks — is the habit.',
        blocks: [
          { min: 10, text: 'Warm-up: 10 react-only reps, Cover 3 Sky.' },
          {
            min: 35,
            text: 'DEEP MIDDLE 40 — one call only, all 40 reps, same 5-shot menu. New rule this session: your thumb is OFF sprint until the ball is in the air. Chasing the elite marker — nothing lands behind you.',
          },
          {
            min: 15,
            text: 'One half vs CPU. Cover 3 Sky every passing down. Same three numbers.',
          },
        ],
      },
      2: {
        goal: 'Same user, four different jobs — and the first shots built to pull you out of the middle rather than run past you.',
        metric:
          'Two numbers now. Wrong-depth reps: Cover 3 depth on a Cover 1 Robber call, or the reverse. Chase reps: you left the deep middle for a route under 12 yards. Both to zero.',
        blocks: [
          { min: 10, text: 'Warm-up: 10 react-only reps, Cover 3 Sky.' },
          {
            min: 30,
            text: 'FOUR JOBS — 40 reps in blocks of 10, vertical menu against all four, each with its own way of losing. (1) COVER 3 SKY: deep middle honest; the mistake is biting flats or drags before the verticals are capped. (2) COVER 4 QUARTERS: top-down from the hash on the seam; the mistake is chasing a shallow and vacating your quarter. (3) TAMPA 2: your half only; the mistake is stealing the pipe from Deablo. (4) COVER 1 ROBBER: sit 10–12 and rob the dig; the mistake is over-helping underneath and handing over a one-play touchdown. Say the job out loud before each snap.',
          },
          {
            min: 20,
            text: 'BAIT MENU — 20 reps, Cover 3 Sky only, vs MESH, DRIVE and PA CROSSERS. One rule: you may not leave the deep middle for any route under 12 yards. The shallow is not your problem, it is the setup; the dig or post behind it is the actual call. Count every rep you chased.',
          },
        ],
      },
      3: {
        goal: 'Find out what survives a human. The output is a list, not a feeling.',
        metric:
          'Hit/miss on every dropback — hit = you were in position when the ball came out. Write the raw count AND the broke-list. That list is session 5.',
        blocks: [
          {
            min: 10,
            text: 'Warm-up: 10 react-only reps before you queue. Do not go in cold — the first online drive is where the habit dies.',
          },
          {
            min: 45,
            text: 'Online H2H. Restrict yourself to COVER 3 SKY / COVER 4 QUARTERS / COVER 1 ROBBER, Bates usered every passing down. Tally hit/miss out loud as you play.',
          },
          {
            min: 5,
            text: 'Write exactly what broke. The usual seven: bit on a dig and lost the post · chased a shallow crosser out of the middle · tempo left you unaligned · motion pulled you off the middle · play-action froze you · you sprinted pre-throw · you got gashed on the ground and never changed the call. Name yours specifically.',
          },
        ],
      },
      4: {
        goal: 'Fix only what broke. General practice here is comfort, not repair.',
        metric:
          'Rep the one failure until it stops happening 10 straight. Ten clean in a row, then move on — not "it feels better."',
        blocks: [
          { min: 10, text: 'Warm-up: 10 react-only reps, Cover 3 Sky.' },
          {
            min: 35,
            text: 'REPAIR MENU — run only what is on your list. Beat deep → DEEP MIDDLE 30 with a hard 20-yard floor: you may not come inside 20 until the ball is out. Chased a shallow → 20 bait-menu reps, MESH and DRIVE only, under-12-yards rule enforced. Tempo → the 2-second pre-snap: switch to Bates, take depth, nothing else, 20 reps snapping fast on purpose. Play-action → hands off the stick through the mesh, count one-one-thousand before you move, 15 PA reps. Motion → let it go, re-anchor to the hash and not the receiver, 15 reps vs jet/orbit. Sprinting early → 20 reps with your thumb physically off R2. Gashed on the ground → 15 reps vs INSIDE ZONE, COUNTER and STRETCH reading the near guard, outside-in angle, and still nothing behind you.',
          },
          {
            min: 15,
            text: 'Short application to confirm the repair held — one CPU half, the failure situation forced on purpose.',
          },
        ],
      },
      5: {
        goal: 'Prove it against a human. Beat session 4\'s count.',
        metric:
          'Same hit/miss grading as Pressure test 1. The delta is the week. If it did not move, the repair was aimed at the wrong thing — say so honestly.',
        blocks: [
          { min: 10, text: 'Warm-up: 10 react-only reps before you queue.' },
          {
            min: 45,
            text: 'Online H2H, same three calls, same live grading. Do not add anything new this session — you are measuring, not experimenting.',
          },
          {
            min: 5,
            text: 'Note the delta vs Pressure test 1, and whether the specific thing you repaired is still on the list.',
          },
        ],
      },
      6: {
        goal: 'Measure the week against the baseline, re-rate honestly, then go play.',
        metric:
          'DEEP MIDDLE 30 rerun vs session 1. Completions behind you, PBU+INT, early moves — three numbers, side by side. That comparison is the whole week.',
        blocks: [
          {
            min: 15,
            text: 'Re-run DEEP MIDDLE 30 exactly as session 1: Cover 3 Sky, Bates, same 5-shot menu, 30 reps. Same conditions or the comparison is worthless.',
          },
          {
            min: 15,
            text: 'Re-rate Safety usering in the Assess lens and save a snapshot. A 4 means "reliable under pressure" — your Pressure test 2 count has to back it up. Then skim Gaps for next week.',
          },
          {
            min: 30,
            text: 'Free play. Couch, family, no grading, no user rules. You earned the fun game — protect it.',
          },
        ],
      },
    },
  },
};

export function playbookFor(skillId) {
  return SKILL_PLAYBOOKS[skillId] || null;
}

// Overlay a playbook onto a generic week. Session titles stay (they are the
// week's spine); goal/blocks are replaced and metric/label are added. Safe to
// call on a plan that already has it applied, and on skills with no playbook.
export function applyPlaybook(plan) {
  const pb = plan && playbookFor(plan.skillId);
  if (!pb) return plan;
  return {
    ...plan,
    playbookId: pb.skillId,
    playbookLabel: pb.label,
    sessions: (plan.sessions || []).map((s) => {
      const over = pb.sessions?.[s.idx];
      if (!over) return s;
      return {
        ...s,
        goal: over.goal ?? s.goal,
        blocks: over.blocks ?? s.blocks,
        metric: over.metric ?? s.metric,
      };
    }),
  };
}
