// 抢房计划分享码：网页生成 → 小程序读取；坏数据拒绝；同一份计划拿到同一个码；配了小程序时返回小程序码地址
const assert = require('assert'), http = require('http'), os = require('os'), fs = require('fs'), path = require('path');
const { createPlanShares } = require('../lib/plan-shares');
(async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'plans-'));
  let wx = false;
  const ps = createPlanShares({ dataDir, canWxacode: () => wx });
  const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
  const readBody = req => new Promise(ok => { const c = []; req.on('data', x => c.push(x)); req.on('end', () => ok(Buffer.concat(c))); });
  const json = b => { try { return JSON.parse(b.toString() || '{}'); } catch (_) { return null; } };
  const api = ps.createApi({ send, readBody, json });
  const srv = http.createServer((q, r) => api(q, r, new URL(q.url, 'http://x'))).listen(0);
  await new Promise(r => srv.once('listening', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const j = async (p, m = 'GET', body) => { const r = await fetch(base + p, { method: m, body: body && JSON.stringify(body) }); return { s: r.status, b: await r.json() }; };

  let r = await j('/api/plan-shares', 'POST', { code: '1.se.180_32.e', from: '小林<script>' });
  assert.strictEqual(r.s, 201); assert(/^[2-9A-HJ-NP-Z]{6}$/.test(r.b.id)); assert.strictEqual(r.b.wxacode, '');
  const id = r.b.id;
  assert.deepStrictEqual((await j('/api/plan-shares/' + id)).b, { code: '1.se.180_32.e', from: '小林script' });
  assert.strictEqual((await j('/api/plan-shares/' + id.toLowerCase())).s, 200);   // 手输小写也行
  assert.strictEqual((await j('/api/plan-shares', 'POST', { code: '1.se.180_32.e', from: '小林<script>' })).b.id, id);   // 同一份计划同一个码
  for (const bad of ['', 'javascript:alert(1)', '1.zz', '1.se.180_' + '2_'.repeat(12) + '3', '123.e']) assert.strictEqual((await j('/api/plan-shares', 'POST', { code: bad })).s, 400, bad);
  assert.strictEqual((await j('/api/plan-shares/ZZZZZZ')).s, 404);
  wx = true; r = await j('/api/plan-shares', 'POST', { code: '7.e' });
  assert.strictEqual(r.b.wxacode, `/api/wxacode?scene=${encodeURIComponent('p=' + r.b.id)}`);
  assert(('p=' + r.b.id).length <= 32);
  await ps.flush(); assert(JSON.parse(fs.readFileSync(path.join(dataDir, 'plan-shares.json'), 'utf8'))[id].code === '1.se.180_32.e');
  srv.close(); console.log('PASS plan shares: create, read, case-insensitive, dedupe, bad codes rejected, mini program code URL, persisted');
})().catch(e => { console.error(e); process.exit(1); });
