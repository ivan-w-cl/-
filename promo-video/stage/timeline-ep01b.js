/* 公寓 PK（竖屏铺满，带旁白、字幕、音效）—— 第 1 期快版，也是之后每一期的模板。
   做新一期：复制这个文件改名 timeline-<期号>.js，只改下面「每期只改这一块」的 EP；旁白在 episodes/<期号>/script.json。
   画面顺序（每段跟着同名的旁白句子走）：
   hook 开场大字 → open 筛选（镜头推近每个选项）→ count 大数字滚动 → sort 排序、标出前两名
   → gap 价格柱 → dist 走路比赛 → rate 评分天平 → life 楼里有什么 → verdict 结论 → cta 回到地图选专业 → 片名。
   旁白时间在 <期号>-cues.json（episodes/tts.py 生成），文件名跟着录制时的 TL 自动找。
   录制：见 .claude/skills/apartment-pk-video/SKILL.md（scripts/render.sh） */
'use strict';
const EPID = (new URLSearchParams(location.search).get('tl') || '').replace(/^timeline-/, '');
const CUES = (() => { const x = new XMLHttpRequest(); x.open('GET', EPID + '-cues.json', false); x.send(); return JSON.parse(x.responseText); })();
const C = {}; CUES.cues.forEach(c => { C[c.id] = c; });
const at = (id, f) => C[id].t0 + (C[id].t1 - C[id].t0) * f;
const cp = (id, i) => C[id].cap[i].t;                              // 第 i 段字幕出现的时间
const END = Math.ceil((CUES.voiceEnd + 3.4) * 30) / 30; S.END = END; console.log('EP_END', END);
const W = f => S.win(f);
const vis = e => e && e.getBoundingClientRect().width > 0;
const leafText = txt => w => [...w.document.querySelectorAll('button, a')].find(e => vis(e) && e.textContent.trim() === txt);
const setValue = v => el => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
const scrollParent = el => { for (let p = el && el.parentElement; p; p = p.parentElement) { const cs = getComputedStyle(p); if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 4) return p; } return null; };
const studentsView = w => w.eval(`(() => { const xs = HOMES.map(h => h.p[0]), ys = HOMES.map(h => h.p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), ww = mapbox.clientWidth, hh = mapbox.clientHeight - 130;
  const zz = Math.max(1, Math.min(zmax(), Math.min(ww / ((x1 - x0 + 80) * fitK), hh / ((y1 - y0 + 80) * fitK))));
  return { z: zz, tx: ww / 2 - (x0 + x1) / 2 * fitK * zz, ty: 60 + hh / 2 - (y0 + y1) / 2 * fitK * zz }; })()`);
const row = n => w => w.document.querySelector(`#homesPanel li.hrow[data-rank="${n}"]`);
const el$ = sel => w => w.document.querySelector(sel);
S.tapSfx = 'tick';

/* ==================== 每期只改这一块 ==================== */
const EP = {
  /* 网页「筛选」里的选项值。房型 room：any / ensuite / studio；步行 walk：5 / 10 / 15 / 20 / 30 / 45（到 dest）；
     dest：uol 利物浦大学 / ljmu；预算 budget：0 不限 / 100 / 125 / 150 / 175 / 200 / 250 / 300；
     排序 rank：ensuite 独卫最便宜 / studio / cheapest / uol / ljmu / lime / centre / reviews / rating */
  filter: { room: 'ensuite', walk: '10', dest: 'uol', budget: '0', rank: 'ensuite' },
  /* 两栋楼：A 是排第 1 的（便宜的），B 是第 2 名。数字来自 data/homes.json 和网页里的 PRICES。
     has：楼里有什么（每栋 2–4 项）；B.hot：B 的第几项标红（从 0 数，不标就写 -1） */
  A: { name: 'Europa', price: 95, uol: 9, ljmu: 18, lime: 16, centre: 28, rating: 4.4, reviews: 19, has: ['休息室', '游戏区', '住户活动'] },
  B: { name: 'Prospect Point', price: 132, uol: 9, ljmu: 17, lime: 15, centre: 27, rating: 4.3, reviews: 19, has: ['公共厨房', '用餐区', '24 小时安保'], hot: 2 },
  hook: { big: '£37', unit: '/周', stamp: '凭什么？' },                       // 开场砸下来的大字和红章
  count: { from: 47, to: 9, sub: '独卫 · 步行 10 分钟内' },                    // 筛选后的大数字
  rank: ['第 1 名 £95', '第 2 名 £132'],                                      // 列表上两个标签
  price: { kick: '第 1 名 VS 第 2 名', title: '每周差多少？', extra: '多出来的这一截', near: '两栋楼相距不到 100 米' },
  race: { title: '走到利物浦大学', to: 'uol', flag: '利物浦<br>大学', done: '同时到 · 都是 9 分钟',
    rows: [['去 LJMU', 'ljmu', '差 1 分钟'], ['去莱姆街火车站', 'lime', '差 1 分钟'], ['去市中心', 'centre', '差 1 分钟']] },
  rate: { title: '放到天平上' },
  life: { title: '楼里有什么？' },
  verdict: { rows: [['位置', '相距不到 100 米'], ['距离', '最多差 1 分钟'], ['评分', '4.4 对 4.3']],
    line: '全都解释不了 <span class="b">£37</span>', sub: '订房之前，请对比三样',
    cards: [['房间面积', '同样叫独卫<br>大小可以差很多'], ['装修新旧', '看实拍照片<br>和翻新年份'], ['合同周数', '周数不同<br>总价差得更多']] },
  subject: 'medicine',                                                      // 片尾选的专业（网页 #subject 的值）
  source: '价格与评分：Amber 平台起价，2026-10-17 核对 · 步行时间按距离估算',     // 画面底部的数据来源
  end: { h: '留学住宿通', s: '利物浦学生住宿地图' },                             // 片名
  zoom: { filter: 1.45, button: 1.4, rank: 1.35, subject: 1.5 }             // 镜头推近的倍数
};
/* ======================================================= */
const A = EP.A, B = EP.B, SOURCE = EP.source;

