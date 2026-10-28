/* 🏁 抢房准备：抢房时拉开差距的是「知道什么时候开放」和「资料提前备齐、几分钟订完」。
   - 开放日历：各公寓预计开放预订的日期和倒计时（booking-prep.json，订房专家维护；现在是演示数据），可以「关注」。
   - 资料清单：开放前要准备好的东西，逐项打勾。
   - 订房步骤：交押金之后在官网要走的步骤（通用流程，各家略有不同），按公寓分别打勾，看到自己走到了哪一步。
   - 开放提醒：关注的公寓开放或有补房时提醒。演示版只在这台设备上提示，可以点「模拟收到开放通知」看效果；
     正式版由服务器定时查官网公开页面（平时每 30–60 分钟，开放日前后每 5–10 分钟）、Amber 数据和官网候补邮件，再发邮件或微信通知。
     只提醒，不替学生下单，也不绕过官网的排队和验证。
   数据只存在这台设备的浏览器里（lsm-prep-v1），不收集。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, pick } = BT;
  let HOMES_; try { HOMES_ = HOMES; } catch (_) { return; }
  const T = {
    zh: {
      title: '🏁 抢房准备', short: '🏁 抢房准备', desc: '开放日历 · 资料清单 · 开放提醒', eyebrow: '抢房准备', intro: '🏁 抢房准备',
      lede: '抢房时，比的是知道什么时候开放、资料是不是提前备齐。开放前把这三步做好，开放当天几分钟就能订完。',
      tabs: { cal: '开放日历', docs: '资料清单', steps: '订房步骤', alerts: '开放提醒' },
      demo: '演示数据：开放日期和状态是示例，正式版由订房专家核对并自动监测。', year: '{y} 学年',
      st: { open: '已开放', soon: '即将开放', waitlist: '候补中', unknown: '待核对' },
      days: '还有 {n} 天', today: '今天开放', since: '已开放 {n} 天', opensOn: '预计 {d} 开放', noDate: '开放日期待核对',
      watch: '关注', watching: '已关注', ready: '资料准备了 {a} / {b} 项', readyAll: '资料都备齐了 ✓', gotoDocs: '去准备资料 ›',
      soonTip: '快开放了：先把资料备齐，开放当天早点上官网。', searchPh: '搜索公寓名称', onlyWatch: '只看已关注', none: '没有符合条件的公寓。',
      docsLede: '开放前把这些准备好，放在手机或电脑里随时能上传。', docs: [
        ['passport', '护照', '扫描件或清晰照片；有效期要覆盖整个租期'],
        ['cas', 'CAS 或录取信', '有条件录取也可以先准备好，拿到正式录取后替换'],
        ['photo', '证件照或学生证', '部分公寓要求上传'],
        ['guarantor', '担保方案', '英国担保人的信息；没有的话，准备好第三方担保服务或预付全年房租'],
        ['card', '能付英镑的银行卡', 'Visa 或万事达，提前开通境外支付、确认额度够付押金和第一期房租'],
        ['contact', '常用邮箱和手机号', '能及时收到验证码和合同邮件'],
        ['emergency', '紧急联系人信息', '姓名、关系、电话'],
        ['dates', '入学和课程结束日期', '用来选租期长度']
      ],
      stepsLede: '交押金之后，官网一般要按这些步骤走完（各家略有不同）。选一栋公寓，做完一步勾一步。', stepsFor: '公寓',
      steps: [
        ['account', '注册官网账号', '用常用邮箱，提前完成邮箱验证'],
        ['room', '选房型和租期', '开放当天先选好备选房型，第一选择没了马上换'],
        ['deposit', '支付预订费或押金', '准备好能付英镑的卡'],
        ['docs', '填写个人信息、上传资料', '护照、CAS 或录取信等'],
        ['guarantor', '担保人', '填英国担保人，或选第三方担保服务、预付全年'],
        ['sign', '电子签署租约', '查收邮件，按提示签字'],
        ['rent', '支付第一期房租', '按分期计划，注意截止日期'],
        ['arrival', '预约入住时间', '了解前台时间和晚到取钥匙的方式']
      ],
      progress: '完成 {a} / {b} 步',
      alertsLede: '关注的公寓开放或有补房时，这里会提醒。', alertsNone: '还没有关注的公寓。在「开放日历」里点「关注」。',
      email: '提醒邮箱（演示：不会真的发送）', emailPh: 'name@example.com', saveEmail: '保存', saved: '已保存',
      simulate: '模拟收到开放通知', simulated: '🔔 {h} 已开放预订！去官网前先确认资料都备齐了。', alertLog: '提醒记录',
      howH: '正式版怎么监测', how: ['服务器定时查官网公开的房型页面：平时每 30–60 分钟一次，接近开放日改为每 5–10 分钟，发现「开放预订」「有房」「价格变化」就提醒。', '同时接 Amber 的房态数据（合作方，最准），以及各家官网「有房通知」的邮件。', '只提醒，不替学生下单，也不绕过官网的排队和验证码。'],
      officialSite: '官网预订页 ↗', note: '开放日期和状态以公寓官网为准。'
    },
    en: {
      title: '🏁 Booking prep', short: '🏁 Booking prep', desc: 'Release dates · document checklist · alerts', eyebrow: 'Booking prep', intro: '🏁 Booking prep',
      lede: 'Getting a room comes down to knowing when bookings open and having your documents ready. Do these three things beforehand and booking takes minutes on the day.',
      tabs: { cal: 'Release dates', docs: 'Documents', steps: 'Booking steps', alerts: 'Alerts' },
      demo: 'Demo data: release dates and statuses are examples; in production booking experts check them and they are monitored automatically.', year: '{y} academic year',
      st: { open: 'Open', soon: 'Opening soon', waitlist: 'Waitlist', unknown: 'To be checked' },
      days: 'in {n} days', today: 'opens today', since: 'open for {n} days', opensOn: 'expected {d}', noDate: 'date to be checked',
      watch: 'Watch', watching: 'Watching', ready: '{a} of {b} documents ready', readyAll: 'All documents ready ✓', gotoDocs: 'Prepare documents ›',
      soonTip: 'Opening soon: get your documents ready and be on the official site early on the day.', searchPh: 'Search homes', onlyWatch: 'Watched only', none: 'No matching homes.',
      docsLede: 'Have these ready on your phone or laptop before bookings open.', docs: [
        ['passport', 'Passport', 'A scan or clear photo, valid for the whole tenancy'],
        ['cas', 'CAS or offer letter', 'A conditional offer is fine for now; replace it once confirmed'],
        ['photo', 'ID photo or student card', 'Some properties ask for one'],
        ['guarantor', 'Guarantor plan', 'A UK guarantor’s details, or a third-party guarantor service, or paying the year upfront'],
        ['card', 'A card that pays in pounds', 'Visa or Mastercard with overseas payments on and a limit that covers the deposit and first rent'],
        ['contact', 'Email and phone you check', 'To receive codes and the contract email promptly'],
        ['emergency', 'Emergency contact', 'Name, relationship and phone number'],
        ['dates', 'Course start and end dates', 'To choose the tenancy length']
      ],
      stepsLede: 'After the deposit, official sites usually take you through these steps (details vary). Pick a home and tick each step as you go.', stepsFor: 'Home',
      steps: [
        ['account', 'Create an account', 'Use an email you check and verify it in advance'],
        ['room', 'Choose room type and tenancy', 'Have a second choice ready in case the first sells out'],
        ['deposit', 'Pay the booking fee or deposit', 'Have a card that pays in pounds'],
        ['docs', 'Personal details and documents', 'Passport, CAS or offer letter and so on'],
        ['guarantor', 'Guarantor', 'A UK guarantor, a guarantor service or paying upfront'],
        ['sign', 'Sign the tenancy online', 'Check your email and follow the steps'],
        ['rent', 'Pay the first rent instalment', 'Follow the instalment plan and its deadline'],
        ['arrival', 'Book your arrival', 'Check reception hours and late key collection']
      ],
      progress: '{a} of {b} steps done',
      alertsLede: 'You will be alerted here when a watched home opens or has rooms again.', alertsNone: 'No watched homes yet. Tap “Watch” in Release dates.',
      email: 'Alert email (demo: nothing is sent)', emailPh: 'name@example.com', saveEmail: 'Save', saved: 'Saved',
      simulate: 'Simulate an opening alert', simulated: '🔔 {h} is now open for booking! Check your documents before going to the official site.', alertLog: 'Alert history',
      howH: 'How the live version monitors', how: ['The server checks the official public room pages: every 30–60 minutes normally and every 5–10 minutes around release day, alerting on “open for booking”, “rooms available” and price changes.', 'It also uses Amber’s availability data (a partner, and the most accurate) and the official “register interest” emails.', 'It only alerts; it never books for students or bypasses official queues and captchas.'],
      officialSite: 'Official booking page ↗', note: 'Always confirm dates and availability on the official site.'
    }
  };
  const k = () => pick(T), zh = () => BT.lang() === 'zh';
  const S = BT.store('lsm-prep-v1');
  const st = Object.assign({ docs: {}, steps: {}, watch: {}, email: '', log: [], sim: {} }, S.get() || {});
  const save = () => S.set(st);
  let INFO = { homes: {} };
  fetch('./booking-prep.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(j => { if (j && j.homes) INFO = j; }).catch(() => { /* 用空数据 */ });
  const nameOf_ = h => { try { return nameOf(h); } catch (_) { return h.name; } };
  const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const infoOf = h => { const i = INFO.homes[h.id] || {}; const s = st.sim[h.id] || i.status || 'unknown'; return { ...i, status: s }; };
  const daysTo = d => d ? Math.round((new Date(d + 'T00:00:00') - today0()) / 864e5) : null;
  const dDate = d => new Date(d + 'T00:00:00').toLocaleDateString(zh() ? 'zh-CN' : 'en-GB', { month: 'long', day: 'numeric' });
  const docsDone = () => k().docs.filter(([id]) => st.docs[id]).length;

  let m = null, tab = 'cal', stepHome = null, filter = { q: '', watch: false };
  function open(h, which) {
    const K = k(); tab = which || tab; if (h) { stepHome = h.id; if (tab === 'cal') filter = { q: nameOf_(h), watch: false }; }
    m = BT.modal({ eyebrow: K.eyebrow, title: K.title }); m.box.classList.add('bp-box');
    draw();
  }
  function draw() {
    const K = k(); m.body.replaceChildren(); m.foot.replaceChildren();
    m.body.append(el('p', 'bt-lede', K.lede));
    const tabs = el('div', 'br-tabs bp-tabs'); tabs.setAttribute('role', 'tablist');
    Object.entries(K.tabs).forEach(([id, t]) => { const b = btn('br-tab', t); b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(tab === id)); b.addEventListener('click', () => { tab = id; draw(); }); tabs.append(b); });
    m.body.append(tabs);
    const box = el('div', 'bp-sec'); m.body.append(box);
    ({ cal, docs, steps, alerts })[tab](box);
    m.foot.append(el('span', 'bt-note bp-foot', K.note));
  }
  /* 开放日历 */
  function cal(box) {
    const K = k();
    box.append(el('p', 'lp-demo bp-demo', '⚠️ ' + K.demo), readyBar());
    const ctl = el('div', 'bp-ctl'), q = el('input'); q.type = 'search'; q.placeholder = K.searchPh; q.value = filter.q; q.setAttribute('aria-label', K.searchPh);
    const only = btn('bt-chipbtn' + (filter.watch ? ' on' : ''), K.onlyWatch); only.setAttribute('aria-pressed', String(filter.watch));
    ctl.append(q, only); box.append(ctl);
    const list = el('ul', 'bp-list'); box.append(list);
    const rank = { open: 0, soon: 1, waitlist: 2, unknown: 3 };
    const rows = () => HOMES_.map(h => ({ h, i: infoOf(h) })).filter(({ h }) => (!filter.watch || st.watch[h.id]) && (!filter.q || nameOf_(h).toLowerCase().includes(filter.q.toLowerCase())))
      .sort((a, b) => (rank[a.i.status] - rank[b.i.status]) || ((daysTo(a.i.opens) ?? 999) - (daysTo(b.i.opens) ?? 999)));
    const fill = () => {
      list.replaceChildren(); const rs = rows(); if (!rs.length) list.append(el('li', 'lp-empty', K.none));
      rs.forEach(({ h, i }) => {
        const li = el('li', 'bp-row s-' + i.status), main = el('div', 'bp-main'), n = daysTo(i.opens);
        main.append(el('b', '', nameOf_(h)));
        const when = i.status === 'open' ? (n != null && n < 0 ? fmt(K.since, { n: -n }) : '') : i.opens ? fmt(K.opensOn, { d: dDate(i.opens) }) + (n > 0 ? ' · ' + fmt(K.days, { n }) : n === 0 ? ' · ' + K.today : '') : K.noDate;
        main.append(el('small', '', [i.status === 'open' && when ? '' : K.st[i.status], when].filter(Boolean).join(' · ')));
        if (i.status === 'soon' && n != null && n <= 7) main.append(el('small', 'bp-tip', K.soonTip));
        const side = el('div', 'bp-side'), cd = el('span', 'bp-cd');
        cd.textContent = i.status === 'open' ? K.st.open : n != null && n >= 0 ? (n === 0 ? K.today : String(n)) : '—';
        if (i.status !== 'open' && n > 0) cd.append(el('small', '', zh() ? '天' : n === 1 ? 'day' : 'days'));
        const w = btn('bt-chipbtn' + (st.watch[h.id] ? ' on' : ''), st.watch[h.id] ? K.watching : K.watch); w.setAttribute('aria-pressed', String(!!st.watch[h.id]));
        w.addEventListener('click', ev => { ev.stopPropagation(); if (st.watch[h.id]) delete st.watch[h.id]; else st.watch[h.id] = { since: new Date().toISOString() }; save(); fill(); });
        side.append(cd, w); li.append(main, side);
        if (i.url) { const a = el('a', 'bp-url', K.officialSite); a.href = i.url; a.target = '_blank'; a.rel = 'noopener'; main.append(a); }
        list.append(li);
      });
    };
    let t = null; q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { filter.q = q.value; fill(); }, 200); });
    only.addEventListener('click', () => { filter.watch = !filter.watch; only.classList.toggle('on', filter.watch); only.setAttribute('aria-pressed', String(filter.watch)); fill(); });
    fill();
  }
  function readyBar() {
    const K = k(), a = docsDone(), b = K.docs.length, wrap = el('div', 'bp-ready'), bar = el('i'), f = el('b');
    f.style.width = (a / b * 100) + '%'; bar.append(f);
    wrap.append(el('span', '', a === b ? K.readyAll : fmt(K.ready, { a, b })), bar);
    if (a < b) { const g = btn('bt-link', K.gotoDocs); g.addEventListener('click', () => { tab = 'docs'; draw(); }); wrap.append(g); }
    return wrap;
  }
  /* 资料清单 */
  function docs(box) {
    const K = k(); box.append(el('p', 'bt-note', K.docsLede), readyBar());
    const ul = el('ul', 'bp-check'); box.append(ul);
    K.docs.forEach(([id, t, sub]) => ul.append(checkRow(t, sub, !!st.docs[id], v => { st.docs[id] = v; save(); const r = box.querySelector('.bp-ready'); if (r) r.replaceWith(readyBar()); })));
  }
  function checkRow(title, sub, on, set) {
    const li = el('li'), lab = el('label', 'bp-ck' + (on ? ' on' : '')), cb = el('input'); cb.type = 'checkbox'; cb.checked = on;
    const tx = el('span'); tx.append(el('b', '', title), el('small', '', sub));
    cb.addEventListener('change', () => { lab.classList.toggle('on', cb.checked); set(cb.checked); });
    lab.append(cb, tx); li.append(lab); return li;
  }
  /* 订房步骤（按公寓） */
  function steps(box) {
    const K = k(); box.append(el('p', 'bt-note', K.stepsLede));
    const lab = el('label', 'bp-sel'), sel = el('select'); lab.append(el('span', '', K.stepsFor), sel);
    HOMES_.forEach(h => { const o = el('option', '', nameOf_(h)); o.value = h.id; sel.append(o); });
    const cur = BT.homeNow(); if (!stepHome) stepHome = (cur && cur.id) || Object.keys(st.watch)[0] || HOMES_[0].id;
    sel.value = stepHome; box.append(lab);
    const prog = el('div', 'bp-ready'), ul = el('ol', 'bp-check bp-steps'); box.append(prog, ul);
    const fill = () => {
      const done = st.steps[stepHome] || {}, a = K.steps.filter(([id]) => done[id]).length, bar = el('i'), f = el('b'); f.style.width = (a / K.steps.length * 100) + '%'; bar.append(f);
      prog.replaceChildren(el('span', '', fmt(K.progress, { a, b: K.steps.length })), bar);
      ul.replaceChildren(); K.steps.forEach(([id, t, sub]) => ul.append(checkRow(t, sub, !!done[id], v => { (st.steps[stepHome] = st.steps[stepHome] || {})[id] = v; save(); fill(); })));
    };
    sel.addEventListener('change', () => { stepHome = sel.value; fill(); });
    fill();
  }
  /* 开放提醒 */
  function alerts(box) {
    const K = k(); box.append(el('p', 'lp-demo bp-demo', '⚠️ ' + K.demo), el('p', 'bt-note', K.alertsLede));
    const ids = Object.keys(st.watch);
    if (!ids.length) box.append(el('p', 'lp-empty', K.alertsNone));
    const ul = el('ul', 'bp-list'); box.append(ul);
    ids.forEach(id => {
      const h = HOMES_.find(x => x.id === id); if (!h) return; const i = infoOf(h), n = daysTo(i.opens);
      const li = el('li', 'bp-row s-' + i.status), main = el('div', 'bp-main'); main.append(el('b', '', nameOf_(h)), el('small', '', [K.st[i.status], i.status !== 'open' && i.opens ? fmt(K.opensOn, { d: dDate(i.opens) }) + (n > 0 ? ' · ' + fmt(K.days, { n }) : '') : ''].filter(Boolean).join(' · ')));
      const side = el('div', 'bp-side'), sim = btn('bt-btn alt bp-sim', K.simulate);
      sim.disabled = i.status === 'open';
      sim.addEventListener('click', () => { st.sim[id] = 'open'; const msg = fmt(K.simulated, { h: nameOf_(h) }); st.log.unshift({ at: new Date().toISOString(), msg }); st.log = st.log.slice(0, 20); save(); BT.say(msg); draw(); });
      side.append(sim); li.append(main, side); ul.append(li);
    });
    const em = el('div', 'bp-email'), lab = el('label'), inp = el('input'), sv = btn('bt-btn alt', K.saveEmail);
    inp.type = 'email'; inp.placeholder = K.emailPh; inp.value = st.email || ''; lab.append(el('span', '', K.email), inp);
    sv.addEventListener('click', () => { st.email = inp.value.trim(); save(); sv.textContent = K.saved; setTimeout(() => { sv.textContent = K.saveEmail; }, 1200); });
    em.append(lab, sv); box.append(em);
    if (st.log.length) { const d = el('details', 'hi-notes-d'), sm = el('summary', '', K.alertLog), ol = el('ul', 'hi-notes'); st.log.forEach(x => ol.append(el('li', '', new Date(x.at).toLocaleString(zh() ? 'zh-CN' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' }) + ' · ' + x.msg))); d.append(sm, ol); box.append(d); }
    const how = el('details', 'hi-notes-d'), hs = el('summary', '', K.howH), hu = el('ul', 'hi-notes'); K.how.forEach(x => hu.append(el('li', '', x))); how.append(hs, hu); box.append(how);
  }

  BT.add({ id: 'prep', order: 1, mini: false, card: h => ({ title: k().title, desc: (() => { const i = infoOf(h), n = daysTo(i.opens); return i.status === 'open' ? k().st.open : i.opens && n > 0 ? fmt(k().opensOn, { d: dDate(i.opens) }) : k().desc; })() }), intro: () => k().intro, open: h => open(h, 'cal') });
  window.BookingPrep = { open, info: infoOf };
})();
