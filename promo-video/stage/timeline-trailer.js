/* 留学住宿通 · 完整版宣传片（约 1 分 53 秒，横版 / 竖版，中文）—— 离线录屏包 2026-11-03
   配乐 AudioEra「Stylish Trailer Percussion」（和 30 秒亮点版同一首，120 拍/分，一小节 2.001 秒），按小节重排成 55 小节 + 余音（music/assemble-full.py）：
     bar 0–1 前奏 ········ 大标题
     bar 2–7 律动 A ······ 手机升起、房屋落下、选房指南、会呼吸的地图
     bar 8 冲击 ·········· 47 处公寓
     bar 9–16 律动 B ····· 选房快节奏：我的专业 · 生活选房（半拍一题）· 推荐理由 · 多房对比 · 列表筛选 · 通勤圈
     bar 17 断拍 ········· 从通勤圈里挑出 true Liverpool
     bar 18–25 强段 C ···· 日照在重拍上打开 → 拖动一天 · 冬季日照与安静筛选 · 周边报告
     bar 26–33 强段 D ···· 官网周价 · 一年总花费 · 按预算看房 · 留学人格测试与分享卡片
     bar 34–41 律动 B ···· 抢房准备 · 抢房计划 · 分享二维码 · 两手准备
     bar 42–45 低段 ······ 一拖，界面全收起，只看地图
     bar 46 断拍 ········· 申请专家群
     bar 47–54 强段 C ···· 群码在重拍上回传 · 收进备选 · 手机 → 折叠屏 → 平板
     bar 55 最后一下 ····· 片名
   录制：TL=timeline-trailer PRE=300 DATE=2026-11-03T12:00:00Z（竖版再加 PORTRAIT=1 TT1=1） */
'use strict';
const BAR = 4 * 0.50026, LAG = 0.05;   // 配乐的小节长度；鼓点比网格晚 50 毫秒左右
const bar = n => n * BAR + LAG, at = (n, k) => bar(n) + k * BAR / 4;   // at(n, k)：第 n 小节第 k 拍（k 可以是小数）
const END = bar(55) + 2.9;
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

/* ---------- 网页准备 ---------- */
S.at(0.36, () => { for (const id of ['app', 'appT', 'appF']) { try { W(id).HomeMatch.exit(); } catch (e) { /* 没有 */ } } });
S.at(2.4, () => { for (const id of ['appT', 'appF']) { try { W(id).HomeMatch.exit(); jumpTo(W(id), studentsView(W(id))); } catch (e) { /* 没有 */ } } });
S.at(bar(2) + 1.0, () => {   // 手机升起时重新播放房屋落下
  for (const a of D_().getAnimations()) { const el = a.effect && a.effect.target; if (el && el.classList && el.classList.contains('drop')) { a.__v = true; a.pause(); a.currentTime = 0; } }
});

