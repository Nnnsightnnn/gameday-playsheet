// built by nnnsightnnn — signal from noise
// Package Forge — user objectives. A package's user is not a name, it is a
// JOB: one player, one phase of the down, one read, and a price. Each
// objective says what it takes away (beats), what it hands back (exposes),
// and the cue that tells you when to move. Pure data plus checks; no React.
//
// Package shape addition: userObjectives: [{ id, phase, player, note }].
// The legacy free-text `user` string stays as the package's user notes.

import { CONFIDENCE } from '../../data/personnel.js'

export const PHASES = [
  { id: 'pre', label: 'Pre-snap' },
  { id: 'snap', label: 'At the snap' },
  { id: 'post', label: 'After the throw / break' },
]
const PHASE_IDS = new Set(PHASES.map((p) => p.id))
export const phaseLabel = (id) => PHASES.find((p) => p.id === id)?.label ?? id

// Where the job mostly lives, used as the default phase for a new row.
const GROUP_PHASE = {
  Deep: 'snap',
  Underneath: 'post',
  Pressure: 'snap',
  QB: 'post',
  'Run fit': 'snap',
  Receiver: 'post',
  Blocker: 'snap',
}

export const USER_OBJECTIVES = [
  {
    id: "mof-deep-user",
    side: "defense",
    group: "Deep",
    label: "MOF user (deep middle)",
    positions: ["FS", "SS"],
    job: "Align as the single-high safety, hold depth pre-snap, and at the snap stay over the top of the deepest inside route, driving on posts and seams only once they declare.",
    beats: ["Post / seam shots", "Dig-over-the-top (Mills)", "Middle-of-field benders"],
    exposes: ["Flat and underneath crossers (you cannot trigger down)", "Deep sideline if you cheat inside", "Run support is one step late"],
    cue: "Inside release of the #2/#3 receivers and the QB's shoulders at the top of the drop",
    conf: "read",
    source: "Coaching read built on user-safety-in-middle advice: Civil.GG, CFB 26 User Control Defense Guide https://www.civil.gg/tips/cfb-26-user-control-defense-guide",
  },
  {
    id: "bail-safety",
    side: "defense",
    group: "Deep",
    label: "Bail safety (show low, rotate deep)",
    positions: ["FS", "SS"],
    job: "Walk down pre-snap to show a robber or pressure look, then at the snap turn and bail to the deep middle so the post-snap shell differs from the pre-snap picture.",
    beats: ["Pre-snap reads of one-high vs two-high", "Hot throws the QB audibles into against a mug look", "Post / seam vs a false-pressure look"],
    exposes: ["You arrive late on true vertical shots if you walked down too far", "Flat/underneath if your drop is the one the offense attacks early"],
    cue: "Whether the QB checks or motions after your walk-down; bail on the snap regardless of his check",
    conf: "read",
    source: "Coaching read; pairs with M27 Custom Adjustments (safety depth/width/midpoint) Sports Gamers Online, M27 gameplay (custom adjustments, Smart Zones, timing catch) https://www.sportsgamersonline.com/news/madden-nfl-27-gameplay-brings-custom-adjustments-coach-mode-and-more/",
  },
  {
    id: "hook-curl-user",
    side: "defense",
    group: "Underneath",
    label: "User the yellow (hook/curl) zone",
    positions: ["MIKE", "WILL", "SAM"],
    job: "User a hook-curl, vert-hook or mid-read defender; strafe (hold LT/L2) to protect your zone first, then bait and jump whatever breaks into it.",
    beats: ["Crossers and digs", "TE / slot seams through the hook", "Quick in-breakers behind the line"],
    exposes: ["Deep over the top if you jump too early", "Whatever zone you vacate (the offense throws where you left)"],
    cue: "The #2/#3 receiver's first break and the QB's eyes; zone first, bonus second",
    conf: "m27",
    source: "MaddenGuides, Complete Guide to Defense M27 https://maddenguides.com/the-complete-guide-to-defense-madden-nfl-27/ ; Civil.GG, Madden 27 Defense Guide https://www.civil.gg/tips/madden-27-complete-defense-guide",
  },
  {
    id: "robber-lurk",
    side: "defense",
    group: "Underneath",
    label: "Robber / lurk (sit on the dig)",
    positions: ["FS", "SS", "MIKE"],
    job: "From a two-high or single-high look, drop to 10 to 15 yards in the middle hole and sit on the throwing lane of in-breaking routes, jumping the dig or crosser.",
    beats: ["Dig / Mills / Levels", "Deep crossers", "Drive and Shallow-cross mesh throws"],
    exposes: ["Post / seam over your head", "Outside-breaking routes (outs, corners) away from you", "Your vacated deep half if you started high"],
    cue: "QB's eyes and the depth of the in-breaking route; attack the throwing window, not the man",
    conf: "read",
    source: "Coaching read (man-free lurk / hole player concept): https://coachkoufootball.substack.com/p/man-free-variations-playing-man-free",
  },
  {
    id: "man-the-halfback",
    side: "defense",
    group: "Underneath",
    label: "User the back (man on HB)",
    positions: ["MIKE", "WILL", "SAM"],
    job: "In man coverage, user the linebacker assigned to the halfback and carry any release (angle, wheel, Texas) instead of leaving it to the CPU.",
    beats: ["HB angle / Texas routes", "RB wheels vs man", "Checkdowns that move the chains"],
    exposes: ["If the back stays in to block you are a spare with no job unless you add a rush or hook", "Crossers the CPU man defenders trail"],
    cue: "HB release direction at the snap (stay-in vs route)",
    conf: "m27",
    source: "MaddenGuides, Complete Guide to Defense M27 https://maddenguides.com/the-complete-guide-to-defense-madden-nfl-27/ ; Civil.GG, Madden 27 Defense Guide https://www.civil.gg/tips/madden-27-complete-defense-guide",
  },
  {
    id: "flat-squat",
    side: "defense",
    group: "Underneath",
    label: "Flat squat",
    positions: ["CB1", "CB2", "SLOT", "SS"],
    job: "Align in the flat/cloud zone, hold outside leverage, and at the snap sit at 5 to 7 yards reading the first flat threat, driving on the throw.",
    beats: ["Quick outs and bubbles", "RB swing / flat", "Stick-flat and snag-flat"],
    exposes: ["Corner / wheel behind you", "Outside vertical if the deep third is not over you"],
    cue: "#2 receiver: out-breaking stem or vertical release",
    conf: "read",
    source: "Coaching read; M27 Custom Hot Routes let you set drop depth (e.g. 10 vs 20 yds): EZG, M27 Gameplay Changes (pass rush, custom hot routes, green catching) https://www.ezg.com/blog/madden-nfl-27-gameplay-changes-pass-rush-custom-hot-routes-green-catching-meta",
  },
  {
    id: "cloud-corner",
    side: "defense",
    group: "Underneath",
    label: "Cloud corner (squat corner)",
    positions: ["CB1", "CB2"],
    job: "User the cloud (Cover 2 flat) corner: jam or reroute #1 at the line, then sink under the corner and squat the flat once #1 releases vertically.",
    beats: ["Hitch and quick outs", "Flat routes and swings", "Outside release vs a vertical stem"],
    exposes: ["Hole shot between you and the half safety (smash corner)", "Fade if the half safety is slow"],
    cue: "#1's release and #2's route; carry #1 only until #2 threatens the flat",
    conf: "read",
    source: "Coaching read; M27 TU 9/16 tuned user press and jam at the line: EA, M27 Title Update Sept 16 2026 https://www.ea.com/games/madden-nfl/madden-nfl-27/news/madden-nfl-27-title-update-september-16",
  },
  {
    id: "mirror-crosser",
    side: "defense",
    group: "Underneath",
    label: "Man up the crosser (user match)",
    positions: ["MIKE", "WILL", "SLOT", "SS"],
    job: "Pre-snap, tap the user's assignment button and man him up on a specific receiver (usually the crossing or bubble threat) inside a zone call, then trail it underneath.",
    beats: ["Mesh / shallow cross", "Bubbles", "The offense's go-to money route"],
    exposes: ["The zone you were supposed to fill", "Rub routes that pick you"],
    cue: "Target receiver's alignment; his first step tells you the rub side",
    conf: "m27",
    source: "Civil.GG, CFB 27 Defense Guide https://www.civil.gg/tips/cfb-27-complete-defense-guide ; Civil.GG, Madden 27 Defense Guide https://www.civil.gg/tips/madden-27-complete-defense-guide",
  },
  {
    id: "a-gap-hover",
    side: "defense",
    group: "Pressure",
    label: "A-gap hover (mug)",
    positions: ["MIKE", "WILL", "SS", "FS"],
    job: "Bring the user down into an interior gap pre-snap and hold/shuffle (LT) there so protection must account for him; at the snap either come or drop, protection having already slid to you.",
    beats: ["Slide protection (frees an edge or looper)", "Hot-read audibles", "QB comfort in the pocket"],
    exposes: ["Middle of the field if you rush and are the hole player", "Untarget tool / slide away from you nullifies the threat", "Quick slants behind you"],
    cue: "Center's point and the HB's alignment (which side protection is sliding)",
    conf: "m27",
    source: "MaddenGuides, Complete Guide to Defense M27 https://maddenguides.com/the-complete-guide-to-defense-madden-nfl-27/ ; Civil.GG, Madden 27 Defense Guide https://www.civil.gg/tips/madden-27-complete-defense-guide ; Civil.GG, Pass Protection Basics M27 https://www.civil.gg/tips/madden-27-pass-protection-basics",
  },
  {
    id: "mug-blitz-or-drop",
    side: "defense",
    group: "Pressure",
    label: "Mug and read the back (come or drop)",
    positions: ["SS", "FS", "MIKE"],
    job: "User the defender responsible for the HB, mug the gap on the back's side; if the HB releases carry him, if he blocks either blitz for the +1 or drop to the middle hole.",
    beats: ["Mid Blitz protections", "RB checkdowns vs Cover 0", "Slow-developing play action"],
    exposes: ["No help in the middle in Cover 0", "If the offense untargets you the blitz loses its +1"],
    cue: "HB at the snap: release (follow him) vs block (come or bail)",
    conf: "m26",
    source: "MUT.GG Ask Huddle #33, Mid Blitz https://www.mut.gg/news/ask-huddle-33-the-best-way-to-run-mid-blitz/ ; MUT.GG Ask Huddle #21 https://www.mut.gg/news/ask-huddle-21-how-to-improve-in-madden-26/",
  },
  {
    id: "user-looper",
    side: "defense",
    group: "Pressure",
    label: "User the looper (stunt)",
    positions: ["LEDG", "REDG", "DT"],
    job: "Call a DL stunt/twist and user the looping rusher, timing the loop behind the penetrator into the gap the guard vacates.",
    beats: ["Slide protection that passes off late", "Interior pocket climb", "Screens built on a clean A-gap"],
    exposes: ["Contain, since your loop leaves the edge", "Run up the gap you looped from", "Quick game (the stunt takes time)"],
    cue: "Guard's set: if he chases the penetrator, the loop gap is open",
    conf: "read",
    source: "Coaching read; M27 stunts and line shifts via DL adjustments: Civil.GG, CFB 27 Defense Guide https://www.civil.gg/tips/cfb-27-complete-defense-guide",
  },
  {
    id: "user-edge-rush",
    side: "defense",
    group: "Pressure",
    label: "User the rush end (win a move)",
    positions: ["LEDG", "REDG"],
    job: "User the edge rusher and win with right-stick rush moves (swim, spin, rip, bull, club), choosing inside vs outside move to the tackle's set.",
    beats: ["Long-developing shot plays", "Max-protect held by a slow tackle", "Mid-pocket QBs"],
    exposes: ["Middle of the field has no human in it", "Contain if you take the inside move", "Screens behind you"],
    cue: "Tackle's set: oversets outside then go inside; short set then go speed",
    conf: "m27",
    source: "EZG, M27 Gameplay Changes (pass rush, custom hot routes, green catching) https://www.ezg.com/blog/madden-nfl-27-gameplay-changes-pass-rush-custom-hot-routes-green-catching-meta ; RealSport101, M27 Controls Guide https://realsport101.com/article/madden-27-controls-guide-how-to-master-offense-and-defense",
  },
  {
    id: "dt-interior-rush",
    side: "defense",
    group: "Pressure",
    label: "User the 3-tech (interior push)",
    positions: ["DT"],
    job: "User the interior tackle, align in a gap shade, and win with power/swim inside to collapse the pocket from the middle.",
    beats: ["Step-up scrambles", "Inside zone cutbacks", "Quick A-gap draws"],
    exposes: ["Coverage gets no human help", "Screens and outside runs"],
    cue: "Guard's hands and weight; double team = anchor and hold the gap",
    conf: "read",
    source: "Coaching read; M27 rush moves are attribute-driven (Power/Finesse moves, Block Shedding): EZG, M27 Gameplay Changes (pass rush, custom hot routes, green catching) https://www.ezg.com/blog/madden-nfl-27-gameplay-changes-pass-rush-custom-hot-routes-green-catching-meta",
  },
  {
    id: "qb-spy-mirror",
    side: "defense",
    group: "QB",
    label: "QB spy / mirror",
    positions: ["MIKE", "WILL", "SS"],
    job: "Sit at linebacker depth over the QB and mirror his lateral movement; when he crosses the line or tucks, trigger and tackle.",
    beats: ["Designed QB runs", "Interior scramble lanes", "Scramble-drill conversions on 3rd down"],
    exposes: ["One fewer coverage/rush player (a spare vs pocket passers)", "Crossers behind you if you trigger early"],
    cue: "QB's eyes and hips: shoulders squared downfield = hold, tuck = go",
    conf: "m27",
    source: "Civil.GG, CFB 27 Defense Guide https://www.civil.gg/tips/cfb-27-complete-defense-guide ; Civil.GG, CFB 26 User Control Defense Guide https://www.civil.gg/tips/cfb-26-user-control-defense-guide",
  },
  {
    id: "edge-contain",
    side: "defense",
    group: "QB",
    label: "Edge contain (keep him in the pocket)",
    positions: ["LEDG", "REDG", "SAM"],
    job: "Set QB Contain (RB then LB / R1 then L1), user the contain player and set the edge wide, never getting inside the QB.",
    beats: ["Rollouts and bootlegs", "Outside scrambles", "Speed option keeps"],
    exposes: ["Interior pressure (contain rushers do not collapse)", "Inside scramble lanes unless a spy fills them"],
    cue: "QB's launch point and the tackle's set; stay outside his shoulder",
    conf: "m27",
    source: "Civil.GG, Containing QB Rollouts M27 https://www.civil.gg/tips/madden-27-containing-qb-rollouts ; Civil.GG, Madden 27 Defense Guide https://www.civil.gg/tips/madden-27-complete-defense-guide",
  },
  {
    id: "option-qb-key",
    side: "defense",
    group: "QB",
    label: "Take the QB on the option",
    positions: ["MIKE", "SS", "WILL"],
    job: "Vs read option/RPO, user a linebacker or safety (not the read end) and key the quarterback through the mesh, making him give or scrape to the keep.",
    beats: ["QB keeps on zone read", "RPO give/keep confusion", "Speed option QB turn-up"],
    exposes: ["The pitch or give if the CPU force player loses", "Play action over the top when you step up"],
    cue: "Mesh point: QB's hands on the ball and his eyes on the read defender",
    conf: "read",
    source: "Civil.GG advises not usering the edge on option and keying the QB; job wording is a read: Civil.GG, CFB 26 Read Option Defense Settings https://www.civil.gg/tips/cfb-26-read-option-defense-settings",
  },
  {
    id: "run-fit-flow",
    side: "defense",
    group: "Run fit",
    label: "Flow run fit (slow play)",
    positions: ["MIKE", "WILL", "SS", "FS"],
    job: "Start with depth off the line, stay free of blockers, and flow downhill over the ball without crashing so you can take cutback or bounce.",
    beats: ["Zone runs and cutbacks", "Chunk runs (8 yds into 3)", "Outside zone bounce"],
    exposes: ["Play action to your flow side", "Late gaps if you over-pursue"],
    cue: "Ball carrier's aiming point and the guard's pull",
    conf: "m27",
    source: "Civil.GG, Madden 27 Defense Guide https://www.civil.gg/tips/madden-27-complete-defense-guide ; MaddenGuides, Complete Guide to Defense M27 https://maddenguides.com/the-complete-guide-to-defense-madden-nfl-27/ ; Civil.GG, CFB 27 Defense Guide https://www.civil.gg/tips/cfb-27-complete-defense-guide",
  },
  {
    id: "spill-box",
    side: "defense",
    group: "Run fit",
    label: "Spill / box the edge",
    positions: ["SS", "SAM", "CB1", "CB2"],
    job: "Act as the force player: either spill (wrong-arm a kick-out and push the run inside to pursuit) or box (keep outside leverage and turn it back in).",
    beats: ["Toss / stretch", "Counter and power kick-outs", "Jet sweeps"],
    exposes: ["Cutback lane if pursuit is slow", "Pass behind you if you trigger on play action"],
    cue: "Pulling guard or kick-out block path; outside-in leverage on the ball",
    conf: "read",
    source: "Coaching read; CFB 27 safety run-fit shift (RT + X/B) sets which side you fit: Civil.GG, CFB 27 Defense Guide https://www.civil.gg/tips/cfb-27-complete-defense-guide",
  },
  {
    id: "goal-line-user",
    side: "defense",
    group: "Run fit",
    label: "Goal-line gap plug",
    positions: ["MIKE", "SS", "DT"],
    job: "Inside the 5, align tight in the gap the offense likes, stay square, and fill downhill at the snap to meet sneaks and dives at the line.",
    beats: ["QB sneak (M27 sneak meter)", "Dive / iso", "HB push plays"],
    exposes: ["Play action to the flat", "Fade / corner if you are the hole player"],
    cue: "Line splits and backfield alignment (FB = iso)",
    conf: "read",
    source: "Coaching read; M27 QB sneak meter compares line strength: Sports Gamers Online, M27 gameplay (custom adjustments, Smart Zones, timing catch) https://www.sportsgamersonline.com/news/madden-nfl-27-gameplay-brings-custom-adjustments-coach-mode-and-more/",
  },
  {
    id: "qb-scramble-user",
    side: "offense",
    group: "QB",
    label: "Scramble and slide (QB user)",
    positions: ["QB"],
    job: "When the pocket breaks, keep the QB, scramble to the open lane, and slide (not dive) before contact near the sticks.",
    beats: ["Man coverage (backs turned)", "Blitz with no spy", "Contain-less rush"],
    exposes: ["Sacks and fumbles on hold-too-long", "Late throws across the body"],
    cue: "Spy/contain presence and whose back is turned to the QB",
    conf: "m27",
    source: "EA, M27 Title Update Sept 16 2026 https://www.ea.com/games/madden-nfl/madden-nfl-27/news/madden-nfl-27-title-update-september-16 (slide now honored near the first down marker; speed-burst exploit removed: EZG, M27 Gameplay Changes (pass rush, custom hot routes, green catching) https://www.ezg.com/blog/madden-nfl-27-gameplay-changes-pass-rush-custom-hot-routes-green-catching-meta)",
  },
  {
    id: "read-option-user",
    side: "offense",
    group: "QB",
    label: "User the read (give/keep)",
    positions: ["QB", "HB"],
    job: "On read option, stay on the QB through the mesh, read the unblocked end, and keep or give, then user whichever carrier gets the ball.",
    beats: ["Crashing ends", "User linebackers who key the HB", "Aggressive option defense settings"],
    exposes: ["The QB takes hits on keeps", "Conservative option-D settings that key the QB"],
    cue: "Unblocked read defender: crash = keep, sit/contain = give",
    conf: "read",
    source: "Coaching read; opposing defensive settings (Read Options to QB) from Civil.GG, CFB 26 Read Option Defense Settings https://www.civil.gg/tips/cfb-26-read-option-defense-settings",
  },
  {
    id: "user-catch-timed",
    side: "offense",
    group: "Receiver",
    label: "User catch (timed meter)",
    positions: ["WR1", "WR2", "WR3", "TE"],
    job: "Switch to the target while the ball is in the air, hold the chosen catch button and release in the green zone of the timing meter (or tap for a standard catch).",
    beats: ["Contested catches in tight windows", "Swats and ball-hawk defenders", "Late user defenders"],
    exposes: ["Drops if you release late (hold too long)", "Short throws under the timing threshold behave like standard catches"],
    cue: "Ball's arrival and the meter's green window",
    conf: "m27",
    source: "Operation Sports, M27 Timing-Based Catching https://www.operationsports.com/madden-27-timing-based-catching-guide/ ; Athlon, M27 Best Settings https://athlonsports.com/sports-video-games/madden-27-best-settings",
  },
  {
    id: "user-aggressive-catch",
    side: "offense",
    group: "Receiver",
    label: "Aggressive catch (high point)",
    positions: ["WR1", "WR2", "TE"],
    job: "On a contested throw, user the receiver and use aggressive catch (Y/Triangle) to high-point the ball over the defender.",
    beats: ["Fades and back-shoulder throws", "Jump balls in the red zone", "Size mismatches"],
    exposes: ["Big-hit fumbles and incompletions if the defender arrives", "Yards after catch"],
    cue: "Defender's position: in phase and trailing = go up",
    conf: "m27",
    source: "RealSport101, M27 Controls Guide https://realsport101.com/article/madden-27-controls-guide-how-to-master-offense-and-defense ; Operation Sports, M27 Timing-Based Catching https://www.operationsports.com/madden-27-timing-based-catching-guide/",
  },
  {
    id: "user-rac-catch",
    side: "offense",
    group: "Receiver",
    label: "RAC catch (catch in stride)",
    positions: ["WR1", "WR2", "WR3", "HB"],
    job: "On an open underneath route, user the receiver and use RAC catch (X/Square) to secure in stride and turn upfield.",
    beats: ["Soft zone drops", "Crossers vs man trailers", "Screens and flats"],
    exposes: ["More drops in traffic", "Punishing hits if a defender is closing"],
    cue: "Space: no defender within a step = RAC",
    conf: "m27",
    source: "RealSport101, M27 Controls Guide https://realsport101.com/article/madden-27-controls-guide-how-to-master-offense-and-defense ; Operation Sports, M27 Timing-Based Catching https://www.operationsports.com/madden-27-timing-based-catching-guide/",
  },
  {
    id: "user-possession-catch",
    side: "offense",
    group: "Receiver",
    label: "Possession catch (secure the sticks)",
    positions: ["WR1", "WR2", "WR3", "TE"],
    job: "Near the sideline or in traffic, user the receiver and use possession catch (A/X) to secure the ball and get feet down.",
    beats: ["Sideline toe-taps", "Third-down chain movers", "Crossers through a hitting zone"],
    exposes: ["No yards after catch"],
    cue: "Sideline or boundary proximity and incoming hit",
    conf: "m27",
    source: "RealSport101, M27 Controls Guide https://realsport101.com/article/madden-27-controls-guide-how-to-master-offense-and-defense ; Operation Sports, M27 Timing-Based Catching https://www.operationsports.com/madden-27-timing-based-catching-guide/",
  },
  {
    id: "user-route-stem",
    side: "offense",
    group: "Receiver",
    label: "User the route (hot / stem)",
    positions: ["WR1", "WR2", "WR3", "TE", "HB"],
    job: "Pre-snap, hot route or custom-stem the receiver you plan to user (depth, stem), then at the snap control him to widen or settle into the hole.",
    beats: ["User defenders who pattern-read your stock routes", "Zone holes (settle)", "Match rules"],
    exposes: ["Timing with the throw (you cannot pass and route at once)", "Hot-route tells to an observant user"],
    cue: "Where the defense's user is aligned; stem away from him",
    conf: "m27",
    source: "Custom stem Madden School, Everything to know going into M25 https://www.madden-school.com/everything-you-need-to-know-going-into-madden-25/ ; M27 custom hot routes EZG, M27 Gameplay Changes (pass rush, custom hot routes, green catching) https://www.ezg.com/blog/madden-nfl-27-gameplay-changes-pass-rush-custom-hot-routes-green-catching-meta",
  },
  {
    id: "pass-pro-pickup",
    side: "offense",
    group: "Blocker",
    label: "HB pickup (find the mug)",
    positions: ["HB", "TE"],
    job: "Pre-snap, slide protection away from the back or target the mugged user so your HB picks up the free rusher at the snap.",
    beats: ["Mid Blitz / A-gap mugs", "User hover pressure", "Zero pressure"],
    exposes: ["One fewer receiver in the pattern", "Checkdown timing"],
    cue: "The defense's user (hovering/ low) and which side protection slides",
    conf: "m27",
    source: "Civil.GG, Pass Protection Basics M27 https://www.civil.gg/tips/madden-27-pass-protection-basics ; MUT.GG Ask Huddle #21 https://www.mut.gg/news/ask-huddle-21-how-to-improve-in-madden-26/",
  },
  {
    id: "user-lead-block",
    side: "offense",
    group: "Blocker",
    label: "User the lead block",
    positions: ["HB", "TE"],
    job: "On toss or iso, snap and switch to the lead FB/TE, find the force or scrape defender and block him before handing the play back to the ball carrier.",
    beats: ["Unblocked scrape linebacker", "User linebackers who shoot the gap", "Force defender on toss"],
    exposes: ["Losing control of the ball carrier's cut", "A missed block on the wrong man"],
    cue: "The unblocked second-level defender (often the opposing user)",
    conf: "read",
    source: "Coaching read (switching to a blocker is not a documented M27 mechanic; verify in Practice)",
  },
]

