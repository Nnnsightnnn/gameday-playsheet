# Falcons Game Plan — Madden 27 (Online H2H)

Built Aug 7, 2026 · Madden 27 launch window (early access Aug 6, pre-TU1).
Companion to the in-app plan (`src/data/gameplans-falcons.js`) and the styled
guide (`docs/falcons-gameplan.html`, served at `public/gameplan-falcons.html`).
Every play name below is machine-validated against the Madden 27 huddle.gg
catalog (`public/data/playbooks.json`, version 27).

## Doctrine

Worse roster → turn a 12-possession game into a 7-possession game: bleed
clock every snap, take the checkdown, and make scheme conflict (rubs,
options, motion) beat talent.

1. Milk the play clock under 5 unless trailing late.
2. Long drives ARE the defense — every first down deletes 40+ seconds of
   their offense.
3. No 50/50 lobs; M27's WR/DB hand-fighting makes contested balls worse for
   the worse roster. Checkdowns and in-bounds completions.
4. Variance only at decision points: go on 4th-and-short past midfield. M27
   shipped a dedicated Tush Push play — until patched it's your 4th-and-1
   too.
5. Take points early when drives stall; late, down 4–8, the conversion
   usually beats the field goal.

Why the Falcons book: consensus top-5 offense at M27 launch (Civil.GG),
run-first pistol base, the Gun Bunch money page, HB ANGLE for Bijan, and a
defensive book that natively carries the full Nickel 2-4 mug family.

## Offense — where you live

Four pictures (tendency laundering), one under-center counter-look:

- **Pistol Bunch TE (base)** — HB ZONE / STRONG POWER ground game, CROSS
  DRAG + STICK with zero hot routes, JET TOUCH PASS pair.
- **Gun Bunch (money page)** — MESH SPOT, SPACING, Y CURL, SMASH RETURN,
  DIG RETURN, BENCH PIVOT, HB BASE, HB SLIP SCREEN. Only 7 books have it.
- **Gun Trips TE Flex (quick game)** — STICK (four years a top stock play),
  HB ANGLE (Bijan vs a LB = mismatch every snap).
- **Gun Tight Y Off (motion/run)** — DUO, 0 1 TRAP, HB SCISSORS, TE CORNER,
  MTN spinner series.
- **Singleback Wing Slot (counter-look)** — HB ZONE WK, MTN WIDE ZONE WK,
  PA CROSS SHOT off the same picture.

Identity sets nobody labs: Gun Tight Flex (PA POST SHOT — the man destroyer;
DOUBLE SPOT), Gun Y Off Trips Close (Y-OPTION WHEEL, MTN CORNERS, MTN EMPTY
HB SLUGGO), Gun Bunch Wide Nasty (FLOOD SWITCH), Gun Empty Chips Quads
(HB SCREEN — chip-protected empty), Gun Wing Slot Offset (MTN JET page:
touch pass / HB DUO / PA cross off identical motion).

Coverage beaters — C2: SMASH RETURN, VERTICALS, LEVELS SAIL. C3: Y CURL,
FLOOD SWITCH, DAGGER. C1 man: MESH SPOT, CROSS DRAG, PA POST SHOT, HB ANGLE.
C4: run it (HB ZONE / DUO), STICK + SPACING underneath. Blitz: STICK hot,
HB SLIP SCREEN, CHEAT HB JAILBREAK SCREEN, RPO PEEK SLANT BUBBLE.

The Bijan rule: when unsure, get Bijan the ball where a linebacker has to
tackle him.

## Script 15

Plays 1–3 man/zone + user (HB ZONE, CROSS DRAG, STICK) · 4–6 blitz tendency
(MESH SPOT on 3rd-and-medium) · 7–9 user location (crosser / flat / seam) ·
10–12 edge discipline (MTN JET pair, 0 1 TRAP) · 13–15 deep honesty
(PA POST SHOT, max protect).

## 10-branch adjustment tree

1. Man → MESH SPOT, CROSS DRAG, HB ANGLE, jet pair; motion Bijan wide.
2. Zone → SPACING, Y CURL, STICK; high-low the flat defender.
3. Known-side blitz → slide to it, STICK flat / slip screen behind it.
4. Users the middle → flats and seams; pump drag, SPEED DIG behind him.
5. Drops 8 → HB BASE, HB DRAW, checkdowns, milk clock, zero shame.
6. 2-high pre-snap → confirm at snap; SMASH RETURN punishes real C2.
7. Heavy box → HB ZONE WK, OUTSIDE ZONE, jets, PA CROSS SHOT. Light box → run inside.
8. Inside run stuffed → change track: 0 1 TRAP, MTN JET HB DUO, outside zone.
9. One-concept spam → remove exactly that route with ONE adjustment.
10. Tilting → timeout, Pistol Bunch TE HB ZONE + CROSS DRAG. No "improvise" branch.