/* ---------- 镜头 ---------- */
const CL = { x: 820, y: 540, s: 1.12 }, CR = { x: 1110, y: 540, s: 1.12 };
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  .hold(bar(3)).to(bar(4), { x: 1000, y: 540, s: 1.06 }, 'apple')
  .hold(bar(5) - 0.6).to(bar(5) + 0.6, { x: 775, y: 560, s: 1.4 }, 'apple').hold(bar(8) - 0.35)     // 会呼吸的地图（左）
  .to(bar(8), CR, 'apple').hold(bar(9) - 0.3)                                                       // 47 处（右）
  .to(bar(9), CL, 'apple').hold(bar(10) - 0.3)                                                      // 我的专业（左）
  .to(bar(10) + 0.2, CR, 'apple').hold(bar(13) - 0.3)                                               // 生活选房（右）
  .to(bar(13), CL, 'apple').hold(bar(14) - 0.3)                                                     // 推荐理由（左）
  .to(bar(14), { x: 1110, y: 500, s: 1.2 }, 'apple').hold(bar(15) - 0.3)                           // 多房对比（右）
  .to(bar(15), CL, 'apple').hold(bar(16) - 0.3)                                                     // 列表筛选（左）
  .to(bar(16), CR, 'apple').hold(bar(17)).to(bar(18) - 0.05, { x: 1118, y: 540, s: 1.34 }, 'io')     // 通勤圈（右）→ 断拍慢慢推近
  .to(bar(18) + 0.4, { x: 820, y: 470, s: 1.2 }, 'apple').hold(bar(22) - 0.3)                      // 日照（左）
  .to(bar(22), CR, 'apple').hold(bar(24) - 0.3)                                                     // 地图筛选（右）
  .to(bar(24), CL, 'apple').hold(bar(26) - 0.3)                                                     // 周边报告（左）
  .to(bar(26), CR, 'apple').hold(bar(28) - 0.3)                                                     // 官网周价（右）
  .to(bar(28), CL, 'apple').hold(bar(30) - 0.3)                                                     // 一年总花费（左）
  .to(bar(30), CR, 'apple').hold(bar(32) - 0.3)                                                     // 按预算（右）
  .to(bar(32), CL, 'apple').hold(bar(34) - 0.3)                                                     // 人格测试（左）
  .to(bar(34), CR, 'apple').hold(bar(37) - 0.3)                                                     // 抢房计划（右）
  .to(bar(37), CL, 'apple').hold(bar(39) - 0.3)                                                     // 分享二维码（左）
  .to(bar(39), CR, 'apple').hold(bar(42) - 0.3)                                                     // 两手准备（右）
  .to(bar(42), CL, 'apple').hold(bar(46) - 0.4)                                                     // 界面全收起（左）
  .to(bar(46), CR, 'apple').hold(bar(46) + 0.3).to(bar(47) - 0.05, { x: 1118, y: 500, s: 1.34 }, 'io')   // 申请专家群（右）：断拍推近
  .hold(bar(48)).to(bar(49), CL, 'apple').hold(bar(51) - 0.5)                                       // 收进备选（左）
  .to(bar(51) + 0.3, { x: 960, y: 540, s: 1 }, 'apple').fn();                                       // 片尾：拉远，设备变形
if (S.portrait) { const f = S.tracks.cam; S.tracks.cam = t => { const c = f(t); return Object.assign({}, c, { y: Math.max(c.y, 540), s: 1 + (c.s - 1) * 0.5 }); }; }
S.tracks.phone = K(0, { x: 0, y: 1150, s: 0.94, rx: 14 })
  .hold(bar(2)).to(bar(3), { y: 0, s: 1, rx: 0 }, 'apple')
  .hold(bar(51)).to(bar(51) + 0.3, { x: 0, y: 60, s: 0.88 }, 'apple').fn();
S.morph = {
  t0: bar(51) + 0.3, t1: bar(52) + 0.3, t2: bar(53), t3: bar(54),
  G: {
    phone: { sw: 390, sh: 844, pad: 14, r: 53, R: 66, cx: 960, cy: 600, sc: 0.88 },
    fold: { sw: 746, sh: 676, pad: 13, r: 32, R: 44, cx: 960, cy: 612, sc: 0.98 },
    tablet: { sw: 1174, sh: 834, pad: 20, r: 28, R: 46, cx: 960, cy: 626, sc: 0.8 }
  },
  GP: {
    phone: { sw: 390, sh: 844, pad: 14, r: 53, R: 66, cx: 960, cy: 600, sc: 0.88 },
    fold: { sw: 746, sh: 676, pad: 13, r: 32, R: 44, cx: 960, cy: 545, sc: 0.85 },
    tablet: { sw: 1174, sh: 834, pad: 20, r: 28, R: 46, cx: 960, cy: 520, sc: 0.6 }
  }
};
S.tracks.veil = K(0, { o: 0 }).hold(END - 1.4).to(END, { o: 1 }, 'in').fn();

