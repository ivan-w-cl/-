/* 利物浦学生住宿地图 · 宣传片 30 秒版（29.4 秒，16:9，中文，按配乐剪辑）
   配乐：paulyudin「The Tech」原曲 33.8–56.9 秒（渐强 8 小节 → 无声 1 小节 → 高潮 2 小节）接上原曲最后两小节（鼓点 + 收尾），节奏不变。
   music/prepare30.sh 剪出音乐并测出每一拍（下面的 BEATS，单位秒）。D(k) = 第 k 小节第一拍，B(n) = 第 n 拍，B(n.5) = 半拍。
   镜头：开场 → 会呼吸的地图 → 公寓详情 → 生活选房 → 我的专业 → 人格测试与分享卡片 → 一键进群（高潮）→ 片尾多设备
   坐标：舞台 1920×1080；手机屏幕左上角在舞台 (765, 118)，屏幕 390×844。 */
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
S.at(0.02, () => W().eval(`(() => { const m = /translate\\(([-\\d.]+)[ ,]+([-\\d.]+)\\)/.exec(ferry.getAttribute('transform') || '');
  const fx = m ? +m[1] : (FA[0] + FB[0]) / 2, fy = m ? +m[2] : (FA[1] + FB[1]) / 2;
  z = Math.min(zmax(), 2.6 / fitK); tx = 212 - fx * fitK * z; ty = 410 - fy * fitK * z; render(false); })()`));   // 渡轮往左上开：起点放在右下，推近时正好经过画面中间

const BEATS = [0.0261, 0.5341, 1.0594, 1.5877, 2.113, 2.6384, 3.1666, 3.692, 4.2173, 4.7456, 5.2709, 5.7963, 6.3245, 6.8499, 7.3752, 7.9035, 8.4288, 8.9542, 9.4824, 10.0078, 10.5332, 11.0614, 11.5868, 12.1121, 12.6404, 13.1657, 13.694, 14.2193, 14.7447, 15.27, 15.7983, 16.3236, 16.8025, 17.3297, 17.8569, 18.3699, 18.8971, 19.4243, 19.9515, 20.4787, 21.0059, 21.5331, 22.0603, 22.6366, 23.1677, 23.7105, 24.2358, 24.7612, 25.2865, 25.8148, 26.343, 26.8684, 27.3995, 27.9267, 28.4539, 28.9811];
const B = n => { const i = Math.floor(n), f = n - i; return f ? BEATS[i] + (BEATS[i + 1] - BEATS[i]) * f : BEATS[i]; };
const Db = k => B(k * 4);
const END = 29.39;   // 音乐长度：最后一下鼓点在 27.1 秒左右，余音到片尾
const FAST = { lead: 0.16 };   // 半拍连点：点按圈提前 0.16 秒出现

/* ---------- 镜头运动 ---------- */
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  // 标题在左 → 镜头中心偏左（x < 960），手机往右让开；标题在右 → x > 960
  .hold(Db(1)).to(Db(2) - 0.15, { x: 775, y: 560, s: 1.45 }, 'apple')                          // 地图：推近河面（标题在左）
  .to(Db(2) + 0.45, { x: 1110, y: 540, s: 1.12 }, 'apple').hold(B(11)).to(B(12.5), { x: 1125, y: 610, s: 1.32 }, 'apple').hold(B(13.7))   // 公寓详情（标题在右）
  .to(B(14.5), { x: 820, y: 540, s: 1.12 }, 'apple').hold(B(19.6)).to(B(21), { x: 832, y: 660, s: 1.38 }, 'apple').hold(B(21.8))           // 生活选房（标题在左）
  .to(B(22.6), { x: 1110, y: 530, s: 1.16 }, 'apple').hold(B(25.7))                             // 我的专业（标题在右）
  .to(B(26.5), { x: 820, y: 540, s: 1.12 }, 'apple').hold(B(29.6)).to(B(30.6), { x: 830, y: 520, s: 1.22 }, 'apple').hold(B(31.8))       // 人格测试 + 分享卡片（标题在左）
  .to(B(32.6), { x: 1110, y: 540, s: 1.12 }, 'apple').hold(B(33.2)).to(B(36), { x: 1118, y: 500, s: 1.42 }, 'io').hold(Db(10))          // 一键进群：无声的一小节慢慢推近（标题在右）
  .to(Db(10) + 1.35, { x: 960, y: 540, s: 1 }, 'apple').fn();                                   // 片尾：拉远看全部设备

