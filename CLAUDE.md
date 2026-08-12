<!-- Last verified: 2026-08-10 -->
# Claude Context Specification

Gameday Playsheet - Football play management application.

## Purpose & workflow (updated 2026-08-10)

This repo is the **lab for Kenny's life-goal #3: elite Madden 27 + CFB 27 play,
coached as deliberate practice** (decided 2026-08-10, replacing the retired AI
curriculum). Game plans are usually installed via the **`team-gameplan` skill**:
research the team's meta → curated call sheet + coaching guide (`docs/` +
`public/`) → tests pass → deploy live. Current focus: **Ole Miss (CFB 27)**
(offensive install done 8/04, defensive in progress) + **Madden 27** (Falcons,
started 8/06). Weekly cadence: **one concept installed, tested in a game,
reviewed in the daily note** — starting with roll coverage (see Coverage Lab,
`src/components/coverage/`).

## Tech Stack

**JavaScript** • **React 19** • **Vite 7.2.7** • **Tailwind CSS 4** • **Dexie (IndexedDB)**

## Project Structure

```
/src/           - React application source
  /components/  - UI components, grouped by feature:
    /laminated/ - call sheet (Sheet, Coordinator, PlayBank, SetupSheet)
    /coverage/  - Coverage Lab (field sim, Learn mode, glossary)
    /planner/   - Formation planner (field board, formation library)
    /trends/    - Trends board (curated meta digest + optional live YouTube search)
    /skills/    - Skills Lab (elite-skill self-assessment: Assess/Gaps/Progress)
  /lib/         - Database layer (db.js - Dexie)
  /data/        - Playbook utilities
  /hooks/       - Custom hooks
/tools/scraper/ - Python web scrapers (huddle.gg)
/scripts/       - Dev helper scripts (dev.sh)
/public/data/   - Static JSON (playbooks.json, playbooks-cfb27.json, formation-library.json)
/docs/          - Per-team game plans (olemiss, iowa, falcons: .html + .md) + coverage-lab-standalone
/.claude/       - Context system
```

---

## Critical Guard Rails

### Memory Check (REQUIRED)
**ALWAYS check first:** `.claude/memory/active/quick-reference.md`
> TRIGGER: Before starting any task

### File Organization [FILE]
**[FILE-00001]** Keep root clean. Organize by type.
> TRIGGER: When creating new files

### Verification [VERIFY]
**[VERIFY-00001]** Read code before recommending changes
> TRIGGER: Before proposing ANY changes

### Execution [EXEC]
**[EXEC-00001]** Parallelize independent operations
> TRIGGER: Before making tool calls

---

## Build & Development [BUILD]

**[BUILD-00001]** Always run `npm run lint` before commits
> TRIGGER: Before git commit

**[BUILD-00002]** Use Vite dev server (default port 5173)
> TRIGGER: When starting development

**[BUILD-00003]** Production builds output to `/dist` only
> TRIGGER: Before running `npm run build`

---

## Component Architecture [COMP]

**[COMP-00001]** Use React 19 functional components with hooks
> TRIGGER: When creating new components

**[COMP-00002]** Use `useLiveQuery` from dexie-react-hooks for database reads
> TRIGGER: When reading from IndexedDB

**[COMP-00003]** Destructure props; uppercase naming for components
> TRIGGER: When defining components in /src/components/

---

## Data Persistence [DATA]

**[DATA-00001]** Use Dexie helpers from `src/lib/db.js` for all IndexedDB operations
> TRIGGER: When persisting client-side data

**[DATA-00002]** Database tables (schema v8): `myPlays`, `gameSessions`, `playPerformance`, `gameContext`, `sheetAssignments`, `sheetSettings`, `formations`, `setupChecks`, `callSheets`, `skillAssessments`
**[DATA-00004]** Trends digest lives in `public/data/trends.json` (shape enforced by `src/data/__tests__/trends.test.js`); refreshed via the `trends-refresh` skill. Skill taxonomy lives in `src/data/skills.js`.
**[DATA-00003]** Sheet assignments are stored per game (`byGame: { madden, cfb }`) so the Madden and CFB sheets never clobber each other
> TRIGGER: When working with stored data

---

## Styling [STYLE]

**[STYLE-00001]** Use Tailwind CSS for all styling (no custom CSS)
> TRIGGER: When adding new styles

**[STYLE-00002]** Dark theme: gray-900 bg, green-600 primary, blue-600 offense, red-600 defense
> TRIGGER: When applying colors

---

## Task Management [TASK]

**[TASK-00001]** Use task tracking for multi-step work
**[TASK-00002]** Commit format: `"Fix: [Description] (Task: <id>)"`
> TRIGGER: When starting complex tasks

---

## Context Management [CTX]

**[CTX-00001]** Memory: `.claude/memory/active/`
**[CTX-00002]** Search: quick-reference -> structured -> docs
**[CTX-00003]** Architecture: `.claude/architecture/layer-stack.md`
> TRIGGER: When looking for patterns

---

## Pain Points [PAIN]

**[PAIN-00001]** Track friction: `.claude/pain-points/active-pain-points.md`
> TRIGGER: When encountering blockers

---

## Quick Reference

| Resource | Path |
|----------|------|
| Memory | `.claude/memory/active/quick-reference.md` |
| Architecture | `.claude/architecture/layer-stack.md` |
| Pain Points | `.claude/pain-points/active-pain-points.md` |
| Database | `src/lib/db.js` |

**Commands**: `/focus`, `/investigate`, `/brainstorm-design`, `/plan-as-group`, `/bootstrap-project`

---

## npm Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Run ESLint
npm run test       # Vitest (run once) — required before any game-plan deploy
npm run test:watch # Vitest watch mode
npm run preview    # Preview build
```

---

## Important Reminders

1. Do what is asked; nothing more, nothing less
2. Verify assumptions before acting
3. Parallelize independent work
4. Check quick-reference.md before any task
5. Run `npm run lint` before committing
