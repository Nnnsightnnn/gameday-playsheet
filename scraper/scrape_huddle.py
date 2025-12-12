#!/usr/bin/env python3
"""
Huddle.gg Madden 26 Playbook Scraper

Scrapes all playbooks, formations, and plays from Huddle.gg
Outputs a JSON file for use in the Gameday Playsheet app.
"""

from __future__ import annotations

import json
import time
import re
from pathlib import Path
from typing import Optional
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://huddle.gg"
MADDEN_VERSION = "26"
DELAY_BETWEEN_REQUESTS = 1.5  # Be respectful

# Output paths
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_FILE = OUTPUT_DIR / "playbooks.json"
PROGRESS_FILE = OUTPUT_DIR / "progress.json"

# Headers to look like a browser
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

session = requests.Session()
session.headers.update(HEADERS)


def fetch_page(url: str) -> Optional[BeautifulSoup]:
    """Fetch a page and return BeautifulSoup object."""
    try:
        print(f"  Fetching: {url}")
        response = session.get(url, timeout=30)
        response.raise_for_status()
        time.sleep(DELAY_BETWEEN_REQUESTS)
        return BeautifulSoup(response.text, "lxml")
    except requests.RequestException as e:
        print(f"  ERROR fetching {url}: {e}")
        return None


def get_playbook_list() -> list[dict]:
    """Get list of all playbooks from Huddle.gg."""
    url = f"{BASE_URL}/{MADDEN_VERSION}/playbooks/"
    soup = fetch_page(url)
    if not soup:
        return []

    playbooks = []

    # Find all playbook links - they follow pattern /26/playbooks/{slug}/
    playbook_links = soup.find_all("a", href=re.compile(rf"/{MADDEN_VERSION}/playbooks/[\w-]+-(?:off|def)/$"))

    for link in playbook_links:
        href = link.get("href", "")
        name = link.get_text(strip=True)

        # Extract slug from href
        match = re.search(rf"/{MADDEN_VERSION}/playbooks/([\w-]+)/$", href)
        if match:
            slug = match.group(1)

            # Determine type from slug
            if slug.endswith("-off"):
                pb_type = "offense"
                team_name = slug.replace("-off", "").replace("-", " ").title()
            elif slug.endswith("-def"):
                pb_type = "defense"
                team_name = slug.replace("-def", "").replace("-", " ").title()
            else:
                continue

            # Determine category (team vs alternate)
            alternate_names = [
                "air-raid", "balanced", "benkerts-dimes", "pistol", "run-and-shoot",
                "run-balanced", "run-heavy", "run-n-gun", "shotgun", "shotgun-mix",
                "singleback", "spread", "two-back", "west-coast",
                "3-4", "4-3", "46", "cover-2", "multiple-d"
            ]
            base_slug = slug.replace("-off", "").replace("-def", "")
            category = "alternate" if base_slug in alternate_names else "team"

            playbooks.append({
                "id": slug,
                "name": name or team_name,
                "slug": slug,
                "type": pb_type,
                "category": category,
                "url": urljoin(BASE_URL, href)
            })

    # Remove duplicates
    seen = set()
    unique_playbooks = []
    for pb in playbooks:
        if pb["id"] not in seen:
            seen.add(pb["id"])
            unique_playbooks.append(pb)

    return unique_playbooks


