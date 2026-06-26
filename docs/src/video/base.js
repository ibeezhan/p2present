// video/base.js — BaseVideoProvider, in its own module so provider subclasses
// can `extends` it without a circular dependency on the registry in index.js.
// See index.js for the full VideoProvider interface contract.

export class BaseVideoProvider {
  constructor({ src, mount, manifest, resolvers, poster } = {}) {
    this.src = src;
    this.mount = mount;
    this.manifest = manifest;
    this.resolvers = resolvers;     // {ipfsGateways, webtorrentTrackers} for phase-2 providers
    this.poster = poster;
    this._handlers = Object.create(null);
  }
  // Providers backed by a real <video> element return it (lets the subtitle
  // controller attach native <track>s); iframe-based providers return null.
  getElement() { return null; }
  on(event, fn) {
    (this._handlers[event] ||= []).push(fn);
    return this;
  }
  emit(event, payload) {
    (this._handlers[event] || []).forEach((fn) => {
      try { fn(payload); } catch (e) { console.error(e); }
    });
  }
  // Default no-ops so partial providers still satisfy the interface.
  async load() {}
  play() {}
  pause() {}
  seek() {}
  getTime() { return 0; }
  getDuration() { return 0; }
  setRate() {}
  isPlaying() { return false; }
  destroy() { this._handlers = Object.create(null); }
}
