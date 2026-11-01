import { describe, it, expect } from 'vitest';
import { booksOnSheet, searchQuick } from '../quickAdd.js';

const book = (name, type, formation, plays) => ({
  name,
  type,
  formationGroups: [
    {
      name: 'Gun',
      formations: [
        {
          name: formation,
          plays: plays.map((p) => ({ id: name + '-' + p, name: p, type: 'pass' })),
        },
      ],
    },
  ],
});
const catalog = [
  book('Eagles', 'offense', 'Tight Open', ['MESH SPOT', 'PA MESH', 'HB DIVE']),
  book('Falcons', 'offense', 'Wide Trips', ['MESH SPOT', 'FOUR VERTICALS']),
  book('4-3', 'defense', 'Over', ['MESH BLITZ']),
];
const mine = { redzone: [{ playId: 'x', playbook: 'Falcons' }] };
const ids = (plays) => plays.map((p) => p.playId);

describe('booksOnSheet', () => {
  it('collects the books on the sheet and tolerates an empty one', () => {
    expect([...booksOnSheet(mine)]).toEqual(['Falcons']);
    expect(booksOnSheet(undefined).size).toBe(0);
  });
});

describe('searchQuick', () => {
  it('searches your own books before the rest of the catalog', () => {
    expect(ids(searchQuick(catalog, 'mesh', 'offense', mine))).toEqual(['Falcons-MESH SPOT']);
  });
  it('falls back to every book when yours has no match', () => {
    expect(ids(searchQuick(catalog, 'dive', 'offense', mine))).toEqual(['Eagles-HB DIVE']);
  });
  it('searches everything on an empty sheet, and ranks a leading match first', () => {
    expect(ids(searchQuick(catalog, 'mesh', 'offense', {}))).toEqual([
      'Eagles-MESH SPOT',
      'Falcons-MESH SPOT',
      'Eagles-PA MESH',
    ]);
  });
  it('matches words across play name and formation, in any order', () => {
    expect(ids(searchQuick(catalog, 'tight mesh', 'offense', {}))).toEqual([
      'Eagles-MESH SPOT',
      'Eagles-PA MESH',
    ]);
  });
  it('keeps to the side you are on', () => {
    expect(ids(searchQuick(catalog, 'blitz', 'offense', {}))).toEqual([]);
    expect(ids(searchQuick(catalog, 'blitz', 'defense', {}))).toEqual(['4-3-MESH BLITZ']);
  });
  it('waits for two characters', () => {
    expect(searchQuick(catalog, 'm', 'offense', {})).toEqual([]);
  });
  it('returns plays in the shape the sheet stores', () => {
    expect(searchQuick(catalog, 'four', 'offense', mine)[0]).toEqual({
      playId: 'Falcons-FOUR VERTICALS',
      name: 'FOUR VERTICALS',
      type: 'pass',
      playbook: 'Falcons',
      formation: 'Wide Trips',
    });
  });
});
