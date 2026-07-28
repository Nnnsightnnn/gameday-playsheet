// built by nnnsightnnn — signal from noise
// Coverage Lab — the coverage library.
//
// Every coverage exposes a `build(ctx)` that returns its coverage defenders
// with an if/then rule written from the play-caller's chair, plus how the
// assignment RESOLVES against the routes actually being run:
//
//   { mode: 'zone',  target }              spot drop / landmark
//   { mode: 'man',   key, off }            locked man, trail technique
//   { mode: 'match', key, target }         zone until the trigger, then man
//
// Real-football rules are sourced from MatchQuarters (Cody Alexander), X&O
// Labs, Weekly Spiral, All Eyes DB Camp and The Read Optional's Book of Fangio.
// The CFB 27 layer is sourced from collegefootball.gg's adjustment breakdown
// and the CFB 27 wiki defense guide.

import { FIELD_W } from './labField';

export const TRIGGER_T = 0.34;

/* ── landmark helpers ─────────────────────────────────────────────────────── */

const LM = {
  third: (s) => ({ x: s === 'L' ? FIELD_W * 0.17 : FIELD_W * 0.83, y: 16.5 }),
  midThird: () => ({ x: FIELD_W / 2, y: 17.5 }),
  half: (s) => ({ x: s === 'L' ? FIELD_W * 0.25 : FIELD_W * 0.75, y: 16.5 }),
  flat: (s) => ({ x: s === 'L' ? FIELD_W * 0.12 : FIELD_W * 0.88, y: 5.5 }),
  curl: (s) => ({ x: s === 'L' ? FIELD_W * 0.225 : FIELD_W * 0.775, y: 10.5 }),
  hook: (ball, d) => ({ x: ball + d * 6.2, y: 9.5 }),
  hole: (ball) => ({ x: ball + 2, y: 7.5 }),
  tampa: () => ({ x: FIELD_W / 2, y: 20.5 }),
};

const zone = (p, target, rule, type = 'under') => ({ p, type, rule, res: { mode: 'zone', target } });
const man = (p, key, rule, off = { x: -0.9, y: 0.9 }) => ({
  p, type: 'man', rule, res: { mode: 'man', key, off },
});
const match = (p, key, target, rule, type = 'match') => ({
  p, type, rule, res: { mode: 'match', key, target },
});

function apexSpot(ctx, side, num, depth = 4.6) {
  const r = ctx.n(side, num);
  if (!r) return { x: side === 'L' ? ctx.ball - 6.5 : ctx.ball + 6.5, y: depth };
  const o = side === 'R' ? 1 : -1;
  const tight = Math.abs(r.x - ctx.ball) < 7; // attached TE / compressed split
  return { x: r.x + (tight ? o * 2.4 : -o * 2.6), y: depth };
}
function overTop(ctx, key, d = 14) {
  const r = ctx.g(key);
  if (!r) return LM.half('R');
  return { x: r.x - r.o * 2.2, y: d };
}
function squeeze(ctx, key, d = 12) {
  const r = ctx.g(key);
  if (!r) return LM.curl('R');
  return { x: r.x - r.o * 1.4, y: d };
}
function cbSpot(ctx, key, depth = 7) {
  const r = ctx.g(key);
  if (!r) return { x: ctx.ball, y: depth };
  return { x: r.x + r.o * 1.4, y: depth };
}

/* ── shared side logic ────────────────────────────────────────────────────── */

// The quarters read, reused by Cover 4, Palms, Cover 6, Cover 9 and Solo.
function quartersSide(ctx, side, out, opts = {}) {
  const one = ctx.n(side, 1);
  const two = ctx.n(side, 2);
  const three = ctx.n(side, 3);
  const cbKey = `${side}1`;
  const palmsFired = opts.palms && two && two.cl === 'OUT';

  // corner
  if (palmsFired) {
    out.push(match(`CB ${side}`, `${side}2`, squeeze(ctx, `${side}2`, 7),
      'PALMS TRIGGER FIRED — #2 broke out inside 5. Come off #1 and trap #2. The safety now owns #1 over the top.'));
  } else if (opts.meg) {
    out.push(man(`CB ${side}`, cbKey,
      'MEG — man everywhere he goes on #1, no depth trigger. You are alone unless the poach shows.'));
  } else if (one && one.cl === 'VERT') {
    out.push(match(`CB ${side}`, cbKey, cbSpot(ctx, cbKey),
      '#1 released vertical → carry him man, stay on top with outside leverage. Your read is #1 only.'));
  } else {
    out.push(zone(`CB ${side}`, squeeze(ctx, cbKey, 11.5),
      '#1 broke off or went under → squeeze and rob him from on top. Do NOT chase #2 — that is Palms, not Quarters.', 'deep'));
  }

  // safety
  const sLbl = `S ${side}`;
  if (palmsFired) {
    out.push(zone(sLbl, overTop(ctx, cbKey, 15),
      'The corner jumped #2, so you rotate over the top and cap #1. You are the new deep player outside.', 'deep'));
  } else if (two && two.cl === 'VERT') {
    out.push(match(sLbl, `${side}2`, { x: apexSpot(ctx, side, 2).x, y: 12 },
      '#2 released vertical past the backer level → lock him man up the seam. Your run/pass key is answered.'));
  } else if (two) {
    out.push(zone(sLbl, { x: one ? one.x - one.o * 3.5 : ctx.ball, y: 11.5 },
      '#2 is not vertical → he is a run key. Come off him, cap #1 from inside and be the extra alley hat.', 'deep'));
  } else {
    out.push(zone(sLbl, overTop(ctx, cbKey, 14),
      'No #2 to your side → play top-down on #1 and fold hard to the alley on run action.', 'deep'));
  }

  // apex
  const aLbl = `NB ${side}`;
  if (palmsFired) {
    // The corner already trapped #2 — do NOT double him. Apex between #2 and
    // the tackle, wall #3, and get under anything #1 sits down on.
    if (three && three.cl === 'OUT') {
      out.push(match(aLbl, `${side}3`, LM.curl(side),
        'The corner trapped #2, so you stay inside and take #3 to the flat. Never chase the route your corner already owns.'));
    } else {
      out.push(zone(aLbl, LM.curl(side),
        'The corner trapped #2 — you do NOT double him. Apex between #2 and the tackle, wall #3, get under anything #1 sits down on.'));
    }
  } else if (two && two.cl === 'OUT') {
    out.push(match(aLbl, `${side}2`, LM.curl(side),
      '#2 to the flat → he is yours. Squeeze the throwing lane and tackle in front of the sticks.'));
  } else if (three && three.cl === 'OUT') {
    out.push(match(aLbl, `${side}3`, LM.curl(side),
      '#2 went vertical to the safety → drop off him and take #3 to the flat.'));
  } else {
    out.push(zone(aLbl, LM.curl(side),
      '#2 vertical → collision and wall him to the safety, then settle in curl and rob the in-breaker.'));
  }
}

