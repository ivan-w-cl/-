/* 从网页版（web-live）导出小程序地图要画的全部内容，保证和网页一模一样：
   底图（海岸、维勒尔、公园、河、铁路、道路）、校区色块和楼、引线、指北针、地名，
   以及每个可点的标记（公寓、大学、车站、美食街、地标、教学楼）和它们的图标、两种填充花纹。
   用法：先在 web-live 目录起一个静态服务器（python3 -m http.server 8769），再
     NODE_PATH=$(npm root -g) node scripts/export-scene.cjs
   生成 data/scene.js。需要 Playwright（Chromium）。 */
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { normalize, encode } = require('./pathnorm.cjs');
const BASE = process.env.WEB_URL || 'http://localhost:8769';
const OUT = path.join(__dirname, '..', 'data', 'scene.js');
const LANGS = ['zh', 'en'];

/* ---------- 在浏览器里运行：收集元素、样式、坐标变换 ---------- */
function collect() {
  const INH = 'rgb(1, 2, 3)';
  const mat = m => [m.a, m.b, m.c, m.d, m.e, m.f].map(v => Math.round(v * 1e4) / 1e4);
  const rel = (el, root) => mat(root.getScreenCTM().inverse().multiply(el.getScreenCTM()));
  const num = (el, k) => { const v = el.getAttribute(k); return v == null ? null : parseFloat(v); };
  function style(el, opacity) {
    const s = getComputedStyle(el);
    return { fill: s.fill, fo: +s.fillOpacity, stroke: s.stroke, so: +s.strokeOpacity, sw: parseFloat(s.strokeWidth) || 0,
      dash: s.strokeDasharray === 'none' ? null : s.strokeDasharray, cap: s.strokeLinecap, join: s.strokeLinejoin, op: opacity,
      ff: s.fontFamily, fs: parseFloat(s.fontSize), fw: s.fontWeight, ls: parseFloat(s.letterSpacing) || 0, anchor: s.textAnchor, po: s.paintOrder,
      disp: s.display, vis: s.visibility };
  }
  function walk(el, root, out, opacity, skip) {
    if (skip && skip(el)) return;
    const s = getComputedStyle(el), op = opacity * (+s.opacity);
    const tag = el.tagName.toLowerCase();
    const rec = (extra) => out.push(Object.assign({ tag, m: rel(el, root), st: style(el, op), cls: el.getAttribute('class') || '', data: { ...el.dataset } }, extra));
    if (tag === 'g' || tag === 'svg') { for (const c of el.children) walk(c, root, out, op, skip); return; }
    if (tag === 'path') return rec({ d: el.getAttribute('d') });
    if (tag === 'rect') return rec({ x: num(el, 'x') || 0, y: num(el, 'y') || 0, w: num(el, 'width'), h: num(el, 'height'), rx: num(el, 'rx') || 0 });
    if (tag === 'circle') return rec({ cx: num(el, 'cx') || 0, cy: num(el, 'cy') || 0, r: num(el, 'r') });
    if (tag === 'ellipse') return rec({ cx: num(el, 'cx') || 0, cy: num(el, 'cy') || 0, rx: num(el, 'rx'), ry: num(el, 'ry') });
    if (tag === 'text') return rec({ x: num(el, 'x') || 0, y: num(el, 'y') || 0, text: el.textContent });
    if (tag === 'use') return rec({ href: (el.getAttribute('href') || el.getAttribute('xlink:href') || '').slice(1) });
  }
  const base = document.getElementById('base'), over = document.getElementById('over');
  const res = { W: OUTW, H: OUTH, lang: LANG };
  res.base = []; walk(document.getElementById('baseG'), base, res.base, 1);
  res.baseLabels = []; walk(document.getElementById('baseLabels'), base, res.baseLabels, 1);
  res.frame = []; walk(document.getElementById('frame'), over, res.frame, 1);
  res.leaders = []; walk(document.getElementById('leaders'), over, res.leaders, 1);
  const campus = document.getElementById('campus');
  res.campus = []; walk(campus, over, res.campus, 1, el => el.classList && el.classList.contains('bld'));
  /* 可点的标记：每个标记自己的坐标系（以标记位置为原点） */
  res.markers = [];
  [...HOMES, ...PLACES, ...BUILDINGS].forEach(d => {
    const g = d.visualEl && d.visualEl.parentNode; if (!g) return;
    const ops = []; walk(d.visualEl, g, ops, 1, el => el === d.lblEl);
    const tr = (g.getAttribute('transform') || '').match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
    const lbl = d.lblEl ? { text: d.lblEl.textContent, st: style(d.lblEl, 1), cls: d.lblEl.getAttribute('class') || '' } : null;
    res.markers.push({ id: d.id, t: d.t, n: d.n || null, name: d.name, x: +tr[1], y: +tr[2], a: d.a ? [d.a[0], d.a[1]] : null, zone: d.zone || null, ops, lbl });
  });
  /* 图标（defs 里的 g）和花纹：复制到一个临时 svg 里，才能取到样式和坐标 */
  const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  tmp.setAttribute('style', 'position:fixed;left:0;top:0;width:200px;height:200px;overflow:visible;fill:' + INH);
  tmp.setAttribute('viewBox', '0 0 200 200'); document.body.appendChild(tmp);
  const defs = base.querySelector('defs').innerHTML + over.querySelector('defs').innerHTML;
  const holder = document.createElement('div'); holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + defs + '</svg>';
  res.symbols = {}; res.patterns = {};
  holder.querySelectorAll('svg > g[id], svg > pattern[id]').forEach(src => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = src.innerHTML; tmp.appendChild(g);
    const ops = []; walk(g, g, ops, 1);
    if (src.tagName.toLowerCase() === 'pattern') res.patterns[src.id] = { w: +src.getAttribute('width'), h: +src.getAttribute('height'), ops };
    else res.symbols[src.id] = ops;
    g.remove();
  });
  tmp.remove();
  res.INH = INH;
  return res;
}

