// built by nnnsightnnn — signal from noise
// Atlanta Falcons — Madden 27 role sheet.
//
// Ratings are EA's official Madden 27 launch numbers (ea.com ratings site,
// cross-checked against maddenratings.com for sub-attributes). Roster is the
// 8/13/26 launch roster — it does NOT know about Jalon Walker's camp ACL or
// Michael Penix's rehab, so in-game both are available.
//
// THE DOCTRINE CORRECTION: this repo has carried a "personnel-first 3-4"
// note for the Falcons since 8/06. The roster does not support it. There is
// not one defensive tackle above 74 OVR on this team, both starting edges
// have Man Coverage in the 30s, and the two best defenders are safeties.
// This is a nickel team with an odd-front pressure package, not a 3-4 team.

import { CONFIDENCE } from './personnel';

export const FALCONS_PERSONNEL = {
  id: 'falcons-m27',
  game: 'madden',
  team: 'Atlanta Falcons',
  name: 'Falcons — Madden 27 personnel',
  teamOvr: '81 OVR — 83 offense / 78 defense, 19th in the league',
  updatedAt: '2026-08-14',

  doctrine: {
    offense:
      'Stefanski/Rees wide-zone and play-action, run-first, under center and pistol, heavy 11 and 12 personnel. The identity is Bijan behind Lindstrom, then boot and PA off that action to London. You are not a dropback team — Tua is 69 AWR with 90 short accuracy, which is a rhythm thrower, not a full-field progression reader.',
    defense:
      'Nickel base (4-2-5) with a five-man odd front as a run-down and pressure package. Ulbrich ran nickel 70% of snaps in New York and is Cover 1 heavy. Your talent is Bates + Terrell + a stack of 88–92 speed corners. Live in five DBs and get Bowman on the grass instead of a third linebacker.',
    honest:
      'The single biggest lie you could tell yourself with this roster is that it is a 3-4. You have no nose tackle. Playing base 3-4 puts a 69 OVR body at the most important run-defense job on the field and asks two 36-MCV speed rushers to drop into curl-flat. Use the odd front as a package, never as your base.',
  },

  roles: [
    // ────────────────────────────── OFFENSE ──────────────────────────────
    {
      id: 'off.qb',
      side: 'offense',
      pos: 'QB',
      slot: 'QB1',
      name: 'Rhythm play-action trigger',
      personnel: '11 / 12',
      job: 'Sell the wide-zone fake, hit the first defined read on time, and get the ball out before the pocket collapses. This job is timing and placement, not creation. You are not asked to hold the ball, and you are not asked to run.',
      ratings: [
        { key: 'TAS', tier: 'core', conf: 'ea', why: 'Under 20 yards is where this offense lives — boot flats, slants, and the Short Out Elite window to London. Tua is 90 here, his single best throwing trait.' },
        { key: 'THP', tier: 'core', conf: 'ea', why: 'Ball velocity is literally how fast the window has to close. The deep out and the dig are THP throws, not accuracy throws.' },
        { key: 'BSK', tier: 'support', conf: 'm27', why: 'M27 pockets collapse and most QB abilities are conditioned on being unpressured. Break Sack buys you the half-second to still be a passer.' },
        { key: 'STR', tier: 'support', conf: 'ea', why: 'New in M27: the QB Sneak Meter weighs QB Strength and body weight against the defenders\' shed strength before the snap. This is the first year QB Strength has a documented job.' },
      ],
      traps: [
        { key: 'PAC', conf: 'stale', why: 'Clint Oldenburg — ex-NFL lineman and then Madden gameplay production lead — said publicly that Play Action "has been tuned out of the game essentially over the course of several years... talking fractions of a second now." Madden School lab-tested it in M21 with a 93 PAC QB against a kicker playing QB and found no difference in zone reaction. Never re-tested for M27, but do not pick your QB on this number.' },
        { key: 'AWR', conf: 'm26', why: 'Everything EA says Awareness governs — pass trajectory, option-route decisions, scramble reaction, throwing it away — is CPU behavior. For the QB you personally control it is mostly an OVR inflator. It is real for the CPU QB you play against.' },
      ],
      archetype: { name: 'Field General / Strong Arm', keys: ['THP', 'TAS', 'TAM', 'TAD'], conf: 'ea' },
      holder: {
        name: 'Tua Tagovailoa',
        ovr: 74,
        grade: 'fit',
        line: 'THP 87 · TAS 90 · TAM 84 · TAD 84 · TOR 83 · BSK 79 · AWR 69 · SPD 82',
        verdict: 'A precise fit for what the scheme asks and a bad fit for anything else. 90 short accuracy runs the boot game; 69 awareness means you must give him defined reads. Do not ask him to work a full field.',
      },
      backup: {
        name: 'Michael Penix Jr.',
        ovr: 73,
        line: 'THP 92 · TAS 86 · TAM 85 · TAD 76 · TOR 74 · SPD 84',
        verdict: 'The arm, not the accuracy. 92 THP but 76 deep accuracy is a strange combination — he throws it far, not well. Swap to him only if you need to threaten the seam vertically and can live with worse rhythm throws.',
      },
      breaks:
        'Put a creator-style QB in this job and you stop running the ball, which is the actual offense. Put Tua in a dropback game and the 69 awareness shows up as late reads and sacks — the offense does not have the pass protection to survive that.',
      reads: [
        { when: 'They walk a safety into the box and press your outside receivers', do: 'Cover 1 or Cover 0. Tua is fine here — you have a defined single read. Take the London iso or check to the boot away from the pressure.' },
        { when: 'Two-high, both safeties past 12 yards, corners bailing', do: 'The middle is vacated. Run it. This is why the run-first identity exists — the answer to two-high is not a better throw, it is a handoff.' },
        { when: 'You have been sacked twice on the same edge', do: 'Chip block that rusher with the back or the U tight end (M27 lets you assign a chip to any TE/HB route). This is new and it is the direct counter to an elite edge.' },
      ],
    },
    {
      id: 'off.hb',
      side: 'offense',
      pos: 'HB',
      slot: 'HB1',
      name: 'Zone-cut feature back',
      personnel: '11 / 12 — every early down',
      job: 'Press the frontside of the wide zone, read the second-level defender, and cut once. Not a bounce-every-play back — the cut is decisive and inside. He is also your best receiving mismatch out of the backfield.',
      ratings: [
        { key: 'COD', tier: 'core', conf: 'm26', why: 'The one real, published, numeric breakpoint at the position: at 90+ Change of Direction a back executes sharp plant-and-go cuts WITHOUT deceleration. Below 90 the engine blends rounded cut animations and adds latency. This is the rating that makes a zone-cut back work at all.' },
        { key: 'ACC', tier: 'core', conf: 'm26', why: 'Zone running is short-space. How fast he re-reaches top speed out of the cut matters more than how fast he tops out.' },
        { key: 'BTK', tier: 'support', conf: 'm26', why: 'Yards after the fit is broken. 93 on Bijan is why bad blocks still get 4 yards.' },
        { key: 'JKM', tier: 'support', conf: 'm26', why: 'The finesse win condition. Bijan at 97 with the First One Free X-Factor is a genuinely different button than any other back you will play with.' },
      ],
      traps: [
        { key: 'BCV', conf: 'read', why: 'No source in any Madden year has ever verified Ball Carrier Vision does anything for a user-controlled back. M27\'s headline running feature (ML Ball Carrier Pathing) is explicitly AI-ballcarrier-only, which is reason to suspect BCV is user-irrelevant — but EA never links them. Flagged as inference, not fact.' },
      ],
      archetype: { name: 'Elusive Back', keys: ['COD', 'JKM', 'AGI'], conf: 'ea' },
      holder: {
        name: 'Bijan Robinson',
        ovr: 95,
        grade: 'fit',
        line: 'SPD 93 · ACC 92 · AGI 92 · COD 95 · BTK 93 · CAR 91 · JKM 97 · TRK 84 · CTH 75 · CIT 63',
        verdict: 'The best player on the roster and a perfect scheme fit — 95 COD clears the only real threshold at the position with margin. X-Factor "First One Free" boosts fakeout rate on the next juke/spin/hurdle while in the zone. Note the 63 CIT: he is a checkdown and screen back, not a contested-catch receiver.',
      },
      backup: {
        name: 'Brian Robinson Jr.',
        ovr: 78,
        line: 'SPD 87 · ACC 90 · CAR 94 · TRK 86 · BTK 85 · CTH 65 · CIT 43',
        verdict: 'Short yardage and four-minute offense only. 43 CIT means never throw him a contested ball — that is a turnover, not an incompletion.',
      },
      breaks:
        'A back below 90 COD in this job turns every zone cut into a rounded, decelerating arc and the backside defender catches him from behind. That is the difference between a 7-yard gain and a 2-yard gain on the exact same blocking.',
      reads: [
        { when: 'The backside end is crashing hard every snap', do: 'The cutback is dead. Stop reading it — take the frontside bang, or run a boot the other way and make him honest.' },
        { when: 'They are in a two-high shell with light box', do: 'Feed him. This is free yardage; two-high is a passing-game answer that gives up the run.' },
        { when: 'Bijan is in the zone (X-Factor active)', do: 'Get him the ball on space touches — screens, tosses, anything where the first defender is one-on-one. The fakeout bonus only pays where there is someone to fake out.' },
      ],
    },
    {
      id: 'off.x',
      side: 'offense',
      pos: 'WR',
      slot: 'X',
      name: 'Contested isolation receiver',
      personnel: '11 / 12 — backside of every wide zone',
      job: 'Win alone on the backside. He gets no help, faces press, and has to beat one man on the post, comeback, and back-shoulder off boot action. He is the reason the defense cannot put nine in the box.',
      ratings: [
        { key: 'CIT', tier: 'core', conf: 'ea', why: 'The most repriced rating in Madden 27. Under Timing-Based Catching, CIT protects the GREEN window against a four-tier coverage penalty (open / partially covered / covered / smothered). It is no longer a hidden dice roll — it is literal input forgiveness on the throws that decide games. Competitive game style tightens the green window further, which raises CIT value online.' },
        { key: 'SPC', tier: 'core', conf: 'ea', why: 'Same mechanism, different penalty: SPC protects the green window against the catch-DIFFICULTY penalty — diving, sideline, toe-drag, aggressive, one-handed. Contested and out-of-frame throws live here.' },
        { key: 'RLS', tier: 'core', conf: 'ea', why: 'M27 press is now route-aware — the defender knows an inside-breaking route wants to win inside. EA is explicit that ratings still govern the outcome: "we are not trying to create a world where a low-tier DB can line up inside and always erase an elite receiver on a slant just because you picked the right leverage."' },
        { key: 'CTH', tier: 'support', conf: 'ea', why: 'Demoted, not dead. EA states plainly that Catching drives the YELLOW window only and "does not shrink based on coverage or catch difficulty." It is the legacy dice roll. It still matters below your TBC Minimum Throw Distance setting, where throws bypass timing entirely.' },
      ],
      traps: [],
      archetype: { name: 'Physical', keys: ['CIT', 'SPC', 'RLS'], conf: 'ea' },
      holder: {
        name: 'Drake London',
        ovr: 92,
        grade: 'fit',
        line: 'CTH 97 · CIT 94 · SPC 95 · RLS 95 · SPD 88 · ACC 92 · AWR 94 · SRR 86 / MRR 85 / DRR 80',
        verdict: 'Built exactly for this job and for this year\'s catching system — 94 CIT and 95 SPC is a very wide green window on contested throws. 95 Release beats press without help. Superstar abilities: Acrobat, Short Out Elite, Quick Jump. Short Out Elite is the single most callable ability on the roster.',
      },
      breaks:
        'Put a speed-only receiver in this job and every backside iso becomes a 50/50 that you lose. Without a winning X, defenses rotate the safety to the field and your run game gets an extra hat in the box.',
      reads: [
        { when: 'The corner is playing inside shade / inside leverage on him', do: 'Everything outside is open — take the out, the comeback, the fade. Short Out Elite makes this near-automatic under 10 yards inside the numbers.' },
        { when: 'They bracket him with the safety over the top', do: 'That is one fewer defender everywhere else. Go to Pitts on the seam or run into the light box. Do not force the bracket.' },
        { when: 'You lost a rep to press', do: 'Do not just call the same route. Change the leverage input on the release, or motion him to remove press entirely.' },
      ],
    },
    {
      id: 'off.z',
      side: 'offense',
      pos: 'WR',
      slot: 'Z',
      name: 'Motion / field-stretch receiver',
      personnel: '11',
      job: 'Move before the snap to tell you man vs zone, then threaten the intermediate outside. This is the diagnostic job as much as the pass-catching job — his motion is how you read the defense.',
      ratings: [
        { key: 'SPD', tier: 'core', conf: 'ea', why: 'Still primary for separation — but note EA built Jostle specifically so a high-coverage defender "can affect the receiver\'s speed and timing." Speed is contestable this year in a way it has not been before.' },
        { key: 'MRR', tier: 'core', conf: 'ea', why: 'The 10–20 yard band is exactly where M27 ability distance bands sit (Mid In / Mid Out Elite = 10–20 yards). This is the real breakpoint geography of the passing game.' },
        { key: 'CIT', tier: 'support', conf: 'ea', why: 'Green-window protection on the dig and the deep out, where the safety is closing.' },
      ],
      traps: [],
      archetype: { name: 'Deep Threat / Route Runner', keys: ['SPD', 'MRR', 'DRR'], conf: 'ea' },
      holder: {
        name: 'Jahan Dotson',
        ovr: 73,
        grade: 'stretch',
        line: 'SPD 92 · ACC 93 · COD 87 · CTH 83 · CIT 83 · SPC 83 · SRR 72 / MRR 74 / DRR 75',
        verdict: 'Fast enough, everything else is average. 83 across the catching triad means a normal green window, not a forgiving one — you have to be on time with him in a way you do not with London. This is the roster\'s clearest downgrade from WR1 to WR2.',
      },
      breaks:
        'This is already a soft spot. If the defense takes London away and your Z cannot win, the offense has no second answer in the passing game and becomes fully run-dependent.',
      reads: [
        { when: 'He motions and a defender follows him across the formation', do: 'Man coverage. Take the mesh, the drag, or the wheel — anything that runs a defender into traffic.' },
        { when: 'He motions and the defense passes him off / nobody travels', do: 'Zone. Stop trying to beat a man and go find the hole between the zones instead.' },
      ],
    },
    {
      id: 'off.slot',
      side: 'offense',
      pos: 'WR',
      slot: 'Slot / F',
      name: 'Vertical decoy and gadget',
      personnel: '11 — passing downs',
      job: 'Occupy a safety with pure speed. He is not your chain-mover in year one. Use him on verticals, jet motion, and screens where the ball is out fast and the awareness deficit never shows up.',
      ratings: [
        { key: 'SPD', tier: 'core', conf: 'ea', why: 'Actual straight-line threat is the entire value of this role. 95 speed forces a safety to honor him.' },
        { key: 'ACC', tier: 'core', conf: 'ea', why: 'Jet and screen touches are all acceleration, no top end.' },
        { key: 'SRR', tier: 'support', conf: 'ea', why: 'What he does NOT have. Under 10 yards is where a real slot lives, and this is the gap.' },
      ],
      traps: [
        { key: 'AWR', conf: 'm26', why: 'Normally an OVR inflator, but at 51 it is low enough to matter on option routes and scramble-drill reactions, which are exactly the CPU behaviors Awareness governs. Do not put him in a read-option route.' },
      ],
      archetype: { name: 'Deep Threat', keys: ['SPD', 'ACC', 'DRR'], conf: 'ea' },
      holder: {
        name: 'Zachariah Branch (R)',
        ovr: 73,
        grade: 'stretch',
        line: 'SPD 95 · ACC 95 · AGI 93 · COD 88 · CTH 81 · CIT 76 · SRR 72 / MRR 73 / DRR 74 · AWR 51',
        verdict: 'The fastest player on your roster and a rookie in every other sense. 95/95/93 is a real weapon on a straight line; 51 awareness and 76 CIT means he is not who you throw to in traffic on third down. Use the speed, hide the rest.',
      },
      backup: {
        name: 'Olamide Zaccheaus',
        ovr: 73,
        line: 'SPD 90 · AGI 84 · COD 84 · AWR 77',
        verdict: 'The safer body. Less explosive, meaningfully more reliable on option routes. Play him on third down if Branch keeps running the wrong route.',
      },
      breaks:
        'Ask a 51-AWR rookie to be your third-down slot and you get blown option routes and drops in traffic. The failure mode is not being slow — it is being in the wrong place.',
      reads: [
        { when: 'The safety is shading his side pre-snap', do: 'The decoy worked. Throw away from him — London is now one-on-one on the backside.' },
        { when: 'They put their nickel on him in press', do: 'Motion him or run him vertical. A press corner against 95 speed with no help is a bad bet for the defense.' },
      ],
    },
    {
      id: 'off.tey',
      side: 'offense',
      pos: 'TE',
      slot: 'Y',
      name: 'Seam threat / matchup problem',
      personnel: '11 / 12',
      job: 'Attack the middle of the field vertically and force the defense to declare. Against man he is a mismatch on a linebacker; against zone he sits in the hole between the hook defenders.',
      ratings: [
        { key: 'SPD', tier: 'core', conf: 'ea', why: '90 speed at tight end is what makes the seam a real threat rather than a decoration. This is the whole reason to play him over a blocker.' },
        { key: 'CIT', tier: 'core', conf: 'ea', why: 'Every seam throw is contested by definition — you are throwing between a hook defender and a safety. Green-window protection is the position.' },
        { key: 'SRR', tier: 'support', conf: 'ea', why: 'EA\'s own ratings blog names Short and Medium Route Running as the defining traits of the best tight end in the game. That is a strong tell about what the position actually is.' },
      ],
      traps: [],
      archetype: { name: 'Vertical Threat', keys: ['SPD', 'CIT', 'DRR'], conf: 'ea' },
      holder: {
        name: 'Kyle Pitts Sr.',
        ovr: 81,
        grade: 'fit',
        line: 'SPD 90 · ACC 92 · AGI 80 · CTH 85 · CIT 81 · SPC 87 · SRR 75 / MRR 71 / DRR 66 · AWR 81',
        verdict: 'The speed is genuinely elite for the position and 87 SPC means he wins the contested vertical ball. The route running is not there — 66 deep route running means he does not separate on nuance, he separates on speed. Run him at the seam, not on option routes.',
      },
      backup: {
        name: 'Austin Hooper',
        ovr: 74,
        line: 'SPD 84 · CTH 86 · CIT 81 · SPC 81 · SRR 65 / MRR 60',
        verdict: 'Hands over speed. The safer third-down target, no vertical threat.',
      },
      breaks:
        'Without a seam threat here, the safeties never have to respect the middle of the field and both your posts and your dig routes close. Pitts is what keeps two-high honest.',
      reads: [
        { when: 'A linebacker is aligned over him with no safety help', do: 'Seam, immediately. That is the mismatch the whole formation exists to create.' },
        { when: 'They roll a safety to his side every time he flexes out', do: 'You have moved the safety with formation alone. Run to the side he vacated.' },
      ],
    },
    {
      id: 'off.teu',
      side: 'offense',
      pos: 'TE',
      slot: 'U',
      name: 'Chip blocker / move blocker',
      personnel: '12 / 13',
      job: 'New job in Madden 27. Chip the edge rusher on the way out, then leak into the flat. This is the assignment that keeps a bad tackle from losing you the game.',
      ratings: [
        { key: 'PBK', tier: 'core', conf: 'ea', why: 'M27 added an assignable Chip Block on any TE/HB route, resolved as a win/loss that either knocks the rusher off his path or distorts the blocker\'s route. EA frames it explicitly as the counter to an elite edge rusher. This is the first credible competitive reason in years to care about a tight end\'s blocking.' },
        { key: 'IBL', tier: 'core', conf: 'ea', why: 'The move-blocking half of the job. On wide zone he is pulling across the formation and blocking a linebacker in space, which is Impact Blocking rather than Run Block. EA lists it as a key attribute of the Agile blocking archetype.' },
        { key: 'RBK', tier: 'support', conf: 'ea', why: 'You are in 12 personnel to run the ball. If he cannot base block the end, the second tight end is costing you a receiver for nothing.' },
      ],
      traps: [],
      archetype: { name: 'Blocking', keys: ['RBK', 'PBK', 'IBL'], conf: 'ea' },
      holder: {
        name: 'Charlie Woerner',
        ovr: 65,
        grade: 'stretch',
        line: 'SPD 82 — blocking-profile TE',
        verdict: 'Low overall, right job. He exists to make 12 personnel real and to chip the rusher beating Jawaan Taylor. Do not send him on routes.',
      },
      breaks:
        'Skip this role and your right tackle is on an island against every edge rusher in the game. Given Taylor\'s 70 run blocking, this is not a luxury role on this roster — it is a patch.',
      reads: [
        { when: 'Your right tackle has lost two reps in a row', do: 'Assign the chip to that side. This is the specific M27 mechanic for this exact problem.' },
        { when: 'They are dropping eight and rushing three', do: 'Release him. There is nothing to chip and you need a body in the route.' },
      ],
    },
    {
      id: 'off.lt',
      side: 'offense',
      pos: 'LT',
      slot: 'LT',
      name: 'Blindside pass protector',
      personnel: 'Every snap',
      job: 'Hold the edge alone in pass protection so the boot game and the play-action shot have time to develop. In the run game he is the backside cutoff, not the mover.',
      ratings: [
        { key: 'PBP', tier: 'core', conf: 'm26', why: 'Counters the defender\'s Power Moves. Which of PBP/PBF matters depends entirely on who is rushing you — EA notes M27 rushers chain moves, so a lopsided specialist gets exposed.' },
        { key: 'PBF', tier: 'core', conf: 'm26', why: 'Counters Finesse Moves — the swim, rip, and spin that speed rushers live on.' },
        { key: 'STR', tier: 'support', conf: 'm26', why: 'Feeds the block resolution alongside PBP/PBF rather than replacing them.' },
      ],
      traps: [
        { key: 'AWR', conf: 'stale', why: 'Awareness is NOT a trap on the offensive line — it drives blocking-assignment targeting speed and blitz pickup. Listed here specifically so you do not carry the QB trap over to the line by mistake.' },
      ],
      archetype: { name: 'Pass Protector', keys: ['PBK', 'PBF', 'PBP'], conf: 'ea' },
      holder: {
        name: 'Jake Matthews',
        ovr: 89,
        grade: 'fit',
        line: 'PBK 91 (PBP 93 / PBF 89) · RBK 78 · IBL 85 · STR 86 · AWR 93 · SPD 70',
        verdict: 'Legitimately good and well-balanced against both rush types. 78 run blocking and 70 speed is the tell: he is a cutoff blocker on wide zone, not a reach blocker. Do not run outside zone to his side and expect him to get there.',
      },
      breaks:
        'Lose him and the offense\'s identity collapses — every backup lineman on this roster is 63–72 OVR. This is the single most injury-sensitive spot on the team after Lindstrom.',
      reads: [
        { when: 'You are getting beat with speed around the arc', do: 'That is a Finesse Move win. Chip with the back, or slide protection that way.' },
        { when: 'You are getting walked back into the QB', do: 'Power win. Keep the tight end in and stop trying to five-out.' },
      ],
    },
    {
      id: 'off.lg',
      side: 'offense',
      pos: 'LG',
      slot: 'LG',
      name: 'Gap displacer / duo double',
      personnel: 'Every snap',
      job: 'Win the double team on duo and inside zone, then climb to the linebacker. He is a power blocker on a team that would like to be a zone team.',
      ratings: [
        { key: 'STR', tier: 'core', conf: 'ea', why: 'Now mechanically explicit: M27\'s QB Sneak Meter names Strength and weight of the Center AND Guards as inputs, weighed against the defenders\' shed strength before the snap. Losing that trench math shrinks your timing window before the ball is even snapped.' },
        { key: 'RBP', tier: 'core', conf: 'm26', why: 'Run Block Power counters the defender at the point of attack on gap and duo schemes.' },
        { key: 'IBL', tier: 'support', conf: 'ea', why: 'Getting to the second level after the double is what turns a 4-yard run into a 12-yard run.' },
      ],
      traps: [],
      archetype: { name: 'Power', keys: ['RBP', 'PBP', 'RBK'], conf: 'ea' },
      holder: {
        name: 'Matthew Bergeron',
        ovr: 76,
        grade: 'stretch',
        line: 'STR 89 · RBK 82 · IBL 86 · PBK 76 · AWR 78 · SPD 63',
        verdict: 'Strong, slow, adequate. 63 speed is the slowest starter on the line — he cannot reach-block on true wide zone. He is fine on duo and gap, exposed on stretch. Pass protection at 76 is the soft spot on the interior.',
      },
      breaks:
        'A 63-speed guard on outside zone simply does not arrive. Every stretch call to the left is a bet that he gets there, and he usually does not — which is why the gap-scheme half of the playbook matters more than the wide-zone label suggests.',
      reads: [
        { when: 'Stretch left keeps getting strung out', do: 'Stop calling it. Switch to duo or inside zone, where he wins.' },
        { when: 'You are getting interior pressure on 3rd and long', do: 'Keep the back in. 76 pass block is not surviving a good 3-tech alone.' },
      ],
    },
    {
      id: 'off.c',
      side: 'offense',
      pos: 'C',
      slot: 'C',
      name: 'Zone reach anchor / sneak fulcrum',
      personnel: 'Every snap',
      job: 'Make the frontside reach block on zone, identify the front, and win the sneak. In Madden 27 the last of those became a literal pre-snap calculation.',
      ratings: [
        { key: 'RBF', tier: 'core', conf: 'm26', why: 'Run Block Finesse is the reach-and-zone-block rating. This is the center\'s primary job in a wide-zone offense.' },
        { key: 'STR', tier: 'core', conf: 'ea', why: 'The Sneak Meter weighs Center strength and weight explicitly. Every goal-line and 4th-and-1 push runs through this number now.' },
        { key: 'AWR', tier: 'support', conf: 'stale', why: 'The one published OL formula anyone has ever quoted — the center\'s Awareness counts double and replaces the lowest lineman\'s in the unit average — is from a Madden 18-era EA design doc, and the poster himself hedged that the formula may have changed. Treat as folklore, not fact.' },
      ],
      traps: [],
      archetype: { name: 'Agile', keys: ['RBF', 'PBF', 'IBL'], conf: 'ea' },
      holder: {
        name: 'Ryan Neuzil',
        ovr: 82,
        grade: 'fit',
        line: 'RBK 89 (RBF 91) · PBK 81 · STR 85 · AWR 91 · SPD 69',
        verdict: 'Quietly the right body for this offense. 91 run block finesse is exactly the reach-blocking trait wide zone needs, and 91 awareness handles front identification. 81 pass block means he needs help against a real 3-tech.',
      },
      breaks:
        'A center who cannot reach turns wide zone into a pile. And with a light interior D-line league-wide, a weak sneak fulcrum costs you the short-yardage downs that keep drives alive.',
      reads: [
        { when: 'The sneak meter shows you losing the push pre-snap', do: 'Do not run it. That indicator exists specifically so you can check out — take the play-action or the boot instead.' },
        { when: 'They are aligning a nose over him every snap', do: 'You are one-on-one at the worst spot. Run away from the nose or double him with the guard.' },
      ],
    },
    {
      id: 'off.rg',
      side: 'offense',
      pos: 'RG',
      slot: 'RG',
      name: 'Best blocker — run point of attack',
      personnel: 'Every snap',
      job: 'The best offensive lineman on the team, so the run game is built to go behind him. Frontside on duo, puller on gap, and the anchor of the sneak.',
      ratings: [
        { key: 'RBK', tier: 'core', conf: 'ea', why: '96 overall run block is the highest offensive-line rating on the roster and the reason the run game exists.' },
        { key: 'RBF', tier: 'core', conf: 'm26', why: '95 finesse means he can actually reach on zone — the only interior lineman who genuinely can.' },
        { key: 'IBL', tier: 'support', conf: 'ea', why: '91 impact blocking is second-level work; the "Run Protector" superstar ability compounds it.' },
      ],
      traps: [],
      archetype: { name: 'Power / Agile', keys: ['RBK', 'RBP', 'RBF'], conf: 'ea' },
      holder: {
        name: 'Chris Lindstrom',
        ovr: 93,
        grade: 'fit',
        line: 'RBK 96 (RBP 92 / RBF 95) · PBK 83 (PBP 86 / PBF 81) · IBL 91 · STR 92 · AWR 97 · SPD 76',
        verdict: 'Elite, and the reason to run right despite the tackle next to him being the roster\'s weak link. Superstar abilities Tough Nut and Run Protector. Note 81 pass block finesse — a speed rusher inside on a stunt is his one hole.',
      },
      breaks:
        'This is the run game. If he goes down, the identity of the offense goes with him and you become a 74-OVR quarterback trying to throw your way through games.',
      reads: [
        { when: 'They are slanting the interior line away from him', do: 'Run right at the slant with a gap scheme — he wins the down block and the slant takes the defender out of the play for you.' },
        { when: 'Stunts are getting home up the middle', do: '81 PBF is the leak. Keep a back in on the strong side or slide the protection right.' },
      ],
    },
    {
      id: 'off.rt',
      side: 'offense',
      pos: 'RT',
      slot: 'RT',
      name: 'The hole — protect it',
      personnel: 'Every snap',
      job: 'Survive. This is the weakest starting spot on the offense, and the game plan has to account for it rather than pretend it is fine.',
      ratings: [
        { key: 'PBP', tier: 'core', conf: 'm26', why: 'Power rush is what he can survive — 81 pass block with 87 strength holds up against a bull rush.' },
        { key: 'RBK', tier: 'core', conf: 'ea', why: 'And this is the problem: 70. The run game is materially worse to the right, which is awkward because Lindstrom is right next to him.' },
        { key: 'PBF', tier: 'support', conf: 'm26', why: 'Against a finesse rusher he needs help, full stop. At 66 speed he cannot mirror an arc rush, and EA notes M27 rushers chain moves — so a specialist tackle gets exposed twice in the same rep.' },
      ],
      traps: [],
      archetype: { name: 'Pass Protector', keys: ['PBK', 'PBP', 'PBF'], conf: 'ea' },
      holder: {
        name: 'Jawaan Taylor',
        ovr: 75,
        grade: 'hole',
        line: 'STR 87 · PBK 81 · RBK 70 · AWR 82 · SPD 66',
        verdict: 'A 70 run block next to a 96 is a strange and exploitable seam. Pass protection is survivable with help; the run blocking is not. Backups are 63–69, so there is no fix on the roster — only scheme.',
      },
      breaks:
        'Untouched, he loses you drives. Every good edge rusher you face will find him. The answer is the chip block and the 12-personnel tight end, not a substitution.',
      reads: [
        { when: 'Any edge rusher above ~85 lines up over him', do: 'Chip with the U tight end or the back, every snap, no exceptions. This is the roster\'s standing adjustment.' },
        { when: 'Runs right keep getting stuffed at the line', do: 'It is him, not Lindstrom. Pull Lindstrom instead of asking Taylor to base block, or run left behind Matthews.' },
      ],
    },

    // ────────────────────────────── DEFENSE ──────────────────────────────
    {
      id: 'def.ledg',
      side: 'defense',
      pos: 'LEDG',
      slot: 'EDGE (weak)',
      name: 'Speed rusher — get up the field',
      personnel: 'Nickel base',
      job: 'Beat the tackle with quickness and force the quarterback off his spot. He is not a coverage player and he is not an edge-setter — he is a one-way pressure specialist and you should use him that way.',
      ratings: [
        { key: 'FMV', tier: 'core', conf: 'm26', why: 'Whichever of FMV/PMV is already higher is the one to lean on — the long-standing guidance is that they do not stack, so a specialist rushes with one move. An M26 datamine (self-labelled a working theory) modelled a finesse win as roughly 70% FMV / 20% weight / 10% STR.' },
        { key: 'ACC', tier: 'core', conf: 'm26', why: 'Get-off is acceleration, not top speed. The first two steps decide the rep.' },
        { key: 'BSH', tier: 'support', conf: 'm26', why: 'Same datamine put the defensive shed at roughly 50% BSH / 30% Play Recognition / 15% STR / 5% weight. Note the 30% — see the trap below.' },
      ],
      traps: [
        { key: 'PRC', conf: 'm26', why: 'INVERTED TRAP — Play Recognition is NOT dead weight on the defensive line. The M26 shed model puts it at 30%, far higher than folklore admits. The common "PRC is CPU-only" line could not be verified for the D-line.' },
      ],
      archetype: { name: 'Speed Rusher', keys: ['FMV', 'TAK', 'PUR'], conf: 'ea' },
      holder: {
        name: 'James Pearce Jr.',
        ovr: 79,
        grade: 'fit',
        line: 'SPD 90 · ACC 92 · FMV 81 · PMV 71 · BSH 70 · MCV 40 · ZCV 50 · AWR 85',
        verdict: 'A pure finesse rusher: 81 FMV against 71 PMV is a clear specialist, so rush him with the swim/rip and never bull. The 40 man coverage and 50 zone coverage are the numbers that kill the 3-4 idea — if a play asks him to drop into curl-flat, you have given up that zone.',
      },
      backup: {
        name: 'Jalon Walker',
        ovr: 79,
        line: 'SPD 86 · ACC 92 · FMV 79 · PMV 70 · BSH 76 · MCV 36 · ZCV 48',
        verdict: 'Nearly the same player with slightly better shed. Note: in real life he tore an ACL in camp and is out for 2026 — the launch roster does not know that, so he is available in-game.',
      },
      breaks:
        'Ask him to drop and you have a 40-MCV body in space. Ask him to two-gap and 70 block shedding gets him washed out of the run fit. He rushes. That is the whole job.',
      reads: [
        { when: 'The tackle is beating him cleanly every rep', do: 'Stop rushing four. Bring pressure, or slide him inside on a stunt where he faces a guard instead.' },
        { when: 'The offense is chip blocking him with a back', do: 'It is working and you are down a rusher. Run a twist so the chip lands on nobody.' },
        { when: 'The play call drops him into coverage', do: 'Manually user-blitz him or change the call. 40 MCV in a zone is a first down waiting to happen.' },
      ],
    },
    {
      id: 'def.redg',
      side: 'defense',
      pos: 'REDG',
      slot: 'EDGE (strong)',
      name: 'Edge setter — hold the C gap',
      personnel: 'Nickel base + odd front',
      job: 'Set the edge against the run and squeeze the pocket from the strong side. He is the reason a wide-zone team cannot just run outside at you all day.',
      ratings: [
        { key: 'BSH', tier: 'core', conf: 'm26', why: 'Getting off the tight end\'s block is the run-fit job. 80 BSH is the highest among your edges and it is why he plays the strong side.' },
        { key: 'STR', tier: 'core', conf: 'm26', why: 'Holding the point against a tackle-plus-tight-end double.' },
        { key: 'TAK', tier: 'support', conf: 'm26', why: 'Tackle is the rating that decides whether you connect at all. Hit Power decides the fumble, not the contact.' },
      ],
      traps: [
        { key: 'POW', conf: 'm26', why: 'Hit Power is largely an OVR inflator. The hit stick rolls Tackle for whether you connect and Power only for the fumble/injury chance. Never pick a defender on POW when TAK is the alternative.' },
      ],
      archetype: { name: 'Run Stopper', keys: ['BSH', 'TAK', 'PRC'], conf: 'read' },
      holder: {
        name: 'Samson Ebukam',
        ovr: 76,
        grade: 'stretch',
        line: 'SPD 83 · STR 83 · BSH 80 · FMV 78 · PMV 67 · TAK 82',
        verdict: 'Downgraded fit → stretch on 8/19. He has the best Block Shedding (80) and Strength (83) of any Falcons edge, so he is the right pick — but EA labels him a Smaller Speed Rusher, not a Run Stopper. There is NO Run Stopper edge on this roster; five of six are Smaller Speed Rushers. He is your run-down edge because Pearce cannot be, not because he is good at this.',
      },
      alt: {
        name: 'Jalon Walker',
        ovr: 79,
        line: 'SPD 86 · STR 80 · BSH 76 · TAK 84 · PUR 84 · AGI 85',
        verdict: 'Give back 4 BSH and 3 STR, get +3 OVR, +2 TAK, +2 PUR and +7 AGI. The right answer on early downs is not choosing — play Ebukam AND Walker together and sit Pearce (BSH 70, worst on the roster). Flip it on third and long.',
      },
      breaks:
        'Play two pure speed rushers at once on early downs and you have no edge — outside zone and the toss game will run you out of the building. That is exactly what happens if you chase sacks with the personnel. Note the honest ceiling: Ebukam\'s PMV 67 is the lowest of the six edges, so he costs you a down as a rusher.',
      reads: [
        { when: 'They are running outside zone to his side and gaining', do: 'Set Gap Integrity to Conservative. That makes defenders shed toward their assigned gap instead of anywhere, which trades big wins for fewer explosive runs.' },
        { when: 'It is third and long', do: 'Sub him out for Pearce (FMV 81) and keep Walker. Edge-setting has no value on a passing down.' },
        { when: 'You are in 2-4-5 Over Wide and they run inside zone', do: 'The wide alignment is the problem, not the personnel. Pinch the line manually — RS-left into the D-line menu, then LS-down — or check out of the formation entirely.' },
      ],
    },
    {
      id: 'def.3t',
      side: 'defense',
      pos: 'DT',
      slot: '3-technique',
      name: 'Interior penetrator',
      personnel: 'Nickel base',
      job: 'Get into the backfield through the guard-tackle gap and make the run play die before it starts. On passing downs, collapse the pocket so the quarterback cannot step up away from your edges.',
      ratings: [
        { key: 'PMV', tier: 'core', conf: 'm26', why: 'The interior rush is power. Bull rush the guard and the pocket has nowhere to go.' },
        { key: 'BSH', tier: 'core', conf: 'm26', why: 'The 50% term in the shed model, and the difference between disrupting a run and being erased by it.' },
        { key: 'STR', tier: 'support', conf: 'm26', why: 'Interior is where weight and strength matter most — double-team survival and shed radius.' },
      ],
      traps: [
        { key: 'SPD', conf: 'm26', why: 'Explicitly low-value on the interior. Do not pick a 3-tech for speed; pick him for strength and shed.' },
      ],
      archetype: { name: 'Power Rusher', keys: ['PMV', 'TAK', 'PUR'], conf: 'ea' },
      holder: {
        name: 'Brandon Dorlus',
        ovr: 73,
        grade: 'hole',
        line: 'STR 84 · BSH 79 · PMV 77 · FMV 72 · TAK 79 · SPD 77',
        verdict: 'The best interior rusher on the roster, and he is 73 overall. Adequate, not disruptive. You will not win a game because of your 3-technique this year.',
      },
      breaks:
        'A 73 at 3-tech means the guard wins most reps, which means the pocket never collapses inside, which means the quarterback steps up and away from Pearce. Your entire pass rush is edge-dependent as a result.',
      reads: [
        { when: 'The quarterback keeps stepping up and completing', do: 'Your interior is losing. Bring an A-gap blitz or a linebacker mug instead of expecting four to get there.' },
        { when: 'They are running duo / inside zone repeatedly for 4+', do: 'The interior is getting displaced. Commit a safety to the box or check to a heavier front — this front cannot hold with four.' },
      ],
    },
    {
      id: 'def.1t',
      side: 'defense',
      pos: 'DT',
      slot: '1-technique / nose',
      name: 'Double-team eater',
      personnel: 'Nickel base + odd front',
      job: 'Occupy two blockers so the linebackers stay clean. The job is not to make plays — it is to make sure Deablo gets to make plays.',
      ratings: [
        { key: 'STR', tier: 'core', conf: 'm26', why: 'Survive the double. Weight and strength carry more on the interior than anywhere else on the field.' },
        { key: 'BSH', tier: 'core', conf: 'ea', why: 'EA\'s Nose Tackle archetype is BSH / TAK / PRC, and EA describes the archetype as "often a liability in pass rush" — that is a design statement, not a criticism.' },
        { key: 'PRC', tier: 'support', conf: 'ea', why: 'Third leg of EA\'s nose triad, and the 30% term in the M26 shed model.' },
      ],
      traps: [],
      archetype: { name: 'Nose Tackle', keys: ['BSH', 'TAK', 'PRC'], conf: 'ea' },
      holder: {
        name: 'Da\'Shawn Hand',
        ovr: 74,
        grade: 'hole',
        line: 'STR 88 · BSH 78 · PMV 74 · TAK 84 · SPD 76',
        verdict: 'A rotational veteran being asked to be an anchor. 88 strength is real; 74 overall is not an anchor. He is the best you have, which is the problem.',
      },
      backup: {
        name: 'Maason Smith',
        ovr: 69,
        line: 'STR 83 · BSH 77 · PMV 72 · SPD 72 · AWR 64',
        verdict: 'A 69 OVR with 64 awareness at the most important run-defense job on the field. This is the specific hole that makes a base 3-4 unplayable.',
      },
      breaks:
        'This is THE roster hole and the reason the doctrine changed. Atlanta lost Onyemata, Orhorhoro, and Street, and there is not a single DT above 74 to replace them. Without a nose who eats doubles, your linebackers get climbed to on every inside run — and your linebacker room is thin behind Deablo.',
      reads: [
        { when: 'They keep running inside zone and your MIKE is being blocked', do: 'The nose is not eating the double. Slant the line, or bring Watts down as an eighth defender.' },
        { when: 'You are in base 3-4 personnel', do: 'Get out of it. This is the exact alignment where a 69-OVR nose is exposed. Nickel is your base for a reason.' },
      ],
    },
    {
      id: 'def.mike',
      side: 'defense',
      pos: 'MIKE',
      slot: 'MIKE',
      name: 'Coverage-capable run fitter',
      personnel: 'Nickel base — every snap',
      job: 'Fill the inside run gap, then carry the tight end or the back in coverage. In a nickel base with only two off-ball linebackers, he does not get to specialize.',
      ratings: [
        { key: 'TAK', tier: 'core', conf: 'm26', why: 'Tackle is the rating that stops missed tackles. It decides whether you connect; Hit Power only decides what happens after you do.' },
        { key: 'ZCV', tier: 'core', conf: 'm26', why: 'One community threshold exists — 90+ Zone Coverage for better reaction time, "helps a little on All-Pro, helps a ton on All-Madden." It is directly contested in the same thread by a user reporting mid-80s ZCV producing more picks. Treat as unsettled.' },
        { key: 'MCV', tier: 'support', conf: 'm27', why: 'Match coverage converts zone responsibility into man responsibility. In Cover 3 Match your MIKE\'s Man Coverage goes live whether you planned for it or not.' },
      ],
      traps: [
        { key: 'POW', conf: 'm26', why: 'Same trap as the edge — Hit Power is fumble and injury only. Deablo\'s 89 POW looks great and does not help him make the tackle.' },
        { key: 'PUR', conf: 'm26', why: 'Pursuit and Play Recognition are effectively CPU-only for the linebacker you personally control. Also worth knowing: Madden\'s own "Field General" archetype label claims PRC/PUR/TAK, but lab testing found the actual top gainers were ZCV/AWR/TAK. The labels lie.' },
      ],
      archetype: { name: 'Pass Coverage', keys: ['ZCV', 'MCV', 'TAK'], conf: 'ea' },
      holder: {
        name: 'Divine Deablo',
        ovr: 81,
        grade: 'fit',
        line: 'SPD 88 · ZCV 78 · MCV 72 · POW 89 · TAK 87 · BSH 67 · PRC 81',
        verdict: 'A converted safety, which is exactly right for a nickel base. 88 speed and 78 zone coverage make him playable in space; 67 block shedding means he cannot take on a guard. Keep him clean and he is good. Let him get blocked and he disappears.',
      },
      backup: {
        name: 'Christian Harris',
        ovr: 72,
        line: 'SPD 89 · ACC 93 · POW 86 · MCV 65 · ZCV 65 · AWR 72',
        verdict: 'Fast, cannot cover. 65/65 is the tell — he is a run-down body only.',
      },
      breaks:
        'With 67 block shedding, the failure mode is not missing tackles — it is never arriving. If your nose does not occupy the double, Deablo gets climbed to and the run hits the second level clean.',
      reads: [
        { when: 'Tight end seams are open all game', do: 'This is your structural weakness — Deablo at 78 ZCV is the ONLY linebacker who can cover, and Andersen is 58. Get a safety over the seam or play more two-high.' },
        { when: 'A back is beating him on a wheel route', do: 'Match coverage just made it a man rep at 72 MCV. Change the call or user him yourself.' },
      ],
    },
    {
      id: 'def.will',
      side: 'defense',
      pos: 'WILL',
      slot: 'WILL',
      name: 'Run-and-chase linebacker',
      personnel: 'Nickel base — early downs',
      job: 'Flow to the ball on run downs. He is a two-down player on this roster and the personnel should reflect that.',
      ratings: [
        { key: 'SPD', tier: 'core', conf: 'm26', why: 'Chasing outside zone from the backside is the job. Speed is what makes this role work at all.' },
        { key: 'TAK', tier: 'core', conf: 'm26', why: 'Arriving is worth nothing if you do not finish, and Tackle is the rating that decides whether you connect at all. A fast linebacker who misses is worse than a slow one who does not, because he has already vacated his gap to get there.' },
        { key: 'ZCV', tier: 'support', conf: 'm26', why: 'The number that tells you when to take him off the field. Under 65 means you are giving up the flat.' },
      ],
      traps: [
        { key: 'POW', conf: 'm26', why: 'Andersen\'s 84 and Harris\'s 86 Hit Power are OVR, not production.' },
      ],
      archetype: { name: 'Run Stopper', keys: ['POW', 'PUR', 'TAK'], conf: 'ea' },
      holder: {
        name: 'Christian Harris',
        ovr: 72,
        grade: 'fit',
        line: 'SPD 89 · ACC 93 · PUR 84 · TAK 78 · MCV 65 · ZCV 65',
        verdict: 'Corrected 8/19: Harris starts here, not Andersen. He is the only Falcons linebacker EA actually labels Run Stopper, and PUR 84 is the highest pursuit number in the room — the chase-down player this job describes.',
      },
      alt: {
        name: 'Troy Andersen',
        ovr: 70,
        line: 'SPD 90 · ACC 93 · POW 84 · TAK 81 · MCV 54 · ZCV 58',
        verdict: 'Was the listed starter through 8/14 and should not have been. He gives back 11 points of Man Coverage and 7 of Zone against Harris, for 3 points of Tackle and 1 of Speed. 54 MCV is the single worst coverage number that can be on your field.',
      },
      breaks:
        'Start Andersen here and the offense will find him. His 54/58 coverage is a free first down to any competent passing game — a TE seam or a back on a wheel is uncontested. Harris at 65/65 is not good coverage either, but it is the difference between a hole and a soft spot.',
      reads: [
        { when: 'They go to 11 personnel on 3rd and 6+', do: 'Sub the second linebacker out entirely for a sixth defensive back. This is a dime situation, not a linebacker situation, regardless of which of the two is on the field.' },
        { when: 'They are running outside zone away from him', do: 'His speed is the answer — set Defender Aggression to Aggressive so he plays downhill, and accept the play-action risk.' },
        { when: 'You are blitzing an off-ball linebacker', do: 'Send Harris. PUR 84 on 89 speed is your best free runner, and the 2-4-5 Over Wide WILL BLITZ 3 call is built for exactly this.' },
      ],
    },
    {
      id: 'def.cb1',
      side: 'defense',
      pos: 'CB',
      slot: 'CB1',
      name: 'Press-man island corner',
      personnel: 'Nickel base — travels with WR1',
      job: 'Take away the opponent\'s best receiver with no help. In Madden 27 this role changed more than any other, because EA built a new system specifically to make it work.',
      ratings: [
        { key: 'PRS', tier: 'core', conf: 'ea', why: 'Press appears in three of EA\'s six defensive-back archetypes — including the ZONE corner. It is not a man-only stat this year. M27 press is route-aware and leverage is a user input on both sides.' },
        { key: 'MCV', tier: 'core', conf: 'ea', why: 'First attribute in EA\'s Man CB archetype triad. EA is explicit that ratings, not leverage guessing, decide the rep.' },
        { key: 'JMP', tier: 'support', conf: 'ea', why: 'Genuinely surprising, but it is EA\'s own third key attribute for the Man CB archetype. Cannot be called a trap when EA names it.' },
      ],
      traps: [
        { key: 'SPD', conf: 'ea', why: 'THE headline change. Speed and Acceleration appear in ZERO of EA\'s six defensive-back archetype triads. And M27\'s new Jostle system is the one place EA states an intent to compress speed: a defender with great coverage ratings "should have a chance to stay connected, get hands on the receiver, disrupt timing, and somewhat neutralize speed through technique." Do not cut a corner for being 88 speed this year. Also: every "90+ speed or you get burned" number circulating online traces to AI content farms with no source.' },
      ],
      archetype: { name: 'Man CB', keys: ['MCV', 'PRS', 'JMP'], conf: 'ea' },
      holder: {
        name: 'A.J. Terrell Jr.',
        ovr: 88,
        grade: 'fit',
        line: 'PRS 95 · ZCV 91 · MCV 87 · SPD 91 · ACC 91 · AGI 89 · AWR 91 · PRC 92 · TAK 63',
        verdict: 'Ideal for this year\'s system — 95 press is the highest-leverage number on your defense given the jostle rework, and 91/87 coverage means he plays either scheme. Superstar abilities: Inside Shade, Deep Route KO, Deep Out Zone KO. 63 tackle means he is not your run-support corner.',
      },
      breaks:
        'A corner who cannot press in Madden 27 gives up the release for free, and the route is won at the line before coverage ever matters. Terrell at 95 press is the one piece of this defense that is genuinely above the meta.',
      reads: [
        { when: 'Their best receiver is running slants and digs', do: 'Inside Shade is exactly this ability — set inside leverage and let 95 press take the inside-breaking route away.' },
        { when: 'They are motioning to get their WR1 away from him', do: 'They are telling you they respect him. Follow with the matchup, or take the free read — whoever they moved him to is the guy they want.' },
        { when: 'You keep getting beat deep outside', do: 'That is the leverage cost of inside shade. Change to outside leverage or roll a safety over the top.' },
      ],
    },
    {
      id: 'def.cb2',
      side: 'defense',
      pos: 'CB',
      slot: 'CB2',
      name: 'Zone / off corner',
      personnel: 'Nickel base',
      job: 'Play the deep third or the flat with vision on the quarterback. He does not have to erase anybody — he has to be in the right place and not get beaten over the top.',
      ratings: [
        { key: 'ZCV', tier: 'core', conf: 'ea', why: 'First attribute of EA\'s Zone CB archetype triad, and the whole job — playing the deep third with eyes on the quarterback rather than on the receiver.' },
        { key: 'PRC', tier: 'core', conf: 'ea', why: 'Third attribute of the same triad. Play Recognition appears in five of EA\'s six defensive-back archetypes — it is the most universal DB rating in the game and folklore badly underrates it.' },
        { key: 'PRS', tier: 'support', conf: 'ea', why: 'Yes, in the ZONE archetype. EA includes Press in the zone triad, which means press is a general corner skill in M27, not a man specialty.' },
      ],
      traps: [
        { key: 'AWR', conf: 'ea', why: 'Awareness appears in zero of EA\'s six defensive-back triads. Neither does Catching. Do not pick a corner for either.' },
      ],
      archetype: { name: 'Zone CB', keys: ['ZCV', 'PRS', 'PRC'], conf: 'ea' },
      holder: {
        name: 'Mike Hughes',
        ovr: 75,
        grade: 'fit',
        line: 'SPD 88 · AGI 90 · PRS 82 · ZCV 78 · MCV 73',
        verdict: 'The right profile for the job — 82 press and 78 zone with the zone number ahead of the man number. Play him in zone and he is fine; ask him to travel in man and he is not Terrell.',
      },
      backup: {
        name: 'Clark Phillips III',
        ovr: 75,
        line: 'SPD 89 · ACC 94 · COD 90 · MCV 78 · ZCV 74 · TAK 55',
        verdict: 'The inverse profile — better man than zone, and 94 acceleration. 55 tackle is a real liability in the run game. Use him when you want man on both sides.',
      },
      breaks:
        'A zone corner who cannot recognize the route concept bites on the double move. That is a PRC failure, not a speed failure, and it is why PRC belongs above SPD in your evaluation order.',
      reads: [
        { when: 'They are attacking the flat outside him', do: 'Use the new CB Depth and CB Width pre-snap sliders. Bring him up and in rather than changing the call.' },
        { when: 'A double move beat him', do: 'That is recognition. Give him a safety over the top rather than expecting him to fix it himself.' },
      ],
    },
    {
      id: 'def.nickel',
      side: 'defense',
      pos: 'CB',
      slot: 'Nickel',
      name: 'Slot defender — the third linebacker',
      personnel: 'Nickel base — on the field ~70% of snaps',
      job: 'Cover the slot, blitz off the edge, and shed blocks in run support. In your actual base defense this is a starting job, not a sub package, and it is where the roster\'s speed advantage lives.',
      ratings: [
        { key: 'MCV', tier: 'core', conf: 'ea', why: 'First attribute of EA\'s Slot CB archetype triad. The slot works in a two-way go with no sideline to help him, so man skill matters more here than it does outside.' },
        { key: 'PRC', tier: 'core', conf: 'ea', why: 'Second attribute — the slot sees more route combinations than anyone.' },
        { key: 'TAK', tier: 'core', conf: 'ea', why: 'Third attribute, and note it is TACKLE, not Hit Power. EA describes the slot corner as "responsible for shedding blocks to help in run defense as well as covering."' },
      ],
      traps: [
        { key: 'POW', conf: 'ea', why: 'EA put Tackle in the slot triad and Hit Power in the safety Run Support triad. The distinction is deliberate — the slot has to make the tackle, not blow anyone up.' },
      ],
      archetype: { name: 'Slot CB', keys: ['MCV', 'PRC', 'TAK'], conf: 'ea' },
      holder: {
        name: 'Billy Bowman Jr.',
        ovr: 73,
        grade: 'stretch',
        line: 'SPD 92 · ACC 92 · AGI 89 · ZCV 76 · MCV 71 · AWR 70',
        verdict: 'Talented and green. 92 speed is a real asset in the slot; 71 man coverage and 70 awareness means he is beaten by good route running. Still better than putting a 58-ZCV linebacker out there.',
      },
      backup: {
        name: 'Avieon Terrell (R)',
        ovr: 75,
        line: 'SPD 88 · ACC 91 · AGI 91 · MCV 70 · ZCV 73 · PRS 70 · AWR 77',
        verdict: 'Higher overall, better awareness, less top speed. The steadier of the two — play him against a possession slot, play Bowman against a burner.',
      },
      breaks:
        'The alternative to this role is a third linebacker, and your third linebacker is 58 zone coverage. That is the whole argument for nickel as base on this roster. Getting the slot wrong means you are choosing between a green corner and an unplayable linebacker.',
      reads: [
        { when: 'They come out in 11 personnel', do: 'He is on the field. Do not check to base — that puts Andersen in coverage.' },
        { when: 'They are running at him with a tight end lead', do: 'This is the run-support cost. Bring Watts down as an extra body rather than replacing him.' },
        { when: 'Their slot is winning on option routes', do: '70 awareness is being exploited. Bracket with the safety or put Phillips in the slot instead.' },
      ],
    },
    {
      id: 'def.fs',
      side: 'defense',
      pos: 'FS',
      slot: 'FS',
      name: 'Single-high backstop / robber',
      personnel: 'Nickel base — every snap',
      job: 'Play the deep middle in Cover 1 and Cover 3, or rob the intermediate window. He is the best player on your defense, so the coverage should be built to put him where the ball is going.',
      ratings: [
        { key: 'ZCV', tier: 'core', conf: 'ea', why: 'First attribute of EA\'s Zone Safety archetype triad. Everything behind the coverage is his, so the zone number is the position.' },
        { key: 'PRC', tier: 'core', conf: 'ea', why: 'Second attribute. The deep safety has to diagnose before he moves — a step late from the middle of the field is a touchdown.' },
        { key: 'PUR', tier: 'support', conf: 'ea', why: 'Third attribute of the triad. EA calls this role "the backstop of the defense."' },
      ],
      traps: [
        { key: 'SPD', conf: 'ea', why: 'Again: zero of EA\'s six DB triads include Speed or Acceleration. Range at safety is recognition plus angles far more than it is top speed.' },
      ],
      archetype: { name: 'Zone Safety', keys: ['ZCV', 'PRC', 'PUR'], conf: 'ea' },
      holder: {
        name: 'Jessie Bates III',
        ovr: 94,
        grade: 'fit',
        line: 'ZCV 93 · MCV 85 · PRC 95 · AWR 96 · PUR 93 · SPD 90 · POW 85 · TAK 81 · PRS 66',
        verdict: 'The best defender on the roster and a perfect match for the archetype — 93 zone, 95 recognition, 93 pursuit is EA\'s exact triad, maxed. X-Factor "Shutdown" tightens coverage and adds interceptions on contested catches while in the zone. Superstars: Deep In Zone KO and Lurker. Lurker plus 95 PRC in a robber look is genuinely punishing.',
      },
      breaks:
        'Waste him in a two-deep shell where he never sees the ball and you have benched your best player. The whole point of a 95-PRC safety is putting him where he can diagnose and jump a route.',
      reads: [
        { when: 'The offense keeps working the intermediate middle', do: 'This is the Lurker window. Play him as a robber in Cover 1 and let 95 recognition eat.' },
        { when: 'Bates is Hot (X-Factor active)', do: 'New in M27 — X-Factors only activate when a player is HOT, and shut off when he goes Cold. Get him a play early (a hit, a PBU) to switch Shutdown on, and be aware that a bad play turns it off.' },
        { when: 'They are attacking deep outside on both sides', do: 'Single-high is the wrong shell. Go two-high and accept the lighter box — you do not have the corners to leave both alone.' },
      ],
    },
    {
      id: 'def.ss',
      side: 'defense',
      pos: 'SS',
      slot: 'SS',
      name: 'Box / hybrid safety',
      personnel: 'Nickel base — the eighth defender',
      job: 'Fill the run gap your missing nose tackle creates, cover the tight end, and be the flexible piece that lets a five-DB defense still stop the run.',
      ratings: [
        { key: 'PRC', tier: 'core', conf: 'ea', why: 'In EA\'s Run Support Safety triad and in the Hybrid triad. Recognition is what lets him trigger downhill without being wrong.' },
        { key: 'TAK', tier: 'core', conf: 'ea', why: 'Third attribute of the Run Support triad — he is a tackler in the box, not a hitter.' },
        { key: 'ZCV', tier: 'support', conf: 'ea', why: 'Enough coverage to not be a liability when he drops. Watts at 81 clears this.' },
      ],
      traps: [
        { key: 'POW', conf: 'ea', why: 'The one place Hit Power is legitimately an EA key attribute — the Run Support Safety triad. Even here, Tackle decides the connection and Power only decides the fumble.' },
      ],
      archetype: { name: 'Run Support / Hybrid', keys: ['PRC', 'POW', 'TAK'], conf: 'ea' },
      holder: {
        name: 'Xavier Watts',
        ovr: 79,
        grade: 'fit',
        line: 'SPD 86 · ZCV 81 · MCV 72 · AWR 81 · PRC 78 · POW 78',
        verdict: 'Solid and versatile. 81 zone coverage means he can play deep in a two-high shell, which is what makes the Bates/Watts pairing work — you can rotate either one down without telling the offense which.',
      },
      breaks:
        'This roster has no nose tackle, which means the eighth defender in the box is not optional against a good run team. If he cannot fill, inside zone runs forever.',
      reads: [
        { when: 'They have gained 4+ on three straight inside runs', do: 'Bring him down. You do not have the front to hold with seven — trade the coverage risk for the run fit.' },
        { when: 'You brought him down and got hit with play action', do: 'Set Defender Aggression to Conservative so defenders slow-play and stay ready for the fake. Aggressive bites harder on play action.' },
        { when: 'The tight end is the problem', do: 'Put him on the tight end in man. 72 MCV is better than any linebacker you own.' },
      ],
    },
  ],

  // ── The depth-chart procedure. Kenny's ask: "I need process for filling
  //    out rosters and depth charts." Order matters — each step's answer
  //    constrains the next.
  buildOrder: [
    {
      step: 1,
      title: 'Fix the position labels first',
      do: 'Confirm every defensive body is filed under a Madden 27 position: LEDG, REDG, DT, SAM, MIKE, WILL. There is no LE, RE, LOLB, MLB, or ROLB in this game.',
      why: 'EA merged DE and OLB into EDGE so you no longer have to swap positions when you change fronts. Any depth-chart habit built on the old labels silently puts the wrong body on the field.',
      conf: 'ea',
    },
    {
      step: 2,
      title: 'Name your base personnel before you touch a single slot',
      do: 'Decide the grouping you will actually be in on most snaps. For this roster: 11 personnel on offense, nickel (4-2-5) on defense.',
      why: 'A depth chart sorted for a defense you rarely play is worse than no depth chart. Ulbrich ran nickel on 70% of snaps — so the "starting" defense is five defensive backs, and the third linebacker slot is a sub package, not a starting job.',
      conf: 'm27',
    },
    {
      step: 3,
      title: 'Sort each position by the ratings for the ROLE, never by OVR',
      do: 'For every slot, write down the two or three ratings that role needs, then sort the room on those. Overall is a weighted average designed to sell cards, not to fill a job.',
      why: 'The clearest example on this roster: Clark Phillips and Mike Hughes are both 75 OVR, and they are not interchangeable — Hughes is 82 press / 78 zone, Phillips is 78 man / 74 zone with 55 tackle. Same OVR, opposite jobs.',
      conf: 'read',
    },
    {
      step: 4,
      title: 'Place the specialists before the starters',
      do: 'Fill the nose tackle, the slot corner, the chip-blocking tight end, and the third-down back FIRST. Then fill the obvious starters around them.',
      why: 'Specialist roles have narrow requirements, so they have few candidates. Fill them last and you find your only qualifying body is already locked into a spot where anyone would do.',
      conf: 'read',
    },
    {
      step: 5,
      title: 'Name the hole out loud',
      do: 'Write down the one role you cannot fill. Here it is interior defensive line — no DT above 74 OVR, after losing Onyemata, Orhorhoro, and Street.',
      why: 'An unnamed hole becomes an in-game surprise. A named hole becomes a scheme decision: you already know you will be adding an eighth defender against a good run team, so you plan for it instead of discovering it down 14.',
      conf: 'm27',
    },
    {
      step: 6,
      title: 'Set the sub packages, then verify them in practice',
      do: 'Define who comes off the field on 3rd and long (Andersen, Ebukam) and who comes on (Phillips or Avieon Terrell, a second finesse rusher). Then run the situation in practice and confirm the right bodies actually appear.',
      why: 'Depth chart order and package personnel are not the same thing, and the difference only shows up on the snap that matters.',
      conf: 'read',
    },
    {
      step: 7,
      title: 'Check your abilities, then check who is Hot',
      do: 'You have exactly five players with any ability: Bijan (X: First One Free), Bates (X: Shutdown), London, A.J. Terrell, Lindstrom. Know all five cold.',
      why: 'New in Madden 27: X-Factors only fire when the player is HOT, and shut off when he goes Cold. An ability-dependent player is now conditional; a raw-ratings player is not. Get Bijan and Bates an early touch or an early play.',
      conf: 'ea',
    },
  ],

  // ── Between-play adjustments. Kenny's stated gap: "I should be making
  //    adjustments even in between plays." Each entry is a TELL you can see
  //    and a FIX you can execute before the next snap.
  inGame: [
    {
      id: 'ig.shell',
      phase: 'Pre-snap read',
      side: 'offense',
      tell: 'Both safeties deeper than ~12 yards and static',
      fix: 'Two-high. The box is light and the middle is open — hand it to Bijan or throw the seam to Pitts. The answer to two-high is a run, not a better throw.',
      conf: 'read',
    },
    {
      id: 'ig.single',
      phase: 'Pre-snap read',
      side: 'offense',
      tell: 'One safety in the middle, corners pressed',
      fix: 'Cover 1 or Cover 0. Tua is at his best here because the read is defined. Take the London iso or get out on the boot away from the pressure.',
      conf: 'read',
    },
    {
      id: 'ig.motion',
      phase: 'Pre-snap read',
      side: 'offense',
      tell: 'You motion the Z and a defender travels with him',
      fix: 'Man. Call mesh, drag, or a wheel — anything that runs defenders into each other. If nobody travels, it is zone: stop trying to beat a man and go sit in the hole.',
      conf: 'read',
    },
    {
      id: 'ig.chip',
      phase: 'Between plays',
      side: 'offense',
      tell: 'The same edge rusher has won two reps in a row',
      fix: 'Assign a Chip Block to the back or the U tight end on that side. New in Madden 27 and framed by EA as the direct counter to an elite edge rusher — it either knocks him off his path or distorts his route.',
      conf: 'ea',
    },
    {
      id: 'ig.sneak',
      phase: 'Pre-snap read',
      side: 'offense',
      tell: 'The Sneak Meter shows you losing the push',
      fix: 'Do not run it. The meter weighs Center/Guard/QB strength and weight against the defenders\' shed strength BEFORE the snap, and losing it shrinks your timing window. That indicator exists so you can check out.',
      conf: 'ea',
    },
    {
      id: 'ig.tbc',
      phase: 'Between plays',
      side: 'offense',
      tell: 'You are missing green windows on contested throws',
      fix: 'Two levers. First, throw to the receiver whose CIT/SPC actually buys you a wide green window — London (94/95), not Dotson (83/83) and never Brian Robinson (43 CIT). Second, check your TBC Minimum Throw Distance setting: throws shorter than that bypass timing entirely. Huddle.gg and Civil.GG both recommend 5 yards on offense.',
      conf: 'm27',
    },
    {
      id: 'ig.gap',
      phase: 'Between plays',
      side: 'defense',
      tell: 'They are gashing you on outside zone',
      fix: 'Set Gap Integrity to Conservative — defenders shed toward their assigned gap instead of any direction. You give up some big wins and you stop giving up explosive runs. The competitive default from Huddle.gg is Aggression Aggressive with Gap Integrity Conservative.',
      conf: 'm27',
    },
    {
      id: 'ig.pa',
      phase: 'Between plays',
      side: 'defense',
      tell: 'Play action keeps holding your linebackers',
      fix: 'Set Defender Aggression to Conservative so defenders slow-play and stay ready for the fake. Aggressive gets you downhill faster but bites harder on play action, draws more penalties, and tires your defense.',
      conf: 'm27',
    },
    {
      id: 'ig.inside',
      phase: 'Between plays',
      side: 'defense',
      tell: 'Three straight inside runs of 4+ yards',
      fix: 'Your nose is not eating the double — with no DT above 74 this will happen. Bring Watts down as the eighth defender. Do NOT check to base 3-4 personnel; that puts a 69-OVR nose on the field, which is the exact opposite of the fix.',
      conf: 'read',
    },
    {
      id: 'ig.seam',
      phase: 'Between plays',
      side: 'defense',
      tell: 'The tight end seam is open every snap',
      fix: 'This is the structural weakness — Deablo (78 ZCV) is your only linebacker who can cover and Andersen is 58. Either get a safety over the seam or play two-high. You cannot fix this with a linebacker on the roster.',
      conf: 'read',
    },
    {
      id: 'ig.press',
      phase: 'Pre-snap read',
      side: 'defense',
      tell: 'Their WR1 is winning inside-breaking routes',
      fix: 'Set inside leverage on Terrell and use Inside Shade. M27 press is route-aware — the defender now knows a slant wants to win inside. But EA caps this: leverage does not erase a talent gap, and Terrell\'s 95 press is what makes it work.',
      conf: 'ea',
    },
    {
      id: 'ig.depth',
      phase: 'Pre-snap read',
      side: 'defense',
      tell: 'They are living in the flat outside your corner',
      fix: 'Use the new CB Depth and CB Width pre-snap sliders. Bring him up and in. This is a knob, not a play call — you can fix it without burning a timeout or tipping the coverage.',
      conf: 'm27',
    },
    {
      id: 'ig.hot',
      phase: 'By drive',
      side: 'defense',
      tell: 'Bates has not made a play yet',
      fix: 'His X-Factor is off. Madden 27 requires a player to be HOT before an X-Factor activates, and it shuts off when he goes Cold. Get him involved early — a robber look where 95 recognition can produce a PBU is the cheapest way to switch Shutdown on.',
      conf: 'ea',
    },
    {
      id: 'ig.scramble',
      phase: 'By drive',
      side: 'defense',
      tell: 'They are scrambling out of the pocket and throwing',
      fix: 'M27\'s new Plaster logic is supposed to handle this — backside zone defenders abandon their zones and attach to the nearest receiver when the QB leaves the pocket. If it is still killing you, the problem is your rush lane discipline, not your coverage. Keep Ebukam on the edge rather than chasing sacks with two finesse rushers.',
      conf: 'ea',
    },
  ],
};
