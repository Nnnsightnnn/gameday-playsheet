#!/usr/bin/env python3
"""Pull every rostered Madden 27 player's full ratings for the scouting pipeline.

Source of truth for the CURRENT roster iteration: madden.tools (tracks EA's
weekly roster updates; each player page carries all ~55 ratings, abilities,
scheme fits). EA's official ratings site is merged in for ability names
madden.tools leaves unresolved (usually X-Factors), since EA's per-team
payload labels every ability with its type.

Writes tools/scraper/output/rosters-m27.json (gitignored, ~2MB):
  { iteration: {label, release_date}, scrapedAt, teams: { ATL: {name, players: [...]}, ... } }

Usage: python3 tools/scraper/scrape_rosters.py [--teams ATL,KC] [--workers 8]
Stdlib only, so it runs on the host without the venv.
"""
import argparse, json, re, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (gameday-playsheet scouting; personal use)"}
MT = "https://madden.tools"
EA = "https://www.ea.com/games/madden-nfl/ratings"
OUT = Path(__file__).parent / "output" / "rosters-m27.json"

# madden.tools acronym -> EA team label
TEAM_NAMES = {
    "ARI": "Arizona Cardinals", "ATL": "Atlanta Falcons", "BAL": "Baltimore Ravens", "BUF": "Buffalo Bills",
    "CAR": "Carolina Panthers", "CHI": "Chicago Bears", "CIN": "Cincinnati Bengals", "CLE": "Cleveland Browns",
    "DAL": "Dallas Cowboys", "DEN": "Denver Broncos", "DET": "Detroit Lions", "GB": "Green Bay Packers",
    "HOU": "Houston Texans", "IND": "Indianapolis Colts", "JAX": "Jacksonville Jaguars", "KC": "Kansas City Chiefs",
    "LV": "Las Vegas Raiders", "LAC": "Los Angeles Chargers", "LAR": "Los Angeles Rams", "MIA": "Miami Dolphins",
    "MIN": "Minnesota Vikings", "NE": "New England Patriots", "NO": "New Orleans Saints", "NYG": "New York Giants",
    "NYJ": "New York Jets", "PHI": "Philadelphia Eagles", "PIT": "Pittsburgh Steelers", "SF": "San Francisco 49ers",
    "SEA": "Seattle Seahawks", "TB": "Tampa Bay Buccaneers", "TEN": "Tennessee Titans", "WAS": "Washington Commanders",
}

# rating_* key -> short acronym used everywhere downstream
RATINGS = {
    "overall": "OVR", "speed": "SPD", "acceleration": "ACC", "agility": "AGI", "change_of_direction": "COD",
    "strength": "STR", "awareness": "AWR", "jumping": "JMP", "stamina": "STA", "injury": "INJ", "toughness": "TGH",
    "throw_power": "THP", "throw_accuracy_short": "SAC", "throw_accuracy_medium": "MAC", "throw_accuracy_deep": "DAC",
    "throw_on_run": "RUN", "throw_under_pressure": "TUP", "play_action": "PAC", "break_sack": "BSK",
    "carrying": "CAR", "ball_carrier_vision": "BCV", "break_tackle": "BTK", "trucking": "TRK", "stiff_arm": "SFA",
    "juke_move": "JKM", "spin_move": "SPM", "catching": "CTH", "catch_in_traffic": "CIT", "spectacular_catch": "SPC",
    "release": "RLS", "route_running_short": "SRR", "route_running_medium": "MRR", "route_running_deep": "DRR",
    "run_block": "RBK", "run_block_power": "RBP", "run_block_finesse": "RBF", "pass_block": "PBK",
    "pass_block_power": "PBP", "pass_block_finesse": "PBF", "impact_block": "IBL", "lead_block": "LBK",
    "tackle": "TAK", "hit_power": "POW", "pursuit": "PUR", "play_recognition": "PRC", "block_shedding": "BSH",
    "power_moves": "PMV", "finesse_moves": "FMV", "man_coverage": "MCV", "zone_coverage": "ZCV", "press": "PRS",
    "kick_power": "KPW", "kick_accuracy": "KAC", "kick_return": "RET",
}


def get(url, tries=4):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return r.read().decode()
        except Exception as e:  # noqa: BLE001
            if i == tries - 1:
                raise
            time.sleep(1.5 * (i + 1))


def next_data(html):
    return json.loads(re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S).group(1))