/* ---------- 在 Node 里整理：颜色、样式表、路径编码 ---------- */
function color(c, inh) {
  if (!c || c === 'none' || c === 'transparent' || c === 'rgba(0, 0, 0, 0)') return null;
  if (c === inh) return 'inherit';
  const url = c.match(/url\("?#([\w-]+)"?\)/); if (url) return 'pattern:' + url[1];
  const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  if (!m) return c;
  const hex = [m[1], m[2], m[3]].map(v => (+v).toString(16).padStart(2, '0')).join('');
  return m[4] != null && +m[4] < 1 ? `rgba(${m[1]},${m[2]},${m[3]},${m[4]})` : '#' + hex;
}
function makeStyles() {
  const list = [], index = new Map();
  return {
    list,
    id(st, inh, isText) {
      const o = { f: color(st.fill, inh), s: color(st.stroke, inh), w: st.stroke && st.stroke !== 'none' ? st.sw : 0 };
      if (st.fo < 1) o.fo = st.fo; if (st.so < 1) o.so = st.so; if (st.op < 1) o.o = Math.round(st.op * 1000) / 1000;
      if (st.dash) o.d = st.dash.split(/[ ,]+/).map(parseFloat);
      if (o.s) { if (st.cap !== 'butt') o.c = st.cap; if (st.join !== 'miter') o.j = st.join; }
      if (isText) { o.ff = st.ff; o.fs = st.fs; o.fw = st.fw; if (st.ls) o.ls = st.ls; o.a = st.anchor; if (/^stroke/.test(st.po)) o.po = 1; }
      const k = JSON.stringify(o); if (!index.has(k)) { index.set(k, list.length); list.push(o); } return index.get(k);
    }
  };
}
function ops(records, S, inh, prec) {
  const out = [];
  for (const r of records) {
    const isText = r.tag === 'text';
    if (r.st.disp === 'none' && !/zlbl|blbl/.test(r.cls)) continue;
    const sid = S.id(r.st, inh, isText), m = r.m;
    const sx = Math.hypot(m[0], m[1]), rot = Math.atan2(m[1], m[0]);
    const tp = (x, y) => [Math.round((m[0] * x + m[2] * y + m[4]) * 100) / 100, Math.round((m[1] * x + m[3] * y + m[5]) * 100) / 100];
    if (r.tag === 'path') out.push(['p', sid, encode(normalize(r.d), m, prec)]);
    else if (r.tag === 'circle') { const [x, y] = tp(r.cx, r.cy); out.push(['c', sid, x, y, Math.round(r.r * sx * 100) / 100]); }
    else if (r.tag === 'ellipse') { const [x, y] = tp(r.cx, r.cy); out.push(['e', sid, x, y, r.rx * sx, r.ry * sx]); }
    else if (r.tag === 'rect') {
      if (r.w == null || r.h == null) continue;
      if (Math.abs(rot) < 1e-6 && Math.abs(m[0] - m[3]) < 1e-6) { const [x, y] = tp(r.x, r.y); out.push(['r', sid, x, y, r.w * sx, r.h * sx, r.rx * sx]); }
      else { const x = r.x, y = r.y, w = r.w, h = r.h; out.push(['p', sid, encode(normalize(`M${x} ${y}h${w}v${h}h${-w}Z`), m, prec)]); }
    } else if (isText) { const [x, y] = tp(r.x, r.y); out.push(['t', sid, x, y, r.text, Math.round(sx * 1000) / 1000, Math.round(rot * 1e4) / 1e4, r.cls]); }
    else if (r.tag === 'use') { const [x, y] = tp(0, 0); out.push(['u', sid, x, y, r.href, Math.round(sx * 1000) / 1000]); }
  }
  return out;
}

