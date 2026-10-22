/* 页面共用的展示整形（纯函数） */
'use strict';
var i18n = require('./i18n.js');
function homeCard(h, lang, fav) {
  var T = i18n.dict(lang), price = h.pe || h.ps || h.plo;
  return { id: h.id, n: h.n, name: h.name, area: lang === 'en' ? h.area : h.areaZh,
    price: price ? i18n.fmt(T.fromWeek, { v: Math.min.apply(null, [h.pe, h.ps, h.plo].filter(Boolean)) }) : T.noPrice,
    walk: i18n.fmt(T.walkUol, { n: h.uol }), soldOut: !!h.pso, fav: !!(fav && fav.has(h.id)) };
}
function quizSummary(app) {
  var g = app.globalData, r = g.lastResult, parts = [];
  if (r && r.lifeCharacter) parts.push(r.lifeCharacter);
  if (r && r.persona) parts.push(r.persona);
  return parts.join(' · ');
}
module.exports = { homeCard: homeCard, quizSummary: quizSummary };
