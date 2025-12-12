// Madden 26 Play Database
// Structure: Playbooks -> Formation Groups -> Formations -> Plays

// Playbook name lists (for UI before data is loaded)
export const playbookNames = {
  offense: {
    team: [
      '49ers', 'Bears', 'Bengals', 'Bills', 'Broncos', 'Browns', 'Buccaneers',
      'Cardinals', 'Chargers', 'Chiefs', 'Colts', 'Commanders', 'Cowboys',
      'Dolphins', 'Eagles', 'Falcons', 'Giants', 'Jaguars', 'Jets', 'Lions',
      'Packers', 'Panthers', 'Patriots', 'Raiders', 'Rams', 'Ravens', 'Saints',
      'Seahawks', 'Steelers', 'Texans', 'Titans', 'Vikings'
    ],
    alternate: [
      'Air Raid', 'Balanced', "Benkert's Dimes", 'Pistol', 'Run and Shoot',
      'Run Balanced', 'Run Heavy', 'Run n Gun', 'Shotgun', 'Shotgun Mix',
      'Singleback', 'Spread', 'Two Back', 'West Coast'
    ]
  },
  defense: {
    team: [
      '49ers', 'Bears', 'Bengals', 'Bills', 'Broncos', 'Browns', 'Buccaneers',
      'Cardinals', 'Chargers', 'Chiefs', 'Colts', 'Commanders', 'Cowboys',
      'Dolphins', 'Eagles', 'Falcons', 'Giants', 'Jaguars', 'Jets', 'Lions',
      'Packers', 'Panthers', 'Patriots', 'Raiders', 'Rams', 'Ravens', 'Saints',
      'Seahawks', 'Steelers', 'Texans', 'Titans', 'Vikings'
    ],
    alternate: ['3-4', '4-3', '46', 'Cover 2', 'Multiple D']
  }
};

// Helper to convert playbook name to slug
export function nameToSlug(name, type) {
  const suffix = type === 'offense' ? '-off' : '-def';
  return name.toLowerCase()
    .replace(/[']/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') + suffix;
}

// Helper to get slug from playbook name for lookup
export function getPlaybookSlug(name, type) {
  return nameToSlug(name, type);
}

// Playbook data will be loaded from JSON
// This starts as null and gets populated when loadPlaybookData is called
let playbookData = null;

// Load playbook data from the JSON file
export async function loadPlaybookData() {
  if (playbookData) return playbookData;

  try {
    const response = await fetch('/data/playbooks.json');
    if (!response.ok) {
      throw new Error('Failed to load playbook data');
    }
    const data = await response.json();

    // Index playbooks by ID for quick lookup
    playbookData = {};
    for (const playbook of data.playbooks) {
      playbookData[playbook.id] = playbook;
    }

    return playbookData;
  } catch (error) {
    console.error('Error loading playbook data:', error);
    return null;
  }
}

// Get a specific playbook by ID
export function getPlaybook(playbookId) {
  return playbookData?.[playbookId] || null;
}

// Get all playbooks
export function getAllPlaybooks() {
  return playbookData ? Object.values(playbookData) : [];
}

// Search plays across all playbooks
export function searchPlays(query, options = {}) {
  if (!playbookData || !query) return [];

  const { type, playbookId, limit = 50 } = options;
  const queryLower = query.toLowerCase();
  const results = [];

  const playbooks = playbookId
    ? [playbookData[playbookId]].filter(Boolean)
    : Object.values(playbookData);

  for (const playbook of playbooks) {
    if (type && playbook.type !== type) continue;

    for (const group of playbook.formationGroups || []) {
      for (const formation of group.formations || []) {
        for (const play of formation.plays || []) {
          if (play.name.toLowerCase().includes(queryLower)) {
            results.push({
              ...play,
              playbook: playbook.name,
              playbookId: playbook.id,
              formationGroup: group.name,
              formation: formation.name,
              formationSlug: formation.slug
            });

            if (results.length >= limit) {
              return results;
            }
          }
        }
      }
    }
  }

  return results;
}

// For backwards compatibility
export const playbooks = playbookNames;
