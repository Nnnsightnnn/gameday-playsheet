<!-- Rewritten 2026-09-03: plain reasoned rules, under 200 lines. Procedures
     and section-specific rules moved to .claude/rules/ with paths: scoping.
     Previous version: ~/.claude/backups/claude-md-2026-09-03/ -->
# Gameday Playsheet

Single-page, offline-first study lab for Kenny's Madden 27 and CFB 27 game
planning. No backend, no accounts: static JSON in `public/data/` plus
IndexedDB in the browser. Live at https://nnnsightnnn.github.io/gameday-playsheet/

This repo is the lab for Kenny's goal of elite Madden and CFB play, coached as
deliberate practice: one concept installed per week, tested in a game,
reviewed in the daily note. Current teams: Ole Miss (CFB 27) and the Falcons
(Madden 27, a nickel 4-2-5 team with a five-man odd front as a package; the
launch roster does not support a personnel-first 3-4, see
`src/data/personnel-falcons.js`). The instrument is only useful if results get
logged, so if work here keeps adding lenses without a debrief being recorded,
say so.

**Stack:** JavaScript (not TypeScript), React 19, Vite 7, Dexie 4
(IndexedDB), Vitest, hand-written CSS. Tailwind 4 is installed and imported at
the top of `src/index.css` but no component uses a utility class; `@dnd-kit`
is in `package.json` but unused (dragging is `src/hooks/usePointerDrag.js`).
Don't reach for either.

## Gates and commands

```bash
npm run dev                   # vite, port 5173
npm test                      # vitest, ~640 tests in well under a second
npm run lint                  # eslint, before every commit
npm run build                 # to /dist
./scripts/dev.sh start|stop   # background dev server (writes .dev.pid)
npm run chat                  # local Claude chat server, 127.0.0.1:5199, key via withapi
```

`npm test` gates any change to the coverage engine, the field engine, the
skill taxonomy, `trends.json`, or a curated plan, because those tests assert
football facts, not rendering. `npm run lint` before commit. Push to `main`
deploys automatically via `.github/workflows/pages.yml`. Vite `base` is
`/gameday-playsheet/`, so build runtime asset URLs with
`import.meta.env.BASE_URL`, never a leading `/`. Commit format:
`Fix: <description>` or `Add: <description>`.

Read the code before changing it; this app has drifted from its docs before,
and the docs, not the code, were wrong each time.

## How the app is put together

`App.jsx` is the whole shell: a coordinator header, a view switch, an
offense/defense toggle, and a Tweaks panel. All persistent state lives in
Dexie and is read with `useLiveQuery`; `settings.view` picks the view.

| `settings.view` | Component | What it is |
|---|---|---|
| `sheet` | `laminated/Sheet`, `laminated/SetupSheet` | The laminated call sheet: plays grouped into situation blocks that light up from live down/distance/spot. `settings.sheetMode` swaps By Situation for By Formation (walking the in-game favorites menu against a checklist). |
| `planner` | `planner/FormationPlanner` | Drag 11 tokens on a field; the app names the formation, reads DL techniques and gap responsibility, validates against NFL/NCAA rules. |
| `coverage` | `coverage/CoverageLab` | Defense-only: animate a coverage vs a route concept, compare two coverages, a 14-lesson Learn track with quizzes and a miss drill, glossary. |
| `trends` | `trends/TrendsBoard` | Curated meta digest from `public/data/trends.json`, plus optional live YouTube search with Kenny's own API key. |
| `skills` | `skills/SkillsLab` | Debrief lens (default): two-minute post-game diagnosis ranking recent leaks into a focus and emitting the Vault log line. Gaps, Plan, Assess, Progress lenses against a 31-skill elite taxonomy. |
| `personnel` | `personnel/PersonnelLab` | Who fills each of 24 scheme roles per team: ratings that do the job, trap ratings, current holder graded fit/stretch/hole, build order, in-game reads. |
| `packages` | `packages/PackageForge` | Custom adjustment packages (M27 macros, 20 built / 10 active per side): one call + an adjustment stack that shows one picture and plays another, aimed at a named meta threat. Pure engine in `src/lib/packages/` (vocab with conf tags, meta threats, disguise score, soundness checks, menu-ordered macro recipe, arsenal caps). Curated packages in `src/data/packages-*.js` (test-enforced: real plays, twins share the base formation, zero engine errors); Kenny's own in Dexie `macroPackages` + `macroArsenal`. |
| `scouting` | `scouting/ScoutingRoom` | Advance scout for all 31 opponents: `public/data/scouting/<ABBR>.json` = script-built `facts` (roster ratings, unit ranks, matchup edges vs the Falcons) + agent-written `report` (attack/defend forks, live tells). Pipeline: `tools/scraper/scrape_rosters.py` -> `scripts/scouting/build.mjs facts|index|brief` -> opponent-scout skill (`docs/scouting/opponent-scout-SKILL.md`) -> `scripts/scouting/validate.mjs`. |

