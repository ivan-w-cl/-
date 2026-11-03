/* 留学住宿通 · 完整版宣传片（约 2 分 21 秒，横版 / 竖版，中文）—— 离线录屏包 2026-11-03
   配乐 paulyudin「The Tech」全曲（112.35 拍/分，一小节 2.11 秒），镜头切换在小节第一拍，点按在拍子上。
   乐曲结构 → 镜头：
     前奏 bar 0–7 ········· 开场标题、手机升起、房屋落下、会呼吸的地图、47 处公寓
     渐强 bar 8–23 ········ 我的专业 · 生活选房 · 推荐理由与多房对比 · 列表筛选 · 通勤时间圈
     无声 bar 24 ·········· 从通勤圈里选中 true Liverpool
     高潮 bar 25（52.7 秒）· 日照在重拍上出现 → 拖动时间 · 冬季日照与安静筛选 · 周边报告 · 官网周价 · 一年总花费 · 按预算看房
     间奏 bar 41–48 ······· 抢房准备与计划（安静的段落）· 分享二维码 · 申请专家群
     再起 bar 49（103.3 秒）· 群码在这一拍回传 · 留学人格测试与分享卡片
     尾声 bar 57–66 ······· 手机 → 折叠屏 → 平板，片名
   录制：TL=timeline-full PRE=300 DATE=2026-11-03T12:00:00Z（竖版再加 PORTRAIT=1） */
'use strict';
/* The Tech（paulyudin）全曲节拍：music/analyze.py 测前 119.6 秒，121–156 秒单独再测一次，中间 5 拍按间隔补齐。第 0 拍是第 0 小节第一拍（112.35 拍/分） */
const BEATS = [0.093, 0.627, 1.161, 1.672, 2.206, 2.74, 3.274, 3.785, 4.319, 4.853, 5.364, 5.898, 6.409, 6.943, 7.477, 8.011, 8.522, 9.056, 9.59, 10.101, 10.635, 11.169, 11.68, 12.214, 12.748, 13.259, 13.793, 14.327, 14.838, 15.372, 15.906, 16.44, 16.951, 17.485, 17.995, 18.53, 19.04, 19.574, 20.108, 20.619, 21.153, 21.687, 22.221, 22.732, 23.266, 23.777, 24.311, 24.845, 25.379, 25.89, 26.424, 26.935, 27.469, 28.003, 28.514, 29.048, 29.582, 30.093, 30.627, 31.161, 31.672, 32.206, 32.74, 33.274, 33.808, 34.319, 34.853, 35.364, 35.898, 36.409, 36.943, 37.477, 37.988, 38.522, 39.056, 39.567, 40.101, 40.635, 41.169, 41.68, 42.214, 42.748, 43.259, 43.793, 44.304, 44.838, 45.372, 45.883, 46.417, 46.951, 47.485, 47.996, 48.53, 49.041, 49.575, 50.109, 50.643, 51.177, 51.688, 52.222, 52.733, 53.267, 53.801, 54.311, 54.846, 55.38, 55.89, 56.424, 56.959, 57.469, 58.003, 58.538, 59.048, 59.582, 60.116, 60.651, 61.161, 61.695, 62.206, 62.74, 63.274, 63.785, 64.319, 64.853, 65.364, 65.898, 66.432, 66.943, 67.477, 68.011, 68.522, 69.056, 69.59, 70.124, 70.635, 71.169, 71.703, 72.214, 72.748, 73.282, 73.793, 74.327, 74.838, 75.372, 75.906, 76.417, 76.951, 77.485, 77.996, 78.53, 79.064, 79.598, 80.109, 80.643, 81.154, 81.688, 82.222, 82.733, 83.267, 83.801, 84.335, 84.846, 85.38, 85.914, 86.448, 86.959, 87.493, 88.004, 88.538, 89.049, 89.583, 90.117, 90.651, 91.162, 91.696, 92.206, 92.74, 93.275, 93.809, 94.319, 94.854, 95.388, 95.922, 96.432, 96.967, 97.477, 98.011, 98.522, 99.056, 99.59, 100.124, 100.635, 101.169, 101.68, 102.214, 102.748, 103.259, 103.793, 104.327, 104.838, 105.372, 105.883, 106.417, 106.951, 107.462, 107.996, 108.53, 109.041, 109.575, 110.109, 110.62, 111.154, 111.688, 112.199, 112.733, 113.267, 113.778, 114.312, 114.846, 115.357, 115.891, 116.425, 116.936, 117.47, 118.004, 118.515, 119.049, 119.583, 120.111, 120.64, 121.168, 121.697, 122.231, 122.741, 123.276, 123.786, 124.32, 124.855, 125.365, 125.899, 126.433, 126.944, 127.478, 128.012, 128.523, 129.057, 129.591, 130.102, 130.636, 131.17, 131.681, 132.215, 132.749, 133.26, 133.794, 134.328, 134.839, 135.373, 135.907, 136.441, 136.952, 137.486, 137.997, 138.531, 139.065, 139.576, 140.11, 140.644, 141.155, 141.689, 142.223, 142.734, 143.268, 143.802, 144.313, 144.847, 145.381, 145.892, 146.426, 146.96, 147.494, 148.005, 148.539, 149.073, 149.584, 150.118, 150.652, 151.163];
const beat = n => BEATS[n], bar = n => BEATS[n * 4];
const END = bar(67);   // 141.2 秒：最后 3 秒音乐淡出

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

