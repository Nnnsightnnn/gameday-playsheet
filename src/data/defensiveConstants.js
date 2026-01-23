// Defensive Adjustment Constants for Madden 26 Pre-Snap Settings

// Coverage Shading - DB Leverage
export const SHADING_OPTIONS = [
  { id: 'underneath', label: 'Underneath', color: 'bg-yellow-600', description: 'Drags, slants, curls, quick passes' },
  { id: 'overtop', label: 'Over Top', color: 'bg-blue-600', description: 'Streaks, corners, deep posts' },
  { id: 'inside', label: 'Inside', color: 'bg-purple-600', description: 'Slants, posts, in-breaking routes' },
  { id: 'outside', label: 'Outside', color: 'bg-green-600', description: 'Out routes, corners, fades' },
]

// Safety Depth
export const SAFETY_DEPTH_OPTIONS = [
  { id: 'close', label: 'Close', description: 'Run support, underneath help' },
  { id: 'default', label: 'Default', description: 'Balanced coverage' },
  { id: 'deep', label: 'Deep', description: 'Prevent big plays' },
]

// Safety Width
export const SAFETY_WIDTH_OPTIONS = [
  { id: 'pinch', label: 'Pinch', description: 'Inside run support, A/B gaps' },
  { id: 'normal', label: 'Normal', description: 'Balanced alignment' },
  { id: 'wide', label: 'Wide', description: 'Outside coverage help' },
]

// CB Alignment
export const CB_ALIGNMENT_OPTIONS = [
  { id: 'press', label: 'Press', description: 'Tight jam at line, disrupt timing' },
  { id: 'bail', label: 'Bail', description: 'Backpedal off line, soft coverage' },
  { id: 'default', label: 'Default', description: 'Play-called alignment' },
]

// Man Align
export const MAN_ALIGN_OPTIONS = [
  { id: 'default', label: 'Default', description: 'Standard alignment' },
  { id: 'strong', label: 'Strong', description: 'Align to strong side' },
  { id: 'weak', label: 'Weak', description: 'Align to weak side' },
  { id: 'field', label: 'Field', description: 'Align to wide side' },
  { id: 'boundary', label: 'Boundary', description: 'Align to short side' },
]

// Defensive Line Shifts
export const DL_SHIFT_OPTIONS = [
  { id: 'default', label: 'Default', description: 'Base alignment' },
  { id: 'pinch', label: 'Pinch', description: 'Collapse inside gaps' },
  { id: 'spread', label: 'Spread', description: 'Widen for pass rush lanes' },
  { id: 'slantLeft', label: 'Slant Left', description: 'Angle left pre-snap' },
  { id: 'slantRight', label: 'Slant Right', description: 'Angle right pre-snap' },
]

// Linebacker Shifts
export const LB_SHIFT_OPTIONS = [
  { id: 'default', label: 'Default', description: 'Base alignment' },
  { id: 'pinch', label: 'Pinch', description: 'Tighten to inside gaps' },
  { id: 'spread', label: 'Spread', description: 'Widen to outside' },
]

// DL Stunts
export const DL_STUNT_OPTIONS = [
  { id: 'none', label: 'None', description: 'No stunt' },
  { id: 'texas', label: 'Texas', description: 'DE loops inside' },
  { id: 'texasForeman', label: 'Texas Foreman', description: 'DE penetrates middle' },
  { id: 'texas4Man', label: 'Texas 4 Man', description: 'Full line stunt' },
  { id: 'crash', label: 'Crash', description: 'DL crashes inside' },
]

// Zone Drops (depth in yards)
export const ZONE_DROP_OPTIONS = [
  { id: '0', label: '0', description: 'Default depth' },
  { id: '5', label: '5', description: '5 yards' },
  { id: '10', label: '10', description: '10 yards' },
  { id: '15', label: '15', description: '15 yards' },
  { id: '20', label: '20', description: '20 yards' },
  { id: '25', label: '25', description: '25 yards' },
  { id: '30', label: '30', description: '30 yards' },
]

// Option/RPO Defense Keys
export const RPO_KEY_OPTIONS = [
  { id: 'conservative', label: 'Conservative', description: 'Focus on QB, play run first' },
  { id: 'aggressive', label: 'Aggressive', description: 'Jump routes, risk run' },
]

export const OPTION_KEY_OPTIONS = [
  { id: 'qb', label: 'QB', description: 'Contain the quarterback' },
  { id: 'rb', label: 'RB', description: 'Stop the running back' },
  { id: 'pitch', label: 'Pitch', description: 'Take away pitch man' },
]

