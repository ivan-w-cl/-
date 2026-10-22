/* 预建群池：顾问提前建好一批空群，把邀请链接放进池子。学生点「立即进群」时直接从池子里取一个群码，不用等顾问。
   池子空了、或关闭了自动派发，就退回人工建群（顾问后台收到提醒后建群发码）。
   演示：池子存在浏览器本地 'lsm-live-pool-v1'，学生网站和顾问后台共用。 */
(() => {
  'use strict';
  const KEY = 'lsm-live-pool-v1';
  const TEAM_BY = { whatsapp: ['A', 'B', 'C'], wechat: ['A', 'B', 'D'] };
  let serial = 0;
  function link(channel, id) {
    const code = ('LSMPOOL' + id + 'Q7K2X9').toUpperCase().slice(0, 18);
    return channel === 'wechat' ? 'https://weixin.qq.com/g/' + code : 'https://chat.whatsapp.com/' + code;
  }
  function make(channel, n) {
    const id = channel.slice(0, 2) + Date.now().toString(36).slice(-4) + (serial++);
    return { id, channel, team: TEAM_BY[channel][n % 3], name: (channel === 'wechat' ? 'LSM 预定专家群 · 微信 ' : 'LSM Booking Team · WA ') + (100 + n), link: link(channel, id) };
  }
  function fresh() {
    const groups = [];
    for (let i = 0; i < 4; i++) { groups.push(make('whatsapp', i + 1)); groups.push(make('wechat', i + 1)); }
    return { auto: true, groups, used: 0 };
  }
  function load() {
    try { const p = JSON.parse(localStorage.getItem(KEY)); if (p && Array.isArray(p.groups)) return p; } catch (_) { /* 忽略 */ }
    const p = fresh(); save(p); return p;
  }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (_) { /* 存储不可用时只在内存里演示 */ } }
  window.GroupPool = Object.freeze({
    KEY, load, save,
    count(channel) { return load().groups.filter(g => g.channel === channel).length; },
    /* 自动派发开着且有同类型的群时，取出一个；否则返回 null，走人工建群 */
    take(channel) {
      const p = load(); if (!p.auto) return null;
      const i = p.groups.findIndex(g => g.channel === channel); if (i < 0) return null;
      const g = p.groups.splice(i, 1)[0]; p.used = (p.used || 0) + 1; save(p); return g;
    },
    setAuto(on) { const p = load(); p.auto = !!on; save(p); },
    refill(n) { const p = load(); const base = 100 + (p.used || 0) + p.groups.length; for (let i = 0; i < n; i++) { p.groups.push(make('whatsapp', base + i)); p.groups.push(make('wechat', base + i)); } save(p); },
    reset() { save(fresh()); }
  });
})();
