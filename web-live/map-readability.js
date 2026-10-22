/* Keep map artwork vector-sharp, with bounded screen sizes and settled label layout.
   This script runs after the map's main script. It never changes map coordinates,
   gesture state, ranking or property IDs. Collision work is skipped during gestures. */
(() => {
  'use strict';
  const baseTransforms = new WeakMap();
  let queued = 0;
  const capScale = (pixelsPerUnit, cap) => Math.min(1, cap / Math.max(0.001, pixelsPerUnit));
  const area = r => Math.max(0, r.right - r.left) * Math.max(0, r.bottom - r.top);
  const intersection = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
    Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const padded = (r, p = 4) => ({ left: r.left - p, top: r.top - p, right: r.right + p, bottom: r.bottom + p });
  const valid = r => r.width > 0 && r.height > 0;
  const offscreen = (r, viewport) => !intersection(r, viewport);
  function scaleText(node, k, pixelCap) {
    if (!baseTransforms.has(node)) baseTransforms.set(node, node.getAttribute('transform') || '');
    const x = Number(node.getAttribute('x')) || 0, y = Number(node.getAttribute('y')) || 0;
    const fontSize = Number(node.getAttribute('font-size')) || parseFloat(getComputedStyle(node).fontSize) || 12;
    const s = capScale(k, pixelCap / fontSize);
    node.setAttribute('transform', `${baseTransforms.get(node)} translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`);
  }
  function refresh() {
    queued = 0;
    if (document.getElementById('app').classList.contains('interacting')) return;
    const k = fitK * z, viewport = mapbox.getBoundingClientRect();
    if (!(k > 0) || !viewport.width || !viewport.height) return;
    const all = [...HOMES, ...PLACES, ...BUILDINGS];
    const obstacles = [];
    all.forEach(d => {
      const visual = d.visualEl;
      if (!visual) return;
      // Houses/landmarks stay around 44/66 px; campus names top out at 15 px.
      const s = capScale(k, d.t === 'bldg' ? 1.5 : 1.1);
      visual.setAttribute('transform', `scale(${s})`);
      if (d.lblEl) {
        d.lblEl.classList.remove('map-label-muted');
        d.lblEl.classList.toggle('map-label-forced', current?.id === d.id);
        d.lblEl.setAttribute('x', '0');
        d.lblEl.setAttribute('y', d.t === 'bldg' ? '14' : '34');
      }
      const icon = visual.querySelector(d.t === 'bldg' ? '.bico' : '.in');
      const r = icon?.getBoundingClientRect();
      if (r && valid(r) && !offscreen(r, viewport)) obstacles.push({ id: d.id, rect: padded(r, 3) });
    });
    const labels = all.filter(d => d.lblEl).map(d => ({
      node: d.lblEl, id: d.id, d,
      priority: current?.id === d.id ? 100 : els.get(d.id)?.classList.contains('hit') ? 80 : d.t === 'bldg' ? 40 : 60,
      screenScale: k * capScale(k, d.t === 'bldg' ? 1.5 : 1.1)
    }));
    document.querySelectorAll('.zlbl, #baseLabels text').forEach((node, i) => {
      node.classList.remove('map-label-muted');
      const cap = node.classList.contains('waterl') ? 32 : node.classList.contains('area') ? 24 : 16;
      scaleText(node, k, cap);
      labels.push({ node, id: `map-label-${i}`, priority: node.classList.contains('zlbl') ? 30 : 10 });
    });
    const accepted = [];
    labels.sort((a, b) => b.priority - a.priority);
    for (const item of labels) {
      const { node, d } = item;
      const r = node.getBoundingClientRect();
      if (!valid(r)) continue; // Zoom/layer CSS still owns eligibility.
      if (offscreen(r, viewport) && !d) { node.classList.add('map-label-muted'); continue; }
      const others = obstacles.filter(o => o.id !== item.id).map(o => o.rect).concat(accepted);
      const score = box => others.reduce((sum, other) => sum + intersection(box, other), 0) +
        Math.max(0, area(box) - intersection(box, viewport)) * 3;
      const candidates = d ? [
        [0, d.t === 'bldg' ? 14 : 34],
        [0, d.t === 'bldg' ? -12 : -38],
        [(r.width / 2 + (d.t === 'bldg' ? 15 : 35)) / item.screenScale, 4],
        [-(r.width / 2 + (d.t === 'bldg' ? 15 : 35)) / item.screenScale, 4]
      ] : [null];
      let best = null;
      for (const position of candidates) {
        if (position) { node.setAttribute('x', position[0]); node.setAttribute('y', position[1]); }
        const box = padded(node.getBoundingClientRect());
        const value = score(box);
        if (!best || value < best.score) best = { position, box, score: value };
        if (value < 0.5) break;
      }
      if (best && (best.score < 0.5 || item.priority === 100)) {
        if (best.position) { node.setAttribute('x', best.position[0]); node.setAttribute('y', best.position[1]); }
        accepted.push(best.box);
      } else node.classList.add('map-label-muted');
    }
  }
  function schedule() { if (!queued) queued = requestAnimationFrame(refresh); }
  // SVG layout changes only after zoom settles. Do not do collision reads per pointer move.
  new MutationObserver(schedule).observe(stage, { attributes: true, attributeFilter: ['style'] });
  new MutationObserver(records => {
    if (records.some(r => r.target === document.getElementById('over') ||
      r.target.classList?.contains('m') || r.type === 'childList' && r.target.matches?.('.lbl, .zlbl, .blbl')))
      schedule();
  }).observe(document.getElementById('over'), { subtree: true, attributes: true, attributeFilter: ['class'], childList: true });
  new MutationObserver(schedule).observe(document.getElementById('baseLabels'), { subtree: true, childList: true });
  document.getElementById('over').addEventListener('animationend', e => {
    if (e.target.classList.contains('drop')) schedule();
  });
  document.getElementById('over').addEventListener('transitionend', e => {
    if (e.target.classList.contains('in') || e.target.classList.contains('bico')) schedule();
  });
  document.fonts?.ready.then(schedule);
  window.LiverpoolMapReadability = { refresh: schedule };
  schedule();
})();
