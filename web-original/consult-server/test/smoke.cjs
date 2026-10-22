// 冒烟测试：不访问微信服务器。启动一个临时服务器（随机端口、临时数据目录）+ 假的企业微信 webhook。
const assert = require('assert'), http = require('http'), os = require('os'), fs = require('fs'), path = require('path');
(async () => {
  const hooks = [];
  const fake = http.createServer((q, r) => { let b = ''; q.on('data', c => b += c); q.on('end', () => { hooks.push(JSON.parse(b)); r.end('{"errcode":0}'); }); }).listen(0);
  await new Promise(r => fake.once('listening', r));
  process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'consult-'));
  process.env.WECOM_WEBHOOK_URL = `http://127.0.0.1:${fake.address().port}/hook`;
  process.env.WX_APPID = 'wxtestappid000001'; process.env.WX_APPSECRET = 'x'; process.env.WX_TOKEN = 'tok123';
  process.env.WX_ENCODING_AES_KEY = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG';
  const { server } = require('../server.js'); server.listen(0); await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const j = async (p, o = {}) => { const r = await fetch(base + p, { ...o, headers: { 'Content-Type': 'application/json', ...(o.headers || {}) } }); return { s: r.status, b: await r.json().catch(() => null), h: r.headers }; };
  // student
  let r = await j('/api/consult/sessions', { method: 'POST', body: JSON.stringify({ text: '我想咨询这套房', nickname: '小王', context: { homes: [{ n: 25, name: 'The Lantern' }], lifeCharacter: '咖啡馆学习派' } }) });
  assert.strictEqual(r.s, 201); const { id, token } = r.b;
  assert.strictEqual((await j(`/api/consult/sessions/${id}?token=bad`)).s, 404);
  await new Promise(r => setTimeout(r, 200));
  assert(hooks[0] && hooks[0].msgtype === 'markdown' && /The Lantern/.test(hooks[0].markdown.content) && /小王/.test(hooks[0].markdown.content), 'wecom markdown');
  // admin
  assert.strictEqual((await j('/api/admin/sessions')).s, 401);
  assert.strictEqual((await j('/api/admin/login', { method: 'POST', body: '{"password":"nope"}' })).s, 401);
  r = await j('/api/admin/login', { method: 'POST', body: '{"password":"123456"}' }); assert.strictEqual(r.s, 200);
  const cookie = r.h.get('set-cookie').split(';')[0];
  const png = 'data:image/png;base64,' + Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,0,0,0,0]).toString('base64');
  assert.strictEqual((await j(`/api/admin/sessions/${id}/reply`, { method: 'POST', headers: { cookie }, body: JSON.stringify({ image: 'data:image/png;base64,AAAA' }) })).s, 400, 'reject non-png');
  r = await j(`/api/admin/sessions/${id}/reply`, { method: 'POST', headers: { cookie }, body: JSON.stringify({ image: png, text: '进群发房号' }) }); assert.strictEqual(r.s, 201);
  r = await j(`/api/consult/sessions/${id}?token=${token}`); const img = r.b.messages.find(m => m.image); assert(img && img.text === '进群发房号');
  assert.strictEqual((await fetch(base + img.image)).status, 200);
  assert.strictEqual((await j(`/api/admin/sessions/${id}/status`, { method: 'POST', headers: { cookie }, body: '{"status":"done"}' })).s, 200);
  assert.notStrictEqual((await fetch(base + '/%2e%2e/consult-server/server.js')).status, 200, 'no path traversal');
  // miniprogram crypto helpers (offline)
  const mp = require('../channels/miniprogram.js')._internals, crypto = require('crypto');
  const ts = '1700000000', nonce = 'n1', sig = crypto.createHash('sha1').update(['tok123', ts, nonce].sort().join('')).digest('hex');
  assert(mp.checkSignature({ signature: sig, timestamp: ts, nonce }));
  assert(!mp.checkSignature({ signature: 'x' + sig.slice(1), timestamp: ts, nonce }));
  const enc = mp.encrypt('{"MsgType":"text","Content":"hi","FromUserName":"o_1"}'); assert.strictEqual(JSON.parse(mp.decrypt(enc)).Content, 'hi');
  // GET verification through the HTTP route
  const v = await fetch(`${base}/api/wx/callback?signature=${sig}&timestamp=${ts}&nonce=${nonce}&echostr=hello`); assert.strictEqual(await v.text(), 'hello');
  // encrypted push creates a miniprogram session
  const msig = crypto.createHash('sha1').update(['tok123', ts, nonce, enc].sort().join('')).digest('hex');
  const p = await fetch(`${base}/api/wx/callback?msg_signature=${msig}&timestamp=${ts}&nonce=${nonce}`, { method: 'POST', body: JSON.stringify({ Encrypt: enc }) });
  assert.strictEqual(await p.text(), 'success'); await new Promise(r => setTimeout(r, 100));
  r = await j('/api/admin/sessions', { headers: { cookie } }); assert(r.b.sessions.some(s => s.channel === 'miniprogram' && s.replyWindowEndsAt));
  console.log('PASS consult-server smoke: student→webhook→admin reply→student, auth, image validation, WeChat signature/AES/callback (offline)');
  server.close(); fake.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
