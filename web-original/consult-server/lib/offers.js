'use strict';
/* 官网优惠监测 + 真实价格卡的数据（web-live/offer-card.js 显示，web-live/offers-admin.html 管理）。
   - 每栋楼一份：官网优惠页地址、房型（周租 × 周数）、必付费用、官网优惠；「通过我们订」和 Amber 的优惠由管理员在后台填。
   - 监测：每隔 OFFERS_CHECK_HOURS 小时（默认 6）打开每栋楼的官网优惠页，用 AI 读出房型、费用和优惠，和已确认的数据比对；
     有变化就放进「待核对」，订房专家确认后才对学生显示。没有 ANTHROPIC_API_KEY 时不自动检查，只能手动录入。
   - 数据存在 DATA_DIR/offers.json。 */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const snap = require('./snap');

const TYPES = ['rent', 'cash', 'voucher', 'fee', 'perk'];          // 减租 / 现金返现 / 购物卡 / 免费用 / 非现金福利
const UNITS = ['once', 'week', 'weeks_free'];                        // 一次性 £ / 每周减 £ / 免几周房租
const ROOM_TYPES = ['ensuite', 'studio', 'nonensuite', 'apartment', 'other'];
const newId = p => p + '_' + Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
const str = (v, n) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
const num = v => { const x = Number(v); return Number.isFinite(x) && x >= 0 && x < 1e6 ? Math.round(x * 100) / 100 : null; };

/* ---------- 数据清洗：后台提交和 AI 读出来的都走这里 ---------- */
function cleanOffer(o) {
  o = o && typeof o === 'object' ? o : {};
  return {
    id: /^o_[\w]+$/.test(o.id || '') ? o.id : newId('o'),
    type: TYPES.includes(o.type) ? o.type : 'cash',
    unit: UNITS.includes(o.unit) ? o.unit : 'once',
    amount: num(o.amount),
    title: str(o.title, 160), titleZh: str(o.titleZh ?? o.title_zh, 160),
    conditions: str(o.conditions, 400), conditionsZh: str(o.conditionsZh ?? o.conditions_zh, 400),
    paid: str(o.paid, 120), until: /^\d{4}-\d{2}-\d{2}$/.test(o.until || '') ? o.until : '',
    rooms: Array.isArray(o.rooms) ? o.rooms.map(r => str(r, 80)).filter(Boolean).slice(0, 20) : [],
    conditional: !!o.conditional, directOnly: !!(o.directOnly ?? o.direct_only)
  };
}
const cleanRoom = r => ({ name: str(r && r.name, 80), type: ROOM_TYPES.includes(r && r.type) ? r.type : 'other', weeks: num(r && r.weeks), rent: num(r && r.rent) });
const cleanFee = f => ({ name: str(f && f.name, 80), nameZh: str(f && (f.nameZh ?? f.name_zh), 80), amount: num(f && f.amount) });
const list = (a, f, n) => (Array.isArray(a) ? a.slice(0, n).map(f) : []);
function cleanHome(h, prev = {}) {
  h = h && typeof h === 'object' ? h : {};
  const pick = (k, f, n) => (k in h ? list(h[k], f, n) : prev[k] || []);
  return {
    url: 'url' in h ? (/^https?:\/\/[^\s]+$/i.test(str(h.url, 500)) ? str(h.url, 500) : '') : prev.url || '',
    rooms: pick('rooms', cleanRoom, 30).filter(r => r.name && r.weeks && r.rent),
    fees: pick('fees', cleanFee, 10).filter(f => f.name && f.amount),
    official: pick('official', cleanOffer, 20), ours: pick('ours', cleanOffer, 20), amber: pick('amber', cleanOffer, 20),
    confirmedAt: prev.confirmedAt || '', checkedAt: prev.checkedAt || '', checkStatus: prev.checkStatus || '', checkError: prev.checkError || ''
  };
}
const SETTINGS = { oursLabel: '通过我们订', oursLabelEn: 'Book with us', oursService: '订房专家全程跟进：帮你看合同、盯返现到账、签证被拒协助退订。', oursServiceEn: 'A booking expert follows your case: contract check, cashback follow-up and help if your visa is refused.',
  amberLabel: 'Amber 专属', amberLabelEn: 'Amber exclusive', amberNote: '', amberNoteEn: '' };
