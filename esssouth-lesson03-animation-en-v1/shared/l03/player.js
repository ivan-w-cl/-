/*
 * esssouth Lesson 03 · section player (silent review). NEW runtime for Lesson 03, built on the accepted engine
 * (shared/toolkit/engine.js) and the approved transport pattern (one wall clock, one requestAnimationFrame loop,
 * stop() as the single cancellation boundary, rates 1 / 1.25 / 1.5 / 2 scaling the whole timeline).
 *
 * Added for Lesson 03 (docs/MODE_CONTRACT_EN.md):
 *  - Watch and Practice. Watch plays the declared path ('watch' route). Practice plays the common route and, at a gate,
 *    WAITS without a timer: awaiting_choice → branch_playing → branch_ready → common continuation (Continue), or Skip.
 *    Try again restores the gate baseline. Play / Space / rate changes / elapsed time never choose.
 *  - Seek: forward across an unvisited gate stops at the gate; before it resets the attempt; inside a branch the scrubber
 *    is branch-local. A mode switch inside a gate or branch resets to that mode's declared entry; outside, the common cue
 *    and offset are kept.
 *  - S06 private rehearsal: model playback sets only modelViewed = true. speakingObserved, completionAssumed and
 *    proposalAdopted stay false. Nothing is stored, recorded or uploaded; no microphone is requested.
 *  - Future audio: shared/l03/audio-hook.js binds clips to the SAME clock if slots carry paths (none in this review).
 * URL: ?mode=practice ?t=<s> ?rm=1 ?nocap=1 ?rate=1.5 ?timing=retime-demo ?text=x1.3|x1.6|long ?debug=slots ?export=1
 *      ?route=<key> (export/QA only: render a Practice route linearly)
 */
