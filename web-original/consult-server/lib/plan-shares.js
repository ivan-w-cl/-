'use strict';
/* 抢房计划分享码：网页上的抢房计划分享到微信小程序。
   - 网页 POST /api/plan-shares { code, from } → 6 位分享码（如 K7Q2MP）。code 是计划编码（公寓编号.房型字母.最高周租，用 _ 连接，
     和小程序 utils/plan-core.js 一样），from 是可选署名。只存这两样，不存任何个人信息。
   - 小程序 GET /api/plan-shares/:id → { code, from }，显示「某某的抢房计划」，可以复制。
   - 服务器配了 WX_APPID / WX_APPSECRET 时，返回小程序码地址（/api/wxacode?scene=p=分享码），微信扫一扫直接打开。
   同一份计划 + 署名重复分享，拿到同一个分享码；180 天没人打开的自动清掉。 */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ABC = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';   // 去掉容易看错的 0 O 1 I L
const CODE = /^\d{1,2}(\.[esptf]{0,5}(\.\d{2,3})?)?(_\d{1,2}(\.[esptf]{0,5}(\.\d{2,3})?)?){0,9}$/;
const ID = /^[2-9A-HJ-NP-Z]{6}$/;
const KEEP_DAYS = 180, MAX = 20000;

function createPlanShares({ dataDir, canWxacode = () => false, now = () => Date.now() }) {
  const file = path.join(dataDir, 'plan-shares.json');
  let data = {}; try { data = JSON.parse(fs.readFileSync(file, 'utf8')) || {}; } catch (_) { /* 第一次运行 */ }
  let timer = null;
  const save = () => { clearTimeout(timer); timer = setTimeout(() => { fs.mkdirSync(dataDir, { recursive: true }); fs.writeFile(file + '.tmp', JSON.stringify(data), e => { if (!e) fs.rename(file + '.tmp', file, () => {}); }); }, 300); if (timer.unref) timer.unref(); };
  const newId = () => { let id; do { id = Array.from(crypto.randomBytes(6), b => ABC[b % ABC.length]).join(''); } while (data[id]); return id; };
  function prune() {
    const cut = now() - KEEP_DAYS * 864e5;
    for (const id in data) if (data[id].seen < cut) delete data[id];
    const ids = Object.keys(data); if (ids.length > MAX) ids.sort((a, b) => data[a].seen - data[b].seen).slice(0, ids.length - MAX).forEach(id => delete data[id]);
  }
  function create(code, from) {
    code = String(code || '').trim(); from = String(from || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 12);
    if (!CODE.test(code)) return null;
    let id = Object.keys(data).find(k => data[k].code === code && data[k].from === from);
    if (!id) { prune(); id = newId(); data[id] = { code, from, at: now(), seen: now() }; } else data[id].seen = now();
    save(); return id;
  }
  function get(id) { const s = ID.test(id) && data[id]; if (!s) return null; s.seen = now(); s.opens = (s.opens || 0) + 1; save(); return { code: s.code, from: s.from }; }

  function createApi({ send, readBody, json, limited = () => false }) {
    return async function planSharesApi(req, res, url) {
      const p = url.pathname;
      if (p === '/api/plan-shares' && req.method === 'POST') {
        if (limited(req, 'planshare:', 30, 10 * 60e3)) return send(res, 429, { error: 'rate_limited' });
        const b = json(await readBody(req, 4e3)); if (!b) return send(res, 400, { error: 'bad_json' });
        const id = create(b.code, b.from); if (!id) return send(res, 400, { error: 'bad_plan' });
        return send(res, 201, { id, wxacode: canWxacode() ? `/api/wxacode?scene=${encodeURIComponent('p=' + id)}` : '' });
      }
      const m = /^\/api\/plan-shares\/([A-Za-z0-9]{1,12})$/.exec(p);
      if (m && req.method === 'GET') {
        if (limited(req, 'planget:', 120, 10 * 60e3)) return send(res, 429, { error: 'rate_limited' });
        const s = get(m[1].toUpperCase()); return s ? send(res, 200, s, { 'Cache-Control': 'no-store' }) : send(res, 404, { error: 'not_found' });
      }
      return send(res, 404, { error: 'not_found' });
    };
  }
  return { create, get, createApi, flush: () => new Promise(r => setTimeout(r, 350)) };
}
module.exports = { createPlanShares, CODE, ID };
