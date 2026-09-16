// Scouting reports: facts must be well-formed for every opponent, and any
// agent-written report must satisfy the contract in src/lib/scouting/report.js
// (real starters, real Falcons plays, conf tags, sources).
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { validateReport } from '../../lib/scouting/report'
import { TEAMS } from '../../lib/scouting/teams'
import { composite, JOB, starters, unitScores } from '../../lib/scouting/facts'

const DIR = new URL('../../../public/data/scouting/', import.meta.url)
const files = readdirSync(DIR).filter((f) => /^[A-Z]{2,3}\.json$/.test(f))
const docs = files.map((f) => JSON.parse(readFileSync(new URL(f, DIR), 'utf8')))

const catalog = JSON.parse(readFileSync(new URL('../../../public/data/playbooks.json', import.meta.url), 'utf8'))
const ids = new Map()
for (const pb of catalog.playbooks)
  for (const fg of pb.formationGroups || [])
    for (const f of fg.formations || [])
      for (const p of f.plays || []) ids.set(p.id, p.name)

describe('scouting engine', () => {
  it('composite is a weighted mean', () => {
    const p = { ratings: { SPD: 90, ACC: 80 } }
    expect(composite(p, { SPD: 1, ACC: 1 })).toBe(85)
  })
  it('projects eleven starters per side from a full roster', () => {
    const mk = (pos, n) => Array.from({ length: n }, (_, i) => ({ name: `${pos}${i}`, pos, ratings: { OVR: 90 - i } }))
    const players = [
      ...mk('QB', 2), ...mk('HB', 2), ...mk('WR', 4), ...mk('TE', 2), ...['LT', 'LG', 'C', 'RG', 'RT'].flatMap((p) => mk(p, 2)),
      ...mk('LEDGE', 2), ...mk('REDGE', 2), ...mk('DT', 3), ...mk('MIKE', 2), ...mk('WILL', 2), ...mk('SAM', 2), ...mk('CB', 4), ...mk('FS', 2), ...mk('SS', 2),
    ]
    const st = starters(players)
    expect(st.offense).toHaveLength(11)
    expect(st.defense).toHaveLength(11)
    expect(st.offense.find((p) => p.slot === 'WR1').name).toBe('WR0')
    expect(Object.values(unitScores(st)).every((x) => typeof x === 'number')).toBe(true)
  })
  it('every job weight names a real rating key', () => {
    const keys = new Set(['OVR', 'SPD', 'ACC', 'AGI', 'COD', 'STR', 'AWR', 'JMP', 'THP', 'SAC', 'MAC', 'DAC', 'RUN', 'TUP', 'BSK', 'CAR', 'BCV', 'BTK', 'JKM', 'CTH', 'CIT', 'RLS', 'SRR', 'MRR', 'DRR', 'RBK', 'RBP', 'RBF', 'PBK', 'PBP', 'PBF', 'IBL', 'TAK', 'PUR', 'PRC', 'BSH', 'PMV', 'FMV', 'MCV', 'ZCV', 'PRS'])
    for (const w of Object.values(JOB)) for (const k of Object.keys(w)) expect(keys.has(k), k).toBe(true)
  })
})

describe('scouting files', () => {
  it('cover all 31 opponents', () => {
    const want = Object.keys(TEAMS).filter((a) => a !== 'ATL').sort()
    expect(docs.map((d) => d.opponent).sort()).toEqual(want)
  })
  it.each(docs.map((d) => [d.opponent, d]))('%s facts are well-formed', (_, d) => {
    expect(d.scoutedBy).toBe('ATL')
    expect(d.facts.starters.offense).toHaveLength(11)
    expect(d.facts.starters.defense).toHaveLength(11)
    expect(d.facts.matchups.attack.length).toBeGreaterThan(5)
    expect(d.facts.matchups.defend.length).toBeGreaterThan(5)
    expect(d.facts.iteration.label).toBeTruthy()
  })
  const withReports = docs.filter((d) => d.report)
  if (withReports.length) {
    it.each(withReports.map((d) => [d.opponent, d]))('%s report satisfies the contract', (_, d) => {
      expect(validateReport(d, ids)).toEqual([])
    })
  }
})
