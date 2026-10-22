/* 从网页版 fun-quizzes.js 原样摘出 4 套留学人格测试：题目、类型、权重、合拍度、文案（中 / 英）和推荐打分，
   外面包一层没有页面依赖的工厂函数，生成 utils/fun-quizzes-core.js。网页改了题目或文案，重新运行即可。 */
'use strict';
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.resolve(__dirname, '..', '..', 'web-live', 'fun-quizzes.js'), 'utf8');
function cut(start, end) {
  const s = src.indexOf(start); if (s < 0) throw new Error('fun-quizzes.js 中找不到: ' + start);
  const e = src.indexOf(end, s); if (e < 0) throw new Error('fun-quizzes.js 中找不到结束标记: ' + end);
  return src.slice(s, e);
}
const parts = [
  cut('  const minPrice = h =>', '  const u = () => UI[L()];'),
  cut('  function typeOf(q, answers) {', '  function link(id, type, withDuo) {'),
];
for (const bad of ['document.', 'window.', 'localStorage', 'innerHTML']) parts.forEach(p => { if (p.includes(bad)) throw new Error('截取片段含页面依赖: ' + bad); });
const core = `/* 自动生成：scripts/export-fun.cjs 从网页版 fun-quizzes.js 原样摘出。不要手改。 */
'use strict';
module.exports = function createFun(HOMES, getLang) {
  const L = () => (getLang() === 'en' ? 'en' : 'zh');
  const tx = o => (o && typeof o === 'object' && !Array.isArray(o) ? (o[L()] || o.zh) : o);
  const fmt = (s, v) => String(s).replace(/\\{(\\w+)\\}/g, (_, k) => v[k] != null ? v[k] : '');
  const homes = () => HOMES;
${parts.join('\n')}
  return { QUIZZES, UI, recommend, blend, typeOf, minPrice, tx, fmt, L };
};
`;
fs.writeFileSync(path.resolve(__dirname, '..', 'utils', 'fun-quizzes-core.js'), core);
console.log('fun-quizzes-core.js', core.length, 'bytes');
