/* 逐帧录制：node record.cjs <out> <fps> <from> <to> [dpr] [only=frame list] */
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
const [out, fps = 30, from = 0, to = 3, dpr = 2] = process.argv.slice(2), FPS = +fps, DT = 1 / FPS;
const RAIN = { current: { temperature_2m: 12.4, apparent_temperature: 10.1, weather_code: 61, is_day: 1, wind_speed_10m: 14 }, daily: { temperature_2m_max: [14], temperature_2m_min: [9], precipitation_probability_max: [80], sunset: ['2026-10-23T18:01'] } };
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--disable-gpu-vsync', '--force-color-profile=srgb', '--font-render-hinting=none'] });
  const ctx = await b.newContext({ viewport: process.env.PORTRAIT ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 }, deviceScaleFactor: +dpr, locale: 'zh-CN', timezoneId: 'Europe/London' });
  if (process.env.FRESH !== '0') await ctx.addInitScript(() => { try { if (!sessionStorage.getItem('rec')) { sessionStorage.setItem('rec', 1); localStorage.clear(); } } catch (e) { /* 忽略 */ } });   // 每次都是第一次打开（保留引导和房屋落下）
  await ctx.route('https://api.open-meteo.com/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(process.env.WEATHER ? JSON.parse(process.env.WEATHER) : RAIN) }));
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const p = await ctx.newPage();
  p.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !/Failed to load resource/.test(m.text())) console.log('[page]', m.text()); });
  p.on('response', r => { if (r.status() >= 400) console.log('[http ' + r.status() + ']', r.url()); });
  p.on('pageerror', e => console.log('[pageerror]', e.message));
  // 假时钟必须暂停：不然真实时间也在走，截图越慢网页里的计时器越快，每次录出来都不一样
  const T0 = Date.parse(process.env.DATE || '2026-10-23T15:41:00Z');   // DATE：网页里的「现在」（日照「今天」、抢房倒计时用）
  await p.clock.install({ time: new Date(T0) });
  await p.clock.pauseAt(new Date(T0 + 200));
  await p.goto('http://localhost:' + (process.env.PORT || 8780) + '/stage/index.html?' + (process.env.TL ? 'tl=' + process.env.TL : '') + (process.env.PORTRAIT ? '&p=1' : '') + (process.env.TT1 ? '&tt1=1' : '') + (process.env.FS ? '&fs=1' : '') + (process.env.DK ? '&dk=1' + (process.env.DKSTART ? '&dkstart=' + process.env.DKSTART : '') : '') + (process.env.PK ? '&pk=' + process.env.PK + '&pay=' + (process.env.PAY || 1160) : ''));   // PORTRAIT=1 → 竖版
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(([dk, ph]) => { if (dk) { const f = document.getElementById('app'); f.style.width = ph ? '390px' : '1440px'; f.style.height = ph ? '844px' : '900px'; } return S.load(dk ? { app: '/web/index.html#lang=zh' } : { app: '/web/index.html#lang=zh', appT: '/web/index.html#lang=zh', appF: '/web/index.html#lang=zh' }); }, [!!process.env.DK, process.env.DKSTART === 'phone']);   // 显示器版只有一个网页，先按电脑版尺寸载入
  await p.clock.runFor(+(process.env.PRE || 3000));   // 网页启动：字体、开场弹窗（PRE 改短，开场弹窗就在镜头里出现）
  await p.evaluate(() => document.fonts.ready);
  const t0 = Date.now(); let shots = 0, warmed = +from <= 0;
  const n = Math.round(+to * FPS);
  for (let i = 0; i <= n; i++) {
    const t = i / FPS;
    const speed = await p.evaluate(t => S.speedAt(t), t);   // 有的镜头让网页时间快进（渡轮、海鸥）
    await p.clock.runFor(Math.round(1000 / FPS * speed));
    await p.evaluate(([t, dt]) => { S.frame(t, dt); return S.fontsReady(); }, [t, DT]);
    if (t + 1e-6 >= +from && !warmed) { warmed = true; await p.screenshot({ type: 'jpeg', quality: 10 }); }   // 跳过一段后的第一张整屏截图可能没画完：先截一张丢掉
    if (t + 1e-6 >= +from) { await p.screenshot({ path: path.join(out, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 93 }); shots++; }
    else await p.screenshot({ clip: { x: 0, y: 0, width: 8, height: 8 }, type: 'jpeg', quality: 10 });   // 不保存也要截：逼浏览器真的渲染一帧，跳过的片段和完整录制走得一模一样
  }
  if (process.env.SFX_LOG) { fs.writeFileSync(process.env.SFX_LOG, JSON.stringify(await p.evaluate(() => S.sfxLog), null, 1)); console.log('sfx events written to', process.env.SFX_LOG); }   // 音效时间表
  console.log(`frames ${shots}, ${((Date.now() - t0) / Math.max(1, shots)).toFixed(0)} ms/frame`);
  console.log('iframe perf.now', await p.evaluate(() => Math.round(S.win().performance.now())));
  await b.close();
})();