def scrape_playbook(playbook: dict) -> dict:
    """Scrape all formations and plays from a single playbook."""
    print(f"\nScraping playbook: {playbook['name']} ({playbook['type']})")

    soup = fetch_page(playbook["url"])
    if not soup:
        return {**playbook, "formationGroups": []}

    formation_groups = {}

    # Huddle.gg structure: <h3>Formation Group</h3> followed by <ul> with formation links
    # Find all h3 headers that represent formation groups
    h3_headers = soup.find_all("h3")

    for h3 in h3_headers:
        group_name = h3.get_text(strip=True)
        if not group_name:
            continue

        # Find the next ul sibling containing formation links
        ul = h3.find_next_sibling("ul")
        if not ul:
            continue

        formation_groups[group_name] = []

        # Find formation links within this ul
        formation_pattern = rf"/{MADDEN_VERSION}/playbooks/{re.escape(playbook['slug'])}/([\w-]+)/$"
        formation_links = ul.find_all("a", href=re.compile(formation_pattern))

        for link in formation_links:
            href = link.get("href", "")
            formation_name = link.get_text(strip=True)

            match = re.search(formation_pattern, href)
            if not match:
                continue

            formation_slug = match.group(1)
            formation_url = urljoin(BASE_URL, href)

            # Scrape plays for this formation
            plays = scrape_formation_plays(formation_url, playbook["slug"], formation_slug)

            formation_groups[group_name].append({
                "name": formation_name,
                "slug": formation_slug,
                "plays": plays
            })

    # Fallback: if no h3 structure found, try finding all formation links
    if not formation_groups:
        formation_pattern = rf"/{MADDEN_VERSION}/playbooks/{re.escape(playbook['slug'])}/([\w-]+)/$"
        formation_links = soup.find_all("a", href=re.compile(formation_pattern))

        for link in formation_links:
            href = link.get("href", "")
            formation_name = link.get_text(strip=True)

            match = re.search(formation_pattern, href)
            if not match:
                continue

            formation_slug = match.group(1)
            formation_url = urljoin(BASE_URL, href)

            # Determine formation group from the slug
            group_name = determine_formation_group(formation_name, formation_slug)

            if group_name not in formation_groups:
                formation_groups[group_name] = []

            plays = scrape_formation_plays(formation_url, playbook["slug"], formation_slug)

            formation_groups[group_name].append({
                "name": formation_name,
                "slug": formation_slug,
                "plays": plays
            })

    # Convert to list format
    formation_group_list = [
        {
            "name": group_name,
            "formations": formations
        }
        for group_name, formations in sorted(formation_groups.items())
    ]

    return {
        "id": playbook["id"],
        "name": playbook["name"],
        "type": playbook["type"],
        "category": playbook["category"],
        "formationGroups": formation_group_list
    }


def determine_formation_group(formation_name: str, formation_slug: str) -> str:
    """Determine the formation group based on formation name."""
    name_lower = formation_name.lower()
    slug_lower = formation_slug.lower()

    # Check for common formation group prefixes
    group_mappings = [
        ("gun", "Gun"),
        ("shotgun", "Gun"),
        ("pistol", "Pistol"),
        ("singleback", "Singleback"),
        ("i-form", "I Form"),
        ("i form", "I Form"),
        ("iform", "I Form"),
        ("strong", "Strong"),
        ("weak", "Weak"),
        ("goal line", "Goal Line"),
        ("goalline", "Goal Line"),
        ("hail mary", "Hail Mary"),
        ("wildcat", "Wildcat"),
        ("jumbo", "Jumbo"),
        ("full house", "Full House"),
        ("empty", "Empty"),
        ("trips", "Gun"),  # Usually part of Gun
        ("bunch", "Gun"),  # Usually part of Gun
        ("spread", "Gun"),
        ("ace", "Singleback"),
        ("3-4", "3-4"),
        ("4-3", "4-3"),
        ("nickel", "Nickel"),
        ("dime", "Dime"),
        ("quarter", "Quarter"),
        ("dollar", "Dollar"),
        ("big nickel", "Big Nickel"),
        ("46", "46"),
    ]

    for pattern, group in group_mappings:
        if pattern in name_lower or pattern in slug_lower:
            return group

    # Default: use first word of formation name
    first_word = formation_name.split()[0] if formation_name else "Other"
    return first_word


def scrape_formation_plays(formation_url: str, playbook_slug: str, formation_slug: str) -> list[dict]:
    """Scrape all plays from a formation page."""
    soup = fetch_page(formation_url)
    if not soup:
        return []

    plays = []

    # Pattern for play links: /26/playbooks/{playbook}/{formation}/{play}/
    play_pattern = rf"/{MADDEN_VERSION}/playbooks/{re.escape(playbook_slug)}/{re.escape(formation_slug)}/([\w-]+)/$"
    play_links = soup.find_all("a", href=re.compile(play_pattern))

    for link in play_links:
        play_name = link.get_text(strip=True)
        href = link.get("href", "")

        match = re.search(play_pattern, href)
        if match:
            play_slug = match.group(1)
            play_id = f"{playbook_slug}-{formation_slug}-{play_slug}"

            # Determine play type from name
            play_type = determine_play_type(play_name)

            plays.append({
                "id": play_id,
                "name": play_name,
                "slug": play_slug,
                "type": play_type
            })

    # Fallback: if plays are listed without individual links (just in a ul/li structure)
    if not plays:
        # Look for ul > li structure with play names
        for ul in soup.find_all("ul"):
            for li in ul.find_all("li"):
                # Check if this li contains a play link or just text
                link = li.find("a")
                if link:
                    play_name = link.get_text(strip=True)
                else:
                    play_name = li.get_text(strip=True)

                if play_name and len(play_name) < 100 and play_name not in ["Home", "Playbooks"]:
                    play_slug = slugify(play_name)
                    play_id = f"{playbook_slug}-{formation_slug}-{play_slug}"
                    play_type = determine_play_type(play_name)

                    plays.append({
                        "id": play_id,
                        "name": play_name,
                        "slug": play_slug,
                        "type": play_type
                    })

    # Remove duplicates
    seen = set()
    unique_plays = []
    for play in plays:
        if play["id"] not in seen:
            seen.add(play["id"])
            unique_plays.append(play)

    print(f"    Found {len(unique_plays)} plays in {formation_slug}")
    return unique_plays


