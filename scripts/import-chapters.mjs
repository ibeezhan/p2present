#!/usr/bin/env node
// import-chapters.mjs — generate a starter sync[] array for a manifest.
//
// Two input modes:
//   1. A yt-dlp ".info.json" file (uses its "chapters": [{start_time,title}] array)
//   2. Pasted "MM:SS Title" / "HH:MM:SS Title" description lines (stdin or a .txt)
//
// One sync entry is emitted per chapter/timestamp, slides numbered 1..N in order.
// Times are float seconds. Tweak slide numbers/transitions afterwards to taste.
//
// Usage:
//   node scripts/import-chapters.mjs talk.info.json            # yt-dlp json
//   node scripts/import-chapters.mjs chapters.txt              # MM:SS lines
//   pbpaste | node scripts/import-chapters.mjs                 # piped lines
//   node scripts/import-chapters.mjs talk.info.json --transition fade
//   node scripts/import-chapters.mjs talk.info.json --merge docs/content/demo/manifest.json
//
// Output: prints a JSON { "sync": [...] } to stdout. With --merge <manifest>,
// writes the sync array back into that manifest file (preserving other keys).

import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const transition = opt('--transition', 'cut');
const mergePath = opt('--merge', null);
const inputPath = args.find((a) => !a.startsWith('--') && a !== transition && a !== mergePath);

function parseClock(str) {
  const parts = str.split(':').map(Number);
  if (parts.some((n) => !Number.isFinite(n))) return null;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

function fromInfoJson(json) {
  const chapters = json.chapters || [];
  if (!Array.isArray(chapters) || chapters.length === 0) {
    throw new Error('No "chapters" array found in the .info.json.');
  }
  return chapters.map((c, i) => ({
    time: Number(c.start_time) || 0,
    slide: i + 1,
    transition,
    label: c.title || `Chapter ${i + 1}`,
  }));
}

function fromTextLines(text) {
  const out = [];
  const re = /^\s*\(?((?:\d{1,2}:)?\d{1,2}:\d{2}(?:\.\d+)?)\)?[)\s.–—-]*(.*)$/;
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(re);
    if (!m) continue;
    const t = parseClock(m[1]);
    if (t == null) continue;
    out.push({ time: t, slide: out.length + 1, transition, label: (m[2] || '').trim() || `Slide ${out.length + 1}` });
  }
  if (out.length === 0) throw new Error('No "MM:SS Title" lines recognised in the input.');
  return out;
}

function readInput() {
  if (inputPath) return { name: inputPath, text: readFileSync(inputPath, 'utf8') };
  // stdin
  try { return { name: '<stdin>', text: readFileSync(0, 'utf8') }; }
  catch { return { name: '<stdin>', text: '' }; }
}

function main() {
  const { name, text } = readInput();
  if (!text.trim()) {
    console.error('No input. Pass a .info.json / .txt path, or pipe "MM:SS Title" lines.');
    process.exit(1);
  }
  let sync;
  const looksJson = name.endsWith('.json') || text.trim().startsWith('{');
  if (looksJson) {
    sync = fromInfoJson(JSON.parse(text));
  } else {
    sync = fromTextLines(text);
  }

  if (mergePath) {
    const manifest = JSON.parse(readFileSync(mergePath, 'utf8'));
    manifest.sync = sync;
    writeFileSync(mergePath, JSON.stringify(manifest, null, 2) + '\n');
    console.error(`Wrote ${sync.length} cues into ${mergePath}`);
  } else {
    process.stdout.write(JSON.stringify({ sync }, null, 2) + '\n');
  }
}

main();
