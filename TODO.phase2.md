# p2present — Phase 2 build checklist

Resumable overnight job. On each relaunch: `git log --oneline -15`, read this file, continue.
Commit + push to `main` after each meaningful step (Pages auto-redeploys).

## A. Cleanup (v0 removal)
- [ ] manifest.js: drop v0 paths (video.provider/src single, deck.src single, bare top-level sync[]). v1 only.
- [ ] manifest.js: remove `version` legacy detection + v0 comments.
- [ ] SPEC.md: delete "Backward compatibility" section + "still loads unchanged" comments.
- [ ] schema: remove v0 mention in description.
- [ ] demo manifest already pure v1 — verify.
- [ ] sweep adjacent dead code / stale comments.

## B. Fullscreen auto-hide controls
- [ ] In fullscreen/maximized: controls become a fixed/absolute overlay (no reflow of slides/video).
- [ ] Auto-hide; reveal on mousemove + tap; fade out after ~2.5s; smooth fade.

## C. Phase 2 — P2P / decentralized providers
- [ ] resolve.js: shared ipfs/magnet helpers + default gateways/trackers + gateway-fetch + webtorrent-fetch.
- [ ] WebTorrent video provider (real): magnet → stream into <video> via file.renderTo; trackers from resolvers; graceful fallback.
- [ ] IPFS video provider (real): ipfs:// CID → gateway fallback list into <video>; graceful fallback.
- [ ] Deck over P2P: deck.sources may be ipfs:// (gateway URLs) or magnet: (webtorrent blob) → iframe/pdf.
- [ ] main.js resolver routing: https / ipfs:// / magnet: as the SOURCE (manifest + assets). Remove "coming soon".
- [ ] base64/query-arg loading: ?manifest=<url>, ?src=<base64 inline-or-source>, ?p=<local name>.
- [ ] Share-link button → builds ?src=<base64> for current presentation.
- [ ] Self-hosted plain-URL story verified (no hard gateway dependency).

## D. Docs
- [ ] SPEC.md: source types, resolvers, base64/query-arg formats, share-link scheme; remove v0.
- [ ] README: phase-2 features, load-from-each-protocol, screenshots, updated roadmap.
- [ ] schema in sync with additions.

## E. Screenshots per protocol
- [ ] Headless capture: https/youtube demo, mp4, resolver UI states for ipfs:// and magnet: (input + loading/fallback).
- [ ] Save to docs/screenshots/, embed in README, note any headless limitations.

## VERIFY (each relaunch before done)
- [ ] Unit tests (resolver routing, base64, ipfs url build, manifest normalise, provider fallback).
- [ ] Headless smoke @ 390/780/1280: routing, fallback, fullscreen auto-hide, layout modes, subtitles, 0 console errors, assets 200.

## DONE gate (all true, committed AND pushed)
- [ ] write .phase2.done (one-line summary)
- [ ] telegram: openclaw message send --channel telegram --target '-5269558152' --message '<summary + live URL>'

---
### Progress log
- (init) Read full codebase. webtorrent.js/ipfs.js are stubs that throw. Network OK (jsdelivr/esm.sh/yt 200; ipfs.io slow).
</content>
