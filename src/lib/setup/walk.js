// Where the favorites walk stands. The cursor is the first unchecked play, so
// it is derived from the persisted checks and survives leaving the page.
// Everything before the cursor is checked by definition, which is what makes
// "back" a plain uncheck of the previous play.

const UPCOMING = 2

export function walkPosition(sequence, checks) {
  const found = sequence.findIndex((e) => !checks[e.play.playId])
  const index = found === -1 ? sequence.length : found
  return {
    index,
    total: sequence.length,
    current: sequence[index] ?? null,
    previous: sequence[index - 1] ?? null,
    upcoming: sequence.slice(index + 1, index + 1 + UPCOMING),
  }
}