S.tracks.phone = K(0, { x: 0, y: 1150, s: 0.94, rx: 14 })
  .hold(1.05).to(Db(1), { y: 0, s: 1, rx: 0 }, 'apple')                                         // 开场标题淡出时升起，落在第 2 小节
  .hold(Db(10)).to(Db(10) + 1.35, { x: 0, y: 30, s: 0.86 }, 'apple').fn();
S.tracks.fold = K(0, { x: -560, y: 90, s: 0.66, o: 0 }).hold(B(41)).to(B(41) + 1.2, { x: -560, y: 60, s: 0.74, o: 1 }, 'apple').fn();
S.tracks.tablet = K(0, { x: 560, y: 110, s: 0.52, o: 0 }).hold(B(42)).to(B(42) + 1.2, { x: 540, y: 70, s: 0.6, o: 1 }, 'apple').fn();
S.tracks.veil = K(0, { o: 0 }).hold(27.6).to(END, { o: 1 }, 'in').fn();

/* ---------- 开场（第 1 小节） ---------- */
S.title(0.05, 1.3, { h: '在利物浦，<br>找到你的家。', cls: 'c big', x: 360, y: 395, w: 1200, fade: 0.4 });

/* ---------- 会呼吸的地图（第 2 小节）：网页时间 6 倍速，渡轮和海鸥看得出在动 ---------- */
S.speed(0, Db(2) - 0.4, 6, 0.3);
S.title(Db(1) + 0.05, Db(2) - 0.05, { k: '手绘地图', h: '一张<br>会呼吸的地图。', x: 130, y: 360, w: 600, fade: 0.4 });
S.mapGlide(Db(2) - 0.45, 0.75, studentsView);

/* ---------- 公寓详情（第 3 小节 + 半小节） ---------- */
S.tap(B(9), marker('Great Newton'), { fn: svgClick, lead: 0.16 });
S.tap(B(11), '#card .detail-toggle', { lead: 0.25 });
S.during(B(11) + 0.2, B(12) - 0.05, u => { const sc = [...D().querySelectorAll('#card *')].find(e => e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY !== 'visible') || D().getElementById('card'); sc.scrollTop = E.apple(u) * 300; });
S.tap(B(12), byText('#card button', '金级独卫单间'), { lead: 0.2 });
S.title(Db(2) + 0.1, B(14) - 0.1, { k: '公寓详情', h: '每一处，<br>都看得清楚。', x: 1190, y: 360, w: 640, fade: 0.4 });

/* ---------- 生活选房（2 小节）：直接进第 1 题，每半拍答一题，网页翻页快 2 倍 ---------- */
S.at(B(14) - 0.18, () => {
  const d = D(); const x = [...d.querySelectorAll('.rp-x, .album .x, [class*=album] .x, [class*=lightbox] .x')].find(e => e.getBoundingClientRect().width > 0);
  if (x) x.click(); d.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
});
S.at(B(14) - 0.06, () => { try { W().hide && W().hide(); } catch (e) {} const x = D().getElementById('cardX'); if (x && x.getBoundingClientRect().width) x.click(); });
S.at(B(14), () => W().HomeMatch.open(0));
S.speed(B(14), B(19.6), 2, 0.2);
['uol', 'cook', 'weekly', 'any', 'library', 'shops', 'park', 'some', 'close'].forEach((v, i) => S.tap(B(15 + i * 0.5), `#hmWrap [data-hm="opt"][data-v="${v}"]`, FAST));
S.title(B(14) + 0.05, B(22) - 0.1, { k: '生活选房', h: '8 个问题，<br>读懂你的日常。', x: 130, y: 360, w: 640, fade: 0.4 });

