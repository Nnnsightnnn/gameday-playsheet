// Package engine — pure football logic for custom adjustment packages.
//
// A package is one call plus a stack of adjustments, saved as a Madden 27
// macro, built to beat a named meta. The engine answers four questions
// without React:
//   1. What does the offense see, and what are they actually facing?
//      (shell and rush shown vs played → a disguise score)
//   2. Is the stack sound? (arithmetic, duplicate assignments, patch traps)
//   3. In what order do I program it? (a menu-ordered macro recipe)
//   4. Does my arsenal cover the meta, inside the 20-built / 10-active caps?
//
// Package shape (curated in src/data/packages-*.js, custom in Dexie):
// { id, game, side, name, tagline, playbook,
//   base: { playId, name, formation }, twins: [{ playId, name, role }],
//   counters: [threatId], user,
//   look:  { shell, rush, press, picture },     // what they see pre-snap
//   truth: { shell, rush, deep, coverage },     // what happens at the snap
//   adjustments: [{ adj, value, target?, why, conf }],
//   beats: [str], losesTo: [str], checkout: { playId, name, when },
//   tells: [str], call: str, conf }
// Offensive packages use look.picture + truth.blockers/releases instead of
// shells; the engine derives releases from the block adjustments.

import { adjustmentById, MENUS, FLIP_FRAGILE, SHELLS } from './vocab.js'
import { threatById, threatsFor } from './metas.js'

export const MACRO_CAP = { built: 20, active: 10 }

const shellLabel = (n) => SHELLS.find((s) => s.id === n)?.short ?? '?'

// ── disguise ──────────────────────────────────────────────────────────────
// How far the pre-snap picture is from the post-snap truth, 0-100. Shell is
// the structure the QB reads (0 none deep, 1 middle closed, 2 middle open,
// 3 three high). Each step of shell change is worth 25, each phantom (or
// hidden) rusher 12 up to three, pressed corners that bail into zone 13, and
// a rotation that moves the help 15.
export function disguiseScore(pkg) {
  if (pkg.side !== 'defense') return offenseDisguise(pkg)
  const look = pkg.look || {}
  const truth = pkg.truth || {}
  const shellDelta = Math.abs((look.shell ?? 0) - (truth.shell ?? 0))
  const rushDelta = Math.abs((look.rush ?? 4) - (truth.rush ?? 4))
  const pressBail = look.press && (truth.deep ?? 0) >= 2 ? 13 : 0
  // A shell change that also rotates (roll or an offset midpoint) moves the
  // help after the snap, which is the part a pre-snap read cannot see.
  const rotates = shellDelta > 0 &&
    (pkg.adjustments || []).some((a) => a.adj === 'roll' || a.adj === 'safety-midpoint')
  const score = Math.min(
    100,
    shellDelta * 25 + Math.min(rushDelta, 3) * 12 + pressBail + (rotates ? 15 : 0),
  )
  return { score, band: band(score), shellDelta, rushDelta, pressBail: pressBail > 0, rotates }
}

// An offensive package disguises by giving one picture several endings: every
// twin out of the same formation is another answer the defense cannot rule out.
function offenseDisguise(pkg) {
  const twins = (pkg.twins || []).length
  const types = new Set([pkg.base?.type, ...(pkg.twins || []).map((t) => t.type)].filter(Boolean))
  const score = Math.min(100, twins * 20 + (types.size > 1 ? 30 : 0))
  return { score, band: band(score), twins, mixesRunPass: types.size > 1 }
}

function band(score) {
  if (score >= 60) return 'heavy'
  if (score >= 35) return 'solid'
  if (score > 0) return 'light'
  return 'none'
}

// ── arithmetic ────────────────────────────────────────────────────────────
export function countDefense(pkg) {
  const rush = pkg.truth?.rush ?? 4
  const deep = pkg.truth?.deep ?? 0
  const droppers = 11 - rush
  return { rush, deep, droppers, under: droppers - deep }
}

export function countOffense(pkg) {
  const blocksIn = (pkg.adjustments || []).filter(
    (a) => a.adj === 'ind-block' && a.value === 'Pass Block',
  ).length
  const chips = (pkg.adjustments || []).filter(
    (a) => a.adj === 'ind-block' && a.value === 'Chip then Release',
  ).length
  const baseBlockers = pkg.truth?.blockers ?? 5
  const blockers = baseBlockers + blocksIn
  const releases = Math.max(0, (pkg.truth?.releases ?? 5) - blocksIn)
  return { blockers, releases, chips, firstBeat: blockers + chips }
}

