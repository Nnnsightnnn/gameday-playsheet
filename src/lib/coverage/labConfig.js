// built by nnnsightnnn — signal from noise
// Coverage Lab — shared constants (kept out of component files so React Fast
// Refresh keeps working).

// Responsibility color per assignment type. Values are CSS custom properties
// declared in index.css so the lab honours the app's theme.
export const TYPE_COLOR = {
  deep: 'var(--cv-deep)',
  under: 'var(--cv-under)',
  man: 'var(--cv-man)',
  match: 'var(--cv-match)',
  rob: 'var(--cv-rob)',
  rush: 'var(--token-def)',
};

export const LEGEND = [
  ['deep', 'Deep zone'],
  ['under', 'Underneath zone'],
  ['man', 'Man / MEG'],
  ['match', 'Match (converts)'],
  ['rob', 'Robber / hole'],
];

// Persisted in sheetSettings.coverageLab.
export const DEFAULT_LAB = {
  coverage: 'c4',
  compareWith: 'palms',
  formation: 'doubles',
  concept: 'curlflat',
  mode: 'study',
  learnView: 'study',
  ruleset: 'ncaa',
  ballSpot: 'left',
  flip: false,
};

export const SNAP_MS = 2900;