function cleanSettings(s, prev) {
  const out = { ...SETTINGS, ...prev };
  Object.keys(SETTINGS).forEach(k => { if (s && k in s) out[k] = str(s[k], 300); });
  return out;
}

/* ---------- 比对：房型、费用、官网优惠有没有变 ---------- */
const sig = h => JSON.stringify({
  rooms: (h.rooms || []).map(r => [r.name.toLowerCase(), r.weeks, r.rent]).sort(),
  fees: (h.fees || []).map(f => [f.name.toLowerCase(), f.amount]).sort(),
  offers: (h.official || []).map(o => [o.type, o.unit, o.amount, o.until, o.conditional, o.directOnly, o.title.toLowerCase()]).sort()
});
const money = v => '£' + (Math.round(v * 100) / 100).toLocaleString('en-GB');
function describe(o) { const n = o.titleZh || o.title; return n + (o.amount != null && !n.includes(money(o.amount)) ? ' ' + (o.unit === 'weeks_free' ? o.amount + ' 周' : money(o.amount) + (o.unit === 'week' ? '/周' : '')) : ''); }
function diff(prev, next) {
  const out = [], key = o => o.title.toLowerCase();
  const po = new Map((prev.official || []).map(o => [key(o), o])), no = new Map((next.official || []).map(o => [key(o), o]));
  no.forEach((o, k) => { const p = po.get(k); if (!p) out.push('新增优惠：' + describe(o)); else if (p.amount !== o.amount || p.unit !== o.unit) out.push('优惠变了：' + describe(p) + ' → ' + describe(o)); else if (p.until !== o.until) out.push(`截止日期：${p.until || '未写'} → ${o.until || '未写'}（${o.titleZh || o.title}）`); });
  po.forEach((o, k) => { if (!no.has(k)) out.push('优惠没了：' + describe(o)); });
  const pr = new Map((prev.rooms || []).map(r => [r.name.toLowerCase() + '|' + r.weeks, r]));
  (next.rooms || []).forEach(r => { const p = pr.get(r.name.toLowerCase() + '|' + r.weeks); if (!p) out.push(`新房型：${r.name} ${r.weeks} 周 ${money(r.rent)}/周`); else if (p.rent !== r.rent) out.push(`周租：${r.name} ${money(p.rent)} → ${money(r.rent)}`); pr.delete(r.name.toLowerCase() + '|' + r.weeks); });
  pr.forEach(r => out.push(`房型没了：${r.name} ${r.weeks} 周`));
  const pf = JSON.stringify((prev.fees || []).map(f => [f.name, f.amount])), nf = JSON.stringify((next.fees || []).map(f => [f.name, f.amount]));
  if (pf !== nf) out.push('费用变了：' + ((next.fees || []).map(f => f.name + ' ' + money(f.amount)).join('，') || '没有费用'));
  return out;
}

/* ---------- AI 读官网优惠页 ---------- */
function schema(z) {
  return z.object({
    rooms: z.array(z.object({ name: z.string(), type: z.enum(ROOM_TYPES), weeks: z.number(), rent: z.number() })),
    fees: z.array(z.object({ name: z.string(), name_zh: z.string(), amount: z.number() })),
    offers: z.array(z.object({ type: z.enum(TYPES), unit: z.enum(UNITS), amount: z.number().nullable(), title: z.string(), title_zh: z.string(), conditions: z.string(), conditions_zh: z.string(),
      paid: z.string(), until: z.string(), rooms: z.array(z.string()), conditional: z.boolean(), direct_only: z.boolean() })),
    notes: z.string()
  });
}
const SYSTEM = `You read the official website of a UK student accommodation building and extract its current prices and booking offers for the stated academic year. Return the structured result.

Only use what the page says. Never guess numbers; leave out anything not stated.
- rooms: each bookable room option with its weekly rent in pounds and tenancy length in weeks. One entry per room type and tenancy length. type: ensuite, studio, nonensuite (shared bathroom), apartment (whole flat), or other.
- fees: charges every student must pay on top of rent (for example a non-refundable booking fee), in pounds, with a short Simplified Chinese name. Not deposits that are returned.
- offers: every booking offer. type: "rent" (lower rent, free weeks), "cash" (cashback paid as money), "voucher" (gift card, shopping or local discount card), "fee" (a fee waived), "perk" (non-money extras). unit: "once" (amount is a one-off sum in pounds), "week" (amount is pounds off per week), "weeks_free" (amount is a number of free weeks). amount null if no value is stated. title: as written on the page; title_zh: a short Simplified Chinese name. conditions / conditions_zh: who qualifies and what must be done. paid: when the money or card arrives, as written. until: the offer's end date as YYYY-MM-DD, or empty. rooms: the room names it applies to, empty for all. conditional: true when only some students qualify (rebookers, referrals, codes, specific nationalities or universities, minimum stay). direct_only: true when the page says it only applies when booking directly with the operator.
- notes: anything a booking adviser should double-check, in Simplified Chinese, or empty.`;

