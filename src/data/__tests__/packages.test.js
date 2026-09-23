// Curated custom adjustment packages are football claims: every call must be
// in the shipped catalog, every twin must share the base formation (or it is
// not the same look), every adjustment must come from the vocabulary with a
// source tag, and the engine must find no errors in any of them.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { PACKAGES } from '../packages'
import { buildCatalog, analyzePackage, arsenalChecks, resolveArsenal, disguiseScore, countOffense } from '../../lib/packages/engine'
import { adjustmentById, DEF_POSITIONS, OFF_POSITIONS } from '../../lib/packages/vocab'
import { threatById } from '../../lib/packages/metas'
import { COVERAGES } from '../../lib/coverage/coverages'
import { FORMATIONS } from '../../lib/coverage/formations'
import { CONCEPTS } from '../../lib/coverage/concepts'
import { CONFIDENCE, POSITION_MIGRATION } from '../personnel'

const CATALOG_FILES = {
  madden: '../../../public/data/playbooks.json',
  cfb: '../../../public/data/playbooks-cfb27.json',
}
const catalogs = new Map()
function catalogFor(game) {
  if (!catalogs.has(game)) {
    const json = JSON.parse(readFileSync(new URL(CATALOG_FILES[game], import.meta.url), 'utf8'))
    catalogs.set(game, buildCatalog(json.playbooks))
  }
  return catalogs.get(game)
}

const RETIRED = new Set(POSITION_MIGRATION.map((m) => m.was))

describe.each(PACKAGES)('package: $name', (pkg) => {
  const catalog = catalogFor(pkg.game)

  it('has a unique id and a known side', () => {
    expect(PACKAGES.filter((p) => p.id === pkg.id)).toHaveLength(1)
    expect(['offense', 'defense']).toContain(pkg.side)
  })

  it('base, twins and checkout are real plays with matching names from its own book', () => {
    for (const p of [pkg.base, ...pkg.twins, pkg.checkout]) {
      const c = catalog.get(p.playId)
      expect(c, `missing ${p.playId}`).toBeTruthy()
      expect(c.name).toBe(p.name)
      expect(c.playbook).toBe(pkg.playbook)
    }
    expect(catalog.get(pkg.base.playId).formation).toBe(pkg.base.formation)
    expect(catalog.get(pkg.base.playId).type).toBe(pkg.base.type)
  })

  it('every twin shares the base formation', () => {
    for (const t of pkg.twins) {
      expect(catalog.get(t.playId).formation, t.name).toBe(pkg.base.formation)
      expect(catalog.get(t.playId).type, t.name).toBe(t.type)
      expect(t.role.length).toBeGreaterThan(20)
    }
  })

  it('the engine finds no errors', () => {
    const a = analyzePackage(pkg, catalog)
    expect(a.checks.filter((c) => c.level === 'error')).toEqual([])
  })

  it('targets a real meta on the other side of the ball', () => {
    expect(pkg.counters.length).toBeGreaterThan(0)
    for (const id of pkg.counters) {
      const t = threatById(id)
      expect(t, id).toBeTruthy()
      expect(t.game).toBe(pkg.game)
      expect(t.threat).not.toBe(pkg.side)
    }
  })

  it('every adjustment is in the vocabulary, sourced, and explained', () => {
    const positions = new Set(pkg.side === 'defense' ? DEF_POSITIONS : OFF_POSITIONS)
    for (const a of pkg.adjustments) {
      const def = adjustmentById(a.adj)
      expect(def, a.adj).toBeTruthy()
      expect(def.options).toContain(a.value)
      expect(CONFIDENCE[a.conf], `${a.adj} conf`).toBeTruthy()
      expect(a.why.length, a.adj).toBeGreaterThan(30)
      if (a.target) {
        expect(positions.has(a.target), a.target).toBe(true)
        expect(RETIRED.has(a.target)).toBe(false)
      }
    }
    expect(CONFIDENCE[pkg.conf]).toBeTruthy()
  })

  it('names its price, its checkout and when to call it', () => {
    expect(pkg.beats.length).toBeGreaterThan(0)
    expect(pkg.losesTo.length).toBeGreaterThan(0)
    expect(pkg.checkout.when.length).toBeGreaterThan(10)
    expect(pkg.call.length).toBeGreaterThan(20)
    expect(pkg.tells.length).toBeGreaterThan(0)
  })

  it('links a Coverage Lab comparison that exists, when it has one', () => {
    if (!pkg.lab) return
    expect(COVERAGES[pkg.lab.shown], pkg.lab.shown).toBeTruthy()
    expect(COVERAGES[pkg.lab.played], pkg.lab.played).toBeTruthy()
    expect(FORMATIONS[pkg.lab.formation]).toBeTruthy()
    expect(CONCEPTS[pkg.lab.concept]).toBeTruthy()
  })
})

describe('defensive packages are real disguises', () => {
  const def = PACKAGES.filter((p) => p.side === 'defense')

  it.each(def)('$name shows one thing and plays another, with a user named', (pkg) => {
    expect(disguiseScore(pkg).score).toBeGreaterThanOrEqual(35)
    expect(pkg.user.length).toBeGreaterThan(20)
  })

  // Football: Bates is a zone safety whose abilities only fire deep. A
  // package that users him in the box throws those away (Falcons plan header).
  it.each(def)('$name users Bates deep, never in the box', (pkg) => {
    if (!pkg.id.startsWith('falcons')) return
    expect(pkg.user).toMatch(/^FS Bates/)
  })

  // Ghost Zero only works if the rush the offense prepares for never comes.
  it('GHOST ZERO shows six and brings four, with droppers in the hot windows', () => {
    const g = PACKAGES.find((p) => p.id === 'falcons-pkg-ghost-zero')
    expect(g.look.rush).toBe(6)
    expect(g.truth.rush).toBe(4)
    const hooks = g.adjustments.filter((a) => a.adj === 'ind-zone' && a.value === 'Hook/Curl')
    expect(hooks.length).toBeGreaterThanOrEqual(2)
  })
})

describe('offensive packages hold up against what they target', () => {
  it.each(PACKAGES.filter((p) => p.side === 'offense'))('$name blocks the rush it is built to beat', (pkg) => {
    const { blockers } = countOffense(pkg)
    for (const id of pkg.counters) {
      const t = threatById(id)
      if (t.rush) expect(blockers, t.name).toBeGreaterThanOrEqual(t.rush)
    }
  })
})

describe('shipped arsenal', () => {
  it('fits the M27 caps with no slot clashes', () => {
    for (const game of ['madden', 'cfb']) {
      const list = PACKAGES.filter((p) => p.game === game)
      expect(arsenalChecks(list, resolveArsenal(list))).toEqual([])
    }
  })
})
