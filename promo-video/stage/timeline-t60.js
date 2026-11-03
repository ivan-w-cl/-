/* 留学住宿通 · 60 秒版（59 秒）—— 快节奏：每小节都有动作，按钮落在半拍上
   配乐 AudioEra「Stylish Trailer Percussion」（music/assemble-full.py 60）：bar 0–1 前奏 · 2–5 律动 A · 6 冲击 · 7–14 律动 B · 15 断拍 · 16–23 强段 C · 24–27 强段 D · 28 最后一下
   天气 → 我的专业 → 答题匹配（八分音符一题）→ 推荐理由 → 对比 → 列表筛选 → 通勤圈 → 冬季日照/安静 → 周边安全 → 吃饭 → 官网周价
   → 断拍 → 日照（重拍）→ 一年总花费 → 按预算 → 订房专家群码（重拍）→ 抢房计划 + 分享二维码 → 工具拖到边上收起 → 多设备 → 片名
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
const T = (n0, n1, o, side) => S.title(bar(n0) + 0.02, bar(n1) - 0.12, Object.assign(o, side || L, { fade: 0.25 }));
const CLOSE = () => { closeAll(); try { W().hide(); } catch (e) {} const c = D_().getElementById('cardX'); if (c && vis(c)) c.click(); };
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  .hold(bar(2) - 0.3).to(bar(2), CR, 'apple').hold(bar(3) - 0.25)
  .to(bar(3), CL, 'apple').hold(bar(4) - 0.25).to(bar(4), CR, 'apple').hold(bar(6) - 0.25)
  .to(bar(6), CL, 'apple').hold(bar(7) - 0.25).to(bar(7), { x: 1110, y: 500, s: 1.2 }, 'apple').hold(bar(8) - 0.25)
  .to(bar(8), CL, 'apple').hold(bar(9) - 0.25).to(bar(9), CR, 'apple').hold(bar(11) - 0.25)
  .to(bar(11), CL, 'apple').hold(bar(12) - 0.25).to(bar(12), CR, 'apple').hold(bar(14) - 0.25)
  .to(bar(14), CL, 'apple').hold(bar(15)).to(bar(16) - 0.05, { x: 1118, y: 540, s: 1.34 }, 'io')
  .to(bar(16) + 0.35, { x: 820, y: 470, s: 1.2 }, 'apple').hold(bar(18) - 0.25)
  .to(bar(18), CR, 'apple').hold(bar(19) - 0.25).to(bar(19), CL, 'apple').hold(bar(20) - 0.25)
  .to(bar(20), CR, 'apple').hold(bar(22) - 0.25).to(bar(22), CL, 'apple').hold(bar(24) - 0.25)
  .to(bar(24), CR, 'apple').hold(bar(26) - 0.25).to(bar(26), { x: 960, y: 540, s: 1 }, 'apple').fn();
portraitCam();
S.tracks.phone = K(0, { x: 0, y: 1150, s: 0.94, rx: 14 }).hold(bar(1) - 0.2).to(bar(2) - 0.15, { y: 0, s: 1, rx: 0 }, 'apple')
  .hold(bar(26)).to(bar(26) + 0.3, { x: 0, y: 60, s: 0.88 }, 'apple').fn();
S.morph = Object.assign({ t0: bar(26) + 0.3, t1: bar(27), t2: at(27, 1.5), t3: bar(28) - 0.1 }, MORPH_G);
S.tracks.veil = K(0, { o: 0 }).hold(END - 1.2).to(END, { o: 1 }, 'in').fn();

/* bar 0–1：标题，手机升起，房屋落下 */
S.title(0.2, bar(1) + 0.3, { h: '在利物浦，<br>找到你的家。', cls: 'c big', x: 360, y: 395, w: 1200, fade: 0.45 });
S.sfx(bar(1) - 0.2, 'whoosh-up', 0.7);
replayDrop(bar(1) + 0.6);
/* bar 2：天气 */
S.tap(bar(2), '.wx-chip', { lead: 0.15, sfx: 'pop' });
S.tap(at(2, 3.2), w => [...w.document.querySelectorAll('.wx-pop button')].find(b => vis(b) && b.textContent.trim() === '×'), HALF);
T(2, 3, { k: '利物浦天气', h: '出门前，先看天气。' }, R);
/* bar 3：我的专业 → 计算机科学 */
S.tap(at(3, 0.1), '#subjectToggle', HALF);
S.tap(at(3, 0.8), '#subjectPanel .fs-btn', HALF);
S.scroll(at(3, 1), at(3, 1.6), ...scrollTo(byText('#subjectPanel .fs-opt', '计算机科学'), 0.5));
S.tap(at(3, 2), byText('#subjectPanel .fs-opt', '计算机科学'), HALF);
T(3, 4, { k: '按专业', h: '离课堂，更近一步。' });
/* bar 4–5：答题匹配，八分音符一题 */
S.at(bar(4) - 0.15, () => { try { W().SubjectDock.close(); } catch (e) {} try { W().HomeMatch.open(); } catch (e) {} });
S.tap(at(4, 0.6), leafText('开始生活选房'), HALF);
S.speed(at(4, 0.6), bar(6), 3, 0.1);
quiz(at(4, 1), BAR / 8);
S.sfx(at(5, 2.6), 'pop', 0.8);
T(4, 6, { k: '按生活选房', h: '8 个问题，<br>帮你匹配房源。' }, R);
S.scroll(at(5, 3), at(6, 1.4), ...scrollTo(byText('.why2 li', '亚洲食材'), 0.3));
/* bar 6（冲击）：推荐理由 → 并排对比 */
S.sfx(bar(6), 'hit', 0.45);
T(6, 7, { k: '推荐房源', h: '推荐 3 处，理由写清楚。' });
S.scroll(at(6, 1.6), at(6, 2.8), ...scrollTo(byText('button', '并排对比这'), 0.55));
S.tap(at(6, 3.2), byText('button', '并排对比这'), { lead: 0.12, sfx: 'pop' });
S.mark(at(7, 0.3), bar(8) - 0.25, walkRow, { pad: 2 });
T(7, 8, { k: '一键对比', h: '到学校各走几分钟。' }, R);
/* bar 8：列表筛选 */
S.at(bar(8) - 0.15, () => { const x = D_().getElementById('cmpX'); if (x && vis(x)) x.click(); closeAll(); });
S.tap(bar(8), '[data-open="controls"]', HALF);
S.tap(at(8, 0.8), '#homeBudget', Object.assign({ fn: setValue('150') }, HALF));
S.tap(at(8, 1.5), '#homeRoom', Object.assign({ fn: setValue('ensuite') }, HALF));
S.tap(at(8, 2.4), '#viewResults', HALF);
T(8, 9, { k: '列表筛选', h: '按预算、房型，一键筛选。' });
/* bar 9–10：通勤圈 → 看列表 → true Liverpool */
S.at(bar(9) - 0.15, () => { const c = [...D_().querySelectorAll('#homesPanel .closeSheet')].find(vis); if (c) c.click(); const r = D_().getElementById('resetHomeFilters'); if (r) r.click(); });
S.tap(bar(9), byText('.hi-bar-b', '通勤'), { lead: 0.12, sfx: 'pop' });
S.tap(at(9, 1), byText('.bt-chipbtn', '15 分钟'), HALF);
S.tap(at(9, 2), byText('.bt-btn', '在地图上看'), HALF);
S.tap(bar(10), byText('.bt-btn', '看列表'), HALF);
S.scroll(at(10, 0.5), at(10, 1.8), ...scrollTo(byText('.qc-home', 'true Liverpool'), 0.42));
S.tap(at(10, 2.4), byText('.qc-home', 'true Liverpool'), HALF);
S.at(at(10, 3.2), () => { const c = byText('.bt-link', '清除')(W()); if (c) c.click(); });
T(9, 11, { k: '通勤时间圈', h: '上课，想住多近？' }, R);
/* bar 11：冬季日照 + 安静 */
S.at(bar(11) - 0.15, CLOSE);
S.tap(at(11, 0.2), byText('.hi-bar-f', '冬季日照'), HALF);
S.tap(at(11, 1), byText('.hi-bar-f', '安静'), HALF);
S.at(at(11, 3.6), () => { const c = byText('a, button, span', '清除筛选')(W()); if (c) c.click(); });
T(11, 12, { k: '地图筛选', h: '冬天有阳光，晚上够安静。' });
/* bar 12–13：周边报告 → 周边安全 → 吃饭 */
S.at(bar(12) - 0.1, () => W().show(homeById(W(), HOME_A), true));
S.scroll(at(12, 0.2), at(12, 1), ...scrollTo(byText('.bt-tool', '周边报告'), 0.5));
S.tap(at(12, 1.4), byText('.bt-tool', '周边报告'), { lead: 0.12, sfx: 'pop' });
S.tap(at(12, 3), '[data-tab=safety]', { inner: '.full83-report-frame', lead: 0.12 });
S.tap(at(13, 2), '[data-tab=food]', { inner: '.full83-report-frame', lead: 0.12 });
T(12, 14, { k: '周边安全 · 吃饭', h: '住进去之前，<br>先看看周边。' }, R);
/* bar 14：官网与 Amber 周价 */
S.at(bar(14) - 0.15, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
S.tap(at(14, 0.8), '#card .qt-tag.oc-mini', { lead: 0.12, sfx: 'pop' });
T(14, 15, { k: '官网周价', h: '每一个价格，都有出处。' });
/* bar 15（断拍）：true Liverpool，镜头推近 */
S.at(bar(15) - 0.1, () => { closeAll(); W().show(homeById(W(), HOME_A), true); });
S.tap(at(15, 0.6), byText('.hi-rb', '安静度'), { lead: 0.15, sfx: 'pop' });   // 断拍里也有动作：先看安静度
T(15, 16, { k: '安静度', h: '离主路、铁路多远。' }, R);
/* bar 16（重拍）：日照 */
S.tap(bar(16), byText('.hi-rb', '日照'), { lead: 0.25, sfx: 'pop' });
S.sfx(bar(16), 'hit', 0.55);
S.tap(at(16, 1), byText('.hi-panel .bt-chipbtn', '今天'), HALF);
S.slide(at(16, 1.8), at(16, 3.6), '.hi-panel input[type=range]', 720, 630);
S.slide(at(17, 0.2), at(17, 3.4), '.hi-panel input[type=range]', 630, 860);
T(16, 18, { k: '日照', h: '看看下午的光。' });
/* bar 18：一年总花费 */
S.at(bar(18) - 0.15, CLOSE);
S.tap(bar(18), byText('.hi-bar-b', '总花费'), { lead: 0.12, sfx: 'pop' });
S.tap(at(18, 1.2), w => w.document.querySelector('.bt-box select'), Object.assign({ fn: selectText('Capital Gate') }, HALF));
S.scroll(at(18, 2), at(18, 3.5), w => scrollParent(w.document.querySelector('.bt-box input')), box => box.scrollHeight);
T(18, 19, { k: '一年总花费', h: '一年要准备多少钱？' }, R);
/* bar 19：按预算看房 */
S.at(bar(19) - 0.15, () => closeAll());
S.tap(bar(19), byText('.hi-bar-b', '按预算'), { lead: 0.12, sfx: 'pop' });
typeInto(at(19, 1), at(19, 2), w => w.document.querySelector('.bt-box input'), '8000');
S.scroll(at(19, 2.4), at(19, 3.6), w => scrollParent(w.document.querySelector('.bt-box input')), box => box.scrollTop + 260);
T(19, 20, { k: '按预算看房', h: '按总预算，反着找房。' });
/* bar 20–21：订房专家群（群码在 bar 21 重拍上回传；网页 1.3 秒后才可以回传，那一拍点「刷新」） */
S.at(bar(20) - 0.15, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
S.tap(at(20, 0.1), '#card .cta', HALF);
S.tap(bar(21) - 1.42, byText('.f83-button', '申请我的专家群'), HALF);
S.tap(bar(21) - 0.04, w => [...w.document.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim() === '刷新'), { lead: 0.25, sfx: false });
S.sfx(bar(21), 'ding', 1);
T(20, 22, { k: '订房专家', h: '一键，连上订房专家。', s: '演示群码，不会加入真实群聊。' }, R);
/* bar 22–23：抢房准备 → 计划 → 分享二维码 */
S.at(bar(22) - 0.15, () => { const m = byText('.f83-button', '收起')(W()); if (m) m.click(); closeAll(); W().show(homeById(W(), HOME_B), true); });
S.scroll(at(22, 0.1), at(22, 0.8), ...scrollTo(byText('.bt-tool', '抢房准备'), 0.5));
S.tap(at(22, 1), byText('.bt-tool', '抢房准备'), { lead: 0.12, sfx: 'pop' });
S.tap(at(22, 2), byText('button', '加入计划'), HALF);
S.tap(at(22, 3), byText('.bp-tabs .br-tab', '抢房计划'), HALF);
S.tap(at(23, 0), byText('.bp-room', '独卫单间'), HALF);
S.tap(at(23, 0.5), byText('.bp-room', '单人公寓'), HALF);
S.scroll(at(23, 1), at(23, 2), ...scrollTo(byText('.bp-mp > .bt-btn', '分享'), 0.35));
S.tap(at(23, 2.4), byText('.bp-mp > .bt-btn', '分享'), { lead: 0.12, sfx: 'pop' });
S.scroll(at(23, 2.9), at(23, 3.7), ...scrollTo(w => w.document.querySelector('.bp-mp-card') || byText('.bp-mp > .bt-btn', '分享')(w), 0.2));
T(22, 24, { k: '抢房准备', h: '排好要订哪间，<br>分享给朋友。' });
/* bar 24–25：工具拖到边上收起，再点回来 */
S.at(bar(24) - 0.15, () => { CLOSE(); const t = byText('button, a', '清空')(W()); if (t) t.click(); });
S.mapGlide(bar(24) - 0.1, 0.8, studentsView);
S.drag(at(24, 1), at(24, 2.8), '.hi-bar .hi-handle', -460, 30, { ax: 6, ay: 8 });
S.sfx(at(24, 2.9), 'whoosh', 0.45);
S.tap(at(25, 2), '.pd-tab.hi-tab', HALF);
T(24, 26, { k: '界面全收起', h: '一拖到边，只看地图；<br>点一下就回来。' }, R);
/* bar 26–28：手机 → 折叠屏 → 平板，片名 */
S.sfx(S.morph.t0 + 0.1, 'whoosh-up', 0.55);
S.sfx(S.morph.t2 + 0.1, 'whoosh-up', 0.55);
S.title(bar(26) + 0.2, bar(28) - 0.12, { k: '全设备适配', h: '手机 · 折叠屏 · 平板', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.3 });
S.sfx(bar(28), 'hit', 0.9);
S.title(bar(28), END + 1, { h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.35 });
