const app = getApp();
const HM = require('../../utils/home-match.js');
const i18n = require('../../utils/i18n.js');
const view = require('../../utils/view.js');

const BUDGETS = [0, 150, 180, 200, 250, 300];
const ROOMS = ['any', 'ensuite', 'studio'];
const WALKS = [0, 10, 15, 20, 30];
const CAMPUS = [
  { id: 9001, name: '利物浦大学 UoL', en: 'University of Liverpool', lat: 53.4065, lng: -2.9663 },
  { id: 9002, name: 'LJMU City', en: 'LJMU City', lat: 53.4127, lng: -2.9838 },
  { id: 9003, name: 'LJMU Mount Pleasant', en: 'LJMU Mount Pleasant', lat: 53.4030, lng: -2.9725 }
];

Page({
  data: { T: {}, lang: 'zh', markers: [], points: [], homes: [], countText: '', top: [], onlyTop: false,
    lat: 53.4055, lng: -2.9740, scale: 14,
    q: '', budgetIdx: 0, roomIdx: 0, walkIdx: 0, favOnly: false, budgetLabels: [], roomLabels: [], walkLabels: [] },
  onShow() { this.refresh(); },
  refresh() {
    const lang = app.globalData.lang, T = i18n.dict(lang);
    this.setData({ lang, T,
      budgetLabels: BUDGETS.map(v => v ? '£' + v : T.any), roomLabels: ROOMS.map(r => T[r]),
      walkLabels: WALKS.map(v => v ? i18n.fmt(T.minutes, { n: v }) : T.any) });
    wx.setNavigationBarTitle({ title: T.appName });
    this.renderList();
  },
  filters() {
    const d = this.data;
    return { query: d.q, budget: BUDGETS[d.budgetIdx], room: ROOMS[d.roomIdx], destination: 'uol', walk: WALKS[d.walkIdx], favoritesOnly: d.favOnly };
  },
  renderList() {
    const lang = app.globalData.lang, T = i18n.dict(lang), fav = app.favSet();
    const last = app.globalData.lastResult, topIds = last ? last.ids : [];
    let list = HM.HOMES.filter(h => HM.matchesHome(h, this.filters(), fav));
    if (this.data.onlyTop && topIds.length) list = list.filter(h => topIds.includes(h.id));
    const ordered = list.slice().sort((a, b) => {
      const ra = topIds.indexOf(a.id), rb = topIds.indexOf(b.id);
      if ((ra >= 0) !== (rb >= 0)) return ra >= 0 ? -1 : 1;
      if (ra >= 0) return ra - rb;
      return a.uol - b.uol || a.n - b.n;
    });
    const homes = ordered.map(h => Object.assign(view.homeCard(h, lang, fav), { rank: topIds.indexOf(h.id) + 1 }));
    const markers = list.map(h => {
      const rank = topIds.indexOf(h.id) + 1;
      return { id: h.n, latitude: h.lat, longitude: h.lng, iconPath: rank ? '/images/pin-top.png' : '/images/pin-home.png',
        width: rank ? 30 : 22, height: rank ? 40 : 30, zIndex: rank ? 10 : 1, anchor: { x: 0.5, y: 1 },
        callout: { content: rank ? `★${rank} · ${h.n} ${h.name}` : String(h.n), display: 'ALWAYS', fontSize: rank ? 13 : 10,
          color: rank ? '#ffffff' : '#3b2a1a', bgColor: rank ? '#e8735a' : '#fffaf0', borderColor: rank ? '#b5462f' : '#3b2a1a',
          borderWidth: 1, borderRadius: 10, padding: rank ? 5 : 3, textAlign: 'center' } };
    }).concat(CAMPUS.map(c => ({ id: c.id, latitude: c.lat, longitude: c.lng, iconPath: '/images/pin-campus.png', width: 20, height: 27,
      label: { content: lang === 'en' ? c.en : c.name, fontSize: 10, color: '#b5462f', anchorX: 12, anchorY: -22, bgColor: '#ffffffcc', padding: 2, borderRadius: 4 } })));
    const topHomes = HM.byIds(topIds);
    const fit = topHomes.length ? topHomes : list;
    this.setData({ homes, markers, countText: i18n.fmt(T.count, { n: list.length }),
      points: fit.map(h => ({ latitude: h.lat, longitude: h.lng })),
      top: topHomes.map((h, i) => ({ rank: i + 1, n: h.n, name: h.name })),
      topLabel: last ? (last.lifeCharacter || last.persona || '') : '' });
  },
  onMarkerTap(e) { this.openByNumber(e.detail.markerId); },
  onCalloutTap(e) { this.openByNumber(e.detail.markerId); },
  openByNumber(n) {
    const h = HM.HOMES.find(x => x.n === Number(n));
    if (h) wx.navigateTo({ url: '/pages/home-detail/home-detail?id=' + h.id });
  },
  openHome(e) { wx.navigateTo({ url: '/pages/home-detail/home-detail?id=' + e.currentTarget.dataset.id }); },
  onSearch(e) { this.setData({ q: e.detail.value }); this.renderList(); },
  onBudget(e) { this.setData({ budgetIdx: Number(e.detail.value) }); this.renderList(); },
  onRoom(e) { this.setData({ roomIdx: Number(e.detail.value) }); this.renderList(); },
  onWalk(e) { this.setData({ walkIdx: Number(e.detail.value) }); this.renderList(); },
  toggleFavOnly() { this.setData({ favOnly: !this.data.favOnly }); this.renderList(); },
  toggleOnlyTop() { this.setData({ onlyTop: !this.data.onlyTop }); this.renderList(); },
  resetFilters() { this.setData({ q: '', budgetIdx: 0, roomIdx: 0, walkIdx: 0, favOnly: false, onlyTop: false }); this.renderList(); },
  toggleFav(e) { app.toggleFav(e.currentTarget.dataset.id); this.renderList(); },
  toggleLang() { app.setLang(this.data.lang === 'zh' ? 'en' : 'zh'); this.refresh(); },
  goLife() { wx.navigateTo({ url: '/pages/quiz-life/quiz-life' }); },
  goHome() { wx.navigateTo({ url: '/pages/quiz-home/quiz-home' }); },
  goResult() { wx.navigateTo({ url: '/pages/result/result' }); },
  goConsult() { wx.navigateTo({ url: '/pages/consult/consult' }); },
  onShareAppMessage() { return { title: this.data.T.appName, path: '/pages/index/index' }; }
});
