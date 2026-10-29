#!/usr/bin/env node
// esssouth Lesson 03 · QA for ONE section, run against the actual build (index.html from disk, Chromium via Playwright).
// Usage: node tools/qa.cjs S01 [--quick]   → qa/S01/report.json + qa/S01/stills/*.jpg
// Needs: Node 18+, Playwright (PLAYWRIGHT_MODULE or NODE_PATH pointing at an installed copy) with Chromium.
const pw = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); const path = require('path'), fs = require('fs'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..'), SEC = process.argv[2], QUICK = process.argv.includes('--quick');
const OUT = path.join(ROOT, 'qa', SEC), STILLS = path.join(OUT, 'stills'); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(STILLS, { recursive: true });
const URL0 = 'file://' + path.join(ROOT, 'sections', SEC, 'index.html');
const R = { section: SEC, ranAt: new Date().toISOString(), environment: {}, checks: [], failures: [], notes: [] };
const ok = (name, cond, detail) => { R.checks.push({ name, pass: !!cond, detail: detail === undefined ? null : detail }); if (!cond) R.failures.push(name + (detail !== undefined ? ' :: ' + JSON.stringify(detail).slice(0, 400) : '')); return !!cond; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(browser, q, vp) {
  const ctx = await browser.newContext({ viewport: vp || { width: 1920, height: 1080 } }); const p = await ctx.newPage();
  const errs = [], remote = [];
  p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) remote.push(r.url()); });
  await ctx.route(/^(?!file:|data:)/, (r) => r.abort());
  await p.addInitScript(() => { window.__gum = 0; if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = () => { window.__gum++; return Promise.reject(new Error('blocked')); }; });
  await p.goto(URL0 + (q ? '?' + q : '')); await p.waitForFunction(() => document.body.dataset.ready, null, { timeout: 30000 });
  return { p, ctx, errs, remote };
}
// a DOM snapshot of everything time-dependent on the stage
const SNAP = () => { const out = []; document.querySelectorAll('#stage .tok:not(.measure)').forEach((n) => out.push([n.dataset.token, n.style.opacity, n.style.left, n.style.top, n.style.width, n.style.height, n.querySelector('.t2').className, n.querySelector('.tx').textContent, n.querySelector('.ttag').textContent]));
  document.querySelectorAll('#stage .layer.scene').forEach((n) => out.push([n.dataset.layer, n.style.opacity])); const rm = document.querySelector('#stage .room'); out.push(['room', rm.style.opacity, rm.style.transform]);
  const cap = document.querySelector('#stage .capbar'); out.push(['cap', cap.style.opacity, +cap.style.opacity > 0 ? cap.querySelector('.ctext').textContent : '']); return JSON.stringify(out); };
// layout audit of the current frame: visible tokens inside the stage, out of the caption band, no text overflow, no overlaps
const AUDIT = (moving) => {
  moving = new Set(moving || []); const issues = [], vis = [], HOLD = new Set(['holdTxt', 'holdBar', 'holdHint']), CONTAINER = /\bframe\b|\bctx\b|unobserved/;
  document.querySelectorAll('#stage .tok:not(.measure)').forEach((n) => {
    const o = +n.style.opacity; if (!(o > 0.05)) return; const id = n.dataset.token, b = n.querySelector('.t2'), txt = n.querySelector('.tx').textContent.trim();
    const r = { x: parseFloat(n.style.left), y: parseFloat(n.style.top), w: parseFloat(n.style.width), h: parseFloat(n.style.height) };
    if (r.x < 0 || r.y < 0 || r.x + r.w > 1920 + 0.5 || r.y + r.h > 1080 + 0.5) issues.push({ type: 'outside-stage', id, r });
    if (!HOLD.has(id) && r.y + r.h > 884 && txt) issues.push({ type: 'in-caption-band', id, r });
    if (CONTAINER.test(b.className) && !txt) return;
    if (b.classList.contains('overflow') || b.scrollWidth > b.clientWidth + 1 || b.scrollHeight > b.clientHeight + 1) issues.push({ type: 'text-overflow', id, text: b.textContent.slice(0, 60) });
    const tag = n.querySelector('.ttag'); let tr = null;
    if (tag.textContent && getComputedStyle(tag).display !== 'none') { const tb = tag.getBoundingClientRect(), sb = document.getElementById('stage').getBoundingClientRect(), k = 1920 / sb.width; tr = { x: (tb.left - sb.left) * k, y: (tb.top - sb.top) * k, w: tb.width * k, h: tb.height * k }; }
    if (o > 0.9 && txt || tr) vis.push({ id, r, tr, cont: CONTAINER.test(b.className), o });
  });
  // hidden behind another object: a later (higher) opaque token covering the centre of a visible text
  const toks = [...document.querySelectorAll('#stage .tok:not(.measure)')].filter((n) => +n.style.opacity > 0.9);
  toks.forEach((n, i) => { const tx = n.querySelector('.tx'); if (!tx.textContent.trim()) return; const id = n.dataset.token;
    const cx = parseFloat(n.style.left) + parseFloat(n.style.width) / 2, cy = parseFloat(n.style.top) + parseFloat(n.style.height) / 2;
    toks.slice(i + 1).forEach((m) => { const x = parseFloat(m.style.left), y = parseFloat(m.style.top), w = parseFloat(m.style.width), h = parseFloat(m.style.height);
      if (cx > x && cx < x + w && cy > y && cy < y + h) { const bg = getComputedStyle(m.querySelector('.t2')).backgroundColor; if (bg && bg !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(bg)) issues.push({ type: 'covered', id, by: m.dataset.token }); } }); });
  const ov = (a, c) => Math.max(0, Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x)) * Math.max(0, Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y));
  for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) { const A = vis[i], B = vis[j]; if (A.cont || B.cont) continue;
    if (A.o > 0.9 && B.o > 0.9 && !moving.has(A.id) && !moving.has(B.id) && ov(A.r, B.r) > 300) issues.push({ type: 'overlap', a: A.id, b: B.id });
    if (A.tr && ov(A.tr, B.r) > 60) issues.push({ type: 'tag-overlap', a: A.id + '.tag', b: B.id }); if (B.tr && ov(B.tr, A.r) > 60) issues.push({ type: 'tag-overlap', a: B.id + '.tag', b: A.id }); }
  const bub = document.querySelector('#stage .tok[data-token="bubL"]'); if (bub && +bub.style.opacity > 0.9) { const b = bub.querySelector('.t2'); if (b.scrollHeight > b.clientHeight + 1) issues.push({ type: 'bubble-overflow' }); }
  return issues;
};

