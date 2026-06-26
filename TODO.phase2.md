# p2present — Phase 2 build checklist

Resumable overnight job. On each relaunch: `git log --oneline -15`, read this file, continue.
Commit + push to `main` after each meaningful step (Pages auto-redeploys).

## A. Cleanup (v0 removal)
- [x] manifest.js: drop v0 paths; v1 only (loadPresentation + normaliseManifest).
- [x] manifest.js: removed `version` detection + v0 comments.
- [x] SPEC.md: deleted "Backward compatibility"; added Source transports + Loading & sharing.
- [x] schema: removed v0 mention; updated provider descriptions.
- [x] demo manifest already pure v1 — verified.
- [x] swept stale comments.

## B. Fullscreen auto-hide controls
- [x] Immersive: controls become a fixed overlay (no reflow); cursor hidden with bar.
- [x] Auto-hide; reveal on pointermove + tap + key; fade out after 2.5s; smooth fade. (smoke ✓)

## C. Phase 2 — P2P / decentralized providers
- [x] resolve.js: ipfs/magnet helpers, gateways/trackers, fetchFirstOk, webtorrent fetch, base64.
- [x] WebTorrent provider: magnet → file.renderTo(<video>); trackers from resolvers; graceful fallback.
- [x] IPFS provider: ipfs:// → gateway fallback list into <video>; graceful fallback. (smoke ✓)
- [x] Deck over P2P: ipfs:// (gateway URLs) + magnet: (webtorrent blob) in html/pdf adapters.
- [x] main.js routing: https / ipfs:// / magnet: as SOURCE; "coming soon" removed. (smoke ✓)
- [x] base64/query-arg: ?manifest= / ?src=<base64 inline-or-source> / ?p=<local>. (smoke ✓)
- [x] Share-link button → ?src=<base64>. (UI shipped)
- [x] Self-hosted plain-URL: no hard gateway dependency (verified via local mp4 fixture).

## D. Docs
- [x] SPEC.md: transports, resolvers, base64/query-arg, share-link scheme; v0 removed.
- [x] README: phase-2 features, per-protocol loading, screenshots, roadmap marked done.
- [x] schema in sync.

## E. Screenshots per protocol
- [x] Headless capture: youtube demo (1280/780/390), mp4 (fallback), fullscreen overlay, ipfs:// + magnet: resolver states.
- [x] Saved to docs/screenshots/, embedded in README, headless limitation noted.

## VERIFY
- [x] Unit tests 15/15 (recognisers, ipfs urls, base64, manifest normalise, fallback expansion).
- [x] Headless smoke 21/21 @ 390/780/1280: routing, fallback, auto-hide, modes, subs, 0 console errors, assets 200.

## DONE gate (all true, committed AND pushed)
- [ ] write .phase2.done (one-line summary)
- [ ] telegram: openclaw message send --channel telegram --target '-5269558152' --message '<summary + live URL>'

---
### Progress log
- (init) Read full codebase. webtorrent.js/ipfs.js were throwing stubs. Network OK.
- A+C+B implemented: resolve.js, real providers, P2P decks, routing, base64/share, auto-hide.
- Docs: SPEC/README/schema updated, v0 removed.
- Tests: scripts/test.mjs (15/15) + scripts/smoke.mjs (21/21, system Chrome). Screenshots captured.
- webtorrent pinned to v1.9.7 UMD bundle (verified window.WebTorrent constructor in-browser).
- Remaining: final push + verify on Pages, then .phase2.done + telegram.
</content>
