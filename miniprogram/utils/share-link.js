/* 分享用的推广码和链接（网页 share-cards.js 的 refCode / shareUrl / fun-quizzes.js 的 link）。
   小程序里朋友扫分享卡片上的小程序码进来：scene 里带 q=测试 d=朋友的类型 r=推广码，onLoad 用 parseScene 读出来。 */
const config = require('../config.js');
const KEY = 'lsm-ref-v1';
function refCode() {
  try { let c = wx.getStorageSync(KEY); if (!c) { c = Math.random().toString(36).slice(2, 8).toUpperCase(); wx.setStorageSync(KEY, c); } return c; }
  catch (e) { return 'LSM2027'; }
}
const site = () => (config.SITE_URL || config.API_BASE).replace(/\/$/, '') + '/';
/* 网页版地址（二维码退回普通码时用，也用在复制的分享文案里） */
function link(o) {
  o = o || {}; const q = [];
  if (o.quiz) q.push('quiz=' + o.quiz); if (o.duo) q.push('duo=' + o.duo); q.push('ref=' + refCode());
  return site() + '?' + q.join('&') + '#lang=' + (o.lang === 'en' ? 'en' : 'zh');
}
/* 小程序码的 scene（最多 32 个字符） */
function scene(o) { o = o || {}; return [o.quiz && 'q=' + o.quiz, o.duo && 'd=' + o.duo, 'r=' + refCode()].filter(Boolean).join('&'); }
function parseScene(s) {
  const out = {}; String(s ? decodeURIComponent(s) : '').split('&').forEach(p => { const [k, v] = p.split('='); if (k && v) out[k] = v; });
  return { quiz: out.q || '', duo: out.d || '', ref: out.r || '', plan: out.p || '' };   // p=抢房计划分享码（网页生成的小程序码）
}
module.exports = { refCode, link, scene, parseScene };
