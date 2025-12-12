#!/usr/bin/env python3
"""Scrape a subset of playbooks for quick testing."""

import json
import time
from pathlib import Path
from scrape_huddle import scrape_playbook, BASE_URL, MADDEN_VERSION, OUTPUT_DIR

# Scrape a few representative playbooks
PLAYBOOKS_TO_SCRAPE = [
    # Team Offense
    {"id": "eagles-off", "name": "Eagles", "slug": "eagles-off", "type": "offense", "category": "team"},
    {"id": "chiefs-off", "name": "Chiefs", "slug": "chiefs-off", "type": "offense", "category": "team"},
    {"id": "49ers-off", "name": "49ers", "slug": "49ers-off", "type": "offense", "category": "team"},
    {"id": "bills-off", "name": "Bills", "slug": "bills-off", "type": "offense", "category": "team"},
    {"id": "ravens-off", "name": "Ravens", "slug": "ravens-off", "type": "offense", "category": "team"},
    # Alternate Offense
    {"id": "air-raid-off", "name": "Air Raid", "slug": "air-raid-off", "type": "offense", "category": "alternate"},
    {"id": "west-coast-off", "name": "West Coast", "slug": "west-coast-off", "type": "offense", "category": "alternate"},
    # Team Defense
    {"id": "eagles-def", "name": "Eagles", "slug": "eagles-def", "type": "defense", "category": "team"},
    {"id": "49ers-def", "name": "49ers", "slug": "49ers-def", "type": "defense", "category": "team"},
    # Alternate Defense
    {"id": "multiple-d-def", "name": "Multiple D", "slug": "multiple-d-def", "type": "defense", "category": "alternate"},
]

def main():
    print("=" * 60)
    print("Scraping subset of playbooks for testing")
    print("=" * 60)

    OUTPUT_DIR.mkdir(exist_ok=True)
    all_playbooks = []

    for i, pb_info in enumerate(PLAYBOOKS_TO_SCRAPE):
        pb_info["url"] = f"{BASE_URL}/{MADDEN_VERSION}/playbooks/{pb_info['slug']}/"
        print(f"\n[{i+1}/{len(PLAYBOOKS_TO_SCRAPE)}]", end="")

        result = scrape_playbook(pb_info)
        all_playbooks.append(result)

        # Show progress
        fg_count = len(result.get('formationGroups', []))
        play_count = sum(
            len(f['plays'])
            for fg in result.get('formationGroups', [])
            for f in fg.get('formations', [])
        )
        print(f"  -> {fg_count} formation groups, {play_count} plays")

    # Save output
    output = {
        "version": MADDEN_VERSION,
        "scrapedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "huddle.gg",
        "playbooks": all_playbooks
    }

    output_file = OUTPUT_DIR / "playbooks_subset.json"
    with open(output_file, "w") as f:
        json.dump(output, f, indent=2)

    print("\n" + "=" * 60)
    print("DONE")
    print("=" * 60)
    print(f"Output: {output_file}")
    print(f"Playbooks: {len(all_playbooks)}")

    total_plays = sum(
        len(f['plays'])
        for pb in all_playbooks
        for fg in pb.get('formationGroups', [])
        for f in fg.get('formations', [])
    )
    print(f"Total plays: {total_plays}")

if __name__ == "__main__":
    main()
