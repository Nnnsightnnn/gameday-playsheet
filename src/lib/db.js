import Dexie from 'dexie';
import { SHEET_SEED } from '../data/seed';
import { OLE_MISS_PLAN } from '../data/gameplans';
import { starterFormations } from './field/formationFactory';

export const db = new Dexie('GamedayPlaysheet');

db.version(1).stores({
  // My custom playsheet - plays I've selected
  myPlays: '++id, playId, playbook, formationGroup, formation, playName, playType, tags, notes, rating, addedAt',

  // Game sessions for post-game review
  gameSessions: '++id, opponent, date, result, notes',

  // Play performance in games
  playPerformance: '++id, sessionId, playId, callCount, successCount, yardsGained, notes'
});

// Version 2: Add game context persistence
db.version(2).stores({
  myPlays: '++id, playId, playbook, formationGroup, formation, playName, playType, tags, notes, rating, addedAt',
  gameSessions: '++id, opponent, date, result, notes',
  playPerformance: '++id, sessionId, playId, callCount, successCount, yardsGained, notes',
  // Game context for planning (down, distance, field position) - persists until cleared
  gameContext: 'id'
});

// Version 3: Add side field for offense/defense separation
db.version(3).stores({
  myPlays: '++id, playId, playbook, formationGroup, formation, playName, playType, side, tags, notes, rating, addedAt',
  gameSessions: '++id, opponent, date, result, notes',
  playPerformance: '++id, sessionId, playId, callCount, successCount, yardsGained, notes',
  gameContext: 'id'
});

// Version 4: Add sheetAssignments table for the laminated call-sheet
// One record keyed by id ('sheet') containing { offense: { [situationId]: [plays] }, defense: {...} }
db.version(4).stores({
  myPlays: '++id, playId, playbook, formationGroup, formation, playName, playType, side, tags, notes, rating, addedAt',
  gameSessions: '++id, opponent, date, result, notes',
  playPerformance: '++id, sessionId, playId, callCount, successCount, yardsGained, notes',
  gameContext: 'id',
  sheetAssignments: 'id',
  sheetSettings: 'id'
});

// Version 5: Formation Planner — saved field formations (multi-row, string PK)
db.version(5).stores({
  myPlays: '++id, playId, playbook, formationGroup, formation, playName, playType, side, tags, notes, rating, addedAt',
  gameSessions: '++id, opponent, date, result, notes',
  playPerformance: '++id, sessionId, playId, callCount, successCount, yardsGained, notes',
  gameContext: 'id',
  sheetAssignments: 'id',
  sheetSettings: 'id',
  formations: 'id, side, name, updatedAt'
});

// Version 6: Favorites-setup checklist — one row keyed by id ('checks')
// holding { byGame: { madden: { offense: { [playId]: true }, defense: {...} }, cfb: {...} } }.
// Tracks which sheet plays Kenny has already added to in-game favorites.
db.version(6).stores({
  myPlays: '++id, playId, playbook, formationGroup, formation, playName, playType, side, tags, notes, rating, addedAt',
  gameSessions: '++id, opponent, date, result, notes',
  playPerformance: '++id, sessionId, playId, callCount, successCount, yardsGained, notes',
  gameContext: 'id',
  sheetAssignments: 'id',
  sheetSettings: 'id',
  formations: 'id, side, name, updatedAt',
  setupChecks: 'id'
});

// Version 7: Saved call sheets — named snapshots of one game's sheet
// (multi-row, string PK, same offense/defense shape as a game plan so
// applyGamePlan can load them unchanged).
db.version(7).stores({
  myPlays: '++id, playId, playbook, formationGroup, formation, playName, playType, side, tags, notes, rating, addedAt',
  gameSessions: '++id, opponent, date, result, notes',
  playPerformance: '++id, sessionId, playId, callCount, successCount, yardsGained, notes',
  gameContext: 'id',
  sheetAssignments: 'id',
  sheetSettings: 'id',
  formations: 'id, side, name, updatedAt',
  setupChecks: 'id',
  callSheets: 'id, name, game, updatedAt'
});

// Version 8: Skill assessments — dated self-rating snapshots against the
// skill taxonomy (src/data/skills.js). Row: { id, createdAt, ratings:
// { [skillId]: 1-5 }, note }. Multi-row, string PK.
db.version(8).stores({
  myPlays: '++id, playId, playbook, formationGroup, formation, playName, playType, side, tags, notes, rating, addedAt',
  gameSessions: '++id, opponent, date, result, notes',
  playPerformance: '++id, sessionId, playId, callCount, successCount, yardsGained, notes',
  gameContext: 'id',
  sheetAssignments: 'id',
  sheetSettings: 'id',
  formations: 'id, side, name, updatedAt',
  setupChecks: 'id',
  callSheets: 'id, name, game, updatedAt',
  skillAssessments: 'id, createdAt'
});