// The Cover 2 half, reused by Cover 2, Tampa, Cover 6 and Cover 9.
function coverTwoSide(ctx, side, out, label = 'Cloud') {
  out.push(zone(`CB ${side}`, LM.flat(side),
    `${label} — jam and funnel #1 inside, then settle in the hard flat. You are the FORCE player on run to your side.`));
  out.push(zone(`S ${side}`, LM.half(side),
    'Deep half. Everything vertical on your side is yours — #1 and the #2 seam. Do not squat, do not peek.', 'deep'));
  if (ctx.n(side, 2)) {
    out.push(zone(`NB ${side}`, LM.curl(side),
      'Wall #2 inside, carry the seam as far as you can, then settle into curl-hook.'));
  } else {
    out.push(zone(`NB ${side}`, LM.hook(ctx.ball, side === 'L' ? -1 : 1),
      'No #2 to your side — collapse into hook and be the extra fitter in the box.'));
  }
}

// Shared Mike rule for the quarters family. He only expands to #3 when the
// apex is genuinely occupied — otherwise two defenders end up on one receiver.
function quartersMike(ctx, out) {
  const S = ctx.strong;
  const hk = LM.hook(ctx.ball, S === 'R' ? 1 : -1);
  const two = ctx.n(S, 2);
  const three = ctx.n(S, 3);
  const apex = out.find((d) => d.p === `NB ${S}`);
  const apexHasThree = apex && apex.res.key === `${S}3`;

  if (three && three.cl === 'VERT') {
    out.push(match('MIKE', `${S}3`, hk,
      '#3 pushed vertical → wall and carry him until the backside safety poaches.'));
  } else if (three && three.cl === 'OUT' && two && two.cl === 'OUT' && !apexHasThree) {
    out.push(match('MIKE', `${S}3`, hk,
      'Your apex got occupied by #2 to the flat, so YOU expand to #3. This is exactly where flood finds the soft spot.'));
  } else if (apexHasThree) {
    out.push(zone('MIKE', hk,
      'Your apex already widened to #3, so hold the hook. Two defenders on one flat route is how the dig gets thrown behind you.'));
  } else {
    out.push(zone('MIKE', hk, 'Hook to the strength, rob the in-breaker, feel #3 underneath you.'));
  }
}

/* ── the library ──────────────────────────────────────────────────────────── */

