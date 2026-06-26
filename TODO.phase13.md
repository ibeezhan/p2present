# Phase 13 — App UX polish + sources animation fix

Live: https://ibeezhan.github.io/p2present/  ·  App: /app/?p=demo

## Tasks
- [ ] **1. Time-slider seek while paused (YouTube).** Slider must be authoritative
      over the video at all times — seek even from a cold/unstarted/paused state.
      For YouTube: queue seek until API ready; `seekTo(t,true)`; on UNSTARTED/CUED
      land the frame with a play→pause kick (don't leave it playing). Preserve the
      user's desired play state. Regression test: `currentTime` tracks the slider
      from a cold start (no prior play). Verify live.
- [ ] **2. Center START overlay (logo-styled).** Large centered brand play mark
      over the player before playback; subtle hover float/scale/glow; click starts
      (play + sync); hides once playing; reappears on full reset. Reduced-motion ok.
- [ ] **3. Layout control → animated unfolding button.** Single button shows the
      current layout icon; click/hover unfolds (animated) to reveal the 4 modes;
      picking one collapses + updates the icon. Keyboard + aria; reduced-motion ok.
- [ ] **4. Sources animation rebuild.** "Plays from any source" climax: labeled
      source nodes at the edges stream packets/light along paths INTO the central
      player, intensifying with scroll. Directional (sources → player), coherent,
      performant. Reduced-motion → clean static "sources connected to player".

## Verify
- `npm test` (unit) + `npm run smoke` (headless 390/780/1280, 0 real console errs,
  assets 200, static-only, prefers-reduced-motion).
- Reproduce + confirm the slider fix on the live YouTube demo.

## Done
- implemented + verified + committed + pushed; write `.phase13.done`; telegram summary.
