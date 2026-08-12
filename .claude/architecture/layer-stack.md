# Architecture Layer Stack

## Gameday Playsheet — Architectural Overview

A client-only React SPA. No server, no auth, no network at runtime except two
things: static JSON fetched from the same origin, and an optional user-keyed
YouTube search in the Trends board.

**Verified against the code 2026-08-12.**

The organizing idea: **every view is a thin presentational shell over a pure
engine.** The football logic (coverage rules, formation recognition, alignment,
legality, skill math) lives in `src/lib/` with no React imports, which is what
makes 243 tests possible in ~300ms with no DOM.

---

## Layer Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 5: ENTRY                                                      │
│  index.html → src/main.jsx (createRoot, StrictMode, imports CSS)     │
└──────────────────────────────────────────────────────────────────────┘
                                  │
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 4: SHELL                                                      │
│  src/App.jsx — view switch · side toggle · game toggle · plan load   │
│                · toasts · CSS custom-property theming                │
└──────────────────────────────────────────────────────────────────────┘
        │            │             │             │            │
┌───────▼──────┬─────▼───────┬─────▼───────┬─────▼──────┬─────▼───────┐
│ LAYER 3: VIEWS (presentational — no football logic)                 │
│ laminated/   │ planner/    │ coverage/   │ trends/    │ skills/     │
│ Sheet        │ Formation-  │ CoverageLab │ Trends-    │ SkillsLab   │
│ SetupSheet   │  Planner    │ CoverageF.  │  Board     │             │
│ PlayBank     │ FieldBoard  │ LessonMode  │            │             │
│ Coordinator  │ PlayerToken │ Glossary-   │            │             │
│ TweaksPanel  │ Validation- │  Panel      │            │             │
│ Toast        │  Panel      │ Assignment- │            │             │
│              │ Discovery-  │  Sheet      │            │             │
│              │  Panel      │ Briefing    │            │             │
└──────────────┴─────────────┴─────────────┴────────────┴─────────────┘
        │            │             │
