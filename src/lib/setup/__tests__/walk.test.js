import { describe, it, expect } from 'vitest';
import { walkPosition } from '../walk.js';

const seq = ['a', 'b', 'c', 'd', 'e'].map((playId) => ({ play: { playId } }));
const ids = (entries) => entries.map((e) => e.play.playId);

describe('walkPosition', () => {
  it('starts on the first play with nothing behind it', () => {
    const w = walkPosition(seq, {});
    expect(w.index).toBe(0);
    expect(w.current.play.playId).toBe('a');
    expect(w.previous).toBeNull();
    expect(ids(w.upcoming)).toEqual(['b', 'c']);
  });

  it('resumes at the first unchecked play', () => {
    const w = walkPosition(seq, { a: true, b: true });
    expect(w.index).toBe(2);
    expect(w.current.play.playId).toBe('c');
    expect(w.previous.play.playId).toBe('b');
  });

  it('returns to a play unchecked earlier in the list, not the furthest reached', () => {
    const w = walkPosition(seq, { a: true, c: true, d: true });
    expect(w.current.play.playId).toBe('b');
  });

  it('has no current play once every play is checked, and can still step back', () => {
    const w = walkPosition(seq, { a: true, b: true, c: true, d: true, e: true });
    expect(w.index).toBe(5);
    expect(w.current).toBeNull();
    expect(w.previous.play.playId).toBe('e');
    expect(w.upcoming).toEqual([]);
  });

  it('ignores checks for plays no longer on the sheet', () => {
    expect(walkPosition(seq, { gone: true }).current.play.playId).toBe('a');
  });

  it('handles an empty sheet', () => {
    const w = walkPosition([], {});
    expect(w.current).toBeNull();
    expect(w.previous).toBeNull();
  });
});
