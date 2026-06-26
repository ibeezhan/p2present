// sign.js — author signatures for a p2present.json manifest (Phase 8).
//
// A manifest can carry an optional `sig` block proving who published it. Two
// schemes are supported:
//   - "eip191"  — an Ethereum wallet (or a raw secp256k1 key) signs via the
//                 EIP-191 personal_sign prefix; the signer IS the recovered
//                 address (self-authenticating, no key stored in the manifest).
//   - "ed25519" — a raw Ed25519 keypair (WebCrypto); the 32-byte public key is
//                 stored in the manifest and the signature verifies against it.
//
// What gets signed: the canonical JSON of the WHOLE manifest including the sig
// block's `alg`/`signer`/`canon` but WITHOUT `signature`. So the signer claim is
// itself covered — editing the manifest OR the claimed signer breaks the sig.
// One canonicalize() is shared by signer, verifier, and Node tests so the bytes
// match everywhere. Verification NEVER blocks playback: callers treat a bad sig
// as "unsigned-ish" and keep playing.

import { keccak256 } from './crypto/keccak.js';
import { sign as secpSign, recoverAddress, sigToHex, sigFromHex, privToAddress, toChecksumAddress } from './crypto/secp256k1.js';
import { bytesToB64url, b64urlToBytes } from './crypto/base64url.js';
import { reverseEns } from './crypto/ens.js';

export const CANON_ID = 'p2/jcs-1';

// --- canonical JSON (JCS-lite: recursively sorted keys, minimal separators) ---
export function canonicalize(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonicalize).join(',') + ']';
  const keys = Object.keys(value).filter((k) => value[k] !== undefined).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalize(value[k])).join(',') + '}';
}

// The exact string an author signs / a verifier re-derives, given the sig's
// alg + signer (signature itself excluded). `signer` keys are sorted by canon.
export function signingString(manifest, { alg, signer }) {
  const clone = JSON.parse(JSON.stringify(manifest));
  clone.sig = { alg, canon: CANON_ID, signer };
  return canonicalize(clone);
}

// --- EIP-191 personal_sign helpers -----------------------------------------
const utf8 = (s) => new TextEncoder().encode(s);
const toHex0x = (bytes) => '0x' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

/** keccak256("\x19Ethereum Signed Message:\n" + len + message) — the EIP-191 hash. */
export function personalHash(message) {
  const msg = utf8(message);
  const prefix = utf8('\x19Ethereum Signed Message:\n' + msg.length);
  const full = new Uint8Array(prefix.length + msg.length);
  full.set(prefix); full.set(msg, prefix.length);
  return keccak256(full);
}

/**
 * Sign with a raw Ethereum private key (the Builder "paste a key" path + tests).
 * @returns {object} a COPY of the manifest with a `sig` block embedded.
 */
export function signEip191WithKey(manifest, privKey) {
  const address = toChecksumAddress(privToAddress(privKey));
  const signer = { address };
  const msg = signingString(manifest, { alg: 'eip191', signer });
  const sig = secpSign(personalHash(msg), privKey);
  return embedSig(manifest, { alg: 'eip191', canon: CANON_ID, signer, signature: sigToHex(sig) });
}

/**
 * Sign with an injected wallet provider (window.ethereum) via personal_sign.
 * @returns {Promise<object>} manifest copy with the `sig` block embedded.
 */
export async function signEip191WithWallet(manifest, { provider, address }) {
  if (!provider?.request) throw new Error('No injected wallet provider found.');
  let from = address;
  if (!from) {
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    from = accounts && accounts[0];
  }
  if (!from) throw new Error('No wallet account available.');
  const signer = { address: toChecksumAddress(from) };
  const msg = signingString(manifest, { alg: 'eip191', signer });
  // personal_sign expects (hexMessage, address); the wallet adds the EIP-191 prefix.
  const signature = await provider.request({ method: 'personal_sign', params: [toHex0x(utf8(msg)), from] });
  return embedSig(manifest, { alg: 'eip191', canon: CANON_ID, signer, signature: normalizeEthSig(signature) });
}

function normalizeEthSig(sig) {
  // Re-pack to our canonical 0x r||s||v(27/28) form (handles 0/1 or 27/28 v).
  return sigToHex(sigFromHex(sig));
}

// --- Ed25519 (WebCrypto) ----------------------------------------------------
function subtle() {
  const c = (typeof globalThis !== 'undefined' && globalThis.crypto) || (typeof crypto !== 'undefined' ? crypto : null);
  if (!c?.subtle) throw new Error('WebCrypto (crypto.subtle) is unavailable here.');
  return c.subtle;
}

/** Generate a fresh Ed25519 keypair → {privateKeyPkcs8(b64url), publicKey(b64url)}. */
export async function generateEd25519() {
  const kp = await subtle().generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  const pkcs8 = new Uint8Array(await subtle().exportKey('pkcs8', kp.privateKey));
  const raw = new Uint8Array(await subtle().exportKey('raw', kp.publicKey));
  return { privateKeyPkcs8: bytesToB64url(pkcs8), publicKey: bytesToB64url(raw) };
}

