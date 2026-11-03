/* 留学住宿通 · 60 秒版（59 秒，横版 / 竖版）—— 离线录屏包 2026-11-03
   配乐 AudioEra「Stylish Trailer Percussion」按小节重排（music/assemble-full.py 60）：
     bar 0–1 前奏 · 2–5 律动 A · 6 冲击 · 7–14 律动 B · 15 断拍 · 16–23 强段 C · 24–27 强段 D · 28 最后一下
   重点：答题匹配与推荐（半拍一题）· 通勤圈 · 日照 · 周边安全 · 抢房计划 · 工具拖到边上收起 · 天气 · 手机 → 折叠屏 → 平板
   录制：TL=timeline-t60 PRE=300 DATE=2026-11-03T12:00:00Z（竖版加 PORTRAIT=1 TT1=1） */
'use strict';
const BAR = 4 * 0.50026, LAG = 0.05;
const bar = n => n * BAR + LAG, at = (n, k) => bar(n) + k * BAR / 4;
const W = f => S.win(f), D_ = f => S.doc(f);
const vis = e => e && e.getBoundingClientRect().width > 0;
const byText = (sel, txt) => w => [...w.document.querySelectorAll(sel)].find(e => e.textContent.includes(txt) && vis(e));
const leafText = txt => w => [...w.document.querySelectorAll('button, a, span, div')].reverse().find(e => vis(e) && e.children.length === 0 && e.textContent.trim() === txt) ||
  [...w.document.querySelectorAll('button, a')].find(e => vis(e) && e.textContent.trim() === txt);
const scrollParent = el => { for (let p = el && el.parentElement; p; p = p.parentElement) { const cs = getComputedStyle(p); if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 4) return p; } return null; };
const scrollTo = (find, at) => [w => scrollParent(find(w)), (box, w) => { const r = find(w); return box.scrollTop + r.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight * at; }];
const setValue = v => el => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
const selectText = txt => el => { const o = [...el.options].find(o => o.text.includes(txt)); if (o) setValue(o.value)(el); };
const typeInto = (t0, t1, find, text) => S.during(t0, t1, u => {
  const el = typeof find === 'function' ? find(W()) : D_().querySelector(find); if (!el) return;
  const v = text.slice(0, Math.round(u * text.length));
  if (el.value !== v) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }
});
const homeById = (w, id) => w.eval('HOMES').find(x => x.id === id);
const studentsView = w => w.eval(`(() => { const xs = HOMES.map(h => h.p[0]), ys = HOMES.map(h => h.p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), ww = mapbox.clientWidth, hh = mapbox.clientHeight - 130;
  const zz = Math.max(1, Math.min(zmax(), Math.min(ww / ((x1 - x0 + 80) * fitK), hh / ((y1 - y0 + 80) * fitK))));
  return { z: zz, tx: ww / 2 - (x0 + x1) / 2 * fitK * zz, ty: 60 + hh / 2 - (y0 + y1) / 2 * fitK * zz }; })()`);
const jumpTo = (w, v) => w.eval(`z = ${v.z}; tx = ${v.tx}; ty = ${v.ty}; render(false);`);
/* 地图对准默西河上的渡轮（往前进的方向留一点空间） */
const riverView = w => w.eval(`(() => { const m = /translate\\(([-\\d.]+)[ ,]+([-\\d.]+)\\)/.exec(ferry.getAttribute('transform') || '');
  const fx = m ? +m[1] : (FA[0] + FB[0]) / 2, fy = m ? +m[2] : (FA[1] + FB[1]) / 2, zz = Math.min(zmax(), 2.6 / fitK);
  return { z: zz, tx: viewW * 0.62 - fx * fitK * zz, ty: viewH * 0.55 - fy * fitK * zz }; })()`);
