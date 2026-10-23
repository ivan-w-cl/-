/* 利物浦学生住宿地图 · 宣传片（约 60 秒，16:9，中文）
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
S.at(2.0, () => W().eval(`(() => { const m = /translate\\(([-\\d.]+)[ ,]+([-\\d.]+)\\)/.exec(ferry.getAttribute('transform') || '');
  const fx = m ? +m[1] : (FA[0] + FB[0]) / 2, fy = m ? +m[2] : (FA[1] + FB[1]) / 2;
  z = Math.min(zmax(), 2.6 / fitK); tx = 232 - fx * fitK * z; ty = 450 - fy * fitK * z; render(false); })()`));   // 渡轮往左上开：起点放在右下，推近时正好经过画面中间

/* ---------- 镜头运动 ---------- */
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  // 标题在左 → 镜头中心偏左（x < 960），手机往右让开；标题在右 → x > 960
  // 1 会呼吸的地图：推近河面，标题在左
  .hold(5.6).to(9.4, { x: 775, y: 560, s: 1.45 }, 'apple').hold(10.6)
  // 2 公寓详情：标题在右
  .to(12.2, { x: 1110, y: 540, s: 1.12 }, 'apple').hold(15.2).to(17.4, { x: 1125, y: 610, s: 1.32 }, 'apple').hold(19.4)
  // 3 生活选房：标题在左
  .to(20.4, { x: 820, y: 540, s: 1.12 }, 'apple').hold(28.1).to(29.5, { x: 832, y: 660, s: 1.38 }, 'apple').hold(30.6)
  // 4 我的专业：标题在右
  .to(31.8, { x: 1110, y: 530, s: 1.16 }, 'apple').hold(37.4)
  // 5 人格测试 + 分享卡片：标题在左
  .to(38.6, { x: 820, y: 540, s: 1.12 }, 'apple').hold(42.6).to(44.2, { x: 830, y: 520, s: 1.22 }, 'apple').hold(46.6)
  // 6 一键进群：标题在右，最后推近群码
  .to(47.8, { x: 1110, y: 540, s: 1.12 }, 'apple').hold(50.6).to(52.6, { x: 1118, y: 500, s: 1.42 }, 'apple').hold(53.6)
  // 7 片尾：拉远看全部设备
  .to(55.4, { x: 960, y: 540, s: 1 }, 'apple').fn();

S.tracks.phone = K(0, { x: 0, y: 1150, s: 0.94, rx: 14 })
  .hold(2.6).to(5.3, { y: 0, s: 1, rx: 0 }, 'apple')
  .hold(53.8).to(55.6, { x: 0, y: 30, s: 0.86 }, 'apple').fn();
S.tracks.tablet = K(0, { x: 560, y: 110, s: 0.52, o: 0 }).hold(54.2).to(56, { x: 540, y: 70, s: 0.6, o: 1 }, 'apple').fn();
S.tracks.fold = K(0, { x: -560, y: 90, s: 0.66, o: 0 }).hold(54.4).to(56.2, { x: -560, y: 60, s: 0.74, o: 1 }, 'apple').fn();
S.tracks.veil = K(0, { o: 0 }).hold(58.6).to(60, { o: 1 }, 'in').fn();

/* ---------- 0 开场 ---------- */
S.title(0.25, 2.9, { h: '在利物浦，<br>找到你的家。', cls: 'c big', x: 360, y: 395, w: 1200, fade: 0.9 });

/* ---------- 1 会呼吸的地图（5.2–10.6） ---------- */
S.speed(2.2, 10.4, 6);   // 渡轮和海鸥按真实速度几乎不动：这一段网页时间 6 倍速（雨是 CSS 动画，照常）
S.title(5.6, 10.4, { k: '手绘地图', h: '一张<br>会呼吸的地图。', s: '渡轮、海鸥、街上的车，<br>还有此刻利物浦的雨。', x: 130, y: 330, w: 600 });
S.mapGlide(10.4, 1.8, studentsView);                                  // 拉回镜头时地图回到公寓区

/* ---------- 2 公寓详情（11–19.4） ---------- */
S.tap(12.8, marker('Great Newton'), { fn: svgClick });
S.tap(14.4, '#card .detail-toggle');
S.during(15.0, 16.6, u => { const b = D().querySelector('#card .card-body, #card .cbody, #card'); const sc = [...D().querySelectorAll('#card *')].find(e => e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY !== 'visible') || D().getElementById('card'); sc.scrollTop = E.apple(u) * 300; });
S.tap(17.2, byText('#card button', '金级独卫单间'));
S.title(11.6, 19.2, { k: '公寓详情', h: '每一处，<br>都看得清楚。', s: '价格、步行时间，<br>还有真实的房型照片。', x: 1190, y: 330, w: 640 });

