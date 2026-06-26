// video/base.js — BaseVideoProvider, in its own module so provider subclasses
// can `extends` it without a circular dependency on the registry in index.js.
// See index.js for the full VideoProvider interface contract.

export class BaseVideoProvider {
  constructor({ src, mount }) {
    this.src = src;
    this.mount = mount;
    this._handlers = Object.create(null);
  }
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
