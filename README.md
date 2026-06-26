# p2present 🎞️

**A forkable web app for presentation pages where the slides and the talk video play back in sync.**

p2present is a tiny, dependency-light, **static** site (no server runtime). It has two faces from one repo:

1. **Resolver host** — a landing page with a source box. Paste a remote presentation manifest (an `https://…/manifest.json`) and it fetches the manifest + assets and renders the synced player. Content can live anywhere.
2. **Forkable self-host template** — fork the repo, drop your own slides + video + timing JSON into `docs/content/`, enable GitHub Pages, and you have your own instance.

**▶ Live demo:** https://ibeezhan.github.io/p2present/

The demo loads by default: the *"Rage-Coding the Mother of All VPNs"* deck (23 slides) synced to its [YouTube talk](https://www.youtube.com/watch?v=uYygWN1MZDE).

---

## What's in the box

- **Side-by-side player** — slides + video, responsive (stacks on mobile).
- **Bidirectional sync engine** — playing/scrubbing the video advances slides per the timing JSON; navigating slides (keyboard / wheel / click) seeks the video to that slide. A 🔗 toggle unlinks them.
- **Pluggable deck adapters** — `html` (reveal.js-style / `<deck-stage>` web components, in an iframe) and `pdf` (rendered with pdf.js). Add more behind one interface.
- **Pluggable video providers** — `youtube` (IFrame API) and `mp4` (HTML5 `<video>`). `webtorrent` + `ipfs` are phase-2 interface stubs.
- **Modular slide transitions** — `cut` · `fade` · `slide` · `none`, in an extensible registry.
- **Polished controls** — play/pause, scrub-to-seek, slide counter, playback speed (0.75–2×), keyboard + mouse-wheel navigation, accessible labels, reduced-motion aware.

---

## Quick start (run locally)

No build step. Any static file server works:

```bash
git clone https://github.com/ibeezhan/p2present
cd p2present
npm run preview          # serves ./docs at http://localhost:5173  (uses `serve`)
# …or:  python3 -m http.server 5173 --directory docs
```

Open http://localhost:5173. The demo loads automatically.

> Modules are loaded via native ES modules and the YouTube/pdf.js libraries from a CDN, so you **must** serve over `http(s)` (opening `index.html` from `file://` won't work).

---

## Fork & self-host

The whole site is served from the **`docs/`** folder on GitHub Pages — no build, no Actions.

1. **Fork** this repo (or use it as a template).
2. **Add your content** under `docs/content/<your-talk>/`:
   - your slides (an HTML deck folder, or a single PDF),
   - a `manifest.json` (schema below).
3. **Point the demo at it** (optional): edit `DEFAULT_SOURCE` in `docs/src/main.js`, or just visit `?src=content/<your-talk>/manifest.json`.
4. **Enable Pages:** repo **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `docs`**. Save.
5. Your site goes live at `https://<you>.github.io/<repo>/`.

> ⚠️ **Keep the `docs/.nojekyll` file.** GitHub Pages runs Jekyll by default, which ignores files/folders that start with `_` (the demo deck ships a `_ds/` design-system folder). `.nojekyll` disables that.

You can also point the **resolver** at any remote manifest without forking the player: `https://ibeezhan.github.io/p2present/?src=https://your-host.example/manifest.json`. The remote host must send permissive **CORS** headers for the JSON and assets.

---

## Manifest & timing schema

A presentation is one `manifest.json`:

```jsonc
{
  "title": "My Talk",
  "video": { "provider": "youtube", "src": "uYygWN1MZDE" },   // provider: youtube | mp4
  "deck":  { "type": "html", "src": "slides/index.html" },     // type: html | pdf
  "sync": [
    { "time": 0.0,  "slide": 1, "transition": "cut"  },
    { "time": 12.5, "slide": 2, "transition": "fade" }
  ]
}
```

- **`video.src`** — for `youtube`, a video id or watch/`youtu.be` URL; for `mp4`, a URL to the file.
- **`deck.src`** — relative to the manifest's location (so a forked or remote manifest resolves its own assets), or an absolute URL.
- **`sync[]`** — one cue per slide boundary:
  - **`time`** — float **seconds** (sub-second precision). You may also write an `"HH:MM:SS.mmm"` / `"MM:SS"` string; it's parsed to seconds.
  - **`slide`** — **1-based** slide number.
  - **`transition`** — `cut` | `fade` | `slide` | `none` (optional, defaults to `cut`).
  - **`label`** — optional, for your own reference.

Cues are sorted by time automatically; the slide shown at any moment is the last cue whose `time` ≤ the video's current time.

### Generate a starter `sync[]` — `import-chapters`

Turn YouTube chapters or pasted timestamps into a `sync[]` array:

```bash
# From a yt-dlp .info.json (uses its "chapters" array):
yt-dlp --write-info-json --skip-download "https://youtu.be/uYygWN1MZDE"
node scripts/import-chapters.mjs uYygWN1MZDE.info.json

# From pasted "MM:SS Title" / "HH:MM:SS Title" lines:
pbpaste | node scripts/import-chapters.mjs
node scripts/import-chapters.mjs chapters.txt --transition fade

# Write the cues straight into a manifest (preserving its other keys):
node scripts/import-chapters.mjs talk.info.json --merge docs/content/demo/manifest.json
```

It emits one cue per chapter/timestamp, slides numbered `1..N` in order — adjust slide numbers and transitions to taste afterward.

---

## Extending

Everything domain-specific is a small module in a registry. The flow: `manifest → Player → { DeckAdapter, VideoProvider } ↔ SyncEngine`.

### Add a video provider
Create `docs/src/video/<name>.js` extending `BaseVideoProvider` (implement `load/play/pause/seek/getTime/getDuration/setRate/isPlaying/destroy`), then register it in `docs/src/video/index.js`:
```js
videoProviders.register('vimeo', VimeoProvider);
```
Use it with `"video": { "provider": "vimeo", "src": "…" }`. See `youtube.js` / `mp4.js` for reference.

### Add a deck type
Create `docs/src/decks/<name>.js` extending `BaseDeckAdapter` (implement `load`, `slideCount`, `currentSlide` (1-based), `goTo(slide, opts)`, and **emit `'slidechange'`** on internal navigation), then register in `docs/src/decks/index.js`:
```js
deckAdapters.register('mdx', MyMdxAdapter);
```
See `html-deck.js` (iframe + `<deck-stage>`/reveal.js/generic-sections) and `pdf-deck.js` (pdf.js).

### Add a transition
Create `docs/src/transitions/<name>.js` exporting `{ name, run({ incoming, outgoing, container, duration, direction }) }` (returns a Promise), then register in `docs/src/transitions/index.js`. Use it via a cue's `"transition"`.

---

## How sync stays loop-free

The engine derives the active slide purely from `slideAtTime(videoTime)`. When the deck reports an internal navigation, it seeks the video **only if** the video's current time doesn't already map to that slide — so video-driven slide changes never bounce back as seeks. The `🔗` toggle flips `linked` to decouple both directions.

> **Note on remote HTML decks:** same-origin decks (the demo, and your forked self-host) get full bidirectional control via the iframe's `contentWindow`. A *cross-origin* remote HTML deck can still report its slide changes (via `postMessage`) but can only be *pushed* by reloading at `#<index>` — host your deck same-origin for smooth sync.

---

## Phase-2 roadmap

- **WebTorrent video provider** — stream the talk from a magnet (`docs/src/video/webtorrent.js` stub).
- **IPFS video provider** — play from a CID via gateway or in-page Helia (`docs/src/video/ipfs.js` stub).
- **Resolver decentralisation** — paste a magnet / IPFS CID as the *source* (not just an `https` manifest) and resolve the whole presentation peer-to-peer (`resolveSource()` in `docs/src/main.js` already routes these with a "coming soon" notice).
- Per-slide notes / transcript track; thumbnail scrubber; deep-link to a slide/time.

---

## Project layout

```
docs/                     # ← GitHub Pages root (served as-is, no build)
  index.html  app.css     # resolver shell + chrome styles
  .nojekyll               # keep! lets _ds/ assets through Pages
  src/
    main.js               # resolver: source → manifest → Player
    player.js             # layout + controls + input
    sync.js               # bidirectional timeline engine
    manifest.js  time.js  # load/validate; HH:MM:SS parser
    registry.js           # generic plugin registry
    decks/   { base, index, html-deck, pdf-deck }
    video/   { base, index, youtube, mp4, webtorrent*, ipfs* }   (* phase-2 stub)
    transitions/ { index, cut, fade, slide, none }
  content/demo/           # the bundled demo (deck + manifest)
scripts/import-chapters.mjs
```

## License

MIT (see `LICENSE`). The bundled demo deck under `docs/content/demo/` belongs to its original author and is included for demonstration only — replace it with your own when you fork.
