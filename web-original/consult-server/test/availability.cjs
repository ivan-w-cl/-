// 抢房监测自检：用假的官网页面，不访问外网。
const assert = require('assert'), http = require('http'), os = require('os'), fs = require('fs'), path = require('path');
const { createAvailability, classify, robotsAllows } = require('../lib/availability');
(async () => {
  // 页面文字判断
  assert.strictEqual(classify('<h2>Rooms for 2027/28</h2><a>Book now</a> from &pound;189 per week', '2027/28').status, 'open');
  assert.strictEqual(classify('<h2>Rooms for 2027/28</h2><a>Book now</a> from &pound;189 per week', '2027/28').price, 189);
  assert.strictEqual(classify('2027-28 Studio: SOLD OUT', '2027/28').status, 'soldout');
  assert.strictEqual(classify('2026/27 Book now. Register your interest for next year', '2027/28').status, 'waitlist');
  assert.strictEqual(classify('2026/27 rooms. Book now £170pw', '2027/28').status, 'soon');
  assert.strictEqual(classify('<script>var y="2027/28 book now"</script>Hello', '2027/28').status, 'soon');
  assert.strictEqual(robotsAllows('User-agent: *\nDisallow: /booking', '/booking/rooms'), false);
  assert.strictEqual(robotsAllows('User-agent: *\nDisallow: /booking\nAllow: /booking/rooms', '/booking/rooms'), true);
  assert.strictEqual(robotsAllows('User-agent: Googlebot\nDisallow: /', '/x'), true);

  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'avail-'));
  const sourcesFile = path.join(dataDir, 'sources.json');
  let t = Date.parse('2026-10-28T09:00:00Z');
  fs.writeFileSync(sourcesFile, JSON.stringify({ year: '2027/28', allowedHosts: ['example.com'], homes: {
    'iq-great-newton-house': { url: 'https://www.example.com/great-newton', opens: '2026-10-30' },
    'yugo-ablett-house': { url: 'https://evil.test/x', opens: '2027-01-10' },
    'the-arch': { url: 'https://www.example.com/private/arch', opens: '2027-01-10' }, 'capital-gate': { opens: '2026-10-20' } } }));
  let page = '<h1>Great Newton House</h1><p>2026/27 Book now</p><p>2027/28 coming soon</p>', hits = [];
  const fetchImpl = async u => { hits.push(u); if (u.endsWith('/robots.txt')) return { ok: true, text: async () => 'User-agent: *\nDisallow: /private' }; return { ok: true, status: 200, text: async () => page }; };
  const mails = [];
  const a = createAvailability({ dataDir, sourcesFile, fetchImpl, mail: async m => { mails.push(m); }, publicUrl: 'https://map.test', now: () => t, hostGapMs: 0, log: { error() {} } });
  const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
  const readBody = req => new Promise(ok => { const c = []; req.on('data', x => c.push(x)); req.on('end', () => ok(Buffer.concat(c))); });
  const json = b => { try { return JSON.parse(b.toString() || '{}'); } catch (_) { return null; } };
  const api = a.createApi({ send, readBody, json });
  const srv = http.createServer((q, r) => { const u = new URL(q.url, 'http://x'); api(q, r, u, u.pathname.startsWith('/api/admin/')); }).listen(0);
  await new Promise(r => srv.once('listening', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const j = async (p, m = 'GET', body) => { const r = await fetch(base + p, { method: m, body: body && JSON.stringify(body) }); const txt = await r.text(); let b; try { b = JSON.parse(txt); } catch (_) { b = txt; } return { s: r.status, b }; };

  // 第一次检查：目标学年还没出现 → soon；不在白名单的网址不抓；robots 不让抓的记 blocked
  let r = await j('/api/admin/availability/check', 'POST', { wait: true });
  const res = Object.fromEntries(r.b.results.map(x => [x.id, x]));
  assert.strictEqual(res['iq-great-newton-house'].status, 'waitlist');   // "coming soon" 算候补/登记意向
  assert.strictEqual(res['yugo-ablett-house'].error, 'host_not_allowed');
  assert.strictEqual(res['the-arch'].status, 'blocked');
  assert(!hits.some(u => u.includes('evil.test')) && !hits.some(u => u.includes('/private')));

  // 学生关注：邮箱校验、未知公寓被拒
  assert.strictEqual((await j('/api/availability/watch', 'POST', { email: 'bad', homeId: 'iq-great-newton-house' })).s, 400);
  assert.strictEqual((await j('/api/availability/watch', 'POST', { email: 'a@b.co', homeId: 'nope' })).s, 400);
  assert.strictEqual((await j('/api/availability/watch', 'POST', { email: 'Stu@Uni.ac.uk', homeIds: ['iq-great-newton-house'], lang: 'zh' })).s, 201);

  // 频率：开放日前 2 天 → 7 分钟一档；远离开放日 → 45 分钟一档
  assert(a.dueIn('iq-great-newton-house') <= 8 * 6e4 && a.dueIn('iq-great-newton-house') > 6 * 6e4, String(a.dueIn('iq-great-newton-house')));
  assert(a.dueIn('the-arch') > 40 * 6e4);
  t += 8 * 6e4; await a.tick();

  // 官网开放：出现 2027/28 + Book now → open，发邮件（含官网和退订链接）
  page = '<h1>Rooms 2027/28</h1><button>Book now</button> Studios from £199 per week';
  t += 8 * 6e4; await a.tick();
  let pub = (await j('/api/availability')).b;
  assert.strictEqual(pub.homes['iq-great-newton-house'].status, 'open'); assert.strictEqual(pub.homes['iq-great-newton-house'].price, 199);
  assert(!('watchers' in pub) && pub.homes['iq-great-newton-house'].checkedAt);
  assert.strictEqual(pub.homes['capital-gate'].opens, '2026-10-20');   // 没网址的也给网页看开放日
  await new Promise(r => setTimeout(r, 20));
  assert.strictEqual(mails.length, 1); assert(mails[0].to === 'stu@uni.ac.uk' && mails[0].subject.includes('开放预订'));
  assert(mails[0].text.includes('https://www.example.com/great-newton') && mails[0].text.includes('/api/availability/unwatch?t='));
  // 状态没变不重复发
  t += 8 * 6e4; await a.tick(); await new Promise(r => setTimeout(r, 20)); assert.strictEqual(mails.length, 1);
  // 售罄后又有房 → 再提醒
  page = '2027/28 Sold out'; t += 8 * 6e4; await a.tick();
  page = '2027/28 Book now'; t += 8 * 6e4; await a.tick(); await new Promise(r => setTimeout(r, 20));
  assert.strictEqual(mails.length, 2); assert(mails[1].text.includes('又有房'));

  // 官网打不开 → 保留上次状态，退避
  const failing = createAvailability({ dataDir: fs.mkdtempSync(path.join(os.tmpdir(), 'avail-')), sourcesFile, fetchImpl: async u => { if (u.endsWith('robots.txt')) return { ok: false }; return { ok: false, status: 503 }; }, now: () => t, hostGapMs: 0, log: { error() {} } });
  const fr = await failing.checkOne('iq-great-newton-house'); assert.strictEqual(fr.error, 'HTTP 503');
  assert(failing.dueIn('iq-great-newton-house') > 10 * 6e4);

  // 后台改来源：不在白名单的网址拒绝；手动标记开放也会提醒
  assert.strictEqual((await j('/api/admin/availability/sources/the-arch', 'PUT', { url: 'http://www.example.com/arch' })).s, 400);
  assert.strictEqual((await j('/api/admin/availability/sources/the-arch', 'PUT', { url: 'https://www.example.com/arch', opens: '2026-12-01' })).s, 200);
  await j('/api/availability/watch', 'POST', { email: 'stu@uni.ac.uk', homeId: 'the-arch' });
  assert.strictEqual((await j('/api/admin/availability/status/the-arch', 'PUT', { status: 'open', note: '专家电话确认' })).s, 200);
  await new Promise(r => setTimeout(r, 20)); assert.strictEqual(mails.length, 3);

  // 退订
  const tok = /t=([\w-]+)/.exec(mails[0].text)[1];
  r = await j(`/api/availability/unwatch?t=${tok}&home=iq-great-newton-house`); assert(String(r.b).includes('已退订'));
  assert.deepStrictEqual(a.data.watchers[0].homes, ['the-arch']);
  await a.flush(); assert(JSON.parse(fs.readFileSync(path.join(dataDir, 'availability.json'), 'utf8')).homes['iq-great-newton-house'].history.length >= 3);
  srv.close(); console.log('availability ok');
})().catch(e => { console.error(e); process.exit(1); });
