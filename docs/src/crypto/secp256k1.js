// secp256k1.js — a compact, dependency-free secp256k1 for Ethereum signatures.
//
// Just enough to (a) RECOVER the signer address from an EIP-191 signature (the
// verifier path the player runs on load) and (b) SIGN a 32-byte hash with a raw
// private key (the "paste an Ethereum key" path in the Builder, and the unit
// tests' round-trip). Affine math with Fermat inverses — slow but only a handful
// of ops per sign/verify, so it stays well under a frame. BigInt throughout.
//
// `k` (the per-signature nonce) is derived deterministically from keccak(priv ‖
// hash ‖ counter) rather than RFC-6979: it is secret (depends on the private
// key), unique per message, and needs no HMAC-SHA256 — adequate for signing a
// PUBLIC manifest. The trust anchor on the verify side is the recovered address.

import { keccak256, toHex } from './keccak.js';

const P = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn;
const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const Gx = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n;
const Gy = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n;
const G = { x: Gx, y: Gy };

const mod = (a, m = P) => { const r = a % m; return r < 0n ? r + m : r; };

// Modular exponentiation (square-and-multiply).
function powmod(base, exp, m) {
  let r = 1n; base = mod(base, m);
  while (exp > 0n) {
    if (exp & 1n) r = (r * base) % m;
    base = (base * base) % m;
    exp >>= 1n;
  }
  return r;
}
const inv = (a, m = P) => powmod(mod(a, m), m - 2n, m); // Fermat inverse (m prime)

// --- affine point arithmetic (y² = x³ + 7) ---------------------------------
function pointAdd(p1, p2) {
  if (p1 === null) return p2;
  if (p2 === null) return p1;
  if (p1.x === p2.x) {
    if (mod(p1.y + p2.y) === 0n) return null;     // P + (-P) = ∞
    return pointDouble(p1);
  }
  const s = mod((p2.y - p1.y) * inv(p2.x - p1.x));
  const x = mod(s * s - p1.x - p2.x);
  const y = mod(s * (p1.x - x) - p1.y);
  return { x, y };
}
function pointDouble(p) {
  if (p === null) return null;
  const s = mod((3n * p.x * p.x) * inv(2n * p.y));
  const x = mod(s * s - 2n * p.x);
  const y = mod(s * (p.x - x) - p.y);
  return { x, y };
}
function pointMul(k, p) {
  let r = null, addend = p;
  k = mod(k, N);
  while (k > 0n) {
    if (k & 1n) r = pointAdd(r, addend);
    addend = pointDouble(addend);
    k >>= 1n;
  }
  return r;
}

// --- byte/bigint helpers ----------------------------------------------------
function bytesToBig(bytes) {
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  return n;
}
function bigTo32(n) {
  const out = new Uint8Array(32);
  for (let i = 31; i >= 0; i--) { out[i] = Number(n & 0xffn); n >>= 8n; }
  return out;
}
export function privToBig(priv) {
  if (typeof priv === 'bigint') return priv;
  if (priv instanceof Uint8Array) return bytesToBig(priv);
  let h = String(priv).trim().toLowerCase().replace(/^0x/, '');
  if (!/^[0-9a-f]{1,64}$/.test(h)) throw new Error('Private key must be 32-byte hex.');
  return BigInt('0x' + h);
}

// --- public key + address ---------------------------------------------------
/** Uncompressed public key point for a private scalar. */
export function getPublicKey(priv) {
  const d = privToBig(priv);
  if (d <= 0n || d >= N) throw new Error('Private key out of range.');
  return pointMul(d, G);
}
/** Ethereum address (0x-checksummed-lower) from a public key point. */
export function pubToAddress(pub) {
  const raw = new Uint8Array(64);
  raw.set(bigTo32(pub.x), 0);
  raw.set(bigTo32(pub.y), 32);
  const h = keccak256(raw);
  return '0x' + toHex(h.slice(12));
}
/** Ethereum address for a private key. */
export function privToAddress(priv) {
  return pubToAddress(getPublicKey(priv));
}

