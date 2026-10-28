/* 🏁 抢房准备：抢房拉开差距的是「第一时间知道开放了」和「开放那一刻知道自己要订哪间」。
   - 开放日历：各公寓预计开放日、倒计时和监测状态（上次检查时间、检查频率）。可以「关注」。
   - 抢房计划：给关注的公寓排好首选和备选房型、能接受的最高周租，再按「开放当天」的顺序做准备。
   - 开放提醒：留邮箱，关注的公寓开放或售罄后又有房时发邮件；页面开着时每分钟刷新一次，变了马上提示。
   - 两手准备：自己抢的同时，引导学生找订房顾问（打开页面原有的咨询进群），抢房计划可一键复制发给顾问。
   数据来源：有服务器时读 ./api/availability（consult-server 的 lib/availability.js 定时查官网公开页面：平时每 45 分钟，
   开放日前后每 7 分钟）；静态网页读 booking-prep.json 的演示数据。
   只提醒，不替学生下单，也不绕过官网的排队和验证码。关注和计划存在这台设备的浏览器里（lsm-prep-v1）。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, pick } = BT;
  let HOMES_; try { HOMES_ = HOMES; } catch (_) { return; }
  const ROOMS = ['ensuite', 'studio', 'premium', 'twodio', 'flat'];
  const T = {
    zh: {
      title: '🏁 抢房准备', desc: '开放日历 · 抢房计划 · 开放提醒', eyebrow: '抢房准备', intro: '🏁 抢房准备',
      lede: '抢房比的是两件事：第一时间知道开放了，开放那一刻知道自己要订哪间。',
      tabs: { cal: '开放日历', plan: '抢房计划', alerts: '开放提醒' },
      demo: '演示数据：开放日期和状态是示例。连上服务器后会自动查官网公开页面。',
      st: { open: '已开放', soon: '即将开放', waitlist: '候补 / 登记意向', soldout: '售罄', unknown: '待核对', blocked: '待人工核对', error: '待人工核对' },
      days: '还有 {n} 天', today: '今天开放', since: '已开放 {n} 天', opensOn: '预计 {d} 开放', noDate: '开放日期待核对',
      watch: '关注', watching: '已关注', searchPh: '搜索公寓名称', onlyWatch: '只看已关注', none: '没有符合条件的公寓。',
      soonTip: '快开放了：去「抢房计划」排好首选和备选。', from: '官网最低 £{p}/周',
      live: '监测中', checked: '{t}检查过官网', never: '还没检查过', fastNow: '开放日前后，每 {n} 分钟查一次', normal: '平时每 {n} 分钟查一次',
      ago: { now: '刚刚', m: '{n} 分钟前', h: '{n} 小时前', d: '{n} 天前' },
      planLede: '开放那一刻没时间犹豫。先给每栋关注的公寓排好顺序：首选没了，马上订备选。', planNone: '还没有关注的公寓。在「开放日历」里点「关注」。',
      planFor: '公寓', rooms: { ensuite: '独卫单间 En-suite', studio: '单人公寓 Studio', premium: '高楼层 / 大房间', twodio: '双人间 Twodio', flat: '合租整套' },
      order: '房型顺序（点一下加入，再点移除）', first: '首选', backup: '备选 {n}', maxRent: '最高周租（£）', maxPh: '比如 220', overMax: '官网最低价 £{p} 已超过你的上限',
      dayH: '开放当天', day: [
        ['acct', '提前一天登录官网账号', '确认密码和邮箱验证码都能收到'],
        ['card', '准备好能付英镑的卡', '开通境外支付，额度够付预订费'],
        ['early', '开放前 10 分钟打开预订页', '用上面的官网链接，网络好的地方'],
        ['go', '按顺序下单', '首选没了马上换备选，别在页面上比较太久'],
        ['done', '付完预订费截图保存', '之后的合同和资料按官网邮件一步步来']
      ],
      dayDone: '准备了 {a} / {b} 项',
      alertsLede: '关注的公寓开放、或者售罄后又有房时提醒你。', alertsNone: '还没有关注的公寓。在「开放日历」里点「关注」。',
      email: '提醒邮箱', emailPh: 'name@example.com', sub: '开启邮件提醒', subOn: '✓ 已开启：{n} 栋公寓开放时会发邮件', subErr: '没订上，请稍后再试', subBad: '请填写正确的邮箱',
      subDemo: '演示版：没连服务器，不会真的发邮件。', subNoMail: '服务器还没配好邮件，暂时只在页面里提醒。',
      pageTip: '这个页面开着时每分钟刷新一次，关注的公寓状态变了会马上提示。',
      simulate: '模拟开放', simulated: '🔔 {h} 已开放预订！按抢房计划去官网下单。', alertLog: '提醒记录',
      howH: '怎么监测的', how: ['服务器定时打开各公寓官网公开的房型页面：平时每 45 分钟一次，预计开放日前 3 天到后 2 天改为每 7 分钟一次。', '页面上目标学年旁边出现「Book now」就算开放；出现「Sold out」算售罄，之后又能订会再提醒一次。顺便读出最低周租。', '遵守网站的 robots.txt，同一个网站两次访问至少隔 15 秒。判断不了的由订房专家人工核对。', '只提醒，不替你下单，也不绕过官网的排队和验证码。'],
      officialSite: '官网预订页 ↗', note: '开放日期和状态以公寓官网为准。',
      twoH: '🤝 两手准备：自己抢 + 订房顾问帮你盯', twoLede: '热门公寓开放几分钟就可能订满。加一位订房顾问，成功率更高：',
      two: ['开放前帮你核对开放时间、房型和价格，提前排好备选', '开放当天和你一起盯，首选没了马上给你推荐相近的房', '售罄了帮你登记候补，退房、补房第一时间通知你'],
      twoGo: '找订房顾问', twoCopy: '复制我的抢房计划', twoCopied: '已复制，进群后发给顾问', twoNote: '免费咨询；顾问能提高成功率，但不保证一定订到。',
      twoSoon: '快开放了，加一位订房顾问一起抢 ›', twoSold: '售罄了？让订房顾问帮你候补、找相近房源 ›',
      planTxt: '我的抢房计划：{h}（{st}）\n房型顺序：{o}\n最高周租：{m}\n预计开放：{d}', any: '未设置'
    },
    en: {
      title: '🏁 Booking prep', desc: 'Release dates · booking plan · alerts', eyebrow: 'Booking prep', intro: '🏁 Booking prep',
      lede: 'Getting a room comes down to two things: knowing the moment bookings open, and knowing which room you will book.',
      tabs: { cal: 'Release dates', plan: 'Booking plan', alerts: 'Alerts' },
      demo: 'Demo data: dates and statuses are examples. With the server connected, official public pages are checked automatically.',
      st: { open: 'Open', soon: 'Opening soon', waitlist: 'Waitlist / register interest', soldout: 'Sold out', unknown: 'To be checked', blocked: 'Checked by hand', error: 'Checked by hand' },
      days: 'in {n} days', today: 'opens today', since: 'open for {n} days', opensOn: 'expected {d}', noDate: 'date to be checked',
      watch: 'Watch', watching: 'Watching', searchPh: 'Search homes', onlyWatch: 'Watched only', none: 'No matching homes.',
      soonTip: 'Opening soon: set your first and backup choices in Booking plan.', from: 'from £{p}/week on the official site',
      live: 'Monitored', checked: 'official site checked {t}', never: 'not checked yet', fastNow: 'checked every {n} min around release day', normal: 'checked every {n} min',
      ago: { now: 'just now', m: '{n} min ago', h: '{n} h ago', d: '{n} days ago' },
      planLede: 'There is no time to think when bookings open. Rank your choices for each watched home so you can switch the moment your first choice goes.', planNone: 'No watched homes yet. Tap “Watch” in Release dates.',
      planFor: 'Home', rooms: { ensuite: 'En-suite', studio: 'Studio', premium: 'High floor / larger room', twodio: 'Twodio (shared double)', flat: 'Whole flat with friends' },
      order: 'Room order (tap to add, tap again to remove)', first: '1st', backup: 'Backup {n}', maxRent: 'Highest weekly rent (£)', maxPh: 'e.g. 220', overMax: 'The lowest official price £{p} is above your limit',
      dayH: 'On release day', day: [
        ['acct', 'Sign in to the official site the day before', 'Check your password works and verification codes arrive'],
        ['card', 'Have a card that pays in pounds', 'Overseas payments on, enough limit for the booking fee'],
        ['early', 'Open the booking page 10 minutes early', 'Use the official link above, on a good connection'],
        ['go', 'Book in your order', 'If the first choice is gone, take the backup straight away'],
        ['done', 'Screenshot the booking fee receipt', 'Then follow the official emails for the contract and documents']
      ],
      dayDone: '{a} of {b} ready',
      alertsLede: 'Get alerted when a watched home opens, or has rooms again after selling out.', alertsNone: 'No watched homes yet. Tap “Watch” in Release dates.',
      email: 'Alert email', emailPh: 'name@example.com', sub: 'Turn on email alerts', subOn: '✓ On: you will be emailed when {n} homes open', subErr: 'Could not subscribe, please try again', subBad: 'Please enter a valid email',
      subDemo: 'Demo: no server connected, so no email is sent.', subNoMail: 'Email is not set up on the server yet; alerts show on this page only.',
      pageTip: 'While this page is open it refreshes every minute and tells you as soon as a watched home changes.',
      simulate: 'Simulate opening', simulated: '🔔 {h} is now open for booking! Follow your booking plan on the official site.', alertLog: 'Alert history',
      howH: 'How monitoring works', how: ['The server opens each home’s official public rooms page: every 45 minutes normally and every 7 minutes from 3 days before to 2 days after the expected release date.', '“Book now” next to the target year counts as open; “Sold out” counts as sold out, and you are alerted again if rooms come back. The lowest weekly rent is read too.', 'It follows each site’s robots.txt and waits at least 15 seconds between visits to the same site. Anything unclear is checked by a booking expert.', 'It only alerts; it never books for you or bypasses official queues and captchas.'],
      officialSite: 'Official booking page ↗', note: 'Always confirm dates and availability on the official site.',
      twoH: '🤝 Two tracks: book yourself, and have a booking adviser watch with you', twoLede: 'Popular homes can sell out within minutes of opening. A booking adviser improves your chances:',
      two: ['Before release, they confirm the date, room types and prices and line up your backups', 'On the day, they watch with you and suggest a similar room the moment your first choice goes', 'If it sells out, they add you to the waitlist and tell you as soon as a room comes back'],
      twoGo: 'Talk to a booking adviser', twoCopy: 'Copy my booking plan', twoCopied: 'Copied: send it to your adviser in the group', twoNote: 'Free to ask. An adviser improves your chances but cannot guarantee a room.',
      twoSoon: 'Opening soon: add a booking adviser to book with you ›', twoSold: 'Sold out? A booking adviser can waitlist you and find similar rooms ›',
      planTxt: 'My booking plan: {h} ({st})\nRoom order: {o}\nHighest weekly rent: {m}\nExpected release: {d}', any: 'not set'
    }
  };
  const k = () => pick(T), zh = () => BT.lang() === 'zh';
  const S = BT.store('lsm-prep-v1');
  const st = Object.assign({ watch: {}, plan: {}, day: {}, email: '', subscribed: [], log: [], sim: {} }, S.get() || {});
  delete st.docs; delete st.steps;   // 旧版的资料清单和订房步骤不再使用

  const save = () => S.set(st);

  /* 数据：服务器监测优先，没有就用演示数据 */
  let INFO = { homes: {} }, LIVE = null, lastSeen = {};
  fetch('./booking-prep.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(j => { if (j && j.homes) INFO = j; }).catch(() => { /* 用空数据 */ });
  function pull() {
    return fetch('./api/availability', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(j => {
      if (!j || !j.homes) return;
      const first = !LIVE; LIVE = j;
      Object.entries(j.homes).forEach(([id, v]) => {
        const was = lastSeen[id]; lastSeen[id] = v.status;
        if (!first && st.watch[id] && v.status === 'open' && was && was !== 'open') { const h = HOMES_.find(x => x.id === id); if (h) alertOpen(h); }
      });
      if (m && m.box.isConnected) draw();
    }).catch(() => { /* 静态网页 */ });
  }
  pull();
  let poll = null;
  const startPoll = () => { if (!poll) poll = setInterval(() => { if (document.visibilityState === 'visible') pull(); }, 60e3); };

  const nameOf_ = h => { try { return nameOf(h); } catch (_) { return h.name; } };
  const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const infoOf = h => { const live = LIVE && LIVE.homes[h.id], i = { ...(LIVE ? {} : INFO.homes[h.id] || {}), ...(live || {}), id: h.id, live: !!live }; i.status = st.sim[h.id] || i.status || 'unknown'; return i; };
  const daysTo = d => d ? Math.round((new Date(d + 'T00:00:00') - today0()) / 864e5) : null;
  const dDate = d => new Date(d + 'T00:00:00').toLocaleDateString(zh() ? 'zh-CN' : 'en-GB', { month: 'long', day: 'numeric' });
  const ago = iso => { const K = k(), s = (Date.now() - Date.parse(iso)) / 1e3; return s < 90 ? K.ago.now : s < 3600 ? fmt(K.ago.m, { n: Math.round(s / 60) }) : s < 86400 ? fmt(K.ago.h, { n: Math.round(s / 3600) }) : fmt(K.ago.d, { n: Math.round(s / 86400) }); };
  const fastNow = i => { const n = daysTo(i.opens); return n != null && n <= 3 && n >= -2; };
  function monitorLine(i) {
    const K = k(); if (!i.live || !i.url) return '';
    return [K.live, i.checkedAt ? fmt(K.checked, { t: ago(i.checkedAt) }) : K.never, fastNow(i) ? fmt(K.fastNow, { n: LIVE.fastMin }) : fmt(K.normal, { n: LIVE.everyMin })].join(' · ');
  }
  function alertOpen(h) { const msg = fmt(k().simulated, { h: nameOf_(h) }); st.log.unshift({ at: new Date().toISOString(), msg }); st.log = st.log.slice(0, 20); save(); BT.say(msg); }
  const stLine = (K, i, withPrice) => { const n = daysTo(i.opens); return [K.st[i.status] || K.st.unknown, i.status !== 'open' && i.opens ? fmt(K.opensOn, { d: dDate(i.opens) }) + (n > 0 ? ' · ' + fmt(K.days, { n }) : n === 0 ? ' · ' + K.today : '') : i.status === 'open' && n != null && n < 0 ? fmt(K.since, { n: -n }) : i.status !== 'open' ? K.noDate : '', withPrice && i.price ? fmt(K.from, { p: i.price }) : ''].filter(Boolean).join(' · '); };
  const siteLink = (K, i) => { const a = el('a', 'bp-url', K.officialSite); a.href = i.url; a.target = '_blank'; a.rel = 'noopener'; return a; };

  /* 两手准备：自己抢 + 订房顾问。点「找订房顾问」打开页面原有的咨询进群（openContact），抢房计划可以复制发给顾问 */
  function adviser(h) {
    if (m) BT.close();
    try { openContact(h); } catch (_) { /* 页面还没准备好 */ }
  }
  function planText(h) {
    const K = k(), i = infoOf(h), p = st.plan[h.id] || { order: [] };
    return fmt(K.planTxt, { h: h.name, st: K.st[i.status] || K.st.unknown, o: p.order.length ? p.order.map(r => K.rooms[r]).join(' > ') : K.any, m: p.max ? '£' + p.max : K.any, d: i.opens || K.any });
  }
  function twoHands(h, compact) {
    const K = k(), box = el('div', 'bp-two' + (compact ? ' compact' : ''));
    box.append(el('b', 'bp-two-h', K.twoH));
    if (!compact) { box.append(el('p', '', K.twoLede)); const ul = el('ul'); K.two.forEach(x => ul.append(el('li', '', x))); box.append(ul); }
    const row = el('div', 'bp-two-act'), go = btn('bt-btn', K.twoGo);
    go.addEventListener('click', () => adviser(h)); row.append(go);
    if (!compact) {
      const cp = btn('bt-btn alt', K.twoCopy);
      cp.addEventListener('click', async () => { await BT.copy(planText(h)); cp.textContent = K.twoCopied; setTimeout(() => { cp.textContent = K.twoCopy; }, 1800); });
      row.append(cp);
    }
    box.append(row, el('small', 'bt-note', K.twoNote));
    return box;
  }
  const nudgeLink = (h, text) => { const a = btn('bp-two-link', text); a.addEventListener('click', ev => { ev.stopPropagation(); adviser(h); }); return a; };

  let m = null, tab = 'cal', planHome = null, filter = { q: '', watch: false };
  function open(h, which) {
    const K = k(); tab = which || tab; if (h) { planHome = h.id; if (tab === 'cal') filter = { q: nameOf_(h), watch: false }; }
    m = BT.modal({ eyebrow: K.eyebrow, title: K.title }); m.box.classList.add('bp-box');
    pull(); startPoll(); draw();
  }
  function draw() {
    const K = k(), y = m.body.scrollTop; m.body.replaceChildren(); m.foot.replaceChildren();
    m.body.append(el('p', 'bt-lede', K.lede));
    const tabs = el('div', 'br-tabs bp-tabs'); tabs.setAttribute('role', 'tablist');
    Object.entries(K.tabs).forEach(([id, t]) => { const b = btn('br-tab', t); b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(tab === id)); b.addEventListener('click', () => { tab = id; draw(); }); tabs.append(b); });
    m.body.append(tabs);
    const box = el('div', 'bp-sec'); m.body.append(box);
    if (!LIVE) box.append(el('p', 'lp-demo bp-demo', '⚠️ ' + K.demo));
    ({ cal, plan, alerts })[tab](box);
    m.foot.append(el('span', 'bt-note bp-foot', K.note));
    m.body.scrollTop = y;
  }
  const watchBtn = (h, after) => {
    const K = k(), w = btn('bt-chipbtn' + (st.watch[h.id] ? ' on' : ''), st.watch[h.id] ? K.watching : K.watch); w.setAttribute('aria-pressed', String(!!st.watch[h.id]));
    w.addEventListener('click', ev => {
      ev.stopPropagation();
      if (st.watch[h.id]) delete st.watch[h.id];
      else { st.watch[h.id] = { since: new Date().toISOString() }; if (LIVE && st.email && st.subscribed.length) subscribe(st.email, [h.id]).catch(() => {}); }   // 已开邮件提醒的，新关注的也一起订上
      save(); after();
    });
    return w;
  };
  /* 开放日历 */
  function cal(box) {
    const K = k();
    const ctl = el('div', 'bp-ctl'), q = el('input'); q.type = 'search'; q.placeholder = K.searchPh; q.value = filter.q; q.setAttribute('aria-label', K.searchPh);
    const only = btn('bt-chipbtn' + (filter.watch ? ' on' : ''), K.onlyWatch); only.setAttribute('aria-pressed', String(filter.watch));
    ctl.append(q, only); box.append(ctl);
    const list = el('ul', 'bp-list'); box.append(list);
    const rank = { open: 0, soon: 1, waitlist: 2, soldout: 3 };
    const rows = () => HOMES_.map(h => ({ h, i: infoOf(h) })).filter(({ h }) => (!filter.watch || st.watch[h.id]) && (!filter.q || nameOf_(h).toLowerCase().includes(filter.q.toLowerCase())))
      .sort((a, b) => ((rank[a.i.status] ?? 4) - (rank[b.i.status] ?? 4)) || ((daysTo(a.i.opens) ?? 999) - (daysTo(b.i.opens) ?? 999)));
    const fill = () => {
      list.replaceChildren(); const rs = rows(); if (!rs.length) list.append(el('li', 'lp-empty', K.none));
      rs.forEach(({ h, i }) => {
        const li = el('li', 'bp-row s-' + i.status), main = el('div', 'bp-main'), n = daysTo(i.opens);
        main.append(el('b', '', nameOf_(h)), el('small', '', stLine(K, i, true)));
        const mon = monitorLine(i); if (mon) main.append(el('small', 'bp-mon' + (fastNow(i) ? ' fast' : ''), mon));
        if (i.status === 'soon' && n != null && n <= 7 && n >= 0) main.append(el('small', 'bp-tip', K.soonTip), nudgeLink(h, K.twoSoon));
        else if ((i.status === 'soldout' || i.status === 'waitlist') && st.watch[h.id]) main.append(nudgeLink(h, K.twoSold));
        if (i.url) main.append(siteLink(K, i));
        const side = el('div', 'bp-side'), cd = el('span', 'bp-cd');
        cd.textContent = i.status === 'open' ? K.st.open : n != null && n >= 0 ? (n === 0 ? K.today : String(n)) : '—';
        if (i.status !== 'open' && n > 0) cd.append(el('small', '', zh() ? '天' : n === 1 ? 'day' : 'days'));
        side.append(cd, watchBtn(h, fill)); li.append(main, side);
        list.append(li);
      });
    };
    let t = null; q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { filter.q = q.value; fill(); }, 200); });
    only.addEventListener('click', () => { filter.watch = !filter.watch; only.classList.toggle('on', filter.watch); only.setAttribute('aria-pressed', String(filter.watch)); fill(); });
    fill();
  }
  /* 抢房计划：按公寓排首选 / 备选房型、最高周租；开放当天的准备 */
  function plan(box) {
    const K = k(), ids = Object.keys(st.watch).filter(id => HOMES_.some(h => h.id === id));
    box.append(el('p', 'bt-note', K.planLede));
    if (!ids.length) { box.append(el('p', 'lp-empty', K.planNone)); return; }
    if (!ids.includes(planHome)) planHome = ids[0];
    const lab = el('label', 'bp-sel'), sel = el('select'); lab.append(el('span', '', K.planFor), sel);
    ids.forEach(id => { const h = HOMES_.find(x => x.id === id), o = el('option', '', nameOf_(h) + ' · ' + (K.st[infoOf(h).status] || K.st.unknown)); o.value = id; sel.append(o); });
    sel.value = planHome; sel.addEventListener('change', () => { planHome = sel.value; draw(); });
    box.append(lab);
    const h = HOMES_.find(x => x.id === planHome), i = infoOf(h), p = st.plan[planHome] = st.plan[planHome] || { order: [], max: '' };
    const card = el('div', 'bp-plan s-' + i.status), head = el('div', 'bp-main');
    head.append(el('b', '', nameOf_(h)), el('small', '', stLine(K, i, true)));
    if (i.url) head.append(siteLink(K, i));
    card.append(head, el('span', 'bp-lab', K.order));
    const chips = el('div', 'bp-rooms');
    [...p.order.filter(r => ROOMS.includes(r)), ...ROOMS.filter(r => !p.order.includes(r))].forEach(r => {   // 选中的按顺序排在前面
      const at = p.order.indexOf(r), c = btn('bp-room' + (at >= 0 ? ' on' : ''));
      if (at >= 0) c.append(el('em', '', at === 0 ? K.first : fmt(K.backup, { n: at })));
      c.append(el('span', '', K.rooms[r])); c.setAttribute('aria-pressed', String(at >= 0));
      c.addEventListener('click', () => { p.order = at >= 0 ? p.order.filter(x => x !== r) : [...p.order, r]; save(); draw(); });
      chips.append(c);
    });
    card.append(chips);
    const ml = el('label', 'bp-max'), mi = el('input'); mi.type = 'number'; mi.inputMode = 'numeric'; mi.min = '60'; mi.max = '600'; mi.placeholder = K.maxPh; mi.value = p.max || '';
    ml.append(el('span', '', K.maxRent), mi);
    const warn = el('small', 'bp-tip'); card.append(ml, warn);
    const check = () => { const mx = Number(p.max); warn.textContent = mx && i.price && i.price > mx ? fmt(K.overMax, { p: i.price }) : ''; warn.hidden = !warn.textContent; };
    mi.addEventListener('input', () => { p.max = mi.value; save(); check(); }); check();
    box.append(card, twoHands(h, false));
    /* 开放当天 */
    const d = st.day[planHome] = st.day[planHome] || {}, prog = el('div', 'bp-ready'), ul = el('ol', 'bp-check');
    box.append(el('h4', 'bp-h', K.dayH), prog, ul);
    const fill = () => {
      const a = K.day.filter(([id]) => d[id]).length, bar = el('i'), f = el('b'); f.style.width = (a / K.day.length * 100) + '%'; bar.append(f);
      prog.replaceChildren(el('span', '', fmt(K.dayDone, { a, b: K.day.length })), bar);
      ul.replaceChildren(); K.day.forEach(([id, t, sub]) => ul.append(checkRow(t, sub, !!d[id], v => { d[id] = v; save(); fill(); })));
    };
    fill();
  }
  function checkRow(title, sub, on, set) {
    const li = el('li'), lab = el('label', 'bp-ck' + (on ? ' on' : '')), cb = el('input'); cb.type = 'checkbox'; cb.checked = on;
    const tx = el('span'); tx.append(el('b', '', title), el('small', '', sub));
    cb.addEventListener('change', () => { lab.classList.toggle('on', cb.checked); set(cb.checked); });
    lab.append(cb, tx); li.append(lab); return li;
  }
  /* 开放提醒 */
  async function subscribe(email, homeIds) {
    const r = await fetch('./api/availability/watch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, homeIds, lang: BT.lang() }) });
    if (!r.ok) throw new Error(String(r.status));
    st.subscribed = [...new Set([...st.subscribed, ...homeIds])]; save(); return r.json();
  }
  function alerts(box) {
    const K = k(); box.append(el('p', 'bt-note', K.alertsLede));
    const ids = Object.keys(st.watch).filter(id => HOMES_.some(h => h.id === id));
    if (!ids.length) box.append(el('p', 'lp-empty', K.alertsNone));
    const ul = el('ul', 'bp-list'); box.append(ul);
    ids.forEach(id => {
      const h = HOMES_.find(x => x.id === id), i = infoOf(h);
      const li = el('li', 'bp-row s-' + i.status), main = el('div', 'bp-main'); main.append(el('b', '', nameOf_(h)), el('small', '', stLine(K, i, false)));
      const mon = monitorLine(i); if (mon) main.append(el('small', 'bp-mon' + (fastNow(i) ? ' fast' : ''), mon));
      const side = el('div', 'bp-side');
      if (!LIVE) { const sim = btn('bt-btn alt bp-sim', K.simulate); sim.disabled = i.status === 'open'; sim.addEventListener('click', () => { st.sim[id] = 'open'; alertOpen(h); draw(); }); side.append(sim); }
      li.append(main, side); ul.append(li);
    });
    if (ids.length) {
      const em = el('div', 'bp-email'), lab = el('label'), inp = el('input'), sv = btn('bt-btn', K.sub), msg = el('small', 'bp-submsg');
      inp.type = 'email'; inp.placeholder = K.emailPh; inp.value = st.email || ''; inp.autocomplete = 'email'; lab.append(el('span', '', K.email), inp);
      const on = ids.filter(id => st.subscribed.includes(id)).length;
      msg.textContent = on ? fmt(K.subOn, { n: on }) : !LIVE ? K.subDemo : LIVE.mail ? '' : K.subNoMail;
      sv.addEventListener('click', async () => {
        const v = inp.value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg.textContent = K.subBad; return; }
        st.email = v; save();
        if (!LIVE) { st.subscribed = [...new Set([...st.subscribed, ...ids])]; save(); draw(); return; }
        sv.disabled = true; try { await subscribe(v, ids); draw(); } catch (_) { msg.textContent = K.subErr; sv.disabled = false; }
      });
      em.append(lab, sv); box.append(em, msg, el('small', 'bt-note', K.pageTip));
    }
    if (st.log.length) { const d = el('details', 'hi-notes-d'), sm = el('summary', '', K.alertLog), ol = el('ul', 'hi-notes'); st.log.forEach(x => ol.append(el('li', '', new Date(x.at).toLocaleString(zh() ? 'zh-CN' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' }) + ' · ' + x.msg))); d.append(sm, ol); box.append(d); }
    if (ids.length) { const h0 = HOMES_.find(x => x.id === ids[0]); box.append(twoHands(h0, true)); }
    const how = el('details', 'hi-notes-d'), hs = el('summary', '', K.howH), hu = el('ul', 'hi-notes'); K.how.forEach(x => hu.append(el('li', '', x))); how.append(hs, hu); box.append(how);
  }

  BT.add({ id: 'prep', order: 1, mini: false, card: h => ({ title: k().title, desc: (() => { const i = infoOf(h), n = daysTo(i.opens); return i.status === 'open' ? k().st.open : i.opens && n > 0 ? fmt(k().opensOn, { d: dDate(i.opens) }) : k().desc; })() }), intro: () => k().intro, open: h => open(h, 'cal') });
  window.BookingPrep = { open, info: infoOf };
})();
