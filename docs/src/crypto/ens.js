// ens.js — read-only ENS reverse resolution for the "signed by" badge.
//
// Given an Ethereum address, find its primary ENS name (e.g. 0xAbc… → vitalik.eth)
// using public JSON-RPC, then forward-confirm the name maps back to the same
// address (so a spoofed reverse record can't mislabel a signer). Everything here
// is best-effort + graceful: any network/parse failure resolves to null and the
// badge falls back to the abbreviated 0x address. Never throws, never blocks.

import { keccak256, keccak256Utf8, toHex } from './keccak.js';

// Public, no-key RPC endpoints (tried in order). Self-hosters can override.
export const DEFAULT_ENS_RPCS = [
  'https://eth.llamarpc.com',
  'https://cloudflare-eth.com',
  'https://rpc.ankr.com/eth',
];
const ENS_REGISTRY = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e';
const SEL_RESOLVER = '0178b8bf'; // resolver(bytes32)
const SEL_NAME = '691f3431';     // name(bytes32)
const SEL_ADDR = '3b3b57de';     // addr(bytes32)

function concatBytes(...arrs) {
  let len = 0;
  for (const a of arrs) len += a.length;
  const out = new Uint8Array(len);
  let off = 0;
  for (const a of arrs) { out.set(a, off); off += a.length; }
  return out;
}

/** ENS namehash of a dotted name → 32-byte Uint8Array. */
export function namehash(name) {
  let node = new Uint8Array(32); // 0x00…00
  if (name) {
    const labels = String(name).toLowerCase().split('.');
    for (let i = labels.length - 1; i >= 0; i--) {
      if (labels[i] === '') continue;
      node = keccak256(concatBytes(node, keccak256Utf8(labels[i])));
    }
  }
  return node;
}

async function ethCall(rpc, to, data, signal) {
  const res = await fetch(rpc, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to, data: '0x' + data }, 'latest'] }),
    signal,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || 'eth_call error');
  return String(json.result || '0x').replace(/^0x/, '');
}

// Decode a single ABI-encoded `string` return value (offset, length, bytes).
function decodeAbiString(hex) {
  if (hex.length < 128) return '';
  const len = parseInt(hex.slice(64, 128), 16);
  if (!len) return '';
  const data = hex.slice(128, 128 + len * 2);
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = parseInt(data.slice(i * 2, i * 2 + 2), 16);
  return new TextDecoder().decode(bytes);
}

// Decode a single ABI-encoded `address` (last 20 bytes of a 32-byte word).
function decodeAbiAddress(hex) {
  if (hex.length < 64) return null;
  return '0x' + hex.slice(24, 64).toLowerCase();
}

const nodeArg = (node) => toHex(node).padStart(64, '0');

/**
 * Reverse-resolve an address to its primary, forward-confirmed ENS name.
 * @returns {Promise<string|null>}
 */
export async function reverseEns(address, { rpcs = DEFAULT_ENS_RPCS, timeoutMs = 4000 } = {}) {
  const addr = String(address || '').toLowerCase().replace(/^0x/, '');
  if (!/^[0-9a-f]{40}$/.test(addr)) return null;
  const reverseNode = namehash(addr + '.addr.reverse');

  for (const rpc of rpcs) {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctl ? setTimeout(() => ctl.abort(), timeoutMs) : null;
    try {
      // 1. registry.resolver(reverseNode)
      const resolverHex = await ethCall(rpc, ENS_REGISTRY, SEL_RESOLVER + nodeArg(reverseNode), ctl?.signal);
      const resolver = decodeAbiAddress(resolverHex);
      if (!resolver || /^0x0{40}$/.test(resolver)) { if (timer) clearTimeout(timer); return null; }
      // 2. resolver.name(reverseNode)
      const nameHex = await ethCall(rpc, resolver, SEL_NAME + nodeArg(reverseNode), ctl?.signal);
      const name = decodeAbiString(nameHex).trim();
      if (!name) { if (timer) clearTimeout(timer); return null; }
      // 3. forward-confirm: name must resolve back to this address.
      const fwdNode = namehash(name);
      const fwdResolverHex = await ethCall(rpc, ENS_REGISTRY, SEL_RESOLVER + nodeArg(fwdNode), ctl?.signal);
      const fwdResolver = decodeAbiAddress(fwdResolverHex);
      if (timer) clearTimeout(timer);
      if (!fwdResolver || /^0x0{40}$/.test(fwdResolver)) return null;
      const ctl2 = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer2 = ctl2 ? setTimeout(() => ctl2.abort(), timeoutMs) : null;
      try {
        const addrHex = await ethCall(rpc, fwdResolver, SEL_ADDR + nodeArg(fwdNode), ctl2?.signal);
        if (timer2) clearTimeout(timer2);
        const resolved = decodeAbiAddress(addrHex);
        return resolved === '0x' + addr ? name : null;
      } catch { if (timer2) clearTimeout(timer2); return null; }
    } catch {
      if (timer) clearTimeout(timer);
      // try the next RPC
    }
  }
  return null;
}
