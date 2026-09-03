<!-- Last verified: 2026-08-12 -->
# Claude Context Specification

Gameday Playsheet — a single-page, offline-first study lab for Kenny's
Madden 27 and CFB 27 game planning. No backend, no accounts: everything is
static JSON in `public/data/` plus IndexedDB in the browser.

Live: https://nnnsightnnn.github.io/gameday-playsheet/

**Verified against the code 2026-08-14** — 289 tests across 11 files, passing.

---

## Purpose & workflow

This repo is the **lab for Kenny's life-goal #3: elite Madden 27 + CFB 27 play,
coached as deliberate practice** (decided 2026-08-10, replacing the retired AI
curriculum).

Current focus: **Ole Miss (CFB 27)** — offense installed 8/04, defense rebuilt
around the stock 4-2-5 book — and **Madden 27 Falcons** (started 8/06).

> **Doctrine correction, 2026-08-14.** The Falcons note used to read
> "personnel-first 3-4." The launch roster does not support it — no DT above
> 74 OVR, both starting edges at 36–40 Man Coverage, and the two best
> defenders are safeties. It is a **nickel (4-2-5) team with a five-man odd
> front as a package**. See `src/data/personnel-falcons.js`.

Weekly cadence: **one concept installed, tested in a game, reviewed in the
daily note.**

Installing a team game plan is a written procedure, not an automated skill (see
**[PLAN]** below). Earlier versions of this file referred to `team-gameplan` and
`trends-refresh` skills — **neither exists on disk.** Do the steps by hand.

---

## Tech Stack

**JavaScript (not TypeScript)** • **React 19** • **Vite 7.2.7** •
**Dexie 4 (IndexedDB)** • **Vitest 4** • **hand-written CSS**

- Tailwind 4 is installed and `@import "tailwindcss"` sits at the top of
  `src/index.css`, but **no component uses a Tailwind utility class.** See
  `[STYLE]` before writing any markup.
- `@dnd-kit/core` and `@dnd-kit/utilities` are in `package.json` but **unused** —
  dragging is the custom `src/hooks/usePointerDrag.js`. Don't reach for dnd-kit.

---

## The app in one pass

`App.jsx` is the whole shell: a coordinator header, a five-way view switch, an
offense/defense toggle, and a Tweaks panel. All persistent state lives in Dexie
and is read with `useLiveQuery`; `settings.view` decides which view renders.

| View (`settings.view`) | Component | What it is |
|---|---|---|
| `sheet` | `laminated/Sheet` or `laminated/SetupSheet` | The laminated call sheet — plays grouped into situation blocks that light up from the live down/distance/spot. `settings.sheetMode` swaps **By Situation** (calling plays) for **By Formation** (walking the in-game favorites menu against a persistent checklist). |
| `planner` | `planner/FormationPlanner` | Drag 11 tokens on a field; the app names the formation, reads DL techniques + gap responsibility, and validates it against NFL/NCAA rules. |
| `coverage` | `coverage/CoverageLab` | Defense-only coverage study model: animate a coverage vs a route concept, compare two coverages side by side, work a 14-lesson Learn track with quizzes and a miss drill, search a glossary. |
| `trends` | `trends/TrendsBoard` | Curated meta digest from `public/data/trends.json`, plus an optional live YouTube search (Kenny supplies his own API key, stored in settings). |
| `skills` | `skills/SkillsLab` | Five lenses. **Debrief** (`skills/DebriefLens`, default): two-minute post-game diagnosis — chips map to skill ids, `src/lib/skills/debrief.js` ranks recent leaks into a recommended focus and emits the Vault log line. Gaps / Plan / Assess / Progress: self-assessment against a 31-skill elite taxonomy → gap list → lab week → dated history. Dexie `gameDebriefs` (schema v11). |
| `personnel` | `personnel/PersonnelLab` | **Who fills each job.** 24 scheme roles per team — the job, the ratings that do it, the trap ratings, EA's archetype, the current holder graded fit/stretch/hole, the failure mode, and between-play reads. Four lenses: Roles · Build (depth-chart procedure) · In-Game (adjustment reads) · Gaps. |

