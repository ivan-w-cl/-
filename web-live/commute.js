/* 通勤时间圈（演示）：选目的地（校区、教学楼、车站）、每天几点到、怎么去（步行 / 骑车 / 公交）、最多花多少分钟，
   地图上画出这个时间内能到的范围，范围外的公寓变淡，再列出能到的公寓和几点出门。
   时间是估算：步行按直线距离 × 1.3、每分钟 80 米（和地图上的步行分钟数同一算法）；骑车每分钟 250 米加 2 分钟停车；
   公交按步行到站 4 分钟 + 等车 5 分钟（早高峰 8:00–9:30 多等 3 分钟）+ 每分钟 300 米。正式版可以接 TravelTime 这类按真实路网和时刻表计算的服务。
   入口：天气标签下面的「⏱️ 通勤时间圈」、生活选房开场页的订房小工具。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  let G; try { G = { raw, W, mk, HOMES, PLACES, BUILDINGS, ZONES, els, nameOf, zoneName }; } catch (_) { return; }   // 地图还没准备好
  const { el, btn, fmt, money, pick } = BT;
  const T = {
    zh: {
      intro: '⏱️ 通勤时间圈', pill: '⏱️ 通勤时间圈', eyebrow: '按上课时间找房', title: '通勤时间圈',
      lede: '选你最常去的地方和每天几点到，地图上会画出这个时间内能到的范围，并列出范围内的公寓。',
      dest: '去哪里', campus: '校区与车站', zone: '{z} 教学楼', arrive: '每天几点到', mode: '怎么去', max: '最多花多少分钟',
      modes: { walk: '🚶 步行', bike: '🚲 骑车', bus: '🚌 公交' }, minN: '{n} 分钟',
      show: '在地图上看', list: '能到的公寓（{n} 处）', none: '这个时间内到不了任何公寓，放宽一点分钟数试试。',
      leave: '{t} 出门', mins: '约 {n} 分钟', walkTag: '步行更快', price: '{v}/周起',
      bar: '{t} 前到 {d} · {m} {n} 分钟内：{c} 处公寓', barList: '看列表', barEdit: '改条件', barClear: '清除',
      note: '时间是估算：步行按地图上的步行算法；骑车和公交按平均速度和等车时间估算，早高峰多算 3 分钟。正式版可以接按真实路网和公交时刻表计算的服务。'
    },
    en: {
      intro: '⏱️ Commute time map', pill: '⏱️ Commute map', eyebrow: 'Find homes by class time', title: 'Commute time map',
      lede: 'Pick where you go most and when you need to be there. The map shows how far you can get in that time and lists the homes inside.',
      dest: 'Where to', campus: 'Campuses and stations', zone: '{z} buildings', arrive: 'Arrive by', mode: 'How', max: 'At most',
      modes: { walk: '🚶 Walk', bike: '🚲 Bike', bus: '🚌 Bus' }, minN: '{n} min',
      show: 'Show on map', list: 'Homes you can reach ({n})', none: 'No homes within that time. Try a few more minutes.',
      leave: 'Leave at {t}', mins: 'about {n} min', walkTag: 'walking is quicker', price: 'from {v}/wk',
      bar: 'Arrive {d} by {t} · {m} within {n} min: {c} homes', barList: 'List', barEdit: 'Change', barClear: 'Clear',
      note: 'Times are estimates: walking uses the same method as the map; bike and bus use average speeds and waiting time, with 3 extra minutes in the morning peak. The live version can use a service based on real roads and bus timetables.'
    }
  };
  const k = () => pick(T);
  const prefs = BT.store('lsm-commute-v1');
  const st = Object.assign({ dest: 'p:' + (G.PLACES.find(p => p.t === 'uni') || {}).id, arrive: '09:00', mode: 'walk', max: 15 }, prefs.get() || {});

  /* ---------- 目的地 ---------- */
  function dests() {
    const out = [];
    G.PLACES.filter(p => p.t === 'uni' || p.t === 'rail').forEach(p => out.push({ id: 'p:' + p.id, name: G.nameOf(p), group: 'campus', r: G.raw(p.lat, p.lng) }));
    G.BUILDINGS.forEach(b => out.push({ id: 'b:' + b.key, name: b.name, group: b.zone, r: b.r }));
    return out;
  }
  const destOf = id => dests().find(d => d.id === id) || dests()[0];

  /* ---------- 时间估算（单位：分钟；距离用地图坐标，1 单位 = 10 米） ---------- */
  const peak = t => { const [h, m] = t.split(':').map(Number), x = h * 60 + m; return x >= 480 && x <= 570; };
  function minutes(r, d, mode, arrive) {
    const m = Math.hypot(r[0] - d[0], r[1] - d[1]) * 10 * 1.3, walk = Math.round(m / 80);
    if (mode === 'walk') return { t: walk };
    if (mode === 'bike') return { t: Math.round(m / 250 + 2) };
    const bus = Math.round(4 + 5 + (peak(arrive) ? 3 : 0) + m / 300);
    return walk <= bus ? { t: walk, walk: true } : { t: bus };
  }
  /* 能到的范围（地图坐标里的半径）：反解上面的公式 */
  function radius(mode, max, arrive) {
    const walkR = max * 80 / 1.3 / 10;
    if (mode === 'walk') return walkR;
    if (mode === 'bike') return Math.max(0, (max - 2) * 250 / 1.3 / 10);
    return Math.max(walkR, Math.max(0, (max - 9 - (peak(arrive) ? 3 : 0)) * 300 / 1.3 / 10));
  }
  const leaveAt = (arrive, mins) => { const [h, m] = arrive.split(':').map(Number); let x = h * 60 + m - mins - 3; x = (x + 1440) % 1440; return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); };
  function reach() {
    const d = destOf(st.dest);
    return G.HOMES.map(h => ({ h, ...minutes(G.raw(h.lat, h.lng), d.r, st.mode, st.arrive) })).sort((a, b) => a.t - b.t);
  }

  /* ---------- 地图图层 ---------- */
  const over = document.getElementById('over'), homesG = document.getElementById('homes');
  let layer = null, bar = null, active = false;
  function clear() {
    active = false; if (layer) layer.remove(); layer = null; if (bar) bar.remove(); bar = null;
    G.HOMES.forEach(h => { const g = G.els.get(h.id); if (g) g.classList.remove('cm-out', 'cm-in'); });
    document.body.classList.remove('cm-on');
  }
  function draw() {
    clear(); active = true;
    const d = destOf(st.dest), R = radius(st.mode, Number(st.max), st.arrive), pts = [];
    for (let i = 0; i < 96; i++) { const a = i / 96 * Math.PI * 2, p = G.W(d.r[0] + Math.cos(a) * R, d.r[1] + Math.sin(a) * R); pts.push(p[0].toFixed(1) + ' ' + p[1].toFixed(1)); }
    layer = G.mk('g', { class: 'cm-layer', 'pointer-events': 'none' });
    over.insertBefore(layer, homesG);
    G.mk('path', { d: 'M' + pts.join('L') + 'Z', class: 'cm-area' }, layer);
    const c = G.W(d.r[0], d.r[1]), star = G.mk('g', { transform: `translate(${c[0].toFixed(1)} ${c[1].toFixed(1)})`, class: 'cm-dest' }, layer);
    G.mk('circle', { r: 13 }, star); G.mk('path', { d: 'M0 -8 L2.4 -2.5 L8 -2.5 L3.5 1 L5.2 7 L0 3.5 L-5.2 7 L-3.5 1 L-8 -2.5 L-2.4 -2.5 Z' }, star);
    const list = reach(), inn = list.filter(x => x.t <= Number(st.max));
    G.HOMES.forEach(h => { const g = G.els.get(h.id); if (g) g.classList.add(inn.some(x => x.h === h) ? 'cm-in' : 'cm-out'); });
    document.body.classList.add('cm-on');
    const K = k(); bar = el('div', 'cm-bar'); bar.setAttribute('role', 'status');
    bar.append(el('span', '', fmt(K.bar, { t: st.arrive, d: d.name, m: K.modes[st.mode], n: st.max, c: inn.length })));
    const b1 = btn('bt-btn', K.barList), b2 = btn('bt-btn alt', K.barEdit), b3 = btn('bt-link', K.barClear);
    b1.addEventListener('click', e => { e.stopPropagation(); open(true); });
    b2.addEventListener('click', e => { e.stopPropagation(); open(false); });
    b3.addEventListener('click', e => { e.stopPropagation(); clear(); });
    const acts = el('div', 'cm-acts'); acts.append(b1, b2, b3); bar.append(acts);
    bar.addEventListener('click', e => e.stopPropagation());
    document.body.append(bar);
  }

  /* ---------- 弹窗：条件 + 列表 ---------- */
  function open(listFirst) {
    const K = k(), m = BT.modal({ eyebrow: K.eyebrow, title: K.title }); m.box.classList.add('cm-box');
    m.body.append(el('p', 'bt-lede', K.lede));
    const form = el('div', 'qc-ed cm-form');
    const sel = el('select'); sel.id = 'cmDest';
    const groups = {}; dests().forEach(d => { const g = d.group; if (!groups[g]) { groups[g] = el('optgroup'); groups[g].label = g === 'campus' ? K.campus : fmt(K.zone, { z: G.zoneName(g) }); sel.append(groups[g]); } const o = el('option', '', d.name); o.value = d.id; groups[g].append(o); });
    sel.value = st.dest;
    const time = el('input'); time.type = 'time'; time.value = st.arrive; time.id = 'cmTime';
    const f = (label, input) => { const l = el('label', 'qc-f'); l.append(el('span', '', label), input); return l; };
    const modes = el('div', 'br-chips'); modes.setAttribute('role', 'group');
    const mins = el('div', 'br-chips');
    const out = el('div', 'cm-out');
    const save = () => { prefs.set({ dest: st.dest, arrive: st.arrive, mode: st.mode, max: st.max }); renderList(); };
    const chips = () => {
      modes.replaceChildren(); mins.replaceChildren();
      Object.entries(K.modes).forEach(([v, t]) => { const b = btn('bt-chipbtn' + (st.mode === v ? ' on' : ''), t); b.setAttribute('aria-pressed', String(st.mode === v)); b.addEventListener('click', () => { st.mode = v; chips(); save(); }); modes.append(b); });
      [10, 15, 20, 30].forEach(n => { const b = btn('bt-chipbtn' + (Number(st.max) === n ? ' on' : ''), fmt(K.minN, { n })); b.addEventListener('click', () => { st.max = n; chips(); save(); }); mins.append(b); });
    };
    sel.addEventListener('change', () => { st.dest = sel.value; save(); });
    time.addEventListener('change', () => { if (time.value) { st.arrive = time.value; save(); } });
    const grid = el('div', 'qc-grid'); grid.append(f(K.dest, sel), f(K.arrive, time));
    form.append(grid, el('span', 'qc-f', K.mode), modes, el('span', 'qc-f', K.max), mins);
    m.body.append(form, out, el('p', 'bt-note', K.note));
    function renderList() {
      out.replaceChildren();
      const inn = reach().filter(x => x.t <= Number(st.max));
      out.append(el('b', 'cm-h', fmt(K.list, { n: inn.length })));
      if (!inn.length) { out.append(el('p', 'bt-note', K.none)); return; }
      const ul = el('div', 'qc-homes');
      inn.forEach(({ h, t, walk }) => {
        const row = btn('qc-home'), s = el('span'), p = [h.pe, h.ps, h.plo].map(Number).filter(v => v > 0);
        s.append(el('b', '', h.name), el('small', '', [fmt(K.mins, { n: t }) + (walk && st.mode === 'bus' ? '（' + K.walkTag + '）' : ''), p.length ? fmt(K.price, { v: money(Math.min(...p)) }) : ''].filter(Boolean).join(' · ')));
        row.append(s, el('span', 'qc-p', fmt(K.leave, { t: leaveAt(st.arrive, t) })));
        row.addEventListener('click', () => { BT.close(); draw(); try { show(h, true); } catch (_) { /* 页面还没准备好 */ } });
        ul.append(row);
      });
      out.append(ul);
      if (active) draw();
    }
    chips(); renderList();
    const go = btn('bt-btn', K.show); go.addEventListener('click', () => { BT.close(); draw(); });
    m.foot.append(go);
    if (listFirst) setTimeout(() => out.scrollIntoView({ block: 'start' }), 30);
  }

  BT.add({ id: 'commute', order: 4, intro: () => k().intro, open: () => open(false) });
  const pill = btn('cm-pill', k().pill);
  pill.addEventListener('click', e => { e.stopPropagation(); open(false); });
  document.body.append(pill);
  window.Commute = { open, draw, clear, minutes };
})();
