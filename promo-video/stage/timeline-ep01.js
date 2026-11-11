/* 公寓 PK · 第 1 期「同样 10 分钟到利大、都带独卫，最便宜的两栋每周差 £37，差在哪？」（竖屏铺满版，约 70 秒，男声旁白 + 字幕）
   前半段是网页的真实操作：筛选（房型 独卫单间 · 步行到利物浦大学 10 分钟内）→ 47 栋剩 9 栋 → 按「独卫单间最便宜」排序 → 第 1 名 Europa、第 2 名 Prospect Point。
   后半段是数据画面（下面的 DATA，取自 data/homes.json 和网页里的 PRICES：价格与评分为 Amber 平台 2026-10-17 核对的起价）。
   片尾回到地图：选专业，看到自己教学楼的步行时间。
   镜头时间不写死：每一句旁白的起止时间在 ep01-cues.json（episodes/tts.py 生成），改了旁白重新生成就行。
   录制：PORTRAIT=1 FS=1 TL=timeline-ep01 PRE=300 node record.cjs frames/ep01 30 0 <片长> 2   片长见控制台打印的 EP_END */
'use strict';
const CUES = (() => { const x = new XMLHttpRequest(); x.open('GET', 'ep01-cues.json', false); x.send(); return JSON.parse(x.responseText); })();
const C = {}; CUES.cues.forEach(c => { C[c.id] = c; });
const at = (id, f) => C[id].t0 + (C[id].t1 - C[id].t0) * f;       // 一句旁白说到 f（0–1）的时间
const END = Math.ceil((CUES.voiceEnd + 3.4) * 30) / 30; S.END = END; console.log('EP_END', END);
const W = f => S.win(f);
const vis = e => e && e.getBoundingClientRect().width > 0;
const leafText = txt => w => [...w.document.querySelectorAll('button, a')].find(e => vis(e) && e.textContent.trim() === txt);
const setValue = v => el => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
const studentsView = w => w.eval(`(() => { const xs = HOMES.map(h => h.p[0]), ys = HOMES.map(h => h.p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), ww = mapbox.clientWidth, hh = mapbox.clientHeight - 130;
  const zz = Math.max(1, Math.min(zmax(), Math.min(ww / ((x1 - x0 + 80) * fitK), hh / ((y1 - y0 + 80) * fitK))));
  return { z: zz, tx: ww / 2 - (x0 + x1) / 2 * fitK * zz, ty: 60 + hh / 2 - (y0 + y1) / 2 * fitK * zz }; })()`);
const scrollParent = el => { for (let p = el && el.parentElement; p; p = p.parentElement) { const cs = getComputedStyle(p); if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 4) return p; } return null; };
const row = n => w => w.document.querySelector(`#homesPanel li.hrow[data-rank="${n}"]`);
S.tapSfx = 'tick';

/* ---------- 这一期的数据 ---------- */
const A = { name: 'Europa', price: 95, uol: 9, ljmu: 18, lime: 16, centre: 28, rating: 4.4, reviews: 19, has: ['休息室', '游戏区', '住户活动'] };
const B = { name: 'Prospect Point', price: 132, uol: 9, ljmu: 17, lime: 15, centre: 27, rating: 4.3, reviews: 19, has: ['公共厨房', '用餐区', '定期社交活动', '24 小时安保团队'] };
const WALK = [['利物浦大学', 'uol'], ['LJMU 城市校区', 'ljmu'], ['莱姆街火车站', 'lime'], ['市中心商圈', 'centre']];
const SOURCE = '价格与评分：Amber 平台起价，2026-10-17 核对 · 步行时间按距离估算';

/* ---------- 网页操作 ---------- */
S.at(0.36, () => { for (const id of ['app', 'appT', 'appF']) { try { W(id).HomeMatch.exit(); } catch (e) { /* 没有 */ }
  try { const d = S.doc(id), s = d.createElement('style'); s.textContent = '.hi-bar{display:none!important}'; d.head.appendChild(s); } catch (e) { /* 还没载入 */ } } });   // 浮动工具条会挡住列表，这一期用不到，先收起