// Version 9: Lab plans — generated weekly deliberate-practice schedules.
// Row: { id, weekOf, createdAt, skillId, skillName, sessions: [...] }.
db.version(9).stores({
  myPlays: '++id, playId, playbook, formationGroup, formation, playName, playType, side, tags, notes, rating, addedAt',
  gameSessions: '++id, opponent, date, result, notes',
  playPerformance: '++id, sessionId, playId, callCount, successCount, yardsGained, notes',
  gameContext: 'id',
  sheetAssignments: 'id',
  sheetSettings: 'id',
  formations: 'id, side, name, updatedAt',
  setupChecks: 'id',
  callSheets: 'id, name, game, updatedAt',
  skillAssessments: 'id, createdAt',
  labPlans: 'id, weekOf'
});

// Version 10: Personnel Lab — one row per team role sheet holding Kenny's
// working notes against it. Row: { id: '<game>:<planId>', planId, game,
// know: { [roleId]: { rating: 1-5, player, note } }, updatedAt }.
// The role definitions themselves are static data (src/data/personnel-*.js);
// only what Kenny knows and who he actually starts is persisted.
db.version(10).stores({
  myPlays: '++id, playId, playbook, formationGroup, formation, playName, playType, side, tags, notes, rating, addedAt',
  gameSessions: '++id, opponent, date, result, notes',
  playPerformance: '++id, sessionId, playId, callCount, successCount, yardsGained, notes',
  gameContext: 'id',
  sheetAssignments: 'id',
  sheetSettings: 'id',
  formations: 'id, side, name, updatedAt',
  setupChecks: 'id',
  callSheets: 'id, name, game, updatedAt',
  skillAssessments: 'id, createdAt',
  labPlans: 'id, weekOf',
  personnelCharts: 'id, planId, game, updatedAt'
});

// Sheet assignments helpers — fresh-object factories so the module-level
// defaults are never aliased into the live React state.
//
// Storage shape (per game, so the Madden sheet and the CFB sheet never
// clobber each other): { id: 'sheet', byGame: { madden: { offense, defense },
// cfb: { offense, defense } } }. Legacy rows ({ id, offense, defense }) are
// migrated into byGame.madden (the original seed was Eagles/49ers).
const SHEET_ID = 'sheet';

function freshSheetSeed() {
  return {
    id: SHEET_ID,
    byGame: {
      madden: {
        offense: structuredClone(SHEET_SEED.offense),
        defense: structuredClone(SHEET_SEED.defense),
      },
      cfb: {
        offense: structuredClone(OLE_MISS_PLAN.offense),
        defense: structuredClone(OLE_MISS_PLAN.defense),
      },
    },
  };
}

function migrateSheetRow(row) {
  if (!row || row.byGame) return row;
  return {
    id: SHEET_ID,
    byGame: {
      madden: {
        offense: row.offense || {},
        defense: row.defense || {},
      },
      cfb: {
        offense: structuredClone(OLE_MISS_PLAN.offense),
        defense: structuredClone(OLE_MISS_PLAN.defense),
      },
    },
  };
}

export async function getSheetAssignments() {
  const row = await db.sheetAssignments.get(SHEET_ID);
  return migrateSheetRow(row) || freshSheetSeed();
}

// Idempotent seeder — call once at app start, outside useLiveQuery context.
// useLiveQuery forbids readwrite transactions inside its querier.
// Also performs the legacy → byGame migration in place.
export async function ensureSheetAssignmentsSeeded() {
  const row = await db.sheetAssignments.get(SHEET_ID);
  if (!row) {
    await db.sheetAssignments.put(freshSheetSeed());
    return;
  }
  if (!row.byGame) {
    await db.sheetAssignments.put(migrateSheetRow(row));
  }
}

export async function saveSheetAssignments(assignments) {
  return await db.sheetAssignments.put({ ...assignments, id: SHEET_ID });
}

// Replace one game's sheet with a curated plan (Tweaks panel → Game plan).
export async function applyGamePlan(game, plan, side = 'both') {
  const row = await getSheetAssignments();
  const current = row.byGame?.[game] ?? { offense: {}, defense: {} };
  const next = {
    ...row,
    id: SHEET_ID,
    byGame: {
      ...row.byGame,
      [game]: {
        offense:
          side === 'defense'
            ? current.offense
            : structuredClone(plan.offense),
        defense:
          side === 'offense'
            ? current.defense
            : structuredClone(plan.defense),
      },
    },
  };
  await db.sheetAssignments.put(next);
  return next;
}

