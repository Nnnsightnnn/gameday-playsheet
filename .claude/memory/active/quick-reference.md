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

## Common Commands

```bash
npm run dev      # Start dev server (port 5173)
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

## Guard Rails Quick Check

- [ ] **[VERIFY-00001]** Read code before changes
- [ ] **[FILE-00001]** Keep root clean
- [ ] **[EXEC-00001]** Parallelize operations
- [ ] Run `npm run lint` before commits

---

**Last Updated**: 2025-12-25
**Pattern Count**: 8
**Next Review**: 2026-01-01
