#!/usr/bin/env node
/* 从网页版 index.html 内嵌数据 + home-match.js 预计算结果，重新生成 utils/data/homes.js
   用法：node scripts/extract-data.cjs   （可用环境变量 WEB_DIR 指定网页版目录）
   周边设施（POI）计数/最近距离在这里一次性算好，小程序端不再携带 120KB 的 POI 原始数据。 */
'use strict';
const fs = require('fs'), path = require('path');
const { loadWeb } = require('./web-harness.cjs');
const w = loadWeb('zh');
const homes = w.HOMES.map(h => {
  const near = {};
  Object.keys(h.hm.near).sort().forEach(k => { const v = h.hm.near[k]; near[k] = { m: v.m, p: { n: v.p.n || '' } }; });
  const cnt = {}; Object.keys(h.hm.cnt).sort().forEach(k => { cnt[k] = h.hm.cnt[k]; });
  const o = { id: h.id, n: h.n, name: h.name, lat: h.lat, lng: h.lng, addr: h.addr, area: h.area,
    areaZh: (w.AREA_TX[h.area] || {}).zh || h.area, text: h.text, textZh: (w.HOME_TX[h.name] || [])[1] || '',
    uol: h.uol, ljmu: h.ljmu, lime: h.lime, centre: h.centre,
    hm: { r: [h.hm.r[0], h.hm.r[1]], cnt, near } };
  ['pe', 'ps', 'plo', 'rr', 'rn'].forEach(k => { if (h[k] != null) o[k] = h[k]; });
  o.pso = !!h.pso;
  return o;
}).sort((a, b) => a.n - b.n);
const out = path.resolve(__dirname, '../utils/data/homes.js');
const header = '/* 自动生成，请勿手改。来源：' + path.relative(path.resolve(__dirname, '..'), w.WEB_DIR) + '/index.html + home-match.js\n' +
  '   重新生成：node scripts/extract-data.cjs\n   价格与评分为网页版记录的历史数据（Amber，2026-10-17 核对），不是实时库存。 */\n';
fs.writeFileSync(out, header + 'module.exports = ' + JSON.stringify(homes, null, 1) + ';\n');
console.log('写入', out, homes.length, '套房源', fs.statSync(out).size, 'bytes');

/* ---------- 2) 从 home-match.js 原样截取纯计算部分，生成 utils/home-match-core.js ---------- */
const src = fs.readFileSync(path.join(w.WEB_DIR, 'home-match.js'), 'utf8');
function cut(start, end) {
  const s = src.indexOf(start); if (s < 0) throw new Error('home-match.js 中找不到: ' + start);
  const e = src.indexOf(end, s); if (e < 0) throw new Error('home-match.js 中找不到结束标记: ' + end);
  return src.slice(s, e);
}
const parts = [
  cut('  const CAMPUSES = {', '  const wrap = document.getElementById'),
  cut('  const cleanAnswers = input => {', '  // External test handoffs'),
  cut('  const countOf = (home, key) =>', '  function setModalBackground'),
  cut('  function priceText(home) {', '  function answerChips'),
];
for (const bad of ['document.', 'window.', 'localStorage', 'innerHTML']) parts.forEach(p => { if (p.includes(bad)) throw new Error('截取片段含 DOM 依赖: ' + bad); });
const core = `/* 自动生成，请勿手改：node scripts/extract-data.cjs
   内容原样截取自网页版 home-match.js（题目、中英文文案、权重、打分、人物画像），外面包一层无 DOM 的工厂函数。 */
'use strict';
module.exports = function createCore(HOMES, opts) {
  opts = opts || {};
  const lang = opts.lang === 'en' ? 'en' : 'zh';
  const isChinese = () => lang === 'zh';
  const local = (en, zh) => isChinese() ? zh : en;
  const state = { answers: opts.answers || {} };
  const subject = null, subjName = s => s.name;
  const matchesHomeFilters = opts.filter || (() => true);
  const LON0 = -3.015, LAT0 = 53.448, KX = 6638.0, KY = 11132.0;
  const raw = (lat, lon) => [(lon - LON0) * KX, (LAT0 - lat) * KY];
  const walkMin = (a, b) => Math.round(Math.hypot(a[0] - b[0], a[1] - b[1]) * 10 * 1.3 / 80);
  const walking = (a, b) => Math.max(1, walkMin(a, b));
${parts.join('\n')}
  return { CAMPUSES, CAMPUS_ZH, QUESTIONS, displayQuestion, cleanAnswers, metrics, weightsFor, matchHomes, persona, priceText, state };
};
`;
fs.writeFileSync(path.resolve(__dirname, '../utils/home-match-core.js'), core);
console.log('写入 utils/home-match-core.js', core.length, 'bytes');

/* ---------- 3) life-c-model.js 原样复制，改成 CommonJS 导出 ---------- */
let life = fs.readFileSync(path.join(w.WEB_DIR, 'life-c-model.js'), 'utf8');
const tail = "})(typeof window !== 'undefined' ? window : globalThis);";
if (!life.includes(tail)) throw new Error('life-c-model.js 结尾结构已变化');
life = '/* 自动生成，请勿手改：node scripts/extract-data.cjs。原样复制自网页版 life-c-model.js */\nvar __root = {};\n' +
  life.replace(tail, '})(__root);') + '\nmodule.exports = __root.LifeCModel;\n';
fs.writeFileSync(path.resolve(__dirname, '../utils/life-model.js'), life);
console.log('写入 utils/life-model.js', life.length, 'bytes');

/* ---------- 4) home-tools.js（筛选逻辑，本身就是 UMD/CommonJS）原样复制 ---------- */
fs.copyFileSync(path.join(w.WEB_DIR, 'home-tools.js'), path.resolve(__dirname, '../utils/home-tools.js'));
console.log('复制 utils/home-tools.js');
