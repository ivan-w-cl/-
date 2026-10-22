/* 从网页版导出小程序要用的数据和文案（中 / 英），文字和数字与网页完全相同：
   47 处公寓（编号、价格、评分、步行时间、介绍）、地点和教学楼、专业、排序方式、界面文案。
   用法同 export-scene.cjs：先起 web-live 静态服务器，再 NODE_PATH=$(npm root -g) node scripts/export-data.cjs */
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.WEB_URL || 'http://localhost:8769';
const OUT = path.join(__dirname, '..', 'data');

function grab() {
  const pick = (o, keys) => keys.reduce((r, k) => { if (o[k] !== undefined) r[k] = o[k]; return r; }, {});
  const homes = HOMES.slice().sort((a, b) => a.n - b.n).map(h => Object.assign(pick(h, ['id', 'n', 'name', 'area', 'addr', 'lat', 'lng', 'pe', 'ps', 'plo', 'rr', 'rn', 'pso', 'uol', 'ljmu', 'lime', 'centre']),
    { areaName: areaOf(h.area), text: textOf(h),
      // 生活选房用：网页里算好的周边地点（最近的超市、图书馆…… 的步行分钟和位置；10 分钟内各类地点数量）
      hm: h.hm ? { r: h.hm.r, cnt: h.hm.cnt, near: Object.fromEntries(Object.entries(h.hm.near).map(([k, v]) => [k, { m: v.m, p: { n: v.p.n || '', r: v.p.r } }])) } : null }));
  const places = PLACES.map(p => ({ id: p.id, t: p.t, name: nameOf(p), text: textOf(p) }));
  const buildings = BUILDINGS.map(b => ({ id: b.id, key: b.key, zone: b.zone, name: b.name, r: b.r }));
  const zones = Object.fromEntries(Object.entries(ZONES).map(([k, z]) => [k, { name: zoneName(k), faculty: facultyOf(k), ink: z.ink, bld: z.bld, tint: z.tint }]));
  const subjects = SUBJECTS.map(s => ({ id: s.id, name: subjName(s), note: subjNote(s), zone: s.zone, keys: s.keys }));
  const ranks = Object.entries(RANKS).map(([k, R]) => ({ key: k, label: t(R.tk), group: R.group ? t(R.group) : '', source: !!R.source }));
  return { lang: LANG, homes, places, buildings, zones, subjects, ranks, areaOrder: AREA_ORDER, areaNames: Object.fromEntries(AREA_ORDER.map(a => [a, areaOf(a)])),
    str: STR[LANG], home: HOME_COPY[LANG], types: Object.fromEntries(Object.entries(TYPES).map(([k, v]) => [k, v.color])) };
}

(async () => {
  const b = await chromium.launch(), out = {};
  for (const lang of ['zh', 'en']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    await p.route('https://api.open-meteo.com/**', r => r.abort());
    await p.goto(`${BASE}/index.html#lang=${lang}`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(2500);
    out[lang] = await p.evaluate(grab);
    await p.close();
  }
  await b.close();
  /* 不随语言变的部分放一份，随语言变的分 zh / en */
  const zh = out.zh, en = out.en;
  const homes = zh.homes.map((h, i) => Object.assign({}, h, { hm: h.hm, areaName: { zh: h.areaName, en: en.homes[i].areaName }, text: { zh: h.text, en: en.homes[i].text } }));
  const places = zh.places.map((p, i) => ({ id: p.id, t: p.t, name: { zh: p.name, en: en.places[i].name }, text: { zh: p.text, en: en.places[i].text } }));
  const data = { homes, places, buildings: zh.buildings, subjects: zh.subjects.map((s, i) => ({ id: s.id, keys: s.keys, zone: s.zone, name: { zh: s.name, en: en.subjects[i].name }, note: { zh: s.note, en: en.subjects[i].note } })),
    zones: Object.fromEntries(Object.keys(zh.zones).map(k => [k, Object.assign({}, zh.zones[k], { name: { zh: zh.zones[k].name, en: en.zones[k].name }, faculty: { zh: zh.zones[k].faculty, en: en.zones[k].faculty } })])),
    areaOrder: zh.areaOrder, areaNames: { zh: zh.areaNames, en: en.areaNames }, types: zh.types,
    ranks: zh.ranks.map((r, i) => ({ key: r.key, source: r.source, label: { zh: r.label, en: en.ranks[i].label }, group: { zh: r.group, en: en.ranks[i].group } })) };
  const head = '/* 自动生成：scripts/export-data.cjs 从网页版导出。不要手改。 */\n';
  fs.writeFileSync(path.join(OUT, 'homes.js'), head + 'module.exports = ' + JSON.stringify(data) + ';\n');
  fs.writeFileSync(path.join(OUT, 'web-strings.js'), head + 'module.exports = ' + JSON.stringify({ zh: { str: zh.str, home: zh.home }, en: { str: en.str, home: en.home } }) + ';\n');
  console.log('homes', homes.length, 'places', places.length, 'buildings', data.buildings.length, 'subjects', data.subjects.length,
    'sizes', fs.statSync(path.join(OUT, 'homes.js')).size, fs.statSync(path.join(OUT, 'web-strings.js')).size);
})();