const AUDIT_AT = ([t, k, A]) => { const L = window.__l03; const pos = (n) => [n.style.left, n.style.top, n.style.width, n.style.height].join();
  L.renderAt(Math.max(0, t - 0.05), k); const before = {}; document.querySelectorAll('#stage .tok:not(.measure)').forEach((n) => (before[n.dataset.token] = pos(n)));
  L.renderAt(t, k); const moving = []; document.querySelectorAll('#stage .tok:not(.measure)').forEach((n) => { if (before[n.dataset.token] !== pos(n)) moving.push(n.dataset.token); });
  return eval('(' + A + ')')(moving); };
(async () => {
  const browser = await pw.chromium.launch(); R.environment = { os: process.platform + ' ' + require('os').release(), browser: 'Chromium ' + browser.version(), playwright: require((process.env.PLAYWRIGHT_MODULE || 'playwright') + '/package.json').version, node: process.version,
    fonts: 'Inter installed (first in the stack); the approved reference frames were rendered with Segoe UI', viewportsAreEmulated: true };
  // ---------- 1 · load, data, warnings, offline ----------
  let { p, ctx, errs, remote } = await open(browser, 'export=1');
  const info = await p.evaluate(() => { const L = window.__l03, C = L.C, g = window.L03_DATA.graph; const tr = (k) => C.tracks[k];
    return { routes: Object.fromEntries(Object.entries(C.tracks).map(([k, t]) => [k, { duration: t.duration, steps: t.steps.map((s) => ({ id: s.id, kind: s.kind, start: s.start, end: s.end, branch: s.branch || null, block: s.block })) }])),
      gate: C.gate && { id: C.gate.id, kind: C.gate.kind, watchKey: C.gate.watchKey, options: C.gate.options.map((o) => o.key), rejoin: C.gate.interaction.rejoinCue, think: C.gate.interaction.watchThinkSeconds },
      warnings: L.warnings, cues: Object.keys(g.cues), holds: Object.fromEntries(Object.entries(g.holds).map(([k, h]) => [k, h.seconds])), anchors: C.anchors,
      capFidelity: Object.values(C.tracks).flatMap((t) => Object.values(t.captionCues).map((c) => ({ id: c.id, ok: c.segments.map((s) => s.text).join(' ') === g.cues[c.id].text }))).filter((x) => !x.ok),
      audioEls: document.querySelectorAll('audio,video').length, stageLabel: document.getElementById('stage').getAttribute('aria-label') }; });
  R.routes = Object.fromEntries(Object.entries(info.routes).map(([k, v]) => [k, +v.duration.toFixed(3)]));
  ok('page loads without errors', errs.length === 0, errs);
  ok('no layout / overflow warnings from the engine (all routes, settled states)', info.warnings.length === 0, info.warnings);
  ok('no remote requests (offline)', remote.length === 0, remote);
  ok('silent: no media elements, no microphone request', info.audioEls === 0 && (await p.evaluate(() => window.__gum)) === 0);
  ok('stage accessible name names Lesson 03 and this section', /Lesson 03, Section 3\.\d/.test(info.stageLabel), info.stageLabel);
  ok('captions reproduce exact cue words (every route)', info.capFidelity.length === 0, info.capFidelity);
  const all = new Set(Object.values(info.routes).flatMap((r) => r.steps.filter((s) => s.kind === 'line').map((s) => s.id)));
  ok('every supplied cue is reachable in some route', info.cues.every((c) => all.has(c)), info.cues.filter((c) => !all.has(c)));
  Object.entries(info.routes).forEach(([k, r]) => { const ids = r.steps.map((s) => s.id); ok(`route ${k}: each step once`, new Set(ids).size === ids.length);
    r.steps.filter((s) => s.kind === 'hold').forEach((s) => ok(`route ${k}: ${s.id} lasts ${info.holds[s.id]} s`, Math.abs(s.end - s.start - info.holds[s.id]) < 1e-6)); });
  R.anchors = info.anchors.filter((a) => a.source === 'supplied semantic anchor');
  // bubble text = exact cue text for every character line (rendered)
  const bubbleChecks = [];
  for (const [k, r] of Object.entries(info.routes)) for (const s of r.steps.filter((s) => s.kind === 'line' && !/^.*\.c\d+$|\.f\d+$/.test(s.id))) {
    const txt = await p.evaluate(([t, k]) => { window.__l03.renderAt(t, k); const b = document.querySelector('#stage .tok[data-token="bubL"]'); return { o: +b.style.opacity, text: b.querySelector('.tx').textContent }; }, [s.end - 0.2, k]);
    bubbleChecks.push({ route: k, id: s.id, ok: txt.o > 0.9 && txt.text === info.routes[k] && true || txt.o > 0.9, text: txt.text, o: txt.o });
  }
  const cueText = await p.evaluate(() => Object.fromEntries(Object.entries(window.L03_DATA.graph.cues).map(([k, c]) => [k, c.text])));
  const badBub = bubbleChecks.filter((b) => !(b.o > 0.9 && b.text === cueText[b.id]));
  ok('every character line shows its exact words in a visible bubble near its end', badBub.length === 0, badBub);

  // ---------- 2 · determinism + layout audit over every route ----------
  const audit = {}, det = []; const step = QUICK ? 1.0 : 0.25;
  for (const [k, r] of Object.entries(info.routes)) {
    const issues = []; const from = r.steps.find((s) => s.branch || s.kind === 'gate' || s.kind === 'think'); const t0 = k === 'watch' || k.endsWith(':main') || k.endsWith(':skip') ? 0 : (from ? from.start : 0);
    for (let t = t0; t <= r.duration + 1e-6; t += step) { const is = await p.evaluate(AUDIT_AT, [t, k, AUDIT.toString()]); is.forEach((x) => issues.push(Object.assign({ t: +t.toFixed(2) }, x))); }
    // transition midpoints: 0.3 s after every step start (most motions start at +0.1–0.3)
    for (const s of r.steps) { if (s.start < t0) continue; for (const dt of [0.3, 0.6]) { const t = s.start + dt; const is = await p.evaluate(AUDIT_AT, [t, k, AUDIT.toString()]); is.forEach((x) => issues.push(Object.assign({ t: +t.toFixed(2), transition: s.id }, x))); } }
    const uniq = {}; issues.forEach((x) => { const key = x.type + '|' + (x.id || '') + (x.a || '') + (x.b || ''); (uniq[key] = uniq[key] || []).push(x.t); });
    audit[k] = Object.entries(uniq).map(([key, ts]) => ({ key, count: ts.length, first: ts[0], last: ts[ts.length - 1] }));
    // determinism: the same t rendered after different histories gives the same DOM
    const samples = r.steps.filter((s) => s.start >= t0).map((s) => s.start + Math.min(0.37, s.end - s.start)).concat([r.duration - 0.05]);
    for (const t of samples.slice(0, QUICK ? 6 : 40)) { const a = await p.evaluate(([t, k, S]) => { window.__l03.renderAt(t, k); return eval('(' + S + ')')(); }, [t, k, SNAP.toString()]);
      const b = await p.evaluate(([t, k, S]) => { window.__l03.renderAt(Math.max(0, t - 7.3), k); window.__l03.renderAt(t + 3.1, k); window.__l03.renderAt(t, k); return eval('(' + S + ')')(); }, [t, k, SNAP.toString()]);
      if (a !== b) det.push({ route: k, t }); }
  }
  R.layoutAudit = audit;
  Object.entries(audit).forEach(([k, a]) => ok(`route ${k}: visible text inside the stage, clear of the caption band, no clipping or overlaps (sampled every ${step} s + transition midpoints)`, a.length === 0, a));
  ok('deterministic: same frame after different seek histories', det.length === 0, det);

  // ---------- 3 · stills (block opening / middle / end per route, transitions, branch) ----------
  const stills = [];
  const shoot = async (k, t, name) => { await p.evaluate(([t, k]) => window.__l03.renderAt(t, k), [t, k]); const f = `${SEC}_${k.replace(':', '-')}_${name}_t${t.toFixed(2)}.jpg`; await p.screenshot({ path: path.join(STILLS, f), type: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: 1920, height: 1080 }, scale: 'css' }); stills.push(f); };
  for (const [k, r] of Object.entries(info.routes)) {
    if (k === 'practice:main') continue; // identical to watch
    const branchOnly = k.startsWith('practice:') && k !== 'practice:skip';
    const blocks = [...new Set(r.steps.map((s) => s.block))];
    for (const b of blocks) { const ss = r.steps.filter((s) => s.block === b && (!branchOnly || s.branch || s.kind === 'ready')); if (!ss.length) continue; if (k === 'practice:skip' && !ss.some((s) => s.kind === 'gate')) continue;
      const a = ss[0].start, e = ss[ss.length - 1].end; await shoot(k, a + 1.2, b.split('.').pop() + '-open'); await shoot(k, (a + e) / 2, b.split('.').pop() + '-mid'); await shoot(k, Math.max(a, e - 0.3), b.split('.').pop() + '-end'); }
    if (k === 'watch') for (const s of r.steps.filter((s, i) => i > 0)) await shoot(k, s.start + 0.35, 'trans-' + s.id.split('.').pop());
    if (branchOnly) for (const s of r.steps.filter((s) => s.branch)) { await shoot(k, s.start + 0.35, 'trans-' + s.id.split('.').pop()); await shoot(k, s.end - 0.3, 'settled-' + s.id.split('.').pop()); }
  }
  // reduced motion: mid-transition frames are already settled compositions
  await p.close(); await ctx.close();
  ({ p, ctx, errs } = await open(browser, 'export=1&rm=1'));
  const rmBad = []; for (const s of info.routes.watch.steps.slice(1, QUICK ? 6 : 999)) { const v = await p.evaluate((t) => { window.__l03.renderAt(t, 'watch'); return [...document.querySelectorAll('#stage .tok:not(.measure)')].map((n) => +n.style.opacity).filter((o) => o > 0.003 && o < 0.997 && Math.abs(o - 0.4) > 0.01); }, s.start + 0.2); if (v.length) rmBad.push({ t: s.start + 0.2, partial: v.length }); }
  ok('reduced motion: no partially faded tokens mid-transition (motions cut at their start)', rmBad.length === 0, rmBad);
  const rmMid = info.routes.watch.steps[Math.floor(info.routes.watch.steps.length / 2)]; await p.evaluate((t) => window.__l03.renderAt(t, 'watch'), rmMid.start + 0.3);
  await p.screenshot({ path: path.join(STILLS, `${SEC}_reduced-motion_t${(rmMid.start + 0.3).toFixed(2)}.jpg`), type: 'jpeg', quality: 70 }); stills.push(`${SEC}_reduced-motion_t${(rmMid.start + 0.3).toFixed(2)}.jpg`);
  await p.close(); await ctx.close();
  R.stills = stills;

  // ---------- 4 · transport, modes, rates, keyboard, captions (normal page) ----------
  ({ p, ctx, errs } = await open(browser, ''));
  const W = info.routes.watch, common = W.steps.find((s) => s.kind === 'line' && W.steps.indexOf(s) > 3 && (!info.gate || s.start < W.steps.find((x) => x.kind === 'think').start));
  // rates: wall-clock advance
  for (const r of [1, 1.25, 1.5, 2]) { const d = await p.evaluate(async (r) => { const L = window.__l03; L.setRate(r); L.seek(10); L.play(); const a = L.t, w = performance.now(); await new Promise((z) => setTimeout(z, 1500)); const b = L.t, w2 = performance.now(); L.pause(); return (b - a) / ((w2 - w) / 1000); }, r);
    ok(`rate ${r}×: clock advances at ${r}× (measured ${d.toFixed(3)})`, Math.abs(d - r) < 0.06 * r, d); }
  await p.evaluate(() => window.__l03.setRate(1));
  // mode switch on common content keeps cue + offset
  const ms = await p.evaluate((c) => { const L = window.__l03; L.seek(c.start + 2.0); L.setMode('practice'); const s1 = L.C.tracks[L.ST.route].stepAt(L.t); const off1 = L.t - s1.start; L.setMode('watch'); const s2 = L.C.tracks[L.ST.route].stepAt(L.t); return { a: s1.id, off1, b: s2.id, off2: L.t - s2.start, mode: L.ST.mode }; }, common);
  ok('mode switch at common content keeps cue and offset (watch → practice → watch)', ms.a === common.id && ms.b === common.id && Math.abs(ms.off1 - 2) < 1e-6 && Math.abs(ms.off2 - 2) < 1e-6, ms);
  // restart
  const rs = await p.evaluate(async () => { const L = window.__l03; L.seek(40); L.restart(); await new Promise((z) => setTimeout(z, 200)); const r = { t: L.t, playing: L.playing, gate: L.ST.gate, choice: L.ST.choice }; L.pause(); return r; });
  ok('restart returns to the section start and plays', rs.t < 0.5 && rs.playing, rs);
  // keyboard: Space toggles, Tab reaches controls with a visible focus ring
  await p.evaluate(() => { window.__l03.pause(); document.activeElement && document.activeElement.blur(); });
  await p.keyboard.press('Space'); const k1 = await p.evaluate(() => window.__l03.playing); await p.keyboard.press('Space'); const k2 = await p.evaluate(() => window.__l03.playing);
  ok('keyboard: Space plays and pauses', k1 === true && k2 === false, { k1, k2 });
  const foc = []; for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); foc.push(await p.evaluate(() => { const a = document.activeElement, cs = getComputedStyle(a); return { tag: a.tagName, id: a.id || a.dataset.mode || '', outline: cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px' }; })); }
  ok('keyboard: Tab reaches mode and playback controls with a visible focus outline', foc.filter((f) => ['BUTTON', 'INPUT', 'SELECT'].includes(f.tag)).length >= 4 && foc.filter((f) => ['BUTTON', 'INPUT', 'SELECT'].includes(f.tag)).every((f) => f.outline), foc);
  // captions toggle
  const cap = await p.evaluate((t) => { const L = window.__l03; L.seek(t); const on = +document.querySelector('#stage .capbar').style.opacity; document.getElementById('cap').click(); const off = +document.querySelector('#stage .capbar').style.opacity; document.getElementById('cap').click(); return { on, off, dom: document.getElementById('domcap').textContent }; }, W.steps[0].start + 3);
  ok('captions toggle hides the stage caption; DOM caption carries the current words', cap.on === 1 && cap.off === 0 && cap.dom.length > 10, cap);
  ok('no runtime errors during transport tests', errs.length === 0, errs);
  await p.close(); await ctx.close();

  // ---------- 5 · Practice interaction contract (sections with a gate) ----------
  if (info.gate) {
    const G = info.gate; ({ p, ctx, errs } = await open(browser, 'mode=practice'));
    const S = () => p.evaluate(() => { const L = window.__l03; return { t: L.t, gate: L.ST.gate, route: L.ST.route, choice: L.ST.choice, playing: L.playing, flags: Object.assign({}, L.ST.flags), step: L.C.tracks[L.ST.route].stepAt(L.t).id }; });
    const gEnd = info.routes['practice:skip'].steps.find((s) => s.kind === 'gate').end, gStart = gEnd - 1.2;
    // play into the gate at 2×
    await p.evaluate((x) => { const L = window.__l03; L.setRate(2); L.seek(x); L.play(); }, gStart - 2);
    await p.waitForFunction(() => window.__l03.ST.gate === 'awaiting', null, { timeout: 15000 });
    const capW = await p.evaluate(() => ({ stage: +document.querySelector('#stage .capbar').style.opacity, dom: document.getElementById('domcap').textContent, prompt: window.__l03.uiText('gate.prompt') }));
    ok('practice: while waiting, no caption from the next cue; the DOM line shows the prompt', capW.stage === 0 && capW.dom === capW.prompt, capW);
    let s = await S(); ok('practice: playback stops and waits at the gate (awaiting_choice)', s.gate === 'awaiting' && !s.playing && Math.abs(s.t - gEnd) < 0.01, s);
    const base = await p.evaluate((S) => eval('(' + S + ')')(), SNAP.toString());
    await p.screenshot({ path: path.join(STILLS, `${SEC}_practice_gate-awaiting.jpg`), type: 'jpeg', quality: 70 }); stills.push(`${SEC}_practice_gate-awaiting.jpg`);
    await p.keyboard.press('Space'); await p.click('#play', { force: true }).catch(() => {}); await p.evaluate(() => window.__l03.setRate(1.5)); await sleep((G.think + 1.5) * 1000);
    s = await S(); ok(`practice: Play, Space, a rate change and ${G.think + 1.5} s of wall time do not choose (still waiting beyond the ${G.think} s Watch hold)`, s.gate === 'awaiting' && s.choice === null && Math.abs(s.t - gEnd) < 0.01, s);
    const btnCount = await p.evaluate(() => document.querySelectorAll('#ipanel button.opt').length);
    if (G.kind === 'choice') ok('practice: DOM choice buttons list every option', btnCount === G.options.length, btnCount);
    const keys = G.kind === 'choice' ? G.options : ['model'];
    for (const k of keys) {
      // select (rapid double tap + a second option: first valid selection wins)
      if (G.kind === 'choice') await p.evaluate((k) => { const b = document.querySelector(`#ipanel button.opt[data-choice="${k}"]`); b.click(); b.click(); const o = [...document.querySelectorAll('#ipanel button.opt')].find((x) => x.dataset.choice !== k); if (o) o.click(); }, k);
      else await p.evaluate(() => { const b = document.querySelector('#ipanel button[data-act="model"]'); b.click(); b.click(); });
      s = await S(); ok(`practice ${k}: first selection wins; branch plays on its own route`, s.gate === 'branch_playing' && s.route === 'practice:' + k && s.choice === k && s.playing, s);
      const rng = await p.evaluate(() => window.__l03.scrubRange()); const br = info.routes['practice:' + k].steps.filter((x) => x.branch);
      ok(`practice ${k}: scrubber is branch-local`, Math.abs(rng[0] - br[0].start) < 1e-6 && Math.abs(rng[1] - br[br.length - 1].end) < 1e-6, rng);
      // branch-local seek cannot leave the branch
      await p.evaluate((x) => window.__l03.seek(x), rng[1] + 50); s = await S(); ok(`practice ${k}: seek beyond the branch stays inside it (branch_ready, no common cue)`, s.gate === 'branch_ready' && Math.abs(s.t - rng[1]) < 1e-6, s);
      await p.evaluate((x) => { window.__l03.seek(x); window.__l03.play(); }, rng[1] - 1.0); await p.waitForFunction(() => window.__l03.ST.gate === 'branch_ready', null, { timeout: 8000 });
      s = await S(); ok(`practice ${k}: branch end waits for Continue`, s.gate === 'branch_ready' && !s.playing, s);
      await shootP(p, `${SEC}_practice_${k}_branch-ready.jpg`);
      if (k === 'model') ok('practice model: viewing sets modelViewed only (no speakingObserved / completionAssumed / proposalAdopted)', s.flags.modelViewed === true && !s.flags.speakingObserved && !s.flags.completionAssumed && !s.flags.proposalAdopted && s.flags.responseText === null, s.flags);
      // retry restores the baseline exactly
      await p.evaluate(() => document.querySelector('#ipanel button[data-act="retry"]').click()); s = await S();
      const again = await p.evaluate((S) => eval('(' + S + ')')(), SNAP.toString());
      ok(`practice ${k}: Try again restores the gate baseline (state + identical stage)`, s.gate === 'awaiting' && s.choice === null && again === base && !s.flags.modelViewed, { s, same: again === base });
      // choose again, run to the end, Continue (double) rejoins once
      if (G.kind === 'choice') await p.evaluate((k) => document.querySelector(`#ipanel button.opt[data-choice="${k}"]`).click(), k); else await p.evaluate(() => document.querySelector('#ipanel button[data-act="model"]').click());
      await p.evaluate((x) => window.__l03.seek(x), rng[1]); await p.evaluate(() => { const b = document.querySelector('#ipanel button[data-act="continue"]'); b.click(); b.click(); });
      await sleep(300); s = await S(); const r = info.routes['practice:' + k].steps; const rj = r.findIndex((x) => x.id === G.rejoin);
      ok(`practice ${k}: Continue rejoins ${G.rejoin} once`, s.gate === 'resolved' && s.step === G.rejoin && s.playing && r.filter((x) => x.id === G.rejoin).length === 1 && r[rj - 1].kind === 'ready', s);
      if (k === 'model') ok('practice model: flags after Continue still claim nothing', s.flags.modelViewed === true && !s.flags.speakingObserved && !s.flags.completionAssumed && !s.flags.proposalAdopted, s.flags);
      const capAfter = await p.evaluate(() => document.querySelector('#stage .capbar .ctext').textContent); const brTexts = await p.evaluate((ids) => ids.map((i) => window.L03_DATA.graph.cues[i].text), br.filter((x) => x.kind === 'line').map((x) => x.id));
      ok(`practice ${k}: no branch words in the common continuation caption`, !brTexts.some((t) => t.includes(capAfter) && capAfter.length > 5), capAfter);
      // seek before the gate resets the attempt
      await p.evaluate((x) => { window.__l03.pause(); window.__l03.seek(x); }, gStart - 3); s = await S();
      ok(`practice ${k}: seek before the gate resets the attempt`, s.gate === 'before' && s.choice === null && s.route === 'practice:skip', s);
      await p.evaluate((x) => window.__l03.seek(x), gEnd); s = await S(); ok(`practice ${k}: seek to the gate stops there`, s.gate === 'awaiting', s);
    }
    // skip
    await p.evaluate(() => document.querySelector('#ipanel button[data-act="skip"]').click()); await sleep(200); s = await S();
    ok('practice: Skip enters the common continuation once, unanswered, no assessment', s.gate === 'resolved' && s.choice === 'skip' && s.route === 'practice:skip' && s.step === G.rejoin && !s.flags.modelViewed, s);
    if (G.kind !== 'choice') { await p.evaluate((x) => { window.__l03.pause(); window.__l03.seek(x); }, gEnd); await p.evaluate(() => document.querySelector('#ipanel button[data-act="continue"]').click()); await sleep(200); s = await S();
      ok('practice rehearsal: Continue without the model rejoins once (modelViewed stays false)', s.gate === 'resolved' && s.step === G.rejoin && s.flags.modelViewed === false, s); }
    // seek forward across an unvisited gate (fresh state)
    await p.evaluate(() => { window.__l03.pause(); window.__l03.seek(1); }); await p.evaluate((x) => window.__l03.seek(x), info.routes['practice:skip'].duration - 4); s = await S();
    ok('practice: seek forward across an unvisited gate stops at the gate', s.gate === 'awaiting' && Math.abs(s.t - gEnd) < 0.01, s);
    // seek after resolution is allowed into the continuation
    await p.evaluate(() => document.querySelector('#ipanel button[data-act="skip"]').click()); await p.evaluate((x) => { window.__l03.pause(); window.__l03.seek(x); }, info.routes['practice:skip'].duration - 4); s = await S();
    ok('practice: after Skip, seeking within the continuation is allowed', s.gate === 'resolved' && Math.abs(s.t - (info.routes['practice:skip'].duration - 4)) < 0.01, s);
    // mode switch inside the gate → each mode's declared entry
    await p.evaluate((x) => window.__l03.seek(x), 2); await p.evaluate((x) => window.__l03.seek(x), gEnd); await p.evaluate(() => window.__l03.setMode('watch')); s = await S();
    const thinkStart = info.routes.watch.steps.find((x) => x.kind === 'think').start;
    ok('mode switch at the gate: Watch restarts at its thinking hold', s.route === 'watch' && Math.abs(s.t - thinkStart) < 1e-6, s);
    await p.evaluate(() => window.__l03.setMode('practice')); s = await S(); ok('mode switch at the gate: Practice returns to awaiting_choice', s.gate === 'awaiting' && s.choice === null, s);
    // mode switch inside a branch
    if (G.kind === 'choice') await p.evaluate((k) => document.querySelector(`#ipanel button.opt[data-choice="${k}"]`).click(), keys[0]); else await p.evaluate(() => document.querySelector('#ipanel button[data-act="model"]').click());
    await sleep(500); await p.evaluate(() => window.__l03.setMode('watch')); s = await S(); ok('mode switch inside a branch: Watch restarts at its thinking hold (no branch carried over)', s.route === 'watch' && Math.abs(s.t - thinkStart) < 1e-6 && s.choice === null, s);
    // Watch: thinking hold then only the declared path, then the common continuation, without waiting
    await p.evaluate((x) => { const L = window.__l03; L.setRate(2); L.seek(x); L.play(); }, thinkStart - 0.5); await sleep(((G.think + 1) / 2) * 1000 + 600); s = await S();
    const wb = info.routes.watch.steps.filter((x) => x.branch); ok(`watch: no waiting at the gate; the declared path (${G.watchKey}) follows the ${G.think} s thinking hold`, s.playing && wb.every((x) => x.branch === G.watchKey) && s.step === wb[0].id, s);
    ok('practice: no runtime errors', errs.length === 0, errs);
    await p.close(); await ctx.close();
  } else {
    ({ p, ctx, errs } = await open(browser, 'mode=practice'));
    const s = await p.evaluate(() => ({ route: window.__l03.ST.route, same: JSON.stringify(window.__l03.C.tracks['practice:main'].steps.map((x) => x.id)) === JSON.stringify(window.__l03.C.tracks.watch.steps.map((x) => x.id)) }));
    ok('practice: shared reflection route identical to Watch (no gate in this section)', s.route === 'practice:main' && s.same, s);
    await p.close(); await ctx.close();
  }

  // ---------- 6 · retiming (supplied isolated profile) ----------
  ({ p, ctx, errs } = await open(browser, 'export=1&timing=retime-demo'));
  const rt = await p.evaluate(() => { const C = window.__l03.C, D = window.L03_DATA, P = D.retimeDemo; return { tracks: Object.fromEntries(Object.entries(C.tracks).map(([k, t]) => [k, { d: t.duration, steps: t.steps.map((s) => ({ id: s.id, dur: s.end - s.start, kind: s.kind })) }])), anchors: C.anchors, P, warnings: window.__l03.warnings }; });
  const prod = info.routes; let expDelta = 0; Object.entries(rt.P.durationMultipliers).forEach(([id, m]) => { const s = prod.watch.steps.find((x) => x.id === id); if (s) expDelta += (s.end - s.start - 0.35) * (m - 1); });
  const holdShift = Object.entries(rt.P.fixedHolds || {}).reduce((a, [id, sec]) => a + (sec - info.holds[id]), 0);
  ok(`retime: Watch duration changes by the expected clip delta (${expDelta.toFixed(3)} s${holdShift ? ' + fixture hold change ' + holdShift : ''})`, Math.abs(rt.tracks.watch.d - prod.watch.duration - expDelta - holdShift) < 0.01, { prod: prod.watch.duration, retimed: rt.tracks.watch.d });
  ok('retime: step order unchanged in every route', Object.keys(prod).every((k) => JSON.stringify(prod[k].steps.map((s) => s.id)) === JSON.stringify(rt.tracks[k].steps.map((s) => s.id))));
  ok('retime: holds keep their fixture length; think holds unchanged', rt.tracks.watch.steps.filter((s) => s.kind === 'hold').every((s) => Math.abs(s.dur - (rt.P.fixedHolds[s.id] != null ? rt.P.fixedHolds[s.id] : info.holds[s.id])) < 1e-6) && rt.tracks.watch.steps.filter((s) => s.kind === 'think').every((s) => !info.gate || Math.abs(s.dur - info.gate.think) < 1e-6));
  if (Object.values(rt.P.fixedHolds || {}).some((v, i) => v !== info.holds[Object.keys(rt.P.fixedHolds)[i]])) R.notes.push('The supplied retime fixture sets a hold length that differs from the production script (' + JSON.stringify(rt.P.fixedHolds) + ' vs ' + JSON.stringify(info.holds) + '); the build applies the fixture as given and reports it.');
  const shifted = rt.anchors.filter((a) => rt.P.durationMultipliers[a.cue]).map((a) => { const b = info.anchors.find((x) => x.name === a.name); return { name: a.name, ratio: b.localSec ? a.localSec / b.localSec : 1, m: rt.P.durationMultipliers[a.cue] }; });
  ok('retime: anchors in a lengthened cue keep their relative place (local time × multiplier)', shifted.every((x) => Math.abs(x.ratio - x.m) < 1e-3 || !isFinite(x.ratio)), shifted.slice(0, 6));
  // visible state at semantic anchors: the frame 0.7 s after each anchor of a retimed cue matches production's
  const stateDiff = [];
  for (const a of rt.anchors.filter((a) => rt.P.durationMultipliers[a.cue]).slice(0, 12)) {
    const at = (tr, an) => tr.steps.find((s) => s.id === an.cue);
    const tR = await p.evaluate((n) => window.__l03.C.tracks.watch.at(n), a.name) + 0.7;
    const snapR = await p.evaluate(([t, S]) => { window.__l03.renderAt(t, 'watch'); return eval('(' + S + ')')(); }, [tR, SNAP.toString()]);
    const { p: p2, ctx: c2 } = await open(browser, 'export=1'); const [tP, snapP] = await p2.evaluate(([n, S]) => { const t = window.__l03.C.tracks.watch.at(n) + 0.7; window.__l03.renderAt(t, 'watch'); return [t, eval('(' + S + ')')()]; }, [a.name, SNAP.toString()]); await p2.close(); await c2.close();
    const strip = (s) => JSON.parse(s).filter((x) => x[0] !== 'cap').map((x) => x.slice(0, 8).map((v) => (typeof v === 'string' && /^-?[\d.]+(px)?$/.test(v) ? Math.round(parseFloat(v) * 50) / 50 : v))); // captions follow the clip; compare the board
    if (JSON.stringify(strip(snapR)) !== JSON.stringify(strip(snapP))) stateDiff.push({ anchor: a.name, tProd: tP, tRetimed: tR });
  }
  ok('retime: board state 0.7 s after each anchor of a retimed cue equals production (semantic placement kept)', stateDiff.length === 0, stateDiff);
  ok('retime: no layout warnings', rt.warnings.length === 0, rt.warnings);
  for (const st of rt.tracks.watch.steps.filter((s) => rt.P.durationMultipliers[s.id])) { const tt = await p.evaluate((id) => { const s = window.__l03.C.tracks.watch.cue(id); return s.end - 0.5; }, st.id); await p.evaluate((t) => window.__l03.renderAt(t, 'watch'), tt); const f = `${SEC}_retime-demo_${st.id.split('.').pop()}-end_t${tt.toFixed(2)}.jpg`; await p.screenshot({ path: path.join(STILLS, f), type: 'jpeg', quality: 70 }); stills.push(f); }
  await p.close(); await ctx.close();

  // ---------- 7 · text expansion, long token ----------
  R.textExpansion = {};
  for (const tx of ['x1.3', 'x1.6', 'long']) { ({ p, ctx, errs } = await open(browser, 'export=1&text=' + tx)); const w = await p.evaluate(() => window.__l03.warnings); R.textExpansion[tx] = { warnings: w.length, sample: w.slice(0, 20), errors: errs };
    const mid = info.routes.watch.steps[Math.floor(info.routes.watch.steps.length * 0.45)]; await p.evaluate((t) => window.__l03.renderAt(t, 'watch'), mid.end - 0.4); const f = `${SEC}_text-${tx}_t${(mid.end - 0.4).toFixed(2)}.jpg`; await p.screenshot({ path: path.join(STILLS, f), type: 'jpeg', quality: 70 }); stills.push(f);
    await p.close(); await ctx.close(); }
  R.notes.push('Text expansion is a stress report, not a pass/fail gate: overflow at ×1.3/×1.6 is reported by the fitter (never clipped silently) and needs layout work in the localization pass where it occurs.');

  // ---------- 8 · viewports (emulated) ----------
  R.viewports = [];
  for (const vp of [{ n: 'phone 390x844', width: 390, height: 844 }, { n: 'tablet 820x1180', width: 820, height: 1180 }, { n: 'tablet landscape 1180x820', width: 1180, height: 820 }, { n: 'desktop 1366x768', width: 1366, height: 768 }]) {
    ({ p, ctx, errs } = await open(browser, info.gate ? 'mode=practice' : '', { width: vp.width, height: vp.height }));
    if (info.gate) await p.evaluate((x) => window.__l03.seek(x), info.routes['practice:skip'].steps.find((s) => s.kind === 'gate').end);
    else await p.evaluate((x) => window.__l03.seek(x), 6);
    const m = await p.evaluate(() => { const small = [...document.querySelectorAll('.controls button, .controls select, .modes button, #ipanel button, .controls label.tg')].filter((n) => n.offsetParent).map((n) => ({ t: n.textContent.trim().slice(0, 20), h: n.getBoundingClientRect().height })).filter((x) => x.h < 43.5);
      return { hscroll: document.documentElement.scrollWidth > window.innerWidth + 1, small, domcap: document.getElementById('domcap').textContent.length, domcapFs: parseFloat(getComputedStyle(document.getElementById('domcap')).fontSize), panel: !document.getElementById('ipanel').hidden }; });
    const f = `${SEC}_viewport-${vp.width}x${vp.height}.png`; await p.screenshot({ path: path.join(STILLS, f), fullPage: true }); stills.push(f);
    R.viewports.push(Object.assign({ viewport: vp.n }, m));
    ok(`${vp.n} (emulated): no horizontal scroll, controls ≥ 44 px, readable DOM caption/prompt`, !m.hscroll && m.small.length === 0 && m.domcap > 5 && m.domcapFs >= 15 && (!info.gate || m.panel), m);
    await p.close(); await ctx.close();
  }
  await browser.close();
  R.summary = { checks: R.checks.length, failed: R.failures.length, stills: stills.length };
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R.summary), '\n' + R.failures.join('\n'));
  async function shootP(p, f) { await p.screenshot({ path: path.join(STILLS, f), type: 'jpeg', quality: 70 }); stills.push(f); }
})().catch((e) => { console.error(e); process.exit(2); });
