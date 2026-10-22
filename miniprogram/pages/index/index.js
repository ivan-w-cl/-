/* 首页：手绘地图 + 公寓卡片 + 公寓列表 / 筛选（手机版布局，和网页版一样：底部三个按钮，点开从下面拉出）。 */
const scene = require('../../data/scene.js');
const { createRenderer } = require('../../map/render.js');
const { createView } = require('../../map/view.js');
const H = require('../../utils/homes.js');
const { t, ht } = require('../../utils/i18n.js');
const fonts = require('../../utils/fonts.js');
const app = getApp();

const LAYERS = ['home', 'uni', 'rail', 'bus', 'food', 'sight'];
const LAYER_COLORS = { home: '#7fb3e0', uni: '#e07a5f', rail: '#9b7fc4', bus: '#7cc47f', food: '#f4a259', sight: '#f2c14e' };
const TAP_MOVE = 8, TAP_MS = 350;

let canvas = null, ctx = null, cache = null, cctx = null, renderer = null, view = null, dpr = 1, frame = 0;
let cacheView = null, gesture = null, favorites = new Set(), compare = new Set();
const readSet = (k, max) => { const v = app.store(k); return new Set(Array.isArray(v) ? v.filter(id => H.byId(id)).slice(0, max) : []); };

Page({
  data: { lang: 'zh', T: {}, nav: { top: 48, right: 104, h: 40 }, sheet: '', info: false, card: null, expanded: false,
    filters: H.defaultFilters(), rank: 'area', rankLabel: '', count: 0, groups: [], ranked: [], sortNote: '', open: '', options: {},
    layers: LAYERS.map(k => ({ k, on: true, color: LAYER_COLORS[k], label: '' })), zones: [], favCount: 0, cmpCount: 0, canZoomIn: true, canZoomOut: false },

  onLoad(q) {
    favorites = readSet('lsm-favorites-v1', 47); compare = readSet('lsm-compare-v1', 3);
    this.hidden = {};
    let nav = this.data.nav;
    try {
      const m = wx.getMenuButtonBoundingClientRect(), info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      // 标题栏放在微信右上角胶囊按钮的左边，同一行
      nav = { top: m.top - 4, h: m.height + 8, right: info.windowWidth - m.left + 8 };
    } catch (e) { /* 开发者工具以外的环境 */ }
    this.setData({ nav });
    this.setLang(app.globalData.lang, true);
    this.pendingHome = q && q.home;
  },
  onReady() {
    wx.createSelectorQuery().in(this).select('#map').fields({ node: true, size: true }).exec(res => {
      const r = res && res[0]; if (!r || !r.node) return;
      canvas = r.node; ctx = canvas.getContext('2d');
      try { dpr = (wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()).pixelRatio || 2; } catch (e) { dpr = 2; }
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      const make = (w, h) => (wx.createOffscreenCanvas ? wx.createOffscreenCanvas({ type: '2d', width: w, height: h }) : null);
      try { cache = make(canvas.width, canvas.height); cctx = cache && cache.getContext('2d'); } catch (e) { cache = null; }
      renderer = createRenderer(scene, { dpr, makeCanvas: make, font: fonts.pick });
      renderer.setLang(this.data.lang);
      view = createView(scene.W, scene.H); view.resize(r.width, r.height);
      view.viewPoints(scene.markers.filter(m => m.t === 'home').map(m => [m.x, m.y]));   // 手机上先对准公寓区（网页版 viewStudents）
      this.redraw();
      fonts.ready(() => { renderer.relayout(); this.redraw(); });
      if (this.pendingHome && H.byId(this.pendingHome)) this.openHome(this.pendingHome, true);
    });
  },
  onShareAppMessage() {
    const c = this.data.card;
    return c ? { title: `${c.n}. ${c.name} · ${t(this.data.lang, 'shareTitle')}`, path: `/pages/index/index?home=${c.id}` } : { title: t(this.data.lang, 'title'), path: '/pages/index/index' };
  },

  /* ---------- 画地图 ---------- */
  mapState(gestureOn) {
    const tags = this.data.rank !== 'area' && this.data.rank !== 'az' ? this.top3.map((id, i) => ({ id, text: t(this.data.lang, 'rank')[i] })) : null;
    return { selected: this.data.card && this.data.card.id, hidden: this.hidden, tags, only: this.only || null, gesture: gestureOn, bodyFont: fonts.pick('Nunito', 'a') };
  },
  redraw() {
    if (!renderer) return;
    const v = view.get();
    if (cache && cctx) {
      renderer.draw(cctx, v, this.mapState(false)); cacheView = v;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(cache, 0, 0);
    } else renderer.draw(ctx, v, this.mapState(false));
    this.setData({ canZoomIn: view.z < view.zmax() - 0.001, canZoomOut: view.z > 1.001 });
  },
  /* 手指移动时：把上一帧缩放平移着贴上去（快），松手后再完整重画（清楚） */
  quickDraw() {
    if (frame) return;
    frame = canvas.requestAnimationFrame(() => {
      frame = 0; const v = view.get();
      if (!cache || !cacheView) { renderer.draw(ctx, v, this.mapState(true)); return; }
      const s = v.k / cacheView.k;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#d9c9a3'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(cache, (v.tx - cacheView.tx * s) * dpr, (v.ty - cacheView.ty * s) * dpr, canvas.width * s, canvas.height * s);
    });
  },

  /* ---------- 手势：单指拖动，双指缩放，轻点选中 ---------- */
  onTouchStart(e) {
    const ts = e.touches;
    if (ts.length === 1) gesture = { mode: 'pan', x: ts[0].x, y: ts[0].y, sx: ts[0].x, sy: ts[0].y, t: Date.now(), moved: false };
    else if (ts.length >= 2) gesture = { mode: 'pinch', d: Math.hypot(ts[0].x - ts[1].x, ts[0].y - ts[1].y), moved: true };
  },
  onTouchMove(e) {
    if (!gesture || !view) return;
    const ts = e.touches;
    if (gesture.mode === 'pan' && ts.length === 1) {
      const dx = ts[0].x - gesture.x, dy = ts[0].y - gesture.y; gesture.x = ts[0].x; gesture.y = ts[0].y;
      if (Math.hypot(ts[0].x - gesture.sx, ts[0].y - gesture.sy) > TAP_MOVE) gesture.moved = true;
      if (gesture.moved) { view.pan(dx, dy); this.quickDraw(); }
    } else if (ts.length >= 2) {
      const d = Math.hypot(ts[0].x - ts[1].x, ts[0].y - ts[1].y), cx = (ts[0].x + ts[1].x) / 2, cy = (ts[0].y + ts[1].y) / 2;
      if (gesture.mode !== 'pinch') gesture = { mode: 'pinch', d, cx, cy, moved: true };
      view.zoomAt(d / gesture.d, cx, cy); if (gesture.cx != null) view.pan(cx - gesture.cx, cy - gesture.cy);
      gesture.d = d; gesture.cx = cx; gesture.cy = cy; this.quickDraw();
    }
  },
  onTouchEnd(e) {
    if (!gesture) return;
    const g = gesture;
    if (e.touches && e.touches.length) { if (e.touches.length === 1) gesture = { mode: 'pan', x: e.touches[0].x, y: e.touches[0].y, sx: e.touches[0].x, sy: e.touches[0].y, t: Date.now(), moved: true }; return; }
    gesture = null;
    if (g.mode === 'pan' && !g.moved && Date.now() - g.t < TAP_MS) return this.tapMap(g.sx, g.sy);
    this.redraw();
  },
  tapMap(x, y) {
    const m = renderer.hit(view.get(), x, y, { hidden: this.hidden, only: this.only || null });
    if (!m) { if (this.data.card) this.closeCard(); else this.closeSheets(); return; }
    if (m.t === 'home') this.openHome(m.id);
    else this.openPlace(m);
  },

  /* ---------- 语言 ---------- */
  setLang(lang, quiet) {
    if (lang && lang.currentTarget) lang = lang.currentTarget.dataset.l;
    app.globalData.lang = lang; app.store('lsm-lang', lang);
    const L = lang, T = {};
    ['title', 'zfit', 'hide', 'close', 'findHome', 'rankBy', 'homesBtn', 'filters', 'matchBtn', 'compactAsk', 'ask', 'expandDetails', 'collapseDetails', 'cmpAdd', 'cmpAdded', 'info', 'layers', 'zoneKey', 'save', 'saved', 'share', 'soon', 'compactNote']
      .forEach(k => { T[k] = t(L, k); });
    ['search', 'placeholder', 'favorites', 'budget', 'room', 'destination', 'walk', 'reset', 'note', 'local', 'stable', 'empty'].forEach(k => { T['h_' + k] = ht(L, k); });
    T.filters = t(L, 'filters') === 'filters' ? (L === 'zh' ? '筛选' : 'Filters') : t(L, 'filters');
    this.setData({ lang, T, layers: this.data.layers.map(x => Object.assign({}, x, { label: t(L, 'c_' + x.k) })),
      zones: Object.keys(H.D.zones).map(k => ({ k, color: H.D.zones[k].bld, label: `${H.D.zones[k].name[L]} · ${H.D.zones[k].faculty[L]}` })) });
    if (renderer) { renderer.setLang(lang); this.redraw(); }
    this.refreshList();
    if (this.data.card) this.openHome(this.data.card.id, false, true);
    if (!quiet) wx.vibrateShort && wx.vibrateShort({ type: 'light' });
  },
  toggleInfo() { this.setData({ info: !this.data.info }); },

  /* ---------- 缩放按钮 ---------- */
  zoomIn() { const v = view.get(); view.zoomAt(1.5, v.w / 2, v.h / 2); this.redraw(); },
  zoomOut() { const v = view.get(); view.zoomAt(1 / 1.5, v.w / 2, v.h / 2); this.redraw(); },
  zoomFit() { view.fit(); this.redraw(); },

  /* ---------- 公寓卡片 ---------- */
  openHome(id, center, keepExpanded) {
    if (id && id.currentTarget) id = id.currentTarget.dataset.id;
    const h = H.byId(id); if (!h) return;
    const c = H.card(this.data.lang, h, this.subject);
    c.fav = favorites.has(id); c.cmp = compare.has(id);
    this.setData({ card: c, expanded: keepExpanded ? this.data.expanded : false, sheet: '', info: false });
    if (center && view) { const m = scene.markers.find(x => x.id === id), v = view.get(); view.focus(m.x, m.y, v.w / 2, v.h * 0.38, 2); }
    this.redraw();
  },
  openPlace(m) {
    const L = this.data.lang, p = H.D.places.find(x => x.id === m.id), b = H.D.buildings.find(x => x.id === m.id);
    let card;
    if (b) {
      const z = H.D.zones[b.zone], subs = H.D.subjects.filter(x => x.keys.includes(b.key)).map(x => x.name[L]);
      const text = subs.length ? t(L, 'bSubj', { list: subs.join(L === 'en' ? ', ' : '、') }) : t(L, 'bPart', { zone: z.name[L], faculty: z.faculty[L] });
      card = { id: m.id, place: true, tag: z.name[L], tagColor: z.ink, name: b.name, text };
    }
    else if (p) card = { id: m.id, place: true, tag: t(L, 't_' + p.t), tagColor: H.D.types[p.t], name: p.name[L], text: p.text[L] };
    else return;
    this.setData({ card, expanded: false, sheet: '' }); this.redraw();
  },
  closeCard() { this.setData({ card: null, expanded: false }); this.redraw(); },
  toggleExpand() { this.setData({ expanded: !this.data.expanded }); },
  ask() { wx.showToast({ title: this.data.T.soon, icon: 'none' }); },   // 第二步：一键进群
  toggleFav(e) {
    const id = (e && e.currentTarget.dataset.id) || this.data.card.id;
    favorites.has(id) ? favorites.delete(id) : favorites.add(id); app.store('lsm-favorites-v1', [...favorites]);
    if (this.data.card && this.data.card.id === id) this.setData({ 'card.fav': favorites.has(id) });
    this.refreshList();
  },
  toggleCompare(e) {
    const id = (e && e.currentTarget.dataset.id) || this.data.card.id;
    if (compare.has(id)) compare.delete(id);
    else { if (compare.size >= 3) { wx.showToast({ title: ht(this.data.lang, 'full'), icon: 'none' }); return; } compare.add(id); }
    app.store('lsm-compare-v1', [...compare]);
    if (this.data.card && this.data.card.id === id) this.setData({ 'card.cmp': compare.has(id) });
    this.refreshList();
  },

  /* ---------- 底部按钮 / 抽屉 ---------- */
  openSheet(e) { const s = e.currentTarget.dataset.s; this.setData({ sheet: this.data.sheet === s ? '' : s, card: null, open: '', info: false }); this.redraw(); },
  closeSheets() { if (this.data.sheet || this.data.info) this.setData({ sheet: '', open: '', info: false }); },
  noop() {},
  /* 测试用：某个标记现在在屏幕上的位置 */
  _where(id) { const m = scene.markers.find(x => x.id === id), v = view.get(); return { x: m.x * v.k + v.tx, y: m.y * v.k + v.ty, k: v.k }; },
  openMatch() { wx.showToast({ title: this.data.T.soon, icon: 'none' }); },   // 第三步：生活选房

  /* ---------- 公寓列表：搜索、收藏、排序 ---------- */
  refreshList() {
    const L = this.data.lang, f = this.data.filters, rank = this.data.rank;
    const list = H.visible(rank, f, favorites), row = (h, i) => ({ id: h.id, n: h.n, name: h.name, fav: favorites.has(h.id), cmp: compare.has(h.id), rank: i + 1, w: H.rankValue(L, rank, h) });
    const ranked = rank !== 'area' && rank !== 'az';
    this.top3 = ranked ? list.slice(0, 3).map(h => h.id) : [];
    this.only = (f.query || f.budget || f.room !== 'any' || f.walk || f.favoritesOnly) ? list.reduce((o, h) => { o[h.id] = 1; return o; }, {}) : null;
    const groups = rank === 'area' ? H.D.areaOrder.map(a => ({ title: H.D.areaNames[L][a], items: list.filter(h => h.area === a).map(row) })).filter(g => g.items.length) : [];
    const R = H.D.ranks.find(r => r.key === rank);
    const rankLabel = rank === 'subject' && this.subject ? R.label[L].replace('{s}', this.subject.name[L]) : R.label[L];
    this.setData({ groups, ranked: rank === 'area' ? [] : list.map(row), isRanked: ranked, count: list.length,
      countText: ht(L, 'count', { n: list.length }), viewText: ht(L, 'view', { n: list.length }), homesCount: t(L, 'homesCount', { n: list.length }),
      rankLabel, sortNote: ranked ? `${t(L, 'sortedBy', { k: rankLabel })} · ${t(L, 'topNote')}` : '', options: this.options(),
      favCount: favorites.size, cmpCount: compare.size });
    if (renderer) { renderer.relayout(); this.redraw(); }
  },
  options() {
    const L = this.data.lang, f = this.data.filters;
    const groupOf = r => r.group[L] || '';
    const ranks = H.D.ranks.filter(r => r.key !== 'subject' || this.subject).map(r => ({ v: r.key, label: r.key === 'subject' && this.subject ? r.label[L].replace('{s}', this.subject.name[L]) : r.label[L], group: groupOf(r) }));
    const opts = {
      rank: ranks,
      budget: [{ v: 0, label: ht(L, 'unlimited') }].concat([100, 125, 150, 175, 200, 250, 300].map(n => ({ v: n, label: `£${n}` }))),
      room: ['any', 'ensuite', 'studio'].map(k => ({ v: k, label: ht(L, k) })),
      destination: ['uol', 'ljmu'].concat(this.subject ? ['subject'] : []).map(k => ({ v: k, label: ht(L, k) })),
      walk: [{ v: 0, label: ht(L, 'unlimited') }].concat([5, 10, 15, 20, 30, 45].map(n => ({ v: n, label: ht(L, 'minutes', { n }) })))
    };
    const cur = { rank: this.data.rank, budget: f.budget, room: f.room, destination: f.destination, walk: f.walk };
    Object.keys(opts).forEach(k => { opts[k].forEach(o => { o.on = o.v === cur[k]; }); opts[k].current = (opts[k].find(o => o.on) || opts[k][0]).label; });
    return opts;
  },
  onSearch(e) { this.setData({ 'filters.query': e.detail.value }); this.refreshList(); },
  toggleFavOnly() { this.setData({ 'filters.favoritesOnly': !this.data.filters.favoritesOnly }); this.refreshList(); },
  /* 手绘风格的下拉列表（不用系统滚轮），和网页版 fancy-select 一样 */
  openSelect(e) { const k = e.currentTarget.dataset.k; this.setData({ open: this.data.open === k ? '' : k }); },
  pick(e) {
    const { k, v } = e.currentTarget.dataset, val = typeof this.data.filters[k] === 'number' ? Number(v) : v;
    if (k === 'rank') this.setData({ rank: v, open: '' }); else this.setData({ ['filters.' + k]: val, open: '' });
    this.refreshList();
  },
  resetFilters() { this.setData({ filters: H.defaultFilters(), open: '' }); this.refreshList(); },
  viewResults() { this.setData({ sheet: 'homes' }); },
  toggleLayer(e) {
    const k = e.currentTarget.dataset.k; this.hidden[k] = !this.hidden[k];
    this.setData({ layers: this.data.layers.map(x => Object.assign({}, x, { on: !this.hidden[x.k] })) }); renderer && renderer.relayout(); this.redraw();
  }
});