export const COVERAGES = {
  /* ============ COVER 3 FAMILY ============ */
  c3sky: {
    name: 'Cover 3 Sky',
    fam: 'Cover 3',
    shell: '1-high (rotate from 2)',
    one: '3-deep / 4-under with the STRONG SAFETY rotated down to the FLAT as the force player.',
    runfit: 'SS is force and contain to the call side.',
    cfb: {
      menu: 'Cover 3 (Sky / base)',
      checks: [
        ['Stack', 'Seam (default) · Combo · Zone It'],
        ['Bunch', 'Skate (default) · Skinny · Skinny Meg · Zone It'],
        ['Trips', 'Skinny (default) · Skinny Meg · Zone It'],
      ],
      tips: [
        'Skate widens the drops toward the bunch — your answer to Flood.',
        'Skinny Meg locks the backside corner in true man; use it when the X is the only real threat.',
        'Zone drops: keep Flats at 5-8. Do not let the game default your rolled safety to 0.',
      ],
    },
    stress: ['4 Verticals — two seams on one free safety.', 'Deep crossers behind an over-widened SS.', 'Boundary fade one-on-one.'],
    call: 'Base early down when you want an eight-man box picture without opening the deep middle. Set the roll to the passing strength.',
    build: (ctx) => {
      const o = [];
      const S = ctx.strong, W = ctx.weak, sd = S === 'R' ? 1 : -1;
      o.push(zone('CB L', LM.third('L'), 'Deep outside third. Bail on the snap, squeeze anything vertical inside, keep width on the comeback.', 'deep'));
      o.push(zone('CB R', LM.third('R'), 'Deep outside third. Bail on the snap, squeeze anything vertical inside, keep width on the comeback.', 'deep'));
      o.push(zone('FS', LM.midThird(), 'Deep middle third. Read the QB. Post and dig are yours over the top.', 'deep'));
      o.push(zone('SS', LM.flat(S), 'SKY — rotate down to the FLAT. Pass: expand and jump anything out there. Run: you are FORCE, set the edge.'));
      o.push(zone(`NB ${W}`, LM.curl(W), 'Weak curl-flat. Collision #2 on his release, then settle and read the QB.'));
      o.push(zone('MIKE', LM.hook(ctx.ball, sd), 'Strong hook. Wall #3 and the crosser, carry any vertical up the middle to the FS.'));
      o.push(zone('WILL', LM.hook(ctx.ball, -sd), 'Weak hook. Feel the drag, rob the dig, expand to weak #2 on a true drop-back.'));
      return o;
    },
  },

  c3cloud: {
    name: 'Cover 3 Cloud',
    fam: 'Cover 3',
    shell: '1-high (corner rolls)',
    one: 'Same 3-deep skeleton, but the CORNER rolls down as flat/force and a safety replaces him in the deep outside third.',
    runfit: 'Call-side CB is force.',
    cfb: {
      menu: 'Cover 3 built manually with a Cloud Flat drop on the call-side corner',
      checks: [
        ['Any', 'Set the call-side CB to Cloud Flat (sinks 8-10) or Hard Flat (shallow, kills the quick out)'],
        ['Trips', 'Skinny / Skinny Meg still govern the match side'],
      ],
      tips: [
        'In CFB 27 most books have no named Cloud play — you build it with the corner zone drop.',
        'Cloud into the boundary is nearly free: there is less grass behind him.',
      ],
    },
    stress: ['The corner route behind a squatted CB — that is the entire point of Smash.', 'Deep comeback on the replacing safety.'],
    call: 'To the boundary, or as a change-up once the offense starts reading your flat defender for RPOs.',
    build: (ctx) => {
      const o = [];
      const S = ctx.strong, cl = ctx.weak, sd = S === 'R' ? 1 : -1;
      o.push(zone(`CB ${cl}`, LM.flat(cl), 'CLOUD — you are the flat and force player. Squeeze #1 off the line, then sit. Nothing gets outside you on run.'));
      o.push(zone(`S ${cl}`, LM.third(cl), 'You replaced the corner. Deep outside third — the corner route behind the cloud corner is YOURS.', 'deep'));
      o.push(zone(`CB ${S}`, LM.third(S), 'Deep outside third, normal Cover 3 rules.', 'deep'));
      o.push(zone('FS', LM.midThird(), 'Deep middle third. Read the QB. Post and dig are yours over the top.', 'deep'));
      o.push(zone(`NB ${S}`, LM.flat(S), 'Strong curl-flat and force to your side, since no safety rolled down over here.'));
      o.push(zone('MIKE', LM.hook(ctx.ball, sd), 'Strong hook. Carry #3 vertical to the FS, then settle and take away the dig.'));
      o.push(zone('WILL', LM.hook(ctx.ball, -sd), 'Weak hook to curl. You have no cloud help on your side — expand fast on any #2 out.'));
      return o;
    },
  },

  c3buzz: {
    name: 'Cover 3 Buzz',
    fam: 'Cover 3',
    shell: '1-high (rotate from 2)',
    one: 'Identical to Sky except the rotated safety BUZZES to the hook/curl instead of the flat. He robs in-breakers; someone else takes the flat.',
    runfit: 'Force passes to the overhang or corner who inherited the flat. Buzz is a pass-down call, not a run-support call.',
    cfb: {
      menu: 'Cover 3 with the rolling safety set to Buzz Flat (5-7) or a hook drop',
      checks: [
        ['Any', 'Buzz Flat sits 5-7 · Hard Flat is shallow · Cloud Flat sinks 8-10'],
        ['Trips', 'Skinny keeps the match rules alive underneath'],
      ],
      tips: [
        'Buzz is the single best in-game answer to Dagger and to spot/snag concepts sitting in the hook.',
        'Pair it with Zone Strategy = Aggressive underneath so he actually jumps the dig.',
      ],
    },
    stress: ['Quick out or hard flat thrown before the flat replacement arrives.', 'Wheel routes.', 'Naked boot away from the roll.'],
    call: '2nd and 3rd-and-long against mesh, drive, spot and dagger teams. You are trading the flat to buy the hook window.',
    build: (ctx) => {
      const o = [];
      const S = ctx.strong, sd = S === 'R' ? 1 : -1;
      o.push(zone('CB L', LM.third('L'), 'Deep outside third. Bail on the snap, squeeze anything vertical inside, keep width on the comeback.', 'deep'));
      o.push(zone('CB R', LM.third('R'), 'Deep outside third. Bail on the snap, squeeze anything vertical inside, keep width on the comeback.', 'deep'));
      o.push(zone('FS', LM.midThird(), 'Deep middle third. Read the QB. Post and dig are yours over the top.', 'deep'));
      o.push(zone('SS', { x: LM.curl(S).x - (S === 'R' ? 3 : -3), y: 8.5 },
        'BUZZ — drop INSIDE to the hook/curl window, not the flat. Rob the dig, drag and spot. You have no force responsibility.', 'rob'));
      o.push(zone(`NB ${S}`, LM.flat(S), 'You inherited the FLAT because the safety buzzed inside. Get out there or the quick out is free.'));
      o.push(zone('MIKE', LM.hook(ctx.ball, sd), 'Strong hook — now doubled up with the buzz safety on anything sitting inside.'));
      o.push(zone('WILL', LM.hook(ctx.ball, -sd), 'Weak hook. Feel the drag, rob the dig, expand to weak #2 on a true drop-back.'));
      return o;
    },
  },

  c3match: {
    name: 'Cover 3 Match (Rip/Liz)',
    fam: 'Cover 3',
    shell: '1-high, disguised from 2',
    one: 'Cover 3 that plays MAN against verticals and ZONE against everything else. Corner is MOD on #1; the overhang carries #2 vertical or converts to seam-hook.',
    runfit: 'Rolled safety to the call side, same as Sky.',
    cfb: {
      menu: 'Cover 3 Match — the Seam / Skinny checks',
      checks: [
        ['Stack', 'Seam (default match) · Combo (swap on release) · Zone It (kills matching)'],
        ['Bunch', 'Skate · Skinny · Skinny Meg · Zone It'],
        ['Trips', 'Skinny (default) · Skinny Meg · Zone It'],
      ],
      tips: [
        'Skinny = the seam defender takes #2 outside/vertical. That is the true Rip/Liz rule in CFB 27.',
        'Skinny Meg adds: the backside corner skips the depth trigger and plays pure man on every route.',
        'If quick game is shredding you, hit Zone It — match rules are useless before routes declare.',
      ],
    },
    stress: ['Quick game and RPOs thrown before routes declare vertical.', 'Option and choice routes sitting right at the conversion depth.', 'Naked boot away from the roll.'],
    call: 'Your base MOFC call. It exists because spot-drop Cover 3 cannot handle four verticals.',
    build: (ctx) => {
      const o = [];
      const S = ctx.strong, W = ctx.weak, sd = S === 'R' ? 1 : -1;
      ['L', 'R'].forEach((s) => {
        const one = ctx.n(s, 1);
        if (one && one.cl === 'VERT') {
          o.push(match(`CB ${s}`, `${s}1`, LM.third(s),
            'MOD — #1 went vertical past 10-12, so he is man now. Stay width-conscious of your third.'));
        } else {
          o.push(zone(`CB ${s}`, LM.third(s),
            'MOD — #1 stayed shallow, so you stay ZONE. Sink, rob the curl, never chase him down.', 'deep'));
        }
      });
      o.push(zone('FS', LM.midThird(), 'Deep middle third. Post and dig over the top of whoever is carrying #2.', 'deep'));
      const two = ctx.n(S, 2);
      if (two && two.cl === 'VERT') {
        o.push(match(`SS ${S}`, `${S}2`, LM.curl(S),
          'MATCH — #2 released vertical → CARRY HIM MAN up the seam. This is the rule that kills four verticals.'));
      } else {
        o.push(zone(`SS ${S}`, LM.curl(S),
          'SEAM-HOOK CONVERSION — #2 did not go vertical, so pass him off and re-read the next threat into your zone.'));
      }
      o.push(zone(`NB ${W}`, LM.curl(W), 'Weak curl-flat. Same match rule applies to weak #2 — carry him vertical, otherwise convert.'));
      o.push(zone('MIKE', LM.hook(ctx.ball, sd), 'Strong hook. Match #3 vertical — carry him to the FS, otherwise settle and rob the crosser.'));
      o.push(zone('WILL', LM.hook(ctx.ball, -sd), 'Weak hook. Wall anything crossing your face, then get width to the weak curl.'));
      return o;
    },
  },

  /* ============ QUARTERS FAMILY ============ */
  c4: {
    name: 'Cover 4 (Quarters)',
    fam: 'Quarters',
    shell: '2-high',
    one: '4-deep, 3-under. The corner ALWAYS has #1. The safety reads #2: vertical = lock him, not vertical = he is a run key, come fill.',
    runfit: 'Both safeties are true extra run defenders. Corners force on the perimeter.',
    cfb: {
      menu: 'Cover 4',
      checks: [
        ['Stack', 'Quarters (default) · Zone It · Triangle (3-over-2 bracket)'],
        ['Bunch', 'Box (default, quadrants) · Bingo (Box + CB locks #1 if he stays outside) · Point Triangle · Zone It'],
        ['Trips', 'Quarters (default) · Stress (all-verts converts to even spacing) · Zone It'],
        ['1 Receiver', 'Solo (default — weak CB locks the iso, weak S free to poach) · Solo Cut · Quarters'],
      ],
      tips: [
        'Stress is the trips check that fixes the four-verts spacing bind. Learn it.',
        'Box beats trying to match individual receivers out of a bunch pile.',
        'Zone It is your panic button when the AI matches wrong on rub releases.',
      ],
    },
    stress: ['Flat and quick game — both DBs are reading vertical.', 'Play-action to #2 baits the safety run key.', 'Deep out and comeback against a soft corner.'],
    call: 'Base early down against balanced or run-heavy sets. You get an extra hat to the run while staying two-high.',
    build: (ctx) => {
      const o = [];
      quartersSide(ctx, 'L', o);
      quartersSide(ctx, 'R', o);
      quartersMike(ctx, o);
      return o;
    },
  },

  palms: {
    name: 'Palms / 2-Read',
    fam: 'Quarters',
    shell: '2-high (identical to Quarters)',
    one: 'Same picture as Quarters, opposite reaction to #2. If #2 breaks OUT inside 5 the CORNER comes off #1 and traps him while the SAFETY rotates over the top to cap #1.',
    runfit: 'The corner becomes the force player whenever #2 declares short — a different fit than base Quarters despite identical alignment.',
    cfb: {
      menu: 'Palms (a Cover 4 variant)',
      checks: [
        ['Stack', 'Palms (default) · Triangle · Zone It'],
        ['Bunch', 'Box (default) · Bingo · Point Triangle · Zone It'],
        ['Trips', 'Stubbie (default — CB MEG #1, apex and safety share #2 and #3) · Zone It'],
        ['1 Receiver', 'Solo (default) · Solo Cut · Quarters'],
      ],
      tips: [
        'Palms answers bubble, stick-flat and speed-out RPOs WITHOUT changing the picture the QB sees.',
        'Stubbie is the trips version — do not expect true Palms rules against three receivers.',
        'The AI corner bites hard on the out. Expect to get burned by out-and-up.',
      ],
    },
    stress: ['Double moves off the out — out-and-up, whip, pivot.', 'A hard corner or deep comeback by #1 punishing the safety\'s late rotation.', 'Switch and rub releases that scramble who "#2" is.'],
    call: 'Against spread teams living on quick game to the slot. Same shell as Quarters, so the QB cannot identify you pre-snap.',
    build: (ctx) => {
      const o = [];
      quartersSide(ctx, 'L', o, { palms: true });
      quartersSide(ctx, 'R', o, { palms: true });
      quartersMike(ctx, o);
      return o;
    },
  },

  solo: {
    name: 'Cover 4 Solo / Poach',
    fam: 'Quarters',
    shell: '2-high vs 3x1',
    one: 'Quarters to trips with the BACKSIDE safety keying #3 — vertical means he poaches the middle, anything else means he rotates to help the isolated corner.',
    runfit: 'Trips-side safety fits the alley; the backside safety is late help either way.',
    cfb: {
      menu: 'Cover 4 → the Solo / Solo Cut check on the 1-Receiver side',
      checks: [
        ['1 Receiver', 'Solo (default) — weak CB locks the iso, weak S free to poach'],
        ['1 Receiver', 'Solo Cut — weak S takes short in-breakers, the corner is freed'],
        ['1 Receiver', 'Quarters — both play standard match, NO poach help'],
        ['Trips side', 'Stubbie / Quarters / Stress apply independently'],
      ],
      tips: [
        'If the offense keeps #3 in to block, your poach never happens and the X really is alone. That is the trade.',
        'Solo = the safety cheats pre-snap. Poach = he reacts post-snap. Solo tips the coverage; Poach does not.',
      ],
    },
    stress: ['The offense strips your help by keeping #3 in, then takes a shot at the isolated X.', 'Any one-on-one the backside corner loses.'],
    call: 'Against trips when you need four-over-three to the field without giving up the box. Requires a corner who can live alone.',
    build: (ctx) => {
      const o = [];
      const S = ctx.strong, W = ctx.weak;
      quartersSide(ctx, S, o);
      o.push(man(`CB ${W}`, `${W}1`,
        'MEG — lock the isolated X. Your help is CONDITIONAL: it only shows up if #3 goes vertical.'));
      const three = ctx.n(S, 3);
      if (three && three.cl === 'VERT') {
        o.push(zone(`S ${W}`, { x: FIELD_W / 2, y: 14 },
          'POACH — #3 released vertical, so rob the deep middle. You are now the free player over the top of #3.', 'rob'));
      } else {
        o.push(zone(`S ${W}`, overTop(ctx, `${W}1`, 15),
          '#3 did NOT go vertical → forget the poach, rotate over the top and help your isolated corner.', 'deep'));
      }
      o.push(zone(`NB ${W}`, LM.hook(ctx.ball, W === 'R' ? 1 : -1),
        'Weak hook. Fold to the run, and be ready for the backside dig now that your safety may be gone.'));
      o.push(zone('MIKE', LM.hook(ctx.ball, S === 'R' ? 1 : -1),
        'Wall #3 underneath and carry him until the poach shows up behind you.'));
      return o;
    },
  },

  c6: {
    name: 'Cover 6 (Quarter-Quarter-Half)',
    fam: 'Split-field',
    shell: '2-high, split',
    one: 'QUARTERS to the passing strength, COVER 2 to the single-receiver side. In EA terms: Cover 4 strong, Cover 2 weak.',
    runfit: 'The quarters side gets the extra safety hat. The Cover 2 side forces with the corner.',
    cfb: {
      menu: 'Cover 6',
      checks: [
        ['Stack', 'Quarters (default) · Zone It · Triangle — these govern the QUARTERS side only'],
        ['Bunch', 'Box · Bingo · Point Triangle · Zone It'],
        ['Trips', 'Stubbie (default) · Zone It'],
        ['Note', 'The Cover 2 half has no match checks — it is a pure cloud and half read'],
      ],
      tips: [
        'Default Cover 6 vs stack: CB follows #1 deep, S matches #2 vertical, the flat defender takes #2 out, the underneath takes #3.',
        'Triangle turns the stack side into a 3-over-2 with the safety bracketing whoever goes deeper.',
      ],
    },
    stress: ['Deep corner or out stressing the lone half-safety.', 'Quick game to the quarters-side flat.', 'The seam in the middle where the two shells meet.'],
    call: 'Against teams that isolate a dominant X backside — match to the receiver-heavy side, two-deep double on the isolated side.',
    build: (ctx) => {
      const o = [];
      quartersSide(ctx, ctx.strong, o);
      coverTwoSide(ctx, ctx.weak, o, 'Cover 2 half');
      o.push(zone('MIKE', LM.hook(ctx.ball, ctx.strong === 'R' ? 1 : -1),
        'Hook to the split. You are the stitch between two different shells — do not lose the crosser through the middle.'));
      return o;
    },
  },

  c9: {
    name: 'Cover 9 (flipped Cover 6)',
    fam: 'Split-field',
    shell: '2-high, split',
    one: 'The mirror of Cover 6: COVER 2 to the passing STRENGTH, QUARTERS to the weak side. Offset safeties are your pre-snap tell.',
    runfit: 'The corner forces to the strength; the quarters safety is the extra hat weak.',
    cfb: {
      menu: 'Cover 9',
      checks: [
        ['Strong side', 'Cover 2 rules — cloud corner plus a deep-half safety. No match checks.'],
        ['Weak side', 'Quarters and Solo checks apply.'],
        ['Note', 'Against 3x1 the backside safety adds to the strength, creating a five-over-three count.'],
      ],
      tips: [
        'Cover 9 is the answer when the trips side is the problem and the single receiver is not.',
        'Strong against RPOs to the field, because the cloud corner is a true force defender out there.',
        'NAMING: in Vic Fangio\'s NFL system "Cover 9" means weak-rotation Cover 3 — a three-deep coverage, nothing like this. EA uses the flipped-Cover-6 meaning.',
      ],
    },
    stress: ['The isolated backside receiver gets quarters, not a double — a real X can win there.', 'Deep out on the half-safety over trips.'],
    call: 'Against trips when the field side is the offense\'s engine. Cloud the strength, keep quarters run support into the boundary.',
    build: (ctx) => {
      const o = [];
      coverTwoSide(ctx, ctx.strong, o, 'Cover 2 half');
      quartersSide(ctx, ctx.weak, o);
      o.push(zone('MIKE', LM.hook(ctx.ball, ctx.strong === 'R' ? 1 : -1),
        'Hook to the strength. Help underneath the cloud corner on any #3 to the flat.'));
      return o;
    },
  },

  /* ============ COVER 2 FAMILY ============ */
  c2: {
    name: 'Cover 2 (zone)',
    fam: 'Cover 2',
    shell: '2-high',
    one: '2-deep, 5-under. Corners jam and funnel, then play the hard flat. The Mike sits in a SHALLOW hook — that is the whole difference from Tampa 2.',
    runfit: 'Both corners force. The best perimeter run-support zone you own.',
    cfb: {
      menu: 'Cover 2',
      checks: [
        ['Any', 'Zone drops are the real adjustment: Flats 0-5 to squat, 10-15 to sink under the corner route'],
        ['Any', 'Set Zone Strategy to Conservative if the seam keeps hurting you'],
      ],
      tips: [
        'Known CFB 27 bug: Cover 2 shells sometimes align completely differently against the same formation. Verify your own shell pre-snap every play.',
        'If you see four verticals, your Mike has to get depth or you are dead in the seam.',
      ],
    },
    stress: ['4 Verticals — the #2 seam splits both safeties over a shallow Mike. This is the number-one vulnerability.', 'Smash — the corner route behind a jammed CB.', 'Deep out and comeback on an aggressive flat corner.'],
    call: 'Run-heavy or short-yardage downs when you want both corners in the fit and you do not fear the deep seam.',
    build: (ctx) => {
      const o = [];
      coverTwoSide(ctx, 'L', o);
      coverTwoSide(ctx, 'R', o);
      o.push(zone('MIKE', { x: ctx.ball + 1.5, y: 9 },
        'SHALLOW hook, roughly 8-10 yards. You are NOT the deep middle player — that is Tampa 2.'));
      return o;
    },
  },

  tampa2: {
    name: 'Tampa 2',
    fam: 'Cover 2',
    shell: '2-high → effectively 3-deep',
    one: 'Cover 2 underneath, but the MIKE sprints to 18-25 yards splitting the safeties and takes the deep middle. That single drop turns two-deep into three-deep.',
    runfit: 'Corners force. Safeties fold late. The Mike is gone, so your box is a hat light on pass reads.',
    cfb: {
      menu: 'Cover 2 with the Mike given a deep hook drop (25-30)',
      checks: [
        ['Any', 'Manually set the Mike\'s hook drop to 20-30 yards to build true Tampa'],
        ['Any', 'The community "Mable-style" macro: Flat zones 25, Curl-Flats 5, outside CBs Cloud Flat, safeties deep halves'],
      ],
      tips: [
        'You need a rangy MLB rating or the deep middle drop is cosmetic.',
        'This is one of the most useful custom macros to save in one of the 10 CFB 27 adjustment slots.',
      ],
    },
    stress: ['The Tampa 2 hole — anything at 15-20 yards beside the Mike. Dagger\'s dig lives here.', 'RB wheel or seam once the Mike is occupied.', 'It requires the front four to rush alone.'],
    call: 'Obvious pass with a rangy Mike, especially against deep-crosser offenses.',
    build: (ctx) => {
      const o = [];
      coverTwoSide(ctx, 'L', o);
      coverTwoSide(ctx, 'R', o);
      o.push(zone('MIKE', LM.tampa(),
        'TAMPA — sprint the deep middle to 18-25 yards. You are the third deep defender. Deny the post and the skinny seam.', 'deep'));
      return o;
    },
  },

  c2invert: {
    name: 'Cover 2 Invert / Trap',
    fam: 'Cover 2',
    shell: '2-high (disguise)',
    one: 'Cover 2 with the CORNER and SAFETY trading jobs: the safety rolls down to flat/force, the corner bails to the deep half. Trap is the conditional version — it only inverts if #2 breaks out.',
    runfit: 'The SAFETY is the force player — structurally different from every other Cover 2 variant.',
    cfb: {
      menu: 'Cover 2 with inverted zone assignments (safety → Hard/Buzz Flat, CB → Deep Half)',
      checks: [
        ['Any', 'Assign the CB a Deep Half zone and the safety a Flat zone individually'],
        ['Any', 'Roll Coverage lets you show one shell and rotate at or after the snap'],
      ],
      tips: [
        'This is the best in-game bait against an opponent who reads your flat defender pre-snap for RPOs.',
        'Roll Coverage targeting (WR1 / Pass Strength / Field / Boundary / Fastest) is how you aim the disguise.',
      ],
    },
    stress: ['A quick hitch-seam or smash thrown before the bailing corner reaches depth.', 'Motion that forces you to tip the disguise early.'],
    call: 'Change-up only, never a base call. Use it once the opponent has proven he is reading your force player.',
    build: (ctx) => {
      const o = [];
      const S = ctx.strong;
      const two = ctx.n(S, 2);
      // Invert is a SIDED call. The call side trades jobs; the away side plays
      // straight Cover 2, which is what makes the exchange legible on film.
      if (two && two.cl === 'OUT') {
        o.push(match(`CB ${S}`, `${S}2`, LM.flat(S),
          'TRAP TRIGGER — #2 broke outside, so drop #1 to the safety and jump the out underneath him.'));
      } else {
        o.push(zone(`CB ${S}`, LM.half(S),
          'INVERT — bail from your Cover 2 look to the DEEP HALF. You are the safety on this snap.', 'deep'));
      }
      o.push(zone(`S ${S}`, LM.flat(S),
        'INVERT — roll DOWN to the flat. You are the force player now, not the corner.'));
      o.push(zone(`NB ${S}`, LM.curl(S),
        'Curl-hook. Wall #2 inside so the rolling safety can play over the top of the out.'));
      coverTwoSide(ctx, ctx.weak, o, 'Away side — straight Cover 2');
      o.push(zone('MIKE', { x: ctx.ball + 1.5, y: 9 },
        'Short hook at 8-10. The invert changes the perimeter, not the middle.'));
      return o;
    },
  },

  /* ============ MAN FAMILY ============ */
  c2man: {
    name: 'Cover 2 Man (Cover 5)',
    fam: 'Man',
    shell: '2-high',
    one: 'The same two-deep shell as Cover 2, but the five underneath defenders are in MAN, trailing with help over the top.',
    runfit: 'Weak — man defenders chase. Safeties fold late.',
    cfb: {
      menu: 'Cover 2 Man',
      checks: [
        ['Stack', 'Lock (default, no switching) · Combo (nearest two swap on release) · Triangle (3-on-2 bracket)'],
        ['Bunch', 'Point Combo (middle man locks, other two swap) · Point Triangle (4-on-3 with safety bracket) · Lock'],
        ['Any', 'Cross Man is back in CFB 27 for cleaner matchup handling'],
      ],
      tips: [
        'Combo is the whole reason stacks stop beating you — without it your two defenders collide.',
        'Point Triangle against bunch is the single strongest man check in the game.',
      ],
    },
    stress: ['Pick, rub and mesh — the classic man beaters.', 'A deep dig or post into the seam between the two halves.', 'Scramble drill.'],
    call: '3rd-and-medium when you want man coverage with insurance. Lower risk than Cover 1 or Cover 0.',
    build: (ctx) => {
      const o = [];
      o.push(zone('S L', LM.half('L'), 'Deep half — but play HELP, not zone. Break on whoever your man defender is trailing.', 'deep'));
      o.push(zone('S R', LM.half('R'), 'Deep half — help over the top. Trust the trail technique underneath you.', 'deep'));
      ['L', 'R'].forEach((s) => {
        if (ctx.n(s, 1)) o.push(man(`CB ${s}`, `${s}1`, 'Man on #1. Trail inside-out — you have a half-safety over the top, so you can be aggressive at the line.'));
        if (ctx.n(s, 2)) o.push(man(`NB ${s}`, `${s}2`, 'Man on #2. Inside leverage, funnel him into the safety help. Never let him cross your face clean.'));
        if (ctx.n(s, 3)) o.push(man('SAM', `${s}3`, 'Man on #3. Expect the rub — this is the receiver bunch and stack concepts are built to free.'));
      });
      o.push(man('MIKE', 'RB', 'Man on the back. If he stays in to protect, become the rat and rob the first crosser.'));
      return o;
    },
  },

  c1: {
    name: 'Cover 1 (Robber / Hole)',
    fam: 'Man',
    shell: '1-high',
    one: 'Man across the board, one FS in the deep middle, and one free rat reading the QB in the hole. That rat is your eleventh man in the run fit.',
    runfit: 'The best man run-fit you have — the rat is an extra body.',
    cfb: {
      menu: 'Man Coverage / Cover 1 (Hole, Robber)',
      checks: [
        ['Stack', 'Lock · Combo · Triangle'],
        ['Bunch', 'Point Combo · Point Triangle · Lock'],
        ['Any', 'Bracket a receiver by assigning a second defender to him individually'],
      ],
      tips: [
        'Known CFB 27 bug: Cover 1 Hole occasionally aligns like a different shell. Verify pre-snap.',
        'Naming: RAT = a DE dropping off a blitz · LURK = the LB opposite the back · HOLE = the strong safety · CROSS = the weak safety.',
      ],
    },
    stress: ['Pick and rub concepts, and mesh.', 'Deep crossers.', 'A mobile QB pulls the rat and the FS out of position.'],
    call: 'Money down. Kills crossing routes and RPO reads, and disguises pressure well.',
    build: (ctx) => {
      const o = [];
      o.push(zone('FS', LM.midThird(), 'Deep middle. Read the QB\'s drop and eyes. You are the only thing behind everybody.', 'deep'));
      o.push(zone('SS', LM.hole(ctx.ball),
        'RAT / HOLE — sit in the middle under the FS, read the QB, jump any in-breaker your man defenders are trailing.', 'rob'));
      ['L', 'R'].forEach((s) => {
        if (ctx.n(s, 1)) o.push(man(`CB ${s}`, `${s}1`, 'MEG on #1. Your only help is the FS over the top and the rat on anything breaking inside.'));
        if (ctx.n(s, 2)) o.push(man(`NB ${s}`, `${s}2`, 'MEG on #2. Play inside leverage and drive everything back toward the rat in the hole.'));
        if (ctx.n(s, 3)) o.push(man('SAM', `${s}3`, 'MEG on #3. You are the most likely rub victim — communicate the switch or take the pick.'));
      });
      o.push(man('MIKE', 'RB', 'Man on the back. Carry him out of the backfield; if he protects, you become a second robber.'));
      return o;
    },
  },

  c0: {
    name: 'Cover 0',
    fam: 'Man',
    shell: '0-high',
    one: 'Man on everybody, nobody deep, nobody in the hole. Every other defender rushes. It is Cover 1 with the rat and the free safety sent.',
    runfit: 'Every man defender fits alone. Leverage is everything.',
    cfb: {
      menu: 'Cover 0 / Man Blitz',
      checks: [
        ['Stack', 'Lock · Combo · Triangle'],
        ['Bunch', 'Point Combo · Point Triangle · Lock'],
        ['Any', 'Press everyone, or you have given away free releases with zero help behind'],
      ],
      tips: [
        'Best in the red zone — the field is already shrunk, so "no help deep" costs less.',
        'If they hot-route to slants you lose. Have a plan for the sight adjust.',
      ],
    },
    stress: ['Hot and sight-adjust slants beating the blitz.', 'Any one-on-one loss is a touchdown.', 'Screens if the rush overpursues.'],
    call: 'Desperation pressure, the red zone, or a decisive man-talent edge.',
    build: (ctx) => {
      const o = [];
      ['L', 'R'].forEach((s) => {
        if (ctx.n(s, 1)) o.push(man(`CB ${s}`, `${s}1`, 'Man on #1 with zero help anywhere. Press, squeeze, and take away the slant first.'));
        if (ctx.n(s, 2)) o.push(man(`NB ${s}`, `${s}2`, 'Man on #2 with zero help. Trail tight — there is nothing behind you and nothing inside you.'));
        if (ctx.n(s, 3)) o.push(man('SAM', `${s}3`, 'Man on #3 with zero help. Expect a rub; you have to fight through it, not around it.'));
      });
      o.push(man('SS', 'RB', 'Man on the back. If he releases you are a coverage player; if he blocks, add to the rush.'));
      o.push(zone('FS', { x: ctx.ball + 3.5, y: 2.2 },
        'RUSHING — you are the extra hat that makes this Cover 0. Get home or this is a touchdown.', 'rush'));
      o.push(zone('MIKE', { x: ctx.ball - 2, y: 2.2 },
        'RUSHING the A gap. The whole call is a bet that pressure beats the sight adjust.', 'rush'));
      return o;
    },
  },
};

export const FAMILIES = [
  ['Cover 3 Family', ['c3sky', 'c3cloud', 'c3buzz', 'c3match']],
  ['Quarters Family', ['c4', 'palms', 'solo', 'c6', 'c9']],
  ['Cover 2 Family', ['c2', 'tampa2', 'c2invert']],
  ['Man Family', ['c2man', 'c1', 'c0']],
];

export { LM, apexSpot };
