# Quick Reference

Top patterns for Gameday Playsheet. Check this FIRST before any task.

---

## Tech Stack Summary

**JavaScript** • **React 19** • **Vite 7.2.7** • **Tailwind CSS 4** • **Dexie (IndexedDB)**

---

## Critical Files

| File | Purpose | Layer |
|------|---------|-------|
| `src/lib/db.js` | Database operations (3 imports) | Data |
| `src/data/playbooks.js` | Playbook utilities | Utilities |
| `src/App.jsx` | Root container, tabs | Interface |
| `src/components/PlaybookBrowser.jsx` | Browse & add plays | Interface |
| `src/components/MyPlaysheet.jsx` | Manage saved plays | Interface |

---

## Component Pattern

```jsx
import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'

function ComponentName({ prop1 }) {
  const [state, setState] = useState(initial)
  const data = useLiveQuery(() => db.myPlays.toArray())

  return (/* Tailwind-styled JSX */)
}

export default ComponentName
```

---

## Database Operations

```javascript
// Add play
await addToMyPlays(playObject)

// Remove play
await removeFromMyPlays(id)

// Update play
await updatePlayNotes(id, { rating: 5, tags: ['favorite'] })

// Live query (auto-updates)
const plays = useLiveQuery(() => db.myPlays.toArray())
```

---

## Directory Structure

```
src/
├── components/     # React components
├── lib/           # Database (db.js)
├── data/          # Playbook utilities
├── hooks/         # Custom hooks (empty)
└── assets/        # Static assets

scraper/           # Python scrapers
public/data/       # Static JSON data
```

---

## Coverage Lab (third view tab)

Defensive coverage study model. Pure engine + presentational components.

| File | Purpose |
|------|---------|
| `src/lib/coverage/coverages.js` | 15 coverages: rules, CFB 27 checks, stress points |
| `src/lib/coverage/engine.js` | `makeContext` → `buildDefense` → `defenderAt(t)` |
| `src/lib/coverage/formations.js` | Offensive pictures, splits derived from ball spot |
| `src/lib/coverage/concepts.js` | 8 route concepts |
| `src/lib/coverage/routes.js` | Route shapes + VERT/OUT/IN/SHORT classification |
| `src/lib/coverage/labField.js` | Board geometry; reuses `fieldConfig` for width + hashes |
| `src/lib/coverage/labConfig.js` | Shared constants (keeps Fast Refresh happy) |
| `src/lib/coverage/differences.js` | Head-to-head "the one difference" writeups |
| `src/components/coverage/` | `CoverageLab`, `CoverageField`, `AssignmentSheet`, `CoverageBriefing` |

**Adding a coverage:** add an entry to `COVERAGES` with `build(ctx)` returning
defenders, list it in `FAMILIES`, and add pairings to `differences.js`.
`build` must return ≥6 defenders with unique labels and rules ≥25 chars — the
tests enforce this.

**The invariant that matters:** two coverages must diverge only where the
football says they do. `src/lib/coverage/__tests__/engine.test.js` asserts e.g.
Palms ≡ Quarters against 4 Verticals but differs on both DBs against Curl–Flat.
Run `npm test` after any rule edit.

**Standalone reference:** `docs/coverage-lab-standalone.html` — self-contained,
opens without the dev server. Not kept in sync with the React version.

---

## Common Commands

```bash
npm run dev      # Start dev server (port 5173)
npm test         # Vitest (engine + field rules)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## Styling Pattern

```jsx
// Conditional Tailwind classes
<button
  className={`px-4 py-2 rounded-lg ${
    isActive
      ? 'bg-green-600 text-white'
      : 'text-gray-400 hover:text-white'
  }`}
>
```

**Color Scheme:**
- Background: `gray-900`, `gray-800`
- Primary: `green-400`, `green-600`
- Offense: `blue-600`
- Defense: `red-600`

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PlaybookBrowser.jsx` |
| Utilities | camelCase | `playbooks.js` |
| Functions | camelCase | `addToMyPlays()` |
| Handlers | handle* | `handleAddPlay()` |
| Booleans | is* | `isPlayInMyPlaysheet` |

---

## Data Flow

```
playbooks.json → loadPlaybookData() → Component state
                                          ↓
User action → db.js function → IndexedDB → useLiveQuery → UI update
```

---

## Playbook Catalogs (two games)

| Game | File | Source | Scraper |
|------|------|--------|---------|
| Madden 26 | `public/data/playbooks.json` | huddle.gg | `tools/scraper/scrape_huddle.py` |
| CFB 27 | `public/data/playbooks-cfb27.json` | cfb.fan | `tools/scraper/scrape_cfb.py` |

- `App.jsx` lazy-fetches per selected game (`settings.game`: `'madden' | 'cfb'`),
  cached in `playbookCache`. Toggle lives in the PlayBank drawer.
- CFB play ids carry a `cfb27-` prefix so generic books (e.g. `pistol-off`)
  can't collide with Madden ids on the saved sheet.
- CFB 27 has **no team defensive playbooks** — only schemes. Base schemes
  (3-2-6/3-3-5/3-4/4-2-5/4-3/multiple) are category `team`, variants are
  `alternate`; PlayBank relabels the toggle "Base Schemes / Variants" there.
- Scraper usage: `./venv/bin/python scrape_cfb.py` (resumable via
  `output/progress-cfb.json`; `--only slug1,slug2` for subsets), then copy
  `output/playbooks-cfb27.json` → `public/data/`.

---

## Guard Rails Quick Check

- [ ] **[VERIFY-00001]** Read code before changes
- [ ] **[FILE-00001]** Keep root clean
- [ ] **[EXEC-00001]** Parallelize operations
- [ ] Run `npm run lint` before commits

---

**Last Updated**: 2025-12-25
**Pattern Count**: 8
**Next Review**: 2026-01-01
