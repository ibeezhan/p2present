// subtitles.js — caption loading + rendering.
//
// Loads the manifest's subtitles[] (WebVTT or SubRip/.srt — .srt is converted to
// WebVTT in-browser at load), and renders them two ways depending on the video:
//
//   * Native <track>  — when the provider exposes a real <video> element (mp4),
//                       captions are attached as <track kind="subtitles"> and the
//                       browser renders/styles them. Switching language flips the
//                       active track's `mode` to "showing".
//   * Synced overlay  — for providers without a <video> element (YouTube iframe,
//                       which can't accept external tracks), we render an overlay
//                       div and drive it from the sync clock: update(time) shows
//                       the cue active at that time.
//
// A SubtitleController is created per presentation by the Player, which calls
// update(time) every frame from its state callback and exposes list()/setActive()
// to the CC menu.

import { parseTime } from './time.js';

export class SubtitleController {
  /** @param {{tracks:Array, video:object, mount:HTMLElement}} opts */
  constructor({ tracks, video, mount }) {
    this.tracks = Array.isArray(tracks) ? tracks : [];
    this.video = video;
    this.mount = mount;
    this.entries = [];        // {lang,label,default,cues,vttText,trackEl?}
    this.activeLang = null;
    this.activeEntry = null;
    this._blobUrls = [];
    this._native = false;
    this._listeners = [];
  }

  on(fn) { this._listeners.push(fn); return this; }
  _emit() { this._listeners.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } }); }

  hasTracks() { return this.entries.length > 0; }

  /** Fetch + parse every subtitle source, then wire up the right renderer. */
  async load() {
    const loaded = await Promise.all(this.tracks.map(async (t) => {
      try {
        const text = await fetchText(t.src);
        const cues = t.format === 'srt' ? parseSRT(text) : parseVTT(text);
        const vttText = t.format === 'srt' ? serializeVTT(cues) : text;
        return { ...t, cues, vttText };
      } catch (err) {
        console.warn(`[subtitles] failed to load ${t.src}:`, err.message);
        return null;
      }
    }));
    this.entries = loaded.filter(Boolean);
    if (!this.entries.length) return this;

    const videoEl = this.video?.getElement?.() || null;
    if (videoEl) { this._native = true; this._buildNativeTracks(videoEl); }
    else { this._native = false; this._buildOverlay(); }

    const def = this.entries.find((e) => e.default);
    this.setActive(def ? def.lang : null);
    return this;
  }

  _buildNativeTracks(videoEl) {
    for (const e of this.entries) {
      const blob = new Blob([e.vttText], { type: 'text/vtt' });
      const url = URL.createObjectURL(blob);
      this._blobUrls.push(url);
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.label = e.label;
      track.srclang = e.lang;
      track.src = url;
      videoEl.appendChild(track);
      e.trackEl = track;
    }
    // Tracks start disabled; setActive() turns the chosen one on.
    requestAnimationFrame(() => {
      for (const e of this.entries) if (e.trackEl?.track) e.trackEl.track.mode = 'disabled';
    });
  }

  _buildOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'p2-cc-overlay';
    overlay.setAttribute('aria-live', 'polite');
    overlay.hidden = true;
    this.mount.appendChild(overlay);
    this.overlay = overlay;
  }

  /** Cues for the CC menu: [{lang, label, default}]. */
  list() {
    return this.entries.map((e) => ({ lang: e.lang, label: e.label, default: e.default }));
  }

  getActive() { return this.activeLang; }

  /** Switch active language; pass null/'off' to turn captions off. */
  setActive(lang) {
    this.activeLang = lang || null;
    if (this._native) {
      for (const e of this.entries) {
        if (e.trackEl?.track) e.trackEl.track.mode = (e.lang === this.activeLang) ? 'showing' : 'disabled';
      }
    } else {
      this.activeEntry = this.entries.find((e) => e.lang === this.activeLang) || null;
      if (this.overlay && !this.activeEntry) { this.overlay.hidden = true; this.overlay.textContent = ''; }
    }
    this._emit();
  }

  /** Drive the overlay from the sync clock (no-op for native tracks). */
  update(time) {
    if (this._native || !this.overlay || !this.activeEntry) return;
    const cue = cueAt(this.activeEntry.cues, time);
    const text = cue ? cue.text : '';
    if (text === this._lastText) return;
    this._lastText = text;
    if (text) {
      this.overlay.innerHTML = text.split('\n').map(escapeHtml).join('<br>');
      this.overlay.hidden = false;
    } else {
      this.overlay.hidden = true;
      this.overlay.textContent = '';
    }
  }

  destroy() {
    this._blobUrls.forEach((u) => { try { URL.revokeObjectURL(u); } catch {} });
    this._blobUrls = [];
    this.entries.forEach((e) => e.trackEl?.remove());
    this.overlay?.remove();
    this._listeners = [];
  }
}

