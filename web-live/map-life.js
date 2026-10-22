/* 地图上多一群海鸥：每隔一会儿排成人字形从默西河上空飞过（原页面已有两辆车、一艘渡轮和两只海鸥）。
   跟着原页面的「暂停动画」、拖动地图、减少动态设置一起停下。 */
(() => {
  'use strict';
  const movers = document.getElementById('movers'), app = document.getElementById('app');
  let P0, P1;
  try { P0 = P(53.386, -3.022); P1 = P(53.418, -2.992); } catch (_) { return; }
  if (!movers || !app || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const NS = 'http://www.w3.org/2000/svg';
  const flock = document.createElementNS(NS, 'g'); movers.append(flock);
  const SLOTS = [[0, 0], [-26, -14], [-26, 14], [-52, -26], [-52, 26]];
  const birds = SLOTS.map(([dx, dy], i) => {
    const g = document.createElementNS(NS, 'g'), u = document.createElementNS(NS, 'use');
    u.setAttribute('href', '#v-gull'); g.append(u); flock.append(g);
    u.setAttribute('transform', `scale(${(0.8 + (i % 2) * 0.12).toFixed(2)})`);
    return { g, dx, dy, ph: i * 1.3 };
  });
  const ang = Math.atan2(P1[1] - P0[1], P1[0] - P0[0]), ca = Math.cos(ang), sa = Math.sin(ang);
  const FLY = 16000, GAP = 22000;   // 飞 16 秒，歇 22 秒
  let t = 6000, last = performance.now();
  function frame(now) {
    const dt = Math.min(50, now - last); last = now;
    const paused = app.classList.contains('still') || app.classList.contains('interacting') || document.hidden;
    if (!paused) t = (t + dt) % (FLY + GAP);
    const k = t / FLY;
    flock.style.display = k < 1 ? '' : 'none';
    if (k < 1) {
      const x = P0[0] + (P1[0] - P0[0]) * k, y = P0[1] + (P1[1] - P0[1]) * k + Math.sin(k * Math.PI * 2) * 18;
      for (const b of birds) {
        const bob = Math.sin(now / 420 + b.ph) * 3;
        b.g.setAttribute('transform', `translate(${(x + b.dx * ca - b.dy * sa).toFixed(1)} ${(y + b.dx * sa + b.dy * ca + bob).toFixed(1)})`);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
