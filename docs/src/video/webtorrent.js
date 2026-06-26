// webtorrent.js — stream the talk video from a WebTorrent magnet.
//
// Loads the WebTorrent browser bundle lazily (resolve.js), adds the magnet using
// the trackers from manifest.resolvers.webtorrentTrackers, finds the largest
// playable file in the torrent, and renders it straight into an HTML5 <video>
// via file.renderTo(). All the <video> plumbing (events, seek, time) is inherited
// from Mp4Provider. On timeout / no-peers / blocked WSS it throws, so the player's
// source-fallback loop moves on to the next source.

import { Mp4Provider } from './mp4.js';
import { withTorrentFile, DEFAULT_WEBTORRENT_TRACKERS } from '../resolve.js';

const PLAYABLE = /\.(mp4|webm|m4v|mov|ogv)$/i;

export class WebTorrentProvider extends Mp4Provider {
  async load() {
    const v = this._createVideoEl();
    const trackers = this.resolvers?.webtorrentTrackers?.length
      ? this.resolvers.webtorrentTrackers : DEFAULT_WEBTORRENT_TRACKERS;

    const { file, torrent } = await withTorrentFile(this.src, {
      trackers, matchRe: PLAYABLE,
    });
    this._torrent = torrent;

    await new Promise((resolve, reject) => {
      let settled = false;
      const done = (fn, arg) => { if (!settled) { settled = true; fn(arg); } };
      // renderTo wires the stream into <video>; metadata arrival = ready to seek.
      v.addEventListener('loadedmetadata', () => done(resolve), { once: true });
      try {
        file.renderTo(v, { autoplay: false, controls: true }, (err) => {
          if (err) done(reject, new Error('WebTorrent stream error: ' + err.message));
        });
      } catch (err) {
        done(reject, new Error('WebTorrent render failed: ' + err.message));
      }
      setTimeout(() => done(reject, new Error('WebTorrent stream timed out before metadata.')), 30000);
    });

    this.emit('ready');
  }

  destroy() {
    super.destroy();
    try { this._torrent?.destroy(); } catch {}
  }
}
