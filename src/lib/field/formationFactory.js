// Formation Planner — default 11-player layouts and a few starter formations.
// Coordinates are normalized field units (see fieldConfig.js).

let seq = 0;
function tok(pos, x, y, jersey, label) {
  seq += 1;
  return {
    id: `p${seq}`,
    x,
    y,
    pos,
    jersey,
    label: label || pos,
    eligibleOverride: null,
  };
}

// Pro-style I-formation: 5 OL + TE + split end on the line (7), QB/FB/RB/flanker
// in the backfield (4). Legal under both NFL and NCAA.
function offenseIForm() {
  seq = 0;
  return [
    tok('OL', 0.40, 0, 73, 'LT'),
    tok('OL', 0.455, 0, 65, 'LG'),
    tok('OL', 0.50, 0, 55, 'C'),
    tok('OL', 0.545, 0, 66, 'RG'),
    tok('OL', 0.60, 0, 71, 'RT'),
    tok('TE', 0.655, 0, 85, 'TE'),
    tok('WR', 0.10, 0, 11, 'X'),
    tok('QB', 0.50, 0.05, 12, 'QB'),
    tok('FB', 0.50, 0.13, 44, 'FB'),
    tok('RB', 0.50, 0.21, 22, 'RB'),
    tok('WR', 0.86, 0.05, 80, 'Z'),
  ];
}

// Base 4-3 defense: 4 DL, 3 LB, 2 CB, 2 S.
function defense43() {
  seq = 0;
  return [
    tok('DL', 0.41, -0.03, 91, 'LE'),
    tok('DL', 0.465, -0.03, 95, 'DT'),
    tok('DL', 0.535, -0.03, 99, 'NT'),
    tok('DL', 0.59, -0.03, 92, 'RE'),
    tok('LB', 0.38, -0.13, 54, 'W'),
    tok('LB', 0.50, -0.13, 52, 'M'),
    tok('LB', 0.62, -0.13, 58, 'S'),
    tok('CB', 0.10, -0.10, 24, 'CB'),
    tok('CB', 0.90, -0.10, 21, 'CB'),
    tok('S', 0.40, -0.32, 31, 'FS'),
    tok('S', 0.60, -0.32, 32, 'SS'),
  ];
}

export function defaultFormation(side) {
  return side === 'defense' ? defense43() : offenseIForm();
}

export function newFormationRow(side) {
  const now = new Date().toISOString();
  return {
    id: `fm_${Math.random().toString(36).slice(2, 10)}${seq}`,
    name: side === 'defense' ? 'Base 4-3' : 'Pro I',
    side,
    ruleset: 'nfl',
    ballSpot: 'middle',
    players: defaultFormation(side),
    derived: null,
    linkedPlayIds: [],
    createdAt: now,
    updatedAt: now,
  };
}

// Starter library written on first run so the planner isn't empty.
export function starterFormations() {
  return [
    { ...newFormationRow('offense'), id: 'fm_seed_pro_i', name: 'Pro I' },
    { ...newFormationRow('defense'), id: 'fm_seed_base_43', name: 'Base 4-3' },
  ];
}
