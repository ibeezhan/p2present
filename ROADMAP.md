# p2present roadmap 🗺️

p2present is **open core**. The format, the player, the Builder, the Host helper,
and self-hosting are free and MIT-licensed — and always will be. The items below
are the *optional* services layered on top, built around a single principle:

> **Open core, free forever. You pay only to keep a talk alive beyond your own
> machine, or to verify its identity — never to use the player or the format.**

Each phase is additive and degrades gracefully: if a hosted service is gone, a
manifest with plain URLs / IPFS / WebTorrent sources still plays.

---

## ✅ Shipped (today)

The static player + format are done and in production:

- Synced bidirectional playback (scrub video → deck follows, and vice-versa).
- Any video source — **YouTube · MP4 · IPFS · WebTorrent** — with ordered fallback.
- **HTML / PDF / embed** decks.
- Subtitles (VTT/SRT), layout modes, fullscreen, deep-links + a share menu.
- **Visual Builder** (schema-validated `p2present.json`) and an in-browser **Host helper**.
- 100% static — fork it, drop content in `docs/content/`, enable GitHub Pages.

See [README](README.md) and [SPEC.md](SPEC.md) for the manifest format.

---

## v1 — Community manifest hosting (pastebin) · *coming*

A free place to publish a manifest when you don't want to run a server at all.

- Paste a `p2present.json` → get back a short, shareable link.
- One-click **"publish manifest"** from the Builder.
- Free tier, no account required.
- Assets stay wherever you put them (URL / IPFS / WebTorrent); only the small
  manifest is hosted.

**Why:** the lowest-friction way to share a talk page — nothing to deploy.

---

## v1.1 — Signed manifests · *coming*

Make a published manifest tamper-evident before any registry exists.

- Detached signatures over the canonical manifest bytes.
- The player can show a "signed by …" indicator and warn on mismatch.
- Works with plain keys today; forward-compatible with the v3 registry identities.

**Why:** integrity without trusting the host — the bytes you signed are the bytes
that play.

---

## v2 — Paid persistence (pluggable) · *coming*

Keep a talk online for good without seeding it from your laptop. The persistence
layer is a **pluggable backend** chosen per talk:

| Backend | Model | Notes |
|---|---|---|
| `arweave` *(default)* | **pay-once** | Permanent storage; one payment, no renewals. |
| `filecoin` | deal-based | Cold, verifiable storage deals. |
| `pinning` | subscription | Managed IPFS pinning (Pinata / web3.storage / self-run). |
| `seedbox` | subscription | Always-on WebTorrent seeding. |
| `s3` | pay-as-you-go | Plain object storage for the "just works" case. |

- **Arweave pay-once is the default**: pay once, the assets + manifest stay up.
- Optional ongoing **pinning / seedbox** add-ons keep IPFS & WebTorrent copies warm.
- Backend is declared in (or alongside) the manifest, so the player and tooling
  stay backend-agnostic.

**Why:** this is the one thing you genuinely *can't* get for free — durable hosting
when your machine is offline. Pay only for what persists.

---

## v3 — ENS CCIP-Read registry + EAS verification · *roadmap*

Human-readable, verifiable identities for talks and speakers.

- **ENS names** like `talks.you.eth` resolve to a speaker's catalog of talks.
- **Gasless resolution via CCIP-Read**: lookups are served offchain (ERC-3668),
  so resolving a name costs no gas and no transaction.
- **EAS attestations** vouch that a given manifest is authentic / published by
  that identity — composable, revocable, onchain-anchored trust.
- Ties back to **v1.1 signed manifests**: the signature key maps to the registry
  identity.

**Why:** so a shared link can *prove* who published it — "this really is that
speaker's talk" — without a central authority.

---

## Principles

- **Static-first.** The player never requires a backend; services are optional.
- **Graceful degradation.** Remove any hosted piece and plain-URL/p2p manifests still play.
- **No lock-in.** Pluggable persistence; portable, signed, self-describing manifests.
- **Pay for persistence & proof, not for software.** Open core, free forever.
