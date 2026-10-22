/* 网页版地图的投影（原样复制自 web-live/index.html）：经纬度 → 米网格 raw() → 放大学生区的「旅游地图」变形 W()。
   生活选房在地图上画 10 分钟圈和周边地点时要用（坐标要和网页一模一样）。 */
const LON0 = -3.015, LAT0 = 53.448, KX = 6638.0, KY = 11132.0;
const raw = (lat, lon) => [(lon - LON0) * KX, (LAT0 - lat) * KY];
const EXT = { x0: -20, x1: 950, y0: -20, y1: 1090 };
function warpAxis(c, A, w, lo, hi) {
  const g = new Float64Array(hi - lo + 1); let acc = 0;
  for (let i = 0; i < g.length; i++) { const v = lo + i, z = (v - c) / w; acc += 1 + A * Math.exp(-z * z); g[i] = acc; }
  return v => { const f = Math.max(lo, Math.min(hi - 1, v)) - lo, i = Math.floor(f), t = f - i; return g[i] + (g[i + 1] - g[i]) * t + (v < lo ? v - lo : v > hi - 1 ? v - hi + 1 : 0); };
}
const GX = warpAxis(315, 2.9, 150, -200, 1200), GY = warpAxis(432, 3.2, 130, -200, 1300);
const OUTW = 1600, S = OUTW / (GX(EXT.x1) - GX(EXT.x0)), OUTH = Math.round((GY(EXT.y1) - GY(EXT.y0)) * S);
const W = (x, y) => [(GX(x) - GX(EXT.x0)) * S, (GY(y) - GY(EXT.y0)) * S];
const P = (lat, lon) => { const r = raw(lat, lon); return W(r[0], r[1]); };
module.exports = { raw, W, P, OUTW, OUTH };
