// built by nnnsightnnn — signal from noise
// Scouting fact engine — the numbers half of an opponent report.
//
// A real NFL advance report is a personnel section, a tendency breakout, and
// a matchup page. In Madden H2H the tendencies belong to the human holding
// the sticks, so the only things knowable before kickoff are the roster and
// the book. This module turns one roster snapshot into those knowable facts:
// projected starters, unit grades with league ranks, threats (X-Factors and
// Superstars), a speed map, weak links, and edge scores for every collision
// with the Falcons. Pure functions, no React, no I/O: the build script feeds
// it JSON and the scouting agents only write football judgment on top.
//
// Depth is projected by OVR within position. That matches the default
// in-game depth chart closely but not perfectly (EA hand-sets some slots),
// which is why every starter carries its OVR rather than pretending to be
// the official chart.

// Offensive and defensive starting slots, in madden.tools position codes.
export const SLOTS = {
  offense: [
    ['QB', 1], ['HB', 1], ['WR', 3], ['TE', 1],
    ['LT', 1], ['LG', 1], ['C', 1], ['RG', 1], ['RT', 1],
  ],
  defense: [
    // Nickel 4-2-5: the personnel most Madden H2H defenses actually live in.
    ['LEDGE', 1], ['REDGE', 1], ['DT', 2], ['MIKE', 1], ['WILL', 1],
    ['CB', 3], ['FS', 1], ['SS', 1],
  ],
  special: [['K', 1], ['P', 1]],
};

const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const r1 = (x) => Math.round(x * 10) / 10;
const R = (p, k) => (p && p.ratings && typeof p.ratings[k] === 'number' ? p.ratings[k] : 0);

// Weighted composite of ratings for one player.
export function composite(p, weights) {
  let s = 0;
  let w = 0;
  for (const [k, wt] of Object.entries(weights)) {
    s += R(p, k) * wt;
    w += wt;
  }
  return w ? s / w : 0;
}

// The ratings that decide each job. Kept short on purpose: these are the
// numbers the report shows, so every one has to be defensible in a sentence.
export const JOB = {
  qbArm: { THP: 3, SAC: 2, MAC: 3, DAC: 2, TUP: 2, AWR: 1 },
  qbLegs: { SPD: 2, ACC: 2, RUN: 2, BSK: 1 },
  ballCarrier: { SPD: 2, ACC: 2, BCV: 3, BTK: 2, JKM: 1, CAR: 1 },
  receiver: { SPD: 2, RLS: 1, SRR: 2, MRR: 2, DRR: 1, CTH: 1, CIT: 2 },
  passPro: { PBK: 2, PBP: 2, PBF: 2, STR: 1, AWR: 1 },
  runBlock: { RBK: 2, RBP: 2, RBF: 2, IBL: 1, STR: 1 },
  passRush: { PMV: 2, FMV: 2, BSH: 1, ACC: 2, STR: 1 },
  runStop: { BSH: 3, TAK: 2, STR: 2, PUR: 1, PRC: 1 },
  cover: { MCV: 2, ZCV: 2, PRS: 1, SPD: 2, ACC: 1, AGI: 1, PRC: 1 },
};

export function depthByPos(players) {
  const by = {};
  for (const p of players) (by[p.pos] ||= []).push(p);
  for (const k of Object.keys(by)) by[k].sort((a, b) => R(b, 'OVR') - R(a, 'OVR'));
  return by;
}

export function starters(players) {
  const by = depthByPos(players);
  const out = {};
  for (const [side, slots] of Object.entries(SLOTS)) {
    out[side] = [];
    for (const [pos, n] of slots) {
      (by[pos] || []).slice(0, n).forEach((p, i) =>
        out[side].push({ slot: n > 1 ? `${pos}${i + 1}` : pos, ...p }),
      );
    }
  }
  return out;
}

const pick = (list, re) => list.filter((p) => re.test(p.slot));

