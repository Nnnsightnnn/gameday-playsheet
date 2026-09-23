// The package engine asserts football arithmetic and Madden 27 macro rules,
// not rendering.
import { describe, it, expect } from 'vitest'
import {
  disguiseScore,
  countDefense,
  countOffense,
  checkPackage,
  macroRecipe,
  recipeText,
  arsenalChecks,
  resolveArsenal,
  nextFreeSlot,
  metaCoverage,
  buildCatalog,
  formationPlays,
  blankPackage,
  MACRO_CAP,
} from '../engine.js'
import { ADJUSTMENTS, adjustmentById, MENUS } from '../vocab.js'
import { META_THREATS, threatsFor } from '../metas.js'

const codes = (checks) => checks.map((c) => c.code)

const DEF_PKG = {
  id: 't-def',
  game: 'madden',
  side: 'defense',
  name: 'TEST',
  base: { playId: 'b', name: 'B', formation: 'F' },
  twins: [],
  counters: ['m27-o-quickhot'],
  user: 'FS',
  look: { shell: 0, rush: 6, press: true },
  truth: { shell: 1, rush: 4, deep: 3 },
  adjustments: [
    { adj: 'cov-align', value: 'Press' },
    { adj: 'cov-leverage', value: 'Commit Inside' },
    { adj: 'ind-blitz', target: 'WILL', value: 'Default' },
    { adj: 'ind-zone', target: 'MIKE', value: 'Hook/Curl' },
  ],
  losesTo: ['x'],
  checkout: { playId: 'b', name: 'B' },
}

const CATALOG = new Map([
  ['b', { name: 'B', formation: 'F' }],
  ['t1', { name: 'T1', formation: 'F' }],
  ['t2', { name: 'T2', formation: 'OTHER' }],
])

describe('vocabulary', () => {
  it('has unique ids, known menus and a conf tag on every adjustment', () => {
    const ids = new Set()
    for (const a of ADJUSTMENTS) {
      expect(ids.has(a.id), a.id).toBe(false)
      ids.add(a.id)
      expect(MENUS[a.menu], a.id).toBeTruthy()
      expect(['ea', 'm27', 'm26', 'stale', 'read']).toContain(a.conf)
      expect(a.options.length, a.id).toBeGreaterThan(0)
      expect(['offense', 'defense']).toContain(a.side)
    }
  })

  it('only the set-by-hand steps are outside the macro', () => {
    const manual = ADJUSTMENTS.filter((a) => a.macro === false).map((a) => a.id)
    expect(manual.sort()).toEqual(['flip', 'hover', 'motion'])
  })

  it('offers the M27 Smart Zone, roll and match-check options from the EA deep dive', () => {
    expect(adjustmentById('smart-zone').options).toContain('Ultra Conservative')
    expect(adjustmentById('roll').options).toContain('Pass Strength')
    expect(adjustmentById('match-check').options).toEqual(
      expect.arrayContaining(['Combo', 'Triangle', 'Top Hat', 'Lock', 'Solo', 'Stress']),
    )
  })

  it('every meta threat names what beats it and carries a conf tag', () => {
    for (const t of META_THREATS) {
      expect(t.beatenBy.length, t.id).toBeGreaterThan(20)
      expect(['ea', 'm27', 'm26', 'stale', 'read']).toContain(t.conf)
      // a fire zone brings more than it shows, so only the range is fixed
      if (t.threat === 'defense') {
        expect(t.rush, t.id).toBeGreaterThanOrEqual(3)
        expect(t.shows, t.id).toBeLessThanOrEqual(8)
      }
    }
  })
})

describe('disguise score', () => {
  it('scores shell change, phantom rushers and press-bail', () => {
    const d = disguiseScore(DEF_PKG)
    // one shell step (25) + two phantom rushers (24) + press bailing to 3 deep (13)
    expect(d.score).toBe(62)
    expect(d.band).toBe('heavy')
  })

  it('a look that matches the call is not a disguise', () => {
    const pkg = { ...DEF_PKG, look: { shell: 1, rush: 4 }, truth: { shell: 1, rush: 4, deep: 3 } }
    expect(disguiseScore(pkg).score).toBe(0)
    expect(codes(checkPackage(pkg))).toContain('no-disguise')
  })

  it('a rotation that moves the help scores on top of the shell change', () => {
    const still = { ...DEF_PKG, look: { shell: 2, rush: 4 }, truth: { shell: 1, rush: 4, deep: 3 }, adjustments: [] }
    const rolled = { ...still, adjustments: [{ adj: 'roll', value: 'Pass Strength' }] }
    expect(disguiseScore(rolled).score - disguiseScore(still).score).toBe(15)
  })

  it('offense disguises with twins, more when they mix run and pass', () => {
    const pass = { side: 'offense', base: { type: 'pass' }, twins: [{ type: 'pass' }, { type: 'pass' }] }
    const mixed = { side: 'offense', base: { type: 'pass' }, twins: [{ type: 'run' }, { type: 'pass' }] }
    expect(disguiseScore(mixed).score).toBeGreaterThan(disguiseScore(pass).score)
  })
})

