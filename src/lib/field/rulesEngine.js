// Formation Planner — pure rule validators.
// Each validator takes (players, ctx) and returns a uniform result object.
// ctx = { side: 'offense'|'defense', ruleset: 'nfl'|'ncaa', ballSpot: 'left'|'middle'|'right' }
//
// validateFormation() aggregates them into { valid, errors, warnings, byPlayer }.

import { isOnLine, inBackfield, isEligible } from './fieldConfig';

function result(rule, valid, severity, message, playerIds = []) {
  return { rule, valid, severity, message, playerIds };
}

// ── Hard rules (severity: 'error') ────────────────────────────────────────

function exactlyEleven(players) {
  const n = players.length;
  return result(
    'exactly-eleven',
    n === 11,
    'error',
    n === 11 ? 'Eleven players.' : `Need exactly 11 players (have ${n}).`,
    n === 11 ? [] : players.map((p) => p.id),
  );
}

function onLineMinimum(players, ctx) {
  if (ctx.side !== 'offense') return null;
  const onLine = players.filter(isOnLine);
  const ok = onLine.length >= 7;
  return result(
    'on-line-min',
    ok,
    'error',
    ok
      ? `${onLine.length} on the line.`
      : `Need ≥7 on the line of scrimmage (have ${onLine.length}).`,
    ok ? [] : players.filter((p) => !isOnLine(p)).map((p) => p.id),
  );
}

function backfieldMaximum(players, ctx) {
  if (ctx.side !== 'offense') return null;
  const back = players.filter((p) => inBackfield(p, 'offense'));
  const ok = back.length <= 4;
  return result(
    'backfield-max',
    ok,
    'error',
    ok
      ? `${back.length} in the backfield.`
      : `No more than 4 in the backfield (have ${back.length}).`,
    ok ? [] : back.map((p) => p.id),
  );
}

function ineligibleNumbers(players, ctx) {
  if (ctx.side !== 'offense') return null;
  // An eligible-role player wearing a 50–79 number without reporting eligible.
  const offenders = players.filter(
    (p) =>
      p.eligibleOverride !== true &&
      typeof p.jersey === 'number' &&
      p.jersey >= 50 &&
      p.jersey <= 79 &&
      p.pos !== 'OL',
  );
  const ok = offenders.length === 0;
  return result(
    'ineligible-number',
    ok,
    'error',
    ok
      ? 'Numbers are legal.'
      : 'A skill player is wearing an ineligible number (50–79) without reporting eligible.',
    offenders.map((p) => p.id),
  );
}

function inBounds(players) {
  const offenders = players.filter(
    (p) => p.x < 0 || p.x > 1 || p.y < -1 || p.y > 1,
  );
  const ok = offenders.length === 0;
  return result(
    'in-bounds',
    ok,
    'error',
    ok ? 'All players in bounds.' : 'A player is out of bounds.',
    offenders.map((p) => p.id),
  );
}

// NFL only: the two end men on the line must be eligible.
function endmenEligible(players, ctx) {
  if (ctx.side !== 'offense' || ctx.ruleset !== 'nfl') return null;
  const onLine = players.filter(isOnLine);
  if (onLine.length < 2) return null;
  const sorted = [...onLine].sort((a, b) => a.x - b.x);
  const ends = [sorted[0], sorted[sorted.length - 1]];
  const offenders = ends.filter((p) => !isEligible(p));
  const ok = offenders.length === 0;
  return result(
    'endmen-eligible',
    ok,
    'error',
    ok
      ? 'Both ends of the line are eligible.'
      : 'Each end of the line must be an eligible receiver (NFL).',
    offenders.map((p) => p.id),
  );
}

// NFL only: an eligible player buried inside the line is "covered" / illegal.
function noUncoveredInterior(players, ctx) {
  if (ctx.side !== 'offense' || ctx.ruleset !== 'nfl') return null;
  const onLine = players.filter(isOnLine);
  if (onLine.length < 3) return null;
  const sorted = [...onLine].sort((a, b) => a.x - b.x);
  const interior = sorted.slice(1, -1);
  const offenders = interior.filter((p) => isEligible(p));
  const ok = offenders.length === 0;
  return result(
    'covered-receiver',
    ok,
    'error',
    ok
      ? 'No covered receivers.'
      : 'An eligible receiver is covered up on the interior of the line (NFL).',
    offenders.map((p) => p.id),
  );
}

// ── Soft rules (severity: 'warning') ──────────────────────────────────────

function receiverDistribution(players, ctx) {
  if (ctx.side !== 'offense') return null;
  const wideMen = players.filter(
    (p) => isEligible(p) && p.pos !== 'QB' && (p.x < 0.35 || p.x > 0.65),
  );
  if (wideMen.length < 2) return null;
  const left = wideMen.filter((p) => p.x < 0.5).length;
  const right = wideMen.length - left;
  const balanced = Math.abs(left - right) <= 1;
  const label = `${Math.max(left, right)}x${Math.min(left, right)}`;
  return result(
    'receiver-distribution',
    true, // informational, never blocks
    'warning',
    `Receiver set looks ${balanced ? 'balanced' : 'lopsided'} (${label}).`,
    balanced ? [] : wideMen.map((p) => p.id),
  );
}

function boxCount(players, ctx) {
  if (ctx.side !== 'defense') return null;
  const box = players.filter(
    (p) => p.x >= 0.3 && p.x <= 0.7 && p.y > -0.2,
  );
  const light = box.length < 6;
  const heavy = box.length > 8;
  return result(
    'box-count',
    true,
    'warning',
    `${box.length} in the box${light ? ' — light' : heavy ? ' — heavy' : ''}.`,
    [],
  );
}

const HARD = [
  exactlyEleven,
  inBounds,
  onLineMinimum,
  backfieldMaximum,
  ineligibleNumbers,
  endmenEligible,
  noUncoveredInterior,
];
const SOFT = [receiverDistribution, boxCount];

export function validateFormation(players, ctx) {
  const errors = [];
  const warnings = [];
  const byPlayer = {};

  const run = (fn) => {
    const r = fn(players, ctx);
    if (!r) return;
    if (r.valid && r.severity === 'error') return; // passing hard rules: silent
    if (r.severity === 'error' && !r.valid) errors.push(r);
    if (r.severity === 'warning') warnings.push(r);
    if (!r.valid) {
      for (const id of r.playerIds) {
        (byPlayer[id] ||= []).push(r.rule);
      }
    }
  };

  HARD.forEach(run);
  SOFT.forEach(run);

  return { valid: errors.length === 0, errors, warnings, byPlayer };
}
