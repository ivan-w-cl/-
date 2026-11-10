/* Episode 01 · Liverpool weather: sun and rain in one day, daylight vs sunshine (English, 1080×1920)
   Built into stage/timeline-ep01.js by build.py, which prepends `const EP = { duration, lines, captions, sun }` (voice timings).
   All on-screen wording lives in TXT below so a Chinese version only needs this table (and a new voice track) changed.
   Explainer scenes are drawn as SVG from the current time; the product insert is the real web app in the phone frame (stage engine).
   Record: PORTRAIT=1 DK=1 DKSTART=phone TL=timeline-ep01 PRE=300 DATE=2026-11-03T12:00:00Z  (EXTRA='&nocap=1' → no burnt-in captions) */
'use strict';
const TXT = {
  hook: { k: 'LIVERPOOL WEATHER', h: ['Sun. Rain. Sun.'], rows: [['Leave home', 'Sunshine'], ['At the bus stop', 'Rain'], ['Bus arrives', 'Sunshine again']], foot: 'All in one afternoon' },
  airmass: { k: 'WHY IT HAPPENS', h: ['Air masses meet', 'over Britain'], pm: ['Polar maritime air', 'the most common one'], pm2: 'warms + gathers moisture', tm: ['Tropical maritime air', 'mild and moist'], unstable: 'Unstable air → showers', liv: 'Liverpool', atl: 'ATLANTIC OCEAN', map: 'Schematic map', src: 'Source: Met Office, air masses' },
  showers: { k: 'WHY IT FLIPS SO FAST', h: ['A shower can', 'be tiny'], size: 'as little as 1 km²', a: 'This street: soaked', b: 'Next street: dry', scale: '1 km', src: 'Source: Met Office, rain and showers' },
  daylight: { k: 'TWO DIFFERENT THINGS', h: ['Daylight ≠ sunshine'], dec: 'Late December', jun: 'Late June', decv: '≈ 7½ h of daylight', junv: '≈ 17 h of daylight', rise: 'sunrise', set: 'sunset', def: ['Sunshine hours', 'only the time the sun actually shines through'], stat: '≈ 40 h', statl: ['of sunshine in all of December', '(average)'], of: 'out of ≈ 230 h of daylight', region: 'England NW & N Wales · Met Office 1991–2020 average', calc: 'Daylight calculated for Liverpool, 53.4°N' },
  insert: { k: 'OUR TOOL · 留学住宿通', h: 'Sunlight reference', s: 'in our Liverpool student accommodation mini program', winter: 'Winter solstice', summer: 'Summer solstice', sun: 'Where the sun sits', walls: 'Outer walls: lit or in shade', limit: ['Reference only', 'not neighbouring buildings, cloud or indoor light'] },
  seasons: { k: 'WHY THE SEASONS DIFFER', h: ['How high the sun', 'climbs at midday'], w: 'Midwinter', s: 'Midsummer', wdeg: '≈ 13°', sdeg: '≈ 60°', wsh: 'Shadow ≈ 4× your height', ssh: 'Shadow ≈ 0.6× your height', note: 'Geometry for Liverpool, 53.4°N · illustration' },
  forecast: { k: 'USING THE FORECAST', h: ['Read it', 'hour by hour'], day: 'One icon for the whole day', hides: 'hides the changes', ill: 'ILLUSTRATION · not a real forecast', call: ['70% = 7 in 10', 'that some rain falls within that hour'], not: 'not rain all day', src: 'Source: Met Office forecast guide (≥ 0.1 mm in the hour)' },
  close: { h: ['Sunny days.', 'Grey days.'], h2: 'Often both in one afternoon.', src: 'Sources: Met Office (air masses · showers · sunshine · forecast guide)' }
};
const NOCAP = QS.get('nocap') === '1';
const W = f => S.win(f), D_ = f => S.doc(f);
const vis = e => e && e.getBoundingClientRect().width > 0;
const byText = (sel, txt) => w => [...w.document.querySelectorAll(sel)].find(e => e.textContent.includes(txt) && vis(e));
const leafIn = (scope, txt) => w => [...w.document.querySelectorAll(scope + ' *')].find(e => vis(e) && e.children.length === 0 && e.textContent.includes(txt));
const scrollParent = el => { for (let p = el && el.parentElement; p; p = p.parentElement) { const cs = getComputedStyle(p); if (/(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 4) return p; } return null; };
const scrollTo = (find, at) => [w => scrollParent(find(w)), (box, w) => { const r = find(w); return box.scrollTop + r.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight * at; }];
const homeById = (w, id) => w.eval('HOMES').find(x => x.id === id);
const HOME = 'true-liverpool';
const c01 = x => Math.max(0, Math.min(1, x)), lerp = (a, b, p) => a + (b - a) * p;
const eo = x => 1 - Math.pow(1 - c01(x), 3), eio = x => { x = c01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const ramp = (t, t0, d) => eo((t - t0) / (d || 0.5));   // 0 → 1 starting at t0
const LN = id => EP.lines.filter(l => l.scene === id);
const SC = {}; { const ids = [...new Set(EP.lines.map(l => l.scene))]; ids.forEach((id, i) => { const ls = LN(id); SC[id] = { t0: i === 0 ? 0 : ls[0].start - 0.35, t1: i === ids.length - 1 ? EP.duration : LN(ids[i + 1])[0].start - 0.35, L: ls }; }); }
const END = EP.duration;

/* ---------- drawing helpers (SVG strings) ---------- */
const INK = '#1d1d1f', SOFT = '#6e6e73', CORAL = '#c2522f', BLUE = '#3f73a8', RAIN = '#5b8fc4', SUN = '#f2b33d', LAND = '#dfd3b4', SEA = '#cfe0ea', CARD = '#fffaf0', LINE = '#3a2c1f';
const F = "font-family='Noto Sans SC, sans-serif'";
const tx = (x, y, s, size, o) => { o = o || {}; return `<text x='${x}' y='${y}' ${F} font-size='${size}' font-weight='${o.w || 700}' fill='${o.fill || INK}' text-anchor='${o.a || 'middle'}' opacity='${o.o == null ? 1 : o.o}' ${o.ls ? `letter-spacing='${o.ls}'` : ''}>${s}</text>`; };
const sun = (x, y, r, o) => { let s = `<g opacity='${o == null ? 1 : o}'>`; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; s += `<line x1='${x + Math.cos(a) * r * 1.25}' y1='${y + Math.sin(a) * r * 1.25}' x2='${x + Math.cos(a) * r * 1.6}' y2='${y + Math.sin(a) * r * 1.6}' stroke='${SUN}' stroke-width='${r * 0.14}' stroke-linecap='round'/>`; } return s + `<circle cx='${x}' cy='${y}' r='${r}' fill='${SUN}' stroke='${LINE}' stroke-width='${Math.max(2, r * 0.06)}'/></g>`; };
const cloud = (x, y, s, o, fill) => `<g opacity='${o == null ? 1 : o}' transform='translate(${x},${y}) scale(${s})'><path d='M-70 30 a38 38 0 0 1 8 -74 a52 52 0 0 1 98 -10 a40 40 0 0 1 34 84 z' fill='${fill || '#f4f1ea'}' stroke='${LINE}' stroke-width='5' stroke-linejoin='round'/></g>`;
const drops = (x, y, s, t, o, n) => { let g = `<g opacity='${o == null ? 1 : o}'>`; for (let i = 0; i < (n || 5); i++) { const ph = ((t * 1.6 + i * 0.37) % 1), dx = (i - ((n || 5) - 1) / 2) * 30 * s; g += `<line x1='${x + dx}' y1='${y + ph * 70 * s}' x2='${x + dx - 8 * s}' y2='${y + ph * 70 * s + 24 * s}' stroke='${RAIN}' stroke-width='${6 * s}' stroke-linecap='round' opacity='${1 - ph * 0.6}'/>`; } return g + '</g>'; };
const head = (T, a) => { const hs = T.h; let s = T.k ? tx(540, 250, T.k, 34, { fill: CORAL, w: 700, ls: 4, o: a }) : ''; hs.forEach((h, i) => { s += tx(540, (hs.length > 1 ? 345 : 370) + i * 96, h, 82, { w: 900, o: a }); }); return s; };
const card = (x, y, w, h, o, fill) => `<rect x='${x}' y='${y}' width='${w}' height='${h}' rx='34' fill='${fill || CARD}' stroke='${LINE}' stroke-width='4' opacity='${o == null ? 1 : o}'/>`;
const src = (s, a) => tx(540, 1490, s, 28, { fill: SOFT, w: 500, o: a });
const pop = p => `transform-origin: center; transform-box: fill-box; transform: scale(${0.86 + 0.14 * p})`;

/* ---------- scenes ---------- */
const SCENES = {
  hook(t, sc) { const T = TXT.hook, L = sc.L; let s = head(T, ramp(t, sc.t0 + 0.15));
    T.rows.forEach((r, i) => { const p = ramp(t, L[i].start - 0.05, 0.45), y = 520 + i * 300, wet = i === 1;
      s += `<g opacity='${p}' style='${pop(p)}'>` + card(90, y, 900, 262, 1, wet ? '#eef3f7' : CARD) + (wet ? cloud(250, y + 110, 1.05, 1, '#d9dee4') + drops(250, y + 150, 1, t, 1) : sun(250, y + 131, 62)) + tx(430, y + 112, r[0], 46, { a: 'start', w: 500, fill: SOFT }) + tx(430, y + 190, r[1], 66, { a: 'start', w: 900, fill: wet ? BLUE : INK }) + '</g>'; });
    return s + tx(540, 1470, T.foot, 44, { w: 700, fill: CORAL, o: ramp(t, L[2].start + 1.0) }); },
  airmass(t, sc) { const T = TXT.airmass, L = sc.L, a = ramp(t, sc.t0 + 0.2); let s = head(T, a);
    const ox = 90, oy = 500, P = pts => pts.map(p => (ox + p[0]) + ',' + (oy + p[1])).join(' ');
    s += `<g opacity='${a}'><rect x='${ox}' y='${oy}' width='900' height='930' rx='40' fill='${SEA}' stroke='${LINE}' stroke-width='4'/>`;
    s += `<clipPath id='mp'><rect x='${ox}' y='${oy}' width='900' height='930' rx='40'/></clipPath><g clip-path='url(#mp)'>`;
    s += `<polygon points='${P([[0, 0], [200, 0], [160, 120], [70, 210], [0, 190]])}' fill='#eef2f4' stroke='${LINE}' stroke-width='3'/>`;                                    // Greenland
    s += `<ellipse cx='${ox + 330}' cy='${oy + 150}' rx='74' ry='36' fill='${LAND}' stroke='${LINE}' stroke-width='3'/>`;                                                   // Iceland
    s += `<polygon points='${P([[600, 300], [650, 288], [640, 350], [692, 380], [662, 440], [702, 520], [732, 600], [766, 640], [742, 700], [764, 742], [690, 762], [600, 770], [538, 792], [590, 732], [612, 700], [568, 690], [560, 640], [600, 630], [612, 588], [600, 540], [622, 500], [590, 470], [602, 420], [560, 400], [582, 340]])}' fill='${LAND}' stroke='${LINE}' stroke-width='3' stroke-linejoin='round'/>`;   // Great Britain
    s += `<polygon points='${P([[420, 520], [472, 500], [494, 560], [482, 640], [432, 682], [382, 660], [392, 580]])}' fill='${LAND}' stroke='${LINE}' stroke-width='3' stroke-linejoin='round'/>`;   // Ireland
    s += `<polygon points='${P([[790, 770], [900, 700], [900, 930], [620, 930], [700, 850]])}' fill='${LAND}' stroke='${LINE}' stroke-width='3'/></g>`;                       // continent
    s += tx(ox + 250, oy + 560, T.atl, 30, { fill: '#7f9db3', w: 700, ls: 6 }) + tx(ox + 800, oy + 905, T.map, 24, { fill: SOFT, w: 500 });
    s += `<circle cx='${ox + 612}' cy='${oy + 588}' r='13' fill='${CORAL}' stroke='#fff' stroke-width='4'/>` + tx(ox + 640, oy + 580, T.liv, 34, { a: 'start', w: 900, fill: CORAL }) + '</g>';
    // polar maritime arrow: from the north-west across the Atlantic to Britain
    const p1 = eio((t - L[1].start) / 2.6), path = `M ${ox + 150} ${oy + 210} C ${ox + 250} ${oy + 380}, ${ox + 380} ${oy + 470}, ${ox + 560} ${oy + 560}`, len = 520;
    if (p1 > 0) { s += `<path d='${path}' fill='none' stroke='${BLUE}' stroke-width='22' stroke-linecap='round' stroke-dasharray='${len}' stroke-dashoffset='${len * (1 - p1)}' opacity='.92'/>`;
      if (p1 > 0.97) s += `<polygon points='${ox + 590},${oy + 574} ${ox + 536},${oy + 580} ${ox + 566},${oy + 530}' fill='${BLUE}'/>`;
      const la = ramp(t, L[1].start + 0.4); s += `<g opacity='${la}'><rect x='${ox + 26}' y='${oy + 236}' width='430' height='112' rx='22' fill='#fff' stroke='${BLUE}' stroke-width='4'/>` + tx(ox + 46, oy + 284, T.pm[0], 36, { a: 'start', w: 900, fill: BLUE }) + tx(ox + 46, oy + 326, T.pm[1], 28, { a: 'start', w: 500, fill: SOFT }) + '</g>'; }
    const p2 = ramp(t, L[2].start + 0.3, 0.8);   // warms + moisture: dots rising off the sea along the track
    if (p2 > 0) { for (let i = 0; i < 9; i++) { const u = i / 8, bx = ox + 230 + u * 290, by = oy + 430 + u * 110, ph = (t * 0.7 + i * 0.21) % 1; s += `<circle cx='${bx}' cy='${by - ph * 46}' r='${7 - ph * 3}' fill='${RAIN}' opacity='${p2 * (1 - ph)}'/>`; }
      s += `<g opacity='${p2}'><rect x='${ox + 110}' y='${oy + 640}' width='420' height='70' rx='20' fill='#fff' stroke='${RAIN}' stroke-width='3'/>` + tx(ox + 320, oy + 687, T.pm2, 32, { w: 700, fill: BLUE }) + '</g>'; }
    const p3 = ramp(t, L[3].start + 0.2, 0.7);   // unstable → showers over Britain
    if (p3 > 0) { [[540, 440, 0.8], [700, 500, 0.9], [650, 690, 0.8]].forEach((c, i) => { const q = ramp(t, L[3].start + 0.2 + i * 0.35, 0.5); s += `<g opacity='${q}'>` + cloud(ox + c[0], oy + c[1], c[2], 1, '#e3e7ec') + drops(ox + c[0], oy + c[1] + 34 * c[2], c[2] * 0.8, t + i * 0.3, 1, 4) + '</g>'; });
      s += `<g opacity='${p3}' style='${pop(p3)}'><rect x='${ox + 440}' y='${oy + 790}' width='430' height='80' rx='24' fill='${CORAL}'/>` + tx(ox + 655, oy + 843, T.unstable, 34, { w: 900, fill: '#fff' }) + '</g>'; }
    const p0 = ramp(t, L[0].start + 1.4, 0.8) * (1 - ramp(t, L[2].start, 0.5));   // "different air masses": a second, mild one from the south-west (context)
    if (p0 > 0) s += `<g opacity='${p0 * 0.9}'><path d='M ${ox + 200} ${oy + 850} C ${ox + 320} ${oy + 800}, ${ox + 430} ${oy + 760}, ${ox + 520} ${oy + 720}' fill='none' stroke='#d08a4a' stroke-width='16' stroke-linecap='round' stroke-dasharray='10 22'/>` + tx(ox + 40, oy + 750, T.tm[0], 30, { a: 'start', w: 900, fill: '#a8642a' }) + tx(ox + 40, oy + 786, T.tm[1], 26, { a: 'start', w: 500, fill: SOFT }) + '</g>';
    return s + src(T.src, a); },
  showers(t, sc) { const T = TXT.showers, L = sc.L, a = ramp(t, sc.t0 + 0.2); let s = head(T, a);
    const x0 = 140, y0 = 540, G = 800, u = c01((t - L[0].start - 0.4) / (sc.t1 - L[0].start - 0.8)), cx = x0 + lerp(120, 560, eio(u)), cy = y0 + lerp(640, 300, eio(u)), R = 150;
    s += `<g opacity='${a}'><rect x='${x0}' y='${y0}' width='${G}' height='${G}' rx='30' fill='#efe7d2' stroke='${LINE}' stroke-width='4'/><clipPath id='gr'><rect x='${x0}' y='${y0}' width='${G}' height='${G}' rx='30'/></clipPath><g clip-path='url(#gr)'>`;
    for (let i = 1; i < 6; i++) s += `<rect x='${x0 + i * 133 - 9}' y='${y0}' width='18' height='${G}' fill='#fff'/><rect x='${x0}' y='${y0 + i * 133 - 9}' width='${G}' height='18' fill='#fff'/>`;
    // wet trail where the shower has passed (a diagonal band), then the shower itself
    s += `<line x1='${x0 + 120}' y1='${y0 + 640}' x2='${cx}' y2='${cy}' stroke='${RAIN}' stroke-width='${R * 2}' stroke-linecap='round' opacity='.28'/>`;
    s += `<circle cx='${cx}' cy='${cy}' r='${R}' fill='${RAIN}' opacity='.38'/></g>` + cloud(cx, cy - 20, 1.5, 1, '#dfe4ea') + drops(cx, cy + 40, 1.2, t, 1, 6);
    s += `<line x1='${x0 + 40}' y1='${y0 + G - 44}' x2='${x0 + 40 + R * 2}' y2='${y0 + G - 44}' stroke='${LINE}' stroke-width='6'/>` + tx(x0 + 40 + R, y0 + G - 60, T.scale, 30, { w: 700 }) + '</g>';
    const pa = ramp(t, L[0].start + 2.0); s += `<g opacity='${pa}' style='${pop(pa)}'><rect x='330' y='1372' width='420' height='78' rx='24' fill='${BLUE}'/>` + tx(540, 1424, T.size, 36, { w: 900, fill: '#fff' }) + '</g>';
    const pb = ramp(t, L[2].start + 0.2); s += `<g opacity='${pb}'><rect x='${x0 + 60}' y='${y0 + 596}' width='330' height='64' rx='18' fill='${BLUE}'/>` + tx(x0 + 225, y0 + 640, T.a, 30, { w: 700, fill: '#fff' }) + `<rect x='${x0 + 450}' y='${y0 + 596}' width='300' height='64' rx='18' fill='#fff' stroke='${LINE}' stroke-width='3'/>` + tx(x0 + 600, y0 + 640, T.b, 30, { w: 700 }) + '</g>';
    return s + src(T.src, a); },
  daylight(t, sc) { const T = TXT.daylight, L = sc.L, a = ramp(t, sc.t0 + 0.2); let s = head(T, a);
    const partB = ramp(t, L[3].start - 0.2, 0.6), ya = lerp(0, -40, partB);
    const bar = (y, label, val, sr, ss, t0, tv, ta) => { const p = eio((t - t0) / 1.2), pv = ramp(t, tv == null ? t0 : tv), x = 110, w = 860, xs = x + w * sr / 24, xe = x + w * lerp(sr, ss, p) / 24; let g = `<g opacity='${ramp(t, ta == null ? t0 - 0.2 : ta)}'>` + tx(x, y - 26, label, 40, { a: 'start', w: 900 }) + tx(x + w, y - 26, val, 40, { a: 'end', w: 900, fill: CORAL, o: pv }) + `<rect x='${x}' y='${y}' width='${w}' height='84' rx='22' fill='#2d3a55'/><rect x='${xs}' y='${y}' width='${Math.max(0, xe - xs)}' height='84' fill='${SUN}'/><rect x='${x}' y='${y}' width='${w}' height='84' rx='22' fill='none' stroke='${LINE}' stroke-width='4'/>`;
      [0, 6, 12, 18, 24].forEach(h => { g += tx(x + w * h / 24, y + 122, String(h).padStart(2, '0') + ':00', 24, { fill: SOFT, w: 500 }); }); return g + '</g>'; };
    s += `<g transform='translate(0,${ya})'>` + bar(590, T.dec, T.decv, EP.sun.dec[0], EP.sun.dec[1], L[1].start + 0.2, L[2].start + 1.2, L[0].start + 0.3) + bar(850, T.jun, T.junv, EP.sun.jun[0], EP.sun.jun[1], L[2].start + 3.2) + '</g>';
    { const mk = ramp(t, L[1].start + 1.3) * (1 - partB), xs = 110 + 860 * EP.sun.dec[0] / 24, xe = 110 + 860 * EP.sun.dec[1] / 24;   // sunrise / sunset markers on the December bar
      s += `<g opacity='${mk}'><line x1='${xs}' y1='${560 + ya}' x2='${xs}' y2='${690 + ya}' stroke='${CORAL}' stroke-width='5'/><line x1='${xe}' y1='${560 + ya}' x2='${xe}' y2='${690 + ya}' stroke='${CORAL}' stroke-width='5'/>` + tx(xs - 12, 760 + ya, T.rise, 30, { a: 'end', w: 700, fill: CORAL }) + tx(xe + 12, 760 + ya, T.set, 30, { a: 'start', w: 700, fill: CORAL }) + '</g>'; }
    s += tx(540, 1010 + ya, T.calc, 26, { fill: SOFT, w: 500, o: ramp(t, L[2].start) });
    if (partB > 0) { s += `<g opacity='${partB}'>` + card(90, 1030, 900, 420) + tx(140, 1100, T.def[0], 40, { a: 'start', w: 900, fill: CORAL }) + tx(140, 1146, T.def[1], 30, { a: 'start', w: 500, fill: SOFT });
      const q = ramp(t, L[4].start + 2.2, 0.7), fill = eio((t - L[4].start - 2.4) / 1.4);
      s += `<g opacity='${q}'>` + tx(140, 1262, T.stat, 96, { a: 'start', w: 900 }) + tx(480, 1222, T.statl[0], 32, { a: 'start', w: 700 }) + tx(480, 1262, T.statl[1], 28, { a: 'start', w: 500, fill: SOFT });
      s += `<rect x='140' y='1300' width='800' height='46' rx='16' fill='#e6dcc4' stroke='${LINE}' stroke-width='3'/><rect x='140' y='1300' width='${800 * (40 / 232) * fill}' height='46' rx='16' fill='${SUN}' stroke='${LINE}' stroke-width='3'/>` + tx(940, 1386, T.of, 28, { a: 'end', w: 700, fill: SOFT }) + tx(140, 1426, T.region, 24, { a: 'start', w: 500, fill: SOFT }) + '</g></g>'; }
    return s; },
  seasons(t, sc) { const T = TXT.seasons, L = sc.L, a = ramp(t, sc.t0 + 0.2); let s = head(T, a);
    const m = eio((t - L[3].start + 0.2) / 1.6), ang = lerp(13.2, 60, m) * Math.PI / 180, gy = 1330, px = 250, ph = 180, hx = px, hy = gy - ph, sh = ph / Math.tan(ang);
    s += `<g opacity='${a}'>` + card(60, 540, 960, 900, 1, '#f3ede0');
    // sky: two midday heights on one arc of angles
    for (const d of [13.2, 60]) { const r = d * Math.PI / 180; s += `<line x1='${hx}' y1='${hy}' x2='${hx - Math.cos(r) * 640}' y2='${hy - Math.sin(r) * 640}' stroke='${SUN}' stroke-width='3' stroke-dasharray='8 14' opacity='.55'/>`; }
    const sx = hx - Math.cos(ang) * 560, sy = hy - Math.sin(ang) * 560; s += sun(Math.max(130, sx + 430), sy, 54);   // sun drawn on the far side so it stays in frame
    // ray from the sun over the head to the ground, shadow on the ground
    s += `<line x1='${Math.max(130, sx + 430)}' y1='${sy}' x2='${px + sh}' y2='${gy}' stroke='${SUN}' stroke-width='5' opacity='.8'/>`;
    s += `<line x1='90' y1='${gy}' x2='990' y2='${gy}' stroke='${LINE}' stroke-width='6'/><line x1='${px}' y1='${gy}' x2='${Math.min(985, px + sh)}' y2='${gy}' stroke='#3a3f4c' stroke-width='22' stroke-linecap='round' opacity='.75'/>`;
    s += `<circle cx='${px}' cy='${hy + 24}' r='24' fill='${CORAL}' stroke='${LINE}' stroke-width='4'/><rect x='${px - 20}' y='${hy + 50}' width='40' height='${ph - 50}' rx='16' fill='${CORAL}' stroke='${LINE}' stroke-width='4'/>`;
    const deg = Math.round(lerp(13, 60, m)); s += `<path d='M ${px + sh - 110} ${gy} A 110 110 0 0 0 ${px + sh - 110 * Math.cos(ang)} ${gy - 110 * Math.sin(ang)}' fill='none' stroke='${CORAL}' stroke-width='5'/>`;
    const wl = (1 - ramp(t, L[3].start - 0.1, 0.4)) * ramp(t, L[1].start + 0.3), sl = ramp(t, L[3].start + 1.0);
    s += `<g opacity='${wl}'>` + tx(760, 660, T.w, 44, { w: 700, fill: SOFT }) + tx(760, 770, T.wdeg, 104, { w: 900 }) + '</g>' + `<g opacity='${sl}'>` + tx(760, 660, T.s, 44, { w: 700, fill: SOFT }) + tx(760, 770, T.sdeg, 104, { w: 900 }) + '</g>';
    const w2 = (1 - ramp(t, L[3].start - 0.1, 0.4)) * ramp(t, L[2].start + 0.2), s2 = ramp(t, L[3].start + 2.2);
    s += `<g opacity='${w2}'><rect x='250' y='1352' width='580' height='70' rx='22' fill='${INK}'/>` + tx(540, 1400, T.wsh, 34, { w: 900, fill: '#fff' }) + '</g>' + `<g opacity='${s2}'><rect x='230' y='1352' width='620' height='70' rx='22' fill='${INK}'/>` + tx(540, 1400, T.ssh, 34, { w: 900, fill: '#fff' }) + '</g></g>';
    return s + src(T.note, a); },
  forecast(t, sc) { const T = TXT.forecast, L = sc.L, a = ramp(t, sc.t0 + 0.2); let s = head(T, a);
    const dim = ramp(t, L[0].start + 2.4, 0.5);
    s += `<g opacity='${a * (1 - dim * 0.62)}'>` + card(90, 540, 900, 250) + sun(250, 650, 48) + cloud(290, 690, 0.95, 1, '#e9e6de') + tx(420, 650, T.day, 40, { a: 'start', w: 900 }) + tx(420, 706, T.hides, 34, { a: 'start', w: 500, fill: SOFT }) + '</g>';
    if (dim > 0) s += `<line x1='130' y1='760' x2='${130 + 820 * dim}' y2='570' stroke='${CORAL}' stroke-width='10' stroke-linecap='round' opacity='.85'/>`;
    const hrs = [['12:00', 's', '10%'], ['13:00', 'r', '70%'], ['14:00', 's', '20%'], ['15:00', 'r', '60%'], ['16:00', 's', '<5%']], hp = ramp(t, L[0].start + 3.0, 0.6);
    s += `<g opacity='${hp}'>` + card(90, 850, 900, 420) + tx(540, 912, T.ill, 26, { fill: CORAL, w: 700, ls: 2 });
    const hot = ramp(t, L[1].start + 1.6, 0.4);
    hrs.forEach((h, i) => { const x = 180 + i * 180, q = ramp(t, L[0].start + 3.1 + i * 0.12, 0.4), is = i === 1;
      s += `<g opacity='${q}'>` + (is ? `<rect x='${x - 82}' y='936' width='164' height='310' rx='26' fill='${CORAL}' opacity='${0.16 * hot}'/><rect x='${x - 82}' y='936' width='164' height='310' rx='26' fill='none' stroke='${CORAL}' stroke-width='${6 * hot}'/>` : '') + tx(x, 990, h[0], 34, { w: 700 }) + (h[1] === 's' ? sun(x, 1080, 34) : cloud(x, 1070, 0.62, 1, '#dfe4ea') + drops(x, 1096, 0.6, t + i, 1, 3)) + tx(x, 1210, h[2], 44, { w: 900, fill: h[1] === 'r' ? BLUE : INK }) + '</g>'; });
    s += '</g>';
    const cp = ramp(t, L[1].start + 2.2, 0.5); s += `<g opacity='${cp}' style='${pop(cp)}'><rect x='150' y='1290' width='780' height='126' rx='30' fill='${INK}'/>` + tx(540, 1344, T.call[0], 44, { w: 900, fill: '#fff' }) + tx(540, 1390, T.call[1], 30, { w: 500, fill: '#e8e3d8' }) + '</g>';
    const np = ramp(t, L[2].start, 0.4); s += `<g opacity='${np}' style='${pop(np)}'><rect x='390' y='1428' width='300' height='58' rx='20' fill='${CORAL}'/>` + tx(540, 1468, T.not, 30, { w: 900, fill: '#fff' }) + '</g>';
    return s + tx(540, 1530, T.src, 26, { fill: SOFT, w: 500, o: a }); },
  close(t, sc) { const T = TXT.close, L = sc.L, a = ramp(t, sc.t0 + 0.2); let s = '';
    s += `<g opacity='${a}'>` + sun(360, 620, 92) + cloud(690, 640, 1.9, 1, '#dfe4ea') + drops(690, 720, 1.5, t, 1, 6) + '</g>';
    T.h.forEach((h, i) => { s += tx(540, 960 + i * 116, h, 96, { w: 900, o: ramp(t, L[0].start + i * 0.7) }); });
    s += tx(540, 1250, T.h2, 62, { w: 900, fill: CORAL, o: ramp(t, L[1].start + 0.2) });
    return s + tx(540, 1490, T.src, 26, { fill: SOFT, w: 500, o: ramp(t, L[1].start + 1.2) }); }
};

/* ---------- overlay: explainer scenes, insert banner, captions ---------- */
const ex = document.createElement('div'); ex.id = 'ex'; Object.assign(ex.style, { position: 'absolute', inset: '0', pointerEvents: 'none' }); document.body.insertBefore(ex, document.getElementById('veil'));
const wrapCap = s => { const words = s.split(' '), out = ['']; for (const w of words) { if ((out[out.length - 1] + ' ' + w).trim().length > 38) out.push(w); else out[out.length - 1] = (out[out.length - 1] + ' ' + w).trim(); } return out; };
const INS = SC.insert, XF = 0.45;
S.during(0, END + 1, (u, t) => {
  const order = Object.keys(SC); let cur = order.find(id => t >= SC[id].t0 && t < SC[id].t1) || order[order.length - 1];
  const insA = c01((t - INS.t0) / XF) * (1 - c01((t - (INS.t1 - XF)) / XF));   // 1 while the product insert is on screen
  let s = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1080 1920' width='1080' height='1920'>`;
  if (insA < 1) { s += `<rect width='1080' height='1920' fill='#fbf8f2' opacity='${1 - insA}'/><rect width='1080' height='1920' fill='url(#bgg)' opacity='${1 - insA}'/><defs><radialGradient id='bgg' cx='50%' cy='45%' r='75%'><stop offset='0' stop-color='#fbf8f2'/><stop offset='.6' stop-color='#f4eee3'/><stop offset='1' stop-color='#ebe3d2'/></radialGradient></defs>`;
    const id = cur === 'insert' ? (t < (INS.t0 + INS.t1) / 2 ? order[order.indexOf('insert') - 1] : order[order.indexOf('insert') + 1]) : cur, sc = SC[id];
    const fa = Math.min(1, c01((t - sc.t0) / 0.3), id === order[order.length - 1] ? 1 : c01((sc.t1 - t) / 0.3 + (cur === 'insert' ? 1 : 0)));
    s += `<g opacity='${(1 - insA) * (cur === 'insert' ? 1 : fa)}'>` + SCENES[id](t, sc) + '</g>'; }
  if (insA > 0) { const L = INS.L, lp = ramp(t, L[5].start - 0.1, 0.4) * insA; if (lp > 0) s += `<g opacity='${lp}' style='${pop(lp)}'><rect x='90' y='250' width='900' height='140' rx='34' fill='${INK}'/>` + tx(540, 310, TXT.insert.limit[0], 42, { w: 900, fill: '#ffd9a8' }) + tx(540, 360, TXT.insert.limit[1], 32, { w: 500, fill: '#fff' }) + '</g>'; }
  if (!NOCAP) { const c = EP.captions.find(c => t >= c.start - 0.05 && t <= c.end + 0.12); if (c) { const ls = wrapCap(c.text), h = ls.length * 58 + 44, y = 1760 - h, ca = Math.min(1, c01((t - c.start + 0.05) / 0.1), c01((c.end + 0.12 - t) / 0.1));
    s += `<g opacity='${ca}'><rect x='70' y='${y}' width='940' height='${h}' rx='28' fill='#16171a' opacity='.86'/>` + ls.map((l, i) => tx(540, y + 64 + i * 58, l.replace(/&/g, '&amp;'), 42, { w: 700, fill: '#fff' })).join('') + '</g>'; } }
  ex.innerHTML = s + '</svg>';
});

/* ---------- product insert: the real sunlight reference tool ---------- */
const I = INS.L, PH = (fy, k) => ({ fx: 195, fy: fy + 145 / k, k });   // +145/k: the picture's centre sits above the caption strip
const FULL = PH(396, 1.2);   // whole phone, clear of title and captions
S.cam(0, 0.001, FULL, 'lin');
const CAMTO = (t, tg, dur, ease) => S.cam(t - (dur || 0.6), dur || 0.6, tg, ease || 'apple');
S.tapSfx = 'tick'; S.tapEarly = 0.08;
S.tracks.rise = K(0, { y: 2300 }).hold(INS.t0 - 0.1).to(INS.t0 + 0.75, { y: 0 }, 'apple').hold(INS.t1 - 0.7).to(INS.t1 + 0.1, { y: 2300 }, 'in').fn();
S.tracks.veil = K(0, { o: 0 }).hold(END - 0.7).to(END, { o: 1 }, 'in').fn();
const marker = w => [...w.document.querySelectorAll('#homes > *')].find(e => vis(e) && e.textContent.trim() === '37');
S.at(0.4, () => { try { W().HomeMatch.exit(); } catch (e) {} });
S.at(2.0, () => { const w = W(); try { w.show(homeById(w, HOME), true); } catch (e) {} });   // centre the map on the building while the explainer plays…
S.at(4.0, () => { try { W().hide(); } catch (e) {} const c = D_().getElementById('cardX'); if (c && vis(c)) c.click(); });   // …then close its card: the insert opens it for real
S.title(INS.t0 + 0.35, I[1].start + 2.2, { k: TXT.insert.k, h: TXT.insert.h, s: TXT.insert.s, fade: 0.35 });
S.sfx(INS.t0 + 0.1, 'whoosh-up', 0.5);
// "Pick a building, open the sunlight reference, and drag through the day."
S.tap(I[1].start + 0.35, marker, { lead: 0.3, sfx: 'pop', fn: () => { const w = W(); w.show(homeById(w, HOME), true); } });
S.tap(I[1].start + 1.75, byText('.hi-rb', '日照'), { lead: 0.3, sfx: 'pop' });
CAMTO(I[1].start + 2.9, PH(450, 1.72), 0.8);
const chipRow = w => { const c = byText('.hi-panel .bt-chipbtn', '冬至')(w); return c && c.parentElement; };
S.note(I[1].start + 2.6, I[2].start + 0.9, chipRow, TXT.insert.winter, { pos: 'top', pad: 4 });
S.slide(I[1].start + 3.0, I[2].start - 0.1, '.hi-panel input[type=range]', 720, 560);
// "Switch between the winter and summer solstice,"
S.slide(I[2].start + 0.1, I[2].start + 1.0, '.hi-panel input[type=range]', 560, 900);
S.tap(I[2].start + 1.5, w => [...w.document.querySelectorAll('.hi-panel .bt-chipbtn')].find(b => vis(b) && b.textContent.trim() === '夏至'), { lead: 0.3, sfx: 'pop' });
S.note(I[2].start + 1.7, I[3].start + 0.8, chipRow, TXT.insert.summer, { pos: 'top', pad: 4 });
// "and you can see where the sun sits and which outer walls face it."
S.slide(I[3].start + 0.2, I[3].start + 2.3, '.hi-panel input[type=range]', 900, 600);
CAMTO(I[3].start + 0.9, PH(360, 1.9), 0.8);
S.note(I[3].start + 0.9, I[3].start + 2.6, w => ({ getBoundingClientRect: () => ({ left: 70, top: 120, width: 250, height: 250 }) }), TXT.insert.sun, { pos: 'bottom', box: false });
S.scroll(I[3].start + 2.5, I[3].start + 3.2, ...scrollTo(leafIn('.hi-panel', '外墙'), 0.35));
CAMTO(I[3].start + 3.3, PH(520, 1.85), 0.8);
S.note(I[3].start + 3.3, I[4].start + 1.6, leafIn('.hi-panel', '外墙'), TXT.insert.walls, { pos: 'top', pad: 6 });
// "It's a guide to orientation, and a starting point for asking about a specific room."
S.slide(I[4].start + 0.3, I[4].start + 3.4, '.hi-panel input[type=range]', 600, 1020);
CAMTO(I[4].start + 2.4, FULL, 1.2);
// "It doesn't account for neighbouring buildings, cloud, or light indoors." → the tool's own note about what it covers
S.scroll(I[5].start - 0.2, I[5].start + 0.8, ...scrollTo(leafIn('.hi-panel', '仅计算图示楼体'), 0.3));
S.mark(I[5].start + 0.9, INS.t1 - 0.8, leafIn('.hi-panel', '仅计算图示楼体'), { pad: 6 });
S.sfx(INS.t1 - 0.6, 'whoosh', 0.4);
