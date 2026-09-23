// Registry of curated custom adjustment packages (Madden 27 macros).
// Kenny's own packages live in Dexie (macroPackages); these are the shipped,
// test-enforced ones. See src/lib/packages/engine.js for the shape.
import { FALCONS_PACKAGES } from './packages-falcons.js'

export const PACKAGES = [...FALCONS_PACKAGES]

export const packagesForGame = (game) => PACKAGES.filter((p) => p.game === game)
