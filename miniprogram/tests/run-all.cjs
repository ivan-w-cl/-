/* 小程序 utils 的 Node 测试：node tests/run-all.cjs
   1) 与网页版 home-match.js / life-c-model.js 对照 Top 3（需要网页版目录，见 scripts/web-harness.cjs）
   2) 所有 json 合法、页面四件套齐全  3) 所有 .js 语法检查  4) WXML 标签配对粗检  5) session-from 长度 */
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; console.log('  ✓ ' + name); } catch (e) { fail++; console.log('  ✗ ' + name + '\n    ' + (e && e.message)); } }

const HM = require('../utils/home-match.js'), LQ = require('../utils/life-quiz.js');
const { loadWeb, loadLifeModel, WEB_DIR } = require('../scripts/web-harness.cjs');
const haveWeb = fs.existsSync(path.join(WEB_DIR, 'home-match.js'));

console.log('\n[1] 数据');
t('47 套房源，id/编号唯一，坐标齐全', () => {
  assert.strictEqual(HM.HOMES.length, 47);
  assert.strictEqual(new Set(HM.HOMES.map(h => h.id)).size, 47);
  assert.strictEqual(new Set(HM.HOMES.map(h => h.n)).size, 47);
  HM.HOMES.forEach(h => { assert(Number.isFinite(h.lat) && Number.isFinite(h.lng), h.name); assert(h.textZh, '缺中文简介 ' + h.name); assert(h.hm && h.hm.cnt && h.hm.near.park, h.name); });
});

const SETS = {
  'A 利大·下厨·东亚·图书馆·公园·早睡·15分钟': { campus: 'uol', dinner: 'cook', shop: 'weekly', flavour: ['east'], study: 'library', free: ['park'], night: 'calm', walk: 'mid' },
  'B 不确定·外卖·随便·咖啡馆·逛街·夜猫子·远': { campus: 'unsure', dinner: 'takeaway', shop: 'rarely', flavour: ['any'], study: 'cafe', free: ['shops'], night: 'lots', walk: 'far' },
  'C LJMU City·外食·南亚+素食·书桌·健身+文化·偶尔·越近越好': { campus: 'ljmu-city', dinner: 'out', shop: 'special', flavour: ['south', 'veg'], study: 'desk', free: ['gym', 'culture'], night: 'some', walk: 'close' },
  'D Hope Park·混合·东亚+南亚+素食·随处·宅家·早睡·远': { campus: 'hope-park', dinner: 'mix', shop: 'topup', flavour: ['east', 'south', 'veg'], study: 'any', free: ['home'], night: 'calm', walk: 'far' },
  'E 边界：Hope Park + 15分钟（网页版也给出 0 套）': { campus: 'hope-park', dinner: 'cook', shop: 'weekly', flavour: ['any'], study: 'any', free: ['home'], night: 'calm', walk: 'mid' }
};

if (!haveWeb) console.log('\n[2] 跳过网页对照：找不到 ' + WEB_DIR + '（可设置 WEB_DIR）');
else {
  const web = loadWeb('zh');
  console.log('\n[2] 找房测试：与网页版 home-match.js 对照（' + WEB_DIR + '）');
  Object.keys(SETS).forEach(name => t(name, () => {
    const w = web.webTop3(SETS[name]), m = HM.match(SETS[name], { lang: 'zh' });
    assert.deepStrictEqual(m.ids, w.ids); assert.deepStrictEqual(m.picks.map(p => p.score), w.scores);
    assert.strictEqual(m.persona.title, w.persona.title); assert.strictEqual(m.eligible, w.eligible);
    console.log('      Top3 = ' + m.picks.map(p => p.n + ' ' + p.name).join(' | ') + '  · ' + m.persona.title);
  }));
  t('随机 500 组答案全部一致（含多选组合）', () => {
    const qs = HM.questions('zh'); let seed = 42; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let k = 0; k < 500; k++) {
      const a = {};
      qs.forEach(q => { const ids = q.opts.map(o => o.id); if (q.multi) { const s = ids.filter(() => rnd() < 0.4).slice(0, q.max); a[q.id] = s.length ? s : [ids[0]]; } else a[q.id] = ids[Math.floor(rnd() * ids.length)]; });
      assert.deepStrictEqual(HM.match(a).ids, web.webTop3(HM.cleanAnswers(a)).ids, JSON.stringify(a));
    }
  });
  console.log('\n[3] 生活测试：与网页版 life-c-model.js + home-match.js 对照');
  const WL = loadLifeModel(); WL.setLanguage('zh');
  const LIFE = { '咖啡馆·外食·…': [[0, 1, 1, 2, 2, 0], { campus: 'uol', walk: 'mid' }], 'sample 图书馆·下厨': [WL.sample, { campus: 'ljmu-mp', walk: 'close' }],
    '码头散步·外卖·夜猫子': [[2, 2, 3, 1, 2, 2], { campus: 'unsure', walk: 'far' }], '画廊·下厨·早睡': [[3, 0, 0, 0, 0, 0], { campus: 'lipa', walk: 'mid', flavour: ['east'] }] };
  Object.keys(LIFE).forEach(name => t(name, () => {
    const [a, extra] = LIFE[name], r = LQ.run(a, extra, 'zh'), wr = WL.result(a), wa = WL.toMapAnswers(a, extra);
    assert.strictEqual(r.character.name, wr.name); assert.deepStrictEqual(r.mapAnswers, JSON.parse(JSON.stringify(wa)));
    assert.deepStrictEqual(r.match.ids, web.webTop3(wa).ids);
    console.log('      ' + r.character.name + ' → ' + r.match.picks.map(p => p.n + ' ' + p.name).join(' | '));
  }));
  t('全部 1728 种生活答案：角色与 Top3 一致', () => {
    const n = WL.questions.map(q => q.options.length); let count = 0;
    const rec = a => { if (a.length === 6) { count++; const r = LQ.run(a, { campus: 'uol', walk: 'mid' }, 'zh'); assert.strictEqual(r.character.id, WL.result(a).id); assert.deepStrictEqual(r.match.ids, web.webTop3(WL.toMapAnswers(a, { campus: 'uol', walk: 'mid' })).ids, a.join('')); return; } for (let i = 0; i < n[a.length]; i++) rec(a.concat(i)); };
    rec([]); assert.strictEqual(count, 1728);
  });
  t('英文模式 Top3 与中文相同', () => Object.values(SETS).forEach(a => assert.deepStrictEqual(HM.match(a, { lang: 'en' }).ids, HM.match(a, { lang: 'zh' }).ids)));
}

