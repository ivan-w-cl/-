/* 把小程序 utils/ 里的纯逻辑（房源数据、找房打分、生活测试、筛选、对比、文案）原样打包成浏览器可用的 js/vendor/core.js。
   不改任何打分代码，只在外面包一层极简 CommonJS 加载器。小程序数据更新后重新运行：
     node web-demo/scripts/build-core.cjs */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../../miniprogram/utils');
const OUT = path.resolve(__dirname, '../js/vendor/core.js');
const FILES = ['data/homes.js', 'home-match-core.js', 'home-tools.js', 'life-model.js', 'home-match.js', 'life-quiz.js', 'i18n.js', 'compare.js'];

const parts = FILES.map(f => {
  const code = fs.readFileSync(path.join(SRC, f), 'utf8');
  return `defs[${JSON.stringify('./' + f)}] = function (module, exports, require) {\n${code}\n};`;
});

const out = `/* 自动生成，请勿手改：node web-demo/scripts/build-core.cjs
   来源：miniprogram/utils/（${FILES.join('、')}） */
(function (root) {
  'use strict';
  var defs = {}, cache = {};
  function resolve(from, to) {
    var base = from.split('/').slice(0, -1), segs = to.split('/');
    segs.forEach(function (s) { if (s === '..') base.pop(); else if (s !== '.') base.push(s); });
    var p = base.join('/');
    if (p.indexOf('./') !== 0) p = './' + p;
    return /\\.js$/.test(p) ? p : p + '.js';
  }
  function load(id) {
    if (cache[id]) return cache[id].exports;
    if (!defs[id]) throw new Error('core: missing module ' + id);
    var module = cache[id] = { exports: {} };
    defs[id].call(root, module, module.exports, function (to) { return load(resolve(id, to)); });
    return module.exports;
  }
${parts.join('\n')}
  root.Core = {
    HM: load('./home-match.js'), LQ: load('./life-quiz.js'), i18n: load('./i18n.js'), compare: load('./compare.js'),
    createCore: load('./home-match-core.js')
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
`;
fs.writeFileSync(OUT, out);
console.log('wrote', path.relative(process.cwd(), OUT), (out.length / 1024).toFixed(0) + 'KB');