Offense/Defense tabs are hidden on `coverage`, `trends`, `skills`, and
`personnel` — those views are either defense-only, span both sides, or carry
their own side filter.

**Two games, side by side.** `settings.game` is `'madden' | 'cfb'`. The play
catalog is lazy-fetched per game and cached in React state; the call sheet is
stored per game so the two sheets never clobber each other. The game toggle
lives inside the PlayBank drawer.

---

## Project Structure

```
src/
  App.jsx                  shell: views, side, game, plan loading, toasts (437 lines)
  index.css                ALL styling — 2147 lines, hand-written (see [STYLE])
  components/
    laminated/             Sheet, SetupSheet, PlayBank, Coordinator, TweaksPanel, Toast
    planner/               FormationPlanner, FieldBoard, FieldBackground, PlayerToken,
                           PositionPicker, ValidationPanel, DiscoveryPanel,
                           FormationLibraryDrawer
    coverage/              CoverageLab, CoverageField, AssignmentSheet,
                           CoverageBriefing, LessonMode, GlossaryPanel
    trends/                TrendsBoard
    skills/                SkillsLab, DebriefLens
    personnel/             PersonnelLab, RoleCard
  lib/
    db.js                  Dexie schema v8 + every persistence helper
    coverage/              pure engine: coverages, engine, formations, concepts,
                           routes, lessons, glossary, differences, labField, labConfig
    field/                 pure engine: fieldConfig, formationFactory,
                           featureExtraction, matchingEngine, gapAlignment, rulesEngine
    personnel/             pure engine: roleModel (fit grading, gap lists, read grouping)
  data/                    situations, seed, skills, gameplans{,-iowa,-falcons},
                           personnel, personnelPlans, personnel-falcons
  hooks/                   useFormationEditor, usePointerDrag
public/data/               playbooks.json (M27), playbooks-cfb27.json,
                           formation-library.json, trends.json
public/gameplan-*.html     team guides served on Pages (byte-identical to docs/)
docs/                      per-team guides (.md source + .html), coverage-lab-standalone
tools/scraper/             Python scrapers (huddle.gg, cfb.fan)
scripts/dev.sh             background dev-server wrapper
.claude/                   context system (see [CTX])
```

---

## Critical Guard Rails

### Memory Check (REQUIRED)
**ALWAYS check first:** `.claude/memory/active/quick-reference.md` — it carries
the per-view working map, data contracts, and gotchas that don't fit here.
> TRIGGER: Before starting any task

### Verification [VERIFY]
**[VERIFY-00001]** Read code before recommending changes.
**[VERIFY-00002]** `npm test` is the gate for any change to the coverage engine,
the field engine, the skill taxonomy, `trends.json`, or a curated game plan —
those tests assert *football facts*, not rendering.
> TRIGGER: Before proposing ANY changes / before any deploy

### File Organization [FILE]
**[FILE-00001]** Keep root clean. Organize by type.
**[FILE-00002]** A new view goes in `src/components/<feature>/`; its pure logic
goes in `src/lib/<feature>/`. Keep components presentational — the engines are
testable precisely because there is no React in them.
**[FILE-00003]** Split files over ~300 lines. `coverages.js` (709) and
`lessons.js` (603) are data tables, which is why they're exempt.
> TRIGGER: When creating new files

### Execution [EXEC]
**[EXEC-00001]** Parallelize independent operations.
> TRIGGER: Before making tool calls

---

## Build & Development [BUILD]

```bash
npm run dev        # vite dev server, port 5173
npm run test       # vitest run — 243 tests, ~300ms. Required before any deploy.
npm run test:watch
npm run lint       # ESLint — required before commit
npm run build      # production build to /dist
npm run preview
./scripts/dev.sh start|stop   # background dev server (writes .dev.pid)
```

**[BUILD-00001]** Run `npm run lint` before commits.
**[BUILD-00002]** Vite `base` is `/gameday-playsheet/` — build runtime asset URLs
with `import.meta.env.BASE_URL`, never a leading `/`.
**[BUILD-00003]** Production builds output to `/dist` only.
**[BUILD-00004]** Deploy is automatic: push to `main` →
`.github/workflows/pages.yml` builds and publishes to GitHub Pages.
> TRIGGER: Before git commit / before deploy

