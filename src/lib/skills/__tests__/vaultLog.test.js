import { describe, it, expect } from 'vitest';
import { mergeLogLines, saveLinesToNote, NoLogSectionError } from '../vaultLog.js';

const note = [
  '# Madden',
  '',
  '## Log',
  'One line per session.',
  '- 2026-09-03 · game · 60m · win',
  '',
].join('\n');

describe('mergeLogLines', () => {
  it('adds new lines to the end of the log and keeps the rest intact', () => {
    const { text, added } = mergeLogLines(note, ['- 2026-11-01 · game · 60m · win']);
    expect(added).toHaveLength(1);
    expect(text).toBe(
      [
        '# Madden',
        '',
        '## Log',
        'One line per session.',
        '- 2026-09-03 · game · 60m · win',
        '- 2026-11-01 · game · 60m · win',
        '',
      ].join('\n'),
    );
  });
  it('skips lines already logged, so saving twice changes nothing', () => {
    const line = '- 2026-09-03 · game · 60m · win';
    const { text, added } = mergeLogLines(note, [line]);
    expect(added).toEqual([]);
    expect(text).toBe(note);
  });
  it('adds only the new lines from a mixed batch, once each', () => {
    const fresh = '- 2026-11-02 · game · 30m · loss';
    const { added } = mergeLogLines(note, ['- 2026-09-03 · game · 60m · win', fresh, fresh]);
    expect(added).toEqual([fresh]);
  });
  it('stops at the next section, so later notes stay after the log', () => {
    const withNext = '## Log\n- a\n\n## Later\n- not the log\n';
    const { text } = mergeLogLines(withNext, ['- b']);
    expect(text).toBe('## Log\n- a\n- b\n\n## Later\n- not the log\n');
  });
  it('does not count a matching line from another section as logged', () => {
    const withNext = '## Log\n- a\n\n## Later\n- b\n';
    expect(mergeLogLines(withNext, ['- b']).added).toEqual(['- b']);
  });
  it('fills an empty log and keeps Windows line endings', () => {
    expect(mergeLogLines('## Log\n', ['- a']).text).toBe('## Log\n- a\n');
    expect(mergeLogLines('## Log\r\n- a\r\n', ['- b']).text).toBe('## Log\r\n- a\r\n- b\r\n');
  });
  it('refuses a note with no log section', () => {
    expect(() => mergeLogLines('# Nope\n## Logbook\n', ['- a'])).toThrow(NoLogSectionError);
  });
});

function fakeHandle(initial, { corrupt = false } = {}) {
  const state = { text: initial, writes: 0 };
  return {
    state,
    getFile: async () => ({ text: async () => state.text }),
    createWritable: async () => ({
      write: async (t) => {
        state.writes += 1;
        state.text = corrupt ? t.slice(0, 3) : t;
      },
      close: async () => {},
    }),
  };
}

describe('saveLinesToNote', () => {
  it('writes the merged note and reports the count', async () => {
    const h = fakeHandle(note);
    expect(await saveLinesToNote(h, ['- new'])).toEqual({ added: 1 });
    expect(h.state.text).toContain('- new');
  });
  it('does not write at all when nothing is new', async () => {
    const h = fakeHandle(note);
    await saveLinesToNote(h, ['- 2026-09-03 · game · 60m · win']);
    expect(h.state.writes).toBe(0);
  });
  it('merges against the file as it is now, not as it was', async () => {
    const h = fakeHandle(note);
    h.state.text = note.replace('One line per session.', 'Edited in Obsidian.');
    await saveLinesToNote(h, ['- new']);
    expect(h.state.text).toContain('Edited in Obsidian.');
  });
  it('reports a write that did not stick', async () => {
    await expect(saveLinesToNote(fakeHandle(note, { corrupt: true }), ['- new'])).rejects.toThrow(
      'did not save',
    );
  });
  it('leaves the note alone when it has no log section', async () => {
    const h = fakeHandle('# Nope\n');
    await expect(saveLinesToNote(h, ['- a'])).rejects.toBeInstanceOf(NoLogSectionError);
    expect(h.state.writes).toBe(0);
  });
});
