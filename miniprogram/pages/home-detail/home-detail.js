const app = getApp();
const HM = require('../../utils/home-match.js');
const i18n = require('../../utils/i18n.js');

const NEAR = [['super', '🛒', 'rowSuper'], ['topup', '🧺', 'rowTopup'], ['cafe', '☕', 'cafe'], ['lib', '📚', 'rowLib'], ['park', '🌳', 'rowPark'], ['gym', '🏋️', 'rowGym'], ['asianGroc', '🥢', 'asianGroc']];
const CNT = [['rest10', '🍽️', 'rowRest10'], ['cafe10', '☕', 'rowCafe10'], ['asian10', '🍜', 'rowAsian10'], ['night10', '🪩', 'rowNight10']];
const EXTRA = { zh: { cafe: '最近咖啡馆', asianGroc: '最近亚洲食品店' }, en: { cafe: 'Nearest café', asianGroc: 'Nearest Asian grocery' } };

Page({
  data: { T: {}, h: null, fav: false, inCompare: false, markers: [], nearby: [], counts: [], walks: [], price: '', text: '', area: '', rank: 0 },
  onLoad(q) {
    this.id = q.id;
    this.render();
  },
  render() {
    const lang = app.globalData.lang, T = i18n.dict(lang), h = HM.byId(this.id);
    if (!h) { wx.showToast({ title: 'Not found', icon: 'none' }); return; }
    const label = k => T[k] || EXTRA[lang === 'en' ? 'en' : 'zh'][k];
    const nearby = NEAR.filter(([k]) => h.hm.near[k]).map(([k, ico, l]) => {
      const x = h.hm.near[k], name = x.p.n === 'Green-space boundary reference point' ? (lang === 'en' ? 'Green-space edge' : '绿地边界参考点') : x.p.n;
      return { k, ico, label: label(l), value: (name ? name + ' · ' : '') + i18n.fmt(T.minutes, { n: x.m }) };
    });
    const counts = CNT.map(([k, ico, l]) => ({ k, ico, label: label(l), value: i18n.fmt(T.places, { n: h.hm.cnt[k] || 0 }) }));
    const walks = [['uol', h.uol], ['ljmu', h.ljmu], ['lime', h.lime], ['centre', h.centre]].map(([k, v]) => ({ k, label: T[k], value: i18n.fmt(T.minutes, { n: v }) }));
    const last = app.globalData.lastResult, rank = last ? last.ids.indexOf(h.id) + 1 : 0;
    wx.setNavigationBarTitle({ title: h.n + ' · ' + h.name });
    this.setData({ T, h, rank, fav: app.globalData.favorites.includes(h.id), inCompare: app.globalData.compare.includes(h.id),
      text: lang === 'en' ? h.text : (h.textZh || h.text), area: lang === 'en' ? h.area : h.areaZh,
      price: HM.priceText(h, lang), nearby, counts, walks,
      rating: h.rr ? h.rr.toFixed(1) + '★ · ' + i18n.fmt(T.reviews, { n: h.rn || 0 }) : '',
      markers: [{ id: h.n, latitude: h.lat, longitude: h.lng, iconPath: '/images/pin-top.png', width: 30, height: 40,
        callout: { content: h.n + ' ' + h.name, display: 'ALWAYS', fontSize: 12, bgColor: '#fffaf0', borderColor: '#3b2a1a', borderWidth: 1, borderRadius: 8, padding: 4, color: '#3b2a1a' } }] });
  },
  toggleFav() { this.setData({ fav: app.toggleFav(this.id) }); },
  toggleCompare() {
    const c = app.globalData.compare, i = c.indexOf(this.id);
    if (i >= 0) c.splice(i, 1); else { c.push(this.id); if (c.length > 3) c.shift(); }
    app.save(); this.setData({ inCompare: i < 0 });
  },
  openCompare() {
    const ids = app.globalData.compare.length >= 2 ? app.globalData.compare : [this.id].concat(((app.globalData.lastResult || {}).ids || []).filter(x => x !== this.id)).slice(0, 3);
    wx.navigateTo({ url: '/pages/compare/compare?ids=' + ids.join(',') });
  },
  navigate() { const h = this.data.h; wx.openLocation({ latitude: h.lat, longitude: h.lng, name: h.name, address: h.addr, scale: 16 }); },
  copyAddr() { wx.setClipboardData({ data: this.data.h.name + ', ' + this.data.h.addr + ', Liverpool' }); },
  consult() { wx.navigateTo({ url: '/pages/consult/consult?homeId=' + this.id }); },
  onShareAppMessage() { const h = this.data.h; return { title: h.n + ' · ' + h.name, path: '/pages/home-detail/home-detail?id=' + h.id }; }
});