// ── checks ────────────────────────────────────────────────────────────────
// Each check: { level: 'error' | 'warn' | 'info', code, msg }. Errors mean
// the package is wrong; warnings mean it has a price you should name.
export function checkPackage(pkg, catalog) {
  const out = []
  const push = (level, code, msg) => out.push({ level, code, msg })
  const adjs = pkg.adjustments || []

  // vocabulary + duplicate targets
  const seenTarget = new Map()
  for (const a of adjs) {
    const def = adjustmentById(a.adj)
    if (!def) {
      push('error', 'unknown-adj', `Unknown adjustment "${a.adj}".`)
      continue
    }
    if (def.side !== pkg.side)
      push('error', 'wrong-side', `${def.label} is a ${def.side} adjustment on a ${pkg.side} package.`)
    if (!def.options.includes(a.value))
      push('error', 'bad-value', `${def.label}: "${a.value}" is not an option.`)
    if (def.target && !a.target)
      push('error', 'no-target', `${def.label} needs a player to apply to.`)
    if (def.target && a.target && def.kind !== 'none') {
      const prev = seenTarget.get(a.target)
      if (prev)
        push('error', 'double-assign', `${a.target} has two jobs: ${prev} and ${def.label}.`)
      else seenTarget.set(a.target, def.label)
    }
  }

  // catalog: base, twins and checkout must be real, and twins must share the
  // base formation or they are not the same look.
  if (catalog) {
    const base = catalog.get(pkg.base?.playId)
    if (!pkg.base?.playId) push('error', 'no-base', 'Pick a base call.')
    else if (!base) push('error', 'no-base', `Base call "${pkg.base.name || pkg.base.playId}" is not in the catalog.`)
    for (const t of pkg.twins || []) {
      const tp = catalog.get(t.playId)
      if (!tp) push('error', 'no-twin', `Twin "${t.name}" is not in the catalog.`)
      else if (base && tp.formation !== base.formation)
        push('error', 'twin-formation', `${t.name} is out of ${tp.formation}, not ${base.formation}. A twin has to share the look.`)
    }
    if (pkg.checkout?.playId && !catalog.get(pkg.checkout.playId))
      push('error', 'no-checkout-play', `Checkout "${pkg.checkout.name}" is not in the catalog.`)
  }

  // the meta
  if (!(pkg.counters || []).length)
    push('warn', 'no-target-meta', 'No meta named. A package that beats nothing in particular is just a call.')
  for (const id of pkg.counters || []) {
    const t = threatById(id)
    if (!t) push('error', 'unknown-threat', `Unknown meta "${id}".`)
    else if (t.game !== pkg.game) push('error', 'threat-game', `${t.name} is a ${t.game} meta.`)
    else if (t.threat === pkg.side)
      push('error', 'threat-side', `${t.name} is a ${t.threat} meta; a ${pkg.side} package counters the other side.`)
  }

  // every package has a price
  if (!(pkg.losesTo || []).length)
    push('warn', 'no-price', 'Nothing listed under "loses to". Every disguise has a price; name it before they find it.')
  if (!pkg.checkout?.playId)
    push('warn', 'no-checkout', 'No checkout call for when the look is wrong.')

  if (pkg.side === 'defense') defenseChecks(pkg, adjs, push)
  else offenseChecks(pkg, adjs, push)

  const manual = adjs.filter((a) => adjustmentById(a.adj)?.macro === false)
  if (manual.length)
    push('info', 'manual-steps', `${manual.length} step${manual.length > 1 ? 's are' : ' is'} set by hand at the line; the macro will not store ${manual.length > 1 ? 'them' : 'it'}.`)

  return out
}