/* ========== 前奏 · 律动 A ========== */
S.title(0.3, bar(2), { h: '在利物浦，<br>找到你的家。', cls: 'c big', x: 360, y: 395, w: 1200, fade: 0.6 });
S.sfx(bar(2), 'whoosh-up', 0.7);
S.at(bar(3), () => { try { W().HomeMatch.open(); } catch (e) { /* 没有 */ } });
S.title(bar(3) + 0.1, bar(5) - 0.3, Object.assign({ k: '我的选房指南', h: '住进适合你<br>日常的利物浦。' }, R));
S.tap(at(4, 2), leafText('先逛逛地图'));
S.mapGlide(bar(5) - 0.6, 1.2, riverView);
S.speed(bar(5) - 0.4, bar(8) - 0.3, 6, 0.3);
S.title(bar(5) + 0.1, bar(8) - 0.2, Object.assign({ k: '手绘地图', h: '一张<br>会呼吸的地图。', s: '渡轮、海鸥、云，<br>还有此刻利物浦的天气。' }, L));

/* ========== 冲击 bar 8 ========== */
S.mapGlide(bar(8) - 0.35, 0.9, studentsView);
S.sfx(bar(8) - 0.2, 'whoosh', 0.7);
S.title(bar(8), bar(9) - 0.15, Object.assign({ k: '清晰布局', h: '47 处公寓，<br>一眼看清。' }, R));

/* ========== 律动 B：选房快节奏（半拍一下，网页加快） ========== */
S.tap(bar(9), '#subjectToggle', HALF);
S.tap(at(9, 1), '#subjectPanel .fs-btn', HALF);
S.scroll(at(9, 1.3), at(9, 2.2), ...scrollTo(byText('#subjectPanel .fs-opt', '计算机科学'), 0.5));
S.tap(at(9, 2.5), byText('#subjectPanel .fs-opt', '计算机科学'), HALF);
S.sfx(at(9, 3), 'pop', 0.6);
S.title(bar(9), bar(10) - 0.15, Object.assign({ k: '按专业', h: '离课堂，<br>更近一步。' }, L));
S.at(at(9, 3.6), () => { try { W().SubjectDock.close(); } catch (e) {} });
S.tap(bar(10) + 0.05, '.hmgo2', HALF);
S.tap(at(10, 1), leafText('开始生活选房'), HALF);
S.speed(at(10, 1), bar(12) + 0.6, 2.4, 0.15);
[['.hm-opt', '利物浦大学'], ['.hm-opt', '自己下厨'], ['.hm-opt', '熟悉的食材'], ['[data-hm=next]', ''], ['.hm-opt', '都可以'], ['.hm-opt', '图书馆'], ['.hm-opt', '公园'], ['[data-hm=next]', ''], ['.hm-opt', '早点休息'], ['.hm-opt', '15 分钟以内']]
  .forEach(([sel, txt], i) => S.tap(at(10, 2 + i * 0.5), byText(sel, txt), HALF));
S.sfx(bar(12) + 0.7, 'pop', 0.8);
S.title(bar(10) + 0.05, bar(13) - 0.15, Object.assign({ k: '按生活', h: '8 个问题，<br>读懂你的日常。' }, R));
S.scroll(bar(13), at(13, 1.6), ...scrollTo(byText('.why2 li', '亚洲食材'), 0.3));
S.title(bar(13), bar(14) - 0.15, Object.assign({ k: '推荐理由', h: '推荐，<br>也写清理由。' }, L));
S.scroll(at(13, 2.2), at(13, 3.4), ...scrollTo(byText('button', '并排对比这'), 0.55));
S.tap(bar(14), byText('button', '并排对比这'), { lead: 0.12, sfx: 'pop' });
const walkRow = w => { const c = leafText('步行到利物浦大学')(w); if (!c) return null;
  return { getBoundingClientRect: () => { const r = c.getBoundingClientRect(), g = c.parentElement.getBoundingClientRect(); return { left: r.left, top: r.top, width: Math.min(g.right, w.innerWidth - 4) - r.left, height: r.height }; } }; };