const closeAll = () => { const w = W(); try { w.BookingTools.close(); } catch (e) {} try { w.HomeMatch.exit(); } catch (e) {} try { w.FunQuizzes.exit(); } catch (e) {} };
const P = (land, port) => (S.portrait ? port : land);
const FAST = { lead: 0.16, sfx: 'tick-s' };
S.tapSfx = 'tick';
const L = { x: 130, y: 360, w: 620, fade: 0.4 }, R = { x: 1190, y: 360, w: 640, fade: 0.4 };   // 标题在左 / 在右（竖版都在手机上方居中）
const HOME_A = 'true-liverpool', HOME_B = 'capital-gate';
const HALF = { lead: 0.12, sfx: 'tick-s' };
S.at(0.36, () => { for (const id of ['app', 'appT', 'appF']) { try { W(id).HomeMatch.exit(); } catch (e) { /* 没有 */ } } });
S.at(2.4, () => { for (const id of ['appT', 'appF']) { try { W(id).HomeMatch.exit(); jumpTo(W(id), studentsView(W(id))); } catch (e) { /* 没有 */ } } });
const replayDrop = t => S.at(t, () => { for (const a of D_().getAnimations()) { const el = a.effect && a.effect.target; if (el && el.classList && el.classList.contains('drop')) { a.__v = true; a.pause(); a.currentTime = 0; } } });
const quiz = (t0, step) => [['.hm-opt', '利物浦大学'], ['.hm-opt', '自己下厨'], ['.hm-opt', '熟悉的食材'], ['[data-hm=next]', ''], ['.hm-opt', '都可以'], ['.hm-opt', '图书馆'], ['.hm-opt', '公园'], ['[data-hm=next]', ''], ['.hm-opt', '早点休息'], ['.hm-opt', '15 分钟以内']]
  .forEach(([sel, txt], i) => S.tap(t0 + i * step, byText(sel, txt), HALF));
const walkRow = w => { const c = leafText('步行到利物浦大学')(w); if (!c) return null;
  return { getBoundingClientRect: () => { const r = c.getBoundingClientRect(), g = c.parentElement.getBoundingClientRect(); return { left: r.left, top: r.top, width: Math.min(g.right, w.innerWidth - 4) - r.left, height: r.height }; } }; };
const portraitCam = () => { if (S.portrait) { const f = S.tracks.cam; S.tracks.cam = t => { const c = f(t); return Object.assign({}, c, { y: Math.max(c.y, 540), s: 1 + (c.s - 1) * 0.5 }); }; } };
const MORPH_G = {
  G: { phone: { sw: 390, sh: 844, pad: 14, r: 53, R: 66, cx: 960, cy: 600, sc: 0.88 }, fold: { sw: 746, sh: 676, pad: 13, r: 32, R: 44, cx: 960, cy: 612, sc: 0.98 }, tablet: { sw: 1174, sh: 834, pad: 20, r: 28, R: 46, cx: 960, cy: 626, sc: 0.8 } },
  GP: { phone: { sw: 390, sh: 844, pad: 14, r: 53, R: 66, cx: 960, cy: 600, sc: 0.88 }, fold: { sw: 746, sh: 676, pad: 13, r: 32, R: 44, cx: 960, cy: 545, sc: 0.85 }, tablet: { sw: 1174, sh: 834, pad: 20, r: 28, R: 46, cx: 960, cy: 520, sc: 0.6 } }
};
const CL = { x: 820, y: 540, s: 1.12 }, CR = { x: 1110, y: 540, s: 1.12 };
const END = bar(28) + 2.9;
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  .hold(bar(3) - 0.3).to(bar(3), CR, 'apple').hold(bar(4) - 0.3)            // 天气（右）
  .to(bar(4), CL, 'apple').hold(bar(9) - 0.3)                                 // 生活选房（左）
  .to(bar(9), CR, 'apple').hold(bar(10) - 0.3)                                // 推荐（右）
  .to(bar(10), { x: 820, y: 500, s: 1.2 }, 'apple').hold(bar(11) - 0.3)       // 对比（左）
  .to(bar(11), CR, 'apple').hold(bar(13) - 0.3)                               // 通勤（右）
  .to(bar(13), { x: 1118, y: 540, s: 1.34 }, 'io').hold(bar(15))             // 看列表 → 断拍推近
  .to(bar(16) + 0.4, { x: 820, y: 470, s: 1.2 }, 'apple').hold(bar(19) - 0.3) // 日照（左）
  .to(bar(19), CR, 'apple').hold(bar(21) - 0.3)                               // 周边安全（右）
  .to(bar(21), CL, 'apple').hold(bar(24) - 0.3)                               // 抢房（左）
  .to(bar(24), CR, 'apple').hold(bar(26) - 0.3)                               // 收起（右）
  .to(bar(26), { x: 960, y: 540, s: 1 }, 'apple').fn();
