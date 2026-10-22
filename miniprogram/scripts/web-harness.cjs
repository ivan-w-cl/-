/* 在 Node 里加载网页版（index.html 内嵌数据 + home-match.js），不需要浏览器。
   供 extract-data.cjs（生成数据）和 tests/（对照网页结果）共用。 */
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const WEB_DIR = process.env.WEB_DIR || path.resolve(__dirname, '../../ui-project/liverpool-life-map-en');

function slice(src, startToken, endToken) {
  const s = src.indexOf(startToken);
  if (s < 0) throw new Error('index.html 中找不到 ' + startToken);
  const e = src.indexOf(endToken, s);
  return src.slice(s, e + endToken.length);
}
class Node {
  constructor(id = '') { this.id = id; this.tagName = 'DIV'; this.hidden = true; this.children = []; this.attrs = {}; this.dataset = {}; this.events = {}; this.style = {}; this.innerHTML = ''; this.textContent = ''; this.isConnected = true;
    this.classList = { items: new Set(), add(...x) { x.forEach(v => this.items.add(v)); }, remove(...x) { x.forEach(v => this.items.delete(v)); }, contains(x) { return this.items.has(x); }, toggle(x, v) { if (v === undefined) v = !this.items.has(x); v ? this.items.add(x) : this.items.delete(x); return v; } }; }
  setAttribute(k, v) { this.attrs[k] = String(v); } getAttribute(k) { return this.attrs[k] || null; } addEventListener(k, f) { (this.events[k] ||= []).push(f); }
  append(...x) { this.children.push(...x); } before() {} insertBefore(n) { this.children.push(n); } insertAdjacentHTML() {} replaceChildren(...x) { this.children = x; }
  querySelector() { return new Node(); } querySelectorAll() { return []; } contains() { return false; } focus() {} getClientRects() { return [{}]; }
  getBoundingClientRect() { return { left: 0, top: 0, right: 380, bottom: 850, width: 380, height: 850 }; } click() {}
}

function loadWeb(lang = 'zh') {
  const index = fs.readFileSync(path.join(WEB_DIR, 'index.html'), 'utf8');
  const run = (code, ret) => vm.runInNewContext(code + '\n' + ret);
  const HOMES = run(slice(index, 'const HOMES = [', '\n];'), 'HOMES');
  const PRICES = run(slice(index, 'const PRICES = {', '\n};'), 'PRICES');
  const HOME_TX = run(slice(index, 'const HOME_TX = {', '\n};'), 'HOME_TX');
  const AREA_TX = run(slice(index, 'const AREA_TX = {', '\n};'), 'AREA_TX');
  const GEO = run('var window={};' + slice(index, 'window.GEO = ', '};'), 'window.GEO');
  const parseD = run(slice(index, 'function parseD(d) {', '\n}'), 'parseD');
  const HT = require(path.join(WEB_DIR, 'home-tools.js'));
  const LON0 = -3.015, LAT0 = 53.448, KX = 6638.0, KY = 11132.0;
  const raw = (lat, lon) => [(lon - LON0) * KX, (LAT0 - lat) * KY];
  const walkMin = (a, b) => Math.round(Math.hypot(a[0] - b[0], a[1] - b[1]) * 10 * 1.3 / 80);
  const UOL = raw(53.4065, -2.9663), LJMU = [raw(53.4127, -2.9838), raw(53.4030, -2.9730)], LIME = raw(53.4074, -2.9776), CENTRE = raw(53.4035, -2.9868);
  HOMES.forEach(h => {
    const id = HT.HOME_IDENTITIES[h.name]; if (!id) throw new Error('缺少房源编号: ' + h.name);
    h.id = id.id; h.n = id.n; const r = raw(h.lat, h.lng);
    h.uol = walkMin(r, UOL); h.ljmu = Math.min(...LJMU.map(c => walkMin(r, c))); h.lime = walkMin(r, LIME); h.centre = walkMin(r, CENTRE);
    h.a = h.p = r; const p = PRICES[h.name] || {}; Object.assign(h, { pe: p.e, ps: p.s, plo: p.lo, rr: p.r, rn: p.n, pso: !!p.so });
  });
  const nodes = new Map(); const node = id => { if (!nodes.has(id)) nodes.set(id, new Node(id)); return nodes.get(id); };
  const doc = { documentElement: { lang: lang === 'zh' ? 'zh-Hans' : 'en' }, body: new Node('body'), activeElement: new Node(), events: {}, getElementById: node, createElement: () => new Node(), querySelector: () => null, querySelectorAll: () => [], addEventListener(k, f) { (this.events[k] ||= []).push(f); }, dispatchEvent(e) { (this.events[e.type] || []).forEach(f => f(e)); } };
  const storage = new Map();
  const ctx = { console, document: doc, URL, URLSearchParams, Map, Set, Math, Number, String, Object, Array, JSON, Infinity,
    Event: class { constructor(t) { this.type = t; } }, CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } },
    navigator: { clipboard: { writeText: async () => {} } }, localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v) },
    location: { href: 'http://localhost/index.html#explore=1', hash: '#explore=1' }, history: { replaceState() {} },
    HomeTools: HT, HOMES, raw, walkMin, GEO, parseD, subject: null, subjName: s => s.name, matchesHomeFilters: () => true,
    hide() {}, closeSheets() {}, welcome: node('welcome'), mk: (t, a, p) => { const n = new Node(); if (p) p.append(n); return n; }, over: node('over'), hidden: new Set(), setLayer() {},
    mapbox: node('mapbox'), els: new Map(HOMES.map(h => [h.id, new Node()])), areaOf: x => x, show() {}, openContact() {}, compare: new Set(), syncCompare() {}, openCompare() {},
    isNarrow: () => false, fitK: 1, z: 1, tx: 0, ty: 0, zmax: () => 10, render() {}, W: (...x) => x, toD: () => '', resetHomeFilters() {}, homeFilters: { favoritesOnly: false },
    queueMicrotask: fn => fn(), setTimeout: () => 1, clearTimeout() {}, addEventListener() {}, dispatchEvent() {} };
  ctx.window = ctx; ctx.LLC_ENTRY_OWNED = true; ctx.mapbox.clientWidth = 1440; ctx.mapbox.clientHeight = 1000;
  let source = fs.readFileSync(path.join(WEB_DIR, 'home-match.js'), 'utf8');
  const hook = '  // Shared homes and the completed lifestyle test can enter the map directly.';
  if (!source.includes(hook)) throw new Error('home-match.js 结构已变化，请更新 web-harness 的挂钩点');
  source = source.replace(hook, '  window.HM_TEST={state,QUESTIONS,metrics,matchHomes,weightsFor,persona,CAMPUSES};\n' + hook);
  vm.createContext(ctx); vm.runInContext(source, ctx, { filename: 'home-match.js' });
  const T = ctx.HM_TEST;
  function webTop3(answers) {
    T.state.answers = JSON.parse(JSON.stringify(answers));
    const r = T.matchHomes();
    return JSON.parse(JSON.stringify({ ids: r.picks.map(p => p.h.id), scores: r.picks.map(p => p.score), persona: T.persona(), eligible: r.eligible }));
  }
  return { WEB_DIR, HOMES, HOME_TX, AREA_TX, T, ctx, webTop3 };
}
function loadLifeModel() {
  const c = {}; vm.createContext(c);
  vm.runInContext(fs.readFileSync(path.join(WEB_DIR, 'life-c-model.js'), 'utf8'), c, { filename: 'life-c-model.js' });
  return c.LifeCModel;
}
module.exports = { loadWeb, loadLifeModel, WEB_DIR };
