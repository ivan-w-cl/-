/* 利物浦学生住宿地图 · 宣传片 30 秒亮点版（29.6 秒，16:9，中文）—— 给上级汇报用
   配乐和 timeline-30b.js 同一首（AudioEra「Stylish Trailer Percussion」，30 秒拼接版 music/prepare30b.sh），小节时间 D 也相同：
   前奏 2 小节 → 律动 4 小节 + 过门 1 小节 + 强段 3 小节 → 断拍小节（音乐停下来）+ 重拍后 2 小节 → 最后一小节和余音。
   九个亮点：高级动画、动态天气与清晰地图、按专业 / 按生活选房、公寓列表筛选、多房对比、报价拆解（正着拆 + 按总预算反着算）、
   二维码进群专家跟进、顺利入住、手机 → 折叠屏 → 平板一台设备变形（engine.js 的 S.morph）。 */
'use strict';
const W = (f) => S.win(f), D_ = (f) => S.doc(f);
const byText = (sel, txt) => w => [...w.document.querySelectorAll(sel)].find(e => e.textContent.includes(txt) && e.getBoundingClientRect().width > 0);
const nth = (sel, i) => w => w.document.querySelectorAll(sel)[i];
const setValue = v => el => { el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); };
/* 逐字输入：t0–t1 之间把 text 一个字一个字地打进输入框 */
const typeInto = (t0, t1, sel, text) => S.during(t0, t1, u => {
  const el = D_().querySelector(sel); if (!el) return;
  const v = text.slice(0, Math.round(u * text.length));
  if (el.value !== v) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }
});
const HOME = 'capital-gate';
const homeById = (w, id) => w.eval('HOMES').find(x => x.id === id);
const studentsView = w => w.eval(`(() => { const xs = HOMES.map(h => h.p[0]), ys = HOMES.map(h => h.p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), ww = mapbox.clientWidth, hh = mapbox.clientHeight - 130;
  const zz = Math.max(1, Math.min(zmax(), Math.min(ww / ((x1 - x0 + 80) * fitK), hh / ((y1 - y0 + 80) * fitK))));
  return { z: zz, tx: ww / 2 - (x0 + x1) / 2 * fitK * zz, ty: 60 + hh / 2 - (y0 + y1) / 2 * fitK * zz }; })()`);
const jumpTo = (w, v) => w.eval(`z = ${v.z}; tx = ${v.tx}; ty = ${v.ty}; render(false);`);

/* ---------- 网页准备：关掉开场弹窗；手机对准默西河上的渡轮；折叠屏、平板显示全部公寓（片尾变形时露出来） ---------- */
S.at(0, () => {
  for (const id of ['app', 'appT', 'appF']) { try { W(id).HomeMatch.exit(); } catch (e) { /* 没有 */ } }
  for (const id of ['appT', 'appF']) { try { jumpTo(W(id), studentsView(W(id))); } catch (e) { /* 没有 */ } }
  try { W('appT').show(homeById(W('appT'), HOME), true); } catch (e) { /* 没有 */ }
});
S.at(0.02, () => W().eval(`(() => { const m = /translate\\(([-\\d.]+)[ ,]+([-\\d.]+)\\)/.exec(ferry.getAttribute('transform') || '');
  const fx = m ? +m[1] : (FA[0] + FB[0]) / 2, fy = m ? +m[2] : (FA[1] + FB[1]) / 2;
  z = Math.min(zmax(), 2.6 / fitK); tx = 217 - fx * fitK * z; ty = 420 - fy * fitK * z; render(false); })()`));

const D = [0.314, 2.297, 4.337, 6.348, 8.347, 10.348, 12.341, 14.348, 16.341, 18.342, 20.330, 22.281, 24.330, 26.286, 28.239];
const B = n => { const i = Math.min(Math.floor(n / 4), D.length - 2), f = n / 4 - i; return D[i] + (D[i + 1] - D[i]) * f; };
const END = 29.626;
const FAST = { lead: 0.15, sfx: 'tick-s' };
S.tapSfx = 'tick';
const L = { x: 130, y: 360, w: 600, fade: 0.35 }, R = { x: 1190, y: 360, w: 640, fade: 0.35 };   // 标题在左 / 在右

