/* 真实价格卡：每栋楼每个房型，官网的合同总价、逐条优惠、实付和「优惠后真实周价」。只放对学生有用的事实，不做推销。
   - 官网的房型、周租、必付费用和优惠：服务器每天自动检查官网，订房专家核对后才显示（consult-server 的 /api/offers）。
   - Amber：管理员在后台填了 Amber 的额外优惠、并且算下来比官网直订便宜时，才多出一行对比；一样或更贵就不显示。
   - 优惠按「值不值钱」分档：减租、现金返现、免费用照算；购物卡默认按面值算（可切换「只算现金」）；有条件的单独列、不算进主数字；非现金福利只展示。
   - 关注：学生点「🔔 优惠变了提醒我」，下次打开网页时，关注的楼优惠有变化会在页面上提醒；服务器配了发信时还可以留邮箱，专家确认官网变化后发邮件。
   - 其他模块可用：OfferCard.bestPerWeek(h)（公寓列表「官网优惠后真实周价最低」排序）、OfferCard.realWeek(h, type)（按预算看房）。
   没有服务器时用浏览器里后台演示存的数据，再没有就用示例数据（页面上标「示例数据」）。
   入口：公寓卡片「房型与照片」每个房型下面的「💷 真实总价」、收起状态的卡片、房型相册底部、生活选房开场页，链接 ?offer=公寓编号。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, money, pick } = BT;
  const W = {
    zh: {
      intro: '💷 官网优惠 · 真实周价', title: '💷 真实总价', desc: '官网优惠算进去，折合每周多少', tagRoom: '💷 真实总价', tagAlbum: '💷 总价', miniNone: '💷 官网优惠 · 真实周价', miniFrom: '💷 官网优惠后 {wk}/周起',
      eyebrow: '官网优惠 · 真实周价', heading: '{home} 真实总价', homesWith: '这些公寓已整理官网优惠，按优惠后真实周价排序：',
      room: '房型', weeksN: '{n} 周', cashOnly: '只算现金', withVoucher: '购物卡按面值算',
      perWeek: '官网优惠后 · 折合每周', listWeek: '官网周租 {v}', gross: '合同总价', grossHow: '{rent}/周 × {w} 周', pay: '算上优惠实付', save: '优惠共 {v}',
      offers: '官网优惠', noOffer: '官网目前没有优惠', amountOnSite: '金额见官网',
      conditional: '满足条件还能再省（没算进上面）', perks: '另外还送', directOnly: '仅官网直订', until: '截止 {d}', paid: '到账：{p}',
      types: { rent: '减租', cash: '现金返现', voucher: '购物卡', fee: '免费用', perk: '福利' },
      unitWeek: '{v}/周 × {w} 周', unitFree: '免 {n} 周房租',
      amberH: '{label}：折合每周 {wk}', amberP: '比官网直订每周少 {d}，合同期共少 {t}。', amberNo: '不含：{o}（仅官网直订）',
      checked: '官网数据 {d} 核对', checkedAuto: '每天自动检查官网 · 订房专家核对后更新', source: '官网原文 ↗', demo: '示例数据',
      note: '以公寓官网和合同为准。返现和购物卡通常入住后到账；有条件的优惠要满足条件才有。',
      expert: '💬 找订房专家', copied: '价格已复制，进群粘贴给专家就能直接帮你订。', budget: '💷 按预算看房 ›',
      follow: '🔔 优惠变了提醒我', following: '✓ 已关注，优惠变了会提醒你', unfollow: '取消关注', followNote: '下次打开这个网页时，如果这栋楼的官网优惠有变化，会在页面上提醒你。',
      emailPh: '你的邮箱（可选）', emailGo: '邮件提醒我', emailOk: '好了，官网优惠有变化、专家核对后会发邮件给你。邮件里可以随时退订。', emailBad: '邮箱格式不对', emailErr: '没提交成功，稍后再试', emailNote: '只用来发这栋楼的优惠变化，不做其他用途。',
      alertH: '🔔 你关注的公寓优惠变了', alertRow: '{home}：优惠后周价 {a} → {b}', alertRowSame: '{home}：官网优惠有更新', alertOpen: '查看', alertOk: '知道了',
      sum: '【真实总价】{home} · {room} · {w} 周\n合同总价 {g}，官网优惠 {o}，实付 {n}，折合每周 {pw}',
      ago: { m: '{n} 分钟前', h: '{n} 小时前', d: '{n} 天前' }, still: '这栋楼的官网价格和优惠还在整理中。可以先关注，整理好、有变化都会提醒你。'
    },
    en: {
      intro: '💷 Official offers · real weekly price', title: '💷 Real total', desc: 'Official offers included, per week', tagRoom: '💷 Real total', tagAlbum: '💷 Total', miniNone: '💷 Official offers · real weekly price', miniFrom: '💷 From {wk}/wk after official offers',
      eyebrow: 'Official offers · real weekly price', heading: '{home}: real total', homesWith: 'Homes with official offers checked, by real weekly price:',
      room: 'Room', weeksN: '{n} weeks', cashOnly: 'Cash only', withVoucher: 'Count gift cards',
      perWeek: 'After official offers · per week', listWeek: 'Official rent {v}/wk', gross: 'Contract total', grossHow: '{rent}/wk × {w} weeks', pay: 'You pay after offers', save: 'Offers total {v}',
      offers: 'Official offers', noOffer: 'No official offers right now', amountOnSite: 'see the site for the amount',
      conditional: 'Save more if you qualify (not counted above)', perks: 'Also included', directOnly: 'Direct bookings only', until: 'Ends {d}', paid: 'Paid: {p}',
      types: { rent: 'Rent off', cash: 'Cashback', voucher: 'Gift card', fee: 'Fee waived', perk: 'Extra' },
      unitWeek: '{v}/wk × {w} weeks', unitFree: '{n} weeks rent-free',
      amberH: '{label}: {wk} a week', amberP: '{d} a week less than booking direct, {t} less over the contract.', amberNo: 'Not included: {o} (direct bookings only)',
      checked: 'Official data checked {d}', checkedAuto: 'Official sites checked daily · updated after a booking expert confirms', source: 'Official page ↗', demo: 'Sample data',
      note: 'The building’s website and your contract are what count. Cashback and gift cards are usually paid after you move in; conditional offers need you to qualify.',
      expert: '💬 Talk to a booking expert', copied: 'Prices copied. Paste them in your group and an expert can book it for you.', budget: '💷 Search by budget ›',
      follow: '🔔 Tell me when offers change', following: '✓ Following: we will tell you when offers change', unfollow: 'Unfollow', followNote: 'Next time you open this site, you will see a note if this building’s official offers have changed.',
      emailPh: 'Your email (optional)', emailGo: 'Email me', emailOk: 'Done. We will email you when the official offers change and an expert has checked them. Every email has an unsubscribe link.', emailBad: 'Check the email address', emailErr: 'That did not go through. Try again later.', emailNote: 'Used only for this building’s offer changes.',
      alertH: '🔔 Offers changed at homes you follow', alertRow: '{home}: real weekly price {a} → {b}', alertRowSame: '{home}: official offers updated', alertOpen: 'View', alertOk: 'Got it',
      sum: '[Real total] {home} · {room} · {w} weeks\nContract total {g}, official offers {o}, you pay {n}, {pw} a week',
      ago: { m: '{n} min ago', h: '{n} h ago', d: '{n} days ago' }, still: 'We are still collecting this building’s official prices and offers. Follow it and we will tell you when they are in or change.'
    }
  };
  const w = () => pick(W);
  const zh = () => BT.lang() === 'zh';
  const homes = () => { try { return HOMES; } catch (_) { return []; } };
  const homeById = id => homes().find(h => h.id === id);
  const prefs = BT.store('lsm-offer-v1');
  const watch = BT.store('lsm-offer-watch-v1');   // { 公寓编号: { sig, best } }：关注时的官网优惠

  /* ---------- 示例数据（没有服务器、后台也没填时用；页面上标「示例数据」，不是官网原文） ---------- */
  const O = (type, amount, title, titleZh, more) => Object.assign({ id: 'd' + Math.random().toString(36).slice(2, 8), type, unit: 'once', amount, title, titleZh, conditions: '', conditionsZh: '', paid: '', until: '', rooms: [], conditional: false, directOnly: false }, more);
  const R = (name, type, weeks, rent) => ({ name, type, weeks, rent });
  const DEMO = {
    settings: { amberLabel: 'Amber 专属', amberLabelEn: 'Amber exclusive' },
    homes: {
      'iq-great-newton-house': { url: 'https://www.iqstudentaccommodation.com/', rooms: [R('Bronze En Suite', 'ensuite', 51, 152), R('Gold En Suite', 'ensuite', 51, 160), R('Studio', 'studio', 51, 199)], fees: [{ name: 'Booking fee', nameZh: '预订费（不退）', amount: 99 }],
        official: [O('cash', 250, 'Book now and get £250 cashback', '现在订返现 £250', { conditions: 'Paid after 8 weeks of tenancy', conditionsZh: '入住满 8 周后打款' }), O('voucher', 100, '£100 Amazon voucher for early bookings', '早鸟 £100 Amazon 购物卡', { until: '2026-12-15' }), O('perk', null, 'Free bedding pack', '送床品包'), O('cash', 100, 'Rebooker reward', '续租奖励 £100', { conditional: true, conditionsZh: '今年已入住、续订明年的同学' })],
        amber: [O('voucher', 120, 'Amber exclusive voucher', 'Amber 专属礼品卡 £120')] },
      'grand-central': { url: '', rooms: [R('En-suite', 'ensuite', 51, 143), R('Studio', 'studio', 51, 208), R('Studio', 'studio', 44, 215)], fees: [],
        official: [O('rent', 2, 'Two weeks rent-free', '免 2 周房租', { unit: 'weeks_free' }), O('voucher', 150, 'Love2Shop card', 'Love2Shop 购物卡 £150', { conditions: 'Given on arrival', conditionsZh: '入住当天领取', directOnly: true })],
        amber: [O('cash', 200, 'Amber cashback', 'Amber 返现 £200')] },
      'capital-gate': { url: '', rooms: [R('En-suite', 'ensuite', 51, 167), R('En-suite', 'ensuite', 44, 175)], fees: [{ name: 'Booking fee', nameZh: '预订费', amount: 75 }],
        official: [O('cash', 300, '£300 cashback', '返现 £300', { conditions: 'Paid in November', conditionsZh: '11 月打款' }), O('fee', 75, 'Booking fee waived', '免预订费 £75')], amber: [] },
      'atlantic-point': { url: '', rooms: [R('En-suite', 'ensuite', 51, 123)], fees: [],
        official: [O('voucher', 200, 'Liverpool ONE gift card', 'Liverpool ONE 购物卡 £200', { directOnly: true }), O('cash', 50, 'Refer a friend', '推荐朋友各返 £50', { conditional: true })], amber: [O('cash', 100, 'Amber cashback', 'Amber 返现 £100')] },
      'calico': { url: '', rooms: [R('En-suite', 'ensuite', 51, 165), R('Studio', 'studio', 51, 225)], fees: [],
        official: [O('rent', 10, '£10 off per week', '每周减 £10', { unit: 'week', rooms: ['Studio'] }), O('cash', 150, '£150 cashback', '返现 £150')], amber: [] }
    }
  };
  Object.values(DEMO.homes).forEach(h => { h.demo = true; });

  /* ---------- 数据：服务器 → 后台演示存的 → 示例 ---------- */
  let DATA = null, source = 'demo', mailOn = false;
  const LOCAL_KEY = 'lsm-offers-admin-v1';   // offers-admin.html 演示模式存在这里
  const changed = () => { BT.refresh(); try { if (rankKey === 'offer') applyRanking('offer'); } catch (_) { /* 页面还没准备好 */ } checkWatched(); };
  function load() {
    if (/^https?:$/.test(location.protocol)) {
      fetch('./api/offers', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).then(d => { if (d && d.homes && Object.keys(d.homes).length) { DATA = d; source = 'server'; mailOn = !!d.mail; changed(); } }).catch(() => { /* 静态网页 */ });
    }
    try { const l = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null'); if (l && l.homes && Object.keys(l.homes).length) { DATA = l; source = 'local'; } } catch (_) { /* 没有 */ }
    if (!DATA) DATA = DEMO;
  }
  load();
  addEventListener('storage', e => { if (e.key === LOCAL_KEY && source !== 'server') { DATA = null; load(); changed(); } });
  const label = key => { const s = { ...DEMO.settings, ...(DATA.settings || {}) }; return zh() ? s[key] : s[key + 'En'] || s[key]; };
  const dataOf = h => (h && DATA.homes[h.id]) || null;

  /* ---------- 计算 ---------- */
  const t = o => (zh() ? o.titleZh || o.title : o.title || o.titleZh);
  const applies = (o, r) => !o.rooms || !o.rooms.length || o.rooms.some(x => x.toLowerCase() === r.name.toLowerCase());
  function value(o, r) {
    if (o.amount == null || !(o.amount > 0)) return 0;
    if (o.unit === 'week') return o.amount * r.weeks;
    if (o.unit === 'weeks_free') return o.amount * r.rent;
    return o.amount;
  }
  /* channel: 'official'（官网直订）| 'amber'（官网优惠里「仅官网直订」的不算，加上 Amber 的额外优惠） */
  function compute(d, r, channel, cashOnly) {
    const fees = (d.fees || []).reduce((a, f) => a + (f.amount || 0), 0), gross = r.rent * r.weeks + fees;
    const list = (d.official || []).filter(o => applies(o, r) && (channel === 'official' || !o.directOnly)).map(o => ({ o, from: 'official' }))
      .concat(channel === 'official' ? [] : (d[channel] || []).filter(o => applies(o, r)).map(o => ({ o, from: channel })));
    const counted = [], cond = [], perks = [], unknown = [];
    list.forEach(x => {
      const v = value(x.o, r); x.v = v;
      if (x.o.type === 'perk') perks.push(x);
      else if (x.o.conditional) cond.push(x);
      else if (!v) unknown.push(x);
      else if (cashOnly && x.o.type === 'voucher') cond.push(Object.assign(x, { skipped: true }));
      else counted.push(x);
    });
    const off = Math.min(gross, counted.reduce((a, x) => a + x.v, 0)), net = gross - off;   // 填错金额时也不会出现负数
    return { channel, gross, fees, off, net, perWeek: net / r.weeks, counted, cond, perks, unknown, excluded: (d.official || []).filter(o => o.directOnly && channel !== 'official' && applies(o, r)) };
  }
  const cashOnlyNow = () => !!(prefs.get() || {}).cashOnly;
  /* 「官网优惠后 £X/周起」：所有房型里官网直订最低的折合每周 */
  function bestPerWeek(h) {
    const d = dataOf(h); if (!d || !d.rooms || !d.rooms.length) return null;
    return Math.min(...d.rooms.map(r => compute(d, r, 'official', cashOnlyNow()).perWeek));
  }
  /* 按预算看房：某类房型（ensuite / studio / 空 = 全部）官网优惠后最低的折合每周，没有数据返回 null */
  function realWeek(h, type) {
    const d = dataOf(h); if (!d || !d.rooms) return null;
    const rs = d.rooms.filter(r => !type || r.type === type); if (!rs.length) return null;
    return Math.min(...rs.map(r => compute(d, r, 'official', cashOnlyNow()).perWeek));
  }
  const ago = iso => {
    const k = w().ago, s = (Date.now() - Date.parse(iso)) / 60e3; if (!(s >= 0)) return '';
    return s < 60 ? fmt(k.m, { n: Math.max(1, Math.round(s)) }) : s < 48 * 60 ? fmt(k.h, { n: Math.round(s / 60) }) : fmt(k.d, { n: Math.round(s / 1440) });
  };

  /* ---------- 关注：记下关注时的官网数据，下次打开时比对 ---------- */
  const sigOf = d => (d ? JSON.stringify({ r: (d.rooms || []).map(r => [r.name, r.weeks, r.rent]), f: (d.fees || []).map(f => [f.name, f.amount]), o: (d.official || []).map(o => [o.type, o.unit, o.amount, o.title, o.until, o.conditional, o.directOnly]) }) : '');
  const watched = () => watch.get() || {};
  const isWatched = h => !!watched()[h.id];
  function setWatch(h, on) {
    const all = watched();
    if (on) all[h.id] = { sig: sigOf(dataOf(h)), best: bestPerWeek(h) }; else delete all[h.id];
    watch.set(all);
  }
  let alertBox = null;
  function checkWatched() {
    const all = watched(), rows = [];
    Object.entries(all).forEach(([id, v]) => {
      const h = homeById(id), d = h && dataOf(h); if (!h || sigOf(d) === v.sig) return;
      rows.push({ h, a: v.best, b: bestPerWeek(h) });
    });
    if (alertBox) { alertBox.remove(); alertBox = null; }
    if (!rows.length) return;
    const k = w(); alertBox = el('div', 'oc-alert'); alertBox.setAttribute('role', 'status');
    alertBox.append(el('b', '', k.alertH));
    rows.forEach(({ h, a, b }) => {
      const row = el('div', 'oc-arow'), go = btn('bt-link', k.alertOpen);
      row.append(el('span', '', a != null && b != null && Math.abs(a - b) > 0.005 ? fmt(k.alertRow, { home: h.name, a: money(a, 2), b: money(b, 2) }) : fmt(k.alertRowSame, { home: h.name })), go);
      go.addEventListener('click', e => { e.stopPropagation(); setWatch(h, true); checkWatched(); open(h); });
      alertBox.append(row);
    });
    const ok = btn('bt-btn alt', k.alertOk);
    ok.addEventListener('click', e => { e.stopPropagation(); rows.forEach(({ h }) => setWatch(h, true)); checkWatched(); });
    alertBox.append(ok);
    alertBox.addEventListener('click', e => e.stopPropagation());
    document.body.append(alertBox);
  }
  function followBox(h) {
    const k = w(), box = el('div', 'oc-follow');
    const draw = () => {
      box.replaceChildren();
      if (!isWatched(h)) {
        const b = btn('bt-btn alt', k.follow); b.addEventListener('click', () => { setWatch(h, true); draw(); });
        box.append(b, el('p', 'bt-note', k.followNote));
      } else {
        const u = btn('bt-link', k.unfollow); u.addEventListener('click', () => { setWatch(h, false); draw(); });
        const top = el('div', 'oc-frow'); top.append(el('b', '', k.following), u); box.append(top);
        if (mailOn) {   // 服务器配了发信：可以留邮箱
          const f = el('form', 'oc-mail'), i = el('input'), go = el('button', 'bt-btn', k.emailGo), msg = el('p', 'bt-note');
          i.type = 'email'; i.placeholder = k.emailPh; i.autocomplete = 'email'; go.type = 'submit';
          f.append(i, go);
          f.addEventListener('submit', async e => {
            e.preventDefault();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.trim())) { msg.textContent = k.emailBad; return; }
            go.disabled = true;
            try {
              const r = await fetch('./api/offers/watch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: i.value.trim(), homeId: h.id, name: h.name, lang: BT.lang() }) });
              msg.textContent = r.ok ? k.emailOk : k.emailErr; if (r.ok) i.value = '';
            } catch (_) { msg.textContent = k.emailErr; }
            go.disabled = false;
          });
          box.append(f, el('p', 'bt-note', k.emailNote), msg);
        }
      }
    };
    draw();
    return box;
  }

  /* ---------- 弹窗 ---------- */
  const ICON = { rent: '🏷️', cash: '💷', voucher: '🎁', fee: '🧾', perk: '✨' };
  function offerLine(x, r, k) {
    const o = x.o, li = el('li', 'oc-o' + (x.skipped ? ' skip' : ''));
    const top = el('div', 'oc-otop');
    top.append(el('span', 'oc-oname', ICON[o.type] + ' ' + t(o)));
    if (x.v) top.append(el('b', '', '−' + money(x.v)));
    else if (o.type !== 'perk') top.append(el('small', '', k.amountOnSite));
    li.append(top);
    const meta = [k.types[o.type]];
    if (o.unit === 'week' && o.amount) meta.push(fmt(k.unitWeek, { v: money(o.amount), w: r.weeks }));
    if (o.unit === 'weeks_free' && o.amount) meta.push(fmt(k.unitFree, { n: o.amount }));
    if (x.from === 'amber') meta.push(label('amberLabel'));
    if (o.directOnly) meta.push(k.directOnly);
    const cond = zh() ? o.conditionsZh || o.conditions : o.conditions || o.conditionsZh; if (cond) meta.push(cond);
    if (o.paid) meta.push(fmt(k.paid, { p: o.paid })); if (o.until) meta.push(fmt(k.until, { d: o.until }));
    li.append(el('small', 'oc-meta', meta.filter(Boolean).join(' · ')));
    return li;
  }
  function open(h, roomName) {
    const k = w();
    if (!h) return pickHome();
    const d = dataOf(h);
    const m = BT.modal({ eyebrow: k.eyebrow, title: fmt(k.heading, { home: h.name }) });
    m.box.classList.add('oc-box');
    if (!d || !d.rooms || !d.rooms.length) { m.body.append(el('p', 'bt-lede', k.still), followBox(h)); footer(m, h, null, null); return; }
    const st = { room: 0, cashOnly: cashOnlyNow() };
    const want = String(roomName || '').toLowerCase();
    let idx = want ? d.rooms.findIndex(r => r.name.toLowerCase() === want) : -1;
    if (idx < 0 && want) idx = d.rooms.findIndex(r => r.type === typeOf(roomName));
    if (idx >= 0) st.room = idx;
    const draw = () => {
      m.body.replaceChildren(); m.foot.replaceChildren();
      const r = d.rooms[st.room];
      // 房型 + 只算现金
      const chips = el('div', 'br-chips oc-rooms'); chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', k.room);
      d.rooms.forEach((x, i) => { const b = btn('bt-chipbtn' + (i === st.room ? ' on' : '')); b.setAttribute('aria-pressed', String(i === st.room)); b.append(x.name + ' · ' + fmt(k.weeksN, { n: x.weeks }) + ' '); b.append(el('small', '', money(x.rent) + '/' + (zh() ? '周' : 'wk'))); b.addEventListener('click', () => { st.room = i; draw(); }); chips.append(b); });
      const tog = el('div', 'oc-toggle');
      [[false, k.withVoucher], [true, k.cashOnly]].forEach(([v, lab]) => { const b = btn('bt-chipbtn' + (st.cashOnly === v ? ' on' : ''), lab); b.setAttribute('aria-pressed', String(st.cashOnly === v)); b.addEventListener('click', () => { st.cashOnly = v; prefs.set({ ...(prefs.get() || {}), cashOnly: v }); draw(); }); tog.append(b); });
      m.body.append(chips, tog);
      if (d.demo) m.body.append(el('span', 'bt-tag demo oc-demo', k.demo));
      // 官网：一张主卡
      const x = compute(d, r, 'official', st.cashOnly), card = el('section', 'oc-main');
      const big = el('div', 'oc-big'); big.append(el('small', '', k.perWeek), el('strong', '', money(x.perWeek, 2)), el('span', 'oc-rent', fmt(k.listWeek, { v: money(r.rent) })));
      const dl = el('dl', 'oc-sum');
      const row = (a, b, cls) => { dl.append(el('dt', '', a), el('dd', cls || '', b)); };
      row(k.gross, money(x.gross)); if (x.off) row('', fmt(k.save, { v: '−' + money(x.off) }), 'oc-save'); row(k.pay, money(x.net), 'oc-net');
      const how = el('p', 'oc-how'); how.append(fmt(k.grossHow, { rent: money(r.rent), w: r.weeks }));
      (d.fees || []).forEach(f => how.append(' + ' + (zh() ? f.nameZh || f.name : f.name) + ' ' + money(f.amount)));
      how.append(' = ' + money(x.gross));
      const top = el('div', 'oc-mtop'); top.append(big, dl);
      card.append(top, how);
      const ul = el('ul', 'oc-list'); x.counted.concat(x.unknown).forEach(y => ul.append(offerLine(y, r, k)));
      card.append(el('b', 'oc-subh', k.offers));
      if (!ul.children.length) ul.append(el('li', 'oc-o none', k.noOffer));
      card.append(ul);
      m.body.append(card);
      // 有条件的、福利
      if (x.cond.length) { const box = el('div', 'oc-extra'); box.append(el('b', '', k.conditional)); const l = el('ul', 'oc-list'); x.cond.forEach(y => l.append(offerLine(y, r, k))); box.append(l); m.body.append(box); }
      if (x.perks.length) m.body.append(el('p', 'oc-perks', '✨ ' + k.perks + '：' + x.perks.map(y => t(y.o)).join(zh() ? '、' : ', ')));
      // Amber：只有比官网直订便宜时才显示
      if (d.amber && d.amber.length) {
        const a = compute(d, r, 'amber', st.cashOnly);
        if (a.net < x.net - 0.5) {
          const box = el('section', 'oc-amber'), head = el('header');
          head.append(el('span', 'oc-badge', 'Amber'), el('b', '', fmt(k.amberH, { label: label('amberLabel'), wk: money(a.perWeek, 2) })));
          box.append(head, el('p', 'oc-amberp', fmt(k.amberP, { d: money(x.perWeek - a.perWeek, 2), t: money(x.net - a.net) })));
          const l = el('ul', 'oc-list'); a.counted.filter(y => y.from === 'amber').forEach(y => l.append(offerLine(y, r, k)));
          a.excluded.forEach(o => l.append(el('li', 'oc-o none', '✕ ' + fmt(k.amberNo, { o: t(o) }))));
          box.append(l);
          if (label('amberNote')) box.append(el('p', 'oc-service', label('amberNote')));
          m.body.append(box);
        }
      }
      m.body.append(followBox(h));
      // 来源
      const src = el('p', 'oc-src');
      if (d.confirmedAt) src.append(fmt(k.checked, { d: ago(d.confirmedAt) }) + ' · ');
      src.append(k.checkedAuto);
      if (d.url) { src.append(' · '); const a = el('a', '', k.source); a.href = d.url; a.target = '_blank'; a.rel = 'noopener'; src.append(a); }
      m.body.append(src, el('p', 'bt-note', k.note));
      footer(m, h, r, x);
    };
    draw();
  }
  const typeOf = n => { const s = String(n || '').toLowerCase().replace(/[^a-z0-9]/g, ''); return /studio/.test(s) ? 'studio' : /nonensuite|shared/.test(s) ? 'nonensuite' : /ensuite/.test(s) ? 'ensuite' : /1bed|apartment|flat/.test(s) ? 'apartment' : ''; };

  function footer(m, h, r, x) {
    const k = w(), budget = btn('bt-link', k.budget), expert = btn('bt-btn', k.expert);
    budget.addEventListener('click', () => { BT.close(); try { window.QuoteCheck.open(null, null, 'budget'); } catch (_) { /* 没有按预算看房 */ } });
    expert.addEventListener('click', async () => {
      if (r && x) await BT.copy(fmt(k.sum, { home: h.name, room: r.name, w: r.weeks, g: money(x.gross), o: money(x.off), n: money(x.net), pw: money(x.perWeek, 2) }));
      BT.close();
      try { openContact(h); } catch (_) { return; }
      if (r) BT.say(k.copied);
    });
    if (window.QuoteCheck) m.foot.append(budget);
    m.foot.append(expert);
  }

  /* 没选公寓（开场页进来）：列出已整理官网优惠的公寓，按优惠后真实周价排序 */
  function pickHome() {
    const k = w(), m = BT.modal({ eyebrow: k.eyebrow, title: k.title });
    m.body.append(el('p', 'bt-lede', k.homesWith));
    const ul = el('div', 'qc-homes');
    Object.keys(DATA.homes).map(homeById).filter(Boolean).map(h => ({ h, p: bestPerWeek(h) })).sort((a, b) => (a.p || 1e9) - (b.p || 1e9)).forEach(({ h, p }) => {
      const row = btn('qc-home'), s = el('span'); s.append(el('b', '', h.name), el('small', '', h.area || ''));
      row.append(s, el('span', 'qc-p', p ? money(p, 2) + (zh() ? '/周' : '/wk') : ''));
      row.addEventListener('click', () => open(h)); ul.append(row);
    });
    m.body.append(ul);
    if (DATA === DEMO) m.body.append(el('span', 'bt-tag demo', k.demo));
  }

  /* ---------- 入口 ---------- */
  BT.add({
    id: 'offers', order: 1, details: false,
    card: h => { const p = bestPerWeek(h); return { title: w().title, desc: w().desc, mini: p ? fmt(w().miniFrom, { wk: money(p, 2) }) : w().miniNone, cls: 'qt-tag oc-mini' }; },
    intro: () => w().intro,
    open: h => open(h)
  });
  const cardBody = document.getElementById('cardBody');
  function tagRooms() {
    const h = BT.homeNow(), strip = cardBody && cardBody.querySelector('.rp-strip');
    if (!h || !strip) return;
    let types = []; try { types = window.RoomPhotos.types(h); } catch (_) { types = []; }
    [...strip.children].forEach((card, i) => {
      if (!card.classList.contains('rp-card')) return;
      const item = el('div', 'rp-item'), tag = btn('qt-tag small', w().tagRoom), key = types[i] && types[i].key;
      tag.addEventListener('click', e => { e.stopPropagation(); open(h, key); });
      card.before(item); item.append(card, tag);
    });
  }
  if (cardBody) new MutationObserver(tagRooms).observe(cardBody, { childList: true, subtree: true });
  const album = document.querySelector('.rp-wrap');
  if (album) new MutationObserver(() => {
    const foot = album.querySelector('.rp-afoot'), h = BT.homeNow();
    if (!foot || !h || foot.querySelector('.qt-tag')) return;
    const title = album.querySelector('.rp-atitles h3');
    let key = null; try { const x = window.RoomPhotos.types(h).find(e => title && e.name === title.textContent); key = x && x.key; } catch (_) { key = null; }
    const tag = btn('qt-tag small', w().tagAlbum);
    tag.addEventListener('click', () => { const x = album.querySelector('.x'); if (x) x.click(); open(h, key); });
    foot.insertBefore(tag, foot.lastElementChild);
  }).observe(album, { childList: true });

  /* ?offer=公寓编号 直接打开这栋楼的价格卡（后台「在学生网站上看」、提醒邮件里的链接用） */
  const wantHome = new URLSearchParams(location.search).get('offer');
  setTimeout(() => {
    checkWatched();
    if (wantHome) { const h = homeById(wantHome); if (h) { try { window.HomeMatch.exit(); } catch (_) { /* 没有 */ } open(h); } }
  }, 600);
  /* 公寓列表的排序选项「官网优惠后真实周价最低」：只有加载了这个模块才出现 */
  try { RANKS.offer = { tk: 'r_offer', group: 'g_price', val: h => bestPerWeek(h), fmt: v => t('fGbp', { v: Number(v).toFixed(2) }) }; buildRankOptions(); } catch (_) { /* 页面还没准备好 */ }

  window.OfferCard = { open, compute, bestPerWeek, realWeek, data: () => DATA, setData: d => { DATA = d; source = 'preview'; }, DEMO };
})();
