/* 顾问后台的状态（服务器版）：接口与 store-live.js 相同，供 admin.js 使用。
   数据来自 consult-server 的 /api/admin/cases：学生没有名字，只有咨询编号；每 5 秒刷新一次。
   未登录时弹出密码框（POST /api/admin/login，登录后用 HttpOnly cookie）。
   只在本机记：界面语言、哪些提醒已看过、哪些会话已读。 */
(function (root) {
  'use strict';
  const LOCAL = 'lsm-adviser-local-v1';
  const listeners = new Set();
  const base = new URL('./', location.href), url = p => new URL(p, base).href;
  const readL = () => { try { return JSON.parse(localStorage.getItem(LOCAL)) || {}; } catch (e) { return {}; } };
  const local = Object.assign({ demoLang: 'zh', seen: {}, read: {} }, readL());
  const writeL = () => { try { localStorage.setItem(LOCAL, JSON.stringify(local)); } catch (e) { /* 只在内存里记 */ } };
  const state = { get demoLang() { return local.demoLang; }, set demoLang(v) { local.demoLang = v; }, conversations: [], notices: [] };
  const emit = how => listeners.forEach(fn => fn(how));
  const t = s => (s ? Date.parse(s) : null);

  async function call(path, opt = {}) {
    const r = await fetch(url(path), { credentials: 'same-origin', cache: 'no-store', ...opt, headers: { 'Content-Type': 'application/json', ...(opt.headers || {}) } });
    const body = await r.json().catch(() => null);
    if (r.status === 401) { askLogin(); throw Object.assign(new Error(local.demoLang === 'en' ? 'Please sign in' : '请先登录'), { status: 401 }); }
    if (!r.ok) throw Object.assign(new Error((body && body.error) || 'HTTP ' + r.status), { status: r.status });
    return body;
  }

  /* 服务器的 case → admin.js 用的会话 */
  function toConv(k) {
    const reqAt = t(k.requestedAt) || t(k.createdAt), first = k.homes[0];
    const msgs = [{ from: 'student', type: 'request', at: t(k.createdAt) }];
    (k.qa || []).forEach((x, i) => { msgs.push({ from: 'student', text: x.q, at: t(k.createdAt) - (k.qa.length - i) * 1e3 }); if (x.a) msgs.push({ from: 'agent', ai: true, text: x.a, at: t(k.createdAt) - (k.qa.length - i) * 1e3 + 500 }); });
    (k.log || []).forEach(m => {
      if (m.from === 'student' && m.type === 'home' && m.home) msgs.push({ from: 'student', type: 'home', homeId: m.home.id, at: t(m.at) });
      else if (m.from === 'staff' && m.type === 'group') msgs.push({ from: 'agent', type: 'qr', at: t(m.at) });
      else if (m.from === 'staff' && m.text) msgs.push({ from: 'agent', text: m.text, at: t(m.at) });
    });
    msgs.sort((a, b) => a.at - b.at);
    const g = k.group;
    return {
      id: k.id, code: k.code, name: k.code, tz: k.tz, region: k.region || (k.lang === 'zh' ? 'CN' : 'SG'), lang: k.lang, source: k.source, quiz: k.quiz,
      status: k.status, updated: t(k.updatedAt), viewed: k.homes.map(h => h.id).filter(Boolean), favorites: [], renewals: k.renewals,
      unread: k.status === 'requested' && local.read[k.id] !== k.requestedAt ? 1 : 0, requestedAt: k.requestedAt,
      request: { name: k.code, channel: k.channel, homeId: first && first.id, homeName: first && first.name, at: reqAt, oneTap: true },
      group: g ? { team: g.team || 'A', channel: g.channel, name: g.name, link: g.link, image: g.image ? url(g.image.replace(/^\//, '')) : '', at: t(g.at), expiresAt: t(g.expiresAt) } : null,
      messages: msgs
    };
  }

  let busy = false, lastJson = '';
  async function pull() {
    if (busy) return; busy = true;
    try {
      const { cases } = await call('api/admin/cases');
      const j = JSON.stringify(cases);
      hideLogin();
      if (j === lastJson) return;
      lastJson = j;
      state.conversations = cases.map(toConv);
      state.notices = cases.filter(k => k.status === 'requested').map(k => ({ id: k.id + '|' + k.requestedAt, conv: k.id, at: t(k.requestedAt), seen: !!local.seen[k.id + '|' + k.requestedAt] }));
      emit('remote');
    } catch (e) { /* 401 已弹登录框；网络错误下次再试 */ } finally { busy = false; }
  }

  /* ---------- 登录框 ---------- */
  let box;
  function askLogin() {
    if (box) { box.hidden = false; return; }
    const en = local.demoLang === 'en';
    box = document.createElement('div');
    box.className = 'mp-wrap'; box.id = 'loginBox';
    box.innerHTML = `<form class="mp" style="width:min(360px,100%);padding:20px;gap:12px;display:flex;flex-direction:column">
      <b class="h2">${en ? 'Adviser sign-in' : '顾问登录'}</b>
      <label class="field"><span>${en ? 'Password' : '密码'}</span><input type="password" name="pw" autocomplete="current-password" required></label>
      <p class="fine" data-err hidden style="color:#9b3420">${en ? 'Wrong password' : '密码不对'}</p>
      <button class="btn main">${en ? 'Sign in' : '登录'}</button></form>`;
    document.body.appendChild(box);
    box.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      const r = await fetch(url('api/admin/login'), { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: e.target.pw.value }) }).catch(() => null);
      if (r && r.ok) { e.target.pw.value = ''; hideLogin(); lastJson = ''; pull(); } else box.querySelector('[data-err]').hidden = false;
    });
    setTimeout(() => box.querySelector('input').focus(), 0);
  }
  function hideLogin() { if (box) { box.hidden = true; box.querySelector('[data-err]').hidden = true; } }

  async function post(path, body) { const r = await call(path, { method: 'POST', body: JSON.stringify(body) }); lastJson = ''; await pull(); return r; }

  const Store = {
    server: true,
    get s() { return state; },
    on(fn) { listeners.add(fn); },
    save() { writeL(); emit(); },
    reset() { /* 服务器上的真实会话不能在网页上清空 */ },
    me() { return null; },
    conv(id) { return state.conversations.find(c => c.id === id); },
    agentSend(id, msg) { return post(`api/admin/cases/${id}/reply`, { text: msg.text }); },
    sendGroup(id, g) {
      state.notices.forEach(n => { if (n.conv === id) local.seen[n.id] = true; }); writeL();
      return post(`api/admin/cases/${id}/group`, g.channel === 'wechat' ? { channel: g.channel, team: g.team, name: g.name, image: g.image } : { channel: g.channel, team: g.team, name: g.name, link: g.link });
    },
    setStatus(id, status) { return post(`api/admin/cases/${id}/status`, { status }).catch(() => {}); },
    markRead(id) { const k = Store.conv(id); if (k && k.unread) { local.read[id] = k.requestedAt; k.unread = 0; writeL(); emit(); } },
    seeNotices() { let ch = false; state.notices.forEach(n => { if (!n.seen) { n.seen = true; local.seen[n.id] = true; ch = true; } }); if (ch) { writeL(); emit(); } },
    ready: null
  };
  Store.ready = pull();
  setInterval(pull, 5000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) pull(); });
  root.Store = Store;
})(typeof globalThis !== 'undefined' ? globalThis : this);
