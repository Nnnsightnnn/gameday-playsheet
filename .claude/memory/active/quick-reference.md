# Quick Reference

The working map for Gameday Playsheet. Check this FIRST, then `CLAUDE.md` for
the rules. **Verified against the code 2026-08-12.**

---

## Shape of the thing

One React SPA, no backend. Static JSON in `public/data/` is the read-only
catalog; Dexie/IndexedDB holds everything Kenny creates. Five views behind one
switch in `App.jsx`, each backed by a **pure engine in `src/lib/`** that has no
React in it — that separation is why the football logic is testable.

```
public/data/*.json ──fetch──┐
                            ├─→ App.jsx ─→ view component ─→ pure engine (src/lib/)
IndexedDB ──useLiveQuery────┘        │
                                     └─→ db.js helper ─→ IndexedDB ─→ (live re-render)
```

---

## Critical Files

| File | Lines | Why it matters |
|---|---|---|
| `src/App.jsx` | 437 | The whole shell. View switch, side/game toggles, plan loading, toasts, theme vars. |
| `src/lib/db.js` | 427 | Dexie schema v8 + every persistence helper. Central hub. |
| `src/index.css` | 2147 | **All** styling, hand-written, sectioned by view. |
| `src/data/situations.js` | 43 | The situation blocks (ids, colors, `match(ctx)` predicates). Ids are the keys of every game plan. |
| `src/data/gameplans.js` | 187 | `GAME_PLANS` = [Ole Miss, Iowa, Falcons]; also the CFB seed. |
| `src/lib/coverage/coverages.js` | 709 | 15 coverages: rules, checks, stress points. |
| `src/lib/coverage/lessons.js` | 603 | Learn track — 4 modules / 14 lessons. |
| `src/data/skills.js` | 369 | 31-skill elite taxonomy + rating math. |

---

## Views: where to work

### 1. Call Sheet — `src/components/laminated/`
`Sheet` (By Situation) and `SetupSheet` (By Formation) render the same
assignments two ways; `PlayBank` is the drawer you add plays from; `Coordinator`
is the down/distance/spot header; `TweaksPanel` is the settings drawer.

- Live highlight: `SITUATIONS[side].filter(s => s.match?.(ctx))` in `App.jsx`.
- `PlayBank` drills playbook → formation group → formation → plays, or searches
  (min 2 chars, 40-result cap). It also owns the Madden/CFB game toggle.
- `TweaksPanel` sections: Material · Team accent · Game plans (with per-plan
  Guide links and O / D / Load side scoping) · My call sheets · Layout.
- `SetupSheet` exists because in-game favorites sort newest-first: it numbers
  the plays in reverse priority with a persistent per-play checklist so the
  in-game menu comes out matching the sheet.

### 2. Formation Planner — `src/components/planner/` + `src/lib/field/`
Drag 11 tokens; the app tells you what you just drew.

| File | Role |
|---|---|
| `fieldConfig.js` | Coordinate system. `x ∈ [0,1]` sideline→sideline, `y` = signed depth from LOS in units of 15 yds. Saved formations are resolution-free; board units only at render. |
| `formationFactory.js` | Default 11-man layouts + starter formations (seeded once). |
| `featureExtraction.js` | **Geometry leads, labels follow** — classifies from *relative* depth/spacing, so dragging the whole set doesn't flip the name. |
| `matchingEngine.js` | Scores extracted features against `public/data/formation-library.json` (32 entries) with weighted, graded partial credit. |
| `gapAlignment.js` | DL technique numbers (0/1/2i/2/3/…) → gap responsibility, read against the real O-line when present. |
| `rulesEngine.js` | NFL/NCAA legality: `validateFormation()` → `{valid, errors, warnings, byPlayer}`. |

Drag is `src/hooks/usePointerDrag.js` (6px tap-vs-drag threshold); working state
is `useFormationEditor.js`.

### 3. Coverage Lab — `src/components/coverage/` + `src/lib/coverage/`
Defense-only. Modes: **Study** (one coverage), **Compare** (two side by side),
**Learn** (curriculum). Glossary panel is searchable.

| File | Role |
|---|---|
| `coverages.js` | 15 coverages: `build(ctx)` → defenders, rules, CFB 27 checks, stress points. |
| `engine.js` | `makeContext` → `buildDefense` → `defenderAt(t)`. |
| `formations.js` / `concepts.js` / `routes.js` | Offensive pictures, 8 route concepts, route shapes + VERT/OUT/IN/SHORT classification. |
| `differences.js` | Head-to-head "the one difference" writeups. |
| `labField.js` / `labConfig.js` | Board geometry; shared constants (`DEFAULT_LAB`, `SNAP_MS`, `LEGEND`) kept separate so Fast Refresh stays happy. |

