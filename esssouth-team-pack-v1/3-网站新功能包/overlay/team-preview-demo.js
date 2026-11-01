/* Team preview, demo student: open /?demo=student to see the signed-in site with a sample account,
   two sample 1v1 mock bookings (林老师, one upcoming, one finished) and one sample AI group discussion record.
   /?demo=off returns to the normal team preview. Loaded right after team-preview.js; changes nothing else. */
(() => {
  'use strict';
  const FLAG = 'zp-team-demo';
  try {
    const q = new URLSearchParams(location.search).get('demo');
    if (q === 'student') sessionStorage.setItem(FLAG, '1');
    if (q === 'off') sessionStorage.removeItem(FLAG);
    if (sessionStorage.getItem(FLAG) !== '1') return;
  } catch (_) { return; }

  const day = 864e5, at = (d, h) => { const t = new Date(Date.now() + d * day); t.setHours(h, 0, 0, 0); return t.getTime(); };
  const user = { id: 'u_demo', phone: '138****0000', profile: { nickname: '小周（示例）', schools: ['xjtlu'] }, consent: { terms: true, privacy: true, ai: true, age: 'adult' } };
  const bookings = [
    { id: 'bk_demo_next', kind: 'coach', productId: 'p_1v1', school: 'xjtlu', title: '老师一对一模拟面试', teacher: '林老师（示例）', start: at(2, 19), durationMin: 45, status: 'confirmed' },
    { id: 'bk_demo_done', kind: 'coach', productId: 'p_1v1', school: 'xjtlu', title: '老师一对一模拟面试', teacher: '林老师（示例）', start: at(-5, 19), durationMin: 45, status: 'confirmed' },
  ];
  const json = v => Promise.resolve(new Response(JSON.stringify(v), { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }));
  const inner = window.fetch;
  window.fetch = function (input, init = {}) {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, location.href);
    const method = (init.method || input?.method || 'GET').toUpperCase();
    if (url.origin === location.origin && method === 'GET') {
      if (url.pathname === '/api/me') return json({ user });
      if (url.pathname === '/api/me/commerce') return json({ bookings, orders: [], owned: [] });
    }
    return inner.apply(this, arguments);
  };

  const SAMPLE = { id: 'rec_demo_group', item: 'xj-group', ts: Date.now() - 2 * day, sample: true, summary: '',
    msgs: [
      { who: 'Leo', text: 'I think phones should be allowed, but with clear rules.' },
      { who: 'Mia', text: 'I partly agree. They are a big distraction in class, though.' },
      { who: 'me', text: 'I agree with Mia, because many students check messages in class. Sam, what do you think?' },
      { who: 'Sam', text: 'Good question. Maybe keep them in lockers during lessons?' },
      { who: 'me', text: 'So we all agree phones should be banned.' },
      { who: 'Leo', text: "Wait, I didn't say ban them. I said clear rules." },
      { who: 'Mia', text: 'What about emergencies? Parents may need to reach students.' },
      { who: 'me', text: 'I think lockers are the best idea.' },
    ] };
  // The account client clears local data when a new account signs in, so add the sample record after that.
  document.addEventListener('DOMContentLoaded', () => {
    const badge = document.querySelector('.team-preview-badge');
    if (badge) badge.textContent = '演示学生账号 · 示例数据';
    let tries = 0;
    const timer = setInterval(() => {
      try {
        const acc = window.ZP && window.ZP.ACC;
        if (!acc || !acc.ready || !acc.user) { if (++tries > 40) clearInterval(timer); return; }
        clearInterval(timer);
        if (!(S.records || []).some(r => r.id === SAMPLE.id)) { (S.records ||= []).push(SAMPLE); save(); render(); }
      } catch (_) { clearInterval(timer); }
    }, 250);
  });
})();
