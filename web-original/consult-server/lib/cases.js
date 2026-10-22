'use strict';
/* 咨询编号 + 群码接口。学生不注册、不留资料：
   - 学生点「立即进群」→ POST /api/cases，服务器发一个编号（如 LSM-7K2Q）和只有这台设备知道的令牌，并通知专家（邮件 / 企业微信）。
   - 专家在顾问后台新建群，把 WhatsApp 邀请链接或微信群二维码图片发给这个编号 → POST /api/admin/cases/:id/group。
   - 学生的网页每隔几秒查询 GET /api/cases/:id?token=…，群码一到就显示；网页关了，下次打开再查。
   一个编号只对应一个群，所以谁扫码进了这个群，谁就是这位学生。 */
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const STATUSES = ['requested', 'qr_sent', 'joined', 'booked', 'closed'];
const CHANNELS = ['whatsapp', 'wechat'];
const WA_LINK = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{10,40}$/;
// 微信群二维码 7 天后失效；WhatsApp 邀请链接不过期（除非在群里重置）。测试时可以用 WECHAT_QR_DAYS 改短，比如 0.003（约 4 分钟）
const WECHAT_DAYS = Number(process.env.WECHAT_QR_DAYS) > 0 ? Number(process.env.WECHAT_QR_DAYS) : 7;

/* 只按浏览器时区和界面语言猜地区，不收集其他信息 */
function regionOf(tz, lang) {
  if (/^Asia\/Singapore$/.test(tz)) return 'SG';
  if (/^Asia\/(Shanghai|Chongqing|Chungking|Harbin|Urumqi|Kashgar)$/.test(tz) || tz === 'PRC') return 'CN';
  if (/^Asia\/(Hong_Kong|Macau)$/.test(tz)) return 'HK';
  if (/^Asia\/Taipei$/.test(tz)) return 'TW';
  if (/^Asia\/Tokyo$/.test(tz) || tz === 'Japan') return 'JP';
  if (/^Europe\/(London|Dublin)$/.test(tz)) return 'UK';
  return { zh: 'CN', ja: 'JP', en: 'SG' }[lang] || '';
}

