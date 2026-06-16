// Formation Planner — derive a canonical, human-readable description of an
// arrangement from raw token coordinates. This is the heart of "name the
// formation": a compositional classifier (always produces a name) plus feature
// fields the library matcher can score against.

const STRENGTH_WORD = {
  '5x0': 'Quint',
  '4x1': 'Quads',
  '4x0': 'Quads',
  '3x2': 'Trips',
  '3x1': 'Trips',
  '3x0': 'Trips',
  '2x2': 'Spread',
  '2x1': 'Pro',
  '2x0': 'Twins',
  '1x1': 'Split',
  '1x0': 'Tight',
};

function abbr(side) {
  return side === 'left' ? 'Lt' : side === 'right' ? 'Rt' : '';
}

export function classifyOffense(players, ballX = 0.5) {
  const qb = players.find((p) => p.pos === 'QB');
  const backs = players.filter((p) => p.pos === 'RB' || p.pos === 'FB');
  const tes = players.filter((p) => p.pos === 'TE');
  const wrs = players.filter((p) => p.pos === 'WR');
  const skill = [...backs, ...tes, ...wrs];

  const nBacks = backs.length;
  const nTE = tes.length;
  const personnel = `${nBacks}${nTE}`;

  const qy = qb ? qb.y : 0.05;
  const qx = qb ? qb.x : 0.5;
  const shotgun = qy >= 0.13;
  const underCenter = qy <= 0.075;

  let backfield;
  if (nBacks === 0) {
    backfield = 'Empty';
  } else if (shotgun) {
    const pistol = backs.some(
      (b) => Math.abs(b.x - qx) < 0.05 && b.y > qy + 0.03,
    );
    backfield = pistol ? 'Pistol' : 'Gun';
  } else if (underCenter) {
    if (nBacks >= 2) {
      const stacked =
        backs.filter((b) => Math.abs(b.x - qx) < 0.06).length >= 2;
      backfield = stacked ? 'I-Form' : 'Split Backs';
    } else {
      backfield = 'Singleback';
    }
  } else {
    backfield = nBacks >= 2 ? 'I-Form' : 'Pistol';
  }

  // Receivers = skill players split out (exclude QB and backs parked behind
  // the ball). An attached or detached TE counts toward its side's strength.
  const isReceiver = (p) => {
    if (p.pos === 'QB') return false;
    if (
      (p.pos === 'RB' || p.pos === 'FB') &&
      Math.abs(p.x - ballX) < 0.12 &&
      p.y > 0.06
    ) {
      return false;
    }
    return true;
  };
  const receivers = skill.filter(isReceiver);
  const left = receivers.filter((p) => p.x < ballX).length;
  const right = receivers.length - left;
  const hi = Math.max(left, right);
  const lo = Math.min(left, right);
  const strength = `${hi}x${lo}`;
  const strongSide = left > right ? 'left' : right > left ? 'right' : 'balanced';

  const word = STRENGTH_WORD[strength] || strength;
  const name =
    [backfield, word, abbr(strongSide)].filter(Boolean).join(' ') +
    ` (${personnel})`;

  return {
    side: 'offense',
    name,
    personnel,
    backfield,
    strength,
    strongSide,
    nBacks,
    nTE,
    nWR: wrs.length,
    chips: [personnel, backfield, `${strength}${strongSide !== 'balanced' ? ' ' + abbr(strongSide) : ''}`],
  };
}

export function classifyDefense(players) {
  const dl = players.filter((p) => p.pos === 'DL').length;
  const lb = players.filter((p) => p.pos === 'LB').length;
  const dbs = players.filter(
    (p) => p.pos === 'CB' || p.pos === 'S' || p.pos === 'DB',
  );
  const nDB = dbs.length;
  const front = `${dl}-${lb}`;

  let pkg = 'Base';
  if (nDB >= 7) pkg = 'Quarter';
  else if (nDB === 6) pkg = 'Dime';
  else if (nDB === 5) pkg = 'Nickel';
  else if (nDB <= 3) pkg = 'Heavy';

  const deep = dbs.filter((p) => p.y < -0.22).length;
  const shell = deep >= 2 ? '2-High' : deep === 1 ? '1-High' : '0-High';

  const name = `${front} ${pkg} ${shell}`;

  return {
    side: 'defense',
    name,
    front,
    pkg,
    shell,
    dl,
    lb,
    nDB,
    chips: [front, pkg, shell],
  };
}

export function classifyFormation(players, side, ballX = 0.5) {
  return side === 'defense'
    ? classifyDefense(players)
    : classifyOffense(players, ballX);
}