const BY_ID = new Map(USER_OBJECTIVES.map((o) => [o.id, o]))
export const objectiveById = (id) => BY_ID.get(id)
export const objectivesForSide = (side) => USER_OBJECTIVES.filter((o) => o.side === side)
export const defaultPhase = (id) => GROUP_PHASE[objectiveById(id)?.group] || 'snap'

// Objectives for one side, grouped in first-seen order for an <optgroup> menu.
export function objectiveGroups(side) {
  const groups = new Map()
  for (const o of objectivesForSide(side)) {
    if (!groups.has(o.group)) groups.set(o.group, [])
    groups.get(o.group).push(o)
  }
  return [...groups].map(([group, items]) => ({ group, items }))
}

// A fresh row for the editor: first objective on the side, its default phase,
// its first listed position.
export function blankObjective(side) {
  const o = objectivesForSide(side)[0]
  return { id: o?.id || '', phase: defaultPhase(o?.id), player: o?.positions[0] || '', note: '' }
}

export const isKnownConf = (conf) => Object.hasOwn(CONFIDENCE, conf)

export function checkUserObjectives(pkg) {
  const out = []
  const push = (level, code, msg) => out.push({ level, code, msg })
  const rows = Array.isArray(pkg.userObjectives) ? pkg.userObjectives : []
  const hasText = !!(pkg.user && String(pkg.user).trim())

  if (!rows.length && !hasText) {
    if (pkg.side === 'defense')
      push('warn', 'no-user', 'No user assignment. Decide who you are before the snap, not after.')
    else
      push('info', 'no-user', 'No user objective. Name the player you take and his job, or the AI plays every snap for you.')
  }

  const seen = new Map() // phase -> Map(player -> label)
  for (const row of rows) {
    const o = objectiveById(row.id)
    if (!o) {
      push('error', 'unknown-objective', `Unknown user objective "${row.id || '(blank)'}".`)
      continue
    }
    if (o.side !== pkg.side) {
      push('error', 'objective-side', `${o.label} is a ${o.side} objective on a ${pkg.side} package.`)
      continue
    }
    if (row.player && !o.positions.includes(row.player))
      push('warn', 'objective-position', `${o.label} from ${row.player}: the job is built for ${o.positions.join(' / ')}. Expect to be late.`)
    if (row.player && PHASE_IDS.has(row.phase)) {
      if (!seen.has(row.phase)) seen.set(row.phase, new Map())
      const byPlayer = seen.get(row.phase)
      const prior = byPlayer.get(row.player)
      if (prior)
        push('warn', 'one-man-two-jobs', `${row.player} has two jobs ${phaseLabel(row.phase).toLowerCase()}: ${prior} and ${o.label}. One stick, one job per phase.`)
      else byPlayer.set(row.player, o.label)
    }
    push('info', 'objective-price', `${o.label} gives up: ${o.exposes.join('; ')}.`)
  }
  return out
}
