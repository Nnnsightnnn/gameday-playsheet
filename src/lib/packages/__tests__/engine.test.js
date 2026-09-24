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
import {
  ADJUSTMENTS,
  adjustmentById,
  MENUS,
  SHELL_OF_COVERAGE_SHELL,
  DEF_POSITIONS,
  normalizeAdjustment,
} from '../vocab.js'
import { CONFIDENCE } from '../../../data/personnel.js'
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
    { adj: 'cov-leverage', value: 'Inside' },
    { adj: 'ind-blitz', target: 'WILL', value: 'Blitz' },
    { adj: 'ind-zone', target: 'MIKE', value: 'Hook Curl' },
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
      expect(CONFIDENCE[a.conf], `${a.id} conf`).toBeTruthy()
      if (a.macroConf) expect(CONFIDENCE[a.macroConf], `${a.id} macroConf`).toBeTruthy()
      expect(a.options.length, a.id).toBeGreaterThan(0)
      expect(a.options.every((o) => typeof o === 'string' && o.length > 0), a.id).toBe(true)
      expect(new Set(a.options).size, `${a.id} duplicate option`).toBe(a.options.length)
      expect(['offense', 'defense']).toContain(a.side)
      expect(['rush', 'drop', 'block', 'none']).toContain(a.kind)
      expect(typeof a.macro, a.id).toBe('boolean')
      expect(a.label.length, a.id).toBeGreaterThan(2)
    }
  })

  it('carries the research pass: 50+ defensive and 20+ offensive adjustments', () => {
    expect(ADJUSTMENTS.filter((a) => a.side === 'defense').length).toBeGreaterThanOrEqual(50)
    expect(ADJUSTMENTS.filter((a) => a.side === 'offense').length).toBeGreaterThanOrEqual(20)
  })

  it('manual-at-the-line steps are never stored in a macro', () => {
    for (const a of ADJUSTMENTS.filter((x) => ['line', 'audible', 'motion'].includes(x.menu)))
      expect(a.macro, a.id).toBe(false)
    for (const id of ['hover', 'motion', 'flip', 'audible', 'fake-snap', 'snap-ball', 'run-flip'])
      expect(adjustmentById(id).macro, id).toBe(false)
  })

  it('has the Coverage Shell with the six EA shells, each mapped to a deep-safety count', () => {
    const cs = adjustmentById('coverage-shell')
    expect(cs.menu).toBe('coverage')
    expect(cs.macro).toBe(true)
    expect(cs.conf).toBe('ea')
    expect(cs.options).toEqual(['Cover 0', 'Cover 2 Man', 'Cover 2', 'Cover 3', 'Cover 4', 'Cover 6'])
    expect(cs.hint).toContain('m27-how-to-use-coverage-shells')
    for (const o of cs.options) expect(SHELL_OF_COVERAGE_SHELL[o], o).toBeDefined()
    expect(SHELL_OF_COVERAGE_SHELL).toEqual({
      'Cover 0': 0, 'Cover 2 Man': 2, 'Cover 2': 2, 'Cover 3': 1, 'Cover 4': 2, 'Cover 6': 2,
    })
  })

  it('offers the M27 Smart Zone, roll, match-check and man-check options from the EA deep dive', () => {
    expect(adjustmentById('smart-zone').options).toContain('Ultra Conservative')
    expect(adjustmentById('roll').options).toEqual(expect.arrayContaining(['Pass Strength', 'WR1', 'TE1']))
    expect(adjustmentById('match-check').options).toEqual(
      expect.arrayContaining(['Box', 'Bingo', 'Skate', 'Solo', 'Stress', 'Stubbie', 'Zone It']),
    )
    expect(adjustmentById('man-check-stack').options).toEqual(
      expect.arrayContaining(['Combo', 'Triangle', 'Top Hat', 'Lock']),
    )
    expect(adjustmentById('man-check-bunch').options).toContain('Point Combo')
  })

  it('protection is the real M27 menu: no "Empty Base", Max Protect on its own', () => {
    expect(adjustmentById('protect').options).toEqual(
      ['Base', 'Empty', 'Full Slide Left', 'Full Slide Right', 'Half Slide Left', 'Half Slide Right'],
    )
    expect(adjustmentById('max-protect')).toBeTruthy()
    // ID the Mike, Untarget and Double Team all point at a defender
    for (const id of ['id-mike', 'untarget', 'double-team']) {
      expect(adjustmentById(id).menu, id).toBe('protection')
      expect(adjustmentById(id).options, id).toEqual(DEF_POSITIONS)
    }
    expect(adjustmentById('ind-block').options).toContain('Chip and Release')
    expect(adjustmentById('ind-block').options).not.toContain('Chip then Release')
  })

  it('old saved values migrate onto the corrected vocabulary', () => {
    expect(normalizeAdjustment({ adj: 'ind-block', target: 'TE', value: 'Chip then Release' }))
      .toEqual({ adj: 'ind-block', target: 'TE', value: 'Chip and Release' })
    expect(normalizeAdjustment({ adj: 'protect', value: 'Max Protect' }))
      .toEqual({ adj: 'max-protect', value: 'On' })
    expect(normalizeAdjustment({ adj: 'double-team', value: 'Nose / 1-tech' }).value).toBe('DT')
    expect(normalizeAdjustment({ adj: 'ind-zone', target: 'MIKE', value: 'Hook/Curl' }).value).toBe('Hook Curl')
    // a valid value is returned as is, an untranslatable one is left to fail
    const ok = { adj: 'roll', value: 'Field' }
    expect(normalizeAdjustment(ok)).toBe(ok)
    expect(normalizeAdjustment({ adj: 'motion', target: 'WR3', value: 'Across' }).value).toBe('Across')
  })

  it('a legacy package still checks clean after migration', () => {
    const legacy = {
      ...DEF_PKG,
      adjustments: [
        { adj: 'cov-align', value: 'Press' },
        { adj: 'cov-leverage', value: 'Commit Inside' },
        { adj: 'ind-blitz', target: 'WILL', value: 'Default' },
        { adj: 'ind-zone', target: 'MIKE', value: 'Hook/Curl' },
      ],
    }
    expect(checkPackage(legacy).filter((c) => c.level === 'error')).toEqual([])
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
    const pkg = { truth: { blockers: 5, releases: 5 }, adjustments: [{ adj: 'ind-block', target: 'TE', value: 'Chip and Release' }] }
    expect(countOffense(pkg)).toMatchObject({ blockers: 5, releases: 5, firstBeat: 6 })
    const legacy = { truth: { blockers: 5, releases: 5 }, adjustments: [{ adj: 'ind-block', target: 'TE', value: 'Chip then Release' }] }
    expect(countOffense(legacy)).toMatchObject({ firstBeat: 6 })
    const chip = { truth: { blockers: 5, releases: 5 }, adjustments: [{ adj: 'chip-block', target: 'TE', value: 'LEDG' }] }
    expect(countOffense(chip)).toMatchObject({ blockers: 5, releases: 5, firstBeat: 6 })
  })

  it('max protect keeps the backs in, and absorbs a Pass Block on the same back', () => {
    const mp = { truth: { blockers: 5, releases: 5 }, adjustments: [{ adj: 'max-protect', value: 'On' }] }
    expect(countOffense(mp)).toMatchObject({ blockers: 7, releases: 3, maxProtect: true })
    const both = { ...mp, adjustments: [...mp.adjustments, { adj: 'ind-block', target: 'HB', value: 'Pass Block' }] }
    expect(countOffense(both)).toMatchObject({ blockers: 7, releases: 3 })
    const legacy = { truth: { blockers: 5, releases: 5 }, adjustments: [{ adj: 'protect', value: 'Max Protect' }] }
    expect(countOffense(legacy)).toMatchObject({ blockers: 7 })
  })

  it('block and release is a blocker against pressure without losing the route', () => {
    const pkg = { truth: { blockers: 5, releases: 5 }, adjustments: [{ adj: 'ind-block', target: 'HB', value: 'Block and Release' }] }
    expect(countOffense(pkg)).toMatchObject({ blockers: 6, releases: 5, blockRelease: 1 })
  })
})

