'use strict';
/* 周边官方数据：警方公开记录（data.police.uk）和食品卫生评级（英国食品标准局 FSA）。网页通过本服务器读取，浏览器不用直连英国接口。
   - 只接受 lib/homes-geo.json 里的 47 个固定房源 ID，按房源的固定参考坐标查询半径 1 英里，不做任意网址中转。
   - 缓存在 DATA_DIR/local-cache.json：新鲜时直接返回；过期时先返回旧数据（标 stale + refreshPending）并在后台更新；
     读取失败时不把失败变成 0：有旧数据就返回带日期的旧数据，没有就返回 status: 'failed'，网页显示重试。
   - LOCAL_DATA=off 时返回 status: 'unavailable'（数据源未接通）。LOCAL_UPSTREAM=https://… 时改为读取已有的公开接口（/api/safety、/api/food）。
   数据许可：Open Government Licence v3.0，页面保留来源和许可。 */
const fs = require('fs'), path = require('path');
const HOMES = require('./homes-geo.json');
const byId = new Map(HOMES.map(h => [h.id, h]));
const RADIUS_MI = 1, MI_M = 1609.344;
const OGL = { name: 'Open Government Licence v3.0', url: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/' };

/* 警方记录类别：英文名来自 data.police.uk，中文是本站翻译 */
const POLICE_CATS = {
  'anti-social-behaviour': ['Anti-social behaviour', '反社会行为'], 'bicycle-theft': ['Bicycle theft', '自行车盗窃'], 'burglary': ['Burglary', '入室盗窃'],
  'criminal-damage-arson': ['Criminal damage and arson', '刑事毁坏与纵火'], 'drugs': ['Drugs', '毒品'], 'other-theft': ['Other theft', '其他盗窃'],
  'possession-of-weapons': ['Possession of weapons', '持有武器'], 'public-order': ['Public order', '扰乱公共秩序'], 'robbery': ['Robbery', '抢劫'],
  'shoplifting': ['Shoplifting', '商店盗窃'], 'theft-from-the-person': ['Theft from the person', '扒窃'], 'vehicle-crime': ['Vehicle crime', '车辆相关犯罪'],
  'violent-crime': ['Violence and sexual offences', '暴力与性犯罪'], 'other-crime': ['Other crime', '其他犯罪']
};
/* FSA 场所类型：餐厅 / 咖啡馆 / 食堂、外卖 / 三明治店、酒吧 */
const FSA_TYPES = [[1, 'restaurant'], [7844, 'takeaway'], [7843, 'pub']];
const RATING_STATES = { AwaitingInspection: 'awaiting-inspection', AwaitingPublication: 'awaiting-publication', Exempt: 'exempt' };

const haversine = (a, b) => {
  const R = 6371008.8, rad = x => x * Math.PI / 180, dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};
async function getJson(fetchImpl, url, headers) {
  const r = await fetchImpl(url, { headers: { Accept: 'application/json', 'User-Agent': 'LiverpoolStudentMap/1.0', ...(headers || {}) }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw Object.assign(new Error(`HTTP ${r.status} from ${new URL(url).host}`), { status: r.status });
  return r.json();
}

/* ---------- 读取：警方记录 ---------- */
async function fetchPolice(fetchImpl, home) {
  const dates = await getJson(fetchImpl, 'https://data.police.uk/api/crimes-street-dates');
  const month = dates && dates[0] && dates[0].date;
  if (!month) throw new Error('no month from data.police.uk');
  const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${home.lat}&lng=${home.lng}&date=${month}`;
  const list = await getJson(fetchImpl, url);
  if (!Array.isArray(list)) throw new Error('unexpected police response');
  const counts = {};
  list.forEach(c => { counts[c.category] = (counts[c.category] || 0) + 1; });
  return { month, total: list.length, counts, sourceUrl: 'https://data.police.uk/', queryUrl: url };
}
function shapePolice(home, raw) {
  const total = raw.total;
  const categories = Object.entries(raw.counts).map(([key, count]) => ({ key, name: (POLICE_CATS[key] || [key])[0], nameZh: (POLICE_CATS[key] || [, key])[1], count, share: total ? count / total : 0 }))
    .sort((a, b) => b.count - a.count);
  return { month: raw.month, radiusMiles: RADIUS_MI, total, categories, sourceUrl: raw.sourceUrl, licence: OGL, missingDataUrl: 'https://data.police.uk/changelog/' };
}

/* ---------- 读取：FSA 食品卫生评级 ---------- */
async function fetchFood(fetchImpl, home) {
  const items = new Map(); let failed = 0;
  for (const [typeId, kind] of FSA_TYPES) {
    try {
      const url = `https://api.ratings.food.gov.uk/Establishments?latitude=${home.lat}&longitude=${home.lng}&maxDistanceLimit=${RADIUS_MI}&businessTypeId=${typeId}&pageNumber=1&pageSize=5000`;
      const j = await getJson(fetchImpl, url, { 'x-api-version': '2' });
      (j.establishments || []).forEach(e => {
        const id = String(e.FHRSID); if (items.has(id)) return;
        const lat = parseFloat(e.geocode && e.geocode.latitude), lng = parseFloat(e.geocode && e.geocode.longitude);
        const dist = Number.isFinite(lat) && Number.isFinite(lng) ? haversine(home, { lat, lng }) : (Number(e.Distance) > 0 ? Number(e.Distance) * MI_M : null);
        if (dist != null && dist > RADIUS_MI * MI_M * 1.001) return;
        const rv = String(e.RatingValue ?? '');
        items.set(id, {
          id, name: e.BusinessName || '', kind, businessType: e.BusinessType || '',
          address: [e.AddressLine1, e.AddressLine2, e.AddressLine3, e.AddressLine4].filter(Boolean).join(', '), postcode: e.PostCode || '',
          ratingValue: /^[0-5]$/.test(rv) ? Number(rv) : null, ratingStatus: /^[0-5]$/.test(rv) ? 'rated' : RATING_STATES[rv] || 'other', ratingText: rv,
          ratingDate: e.RatingDate && !/^0001/.test(e.RatingDate) ? String(e.RatingDate).slice(0, 10) : '',
          distanceMeters: dist == null ? null : Math.round(dist), sourceUrl: `https://ratings.food.gov.uk/business/${id}`
        });
      });
    } catch (e) { failed++; if (failed === FSA_TYPES.length) throw e; }
  }
  return { items: [...items.values()].sort((a, b) => (a.distanceMeters ?? 1e9) - (b.distanceMeters ?? 1e9)), coverage: failed ? 'partial' : 'complete' };
}

/* ---------- 已有公开接口（LOCAL_UPSTREAM）：字段和本服务一致时直接沿用 ---------- */
async function fetchUpstream(fetchImpl, base, kind, home) {
  const j = await getJson(fetchImpl, `${base.replace(/\/$/, '')}/api/${kind === 'police' ? 'safety' : 'food'}?homeId=${encodeURIComponent(home.id)}`);
  return j;
}

function createLocalData({ dataDir, fetchImpl = (...a) => fetch(...a), env = process.env, ttlHours = Number(env.LOCAL_TTL_HOURS || 24), chinese = null, log = console }) {
  const file = path.join(dataDir, 'local-cache.json');
  let cache = { police: {}, food: {} }, queue = Promise.resolve();
  try { cache = { police: {}, food: {}, ...JSON.parse(fs.readFileSync(file, 'utf8')) }; } catch (_) { /* 第一次运行 */ }
  const save = () => { const json = JSON.stringify(cache); queue = queue.then(() => new Promise(ok => { fs.mkdirSync(dataDir, { recursive: true }); const tmp = file + '.tmp'; fs.writeFile(tmp, json, e => { if (e) { log.error('[local] 写入失败', e.message); return ok(); } fs.rename(tmp, file, () => ok()); }); })); return queue; };
  const CHINESE = chinese || (() => { try { return require('./chinese-food.json'); } catch (_) { return []; } })();
  const inflight = new Map();
  const off = env.LOCAL_DATA === 'off';

  async function refresh(kind, home) {
    const key = kind + ':' + home.id;
    if (inflight.has(key)) return inflight.get(key);
    const p = (async () => {
      let data;
      if (env.LOCAL_UPSTREAM) data = await fetchUpstream(fetchImpl, env.LOCAL_UPSTREAM, kind, home);
      else if (kind === 'police') data = shapePolice(home, await fetchPolice(fetchImpl, home));
      else data = await fetchFood(fetchImpl, home);
      cache[kind][home.id] = { at: new Date().toISOString(), data }; save();
      return cache[kind][home.id];
    })().finally(() => inflight.delete(key));
    inflight.set(key, p);
    return p;
  }
  /* 返回 { entry, stale, refreshPending, error } */
  async function get(kind, home) {
    const hit = cache[kind][home.id], fresh = hit && Date.now() - Date.parse(hit.at) < ttlHours * 3600e3;
    if (hit && fresh) return { entry: hit };
    if (hit) { refresh(kind, home).catch(e => log.error('[local] 后台更新失败', kind, home.id, e.message)); return { entry: hit, stale: true, refreshPending: true }; }
    try { return { entry: await refresh(kind, home) }; } catch (e) { log.error('[local] 读取失败', kind, home.id, e.message); return { error: e.message }; }
  }
  const base = home => ({ homeId: home.id, name: home.name, postcode: home.postcode, postcodeFull: home.postcodeFull, centerBasis: home.group ? 'street-area' : 'building', center: { lat: home.lat, lng: home.lng }, radiusMiles: RADIUS_MI });

  async function police(home) {
    if (off) return { ...base(home), status: 'unavailable' };
    const r = await get('police', home);
    if (!r.entry) return { ...base(home), status: 'failed', error: r.error };
    return { ...base(home), ...r.entry.data, fetchedAt: r.entry.at, status: r.stale ? 'stale' : 'ok', refreshPending: !!r.refreshPending };
  }
  async function food(home, { q = '', cuisine = 'all', page = 1, pageSize = 20 } = {}) {
    if (off) return { ...base(home), status: 'unavailable' };
    const r = await get('food', home);
    if (!r.entry) return { ...base(home), status: 'failed', error: r.error };
    const chineseIds = new Map(CHINESE.map(c => [String(c.fhrsId), c]));
    let items = r.entry.data.items.map(it => { const c = chineseIds.get(it.id); return c && norm(c.postcode) === norm(it.postcode) ? { ...it, cuisine: 'chinese', cuisineSource: c.verifiedUrl, cuisineVerifiedAt: c.verifiedAt } : it; });
    const totalAll = items.length, totalChinese = items.filter(it => it.cuisine === 'chinese').length;
    if (cuisine === 'chinese') items = items.filter(it => it.cuisine === 'chinese');
    const nq = String(q).trim().toLowerCase();
    if (nq) items = items.filter(it => (it.name + ' ' + it.address + ' ' + it.postcode).toLowerCase().includes(nq));
    const size = Math.min(50, Math.max(5, Number(pageSize) || 20)), pages = Math.max(1, Math.ceil(items.length / size)), pg = Math.min(pages, Math.max(1, Number(page) || 1));
    const coverage = r.entry.data.coverage || 'complete';
    return { ...base(home), status: r.stale ? 'stale' : coverage === 'partial' ? 'partial' : 'ok', coverage, refreshPending: !!r.refreshPending, fetchedAt: r.entry.at,
      totalAll, totalChinese, chineseDirectorySize: CHINESE.length, total: items.length, page: pg, pages, pageSize: size, items: items.slice((pg - 1) * size, pg * size),
      sourceUrl: 'https://ratings.food.gov.uk/', licence: OGL };
  }
  const norm = s => String(s || '').toUpperCase().replace(/\s+/g, '');

  /* GET /api/local/police?homeId=…，GET /api/local/food?homeId=…&q=&cuisine=all|chinese&page= */
  function createApi({ send, limited = () => false }) {
    return async function localApi(req, res, url) {
      if (req.method !== 'GET') return send(res, 405, { error: 'method' });
      const m = /^\/api\/local\/(police|food)$/.exec(url.pathname); if (!m) return send(res, 404, { error: 'not_found' });
      const home = byId.get(url.searchParams.get('homeId') || '');
      if (!home) return send(res, 400, { error: 'unknown_home' });
      if (limited(req, 'local:', 240, 10 * 60e3)) return send(res, 429, { error: 'rate_limited' });
      const out = m[1] === 'police' ? await police(home) : await food(home, Object.fromEntries(url.searchParams));
      return send(res, 200, out);
    };
  }
  return { createApi, police, food, refresh, homes: HOMES, flush: () => queue, get cache() { return cache; } };
}
module.exports = { createLocalData, POLICE_CATS, haversine, HOMES };
