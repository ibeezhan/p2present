// html-deck.js — adapter for HTML slide decks shown in an <iframe>.
//
// Supports, in order of preference:
//   1. <deck-stage> web components (the demo MoaV deck) — public goTo()/next()/
//      prev() API + a `slideIndexChanged` postMessage + `#<index>` hash.
//   2. reveal.js (window.Reveal) — Reveal.slide(i) + 'slidechanged' event.
//   3. A generic fallback: each top-level <section> is a slide, toggled by
//      display, navigated by index.
//
// Same-origin decks (the demo, and any forked self-host deck) get full
// bidirectional control via the iframe's contentWindow. Cross-origin remote
// decks are driven best-effort: we still RECEIVE slide changes via postMessage,
// but PUSHING a slide falls back to reloading the iframe at `src#<index>`
// (documented limitation — host your deck same-origin for smooth sync).

import { BaseDeckAdapter } from './base.js';

export class HtmlDeckAdapter extends BaseDeckAdapter {
  async load() {
    const iframe = document.createElement('iframe');
    iframe.className = 'p2-deck-frame';
    iframe.setAttribute('title', this.manifest?.title || 'Slides');
    iframe.allow = 'fullscreen';
    iframe.src = this.src;
    this.iframe = iframe;
    this.mount.appendChild(iframe);

    // Receive slide changes from inside the deck (works cross-origin too).
    this._onMessage = (e) => {
      if (e.source !== iframe.contentWindow) return;
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (typeof d.deckTotal === 'number') this._total = d.deckTotal;
      if (typeof d.slideIndexChanged === 'number') {
        const slide1 = d.slideIndexChanged + 1;
        if (slide1 !== this._current) {
          this._current = slide1;
          this.emit('slidechange', slide1);
        }
      }
    };
    window.addEventListener('message', this._onMessage);

    await new Promise((resolve) => {
      iframe.addEventListener('load', resolve, { once: true });
    });

    // Probe the loaded document for a known engine (same-origin only).
    this._engine = this._detectEngine();
    this.emit('ready');
  }

  _detectEngine() {
    let doc, win;
    try {
      doc = this.iframe.contentDocument;
      win = this.iframe.contentWindow;
      if (!doc) return 'crossorigin';
    } catch {
      return 'crossorigin'; // blocked => cross-origin
    }
    const stage = doc.querySelector('deck-stage');
    if (stage) { this._stage = stage; return 'deck-stage'; }
    if (win.Reveal && typeof win.Reveal.slide === 'function') {
      this._reveal = win.Reveal;
      win.Reveal.on?.('slidechanged', (ev) => {
        const slide1 = (ev.indexh ?? 0) + 1;
        this._current = slide1;
        this.emit('slidechange', slide1);
      });
      return 'reveal';
    }
    this._sections = [...doc.querySelectorAll('body > section, .slides > section')];
    return this._sections.length ? 'sections' : 'opaque';
  }

  get slideCount() {
    if (this._total) return this._total;
    if (this._stage?._slides?.length) return this._stage._slides.length;
    if (this._sections?.length) return this._sections.length;
    // Fall back to the highest slide referenced by the manifest's sync cues.
    const cues = this.manifest?.sync || [];
    return cues.reduce((m, c) => Math.max(m, c.slide), 1);
  }

  /** @param {number} slide 1-based */
  async goTo(slide, opts = {}) {
    const n = Math.max(1, Math.floor(slide));
    if (n === this._current) return;
    this._current = n;
    const i = n - 1; // engines below are 0-based
    switch (this._engine) {
      case 'deck-stage':
        this._stage.goTo(i);
        break;
      case 'reveal':
        this._reveal.slide(i);
        break;
      case 'sections':
        this._sections.forEach((s, idx) => { s.style.display = idx === i ? '' : 'none'; });
        break;
      case 'crossorigin':
        this._pushHashNav(i);
        break;
      default:
        // 'opaque' — try the hash anyway; harmless if unused.
        this._pushHashNav(i);
    }
  }

  // Cross-origin push of last resort: reload the iframe at the target hash.
  _pushHashNav(index) {
    const base = this.src.split('#')[0];
    this.iframe.src = `${base}#${index}`;
  }

  destroy() {
    super.destroy();
    window.removeEventListener('message', this._onMessage);
    this.iframe?.remove();
  }
}
