/* 利物浦学生住宿地图 · 宣传片 30 秒版 · 新配乐（29.6 秒，16:9，中文）
   配乐：AudioEra「Stylish Trailer Percussion」，120 拍/分（一拍 0.5 秒，一小节 2 秒）。原曲四段在小节第一拍拼接（music/prepare30b.sh）：
   前奏 2 小节 → 律动 4 小节 + 过门 1 小节 + 强段 3 小节 → 断拍小节（无声）+ 重拍后 2 小节 → 最后一小节和余音。
   下面的 D 是成品配乐里每小节第一拍鼓点的实测时间（秒），B(n) = 第 n 拍（可以是 .5 半拍）。
   音效：点按 tick，分享卡片 pop，镜头转换 whoosh，群码出现 ding，片名 hit（music/mix.py 合成并混音）。 */
'use strict';
const SX = 765, SY = 118;                      // 手机屏幕在舞台上的位置
const scr = (x, y) => ({ x: SX + x, y: SY + y }); // 屏幕坐标 → 舞台坐标
const W = () => S.win(), D_ = () => S.doc();
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
  z = Math.min(zmax(), 2.6 / fitK); tx = 217 - fx * fitK * z; ty = 420 - fy * fitK * z; render(false); })()`));   // 渡轮往左上开：起点放在右下，推近时正好经过画面中间

const D = [0.314, 2.297, 4.337, 6.348, 8.347, 10.348, 12.341, 14.348, 16.341, 18.342, 20.330, 22.281, 24.330, 26.286, 28.239];
const B = n => { const i = Math.min(Math.floor(n / 4), D.length - 2), f = n / 4 - i; return D[i] + (D[i + 1] - D[i]) * f; };
const END = 29.626;
const FAST = { lead: 0.15, sfx: 'tick-s' };   // 半拍连点：点按圈提前 0.15 秒出现，用轻一点的点按声
S.tapSfx = 'tick';

/* ---------- 镜头运动 ---------- */
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  .hold(B(6)).to(D[3] - 0.15, { x: 775, y: 560, s: 1.45 }, 'apple')                                       // 会呼吸的地图：推近河面（标题在左）
  .to(D[3] + 0.45, { x: 1110, y: 540, s: 1.12 }, 'apple').hold(B(14)).to(B(16.5), { x: 1125, y: 610, s: 1.32 }, 'apple').hold(B(17.6))   // 公寓详情（标题在右）
  .to(B(18.5), { x: 820, y: 540, s: 1.12 }, 'apple').hold(B(23.3)).to(B(24.6), { x: 832, y: 660, s: 1.38 }, 'apple').hold(B(25.6))        // 生活选房（标题在左）
  .to(B(26.4), { x: 1110, y: 530, s: 1.16 }, 'apple').hold(B(29.6))                                         // 我的专业（标题在右）
  .to(B(30.4), { x: 820, y: 540, s: 1.12 }, 'apple').hold(B(33.3)).to(B(34.2), { x: 830, y: 520, s: 1.22 }, 'apple').hold(D[9] - 0.3)    // 人格测试 + 分享卡片（标题在左）
  .to(D[9] + 0.35, { x: 1110, y: 540, s: 1.12 }, 'apple').hold(D[10] + 0.1).to(D[11], { x: 1118, y: 500, s: 1.42 }, 'io').hold(D[12])  // 一键进群：断拍那一小节慢慢推近（标题在右）
  .to(D[12] + 1.3, { x: 960, y: 540, s: 1 }, 'apple').fn();                                                 // 片尾：拉远看全部设备

S.tracks.phone = K(0, { x: 0, y: 1150, s: 0.94, rx: 14 })
  .hold(D[1] - 0.45).to(B(6.2), { y: 0, s: 1, rx: 0 }, 'apple')                                            // 第 2 小节升起
  .hold(D[12]).to(D[12] + 1.3, { x: 0, y: 30, s: 0.86 }, 'apple').fn();
S.tracks.fold = K(0, { x: -560, y: 90, s: 0.66, o: 0 }).hold(B(49) - 0.1).to(B(49) + 1.1, { x: -560, y: 60, s: 0.74, o: 1 }, 'apple').fn();
S.tracks.tablet = K(0, { x: 560, y: 110, s: 0.52, o: 0 }).hold(B(50) - 0.1).to(B(50) + 1.1, { x: 540, y: 70, s: 0.6, o: 1 }, 'apple').fn();
S.tracks.veil = K(0, { o: 0 }).hold(28.35).to(END, { o: 1 }, 'in').fn();

/* ---------- 开场（前奏第 1 小节） ---------- */
S.title(D[0], D[1] - 0.25, { h: '在利物浦，<br>找到你的家。', cls: 'c big', x: 360, y: 395, w: 1200, fade: 0.35 });

/* ---------- 会呼吸的地图：手机在第 2 小节升起，推近河面；网页时间 6 倍速 ---------- */
S.sfx(D[1] - 0.2, 'whoosh-up', 0.8);
S.speed(0, D[3] - 0.5, 6, 0.3);
S.title(B(5) + 0.2, D[3] - 0.15, { k: '手绘地图', h: '一张<br>会呼吸的地图。', x: 130, y: 360, w: 600, fade: 0.4 });
S.mapGlide(D[3] - 0.5, 0.75, studentsView);
S.sfx(D[3] - 0.35, 'whoosh', 0.7);

/* ---------- 公寓详情 ---------- */
S.tap(B(13), marker('Great Newton'), { fn: svgClick, lead: 0.16 });
S.tap(B(14), '#card .detail-toggle', { lead: 0.22 });
S.during(B(14) + 0.2, D[4] - 0.08, u => { const sc = [...D_().querySelectorAll('#card *')].find(e => e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY !== 'visible') || D_().getElementById('card'); sc.scrollTop = E.apple(u) * 300; });
S.tap(D[4], byText('#card button', '金级独卫单间'), { lead: 0.2 });
S.title(D[3] + 0.1, B(18) - 0.1, { k: '公寓详情', h: '每一处，<br>都看得清楚。', x: 1190, y: 360, w: 640, fade: 0.4 });

/* ---------- 生活选房：直接进第 1 题，每半拍答一题，网页翻页快 2.2 倍 ---------- */
S.at(B(18) - 0.18, () => {
  const d = D_(); const x = [...d.querySelectorAll('.rp-x, .album .x, [class*=album] .x, [class*=lightbox] .x')].find(e => e.getBoundingClientRect().width > 0);
  if (x) x.click(); d.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
});
S.at(B(18) - 0.06, () => { try { W().hide && W().hide(); } catch (e) {} const x = D_().getElementById('cardX'); if (x && x.getBoundingClientRect().width) x.click(); });
S.sfx(B(17.7), 'whoosh', 0.55);
S.at(B(18), () => W().HomeMatch.open(0));
S.speed(B(18), B(24), 2.2, 0.2);
['uol', 'cook', 'weekly', 'any', 'library', 'shops', 'park', 'some', 'close'].forEach((v, i) => S.tap(B(19 + i * 0.5), `#hmWrap [data-hm="opt"][data-v="${v}"]`, FAST));
S.sfx(B(23.4), 'pop', 0.8);   // 选房卡出现
S.title(B(18) + 0.05, B(26) - 0.1, { k: '生活选房', h: '8 个问题，<br>读懂你的日常。', x: 130, y: 360, w: 640, fade: 0.4 });

