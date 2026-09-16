#!/usr/bin/env node
// node scripts/scouting/validate.mjs [ABBR,...] — contract check for agent-written reports.
import { readFileSync, readdirSync } from 'node:fs';
import { validateReport } from '../../src/lib/scouting/report.js';
const dir = new URL('../../public/data/scouting/', import.meta.url);
const cat = JSON.parse(readFileSync(new URL('../../public/data/playbooks.json', import.meta.url), 'utf8'));
const ids = new Map();
for (const pb of cat.playbooks) for (const g of pb.formationGroups) for (const f of g.formations) for (const p of f.plays) ids.set(p.id, p.name);
const only = (process.argv[2] || '').split(',').filter(Boolean);
let bad = 0;
for (const f of readdirSync(dir).filter((x) => /^[A-Z]{2,3}\.json$/.test(x))) {
  const abbr = f.replace('.json', '');
  if (only.length && !only.includes(abbr)) continue;
  const d = JSON.parse(readFileSync(new URL(f, dir), 'utf8'));
  if (!d.report) { if (only.length) { console.log(`${abbr}: no report`); bad++; } continue; }
  const errs = validateReport(d, ids);
  console.log(errs.length ? `${abbr}: ${errs.length} errors\n  ${errs.join('\n  ')}` : `${abbr}: ok`);
  bad += errs.length ? 1 : 0;
}
process.exit(bad ? 1 : 0);
