/* 公寓数据、筛选、排序、专业步行时间：规则和网页版 index.html / home-ui.js 一样。 */
const D = require('../data/homes.js');
const HomeTools = require('./home-tools.js');
const { t, ht, rich, pl } = require('./i18n.js');

/* 网页版的投影：经纬度 → 米网格（算步行时间用） */
const LON0 = -3.015, LAT0 = 53.448, KX = 6638.0, KY = 11132.0;
const raw = (lat, lon) => [(lon - LON0) * KX, (LAT0 - lat) * KY];
const walkMin = (a, b) => Math.round(Math.hypot(a[0] - b[0], a[1] - b[1]) * 10 * 1.3 / 80);

const HOMES = D.homes.map(h => Object.assign({ t: 'home', r: raw(h.lat, h.lng) }, h));
const byId = id => HOMES.find(h => h.id === id);

/* 选了专业：到最近一栋相关教学楼的步行时间（网页版 setSubject） */
function applySubject(subjectId) {
  const s = D.subjects.find(x => x.id === subjectId);
  HOMES.forEach(h => { h.subj = undefined; h.subjB = undefined; });
  if (!s) return null;
  const blds = D.buildings.filter(b => s.keys.includes(b.key));
  HOMES.forEach(h => {
    let best = null; blds.forEach(b => { const m = walkMin(h.r, b.r); if (!best || m < best.m) best = { m, b }; });
    if (best) { h.subj = best.m; h.subjB = best.b.name; }
  });
  return s;
}

const RANKS = {
  area: { sort: (a, b) => D.areaOrder.indexOf(a.area) - D.areaOrder.indexOf(b.area) || a.uol - b.uol },
  subject: { val: h => h.subj, fmt: 'min' }, uol: { val: h => h.uol, fmt: 'min' }, ljmu: { val: h => h.ljmu, fmt: 'min' },
  lime: { val: h => h.lime, fmt: 'min' }, centre: { val: h => h.centre, fmt: 'min' },
  ensuite: { val: h => h.pe, fmt: 'gbp' }, studio: { val: h => h.ps, fmt: 'gbp' }, cheapest: { val: h => h.plo, fmt: 'gbp' },
  reviews: { val: h => h.rn, desc: true, fmt: 'rev' }, rating: { val: h => (h.rn >= 5 ? h.rr : undefined), desc: true, fmt: 'rate' },
  az: { sort: (a, b) => a.name.localeCompare(b.name) }
};
function rankOrder(k) {
  const R = RANKS[k] || RANKS.area;
  if (R.sort) return HOMES.slice().sort(R.sort);
  return HOMES.slice().sort((a, b) => {
    const va = R.val(a), vb = R.val(b), ma = va == null, mb = vb == null;
    if (ma !== mb) return ma ? 1 : -1;
    if (!ma && va !== vb) return R.desc ? vb - va : va - vb;
    if (k === 'rating' && a.rn !== b.rn) return (b.rn || 0) - (a.rn || 0);
    return a.uol - b.uol || a.name.localeCompare(b.name);
  });
}
function rankValue(lang, k, h) {
  const R = RANKS[k]; if (!R || !R.val) return '';
  const v = R.val(h); if (v == null) return t(lang, 'notListed');
  if (R.fmt === 'min') return t(lang, 'fMin', { n: v });
  if (R.fmt === 'gbp') return t(lang, 'fGbp', { v });
  if (R.fmt === 'rev') return t(lang, 'fRev', { n: v, pl: pl(lang, v) });
  return `${Number(v).toFixed(1)}★ (${h.rn})`;
}
const defaultFilters = () => ({ query: '', budget: 0, room: 'any', destination: 'uol', walk: 0, favoritesOnly: false });
function visible(k, filters, favorites) { return rankOrder(k).filter(h => HomeTools.matchesHome(h, filters, favorites)); }

/* 卡片要显示的内容（网页版 show()） */
function card(lang, h, subject) {
  const prices = [h.pe, h.ps, h.plo].map(Number).filter(v => Number.isFinite(v) && v > 0);
  const facts = [];
  if (h.pe) facts.push(rich(t(lang, 'pEn', { v: h.pe })));
  if (h.ps) facts.push(rich(t(lang, 'pSt', { v: h.ps })));
  if (!h.pe && !h.ps && h.plo) facts.push(rich(t(lang, 'pAny', { v: h.plo })));
  if (h.pso) facts.push(rich(t(lang, 'soldOut')));
  if (h.rn) facts.push(rich(t(lang, 'revLine', { r: Number(h.rr).toFixed(1), n: h.rn, pl: pl(lang, h.rn) })));
  const walks = [t(lang, 'walkUol', { n: h.uol }), t(lang, 'walkLjmu', { n: h.ljmu })];
  if (subject && h.subj != null) walks.unshift(t(lang, 'walkSubj', { n: h.subj, b: h.subjB, s: subject.name[lang] }));
  return {
    id: h.id, n: h.n, name: h.name, tag: t(lang, 'homeTag', { n: h.n }),
    price: h.pso ? t(lang, 'soldShort') : prices.length ? t(lang, 'compactPrice', { v: Math.min.apply(null, prices) }) : t(lang, 'noData'),
    walk: t(lang, 'compactWalk', { n: h.uol }), addr: `${h.addr} · ${h.areaName[lang]}`, text: h.text[lang], walks,
    facts: facts.length ? facts : [rich(t(lang, 'noData'))], src: t(lang, 'source') + ' ' + t(lang, 'cmpWalkNote')
  };
}
module.exports = { D, HOMES, byId, applySubject, rankOrder, rankValue, visible, defaultFilters, card, RANKS, walkMin, raw, HomeTools, ht };
