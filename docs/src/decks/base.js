// decks/base.js — BaseDeckAdapter, in its own module so adapter subclasses can
// `extends` it without a circular dependency on the registry in index.js.
// See index.js for the full DeckAdapter interface contract.

import { isMagnet, webtorrentBlobUrl, DEFAULT_WEBTORRENT_TRACKERS } from '../resolve.js';

export class BaseDeckAdapter {
  constructor({ src, mount, manifest }) {
    this.src = src;
    this.mount = mount;
    this.manifest = manifest;
    this._handlers = Object.create(null);
    this._current = 1;
  }

  // Resolve a P2P deck source to a fetchable URL. ipfs:// sources are already
  // expanded to gateway URLs by the manifest loader; magnet: links are fetched
  // from the swarm here and exposed as a Blob URL the <iframe>/pdf can load.
  // Call at the top of load(): `this.src = await this._resolveDeckSrc();`
  async _resolveDeckSrc(matchRe) {
    if (!isMagnet(this.src)) return this.src;
    const trackers = this.manifest?.resolvers?.webtorrentTrackers?.length
      ? this.manifest.resolvers.webtorrentTrackers : DEFAULT_WEBTORRENT_TRACKERS;
    this._blobUrl = await webtorrentBlobUrl(this.src, { trackers, matchRe });
    return this._blobUrl;
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
  destroy() {
    this._handlers = Object.create(null);
    if (this._blobUrl) { try { URL.revokeObjectURL(this._blobUrl); } catch {} }
  }
}
