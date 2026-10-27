/* 选房工具栏 + 公寓卡片「这栋楼在地图上」：
   - 工具栏：⏱️ 通勤时间圈、🧮 一年总花费、💷 按预算看房，再加两个地图筛选：☀️ 冬季日照、🔇 安静（不符合的楼在地图上变淡，
     可以和通勤时间圈、按预算看房一起用）。电脑在公寓列表右边顶部，手机在底部导航上方。
   - 公寓卡片直接显示详情，最上面三格：☀️ 日照、🔇 安静度、⏱️ 通勤；点一格，地图上画出对应内容。
   - 日照：「一天在这栋楼」时间滑块——选季节、拖时间（或点 ▶ 播放），地图上太阳沿轨迹移动，楼的每一面被照亮或变暗，卡片实时写出哪几面有阳光。
     楼的朝向按可靠程度依次取：① OpenStreetMap 楼体轮廓（服务器 /api/local/building 或 local-snapshots/building/ 快照，每一面外墙的真实朝向和长度）
     ② 团队核对的朝向（orientation-overrides.json）③ 按楼前最近的街道推算（临街一面朝向街道）。都没有就写「朝向未知」。
     太阳位置按天文公式算（利物浦）；没算周边楼挡光和天气；具体房间朝向要看楼层平面图。
   - 安静度：到最近主路、铁路的直线距离（底图里的 OpenStreetMap 数据），分三档估算，不是噪音测量。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  let G; try { G = { raw, W, mk, GEO: window.GEO, els, HOMES, PLACES, BUILDINGS, ZONES, SUBJECTS, nameOf, zoneName, facultyOf, subjName, CENTRE }; } catch (_) { return; }   // 地图还没准备好
  if (!G.GEO) return;
  const { el, btn, fmt, pick } = BT;
  const T = {
    zh: {
      bar: { commute: '⏱️ 通勤时间圈', cost: '🧮 一年总花费', budget: '💷 按预算看房' }, barShort: { commute: '⏱️ 通勤圈', cost: '🧮 总花费', budget: '💷 按预算' }, barLabel: '选房工具',
      fSun: '☀️ 冬季日照', fQuiet: '🔇 安静', fH: '地图筛选', dragTip: '按住拖动；拖到屏幕边上收成小箭头', tabTip: '点开选房工具', fSunRule: '冬至主立面约 4 小时以上直射', fQuietRule: '离主路 50 米以上、离铁路 150 米以上',
      fStatus: '{rules}：{n} 栋符合', fUnknown: '{n} 栋朝向未知，先变淡', fClear: '清除筛选', fLoading: '正在读取楼体轮廓…',
      secH: '这栋楼在地图上', backToHome: '← 房源详情', close: '关闭', secNote: '点一格，地图上会画出来',
      sun: '☀️ 日照', quiet: '🔇 安静度', commute: '⏱️ 通勤',
      sunFace: '临街面朝{f}', sunMain: '主立面朝{f}', sunHours: '冬至约 {w} 小时直射 · 夏至约 {s} 小时', sunUnknown: '朝向未知',
      qLevel: { quiet: '相对安静', mid: '中等', loud: '临街一侧可能较吵' }, qSub: '离主路 {r} · 离铁路 {t}',
      cWalk: '步行到利物浦大学 {u} 分钟', cWalkSubj: '到{s}的楼 {n} 分钟', cOpen: '点开看到各专业楼要多久',
      cH: '从这栋楼出发', cSub: '选一个地方，地图上画出示意路线（虚线）', cPick: '去哪里', cGroups: { station: '附近的车站', city: '市中心' }, cZoneH: '利物浦大学 · {z}（{f}）', cMine: '我的专业', cSubjB: '{s} · {b}', cCentre: '市中心（Liverpool ONE 一带）',
      cWalkN: '步行 {n} 分钟', cBusN: '公交约 {n} 分钟', cDist: '约 {d}', cOnMap: '步行约 {n} 分钟', cCircle: '画通勤时间圈 ↗',
      cNote: '时间是估算：步行按直线距离 × 1.3、每分钟 80 米；公交按步行到站、等车和平均车速估算（早上 9 点到）。虚线只表示方向，不是实际路线。',
      dirs: ['北', '东北', '东', '东南', '南', '西南', '西', '西北'],
      days: { winter: '冬至', equinox: '春分 / 秋分', summer: '夏至', today: '今天' },
      sunH: '一天在这栋楼', sunrise: '日出 {a} · 日落 {b}', play: '▶ 播放', pause: '⏸ 暂停', slider: '拖动看一天里的太阳',
      now: '{t} · 太阳在{d}方，高度 {a}°', nightNow: '{t} · 太阳在地平线以下', lit: '☀ 有阳光', shade: '背光', streetTag: '临街',
      face: '朝{f}的外墙', faceLen: '朝{f}的外墙（约 {m} 米）', dayH: '这一天约 {n} 小时',
      src: { osm: '朝向来源：OpenStreetMap 楼体轮廓', team: '朝向来源：团队核对', street: '朝向来源：按楼前最近的街道推算（临街一面朝向街道）' },
      unknownWhy: '底图里这栋楼门前的小街道没有收录，楼体轮廓也还没读到，所以暂时算不出朝向。接通 OpenStreetMap 或团队补上朝向后会自动显示。',
      sunNotes: ['太阳位置按天文公式计算；没有算周边楼挡光和阴天。', '具体房间朝哪边要看公寓的楼层平面图，可以向公寓或 Amber 要。', '地图上的弧线是这一天太阳经过的方向，越靠外太阳越低。'],
      qH: '安静度（估算）', qRoad: '离最近的主路', qRail: '离最近的铁路', qNone: '1 公里内没有',
      qNotes: ['按地图上的主路和铁路（OpenStreetMap，和底图同一份数据）的直线距离估算，不是噪音测量。', '临街的房间更容易听到车声；想安静可以问公寓有没有背街一侧的房间。', '正式版可以接英国环境部（DEFRA）公开的道路和铁路噪音地图。'],
      mapClear: '收起地图图层', srcOsm: '地图数据 © OpenStreetMap contributors（ODbL）'
    },
    en: {
      bar: { commute: '⏱️ Commute map', cost: '🧮 Yearly cost', budget: '💷 Search by budget' }, barShort: { commute: '⏱️ Commute', cost: '🧮 Yearly cost', budget: '💷 Budget' }, barLabel: 'Home tools',
      fSun: '☀️ Winter sun', fQuiet: '🔇 Quiet', fH: 'Map filters', dragTip: 'Drag to move; drop at the screen edge to tuck it away', tabTip: 'Show home tools', fSunRule: 'main facade gets about 4+ h of direct sun at midwinter', fQuietRule: '50 m+ from a main road and 150 m+ from a railway',
      fStatus: '{rules}: {n} homes match', fUnknown: '{n} with unknown orientation are dimmed', fClear: 'Clear filters', fLoading: 'Loading building outlines…',
      secH: 'This building on the map', backToHome: '← Home details', close: 'Close', secNote: 'Tap a box to draw it on the map',
      sun: '☀️ Sunlight', quiet: '🔇 Quietness', commute: '⏱️ Commute',
      sunFace: 'Street side faces {f}', sunMain: 'Main facade faces {f}', sunHours: 'About {w} h of direct sun at midwinter · {s} h at midsummer', sunUnknown: 'Orientation unknown',
      qLevel: { quiet: 'Relatively quiet', mid: 'Moderate', loud: 'Street side may be noisy' }, qSub: '{r} from a main road · {t} from a railway',
      cWalk: '{u} min walk to the University of Liverpool', cWalkSubj: '{n} min to the {s} buildings', cOpen: 'Tap for times to each subject’s buildings',
      cH: 'From this building', cSub: 'Pick a place to draw a rough route (dashed) on the map', cPick: 'Where to', cGroups: { station: 'Nearby stations', city: 'City centre' }, cZoneH: 'University of Liverpool · {z} ({f})', cMine: 'My subject', cSubjB: '{s} · {b}', cCentre: 'City centre (around Liverpool ONE)',
      cWalkN: '{n} min walk', cBusN: 'bus about {n} min', cDist: 'about {d}', cOnMap: 'about {n} min walk', cCircle: 'Draw commute map ↗',
      cNote: 'Times are estimates: walking uses straight-line distance × 1.3 at 80 m a minute; buses include walking to the stop, waiting and an average speed (arriving at 9am). The dashed line shows direction only, not the actual route.',
      dirs: ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'],
      days: { winter: 'Midwinter', equinox: 'Equinox', summer: 'Midsummer', today: 'Today' },
      sunH: 'A day at this building', sunrise: 'Sunrise {a} · sunset {b}', play: '▶ Play', pause: '⏸ Pause', slider: 'Drag to follow the sun through the day',
      now: '{t} · sun in the {d}, {a}° up', nightNow: '{t} · the sun is below the horizon', lit: '☀ in sun', shade: 'in shade', streetTag: 'street',
      face: 'Wall facing {f}', faceLen: 'Wall facing {f} (about {m} m)', dayH: 'about {n} h this day',
      src: { osm: 'Orientation from OpenStreetMap building outline', team: 'Orientation checked by the team', street: 'Orientation estimated from the nearest street (the street side faces the street)' },
      unknownWhy: 'The small street in front of this building is not in the base map and its building outline has not loaded yet, so the orientation cannot be worked out. It will appear once OpenStreetMap is connected or the team adds it.',
      sunNotes: ['Sun positions are calculated astronomically; shading from nearby buildings and cloud are not included.', 'Which way a particular room faces depends on the floor plan; ask the property or Amber.', 'The arc on the map shows the sun’s direction through the day; the further out, the lower the sun.'],
      qH: 'Quietness (estimate)', qRoad: 'Nearest main road', qRail: 'Nearest railway', qNone: 'none within 1 km',
      qNotes: ['Estimated from straight-line distances to main roads and railways on the map (OpenStreetMap, the same data as the base map); it is not a noise measurement.', 'Rooms on the street side hear more traffic; for a quieter room, ask whether the property has rooms at the back.', 'The live version can use the road and rail noise maps published by Defra.'],
      mapClear: 'Hide map layer', srcOsm: 'Map data © OpenStreetMap contributors (ODbL)'
    }
  };
  const k = () => pick(T), zh = () => BT.lang() === 'zh';
  const LAT = 53.4084, LNG = -2.9916;   // 利物浦
  const UNIT = 10;   // 底图坐标 1 单位 ≈ 10 米
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  const angDiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
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
  /* 利物浦当地时间（冬天 = UTC，夏令时 +1）：某天 0 点 */
  const londonOffset = d => { const f = z => new Date(d.toLocaleString('en-US', { timeZone: z })); return Math.round((f('Europe/London') - f('UTC')) / 6e4); };
  const dayOf = which => {
    const now = new Date(), y = now.getFullYear(), md = { winter: [11, 21], equinox: [2, 20], summer: [5, 21] }[which];
    const noon = md ? new Date(Date.UTC(y, md[0], md[1], 12)) : new Date(Date.UTC(y, now.getMonth(), now.getDate(), 12));
    return new Date(noon.getTime() - 12 * 36e5 - londonOffset(noon) * 6e4);
  };
  const dayCache = new Map();
  function sunDay(which) {
    const key = which + ':' + new Date().toDateString(); if (dayCache.has(key)) return dayCache.get(key);
    const d0 = dayOf(which), pts = [];
    for (let m = 0; m < 1440; m += 5) { const t = new Date(d0.getTime() + m * 6e4), s = sunPos(t); pts.push({ m, t, ...s }); }
    const up = pts.filter(p => p.alt > 0), vis = pts.filter(p => p.alt > -0.833);   // 日出日落按太阳上缘和大气折射（-0.833°）
    const r = { d0, pts, up, rise: vis[0] && vis[0].t, set: vis.length && vis[vis.length - 1].t }; dayCache.set(key, r); return r;
  }
  const lit = (s, face) => s.alt > 0 && angDiff(s.az, face) < 90;
  const hoursFacing = (day, face) => Math.round(day.up.filter(p => angDiff(p.az, face) < 90).length * 5 / 60 * 2) / 2;   // 按半小时取整
  const hhmm = t => t ? t.toLocaleTimeString(zh() ? 'zh-CN' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }) : '—';

  /* ---------- 朝向数据：OpenStreetMap 楼体轮廓 → 团队核对 → 街道推算 ---------- */
  const OSM = new Map(), osmTried = new Set(); let TEAM = {};
  const getJson = async u => { const r = await fetch(u, { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); return r.json(); };
  async function loadBuilding(h) {
    if (OSM.has(h.id) || osmTried.has(h.id) || !/^https?:$/.test(location.protocol)) return OSM.get(h.id);
    osmTried.add(h.id);
    let j = null;
    try { j = await getJson(`./api/local/building?homeId=${encodeURIComponent(h.id)}`); } catch (_) { /* 没有服务器 */ }
    if (!j || !j.found || !(j.faces || []).length) { try { const s = await getJson(`./local-snapshots/building/${encodeURIComponent(h.id)}.json`); if (s && s.found) j = s; } catch (_) { /* 没有快照 */ } }
    if (j && j.found && (j.faces || []).length) { OSM.set(h.id, j); cache.delete(h.id); return j; }
  }
  fetch('./orientation-overrides.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(j => {
    if (!j || !Array.isArray(j.homes)) return;
    j.homes.forEach(x => { if (x && x.homeId && Number.isFinite(x.front)) TEAM[x.homeId] = x; });
    cache.clear(); refreshCard(); applyFilters();
  }).catch(() => { /* 没有核对表 */ });

  const cache = new Map();
  function insight(h) {
    if (cache.has(h.id)) return cache.get(h.id);
    const p = G.raw(h.lat, h.lng), S = segs();
    const street = [nearest(p, S.major), nearest(p, S.minor)].filter(Boolean).sort((a, b) => a.d - b.d)[0];
    const streetB = street && street.d * UNIT <= 80 && street.d > 0.05 ? bearing(p, street.q) : null;
    const road = nearest(p, S.major), rail = nearest(p, S.rail);
    const dRoad = road && road.d * UNIT <= 1000 ? meters(road.d) : null, dRail = rail && rail.d * UNIT <= 1000 ? meters(rail.d) : null;
    const level = (dRoad != null && dRoad < 25) || (dRail != null && dRail < 60) ? 'loud' : (dRoad != null && dRoad < 80) || (dRail != null && dRail < 150) ? 'mid' : 'quiet';
    let source = null, faces = [];
    const osm = OSM.get(h.id), team = TEAM[h.id];
    if (osm) { source = 'osm'; faces = osm.faces.map(f => ({ f: f.bearing, len: f.lengthM })); }
    else if (team) { source = 'team'; faces = [0, 90, 180, 270].map(o => ({ f: (team.front + o) % 360, len: null })); }
    else if (streetB != null) { source = 'street'; faces = [0, 90, 180, 270].map(o => ({ f: (streetB + o) % 360, len: null })); }
    const streetFaceB = source === 'team' ? team.front : streetB;
    if (faces.length && streetFaceB != null) { const sf = faces.reduce((a, f) => angDiff(f.f, streetFaceB) < angDiff(a.f, streetFaceB) ? f : a); if (angDiff(sf.f, streetFaceB) <= 45) sf.street = true; }
    const w = sunDay('winter'), s = sunDay('summer');
    faces.forEach(f => { f.w = hoursFacing(w, f.f); f.s = hoursFacing(s, f.f); });
    const main = faces.find(f => f.street) || faces.slice().sort((a, b) => (b.len || 0) - (a.len || 0))[0] || null;
    const r = { p, street, road, rail, dRoad, dRail, level, source, faces, main, levels: osm && osm.levels };
    cache.set(h.id, r); return r;
  }

  /* ---------- 通勤：到各处的时间（和通勤时间圈同一套估算） ---------- */
  const tmin = (r, d, mode) => {
    if (window.Commute && window.Commute.minutes) return window.Commute.minutes(r, d, mode, '09:00');
    const m = Math.hypot(r[0] - d[0], r[1] - d[1]) * UNIT * 1.3, walk = Math.round(m / 80);
    if (mode === 'walk') return { t: walk };
    const bus = Math.round(4 + 5 + 3 + m / 300); return walk <= bus ? { t: walk, walk: true } : { t: bus };
  };
  let mySubject = () => { try { return subject; } catch (_) { return null; } };   // 地图上「我的专业」选的专业
  function commuteDests(h) {
    const K = k(), p0 = insight(h).p, out = [], dist = r => Math.hypot(p0[0] - r[0], p0[1] - r[1]), mine = mySubject();
    G.SUBJECTS.forEach(sj => {   // 每个专业取离这栋楼最近的那栋教学楼
      const bs = G.BUILDINGS.filter(b => (sj.keys || []).includes(b.key)); if (!bs.length) return;
      const b = bs.reduce((a, x) => dist(x.r) < dist(a.r) ? x : a);
      out.push({ id: 's:' + sj.id, group: 'zone:' + sj.zone, zone: sj.zone, name: fmt(K.cSubjB, { s: G.subjName(sj), b: b.name }), r: b.r, mine: !!(mine && mine.id === sj.id) });
    });
    G.PLACES.filter(p => p.t === 'rail' || p.t === 'bus').map(p => ({ id: 'p:' + p.name, group: 'station', name: G.nameOf(p), r: G.raw(p.lat, p.lng) })).sort((a, b) => dist(a.r) - dist(b.r)).slice(0, 3).forEach(x => out.push(x));
    out.push({ id: 'centre', group: 'city', name: K.cCentre, r: G.CENTRE });
    out.forEach(d => { d.m = Math.round(dist(d.r) * UNIT * 1.3 / 10) * 10; d.walk = tmin(p0, d.r, 'walk').t; const b = tmin(p0, d.r, 'bus'); d.bus = b.walk ? null : b.t; });
    return out.sort((a, b) => (b.mine - a.mine) || (a.group === b.group ? a.walk - b.walk : 0));
  }
  let cDest = null;

  /* ---------- 地图图层 ---------- */
  const over = document.getElementById('over');
  let layer = null, dyn = null, layerKind = null, layerHome = null, sunWhich = 'winter', sunMin = 12 * 60, playing = 0;
  function clearLayer() {
    stopPlay(); document.body.classList.remove('hi-map-on'); if (layer) layer.remove(); layer = dyn = null; layerKind = null; layerHome = null;
    document.querySelectorAll('.hi-tile[aria-pressed="true"]').forEach(b => b.setAttribute('aria-pressed', 'false'));
  }
  const m = (tag, at, parent, text) => { const n = G.mk(tag, at, parent); if (text != null) n.textContent = text; return n; };
  const R0 = 92;
  function geom(h) { const r = insight(h), c = G.W(r.p[0], r.p[1]); return { r, c, at: (deg, R) => [c[0] + Math.sin(deg * rad) * R, c[1] - Math.cos(deg * rad) * R] }; }
  function drawLayer(kind, h) {
    if (layer) layer.remove();
    layer = G.mk('g', { class: 'hi-layer', 'pointer-events': 'none' }, over);   // 画在公寓图标上面，免得被挡住
    document.body.classList.add('hi-map-on');
    layerKind = kind; layerHome = h.id; scaleLayer();
    const { r, c, at } = geom(h);
    if (kind === 'sun') {
      const day = sunDay(sunWhich);
      m('circle', { cx: c[0], cy: c[1], r: R0, class: 'hi-ring' }, layer);
      ['N', 'E', 'S', 'W'].forEach((t, i) => { const q = at(i * 90, R0 + 11); m('text', { x: q[0], y: q[1] + 4, class: 'hi-compass' }, layer, t); });
      const pts = day.up.map(p => at(p.az, R0 * (1 - p.alt / 90)));
      if (pts.length > 1) m('path', { d: 'M' + pts.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L'), class: 'hi-arc' }, layer);
      day.up.filter(p => p.m % 180 === 0).forEach(p => { const q = at(p.az, R0 * (1 - p.alt / 90)); m('circle', { cx: q[0], cy: q[1], r: 2.5, class: 'hi-dot' }, layer); m('text', { x: q[0], y: q[1] - 6, class: 'hi-tick' }, layer, hhmm(p.t)); });
      dyn = G.mk('g', {}, layer); drawSunNow(h);
    } else if (kind === 'commute') {
      const ds = commuteDests(h), d = ds.find(x => x.id === cDest) || ds[0]; if (!d) return; cDest = d.id;
      const q = G.W(d.r[0], d.r[1]), mx = (c[0] + q[0]) / 2, my = (c[1] + q[1]) / 2, dx = q[0] - c[0], dy = q[1] - c[1];
      const cx = mx - dy * 0.12, cy = my + dx * 0.12;   // 稍微弯一点的虚线，看得出是示意
      m('path', { d: `M${c[0]} ${c[1]}Q${cx} ${cy} ${q[0]} ${q[1]}`, class: 'hi-route' }, layer);
      m('circle', { cx: q[0], cy: q[1], r: 7, class: 'hi-dest' }, layer);
      m('text', { x: q[0], y: q[1] - 12, class: 'hi-lbl' }, layer, d.name);
      m('text', { x: (mx + cx) / 2, y: (my + cy) / 2 - 4, class: 'hi-lbl hi-mins' }, layer, fmt(k().cOnMap, { n: d.walk }));
    } else {
      const lines = [[r.road, 'hi-road', zh() ? '主路' : 'main road', r.dRoad], [r.rail, 'hi-rail', zh() ? '铁路' : 'railway', r.dRail]];
      lines.forEach(([n, cls, lab, d]) => {
        if (!n || d == null) return;
        const [x1, y1, x2, y2] = n.seg, s1 = G.W(x1, y1), s2 = G.W(x2, y2), q = G.W(n.q[0], n.q[1]);
        m('path', { d: `M${s1}L${s2}`, class: cls }, layer);
        m('path', { d: `M${c}L${q}`, class: 'hi-link' }, layer);
        m('text', { x: (c[0] + q[0]) / 2, y: (c[1] + q[1]) / 2 - 5, class: 'hi-lbl' }, layer, `${lab} ${mTxt(d)}`);
      });
      m('circle', { cx: c[0], cy: c[1], r: 25, class: 'hi-near' }, layer);
    }
  }
  /* 时间滑块对应的那一刻：太阳、照向楼的光线、每一面外墙亮或暗 */
  function sunAt() { const day = sunDay(sunWhich), t = new Date(day.d0.getTime() + sunMin * 6e4); return { t, ...sunPos(t) }; }
  function drawSunNow(h) {
    if (!dyn) return; dyn.replaceChildren();
    const { r, c, at } = geom(h), s = sunAt();
    if (r.faces.length) {   // 楼：以主立面为基准的方块，四条边分别是四面外墙
      const S = 15;
      r.faces.forEach(f => {
        const a = at(f.f - 45, S * Math.SQRT2), b = at(f.f + 45, S * Math.SQRT2), on = lit(s, f.f);
        m('path', { d: `M${a}L${b}`, class: 'hi-wall' + (on ? ' lit' : '') + (f.street ? ' street' : '') }, dyn);
        if (f.street) { const q = at(f.f, S + 13); m('text', { x: q[0], y: q[1] + 4, class: 'hi-lbl' }, dyn, k().streetTag); }
      });
    } else m('circle', { cx: c[0], cy: c[1], r: 8, class: 'hi-unknown' }, dyn);
    if (s.alt > 0) {
      const q = at(s.az, R0 * (1 - s.alt / 90)), q0 = at(s.az, 24);
      m('path', { d: `M${q}L${q0}`, class: 'hi-ray' }, dyn);
      m('circle', { cx: q[0], cy: q[1], r: 9, class: 'hi-sunc' }, dyn);
    }
  }

  /* 画好图层后把这栋楼移到看得见的地方：手机上放在卡片上方的地图里，电脑上图层放在公寓列表右边、卡片挨着图层 */
  const RING = 115;   // 图层半径（地图单位，含方位字母）
  /* 地图上没被面板挡住的那块：手机是卡片上方，平板是右侧面板左边，电脑是公寓列表和浮动卡片之间 */
  function viewRect() {
    const cardEl = document.getElementById('card'), open = cardEl && !cardEl.hidden, narrow = isNarrow();
    const hp = document.getElementById('homesPanel'), lx = !narrow && hp && !hp.classList.contains('collapsed') ? hp.getBoundingClientRect().right + 12 : 12;
    const v = { left: lx, right: viewW - 12, top: 70, bottom: viewH - (narrow ? 76 : 16), mode: 'none' };
    if (!open) return v;
    if (document.body.classList.contains('hi-tablet') || !cardEl.classList.contains('sheet')) { v.right = cardEl.getBoundingClientRect().left - 12; v.mode = 'side'; }
    else if (cardEl.classList.contains('sheet')) { v.left = 12; v.bottom = cardEl.getBoundingClientRect().top - 8; v.mode = 'sheet'; }
    if (v.mode === 'side') {
      if (!rail.hidden) v.right = Math.min(v.right, rail.getBoundingClientRect().left - 12);
      if (!panel.hidden) { const pr = panel.getBoundingClientRect(); if (panel.dataset.pos === 'bottom') v.bottom = Math.min(v.bottom, pr.top - 8); else v.left = Math.max(v.left, pr.right + 12); }
    }
    else if (!panel.hidden) v.bottom = Math.min(v.bottom, panel.getBoundingClientRect().top - 8);
    return v;
  }
  function reveal(h, kind) {
    try {
      dodgeCard();
      const v = viewRect(), cardEl = document.getElementById('card'), visW = Math.max(160, v.right - v.left), visH = Math.max(140, v.bottom - v.top);
      /* 不缩小地图：只有日照的圆圈太小时才放大一点；安静度只平移，保持学生自己选的缩放 */
      if (kind === 'sun') { const want = Math.min(Math.min(visW, visH) / 2 - 12, v.mode === 'float' ? 110 : 150) / RING; z = Math.max(z, Math.min(zmax(), want / fitK)); }
      tx = (v.left + v.right) / 2 - h.p[0] * fitK * z; ty = (v.top + v.bottom) / 2 - h.p[1] * fitK * z;
      render(true);
    } catch (_) { /* 地图接口不可用时不移动 */ }
  }
  function fitRoute(h, d) {
    try {
      dodgeCard();
      const v = viewRect(), a = h.p, b = G.W(d.r[0], d.r[1]);
      const w = Math.abs(a[0] - b[0]) + 90, hh = Math.abs(a[1] - b[1]) + 90, k0 = Math.min((v.right - v.left) / w, (v.bottom - v.top) / hh);
      z = Math.max(zmin(), Math.min(zmax() * 0.6, k0 / fitK));   // 楼和目的地刚好都看得见
      tx = (v.left + v.right) / 2 - (a[0] + b[0]) / 2 * fitK * z; ty = (v.top + v.bottom) / 2 - (a[1] + b[1]) / 2 * fitK * z;
      render(true);
    } catch (_) { /* 忽略 */ }
  }
  /* 地图停下来后底图会把卡片放回图标旁边（place）；工具打开时改成靠右边 */
  function dodgeCard() {
    try {
      const cardEl = document.getElementById('card'); if (!layer || !cardEl || cardEl.classList.contains('sheet')) return;
      cardEl.style.left = Math.max(12, innerWidth - 12 - cardEl.offsetWidth) + 'px';   // 电脑：打开工具时卡片靠到右边，旁边是按钮和工具面板，地图图层在左边空出来的地方
      placeUI();
    } catch (_) { /* 忽略 */ }
  }
  /* 缩放地图时文字和线条保持同样大小（线条用 non-scaling-stroke，文字按缩放倍数反向调整） */
  function scaleLayer() { try { if (layer) layer.style.setProperty('--hu', (1 / (fitK * z)).toFixed(4)); } catch (_) { /* 忽略 */ } }
  if (typeof window.place === 'function') { const place0 = window.place; window.place = function () { place0.apply(this, arguments); dodgeCard(); scaleLayer(); }; }
  ['render', 'settleView'].forEach(n => { const f0 = window[n]; if (typeof f0 === 'function') window[n] = function () { const out = f0.apply(this, arguments); scaleLayer(); return out; }; });   // 手机上卡片是底部面板，不走 place

  /* ---------- 公寓卡片：详情最上面的三格 + 展开的说明 ---------- */
  const cardBody = document.getElementById('cardBody');
  function sunTileText(r) {
    const K = k();
    if (!r.main) return [K.sunUnknown, ''];
    return [fmt(r.main.street ? K.sunFace : K.sunMain, { f: dirName(r.main.f) }), fmt(K.sunHours, { w: r.main.w, s: r.main.s })];
  }
  /* ---------- 卡片旁边的三个按钮（☀️ 日照、🔇 安静度、⏱️ 通勤）+ 工具面板 ----------
     卡片里只放房源信息；三个按钮单独放在卡片旁边（电脑、平板贴在卡片左侧竖排，手机在底部面板上方横排）。
     点一个按钮：地图上画出图层，旁边打开这个工具的面板（电脑、平板在卡片左边，手机盖在房源详情上、有「← 房源详情」返回）。再点一次或点 × 收起。 */
  const rail = el('nav', 'hi-rail'), panel = el('aside', 'hi-panel'), pHead = el('header', 'hi-ph'), pBody = el('div', 'hi-pb');
  rail.hidden = true; panel.hidden = true; panel.append(pHead, pBody);
  rail.addEventListener('click', ev => ev.stopPropagation()); panel.addEventListener('click', ev => ev.stopPropagation());
  ['pointerdown', 'touchstart', 'wheel'].forEach(t => panel.addEventListener(t, ev => ev.stopPropagation(), { passive: true }));
  document.body.append(rail, panel);
  let railHome = null;
  const TOOL_ICON = { sun: '☀️', quiet: '🔇', commute: '⏱️' };
  function railTexts(h) {
    const K = k(), r = insight(h), [sm, ss] = sunTileText(r), mine = mySubject();
    return {
      sun: [K.sun, sm, ss],
      quiet: [K.quiet, K.qLevel[r.level], fmt(K.qSub, { r: r.dRoad != null ? mTxt(r.dRoad) : K.qNone, t: r.dRail != null ? mTxt(r.dRail) : K.qNone })],
      commute: [K.commute, mine && h.subj != null ? fmt(K.cWalkSubj, { s: G.subjName(mine), n: h.subj }) : fmt(K.cWalk, { u: h.uol }), K.cOpen]
    };
  }
  function drawRail(h) {
    railHome = h.id; const tx = railTexts(h); rail.replaceChildren();
    rail.setAttribute('aria-label', k().secH);
    Object.entries(tx).forEach(([id, [title, main, sub]]) => {
      const b = btn('hi-tile hi-rb'); b.dataset.id = id; b.title = [main, sub].filter(Boolean).join(' · ');
      b.setAttribute('aria-pressed', String(layerKind === id && layerHome === h.id));
      b.append(el('span', 'hi-ri', TOOL_ICON[id]), el('span', 'hi-rl', title.replace(/^\S+\s/, '')));
      b.addEventListener('click', ev => { ev.stopPropagation(); toggleTool(id, h); });
      rail.append(b);
    });
  }
  function toggleTool(id, h) {
    const on = layerKind === id && layerHome === h.id;
    if (on) { closeTool(); return; }
    if (id === 'sun') sunMin = defaultMin();
    drawLayer(id, h);
    rail.querySelectorAll('.hi-rb').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.id === id)));
    openPanel(id, h);
    requestAnimationFrame(() => { if (id === 'commute') { const d = commuteDests(h).find(x => x.id === cDest); if (d) fitRoute(h, d); } else reveal(h, id); });
  }
  function openPanel(id, h) {
    const K = k(), [title, main, sub] = railTexts(h)[id], phone = isPhoneSheet();
    pHead.replaceChildren();
    if (phone) { const back = btn('bt-link hi-back', K.backToHome); back.addEventListener('click', ev => { ev.stopPropagation(); closeTool(); }); pHead.append(back); }
    const t = el('div', 'hi-pt'); t.append(el('b', '', title), el('span', 'hi-main', main), sub ? el('small', 'bt-note', sub) : '');
    const x = btn('x', '×'); x.setAttribute('aria-label', K.close || '×'); x.addEventListener('click', ev => { ev.stopPropagation(); closeTool(); });
    pHead.append(t, x);
    explain(id, h, pBody);
    panel.dataset.tool = id; panel.hidden = false; document.body.classList.add('hi-panel-on');
    placeUI(); pBody.scrollTop = 0;
  }
  function closeTool() { clearLayer(); panel.hidden = true; document.body.classList.remove('hi-panel-on'); rail.querySelectorAll('.hi-rb').forEach(x => x.setAttribute('aria-pressed', 'false')); placeUI(); }
  const isPhoneSheet = () => { const c = document.getElementById('card'); return !!c && c.classList.contains('sheet') && !document.body.classList.contains('hi-tablet'); };
  /* 按卡片的位置摆放按钮和面板 */
  function placeUI() {
    const c = document.getElementById('card'), open = c && !c.hidden && railHome && BT.homeNow() && BT.homeNow().id === railHome;
    rail.hidden = !open; if (!open) { panel.hidden = true; document.body.classList.remove('hi-panel-on'); return; }
    const r = c.getBoundingClientRect(), phone = isPhoneSheet();
    rail.classList.toggle('row', phone); panel.classList.toggle('phone', phone);
    if (phone) {
      Object.assign(rail.style, { left: 'auto', right: '12px', top: 'auto', bottom: Math.round(innerHeight - r.top + 8) + 'px' });
      Object.assign(panel.style, { left: '0px', right: '0px', top: 'auto', bottom: '0px', width: 'auto', maxHeight: Math.round(Math.max(220, innerHeight - r.top)) + 'px' });
    } else {
      const rw = rail.offsetWidth || 58, railL = r.left - rw - 8;
      Object.assign(rail.style, { left: Math.round(railL) + 'px', right: 'auto', top: Math.round(r.top + 10) + 'px', bottom: 'auto' });
      /* 工具面板放在屏幕左边（盖住公寓列表），中间留出地图看图层；左边放不下（平板竖屏）就放在左下角，地图在上面 */
      const top = 76, pw = 340;
      if (railL - 12 - pw - 12 >= 300) { panel.dataset.pos = 'left'; Object.assign(panel.style, { left: '12px', right: 'auto', top: top + 'px', bottom: 'auto', width: pw + 'px', maxHeight: Math.round(innerHeight - top - 16) + 'px' }); }
      else { panel.dataset.pos = 'bottom'; const bottom = document.body.classList.contains('hi-portrait') && document.body.classList.contains('hi-tablet') ? 84 : 16; Object.assign(panel.style, { left: '12px', right: 'auto', top: 'auto', bottom: bottom + 'px', width: Math.round(Math.max(260, railL - 24)) + 'px', maxHeight: Math.round(innerHeight * 0.46) + 'px' }); }
    }
  }
  function decorate() {
    const h = BT.homeNow(), details = cardBody && cardBody.querySelector('#propertyDetails');
    if (!h || !details) { placeUI(); return; }
    if (layerHome && layerHome !== h.id) closeTool();
    details.classList.add('hi-layout');   // 卡片排版见 home-insights.css「卡片重新排版」
    if (railHome !== h.id || !rail.childNodes.length) drawRail(h);
    if (layerKind && layerHome === h.id && panel.hidden) openPanel(layerKind, h);
    requestAnimationFrame(placeUI);
    if (!OSM.has(h.id) && !osmTried.has(h.id)) loadBuilding(h).then(j => { if (j && BT.homeNow() === h) refreshCard(); });
  }
  /* 数据更新后（楼体轮廓读到了、语言变了）重画按钮和打开的面板 */
  function refreshCard() {
    const h = BT.homeNow(); if (!h) return;
    drawRail(h);
    if (layerKind && layerHome === h.id) { drawLayer(layerKind, h); openPanel(layerKind, h); }
    placeUI();
  }
  const defaultMin = () => { if (sunWhich !== 'today') return 12 * 60; const now = new Date(); return Math.round((now - dayOf('today')) / 6e4 / 5) * 5 % 1440; };
  function explain(id, h, box) {
    const K = k(), r = insight(h); box.replaceChildren();
    if (id === 'sun') {
      const chips = el('div', 'br-chips');
      Object.entries(K.days).forEach(([v, t]) => { const c = btn('bt-chipbtn' + (sunWhich === v ? ' on' : ''), t); c.setAttribute('aria-pressed', String(sunWhich === v)); c.addEventListener('click', ev => { ev.stopPropagation(); stopPlay(); sunWhich = v; sunMin = defaultMin(); drawLayer('sun', h); explain('sun', h, box); }); chips.append(c); });
      const day = sunDay(sunWhich);
      box.append(el('b', 'hi-h', K.sunH), chips, el('p', 'bt-note', fmt(K.sunrise, { a: hhmm(day.rise), b: hhmm(day.set) })));
      /* 时间滑块 */
      const sl = el('div', 'hi-slider'), range = el('input'), play = btn('bt-btn alt hi-play', K.play), now = el('p', 'hi-now');
      range.type = 'range'; range.min = 0; range.max = 1435; range.step = 5; range.value = sunMin; range.setAttribute('aria-label', K.slider);
      const scale = el('div', 'hi-scale'); ['00:00', '06:00', '12:00', '18:00', '24:00'].forEach(t => scale.append(el('span', '', t)));
      const faceList = el('ul', 'hi-faces');
      const update = () => {
        const s = sunAt(), tt = hhmm(s.t);
        now.textContent = s.alt > 0 ? fmt(K.now, { t: tt, d: dirName(s.az), a: Math.round(s.alt) }) : fmt(K.nightNow, { t: tt });
        faceList.replaceChildren();
        r.faces.forEach(f => {
          const li = el('li', lit(s, f.f) ? 'on' : ''), lab = f.len ? fmt(K.faceLen, { f: dirName(f.f), m: f.len }) : fmt(K.face, { f: dirName(f.f) });
          li.append(el('span', 'hi-fi', lit(s, f.f) ? '☀' : '·'), el('span', '', lab + (f.street ? ` · ${K.streetTag}` : '')), el('em', '', (lit(s, f.f) ? K.lit : K.shade) + ' · ' + fmt(K.dayH, { n: hoursFacing(day, f.f) })));
          faceList.append(li);
        });
        drawSunNow(h);
      };
      range.addEventListener('input', () => { sunMin = +range.value; update(); });
      range.addEventListener('click', ev => ev.stopPropagation());
      play.addEventListener('click', ev => { ev.stopPropagation(); if (playing) { stopPlay(); play.textContent = K.play; return; } play.textContent = K.pause; startPlay(range, update, () => { play.textContent = K.play; }); });
      sl.append(play, range); box.append(sl, scale, now);
      if (r.faces.length) box.append(faceList, el('small', 'bt-note', K.src[r.source] + (r.levels ? (zh() ? ` · ${r.levels} 层` : ` · ${r.levels} floors`) : '')));
      else box.append(el('p', 'lp-state warn hi-why', K.unknownWhy));
      update();
      box.append(notesBox(K.sunNotes));
    } else if (id === 'commute') {
      const ds = commuteDests(h); if (!cDest || !ds.some(x => x.id === cDest)) cDest = ds[0] && ds[0].id;
      box.append(el('b', 'hi-h', K.cH), el('small', 'bt-note', K.cSub));
      const groups = [['mine', K.cMine, x => x.mine], ...Object.keys(G.ZONES).map(zk => ['zone:' + zk, fmt(K.cZoneH, { z: G.zoneName(zk), f: G.facultyOf(zk) }), x => !x.mine && x.group === 'zone:' + zk]), ['station', K.cGroups.station, x => x.group === 'station'], ['city', K.cGroups.city, x => x.group === 'city']];
      /* 下拉框选目的地（按「我的专业 / 各校区 / 车站 / 市中心」分组），下面一张结果卡 */
      const lab = el('label', 'hi-dsel'), sel = el('select');
      lab.append(el('span', '', K.cPick), sel);
      groups.forEach(([g, title, f]) => {
        const rows = ds.filter(f); if (!rows.length) return;
        const og = document.createElement('optgroup'); og.label = title;
        rows.forEach(d => { const o = el('option', '', `${d.name} · ${fmt(K.cWalkN, { n: d.walk })}`); o.value = d.id; og.append(o); });
        sel.append(og);
      });
      sel.value = cDest;
      const res = el('div', 'hi-dres');
      const drawRes = () => {
        const d = ds.find(x => x.id === cDest); res.replaceChildren(); if (!d) return;
        res.append(el('span', 'hi-dn', d.name), el('b', '', fmt(K.cWalkN, { n: d.walk })), el('small', '', [d.bus ? fmt(K.cBusN, { n: d.bus }) : '', fmt(K.cDist, { d: mTxt(d.m) })].filter(Boolean).join(' · ')));
      };
      sel.addEventListener('click', ev => ev.stopPropagation());
      sel.addEventListener('change', ev => { ev.stopPropagation(); cDest = sel.value; drawRes(); drawLayer('commute', h); const d = ds.find(x => x.id === cDest); if (d) fitRoute(h, d); });
      drawRes(); box.append(lab, res);
      const circ = btn('bt-link', K.cCircle); circ.addEventListener('click', ev => { ev.stopPropagation(); if (window.Commute) window.Commute.open(false); });
      box.append(notesBox([K.cNote]), circ);
    } else {
      const dl = el('dl', 'hi-dl');
      dl.append(el('dt', '', K.qRoad), el('dd', '', r.dRoad != null ? mTxt(r.dRoad) : K.qNone), el('dt', '', K.qRail), el('dd', '', r.dRail != null ? mTxt(r.dRail) : K.qNone));
      box.append(el('b', 'hi-h', K.qH + ' · ' + K.qLevel[r.level]), dl);
      box.append(notesBox(K.qNotes));
    }
    const x = btn('bt-link', K.mapClear); x.addEventListener('click', ev => { ev.stopPropagation(); closeTool(); }); box.append(x, el('small', 'bt-note hi-src', K.srcOsm));
  }
  /* 说明文字默认收起，点「说明」再看 */
  function notesBox(list) { const d = el('details', 'hi-notes-d'), sm = el('summary', '', zh() ? '说明' : 'Notes'), ul = el('ul', 'hi-notes'); list.forEach(n => ul.append(el('li', '', n))); d.append(sm, ul); d.addEventListener('click', ev => ev.stopPropagation()); return d; }
  /* ▶ 播放：每帧走 5 分钟，从日出走到日落；系统开了「减少动态」时一次跳 30 分钟 */
  function startPlay(range, update, done) {
    const day = sunDay(sunWhich), riseM = day.up.length ? day.up[0].m : 0, setM = day.up.length ? day.up[day.up.length - 1].m : 1435;
    if (sunMin >= setM || sunMin < riseM) sunMin = riseM;
    let last = 0;
    const step = ts => {
      if (!playing) return;
      if (ts - last > (reduceMotion ? 400 : 60)) { last = ts; sunMin += reduceMotion ? 30 : 5; if (sunMin > setM) { stopPlay(); done(); return; } range.value = sunMin; update(); }
      playing = requestAnimationFrame(step);
    };
    playing = requestAnimationFrame(step);
  }
  function stopPlay() { if (playing) cancelAnimationFrame(playing); playing = 0; }
  const keepOpen = e => { if (layer && !e.target.closest('.m, .hbtn')) e.stopPropagation(); };
  [document.getElementById('mapbox'), document.querySelector('.float.zoom')].forEach(n => n && n.addEventListener('click', keepOpen));
  if (cardBody) new MutationObserver(decorate).observe(cardBody, { childList: true });
  const card = document.getElementById('card');
  if (card) new MutationObserver(() => { if (card.hidden) clearLayer(); placeUI(); }).observe(card, { attributes: true, attributeFilter: ['hidden', 'style', 'class'] });
  if (card && 'ResizeObserver' in window) new ResizeObserver(() => placeUI()).observe(card);
  addEventListener('resize', () => placeUI());

  /* ---------- 手机卡片：顶部把手往上推变高（几乎全屏），往下拉回原来的高度；内容在最顶端时往上滑也能展开 ---------- */
  if (card) {
    const grip = el('div', 'hi-grip'); grip.setAttribute('role', 'button'); grip.setAttribute('tabindex', '0'); grip.setAttribute('aria-label', zh() ? '展开或收起详情' : 'Expand or collapse details');
    card.prepend(grip);
    const isSheet = () => card.classList.contains('sheet') && !card.hidden;
    const setFull = on => { card.classList.toggle('hi-full', on); card.style.maxHeight = ''; if (!on) card.scrollTop = 0; };
    let y0 = null, h0 = 0, moved = false;
    let wasFull = false;
    grip.addEventListener('pointerdown', e => { if (!isSheet()) return; y0 = e.clientY; h0 = card.offsetHeight; moved = false; wasFull = card.classList.contains('hi-full'); grip.setPointerCapture(e.pointerId); card.classList.add('hi-drag'); card.classList.remove('hi-full'); card.style.maxHeight = h0 + 'px'; });
    grip.addEventListener('pointermove', e => { if (y0 == null) return; const dy = e.clientY - y0; if (Math.abs(dy) > 4) moved = true; card.style.maxHeight = Math.max(160, Math.min(innerHeight - 56, h0 - dy)) + 'px'; });
    const end = e => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null; card.classList.remove('hi-drag');
      if (!moved) setFull(!wasFull); else setFull(dy < -30 ? true : dy > 30 ? false : wasFull); };
    grip.addEventListener('pointerup', end); grip.addEventListener('pointercancel', end);
    grip.addEventListener('click', e => e.stopPropagation());
    grip.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFull(!card.classList.contains('hi-full')); } });
    let ty0 = null;
    card.addEventListener('touchstart', e => { ty0 = isSheet() && !e.target.closest('.hi-grip, input, select, textarea') ? e.touches[0].clientY : null; }, { passive: true });
    card.addEventListener('touchmove', e => {
      if (ty0 == null) return; const dy = e.touches[0].clientY - ty0;
      if (dy < -24 && !card.classList.contains('hi-full')) { setFull(true); ty0 = null; }
      else if (dy > 48 && card.classList.contains('hi-full') && card.scrollTop <= 0) { setFull(false); ty0 = null; }
    }, { passive: true });
    new MutationObserver(() => { if (card.hidden) setFull(false); }).observe(card, { attributes: true, attributeFilter: ['hidden'] });
  }

  /* ---------- 地图筛选：冬季日照、安静（不符合的楼变淡） ---------- */
  const filt = { sun: false, quiet: false };
  const passSun = r => r.main && r.main.w >= 4, passQuiet = r => (r.dRoad == null || r.dRoad >= 50) && (r.dRail == null || r.dRail >= 150);
  let loadingAll = false;
  async function loadAllBuildings() {
    if (loadingAll || !/^https?:$/.test(location.protocol)) return; loadingAll = true; applyFilters();
    for (const h of G.HOMES) { if (!filt.sun) break; if (await loadBuilding(h)) applyFilters(); }
    loadingAll = false; applyFilters();
  }
  function applyFilters() {
    const any = filt.sun || filt.quiet; let n = 0, unknown = 0;
    G.HOMES.forEach(h => {
      const g = G.els.get(h.id), r = insight(h); if (!g) return;
      const ok = (!filt.sun || passSun(r)) && (!filt.quiet || passQuiet(r));
      if (filt.sun && !r.main) unknown++;
      if (any && ok) n++;
      g.classList.toggle('hi-out', any && !ok);
    });
    document.body.classList.toggle('hi-filter-on', any);
    drawStatus(n, unknown);
  }
  const status = el('div', 'hi-status'); status.hidden = true;
  function drawStatus(n, unknown) {
    const K = k(), any = filt.sun || filt.quiet; status.hidden = !any; if (!any) return;
    placeStatus();
    const rules = [filt.sun && K.fSunRule, filt.quiet && K.fQuietRule].filter(Boolean).join(zh() ? '；' : '; ');
    status.replaceChildren(el('span', '', fmt(K.fStatus, { rules, n: n ?? '…' })));
    if (filt.sun && unknown) status.append(el('small', '', fmt(K.fUnknown, { n: unknown })));
    if (loadingAll) status.append(el('small', '', K.fLoading));
    const x = btn('bt-link', K.fClear); x.addEventListener('click', ev => { ev.stopPropagation(); filt.sun = filt.quiet = false; drawBar(); applyFilters(); }); status.append(x);
  }

  /* ---------- 选房工具栏 ---------- */
  const bar = el('nav', 'hi-bar'); bar.setAttribute('aria-label', k().barLabel);
  const tools = {
    commute: () => window.Commute && window.Commute.open(false),
    cost: () => window.CostCalc && window.CostCalc.open(BT.homeNow()),
    budget: () => window.QuoteCheck && window.QuoteCheck.open(null, null, 'budget')
  };
  function drawBar() {
    const K = k(), hd = el('span', 'hi-handle', '⠿'); hd.setAttribute('aria-hidden', 'true'); hd.title = K.dragTip;
    bar.replaceChildren(hd, el('span', 'hi-bar-h', K.barLabel));
    [['sun', K.fSun, K.fSunRule], ['quiet', K.fQuiet, K.fQuietRule]].forEach(([id, lab, rule]) => {   // 地图筛选放在最前面
      const b = btn('hi-bar-f', lab); b.title = rule; b.setAttribute('aria-pressed', String(filt[id]));
      b.addEventListener('click', ev => { ev.stopPropagation(); filt[id] = !filt[id]; b.setAttribute('aria-pressed', String(filt[id])); applyFilters(); if (id === 'sun' && filt.sun) loadAllBuildings(); });
      bar.append(b);
    });
    bar.append(el('i', 'hi-sep'));
    Object.keys(tools).forEach(id => { const b = btn('hi-bar-b'); b.append(el('span', 'hi-long', K.bar[id]), el('span', 'hi-short', K.barShort[id])); b.addEventListener('click', ev => { ev.stopPropagation(); tools[id](); }); bar.append(b); });
  }
  drawBar(); document.body.append(bar, status); document.body.classList.add('hi-has-bar');

  /* ---------- 工具栏可以拖动；拖到屏幕左右边上收成小箭头（和「找公寓」「公寓列表」面板一样），点箭头放回来 ---------- */
  const POS = 'lsm-toolbar-pos-v1', tab = btn('pd-tab hi-tab'); tab.hidden = true; document.body.append(tab);
  let pos = null; try { pos = JSON.parse(localStorage.getItem(POS) || 'null'); } catch (_) { /* 用默认位置 */ }
  if (pos && (!Number.isFinite(pos.x) || !Number.isFinite(pos.y))) pos = null;
  const savePos = () => { try { if (pos) localStorage.setItem(POS, JSON.stringify(pos)); else localStorage.removeItem(POS); } catch (_) { /* 只这次 */ } };
  const vw = () => document.documentElement.clientWidth;
  const clampXY = (x, y) => { const r = bar.getBoundingClientRect(); return [Math.max(8, Math.min(x, vw() - r.width - 8)), Math.max(60, Math.min(y, innerHeight - r.height - 8))]; };
  function applyPos() {
    if (!pos) { ['left', 'top', 'bottom', 'right', 'transform', 'visibility'].forEach(p => { bar.style[p] = ''; }); tab.hidden = true; bar.classList.remove('hi-moved'); placeStatus(); return; }
    bar.classList.add('hi-moved');
    Object.assign(bar.style, { left: pos.x + 'px', top: pos.y + 'px', bottom: 'auto', right: 'auto', transform: 'none' });
    if (!pos.dock) { const [x, y] = clampXY(pos.x, pos.y); pos.x = x; pos.y = y; bar.style.left = x + 'px'; bar.style.top = y + 'px'; }
    bar.style.visibility = pos.dock ? 'hidden' : '';
    tab.hidden = !pos.dock;
    if (pos.dock) {
      const left = pos.dock === 'left'; tab.classList.toggle('is-left', left); tab.classList.toggle('is-right', !left);
      tab.textContent = left ? '▶' : '◀'; tab.title = k().tabTip; tab.setAttribute('aria-label', k().tabTip);
      tab.style.top = Math.max(70, Math.min(pos.ty ?? pos.y, innerHeight - 140)) + 'px';
    }
    placeStatus();
  }
  function placeStatus() {
    if (status.hidden) return;
    if (pos && !pos.dock) {   // 工具栏挪过：说明跟着工具栏，放在它下面（放不下就放上面）
      const r = bar.getBoundingClientRect(), below = r.bottom + 66 < innerHeight;
      status.style.left = Math.round(r.left) + 'px'; status.style.top = below ? Math.round(r.bottom + 6) + 'px' : 'auto'; status.style.bottom = below ? 'auto' : Math.round(innerHeight - r.top + 6) + 'px'; return;
    }
    if (innerWidth <= 760) { status.style.left = status.style.top = status.style.bottom = ''; return; }   // 手机：用 CSS 的位置（工具栏上方）
    const r = bar.getBoundingClientRect(), up = r.top > innerHeight / 2;   // 工具栏在下半屏（平板竖屏的底部工具栏）时说明放在它上面
    status.style.left = Math.round(r.left) + 'px'; status.style.top = up ? 'auto' : Math.round(r.bottom + 6) + 'px'; status.style.bottom = up ? Math.round(innerHeight - r.top + 6) + 'px' : 'auto';
  }
  let dg = null;
  /* 工具栏上任何地方按住都能拖（包括按钮）：按下时先不动，移动超过 8 像素才算拖动，拖完不会触发按钮 */
  bar.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    const r = bar.getBoundingClientRect(); dg = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, w: r.width, moved: false };
    if (e.target.closest('.hi-handle, .hi-bar-h')) { try { bar.setPointerCapture(e.pointerId); } catch (_) { /* 忽略 */ } e.preventDefault(); }
    e.stopPropagation();
  });
  const dgMove = e => {
    if (!dg || e.pointerId !== dg.id) return;
    const dx = e.clientX - dg.sx, dy = e.clientY - dg.sy;
    if (!dg.moved) { if (Math.hypot(dx, dy) < 8) return; dg.moved = true; bar.classList.add('pd-dragging'); try { bar.setPointerCapture(e.pointerId); } catch (_) { /* 忽略 */ } }
    e.preventDefault();
    const x = Math.max(-dg.w * 0.7, Math.min(dg.ox + dx, vw() - dg.w * 0.3)), y = Math.max(60, Math.min(dg.oy + dy, innerHeight - 50));   // 可以拖出一部分到屏幕外，方便「甩」到边上
    Object.assign(bar.style, { left: x + 'px', top: y + 'px', bottom: 'auto', right: 'auto', transform: 'none' }); placeStatus();
  };
  bar.addEventListener('pointermove', dgMove); addEventListener('pointermove', dgMove);
  const dgEnd = e => {
    if (!dg || e.pointerId !== dg.id) return; const was = dg; dg = null; try { bar.releasePointerCapture(e.pointerId); } catch (_) { /* 忽略 */ } if (!was.moved) return;
    bar.classList.remove('pd-dragging'); bar.dataset.justDragged = '1'; setTimeout(() => { delete bar.dataset.justDragged; }, 350);   // 拖完紧接着的那次点击不算点按钮
    const r = bar.getBoundingClientRect(), px = e.clientX;
    const dock = e.type === 'pointercancel' ? null : (r.left < -r.width * 0.28 || (px < 28 && r.left < 4)) ? 'left' : (r.right > vw() + r.width * 0.28 || (px > vw() - 28 && r.right > vw() - 4)) ? 'right' : null;
    pos = { x: Math.max(8, Math.min(r.left, vw() - r.width - 8)), y: r.top, dock, ty: r.top };
    savePos(); bar.classList.add('pd-anim'); applyPos(); setTimeout(() => bar.classList.remove('pd-anim'), 260);
  };
  bar.addEventListener('pointerup', dgEnd); bar.addEventListener('pointercancel', dgEnd); addEventListener('pointerup', dgEnd); addEventListener('pointercancel', dgEnd);
  bar.addEventListener('click', e => { if (bar.dataset.justDragged) { e.stopPropagation(); e.preventDefault(); } }, true);
  bar.addEventListener('click', e => { if (bar.classList.contains('pd-dragging')) { e.stopPropagation(); e.preventDefault(); } }, true);
  bar.addEventListener('dblclick', e => { if (e.target.closest('.hi-handle, .hi-bar-h')) { pos = null; savePos(); applyPos(); } });   // 双击把手放回默认位置
  /* 边上的小箭头：点一下放回来；上下拖动换位置；往里拖也会放回来 */
  let td = null, tapped = 0;
  const undock = () => { if (!pos) return; pos.dock = null; savePos(); applyPos(); };
  tab.addEventListener('pointerdown', e => { td = { id: e.pointerId, sx: e.clientX, sy: e.clientY, oy: parseFloat(tab.style.top) || 0, moved: false }; try { tab.setPointerCapture(e.pointerId); } catch (_) { /* 忽略 */ } e.stopPropagation(); e.preventDefault(); });
  tab.addEventListener('pointermove', e => {
    if (!td || e.pointerId !== td.id) return; const dx = e.clientX - td.sx, dy = e.clientY - td.sy;
    if (!td.moved && Math.hypot(dx, dy) < 12) return; td.moved = true; e.preventDefault();
    const inward = pos.dock === 'left' ? dx : -dx;
    if (inward > 40) { pos.y = e.clientY - 20; pos.x = pos.dock === 'left' ? 8 : vw(); td = null; tapped = Date.now(); undock(); return; }
    tab.style.top = Math.max(70, Math.min(td.oy + dy, innerHeight - 140)) + 'px';
  });
  tab.addEventListener('pointerup', e => { if (!td || e.pointerId !== td.id) return; const moved = td.moved; td = null; if (moved) { pos.ty = parseFloat(tab.style.top); savePos(); } else { tapped = Date.now(); undock(); } });
  tab.addEventListener('pointercancel', () => { td = null; });
  tab.addEventListener('click', e => { e.stopPropagation(); if (Date.now() - tapped < 600) return; undock(); });
  addEventListener('resize', () => { if (!dg) applyPos(); });
  applyPos();

  /* ---------- 平板（iPad、折叠屏展开）：触屏且屏幕短边 ≥ 700 像素时用平板布局（右侧详情面板） ---------- */
  /* 有触屏就算（iPad 接了妙控键盘或触控板时 pointer 会报 fine，所以也看 maxTouchPoints） */
  const touchy = () => navigator.maxTouchPoints > 0 || matchMedia('(any-pointer: coarse)').matches;
  function layoutMode() {
    let narrow = false; try { narrow = isNarrow(); } catch (_) { /* 忽略 */ }
    const touch = touchy(), tab = touch && Math.min(innerWidth, innerHeight) >= 700;
    document.body.classList.toggle('hi-touch', touch);
    document.body.classList.toggle('hi-tablet', tab); document.body.classList.toggle('hi-narrow', narrow);
    document.body.classList.toggle('hi-portrait', innerHeight > innerWidth);
    drawStatus();
  }
  layoutMode(); addEventListener('resize', layoutMode); addEventListener('orientationchange', layoutMode);
  if (card) new MutationObserver(() => document.body.classList.toggle('hi-card-open', !card.hidden)).observe(card, { attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(() => { drawBar(); applyFilters(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  window.HomeInsights = { insight, sunPos, sunDay, hoursFacing, clearLayer, loadBuilding, applyFilters, filters: filt };
})();
