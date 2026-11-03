/* 留学住宿通 · 30 秒竖版「上课近一点，下午有没有阳光？」（离线录屏包，2026-11-03）
   记住两个动作：圈出上课方便的公寓；拨动同一栋楼的一天。
   实拍路径：首次入场（房屋落下）→「先逛逛地图」→ 通勤时间圈「利物浦大学 · 步行 · 15 分钟」→「在地图上看」→「看列表」→ true Liverpool
   → 清掉通勤条 →「日照」→「今天」→ 时间拖到 10:30、再到 14:20 →「收起」看楼体 → 片名。
   录制：PORTRAIT=1 TL=timeline-v30 PRE=300 DATE=2026-11-03T12:00:00Z（网页「今天」= 11 月 3 日） */
'use strict';
const W = f => S.win(f), D_ = f => S.doc(f);
const vis = e => e && e.getBoundingClientRect().width > 0;
const byText = (sel, txt) => w => [...w.document.querySelectorAll(sel)].find(e => e.textContent.includes(txt) && vis(e));
const leafText = txt => w => [...w.document.querySelectorAll('button, a, span, div')].reverse().find(e => vis(e) && e.children.length === 0 && e.textContent.trim() === txt) ||
  [...w.document.querySelectorAll('button, a')].find(e => vis(e) && e.textContent.trim() === txt);
const scrollParent = el => { for (let p = el && el.parentElement; p; p = p.parentElement) { const cs = getComputedStyle(p); if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 4) return p; } return null; };
const rowIn = txt => w => byText('.qc-home', txt)(w);
const END = 30;
S.tapSfx = 'tick';

/* ---------- 镜头（竖版只用推近幅度和高度） ---------- */
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  .hold(8.2).to(9.4, { y: 470, s: 1.16 }, 'apple')       // 通勤圈画到地图上：推近一点
  .hold(10.3).to(11.0, { y: 540, s: 1 }, 'apple')
  .hold(16.6).to(17.6, { y: 440, s: 1.12 }, 'apple')     // 日照：看楼和太阳
  .hold(25.4).to(26.6, { y: 540, s: 1 }, 'apple').fn();
S.tracks.phone = K(0, { x: 0, y: 0, s: 1 }).fn();
S.tracks.veil = K(0, { o: 0 }).hold(29.2).to(END, { o: 0.0 }, 'in').fn();

/* ---------- 00–04 秒：真实入场，房屋落下；引导卡出现后轻点「先逛逛地图」 ----------
   网页 650 毫秒后自动弹出引导卡，会盖住正在落下的房子：这一帧先收起（还没显示出来），等房子落定再用网页自己的 HomeMatch.open() 打开 */
S.at(0.36, () => { try { W().HomeMatch.exit(); } catch (e) { /* 没有 */ } });
S.at(1.9, () => { try { W().HomeMatch.open(); } catch (e) { /* 没有 */ } });
S.tap(3.4, leafText('先逛逛地图'));

/* ---------- 04–12 秒：通勤时间圈 ---------- */
S.title(3.7, 11.6, { h: '上课，想住多近？', s: '选好去哪里、怎么去、最多走几分钟' });
S.tap(4.3, byText('.hi-bar-b', '通勤'));
S.sfx(4.45, 'pop', 0.7);
S.tap(5.7, byText('.bt-chipbtn', '10 分钟'));
S.tap(6.9, byText('.bt-chipbtn', '15 分钟'));
S.tap(8.1, byText('.bt-btn', '在地图上看'));
S.sfx(8.25, 'whoosh', 0.5);

/* ---------- 12–17 秒：看列表 → true Liverpool，停在房源卡 ---------- */
S.tap(11.3, byText('.bt-btn', '看列表'));
S.scroll(11.8, 13.1, w => scrollParent(rowIn('true Liverpool')(w)), (box, w) => { const r = rowIn('true Liverpool')(w); return box.scrollTop + r.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight * 0.42; });
S.tap(13.6, rowIn('true Liverpool'));
S.sfx(13.75, 'pop', 0.6);
S.tap(15.6, byText('.bt-link', '清除'), { sfx: 'tick-s' });   // 收起通勤结果条，露出整张房源卡

/* ---------- 17–26 秒：日照，拖动「一天在这栋楼」的时间 ---------- */
S.title(17.3, 25.8, { h: '看看下午的光', s: '同一栋楼，拖动一天里的时间' });
S.tap(16.7, byText('.hi-rb', '日照'));
S.sfx(16.85, 'pop', 0.6);
S.tap(17.9, byText('.hi-panel .bt-chipbtn', '今天'), { sfx: 'tick-s' });
S.slide(18.9, 20.6, '.hi-panel input[type=range]', 720, 630);    // 12:00 → 10:30
S.slide(21.5, 24.0, '.hi-panel input[type=range]', 630, 860);    // 10:30 → 14:20

/* ---------- 26–30 秒：收起面板，楼体与公寓名同框；片名 ---------- */
S.tap(25.3, '.hi-minimize', { sfx: 'tick-s' });
S.title(27.0, END + 1, { h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'c end', x: 360, y: 60, w: 1200, fade: 0.6 });
S.sfx(27.0, 'hit', 0.5);
