// manifest.js — load, validate, and normalise a presentation manifest.
//
// Two schema versions are accepted; both normalise to the same internal shape.
//
// p2present.json v1.0 (canonical — see SPEC.md / docs/p2present.schema.json):
// {
//   "p2present": "1.0",
//   "title": "...",
//   "meta": { "author":"", "event":"", "date":"", "description":"" },
//   "video": { "sources": [ {"provider":"youtube|mp4|webtorrent|ipfs","src":"..."} ], "poster":"" },
//   "deck":  { "type":"html|pdf", "sources":[ {"src":"..."} ], "slideCount": N },
//   "timing": [ {"time":0.0,"slide":1,"transition":"cut"} ]   // or "timing":"timing.json"
//   "subtitles": [ {"lang":"en","label":"English","src":"...vtt","format":"vtt|srt","default":true} ],
//   "resolvers": { "ipfsGateways":["..."], "webtorrentTrackers":["..."] },
//   "layout": { "split":0.6, "mode":"split", "transition":"fade" }
// }
//
// v0 (legacy — still supported):
// {
//   "title": "...",
//   "video": { "provider": "youtube|mp4", "src": "<id-or-url>" },
//   "deck":  { "type": "html|pdf", "src": "slides/index.html" },
//   "sync":  [ { "time": 0.0, "slide": 1, "transition": "cut" }, ... ]
// }
//
// `time` may be a float (seconds) or an "HH:MM:SS.mmm" string; we normalise it
// to float seconds. Relative `src` paths resolve against the manifest URL so
// content can live on any remote host (the resolver use case).

import { parseTime } from './time.js';

const DEFAULT_IPFS_GATEWAYS = [
  'https://{cid}.ipfs.dweb.link',
  'https://ipfs.io/ipfs/{cid}',
  'https://cloudflare-ipfs.com/ipfs/{cid}',
];
const DEFAULT_WEBTORRENT_TRACKERS = [
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.webtorrent.dev',
];
const LAYOUT_MODES = ['split', 'slides-focus', 'video-focus', 'overlap'];

/**
 * Fetch + parse + normalise a manifest from a URL.
 * Resolves an external `timing` file if the manifest points to one.
 * @param {string} url absolute or relative URL to a manifest.json
 * @returns {Promise<object>} normalised manifest with absolute asset URLs
 */
export async function loadManifest(url) {
  const manifestUrl = new URL(url, window.location.href).href;
  const raw = await fetchJson(manifestUrl, 'manifest');

  // `timing` may be an inline array OR a string path to an external JSON file.
  if (typeof raw.timing === 'string') {
    const timingUrl = new URL(raw.timing, manifestUrl).href;
    let timing = await fetchJson(timingUrl, 'timing file');
    if (timing && !Array.isArray(timing) && Array.isArray(timing.timing)) timing = timing.timing;
    if (!Array.isArray(timing)) {
      throw new Error(`External timing file must be a JSON array (or {"timing":[…]}): ${timingUrl}`);
    }
    raw.timing = timing;
  }

  return normaliseManifest(raw, manifestUrl);
}

async function fetchJson(fetchUrl, what) {
  let res;
  try {
    res = await fetch(fetchUrl, { mode: 'cors' });
  } catch (err) {
    throw new Error(`Could not fetch ${what} (${fetchUrl}): ${err.message}. ` +
      `If it lives on another host, that host must send CORS headers.`);
  }
  if (!res.ok) throw new Error(`${what} fetch failed: HTTP ${res.status} for ${fetchUrl}`);
  try {
    return await res.json();
  } catch (err) {
    throw new Error(`${what} is not valid JSON (${fetchUrl}): ${err.message}`);
  }
}

/**
 * Validate + normalise a raw manifest object (v0 or v1) into the internal shape.
 * @param {object} raw
 * @param {string} baseUrl URL the manifest was loaded from (for resolving src)
 * @returns {object}
 */
