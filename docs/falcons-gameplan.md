# Falcons Game Plan — Madden 27

**Refreshed 2026-10-27** · patch state: TU v1.008 (Oct 21), plus TU Sep 3 (v1.005) and TU Sep 16 (v1.006)
Load in-app: Tweaks panel → Game plans → Falcons · Madden 27 → Load.

This is a patch diff, not a rebuild. The drive scripts, counters, 2-4-5 Over Wide base and
the ritual are unchanged, because you have reps in them. Three title updates touched the
rules underneath a handful of calls, and the roster moved under the plan's notes.

---

## What changed on 10/27

**1. Empty protection is manual now.** Since Oct 21, Empty protection no longer picks up
anyone outside the tackle box unless you ID him. A slot or edge blitzer against Empty walks
in free. HB SCREEN (Gun Empty Chips Quads), JAILBREAK SLOT SCREEN and MTN EMPTY SMASH Y-POST
now carry "ID first" notes. See vs Blitz below for how.

**2. The untarget macro was rewritten.** Oct 21 made untargeted defenders "completely
ignored." That turns untarget from a nudge into a bet. See vs Blitz.

**3. Press shading costs more.** Sep 16 raised the penalty for shading the wrong way on man
press. GAP PRESS and COVER 2 MAN notes now say shade only to a release you have seen.

**4. Tempo got easier on defense.** Sep 3 made your pre-play adjustments survive no-huddle,
and Oct 21 closed a hurry-up audible loophole. Watch-list item 2 is resolved.

**5. One new call: COVER 9 ZONE** (Nickel 2-4 Wide) in the vs 12 block. Oct 21 fixed
Quarters-family safeties (Pounder, Roll Ring, Roll King, Cover 9) so they match verticals
regardless of the underneath calls. Split-field coverage against play-action is viable now.

**6. Roster names.** Clark Phillips III was traded (8/30, the Dexter deal), Troy Andersen
released, Jalon Walker is on IR and James Pearce Jr. is suspended. The plan's notes now say
**Billy Bowman Jr.** for the man slot and **Za'Darius Smith** where they said Walker or
Pearce. The live depth chart is the personnel sheet (9/9), not the 8/19 notes further down.

No plays or playbooks were added in any TU since the Aug 7 catalog scrape, so every call on
the sheet still exists.

## What changed on 8/19

**1. The sheet is now drive scripts, not down and distance.** You work a block top to
bottom instead of hunting by down. Each drive block carries 1–2 core calls plus 1–2 tagged
counters, so you never leave the block to adjust.

**2. Five new COUNTERS blocks, keyed to what the defense shows.** Read the shell pre-snap,
jump to that row. This is the escape hatch that lets the drive scripts stay short.

**3. The defense is rebased on 2-4-5 Over Wide.** This is the big one. The plan you were
running listed 3-4 Under 4 Tech and Nickel 2-4 as its base and used 2-4-5 Over Wide exactly
once, buried in the pressure block. That is not how you actually play. The sheet now matches
the defense you run.

**4. The quarterback was wrong.** The old plan built a driven-throw, shot-heavy passing game
on "Penix 92 THP." **Tua Tagovailoa 74 is QB1 on the launch roster; Penix 72 is the backup.**
That changes the passing doctrine — see below.

---

## Patch facts

| Date | What | Why it matters to you |
|---|---|---|
| **Aug 10 — TU1** | Removed an unintended Speed Boost on certain cut moves | If you got run away from in early access, that was it. Fixed. |
| **Aug 17 — LCU** | **Untarget Defender no longer works on RPO plays**; Buck Sweep handoff warp fixed | This helps you. Blocking a back and untargeting the user defender was the cleanest offensive answer to a user rusher. On RPOs it no longer exists. Still works on normal dropbacks. |
| **Sep 3 — TU v1.005** | **Pre-play defensive adjustments are now preserved** vs no-huddle and hurry-up, not wiped | Your one tempo adjustment sticks. |
| **Sep 16 — TU v1.006** | Bigger penalty for **man-press shading the wrong way**; Combo no longer converts to Lock when pressed; user coverage shell respected; Half Slide no longer flips to Full Slide | Shade only to a release you've seen. Shells you set now hold. |
| **Oct 21 — TU v1.008** | **Empty Protection no longer targets players outside the tackle box unless manually ID'd** | Your empty answers vs blitz need a pre-snap ID or the slot blitzer is free. |
| | **"Untargeted" defenders are now "completely ignored"** | Untarget is a bet he drops. If he rushes, nobody blocks him. EA gives no further detail. |
| | Fixed audibling during hurry-up without resetting the defensive package | Closes a tempo loophole. |
| | **Pounder / Roll Ring / Roll King / Cover 9** safeties now match verticals regardless of underneath man/match | Split-field calls are viable. COVER 9 ZONE added. |
| | DBs no longer swap Combo / Point Combo assignments when the receiver blocks | Combo calls are trustworthy again. |

