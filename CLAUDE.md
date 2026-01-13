# Claude Context Specification

Gameday Playsheet - Football play management application.

## Tech Stack

**JavaScript** • **React 19** • **Vite 7.2.7** • **Tailwind CSS 4** • **Dexie (IndexedDB)**

## Project Structure

```
/src/           - React application source
  /components/  - UI components (PlaybookBrowser, MyPlaysheet)
  /lib/         - Database layer (db.js - Dexie)
  /data/        - Playbook utilities
  /hooks/       - Custom hooks
/scraper/       - Python web scrapers (huddle.gg)
/public/data/   - Static playbook JSON
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

**[DATA-00002]** Database tables: `myPlays`, `gameSessions`, `playPerformance`
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
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview build
```

---

## Important Reminders

1. Do what is asked; nothing more, nothing less
2. Verify assumptions before acting
3. Parallelize independent work
4. Check quick-reference.md before any task
5. Run `npm run lint` before committing