def determine_play_type(play_name: str) -> str:
    """Determine if a play is a run or pass based on name."""
    name_lower = play_name.lower()

    # Run play indicators
    run_indicators = [
        "hb ", "fb ", "dive", "draw", "sweep", "toss", "counter", "iso",
        "blast", "slam", "inside zone", "outside zone", "stretch", "power",
        "trap", "lead", "pitch", "option", "qb run", "qb sneak", "scramble",
        "wildcat", "jet sweep", "end around", "reverse"
    ]

    # Pass play indicators
    pass_indicators = [
        "pa ", "pass", "screen", "slant", "post", "corner", "out", "curl",
        "hitch", "fade", "streak", "seam", "cross", "drag", "wheel",
        "comeback", "dig", "sail", "flood", "mesh", "spot", "stick",
        "smash", "dagger", "bench", "levels", "y-", "te ", "wr "
    ]

    for indicator in run_indicators:
        if indicator in name_lower:
            return "run"

    for indicator in pass_indicators:
        if indicator in name_lower:
            return "pass"

    # Default to pass (most plays are passing plays)
    return "pass"


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text


def save_progress(data: dict, completed: list[str]):
    """Save scraping progress for resume capability."""
    OUTPUT_DIR.mkdir(exist_ok=True)
    progress = {
        "completed_playbooks": completed,
        "partial_data": data
    }
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f, indent=2)


def load_progress() -> tuple[dict, list[str]]:
    """Load previous scraping progress."""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            progress = json.load(f)
            return progress.get("partial_data", {}), progress.get("completed_playbooks", [])
    return {}, []


def main():
    print("=" * 60)
    print("Huddle.gg Madden 26 Playbook Scraper")
    print("=" * 60)

    OUTPUT_DIR.mkdir(exist_ok=True)

    # Load any previous progress
    partial_data, completed = load_progress()

    # Get list of all playbooks
    print("\nFetching playbook list...")
    playbooks = get_playbook_list()

    if not playbooks:
        print("ERROR: Could not fetch playbook list. Check if Huddle.gg structure has changed.")
        return

    print(f"\nFound {len(playbooks)} playbooks")

    # Separate by type
    offense_books = [p for p in playbooks if p["type"] == "offense"]
    defense_books = [p for p in playbooks if p["type"] == "defense"]
    print(f"  - {len(offense_books)} offensive playbooks")
    print(f"  - {len(defense_books)} defensive playbooks")

    # Scrape each playbook
    all_playbooks = []

    for i, playbook in enumerate(playbooks):
        if playbook["id"] in completed:
            print(f"\nSkipping {playbook['name']} (already scraped)")
            # Find in partial data
            for pb in partial_data.get("playbooks", []):
                if pb["id"] == playbook["id"]:
                    all_playbooks.append(pb)
                    break
            continue

        print(f"\n[{i+1}/{len(playbooks)}] ", end="")
        scraped = scrape_playbook(playbook)
        all_playbooks.append(scraped)
        completed.append(playbook["id"])

        # Save progress periodically
        if (i + 1) % 5 == 0:
            save_progress({"playbooks": all_playbooks}, completed)
            print(f"\n  Progress saved ({len(completed)}/{len(playbooks)} playbooks)")

    # Build final output
    output = {
        "version": MADDEN_VERSION,
        "scrapedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "huddle.gg",
        "playbooks": all_playbooks
    }

    # Save final output
    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2)

    # Clean up progress file
    if PROGRESS_FILE.exists():
        PROGRESS_FILE.unlink()

    # Print summary
    print("\n" + "=" * 60)
    print("SCRAPING COMPLETE")
    print("=" * 60)
    print(f"Output: {OUTPUT_FILE}")

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

    print(f"Playbooks: {len(all_playbooks)}")
    print(f"Formations: {total_formations}")
    print(f"Plays: {total_plays}")


if __name__ == "__main__":
    main()