describe('arithmetic', () => {
  it('defense accounts for all eleven', () => {
    expect(countDefense(DEF_PKG)).toEqual({ rush: 4, deep: 3, droppers: 7, under: 4 })
  })

  it('offense: a back kept in is a blocker, not a receiver', () => {
    const pkg = { truth: { blockers: 5, releases: 5 }, adjustments: [{ adj: 'ind-block', target: 'HB', value: 'Pass Block' }] }
    expect(countOffense(pkg)).toMatchObject({ blockers: 6, releases: 4 })
  })

  it('a chip counts for the first beat only', () => {
    const pkg = { truth: { blockers: 5, releases: 5 }, adjustments: [{ adj: 'ind-block', target: 'TE', value: 'Chip then Release' }] }
    expect(countOffense(pkg)).toMatchObject({ blockers: 5, releases: 5, firstBeat: 6 })
  })
})

describe('checks', () => {
  it('a sound package has no errors', () => {
    expect(checkPackage(DEF_PKG, CATALOG).filter((c) => c.level === 'error')).toEqual([])
  })

  it('one player cannot have two jobs', () => {
    const pkg = { ...DEF_PKG, adjustments: [...DEF_PKG.adjustments, { adj: 'ind-contain', target: 'WILL', value: 'On' }] }
    expect(codes(checkPackage(pkg))).toContain('double-assign')
  })

  it('press with no leverage is flagged after TU Sep 16', () => {
    const pkg = { ...DEF_PKG, adjustments: [{ adj: 'cov-align', value: 'Press' }] }
    expect(codes(checkPackage(pkg))).toContain('press-leverage')
  })

  it('a twin from another formation is not the same look', () => {
    const pkg = { ...DEF_PKG, twins: [{ playId: 't1', name: 'T1' }, { playId: 't2', name: 'T2' }] }
    const c = checkPackage(pkg, CATALOG).filter((x) => x.code === 'twin-formation')
    expect(c).toHaveLength(1)
    expect(c[0].msg).toContain('T2')
  })

  it('shell can never exceed the deep count', () => {
    const pkg = { ...DEF_PKG, truth: { shell: 2, rush: 4, deep: 1 } }
    expect(codes(checkPackage(pkg))).toContain('shell-deep')
    // Cover 3: middle-closed shell of 1 with three deep is fine
    expect(codes(checkPackage(DEF_PKG))).not.toContain('shell-deep')
  })

  it('zero deep with a four-man rush is a warning, not an error', () => {
    const pkg = { ...DEF_PKG, truth: { shell: 0, rush: 4, deep: 0 } }
    const c = checkPackage(pkg).find((x) => x.code === 'zero-thin')
    expect(c.level).toBe('warn')
  })

  it('a defensive package cannot counter a defensive meta', () => {
    const pkg = { ...DEF_PKG, counters: ['m27-d-loop0'] }
    expect(codes(checkPackage(pkg))).toContain('threat-side')
  })

  it('options must come from the vocabulary', () => {
    const pkg = { ...DEF_PKG, adjustments: [{ adj: 'smart-zone', value: 'Spicy' }] }
    expect(codes(checkPackage(pkg))).toContain('bad-value')
  })

  it('building for the QB run without contain or spy is flagged', () => {
    const pkg = { ...DEF_PKG, counters: ['m27-o-qbrun'] }
    expect(codes(checkPackage(pkg))).toContain('qb-escape')
    const fixed = { ...pkg, adjustments: [...pkg.adjustments, { adj: 'contain-all', value: 'On' }] }
    expect(codes(checkPackage(fixed))).not.toContain('qb-escape')
  })

  const OFF_PKG = {
    id: 't-off', game: 'madden', side: 'offense', name: 'O',
    base: { playId: 'b', name: 'B', formation: 'F', type: 'pass' },
    counters: ['m27-d-loop0'], truth: { blockers: 5, releases: 5 },
    adjustments: [], losesTo: ['x'], checkout: { playId: 'b', name: 'B' },
  }

  it('five blockers vs a six-man look with no hot is a protection warning', () => {
    expect(codes(checkPackage(OFF_PKG))).toContain('protection')
    const withBack = { ...OFF_PKG, adjustments: [{ adj: 'ind-block', target: 'HB', value: 'Pass Block' }] }
    expect(codes(checkPackage(withBack))).not.toContain('protection')
  })

  it('macroing WR1/WR2 is flip-fragile (macros bind to the depth chart)', () => {
    const pkg = { ...OFF_PKG, adjustments: [{ adj: 'hot-route', target: 'WR1', value: 'Slant' }] }
    expect(codes(checkPackage(pkg))).toContain('flip-fragile')
    const wr3 = { ...OFF_PKG, adjustments: [{ adj: 'hot-route', target: 'WR3', value: 'Slant' }] }
    expect(codes(checkPackage(wr3))).not.toContain('flip-fragile')
  })

  it('Aggressive Blocking is flagged for holding after TU Sep 3', () => {
    const pkg = { ...OFF_PKG, adjustments: [{ adj: 'block-style', value: 'Aggressive' }] }
    expect(codes(checkPackage(pkg))).toContain('holding')
  })
})

