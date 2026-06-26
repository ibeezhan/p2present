// base64url.js — byte-array ⇄ base64url (RFC 4648 §5, no padding). Used for the
// Ed25519 public key + signature fields in a manifest's `sig` block. Works in
// the browser (btoa/atob) and Node (Buffer) without a build step.

export function bytesToB64url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = (typeof btoa === 'function')
    ? btoa(bin)
    : Buffer.from(bytes).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function b64urlToBytes(str) {
  const norm = String(str).replace(/-/g, '+').replace(/_/g, '/').replace(/\s+/g, '');
  if (typeof atob === 'function') {
    const bin = atob(norm);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(norm, 'base64'));
}
