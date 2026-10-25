'use strict';
/* 咨询原型服务器：一条命令同时提供
   - 静态站点（../liverpool-life-map-en）           http://HOST:PORT/
   - 学生端咨询 API                                 /api/consult/*
   - 客服工作台                                      /admin.html  + /api/admin/*
   - 小程序消息推送回调（渠道适配层，默认关闭）      /api/wx/callback
   无第三方依赖，Node 18+。 */
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const { Store } = require('./lib/store');
const { createNotifiers } = require('./lib/notifiers');
const { createAuth } = require('./lib/auth');
const { createCasesApi } = require('./lib/cases');
const { createSnapApi } = require('./lib/snap');
const { createOffers } = require('./lib/offers');
const channels = { web: require('./channels/web'), miniprogram: require('./channels/miniprogram') };

const env = process.env;
const PORT = Number(env.PORT || 8765), HOST = env.HOST || '0.0.0.0';
const SITE_DIR = path.resolve(env.SITE_DIR || path.join(__dirname, '..', 'liverpool-life-map-en'));
const DATA_DIR = path.resolve(env.DATA_DIR || path.join(__dirname, 'data'));
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const PUBLIC_URL = (env.PUBLIC_URL || '').replace(/\/$/, '');
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=53.4084&longitude=-2.9916&current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunset&timezone=Europe%2FLondon&forecast_days=1';
let weather = { at: 0, data: null };
const ADVISER_PATH = env.ADVISER_PATH || '/adviser.html';   // 订房专家后台（web-live/adviser.html）
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const store = new Store(path.join(DATA_DIR, 'sessions.json'));
const notifier = createNotifiers(env);
const auth = createAuth(env);

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.csv': 'text/csv; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8' };

/* ---------- helpers ---------- */
function send(res, code, obj, headers = {}) { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers }); res.end(JSON.stringify(obj)); }
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', c => { size += c.length; if (size > limit) { reject(Object.assign(new Error('too large'), { code: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks))); req.on('error', reject);
  });
}
const json = buf => { try { return JSON.parse(buf.toString('utf8') || '{}'); } catch (_) { return null; } };
const clean = (v, n) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, n);
function cleanContext(c) {
  c = c && typeof c === 'object' ? c : {};
  const homes = Array.isArray(c.homes) ? c.homes.slice(0, 5).map(h => ({ id: clean(h.id, 60), n: Number(h.n) || null, name: clean(h.name, 80), addr: clean(h.addr, 120), price: clean(h.price, 120) })) : [];
  return { homes, lifeCharacter: clean(c.lifeCharacter, 80), homeMatch: clean(c.homeMatch, 120), source: clean(c.source, 40), lang: clean(c.lang, 5), page: clean(c.page, 200) };
}
const publicSession = s => ({ id: s.id, status: s.status, nickname: s.nickname, context: s.context, createdAt: s.createdAt,
  messages: s.messages.map(m => ({ id: m.id, at: m.at, from: m.from, type: m.type, text: m.text || '', image: m.image ? '/api/consult/media/' + m.image : '' })) });
const adminUrl = req => (PUBLIC_URL || `http://${req.headers.host || 'localhost:' + PORT}`) + '/admin.html';
function notifyNew(session, text, req, title) {
  return notifier.notify({ title: title || '新的住宿咨询', session, text, at: Date.now(), adminUrl: req ? adminUrl(req) : (PUBLIC_URL ? PUBLIC_URL + '/admin.html' : '') });
}
// tiny in-memory rate limit for anonymous endpoints
const hits = new Map();
function limited(req, key, max, windowMs) {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim(), k = key + ip, now = Date.now();
  const arr = (hits.get(k) || []).filter(t => now - t < windowMs); arr.push(now); hits.set(k, arr); return arr.length > max;
}
let casesApi = null;   // 咨询编号 + 群码（lib/cases.js），在 helpers 定义完之后创建
function readUpload(name) {
  if (!/^[a-z0-9_-]+\.(png|jpg)$/.test(name)) throw new Error('bad upload name');
  return { buffer: fs.readFileSync(path.join(UPLOAD_DIR, name)), name, mime: name.endsWith('.png') ? 'image/png' : 'image/jpeg' };
}
function decodeImage(dataUrl) {
  const m = /^data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || ''); if (!m) return null;
  const buf = Buffer.from(m[2], 'base64');
  const png = buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), jpg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (!png && !jpg) return null;
  return { buf, ext: png ? 'png' : 'jpg' };
}

