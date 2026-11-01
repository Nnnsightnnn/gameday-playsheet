// Talks to the local chat server (server/chat-server.mjs). The panel only exists
// for a browser that has opted in, because probing localhost makes Chromium ask
// for local network permission, and no other visitor should ever see that prompt.

// localhost, not 127.0.0.1: Comet fails the IP instantly from an https page, with no
// permission prompt, while the name gets the local network prompt.
const SERVER = 'http://localhost:5199';
const OPT_IN_KEY = 'gameday-chat';

export function chatOptedIn() {
  if (import.meta.env.DEV) return true;
  try {
    if (new URLSearchParams(window.location.search).has('chat')) {
      window.localStorage.setItem(OPT_IN_KEY, '1');
      return true;
    }
    return window.localStorage.getItem(OPT_IN_KEY) === '1';
  } catch {
    return false;
  }
}

export async function serverIsUp() {
  try {
    const r = await fetch(`${SERVER}/health`);
    return r.ok;
  } catch {
    return false;
  }
}

export async function fetchResearch(file) {
  const query = file ? `?path=${encodeURIComponent(file)}` : '';
  const r = await fetch(`${SERVER}/research${query}`);
  const body = await r.json();
  if (!r.ok) throw new Error(body.error);
  return body;
}

export async function fetchArt({ book, formation, play }) {
  const query = new URLSearchParams({ book, formation, play });
  const r = await fetch(`${SERVER}/art?${query}`);
  const body = await r.json();
  if (!r.ok) throw new Error(body.error);
  return body;
}

// One model turn. Calls onEvent for each streamed piece and resolves with the
// complete message.
export async function streamTurn(messages, onEvent, signal) {
  const r = await fetch(`${SERVER}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!r.ok) throw new Error(`Chat server said ${r.status}.`);

  const reader = r.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  let final = null;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line) continue;
      const event = JSON.parse(line);
      if (event.t === 'final') final = event.message;
      else if (event.t === 'error') throw new Error(event.message);
      else onEvent(event);
    }
  }
  if (!final) throw new Error('The chat server stopped before the turn finished.');
  return final;
}
