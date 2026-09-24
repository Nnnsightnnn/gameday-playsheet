---
name: package-scout
description: Find and build game-breaking Package Forge packages (M27/CFB 27 macros) via a blind-critic gauntlet. Use for "find new packages", "build a package", "break the meta", "new macro", "package scout".
---

# Package Scout (Package Forge, gameday-playsheet)

A package is one call from Kenny's own book plus a stack of custom
adjustments, saved as a macro, built to beat one named meta threat. This
skill finds the threats nothing in the arsenal answers, builds a package for
each, runs every package past blind critics against a fixed bar, and installs
only what passes.

Read first, every run:

- `src/lib/packages/engine.js` (analyzePackage, disguiseScore, metaCoverage,
  arsenalChecks, MACRO_CAP)
- `src/lib/packages/vocab.js` (adjustment ids, options, menus, FLIP_FRAGILE)
- `src/lib/packages/metas.js` (META_THREATS)
- `src/lib/packages/userObjectives.js` (USER_OBJECTIVES, checkUserObjectives)
- `src/data/packages-<team>.js` (the current arsenal; Falcons today)
- `src/data/personnel-<team>.js` (real player names and doctrine)
- `src/data/gameplans-<team>.js` header (house rules, e.g. Falcons: user FS
  Bates deep in every defensive package; other jobs are programmed)

Repo on Kenny's Mac: `/Users/kenny/gameday-playsheet` (`$HOME/mnt/gameday-playsheet`
in `device_bash`). `npm test`, `npm run lint`, `npm run build` need the Mac's
own node_modules. A cloud session can clone the repo from GitHub into its
workspace, run the gauntlet there, then copy the changed files back to the
Mac and commit from the Mac.

## Step 1: scout the threats

1. Refresh the threat list. Read `public/data/trends.json` and
   `src/lib/packages/metas.js`. Then WebSearch (3 to 6 searches) for the
   current meta tied to the latest title update: patch notes, top online
   books, the cheese people complain about this week. Today's date decides
   "current".
2. Run metaCoverage for both sides with the active arsenal
   (`resolveArsenal(packages)` then `metaCoverage(packages, arsenal, game, side)`).
   List every threat with `gap: true`. That list is the work.
3. A new threat found in research goes into `META_THREATS` before anything is
   built against it: `id`, `game`, `threat`, `name`, `what`, `beatenBy`, a
   `conf` tag (`ea`, `m27`, `m26`, `stale`, `read`) and a `source`. No source
   means `conf: 'read'`. Do not launder a rumour into `m27`.

## Step 2: pick slices

- One threat per slice. Highest gap first: uncovered threats, then threats
  answered by a single `read` package.
- Max 6 slices per run.
- Defensive packages counter offensive metas; offensive packages counter
  defensive metas. `threatsFor(game, side)` already enforces this.
- Park anything you cannot build from Kenny's own books. A parked slice goes
  in the report, not in the repo.

## Step 3: the BAR

Every critic judges every package against these gates, verbatim. Binary per
gate. Default FAIL.

- **G1** `node scripts/packages/check.mjs <file>` exits 0 (zero engine errors,
  real catalog plays, whys > 30 chars, base call unused).
- **G2** mechanism names the opponent's pre-coded answer and exactly why the
  played call eats it.
- **G3** disguise band solid or heavy (>=35), defense has a coverage-shell
  step matching look.shell, offense >= 2 twins.
- **G4** >= 2 losesTo, same-formation checkout with a when, >= 3 tells, a call.
- **G5** vocab ids, valid options, honest conf (m27/ea only with a source).
- **G6** userObjectives from the catalog with fitting positions and a named
  real player.
- **G7** novel vs the arsenal.
- **G8** three practice-mode reps to verify in five minutes, each one
  falsifying a named `read` dependency.
- **G9** game-breaking, concretely: name what a competent human does after
  losing to it once, and a same-formation twin or the checkout that beats
  that adjustment from the SAME pre-snap picture (the macro rides over it).
  A two-move sequence, not a one-shot trick. "Unbeatable" is not the bar.
- **Offense also:** no `flip-fragile` warning.

