/* 留学住宿通 · 30 秒显示器版（竖屏 31 秒）—— 显示器上的电脑版网页；镜头推近到功能演示，有特色的加标注；最后拉远，变成手机、平板。
   配乐（music/assemble-full.py 30）：bar 0 前奏 · 1–2 律动 A · 3–6 律动 B · 7 断拍 · 8–11 强段 C · 12–13 强段 D · 14 最后一下
   录制：PORTRAIT=1 DK=1 TL=timeline-d30 PRE=300 DATE=2026-11-03T12:00:00Z */
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
const END30 = bar(14) + 2.9;
const T = (n0, n1, o) => S.title(bar(n0) + 0.02, bar(n1) - 0.12, Object.assign(o, { fade: 0.25 }));
const CLOSE = () => { closeAll(); try { W().hide(); } catch (e) {} const c = D_().getElementById('cardX'); if (c && vis(c)) c.click(); };
const F = (fx, fy, k) => ({ fx, fy, k });
const CAM = (t, target, dur, ease) => S.cam(t - (dur || 0.5), dur || 0.5, target, ease || 'apple');   // 镜头在 t 这一刻到位
/* 报告里的元素（嵌在 iframe 里）：换成网页坐标 */
const inner = (frameSel, find) => w => { const f = w.document.querySelector(frameSel); if (!f || !f.contentDocument) return null; const e = find(f.contentWindow); if (!e) return null; const o = f.getBoundingClientRect();
  return { getBoundingClientRect: () => { const r = e.getBoundingClientRect(); return { left: r.left + o.left, top: r.top + o.top, width: r.width, height: r.height }; } }; };
