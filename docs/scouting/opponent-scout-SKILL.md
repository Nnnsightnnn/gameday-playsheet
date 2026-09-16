---
name: opponent-scout
description: Scout a Madden 27 NFL opponent for Kenny's Falcons and write a validated scouting report JSON (attack plan + defense plan) into the gameday-playsheet app.
---

# Opponent Scout (Madden 27, Falcons vs the league)

Kenny plays Madden 27 online head-to-head as the Atlanta Falcons and has been
winging it against the other 31 teams. This skill is his advance scout: for
one opponent it produces a forked report, **attack** (Falcons offense vs their
defense) and **defend** (Falcons defense vs their offense), written into
`public/data/scouting/<ABBR>.json` in the gameday-playsheet repo, where the
Scouting view renders it with visuals.

It is built to run one team per agent, so `/parallel-blitz` can fan out all 31
in a single batch. One team = one file = no shared writes.

## What a good report is (and why it is shaped this way)

An NFL advance report has a personnel section (strengths and weaknesses of
every starter), a tendency breakout (personnel, formation, down/distance,
field zone), red zone and special teams, matchup notes, and a "keys to
winning" page for the head coach. The twist in Madden H2H: **tendencies
belong to the human holding the sticks, not the team.** So the report splits
into what is knowable before kickoff (ratings, speed, X-Factors, weak links,
the playbook, collisions with the Falcons roster) and what can only be
learned live (tells to chart on the first two drives). Every section below
maps to one of those.

## Division of labor: numbers are computed, judgment is written

The `facts` block in each file is produced by a script from the current
roster iteration (madden.tools Week N + EA ability labels). **Never edit
`facts` and never invent a rating.** Every number you cite must come from
`facts` (starters, units, ranks, threats, weakLinks, speedMap, qbProfile,
matchups). Your job is the `report` block: what those numbers mean and what
Kenny should call.

## Paths and shells

Repo on Kenny's Mac: `/Users/kenny/gameday-playsheet` (in `device_bash` it is
`$HOME/mnt/gameday-playsheet`). Use `device_bash` for reading, writing and the
two node scripts below (stdlib only, they run in the VM). `npm test`,
`npm run lint`, `npm run build` need the Mac's own node_modules, so run those
through Desktop Commander `start_process` on the Mac.

## Step 0 (orchestrator only, once per blitz): refresh facts

Skip inside a per-team agent. Before fanning out:

1. Check the roster iteration: `python3 tools/scraper/scrape_rosters.py` pulls
   all 32 teams (~1,900 player pages). In the Mac VM it gets throttled past
   ~3 minutes, so run it in the cloud container and copy
   `tools/scraper/output/rosters-m27.json` back (gzip it first; the raw 2MB
   file times out the commit bridge), or run it in chunks with `--teams`.
2. Update `src/data/scoutingAvailability.js` for IR/suspensions that matter
   (Falcons first).
3. `node scripts/scouting/build.mjs facts` then `node scripts/scouting/build.mjs index`.
   A report built on an older iteration gets `stale: true`; refresh those.

## Step 1: load the brief

```bash
cd $HOME/mnt/gameday-playsheet
node scripts/scouting/build.mjs brief <ABBR> > /tmp/brief-<ABBR>.json
```

The brief has `facts` for the opponent and `falconsBooks` (every formation
and play name in `falcons-off` and `falcons-def`). Also read, for the Falcons'
current identity and the plays Kenny already has reps on:
`src/data/gameplans-falcons.js` (header + play list) and the `doctrine` block
of `src/data/personnel-falcons.js`. Prefer calls already on his sheet; a new
call has to earn its place.

## Step 2: research (3 to 6 searches, sources required)

Current-year only; today's date decides "current". Look for:

- The opponent's Madden 27 book: what the team playbook is known for online
  (identity formations, meta concepts, whether people swap to a generic book).
- How H2H players use this roster: QB scrambling, X-Factor activation, the
  go-to cheese with their personnel.
- Real 2026 NFL scheme only where it explains the book (e.g. a wide-zone
  team's book is heavy under-center stretch).
- Any Madden 27 patch notes that change what their stars do.

Tag every claim's confidence: `ea` (first-party M27), `m27` (credible M27
source), `m26` (carryover), `stale` (old but tested), `read` (your inference
from facts). Inference is fine; laundering it as a source is not.

## Step 3: think like the coordinator

Work these questions, in order, before writing:

1. **Where is the talent, where is the hole?** Use `ranks` (1 = best of 32)
   and `units` vs `falconsUnits`. A unit ranked 25+ is a target; top 5 is a
   respect.
