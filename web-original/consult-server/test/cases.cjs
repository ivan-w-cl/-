// 咨询编号 + 群码接口自检：学生建档 → 通知 → 专家发 WhatsApp 链接 / 微信群二维码 → 学生查到 → 申请新码 → 改状态。
const assert = require('assert'), http = require('http'), os = require('os'), fs = require('fs'), path = require('path');
(async () => {
  const hooks = [];
  const fake = http.createServer((q, r) => { let b = ''; q.on('data', c => b += c); q.on('end', () => { hooks.push(JSON.parse(b)); r.end('{"errcode":0}'); }); }).listen(0);
  await new Promise(r => fake.once('listening', r));
  process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'cases-'));
  process.env.WECOM_WEBHOOK_URL = `http://127.0.0.1:${fake.address().port}/hook`;
  const { server } = require('../server.js'); server.listen(0); await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const j = async (p, o = {}) => { const r = await fetch(base + p, { ...o, headers: { 'Content-Type': 'application/json', ...(o.headers || {}) } }); return { s: r.status, b: await r.json().catch(() => null), h: r.headers }; };
  const health = await j('/api/health'); assert.strictEqual(health.b.cases, true);

  // 学生：不留任何资料，只有语言、时区、看过的房和进群前的问题
  let r = await j('/api/cases', { method: 'POST', body: JSON.stringify({ lang: 'en', tz: 'Asia/Singapore', homes: [{ id: 'capital-gate', n: 2, name: 'Capital Gate' }], qa: [{ q: 'Any rooms left?', a: '…' }] }) });
  assert.strictEqual(r.s, 201); const { id, token, code } = r.b;
  assert(/^LSM-[2-9A-HJKMNP-Z]{4}$/.test(code), 'code format ' + code);
  assert.strictEqual(r.b.case.channel, 'whatsapp'); assert.strictEqual(r.b.case.region, 'SG');
  await new Promise(r => setTimeout(r, 150));
  assert(hooks.some(h => h.markdown.content.includes(code) && h.markdown.content.includes('Capital Gate')), 'adviser notified with the code');
  assert.strictEqual((await j(`/api/cases/${id}?token=nope`)).s, 404);
  assert.strictEqual((await j(`/api/cases/${id}?token=${token}`)).b.status, 'requested');
  // 第二位同时来的学生（中文、上海时区）拿到不同编号
  const r2 = await j('/api/cases', { method: 'POST', body: JSON.stringify({ lang: 'zh', tz: 'Asia/Shanghai' }) });
  assert.notStrictEqual(r2.b.code, code); assert.strictEqual(r2.b.case.channel, 'wechat'); assert.strictEqual(r2.b.case.region, 'CN');

  // 专家
  assert.strictEqual((await j('/api/admin/cases')).s, 401);
  const login = await j('/api/admin/login', { method: 'POST', body: '{"password":"123456"}' }); const cookie = login.h.get('set-cookie').split(';')[0];
  const list = await j('/api/admin/cases', { headers: { cookie } }); assert.strictEqual(list.b.cases.length, 2); assert(list.b.cases[0].qa || list.b.cases[1].qa);
  assert.strictEqual((await j(`/api/admin/cases/${id}/group`, { method: 'POST', headers: { cookie }, body: JSON.stringify({ channel: 'whatsapp', link: 'https://evil.example/x' }) })).s, 400, 'reject non-WhatsApp link');
  r = await j(`/api/admin/cases/${id}/group`, { method: 'POST', headers: { cookie }, body: JSON.stringify({ channel: 'whatsapp', team: 'A', name: `LSM · ${code}`, link: 'https://chat.whatsapp.com/AbCdEfGhIjKlMnOp' }) });
  assert.strictEqual(r.s, 201);
  r = await j(`/api/cases/${id}?token=${token}`); assert.strictEqual(r.b.status, 'qr_sent'); assert.strictEqual(r.b.group.link, 'https://chat.whatsapp.com/AbCdEfGhIjKlMnOp'); assert.strictEqual(r.b.group.expiresAt, null);
  // 微信：必须上传群二维码图片，7 天有效
  const png = 'data:image/png;base64,' + Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]).toString('base64');
  assert.strictEqual((await j(`/api/admin/cases/${r2.b.id}/group`, { method: 'POST', headers: { cookie }, body: JSON.stringify({ channel: 'wechat' }) })).s, 400, 'wechat needs an image');
  assert.strictEqual((await j(`/api/admin/cases/${r2.b.id}/group`, { method: 'POST', headers: { cookie }, body: JSON.stringify({ channel: 'wechat', image: png }) })).s, 201);
  r = await j(`/api/cases/${r2.b.id}?token=${r2.b.token}`);
  assert(r.b.group.image.startsWith('/api/consult/media/group_')); assert.strictEqual((await fetch(base + r.b.group.image)).status, 200);
  assert(Date.parse(r.b.group.expiresAt) - Date.now() > 6.9 * 864e5);
  // 学生又咨询了别的公寓；申请新码；专家留言；改状态
  assert.strictEqual((await j(`/api/cases/${id}/homes?token=${token}`, { method: 'POST', body: JSON.stringify({ home: { id: 'the-lantern', n: 25, name: 'The Lantern' } }) })).b.homes.length, 2);
  r = await j(`/api/cases/${r2.b.id}/renew?token=${r2.b.token}`, { method: 'POST' }); assert.strictEqual(r.b.status, 'requested'); assert.strictEqual(r.b.group, null);
  assert.strictEqual((await j(`/api/admin/cases/${id}/reply`, { method: 'POST', headers: { cookie }, body: '{"text":"See you in the group!"}' })).s, 201);
  assert.strictEqual((await j(`/api/cases/${id}?token=${token}`)).b.messages[0].text, 'See you in the group!');
  assert.strictEqual((await j(`/api/admin/cases/${id}/status`, { method: 'POST', headers: { cookie }, body: '{"status":"joined"}' })).b.status, 'joined');
  assert.strictEqual((await j(`/api/admin/cases/${id}/status`, { method: 'POST', headers: { cookie }, body: '{"status":"nope"}' })).s, 400);
  console.log('PASS cases: anonymous code, region from time zone, notify, WhatsApp link / WeChat image, student poll, extra home, renew, reply, status');
  server.close(); fake.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