/* ---------- 网页镜头：把整块屏幕绕某一点放大（焦点可以是网页里的元素，录制时取它的位置） ---------- */
const SW = 432, SH = 672;                                           // 铺满版网页的排版尺寸
const ZOOMS = [];
const zoom = (t0, dur, s, focus, fx) => ZOOMS.push({ t0, t1: t0 + dur, s, focus, fx });
const easeZ = u => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
function zoomState(t) {
  let st = { s: 1, x: SW / 2, y: SH / 2 };
  for (const z of ZOOMS) {
    if (t < z.t0) break;
    if (!z.f) {   // 第一次走到这一段：取焦点位置（之后固定，录出来每次一样）
      if (typeof z.focus === 'function') { const e = z.focus(W()); if (e) { const r = e.getBoundingClientRect(); z.f = { x: z.fx != null ? z.fx : r.left + r.width / 2, y: r.top + r.height / 2 }; } }
      else z.f = z.focus || { x: SW / 2, y: SH / 2 };
      if (!z.f) z.f = { x: st.x, y: st.y };
    }
    const u = easeZ(Math.min(1, (t - z.t0) / (z.t1 - z.t0)));
    st = { s: st.s + (z.s - st.s) * u, x: st.x + (z.f.x - st.x) * u, y: st.y + (z.f.y - st.y) * u };
  }
  return st;
}
function paintZoom(t) {
  const scr = document.getElementById('scr'), z = zoomState(t);
  scr.style.transformOrigin = '0 0';
  scr.style.transform = z.s === 1 ? 'none' : `translate(${z.x * (1 - z.s)}px,${z.y * (1 - z.s)}px) scale(${z.s})`;
}

/* ---------- 网页操作 ---------- */
S.at(0.36, () => { for (const id of ['app', 'appT', 'appF']) { try { W(id).HomeMatch.exit(); } catch (e) { /* 没有 */ }
  try { const d = S.doc(id), s = d.createElement('style'); s.textContent = '.hi-bar{display:none!important}'; d.head.appendChild(s); } catch (e) { /* 还没载入 */ } } });