const panelClose = name => w => { const h = [...w.document.querySelectorAll('h2, h3, div, strong')].find(e => vis(e) && e.children.length === 0 && e.textContent.trim() === name); const p = h && h.closest('section, aside, div[class]'); return p && [...p.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim() === '收起'); };
const closeSheets = () => { for (const c of D_().querySelectorAll('.closeSheet, button')) if (vis(c) && (c.classList.contains('closeSheet') || ['关闭', '收起'].includes(c.textContent.trim())) && c.closest('#homesPanel, .sheet, aside, section')) c.click(); };
S.tracks.rise = K(0, { y: 1000 }).hold(0.1).to(bar(1) - 0.3, { y: 0 }, 'apple').fn();
S.tracks.veil = K(0, { o: 0 }).hold(END30 - 1.0).to(END30, { o: 1 }, 'in').fn();
S.title(0.15, bar(1) - 0.1, { h: '在利物浦<br>找到你的家', cls: 'c big', fade: 0.4 });
S.sfx(0.2, 'whoosh-up', 0.7);
replayDrop(bar(1) - 0.9);
/* bar 1–2：生活选房，八分音符一题 */
S.at(bar(1) - 0.45, () => { try { W().HomeMatch.open(); } catch (e) {} });
CAM(bar(1), F(720, 420, 1.55));
S.tap(at(1, 0.4), leafText('开始生活选房'), HALF);
S.speed(at(1, 0.4), bar(3), 3, 0.1);
quiz(at(1, 0.8), BAR / 8);
S.sfx(at(2, 2.4), 'pop', 0.8);
T(1, 3, { k: '按生活选房', h: '8个问题 帮你匹配房源' });
/* bar 3：推荐理由 */
CAM(at(2, 3), S.focus('.why2', 1.75, { dy: -120 }), 0.6);
S.scroll(at(2, 3.2), at(3, 1.4), ...scrollTo(byText('.why2 li', '亚洲食材'), 0.45));
S.note(at(3, 0.2), at(3, 3.6), '.why2', '按你的答案 写出推荐理由', { pos: 'top', pad: 8 });
T(3, 4, { k: '推荐房源', h: '推荐3处 理由写清楚' });
/* bar 4–5：通勤圈 */
S.at(bar(4) - 0.15, () => closeAll());
CAM(bar(4), F(720, 430, 1.5), 0.5);
S.tap(at(4, 0.2), byText('.hi-bar-b', '通勤'), { lead: 0.12, sfx: 'pop' });
S.tap(at(4, 1.2), byText('.bt-chipbtn', '15 分钟'), HALF);
S.tap(at(4, 2.2), byText('.bt-btn', '在地图上看'), HALF);
CAM(at(5, 0), F(650, 470, 1.15), 0.9);
S.note(at(5, 0.2), at(5, 3.6), w => ({ getBoundingClientRect: () => ({ left: 500, top: 300, width: 320, height: 300 }) }), '步行15分钟能到的范围', { pos: 'top', box: false });
T(4, 6, { k: '通勤时间圈', h: '上课想住多近' });
/* bar 6：周边安全 */
S.at(bar(6) - 0.15, () => { const c = byText('.bt-link', '清除')(W()); if (c) c.click(); closeAll(); W().show(homeById(W(), HOME_A), true); });
CAM(bar(6), F(895, 450, 1.55), 0.45);
S.scroll(at(6, 0.1), at(6, 0.6), ...scrollTo(byText('.bt-tool', '周边报告'), 0.5));
S.tap(at(6, 0.9), byText('.bt-tool', '周边报告'), { lead: 0.12, sfx: 'pop' });
CAM(at(6, 1.8), F(720, 470, 1.4), 0.5);
S.tap(at(6, 2.4), '[data-tab=safety]', { inner: '.full83-report-frame', lead: 0.12 });
S.note(at(6, 2.7), bar(7) - 0.1, inner('.full83-report-frame', w => w.document.querySelector('[data-tab=safety]')), '公开记录 按类型统计', { pos: 'bottom', pad: 6 });
T(6, 7, { k: '周边安全', h: '住进去之前 先看看周边' });
/* bar 7（断拍）安静度 → bar 8（重拍）日照 */
S.at(bar(7) - 0.15, () => { closeAll(); W().show(homeById(W(), HOME_A), true); });
CAM(bar(7) + 0.2, F(830, 300, 1.5), 0.6);
S.tap(at(7, 0.8), byText('.hi-rb', '安静度'), { lead: 0.15, sfx: 'pop' });
T(7, 8, { k: '安静度', h: '离主路铁路多远' });
S.tap(bar(8), byText('.hi-rb', '日照'), { lead: 0.25, sfx: 'pop' });
S.sfx(bar(8), 'hit', 0.55);
CAM(bar(8) + 0.5, F(560, 420, 1.35), 0.6);
S.tap(at(8, 1.2), byText('.hi-panel .bt-chipbtn', '今天'), HALF);
S.slide(at(8, 2), at(8, 3.6), '.hi-panel input[type=range]', 720, 630);
S.slide(at(9, 0.2), at(9, 3.4), '.hi-panel input[type=range]', 630, 860);
S.note(at(8, 1.8), at(9, 3.6), '.hi-panel input[type=range]', '拖一下 看一天的光', { pos: 'bottom', pad: 8 });
T(8, 10, { k: '日照', h: '看看下午的光' });
/* bar 10–11：拉远看整台显示器，界面全收起 */
S.at(bar(10) - 0.15, () => { CLOSE(); const t = byText('button, a', '清空')(W()); if (t) t.click(); });
CAM(bar(10), 'fit', 0.8);
S.tap(at(10, 0.4), panelClose('公寓列表'), HALF);
S.tap(at(10, 1.0), panelClose('找公寓'), HALF);
S.drag(at(10, 1.6), at(10, 3.1), '.hi-bar .hi-handle', -760, 40, { ax: 6, ay: 8 });
S.sfx(at(10, 3.2), 'whoosh', 0.45);
T(10, 11, { k: '界面全收起', h: '一拖到边 只看地图' });
S.mapGlide(bar(11) - 0.2, 2.2, studentsView);
T(11, 12, { k: '电脑版', h: '大屏幕 一眼看全' });
/* bar 12–13：变成手机、平板 */
S.geom(bar(12) - 0.2, 2.1, 'phone', 'apple');
S.cam(bar(12) - 0.2, 2.1, 'fit', 'apple');
S.sfx(bar(12) - 0.1, 'whoosh-up', 0.55);
S.during(bar(12) - 0.2, bar(12) + 2.0, () => { if (W().innerWidth < 1000) for (const id of ['homesPanel', 'controls']) { const e = D_().getElementById(id); if (e) e.classList.remove('collapsed'); } });
S.geom(bar(13) + 0.1, 1.8, 'tablet', 'apple');
S.cam(bar(13) + 0.1, 1.8, 'fit', 'apple');
S.sfx(bar(13) + 0.2, 'whoosh-up', 0.55);
T(12, 14, { k: '全设备适配', h: '电脑 手机 平板' });
S.sfx(bar(14), 'hit', 0.9);
S.title(bar(14), END30 + 1, { h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'c end', fade: 0.35 });