// Unit scores (0-99 scale, same feel as OVR).
export function unitScores(st) {
  const o = st.offense;
  const d = st.defense;
  const qb = pick(o, /^QB/)[0];
  const ol = pick(o, /^(LT|LG|C|RG|RT)$/);
  const skill = pick(o, /^(WR\d|TE)$/);
  const front = pick(d, /^(LEDGE|REDGE|DT\d)$/);
  const edges = pick(d, /^(LEDGE|REDGE)$/);
  const lbs = pick(d, /^(MIKE|WILL)$/);
  const dbs = pick(d, /^(CB\d|FS|SS)$/);
  return {
    qb: r1(composite(qb, JOB.qbArm) * 0.8 + composite(qb, JOB.qbLegs) * 0.2),
    receivers: r1(avg(skill.map((p) => composite(p, JOB.receiver)))),
    run: r1(composite(pick(o, /^HB/)[0], JOB.ballCarrier) * 0.5 + avg(ol.map((p) => composite(p, JOB.runBlock))) * 0.5),
    passPro: r1(avg(ol.map((p) => composite(p, JOB.passPro)))),
    passRush: r1(avg(edges.map((p) => composite(p, JOB.passRush))) * 0.65 + avg(pick(d, /^DT/).map((p) => composite(p, JOB.passRush))) * 0.35),
    runDefense: r1(avg([...front, ...lbs].map((p) => composite(p, JOB.runStop)))),
    coverage: r1(avg(dbs.map((p) => composite(p, JOB.cover))) * 0.8 + avg(lbs.map((p) => composite(p, JOB.cover))) * 0.2),
    offense: r1(avg(o.map((p) => R(p, 'OVR')))),
    defense: r1(avg(d.map((p) => R(p, 'OVR')))),
  };
}

// Rank every team's unit scores against the league (1 = best).
export function leagueRanks(scoresByTeam) {
  const keys = Object.keys(Object.values(scoresByTeam)[0] || {});
  const ranks = {};
  for (const t of Object.keys(scoresByTeam)) ranks[t] = {};
  for (const k of keys) {
    const order = Object.keys(scoresByTeam).sort((a, b) => scoresByTeam[b][k] - scoresByTeam[a][k]);
    order.forEach((t, i) => (ranks[t][k] = i + 1));
  }
  return ranks;
}

const KEY_RATINGS = {
  QB: ['THP', 'SAC', 'MAC', 'DAC', 'RUN', 'TUP', 'SPD'],
  HB: ['SPD', 'ACC', 'BCV', 'BTK', 'JKM', 'TRK', 'CTH'],
  WR: ['SPD', 'ACC', 'RLS', 'SRR', 'MRR', 'DRR', 'CIT', 'SPC'],
  TE: ['SPD', 'SRR', 'MRR', 'CIT', 'RBK', 'PBK'],
  OL: ['PBK', 'PBP', 'PBF', 'RBK', 'RBP', 'RBF', 'STR'],
  EDGE: ['SPD', 'ACC', 'PMV', 'FMV', 'BSH', 'STR'],
  DT: ['STR', 'BSH', 'PMV', 'FMV', 'TAK'],
  LB: ['SPD', 'PUR', 'TAK', 'BSH', 'ZCV', 'MCV', 'PRC'],
  CB: ['SPD', 'ACC', 'MCV', 'ZCV', 'PRS', 'AGI', 'JMP'],
  S: ['SPD', 'ZCV', 'MCV', 'PRC', 'TAK', 'POW'],
  K: ['KPW', 'KAC'],
  P: ['KPW', 'KAC'],
};
export function ratingGroup(pos) {
  if (['LT', 'LG', 'C', 'RG', 'RT'].includes(pos)) return 'OL';
  if (['LEDGE', 'REDGE'].includes(pos)) return 'EDGE';
  if (['MIKE', 'WILL', 'SAM'].includes(pos)) return 'LB';
  if (['FS', 'SS'].includes(pos)) return 'S';
  return pos;
}

export function slim(p) {
  const keys = KEY_RATINGS[ratingGroup(p.pos)] || [];
  const out = {
    name: p.name,
    pos: p.pos,
    ovr: R(p, 'OVR'),
    ratings: Object.fromEntries(keys.map((k) => [k, R(p, k)])),
    abilities: (p.abilities || []).map((a) => ({ name: a.name, type: a.type })),
  };
  if (p.slot) out.slot = p.slot;
  return out;
}