S.mapGlide(0.5, 2.6, studentsView);
zoom(2.8, cp('hook', 3) - 2.8, 1.1, null);                          // 开场慢慢推近
zoom(cp('hook', 3), 0.18, 1.18, null);                              // 「£37」砸下来时镜头一顿
zoom(C.hook.t1 - 0.05, 0.3, 1, null);
const FAST = { lead: 0.18 };
S.tap(C.open.t0 - 0.12, leafText('筛选'), FAST);
S.sfx(C.open.t0, 'whoosh', 0.35);
zoom(C.open.t0 + 0.05, 0.3, EP.zoom.filter, el$('#homeRoom'), 300);
S.at(C.open.t0 + 0.1, () => { const d = W().document; for (const [id, v] of [['homeBudget', EP.filter.budget], ['homeDestination', EP.filter.dest]]) { const e = d.getElementById(id); if (e && e.value !== v) setValue(v)(e); } });
S.tap(cp('open', 1) + 0.05, '#homeRoom', Object.assign({ fn: setValue(EP.filter.room) }, FAST));
zoom(cp('open', 2) - 0.12, 0.26, EP.zoom.filter, el$('#homeWalk'), 300);
S.tap(cp('open', 2) + 0.12, '#homeWalk', Object.assign({ fn: setValue(EP.filter.walk) }, FAST));
zoom(C.count.t0 - 0.12, 0.25, EP.zoom.button, el$('#viewResults'));
S.tap(C.count.t0 + 0.02, '#viewResults', FAST);
zoom(C.count.t1 - 0.1, 0.3, 1, null);
S.tap(C.sort.t0 + 0.05, '#rank', Object.assign({ fn: setValue(EP.filter.rank) }, FAST));
S.scroll(C.sort.t0 + 0.2, C.sort.t0 + 0.55, w => scrollParent(row(1)(w)), (box, w) => box.scrollTop + row(1)(w).getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight * 0.34);
zoom(cp('sort', 1) - 0.25, 0.3, EP.zoom.rank, row(1), 216);
zoom(cp('sort', 2) - 0.15, 0.3, EP.zoom.rank, row(2), 216);
S.note(cp('sort', 1), cp('sort', 2) - 0.1, row(1), EP.rank[0], { pos: 'top' });
S.note(cp('sort', 2), C.gap.t0, row(2), EP.rank[1], { pos: 'top' });
S.sfx(cp('sort', 1), 'pop', 0.7); S.sfx(cp('sort', 2), 'pop', 0.7);
/* 数据画面盖住网页时：关列表、回到地图，片尾用 */
S.at(C.dist.t0, () => { const b = [...W().document.querySelectorAll('#homesPanel .closeSheet')].find(vis); if (b) b.click(); });
zoom(C.gap.t0, 0.1, 1, null);
zoom(C.cta.t0 + 0.1, 0.5, EP.zoom.subject, el$('.subject-tab'));
S.tap(cp('cta', 0) + 0.7, '.subject-tab', FAST);
zoom(cp('cta', 1) - 0.1, 0.4, 1.35, el$('#subject'));
S.tap(cp('cta', 1) + 0.25, '#subject', Object.assign({ fn: setValue(EP.subject) }, FAST));
zoom(cp('cta', 1) + 0.7, 0.9, 1, null);
S.sfx(cp('cta', 1) + 0.3, 'whoosh', 0.4);
S.title(CUES.voiceEnd + 0.4, END + 1, { h: EP.end.h, s: EP.end.s, cls: 'c end', fade: 0.4 });
S.sfx(CUES.voiceEnd + 0.4, 'hit', 0.5);
/* 数据画面的音效 */
const SCENES = ['gap', 'dist', 'rate', 'life', 'verdict'];
const IN = C.gap.t0 - 0.15, OUT = C.cta.t0 - 0.1;
const scT0 = id => (id === 'gap' ? IN : C[id].t0 - 0.15), scT1 = id => { const i = SCENES.indexOf(id); return i === SCENES.length - 1 ? OUT : scT0(SCENES[i + 1]); };
SCENES.forEach(id => S.sfx(scT0(id), 'whoosh', 0.45)); S.sfx(OUT, 'whoosh', 0.45);
S.sfx(cp('hook', 3), 'hit', 0.55); S.sfx(cp('hook', 4), 'pop', 0.8);
S.sfx(C.count.t1 - 0.15, 'hit', 0.4);
S.sfx(cp('gap', 0) + 0.55, 'pop', 0.6);
S.sfx(cp('dist', 1) + 0.15, 'ding', 0.5);
[0, 1, 2].forEach(i => S.sfx(at('verdict', i * 0.08) + 0.12, 'tick', 0.9));
[0.6, 0.73, 0.86].forEach(f => S.sfx(at('verdict', f) + 0.1, 'pop', 0.55));