def player(build, slug):
    d = json.loads(get(f"{MT}/_next/data/{build}/players/{slug}.json?slug={slug}"))["pageProps"]
    p = d["player"]
    out = {
        "id": p["id"], "name": f'{p["first_name"]} {p["last_name"]}', "pos": p["position"],
        "jersey": p.get("jersey_number"), "age": p.get("age"), "height": p.get("height"), "weight": p.get("weight"),
        "dev": p.get("trait_development"),
        "ratings": {ab: p.get(f"rating_{k}") for k, ab in RATINGS.items()},
        "abilities": [{"name": a["name"], "type": a.get("type_id"), "desc": a.get("description", "")} for a in d.get("abilities") or []],
        "unresolvedAbilities": len(p.get("unresolved_ability_asset_ids") or []),
        "archetypeFits": [f'{s["scheme"]["name"]}:{s["grade"]["label"]}' for s in d.get("schemeFits") or []],
        "playbook": (d.get("teamPlaybook") or {}).get("bookSlug"),
    }
    return out


def ea_abilities(team_label):
    """EA per-team payload: name -> abilities with types (launch iteration)."""
    d = next_data(get(f"{EA}?team={urllib.parse.quote(team_label)}"))
    # EA filter wants numeric id; resolve from filters then refetch
    teams = [t for g in d["props"]["pageProps"]["ratingsFilters"]["teamGroups"] for t in g["teams"]]
    tid = next((t["id"] for t in teams if t["label"] == team_label), None)
    if tid is None:
        return {}
    d = next_data(get(f"{EA}?team={tid}"))
    res = {}
    for it in d["props"]["pageProps"]["ratingDetails"]["items"]:
        nm = f'{it.get("firstName")} {it.get("lastName")}'
        res[nm] = [{"name": a["label"], "type": a["type"]["id"], "desc": a.get("description", "")} for a in it.get("playerAbilities") or []]
    return res


def main():
    import urllib.parse  # noqa: F401  (used in ea_abilities)
    globals()["urllib"].parse = urllib.parse
    ap = argparse.ArgumentParser()
    ap.add_argument("--teams", default="")
    ap.add_argument("--workers", type=int, default=8)
    a = ap.parse_args()
    want = set(t.strip().upper() for t in a.teams.split(",") if t.strip())

    nd = next_data(get(f"{MT}/players"))
    build = nd["buildId"]
    pp = nd["props"]["pageProps"]
    it = pp["currentIteration"]
    jobs = []
    for tp in pp["teamPlayerData"]:
        ab = tp["team"]["acronym"]
        if ab == "FA" or (want and ab not in want):
            continue
        for plist in tp["playersByPosition"].values():
            for pl in plist:
                jobs.append((ab, pl["slug"]))
    print(f"iteration {it['label']} ({it['release_date']}), {len(jobs)} players", flush=True)

    teams = {ab: {"abbr": ab, "name": TEAM_NAMES[ab], "players": []} for ab in {j[0] for j in jobs}}
    done = 0
    with ThreadPoolExecutor(a.workers) as ex:
        futs = {ex.submit(player, build, slug): ab for ab, slug in jobs}
        for f in as_completed(futs):
            ab = futs[f]
            try:
                teams[ab]["players"].append(f.result())
            except Exception as e:  # noqa: BLE001
                print("FAIL", ab, e, file=sys.stderr)
            done += 1
            if done % 200 == 0:
                print(done, flush=True)

    for ab, t in sorted(teams.items()):
        if not any(p["unresolvedAbilities"] for p in t["players"]):
            continue
        try:
            eamap = ea_abilities(t["name"])
        except Exception as e:  # noqa: BLE001
            print("EA fallback failed", ab, e, file=sys.stderr)
            continue
        for p in t["players"]:
            if p["unresolvedAbilities"] and p["name"] in eamap:
                have = {x["name"] for x in p["abilities"]}
                p["abilities"] += [x for x in eamap[p["name"]] if x["name"] not in have]
                p["abilitySource"] = "madden.tools+ea-launch"
        t["players"].sort(key=lambda p: (p["pos"], -(p["ratings"]["OVR"] or 0)))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    prev = json.load(open(OUT)) if (OUT.exists() and want) else {"teams": {}}
    prev["teams"].update(teams)
    json.dump({"iteration": {"label": it["label"], "releaseDate": it["release_date"]},
               "scrapedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
               "source": "madden.tools (current roster iteration) + ea.com ratings (ability labels)",
               "teams": prev["teams"]}, open(OUT, "w"))
    print(f"wrote {OUT} ({len(prev['teams'])} teams)")


if __name__ == "__main__":
    main()