console.log('\n[4] 工程结构与 JSON');
const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
const jsonFiles = []; const jsFiles = []; const wxmlFiles = [];
(function walk(d) { fs.readdirSync(d, { withFileTypes: true }).forEach(e => { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); } else if (p.endsWith('.json')) jsonFiles.push(p); else if (/\.(c?js)$/.test(p)) jsFiles.push(p); else if (p.endsWith('.wxml')) wxmlFiles.push(p); }); })(ROOT);
t('所有 .json 可解析（' + jsonFiles.length + ' 个）', () => jsonFiles.forEach(f => { try { JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { throw new Error(path.relative(ROOT, f) + ': ' + e.message); } }));
t('app.json 中 7 个页面均有 js/json/wxml/wxss', () => { assert.strictEqual(appJson.pages.length, 7); appJson.pages.forEach(p => ['.js', '.json', '.wxml', '.wxss'].forEach(x => assert(fs.existsSync(path.join(ROOT, p + x)), p + x))); });
t('project.config.json appid 为占位符 touristappid', () => assert.strictEqual(JSON.parse(fs.readFileSync(path.join(ROOT, 'project.config.json'))).appid, 'touristappid'));
t('marker 图标存在', () => ['pin-home', 'pin-top', 'pin-campus'].forEach(n => assert(fs.existsSync(path.join(ROOT, 'images', n + '.png')))));
t('utils 不依赖 DOM / wx（可在 Node 与小程序共用）', () => fs.readdirSync(path.join(ROOT, 'utils')).filter(f => f.endsWith('.js')).forEach(f => { const s = fs.readFileSync(path.join(ROOT, 'utils', f), 'utf8'); assert(!/\bdocument\.|\bwindow\.|\bwx\./.test(s), f); }));

console.log('\n[5] 语法检查');
t('node --check 全部 .js（' + jsFiles.length + ' 个）', () => jsFiles.forEach(f => { try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); } catch (e) { throw new Error(path.relative(ROOT, f) + '\n' + e.stderr); } }));
t('WXML 标签配对粗检（' + wxmlFiles.length + ' 个）', () => wxmlFiles.forEach(f => {
  const s = fs.readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/\{\{[\s\S]*?\}\}/g, 'X'), stack = [];
  for (const m of s.matchAll(/<(\/?)([a-z-]+)([^>]*?)(\/?)>/g)) { if (m[4] === '/' ) continue; if (m[1]) { const top = stack.pop(); assert.strictEqual(top, m[2], path.relative(ROOT, f) + ' 标签不配对: ' + m[2]); } else stack.push(m[2]); }
  assert.strictEqual(stack.length, 0, path.relative(ROOT, f) + ' 未闭合: ' + stack.join(','));
}));
t('页面 WXML 中绑定的事件在 js 中有实现', () => appJson.pages.forEach(p => { const x = fs.readFileSync(path.join(ROOT, p + '.wxml'), 'utf8'), j = fs.readFileSync(path.join(ROOT, p + '.js'), 'utf8'); for (const m of x.matchAll(/(?:bind|catch)\w+="(\w+)"/g)) assert(new RegExp('\\b' + m[1] + '\\s*\\(').test(j), p + ' 缺少 ' + m[1]); }));

console.log('\n[6] 咨询 session-from');
const { buildSessionFrom, utf8Len, MAX } = require('../utils/consult.js');
t('session-from 为合法 JSON、含 homeId/quizSummary、≤' + MAX + ' 字节', () => {
  const homes = HM.byIds(HM.match(Object.values(SETS)[0]).ids), last = { lifeCharacter: '图书馆常客 · 居家大厨', persona: HM.match(Object.values(SETS)[0]).persona.title };
  const r = buildSessionFrom({ homeId: homes[0].id, homes, last, lang: 'zh' }), o = JSON.parse(r.json);
  assert.strictEqual(o.homeId, homes[0].id); assert(o.quizSummary.includes('图书馆常客')); assert.strictEqual(o.homes.length, 3); assert(utf8Len(r.json) <= MAX);
  const long = buildSessionFrom({ homes, last: { lifeCharacter: '长'.repeat(400), persona: '长'.repeat(400) } }); assert(utf8Len(long.json) <= MAX);
  console.log('      ' + r.json);
});

console.log('\n结果：' + pass + ' 通过，' + fail + ' 失败');
process.exit(fail ? 1 : 0);