S.mapGlide(1.0, 3.2, studentsView);                                               // 开场：47 栋公寓都在画面里
S.tap(at('open', 0.2), leafText('筛选'));
S.sfx(at('open', 0.2) + 0.1, 'pop', 0.6);
S.tap(at('open', 0.56), '#homeRoom', { fn: setValue('ensuite') });
S.tap(at('open', 0.9), '#homeWalk', { fn: setValue('10') });
S.note(at('count', 0.3), C.count.t1 + 0.2, '#viewResults', '47 → 9', { pos: 'top' });
S.tap(C.count.t1 + 0.25, '#viewResults');
S.tap(at('sort', 0.12), '#rank', { fn: setValue('ensuite') });
S.scroll(at('sort', 0.2), at('sort', 0.36), w => scrollParent(row(1)(w)), (box, w) => box.scrollTop + row(1)(w).getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight * 0.34);
S.note(at('sort', 0.38), at('sort', 0.7), row(1), '第 1 名 £95/周', { pos: 'top' });
S.note(at('sort', 0.7), C.sort.t1 + 0.3, row(2), '第 2 名 £132/周', { pos: 'top' });
S.sfx(at('sort', 0.38), 'pop', 0.6); S.sfx(at('sort', 0.7), 'pop', 0.6);
/* 数据画面盖着的时候：关掉列表，回到地图，为片尾做准备 */
S.at(C.dist.t0, () => { const b = [...W().document.querySelectorAll('#homesPanel .closeSheet')].find(vis); if (b) b.click(); });
S.tap(at('cta', 0.22), '.subject-tab');
S.tap(at('cta', 0.72), '#subject', { fn: setValue('medicine') });
S.sfx(at('cta', 0.72) + 0.1, 'whoosh', 0.5);
S.title(CUES.voiceEnd + 0.5, END + 1, { h: '留学住宿通', s: '利物浦学生住宿地图', cls: 'c end', fade: 0.5 });
S.sfx(CUES.voiceEnd + 0.5, 'hit', 0.45);