// Coverage Shells (disguise)
export const COVERAGE_SHELL_OPTIONS = [
  { id: 'none', label: 'None', description: 'Show true coverage' },
  { id: 'cover2', label: 'Show 2', description: 'Disguise as Cover 2' },
  { id: 'cover3', label: 'Show 3', description: 'Disguise as Cover 3' },
  { id: 'cover4', label: 'Show 4', description: 'Disguise as Cover 4' },
]

// Common offensive formations to track what the play is good against
export const COMMON_FORMATIONS = [
  'Gun Bunch',
  'Gun Trips TE',
  'Gun Empty',
  'Trips',
  'Bunch',
  'Spread',
  'I-Form',
  'Singleback',
  'Pistol',
  'Shotgun',
  'Goal Line',
  'Wildcat',
  'Heavy',
  'Doubles',
  'Tight Slots',
]

// Common route concepts to track what the play defends well
export const COMMON_ROUTES = [
  '4 Verts',
  'Mesh',
  'Levels',
  'Crossers',
  'Corner Routes',
  'Out Routes',
  'Slants',
  'Drags',
  'Post Routes',
  'Wheel Routes',
  'Texas Routes',
  'Slot Fade',
  'RPO',
  'Screen',
  'PA Crossers',
  'Curl Flats',
]

// Situational tags for plays (both offense and defense)
export const SITUATION_TAGS = [
  // Universal tags
  { name: 'money', color: 'bg-green-600', description: 'Go-to play that works' },
  { name: 'red zone', color: 'bg-red-600', description: 'Inside the 20' },
  { name: '3rd down', color: 'bg-yellow-600', description: 'Third down conversion/stop' },
  { name: 'goal line', color: 'bg-purple-600', description: 'Inside the 5' },
  { name: '2 min', color: 'bg-blue-600', description: 'Two-minute drill' },
  { name: 'opener', color: 'bg-cyan-600', description: 'Good first play' },
  { name: '3rd & long', color: 'bg-orange-600', description: '3rd and 7+' },
  { name: '3rd & short', color: 'bg-amber-600', description: '3rd and 3 or less' },

  // Offense tags
  { name: 'man beater', color: 'bg-teal-600', description: 'Beats man coverage' },
  { name: 'zone beater', color: 'bg-lime-600', description: 'Beats zone coverage' },
  { name: 'quick pass', color: 'bg-sky-600', description: 'Fast release, beat blitz' },
  { name: 'deep shot', color: 'bg-violet-600', description: 'Take a shot downfield' },

  // Defense - Pressure tags
  { name: 'blitz', color: 'bg-pink-600', description: 'Bring extra pressure' },
  { name: 'heat', color: 'bg-rose-600', description: 'Gets quick pressure' },
  { name: 'nano', color: 'bg-fuchsia-600', description: 'Nano/glitch blitz' },
  { name: 'contain', color: 'bg-orange-700', description: 'QB contain' },
  { name: 'spy', color: 'bg-amber-700', description: 'QB spy assignment' },

  // Defense - Coverage tags
  { name: 'run stop', color: 'bg-stone-600', description: 'Stop the run' },
  { name: 'prevent', color: 'bg-indigo-600', description: 'Prevent big plays' },
  { name: 'user play', color: 'bg-emerald-600', description: 'Good for user lurk' },
  { name: 'lock down', color: 'bg-slate-600', description: 'Shuts down routes' },

  // Defense - vs Formation tags
  { name: 'vs bunch', color: 'bg-red-700', description: 'Good vs bunch formations' },
  { name: 'vs trips', color: 'bg-red-800', description: 'Good vs trips formations' },
  { name: 'vs empty', color: 'bg-rose-800', description: 'Good vs empty sets' },
  { name: 'vs spread', color: 'bg-pink-800', description: 'Good vs spread offense' },
  { name: 'vs motion', color: 'bg-purple-800', description: 'Handles motion well' },
  { name: 'vs RPO', color: 'bg-violet-800', description: 'Good vs RPO plays' },
]

// Default adjustments factory
export function getDefaultAdjustments() {
  return {
    shading: null,
    coaching: {
      safetyDepth: 'default',
      safetyWidth: 'normal',
      cbAlignment: 'default',
      manAlign: 'default',
      dlShift: 'default',
      lbShift: 'default',
      dlStunt: 'none',
      zoneDrop: '0',
      rpoKey: 'conservative',
      optionKey: 'qb',
      coverageShell: 'none',
    },
    goodAgainst: {
      formations: [],
      routes: [],
    },
    quickTip: '',
  }
}
