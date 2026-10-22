'use strict';
/* ==========================================================================================
   "miniprogram" channel: 微信小程序客服消息（消息推送 + 客服消息发送接口）
   ------------------------------------------------------------------------------------------
   状态：代码已写好但【未经真实环境测试】。只有设置了下列环境变量才会启用：
     WX_APPID, WX_APPSECRET            —— 小程序 AppID / AppSecret（获取 access_token）
     WX_TOKEN                           —— 消息推送配置里的 Token（校验签名）
     WX_ENCODING_AES_KEY                —— 消息推送配置里的 EncodingAESKey（安全模式解密；明文模式可不填）
   回调地址（在 小程序后台 → 开发管理 → 开发设置 → 消息推送 中填写）：
     https://你的域名/api/wx/callback      数据格式请选 JSON。
   与核心的接口与 web 渠道完全相同：deliver(session, message, ctx)。核心代码不需要改。
   ========================================================================================== */
const crypto = require('crypto');

const env = process.env;
const WXAPI = () => env.WX_API_BASE || 'https://api.weixin.qq.com';   // 测试时可以指向假的微信服务器
const enabled = !!(env.WX_APPID && env.WX_APPSECRET && env.WX_TOKEN);

/* ---------- 1. 签名校验 (TODO: 用真实推送验证) ---------- */
// 明文/兼容模式：signature = sha1(sort([Token, timestamp, nonce]).join(''))
function checkSignature({ signature, timestamp, nonce }, token = env.WX_TOKEN) {
  if (!token || !signature || !timestamp || !nonce) return false;
  const s = crypto.createHash('sha1').update([token, timestamp, nonce].sort().join('')).digest('hex');
  return safeEq(s, signature);
}
// 安全模式：msg_signature = sha1(sort([Token, timestamp, nonce, Encrypt]).join(''))
function checkMsgSignature({ msg_signature, timestamp, nonce }, encrypt, token = env.WX_TOKEN) {
  if (!token || !msg_signature) return false;
  const s = crypto.createHash('sha1').update([token, timestamp, nonce, encrypt].sort().join('')).digest('hex');
  return safeEq(s, msg_signature);
}
function safeEq(a, b) { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); }

/* ---------- 2. 安全模式解密 / 加密 (AES-256-CBC, PKCS#7 块大小 32) (TODO: 用真实推送验证) ---------- */
function aesKey(k = env.WX_ENCODING_AES_KEY) { return Buffer.from(k + '=', 'base64'); }
function decrypt(encrypt, encodingAESKey = env.WX_ENCODING_AES_KEY, appid = env.WX_APPID) {
  const key = aesKey(encodingAESKey), decipher = crypto.createDecipheriv('aes-256-cbc', key, key.subarray(0, 16));
  decipher.setAutoPadding(false);
  let buf = Buffer.concat([decipher.update(encrypt, 'base64'), decipher.final()]);
  const pad = buf[buf.length - 1]; if (pad < 1 || pad > 32) throw new Error('bad padding');
  buf = buf.subarray(0, buf.length - pad);
  const len = buf.readUInt32BE(16), msg = buf.subarray(20, 20 + len).toString('utf8'), from = buf.subarray(20 + len).toString('utf8');
  if (appid && from !== appid) throw new Error('appid mismatch');
  return msg;
}
function encrypt(text, encodingAESKey = env.WX_ENCODING_AES_KEY, appid = env.WX_APPID) {   // 用于自测解密
  const key = aesKey(encodingAESKey), msg = Buffer.from(text), len = Buffer.alloc(4); len.writeUInt32BE(msg.length);
  let buf = Buffer.concat([crypto.randomBytes(16), len, msg, Buffer.from(appid || '')]);
  const pad = 32 - (buf.length % 32); buf = Buffer.concat([buf, Buffer.alloc(pad, pad)]);
  const c = crypto.createCipheriv('aes-256-cbc', key, key.subarray(0, 16)); c.setAutoPadding(false);
  return Buffer.concat([c.update(buf), c.final()]).toString('base64');
}

/* ---------- 3. access_token（缓存，提前 5 分钟刷新）(TODO: 真实环境验证) ---------- */
// 生产环境如有多个进程/服务共用同一个 AppID，请改为集中存储 token（或使用 stable_token 接口），否则会互相刷掉。
let tokenCache = { value: '', exp: 0, pending: null };
async function getAccessToken() {
  if (tokenCache.value && Date.now() < tokenCache.exp) return tokenCache.value;
  if (tokenCache.pending) return tokenCache.pending;
  tokenCache.pending = (async () => {
    const r = await fetch(WXAPI() + '/cgi-bin/stable_token', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'client_credential', appid: env.WX_APPID, secret: env.WX_APPSECRET }) });
    const j = await r.json();
    if (!j.access_token) throw new Error(`获取 access_token 失败：${j.errcode} ${j.errmsg}`);
    tokenCache = { value: j.access_token, exp: Date.now() + (j.expires_in - 300) * 1000, pending: null };
    return j.access_token;
  })().finally(() => { tokenCache.pending = null; });
  return tokenCache.pending;
}