async function aiExtract(url) {
  const s = snap.load();
  if (!s || !snap.enabled()) throw Object.assign(new Error('AI 未配置'), { code: 'not_configured' });
  const text = await snap.pageText(url);
  const client = new s.Anthropic();
  const msg = await client.beta.messages.parse({
    model: snap.MODEL, max_tokens: 16000, system: SYSTEM,
    output_config: { effort: 'medium', format: s.betaZodOutputFormat(schema(s.z)) },
    betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default',
    messages: [{ role: 'user', content: [{ type: 'text', text: 'Academic year: ' + (process.env.OFFERS_YEAR || '2026/27') + '\n\nOfficial page text:\n\n' + text }] }]
  });
  if (msg.stop_reason === 'refusal') throw Object.assign(new Error('AI 拒绝读取这一页'), { code: 'refused' });
  if (msg.stop_reason === 'max_tokens' || !msg.parsed_output) throw Object.assign(new Error('AI 没读完'), { code: 'incomplete' });
  const o = msg.parsed_output;
  return { rooms: o.rooms, fees: o.fees, official: o.offers, notes: o.notes };
}

/* ---------- 存储 ---------- */
function createOffers({ dataDir, extract = aiExtract, everyHours = Number(process.env.OFFERS_CHECK_HOURS || 6), log = console, mail = null, publicUrl = '' }) {
  const file = path.join(dataDir, 'offers.json');
  let data = { homes: {}, settings: { ...SETTINGS }, pending: [], watchers: [], updatedAt: '' }, queue = Promise.resolve();
  try { data = { ...data, ...JSON.parse(fs.readFileSync(file, 'utf8')) }; } catch (_) { /* 第一次运行 */ }
  if (!Array.isArray(data.watchers)) data.watchers = [];
  const save = () => {
    data.updatedAt = new Date().toISOString();
    const json = JSON.stringify(data, null, 1);
    queue = queue.then(() => new Promise(ok => { const tmp = file + '.tmp'; fs.mkdirSync(dataDir, { recursive: true }); fs.writeFile(tmp, json, e => { if (e) { log.error('[offers] 写入失败', e); return ok(); } fs.rename(tmp, file, () => ok()); }); }));
    return queue;
  };
  const homeOf = id => data.homes[id] || (data.homes[id] = cleanHome({}));
  const validId = id => /^[a-z0-9-]{2,80}$/.test(id || '');
  let running = null;

  /* ---------- 邮件提醒：学生留邮箱关注某栋楼；专家确认官网变化后发一封邮件（每封都有退订链接） ---------- */
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function notifyWatchers(id, changes) {
    if (!mail) return;
    data.watchers.filter(x => x.homes.includes(id)).forEach(x => {
      const zh = x.lang !== 'en', name = (x.names && x.names[id]) || id, base = x.base || publicUrl;
      const link = base + '/?offer=' + encodeURIComponent(id), off = base + '/api/offers/unwatch?t=' + x.token + '&home=' + encodeURIComponent(id);
      const subject = zh ? `${name} 的官网优惠有更新` : `Official offers updated at ${name}`;
      const lines = changes.slice(0, 8);
      const text = [zh ? `你关注的 ${name} 官网优惠有变化（订房专家已核对）：` : `The official offers at ${name} have changed (checked by a booking expert):`, ...lines.map(c => '- ' + c), '',
        (zh ? '查看真实总价：' : 'See the real total: ') + link, '', (zh ? '不想再收到这栋楼的提醒：' : 'Stop emails for this building: ') + off].join('\n');
      const html = `<p>${esc(text.split('\n')[0])}</p><ul>${lines.map(c => `<li>${esc(c)}</li>`).join('')}</ul><p><a href="${esc(link)}">${zh ? '查看真实总价' : 'See the real total'}</a></p><p style="color:#888;font-size:12px"><a href="${esc(off)}">${zh ? '退订这栋楼的提醒' : 'Unsubscribe from this building'}</a></p>`;
      Promise.resolve().then(() => mail({ to: x.email, subject, text, html })).catch(e => log.error('[offers] 提醒邮件失败', e.message));
    });
  }
  function addWatcher(email, id, name, lang, base) {
    let x = data.watchers.find(v => v.email === email);
    if (!x) { x = { id: newId('w'), email, token: crypto.randomBytes(16).toString('base64url'), homes: [], names: {}, lang, base, createdAt: new Date().toISOString() }; data.watchers.push(x); }
    if (!x.homes.includes(id)) x.homes.push(id);
    x.names[id] = name; x.lang = lang; x.base = base || x.base;
    if (x.homes.length > 30) x.homes = x.homes.slice(-30);
    save(); return x;
  }

  /* 给学生看的：只有确认过的数据，过期的优惠不显示 */
  function publicData() {
    const today = new Date().toISOString().slice(0, 10), live = a => a.filter(o => !o.until || o.until >= today);
    const homes = {};
    Object.entries(data.homes).forEach(([id, h]) => {
      if (!h.rooms.length && !h.official.length && !h.ours.length && !h.amber.length) return;
      homes[id] = { url: h.url, rooms: h.rooms, fees: h.fees, official: live(h.official), ours: live(h.ours), amber: live(h.amber), confirmedAt: h.confirmedAt, checkedAt: h.checkedAt };
    });
    return { settings: data.settings, homes, updatedAt: data.updatedAt, mail: !!mail };
  }

  async function checkOne(id) {
    const h = homeOf(id); if (!h.url) return { id, skipped: 'no_url' };
    h.checkedAt = new Date().toISOString();
    try {
      const found = await extract(h.url);
      const next = cleanHome({ rooms: found.rooms, fees: found.fees, official: found.official }, {});
      // 已有的优惠保留原来的 id 和管理员写的中文名
      next.official.forEach(o => { const same = h.official.find(p => p.title.toLowerCase() === o.title.toLowerCase()); if (same) { o.id = same.id; if (same.titleZh) o.titleZh = same.titleZh; } });
      if (sig(next) === sig(h)) { h.checkStatus = 'same'; h.checkError = ''; data.pending = data.pending.filter(p => p.homeId !== id); save(); return { id, changed: false }; }
      const changes = diff(h, next);
      data.pending = data.pending.filter(p => p.homeId !== id);
      data.pending.push({ id: newId('p'), homeId: id, at: h.checkedAt, url: h.url, changes: changes.length ? changes : ['和已确认的数据不同'], notes: str(found.notes, 600), found: { rooms: next.rooms, fees: next.fees, official: next.official } });
      h.checkStatus = 'changed'; h.checkError = ''; save();
      return { id, changed: true, changes };
    } catch (e) {
      h.checkStatus = 'failed'; h.checkError = str(e.code === 'fetch_failed' ? '官网打不开或拒绝自动访问（' + e.message + '），请手动核对' : e.message, 300); save();
      log.error('[offers] 检查失败', id, e.message);
      return { id, error: h.checkError };
    }
  }
  /* 依次检查（不并发，避免对官网造成压力）；ids 为空时检查所有超过 everyHours 没查过的楼 */
  function checkMany(ids, force) {
    if (running) return running;
    const due = (ids && ids.length ? ids : Object.keys(data.homes)).filter(id => data.homes[id] && data.homes[id].url && (force || !data.homes[id].checkedAt || Date.now() - Date.parse(data.homes[id].checkedAt) > everyHours * 3600e3 * 0.95));
    running = (async () => { const out = []; for (const id of due) { out.push(await checkOne(id)); await new Promise(r => setTimeout(r, 1500)); } return out; })().finally(() => { running = null; });
    return running;
  }
  let timer = null;
  function startMonitor() {
    if (timer || !(everyHours > 0)) return;
    const tick = () => { if (snap.enabled() || extract !== aiExtract) checkMany(null, false).catch(e => log.error('[offers]', e)); };
    timer = setInterval(tick, Math.min(everyHours, 1) * 3600e3); timer.unref();
    setTimeout(tick, 30e3).unref();
  }
  const monitor = () => ({ enabled: extract !== aiExtract || snap.enabled(), everyHours, running: !!running });

  /* 路由：GET /api/offers（学生）；/api/admin/offers/*（需要登录，server.js 已校验） */
  function createApi({ send, readBody, json, limited = () => false }) {
    return async function offersApi(req, res, url, admin) {
      const p = url.pathname, method = req.method;
      if (!admin) {
        if (p === '/api/offers' && method === 'GET') return send(res, 200, publicData(), { 'Cache-Control': 'public, max-age=300' });
        if (p === '/api/offers/watch' && method === 'POST') {
          if (!mail) return send(res, 503, { error: 'not_configured' });
          if (limited(req, 'watch:', 10, 60 * 60e3)) return send(res, 429, { error: 'rate_limited' });
          const b = json(await readBody(req, 4e3)); if (!b) return send(res, 400, { error: 'bad_json' });
          const email = str(b.email, 200).toLowerCase(), id = str(b.homeId, 80);
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(res, 400, { error: 'bad_email' });
          if (!validId(id)) return send(res, 400, { error: 'bad_id' });
          const base = publicUrl || (req.headers.host ? `http://${req.headers.host}` : '');
          addWatcher(email, id, str(b.name, 80) || id, b.lang === 'en' ? 'en' : 'zh', base);
          return send(res, 201, { ok: true });
        }
        if (p === '/api/offers/unwatch' && method === 'GET') {
          const x = data.watchers.find(v => v.token === url.searchParams.get('t')), id = url.searchParams.get('home');
          if (x) { x.homes = id ? x.homes.filter(h => h !== id) : []; if (!x.homes.length) data.watchers = data.watchers.filter(v => v !== x); save(); }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
          return res.end('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>已退订</title><body style="font:16px system-ui;max-width:520px;margin:15vh auto;padding:0 16px;text-align:center"><p>已退订，不会再收到这栋楼的优惠提醒。</p><p>You are unsubscribed from this building’s offer alerts.</p></body>');
        }
        return send(res, 404, { error: 'not_found' });
      }
      if (p === '/api/admin/offers' && method === 'GET') return send(res, 200, { ...data, watchers: undefined, watcherCount: data.watchers.length, monitor: monitor() });
      if (p === '/api/admin/offers/settings' && method === 'PUT') {
        const b = json(await readBody(req, 16e3)); if (!b) return send(res, 400, { error: 'bad_json' });
        data.settings = cleanSettings(b, data.settings); save(); return send(res, 200, { settings: data.settings });
      }
      let m = /^\/api\/admin\/offers\/homes\/([a-z0-9-]+)$/.exec(p);
      if (m && method === 'PUT') {
        if (!validId(m[1])) return send(res, 400, { error: 'bad_id' });
        const b = json(await readBody(req, 128e3)); if (!b) return send(res, 400, { error: 'bad_json' });
        const prev = homeOf(m[1]), next = cleanHome(b, prev);
        if (['rooms', 'fees', 'official'].some(k => k in b)) next.confirmedAt = new Date().toISOString();
        const changes = sig(prev) !== sig(next) && (prev.rooms.length || prev.official.length) ? diff(prev, next) : [];
        data.homes[m[1]] = next; save();
        if (changes.length) notifyWatchers(m[1], changes);
        return send(res, 200, { home: next });
      }
      if (p === '/api/admin/offers/check' && method === 'POST') {
        const b = json(await readBody(req, 4e3)) || {};
        if (!monitor().enabled) return send(res, 503, { error: 'not_configured' });
        const ids = b.homeId ? [String(b.homeId)] : null;
        if (b.wait) return send(res, 200, { results: await checkMany(ids, true) });
        checkMany(ids, true); return send(res, 202, { started: true });
      }
      m = /^\/api\/admin\/offers\/pending\/(p_\w+)\/(approve|reject)$/.exec(p);
      if (m && method === 'POST') {
        const pend = data.pending.find(x => x.id === m[1]); if (!pend) return send(res, 404, { error: 'not_found' });
        data.pending = data.pending.filter(x => x !== pend);
        if (m[2] === 'approve') { const h = homeOf(pend.homeId); Object.assign(h, pend.found, { confirmedAt: new Date().toISOString(), checkStatus: 'same' }); notifyWatchers(pend.homeId, pend.changes); }
        save(); return send(res, 200, { ok: true, home: data.homes[pend.homeId] });
      }
      return send(res, 404, { error: 'not_found' });
    };
  }
  return { createApi, startMonitor, checkOne, checkMany, publicData, get data() { return data; }, flush: () => queue };
}
module.exports = { createOffers, cleanOffer, cleanHome, diff };
