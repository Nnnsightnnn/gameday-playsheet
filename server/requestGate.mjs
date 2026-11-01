// Who may talk to the local chat server. The server spends real API credit, and
// any web page open in the browser can try to reach 127.0.0.1, so the check runs
// on the server, not only through CORS: a plain cross-site POST never preflights.

export const PORT = 5199;

const ALLOWED_ORIGINS = new Set([
  'https://nnnsightnnn.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

const ALLOWED_HOSTS = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`]);

export function originAllowed(origin) {
  return ALLOWED_ORIGINS.has(origin);
}

// The Host check stops DNS rebinding, where a hostile name resolves to 127.0.0.1.
export function requestAllowed(headers) {
  return originAllowed(headers.origin) && ALLOWED_HOSTS.has(headers.host);
}