// Sheet settings (team name, side, tweaks)
const SETTINGS_ID = 'settings';

function freshDefaultSettings() {
  return {
    id: SETTINGS_ID,
    team: 'Sentinels',
    side: 'offense',
    tweaks: {
      paper: ['#f4efe2', '#e7e0cf', '#d8cfb8', '#1c1a14'],
      accent: '#2f7d4f',
      density: 'regular',
      gloss: true,
    },
  };
}

export async function getSheetSettings() {
  const row = await db.sheetSettings.get(SETTINGS_ID);
  return row || freshDefaultSettings();
}

export async function saveSheetSettings(settings) {
  return await db.sheetSettings.put({ ...settings, id: SETTINGS_ID });
}

// ── Favorites-setup checklist helpers ───────────────────────────────────────
// Checks are keyed per game + side + playId so the Madden and CFB setup
// passes never collide. Stale ids (plays later removed from the sheet) are
// harmless — the setup view only renders plays currently on the sheet.
const CHECKS_ID = 'checks';

export async function getSetupChecks() {
  const row = await db.setupChecks.get(CHECKS_ID);
  return row || { id: CHECKS_ID, byGame: {} };
}

export async function toggleSetupCheck(game, side, playId) {
  const row = await getSetupChecks();
  const gameRow = row.byGame[game] || {};
  const sideRow = { ...(gameRow[side] || {}) };
  if (sideRow[playId]) delete sideRow[playId];
  else sideRow[playId] = true;
  return await db.setupChecks.put({
    ...row,
    id: CHECKS_ID,
    byGame: { ...row.byGame, [game]: { ...gameRow, [side]: sideRow } },
  });
}

export async function clearSetupChecks(game, side) {
  const row = await getSetupChecks();
  const gameRow = row.byGame[game] || {};
  return await db.setupChecks.put({
    ...row,
    id: CHECKS_ID,
    byGame: { ...row.byGame, [game]: { ...gameRow, [side]: {} } },
  });
}

// Helper to add a play to my playsheet
export async function addToMyPlays(play, side) {
  return await db.myPlays.add({
    ...play,
    side: side,
    addedAt: new Date().toISOString(),
    tags: play.tags || [],
    notes: '',
    rating: null
  });
}

// Helper to remove a play from my playsheet
export async function removeFromMyPlays(id) {
  return await db.myPlays.delete(id);
}

// Helper to check if a play is already in my playsheet
export async function isPlayInMyPlaysheet(playId) {
  const count = await db.myPlays.where('playId').equals(playId).count();
  return count > 0;
}

// Helper to get all my plays
export async function getMyPlays() {
  return await db.myPlays.toArray();
}

// Helper to update play notes/rating
export async function updatePlayNotes(id, updates) {
  return await db.myPlays.update(id, updates);
}

// Game Context helpers - persists until manually cleared
const GAME_CONTEXT_ID = 'current';

export async function getGameContext() {
  const ctx = await db.gameContext.get(GAME_CONTEXT_ID);
  return ctx || {
    id: GAME_CONTEXT_ID,
    down: 1,
    distance: 10,
    fieldSide: 'own', // 'own' | 'opp'
    yardLine: 25
  };
}

export async function updateGameContext(updates) {
  const existing = await getGameContext();
  return await db.gameContext.put({
    ...existing,
    ...updates,
    id: GAME_CONTEXT_ID
  });
}

export async function clearGameContext() {
  return await db.gameContext.delete(GAME_CONTEXT_ID);
}

// Defensive adjustments helper - updates only the defensiveAdjustments field
export async function updateDefensiveAdjustments(id, adjustments) {
  return await db.myPlays.update(id, { defensiveAdjustments: adjustments });
}

// ── Formation Planner helpers ───────────────────────────────────────────────

export async function getFormations(side) {
  const all = await db.formations.orderBy('updatedAt').reverse().toArray();
  return side ? all.filter((f) => f.side === side) : all;
}

export async function getFormation(id) {
  return await db.formations.get(id);
}

export async function saveFormation(formation) {
  const now = new Date().toISOString();
  const row = {
    ...formation,
    updatedAt: now,
    createdAt: formation.createdAt || now,
  };
  await db.formations.put(row);
  return row;
}

export async function deleteFormation(id) {
  return await db.formations.delete(id);
}

// ── Saved call sheets ───────────────────────────────────────────────────────
// A saved sheet is { id, name, game, offense, defense, createdAt, updatedAt }
// — offense/defense match the game-plan shape, so applyGamePlan loads one
// exactly like a curated plan.

export async function getCallSheets() {
  return await db.callSheets.orderBy('updatedAt').reverse().toArray();
}

