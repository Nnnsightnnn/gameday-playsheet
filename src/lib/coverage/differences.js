// built by nnnsightnnn — signal from noise
// Coverage Lab — head-to-head writeups.
// Keyed "a|b"; lookup is order-insensitive.

const DIFFS = {
  'c4|palms':
    'Same shell, opposite reaction to the same stimulus. In QUARTERS the corner\'s man is always #1 — only the safety\'s technique flips on #2. In PALMS, #2 breaking out flips BOTH: the corner comes off #1 to trap #2 and the safety rotates over the top to cap #1. Run Curl–Flat to see it; run 4 Verticals and they are identical.',
  'c6|c9':
    'Which side gets the two-high half. COVER 6 = quarters to the passing strength, Cover 2 to the single side. COVER 9 = the mirror, Cover 2 clouded to the strength and quarters weak. In-game your tell is offset safeties.',
  'c3sky|c3buzz':
    'One landmark. SKY\'s rotated safety goes to the FLAT and is the force player. BUZZ\'s rotated safety drops INSIDE to the hook/curl and robs in-breakers, handing the flat to someone else. Buzz buys you the dig and mesh window and costs you the perimeter run fit.',
  'c3sky|c3cloud':
    'Who rolls down. SKY rolls the SAFETY to the flat. CLOUD rolls the CORNER to the flat and replaces him deep with a safety. Cloud is stronger against the quick perimeter and weaker against the corner route behind it.',
  'c3sky|c3match':
    'Spot-drop versus pattern-match. SKY defenders drop to a fixed landmark regardless of routes. MATCH defenders decide man-or-zone off the receiver\'s stem: vertical = man (MOD/MEG), everything else = zone. Match exists because Sky cannot solve four verticals.',
  'c3cloud|c3buzz':
    'Both take the flat away from the free safety, but from opposite directions. CLOUD sends the corner down and lifts a safety into his third. BUZZ keeps the corner deep and sinks the safety inside to the hook, giving the flat to the overhang.',
  'c2|tampa2':
    'The Mike\'s drop depth. COVER 2\'s Mike sits at 8-10 in a shallow hook. TAMPA 2\'s Mike sprints to 18-25 and becomes a third deep defender. Everything else is identical.',
  'c2|c2man':
    'Identical two-deep shell, opposite underneath. COVER 2 is five zone droppers reading the QB. COVER 2 MAN is five man defenders trailing with help over the top.',
  'c1|c0':
    'The rat and the free safety. COVER 1 keeps a deep-middle FS plus a robber in the hole. COVER 0 sends both. That is the entire difference.',
  'c1|c3match':
    'Cover 1 is man on everybody regardless of route. Cover 3 Match only converts to man when the route declares vertical — zone against quick game, man against verticals.',
  'c4|solo':
    'Solo is Quarters with a decision attached to the backside safety. In base Quarters he plays his own side. In SOLO he keys #3: vertical means poach the middle, anything else means rotate and help the isolated corner. You gain four-over-three to trips and gamble on the backside.',
  'c2|c2invert':
    'The corner and the safety trade jobs. Base Cover 2: CB is flat/force, S is deep half. Invert: S is flat/force, CB is deep half. Built to bait an RPO read of your force player.',
  'c4|c6':
    'Cover 6 is Quarters on one half only. The other half converts to Cover 2 — the corner squats as force and a lone safety takes the whole deep half.',
  'palms|c6':
    'Palms is a full-field 2-read. Cover 6 hard-splits the field: match rules one side, pure cloud and half the other. You give up the match answer on the two-deep side in exchange for a true double on the isolated receiver.',
  'c4|c9':
    'Cover 9 keeps quarters, but points it at the SINGLE receiver instead of the passing strength, and clouds the strength with Cover 2. Against trips that means your extra run hat now lives in the boundary.',
  'c1|c2man':
    'How much help the man defenders get. COVER 1 gives one deep-middle safety plus a robber in the hole. COVER 2 MAN gives two deep halves and no robber. Cover 1 is better against crossers, Cover 2 Man is better against verticals.',
  'c0|c2man':
    'Both are man. COVER 0 sends everybody and gives the corners nothing. COVER 2 MAN keeps two safeties over the top so your corners can play aggressively at the line.',
  'c3match|c4':
    'One-high match versus two-high match. Cover 3 Match gets you an extra run defender and a true deep middle player; Quarters gets you two run defenders and no middle-of-field player. The offense reads MOFC versus MOFO pre-snap and calls accordingly.',
  'tampa2|c3sky':
    'Both end up three-deep. Tampa gets there with a linebacker sprinting to the middle and keeps two corners squatting in the flat. Sky gets there with corners bailing to thirds and a safety rolling to the flat. Tampa is better underneath outside; Sky is better against the perimeter run.',
};

export function differenceFor(a, b) {
  return DIFFS[`${a}|${b}`] || DIFFS[`${b}|${a}`] || null;
}
