#!/usr/bin/env node
// esssouth Lesson 07 · build. Validates a section's inputs, writes its runtime data file, its index.html and a
// self-contained standalone player. Usage: node tools/build.mjs [S01 S02 …] (default: every section with a scenes.js)
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const C = require(path.join(ROOT, 'shared/l07/compile.js')), EST = require(path.join(ROOT, 'shared/toolkit/estimate.js'));
const SCRIPTS = ['shared/toolkit/beat-kit.js', 'shared/toolkit/characters.js', 'shared/toolkit/slots.js', 'shared/toolkit/estimate.js', 'shared/toolkit/engine.js', 'shared/toolkit/recipes.js',
  'shared/l07/slots-l07.js', 'shared/l07/captions.js', 'shared/l07/compile.js', 'shared/l07/kit.js', 'shared/l07/audio-hook.js'];
const CSS = ['shared/toolkit/style.css', 'shared/l07/l07.css'];
const SECTIONS = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07'];
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const want = args.length ? args : SECTIONS.filter((s) => fs.existsSync(path.join(ROOT, 'sections', s, 'scenes.js')));
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

function load(s) {
  const n = s.slice(1), dir = path.join(ROOT, 'sections', s), src = path.join(dir, 'content/source');
  const graph = rd(path.join(src, `section${n}.en.json`)), labels = rd(path.join(src, 'labels.en.json')), anchors = rd(path.join(src, 'anchors.en.json')), timing = rd(path.join(src, 'timing.en.json'));
  // --audio=<lang>: use content/audio-slots.<lang>.json written by tools/attach-audio.mjs (measured clips); default: the
  // supplied empty slots (silent review)
  const al = (process.argv.find((a) => a.startsWith('--audio=')) || '').slice(8), ap = al && path.join(dir, `content/audio-slots.${al}.json`);
  const audioSlots = ap && fs.existsSync(ap) ? rd(ap) : rd(path.join(src, 'audio-slots.en.json')), retimeDemo = rd(path.join(src, 'retime-demo.json'));
  const stagingPath = path.join(dir, 'content/staging-anchors.json'), staging = fs.existsSync(stagingPath) ? rd(stagingPath) : { anchors: {} };
  const lsPath = path.join(dir, 'content/labels.staging.en.json'), labelsStaging = fs.existsSync(lsPath) ? rd(lsPath) : { labels: {} };
  return { s, n, dir, graph, labels, anchors, timing, audioSlots, retimeDemo, staging, labelsStaging };
}
function validate(x) {
  const errs = [], { graph, staging } = x;
  Object.entries(staging.anchors).forEach(([k, a]) => { const c = graph.cues[a.cue]; if (!c) errs.push(`staging ${k}: unknown cue ${a.cue}`); else if (a.phrase && !c.text.includes(a.phrase)) errs.push(`staging ${k}: phrase "${a.phrase}" not in ${a.cue}`); });
  Object.keys(x.labelsStaging.labels).forEach((k) => { if (x.labels.labels[k]) errs.push(`staging label ${k} collides with a supplied label`); if (!k.startsWith('x.')) errs.push(`staging label ${k} must start with x.`); });
  Object.values(graph.cues).forEach((c) => c.screenLabelIds.forEach((l) => { if (!x.labels.labels[l]) errs.push(`${c.id}: label ${l} missing`); }));
  const comp = C.compile({ graph, timing: x.timing, anchors: x.anchors, staging }, { segments: EST.segments });
  comp.anchors.filter((a) => a.suppliedSec != null && Math.abs(a.localSec - a.suppliedSec) > 0.002).forEach((a) => errs.push(`anchor ${a.name}: ${a.localSec} vs supplied ${a.suppliedSec}`));
  const est = rd(path.join(x.dir, 'content/source/routes.en.json')).estimates.estimatedWatchSeconds;
  if (Math.abs(comp.tracks.watch.duration - est) > 0.002) errs.push(`watch duration ${comp.tracks.watch.duration} differs from supplied estimate ${est}`);
  return { errs, comp };
}
function page(x, inline) {
  const N = x.n, title = x.labels.labels['section.title'];
  const css = inline ? CSS.map((f) => `<style>/* ${f} */\n${fs.readFileSync(path.join(ROOT, f), 'utf8')}\n</style>`).join('\n') : CSS.map((f) => `<link rel="stylesheet" href="../../${f}">`).join('\n');
  const js = [...SCRIPTS.map((f) => [f, '../../' + f]), [`sections/${x.s}/data/l07s${N}-data.js`, `data/l07s${N}-data.js`], [`sections/${x.s}/scenes.js`, 'scenes.js'], ['shared/l07/player.js', '../../shared/l07/player.js']];
  const scripts = js.map(([f, rel]) => inline ? `<script>/* ${f} */\n${fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/<\/script/gi, '<\\/script')}\n</script>` : `<script src="${rel}"></script>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>esssouth · L07 · 6.${+N} ${title} (silent review)</title>
${css}
</head>
<body>
<div class="page">
  <div class="head"><h1 id="h1">Lesson 07 · 6.${+N} ${title}</h1><span class="tag silent" id="silent">Silent English animation review</span></div>
  <div class="controls" role="group" aria-label="Mode">
    <div class="modes"><button type="button" data-mode="watch" aria-pressed="true">Watch</button><button type="button" data-mode="practice" aria-pressed="false">Practice</button></div>
  </div>
  <div class="viewport" id="viewport"><div id="stage" role="img" aria-label="Animation stage"></div></div>
  <div class="domcap" id="domcap" role="region" aria-label="Current caption"></div>
  <div class="ipanel" id="ipanel" role="region" aria-label="Interaction" hidden></div>
  <div class="controls" role="group" aria-label="Playback">
    <button type="button" class="primary" id="play">Play</button>
    <button type="button" id="restart">Restart section</button>
    <input type="range" id="scrub" min="0" step="0.01" value="0" aria-label="Seek">
    <span class="time" id="time"></span>
    <span class="badge" id="badge"></span>
    <label class="tg"><input type="checkbox" id="cap" checked> Captions</label>
    <label class="tg"><input type="checkbox" id="rm"> Reduced motion</label>
    <label class="tg">Speed <select id="rate" aria-label="Playback speed"><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>
  </div>
  <details class="casefacts" id="casefacts" hidden><summary id="caseSummary">Case facts</summary><ol id="factlist"></ol></details>
  <div class="cueline" id="cue"></div>
  <div class="sr" id="live" role="status" aria-live="polite"></div>
  <div class="notes" id="notes"></div>
</div>
${scripts}
</body>
</html>
`;
}
const ui = rd(path.join(ROOT, 'shared/l07/ui.en.json'));
// section titles for Previous / Next come from the lesson outline (so one section's source archive rebuilds on its own)
const outline = rd(path.join(ROOT, 'handoff-input/lesson07-outline.en.json'));
const all = SECTIONS.map((s) => { const n = s.slice(1), o = outline.sections.find((x) => x.sectionId === `L07.S${n}`); return { s, id: `L07.S${n}`, title: o.title }; });
let failed = 0; const report = [];
for (const s of want) {
  const x = load(s), { errs, comp } = validate(x);
  if (errs.length) { failed++; console.error(s + ' VALIDATION FAILED\n  ' + errs.join('\n  ')); continue; }
  const i = SECTIONS.indexOf(s), prev = i > 0 ? all[i - 1] : null, next = i < 6 ? all[i + 1] : null;
  const data = { sectionId: x.graph.sectionId, num: '7.' + (+x.n), graph: x.graph, labels: x.labels, labelsStaging: x.labelsStaging, anchors: x.anchors, timing: x.timing, staging: x.staging, audioSlots: x.audioSlots, retimeDemo: x.retimeDemo, ui,
    // header chips: short scenario conditions only (the header row has room for about three short chips; longer
    // conditions are staged on the board by the section adapter instead)
    headerChips: (x.graph.scenario.conditions || []).filter((c) => c.length <= 40).slice(0, 3),
    nav: { prev: prev && { id: prev.id, href: `../${prev.s}/index.html`, title: prev.title }, next: next && { id: next.id, href: `../${next.s}/index.html`, title: next.title }, nextTitle: next ? next.title : '' } };
  const js = '/* GENERATED by tools/build.mjs from content/source (+ content/staging-anchors.json, shared/l07/ui.en.json). Do not edit. */\nwindow.L07_DATA = ' + JSON.stringify(data) + ';\n';
  fs.writeFileSync(path.join(x.dir, `data/l07s${x.n}-data.js`), js);
  fs.writeFileSync(path.join(x.dir, 'index.html'), page(x, false));
  const sa = page(x, true); fs.writeFileSync(path.join(x.dir, `L07S${x.n}_player_standalone.html`), sa);
  const routes = Object.fromEntries(Object.entries(comp.tracks).map(([k, t]) => [k, +t.duration.toFixed(3)]));
  report.push({ section: s, routes, anchors: comp.anchors.length, standaloneBytes: Buffer.byteLength(sa), standaloneSha256: sha(sa) });
  console.log(s, 'ok', JSON.stringify(routes), 'anchors', comp.anchors.length, 'standalone', Buffer.byteLength(sa), 'bytes');
}
if (failed) process.exit(1);
