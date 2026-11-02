import { describe, expect, it } from 'vitest';
import { runTool } from '../tools';

const use = (name, input) => ({ type: 'tool_use', id: 'toolu_1', name, input });

// The API rejects a tool_result whose array content holds anything but typed
// blocks, and that one bad result breaks every later request in the thread.
function expectValidContent(result) {
  const { content } = result;
  if (typeof content === 'string') return;
  expect(Array.isArray(content)).toBe(true);
  for (const block of content) expect(['text', 'image']).toContain(block.type);
}

describe('runTool result shape', () => {
  it('sends the call sheet as text even though it has situation blocks', async () => {
    const { result } = await runTool(use('get_call_sheet', { side: 'offense' }), {
      game: 'madden',
      sheet: { offense: {} },
    });
    expectValidContent(result);
    expect(typeof result.content).toBe('string');
    expect(JSON.parse(result.content).blocks.length).toBeGreaterThan(0);
  });

  it('sends play art as typed text and image blocks', async () => {
    const playbooks = [
      {
        id: 'falcons',
        type: 'offense',
        formationGroups: [
          { formations: [{ name: 'Gun Bunch', slug: 'gun-bunch', plays: [{ id: 'p1', name: 'Mesh', slug: 'mesh' }] }] },
        ],
      },
    ];
    const { result } = await runTool(use('get_play_art', { playIds: ['p1'] }), {
      game: 'madden',
      playbooks,
      loadArt: async () => ({ media_type: 'image/jpeg', data: 'abc' }),
    });
    expectValidContent(result);
    expect(result.content.map((b) => b.type)).toEqual(['text', 'image']);
  });
});
