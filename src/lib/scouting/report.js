// built by nnnsightnnn — signal from noise
// The scouting report contract: what an agent must write into `report` for
// the app to render it and for Kenny to trust it. validateReport() returns a
// list of human-readable errors (empty = valid); the test suite runs it on
// every shipped file, and the scouting skill runs it before committing.
//
// Shape, in the order a coordinator reads it:
//   headline, threatLevel, bottomLine          the 10-second version
//   identity {offense, defense, expectFromUser} what the roster and book invite a human to do
//   keys[3]                                    keys to winning, the head coach page
//   attack  {plan, targets, avoid, calls, counters}   Falcons offense vs their D
//   defend  {plan, mustStop, exploit, calls, counters} Falcons D vs their offense
//   liveTells[]                                what to chart on the first two drives
//   specialTeams, sources[]

export const CONF_TAGS = ['ea', 'm27', 'm26', 'stale', 'read'];
export const LIMITS = { headline: 90, short: 200, long: 700 };

const isStr = (x) => typeof x === 'string' && x.trim().length > 0;

function names(facts, side) {
  const list = side === 'any'
    ? [...facts.starters.offense, ...facts.starters.defense, ...facts.starters.special]
    : facts.starters[side];
  return new Set(list.map((p) => p.name));
}

export function validateReport(doc, catalogIds) {
  const e = [];
  const r = doc.report;
  const f = doc.facts;
  if (!r) return ['report is null'];
  const str = (path, v, max = LIMITS.short) => {
    if (!isStr(v)) e.push(`${path} missing`);
    else if (v.length > max) e.push(`${path} is ${v.length} chars (max ${max})`);
  };
  const arr = (path, v, min, max) => {
    if (!Array.isArray(v)) { e.push(`${path} must be an array`); return []; }
    if (v.length < min || v.length > max) e.push(`${path} needs ${min}-${max} items, has ${v.length}`);
    return v;
  };
  const conf = (path, c) => { if (!CONF_TAGS.includes(c)) e.push(`${path}.conf must be one of ${CONF_TAGS.join('|')}`); };

  str('rosterIteration', r.rosterIteration, 40);
  if (isStr(r.rosterIteration) && r.rosterIteration !== f.iteration.label && !r.stale)
    e.push(`rosterIteration "${r.rosterIteration}" does not match facts "${f.iteration.label}"`);
  str('builtAt', r.builtAt, 10);
  str('headline', r.headline, LIMITS.headline);
  if (!Number.isInteger(r.threatLevel) || r.threatLevel < 1 || r.threatLevel > 5) e.push('threatLevel must be an integer 1-5');
  str('bottomLine', r.bottomLine, LIMITS.long);

  if (!r.identity) e.push('identity missing');
  else {
    str('identity.offense', r.identity.offense, LIMITS.long);
    str('identity.defense', r.identity.defense, LIMITS.long);
    arr('identity.expectFromUser', r.identity.expectFromUser, 2, 5).forEach((x, i) => str(`identity.expectFromUser[${i}]`, x));
  }

  arr('keys', r.keys, 3, 3).forEach((k, i) => {
    str(`keys[${i}].title`, k.title, 60);
    str(`keys[${i}].detail`, k.detail, LIMITS.short * 2);
    conf(`keys[${i}]`, k.conf);
  });

  const players = (path, list, side, min, max) =>
    arr(path, list, min, max).forEach((t, i) => {
      if (!names(f, side).has(t.player)) e.push(`${path}[${i}].player "${t.player}" is not a projected ${side} starter`);
      str(`${path}[${i}].why`, t.why);
      if ('how' in t || path.endsWith('targets') || path.endsWith('mustStop') || path.endsWith('exploit')) str(`${path}[${i}].how`, t.how);
      conf(`${path}[${i}]`, t.conf);
    });
  const calls = (path, list, book) =>
    arr(path, list, 4, 8).forEach((c, i) => {
      if (!String(c.playId || '').startsWith(book + '-')) e.push(`${path}[${i}].playId must come from ${book}`);
      else if (catalogIds && !catalogIds.has(c.playId)) e.push(`${path}[${i}].playId ${c.playId} not in catalog`);
      else if (catalogIds && catalogIds.get(c.playId) !== c.name) e.push(`${path}[${i}].name "${c.name}" != catalog "${catalogIds.get(c.playId)}"`);
      str(`${path}[${i}].formation`, c.formation, 60);
      str(`${path}[${i}].why`, c.why);
    });
  const counters = (path, list) =>
    arr(path, list, 2, 4).forEach((c, i) => { str(`${path}[${i}].tell`, c.tell); str(`${path}[${i}].answer`, c.answer); });

  if (!r.attack) e.push('attack missing');
  else {
    str('attack.plan', r.attack.plan, LIMITS.long);
    players('attack.targets', r.attack.targets, 'defense', 2, 4);
    arr('attack.avoid', r.attack.avoid, 1, 3).forEach((t, i) => {
      if (!names(f, 'defense').has(t.player)) e.push(`attack.avoid[${i}].player "${t.player}" is not a projected defense starter`);
      str(`attack.avoid[${i}].why`, t.why);
      conf(`attack.avoid[${i}]`, t.conf);
    });
    calls('attack.calls', r.attack.calls, 'falcons-off');
    counters('attack.counters', r.attack.counters);
  }
  if (!r.defend) e.push('defend missing');
  else {
    str('defend.plan', r.defend.plan, LIMITS.long);
    players('defend.mustStop', r.defend.mustStop, 'offense', 2, 4);
    players('defend.exploit', r.defend.exploit, 'offense', 1, 3);
    calls('defend.calls', r.defend.calls, 'falcons-def');
    counters('defend.counters', r.defend.counters);
  }

  arr('liveTells', r.liveTells, 3, 5).forEach((t, i) => {
    str(`liveTells[${i}].watch`, t.watch);
    str(`liveTells[${i}].meaning`, t.meaning);
    str(`liveTells[${i}].response`, t.response);
  });
  str('specialTeams', r.specialTeams, LIMITS.short * 2);
  arr('sources', r.sources, 2, 12).forEach((s, i) => {
    str(`sources[${i}].label`, s.label, 120);
    if (!/^https?:\/\//.test(s.url || '')) e.push(`sources[${i}].url must be http(s)`);
  });
  if (/—/.test(JSON.stringify(r))) e.push('report contains an em dash; Kenny does not want them');
  return e;
}
