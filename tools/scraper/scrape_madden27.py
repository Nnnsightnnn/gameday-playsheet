#!/usr/bin/env python3
"""
Huddle.gg Madden 27 Playbook Scraper

Scrapes all Madden 27 playbooks, formations, and plays from huddle.gg.
Outputs a JSON file matching the existing playbooks.json schema
(version "27") so it drops straight into public/data/playbooks.json.

URL structure (verified 2026-08-07):
  list       https://huddle.gg/playbooks/                    -> /playbooks/{slug}-(off|def)/
  playbook   https://huddle.gg/playbooks/{slug}/             -> /27/playbooks/{slug}/{formation}/
  formation  https://huddle.gg/27/playbooks/{slug}/{form}/   -> /27/playbooks/{slug}/{form}/{play}/

Note the version prefix moved: list + playbook pages are version-less,
formation and play links carry /27/.

Usage:
  python scrape_madden27.py                       # full scrape (resumable)
  python scrape_madden27.py --only falcons-off    # subset for testing
  python scrape_madden27.py --delay 1.5           # override request delay
"""

from __future__ import annotations

import argparse
import json
import re
import time
from pathlib import Path
from urllib.parse import urljoin

import scrape_huddle
from scrape_huddle import fetch_page, determine_play_type

BASE_URL = "https://huddle.gg"
MADDEN_VERSION = "27"

OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_FILE = OUTPUT_DIR / "playbooks-madden27.json"
PROGRESS_FILE = OUTPUT_DIR / "progress-madden27.json"

# Alternate (non-team) playbooks in Madden 27, per huddle.gg/playbooks/
# (2026-08-07). New this year: the three "Classic" books.
ALTERNATE_SLUGS = {
    # offense
    "air-raid", "air-raid-classic", "balanced", "benkerts-dimes", "pistol",
    "run-n-gun", "run-and-shoot", "run-balanced", "run-heavy", "shotgun",
    "shotgun-classic", "shotgun-mix", "singleback", "spread",
    "spread-classic", "two-back", "west-coast",
    # defense
    "3-4", "4-3", "46", "cover-2", "multiple-d",
}


def get_playbook_list() -> list[dict]:
    """Get list of all Madden 27 playbooks (list page is version-less)."""
    soup = fetch_page(f"{BASE_URL}/playbooks/")
    if not soup:
        return []

    playbooks = []
    playbook_links = soup.find_all(
        "a", href=re.compile(r"^/playbooks/[\w-]+-(?:off|def)/$")
    )

    for link in playbook_links:
        href = link.get("href", "")
        match = re.search(r"^/playbooks/([\w-]+)/$", href)
        if not match:
            continue
        slug = match.group(1)

        # Name may be split across child divs (cfb.fan-style markup);
        # first text segment is the team/book name.
        name = link.get_text("|", strip=True).split("|")[0]

        if slug.endswith("-off"):
            pb_type = "offense"
        elif slug.endswith("-def"):
            pb_type = "defense"
        else:
            continue

        base_slug = re.sub(r"-(off|def)$", "", slug)
        fallback = base_slug.replace("-", " ").title()

        playbooks.append({
            "id": slug,
            "name": name or fallback,
            "slug": slug,
            "type": pb_type,
            "category": "alternate" if base_slug in ALTERNATE_SLUGS else "team",
            "url": urljoin(BASE_URL, f"/playbooks/{slug}/"),
        })

    seen = set()
    unique = []
    for pb in playbooks:
        if pb["id"] not in seen:
            seen.add(pb["id"])
            unique.append(pb)
    return unique


def extract_play_name(link) -> str:
    """Play anchors can hold extra child nodes (diagram alt/caption).
    The first text segment is the play name."""
    return link.get_text("|", strip=True).split("|")[0].strip()


def scrape_formation_plays(formation_url: str, playbook_slug: str,
                           formation_slug: str) -> list[dict]:
    soup = fetch_page(formation_url)
    if not soup:
        return []

    play_pattern = (
        rf"/{MADDEN_VERSION}/playbooks/{re.escape(playbook_slug)}/"
        rf"{re.escape(formation_slug)}/([\w-]+)/$"
    )
    plays = []
    for link in soup.find_all("a", href=re.compile(play_pattern)):
        href = link.get("href", "")
        match = re.search(play_pattern, href)
        if not match:
            continue
        play_name = extract_play_name(link)
        if not play_name:
            continue
        play_slug = match.group(1)
        plays.append({
            "id": f"{playbook_slug}-{formation_slug}-{play_slug}",
            "name": play_name,
            "slug": play_slug,
            "type": determine_play_type(play_name),
        })

    seen = set()
    unique = []
    for play in plays:
        if play["id"] not in seen:
            seen.add(play["id"])
            unique.append(play)
    print(f"    Found {len(unique)} plays in {formation_slug}")
    return unique