portraitCam();
S.tracks.phone = K(0, { x: 0, y: 1150, s: 0.94, rx: 14 }).hold(bar(2)).to(bar(3), { y: 0, s: 1, rx: 0 }, 'apple')
  .hold(bar(26)).to(bar(26) + 0.3, { x: 0, y: 60, s: 0.88 }, 'apple').fn();
S.morph = Object.assign({ t0: bar(26) + 0.3, t1: bar(27), t2: at(27, 1.5), t3: bar(28) - 0.1 }, MORPH_G);
S.tracks.veil = K(0, { o: 0 }).hold(END - 1.2).to(END, { o: 1 }, 'in').fn();

/* 前奏 → 手机升起，房屋落下 */
S.title(0.3, bar(2), { h: '在利物浦，<br>找到你的家。', cls: 'c big', x: 360, y: 395, w: 1200, fade: 0.6 });
S.sfx(bar(2), 'whoosh-up', 0.7);
replayDrop(bar(2) + 0.9);
/* 天气 */
S.tap(bar(3), '.wx-chip', { sfx: 'pop' });
S.title(bar(3), bar(4) - 0.15, Object.assign({ k: '利物浦天气', h: '出门前，<br>先看看天气。', s: '温度、降雨、天黑时间。' }, R));
S.tap(bar(4) - 0.25, w => [...w.document.querySelectorAll('.wx-pop button')].find(b => vis(b) && b.textContent.trim() === '×'), { lead: 0.15, sfx: 'tick-s' });   // 关掉天气卡
/* 选房指南 → 生活选房：半拍一题，网页快 2.6 倍 */
S.at(bar(4), () => { try { W().HomeMatch.open(); } catch (e) { /* 没有 */ } });
S.tap(at(5, 0), leafText('开始生活选房'), HALF);
S.speed(at(5, 0), bar(8) - 0.3, 2.6, 0.15);
quiz(at(5, 1), BAR / 8);   // 十下，每八分音符一下，约 2.5 秒
S.sfx(bar(6), 'hit', 0.45);
S.title(bar(4), bar(8) - 0.15, Object.assign({ k: '按生活选房', h: '8 个问题，<br>帮你匹配房源。', s: '怎么吃、在哪学、周末怎么过。' }, L));
S.sfx(bar(8) - 0.3, 'pop', 0.8);
/* 推荐理由 → 并排对比 */
S.scroll(bar(8), at(8, 3), ...scrollTo(byText('.why2 li', '亚洲食材'), 0.3));
S.title(bar(8), bar(10) - 0.15, Object.assign({ k: '推荐房源', h: '推荐 3 处，<br>理由写清楚。', s: '离超市、亚洲食材店、图书馆各走几分钟。' }, R));
S.scroll(at(9, 1), at(9, 3), ...scrollTo(byText('button', '并排对比这'), 0.55));
S.tap(bar(10), byText('button', '并排对比这'), { lead: 0.12, sfx: 'pop' });
S.mark(at(10, 1), bar(11) - 0.3, walkRow, { pad: 2 });
S.title(bar(10), bar(11) - 0.15, Object.assign({ k: '一键对比', h: '到学校各走几分钟，<br>一眼看清。' }, L));
/* 通勤圈 */
S.at(bar(11) - 0.2, () => { const x = D_().getElementById('cmpX'); if (x && vis(x)) x.click(); closeAll(); });
S.tap(bar(11), byText('.hi-bar-b', '通勤'), { lead: 0.12, sfx: 'pop' });
S.tap(at(11, 1.5), byText('.bt-chipbtn', '15 分钟'), HALF);
S.tap(at(11, 2.5), byText('.bt-btn', '在地图上看'), HALF);
S.sfx(at(11, 2.7), 'whoosh', 0.5);
S.title(bar(11), bar(15) - 0.2, Object.assign({ k: '通勤时间圈', h: '上课，<br>想住多近？', s: '步行 15 分钟内到利物浦大学。' }, R));
S.tap(bar(13), byText('.bt-btn', '看列表'));
S.scroll(at(13, 1), at(14, 0), ...scrollTo(byText('.qc-home', 'true Liverpool'), 0.42));
/* 断拍 bar 15：选中 true Liverpool */
S.tap(at(15, 0.5), byText('.qc-home', 'true Liverpool'));
S.at(at(15, 2.6), () => { const c = byText('.bt-link', '清除')(W()); if (c) c.click(); });
/* 重拍 bar 16：日照 */
S.tap(bar(16), byText('.hi-rb', '日照'), { lead: 0.25, sfx: 'pop' });
S.sfx(bar(16), 'hit', 0.55);
S.tap(at(16, 2), byText('.hi-panel .bt-chipbtn', '今天'), HALF);
S.slide(bar(17), bar(18) - 0.2, '.hi-panel input[type=range]', 720, 630);
S.slide(bar(18) + 0.1, bar(19) - 0.3, '.hi-panel input[type=range]', 630, 860);
S.title(bar(16), bar(19) - 0.15, Object.assign({ k: '日照', h: '看看下午的光。', s: '拖动一天里的时间。' }, L));
/* 周边安全 */
S.tap(bar(19) - 0.25, '.hi-back', { lead: 0.15, sfx: 'tick-s' });
S.scroll(bar(19), at(19, 1.4), ...scrollTo(byText('.bt-tool', '周边报告'), 0.5));
S.tap(at(19, 2), byText('.bt-tool', '周边报告'), { lead: 0.15, sfx: 'pop' });
S.tap(bar(20), '[data-tab=safety]', { inner: '.full83-report-frame', lead: 0.15 });
S.title(bar(19), bar(21) - 0.15, Object.assign({ k: '周边安全', h: '住进去之前，<br>先看看周边。', s: '公开记录按类型分组，和住处相关的占多少。' }, R));
/* 抢房计划 */
S.at(bar(21) - 0.2, () => closeAll());
S.scroll(bar(21) - 0.1, at(21, 1.4), ...scrollTo(byText('.bt-tool', '抢房准备'), 0.5));
S.tap(at(21, 2), byText('.bt-tool', '抢房准备'), { lead: 0.15, sfx: 'pop' });
S.tap(bar(22), byText('button', '加入计划'), HALF);
S.tap(at(22, 1.5), byText('.bp-tabs .br-tab', '抢房计划'), HALF);
S.tap(bar(23), byText('.bp-room', '独卫单间'), HALF);
S.tap(at(23, 1), byText('.bp-room', '单人公寓'), HALF);
S.title(bar(21), bar(24) - 0.15, Object.assign({ k: '抢房准备', h: '开放前，<br>排好要订哪间。' }, L));
/* 工具都能拖到边上收起 */
S.at(bar(24) - 0.2, () => { closeAll(); try { W().hide(); } catch (e) {} const c = D_().getElementById('cardX'); if (c && vis(c)) c.click(); const t = byText('button, a', '清空')(W()); if (t) t.click(); });   // 对比栏也清掉
S.mapGlide(bar(24) - 0.1, 1.0, studentsView);
S.drag(at(24, 2), at(25, 1), '.hi-bar .hi-handle', -460, 30, { ax: 6, ay: 8 });
S.sfx(at(25, 1.1), 'whoosh', 0.45);
S.title(bar(24), bar(26) - 0.15, Object.assign({ k: '界面全收起', h: '一拖到边，<br>只看地图。', s: '工具收成小箭头，点一下就回来。' }, R));
/* 手机 → 折叠屏 → 平板，片名落在最后一下 */
S.sfx(S.morph.t0 + 0.1, 'whoosh-up', 0.55);
S.sfx(S.morph.t2 + 0.1, 'whoosh-up', 0.55);
S.title(bar(26) + 0.2, bar(28) - 0.15, { k: '全设备适配', h: '手机 · 折叠屏 · 平板', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.35 });
S.sfx(bar(28), 'hit', 0.9);
S.title(bar(28), END + 1, { h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.4 });
