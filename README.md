# Gameday Playsheet

Football play management for sideline use. Build a custom playsheet from NFL/college playbooks, track in-game performance, and dial defensive adjustments on the fly.

Live: **https://nnnsightnnn.github.io/gameday-playsheet/**

## Stack

React 19 · Vite 7 · Tailwind CSS 4 · Dexie (IndexedDB) · `@dnd-kit`

## Local development

```bash
npm install
npm run dev          # vite dev server (http://localhost:5173)
npm run lint         # ESLint
npm run build        # production build to ./dist
npm run preview      # preview the production build locally
```

Convenience wrapper for background dev:

```bash
./scripts/dev.sh start    # spawn vite in background, write .dev.pid
./scripts/dev.sh stop     # kill it
```

## Repo layout

```
src/              React app (components, hooks, lib, data)
public/data/      Playbook JSON (consumed at runtime)
tools/scraper/    Python scraper that generates public/data/playbooks.json
scripts/          Dev helper scripts
.github/workflows # GitHub Pages deploy (Actions)
```

## Deployment

Pushes to `main` trigger `.github/workflows/pages.yml`, which builds with Vite and publishes `dist/` via the `actions/deploy-pages` flow. The Vite `base` is set to `/gameday-playsheet/` to match the Pages URL.

To enable Pages on the repo (one-time): **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Data refresh

Playbooks are scraped from huddle.gg. To regenerate `public/data/playbooks.json`:

```bash
cd tools/scraper
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python scrape_huddle.py
cp output/playbooks.json ../../public/data/playbooks.json
```

---

<p align="center">
  <a href="https://nnnsightnnn.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".brand/built-by-dark.svg">
      <img src=".brand/built-by.svg" alt="built by nnnsightnnn" height="26">
    </picture>
  </a>
</p>