Nothing newer than Oct 21 has shipped as of Oct 27. A known post-1.008 issue keeps some players
out of Online Franchise and Superstar; it does not touch head-to-head.

### Meta honesty

The launch-week caveat (nobody would rank anything) is retired; the game is ten weeks old.
This refresh did **not** re-survey tier lists. It is a patch diff. 2-4-5 Over Wide is still
your base by choice, not because the community backs it.

---

## Do this before you load the plan

> **10/27 roster note.** This section is the 8/19 picture. Phillips (traded), Andersen
> (released), Walker (IR) and Pearce (suspended) are gone. Man slot is now **Bowman**; the
> edge pair is **Ebukam + Za'Darius Smith**; **Gervon Dexter** is the nose. The personnel
> sheet in the app has the current depth chart.

Four depth-chart changes, all from EA's launch ratings.

**Start Christian Harris over Troy Andersen.** Harris 72 vs Andersen 70 — but **MCV 65 vs
54** and **ZCV 65 vs 58**. Andersen is the single biggest coverage hole you can put on the
field; a tight end seam or a back on a wheel is a free completion against 54 man coverage.
Harris is also the only Falcons linebacker EA labels a **Run Stopper**, and his **PUR 84** is
the best pursuit number in the room. Your read of him as the chase-down linebacker is right.

**On man calls, Clark Phillips III takes the slot.** Watts stays on the field as your third
safety — just not as the matched defender. More on this below.

**Run downs: Ebukam and Jalon Walker on the edges, sit Pearce.** Ebukam has the best Block
Shedding (80) and Strength (83) of any Falcons edge. Walker has the best Tackle (84) and
Pursuit (84). Pearce's BSH 70 is the worst on the roster. Flip it on third and long — Pearce
(FMV 81) and Walker rush, Ebukam sits.

**Interior: Da'Shawn Hand (STR 88) at 1-tech, Brandon Dorlus (BSH 79) at 3-tech.** Zach
Harrison (POW 85) is the pass-rush sub.

---

## The quarterback problem

**Tua: TAS 90 · TAM 84 · TAD 84 · THP 87 · AWR 69.** That is a rhythm thrower working a
defined read. It is not a full-field progression reader and it is not a deep-ball arm.

**So this offense lives 0–18 yards, on timing.** The shot calls in Attack Drive and vs
Single-High are **situational** — take them off play-action or a confirmed one-on-one, not as
staples. If you want a real vertical threat, that is the argument for subbing Penix (THP 92),
and you pay for it with worse rhythm throws on every other snap.

**Timing-Based Catching is the mechanic that matters most to you.** Green catches are near
guaranteed even in double coverage; red is a guaranteed drop no matter how open you are. Set
Game Options → Catching: AI Wide Receiver for User Teams **ON**, Timing Based Catching Minimum
Throw Distance **5 yards** on offense and defense, UI Feedback **ON**. Drake London at 92 with
elite Catching and Jump is the reason to grind this — a green catch with him on a contested
ball is close to a free completion.

---

## Offense — the drive scripts

### Opening Script — call these five in order

You are diagnosing, not scoring. Do not deviate.

1. **HB STRETCH** (Singleback Wing Tight) — the identity. Hold LT to read the run fit first.
2. **STICK** (Gun Trips TE Flex) — rhythm. Flat taken = zone. Safe against everything.
3. **MTN JET WIDE ZONE** (Singleback Y Trips Close) — jet motion is your man/zone tell.
4. **MESH** (Gun Bunch TE) — press test. The rubs tell you if it's man.
5. **PA BOOT FLOOD** (Singleback Wing Tight) — cash the stretch. Three levels, take the flat.

> **Motion caveat.** The travel-on-motion read is a Madden 26 carryover. MaddenTurf's watch
> list flags "slot corners not travelling on motion" as a bug living in code both games share.
> Do not trust the tell blindly in launch week — confirm with the MESH rubs too.

### Ball-Control Drive — ahead or even

Core: **HB STRETCH** and **HB DUO** out of Singleback Wing Tight. Same picture, two tracks.
Bijan behind Lindstrom (93 RBK) is the best thing this offense does. Run it until it dies.

