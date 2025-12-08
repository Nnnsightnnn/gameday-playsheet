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

// Helper to add a play to my playsheet
export async function addToMyPlays(play) {
  return await db.myPlays.add({
    ...play,
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