/* ---------- 镜头：标题在左 → 镜头中心偏左（x < 960，手机往右让开）；标题在右 → x > 960 ---------- */
S.tracks.cam = K(0, { x: 960, y: 540, s: 1 })
  .hold(B(5)).to(D[2] - 0.1, { x: 775, y: 560, s: 1.45 }, 'apple')                                           // 动态天气：推近河面（标题在左）
  .to(D[2] + 0.45, { x: 1110, y: 540, s: 1.1 }, 'apple').hold(D[3] - 0.35)                                   // 47 处公寓（标题在右）
  .to(D[3] + 0.2, { x: 820, y: 540, s: 1.12 }, 'apple').hold(B(14.2)).to(B(15.6), { x: 832, y: 470, s: 1.28 }, 'apple').hold(D[4] - 0.3)   // 按专业（标题在左）
  .to(D[4] + 0.25, { x: 1110, y: 540, s: 1.12 }, 'apple').hold(B(20.6)).to(B(21.6), { x: 1118, y: 650, s: 1.34 }, 'apple').hold(B(22) - 0.1) // 按生活（标题在右）
  .to(B(22) + 0.4, { x: 820, y: 560, s: 1.12 }, 'apple').hold(B(23)).to(B(24), { x: 832, y: 650, s: 1.28 }, 'apple').hold(D[7] - 0.3)      // 公寓列表筛选（标题在左）
  .to(D[7] + 0.25, { x: 1110, y: 600, s: 1.16 }, 'apple').hold(B(29.6)).to(B(30.5), { x: 1110, y: 520, s: 1.16 }, 'apple').hold(D[8] - 0.3) // 多房对比（标题在右）
  .to(D[8] + 0.25, { x: 820, y: 540, s: 1.12 }, 'apple').hold(B(34)).to(B(34.8), { x: 832, y: 620, s: 1.3 }, 'apple').hold(D[9] - 0.25)    // 报价拆解（标题在左）
  .to(D[9] + 0.2, { x: 820, y: 540, s: 1.12 }, 'apple').hold(B(37)).to(B(37.8), { x: 832, y: 640, s: 1.3 }, 'apple').hold(D[10] - 0.3)     // 按预算看房
  .to(D[10] + 0.25, { x: 1110, y: 540, s: 1.12 }, 'apple').hold(D[10] + 0.6).to(D[11], { x: 1118, y: 500, s: 1.4 }, 'io')                  // 进群：断拍那一小节慢慢推近（标题在右）
  .hold(B(45.6)).to(B(46.6), { x: 1118, y: 700, s: 1.4 }, 'apple').hold(D[12] - 0.3)                                                        // 顺利入住：往下看到专家的消息
  .to(B(48.5), { x: 960, y: 540, s: 1 }, 'apple').fn();                                                                                      // 片尾：拉远，设备变形

S.tracks.phone = K(0, { x: 0, y: 1150, s: 0.94, rx: 14 })
  .hold(D[1] - 0.45).to(B(6.2), { y: 0, s: 1, rx: 0 }, 'apple')
  .hold(D[12] - 0.3).to(B(48.5), { x: 0, y: 60, s: 0.88 }, 'apple').fn();
/* 手机 → 折叠屏 → 平板：一台设备变形，最后停在平板上 */
S.morph = {
  t0: B(48.5), t1: B(50.1), t2: B(50.45), t3: D[13] - 0.02,
  G: {
    phone: { sw: 390, sh: 844, pad: 14, r: 53, R: 66, cx: 960, cy: 600, sc: 0.88 },
    fold: { sw: 746, sh: 676, pad: 13, r: 32, R: 44, cx: 960, cy: 612, sc: 0.98 },
    tablet: { sw: 1174, sh: 834, pad: 20, r: 28, R: 46, cx: 960, cy: 626, sc: 0.8 }
  }
};
S.tracks.veil = K(0, { o: 0 }).hold(28.35).to(END, { o: 1 }, 'in').fn();

/* ---------- 开场 ---------- */
S.title(D[0], D[1] - 0.25, { h: '在利物浦，<br>找到你的家。', cls: 'c big', x: 360, y: 395, w: 1200, fade: 0.35 });

