// Formation Planner — derive a canonical, human-readable description of an
// arrangement from raw token coordinates.
//
// Design rule (see plan): GEOMETRY LEADS, LABELS FOLLOW. Everything keys off
// *relative* depth/spacing rather than fixed coordinate cutoffs, so dragging
// the whole set up/down the field — or a single token a yard out of place —
// doesn't flip the classification. A formation name is a product of roughly
// independent axes:
//   offense  = Personnel × Backfield × Receiver-distribution + modifiers
//   defense  = Front × Package × Shell + box / pressure look
// We always produce a compositional name plus feature fields the library
// matcher (matchingEngine.js) scores against.

import { ON_LINE_EPS } from './fieldConfig';

// 1 y-unit = 15 yds (fieldConfig). Handy yard→unit conversions for the few
// places a real-world distance (not a relative one) is the honest signal —
// e.g. QB depth from the line of scrimmage genuinely defines shotgun.
const YD = 1 / 15;

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
  '0x0': 'Tight',
};

function abbr(side) {
  return side === 'left' ? 'Lt' : side === 'right' ? 'Rt' : '';
}

function median(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// ── Offense ────────────────────────────────────────────────────────────────

export function classifyOffense(players, ballX = 0.5) {
  const qb = players.find((p) => p.pos === 'QB');
  const backs = players.filter((p) => p.pos === 'RB' || p.pos === 'FB');
  const tes = players.filter((p) => p.pos === 'TE');
  const wrs = players.filter((p) => p.pos === 'WR');
  const ol = players.filter((p) => p.pos === 'OL');

  const nBacks = backs.length;
  const nTE = tes.length;
  const personnel = `${nBacks}${nTE}`;

  const qy = qb ? qb.y : 0.08;
  const qx = qb ? qb.x : ballX;

  // A back is "stacked" behind the QB when it shares the QB's x-lane and sits
  // deeper — the discriminator between Pistol (stacked) and Shotgun (offset).
  const stackedBehind = (b) => Math.abs(b.x - qx) < 0.05 && b.y > qy + 0.02;

  // QB displaced well off the ball with a back sitting at the snap spot ⇒ a
  // direct-snap (Wildcat) look. Checked before the depth bands so a missing or
  // flexed-out QB doesn't get mislabeled.
  const qbDisplaced = !qb || Math.abs(qx - ballX) > 0.18;
  const backAtSnap = backs.some(
    (b) => Math.abs(b.x - ballX) < 0.1 && b.y <= 6 * YD && b.y >= 2 * YD,
  );

  let backfield;
  if (nBacks === 0) {
    backfield = 'Empty';
  } else if (qbDisplaced && backAtSnap) {
    backfield = 'Wildcat';
  } else if (qy >= 3 * YD) {
    // Deep QB — shotgun family. Stacked back ⇒ Pistol, else Gun.
    backfield = backs.some(stackedBehind) ? 'Pistol' : 'Gun';
  } else {
    // Under center — name the backfield from how the backs are arranged
    // relative to the QB's lane, not from absolute coordinates.
    if (nBacks >= 3) {
      backfield = 'Full House';
    } else if (nBacks === 2) {
      const inLane = backs.filter((b) => Math.abs(b.x - qx) < 0.06).length;
      backfield = inLane >= 2 ? 'I-Form' : 'Split Backs';
    } else {
      backfield = 'Singleback';
    }
  }

  // Receivers = skill players split out. A back parked behind the ball doesn't
  // count; an attached or flexed TE counts toward its side's strength.
  const isReceiver = (p) => {
    if (p.pos === 'QB') return false;
    if (
      (p.pos === 'RB' || p.pos === 'FB') &&
      Math.abs(p.x - ballX) < 0.12 &&
      p.y > ON_LINE_EPS
    ) {
      return false;
    }
    return true;
  };
  const receivers = [...backs, ...tes, ...wrs].filter(isReceiver);
  const left = receivers.filter((p) => p.x < ballX).length;
  const right = receivers.length - left;
  const hi = Math.max(left, right);
  const lo = Math.min(left, right);
  const strength = `${hi}x${lo}`;
  const strongSide =
    left > right ? 'left' : right > left ? 'right' : 'balanced';

  // TE alignment of the most-attached TE, relative to the nearest tackle.
  const teAttach = dominantTeAttach(tes, ol);

  // Cluster spacing on the receiver-heavy side: bunch / stack / spread.
  const spacing = receiverSpacing(receivers, ballX, strongSide);

  const word = STRENGTH_WORD[strength] || strength;
  const spaceWord =
    spacing === 'bunch' ? 'Bunch' : spacing === 'stack' ? 'Stack' : '';
  const name =
    [backfield, spaceWord, word, abbr(strongSide)]
      .filter(Boolean)
      .join(' ') + ` (${personnel})`;

  return {
    side: 'offense',
    name,
    personnel,
    backfield,
    strength,
    strongSide,
    teAttach,
    spacing,
    nBacks,
    nTE,
    nWR: wrs.length,
    chips: [
      personnel,
      backfield,
      `${strength}${strongSide !== 'balanced' ? ' ' + abbr(strongSide) : ''}`,
      spaceWord,
      nTE > 0 ? `TE ${teAttach}` : '',
    ].filter(Boolean),
  };
}

// Most-attached TE alignment: attached (tight to tackle, on line) → nasty
// (on line, small gap) → flexed (off the tackle, near line) → wing (off the
// line behind it). 'none' when there is no TE.
function dominantTeAttach(tes, ol) {
  if (!tes.length) return 'none';
  const tackleXs = ol.length
    ? [Math.min(...ol.map((p) => p.x)), Math.max(...ol.map((p) => p.x))]
    : [0.42, 0.58];
  const rank = { attached: 4, nasty: 3, flexed: 2, wing: 1 };
  let best = 'wing';
  for (const te of tes) {
    const gap = Math.min(...tackleXs.map((tx) => Math.abs(te.x - tx)));
    const onLine = Math.abs(te.y) <= ON_LINE_EPS;
    let a;
    if (!onLine) a = 'wing';
    else if (gap < 0.045) a = 'attached';
    else if (gap < 0.1) a = 'nasty';
    else a = 'flexed';
    if (rank[a] > rank[best]) best = a;
  }
  return best;
}

// Spacing of the strong-side receivers: a tight cluster of 3 is a "bunch", two
// sharing an x-lane is a "stack", otherwise "spread"/"none".
function receiverSpacing(receivers, ballX, strongSide) {
  const side =
    strongSide === 'left'
      ? receivers.filter((p) => p.x < ballX)
      : strongSide === 'right'
        ? receivers.filter((p) => p.x >= ballX)
        : receivers;
  if (side.length < 2) return 'none';

  // Stack: any pair shares an x-lane while separated in depth.
  for (let i = 0; i < side.length; i += 1) {
    for (let j = i + 1; j < side.length; j += 1) {
      if (
        Math.abs(side[i].x - side[j].x) < 0.035 &&
        Math.abs(side[i].y - side[j].y) > 0.02
      ) {
        return 'stack';
      }
    }
  }

  // Bunch: 3+ receivers inside a tight bounding box (~5 yd ≈ 0.094 x / 0.33 y).
  if (side.length >= 3) {
    const xs = side.map((p) => p.x);
    const ys = side.map((p) => p.y);
    const wx = Math.max(...xs) - Math.min(...xs);
    const wy = Math.max(...ys) - Math.min(...ys);
    if (wx < 0.1 && wy < 0.34) return 'bunch';
  }
  return 'spread';
}

// ── Defense ──────────────────────────────────────────────────────────────

export function classifyDefense(players) {
  const dlT = players.filter((p) => p.pos === 'DL');
  const lbT = players.filter((p) => p.pos === 'LB');
  const dbs = players.filter(
    (p) => p.pos === 'CB' || p.pos === 'S' || p.pos === 'DB',
  );
  const dl = dlT.length;
  const lb = lbT.length;
  const nDB = dbs.length;
  const front = `${dl}-${lb}`;

  // Package is a direct function of DB count.
  let pkg = 'Base';
  if (nDB >= 7) pkg = 'Quarter';
  else if (nDB === 6) pkg = 'Dime';
  else if (nDB === 5) pkg = 'Nickel';
  else if (nDB <= 3) pkg = 'Heavy';

  // Safety shell from the count of *deep* DBs, where "deep" is derived from the
  // front's own depth (relative), so a shallow-drawn or deep-drawn set both
  // read correctly. Floor at ~4.5 yd so a walked-up box doesn't create phantom
  // deep men.
  const boxDepth = Math.max(
    0,
    ...[...dlT, ...lbT].map((p) => Math.abs(p.y)),
  );
  const deepCut = Math.max(4.5 * YD, 1.4 * boxDepth);
  const deepCount = dbs.filter((p) => Math.abs(p.y) >= deepCut).length;
  const shell =
    deepCount >= 3
      ? '3-High'
      : deepCount === 2
        ? '2-High'
        : deepCount === 1
          ? '1-High'
          : '0-High';

  // Box count: defenders inside the tackle box within ~5 yd of the LOS.
  const boxCount = players.filter(
    (p) => p.x >= 0.3 && p.x <= 0.7 && Math.abs(p.y) <= 5 * YD,
  ).length;

  const frontTag = defensiveFrontTag(dlT, lbT, dbs, deepCount, boxCount);
  const pressureLook = detectPressure(lbT, dbs);

  // Honest coverage handling: alignment yields the SHELL with confidence, but
  // the actual coverage is routinely disguised. Emit candidates, never one.
  const inferredCoverages = COVERAGE_CANDIDATES[shell] || [];

  const tagWord = frontTag && frontTag !== 'base' ? capitalize(frontTag) : '';
  const name = [front, tagWord, pkg !== 'Base' ? pkg : '', `· ${shell}`]
    .filter(Boolean)
    .join(' ')
    .replace(' ·', ' ·');

  return {
    side: 'defense',
    name,
    front,
    frontTag,
    pkg,
    shell,
    inferredCoverages,
    coverageConfidence: 'low — disguisable',
    pressureLook,
    boxCount,
    dl,
    lb,
    nDB,
    deepCount,
    chips: [
      front,
      tagWord,
      pkg,
      shell,
      `${boxCount} box`,
      pressureLook ? 'pressure look' : '',
    ].filter(Boolean),
  };
}

const COVERAGE_CANDIDATES = {
  '2-High': ['Cover 2', 'Cover 4 (Quarters)', 'Cover 6'],
  '1-High': ['Cover 1 (Man-Free)', 'Cover 3'],
  '0-High': ['Cover 0 (Man Pressure)'],
  '3-High': ['3-Deep / Quarters-match', 'Big-Nickel zone'],
};

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Best-effort structural tag on the front. Approximate — a low-weight modifier
// in matching, never the primary signal.
function defensiveFrontTag(dlT, lbT, dbs, deepCount, boxCount) {
  const dl = dlT.length;
  if (!dl) return 'base';
  const xs = dlT.map((p) => p.x).sort((a, b) => a - b);
  const spread = xs[xs.length - 1] - xs[0];

  // Tite/odd-stack: 3 down clustered tight over the center (ends inside).
  if (dl === 3 && spread < 0.13) return 'tite';

  // Wide-9: a big gap between the outermost DL (the ends) and the interior.
  if (dl >= 4) {
    const gaps = [];
    for (let i = 1; i < xs.length; i += 1) gaps.push(xs[i] - xs[i - 1]);
    const edgeGap = Math.max(gaps[0], gaps[gaps.length - 1]);
    const interiorGap = median(gaps.slice(1, -1).length ? gaps.slice(1, -1) : gaps);
    if (edgeGap > 0.1 && edgeGap > 2 * interiorGap) return 'wide-9';
  }

  // Bear / 46: heavy box, three interior DL covering the guards, low shell.
  if (dl >= 4 && boxCount >= 8 && deepCount <= 1) {
    const interior = dlT.filter((p) => Math.abs(p.x - 0.5) < 0.1).length;
    if (interior >= 3) return 'bear';
  }

  // Over / Under: a shifted 4-3 front. Center of mass off the midline tells us
  // which way the line slid.
  if (dl === 4 && lbT.length === 3) {
    const com = dlT.reduce((s, p) => s + p.x, 0) / dl;
    if (com > 0.52) return 'over';
    if (com < 0.48) return 'under';
  }
  return 'base';
}

// A pressure *look* (not a guaranteed blitz): mugged inside LBs straddling the
// center, or a defensive back walked up onto the line.
function detectPressure(lbT, dbs) {
  const mugged = lbT.filter(
    (p) => Math.abs(p.y) <= 1.8 * YD && Math.abs(p.x - 0.5) < 0.12,
  ).length;
  if (mugged >= 2) return true;
  const walkedUp = dbs.some(
    (p) => Math.abs(p.y) <= 1.2 * YD && (p.x < 0.3 || p.x > 0.7),
  );
  return walkedUp;
}

export function classifyFormation(players, side, ballX = 0.5) {
  return side === 'defense'
    ? classifyDefense(players)
    : classifyOffense(players, ballX);
}
