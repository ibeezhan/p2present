// decks/base.js — BaseDeckAdapter, in its own module so adapter subclasses can
// `extends` it without a circular dependency on the registry in index.js.
// See index.js for the full DeckAdapter interface contract.

export class BaseDeckAdapter {
  constructor({ src, mount, manifest }) {
    this.src = src;
    this.mount = mount;
    this.manifest = manifest;
    this._handlers = Object.create(null);
    this._current = 1;
  }
  on(event, fn) { (this._handlers[event] ||= []).push(fn); return this; }
  emit(event, payload) {
    (this._handlers[event] || []).forEach((fn) => {
      try { fn(payload); } catch (e) { console.error(e); }
    });
  }
  get currentSlide() { return this._current; }
  get slideCount() { return 0; }
  async load() {}
  async goTo() {}
  destroy() { this._handlers = Object.create(null); }
}
