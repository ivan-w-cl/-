/* 在真实网页里跑一遍「筛选 + 排序」，打印结果：剩几栋、排名前几的是谁。做每一期之前先跑，确认视频里筛出来的就是要比的两栋。
   用法（仓库根目录；本地网页服务器没开会自动开）：
     NODE_PATH=$(npm root -g) node .claude/skills/apartment-pk-video/scripts/check_filter.cjs room=ensuite walk=10 dest=uol budget=0 rank=ensuite
   参数和 timeline 里 EP.filter 一样：room any/ensuite/studio · walk 0/5/10/15/20/30/45 · dest uol/ljmu · budget 0/100/…/300 ·
   rank ensuite/studio/cheapest/uol/ljmu/lime/centre/reviews/rating/area/az */
const { chromium } = require('playwright'), { spawn, execSync } = require('child_process'), path = require('path');
const PORT = process.env.PORT || 8780;
function ensureServer() {   // 本地网页服务器没开就开一个（后台常驻）
  try { execSync(`curl -sf -o /dev/null http://localhost:${PORT}/web/index.html`); return; } catch (e) { /* 没开 */ }
  spawn('node', [path.join(process.cwd(), 'promo-video/server.cjs')], { detached: true, stdio: 'ignore' }).unref();
  execSync('sleep 1');
}
const arg = Object.assign({ room: 'any', walk: '0', dest: 'uol', budget: '0', rank: 'ensuite' },
  Object.fromEntries(process.argv.slice(2).map(a => a.split('='))));
(async () => {
  ensureServer();
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 432, height: 672 }, locale: 'zh-CN' });
  await ctx.route('https://api.open-meteo.com/**', r => r.abort());
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const p = await ctx.newPage();
  await p.goto('http://localhost:' + PORT + '/web/index.html#lang=zh');
  await p.waitForTimeout(3000);
  const set = (id, v) => p.evaluate(([id, v]) => { const s = document.getElementById(id); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
  await p.evaluate(() => { try { HomeMatch.exit(); } catch (e) { /* 没有 */ } [...document.querySelectorAll('button')].find(e => e.textContent.trim() === '筛选').click(); });
  await p.waitForTimeout(500);
  for (const [id, k] of [['homeBudget', 'budget'], ['homeRoom', 'room'], ['homeDestination', 'dest'], ['homeWalk', 'walk']]) { await set(id, arg[k]); await p.waitForTimeout(250); }
  const btn = await p.evaluate(() => document.getElementById('viewResults').textContent.trim());
  await p.evaluate(() => document.getElementById('viewResults').click()); await p.waitForTimeout(600);
  await set('rank', arg.rank); await p.waitForTimeout(600);
  const rows = await p.evaluate(() => [...document.querySelectorAll('#homesPanel li.hrow')].filter(e => e.getBoundingClientRect().width > 0)
    .map(e => e.dataset.rank + '. ' + e.querySelector('.nm').textContent + '  ' + (e.querySelector('.w') ? e.querySelector('.w').textContent : '')));
  console.log('筛选：', JSON.stringify(arg));
  console.log('按钮：', btn, '（47 栋 → ' + rows.length + ' 栋）');
  rows.slice(0, 10).forEach(r => console.log('  ' + r));
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
