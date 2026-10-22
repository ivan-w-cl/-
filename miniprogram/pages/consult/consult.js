const app = getApp();
const HM = require('../../utils/home-match.js');
const i18n = require('../../utils/i18n.js');
const { buildSessionFrom } = require('../../utils/consult.js');

Page({
  data: { T: {}, homes: [], quiz: '', sessionFrom: '{}', sendTitle: '', sendPath: '' },
  onLoad(q) {
    const lang = app.globalData.lang, T = i18n.dict(lang), last = app.globalData.lastResult;
    let ids = [];
    if (q.homeId) ids = [q.homeId];
    else if (q.ids) ids = decodeURIComponent(q.ids).split(',');
    else if (last) ids = last.ids;
    const homes = HM.byIds(ids).slice(0, 3);
    const ctx = buildSessionFrom({ homeId: q.homeId || (homes[0] && homes[0].id) || '', homes, last, lang });
    wx.setNavigationBarTitle({ title: T.consultTitle });
    this.setData({ T, homes: homes.map(h => ({ id: h.id, n: h.n, name: h.name })), quiz: ctx.quizSummary,
      sessionFrom: ctx.json,
      sendTitle: homes.length ? (lang === 'en' ? 'Ask about: ' : '咨询：') + homes.map(h => h.n + ' ' + h.name).join('、') : T.consultTitle,
      sendPath: homes.length ? '/pages/home-detail/home-detail?id=' + homes[0].id : '/pages/index/index' });
  },
  onContact(e) { /* 从客服会话返回时触发；e.detail.path / query 为客服消息里小程序卡片的路径 */
    const p = e.detail && e.detail.path;
    if (p) wx.navigateTo({ url: '/' + p.replace(/^\//, '') + (e.detail.query ? '?' + Object.keys(e.detail.query).map(k => k + '=' + e.detail.query[k]).join('&') : '') });
  }
});
