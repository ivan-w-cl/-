/* 留学住宿通 · 60 秒九项版（竖屏 59 秒） —— 九项展示（不分先后）：① 天气 + 动态地图 ② 缩回侧面 ③ 房源细节 ④ 任何学校的路线筛选 ⑤ 抢房
   ⑥ 二维码进群（前期不要任何联系方式）⑦ 房源对比 ⑧ 生活选房 ⑨ 即时消息；结尾多终端。
   拍子：小节线用实测时间（DB），点按落在底鼓 3+3+2 的重音上；重拍上轻轻一斜（S.tilt）、鼓点轻推（S.pulse），镜头快移时带运动模糊。
   录制：PORTRAIT=1 DK=1 TL=timeline-g60 PRE=300 DATE=2026-11-03T12:00:00Z */
'use strict';
/* 每小节第一拍用实测时间（music/downbeat-table.py：底鼓起音）；拍子在小节里均分。这首的底鼓是 3+3+2：第 1、2.5、4 拍（at(n, 0 / 1.5 / 3)）是重音 */
const DB = [0.0232, 2.0288, 4.0461, 6.0517, 8.0428, 10.0484, 12.0308, 14.0452, 16.045, 18.0419, 20.0475, 22.0415, 24.0472, 26.0412, 28.0439, 30.0437, 32.0435, 34.0492, 36.0432, 38.043, 40.0428, 42.0484, 44.0424, 46.0481, 48.0711, 50.0448, 52.0388, 54.0386, 56.053, 58.054, 60.0551];
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
const END = bar(28) + 2.9;
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
const KICKS = (n, amt) => [0, 1.5, 3].forEach(k => S.pulse(at(n, k), amt == null ? 0.014 : amt));   // 跟着这一小节的三个底鼓重音轻推
const msgBtn = w => [...w.document.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim().endsWith('消息') && b.getBoundingClientRect().top < 80);
const qrText = w => [...w.document.querySelectorAll('div, p, span')].reverse().find(e => vis(e) && e.children.length === 0 && e.textContent.includes('示例码'));
const cardSec = txt => w => [...w.document.querySelectorAll('#card h3, #card h4, #card strong')].find(e => vis(e) && e.textContent.trim().startsWith(txt));
const cardTo = (t0, t1, txt, at_) => S.scroll(t0, t1, w => w.document.getElementById('card'), (box, w) => { const e = cardSec(txt)(w); return e ? box.scrollTop + e.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight * (at_ == null ? 0.12 : at_) : box.scrollTop; });
S.tracks.veil = K(0, { o: 0 }).hold(END - 1.2).to(END, { o: 1 }, 'in').fn();
S.speed(0.4, bar(2), 4, 0.4);   // 开场地图就在动：渡轮、海鸥、云

