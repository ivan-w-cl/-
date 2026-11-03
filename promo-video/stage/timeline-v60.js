/* 留学住宿通 · 约 60 秒横版「还没到利物浦，先走一遍自己的日常」（离线录屏包，2026-11-03）
   实拍路径：首次入场 →「按专业找房」→ 计算机科学（教学楼亮起）→「生活选房」答两题（利物浦大学、自己下厨），剪接跳过其余 6 题 → 推荐结果和理由
   →「并排对比这 3 处」（突出「步行到利物浦大学」一行）→ iQ Great Newton House「在地图上查看」→「日照」→「今天」拖到 10:30、14:20
   →「← 房源详情」→「周边报告」→「吃饭」→ 关掉 →「抢房准备」→「加入计划」→「抢房计划」→ 首选独卫单间 → 片名。
   录制：TL=timeline-v60 PRE=300 DATE=2026-11-03T12:00:00Z（横版 1920×1080） */
'use strict';
const W = f => S.win(f);
const vis = e => e && e.getBoundingClientRect().width > 0;
const byText = (sel, txt) => w => [...w.document.querySelectorAll(sel)].find(e => e.textContent.includes(txt) && vis(e));
const leafText = txt => w => [...w.document.querySelectorAll('button, a, span, div, th, td')].reverse().find(e => vis(e) && e.children.length === 0 && e.textContent.trim() === txt) ||
  [...w.document.querySelectorAll('button, a')].find(e => vis(e) && e.textContent.trim() === txt);
const scrollParent = el => { for (let p = el && el.parentElement; p; p = p.parentElement) { const cs = getComputedStyle(p); if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 4) return p; } return null; };
/* 把 el 滚到容器的某个高度（0 顶部 · 0.5 中间） */
const scrollTo = (find, at) => [w => scrollParent(find(w)), (box, w) => { const r = find(w); return box.scrollTop + r.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight * at; }];
const click = find => () => { const e = find(W()); if (e) e.click(); else console.warn('click: missing'); };
const END = 61;
S.tapSfx = 'tick';
const L = { x: 150, y: 400, w: 620, fade: 0.45 }, R = { x: 1190, y: 400, w: 640, fade: 0.45 };   // 标题在左 / 在右

/* ---------- 镜头：标题在左 → x < 960（手机往右让开）；标题在右 → x > 960 ---------- */
const CL = { x: 800, y: 540, s: 1.06 }, CR = { x: 1120, y: 540, s: 1.06 };
S.tracks.cam = K(0, CL)
  .hold(5.6).to(6.6, CR, 'apple')                                   // 我的专业（标题在右）
  .hold(8.4).to(9.6, { x: 1120, y: 470, s: 1.22 }, 'apple')          // 教学楼亮起：推近
  .hold(13.4).to(14.4, CL, 'apple')                                 // 生活选房（标题在左）
  .hold(19.9).to(20.6, CR, 'apple')                                 // 推荐结果（标题在右）
  .hold(25.2).to(26.0, CL, 'apple')                                 // 并排对比（标题在左）
  .hold(26.4).to(27.4, { x: 800, y: 470, s: 1.2 }, 'apple')          // 推近那一行
  .hold(32.4).to(33.4, CR, 'apple')                                 // 日照（标题在右）
  .hold(34.8).to(35.8, { x: 1120, y: 460, s: 1.18 }, 'apple')
  .hold(41.2).to(42.2, CL, 'apple')                                 // 周边报告（标题在左）
  .hold(52.6).to(53.6, CR, 'apple')                                 // 抢房计划（标题在右）
  .hold(57.6).to(58.8, CL, 'apple').fn();                           // 片名在左
S.tracks.phone = K(0, { x: 0, y: 0, s: 1 }).fn();
S.tracks.veil = K(0, { o: 0 }).hold(17.55).to(17.85, { o: 1 }, 'io').hold(19.95).to(20.35, { o: 0 }, 'io').fn();

/* ---------- 00–05 秒：房屋落下（引导卡先收起，落定后再打开）---------- */
S.at(0.36, () => { try { W().HomeMatch.exit(); } catch (e) { /* 没有 */ } });
S.at(1.9, () => { try { W().HomeMatch.open(); } catch (e) { /* 没有 */ } });
S.title(0.5, 5.4, Object.assign({ h: '如果下学期<br>在利物浦上课……' }, L));

/* ---------- 05–14 秒：我的专业 → 计算机科学，教学楼在地图上亮起 ---------- */
S.tap(4.4, leafText('按专业找房'));
S.tap(5.9, '.fs-btn');
S.scroll(6.4, 7.2, ...scrollTo(byText('.fs-opt', '计算机科学'), 0.45));
S.tap(7.7, byText('.fs-opt', '计算机科学'));
S.sfx(8.4, 'whoosh', 0.45);
S.title(8.6, 13.6, Object.assign({ h: '从上课的<br>地方开始', s: '选专业，教学楼在地图上亮起<br>公寓按步行时间排出前三' }, R));