/* ---------- API ---------- */
const wxacodes = new Map();
const snapApi = createSnapApi({ send, readBody, json, limited });
const offers = createOffers({ dataDir: DATA_DIR });
const offersApi = offers.createApi({ send, readBody, json });
async function api(req, res, url) {
  const p = url.pathname, method = req.method;
  /* 利物浦天气：服务器代取 Open-Meteo，缓存 15 分钟（小程序不用把国外域名加进白名单，国内也更快） */
  if (p === '/api/weather' && method === 'GET') {
    if (weather.data && Date.now() - weather.at < 15 * 60e3) return send(res, 200, weather.data);
    try {
      const r = await fetch(env.WEATHER_URL || WEATHER_URL, { signal: AbortSignal.timeout(6000) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      weather = { at: Date.now(), data: await r.json() };
      return send(res, 200, weather.data);
    } catch (e) { return weather.data ? send(res, 200, weather.data) : send(res, 502, { error: 'weather_unavailable' }); }
  }
  /* 分享卡片上的小程序码：配置了 WX_APPID / WX_APPSECRET 才有；没有时小程序退回普通二维码 */
  if (p === '/api/wxacode' && method === 'GET') {
    const scene = url.searchParams.get('scene') || '', page = 'pages/index/index';
    if (!channels.miniprogram.canLogin()) return send(res, 404, { error: 'not_configured' });
    if (!/^[A-Za-z0-9!#$&'()*+,/:;=?@\-._~]{1,32}$/.test(scene)) return send(res, 400, { error: 'bad_scene' });
    let buf = wxacodes.get(scene);
    if (!buf) {
      try { buf = await channels.miniprogram.wxacode(scene, page); } catch (e) { console.error(e.message); return send(res, 502, { error: 'wxacode_failed' }); }
      if (wxacodes.size > 300) wxacodes.delete(wxacodes.keys().next().value);
      wxacodes.set(scene, buf);
    }
    res.writeHead(200, { 'Content-Type': buf[0] === 0x89 ? 'image/png' : 'image/jpeg', 'Cache-Control': 'public, max-age=86400' }); return res.end(buf);
  }
  /* 拍一下 · 看懂公寓网页：AI 识别学生拍的屏幕、截图或网址（lib/snap.js；没配 ANTHROPIC_API_KEY 时网页用演示数据） */
  if (p === '/api/snap' || p === '/api/snap/status') return snapApi(req, res, url);
  /* 真实价格卡：官网优惠（自动监测 + 专家核对）、通过我们订、Amber（lib/offers.js） */
  if (p === '/api/offers') return offersApi(req, res, url, false);
  if (p === '/api/health') return send(res, 200, { ok: true, service: 'consult', cases: true, channels: Object.values(channels).filter(c => c.enabled).map(c => c.name), notifiers: notifier.names });
  if (!casesApi) casesApi = createCasesApi({ store, notifier, send, readBody, json, clean, limited, decodeImage, uploadDir: UPLOAD_DIR, wx: channels.miniprogram,
    adviserUrl: r => (PUBLIC_URL || (r ? `http://${r.headers.host || 'localhost:' + PORT}` : '')) + ADVISER_PATH });
  if (p === '/api/cases' || p.startsWith('/api/cases/')) return casesApi(req, res, url, false);

  // ---- student (web channel) ----
  if (p === '/api/consult/sessions' && method === 'POST') {
    if (limited(req, 'new:', 20, 10 * 60e3)) return send(res, 429, { error: 'rate_limited' });
    const b = json(await readBody(req, 64e3)); if (!b) return send(res, 400, { error: 'bad_json' });
    const text = clean(b.text, 1000); if (!text) return send(res, 400, { error: 'empty' });
    const s = store.createSession({ channel: 'web', nickname: clean(b.nickname, 40), context: cleanContext(b.context) });
    store.addMessage(s.id, { from: 'student', type: 'text', text });
    notifyNew(s, text, req);
    return send(res, 201, { id: s.id, token: s.token, session: publicSession(s) });
  }
  let m = /^\/api\/consult\/sessions\/([\w-]+)(\/messages)?$/.exec(p);
  if (m) {
    const s = store.get(m[1]), token = url.searchParams.get('token') || req.headers['x-consult-token'];
    if (!s || s.channel !== 'web' || !token || token !== s.token) return send(res, 404, { error: 'not_found' });
    if (!m[2] && method === 'GET') return send(res, 200, publicSession(s));
    if (m[2] && method === 'POST') {
      if (limited(req, 'msg:', 60, 10 * 60e3)) return send(res, 429, { error: 'rate_limited' });
      const b = json(await readBody(req, 16e3)); const text = clean(b && b.text, 1000); if (!text) return send(res, 400, { error: 'empty' });
      if (b.nickname && !s.nickname) s.nickname = clean(b.nickname, 40);
      // a follow-up from another home card: remember that home too (context only grows)
      if (b.context) { const c = cleanContext(b.context); c.homes.forEach(h => { if (h.name && !s.context.homes.some(x => x.name === h.name)) s.context.homes.push(h); });
        ['lifeCharacter', 'homeMatch'].forEach(k => { if (c[k]) s.context[k] = c[k]; }); }
      store.addMessage(s.id, { from: 'student', type: 'text', text });
      notifyNew(s, text, req, '学生追加了消息');
      return send(res, 201, publicSession(s));
    }
  }
  m = /^\/api\/consult\/media\/([a-z0-9_-]+\.(png|jpg))$/.exec(p);
  if (m && method === 'GET') {
    try { const f = readUpload(m[1]); res.writeHead(200, { 'Content-Type': f.mime, 'Cache-Control': 'private, max-age=86400' }); return res.end(f.buffer); }
    catch (_) { return send(res, 404, { error: 'not_found' }); }
  }

  // ---- WeChat mini program message push (channel adapter) ----
  if (p === '/api/wx/callback') {
    const body = method === 'POST' ? await readBody(req, 256e3) : Buffer.alloc(0);
    return channels.miniprogram.createCallbackHandler({ store, notify: (s, t) => notifyNew(s, t, null, '小程序新消息') })(req, res, url, body);
  }

  // ---- admin ----
  if (p === '/api/admin/login' && method === 'POST') {
    if (limited(req, 'login:', 10, 5 * 60e3)) return send(res, 429, { error: 'rate_limited' });
    const b = json(await readBody(req, 4e3));
    if (!b || !auth.check(b.password || '')) return send(res, 401, { error: 'wrong_password' });
    return send(res, 200, { ok: true }, { 'Set-Cookie': `consult_admin=${encodeURIComponent(auth.issue())}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200` });
  }
  if (p === '/api/admin/logout' && method === 'POST') return send(res, 200, { ok: true }, { 'Set-Cookie': 'consult_admin=; Path=/; Max-Age=0' });
  if (p.startsWith('/api/admin/')) {
    if (!auth.verify(req.headers.cookie)) return send(res, 401, { error: 'login_required' });
    if (p.startsWith('/api/admin/offers')) return offersApi(req, res, url, true);
    if (p.startsWith('/api/admin/cases')) { const done = await casesApi(req, res, url, true); if (done !== false) return; }
    if (p === '/api/admin/sessions' && method === 'GET') {
      return send(res, 200, { usingDefaultPassword: auth.usingDefault, sessions: store.list().map(s => ({ ...publicSession(s), channel: s.channel, updatedAt: s.updatedAt, lastStudentAt: s.lastStudentAt,
        replyWindowEndsAt: s.channel === 'miniprogram' ? new Date(Date.parse(s.lastStudentAt) + 48 * 3600e3).toISOString() : null })) });
    }
    m = /^\/api\/admin\/sessions\/([\w-]+)\/(reply|status)$/.exec(p);
    if (m && method === 'POST') {
      const s = store.get(m[1]); if (!s) return send(res, 404, { error: 'not_found' });
      if (m[2] === 'status') { const b = json(await readBody(req, 2e3)); const st = ['pending', 'replied', 'done'].includes(b && b.status) ? b.status : null; if (!st) return send(res, 400, { error: 'bad_status' }); store.setStatus(s.id, st); return send(res, 200, { ok: true }); }
      const b = json(await readBody(req, 6e6)); if (!b) return send(res, 400, { error: 'bad_json' });
      const text = clean(b.text, 1000); let image = '';
      if (b.image) {
        const img = decodeImage(b.image); if (!img) return send(res, 400, { error: 'image_must_be_png_or_jpg' });
        image = `qr_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}.${img.ext}`;
        fs.writeFileSync(path.join(UPLOAD_DIR, image), img.buf);
      }
      if (!text && !image) return send(res, 400, { error: 'empty' });
      const msg = { from: 'staff', type: image ? 'image' : 'text', text, image };
      const ch = channels[s.channel] || channels.web;
      try { const r = await ch.deliver(s, msg, { readUpload }); msg.delivery = r.via; }
      catch (e) { return send(res, 502, { error: 'delivery_failed', detail: e.message }); }
      store.addMessage(s.id, msg);
      return send(res, 201, { ok: true });
    }
  }
  return send(res, 404, { error: 'not_found' });
}

/* ---------- static ---------- */
function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/admin.html' || rel === '/admin') { rel = '/admin.html'; return file(res, path.join(__dirname, 'public', 'admin.html')); }
  if (rel.endsWith('/')) rel += 'index.html';
  const full = path.join(SITE_DIR, rel);
  if (!full.startsWith(SITE_DIR + path.sep) && full !== SITE_DIR) { res.writeHead(403); return res.end(); }
  return file(res, full);
}
function file(res, full) {
  fs.stat(full, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(full).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'no-cache' });
    fs.createReadStream(full).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://local');
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    return serveStatic(req, res, url);
  } catch (e) {
    if (e.code === 413) return send(res, 413, { error: 'too_large' });
    console.error('[server] error', e); if (!res.headersSent) send(res, 500, { error: 'server_error' });
  }
});
if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`咨询原型已启动：http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/   ${fs.existsSync(path.join(SITE_DIR, ADVISER_PATH.replace(/^\//, ''))) ? '订房专家后台 Expert console：' + ADVISER_PATH : '工作台：/admin.html'}`);
    console.log(`静态站点目录：${SITE_DIR}`);
    console.log(`通知：${notifier.names.join(' + ')}${env.WECOM_WEBHOOK_URL ? '' : '（未设置 WECOM_WEBHOOK_URL，仅写日志）'}`);
    console.log(`小程序渠道：${channels.miniprogram.enabled ? '已启用' : '未启用（缺少 WX_APPID / WX_APPSECRET / WX_TOKEN）'}`);
    offers.startMonitor();
    console.log(`官网优惠监测：${require('./lib/snap').enabled() ? '每 ' + (env.OFFERS_CHECK_HOURS || 6) + ' 小时检查一次' : '未启用（没有 ANTHROPIC_API_KEY，只能在后台手动录入）'}`);
    if (auth.usingDefault) console.log('⚠ 工作台使用默认密码 123456，上线前请设置 ADMIN_PASSWORD。');
  });
}
module.exports = { server, store, offers };
