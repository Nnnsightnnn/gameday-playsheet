// The browser side of Claude's tools. The sheet and debriefs exist only in this
// browser, so tools run here against a context the panel loads fresh per turn.

import { SITUATIONS } from '../../data/situations';
import { COVERAGES } from '../coverage/coverages';
import { arsenalChecks, metaCoverage, resolveArsenal } from '../packages/engine';
import { META_THREATS } from '../packages/metas';
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

// Every play in one formation, so Claude can read a formation's whole menu
// instead of guessing search words.
function formationPlays({ side, playbook, formation }, { playbooks }) {
  const book = playbooks.find((pb) => pb.type === side && pb.name === playbook);
  if (!book) throw new Error(`No ${side} playbook named "${playbook}".`);
  for (const g of book.formationGroups || []) {
    const f = (g.formations || []).find((x) => x.name === formation);
    if (f) {
      return {
        playbook,
        group: g.name,
        formation,
        plays: (f.plays || []).map((p) => ({ playId: p.id, name: p.name, type: p.type })),
      };
    }
  }
  throw new Error(`No formation "${formation}" in ${playbook}. Check get_playbook_outline.`);
}

const MAX_ART_PER_CALL = 6;

// Finds what the art lookup needs. The sheet stores only the play id.
function locatePlay(playbooks, playId) {
  for (const pb of playbooks) {
    for (const g of pb.formationGroups || []) {
      for (const f of g.formations || []) {
        const p = (f.plays || []).find((x) => x.id === playId);
        if (p) return { book: pb.id, formation: f.slug, play: p.slug, name: p.name, formationName: f.name };
      }
    }
  }
  return null;
}

// Each play reports on its own, so one missing image doesn't cost the rest.
async function playArt({ playIds }, { game, playbooks, loadArt }) {
  if (game !== 'madden') {
    throw new Error('Play art is only available for Madden. Ask Kenny to paste a screenshot of the play.');
  }
  if (playIds.length > MAX_ART_PER_CALL) {
    throw new Error(`Ask for at most ${MAX_ART_PER_CALL} plays per call.`);
  }
  const blocks = [];
  for (const playId of playIds) {
    const found = locatePlay(playbooks, playId);
    if (!found) {
      blocks.push({ type: 'text', text: `${playId}: not in this game's catalog.` });
      continue;
    }
    const label = `${found.name} (${found.formationName}, ${playId})`;
    try {
      const { media_type, data } = await loadArt(found);
      blocks.push({ type: 'text', text: label });
      blocks.push({ type: 'image', source: { type: 'base64', media_type, data } });
    } catch (err) {
      blocks.push({ type: 'text', text: `${label}: ${err.message}` });
    }
  }
  return { apiContent: blocks };
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

function packages(_, { game, packages: list, arsenal }) {
  const slots = resolveArsenal(list, arsenal?.slots);
  const gaps = (side) =>
    metaCoverage(list, slots, game, side)
      .filter((c) => c.gap)
      .map((c) => c.threat.name);
  return {
    packages: list.map((p) => ({ ...p, slot: slots[p.id]?.slot ?? null, active: Boolean(slots[p.id]?.active) })),
    uncoveredThreats: { offense: gaps('offense'), defense: gaps('defense') },
  };
}

function metaThreats(_, { game }) {
  return { threats: META_THREATS.filter((t) => t.game === game) };
}

function coverage({ id }) {
  if (!id) return { ids: Object.keys(COVERAGES) };
  if (!COVERAGES[id]) throw new Error(`No coverage "${id}". Pass an empty id to list them.`);
  return COVERAGES[id];
}

function personnel({ side }, { game, personnelPlans, personnelCharts }) {
  return {
    plans: personnelPlans
      .filter((p) => p.game === game)
      .map((p) => ({ ...p, roles: (p.roles || []).filter((r) => !r.side || r.side === side) })),
    savedCharts: personnelCharts.filter((c) => c.game === game),
  };
}

function practiceState(_, { game, labPlans, assessments, savedSheets }) {
  return {
    labPlan: labPlans[0] ?? null,
    latestAssessment: assessments[0] ?? null,
    savedSheets: savedSheets.filter((s) => s.game === game).map((s) => s.name),
  };
}

async function saveSheet({ name }, { game, sheet, saveSheet: save }) {
  await save({ name, game, offense: sheet?.offense || {}, defense: sheet?.defense || {} });
  return { saved: name };
}

async function setArsenal({ packageId, slot, active }, { game, packages: list, arsenal, saveSlot }) {
  const pkg = list.find((p) => p.id === packageId);
  if (!pkg) throw new Error(`No package "${packageId}" for this game.`);
  const patch = slot ? { slot, active } : { slot: null, active: false };
  const next = resolveArsenal(list, { ...arsenal?.slots, [packageId]: patch });
  const errors = arsenalChecks(list, next).filter((c) => c.side === pkg.side && c.level === 'error');
  if (errors.length) throw new Error(errors.map((e) => e.msg).join(' '));
  await saveSlot(game, packageId, patch);
  return { package: pkg.name, ...patch };
}

// Validates only. The panel writes the change and reports what landed, so this
// stays free of the database.
function changeSheet({ side, summary, changes }, { game, playbooks, sheet }) {
  const { errors, changes: hydrated } = validateProposal({ side, changes }, playbooks, sheet);
  if (errors.length) throw new Error(errors.join(' '));
  return { change: { game, side, summary, changes: hydrated } };
}

const RUNNERS = {
  get_call_sheet: callSheet,
  search_plays: searchPlays,
  get_playbook_outline: playbookOutline,
  get_formation_plays: formationPlays,
  get_play_art: playArt,
  get_debriefs: debriefs,
  get_game_plan: gamePlan,
  get_trends: (_, { loadTrends }) => loadTrends(),
  get_packages: packages,
  get_meta_threats: metaThreats,
  list_research: (_, { loadResearch }) => loadResearch(),
  read_research: ({ path }, { loadResearch }) => loadResearch(path),
  get_scouting: ({ team }, { game, loadScouting }) => {
    if (game !== 'madden') throw new Error('Scouting covers Madden opponents only.');
    return loadScouting(team);
  },
  get_personnel: personnel,
  get_practice_state: practiceState,
  get_coverage: coverage,
  save_call_sheet: saveSheet,
  set_package_arsenal: setArsenal,
  change_sheet: changeSheet,
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
    if (out?.apiContent) return { result: reply(out.apiContent) };
    if (out?.change) return { result: reply('Applied.'), change: out.change };
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
