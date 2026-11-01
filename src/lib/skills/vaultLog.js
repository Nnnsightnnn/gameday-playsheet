// Writes debrief lines into the Log section of a vault note. This edits a file
// Kenny cares about, so it adds lines and changes nothing else, and it refuses
// to write to a note with no Log section rather than guess where lines go.

export class NoLogSectionError extends Error {
  constructor() {
    super('That note has no "## Log" section.');
    this.name = 'NoLogSectionError';
  }
}

// Pure. Lines already in the section are skipped, so saving twice is harmless.
export function mergeLogLines(note, lines) {
  const eol = note.includes('\r\n') ? '\r\n' : '\n';
  const rows = note.split(/\r?\n/);
  const start = rows.findIndex((r) => /^##\s+Log\s*$/.test(r));
  if (start === -1) throw new NoLogSectionError();

  let end = rows.findIndex((r, i) => i > start && /^#{1,2}\s/.test(r));
  if (end === -1) end = rows.length;

  const existing = new Set(rows.slice(start, end).map((r) => r.trim()));
  const added = [...new Set(lines)].filter((l) => l.trim() && !existing.has(l.trim()));
  if (!added.length) return { text: note, added: [] };

  // Directly after the section's last line of content, ahead of any blank lines.
  let at = end;
  while (at > start + 1 && !rows[at - 1].trim()) at -= 1;
  const next = [...rows.slice(0, at), ...added, ...rows.slice(at)];
  return { text: next.join(eol), added };
}

// Reads the file fresh each time, because the note may have changed in Obsidian
// since the last save, and reads it back so a bad write is reported, not assumed.
export async function saveLinesToNote(handle, lines) {
  const before = await (await handle.getFile()).text();
  const { text, added } = mergeLogLines(before, lines);
  if (!added.length) return { added: 0 };

  const writable = await handle.createWritable();
  await writable.write(text);
  await writable.close();

  const after = await (await handle.getFile()).text();
  if (after !== text) throw new Error('The note did not save as expected.');
  return { added: added.length };
}

export const canSaveToNote = () =>
  typeof window !== 'undefined' && typeof window.showOpenFilePicker === 'function';
