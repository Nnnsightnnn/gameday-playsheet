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
const change = (action, playId, note = '', situationId = 'openers') => ({ action, playId, situationId, note })

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

  it('turns a valid proposal into an open card and a rejected one into an error', async () => {
    const good = await runTool(
      { id: 't2', name: 'propose_sheet_changes', input: { side: 'offense', summary: 's', changes: [change('add', 'mesh')] } },
      ctx,
    )
    expect(good.proposal).toMatchObject({ game: 'madden', side: 'offense', status: 'open' })
    expect(good.result.is_error).toBeUndefined()

    const bad = await runTool(
      { id: 't3', name: 'propose_sheet_changes', input: { side: 'offense', summary: 's', changes: [change('add', 'x')] } },
      ctx,
    )
    expect(bad.proposal).toBeUndefined()
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
