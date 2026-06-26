# Phase 11 — Homepage Copy + Animation Refinement

Only touch the LANDING page (`/` → `docs/index.html`, `docs/home.css`, `docs/home.js`)
and its smoke assertions. The `/app` player and `/docs` hub stay as-is.

## Owner goals
1. Remove redundant action/label text ("Scroll to watch it morph", drag/scroll
   narration). Keep at most a tiny animated scroll-cue glyph — no sentence labels.
2. Extend the scroll-morph into the "plays from any source" section — one
   continuous journey: source nodes (YouTube, MP4/HTTP, IPFS, WebTorrent, Arweave)
   glow and stream light/packets INTO the player mock.
3. Less text, more motion. Cut copy hard. Every section = short evocative line + motion.
4. Rewrite all copy: confident, alive, non-technical. Kill "write one small JSON file"
   and ALL manifest/JSON/mechanics from the landing page (that lives in /docs).
   - Hero headline: "Presentations that play themselves."
   - Subline: "Your slides and your talk, in perfect sync — scrub to any moment, together."
   - Primary CTA: "▶ Load a demo"
   - Replace the deck+JSON+link explainer with a near-wordless 3-beat: Bring → Sync → Share.
5. Keep it gorgeous, dark, cinematic, performant, mobile-graceful. Keep the demo picker.

## Tasks
- [x] Hero: new headline/subline, kill `.sub` JSON explainer, add Bring→Sync→Share beats
- [x] Hero: strip "Scroll to watch it morph" text → glyph-only scroll cue
- [x] Extend showcase track to a 5th phase: source constellation streaming into the player
- [x] Build animated source nodes + SVG light streams (5 sources) feeding the player mock
- [x] Fold the standalone `#sources` card grid into the journey climax (delete old grid)
- [x] Kept-alive: trim to one line + keep rings + keep a ROADMAP link + roadmap pills
- [x] Open-source: cut the git/npm code block (mechanics → /docs), one line + pills + visual
- [x] Final CTA: trim to one line
- [x] Update OG/meta description (drop p2p/jargon-heavy phrasing where dry)
- [x] Update `scripts/smoke.mjs` home assertions (tagline, sources, no-mechanics)
- [x] Reduced-motion + `<noscript>` fallbacks for the new source field
- [x] Verify: `npm test` + `npm run smoke` (0 console errors, assets 200, 390/780/1280)
- [x] Commit + push to main each step
- [x] Write `.phase11.done`
- [x] Telegram summary + URL

## Constraints
- Static-only, light deps (Lenis already vendored). 60fps, perf-budgeted, no jank.
- Respect `prefers-reduced-motion` (static fallback). Mobile graceful, no h-overflow at 390.
- Never surface JSON/manifest/git mechanics on the landing page.
