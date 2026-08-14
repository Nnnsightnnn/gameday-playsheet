// built by nnnsightnnn — signal from noise
// Registry of team role sheets. Add a team by writing personnel-<team>.js
// and listing it here — nothing else needs to change.

import { FALCONS_PERSONNEL } from './personnel-falcons';

export const PERSONNEL_PLANS = [FALCONS_PERSONNEL];

export function plansForGame(game) {
  return PERSONNEL_PLANS.filter((p) => p.game === game);
}

export function planById(id) {
  return PERSONNEL_PLANS.find((p) => p.id === id) || null;
}