## Defense — one package, personnel first

**Home: Nickel 2-4 Dbl Mug.** Both ILBs mugged every snap; identical picture
dropping 8 or sending 6. Zone suite (C3 SKY / SEAM, TAMPA 2, C2 INVERT,
C1 HOLE) + five 3-deep pressures + two sims live here; match coverages
(C3/C2 MATCH, PALMS, BUZZ MATCH) are one audible away in base Nickel 2-4 —
same eleven on the field. Zero man-island calls by design; MID BLITZ 0 is
seen-look only.

Blocks: Base/Tempo = C3 SKY · TAMPA 2 · C2 INVERT · BLITZ LOOP 3 (the four
blind-safe audibles). vs10 = NICKEL SIM 2, C2 MATCH, C3 MATCH. vs12 =
C4 PALMS, NICKEL DOG 3 BUZZ, COVER 6. Heavy = 3-4 Odd PINCH BUCK O,
C3 MATCH, C4 QUARTERS (only personnel swap — skip under tempo). Short
yardage = BLITZ LOOP 3, C2 MATCH, C2 INVERT, MID BLITZ 0 (seen only).
Obvious pass = Dime 2-3 C3 SAMMIE / FIELD SIM 3, Quarter OVERLOAD 3,
TAMPA 2. Pressure = SS BLITZ 3, Load Mug NICKEL BLITZ 3, FIELD SIM 3, Penny
SLOT BLITZ 3 — all with a 3-deep net. Red zone = 2 INVERT HARD FLAT,
REDZONE DT DROP, C2 MATCH. Goal line = 6-2 60 PINCH, GUTS. Prevent =
PREVENT (up big only), Dime C3 BUZZ MATCH.

## Hurry-up protocol

Pre-game: Auto Flip ON · Ball in Air Balanced (Play Ball late with a lead) ·
Option/RPO keys Conservative as scouted · first free series set flat zones
30 vs crossers or hard flats 10 vs quick outs (drops persist through
no-huddle).

Audibles (all Dbl Mug): 1 C3 SKY · 2 TAMPA 2 · 3 C2 INVERT · 4 BLITZ LOOP 3.

5-second routine: backfield glance (empty → SKY/INVERT) → audible →
one global adjustment max (never individual hot routes) → user the mid
hook, breathe. Panic buttons: TAMPA 2, C3 SKY, (+2s) C4 PALMS.

## Cheese counters (launch window ≈ M26 carryover, labeled)

| Cheese | Counter |
|---|---|
| Gun Bunch corner/flood | COVER 6 / C3 CLOUD, squat flat to bunch side |
| Mesh/crosser spam | TAMPA 2 / C3 BUZZ MATCH, flats 30, user low hole |
| Stretch/toss spam | NICKEL DOG 3 BUZZ; heavy → PINCH BUCK O |
| RPO bubble/glance | RPO Key Conservative + hard flats, C2 MATCH |
| Scrambling QB | C3 SPY (Quarter); tempo → C3 SEAM + QB Contain |
| Four verts tempo | C3 MATCH seen; blind C3 SKY + user carries #3 seam |
| Tush Push spam (NEW M27) | 6-2 60 PINCH, user submarine A-gap; nerf likely |
| Motion-snap jet cheese | Zone doesn't chase motion; stay SKY/match |

Tripwire: CFB 27's Aug 6 patch (same engine) fixed C3 Match vs bunch after
Underneath/OTT adjustments. If M27 match looks broken vs bunch, fall back to
TAMPA 2 / COVER 6 until TU1.

## 25-second ritual

0–5 log one word · 5–10 personnel names the block (defense) / LIVE highlight
(offense) · 10–15 pick and commit · 15–25 sheet down, eyes up, milk to ~3.

Stillness sharpens sight.

## Sources

huddle.gg M27 playbook database (catalog scraped 2026-08-07) · Civil.GG M27
Falcons breakdown + top-5 offenses · Madden Prodigy M27 rankings + defense
guide · Madden Turf playbook criteria, patch + bug trackers · M26 carryover
(labeled): Madden School Falcons, MaddenGuides Dbl Mug/Tampa 2 + Gun Bunch
counters, Madden Academy crossers, Operation Sports defense guide · EA CFB 27
Aug 6 title update notes (engine watch).