/* ---------- 字幕和数据画面（自己画，每帧按时间算，不用 CSS 动画） ---------- */
const css = document.createElement('style');
css.textContent = `
html.fs .mark .note { font-size: 15px; padding: 4px 11px; --g: 6px; }
#epcap { position: absolute; left: 40px; width: 1000px; top: 0; height: 240px; display: flex; align-items: center; justify-content: center; text-align: center; font: 800 62px/1.25 'Noto Sans SC', sans-serif; color: #1d1d1f; letter-spacing: .01em; z-index: 30; }
#ep { position: absolute; left: 0; top: 240px; width: 1080px; height: 1680px; overflow: hidden; opacity: 0; z-index: 20; background: radial-gradient(120% 80% at 50% 30%, #fbf8f2 0%, #f4eee3 60%, #ebe3d2 100%); font-family: 'Noto Sans SC', sans-serif; color: #1d1d1f; }
#ep .sc { position: absolute; inset: 0; padding: 70px 70px 0; opacity: 0; }
#ep .src { position: absolute; left: 0; right: 0; bottom: 46px; text-align: center; font: 400 26px/1.4 'Noto Sans SC'; color: #8a8478; }
#ep .kick { font: 700 34px/1.3 'Noto Sans SC'; color: #c2522f; letter-spacing: .06em; }
#ep .big { font: 900 84px/1.15 'Noto Sans SC'; margin-top: 10px; }
#ep .a { color: #1f6f8b; } #ep .b { color: #c2522f; }
#ep .bga { background: #1f6f8b; } #ep .bgb { background: #c2522f; }
#ep .card { position: absolute; width: 450px; height: 420px; border-radius: 36px; background: #fffdf8; box-shadow: 0 24px 50px -24px rgba(60,40,20,.35), inset 0 0 0 2px rgba(60,40,20,.06); padding: 40px 40px 0; }
#ep .card .nm { font: 800 44px/1.2 'Noto Sans SC'; }
#ep .card .pr { font: 900 124px/1 'Noto Sans SC'; margin-top: 56px; letter-spacing: -.02em; white-space: nowrap; }
#ep .card .pr small { font: 700 40px/1 'Noto Sans SC'; letter-spacing: 0; margin-left: 4px; }
#ep .card .sub { font: 500 30px/1.3 'Noto Sans SC'; color: #6e6e73; margin-top: 18px; }
#ep .diff { position: absolute; left: 0; right: 0; top: 760px; text-align: center; font: 900 210px/1 'Noto Sans SC'; letter-spacing: -.02em; }
#ep .diff small { font: 800 60px/1 'Noto Sans SC'; letter-spacing: 0; }
#ep .near { position: absolute; left: 70px; right: 70px; top: 1080px; height: 330px; }
#ep .near .ln { position: absolute; left: 190px; right: 190px; top: 118px; border-top: 6px dashed #b9b09d; }
#ep .near .pin { position: absolute; top: 60px; width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font: 900 52px/1 'Noto Sans SC'; box-shadow: 0 14px 30px -12px rgba(60,40,20,.5); }
#ep .near .lb { position: absolute; left: 0; right: 0; top: 30px; text-align: center; font: 800 46px/1.2 'Noto Sans SC'; }
#ep .near .nm { position: absolute; top: 200px; width: 420px; font: 700 34px/1.2 'Noto Sans SC'; }
#ep .legend { display: flex; gap: 44px; margin-top: 34px; font: 700 36px/1.2 'Noto Sans SC'; }
#ep .legend i { display: inline-block; width: 30px; height: 30px; border-radius: 8px; margin-right: 14px; vertical-align: -3px; }
#ep .wrow { position: absolute; left: 70px; right: 70px; height: 230px; }
#ep .wrow .t { font: 700 40px/1.2 'Noto Sans SC'; }
#ep .wrow .bar { position: absolute; left: 0; height: 54px; border-radius: 14px; }
#ep .wrow .n { position: absolute; font: 900 50px/54px 'Noto Sans SC'; }
#ep .rcol { position: absolute; top: 330px; width: 450px; text-align: center; }
#ep .rcol .nm { font: 800 44px/1.2 'Noto Sans SC'; }
#ep .rcol .sc2 { font: 900 230px/1 'Noto Sans SC'; margin-top: 50px; letter-spacing: -.03em; }
#ep .stars { position: relative; display: inline-block; font: 400 64px/1 'Noto Sans SC'; color: #dcd4c2; margin-top: 26px; letter-spacing: 6px; white-space: nowrap; }
#ep .stars b { position: absolute; left: 0; top: 0; overflow: hidden; white-space: nowrap; font-weight: 400; color: #e5a823; }
#ep .rcol .cnt { font: 700 44px/1.2 'Noto Sans SC'; color: #6e6e73; margin-top: 40px; }
#ep .lcol { position: absolute; top: 300px; width: 450px; }
#ep .lcol .nm { font: 800 44px/1.2 'Noto Sans SC'; margin-bottom: 36px; }
#ep .chip { height: 104px; border-radius: 26px; background: #fffdf8; box-shadow: 0 16px 34px -20px rgba(60,40,20,.4), inset 0 0 0 2px rgba(60,40,20,.07); margin-bottom: 26px; padding: 0 30px; font: 700 40px/104px 'Noto Sans SC'; white-space: nowrap; }
#ep .chip.hot { color: #fff; background: #c2522f; }
#ep .vrow { position: absolute; left: 70px; right: 70px; height: 132px; border-radius: 30px; background: #fffdf8; box-shadow: 0 16px 34px -20px rgba(60,40,20,.4), inset 0 0 0 2px rgba(60,40,20,.07); padding: 0 40px; font: 700 44px/132px 'Noto Sans SC'; }
#ep .vrow span { float: right; color: #6e6e73; font-weight: 500; }
#ep .vrow em { font-style: normal; color: #2c8a57; font-weight: 800; margin-left: 24px; }
#ep .vline { position: absolute; left: 0; right: 0; top: 780px; text-align: center; font: 900 76px/1.2 'Noto Sans SC'; }
#ep .vsub { position: absolute; left: 0; right: 0; top: 960px; text-align: center; font: 700 40px/1.2 'Noto Sans SC'; color: #c2522f; letter-spacing: .06em; }
#ep .vcard { position: absolute; top: 1050px; width: 290px; height: 300px; border-radius: 34px; background: #1d1d1f; color: #fff; text-align: center; padding-top: 62px; font: 800 50px/1.3 'Noto Sans SC'; box-shadow: 0 24px 50px -22px rgba(30,20,10,.6); }
#ep .vcard small { display: block; font: 500 30px/1.4 'Noto Sans SC'; color: #c9c4b8; margin-top: 16px; }
`;
document.head.appendChild(css);
const cap = document.createElement('div'); cap.id = 'epcap'; document.body.appendChild(cap);
const ep = document.createElement('div'); ep.id = 'ep'; document.body.appendChild(ep);
const names = `<div class="legend"><span><i class="bga"></i>${A.name}</span><span><i class="bgb"></i>${B.name}</span></div>`;
const starHtml = `<span class="stars">★★★★★<b>★★★★★</b></span>`;
ep.innerHTML = `
<div class="sc" data-sc="gap">
  <div class="kick">第 1 名 和 第 2 名</div><div class="big">每周差多少？</div>
  <div class="card" style="left:70px;top:290px"><div class="nm a">${A.name}</div><div class="pr a">£<span data-n="pa">0</span><small>/周</small></div><div class="sub">独卫单间起价</div></div>
  <div class="card" style="left:560px;top:290px"><div class="nm b">${B.name}</div><div class="pr b">£<span data-n="pb">0</span><small>/周</small></div><div class="sub">独卫单间起价</div></div>
  <div class="diff" data-e="diff">£<span data-n="pd">0</span><small> /周</small></div>
  <div class="near" data-e="near"><div class="lb">直线距离不到 100 米</div><div class="ln"></div>
    <div class="pin bga" style="left:60px">1</div><div class="pin bgb" style="right:60px">2</div>
    <div class="nm a" style="left:0">${A.name}</div><div class="nm b" style="right:0;text-align:right">${B.name}</div></div>
</div>
<div class="sc" data-sc="dist">
  <div class="kick">位置</div><div class="big">步行要几分钟？</div>${names}
  ${WALK.map((r, i) => `<div class="wrow" data-row="${i}" style="top:${470 + i * 262}px"><div class="t">去${r[0]}</div>
    <div class="bar bga" data-bar="a${i}" style="top:66px"></div><div class="n a" data-num="a${i}" style="top:66px">0</div>
    <div class="bar bgb" data-bar="b${i}" style="top:134px"></div><div class="n b" data-num="b${i}" style="top:134px">0</div></div>`).join('')}
</div>
<div class="sc" data-sc="rate">
  <div class="kick">口碑</div><div class="big">住客评分</div>
  <div class="rcol" style="left:70px"><div class="nm a">${A.name}</div><div class="sc2 a" data-n="ra">0.0</div>${starHtml}<div class="cnt">${A.reviews} 条评价</div></div>
  <div class="rcol" style="left:560px"><div class="nm b">${B.name}</div><div class="sc2 b" data-n="rb">0.0</div>${starHtml}<div class="cnt">${B.reviews} 条评价</div></div>
</div>
<div class="sc" data-sc="life">
  <div class="kick">生活</div><div class="big">楼里有什么？</div>
  <div class="lcol" style="left:70px"><div class="nm a">${A.name}</div>${A.has.map((h, i) => `<div class="chip" data-chip="a${i}">${h}</div>`).join('')}</div>
  <div class="lcol" style="left:560px"><div class="nm b">${B.name}</div>${B.has.map((h, i) => `<div class="chip${i === 3 ? ' hot' : ''}" data-chip="b${i}">${h}</div>`).join('')}</div>
</div>
<div class="sc" data-sc="verdict">
  <div class="kick">结论</div><div class="big">差在哪里？</div>
  <div class="vrow" data-v="0" style="top:300px">位置<em>几乎一样</em><span>相距不到 100 米</span></div>
  <div class="vrow" data-v="1" style="top:456px">距离<em>几乎一样</em><span>最多差 1 分钟</span></div>
  <div class="vrow" data-v="2" style="top:612px">评分<em>几乎一样</em><span>4.4 和 4.3</span></div>
  <div class="vline" data-e="vline">这些都解释不了 <span class="b">£37</span></div>
  <div class="vsub" data-e="vsub">订房之前，要比这三样</div>
  <div class="vcard" data-vc="0" style="left:70px">房间面积<small>同样叫独卫<br>大小可以差很多</small></div>
  <div class="vcard" data-vc="1" style="left:395px">装修新旧<small>看实拍照片<br>和翻新年份</small></div>
  <div class="vcard" data-vc="2" style="left:720px">合同周数<small>周数不同<br>总价差得更多</small></div>
</div>
<div class="src">${SOURCE}</div>`;
const $ = s => ep.querySelector(s), $$ = s => [...ep.querySelectorAll(s)];
const c01 = x => Math.max(0, Math.min(1, x)), out = x => 1 - Math.pow(1 - c01(x), 3), back = x => { x = c01(x); const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const show = (el, u, dy) => { el.style.opacity = c01(u); el.style.transform = `translateY(${(1 - out(u)) * (dy == null ? 40 : dy)}px)`; };
const pop = (el, u) => { el.style.opacity = c01(u * 2); el.style.transform = `scale(${0.8 + 0.2 * back(u)})`; };
const num = (k, v, d) => { $(`[data-n="${k}"]`).textContent = d ? v.toFixed(d) : Math.round(v); };
const SCENES = ['gap', 'dist', 'rate', 'life', 'verdict'];
const IN = C.gap.t0 - 0.3, OUT = C.cta.t0 - 0.15, XF = 0.3;
const scT0 = id => (id === 'gap' ? IN : C[id].t0 - 0.2), scT1 = id => { const i = SCENES.indexOf(id); return i === SCENES.length - 1 ? OUT + 0.6 : scT0(SCENES[i + 1]); };
const BARW = 760, BARMAX = 30;

function paint(t) {
  /* 字幕：当前这一句里已经说到的那一段 */
  let line = null;
  for (const c of CUES.cues) if (t >= c.t0 - 0.05 && t <= c.t1 + 0.3) for (const k of c.cap) if (t >= k.t - 0.05) line = k;
  if (line) { if (cap.__t !== line.t) { cap.__t = line.t; cap.textContent = line.text; cap.style.fontSize = (line.text.length > 15 ? 50 : line.text.length > 12 ? 56 : 62) + 'px'; }
    const u = (t - line.t + 0.05) / 0.16; cap.style.opacity = c01(u); cap.style.transform = `translateY(${(1 - out(u)) * 14}px) scale(${0.96 + 0.04 * out(u)})`; }
  else cap.style.opacity = t > CUES.voiceEnd ? 0 : cap.style.opacity;
  if (t > CUES.voiceEnd + 0.3) cap.style.opacity = 0;
  /* 数据画面整体的显隐 */
  ep.style.opacity = Math.min(c01((t - IN) / 0.35), c01((OUT + 0.55 - t) / 0.55));
  for (const id of SCENES) {
    const el = $(`[data-sc="${id}"]`), a = Math.min(c01((t - scT0(id)) / XF), c01((scT1(id) + XF - t) / XF));
    el.style.opacity = a; if (a <= 0) continue;
    const s = t - scT0(id);
    if (id === 'gap') {
      num('pa', A.price * out(s / 0.9)); num('pb', B.price * out((s - 0.15) / 0.9));
      const d = (t - at('gap', 0.02)) / 0.7; show($('[data-e="diff"]'), (t - C.gap.t0) / 0.3, 30); num('pd', (B.price - A.price) * out(d));
      show($('[data-e="near"]'), (t - at('gap', 0.42)) / 0.4);
    } else if (id === 'dist') {
      WALK.forEach((r, i) => {
        const t0 = i === 0 ? C.dist.t0 : at('dist', 0.42) + (i - 1) * 0.28, u = (t - t0) / 0.7;
        show($(`[data-row="${i}"]`), (t - t0 + 0.1) / 0.3, 24);
        for (const [k, o] of [['a', A], ['b', B]]) { const v = o[r[1]], w = BARW * v / BARMAX * out(u);
          $(`[data-bar="${k}${i}"]`).style.width = w + 'px'; const n = $(`[data-num="${k}${i}"]`); n.style.left = (w + 18) + 'px'; n.textContent = Math.round(v * out(u)); }
      });
    } else if (id === 'rate') {
      const u = out(s / 1.0); num('ra', A.rating * u, 1); num('rb', B.rating * u, 1);
      const st = $$('#ep .stars b'); st[0].style.width = (A.rating / 5 * 100 * u) + '%'; st[1].style.width = (B.rating / 5 * 100 * u) + '%';
      $$('#ep .rcol .cnt').forEach(e => show(e, (t - at('rate', 0.55)) / 0.3, 20));
    } else if (id === 'life') {
      A.has.forEach((h, i) => pop($(`[data-chip="a${i}"]`), (t - at('life', 0.17 + i * 0.09)) / 0.35));
      B.has.forEach((h, i) => pop($(`[data-chip="b${i}"]`), (t - at('life', [0.6, 0.7, 0.7, 0.84][i])) / 0.35));
    } else if (id === 'verdict') {
      [0, 1, 2].forEach(i => show($(`[data-v="${i}"]`), (t - at('verdict', i * 0.07)) / 0.3, 24));
      show($('[data-e="vline"]'), (t - at('verdict', 0.24)) / 0.3);
      show($('[data-e="vsub"]'), (t - at('verdict', 0.44)) / 0.3);
      [0.62, 0.76, 0.88].forEach((f, i) => pop($(`[data-vc="${i}"]`), (t - at('verdict', f)) / 0.4));
    }
  }
}
S.during(0, END + 1, (u, t) => paint(t));
paint(0);