Counters: **CROSS DRAG** (Pistol Bunch TE) when they load the box — be patient, the drag hits
*late*. **FAKE HB ZONE QB BOOT** when they overflow — they sell out on zone, you walk in.

### Attack Drive — behind, or the run is dead

Core: **DAGGER** (Gun Trey Y-Flex) — seam clears, dig sits at 12–15, and it's a driven throw.
**PA DEEP OVER** (Gun Deuce Close) — play-action pulls the linebackers, the over crosses the
vacated middle.

Counters: **PA POST SHOT** (Gun Tight Flex) against man — London on the post, but confirm man
first. **HB DRAW** (Gun Tight Flex) when they tee off.

### Scoring Drive, Goal Line, 2-Minute, Backed Up

See the sheet. The principle in the red zone: **SMASH RETURN** out of Gun Bunch is one call
that covers both shells — smash beats two-high, the return beats man.

---

## Counters — read the shell, jump to the row

### vs 2-High (Cover 2, Quarters, Palms, Cover 6)

Two-high means five or six in the box and no free middle-of-field defender. Make them wrong
twice: run at the light box, then throw into the vacated middle.

- **HB DUO** — punish it on the ground first. Always.
- **MTN EMPTY SMASH Y-POST** — the post splits the safeties. If the safety widens, take the smash corner. It motions to Empty, so since Oct 21 **ID any slot or edge blitzer** before the snap.
- **MTN X-GO DIG** — the go clears the corner, the dig lands in the hole.
- **DOUBLE DIG** — two digs at the same depth. Throw away from the hook defender.

Do **not** lead with Four Verticals here. It's a Cover 3 concept.

### vs Single-High (Cover 1, Cover 3, Cover 3 Match)

One deep defender, two seams. Pitts at 86 speed against a linebacker is the crime you want.

- **MTN Y POST** — Pitts on the post. Read the free safety's hips and work away.
- **HITCH SEAM** — two seams, one middle defender. He can only carry one.
- **GO DBL POST** — two posts bracket the single high. Your best shot call.
- **FLOOD** — hi-lo the curl-flat defender. Sinks = flat, widens = sail.

Against Cover 3 **Match** specifically, match rules break on inside-breaking distribution, not
on verticals. If the post gets carried, go to **MESH DIG**.

### vs Man Press

> **Sep 16 note, from your side of the ball.** EA raised the penalty for a pressing defender who
> shades the wrong way against the release. Defenses that guess on press lose more now, which
> makes your release inputs and bunch splits worth even more.

EA rebuilt WR/DB interactions this year — hand-fighting, jostling and leverage at press,
release and catch point, with route awareness added so the receiver knows which way he needs
to win. The practical consequence: **bunch and stack releases now decide who even gets
pressed.** This book has eight bunch/stack formations. That is its biggest structural edge.

- **CHEAT DRAG RUB CROSSER** (Gun Bunch Wide Nasty) — tightest split in the book, built-in rub.
- **MESH DIG** (Gun Bunch TE) — crossers pick each other, dig is the third level.
- **X CURL** (Gun Y Off Trips Close) — London isolated backside. Take the one-on-one.
- **L SPOT** (Gun Bunch) — release traffic frees the spot sitter.

### vs Blitz / Mug

- **STICK** (Gun Trips TE Flex) — the best hot call in the book. The HB flat is the valve.
- **DOUBLE SLANTS** — ball out in about 1.2 seconds into the vacated side.
- **JAILBREAK SLOT SCREEN** — whole line releases. Best against an all-out look. Empty set:
  ID the edge blitzer first.
- **HB SLIP SCREEN** — Bijan at 95 in space. This is a real counter, not a change-up.
- **HB SCREEN** (Gun Empty Chips Quads, backed-up block) — Empty set: ID the slot blitzer first.

**Empty protection after Oct 21.** EA's line is that players outside the tackle box "will no
longer be targeted with Empty Protection unless manually ID'd." So in any Empty look, a slot
corner or a wide edge who blitzes is unblocked by default. Before the snap, open protection
(R2/RT + right stick) and put the flame on the man outside the box you think is coming. EA names
manual ID as the fix and nothing else, so don't count on a slide to save it.

**The untarget macro, rewritten.** The old note said to build "HB pass block + untarget the
user defender" as one macro. Oct 21 made untargeted defenders "completely ignored." EA gives no
more detail. The likely reading is that your blockers now skip him entirely. Untarget used to
be a nudge. Now it's a bet:

