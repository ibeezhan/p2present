// ipfs.js — PHASE 2 STUB. Play the talk video from an IPFS CID.
//
// TODO(phase2):
//   - resolve this.src (a CID or ipfs:// URI) to a fetchable URL, either via a
//     public gateway (https://<cid>.ipfs.dweb.link) or an in-page Helia node
//     (https://esm.sh/helia + @helia/unixfs) producing a Blob/stream URL
//   - feed that URL to an HTML5 <video> (reuse Mp4Provider once a URL exists)
//   - let the manifest override the preferred gateway
//
// Throws until implemented so misconfigured manifests fail loudly.

import { Mp4Provider } from './mp4.js';

export class IpfsProvider extends Mp4Provider {
  async load() {
    throw new Error(
      'IPFS provider is a phase-2 stub (not yet implemented). ' +
      'Use provider:"youtube" or "mp4" for now.'
    );
  }
}
