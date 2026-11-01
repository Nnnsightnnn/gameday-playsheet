// Claude's proposed sheet edits. Pure so the rules that protect the real sheet
// are testable: nothing unverified gets on it, and Kenny's own note is untouched.

import { SITUATIONS } from '../../data/situations';

// Every play in the book on one side, by id. Plays carry the same shape the
// play bank adds to the sheet.
function catalogIndex(playbooks, side) {
  const index = new Map();
  for (const pb of playbooks) {
    if (pb.type !== side) continue;
    for (const g of pb.formationGroups || []) {
      for (const f of g.formations || []) {
        for (const p of f.plays || []) {
          index.set(p.id, {
            playId: p.id,
            name: p.name,
            type: p.type,
            formation: f.name,
            playbook: pb.name,
          });
        }
      }
    }
  }
  return index;
}

// All or nothing, with reasons, so Claude can correct a bad id or block rather
// than Kenny seeing a card that quietly does less than it says.
export function validateProposal({ side, changes }, playbooks, sheet) {
  const errors = [];
  const hydrated = [];
  const catalog = catalogIndex(playbooks, side);
  const blocks = new Map(SITUATIONS[side].map((s) => [s.id, s]));
  if (!changes.length) errors.push('No changes in the proposal.');

  for (const raw of changes) {
    // Notes show as plain text on the sheet; the model sometimes adds a stray <br>.
    const c = { ...raw, note: (raw.note || '').replace(/<br\s*\/?>/gi, ' ').trim() };
    const block = blocks.get(c.situationId);
    if (!block) {
      errors.push(`No ${side} block with id "${c.situationId}".`);
      continue;
    }
    const onSheet = (sheet?.[side]?.[c.situationId] || []).find((p) => p.playId === c.playId);
    if (c.action === 'add') {
      const play = catalog.get(c.playId);
      if (!play) {
        errors.push(`"${c.playId}" is not a ${side} play in this game's catalog.`);
      } else if (onSheet) {
        errors.push(`${play.name} is already in ${block.name}.`);
      } else {
        hydrated.push({ action: 'add', situationId: block.id, situationName: block.name, play, note: c.note });
      }
    } else if (!onSheet) {
      errors.push(`"${c.playId}" is not on the sheet in ${block.name}.`);
    } else {
      hydrated.push({ action: c.action, situationId: block.id, situationName: block.name, play: onSheet, note: c.note });
    }
  }
  return { errors, changes: hydrated };
}

// Applied against the sheet as it is now, which may have moved since the card
// was shown; a change that no longer fits is skipped rather than forced.
export function applySheetChanges(sideSheet, changes) {
  const next = { ...sideSheet };
  let applied = 0;
  for (const c of changes) {
    const list = next[c.situationId] || [];
    const exists = list.some((p) => p.playId === c.play.playId);
    if (c.action === 'add' && !exists) {
      const play = { ...c.play };
      if (c.note) play.note = c.note;
      next[c.situationId] = [...list, play];
      applied += 1;
    } else if (c.action === 'remove' && exists) {
      next[c.situationId] = list.filter((p) => p.playId !== c.play.playId);
      applied += 1;
    } else if (c.action === 'set_note' && exists) {
      next[c.situationId] = list.map((p) => (p.playId === c.play.playId ? { ...p, note: c.note } : p));
      applied += 1;
    }
  }
  return { sideSheet: next, applied, skipped: changes.length - applied };
}
