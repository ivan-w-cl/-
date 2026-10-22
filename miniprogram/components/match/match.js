/* 生活选房（网页版 home-match.js 的小程序版）：开场介绍 → 8 道选择题（单选点了就下一题，多选选满自动下一题）→
   底部的选房卡：生活风格、推荐 3 处、为什么推荐、需要权衡、参考价、一眼对比；地图上标出推荐、10 分钟圈和周边地点。
   题目、打分、文案都直接来自网页（utils/home-match-core.js，scripts/export-match.cjs 生成）。网页这一部分只有中文，这里也一样。 */
const H = require('../../utils/homes.js');
const createCore = require('../../utils/home-match-core.js');
const scene = require('../../data/scene.js');
const proj = require('../../map/proj.js');
const { t } = require('../../utils/i18n.js');
const createFun = require('../../utils/fun-quizzes-core.js');
const createShare = require('../../utils/share-cards-core.js');
const KEY = 'lsm-home-match-answers-v1';
const markerOf = id => scene.markers.find(m => m.id === id);

Component({
  properties: { lang: { type: String, value: 'zh' }, filterIds: { type: Object, value: null }, subject: { type: Object, value: null }, padTop: { type: Number, value: 16 } },
  data: { open: false, step: -1, q: null, dots: [], canNext: false, hasLast: false, active: false, mini: false, res: null, selected: 0 },
  lifetimes: {
    attached() {
      this.core = createCore(H.HOMES, { filter: h => !this.data.filterIds || !!this.data.filterIds[h.id], areaOf: a => H.D.areaNames.zh[a] || a });
      let saved = {}; try { saved = wx.getStorageSync(KEY) || {}; } catch (e) { /* 忽略 */ }
      this.core.state.answers = this.core.cleanAnswers(saved);
      this.fun = createFun(H.HOMES, () => this.data.lang); this.paintFq();
    }
  },
  observers: {
    lang() { if (this.fun) this.paintFq(); },
    'filterIds, subject'() { if (!this.core) return; this.core.setSubject(this.data.subject ? { name: this.data.subject.name } : null); if (this.data.active) this.showResults(true); }
  },
  methods: {
    /* ---------- 题目 ---------- */
    /* 「更多好玩的测试」入口和「生成分享卡片」按钮的文字（网页 fun-quizzes.js / share-cards.js） */
    paintFq() {
      const F = this.fun, k = F.UI[F.L()], T = createShare({}).T[F.L()];
      this.setData({ fq: { more: k.more, make: T.make, list: Object.keys(F.QUIZZES).map(id => ({ id, label: `${F.QUIZZES[id].emoji} ${F.tx(F.QUIZZES[id].kicker)}` })) } });
    },
    openFun(e) { this.closeQuiz(); this.triggerEvent('fun', { id: e.currentTarget.dataset.id }); },
    funHub() { this.triggerEvent('fun', { id: '' }); },
    /* 网页 share-cards.js readCard()：分享卡片的内容取自选房卡 */
    makeShare() {
      const r = this.result, p = this.core.persona(), en = this.data.lang === 'en'; if (!r || !r.picks.length) return;
      const picks = r.picks.slice(0, 3).map(({ h }) => { const v = [h.pe, h.ps, h.plo].map(Number).filter(x => Number.isFinite(x) && x > 0);
        return { name: h.name, n: h.n, id: h.id, price: v.length ? '£' + Math.min(...v) + (en ? '/wk' : '/周起') : '', walk: en ? `UoL ~${h.uol} min` : `步行到利大约 ${h.uol} 分钟` }; });
      this.triggerEvent('share', { stamp: p.stamp || '🏠', title: p.title, desc: p.desc, picks });
    },
    openQuiz(step) {
      const st = Number.isInteger(step) ? step : -1;
      this.setData({ open: true, step: st, hasLast: this.core.complete() }); this.draw();
    },
    draw() {
      clearTimeout(this.auto);
      const step = this.data.step, Q = this.core.QUESTIONS;
      if (step < 0) return this.setData({ q: null });
      const q = Q[step], v = this.core.state.answers[q.id];
      const on = c => (q.multi ? (v || []).includes(c) : v === c);
      this.setData({ q: { id: q.id, text: q.q, hint: q.hint || '', multi: !!q.multi, opts: q.opts.map(([c, e, label, note]) => ({ c, e, label, note, on: on(c) })),
        stepText: `第 ${step + 1} / ${Q.length} 题`, nextText: step === Q.length - 1 ? '生成我的选房卡' : '下一步' },
        dots: Q.map((_, i) => i <= step), canNext: this.core.answered(q) });
    },
    start() { this.setData({ step: 0 }); this.draw(); },
    back() { if (this.data.step > 0) { this.setData({ step: this.data.step - 1 }); this.draw(); } else { this.setData({ step: -1 }); this.draw(); } },
    next() { const q = this.core.QUESTIONS[this.data.step]; if (!this.core.answered(q)) return; this.advance(); },
    advance() { if (this.data.step < this.core.QUESTIONS.length - 1) { this.setData({ step: this.data.step + 1 }); this.draw(); } else this.showResults(); },
    pickOpt(e) {
      const q = this.core.QUESTIONS[this.data.step], c = e.currentTarget.dataset.c, a = this.core.state.answers;
      let full = true;
      if (q.multi) {
        let sel = (a[q.id] || []).slice();
        if (c === 'any') sel = sel.includes('any') ? [] : ['any'];
        else if (sel.includes(c)) sel = sel.filter(x => x !== c);
        else { sel = sel.filter(x => x !== 'any'); if (sel.length < q.max) sel.push(c); }
        a[q.id] = sel; full = sel.includes('any') || sel.length >= q.max;
      } else a[q.id] = c;
      try { wx.setStorageSync(KEY, a); } catch (err) { /* 忽略 */ }
      this.draw();
      if (!full) return;
      const step = this.data.step;
      this.auto = setTimeout(() => { if (this.data.step === step && this.data.open) this.advance(); }, q.multi ? 450 : 280);
    },
    closeQuiz() { clearTimeout(this.auto); this.setData({ open: false }); this.triggerEvent('closequiz'); },
    browse() { this.closeQuiz(); },
    bySubject() { this.closeQuiz(); this.setData({ mini: true }); this.triggerEvent('subject'); },
    lastResults() { this.showResults(); },

    /* ---------- 选房卡 ---------- */
    showResults(keepView) {
      if (!this.core.complete()) { this.setData({ step: this.core.QUESTIONS.findIndex(q => !this.core.answered(q)), open: true }); this.draw(); return; }
      const core = this.core, r = core.matchHomes(), prof = core.persona(); this.result = r;
      const picks = r.picks.map((e, i) => ({ i, id: e.h.id, n: e.h.n, name: e.h.name, top: i === 0, kicker: `${i === 0 ? '优先看看这一处' : '也值得放进备选'} · 地图编号 ${e.h.n}`,
        meta: `${H.D.areaNames.zh[e.h.area] || e.h.area} · ${e.h.addr}`, good: e.good.map(g => ({ ico: core.metrics[g.key].ico, text: core.metrics[g.key].good(e.h) })),
        trade: e.trade ? `需要权衡：${core.metrics[e.trade.key].bad(e.h)}` : '', price: core.priceText(e.h), sold: !!e.h.pso }));
      const L = this.data.lang;
      const cols = r.picks.map((e, i) => ({ i: i + 1, top: i === 0, name: e.h.name, price: e.h.plo ? t(L, 'pcFrom', { p: e.h.plo }) : t(L, 'pcNoPrice'), uol: t(L, 'pcUol', { m: e.h.uol }), rate: e.h.rn ? `${Number(e.h.rr).toFixed(1)}★` : '' }));
      this.setData({ open: false, active: true, mini: keepView ? this.data.mini : false, selected: 0,
        res: { stamp: prof.stamp, title: prof.title, desc: prof.desc, scope: core.resultScope(), picks, walkMid: core.state.answers.walk === 'mid', cols,
          cmpH: t(L, 'pcH', { n: cols.length }), cmpGo: '⚖️ ' + t(L, 'pcGo', { n: cols.length }), total: H.HOMES.length } });
      this.select(0, keepView);
    },
    /* 地图上：推荐（金色编号，第一名红色），选中的那处画 10 分钟圈、到周边地点的连线 */
    select(i, keepView) {
      const e = this.result && this.result.picks[i];
      const picks = {}; (this.result ? this.result.picks : []).forEach((p, j) => { picks[p.h.id] = j === 0 ? 'top' : 'pick'; });
      if (!e) return this.triggerEvent('map', { picks, layer: null, fit: null });
      this.setData({ selected: i });
      const m = markerOf(e.h.id), c = e.h.hm.r, R = 10 * 80 / 13, ring = [];
      for (let s = 0; s <= 64; s++) { const a = s / 64 * Math.PI * 2; ring.push(proj.W(c[0] + Math.cos(a) * R, c[1] + Math.sin(a) * R)); }
      const spots = [];
      e.good.forEach(g => { const mt = this.core.metrics[g.key], near = mt.spot && e.h.hm.near[mt.spot]; if (near && near.p.r && !spots.some(s => s.near === near)) spots.push({ near, emoji: mt.ico }); });
      const layer = { ring, links: [], spots: [], glow: [m.x, m.y] }, pts = ring.slice();
      spots.slice(0, 4).forEach(sp => {
        const pt = proj.W(sp.near.p.r[0], sp.near.p.r[1]); pts.push(pt);
        layer.links.push([m.a[0], m.a[1], pt[0], pt[1]]);
        const n = sp.near.p.n; layer.spots.push({ x: pt[0], y: pt[1], emoji: sp.emoji, label: n ? (n.length > 26 ? n.slice(0, 25) + '…' : n) : '' });
      });
      this.triggerEvent('map', { picks, layer, fit: keepView ? null : pts });
    },
    tapCard(e) { this.select(Number(e.currentTarget.dataset.i)); },
    view(e) { this.setData({ mini: true }); this.select(Number(e.currentTarget.dataset.i)); },
    card(e) { const i = Number(e.currentTarget.dataset.i); this.setData({ mini: true }); this.select(i); this.triggerEvent('card', { id: this.result.picks[i].h.id }); },
    ask(e) { this.triggerEvent('ask', { id: this.result.picks[Number(e.currentTarget.dataset.i)].h.id }); },
    compareAll() { this.triggerEvent('compare', { ids: this.result.picks.map(p => p.h.id) }); },
    edit() { this.openQuiz(0); },
    again() { this.core.state.answers = {}; try { wx.removeStorageSync(KEY); } catch (e) { /* 忽略 */ } this.exit(); this.openQuiz(0); },
    resetFilters() { this.triggerEvent('resetfilters'); },
    subjectAgain() { this.setData({ mini: true }); this.triggerEvent('subject'); },
    copy() {
      const r = this.result, p = this.core.persona(); if (!r || !r.picks.length) return;
      const text = `我的利物浦生活选房卡：${p.title}\n${p.desc}\n优先看看：${r.picks[0].h.name}${r.picks.length > 1 ? '\n其他备选：' + r.picks.slice(1).map(x => x.h.name).join('、') : ''}\n这是生活偏好参考，不代表实时空房。来看看你的选择：微信搜索「利物浦学生住宿地图」小程序`;
      wx.setClipboardData({ data: text, success: () => wx.showToast({ title: '已复制，可以粘贴给朋友。', icon: 'none' }) });
    },
    toggleMini() { this.setData({ mini: !this.data.mini }); this.select(this.data.selected, false); },
    exit() { this.setData({ active: false, res: null }); this.result = null; this.triggerEvent('map', null); this.triggerEvent('exit'); },
    noop() {}
  }
});
