import { describe, expect, it } from 'vitest'
import { applySheetChanges, validateProposal } from '../sheetChanges'
import { contentForHistory, runTool } from '../tools'

const playbooks = [
  {
    name: 'Falcons',
    type: 'offense',
    formationGroups: [
      { name: 'Gun', formations: [{ name: 'Gun Bunch TE', plays: [{ id: 'mesh', name: 'MESH', type: 'pass' }] }] },
    ],
  },
  {
    name: 'Falcons D',
    type: 'defense',
    formationGroups: [
      { name: 'Nickel', formations: [{ name: 'Nickel', plays: [{ id: 'c3', name: 'COVER 3', type: 'pass' }] }] },
    ],
  },
]
const stick = { playId: 'stick', name: 'STICK', myNote: 'mine', note: 'old' }
const sheet = { offense: { openers: [stick] }, defense: {} }
const change = (action, playId, note = '', situationId = 'openers', position = -1) => ({ action, playId, situationId, note, position })

describe('validateProposal', () => {
  it('hydrates a catalog play from the id alone', () => {
    const { errors, changes } = validateProposal({ side: 'offense', changes: [change('add', 'mesh')] }, playbooks, sheet)
    expect(errors).toEqual([])
    expect(changes[0].play).toEqual({ playId: 'mesh', name: 'MESH', type: 'pass', formation: 'Gun Bunch TE', playbook: 'Falcons' })
  })

  it('rejects an invented play, the wrong side, a bad block and a duplicate', () => {
    const run = (c) => validateProposal({ side: 'offense', changes: [c] }, playbooks, sheet).errors
    expect(run(change('add', 'made-up'))).toHaveLength(1)
    expect(run(change('add', 'c3'))).toHaveLength(1)
    expect(run(change('add', 'mesh', '', 'nope'))).toHaveLength(1)
    expect(run(change('add', 'stick'))).toHaveLength(1)
    expect(run(change('remove', 'mesh'))).toHaveLength(1)
  })

  it('rejects an empty proposal', () => {
    expect(validateProposal({ side: 'offense', changes: [] }, playbooks, sheet).errors).toHaveLength(1)
  })
})

describe('applySheetChanges', () => {
  const play = { playId: 'mesh', name: 'MESH' }

  it('adds, removes and sets the coaching note without touching myNote', () => {
    const added = applySheetChanges(sheet.offense, [{ action: 'add', situationId: 'openers', play, note: 'n' }])
    expect(added.sideSheet.openers.map((p) => p.playId)).toEqual(['stick', 'mesh'])
    expect(added.sideSheet.openers[1].note).toBe('n')

    const noted = applySheetChanges(sheet.offense, [{ action: 'set_note', situationId: 'openers', play: stick, note: 'new' }])
    expect(noted.sideSheet.openers[0]).toMatchObject({ note: 'new', myNote: 'mine' })

    const removed = applySheetChanges(sheet.offense, [{ action: 'remove', situationId: 'openers', play: stick }])
    expect(removed.sideSheet.openers).toEqual([])
  })

  it('adds at a position and moves within a block', () => {
    const list = { openers: [{ playId: 'a' }, { playId: 'b' }, { playId: 'c' }] }
    const added = applySheetChanges(list, [{ action: 'add', situationId: 'openers', play, position: 1 }])
    expect(added.sideSheet.openers.map((p) => p.playId)).toEqual(['a', 'mesh', 'b', 'c'])
    const moved = applySheetChanges(list, [{ action: 'move', situationId: 'openers', play: { playId: 'c' }, position: 0 }])
    expect(moved.sideSheet.openers.map((p) => p.playId)).toEqual(['c', 'a', 'b'])
    const toEnd = applySheetChanges(list, [{ action: 'move', situationId: 'openers', play: { playId: 'a' }, position: -1 }])
    expect(toEnd.sideSheet.openers.map((p) => p.playId)).toEqual(['b', 'c', 'a'])
  })

  it('skips what no longer fits and leaves the input alone', () => {
    const r = applySheetChanges(sheet.offense, [
      { action: 'add', situationId: 'openers', play: stick },
      { action: 'remove', situationId: 'openers', play },
    ])
    expect(r).toMatchObject({ applied: 0, skipped: 2 })
    expect(sheet.offense.openers).toHaveLength(1)
  })
})

