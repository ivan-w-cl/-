// 官网优惠监测自检：后台录入 → 学生端只看到确认过的数据 → 自动检查发现变化进「待核对」→ 专家确认后才生效；过期优惠自动隐藏。
// 不访问官网也不调用 AI：用假的读取函数。
const assert = require('assert'), http = require('http'), os = require('os'), fs = require('fs'), path = require('path');
const { createOffers } = require('../lib/offers');
(async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'offers-'));
  let page = { rooms: [{ name: 'Gold En Suite', type: 'ensuite', weeks: 51, rent: 160 }], fees: [{ name: 'Booking fee', name_zh: '预订费', amount: 99 }],
    official: [{ type: 'cash', unit: 'once', amount: 250, title: 'Book now and get £250 cashback', title_zh: '现在订返现 £250', conditions: '', conditions_zh: '', paid: 'after check-in', until: '2099-01-31', rooms: [], conditional: false, direct_only: false }], notes: '' };
  let fail = false; const mails = [];
  const o = createOffers({ dataDir, mail: async m => { mails.push(m); }, publicUrl: 'https://map.test', extract: async () => { if (fail) throw Object.assign(new Error('fetch 403'), { code: 'fetch_failed' }); return JSON.parse(JSON.stringify(page)); }, log: { error() {} } });
  const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
  const readBody = req => new Promise(ok => { const c = []; req.on('data', x => c.push(x)); req.on('end', () => ok(Buffer.concat(c))); });
  const json = b => { try { return JSON.parse(b.toString() || '{}'); } catch (_) { return null; } };
  const api = o.createApi({ send, readBody, json });
  const srv = http.createServer((q, r) => { const u = new URL(q.url, 'http://x'); api(q, r, u, u.pathname.startsWith('/api/admin/')); }).listen(0);
  await new Promise(r => srv.once('listening', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const j = async (p, m = 'GET', body) => { const r = await fetch(base + p, { method: m, body: body && JSON.stringify(body) }); return { s: r.status, b: await r.json() }; };

  // 管理员：填官网地址、Amber 和我们的优惠；坏地址被清掉
  let r = await j('/api/admin/offers/homes/iq-great-newton-house', 'PUT', { url: 'https://example.com/great-newton', ours: [{ type: 'cash', amount: 150, title: 'Our cashback', titleZh: '我们返现' }], amber: [{ type: 'voucher', amount: 100, title: 'Amber voucher' }] });
  assert.strictEqual(r.s, 200); assert.strictEqual(r.b.home.ours[0].amount, 150); assert(/^o_/.test(r.b.home.amber[0].id));
  assert.strictEqual((await j('/api/admin/offers/homes/xx', 'PUT', { url: 'javascript:alert(1)' })).b.home.url, '');
  assert.strictEqual((await j('/api/admin/offers/homes/Bad_ID', 'PUT', {})).s, 404);
  r = await j('/api/admin/offers/settings', 'PUT', { amberLabel: 'Amber 独家', evil: 'x' });
  assert.strictEqual(r.b.settings.amberLabel, 'Amber 独家'); assert(!('evil' in r.b.settings));

  // 第一次自动检查：没有确认过的官网数据 → 进待核对，学生端还看不到官网价
  r = await j('/api/admin/offers/check', 'POST', { homeId: 'iq-great-newton-house', wait: true });
  assert.strictEqual(r.b.results[0].changed, true);
  let all = await j('/api/admin/offers'); assert.strictEqual(all.b.pending.length, 1); assert(all.b.pending[0].changes.some(c => c.includes('新增优惠')));
  let pub = await j('/api/offers'); assert.strictEqual(pub.b.homes['iq-great-newton-house'].rooms.length, 0); assert.strictEqual(pub.b.homes['iq-great-newton-house'].ours.length, 1);
  assert.strictEqual(pub.b.settings.amberLabel, 'Amber 独家'); assert(!('pending' in pub.b));
  // 专家确认 → 学生端看到
  assert.strictEqual((await j(`/api/admin/offers/pending/${all.b.pending[0].id}/approve`, 'POST')).s, 200);
  pub = await j('/api/offers'); const h = pub.b.homes['iq-great-newton-house'];
  assert.strictEqual(h.rooms[0].rent, 160); assert.strictEqual(h.official[0].amount, 250); assert.strictEqual(h.fees[0].amount, 99); assert(h.confirmedAt);
  const firstId = h.official[0].id;

  // 再查一次没变化 → 不产生待核对
  r = await j('/api/admin/offers/check', 'POST', { homeId: 'iq-great-newton-house', wait: true }); assert.strictEqual(r.b.results[0].changed, false);
  // 官网把返现改成 £300、周租涨到 £165 → 待核对里写清楚；确认前学生端仍是旧数据；优惠 id 保留
  page.official[0].amount = 300; page.official[0].title = 'Book now and get £250 cashback'; page.rooms[0].rent = 165;
  r = await j('/api/admin/offers/check', 'POST', { homeId: 'iq-great-newton-house', wait: true });
  assert(r.b.results[0].changes.some(c => c.includes('£250') && c.includes('£300')), r.b.results[0].changes.join('|'));
  assert(r.b.results[0].changes.some(c => c.includes('£160') && c.includes('£165')));
  assert.strictEqual((await j('/api/offers')).b.homes['iq-great-newton-house'].official[0].amount, 250);
  all = await j('/api/admin/offers'); assert.strictEqual(all.b.pending[0].found.official[0].id, firstId);
  // 拒绝 → 不变
  await j(`/api/admin/offers/pending/${all.b.pending[0].id}/reject`, 'POST');
  assert.strictEqual((await j('/api/offers')).b.homes['iq-great-newton-house'].official[0].amount, 250);
  // 官网打不开 → 标记失败，学生端继续显示上次确认的
  fail = true; r = await j('/api/admin/offers/check', 'POST', { homeId: 'iq-great-newton-house', wait: true });
  assert(r.b.results[0].error.includes('手动核对')); assert.strictEqual((await j('/api/admin/offers')).b.homes['iq-great-newton-house'].checkStatus, 'failed');
  assert.strictEqual((await j('/api/offers')).b.homes['iq-great-newton-house'].official.length, 1);
  // 过期的优惠自动隐藏
  await j('/api/admin/offers/homes/iq-great-newton-house', 'PUT', { ours: [{ type: 'cash', amount: 50, title: 'Old', until: '2001-01-01' }] });
  assert.strictEqual((await j('/api/offers')).b.homes['iq-great-newton-house'].ours.length, 0);
  // 邮件提醒：学生留邮箱关注 → 专家确认官网变化 → 发信（带查看链接和退订链接）→ 退订后不再发
  assert.strictEqual((await j('/api/offers')).b.mail, true);
  assert.strictEqual((await j('/api/offers/watch', 'POST', { email: 'not-an-email', homeId: 'iq-great-newton-house' })).s, 400);
  assert.strictEqual((await j('/api/offers/watch', 'POST', { email: 'Student@Example.com', homeId: 'iq-great-newton-house', name: 'iQ Great Newton House', lang: 'zh' })).s, 201);
  fail = false; page.official[0].amount = 350;
  r = await j('/api/admin/offers/check', 'POST', { homeId: 'iq-great-newton-house', wait: true }); assert.strictEqual(r.b.results[0].changed, true);
  assert.strictEqual(mails.length, 0, 'no mail before an expert approves');
  all = await j('/api/admin/offers'); assert.strictEqual(all.b.watcherCount, 1); assert(!all.b.watchers, 'admin list does not expose emails');
  await j(`/api/admin/offers/pending/${all.b.pending[0].id}/approve`, 'POST'); await new Promise(r => setTimeout(r, 20));
  assert.strictEqual(mails.length, 1); assert.strictEqual(mails[0].to, 'student@example.com');
  assert(mails[0].subject.includes('iQ Great Newton House')); assert(mails[0].text.includes('£350'), mails[0].text);
  assert(mails[0].text.includes('https://map.test/?offer=iq-great-newton-house'));
  const off = /https:\/\/map\.test(\/api\/offers\/unwatch\?[^\s]+)/.exec(mails[0].text)[1];
  const un = await fetch(base + off); assert.strictEqual(un.status, 200); assert((await un.text()).includes('已退订'));
  await j('/api/admin/offers/homes/iq-great-newton-house', 'PUT', { official: [{ type: 'cash', amount: 400, title: 'Book now and get £250 cashback' }] }); await new Promise(r => setTimeout(r, 20));
  assert.strictEqual(mails.length, 1, 'no mail after unsubscribing');

  // 写进文件，重启后还在
  await o.flush(); const again = createOffers({ dataDir, extract: async () => page }); assert.strictEqual(again.data.homes['iq-great-newton-house'].official[0].amount, 400);

  // 真服务器：学生端公开，后台要登录
  process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'offers-srv-'));
  const { server } = require('../server.js'); server.listen(0); await new Promise(r => server.once('listening', r));
  const b2 = `http://127.0.0.1:${server.address().port}`;
  assert.strictEqual((await fetch(b2 + '/api/offers')).status, 200);
  assert.strictEqual((await fetch(b2 + '/api/admin/offers')).status, 401);
  server.close(); srv.close();
  console.log('PASS offers: admin entry, Amber label, first check → pending → approve, no-change check, change summary (£250 → £300, rent), reject, fetch failure keeps last confirmed, expired offers hidden, email alerts after approval with unsubscribe, persisted, admin login required');
})().catch(e => { console.error('FAIL offers', e); process.exit(1); });