---

## Component Architecture [COMP]

**[COMP-00001]** React 19 functional components with hooks. Default exports for
components (matches every existing file), named exports for lib functions.
**[COMP-00002]** Use `useLiveQuery` from `dexie-react-hooks` for database reads.
**[COMP-00003]** Destructure props; PascalCase component names and filenames.
**[COMP-00004]** Never write inside a `useLiveQuery` querier — Dexie forbids a
readwrite transaction there. Seeding goes in a `useEffect` at app start
(`ensureSheetAssignmentsSeeded`, `ensureFormationsSeeded` — both idempotent).
> TRIGGER: When creating or editing components

---

## Data Persistence [DATA]

**[DATA-00001]** Use the helpers exported from `src/lib/db.js` for all IndexedDB
work — never touch `db.<table>` from a component.
**[DATA-00002]** Schema is at **version 10**. Tables: `myPlays`, `gameSessions`,
`playPerformance`, `gameContext`, `sheetAssignments`, `sheetSettings`,
`formations`, `setupChecks`, `callSheets`, `skillAssessments`, `labPlans`,
`personnelCharts`. Adding a table
means a new `db.version(N).stores({...})` block listing **every** table — never
edit an existing version block.
**[DATA-00003]** Sheet assignments are stored per game
(`{ id: 'sheet', byGame: { madden: {offense,defense}, cfb: {...} } }`). Legacy
flat rows are migrated into `byGame.madden` by `migrateSheetRow`.
**[DATA-00004]** Loading a plan is destructive, so it is guarded: confirm dialog
→ `backupCurrentSheet(game, reason)` (one rolling `backup_<game>` row) →
`applyGamePlan(game, plan, side)`. Keep that order. A saved call sheet has the
same shape as a curated plan, so `applyGamePlan` loads either one unchanged.
**[DATA-00005]** Two note fields per sheet play: `note` is the plan's coaching
note (replaced when a plan loads), `myNote` is Kenny's own (deleted, not
blanked, when cleared). Don't merge them.
**[DATA-00006]** Static data contracts are test-enforced:
`public/data/trends.json` (`src/data/__tests__/trends.test.js`),
`src/data/skills.js` (`skills.test.js`), curated plans — every `playId`
validated against the shipped catalog (`gameplans.test.js`), and team role
sheets (`personnel.test.js`), which assert **Madden 27 football facts**: no
retired position codes (LE/RE/LOLB/MLB/ROLB), Hit Power never core, Speed never
core at CB/FS/SS, CIT+SPC ahead of raw CTH, Play Action tagged as a trap.
> TRIGGER: When working with stored or static data

---

## Styling [STYLE]

**[STYLE-00001]** **All styling lives in `src/index.css` as hand-written CSS
classes** (`.stage`, `.view-tab`, `.sheetmode__btn`, `.cvlab__main`, `.trends`,
`.skl-*`). Components use those class names — there is not one Tailwind utility
class in `src/components/`. Match the file you're in; do **not** introduce
Tailwind utility soup into these views.
**[STYLE-00002]** Theme is CSS custom properties set on `.stage` from
`settings.tweaks` (`--paper`, `--paper-edge`, `--paper-line`, `--ink`,
`--accent`). Read those variables instead of hard-coding colors, or the Tweaks
panel stops working.
**[STYLE-00003]** `index.css` is organized in banner-comment sections — laminated
sheet → Formation Planner → Coverage Lab → Trends Board → Skills Lab →
Personnel Lab. Add new rules inside the matching section.
**[STYLE-00004]** Situation-block colors are data, not CSS — they live on each
block in `src/data/situations.js`.
> TRIGGER: When adding or changing any styling

---

## Installing a game plan [PLAN]

The recurring job in this repo. There is no skill for it; these are the steps.

1. **Research the meta** for the team/game (patch notes, current online meta).
2. **Write the plan module** — `src/data/gameplans-<team>.js`, exporting
   `{ game, name, guide, offense: { [situationId]: [play, ...] }, defense: {...} }`.
   Situation ids must come from `src/data/situations.js`; every `playId` must
   exist in the shipped catalog for that game.
