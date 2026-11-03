/* 留学住宿通 · 60 秒显示器版（竖屏 59 秒）—— 一开头是显示器上的电脑版网页；镜头推近到一个个功能演示，有特色的加标注；
   最后镜头拉远看整台显示器，同一个网页变成手机、再变成平板。字幕不加标点，放在上面偏中间。
   配乐 AudioEra「Stylish Trailer Percussion」（music/assemble-full.py 60）：bar 0–1 前奏 · 2–5 律动 A · 6 冲击 · 7–14 律动 B · 15 断拍 · 16–23 强段 C · 24–27 强段 D · 28 最后一下
   录制：PORTRAIT=1 DK=1 TL=timeline-d60 PRE=300 DATE=2026-11-03T12:00:00Z */
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
const END = bar(28) + 2.9;
const T = (n0, n1, o) => S.title(bar(n0) + 0.02, bar(n1) - 0.12, Object.assign(o, { fade: 0.25 }));
const CLOSE = () => { closeAll(); try { W().hide(); } catch (e) {} const c = D_().getElementById('cardX'); if (c && vis(c)) c.click(); };
const F = (fx, fy, k) => ({ fx, fy, k });
const CAM = (t, target, dur, ease) => S.cam(t - (dur || 0.5), dur || 0.5, target, ease || 'apple');   // 镜头在 t 这一刻到位
/* 报告里的元素（嵌在 iframe 里）：换成网页坐标 */
const inner = (frameSel, find) => w => { const f = w.document.querySelector(frameSel); if (!f || !f.contentDocument) return null; const e = find(f.contentWindow); if (!e) return null; const o = f.getBoundingClientRect();
  return { getBoundingClientRect: () => { const r = e.getBoundingClientRect(); return { left: r.left + o.left, top: r.top + o.top, width: r.width, height: r.height }; } }; };
S.tracks.rise = K(0, { y: 1000 }).hold(0.25).to(bar(1) + 0.3, { y: 0 }, 'apple').fn();
S.tracks.veil = K(0, { o: 0 }).hold(END - 1.2).to(END, { o: 1 }, 'in').fn();