┌───────▼────────────▼─────────────▼──────────────────────────────────┐
│  LAYER 2: PURE ENGINES (src/lib/ — zero React, fully unit-tested)   │
│  coverage/  coverages · engine · formations · concepts · routes     │
│             lessons · glossary · differences · labField · labConfig │
│  field/     fieldConfig · formationFactory · featureExtraction      │
│             matchingEngine · gapAlignment · rulesEngine             │
│  hooks/     useFormationEditor · usePointerDrag  (React, but pure   │
│             state machines over the engines)                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────┐
│  LAYER 1: DATA                                                      │
│  src/lib/db.js         Dexie v8 — schema + all persistence helpers  │
│  src/data/             situations · seed · skills ·                 │
│                        gameplans{,-iowa,-falcons}                   │
│  public/data/*.json    playbooks(.json/-cfb27) · formation-library  │
│                        · trends                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────┐
│  LAYER 0: BUILD & OFFLINE PIPELINE                                  │
│  vite.config.js (base=/gameday-playsheet/) · eslint.config.js       │
│  package.json · .github/workflows/pages.yml · scripts/dev.sh        │
│  tools/scraper/*.py  (offline: web → public/data/*.json)            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data flow

**Read path.** `App.jsx` opens five live queries against Dexie (settings,
context, sheet, checks, saved sheets) and lazy-fetches the play catalog for the
selected game into React state (`playbookCache`). Views receive plain props.

**Write path.** A view calls a handler in `App.jsx` → a helper in `db.js` →
IndexedDB → the live query re-fires → re-render. Nothing writes to Dexie
directly from a component, and nothing writes from inside a `useLiveQuery`
querier (Dexie forbids it).

**Offline path.** Python scrapers hit huddle.gg / cfb.fan, write
`tools/scraper/output/*.json`, and those files are copied into `public/data/`.
That happens on Kenny's machine, never at runtime.

```
scraper (offline) → public/data/*.json → fetch → App state → view
user action → App handler → db.js → IndexedDB → useLiveQuery → view
```

---

## Module map

### Layer 0 — Build & pipeline
| File | Purpose |
|---|---|
| `vite.config.js` | React + Tailwind plugins; `base: '/gameday-playsheet/'` |
| `eslint.config.js` | Flat config, React hooks + refresh rules |
| `.github/workflows/pages.yml` | push to `main` → `npm ci` → build → deploy-pages |
| `scripts/dev.sh` | background vite (`.dev.pid`) |
| `tools/scraper/scrape_madden27.py` | Madden 27 catalog (resumable, `--only`) |
| `tools/scraper/scrape_cfb.py` | CFB 27 catalog (resumable, `--only`) |
| `tools/scraper/scrape_huddle.py`, `scrape_falcons.py`, `scrape_subset.py`, `test_scrape.py` | earlier-generation scrapers, kept for reference |

### Layer 1 — Data
| File | Purpose |
|---|---|
| `src/lib/db.js` | Dexie v8; helpers for settings, context, sheet, plans, backups, saved sheets, setup checks, formations, skill assessments |
| `src/data/situations.js` | 12 offensive + 10 defensive situation blocks with `match(ctx)` |
| `src/data/gameplans.js` | `OLE_MISS_PLAN` + `GAME_PLANS` registry |
| `src/data/gameplans-iowa.js`, `-falcons.js` | Iowa (CFB 27), Falcons (Madden 27) |
| `src/data/seed.js` | first-run Madden sheet seed |
| `src/data/skills.js` | 6 categories / 31 skills + rating math |
| `public/data/playbooks.json` | Madden 27 — 86 books, ~37.8k plays |
| `public/data/playbooks-cfb27.json` | CFB 27 — 180 books, ~74.8k plays |
| `public/data/formation-library.json` | 32 named formations with feature signatures |
| `public/data/trends.json` | curated meta digest, per game |

### Layer 2 — Pure engines
| File | Exports / role |
|---|---|
| `coverage/coverages.js` | `COVERAGES` (15), `FAMILIES` |
| `coverage/engine.js` | `makeContext` → `buildDefense` → `defenderAt(t)` |
| `coverage/formations.js`, `concepts.js`, `routes.js` | pictures, 8 concepts, route shapes + classification |
| `coverage/lessons.js` | 4 modules / 14 lessons, `ALL_LESSONS`, `lessonById`, `missKey` |
| `coverage/glossary.js` | `GLOSSARY`, `GLOSSARY_BY_TERM` |
| `coverage/differences.js` | `differenceFor(a, b)` |
| `coverage/labField.js`, `labConfig.js` | board geometry; `DEFAULT_LAB`, `LEGEND`, `SNAP_MS` |
| `field/fieldConfig.js` | normalized coordinate system, `toField`, `snapPoint`, eligibility |
| `field/formationFactory.js` | `defaultFormation`, `starterFormations` |
| `field/featureExtraction.js` | `classifyFormation` — geometry leads, labels follow |
| `field/matchingEngine.js` | `matchLibrary` — weighted graded scoring |
| `field/gapAlignment.js` | `alignFront` — technique numbers → gaps |
| `field/rulesEngine.js` | `validateFormation` — NFL/NCAA legality |

### Layer 3 — Views
See `.claude/memory/active/quick-reference.md` for the per-view working map.

### Layer 4/5 — Shell & entry
`src/App.jsx` (437 lines) and `src/main.jsx`. `src/index.css` (2147 lines) is
imported once by `main.jsx` and styles the entire app.

---

## Database Schema (Dexie v8)

```javascript
sheetSettings   'settings'      { team, side, game, view, sheetMode,
                                  tweaks{paper[4], accent, density, gloss},
                                  coverageLab{...}, trends{ytKey} }
sheetAssignments 'sheet'        { byGame: { madden:{offense,defense}, cfb:{...} } }
gameContext     'current'       { down, distance, fieldSide, yardLine }
setupChecks     'checks'        { byGame[game][side][playId]: true }
callSheets      cs_* | backup_<game>
                                { name, game, offense, defense, createdAt, updatedAt }
formations      fm_*            { name, side, ruleset, ballSpot, players[11],
                                  derived, linkedPlayIds, createdAt, updatedAt }
skillAssessments sa_*           { createdAt, ratings{skillId:1-5}, note }
myPlays / gameSessions / playPerformance   ++id   ← legacy, unused by current views
```

Migration rule: each `db.version(N)` block restates **every** table. v4 added the
call sheet, v5 the planner, v6 setup checks, v7 saved sheets, v8 skill
assessments. Never edit a shipped version block.

---

## Key architectural insights

1. **Client-side only.** All user data is IndexedDB; a cleared browser is a
   wiped app. Saved call sheets and the rolling `backup_<game>` row are the only
   safety net.
2. **Engines before pixels.** Football logic is pure and tested; components just
   draw. New features should follow that split or they become untestable.
3. **Two games, one app.** Every user-scoped structure is keyed by `game` —
   sheets, setup checks, catalogs, skills filtering.
4. **Curated content is code.** Game plans are JS modules validated by tests
   against the scraped catalog, so a bad play id fails CI-style at `npm test`
   rather than silently rendering a dead call.
5. **Hand-written CSS, not Tailwind.** 2147 lines in one sectioned file, themed
   through CSS custom properties so the Tweaks panel can recolor the sheet live.
6. **Destructive actions are guarded.** Plan loads confirm, back up, then apply.

---

*Rewritten from the source 2026-08-12 (previous version described a 2025 app
that no longer exists).*
