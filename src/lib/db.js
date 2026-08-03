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
export async function applyGamePlan(game, plan) {
  const row = await getSheetAssignments();
  const next = {
    ...row,
    id: SHEET_ID,
    byGame: {
      ...row.byGame,
      [game]: {
        offense: structuredClone(plan.offense),
        defense: structuredClone(plan.defense),
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
