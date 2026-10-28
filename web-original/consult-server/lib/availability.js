'use strict';
/* 抢房监测（2 号方案：定时查官网公开页面）。
   - 每栋楼一条来源（lib/availability-sources.json，订房专家维护）：官网公开的房型 / 预订页面、要盯的学年（如 2027/28）、预计开放日。
   - 服务器定时打开这个页面，按页面上的文字判断状态：
       open 已开放（页面出现目标学年 + Book now 一类按钮）/ soldout 售罄 / waitlist 候补或登记意向 / soon 页面上还没有目标学年 / unknown 判断不了。
     顺便读出页面上最低的周租（£xxx per week）。
   - 频率：平时每 45 分钟一次；预计开放日前 3 天到后 2 天、或状态是 soon 且开放日临近时，每 7 分钟一次；每次加一点随机间隔。
     同一个网站两次请求至少间隔 15 秒；遵守 robots.txt（不让抓的页面不抓，状态记为 blocked）。
   - 状态变成「已开放」（包括售罄后又有房）时，给关注这栋楼的学生发邮件（每封都有退订链接）。
   - 只读公开页面，不登录、不提交表单、不替学生下单，也不绕过排队和验证码。
   - 只接受已知公寓编号；来源网址必须是 https 且域名在 allowedHosts 里，避免被拿来访问任意网址。
   环境变量：AVAILABILITY=off 关闭；AVAILABILITY_NORMAL_MIN、AVAILABILITY_FAST_MIN 改频率。 */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const HOMES = require('./homes-geo.json');
const byId = new Map(HOMES.map(h => [h.id, h]));
const UA = 'LiverpoolStudentMapBot/1.0 (availability alerts for students; respects robots.txt)';
const STATUSES = ['open', 'soldout', 'waitlist', 'soon', 'unknown', 'blocked', 'error'];

