/* 从网页版原样摘出：
   - room-photos.js：房型与照片数据 ROOMS、文案、roomsFor()（没有照片的公寓按价格生成房型）→ utils/rooms-core.js
   - weather.js：天气文案、天气代码分类、示例天气、手绘天气图标（预先生成成图片）→ utils/weather-core.js
   网页改了，重新运行即可。 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const WEB = path.resolve(__dirname, '..', '..', 'web-live'), OUT = path.resolve(__dirname, '..', 'utils');
const read = f => fs.readFileSync(path.join(WEB, f), 'utf8');
const cut = (src, a, b) => { const i = src.indexOf(a); if (i < 0) throw new Error('找不到 ' + a); const j = src.indexOf(b, i); if (j < 0) throw new Error('找不到 ' + b); return src.slice(i, j); };

/* ---------- 房型与照片 ---------- */
const rp = read('room-photos.js');
const rooms = cut(rp, '  const ROOMS = {', '  const lang = () =>');
const roomsFor = cut(rp, '  const L = o =>', '  function section(h)');
fs.writeFileSync(path.join(OUT, 'rooms-core.js'), `/* 自动生成：scripts/export-addons.cjs 从网页版 room-photos.js 摘出。不要手改。 */
${rooms}
${roomsFor.replace("const L = o => o[lang()] || o.en;", "")}
module.exports = { ROOMS, W, roomsFor, photoCount };
`);

/* ---------- 天气 ---------- */
const wx = read('weather.js');
const words = cut(wx, '  const W = {', '  const lang = () =>');
const kind = cut(wx, '  const kind = c =>', '\n') + '\n';
const samples = cut(wx, '  const SAMPLES = [', '  let sampleAt');
const iconSrc = cut(wx, '  const ST = ', '  const icon = (w, night)');
const ctx = {}; vm.runInNewContext(iconSrc.replace(/const (\w+) =/g, 'this.$1 =') , ctx);
const b64 = s => 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64');
const icons = {};
for (const k of Object.keys(ctx.ICON)) for (const night of [false, true]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="56" height="56" color="#3b2a1a">${ctx.ICON[k](night)}</svg>`.replace(/currentColor/g, '#3b2a1a');
  icons[k + (night ? '-n' : '')] = b64(svg);
}
fs.writeFileSync(path.join(OUT, 'weather-core.js'), `/* 自动生成：scripts/export-addons.cjs 从网页版 weather.js 摘出。不要手改。 */
${words}${kind}${samples}const ICONS = ${JSON.stringify(icons)};
module.exports = { W, kind, SAMPLES, ICONS };
`);
console.log('rooms-core.js', fs.statSync(path.join(OUT, 'rooms-core.js')).size, 'weather-core.js', fs.statSync(path.join(OUT, 'weather-core.js')).size, 'icons', Object.keys(icons).length);