2. **Attack:** from `matchups.attack`, find the two to four biggest positive
   edges (receiver vs corner, TE/HB vs weakest cover defender, our OL vs their
   rushers, run game vs front) and the worst negative edge to avoid (usually a
   rusher who beats our guard, or a lockdown corner). `speedDelta` matters more
   than the composite when a receiver is +4 or more on a deep route.
3. **Defend:** from `matchups.defend` and `threats`, name who must not beat
   you (X-Factors first; say how to keep them out of the zone) and which of
   their offensive weak links to pressure. Check `qbProfile.scrambler`:
   a scrambler changes the rush plan (contain, spy, fewer edge blitzes).
4. **The human:** what does this roster invite an opponent to do? That is
   `identity.expectFromUser`. Then the `liveTells`: what to chart in the first
   two drives that confirms or kills each expectation, and the response.
5. **Calls:** 4 to 8 per side, exact play names from `falconsBooks`, each with
   the reason it beats *this* opponent. Offense calls must come from
   `falcons-off`, defense from `falcons-def`. Get the `playId` from
   `public/data/playbooks.json` (it is `falcons-off-<formation-slug>-<play-slug>`);
   look it up, never construct it.

Falcons doctrine to respect unless the facts argue otherwise: run-first
wide zone and play-action off Bijan, Tua is a rhythm thrower (0 to 18 yards
on timing, not a full-field reader), nickel base on defense with a five-man
odd front as a package, Bates is user-deep, not a box safety.

## Step 4: write the report

Read-modify-write only the `report` key with python in `device_bash` (never
retype the file). Shape, all required:

```json
{
  "rosterIteration": "<facts.iteration.label>",
  "builtAt": "YYYY-MM-DD",
  "threatLevel": 1,
  "headline": "<= 90 chars, the matchup in one line",
  "bottomLine": "2 to 4 sentences: how this game is won and lost",
  "identity": {
    "offense": "what their offense is built to do",
    "defense": "what their defense is built to do",
    "expectFromUser": ["2 to 5 things a human with this roster will try"]
  },
  "keys": [{ "title": "<= 60", "detail": "...", "conf": "read" }],
  "attack": {
    "plan": "the offensive game plan in a paragraph",
    "targets": [{ "player": "<defensive starter name>", "why": "cite the number", "how": "the concept that attacks it", "conf": "read" }],
    "avoid":   [{ "player": "<defensive starter name>", "why": "...", "conf": "read" }],
    "calls":   [{ "playId": "falcons-off-...", "name": "EXACT NAME", "formation": "Group Formation", "why": "..." }],
    "counters":[{ "tell": "if they show X", "answer": "go to Y" }]
  },
  "defend": {
    "plan": "...",
    "mustStop": [{ "player": "<offensive starter>", "why": "...", "how": "...", "conf": "read" }],
    "exploit":  [{ "player": "<offensive starter>", "why": "...", "how": "...", "conf": "read" }],
    "calls":    [{ "playId": "falcons-def-...", "name": "...", "formation": "...", "why": "..." }],
    "counters": [{ "tell": "...", "answer": "..." }]
  },
  "liveTells": [{ "watch": "...", "meaning": "...", "response": "..." }],
  "specialTeams": "returner speed, kicker leg, anything that changes 4th down math",
  "sources": [{ "label": "...", "url": "https://..." }]
}
```

Counts enforced: keys exactly 3; targets 2-4; avoid 1-3; mustStop 2-4;
exploit 1-3; calls 4-8 per side; counters 2-4; liveTells 3-5; sources 2+.
`player` names must match a projected starter in `facts.starters` exactly.
`why`/`how` fields max 200 chars, plans and bottomLine max 700.
**No em dashes anywhere** (the validator rejects them). Write for Kenny: plain,
specific, a number in every "why", no filler.

threatLevel: 5 = better than the Falcons in most units with an X-Factor that
breaks our plan; 3 = even; 1 = clear edges almost everywhere.

## Step 5: validate, then report back

```bash
node scripts/scouting/validate.mjs <ABBR>
```

Fix until it prints `<ABBR>: ok`. Then reply (under 120 words): headline,
threat level, the single biggest attack edge and defend concern, and any
facts that looked wrong (a starter who should not be one, a missing injury).
Do not commit; the orchestrator does.

## Orchestrator wrap-up (after the blitz)

1. `node scripts/scouting/validate.mjs` (all) and `node scripts/scouting/build.mjs index`.
2. On the Mac: `npm test`, `npm run lint`, `npm run build`.
3. Commit `Add: scouting reports for <N> opponents (<iteration>)` and push to
   main; Pages deploys. Report the app URL and which teams flagged data issues.

For a weekly roster update: Step 0, then re-run only teams whose report went
stale or whose `facts` changed materially (a starter swap, an X-Factor
added). A refresh is a diff, not a rewrite.