// --- parsing ---------------------------------------------------------------

async function fetchText(url) {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/** Find the cue active at time t (binary-search-free; cue lists are small). */
function cueAt(cues, t) {
  let active = null;
  for (const c of cues) {
    if (c.start <= t && t < c.end) { active = c; break; }
    if (c.start > t) break;
  }
  return active;
}

/**
 * Parse a WebVTT string into [{start,end,text}] (seconds). Tolerant of headers,
 * NOTE blocks, cue identifiers, and trailing cue settings after the end time.
 */
export function parseVTT(input) {
  const text = String(input).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/^﻿/, '');
  const blocks = text.split(/\n\n+/);
  const cues = [];
  for (const block of blocks) {
    const lines = block.split('\n').filter((l) => l.length || true);
    const idx = lines.findIndex((l) => l.includes('-->'));
    if (idx === -1) continue;                       // header / NOTE / metadata
    const time = parseCueTiming(lines[idx]);
    if (!time) continue;
    const body = lines.slice(idx + 1).join('\n').trim();
    if (body) cues.push({ start: time.start, end: time.end, text: body });
  }
  return cues.sort((a, b) => a.start - b.start);
}

/** Parse a SubRip (.srt) string into [{start,end,text}] (seconds). */
export function parseSRT(input) {
  const text = String(input).replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/^﻿/, '');
  const blocks = text.split(/\n\n+/);
  const cues = [];
  for (const block of blocks) {
    let lines = block.split('\n');
    // Drop a leading numeric index line if present.
    if (lines.length && /^\d+$/.test(lines[0].trim())) lines = lines.slice(1);
    const idx = lines.findIndex((l) => l.includes('-->'));
    if (idx === -1) continue;
    const time = parseCueTiming(lines[idx].replace(/,/g, '.'));
    if (!time) continue;
    const body = lines.slice(idx + 1).join('\n').trim();
    if (body) cues.push({ start: time.start, end: time.end, text: body });
  }
  return cues.sort((a, b) => a.start - b.start);
}

function parseCueTiming(line) {
  const m = line.split('-->');
  if (m.length < 2) return null;
  try {
    const start = parseTime(m[0].trim().split(/\s+/)[0]);
    const end = parseTime(m[1].trim().split(/\s+/)[0]);
    if (!isFinite(start) || !isFinite(end)) return null;
    return { start, end };
  } catch { return null; }
}

/** Serialise cues back into a minimal WebVTT document (for native <track>). */
export function serializeVTT(cues) {
  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0;
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    const ms = Math.round((s - Math.floor(s)) * 1000);
    const p = (n, w = 2) => String(n).padStart(w, '0');
    return `${p(h)}:${p(m)}:${p(sec)}.${p(ms, 3)}`;
  };
  let out = 'WEBVTT\n\n';
  cues.forEach((c, i) => {
    out += `${i + 1}\n${fmt(c.start)} --> ${fmt(c.end)}\n${c.text}\n\n`;
  });
  return out;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