/* ---------- 4. 上传临时素材 + 发送客服消息 (TODO: 真实环境验证) ---------- */
async function uploadTempImage(buffer, filename = 'qr.png', mime = 'image/png') {
  const token = await getAccessToken(), form = new FormData();
  form.append('media', new Blob([buffer], { type: mime }), filename);
  const r = await fetch(`${WXAPI()}/cgi-bin/media/upload?access_token=${token}&type=image`, { method: 'POST', body: form });
  const j = await r.json(); if (!j.media_id) throw new Error(`上传临时素材失败：${j.errcode} ${j.errmsg}`);
  return j.media_id;   // 临时素材 3 天有效
}
async function sendCustomerMessage(payload) {
  const token = await getAccessToken();
  const r = await fetch(`${WXAPI()}/cgi-bin/message/custom/send?access_token=${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const j = await r.json(); if (j.errcode) throw new Error(`发送客服消息失败：${j.errcode} ${j.errmsg}`);   // 45015 = 超过 48 小时回复时限
  return j;
}
const sendText = (openid, content) => sendCustomerMessage({ touser: openid, msgtype: 'text', text: { content } });
async function sendImage(openid, buffer, filename, mime) { const media_id = await uploadTempImage(buffer, filename, mime); return sendCustomerMessage({ touser: openid, msgtype: 'image', image: { media_id } }); }

/* ---------- 5. 接收消息推送：GET 校验 + POST 消息 ---------- */
// core = { store, notify(session, text), readUpload(name) }
function createCallbackHandler(core) {
  return async function handle(req, res, url, body) {
    const q = Object.fromEntries(url.searchParams);
    if (!enabled) { res.writeHead(503); return res.end('miniprogram channel disabled'); }
    if (req.method === 'GET') {                                    // 后台“消息推送”保存时的 URL 校验
      if (!checkSignature(q)) { res.writeHead(401); return res.end('bad signature'); }
      res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end(q.echostr || '');
    }
    let msg; try { msg = JSON.parse(body.toString('utf8') || '{}'); } catch (_) { msg = {}; }
    if (msg.Encrypt) {                                             // 安全模式
      if (!checkMsgSignature(q, msg.Encrypt)) { res.writeHead(401); return res.end('bad msg_signature'); }
      try { msg = JSON.parse(decrypt(msg.Encrypt)); } catch (e) { res.writeHead(400); return res.end('decrypt failed'); }
    } else if (!checkSignature(q)) { res.writeHead(401); return res.end('bad signature'); }
    res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('success');   // 必须 5 秒内回复，先回 success 再异步处理

    // TODO(小程序): 按需处理更多类型（image、miniprogrampage 卡片等）。
    const openid = msg.FromUserName; if (!openid) return;
    let s = core.store.findByExternal('miniprogram', openid);
    if (msg.MsgType === 'event' && msg.Event === 'user_enter_tempsession') {
      // 小程序 <button open-type="contact" session-from="..."> 传入的上下文，建议传 JSON：{"homes":[...],"lifeCharacter":"..."}
      let ctx = {}; try { ctx = JSON.parse(msg.SessionFrom || '{}'); } catch (_) { ctx = { note: msg.SessionFrom }; }
      if (!s) s = core.store.createSession({ channel: 'miniprogram', externalId: openid, context: ctx });
      return;
    }
    const text = msg.MsgType === 'text' ? msg.Content : `[${msg.MsgType}]`;
    if (!s) s = core.store.createSession({ channel: 'miniprogram', externalId: openid, context: {} });
    core.store.addMessage(s.id, { from: 'student', type: 'text', text });
    core.notify(s, text);
  };
}

/* ---------- 5. 小程序登录 code → openid；订阅消息（群码到了提醒学生）(TODO: 真实环境验证) ---------- */
const canLogin = () => !!(env.WX_APPID && env.WX_APPSECRET);
async function code2Session(code) {
  const q = new URLSearchParams({ appid: env.WX_APPID, secret: env.WX_APPSECRET, js_code: code, grant_type: 'authorization_code' });
  const r = await fetch(WXAPI() + '/sns/jscode2session?' + q, { signal: AbortSignal.timeout(5000) });
  const j = await r.json();
  if (!j.openid) throw new Error(`code2session 失败：${j.errcode} ${j.errmsg}`);
  return j.openid;
}
async function sendSubscribe(openid, templateId, page, data) {
  const token = await getAccessToken();
  const r = await fetch(`${WXAPI()}/cgi-bin/message/subscribe/send?access_token=${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ touser: openid, template_id: templateId, page, data, miniprogram_state: env.WX_MINIPROGRAM_STATE || 'formal', lang: 'zh_CN' }) });
  const j = await r.json();
  if (j.errcode) throw new Error(`订阅消息发送失败：${j.errcode} ${j.errmsg}`);
  return j;
}

module.exports = {
  canLogin, code2Session, sendSubscribe,
  name: 'miniprogram',
  enabled,
  // 与 web 渠道相同的接口：工作台点“发送”后调用。48 小时窗口外微信会返回 45015。
  async deliver(session, message, ctx) {
    if (!enabled) throw new Error('小程序渠道未配置（WX_APPID / WX_APPSECRET / WX_TOKEN）');
    if (message.image) { const file = ctx.readUpload(message.image); await sendImage(session.externalId, file.buffer, file.name, file.mime); }
    if (message.text) await sendText(session.externalId, message.text);
    return { ok: true, via: 'wechat-customer-service' };
  },
  createCallbackHandler,
  _internals: { checkSignature, checkMsgSignature, decrypt, encrypt, getAccessToken, uploadTempImage, sendCustomerMessage }
};
