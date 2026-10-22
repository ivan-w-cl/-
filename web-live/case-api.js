/* 学生端连接服务器（web-original/consult-server 的 /api/cases）：
   网页和服务器一起部署时自动启用；直接打开网页、或在不带服务器的演示链接里，就退回浏览器本地演示（booking-handoff.js 照常工作）。
   设备上只存 { id, token, code } —— 咨询编号和只有这台设备知道的令牌，没有任何个人资料。 */
(() => {
  'use strict';
  const KEY = 'lsm-case-v1';
  const base = new URL('./', location.href);
  const url = p => new URL(p, base).href;
  const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && v.id && v.token ? v : null; } catch (_) { return null; } };
  const write = v => { try { if (v) localStorage.setItem(KEY, JSON.stringify(v)); else localStorage.removeItem(KEY); } catch (_) { /* ignore */ } };
  async function call(path, opt = {}) {
    const r = await fetch(url(path), { ...opt, headers: { 'Content-Type': 'application/json', ...(opt.headers || {}) } });
    const body = await r.json().catch(() => null);
    if (!r.ok) throw Object.assign(new Error((body && body.error) || 'HTTP ' + r.status), { status: r.status });
    return body;
  }
  const api = {
    enabled: false,
    stored: read,
    /* 服务器在不在：/api/health 返回 cases:true 才启用 */
    ready: (async () => {
      if (!/^https?:$/.test(location.protocol)) return false;
      try {
        const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 2500);
        const r = await fetch(url('api/health'), { signal: ctl.signal, cache: 'no-store' }); clearTimeout(t);
        const j = r.ok ? await r.json() : null; api.enabled = !!(j && j.cases); return api.enabled;
      } catch (_) { return false; }
    })(),
    async create(payload) { const r = await call('api/cases', { method: 'POST', body: JSON.stringify(payload) }); write({ id: r.id, token: r.token, code: r.code }); return r.case; },
    async get() { const s = read(); if (!s) return null; try { return await call(`api/cases/${s.id}?token=${encodeURIComponent(s.token)}`); } catch (e) { if (e.status === 404) write(null); throw e; } },
    async addHome(home) { const s = read(); if (!s) return null; return call(`api/cases/${s.id}/homes?token=${encodeURIComponent(s.token)}`, { method: 'POST', body: JSON.stringify({ home }) }); },
    async renew() { const s = read(); if (!s) return null; return call(`api/cases/${s.id}/renew?token=${encodeURIComponent(s.token)}`, { method: 'POST' }); },
    media: p => (p ? url(p.replace(/^\//, '')) : '')
  };
  window.CaseAPI = api;
})();