/* ---------- 我的专业（1 小节） ---------- */
S.at(B(22) - 0.1, () => { try { W().HomeMatch.exit(); } catch (e) {} });
S.tap(B(22), '#subjectToggle', { lead: 0.2 });
S.tap(B(23), '#subjectPanel .fs-btn', { lead: 0.2 });
S.tap(B(24), byText('#subjectPanel .fs-opt', '医学'), { lead: 0.2 });
S.title(B(22) + 0.05, B(26) - 0.1, { k: '我的专业', h: '离课堂，<br>更近一步。', x: 1190, y: 360, w: 640, fade: 0.4 });

/* ---------- 人格测试 + 分享卡片（1 小节半）：每半拍答一题、快 2 倍，再换两种分享卡片 ---------- */
S.at(B(26) - 0.25, () => { try { W().setSubject(''); } catch (e) {} try { W().SubjectDock.close(); } catch (e) {} });
S.at(B(26) - 0.15, () => { W().FunQuizzes.open('buddy'); });
S.at(B(26), () => { const b = D().querySelector('#fqWrap [data-fq="start"]'); if (b) b.click(); });
S.speed(B(26), B(29), 2, 0.2);
for (let i = 0; i < 5; i++) S.tap(B(26.5 + i * 0.5), `#fqWrap [data-fq="opt"][data-i="${i % 2}"]`, FAST);
S.tap(B(30), '#fqRes [data-fr="share"]', { lead: 0.2 });
S.tap(B(31), byText('.sc-tab', '车票'), { lead: 0.2 });
S.title(B(26) + 0.05, B(32) - 0.1, { k: '留学人格测试', h: '分享<br>你的利物浦。', x: 130, y: 360, w: 640, fade: 0.4 });

/* ---------- 一键进群：无声的一小节里等专家，高潮那一拍群码到了 ---------- */
S.at(B(32) - 0.05, () => {
  const d = D(); const sx = [...d.querySelectorAll('.sc-wrap .x')].find(e => e.getBoundingClientRect().width); if (sx) sx.click();
  try { W().FunQuizzes.exit(); } catch (e) {}
  const h = W().eval('HOMES').find(x => x.id === 'capital-gate'); W().show(h, true); W().openContact(h, D().querySelector('#card .cta'));
});
S.tap(B(33), '.bh-join', { lead: 0.25 });
const DROP = 18.945;   // 高潮第一下的真实时间（按波形测的；节拍表在无声小节后对到了前面的镲片上）
S.at(DROP - 0.03, () => {   // 群码在 18.933 秒那一帧出现，比鼓点早 12 毫秒
  const w = W(), k = 'lsm-live-me-v1', me = JSON.parse(w.localStorage.getItem(k)); if (!me) return;
  const now = w.Date.now();
  me.group = { team: 'A', channel: 'wechat', name: me.code + ' · ' + (me.request.homeName || ''), link: 'https://weixin.qq.com/g/LSMDEMO7K2X9', at: now, expiresAt: now + 7 * 864e5 };
  me.status = 'qr_sent'; me.messages.push({ from: 'agent', type: 'qr', at: now }); me.studentUnread = 1; me.updated = now;
  w.localStorage.setItem(k, JSON.stringify(me)); w.dispatchEvent(new w.StorageEvent('storage', { key: k }));
});
S.title(B(32) + 0.05, Db(10) + 0.4, { k: '一键进群', h: '一键，<br>连上预定专家。', x: 1190, y: 360, w: 640, fade: 0.4 });

/* ---------- 片尾：设备一拍一个进来，标题落在接上的鼓点小节上，最后一下鼓点后淡出 ---------- */
S.title(Db(11), END - 0.5, { h: '利物浦学生住宿地图', s: '手机 · 平板 · 折叠屏　　中文 · English · 日本語', cls: 'c end', x: 360, y: 58, w: 1200, fade: 0.6 });
