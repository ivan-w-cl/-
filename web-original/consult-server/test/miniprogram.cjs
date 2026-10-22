// 小程序相关自检（不连微信）：登录 code 换 openid、专家发群码后推送订阅消息、openid 不外泄、利物浦天气代取和缓存。
const assert = require('assert'), http = require('http'), os = require('os'), fs = require('fs'), path = require('path');
(async () => {
  const calls = [];
  const fake = http.createServer((q, r) => { let b = ''; q.on('data', c => b += c); q.on('end', () => {
    calls.push({ url: q.url, body: b ? JSON.parse(b) : null });
    r.setHeader('Content-Type', 'application/json');
    if (q.url.startsWith('/sns/jscode2session')) return r.end(JSON.stringify(/js_code=good/.test(q.url) ? { openid: 'o_test_openid', session_key: 'k' } : { errcode: 40029, errmsg: 'invalid code' }));
    if (q.url.startsWith('/cgi-bin/stable_token')) return r.end('{"access_token":"T","expires_in":7200}');
    if (q.url.startsWith('/cgi-bin/message/subscribe/send')) return r.end('{"errcode":0,"errmsg":"ok"}');
    if (q.url.startsWith('/weather')) return r.end('{"current":{"temperature_2m":11.2,"weather_code":61},"daily":{}}');
    r.end('{}'); }); }).listen(0);
  await new Promise(r => fake.once('listening', r));
  const F = `http://127.0.0.1:${fake.address().port}`;
  Object.assign(process.env, { DATA_DIR: fs.mkdtempSync(path.join(os.tmpdir(), 'mp-')), WX_APPID: 'wx_test', WX_APPSECRET: 's', WX_API_BASE: F, WEATHER_URL: F + '/weather',
    WX_SUB_TEMPLATE_ID: 'TPL1', WX_SUB_TEMPLATE_DATA: JSON.stringify({ character_string1: '{code}', thing2: '{home}', phrase3: '群码已发送' }) });
  const { server } = require('../server.js'); server.listen(0); await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const j = async (p, o = {}) => { const r = await fetch(base + p, { ...o, headers: { 'Content-Type': 'application/json', ...(o.headers || {}) } }); return { s: r.status, b: await r.json().catch(() => null), h: r.headers }; };

  // 小程序学生：带登录 code，同意了订阅
  let r = await j('/api/cases', { method: 'POST', body: JSON.stringify({ lang: 'zh', tz: 'Asia/Shanghai', app: 'miniprogram', wxcode: 'good', subscribed: true, homes: [{ id: 'capital-gate', n: 2, name: 'Capital Gate' }] }) });
  assert.strictEqual(r.s, 201); const { id, token } = r.b;
  assert(!JSON.stringify(r.b).includes('o_test_openid'), 'openid never returned to the student');
  // 登录 code 无效：照样建档，只是不能提醒
  const bad = await j('/api/cases', { method: 'POST', body: JSON.stringify({ lang: 'zh', app: 'miniprogram', wxcode: 'bad', subscribed: true }) });
  assert.strictEqual(bad.s, 201);
  const login = await j('/api/admin/login', { method: 'POST', body: '{"password":"123456"}' }); const cookie = login.h.get('set-cookie').split(';')[0];
  const list = await j('/api/admin/cases', { headers: { cookie } });
  assert(!JSON.stringify(list.b).includes('o_test_openid'), 'openid not shown to experts');
  const mine = list.b.cases.find(c => c.id === id); assert.strictEqual(mine.app, 'miniprogram'); assert.strictEqual(mine.reminder, true);
  assert.strictEqual(list.b.cases.find(c => c.id === bad.b.id).reminder, false);
  // 专家发微信群码 → 推送订阅消息
  const png = 'data:image/png;base64,' + Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]).toString('base64');
  assert.strictEqual((await j(`/api/admin/cases/${id}/group`, { method: 'POST', headers: { cookie }, body: JSON.stringify({ channel: 'wechat', image: png }) })).s, 201);
  await new Promise(r => setTimeout(r, 200));
  const sub = calls.find(c => c.url.startsWith('/cgi-bin/message/subscribe/send'));
  assert(sub, 'subscribe message sent'); assert.strictEqual(sub.body.touser, 'o_test_openid'); assert.strictEqual(sub.body.template_id, 'TPL1');
  assert.strictEqual(sub.body.page, `pages/index/index?group=1`); assert.strictEqual(sub.body.data.thing2.value, 'Capital Gate'); assert(/^LSM-/.test(sub.body.data.character_string1.value));
  // 申请新码时再次同意订阅
  r = await j(`/api/cases/${id}/renew?token=${token}`, { method: 'POST', body: '{"subscribed":true}' }); assert.strictEqual(r.b.status, 'requested');
  // 天气：代取一次，之后 15 分钟内走缓存
  const w1 = await j('/api/weather'), w2 = await j('/api/weather');
  assert.strictEqual(w1.s, 200); assert.strictEqual(w1.b.current.temperature_2m, 11.2); assert.deepStrictEqual(w2.b, w1.b);
  assert.strictEqual(calls.filter(c => c.url.startsWith('/weather')).length, 1, 'weather cached');
  console.log('PASS miniprogram: login code → openid (kept server-side), subscribe reminder when the group code is sent, renew re-subscribe, weather proxy + cache');
  server.close(); fake.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
