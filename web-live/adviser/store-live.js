/* 顾问后台的状态：与 web-demo/js/store.js 接口相同，供 admin.js 使用。
   示例会话存在 'lsm-live-admin-v1'；网站上真实操作的那位学生（id 'me'）存在 'lsm-live-me-v1'，
   由学生端 booking-handoff.js 写入，后台发出的消息和群二维码也写回这里，两边通过 storage 事件同步。 */
(function (root) {
  'use strict';
  const KEY = 'lsm-live-admin-v1', ME = 'lsm-live-me-v1';
  const listeners = new Set();
  const read = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 存储不可用时只在内存里演示 */ } };

  function fresh() { return { demoLang: 'zh', conversations: root.DemoData.seedConversations(Date.now()), notices: [] }; }
  let state = read(KEY);
  if (!state || !Array.isArray(state.conversations)) state = fresh();
  state.conversations = state.conversations.filter(c => c.id !== 'me');

  /* 把学生端的会话并进列表；新的建群请求生成一条提醒 */
  function syncMe() {
    const me = read(ME), i = state.conversations.findIndex(c => c.id === 'me');
    if (me && me.id === 'me') {
      if (i >= 0) state.conversations[i] = me; else state.conversations.unshift(me);
      if (me.request && !state.notices.some(n => n.conv === 'me' && n.reqAt === me.request.at))
        state.notices.push({ id: 'n' + me.request.at, conv: 'me', reqAt: me.request.at, at: me.request.at, seen: me.status !== 'requested' });
    } else if (i >= 0) state.conversations.splice(i, 1);
  }
  syncMe();

  function save() {
    write(KEY, Object.assign({}, state, { conversations: state.conversations.filter(c => c.id !== 'me') }));
    const me = state.conversations.find(c => c.id === 'me');
    if (me) write(ME, me);
    listeners.forEach(fn => fn());
  }
  window.addEventListener('storage', e => {
    if (e.key === ME || e.key === null) { syncMe(); listeners.forEach(fn => fn('remote')); }
    else if (e.key === KEY && e.newValue) {
      try { const s = JSON.parse(e.newValue); state = Object.assign(s, { conversations: s.conversations.filter(c => c.id !== 'me') }); syncMe(); listeners.forEach(fn => fn('remote')); } catch (err) { /* 忽略损坏的数据 */ }
    }
  });

  const Store = {
    get s() { return state; },
    on(fn) { listeners.add(fn); },
    save,
    reset() { try { localStorage.removeItem(ME); } catch (e) { /* 忽略 */ } state = fresh(); save(); },
    me() { return state.conversations.find(c => c.id === 'me'); },
    conv(id) { return state.conversations.find(c => c.id === id); },
    agentSend(id, msg) {
      const c = Store.conv(id), now = Date.now();
      c.messages.push(Object.assign({ from: 'agent', at: now }, msg));
      if (c.status === 'browsing') c.status = 'chatting';
      c.unread = 0; c.updated = now;
      if (c.me) c.studentUnread = (c.studentUnread || 0) + 1;
      save();
    },
    sendGroup(id, group) {
      const c = Store.conv(id);
      const now = Date.now();
      // 微信群二维码 7 天后失效；WhatsApp 邀请链接不过期（除非在群设置里重置）
      c.group = Object.assign({ at: now, expiresAt: group.channel === 'wechat' ? now + 7 * 864e5 : null }, group); c.status = 'qr_sent';
      state.notices.forEach(n => { if (n.conv === id) n.seen = true; });
      Store.agentSend(id, { type: 'qr' });
    },
    setStatus(id, status) { const c = Store.conv(id); c.status = status; c.updated = Date.now(); save(); },
    markRead(id) { const c = Store.conv(id); if (c && c.unread) { c.unread = 0; save(); } },
    seeNotices() { let ch = false; state.notices.forEach(n => { if (!n.seen) { n.seen = true; ch = true; } }); if (ch) save(); }
  };
  root.Store = Store;
})(typeof globalThis !== 'undefined' ? globalThis : this);
