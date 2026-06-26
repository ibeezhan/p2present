# Authoring a presentation, start to finish

This guide walks the whole workflow: **make slides → host the assets → build the
manifest → share**. It ties together the [Builder](https://ibeezhan.github.io/p2present/builder/),
the [Host helper](https://ibeezhan.github.io/p2present/host/), the
[hosting guide](HOSTING.md), and the [manifest spec](SPEC.md).

A finished presentation is one small JSON file — `p2present.json` — that points at
a **talk video**, a **slide deck**, and a **timing** map between them. Everything
else (subtitles, thumbnails, layout) is optional.

```
slides + video  ─▶  host the assets  ─▶  p2present.json  ─▶  share a link
   (you make)        (URLs/IPFS/WT)        (the Builder)       (?src= / #t=)
```

---

## Step 1 — Make your slides + record the talk

**Slides** can be either:

- an **HTML deck** — a folder with an `index.html`. Works great with
  [reveal.js](https://revealjs.com/), the bundled `<deck-stage>` web component, or
  any page whose top-level `<section>`s are slides. Same-origin HTML decks get
  full two-way control (the player can drive them *and* hear their navigation).
- a **PDF** — any slide PDF (one page per slide). Rendered with pdf.js; no tooling
  needed. The [PDF demo](https://ibeezhan.github.io/p2present/?p=moav-pdf) is built
  exactly this way.

**Video** is your talk recording. The lowest-effort path is **YouTube** (just use
the video id). You can also host an `mp4` yourself, or put it on IPFS / WebTorrent
(Step 2).

> Tip: keep the slide order identical between your deck and the video so the
> 1-based slide numbers in `timing` line up cleanly.

---

## Step 2 — Host the assets

Each asset becomes a `src` in the manifest. You have three options per asset —
mix freely (see [HOSTING.md](HOSTING.md) for the full detail):

1. **Plain URL** — drop files on any static host (your server, a CDN, GitHub
   Pages). Reference them by `https://…`. Relative paths work too if the manifest
   ships alongside the files.
2. **IPFS** — content-addressed + durable when pinned. On the
   [Host helper](https://ibeezhan.github.io/p2present/host/), pick **Pin to IPFS**,
   paste your own Pinata/web3.storage token (stored only in your browser), upload a
   file, and copy the `ipfs://<cid>` reference.
3. **WebTorrent** — peer-to-peer. On the Host helper, pick **Seed via WebTorrent**,
   choose a file, and copy the `magnet:` URI (the tab seeds while open; use
   `webtorrent-cli` for always-on seeding).

YouTube needs no hosting — just the id. References you produce on the Host page are
remembered and surface in the Builder's **📦 Hosted references** card, so you can
paste them straight into a source field.

---

## Step 3 — Build the manifest

Open the **[Builder](https://ibeezhan.github.io/p2present/builder/)**. It writes a
valid `p2present.json` for you, with a live JSON preview and **schema validation**
(green ✓ / listed issues) as you type.

1. **Title & metadata** — title, author, event, date.
2. **Video sources** — add one row per source (`youtube` / `mp4` / `webtorrent` /
   `ipfs`) with its `src`. Multiple rows = an ordered **fallback list**; the player
   tries each until one loads. Paste the references from Step 2 here.
3. **Deck** — choose `html` or `pdf`, add the deck `src`(s).
4. **Timing** — the slide↔video map. Add a cue per slide boundary with a `time`
   (seconds or `MM:SS`), a 1-based `slide`, and a transition. The fastest way:
   - Click **🎬 Open timing-capture player** to mount the real player inside the
     Builder.
   - Play the video; when it reaches a slide boundary, click
     **📍 Stamp current time → slide**. It appends a cue for the current
     time + current slide. Repeat for each slide, then tidy up.
   - Or generate a starter `timing[]` from chapter markers with
     `scripts/import-chapters.mjs` (see the [README](README.md#generate-a-starter-timing--import-chapters)).
5. **Subtitles** *(optional)* — add `.vtt`/`.srt` tracks with a language + label.
6. **Resolvers / Layout** *(optional)* — custom IPFS gateways / WebTorrent
   trackers, and the default split / mode / transition.

When the badge shows **✓ valid**, you're done. Use:

- **▶ Open in player** — preview it immediately (encoded as a `?src=` link).
- **⬇ Download** — save `p2present.json`.
- **📋 Copy JSON** — copy it to paste elsewhere.

> Editing an existing deck? Use **Load demo**, **Upload JSON…**, or paste a
> manifest into the Builder's *Load / start over* card to edit it.

### Or write it by hand

The manifest is small enough to hand-author against [SPEC.md](SPEC.md). Minimal
example:

```json
{
  "p2present": "1.0",
  "title": "My talk",
  "video": { "sources": [{ "provider": "youtube", "src": "uYygWN1MZDE" }] },
  "deck":  { "type": "pdf", "sources": [{ "src": "slides.pdf" }], "slideCount": 23 },
  "timing": [
    { "time": 0,  "slide": 1 },
    { "time": 70, "slide": 2, "transition": "fade" }
  ]
}
```

Validate it with any draft-07 validator:

```bash
npx --yes ajv-cli validate -s docs/p2present.schema.json -d p2present.json
```

---

## Step 4 — Publish & share

You have two ways to get the presentation in front of people:

**A. Self-host (forking).** Put `p2present.json` and its local assets under
`docs/content/<your-talk>/` in your fork, enable GitHub Pages, and link
`…/?p=<your-talk>`. This is the durable, canonical URL. See
[README → Fork & self-host](README.md#fork--self-host).

**B. Share a link (no fork).** From the player, the **🔗 Share** button copies a
self-contained `?src=<base64>` link that carries the whole manifest — anyone can
open it on the public player at `ibeezhan.github.io/p2present`. (Inline manifests
must use **absolute** asset URLs, since there's no manifest folder to resolve
relative paths against.)

**Deep-link to a moment.** The **📍 This spot** button copies a link with a
`#t=<seconds>&slide=<n>` hash so it opens right where you are — perfect for
"watch from here". See [SPEC → Deep-links](SPEC.md#deep-links-tslide).

---

## Checklist

- [ ] Slides exist as an HTML folder or a PDF
- [ ] Talk video is on YouTube / mp4 / IPFS / WebTorrent
- [ ] Every asset has a working reference (try **Open in player**)
- [ ] `timing[]` covers each slide boundary, sorted by time
- [ ] Manifest shows **✓ valid** in the Builder
- [ ] (optional) subtitles + thumbnails added
- [ ] Published under `?p=…` (fork) or shared as a `?src=…` link

Stuck on where to put assets? → [HOSTING.md](HOSTING.md). Need a field reference?
→ [SPEC.md](SPEC.md).
