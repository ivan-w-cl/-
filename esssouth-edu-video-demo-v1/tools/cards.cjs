// Renders cards.html to out/图文/: 封面.png (card 0) and 总结图-1…6.png, each 1080×1440.
const pw = require('playwright'), path = require('path');
(async () => { const b = await pw.chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1440 } }), bad = [];
  for (let n = 0; n <= 6; n++) {
    await p.goto('file://' + path.join(__dirname, '..', 'cards.html') + '?card=' + n); await p.waitForTimeout(600); await p.evaluate(() => document.fonts.ready);
    const over = await p.evaluate(() => { const c = document.querySelector('.card'); return [...c.children].some(e => e.getBoundingClientRect().bottom > 1440 - 30 || e.getBoundingClientRect().right > 1080); });
    if (over) bad.push(n);
    await p.screenshot({ path: path.join(__dirname, '..', 'out', '图文', n ? `总结图-${n}.png` : '封面.png') });
  }
  console.log(bad.length ? 'overflow in ' + bad : 'OK'); await b.close(); })();