/* bar 0–1：大标题，显示器升起，房屋落下（电脑版网页） */
S.title(0.2, bar(1) + 0.6, { h: '在利物浦<br>找到你的家', cls: 'c big', fade: 0.45 });
S.sfx(0.3, 'whoosh-up', 0.7);
replayDrop(bar(1) - 0.4);
/* bar 2：推近天气 */
CAM(bar(2), S.focus('.wx-chip', 2.2), 0.7);
S.tap(at(2, 0.4), '.wx-chip', { lead: 0.15, sfx: 'pop' });
S.tap(at(2, 3.3), w => [...w.document.querySelectorAll('.wx-pop button')].find(b => vis(b) && b.textContent.trim() === '×'), HALF);
T(2, 3, { k: '利物浦天气', h: '出门前先看天气' });
/* bar 3–4：生活选房，八分音符一题 */
S.at(bar(3) - 0.5, () => { try { W().HomeMatch.open(); } catch (e) {} });
CAM(bar(3), F(720, 420, 1.55));
S.tap(at(3, 0.6), leafText('开始生活选房'), HALF);
S.speed(at(3, 0.6), bar(5), 3, 0.1);
quiz(at(3, 1), BAR / 8);
S.sfx(at(4, 2.6), 'pop', 0.8);
T(3, 5, { k: '按生活选房', h: '8个问题 帮你匹配房源' });
/* bar 5：推荐理由（左边的选房卡）→ bar 6（冲击）并排对比 */
CAM(at(4, 3), S.focus('.why2', 1.75, { dy: -120 }), 0.6);
S.scroll(at(4, 3.2), at(5, 1.2), ...scrollTo(byText('.why2 li', '亚洲食材'), 0.45));
S.note(at(5, 0.2), at(5, 3.2), '.why2', '按你的答案 写出推荐理由', { pos: 'top', pad: 8 });
T(5, 6, { k: '推荐房源', h: '推荐3处 理由写清楚' });
S.tap(at(5, 3.3), byText('button', '并排对比这'), { lead: 0.12, sfx: 'pop' });
CAM(bar(6) + 0.1, F(600, 430, 1.5), 0.45);
S.sfx(bar(6), 'hit', 0.45);
S.note(at(6, 0.4), bar(7) - 0.25, walkRow, '到学校各走几分钟', { pos: 'bottom', pad: 3 });
T(6, 7, { k: '一键对比', h: '三处公寓 一屏看懂' });
/* bar 7–9：通勤圈 → 地图上的范围 → 看列表 → true Liverpool */
S.at(bar(7) - 0.15, () => { const x = D_().getElementById('cmpX'); if (x && vis(x)) x.click(); closeAll(); });
CAM(bar(7), F(720, 430, 1.5), 0.5);
S.tap(at(7, 0.2), byText('.hi-bar-b', '通勤'), { lead: 0.12, sfx: 'pop' });
S.tap(at(7, 1.2), byText('.bt-chipbtn', '15 分钟'), HALF);
S.tap(at(7, 2.2), byText('.bt-btn', '在地图上看'), HALF);
CAM(at(8, 0), F(650, 470, 1.15), 0.9);
S.note(at(8, 0.2), at(8, 1.9), w => ({ getBoundingClientRect: () => ({ left: 500, top: 300, width: 320, height: 300 }) }), '步行15分钟能到的范围', { pos: 'top', box: false });
S.tap(at(8, 2), byText('.bt-btn', '看列表'), HALF);
CAM(at(8, 2.6), F(1060, 440, 1.6), 0.5);
S.scroll(at(8, 2.7), at(9, 0.6), ...scrollTo(byText('.qc-home', 'true Liverpool'), 0.42));
S.tap(at(9, 1), byText('.qc-home', 'true Liverpool'), HALF);
T(7, 10, { k: '通勤时间圈', h: '上课想住多近' });
/* bar 10–12：周边报告 → 周边安全 → 吃饭 */
S.at(bar(10) - 0.15, () => { const c = byText('.bt-link', '清除')(W()); if (c) c.click(); closeAll(); W().show(homeById(W(), HOME_A), true); });
CAM(bar(10), F(895, 450, 1.55), 0.5);
S.scroll(at(10, 0.2), at(10, 1), ...scrollTo(byText('.bt-tool', '周边报告'), 0.5));
S.tap(at(10, 1.4), byText('.bt-tool', '周边报告'), { lead: 0.12, sfx: 'pop' });
CAM(at(10, 2.2), F(720, 470, 1.4), 0.5);
S.tap(bar(11), '[data-tab=safety]', { inner: '.full83-report-frame', lead: 0.12 });
S.note(at(11, 0.5), at(11, 3.6), inner('.full83-report-frame', w => w.document.querySelector('[data-tab=safety]')), '公开记录 按类型统计', { pos: 'bottom', pad: 6 });
S.tap(bar(12), '[data-tab=food]', { inner: '.full83-report-frame', lead: 0.12 });
T(10, 13, { k: '周边安全 吃饭', h: '住进去之前 先看看周边' });
/* bar 13–14：订房专家群（群码在 bar 14 回传；网页 1.3 秒后才可以回传，那一拍点「刷新」） */
S.at(bar(13) - 0.15, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
CAM(bar(13), F(895, 450, 1.55), 0.5);
S.tap(at(13, 0.3), '#card .cta', HALF);
CAM(at(13, 1.4), F(330, 450, 1.65), 0.5);
S.tap(bar(14) - 1.42, byText('.f83-button', '申请我的专家群'), HALF);
S.tap(bar(14) - 0.04, w => [...w.document.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim() === '刷新'), { lead: 0.25, sfx: false });
S.sfx(bar(14), 'ding', 1);
T(13, 15, { k: '订房专家', h: '一键连上订房专家', s: '演示群码 不会加入真实群聊' });
/* bar 15（断拍）：安静度 → bar 16（重拍）：日照 */
S.at(bar(15) - 0.15, () => { const m = byText('.f83-button', '收起')(W()); if (m) m.click(); closeAll(); W().show(homeById(W(), HOME_A), true); });
CAM(bar(15) + 0.2, F(830, 300, 1.5), 0.6);
S.tap(at(15, 0.8), byText('.hi-rb', '安静度'), { lead: 0.15, sfx: 'pop' });
T(15, 16, { k: '安静度', h: '离主路铁路多远' });
S.tap(bar(16), byText('.hi-rb', '日照'), { lead: 0.25, sfx: 'pop' });
S.sfx(bar(16), 'hit', 0.55);
CAM(bar(16) + 0.5, F(560, 420, 1.35), 0.6);
S.tap(at(16, 1.2), byText('.hi-panel .bt-chipbtn', '今天'), HALF);
S.slide(at(16, 2), at(16, 3.6), '.hi-panel input[type=range]', 720, 630);
S.slide(at(17, 0.2), at(17, 3.4), '.hi-panel input[type=range]', 630, 860);
S.note(at(16, 1.8), at(17, 3.6), '.hi-panel input[type=range]', '拖一下 看一天的光', { pos: 'bottom', pad: 8 });
T(16, 18, { k: '日照', h: '看看下午的光' });
/* bar 18–19：抢房准备 → 计划 → 分享二维码 */
S.at(bar(18) - 0.15, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
CAM(bar(18), F(895, 450, 1.55), 0.5);
S.scroll(at(18, 0.1), at(18, 0.8), ...scrollTo(byText('.bt-tool', '抢房准备'), 0.5));
S.tap(at(18, 1), byText('.bt-tool', '抢房准备'), { lead: 0.12, sfx: 'pop' });
CAM(at(18, 2.3), S.focus('.bp-tabs', 1.5, { dy: 260 }), 0.6);
S.tap(at(18, 2), byText('button', '加入计划'), HALF);
S.tap(at(18, 3), byText('.bp-tabs .br-tab', '抢房计划'), HALF);
S.tap(at(19, 0), byText('.bp-room', '独卫单间'), HALF);
S.tap(at(19, 0.5), byText('.bp-room', '单人公寓'), HALF);
S.scroll(at(19, 1), at(19, 2), ...scrollTo(byText('.bp-mp > .bt-btn', '分享'), 0.35));
S.tap(at(19, 2.4), byText('.bp-mp > .bt-btn', '分享'), { lead: 0.12, sfx: 'pop' });
S.note(at(19, 2.6), bar(20) - 0.2, w => w.document.querySelector('.bp-mp-card') || byText('.bp-mp > .bt-btn', '分享')(w), '朋友扫码 一起抢', { pos: 'top', pad: 6 });
T(18, 20, { k: '抢房准备', h: '排好要订哪间 分享给朋友' });
/* bar 20–21：界面全收起：两边的面板收起，工具栏拖到边上 */
S.at(bar(20) - 0.15, () => { CLOSE(); const t = byText('button, a', '清空')(W()); if (t) t.click(); });
CAM(bar(20), 'fit', 0.7);
S.tap(at(20, 0.4), w => { const h = [...w.document.querySelectorAll('h2, h3, div, strong')].find(e => vis(e) && e.children.length === 0 && e.textContent.trim() === '公寓列表'); const p = h && h.closest('section, aside, div[class]'); return p && [...p.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim() === '收起'); }, HALF);
S.tap(at(20, 1.1), w => { const h = [...w.document.querySelectorAll('h2, h3, div, strong')].find(e => vis(e) && e.children.length === 0 && e.textContent.trim() === '找公寓'); const p = h && h.closest('section, aside, div[class]'); return p && [...p.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim() === '收起'); }, HALF);
S.drag(at(20, 1.8), at(20, 3.4), '.hi-bar .hi-handle', -760, 40, { ax: 6, ay: 8 });
S.sfx(at(20, 3.5), 'whoosh', 0.45);
T(20, 22, { k: '界面全收起', h: '一拖到边 只看地图' });
/* bar 22–23：镜头拉远，整台显示器 */
S.mapGlide(bar(22), 3.6, studentsView);
T(22, 24, { k: '电脑版', h: '大屏幕 一眼看全' });
/* bar 24–27：同一个网页变成手机，再变成平板 */
S.geom(bar(24) - 0.2, 2.6, 'phone', 'apple');
S.cam(bar(24) - 0.2, 2.6, 'fit', 'apple');
S.sfx(bar(24) - 0.1, 'whoosh-up', 0.55);
const closeSheets = () => { for (const c of D_().querySelectorAll('.closeSheet, button')) if (vis(c) && (c.classList.contains('closeSheet') || ['关闭', '收起'].includes(c.textContent.trim())) && c.closest('#homesPanel, .sheet, aside, section')) c.click(); };
S.during(bar(24) - 0.2, bar(24) + 2.6, () => { if (W().innerWidth < 1000) for (const id of ['homesPanel', 'controls']) { const e = D_().getElementById(id); if (e) e.classList.remove('collapsed'); } });   // 网页窄到手机版时，把电脑版收起的面板放回原样：手机上它们本来就是收着的   // 变成手机后，收起的面板会变成底部抽屉：关掉，只看地图
T(24, 26, { k: '手机版', h: '打开手机就能用' });
S.geom(bar(26) - 0.2, 2.6, 'tablet', 'apple');
S.cam(bar(26) - 0.2, 2.6, 'fit', 'apple');
S.sfx(bar(26) - 0.1, 'whoosh-up', 0.55);
T(26, 28, { k: '全设备适配', h: '电脑 手机 平板' });
/* bar 28：片名 */
S.sfx(bar(28), 'hit', 0.9);
S.title(bar(28), END + 1, { h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'c end', fade: 0.35 });