/* ---------- 3 生活选房（19.6–30.6） ---------- */
S.at(19.4, () => {   // 关掉相册和卡片
  const d = D(); const x = [...d.querySelectorAll('.rp-x, .album .x, [class*=album] .x, [class*=lightbox] .x')].find(e => e.getBoundingClientRect().width > 0);
  if (x) x.click(); d.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
});
S.at(19.7, () => { try { W().hide && W().hide(); } catch (e) {} const x = D().getElementById('cardX'); if (x && x.getBoundingClientRect().width) x.click(); });
S.tap(20.3, '.hmgo2');
S.tap(21.2, '#hmWrap [data-hm="start"]');
const HM = [['uol'], ['cook'], ['weekly'], ['any'], ['library'], ['shops', 'park'], ['some'], ['close']];
let ht = 21.95;
HM.forEach(vals => { vals.forEach((v, i) => { S.tap(ht, `#hmWrap [data-hm="opt"][data-v="${v}"]`); ht += i < vals.length - 1 ? 0.42 : (vals.length > 1 ? 1.0 : 0.78); }); });   // 多选题选满后要等 0.45 秒自动翻页
S.title(20.0, 30.4, { k: '生活选房', h: '8 个问题，<br>读懂你的日常。', s: '按你的生活习惯，<br>推荐最合适的 3 处公寓。', x: 130, y: 330, w: 640 });

/* ---------- 4 我的专业（30.8–37.6） ---------- */
S.at(30.9, () => { try { W().HomeMatch.exit(); } catch (e) {} });
S.tap(32.2, '#subjectToggle');
S.tap(33.3, '#subjectPanel .fs-btn');
S.tap(34.4, byText('#subjectPanel .fs-opt', '医学'));
S.title(31.4, 37.6, { k: '我的专业', h: '离课堂，<br>更近一步。', s: '教学楼亮起，<br>公寓按步行时间重新排序。', x: 1190, y: 330, w: 640 });

/* ---------- 5 人格测试 + 分享卡片（37.8–46.6） ---------- */
S.at(37.9, () => { try { W().setSubject(''); } catch (e) {} try { W().SubjectDock.close(); } catch (e) {} });
S.at(38.3, () => { W().FunQuizzes.open('buddy'); });
S.tap(39.2, '#fqWrap [data-fq="start"]');
for (let i = 0; i < 5; i++) S.tap(39.9 + i * 0.7, `#fqWrap [data-fq="opt"][data-i="${i % 2}"]`);
S.tap(43.7, '#fqRes [data-fr="share"]');
['polaroid', 'ticket', 'notes'].forEach((k, i) => S.tap(44.9 + i * 0.75, byText('.sc-tab', ['拍立得', '车票', '便利贴'][i])));
S.title(38.4, 46.4, { k: '留学人格测试', h: '分享<br>你的利物浦。', s: '测出你的类型，<br>生成 4 种分享卡片。', x: 130, y: 330, w: 640 });

/* ---------- 6 一键进群（46.8–53.8） ---------- */
S.at(46.75, () => {
  const d = D(); const sx = [...d.querySelectorAll('.sc-wrap .x')].find(e => e.getBoundingClientRect().width); if (sx) sx.click();
  try { W().FunQuizzes.exit(); } catch (e) {}
  W().show(W().eval('HOMES').find(h => h.id === 'capital-gate'), true);
});
S.tap(48.3, '#card .cta');
S.tap(49.5, '.bh-join');
/* 专家在后台发来群码（演示模式下学生和后台共用本机存储，这里按后台的写法写进去） */
S.at(50.9, () => {
  const w = W(), k = 'lsm-live-me-v1', me = JSON.parse(w.localStorage.getItem(k)); if (!me) return;
  const now = w.Date.now();
  me.group = { team: 'A', channel: 'wechat', name: me.code + ' · ' + (me.request.homeName || ''), link: 'https://weixin.qq.com/g/LSMDEMO7K2X9', at: now, expiresAt: now + 7 * 864e5 };
  me.status = 'qr_sent'; me.messages.push({ from: 'agent', type: 'qr', at: now }); me.studentUnread = 1; me.updated = now;
  w.localStorage.setItem(k, JSON.stringify(me)); w.dispatchEvent(new w.StorageEvent('storage', { key: k }));
});
S.title(47.2, 53.8, { k: '一键进群', h: '一键，<br>连上预定专家。', s: '不用注册，不留资料。<br>一个咨询编号就够了。', x: 1190, y: 330, w: 640 });

/* ---------- 7 片尾（54–60） ---------- */
S.title(55.6, 59.4, { h: '利物浦学生住宿地图', s: '手机 · 平板 · 折叠屏　　中文 · English · 日本語', cls: 'c end', x: 360, y: 58, w: 1200, fade: 0.9 });
