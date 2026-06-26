# Phase 6 — Homepage + Roadmap

Goal: a real landing page as the default route; the player moves to `/app`
(reachable via `/app`, `?demo`, and any legacy player query on `/`). Public
ROADMAP.md documenting the hosting/registry plan, linked from README + home.

## Tasks
- [x] Move player `docs/index.html` → `docs/app/index.html` (fix asset + nav paths)
- [x] Anchor bundled content to docs ROOT in `src/main.js` (path-independent); add `?demo`
- [x] Home page `docs/index.html` (hero / how-it-works / features / self-host / hosted+registry)
- [x] Landing styles `docs/home.css` (reuses app.css palette; responsive)
- [x] OG/meta tags + favicon on the home page; redirect legacy `?p=/?src=/?manifest=/?demo` → `/app`
- [x] `ROADMAP.md` at repo root (v1 → v3) linked from README + home
- [x] Update README links (player → `/app`, add ROADMAP)
- [x] Update `scripts/smoke.mjs`: player routes → `/app`; add home-page section
- [x] Verify: `npm test` (25/25) + `npm run smoke` (82/82) — 390/780/1280, 0 real console errors, assets 200
- [x] Commit + push each logical step; write `.phase6.done`; telegram summary+URL

## Done
Phase 6 complete. Home is the default route; player at `/app/` (also `?demo`,
plus legacy root player links redirect). ROADMAP.md added + linked. 25/25 unit +
82/82 smoke green.

## Notes
- Home: default route `/`. Player: `/app/`. Hero CTA deep-links `app/?p=moav-pdf`.
- Hosted/registry copy reflects the plan: pastebin manifest hosting (coming),
  pay-once persistence (Arweave default + pinning/seed, coming), ENS CCIP-Read
  registry + EAS attestations (roadmap). Framing: "open core free forever; pay
  only to keep it alive / verify it."
</content>
</invoke>
