/* 利物浦学生住宿地图 · 宣传片（约 62 秒，16:9，中文，按配乐剪辑）
   镜头：0 开场 → 1 会呼吸的地图 → 2 公寓详情 → 3 生活选房 → 4 我的专业 → 5 人格测试与分享卡片 → 6 一键进群 → 7 片尾多设备
   坐标：舞台 1920×1080；手机屏幕左上角在舞台 (765, 118)，屏幕 390×844。cam = 把舞台上的 (x, y) 放到画面中心并放大 s 倍。 */
'use strict';
const SX = 765, SY = 118;                      // 手机屏幕在舞台上的位置
const scr = (x, y) => ({ x: SX + x, y: SY + y }); // 屏幕坐标 → 舞台坐标
const W = () => S.win(), D = () => S.doc();
const byText = (sel, txt) => w => [...w.document.querySelectorAll(sel)].find(e => e.textContent.includes(txt) && e.getBoundingClientRect().width > 0);
const marker = name => w => [...w.document.querySelectorAll('#homes g.m')].find(g => (g.getAttribute('aria-label') || '').includes(name));
const svgClick = el => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: el.ownerDocument.defaultView }));

/* ---------- 网页准备：关掉开场弹窗；地图先对准默西河（渡轮、海鸥） ---------- */
S.at(0, () => {
  for (const id of ['app', 'appT', 'appF']) { try { S.win(id).HomeMatch.exit(); } catch (e) { /* 没有 */ } }
  const w = W();
  w.eval(`(() => { const mx = (FA[0] + FB[0]) / 2 + 30, my = (FA[1] + FB[1]) / 2 + 10; z = Math.min(zmax(), 3.2 / fitK); tx = viewW / 2 - mx * fitK * z; ty = viewH / 2 - my * fitK * z; render(false); })()`);
});
const studentsView = w => w.eval(`(() => { const xs = HOMES.map(h => h.p[0]), ys = HOMES.map(h => h.p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), ww = mapbox.clientWidth, hh = mapbox.clientHeight - 130;
  const zz = Math.max(1, Math.min(zmax(), Math.min(ww / ((x1 - x0 + 80) * fitK), hh / ((y1 - y0 + 80) * fitK))));
  return { z: zz, tx: ww / 2 - (x0 + x1) / 2 * fitK * zz, ty: 60 + hh / 2 - (y0 + y1) / 2 * fitK * zz }; })()`);

/* 手机出现前，把地图中心对准渡轮此刻的位置（稍微往它前进的方向偏一点），推近时渡轮和海鸥都在画面里 */
S.at(4.0, () => W().eval(`(() => { const m = /translate\\(([-\\d.]+)[ ,]+([-\\d.]+)\\)/.exec(ferry.getAttribute('transform') || '');
  const fx = m ? +m[1] : (FA[0] + FB[0]) / 2, fy = m ? +m[2] : (FA[1] + FB[1]) / 2;
  z = Math.min(zmax(), 2.6 / fitK); tx = 238 - fx * fitK * z; ty = 462 - fy * fitK * z; render(false); })()`));   // 渡轮往左上开：起点放在右下，推近时正好经过画面中间

/* ---------- 配乐的节拍（paulyudin「The Tech」，112 拍/分，一拍 0.534 秒，一小节 4 拍） ----------
   scripts: promo-video/music/analyze.py 测出来的每一拍的时间。bar(n) = 第 n 小节的第一拍，beat(n) = 第 n 拍。
   乐曲结构：0–17 秒前奏 → 17–51 渐强 → 50.64–52.73 一小节几乎无声 → 52.73 高潮（drop）。 */
const BEATS = [0.093, 0.627, 1.161, 1.672, 2.206, 2.74, 3.274, 3.785, 4.319, 4.853, 5.364, 5.898, 6.409, 6.943, 7.477, 8.011, 8.522, 9.056, 9.59, 10.101, 10.635, 11.169, 11.68, 12.214, 12.748, 13.259, 13.793, 14.327, 14.838, 15.372, 15.906, 16.44, 16.951, 17.485, 17.995, 18.53, 19.04, 19.574, 20.108, 20.619, 21.153, 21.687, 22.221, 22.732, 23.266, 23.777, 24.311, 24.845, 25.379, 25.89, 26.424, 26.935, 27.469, 28.003, 28.514, 29.048, 29.582, 30.093, 30.627, 31.161, 31.672, 32.206, 32.74, 33.274, 33.808, 34.319, 34.853, 35.364, 35.898, 36.409, 36.943, 37.477, 37.988, 38.522, 39.056, 39.567, 40.101, 40.635, 41.169, 41.68, 42.214, 42.748, 43.259, 43.793, 44.304, 44.838, 45.372, 45.883, 46.417, 46.951, 47.485, 47.996, 48.53, 49.041, 49.575, 50.109, 50.643, 51.177, 51.688, 52.222, 52.733, 53.267, 53.801, 54.311, 54.846, 55.38, 55.89, 56.424, 56.959, 57.469, 58.003, 58.538, 59.048, 59.582, 60.116, 60.651, 61.161, 61.695, 62.206, 62.74, 63.274, 63.785, 64.319, 64.853, 65.364, 65.898, 66.432, 66.943, 67.477, 68.011, 68.522, 69.056, 69.59];
const beat = n => BEATS[n], bar = n => BEATS[n * 4];
const END = 62.6;   // 片长：高潮后两小节片尾，音乐在最后 3 秒淡出

