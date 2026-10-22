/* 对比表行定义（纯函数） */
'use strict';
var i18n = require('./i18n.js');
function rows(homes, lang) {
  const T = i18n.dict(lang), mins = v => v == null ? '—' : i18n.fmt(T.minutes, { n: v }), gbp = v => v ? '£' + v : '—';
  const near = (h, k) => { const x = h.hm.near[k]; return x ? mins(x.m) : '—'; };
  const cnt = (h, k) => i18n.fmt(T.places, { n: h.hm.cnt[k] || 0 });
  const def = [
    [T.rowArea, h => lang === 'en' ? h.area : h.areaZh],
    [T.rowEnsuite, h => gbp(h.pe)], [T.rowStudio, h => gbp(h.ps)], [T.rowLowest, h => gbp(h.plo)],
    [T.rowRating, h => h.rr ? h.rr.toFixed(1) + '★ (' + (h.rn || 0) + ')' : '—'],
    [T.uol, h => mins(h.uol)], [T.ljmu, h => mins(h.ljmu)], [T.lime, h => mins(h.lime)], [T.centre, h => mins(h.centre)],
    [T.rowSuper, h => near(h, 'super')], [T.rowTopup, h => near(h, 'topup')], [T.rowLib, h => near(h, 'lib')],
    [T.rowPark, h => near(h, 'park')], [T.rowGym, h => near(h, 'gym')],
    [T.rowCafe10, h => cnt(h, 'cafe10')], [T.rowRest10, h => cnt(h, 'rest10')], [T.rowAsian10, h => cnt(h, 'asian10')], [T.rowNight10, h => cnt(h, 'night10')]
  ];
  return def.map(([label, f], i) => ({ key: 'r' + i, label, cells: homes.map(h => f(h)) }));
}
module.exports = { rows: rows };