describe('checks', () => {
  it('a sound package has no errors', () => {
    expect(checkPackage(DEF_PKG, CATALOG).filter((c) => c.level === 'error')).toEqual([])
  })

  it('one player cannot have two jobs', () => {
    const pkg = { ...DEF_PKG, adjustments: [...DEF_PKG.adjustments, { adj: 'ind-contain', target: 'WILL', value: 'Left' }] }
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
    const fixed = { ...pkg, adjustments: [...pkg.adjustments, { adj: 'contain-all', value: 'Both' }] }
    expect(codes(checkPackage(fixed))).not.toContain('qb-escape')
  })

  it('a Coverage Shell that disagrees with the look is an error', () => {
    const right = { ...DEF_PKG, adjustments: [...DEF_PKG.adjustments, { adj: 'coverage-shell', value: 'Cover 0' }] }
    expect(codes(checkPackage(right))).not.toContain('shell-mismatch')
    const wrong = { ...DEF_PKG, adjustments: [...DEF_PKG.adjustments, { adj: 'coverage-shell', value: 'Cover 4' }] }
    const c = checkPackage(wrong).find((x) => x.code === 'shell-mismatch')
    expect(c.level).toBe('error')
    expect(c.msg).toContain('Cover 4')
  })

  it('the programmed shell, not the intent, drives the disguise score', () => {
    // look says zero, but the macro programs Cover 3 (1-high) over a 1-high call
    const pkg = { ...DEF_PKG, adjustments: [...DEF_PKG.adjustments, { adj: 'coverage-shell', value: 'Cover 3' }] }
    expect(disguiseScore(pkg).shellDelta).toBe(0)
    expect(disguiseScore(DEF_PKG).shellDelta).toBe(1)
  })

  it('a shell disguise with no Coverage Shell step says the picture is not programmed', () => {
    const c = checkPackage(DEF_PKG).find((x) => x.code === 'no-shell')
    expect(c.level).toBe('info')
    const shelled = { ...DEF_PKG, adjustments: [...DEF_PKG.adjustments, { adj: 'coverage-shell', value: 'Cover 0' }] }
    expect(codes(checkPackage(shelled))).not.toContain('no-shell')
    const noDelta = { ...DEF_PKG, look: { shell: 1, rush: 6 } }
    expect(codes(checkPackage(noDelta))).not.toContain('no-shell')
  })

  it('a CFB-only adjustment on a Madden package is an error', () => {
    const pkg = { ...DEF_PKG, adjustments: [{ adj: 'cfb-coverage-shell', value: 'CV Zero' }] }
    expect(codes(checkPackage(pkg))).toContain('wrong-game')
  })

  it('no-user comes from the user-objectives module, for defense', () => {
    const pkg = { ...DEF_PKG, user: '' }
    expect(codes(checkPackage(pkg))).toContain('no-user')
    expect(codes(checkPackage(DEF_PKG))).not.toContain('no-user')
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

  it('a hot route off the player\'s alignment menu is flagged', () => {
    const bad = { ...OFF_PKG, adjustments: [{ adj: 'hot-route', target: 'HB', value: 'Sluggo' }] }
    expect(codes(checkPackage(bad))).toContain('hot-alignment')
    const ok = { ...OFF_PKG, adjustments: [{ adj: 'hot-route', target: 'HB', value: 'Texas' }] }
    expect(codes(checkPackage(ok))).not.toContain('hot-alignment')
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
        { adj: 'contain-all', value: 'Both' },
        { adj: 'ind-zone', target: 'MIKE', value: 'Hook/Curl' },
        { adj: 'cov-align', value: 'Press' },
        { adj: 'coverage-shell', value: 'Cover 0' },
        { adj: 'dl-align', value: 'Pinch' },
      ],
    }
    const r = macroRecipe(pkg)
    expect(r.map((s) => s.label)).toEqual([
      'Press / back off', 'Coverage shell', 'D-line technique', 'Zone assignment', 'QB contain', 'User hover',
    ])
    // the recipe shows the migrated value, not the legacy label
    expect(r.find((s) => s.label === 'Zone assignment').value).toBe('Hook Curl')
    expect(r.at(-1).inMacro).toBe(false)
    expect(r.map((s) => s.step)).toEqual([1, 2, 3, 4, 5, 6])
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
