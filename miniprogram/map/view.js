/* 地图视角：和网页版一样的「全图」大小、手机上先对准公寓区、平移不出纸面、缩放上下限。
   屏幕像素 = 地图坐标 * k + (tx, ty)，k = fitK * z。 */
function createView(W, H) {
  let w = 0, h = 0, fitK = 1, z = 1, tx = 0, ty = 0;
  const zmin = () => 1, zmax = () => Math.max(4, 2.4 / fitK);
  function resize(nw, nh) { w = nw; h = nh; fitK = Math.min(w / W, h / H) * 0.97; }
  function clamp() {
    const sw = W * fitK * z, sh = H * fitK * z;
    tx = sw <= w ? (w - sw) / 2 : Math.min(0, Math.max(w - sw, tx));
    ty = sh <= h ? (h - sh) / 2 : Math.min(0, Math.max(h - sh, ty));
  }
  function fit() { z = 1; tx = 0; ty = 0; clamp(); }
  /* 网页版 viewStudents()：手机上一打开先看清公寓集中的区域（底部 130px 留给按钮） */
  function viewPoints(pts) {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    const hh = h - 130, zz = Math.min(w / ((x1 - x0 + 80) * fitK), hh / ((y1 - y0 + 80) * fitK));
    z = Math.max(1, Math.min(zmax(), zz)); tx = w / 2 - (x0 + x1) / 2 * fitK * z; ty = 60 + hh / 2 - (y0 + y1) / 2 * fitK * z; clamp();
  }
  /* 以屏幕点 (cx, cy) 为中心缩放 */
  function zoomAt(f, cx, cy) {
    const nz = Math.max(zmin(), Math.min(zmax(), z * f)), r = nz / z;
    tx = cx - (cx - tx) * r; ty = cy - (cy - ty) * r; z = nz; clamp();
  }
  function pan(dx, dy) { tx += dx; ty += dy; clamp(); }
  /* 把某个地图点移到屏幕上 (sx, sy)，必要时放大到 zTarget */
  function focus(x, y, sx, sy, zTarget) { if (zTarget && z < zTarget) z = Math.min(zmax(), zTarget); tx = sx - x * fitK * z; ty = sy - y * fitK * z; clamp(); }
  return {
    resize, clamp, fit, viewPoints, zoomAt, pan, focus,
    get: () => ({ k: fitK * z, tx, ty, w, h }),
    get z() { return z; }, get fitK() { return fitK; }, zmax, zmin,
    set(s) { z = s.z; tx = s.tx; ty = s.ty; clamp(); }, state: () => ({ z, tx, ty })
  };
}
module.exports = { createView };
