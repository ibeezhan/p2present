// player.js — orchestrates a manifest into a running presentation:
// builds the deck adapter + video provider, wires the SyncEngine between them,
// and renders the control bar + input handling (keyboard, wheel, scrub, speed,
// link/unlink). Everything domain-specific lives in the adapters/providers; this
// file is the glue + chrome.

import { deckAdapters } from './decks/index.js';
import { videoProviders } from './video/index.js';
import { SyncEngine } from './sync.js';
import { formatTime } from './time.js';

const SPEEDS = [0.75, 1, 1.1, 1.25, 1.5, 1.75, 2];

export class Player {
  /** @param {object} manifest normalised manifest @param {HTMLElement} root */
  constructor(manifest, root) {
    this.manifest = manifest;
    this.root = root;
  }

  async mount() {
    this.root.innerHTML = '';
    this.root.classList.add('p2-player');

    // Layout: two panes (deck + video) over a control bar.
    const stage = el('div', 'p2-stage');
    const deckPane = el('div', 'p2-pane p2-deck-pane');
    const videoPane = el('div', 'p2-pane p2-video-pane');
    const deckMount = el('div', 'p2-mount');
    const videoMount = el('div', 'p2-mount');
    deckPane.append(label('Slides'), deckMount);
    videoPane.append(label('Video'), videoMount);
    stage.append(deckPane, videoPane);
    const controls = el('div', 'p2-controls');
    this.root.append(stage, controls);

    // Instantiate adapter + provider and load them in parallel.
    const DeckAdapter = deckAdapters.get(this.manifest.deck.type);
    const VideoProvider = videoProviders.get(this.manifest.video.provider);
    this.deck = new DeckAdapter({ src: this.manifest.deck.src, mount: deckMount, manifest: this.manifest });
    this.video = new VideoProvider({ src: this.manifest.video.src, mount: videoMount });

    await Promise.all([this.deck.load(), this.video.load()]);

    this.sync = new SyncEngine({
      video: this.video,
      deck: this.deck,
      cues: this.manifest.sync,
      onState: (s) => this._renderState(s),
    });

    this._buildControls(controls);
    this._bindInput();
    this.sync.start();
    return this;
  }

  // --- controls ------------------------------------------------------------

  _buildControls(bar) {
    this.btnPlay = button('▶', 'Play / pause (space)', () => this._togglePlay());
    this.btnPrev = button('‹', 'Previous slide (←)', () => this.sync.prevSlide());
    this.btnNext = button('›', 'Next slide (→)', () => this.sync.nextSlide());

    // Scrubber (click / drag to seek).
    this.scrub = el('input', 'p2-scrub');
    this.scrub.type = 'range';
    this.scrub.min = 0; this.scrub.max = 1000; this.scrub.value = 0;
    this.scrub.setAttribute('aria-label', 'Seek video');
    this.scrub.addEventListener('input', () => {
      const dur = this.video.getDuration() || 0;
      this.video.seek((this.scrub.value / 1000) * dur);
    });

    this.timeLabel = el('span', 'p2-time'); this.timeLabel.textContent = '0:00 / 0:00';
    this.slideLabel = el('span', 'p2-slidecount'); this.slideLabel.textContent = '1 / 1';

    // Speed selector.
    this.speed = el('select', 'p2-speed');
    this.speed.setAttribute('aria-label', 'Playback speed');
    for (const r of SPEEDS) {
      const o = document.createElement('option');
      o.value = String(r); o.textContent = `${r}×`;
      if (r === 1) o.selected = true;
      this.speed.appendChild(o);
    }
    this.speed.addEventListener('change', () => this.video.setRate(parseFloat(this.speed.value)));

    // Link / unlink sync toggle.
    this.btnLink = button('🔗', 'Sync linked — click to unlink', () => {
      this.sync.setLinked(!this.sync.linked);
    });
    this.btnLink.classList.add('p2-link', 'is-linked');

    bar.append(
      this.btnPlay, this.btnPrev, this.btnNext,
      this.scrub, this.timeLabel,
      spacer(), this.slideLabel, this.speed, this.btnLink,
    );
  }

  _renderState(s) {
    if (!this._scrubbing) {
      const frac = s.duration ? (s.time / s.duration) * 1000 : 0;
      this.scrub.value = String(frac);
    }
    this.timeLabel.textContent = `${formatTime(s.time)} / ${formatTime(s.duration)}`;
    this.slideLabel.textContent = `${s.slide} / ${s.slideCount}`;
    this.btnPlay.textContent = s.playing ? '⏸' : '▶';
    this.btnPlay.title = s.playing ? 'Pause (space)' : 'Play (space)';
    this.btnLink.classList.toggle('is-linked', s.linked);
    this.btnLink.title = s.linked ? 'Sync linked — click to unlink' : 'Sync unlinked — click to link';
    this.btnLink.setAttribute('aria-pressed', String(s.linked));
  }

  _togglePlay() {
    if (this.video.isPlaying()) this.video.pause(); else this.video.play();
  }

  // --- input ---------------------------------------------------------------

  _bindInput() {
    // Track scrub drag so the polling loop doesn't fight the user's thumb.
    this.scrub.addEventListener('pointerdown', () => { this._scrubbing = true; });
    window.addEventListener('pointerup', () => { this._scrubbing = false; });

    // Keyboard (only when focus isn't in a text field).
    this._onKey = (e) => {
      if (/^(input|textarea|select)$/i.test(e.target.tagName) && e.target !== document.body) {
        if (e.target.classList.contains('p2-scrub')) { /* allow */ } else return;
      }
      const k = e.key;
      if (k === ' ' || k === 'Spacebar') { e.preventDefault(); this._togglePlay(); }
      else if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === 'k' || k === 'l') { e.preventDefault(); this.sync.nextSlide(); }
      else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'j' || k === 'h') { e.preventDefault(); this.sync.prevSlide(); }
      else if (k === 'Home') { e.preventDefault(); this.sync.gotoSlide(1); }
      else if (k === 'End') { e.preventDefault(); this.sync.gotoSlide(this.deck.slideCount); }
    };
    window.addEventListener('keydown', this._onKey);

    // Mouse-wheel over the deck pane moves through slides (throttled).
    this._wheelAcc = 0; this._wheelLock = false;
    this._onWheel = (e) => {
      if (this._wheelLock) return;
      this._wheelAcc += e.deltaY;
      if (Math.abs(this._wheelAcc) < 60) return;
      const dir = this._wheelAcc > 0 ? 1 : -1;
      this._wheelAcc = 0;
      this._wheelLock = true;
      setTimeout(() => { this._wheelLock = false; }, 450);
      if (dir > 0) this.sync.nextSlide(); else this.sync.prevSlide();
    };
    const deckPane = this.root.querySelector('.p2-deck-pane');
    deckPane.addEventListener('wheel', this._onWheel, { passive: true });
  }

  destroy() {
    this.sync?.stop();
    window.removeEventListener('keydown', this._onKey);
    this.video?.destroy();
    this.deck?.destroy();
  }
}

// --- tiny DOM helpers ------------------------------------------------------
function el(tag, cls) { const n = document.createElement(tag); if (cls) n.className = cls; return n; }
function label(text) { const n = el('span', 'p2-pane-label'); n.textContent = text; return n; }
function spacer() { return el('span', 'p2-spacer'); }
function button(text, title, onClick) {
  const b = el('button', 'p2-btn');
  b.type = 'button'; b.textContent = text; b.title = title; b.setAttribute('aria-label', title);
  b.addEventListener('click', onClick);
  return b;
}
