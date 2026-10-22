/* 演示用的"已发送邮件"记录：学生点「立即进群」时，正式版由服务器（consult-server 的邮件提醒）给顾问发邮件；
   演示里把同样内容记在浏览器本地 'lsm-live-mail-v1'，顾问后台可以查看收件人、主题和邮件预览。
   收件人和提醒类型存在 'lsm-live-mailcfg-v1'，在顾问后台设置。 */
(() => {
  'use strict';
  const KEY = 'lsm-live-mail-v1', CFG = 'lsm-live-mailcfg-v1';
  const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (_) { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* 存储不可用时不记录 */ } };
  const DEFAULT = { to: 'bookings@your-company.com', on: { request: true, auto: true, forward: false } };
  const TITLES = { request: '新的建群请求：学生在等群码', auto: '已自动派发群码：学生已拿到专属群', forward: '学生在群里追加咨询了一套公寓' };
  function config() { const c = read(CFG, null); return c && c.on ? c : JSON.parse(JSON.stringify(DEFAULT)); }
  function adminUrl() { try { return new URL('./adviser.html', location.href).href; } catch (_) { return './adviser.html'; } }
  /* kind: request | auto | forward；me: 学生会话；homes: [{n, name}] */
  function add(kind, me, homes) {
    const cfg = config(); if (!cfg.on[kind] || !cfg.to.trim()) return null;
    const ch = me.request && me.request.channel === 'wechat' ? '微信群' : 'WhatsApp 群';
    const text = kind === 'request' ? `一键进群，等待人工建群 · ${ch}` : kind === 'auto' ? `已从预建群池派发：${(me.group && me.group.name) || ''} · ${ch}` : `学生又咨询了：${homes.map(h => h.name).join('、')}`;
    const event = { title: TITLES[kind], session: { id: me.id, nickname: (me.request && me.request.name) || '网站学生', channel: 'web', context: { homes } }, text, at: Date.now(), adminUrl: adminUrl() };
    const list = read(KEY, []); const item = { id: 'm' + Date.now().toString(36), kind, to: cfg.to, at: event.at, event };
    list.unshift(item); write(KEY, list.slice(0, 50)); return item;
  }
  window.MailOutbox = Object.freeze({ KEY, CFG, config, saveConfig: c => write(CFG, c), list: () => read(KEY, []), add, clear: () => write(KEY, []) });
})();
