// Quick add: type a few letters, get plays from the books you actually run. The
// catalog holds 86 books that repeat play names, so searching all of them first
// would bury your own play under other teams' copies.

const LIMIT = 8

export function booksOnSheet(sideAssign) {
  const books = new Set()
  for (const plays of Object.values(sideAssign || {})) {
    for (const p of plays) if (p.playbook) books.add(p.playbook)
  }
  return books
}

// Every word must appear in the play name or formation. A name that starts with
// the query beats one that merely contains it, and name beats formation.
function score(name, formation, words, query) {
  const hay = name + ' ' + formation
  if (!words.every((w) => hay.includes(w))) return null
  if (name.startsWith(query)) return 0
  if (name.split(' ').some((w) => w.startsWith(words[0]))) return 1
  if (name.includes(words[0])) return 2
  return 3
}

function collect(playbooks, side, books, query) {
  const words = query.split(/\s+/).filter(Boolean)
  const found = []
  for (const pb of playbooks) {
    if (pb.type !== side || (books && !books.has(pb.name))) continue
    for (const g of pb.formationGroups || []) {
      for (const f of g.formations || []) {
        const formation = f.name.toLowerCase()
        for (const p of f.plays || []) {
          const rank = score(p.name.toLowerCase(), formation, words, query)
          if (rank === null) continue
          found.push({
            rank,
            play: {
              playId: p.id,
              name: p.name,
              type: p.type,
              playbook: pb.name,
              formation: f.name,
            },
          })
        }
      }
    }
  }
  return found
}

export function searchQuick(playbooks, query, side, sideAssign) {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const books = booksOnSheet(sideAssign)
  let found = books.size ? collect(playbooks, side, books, q) : []
  if (!found.length) found = collect(playbooks, side, null, q)
  return found
    .sort((a, b) => a.rank - b.rank || a.play.name.localeCompare(b.play.name))
    .slice(0, LIMIT)
    .map((f) => f.play)
}