describe('runTool', () => {
  const ctx = { game: 'madden', playbooks, sheet, debriefs: [] }

  it('always answers, as an error when the tool fails', async () => {
    const { result } = await runTool({ id: 't1', name: 'nope', input: {} }, ctx)
    expect(result).toMatchObject({ tool_use_id: 't1', is_error: true })
  })

  it('lists a whole formation and rejects a formation that is not there', async () => {
    const input = { side: 'offense', playbook: 'Falcons', formation: 'Gun Bunch TE' }
    const { result } = await runTool({ id: 't5', name: 'get_formation_plays', input }, ctx)
    expect(JSON.parse(result.content).plays).toEqual([{ playId: 'mesh', name: 'MESH', type: 'pass' }])
    const missing = await runTool({ id: 't6', name: 'get_formation_plays', input: { ...input, formation: 'Nope' } }, ctx)
    expect(missing.result.is_error).toBe(true)
  })

  it('turns a valid change into a write and a rejected one into an error', async () => {
    const good = await runTool(
      { id: 't2', name: 'change_sheet', input: { side: 'offense', summary: 's', changes: [change('add', 'mesh')] } },
      ctx,
    )
    expect(good.change).toMatchObject({ game: 'madden', side: 'offense' })
    expect(good.result.is_error).toBeUndefined()

    const bad = await runTool(
      { id: 't3', name: 'change_sheet', input: { side: 'offense', summary: 's', changes: [change('add', 'x')] } },
      ctx,
    )
    expect(bad.change).toBeUndefined()
    expect(bad.result.is_error).toBe(true)
  })

  it('searches the named book first', async () => {
    const { result } = await runTool({ id: 't4', name: 'search_plays', input: { query: 'mesh', side: 'offense', playbook: 'Falcons' } }, ctx)
    expect(JSON.parse(result.content).plays[0].playId).toBe('mesh')
  })
})

describe('contentForHistory', () => {
  it('passes normal turns through untouched', () => {
    const content = [{ type: 'thinking' }, { type: 'text' }, { type: 'tool_use' }]
    expect(contentForHistory(content)).toBe(content)
  })

  it('keeps only text from before the last fallback marker', () => {
    const content = [{ type: 'thinking', k: 1 }, { type: 'text', k: 2 }, { type: 'tool_use', k: 3 }, { type: 'fallback', k: 4 }, { type: 'thinking', k: 5 }, { type: 'text', k: 6 }]
    expect(contentForHistory(content).map((b) => b.k)).toEqual([2, 5, 6])
  })
})

describe('whole-plan tools', () => {
  const pkg = (id, side, slot, active = true) => ({ id, name: id, side, game: 'madden', slot, active })
  const list = [pkg('a', 'defense', 1), pkg('b', 'defense', 2)]
  const run = (name, input, ctx) => runTool({ id: 'x', name, input }, { game: 'madden', ...ctx })

  it('reports threats no active package answers', async () => {
    const { result } = await run('get_packages', {}, { packages: list, arsenal: { slots: {} } })
    const body = JSON.parse(result.content)
    expect(body.packages[0]).toMatchObject({ id: 'a', slot: 1, active: true })
    expect(body.uncoveredThreats.defense.length).toBeGreaterThan(0)
  })

  it('only returns threats for the open game', async () => {
    const { result } = await run('get_meta_threats', {}, {})
    const { threats } = JSON.parse(result.content)
    expect(threats.length).toBeGreaterThan(0)
    expect(threats.every((t) => t.game === 'madden')).toBe(true)
  })

  it('refuses a taken macro slot without writing', async () => {
    const saves = []
    const saveSlot = (...args) => saves.push(args)
    const clash = await run('set_package_arsenal', { packageId: 'b', slot: 1, active: true }, { packages: list, arsenal: { slots: {} }, saveSlot })
    expect(clash.result.is_error).toBe(true)
    expect(saves).toEqual([])
    const ok = await run('set_package_arsenal', { packageId: 'b', slot: 0, active: true }, { packages: list, arsenal: { slots: {} }, saveSlot })
    expect(ok.result.is_error).toBeUndefined()
    expect(saves[0]).toEqual(['madden', 'b', { slot: null, active: false }])
  })

  it('reads a coverage and rejects an unknown one', async () => {
    const { result } = await run('get_coverage', { id: '' }, {})
    expect(JSON.parse(result.content).ids.length).toBeGreaterThan(5)
    expect((await run('get_coverage', { id: 'nope' }, {})).result.is_error).toBe(true)
  })

  it('keeps scouting to Madden', async () => {
    const r = await runTool({ id: 'x', name: 'get_scouting', input: { team: '' } }, { game: 'cfb' })
    expect(r.result.is_error).toBe(true)
  })
})