function defenseChecks(pkg, adjs, push) {
  const { rush, deep, droppers } = countDefense(pkg)
  if (rush < 3 || rush > 8) push('error', 'rush-count', `${rush} rushers is not a football call (3 to 8).`)
  if (deep > droppers) push('error', 'deep-count', `${deep} deep with only ${droppers} droppers.`)
  // Shell is the middle-of-field structure; deep counts every deep defender
  // (a Cover 3 corner is deep but not the shell), so shell can never exceed it.
  if ((pkg.truth?.shell ?? 0) > deep)
    push('error', 'shell-deep', `Played shell is ${shellLabel(pkg.truth.shell)} but only ${deep} defender${deep === 1 ? ' is' : 's are'} deep.`)
  if (deep === 0 && rush < 6)
    push('warn', 'zero-thin', 'Zero deep with fewer than six coming. One missed tackle is six points, so the user is the insurance.')

  const d = disguiseScore(pkg)
  if (d.score === 0)
    push('warn', 'no-disguise', 'The look matches the call. Fine football, but it teaches them nothing false.')

  const has = (id, value) => adjs.some((a) => a.adj === id && (value == null || a.value === value))
  if (has('cov-align', 'Press') && !has('cov-leverage'))
    push('warn', 'press-leverage', 'Press with no leverage set. Since TU Sep 16 a press corner shaded the wrong way loses the release.')
  if ((pkg.counters || []).includes('m27-o-qbrun') && !has('contain-all') && !has('ind-contain') && !has('ind-spy'))
    push('warn', 'qb-escape', 'Built for the QB run but nobody contains or spies.')
  if (has('contain-all') || has('ind-contain'))
    push('info', 'contain-now', 'Since TU Sep 3 tackles pick up contain rushers: contain keeps him in the pocket, it will not win on its own.')
  if (!pkg.user) push('warn', 'no-user', 'No user assignment. Decide who you are before the snap, not after.')
}

function offenseChecks(pkg, adjs, push) {
  const { blockers, releases, firstBeat } = countOffense(pkg)
  if (releases < 1) push('error', 'no-releases', 'Nobody is running a route.')
  for (const id of pkg.counters || []) {
    const t = threatById(id)
    if (!t?.shows) continue
    const hasHot = adjs.some((a) => a.adj === 'hot-route') || pkg.truth?.hotBuiltIn
    if (firstBeat < t.shows && !hasHot)
      push('warn', 'protection', `${t.name} shows ${t.shows} and you block ${firstBeat}. Name a hot or keep another man in.`)
    if (blockers < t.rush)
      push('error', 'outnumbered', `${t.name} brings ${t.rush}; ${blockers} blockers cannot hold it.`)
  }
  const fragile = adjs.filter((a) => a.target && FLIP_FRAGILE.has(a.target))
  if (fragile.length)
    push('warn', 'flip-fragile', `${fragile.map((a) => a.target).join(', ')} adjusted in a macro. Macros bind to the depth chart, so a flipped formation sends the route to the wrong side. Macro TE, HB and WR3; set WR1/WR2 by hand.`)
  if (adjs.some((a) => a.adj === 'block-style' && a.value === 'Aggressive'))
    push('warn', 'holding', 'Aggressive Blocking draws real holding since TU Sep 3.')
}

// ── recipe ────────────────────────────────────────────────────────────────
// Ordered programming steps: menu order first, then the order the package
// lists them. Manual-at-the-line steps come last and are flagged, so the
// macro screen shows exactly what the macro holds.
export function macroRecipe(pkg) {
  return (pkg.adjustments || [])
    .map((a, i) => {
      const def = adjustmentById(a.adj)
      const menu = MENUS[def?.menu] || MENUS.line
      return {
        i,
        order: menu.order,
        menu: menu.label,
        ps: menu.ps,
        xbox: menu.xbox,
        label: def?.label ?? a.adj,
        value: a.value,
        target: a.target || null,
        inMacro: def?.macro !== false,
        why: a.why || '',
        conf: a.conf || def?.conf || 'read',
      }
    })
    .sort((a, b) => a.inMacro === b.inMacro ? a.order - b.order || a.i - b.i : a.inMacro ? -1 : 1)
    .map((s, n) => ({ ...s, step: n + 1 }))
}

// Plain-text version of the recipe for pasting into a note.
export function recipeText(pkg) {
  const lines = [`${pkg.name} (${pkg.base?.formation} · ${pkg.base?.name})`]
  for (const s of macroRecipe(pkg)) {
    const who = s.target ? `${s.target}: ` : ''
    lines.push(`${s.step}. ${s.inMacro ? '' : '[at the line] '}${s.menu} → ${who}${s.label} = ${s.value}`)
  }
  return lines.join('\n')
}

// ── full analysis ─────────────────────────────────────────────────────────
export function analyzePackage(pkg, catalog) {
  const checks = checkPackage(pkg, catalog)
  return {
    disguise: disguiseScore(pkg),
    count: pkg.side === 'defense' ? countDefense(pkg) : countOffense(pkg),
    checks,
    errors: checks.filter((c) => c.level === 'error').length,
    warnings: checks.filter((c) => c.level === 'warn').length,
    recipe: macroRecipe(pkg),
  }
}