3. **Register it** in the `GAME_PLANS` array in `src/data/gameplans.js`.
4. **Write the guide** — `docs/<team>-gameplan.md` (source of truth) plus a
   self-contained `docs/<team>-gameplan.html`, then copy the HTML to
   `public/gameplan-<team>.html` (Tweaks links to it via
   `import.meta.env.BASE_URL + plan.guide`). The two copies are byte-identical
   today; keep them that way.
5. **`npm test`** — `gameplans.test.js` catches every typo'd play id, unknown
   situation block, and missing note. Then `npm run lint`.
6. **Commit and push** — Pages deploys `main` automatically.

> `public/gameplan.html` is a stale, superseded Ole Miss guide that nothing links
> to. Leave it alone or delete it deliberately — it is not current.

---

## Adding a team role sheet [PERS]

The Personnel Lab's sibling procedure to `[PLAN]`. Also manual.

1. **Research the roster** — EA's official ratings site is the source of truth
   for Madden 27 launch ratings; maddenratings.com carries the sub-attributes.
2. **Write** `src/data/personnel-<team>.js` exporting one object with
   `{ id, game, team, teamOvr, doctrine: {offense, defense, honest}, roles[],
   buildOrder[], inGame[] }`.
3. **Register** it in `PERSONNEL_PLANS` (`src/data/personnelPlans.js`).
4. **`npm test`** — `personnel.test.js` enforces the vocabulary (every rating
   cited must exist in `RATING_GLOSSARY`), the sourcing (`conf` on every
   claim), and the football facts listed under `[DATA-00006]`.

**Sourcing rule.** Every rating claim, build step and in-game read carries a
`conf` tag: `ea` (first-party M27) · `m27` (M27, credible non-EA) · `m26`
(carryover, untested this year) · `stale` (real lab test, old Madden) · `read`
(inference). Madden 27 shipped 2026-08-13 and there is **no settled
competitive consensus yet** — MUT.GG's own ability tier list still reads
"Unrated." Do not launder an M26 rumour as an M27 fact, and do not ship any
Speed threshold at CB or WR: the numbers circulating trace to AI content farms
with no source.

---

## Refreshing data [REFRESH]

**Play catalogs** — `public/data/playbooks.json` (Madden 27: 86 books, ~37.8k
plays, scraped 2026-08-07 from huddle.gg) and `playbooks-cfb27.json` (CFB 27:
180 books, ~74.8k plays, scraped 2026-07-29 from cfb.fan):

```bash
cd tools/scraper
./venv/bin/python scrape_madden27.py      # or scrape_cfb.py
# both resumable (output/progress-*.json); --only slug1,slug2 for subsets
cp output/playbooks-madden27.json ../../public/data/playbooks.json
```

CFB play ids carry a `cfb27:` prefix so generic books can't collide with Madden
ids on a saved sheet. CFB 27 ships **no team defensive playbooks** — only
schemes — so PlayBank relabels its category toggle "Base Schemes / Variants".

**Trends digest** (`public/data/trends.json`) is hand-curated: update
`updatedAt`, keep each trend's `category` in
`offense | defense | mechanic | patch | exploit | team`, then `npm test`.

---

## Task Management [TASK]

**[TASK-00001]** Use task tracking for multi-step work.
**[TASK-00002]** Commit format: `"Fix: [Description] (Task: <id>)"` (or `Add:`).
> TRIGGER: When starting complex tasks

---

## Context Management [CTX]

**[CTX-00001]** Working map + gotchas: `.claude/memory/active/quick-reference.md`
**[CTX-00002]** Architecture: `.claude/architecture/layer-stack.md`
**[CTX-00003]** Friction log: `.claude/pain-points/active-pain-points.md`
**[CTX-00004]** `AGENTS.md` exists only to point Antigravity at this file. Don't
duplicate rules into it.
> TRIGGER: When looking for patterns

---

## Important Reminders

1. Do what is asked; nothing more, nothing less.
2. Read the code before changing it — this app has drifted from its docs before.
3. Parallelize independent work.
4. Check `quick-reference.md` before any task.
5. `npm run lint` before commit; `npm test` before any deploy.
