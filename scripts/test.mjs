// scripts/test.mjs — unit tests for the pure (non-DOM) logic: source transport
// recognisers, IPFS gateway expansion, base64 round-trips, and manifest
// normalisation. Run: `npm test`  (node scripts/test.mjs).
//
// DOM/provider behaviour (player, providers, routing, auto-hide) is covered by
// the headless smoke in scripts/smoke.mjs.

import assert from 'node:assert/strict';
import {
  isMagnet, isIpfs, isHttp, ipfsPath, ipfsGatewayUrls, httpCandidates,
  encodeBase64, decodeBase64, DEFAULT_IPFS_GATEWAYS,
} from '../docs/src/resolve.js';
import { normaliseManifest } from '../docs/src/manifest.js';

let passed = 0;
const tests = [];
const test = (name, fn) => tests.push([name, fn]);

// --- recognisers -----------------------------------------------------------
test('isMagnet', () => {
  assert.ok(isMagnet('magnet:?xt=urn:btih:abc'));
  assert.ok(isMagnet('  MAGNET:?xt=urn:btih:abc  '));
  assert.ok(!isMagnet('https://x/y'));
  assert.ok(!isMagnet('magnetic'));
});
test('isIpfs', () => {
  assert.ok(isIpfs('ipfs://bafkreigh2akiscaildc6vc7gznufx7vqg5ihrwujdq6e2htdpp7v2j6jzu'));
  assert.ok(isIpfs('QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'));
  assert.ok(isIpfs('bafkreigh2akiscaildc6vc7gznufx7vqg5ihrwujdq6e2htdpp7v2j6jzu/index.html'));
  assert.ok(!isIpfs('https://ipfs.io/ipfs/QmFoo'));   // http url, not a bare cid
  assert.ok(!isIpfs('hello-world'));
});
test('isHttp', () => {
  assert.ok(isHttp('https://x'));
  assert.ok(isHttp('http://x'));
  assert.ok(!isHttp('ipfs://x'));
});

// --- ipfs gateway expansion ------------------------------------------------
test('ipfsPath strips prefixes', () => {
  assert.equal(ipfsPath('ipfs://CID/sub/file.mp4'), 'CID/sub/file.mp4');
  assert.equal(ipfsPath('ipfs/CID'), 'CID');
  assert.equal(ipfsPath('CID'), 'CID');
});
test('ipfsGatewayUrls: subdomain + path gateways, with subpath', () => {
  const urls = ipfsGatewayUrls('ipfs://CID/slides/index.html', DEFAULT_IPFS_GATEWAYS);
  assert.equal(urls[0], 'https://CID.ipfs.dweb.link/slides/index.html');
  assert.equal(urls[1], 'https://ipfs.io/ipfs/CID/slides/index.html');
  assert.equal(urls[2], 'https://cloudflare-ipfs.com/ipfs/CID/slides/index.html');
});
test('ipfsGatewayUrls: bare CID, no subpath', () => {
  const urls = ipfsGatewayUrls('CID');
  assert.equal(urls[0], 'https://CID.ipfs.dweb.link');
  assert.equal(urls[1], 'https://ipfs.io/ipfs/CID');
});
test('ipfsGatewayUrls: custom gateway without {cid} placeholder', () => {
  const urls = ipfsGatewayUrls('ipfs://CID/a.mp4', ['https://my.gw/']);
  assert.equal(urls[0], 'https://my.gw/ipfs/CID/a.mp4');
});
test('httpCandidates routes by transport', () => {
  assert.deepEqual(httpCandidates('https://x/y'), ['https://x/y']);
  assert.deepEqual(httpCandidates('magnet:?xt=1'), []);
  assert.equal(httpCandidates('ipfs://CID')[0], 'https://CID.ipfs.dweb.link');
});

