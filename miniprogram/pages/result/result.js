const app = getApp();
const HM = require('../../utils/home-match.js');
const LQ = require('../../utils/life-quiz.js');
const i18n = require('../../utils/i18n.js');

Page({
  data: { T: {}, ready: false, source: '', title: '', stamp: '', desc: '', quote: '', keywords: [], day: [], picks: [], eligible: 0 },
  onShow() {
    const lang = app.globalData.lang, T = i18n.dict(lang), last = app.globalData.lastResult;
    this.setData({ T });
    wx.setNavigationBarTitle({ title: T.resultTitle });
    if (!last) { this.setData({ ready: false }); return; }
    let m, extra = {};
    if (last.source === 'life') {
      const r = LQ.run(last.lifeAnswers, last.extra, lang);
      if (!r) return;
      m = r.match;
      extra = { title: r.character.name, stamp: r.character.icons, desc: r.character.description, quote: r.character.quote,
        keywords: r.character.keywords, day: r.character.day, color: r.character.color };
      last.lifeCharacter = r.character.name;
    } else {
      m = HM.match(last.answers, { lang });
      extra = { title: m.persona.title, stamp: m.persona.stamp, desc: m.persona.desc, quote: '', keywords: [], day: [], color: '#fffaf0' };
      last.persona = m.persona.title;
    }
    last.ids = m.ids; app.save();
    this.setData(Object.assign({ ready: true, source: last.source, picks: m.picks.map(p => Object.assign({}, p, { areaText: lang === 'en' ? p.area : p.areaZh })),
      eligible: m.eligible }, extra));
  },
  compare() { wx.navigateTo({ url: '/pages/compare/compare?ids=' + this.data.picks.map(p => p.id).join(',') }); },
  onMap() { wx.reLaunch({ url: '/pages/index/index' }); },
  openHome(e) { wx.navigateTo({ url: '/pages/home-detail/home-detail?id=' + e.currentTarget.dataset.id }); },
  consult() { wx.navigateTo({ url: '/pages/consult/consult' }); },
  retake() { wx.redirectTo({ url: this.data.source === 'life' ? '/pages/quiz-life/quiz-life' : '/pages/quiz-home/quiz-home' }); },
  goLife() { wx.redirectTo({ url: '/pages/quiz-life/quiz-life' }); },
  onShareAppMessage() { return { title: this.data.title || this.data.T.appName, path: '/pages/index/index' }; }
});
