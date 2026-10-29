/*
 * esssouth beat kit: shared pieces for clock-driven teaching beats (it is used by src/beat-open.js;
 * src/beat-renderer.js, the first beat, predates the kit and keeps its own copies).
 *  - math and DOM helpers
 *  - poser: character keyframes (with prep/settle tweaks) blended over 0.45 s; amplitude mouth
 *  - room: the seated characters in a scaled, clipped panel, plus bubbles and their placement
 *  - captions: the baseline phrase segments
 *  - tokens: one element that changes rect and content across scenes (shared elements)
 *  - anchors: times taken from MEASURED silent runs in the decoded clips, with an explicit
 *    estimated fallback. Each anchor records its source, and the page lists them.
 * Every function is a pure function of t; nothing here schedules timers.
 */
(function (global) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg', W = 1920, H = 1080;
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const easeIO = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const lerp = (a, b, p) => a + (b - a) * p;
  const F = (t, a, d) => (d <= 0 ? (t >= a ? 1 : 0) : easeIO(clamp((t - a) / d)));
  const win = (t, a, b, fi, fo) => Math.min(F(t, a, fi), 1 - F(t, b - fo, fo));
  const el = (tag, cls, p) => { const n = document.createElement(tag); if (cls) n.className = cls; if (p) p.appendChild(n); return n; };
  const sv = (tag, a, p) => { const n = document.createElementNS(NS, tag); for (const k in a) n.setAttribute(k, a[k]); if (p) p.appendChild(n); return n; };
  const rich = (n, s) => { n.textContent = ''; String(s).split(/\[\[(.+?)\]\]/).forEach((x, i) => { if (!x) return; if (i % 2) { const h = el('span', 'hl', n); h.textContent = x; } else n.appendChild(document.createTextNode(x)); }); return n; };
  const op = (n, o) => { o = clamp(o); n.style.opacity = o.toFixed(3); n.style.visibility = o < 0.003 ? 'hidden' : 'visible'; };
  const lr = (a, b, p) => { const o = {}; Object.keys(a).forEach((k) => (o[k] = typeof a[k] === 'number' && typeof b[k] === 'number' ? lerp(a[k], b[k], p) : p < 0.5 ? a[k] : b[k])); return o; };
  const chain = (t, rects) => { // rects: [[t0, dur, rect], ...]; holds the first rect before t0 and blends each step
    let r = rects[0][2]; for (let i = 1; i < rects.length; i++) { const [t0, d, to] = rects[i]; r = lr(r, to, F(t, t0, d)); } return r; };

  // ---- timing: cues placed in order (gapBefore + measured clip + tail) ----
  function placeCues(beat, clip) {
    const cue = {}; let t = 0;
    beat.cues.forEach((c) => {
      const start = t + (c.gapBefore || 0), len = c.kind === 'hold' ? c.duration : clip[c.id];
      const end = start + len + (c.kind === 'line' ? beat.audioTail : 0);
      cue[c.id] = { id: c.id, start, speechEnd: start + len, end, clip: c.kind === 'line' ? len : null, segments: c.segments || [], speakerId: c.speakerId, kind: c.kind };
      t = end;
    });
    return { cue, duration: t };
  }
  // anchors: runs[id] = measured silent runs [[a,b],...] within the clip (seconds from clip start)
  function anchors(runs, cueTimes) {
    const used = [];
    const A = {
      // k-th silent run (0-based) of a clip that contains the expected number of runs near expect
      pause(id, near, fallback, label) {
        const c = cueTimes[id], rs = (runs[id] || []).filter((r) => r[0] > 0.15 && r[1] < c.clip - 0.1);
        let best = null; rs.forEach((r) => { if (!best || Math.abs(r[0] - near) < Math.abs(best[0] - near)) best = r; });
        const ok = best && Math.abs(best[0] - near) < 0.8;
        const v = ok ? { start: c.start + best[0], end: c.start + best[1], source: 'measured' } : { start: c.start + fallback, end: c.start + fallback + 0.15, source: 'estimated' };
        used.push({ label, id, at: +(v.start - c.start).toFixed(2), source: v.source }); return v;
      },
      est(id, sec, label) { const c = cueTimes[id]; used.push({ label, id, at: +sec.toFixed(2), source: 'estimated' }); return c.start + sec; },
      list: used
    };
    return A;
  }

  // ---- poser ----
  function poser(RIG, chars, rmRef) {
    function resolve(spec, c) {
      const [name, look] = spec.split(':'), base = RIG.POSES[name] || RIG.POSES.neutral;
      let dir = 0; if (look && chars[look] && look !== c.id) dir = Math.sign(chars[look].seatX - c.seatX);
      const A = (k) => RIG.ARM[k] || RIG.ARM.rest, mir = (a) => [-a[0], a[1], -a[2], a[3]], nr = dir >= 0;
      return { lean: base.lean, dir, tilt: base.tilt, nod: base.nod, shake: base.shake, brow: base.brow, inner: base.inner, mouth: base.mouth, turn: dir * 0.85,
        gazeY: look === 'down' ? 1 : base.gazeY || 0, armR: nr ? A(base.near) : A(base.far), armL: nr ? mir(A(base.far)) : mir(A(base.near)) };
    }
    const rest = RIG.ARM.rest;
    const tweaks = {
      prep: (p) => Object.assign(p, { lean: p.lean - 1.2, brow: p.brow + 0.3, mouth: Math.min(p.mouth, 0.1) }),
      settle: (p) => Object.assign(p, { lean: p.lean * 0.6, armR: p.armR.map((v, j) => lerp(v, rest[j], 0.6)), armL: p.armL.map((v, j) => lerp(v, j % 2 ? rest[j] : -rest[j], 0.6)) }),
      down: (p) => Object.assign(p, { gazeY: 0.8 })
    };
    let keys = {};
    const NUM = ['lean', 'dir', 'tilt', 'nod', 'shake', 'brow', 'inner', 'mouth', 'turn', 'gazeY'];
    return {
      set(spec) { keys = {}; Object.keys(spec).forEach((id) => (keys[id] = spec[id].slice().sort((a, b) => a[0] - b[0]).map(([t, s, tw]) => ({ t, pose: tw ? tweaks[tw](resolve(s, chars[id])) : resolve(s, chars[id]) })))); },
      at(id, t) {
        const k = keys[id]; let i = 0; while (i + 1 < k.length && k[i + 1].t <= t) i++;
        const rm = rmRef(), cur = k[i], prev = i ? k[i - 1] : k[0], p = rm ? 1 : F(t, cur.t, 0.45), o = {};
        NUM.forEach((n) => (o[n] = lerp(prev.pose[n], cur.pose[n], p)));
        o.armL = cur.pose.armL.map((v, j) => lerp(prev.pose.armL[j], v, p)); o.armR = cur.pose.armR.map((v, j) => lerp(prev.pose.armR[j], v, p));
        o.eyeTurn = lerp(prev.pose.turn, cur.pose.turn, rm ? 1 : F(t, cur.t - 0.12, 0.25));
        const s = t - cur.t; o.nodNow = rm ? 0 : o.nod * clamp(1 - s / 1.6) * Math.sin(s * Math.PI * 2 * 1.4); o.shakeNow = 0;
        return o;
      }
    };
  }
  function mouth(core, env, cueT, t, rm) {
    if (!cueT) return 0; const u = t - cueT.start; if (u < 0 || u > cueT.clip) return 0;
    if (env) { const a = core.envelopeAt(env, u); return a > 0 ? (rm ? 0.35 : 0.1 + 0.8 * a) : 0; }
    return rm ? 0.35 : 0.25 + 0.5 * Math.abs(Math.sin(u * Math.PI * 4.6));
  }

  // ---- room ----
  function room(stage, RIG, characters, tf) {
    const box = el('div', 'room', stage);
    const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H }, box);
    sv('rect', { x: 60, y: 150, width: 1800, height: 640, rx: 44, fill: '#ECEFF4' }, s);
    const backs = sv('g', {}, s);
    sv('rect', { x: 0, y: 744, width: W, height: 34, fill: '#D5DBE4' }, s); sv('rect', { x: 0, y: 778, width: W, height: 302, fill: '#E3E7ED' }, s);
    const fronts = sv('g', {}, s);
    characters.forEach((c) => { const tx = sv('text', { x: c.seatX, y: 810, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 650, fill: c.color, 'font-family': 'Inter, Segoe UI, Arial' }, s); tx.textContent = c.name; });
    const rigs = characters.map((c) => RIG.create(c, backs, fronts));
    const ov = el('div', 'room-ov', box);
    const chars = {}; characters.forEach((c) => (chars[c.id] = c));
    const toStage = (x, y) => ({ x: tf.x + x * tf.s, y: tf.y + y * tf.s });
    const R = {
      box, rigs, ov, tf, toStage,
      bubble(speakerId, rows) { const b = el('div', 'bubble', ov), w = el('span', 'who', b); w.textContent = chars[speakerId].name; w.style.color = chars[speakerId].color; const rs = rows.map((r) => rich(el('span', 'row', b), r)); return { b, rs, tail: el('div', 'tail', b), speakerId }; },
      placeBubble(x, warns) {
        const c = chars[x.speakerId]; x.b.style.left = '0px';
        const w = x.b.offsetWidth, h = x.b.offsetHeight, left = clamp(c.seatX - w / 2, 96, W - 96 - w);
        x.b.style.left = left + 'px'; x.b.style.top = (300 - h) + 'px'; x.tail.style.left = clamp(c.seatX - left - 13, 24, w - 48) + 'px';
        // Speech lives above the clipped room art. Flag the actual stage safe area,
        // not the decorative panel's top edge. Keep very long text reviewable.
        if (tf.y + (300 - h) * tf.s < 180) warns.push({ type: 'collision', key: 'bubble ' + x.speakerId, detail: 'speech overlaps the header safe area' });
      },
      rowRect(n) { const b = n.offsetParent; return { x: tf.x + (n.offsetLeft + b.offsetLeft) * tf.s, y: tf.y + (n.offsetTop + b.offsetTop) * tf.s, w: n.offsetWidth * tf.s, h: n.offsetHeight * tf.s }; },
      show(o, dy) { op(box, o); box.style.transform = `translate(${tf.x}px, ${(tf.y + (dy || 0)).toFixed(1)}px) scale(${tf.s})`; s.style.clipPath = `inset(150px 60px ${tf.clipBottom || 220}px 60px round 44px)`; }
    };
    return R;
  }

  // ---- captions (baseline phrase segments) ----
  function captions(stage) {
    const cap = el('div', 'capbar', stage), cw = el('div', 'who', cap), dot = el('i', '', cw), name = el('span', '', cw), text = el('div', 'ctext', cap);
    const names = { coach: ['Coach', '#356CC8'], learner: ['You', '#202632'], noah: ['Noah', '#7A6A9E'], maya: ['Maya', '#B5763F'] };
    let key = null;
    const fit = () => { text.style.fontSize = '42px'; let fs = 42; while (text.scrollHeight > 107 && fs > 32) { fs -= 2; text.style.fontSize = fs + 'px'; } return text.scrollHeight <= 107; };
    return {
      check(cues, warns) { Object.values(cues).forEach((c) => c.segments.forEach((s) => { text.textContent = s.text; if (!fit()) warns.push({ type: 'overflow', key: 'caption ' + c.id }); })); key = null; },
      render(t, cues, show) {
        let cur = null;
        Object.values(cues).forEach((c) => c.segments.forEach((s) => { if (t >= c.start + s.start - 0.1 && t <= c.start + s.end + 0.25) cur = { c, s }; }));
        if (!cur || show === false) { op(cap, 0); return; }
        op(cap, 1); const k = cur.c.id + cur.s.start;
        if (k !== key) { key = k; const nm = names[cur.c.speakerId]; name.textContent = nm[0]; dot.style.background = nm[1]; text.textContent = cur.s.text; fit(); }
      }
    };
  }

  // ---- tokens ----
  function token(layer, cls) {
    const n = el('div', cls ? 'tk ' + cls : 'tk', layer);
    const T = { n, tl: el('div', 'tl', n), tb: el('div', 'tb', n), chip: el('div', 'chip', n) };
    T.place = (r, o) => { n.style.left = r.x.toFixed(1) + 'px'; n.style.top = r.y.toFixed(1) + 'px'; n.style.width = r.w.toFixed(1) + 'px'; n.style.height = r.h.toFixed(1) + 'px'; n.style.transform = r.rot ? `rotate(${r.rot.toFixed(2)}deg)` : ''; op(n, o); };
    // simple centred label, or label + body (card form)
    T.text = (r, body, label, cardP, opts) => {
      opts = opts || {};
      T.tb.textContent = body || ''; T.tb.style.fontSize = r.fs.toFixed(1) + 'px';
      const card = cardP || 0;
      T.tb.style.textAlign = opts.align || (card > 0.5 ? 'left' : 'center'); T.tb.style.whiteSpace = card > 0.5 ? 'normal' : 'nowrap';
      T.tb.style.top = (card > 0.5 ? r.h * (opts.bodyTop || 0.42) : (r.h - r.fs * 1.22) / 2).toFixed(1) + 'px';
      T.tl.textContent = label || ''; T.tl.style.fontSize = Math.min(r.fs * 0.85, 34).toFixed(1) + 'px'; T.tl.style.top = (r.h * 0.12).toFixed(1) + 'px'; op(T.tl, label ? card : 0);
      if (opts.chip) { T.chip.textContent = opts.chip[0]; T.chip.style.background = opts.chip[1]; T.chip.style.right = '18px'; T.chip.style.bottom = '14px'; op(T.chip, card); } else op(T.chip, 0);
    };
    return T;
  }
  function icon(kind, parent, x, y, size, color) {
    const w = sv('svg', { viewBox: '0 0 100 100', width: size, height: size, style: `position:absolute;left:${x}px;top:${y}px;overflow:visible` }, parent);
    const g = sv('g', { fill: 'none', stroke: color, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, w), a = (t, v) => sv(t, v, g);
    if (kind === 'people') { a('circle', { cx: 34, cy: 28, r: 13 }); a('circle', { cx: 70, cy: 34, r: 11 }); a('path', { d: 'M 9 79 C 9 49 59 49 59 79 M 60 56 C 77 48 91 61 91 81' }); }
    else if (kind === 'map') { a('path', { d: 'M 8 24 L 34 12 L 65 25 L 92 12 L 92 78 L 65 91 L 34 78 L 8 91 Z M 34 12 L 34 78 M 65 25 L 65 91' }); a('circle', { cx: 52, cy: 49, r: 7 }); }
    else if (kind === 'clock') { a('circle', { cx: 50, cy: 50, r: 38 }); a('path', { d: 'M 50 25 L 50 50 L 69 63' }); }
    else if (kind === 'budget') { a('rect', { x: 10, y: 23, width: 80, height: 58, rx: 11 }); a('path', { d: 'M 12 36 L 90 36 M 68 51 L 89 51 L 89 68 L 68 68 Z' }); }
    else if (kind === 'speech') { a('path', { d: 'M 13 12 H 87 V 68 H 46 L 23 88 V 68 H 13 Z' }); a('path', { d: 'M 30 31 H 70 M 30 46 H 57' }); }
    else if (kind === 'question') { a('path', { d: 'M 29 31 C 31 6 76 8 77 34 C 77 52 50 50 50 68' }); a('circle', { cx: 50, cy: 85, r: 2, fill: color }); }
    // Section 01 additions (resources and quiz formats)
    else if (kind === 'box') { a('path', { d: 'M 12 32 L 50 14 L 88 32 L 88 72 L 50 90 L 12 72 Z M 12 32 L 50 50 L 88 32 M 50 50 L 50 90 M 31 23 L 69 41' }); }
    else if (kind === 'venue') { a('path', { d: 'M 10 40 L 50 12 L 90 40 M 18 40 L 18 88 L 82 88 L 82 40 M 42 88 L 42 64 L 58 64 L 58 88 M 28 50 L 36 50 M 64 50 L 72 50' }); }
    else if (kind === 'staff') { a('circle', { cx: 50, cy: 24, r: 14 }); a('path', { d: 'M 18 90 C 18 52 82 52 82 90 M 40 56 L 50 72 L 60 56' }); a('rect', { x: 56, y: 70, width: 16, height: 12, rx: 2 }); }
    else if (kind === 'cards') { a('rect', { x: 14, y: 22, width: 52, height: 64, rx: 7 }); a('path', { d: 'M 34 14 L 80 14 Q 86 14 86 20 L 86 72' }); a('path', { d: 'M 26 42 L 54 42 M 26 56 L 48 56' }); }
    // Lesson 02 · Section 05 additions (flat icons for the imagined event; no sound is implied by any of them)
    else if (kind === 'person') { a('circle', { cx: 50, cy: 24, r: 14 }); a('path', { d: 'M 22 90 C 22 54 78 54 78 90' }); }
    else if (kind === 'door') { a('path', { d: 'M 22 92 L 22 10 L 78 10 L 78 92 M 10 92 L 90 92' }); a('circle', { cx: 66, cy: 54, r: 3, fill: color }); }
    else if (kind === 'phone') { a('rect', { x: 28, y: 8, width: 44, height: 84, rx: 9 }); a('path', { d: 'M 44 80 L 56 80' }); a('path', { d: 'M 36 24 H 64 V 42 H 46 L 38 50 V 42 H 36 Z' }); }
    else if (kind === 'soundoff') { a('path', { d: 'M 12 38 H 30 L 52 20 V 80 L 30 62 H 12 Z' }); a('path', { d: 'M 64 36 L 90 64 M 90 36 L 64 64' }); }
    else if (kind === 'prize') { a('circle', { cx: 50, cy: 36, r: 24 }); a('path', { d: 'M 36 56 L 28 90 L 42 82 L 50 94 L 54 60 M 64 56 L 72 90 L 58 82' }); }
    return w;
  }
  function path(svg, d, attrs) { return sv('path', Object.assign({ d, fill: 'none', stroke: '#B9C5D6', 'stroke-width': 4, 'stroke-linecap': 'round', pathLength: 1 }, attrs || {}), svg); }
  function draw(p, prog) { p.setAttribute('stroke-dasharray', `${clamp(prog).toFixed(4)} 2`); op(p, prog > 0.001 ? 1 : 0); }

  global.EsssouthKit = { W, H, clamp, easeIO, lerp, F, win, el, sv, rich, op, lr, chain, placeCues, anchors, poser, mouth, room, captions, token, icon, path, draw };
})(window);
