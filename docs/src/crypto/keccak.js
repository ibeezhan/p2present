// keccak.js — a compact, dependency-free Keccak-256 (the hash Ethereum uses, NOT
// the FIPS-202 SHA3-256 variant — the only difference is the padding suffix).
//
// Implemented with BigInt lanes for clarity over speed: inputs here are tiny (a
// few-KB manifest, a 64-byte EIP-191 prefix), so correctness wins. Used by the
// secp256k1 address derivation + the EIP-191 personal_sign message hash, and by
// the ENS namehash for reverse resolution. Works identically in Node + browsers.

const MASK = (1n << 64n) - 1n;

// Round constants (24 rounds) and rho rotation offsets (lane index = x + 5*y).
const RC = [
  0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an, 0x8000000080008000n,
  0x000000000000808bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
  0x000000000000008an, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
  0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n,
  0x8000000000008002n, 0x8000000000000080n, 0x000000000000800an, 0x800000008000000an,
  0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n,
];
const ROT = [
  0, 1, 62, 28, 27, 36, 44, 6, 55, 20, 3, 10, 43, 25, 39,
  41, 45, 15, 21, 8, 18, 2, 61, 56, 14,
];

const rotl = (x, n) => n === 0 ? x : ((x << BigInt(n)) | (x >> BigInt(64 - n))) & MASK;

function keccakF(s) {
  const B = new Array(25);
  const C = new Array(5);
  const D = new Array(5);
  for (let round = 0; round < 24; round++) {
    // theta
    for (let x = 0; x < 5; x++) C[x] = s[x] ^ s[x + 5] ^ s[x + 10] ^ s[x + 15] ^ s[x + 20];
    for (let x = 0; x < 5; x++) {
      D[x] = C[(x + 4) % 5] ^ rotl(C[(x + 1) % 5], 1);
      for (let y = 0; y < 25; y += 5) s[x + y] ^= D[x];
    }
    // rho + pi
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        B[y + 5 * ((2 * x + 3 * y) % 5)] = rotl(s[x + 5 * y], ROT[x + 5 * y]);
      }
    }
    // chi
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        s[x + 5 * y] = B[x + 5 * y] ^ ((~B[(x + 1) % 5 + 5 * y]) & B[(x + 2) % 5 + 5 * y] & MASK);
      }
    }
    // iota
    s[0] ^= RC[round];
  }
}

/**
 * Keccak-256 of a Uint8Array (or array of bytes) → 32-byte Uint8Array.
 */
export function keccak256(input) {
  const bytes = input instanceof Uint8Array ? input : Uint8Array.from(input);
  const rate = 136;                 // 1088 bits for keccak-256
  const s = new Array(25).fill(0n);

  // Absorb full rate-sized blocks, padding the final one (pad10*1 with 0x01).
  const padded = new Uint8Array(Math.ceil((bytes.length + 1) / rate) * rate);
  padded.set(bytes);
  padded[bytes.length] ^= 0x01;     // domain/padding start bit
  padded[padded.length - 1] ^= 0x80; // padding end bit

  for (let off = 0; off < padded.length; off += rate) {
    for (let i = 0; i < rate / 8; i++) {
      let lane = 0n;
      for (let b = 7; b >= 0; b--) lane = (lane << 8n) | BigInt(padded[off + i * 8 + b]);
      s[i] ^= lane;
    }
    keccakF(s);
  }

  // Squeeze the first 32 bytes (little-endian lanes).
  const out = new Uint8Array(32);
  for (let i = 0; i < 4; i++) {
    let lane = s[i];
    for (let b = 0; b < 8; b++) { out[i * 8 + b] = Number(lane & 0xffn); lane >>= 8n; }
  }
  return out;
}

/** Convenience: keccak-256 of a UTF-8 string → 32-byte Uint8Array. */
export function keccak256Utf8(str) {
  return keccak256(new TextEncoder().encode(str));
}

/** Lowercase hex (no 0x) of a byte array. */
export function toHex(bytes) {
  let s = '';
  for (const b of bytes) s += b.toString(16).padStart(2, '0');
  return s;
}
