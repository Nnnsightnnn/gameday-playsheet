// built by nnnsightnnn — signal from noise
// Personnel model — the vocabulary every team's role sheet is written in.
//
// Kenny's gap (voice note, 2026-08-14): "I kinda have a blanket scheme and
// I'm hoping that individuals fill their scheme. I don't know precisely how
// they can fill each role." This module is the answer's skeleton: a role is
// a JOB, a set of RATINGS that let a body do that job, a NAMED PLAYER who
// currently holds it, the FAILURE MODE when the fit is wrong, and the
// BETWEEN-PLAY READS that tell you to change it.
//
// Sourcing discipline: Madden 27 shipped 2026-08-13. There is no settled
// competitive ratings consensus yet — MUT.GG's own ability tier list still
// reads "Unrated." Every claim below carries a `conf` tag so the sheet never
// launders a Madden 26 rumor as a Madden 27 fact.

export const CONFIDENCE = {
  ea: {
    id: 'ea',
    label: 'EA / M27',
    blurb:
      'First-party Madden 27 — EA gameplay deep dive, EA ratings site, or EA archetype data. Treat as fact.',
  },
  m27: {
    id: 'm27',
    label: 'M27 sourced',
    blurb:
      'Madden 27 specific, from a credible non-EA source (Huddle.gg, Civil.GG, Operation Sports). Good but young.',
  },
  m26: {
    id: 'm26',
    label: 'M26 carryover',
    blurb:
      'Madden 26 consensus, not re-tested for Madden 27. Directionally useful; verify before betting a game on it.',
  },
  stale: {
    id: 'stale',
    label: 'Old but tested',
    blurb:
      'From a real lab test in an older Madden (M18–M25). The number is real; the year is not this one.',
  },
  read: {
    id: 'read',
    label: 'My read',
    blurb:
      'Reasoned from verified mechanics, not directly sourced. Stated as inference so you know to test it yourself.',
  },
};

// Every rating abbreviation the role sheet uses, in plain language.
export const RATING_GLOSSARY = {
  SPD: 'Speed — top-end straight-line velocity.',
  ACC: 'Acceleration — how fast you reach top speed. Usually beats SPD in short spaces.',
  AGI: 'Agility — lateral quickness and body control.',
  COD: 'Change of Direction — sharpness of the plant-and-go cut.',
  STR: 'Strength — raw power in every contact resolution.',
  AWR: 'Awareness — CPU decision quality. Largely inert for a player you control.',
  THP: 'Throw Power — ball velocity, i.e. how fast the window has to close.',
  TAS: 'Throw Accuracy Short — under 20 yards.',
  TAM: 'Throw Accuracy Medium — 20 to 40 yards.',
  TAD: 'Throw Accuracy Deep — 40+ yards.',
  TOR: 'Throw on the Run.',
  PAC: 'Play Action — the most-suspected trap rating in Madden.',
  BSK: 'Break Sack — escaping a collapsing pocket.',
  CTH: 'Catching — in M27 this drives the YELLOW timing window only.',
  CIT: 'Catch in Traffic — protects the GREEN window against the coverage penalty.',
  SPC: 'Spectacular Catch — protects the GREEN window against the catch-difficulty penalty.',
  RLS: 'Release — beating press at the line.',
  SRR: 'Short Route Running — under 10 yards.',
  MRR: 'Medium Route Running — 10 to 20 yards.',
  DRR: 'Deep Route Running — 20+ yards.',
  CAR: 'Carrying — ball security.',
  BTK: 'Break Tackle — powering through contact.',
  BCV: 'Ball Carrier Vision — no source has ever verified this matters for a user.',
  JKM: 'Juke Move.',
  SPM: 'Spin Move.',
  TRK: 'Trucking.',
  RBK: 'Run Block — overall run blocking.',
  RBP: 'Run Block Power — counters the defender at the point of attack.',
  RBF: 'Run Block Finesse — reach and zone blocks.',
  PBK: 'Pass Block — overall.',
  PBP: 'Pass Block Power — counters the defender’s Power Moves.',
  PBF: 'Pass Block Finesse — counters the defender’s Finesse Moves.',
  IBL: 'Impact Blocking — second-level and pull blocks.',
  PMV: 'Power Moves — bull rush, club.',
  FMV: 'Finesse Moves — swim, rip, spin.',
  BSH: 'Block Shedding — getting off a block to make the play.',
  PUR: 'Pursuit — CPU chase angles.',
  PRC: 'Play Recognition — bigger on the D-line than folklore admits.',
  TAK: 'Tackle — whether you connect on the tackle at all.',
  POW: 'Hit Power — fumble and injury chance ONLY. It does not help you connect.',
  MCV: 'Man Coverage.',
  ZCV: 'Zone Coverage.',
  PRS: 'Press — appears in 3 of EA’s 6 defensive-back archetypes.',
  JMP: 'Jumping — an EA key attribute of the Man CB archetype.',
  KPW: 'Kick Power — the only rating that sets field goal range.',
  KAC: 'Kick Accuracy — buys accuracy, never range.',
};

// Madden 27 merged DE and OLB into EDGE. The old LE/RE/LOLB/MLB/ROLB labels
// do not exist in this game and quietly break any depth-chart procedure
// written against them.
export const M27_POSITIONS = [
  'QB', 'HB', 'FB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT',
  'LEDG', 'REDG', 'DT', 'SAM', 'MIKE', 'WILL', 'CB', 'FS', 'SS', 'K', 'P', 'LS',
];

export const POSITION_MIGRATION = [
  { was: 'LE', now: 'LEDG', note: 'Left Edge — defensive end and outside linebacker are one position now, so you no longer swap bodies when you change fronts.' },
  { was: 'RE', now: 'REDG', note: 'Right Edge — same merge. Your 3-4 stand-up rushers are filed here, not at linebacker.' },
  { was: 'LOLB', now: 'SAM', note: 'Strong-side off-ball linebacker. Known M26 quirk that may persist: SAM is only used in 4-3 personnel, because Edge defenders take the outside spots in 3-4 fronts.' },
  { was: 'MLB', now: 'MIKE', note: 'Middle linebacker — the only off-ball spot that is a starter in every personnel grouping you play.' },
  { was: 'ROLB', now: 'WILL', note: 'Weak-side off-ball linebacker. On a nickel-base roster this is a two-down job, not a full-time one.' },
];

// How well you know a role. Same 1–5 spine as the Skills Lab so the two
// labs speak the same language.
export const KNOW_ANCHORS = [
  { value: 1, label: 'No idea what he does' },
  { value: 2, label: 'Know the job, not the ratings' },
  { value: 3, label: 'Know both, can’t apply live' },
  { value: 4, label: 'Apply it under pressure' },
  { value: 5, label: 'Coach it — I adjust this role mid-drive' },
];

export const SIDES = [
  { id: 'offense', label: 'Offense' },
  { id: 'defense', label: 'Defense' },
];