S.mark(at(14, 1.2), bar(15) - 0.3, walkRow, { pad: 2 });
S.title(bar(14), bar(15) - 0.15, Object.assign({ k: '多房对比', h: '三处公寓，<br>一屏看懂。' }, R));
S.at(bar(15) - 0.2, () => { const x = D_().getElementById('cmpX'); if (x && vis(x)) x.click(); closeAll(); });
S.tap(bar(15), '[data-open="controls"]', HALF);
S.tap(at(15, 1), '#homeBudget', Object.assign({ fn: setValue('150') }, HALF));
S.tap(at(15, 1.5), '#homeRoom', Object.assign({ fn: setValue('ensuite') }, HALF));
S.tap(at(15, 2.5), '#viewResults', HALF);
S.title(bar(15), bar(16) - 0.15, Object.assign({ k: '公寓列表', h: '按预算、房型，<br>一键筛选。' }, L));
S.at(bar(16) - 0.2, () => { const c = [...D_().querySelectorAll('#homesPanel .closeSheet')].find(vis); if (c) c.click(); const r = D_().getElementById('resetHomeFilters'); if (r) r.click(); });
S.tap(bar(16), byText('.hi-bar-b', '通勤'), { lead: 0.12, sfx: 'pop' });
S.tap(at(16, 1.5), byText('.bt-chipbtn', '15 分钟'), HALF);
S.tap(at(16, 2.5), byText('.bt-btn', '在地图上看'), HALF);
S.sfx(at(16, 2.7), 'whoosh', 0.5);
S.title(bar(16), bar(18) - 0.2, Object.assign({ k: '通勤时间圈', h: '上课，<br>想住多近？', s: '步行 15 分钟内到利物浦大学。' }, R));

/* ========== 断拍 bar 17：挑一栋 ========== */
S.tap(bar(17), byText('.bt-btn', '看列表'));
S.scroll(at(17, 0.6), at(17, 1.7), ...scrollTo(byText('.qc-home', 'true Liverpool'), 0.42));
S.tap(at(17, 2.2), byText('.qc-home', 'true Liverpool'));
S.at(at(17, 2.9), () => { const c = byText('.bt-link', '清除')(W()); if (c) c.click(); });

/* ========== 强段 C（36 秒重拍）：日照 ========== */
S.tap(bar(18), byText('.hi-rb', '日照'), { lead: 0.25, sfx: 'pop' });
S.sfx(bar(18), 'hit', 0.55);
S.tap(at(18, 2), byText('.hi-panel .bt-chipbtn', '今天'), HALF);
S.slide(bar(19), bar(20) - 0.2, '.hi-panel input[type=range]', 720, 630);
S.slide(bar(20) + 0.2, bar(21) + 1.2, '.hi-panel input[type=range]', 630, 860);
S.title(bar(18), bar(22) - 0.2, Object.assign({ k: '日照', h: '看看下午的光。', s: '按楼体轮廓和太阳位置估算，<br>拖动一天里的时间。' }, L));
S.at(bar(22) - 0.2, () => { const x = D_().querySelector('.hi-panel .x'); if (x && vis(x)) x.click(); try { W().hide(); } catch (e) {} const c = D_().getElementById('cardX'); if (c && vis(c)) c.click(); });
S.sfx(bar(22) - 0.15, 'whoosh', 0.5);
S.tap(bar(22) + 0.05, byText('.hi-bar-f', '冬季日照'), HALF);
S.tap(at(22, 1), byText('.hi-bar-f', '安静'), HALF);
S.title(bar(22), bar(24) - 0.2, Object.assign({ k: '地图筛选', h: '冬天有阳光，<br>晚上够安静。' }, R));
S.at(bar(24) - 0.2, () => { const c = byText('a, button, span', '清除筛选')(W()); if (c) c.click(); W().show(homeById(W(), HOME_A), true); });
S.sfx(bar(24) - 0.15, 'whoosh', 0.5);
S.scroll(bar(24) + 0.1, at(24, 1.6), ...scrollTo(byText('.bt-tool', '周边报告'), 0.5));
S.tap(at(24, 2), byText('.bt-tool', '周边报告'), { lead: 0.15, sfx: 'pop' });
S.tap(bar(25), '[data-tab=safety]', { inner: '.full83-report-frame', lead: 0.15 });
S.tap(at(25, 2), '[data-tab=food]', { inner: '.full83-report-frame', lead: 0.15 });
S.title(bar(24), bar(26) - 0.2, Object.assign({ k: '周边报告', h: '住进去之前，<br>先看看周边。', s: '周边安全 · 吃饭 · 日常配套。' }, L));

