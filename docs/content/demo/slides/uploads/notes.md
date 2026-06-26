# Notes & Research — "Rage-Coding the Mother of All VPNs" (Berlin talk)

Durable scratchpad behind `moav-berlin-talk-full.md`. Two parts:
1. The verbatim brief + feedback that drove this rewrite.
2. The organized research dump (Iran timeline, fact-check table, Nedagram spec, offline-payments state of the art).

---

## Part 1 — Verbatim brief & feedback (this session)

### 1a. The draft plan provided for refinement

> # Plan: Rework the Berlin talk into "Build for the Blackout"
>
> ## Context
>
> Shayan is giving a 20-min talk at the Web3Privacy Neocypherpunk Summit (Funkhaus, Berlin, June 14 2026). The current draft (`moav-berlin-talk-full.md`) is solid but (a) muddles the 2026 shutdown timeline, (b) has zero of the deeper Iran shutdown history, (c) misuses "Nedagram" as a fictional social platform when it's actually Shayan's real audio-modem project, (d) under-develops the strongest new themes he wants front-and-center: web3 abandoning its censorship-resistance promise, offline/semi-offline payments, exotic routing, and a crisis-first build ethos. He wants the talk made richer and more factual.
>
> **Decisions locked in (via Q&A):**
> - **Director's cut**: write the full enriched version (~25–30 min of material) with explicit "cut if running long" markers so he trims live.
> - **Update `moav-berlin-talk-full.md` in place** (git history preserves the old version).
> - **Retitle to "Build for the Blackout"** (keep a "mad scientist shit" phrase in the subtitle/body — it's the through-line).
> - Also dump the raw prompt + research notes into `Assets/notes.md`.
>
> ## Research findings to bake in (verified)
>
> **nedagram** (local repo `../nedagram`, site nedagram.com) — CONFIRMS Shayan's description. A PWA soft-modem that encodes text → MFSK audio for transmission over a phone call or speaker→mic, fully offline after first load. Phone mode: 4-MFSK at 800/1300/1800/2300 Hz, ~20–25 bps; wideband: 16-MFSK, ~50–60 bps. FEC is **concatenated Reed-Solomon (outer, 16 parity bytes) + k=7 rate-2/3 convolutional inner with soft-decision Viterbi** — the same concatenated scheme NASA Voyager used. ChaCha20-Poly1305 optional encryption. Purpose-built to share VPN configs when internet is cut but voice calls survive. ~6 min to send 1 KB over a phone call. This is the flagship "mad scientist" artifact.
>
> **Iran shutdown history (sourced):**
> - 2009 Green Movement — filtering/throttling + SMS kill, not a total blackout.
> - Nov 2019 "Bloody Aban" — ~week-long, ~96% of networks down (most severe NetBlocks had tracked); ~1,500 killed (Reuters/Amnesty); NIN domestic intranet stayed up.
> - Sept 2022 Woman, Life, Freedom (Mahsa/Jina Amini) — rolling mobile shutdowns, Instagram/WhatsApp blocked, VPN/Starlink surge; ≥551 killed (HRANA).
> - June 2025 "12-Day War" (Israel–Iran) — near-total blackout, traffic collapsed ~97–98%; ~4–6 days.
> - 2026 — **two rounds this year**: (1) Jan ~8 onward, dark — telephone, internet, SMS all off, NIN also down (unprecedented); partial restoration after a death toll disputed at 30,000–70,000. (2) **Feb 28 → 88 days**, back as a ~60% unstable mess ~May 26; VPN demand +934% the day it returned (Top10VPN). Reports of a planned permanent break from the global internet / Chinese shutdown hardware pre-installed. **Next blackout treated as inevitable.**
>
> **Factual corrections to make (Shayan asked for accuracy):**
> - GooseRelay → routes through **Google Apps Script** (not the Drive API). Project: Kianmhz/GooseRelayVPN.
> - BaleVPN → masquerades as **Bale WebRTC call media (RTP via a LiveKit SFU)**, not literally a "voice call." Keep it accessible ("looks like a Bale call") but accurate.
> - SNI spoofing → **drop the hCaptcha-bypass claim** (unsupported); it defeats SNI-based DPI blocking.
> - Power-line comms → real (HomePlug/G3-PLC), but **building-scale only — cannot cross a transformer**. Frame as in-building/same-transformer mesh, not neighborhood.
> - "TCP over git commits" → frame honestly as a covert-channel **technique/PoC**, not a shipping product; GitHub Actions-as-relay likewise PoC. wa-tunnel (TCP over WhatsApp) is real but **high account-ban risk**.
> - Offline payments → Cashu is closest (Chaumian ecash) but **mint must be online to stop double-spend for untrusted transfers**, and it's Bitcoin/Lightning-only + complex. Bitcoin has clean air-gapped signing (PSBT/BIP-174); **most EVM/web3 wallets have no user-facing "export signed tx for out-of-band broadcast"** (possible only programmatically). No shipping offline-stablecoin product — Visa/CBDC offline pilots use secure-element double-spend prevention; ZK + escrow/state-channel approaches are research/early-pilot. The fundamental constraint: preventing double-spend without a connected ledger needs hardware trust or a trusted intermediary.
>
> *(The remainder of the draft plan — the slide-by-slide rewrite spec, new-file spec, critical files, and verification steps — is preserved in the approved plan file and reflected directly in `moav-berlin-talk-full.md`.)*

### 1b. Feedback that changed the plan

**On the title** (re: "Build for the Blackout"):
> still not sure about the title, I want it more punchy. I have 2 talks within a week about this and these are the tentative topics submitted: "Rage-coding the mother of all VPNs" and "We Promised Decentralization, but We Forgot to Build the Infrastructure." but open to ideas.

→ **Resolved:** title = **"RAGE-CODING THE MOTHER OF ALL VPNs"**, subtitle **"(the mad scientist shit that matters)"**.

**On rage coding** (personal note to weave in):
> Some notes here, as an Iranian Diaspora that has been teaching Farsi speakers on the blockchain tech over a decade, I found myself useless, helpless, with none of my messages to my friends and family being even delivered. These were dark days, and I found rage coding as a channel to feel useful, not to build for a better financial future for myself, but build for a better now for anyone who needs it. did not have any hope that it will work, but it did eventually, and it didn't (with the full internet shutdown in March and after, I was fully defeated, felt like a failure, went for a walk for a few days, and came back and continued bug fixing and adding protocols. and again it did start to work in May...)

→ **Resolved:** woven into **Slide 7 (Rage Coding)** as one sustained first-person beat. The personal Feb→May arc deliberately mirrors the macro timeline (Slides 2–3).

---

## Part 2 — Organized research dump

### 2a. Iran internet shutdown timeline (with sources)

| When | Event | Severity | Deaths | Notes / source |
|---|---|---|---|---|
| 2009 | Green Movement | Filtering, throttling, SMS killed — **not** a total blackout | — | First large-scale info-control episode |
| Nov 2019 | "Bloody Aban" (fuel protests) | ~week-long, ~96% of networks down (most severe NetBlocks had tracked at the time); NIN domestic intranet stayed up | ~1,500 | Reuters (Dec 2019 special report), Amnesty International; NetBlocks |
| Sept 2022 | Woman, Life, Freedom (Mahsa/Jina Amini) | Rolling mobile shutdowns; Instagram/WhatsApp blocked; VPN + Starlink surge | ≥551 | HRANA (Human Rights Activists News Agency); NetBlocks |
| June 2025 | "12-Day War" (Israel–Iran) | Near-total blackout; international traffic −97/98%; ~4–6 days | — | NetBlocks / Kentik |
| **Jan ~8 2026** | Round 1 | Fully dark — telephone, internet, SMS all off; **NIN also down (unprecedented)**; partial restoration after | disputed **30,000–70,000** | Death toll disputed *because* of the blackout |
| **Feb 28 2026** | Round 2 | Dark **88 days**; returned ~May 26 at ~**60% unstable/erratic** ("zigzagging") | — | Doug Madory / Kentik. VPN demand **+934%** the day it returned (Top10VPN) |

**Other VPN-demand spikes (Top10VPN), useful for the "global pattern" beat:** Uganda +2,557% (Jan 2026 election), Nepal +2,892% (Sep 2025), UK +1,987% (Jul 2025 age verification).

**Forward-looking:** credible reports of a planned permanent disconnection from the global internet, Chinese shutdown hardware pre-installed. Treat the next blackout as inevitable.

### 2b. Technical fact-check table (real vs PoC vs theoretical + corrections)

| Claim / tool | Status | Accurate framing | Correction from old draft |
|---|---|---|---|
| SNI Spoofing | **WORKS** | Sends a decoy ClientHello; defeats **SNI-based DPI** blocking | **Drop** the "bypasses hCaptcha" claim — unsupported |
| GooseRelay | **WORKS** | Traffic exits via **Google Apps Script** (`script.google.com`) | Not the Drive API. Repo: `Kianmhz/GooseRelayVPN` |
| BaleVPN | **WORKS** | Rides **Bale's own WebRTC call media (RTP via a LiveKit SFU)** | Not literally a "voice call" — it's the app's real WebRTC media path. Repo: `kookoo1sabzy/BaleVPN` |
| DNS tunnels (dnstt/Slipstream/MasterDNS/XDNS) | **WORKS** | Four tunnels, one port (port 53, routed by subdomain via `dns-router`) | The "floor" — censors won't kill DNS |
| TCP over git commits | **PoC** | Covert channel; GitHub too big to block; kB/s | Not a shipping product |
| GitHub Actions as relay | **PoC** | Workflow fetches blocked URL → artifact → download | Not a shipping product |
| TCP over WhatsApp (wa-tunnel) | **WORKS — ban risk** | Real, tunnels via WhatsApp Web | **High account-ban risk** — warn users |
| Power-line comms (HomePlug / G3-PLC) | **WORKS — in-building only** | Data over the mains; building / same-transformer scale | **Cannot cross a transformer.** Not a neighborhood mesh |

### 2c. Nedagram technical spec

- **What it is:** PWA soft-modem. Encodes text → MFSK audio for transmission over a **phone call** or **speaker→mic**. Fully offline after first load (PWA).
- **Modes:**
  - Phone mode: **4-MFSK** at 800 / 1300 / 1800 / 2300 Hz, ~**20–25 bps**.
  - Wideband mode: **16-MFSK**, ~**50–60 bps**.
- **FEC:** concatenated — **Reed–Solomon outer (16 parity bytes)** + **k=7, rate-2/3 convolutional inner with soft-decision Viterbi**. This is the **same class of concatenated coding NASA flew on Voyager**.
- **Crypto:** optional **ChaCha20-Poly1305**.
- **Purpose:** share VPN configs (or any short text) when the internet is cut but **voice calls still work**.
- **Throughput:** ~**6 minutes to send 1 KB** over a phone call.
- Site: nedagram.com. (This is Shayan's real project — **not** a social platform. The old draft misused the name; that usage is fully removed.)

### 2d. Offline payments — state of the art

Core idea: **a signed transaction is just data; any channel that carries data can carry it** (Nedagram, WhatsApp, git, SMS) to a connected node that broadcasts it.

- **Cashu (Chaumian ecash):** closest thing that works. But Bitcoin/Lightning-only, complex, and the **mint must be online to prevent double-spending** for transfers between untrusting parties.
- **Bitcoin air-gapped signing:** clean — **PSBT / BIP-174**. Sign offline, broadcast later.
- **EVM / most Web3 wallets:** **no user-facing "export signed tx for out-of-band broadcast."** Possible programmatically, but no button — so during a blackout you hold keys to money you can't move. Total failure, no recourse.
- **Stablecoins offline:** unsolved. No shipping product.
- **Industry pilots:** Visa / CBDC offline efforts use **secure-element hardware** for double-spend prevention. ZK + escrow / state-channel approaches are research / early-pilot.
- **The hard wall:** preventing double-spend **without a connected ledger** requires either **hardware you trust** or a **trusted intermediary**. No way around it with software alone.
- **Asks for the room:** (1) export-and-relay (let wallets export a signed tx to carry out-of-band); (2) ZK + escrow/state-channel locking for safe small-value offline transfers.

### 2e. Mesh / local comms inventory (Slide 12)

- **DeltaChat** — email as transport, chat UX, no central server.
- **Matrix** — local homeserver on a LAN, no global internet needed.
- **Jitsi** — P2P video over local network.
- **bitchat** — Bluetooth mesh messaging.
- **Nedagram** — audio gap (phone-call modem).
- **LoRa / Meshtastic / wifi mesh** — exist but hobbyist-grade; the ask is to fund and de-hobbyist-ify them.
- **Power-line mesh** — in-building only (see fact-check table).
- Still unsolved for popup mesh: **local payments** and **resilient exit routes** to the outside world.

---

*Maintained alongside `moav-berlin-talk-full.md`. Cross-references: `moav-1.8-dns-infrastructure.md` (protocol list + cite-ready sources), `moav-neocypherpunk-talk.md` (short version).*