/* ---------- ① ② 动态天气 + 灵动动画：手机升起，推近河面（渡轮、海鸥、雨），网页时间 6 倍速 ---------- */
S.sfx(D[1] - 0.2, 'whoosh-up', 0.8);
S.speed(0, D[2] - 0.4, 6, 0.3);
S.title(B(5) + 0.1, D[2] - 0.12, Object.assign({ k: '动态天气 · 灵动动画', h: '一张<br>会呼吸的地图。' }, L));

/* ---------- ② 清晰布局：拉远看全部 47 处公寓，每一处都有编号 ---------- */
S.mapGlide(D[2] - 0.45, 0.8, studentsView);
S.sfx(D[2] - 0.3, 'whoosh', 0.7);
S.title(D[2] + 0.05, D[3] - 0.12, Object.assign({ k: '清晰布局', h: '47 处公寓，<br>一眼看清。' }, R));

/* ---------- ③ 按专业选房：打开「我的专业」，选「医学」，教学楼亮起 ---------- */
S.sfx(D[3] - 0.3, 'whoosh', 0.5);
S.tap(D[3] + 0.05, '#subjectToggle', { lead: 0.2 });
S.tap(B(13), '#subjectPanel .fs-btn', { lead: 0.2 });
S.tap(B(14), byText('#subjectPanel .fs-opt', '医学'), { lead: 0.2 });
S.title(D[3] + 0.05, D[4] - 0.1, Object.assign({ k: '按需选房 · 按专业', h: '离课堂，<br>更近一步。' }, L));

/* ---------- ③ 按生活选房：每半拍答一题（网页快 2.4 倍），选房卡弹出 ---------- */
S.at(D[4] - 0.25, () => { try { W().setSubject(''); } catch (e) {} try { W().SubjectDock.close(); } catch (e) {} });
S.sfx(D[4] - 0.3, 'whoosh', 0.5);
S.at(D[4] - 0.05, () => W().HomeMatch.open(0));
S.speed(D[4], B(21.6), 2.4, 0.2);
['uol', 'cook', 'weekly', 'any', 'library', 'shops', 'park', 'some', 'close'].forEach((v, i) => S.tap(B(16.5 + i * 0.5), `#hmWrap [data-hm="opt"][data-v="${v}"]`, FAST));
S.sfx(B(21), 'pop', 0.8);
S.title(D[4] + 0.05, B(22) - 0.1, Object.assign({ k: '按需选房 · 按生活', h: '8 个问题，<br>读懂你的日常。' }, R));

/* ---------- ④ 公寓列表筛选：预算 £150、独卫单间 → 查看 17 处公寓 ---------- */
S.at(B(22) - 0.2, () => { try { W().HomeMatch.exit(); } catch (e) {} const x = D_().querySelector('#hmRes .x, #hmRes [data-hm="close"]'); if (x && x.getBoundingClientRect().width) x.click(); });
S.sfx(B(21.8), 'whoosh', 0.5);
S.tap(B(22.5), '[data-open="controls"]', { lead: 0.22 });
S.tap(B(23.5), '#homeBudget', { lead: 0.22, fn: setValue('150') });
S.tap(B(24.5), '#homeRoom', { lead: 0.22, fn: setValue('ensuite') });
S.tap(B(25.5), '#viewResults', { lead: 0.22 });
S.title(B(22) + 0.05, D[7] - 0.1, Object.assign({ k: '公寓列表', h: '按预算、房型，<br>一键筛选。' }, L));

/* ---------- ⑤ 多房对比：强段第一拍起每半拍加一处，收起列表，并排对比 ---------- */
S.tap(D[7], nth('#homesPanel .cbtn', 0), FAST);
S.tap(B(28.5), nth('#homesPanel .cbtn', 1), FAST);
S.tap(B(29), nth('#homesPanel .cbtn', 2), FAST);
S.at(B(29.55), () => { const c = D_().querySelector('#homesPanel .closeSheet'); if (c) c.click(); });
S.tap(B(30.2), '#trayGo', { lead: 0.22, sfx: 'pop' });
S.title(D[7] + 0.05, D[8] - 0.1, Object.assign({ k: '多房对比', h: '三处公寓，<br>一屏看懂。' }, R));