// --- base64 ----------------------------------------------------------------
test('base64 round-trips (incl. unicode + url-safe)', () => {
  for (const s of ['hello', 'https://x/p2present.json', 'فارسی · 🎞️', '{"a":1}']) {
    assert.equal(decodeBase64(encodeBase64(s)), s);
  }
  // tolerate URL-safe alphabet + whitespace
  const b = encodeBase64('https://example.com/p2present.json?a=1&b=2');
  const urlSafe = b.replace(/\+/g, '-').replace(/\//g, '_');
  assert.equal(decodeBase64(urlSafe), 'https://example.com/p2present.json?a=1&b=2');
});

// --- manifest normalisation ------------------------------------------------
const BASE = 'https://host.example/talk/p2present.json';
const fullManifest = () => ({
  p2present: '1.0',
  title: 'T',
  meta: { author: 'A' },
  video: {
    sources: [
      { provider: 'webtorrent', src: 'magnet:?xt=urn:btih:deadbeef&dn=talk.mp4' },
      { provider: 'ipfs', src: 'ipfs://VIDCID/talk.mp4' },
      { provider: 'youtube', src: 'uYygWN1MZDE' },
      { provider: 'mp4', src: 'media/talk.mp4' },
    ],
    poster: 'media/poster.jpg',
  },
  deck: {
    type: 'html',
    sources: [
      { src: 'ipfs://DECKCID/index.html' },
      { src: 'magnet:?xt=urn:btih:cafe&dn=slides.html' },
      { src: 'slides/index.html' },
    ],
    slideCount: 3,
  },
  timing: [
    { time: '0:30', slide: 2, transition: 'fade' },
    { time: 0, slide: 1 },
  ],
  subtitles: [{ lang: 'en', src: 'subs/en.srt' }],
  resolvers: { ipfsGateways: ['https://g1/{cid}', 'https://g2/{cid}'] },
  layout: { split: 0.7, mode: 'overlap' },
});

test('normalise: video sources resolved by provider', () => {
  const m = normaliseManifest(fullManifest(), BASE);
  const v = m.video.sources;
  assert.equal(v[0].src, 'magnet:?xt=urn:btih:deadbeef&dn=talk.mp4'); // webtorrent verbatim
  assert.equal(v[1].src, 'ipfs://VIDCID/talk.mp4');                   // ipfs verbatim (provider resolves)
  assert.equal(v[2].src, 'uYygWN1MZDE');                             // youtube id verbatim
  assert.equal(v[3].src, 'https://host.example/talk/media/talk.mp4'); // mp4 resolved
  assert.equal(m.video.poster, 'https://host.example/talk/media/poster.jpg');
});
test('normalise: deck ipfs expands to gateway list, magnet kept, https resolved', () => {
  const m = normaliseManifest(fullManifest(), BASE);
  const d = m.deck.sources.map((s) => s.src);
  assert.equal(d[0], 'https://g1/DECKCID/index.html');   // ipfs → gateway 1
  assert.equal(d[1], 'https://g2/DECKCID/index.html');   // ipfs → gateway 2
  assert.equal(d[2], 'magnet:?xt=urn:btih:cafe&dn=slides.html'); // magnet kept
  assert.equal(d[3], 'https://host.example/talk/slides/index.html'); // https resolved
});
test('normalise: timing parsed + sorted, subtitle srt inferred', () => {
  const m = normaliseManifest(fullManifest(), BASE);
  assert.deepEqual(m.sync.map((c) => c.time), [0, 30]);
  assert.equal(m.sync[1].transition, 'fade');
  assert.equal(m.subtitles[0].format, 'srt');
  assert.equal(m.subtitles[0].src, 'https://host.example/talk/subs/en.srt');
});
test('normalise: resolvers + layout defaults/overrides', () => {
  const m = normaliseManifest(fullManifest(), BASE);
  assert.deepEqual(m.resolvers.ipfsGateways, ['https://g1/{cid}', 'https://g2/{cid}']);
  assert.ok(m.resolvers.webtorrentTrackers.length >= 1); // defaulted
  assert.equal(m.layout.split, 0.7);
  assert.equal(m.layout.mode, 'overlap');
});
test('normalise: rejects missing video/deck', () => {
  assert.throws(() => normaliseManifest({ deck: { type: 'html', sources: [{ src: 'a' }] } }, BASE), /video/);
  assert.throws(() => normaliseManifest({ video: { sources: [{ provider: 'mp4', src: 'a' }] } }, BASE), /deck/);
});
test('normalise: rejects empty sources', () => {
  assert.throws(() => normaliseManifest({ video: { sources: [] }, deck: { type: 'html', sources: [{ src: 'a' }] } }, BASE), /video\.sources/);
});

// --- runner ----------------------------------------------------------------
let failed = 0;
for (const [name, fn] of tests) {
  try { fn(); passed++; console.log('  ✓', name); }
  catch (err) { failed++; console.error('  ✗', name, '\n     ', err.message); }
}
console.log(`\n${passed}/${tests.length} passed${failed ? `, ${failed} FAILED` : ''}.`);
process.exit(failed ? 1 : 0);
