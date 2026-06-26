# Rage-Coding the Mother of All VPNs
### Full talk design (director's cut) — Web3Privacy Neocypherpunk Summit, Berlin, June 14 2026
### Funkhaus · 20 minutes · Shayan Eskandari

*This document contains: thesis, slide-by-slide narration, visual/image prompts, timing notes, and speaker asides.*

---

## Thesis

Everything is enshittifying — the internet, the crypto space, the platforms people use to resist. And while the dominant culture of our space optimized for yield, I rage-coded the infrastructure that actually works. This talk is a lab notebook from that process: what I built, why it's absurd and beautiful, what's left to build, and how to stay sane while fighting nation-states.

The talk lands three things:
1. A framework (Doctorow's enshittification applied to Web3 — the accusation)
2. A demonstration (MoaV — the response, and the frontier of what comes next)
3. A human argument (the friends, the morale, the ask)

The title is a joke that's also the thesis. MoaV is *Mother of All VPNs*  one server, every protocol, because you don't know which one can get through the next blackout.

---

## The Central Provocation

> "The cypherpunk manifesto promised communications privacy. Web3 delivered yield farming. Meanwhile, people in Iran used DNS tunnels that route through the government's own infrastructure to file stories about what happened on their street."

That's the whole talk. Everything else is elaboration.

---

## Slide-by-Slide

---

### SLIDE 1 — Title

**What appears:**
```
RAGE-CODING THE
MOTHER OF ALL VPNs
(the mad scientist shit that matters)

Shayan Eskandari
Neocypherpunk Summit · Berlin 2026
```

**Image prompt:**
> Dark background (near-black). Large bold white text: "RAGE-CODING THE MOTHER OF ALL VPNs". Subtitle below in smaller electric cyan: "(the mad scientist shit that matters)". Bottom: speaker name and event. Aesthetic: hacker zine meets brutalist conference poster. No gradients. No stock-photo vibes. Think Eyjafjallajökull tour poster meets Tor Project. Faint MFSK-spectrogram texture bleeding in at the edges, barely visible.

**Narration (0:00–0:30):**
No preamble. Start talking.

> "I want to tell you about the moment I realized I was building things that shouldn't exist."

*[pause — let the slide land. The personal story of why is held for slide 7. Open on the hook, not the confession.]*

---

### SLIDE 2 — Going Dark, Again and Again *[CUT IF LONG → compress to one sentence on Slide 3]*

**What appears:**
```
Iran has been going dark for 15 years.

2009  Green Movement — filtering, throttling, SMS killed.
2019  "Bloody Aban" — ~96% offline for a week. ~1,500 dead.
2022  Woman, Life, Freedom — rolling shutdowns. ≥551 dead.
2025  The 12-Day War — near-total blackout. Traffic −97%.
2026  88 days dark, even the intranet for some time. 30,000–70,000 dead.

Each time: harder. Each time: they learn.
```

**Image prompt:**
> A layered, NetBlocks-style timeline on near-black. Five horizontal connectivity-trace lanes stacked vertically, one per event (2009, 2019, 2022, 2025, 2026), each dropping toward zero — the drops getting deeper and longer as you go down. Death-toll annotations in small red type beside the deepest dips ("~1,500", "≥551"). The 2026 lane runs off the right edge, unfinished. Electric-red flatlines on a dark grid. No decoration.

**Narration (1:00–2:00):**

> "This isn't a story about one blackout. It's a fifteen-year escalation.

> "2009, the Green Movement: filtering, throttling, they killed SMS. 2019, what Iranians call Bloody Aban — fuel protests, and for about a week roughly ninety-six percent of the network went dark. Around fifteen hundred people were killed, mostly in that window, because during a blackout there's no one left to document it in real time.

> "2022, Woman, Life, Freedom, after Mahsa Jina Amini died in custody: rolling mobile shutdowns, Instagram and WhatsApp blocked, a surge to VPNs and Starlink — at least five hundred fifty-one killed. Then June 2025, the twelve-day war with Israel: a near-total blackout, international traffic collapsed by ninety-seven, ninety-eight percent.

> "Every single time, the shutdown got harder, longer, more complete. Because every single time, they studied what leaked through and they closed it. That's the pattern. Hold that in your head."

*[This slide is the cut valve. If you're behind, drop it and open the next slide with "Iran has been going dark for fifteen years, and this year was the worst."]*

---

### SLIDE 3 — This Year

**What appears:**
```
2026. Two rounds.

JAN ~8 — fully dark.
  Telephone, internet, SMS: all off.
  Even the NIN — the domestic intranet — went down.
  That has never happened before.
  Partial return after 30,000–70,000 killed.

FEB 28 — dark again. 88 days.
  Back late May as a ~60% unstable mess.
  VPN demand: +934% the day it returned.

The demand never stopped.
It just had nowhere to go.
```

**Image prompt:**
> Data visualization using `Assets/IranInternetTraffic-Dec2025-May2026.jpg` — Kentik/Madory-style traffic graph of Iran's international connectivity from December 2025 through May 2026: two distinct collapses to near-zero (January, then a long February–May trough), then a jagged partial recovery. Dark background, electric-red trace, two vertical markers labeled "Jan 8" and "Feb 28". Caption: "Iran international connectivity, Dec 2025–May 2026. Source: Doug Madory / Kentik."

**Narration (2:00–3:15):**

> "This year, two rounds. Around January 8th, Iran went fully dark. Not throttled — dark. Telephone, internet, SMS, all off. And this time something unprecedented: even the National Information Network — the government's own domestic intranet, the thing they built to keep running *during* shutdowns — went down too. That had never happened. The confirmed death toll from what followed is disputed somewhere between thirty and seventy thousand. It's disputed precisely because there was no one left online to count.

> "It partially came back. Then on February 28th it went dark again — and stayed dark for eighty-eight days. It came back in late May as a roughly sixty-percent, erratic, zigzagging mess. And the day connectivity returned, VPN demand spiked nine hundred thirty-four percent in twenty-four hours. People's first act, after eighty-eight days, was to try to get through.

> "There are credible reports they're planning a permanent break from the global internet — Chinese shutdown hardware pre-installed. The next blackout isn't a risk. It's a schedule.

> "Now ask yourself: where was Web3 during those eighty-eight days?"

*[beat — let the question sit]*

---

### SLIDE 4 — Enshittification (Part 1: The Internet)

**What appears:**
```
Enshittification.
— Cory Doctorow

Step 1: Be good to users.
Step 2: Capture users.
Step 3: Abuse users to serve business customers.
Step 4: Abuse business customers to extract value.
Step 5: The platform rots.

Applied to the internet:
Open protocols → ISP capture → state chokepoints.
```

**Image prompt:**
> Clean dark slide. A simple downward spiral diagram on the left — each ring labeled: "open protocols", "ISP consolidation", "CDN oligopoly", "state control levers", "internet as weapon". On the right, bold white text quote from Doctorow. Minimalist, no decoration.

**Narration (3:15–4:15):**

> "Cory Doctorow's framework: enshittification, the lifecycle of platforms. They start by being genuinely good, to attract users. Then they lock users in. Then they abuse users to serve advertisers. Then they abuse advertisers to serve shareholders. The platform degrades until it collapses or gets regulated.

> "He was talking about social media. But the same arc describes the whole history of the internet. Open protocols attracted us. ISPs consolidated and captured the infrastructure. CDNs became chokepoints. And now states have figured out that controlling the physical fiber is the same as controlling what people can say and know and organize around.

> "The internet enshittified. And most of us who built 'decentralized' alternatives built them on top of the enshittified layer and pretended we hadn't."

---

### SLIDE 5 — Enshittification (Part 2: Web3 Forgot the Promise)

**What appears:**
```
Now apply it to us.

1993: "We are defending our privacy
       with cryptography."
       — Cypherpunks Writing Code

2026: Yield. Memes. Token launches.
      Privacy as an enterprise feature.

The people who need this tech get cut off twice:
  — by their own government,
  — and by other governments whose vague
    sanctions law scares us away from serving them.

This isn't cypherpunk.
It isn't even human.
```

**Image prompt:**
> Split slide. Left half: old-school terminal aesthetic, green-on-black, the 1993 cypherpunk manifesto excerpt. Right half: polished VC-deck style, blue gradients, "INSTITUTIONAL PRIVACY SOLUTIONS" and a yield curve going up. The contrast makes the argument. Caption: "same movement, 30 years apart."

**Narration (4:15–5:45):**

> "Now apply Doctorow's framework to this room. To us.

> "The cypherpunk manifesto promised communications privacy. Anonymous remailers. Digital signatures. Electronic money — *and* the ability to whisper across borders without surveillance. Censorship-resistant *access* was the original pitch, not just censorship-resistant *money*.

> "We attracted builders with that pitch. Then VCs captured the space. Then the incentive structure did what incentive structures do: it optimized for what could be priced and sold. Financial privacy has a business model. Communications privacy for someone in Tehran does not.

> "So we got yield farming. We got memecoins. We got token launches that made twenty-three-year-olds rich for fourteen months. We got 'institutional-grade DeFi' and privacy reframed as an enterprise compliance feature.

> "Meanwhile the people who actually need this technology get cut off *twice*. Once by their own government, which pulls the fiber. And again by *ours* — by sanctions law vague enough that builders are scared to serve Iranians at all, so they just… don't.

> "This isn't cypherpunk. It isn't even human. Why are we here, if not for resilience in exactly these moments?"

*[beat]*

---

### SLIDE 6 — The Gap (Structural Failure)

**What appears:**
```
We built a decentralized web
on top of a centralized access layer
and called it done.

dApps · RPC nodes · IPFS gateways · L2 bridges

All of them require
that the last mile exists.

It doesn't.
```

**Image prompt:**
> Architecture diagram. Top layer: colorful Web3 stack — IPFS, Ethereum, L2s, DeFi protocols, logos in muted tones. Bottom layer: a single thick red line labeled "FIBER — STATE CONTROLLED." The entire stack floats above the red line. An axe cuts through the red line; everything above collapses. Simple, stark.

**Narration (5:45–6:30):**

> "Here's the structural problem. Everything we built for the decentralized web assumes a working internet. When a state with physical control over fiber severs the last mile, the RPC nodes, the IPFS gateways, the bridges — all of it collapses. Not because it failed technically. Because we assumed the layer below would always be there.

> "We optimized for trustlessness at the protocol layer and ignored the physical chokepoint underneath. That's not a technical failure. It's a failure of imagination about who the real adversary is."

---

### SLIDE 7 — Rage Coding (and Why I Built This)

**What appears:**
```
I teach Farsi speakers blockchain.
I've done it for a decade.

When the blackout came, I was useless.
My messages to my family weren't even being delivered.

So I rage coded.
Not for a better financial future.
For a better NOW — for anyone who needs it.

"moav.sh/install.sh" | bash
16+ protocols. One port. $5 VPS. Ten minutes.

Mirror of All Voices.
The mother of all VPNs.
```

**Image prompt:**
> Terminal screenshot aesthetic. Dark background. A realistic terminal running the MoaV install. Progress bars spinning, protocol names appearing one by one: Reality, Shadowsocks, Hysteria2, WireGuard, Trojan, XHTTP, DNS tunnels, GooseRelay... each labeled as it comes up. Fast, chaotic, alive. Bottom: "All protocols up. 16 active." This is the joyful version — not clean, not corporate. It looks like something built at 2am that works anyway.

**Narration (6:30–8:45):**

> "Let me tell you why I built this, because it's the most honest part of the talk.

> "I'm Iranian. I've spent more than a decade teaching Farsi speakers how this technology works — blockchains, wallets, self-custody. And when the blackout came, all of that was worthless. I couldn't reach my own family. My messages weren't getting *blocked* — they just weren't being *delivered*. There was nothing on the other end. I sat in Lisbon, helpless, watching the country I'm from disappear from the network.

> "So I rage coded. And I want to be precise about what that means, because it's not a productivity hack. It was the only channel I had to feel useful. Not building a better financial future for myself — building a better *now*, for anyone who needed it. AI-assisted, 2am, 'let's see if this works' energy. I had no real hope it would work.

> "And then it did. People got through. For a few weeks it actually worked.

> "Then March came, and the full shutdown, and everything I'd built stopped mattering, because there was no connection left for it to ride on. I was fully defeated. I felt like a failure. I closed the laptop and went for a walk for a few days.

> "And then I came back. Because that's the job. I kept fixing bugs. I kept adding protocols. And in May, when the network came back at sixty percent, erratic — it worked again. People got through again.

> "That's what this is. *[gesture at slide]* MoaV — Mirror of All Voices. One command, a five-dollar VPS, ten minutes, and you have a server running sixteen-plus circumvention protocols at once. Reality, Shadowsocks, Hysteria2, WireGuard, Trojan, CDN-fronted, XHTTP, four DNS tunnels on a single port, GooseRelay. Not pick one. *All* of them. Because you don't know which one survives the next blackout. The censor has to block every protocol. You only need one to get through.

> "It's the mother of all VPNs. The design philosophy isn't elegance. It's redundancy. Not the best protocol — every protocol. Not optimize for the ninety-percent case — survive the one-percent case where everything else failed."

*[This is the emotional core. Do not rush it. Do not cut it.]*

---

### SLIDE 8 — The Arms Race (The Mad Scientist Stuff)

**What appears:**
```
The arms race gets creative.

DPI reads your TLS handshake?
  → SNI Spoofing: decoy ClientHello,
    real connection underneath.

Can't afford to block Google?
  → GooseRelay: traffic exits through
    Google Apps Script (script.google.com).

Government-approved messaging app?
  → BaleVPN: your traffic rides Bale's own
    WebRTC call media. Their wire. Their app.

DNS is the floor.
Block it and you break your own country.
```

**Image prompt:**
> Four-panel comic strip, dark and technical. Panel 1: a DPI box "reading" a packet — SNI label glowing. Panel 2: same packet with a decoy label "microsoft.com" on top, real destination underneath — labeled "SNI Spoofing." Panel 3: traffic flowing through a Google logo, labeled "Apps Script." Panel 4: an Iranian government building with a router inside labeled "Bale," traffic riding out as a WebRTC call (little RTP packets styled as a call waveform). Final caption strip: "The censor's dilemma: block it or break yourself."

**Narration (8:45–10:45):**

> "Let me show you what I mean by the arms race getting creative. This is the mad scientist shit I genuinely love.

> "Deep packet inspection reads the unencrypted hostname in your TLS handshake. So SNI Spoofing sends a *decoy* ClientHello — the DPI box sees 'microsoft.com', and the real connection continues to your server underneath. It defeats SNI-based blocking by giving the censor a name it's happy to allow.

> "GooseRelay routes your traffic through Google Apps Script. Your packets exit through script.google.com. To the censor it looks like an HTTPS request to a Google Workspace serverless function — the kind millions of businesses use. Blocking it means blocking Google Apps Script for the whole country. The cost of the block exceeds the benefit.

> "BaleVPN. This is my favorite. Iran's government has its own blessed messaging app, Bale. BaleVPN doesn't fake a 'voice call' in some hand-wavy way — it rides Bale's *actual* WebRTC call media, real RTP through a LiveKit media server, the same path a genuine call uses. To the network, it is a Bale call. The government built the wire. We're using it. Their approved platform routes traffic around their own firewall.

> "And then there's DNS — the floor. DNS tunnels are the last thing standing because censors won't kill DNS; their own domestic infrastructure needs it. dnstt, Slipstream, MasterDNS, XDNS — four tunnels running at once on a single port. Low bandwidth, high latency, but for a journalist who needs to file one story, it's enough."

---

### SLIDE 9 — The Frontier (Exotic Routing)

**What appears:**
```
What's barely built — or not yet.

TCP over git commits.          [PoC]
  Encode data in git objects, push to GitHub.
  Clone to receive. GitHub is too big to block.

GitHub Actions as a relay.     [PoC]
  Trigger a workflow. It fetches the blocked URL.
  You download the artifact.

TCP over WhatsApp (wa-tunnel).  [WORKS — ban risk]
  Real. Tunnels through WhatsApp Web.
  Your account may not survive it.

Power-line comms (HomePlug/G3). [WORKS — in-building only]
  Data over the mains. Cannot cross a transformer.
```

**Image prompt:**
> Three/four column layout on dark background, each column tagged with its honest status label. Column 1: a git commit graph, each commit labeled "packet 1/2/3" — data in the commit tree — tag "PoC". Column 2: GitHub Actions YAML whose steps read "fetch blocked URL / store artifact / return" — tag "PoC". Column 3: WhatsApp icon with a tunnel through it and a small red "⚠ account ban risk" — tag "WORKS". Column 4: a building cross-section, wiring highlighted blue, packets flowing between floors but stopping hard at a transformer symbol at the street — tag "WORKS / in-building".

**Narration (10:45–12:15):**

> "Now the frontier — the stuff that barely exists, or doesn't yet, but should. And I'm going to be honest about what actually works versus what's a proof of concept, because overselling this stuff gets people hurt.

> "TCP over git commits. This is a proof of concept, not a product. You encode data in git objects and push to GitHub; to receive, you clone. Kilobytes per second, but GitHub is too economically important for most censoring states to block outright — you'd break every developer in the country.

> "GitHub Actions as a relay — also a PoC. You trigger a workflow with a push; it runs in a datacenter outside your country, fetches whatever you need, stores it as a build artifact, and you download it. Beautiful abuse of CI infrastructure. Not something to bet your safety on yet.

> "TCP over WhatsApp — wa-tunnel — this one's *real*, it works today, it tunnels through WhatsApp Web. But the honest warning: high account-ban risk. WhatsApp notices, and you can lose the account you depend on.

> "And power-line communication — HomePlug, G3-PLC — real and shipping, data over the electrical mains. But the honest limit: it's building-scale. It does *not* cross a transformer. So this is an in-building or same-transformer mesh — a tool for one apartment block coordinating during a blackout, not a neighborhood network. Frame it for what it is and it's genuinely useful."

---

### SLIDE 10 — Nedagram: A Modem for the Blackout

**What appears:**
```
When even DNS is gone — voice calls often survive.

Nedagram: text → sound → text.
  Type a VPN config. It becomes audio.
  Hold it up to a phone call.
  The other side decodes it back to text.

  MFSK tones · ~20 bps over GSM
  Reed–Solomon + Viterbi — the FEC NASA flew on Voyager
  ChaCha20-Poly1305 optional · fully offline PWA

~6 minutes to push 1 KB through a phone call
when nothing else on earth gets through.
```

**Image prompt:**
> A spectrogram as hero image: discrete MFSK tone-steps marching across a dark frequency-vs-time plot in electric cyan, like a song made of data. Overlay, faint: an old dial-up modem silhouette dissolving into the Voyager golden record. Bottom corner, small: a phone held to a laptop speaker. Caption: "Voyager-grade error correction. Over a phone call. At 20 bits per second."

**Narration (12:15–14:00):**

> "And here's the one I'm proudest of. The case where even DNS is gone. Total shutdown. But — and this is the key observation — voice calls often still work, because killing the phone system is a different, harder political decision than killing the internet.

> "So: Nedagram. It turns text into sound and sound back into text. You type a VPN config into a web page — works fully offline, it's a PWA, loads once and never needs the network again. It encodes that text as MFSK audio — multiple tones, a little song. You hold your phone up to the speaker, you call your friend in Tehran, and on the other end the same page listens and decodes it back into the exact config.

> "Over a noisy GSM call you get about twenty bits per second. That sounds absurd — it *is* absurd — but here's the mad scientist part: to survive that noise, Nedagram uses concatenated forward error correction. Reed–Solomon on the outside, a convolutional code with soft-decision Viterbi decoding on the inside. That is the *exact* class of error-correction scheme NASA used to get pictures back from Voyager, from beyond the solar system. We're using deep-space coding to push a VPN config through a crackly phone call from Lisbon to Tehran.

> "About six minutes to send a kilobyte. Slow. Ugly. And when literally nothing else on the planet gets through — it gets through."

*[Protect this slide. This is the heart of "mad scientist shit." Let the Voyager line land.]*

---

### SLIDE 11 — Offline Payments: The Embarrassment

**What appears:**
```
A signed transaction is just data.
Any channel that carries data can carry it.

So why is there still no offline payments
protocol that just works?

  Cashu (Chaumian ecash): closest — but Bitcoin-only,
    complex, and the mint must be online to stop
    double-spending for untrusted transfers.
  Stablecoins offline: unsolved.
  Most EVM wallets can't even EXPORT a signed tx
    for out-of-band broadcast. Total failure, no recourse.

The hard wall: no connected ledger means
double-spend needs hardware trust or a trusted middleman.
```

**Image prompt:**
> Flow diagram on dark background. Left: a phone labeled "Air-gapped / no connectivity." Center: transmission paths — Nedagram tone-wave, WhatsApp icon, git branch, SMS — each carrying a little "signed tx" envelope. Right: a node labeled "Relay → broadcast to network." Solid arrows for what works, dashed for limited, one red-X path labeled "direct internet — CUT." Bottom strip: "Signing can be air-gapped. Broadcast can't. Yet."

**Narration (14:00–15:30):**

> "Here's a problem I want to hand to this room as homework, because it's genuinely embarrassing that it's unsolved.

> "A signed transaction is just data. A blob of bytes. Any channel that carries data — Nedagram, WhatsApp, a git commit, SMS — can carry it to somewhere connected, and that somewhere broadcasts it. So why is there *still* no offline payments protocol that just works?

> "Cashu is the closest thing — Chaumian ecash, genuinely beautiful. But it's Bitcoin and Lightning only, it's complex, and for transfers between people who don't trust each other, the mint has to be online to prevent double-spending. Stablecoins offline? Unsolved. There's no shipping product. And here's the part that should embarrass us: most EVM and Web3 wallets can't even *export a signed transaction* for you to broadcast out of band. The capability exists programmatically, but there's no button. So when the internet's cut, you're holding keys to money you cannot move. Total failure, no recourse.

> "Bitcoin, to its credit, has clean air-gapped signing — PSBT, BIP-174 — sign on a device that never touches the network, broadcast later. Our side mostly doesn't.

> "So two asks. One: export-and-relay — let me export a signed transaction and carry it out over Nedagram or WhatsApp or git to a node that broadcasts it. Two: for safe small-value offline payments, look at zero-knowledge proofs plus escrow or state-channel locking. And be honest about the wall: without a connected ledger, preventing double-spend needs either hardware you trust or a middleman you trust. Visa and CBDC offline pilots solve it with secure elements. We could solve it better. We haven't."

---

### SLIDE 12 — Popup Mesh: Pirating Infrastructure *[CUT IF LONG]*

**What appears:**
```
We fund popup cities.
Why don't we fund popup MESH?

Local comms today: solvable.
  DeltaChat (email as transport) · Matrix (local homeserver)
  Jitsi (P2P video) · bitchat · Nedagram
  mesh over the power lines in a building

Local payments: ✗
Resilient exit routes: ✗

Fund it. De-hobbyist-ify LoRa / Meshtastic / wifi mesh.
We KNOW these are possible. Why aren't we building them?
```

**Image prompt:**
> Isometric illustration of a popup city — tents, temporary structures, solar panels — overlaid with a mesh network diagram connecting them. Icons on local nodes: DeltaChat, Matrix, Jitsi, a LoRa antenna, a bitchat bubble. A dotted border labeled "Global Internet (unreliable)"; inside it "Local Mesh (always on)." Warm and human, not dystopian — a community that built its own infrastructure and it's working.

**Narration (15:30–16:30):**

> "We fund popup cities — Zuzalu, the network-state experiments, protest camps. We pour money into temporary communities. So why don't we fund popup *mesh*?

> "Local communications are solvable *today*. DeltaChat uses email as transport — chat UX, but the packets are emails, works wherever email works, no central server. Matrix runs a local homeserver on a single laptop on a LAN — the whole camp talks with zero global internet. Jitsi for video. bitchat for Bluetooth mesh. Nedagram for the audio gap. Mesh over the power lines in a building.

> "What's *not* solved: local payments, and resilient exit routes to the outside world. Those are the open problems.

> "So fund it. Take LoRa and Meshtastic and wifi mesh and de-hobbyist-ify them — make them as deployable as MoaV. Build more bitchat- and Nedagram-class tools. We *know* these are possible. We have the engineers and the money in this very room. Why aren't we building them?"

---

### SLIDE 13 — Activist Morale

**What appears:**
```
How do you stay motivated
fighting nation-states?

The censor has unlimited resources.
You don't.

But:
Every block costs them too.
The dilemma compounds.
The tools get easier.
The community grows.

You don't have to win.
You have to make it expensive.
```

**Image prompt:**
> Dark slide. Large white text: "You don't have to win. You have to make it expensive." Below, a small graph: "Cost to censor" rising over time; "Cost to circumvent" falling. They cross. Underneath: "The arms race has a direction." Minimalist.

**Narration (16:30–17:30):**

> "People ask how I stay motivated, and it's not a trivial question — you're fighting adversaries with intelligence agencies, physical control of fiber, and the power to make people disappear.

> "Here's the frame that keeps me going. You don't have to win. You have to make censorship expensive.

> "Every protocol we add to MoaV is one more the censor has to detect and block. Every time they block one, we add two. Their cost compounds upward; ours has been falling for fifteen years as the tools get better and more automated. And there's an asymmetry they can't escape: the same properties that make the internet useful for commerce make it useful for dissent. They can't remove the useful parts without removing themselves from the global economy.

> "You're not fighting to defeat them. You're fighting to make the price of control too high to keep paying. That framing keeps me going when it would otherwise feel hopeless."

---

### SLIDE 14 — The Friends

**What appears:**
```
The friends you make along the way.

The researcher who showed you the paper you needed.
The developer who fixed the bug at 11pm
  in a different timezone.
The activist who tested it in conditions
  you can't replicate.

The community is the infrastructure.
```

**Image prompt:**
> Warm, human slide. A constellation diagram — nodes connected by lines, each node a small abstract human icon (no real faces). Some labeled: "researcher", "developer", "activist", "translator", "server operator." The lines are the relationships. Caption: "The network that keeps it alive." The only warm slide in the deck — intentionally so.

**Narration (17:30–18:30):**

> "I want to talk about the friends.

> "MoaV exists because of a researcher who pointed me at a paper I needed. A developer six timezones away who fixed a critical bug over a weekend. An activist testing the tools in conditions I can't replicate from Lisbon. A translator who made the docs readable for people who don't read English.

> "None of them are on the GitHub contributors list the way they should be. That's a failure of how we measure these things.

> "The community is not a side effect of the infrastructure. It *is* the infrastructure. The tool dies the moment the people maintaining it burn out or lose hope — I know, because in March I almost did. The social network of mutual aid is as load-bearing as the technical network of protocols and servers.

> "Take care of each other. The friends are the most non-replicable part of what we're building."

---

### SLIDE 15 — The Ask

**What appears:**
```
Build for peacetime.
But it MUST NOT break in crisis.

1. Deploy.
   curl -fsSL moav.sh/install.sh | bash
   Enable Conduit. Enable Snowflake.
   Someone in Iran uses your bandwidth tonight.

2. Build the hard problems.
   Offline payments. Mesh. Exotic routing. The last mile.

3. Fund the gap.
   For the earth's stakeholders — people, freedom —
   not the shareholders.
   As ideological coherence.
```

**Image prompt:**
> Dark slide. Three numbered items in large clean sans-serif, each with a subtext line; item 1 has a terminal command in monospace below it. A small banner across the top in red: "Tools that work in peacetime but break in crisis are worse than useless." Concrete, immediately actionable — not vague inspiration.

**Narration (18:30–19:30):**

> "So here's the ask. One frame first: the tools we build have to work in peacetime *and* they must not break in crisis. A circumvention tool that fails exactly when it's needed is worse than no tool, because someone trusted it.

> "Three things you can do, not in a roadmap — this week.

> "One: deploy. If you have a VPS — five dollars, ten minutes — run this. Enable Conduit, which relays for Psiphon's tens of millions of users in censored countries. Enable Snowflake, a Tor bridge. Someone in Iran uses your bandwidth tonight. Cost to you: cents. Impact: someone gets to say they're alive.

> "Two: build the hard problems. Not another DeFi protocol. Offline payments. Mesh. Exotic routing. The last mile. The cases that matter when a government actually tests the system. These need the best engineers — that's you.

> "Three: fund the gap. If your project has a treasury, grants, partnerships — point them here. Build for the earth's stakeholders — the people, their freedom — not the shareholders. Not as charity. As ideological coherence. If the foundational claim of this space is that the internet should be free and beyond state control, then funding the infrastructure that makes that true isn't optional. It's the thing."

---

### SLIDE 16 — Close

**What appears:**
```
"Cypherpunks write code."
— 1993

We inherited that tradition.

The window is open.
~60% connectivity and unstable.
The next blackout is already planned.

The servers that will matter
are the ones being deployed right now.

moav.sh

Be the infrastructure.
```

**Image prompt:**
> Full dark slide. The 1993 manifesto quote small at the top. Then one large bold line: "BE THE INFRASTRUCTURE." Below, the MoaV URL in clean monospace. At the very bottom, small: "June 2026. The window is open." End-of-something weight, not decoration.

**Narration (19:30–20:00+):**

> "The cypherpunk manifesto ends with a declaration: cypherpunks write code. They wrote code to protect privacy, and it became Tor, became Signal, became the foundation of circumvention infrastructure in dozens of countries. We inherited that tradition.

> "Iran is at sixty percent connectivity and unstable. Nobody knows how long this window stays open, and the next blackout — planned harder, with everything they learned — is already in preparation. The servers that will matter when it happens are the ones being deployed *right now*. Not during the crisis. Now.

> "I came from Lisbon to tell you that the mad scientist shit is what matters. The rage coding at 2am. The DNS tunnel through the government's own infrastructure. A VPN config sung through a phone call with the same error-correction NASA flew past Pluto.

> "Build that. Be that.

> "moav.sh."

*[stop — no trailing thanks, no 'questions?'. Just stop. Let the URL sit on the screen.]*

---

## Timing Summary

Core target ≈ 20:00. Rows marked `[CUT IF LONG]` are the director's-cut slack.

| Slide | Topic | Time | Cumulative | |
|---|---|---|---|---|
| 1 | Title | 0:30 | 0:30 | |
| 2 | Going Dark, Again & Again | 1:00 | 1:30 | `[CUT IF LONG]` |
| 3 | This Year | 1:15 | 2:45 | |
| 4 | Enshittification: Internet | 1:00 | 3:45 | |
| 5 | Enshittification: Web3 Forgot the Promise | 1:30 | 5:15 | |
| 6 | The Gap | 0:45 | 6:00 | |
| 7 | Rage Coding (personal heart) | 2:15 | 8:15 | **protect** |
| 8 | The Arms Race | 2:00 | 10:15 | **protect** |
| 9 | The Frontier (exotic routing) | 1:30 | 11:45 | |
| 10 | Nedagram | 1:45 | 13:30 | **protect** |
| 11 | Offline Payments | 1:30 | 15:00 | **protect (the ask)** |
| 12 | Popup Mesh | 1:00 | 16:00 | `[CUT IF LONG]` |
| 13 | Activist Morale | 1:00 | 17:00 | **protect** |
| 14 | The Friends | 1:00 | 18:00 | **protect** |
| 15 | The Ask | 1:30 | 19:30 | |
| 16 | Close | 0:30+ | 20:00 | |

Without the two `[CUT IF LONG]` rows, core lands ≈ 18:00, leaving headroom for live breathing room on slides 7, 10, and 11.

---

## If Running Long: Drop These (in order)

1. **Slide 2 (Going Dark, Again & Again)** — drop the standalone history and open Slide 3 with: *"Iran has been going dark for fifteen years, and this year was the worst."* Saves ~1 min.
2. **Slide 12 (Popup Mesh)** — fascinating but tangential to the spine. Cut whole.
3. **Slide 9 (The Frontier)** — trim from four examples to two (keep git-commits PoC + power-line; drop Actions + wa-tunnel).

**Do NOT cut:** Slide 7 (rage coding — the personal heart), Slide 8 (arms race — the technical heart), Slide 10 (Nedagram — the mad-scientist centerpiece), Slide 11 (offline-payments ask), Slide 13 (morale), Slide 14 (friends). The personal and human slides are what make the audience care enough to act on the ask.

---

## Demo Option

If time and nerves allow: after Slide 16, open a terminal and run:
```bash
curl -fsSL moav.sh/install.sh | bash
```

Don't finish the install. Let it run, show the protocols coming up, let the audience see it's real and takes ten minutes. Kill it after 60 seconds: *"Someone will finish this on their laptop tonight. That's the point."*

Only do this if you've tested it in the exact venue setup beforehand and trust the network.

---

## Design Notes for Slide Deck

- **Color palette**: near-black background (#0d0d0d), white primary text, electric cyan (#00e5ff) for highlights, red (#ff3b3b) for data/urgency, warm orange (#ff8c00) for community/human slides.
- **Typography**: two fonts max. Monospace (JetBrains Mono) for code/data; grotesque sans-serif (Inter or Neue Haas) for everything else. Bold, large, readable from the back of Funkhaus.
- **No stock photos.** Every visual is a diagram, data viz, or aesthetic composition — nothing that looks like a template.
- **Slide density**: most slides 6–10 lines max. The content is in the narration; the slide is the anchor.
- **Slide 7** (rage coding) and **Slide 14** (the friends) should feel warmer/quieter than the rest — they're the human spine. Let them breathe.
- **Slide 10** (Nedagram) is the visual showpiece — spend the design budget on the spectrogram/Voyager image.

---

## Reference Links (for slide notes/research)

**Talk / project:**
- Doctorow — enshittification: https://pluralistic.net/2023/01/21/potemkin-ai/ (and re:publica 2026 talk)
- MoaV: https://moav.sh / https://github.com/shayanb/MoaV
- Nedagram (audio-modem PWA): https://nedagram.com

**Iran shutdown history (sourced):**
- 2019 "Bloody Aban" — ~1,500 killed, ~week-long, ~96% offline: Reuters (Dec 2019 special report) / Amnesty International; NetBlocks connectivity data.
- 2022 Woman, Life, Freedom — ≥551 killed: HRANA (Human Rights Activists News Agency); IG/WhatsApp blocking + Starlink/VPN surge: NetBlocks.
- June 2025 "12-Day War" — near-total blackout, traffic −97/98%: NetBlocks / Kentik.
- 2026 connectivity (two rounds, ~60% erratic restoration, "zigzagging"): Doug Madory / Kentik (https://x.com/dougmadory).
- 2026 VPN demand +934% on restoration day (and Uganda 2,557%, Nepal 2,892%, UK 1,987%): Top10VPN — https://www.top10vpn.com/research/vpn-demand-statistics/

**Circumvention projects (corrected links):**
- GooseRelay (Google Apps Script exit): https://github.com/Kianmhz/GooseRelayVPN
- BaleVPN (rides Bale WebRTC call media / RTP via LiveKit SFU): https://github.com/kookoo1sabzy/BaleVPN
- SNI Spoofing (decoy ClientHello vs SNI-based DPI): https://github.com/aleskxyz/SNI-Spoofing-Go
- wa-tunnel (TCP over WhatsApp — real, high account-ban risk): https://github.com/aleixsnow/wa-tunnel
- MasterDNS / MahsaNG (DNS tunnel + 2M-user app, GooseRelay+MasterDNS native in v16): MasterDnsVPN
- bitchat (Bluetooth mesh messaging): https://github.com/jackjackbits/bitchat

**Offline payments / mesh (state of the art):**
- Cashu (Chaumian ecash; mint must be online to prevent double-spend for untrusted transfers): https://cashu.space
- Bitcoin air-gapped signing — PSBT / BIP-174: https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki
- txtenna / Bitcoin over radio: https://github.com/gotenna/txtenna-python ; Blockstream Satellite: https://blockstream.com/satellite/
- DeltaChat: https://delta.chat · Matrix: https://matrix.org · Meshtastic: https://meshtastic.org

---

*Document version: June 2026 · Director's cut for Berlin (Neocypherpunk Summit).*
*Companion article: moav-1.8-dns-infrastructure.md · Short version: moav-neocypherpunk-talk.md · Speaker bio: speaker-bio.md*
