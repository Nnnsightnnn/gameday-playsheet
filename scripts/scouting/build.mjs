#!/usr/bin/env node
// built by nnnsightnnn — signal from noise
// Scouting build: roster snapshot -> public/data/scouting/<ABBR>.json facts.
//
//   node scripts/scouting/build.mjs facts [ABBR,...]   write/refresh the `facts` block
//   node scripts/scouting/build.mjs index              rebuild public/data/scouting/index.json
//   node scripts/scouting/build.mjs brief ABBR         print the agent brief (facts + books + Falcons sheet)
//
// `facts` is script-owned and overwritten on every run; `report` is
// agent-owned and is never touched here, so a roster refresh keeps the
// judgment and flags it stale instead of deleting it.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { starters, unitScores, leagueRanks, buildFacts } from '../../src/lib/scouting/facts.js';
import { TEAMS } from '../../src/lib/scouting/teams.js';
import { UNAVAILABLE } from '../../src/data/scoutingAvailability.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ROSTERS = path.join(ROOT, 'tools/scraper/output/rosters-m27.json');
const OUT = path.join(ROOT, 'public/data/scouting');
const CATALOG = path.join(ROOT, 'public/data/playbooks.json');

const readJSON = (p) => JSON.parse(readFileSync(p, 'utf8'));

function books(slug) {
  const cat = readJSON(CATALOG);
  const out = {};
  for (const side of ['off', 'def']) {
    const pb = cat.playbooks.find((p) => p.id === `${slug}-${side}`);
    out[side === 'off' ? 'offense' : 'defense'] = pb
      ? { id: pb.id, formations: pb.formationGroups.flatMap((g) => g.formations.map((f) => `${g.name} ${f.name}`)) }
      : null;
  }
  return out;
}

function cmdFacts(only) {
  const snap = readJSON(ROSTERS);
  const teams = {};
  for (const [a, t] of Object.entries(snap.teams)) {
    const out = new Set((UNAVAILABLE[a] || []).map((u) => u.name));
    teams[a] = { ...t, players: t.players.filter((p) => !out.has(p.name)), unavailable: UNAVAILABLE[a] || [] };
  }
  const missing = Object.keys(TEAMS).filter((a) => !teams[a]);
  if (missing.length) throw new Error(`roster snapshot missing ${missing.join(',')} — rerun scrape_rosters.py`);
  const scores = Object.fromEntries(Object.entries(teams).map(([a, t]) => [a, unitScores(starters(t.players))]));
  const ranks = leagueRanks(scores);
  const iteration = { ...snap.iteration, scrapedAt: snap.scrapedAt, source: snap.source };
  const targets = (only.length ? only : Object.keys(TEAMS)).filter((a) => a !== 'ATL');
  for (const abbr of targets) {
    const file = path.join(OUT, `${abbr}.json`);
    const prev = existsSync(file) ? readJSON(file) : null;
    const facts = buildFacts(teams[abbr], teams.ATL, { iteration, ranks, scores, playbooks: books(TEAMS[abbr].slug) });
    facts.unavailable = teams[abbr].unavailable;
    facts.falconsUnavailable = teams.ATL.unavailable;
    const doc = {
      schemaVersion: 1,
      game: 'madden',
      opponent: abbr,
      scoutedBy: 'ATL',
      facts,
      report: prev?.report ?? null,
    };
    if (doc.report && doc.report.rosterIteration !== iteration.label) doc.report.stale = true;
    writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
    console.log(`facts ${abbr} (${iteration.label})${doc.report ? (doc.report.stale ? ' — report STALE' : ' — report kept') : ' — no report yet'}`);
  }
}

function cmdIndex() {
  const rows = readdirSync(OUT)
    .filter((f) => /^[A-Z]{2,3}\.json$/.test(f))
    .map((f) => readJSON(path.join(OUT, f)))
    .map((d) => ({
      abbr: d.opponent,
      name: d.facts.team.name,
      units: d.facts.units,
      ranks: d.facts.ranks,
      iteration: d.facts.iteration.label,
      hasReport: !!d.report,
      stale: !!d.report?.stale,
      threatLevel: d.report?.threatLevel ?? null,
      headline: d.report?.headline ?? null,
      xFactors: d.facts.threats.filter((t) => t.xFactor).map((t) => t.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ updatedAt: new Date().toISOString().slice(0, 10), teams: rows }, null, 2) + '\n');
  console.log(`index: ${rows.length} teams, ${rows.filter((r) => r.hasReport).length} with reports`);
}

function cmdBrief(abbr) {
  const d = readJSON(path.join(OUT, `${abbr}.json`));
  const f = d.facts;
  const cat = readJSON(CATALOG);
  const atl = (side) => cat.playbooks.find((p) => p.id === `falcons-${side}`)
    .formationGroups.flatMap((g) => g.formations.map((fm) => ({ formation: `${g.name} ${fm.name}`, plays: fm.plays.map((p) => ({ id: p.id, name: p.name })) })));
  console.log(JSON.stringify({ facts: f, falconsBooks: { offense: atl('off'), defense: atl('def') } }));
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'facts') cmdFacts((arg || '').split(',').filter(Boolean));
else if (cmd === 'index') cmdIndex();
else if (cmd === 'brief') cmdBrief(arg);
else console.log('usage: build.mjs facts [ABBR,...] | index | brief ABBR');
