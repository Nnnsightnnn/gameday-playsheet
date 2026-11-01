// Talks to the local chat server (server/chat-server.mjs). The panel only exists
// for a browser that has opted in, because probing localhost makes Chromium ask
// for local network permission, and no other visitor should ever see that prompt.

const SERVER = 'http://127.0.0.1:5199';
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
