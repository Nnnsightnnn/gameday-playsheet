#!/usr/bin/env python3
"""Quick test to scrape just the Eagles offense playbook."""

import json
from scrape_huddle import fetch_page, scrape_playbook, BASE_URL, MADDEN_VERSION

# Test with Eagles offense
test_playbook = {
    "id": "eagles-off",
    "name": "Eagles",
    "slug": "eagles-off",
    "type": "offense",
    "category": "team",
    "url": f"{BASE_URL}/{MADDEN_VERSION}/playbooks/eagles-off/"
}

print("Testing scraper with Eagles Offense playbook...")
result = scrape_playbook(test_playbook)

print("\n" + "=" * 60)
print("RESULTS")
print("=" * 60)
print(f"Playbook: {result['name']}")
print(f"Formation Groups: {len(result['formationGroups'])}")

total_formations = sum(len(fg['formations']) for fg in result['formationGroups'])
total_plays = sum(len(f['plays']) for fg in result['formationGroups'] for f in fg['formations'])

print(f"Total Formations: {total_formations}")
print(f"Total Plays: {total_plays}")

print("\nFormation Groups:")
for fg in result['formationGroups']:
    formation_count = len(fg['formations'])
    play_count = sum(len(f['plays']) for f in fg['formations'])
    print(f"  {fg['name']}: {formation_count} formations, {play_count} plays")

# Save test output
with open("output/test_eagles.json", "w") as f:
    json.dump(result, f, indent=2)
print(f"\nTest output saved to output/test_eagles.json")