Persisted lab state is `settings.coverageLab`: `{coverage, compareWith,
formation, concept, mode, learnView, ruleset, ballSpot, flip, learn:{current,
done, misses}}`.

- **Adding a coverage:** add to `COVERAGES` with `build(ctx)`, list it in
  `FAMILIES`, add pairings to `differences.js`. `build` must return ≥6 defenders
  with unique labels and rules ≥25 chars — tests enforce it.
- **The invariant that matters:** two coverages diverge only where the football
  says they do. `engine.test.js` asserts e.g. Palms ≡ Quarters vs 4 Verticals but
  differs on both DBs vs Curl–Flat.
- **Learn mode:** lesson setups use `view: 'study'|'compare'` — **not** `mode`,
  which would exit learn mode. Missed quiz questions queue a drill; miss keys are
  `lessonId:qIdx`.
- `docs/coverage-lab-standalone.html` is a self-contained reference copy, **not
  kept in sync** with the React version.

### 4. Trends Board — `src/components/trends/TrendsBoard.jsx`
Fetches `public/data/trends.json` (`{updatedAt, games: {madden, cfb}}`; each game
has `{label, patchNote, trends[]}`). Tabs per game, filter chips per category.

Optional live YouTube panel: Kenny pastes his own API key, stored in
`settings.trends.ytKey`, and the component calls the YouTube Data API v3 search
endpoint directly from the browser. No key is committed — don't add one.

### 6. Personnel Lab — `src/components/personnel/` + `src/lib/personnel/`
Answers "what does each individual do inside my scheme." Team role sheets are
static data (`src/data/personnel-<team>.js`); only Kenny's 1–5 knowledge
rating, his starter override, and his note persist (`personnelCharts`, keyed
`<game>:<planId>`).

| Piece | Role |
|---|---|
| `data/personnel.js` | Shared vocabulary — `CONFIDENCE`, `RATING_GLOSSARY`, `M27_POSITIONS`, `POSITION_MIGRATION`, `KNOW_ANCHORS`. |
| `data/personnel-falcons.js` | 24 roles + 7-step `buildOrder` + 14 `inGame` reads. |
| `data/personnelPlans.js` | Registry — `PERSONNEL_PLANS`, `plansForGame`, `planById`. |
| `lib/personnel/roleModel.js` | Pure engine: `rolesForSide`, `gradeSummary`, `rosterHoles`, `knowledgeGaps`, `focusRole`, `readsByPhase`, `trapDigest`. |

- Four modes: **Roles · Build · In-Game · Gaps**. Own side filter, so the
  global offense/defense tabs are hidden.
- `focusRole` ties break toward the **worse roster grade** — not knowing a role
  you also can't staff costs the most.
- **Madden 27 killed LE/RE/LOLB/MLB/ROLB.** It is LEDG/REDG/DT/SAM/MIKE/WILL.
  `personnel.test.js` fails the build if a retired code reappears.
- Every claim carries a `conf` tag; the UI renders it as a chip. See `[PERS]`.

### 5. Skills Lab — `src/components/skills/SkillsLab.jsx`
Three modes: **Gaps** (default) · **Assess** · **Progress**. Rates 31 skills
across 6 categories — Pre-Snap Recognition, Passing Execution, Run Game &
Option, User Defense, Scheme & Adjustment, Game Management & Mental — 1–5
against an elite marker; `leverage: true` marks the 7 fastest-moving skills.
Each save writes a **new** `skillAssessments` row — the history *is* the feature,
so never update in place. Math lives in `skills.js`: `categoryAverages`,
`gapList`, `focusSkill`, `skillsForGame`.

---

## Database (Dexie v8)

```javascript
// Reads — always via useLiveQuery
const settings = useLiveQuery(() => getSheetSettings(), [], null)

// Writes — always via a db.js helper, never db.<table> from a component
await saveSheetAssignments(next)
```

