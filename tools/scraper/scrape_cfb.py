#!/usr/bin/env python3
"""
cfb.fan College Football 27 Playbook Scraper

Scrapes all CFB 27 playbooks, formations, and plays from cfb.fan
(huddle.gg's sister site — same page family, slightly different markup).
Outputs a JSON file matching the Madden playbooks.json schema, with a
`game: "cfb"` envelope so the app can tell the catalogs apart.

URL structure (verified 2026-07-29):
  list       https://cfb.fan/playbooks/                     -> /playbooks/{slug}-(off|def)/
  playbook   https://cfb.fan/playbooks/{slug}/              -> /27/playbooks/{slug}/{formation}/
  formation  https://cfb.fan/27/playbooks/{slug}/{form}/    -> /27/playbooks/{slug}/{form}/{play}/

Usage:
  python scrape_cfb.py                     # full scrape (resumable)
  python scrape_cfb.py --only alabama-off,3-3-5-def   # subset for testing
"""

from __future__ import annotations

import argparse
import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin

from scrape_huddle import fetch_page, determine_play_type

BASE_URL = "https://cfb.fan"
CFB_VERSION = "27"

OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_FILE = OUTPUT_DIR / "playbooks-cfb27.json"
PROGRESS_FILE = OUTPUT_DIR / "progress-cfb.json"

# Generic (non-team) offensive playbooks in CFB 27.
# Note: air-force-off is a real team, not an alternate.
OFFENSE_ALTERNATES = {
    "air-raid", "go-go", "multiple", "option", "pistol", "power-spread",
    "pro-style", "run-shoot", "spread", "spread-option", "veer-shoot",
}

# CFB 27 has no team defensive playbooks — only schemes. The six base
# schemes act as the "team" tier; man/zone/pressure/etc. variants are
# the alternates.
DEFENSE_BASE_SCHEMES = {"3-2-6", "3-3-5", "3-4", "4-2-5", "4-3", "multiple"}


def cfb_play_type(play_name: str) -> str:
    """CFB-specific play typing on top of the Madden heuristic."""
    name_lower = play_name.lower()
    if "rpo" in name_lower or "zone read" in name_lower or "read option" in name_lower:
        return "run"
    return determine_play_type(play_name)


def get_playbook_list() -> list[dict]:
    """Get list of all CFB 27 playbooks from cfb.fan."""
    soup = fetch_page(f"{BASE_URL}/playbooks/")
    if not soup:
        return []

    playbooks = []
    playbook_links = soup.find_all("a", href=re.compile(r"^/playbooks/[\w-]+-(?:off|def)/$"))

    for link in playbook_links:
        href = link.get("href", "")
        # Name is split across divs ("Georgia" / "Bulldogs"); the -team div
        # alone matches the Madden catalog's short-name style
        name_div = link.find(class_="playbook-list-item__name-team")
        name = (name_div or link).get_text(" ", strip=True)

        match = re.search(r"^/playbooks/([\w-]+)/$", href)
        if not match:
            continue
        slug = match.group(1)
        base_slug = re.sub(r"-(off|def)$", "", slug)

        if slug.endswith("-off"):
            pb_type = "offense"
            category = "alternate" if base_slug in OFFENSE_ALTERNATES else "team"
        elif slug.endswith("-def"):
            pb_type = "defense"
            category = "team" if base_slug in DEFENSE_BASE_SCHEMES else "alternate"
        else:
            continue

        playbooks.append({
            "id": slug,
            "name": name or base_slug.replace("-", " ").title(),
            "slug": slug,
            "type": pb_type,
            "category": category,
            "url": urljoin(BASE_URL, href),
        })

    seen = set()
    unique = []
    for pb in playbooks:
        if pb["id"] not in seen:
            seen.add(pb["id"])
            unique.append(pb)
    return unique


def scrape_playbook(playbook: dict) -> dict:
    """Scrape all formations and plays from a single playbook."""
    print(f"\nScraping playbook: {playbook['name']} ({playbook['type']})")

    soup = fetch_page(playbook["url"])
    if not soup:
        return {**playbook, "formationGroups": []}

    formation_pattern = rf"^/{CFB_VERSION}/playbooks/{re.escape(playbook['slug'])}/([\w-]+)/$"
    formation_links = soup.find_all("a", href=re.compile(formation_pattern))

    # Groups are <h2> headers above each block of formation links.
    formation_groups: dict[str, list] = {}
    seen_formations = set()

    for link in formation_links:
        href = link.get("href", "")
        formation_name = link.get_text(strip=True)

        match = re.search(formation_pattern, href)
        if not match:
            continue
        formation_slug = match.group(1)
        if formation_slug in seen_formations:
            continue
        seen_formations.add(formation_slug)

        group_header = link.find_previous("h2")
        group_name = group_header.get_text(strip=True) if group_header else "Other"

        plays = scrape_formation_plays(
            urljoin(BASE_URL, href), playbook["slug"], formation_slug
        )

        formation_groups.setdefault(group_name, []).append({
            "name": formation_name,
            "slug": formation_slug,
            "plays": plays,
        })

    return {
        "id": playbook["id"],
        "name": playbook["name"],
        "type": playbook["type"],
        "category": playbook["category"],
        "formationGroups": [
            {"name": group_name, "formations": formations}
            for group_name, formations in sorted(formation_groups.items())
        ],
    }


