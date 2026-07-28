// built by nnnsightnnn — signal from noise
// Coverage Lab — offensive pictures.
//
// Receiver splits are derived from the ball's actual hash placement rather than
// hard-coded, so moving the ball left/middle/right (or switching NFL ↔ NCAA
// hashes) genuinely changes the amount of grass each side has to defend. That
// is the whole point of studying field-vs-boundary calls like Cover 6 and 9.

import { FIELD_W, clampX } from './labField';

// Widest split available to #1 on a side: hug the numbers, never crowd the
// sideline, never align closer than 10 yds from the ball.
function outsideX(ball, o) {
  const room = o > 0 ? FIELD_W - 4 - ball : ball - 4;
  return clampX(ball + o * Math.min(30, Math.max(10, room)));
}

const OL_DX = [-3.4, -1.7, 0, 1.7, 3.4];

/**
 * @param {string} key   formation id
 * @param {number} ball  ball x in yards
 * @param {boolean} flip mirror the formation (put the strength into the boundary)
 */
export function buildFormation(key, ball, flip = false) {
  const s = flip ? -1 : 1; // +1 = strength right
  const strong = flip ? 'L' : 'R';
  const weak = flip ? 'R' : 'L';
  const wide = (o) => outsideX(ball, o);
  const recs = [];
  const add = (k, id, x, y) => recs.push({ k, id, x: clampX(x), y });

  const S = s, W = -s;
  const sideOf = (o) => (o > 0 ? 'R' : 'L');
  const key1 = (o) => `${sideOf(o)}1`;
  const key2 = (o) => `${sideOf(o)}2`;
  const key3 = (o) => `${sideOf(o)}3`;

  let back = { k: 'RB', id: 'RB', x: clampX(ball + 3 * S), y: -5.6 };

  switch (key) {
    case 'trips': {
      const x1 = wide(S);
      add(key1(S), 'Z', x1, 0);
      add(key2(S), 'Y', x1 - S * 6.8, -0.8);
      add(key3(S), 'H', x1 - S * 13, -0.8);
      add(key1(W), 'X', wide(W), 0);
      back = { k: 'RB', id: 'RB', x: clampX(ball + 3 * W), y: -5.6 };
      break;
    }
    case 'bunch': {
      const x1 = clampX(ball + S * Math.min(24, Math.max(12, S > 0 ? FIELD_W - 8 - ball : ball - 8)));
      add(key1(S), 'Z', x1, -1.6);
      add(key2(S), 'Y', x1 - S * 3.4, 0);
      add(key3(S), 'H', x1 - S * 7, -1.6);
      add(key1(W), 'X', wide(W), 0);
      back = { k: 'RB', id: 'RB', x: clampX(ball + 3 * W), y: -5.6 };
      break;
    }
    case 'stack': {
      const x1 = wide(S);
      add(key1(S), 'Z', x1, 0);
      add(key2(S), 'Y', x1, -3.2);
      const xw = wide(W);
      add(key1(W), 'X', xw, 0);
      add(key2(W), 'H', xw - W * 7, -0.8);
      break;
    }
    case 'pro': {
      add(key1(S), 'Z', wide(S), 0);
      add(key2(S), 'Y', ball + S * 5.4, 0); // attached TE
      add(key1(W), 'X', wide(W), 0);
      back = { k: 'RB', id: 'RB', x: clampX(ball), y: -5.6 };
      break;
    }
    case 'doubles':
    default: {
      const xs = wide(S);
      add(key1(S), 'Z', xs, 0);
      add(key2(S), 'Y', xs - S * 7, -0.8);
      const xw = wide(W);
      add(key1(W), 'X', xw, 0);
      add(key2(W), 'H', xw - W * 7, -0.8);
      break;
    }
  }

  const line = OL_DX.map((dx, i) => ({ id: `OL${i}`, x: clampX(ball + dx), y: 0 }));
  return {
    recs,
    back,
    line,
    qb: { x: clampX(ball), y: -5 },
    strong,
    weak,
  };
}

export const FORMATIONS = {
  doubles: {
    name: 'Doubles 2x2',
    blurb:
      'Gun 2x2. The cleanest picture for isolating a single match trigger — nothing else is moving.',
  },
  trips: {
    name: 'Trips 3x1',
    blurb:
      'Three to one side, X isolated backside. Where Solo, Poach, Stubbie and the Cover 6 / Cover 9 decision live.',
  },
  bunch: {
    name: 'Bunch',
    blurb:
      'Compressed three-man surface. Forces the Box / Bingo / Point Triangle family and breaks pure man leverage.',
  },
  stack: {
    name: 'Stack 2x2',
    blurb:
      'Slot stacked behind the outside receiver. Kills press leverage and triggers the Combo / Triangle checks.',
  },
  pro: {
    name: 'Pro 2x1 (Iso X)',
    blurb:
      'TE attached, X alone backside. The 1-Receiver check side — Solo, Solo Cut, MEG.',
  },
};