/* ---------- 镜头运动（切换都在小节线上） ---------- */
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  // 标题在左 → 镜头中心偏左（x < 960），手机往右让开；标题在右 → x > 960
  // 1 会呼吸的地图（前奏 bar3–bar8）：推近河面，标题在左
  .hold(bar(4)).to(bar(6), { x: 775, y: 560, s: 1.45 }, 'apple').hold(bar(7))
  // 2 公寓详情（渐强开始 bar8）：标题在右
  .to(bar(8), { x: 1110, y: 540, s: 1.12 }, 'apple').hold(bar(10)).to(bar(11), { x: 1125, y: 610, s: 1.32 }, 'apple').hold(bar(12) - 0.75)
  // 3 生活选房（bar12–bar16）：标题在左
  .to(bar(12), { x: 820, y: 540, s: 1.12 }, 'apple').hold(bar(15)).to(bar(15) + 1.25, { x: 832, y: 660, s: 1.38 }, 'apple').hold(bar(16) - 0.5)
  // 4 我的专业（bar16–bar19）：标题在右
  .to(bar(16) + 0.6, { x: 1110, y: 530, s: 1.16 }, 'apple').hold(bar(19) - 0.6)
  // 5 人格测试 + 分享卡片（bar19–bar22）：标题在左
  .to(bar(19), { x: 820, y: 540, s: 1.12 }, 'apple').hold(bar(21)).to(bar(21) + 0.7, { x: 830, y: 520, s: 1.22 }, 'apple').hold(bar(22) - 0.4)
  // 6 一键进群（bar22–bar25）：标题在右；无声的那一小节慢慢推近，高潮时群码出现
  .to(bar(22) + 0.5, { x: 1110, y: 540, s: 1.12 }, 'apple').hold(bar(24)).to(bar(25), { x: 1118, y: 500, s: 1.42 }, 'io').hold(bar(26))
  // 7 片尾：拉远看全部设备
  .to(bar(26) + 1.75, { x: 960, y: 540, s: 1 }, 'apple').fn();

S.tracks.phone = K(0, { x: 0, y: 1150, s: 0.94, rx: 14 })
  .hold(bar(2)).to(bar(3), { y: 0, s: 1, rx: 0 }, 'apple')          // 一小节升起，落在小节线上
  .hold(bar(26)).to(bar(26) + 1.75, { x: 0, y: 30, s: 0.86 }, 'apple').fn();
S.tracks.fold = K(0, { x: -560, y: 90, s: 0.66, o: 0 }).hold(beat(105)).to(beat(105) + 1.6, { x: -560, y: 60, s: 0.74, o: 1 }, 'apple').fn();
S.tracks.tablet = K(0, { x: 560, y: 110, s: 0.52, o: 0 }).hold(beat(106)).to(beat(106) + 1.6, { x: 540, y: 70, s: 0.6, o: 1 }, 'apple').fn();
S.tracks.veil = K(0, { o: 0 }).hold(END - 1.4).to(END, { o: 1 }, 'in').fn();

/* ---------- 0 开场（前奏 2 小节） ---------- */
S.title(0.25, bar(2), { h: '在利物浦，<br>找到你的家。', cls: 'c big', x: 360, y: 395, w: 1200, fade: 0.9 });

/* ---------- 1 会呼吸的地图（bar3–bar8） ---------- */
S.speed(bar(2) - 0.1, bar(8) - 1, 6);   // 渡轮和海鸥按真实速度几乎不动：这一段网页时间 6 倍速（雨是 CSS 动画，照常）
S.title(bar(3) + 0.2, bar(7), { k: '手绘地图', h: '一张<br>会呼吸的地图。', s: '渡轮、海鸥、街上的车，<br>还有此刻利物浦的雨。', x: 130, y: 330, w: 600 });
S.mapGlide(bar(7) + 0.1, 1.9, studentsView);                           // 拉回镜头时地图回到公寓区

/* ---------- 2 公寓详情（bar8–bar12） ---------- */
S.tap(bar(9), marker('Great Newton'), { fn: svgClick });
S.tap(bar(10), '#card .detail-toggle');
S.during(bar(10) + 0.35, bar(10) + 1.55, u => { const sc = [...D().querySelectorAll('#card *')].find(e => e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY !== 'visible') || D().getElementById('card'); sc.scrollTop = E.apple(u) * 300; });
S.tap(bar(11), byText('#card button', '金级独卫单间'));
S.title(bar(8) + 0.25, bar(12) - 0.5, { k: '公寓详情', h: '每一处，<br>都看得清楚。', s: '价格、步行时间，<br>还有真实的房型照片。', x: 1190, y: 330, w: 640 });

