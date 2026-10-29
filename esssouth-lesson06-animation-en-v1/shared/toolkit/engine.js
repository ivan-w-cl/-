/*
 * Lesson engine (Lesson 02 · Section 05 copy of the Section 06/05/04 engine, itself the accepted Section 03 engine with configurable header chips): deterministic, clock-free rendering of authored "scores".
 *
 *  - A TRACK (watch, practice main) is compiled by l02s05-timeline.js from the content
 *    graph + the timing manifest. A SCORE is the choreography laid onto one track by l02s05-scenes.js.
 *  - A score holds keyframes as PATCHES { field: value } with an authored motion duration, applied in
 *    time order. Motion durations come from one table (MOTION in l02s05-scenes.js); cue lengths only
 *    move WHEN a motion starts (through cue starts and semantic anchors), never how long it takes.
 *  - render(trackKey, t, ctx) is a pure function: any cue or branch state can be reconstructed
 *    directly, without playing earlier frames.
 *  - Text never lives in geometry: every string comes from the label dictionary or a cue, and is
 *    laid out inside a declared slot (content/slots.json). Overflow is reported, never hidden.
 */
(function (global) {
  'use strict';
  const K = global.EsssouthKit, { clamp, F, win, el, sv, op } = K;

  function markup(text, hls) { // wrap the first occurrence of each evidence phrase in [[ ]]
    let s = text; (hls || []).forEach((h) => { const i = s.indexOf(h); if (i >= 0) s = s.slice(0, i) + '[[' + h + ']]' + s.slice(i + h.length); });
    return s;
  }
  const plain = (s) => String(s).replace(/\[\[|\]\]/g, '');
  function rich(n, s) { n.textContent = ''; String(s).split(/\[\[(.+?)\]\]/).forEach((x, i) => { if (!x) return; if (i % 2) { const h = el('span', 'hl', n); h.textContent = x; } else n.appendChild(document.createTextNode(x)); }); }

  function createEngine(stage, cfg) {
    const E = { warnings: [], rm: !!cfg.reducedMotion, slots: cfg.slots, layers: {}, items: {}, tokens: {}, order: [] };
    const SL = (id) => { const s = cfg.slots[id]; if (!s) throw new Error('unknown text slot ' + id); return s; };
    E.label = (id) => { const l = cfg.labels[id]; if (!l) throw new Error('unknown label ' + id); return cfg.transformText ? cfg.transformText(l.text, id) : l.text; };
    E.cueText = (id) => cfg.cueText(id);

    // ---------- text fitting inside a slot ----------
    // Policy (content/slots.json): keep the nominal size; if the text does not fit within maxLines
    // and the slot width, step the size down to minFs; if it still does not fit, mark it and report.
    function fitText(n, slot, key, w, widthOnly) {
      const fs0 = slot.fs, min = slot.minFs || slot.fs, lh = slot.lineHeight || 1.22, lines = slot.maxLines || 1;
      n.style.fontSize = fs0 + 'px'; n.classList.remove('overflow');
      const fits = (fs) => { n.style.fontSize = fs + 'px'; const maxH = Math.ceil(lines * lh * fs) + 2; return n.scrollWidth <= (w || n.clientWidth) + 1 && (widthOnly || n.scrollHeight <= maxH); };
      let fs = fs0; while (!fits(fs) && fs > min) fs = Math.max(min, fs - 1);
      if (!fits(fs)) { n.classList.add('overflow'); E.warnings.push({ type: 'text-overflow', slot: key, text: n.textContent.slice(0, 80), atMinFs: min }); }
      return fs;
    }
    E.fitText = fitText;

    // ---------- header ----------
    const head = el('div', 'layer stagehead', stage); // not 'head': the page header class is hidden in export mode
    const sc = el('div', 'secchip', head); const num = el('span', 'num', sc), st = el('span', 't', sc);
    // header chips: cfg.headerChips label ids; ids in cfg.tokenChips keep their header slot but are drawn by a
    // persistent token (so the chip can leave the header and come back), measured by E.measureHeader()
    const HC = cfg.headerChips || ['chip.task', 'chip.time', 'chip.budget'], TC = cfg.tokenChips || [];
    const tch = el('div', 'tchips', head); const chips = HC.map((id) => { const s = el('span', '', tch); if (TC.includes(id)) s.style.visibility = 'hidden'; return s; });
    function fillHeader() { num.textContent = E.label('section.num'); st.textContent = E.label('section.title'); HC.forEach((id, i) => (chips[i].textContent = E.label(id))); }
    // the section title shares the header row with the chips: it shrinks to its slot minimum before it may touch them,
    // and a remaining collision is reported (never clipped silently). Chips keep their measured positions.
    function fitHeader() {
      const s = cfg.slots['header.section'], gap = 16; let fs = s.fs; st.style.fontSize = fs + 'px';
      const clash = () => sc.offsetLeft + sc.offsetWidth + gap > tch.offsetLeft;
      while (clash() && fs > (s.minFs || s.fs)) { fs -= 1; st.style.fontSize = fs + 'px'; }
      if (clash()) E.warnings.push({ type: 'text-overflow', slot: 'header.section', text: st.textContent.slice(0, 80), atMinFs: s.minFs, detail: 'section title reaches the header chips' });
    }
    E.measureHeader = () => { fillHeader(); const out = {}; HC.forEach((id, i) => { const c = chips[i]; out[id] = { x: tch.offsetLeft + c.offsetLeft, y: tch.offsetTop + c.offsetTop, w: c.offsetWidth, h: c.offsetHeight }; }); return out; };

    // ---------- scene layers + items ----------
    // stacking, back to front: header, scene layers, room, tokens, over-token text, captions, practice UI
    const back = el('div', 'layer stack', stage);
    E.layer = function (id, opts) {
      const d = el('div', 'layer scene ' + ((opts && opts.cls) || ''), opts && opts.over ? E.front : back); d.dataset.layer = id;
      const s = sv('svg', { viewBox: '0 0 1920 1080', width: 1920, height: 1080, style: 'position:absolute;inset:0;overflow:visible' }, d);
      const L = { id, d, s, items: [] }; E.layers[id] = L; E.order.push(L); return L;
    };
    function reg(L, id, node, type) { if (!id) return node; if (E.items[id]) throw new Error('duplicate item ' + id); E.items[id] = { node, type: type || 'fade', L }; L.items.push(id); return node; }
    // text bound to a label + slot (bounds come from the slot registry)
    E.text = function (L, id, labelId, slotId, o) {
      o = o || {}; const slot = SL(slotId), n = el('div', 'lbl2 ' + (o.cls || ''), L.d), b = Object.assign({}, slot.bounds, o.at || {});
      Object.assign(n.style, { left: b.x + 'px', top: b.y + 'px', width: b.w + 'px', textAlign: slot.align || 'left', color: o.color || slot.color || '', fontWeight: o.weight || slot.weight || '', lineHeight: String(slot.lineHeight || 1.22) });
      n.dataset.slot = slotId; n.dataset.label = labelId;
      (E.texts = E.texts || []).push({ n, slot, slotId, labelId, b, marked: o.markup });
      return reg(L, id, n);
    };
    E.box = (L, id, x, y, w, h, cls) => { const n = el('div', 'bx ' + (cls || ''), L.d); Object.assign(n.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); return reg(L, id, n); };
    E.path = (L, id, d, at) => reg(L, id, K.path(L.s, d, at), 'draw');
    E.dashed = (L, id, d, color) => reg(L, id, sv('path', { d, fill: 'none', stroke: color || '#356CC8', 'stroke-width': 4, 'stroke-dasharray': '10 11', 'stroke-linecap': 'round' }, L.s));
    E.arrowHead = (L, id, x, y, dir, color) => { const m = { down: `M ${x - 14} ${y - 18} L ${x} ${y} L ${x + 14} ${y - 18}`, right: `M ${x - 18} ${y - 14} L ${x} ${y} L ${x - 18} ${y + 14}`, up: `M ${x - 14} ${y + 18} L ${x} ${y} L ${x + 14} ${y + 18}`, left: `M ${x + 18} ${y - 14} L ${x} ${y} L ${x + 18} ${y + 14}` }[dir];
      return reg(L, id, sv('path', { d: m, fill: 'none', stroke: color || '#B9C5D6', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, L.s)); };
    E.icon = (L, id, kind, x, y, size, color) => reg(L, id, K.icon(kind, L.d, x, y, size, color));
    E.node = (L, id, n) => { if (!n.parentNode) L.d.appendChild(n); return reg(L, id, n); };

    // ---------- room (characters), with speech above the clipped room art ----------
    E.TF = { s: 0.8, x: 192, y: 150, clipBottom: 180 };
    E.room = K.room(stage, global.EsssouthRig, cfg.characters, E.TF);
    E.bubbles = {};
    E.bubble = (id, speakerId, text, maxW) => { const b = E.room.bubble(speakerId, [text]); if (maxW) b.b.style.maxWidth = maxW + 'px'; E.bubbles[id] = b; return b; };

    // ---------- tokens: persistent objects that move and change meaning ----------
    const tl = el('div', 'layer tokens', stage);
    E.token = function (id, letter) {
      if (E.tokens[id]) throw new Error('duplicate token ' + id);
      const n = el('div', 'tok', tl), b = el('div', 't2', n);
      const T = { id, n, b, lt: el('span', 'lt', b), who: el('span', 'who', b), tx: el('span', 'tx', b), tag: el('div', 'ttag', n), tail: el('div', 'ttail', n), key: null, tagKey: null, spk: null };
      T.lt.textContent = letter || ''; n.dataset.token = id; E.tokens[id] = T; return T;
    };
    E.front = el('div', 'layer stack', stage);
    E.overLayer = (id) => E.layer(id, { cls: 'over', over: true }); // scene text that must sit above tokens
    E.ui = el('div', 'layer ui', stage);
    E.captions = K.captions(stage);

    // ---------- scores ----------
    E.Score = function (name, track, base) {
      const S = { name, track, kf: {}, lay: {}, rev: {}, pose: { maya: [], learner: [], noah: [] }, bubs: {}, base, motions: [] };
      S.set = (id, t, d, patch, why) => { if (!(id in base)) throw new Error('score ' + name + ': unknown object ' + id); (S.kf[id] = S.kf[id] || []).push([t, d, patch]); if (d > 0) S.motions.push({ id, t, d, why: why || '' }); };
      S.all = (ids, t, d, f) => ids.forEach((id, i) => S.set(id, t, d, typeof f === 'function' ? f(id, i) : f));
      S.show = (id, a, b, fi, fo) => { if (!E.layers[id]) throw new Error('unknown layer ' + id); (S.lay[id] = S.lay[id] || []).push([a, b == null ? 1e9 : b, fi == null ? 0.4 : fi, fo == null ? 0.3 : fo]); };
      S.close = (id, t, fo) => { const w = S.lay[id] && S.lay[id][S.lay[id].length - 1]; if (w && w[1] >= 1e8) { w[3] = fo == null ? 0.3 : fo; w[1] = t + w[3]; } };
      S.r = (id, t, d) => { if (!E.items[id]) throw new Error('unknown item ' + id); S.rev[id] = [t, d == null ? 0.45 : d]; };
      S.revAll = (L, t) => E.layers[L].items.forEach((id) => (S.rev[id] = [t == null ? -1e9 : t, 0]));
      S.p = (who, t, spec, tw) => S.pose[who].push([t, spec, tw]);
      S.bub = (id, a, b) => (S.bubs[id] = S.bubs[id] || []).push([a, b]);
      S.final = (id) => stateAt(S, id, 1e12);
      return S;
    };
    function stateAt(S, id, t) {
      const r = Object.assign({}, S.base[id]), k = S.kf[id]; if (!k) return r;
      for (let i = 0; i < k.length; i++) {
        const [t0, d, patch] = k[i]; if (t < t0) break;
        const p = E.rm || d <= 0 ? 1 : F(t, t0, d);
        for (const f in patch) { const v = patch[f]; r[f] = typeof v === 'number' && typeof r[f] === 'number' ? r[f] + (v - r[f]) * p : p >= 0.5 ? v : r[f]; }
      }
      return r;
    }
    E.stateAt = stateAt;
    E.finish = function (S) {
      Object.values(S.kf).forEach((k) => k.sort((x, y) => x[0] - y[0]));
      S.poser = K.poser(global.EsssouthRig, cfg.charMap, () => E.rm);
      const spec = {}; Object.keys(S.pose).forEach((w) => (spec[w] = S.pose[w].length ? S.pose[w] : [[-1e9, 'neutral:front']])); S.poser.set(spec);
    };
    const layerOp = (S, id, t) => { const ws = S.lay[id]; if (!ws) return 0; let o = 0; ws.forEach(([a0, b, fi, fo]) => (o = Math.max(o, win(t, a0, b, fi, fo)))); return o; };
    const revP = (S, id, t) => { const r = S.rev[id]; if (!r) return 0; return E.rm ? (t >= r[0] ? 1 : 0) : F(t, r[0], r[1]); };
    E.layerOp = layerOp; E.revP = revP;

    // ---------- layout (fonts ready): fit static texts and bubbles ----------
    E.layout = function () {
      E.warnings = []; fillHeader(); fitHeader();
      (E.texts || []).forEach((x) => { const s = E.label(x.labelId); if (x.marked) rich(x.n, markup(s, x.marked)); else x.n.textContent = s; x.fs = fitText(x.n, x.slot, x.slotId, x.b.w); });
      Object.entries(E.bubbles).forEach(([id, b]) => { b.b.querySelector('.who'); E.room.placeBubble(b, E.warnings); fitBubble(b, id); });
      return E.warnings;
    };
    function fitBubble(b, id) { const slot = SL('bubble'); const rows = b.rs; rows.forEach((r) => { r.style.fontSize = slot.fs + 'px'; }); if (b.b.offsetHeight > slot.bounds.h) E.warnings.push({ type: 'text-overflow', slot: 'bubble', text: id }); }

    // token text fitting: measured per settled state (text, rect, kind) and cached
    const meas = el('div', 'tok measure', stage), mb = el('div', 't2', meas), mlt = el('span', 'lt', mb), mwho = el('span', 'who', mb), mtx = el('span', 'tx', mb);
    meas.style.visibility = 'hidden'; meas.style.left = '0px'; meas.style.top = '-2000px';
    function tokenFit(s) {
      const slotId = s.slot || 'token.default', slot = SL(slotId), key = [slotId, s.kind, s.text, Math.round(s.w), Math.round(s.h), s.fs, s.lt > 0.5, s.who > 0.5].join('|');
      if (tokenFit.cache[key]) return tokenFit.cache[key];
      meas.style.width = s.w + 'px'; meas.style.height = s.h + 'px'; mb.className = 't2 ' + s.kind + (s.lt > 0.5 ? ' showlt' : '') + (s.who > 0.5 ? ' showwho' : '');
      mtx.textContent = plain(s.text);
      // S05 layout contract: never shrink below the slot's absolute minimum (minPx); a nominal size already below it is reported
      const min = Math.max(1, s.fs * (slot.minScale || 0.8), slot.minPx || 0), lines = slot.maxLines || 1, lh = slot.lineHeight || 1.2;
      const ok = (fs) => { mb.style.fontSize = fs + 'px'; return mb.scrollWidth <= mb.clientWidth + 1 && mb.scrollHeight <= mb.clientHeight + 1 && mtx.offsetHeight <= Math.ceil(lines * lh * fs) + 2; };
      let fs = Math.max(s.fs, slot.minPx || 0); while (!ok(fs) && fs > min) fs = Math.max(min, fs - 0.5);
      const res = { fs, overflow: !ok(fs), belowContract: slot.minPx && s.fs < slot.minPx }; tokenFit.cache[key] = res; return res;
    }
    tokenFit.cache = {};
    // check every settled token state of every score (used by layout validation and the expansion test)
    E.checkTokens = function (scores) {
      const out = [];
      Object.values(scores).forEach((S) => Object.entries(S.kf).forEach(([id, k]) => { if (!E.tokens[id]) return;
        k.forEach(([t0, d]) => { const s = stateAt(S, id, t0 + d + 1e-3); if (s.o < 0.05 || !s.text) return; const f = tokenFit(s); if (f.overflow) out.push({ type: 'text-overflow', slot: s.slot || 'token.default', token: id, score: S.name, t: +t0.toFixed(2), text: plain(s.text).slice(0, 80) }); if (f.belowContract) out.push({ type: 'below-contract-size', slot: s.slot, token: id, score: S.name, nominalPx: s.fs, minPx: SL(s.slot).minPx }); }); }));
      const seen = new Set(); return out.filter((w) => { const k = w.token + '|' + w.text; if (seen.has(k)) return false; seen.add(k); return true; });
    };

    // ---------- render ----------
    E.render = function (S, t, ctx) {
      ctx = ctx || {};
      E.order.forEach((L) => {
        const o = layerOp(S, L.id, t); op(L.d, o); // items update even while hidden: the whole DOM is a function of t
        L.items.forEach((iid) => { const it = E.items[iid], p = revP(S, iid, t);
          if (it.type === 'draw') K.draw(it.node, p);
          else { op(it.node, p); it.node.style.transform = E.rm || p >= 1 ? '' : `translateY(${((1 - p) * 12).toFixed(1)}px)`; } });
      });
      // room
      const rs = stateAt(S, 'room', t); E.TF.s = rs.s; E.TF.x = rs.x; E.TF.y = rs.y; E.room.show(rs.o, 0);
      Object.keys(E.bubbles).forEach((id) => { let o = 0; (S.bubs[id] || []).forEach(([a0, b]) => (o = Math.max(o, win(t, a0, b, 0.25, 0.25)))); const bb = E.bubbles[id].b; op(bb, o); bb.style.transform = o > 0 && o < 1 && !E.rm ? `translateY(${((1 - o) * 10).toFixed(1)}px)` : ''; });
      const mouths = {};
      E.room.rigs.forEach((rg, i) => {
        const w = rg.def.id, p = S.poser.at(w, t);
        const c = S.track.lines.find((x) => x.speakerId === w && t >= x.start && t <= x.speechEnd);
        p.open = c && ctx.playing !== false ? cfg.mouth(c, t) : 0; mouths[w] = p.open;
        p.blink = !E.rm && ((t + i * 1.1) % (3.7 + i * 0.6)) > (3.57 + i * 0.6); rg.update(p);
      });
      E.lastMouth = mouths;
      // tokens
      Object.values(E.tokens).forEach((T) => {
        const s = stateAt(S, T.id, t);
        const f = tokenFit(s);
        T.n.style.left = s.x.toFixed(1) + 'px'; T.n.style.top = s.y.toFixed(1) + 'px'; T.n.style.width = s.w.toFixed(1) + 'px'; T.n.style.height = s.h.toFixed(1) + 'px';
        T.n.style.transform = s.rot ? `rotate(${s.rot.toFixed(2)}deg)` : ''; T.b.style.fontSize = f.fs.toFixed(2) + 'px';
        const cls = 't2 ' + s.kind + (s.act > 0.5 ? ' active' : '') + (s.lt > 0.5 ? ' showlt' : '') + (s.who > 0.5 ? ' showwho' : '') + (f.overflow ? ' overflow' : '');
        if (T.b.className !== cls) T.b.className = cls;
        // a fully hidden token carries no text at all (nothing for assistive technology or text search to find)
        const shown = s.o >= 0.003, k = (shown ? s.text : '') + '|' + (s.hl > 0.5); if (T.key !== k) { T.key = k; if (!shown) T.tx.textContent = ''; else if (s.hl > 0.5) rich(T.tx, s.text); else T.tx.textContent = plain(s.text); }
        if (T.spk !== s.spk) { T.spk = s.spk; const c = cfg.charMap[s.spk]; T.who.textContent = c ? c.name : ''; T.who.style.color = c ? c.color : ''; }
        T.tail.style.display = / bubble/.test(' ' + s.kind) && !/other/.test(s.kind) ? '' : 'none';
        const tg = s.tag && shown ? E.label(s.tag) : ''; if (T.tagKey !== tg) { T.tagKey = tg; T.tag.textContent = tg; T.tag.style.display = tg ? '' : 'none'; }
        op(T.n, s.o);
      });
      E.captions.render(t, S.track.captionCues, ctx.captions !== false && !ctx.hideCaptions);
    };
    return E;
  }
  global.EsssouthStyleEngine = { createEngine, markup, plain };
})(window);
