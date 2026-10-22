/* 从网页原版（web-original/liverpool-life-map-en）导出手绘底图，生成 js/vendor/basemap.js。
   原版在浏览器里把 OpenStreetMap 数据做"游客地图"变形后画出底图、地标和公寓（含防重叠排布）。
   这里用无头 Chromium 打开原版页面，把画好的 SVG 原样取出来，Demo 不再重复计算。
   需要 Playwright：  node web-demo/scripts/build-basemap.cjs */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const SRC = path.resolve(__dirname, '../../web-original/liverpool-life-map-en');
const OUT = path.resolve(__dirname, '../js/vendor/basemap.js');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/json', '.csv': 'text/csv' };

const server = http.createServer((req, res) => {
  const file = path.join(SRC, decodeURIComponent(req.url.split('?')[0].split('#')[0]) || '/index.html');
  if (!file.startsWith(SRC) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

async function dump(browser, port, lang) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(l => { try { localStorage.setItem('lsm-lang', l); } catch (e) { /* ignore */ } }, lang);
  await page.goto(`http://localhost:${port}/index.html#explore=1`);
  await page.waitForFunction(() => document.querySelectorAll('#homes g.m').length >= 47, null, { timeout: 20000 });
  await page.waitForTimeout(800);
  const data = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const tr = el => { const m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(el.getAttribute('transform') || ''); return m ? [+m[1], +m[2]] : null; };
    return {
      viewBox: q('#base').getAttribute('viewBox'),
      base: q('#baseG').innerHTML, labels: q('#baseLabels').innerHTML, leaders: q('#leaders').innerHTML,
      defs: q('#base defs').innerHTML + q('#over defs').innerHTML,
      homes: [...document.querySelectorAll('#homes g.m')].map(g => ({ n: +(g.querySelector('.num') || {}).textContent, p: tr(g) })),
      places: [...document.querySelectorAll('#places g.m, #campus g.m')].filter(g => g.querySelector('use'))
        .map(g => ({ t: g.getAttribute('data-type'), use: g.querySelector('use').getAttribute('href'), name: g.getAttribute('aria-label'), label: !!g.querySelector('text.lbl'), p: tr(g) }))
    };
  });
  await page.close();
  if (errors.length) throw new Error(lang + ': ' + errors.join('; '));
  return data;
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  try {
    const en = await dump(browser, port, 'en'), zh = await dump(browser, port, 'zh');
    const [, , w, h] = en.viewBox.split(' ').map(Number);
    const homes = {};
    en.homes.forEach(x => { homes[x.n] = x.p.map(v => +v.toFixed(1)); });
    const places = en.places.map((x, i) => ({ t: x.t, use: x.use, label: x.label, p: x.p.map(v => +v.toFixed(1)), name: { en: x.name, zh: zh.places[i].name } }));
    const out = { w, h, defs: en.defs, base: en.base, leaders: en.leaders, labels: { en: en.labels, zh: zh.labels }, homes, places };
    fs.writeFileSync(OUT, `/* 自动生成，请勿手改：node web-demo/scripts/build-basemap.cjs
   来源：web-original/liverpool-life-map-en/index.html 渲染出的手绘底图。Map data © OpenStreetMap contributors. */
window.LSM_BASEMAP = ${JSON.stringify(out)};
`);
    console.log('wrote', path.relative(process.cwd(), OUT), (fs.statSync(OUT).size / 1024).toFixed(0) + 'KB', Object.keys(homes).length, 'homes', places.length, 'places');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
