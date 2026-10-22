/* 手绘利物浦地图：底图、地标插画和公寓位置直接取自网页原版（js/vendor/basemap.js，由 scripts/build-basemap.cjs 导出），
   保留原版的"游客地图"变形投影和防重叠排布。这里只负责拖动、缩放和公寓标记。
   标记在缩小时保持可读的最小尺寸，放大后按原版比例显示。 */
(function (root) {
  'use strict';
  const B = root.LSM_BASEMAP;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const posOf = h => B.homes[h.n];

  /* 默认视图：框住市中心一带的公寓（1–34 号），其余可拖动或缩小查看 */
  const DEF = (() => {
    const ps = Object.keys(B.homes).filter(n => +n <= 34).map(n => B.homes[n]), xs = ps.map(p => p[0]), ys = ps.map(p => p[1]);
    const x0 = Math.min(...xs) - 50, x1 = Math.max(...xs) + 50, y0 = Math.min(...ys) - 60, y1 = Math.max(...ys) + 40;
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  })();
  let vb = Object.assign({}, DEF), fitted = false;

  function placesSvg(lang) {
    return B.places.map(p => `<g class="pin place" data-type="${p.t}" data-x="${p.p[0]}" data-y="${p.p[1]}" data-s=".8" aria-hidden="true">
      <use href="${p.use}"/>${p.label ? `<text class="lbl" y="34" font-size="${p.use.startsWith('#a-') ? 19 : 17}">${esc(p.name[lang === 'en' ? 'en' : 'zh'])}</text>` : ''}</g>`).join('');
  }
  function pinsSvg(o) {
    const order = o.homes.slice().sort((a, b) => (o.topIds.indexOf(a.id) >= 0) - (o.topIds.indexOf(b.id) >= 0) || (a.id === o.selected) - (b.id === o.selected));
    return order.map(h => {
      const p = posOf(h), rank = o.topIds.indexOf(h.id) + 1, sel = h.id === o.selected;
      return `<g class="pin home${sel ? ' on' : ''}${rank ? ' top' : ''}" data-id="${h.id}" data-x="${p[0]}" data-y="${p[1]}" data-s="1" role="button" tabindex="0" aria-label="${h.n} ${esc(h.name)}">
        <g class="in">
          <circle class="ring" r="22" fill="${sel ? 'rgba(242,193,78,.75)' : rank ? 'rgba(232,115,90,.35)' : 'transparent'}" stroke="${rank ? '#b5462f' : 'none'}" stroke-width="${rank ? 2.5 : 0}"/>
          <use href="#i-home"/>
          <g class="badge"><circle cx="13" cy="-15" r="10.5" fill="${rank ? '#e8735a' : '#2c5c8a'}" stroke="#fffaf0" stroke-width="2"/><text class="num" x="13" y="-10.5">${h.n}</text></g>
          ${rank ? `<text class="lbl star" x="0" y="34" font-size="18">★${rank}</text>` : ''}
        </g></g>`;
    }).join('');
  }

  function mount(el, opts) {
    el.innerHTML = `<svg class="mapsvg" role="img" aria-label="${opts.lang === 'en' ? 'Hand-drawn map of student homes in Liverpool' : '利物浦学生公寓手绘地图'}">
        <defs>${B.defs}</defs><g class="base">${B.base}</g><g class="labels"></g><g class="leaders" pointer-events="none">${B.leaders}</g><g class="places"></g><g class="pins"></g></svg>
      <div class="mapctl"><button type="button" data-z="-1" aria-label="Zoom in">+</button><button type="button" data-z="1" aria-label="Zoom out">−</button><button type="button" data-z="0" aria-label="Reset map">⟲</button></div>`;
    const svg = el.querySelector('svg'), gLabels = svg.querySelector('.labels'), gPlaces = svg.querySelector('.places'), gPins = svg.querySelector('.pins');
    let o = opts, lastLang = null;

    function apply() {
      vb.w = Math.min(B.w + 200, Math.max(160, vb.w));
      vb.x = Math.min(B.w - vb.w * .3, Math.max(-vb.w * .7, vb.x));
      vb.y = Math.min(B.h - vb.h * .3, Math.max(-vb.h * .7, vb.y));
      svg.setAttribute('viewBox', `${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`);
      const r = svg.getBoundingClientRect(), ppu = (r.width || 370) / vb.w;
      const k = Math.min(1.1, Math.max(.62, ppu)) / ppu;
      svg.querySelectorAll('.pin').forEach(n => {
        n.setAttribute('transform', `translate(${n.dataset.x} ${n.dataset.y}) scale(${(k * +n.dataset.s).toFixed(3)})`);
      });
      svg.classList.toggle('far', ppu < .45);
    }
    function render(next) {
      o = Object.assign({}, o, next || {});
      if (lastLang !== o.lang) { gLabels.innerHTML = B.labels[o.lang === 'en' ? 'en' : 'zh']; gPlaces.innerHTML = placesSvg(o.lang); lastLang = o.lang; }
      gPins.innerHTML = pinsSvg(o);
      apply();
    }
    function zoom(f, cx, cy) {
      const nw = Math.min(B.w + 200, Math.max(160, vb.w * f)), nh = nw * (vb.h / vb.w);
      if (cx == null) { cx = vb.x + vb.w / 2; cy = vb.y + vb.h / 2; }
      vb.x = cx - (cx - vb.x) * (nw / vb.w); vb.y = cy - (cy - vb.y) * (nh / vb.h); vb.w = nw; vb.h = nh;
      apply();
    }
    /* 视图比例跟随容器；以较长的一边框住目标区域 */
    function fit(box) {
      const r = svg.getBoundingClientRect(), asp = r.width && r.height ? r.height / r.width : box.h / box.w;
      let w = box.w, h = w * asp;
      if (h < box.h) { h = box.h; w = h / asp; }
      vb = { x: box.x + box.w / 2 - w / 2, y: box.y + box.h / 2 - h / 2, w, h };
      apply();
    }
    function focus(ids) {
      const ps = o.homes.filter(h => ids.includes(h.id)).map(posOf);
      if (!ps.length) return;
      const xs = ps.map(p => p[0]), ys = ps.map(p => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const w = Math.max(440, (x1 - x0) * 1.6), h = Math.max(360, (y1 - y0) * 1.8);
      fit({ x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w, h });
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
      if (z === 0) fit(DEF); else zoom(z < 0 ? 1 / 1.4 : 1.4);
    });
    render();
    requestAnimationFrame(() => { if (!fitted) { fit(DEF); fitted = true; } else apply(); });
    return { render, focus, zoom };
  }
  root.MapView = { mount, resetView() { vb = Object.assign({}, DEF); fitted = false; } };
})(typeof globalThis !== 'undefined' ? globalThis : this);
