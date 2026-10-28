/* 首页：手绘地图 + 公寓卡片 + 公寓列表 / 筛选（手机版布局，和网页版一样：底部三个按钮，点开从下面拉出）。 */
const scene = require('../../data/scene.js');
const { createRenderer } = require('../../map/render.js');
const { createView } = require('../../map/view.js');
const H = require('../../utils/homes.js');
const { t, ht } = require('../../utils/i18n.js');
const fonts = require('../../utils/fonts.js');
const cases = require('../../utils/case-api.js');
const core = require('../../utils/handoff-core.js');
const RP = require('../../utils/rooms-core.js');
const WX = require('../../utils/weather.js');
const shareLink = require('../../utils/share-link.js');
const PL = require('../../utils/plan-core.js');
const { API_BASE } = require('../../config.js');
const photo = p => `${API_BASE}/photos/${p}.jpg`;
const fmtw = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => (v[k] != null ? v[k] : ''));
/* 房型与照片（网页版 room-photos.js 的 section()） */
function roomsView(L, h) {
  const k = RP.W[L] || RP.W.zh, r = RP.roomsFor(h), Lx = o => o[L] || o.en;
  return {
    title: k.roomTypes, note: r.pending ? k.pendingNote : k.pick, perWeek: k.perWeek, sub: k.building,
    types: r.types.map((t, i) => ({ i, name: Lx(t.name), price: t.price, status: Lx(t.status), ok: t.ok, count: t.photos.length ? fmtw(k.photos, { n: t.photos.length }) : '',
      stack: t.photos.slice(0, 3).reverse().map(p => photo(p[0])), pending: '📷 ' + k.pending })),
    building: r.building.map(([p, key]) => ({ url: photo(p), label: k[key] })),
    src: r.pending ? '' : fmtw(k.source, { n: r.totalTypes, m: r.types.length }),
    hint: r.pending ? '' : fmtw(k.hint, { n: RP.photoCount(r) })
  };
}
const app = getApp();

const SUBJ_T = {   // 网页 subject-dock.js 的文案
  zh: { title: '我的专业', label: '利物浦大学专业', intro: '选择专业，查看教学楼与附近公寓。', foot: '选好自动收起；点击侧边标签可随时更换。', close: '收起 ‹', selected: '已选', none: '不选专业' },
  en: { title: 'My subject', label: 'University of Liverpool subject', intro: 'Find your teaching buildings and nearby homes.', foot: 'Closes after choosing. Use the side tab to change it anytime.', close: 'Hide ‹', selected: 'Set', none: 'No subject' }
};
const LAYERS = ['home', 'uni', 'rail', 'bus', 'food', 'sight'];
const LAYER_COLORS = { home: '#7fb3e0', uni: '#e07a5f', rail: '#9b7fc4', bus: '#7cc47f', food: '#f4a259', sight: '#f2c14e' };
const TAP_MOVE = 8, TAP_MS = 350;

let canvas = null, ctx = null, cache = null, cctx = null, renderer = null, view = null, dpr = 1, frame = 0;
let cacheView = null, gesture = null, favorites = new Set(), compare = new Set();
const readSet = (k, max) => { const v = app.store(k); return new Set(Array.isArray(v) ? v.filter(id => H.byId(id)).slice(0, max) : []); };

