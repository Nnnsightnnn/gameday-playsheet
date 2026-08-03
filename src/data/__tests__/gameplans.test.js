// Every curated game-plan play must exist in the shipped CFB 27 catalog,
// belong to a real situation block, and carry a note that fits the slot.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { GAME_PLANS } from '../gameplans'
import { SITUATIONS } from '../situations'

const catalog = JSON.parse(
  readFileSync(
    new URL('../../../public/data/playbooks-cfb27.json', import.meta.url),
    'utf8',
  ),
)

const catalogIds = new Map() // playId -> play name
for (const pb of catalog.playbooks)
  for (const fg of pb.formationGroups)
    for (const f of fg.formations)
      for (const p of f.plays) catalogIds.set(p.id, p.name)

describe.each(GAME_PLANS)('game plan: $name', (plan) => {
  const sides = ['offense', 'defense']

  it.each(sides)('%s uses only real situation ids', (side) => {
    const valid = new Set(SITUATIONS[side].map((s) => s.id))
    for (const sit of Object.keys(plan[side])) {
      expect(valid.has(sit), `unknown situation "${sit}"`).toBe(true)
    }
  })

  it.each(sides)('%s playIds all exist in the CFB 27 catalog', (side) => {
    for (const plays of Object.values(plan[side])) {
      for (const p of plays) {
        expect(catalogIds.has(p.playId), `missing ${p.playId}`).toBe(true)
      }
    }
  })

  it.each(sides)('%s play names match the catalog', (side) => {
    for (const plays of Object.values(plan[side])) {
      for (const p of plays) {
        expect(catalogIds.get(p.playId)).toBe(p.name)
      }
    }
  })

  it.each(sides)('%s notes are short enough for the slot', (side) => {
    for (const plays of Object.values(plan[side])) {
      for (const p of plays) {
        expect(p.note, `note missing on ${p.name}`).toBeTruthy()
        expect(p.note.length, `note too long on ${p.name}`).toBeLessThanOrEqual(60)
      }
    }
  })

  it.each(sides)('%s has no duplicate plays within a situation', (side) => {
    for (const [sit, plays] of Object.entries(plan[side])) {
      const ids = plays.map((p) => p.playId)
      expect(new Set(ids).size, `duplicate in ${sit}`).toBe(ids.length)
    }
  })
})