/* ---------- 网页准备：三台设备都先收起开场引导；折叠屏、平板显示全部公寓（片尾变形时露出来；不打开房源卡，房型照片的宣传使用范围待确认） ---------- */
S.at(0.36, () => {
  for (const id of ['app', 'appT', 'appF']) { try { W(id).HomeMatch.exit(); } catch (e) { /* 没有 */ } }
});
S.at(2.4, () => {
  for (const id of ['appT', 'appF']) { try { W(id).HomeMatch.exit(); jumpTo(W(id), studentsView(W(id))); } catch (e) { /* 没有 */ } }
});
/* 房屋落下：手机升起时重新播放网页自己的入场动画（.drop），观众能看到房子一栋栋落下 */
S.at(bar(2) + 1.0, () => {
  for (const a of D_().getAnimations()) { const el = a.effect && a.effect.target; if (el && el.classList && el.classList.contains('drop')) { a.__v = true; a.pause(); a.currentTime = 0; } }
});

/* ---------- 镜头：标题在左 → x < 960（手机往右让开）；标题在右 → x > 960 ---------- */
const CL = { x: 820, y: 540, s: 1.12 }, CR = { x: 1110, y: 540, s: 1.12 };
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  .hold(bar(3)).to(bar(4), { x: 960, y: 540, s: 1.04 }, 'apple')
  .hold(bar(5) - 0.6).to(bar(5) + 0.6, { x: 775, y: 560, s: 1.4 }, 'apple').hold(bar(7) + 0.1)     // 会呼吸的地图（标题在左）
  .to(bar(8), CR, 'apple').hold(bar(10) - 0.5)                                                      // 47 处公寓（标题在右）
  .to(bar(10), CL, 'apple').hold(bar(11) + 1).to(bar(12), { x: 832, y: 470, s: 1.28 }, 'apple').hold(bar(13) - 0.5)  // 我的专业（左）
  .to(bar(13), CR, 'apple').hold(bar(16) - 0.5)                                                     // 生活选房（右）
  .to(bar(16), CL, 'apple').hold(bar(18) - 0.5)                                                     // 推荐理由（左）
  .to(bar(18), { x: 1110, y: 500, s: 1.2 }, 'apple').hold(bar(20) - 0.5)                           // 多房对比（右，推近那一行）
  .to(bar(20), CL, 'apple').hold(bar(22) - 0.5)                                                     // 列表筛选（左）
  .to(bar(22), CR, 'apple').hold(bar(23)).to(bar(23) + 1, { x: 1118, y: 520, s: 1.26 }, 'apple')    // 通勤圈（右）
  .hold(bar(24)).to(bar(25) - 0.05, { x: 1118, y: 540, s: 1.34 }, 'io')                            // 无声的一小节：慢慢推近
  .to(bar(25) + 0.5, { x: 820, y: 470, s: 1.2 }, 'apple').hold(bar(29) - 0.5)                      // 日照（左）
  .to(bar(29), CR, 'apple').hold(bar(31) - 0.5)                                                     // 地图筛选（右）
  .to(bar(31), CL, 'apple').hold(bar(35) - 0.5)                                                     // 周边报告（左）
  .to(bar(35), CR, 'apple').hold(bar(36) + 1.5)                                                     // 官网周价（右）
  .to(bar(37), CL, 'apple').hold(bar(38) + 1.5)                                                     // 一年总花费（左）
  .to(bar(39), CR, 'apple').hold(bar(41) - 0.5)                                                     // 按预算（右）
  .to(bar(41), CL, 'apple').hold(bar(45) - 0.5)                                                     // 抢房计划（左）
  .to(bar(45), CR, 'apple').hold(bar(47) - 0.5)                                                     // 分享二维码（右）
  .to(bar(47), CL, 'apple').hold(bar(48)).to(bar(49) - 0.05, { x: 832, y: 500, s: 1.36 }, 'io')     // 申请专家群（左）：间奏最后一小节推近
  .hold(bar(50)).to(bar(51), CR, 'apple').hold(bar(55) - 0.5)                                       // 人格测试与分享卡片（右）
  .to(bar(55), CL, 'apple').hold(bar(57) - 0.4)                                                     // 收藏（左）
  .to(bar(57) + 0.6, { x: 960, y: 540, s: 1 }, 'apple').fn();                                       // 片尾：拉远，设备变形
