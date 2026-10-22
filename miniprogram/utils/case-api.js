/* 咨询编号 + 群码（和网页版 case-api.js 同一套服务器接口 /api/cases）。
   手机上只存 { id, token, code }：编号和只有这台手机知道的令牌，没有姓名、电话。
   打开小程序时每 6 秒查一次，群码或专家留言一到，页面和右下角的气泡就更新。 */
const { API_BASE, SUB_TEMPLATE_ID } = require('../config.js');
const KEY = 'lsm-case-v1';
const listeners = new Set();
let current = null, timer = null, busy = false;

const read = () => { try { const v = wx.getStorageSync(KEY); return v && v.id && v.token ? v : null; } catch (e) { return null; } };
const write = v => { try { v ? wx.setStorageSync(KEY, v) : wx.removeStorageSync(KEY); } catch (e) { /* 忽略 */ } };
function call(path, method, data) {
  return new Promise((ok, no) => wx.request({ url: API_BASE + path, method: method || 'GET', data, header: { 'Content-Type': 'application/json' }, timeout: 8000,
    success: r => (r.statusCode >= 200 && r.statusCode < 300 ? ok(r.data) : no(Object.assign(new Error((r.data && r.data.error) || 'HTTP ' + r.statusCode), { status: r.statusCode }))),
    fail: e => no(new Error(e.errMsg || 'network')) }));
}
const emit = () => listeners.forEach(f => { try { f(current); } catch (e) { /* 忽略 */ } });
const media = p => (p ? API_BASE + p : '');

/* 群码到了提醒学生：必须在用户点按钮的同一时刻请求（微信的规定） */
function askSubscribe() {
  return new Promise(ok => {
    if (!SUB_TEMPLATE_ID || !wx.requestSubscribeMessage) return ok(false);
    wx.requestSubscribeMessage({ tmplIds: [SUB_TEMPLATE_ID], success: r => ok(r[SUB_TEMPLATE_ID] === 'accept'), fail: () => ok(false) });
  });
}
const loginCode = () => new Promise(ok => { if (!wx.login) return ok(''); wx.login({ success: r => ok(r.code || ''), fail: () => ok('') }); });

async function refresh() {
  const s = read(); if (!s || busy) return current;
  busy = true;
  try { current = await call(`/api/cases/${s.id}?token=${encodeURIComponent(s.token)}`); emit(); }
  catch (e) { if (e.status === 404) { write(null); current = null; emit(); } }
  finally { busy = false; }
  return current;
}
module.exports = {
  stored: read, media,
  get current() { return current; },
  on(fn) { listeners.add(fn); if (current) fn(current); return () => listeners.delete(fn); },
  /* 点「立即进群」：先请求订阅（同一次点击里），再登录拿 code，最后建档 */
  async create(payload) {
    const subscribed = await askSubscribe(), wxcode = await loginCode();
    const r = await call('/api/cases', 'POST', Object.assign({ app: 'miniprogram', wxcode, subscribed }, payload));
    write({ id: r.id, token: r.token, code: r.code }); current = r.case; emit(); return current;
  },
  async addHome(home) { const s = read(); if (!s) return null; current = await call(`/api/cases/${s.id}/homes?token=${encodeURIComponent(s.token)}`, 'POST', { home }); emit(); return current; },
  async renew() { const s = read(); if (!s) return null; const subscribed = await askSubscribe(); current = await call(`/api/cases/${s.id}/renew?token=${encodeURIComponent(s.token)}`, 'POST', { subscribed }); emit(); return current; },
  refresh,
  start() { if (timer) return; refresh(); timer = setInterval(refresh, 6000); },
  stop() { if (timer) clearInterval(timer); timer = null; }
};