/* ---------- 读页面文字、判断状态 ---------- */
function pageText(html) {
  return String(html || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&pound;|&#163;/g, '£').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
}
function yearTokens(year) {
  const m = /^(20)?(\d{2})\s*[/-]\s*(20)?(\d{2})$/.exec(String(year || '').trim()); if (!m) return [];
  const a = m[2], b = m[4];
  return [`20${a}/${b}`, `20${a}-${b}`, `20${a}/20${b}`, `20${a}-20${b}`, `20${a} - 20${b}`, `20${a} / 20${b}`, `${a}/${b}`, `20${a}/${b} academic year`];
}
function classify(html, year) {
  const t = pageText(html), low = t.toLowerCase(), tokens = yearTokens(year).map(x => x.toLowerCase());
  /* 只看目标学年附近的文字（前 120 字到后 260 字），避免把「今年 Book now、明年 coming soon」误判成已开放 */
  const near = [];
  tokens.forEach(x => { let i = low.indexOf(x); while (i >= 0) { near.push(low.slice(Math.max(0, i - 120), i + x.length + 260)); i = low.indexOf(x, i + 1); } });
  const hasYear = near.length > 0, zone = hasYear ? near.join(' | ') : low;
  const BOOK = /\b(book now|book a room|book online|book your room|reserve now|reserve your room|select (a )?room|choose (a )?room|apply now)\b/;
  const SOLD = /\b(sold out|fully booked|no rooms? available|no availability|currently unavailable)\b/;
  const WAIT = /\b(waiting list|waitlist|join the wait|register (your )?interest|notify me|coming soon|bookings? (will )?open soon)\b/;
  /* 每一处目标学年分别判断：有一处是「可订且没写售罄 / 候补」就算开放 */
  const bookOk = near.some(w => BOOK.test(w) && !SOLD.test(w) && !WAIT.test(w));
  const book = BOOK.test(zone), sold = SOLD.test(zone), wait = WAIT.test(zone);
  const prices = [...t.matchAll(/£\s?(\d{2,3}(?:\.\d{1,2})?)\s*(?:pp?w|p\/w|per\s+(?:person\s+per\s+)?week|\/\s?week|a\s+week|weekly)/gi)].map(m => Number(m[1])).filter(n => n >= 60 && n <= 600);
  let status;
  if (bookOk) status = 'open';
  else if (hasYear && sold) status = 'soldout';
  else if (wait) status = 'waitlist';
  else if (!hasYear && tokens.length) status = 'soon';
  else status = 'unknown';
  const signals = [hasYear && 'year', book && 'book', sold && 'soldout', wait && 'waitlist'].filter(Boolean);
  return { status, signals, price: prices.length ? Math.min(...prices) : null };
}

/* ---------- robots.txt（只看 User-agent: * 那一组的 Disallow / Allow） ---------- */
function robotsAllows(txt, pathname) {
  let on = false, rules = [];
  String(txt || '').split(/\r?\n/).forEach(line => {
    const l = line.replace(/#.*/, '').trim(); if (!l) return;
    const [k, ...rest] = l.split(':'), v = rest.join(':').trim(), key = k.trim().toLowerCase();
    if (key === 'user-agent') on = v === '*';
    else if (on && (key === 'disallow' || key === 'allow')) rules.push([key, v]);
  });
  let best = null;
  rules.forEach(([key, v]) => { if (v && pathname.startsWith(v) && (!best || v.length > best[1].length)) best = [key, v]; });
  return !best || best[0] === 'allow';
}

function createAvailability({ dataDir, fetchImpl = (...a) => fetch(...a), env = process.env, mail = null, publicUrl = '', log = console, now = () => Date.now(), sourcesFile = path.join(__dirname, 'availability-sources.json'), hostGapMs = 15e3 }) {
  const file = path.join(dataDir, 'availability.json');
  const off = env.AVAILABILITY === 'off';
  const NORMAL = Number(env.AVAILABILITY_NORMAL_MIN || 45) * 6e4, FAST = Number(env.AVAILABILITY_FAST_MIN || 7) * 6e4, HOST_GAP = hostGapMs;
  let cfg = { year: '2027/28', allowedHosts: [], homes: {} };
  try { cfg = { ...cfg, ...JSON.parse(fs.readFileSync(sourcesFile, 'utf8')) }; } catch (_) { /* 还没有来源表 */ }
  let data = { homes: {}, watchers: [], sources: {}, updatedAt: '' }, queue = Promise.resolve();
  try { data = { ...data, ...JSON.parse(fs.readFileSync(file, 'utf8')) }; } catch (_) { /* 第一次运行 */ }
  const save = () => {
    data.updatedAt = new Date(now()).toISOString();
    const json = JSON.stringify(data, null, 1);
    queue = queue.then(() => new Promise(ok => { fs.mkdirSync(dataDir, { recursive: true }); const tmp = file + '.tmp'; fs.writeFile(tmp, json, e => { if (e) { log.error('[availability] 写入失败', e.message); return ok(); } fs.rename(tmp, file, () => ok()); }); }));
    return queue;
  };
  /* 来源：来源表 + 后台改过的（后台优先） */
  const sourceOf = id => ({ year: cfg.year, ...(cfg.homes[id] || {}), ...(data.sources[id] || {}) });
  const hostOk = u => { try { const x = new URL(u); return x.protocol === 'https:' && (cfg.allowedHosts || []).some(h => x.hostname === h || x.hostname.endsWith('.' + h)); } catch (_) { return false; } };
  const stateOf = id => data.homes[id] || (data.homes[id] = { status: 'unknown', history: [] });

  /* ---------- 抓取：同一网站间隔 15 秒、先看 robots.txt ---------- */
  const lastHit = new Map(), robots = new Map();
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function politeFetch(u) {
    const host = new URL(u).host, gap = (lastHit.get(host) || 0) + HOST_GAP - now();
    if (gap > 0) await wait(gap);
    lastHit.set(host, now());
    return fetchImpl(u, { headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
  }
  async function allowed(u) {
    const x = new URL(u), key = x.origin, hit = robots.get(key);
    if (!hit || now() - hit.at > 24 * 3600e3) {
      let txt = '';
      try { const r = await politeFetch(key + '/robots.txt'); txt = r.ok ? await r.text() : ''; } catch (_) { /* 没有 robots.txt：按允许处理 */ }
      robots.set(key, { at: now(), txt });
    }
    return robotsAllows(robots.get(key).txt, x.pathname);
  }

  /* ---------- 查一栋楼 ---------- */
  async function checkOne(id) {
    const src = sourceOf(id), s = stateOf(id), at = new Date(now()).toISOString();
    if (!src.url || !hostOk(src.url)) { s.error = src.url ? 'host_not_allowed' : 'no_source'; s.triedAt = at; save(); return { id, status: s.status, error: s.error }; }
    let res;
    try {
      if (!(await allowed(src.url))) res = { status: 'blocked', signals: [], price: null };
      else {
        const r = await politeFetch(src.url);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        res = classify(await r.text(), src.year);
      }
      s.error = '';
    } catch (e) { s.error = e.message; s.triedAt = at; s.failures = (s.failures || 0) + 1; save(); return { id, status: s.status, error: e.message }; }
    const prev = s.status;
    s.checkedAt = at; s.triedAt = at; s.failures = 0; s.signals = res.signals; s.price = res.price;
    if (res.status !== prev) {
      s.status = res.status; s.changedAt = at;
      s.history = [{ at, status: res.status, price: res.price }, ...(s.history || [])].slice(0, 30);
      if (res.status === 'open' && prev !== 'open') notify(id, prev);
    }
    save(); return { id, status: s.status, changed: res.status !== prev, prev };
  }

  /* ---------- 什么时候该查：开放日附近每 7 分钟，平时每 45 分钟（加随机） ---------- */
  function dueIn(id) {
    const src = sourceOf(id), s = stateOf(id), last = Math.max(s.checkedAt ? Date.parse(s.checkedAt) : 0, s.triedAt ? Date.parse(s.triedAt) : 0);   // checkedAt 只记成功读到页面的时间
    let every = NORMAL;
    if (src.opens) { const d = (Date.parse(src.opens + 'T00:00:00Z') - now()) / 864e5; if (d <= 3 && d >= -2) every = FAST; }
    if (s.failures) every = Math.min(6 * 3600e3, every * Math.pow(2, Math.min(s.failures, 4)));   // 连续失败就慢下来
    const jitter = (parseInt(crypto.createHash('md5').update(id).digest('hex').slice(0, 4), 16) % 60) * 1e3;
    return last + every + jitter - now();
  }
  const monitored = () => [...new Set([...Object.keys(cfg.homes || {}), ...Object.keys(data.sources)])].filter(id => byId.has(id) && sourceOf(id).url);
  let running = null, timer = null;
  function tick() {
    if (off || running) return running;
    const due = monitored().filter(id => dueIn(id) <= 0);
    if (!due.length) return null;
    running = (async () => { for (const id of due) { try { await checkOne(id); } catch (e) { log.error('[availability] 检查失败', id, e.message); } } })().finally(() => { running = null; });
    return running;
  }
  function start() { if (off || timer) return; timer = setInterval(tick, 60e3); timer.unref(); setTimeout(tick, 20e3).unref(); }

  /* ---------- 邮件提醒 ---------- */
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sent = [];
  function notify(id, prev) {
    const h = byId.get(id), src = sourceOf(id), name = h ? h.name : id;
    data.watchers.filter(w => w.homes.includes(id)).forEach(w => {
      const zh = w.lang !== 'en', base = w.base || publicUrl, off2 = `${base}/api/availability/unwatch?t=${w.token}&home=${encodeURIComponent(id)}`;
      const subject = zh ? `${name} 开放预订了（${src.year}）` : `${name} is open for booking (${src.year})`;
      const lead = zh ? (prev === 'soldout' ? `你关注的 ${name} 又有房了。` : `你关注的 ${name} 已经开放 ${src.year} 学年预订。`) : (prev === 'soldout' ? `${name} has rooms available again.` : `${name} is now open for ${src.year} bookings.`);
      const tip = zh ? '请尽快到官网预订；开放日期和房态以官网为准。' : 'Book on the official site soon; always confirm on the official site.';
      const text = [lead, tip, '', (zh ? '官网：' : 'Official site: ') + src.url, '', (zh ? '不想再收到这栋楼的提醒：' : 'Stop alerts for this building: ') + off2].join('\n');
      const html = `<p>${esc(lead)}</p><p>${esc(tip)}</p><p><a href="${esc(src.url)}">${zh ? '打开官网' : 'Open the official site'}</a></p><p style="color:#888;font-size:12px"><a href="${esc(off2)}">${zh ? '退订这栋楼的提醒' : 'Unsubscribe from this building'}</a></p>`;
      sent.push({ to: w.email, subject });
      if (mail) Promise.resolve().then(() => mail({ to: w.email, subject, text, html })).catch(e => log.error('[availability] 提醒邮件失败', e.message));
    });
  }
  function addWatcher(email, ids, lang, base) {
    let w = data.watchers.find(v => v.email === email);
    if (!w) { w = { email, token: crypto.randomBytes(16).toString('base64url'), homes: [], lang, base, createdAt: new Date(now()).toISOString() }; data.watchers.push(w); }
    ids.forEach(id => { if (!w.homes.includes(id)) w.homes.push(id); });
    w.homes = w.homes.slice(-30); w.lang = lang; w.base = base || w.base; save(); return w;
  }

  /* 给网页看的：每栋楼的状态、预计开放日、最近检查时间（不含错误细节和关注者） */
  function publicData() {
    const homes = {};
    monitored().forEach(id => { const s = stateOf(id), src = sourceOf(id); homes[id] = { status: s.status, opens: src.opens || '', url: src.url, price: s.price ?? null, checkedAt: s.checkedAt || '', changedAt: s.changedAt || '' }; });
    Object.entries(cfg.homes || {}).forEach(([id, src]) => { if (!homes[id] && byId.has(id) && src.opens) homes[id] = { status: 'unknown', opens: src.opens, url: '', price: null, checkedAt: '', changedAt: '' }; });
    return { year: cfg.year, monitoring: !off, mail: !!mail, everyMin: NORMAL / 6e4, fastMin: FAST / 6e4, homes };
  }

  const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
  function createApi({ send, readBody, json, limited = () => false }) {
    return async function availabilityApi(req, res, url, admin) {
      const p = url.pathname, method = req.method;
      if (!admin) {
        if (p === '/api/availability' && method === 'GET') return send(res, 200, publicData(), { 'Cache-Control': 'public, max-age=60' });
        if (p === '/api/availability/watch' && method === 'POST') {
          if (limited(req, 'avwatch:', 10, 60 * 60e3)) return send(res, 429, { error: 'rate_limited' });
          const b = json(await readBody(req, 4e3)); if (!b) return send(res, 400, { error: 'bad_json' });
          const email = str(b.email, 200).toLowerCase(), ids = (Array.isArray(b.homeIds) ? b.homeIds : [b.homeId]).map(x => str(x, 80)).filter(id => byId.has(id));
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(res, 400, { error: 'bad_email' });
          if (!ids.length) return send(res, 400, { error: 'unknown_home' });
          const base = publicUrl || (req.headers.host ? `http://${req.headers.host}` : '');
          addWatcher(email, ids, b.lang === 'en' ? 'en' : 'zh', base);
          return send(res, 201, { ok: true, mail: !!mail });
        }
        if (p === '/api/availability/unwatch' && method === 'GET') {
          const w = data.watchers.find(v => v.token === url.searchParams.get('t')), id = url.searchParams.get('home');
          if (w) { w.homes = id ? w.homes.filter(x => x !== id) : []; if (!w.homes.length) data.watchers = data.watchers.filter(v => v !== w); save(); }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
          return res.end('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>已退订</title><body style="font:16px system-ui;max-width:520px;margin:15vh auto;padding:0 16px;text-align:center"><p>已退订，不会再收到这栋楼的开放提醒。</p><p>You are unsubscribed from this building’s booking alerts.</p></body>');
        }
        return send(res, 404, { error: 'not_found' });
      }
      if (p === '/api/admin/availability' && method === 'GET') {
        const homes = {}; monitored().forEach(id => { homes[id] = { ...stateOf(id), source: sourceOf(id), dueInMin: Math.round(dueIn(id) / 6e4) }; });
        return send(res, 200, { year: cfg.year, allowedHosts: cfg.allowedHosts, homes, watcherCount: data.watchers.length, monitoring: !off });
      }
      if (p === '/api/admin/availability/check' && method === 'POST') {
        const b = json(await readBody(req, 4e3)) || {};
        if (b.homeId && !byId.has(b.homeId)) return send(res, 400, { error: 'unknown_home' });
        const ids = b.homeId ? [b.homeId] : monitored();
        const run = (async () => { const out = []; for (const id of ids) out.push(await checkOne(id)); return out; })();
        if (b.wait) return send(res, 200, { results: await run });
        run.catch(() => {}); return send(res, 202, { started: true });
      }
      let m = /^\/api\/admin\/availability\/sources\/([a-z0-9-]+)$/.exec(p);
      if (m && method === 'PUT') {
        if (!byId.has(m[1])) return send(res, 400, { error: 'unknown_home' });
        const b = json(await readBody(req, 4e3)); if (!b) return send(res, 400, { error: 'bad_json' });
        const next = { url: str(b.url, 500), opens: /^\d{4}-\d{2}-\d{2}$/.test(b.opens || '') ? b.opens : '', year: str(b.year, 12) || cfg.year };
        if (next.url && !hostOk(next.url)) return send(res, 400, { error: 'host_not_allowed' });
        data.sources[m[1]] = next; save(); return send(res, 200, { source: sourceOf(m[1]) });
      }
      m = /^\/api\/admin\/availability\/status\/([a-z0-9-]+)$/.exec(p);
      if (m && method === 'PUT') {   // 订房专家手动改状态（页面判断不了时）
        if (!byId.has(m[1])) return send(res, 400, { error: 'unknown_home' });
        const b = json(await readBody(req, 4e3)); if (!b || !STATUSES.includes(b.status)) return send(res, 400, { error: 'bad_status' });
        const s = stateOf(m[1]), prev = s.status, at = new Date(now()).toISOString();
        s.status = b.status; s.changedAt = at; s.manual = str(b.note, 200) || 'manual';
        s.history = [{ at, status: b.status, manual: true }, ...(s.history || [])].slice(0, 30);
        if (b.status === 'open' && prev !== 'open') notify(m[1], prev);
        save(); return send(res, 200, { home: s });
      }
      return send(res, 404, { error: 'not_found' });
    };
  }
  return { createApi, start, tick, checkOne, dueIn, publicData, classify, flush: () => queue, get data() { return data; }, sent };
}

module.exports = { createAvailability, classify, robotsAllows, yearTokens };