/* ---------- 自己画的层：字幕、开场大字、计数、数据画面 ---------- */
const css = document.createElement('style');
css.textContent = `
html.fs .mark .note { font-size: 15px; padding: 4px 11px; --g: 6px; }
#band { position: absolute; left: 0; right: 0; top: 0; height: 240px; background: #fbf8f2; z-index: 25; box-shadow: 0 10px 24px -14px rgba(60,40,20,.35); }
#epcap { position: absolute; left: 40px; width: 1000px; top: 0; height: 240px; display: flex; align-items: center; justify-content: center; text-align: center; font: 800 62px/1.25 'Noto Sans SC', sans-serif; color: #1d1d1f; z-index: 30; }
#epcap b { color: #c2522f; font-weight: 900; }
#kin { position: absolute; left: 0; top: 240px; width: 1080px; height: 1680px; z-index: 22; pointer-events: none; font-family: 'Noto Sans SC', sans-serif; }
#kin .veil { position: absolute; inset: 0; background: rgba(29,24,18,.5); opacity: 0; }
#kin .k37 { position: absolute; left: 0; right: 0; top: 520px; text-align: center; font: 900 330px/1 'Noto Sans SC'; color: #fff; letter-spacing: -.03em; text-shadow: 0 18px 50px rgba(0,0,0,.45); opacity: 0; }
#kin .k37 small { font: 800 90px/1 'Noto Sans SC'; letter-spacing: 0; }
#kin .why { position: absolute; left: 0; right: 0; top: 920px; text-align: center; opacity: 0; }
#kin .why span { display: inline-block; font: 900 120px/1 'Noto Sans SC'; color: #fff; background: #c2522f; padding: 18px 46px 26px; border-radius: 28px; box-shadow: 0 20px 40px -16px rgba(0,0,0,.5); }
#kin .cnt { position: absolute; left: 0; right: 0; top: 470px; text-align: center; color: #fff; opacity: 0; text-shadow: 0 18px 50px rgba(0,0,0,.45); }
#kin .cnt .n { font: 900 420px/1 'Noto Sans SC'; letter-spacing: -.04em; display: inline-block; min-width: 520px; }
#kin .cnt .u { font: 800 100px/1 'Noto Sans SC'; }
#kin .cnt .of { display: block; font: 700 54px/1.4 'Noto Sans SC'; color: #f3e6cf; margin-top: 10px; }
#kin .flash { position: absolute; inset: 0; background: #fff; opacity: 0; }
#ep { position: absolute; left: 0; top: 240px; width: 1080px; height: 1680px; overflow: hidden; opacity: 0; z-index: 20; background: radial-gradient(120% 80% at 50% 30%, #fbf8f2 0%, #f4eee3 60%, #ebe3d2 100%); font-family: 'Noto Sans SC', sans-serif; color: #1d1d1f; }
#ep .sc { position: absolute; inset: 0; padding: 70px 70px 0; opacity: 0; will-change: transform, filter; }
#ep .src { position: absolute; left: 0; right: 0; bottom: 46px; text-align: center; font: 400 26px/1.4 'Noto Sans SC'; color: #8a8478; }
#ep .kick { font: 700 34px/1.3 'Noto Sans SC'; color: #c2522f; letter-spacing: .06em; }
#ep .big { font: 900 84px/1.15 'Noto Sans SC'; margin-top: 10px; }
#ep .a { color: #1f6f8b; } #ep .b { color: #c2522f; }
#ep .bga { background: #1f6f8b; } #ep .bgb { background: #c2522f; }
/* 价格柱 */
#ep .pbar { position: absolute; bottom: 600px; width: 300px; border-radius: 22px 22px 0 0; overflow: hidden; }
#ep .pbar .extra { position: absolute; left: 0; right: 0; top: 0; background: repeating-linear-gradient(-45deg, #c2522f 0 22px, #d9734f 22px 44px); }
#ep .ptop { position: absolute; width: 300px; text-align: center; font: 900 92px/1 'Noto Sans SC'; letter-spacing: -.02em; color: #fff !important; top: 900px; }
#ep .pname { position: absolute; bottom: 530px; width: 300px; text-align: center; font: 800 40px/1.2 'Noto Sans SC'; }
#ep .base { position: absolute; left: 110px; right: 110px; bottom: 596px; border-top: 6px solid #3b2a1a; }
#ep .dash { position: absolute; border-top: 5px dashed #3b2a1a; opacity: .55; }
#ep .plus { position: absolute; left: 160px; width: 360px; text-align: center; font: 900 118px/1 'Noto Sans SC'; color: #c2522f; }
#ep .plus small { display: block; font: 700 38px/1.3 'Noto Sans SC'; color: #6e6e73; margin-top: 8px; }
#ep .near { position: absolute; left: 70px; right: 70px; bottom: 150px; height: 300px; }
#ep .near .ln { position: absolute; left: 190px; right: 190px; top: 118px; border-top: 6px dashed #b9b09d; }
#ep .near .pin { position: absolute; top: 60px; width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font: 900 52px/1 'Noto Sans SC'; box-shadow: 0 14px 30px -12px rgba(60,40,20,.5); }
#ep .near .lb { position: absolute; left: 0; right: 0; top: 10px; text-align: center; font: 800 46px/1.2 'Noto Sans SC'; }
#ep .near .nm { position: absolute; top: 200px; width: 420px; font: 700 34px/1.2 'Noto Sans SC'; }
/* 赛跑 */
#ep .clock { position: absolute; right: 70px; top: 80px; text-align: right; font: 900 120px/1 'Noto Sans SC'; letter-spacing: -.02em; }
#ep .clock small { font: 700 44px/1 'Noto Sans SC'; margin-left: 6px; }
#ep .lane { position: absolute; left: 70px; right: 70px; height: 150px; }
#ep .lane .trk { position: absolute; left: 90px; right: 130px; top: 70px; border-top: 8px dotted #c9bfa9; }
#ep .lane .walked { position: absolute; left: 90px; top: 70px; height: 8px; border-radius: 4px; }
#ep .lane .who { position: absolute; left: 0; top: 0; font: 800 36px/1.2 'Noto Sans SC'; }
#ep .lane .run { position: absolute; top: 34px; width: 84px; height: 84px; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; font: 900 42px/1 'Noto Sans SC'; box-shadow: 0 12px 24px -10px rgba(60,40,20,.55); }
#ep .flag { position: absolute; right: 70px; top: 330px; width: 120px; text-align: center; font: 800 30px/1.25 'Noto Sans SC'; }
#ep .flag .pole { margin: 0 auto 10px; width: 10px; height: 290px; background: #3b2a1a; position: relative; border-radius: 5px; }
#ep .flag .pole::after { content: ''; position: absolute; left: 10px; top: 0; width: 70px; height: 48px; background: repeating-conic-gradient(#3b2a1a 0 25%, #fff 0 50%) 0 0 / 24px 24px; }
#ep .tie { position: absolute; left: 0; right: 0; top: 760px; text-align: center; }
#ep .tie span { display: inline-block; font: 900 76px/1 'Noto Sans SC'; color: #fff; background: #2c8a57; padding: 18px 40px 24px; border-radius: 24px; transform: rotate(-4deg); box-shadow: 0 20px 40px -18px rgba(20,60,30,.6); }
#ep .mrow { position: absolute; left: 70px; right: 70px; height: 110px; border-radius: 28px; background: #fffdf8; box-shadow: 0 16px 34px -20px rgba(60,40,20,.4), inset 0 0 0 2px rgba(60,40,20,.07); padding: 0 34px; font: 700 40px/110px 'Noto Sans SC'; white-space: nowrap; }
#ep .mrow .v { position: absolute; left: 400px; font-weight: 900; }
#ep .mrow .d { position: absolute; right: 34px; color: #2c8a57; font-weight: 800; }
/* 天平 */
#ep .scale { position: absolute; left: 0; top: 0; width: 1080px; height: 1680px; }
#ep .post { position: absolute; left: 529px; top: 560px; width: 22px; height: 520px; background: #3b2a1a; border-radius: 11px; }
#ep .foot { position: absolute; left: 380px; top: 1060px; width: 320px; height: 40px; background: #3b2a1a; border-radius: 20px; }
#ep .beam { position: absolute; left: 140px; top: 540px; width: 800px; height: 26px; background: #3b2a1a; border-radius: 13px; transform-origin: 400px 13px; }
#ep .hub { position: absolute; left: 515px; top: 528px; width: 50px; height: 50px; border-radius: 50%; background: #c2522f; border: 6px solid #3b2a1a; box-sizing: border-box; }
#ep .pan { position: absolute; top: 13px; width: 0; height: 0; }
#ep .pan .str { position: absolute; left: -2px; top: 0; width: 4px; height: 210px; background: #8a7a62; }
#ep .pan .dish { position: absolute; left: -150px; top: 205px; width: 300px; height: 200px; text-align: center; }
#ep .pan .dish .sc3 { font: 900 130px/1 'Noto Sans SC'; letter-spacing: -.03em; }
#ep .pan .dish .bowl { margin: 8px auto 0; width: 300px; height: 34px; border-radius: 0 0 150px 150px; }
#ep .pan .dish .nm { font: 800 34px/1.3 'Noto Sans SC'; margin-top: 14px; white-space: nowrap; }
#ep .pan .dish .rv { font: 600 30px/1.3 'Noto Sans SC'; color: #6e6e73; }
/* 配置 */
#ep .lcol { position: absolute; top: 300px; width: 450px; }
#ep .lcol .nm { font: 800 44px/1.2 'Noto Sans SC'; margin-bottom: 36px; }
#ep .chip { height: 112px; border-radius: 28px; background: #fffdf8; box-shadow: 0 16px 34px -20px rgba(60,40,20,.4), inset 0 0 0 2px rgba(60,40,20,.07); margin-bottom: 28px; padding: 0 32px; font: 700 42px/112px 'Noto Sans SC'; white-space: nowrap; }
#ep .chip.hot { color: #fff; background: #c2522f; }
#ep .versus { position: absolute; left: 470px; top: 600px; width: 140px; height: 140px; border-radius: 50%; background: #1d1d1f; color: #fff; font: 900 54px/140px 'Noto Sans SC'; text-align: center; }
/* 结论 */
#ep .vrow { position: absolute; left: 70px; right: 70px; height: 132px; border-radius: 30px; background: #fffdf8; box-shadow: 0 16px 34px -20px rgba(60,40,20,.4), inset 0 0 0 2px rgba(60,40,20,.07); padding: 0 40px; font: 700 46px/132px 'Noto Sans SC'; }
#ep .vrow span { position: absolute; left: 220px; color: #6e6e73; font-weight: 500; font-size: 38px; }
#ep .vrow .stamp { position: absolute; right: 34px; top: 16px; width: 100px; height: 100px; border-radius: 50%; border: 7px solid #2c8a57; color: #2c8a57; font: 900 64px/86px 'Noto Sans SC'; text-align: center; box-sizing: border-box; }
#ep .vline { position: absolute; left: 0; right: 0; top: 780px; text-align: center; font: 900 78px/1.2 'Noto Sans SC'; }
#ep .vsub { position: absolute; left: 0; right: 0; top: 950px; text-align: center; font: 700 42px/1.2 'Noto Sans SC'; color: #c2522f; letter-spacing: .06em; }
#ep .vcard { position: absolute; top: 1040px; width: 290px; height: 310px; border-radius: 34px; background: #1d1d1f; color: #fff; text-align: center; padding-top: 64px; font: 800 52px/1.3 'Noto Sans SC'; box-shadow: 0 24px 50px -22px rgba(30,20,10,.6); backface-visibility: hidden; }
#ep .vcard small { display: block; font: 500 30px/1.4 'Noto Sans SC'; color: #c9c4b8; margin-top: 18px; }
`;
document.head.appendChild(css);
const mk = (id, html) => { const d = document.createElement('div'); d.id = id; if (html) d.innerHTML = html; document.body.appendChild(d); return d; };
mk('band'); const cap = mk('epcap');
const kin = mk('kin', `<div class="veil"></div><div class="flash"></div>
  <div class="k37">${EP.hook.big}<small> ${EP.hook.unit}</small></div><div class="why"><span>${EP.hook.stamp}</span></div>
  <div class="cnt"><span class="n">${EP.count.from}</span><span class="u">栋</span><span class="of">${EP.count.sub}</span></div>`);
