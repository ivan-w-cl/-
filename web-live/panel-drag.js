/* From web-original/liverpool-life-map-en/panel-drag.js. Now also used for the two side panels
   ("找公寓" #controls and "公寓列表" #homesPanel, desktop only) besides the Home Match card (#hmRes).
   Draggable result cards: the Life Card (#lcPanel) and the Home Match card (#hmRes).
   Drag by the header (not its buttons). Dropping past a screen edge tucks the card away,
   leaving a small ◀ / ▶ tab; tap or drag the tab to bring it back. Positions are saved per card. */
(() => {
  'use strict';
  const KEY = 'lsm-panel-pos-v1', EDGE = 0.28, TAB = 30;
  let saved = {}; try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (_) {}
  // persistence is per card (see setup)
  const vw = () => document.documentElement.clientWidth, vh = () => window.innerHeight;
  const barTop = () => { const b = document.querySelector('.mbar'); if (!b) return vh(); const r = b.getBoundingClientRect(); return r.height && getComputedStyle(b).display !== 'none' ? r.top : vh(); };
  const isZh = () => /^zh/i.test(document.documentElement.lang);

  function setup(panel, headSel) {
    if (!panel || panel.dataset.drag) return; panel.dataset.drag = '1';
    const id = panel.id, tab = document.createElement('button');
    tab.type = 'button'; tab.className = 'pd-tab'; tab.hidden = true;
    document.body.appendChild(tab);
    let st = saved[id] || null;           // {x, y, dock: 'left'|'right'|null}
    const persist = () => { if (st) saved[id] = st; else delete saved[id]; try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (_) {} };

    const clampY = (y, h) => Math.max(8, Math.min(y, Math.max(8, Math.min(vh(), barTop()) - 8 - h)));
    const narrowNow = () => vw() <= 760 || matchMedia('(max-width: 1024px) and (orientation: portrait) and (hover: none)').matches;   // iPad 竖屏按手机版处理
    const capH = () => Math.max(120, narrowNow() ? Math.min(470, vh() * 0.54) : Math.min(vh(), barTop()) - 16);
    const shown = () => !panel.hidden && getComputedStyle(panel).display !== 'none';
    // Never trust a width measured while the card is display:none (e.g. while a home card replaces it on
    // phones): that is 0 and used to be written inline, leaving an invisible 0-px card after "restore".
    const goodW = w => narrowNow() ? vw() - 16 : Math.min(vw() - 16, w >= 160 ? w : 380);
    function place(x, y) {
      if (!shown()) return { x, y };
      panel.style.width = goodW(parseFloat(panel.style.width) || panel.getBoundingClientRect().width) + 'px';
      panel.style.maxHeight = capH() + 'px';
      const r = panel.getBoundingClientRect(), w = r.width, h = Math.min(r.height, vh() - 16);
      x = Math.max(8, Math.min(x, vw() - w - 8)); y = clampY(y, h);
      Object.assign(panel.style, { position: 'fixed', left: x + 'px', top: y + 'px', right: 'auto', bottom: 'auto', width: w + 'px', margin: '0', zIndex: '24', maxHeight: capH() + 'px' });
      return { x, y };
    }
    function freeStyle() { ['position', 'left', 'top', 'right', 'bottom', 'width', 'margin', 'maxHeight', 'transform', 'visibility', 'zIndex', 'opacity'].forEach(k => { panel.style[k] = ''; }); }
    function syncTab() {
      const open = !panel.hidden && getComputedStyle(panel).display !== 'none';
      tab.hidden = !(open && st && st.dock);
      panel.classList.toggle('pd-docked', !!(st && st.dock));
      if (tab.hidden) return;
      const left = st.dock === 'left';
      tab.classList.toggle('is-left', left); tab.classList.toggle('is-right', !left);
      tab.textContent = left ? '▶' : '◀';
      const name = (panel.querySelector('h2') || {}).textContent || '';
      tab.setAttribute('aria-label', (isZh() ? '拖回或点开：' : 'Show again: ') + name); tab.title = name;
      let y = Math.max(70, Math.min(st.y ?? vh() / 2, barTop() - 72));
      // keep clear of the "My subject" tab on the left edge
      const sub = left ? document.querySelector('.subject-tab') : document.getElementById('controls'), sr = sub && sub.getBoundingClientRect();
      if (sr && sr.width && (left ? sr.left < 40 : sr.right > vw() - 40) && y + 64 > sr.top - 6 && y < sr.bottom + 6) y = sr.bottom + 10 + 64 < barTop() ? sr.bottom + 10 : Math.max(70, sr.top - 74);
      tab.style.top = y + 'px';
    }
    function apply() {
      if (drag && drag.moved) return;
      if (!shown()) { syncTab(); return; }
      if (!st) { freeStyle(); syncTab(); return; }
      if (st.dock) {
        const p = place(st.x ?? 8, st.y ?? 80);
        panel.style.transform = st.dock === 'left' ? `translateX(${-(p.x + panel.offsetWidth + 20)}px)` : `translateX(${vw() - p.x + 20}px)`;
        panel.style.visibility = 'hidden';
      } else { panel.style.transform = ''; panel.style.visibility = ''; const p = place(st.x, st.y); st.x = p.x; st.y = p.y; }
      syncTab();
    }
    // Bring the card back: always fully on screen, visible and above the map.
    function undock() {
      if (!st) return;
      st.dock = null;
      panel.classList.remove('pd-docked'); panel.style.transform = ''; panel.style.visibility = ''; panel.style.opacity = '';
      if (!Number.isFinite(st.x) || !Number.isFinite(st.y)) { st = null; }
      persist(); apply(); tab.hidden = true;
      requestAnimationFrame(() => {
        const r = panel.getBoundingClientRect();
        const ok = shown() && r.width >= 120 && r.height >= 40 && r.left >= 0 && r.top >= 0 && r.right <= vw() + 1 && r.bottom <= vh() + 1 && getComputedStyle(panel).visibility === 'visible';
        if (!ok) { st = null; persist(); freeStyle(); syncTab(); }   // fall back to the card's default slot
        dispatchEvent(new Event('resize'));
      });
    }

    // --- dragging the card by its header
    let drag = null;
    panel.addEventListener('pointerdown', e => {
      const head = e.target.closest(headSel);
      if (!head || !panel.contains(head) || e.target.closest('button, a, select, input, textarea') || e.button > 0) return;
      const r = panel.getBoundingClientRect();
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, w: r.width, h: r.height, moved: false };
      e.stopPropagation();
    });
    panel.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.moved) {
        if (Math.hypot(dx, dy) < 6) return;
        drag.moved = true; panel.setPointerCapture(e.pointerId); panel.classList.add('pd-dragging');
        Object.assign(panel.style, { position: 'fixed', left: drag.ox + 'px', top: drag.oy + 'px', right: 'auto', bottom: 'auto', width: drag.w + 'px', margin: '0', maxHeight: '',   /* never freeze the folded height: unfolding must grow again */ transform: '', visibility: '' });
      }
      e.preventDefault(); e.stopPropagation();
      // let the card slide partly past the side edges so the user can "throw" it away
      const x = Math.max(-drag.w * 0.7, Math.min(drag.ox + dx, vw() - drag.w * 0.3));
      const y = clampY(drag.oy + dy, panel.offsetHeight);
      panel.style.left = x + 'px'; panel.style.top = y + 'px';
    });
    const end = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const cancelled = e.type === 'pointercancel';
      const was = drag; drag = null;
      if (!was.moved) return;
      panel.classList.remove('pd-dragging');
      try { panel.releasePointerCapture(e.pointerId); } catch (_) {}
      const r = panel.getBoundingClientRect();
      const px = e.clientX, dock = cancelled ? null : (r.left < -r.width * EDGE || (px < 28 && r.left < 4)) ? 'left' : (r.right > vw() + r.width * EDGE || (px > vw() - 28 && r.right > vw() - 4)) ? 'right' : null;
      st = { x: Math.max(8, Math.min(r.left, vw() - r.width - 8)), y: r.top, dock };
      persist(); panel.classList.add('pd-anim'); apply(); setTimeout(() => panel.classList.remove('pd-anim'), 260);
      dispatchEvent(new Event('resize'));   // lets the cards re-fit their homes into the free map area
    };
    panel.addEventListener('pointerup', end); panel.addEventListener('pointercancel', end);
    // a click right after a drag must not toggle anything inside the header
    panel.addEventListener('click', e => { if (panel.classList.contains('pd-dragging')) { e.stopPropagation(); e.preventDefault(); } }, true);

    // --- the edge tab: tap to restore, drag up/down to move, drag inward to restore
    let td = null;
    let tapped = 0;
    tab.addEventListener('pointerdown', e => { td = { id: e.pointerId, sx: e.clientX, sy: e.clientY, oy: parseFloat(tab.style.top) || 0, moved: false }; try { tab.setPointerCapture(e.pointerId); } catch (_) {} e.stopPropagation(); e.preventDefault(); });
    tab.addEventListener('pointermove', e => {
      if (!td || e.pointerId !== td.id) return;
      const dx = e.clientX - td.sx, dy = e.clientY - td.sy;
      if (!td.moved && Math.hypot(dx, dy) < 12) return;   // finger jitter on a real tap is not a drag
      td.moved = true; e.preventDefault();
      const inward = st.dock === 'left' ? dx : -dx;
      if (inward > 40) { st.y = clampY(e.clientY - 24, 60); st.x = st.dock === 'left' ? 8 : vw(); td = null; tapped = Date.now(); undock(); return; }
      tab.style.top = Math.max(70, Math.min(td.oy + dy, barTop() - 60)) + 'px';
    });
    tab.addEventListener('pointerup', e => {
      if (!td || e.pointerId !== td.id) return;
      const moved = td.moved; td = null;
      if (moved) { st.y = parseFloat(tab.style.top); persist(); }
      else { tapped = Date.now(); undock(); }          // a tap restores straight away; don't wait for 'click'
    });
    tab.addEventListener('pointercancel', () => { td = null; });
    // keyboard / assistive activation (and browsers that skip pointer events)
    tab.addEventListener('click', e => { e.stopPropagation(); if (Date.now() - tapped < 600) return; td = null; if (st && st.dock) undock(); });

    new MutationObserver(() => { requestAnimationFrame(apply); }).observe(panel, { attributes: true, attributeFilter: ['hidden', 'class'] });
    if ('ResizeObserver' in window) new ResizeObserver(() => { if (st && !st.dock && !drag && shown()) { const p = place(st.x, st.y); st.x = p.x; st.y = p.y; } }).observe(panel);
    addEventListener('resize', () => { if (!drag) apply(); });
    // the card's own "close" resets nothing; double-click the header to put the card back in its default slot
    panel.addEventListener('dblclick', e => { if (e.target.closest(headSel) && !e.target.closest('button')) { st = null; persist(); apply(); dispatchEvent(new Event('resize')); } });
    // sanitise a stored position (older builds could save a 0-px width or off-screen point)
    if (st && (!Number.isFinite(st.x) || !Number.isFinite(st.y) || st.x > 4000 || st.y > 4000)) { st = null; persist(); }
    apply();
  }
  function init() {
    setup(document.getElementById('lcPanel'), '.lc-ph'); setup(document.getElementById('hmRes'), '.phead');
    // the side panels become bottom sheets on phones; drag them only where they float
    const wide = matchMedia('(min-width: 761px) and (hover: hover)');
    const sides = () => { if (wide.matches) { setup(document.getElementById('controls'), '.phead'); setup(document.getElementById('homesPanel'), '.phead'); } };
    sides(); wide.addEventListener('change', sides);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.PanelDrag = { init, setup };
})();
