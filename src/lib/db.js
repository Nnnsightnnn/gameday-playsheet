import Dexie from 'dexie';

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
