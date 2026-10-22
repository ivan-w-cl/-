/* 全局状态：学生端与顾问后台共用一份，存在 localStorage。
   同一浏览器里开两个标签页（一个学生端、一个后台）也会通过 storage 事件实时同步。 */
(function (root) {
  'use strict';
  const KEY = 'lsm-web-demo-v1';
  const listeners = new Set();
  const ME = 'me';

  function fresh() {
    const now = Date.now(), D = root.DemoData;
    return {
      demoLang: 'zh',
      student: { lang: 'zh', region: 'SG', favorites: [], compare: [], lastResult: null, homeAnswers: {}, lifeAnswers: [], lifeExtra: {}, viewed: [] },
      conversations: [{ id: ME, name: '', region: 'SG', lang: 'zh', source: 'Instagram', status: 'browsing', viewed: [], favorites: [], quiz: '',
        request: null, group: null, unread: 0, studentUnread: 0, updated: now, me: true,
        messages: [{ from: 'agent', type: 'welcome', at: now }] }].concat(D.seedConversations(now)),
      notices: []
    };
  }
  let state;
  try { state = JSON.parse(localStorage.getItem(KEY)); } catch (e) { state = null; }
  if (!state || !state.student || !Array.isArray(state.conversations)) state = fresh();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 存储不可用时只在内存里演示 */ }
    listeners.forEach(fn => fn());
  }
  window.addEventListener('storage', e => {
    if (e.key !== KEY || !e.newValue) return;
    try { state = JSON.parse(e.newValue); listeners.forEach(fn => fn('remote')); } catch (err) { /* 忽略损坏的数据 */ }
  });

  const Store = {
    get s() { return state; },
    on(fn) { listeners.add(fn); },
    save,
    reset() { state = fresh(); save(); },
    me() { return state.conversations.find(c => c.id === ME); },
    conv(id) { return state.conversations.find(c => c.id === id); },

    /* 学生端动作：同时更新会话上下文，后台能看到他在看什么 */
    syncContext() {
      const st = state.student, me = Store.me(), r = st.lastResult;
      me.region = st.region; me.lang = st.lang; me.viewed = st.viewed.slice(-6); me.favorites = st.favorites.slice();
      me.quiz = r ? (r.lifeCharacter || r.persona || '') : '';
      if (!me.name) me.name = '';
    },
    viewHome(id) {
      const v = state.student.viewed, i = v.indexOf(id);
      if (i >= 0) v.splice(i, 1);
      v.push(id);
      Store.syncContext(); save();
    },
    toggleFav(id) {
      const f = state.student.favorites, i = f.indexOf(id);
      if (i >= 0) f.splice(i, 1); else f.push(id);
      Store.syncContext(); save(); return i < 0;
    },
    toggleCompare(id) {
      const c = state.student.compare, i = c.indexOf(id);
      if (i >= 0) c.splice(i, 1); else { c.push(id); if (c.length > 3) c.shift(); }
      save(); return i < 0;
    },
    studentSend(msg) {
      const me = Store.me();
      me.messages.push(Object.assign({ from: 'student', at: Date.now() }, msg));
      if (me.status === 'browsing') me.status = 'chatting';
      me.unread = (me.unread || 0) + 1; me.updated = Date.now();
      Store.syncContext(); save();
    },
    requestGroup(req) {
      const me = Store.me(), now = Date.now();
      me.name = req.name; me.request = Object.assign({ at: now }, req); me.status = 'requested';
      state.student.region = req.region || state.student.region;
      me.messages.push({ from: 'student', type: 'request', at: now });
      me.unread = (me.unread || 0) + 1; me.updated = now;
      state.notices.push({ id: 'n' + now, conv: me.id, at: now, seen: false });
      Store.syncContext(); save();
    },
    /* 顾问后台动作 */
    agentSend(id, msg) {
      const c = Store.conv(id), now = Date.now();
      c.messages.push(Object.assign({ from: 'agent', at: now }, msg));
      if (c.status === 'browsing') c.status = 'chatting';
      c.unread = 0; c.updated = now;
      if (c.me) c.studentUnread = (c.studentUnread || 0) + 1;
      save();
    },
    sendGroup(id, group) {
      const c = Store.conv(id), now = Date.now();
      c.group = Object.assign({ at: now }, group); c.status = 'qr_sent';
      state.notices.forEach(n => { if (n.conv === id) n.seen = true; });
      Store.agentSend(id, { type: 'qr' });
    },
    setStatus(id, status) { const c = Store.conv(id); c.status = status; c.updated = Date.now(); save(); },
    markRead(id) { const c = Store.conv(id); if (c && c.unread) { c.unread = 0; save(); } },
    seeNotices() { let ch = false; state.notices.forEach(n => { if (!n.seen) { n.seen = true; ch = true; } }); if (ch) save(); }
  };
  root.Store = Store;
})(typeof globalThis !== 'undefined' ? globalThis : this);