/**
 * Sign with an Ed25519 private key (base64url pkcs8). Optional `domain` is a
 * display label bound INTO the signature (covered by the signed payload).
 * @returns {Promise<object>} manifest copy with the `sig` block embedded.
 */
export async function signEd25519(manifest, { privateKeyPkcs8, publicKey, domain } = {}) {
  if (!publicKey) throw new Error('Ed25519 signing needs the matching publicKey.');
  const priv = await subtle().importKey('pkcs8', b64urlToBytes(privateKeyPkcs8), { name: 'Ed25519' }, false, ['sign']);
  const signer = domain ? { domain, key: publicKey } : { key: publicKey };
  const msg = signingString(manifest, { alg: 'ed25519', signer });
  const sigBytes = new Uint8Array(await subtle().sign({ name: 'Ed25519' }, priv, utf8(msg)));
  return embedSig(manifest, { alg: 'ed25519', canon: CANON_ID, signer, signature: bytesToB64url(sigBytes) });
}

async function verifyEd25519(publicKeyB64, message, signatureB64) {
  const key = await subtle().importKey('raw', b64urlToBytes(publicKeyB64), { name: 'Ed25519' }, false, ['verify']);
  return subtle().verify({ name: 'Ed25519' }, key, b64urlToBytes(signatureB64), utf8(message));
}

// Insert the sig block (placed last for readable diffs, but key order is
// irrelevant — canonicalize sorts on both sides).
function embedSig(manifest, sig) {
  const out = JSON.parse(JSON.stringify(manifest));
  out.sig = sig;
  return out;
}

// --- verification -----------------------------------------------------------

/** Quick structural check: does this manifest claim a signature? */
export function isSigned(manifest) {
  const s = manifest?.sig;
  return !!(s && typeof s === 'object' && s.alg && s.signature && s.signer);
}

/**
 * Verify a manifest's `sig` block. NEVER throws — a malformed/forged sig returns
 * { state: 'invalid' | 'unsigned', … } and callers keep playing.
 * @returns {Promise<{state:'valid'|'invalid'|'unsigned', alg?, signer?, reason?}>}
 */
export async function verifyManifest(manifest) {
  if (!isSigned(manifest)) return { state: 'unsigned' };
  const sig = manifest.sig;
  try {
    const alg = String(sig.alg);
    const signer = sig.signer || {};
    if (sig.canon && sig.canon !== CANON_ID) {
      return { state: 'invalid', alg, signer, reason: `unknown canonicalization "${sig.canon}"` };
    }
    const message = signingString(manifest, { alg, signer });

    if (alg === 'eip191') {
      if (!signer.address) return { state: 'invalid', alg, signer, reason: 'no signer.address' };
      const recovered = recoverAddress(personalHash(message), sigFromHex(sig.signature));
      const ok = recovered.toLowerCase() === String(signer.address).toLowerCase();
      return ok
        ? { state: 'valid', alg, signer: { ...signer, address: toChecksumAddress(recovered) } }
        : { state: 'invalid', alg, signer, reason: 'recovered address ≠ signer.address' };
    }

    if (alg === 'ed25519') {
      if (!signer.key) return { state: 'invalid', alg, signer, reason: 'no signer.key' };
      const ok = await verifyEd25519(signer.key, message, sig.signature);
      return ok ? { state: 'valid', alg, signer } : { state: 'invalid', alg, signer, reason: 'bad ed25519 signature' };
    }

    return { state: 'invalid', alg, signer, reason: `unknown alg "${alg}"` };
  } catch (err) {
    return { state: 'invalid', alg: sig.alg, signer: sig.signer, reason: err.message };
  }
}

/**
 * A short, human label for a verified signer, best-effort ENS-resolved.
 * @returns {Promise<{label:string, kind:'ens'|'domain'|'address'|'key', address?:string}>}
 */
export async function describeSigner(result, { resolveEns = true } = {}) {
  const signer = result?.signer || {};
  if (result?.alg === 'eip191' && signer.address) {
    const address = signer.address;
    if (resolveEns) {
      try {
        const name = await reverseEns(address);
        if (name) return { label: name, kind: 'ens', address };
      } catch { /* offline / fallback below */ }
    }
    return { label: abbreviateAddress(address), kind: 'address', address };
  }
  if (result?.alg === 'ed25519') {
    if (signer.domain) return { label: signer.domain, kind: 'domain' };
    return { label: 'key ' + String(signer.key || '').slice(0, 10) + '…', kind: 'key' };
  }
  return { label: 'unknown', kind: 'key' };
}

export function abbreviateAddress(addr) {
  const a = String(addr || '');
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}