/* 竖版：标题在手机上方，推近时手机不能往上顶到标题——推近幅度减半，镜头不往上移 */
if (S.portrait) { const f = S.tracks.cam; S.tracks.cam = t => { const c = f(t); return Object.assign({}, c, { y: Math.max(c.y, 540), s: 1 + (c.s - 1) * 0.5 }); }; }
S.tracks.phone = K(0, { x: 0, y: 1150, s: 0.94, rx: 14 })
  .hold(bar(2)).to(bar(3), { y: 0, s: 1, rx: 0 }, 'apple')                // 一小节升起，落在小节线上
  .hold(bar(57)).to(bar(57) + 0.6, { x: 0, y: 60, s: 0.88 }, 'apple').fn();
S.morph = {
  t0: bar(58), t1: bar(59), t2: bar(61), t3: bar(62),
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
S.tracks.veil = K(0, { o: 0 }).hold(END - 1.6).to(END, { o: 1 }, 'in').fn();

/* ========== 前奏 bar 0–7 ========== */
S.title(0.3, bar(2), { h: '在利物浦，<br>找到你的家。', cls: 'c big', x: 360, y: 395, w: 1200, fade: 0.8 });
S.sfx(bar(2), 'whoosh-up', 0.7);
S.at(beat(13), () => { try { W().HomeMatch.open(); } catch (e) { /* 没有 */ } });   // 选房指南
S.title(beat(13) + 0.1, bar(5) - 0.3, Object.assign({ k: '我的选房指南', h: '住进适合你<br>日常的利物浦。' }, R));
S.tap(beat(18), leafText('先逛逛地图'));
/* 会呼吸的地图：推近默西河，网页时间 6 倍速（渡轮、海鸥、云） */
S.mapGlide(bar(5) - 0.6, 1.2, riverView);
S.speed(bar(5) - 0.4, bar(7) + 0.2, 6, 0.3);
S.title(bar(5) + 0.1, bar(7) - 0.1, Object.assign({ k: '手绘地图', h: '一张<br>会呼吸的地图。', s: '渡轮、海鸥、云，<br>还有此刻利物浦的天气。' }, L));
S.mapGlide(bar(7) + 0.05, 1.6, studentsView);
S.sfx(bar(7) + 0.2, 'whoosh', 0.6);
S.title(bar(8), bar(10) - 0.3, Object.assign({ k: '清晰布局', h: '47 处公寓，<br>一眼看清。', s: '大学、车站、美食街、地标，<br>都画在同一张地图上。' }, R));

/* ========== 渐强 bar 8–23 ========== */
/* 我的专业：计算机科学 → 教学楼亮起，最近的公寓标出第 1/2/3 */
S.tap(bar(10), '#subjectToggle');
S.tap(beat(42), '#subjectPanel .fs-btn');
S.scroll(beat(43) - 0.1, beat(44) - 0.1, ...scrollTo(byText('#subjectPanel .fs-opt', '计算机科学'), 0.5));
S.tap(beat(45), byText('#subjectPanel .fs-opt', '计算机科学'));
S.sfx(beat(45) + 0.3, 'pop', 0.6);
S.title(bar(10) + 0.05, bar(13) - 0.3, Object.assign({ k: '按专业找房', h: '离课堂，<br>更近一步。', s: '教学楼在地图上亮起，<br>公寓按步行时间排出前三。' }, L));

/* 生活选房：每拍点一下，网页翻页快 1.5 倍 */
S.at(bar(13) - 0.3, () => { try { W().SubjectDock.close(); } catch (e) {} });
S.tap(bar(13), '.hmgo2');
S.tap(beat(53), leafText('开始生活选房'));
S.speed(beat(53), bar(16), 1.5, 0.2);
[['.hm-opt', '利物浦大学'], ['.hm-opt', '自己下厨'], ['.hm-opt', '熟悉的食材'], ['[data-hm=next]', ''], ['.hm-opt', '都可以'], ['.hm-opt', '图书馆'], ['.hm-opt', '公园'], ['[data-hm=next]', ''], ['.hm-opt', '早点休息'], ['.hm-opt', '15 分钟以内']]
  .forEach(([sel, txt], i) => S.tap(beat(54 + i), byText(sel, txt), FAST));
S.sfx(bar(16) - 0.1, 'pop', 0.8);
S.title(bar(13) + 0.05, bar(16) - 0.3, Object.assign({ k: '按生活选房', h: '8 个问题，<br>读懂你的日常。', s: '怎么吃、在哪学、周末怎么过。' }, R));

/* 推荐理由 → 并排对比这 3 处，突出「步行到利物浦大学」 */
S.scroll(bar(16) + 0.3, bar(17), ...scrollTo(byText('.why2 li', '亚洲食材'), 0.3));
S.title(bar(16) + 0.05, bar(18) - 0.3, Object.assign({ k: '推荐理由', h: '推荐，<br>也写清理由。', s: '离超市、亚洲食材店、图书馆<br>各走几分钟。' }, L));
S.scroll(bar(17) + 1.2, bar(18) - 0.3, ...scrollTo(byText('button', '并排对比这'), 0.55));
S.tap(bar(18), byText('button', '并排对比这'), { sfx: 'pop' });
const walkRow = w => { const c = leafText('步行到利物浦大学')(w); if (!c) return null;
  return { getBoundingClientRect: () => { const r = c.getBoundingClientRect(), g = c.parentElement.getBoundingClientRect(); return { left: r.left, top: r.top, width: Math.min(g.right, w.innerWidth - 4) - r.left, height: r.height }; } }; };
S.mark(bar(18) + 0.8, bar(20) - 0.4, walkRow, { pad: 2 });
S.title(bar(18) + 0.05, bar(20) - 0.3, Object.assign({ k: '多房对比', h: '三处公寓，<br>一屏看懂。', s: '到学校、房租、评分，<br>「最佳」一眼看出来。' }, R));

/* 公寓列表筛选：预算 £150、独卫单间 → 17 处 */
S.at(bar(20) - 0.25, () => { const x = D_().getElementById('cmpX'); if (x && vis(x)) x.click(); closeAll(); });
S.sfx(bar(20) - 0.2, 'whoosh', 0.5);
S.tap(bar(20) + 0.1, '[data-open="controls"]');
S.tap(beat(82), '#homeBudget', { fn: setValue('150') });
S.tap(beat(84), '#homeRoom', { fn: setValue('ensuite') });
S.tap(beat(86), '#viewResults');
S.title(bar(20) + 0.05, bar(22) - 0.3, Object.assign({ k: '公寓列表', h: '按预算、房型，<br>一键筛选。', s: '每周 £150 以内的独卫单间：17 处。' }, L));

/* 通勤时间圈：利物浦大学 · 步行 · 15 分钟 → 在地图上看 */
S.at(bar(22) - 0.2, () => { const c = [...D_().querySelectorAll('#homesPanel .closeSheet')].find(vis); if (c) c.click(); const r = D_().getElementById('resetHomeFilters'); if (r) r.click(); });
S.tap(bar(22) + 0.1, byText('.hi-bar-b', '通勤'), { sfx: 'pop' });
S.tap(beat(90), byText('.bt-chipbtn', '10 分钟'), FAST);
S.tap(beat(91), byText('.bt-chipbtn', '15 分钟'), FAST);
S.tap(bar(23), byText('.bt-btn', '在地图上看'));
S.sfx(bar(23) + 0.15, 'whoosh', 0.5);
S.title(bar(22) + 0.05, bar(24) + 0.6, Object.assign({ k: '通勤时间圈', h: '上课，<br>想住多近？', s: '9 点前到利物浦大学，步行 15 分钟内：<br>33 处公寓。' }, R));

/* ========== 无声 bar 24：从圈里挑一栋 ========== */
S.tap(bar(24), byText('.bt-btn', '看列表'));
S.scroll(beat(97) - 0.1, beat(98) + 0.1, ...scrollTo(byText('.qc-home', 'true Liverpool'), 0.42));
S.tap(beat(99) - 0.05, byText('.qc-home', 'true Liverpool'));
S.at(beat(99) + 0.3, () => { const c = byText('.bt-link', '清除')(W()); if (c) c.click(); });

/* ========== 高潮 bar 25（52.73 秒）：日照在重拍上打开 ========== */
S.tap(bar(25), byText('.hi-rb', '日照'), { lead: 0.25, sfx: 'pop' });
S.sfx(bar(25), 'hit', 0.55);
S.tap(beat(102), byText('.hi-panel .bt-chipbtn', '今天'), FAST);
S.slide(bar(26), bar(27) - 0.2, '.hi-panel input[type=range]', 720, 630);    // 12:00 → 10:30
S.slide(bar(27) + 0.3, bar(28) + 1.2, '.hi-panel input[type=range]', 630, 860);   // 10:30 → 14:20
S.title(bar(25) + 0.05, bar(29) - 0.3, Object.assign({ k: '日照', h: '看看下午的光。', s: '按楼体轮廓和太阳位置估算，<br>拖动一天里的时间。' }, L));

/* 地图筛选：冬季日照 + 安静 */
S.at(bar(29) - 0.25, () => { const x = D_().querySelector('.hi-panel .x'); if (x && vis(x)) x.click(); try { W().hide(); } catch (e) {} const c = D_().getElementById('cardX'); if (c && vis(c)) c.click(); });
S.sfx(bar(29) - 0.2, 'whoosh', 0.5);
S.tap(bar(29) + 0.1, byText('.hi-bar-f', '冬季日照'));
S.tap(beat(118), byText('.hi-bar-f', '安静'));
S.title(bar(29) + 0.05, bar(31) - 0.3, Object.assign({ k: '地图筛选', h: '冬天有阳光，<br>晚上够安静。', s: '冬至主立面 4 小时以上直射；<br>离主路 50 米、铁路 150 米以上。' }, R));

/* 周边报告：总览 → 周边安全 → 吃饭 */
S.at(bar(31) - 0.25, () => { const c = byText('a, button, span', '清除筛选')(W()); if (c) c.click(); W().show(homeById(W(), HOME_A), true); });
S.sfx(bar(31) - 0.2, 'whoosh', 0.5);
S.scroll(bar(31) + 0.2, bar(31) + 1.4, ...scrollTo(byText('.bt-tool', '周边报告'), 0.5));
S.tap(bar(32), byText('.bt-tool', '周边报告'), { sfx: 'pop' });
S.tap(bar(33), '[data-tab=safety]', { inner: '.full83-report-frame' });
S.tap(bar(34), '[data-tab=food]', { inner: '.full83-report-frame' });
S.title(bar(31) + 0.05, bar(35) - 0.3, Object.assign({ k: '周边报告', h: '住进去之前，<br>先看看周边。', s: '周边安全 · 吃饭 · 日常配套，<br>每项保留来源与日期。' }, L));

/* 官网与 Amber 周价（Capital Gate） */
S.at(bar(35) - 0.2, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
S.sfx(bar(35) - 0.2, 'whoosh', 0.5);
S.tap(beat(142), '#card .qt-tag.oc-mini', { sfx: 'pop' });
S.title(bar(35) + 0.05, bar(37) - 0.3, Object.assign({ k: '官网与 Amber 周价', h: '每一个价格，<br>都有出处。', s: '官网公开周租、房型与租期，<br>附核对时间和来源。' }, R));

/* 一年总花费：选 Capital Gate，房租 + 生活费换算成人民币 */
S.at(bar(37) - 0.2, () => { closeAll(); try { W().hide(); } catch (e) {} });
S.tap(bar(37) + 0.1, byText('.hi-bar-b', '总花费'), { sfx: 'pop' });
S.tap(beat(150), w => w.document.querySelector('.bt-box select'), { fn: selectText('Capital Gate') });
S.scroll(beat(151), beat(153), w => w.document.querySelector('.bt-box .bt-body') || scrollParent(w.document.querySelector('.bt-box input')), box => box.scrollHeight);
S.title(bar(37) + 0.05, bar(39) - 0.3, Object.assign({ k: '留学一年总花费', h: '一年要准备<br>多少钱？', s: '房租、押金和每月生活费，<br>换算成人民币。' }, L));

/* 按预算看房：输入总预算 £8000 */
S.at(bar(39) - 0.2, () => closeAll());
S.tap(bar(39) + 0.1, byText('.hi-bar-b', '按预算'), { sfx: 'pop' });
S.tap(beat(158), w => w.document.querySelector('.bt-box input'), { fn: () => {} });
typeInto(beat(158) + 0.1, beat(159) + 0.2, w => w.document.querySelector('.bt-box input'), '8000');
S.scroll(beat(160), beat(162), w => scrollParent(w.document.querySelector('.bt-box input')), box => box.scrollTop + 260);
S.title(bar(39) + 0.05, bar(41) - 0.3, Object.assign({ k: '按预算看房', h: '按总预算，<br>反着找房。', s: '一年 £8,000：每周多少钱、<br>哪些公寓在范围内。' }, R));

/* ========== 间奏 bar 41–48（音乐安静下来） ========== */
/* 抢房准备：Capital Gate 加入计划，房型排好首选和备选 */
S.at(bar(41) - 0.2, () => { closeAll(); W().show(homeById(W(), HOME_B), true); });
S.sfx(bar(41) - 0.2, 'whoosh', 0.45);
S.scroll(bar(41) + 0.2, bar(41) + 1.5, ...scrollTo(byText('.bt-tool', '抢房准备'), 0.5));
S.tap(bar(42), byText('.bt-tool', '抢房准备'), { sfx: 'pop' });
S.tap(bar(43), byText('button', '加入计划'));
S.tap(bar(44), byText('.bp-tabs .br-tab', '抢房计划'));
S.tap(beat(178), byText('.bp-room', '独卫单间'));
S.tap(beat(180), byText('.bp-room', '单人公寓'));
S.title(bar(41) + 0.05, bar(45) - 0.3, Object.assign({ k: '抢房准备', h: '开放前，<br>先排好要订哪间。', s: '开放日历 · 抢房计划 · 开放提醒；<br>开放日期以官网为准。' }, L));
/* 分享二维码 */
S.scroll(bar(45), bar(45) + 1.4, ...scrollTo(byText('.bp-mp > .bt-btn', '分享'), 0.35));
S.tap(bar(46), byText('.bp-mp > .bt-btn', '分享'), { sfx: 'pop' });
S.scroll(bar(46) + 0.5, bar(46) + 1.6, ...scrollTo(w => w.document.querySelector('.bp-mp-card') || byText('.bp-mp > .bt-btn', '分享')(w), 0.2));
S.title(bar(45) + 0.05, bar(47) - 0.3, Object.assign({ k: '计划分享', h: '朋友扫一扫，<br>一起抢。', s: '计划快照生成二维码，<br>在小程序里直接打开、复制。' }, R));
/* 申请专家群：间奏最后一小节等待，群码在 bar 49 回传（网页 1.3 秒后才可以回传，重拍那一刻点「刷新」） */
S.at(bar(47) - 0.2, () => closeAll());
S.tap(bar(47) + 0.15, '#card .cta');
S.tap(bar(49) - 1.42, byText('.f83-button', '申请我的专家群'));
S.tap(bar(49) - 0.04, w => [...w.document.querySelectorAll('button')].find(b => vis(b) && b.textContent.trim() === '刷新'), { lead: 0.3, sfx: false });
S.sfx(bar(49), 'ding', 1);
S.title(bar(47) + 0.05, bar(51) - 0.3, Object.assign({ k: '订房专家', h: '一键，<br>连上订房专家。', s: '不用注册，不留资料。<br>演示群码，不会加入真实群聊。' }, L));

/* ========== 再起 bar 49 → 留学人格测试与分享卡片 ========== */
S.at(bar(51) - 0.25, () => { const m = byText('.f83-button', '收起')(W()); if (m) m.click(); try { W().hide(); } catch (e) {} });
S.sfx(bar(51) - 0.2, 'whoosh', 0.5);
S.at(bar(51) - 0.05, () => { try { W().FunQuizzes.open('buddy'); } catch (e) { /* 没有 */ } });
S.tap(beat(205), '#fqWrap [data-fq="start"]');
S.speed(beat(205), bar(53), 1.5, 0.2);
for (let i = 0; i < 5; i++) S.tap(beat(206 + i), `#fqWrap [data-fq="opt"][data-i="${i % 2}"]`, FAST);
S.tap(bar(53), '#fqRes [data-fr="share"]', { sfx: 'pop' });
['拍立得', '车票', '便利贴'].forEach((k, i) => S.tap(beat(214 + i * 2), byText('.sc-tab', k), FAST));
S.title(bar(51) + 0.05, bar(55) - 0.3, Object.assign({ k: '留学人格测试', h: '分享<br>你的利物浦。', s: '四个小测试，<br>四种分享卡片。' }, R));

/* 选定：回到 Capital Gate，收藏 */
S.at(bar(55) - 0.25, () => { const x = [...D_().querySelectorAll('.sc-wrap .x')].find(vis); if (x) x.click(); closeAll(); W().show(homeById(W(), HOME_B), true); });
S.sfx(bar(55) - 0.2, 'whoosh', 0.5);
S.tap(bar(56), byText('#card .home-action', '收藏'), { sfx: 'pop' });
S.title(bar(55) + 0.05, bar(57) - 0.3, Object.assign({ k: '选好了', h: '把它<br>收进备选。' }, L));

/* ========== 尾声：手机 → 折叠屏 → 平板，片名 ========== */
S.sfx(bar(57), 'whoosh', 0.7);
S.sfx(S.morph.t0 + 0.1, 'whoosh-up', 0.55);
S.sfx(S.morph.t2 + 0.1, 'whoosh-up', 0.55);
S.title(bar(58), bar(63) - 0.3, { k: '全设备适配', h: '手机 · 折叠屏 · 平板', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.5 });
S.sfx(bar(63), 'hit', 0.9);
S.title(bar(63), END + 1, { h: '留学住宿通', s: '利物浦学生住宿地图　　选房 · 比价 · 抢房 · 进群', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.6 });