describe('macro recipe', () => {
  it('orders by menu, and manual steps go last and are marked', () => {
    const pkg = {
      ...DEF_PKG,
      adjustments: [
        { adj: 'hover', value: 'A Gap' },
        { adj: 'contain-all', value: 'On' },
        { adj: 'ind-zone', target: 'MIKE', value: 'Hook/Curl' },
        { adj: 'cov-align', value: 'Press' },
        { adj: 'dl-align', value: 'Pinch' },
      ],
    }
    const r = macroRecipe(pkg)
    expect(r.map((s) => s.label)).toEqual([
      'Coverage alignment', 'D-line alignment', 'Zone drop', 'QB contain (both edges)', 'User hover',
    ])
    expect(r.at(-1).inMacro).toBe(false)
    expect(r.map((s) => s.step)).toEqual([1, 2, 3, 4, 5])
    expect(recipeText(pkg)).toContain('[at the line]')
  })
})

describe('arsenal', () => {
  const pk = (id, side, slot, active = true) => ({ id, side, game: 'madden', name: id, slot, active, counters: [] })

  it('enforces 20 built and 10 active per side', () => {
    const many = Array.from({ length: 11 }, (_, i) => pk('d' + i, 'defense', i + 1))
    const errs = arsenalChecks(many, resolveArsenal(many))
    expect(errs.map((e) => e.code)).toEqual(['active-cap'])
    expect(MACRO_CAP).toEqual({ built: 20, active: 10 })
  })

  it('two packages cannot share a slot on the same side', () => {
    const list = [pk('a', 'defense', 1), pk('b', 'defense', 1), pk('c', 'offense', 1)]
    expect(arsenalChecks(list, resolveArsenal(list)).map((e) => e.code)).toEqual(['slot-clash'])
  })

  it('saved overrides beat defaults, and a null slot leaves the arsenal', () => {
    const list = [pk('a', 'defense', 1), pk('b', 'defense', 2)]
    const ars = resolveArsenal(list, { a: { slot: null }, b: { active: false } })
    expect(ars.a.slot).toBeNull()
    expect(ars.b).toEqual({ slot: 2, active: false })
    expect(nextFreeSlot(list, ars, 'defense')).toBe(1)
  })

  it('maps active packages onto the meta and names the gaps', () => {
    const list = [{ ...pk('a', 'defense', 1), counters: ['m27-o-return'] }]
    const cov = metaCoverage(list, resolveArsenal(list), 'madden', 'defense')
    expect(cov).toHaveLength(threatsFor('madden', 'defense').length)
    expect(cov.find((r) => r.threat.id === 'm27-o-return').gap).toBe(false)
    expect(cov.filter((r) => r.gap).length).toBe(cov.length - 1)
  })
})

describe('catalog helpers', () => {
  const books = [{
    id: 'x-def', type: 'defense',
    formationGroups: [{ name: 'Nickel', formations: [{ name: '2-4', plays: [{ id: 'p1', name: 'P1', type: 'pass' }] }] }],
  }]

  it('names a formation as "<group> <formation>" like the curated plans', () => {
    expect(buildCatalog(books).get('p1')).toMatchObject({ formation: 'Nickel 2-4', playbook: 'x-def' })
    expect(formationPlays(books, 'x-def', 'Nickel 2-4')).toEqual([{ playId: 'p1', name: 'P1', type: 'pass' }])
  })

  it('a blank package starts as a custom draft for its side', () => {
    const b = blankPackage({ game: 'madden', side: 'defense', playbook: 'x-def' })
    expect(b.custom).toBe(true)
    expect(b.id.startsWith('my-')).toBe(true)
    expect(b.truth.deep).toBeDefined()
  })
})
