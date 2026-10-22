const app = getApp();
const LQ = require('../../utils/life-quiz.js');
const HM = require('../../utils/home-match.js');
const i18n = require('../../utils/i18n.js');
const ADVANCE_MS = 280;

/* 6 道生活情景题 + 2 步补充（校区、步行），全部单选、自动进入下一题 */
Page({
  data: { T: {}, step: -1, q: null, dots: [], selected: {}, isLast: false, progress: '', canNext: false },
  onLoad() {
    const lang = app.globalData.lang, T = i18n.dict(lang);
    const life = LQ.questions(lang), home = HM.questions(lang);
    const campus = home.find(q => q.id === 'campus'), walk = home.find(q => q.id === 'walk');
    this.questions = life.map(q => ({ kind: 'life', id: q.id, q: q.q, hint: '', opts: q.opts.map((o, i) => Object.assign({}, o, { id: String(i) })) }))
      .concat([{ kind: 'extra', id: 'campus', q: T.extraCampus, hint: campus.hint, opts: campus.opts },
               { kind: 'extra', id: 'walk', q: T.extraWalk, hint: walk.hint, opts: walk.opts }]);
    const saved = app.globalData.lifeAnswers || [];
    this.answers = { life: saved.slice(0, 6), extra: Object.assign({}, app.globalData.lifeExtra || {}) };
    this.setData({ T });
    wx.setNavigationBarTitle({ title: T.lifeQuiz });
  },
  onUnload() { clearTimeout(this.timer); },
  start() { this.go(0); },
  valueOf(i) { const q = this.questions[i]; return q.kind === 'life' ? (this.answers.life[i] != null ? String(this.answers.life[i]) : '') : (this.answers.extra[q.id] || ''); },
  go(step) {
    clearTimeout(this.timer);
    const v = this.valueOf(step), T = this.data.T;
    this.setData({ step, q: this.questions[step], selected: v ? { [v]: true } : {}, canNext: !!v,
      isLast: step === this.questions.length - 1, dots: this.questions.map((_, i) => i <= step),
      progress: i18n.fmt(T.question, { i: step + 1, n: this.questions.length }) });
  },
  pick(e) {
    const id = e.currentTarget.dataset.id, q = this.data.q, step = this.data.step;
    if (q.kind === 'life') this.answers.life[step] = Number(id); else this.answers.extra[q.id] = id;
    app.globalData.lifeAnswers = this.answers.life; app.globalData.lifeExtra = this.answers.extra; app.save();
    this.setData({ selected: { [id]: true }, canNext: true });
    this.timer = setTimeout(() => this.next(), ADVANCE_MS);
  },
  next() { if (!this.data.canNext) return; if (this.data.isLast) return this.finish(); this.go(this.data.step + 1); },
  back() { if (this.data.step > 0) this.go(this.data.step - 1); else this.setData({ step: -1 }); },
  finish() {
    clearTimeout(this.timer);
    const lang = app.globalData.lang, r = LQ.run(this.answers.life, this.answers.extra, lang);
    if (!r) { wx.showToast({ title: '请先答完全部题目', icon: 'none' }); return; }
    app.globalData.lastResult = { source: 'life', ids: r.match.ids, persona: '', lifeCharacter: r.character.name,
      lifeAnswers: this.answers.life.slice(), extra: this.answers.extra, answers: r.mapAnswers, at: Date.now() };
    app.save();
    wx.redirectTo({ url: '/pages/result/result' });
  }
});
