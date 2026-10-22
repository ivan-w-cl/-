/* 手绘地图渲染器：把网页版导出的场景（data/scene.js）画到 Canvas 2D 上。
   不依赖 DOM，小程序（canvas type="2d"）和浏览器（预览、对比测试）共用同一份代码。
   视图 view = { tx, ty, k, w, h }：屏幕像素 = 地图坐标 * k + (tx, ty)。
   规则照搬网页版 map-readability.js：图标放大到一定程度就不再变大，文字有上限，重叠的标签隐藏。 */
'use strict';

const capScale = (k, cap) => Math.min(1, cap / Math.max(0.001, k));
const ORDER = { home: 3, uni: 2, rail: 2, bus: 2, food: 2, sight: 2, bldg: 1 };

function createRenderer(scene, env) {
  const S = scene.styles, patterns = {}, R = 4;   // 花纹按 4 倍分辨率画，放大也清楚
  let lang = 'zh', layout = null;
  const dprOf = () => (env && env.dpr) || 1;

  /* ---------- 画一条路径 ---------- */
  function trace(ctx, a) {
    ctx.beginPath();
    for (let i = 0; i < a.length;) {
      const c = a[i++];
      if (c === 0) ctx.moveTo(a[i++], a[i++]);
      else if (c === 1) ctx.lineTo(a[i++], a[i++]);
      else if (c === 2) { ctx.quadraticCurveTo(a[i], a[i + 1], a[i + 2], a[i + 3]); i += 4; }
      else if (c === 3) { ctx.bezierCurveTo(a[i], a[i + 1], a[i + 2], a[i + 3], a[i + 4], a[i + 5]); i += 6; }
      else ctx.closePath();
    }
  }
  function pattern(ctx, name) {
    if (patterns[name] !== undefined) return patterns[name];
    const p = scene.patterns[name]; if (!p || !env || !env.makeCanvas) return (patterns[name] = null);
    try {
      const cv = env.makeCanvas(Math.round(p.w * R), Math.round(p.h * R)), c = cv.getContext('2d');
      c.scale(R, R); runOps(c, p.ops, null, 1);
      return (patterns[name] = ctx.createPattern(cv, 'repeat'));
    } catch (e) { return (patterns[name] = null); }   // 不支持用画布做花纹的环境：退回纯色
  }
  function paint(ctx, st, inherit, alpha, build) {
    const o = (st.o == null ? 1 : st.o) * alpha;
    let fill = st.f === 'inherit' ? inherit : st.f, stroke = st.s === 'inherit' ? inherit : st.s;
    if (!fill && !(stroke && st.w)) return;
    build();
    if (fill) {
      ctx.globalAlpha = o * (st.fo == null ? 1 : st.fo);
      if (fill.indexOf('pattern:') === 0) {
        const pt = pattern(ctx, fill.slice(8));
        if (pt) { ctx.save(); ctx.fillStyle = pt; ctx.scale(1 / R, 1 / R); ctx.fill(); ctx.restore(); }
        else { const p0 = scene.patterns[fill.slice(8)], bg = p0 && p0.ops[0] && S[p0.ops[0][1]].f; ctx.fillStyle = bg || '#cccccc'; ctx.fill(); }
      } else { ctx.fillStyle = fill; ctx.fill(); }
    }
    if (stroke && st.w) {
      ctx.globalAlpha = o * (st.so == null ? 1 : st.so);
      ctx.strokeStyle = stroke; ctx.lineWidth = st.w; ctx.lineCap = st.c || 'butt'; ctx.lineJoin = st.j || 'miter';
      if (ctx.setLineDash) ctx.setLineDash(st.d || []);
      ctx.stroke();
      if (st.d && ctx.setLineDash) ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
  }
  /* 小程序 canvas 不一定认得字体列表，env.font 可以按文字（中文 / 英文）挑一个字体 */
  function font(st, scale, str) { return `${st.fw || 400} ${(st.fs * (scale || 1)).toFixed(2)}px ${env && env.font ? env.font(st.ff, str) : st.ff}`; }
  /* 字距：小程序 canvas 没有 letterSpacing，逐字画 */
  function textRun(ctx, str, x, y, st, mode) {
    const ls = st.ls || 0, anchor = st.a === 'middle' ? 'center' : st.a === 'end' ? 'right' : 'left';
    if (!ls) { ctx.textAlign = anchor; mode === 's' ? ctx.strokeText(str, x, y) : ctx.fillText(str, x, y); return; }
    const chars = Array.from(str), widths = chars.map(ch => ctx.measureText(ch).width);
    const total = widths.reduce((s, w) => s + w, 0) + ls * chars.length;
    let cx = anchor === 'center' ? x - total / 2 + ls / 2 : anchor === 'right' ? x - total : x;
    ctx.textAlign = 'left';
    chars.forEach((ch, i) => { mode === 's' ? ctx.strokeText(ch, cx, y) : ctx.fillText(ch, cx, y); cx += widths[i] + ls; });
  }
  function drawText(ctx, op, st, alpha, scale) {
    const [, , x, y, str, sx, rot] = op;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); if (scale && scale !== 1) ctx.scale(scale, scale); if (sx && sx !== 1) ctx.scale(sx, sx);
    ctx.font = font(st, 1, str); ctx.textBaseline = 'alphabetic';
    const o = (st.o == null ? 1 : st.o) * alpha;
    if (st.po && st.s && st.w) { ctx.globalAlpha = o; ctx.strokeStyle = st.s; ctx.lineWidth = st.w; ctx.lineJoin = st.j || 'round'; textRun(ctx, str, 0, 0, st, 's'); }
    if (st.f) { ctx.globalAlpha = o * (st.fo == null ? 1 : st.fo); ctx.fillStyle = st.f; textRun(ctx, str, 0, 0, st, 'f'); }
    if (!st.po && st.s && st.w) { ctx.globalAlpha = o; ctx.strokeStyle = st.s; ctx.lineWidth = st.w; textRun(ctx, str, 0, 0, st, 's'); }
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function runOps(ctx, list, inherit, alpha) {
    for (const op of list) {
      const st = S[op[1]];
      switch (op[0]) {
        case 'p': paint(ctx, st, inherit, alpha, () => trace(ctx, op[2])); break;
        case 'c': paint(ctx, st, inherit, alpha, () => { ctx.beginPath(); ctx.arc(op[2], op[3], op[4], 0, Math.PI * 2); }); break;
        case 'e': paint(ctx, st, inherit, alpha, () => { ctx.beginPath(); ctx.ellipse(op[2], op[3], op[4], op[5], 0, 0, Math.PI * 2); }); break;
        case 'r': paint(ctx, st, inherit, alpha, () => {
          const [, , x, y, w, h, rx] = op; ctx.beginPath();
          if (!rx) ctx.rect(x, y, w, h);
          else { const r = Math.min(rx, w / 2, h / 2); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
        }); break;
        case 't': drawText(ctx, op, st, alpha); break;
        case 'u': {
          const sym = scene.symbols[op[4]]; if (!sym) break;
          ctx.save(); ctx.translate(op[2], op[3]); if (op[5] !== 1) ctx.scale(op[5], op[5]);
          runOps(ctx, sym, st.f || inherit, alpha); ctx.restore(); break;
        }
      }
    }
  }

  /* ---------- 标签布局（照搬网页版：按优先级放，避开图标和已放的标签，四个候选位置） ---------- */
  function measure(ctx, str, st, scale) { ctx.save(); ctx.font = font(st, scale, str); const w = ctx.measureText(str).width + (st.ls || 0) * Array.from(str).length * scale; ctx.restore(); return w; }
  const inter = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
  const pad = (r, p) => ({ l: r.l - p, t: r.t - p, r: r.r + p, b: r.b + p });

  function computeLayout(ctx, view, state) {
    const k = view.k, scr = (x, y) => [x * k + view.tx, y * k + view.ty];
    const vp = { l: 0, t: 0, r: view.w, b: view.h };
    const visible = m => (!state.hidden || !state.hidden[layerOf(m)]) && !(state.only && m.t === 'home' && !state.only[m.id]);
    const obstacles = [], placed = {}, accepted = [], items = [];
    scene.markers.forEach(m => {
      if (!visible(m)) return;
      const s = capScale(k, m.t === 'bldg' ? 1.5 : 1.1), [x, y] = scr(m.x, m.y), r = (m.t === 'bldg' ? 7 : m.t === 'home' ? 17 : 20) * s * k;
      const box = { l: x - r, t: y - r, r: x + r, b: y + r };
      if (inter(box, vp)) obstacles.push({ id: m.id, box: pad(box, 3) });
      const L = scene.markerLabels[lang][m.id];
      if (!L) return;
      if (m.t === 'bldg' && !(k >= 1.8 || state.selected === m.id)) return;
      items.push({ m, L, s, x, y, pri: state.selected === m.id ? 100 : m.t === 'bldg' ? 40 : 60 });
    });
    const labels = [];
    scene.labels[lang].forEach((op, i) => {
      const st = S[op[1]], cls = op[7] || '';
      if (/zlbl/.test(cls) && k < 0.75) return;
      const cap = /waterl/.test(cls) ? 32 : /area/.test(cls) ? 24 : 16;
      labels.push({ op, i, st, scale: capScale(k, cap / st.fs), pri: /zlbl/.test(cls) ? 30 : 10 });
    });
    const all = items.concat(labels).sort((a, b) => b.pri - a.pri);
    for (const it of all) {
      const others = (id) => obstacles.filter(o => o.id !== id).map(o => o.box).concat(accepted);
      if (it.m) {
        const st = S[it.L[1]], sc = it.s * k, w = measure(ctx, it.L[0], st, sc), h = st.fs * sc;
        const off = it.m.t === 'bldg' ? 14 : 34, side = (w / 2 + (it.m.t === 'bldg' ? 15 : 35));
        const cands = [[0, off * sc], [0, (it.m.t === 'bldg' ? -12 : -38) * sc], [side, 4 * sc], [-side, 4 * sc]];
        let best = null; const oth = others(it.m.id);
        for (const [dx, dy] of cands) {
          const cx = it.x + dx, by = it.y + dy, box = pad({ l: cx - w / 2, t: by - h * 0.8, r: cx + w / 2, b: by + h * 0.25 }, 4);
          const score = oth.reduce((s, o) => s + inter(box, o), 0) + Math.max(0, (box.r - box.l) * (box.b - box.t) - inter(box, vp)) * 3;
          if (!best || score < best.score) best = { dx: dx / k, dy: dy / k, box, score };
          if (score < 0.5) break;
        }
        if (best && (best.score < 0.5 || it.pri === 100)) { placed[it.m.id] = best; accepted.push(best.box); }
      } else {
        const op = it.op, st = it.st, sc = it.scale * (op[5] || 1) * k, [x, y] = scr(op[2], op[3]), w = measure(ctx, op[4], st, sc), h = st.fs * sc;
        const ax = st.a === 'middle' ? x - w / 2 : st.a === 'end' ? x - w : x;
        let box = pad({ l: ax, t: y - h * 0.8, r: ax + w, b: y + h * 0.25 }, 4);
        if (op[6]) { const c = Math.abs(Math.cos(op[6])), s2 = Math.abs(Math.sin(op[6])), bw = w * c + h * s2, bh = w * s2 + h * c; box = pad({ l: x - bw / 2, t: y - bh / 2, r: x + bw / 2, b: y + bh / 2 }, 4); }
        if (!inter(box, vp)) continue;
        const score = others(null).reduce((s, o) => s + inter(box, o), 0);
        if (score < 0.5) { placed['label:' + it.i] = { scale: it.scale }; accepted.push(box); }
      }
    }
    return { k, placed };
  }
  const layerOf = m => (m.t === 'bldg' ? 'uni' : m.t);

  /* ---------- 画整张图 ---------- */
  function draw(ctx, view, state) {
    state = state || {};
    const k = view.k, dpr = dprOf();
    // 手指还在屏幕上时不重新排标签（网页版也是松手后才排）
    const stale = !layout || state.relayout || layout.lang !== lang || Math.abs(layout.k - k) > 1e-6 || layout.tx !== view.tx || layout.ty !== view.ty;
    if (stale && !(state.gesture && layout && layout.lang === lang)) { layout = computeLayout(ctx, view, state); layout.lang = lang; layout.tx = view.tx; layout.ty = view.ty; }
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // 桌面：网页版 .app 的底色和左上角的一点高光
    ctx.fillStyle = state.desk || '#d9c9a3'; ctx.fillRect(0, 0, view.w, view.h);
    const glow = ctx.createRadialGradient(view.w * 0.3, view.h * 0.2, 0, view.w * 0.3, view.h * 0.2, Math.hypot(view.w, view.h) * 0.6);
    glow.addColorStop(0, 'rgba(255,255,255,0.18)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, view.w, view.h);
    // 纸张：圆角 14px，地图只画在纸上（网页版 .stage 的 overflow:hidden）
    const pw = scene.W * k, ph = scene.H * k, rr = 14;
    ctx.beginPath(); ctx.moveTo(view.tx + rr, view.ty); ctx.arcTo(view.tx + pw, view.ty, view.tx + pw, view.ty + ph, rr); ctx.arcTo(view.tx + pw, view.ty + ph, view.tx, view.ty + ph, rr);
    ctx.arcTo(view.tx, view.ty + ph, view.tx, view.ty, rr); ctx.arcTo(view.tx, view.ty, view.tx + pw, view.ty, rr); ctx.closePath();
    ctx.fillStyle = '#f1e4c3'; ctx.fill(); ctx.clip();
    ctx.translate(view.tx, view.ty); ctx.scale(k, k);
    runOps(ctx, scene.base, null, 1);
    const hid = state.hidden || {};
    // 底图文字
    scene.labels[lang].forEach((op, i) => { const pl = layout.placed['label:' + i]; if (pl) drawText(ctx, op, S[op[1]], 1, pl.scale); });
    if (!hid.uni) runOps(ctx, scene.campus, null, 1);
    if (!hid.home) runOps(ctx, scene.leaders, null, 1);
    runOps(ctx, scene.frame, null, 1);
    // 标记：校区楼 → 地点 → 公寓（公寓按从上到下，和网页一样后画的在上面）
    const dim = state.dim, list = scene.markers.filter(m => !hid[layerOf(m)] && !(state.only && m.t === 'home' && !state.only[m.id])).sort((a, b) => (ORDER[a.t] - ORDER[b.t]) || (a.t === 'home' && b.t === 'home' ? a.y - b.y : 0));
    for (const m of list) {
      const s = capScale(k, m.t === 'bldg' ? 1.5 : 1.1), on = state.selected === m.id, faded = dim && !dim[m.id] && !on;
      const alpha = faded ? 0.28 : 1;
      ctx.save(); ctx.translate(m.x, m.y); ctx.scale(s, s);
      if (on) { ctx.translate(0, -5); ctx.scale(1.25, 1.25); }
      if (state.ring && state.ring[m.id]) { ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 4; ctx.globalAlpha = alpha; ctx.stroke(); ctx.globalAlpha = 1; }
      runOps(ctx, m.ops, null, alpha);
      ctx.restore();
    }
    // 标记文字
    for (const m of list) {
      const pl = layout.placed[m.id], L = scene.markerLabels[lang][m.id]; if (!pl || !L) continue;
      const s = capScale(k, m.t === 'bldg' ? 1.5 : 1.1), faded = dim && !dim[m.id] && state.selected !== m.id;
      drawText(ctx, ['t', L[1], m.x + pl.dx, m.y + pl.dy, L[0], 1, 0], S[L[1]], faded ? 0.28 : 1, s);
    }
    // 排序后前 3 名的金色标签
    if (state.tags) state.tags.forEach((tag, i) => {
      const m = scene.markers.find(x => x.id === tag.id); if (!m) return;
      const s = capScale(k, 1.1); ctx.save(); ctx.translate(m.x, m.y); ctx.scale(s, s);
      ctx.font = `800 14.5px ${state.bodyFont || 'sans-serif'}`; const w = ctx.measureText(tag.text).width + 16;
      ctx.beginPath(); const x = -w / 2 - 4, y = -58, h = 24, r = 12;
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
      ctx.fillStyle = '#f2c14e'; ctx.fill(); ctx.strokeStyle = '#3b2a1a'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#3b2a1a'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(tag.text, -4, -40.5); ctx.restore();
    });
    ctx.restore();
  }

  /* 点到了哪个标记（屏幕坐标，逻辑像素） */
  function hit(view, px, py, state) {
    const k = view.k, hid = (state && state.hidden) || {};
    let best = null;
    for (const m of scene.markers) {
      if (hid[layerOf(m)] || (state && state.only && m.t === 'home' && !state.only[m.id])) continue;
      const s = capScale(k, m.t === 'bldg' ? 1.5 : 1.1), x = m.x * k + view.tx, y = m.y * k + view.ty;
      const r = Math.max(16, (m.t === 'bldg' ? 12 : 22) * s * k), d = Math.hypot(px - x, py - y);
      if (d <= r && (!best || ORDER[m.t] > ORDER[best.m.t] || (ORDER[m.t] === ORDER[best.m.t] && d < best.d))) best = { m, d };
    }
    return best ? best.m : null;
  }

  return {
    draw, hit,
    setLang(l) { lang = scene.labels[l] ? l : 'zh'; layout = null; },
    relayout() { layout = null; },
    get size() { return { W: scene.W, H: scene.H }; }
  };
}
module.exports = { createRenderer, capScale };