/* ---------- 3 生活选房（bar12–bar16）：每拍答一题，网页翻页也快 1.5 倍 ---------- */
S.at(bar(12) - 0.75, () => {   // 关掉相册和卡片
  const d = D(); const x = [...d.querySelectorAll('.rp-x, .album .x, [class*=album] .x, [class*=lightbox] .x')].find(e => e.getBoundingClientRect().width > 0);
  if (x) x.click(); d.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
});
S.at(bar(12) - 0.5, () => { try { W().hide && W().hide(); } catch (e) {} const x = D().getElementById('cardX'); if (x && x.getBoundingClientRect().width) x.click(); });
S.tap(bar(12), '.hmgo2');
S.tap(beat(50), '#hmWrap [data-hm="start"]');
S.speed(bar(12) + 0.3, bar(15) + 0.5, 1.5, 0.3);
['uol', 'cook', 'weekly', 'any', 'library', 'shops', 'park', 'some', 'close'].forEach((v, i) => S.tap(beat(51 + i), `#hmWrap [data-hm="opt"][data-v="${v}"]`));
S.title(bar(12) + 0.25, bar(16) - 0.4, { k: '生活选房', h: '8 个问题，<br>读懂你的日常。', s: '按你的生活习惯，<br>推荐最合适的 3 处公寓。', x: 130, y: 330, w: 640 });

/* ---------- 4 我的专业（bar16–bar19） ---------- */
S.at(bar(16) - 0.25, () => { try { W().HomeMatch.exit(); } catch (e) {} });
S.tap(beat(66), '#subjectToggle');
S.tap(beat(68), '#subjectPanel .fs-btn');
S.tap(beat(70), byText('#subjectPanel .fs-opt', '医学'));
S.title(bar(16) + 0.2, bar(19) - 0.4, { k: '我的专业', h: '离课堂，<br>更近一步。', s: '教学楼亮起，<br>公寓按步行时间重新排序。', x: 1190, y: 330, w: 640 });

/* ---------- 5 人格测试 + 分享卡片（bar19–bar22）：同样每拍一题、快 1.5 倍；分享卡片每拍换一种 ---------- */
S.at(bar(19) - 0.5, () => { try { W().setSubject(''); } catch (e) {} try { W().SubjectDock.close(); } catch (e) {} });
S.at(bar(19) - 0.35, () => { W().FunQuizzes.open('buddy'); });
S.speed(bar(19), bar(21) - 0.3, 1.5, 0.3);
S.tap(beat(77), '#fqWrap [data-fq="start"]');
for (let i = 0; i < 5; i++) S.tap(beat(78 + i), `#fqWrap [data-fq="opt"][data-i="${i % 2}"]`);
S.tap(bar(21), '#fqRes [data-fr="share"]');
['拍立得', '车票', '便利贴'].forEach((k, i) => S.tap(beat(85 + i), byText('.sc-tab', k)));
S.title(bar(19) + 0.2, bar(22) - 0.4, { k: '留学人格测试', h: '分享<br>你的利物浦。', s: '测出你的类型，<br>生成 4 种分享卡片。', x: 130, y: 330, w: 640 });

/* ---------- 6 一键进群（bar22–bar26）：点「立即进群」，无声的一小节里等专家，高潮那一拍群码到了 ---------- */
S.at(bar(22) - 0.12, () => {
  const d = D(); const sx = [...d.querySelectorAll('.sc-wrap .x')].find(e => e.getBoundingClientRect().width); if (sx) sx.click();
  try { W().FunQuizzes.exit(); } catch (e) {}
  W().show(W().eval('HOMES').find(h => h.id === 'capital-gate'), true);
});
S.tap(beat(90), '#card .cta');
S.tap(bar(23), '.bh-join');
/* 专家在后台发来群码（演示模式下学生和后台共用本机存储，这里按后台的写法写进去） */
S.at(bar(25) - 0.06, () => {   // 提前一帧写入，群码正好在高潮那一帧出现
  const w = W(), k = 'lsm-live-me-v1', me = JSON.parse(w.localStorage.getItem(k)); if (!me) return;
  const now = w.Date.now();
  me.group = { team: 'A', channel: 'wechat', name: me.code + ' · ' + (me.request.homeName || ''), link: 'https://weixin.qq.com/g/LSMDEMO7K2X9', at: now, expiresAt: now + 7 * 864e5 };
  me.status = 'qr_sent'; me.messages.push({ from: 'agent', type: 'qr', at: now }); me.studentUnread = 1; me.updated = now;
  w.localStorage.setItem(k, JSON.stringify(me)); w.dispatchEvent(new w.StorageEvent('storage', { key: k }));
});
S.title(bar(22) + 0.3, bar(26) - 0.2, { k: '一键进群', h: '一键，<br>连上预定专家。', s: '不用注册，不留资料。<br>一个咨询编号就够了。', x: 1190, y: 330, w: 640 });

/* ---------- 7 片尾（bar26 起）：设备一拍一个进来，标题落在小节线上 ---------- */
S.title(bar(27), END - 0.6, { h: '利物浦学生住宿地图', s: '手机 · 平板 · 折叠屏　　中文 · English · 日本語', cls: 'c end', x: 360, y: 58, w: 1200, fade: 0.9 });