export function normaliseManifest(raw, baseUrl = window.location.href) {
  if (!raw || typeof raw !== 'object') throw new Error('Manifest must be an object.');
  if (!raw.video || typeof raw.video !== 'object') throw new Error('Manifest.video is required.');
  if (!raw.deck || typeof raw.deck !== 'object') throw new Error('Manifest.deck is required.');

  const version = raw.p2present ? String(raw.p2present)
    : (Array.isArray(raw.video.sources) || raw.timing !== undefined) ? '1.0' : '0';

  // --- video: normalise to an ordered fallback list of sources ---
  const videoSources = normaliseVideoSources(raw.video, baseUrl);
  if (!videoSources.length) {
    throw new Error('Manifest.video needs at least one source (provider + src).');
  }
  const poster = raw.video.poster ? resolveSrc(raw.video.poster, baseUrl) : undefined;

  // --- deck: normalise to an ordered fallback list of source URLs ---
  if (!raw.deck.type) throw new Error('Manifest.deck.type is required.');
  const deckSources = normaliseDeckSources(raw.deck, baseUrl);
  if (!deckSources.length) {
    throw new Error('Manifest.deck needs at least one source (src).');
  }
  const slideCount = Number.isFinite(Number(raw.deck.slideCount))
    ? Math.floor(Number(raw.deck.slideCount)) : undefined;

  // --- timing / sync cues (inline array; external files resolved in loadManifest) ---
  const rawCues = Array.isArray(raw.timing) ? raw.timing
    : Array.isArray(raw.sync) ? raw.sync : [];
  const sync = rawCues.map((cue, i) => normaliseCue(cue, i)).sort((a, b) => a.time - b.time);

  // --- subtitles ---
  const subtitles = (Array.isArray(raw.subtitles) ? raw.subtitles : [])
    .map((s, i) => normaliseSubtitle(s, i, baseUrl))
    .filter(Boolean);

  // --- resolvers (override defaults the phase-2 providers consume) ---
  const resolvers = {
    ipfsGateways: arrayOfStrings(raw.resolvers?.ipfsGateways) || DEFAULT_IPFS_GATEWAYS,
    webtorrentTrackers: arrayOfStrings(raw.resolvers?.webtorrentTrackers) || DEFAULT_WEBTORRENT_TRACKERS,
  };

  // --- layout ---
  const layout = normaliseLayout(raw.layout);

  // --- meta ---
  const meta = {
    author: str(raw.meta?.author),
    event: str(raw.meta?.event),
    date: str(raw.meta?.date),
    description: str(raw.meta?.description),
  };

  return {
    version,
    title: typeof raw.title === 'string' ? raw.title : 'Untitled presentation',
    meta,
    video: { sources: videoSources, poster },
    deck: { type: String(raw.deck.type), sources: deckSources, slideCount, ...stripKnownDeck(raw.deck) },
    sync,
    subtitles,
    resolvers,
    layout,
    baseUrl,
    _raw: raw,
  };
}

function normaliseVideoSources(video, baseUrl) {
  let list;
  if (Array.isArray(video.sources)) {
    list = video.sources;
  } else if (video.provider && video.src != null) {
    list = [{ provider: video.provider, src: video.src }];
  } else {
    list = [];
  }
  return list
    .filter((s) => s && s.provider && s.src != null)
    .map((s) => ({
      provider: String(s.provider),
      // mp4 (and other file-based) srcs resolve against the base; ids/magnets/cids stay verbatim.
      src: s.provider === 'mp4' ? resolveSrc(String(s.src), baseUrl) : String(s.src),
    }));
}

function normaliseDeckSources(deck, baseUrl) {
  let list;
  if (Array.isArray(deck.sources)) {
    list = deck.sources;
  } else if (deck.src != null) {
    list = [{ src: deck.src }];
  } else {
    list = [];
  }
  return list
    .filter((s) => s && s.src != null)
    .map((s) => ({ src: resolveSrc(String(s.src), baseUrl) }));
}

function normaliseCue(cue, i) {
  if (!cue || typeof cue !== 'object') throw new Error(`timing[${i}] must be an object.`);
  const slide = Number(cue.slide);
  if (!Number.isFinite(slide) || slide < 1) {
    throw new Error(`timing[${i}].slide must be a 1-based integer (got ${cue.slide}).`);
  }
  return {
    time: parseTime(cue.time),
    slide: Math.floor(slide),
    transition: cue.transition || 'cut',
    label: typeof cue.label === 'string' ? cue.label : undefined,
  };
}

function normaliseSubtitle(s, i, baseUrl) {
  if (!s || typeof s !== 'object' || !s.src) return null;
  const src = resolveSrc(String(s.src), baseUrl);
  let format = s.format ? String(s.format).toLowerCase() : '';
  if (format !== 'vtt' && format !== 'srt') {
    format = /\.srt(\?|#|$)/i.test(src) ? 'srt' : 'vtt';
  }
  return {
    lang: s.lang ? String(s.lang) : `track-${i + 1}`,
    label: s.label ? String(s.label) : (s.lang ? String(s.lang) : `Track ${i + 1}`),
    src,
    format,
    default: !!s.default,
  };
}

function normaliseLayout(layout = {}) {
  let split = Number(layout.split);
  if (!Number.isFinite(split)) split = 0.6;
  split = Math.min(0.85, Math.max(0.15, split));
  const mode = LAYOUT_MODES.includes(layout.mode) ? layout.mode : 'split';
  const transition = typeof layout.transition === 'string' ? layout.transition : 'fade';
  return { split, mode, transition };
}

// Resolve a src that looks like a path/URL; leave bare tokens (ids) untouched.
function resolveSrc(src, baseUrl) {
  if (typeof src !== 'string') return src;
  if (/^[a-z]+:\/\//i.test(src) || src.startsWith('/') || src.startsWith('./') ||
      src.includes('/') || /\.[a-z0-9]+$/i.test(src)) {
    return new URL(src, baseUrl).href;
  }
  return src;
}

// Carry through any extra deck keys (adapter hints) without the known ones.
function stripKnownDeck(deck) {
  const { type, src, sources, slideCount, ...rest } = deck;
  return rest;
}

function arrayOfStrings(v) {
  if (!Array.isArray(v)) return null;
  const out = v.filter((x) => typeof x === 'string' && x.trim());
  return out.length ? out : null;
}

function str(v) { return typeof v === 'string' ? v : ''; }
