# p2present 🎞️

**A forkable web app for presentation pages where the slides and the talk video play back in sync.**

p2present is a tiny, dependency-light, **static** site (no server runtime). It has two faces from one repo:

1. **Resolver host** — a landing page with a source box. Paste a remote presentation manifest (an `https://…/manifest.json`) and it fetches the manifest + assets and renders the synced player. Content can live anywhere.
2. **Forkable self-host template** — fork the repo, drop your own slides + video + timing JSON into `docs/content/`, enable GitHub Pages, and you have your own instance.

**▶ Live demo:** https://ibeezhan.github.io/p2present/

The demo loads by default: the *"Rage-Coding the Mother of All VPNs"* deck (23 slides) synced to its [YouTube talk](https://www.youtube.com/watch?v=uYygWN1MZDE).

---

## What's in the box

- **Flexible player layout** — slides + video with a **draggable divider** and **four layout modes** (split · slides-focus · video-focus · overlap picture-in-picture), animated transitions, **fullscreen**, and a responsive mobile stack. The divider ratio, mode, and PiP position/size persist across visits. See [Layout controls](#layout-controls).
- **Bidirectional sync engine** — playing/scrubbing the video advances slides per the timing JSON; navigating slides (keyboard / wheel / click) seeks the video to that slide. A 🔗 toggle unlinks them. Sync keeps working in every layout mode.
- **Subtitles / captions** — load `.vtt` **and** `.srt` (converted in-browser) tracks; native HTML5 `<track>` on mp4, a synced overlay on YouTube, with a **CC menu** to pick language / off. See [Subtitles](#subtitles).
- **Pluggable deck adapters** — `html` (reveal.js-style / `<deck-stage>` web components, in an iframe) and `pdf` (rendered with pdf.js). Add more behind one interface.
- **Pluggable video providers** with **source fallback** — `youtube` (IFrame API) and `mp4` (HTML5 `<video>`); list several sources and the player uses the first that loads. `webtorrent` + `ipfs` are phase-2 interface stubs that gracefully fall through.
- **Modular slide transitions** — `cut` · `fade` · `slide` · `none`, in an extensible registry.
- **Polished controls** — play/pause, scrub-to-seek, slide counter, playback speed (0.75–2×), keyboard + mouse-wheel navigation, accessible labels, reduced-motion aware.

> **Manifest schema:** full reference in **[SPEC.md](SPEC.md)** with a validation [JSON Schema](docs/p2present.schema.json).

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

A presentation is one `manifest.json`. The current **`p2present.json` v1.0** schema (full reference + examples in **[SPEC.md](SPEC.md)**, machine-readable [`docs/p2present.schema.json`](docs/p2present.schema.json)):

```jsonc
{
  "p2present": "1.0",
  "title": "My Talk",
  "meta": { "author": "", "event": "", "date": "", "description": "" },
  "video": {
    "sources": [                                  // ordered fallback list
      { "provider": "youtube", "src": "uYygWN1MZDE" },
      { "provider": "mp4",     "src": "video/talk.mp4" }
    ],
    "poster": "video/poster.jpg"
  },
  "deck":  { "type": "html", "sources": [ { "src": "slides/index.html" } ], "slideCount": 23 },
  "timing": [                                      // inline array, OR a string path to an external JSON file
    { "time": 0.0,  "slide": 1, "transition": "cut"  },
    { "time": 12.5, "slide": 2, "transition": "fade" }
  ],
  "subtitles": [ { "lang": "en", "label": "English", "src": "subs/en.vtt", "default": true } ],
  "resolvers": { "ipfsGateways": ["https://{cid}.ipfs.dweb.link"], "webtorrentTrackers": ["wss://tracker.openwebtorrent.com"] },
  "layout": { "split": 0.6, "mode": "split", "transition": "fade" }
}
```

Highlights (see **[SPEC.md](SPEC.md)** for every field):

- **`video.sources`** — a fallback list; the player tries each until one loads (`youtube` + `mp4` work today; `webtorrent` + `ipfs` are phase-2 stubs that fall through). **`deck.sources`** is likewise a fallback list.
- **`timing`** — one cue per slide boundary; either inline, or a **string path to an external JSON file**. Each cue: `time` (float **seconds**, or `"HH:MM:SS.mmm"` / `"MM:SS"`), **1-based** `slide`, optional `transition` (`cut` | `fade` | `slide` | `none`) and `label`. Cues are sorted by time; the slide shown is the last cue whose `time` ≤ the video's current time.
- **`subtitles`** — `.vtt` / `.srt` caption tracks (see [Subtitles](#subtitles)).
- **`resolvers`** — override IPFS gateways / WebTorrent trackers for the phase-2 providers.
- **`layout`** — default split ratio + mode (see [Layout controls](#layout-controls)).
- Relative `src` values (deck, mp4, subtitles, poster, external timing) resolve against the **manifest's own URL**.

> **Backward compatible.** The original v0 manifest (`video.provider`/`video.src`, `deck.src`, `sync[]`) still loads unchanged — see [SPEC.md → Backward compatibility](SPEC.md#backward-compatibility).

---

## Layout controls

The control bar has a **layout-mode switcher** (and `m` cycles modes; `f` toggles fullscreen):

| Mode | What it does |
|------|--------------|
| **Split** (`▥`) | Slides + video side by side, with a **draggable divider** — grab the handle between the panes to resize. On portrait phones the split stacks vertically and the divider becomes a horizontal grab bar dragged **up/down**. |
| **Slides focus** (`▢`) | Slides large, video small on the side. |
| **Video focus** (`▣`) | Video large, slides small on the side. |
| **Overlap** (`◳`) | Slides fill the stage; the video floats as a **draggable, resizable picture-in-picture** (drag its title bar, resize from the corner grip). |

The mode switcher and fullscreen button are grouped under a labelled **Layout** cluster in the control bar. Mode changes animate smoothly, and keyboard / scroll / sync keep working in every mode. The divider ratio, current mode, and PiP geometry are saved to `localStorage` and restored on the next visit; the manifest's `layout.split` / `layout.mode` set the initial defaults.

The `⛶` button (or `f`) takes the whole player fullscreen. Where the browser supports the Fullscreen API it uses it; on iOS Safari — which doesn't expose fullscreen for arbitrary elements — it falls back to a CSS **maximized** full-viewport mode, so the button always works. `Esc` (or the button) exits.

### On mobile

The player is tuned for phones: panes use dynamic-viewport units (`dvh`/`svh`) so the iOS Safari toolbar can't break the height or cause a double scrollbar; every control is a ≥44px touch target; and the "Paste a manifest URL" bar collapses behind a small **Load URL** disclosure so the player gets the full screen. Both portrait and landscape are handled (landscape phones keep the side-by-side split).

---

## Subtitles

Add caption tracks under `subtitles[]`:

```jsonc
"subtitles": [
  { "lang": "en", "label": "English", "src": "subs/en.vtt", "format": "vtt", "default": true },
  { "lang": "fa", "label": "فارسی",   "src": "subs/fa.srt", "format": "srt" }
]
```

- Both **WebVTT** (`.vtt`) and **SubRip** (`.srt`) are accepted — `.srt` is converted to WebVTT in the browser at load. `format` is inferred from the extension if omitted.
- For the **mp4** provider, tracks are attached as native HTML5 `<track kind="subtitles">` and rendered by the browser. For **YouTube** (whose iframe can't take external tracks), p2present renders a synced caption **overlay** driven by the sync clock — positioned centred along the bottom of the video pane (readable in every layout mode, including the overlap PiP).
- A **CC** menu in the control bar picks the language or turns captions off; `"default": true` selects the track shown on load.
- The bundled demo ships a couple of **sample** cues (clearly marked as samples) under `docs/content/demo/subtitles/` so the feature is demonstrable — replace them with a real transcript when you fork.

### Generate a starter `timing[]` — `import-chapters`

Turn YouTube chapters or pasted timestamps into a `timing[]` array:

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
SPEC.md                   # canonical manifest schema reference
docs/                     # ← GitHub Pages root (served as-is, no build)
  index.html  app.css     # resolver shell + chrome styles
  p2present.schema.json   # JSON Schema for the v1.0 manifest
  .nojekyll               # keep! lets _ds/ assets through Pages
  src/
    main.js               # resolver: source → manifest → Player
    player.js             # layout modes + divider + fullscreen + controls + input
    sync.js               # bidirectional timeline engine
    subtitles.js          # vtt/srt parsing + caption rendering (track + overlay)
    manifest.js  time.js  # load/validate (v0 + v1); HH:MM:SS parser
    registry.js           # generic plugin registry
    decks/   { base, index, html-deck, pdf-deck }
    video/   { base, index, youtube, mp4, webtorrent*, ipfs* }   (* phase-2 stub)
    transitions/ { index, cut, fade, slide, none }
  content/demo/           # the bundled demo (deck + manifest + sample subtitles)
scripts/import-chapters.mjs
```

## License

MIT (see `LICENSE`). The bundled demo deck under `docs/content/demo/` belongs to its original author and is included for demonstration only — replace it with your own when you fork.
