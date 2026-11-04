/* 留学住宿通 · 30 秒手机版（竖屏 31 秒） —— 从手机开始：九项展示（不分先后），结尾手机 → 平板 → 电脑。
   拍子：小节线用实测时间（DB）；换场景只放在乐句开头的镲上；点按落在小鼓 / 踩镲的重音（十六分 4 · 6 · 10 · 12）；
   转场有快有慢：一刀切 / 甩过去 / 顺过去 / 慢慢推。
   录制：PORTRAIT=1 DK=1 DKSTART=phone TL=timeline-h30 PRE=300 DATE=2026-11-03T12:00:00Z */
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
const KICKS = (n, amt) => [0, 1.5, 3].forEach(k => S.pulse(at(n, k), amt == null ? 0.014 : amt));   // 跟着这一小节的三个底鼓重音轻推
const msgBtn = w => [...w.document.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim().endsWith('消息') && b.getBoundingClientRect().top < 80);
const qrText = w => [...w.document.querySelectorAll('div, p, span')].reverse().find(e => vis(e) && e.children.length === 0 && e.textContent.includes('示例码'));
const cardSec = txt => w => [...w.document.querySelectorAll('#card h3, #card h4, #card strong')].find(e => vis(e) && e.textContent.trim().startsWith(txt));
const cardTo = (t0, t1, txt, at_) => S.scroll(t0, t1, w => w.document.getElementById('card'), (box, w) => { const e = cardSec(txt)(w); return e ? box.scrollTop + e.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight * (at_ == null ? 0.12 : at_) : box.scrollTop; });
/* 拍子：X(n, s) = 第 n 小节第 s 个十六分音符。这首的小鼓 / 踩镲重音在 4 · 6 · 10 · 12；乐句开头的小节第 1 拍有一声镲（music/accents.py）。
   换场景只放在镲上；镜头快慢分四种：CUT 一刀切、WHIP 甩过去（带运动模糊）、SMOOTH 顺过去、CREEP 慢慢推 */
