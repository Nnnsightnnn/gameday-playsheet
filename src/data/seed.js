// First-run sample call sheet — Eagles offense + 49ers defense.
// Applied by lib/db.js#getSheetAssignments when the sheetAssignments table is empty.

export const SHEET_SEED = {
  offense: {
    openers: [
      { playId: 'eagles-off-gun-bunch-x-nasty-mesh-corner', name: 'MESH CORNER', type: 'pass', formation: 'Bunch X Nasty', playbook: 'Eagles' },
      { playId: 'eagles-off-gun-bunch-x-nasty-mesh-hb-sneak', name: 'MESH HB SNEAK', type: 'run', formation: 'Bunch X Nasty', playbook: 'Eagles' },
      { playId: 'eagles-off-singleback-ace-double-wing-pa-ctr-waggle', name: 'PA CTR WAGGLE', type: 'pass', formation: 'Ace Double Wing', playbook: 'Eagles' },
    ],
    first: [
      { playId: 'eagles-off-singleback-ace-double-wing-hb-counter-wk', name: 'HB COUNTER WK', type: 'run', formation: 'Ace Double Wing', playbook: 'Eagles' },
      { playId: 'eagles-off-gun-doubles-off-close-wk-pa-y-cross', name: 'PA Y CROSS', type: 'pass', formation: 'Doubles Off Close Wk', playbook: 'Eagles' },
    ],
    '2short': [
      { playId: 'eagles-off-gun-normal-y-off-rpo-peek-slant', name: 'RPO PEEK SLANT', type: 'pass', formation: 'Normal Y Off', playbook: 'Eagles' },
      { playId: 'eagles-off-i-form-pro-fb-fake-hb-flip', name: 'FB FAKE HB FLIP', type: 'run', formation: 'Pro', playbook: 'Eagles' },
    ],
    '2long': [
      { playId: 'eagles-off-gun-empty-base-flex-all-hitch', name: 'ALL HITCH', type: 'pass', formation: 'Empty Base Flex', playbook: 'Eagles' },
      { playId: 'eagles-off-gun-empty-base-flex-hoss-y-juke', name: 'HOSS Y JUKE', type: 'pass', formation: 'Empty Base Flex', playbook: 'Eagles' },
    ],
    '3short': [
      { playId: 'eagles-off-strong-wing-mtn-power-o', name: 'MTN POWER O', type: 'run', formation: 'Wing', playbook: 'Eagles' },
      { playId: 'eagles-off-goal-line-normal-qb-sneak', name: 'QB SNEAK', type: 'run', formation: 'Normal', playbook: 'Eagles' },
    ],
    '3med': [
      { playId: 'eagles-off-gun-bunch-x-nasty-mtn-china-cross', name: 'MTN CHINA CROSS', type: 'pass', formation: 'Bunch X Nasty', playbook: 'Eagles' },
      { playId: 'eagles-off-gun-doubles-off-close-wk-pa-y-cross', name: 'PA Y CROSS', type: 'pass', formation: 'Doubles Off Close Wk', playbook: 'Eagles' },
    ],
    '3long': [
      { playId: 'eagles-off-gun-bunch-x-nasty-corner-out-dig', name: 'CORNER OUT DIG', type: 'pass', formation: 'Bunch X Nasty', playbook: 'Eagles' },
    ],
    shots: [
      { playId: 'eagles-off-gun-normal-y-off-four-verticals', name: 'FOUR VERTICALS', type: 'pass', formation: 'Normal Y Off', playbook: 'Eagles' },
    ],
    redzone: [
      { playId: 'eagles-off-gun-empty-trey-stack-fade-out', name: 'FADE OUT', type: 'pass', formation: 'Empty Trey Stack', playbook: 'Eagles' },
      { playId: 'eagles-off-gun-normal-y-off-rpo-peek-slant', name: 'RPO PEEK SLANT', type: 'pass', formation: 'Normal Y Off', playbook: 'Eagles' },
    ],
    goalline: [
      { playId: 'eagles-off-goal-line-normal-fb-dive', name: 'FB DIVE', type: 'run', formation: 'Normal', playbook: 'Eagles' },
      { playId: 'eagles-off-goal-line-normal-qb-sneak', name: 'QB SNEAK', type: 'run', formation: 'Normal', playbook: 'Eagles' },
    ],
    twomin: [
      { playId: 'eagles-off-gun-bunch-quads-spot', name: 'SPOT', type: 'pass', formation: 'Bunch Quads', playbook: 'Eagles' },
      { playId: 'eagles-off-gun-bunch-x-nasty-mesh-spot', name: 'MESH SPOT', type: 'pass', formation: 'Bunch X Nasty', playbook: 'Eagles' },
    ],
  },
  defense: {
    base: [
      { playId: '49ers-def-nickel-double-mug-cover-3-match', name: 'COVER 3 MATCH', type: 'pass', formation: 'Double Mug', playbook: '49ers' },
      { playId: '49ers-def-4-3-over-solid-cover-2-invert', name: 'COVER 2 INVERT', type: 'pass', formation: 'Over Solid', playbook: '49ers' },
    ],
    first: [
      { playId: '49ers-def-4-3-even-6-1-cover-4-quarters', name: 'COVER 4 QUARTERS', type: 'pass', formation: 'Even 6-1', playbook: '49ers' },
      { playId: '49ers-def-nickel-double-mug-cover-1-hole', name: 'COVER 1 HOLE', type: 'pass', formation: 'Double Mug', playbook: '49ers' },
    ],
    '3med': [
      { playId: '49ers-def-nickel-double-mug-blitz-loop-3', name: 'BLITZ LOOP 3', type: 'pass', formation: 'Double Mug', playbook: '49ers' },
      { playId: '49ers-def-nickel-double-mug-lb-blitz-3', name: 'LB BLITZ 3', type: 'pass', formation: 'Double Mug', playbook: '49ers' },
    ],
    '3long': [
      { playId: '49ers-def-dime-normal-cover-2-hard-flat', name: 'COVER 2 HARD FLAT', type: 'pass', formation: 'Normal', playbook: '49ers' },
      { playId: '49ers-def-dime-normal-db-blitz-0', name: 'DB BLITZ 0', type: 'pass', formation: 'Normal', playbook: '49ers' },
    ],
    pressure: [
      { playId: '49ers-def-nickel-double-mug-blitz-loop-3', name: 'BLITZ LOOP 3', type: 'pass', formation: 'Double Mug', playbook: '49ers' },
      { playId: '49ers-def-nickel-double-mug-lb-blitz-3', name: 'LB BLITZ 3', type: 'pass', formation: 'Double Mug', playbook: '49ers' },
    ],
    redzone: [
      { playId: '49ers-def-goal-line-5-3-gaps-ab', name: 'GAPS AB', type: 'pass', formation: '5-3', playbook: '49ers' },
      { playId: '49ers-def-nickel-double-mug-cover-1-hole', name: 'COVER 1 HOLE', type: 'pass', formation: 'Double Mug', playbook: '49ers' },
    ],
    goalline: [
      { playId: '49ers-def-goal-line-5-3-gaps-ab', name: 'GAPS AB', type: 'pass', formation: '5-3', playbook: '49ers' },
      { playId: '49ers-def-goal-line-5-3-gaps-all', name: 'GAPS ALL', type: 'pass', formation: '5-3', playbook: '49ers' },
    ],
    prevent: [
      { playId: '49ers-def-prevent-3-deep-1-double-buzz', name: '1 DOUBLE BUZZ', type: 'pass', formation: '3 Deep', playbook: '49ers' },
      { playId: '49ers-def-prevent-3-deep-3-deep-blitz', name: '3 DEEP BLITZ', type: 'pass', formation: '3 Deep', playbook: '49ers' },
    ],
  },
}
