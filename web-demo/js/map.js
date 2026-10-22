/* 手绘风格利物浦地图（SVG）。坐标用网页版同一套 raw() 投影（约 10 米一个单位），
   所以步行估算、Top 3 和地图位置一一对应。支持拖动、滚轮/按钮缩放，标记大小不随缩放变化。 */
(function (root) {
  'use strict';
  const { GEO } = root.DemoData;
  const LON0 = -3.015, LAT0 = 53.448, KX = 6638.0, KY = 11132.0;
  const P = (lat, lon) => [(lon - LON0) * KX, (LAT0 - lat) * KY];
  const pts = arr => arr.map(([la, lo]) => P(la, lo).map(v => v.toFixed(1)).join(',')).join(' ');
  const DEF = { x: 150, y: 300, w: 330, h: 260 };
  let vb = Object.assign({}, DEF);

  /* 平滑曲线：把折线点变成二次贝塞尔，看起来像手画 */
  function curve(arr) {
    const p = arr.map(([la, lo]) => P(la, lo));
    let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
      d += ` Q${p[i][0].toFixed(1)} ${p[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    const l = p[p.length - 1];
    return d + ` L${l[0].toFixed(1)} ${l[1].toFixed(1)}`;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function base(lang) {
    const L = o => lang === 'en' ? o.en : o.zh;
    const shore = GEO.shore;
    const water = pts(shore) + ' ' + pts([[53.378, -3.06], [53.432, -3.06]]);
    const wirral = pts([[53.432, -3.034], [53.420, -3.030], [53.408, -3.027], [53.396, -3.024], [53.384, -3.016], [53.378, -3.010], [53.378, -3.08], [53.432, -3.08]]);
    const river = P(...GEO.river.p);
    return `
      <defs>
        <filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="6" stroke="#4f8f98" stroke-width="1" opacity=".35"/></pattern>
        <pattern id="paperdots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r=".6" fill="#c9b48d" opacity=".55"/><circle cx="10" cy="11" r=".5" fill="#c9b48d" opacity=".45"/></pattern>
      </defs>
      <rect x="-400" y="0" width="1600" height="1000" fill="#e9dcbc"/>
      <rect x="-400" y="0" width="1600" height="1000" fill="url(#paperdots)"/>
      <g filter="url(#wob)">
        <polygon points="${water}" fill="#9fc6c9" stroke="#3b2a1a" stroke-width="2.2" stroke-linejoin="round"/>
        <polygon points="${water}" fill="url(#hatch)"/>
        <polygon points="${wirral}" fill="#e2d3ae" stroke="#3b2a1a" stroke-width="2"/>
        ${GEO.docks.map(d => `<polygon points="${pts(d)}" fill="#9fc6c9" stroke="#3b2a1a" stroke-width="1.4"/>`).join('')}
        ${GEO.parks.map(pk => { const c = P(...pk.c); return `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${pk.r[0]}" ry="${pk.r[1]}" fill="#b9cf9a" stroke="#3b2a1a" stroke-width="1.6"/>`; }).join('')}
        ${GEO.roads.map(r => `<path d="${curve(r)}" fill="none" stroke="#fffaf0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
        ${GEO.roads.map(r => `<path d="${curve(r)}" fill="none" stroke="#c9b48d" stroke-width="1.1" stroke-linecap="round"/>`).join('')}
        <path d="${curve(GEO.rail)}" fill="none" stroke="#6e5538" stroke-width="2" stroke-dasharray="5 3"/>
      </g>
      <g class="maplabels" font-family="Patrick Hand, ZCOOL KuaiLe, cursive">
        <text class="lbl-scale" data-x="${river[0]}" data-y="${river[1]}" fill="#2f6b73" font-size="13" font-style="italic" text-anchor="middle" transform="rotate(-72 ${river[0]} ${river[1]})" x="${river[0]}" y="${river[1]}">${esc(L(GEO.river))}</text>
        ${GEO.parks.map(pk => { const c = P(...pk.c); return `<text class="lbl" data-x="${c[0]}" data-y="${c[1] + 2}" fill="#4b6a2c" font-size="8" text-anchor="middle">${esc(L(pk))}</text>`; }).join('')}
        ${GEO.landmarks.map(lm => { const c = P(...lm.p); return `<g class="lm" data-x="${c[0]}" data-y="${c[1]}"><rect x="-2.2" y="-2.2" width="4.4" height="4.4" fill="${lm.k === 'rail' ? '#3b2a1a' : '#fffaf0'}" stroke="#3b2a1a" stroke-width="1" transform="rotate(45)"/><text x="5" y="3" fill="#6e5538" font-size="8">${esc(L(lm))}</text></g>`; }).join('')}
      </g>`;
  }

  function pinsSvg(o) {
    const L = c => o.lang === 'en' ? c.en : c.zh;
    const campuses = GEO.campuses.map(c => { const p = P(...c.p);
      return `<g class="pin campus" data-x="${p[0]}" data-y="${p[1]}" aria-hidden="true">
        <path d="M0 0 L0 -15" stroke="#3b2a1a" stroke-width="1.6"/><path d="M0 -15 L11 -11.5 L0 -8 Z" fill="#b5462f" stroke="#3b2a1a" stroke-width="1.2"/>
        <text x="3" y="9" font-size="9" fill="#b5462f" font-weight="800" font-family="Nunito, sans-serif" paint-order="stroke" stroke="#fffaf0" stroke-width="3">${esc(L(c))}</text></g>`; }).join('');
    const homes = o.homes.slice().sort((a, b) => (o.topIds.indexOf(a.id) >= 0) - (o.topIds.indexOf(b.id) >= 0) || (a.id === o.selected) - (b.id === o.selected)).map(h => {
      const p = P(h.lat, h.lng), rank = o.topIds.indexOf(h.id) + 1, sel = h.id === o.selected;
      const fill = rank ? '#e8735a' : '#2c5c8a', r = rank || sel ? 10 : 7.5;
      return `<g class="pin home${sel ? ' sel' : ''}" data-id="${h.id}" data-x="${p[0]}" data-y="${p[1]}" role="button" tabindex="0" aria-label="${h.n} ${esc(h.name)}">
        ${sel ? `<circle r="${r + 6}" fill="rgba(242,193,78,.6)"/>` : ''}
        <circle r="${r}" fill="${fill}" stroke="#3b2a1a" stroke-width="1.8"/>
        <text y="${rank ? 3.5 : 3}" text-anchor="middle" font-size="${rank ? 10 : 8.5}" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">${h.n}</text>
        ${rank ? `<text x="${r + 2}" y="-6" font-size="10" fill="#b5462f" font-family="Patrick Hand, cursive" paint-order="stroke" stroke="#fffaf0" stroke-width="3">★${rank}</text>` : ''}
      </g>`;
    }).join('');
    return campuses + homes;
  }

  function mount(el, opts) {
    el.innerHTML = `<svg class="mapsvg" role="img" aria-label="${opts.lang === 'en' ? 'Hand-drawn map of student homes in Liverpool' : '利物浦学生公寓手绘地图'}"><g class="base"></g><g class="pins"></g></svg>
      <div class="mapctl"><button type="button" data-z="-1" aria-label="Zoom in">+</button><button type="button" data-z="1" aria-label="Zoom out">−</button><button type="button" data-z="0" aria-label="Reset map">⟲</button></div>`;
    const svg = el.querySelector('svg'), gBase = svg.querySelector('.base'), gPins = svg.querySelector('.pins');
    let o = opts, lastLang = null;

    function apply() {
      svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
      const k = vb.w / DEF.w;
      svg.querySelectorAll('[data-x]').forEach(n => {
        const x = n.getAttribute('data-x'), y = n.getAttribute('data-y');
        if (n.classList.contains('lbl-scale')) return;
        n.setAttribute('transform', `translate(${x} ${y}) scale(${k.toFixed(3)})`);
        if (n.classList.contains('lbl')) { n.setAttribute('x', 0); n.setAttribute('y', 0); }
      });
    }
    function render(next) {
      o = Object.assign({}, o, next || {});
      if (lastLang !== o.lang) { gBase.innerHTML = base(o.lang); lastLang = o.lang; }
      gPins.innerHTML = pinsSvg(o);
      apply();
    }
    function zoom(f, cx, cy) {
      const nw = Math.min(900, Math.max(70, vb.w * f)), nh = nw * (vb.h / vb.w);
      if (cx == null) { cx = vb.x + vb.w / 2; cy = vb.y + vb.h / 2; }
      vb.x = cx - (cx - vb.x) * (nw / vb.w); vb.y = cy - (cy - vb.y) * (nh / vb.h); vb.w = nw; vb.h = nh;
      apply();
    }
    function fitAspect() {
      const r = svg.getBoundingClientRect();
      if (r.width && r.height) { const cy = vb.y + vb.h / 2; vb.h = vb.w * r.height / r.width; vb.y = cy - vb.h / 2; }
    }
    function focus(ids) {
      const list = o.homes.filter(h => ids.includes(h.id));
      if (!list.length) return;
      const ps = list.map(h => P(h.lat, h.lng)), xs = ps.map(p => p[0]), ys = ps.map(p => p[1]);
      const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
      const r = svg.getBoundingClientRect(), asp = r.width && r.height ? r.height / r.width : vb.h / vb.w;
      let w = Math.max(110, (maxx - minx) * 1.6), h = w * asp;
      if ((maxy - miny) * 1.6 > h) { h = (maxy - miny) * 1.6; w = h / asp; }
      vb = { x: (minx + maxx) / 2 - w / 2, y: (miny + maxy) / 2 - h / 2, w, h };
      apply();
    }

    let drag = null;
    svg.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y, moved: false, id: e.pointerId }; });
    svg.addEventListener('pointermove', e => {
      if (!drag) return;
      const r = svg.getBoundingClientRect(), dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; try { svg.setPointerCapture(drag.id); } catch (err) { /* 旧浏览器 */ } }
      if (drag.moved) { vb.x = drag.vx - dx * vb.w / r.width; vb.y = drag.vy - dy * vb.h / r.height; apply(); }
    });
    svg.addEventListener('pointerup', e => {
      const d = drag; drag = null;
      if (d && !d.moved) { const pin = e.target.closest('.pin.home'); if (pin && o.onPick) o.onPick(pin.dataset.id); }
    });
    svg.addEventListener('pointercancel', () => { drag = null; });
    svg.addEventListener('keydown', e => { const pin = e.target.closest('.pin.home'); if (pin && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); o.onPick && o.onPick(pin.dataset.id); } });
    svg.addEventListener('wheel', e => {
      e.preventDefault();
      const r = svg.getBoundingClientRect(), cx = vb.x + (e.clientX - r.left) / r.width * vb.w, cy = vb.y + (e.clientY - r.top) / r.height * vb.h;
      zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15, cx, cy);
    }, { passive: false });
    el.querySelector('.mapctl').addEventListener('click', e => {
      const b = e.target.closest('[data-z]'); if (!b) return;
      const z = +b.dataset.z;
      if (z === 0) { vb = Object.assign({}, DEF); fitAspect(); apply(); } else zoom(z < 0 ? 1 / 1.4 : 1.4);
    });
    render();
    requestAnimationFrame(() => { fitAspect(); apply(); });
    return { render, focus, zoom };
  }
  root.MapView = { mount, project: P, resetView() { vb = Object.assign({}, DEF); } };
})(typeof globalThis !== 'undefined' ? globalThis : this);
