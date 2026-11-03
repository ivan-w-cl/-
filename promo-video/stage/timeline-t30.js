/* 留学住宿通 · 30 秒版（31 秒）—— 快节奏：每小节都有动作
   配乐（music/assemble-full.py 30）：bar 0 前奏 · 1–2 律动 A · 3–6 律动 B · 7 断拍 · 8–11 强段 C · 12–13 强段 D · 14 最后一下
   答题匹配 → 推荐 → 对比 → 通勤圈 → true Liverpool → 日照（重拍）→ 冬季日照/安静 → 工具收起 → 多设备 → 片名
   录制：TL=timeline-t30 PRE=300 DATE=2026-11-03T12:00:00Z（竖版加 PORTRAIT=1 TT1=1） */
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
const END = bar(14) + 2.9;
const T = (n0, n1, o, side) => S.title(bar(n0) + 0.02, bar(n1) - 0.12, Object.assign(o, side || L, { fade: 0.25 }));
const CLOSE = () => { closeAll(); try { W().hide(); } catch (e) {} const c = D_().getElementById('cardX'); if (c && vis(c)) c.click(); };
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  .hold(bar(2) - 0.3).to(bar(2), CL, 'apple').hold(bar(4) - 0.25)
  .to(bar(4), { x: 1110, y: 500, s: 1.2 }, 'apple').hold(bar(5) - 0.25)
  .to(bar(5), CL, 'apple').hold(bar(7)).to(bar(8) - 0.05, { x: 832, y: 540, s: 1.34 }, 'io')
  .to(bar(8) + 0.35, { x: 1110, y: 470, s: 1.2 }, 'apple').hold(bar(10) - 0.25)
  .to(bar(10), CL, 'apple').hold(bar(11) - 0.25).to(bar(11), CR, 'apple').hold(bar(12) - 0.25)
  .to(bar(12), { x: 960, y: 540, s: 1 }, 'apple').fn();
portraitCam();
S.tracks.phone = K(0, { x: 0, y: 1150, s: 0.94, rx: 14 }).hold(bar(1) - 0.3).to(bar(1) + 0.9, { y: 0, s: 1, rx: 0 }, 'apple')
  .hold(bar(12)).to(bar(12) + 0.3, { x: 0, y: 60, s: 0.88 }, 'apple').fn();
S.morph = Object.assign({ t0: bar(12) + 0.3, t1: at(12, 3), t2: at(13, 0.5), t3: bar(14) - 0.1 }, MORPH_G);
S.tracks.veil = K(0, { o: 0 }).hold(END - 1.0).to(END, { o: 1 }, 'in').fn();

S.title(0.15, bar(1) + 0.2, { h: '在利物浦，<br>找到你的家。', cls: 'c big', x: 360, y: 395, w: 1200, fade: 0.4 });
S.sfx(bar(1) - 0.3, 'whoosh-up', 0.7);
replayDrop(bar(1) + 0.3);
/* bar 1.5–3：答题匹配，八分音符一题 */
S.at(at(1, 2), () => { try { W().HomeMatch.open(); } catch (e) { /* 没有 */ } });
S.tap(at(1, 3.2), leafText('开始生活选房'), HALF);
S.speed(at(1, 3.2), bar(4), 3, 0.1);
quiz(at(2, 0), BAR / 8);
S.sfx(at(3, 1.5), 'pop', 0.8);
T(2, 3, { k: '按生活选房', h: '8 个问题，帮你匹配房源。' });
S.scroll(at(3, 1.8), at(3, 3.4), ...scrollTo(byText('.why2 li', '亚洲食材'), 0.3));
T(3, 4, { k: '推荐房源', h: '推荐 3 处，理由写清楚。' });
/* bar 4：并排对比 */
S.at(at(3, 3.5), () => { const b = byText('button', '并排对比这')(W()); if (b) b.scrollIntoView({ block: 'center' }); });
S.tap(bar(4), byText('button', '并排对比这'), { lead: 0.12, sfx: 'pop' });
S.mark(at(4, 1), bar(5) - 0.2, walkRow, { pad: 2 });
T(4, 5, { k: '一键对比', h: '到学校各走几分钟。' }, R);
/* bar 5–6：通勤圈 → 看列表 → true Liverpool */
S.at(bar(5) - 0.15, () => { const x = D_().getElementById('cmpX'); if (x && vis(x)) x.click(); closeAll(); });
S.tap(bar(5), byText('.hi-bar-b', '通勤'), { lead: 0.12, sfx: 'pop' });
S.tap(at(5, 1), byText('.bt-chipbtn', '15 分钟'), HALF);
S.tap(at(5, 2), byText('.bt-btn', '在地图上看'), HALF);
S.tap(at(6, 0.6), byText('.bt-btn', '看列表'), HALF);
S.scroll(at(6, 1), at(6, 2.2), ...scrollTo(byText('.qc-home', 'true Liverpool'), 0.42));
S.tap(at(6, 2.8), byText('.qc-home', 'true Liverpool'), HALF);
S.at(at(7, 0.4), () => { const c = byText('.bt-link', '清除')(W()); if (c) c.click(); });
T(5, 7, { k: '通勤时间圈', h: '上课，想住多近？' });
S.tap(at(7, 1), byText('.hi-rb', '安静度'), { lead: 0.15, sfx: 'pop' });   // 断拍里先看安静度
T(7, 8, { k: '安静度', h: '离主路、铁路多远。' }, R);
/* bar 8（重拍）：日照 */
S.tap(bar(8), byText('.hi-rb', '日照'), { lead: 0.25, sfx: 'pop' });
S.sfx(bar(8), 'hit', 0.55);
S.tap(at(8, 1), byText('.hi-panel .bt-chipbtn', '今天'), HALF);
S.slide(at(8, 1.8), at(8, 3.6), '.hi-panel input[type=range]', 720, 630);
S.slide(at(9, 0.2), at(9, 3.4), '.hi-panel input[type=range]', 630, 860);
T(8, 10, { k: '日照', h: '看看下午的光。' });
/* bar 10：冬季日照 + 安静 */
S.at(bar(10) - 0.15, CLOSE);
S.tap(at(10, 0.2), byText('.hi-bar-f', '冬季日照'), HALF);
S.tap(at(10, 1), byText('.hi-bar-f', '安静'), HALF);
T(10, 11, { k: '地图筛选', h: '冬天有阳光，晚上够安静。' });
/* bar 11：工具拖到边上收起 */
S.at(bar(11) - 0.15, () => { const c = byText('a, button, span', '清除筛选')(W()); if (c) c.click(); });
S.drag(at(11, 0.4), at(11, 2.4), '.hi-bar .hi-handle', -460, 30, { ax: 6, ay: 8 });
S.sfx(at(11, 2.5), 'whoosh', 0.45);
T(11, 12, { k: '界面全收起', h: '一拖到边，只看地图。' }, R);
/* bar 12–14：多设备 + 片名 */
S.sfx(S.morph.t0 + 0.1, 'whoosh-up', 0.55);
S.sfx(S.morph.t2 + 0.1, 'whoosh-up', 0.55);
S.title(bar(12) + 0.2, bar(14) - 0.12, { k: '全设备适配', h: '手机 · 折叠屏 · 平板', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.3 });
S.sfx(bar(14), 'hit', 0.9);
S.title(bar(14), END + 1, { h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.35 });
