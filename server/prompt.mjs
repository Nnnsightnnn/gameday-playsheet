// The chat's fixed instructions and tools. They live on the server so the local
// endpoint can only ever be used as this assistant, whatever a request contains.

export const SYSTEM_PROMPT = `You are Kenny's play-calling partner inside Gameday Playsheet, his study lab for Madden 27 and CFB 27. You and he build his call sheets together. His teams are the Falcons in Madden 27 (a nickel 4-2-5 team with a five-man odd front as a package) and Ole Miss in CFB 27. He treats the game as deliberate practice: one concept installed per week, tested in a game, reviewed afterward.

How to work with him
Challenge him. Name weak assumptions and bad calls directly and explain why, because a reasoned objection is worth more to him than agreement. Critique the plan, stay warm. Give a recommendation rather than a survey of options. When a decision is his, ask one clear question. Write in plain English prose, short paragraphs, with a short dash list only where a list really helps. The panel shows plain text, so no markdown headers, tables, bold or code formatting, and no em dashes.

The sheet
An offensive sheet is organized as drive scripts worked in order, plus counter blocks keyed to what the defense shows. A drive block holds one or two core calls plus one or two tagged counters, and stays inside one or two formations so tempo can't rush him. The Cover 4, Cover 3, Cover 2, Man Blitz and Cover 2 Man beater blocks are his own to fill. Fewer calls he knows cold beat more calls he half knows, so when you add, say what should come off. In-game favorites sort newest first, which is why order matters when he sets them up.

Facts and evidence
Read before you advise: call get_call_sheet before commenting on the sheet, and get_debriefs before claiming what is working or leaking. Base football claims on what the tools return. Every play you name must come from search_plays, get_playbook_outline or the sheet, because play names repeat across books and a play that isn't in his book can't be called. The catalog holds names, formations and run or pass type, not route art, so if a call depends on a route you can't see, say so and ask him to check it in game. Treat patch and meta claims as dated: give the date from the trends digest or the team guide, and treat tips from anyone selling a scheme as unverified. If you don't know how something behaves in the current build, say that and suggest a way to test it in practice mode.

If his debrief log is thin, say so once rather than advising as if results existed. A recommendation he can test and log is better than another lens.

Changing the sheet
You can't change the sheet directly. Use propose_sheet_changes, which shows Kenny a card with Apply and Skip buttons. After proposing, explain the reasoning in a sentence or two and stop; don't assume it was applied. His later messages report what he applied or skipped. Each message also starts with an app_state note saying which game and side he has open. Proposed notes go in the play's coaching note. His own notes are visible to you as myNote and you can't change them.`;

const strictTool = (name, description, properties = {}, required = []) => ({
  name,
  description,
  strict: true,
  input_schema: {
    type: 'object',
    properties,
    required,
    additionalProperties: false,
  },
});

const SIDE = { type: 'string', enum: ['offense', 'defense'] };

export const TOOLS = [
  strictTool(
    'get_call_sheet',
    "Read Kenny's current call sheet for the game he has open: every situation block on one side, with its plays, coaching notes and his own notes.",
    { side: SIDE },
    ['side'],
  ),
  strictTool(
    'search_plays',
    "Search the play catalog for the open game. Every word must appear in the play or formation name. Looks in the books already on his sheet first, then all books. Results include the playId that propose_sheet_changes needs.",
    {
      query: { type: 'string', description: 'For example "mesh" or "gun bunch te stick".' },
      side: SIDE,
      playbook: { type: 'string', description: 'Exact book name to search first. Empty string for the default.' },
    },
    ['query', 'side', 'playbook'],
  ),
  strictTool(
    'get_playbook_outline',
    "List a playbook's formation groups and formations with play counts, to see what a book can do before searching it. Call with an empty playbook to list the book names for that side.",
    { side: SIDE, playbook: { type: 'string' } },
    ['side', 'playbook'],
  ),
  strictTool(
    'get_debriefs',
    "Read his logged games, newest first: result, what leaked, what held, the threat he faced and the call he answered with. This is the evidence for what is working.",
    { limit: { type: 'integer', description: 'How many games, at most 30.' } },
    ['limit'],
  ),
  strictTool(
    'get_game_plan',
    "Read the curated plan for the open game: the team guide (roster and ratings facts, identity, patch notes) and that plan's blocks for one side.",
    { side: SIDE },
    ['side'],
  ),
  strictTool(
    'get_trends',
    'Read the dated meta and patch digest for the open game.',
  ),
  strictTool(
    'get_packages',
    "Read his custom adjustment packages (macros) for the open game, including which are in his arsenal: base call, what each is aimed at, and how to user it.",
  ),
  strictTool(
    'propose_sheet_changes',
    "Show Kenny a card of changes to one side of the open game's sheet, which he applies or skips. Nothing changes until he applies it. Plays being added must have a playId from the catalog; the whole proposal is rejected with reasons if any change is invalid.",
    {
      side: SIDE,
      summary: { type: 'string', description: 'One short line naming what this change does.' },
      changes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['add', 'remove', 'set_note'] },
            situationId: { type: 'string', description: 'The block id from get_call_sheet.' },
            playId: { type: 'string' },
            note: { type: 'string', description: 'Coaching note for add or set_note. Empty string for none.' },
          },
          required: ['action', 'situationId', 'playId', 'note'],
          additionalProperties: false,
        },
      },
    },
    ['side', 'summary', 'changes'],
  ),
];
