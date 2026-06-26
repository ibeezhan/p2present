// video/index.js — video provider registry + interface contract.
//
// A VideoProvider wraps a concrete player (YouTube iframe, HTML5 <video>, …)
// behind a uniform surface the sync engine can drive. Implement these methods
// (see BaseVideoProvider in base.js):
//
//   async load()                 mount the player; resolve when ready to seek
//   play() / pause()
//   seek(seconds)                jump to an absolute time (float seconds)
//   getTime() -> number          current time, float seconds
//   getDuration() -> number      total duration, float seconds (0 if unknown)
//   setRate(rate)                playback speed multiplier
//   isPlaying() -> boolean
//   destroy()                    tear down listeners & DOM
//
// Providers extend BaseVideoProvider and emit lifecycle via this.emit(name).
// The player subscribes with provider.on('timeupdate'|'play'|'pause'|'ready').
//
// Add a provider:  videoProviders.register('vimeo', VimeoProvider)

import { Registry } from '../registry.js';
import { BaseVideoProvider } from './base.js';
import { YouTubeProvider } from './youtube.js';
import { Mp4Provider } from './mp4.js';
import { WebTorrentProvider } from './webtorrent.js';
import { IpfsProvider } from './ipfs.js';

export { BaseVideoProvider };

export const videoProviders = new Registry('video provider');
videoProviders.register('youtube', YouTubeProvider);
videoProviders.register('mp4', Mp4Provider);
// Phase 2 — decentralized providers (stream over the P2P / content-addressed web):
videoProviders.register('webtorrent', WebTorrentProvider);  // magnet: → file.renderTo(<video>)
videoProviders.register('ipfs', IpfsProvider);              // ipfs:// → gateway fallback
