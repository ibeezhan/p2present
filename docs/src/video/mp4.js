// mp4.js — self-hosted / remote HTML5 <video> provider.
// src is a URL to an mp4 (or any browser-playable) file.

import { BaseVideoProvider } from './base.js';

export class Mp4Provider extends BaseVideoProvider {
  async load() {
    const v = document.createElement('video');
    v.src = this.src;
    v.controls = true;
    v.playsInline = true;
    v.preload = 'metadata';
    v.style.width = '100%';
    v.style.height = '100%';
    v.crossOrigin = 'anonymous';
    this.el = v;
    this.mount.appendChild(v);

    v.addEventListener('play', () => this.emit('play'));
    v.addEventListener('pause', () => this.emit('pause'));
    v.addEventListener('ended', () => this.emit('ended'));
    v.addEventListener('timeupdate', () => this.emit('timeupdate'));

    await new Promise((resolve, reject) => {
      v.addEventListener('loadedmetadata', resolve, { once: true });
      v.addEventListener('error', () => reject(new Error('Video failed to load: ' + this.src)), { once: true });
    });
    this.emit('ready');
  }
  play() { this.el?.play(); }
  pause() { this.el?.pause(); }
  seek(seconds) { if (this.el) this.el.currentTime = seconds; }
  getTime() { return this.el?.currentTime || 0; }
  getDuration() { return this.el?.duration || 0; }
  setRate(rate) { if (this.el) this.el.playbackRate = rate; }
  isPlaying() { return this.el ? !this.el.paused && !this.el.ended : false; }
  destroy() { super.destroy(); this.el?.remove(); }
}
