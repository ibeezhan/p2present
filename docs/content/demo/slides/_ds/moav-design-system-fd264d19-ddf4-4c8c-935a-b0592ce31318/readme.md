# MoaV Design System

**MoaV — Mother of all VPNs.** A multi-protocol Internet censorship circumvention stack.
This repository is the brand + UI design system: design tokens, foundation specimens,
reusable React components, and high-fidelity recreations of the real product surfaces.

> Internet freedom doesn't happen by accident. MoaV exists because the tools already
> existed but the friction was too high — a reliable multi-protocol circumvention server
> in ten minutes, one command, a $5 box. This system is built to carry that voice:
> **cypherpunk, futuristic, dark — but optimistic.**

---

## What MoaV is

MoaV lets a person stand up a personal, multi-protocol anti-censorship server with a
single command. It bundles **16+ protocols** (Reality/VLESS, Hysteria2, Trojan,
WireGuard, AmneziaWG, TrustTunnel, Shadowsocks-2022, Telegram MTProxy, four simultaneous
DNS tunnels, and more), makes every flow look like ordinary HTTPS/WS/DNS, and manages
per-user credentials with instant revocation. It can also **donate bandwidth/configs** to
Psiphon Conduit, Tor Snowflake, and MahsaNet (2M+ users in Iran).

It is **software, not a service** — the authors operate no infrastructure. Audience:
engineers, activists, diaspora communities, and "strangers with a spare VPS."

### Products / surfaces represented here
1. **Marketing website** — `moav.sh`. The neon brand front door. Hero + ASCII wordmark,
   protocol grid, "why" manifesto, install terminal, donate/support.
2. **Server Admin Dashboard** — `:9443`. The ops console operators run on their server:
   services grid, user management, MahsaNet donation, live stats. (Python/Jinja, GitHub-dark.)
3. **MoaV-Client Dashboard** — `localhost:3001`. The React control panel end-users run
   locally: endpoint health/latency, analytics, plugins/routing rules, settings, debug.

### Two palettes, one brand
- **BRAND / neon** — marketing. Cyan `#00d4ff` → purple `#7b5cff` on near-black `#0a0a0f`.
- **OPS / terminal** — dashboards. GitHub-dark (`#0a0e17` ink, semantic green/blue/red/yellow).

Both are dark and cypherpunk. The design tokens express both; semantic aliases default to
BRAND and flip to OPS under the `.theme-ops` scope.

---

## Sources (for the reader — you may not have access, stored in case you do)

| Source | URL | What we pulled |
|---|---|---|
| **MoaV server** (GitHub) | https://github.com/shayanb/MoaV | `site/style.css` + `site/index.html` (brand tokens, hero, protocol cards), `admin/templates/dashboard.html` (ops palette, dashboard chrome), README (product/voice), `site/assets/` (logo, favicon, terminal screenshot, og-image) |
| **MoaV client** (GitHub) | https://github.com/MotherofallVPNs/moav-client | `web-ui/src/theme.ts` (ops palette), `App.tsx` + `components/*.tsx` (dashboard layout, tabs, endpoint table, switch, status pills), README (client feature set) |
| **Live site** | https://moav.sh | Brand reference |
| **Uploaded** | `assets/logo.png`, `assets/og-image.png` | Official logo + OG image |

**Explore these repos further** to build higher-fidelity work — the real CSS, component
code, and copy live there. This system distills them; the repos are the ground truth.

---

## CONTENT FUNDAMENTALS — how MoaV writes

**Voice:** Direct, technically fluent, quietly defiant, ultimately hopeful. It respects the
reader's intelligence and never condescends. It is a builder talking to builders.