/* ---------- 我的专业：过门小节的后半，教学楼在强段第一拍亮起 ---------- */
S.at(B(26) - 0.1, () => { try { W().HomeMatch.exit(); } catch (e) {} });
S.sfx(B(25.7), 'whoosh', 0.5);
S.tap(B(26), '#subjectToggle', { lead: 0.2 });
S.tap(B(27), '#subjectPanel .fs-btn', { lead: 0.2 });
S.tap(D[7], byText('#subjectPanel .fs-opt', '医学'), { lead: 0.2 });
S.title(B(26) + 0.05, B(30) - 0.1, { k: '我的专业', h: '离课堂，<br>更近一步。', x: 1190, y: 360, w: 640, fade: 0.4 });

/* ---------- 人格测试 + 分享卡片：每半拍答一题、快 2.2 倍；分享卡片每拍换一种 ---------- */
S.at(B(30) - 0.25, () => { try { W().setSubject(''); } catch (e) {} try { W().SubjectDock.close(); } catch (e) {} });
S.at(B(30) - 0.15, () => { W().FunQuizzes.open('buddy'); });
S.sfx(B(29.7), 'whoosh', 0.5);
S.at(B(30), () => { const b = D_().querySelector('#fqWrap [data-fq="start"]'); if (b) b.click(); });
S.speed(B(30), B(33), 2.2, 0.2);
for (let i = 0; i < 5; i++) S.tap(B(30.5 + i * 0.5), `#fqWrap [data-fq="opt"][data-i="${i % 2}"]`, FAST);
S.tap(B(33.5), '#fqRes [data-fr="share"]', { lead: 0.18, sfx: 'pop' });
S.tap(B(34), byText('.sc-tab', '拍立得'), { lead: 0.18, sfx: 'pop', gain: 0.8 });
S.tap(B(35), byText('.sc-tab', '车票'), { lead: 0.18, sfx: 'pop', gain: 0.8 });
S.title(B(30) + 0.05, D[9] - 0.1, { k: '留学人格测试', h: '分享<br>你的利物浦。', x: 130, y: 360, w: 640, fade: 0.4 });