export async function saveCallSheet(sheet) {
  const now = new Date().toISOString();
  const row = {
    ...sheet,
    id: sheet.id || `cs_${Math.random().toString(36).slice(2, 10)}`,
    offense: structuredClone(sheet.offense || {}),
    defense: structuredClone(sheet.defense || {}),
    updatedAt: now,
    createdAt: sheet.createdAt || now,
  };
  await db.callSheets.put(row);
  return row;
}

export async function deleteCallSheet(id) {
  return await db.callSheets.delete(id);
}

// Rolling per-game safety net: snapshot the current sheet right before a
// plan load replaces it. One row per game (id backup_<game>), overwritten
// on each load, so backups never pile up. Skipped when the sheet is empty.
export async function backupCurrentSheet(game, reason) {
  const row = await getSheetAssignments();
  const cur = row.byGame?.[game];
  if (!cur) return null;
  const hasPlays = ['offense', 'defense'].some((s) =>
    Object.values(cur[s] || {}).some((list) => list?.length),
  );
  if (!hasPlays) return null;
  const existing = await db.callSheets.get(`backup_${game}`);
  return await saveCallSheet({
    id: `backup_${game}`,
    name: `Auto-backup — before ${reason}`,
    game,
    offense: cur.offense,
    defense: cur.defense,
    createdAt: existing?.createdAt,
  });
}

// ── Skill assessments ───────────────────────────────────────────────────────
// Newest-first list of self-rating snapshots. Each save is a new row so the
// history is the point — deltas between snapshots are the progress signal.

export async function getSkillAssessments() {
  return await db.skillAssessments.orderBy('createdAt').reverse().toArray();
}

export async function saveSkillAssessment({ ratings, note }) {
  const now = new Date().toISOString();
  const row = {
    id: `sa_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: now,
    ratings: structuredClone(ratings || {}),
    note: note || '',
  };
  await db.skillAssessments.put(row);
  return row;
}

export async function deleteSkillAssessment(id) {
  return await db.skillAssessments.delete(id);
}

// ── Lab plans ───────────────────────────────────────────────────────────────
// Newest-first. The newest row is the active week; older rows are the log.

export async function getLabPlans() {
  return await db.labPlans.orderBy('weekOf').reverse().toArray();
}

export async function saveLabPlan(plan) {
  const row = {
    id: `lp_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
    ...structuredClone(plan),
  };
  await db.labPlans.put(row);
  return row;
}

export async function updateLabPlanSession(planId, idx, patch) {
  const row = await db.labPlans.get(planId);
  if (!row) return;
  row.sessions = row.sessions.map((s) =>
    s.idx === idx ? { ...s, ...patch } : s,
  );
  await db.labPlans.put(row);
}

export async function deleteLabPlan(id) {
  return await db.labPlans.delete(id);
}

// ── Personnel charts ────────────────────────────────────────────────────────
// One row per team role sheet. `know[roleId]` carries Kenny's self-rating on
// the role (1–5), the player he actually starts there (overriding the shipped
// default), and his own note. Role definitions are static data and are never
// written here — only what he knows and who he plays.

const personnelChartId = (game, planId) => `${game}:${planId}`;

export async function getPersonnelChart(game, planId) {
  const id = personnelChartId(game, planId);
  const row = await db.personnelCharts.get(id);
  return row || { id, planId, game, know: {} };
}

export async function getPersonnelCharts() {
  return await db.personnelCharts.toArray();
}

// Merge-patch one role's entry. Passing null for a field deletes it so a
// cleared input never leaves an empty key behind (same rule as myNote).
export async function savePersonnelRole(game, planId, roleId, patch) {
  const row = await getPersonnelChart(game, planId);
  const cur = row.know[roleId] || {};
  const next = { ...cur };
  Object.entries(patch).forEach(([k, v]) => {
    if (v == null || v === '') delete next[k];
    else next[k] = v;
  });
  const know = { ...row.know };
  if (Object.keys(next).length) know[roleId] = next;
  else delete know[roleId];
  const saved = {
    ...row,
    id: personnelChartId(game, planId),
    planId,
    game,
    know,
    updatedAt: new Date().toISOString(),
  };
  await db.personnelCharts.put(saved);
  return saved;
}

export async function clearPersonnelChart(game, planId) {
  return await db.personnelCharts.delete(personnelChartId(game, planId));
}

// Attach a saved formation to a play already in myPlays (no migration needed).
export async function linkFormationToPlay(myPlayId, formationId) {
  return await db.myPlays.update(myPlayId, { formationId });
}

// Idempotent seeder — call once at app start, outside useLiveQuery context.
export async function ensureFormationsSeeded() {
  const count = await db.formations.count();
  if (count > 0) return;
  await db.formations.bulkPut(starterFormations());
}
