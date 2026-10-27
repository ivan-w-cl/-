// 周边官方数据自检：警方记录汇总（分类合计 = 总数、占比分母一致）、真实零结果、失败不变成 0、旧数据 + 后台更新、
// FSA 卫生评级（0 分保留、未评级状态不变成 0）、部分结果、中餐名单按 FSA ID + 邮编匹配、搜索分页、只接受已知房源、未接通。
// 不访问外网：用假的 fetch。
const assert = require('assert'), os = require('os'), fs = require('fs'), path = require('path');
const { createLocalData } = require('../lib/local-data');
const json = (o, status = 200) => ({ ok: status < 400, status, json: async () => o });
(async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'local-'));
  let mode = 'ok', calls = 0;
  const crimes = [...Array(7)].map(() => ({ category: 'anti-social-behaviour' })).concat([...Array(5)].map(() => ({ category: 'violent-crime' })), [{ category: 'shoplifting' }, { category: 'bicycle-theft' }]);
  const est = (id, name, rv, lat, lng, pc) => ({ FHRSID: id, BusinessName: name, BusinessType: 'Restaurant/Cafe/Canteen', AddressLine1: '1 Test St', AddressLine3: 'Liverpool', PostCode: pc, RatingValue: rv, RatingDate: '2025-03-01T00:00:00', geocode: { latitude: String(lat), longitude: String(lng) } });
  const fetchImpl = async url => {
    calls++;
    if (mode === 'down') throw new Error('ENOTFOUND');
    if (url.includes('crimes-street-dates')) return json([{ date: '2026-08' }, { date: '2026-07' }]);
    if (url.includes('crimes-street/all-crime')) return json(mode === 'zero' ? [] : crimes);
    if (url.includes('ratings.food.gov.uk')) {
      if (mode === 'partial' && url.includes('businessTypeId=7843')) return json({}, 500);
      if (url.includes('businessTypeId=1&')) return json({ establishments: [est(101, 'Zero Cafe', '0', 53.4083, -2.9707, 'L3 5BB'), est(102, 'Golden Dragon', '5', 53.409, -2.972, 'L3 8AA'), est(103, 'New Place', 'AwaitingInspection', 53.4085, -2.9705, 'L3 5BB'), est(104, 'Far Away', '4', 53.50, -2.90, 'L9 9ZZ')] });
      if (url.includes('businessTypeId=7844')) return json({ establishments: [est(201, 'Noodle Bar', 'Exempt', 53.407, -2.969, 'L3 5XX'), est(102, 'Golden Dragon', '5', 53.409, -2.972, 'L3 8AA')] });
      return json({ establishments: [est(301, 'The Pub', 'AwaitingPublication', 53.4075, -2.971, 'L3 5YY')] });
    }
    throw new Error('unexpected ' + url);
  };
  const chinese = [{ fhrsId: 102, name: 'Golden Dragon', postcode: 'L3 8AA', verifiedUrl: 'https://example.com/golden-dragon', verifiedAt: '2026-10-27' }, { fhrsId: 201, name: 'Noodle Bar', postcode: 'L1 1AA' }];
  const L = createLocalData({ dataDir, fetchImpl, env: {}, chinese, log: { error() {} } });
  const home = L.homes.find(h => h.id === 'iq-great-newton-house');

  // 警方：分类合计 = 总数，占比按全部记录算，类别按数量排序，带来源和许可
  let p = await L.police(home);
  assert.strictEqual(p.status, 'ok'); assert.strictEqual(p.month, '2026-08'); assert.strictEqual(p.radiusMiles, 1); assert.strictEqual(p.total, 14);
  assert.strictEqual(p.categories.reduce((a, c) => a + c.count, 0), p.total);
  assert(Math.abs(p.categories.reduce((a, c) => a + c.share, 0) - 1) < 1e-9);
  assert.strictEqual(p.categories[0].key, 'anti-social-behaviour'); assert.strictEqual(p.categories[0].nameZh, '反社会行为');
  assert(p.fetchedAt && p.sourceUrl && p.licence.name.includes('Open Government')); assert.strictEqual(p.centerBasis, 'building'); assert.strictEqual(p.postcode, 'L3 5BB');
  // 缓存：第二次不再请求
  const c0 = calls; await L.police(home); assert.strictEqual(calls, c0);
  // 街区房屋：说明用街区参考点
  assert.strictEqual((await L.police(L.homes.find(h => h.id === 'kensington-4-bed-student-houses'))).centerBasis, 'street-area');

  // 失败：没有旧数据时是 failed，不是 0
  mode = 'down'; const other = L.homes.find(h => h.id === 'calico');
  p = await L.police(other); assert.strictEqual(p.status, 'failed'); assert.strictEqual(p.total, undefined);
  // 真实零结果
  mode = 'zero'; p = await L.police(other); assert.strictEqual(p.status, 'ok'); assert.strictEqual(p.total, 0); assert.deepStrictEqual(p.categories, []);
  // 旧数据：过期后先返回旧数据 + 后台更新；更新失败也不丢旧数据
  await L.flush();
  const L2 = createLocalData({ dataDir, fetchImpl, env: {}, ttlHours: 0, chinese, log: { error() {} } });
  mode = 'down'; p = await L2.police(home); assert.strictEqual(p.status, 'stale'); assert.strictEqual(p.refreshPending, true); assert.strictEqual(p.total, 14);

  // FSA：1 英里内、按直线距离排序、0 分保留、未评级状态不变成 0、去重
  mode = 'ok'; let f = await L.food(home);
  assert.strictEqual(f.status, 'ok'); assert.strictEqual(f.coverage, 'complete');
  assert(!f.items.some(i => i.id === '104'), 'outside one mile excluded');
  assert.strictEqual(f.totalAll, 5, 'deduplicated across types');
  const zero = f.items.find(i => i.id === '101'); assert.strictEqual(zero.ratingValue, 0); assert.strictEqual(zero.ratingStatus, 'rated');
  assert.strictEqual(f.items.find(i => i.id === '103').ratingValue, null); assert.strictEqual(f.items.find(i => i.id === '103').ratingStatus, 'awaiting-inspection');
  assert.strictEqual(f.items.find(i => i.id === '201').ratingStatus, 'exempt'); assert.strictEqual(f.items.find(i => i.id === '301').ratingStatus, 'awaiting-publication');
  for (let i = 1; i < f.items.length; i++) assert(f.items[i - 1].distanceMeters <= f.items[i].distanceMeters);
  // 中餐：FSA ID + 邮编都对上才打标签（Noodle Bar 邮编不符，不打）
  assert.strictEqual(f.totalChinese, 1); assert.strictEqual(f.chineseDirectorySize, 2);
  f = await L.food(home, { cuisine: 'chinese' }); assert.deepStrictEqual(f.items.map(i => i.id), ['102']); assert(f.items[0].cuisineSource);
  // 搜索 + 分页
  f = await L.food(home, { q: 'pub' }); assert.deepStrictEqual(f.items.map(i => i.id), ['301']);
  f = await L.food(home, { pageSize: 5, page: 2 }); assert.strictEqual(f.pages, 1); assert.strictEqual(f.page, 1);
  // 部分结果：某一类读取失败 → partial
  mode = 'partial'; f = await L.food(other); assert.strictEqual(f.status, 'partial'); assert.strictEqual(f.coverage, 'partial'); assert(f.items.length > 0);

  // 未接通
  const off = createLocalData({ dataDir: fs.mkdtempSync(path.join(os.tmpdir(), 'local-off-')), fetchImpl, env: { LOCAL_DATA: 'off' }, log: { error() {} } });
  assert.strictEqual((await off.police(home)).status, 'unavailable');

  // HTTP：只接受已知房源
  const sent = []; const send = (res, code, obj) => sent.push([code, obj]);
  const api = L.createApi({ send });
  await api({ method: 'GET' }, {}, new URL('http://x/api/local/police?homeId=https://evil.example'));
  await api({ method: 'GET' }, {}, new URL('http://x/api/local/police?homeId=iq-great-newton-house'));
  assert.strictEqual(sent[0][0], 400); assert.strictEqual(sent[1][0], 200); assert.strictEqual(sent[1][1].homeId, 'iq-great-newton-house');
  await L.flush(); assert(fs.existsSync(path.join(dataDir, 'local-cache.json')));
  console.log('PASS local data: police sums/shares, cache, street-area basis, failure is not zero, valid zero, stale + background refresh, FSA one-mile/sort/dedupe, zero rating kept, unrated statuses, Chinese match by FHRSID + postcode, search, pagination, partial, unavailable, known homes only');
})().catch(e => { console.error('FAIL local data', e); process.exit(1); });
