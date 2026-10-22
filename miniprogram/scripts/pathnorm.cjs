/* SVG 路径 → 绝对坐标的 M/L/Q/C/Z 指令，再套一个仿射变换。导出地图时用（canvas 2D 直接能画这些指令）。
   支持 M m L l H h V v Q q T t C c S s A a Z z。圆弧换成三次贝塞尔。 */
'use strict';

function tokens(d) {
  const out = []; const re = /([MmLlHhVvQqTtCcSsAaZz])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/g; let m;
  while ((m = re.exec(d))) out.push(m[1] || +m[2]);
  return out;
}

/* 圆弧（SVG 端点参数）→ 若干段三次贝塞尔 */
function arcToCubic(x1, y1, rx, ry, phi, fa, fs, x2, y2) {
  if (rx === 0 || ry === 0) return [[x1, y1, x2, y2, x2, y2]];
  const rad = phi * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;
  rx = Math.abs(rx); ry = Math.abs(ry);
  const lam = x1p * x1p / (rx * rx) + y1p * y1p / (ry * ry);
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p, den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let co = Math.sqrt(Math.max(0, num / den)); if (fa === fs) co = -co;
  const cxp = co * rx * y1p / ry, cyp = -co * ry * x1p / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => { const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy); return a; };
  let t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry), dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!fs && dt > 0) dt -= 2 * Math.PI; else if (fs && dt < 0) dt += 2 * Math.PI;
  const n = Math.ceil(Math.abs(dt) / (Math.PI / 2)), seg = dt / n, k = 4 / 3 * Math.tan(seg / 4), out = [];
  const pt = (t) => [cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos];
  const der = (t) => [-rx * Math.sin(t) * cos - ry * Math.cos(t) * sin, -rx * Math.sin(t) * sin + ry * Math.cos(t) * cos];
  for (let i = 0; i < n; i++) {
    const a = t1 + i * seg, b = a + seg, p0 = pt(a), p3 = pt(b), d0 = der(a), d3 = der(b);
    out.push([p0[0] + k * d0[0], p0[1] + k * d0[1], p3[0] - k * d3[0], p3[1] - k * d3[1], p3[0], p3[1]]);
  }
  return out;
}

/* 返回 [['M',x,y],['L',x,y],['Q',x1,y1,x,y],['C',x1,y1,x2,y2,x,y],['Z']] */
function normalize(d) {
  const t = tokens(d), out = []; let i = 0, cmd = null, x = 0, y = 0, sx = 0, sy = 0, lcx = null, lcy = null, lqx = null, lqy = null;
  const num = () => t[i++];
  while (i < t.length) {
    if (typeof t[i] === 'string') cmd = t[i++];
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
    const ox = rel ? x : 0, oy = rel ? y : 0;
    if (C === 'Z') { out.push(['Z']); x = sx; y = sy; lcx = lqx = null; continue; }
    if (C === 'M') { x = ox + num(); y = oy + num(); sx = x; sy = y; out.push(['M', x, y]); cmd = rel ? 'l' : 'L'; lcx = lqx = null; continue; }
    if (C === 'L') { x = ox + num(); y = oy + num(); out.push(['L', x, y]); lcx = lqx = null; continue; }
    if (C === 'H') { x = ox + num(); out.push(['L', x, y]); lcx = lqx = null; continue; }
    if (C === 'V') { y = oy + num(); out.push(['L', x, y]); lcx = lqx = null; continue; }
    if (C === 'Q') { const x1 = ox + num(), y1 = oy + num(); x = ox + num(); y = oy + num(); out.push(['Q', x1, y1, x, y]); lqx = x1; lqy = y1; lcx = null; continue; }
    if (C === 'T') { const x1 = lqx == null ? x : 2 * x - lqx, y1 = lqy == null ? y : 2 * y - lqy; x = ox + num(); y = oy + num(); out.push(['Q', x1, y1, x, y]); lqx = x1; lqy = y1; lcx = null; continue; }
    if (C === 'C') { const x1 = ox + num(), y1 = oy + num(), x2 = ox + num(), y2 = oy + num(); x = ox + num(); y = oy + num(); out.push(['C', x1, y1, x2, y2, x, y]); lcx = x2; lcy = y2; lqx = null; continue; }
    if (C === 'S') { const x1 = lcx == null ? x : 2 * x - lcx, y1 = lcy == null ? y : 2 * y - lcy, x2 = ox + num(), y2 = oy + num(); x = ox + num(); y = oy + num(); out.push(['C', x1, y1, x2, y2, x, y]); lcx = x2; lcy = y2; lqx = null; continue; }
    if (C === 'A') {
      const rx = num(), ry = num(), phi = num(), fa = num(), fs = num(), x2 = ox + num(), y2 = oy + num();
      arcToCubic(x, y, rx, ry, phi, fa, fs, x2, y2).forEach(c => out.push(['C', ...c]));
      x = x2; y = y2; lcx = lqx = null; continue;
    }
    throw new Error('unsupported path command ' + cmd);
  }
  return out;
}

/* 仿射变换 [a b c d e f] 应用到指令，并压缩成一个扁平数组：0=M 1=L 2=Q 3=C 4=Z，坐标保留 1 位小数 */
function encode(cmds, m, prec = 10) {
  const [a, b, c, dd, e, f] = m || [1, 0, 0, 1, 0, 0], r = v => Math.round(v * prec) / prec, out = [];
  const tp = (px, py) => [r(a * px + c * py + e), r(b * px + dd * py + f)];
  for (const k of cmds) {
    if (k[0] === 'Z') { out.push(4); continue; }
    const code = { M: 0, L: 1, Q: 2, C: 3 }[k[0]]; out.push(code);
    for (let j = 1; j < k.length; j += 2) out.push(...tp(k[j], k[j + 1]));
  }
  return out;
}
module.exports = { normalize, encode, arcToCubic };
