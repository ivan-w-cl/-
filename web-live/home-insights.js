/* 选房工具栏 + 公寓卡片「这栋楼在地图上」：
   - 工具栏：⏱️ 通勤时间圈、🧮 一年总花费、💷 按预算看房，固定在地图上（电脑在底部中间，手机在底部导航上方）。
   - 公寓卡片直接显示详情（不用再点「展开详情」），详情最上面是三格：☀️ 日照、🔇 安静度、⏱️ 通勤；点一格，地图上画出对应内容。
   - 日照：楼的朝向按楼前最近的街道推算（临街一面朝向街道），太阳位置按天文公式算（利物浦，选冬至 / 春秋分 / 夏至 / 今天）；
     算出每一面一天里大约几小时可能有直射阳光。没算周边楼挡光和天气，具体房间朝向要看公寓的楼层平面图。
   - 安静度：按地图上的主路和铁路（OpenStreetMap 数据，和底图同一份）算到最近主路、铁路的直线距离，分三档估算。
     不是噪音测量；正式版可以接英国环境部（DEFRA）公开的道路和铁路噪音地图。
   全部在浏览器里算，不需要联网，也不需要任何授权。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  let G; try { G = { raw, W, mk, GEO: window.GEO, els }; } catch (_) { return; }   // 地图还没准备好
  if (!G.GEO) return;
  const { el, btn, fmt, pick } = BT;
  const T = {
    zh: {
      bar: { commute: '⏱️ 通勤时间圈', cost: '🧮 一年总花费', budget: '💷 按预算看房' }, barShort: { commute: '⏱️ 通勤圈', cost: '🧮 总花费', budget: '💷 按预算' }, barLabel: '选房工具',
      secH: '这栋楼在地图上', secNote: '点一格，地图上会画出来',
      sun: '☀️ 日照', quiet: '🔇 安静度', commute: '⏱️ 通勤',
      sunFace: '临街面朝{f}', sunHours: '冬至约 {w} 小时直射 · 夏至约 {s} 小时', sunUnknown: '楼前街道不明显，朝向算不出来',
      qLevel: { quiet: '相对安静', mid: '中等', loud: '临街一侧可能较吵' }, qSub: '离主路 {r} · 离铁路 {t}',
      cWalk: '步行到利物浦大学 {u} 分钟 · LJMU {j} 分钟', cOpen: '画通勤时间圈',
      dirs: ['北', '东北', '东', '东南', '南', '西南', '西', '西北'],
      days: { winter: '冬至', equinox: '春分 / 秋分', summer: '夏至', today: '今天' },
      sunH: '日照（{d}）', sunrise: '日出 {a} · 日落 {b}', faceFront: '临街面（朝{f}）', faceBack: '背街面（朝{f}）', faceSide: '侧面（朝{f}）', hours: '约 {n} 小时可能有直射阳光',
      sunNotes: ['朝向按楼前最近的街道推算：临街一面朝向街道。具体房间朝哪边，要看公寓的楼层平面图，可以向公寓或 Amber 要。', '太阳位置按天文公式计算；没有算周边楼挡光和阴天。', '地图上的弧线是这一天太阳经过的方向，越靠外太阳越低；☀ 是现在的位置（太阳在地平线以下时不显示）。'],
      qH: '安静度（估算）', qRoad: '离最近的主路', qRail: '离最近的铁路', qNone: '1 公里内没有',
      qNotes: ['按地图上的主路和铁路（OpenStreetMap，和底图同一份数据）的直线距离估算，不是噪音测量。', '临街的房间更容易听到车声；想安静可以问公寓有没有背街一侧的房间。', '正式版可以接英国环境部（DEFRA）公开的道路和铁路噪音地图。'],
      mapClear: '收起地图图层', srcOsm: '地图数据 © OpenStreetMap contributors（ODbL）'
    },
    en: {
      bar: { commute: '⏱️ Commute map', cost: '🧮 Yearly cost', budget: '💷 Search by budget' }, barShort: { commute: '⏱️ Commute', cost: '🧮 Yearly cost', budget: '💷 Budget' }, barLabel: 'Home tools',
      secH: 'This building on the map', secNote: 'Tap a box to draw it on the map',
      sun: '☀️ Sunlight', quiet: '🔇 Quietness', commute: '⏱️ Commute',
      sunFace: 'Street side faces {f}', sunHours: 'About {w} h of direct sun at midwinter · {s} h at midsummer', sunUnknown: 'No clear street in front, so the orientation cannot be worked out',
      qLevel: { quiet: 'Relatively quiet', mid: 'Moderate', loud: 'Street side may be noisy' }, qSub: '{r} from a main road · {t} from a railway',
      cWalk: '{u} min walk to the University of Liverpool · LJMU {j} min', cOpen: 'Draw commute map',
      dirs: ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'],
      days: { winter: 'Midwinter', equinox: 'Equinox', summer: 'Midsummer', today: 'Today' },
      sunH: 'Sunlight ({d})', sunrise: 'Sunrise {a} · sunset {b}', faceFront: 'Street side (faces {f})', faceBack: 'Back (faces {f})', faceSide: 'Side (faces {f})', hours: 'about {n} h of possible direct sun',
      sunNotes: ['Orientation is worked out from the nearest street: the street side faces the street. Which way a particular room faces depends on the floor plan; ask the property or Amber.', 'Sun positions are calculated astronomically; shading from nearby buildings and cloud are not included.', 'The arc on the map shows the sun’s direction through the day; the further out, the lower the sun. ☀ marks where it is now (not shown when it has set).'],
      qH: 'Quietness (estimate)', qRoad: 'Nearest main road', qRail: 'Nearest railway', qNone: 'none within 1 km',
      qNotes: ['Estimated from straight-line distances to main roads and railways on the map (OpenStreetMap, the same data as the base map); it is not a noise measurement.', 'Rooms on the street side hear more traffic; for a quieter room, ask whether the property has rooms at the back.', 'The live version can use the road and rail noise maps published by Defra.'],
      mapClear: 'Hide map layer', srcOsm: 'Map data © OpenStreetMap contributors (ODbL)'
    }
  };
  const k = () => pick(T), zh = () => BT.lang() === 'zh';
  const LAT = 53.4084, LNG = -2.9916;   // 利物浦
  const UNIT = 10;   // 底图坐标 1 单位 ≈ 10 米

  /* ---------- 底图线段（主路、次要道路、铁路），只解析一次 ---------- */
  const parse = list => (list || []).flatMap(d => {
    const pts = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number), segs = [];
    for (let i = 0; i + 3 < pts.length; i += 2) segs.push([pts[i], pts[i + 1], pts[i + 2], pts[i + 3]]);
    return segs;
  });
  let SEG = null;
  const segs = () => SEG || (SEG = { major: parse(G.GEO.major), minor: parse(G.GEO.minor), rail: parse(G.GEO.rail) });
  function nearest(p, list) {
    let best = null;
    for (const [x1, y1, x2, y2] of list) {
      const dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((p[0] - x1) * dx + (p[1] - y1) * dy) / L)) : 0;
      const qx = x1 + t * dx, qy = y1 + t * dy, d = Math.hypot(p[0] - qx, p[1] - qy);
      if (!best || d < best.d) best = { d, q: [qx, qy], seg: [x1, y1, x2, y2] };
    }
    return best;
  }
  const bearing = (a, b) => (Math.atan2(b[0] - a[0], -(b[1] - a[1])) * 180 / Math.PI + 360) % 360;   // 底图 x 朝东、y 朝南
  const dirName = deg => k().dirs[Math.round(deg / 45) % 8];
  const meters = u => Math.round(u * UNIT / 5) * 5;
  const mTxt = m => m >= 1000 ? (m / 1000).toFixed(1) + (zh() ? ' 公里' : ' km') : m + (zh() ? ' 米' : ' m');

  /* ---------- 太阳位置（天文近似公式，误差约 1°） ---------- */
  const rad = Math.PI / 180, e = 23.4397 * rad;
  function sunPos(date, lat = LAT, lng = LNG) {
    const d = date.getTime() / 864e5 + 2440587.5 - 2451545, M = rad * (357.5291 + 0.98560028 * d);
    const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)), Lm = M + C + rad * 102.9372 + Math.PI;
    const dec = Math.asin(Math.sin(e) * Math.sin(Lm)), ra = Math.atan2(Math.sin(Lm) * Math.cos(e), Math.cos(Lm));
    const H = rad * (280.16 + 360.9856235 * d) - rad * -lng - ra, phi = rad * lat;
    const alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
    const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)) / rad + 180;   // 从正北顺时针
    return { alt: alt / rad, az: (az + 360) % 360 };
  }
  const dayOf = which => {
    const y = new Date().getFullYear(), md = { winter: [11, 21], equinox: [2, 20], summer: [5, 21] }[which];
    const base = md ? new Date(Date.UTC(y, md[0], md[1])) : new Date(); base.setUTCHours(0, 0, 0, 0); return base;
  };
  /* 一天的太阳轨迹（每 10 分钟），以及每个朝向大约几小时有直射阳光（太阳在地平线上且在这面墙前方 ±90° 内） */
  function sunDay(which) {
    const d0 = dayOf(which), pts = [];
    for (let m = 0; m < 1440; m += 5) { const t = new Date(d0.getTime() + m * 6e4), s = sunPos(t); pts.push({ t, ...s }); }
    const up = pts.filter(p => p.alt > 0), vis = pts.filter(p => p.alt > -0.833);   // 日出日落按太阳上缘和大气折射（-0.833°）
    return { pts, up, rise: vis[0] && vis[0].t, set: vis.length && vis[vis.length - 1].t };
  }
  const hoursFacing = (day, face) => Math.round(day.up.filter(p => Math.abs(((p.az - face + 540) % 360) - 180) < 90).length * 5 / 60 * 2) / 2;   // 按半小时取整
  const hhmm = t => t ? t.toLocaleTimeString(zh() ? 'zh-CN' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }) : '—';

  /* ---------- 每栋楼的结果 ---------- */
  const cache = new Map();
  function insight(h) {
    if (cache.has(h.id)) return cache.get(h.id);
    const p = G.raw(h.lat, h.lng), S = segs();
    const street = [nearest(p, S.major), nearest(p, S.minor)].filter(Boolean).sort((a, b) => a.d - b.d)[0];
    const front = street && street.d * UNIT <= 80 && street.d > 0.05 ? bearing(p, street.q) : null;
    const road = nearest(p, S.major), rail = nearest(p, S.rail);
    const dRoad = road && road.d * UNIT <= 1000 ? meters(road.d) : null, dRail = rail && rail.d * UNIT <= 1000 ? meters(rail.d) : null;
    const level = (dRoad != null && dRoad < 25) || (dRail != null && dRail < 60) ? 'loud' : (dRoad != null && dRoad < 80) || (dRail != null && dRail < 150) ? 'mid' : 'quiet';
    const r = { p, front, street, road, rail, dRoad, dRail, level };
    if (front != null) { const w = sunDay('winter'), s = sunDay('summer'); r.best = [0, 90, 180, 270].map(o => (front + o) % 360).map(f => ({ f, w: hoursFacing(w, f), s: hoursFacing(s, f) })).sort((a, b) => b.w - a.w)[0]; r.frontW = hoursFacing(w, front); r.frontS = hoursFacing(s, front); }
    cache.set(h.id, r); return r;
  }

  /* ---------- 地图图层 ---------- */
  const over = document.getElementById('over'), homesG = document.getElementById('homes');
  let layer = null, layerKind = null, layerHome = null, sunWhich = 'winter';
  function clearLayer() { document.body.classList.remove('hi-map-on'); if (layer) layer.remove(); layer = null; layerKind = null; layerHome = null; document.querySelectorAll('.hi-tile[aria-pressed="true"]').forEach(b => b.setAttribute('aria-pressed', 'false')); }
  const m = (tag, at, parent, text) => { const n = G.mk(tag, at, parent); if (text != null) n.textContent = text; return n; };
  function drawLayer(kind, h) {
    if (layer) layer.remove();
    layer = G.mk('g', { class: 'hi-layer', 'pointer-events': 'none' }, over);   // 画在公寓图标上面，免得被挡住
    document.body.classList.add('hi-map-on');
    layerKind = kind; layerHome = h.id;
    const r = insight(h), c = G.W(r.p[0], r.p[1]), at = (deg, R) => [c[0] + Math.sin(deg * rad) * R, c[1] - Math.cos(deg * rad) * R];
    if (kind === 'sun') {
      const R = 92, day = sunDay(sunWhich);
      m('circle', { cx: c[0], cy: c[1], r: R, class: 'hi-ring' }, layer);
      ['N', 'E', 'S', 'W'].forEach((t, i) => { const q = at(i * 90, R + 11); m('text', { x: q[0], y: q[1] + 4, class: 'hi-compass' }, layer, t); });
      if (r.front != null) {   // 楼：一条垂直于朝向的粗线，临街一面画箭头
        const a = at(r.front + 90, 16), b = at(r.front - 90, 16); m('path', { d: `M${a}L${b}`, class: 'hi-bldg' }, layer);
        const f1 = at(r.front, 12), f2 = at(r.front, 40); m('path', { d: `M${f1}L${f2}`, class: 'hi-face' }, layer);
        const tl = at(r.front, 52); m('text', { x: tl[0], y: tl[1] + 4, class: 'hi-lbl' }, layer, zh() ? '临街' : 'street');
      }
      const pts = day.up.map(p => at(p.az, R * (1 - p.alt / 90)));
      if (pts.length > 1) m('path', { d: 'M' + pts.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L'), class: 'hi-arc' }, layer);
      day.up.filter(p => p.t.getUTCMinutes() === 0 && p.t.getUTCHours() % 3 === 0).forEach(p => { const q = at(p.az, R * (1 - p.alt / 90)); m('circle', { cx: q[0], cy: q[1], r: 3, class: 'hi-dot' }, layer); m('text', { x: q[0], y: q[1] - 6, class: 'hi-tick' }, layer, hhmm(p.t)); });
      const now = sunPos(new Date());
      if (sunWhich === 'today' && now.alt > 0) { const q = at(now.az, R * (1 - now.alt / 90)); m('text', { x: q[0], y: q[1] + 6, class: 'hi-sun' }, layer, '☀'); }
    } else {
      const lines = [[r.road, 'hi-road', zh() ? '主路' : 'main road', r.dRoad], [r.rail, 'hi-rail', zh() ? '铁路' : 'railway', r.dRail]];
      lines.forEach(([n, cls, lab, d]) => {
        if (!n || d == null) return;
        const [x1, y1, x2, y2] = n.seg, s1 = G.W(x1, y1), s2 = G.W(x2, y2), q = G.W(n.q[0], n.q[1]);
        m('path', { d: `M${s1}L${s2}`, class: cls }, layer);
        m('path', { d: `M${c}L${q}`, class: 'hi-link' }, layer);
        m('text', { x: (c[0] + q[0]) / 2, y: (c[1] + q[1]) / 2 - 5, class: 'hi-lbl' }, layer, `${lab} ${mTxt(d)}`);
      });
      m('circle', { cx: c[0], cy: c[1], r: 25 / 1, class: 'hi-near' }, layer);
    }
  }

  /* 画好图层后把这栋楼移到看得见的地方：手机上放在卡片上方的地图里，电脑上把卡片挪到图层旁边 */
  const RING = 115;   // 图层半径（地图单位，含方位字母）
  function reveal(h) {
    try {
      const cardEl = document.getElementById('card'), sheet = cardEl && cardEl.classList.contains('sheet') && !cardEl.hidden;
      const top = 64, bottom = sheet ? cardEl.getBoundingClientRect().top : viewH - 70, visH = Math.max(140, bottom - top);
      const want = Math.min(visH / 2 - 12, sheet ? 150 : 110) / RING;   // 每个地图单位多少屏幕像素
      z = Math.max(zmin(), Math.min(zmax(), want / fitK));
      tx = viewW / 2 - h.p[0] * fitK * z; ty = top + visH / 2 - h.p[1] * fitK * z;
      if (!sheet && cardEl) {   // 电脑：图层放在公寓列表右边，卡片紧挨着图层右侧
        const hp = document.getElementById('homesPanel'), lx = hp && !hp.classList.contains('collapsed') ? hp.getBoundingClientRect().right : 0;
        const ring = RING * fitK * z, cx = lx + ring + 36, cw = cardEl.offsetWidth, mb = document.getElementById('mapbox'), ox = mb ? mb.getBoundingClientRect().left : 0;
        tx = cx - ox - h.p[0] * fitK * z;
        let left = cx + ring + 14; if (left + cw > innerWidth - 12) left = Math.max(12, innerWidth - 12 - cw);
        render(true); cardEl.style.left = left + 'px'; setTimeout(dodgeCard, 50); return;
      }
      render(true);
    } catch (_) { /* 地图接口不可用时不移动 */ }
  }

  /* 地图停下来后底图会把卡片放回图标旁边（place）；图层打开时改成放在图层右侧 */
  function dodgeCard() {
    try {
      const cardEl = document.getElementById('card'); if (!layer || !cardEl || cardEl.classList.contains('sheet')) return;
      const pin = G.els.get(layerHome); if (!pin) return;
      const r = pin.getBoundingClientRect(), ring = RING * fitK * z, cw = cardEl.offsetWidth, cx = r.left + r.width / 2;
      let left = cx + ring + 14; if (left + cw > innerWidth - 12) left = cx - ring - 14 - cw; if (left < 12) left = Math.max(12, innerWidth - 12 - cw);
      cardEl.style.left = left + 'px';
    } catch (_) { /* 忽略 */ }
  }
  if (typeof window.place === 'function') { const place0 = window.place; window.place = function () { place0.apply(this, arguments); dodgeCard(); }; }

  /* ---------- 公寓卡片：详情最上面的三格 + 展开的说明 ---------- */
  const cardBody = document.getElementById('cardBody');
  function decorate() {
    const h = BT.homeNow(), details = cardBody && cardBody.querySelector('#propertyDetails');
    if (!h || !details || details.querySelector('.hi-sec')) return;
    if (layerHome && layerHome !== h.id) clearLayer();
    const K = k(), r = insight(h), sec = el('section', 'hi-sec'), row = el('div', 'hi-row'), more = el('div', 'hi-more');
    sec.append(el('h4', '', K.secH), el('small', 'bt-note', K.secNote));
    const tile = (id, title, main, sub) => { const b = btn('hi-tile'); b.dataset.id = id; b.setAttribute('aria-pressed', String(layerKind === id && layerHome === h.id)); b.append(el('b', '', title), el('span', 'hi-main', main), el('small', '', sub)); row.append(b); return b; };
    tile('sun', K.sun, r.front != null ? fmt(K.sunFace, { f: dirName(r.front) }) : K.sunUnknown, r.front != null ? fmt(K.sunHours, { w: r.frontW, s: r.frontS }) : '');
    tile('quiet', K.quiet, K.qLevel[r.level], fmt(K.qSub, { r: r.dRoad != null ? mTxt(r.dRoad) : K.qNone, t: r.dRail != null ? mTxt(r.dRail) : K.qNone }));
    tile('commute', K.commute, fmt(K.cWalk, { u: h.uol, j: h.ljmu }), K.cOpen);
    row.addEventListener('click', ev => {
      const b = ev.target.closest('.hi-tile'); if (!b) return; ev.stopPropagation();
      const id = b.dataset.id;
      if (id === 'commute') { if (window.Commute) window.Commute.open(false); return; }
      const on = b.getAttribute('aria-pressed') === 'true';
      row.querySelectorAll('.hi-tile').forEach(x => x.setAttribute('aria-pressed', 'false'));
      if (on) { clearLayer(); more.replaceChildren(); return; }
      b.setAttribute('aria-pressed', 'true'); drawLayer(id, h); explain(id, h, more); reveal(h);
    });
    sec.append(row, more);
    details.prepend(sec);
    if (layerKind && layerHome === h.id) explain(layerKind, h, more);
  }
  function explain(id, h, box) {
    const K = k(), r = insight(h); box.replaceChildren();
    if (id === 'sun') {
      const chips = el('div', 'br-chips');
      Object.entries(K.days).forEach(([v, t]) => { const c = btn('bt-chipbtn' + (sunWhich === v ? ' on' : ''), t); c.setAttribute('aria-pressed', String(sunWhich === v)); c.addEventListener('click', ev => { ev.stopPropagation(); sunWhich = v; drawLayer('sun', h); explain('sun', h, box); }); chips.append(c); });
      const day = sunDay(sunWhich);
      box.append(el('b', 'hi-h', fmt(K.sunH, { d: K.days[sunWhich] })), chips, el('p', 'bt-note', fmt(K.sunrise, { a: hhmm(day.rise), b: hhmm(day.set) })));
      if (r.front != null) {
        const dl = el('dl', 'hi-dl');
        [[K.faceFront, r.front], [K.faceBack, (r.front + 180) % 360], [K.faceSide, (r.front + 90) % 360], [K.faceSide, (r.front + 270) % 360]].forEach(([lab, f]) => dl.append(el('dt', '', fmt(lab, { f: dirName(f) })), el('dd', '', fmt(K.hours, { n: hoursFacing(day, f) }))));
        box.append(dl);
      } else box.append(el('p', 'bt-note', K.sunUnknown));
      const ul = el('ul', 'hi-notes'); K.sunNotes.forEach(n => ul.append(el('li', '', n))); box.append(ul);
    } else {
      const dl = el('dl', 'hi-dl');
      dl.append(el('dt', '', K.qRoad), el('dd', '', r.dRoad != null ? mTxt(r.dRoad) : K.qNone), el('dt', '', K.qRail), el('dd', '', r.dRail != null ? mTxt(r.dRail) : K.qNone));
      box.append(el('b', 'hi-h', K.qH + ' · ' + K.qLevel[r.level]), dl);
      const ul = el('ul', 'hi-notes'); K.qNotes.forEach(n => ul.append(el('li', '', n))); box.append(ul);
    }
    const x = btn('bt-link', K.mapClear); x.addEventListener('click', ev => { ev.stopPropagation(); clearLayer(); box.replaceChildren(); }); box.append(x, el('small', 'bt-note hi-src', K.srcOsm));
  }
  if (cardBody) new MutationObserver(decorate).observe(cardBody, { childList: true });
  const card = document.getElementById('card');
  if (card) new MutationObserver(() => { if (card.hidden) clearLayer(); }).observe(card, { attributes: true, attributeFilter: ['hidden'] });

  /* ---------- 选房工具栏 ---------- */
  const bar = el('nav', 'hi-bar'); bar.setAttribute('aria-label', k().barLabel);
  const tools = {
    commute: () => window.Commute && window.Commute.open(false),
    cost: () => window.CostCalc && window.CostCalc.open(BT.homeNow()),
    budget: () => window.QuoteCheck && window.QuoteCheck.open(null, null, 'budget')
  };
  function drawBar() {
    const K = k(); bar.replaceChildren(el('span', 'hi-bar-h', K.barLabel));
    Object.keys(tools).forEach(id => { const b = btn('hi-bar-b'); b.append(el('span', 'hi-long', K.bar[id]), el('span', 'hi-short', K.barShort[id])); b.addEventListener('click', ev => { ev.stopPropagation(); tools[id](); }); bar.append(b); });
  }
  drawBar(); document.body.append(bar); document.body.classList.add('hi-has-bar');
  new MutationObserver(drawBar).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  window.HomeInsights = { insight, sunPos, sunDay, hoursFacing, clearLayer };
})();