const PX = 800 / Math.max(A.price, B.price);                          // 价格柱：贵的那根 800 px 高
const ep = mk('ep', `
<div class="sc" data-sc="gap">
  <div class="kick">${EP.price.kick}</div><div class="big">${EP.price.title}</div>
  <div class="base"></div>
  <div class="pbar bga" data-pb="a" style="left:190px"></div><div class="pbar bgb" data-pb="b" style="left:590px"><div class="extra"></div></div>
  <div class="ptop a" data-pt="a" style="left:190px">£0</div><div class="ptop b" data-pt="b" style="left:590px">£0</div>
  <div class="pname a" style="left:190px">${A.name}</div><div class="pname b" style="left:590px">${B.name}</div>
  <div class="dash" data-e="dash" style="left:190px;width:700px"></div>
  <div class="plus" data-e="plus">+£${B.price - A.price}<small>${EP.price.extra}</small></div>
  <div class="near" data-e="near"><div class="lb">${EP.price.near}</div><div class="ln"></div>
    <div class="pin bga" style="left:60px">1</div><div class="pin bgb" style="right:60px">2</div>
    <div class="nm a" style="left:0">${A.name}</div><div class="nm b" style="right:0;text-align:right">${B.name}</div></div>
</div>
<div class="sc" data-sc="dist">
  <div class="kick">位置</div><div class="big">${EP.race.title}</div>
  <div class="clock" data-e="clock">0<small>分钟</small></div>
  ${[['a', A], ['b', B]].map(([k, o], i) => `<div class="lane" style="top:${330 + i * 190}px"><div class="who ${k}">${o.name}</div><div class="trk"></div><div class="walked bg${k}" data-w="${k}"></div><div class="run bg${k}" data-r="${k}">${i + 1}</div></div>`).join('')}
  <div class="flag"><div class="pole"></div>${EP.race.flag}</div>
  <div class="tie" data-e="tie"><span>${EP.race.done}</span></div>
  ${EP.race.rows.map((r, i) => `<div class="mrow" data-m="${i}" style="top:${930 + i * 140}px">${r[0]}<span class="v"><span class="a">${A[r[1]]}</span> · <span class="b">${B[r[1]]}</span> 分钟</span><span class="d">${r[2]}</span></div>`).join('')}
</div>
<div class="sc" data-sc="rate">
  <div class="kick">口碑</div><div class="big">${EP.rate.title}</div>
  <div class="scale"><div class="post"></div><div class="foot"></div>
    <div class="beam" data-e="beam">
      ${[['a', A, 0], ['b', B, 800]].map(([k, o, x]) => `<div class="pan" data-pan="${k}" style="left:${x}px"><div class="str"></div><div class="dish"><div class="sc3 ${k}" data-sv="${k}">0.0</div><div class="bowl bg${k}"></div><div class="nm ${k}">${o.name}</div><div class="rv">${o.reviews} 条评价</div></div></div>`).join('')}
    </div><div class="hub"></div></div>
</div>
<div class="sc" data-sc="life">
  <div class="kick">生活</div><div class="big">${EP.life.title}</div>
  <div class="lcol" style="left:70px"><div class="nm a">${A.name}</div>${A.has.map((h, i) => `<div class="chip" data-chip="a${i}">${h}</div>`).join('')}</div>
  <div class="lcol" style="left:560px"><div class="nm b">${B.name}</div>${B.has.map((h, i) => `<div class="chip${i === B.hot ? ' hot' : ''}" data-chip="b${i}">${h}</div>`).join('')}</div>
</div>
<div class="sc" data-sc="verdict">
  <div class="kick">结论</div><div class="big">差在哪里？</div>
  ${EP.verdict.rows.map((r, i) => `<div class="vrow" data-v="${i}" style="top:${300 + i * 156}px">${r[0]}<span>${r[1]}</span><div class="stamp" data-st="${i}">≈</div></div>`).join('')}
  <div class="vline" data-e="vline">${EP.verdict.line}</div>
  <div class="vsub" data-e="vsub">${EP.verdict.sub}</div>
  ${EP.verdict.cards.map((c, i) => `<div class="vcard" data-vc="${i}" style="left:${70 + i * 325}px">${c[0]}<small>${c[1]}</small></div>`).join('')}
</div>
<div class="src">${SOURCE}</div>`);
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const c01 = x => Math.max(0, Math.min(1, x)), out = x => 1 - Math.pow(1 - c01(x), 3), back = x => { x = c01(x); const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const show = (el, u, dy) => { el.style.opacity = c01(u); el.style.transform = `translateY(${(1 - out(u)) * (dy == null ? 40 : dy)}px)`; };
const pop = (el, u) => { el.style.opacity = c01(u * 2.5); el.style.transform = `scale(${0.6 + 0.4 * back(u)})`; };
const slam = (el, u) => { el.style.opacity = c01(u * 3); el.style.transform = `scale(${1 + 1.6 * Math.pow(1 - out(u), 2)})`; el.style.filter = `blur(${(1 - out(u)) * 14}px)`; };
const XF = 0.32;

function paint(t) {
  paintZoom(t);
  /* 字幕：数字标红 */
  let line = null;
  for (const c of CUES.cues) if (t >= c.t0 - 0.05 && t <= c.t1 + 0.25) for (const k of c.cap) if (t >= k.t - 0.05) line = k;
  if (line && t < CUES.voiceEnd + 0.25) {
    if (cap.__t !== line.t) { cap.__t = line.t; cap.innerHTML = line.text.replace(/(£?\d+(\.\d+)?)/g, '<b>$1</b>'); cap.style.fontSize = (line.text.length > 15 ? 50 : line.text.length > 12 ? 56 : 64) + 'px'; }
    const u = (t - line.t + 0.05) / 0.12; cap.style.opacity = c01(u); cap.style.transform = `scale(${0.9 + 0.1 * back(u)})`;
  } else cap.style.opacity = 0;
  /* 开场：£37 砸下来，「凭什么？」 */
  const t37 = cp('hook', 3), tw = cp('hook', 4), hk1 = C.hook.t1 + 0.1;
  const hv = Math.min(c01((t - t37 + 0.1) / 0.2), c01((hk1 - t) / 0.25));
  $('#kin .veil').style.opacity = 0.9 * hv;
  slam($('#kin .k37'), (t - t37) / 0.32); if (t > hk1) $('#kin .k37').style.opacity = c01((hk1 + 0.2 - t) / 0.2) * (t < hk1 + 0.2 ? 1 : 0);
  const why = $('#kin .why'); if (t < hk1) { pop(why, (t - tw) / 0.3); why.style.transform += ' rotate(-5deg)'; } else why.style.opacity = c01((hk1 + 0.2 - t) / 0.2);
  /* 47 → 9 */
  const ct0 = C.count.t0 - 0.05, ct1 = C.count.t1 + 0.35;
  const cv = Math.min(c01((t - ct0) / 0.15), c01((ct1 - t) / 0.2));
  if (cv > 0) { $('#kin .veil').style.opacity = 0.85 * cv; }
  const cnt = $('#kin .cnt'); cnt.style.opacity = cv;
  const cu = c01((t - ct0 - 0.15) / (C.count.t1 - ct0 - 0.35));
  cnt.querySelector('.n').textContent = Math.round(EP.count.from - (EP.count.from - EP.count.to) * (cu < 1 ? Math.pow(cu, 0.6) : 1));
  cnt.style.transform = `scale(${1 + 0.08 * Math.sin(Math.min(1, cu) * Math.PI)})`;
  const fl = (t - (C.count.t1 - 0.15)) / 0.35; $('#kin .flash').style.opacity = fl > 0 && fl < 1 ? 0.55 * (1 - fl) * (1 - fl) : 0;
  /* 数据画面：横向甩进甩出 */
  ep.style.opacity = t >= IN && t <= OUT + XF ? 1 : 0;
  for (const id of SCENES) {
    const el = $(`[data-sc="${id}"]`), a0 = scT0(id), a1 = scT1(id);
    let x = null;
    if (t >= a0 && t < a0 + XF) x = (1 - out((t - a0) / XF)) * 1080;
    else if (t >= a0 + XF && t < a1) x = 0;
    else if (t >= a1 && t < a1 + XF) x = -out((t - a1) / XF) * 1080;
    if (x === null) { el.style.opacity = 0; continue; }
    const v = Math.abs(x) / 1080; el.style.opacity = 1; el.style.transform = `translateX(${x}px)`; el.style.filter = v > 0.02 ? `blur(${(Math.sin(v * Math.PI) * 16).toFixed(1)}px)` : 'none';
    if (id === 'gap') {
      const ua = out((t - a0 - 0.15) / 0.8), ub = out((t - a0 - 0.3) / 0.8);
      for (const [k, o, u] of [['a', A, ua], ['b', B, ub]]) { const h = o.price * PX * u; $(`[data-pb="${k}"]`).style.height = h + 'px'; const tp = $(`[data-pt="${k}"]`); tp.style.opacity = c01((h - 150) / 60); tp.textContent = '£' + Math.round(o.price * u); }
      const ue = (t - cp('gap', 0) - 0.3) / 0.45;
      $('[data-pb="b"] .extra').style.height = (B.price - A.price) * PX * out(ue) + 'px'; $('[data-pb="b"] .extra').style.opacity = c01(ue * 3);
      const dash = $('[data-e="dash"]'); dash.style.top = (1680 - 600 - A.price * PX) + 'px'; dash.style.opacity = 0.55 * c01(ue * 2);
      const pl = $('[data-e="plus"]'); pl.style.top = (1680 - 600 - B.price * PX + 30) + 'px'; pop(pl, (t - cp('gap', 0) - 0.55) / 0.35);
      show($('[data-e="near"]'), (t - cp('gap', 2) + 0.1) / 0.35);
    } else if (id === 'dist') {
      const r0 = cp('dist', 0) - 0.05, r1 = cp('dist', 1) + 0.15, mx = Math.max(A[EP.race.to], B[EP.race.to]), ur = c01((t - r0) / (r1 - r0)), mins = mx * ur;   // 时钟走到慢的那栋到达
      for (const [k, o] of [['a', A], ['b', B]]) { const uk = c01(mins / o[EP.race.to]), e = uk < 1 ? uk * uk * (3 - 2 * uk) : 1, run = $(`[data-r="${k}"]`), wob = Math.sin((t - r0) * 26 + (k === 'a' ? 0 : 1.7)) * 6 * (uk > 0 && uk < 1 ? 1 : 0);
        const x = 48 + e * 692; run.style.left = x + 'px'; run.style.transform = `translateY(${wob}px)`; $(`[data-w="${k}"]`).style.width = Math.max(0, x - 48) + 'px'; }
      const ck = $('[data-e="clock"]'); ck.firstChild.textContent = String(Math.round(mins)); ck.style.color = ur >= 1 ? '#2c8a57' : '#1d1d1f';
      const tie = $('[data-e="tie"]'); pop(tie, (t - r1) / 0.35);
      [0, 1, 2].forEach(i => show($(`[data-m="${i}"]`), (t - cp('dist', 2) - i * 0.12) / 0.3, 30));
    } else if (id === 'rate') {
      const u = out((t - a0 - 0.2) / 0.7); $('[data-sv="a"]').textContent = (A.rating * u).toFixed(1); $('[data-sv="b"]').textContent = (B.rating * u).toFixed(1);
      const s0 = a0 + 0.35, tilt = Math.max(-12, Math.min(12, -(A.rating - B.rating) * 12)), d = Math.max(0, t - s0);   // 分高的一边沉一点
      const ang = t < s0 ? 0 : tilt + (0 - tilt) * Math.exp(-d * 2.2) * Math.cos(d * 9) + 7 * Math.exp(-d * 2.6) * Math.sin(d * 9);
      $('[data-e="beam"]').style.transform = `rotate(${ang}deg)`;
      $$('#ep [data-pan]').forEach(p => { p.style.transform = `rotate(${-ang}deg)`; });
    } else if (id === 'life') {
      A.has.forEach((h, i) => pop($(`[data-chip="a${i}"]`), (t - cp('life', 1) - i * 0.18) / 0.3));
      B.has.forEach((h, i) => pop($(`[data-chip="b${i}"]`), (t - (i < 2 ? cp('life', 2) + i * 0.25 : cp('life', 3))) / 0.3));
    } else if (id === 'verdict') {
      [0, 1, 2].forEach(i => { show($(`[data-v="${i}"]`), (t - at('verdict', i * 0.08) + 0.1) / 0.25, 24); const st = $(`[data-st="${i}"]`), u = (t - at('verdict', i * 0.08) - 0.1) / 0.25;
        st.style.opacity = c01(u * 3); st.style.transform = `scale(${1 + 1.2 * Math.pow(1 - out(u), 2)}) rotate(${-12 + 12 * out(u)}deg)`; });
      pop($('[data-e="vline"]'), (t - cp('verdict', 1)) / 0.35);
      show($('[data-e="vsub"]'), (t - cp('verdict', 2)) / 0.3);
      [0.6, 0.73, 0.86].forEach((f, i) => { const c = $(`[data-vc="${i}"]`), u = out((t - at('verdict', f)) / 0.45); c.style.opacity = c01(u * 4); c.style.transform = `perspective(900px) rotateY(${(1 - u) * 95}deg)`; });
    }
  }
}
S.during(0, END + 1, (u, t) => paint(t));
paint(0);
