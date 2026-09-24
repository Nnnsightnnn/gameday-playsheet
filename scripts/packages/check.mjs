// Usage: node scripts/packages/check.mjs <file.mjs>   (package-scout skill, gate G1)
// The slice file must `export default` one package object (same shape as src/data/packages-falcons.js entries).
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
const repo = new URL('../..', import.meta.url).pathname.replace(/\/$/, '')
const { buildCatalog, analyzePackage } = await import(`${repo}/src/lib/packages/engine.js`)
const { PACKAGES } = await import(`${repo}/src/data/packages.js`)
const pkg = (await import(pathToFileURL(resolve(process.argv[2])).href)).default
const book = pkg.game === 'cfb' ? 'playbooks-cfb27.json' : 'playbooks.json'
const cat = buildCatalog(JSON.parse(readFileSync(`${repo}/public/data/${book}`, 'utf8')).playbooks)
const a = analyzePackage(pkg, cat)
const probs = []
for (const p of [pkg.base, ...(pkg.twins || []), pkg.checkout].filter(Boolean)) {
  const c = cat.get(p.playId)
  if (!c) probs.push(`not in catalog: ${p.playId}`)
  else { if (c.name !== p.name) probs.push(`name mismatch ${p.playId}: ${c.name}`); if (c.playbook !== pkg.playbook) probs.push(`wrong book ${p.playId}`) }
}
for (const x of pkg.adjustments || []) if (!x.why || x.why.length <= 30) probs.push(`short why: ${x.adj}`)
if (PACKAGES.some((p) => p.id !== pkg.id && p.base.playId === pkg.base?.playId)) probs.push('base call already used by a curated package')
console.log(JSON.stringify({ disguise: a.disguise, count: a.count, checks: a.checks, harness: probs, recipe: a.recipe.map((s) => `${s.step}. ${s.menu} ${s.target || ''} ${s.label}=${s.value}`) }, null, 1))
process.exit(a.errors || probs.length ? 1 : 0)
