/* 文案：直接用网页版的原文（data/web-strings.js 从网页导出），小程序自己的少量文案放在 EXTRA。
   t(key, vars) 对应网页版 index.html 的 t()，ht() 对应 home-ui.js 的 ht()。 */
const WEB = require('../data/web-strings.js');

const EXTRA = {
  zh: { matchBtn: '生活选房', sortedBy: '已按「{k}」排序', topNote: '地图上的金色标签是前 3 名。', rank: ['第1', '第2', '第3'],
        homesCount: '公寓列表 ({n})', shareTitle: '利物浦学生住宿地图', soon: '下一版接上', save: '收藏', saved: '已收藏', share: '分享这处公寓',
        layers: '地图上显示', zoneKey: '利物浦大学校区', info: '地图数据 © OpenStreetMap 贡献者。价格和评价来自 Amber 2026-10-17 的记录，不代表实时房态。',
        pcH: '推荐的 {n} 处，一眼对比', pcGo: '并排对比这 {n} 处', pcFrom: '£{p}/周起', pcNoPrice: '暂无价格', pcUol: '到利大 {m} 分钟',
        planBtn: '抢房计划', addPlan: '加入抢房', inPlan: '在抢房计划里', planAdded: '已加入抢房计划', planFull: '抢房计划最多 10 栋' },
  en: { matchBtn: 'Home Match', sortedBy: 'Sorted by “{k}”', topNote: 'Gold tags on the map mark the top 3.', rank: ['1st', '2nd', '3rd'],
        homesCount: 'Homes ({n})', shareTitle: 'Liverpool Student Map', soon: 'Coming in the next build', save: 'Save', saved: 'Saved', share: 'Share home',
        layers: 'Show on the map', zoneKey: 'University of Liverpool campus', info: 'Map data © OpenStreetMap contributors. Prices and reviews are Amber listings recorded on 17 Oct 2026, not live availability.',
        pcH: 'Your {n} picks at a glance', pcGo: 'Compare these {n} side by side', pcFrom: 'From £{p}/wk', pcNoPrice: 'No price yet', pcUol: 'UoL {m} min',
        planBtn: 'Booking plan', addPlan: 'Add to plan', inPlan: 'In my plan', planAdded: 'Added to booking plan', planFull: 'Up to 10 homes in a plan' }
};
/* 网页文案里说「浏览器」的地方，小程序里改成「这台手机 / 微信」 */
const HOME_EXTRA = {
  zh: { local: '收藏和对比只保存在这台手机的微信里，不会同步到其他手机。', storageFail: '这台手机暂时无法保存，退出小程序后选择可能丢失。' },
  en: { local: 'Saved homes and comparisons stay in WeChat on this phone only.', storageFail: 'This phone could not save your choices. They will last only until you close the mini program.' }
};
const fill = (s, vars) => { if (vars) for (const k in vars) s = String(s).split('{' + k + '}').join(vars[k]); return s; };
function t(lang, key, vars) {
  const L = WEB[lang] || WEB.en;
  const s = (EXTRA[lang] && EXTRA[lang][key] != null) ? EXTRA[lang][key] : L.str[key] != null ? L.str[key] : WEB.en.str[key] != null ? WEB.en.str[key] : key;
  return Array.isArray(s) ? s : fill(s, vars);
}
function ht(lang, key, vars) { const L = WEB[lang] || WEB.en, X = HOME_EXTRA[lang] || HOME_EXTRA.en; return fill(X[key] != null ? X[key] : L.home[key] != null ? L.home[key] : WEB.en.home[key], vars); }
/* 网页文案里有 <b>…</b>：拆成片段给 WXML 用 [{ t, b }] */
function rich(s) { return String(s).split(/(<b>.*?<\/b>)/).filter(Boolean).map(p => /^<b>/.test(p) ? { t: p.slice(3, -4), b: true } : { t: p, b: false }); }
const pl = (lang, n) => (lang === 'en' && n !== 1 ? 's' : '');
module.exports = { t, ht, rich, pl };