- **Use it when you've seen the user drop.** Two snaps of him bailing from a mug into a hook
  zone and the macro is right: no lineman wastes a block, and the HB picks up a real rusher.
- **Kill it the first time he comes.** An untargeted user who rushes is free, and with this
  patch nobody will drift onto him. Keep a second macro that is **HB pass block only**, with
  no untarget, and switch to it.
- Still dead on RPOs (Aug 17 LCU).

Same trap as before: macros map to **depth-chart position, not field position**, so they
break when the formation flips. Only macro players who don't move (TE, HB, WR3), or build
explicit left and right versions.

On defense it cuts the other way. If an opponent untargets your user Bates on COVER 1 STING,
the one call where he's in the box, a rush from him is now unblocked.

### vs Tempo

Your no-sub page is **Gun Trips TE Flex**. Run and pass from an identical look, no personnel
change, so tempo can't catch you mid-substitution.

- **MTN FORK H CHOICE** — option route self-corrects against man or zone.
- **INSIDE ZONE** — same look, punishes a light box.
- **SPACING** (Gun Bunch TE) — five windows, one at the sticks.
- **CHOICE PIVOT RETURN** (Gun Tight Y Off) — three self-correcting routes. The bail-out.

---

## Defense — 2-4-5 Over Wide

### Why it works with your personnel

Three safeties on the grass. The page carries a full coverage spine — Cover 1, Cover 1 Robber,
Cover 1 Sting, Cover 2 Man, Cover 3, Cover 3 Sky, Cover 3 Cloud Show 2, Cover 4 Quarters,
Cover 6, Tampa 2 — plus ten blitzes including two **sim pressures**. It can genuinely be a
one-page book, which is what makes it tempo-proof.

**Base / Tempo — the four blind-safe calls you audible between:**
COVER 3 SKY · TAMPA 2 · COVER 4 QUARTERS · COVER 1 ROBBER.

**Tempo got friendlier on Sep 3.** Pre-play defensive adjustments are now preserved against
no-huddle and hurry-up instead of being wiped. Whatever single adjustment you set (pinch, roll,
press) survives their next snap. Oct 21 also fixed a hurry-up audible that dodged the
defensive package reset.

### The Bates correction — read this one twice

You have been playing **Jessie Bates in the box**. The ratings say don't.

- His archetype is **Zone - S**. **ZCV 93** against **MCV 85**.
- His Superstar ability **Deep In Zone KO** only fires **20+ yards from the line of scrimmage,
  inside the hash marks**. In the box, it is switched off.
- His other Superstar, **Lurker**, pays out for lurking in zones — also depth-dependent.
- **BSH 56 and STR 59** are his two worst numbers, and the box is exactly where they get found.
  A guard climbing to the second level erases him.

You are taking the best safety in the game, turning off both of his abilities, and putting him
where his weaknesses live. **User him deep.** His PRC 95 and 90 speed mean he still closes on
the quick game from depth — you are not giving that up, you are getting it *plus* the abilities.

**Box him only on short yardage** — that's what COVER 1 STING in the Short Yardage block is for.

### The big-nickel rule

**Three safeties = zone calls.** Watts's **ZCV 81** is the best of any slot candidate on the
roster. But his **MCV 72** is mid-pack, and the real disqualifier is **AGI 82 / COD 82** —
seven to nine points below every corner. The slot is a two-way go with no sideline; a defender
who can't flip his hips loses the option route regardless of his coverage rating.

**So: zone → Watts in the slot. Man → Billy Bowman Jr. (MCV 71, AGI 89, SPD 92).** Phillips
was traded on 8/30, and Bowman is the honest downgrade: his hips are the reason, not his man
number. Watts stays on the field either way, just not matched up.

### The hole — say it out loud

**2-4-5 Over Wide has no interior-gap run-fit call in its 18 plays.** No pinch blitz, no A-gap
fire. Combine that with:

- No Falcons defensive tackle above **74 OVR**
- No Falcons linebacker who can shed a block (BSH 67 / 67 / 68)
- **Deablo is a Pass Coverage archetype** — TAK 87 and PUR 87 are real, but STR 69 means a
  guard climbing to him wins outright. He is a **free runner**, not a run-stuffer. Keep him clean.

**Inside zone and duo at the A gap is the structural hole in this defense and you cannot
personnel your way out of it.** Two answers:

