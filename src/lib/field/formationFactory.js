// Formation Planner — default 11-player layouts and a few starter formations.
// Coordinates are normalized field units (see fieldConfig.js).
// Every token carries its `team` and a team-prefixed id ('o1'..'o11',
// 'd1'..'d11') so offense and defense can share one board without id clashes.

let seq = 0;
function tok(team, pos, x, y, jersey, label) {
  seq += 1;
  return {
    id: `${team[0]}${seq}`,
    team,
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
  const t = 'offense';
  return [
    tok(t, 'OL', 0.41, 0, 73, 'LT'),
    tok(t, 'OL', 0.455, 0, 65, 'LG'),
    tok(t, 'OL', 0.50, 0, 55, 'C'),
    tok(t, 'OL', 0.545, 0, 66, 'RG'),
    tok(t, 'OL', 0.59, 0, 71, 'RT'),
    tok(t, 'TE', 0.635, 0, 85, 'TE'),
    tok(t, 'WR', 0.10, 0, 11, 'X'),
    tok(t, 'QB', 0.50, 0.08, 12, 'QB'),
    tok(t, 'FB', 0.50, 0.20, 44, 'FB'),
    tok(t, 'RB', 0.50, 0.34, 22, 'RB'),
    tok(t, 'WR', 0.86, 0.06, 80, 'Z'),
  ];
}

// Base 4-3 defense: 4 DL, 3 LB, 2 CB, 2 S.
function defense43() {
  seq = 0;
  const t = 'defense';
  return [
    tok(t, 'DL', 0.41, -0.09, 91, 'LE'),
    tok(t, 'DL', 0.465, -0.09, 95, 'DT'),
    tok(t, 'DL', 0.535, -0.09, 99, 'NT'),
    tok(t, 'DL', 0.59, -0.09, 92, 'RE'),
    tok(t, 'LB', 0.38, -0.20, 54, 'W'),
    tok(t, 'LB', 0.50, -0.20, 52, 'M'),
    tok(t, 'LB', 0.62, -0.20, 58, 'S'),
    tok(t, 'CB', 0.10, -0.13, 24, 'CB'),
    tok(t, 'CB', 0.90, -0.13, 21, 'CB'),
    tok(t, 'S', 0.40, -0.40, 31, 'FS'),
    tok(t, 'S', 0.60, -0.40, 32, 'SS'),
  ];
}

export function defaultFormation(side) {
  return side === 'defense' ? defense43() : offenseIForm();
}

// Re-id a loaded set so ids stay unique + team-prefixed (handles formations
// saved before tokens carried a team).
export function normalizePlayers(players, team) {
  return players.map((p, i) => ({
    eligibleOverride: null,
    label: p.label || p.pos,
    ...p,
    team: p.team || team,
    id: `${team[0]}${i + 1}`,
  }));
}

export function newFormationRow(side) {
  const now = new Date().toISOString();
  return {
    id: `fm_${Math.random().toString(36).slice(2, 10)}`,
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