(async () => {
  const browser = await chromium.launch(), raw = {};
  for (const lang of LANGS) {
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await p.route('https://api.open-meteo.com/**', r => r.abort());
    await p.goto(`${BASE}/index.html#lang=${lang}`); await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForTimeout(3000);
    raw[lang] = await p.evaluate(collect);
    await p.close();
  }
  await browser.close();
  const zh = raw.zh, S = makeStyles(), inh = zh.INH;
  const scene = { W: zh.W, H: zh.H, styles: S.list };
  scene.base = ops(zh.base, S, inh, 10);
  scene.campus = ops(zh.campus, S, inh, 100);
  scene.leaders = ops(zh.leaders, S, inh, 100);
  scene.frame = ops(zh.frame, S, inh, 100);
  scene.symbols = {}; for (const k in zh.symbols) scene.symbols[k] = ops(zh.symbols[k], S, inh, 100);
  scene.patterns = {}; for (const k in zh.patterns) scene.patterns[k] = { w: zh.patterns[k].w, h: zh.patterns[k].h, ops: ops(zh.patterns[k].ops, S, inh, 100) };
  /* 地名和标记文字按语言分开 */
  scene.labels = {}; scene.markerLabels = {};
  for (const lang of LANGS) {
    scene.labels[lang] = ops(raw[lang].baseLabels, S, inh, 100).concat(ops(raw[lang].campus.filter(r => r.tag === 'text'), S, inh, 100));
    scene.markerLabels[lang] = {};
    raw[lang].markers.forEach(mk => { if (mk.lbl) scene.markerLabels[lang][mk.id] = [mk.lbl.text, S.id(mk.lbl.st, inh, true), mk.lbl.cls]; });
  }
  scene.campus = scene.campus.filter(o => o[0] !== 't');   // 校区名在 labels 里（按语言）
  scene.markers = zh.markers.map(mk => ({ id: mk.id, t: mk.t, n: mk.n, x: mk.x, y: mk.y, a: mk.a, zone: mk.zone, ops: ops(mk.ops, S, inh, 100) }));
  const js = '/* 自动生成：scripts/export-scene.cjs 从网页版导出。不要手改。 */\nmodule.exports = ' + JSON.stringify(scene) + ';\n';
  fs.writeFileSync(OUT, js);
  console.log('scene.js', (js.length / 1024).toFixed(0) + ' KB', 'styles', S.list.length, 'base ops', scene.base.length, 'markers', scene.markers.length,
    'symbols', Object.keys(scene.symbols).join(','), 'labels zh/en', scene.labels.zh.length, scene.labels.en.length);
})();
