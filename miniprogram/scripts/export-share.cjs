/* 从网页版 share-cards.js 原样摘出 4 种分享卡片（手绘地图、拍立得、车票、便利贴）的画法和文案，
   生成 utils/share-cards-core.js。只有几处换成小程序的做法（由 deps 传进来）：
   二维码库、小程序码、地图截图（网页克隆 SVG，这里用同一个地图渲染器画到离屏画布）、加载图片。 */
'use strict';
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.resolve(__dirname, '..', '..', 'web-live', 'share-cards.js'), 'utf8');
function cut(start, end) {
  const s = src.indexOf(start); if (s < 0) throw new Error('share-cards.js 中找不到: ' + start);
  const e = src.indexOf(end, s); if (e < 0) throw new Error('share-cards.js 中找不到结束标记: ' + end);
  return src.slice(s, e);
}
const parts = [
  cut('  const REF_KEY', '  const lang = () =>'),
  cut('  const DISPLAY', '\n', 0) + '\n',
  cut('  /* ---------- 画图工具', '  const loadImg').replace('window.qrcode(', 'deps.qrcode(').replace('  function qr(ctx, text, x, y, size) {', '  function qrDraw(ctx, text, x, y, size) {'),
  cut('  function cover(', '  /* 地图截图'),
  cut('  /* ---------- 4 种样式', '  /* ---------- 弹窗'),
];
for (const bad of ['document.', 'window.', 'localStorage', 'innerHTML']) parts.forEach(p => { if (p.includes(bad)) throw new Error('截取片段含页面依赖: ' + bad); });
const core = `/* 自动生成：scripts/export-share.cjs 从网页版 share-cards.js 原样摘出。不要手改。 */
'use strict';
module.exports = function createShare(deps) {
  const refCode = deps.refCode, shareUrl = deps.shareUrl, loadImg = deps.loadImg, mapImage = deps.mapImage;
  // 小程序码（扫码直接打开小程序）已准备好就画它，否则和网页一样画普通二维码
  const qr = (ctx, text, x, y, size) => { const img = deps.code && deps.code(text); if (img) { ctx.fillStyle = '#fff'; ctx.fillRect(x, y, size, size); ctx.drawImage(img, x + 6, y + 6, size - 12, size - 12); } else qrDraw(ctx, text, x, y, size); };
${parts.join('\n')}
  return { T, W, H, STYLES };
};
`;
fs.writeFileSync(path.resolve(__dirname, '..', 'utils', 'share-cards-core.js'), core);
console.log('share-cards-core.js', core.length, 'bytes');