| Table | Key | Holds |
|---|---|---|
| `sheetSettings` | `'settings'` | team, side, game, view, sheetMode, tweaks, coverageLab, trends |
| `sheetAssignments` | `'sheet'` | `byGame: { madden: {offense,defense}, cfb: {...} }` |
| `gameContext` | `'current'` | down, distance, fieldSide, yardLine |
| `setupChecks` | `'checks'` | `byGame[game][side][playId] = true` |
| `callSheets` | `cs_*` / `backup_<game>` | saved sheets + rolling pre-load backup |
| `formations` | string id | planner formations (seeded from `starterFormations()`) |
| `skillAssessments` | `sa_*` | dated `{ratings, note}` snapshots |
| `myPlays`, `gameSessions`, `playPerformance` | ++id | legacy from the original app; **not wired into any current view** |

---

## Play catalogs

| Game | File | Books | Plays | Source | Scraper |
|---|---|---|---|---|---|
| Madden 27 | `public/data/playbooks.json` | 86 | ~37.8k | huddle.gg | `tools/scraper/scrape_madden27.py` |
| CFB 27 | `public/data/playbooks-cfb27.json` | 180 | ~74.8k | cfb.fan | `tools/scraper/scrape_cfb.py` |

Shape: `{version, scrapedAt, source, playbooks: [{id, name, type: 'offense'|'defense',
category: 'team'|'alternate', formationGroups: [{name, formations: [{name, slug,
plays: [{id, name, slug, type}]}]}]}]}`.

- Lazy-fetched per `settings.game`, cached in `App.jsx`'s `playbookCache`.
- CFB ids are prefixed `cfb27:` so generic books can't collide with Madden ids.
- CFB 27 has no team defensive playbooks — base schemes are category `team`,
  variants are `alternate`; PlayBank relabels the toggle accordingly.

---

## Tests — 243 across 8 files (`npm test`, ~300ms)

| File | Guards |
|---|---|
| `lib/coverage/__tests__/engine.test.js` | 21 — coverages diverge only where the football says. |
| `lib/coverage/__tests__/lessons.test.js` | 10 — every lesson pinned to real coverages/formations/concepts + the engine facts its text asserts. |
| `lib/coverage/__tests__/glossary.test.js` | 4 — unique terms, real definitions, no dangling "see also". |
| `lib/field/__tests__/recognition.test.js` | 4 — classification survives perturbation. |
| `lib/field/__tests__/gapAlignment.test.js` | 8 — technique/gap reads. |
| `data/__tests__/gameplans.test.js` | Every curated `playId` exists in its catalog, sits in a real situation block, carries a note. |
| `data/__tests__/skills.test.js` | 7 — taxonomy integrity + rating math. |
| `data/__tests__/trends.test.js` | 3 — digest shape and allowed categories. |

---

## Gotchas that have bitten before

1. **No Tailwind utilities.** Tailwind is imported but unused in components.
   Everything is hand-written CSS in `index.css`. Docs claimed otherwise until
   2026-08-12.
2. **`@dnd-kit` is dead weight** — installed, imported nowhere.
3. **No writes inside `useLiveQuery`** — Dexie forbids readwrite transactions in
   a querier. Seed from a `useEffect`.
4. **`import.meta.env.BASE_URL`** on every runtime asset URL; Pages serves from
   `/gameday-playsheet/`.
5. **Never edit an existing `db.version(N)` block** — add a new one listing all
   tables.
6. **`docs/*.html` and `public/gameplan-*.html` are byte-identical copies.**
   Edit the `.md`, regenerate the HTML, copy to both.
7. **`public/gameplan.html` is stale** — a superseded Ole Miss guide nothing
   links to.
8. **`myNote` vs `note`** — Kenny's note vs the plan's coaching note. Loading a
   plan replaces `note` only.
9. **Learn-mode setups use `view`, not `mode`** — using `mode` exits learn mode.
10. **The `team-gameplan` / `trends-refresh` skills don't exist.** Installing a
    plan is the manual `[PLAN]` procedure in `CLAUDE.md`.

---

## Commands

```bash
npm run dev      # port 5173
npm test         # 243 tests — gate before any deploy
npm run lint     # gate before any commit
npm run build    # → /dist
./scripts/dev.sh start|stop
```

Deploy: push to `main` → `.github/workflows/pages.yml` → GitHub Pages.

---

## Naming

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase, default export | `PlayBank.jsx` |
| Lib modules | camelCase, named exports | `matchingEngine.js` |
| CSS classes | block + `__element` + `--modifier` | `.sheetmode__btn--on` |
| Play ids | `game:playbook:formation:play` | `cfb27:ole-miss-off:gun-wide-trips:mesh-spot` |

---

**Last Updated**: 2026-08-12