def scrape_playbook(playbook: dict) -> dict:
    print(f"\nScraping playbook: {playbook['name']} ({playbook['type']})")

    soup = fetch_page(playbook["url"])
    if not soup:
        return {**playbook, "formationGroups": []}

    formation_pattern = (
        rf"/{MADDEN_VERSION}/playbooks/{re.escape(playbook['slug'])}/([\w-]+)/$"
    )
    formation_groups: dict[str, list] = {}

    # <h3>Formation Group</h3> followed by sibling <ul> of formation links.
    for h3 in soup.find_all("h3"):
        group_name = h3.get_text(strip=True)
        if not group_name:
            continue
        ul = h3.find_next_sibling("ul")
        if not ul:
            continue

        formations = []
        for link in ul.find_all("a", href=re.compile(formation_pattern)):
            href = link.get("href", "")
            match = re.search(formation_pattern, href)
            if not match:
                continue
            formation_slug = match.group(1)
            formation_name = link.get_text("|", strip=True).split("|")[0]
            plays = scrape_formation_plays(
                urljoin(BASE_URL, href), playbook["slug"], formation_slug
            )
            formations.append({
                "name": formation_name,
                "slug": formation_slug,
                "plays": plays,
            })
        if formations:
            formation_groups[group_name] = formations

    # Fallback: flat link scan with heuristic grouping.
    if not formation_groups:
        for link in soup.find_all("a", href=re.compile(formation_pattern)):
            href = link.get("href", "")
            match = re.search(formation_pattern, href)
            if not match:
                continue
            formation_slug = match.group(1)
            formation_name = link.get_text("|", strip=True).split("|")[0]
            group_name = scrape_huddle.determine_formation_group(
                formation_name, formation_slug
            )
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
            {"name": g, "formations": f} for g, f in formation_groups.items()
        ],
    }


def save_progress(playbooks_done: list[dict], completed: list[str]):
    OUTPUT_DIR.mkdir(exist_ok=True)
    with open(PROGRESS_FILE, "w") as f:
        json.dump(
            {"completed_playbooks": completed,
             "partial_data": {"playbooks": playbooks_done}},
            f,
        )


def load_progress() -> tuple[list[dict], list[str]]:
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            progress = json.load(f)
        return (
            progress.get("partial_data", {}).get("playbooks", []),
            progress.get("completed_playbooks", []),
        )
    return [], []


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", help="comma-separated playbook slugs")
    parser.add_argument("--delay", type=float, default=1.0,
                        help="seconds between requests")
    args = parser.parse_args()

    scrape_huddle.DELAY_BETWEEN_REQUESTS = args.delay

    print("=" * 60)
    print("Huddle.gg Madden 27 Playbook Scraper")
    print("=" * 60)
    OUTPUT_DIR.mkdir(exist_ok=True)

    done, completed = load_progress()

    print("\nFetching playbook list...")
    playbooks = get_playbook_list()
    if not playbooks:
        print("ERROR: Could not fetch playbook list — markup change?")
        return

    if args.only:
        wanted = {s.strip() for s in args.only.split(",")}
        playbooks = [p for p in playbooks if p["id"] in wanted]

    off = sum(1 for p in playbooks if p["type"] == "offense")
    print(f"\nFound {len(playbooks)} playbooks "
          f"({off} offense, {len(playbooks) - off} defense)")

    start = time.time()
    for i, playbook in enumerate(playbooks, 1):
        if playbook["id"] in completed:
            print(f"Skipping {playbook['id']} (already scraped)")
            continue
        print(f"\n[{i}/{len(playbooks)}] elapsed {time.time()-start:.0f}s")
        data = scrape_playbook(playbook)
        done.append(data)
        completed.append(playbook["id"])
        save_progress(done, completed)

    output = {
        "version": MADDEN_VERSION,
        "scrapedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": "huddle.gg",
        "playbooks": done,
    }
    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2)

    total_plays = sum(
        len(fm["plays"])
        for pb in done
        for fg in pb["formationGroups"]
        for fm in fg["formations"]
    )
    print(f"\nDONE: {len(done)} playbooks, {total_plays} plays "
          f"-> {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