// Threats: every X-Factor, then the best remaining starters by OVR.
export function threats(st, n = 6) {
  const all = [...st.offense, ...st.defense];
  const xf = all.filter((p) => (p.abilities || []).some((a) => a.type === 'xFactor'));
  const rest = all
    .filter((p) => !xf.includes(p))
    .sort((a, b) => R(b, 'OVR') - R(a, 'OVR'));
  return [...xf.sort((a, b) => R(b, 'OVR') - R(a, 'OVR')), ...rest]
    .slice(0, Math.max(n, xf.length))
    .map((p) => ({ ...slim(p), side: st.offense.includes(p) ? 'offense' : 'defense', xFactor: xf.includes(p) }));
}

// Weak links: lowest job composite among starters of each unit, with the
// single rating that sinks them.
const WEAK_UNITS = [
  { unit: 'Pass protection', side: 'offense', re: /^(LT|LG|C|RG|RT)$/, job: 'passPro' },
  { unit: 'Run blocking', side: 'offense', re: /^(LT|LG|C|RG|RT)$/, job: 'runBlock' },
  { unit: 'Receivers', side: 'offense', re: /^(WR\d|TE)$/, job: 'receiver' },
  { unit: 'Pass rush', side: 'defense', re: /^(LEDGE|REDGE|DT\d)$/, job: 'passRush' },
  { unit: 'Run fits', side: 'defense', re: /^(LEDGE|REDGE|DT\d|MIKE|WILL)$/, job: 'runStop' },
  { unit: 'Coverage', side: 'defense', re: /^(CB\d|FS|SS|MIKE|WILL)$/, job: 'cover' },
];
export function weakLinks(st) {
  return WEAK_UNITS.map(({ unit, side, re, job }) => {
    const list = pick(st[side], re).map((p) => ({ p, score: composite(p, JOB[job]) }));
    if (!list.length) return null;
    list.sort((a, b) => a.score - b.score);
    const { p, score } = list[0];
    const unitAvg = avg(list.map((x) => x.score));
    const worst = Object.keys(JOB[job]).sort((a, b) => R(p, a) - R(p, b))[0];
    return {
      unit,
      side,
      player: p.name,
      slot: p.slot,
      score: r1(score),
      unitAvg: r1(unitAvg),
      gap: r1(unitAvg - score),
      worstRating: { key: worst, value: R(p, worst) },
    };
  }).filter(Boolean);
}

export function speedMap(st) {
  const o = pick(st.offense, /^(QB|HB|WR\d|TE)$/);
  const d = pick(st.defense, /^(CB\d|FS|SS|MIKE|WILL|LEDGE|REDGE)$/);
  const row = (p) => ({ name: p.name, slot: p.slot, SPD: R(p, 'SPD'), ACC: R(p, 'ACC') });
  return { offense: o.map(row), defense: d.map(row) };
}

// Edge score: positive favors the Falcons. Each side is the job composite
// for what that player is doing on the snap, so the number reads as "how much
// better at his job than the man across from him", roughly OVR-scaled.
function side(p, job) {
  return { name: p.name, slot: p.slot, score: r1(composite(p, JOB[job])), SPD: R(p, 'SPD') };
}
function duel(ours, oursJob, theirs, theirsJob, label, kind) {
  const f = side(ours, oursJob);
  const o = side(theirs, theirsJob);
  return { label, kind, falcons: f, opponent: o, speedDelta: f.SPD - o.SPD, edge: r1(f.score - o.score) };
}

const byPos = (list, re) => pick(list, re);
const weakestCover = (st) =>
  byPos(st.defense, /^(MIKE|WILL|SS)$/).sort((a, b) => composite(a, JOB.cover) - composite(b, JOB.cover))[0];

