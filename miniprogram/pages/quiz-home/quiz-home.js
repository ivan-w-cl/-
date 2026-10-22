const app = getApp();
const HM = require('../../utils/home-match.js');
const i18n = require('../../utils/i18n.js');
const ADVANCE_MS = 280;

Page({
  data: { T: {}, step: -1, total: 8, q: null, dots: [], selected: {}, canNext: false, isLast: false, progress: '', hasSaved: false },
  onLoad() {
    const lang = app.globalData.lang;
    this.questions = HM.questions(lang);
    this.answers = HM.cleanAnswers(app.globalData.homeAnswers || {});
    this.setData({ T: i18n.dict(lang), total: this.questions.length, hasSaved: HM.isComplete(this.answers) });
    wx.setNavigationBarTitle({ title: i18n.dict(lang).homeQuiz });
  },
  onUnload() { clearTimeout(this.timer); },
  start() { this.go(0); },
  go(step) {
    clearTimeout(this.timer);
    const q = this.questions[step], v = this.answers[q.id], T = this.data.T;
    const selected = {};
    (q.multi ? (v || []) : (v ? [v] : [])).forEach(id => { selected[id] = true; });
    this.setData({ step, q, selected, isLast: step === this.questions.length - 1,
      canNext: q.multi ? !!(v && v.length) : !!v,
      dots: this.questions.map((_, i) => i <= step),
      progress: i18n.fmt(T.question, { i: step + 1, n: this.questions.length }) });
  },
  pick(e) {
    const id = e.currentTarget.dataset.id, q = this.data.q;
    if (q.multi) {
      let cur = (this.answers[q.id] || []).slice();
      if (id === 'any') cur = cur.includes('any') ? [] : ['any'];
      else {
        cur = cur.filter(x => x !== 'any');
        if (cur.includes(id)) cur = cur.filter(x => x !== id);
        else if (cur.length < q.max) cur.push(id);
        else { wx.showToast({ title: (app.globalData.lang === 'en' ? 'Up to ' : '最多选 ') + q.max, icon: 'none' }); return; }
      }
      this.answers[q.id] = cur;
      const selected = {}; cur.forEach(x => { selected[x] = true; });
      this.setData({ selected, canNext: cur.length > 0 });
      this.persist();
      return;
    }
    this.answers[q.id] = id;
    this.setData({ selected: { [id]: true }, canNext: true });
    this.persist();
    // 单选：与网页版一致，选中后自动进入下一题
    this.timer = setTimeout(() => this.next(), ADVANCE_MS);
  },
  persist() { app.globalData.homeAnswers = this.answers; app.save(); },
  next() {
    if (!this.data.canNext) return;
    if (this.data.isLast) return this.finish();
    this.go(this.data.step + 1);
  },
  back() { if (this.data.step > 0) this.go(this.data.step - 1); else this.setData({ step: -1 }); },
  finish() {
    clearTimeout(this.timer);
    const lang = app.globalData.lang, r = HM.match(this.answers, { lang });
    app.globalData.lastResult = { source: 'home', ids: r.ids, persona: r.persona.title, lifeCharacter: '', answers: r.answers, at: Date.now() };
    app.save();
    wx.redirectTo({ url: '/pages/result/result' });
  },
  showSaved() { this.finish(); }
});
