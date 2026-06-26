// mp4.js — self-hosted / remote HTML5 <video> provider.
// src is a URL to an mp4 (or any browser-playable) file.
//
// The <video> element creation + event wiring + readiness await are split into
// protected helpers so the WebTorrent and IPFS providers (which produce a media
// stream / resolved URL rather than a plain src) can reuse the same plumbing.

import { BaseVideoProvider } from './base.js';

export class Mp4Provider extends BaseVideoProvider {
  async load() {
    const v = this._createVideoEl();
    v.src = this.src;
    await this._awaitReady(v);
    this.emit('ready');
  }

  /** Build the <video>, wire lifecycle events, mount it, and remember it. */
  _createVideoEl() {
    const v = document.createElement('video');
    v.controls = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.style.width = '100%';
    v.style.height = '100%';
    v.crossOrigin = 'anonymous';
    if (this.poster) v.poster = this.poster;
    this.el = v;
    this.mount.appendChild(v);
    v.addEventListener('play', () => this.emit('play'));
    v.addEventListener('pause', () => this.emit('pause'));
    v.addEventListener('ended', () => this.emit('ended'));
    v.addEventListener('timeupdate', () => this.emit('timeupdate'));
    return v;
  }

  /** Resolve once metadata is ready; reject on a load error. */
  _awaitReady(v, label = this.src) {
    return new Promise((resolve, reject) => {
      if (v.readyState >= 1) return resolve();
      v.addEventListener('loadedmetadata', () => resolve(), { once: true });
      v.addEventListener('error', () => reject(new Error('Video failed to load: ' + label)), { once: true });
    });
  }

  getElement() { return this.el || null; }
  play() { this.el?.play(); }
  pause() { this.el?.pause(); }
  seek(seconds) { if (this.el) this.el.currentTime = seconds; }
  getTime() { return this.el?.currentTime || 0; }
  getDuration() { return this.el?.duration || 0; }
  setRate(rate) { if (this.el) this.el.playbackRate = rate; }
  isPlaying() { return this.el ? !this.el.paused && !this.el.ended : false; }
  destroy() { super.destroy(); this.el?.remove(); }
}