/* ---------- 一键进群：断拍那一小节（音乐停下来）点「立即进群」，重拍那一下群码到了 + 叮 ---------- */
S.sfx(D[9] - 0.32, 'whoosh', 0.7);
S.at(D[9] - 0.05, () => {
  const d = D_(); const sx = [...d.querySelectorAll('.sc-wrap .x')].find(e => e.getBoundingClientRect().width); if (sx) sx.click();
  try { W().FunQuizzes.exit(); } catch (e) {}
  W().show(W().eval('HOMES').find(x => x.id === 'capital-gate'), true);
});
S.tap(B(37), '#card .cta', { lead: 0.22 });
S.tap(D[10], '.bh-join', { lead: 0.25 });
S.at(D[11] - 0.03, () => {   // 群码在重拍前一帧内出现
  const w = W(), k = 'lsm-live-me-v1', me = JSON.parse(w.localStorage.getItem(k)); if (!me) return;
  const now = w.Date.now();
  me.group = { team: 'A', channel: 'wechat', name: me.code + ' · ' + (me.request.homeName || ''), link: 'https://weixin.qq.com/g/LSMDEMO7K2X9', at: now, expiresAt: now + 7 * 864e5 };
  me.status = 'qr_sent'; me.messages.push({ from: 'agent', type: 'qr', at: now }); me.studentUnread = 1; me.updated = now;
  w.localStorage.setItem(k, JSON.stringify(me)); w.dispatchEvent(new w.StorageEvent('storage', { key: k }));
});
S.sfx(D[11], 'ding', 1);
S.title(D[9] + 0.05, D[12] + 0.3, { k: '一键进群', h: '一键，<br>连上预定专家。', x: 1190, y: 360, w: 640, fade: 0.4 });

/* ---------- 片尾：拉远，设备一拍一个进来；片名落在最后一小节的重拍上 ---------- */
S.sfx(D[12] - 0.05, 'whoosh', 0.8);
S.sfx(B(49), 'pop', 0.45); S.sfx(B(50), 'pop', 0.45);
S.sfx(D[13], 'hit', 1);
S.title(D[13], END - 0.5, { h: '利物浦学生住宿地图', s: '手机 · 平板 · 折叠屏　　中文 · English', cls: 'c end', x: 360, y: 58, w: 1200, fade: 0.5 });
