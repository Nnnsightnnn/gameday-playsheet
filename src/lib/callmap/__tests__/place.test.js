import { describe, it, expect } from 'vitest';
import { afterRemove, buildSections, resolvePlace, stepPlay, stepSection } from '../place.js';

const situations = [
  { id: 'empty1', name: 'Empty one' },
  { id: 'a', name: 'A' },
  { id: 'empty2', name: 'Empty two' },
  { id: 'b', name: 'B' },
];
const assignments = {
  a: [{ playId: 'a1' }, { playId: 'a2' }, { playId: 'a3' }],
  b: [{ playId: 'b1' }],
};
const sections = buildSections(situations, assignments);
const a = sections[1];

describe('buildSections', () => {
  it('gives a section with nothing assigned an empty list', () => {
    expect(sections[0].plays).toEqual([]);
    expect(a.plays).toHaveLength(3);
  });
});

describe('resolvePlace', () => {
  it('opens on the first section that has plays when nothing is saved', () => {
    expect(resolvePlace(sections, null)).toEqual({ sectionId: 'a', playId: 'a1' });
  });
  it('returns to the saved section and play', () => {
    expect(resolvePlace(sections, { sectionId: 'a', playId: 'a2' })).toEqual({
      sectionId: 'a',
      playId: 'a2',
    });
  });
  it('falls to the first play when the pinned play was removed', () => {
    expect(resolvePlace(sections, { sectionId: 'a', playId: 'gone' }).playId).toBe('a1');
  });
  it('falls to the first section with plays when the saved section is gone', () => {
    expect(resolvePlace(sections, { sectionId: 'gone', playId: 'x' }).sectionId).toBe('a');
  });
  it('stays on an empty section you chose, with nothing pinned', () => {
    expect(resolvePlace(sections, { sectionId: 'empty1' })).toEqual({
      sectionId: 'empty1',
      playId: null,
    });
  });
  it('opens the first section on an empty sheet and survives having no sections', () => {
    const blank = buildSections(situations, {});
    expect(resolvePlace(blank, null)).toEqual({ sectionId: 'empty1', playId: null });
    expect(resolvePlace([], null)).toEqual({ sectionId: null, playId: null });
  });
});

describe('stepPlay', () => {
  it('moves within the section', () => {
    expect(stepPlay(a, 'a1', 1)).toBe('a2');
    expect(stepPlay(a, 'a2', -1)).toBe('a1');
  });
  it('stops at both ends instead of wrapping', () => {
    expect(stepPlay(a, 'a3', 1)).toBe('a3');
    expect(stepPlay(a, 'a1', -1)).toBe('a1');
  });
  it('does nothing in an empty section', () => {
    expect(stepPlay(sections[0], null, 1)).toBeNull();
  });
});

describe('stepSection', () => {
  it('skips empty sections both ways', () => {
    expect(stepSection(sections, 'a', 1)).toBe('b');
    expect(stepSection(sections, 'b', -1)).toBe('a');
  });
  it('stays put when no section with plays lies that way', () => {
    expect(stepSection(sections, 'b', 1)).toBe('b');
    expect(stepSection(sections, 'a', -1)).toBe('a');
  });
});

describe('afterRemove', () => {
  it('pins the play that takes the removed row', () => {
    expect(afterRemove(a, 'a1')).toBe('a2');
    expect(afterRemove(a, 'a2')).toBe('a3');
  });
  it('falls back to the new last row when the last play goes', () => {
    expect(afterRemove(a, 'a3')).toBe('a2');
  });
  it('pins nothing when the section empties', () => {
    expect(afterRemove(sections[3], 'b1')).toBeNull();
  });
});
