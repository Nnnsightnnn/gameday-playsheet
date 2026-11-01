// Where you are on the call map: one section open, one play pinned. Pure so the
// rules for a removed play or a stale saved place stay testable. A section here
// is a situation block plus its plays: { id, name, sub, color, plays }.

export function buildSections(situations, assignments) {
  return situations.map((s) => ({ ...s, plays: assignments[s.id] || [] }))
}

// A saved place can outlive its play or section, so always land somewhere real.
export function resolvePlace(sections, saved) {
  const section =
    sections.find((s) => s.id === saved?.sectionId) ??
    sections.find((s) => s.plays.length > 0) ??
    sections[0] ??
    null
  if (!section) return { sectionId: null, playId: null }
  const kept = section.plays.some((p) => p.playId === saved?.playId)
  return {
    sectionId: section.id,
    playId: kept ? saved.playId : (section.plays[0]?.playId ?? null),
  }
}

// Stops at the ends of a section rather than wrapping, so the pinned play never
// changes section without you asking.
export function stepPlay(section, playId, delta) {
  const plays = section?.plays ?? []
  const next = plays[plays.findIndex((p) => p.playId === playId) + delta]
  return next ? next.playId : playId
}

// Skips empty sections: stepping through the sheet is for finding plays.
export function stepSection(sections, sectionId, delta) {
  let i = sections.findIndex((s) => s.id === sectionId) + delta
  while (i >= 0 && i < sections.length) {
    if (sections[i].plays.length > 0) return sections[i].id
    i += delta
  }
  return sectionId
}

// Who gets pinned when a play is removed: the one that takes its row, or the new
// last row. Jumping back to the top would lose your place mid-cleanup.
export function afterRemove(section, playId) {
  const plays = section?.plays ?? []
  const i = plays.findIndex((p) => p.playId === playId)
  return (plays[i + 1] ?? plays[i - 1])?.playId ?? null
}
