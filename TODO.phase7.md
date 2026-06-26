# Phase 7 — Pastebin-lite (community hosting backend)

Goal: a small **Cloudflare Worker + KV** service that hosts `p2present.json`
manifests behind short ids, wired into the app as a "Save & share" action and a
`?p=<id>` / `/p/<id>` player loader. Code-only — no deploy required this phase.

## Done
Phase 7 complete. `/service` Worker (Worker + KV) ships all routes with size cap,
rate limit, hashed edit tokens, expiry, public/unlisted, report + auto-hide, and
an optional IPFS mirror behind a flag (no secrets committed). The app gained a
**💾 Save & share** button (→ short `/p/<id>` link, edit token kept in-browser)
and `?p=<id>` / `/p/<id>` service loading (bundled demo names reserved). SERVICE.md
documents deploying the Worker + pointing a domain at it; HOSTING/README/DOCS
updated. **25/25 app unit + 23/23 Worker unit + 89/89 smoke** green. Not deployed.

## Tasks
- [x] `/service` Worker (`src/worker.js`, plain ESM JS):
  - [x] `POST /api/p` → `{ id, editToken, url }` (create)
  - [x] `GET  /api/p/:id` → manifest JSON (player fetches this)
  - [x] `GET  /p/:id` → 302 → the player at `/app/?p=<id>` (human link)
  - [x] `PUT  /api/p/:id` (Bearer edit token) → update
  - [x] `DELETE /api/p/:id` (Bearer edit token) → delete
  - [x] `POST /api/report` → record a report; auto-hide past a threshold
  - [x] optional expiry (`?ttl=`/`?expiry=`, KV `expirationTtl`)
  - [x] public / unlisted visibility
  - [x] size cap (413) + per-IP rate limit (429)
  - [x] edit tokens stored **hashed** (SHA-256) — never in plaintext
  - [x] CORS (so GitHub-Pages app can fetch cross-origin)
- [x] Optional IPFS mirror on save behind `IPFS_PIN=true` + `IPFS_PIN_TOKEN`
      secret (Pinata) — documented, never committed
- [x] `service/wrangler.toml`, `service/package.json`, `.dev.vars.example`, `.gitignore`
- [x] Worker handler tests (`service/test/worker.test.mjs`, `node:test` + mock KV)
- [x] App client `docs/src/service.js` (configurable base URL; default placeholder)
- [x] "Save & share" button in `/app/` → POST manifest → short `/p/<id>` link
- [x] Player loads `?p=<id>` / `/p/<id>` via the service (bundled demo names reserved)
- [x] `SERVICE.md` deploy guide + HOSTING/README updates (mark community backend)
- [x] App-integration smoke (mock service in the smoke server)
- [x] Verify: `npm test` (unit + worker) + `npm run smoke` — 390/780/1280, 0 real
      console errors, assets 200, static-only, light deps
- [x] Commit + push each step; write `.phase7.done`; telegram summary

## Notes
- Service base URL precedence (app): `?service=` → `window.__P2_SERVICE_BASE` →
  `<meta name="p2present:service">` → `localStorage['p2present:service']` →
  default `https://p2present.com`.
- Edit tokens are kept in the author's browser (`localStorage['p2present:tokens']`)
  so they can update later; the server only stores the hash.
- The Worker is the **community-hosting backend**; self-hosters deploy their own
  and point their domain at it (see SERVICE.md).