function createCasesApi(ctx) {
  const { store, notifier, send, readBody, json, clean, limited, decodeImage, uploadDir, adviserUrl } = ctx;
  const wx = ctx.wx || null;   // channels/miniprogram.js：小程序登录和订阅消息
  /* 订阅消息：模板和字段名在小程序后台选定，用环境变量配置。占位符 {code} {home} {channel} {time}。 */
  function remindStudent(c) {
    const tid = process.env.WX_SUB_TEMPLATE_ID;
    if (!wx || !c.openid || !tid || !c.subscribed) return;
    let tpl; try { tpl = JSON.parse(process.env.WX_SUB_TEMPLATE_DATA || '{}'); } catch (e) { tpl = {}; }
    const vals = { code: c.code, home: (c.homes[0] && c.homes[0].name) || '', channel: c.group && c.group.channel === 'wechat' ? '微信群' : 'WhatsApp 群',
      time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }).replace(/\//g, '-').slice(0, 16) };
    const data = {}; for (const k in tpl) data[k] = { value: String(tpl[k]).replace(/\{(\w+)\}/g, (_, x) => vals[x] || '').slice(0, 20) };
    wx.sendSubscribe(c.openid, tid, `pages/index/index?group=1`, data).catch(e => console.warn('[subscribe]', e.message));
  }
  const cleanHome = h => (h && typeof h === 'object' ? { id: clean(h.id, 60), n: Number(h.n) || null, name: clean(h.name, 80) } : null);
  const publicCase = c => ({
    id: c.id, code: c.code, status: c.status, channel: c.channel, lang: c.lang, region: c.region, createdAt: c.createdAt, requestedAt: c.requestedAt,
    homes: c.homes, group: c.group ? { channel: c.group.channel, team: c.group.team, name: c.group.name, link: c.group.link || '',
      image: c.group.image ? '/api/consult/media/' + c.group.image : '', at: c.group.at, expiresAt: c.group.expiresAt } : null,
    messages: c.messages.filter(m => m.from === 'staff' && m.text).map(m => ({ id: m.id, at: m.at, text: m.text }))
  });
  const adminCase = c => ({ ...publicCase(c), app: c.app || 'web', reminder: !!(c.openid && c.subscribed), tz: c.tz, source: c.source, quiz: c.quiz, qa: c.qa, renewals: c.renewals || 0, updatedAt: c.updatedAt, log: c.messages });
  function notify(c, req, title, text) {
    return notifier.notify({ title, text, at: Date.now(), adminUrl: adviserUrl(req),
      session: { id: c.id, nickname: `${c.code}${c.region ? ' · ' + c.region : ''}`, channel: 'web', context: { homes: c.homes, lifeCharacter: c.quiz || '' } } });
  }
  const tokenOk = (c, url, req) => { const t = url.searchParams.get('token') || req.headers['x-case-token']; return c && t && t === c.token; };

  return async function handle(req, res, url, isAdmin) {
    const p = url.pathname, method = req.method;
    let m;

    /* ---------- 学生 ---------- */
    if (p === '/api/cases' && method === 'POST') {
      if (limited(req, 'case:', 10, 10 * 60e3)) return send(res, 429, { error: 'rate_limited' });
      const b = json(await readBody(req, 32e3)); if (!b) return send(res, 400, { error: 'bad_json' });
      const lang = ['zh', 'en', 'ja'].includes(b.lang) ? b.lang : 'en', tz = clean(b.tz, 60);
      const channel = CHANNELS.includes(b.channel) ? b.channel : (lang === 'zh' ? 'wechat' : 'whatsapp');
      const homes = (Array.isArray(b.homes) ? b.homes : []).slice(0, 6).map(cleanHome).filter(h => h && h.name);
      const qa = (Array.isArray(b.qa) ? b.qa : []).slice(0, 6).map(x => ({ q: clean(x && x.q, 200), a: clean(x && x.a, 400) })).filter(x => x.q);
      // 小程序：用登录 code 换 openid（只存在服务器上，用来发「群码到了」的订阅消息，不返回、也不显示给专家）
      let openid = '';
      if (wx && wx.canLogin() && typeof b.wxcode === 'string' && b.wxcode) { try { openid = await wx.code2Session(b.wxcode); } catch (e) { console.warn('[code2session]', e.message); } }
      const app = b.app === 'miniprogram' ? 'miniprogram' : 'web';
      const c = store.createCase({ channel, lang, tz, region: regionOf(tz, lang), homes, qa, quiz: clean(b.quiz, 80), source: clean(b.source, 60), app, openid, subscribed: !!b.subscribed });
      notify(c, req, '新的建群请求：学生在等群码', `一键进群 · ${channel === 'wechat' ? '微信群' : 'WhatsApp 群'}${qa.length ? ' · 进群前问过：' + qa.map(x => x.q).join(' / ') : ''}`);
      return send(res, 201, { id: c.id, token: c.token, code: c.code, case: publicCase(c) });
    }
    m = /^\/api\/cases\/([\w-]+)(?:\/(homes|renew))?$/.exec(p);
    if (m) {
      const c = store.getCase(m[1]);
      if (!tokenOk(c, url, req)) return send(res, 404, { error: 'not_found' });
      if (!m[2] && method === 'GET') return send(res, 200, publicCase(c));
      if (m[2] === 'homes' && method === 'POST') {   // 已经有群了，又咨询了一套公寓：记到同一个编号上
        if (limited(req, 'casehome:', 30, 10 * 60e3)) return send(res, 429, { error: 'rate_limited' });
        const h = cleanHome((json(await readBody(req, 4e3)) || {}).home); if (!h || !h.name) return send(res, 400, { error: 'bad_home' });
        if (!c.homes.some(x => x.name === h.name)) store.updateCase(c.id, x => { x.homes.push(h); x.messages.push({ id: 'm_' + crypto.randomBytes(5).toString('hex'), at: new Date().toISOString(), from: 'student', type: 'home', home: h }); });
        return send(res, 200, publicCase(c));
      }
      if (m[2] === 'renew' && method === 'POST') {   // 微信群码过期，学生申请新的
        if (limited(req, 'renew:', 5, 10 * 60e3)) return send(res, 429, { error: 'rate_limited' });
        const rb = json(await readBody(req, 2e3)) || {};   // 小程序：学生这次也同意了订阅提醒
        store.updateCase(c.id, x => { x.status = 'requested'; x.requestedAt = new Date().toISOString(); x.renewals = (x.renewals || 0) + 1; x.group = null; if (rb.subscribed) x.subscribed = true; });
        notify(c, req, '学生申请新的群二维码', '之前的微信群二维码已过期');
        return send(res, 200, publicCase(c));
      }
      return send(res, 405, { error: 'method_not_allowed' });
    }

    /* ---------- 顾问后台（需要登录，由 server.js 统一校验） ---------- */
    if (!isAdmin) return false;
    if (p === '/api/admin/cases' && method === 'GET') return send(res, 200, { cases: store.listCases().map(adminCase) });
    m = /^\/api\/admin\/cases\/([\w-]+)\/(group|status|reply)$/.exec(p);
    if (m && method === 'POST') {
      const c = store.getCase(m[1]); if (!c) return send(res, 404, { error: 'not_found' });
      const b = json(await readBody(req, m[2] === 'group' ? 6e6 : 8e3)); if (!b) return send(res, 400, { error: 'bad_json' });
      if (m[2] === 'status') {
        if (!STATUSES.includes(b.status)) return send(res, 400, { error: 'bad_status' });
        store.updateCase(c.id, x => { x.status = b.status; }); return send(res, 200, adminCase(c));
      }
      if (m[2] === 'reply') {
        const text = clean(b.text, 1000); if (!text) return send(res, 400, { error: 'empty' });
        store.updateCase(c.id, x => x.messages.push({ id: 'm_' + crypto.randomBytes(5).toString('hex'), at: new Date().toISOString(), from: 'staff', text }));
        return send(res, 201, adminCase(c));
      }
      // group：WhatsApp 发邀请链接；微信发群二维码图片（微信群没有可用的邀请链接）
      const channel = CHANNELS.includes(b.channel) ? b.channel : c.channel, link = clean(b.link, 200);
      let image = '';
      if (channel === 'whatsapp' && !WA_LINK.test(link)) return send(res, 400, { error: 'whatsapp_link_required' });
      if (channel === 'wechat') {
        const img = decodeImage(b.image); if (!img) return send(res, 400, { error: 'wechat_qr_image_required' });
        image = `group_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}.${img.ext}`;
        fs.writeFileSync(path.join(uploadDir, image), img.buf);
      }
      const at = new Date().toISOString();
      store.updateCase(c.id, x => {
        x.channel = channel; x.status = 'qr_sent';
        x.group = { channel, team: clean(b.team, 10), name: clean(b.name, 80) || c.code, link: channel === 'whatsapp' ? link : '', image, at,
          expiresAt: channel === 'wechat' ? new Date(Date.now() + WECHAT_DAYS * 864e5).toISOString() : null };
        x.messages.push({ id: 'm_' + crypto.randomBytes(5).toString('hex'), at, from: 'staff', type: 'group' });
      });
      remindStudent(store.getCase(c.id));
      return send(res, 201, adminCase(c));
    }
    return false;
  };
}
module.exports = { createCasesApi, regionOf };
