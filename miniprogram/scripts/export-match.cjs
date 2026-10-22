/* 从网页版 home-match.js 原样摘出「生活选房」的题目、文案、权重、打分、人物画像、价格文字，
   外面包一层没有页面依赖的工厂函数，生成 utils/home-match-core.js。网页改了题目或规则，重新运行即可。
   周边地点（超市、图书馆、咖啡馆……）的距离和数量在网页里算好，由 export-data.cjs 随公寓数据一起导出（home.hm）。 */
'use strict';
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.resolve(__dirname, '..', '..', 'web-live', 'home-match.js'), 'utf8');
function cut(start, end) {
  const s = src.indexOf(start); if (s < 0) throw new Error('home-match.js 中找不到: ' + start);
  const e = src.indexOf(end, s); if (e < 0) throw new Error('home-match.js 中找不到结束标记: ' + end);
  return src.slice(s, e);
}
const parts = [
  cut('  const CAMPUSES = {', '  const wrap = document.getElementById'),
  cut('  const cleanAnswers = input => {', '  // External test handoffs'),
  cut('  const answered = q =>', '  let toastTimer'),
  cut('  const countOf = (home, key) =>', '  function setModalBackground'),
  cut('  function priceText(home) {', '  function renderPanel'),
  cut('  function resultScope() {', '  function getSnapshot'),
];
for (const bad of ['document.', 'window.', 'localStorage', 'innerHTML']) parts.forEach(p => { if (p.includes(bad)) throw new Error('截取片段含页面依赖: ' + bad); });
const core = `/* 自动生成：scripts/export-match.cjs 从网页版 home-match.js 原样摘出。不要手改。 */
'use strict';
module.exports = function createCore(HOMES, opts) {
  opts = opts || {};
  const state = { answers: opts.answers || {} };
  let subject = opts.subject || null;
  const subjName = s => (s.name && s.name.zh) || s.name;
  const areaOf = a => (opts.areaOf ? opts.areaOf(a) : a);
  const matchesHomeFilters = opts.filter || (() => true);
  const LON0 = -3.015, LAT0 = 53.448, KX = 6638.0, KY = 11132.0;
  const raw = (lat, lon) => [(lon - LON0) * KX, (LAT0 - lat) * KY];
  const walkMin = (a, b) => Math.round(Math.hypot(a[0] - b[0], a[1] - b[1]) * 10 * 1.3 / 80);
  const walking = (a, b) => Math.max(1, walkMin(a, b));
${parts.join('\n')}
  return { CAMPUSES, QUESTIONS, cleanAnswers, answered, complete, metrics, weightsFor, matchHomes, persona, priceText, resultScope, state,
    setSubject(s) { subject = s; }, setFilter(f) { opts.filter = f; } };
};
`;
fs.writeFileSync(path.resolve(__dirname, '..', 'utils', 'home-match-core.js'), core);
console.log('home-match-core.js', core.length, 'bytes');