(function () {
  'use strict';
  const q = new URLSearchParams(location.search), $ = (id) => document.getElementById(id), D = window.L03_DATA, Rx = window.EsssouthStyleRecipes;
  if (q.get('export') === '1') document.body.classList.add('export');
  if (q.get('debug') === 'slots') document.body.classList.add('debug-slots');
  const characters = Rx.CAST, charMap = {}; characters.forEach((c) => (charMap[c.id] = c));
  const note = (m, err) => { const d = document.createElement('div'); d.textContent = m; if (err) d.className = 'err'; $('notes').appendChild(d); };
  const live = (m) => { $('live').textContent = ''; setTimeout(() => ($('live').textContent = m), 30); };

  // ---- text expansion stress tests (review only) ----
  const TX = q.get('text');
  function expand(s, f) { const ws = String(s).split(' '); let out = String(s), i = 0; while (out.length < s.length * f) out += ' ' + ws[(i++) % ws.length]; return out; }
  function longTok(s) { const ws = String(s).split(' '); if (ws.length < 3) return s + ' Unbreakablelongtokenforlayoutchecking'; ws.splice(Math.floor(ws.length / 2), 0, 'Unbreakablelongtokenforlayoutchecking'); return ws.join(' '); }
  const xf = (s) => (!TX ? s : TX === 'long' ? longTok(s) : /^x[\d.]+$/.test(TX) ? expand(s, parseFloat(TX.slice(1))) : s);

  async function boot() {
    const g = D.graph, L = D.labels.labels, UIS = D.ui.strings;
    const labels = {}; const add = (k, v) => (labels[k] = { text: v });
    Object.entries(L).forEach(([k, v]) => add(k, v)); Object.entries(UIS).forEach(([k, v]) => { if (!labels[k]) add(k, v); });
    Object.entries((D.labelsStaging && D.labelsStaging.labels) || {}).forEach(([k, v]) => { if (labels[k]) throw new Error('staging label collides: ' + k); add(k, v); });
    g.blocks.forEach((b) => add('block.' + b.id, b.title));
    add('section.num', D.num); (D.headerChips || []).forEach((v, i) => add('chip.' + i, v));
    Object.values(g.holds).forEach((h) => add('hold.' + h.id, h.purpose));
    Object.values(g.interactions || {}).forEach((I) => { add('gate.prompt', I.prompt); add('gate.skipNote', I.skipNote); (I.options || []).forEach((o) => add('gate.option.' + o.id, o.label)); });
    const uiText = (k) => (labels[k] ? labels[k].text : k);
    document.title = 'esssouth · L03 · ' + D.num + ' ' + L['section.title'] + ' (silent review)';
    $('h1').textContent = L['lesson.title'] + ' · ' + D.num + ' ' + L['section.title'];
    $('silent').textContent = uiText('ui.silent');
    $('stage').setAttribute('aria-label', 'Lesson 03, Section ' + D.num + ', ' + L['section.title'] + ': animation stage');

    const profile = q.get('timing') === 'retime-demo' ? D.retimeDemo : (window.L03Audio && window.L03Audio.profile(D)) || null;
    const cueText = (id) => xf(g.cues[id].text);
    const C = window.L03Compile.compile({ graph: g, timing: D.timing, anchors: D.anchors, staging: D.staging }, { segments: window.EsssouthStyleEstimate.segments, profile, cueText });
    const E = window.EsssouthStyleEngine.createEngine($('stage'), { slots: Object.assign({}, window.EsssouthStyleSlots, window.L03Slots || {}), labels, characters, charMap, cueText,
      mouth: () => 0, reducedMotion: q.get('rm') === '1', headerChips: (D.headerChips || []).map((v, i) => 'chip.' + i), tokenChips: [], transformText: (s) => xf(s) });
    await (document.fonts && document.fonts.ready);
    E.headerRects = E.measureHeader();
    const scene = window.L03Scenes.setup(E, { D, C, Rx, labels });
    const scores = {};
    Object.entries(C.tracks).forEach(([key, tr]) => { if (Object.values(scores).some((s) => s.track === tr)) { scores[key] = Object.values(scores).find((s) => s.track === tr); return; }
      const S = E.Score(key, tr, scene.DEF); const X = window.L03Kit.helpers(E, S, tr, { D, C, Rx, labels, scene }); scene.lay(S, tr, X); E.finish(S); scores[key] = S; });
    const fit = () => { $('stage').style.transform = document.body.classList.contains('export') ? '' : `scale(${$('viewport').clientWidth / 1920})`; };
    fit(); window.addEventListener('resize', fit);
    E.layout(); E.warnings.push(...E.checkTokens(Object.fromEntries(Object.entries(scores).filter(([k, s], i, a) => a.findIndex((x) => x[1] === s) === i))));
    Object.values(C.tracks).forEach((tr) => E.captions.check(tr.captionCues, E.warnings));

    // ---------------- state ----------------
    const GATE = C.gate, COMMON = C.tracks[GATE ? 'practice:skip' : 'practice:main'];
    const ST = { mode: q.get('mode') === 'practice' ? 'practice' : 'watch', route: null, t: 0, playing: false, rate: 1, gate: 'none', choice: null,
      flags: { responseText: null, modelViewed: false, speakingObserved: false, completionAssumed: false, proposalAdopted: false }, log: [] };
    let raf = null, clk = null;
    const track = () => C.tracks[ST.route], score = () => scores[ST.route];
    const baseRoute = () => (ST.mode === 'watch' ? 'watch' : GATE ? 'practice:skip' : 'practice:main');
    const gEnd = () => (GATE ? COMMON.gateStep.end : Infinity), gStart = () => (GATE ? COMMON.gateStep.start : Infinity);
    const EPS = 0.0005;
    const audio = window.L03Audio ? window.L03Audio.create(D, C) : null;

    function resetGate(why) { ST.gate = GATE && ST.mode === 'practice' ? 'before' : 'none'; ST.choice = null; ST.flags = { responseText: null, modelViewed: false, speakingObserved: false, completionAssumed: false, proposalAdopted: false }; if (why) ST.log.push(why); }
    function setRoute(k) { ST.route = k; }
    // ---------------- clock ----------------
    const now = () => (clk ? clk.from + (performance.now() - clk.w0) / 1000 * ST.rate : ST.t);
    const stop = () => { if (raf != null) cancelAnimationFrame(raf); raf = null; clk = null; if (audio) audio.stop(); }; // the single cancellation boundary
    function limit() { // where the clock must stop on this route in this state
      const tr = track();
      if (ST.mode === 'practice' && GATE) {
        if (ST.gate === 'before' || ST.gate === 'awaiting') return gEnd() - EPS;
        if (ST.gate === 'branch_playing' || ST.gate === 'branch_ready') return tr.readyStep.start;
      }
      return tr.duration;
    }
    function tick() {
      raf = null; const lim = limit(); ST.t = Math.min(lim, now());
      if (ST.t >= lim - 1e-9) { ST.t = lim; ST.playing = false; stop(); arrive(); render(); return; }
      render(); raf = requestAnimationFrame(tick);
    }
    function arrive() { // reached a stopping point
      if (ST.mode === 'practice' && GATE) {
        if (ST.gate === 'before') { ST.gate = 'awaiting'; live(uiText(GATE.kind === 'choice' ? 'ui.awaitChoice' : 'ui.awaitRehearsal')); return; }
        if (ST.gate === 'branch_playing') { ST.gate = 'branch_ready'; if (ST.choice === 'model') ST.flags.modelViewed = true; live(uiText(ST.choice === 'model' ? 'ui.modelReady' : 'ui.branchReady')); return; }
      }
      if (ST.t >= track().duration - 1e-9) live(uiText('ui.end'));
    }
    function play() {
      if (ST.mode === 'practice' && (ST.gate === 'awaiting' || ST.gate === 'branch_ready')) { render(); return; } // play never chooses or continues
      stop(); if (ST.t >= track().duration - 1e-6) { restart(); return; }
      ST.playing = true; clk = { from: ST.t, w0: performance.now() }; if (audio) audio.start(track(), ST.t, ST.rate, limit()); raf = requestAnimationFrame(tick); render();
    }
    function pause() { if (!ST.playing) return; ST.t = Math.min(limit(), now()); ST.playing = false; stop(); render(); }
    function restart() { stop(); ST.playing = false; resetGate('restart'); setRoute(baseRoute()); ST.t = 0; play(); }

    // ---------------- seeking ----------------
    function seekCommon(x) { // practice with a gate: x is a position on the common timeline
      const was = ST.playing; stop(); ST.playing = false;
      if (ST.gate === 'branch_playing' || ST.gate === 'branch_ready') { // branch-local scrubber
        const tr = track(); ST.t = Math.max(tr.branchStart, Math.min(tr.readyStep.start, x)); ST.gate = ST.t >= tr.readyStep.start - 1e-9 ? 'branch_ready' : 'branch_playing';
        if (ST.gate === 'branch_ready' && ST.choice === 'model') ST.flags.modelViewed = true;
        if (was && ST.gate === 'branch_playing') play(); else render(); return;
      }
      if (x < gStart()) { if (ST.gate !== 'before') { resetGate('seek before gate'); live(uiText('ui.backToGate')); } setRoute('practice:skip'); ST.gate = 'before'; ST.t = x; if (was) play(); else render(); return; }
      if (ST.gate === 'resolved') { const s = COMMON.stepAt(x);
        if (s.common) { const tr = track(); ST.t = tr.cue(s.id).start + (x - s.start); if (was) play(); else render(); return; } }
      // crossing (or landing on) an unvisited gate stops there
      resetGate(); setRoute('practice:skip'); ST.gate = 'awaiting'; ST.t = gEnd() - EPS; live(uiText('ui.stoppedAtGate')); render();
    }
    function seek(x) {
      x = Math.max(0, x);
      if (ST.mode === 'practice' && GATE) return seekCommon(x);
      const was = ST.playing; stop(); ST.playing = false; ST.t = Math.min(track().duration, x); if (was && ST.t < track().duration) play(); else render();
    }
    const seekBy = (dx) => seek(scrubValue() + dx);

    // ---------------- interaction actions ----------------
    function choose(k) {
      if (ST.mode !== 'practice' || ST.gate !== 'awaiting') return false; // first valid selection wins
      stop(); ST.choice = k; setRoute('practice:' + k); ST.gate = 'branch_playing'; ST.t = gEnd(); ST.log.push('choose ' + k);
      live(uiText('ui.branchPlaying') + (k === 'model' ? '' : ' ' + k)); play(); return true;
    }
    function cont() {
      if (ST.mode !== 'practice' || ST.gate !== 'branch_ready') return false;
      stop(); ST.gate = 'resolved'; ST.t = track().readyStep.end; ST.log.push('continue'); play(); return true;
    }
    function retry() {
      if (ST.mode !== 'practice' || !['branch_playing', 'branch_ready', 'resolved'].includes(ST.gate)) return false;
      stop(); ST.playing = false; resetGate('retry'); setRoute('practice:skip'); ST.gate = 'awaiting'; ST.t = gEnd() - EPS; live(uiText('ui.backToGate')); render(); return true;
    }
    function skip() {
      if (ST.mode !== 'practice' || !['awaiting', 'branch_playing', 'branch_ready'].includes(ST.gate)) return false;
      stop(); resetGate('skip');
      ST.choice = 'skip'; setRoute('practice:skip'); ST.gate = 'resolved'; ST.t = gEnd(); live(uiText('ui.skipped')); play(); return true;
    }
    function setMode(m) {
      if (m === ST.mode) return; const tr = track(), s = tr.stepAt(ST.t), was = ST.playing; stop(); ST.playing = false;
      const inGate = GATE && !s.common && ['think', 'gate', 'ready', 'skip'].concat([]).includes(s.kind) || (GATE && s.branch) || (ST.mode === 'practice' && ['awaiting', 'branch_playing', 'branch_ready'].includes(ST.gate));
      const off = ST.t - s.start; ST.mode = m; resetGate('mode ' + m);
      if (inGate) { // reset to the new mode's declared entry
        if (m === 'practice') { setRoute('practice:skip'); ST.gate = 'awaiting'; ST.t = gEnd() - EPS; } else { setRoute('watch'); ST.t = C.tracks.watch.gateStep.start; }
        live(uiText('ui.modeReset')); render(); return;
      }
      setRoute(baseRoute()); const nt = track();
      if (m === 'practice' && GATE) { const pre = s.start < (tr.gateStep ? tr.gateStep.start : Infinity); ST.gate = pre ? 'before' : 'resolved'; }
      ST.t = nt.has(s.id) ? nt.cue(s.id).start + off : Math.min(nt.duration, ST.t);
      if (!GATE) live(uiText('ui.modeShared'));
      if (was) play(); else render();
    }
    function setRate(r) { r = [1, 1.25, 1.5, 2].includes(+r) ? +r : 1; if (ST.playing) { ST.t = Math.min(limit(), now()); stop(); ST.rate = r; ST.playing = false; play(); } else { ST.rate = r; render(); } $('rate').value = String(r); }

    // ---------------- view ----------------
    function scrubValue() { if (ST.mode === 'practice' && GATE) { if (ST.gate === 'branch_playing' || ST.gate === 'branch_ready') return ST.t; return window.L03Compile.commonTime(C, track(), ST.t); } return ST.t; }
    function scrubRange() { if (ST.mode === 'practice' && GATE) { if (ST.gate === 'branch_playing' || ST.gate === 'branch_ready') return [track().branchStart, track().readyStep.start]; return [0, COMMON.duration]; } return [0, track().duration]; }
    const lastCap = { k: null };
    function render() {
      const tr = track(), S = score(), waiting = ST.mode === 'practice' && (ST.gate === 'awaiting' || ST.gate === 'branch_ready');
      // while Practice waits, no caption of the next cue may appear (captions lead their segment by 0.1 s)
      E.render(S, ST.t, { captions: $('cap').checked && !waiting, playing: ST.playing });
      const [a, b] = scrubRange(), v = scrubValue(); $('scrub').min = String(a); $('scrub').max = String(b); $('scrub').value = String(v);
      const branch = ST.mode === 'practice' && (ST.gate === 'branch_playing' || ST.gate === 'branch_ready');
      $('time').textContent = branch ? `${ST.choice === 'model' ? uiText('ui.model') : uiText('ui.option') + ' ' + ST.choice} · ${(ST.t - a).toFixed(1)} / ${(b - a).toFixed(1)} s` : `${v.toFixed(1)} / ${b.toFixed(1)} s`;
      const atEnd = ST.t >= tr.duration - 1e-6;
      $('play').textContent = ST.playing ? uiText('ui.pause') : atEnd ? uiText('ui.replay') : uiText('ui.play');
      $('play').disabled = ST.mode === 'practice' && (ST.gate === 'awaiting' || ST.gate === 'branch_ready');
      const s = tr.stepAt(ST.t);
      $('badge').textContent = (ST.mode === 'watch' ? uiText('ui.watch') : uiText('ui.practice')) + (ST.rate !== 1 ? ' · ' + ST.rate + '×' : '') + (s.kind === 'hold' ? ' · ' + s.dur + ' s reflection' + (ST.playing ? '' : ' (paused)') : '') + (s.kind === 'think' ? ' · ' + s.dur + ' s thinking time' : '');
      $('cue').textContent = s.id + (s.branch ? ' · branch ' + s.branch : '');
      document.querySelectorAll('[data-mode]').forEach((n) => n.setAttribute('aria-pressed', String(n.dataset.mode === ST.mode)));
      renderPanel(s, atEnd); renderDomCap(tr, s);
      document.body.dataset.gate = ST.gate; document.body.dataset.route = ST.route;
    }
    function renderDomCap(tr, s) {
      let txt = '', who = '';
      if (ST.mode === 'practice' && (ST.gate === 'awaiting' || ST.gate === 'branch_ready')) { const k = 'wait|' + ST.gate; if (lastCap.k === k) return; lastCap.k = k; $('domcap').textContent = uiText('gate.prompt'); return; }
      Object.values(tr.captionCues).forEach((c) => c.segments.forEach((sg) => { if (ST.t >= c.start + sg.start - 0.1 && ST.t <= c.start + sg.end + 0.25) { txt = sg.text; who = (charMap[c.speakerId] || { name: 'Coach' }).name; } }));
      if (!txt && s.kind === 'hold') { who = ''; txt = labels['hold.' + s.id].text + ' ' + uiText('ui.pauseMore'); }
      if (!txt && (s.kind === 'think' || s.kind === 'gate')) { who = ''; txt = uiText('gate.prompt'); }
      const k = who + '|' + txt; if (lastCap.k === k) return; lastCap.k = k;
      const d = $('domcap'); d.textContent = ''; if (who) { const bb = document.createElement('b'); bb.textContent = who; d.appendChild(bb); } d.appendChild(document.createTextNode(txt));
    }
    // the interaction panel (DOM, outside the scaled stage so it stays readable on phones)
    const P = $('ipanel');
    function btn(label, cls, on, extra) { const b = document.createElement('button'); b.type = 'button'; b.className = cls || ''; b.textContent = label; b.addEventListener('click', on); if (extra) extra(b); return b; }
    let panelKey = null;
    function renderPanel(s, atEnd) {
      const key = [ST.mode, ST.gate, ST.choice, atEnd, s.kind === 'think' ? 'think' : ''].join('|'); if (key === panelKey) return; panelKey = key;
      P.textContent = ''; P.hidden = true;
      const head = (t) => { const h = document.createElement('p'); h.className = 'iprompt'; h.textContent = t; P.appendChild(h); };
      const stat = (t) => { const p = document.createElement('p'); p.className = 'istatus'; p.textContent = t; P.appendChild(p); };
      const row = () => { const r = document.createElement('div'); r.className = 'irow'; P.appendChild(r); return r; };
      if (GATE && ST.mode === 'watch' && s.kind === 'think') { P.hidden = false; head(uiText('gate.prompt')); stat(uiText('ui.watchPath') + ' ' + (GATE.kind === 'choice' ? GATE.watchKey : uiText('ui.model').toLowerCase()) + '.'); return; }
      if (GATE && ST.mode === 'practice' && ST.gate !== 'before' && ST.gate !== 'resolved') {
        P.hidden = false; head(uiText('gate.prompt'));
        if (GATE.kind === 'choice') { const r = row(); r.classList.add('opts');
          GATE.options.forEach((o) => r.appendChild(btn(o.key + '. ' + xf(o.label), 'opt', () => choose(o.key), (b) => { b.dataset.choice = o.key; b.setAttribute('aria-pressed', String(ST.choice === o.key)); b.disabled = ST.gate !== 'awaiting'; }))); }
        const r2 = row();
        if (ST.gate === 'awaiting') { stat(uiText(GATE.kind === 'choice' ? 'ui.awaitChoice' : 'ui.awaitRehearsal'));
          if (GATE.kind !== 'choice') { r2.appendChild(btn(uiText('ui.model'), 'primary', () => choose('model'), (b) => (b.dataset.act = 'model'))); r2.appendChild(btn(uiText('ui.continue'), '', () => skip(), (b) => (b.dataset.act = 'continue'))); }
          r2.appendChild(btn(uiText('ui.skip'), '', () => skip(), (b) => (b.dataset.act = 'skip'))); }
        if (ST.gate === 'branch_playing') { stat(uiText('ui.branchPlaying') + (ST.choice === 'model' ? '' : ' ' + ST.choice) + '.'); r2.appendChild(btn(uiText('ui.retry'), '', () => retry(), (b) => (b.dataset.act = 'retry'))); r2.appendChild(btn(uiText('ui.skip'), '', () => skip(), (b) => (b.dataset.act = 'skip'))); }
        if (ST.gate === 'branch_ready') { stat(uiText(ST.choice === 'model' ? 'ui.modelReady' : 'ui.branchReady')); r2.appendChild(btn(uiText('ui.continue'), 'primary', () => cont(), (b) => (b.dataset.act = 'continue'))); r2.appendChild(btn(uiText('ui.retry'), '', () => retry(), (b) => (b.dataset.act = 'retry'))); }
        return;
      }
      if (atEnd) { P.hidden = false; stat(uiText('ui.end')); const r = row();
        r.appendChild(btn(uiText('ui.replay'), '', () => restart(), (b) => (b.dataset.act = 'replay')));
        if (D.nav && D.nav.prev) r.appendChild(btn(uiText('ui.previous'), '', () => nav(D.nav.prev), (b) => (b.dataset.act = 'prev')));
        if (D.nav && D.nav.next) r.appendChild(btn(uiText('ui.next') + ': ' + D.nav.nextTitle, 'primary', () => nav(D.nav.next), (b) => (b.dataset.act = 'next'))); }
    }
    function nav(target) { pause(); if (window.parent !== window) window.parent.postMessage({ l03: 'nav', section: target.id }, '*'); else location.href = target.href + (ST.mode === 'practice' ? '?mode=practice' : ''); }

    // ---------------- wiring ----------------
    $('play').addEventListener('click', () => (ST.playing ? pause() : play()));
    $('restart').addEventListener('click', restart);
    $('scrub').addEventListener('input', (e) => seek(parseFloat(e.target.value)));
    $('cap').checked = q.get('nocap') !== '1'; $('cap').addEventListener('change', () => { lastCap.k = null; render(); });
    $('rm').checked = E.rm; $('rm').addEventListener('change', (e) => { E.rm = e.target.checked; render(); });
    $('rate').addEventListener('change', (e) => setRate(e.target.value));
    document.querySelectorAll('[data-mode]').forEach((n) => n.addEventListener('click', () => setMode(n.dataset.mode)));
    const onKey = (e) => { if (e.target.closest && e.target.closest('button,input,select,textarea,a')) return;
      if (e.code === 'Space') { e.preventDefault(); ST.playing ? pause() : play(); } else if (e.code === 'ArrowRight') seekBy(5); else if (e.code === 'ArrowLeft') seekBy(-5); };
    document.addEventListener('keydown', onKey);
    const onVis = () => { if (document.hidden && ST.playing) pause(); }; document.addEventListener('visibilitychange', onVis);
    window.addEventListener('message', (e) => { const m = e.data || {}; if (m.l03 === 'pause') pause(); if (m.l03 === 'mode') setMode(m.mode); });
    window.addEventListener('pagehide', () => { stop(); });

    // ---------------- start ----------------
    resetGate(); setRoute(q.get('route') && C.tracks[q.get('route')] ? q.get('route') : baseRoute());
    if (q.get('route')) { ST.gate = 'none'; ST.mode = q.get('route') === 'watch' ? 'watch' : 'practice'; ST.exportRoute = true; }
    if (q.get('rate')) setRate(q.get('rate'));
    const t0 = Math.max(0, parseFloat(q.get('t')) || 0); if (t0) { if (ST.exportRoute) ST.t = Math.min(track().duration, t0); else seek(t0); }
    const dur = C.tracks.watch.duration;
    note(`Silent English review · Watch ${dur.toFixed(3)} s` + (GATE ? ` · Practice common ${COMMON.duration.toFixed(3)} s + branch + unlimited waiting` : ' · Practice uses the same route') +
      ` · ${profile ? 'timing profile: ' + (q.get('timing') || 'audio') : 'estimated reading timing (140 wpm + 0.35 s tail)'} · ${C.anchors.length} anchors.`);
    if (E.warnings.length) note('Layout report: ' + E.warnings.length + ' item(s) · ' + JSON.stringify(E.warnings.slice(0, 12)), true);
    render(); document.body.dataset.ready = '1';
    if (window.parent !== window) window.parent.postMessage({ l03: 'ready', section: D.sectionId }, '*');
    window.__l03 = { E, C, scores, ST, get t() { return ST.t; }, get playing() { return ST.playing; }, play, pause, seek, restart, choose, cont, retry, skip, setMode, setRate,
      scrubValue, scrubRange, warnings: E.warnings, uiText,
      renderAt(x, route) { stop(); ST.playing = false; if (route) { setRoute(route); ST.exportRoute = true; ST.gate = 'none'; } ST.t = x; E.render(score(), x, { captions: $('cap').checked, playing: true }); return x; },
      destroy() { stop(); document.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVis); } };
  }
  boot().catch((e) => { console.error(e); note('Startup failed: ' + e.message, true); document.body.dataset.ready = 'error'; });
})();
