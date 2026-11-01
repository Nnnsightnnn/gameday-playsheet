// Local-only bridge between the playsheet and the Claude API, so the API key
// never reaches the browser or the deployed site. It holds no conversation:
// the browser keeps the history and runs the tools, because the sheet and the
// debriefs live in that browser's IndexedDB. Start with `npm run chat`.

import { spawn } from 'node:child_process';
import http from 'node:http';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, TOOLS } from './prompt.mjs';
import { PORT, originAllowed, requestAllowed } from './requestGate.mjs';

const MODEL = 'claude-opus-5-5';
const MAX_BODY_BYTES = 8 * 1024 * 1024;

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('No ANTHROPIC_API_KEY. Start this with `npm run chat`, which loads it through withapi.');
  process.exit(1);
}

const client = new Anthropic();

function corsHeaders(origin) {
  return originAllowed(origin)
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Private-Network': 'true',
        Vary: 'Origin',
      }
    : {};
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Conversation is too large. Start a new chat.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// Same ledger as every other API job, so the credit estimate stays honest. A
// missing receipt must never break a chat, so failures are ignored.
function logReceipt(message) {
  const receipt = spawn('apireceipt', ['log', '--label', 'gameday-chat'], {
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  receipt.on('error', () => {});
  receipt.stdin.on('error', () => {});
  receipt.stdin.end(JSON.stringify(message));
}

// Only what the panel draws, plus the complete final message for the history.
function translate(event) {
  if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    return { t: 'text', d: event.delta.text };
  }
  if (event.type === 'content_block_delta' && event.delta.type === 'thinking_delta') {
    return { t: 'note', d: event.delta.thinking };
  }
  if (event.type === 'content_block_start' && event.content_block.type === 'tool_use') {
    return { t: 'tool', name: event.content_block.name };
  }
  return null;
}

async function handleChat(req, res, headers) {
  let messages;
  try {
    ({ messages } = JSON.parse(await readBody(req)));
  } catch (err) {
    res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
    return;
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'messages must be a non-empty array' }));
    return;
  }

  res.writeHead(200, { ...headers, 'Content-Type': 'application/x-ndjson' });
  const send = (obj) => res.write(JSON.stringify(obj) + '\n');

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    system: SYSTEM_PROMPT,
    tools: TOOLS,
    messages,
    cache_control: { type: 'ephemeral' },
    thinking: { type: 'adaptive', display: 'updates' },
    output_config: { effort: 'high' },
    fallbacks: 'default',
    betas: ['server-side-fallback-2026-07-01', 'thinking-display-updates-2026-08-18'],
  });

  let finished = false;
  res.on('close', () => {
    if (!finished) stream.abort();
  });

  try {
    for await (const event of stream) {
      const out = translate(event);
      if (out) send(out);
    }
    const message = await stream.finalMessage();
    finished = true;
    logReceipt(message);
    send({ t: 'final', message });
  } catch (err) {
    finished = true;
    if (err instanceof Anthropic.APIUserAbortError) {
      console.log('Turn stopped from the panel.');
    } else {
      const status = err instanceof Anthropic.APIError ? err.status : undefined;
      console.error('Chat turn failed:', status ?? '', err.message);
      send({ t: 'error', status, message: err.message });
    }
  }
  res.end();
}

const server = http.createServer(async (req, res) => {
  const headers = corsHeaders(req.headers.origin);
  if (!requestAllowed(req.headers)) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
  } else if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, model: MODEL }));
  } else if (req.method === 'POST' && req.url === '/chat') {
    await handleChat(req, res, headers);
  } else {
    res.writeHead(404, headers);
    res.end();
  }
});

server.on('error', (err) => {
  console.error(
    err.code === 'EADDRINUSE'
      ? `Port ${PORT} is already in use, so the chat server is probably running.`
      : err.message,
  );
  process.exit(1);
});

// 127.0.0.1 only: nothing else on the network can reach this.
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Playsheet chat server on http://127.0.0.1:${PORT} using ${MODEL}. Close this window to stop it.`);
});