// Collisions between the Falcons (us) and the opponent (them). `attack` is
// our offense against their defense, `defend` is our defense against their
// offense. Receivers pair with corners by depth (WR1 on CB1), which is how
// most H2H defenses align before anyone shades or matches.
export function matchups(us, them) {
  const out = { attack: [], defend: [] };

  const ourWR = byPos(us.offense, /^WR\d$/);
  const theirCB = byPos(them.defense, /^CB\d$/);
  ourWR.forEach((w, i) => theirCB[i] && out.attack.push(duel(w, 'receiver', theirCB[i], 'cover', `${w.slot} vs ${theirCB[i].slot}`, 'pass')));
  const tWeak = weakestCover(them);
  const ourTE = byPos(us.offense, /^TE$/)[0];
  const ourHB = byPos(us.offense, /^HB$/)[0];
  if (ourTE && tWeak) out.attack.push(duel(ourTE, 'receiver', tWeak, 'cover', `TE vs ${tWeak.slot}`, 'pass'));
  if (ourHB && tWeak) out.attack.push(duel(ourHB, 'receiver', tWeak, 'cover', `HB vs ${tWeak.slot}`, 'pass'));

  const pairs = [['LT', 'REDGE'], ['RT', 'LEDGE'], ['LG', 'DT1'], ['RG', 'DT2']];
  for (const [ol, dl] of pairs) {
    const o = us.offense.find((p) => p.slot === ol);
    const r = them.defense.find((p) => p.slot === dl);
    if (o && r) out.attack.push(duel(o, 'passPro', r, 'passRush', `${ol} vs ${dl}`, 'protection'));
  }
  for (const [ol, dl] of pairs) {
    const r = us.defense.find((p) => p.slot === dl);
    const o = them.offense.find((p) => p.slot === ol);
    if (o && r) out.defend.push(duel(r, 'passRush', o, 'passPro', `${dl} vs ${ol}`, 'rush'));
  }

  const theirWR = byPos(them.offense, /^WR\d$/);
  const ourCB = byPos(us.defense, /^CB\d$/);
  theirWR.forEach((w, i) => ourCB[i] && out.defend.push(duel(ourCB[i], 'cover', w, 'receiver', `${ourCB[i].slot} vs ${w.slot}`, 'pass')));
  const uWeak = weakestCover(us);
  const theirTE = byPos(them.offense, /^TE$/)[0];
  const theirHB = byPos(them.offense, /^HB$/)[0];
  if (theirTE && uWeak) out.defend.push(duel(uWeak, 'cover', theirTE, 'receiver', `${uWeak.slot} vs TE`, 'pass'));
  if (theirHB && uWeak) out.defend.push(duel(uWeak, 'cover', theirHB, 'receiver', `${uWeak.slot} vs HB`, 'pass'));

  const olRe = /^(LT|LG|C|RG|RT)$/;
  const frontRe = /^(LEDGE|REDGE|DT\d|MIKE|WILL)$/;
  const unit = (st, s, re, job) => avg(byPos(st[s], re).map((p) => composite(p, JOB[job])));
  const runSide = (st, hb) => r1(unit(st, 'offense', olRe, 'runBlock') * 0.6 + composite(hb, JOB.ballCarrier) * 0.4);
  const ourRun = runSide(us, ourHB);
  const theirFront = r1(unit(them, 'defense', frontRe, 'runStop'));
  out.attack.push({ label: 'Run game vs front', kind: 'run', falcons: { name: 'OL + ' + (ourHB?.name || 'HB'), score: ourRun }, opponent: { name: 'Front six', score: theirFront }, speedDelta: 0, edge: r1(ourRun - theirFront) });
  const theirRun = runSide(them, theirHB);
  const ourFront = r1(unit(us, 'defense', frontRe, 'runStop'));
  out.defend.push({ label: 'Front vs run game', kind: 'run', falcons: { name: 'Front six', score: ourFront }, opponent: { name: 'OL + ' + (theirHB?.name || 'HB'), score: theirRun }, speedDelta: 0, edge: r1(ourFront - theirRun) });

  return out;
}

// One team's full fact block. `ranks` comes from leagueRanks over all 32.
export function buildFacts({ abbr, name, players }, falcons, { iteration, ranks, scores, playbooks }) {
  const st = starters(players);
  const us = starters(falcons.players);
  const qb = pick(st.offense, /^QB$/)[0];
  return {
    team: { abbr, name },
    iteration,
    units: scores[abbr],
    ranks: ranks[abbr],
    falconsUnits: scores.ATL,
    starters: {
      offense: st.offense.map(slim),
      defense: st.defense.map(slim),
      special: st.special.map(slim),
    },
    threats: threats(st),
    weakLinks: weakLinks(st),
    speedMap: speedMap(st),
    qbProfile: qb ? { name: qb.name, arm: r1(composite(qb, JOB.qbArm)), legs: r1(composite(qb, JOB.qbLegs)), scrambler: R(qb, 'SPD') >= 80 } : null,
    matchups: matchups(us, st),
    playbooks,
  };
}
