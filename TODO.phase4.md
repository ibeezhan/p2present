# Phase 4 — polish + bugfix

Resumable checklist. Commit + push each step.

## 1. PDF deck black-slide bug (priority) ✅
- [x] Reproduce in headless Chrome (measure brightness — visible:0 / opacity:0)
- [x] Root cause: persisted WAAPI fill:'both' opacity:0 + cut only toggling display + overlapping transitions
- [x] Fix: adapter commits canonical visibility per nav, nav token guards overlap, absolute-stacked pages
- [x] Regression: smoke walks 7 slides + rapid burst, asserts non-blank/visible

## 2. Layout icons — meaningful glyphs + labels ✅
- [x] SVG glyphs depict each mode (split/slides/video/PiP/fullscreen)
- [x] aria-labels + tooltips + short text labels (hidden on narrow)
- [x] keep "LAYOUT" group

## 3. Subtitles label + full-window overlay ✅
- [x] Rename "CC" → "Subtitles" (icon button + tooltip + aria)
- [x] Placement setting: full window vs over video (layout.captionPlacement, default window)
- [x] Full-window overlay on stage, bottom-center, all modes incl fullscreen; persisted toggle
- [x] default 'window'; docs pending in Docs step

## 4. Builder: deck source selection ✅
- [x] deck.type: html / pdf / embed (dropdown)
- [x] deck.sources[] rows with protocol dropdown (https/ipfs/webtorrent)
- [x] minimal embed deck adapter (iframe, display-only + opt-in deep-link) + schema
- [x] docs pending in Docs step

## 5. Share UX (YouTube-style) ✅
- [x] Remove standalone "This spot" button
- [x] Share button → popover: "Copy presentation link" / "Copy link to this moment"
- [x] copies to clipboard with confirmation; closes on outside-click/Esc/copy

## Docs
- [ ] README/SPEC/AUTHORING/schema: embed deck, subtitle full-window, share menu, layout glyphs

## Verify
- [ ] unit + headless smoke 390/780/1280, 0 real console errors, assets 200

## Done
- [ ] .phase4.done + telegram
