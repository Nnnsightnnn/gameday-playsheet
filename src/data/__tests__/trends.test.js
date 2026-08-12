// Trends digest shape — the Trends board renders whatever the refresh skill
// writes, so the contract lives here.
import { describe, it, expect } from 'vitest';
import trends from '../../../public/data/trends.json';

const CATEGORIES = ['offense', 'defense', 'mechanic', 'patch', 'exploit', 'team'];

describe('trends.json', () => {
  it('is dated and covers both games', () => {
    expect(trends.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(trends.games.madden).toBeTruthy();
    expect(trends.games.cfb).toBeTruthy();
  });

  for (const game of ['madden', 'cfb']) {
    describe(game, () => {
      const g = trends.games[game];

      it('has a label and 5+ substantive trend items', () => {
        expect(g.label.length).toBeGreaterThan(2);
        expect(g.trends.length).toBeGreaterThanOrEqual(5);
        const ids = new Set();
        for (const t of g.trends) {
          expect(ids.has(t.id), `duplicate ${t.id}`).toBe(false);
          ids.add(t.id);
          expect(CATEGORIES, t.id).toContain(t.category);
          expect(t.title.length, t.id).toBeGreaterThan(8);
          expect(t.summary.length, t.id).toBeGreaterThanOrEqual(60);
          for (const l of t.links || []) {
            expect(l.url, t.id).toMatch(/^https:\/\//);
            expect(l.label.length, t.id).toBeGreaterThan(2);
          }
        }
      });

      it('lists creators and sources to monitor, all https', () => {
        expect(g.creators.length).toBeGreaterThanOrEqual(3);
        expect(g.watch.length).toBeGreaterThanOrEqual(3);
        for (const x of [...g.creators, ...g.watch, ...(g.videos || [])]) {
          expect(x.url).toMatch(/^https:\/\//);
        }
      });
    });
  }
});
