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
    ],

    watch:
      'Honest trade: a deep user is not in the run fit, and 2-4-5 Over Wide already has no interior gap answer. You will bleed inside zone and duo while you learn this. Do not solve it by abandoning the deep user mid-drive — call THUNDER SMOKE, or check out of 2-4-5 entirely vs 12/21/22 personnel. Change the call, not the discipline.',

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
        goal: 'Same user, four different jobs. Learn the read, not one picture.',
        metric:
          'Wrong-depth reps: how many times you played Cover 3 depth on a Cover 1 Robber call (or vice versa). That is the generalization number — drive it to zero.',
        blocks: [
          { min: 10, text: 'Warm-up: 10 react-only reps, Cover 3 Sky.' },
          {
            min: 35,
            text: 'FOUR JOBS — 40 reps in blocks of 10, same 5-shot menu against all four: (1) COVER 3 SKY, deep middle honest. (2) COVER 4 QUARTERS, top-down from the hash on the seam. (3) TAMPA 2, your half only — do not steal the pipe from Deablo. (4) COVER 1 ROBBER, sit 10–12 and rob the dig, never chase deep. Say the job out loud before each snap.',
          },
          {
            min: 15,
            text: 'Unpracticed look: script 12-personnel PA shots. Check OUT of 2-4-5 into Nickel 2-4 COVER 3 MATCH and user from there. Different front, same landmark.',
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
            text: 'Write exactly what broke. The usual five: bit on a dig and lost the post · tempo left you unaligned · motion pulled you off the middle · play-action froze you · you sprinted pre-throw. Name yours specifically.',
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
            text: 'REPAIR MENU — run only what is on your list. Beat deep → DEEP MIDDLE 30 with a hard 20-yard floor: you may not come inside 20 until the ball is out. Tempo → the 2-second pre-snap: switch to Bates, take depth, nothing else, 20 reps snapping fast on purpose. Play-action → hands off the stick through the mesh, count one-one-thousand before you move, 15 PA reps. Motion → let it go, re-anchor to the hash and not the receiver, 15 reps vs jet/orbit. Sprinting early → 20 reps with your thumb physically off R2.',
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
