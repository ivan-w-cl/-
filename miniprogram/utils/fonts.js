/* 手绘字体：从服务器加载（config.FONT_BASE），界面文字和地图画布都能用（scopes: native）。
   加载不到时自动用系统字体，功能不受影响。 */
const { FONT_BASE } = require('../config.js');
const FACES = [
  ['Gochi Hand', 'GochiHand-400.ttf', 'normal'], ['Patrick Hand', 'PatrickHand-400.ttf', 'normal'],
  ['ZCOOL KuaiLe', 'ZCOOLKuaiLe-400.ttf', 'normal'], ['Nunito', 'Nunito-400.ttf', 'normal'],
  ['Nunito', 'Nunito-700.ttf', 'bold'], ['Nunito', 'Nunito-800.ttf', '800']
];
let loaded = 0; const waiters = [];
function load() {
  FACES.forEach(([family, file, weight]) => wx.loadFontFace({
    global: true, scopes: ['webview', 'native'], family, source: `url("${FONT_BASE}${file}")`, desc: { weight },
    complete: () => { loaded++; if (loaded === FACES.length) waiters.splice(0).forEach(f => f()); }
  }));
}
/* 地图画布：网页的字体列表是「英文手写体, 中文手写体, cursive」，按这段文字有没有中文挑一个 */
const CJK = /[　-鿿＀-￯]/;
function pick(list, text) {
  const fams = String(list).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
  if (text && CJK.test(text)) { if (fams.includes('ZCOOL KuaiLe') || fams.includes('Gochi Hand') || fams.includes('Patrick Hand')) return '"ZCOOL KuaiLe"'; return 'sans-serif'; }
  const f = fams.find(x => ['Gochi Hand', 'Patrick Hand', 'Nunito'].includes(x));
  return f ? `"${f}"` : 'sans-serif';
}
module.exports = { load, pick, ready: cb => (loaded >= FACES.length ? cb() : waiters.push(cb)) };
