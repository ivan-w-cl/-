const app = getApp();
const HM = require('../../utils/home-match.js');
const i18n = require('../../utils/i18n.js');
const { rows } = require('../../utils/compare.js');


Page({
  data: { T: {}, homes: [], rows: [] },
  onLoad(q) {
    const lang = app.globalData.lang, T = i18n.dict(lang);
    let ids = (q.ids ? decodeURIComponent(q.ids).split(',') : (app.globalData.lastResult || {}).ids || []).slice(0, 3);
    const homes = HM.byIds(ids);
    this.ids = homes.map(h => h.id);
    wx.setNavigationBarTitle({ title: T.cmpTitle });
    this.setData({ T, homes: homes.map(h => ({ id: h.id, n: h.n, name: h.name })), rows: rows(homes, lang) });
  },
  openHome(e) { wx.navigateTo({ url: '/pages/home-detail/home-detail?id=' + e.currentTarget.dataset.id }); },
  consult() { wx.navigateTo({ url: '/pages/consult/consult?ids=' + this.ids.join(',') }); }
});
