// The browser side of Claude's tools. The sheet and debriefs exist only in this
// browser, so tools run here against a context the panel loads fresh per turn.

import { SITUATIONS } from '../../data/situations';
import { searchQuick } from '../callmap/quickAdd';
import { validateProposal } from './sheetChanges';

const SEARCH_LIMIT = 30;
const MAX_DEBRIEFS = 30;

function callSheet({ side }, { game, sheet }) {
  const sideSheet = sheet?.[side] || {};
  const blocks = SITUATIONS[side]
    .filter((s) => !s.legacy || sideSheet[s.id]?.length)
    .map((s) => ({ id: s.id, name: s.name, sub: s.sub, plays: sideSheet[s.id] || [] }));
  return { game, side, blocks };
}

function searchPlays({ query, side, playbook }, { playbooks, sheet }) {
  // A named book stands in for "books on the sheet" in the quick-add ranking.
  const scope = playbook ? { book: [{ playbook }] } : sheet?.[side];
  return { plays: searchQuick(playbooks, query, side, scope, SEARCH_LIMIT) };
}

function playbookOutline({ side, playbook }, { playbooks }) {
  const books = playbooks.filter((pb) => pb.type === side);
  if (!playbook) return { books: books.map((pb) => pb.name) };
  const book = books.find((pb) => pb.name === playbook);
  if (!book) throw new Error(`No ${side} playbook named "${playbook}".`);
  return {
    playbook,
    groups: (book.formationGroups || []).map((g) => ({
      name: g.name,
      formations: (g.formations || []).map((f) => ({ name: f.name, plays: f.plays?.length || 0 })),
    })),
  };
}

function debriefs({ limit }, { debriefs: rows }) {
  const n = Math.min(Math.max(limit || 10, 1), MAX_DEBRIEFS);
  return { total: rows.length, games: rows.slice(0, n) };
}

async function gamePlan({ side }, { game, plans, loadGuide }) {
  const forGame = plans.filter((p) => p.game === game);
  return {
    plans: await Promise.all(
      forGame.map(async (p) => ({
        name: p.name,
        guide: p.guide ? await loadGuide(p.guide) : null,
        blocks: p[side] || {},
      })),
    ),
  };
}

function packages(_, { packages: list, arsenal }) {
  return {
    packages: list.map((p) => ({
      id: p.id,
      name: p.name,
      side: p.side,
      tagline: p.tagline,
      playbook: p.playbook,
      base: p.base,
      counters: p.counters,
      user: p.user,
      inArsenal: Boolean(arsenal?.slots?.[p.id]?.active ?? p.active),
    })),
  };
}

function propose({ side, summary, changes }, { game, playbooks, sheet }) {
  const { errors, changes: hydrated } = validateProposal({ side, changes }, playbooks, sheet);
  if (errors.length) throw new Error(errors.join(' '));
  return {
    proposal: { game, side, summary, changes: hydrated, status: 'open' },
    result: 'Shown to Kenny as a card. Not applied unless a later message says so.',
  };
}

const RUNNERS = {
  get_call_sheet: callSheet,
  search_plays: searchPlays,
  get_playbook_outline: playbookOutline,
  get_debriefs: debriefs,
  get_game_plan: gamePlan,
  get_trends: (_, { loadTrends }) => loadTrends(),
  get_packages: packages,
  propose_sheet_changes: propose,
};

// Any failure goes back to Claude as an error result it can act on, because an
// unanswered tool_use would make every later request in the thread invalid.
export async function runTool(block, ctx) {
  const reply = (content, is_error) => ({
    type: 'tool_result',
    tool_use_id: block.id,
    content,
    ...(is_error ? { is_error } : {}),
  });
  const runner = RUNNERS[block.name];
  if (!runner) return { result: reply(`Unknown tool ${block.name}`, true) };
  try {
    const out = await runner(block.input, ctx);
    if (out?.proposal) return { result: reply(out.result), proposal: out.proposal };
    return { result: reply(JSON.stringify(out)) };
  } catch (err) {
    return { result: reply(err.message, true) };
  }
}

// After a mid-stream fallback, blocks before the last fallback marker can't be
// sent back except text. See the Claude API docs on refusals and fallback.
export function contentForHistory(content) {
  const last = content.map((b) => b.type).lastIndexOf('fallback');
  if (last === -1) return content;
  return content.filter((b, i) => i > last || b.type === 'text');
}
