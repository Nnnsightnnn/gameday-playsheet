# Architecture Layer Stack

## Gameday Playsheet - Architectural Overview

A React-based football playsheet management application with client-side IndexedDB persistence.

---

## Layer Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 5: ENTRY POINTS                        │
│  src/main.jsx (React bootstrap)                                 │
│  index.html (DOM target)                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LAYER 4: INTERFACE                            │
│  src/App.jsx (Root container, tab navigation)                   │
│  src/components/PlaybookBrowser.jsx (Play discovery)            │
│  src/components/MyPlaysheet.jsx (Collection management)         │
│    └─ PlayCard (nested)                                         │
│    └─ TagSelector (nested)                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 LAYER 3: BUSINESS LOGIC                         │
│  scraper/scrape_huddle.py (Core scraping logic)                 │
│  scraper/scrape_falcons.py (Specific playbook scraping)         │
│  scraper/scrape_subset.py (Subset scraping for testing)         │
│  scraper/test_scrape.py (Test/validation scripts)               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LAYER 2: DATA LAYER                           │
│  src/lib/db.js (Dexie IndexedDB - myPlays, gameSessions,        │
│                 playPerformance tables)                         │
│  public/data/playbooks.json (Static playbook data)              │
│  scraper/output/*.json (Scraped data files)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 LAYER 1: CORE UTILITIES                         │
│  src/data/playbooks.js (nameToSlug, loadPlaybookData,           │
│                         searchPlays, getAllPlaybooks)           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                LAYER 0: CONFIGURATION                           │
│  package.json (Dependencies, scripts)                           │
│  vite.config.js (Build configuration)                           │
│  eslint.config.js (Linting rules)                               │
│  index.html (HTML template)                                     │
│  .gitignore (Git configuration)                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               EXTERNAL DEPENDENCIES                             │
│  React 19.2.0 • React DOM • Dexie 4.2.1 • dexie-react-hooks    │
│  Tailwind CSS 4.1.17 • Vite 7.2.7 • ESLint 9.39.1              │
└─────────────────────────────────────────────────────────────────┘
```

---

## File-to-Layer Mapping

### Layer 0: Configuration
| File | Purpose |
|------|---------|
| `package.json` | NPM manifest, dependencies, scripts |
| `vite.config.js` | Vite bundler + plugins configuration |
| `eslint.config.js` | ESLint flat config with React rules |
| `index.html` | HTML entry, mounts React to #root |
| `.gitignore` | Git ignore patterns |
| `scraper/requirements.txt` | Python scraper dependencies |

### Layer 1: Core Utilities
| File | Purpose | Exports |
|------|---------|---------|
| `src/data/playbooks.js` | Playbook data utilities | `nameToSlug`, `loadPlaybookData`, `searchPlays`, `getAllPlaybooks`, `getPlaybook` |

### Layer 2: Data Layer
| File | Purpose | Tables/Schema |
|------|---------|---------------|
| `src/lib/db.js` | Dexie database client | `myPlays`, `gameSessions`, `playPerformance` |
| `public/data/playbooks.json` | Static playbook data | All playbooks with formations and plays |
| `scraper/output/*.json` | Scraped data files | Raw playbook data from huddle.gg |

### Layer 3: Business Logic
| File | Purpose |
|------|---------|
| `scraper/scrape_huddle.py` | Core web scraper (Madden 26 playbooks) |
| `scraper/scrape_falcons.py` | Single playbook scraper (Falcons) |
| `scraper/scrape_subset.py` | Subset scraper (10 playbooks) |
| `scraper/test_scrape.py` | Test scraper (Eagles validation) |

### Layer 4: Interface (Components)
| File | Purpose | Key Features |
|------|---------|--------------|
| `src/App.jsx` | Root container | Tab nav, side toggle, layout |
| `src/components/PlaybookBrowser.jsx` | Play discovery | Search, browse, add plays |
| `src/components/MyPlaysheet.jsx` | Collection management | Filter, sort, tag, rate plays |

### Layer 5: Entry Points
| File | Purpose |
|------|---------|
| `src/main.jsx` | React bootstrap | `createRoot`, renders `<App />` |
| `index.html` | DOM target | `<div id="root">` |

### Supporting Files
| File | Purpose |
|------|---------|
| `src/index.css` | Tailwind CSS import |
| `src/App.css` | Custom styles (empty) |
| `src/assets/` | Static assets |
| `src/hooks/` | Custom hooks (empty) |

---

## Dependency Flow

```
main.jsx
    │
    └─── App.jsx
            │
            ├─── PlaybookBrowser.jsx
            │       ├─── db.js (addToMyPlays)
            │       └─── playbooks.js (loadPlaybookData, searchPlays)
            │
            ├─── MyPlaysheet.jsx
            │       └─── db.js (removeFromMyPlays, updatePlayNotes)
            │
            └─── db.js (useLiveQuery for play count)
```

---

## Import Relationship Matrix

| Module | Imported By | Import Count |
|--------|-------------|--------------|
| `src/lib/db.js` | App, MyPlaysheet, PlaybookBrowser | 3 (CRITICAL) |
| `src/data/playbooks.js` | PlaybookBrowser | 1 |
| `src/components/PlaybookBrowser.jsx` | App | 1 |
| `src/components/MyPlaysheet.jsx` | App | 1 |
| `src/App.jsx` | main | 1 |

---

## Database Schema

### myPlays Table
```javascript
{
  id: auto-increment,
  playId: string,           // Unique play identifier
  playbook: string,         // Source playbook name
  formation: string,        // Formation name
  formationGroup: string,   // Formation group category
  playName: string,         // Display name
  playType: string,         // pass/run
  tags: string[],           // User-defined tags
  rating: number,           // 1-5 star rating
  notes: string,            // User notes
  addedAt: timestamp        // When added
}
```

### gameSessions Table (Future)
```javascript
{
  id: auto-increment,
  date: timestamp,
  opponent: string,
  playsUsed: playId[]
}
```

### playPerformance Table (Future)
```javascript
{
  id: auto-increment,
  playId: string,
  sessionId: number,
  result: string,           // TD, first-down, incomplete, etc.
  notes: string
}
```

---

## Key Architectural Insights

1. **Client-Side Only**: No backend, all data persists in browser IndexedDB
2. **Data Pipeline**: Python scraper → JSON files → Static hosting → Dexie
3. **State Management**: React hooks + Dexie live queries (no Redux needed)
4. **Styling**: 100% Tailwind CSS, zero custom CSS classes
5. **Clean Separation**: Components only import what they need
6. **Critical Path**: `db.js` is the central hub (3 imports)

---

*Generated by bootstrap-project command*
*Last updated: 2025-12-25*