/* ========== 强段 D：算钱 ========== */
S.at(bar(26) - 0.2, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
S.sfx(bar(26) - 0.15, 'whoosh', 0.5);
S.tap(at(26, 1), '#card .qt-tag.oc-mini', { lead: 0.15, sfx: 'pop' });
S.title(bar(26), bar(28) - 0.2, Object.assign({ k: '官网与 Amber 周价', h: '每一个价格，<br>都有出处。' }, R));
S.at(bar(28) - 0.2, () => { closeAll(); try { W().hide(); } catch (e) {} });
S.tap(bar(28), byText('.hi-bar-b', '总花费'), { lead: 0.15, sfx: 'pop' });
S.tap(at(28, 2), w => w.document.querySelector('.bt-box select'), Object.assign({ fn: selectText('Capital Gate') }, HALF));
S.scroll(at(28, 3), at(29, 1.5), w => scrollParent(w.document.querySelector('.bt-box input')), box => box.scrollHeight);
S.title(bar(28), bar(30) - 0.2, Object.assign({ k: '留学一年总花费', h: '一年要准备<br>多少钱？', s: '换算成人民币。' }, L));
S.at(bar(30) - 0.2, () => closeAll());
S.tap(bar(30), byText('.hi-bar-b', '按预算'), { lead: 0.15, sfx: 'pop' });
typeInto(at(30, 1.5), at(30, 2.5), w => w.document.querySelector('.bt-box input'), '8000');
S.scroll(bar(31), at(31, 1.5), w => scrollParent(w.document.querySelector('.bt-box input')), box => box.scrollTop + 260);
S.title(bar(30), bar(32) - 0.2, Object.assign({ k: '按预算看房', h: '按总预算，<br>反着找房。' }, R));
S.at(bar(32) - 0.2, () => closeAll());
S.at(bar(32) - 0.05, () => { try { W().FunQuizzes.open('buddy'); } catch (e) { /* 没有 */ } });
S.tap(at(32, 1), '#fqWrap [data-fq="start"]', HALF);
S.speed(at(32, 1), bar(33), 2.2, 0.15);
for (let i = 0; i < 5; i++) S.tap(at(32, 1.5 + i * 0.5), `#fqWrap [data-fq="opt"][data-i="${i % 2}"]`, HALF);
S.tap(bar(33), '#fqRes [data-fr="share"]', { lead: 0.15, sfx: 'pop' });
['拍立得', '车票', '便利贴'].forEach((k, i) => S.tap(at(33, 1 + i * 0.75), byText('.sc-tab', k), HALF));
S.title(bar(32), bar(34) - 0.2, Object.assign({ k: '留学人格测试', h: '分享<br>你的利物浦。' }, L));

/* ========== 律动 B：抢房 ========== */
S.at(bar(34) - 0.2, () => { const x = [...D_().querySelectorAll('.sc-wrap .x')].find(vis); if (x) x.click(); closeAll(); W().show(homeById(W(), HOME_B), true); });
S.sfx(bar(34) - 0.15, 'whoosh', 0.5);
S.scroll(bar(34) + 0.1, at(34, 1.6), ...scrollTo(byText('.bt-tool', '抢房准备'), 0.5));
S.tap(at(34, 2), byText('.bt-tool', '抢房准备'), { lead: 0.15, sfx: 'pop' });
S.tap(bar(35), byText('button', '加入计划'));
S.tap(at(35, 2), byText('.bp-tabs .br-tab', '抢房计划'));
S.tap(bar(36), byText('.bp-room', '独卫单间'));
S.tap(at(36, 1), byText('.bp-room', '单人公寓'));
S.title(bar(34), bar(37) - 0.2, Object.assign({ k: '抢房准备', h: '开放前，<br>先排好要订哪间。', s: '开放日历 · 抢房计划 · 开放提醒。' }, R));
S.scroll(bar(37), at(37, 2.5), ...scrollTo(byText('.bp-mp > .bt-btn', '分享'), 0.35));
S.tap(bar(38), byText('.bp-mp > .bt-btn', '分享'), { sfx: 'pop' });
S.scroll(at(38, 1), at(38, 3), ...scrollTo(w => w.document.querySelector('.bp-mp-card') || byText('.bp-mp > .bt-btn', '分享')(w), 0.2));
S.title(bar(37), bar(39) - 0.2, Object.assign({ k: '计划分享', h: '朋友扫一扫，<br>一起抢。' }, L));
S.scroll(bar(39), at(39, 3), ...scrollTo(w => w.document.querySelector('.bp-two'), 0.15));
S.tap(bar(40), byText('.bp-two .bt-btn', '复制'));
S.title(bar(39), bar(42) - 0.2, Object.assign({ k: '两手准备', h: '自己抢，<br>顾问一起盯。', s: '首选没了，马上换相近的房。' }, R));

/* ========== 低段 bar 42–45：一拖，界面全收起 ========== */
S.at(bar(42) - 0.2, () => { closeAll(); try { W().hide(); } catch (e) {} const c = D_().getElementById('cardX'); if (c && vis(c)) c.click(); const t = byText('button, a', '清空')(W()); if (t) t.click(); });   // 对比栏也清掉，只剩地图
S.mapGlide(bar(42) - 0.1, 1.4, studentsView);
S.drag(bar(43), at(43, 2.5), '.hi-bar .hi-handle', -460, 30, { ax: 6, ay: 8 });
S.sfx(at(43, 2.6), 'whoosh', 0.45);
S.title(bar(42), bar(46) - 0.3, Object.assign({ k: '界面全收起', h: '一拖到边，<br>只看地图。', s: '工具栏、卡片拖到屏幕边上，<br>收成一个小箭头；点一下就回来。' }, L));

/* ========== 断拍 bar 46 → 强段 C（94 秒重拍）：群码回传 ========== */
S.at(bar(46) - 0.4, () => W().show(homeById(W(), HOME_B), true));
S.tap(bar(46) - 0.1, '#card .cta');
S.tap(bar(47) - 1.42, byText('.f83-button', '申请我的专家群'));
S.tap(bar(47) - 0.04, w => [...w.document.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim() === '刷新'), { lead: 0.3, sfx: false });
S.sfx(bar(47), 'ding', 1);
S.title(bar(46), bar(49) - 0.2, Object.assign({ k: '订房专家', h: '一键，<br>连上订房专家。', s: '不用注册，不留资料。<br>演示群码，不会加入真实群聊。' }, R));
S.at(bar(49) - 0.2, () => { const m = byText('.f83-button', '收起')(W()); if (m) m.click(); });
S.tap(at(49, 2), byText('#card .home-action', '收藏'), { sfx: 'pop' });
S.title(bar(49), bar(51) - 0.2, Object.assign({ k: '选好了', h: '把它<br>收进备选。' }, L));

/* ========== 片尾：手机 → 折叠屏 → 平板，片名落在最后一下 ========== */
S.sfx(bar(51), 'whoosh', 0.7);
S.sfx(S.morph.t0 + 0.1, 'whoosh-up', 0.55);
S.sfx(S.morph.t2 + 0.1, 'whoosh-up', 0.55);
S.title(bar(51) + 0.2, bar(55) - 0.15, { k: '全设备适配', h: '手机 · 折叠屏 · 平板', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.4 });
S.title(bar(55), END + 1, { h: '留学住宿通', s: '利物浦学生住宿地图　　选房 · 比价 · 抢房 · 进群', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.45 });
