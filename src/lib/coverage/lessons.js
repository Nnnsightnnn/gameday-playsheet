// built by nnnsightnnn — signal from noise
// Coverage Lab — the Learn track.
//
// A curriculum of small lessons, each one teaching exactly ONE idea. Every
// lesson pins the lab to a specific snap (coverage / formation / concept), says
// what to watch when you hit Snap, then checks the idea with a short quiz.
// Misses get re-drilled from the nav until they are cleared.
//
// Content rules: every claim here must agree with the engine. Route release
// buckets come from routes.js (`corner` counts as VERT — the Palms trap fires
// on OUT breaks like speed outs and flats, never on corner routes), and the
// match trigger fires at TRIGGER_T into the snap.

export const MODULES = [
  /* ════════════ MODULE 1 — MATCH FOUNDATIONS ════════════ */
  {
    id: 'foundations',
    name: 'Match Foundations',
    tagline: 'The vocabulary. Zone, man, match — and the trigger that separates them.',
    lessons: [
      {
        id: 'zone-man-match',
        title: 'Three answers to one route',
        setup: { view: 'compare', coverage: 'c3sky', compareWith: 'c3match', formation: 'doubles', concept: 'verts' },
        why: 'Everything in this track builds on one distinction: spot-drop, man, and match are three different answers to the same picture.',
        teach: [
          'A SPOT-DROP zone defender runs to a landmark and reads the QB. He does not care what routes are run. That is Cover 3 Sky on the left.',
          'A MAN defender has a body. He does not care where the grass is.',
          'A MATCH defender starts with zone eyes, then CONVERTS to man when the route declares vertical. Zone until threatened, man after. That is Cover 3 Match on the right.',
          'Four Verticals is the stress test. Spot-drop Cover 3 has three deep defenders for four vertical routes — the free safety is stuck between two seams. Match fixes it by having the seam players carry #2 man.',
        ],
        watch: 'Hit Snap. On the Sky side the overhang defenders sink to landmarks and both seams split the FS. On the Match side the SS locks onto #2 and runs with him.',
        quiz: [
          {
            q: 'Cover 3 Sky against 4 Verticals — who is in conflict?',
            options: [
              'The corners, who cannot carry a go route',
              'The free safety — two seams, one middle-of-field player',
              'The Mike, who has no depth',
            ],
            answer: 1,
            explain: 'Three deep defenders vs four vertical routes. The two seams bracket the lone FS — that structural math is the entire reason match coverage exists.',
          },
          {
            q: 'What makes a coverage "match" instead of zone or man?',
            options: [
              'Defenders play zone until routes declare, then convert to man on verticals',
              'Defenders switch receivers whenever routes cross',
              'It is man coverage with a deep safety added',
            ],
            answer: 0,
            explain: 'Zone eyes pre-declaration, man conversion after. "Zone until threatened" is the one-line definition worth memorizing.',
          },
        ],
      },
      {
        id: 'the-trigger',
        title: 'The trigger — when rules fire',
        setup: { view: 'study', coverage: 'c3match', formation: 'doubles', concept: 'curlflat' },
        why: 'Match rules do nothing at the snap. They fire when the route DECLARES — and everything before that moment is ordinary zone.',
        teach: [
          'Watch the phase label under the scrubber: "Stems — rules have not triggered yet" then "TRIGGER — match rules firing". That gap is real football time, about the first 10–12 yards of a stem.',
          'Here #1 runs a curl — he never declares vertical, so the MOD corner NEVER converts. He stays zone, sinks, and robs the curl from on top.',
          '#2 breaks flat — not vertical either, so the seam player makes his SEAM-HOOK CONVERSION: pass him off, re-read the next threat.',
          'This is also match coverage\'s weakness: quick game gets the ball out BEFORE anything triggers. The rules never fire, and you were just playing loose zone. That is why the Zone It check exists in CFB 27.',
        ],
        watch: 'Scrub slowly through the first third of the snap. Nobody converts to man on this play — every rule resolves to zone because nothing goes vertical.',
        quiz: [
          {
            q: '#1 runs a 10-yard curl against a MOD corner. What does the corner do?',
            options: [
              'Locks him man once he stems past 8 yards',
              'Stays zone — sinks and robs the curl from on top',
              'Passes him off and jumps #2',
            ],
            answer: 1,
            explain: 'MOD = Man On Deep. The curl never declares vertical, so the trigger never fires and the corner plays it like a zone defender.',
          },
          {
            q: 'Why does quick game beat match coverage?',
            options: [
              'The defenders align too deep to contest it',
              'Match defenders are watching receivers, not the QB',
              'The ball is out before routes declare, so the rules never trigger',
            ],
            answer: 2,
            explain: 'Match rules key on route declaration. Hitches, slants, and now-screens end the play inside the trigger window — you get the worst of both worlds.',
          },
        ],
      },
      {
        id: 'meg-vs-mod',
        title: 'MEG vs MOD',
        setup: { view: 'study', coverage: 'solo', formation: 'pro', concept: 'curlflat' },
        why: 'Two letters that change everything a corner does. MOD has a depth trigger. MEG does not.',
        teach: [
          'MOD — Man On Deep. The corner is zone against anything short, man against anything vertical. That is the Rip/Liz corner from the last lesson.',
          'MEG — Man Everywhere he Goes. No depth trigger, no conversion, no zone phase. He is locked from the snap regardless of route.',
          'This snap is Cover 4 Solo against an iso X. Look at the backside corner: X runs a CURL, and the MEG corner stays glued to it — the exact route a MOD corner would zone off and rob.',
          'In CFB 27 terms: the Skinny Meg check is what turns a match-side corner into a MEG corner. You buy glue on one receiver and pay for it in run support and rub vulnerability.',
        ],
        watch: 'The backside CB. A curl is a "short" route — but MEG doesn\'t care. Compare in your head to the MOD corner from the previous lesson.',
        quiz: [
          {
            q: 'A MOD corner zones off a curl. What does a MEG corner do against the same curl?',
            options: [
              'Also zones off — every match corner has a depth trigger',
              'Stays man on it — Man Everywhere he Goes has no trigger',
              'Traps it and lets the safety cap #1',
            ],
            answer: 1,
            explain: 'That is the whole distinction. MEG is true man; MOD is conditional man. Same alignment, different contract.',
          },
          {
            q: 'In CFB 27, which check turns the backside corner into a true MEG player in Cover 3 Match?',
            options: ['Zone It', 'Skate', 'Skinny Meg'],
            answer: 2,
            explain: 'Skinny governs the seam player; the Meg tag adds the backside corner playing pure man with no depth trigger.',
          },
        ],
      },
    ],
  },

  /* ════════════ MODULE 2 — THE QUARTERS FAMILY ════════════ */
  {
    id: 'quarters',
    name: 'Quarters Family',
    tagline: 'Where match principles live. One shell, four different sets of rules.',
    lessons: [
      {
        id: 'c4-safety-read',
        title: 'Quarters: the safety reads #2',
        setup: { view: 'study', coverage: 'c4', formation: 'doubles', concept: 'verts' },
        why: 'Base Quarters in one sentence: the corner always has #1, and the SAFETY\'S EYES ARE ON #2.',
        teach: [
          'The corner\'s read is #1 only. Vertical → carry him man with outside leverage. Underneath → squeeze and rob from on top.',
          'The safety reads #2. Vertical past the backer level → LOCK him up the seam. Anything else → #2 is a RUN KEY: come off, cap #1 from inside, and be the extra alley hat.',
          'That second rule is why Quarters is a RUN coverage as much as a pass coverage — against any non-vertical release you effectively have nine in the fit.',
          'On this snap both #2s go vertical, so both safeties lock the seams. Four deep defenders, four vertical routes — the math that broke Cover 3 Sky is solved.',
        ],
        watch: 'Both safeties. The instant #2 clears the linebacker level, they stop backpedaling in zone and turn into man defenders.',
        quiz: [
          {
            q: 'Quarters safety, #2 releases vertical. What is the rule?',
            options: [
              'Squat and rob the curl behind him',
              'Lock him man up the seam',
              'Hand him to the Mike and cap #1',
            ],
            answer: 1,
            explain: 'Vertical by #2 answers the safety\'s run/pass key — he is now a man defender on the seam.',
          },
          {
            q: '#2 blocks (or runs to the flat). What does the Quarters safety become?',
            options: [
              'A robber on #1\'s in-breaking routes and an extra run fitter',
              'The new flat defender',
              'A deep-half player',
            ],
            answer: 0,
            explain: 'Non-vertical #2 is a run key. The safety caps #1 from inside and folds into the alley — the extra hat is the whole sales pitch of Quarters.',
          },
          {
            q: 'Who does the Quarters CORNER read?',
            options: ['#1 only', '#2, same as the safety', 'The QB'],
            answer: 0,
            explain: 'The corner\'s world is #1: carry him vertical, rob him underneath. Chasing #2 is a different coverage — that is next lesson.',
          },
        ],
      },
      {
        id: 'palms-trigger',
        title: 'Palms: same shell, opposite answer',
        setup: { view: 'compare', coverage: 'c4', compareWith: 'palms', formation: 'doubles', concept: 'curlflat' },
        why: 'THE lesson of this module. Quarters and Palms are pre-snap identical — the same stimulus produces opposite reactions.',
        teach: [
          'The stimulus: #2 breaks OUT inside 5 yards. In QUARTERS, the apex expands with him and the corner stays glued to #1. Structure preserved.',
          'In PALMS, that same out-break fires the trap: the CORNER comes off #1 and jumps #2\'s out, while the SAFETY rotates over the top to cap #1. Two jobs swap mid-play.',
          'Third domino: the Palms apex does NOT chase #2 — his corner already owns that route. He walls #3 and gets under anything #1 sits on. Doubling the trapped route is the classic mistake.',
          'Why carry both calls? Palms kills quick-out and bubble RPO throws to the slot WITHOUT changing the picture the QB sees. Run 4 Verticals against this pairing and the two calls are literally identical — the tests in this repo assert exactly that.',
        ],
        watch: 'The strong-side corner on each field. Same alignment, same stem — then one squeezes #1\'s curl and the other fires downhill on #2\'s flat.',
        quiz: [
          {
            q: 'Palms, #2 runs a speed out. What does the corner do?',
            options: [
              'Stays on #1 — the corner never leaves #1 in a 2-high shell',
              'Comes off #1 and traps the out',
              'Sinks into the deep half',
            ],
            answer: 1,
            explain: 'The out-break inside 5 IS the Palms trigger. Corner traps #2; that is the entire identity of 2-Read.',
          },
          {
            q: 'The corner just trapped #2. Who owns #1 now?',
            options: ['Nobody — that is the risk of Palms', 'The apex/nickel', 'The safety, rotating over the top'],
            answer: 2,
            explain: 'The trap is a two-man exchange: corner takes #2 low, safety caps #1 high. If the safety is late, the out-and-up is a touchdown — which is exactly the counter offenses use.',
          },
          {
            q: 'Run 4 Verticals against Quarters and Palms. What diverges?',
            options: [
              'Nothing — vertical releases make them identical',
              'The corners swap onto #2',
              'The Mike drops deeper in Palms',
            ],
            answer: 0,
            explain: 'The trap only fires on OUT breaks. Verticals lock the same man rules in both calls — the trigger concept (Curl–Flat) is where they split.',
          },
        ],
      },
      {
        id: 'smash-stress',
        title: 'Smash: who dies, who lives',
        setup: { view: 'compare', coverage: 'c2', compareWith: 'palms', formation: 'doubles', concept: 'smash' },
        why: 'A route classification detail with real consequences: a CORNER route is a vertical release, not an out-break.',
        teach: [
          'Smash is a high-low: #1 hitches short, #2 runs a corner route over the top. It is designed to torture a squatting flat corner — the QB reads him and throws opposite.',
          'Cover 2 is the victim. The cloud corner jams and sits in the flat with #1\'s hitch; the corner route bends into the dead spot behind him, and one half-safety has to cover it plus everything else vertical.',
          'Palms survives — and here is the nuance: the corner route counts as a VERTICAL release, not an out. So the trap never fires. The safety simply matches #2 vertical, and the corner squeezes #1\'s hitch from on top.',
          'Rule of thumb: the Palms trap fires on SPEED OUTS, FLATS, ARROWS, BUBBLES — flat breaks inside 5. Anything bending up and away (corner, wheel) is vertical and belongs to the safety.',
        ],
        watch: 'The strong safety on each field. Cover 2: he is stretched to the sideline covering grass. Palms: he locks the corner route man and runs with it.',
        quiz: [
          {
            q: 'Why does Smash beat Cover 2?',
            options: [
              'The Mike cannot get depth on the hitch',
              'It high-lows the squat corner — hitch under, corner route over',
              'Both safeties chase the hitch',
            ],
            answer: 1,
            explain: 'The flat corner cannot cover both. Whoever he takes, the QB throws the other one — and the half safety cannot rescue the corner-route window from the middle of his half.',
          },
          {
            q: 'Palms against Smash — does the corner trap #2\'s corner route?',
            options: [
              'Yes — any break by #2 fires the trap',
              'No — a corner route is a vertical release, so the safety matches it instead',
              'Only if #1 also goes vertical',
            ],
            answer: 1,
            explain: 'The trap trigger is an OUT break inside 5. A corner route stems vertical first — that is safety business in every quarters variant.',
          },
        ],
      },
      {
        id: 'solo-poach',
        title: 'Trips: Solo and the poach',
        setup: { view: 'study', coverage: 'solo', formation: 'trips', concept: 'verts' },
        why: 'Trips breaks symmetric quarters — three receivers on one side, one alone on the other. Solo is the classic answer, and it is a genuine gamble.',
        teach: [
          'The problem: play plain quarters against 3x1 and the strong side is outnumbered vertically while the backside safety covers nobody.',
          'Solo\'s answer: the BACKSIDE safety keys #3. If #3 goes vertical, he POACHES — robs the deep middle and takes #3 over the top. Four defenders over three receivers to the trips side.',
          'The price: the backside corner is MEG, locked on the iso X with help that is strictly CONDITIONAL. On this snap #3 is vertical, so the poach fires and the X truly is alone.',
          'The counter you must respect: the offense keeps #3 in to block. No vertical #3 = no poach = your corner on an island by design. If your corner cannot live alone out there, check to plain Quarters instead.',
        ],
        watch: 'The backside safety. At the trigger he abandons his side entirely and robs the middle — then find the backside corner running MEG with zero help.',
        quiz: [
          {
            q: 'Solo: #3 releases vertical. What does the backside safety do?',
            options: [
              'Stays over the iso X — never leave your side',
              'Poaches the deep middle and takes #3',
              'Buzzes down to the hook',
            ],
            answer: 1,
            explain: 'That is the poach. It turns 3-on-3 into 4-over-3 to the trips side, which is the entire reason to call Solo.',
          },
          {
            q: '#3 stays in to block instead. Now what?',
            options: [
              'The poach never happens — the safety helps the iso corner, but the offense dictated it',
              'The safety poaches anyway',
              'The Mike replaces the poach',
            ],
            answer: 0,
            explain: 'No vertical #3, no poach. The safety rotates to help the X side — but the offense just spent a blocker to strip your structure, and a shot to the X against MEG is exactly what they kept him in for.',
          },
          {
            q: 'Solo vs Poach as CFB 27 presents them — the difference?',
            options: [
              'Solo cheats pre-snap and tips the coverage; Poach reacts post-snap and does not',
              'They are unrelated coverages',
              'Poach is the Cover 3 version',
            ],
            answer: 0,
            explain: 'Same rule, different disguise. Solo aligns the safety toward his job early; Poach holds the picture and moves late. Disguise costs you a step; showing early costs you the tell.',
          },
        ],
      },
      {
        id: 'split-field',
        title: 'Split the field: Cover 6 vs Cover 9',
        setup: { view: 'compare', coverage: 'c6', compareWith: 'c9', formation: 'trips', concept: 'smash' },
        why: 'You do not have to play one coverage across the whole field. Split-field calls put match rules where they help and a cloud where it hurts.',
        teach: [
          'COVER 6 = Quarters to the passing strength, Cover 2 to the single-receiver side. COVER 9 is the mirror: Cover 2 clouded to the strength, Quarters weak.',
          'The decision is about WHERE THE PROBLEM IS. Trips side is the offense\'s engine? Cover 9 clouds it — a true force corner and a deep half sit on all that quick game. Their backside X is the star? Cover 6 gives him the two-deep side.',
          'The seam where the two shells meet is the structural weak point — the Mike is the stitch, and crossers through the middle are how offenses attack it.',
          'Pre-snap tell (both directions): offset safeties. You can read opponents with it, and they can read you.',
        ],
        watch: 'This is Smash into the trips side. On the Cover 9 field the cloud corner + half safety handle it cleanly to the strength; on the Cover 6 field the quarters side plays match rules against the same routes.',
        quiz: [
          {
            q: 'The trips side is shredding you with quick game. Which split-field call points the cloud at it?',
            options: ['Cover 6', 'Cover 9', 'Cover 4 Solo'],
            answer: 1,
            explain: 'Cover 9 = Cover 2 to the STRENGTH. The cloud corner is a real force/flat defender sitting on all of it.',
          },
          {
            q: 'Their isolated backside X is the best receiver on the field. Which call helps most?',
            options: [
              'Cover 6 — the single-receiver side gets the Cover 2 half, a corner underneath and a safety over the top',
              'Cover 9 — quarters travels to him',
              'Neither; split-field calls ignore the backside',
            ],
            answer: 0,
            explain: 'Cover 6 gives the iso side cloud-plus-half — effectively a bracket on the X — while the match rules handle the numbers side.',
          },
        ],
      },
    ],
  },

  /* ════════════ MODULE 3 — RIP/LIZ DEEP DIVE ════════════ */
  {
    id: 'ripliz',
    name: 'Cover 3 Match (Rip/Liz)',
    tagline: 'The one-high match coverage: MOFC run support with an answer to four verts.',
    lessons: [
      {
        id: 'seam-player',
        title: 'The seam player\'s rule',
        setup: { view: 'study', coverage: 'c3match', formation: 'doubles', concept: 'dagger' },
        why: 'Rip/Liz lives or dies on one defender: the overhang carrying #2. Dagger is designed to abuse exactly him.',
        teach: [
          'The rule: #2 vertical → the seam player CARRIES HIM MAN up the seam. That single conversion is what lets a three-deep shell survive four verticals.',
          'Not vertical → the SEAM-HOOK CONVERSION: pass #2 off, re-read the next threat into your zone. Carry or convert — there is no third option.',
          'Dagger weaponizes the carry: #2\'s seam DRAGS the seam player deep on purpose, clearing the 12–15 yard window for #1\'s dig breaking in behind him. You are watching the coverage do the right thing and still lose a window.',
          'The counter is a different call, not a different rule: Cover 3 BUZZ sinks a safety inside precisely to rob that dig. Rules solve routes; CALLS solve concepts.',
        ],
        watch: 'The strong seam player carries #2 vertically — correct by rule — and the dig from #1 breaks into the grass he vacated. Scrub it slowly around the trigger.',
        quiz: [
          {
            q: '#2 releases vertical against Rip/Liz. The seam player…',
            options: [
              'walls him to the FS and settles in the curl',
              'carries him man up the seam',
              'passes him off and doubles #1',
            ],
            answer: 1,
            explain: 'Vertical = carry, full stop. Walling-and-settling is spot-drop Cover 3 — the coverage this rule exists to replace.',
          },
          {
            q: '#2 runs a flat route instead. Now the seam player…',
            options: [
              'chases him to the flat man',
              'converts — passes #2 off and re-reads the next threat into his zone',
              'blitzes, since his man blocked',
            ],
            answer: 1,
            explain: 'Seam-hook conversion. Chasing a flat route out of the seam is how you turn one completion into a structural hole.',
          },
          {
            q: 'Dagger keeps hitting the dig window behind your carried seam. Best answer?',
            options: [
              'Tell the seam player to stop carrying #2',
              'Check to Cover 3 Buzz and rob the dig with the sunk safety',
              'Press the outside receivers',
            ],
            answer: 1,
            explain: 'The carry is correct — breaking the rule opens four verts back up. Change the CALL: Buzz exists specifically to close the dig/hook window.',
          },
        ],
      },
      {
        id: 'ripliz-cfb',
        title: 'Rip/Liz in CFB 27: the check menu',
        setup: { view: 'study', coverage: 'c3match', formation: 'trips', concept: 'verts' },
        why: 'The game exposes real match rules through named checks. Knowing which button maps to which rule is the difference between adjusting and guessing.',
        teach: [
          'SEAM is the default stack check — straight match rules. SKINNY is the trips check: the seam defender takes #2 vertical/outside, the true Rip/Liz rule pointed at 3x1.',
          'SKINNY MEG adds one thing: the backside corner drops his depth trigger and plays pure man. Use it when the iso X is the only backside threat you respect.',
          'ZONE IT kills all matching — everyone spot-drops. It is your panic button when quick game is beating the trigger, or when the AI keeps matching wrong against rub releases.',
          'SKATE (vs bunch) widens the drops toward the compressed surface — your flood answer. One habit: check your flat zone depths (5–8) so a rolled safety does not default to 0.',
        ],
        watch: 'Trips verts against Skinny rules: the seam player carries, the corners play MOD, and the backside X is singled — exactly the picture Skinny Meg exists for.',
        quiz: [
          {
            q: 'Quick game is shredding your match rules before they trigger. Which check?',
            options: ['Skinny Meg', 'Zone It', 'Skate'],
            answer: 1,
            explain: 'Zone It abandons matching entirely — spot-drop defenders read the QB and break on the quick stuff instead of waiting for declarations that never come.',
          },
          {
            q: 'The backside X is their only real threat and you want him erased. Which check?',
            options: ['Skinny Meg', 'Seam', 'Combo'],
            answer: 0,
            explain: 'Skinny Meg locks the backside corner in true MEG man while the front side keeps its match rules.',
          },
        ],
      },
    ],
  },

  /* ════════════ MODULE 4 — MAN ENHANCERS ════════════ */
  {
    id: 'man',
    name: 'Man Enhancers',
    tagline: 'Leverage, help, and brackets — man coverage is a system, not eleven duels.',
    lessons: [
      {
        id: 'help-structure',
        title: 'Where is your help?',
        setup: { view: 'compare', coverage: 'c1', compareWith: 'c2man', formation: 'doubles', concept: 'mesh' },
        why: 'The first upgrade to your man coverage is a question, not a technique: before the snap, every defender should know exactly where his help is.',
        teach: [
          'Man technique is DICTATED by help. Cover 1: one FS over the top, one rat in the hole — so underneath defenders play INSIDE leverage and funnel everything toward those two helpers.',
          'Cover 2 Man: two deep halves, no rat. The trail can be aggressive at the line — press, trail inside-out, let the half safety take the top off. Different help, different technique, same "man" label.',
          'Cover 0: no help anywhere. Now leverage IS survival — take away the slant first, because the fastest-arriving route with zero help behind you is the one that kills.',
          'The trade this snap shows: mesh (crossers) tortures 2-Man because nobody is inside to cut the drags, while Cover 1\'s rat sits right in their path. Flip it to verticals and 2-Man\'s two-deep top is the better shell. Crossers → Cover 1. Verticals → 2-Man.',
        ],
        watch: 'Both fields against mesh. Cover 1: the rat squats in the middle and the crossers run into him. Cover 2 Man: the trailers chase the same crossers across the formation with no inside help.',
        quiz: [
          {
            q: 'Cover 2 Man — why can the nickel press #2 aggressively?',
            options: [
              'Because #2 is usually slower',
              'Because a half safety is over the top — leverage him inside and funnel to help',
              'Because the rat cleans up anything inside',
            ],
            answer: 1,
            explain: 'Aggression is borrowed from structure. Two-deep help is what makes tight trail technique safe — there is no rat in 2-Man.',
          },
          {
            q: 'Which call is better against crossers, and why?',
            options: [
              'Cover 2 Man — the halves drive on drags',
              'Cover 1 — the rat sits in the crossers\' path',
              'They handle crossers identically',
            ],
            answer: 1,
            explain: 'Deep halves cannot touch a 4-yard drag. The hole player lives at exactly that depth — crossers are his whole diet.',
          },
          {
            q: 'Cover 0 leverage rule — what do you take away first?',
            options: ['The fade', 'The slant', 'The comeback'],
            answer: 1,
            explain: 'No help deep OR inside. The slant is the quickest throw into the space you cannot cover from outside leverage — deny it and force the longer-developing ball while the blitz arrives.',
          },
        ],
      },
      {
        id: 'the-rat',
        title: 'The rat: your eleventh defender',
        setup: { view: 'study', coverage: 'c1', formation: 'doubles', concept: 'mesh' },
        why: 'Cover 1\'s free player is the single biggest man-coverage enhancement in the game — if you know his jobs.',
        teach: [
          'The rat reads the QB from the hole, jumps the first in-breaker, and doubles as an extra body in the run fit. Your man defenders\' inside leverage is a funnel pointed at HIM.',
          'Second free player: if the RB stays in to protect, the linebacker manning him converts into a SECOND robber. Cover 1 against a six-man protection is secretly a double-rat coverage.',
          'CFB 27 naming, worth memorizing: RAT = a DE dropping off a simulated pressure · LURK = the LB opposite the back · HOLE = the strong safety down · CROSS = the weak safety down.',
          'Known CFB 27 quirk: Cover 1 Hole occasionally aligns like a different shell entirely. Verify your post-snap picture every play before trusting the rat is actually there.',
        ],
        watch: 'Hit Snap on mesh. The crossers cross right through the rat\'s window, and the FS stays capped over everything — this is the coverage working as designed.',
        quiz: [
          {
            q: 'Why do Cover 1 defenders play INSIDE leverage?',
            options: [
              'To force receivers toward the sideline',
              'To funnel every route toward the rat and the FS — the help is inside and deep',
              'Inside leverage is faster to the flat',
            ],
            answer: 1,
            explain: 'Leverage points routes AT your help. Outside leverage in Cover 1 aims receivers into empty grass instead.',
          },
          {
            q: 'The RB stays in to block. Your Mike (manned on him) should…',
            options: [
              'rush immediately',
              'become a second robber and rob the first crosser',
              'replace the FS deep',
            ],
            answer: 1,
            explain: 'A man defender whose man blocks is a free player. Green-dog rushing is an option, but the base rule in this scheme is: become the rat\'s partner.',
          },
        ],
      },
      {
        id: 'beating-rubs',
        title: 'Beating rubs: stacks and bunches',
        setup: { view: 'study', coverage: 'c2man', formation: 'bunch', concept: 'mesh' },
        why: 'Stacks and bunches are not formations, they are man-coverage attacks. The counter is switching — and CFB 27 gives you the real menu.',
        teach: [
          'The problem: two man defenders following crossing releases through a compressed surface will collide. The offense builds the pick before the snap even happens.',
          'Stacks: LOCK = no switching, you fight through it. COMBO = the nearest two defenders SWAP on crossing releases — in/out becomes yours/mine and the pick evaporates. TRIANGLE = 3-over-2 bracket.',
          'Bunches: POINT COMBO = the point man locks, the other two swap. POINT TRIANGLE = 4-on-3 with a safety bracket — the strongest man check in the game against bunch. Say it again: bunch → Point Triangle.',
          'Principle underneath all of it: against compressed splits you defend RELEASES, not receivers. Nobody owns a man until the routes distribute.',
        ],
        watch: 'Mesh out of bunch against base Lock rules — watch the SAM fight through traffic. This picture is exactly what Combo and Point Triangle exist to clean up.',
        quiz: [
          {
            q: 'A stack keeps beating your Lock man with rub releases. Which check?',
            options: [
              'Combo — the two defenders swap on crossing releases',
              'Zone It',
              'Press harder',
            ],
            answer: 0,
            explain: 'Combo converts "chase your man through the pick" into "take whoever releases your way." The rub becomes pointless.',
          },
          {
            q: 'Strongest man check against a bunch in CFB 27?',
            options: ['Lock', 'Point Combo', 'Point Triangle'],
            answer: 2,
            explain: 'Point Triangle plays 4-on-3 with a safety bracketing the surface — you out-number the bunch instead of out-running it.',
          },
          {
            q: 'The core principle against compressed splits?',
            options: [
              'Align deeper so picks cannot reach you',
              'Defend releases, not receivers — assignments settle after distribution',
              'Always check out of man',
            ],
            answer: 1,
            explain: 'Pre-assigned bodies are what rubs exploit. Switch verbiage assigns space first and bodies second.',
          },
        ],
      },
      {
        id: 'c0-and-toolkit',
        title: 'Cover 0 and the in-game toolkit',
        setup: { view: 'study', coverage: 'c0', formation: 'doubles', concept: 'mesh' },
        why: 'The last man enhancement is knowing the whole CFB 27 toolbox — and when the nothing-behind-you bet is actually worth making.',
        teach: [
          'Cover 0 is a bet: pressure beats the sight adjust. Every defender is alone, so PRESS EVERYONE — an uncontested release with zero help behind is a free touchdown. Have an answer ready for hot slants before you call it.',
          'Where the bet is cheapest: the RED ZONE. The end line shrinks the field, so "no deep help" costs a fraction of what it costs at midfield.',
          'Your per-play man tools, beyond the coverage call: individual press/off per defender; SHADE over the top (protect vertical) or underneath (jump the quick game); BRACKET a star by assigning a second defender to him — a private double inside any man call.',
          'And the user habit that ties the whole module together: in Cover 1, USER THE RAT. The AI plays the hole conservatively; a human rat reading the QB\'s eyes turns crossers and digs into interceptions.',
        ],
        watch: 'Mesh against Cover 0: six in coverage, everyone else coming. Watch how the crossers attack the exact space the rat occupied last lesson — nobody is home. That is the bet, visualized.',
        quiz: [
          {
            q: 'Why must you press everyone in Cover 0?',
            options: [
              'Press raises your pass-rush ratings',
              'Off coverage gives free releases with zero help behind — the timing routes beat the blitz home',
              'It disguises the blitz',
            ],
            answer: 1,
            explain: 'The entire call is a race between your pressure and their hot throw. Press is how you slow their side of the race.',
          },
          {
            q: 'Cheapest place on the field to call Cover 0?',
            options: [
              'Backed up on your own goal line',
              'Midfield on 2nd and 5',
              'The red zone — the shrunken field discounts "no deep help"',
            ],
            answer: 2,
            explain: 'There is no deep ball to give up when the end line is the extra defender. Red-zone Cover 0 buys max pressure at minimum structural cost.',
          },
          {
            q: 'You want a private double on their star slot WITHOUT changing the coverage. Which tool?',
            options: [
              'Bracket — assign a second defender to him individually',
              'Zone It',
              'Shade the whole secondary over the top',
            ],
            answer: 0,
            explain: 'The bracket assignment builds a two-man cage on one receiver inside any man call — the rest of the defense never changes.',
          },
        ],
      },
    ],
  },
];

/* ── lookup helpers ───────────────────────────────────────────────────────── */

export const ALL_LESSONS = MODULES.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleName: m.name })),
);

const BY_ID = Object.fromEntries(ALL_LESSONS.map((l) => [l.id, l]));

export function lessonById(id) {
  return BY_ID[id] || null;
}

// Miss keys are "lessonId:questionIndex".
export function missKey(lessonId, qIdx) {
  return `${lessonId}:${qIdx}`;
}

export function questionForMiss(key) {
  const i = key.lastIndexOf(':');
  const lesson = lessonById(key.slice(0, i));
  const qIdx = Number(key.slice(i + 1));
  if (!lesson || !lesson.quiz[qIdx]) return null;
  return { lesson, qIdx, question: lesson.quiz[qIdx] };
}
