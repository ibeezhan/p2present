// service.js — client for the p2present "pastebin-lite" backend (the optional
// community-hosting service; see /service + SERVICE.md). Everything here is a
// thin wrapper over fetch; the app stays fully usable without a service (you can
// still paste a URL / ipfs:// / magnet:, or host your own).
//
// Base URL precedence (first match wins), so self-hosters can point the app at
// their own deployment without editing code:
//   1. ?service=<base>                    (per-link override; handy for testing)
//   2. window.__P2_SERVICE_BASE           (set by an inline <script> before this)
//   3. <meta name="p2present:service">    (set in the page <head>)
//   4. localStorage['p2present:service']  (sticky per-browser override)
//   5. DEFAULT_SERVICE_BASE               (the placeholder community backend)

export const DEFAULT_SERVICE_BASE = 'https://p2present.com';

const TOKENS_KEY = 'p2present:tokens';

const trim = (s) => String(s).replace(/\/+$/, '');

/** Resolve the configured service base URL (no trailing slash). */
export function serviceBase() {
  try {
    const q = new URLSearchParams(location.search).get('service');
    if (q) return trim(q);
  } catch { /* no location (tests) */ }
  if (typeof window !== 'undefined' && window.__P2_SERVICE_BASE) return trim(window.__P2_SERVICE_BASE);
  try {
    const meta = document.querySelector('meta[name="p2present:service"]')?.content;
    if (meta) return trim(meta);
  } catch { /* no document */ }
  try {
    const ls = localStorage.getItem('p2present:service');
    if (ls) return trim(ls);
  } catch { /* storage blocked */ }
  return DEFAULT_SERVICE_BASE;
}

/** True when a non-empty base is configured (it always is, given the default). */
export function isServiceConfigured() { return !!serviceBase(); }

/** The API URL the player fetches a manifest from. */
export function manifestApiUrl(id, base = serviceBase()) {
  return `${base}/api/p/${encodeURIComponent(id)}`;
}

/** The human-facing short link (redirects into the player). */
export function shareUrl(id, base = serviceBase()) {
  return `${base}/p/${encodeURIComponent(id)}`;
}

/**
 * Save a manifest to the service. Returns { id, editToken, url, manifestUrl, ... }.
 * Remembers the edit token in this browser so the author can update it later.
 */
export async function saveManifest(manifest, { visibility = 'unlisted', ttl } = {}, base = serviceBase()) {
  const params = new URLSearchParams();
  if (visibility) params.set('visibility', visibility);
  if (ttl) params.set('ttl', String(ttl));
  const qs = params.toString();
  let res;
  try {
    res = await fetch(`${base}/api/p${qs ? '?' + qs : ''}`, {
      method: 'POST', mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(manifest),
    });
  } catch (err) {
    throw new Error(`Could not reach the sharing service at ${base}. ${err.message}`);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(formatError(data, res.status));
  if (data.id && data.editToken) rememberToken(data.id, data.editToken);
  return data;
}

/** Update an existing manifest (needs the edit token from this browser). */
export async function updateManifest(id, manifest, { visibility } = {}, token = recallToken(id), base = serviceBase()) {
  if (!token) throw new Error('No edit token for this id in this browser (only the creator can update).');
  const params = new URLSearchParams();
  if (visibility) params.set('visibility', visibility);
  const qs = params.toString();
  const res = await fetch(`${manifestApiUrl(id, base)}${qs ? '?' + qs : ''}`, {
    method: 'PUT', mode: 'cors',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(manifest),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(formatError(data, res.status));
  return data;
}

/** Report a manifest id for abuse. Returns true on success. */
export async function reportManifest(id, reason, base = serviceBase()) {
  try {
    const res = await fetch(`${base}/api/report`, {
      method: 'POST', mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, reason }),
    });
    return res.ok;
  } catch { return false; }
}

function formatError(data, status) {
  if (data && data.error) {
    const map = {
      rate_limited: 'Rate limit hit — please wait a bit before saving again.',
      too_large: `Manifest is too large${data.max ? ` (max ${Math.round(data.max / 1024)} KB)` : ''}.`,
      invalid_manifest: `Manifest looks invalid${data.detail ? `: ${data.detail}` : ''}.`,
      invalid_json: 'Manifest is not valid JSON.',
      forbidden: 'Not authorized (wrong or missing edit token).',
      not_found: 'No saved presentation with that id.',
      expired: 'That shared presentation has expired.',
      unavailable: 'That shared presentation is no longer available.',
    };
    return map[data.error] || `${data.error}${data.detail ? `: ${data.detail}` : ''}`;
  }
  return `Service error (HTTP ${status}).`;
}

// --- edit-token bookkeeping (author-local) ----------------------------------

function rememberToken(id, token) {
  try {
    const m = JSON.parse(localStorage.getItem(TOKENS_KEY) || '{}');
    m[id] = token;
    localStorage.setItem(TOKENS_KEY, JSON.stringify(m));
  } catch { /* storage blocked — token is still returned to the caller */ }
}

export function recallToken(id) {
  try { return JSON.parse(localStorage.getItem(TOKENS_KEY) || '{}')[id] || null; }
  catch { return null; }
}