// ── arsenal ───────────────────────────────────────────────────────────────
// arsenal: { [pkgId]: { slot, active } } for one game. Returns cap and slot
// problems per side.
export function arsenalChecks(packages, arsenal) {
  const out = []
  for (const side of ['offense', 'defense']) {
    const mine = packages.filter((p) => p.side === side && arsenal[p.id]?.slot)
    const active = mine.filter((p) => arsenal[p.id]?.active)
    if (mine.length > MACRO_CAP.built)
      out.push({ level: 'error', side, code: 'built-cap', msg: `${mine.length} ${side} macros slotted; the game holds ${MACRO_CAP.built}.` })
    if (active.length > MACRO_CAP.active)
      out.push({ level: 'error', side, code: 'active-cap', msg: `${active.length} ${side} macros active; only ${MACRO_CAP.active} come into a game.` })
    const bySlot = new Map()
    for (const p of mine) {
      const s = arsenal[p.id].slot
      if (s < 1 || s > MACRO_CAP.built)
        out.push({ level: 'error', side, code: 'slot-range', msg: `${p.name} is in slot ${s}; slots run 1-${MACRO_CAP.built}.` })
      if (bySlot.has(s))
        out.push({ level: 'error', side, code: 'slot-clash', msg: `${p.name} and ${bySlot.get(s)} both claim ${side} slot ${s}.` })
      else bySlot.set(s, p.name)
    }
  }
  return out
}

// Default arsenal from the packages' own suggested slots, then any saved
// overrides on top. Never written from here; the component persists changes.
export function resolveArsenal(packages, saved = {}) {
  const out = {}
  for (const p of packages) {
    if (p.slot) out[p.id] = { slot: p.slot, active: p.active !== false }
  }
  for (const [id, v] of Object.entries(saved)) out[id] = { ...(out[id] || {}), ...v }
  return out
}

export function nextFreeSlot(packages, arsenal, side) {
  const used = new Set(
    packages.filter((p) => p.side === side).map((p) => arsenal[p.id]?.slot).filter(Boolean),
  )
  for (let s = 1; s <= MACRO_CAP.built; s++) if (!used.has(s)) return s
  return null
}

// Which threats each active package answers, and which threats nothing does.
export function metaCoverage(packages, arsenal, game, side) {
  const threats = threatsFor(game, side)
  const live = packages.filter(
    (p) => p.game === game && p.side === side && arsenal[p.id]?.active,
  )
  return threats.map((t) => {
    const answers = live.filter((p) => (p.counters || []).includes(t.id))
    return { threat: t, answers, gap: answers.length === 0 }
  })
}

// ── catalog ───────────────────────────────────────────────────────────────
// playbooks (as shipped in public/data) → Map(playId → { name, type,
// formation, group, playbook }). `formation` is "<group> <formation>", the
// same string the curated plans use (e.g. "Nickel 2-4 Dbl Mug").
export function buildCatalog(playbooks) {
  const map = new Map()
  for (const pb of playbooks || [])
    for (const fg of pb.formationGroups || [])
      for (const f of fg.formations || [])
        for (const p of f.plays || [])
          map.set(p.id, {
            name: p.name,
            type: p.type,
            formation: `${fg.name} ${f.name}`,
            playbook: pb.id,
            side: pb.type,
          })
  return map
}

// Every play out of one formation in one book: the pool twins come from.
export function formationPlays(playbooks, playbookId, formation) {
  const out = []
  for (const pb of playbooks || []) {
    if (pb.id !== playbookId) continue
    for (const fg of pb.formationGroups || [])
      for (const f of fg.formations || [])
        if (`${fg.name} ${f.name}` === formation)
          for (const p of f.plays || []) out.push({ playId: p.id, name: p.name, type: p.type })
  }
  return out
}

// A fresh, empty package for the editor.
export function blankPackage({ game, side, playbook }) {
  return {
    id: `my-${Date.now().toString(36)}`,
    custom: true,
    game,
    side,
    playbook,
    name: '',
    tagline: '',
    base: null,
    twins: [],
    counters: [],
    user: '',
    look: side === 'defense' ? { shell: 2, rush: 4, press: false, picture: '' } : { picture: '' },
    truth: side === 'defense' ? { shell: 1, rush: 4, deep: 1, coverage: '' } : { blockers: 5, releases: 5, concept: '' },
    adjustments: [],
    beats: [],
    losesTo: [],
    checkout: null,
    tells: [],
    call: '',
    conf: 'read',
  }
}
