// webtorrent.js — PHASE 2 STUB. Stream the talk video from a WebTorrent magnet.
//
// TODO(phase2):
//   - import WebTorrent (https://esm.sh/webtorrent) lazily in load()
//   - new WebTorrent().add(this.src /* magnet */, torrent => {
//       const file = torrent.files.find(f => /\.(mp4|webm)$/i.test(f.name))
//       file.renderTo(videoEl)  // or file.streamTo()
//     })
//   - wire the same <video> events as Mp4Provider (reuse that logic)
//   - surface swarm/peer progress in the UI
//
// Until then this throws a clear, user-facing error so a manifest referencing
// provider:"webtorrent" fails loudly instead of silently doing nothing.

import { Mp4Provider } from './mp4.js';

export class WebTorrentProvider extends Mp4Provider {
  async load() {
    throw new Error(
      'WebTorrent provider is a phase-2 stub (not yet implemented). ' +
      'Use provider:"youtube" or "mp4" for now.'
    );
  }
}