Page({
  data: { lang: 'zh', T: {}, nav: { top: 48, right: 104, h: 40 }, sheet: '', info: false, card: null, expanded: false,
    filters: H.defaultFilters(), rank: 'area', rankLabel: '', count: 0, groups: [], ranked: [], sortNote: '', open: '', options: {},
    layers: LAYERS.map(k => ({ k, on: true, color: LAYER_COLORS[k], label: '' })), zones: [], favCount: 0, cmpCount: 0, canZoomIn: true, canZoomOut: false,
    groupShow: false, groupHome: null, fab: null, album: null, albumTo: '', wx: null, wxOpen: false, fx: '',
    cmp: null, tray: [], filterIds: null, subjectObj: null, subj: null, planCount: 0 },

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
    this.pendingGroup = q && q.group;   // 订阅消息「群码到了」点进来：直接打开专家群
    // 测试链接（朋友分享的 ?quiz=buddy&duo=food）或分享卡片上的小程序码（scene=q=buddy&d=food&r=推广码）
    const sc = q && q.scene ? shareLink.parseScene(q.scene) : null;
    // 朋友转发的抢房计划：?plan=1.se.180_7.e&from=小林
    this.pendingPlan = q && q.plan ? { code: q.plan, from: q.from ? decodeURIComponent(q.from) : '' } : null;
    // 网页上的抢房计划生成的小程序码：scene=p=分享码
    if (!this.pendingPlan && sc && sc.plan) this.pendingPlan = { id: sc.plan };
    // 网页生成的普通二维码（小程序后台配了「扫普通链接二维码打开小程序」）：q 是整个网址，里面有 ps=分享码 或 plan=计划码
    if (!this.pendingPlan && q && (q.q || q.ps)) {
      const link = q.q ? decodeURIComponent(q.q) : '', get = k => { const m = new RegExp('[?&]' + k + '=([^&#]*)').exec(link); return m ? decodeURIComponent(m[1]) : ''; };
      const ps = q.ps || get('ps'), code = get('plan');
      if (ps) this.pendingPlan = { id: ps }; else if (code) this.pendingPlan = { code, from: get('from') };
    }
    this.pendingQuiz = q && q.quiz ? { quiz: q.quiz, duo: q.duo || '' } : sc && sc.quiz ? { quiz: sc.quiz, duo: sc.duo } : null;
    this.offCase = cases.on(c => this.updateFab(c));
    if (cases.stored()) this.updateFab(null);
  },
  onShow() { if (cases.stored()) cases.start(); this.loadWeather(); this.wxTimer = this.wxTimer || setInterval(() => this.paintWeather(), 60e3); },
  /* ---------- 利物浦天气 ---------- */
  loadWeather() { WX.load().then(w => { this.weather = w; this.paintWeather(); }); },
  paintWeather() { if (!this.weather) return; const v = WX.view(this.weather, this.data.lang); this.setData({ wx: v, fx: v.fx }); },
  toggleWeather() { this.setData({ wxOpen: !this.data.wxOpen, sheet: '', info: false }); },
  nextWeather() { this.weather = WX.next(); this.paintWeather(); },
  onHide() { cases.stop(); },
  onUnload() { this.offCase && this.offCase(); },
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
      if (this.pendingPlan) { const pl = this.selectComponent('#plan'); if (this.pendingPlan.id) pl.openShareId(this.pendingPlan.id); else pl.openFriend(this.pendingPlan.code, this.pendingPlan.from); }
      else if (this.pendingGroup && cases.stored()) this.openGroup();
      else if (this.pendingQuiz) { const f = this.selectComponent('#fun'); f.setDuo(this.pendingQuiz.quiz, this.pendingQuiz.duo); f.intro(this.pendingQuiz.quiz); }
      else if (!this.pendingHome) this.selectComponent('#match').openQuiz();   // 和网页一样：一打开先看到生活选房的开场
    });
  },
  onShareAppMessage(res) {
    // 抢房计划里的「转发我的计划」：朋友点开卡片直接看到这份计划，可以复制
    // 朋友的计划页上的「转发给朋友」：把这份计划原样转出去
    if (res && res.from === 'button' && res.target && res.target.dataset && (res.target.dataset.pq === 'plan' || res.target.dataset.pq === 'friendplan')) {
      const pl = this.selectComponent('#plan'), s = res.target.dataset.pq === 'friendplan' ? pl.friendShareInfo() : pl.shareInfo();
      if (s.code) return { title: s.title, path: s.path };
    }
    // 「留学搭子」结果卡上的「邀请朋友测合拍度」：朋友点开直接进这套测试，看两人合拍度
    if (res && res.from === 'button' && res.target && res.target.dataset && res.target.dataset.fq === 'invite') {
      const f = this.selectComponent('#fun').share;
      if (f) return { title: f.shareText, path: `/pages/index/index?quiz=${f.quiz}&duo=${f.duo}&ref=${shareLink.refCode()}` };
    }
    const c = this.data.card;
    return c ? { title: `${c.n}. ${c.name} · ${t(this.data.lang, 'shareTitle')}`, path: `/pages/index/index?home=${c.id}` } : { title: t(this.data.lang, 'title'), path: '/pages/index/index' };
  },

  /* ---------- 画地图 ---------- */
  mapState(gestureOn) {
    const tags = this.data.rank !== 'area' && this.data.rank !== 'az' ? this.top3.map((id, i) => ({ id, text: t(this.data.lang, 'rank')[i] })) : null;
    return { selected: this.data.card && this.data.card.id, hidden: this.hidden, tags, only: this.only || null, hm: this.hm || null, hit: this.hit || null, gesture: gestureOn, bodyFont: fonts.pick('Nunito', 'a') };
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
    if (this.data.subj && this.data.subj.open) { this.closeSubject(); return; }
    if (!m) { if (this.data.card) this.closeCard(); else this.closeSheets(); return; }
    if (m.t === 'home') this.openHome(m.id);
    else this.openPlace(m);
  },

  /* ---------- 语言 ---------- */
  setLang(lang, quiet) {
    if (lang && lang.currentTarget) lang = lang.currentTarget.dataset.l;
    app.globalData.lang = lang; app.store('lsm-lang', lang);
    const L = lang, T = {};
    ['title', 'zfit', 'hide', 'close', 'findHome', 'rankBy', 'homesBtn', 'filters', 'matchBtn', 'compactAsk', 'ask', 'expandDetails', 'collapseDetails', 'cmpAdd', 'cmpAdded', 'info', 'layers', 'zoneKey', 'save', 'saved', 'share', 'soon', 'compactNote', 'planBtn', 'addPlan', 'inPlan']
      .forEach(k => { T[k] = t(L, k); });
    ['search', 'placeholder', 'favorites', 'budget', 'room', 'destination', 'walk', 'reset', 'note', 'local', 'stable', 'empty'].forEach(k => { T['h_' + k] = ht(L, k); });
    T.filters = t(L, 'filters') === 'filters' ? (L === 'zh' ? '筛选' : 'Filters') : t(L, 'filters');
    this.setData({ lang, T, layers: this.data.layers.map(x => Object.assign({}, x, { label: t(L, 'c_' + x.k) })),
      zones: Object.keys(H.D.zones).map(k => ({ k, color: H.D.zones[k].bld, label: `${H.D.zones[k].name[L]} · ${H.D.zones[k].faculty[L]}` })) });
    if (renderer) { renderer.setLang(lang); this.redraw(); }
    this.refreshList(); this.planCount();
    if (this.data.card) this.openHome(this.data.card.id, false, true);
    this.updateFab(cases.current); this.paintWeather(); this.setData({ subj: this.subjView(!!(this.data.subj && this.data.subj.open)) });
    if (!quiet) wx.vibrateShort && wx.vibrateShort({ type: 'light' });
  },
  toggleInfo() { this.setData({ info: !this.data.info }); },

  /* ---------- 缩放按钮 ---------- */
  zoomIn() { const v = view.get(); view.zoomAt(1.5, v.w / 2, v.h / 2); this.redraw(); },
  zoomOut() { const v = view.get(); view.zoomAt(1 / 1.5, v.w / 2, v.h / 2); this.redraw(); },
  zoomFit() { view.fit(); this.redraw(); },

  /* ---------- 抢房计划（components/plan） ---------- */
  planCount() { const n = Object.keys(PL.load(app.store).watch).filter(id => H.byId(id)).length; this.setData({ planCount: n }); return n; },
  openPlan() { this.setData({ card: null, sheet: '' }); this.selectComponent('#plan').openMine(); },
  addToPlan() {
    const c = this.data.card; if (!c) return;
    const st = PL.load(app.store);
    if (!st.watch[c.id]) {
      if (Object.keys(st.watch).length >= PL.MAX_HOMES) { wx.showToast({ title: t(this.data.lang, 'planFull'), icon: 'none' }); return; }
      st.watch[c.id] = { since: new Date().toISOString() }; PL.save(app.store, st);
      this.setData({ 'card.inPlan': true }); this.planCount();
      wx.showToast({ title: t(this.data.lang, 'planAdded'), icon: 'success' });
    } else { this.setData({ card: null }); this.selectComponent('#plan').openMine(c.id); }
  },
  onPlanClose() { this.planCount(); if (this.data.card) this.setData({ 'card.inPlan': !!PL.load(app.store).watch[this.data.card.id] }); },

  /* ---------- 公寓卡片 ---------- */
  openHome(id, center, keepExpanded) {
    if (id && id.currentTarget) id = id.currentTarget.dataset.id;
    const h = H.byId(id); if (!h) return;
    const c = H.card(this.data.lang, h, this.subject);
    c.fav = favorites.has(id); c.cmp = compare.has(id); c.inPlan = !!PL.load(app.store).watch[id]; c.rooms = roomsView(this.data.lang, h);
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
  /* 房型相册（网页版 openAlbum()）：按卧室 / 浴室 / 厨房分组，底部「咨询这个房型」 */
  openAlbum(e) {
    const L = this.data.lang, k = RP.W[L] || RP.W.zh, h = H.byId(this.data.card.id), t = RP.roomsFor(h).types[e.currentTarget.dataset.i], Lx = o => o[L] || o.en;
    const groups = [];
    t.photos.forEach(p => { let g = groups.find(x => x.key === p[1]); if (!g) groups.push(g = { key: p[1], label: k[p[1]], photos: [] }); g.photos.push({ url: photo(p[0]) }); });
    groups.forEach((g, j) => { g.id = 'rpg' + j; g.chip = `${g.label} · ${g.photos.length}`; g.photos.forEach((ph, n) => { ph.cap = `${n + 1}/${g.photos.length}`; }); });
    const facts = [{ t: Lx(t.status), cls: t.ok ? 'ok' : 'full' }].concat(t.facts.map(f => ({ t: k[f === 'sharedKitchen' ? 'sharedKitchenF' : f === 'living' ? 'livingF' : f], cls: '' })));
    this.setData({ album: { title: Lx(t.name), sub: `${h.n} · ${h.name}`, groups, facts, price: t.price, perWeek: k.perWeek, ask: '💬 ' + k.ask, close: k.close, empty: t.photos.length ? '' : '📷 ' + k.pendingNote }, albumTo: '' });
  },
  closeAlbum() { this.setData({ album: null }); },
  albumJump(e) { this.setData({ albumTo: e.currentTarget.dataset.id }); },
  albumPreview(e) { const urls = [].concat.apply([], this.data.album.groups.map(g => g.photos.map(p => p.url))); wx.previewImage({ urls, current: e.currentTarget.dataset.url }); },
  albumAsk() { this.setData({ album: null }); this.ask(); },
  toggleExpand() { this.setData({ expanded: !this.data.expanded }); },
  /* ---------- 咨询 = 进群 ---------- */
  ask() { const h = this.data.card && H.byId(this.data.card.id); this.openGroup(h); },
  openGroup(h) {
    if (!h || !h.id) { const c = cases.current, first = c && c.homes && c.homes[0]; h = first ? H.byId(first.id) : (this.data.card && H.byId(this.data.card.id)) || null; }
    const home = h ? { id: h.id, n: h.n, name: h.name, pe: h.pe, ps: h.ps, plo: h.plo, pso: h.pso, uol: h.uol, ljmu: h.ljmu, lime: h.lime } : null;
    this.setData({ groupShow: true, groupHome: home, sheet: '' });
    this.markSeen();
  },
  closeGroup() { this.setData({ groupShow: false }); this.markSeen(); },
  /* 右下角气泡：等群码 / 群码到了 / 新消息（网页版 .bh-fab） */
  updateFab(c) {
    const k = core.W[this.data.lang] || core.W.zh, stored = cases.stored();
    if (!stored) return this.setData({ fab: null });
    const n = c ? (c.group ? 1 : 0) + (c.messages || []).length : 0, seen = app.store('lsm-case-seen-v1') || 0;
    const fresh = this.data.groupShow ? 0 : Math.max(0, n - seen);
    this.setData({ fab: { label: !c || !c.group ? k.fabWait : fresh ? k.fabNew : k.fab, waiting: !c || !c.group, dot: fresh, title: k.fab } });
  },
  markSeen() { const c = cases.current; if (c) { app.store('lsm-case-seen-v1', (c.group ? 1 : 0) + (c.messages || []).length); this.updateFab(c); } },
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
  /* ---------- 生活选房（components/match） ---------- */
  openMatch() { this.setData({ card: null, sheet: '' }); this.selectComponent('#match').openQuiz(); },
  onMatchMap(e) {
    if (e.detail && e.detail.picks) { const f = this.selectComponent('#fun'); if (f && f.data.active) f.exit(); }   // 两张结果卡不同时出现
    this.applyHm(e.detail);
  },
  applyHm(d) {
    this.hm = d && d.picks ? { picks: d.picks, layer: d.layer } : null;
    if (view) view.setInset(this.hm ? Math.round(view.get().h * 0.48) + 74 : 0);   // 结果卡开着时，地图可以往上移到卡片上面
    if (d && d.fit && view) this.fitPoints(d.fit); else this.redraw();
  },
  /* ---------- 留学人格测试（components/fun）和分享卡片（components/share） ---------- */
  onMatchFun(e) { const f = this.selectComponent('#fun'); if (e.detail.id) f.intro(e.detail.id); else f.hub(); },
  onFunMap(e) { this.applyHm(e.detail); },
  onFunResult() { const m = this.selectComponent('#match'); if (m && m.data.active) m.exit(); this.setData({ card: null, sheet: '' }); },
  onFunHome() { this.selectComponent('#match').openQuiz(0); },
  onShareCard(e) { this.selectComponent('#share').open(e.detail); },
  onMatchCard(e) { this.openHome(e.detail.id); },
  onMatchAsk(e) { this.openGroup(H.byId(e.detail.id)); },
  onMatchCompare(e) { compare.clear(); e.detail.ids.forEach(id => compare.add(id)); app.store('lsm-compare-v1', [...compare]); this.refreshList(); this.openCompare(); },
  onMatchSubject() { this.openSubject(); },
  /* ---------- 我的专业（网页 subject-dock.js）：选了专业，教学楼在地图上高亮，公寓按到教学楼的步行时间排序 ---------- */
  subjView(open, listOpen) {
    const L = this.data.lang, k = SUBJ_T[L] || SUBJ_T.zh, s = this.subject;
    const info = s ? t(L, 'subjInfo', { name: s.name[L], note: s.note[L], zone: H.D.zones[s.zone].name[L], faculty: H.D.zones[s.zone].faculty[L] }) : '';
    return { open, k, set: !!s, current: s ? s.name[L] : t(L, 'studyPh'), info, show: t(L, 'showMe'),
      list: [{ id: '', name: k.none }].concat(H.D.subjects.map(x => ({ id: x.id, name: x.name[L], on: s && s.id === x.id }))), listOpen: !!listOpen };
  },
  openSubject() { this.setData({ subj: this.subjView(true), sheet: '', card: null }); },
  toggleSubject() { this.setData({ subj: this.subjView(!(this.data.subj && this.data.subj.open)) }); },
  closeSubject() { this.setData({ subj: this.subjView(false) }); },
  toggleSubjList() { this.setData({ subj: this.subjView(true, !(this.data.subj && this.data.subj.listOpen)) }); },
  pickSubject(e) {
    const id = e.currentTarget.dataset.id; this.subject = H.applySubject(id);
    this.hit = this.subject ? {} : null; if (this.subject) H.D.buildings.filter(b => this.subject.keys.includes(b.key)).forEach(b => { this.hit[b.id] = 1; });
    const rank = this.subject ? 'subject' : (this.data.rank === 'subject' ? 'area' : this.data.rank);
    const f = this.data.filters; if (!this.subject && f.destination === 'subject') this.setData({ 'filters.destination': 'uol' });
    this.setData({ rank, subjectObj: this.subject ? { name: this.subject.name.zh } : null });
    const v = this.subjView(false); v.open = !this.subject; this.setData({ subj: v });
    renderer && renderer.relayout(); this.refreshList();
    if (this.subject) this.showBuildings();
  },
  /* 「在地图上查看」：把这些教学楼放到屏幕中间 */
  showBuildings() {
    if (!this.subject || !view) return;
    const pts = scene.markers.filter(m => this.hit && this.hit[m.id]).map(m => [m.x, m.y]); if (!pts.length) return;
    const pad = 120; this.fitPoints(pts.map(p => [p[0] - pad, p[1] - pad]).concat(pts.map(p => [p[0] + pad, p[1] + pad])));
    this.setData({ subj: this.subjView(false) });
  },
  onMatchResetFilters() { this.resetFilters(); },
  /* 让推荐和 10 分钟圈都在屏幕上，避开顶部标题栏和底部的选房卡（网页 fitPoints） */
  fitPoints(pts) {
    const v = view.get(), xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    // 结果卡在底部（.hm-res：底部按钮上方，最高 48vh），推荐的公寓要落在卡片上面那一块
    const top = this.data.nav.top + this.data.nav.h + 12, bottom = v.h * 0.52 - 74, left = 24, right = v.w - 60;
    const z = Math.max(1, Math.min(view.zmax(), Math.min((right - left) / ((x1 - x0) * view.fitK), (bottom - top) / ((y1 - y0) * view.fitK))));
    view.set({ z, tx: (left + right) / 2 - (x0 + x1) / 2 * view.fitK * z, ty: (top + bottom) / 2 - (y0 + y1) / 2 * view.fitK * z });
    this.redraw();
  },

  /* ---------- 对比（网页 renderCompare）+ 底部对比栏 ---------- */
  openCompare() {
    const L = this.data.lang, list = [...compare].map(id => H.byId(id)).filter(Boolean);
    if (list.length < 2) return;
    const money = v => `£${v}`, rows = [];
    if (this.subject) rows.push([t(L, 'rSubj', { s: this.subject.name[L] }), h => h.subj, v => t(L, 'fMin', { n: v }), 'low']);
    rows.push([t(L, 'rUol'), h => h.uol, v => t(L, 'fMin', { n: v }), 'low'], [t(L, 'rLjmu'), h => h.ljmu, v => t(L, 'fMin', { n: v }), 'low'],
      [t(L, 'rEn'), h => h.pe, money, 'low', true], [t(L, 'rSt'), h => h.ps, money, 'low', true], [t(L, 'rAny'), h => h.plo, money, 'low', true],
      [t(L, 'rRate'), h => (h.rn ? h.rr : null), (v, h) => `${Number(v).toFixed(1)}★ · ${t(L, 'fRev', { n: h.rn, pl: L === 'en' && h.rn !== 1 ? 's' : '' })}`, 'high']);
    const out = rows.map(([label, get, fmt, dir, price]) => {
      const vals = list.map(get), have = vals.filter(v => v != null);
      const best = have.length >= 2 && new Set(have).size > 1 ? (dir === 'low' ? Math.min.apply(null, have) : Math.max.apply(null, have)) : null;
      return { label, cells: list.map((h, i) => { const v = vals[i];
        if (v == null) return { na: true, t: price && h.pso ? t(L, 'soldShort') : t(L, 'notListed') };
        return { t: fmt(v, h), unit: price ? t(L, 'perWk') : '', best: v === best }; }) };
    });
    this.setData({ cmp: { title: t(L, 'cmpTitle'), heads: list.map(h => ({ id: h.id, n: h.n, name: h.name, area: h.areaName[L], addr: h.addr })), rows: out,
      desc: { label: t(L, 'rDesc'), cells: list.map(h => h.text[L]) }, best: t(L, 'best'), ask: t(L, 'ask'), map: t(L, 'showOnMap'), rm: t(L, 'cmpRemove'),
      note: t(L, 'source') + (L === 'en' ? ' ' : '') + t(L, 'cmpWalkNote') }, sheet: '', card: null });
  },
  closeCompare() { this.setData({ cmp: null }); },
  cmpAsk(e) { const h = H.byId(e.currentTarget.dataset.id); this.setData({ cmp: null }); this.openGroup(h); },
  cmpMap(e) { this.setData({ cmp: null }); this.openHome(e.currentTarget.dataset.id, true); },
  cmpRemove(e) { compare.delete(e.currentTarget.dataset.id); app.store('lsm-compare-v1', [...compare]); this.refreshList(); if (compare.size < 2) this.closeCompare(); else this.openCompare(); },
  trayRemove(e) { compare.delete(e.currentTarget.dataset.id); app.store('lsm-compare-v1', [...compare]); this.refreshList(); },
  trayClear() { compare.clear(); app.store('lsm-compare-v1', []); this.refreshList(); },

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
      rankLabel, sortNote: ranked ? `${t(L, 'sortedBy', { k: rankLabel })} · ${t(L, 'topNote')}` : '', options: this.menuOptions(),
      favCount: favorites.size, cmpCount: compare.size, filterIds: this.only || null,
      tray: [...compare].map(id => H.byId(id)).filter(Boolean).map(h => ({ id: h.id, n: h.n, name: h.name })),
      trayT: { lbl: t(L, 'cmpLbl'), go: t(L, 'cmpGo'), clr: t(L, 'cmpClear') } });
    if (renderer) { renderer.relayout(); this.redraw(); }
  },
  menuOptions() {   // 不能叫 options：小程序页面的 this.options 是启动参数
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