/* ---------- 14–25 秒：生活选房（成片保留两次选择，剪接后到结果）---------- */
S.tap(14.2, '.hmgo2');
S.tap(15.2, leafText('开始生活选房'));
S.title(15.2, 19.6, Object.assign({ h: '按自己的日常选', s: '8 个小问题：怎么吃、在哪学、周末怎么过' }, L));
S.tap(16.0, byText('.hm-opt', '利物浦大学'));
S.tap(17.0, byText('.hm-opt', '自己下厨'));
/* 剪接：画面淡到底色，其余 6 题照常点完（网页时间加快），再淡回推荐结果 */
S.speed(17.85, 19.9, 3, 0.05);
[['.hm-opt', '熟悉的食材'], ['[data-hm=next]', ''], ['.hm-opt', '东亚'], ['[data-hm=next]', ''], ['.hm-opt', '图书馆'], ['.hm-opt', '公园'], ['[data-hm=next]', ''], ['.hm-opt', '早点休息'], ['.hm-opt', '15 分钟以内']]
  .forEach(([sel, txt], i) => S.at(17.95 + i * 0.2, click(byText(sel, txt))));
S.sfx(19.95, 'pop', 0.6);
S.title(20.4, 25.0, Object.assign({ h: '推荐，<br>也写清理由', s: '离超市、亚洲食材店、图书馆各走几分钟' }, R));
S.scroll(21.4, 22.6, ...scrollTo(byText('.why2 li', '亚洲食材采购参考'), 0.3));
S.scroll(24.0, 24.7, ...scrollTo(byText('button', '并排对比这'), 0.55));

/* ---------- 25–33 秒：并排对比，只突出「步行到利物浦大学」这一行 ---------- */
S.tap(25.2, byText('button', '并排对比这'));
S.sfx(25.35, 'pop', 0.6);
/* 对比表是 CSS 网格，没有「行」元素：从行名格子拉到屏幕右边，画出这一行 */
const walkRow = w => { const c = leafText('步行到利物浦大学')(w); if (!c) return null;
  return { getBoundingClientRect: () => { const r = c.getBoundingClientRect(), g = c.parentElement.getBoundingClientRect(); return { left: r.left, top: r.top, width: Math.min(g.right, w.innerWidth - 4) - r.left, height: r.height }; } }; };
S.mark(26.6, 32.3, walkRow, { pad: 2 });
S.title(26.2, 32.6, Object.assign({ h: '到学校，<br>各走几分钟', s: '两处候选放在一起，差别一眼看清' }, L));

/* ---------- 33–42 秒：iQ Great Newton House，拖过一天里的两个时刻 ---------- */
S.tap(32.9, w => [...w.document.querySelectorAll('button, a')].filter(e => vis(e) && e.textContent.includes('在地图上查看'))[1]);
S.sfx(33.05, 'whoosh', 0.4);
S.at(33.7, () => { try { W().HomeMatch.exit(); } catch (e) { /* 没有 */ } });   // 选房卡收起，只留这栋楼的房源卡
S.tap(34.6, byText('.hi-rb', '日照'));
S.tap(35.5, byText('.hi-panel .bt-chipbtn', '今天'), { sfx: 'tick-s' });
S.title(34.4, 41.4, Object.assign({ h: '下午，阳光<br>照到哪一面', s: '按楼体轮廓和太阳位置估算' }, R));
S.slide(36.3, 37.8, '.hi-panel input[type=range]', 720, 630);
S.slide(38.6, 40.8, '.hi-panel input[type=range]', 630, 860);

/* ---------- 42–53 秒：周边报告 → 吃饭 ---------- */
S.tap(41.6, '.hi-back', { sfx: 'tick-s' });
S.scroll(42.2, 43.2, ...scrollTo(byText('.bt-tool', '周边报告'), 0.5));
S.tap(43.7, byText('.bt-tool', '周边报告'));
S.sfx(43.85, 'pop', 0.6);
S.tap(45.6, '[data-tab=food]', { inner: '.full83-report-frame' });
S.title(44.8, 52.4, Object.assign({ h: '楼下吃什么，<br>卫生几级', s: '英国食品标准局的检查记录<br>保留检查日期与来源' }, L));

/* ---------- 53–61 秒：抢房准备 → 加入计划 → 抢房计划 ---------- */
S.at(52.5, () => { try { W().BookingTools.close(); } catch (e) { /* 没有 */ } });
S.sfx(52.5, 'tick-s', 0.7);
S.tap(53.6, byText('.bt-tool', '抢房准备'));
S.sfx(53.75, 'pop', 0.6);
S.tap(54.9, byText('button', '加入计划'));
S.tap(56.0, byText('.bp-tabs .br-tab', '抢房计划'));
S.tap(57.1, byText('.bp-room', '独卫单间'));
S.title(54.2, 58.4, Object.assign({ h: '开放前，<br>先排好要订哪间', s: '加入抢房计划，首选和备选排好顺序' }, R));
S.title(59.0, END + 1, Object.assign({ h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'end' }, L, { fade: 0.6 }));
S.sfx(59.0, 'hit', 0.5);