/* bar 0–1（前奏）：大标题，显示器升起，房屋落下 */
S.title(0.2, bar(1) + 0.6, { h: '在利物浦<br>找到你的家', cls: 'c big', fade: 0.45 });
S.sfx(0.3, 'whoosh-up', 0.7);
replayDrop(bar(1) - 0.4);
DRIFT(bar(1) + 0.4, bar(2) - 0.3, 1.05);
/* ① bar 2：天气 */
QUICK(bar(2), S.focus('.wx-chip', 2.2)); S.tilt(bar(2) - 0.1, -1.2, 0.5);
S.tap(at(2, 0), '.wx-chip', { lead: 0.15, sfx: 'pop' });
S.note(at(2, 0.6), at(2, 3.3), '.wx-pop', '温度 降雨 天黑时间', { pos: 'bottom', pad: 4 });
S.tap(at(2, 3.5), w => [...w.document.querySelectorAll('.wx-pop button')].find(b => vis(b) && b.textContent.trim() === '×'), HALF);
T(2, 3, { k: '利物浦天气', h: '出门前先看天气' });
/* ① bar 3：动态地图（推近默西河，渡轮、海鸥在动） */
S.mapGlide(bar(3) - 0.35, 1.3, riverView);
S.speed(bar(3) - 0.3, bar(4) - 0.2, 6, 0.3);
QUICK(bar(3), F(893, 495, 1.8)); DRIFT(bar(3) + 0.1, bar(4) - 0.3, 1.07, 30, 0);
KICKS(3, 0.018);
T(3, 4, { k: '动态地图', h: '渡轮 海鸥 都在动' });
/* ⑧ bar 4–5：生活选房，八分音符一题 */
S.at(bar(4) - 0.45, () => { try { W().HomeMatch.open(); } catch (e) {} jumpTo(W(), studentsView(W())); });
QUICK(bar(4), F(720, 420, 1.55)); S.tilt(bar(4) - 0.05, 1, 0.45);
S.tap(at(4, 0.4), leafText('开始生活选房'), HALF);
S.speed(at(4, 0.4), bar(6), 3, 0.1);
quiz(at(4, 0.8), BAR / 8);
S.sfx(at(5, 2.2), 'pop', 0.8);
QUICK(at(5, 2.6), S.focus('.why2', 1.75, { dy: -160 }));
T(4, 6, { k: '生活选房', h: '8个问题 帮你匹配房源' });
/* ⑦ bar 6（冲击）：房源对比 */
S.tap(at(5, 3.5), byText('button', '并排对比这'), { lead: 0.12, sfx: 'pop' });
SNAP(bar(6), F(600, 430, 1.5)); S.tilt(bar(6), 1.6, 0.55); S.pulse(bar(6), 0.03, 0.45);
S.sfx(bar(6), 'hit', 0.45);
S.note(at(6, 0.4), bar(7) - 0.25, walkRow, '到学校各走几分钟', { pos: 'bottom', pad: 3 });
T(6, 7, { k: '房源对比', h: '三处公寓 一屏看懂' });
/* ③ bar 7–8：每一处房源都有细节 */
S.at(bar(7) - 0.15, () => { clearCompare(); closeAll(); W().show(homeById(W(), HOME_A), true); });
QUICK(bar(7), F(895, 450, 1.55));
S.tap(at(7, 1.5), leafText('展开详情 ↑'), HALF);
cardTo(at(7, 3), at(7, 3.7), '房型与照片');
cardTo(at(8, 0), at(8, 0.7), '选房小工具');
cardTo(at(8, 1.5), at(8, 2.2), '住户与团队');
KICKS(8, 0.012);
S.note(at(7, 1.8), at(8, 3.6), '#card', '房型 周价 步行 住户', { pos: 'left', pad: 2, box: false });
T(7, 9, { k: '房源细节', h: '每一处房源 都有细节' });
/* ④ bar 9–10：任何学校都有路线筛选 */
S.at(bar(9) - 0.15, CLOSE);
S.tap(at(9, 0), byText('.hi-bar-b', '通勤'), { lead: 0.12, sfx: 'pop' });
QUICK(at(9, 0.4), F(720, 430, 1.5));
S.tap(at(9, 1.5), '.cm-box select', Object.assign({ fn: selectText('利物浦希望大学') }, HALF));
S.note(at(9, 1.7), at(10, 0), '.cm-box select', '任何学校 任何院系', { pos: 'bottom', pad: 4 });
S.tap(at(9, 3), byText('.bt-chipbtn', '15 分钟'), HALF);
S.tap(at(10, 0), byText('.bt-btn', '在地图上看'), HALF);
CAM(at(10, 0.5), F(720, 450, 1.0), 0.5, 'out'); DRIFT(at(10, 0.6), bar(11) - 0.3, 1.07);
KICKS(10, 0.014);
T(9, 11, { k: '路线筛选', h: '任何学校 都能算路线' });
/* ⑨ bar 11：即时消息 → ⑥ bar 12：二维码进群（前期不要任何联系方式） */
S.at(bar(11) - 0.15, () => { const c = byText('.bt-link', '清除')(W()); if (c) c.click(); closeAll(); W().show(homeById(W(), HOME_B), true); });
S.tap(at(11, 0), '#card .cta', { lead: 0.12, sfx: 'pop' });
S.note(at(11, 0.5), at(11, 3.6), leafIn('body', '无需填写'), '无需填写姓名或手机号', { pos: 'bottom', pad: 4 });
QUICK(at(11, 0.3), F(330, 450, 1.65));
S.tap(at(11, 1.0), byText('.f83-button', '申请我的专家群'), HALF);
T(11, 12, { k: '即时消息', h: '顾问回复 马上就到' });
S.tap(bar(12) - 0.02, refresh, { lead: 0.25, sfx: false });
S.sfx(bar(12), 'ding', 1); S.sfx(bar(12), 'hit', 0.35);
PUNCH(bar(12), 1.07); S.tilt(bar(12), -1.4, 0.55);
S.note(at(12, 0.6), bar(14) - 0.2, qrText, '全程没要手机号', { pos: 'right', pad: 4 });
T(12, 14, { k: '二维码进群', h: '不用留任何联系方式', s: '扫码就进群 演示码不会加入真实群聊' });
/* ② bar 14–16：缩回侧面——两边面板收起，断拍里按住工具栏慢慢拖，重拍落下时收到边上 */
S.at(bar(14) - 0.15, () => { closeInbox(); CLOSE(); jumpTo(W(), studentsView(W())); });
QUICK(bar(14), 'fit');
S.tap(at(14, 1.5), panelClose('公寓列表'), HALF);
S.tap(at(14, 3), panelClose('找公寓'), HALF);
S.drag(at(15, 0.6), bar(16) - 0.02, '.hi-bar .hi-handle', -760, 40, { ax: 6, ay: 8, ease: 'in' });
CREEP(bar(15), bar(16) - 0.1, F(720, 450, 0.82));
S.sfx(bar(16), 'whoosh', 0.5); S.sfx(bar(16), 'hit', 0.5);
S.tilt(bar(16), 2, 0.6); S.pulse(bar(16), 0.035, 0.5);
T(14, 16, { k: '缩回侧面', h: '面板一拖 收到边上' });
/* bar 16–17：只看地图，地图跟着鼓点推近 */
S.mapGlide(bar(16) + 0.2, 3.4, w => { const v = studentsView(w), k = 1.6, vw = w.eval('viewW'), vh = w.eval('viewH'); return { z: v.z * k, tx: vw / 2 - (vw / 2 - v.tx) * k, ty: vh * 0.5 - (vh * 0.5 - v.ty) * k }; });
S.speed(bar(16), bar(18), 4, 0.4);
DRIFT(bar(16) + 0.3, bar(18) - 0.3, 1.08);
KICKS(16, 0.02); KICKS(17, 0.02);
T(16, 18, { k: '只看地图', h: '想看哪里 就看哪里' });
/* ⑤ bar 18–21：抢房 */
S.at(bar(18) - 0.15, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
SMOOTH(bar(18), F(895, 450, 1.55)); S.tilt(bar(18) - 0.1, -1, 0.5);
S.scroll(at(18, 0.1), at(18, 1.2), ...scrollTo(byText('.bt-tool', '抢房准备'), 0.5));
S.tap(at(18, 1.5), byText('.bt-tool', '抢房准备'), { lead: 0.12, sfx: 'pop' });
S.tap(at(18, 3), byText('button', '加入计划'), HALF);
SMOOTH(at(18, 3.4), S.focus('.bp-tabs', 1.5, { dy: 200 }));
S.tap(at(19, 0), byText('.bp-tabs .br-tab', '抢房计划'), HALF);
S.tap(at(19, 1.5), byText('.bp-room', '独卫单间'), HALF);
S.tap(at(19, 3), byText('.bp-room', '单人公寓'), HALF);
T(18, 20, { k: '抢房系统', h: '开放前 排好要订哪间' });
S.scroll(at(20, 0), at(20, 0.9), ...scrollTo(byText('.bt-btn', '顾问'), 0.5));
S.note(at(20, 1), at(20, 2.9), byText('.bt-btn', '顾问'), '自己抢 加 顾问帮你盯', { pos: 'top', pad: 4 });
S.tap(at(20, 3), byText('.bt-btn', '顾问'), { lead: 0.12, sfx: 'pop' });
SMOOTH(at(21, 0), F(330, 450, 1.5)); KICKS(21, 0.012);
T(20, 22, { k: '人工加系统', h: '订房专家 帮你一起盯' });
/* bar 22–23：拉远，整台显示器 */
S.at(bar(22) - 0.15, () => { closeInbox(); CLOSE(); });
SMOOTH(bar(22), 'fit'); DRIFT(bar(22) + 0.8, bar(24) - 0.3, 1.05);
S.mapGlide(bar(22), 3.6, studentsView);
S.speed(bar(22), bar(24), 4, 0.4);
T(22, 24, { k: '电脑版', h: '大屏幕 一眼看全' });
/* bar 24–27：多终端：同一个网页变成手机，再变成平板 */
unfoldOnPhone(bar(24) - 0.2, bar(24) + 2.6);
S.geom(bar(24) - 0.2, 2.6, 'phone', 'apple'); S.cam(bar(24) - 0.2, 2.6, 'fit', 'apple');
S.sfx(bar(24) - 0.1, 'whoosh-up', 0.55); S.tilt(bar(24) - 0.1, 1.2, 1.2);
T(24, 26, { k: '多终端适用', h: '打开手机就能用' });
S.geom(bar(26) - 0.2, 2.6, 'tablet', 'apple'); S.cam(bar(26) - 0.2, 2.6, 'fit', 'apple');
S.sfx(bar(26) - 0.1, 'whoosh-up', 0.55); S.tilt(bar(26) - 0.1, -1.2, 1.2);
T(26, 28, { k: '多终端适用', h: '电脑 手机 平板', s: '每种屏幕 有自己的布局' });
/* bar 28：片名 */
PUNCH(bar(28), 1.04); S.pulse(bar(28), 0.02, 0.5);
S.sfx(bar(28), 'hit', 0.9);
S.title(bar(28), END + 1, { h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'c end', fade: 0.35 });