// --- sign -------------------------------------------------------------------
/**
 * Sign a 32-byte message hash with a raw private key.
 * @returns {{r:bigint, s:bigint, recovery:number}} low-s normalised.
 */
export function sign(msgHash, priv) {
  const d = privToBig(priv);
  const z = bytesToBig(msgHash instanceof Uint8Array ? msgHash : bigTo32(msgHash)) % N;
  const dBytes = bigTo32(d);
  const hBytes = msgHash instanceof Uint8Array ? msgHash : bigTo32(msgHash);
  for (let counter = 0; counter < 256; counter++) {
    // Deterministic, secret, message-unique nonce (see header note).
    const seed = new Uint8Array(65);
    seed.set(dBytes, 0); seed.set(hBytes, 32); seed[64] = counter;
    let k = bytesToBig(keccak256(seed)) % N;
    if (k === 0n) continue;
    const R = pointMul(k, G);
    const r = mod(R.x, N);
    if (r === 0n) continue;
    let s = mod(inv(k, N) * (z + r * d), N);
    if (s === 0n) continue;
    let recovery = (Number(R.y & 1n)) ^ (R.x >= N ? 2 : 0);
    // Enforce low-s (EIP-2); flipping s flips the y parity → toggle recovery bit 0.
    if (s > N >> 1n) { s = N - s; recovery ^= 1; }
    return { r, s, recovery };
  }
  throw new Error('Failed to produce a signature.');
}

/** Pack {r,s,recovery} into a 65-byte 0x hex string (v = 27 + recovery). */
export function sigToHex({ r, s, recovery }) {
  return '0x' + toHex(bigTo32(r)) + toHex(bigTo32(s)) +
    (27 + (recovery & 0xff)).toString(16).padStart(2, '0');
}

/** Parse a 65-byte 0x hex signature → {r, s, recovery}. */
export function sigFromHex(hex) {
  const h = String(hex).trim().replace(/^0x/, '');
  if (h.length !== 130) throw new Error('Signature must be 65 bytes.');
  const r = BigInt('0x' + h.slice(0, 64));
  const s = BigInt('0x' + h.slice(64, 128));
  let v = parseInt(h.slice(128, 130), 16);
  if (v >= 27) v -= 27;                 // 27/28 → 0/1
  return { r, s, recovery: v & 1 };
}

// --- recover ----------------------------------------------------------------
/**
 * Recover the signer address from a 32-byte message hash + signature.
 * @param {Uint8Array} msgHash
 * @param {{r:bigint,s:bigint,recovery:number}} sig
 * @returns {string} 0x address (lowercase)
 */
export function recoverAddress(msgHash, sig) {
  const { r, s, recovery } = sig;
  if (r <= 0n || r >= N || s <= 0n || s >= N) throw new Error('Invalid signature scalars.');
  const z = bytesToBig(msgHash) % N;
  // R.x = r (we don't handle the rare r+N case); R.y parity from recovery bit 0.
  const x = r;
  const ySq = mod(x * x * x + 7n);
  let y = powmod(ySq, (P + 1n) / 4n, P);
  if ((y & 1n) !== BigInt(recovery & 1)) y = mod(P - y);
  const R = { x, y };
  // Q = r⁻¹ (s·R − z·G)
  const rInv = inv(r, N);
  const sR = pointMul(s, R);
  const zG = pointMul(mod(N - z, N), G);   // −z·G
  const Q = pointMul(rInv, pointAdd(sR, zG));
  if (Q === null) throw new Error('Recovery produced point at infinity.');
  return pubToAddress(Q);
}

/** EIP-55 checksummed address from a lowercase 0x address. */
export function toChecksumAddress(addr) {
  const a = String(addr).toLowerCase().replace(/^0x/, '');
  const hash = toHex(keccak256(new TextEncoder().encode(a)));
  let out = '0x';
  for (let i = 0; i < a.length; i++) {
    out += parseInt(hash[i], 16) >= 8 ? a[i].toUpperCase() : a[i];
  }
  return out;
}