1. **Pinch the line manually** — RS-left into the D-line menu, then LS-down.
2. **Check out of 2-4-5 against 12, 21 and 22 personnel.** That is what the vs 12 and vs 22/31
   blocks are for: Nickel 2-4 COVER 3 MATCH, 3-4 Over COVER 4 QUARTERS, 3-4 Odd PINCH BUCK O,
   and since Oct 21 **Nickel 2-4 Wide COVER 9 ZONE**: a split-field call whose quarters safeties
   now match verticals regardless of the underneath calls. It's the answer to 12-personnel
   play-action shots.

**Man press, after Sep 16.** EA raised the penalty for shading the wrong way against the
release. On GAP PRESS and COVER 2 MAN, shade only to a release you have actually seen. Against
a receiver who mixes it, play the corner straight and let the press rating work. Combo also no
longer turns into Lock when pressed, and (Oct 21) DBs no longer swap Combo assignments when a
receiver blocks.

If you take one thing from this refresh: **2-4-5 Over Wide is your base against 11 and 10
personnel. It is not your base against a tight end run team.**

### Pressure

The sim pressures are the most interesting calls on the page — **COVER 3 SIM PRESSURE** and
**INVERT 2 SIM** show heat, rush four, and keep seven in coverage. That is the one defensive
idea a serious lab shop (Madden Prodigy) is publicly chasing in M27.

**WILL BLITZ 3** sends Harris, your best free runner. **DOUBLE CB BLITZ** is a changeup — show
it twice a game, no more.

---

## New M27 defensive tooling you are not using yet

This is where the real edge is right now, because formation meta doesn't exist yet.

- **Smart Zones** — aggressive (jump short) / conservative (protect deep) / **Look For Work**.
- **Plaster** — defenders attach to receivers when the play breaks down. Your scramble answer.
- **Roll Coverage** — shade help to the fastest player, WR1, TE1, field, boundary, or highest-rated.
- **Cross Man** — back after years out. Man a specific receiver while everyone else plays zone.
- **Alignment sliders** — CB depth and width, safety depth, width and midpoint. For run defense,
  pinch safety width and set safety depth around 9 yards.
- **Custom adjustments** — 20 saved, 10 active per game.
- **Coaching adjustments now save globally** from the main menu and default into every game.
- **QB contain** = R1 then L1.

---

## The 25-second ritual

1. **Personnel count first.** Backs and tight ends. 12 or heavier → get out of 2-4-5.
2. **Shell read.** One high or two? That picks your counters row on offense.
3. **Set your user.** Bates, deep. Not the box.
4. **One adjustment, not three.** Pinch the line, or roll the coverage, or press. Pick one.
5. **Snap it.** A late perfect call loses to an on-time good one.

---

## Known bugs and watch list

MaddenTurf's Madden 27 bug tracker has logged **zero confirmed bugs** — their bar is a creator
hitting it on film in a real head-to-head game. Their **watch list**, carried from CFB 27 in
shared code and *not confirmed in Madden 27*:

1. Formation shifting stacking hot routes past the normal limit
2. Defensive packages resetting on no-huddle. **Resolved:** TU Sep 3 preserves pre-play adjustments vs no-huddle, and TU Oct 21 fixed the hurry-up audible that skipped the package reset
3. Cover 2 shells aligning differently against identical offensive formations
4. Timing catch failing off a chip release — M27's timing catch is new code, highest-risk area
5. Slot corners not travelling on motion; user defenders frozen after a flip

Items 3 and 5 are the two that would cost you games without you knowing why. Worth ten minutes
in practice mode.

---

## Sources

Patch facts (10/27) are from EA's own title-update notes: Sep 16
(ea.com/games/madden-nfl/madden-nfl-27/news/madden-nfl-27-title-update-september-16) and Oct 21
(ea.com/games/madden-nfl/madden-nfl-27/news/madden-nfl-27-title-update-october-21), with Sep 3
via madden-school.com and cross-checks from mp1st and butwhytho.net.

Ratings are EA first-party (ea.com Madden 27 ratings) cross-checked against maddenratings.com
for sub-attributes. Patch facts from EA Forums and EA's @MaddenNFLDirect. Meta reads from
Civil.GG, MaddenTurf, Madden Prodigy and Operation Sports. Formation contents from huddle.gg
and the shipped catalog in `public/data/playbooks.json`.

Content-farm sites (mmoexp, iggm, ezg, utnice, ldshop, d3game, timesaver) were excluded — several
are currently republishing MaddenTurf's **Madden 26** tier list as Madden 27.

*built by nnnsightnnn — signal from noise*
