#!/usr/bin/env node
// esssouth Lesson 08 · combined lesson entry. Writes lesson/index.html (+ lesson/chapters.json) that hosts ONE section
// player at a time in an iframe. Switching sections removes the old iframe (its clock, listeners and any later audio go
// with it) and creates a fresh one at the new section's initial state. Chapter durations come from the compiled routes.
// Usage: node tools/lesson.mjs [--bundle]   (--bundle: paths for the integration bundle, players/L08S0n_player_standalone.html)
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), BUNDLE = process.argv.includes('--bundle');
const C = require(path.join(ROOT, 'shared/l08/compile.js')), EST = require(path.join(ROOT, 'shared/toolkit/estimate.js'));
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const chapters = []; let at = 0;
for (let i = 1; i <= 7; i++) {
  const s = 'S0' + i, d = path.join(ROOT, 'sections', s), src = path.join(d, 'content/source');
  const graph = rd(path.join(src, `section0${i}.en.json`)), staging = fs.existsSync(path.join(d, 'content/staging-anchors.json')) ? rd(path.join(d, 'content/staging-anchors.json')) : { anchors: {} };
  const comp = C.compile({ graph, timing: rd(path.join(src, 'timing.en.json')), anchors: rd(path.join(src, 'anchors.en.json')), staging }, { segments: EST.segments });
  const w = +comp.tracks.watch.duration.toFixed(3);
  chapters.push({ id: graph.sectionId, num: '8.' + i, title: rd(path.join(src, 'labels.en.json')).labels['section.title'], watchSeconds: w, watchStartInCourse: +at.toFixed(3),
    practice: Object.fromEntries(Object.entries(comp.tracks).filter(([k]) => k.startsWith('practice:')).map(([k, t]) => [k, +t.duration.toFixed(3)])),
    gate: comp.gate ? { id: comp.gate.id, kind: comp.gate.kind } : null,
    src: BUNDLE ? `players/L08S0${i}_player_standalone.html` : `../sections/${s}/index.html`, built: fs.existsSync(path.join(d, 'scenes.js')) });
  at += w;
}
const outDir = path.join(ROOT, BUNDLE ? 'dist/_bundle' : 'lesson'); fs.mkdirSync(outDir, { recursive: true });
const meta = { lesson: 'L08', title: 'Bring Contributions Together into a Shared Proposal', note: 'Durations are compiled from the silent estimated timing (140 wpm + 0.35 s tail + fixed holds). Practice excludes unlimited waiting; alternative branches are not summed.', watchTotalSeconds: +at.toFixed(3), chapters };
fs.writeFileSync(path.join(outDir, 'chapters.json'), JSON.stringify(meta, null, 1) + '\n');
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>esssouth · Lesson 08 · Bring Contributions Together into a Shared Proposal (silent review)</title>
<style>
:root { --bg:#E9ECF1; --ink:#202632; --muted:#5D6878; --blue:#356CC8; --font: Inter, 'Segoe UI', 'Noto Sans', system-ui, sans-serif; }
* { box-sizing: border-box; } html, body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--font); overflow-x: hidden; }
.top { max-width: 1360px; margin: 0 auto; padding: 14px 16px 6px; display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center; }
.top h1 { font-size: 20px; margin: 0; flex: 1 1 320px; }
.tag { font-size: 13px; color: #8A5A12; background: #FFF6E6; padding: 4px 10px; border-radius: 999px; }
.modes { display: inline-flex; border: 1px solid #C9D0DA; border-radius: 8px; overflow: hidden; }
.modes button, nav button, .pn button { font: inherit; font-size: 14px; min-height: 44px; cursor: pointer; }
.modes button { border: 0; padding: 8px 14px; background: #fff; color: var(--ink); }
.modes button[aria-pressed="true"] { background: var(--blue); color: #fff; }
nav { max-width: 1360px; margin: 0 auto; padding: 4px 16px; display: flex; flex-wrap: wrap; gap: 8px; }
nav button { text-align: left; padding: 6px 12px; border-radius: 10px; border: 1px solid #C9D0DA; background: #fff; color: var(--ink); line-height: 1.25; }
nav button small { display: block; color: var(--muted); font-size: 12px; }
nav button[aria-current="true"] { border-color: var(--blue); box-shadow: inset 0 0 0 2px var(--blue); }
button:focus-visible { outline: 3px solid var(--blue); outline-offset: 2px; }
.pn { max-width: 1360px; margin: 0 auto; padding: 4px 16px; display: flex; gap: 8px; align-items: center; color: var(--muted); font-size: 14px; }
.pn button { padding: 6px 12px; border-radius: 8px; border: 1px solid #C9D0DA; background: #fff; }
.pn button:disabled { opacity: .45; cursor: default; }
#host { max-width: 1360px; margin: 0 auto; padding: 0 0 24px; }
#host iframe { display: block; width: 100%; border: 0; height: 1200px; background: var(--bg); }
@media (max-width: 760px) { #host iframe { height: 1500px; } nav button small { display: none; } }
</style>
</head>
<body>
<div class="top"><h1>Lesson 08 · Bring Contributions Together into a Shared Proposal</h1><span class="tag">Silent English animation review</span>
  <div class="modes" role="group" aria-label="Mode"><button type="button" data-mode="watch" aria-pressed="true">Watch</button><button type="button" data-mode="practice" aria-pressed="false">Practice</button></div></div>
<nav aria-label="Sections" id="nav"></nav>
<div class="pn"><button type="button" id="prev">Previous section</button><button type="button" id="next">Next section</button><span id="where" aria-live="polite"></span></div>
<div id="host"></div>
<script>
(function () {
  'use strict';
  var META = ${JSON.stringify(meta)};
  var q = new URLSearchParams(location.search), cur = -1, mode = q.get('mode') === 'practice' ? 'practice' : 'watch', frame = null, switches = 0;
  var nav = document.getElementById('nav'), host = document.getElementById('host');
  function fmt(s) { return Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0'); }
  META.chapters.forEach(function (c, i) { var b = document.createElement('button'); b.type = 'button'; b.dataset.section = c.id;
    b.innerHTML = '<b></b><small></small>'; b.firstChild.textContent = c.num + ' ' + c.title; b.lastChild.textContent = 'Watch ' + fmt(c.watchSeconds) + (c.gate ? ' · interaction' : '');
    b.addEventListener('click', function () { show(i); }); nav.appendChild(b); });
  function show(i) {
    if (i < 0 || i >= META.chapters.length) return; var c = META.chapters[i];
    if (frame) { try { frame.contentWindow.postMessage({ l08: 'pause' }, '*'); } catch (e) {} frame.src = 'about:blank'; frame.remove(); frame = null; } // old clock, listeners and media go with the frame
    cur = i; switches++;
    frame = document.createElement('iframe'); frame.title = 'Section ' + c.num + ' ' + c.title + ' player'; frame.src = c.src + (mode === 'practice' ? '?mode=practice' : ''); frame.dataset.section = c.id;
    host.appendChild(frame);
    [].forEach.call(nav.children, function (b, j) { b.setAttribute('aria-current', String(j === i)); });
    document.getElementById('prev').disabled = i === 0; document.getElementById('next').disabled = i === META.chapters.length - 1;
    document.getElementById('where').textContent = 'Section ' + c.num + ' of 8.7 · ' + (mode === 'watch' ? 'Watch' : 'Practice');
    try { history.replaceState(null, '', '?s=' + (i + 1) + (mode === 'practice' ? '&mode=practice' : '')); } catch (e) {}
  }
  function setMode(m) { if (m === mode) return; mode = m; document.querySelectorAll('[data-mode]').forEach(function (n) { n.setAttribute('aria-pressed', String(n.dataset.mode === mode)); });
    if (frame) frame.contentWindow.postMessage({ l08: 'mode', mode: mode }, '*'); document.getElementById('where').textContent = 'Section ' + META.chapters[cur].num + ' of 8.7 · ' + (mode === 'watch' ? 'Watch' : 'Practice'); }
  document.querySelectorAll('[data-mode]').forEach(function (n) { n.addEventListener('click', function () { setMode(n.dataset.mode); }); });
  document.getElementById('prev').addEventListener('click', function () { show(cur - 1); });
  document.getElementById('next').addEventListener('click', function () { show(cur + 1); });
  window.addEventListener('message', function (e) { var m = e.data || {}; if (!frame || e.source !== frame.contentWindow) return; // only the live section may navigate
    if (m.l08 === 'modechanged' && m.mode !== mode) { mode = m.mode; document.querySelectorAll('[data-mode]').forEach(function (n) { n.setAttribute('aria-pressed', String(n.dataset.mode === mode)); }); }
    if (m.l08 === 'height' && m.h > 200) frame.style.height = (m.h + 4) + 'px';
    if (m.l08 === 'nav') { var j = META.chapters.findIndex(function (c) { return c.id === m.section; }); if (j >= 0) show(j); } });
  document.querySelectorAll('[data-mode]').forEach(function (n) { n.setAttribute('aria-pressed', String(n.dataset.mode === mode)); });
  show(Math.max(0, Math.min(6, (parseInt(q.get('s'), 10) || 1) - 1)));
  window.__lesson = { META: META, show: show, setMode: setMode, get current() { return cur; }, get frame() { return frame; }, get switches() { return switches; } };
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log(outDir, 'watch total', meta.watchTotalSeconds, chapters.map((c) => c.id + '=' + c.watchSeconds).join(' '));
