#!/usr/bin/env node
// esssouth Lesson 08 · QA for the combined lesson entry (section switching, modes, explicit Next, no stale players).
// Usage: node tools/qa-lesson.cjs [path/to/lesson/index.html] [outName]   → qa/lesson/<outName>.json
const pw = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..'), PAGE = path.resolve(process.argv[2] || path.join(ROOT, 'lesson/index.html')), NAME = process.argv[3] || 'report';
const R = { page: path.relative(ROOT, PAGE), ranAt: new Date().toISOString(), checks: [], failures: [] };
const ok = (name, c, d) => { R.checks.push({ name, pass: !!c, detail: d === undefined ? null : d }); if (!c) R.failures.push(name + ' :: ' + JSON.stringify(d).slice(0, 300)); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await pw.chromium.launch(); R.browser = 'Chromium ' + b.version();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } }); const p = await ctx.newPage(); const errs = [], remote = [];
  p.on('pageerror', (e) => errs.push(e.message)); ctx.on('request', (r) => { if (!/^(file|data|about):/.test(r.url())) remote.push(r.url()); }); await ctx.route(/^(?!file:|data:|about:)/, (r) => r.abort());
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + PAGE);
  const child = async () => { const h = await p.$('#host iframe'); const f = await h.contentFrame(); await f.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 30000 }); return f; };
  const st = (f) => f.evaluate(() => { const L = window.__l08; return { id: window.L08_DATA.sectionId, t: L.t, playing: L.playing, mode: L.ST.mode, gate: L.ST.gate, route: L.ST.route, flags: Object.assign({}, L.ST.flags), label: document.getElementById('stage').getAttribute('aria-label') }; });
  const META = await p.evaluate(() => window.__lesson.META);
  ok('seven sections listed in order', META.chapters.map((c) => c.id).join() === 'L08.S01,L08.S02,L08.S03,L08.S04,L08.S05,L08.S06,L08.S07', META.chapters.map((c) => c.id));
  ok('chapter durations are compiled values (sum = Watch total)', Math.abs(META.chapters.reduce((a, c) => a + c.watchSeconds, 0) - META.watchTotalSeconds) < 0.01, META.watchTotalSeconds);
  for (let i = 0; i < 7; i++) { await p.evaluate((i) => window.__lesson.show(i), i); const f = await child(); const s = await st(f);
    const exists = fs.existsSync(path.resolve(path.dirname(PAGE), META.chapters[i].src));
    ok(`entry ${i + 1} opens its own product (${META.chapters[i].id})`, s.id === META.chapters[i].id && exists && s.t === 0 && !s.playing && new RegExp('Section 8\\.' + (i + 1)).test(s.label), s); }
  // switch during playback
  await p.evaluate(() => window.__lesson.show(1)); let f = await child(); await f.evaluate(() => { window.__l08.setRate(2); window.__l08.seek(30); window.__l08.play(); }); await sleep(800);
  await p.evaluate(() => window.__lesson.show(2)); f = await child(); let s = await st(f); await sleep(600); const s2 = await st(f);
  ok('switch during playback: one player remains, new section at its start, not playing, clock not advancing', (await p.$$('#host iframe')).length === 1 && s.id === 'L08.S03' && s.t === 0 && !s.playing && s2.t === 0, { s, s2 });
  // switch during a Practice choice wait
  await p.evaluate(() => window.__lesson.setMode('practice')); await sleep(300); s = await st(f); ok('lesson mode switch reaches the live section', s.mode === 'practice', s);
  const gEnd = await f.evaluate(() => window.__l08.C.tracks['practice:skip'].gateStep.end); await f.evaluate((x) => window.__l08.seek(x), gEnd); s = await st(f);
  ok('S03 practice: waiting at the choice before switching', s.gate === 'awaiting', s);
  await f.evaluate(() => document.querySelector('#ipanel button.opt[data-choice="A"]').click()); await sleep(300);
  await p.evaluate(() => window.__lesson.show(1)); f = await child(); s = await st(f);
  ok('switch during a branch: new section starts clean in Practice (no stale choice)', s.id === 'L08.S02' && s.mode === 'practice' && s.gate === 'before' && s.route === 'practice:skip' && s.t === 0, s);
  // switch during S06 model playback
  await p.evaluate(() => window.__lesson.show(5)); f = await child(); const g6 = await f.evaluate(() => window.__l08.C.tracks['practice:skip'].gateStep.end); await f.evaluate((x) => window.__l08.seek(x), g6);
  await f.evaluate(() => document.querySelector('#ipanel button[data-act="model"]').click()); await sleep(500); s = await st(f);
  ok('S06 practice: model playing before the switch', s.gate === 'branch_playing' && s.playing, s);
  await p.evaluate(() => window.__lesson.show(6)); f = await child(); s = await st(f);
  ok('switch during model playback: S07 opens at its start; no model flag carried over', s.id === 'L08.S07' && s.t === 0 && !s.playing && !s.flags.modelViewed, s);
  await p.evaluate(() => window.__lesson.show(5)); f = await child(); s = await st(f);
  ok('returning to S06 shows its initial state (modelViewed false, no completion, no agreement verified)', s.gate === 'before' && !s.flags.modelViewed && !s.flags.completionAssumed && !s.flags.speakingObserved && !s.flags.groupAgreementVerified && !s.flags.proposalAdopted, s);
  // rapid repeated switching
  for (let k = 0; k < 12; k++) await p.evaluate((k) => window.__lesson.show(k % 7), k);
  f = await child(); s = await st(f); ok('12 rapid switches: exactly one player, the last requested section, no errors', (await p.$$('#host iframe')).length === 1 && s.id === 'L08.S05' && errs.length === 0, { s, errs });
  // explicit Next at a section end (no automatic navigation)
  await p.evaluate(() => { window.__lesson.setMode('watch'); window.__lesson.show(0); }); f = await child(); const d0 = await f.evaluate(() => window.__l08.C.tracks.watch.duration);
  await f.evaluate((d) => { window.__l08.seek(d - 0.5); window.__l08.play(); }, d0); await sleep(1500); s = await st(f);
  const cur1 = await p.evaluate(() => window.__lesson.current); ok('section end: no automatic navigation', cur1 === 0 && !s.playing, { cur1, s });
  await f.evaluate(() => document.querySelector('#ipanel button[data-act="next"]').click()); await sleep(300); f = await child(); s = await st(f);
  ok('explicit Next section action opens S02', (await p.evaluate(() => window.__lesson.current)) === 1 && s.id === 'L08.S02', s);
  ok('no remote requests; no page errors', remote.length === 0 && errs.length === 0, { remote, errs });
  // narrow viewport
  await p.setViewportSize({ width: 390, height: 844 }); await sleep(300);
  const nv = await p.evaluate(() => ({ hscroll: document.documentElement.scrollWidth > innerWidth + 1, small: [...document.querySelectorAll('button')].filter((b) => b.getBoundingClientRect().height < 43.5).length }));
  ok('phone 390x844 (emulated): no horizontal scroll, buttons ≥ 44 px', !nv.hscroll && nv.small === 0, nv);
  fs.mkdirSync(path.join(ROOT, 'qa/lesson'), { recursive: true }); await p.screenshot({ path: path.join(ROOT, 'qa/lesson', NAME + '-phone.png'), fullPage: false });
  await p.setViewportSize({ width: 1440, height: 1000 }); await p.screenshot({ path: path.join(ROOT, 'qa/lesson', NAME + '-desktop.png') });
  await b.close(); R.summary = { checks: R.checks.length, failed: R.failures.length };
  fs.writeFileSync(path.join(ROOT, 'qa/lesson', NAME + '.json'), JSON.stringify(R, null, 1)); console.log(JSON.stringify(R.summary), '\n' + R.failures.join('\n'));
})().catch((e) => { console.error(e); process.exit(2); });
