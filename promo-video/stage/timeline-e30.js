/* 留学住宿通 · 30 秒卖点版（竖屏 31 秒）—— 显示器上的电脑版网页，镜头推近逐个演示五个卖点，最后变成手机、平板
   ① 不用留联系方式，群码自动弹出（落在 bar 3）② 实时天气 ③ 地图实时缩放 · 界面全收起
   ④ 通勤细到院系 · 日照（落在重拍 bar 8）· 多设备 ⑤ 抢房：开放提醒 · 订房专家一起盯
   拍子：小节线用实测时间（DB），点按落在底鼓 3+3+2 的重音上（第 1、2.5、4 拍）
   录制：PORTRAIT=1 DK=1 TL=timeline-e30 PRE=300 DATE=2026-11-03T12:00:00Z */
'use strict';
/* 每小节第一拍用实测时间（music/downbeat-table.py：底鼓起音）；拍子在小节里均分。这首的底鼓是 3+3+2：第 1、2.5、4 拍（at(n, 0 / 1.5 / 3)）是重音 */
const DB = [0.0232, 2.0434, 4.0519, 6.043, 8.0399, 10.0397, 12.0454, 14.0336, 16.0334, 18.039, 20.033, 22.0357, 24.0588, 26.0325, 28.0381, 30.0391, 32.0402];
const BAR = 4 * 0.50026;
const bar = n => DB[n], at = (n, k) => DB[n] + k * (DB[n + 1] - DB[n]) / 4;
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

/* 镜头快慢跟着音乐走：重拍一下到位，律动段短而快，断拍整小节慢慢推近，强段两小节一句、停留时镜头慢慢呼吸 */
const SNAP = (t, tg) => CAM(t, tg, 0.2, 'out5');
const QUICK = (t, tg) => CAM(t, tg, 0.32, 'out');
const SMOOTH = (t, tg) => CAM(t, tg, 0.7, 'apple');
const CREEP = (t0, t1, tg) => S.cam(t0, t1 - t0, tg, 'io');
const DRIFT = (t0, t1, f, dx, dy) => S.cam(t0, t1 - t0, (w, g, c) => ({ fx: c.fx + (dx || 0), fy: c.fy + (dy || 0), k: c.k * f }), 'io');
const PUNCH = (t, f) => S.cam(t, 0.3, (w, g, c) => ({ fx: c.fx, fy: c.fy, k: c.k * f }), 'out5');
/* 报告里的元素（嵌在 iframe 里）：换成网页坐标 */
const inner = (frameSel, find) => w => { const f = w.document.querySelector(frameSel); if (!f || !f.contentDocument) return null; const e = find(f.contentWindow); if (!e) return null; const o = f.getBoundingClientRect();
  return { getBoundingClientRect: () => { const r = e.getBoundingClientRect(); return { left: r.left + o.left, top: r.top + o.top, width: r.width, height: r.height }; } }; };