def scrape_formation_plays(formation_url: str, playbook_slug: str, formation_slug: str) -> list[dict]:
    """Scrape all plays from a formation page."""
    soup = fetch_page(formation_url)
    if not soup:
        return []

    play_pattern = (
        rf"^/{CFB_VERSION}/playbooks/{re.escape(playbook_slug)}/"
        rf"{re.escape(formation_slug)}/([\w-]+)/$"
    )
    plays = []
    seen = set()

    for link in soup.find_all("a", href=re.compile(play_pattern)):
        href = link.get("href", "")
        play_name = link.get_text(strip=True)

        match = re.search(play_pattern, href)
        if not match or not play_name:
            continue
        play_slug = match.group(1)
        # cfb27 prefix keeps ids from colliding with Madden plays on the
        # saved sheet (generic books like pistol-off exist in both games).
        # ":" separators because dash-joined segments are ambiguous
        # (iowa-off "wing"/"close-pa-cross" == "wing-close"/"pa-cross").
        play_id = f"cfb27:{playbook_slug}:{formation_slug}:{play_slug}"
        if play_id in seen:
            continue
        seen.add(play_id)

        plays.append({
            "id": play_id,
            "name": play_name,
            "slug": play_slug,
            "type": cfb_play_type(play_name),
        })

    print(f"    Found {len(plays)} plays in {formation_slug}")
    return plays


def save_progress(data: dict, completed: list[str]):
    OUTPUT_DIR.mkdir(exist_ok=True)
    with open(PROGRESS_FILE, "w") as f:
        json.dump({"completed_playbooks": completed, "partial_data": data}, f, indent=2)


def load_progress() -> tuple[dict, list[str]]:
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            progress = json.load(f)
            return progress.get("partial_data", {}), progress.get("completed_playbooks", [])
    return {}, []


def main():
    parser = argparse.ArgumentParser(description="Scrape CFB 27 playbooks from cfb.fan")
    parser.add_argument("--only", help="Comma-separated playbook slugs to scrape (testing)")
    parser.add_argument("--output", help="Override output file path")
    args = parser.parse_args()

    output_file = Path(args.output) if args.output else OUTPUT_FILE

    print("=" * 60)
    print("cfb.fan College Football 27 Playbook Scraper")
    print("=" * 60)

    OUTPUT_DIR.mkdir(exist_ok=True)
    partial_data, completed = load_progress()

    print("\nFetching playbook list...")
    playbooks = get_playbook_list()
    if not playbooks:
        print("ERROR: Could not fetch playbook list. Check if cfb.fan structure has changed.")
        return

    if args.only:
        wanted = {s.strip() for s in args.only.split(",")}
        playbooks = [pb for pb in playbooks if pb["id"] in wanted]
        missing = wanted - {pb["id"] for pb in playbooks}
        if missing:
            print(f"WARNING: slugs not found on cfb.fan: {sorted(missing)}")

    print(f"\nFound {len(playbooks)} playbooks")
    print(f"  - {sum(1 for p in playbooks if p['type'] == 'offense')} offensive")
    print(f"  - {sum(1 for p in playbooks if p['type'] == 'defense')} defensive")

    all_playbooks = []
    for i, playbook in enumerate(playbooks):
        if playbook["id"] in completed:
            print(f"\nSkipping {playbook['name']} ({playbook['id']}) (already scraped)")
            for pb in partial_data.get("playbooks", []):
                if pb["id"] == playbook["id"]:
                    all_playbooks.append(pb)
                    break
            continue

        print(f"\n[{i + 1}/{len(playbooks)}] ", end="")
        all_playbooks.append(scrape_playbook(playbook))
        completed.append(playbook["id"])

        if (i + 1) % 5 == 0:
            save_progress({"playbooks": all_playbooks}, completed)
            print(f"\n  Progress saved ({len(completed)}/{len(playbooks)} playbooks)")

    output = {
        "game": "cfb",
        "version": CFB_VERSION,
        "scrapedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "cfb.fan",
        "playbooks": all_playbooks,
    }

    with open(output_file, "w") as f:
        json.dump(output, f, indent=2)

    # Only clear resume state after a full (non-subset) run
    if not args.only and PROGRESS_FILE.exists():
        PROGRESS_FILE.unlink()

    total_formations = sum(
        len(fg["formations"])
        for pb in all_playbooks
        for fg in pb.get("formationGroups", [])
    )
    total_plays = sum(
        len(f["plays"])
        for pb in all_playbooks
        for fg in pb.get("formationGroups", [])
        for f in fg.get("formations", [])
    )

    print("\n" + "=" * 60)
    print("SCRAPING COMPLETE")
    print("=" * 60)
    print(f"Output: {output_file}")
    print(f"Playbooks: {len(all_playbooks)}")
    print(f"Formations: {total_formations}")
    print(f"Plays: {total_plays}")


if __name__ == "__main__":
    main()
