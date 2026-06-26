// ipfs.js — play the talk video from an IPFS CID / ipfs:// URI.
//
// Resolves the CID to the ordered list of HTTP gateway URLs from
// manifest.resolvers.ipfsGateways (defaults: dweb.link, ipfs.io, cloudflare) and
// tries each in turn, feeding the first that yields video metadata into an HTML5
// <video> (all the plumbing inherited from Mp4Provider). If every gateway fails,
// it throws so the player's source-fallback loop advances to the next source.
//
// The same gateway resolution (resolve.js → ipfsGatewayUrls) is reused for deck
// assets and the whole-manifest loader, so ipfs:// works everywhere, not just
// for video.

import { Mp4Provider } from './mp4.js';
import { ipfsGatewayUrls } from '../resolve.js';

export class IpfsProvider extends Mp4Provider {
  async load() {
    const v = this._createVideoEl();
    const urls = ipfsGatewayUrls(this.src, this.resolvers?.ipfsGateways);
    const errors = [];
    for (const url of urls) {
      try {
        v.src = url;
        await this._awaitReady(v, url);
        if (errors.length) console.info(`[ipfs] gateway fell through to ${url} after: ${errors.join(' | ')}`);
        this.emit('ready');
        return;
      } catch (err) {
        errors.push(`${url}: ${err.message}`);
        try { v.removeAttribute('src'); v.load(); } catch {}
      }
    }
    throw new Error(`IPFS video unreachable via all gateways. Tried: ${errors.join(' | ')}`);
  }
}