**Play art rule (G2/G5).** huddle.gg ships play names only. Pull real
assignments and route shapes from madden.tools formation pages
(`https://madden.tools/playbooks/formation/<group>/<formation>/<play>`) and
quote them exactly. Anything unconfirmed is tagged `read`, stated as a
one-sentence dependency, and falsified by a practice rep. A load-bearing
claim that contradicts the cited page is an automatic FAIL; in the first run
this caught an invented built-in spy, a mirrored whip route and a wrong
down-lineman count. Prefer programming a job with the macro (ind-spy,
ind-blitz, ind-zone) over assuming the play art does it.

"Base call unused" means no package in the arsenal already uses that
`base.playId`. G6 means analyzePackage shows no `objective-position` or
`one-man-two-jobs` warning and every note names a player from the personnel
file. If `scripts/packages/check.mjs` does not exist yet, build it before the
first wave: load the file's default export, run `analyzePackage` with
`buildCatalog(playbooks.json .playbooks)`, add the G1 checks, exit 1 on any
failure.

## Step 4: the gauntlet

**Builder wave.** One message, one general-purpose agent per slice, all in
parallel. Each builder gets: the threat entry, the bar, the team's books
from `public/data/playbooks.json`, the personnel file, and the current
arsenal (so it can dodge G7). Each writes one standalone file,
`<scratch>/pkg-<threat-id>.mjs`, with `export default { ...package }`,
including `userObjectives`, `practice: [{ setup, verify }]` (three) and
`sequence: [{ if, call, playId }]` (the G9 chain, real same-formation ids). Never
the repo. It runs G1 on its own file before handing back.

**Critic wave.** One Explore agent per package, on a different model from
the builders. Blind: the critic gets the artifact and the bar only, no
builder notes, no chat history. It returns PASS or FAIL per gate with one
line of evidence each, defaulting to FAIL when it cannot verify. On any FAIL
it writes exactly one revision request: the gate, the line, what would pass.

**Revision wave.** The original builder gets its revision request and fixes
the file. Then a fresh critic judges again.

**Limits.** Max 3 rounds per package. Stall rule: if a round fixes nothing
(same gates fail with the same evidence), park the slice now instead of
spending the next round.

**Integration critic.** Once the passing set is known, one more critic reads
the whole arsenal plus the new packages and checks:

- the house rules in the team plan header (user convention, personnel doctrine);

- slot clashes and caps, via `arsenalChecks` (20 built / 10 active per side);
- two packages with the same base look (same formation and same look.shell
  or look.picture). Keep the stronger one, park the other.

A package that fails integration is parked, not rushed.

## Step 5: install

1. Append each passing package to `src/data/packages-<team>.js` (the default
   export object becomes one array entry with `gauntlet: { passed, rounds }`;
   give it the next free slot from `nextFreeSlot`). Keep the builder's
   research header as a comment above it. The gauntlet tests in
   `src/data/__tests__/packages.test.js` then enforce G8/G9 shape.
2. `npm test`, `npm run lint`, `npm run build`. All green or stop.
3. Commit `Add: <n> packages vs <threats>` and push to main. Pages deploys.

Never claim a package is proven. It is proven when Kenny runs the practice
reps and logs the result. Say so in the report.

## Step 6: report

Plain, short, no filler. Sections, in order:

1. **Bar used.** G1 to G9 plus the offense rule, and any gate you tightened.
2. **Iteration log.** Per slice: rounds run, which gates failed each round,
   final verdict (installed / parked and why).
3. **Installed.** Name, side, slot, threat, and a one-line mechanism each
   (their answer, and why the played call eats it).
4. **Remaining risks.** Parked slices, every `read`-tagged claim Kenny must
   test first (with the rep that tests it), and a reminder that nothing here
   is proven until the practice reps are logged.

## Rules that keep it honest

- Real plays only. Look up every `playId` in the shipped catalog; never
  construct one.
- Twins and checkout come out of the base formation. A twin from another
  formation is not a disguise.
- One user job per player per phase.
- No em dashes in any written field.
- Keep existing packages untouched unless a gate on them is broken; then fix
  it in its own commit.