const leafIn = (scope, txt) => w => [...w.document.querySelectorAll(scope + ' *')].find(e => vis(e) && e.children.length === 0 && e.textContent.includes(txt));
const panelClose = name => w => { const h = [...w.document.querySelectorAll('h2, h3, div, strong')].find(e => vis(e) && e.children.length === 0 && e.textContent.trim() === name); const p = h && h.closest('section, aside, div[class]'); return p && [...p.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim() === '收起'); };
const unfoldOnPhone = (t0, t1) => S.during(t0, t1, () => { if (W().innerWidth < 1000) for (const id of ['homesPanel', 'controls']) { const e = D_().getElementById(id); if (e) e.classList.remove('collapsed'); } });   // 网页窄到手机版时，把电脑版收起的面板放回原样
const closeInbox = () => { const m = byText('.f83-button', '收起')(W()); if (m) m.click(); };
const clearCompare = () => { const x = D_().getElementById('cmpX'); if (x && vis(x)) x.click(); const c = byText('button, a', '清空')(W()); if (c) c.click(); };
const refresh = w => [...w.document.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim() === '刷新');
const emailBox = w => [...w.document.querySelectorAll('.bt-box input')].find(e => vis(e) && (e.type === 'email' || /example/.test(e.placeholder || '')));
S.tracks.rise = K(0, { y: 1000 }).hold(0.25).to(bar(1) + 0.3, { y: 0 }, 'apple').fn();
S.tracks.veil = K(0, { o: 0 }).hold(END30 - 1.0).to(END30, { o: 1 }, 'in').fn();
S.title(0.15, bar(1) - 0.1, { h: '在利物浦<br>找到你的家', cls: 'c big', fade: 0.4 });
S.sfx(0.2, 'whoosh-up', 0.7);
replayDrop(bar(1) - 0.9);
/* ② bar 1：实时天气 */
QUICK(bar(1), S.focus('.wx-chip', 2.2));
S.tap(at(1, 0), '.wx-chip', { lead: 0.15, sfx: 'pop' });
S.note(at(1, 0.6), at(1, 3.3), '.wx-pop', '温度 降雨 天黑时间', { pos: 'bottom', pad: 4 });
S.tap(at(1, 3.5), w => [...w.document.querySelectorAll('.wx-pop button')].find(b => vis(b) && b.textContent.trim() === '×'), HALF);
T(1, 2, { k: '实时天气', h: '出门前先看天气' });
/* ① bar 2 → bar 3：不用留联系方式，群码自动弹出 */
S.at(bar(2) - 0.15, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
QUICK(bar(2), F(895, 450, 1.55));
S.tap(at(2, 0), '#card .cta', HALF);
QUICK(at(2, 1.25), F(330, 450, 1.65));
S.tap(at(2, 1.0), byText('.f83-button', '申请我的专家群'), HALF);
S.tap(bar(3) - 0.02, refresh, { lead: 0.25, sfx: false });
S.sfx(bar(3), 'ding', 1);
PUNCH(bar(3), 1.07);
T(2, 4, { k: '一键联系', h: '不用留任何联系方式', s: '群码自动弹出 演示码不会加入真实群聊' });
/* ③ bar 4：地图实时缩放 */
S.at(bar(4) - 0.15, () => { closeInbox(); CLOSE(); });
QUICK(bar(4), F(900, 450, 1.0));
[0, 1.5, 3].forEach(k => S.tap(at(4, k), '#zin', HALF));
S.mapGlide(at(4, 3.3), 0.7, studentsView, 'io');
T(4, 5, { k: '地图实时缩放', h: '房子在哪 一眼看到' });
/* ④ bar 5–6：通勤时间，细到院系 */
S.tap(at(5, 0), byText('.hi-bar-b', '通勤'), { lead: 0.12, sfx: 'pop' });
QUICK(at(5, 0.6), F(720, 430, 1.5));
S.tap(at(5, 1.5), '.cm-box select', Object.assign({ fn: selectText('Electrical Engineering') }, HALF));
S.note(at(5, 1.7), at(5, 3.6), '.cm-box select', '目的地细到院系楼', { pos: 'bottom', pad: 4 });
S.tap(at(5, 3), byText('.bt-chipbtn', '15 分钟'), HALF);
S.tap(at(6, 0), byText('.bt-btn', '在地图上看'), HALF);
CAM(at(6, 0.5), F(720, 450, 1.0), 0.5, 'out'); DRIFT(at(6, 0.6), bar(7) - 0.2, 1.06);
T(5, 7, { k: '通勤时间', h: '院系到房子 走几分钟' });
/* 日照：bar 7（断拍）→ bar 8（重拍） */
S.at(bar(7) - 0.15, () => { const c = byText('.bt-link', '清除')(W()); if (c) c.click(); closeAll(); W().show(homeById(W(), HOME_A), true); });
CREEP(bar(7) - 0.05, bar(8) - 0.08, F(840, 300, 1.62));
S.tap(bar(8), byText('.hi-rb', '日照'), { lead: 0.25, sfx: 'pop' });
S.sfx(bar(8), 'hit', 0.55);
SNAP(bar(8) + 0.02, F(560, 420, 1.35)); DRIFT(bar(8) + 0.3, bar(10) - 0.3, 1.06, 0, -10);
S.tap(at(8, 1.5), byText('.hi-panel .bt-chipbtn', '今天'), HALF);
S.slide(at(8, 2), at(8, 3.6), '.hi-panel input[type=range]', 720, 630);
S.slide(at(9, 0), at(9, 3.2), '.hi-panel input[type=range]', 630, 860);
S.note(at(8, 1.8), at(9, 3.6), '.hi-panel input[type=range]', '拖一下 看一天的光', { pos: 'bottom', pad: 8 });
T(7, 10, { k: '日照', h: '看看下午的光' });
/* ⑤ bar 10：抢房系统 → 订房专家一起盯 */
S.at(bar(10) - 0.15, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
S.at(bar(10) - 0.05, () => { const e = byText('.bt-tool', '抢房准备')(W()); if (e) e.scrollIntoView({ block: 'center' }); });
SMOOTH(bar(10), F(895, 450, 1.55));
S.tap(at(10, 0), byText('.bt-tool', '抢房准备'), { lead: 0.12, sfx: 'pop' });
QUICK(at(10, 0.7), F(720, 450, 1.3));
S.tap(at(10, 1.0), byText('button', '加入计划'), HALF);
S.tap(at(10, 1.5), byText('.bp-tabs .br-tab', '抢房计划'), HALF);
S.at(at(10, 2.0), () => { const e = byText('.bt-btn', '顾问')(W()); if (e) e.scrollIntoView({ block: 'center' }); });
QUICK(at(10, 2.6), S.focus(w => byText('.bt-btn', '顾问')(w), 1.5, { dx: -200 }));
S.note(at(10, 2.4), at(10, 3.9), byText('.bt-btn', '顾问'), '自己抢 加 顾问帮你盯', { pos: 'top', pad: 4 });
S.tap(at(10, 3), byText('.bt-btn', '顾问'), { lead: 0.12, sfx: 'pop' });
T(10, 11, { k: '抢房系统', h: '订房专家 帮你一起盯' });
/* bar 11：拉远看整台显示器，界面全收起 */
S.at(bar(11) - 0.15, () => { closeInbox(); CLOSE(); });
SMOOTH(bar(11), 'fit');
S.tap(at(11, 0.5), panelClose('公寓列表'), HALF);
S.tap(at(11, 1.5), panelClose('找公寓'), HALF);
S.drag(at(11, 2), at(11, 3.3), '.hi-bar .hi-handle', -760, 40, { ax: 6, ay: 8 });
S.sfx(at(11, 3.3), 'whoosh', 0.45);
T(11, 12, { k: '界面全收起', h: '一拖到边 只看地图' });
/* bar 12–13：变成手机、平板 */
unfoldOnPhone(bar(12) - 0.2, bar(12) + 2.0);
S.geom(bar(12) - 0.2, 2.1, 'phone', 'apple'); S.cam(bar(12) - 0.2, 2.1, 'fit', 'apple');
S.sfx(bar(12) - 0.1, 'whoosh-up', 0.55);
S.geom(bar(13) + 0.1, 1.8, 'tablet', 'apple'); S.cam(bar(13) + 0.1, 1.8, 'fit', 'apple');
S.sfx(bar(13) + 0.2, 'whoosh-up', 0.55);
T(12, 14, { k: '全设备适配', h: '电脑 手机 平板' });
PUNCH(bar(14), 1.04);
S.sfx(bar(14), 'hit', 0.9);
S.title(bar(14), END30 + 1, { h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'c end', fade: 0.35 });