/* ---------- ⑥ 报价拆解：点价签，输入平台报的每周租金 → 平台自己补了多少；再按总预算反着算 ---------- */
S.at(D[8] - 0.12, () => {
  const x = D_().getElementById('cmpX'); if (x && x.getBoundingClientRect().width) x.click();
  W().show(homeById(W(), HOME), true);
});
S.sfx(D[8] - 0.3, 'whoosh', 0.6);
S.tap(B(32.6), '#card .bt-mini .qt-tag', { lead: 0.22 });
typeInto(B(33.3), B(34), '#qcWk', '111');
S.at(B(33.3), () => S.sfxLog.push({ t: B(33.3), name: 'tick-s', gain: 0.6 }));
S.at(B(33.65), () => S.sfxLog.push({ t: B(33.65), name: 'tick-s', gain: 0.6 }));
S.sfx(B(34), 'pop', 0.85);
S.tap(D[9] - 0.05, '.br-tab[data-id="budget"]', { lead: 0.22 });
typeInto(B(36.6), B(37.3), '#qcBudget', '7000');
S.at(B(36.6), () => S.sfxLog.push({ t: B(36.6), name: 'tick-s', gain: 0.6 }));
S.at(B(36.95), () => S.sfxLog.push({ t: B(36.95), name: 'tick-s', gain: 0.6 }));
S.sfx(B(37.3), 'pop', 0.85);
S.title(D[8] + 0.05, D[10] - 0.1, Object.assign({ k: '优惠拆解', h: '正着拆，反着算，<br>心里有数。', s: '平台补贴 · 官方返现 · 总预算区间' }, L));

/* ---------- ⑦ 一键进群：断拍那一小节点「立即进群」，重拍那一下群码到了 + 叮 ---------- */
S.sfx(D[10] - 0.3, 'whoosh', 0.7);
S.at(D[10] - 0.12, () => { try { W().BookingTools.close(); } catch (e) {} });
S.tap(D[10] + 0.3, '#card .cta', { lead: 0.22 });
S.tap(B(41.7), '.bh-join', { lead: 0.25 });
const agentPush = (t, msg) => S.at(t, () => {
  const w = W(), k = 'lsm-live-me-v1', me = JSON.parse(w.localStorage.getItem(k)); if (!me) return;
  const now = w.Date.now();
  if (msg) me.messages.push({ from: 'agent', text: msg, at: now });
  else {
    me.group = { team: 'A', channel: 'wechat', name: me.code + ' · ' + (me.request.homeName || ''), link: 'https://weixin.qq.com/g/LSMDEMO7K2X9', at: now, expiresAt: now + 7 * 864e5 };
    me.status = 'qr_sent'; me.messages.push({ from: 'agent', type: 'qr', at: now });
  }
  me.studentUnread = 1; me.updated = now;
  w.localStorage.setItem(k, JSON.stringify(me)); w.dispatchEvent(new w.StorageEvent('storage', { key: k }));
});
agentPush(D[11] - 0.03);
S.sfx(D[11], 'ding', 1);
S.title(D[10] + 0.05, B(46) - 0.1, Object.assign({ k: '订房专家', h: '一键进群，<br>专家时刻跟进。' }, R));

/* ---------- ⑧ 顺利入住：专家发来入住消息 ---------- */
agentPush(B(46) - 0.03, '🎉 入住办好啦！钥匙已领，欢迎来到利物浦。');
S.sfx(B(46), 'pop', 0.9);
S.title(B(46) + 0.05, D[12] + 0.1, Object.assign({ k: '顺利入住', h: '从选房到入住，<br>全程有人陪。' }, R));

/* ---------- ⑨ 一台设备，三种屏幕：手机变折叠屏，再变平板；片名落在最后一小节的重拍上 ---------- */
S.sfx(D[12] - 0.05, 'whoosh', 0.8);
S.sfx(S.morph.t0 + 0.1, 'whoosh-up', 0.55);
S.sfx(S.morph.t2 + 0.1, 'whoosh-up', 0.55);
S.title(S.morph.t0 + 0.05, D[13] - 0.12, { k: '全设备适配', h: '手机 · 折叠屏 · 平板', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.35 });
S.sfx(D[13], 'hit', 1);
S.title(D[13], END - 0.5, { h: '利物浦学生住宿地图', s: '选房 · 比价 · 进群 · 入住　　手机 · 折叠屏 · 平板', cls: 'c end', x: 360, y: 52, w: 1200, fade: 0.45 });
