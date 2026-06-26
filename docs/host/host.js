// host.js — the "host your assets" helper.
//
// Two ways to get a file onto the decentralized web, both fully client-side:
//   • IPFS  — pin via a provider the USER configures with their own API token
//             (Pinata JWT, or the legacy web3.storage token). Token is entered
//             in the UI, NEVER hardcoded, and stored only in localStorage.
//   • WebTorrent — create + seed a torrent in this tab and surface the magnet.
//
// Both append a reference to a shared "hosted references" list (localStorage),
// which the Builder reads so you can paste ipfs:// / magnet: straight into a
// manifest source. No p2present server is involved at any point.

import { getWebTorrentClient, DEFAULT_WEBTORRENT_TRACKERS } from '../src/resolve.js';

const $ = (id) => document.getElementById(id);
const HOSTED_KEY = 'p2present:hosted';
const tokenKey = (provider) => `p2present:token:${provider}`;

// --- provider config --------------------------------------------------------

const PROVIDERS = {
  pinata: {
    label: 'Pinata JWT',
    note: 'Create a JWT at app.pinata.cloud → API Keys. It is stored ONLY in this browser (localStorage) and sent directly to Pinata — never to p2present.',
    async upload(file, token, onProgress) {
      const fd = new FormData();
      fd.append('file', file, file.name);
      onProgress?.('Uploading to Pinata…');
      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      if (!res.ok) throw new Error(`Pinata HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const j = await res.json();
      if (!j.IpfsHash) throw new Error('Pinata response had no IpfsHash.');
      return j.IpfsHash;
    },
  },
  web3storage: {
    label: 'web3.storage API token',
    note: 'Legacy web3.storage API token (api.web3.storage). Stored ONLY in this browser and sent directly to web3.storage. For the newer Storacha/w3up flow, use the w3 CLI (see the hosting guide).',
    async upload(file, token, onProgress) {
      onProgress?.('Uploading to web3.storage…');
      const res = await fetch('https://api.web3.storage/upload', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: file,
      });
      if (!res.ok) throw new Error(`web3.storage HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const j = await res.json();
      if (!j.cid) throw new Error('web3.storage response had no cid.');
      return j.cid;
    },
  },
};

function currentProvider() { return $('ipfs-provider').value; }

function refreshProviderUI() {
  const p = PROVIDERS[currentProvider()];
  $('token-label').textContent = p.label;
  $('token-note').textContent = p.note;
  const saved = lsGet(tokenKey(currentProvider()));
  $('ipfs-token').value = saved || '';
  $('token-state').textContent = saved ? 'Token saved in this browser.' : 'No token saved.';
}

// --- IPFS upload ------------------------------------------------------------

async function uploadToIpfs() {
  const provider = currentProvider();
  const token = $('ipfs-token').value.trim() || lsGet(tokenKey(provider));
  const file = $('ipfs-file').files?.[0];
  const status = $('ipfs-status');
  if (!file) { status.textContent = 'Choose a file first.'; return; }
  if (!token) { status.textContent = `Enter your ${PROVIDERS[provider].label} above (your own token — never shared).`; return; }
  $('ipfs-upload').disabled = true;
  status.className = 'p2-status-line';
  try {
    const cid = await PROVIDERS[provider].upload(file, token, (m) => { status.textContent = m; });
    status.textContent = 'Pinned ✓';
    showIpfsResult(cid, file.name);
    addHosted({ kind: 'ipfs', ref: `ipfs://${cid}`, name: file.name });
  } catch (err) {
    status.className = 'p2-status-line is-error';
    status.textContent = err.message || String(err);
  } finally {
    $('ipfs-upload').disabled = false;
  }
}

function showIpfsResult(cid, name) {
  const ref = `ipfs://${cid}`;
  const gateway = `https://${cid}.ipfs.dweb.link`;
  const box = $('ipfs-result');
  box.hidden = false;
  box.innerHTML = '';
  box.append(
    resultRow('CID', cid),
    resultRow('Manifest reference', ref, true),
    linkRow('Gateway preview', gateway),
  );
}

// --- WebTorrent seed --------------------------------------------------------

let seedingTorrent = null;
let wtClient = null;

async function seedWebTorrent() {
  const file = $('wt-file').files?.[0];
  const status = $('wt-status');
  if (!file) { status.textContent = 'Choose a file first.'; return; }
  const trackers = $('wt-trackers').value.split('\n').map((s) => s.trim()).filter(Boolean);
  $('wt-seed').disabled = true;
  status.className = 'p2-status-line';
  status.textContent = 'Loading WebTorrent…';
  try {
    wtClient = await getWebTorrentClient();
    status.textContent = 'Hashing + announcing to trackers…';
    const opts = trackers.length ? { announce: trackers } : {};
    wtClient.seed(file, opts, (torrent) => {
      seedingTorrent = torrent;
      status.textContent = 'Seeding ✓ — keep this tab open.';
      showWtResult(torrent, file.name);
      addHosted({ kind: 'magnet', ref: torrent.magnetURI, name: file.name });
      $('wt-stop').hidden = false;
      torrent.on('wire', () => updateWtPeers(torrent));
      updateWtPeers(torrent);
    });
  } catch (err) {
    status.className = 'p2-status-line is-error';
    status.textContent = err.message || String(err);
    $('wt-seed').disabled = false;
  }
}

function updateWtPeers(torrent) {
  const el = document.getElementById('wt-peers');
  if (el) el.textContent = `${torrent.numPeers} peer(s) connected`;
}

function showWtResult(torrent, name) {
  const box = $('wt-result');
  box.hidden = false;
  box.innerHTML = '';
  const peers = document.createElement('p');
  peers.className = 'p2-hint'; peers.id = 'wt-peers'; peers.textContent = '0 peer(s) connected';
  box.append(
    resultRow('Manifest reference (magnet)', torrent.magnetURI, true),
    peers,
  );
}

function stopSeeding() {
  try { seedingTorrent?.destroy(); } catch {}
  seedingTorrent = null;
  $('wt-stop').hidden = true;
  $('wt-seed').disabled = false;
  $('wt-status').textContent = 'Stopped seeding.';
  $('wt-result').hidden = true;
}

// --- hosted references (handoff to builder) ---------------------------------

function getHosted() {
  try { return JSON.parse(localStorage.getItem(HOSTED_KEY)) || []; } catch { return []; }
}
function addHosted(entry) {
  const list = getHosted();
  if (!list.some((e) => e.ref === entry.ref)) {
    list.unshift({ ...entry, ts: Date.now() });
    try { localStorage.setItem(HOSTED_KEY, JSON.stringify(list.slice(0, 50))); } catch {}
  }
  renderHosted();
}
function renderHosted() {
  const list = getHosted();
  const card = $('hosted-card');
  card.hidden = list.length === 0;
  const box = $('hosted-list');
  box.innerHTML = '';
  for (const e of list) {
    const row = document.createElement('div');
    row.className = 'p2-hosted-row';
    const meta = document.createElement('div');
    meta.className = 'p2-hosted-meta';
    meta.innerHTML = `<span class="p2-tag">${e.kind}</span> <span class="p2-hosted-name">${escapeHtml(e.name || '')}</span>`;
    const code = document.createElement('code');
    code.className = 'p2-hosted-ref'; code.textContent = e.ref;
    row.append(meta, code, copyButton(e.ref));
    box.appendChild(row);
  }
}

// --- shared UI helpers ------------------------------------------------------

function resultRow(label, value, mono) {
  const row = document.createElement('div');
  row.className = 'p2-result-row';
  const l = document.createElement('span'); l.className = 'p2-result-label'; l.textContent = label;
  const v = document.createElement('code'); v.className = mono ? 'p2-result-val is-ref' : 'p2-result-val'; v.textContent = value;
  row.append(l, v, copyButton(value));
  return row;
}
function linkRow(label, url) {
  const row = document.createElement('div');
  row.className = 'p2-result-row';
  const l = document.createElement('span'); l.className = 'p2-result-label'; l.textContent = label;
  const a = document.createElement('a'); a.className = 'p2-result-val'; a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = url;
  row.append(l, a);
  return row;
}
function copyButton(text) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'p2-load p2-copy'; b.textContent = '📋';
  b.title = 'Copy';
  b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(text); b.textContent = '✓'; setTimeout(() => (b.textContent = '📋'), 1200); }
    catch { b.textContent = '✗'; setTimeout(() => (b.textContent = '📋'), 1200); }
  });
  return b;
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function lsGet(k) { try { return localStorage.getItem(k); } catch { return null; } }

// --- wire up ----------------------------------------------------------------

function init() {
  $('wt-trackers').value = DEFAULT_WEBTORRENT_TRACKERS.join('\n');
  $('ipfs-provider').addEventListener('change', refreshProviderUI);
  refreshProviderUI();

  $('token-save').addEventListener('click', () => {
    const v = $('ipfs-token').value.trim();
    try { v ? localStorage.setItem(tokenKey(currentProvider()), v) : localStorage.removeItem(tokenKey(currentProvider())); } catch {}
    $('token-state').textContent = v ? 'Token saved in this browser.' : 'No token saved.';
  });
  $('token-clear').addEventListener('click', () => {
    try { localStorage.removeItem(tokenKey(currentProvider())); } catch {}
    $('ipfs-token').value = '';
    $('token-state').textContent = 'Token cleared.';
  });

  $('ipfs-upload').addEventListener('click', uploadToIpfs);
  $('wt-seed').addEventListener('click', seedWebTorrent);
  $('wt-stop').addEventListener('click', stopSeeding);
  $('hosted-clear').addEventListener('click', () => { try { localStorage.removeItem(HOSTED_KEY); } catch {} renderHosted(); });

  renderHosted();
}

init();
