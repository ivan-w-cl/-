/* 留学人格测试（网页版 fun-quizzes.js 的小程序版）：4 套小测试，答题卡和结果卡用生活选房同一套样式，
   测完在地图上标出推荐的 3 处公寓，可以生成分享卡片；「留学搭子」可以邀请朋友测合拍度（分享给微信好友，朋友点开直接进这套测试）。
   题目、类型、打分、文案都来自网页（utils/fun-quizzes-core.js，scripts/export-fun.cjs 生成）。 */
const H = require('../../utils/homes.js');
const createFun = require('../../utils/fun-quizzes-core.js');
const scene = require('../../data/scene.js');
const share = require('../../utils/share-link.js');
const KEY = 'lsm-fun-quiz-v1';
const markerOf = id => scene.markers.find(m => m.id === id);

Component({
  properties: { lang: { type: String, value: 'zh' }, padTop: { type: Number, value: 16 } },
  data: { open: false, mode: 'hub', k: {}, quizzes: [], intro: null, q: null, dots: [], canNext: false, active: false, mini: false, res: null, selected: 0 },
  lifetimes: { attached() { this.F = createFun(H.HOMES, () => this.data.lang); this.duo = null; } },
  observers: { lang() { if (this.data.open) this.redraw(); else if (this.data.active && this.run) this.result(true); } },
  methods: {
    saved() { try { return wx.getStorageSync(KEY) || {}; } catch (e) { return {}; } },
    remember(id, answers) { try { const v = this.saved(); v[id] = answers; wx.setStorageSync(KEY, v); } catch (e) { /* 忽略 */ } },
    k() { return this.F.UI[this.F.L()]; },
    redraw() { if (this.data.mode === 'hub') this.hub(); else if (this.data.mode === 'intro') this.intro(this.run.id); else this.question(); },
    /* ---------- 答题弹窗 ---------- */
    hub() {
      const F = this.F, k = this.k();
      this.setData({ open: true, mode: 'hub', k, quizzes: Object.keys(F.QUIZZES).map(id => ({ id, e: F.QUIZZES[id].emoji, title: F.tx(F.QUIZZES[id].title), blurb: F.tx(F.QUIZZES[id].blurb) })) });
    },
    /* 链接 / 分享卡片的小程序码带了 ?quiz=buddy&duo=food 时，先记住朋友的类型 */
    setDuo(quiz, type) { const q = this.F.QUIZZES[quiz]; this.duo = q && q.types[type] ? { quiz, type } : null; },
    intro(id) {
      const F = this.F, q = F.QUIZZES[id], k = this.k(); if (!q) return;
      this.run = { id, step: -1, answers: [] };
      const s = this.saved()[id], has = Array.isArray(s) && s.length === q.questions.length;
      const duo = this.duo && this.duo.quiz === id && q.types[this.duo.type] ? F.fmt(k.duoIntro, { name: F.tx(q.types[this.duo.type].name) }) : '';
      this.setData({ open: true, mode: 'intro', k, intro: { kicker: F.tx(q.kicker), title: F.tx(q.title), blurb: F.tx(q.blurb), duo, has, note: `${k.intro} ${k.note}`,
        types: Object.values(q.types).map(t => `${t.stamp} ${F.tx(t.name)}`) } });
    },
    question() {
      const F = this.F, q = F.QUIZZES[this.run.id], k = this.k(), cur = q.questions[this.run.step], n = q.questions.length, v = this.run.answers[this.run.step];
      this.setData({ mode: 'q', k, q: { text: F.tx(cur.q), step: F.fmt(k.question, { i: this.run.step + 1, n }), next: this.run.step === n - 1 ? k.finish : k.next,
        opts: cur.opts.map((o, i) => ({ i, e: o.e, t: F.tx(o.t), on: v === i })) }, dots: q.questions.map((_, i) => i <= this.run.step), canNext: v != null });
    },
    pickQuiz(e) { const id = e.currentTarget.dataset.id; if (id === 'home') { this.close(); this.triggerEvent('home'); } else this.intro(id); },
    start() { this.run.step = 0; this.question(); },
    last() { this.run.answers = this.saved()[this.run.id].slice(); this.close(); this.result(); },
    back() { clearTimeout(this.adv); if (this.run.step > 0) { this.run.step--; this.question(); } else this.intro(this.run.id); },
    next() {
      clearTimeout(this.adv); const q = this.F.QUIZZES[this.run.id]; if (this.run.answers[this.run.step] == null) return;
      if (this.run.step < q.questions.length - 1) { this.run.step++; this.question(); } else { this.remember(this.run.id, this.run.answers); this.close(); this.result(); }
    },
    pickOpt(e) { this.run.answers[this.run.step] = Number(e.currentTarget.dataset.i); this.question(); clearTimeout(this.adv); this.adv = setTimeout(() => this.next(), 280); },   // 点选项自动进入下一题
    close() { clearTimeout(this.adv); this.setData({ open: false }); },
    /* ---------- 结果卡 ---------- */
    result(keepView) {
      const F = this.F, id = this.run.id, q = F.QUIZZES[id], k = this.k(), typeId = F.typeOf(q, this.run.answers), t = q.types[typeId], L = F.L();
      let picks = F.recommend(t.w), duo = null, f = null;
      if (q.duo && this.duo && this.duo.quiz === id && q.types[this.duo.type]) {
        f = q.types[this.duo.type];
        duo = { title: k.duoTitle, score: q.match[[typeId, this.duo.type].sort().join('-')] || 75, pair: `${t.stamp} ${F.tx(t.name)} × ${f.stamp} ${F.tx(f.name)}` };
        picks = F.recommend(F.blend(t.w, f.w));
      }
      this.picks = picks; this.typeId = typeId;
      const price = h => { const p = F.minPrice(h); return p ? (L === 'en' ? `From £${p}/week (recorded)` : `£${p}/周起（历史参考价）`) : ''; };
      const link = share.link({ quiz: id, duo: q.duo ? typeId : '', lang: L });
      this.share = { kicker: F.tx(q.kicker), stamp: t.stamp, title: F.tx(t.name), desc: F.tx(t.tag) + (L === 'en' ? '. ' : '。') + F.tx(t.desc),
        picks: picks.map(({ h }) => ({ name: h.name, n: h.n, id: h.id, price: F.minPrice(h) ? (L === 'en' ? `£${F.minPrice(h)}/wk` : `£${F.minPrice(h)}/周起`) : '', walk: L === 'en' ? `UoL ~${h.uol} min` : `步行到利大约 ${h.uol} 分钟` })),
        link, scan: k.scan, shareText: F.fmt(q.duo ? k.inviteText : k.shareText, { name: F.tx(t.name) }), quiz: id, duo: q.duo ? typeId : '' };
      this.setData({ active: true, mini: keepView ? this.data.mini : false, k,
        res: { head: F.tx(q.kicker), stamp: t.stamp, tag: F.tx(t.tag), name: F.tx(t.name), desc: F.tx(t.desc), traits: F.tx(t.traits), tip: t.tip ? F.tx(t.tip) : '', duo,
          picksH: f ? k.duoHomes : k.picks, isDuo: !!q.duo, invite: q.duo ? '🤝 ' + k.invite : k.copyLink, shareTitle: this.share.shareText,
          picks: picks.map(({ h, why }, i) => ({ i, id: h.id, top: i === 0, kicker: `${i === 0 ? k.first : k.also} · ${k.no} ${h.n}`, name: h.name, addr: h.addr || '', why, price: price(h) })) } });
      this.triggerEvent('result');   // 页面先收起生活选房卡（两张卡不同时出现），再标地图
      this.select(0, keepView);
    },
    /* 地图上标出推荐（和生活选房一样：第一名红色、其他金色），并把这 3 处放进屏幕里 */
    select(i, keepView) {
      this.setData({ selected: i });
      const picks = {}; this.picks.forEach((p, j) => { picks[p.h.id] = j === 0 ? 'top' : 'pick'; });
      const pts = this.picks.map(p => markerOf(p.h.id)).filter(Boolean).map(m => [m.x, m.y]);
      const pad = 90, fit = keepView ? null : pts.map(p => [p[0] - pad, p[1] - pad]).concat(pts.map(p => [p[0] + pad, p[1] + pad]));
      this.triggerEvent('map', { picks, layer: null, fit });
    },
    tapCard(e) { this.setData({ selected: Number(e.currentTarget.dataset.i) }); },
    view(e) { const i = Number(e.currentTarget.dataset.i); this.setData({ selected: i, mini: true }); this.triggerEvent('card', { id: this.picks[i].h.id }); },
    card(e) { const i = Number(e.currentTarget.dataset.i); this.setData({ mini: true }); this.triggerEvent('card', { id: this.picks[i].h.id }); },
    ask(e) { this.triggerEvent('ask', { id: this.picks[Number(e.currentTarget.dataset.i)].h.id }); },
    makeShare() { this.triggerEvent('share', this.share); },
    /* 不是「搭子」测试时：复制分享文案（网页是复制链接；小程序里朋友搜小程序名或扫分享卡片上的码进来） */
    copy() { const s = this.share; wx.setClipboardData({ data: s.shareText + s.link, success: () => wx.showToast({ title: this.k().copied, icon: 'none' }) }); },
    again() { const id = this.run.id; this.exit(); this.intro(id); },
    more() { this.exit(); this.hub(); },
    toggleMini() { this.setData({ mini: !this.data.mini }); },
    exit() { if (!this.data.active) return; this.setData({ active: false, res: null }); this.picks = []; this.triggerEvent('map', null); },
    noop() {}
  }
});
