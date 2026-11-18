// Real product capture: drives the existing esssouth pages in a phone viewport and saves screenshots
// (1080 px wide) plus where each tap happened. No UI is drawn or altered here; the video adds only a tap ring.
// Usage: node tools/capture.cjs   (needs the team web demo served on 127.0.0.1:8851 and Playwright)
const pw = require('playwright'), fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'capture'), DSF = 1080 / 390;
(async () => {
  const b = await pw.chromium.launch(), errs = [];
  async function clip(name, url, steps) {
    const dir = path.join(OUT, name); fs.mkdirSync(dir, { recursive: true });
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF });
    p.on('pageerror', e => errs.push(name + ': ' + e.message));
    await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
    const meta = []; let n = 0;
    const shot = async (note, tap) => { const f = String(n++).padStart(3, '0') + '.png'; await p.screenshot({ path: path.join(dir, f) }); meta.push({ file: f, note, tap: tap || null }); };
    const center = async sel => { const r = await p.locator(sel).first().boundingBox(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
    const type = async (sel, text, note) => { const c = await center(sel); await p.click(sel, { clickCount: 3 }); await shot(note + ' · 点选', c); for (const ch of text) { await p.keyboard.type(ch); await shot(note + ' · 输入'); } };
    const ctx = { p, shot, center, type };
    await steps(ctx);
    fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ name, url: url.replace(/^file:\/\/.*\/esssouth-/, 'repo:esssouth-'), viewport: [390, 844], scale: DSF, frames: meta }, null, 1));
    await p.close(); console.log(name, meta.length, 'frames');
  }
  const EXPL = 'file:///home/user/-/esssouth-admissions-explainer-v1/index.html#xjtlu';
  // A · 计算器：用假设算例把综合成绩算出来（西浦 · 江苏）
  await clip('A-calculator', EXPL, async ({ p, shot, center, type }) => {
    await p.click('[data-a="ep"][data-i="5"]'); await p.waitForTimeout(400); await p.click('[data-a="toggle"]');
    await p.evaluate(() => document.querySelector('.calc').scrollIntoView({ block: 'center' })); await p.waitForTimeout(300);
    await shot('计算器 · 默认值');
    await type('#c-g', '600', '小A 高考'); await type('#c-i', '90', '小A 面试'); await p.waitForTimeout(200); await shot('小A 结果');
    await type('#c-g', '615', '小B 高考'); await type('#c-i', '70', '小B 面试'); await p.waitForTimeout(200); await shot('小B 结果');
  });
  // B · 切换省份：同一所学校，江苏与广东的办法不同
  await clip('B-province', EXPL, async ({ p, shot, center }) => {
    await p.click('[data-a="toggle"]');
    await p.evaluate(() => document.querySelector('.facts').scrollIntoView({ block: 'center' })); await p.waitForTimeout(300);
    await shot('江苏 · 要点速记');
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
    const c = await center('[data-a="prov"][data-v="gd"]'); await shot('切到广东前', c);
    await p.click('[data-a="prov"][data-v="gd"]'); await p.waitForTimeout(500); await p.click('[data-a="toggle"]');
    await shot('已切到广东');
    await p.evaluate(() => document.querySelector('.facts').scrollIntoView({ block: 'center' })); await p.waitForTimeout(300);
    await shot('广东 · 要点速记');
  });
  // C · 准备：写一句英文，看有没有把理由说清楚（网页测试版 · 5 分钟练习）
  await clip('C-drill', 'http://127.0.0.1:8851/?demo=student#drill-reason', async ({ p, shot, center, type }) => {
    await p.waitForSelector('#dl-in'); await p.evaluate(() => window.scrollTo(0, 0)); await shot('练习题');
    await type('#dl-in', 'I think phones should be allowed.', '第一句');
    let c = await center('[data-a="dl-check"]'); await p.click('[data-a="dl-check"]'); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('#dl-out').scrollIntoView({ block: 'center' })); await shot('第一句的反馈', c);
    await p.evaluate(() => document.querySelector('#dl-in').scrollIntoView({ block: 'center' }));
    const box = await center('#dl-in'); await p.click('#dl-in'); await p.keyboard.press('End'); await shot('补一句 · 点选', box);
    await p.keyboard.press('Backspace');
    for (const ch of ', because parents may need to reach us.') { await p.keyboard.type(ch); await shot('补一句 · 输入'); }
    c = await center('[data-a="dl-check"]'); await p.click('[data-a="dl-check"]'); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('#dl-out').scrollIntoView({ block: 'center' })); await shot('补上理由后的反馈', c);
  });
  console.log(errs.length ? errs : 'no page errors'); await b.close();
})();
