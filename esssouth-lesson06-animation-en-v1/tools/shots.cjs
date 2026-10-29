// quick review stills: node tools/shots.cjs <section> <outDir> <t1> <t2> ... [--route=key] [--q=extra]
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); const path = require('path'), fs = require('fs');
(async () => {
  const a = process.argv.slice(2), sec = a[0], out = a[1], opt = Object.fromEntries(a.filter((x) => x.startsWith('--')).map((x) => x.slice(2).split('='))), ts = a.slice(2).filter((x) => !x.startsWith('--'));
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '..', 'sections', sec, 'index.html') + '?export=1' + (opt.q ? '&' + opt.q : ''));
  await p.waitForFunction(() => document.body.dataset.ready);
  const w = await p.evaluate(() => (window.__l06 ? window.__l06.warnings : null)); console.log('warnings', JSON.stringify(w));
  for (const t of ts) { await p.evaluate(([t, r]) => window.__l06.renderAt(+t, r || null), [t, opt.route]); await p.screenshot({ path: path.join(out, `${sec}_${opt.route ? opt.route.replace(':', '-') + '_' : ''}t${(+t).toFixed(2).padStart(7, '0')}.jpg`), type: 'jpeg', quality: 72 }); }
  console.log('errors', errs); await b.close();
})();