const X = (n, s) => DB[n] + s * (DB[n + 1] - DB[n]) / 16;
const CUT = (t, tg) => S.cut(t, tg);
const WHIP = (t, tg) => CAM(t, tg, 0.24, 'out5');
const PH = (fy, k) => F(195, fy, k);   // 手机：横向总是居中，fy 选看上面 / 中间 / 下面
const HITS = (n, list, amt) => list.forEach(s => S.pulse(X(n, s), amt == null ? 0.016 : amt));
S.tracks.veil = K(0, { o: 0 }).hold(END30 - 1.0).to(END30, { o: 1 }, 'in').fn();
S.speed(0.3, bar(3), 5, 0.4);
S.title(0.15, bar(1) - 0.1, { h: '在利物浦<br>找到你的家', cls: 'c big', cy: 340, fade: 0.4 });
S.sfx(0.2, 'whoosh-up', 0.7);
replayDrop(bar(1) - 0.9);
/* ① bar 1：天气 + 动态地图 */
WHIP(bar(1), S.focus('.wx-chip', 2.3)); S.tilt(bar(1), -1.2, 0.5);
S.tap(X(1, 4), '.wx-chip', { lead: 0.15, sfx: 'pop' });
S.tap(X(1, 12), w => [...w.document.querySelectorAll('.wx-pop button')].find(b => vis(b) && b.textContent.trim() === '×'), HALF);
S.mapGlide(X(1, 13), 1.2, riverView);
T(1, 2, { k: '天气 动态地图', h: '出门前先看天气' });
/* ④ bar 2：路线筛选 */
S.at(bar(2) - 0.02, CLOSE);
WHIP(bar(2), PH(520, 1.85));
S.tap(X(2, 2), byText('.hi-bar-b', '通勤'), { lead: 0.12, sfx: 'pop' });
S.tap(X(2, 6), '.cm-box select', Object.assign({ fn: selectText('LJMU 快乐山校区') }, HALF));
S.note(X(2, 7), X(2, 15), '.cm-box select', '任何学校 任何院系', { pos: 'bottom', pad: 4 });
S.tap(X(2, 10), byText('.bt-chipbtn', '15 分钟'), HALF);
S.tap(X(2, 12), byText('.bt-btn', '在地图上看'), HALF);
T(2, 3, { k: '路线筛选', h: '任何学校 都能算路线' });
/* ⑧ bar 3–4（镲）：生活选房 */
S.at(bar(3) - 0.02, () => { const c = byText('.bt-link', '清除')(W()); if (c) c.click(); try { W().HomeMatch.open(); } catch (e) {} });
CUT(bar(3), PH(430, 1.75));
S.tap(X(3, 2), leafText('开始生活选房'), HALF);
S.speed(X(3, 2), bar(5), 3, 0.1);
quiz(X(3, 4), (DB[4] - DB[3]) / 8);
S.sfx(X(4, 10), 'pop', 0.8);
S.scroll(X(4, 10), X(4, 13), ...scrollTo(byText('button', '并排对比这'), 0.55));
T(3, 5, { k: '生活选房', h: '8个问题 帮你匹配房源' });
/* ⑦ bar 5（镲）：房源对比 */
S.tap(X(4, 15), byText('button', '并排对比这'), { lead: 0.12, sfx: 'pop' });
SNAP(bar(5), PH(420, 2.05)); S.tilt(bar(5), 1.5, 0.5); S.pulse(bar(5), 0.025, 0.4);
S.note(X(5, 4), bar(6) - 0.15, walkRow, '到学校各走几分钟', { pos: 'bottom', pad: 3 });
T(5, 6, { k: '房源对比', h: '三处公寓 一屏看懂' });
/* ③ bar 6：房源细节 */
S.at(bar(6) - 0.02, () => { clearCompare(); closeAll(); W().show(homeById(W(), HOME_A), true); });
WHIP(bar(6), PH(560, 1.9));
S.tap(X(6, 4), leafText('展开详情 ↑'), HALF);
cardTo(X(6, 8), X(6, 10), '房型与照片');
cardTo(X(6, 12), X(6, 14), '住户与团队');
T(6, 7, { k: '房源细节', h: '每一处房源 都有细节' });
/* ② bar 7（断拍）→ bar 8（镲）：缩回侧面 */
S.at(bar(7) - 0.02, CLOSE);
CREEP(bar(7), bar(8) - 0.08, PH(640, 1.95));
S.drag(X(7, 2), bar(8) - 0.02, '.hi-bar .hi-handle', -460, 30, { ax: 6, ay: 8, ease: 'in' });
S.sfx(bar(8), 'whoosh', 0.5); S.sfx(bar(8), 'hit', 0.5);
WHIP(bar(8) + 0.2, 'fit'); S.tilt(bar(8), 2, 0.6); S.pulse(bar(8), 0.035, 0.5);
S.mapGlide(bar(8) + 0.2, 1.7, w => { const v = studentsView(w), k = 1.5, vw = w.eval('viewW'), vh = w.eval('viewH'); return { z: v.z * k, tx: vw / 2 - (vw / 2 - v.tx) * k, ty: vh * 0.5 - (vh * 0.5 - v.ty) * k }; });
S.speed(bar(8), bar(9), 4, 0.3); HITS(8, [4, 6, 10, 12], 0.02);
T(7, 9, { k: '缩回侧面', h: '一拖到边 只看地图' });
/* ⑨ bar 9 → ⑥ bar 10（镲）：即时消息，二维码进群 */
S.at(bar(9) - 0.02, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
CUT(bar(9), PH(560, 1.9));
S.tap(X(9, 0) + 0.03, '#card .cta', { lead: 0.1, sfx: 'pop' });
SMOOTH(X(9, 5), PH(470, 1.9));
S.tap(X(9, 5), byText('.f83-button', '申请我的专家群'), HALF);   // 网页 1.3 秒后才可以回传：离 bar 10 留够时间
S.note(X(9, 6), X(9, 15), leafIn('body', '无需填写'), '无需填写姓名或手机号', { pos: 'bottom', pad: 4 });
S.tap(bar(10) - 0.02, refresh, { lead: 0.25, sfx: false });
S.sfx(bar(10), 'ding', 1);
PUNCH(bar(10), 1.08); S.tilt(bar(10), -1.4, 0.55);
S.note(X(10, 6), bar(11) - 0.15, qrText, '全程没要手机号', { pos: 'top', pad: 4 });
T(9, 11, { k: '二维码进群', h: '不用留任何联系方式', s: '顾问消息即时到 演示码不会加入真实群聊' });
/* ⑤ bar 11：抢房 */
S.at(bar(11) - 0.02, () => { closeInbox(); closeAll(); W().show(homeById(W(), HOME_B), true); const e = byText('.bt-tool', '抢房准备')(W()); if (e) e.scrollIntoView({ block: 'center' }); });
CUT(bar(11), PH(560, 1.9));
S.tap(X(11, 2), byText('.bt-tool', '抢房准备'), { lead: 0.12, sfx: 'pop' });
S.tap(X(11, 6), byText('button', '加入计划'), HALF);
SMOOTH(X(11, 8), S.focus('.bp-tabs', 1.75, { dy: 230 }));
S.tap(X(11, 10), byText('.bp-tabs .br-tab', '抢房计划'), HALF);
S.tap(X(11, 12), byText('.bp-room', '独卫单间'), HALF);
S.tap(X(11, 14), byText('.bp-room', '单人公寓'), HALF);
T(11, 12, { k: '抢房系统', h: '开放前 排好要订哪间' });
/* bar 12（变轻、渐强）慢慢变成平板 → bar 13 一下变成电脑 */
S.at(bar(12) - 0.02, () => CLOSE());
S.geom(bar(12), DB[13] - DB[12] - 0.1, 'tablet', 'io'); S.cam(bar(12), DB[13] - DB[12] - 0.1, 'fit', 'io');
S.sfx(bar(12) + 0.1, 'whoosh-up', 0.5);
S.geom(bar(13) - 0.05, 0.5, 'monitor', 'out5'); S.cam(bar(13) - 0.05, 0.5, 'fit', 'out5');
S.sfx(bar(13), 'whoosh', 0.55); S.tilt(bar(13), 1.4, 0.6);
T(12, 14, { k: '多终端适用', h: '手机 平板 电脑' });
PUNCH(bar(14), 1.04); S.pulse(bar(14), 0.02, 0.5);
S.sfx(bar(14), 'hit', 0.9);
S.title(bar(14), END30 + 1, { h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'c end', fade: 0.35 });
