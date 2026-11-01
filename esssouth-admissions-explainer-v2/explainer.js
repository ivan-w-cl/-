/*
 * esssouth admissions explainer: a clock-driven 1920 × 1080 stage in the lesson style.
 * Everything on screen is a pure function of t (render(t)), so the same timeline plays in the page and exports to MP4.
 * Timeline: per chapter, a question at the table (characters.js rig), then the diagram scenes from data.js.
 * Narration lines are split into caption segments of at most ~2 lines; timing ≈ 4.6 characters per second.
 */
(function (global) {
  'use strict';
  const W = 1920, H = 1080, CPS = 4.6;
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const ease = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const lerp = (a, b, p) => a + (b - a) * p;
  const F = (t, a, d) => (d <= 0 ? (t >= a ? 1 : 0) : ease(clamp((t - a) / d)));
  const el = (tag, cls, p, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; if (p) p.appendChild(n); return n; };
  const sv = (tag, a, p) => { const n = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in a) n.setAttribute(k, a[k]); if (p) p.appendChild(n); return n; };
  const op = (n, o) => { o = clamp(o); n.style.opacity = o.toFixed(3); n.style.visibility = o < 0.003 ? 'hidden' : 'visible'; };
  const strip = s => String(s).replace(/<[^>]+>/g, '');
  const len = s => s.replace(/\s/g, '').length;

  /* ---------- timeline ---------- */
  function segments(line) {
    if (len(line) <= 34) return [line];
    const parts = line.match(/[^，。；：？！]+[，。；：？！]?/g) || [line], out = [];
    let cur = '';
    parts.forEach(p => { if (cur && len(cur + p) > 34) { out.push(cur); cur = p; } else cur += p; });
    if (cur) out.push(cur);
    return out;
  }
  function build(schoolId, prov) {
    const S = SCHOOLS[schoolId], scenes = S.scenes(prov), Q = QUESTIONS[schoolId], items = [];
    let t = 0;
    CHAPTERS.forEach(([ch, chName], ci) => {
      const list = scenes.filter(s => s.ch === ch); if (!list.length) return;
      const [who, q] = Q[ch], qd = Math.max(2.6, len(q) / CPS);
      items.push({ kind: 'ask', ch, ci, chName, who, q, start: t, segs: [{ who, text: q, li: 0, start: 0.7, dur: qd }], dur: 0.7 + qd + 0.9 });
      t += items[items.length - 1].dur;
      list.forEach((s, k) => {
        let u = 0.5; const segs = [];
        s.say.forEach((line, li) => segments(line).forEach(text => { const d = Math.max(1.9, len(text) / CPS); segs.push({ who: 'coach', text, li, start: u, dur: d }); u += d + 0.12; }));
        const it = { kind: 'scene', ch, ci, chName, k, s, start: t, segs, dur: u + 0.7 };
        it.lineAt = li => { const sg = segs.find(g => g.li >= li); return sg ? sg.start : 0; };
        items.push(it); t += it.dur;
      });
    });
    return { items, duration: t, S, prov, schoolId };
  }

  /* ---------- characters (lesson rig) ---------- */
  function poseOf(name, look, c) {
    const RIG = global.EsssouthRig, base = RIG.POSES[name] || RIG.POSES.neutral;
    const target = CAST.find(x => x.id === look);
    const dir = target && target.id !== c.id ? Math.sign(target.seatX - c.seatX) : 0;
    const A = k => RIG.ARM[k] || RIG.ARM.rest, mir = a => [-a[0], a[1], -a[2], a[3]], nr = dir >= 0;
    return { lean: base.lean, dir, tilt: base.tilt, nod: base.nod, brow: base.brow, inner: base.inner, mouth: base.mouth, turn: dir * 0.85, gazeY: base.gazeY || 0,
      armR: nr ? A(base.near) : A(base.far), armL: nr ? mir(A(base.far)) : mir(A(base.near)) };
  }
  function blend(a, b, p) {
    const o = {}; ['lean', 'dir', 'tilt', 'nod', 'brow', 'inner', 'mouth', 'turn', 'gazeY'].forEach(k => (o[k] = lerp(a[k], b[k], p)));
    o.armL = a.armL.map((v, j) => lerp(v, b.armL[j], p)); o.armR = a.armR.map((v, j) => lerp(v, b.armR[j], p)); return o;
  }

  /* ---------- engine ---------- */
  function create(stage, opts) {
    opts = opts || {};
    let TL = null, cur = null, built = null, rm = !!opts.reducedMotion, showCaps = opts.captions !== false;
    const root = el('div', 'xs-root', stage);
    const head = el('div', 'secchip', stage), num = el('span', 'num', head), ttl = el('span', 't', head);
    const tags = el('div', 'tchips', stage);
    const cap = el('div', 'capbar', stage), cw = el('div', 'who', cap), dot = el('i', '', cw), cname = el('span', '', cw), ctext = el('div', 'ctext', cap);
    const src = el('div', 'xs-src', stage);
    let capKey = '';

    function load(schoolId, prov) { TL = build(schoolId, prov); cur = null; stage.style.setProperty('--c', SCHOOLS[schoolId].c); return TL; }

    function fitCap() { let fs = 40; ctext.style.fontSize = fs + 'px'; while (ctext.scrollHeight > 104 && fs > 30) { fs -= 2; ctext.style.fontSize = fs + 'px'; } }
    function caption(it, u) {
      const sg = it.segs.find(g => u >= g.start - 0.05 && u < g.start + g.dur + 0.12);
      if (!sg || !showCaps) { op(cap, sg && !showCaps ? 0 : 0); capKey = ''; return; }
      op(cap, 1);
      const key = it.start + ':' + sg.start;
      if (key !== capKey) {
        capKey = key;
        const who = sg.who === 'coach' ? ['讲解', '#356CC8'] : [CAST.find(c => c.id === sg.who).name, CAST.find(c => c.id === sg.who).color];
        cname.textContent = who[0]; dot.style.background = who[1]; ctext.textContent = sg.text; fitCap();
      }
    }

    /* scene builders: return { update(u) } */
    function buildAsk(it) {
      const box = el('div', 'xs-room', root);
      const tf = { s: 0.8, x: 192, y: 150 };
      const svg = sv('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: `position:absolute;left:0;top:0;transform-origin:0 0;transform:translate(${tf.x}px,${tf.y}px) scale(${tf.s});clip-path:inset(150px 60px 220px 60px round 44px)` }, box);
      sv('rect', { x: 60, y: 150, width: 1800, height: 640, rx: 44, fill: '#ECEFF4' }, svg);
      const backs = sv('g', {}, svg);
      sv('rect', { x: 0, y: 744, width: W, height: 34, fill: '#D5DBE4' }, svg); sv('rect', { x: 0, y: 778, width: W, height: 302, fill: '#E3E7ED' }, svg);
      const fronts = sv('g', {}, svg);
      CAST.forEach(c => { const tx = sv('text', { x: c.seatX, y: 812, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 700, fill: c.color, 'font-family': 'Noto Sans SC, sans-serif' }, svg); tx.textContent = c.name; });
      const rigs = CAST.map(c => global.EsssouthRig.create(c, backs, fronts));
      const speaker = CAST.find(c => c.id === it.who);
      const b = el('div', 'bubble', box); el('span', 'who', b, speaker.name).style.color = speaker.color; el('span', 'row', b, it.q); const tail = el('div', 'tail', b);
      const sx = tf.x + speaker.seatX * tf.s;
      return {
        update(u) {
          const sg = it.segs[0], speaking = u >= sg.start && u < sg.start + sg.dur;
          rigs.forEach((r, i) => {
            const c = CAST[i], isS = c.id === it.who;
            const from = poseOf('neutral', null, c), to = isS ? poseOf('ask', null, c) : poseOf('listen', it.who, c);
            const p = blend(from, to, rm ? (u >= 0.25 ? 1 : 0) : F(u, 0.25, 0.45));
            p.eyeTurn = p.turn; p.shakeNow = 0; p.nodNow = 0; p.blink = !rm && ((u + i * 1.3) % 3.7) < 0.12;
            p.open = isS && speaking ? (rm ? 0.35 : 0.25 + 0.5 * Math.abs(Math.sin((u - sg.start) * Math.PI * 4.6))) : 0;
            r.update(p);
          });
          const bo = rm ? (u >= sg.start ? 1 : 0) : F(u, sg.start - 0.15, 0.35);
          op(b, bo);
          const w = b.offsetWidth, h = b.offsetHeight, left = clamp(sx - w / 2, 96, W - 96 - w);
          b.style.left = left + 'px'; b.style.top = (380 - h + (1 - bo) * 14).toFixed(1) + 'px'; tail.style.left = clamp(sx - left - 13, 24, w - 48) + 'px';
          op(box, rm ? 1 : Math.min(F(u, 0, 0.35), 1 - F(u, it.dur - 0.35, 0.35)));
        }
      };
    }

    const appear = (it, at) => it.lineAt(at || 0);
    function rev(n, it, at, extra) { n.dataset.t = appear(it, at); if (extra) n.dataset.x = extra; return n; }

    function buildScene(it) {
      const s = it.s, box = el('div', 'xs-scene', root);
      if (s.type !== 'title' && s.type !== 'cta') { el('div', 'xs-kick', box, s.title); }
      const area = el('div', 'xs-area xs-' + s.type, box);
      const nodes = [];
      const add = (n, at, kind) => { rev(n, it, at); n.dataset.k = kind || 'fade'; nodes.push(n); return n; };
      if (s.type === 'title' || s.type === 'cta') {
        el('div', 'xs-tkicker', area, s.type === 'title' ? s.kicker : '');
        const big = el('div', 'xs-big', area); big.innerHTML = s.big; add(big, 0, 'rise');
        const chips = el('div', 'xs-chips', area); s.chips.forEach((c, i) => add(el('span', '', chips, c), Math.min(i, 1)));
      } else if (s.type === 'cards') {
        s.items.forEach(([t, d, at, tone]) => { const c = add(el('div', 'xs-card ' + (tone || ''), area), at, 'rise'); el('b', '', c, t); if (d) el('span', '', c, d); });
      } else if (s.type === 'gates') {
        s.items.forEach(([t, d, at, tone]) => { const g = add(el('div', 'xs-gate ' + (tone || ''), area), at, 'rise'); const ic = el('span', 'lk', g); ic.innerHTML = tone === 'warn' ? '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>'; const tx = el('span', 'tx', g); el('b', '', tx, t); if (d) el('span', '', tx, d); });
      } else if (s.type === 'steps') {
        const n = s.items.length; area.style.setProperty('--n', n);
        const line = el('div', 'xs-line', area), fill = el('i', '', line); nodes.push(fill); fill.dataset.k = 'line';
        fill.dataset.t = appear(it, s.items[0][3]); fill.dataset.e = appear(it, s.items[n - 1][3]) + 0.6;
        s.items.forEach(([t, d, x, at], i) => { const st = add(el('div', 'xs-step', area), at, 'rise'); el('span', 'cnum', st, String(i + 1)); el('b', '', st, t); if (d) el('span', 'date', st, d); if (x) el('span', 'x', st, x); });
      } else if (s.type === 'checks') {
        s.items.forEach(([t, d, at]) => { const c = add(el('div', 'xs-check', area), at, 'rise'); const bx = el('span', 'bx', c); bx.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>'; const tx = el('span', 'tx', c); el('b', '', tx, t); if (d) el('span', '', tx, d); });
      } else if (s.type === 'qa') {
        s.items.forEach(([q, tag, at]) => { const c = add(el('div', 'xs-q', area), at, 'rise'); el('span', 'tag', c, tag); el('span', 'en', c, q).lang = 'en'; });
        el('div', 'xs-note', area, 'esssouth 原创练习题，不是真题');
      } else if (s.type === 'table') {
        const hd = el('div', 'xs-row xs-head', area); s.head.forEach(h => el('span', '', hd, h));
        s.rows.forEach(r => { const row = add(el('div', 'xs-row', area), r[3], 'rise'); el('b', '', row, r[0]); el('span', 'mid', row, r[1]); el('span', '', row, r[2]); });
      } else if (s.type === 'formula') {
        const bar = el('div', 'xs-fbar', area);
        s.parts.forEach(([n, pct, d, col, at]) => { const seg = el('div', 'seg', bar, pct + '%'); seg.style.background = col; seg.dataset.pct = pct; add(seg, at, 'grow'); });
        const leg = el('div', 'xs-fleg', area);
        s.parts.forEach(([n, pct, d, col, at]) => { const L = add(el('div', '', leg), at, 'rise'); const b = el('b', '', L); const sw = el('i', '', b); sw.style.background = col; b.appendChild(document.createTextNode(`${n} · ${pct}%`)); el('span', '', L, d); });
      }
      return {
        update(u) {
          op(box, rm ? 1 : Math.min(F(u, 0, 0.3), 1 - F(u, it.dur - 0.3, 0.3)));
          nodes.forEach(n => {
            const t0 = +n.dataset.t, k = n.dataset.k, p = rm ? (u >= t0 ? 1 : 0) : F(u, t0 - 0.1, 0.5);
            if (k === 'line') { const e = +n.dataset.e; n.style.width = (rm ? (u >= t0 ? 100 : 0) : F(u, t0, Math.max(0.6, e - t0)) * 100).toFixed(2) + '%'; return; }
            if (k === 'grow') { n.style.flexBasis = (p * +n.dataset.pct).toFixed(2) + '%'; op(n, p > 0.02 ? 1 : 0); return; }
            op(n, p); n.style.transform = k === 'rise' ? `translateY(${((1 - p) * 18).toFixed(1)}px)` : '';
            n.classList.toggle('on', u >= t0 + 0.35 || (rm && u >= t0));
          });
        }
      };
    }

    function render(t) {
      if (!TL) return;
      t = clamp(t, 0, TL.duration - 0.001);
      const it = TL.items.find(x => t >= x.start && t < x.start + x.dur) || TL.items[TL.items.length - 1];
      if (it !== cur) {
        cur = it; root.textContent = ''; capKey = '';
        built = it.kind === 'ask' ? buildAsk(it) : buildScene(it);
        const S = TL.S;
        num.textContent = `${S.short} ${it.ci + 1}`; ttl.textContent = it.chName;
        tags.textContent = ''; if (S.provinces) el('span', '', tags, S.provinces[TL.prov] + '考生'); el('span', '', tags, '2026 年简章');
        const sd = SOURCES[TL.schoolId]; src.textContent = '依据：' + (sd.all || sd[TL.prov])[0] + ' · esssouth 整理，与学校无官方合作关系';
      }
      const u = t - it.start;
      built.update(u); caption(it, u);
    }
    return {
      load, render,
      get timeline() { return TL; },
      setReduced(v) { rm = !!v; cur = null; },
      setCaptions(v) { showCaps = !!v; capKey = ''; },
      chapterStarts() { const o = []; TL.items.forEach(x => { if (x.kind === 'ask') o.push([x.ch, x.chName, x.start]); }); return o; },
      lineAt(t) { const it = TL.items.find(x => t >= x.start && t < x.start + x.dur); if (!it) return ''; const u = t - it.start, sg = it.segs.find(g => u >= g.start && u < g.start + g.dur + 0.12); return sg ? sg.text : ''; },
    };
  }
  global.EsssouthExplainer = { create, build, segments, W, H };
})(window);
