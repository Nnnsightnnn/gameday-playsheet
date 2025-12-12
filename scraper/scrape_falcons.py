#!/usr/bin/env python3
"""Quick scrape of Falcons offense playbook."""

import json
from scrape_huddle import fetch_page, scrape_playbook, BASE_URL, MADDEN_VERSION

# Scrape Falcons offense
falcons = {
    "id": "falcons-off",
    "name": "Falcons",
    "slug": "falcons-off",
    "type": "offense",
    "category": "team",
    "url": f"{BASE_URL}/{MADDEN_VERSION}/playbooks/falcons-off/"
}

print("Scraping Falcons Offense...")
result = scrape_playbook(falcons)

print(f"\nFalcons: {len(result['formationGroups'])} formation groups")
total_plays = sum(len(f['plays']) for fg in result['formationGroups'] for f in fg['formations'])
print(f"Total plays: {total_plays}")

# Save to output
with open("output/falcons.json", "w") as f:
    json.dump(result, f, indent=2)

print("\nSaved to output/falcons.json")