Offense/Defense tabs are hidden on `coverage`, `trends`, `skills`,
`personnel`, `scouting`, and `packages`. `settings.game` is `'madden' | 'cfb'`; the play catalog is
lazy-fetched per game and the call sheet is stored per game so the two never
clobber each other.

```
src/
  App.jsx            shell
  index.css          all styling, hand-written, banner-comment sections
  components/        laminated/ planner/ coverage/ trends/ skills/ personnel/ packages/
  lib/
    db.js            Dexie schema (currently v14) and every persistence helper
    coverage/        pure engine (coverages, engine, formations, concepts, lessons, glossary)
    field/           pure engine (formationFactory, featureExtraction, matchingEngine, rulesEngine)
    personnel/       pure engine (roleModel)
    skills/          debrief ranking
    packages/        pure engine (vocab, metas, engine)
  data/              situations, seed, skills, gameplans-*, personnel-*, personnelPlans
  hooks/             useFormationEditor, usePointerDrag
public/data/         playbooks.json (M27), playbooks-cfb27.json, formation-library.json, trends.json
public/gameplan-*.html   team guides served on Pages, byte-identical to docs/
docs/                per-team guides (.md source + .html)
tools/scraper/       Python scrapers (huddle.gg, cfb.fan)
```

A new view goes in `src/components/<feature>/` and its pure logic in
`src/lib/<feature>/`. Components stay presentational; the engines are testable
precisely because there is no React in them. Split files over ~300 lines
except data tables (`coverages.js`, `lessons.js`).

## Claude chat

The one exception to "no backend": `server/chat-server.mjs` runs only on Kenny's
Mac and holds the API key, so nothing secret reaches the deployed site. The
panel ships on the live site because his sheet lives in that origin's IndexedDB;
it appears only after opting in with `?chat` and only while the server answers,
because probing localhost triggers a browser permission prompt other visitors
shouldn't see. The browser keeps the history and runs the tools
(`src/lib/chat/`). The server serves `.md` research from `reports/`,
`research_notes/` and `docs/` so private files never get bundled, and fetches Madden play art from huddle.gg one
play at a time into gitignored `.play-art/`. cfb.fan refuses it, so CFB art is by
pasted screenshot. Clips become frames in `src/lib/chat/media.js`. `change_sheet` writes the real sheet immediately and validates
against the catalog first; every change gets an Undo, newest first. History stays
append-only because the API invalidates thinking blocks on edited turns. Desktop launcher: `scripts/chat-start.sh`.

## Components and data

React 19 function components with hooks. Default exports for components
(matches every existing file), named exports for lib functions. Read the
database with `useLiveQuery` from `dexie-react-hooks`, and never write inside
a querier, because Dexie forbids a readwrite transaction there; seeding
belongs in a `useEffect` at app start (`ensureSheetAssignmentsSeeded`,
`ensureFormationsSeeded`, both idempotent).

All IndexedDB access goes through the helpers in `src/lib/db.js`; components
never touch `db.<table>` directly. Adding a table means a new
`db.version(N).stores({...})` block that lists every table, and never editing
an existing version block, because Dexie migrations replay in order.

Sheet assignments are stored per game
(`{ id: 'sheet', byGame: { madden: {offense, defense}, cfb: {...} } }`);
legacy flat rows migrate through `migrateSheetRow`. Loading a plan is
destructive, so keep the guard order: confirm dialog, then
`backupCurrentSheet(game, reason)` (one rolling `backup_<game>` row), then
`applyGamePlan(game, plan, side)`. A saved call sheet has the same shape as a
curated plan, so `applyGamePlan` loads either unchanged. Each sheet play has
two note fields: `note` is the plan's coaching note (replaced on plan load)
and `myNote` is Kenny's own (deleted, not blanked, when cleared). Don't merge
them.

Static data contracts are test-enforced: `trends.json`, `skills.js`, curated
plans (every `playId` must exist in the shipped catalog), and team role
sheets, which assert Madden 27 football facts (no retired position codes
LE/RE/LOLB/MLB/ROLB, Hit Power never core, Speed never core at CB/FS/SS,
CIT+SPC ahead of raw CTH, Play Action tagged as a trap).

## Styling

All styling lives in `src/index.css` as hand-written classes (`.stage`,
`.view-tab`, `.cvlab__main`, `.skl-*`), organized in banner-comment sections
per view; add new rules inside the matching section. Theme is CSS custom
properties set on `.stage` from `settings.tweaks` (`--paper`, `--ink`,
`--accent`, ...); read those variables rather than hard-coding colors or the
Tweaks panel stops working. Situation-block colors are data on each block in
`src/data/situations.js`, not CSS.

## Recurring procedures

Installing a game plan, adding a team role sheet, and refreshing the play
catalogs or trends digest are written procedures in
`.claude/rules/procedures.md`, which loads when you touch `src/data/`,
`docs/`, `public/data/`, or `tools/scraper/`. The Cowork `team-gameplan` and
`trends-refresh` skills wrap the same steps; they are not part of this repo.
`AGENTS.md` only points other agents at this file; don't duplicate rules into
it. Working map and gotchas that don't fit here:
`.claude/memory/active/quick-reference.md`.
