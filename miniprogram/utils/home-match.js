/* 小程序端的找房匹配 API（纯 CommonJS，无 DOM、无 wx 依赖，可在 Node 中测试）。
   打分逻辑来自 home-match-core.js（自动从网页版截取），这里只做数据整形。 */
'use strict';
var HOMES = require('./data/homes.js');
var createCore = require('./home-match-core.js');
var HomeTools = require('./home-tools.js');

function cloneHomes() {
  return HOMES.map(function (h) { return Object.assign({}, h, { hm: { r: h.hm.r, cnt: h.hm.cnt, near: h.hm.near } }); });
}
function byId(id) { for (var i = 0; i < HOMES.length; i++) if (HOMES[i].id === id) return HOMES[i]; return null; }
function byIds(ids) { return (ids || []).map(byId).filter(Boolean); }

function questions(lang) {
  var c = createCore(HOMES, { lang: lang });
  return c.QUESTIONS.map(function (q) {
    var d = c.displayQuestion(q);
    return { id: q.id, multi: !!q.multi, max: q.max || 1, q: d.q, hint: d.hint || '',
      opts: d.opts.map(function (o) { return { id: o[0], emoji: o[1], label: o[2], detail: o[3] }; }) };
  });
}
function cleanAnswers(answers) { return createCore(HOMES).cleanAnswers(answers); }
function isComplete(answers) {
  var c = createCore(HOMES), a = c.cleanAnswers(answers);
  return c.QUESTIONS.every(function (q) { return q.multi ? Array.isArray(a[q.id]) && a[q.id].length > 0 : !!a[q.id]; });
}
function priceText(home, lang) { return createCore(HOMES, { lang: lang }).priceText(home); }

/* answers: 与网页版相同的 8 题答案对象；options.filters 可选（与网页版列表筛选同义） */
function match(answers, options) {
  options = options || {};
  var homes = cloneHomes();
  var filters = options.filters, favorites = options.favorites || new Set();
  var c = createCore(homes, { lang: options.lang,
    filter: filters ? function (h) { return HomeTools.matchesHome(h, filters, favorites); } : null });
  c.state.answers = c.cleanAnswers(answers);
  var r = c.matchHomes();
  var picks = r.picks.map(function (e, i) {
    return { rank: i + 1, id: e.h.id, n: e.h.n, name: e.h.name, area: e.h.area, areaZh: e.h.areaZh,
      score: e.score, campusMin: e.h.hm.campus, price: c.priceText(e.h),
      reasons: e.good.map(function (g) { return { key: g.key, ico: c.metrics[g.key].ico, text: c.metrics[g.key].good(e.h) }; }),
      trade: e.trade ? { key: e.trade.key, ico: c.metrics[e.trade.key].ico, text: c.metrics[e.trade.key].bad(e.h) } : null,
      historicalUnavailable: !!e.h.pso };
  });
  return { picks: picks, ids: picks.map(function (p) { return p.id; }), persona: c.persona(),
    eligible: r.eligible, filterCount: r.filterCount, answers: c.state.answers };
}
module.exports = { HOMES: HOMES, byId: byId, byIds: byIds, questions: questions, cleanAnswers: cleanAnswers,
  isComplete: isComplete, priceText: priceText, match: match, matchesHome: HomeTools.matchesHome };
