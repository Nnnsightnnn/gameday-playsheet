// Madden 26 Play Database
// Structure: Playbooks -> Formation Groups -> Formations -> Plays
// This will be populated by the scraper

export const playbooks = {
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

// Sample data structure for a playbook
// This is what the scraped data will look like
export const samplePlaybookData = {
  id: 'eagles-off',
  name: 'Eagles',
  type: 'offense',
  category: 'team',
  formationGroups: [
    {
      name: 'Singleback',
      formations: [
        {
          name: 'Ace Double Wing',
          slug: 'singleback-ace-double-wing',
          plays: [
            { id: 'eagles-off-singleback-ace-double-wing-hb-dive', name: 'HB Dive', type: 'run' },
            { id: 'eagles-off-singleback-ace-double-wing-pa-boot', name: 'PA Boot', type: 'pass' },
            // ... more plays
          ]
        }
      ]
    },
    {
      name: 'Gun',
      formations: [
        {
          name: 'Bunch X Nasty',
          slug: 'gun-bunch-x-nasty',
          plays: [
            { id: 'eagles-off-gun-bunch-x-nasty-mesh-post', name: 'Mesh Post', type: 'pass' },
            // ... more plays
          ]
        }
      ]
    }
  ]
};

// Placeholder - will be replaced with scraped data
export const playbookData = {};