- **Person:** Mostly **imperative + "you"** ("Spin up your own", "you're part of the
  network"). The manifesto voice uses **"we"** for the project's intent ("We built MoaV
  because…"). Avoid corporate "we provide."
- **Casing:** **Sentence case** for headings and UI. Product/protocol names keep their
  canonical casing (MoaV, VLESS, Reality, Hysteria2, WireGuard, AmneziaWG, MahsaNet).
  Dashboard section labels and table headers are **UPPERCASE mono** with wide tracking.
- **Tone register:** Confident and concrete, never hype. Numbers do the bragging
  ("10 minutes", "$5 server", "16+ protocols", "2M+ users"). Stakes are real but the
  framing is empowering, not fearful: *"The window to act is between blackouts, not during them."*
- **Technical precision:** Exact ports, protocol names, and commands are part of the
  brand texture — `curl -fsSL moav.sh/install.sh | bash`, `443/tcp`, `moav user add alice`.
  Monospace is used liberally inline.
- **Emoji:** **Effectively none** in product UI and prose. (READMEs use a few badge/section
  emoji, but the interfaces do not.) Do not introduce emoji into MoaV surfaces.
- **Punctuation/devices:** Em dashes for asides. Short declarative sentences. Star ratings
  (★) for protocol stealth/speed. Status verbs are terse: `running`, `healthy`, `disabled`,
  `timeout`.
- **Disclaimers:** A recurring, sober legal note — "software, not a service; the authors
  operate no infrastructure." Keep it factual and small.

**Example lines (real brand voice):**
- "Multi-protocol Internet censorship circumvention stack."
- "All traffic looks like normal HTTPS, WebSocket, DNS, or IMAPS."
- "One command. A $5 server. And you're part of the network."
- "This is not someone else's problem to solve."

---

## VISUAL FOUNDATIONS — the look

**Overall vibe:** Dark-mode cypherpunk console. Think a clean terminal at night with neon
phosphor — circuit-board geometry, monospace everywhere technical, and a single confident
cyan→purple gradient as the one "expensive" flourish.

### Color & vibe
- Backgrounds are **near-black navy**, never pure black, layered subtly (page → sunken →
  card → raised). The marketing background adds a faint **radial glow** at the top
  (`--moav-gradient-bg`) and a low-opacity **animated constellation/network canvas** (dots
  + connecting lines, ~0.6 opacity) behind the hero.
- **Cyan is the hero accent**; **purple is the partner**, used for secondary CTAs and
  "donate/community" moments. Green = alive/success. The gradient (135° cyan→purple) appears
  on primary buttons, the wordmark, step numbers, and a 2px top-edge that lights up on card hover.
- **Ops palette** is cooler and more functional: GitHub-dark surfaces with **semantic**
  green (running/ok), blue (info/links/protocol), red (error/timeout), yellow (warn/inactive),
  orange (Grafana/monitoring). Colors carry meaning — don't use them decoratively.
- Imagery is **cool, dark, electric** — cyan/teal/blue with violet. The logo is a
  circuit-board "M" enclosing a "V" in an icy cyan→blue gradient.

### Typography
- **Inter** for prose & UI; **JetBrains Mono** for everything technical (commands, ports,
  protocol names, labels, the ASCII wordmark, all dashboard chrome). The brand is
  monospace-forward — when in doubt for a label, go mono + uppercase + wide tracking.
- Marketing display is **fluid** (`clamp`) and **bold (700)**; the hero tagline is the
  gradient-clipped text. Body is 15–17px at 1.6–1.8 line-height. Dashboard text is small
  and dense (0.7–0.85rem) with tabular numerals for stats/latency.

### Backgrounds, texture & motifs
- **Signature motif:** the **ASCII / nested-box "MOAV" wordmark** (see `assets/moav-terminal.png`)
  — pixel/circuit lettering in cyan. Use it for terminal/CLI contexts.
- Full-bleed hero on the marketing site; dashboards are **centered single-column** (max
  1100px) on flat dark. No photography in product; the OG image is the one "lifestyle" art.
- No skeuomorphism, no heavy gradients beyond the brand one, no noise/grain textures.

### Borders, radii, cards
- **Borders are hairlines:** white at 5–20% alpha on marketing, solid `#1e2d3d` on ops.
  Borders (not shadows) define most edges on dark.
- **Radii:** marketing is rounder (cards 12px, buttons 8px); ops/terminal is tight
  (cards/buttons 6px, tags/pills 3px, status pills fully round).
- **Marketing card:** `--surface-card` fill, 1px `--border-default`, 12px radius, no shadow
  at rest; on hover it lifts 4px, border brightens, and a gradient top-edge fades in.
- **Ops card/section:** `--surface` fill, 1px `#1e2d3d`, 6px radius, an uppercase mono header
  row with a bottom hairline, dense body.
- **Shadows** are subtle and only for floating things (toasts, modals, dropdowns). On dark,
  prefer borders + neon glow over drop shadows.

### Glow, transparency & blur
- **Neon glow** (`--moav-glow-cyan`) is reserved: hero logo drop-shadow, primary CTA hover,
  focus states. Used sparingly so it stays special.
- Transparency: tints (`rgba` accent at 0.1–0.15) for chips, icon plates, dim button
  backgrounds. Service status dots get a tiny `box-shadow` halo when running.
- Blur is rarely used; if needed, only a light backdrop-blur on sticky bars/modals.

### Motion
- **Easing:** `ease` / `ease-out`; marketing `0.3s`, interactive `0.15s`. No bounce.
- **Entrances:** gentle `fadeInUp` (20px, 0.8s) for hero content. Terminal blink cursor and
  a slow pulse for "starting" status dots. Toasts slide in from the right.
- **Hover:** lift (translateY −2px buttons, −4px cards) + border brighten / neon glow.
  **Press:** no dramatic shrink — keep it crisp.
- Respect `prefers-reduced-motion`; the network canvas and entrances should degrade to static.

### Layout rules
- Marketing: centered `max-width:1200px` container, generous `120px` section padding,
  responsive auto-fit grids (`minmax(300px,1fr)`).
- Dashboards: centered `max-width:1100px`, `1.5rem 2rem` padding, sticky topbar with logo +
  status pill + refresh, a tab/section structure, tables for data.

---

## ICONOGRAPHY

MoaV's interfaces are **deliberately icon-light** — the aesthetic is typographic and
terminal-driven, not pictographic.

- **No built-in icon font or sprite** ships in the codebases. Icons that appear are
  **inline SVGs** at small sizes (e.g. the GitHub mark in the dashboard footer, copy/expand
  glyphs, platform marks) plus deploy-provider/brand logos via shields.io badges in docs.
- **Status is shown with shape + color, not icons:** filled **dots** (●, 7px, with a green
  glow when running / yellow pulse when starting), **pill badges** (`running`, `timeout`,
  `disabled`), and uppercase mono **tags** for protocols (`Reality`, `Hy2`, `WG`, `AWG`…).
- **Unicode as iconography:** arrows and glyphs stand in for icons throughout — `↻` refresh,
  `↑ / ↓` traffic up/down, `●` status, `→` flow, `★` ratings, `+ / -` expand/collapse,
  `×` dismiss. Terminal prompts use `$` and `?`.
- **Emoji:** not used in product UI. Don't add them.
- **Recommended icon set (substitution, FLAGGED):** when a kit genuinely needs line icons,
  use **Lucide** (https://lucide.dev) via CDN — its thin, geometric, monochrome stroke
  matches the terminal aesthetic and tints cleanly with `currentColor`. This is a
  substitution, not a brand-owned set; keep usage minimal and monochrome.
- **Logo:** `assets/logo.png` — the circuit-board "M+V" mark (cyan→blue gradient, 600×600,
  transparent). The **ASCII wordmark** in `assets/moav-terminal.png` is the CLI-context mark.

---

## Index — what's in this system

### Foundations (root + `tokens/`)
- `styles.css` — global entry (import this). Manifest of `@import`s only.
- `tokens/colors.css` — brand neon + ops terminal palettes + semantic aliases (`.theme-ops` scope).
- `tokens/typography.css` — Inter + JetBrains Mono families, type scale, weights, tracking.
- `tokens/spacing.css` — spacing, radii, shadows, motion.
- `tokens/fonts.css` — webfont loading (Google Fonts CDN).
- `foundations/*.html` — specimen cards (Design System tab): colors, type, spacing, brand.

### Components (`components/`)
Reusable React primitives styled with the tokens. See each directory's `.prompt.md`.
- `components/buttons/` — `Button`, `IconButton`
- `components/forms/` — `Input`, `Switch`, `Select`
- `components/feedback/` — `Badge`, `StatusPill`, `Tag`, `Toast`
- `components/layout/` — `Card`, `StatStrip`, `Terminal`

### UI kits (`ui_kits/`)
High-fidelity recreations of the real products.
- `ui_kits/website/` — the moav.sh marketing site (hero, protocols, why, install).
- `ui_kits/admin_dashboard/` — the server admin console (`:9443`).
- `ui_kits/client_dashboard/` — the moav-client control panel (`localhost:3001`).

### Assets (`assets/`)
- `logo.png` — primary mark · `og-image.png` — social/hero art · `moav-terminal.png` — ASCII
  wordmark / CLI menu · `favicon.png` / `favicon.ico`.

### Skill
- `SKILL.md` — makes this folder usable as a downloadable Claude Agent Skill.
