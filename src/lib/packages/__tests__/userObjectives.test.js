// User objectives: the data table asserts a job, a cue and a price on every
// entry, and the checks catch the classic user mistakes.
import { describe, it, expect } from 'vitest'
import {
  USER_OBJECTIVES,
  PHASES,
  objectiveById,
  objectivesForSide,
  objectiveGroups,
  blankObjective,
  defaultPhase,
  checkUserObjectives,
} from '../userObjectives.js'
import { CONFIDENCE } from '../../../data/personnel.js'
import { DEF_POSITIONS, OFF_POSITIONS } from '../vocab.js'

const codes = (checks) => checks.map((c) => c.code)
const byCode = (checks, code) => checks.filter((c) => c.code === code)

describe('USER_OBJECTIVES data', () => {
  it('has unique ids', () => {
    const ids = USER_OBJECTIVES.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('covers both sides of the ball', () => {
    expect(objectivesForSide('defense').length).toBeGreaterThan(0)
    expect(objectivesForSide('offense').length).toBeGreaterThan(0)
    expect(objectivesForSide('defense').length + objectivesForSide('offense').length).toBe(USER_OBJECTIVES.length)
  })

  it.each(USER_OBJECTIVES.map((o) => [o.id, o]))('%s has a job, cue, price and valid conf', (_, o) => {
    expect(['offense', 'defense']).toContain(o.side)
    expect(o.label).toBeTruthy()
    expect(o.group).toBeTruthy()
    expect(o.positions.length).toBeGreaterThan(0)
    const legal = o.side === 'defense' ? DEF_POSITIONS : OFF_POSITIONS
    for (const p of o.positions) expect(legal).toContain(p)
    expect(o.job.length).toBeGreaterThan(20)
    expect(o.cue).toBeTruthy()
    expect(o.beats.length).toBeGreaterThan(0)
    expect(o.exposes.length).toBeGreaterThan(0)
    expect(Object.keys(CONFIDENCE)).toContain(o.conf)
    expect(o.source).toBeTruthy()
  })

  it('looks up by id and groups by side', () => {
    expect(objectiveById('mof-deep-user').side).toBe('defense')
    expect(objectiveById('nope')).toBeUndefined()
    const groups = objectiveGroups('offense')
    expect(groups.flatMap((g) => g.items).every((o) => o.side === 'offense')).toBe(true)
  })

  it('makes a blank row that passes its own checks', () => {
    for (const side of ['offense', 'defense']) {
      const row = blankObjective(side)
      expect(PHASES.map((p) => p.id)).toContain(row.phase)
      expect(objectiveById(row.id).positions).toContain(row.player)
      const checks = checkUserObjectives({ side, userObjectives: [row] })
      expect(checks.filter((c) => c.level !== 'info')).toEqual([])
    }
    expect(PHASES.map((p) => p.id)).toContain(defaultPhase('unknown'))
  })
})

describe('checkUserObjectives', () => {
  it('warns no-user on a defense with neither text nor objectives', () => {
    const c = byCode(checkUserObjectives({ side: 'defense', user: '' }), 'no-user')
    expect(c).toHaveLength(1)
    expect(c[0].level).toBe('warn')
  })

  it('only notes no-user on offense', () => {
    const c = byCode(checkUserObjectives({ side: 'offense' }), 'no-user')
    expect(c).toHaveLength(1)
    expect(c[0].level).toBe('info')
  })

  it('accepts legacy free text alone (old saved packages)', () => {
    expect(checkUserObjectives({ side: 'defense', user: 'FS Bates. Bail deep.' })).toEqual([])
  })

  it('accepts objectives without free text', () => {
    const checks = checkUserObjectives({
      side: 'defense',
      userObjectives: [{ id: 'mof-deep-user', phase: 'snap', player: 'FS', note: '' }],
    })
    expect(codes(checks)).not.toContain('no-user')
  })

  it('errors on an unknown objective', () => {
    const c = byCode(checkUserObjectives({ side: 'defense', userObjectives: [{ id: 'ghost', phase: 'snap', player: 'FS' }] }), 'unknown-objective')
    expect(c).toHaveLength(1)
    expect(c[0].level).toBe('error')
  })

  it('errors when the objective belongs to the other side', () => {
    const c = byCode(
      checkUserObjectives({ side: 'offense', userObjectives: [{ id: 'mof-deep-user', phase: 'snap', player: 'QB' }] }),
      'objective-side',
    )
    expect(c).toHaveLength(1)
    expect(c[0].level).toBe('error')
  })

  it('warns when the player is not built for the job', () => {
    const checks = checkUserObjectives({ side: 'defense', userObjectives: [{ id: 'mof-deep-user', phase: 'snap', player: 'DT' }] })
    const c = byCode(checks, 'objective-position')
    expect(c).toHaveLength(1)
    expect(c[0].level).toBe('warn')
    const ok = checkUserObjectives({ side: 'defense', userObjectives: [{ id: 'mof-deep-user', phase: 'snap', player: 'FS' }] })
    expect(codes(ok)).not.toContain('objective-position')
  })

  it('warns one-man-two-jobs only within the same phase', () => {
    const same = checkUserObjectives({
      side: 'defense',
      userObjectives: [
        { id: 'mof-deep-user', phase: 'snap', player: 'FS' },
        { id: 'run-fit-flow', phase: 'snap', player: 'FS' },
      ],
    })
    expect(byCode(same, 'one-man-two-jobs')).toHaveLength(1)
    expect(byCode(same, 'one-man-two-jobs')[0].level).toBe('warn')
    const split = checkUserObjectives({
      side: 'defense',
      userObjectives: [
        { id: 'bail-safety', phase: 'pre', player: 'FS' },
        { id: 'mof-deep-user', phase: 'snap', player: 'FS' },
      ],
    })
    expect(codes(split)).not.toContain('one-man-two-jobs')
  })

  it('prices every objective with its exposes', () => {
    const checks = checkUserObjectives({
      side: 'offense',
      userObjectives: [
        { id: 'qb-scramble-user', phase: 'post', player: 'QB' },
        { id: 'pass-pro-pickup', phase: 'snap', player: 'HB' },
      ],
    })
    const price = byCode(checks, 'objective-price')
    expect(price).toHaveLength(2)
    expect(price.every((c) => c.level === 'info')).toBe(true)
    expect(price[0].msg).toContain(objectiveById('qb-scramble-user').exposes[0])
  })
})
