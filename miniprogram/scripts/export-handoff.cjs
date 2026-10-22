/* 从网页版 booking-handoff.js 原样摘出：专家团队、进群流程的文案（中 / 英 / 日）、进群前小问题的回答规则 answer()。
   生成 utils/handoff-core.js。网页改了文案或规则，重新运行即可。 */
'use strict';
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.resolve(__dirname, '..', '..', 'web-live', 'booking-handoff.js'), 'utf8');
const cut = (a, b) => { const i = src.indexOf(a); if (i < 0) throw new Error('找不到 ' + a); const j = src.indexOf(b, i); if (j < 0) throw new Error('找不到 ' + b); return src.slice(i, j); };
const teamsAndWords = cut('  const TEAMS = {', '  const lang = () =>');
const fnStart = src.indexOf('  function answer(q, h) {'), fnEnd = src.indexOf('\n  }\n', fnStart) + 4;
const answer = src.slice(fnStart, fnEnd);
const out = `/* 自动生成：scripts/export-handoff.cjs 从网页版 booking-handoff.js 摘出。不要手改。 */
let LANG = 'zh';
${teamsAndWords}
const lang = () => (W[LANG] ? LANG : 'zh');
${answer}
module.exports = { TEAMS, W, answer(q, h, l) { LANG = l || 'zh'; return answer(q, h); } };
`;
fs.writeFileSync(path.resolve(__dirname, '..', 'utils', 'handoff-core.js'), out);
console.log('handoff-core.js', out.length, 'bytes');
