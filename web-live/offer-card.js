/* 真实价格卡：每栋楼每个房型，官网直订 / 通过我们订 / Amber 三种方式各自的合同总价、优惠、实付和折合每周。
   - 官网的房型、周租、必付费用和优惠：服务器每天自动检查官网，订房专家核对后才显示（consult-server 的 /api/offers）。
   - 「通过我们订」和 Amber 的优惠由管理员在后台填（offers-admin.html）。
   - 优惠按「值不值钱」分档：减租、现金返现、免费用照算；购物卡默认按面值算（可切换「只算现金」）；有条件的单独列、不算进主数字；非现金福利只展示。
   - 学生手上有别的平台报价，填每周价和周数，按官网价拆开：多少是官网本来就有的优惠，平台自己补了多少，给一句建议。
   没有服务器时用浏览器里后台演示存的数据，再没有就用示例数据（页面上标「示例数据」）。
   入口：公寓卡片「房型与照片」每个房型下面的「💷 真实总价」、收起状态的卡片、房型相册底部、生活选房开场页。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, money, pick } = BT;
  const W = {
    zh: {
      intro: '💷 官网优惠 · 真实总价', title: '💷 真实总价', desc: '官网优惠算进去，折合每周多少', tagRoom: '💷 真实总价', tagAlbum: '💷 总价', miniNone: '💷 官网优惠 · 真实总价', miniFrom: '💷 优惠后 {wk}/周起',
      eyebrow: '官网优惠 · 真实总价', heading: '{home} 真实总价', pickHome: '先选一处公寓', home: '公寓', homesWith: '这些公寓已整理官网优惠：',
      room: '房型', weeksN: '{n} 周', cashOnly: '只算现金', withVoucher: '购物卡按面值算',
      official: '官网直订', gross: '合同总价', grossHow: '{rent}/周 × {w} 周', pay: '实付', perWeek: '折合每周', best: '最划算', save: '省 {v}',
      fees: '必付费用', noOffer: '目前没有优惠', same: '和官网直订一样', amountOnSite: '金额见官网', officialToo: '含官网优惠',
      conditional: '满足条件还能再省（没算进上面）', perks: '另外还送', directOnly: '仅官网直订', notHere: '不含 {o}（仅官网直订）', until: '截止 {d}', paid: '到账：{p}',
      types: { rent: '减租', cash: '现金返现', voucher: '购物卡', fee: '免费用', perk: '福利' },
      unitWeek: '{v}/周 × {w} 周', unitFree: '免 {n} 周房租',
      platH: '别的平台报价？拆开看看', platLede: '填上平台报给你的每周价格和周数，按官网价拆开：多少是官网本来就有的优惠，平台自己补了多少。', platWk: '平台每周价', platWeeks: '周数',
      platTotal: '平台总价 {v}（{wk}/周 × {w} 周）', platSub: '平台在官网优惠之外自己补了 {v}', platSubP: '官网价 {gross}，官网优惠 {off}（在哪订都有），平台自己再补 {v}。下单前问清楚：官网的优惠还能拿到吗？平台的补贴什么时候、以什么形式到账？',
      platZero: '平台价就是官网价扣掉官网优惠', platZeroP: '平台没有额外补贴。{oursLine}',
      platOver: '比官网直订还贵 {v}', platOverP: '可能没把官网优惠 {off} 给你，或者含了服务费。下单前问清楚：官网的优惠我能拿到吗？',
      oursLine: '通过我们订折合每周 {wk}，比这个平台每周{dir} {d}。', cheaper: '便宜', dearer: '贵',
      bOff: '官网优惠', bSub: '平台补', bPay: '你实际付',
      checked: '官网数据 {d} 核对', checkedAuto: '每天自动检查官网 · 订房专家核对后更新', source: '官网原文 ↗', demo: '示例数据',
      note: '以公寓官网和合同为准。返现和购物卡通常入住后到账；有条件的优惠要满足条件才有。购物卡按面值计算，可以切换成只算现金。',
      expert: '💬 找订房专家', copied: '价格已复制，进群粘贴给专家就能直接帮你订。', budget: '💷 按预算看房 ›',
      sum: '【真实总价】{home} · {room} · {w} 周\n官网直订：总价 {g}，实付 {og}，折合每周 {ow}\n{ours}：实付 {ug}，折合每周 {uw}',
      ago: { m: '{n} 分钟前', h: '{n} 小时前', d: '{n} 天前' }
    },
    en: {
      intro: '💷 Official offers · real total', title: '💷 Real total', desc: 'Official offers included, per week', tagRoom: '💷 Real total', tagAlbum: '💷 Total', miniNone: '💷 Official offers · real total', miniFrom: '💷 From {wk}/wk after offers',
      eyebrow: 'Official offers · real total', heading: '{home}: real total', pickHome: 'Pick a home', home: 'Home', homesWith: 'Homes with official offers checked:',
      room: 'Room', weeksN: '{n} weeks', cashOnly: 'Cash only', withVoucher: 'Count gift cards',
      official: 'Book direct', gross: 'Contract total', grossHow: '{rent}/wk × {w} weeks', pay: 'You pay', perWeek: 'Per week', best: 'Best value', save: 'Save {v}',
      fees: 'Required fees', noOffer: 'No offers right now', same: 'Same as booking direct', amountOnSite: 'see the site for the amount', officialToo: 'Includes official offers',
      conditional: 'Save more if you qualify (not counted above)', perks: 'Also included', directOnly: 'Direct bookings only', notHere: 'Not included: {o} (direct bookings only)', until: 'Ends {d}', paid: 'Paid: {p}',
      types: { rent: 'Rent off', cash: 'Cashback', voucher: 'Gift card', fee: 'Fee waived', perk: 'Extra' },
      unitWeek: '{v}/wk × {w} weeks', unitFree: '{n} weeks rent-free',
      platH: 'Quote from another platform? Break it down', platLede: 'Enter the weekly price and weeks a platform quoted. We split it against the official price: how much is the official offer, and how much the platform adds.', platWk: 'Platform weekly price', platWeeks: 'Weeks',
      platTotal: 'Platform total {v} ({wk}/wk × {w} weeks)', platSub: 'The platform adds {v} on top of the official offers', platSubP: 'Official price {gross}, official offers {off} (available anywhere), and the platform adds {v}. Before booking, ask: do I still get the official offers? When and how is the platform’s extra paid?',
      platZero: 'The platform price is the official price minus official offers', platZeroP: 'The platform adds nothing itself. {oursLine}',
      platOver: '{v} more than booking direct', platOverP: 'It may not pass on the {off} of official offers, or it includes a fee. Ask before booking: do I get the official offers?',
      oursLine: 'Booking with us works out at {wk} a week, {d} a week {dir} this platform.', cheaper: 'less than', dearer: 'more than',
      bOff: 'Official', bSub: 'Platform', bPay: 'You pay',
      checked: 'Official data checked {d}', checkedAuto: 'Official sites checked daily · updated after a booking expert confirms', source: 'Official page ↗', demo: 'Sample data',
      note: 'The building’s website and your contract are what count. Cashback and gift cards are usually paid after you move in; conditional offers need you to qualify. Gift cards count at face value; switch to cash only if you prefer.',
      expert: '💬 Talk to a booking expert', copied: 'Prices copied. Paste them in your group and an expert can book it for you.', budget: '💷 Search by budget ›',
      sum: '[Real total] {home} · {room} · {w} weeks\nBook direct: total {g}, you pay {og}, {ow} a week\n{ours}: you pay {ug}, {uw} a week',
      ago: { m: '{n} min ago', h: '{n} h ago', d: '{n} days ago' }
    }
  };
  const w = () => pick(W);
  const zh = () => BT.lang() === 'zh';
  const homes = () => { try { return HOMES; } catch (_) { return []; } };
  const homeById = id => homes().find(h => h.id === id);
  const prefs = BT.store('lsm-offer-v1');

  /* ---------- 示例数据（没有服务器、后台也没填时用；页面上标「示例数据」，不是官网原文） ---------- */
  const O = (type, amount, title, titleZh, more) => Object.assign({ id: 'd' + Math.random().toString(36).slice(2, 8), type, unit: 'once', amount, title, titleZh, conditions: '', conditionsZh: '', paid: '', until: '', rooms: [], conditional: false, directOnly: false }, more);
  const R = (name, type, weeks, rent) => ({ name, type, weeks, rent });
  const OURS = () => [O('cash', 150, 'Book with us: extra cashback', '通过我们订：额外返现', { conditions: 'Paid within 4 weeks of check-in', conditionsZh: '入住后 4 周内转账' })];
  const DEMO = {
    settings: { oursLabel: '通过我们订', oursLabelEn: 'Book with us', oursService: '订房专家全程跟进：帮你看合同、盯返现到账、签证被拒协助退订。', oursServiceEn: 'A booking expert follows your case: contract check, cashback follow-up and help if your visa is refused.', amberLabel: 'Amber 专属', amberLabelEn: 'Amber exclusive' },
    homes: {
      'iq-great-newton-house': { url: 'https://www.iqstudentaccommodation.com/', rooms: [R('Bronze En Suite', 'ensuite', 51, 152), R('Gold En Suite', 'ensuite', 51, 160), R('Studio', 'studio', 51, 199)], fees: [{ name: 'Booking fee', nameZh: '预订费（不退）', amount: 99 }],
        official: [O('cash', 250, 'Book now and get £250 cashback', '现在订返现 £250', { conditions: 'Paid after 8 weeks of tenancy', conditionsZh: '入住满 8 周后打款' }), O('voucher', 100, '£100 Amazon voucher for early bookings', '早鸟 £100 Amazon 购物卡', { until: '2026-12-15' }), O('perk', null, 'Free bedding pack', '送床品包'), O('cash', 100, 'Rebooker reward', '续租奖励 £100', { conditional: true, conditionsZh: '今年已入住、续订明年的同学' })],
        ours: OURS(), amber: [O('voucher', 120, 'Amber exclusive voucher', 'Amber 专属礼品卡 £120')] },
      'grand-central': { url: '', rooms: [R('En-suite', 'ensuite', 51, 143), R('Studio', 'studio', 51, 208), R('Studio', 'studio', 44, 215)], fees: [],
        official: [O('rent', 2, 'Two weeks rent-free', '免 2 周房租', { unit: 'weeks_free' }), O('voucher', 150, 'Love2Shop card', 'Love2Shop 购物卡 £150', { conditions: 'Given on arrival', conditionsZh: '入住当天领取', directOnly: true })],
        ours: OURS(), amber: [O('cash', 200, 'Amber cashback', 'Amber 返现 £200')] },
      'capital-gate': { url: '', rooms: [R('En-suite', 'ensuite', 51, 167), R('En-suite', 'ensuite', 44, 175)], fees: [{ name: 'Booking fee', nameZh: '预订费', amount: 75 }],
        official: [O('cash', 300, '£300 cashback', '返现 £300', { conditions: 'Paid in November', conditionsZh: '11 月打款' }), O('fee', 75, 'Booking fee waived', '免预订费 £75')], ours: OURS(), amber: [] },
      'atlantic-point': { url: '', rooms: [R('En-suite', 'ensuite', 51, 123)], fees: [],
        official: [O('voucher', 200, 'Liverpool ONE gift card', 'Liverpool ONE 购物卡 £200', { directOnly: true }), O('cash', 50, 'Refer a friend', '推荐朋友各返 £50', { conditional: true })], ours: OURS(), amber: [O('cash', 100, 'Amber cashback', 'Amber 返现 £100')] },
      'calico': { url: '', rooms: [R('En-suite', 'ensuite', 51, 165), R('Studio', 'studio', 51, 225)], fees: [],
        official: [O('rent', 10, '£10 off per week', '每周减 £10', { unit: 'week', rooms: ['Studio'] }), O('cash', 150, '£150 cashback', '返现 £150')], ours: OURS(), amber: [] }
    }
  };
  Object.values(DEMO.homes).forEach(h => { h.demo = true; });

  /* ---------- 数据：服务器 → 后台演示存的 → 示例 ---------- */
  let DATA = null, source = 'demo';
  const LOCAL_KEY = 'lsm-offers-admin-v1';   // offers-admin.html 演示模式存在这里
  function load() {
    if (/^https?:$/.test(location.protocol)) {
      fetch('./api/offers', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).then(d => { if (d && d.homes && Object.keys(d.homes).length) { DATA = d; source = 'server'; BT.refresh(); } }).catch(() => { /* 静态网页 */ });
    }
    try { const l = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null'); if (l && l.homes && Object.keys(l.homes).length) { DATA = l; source = 'local'; } } catch (_) { /* 没有 */ }
    if (!DATA) DATA = DEMO;
  }
  load();
  addEventListener('storage', e => { if (e.key === LOCAL_KEY && source !== 'server') { DATA = null; load(); BT.refresh(); } });
  const S = () => ({ ...DEMO.settings, ...(DATA.settings || {}) });
  const label = key => { const s = S(); return zh() ? s[key] : s[key + 'En'] || s[key]; };
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
  /* channel: 'official' | 'ours' | 'amber' */
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
  const channels = d => ['official', 'ours'].concat(d.amber && d.amber.length ? ['amber'] : []);
  /* 卡片上的「优惠后 £X/周起」：所有房型、所有方式里最低的折合每周 */
  function bestPerWeek(h) {
    const d = dataOf(h); if (!d || !d.rooms || !d.rooms.length) return null;
    const cashOnly = !!(prefs.get() || {}).cashOnly;
    let best = null;
    d.rooms.forEach(r => channels(d).forEach(c => { const x = compute(d, r, c, cashOnly).perWeek; if (best == null || x < best) best = x; }));
    return best;
  }
  const ago = iso => {
    const k = w().ago, s = (Date.now() - Date.parse(iso)) / 60e3; if (!(s >= 0)) return '';
    return s < 60 ? fmt(k.m, { n: Math.max(1, Math.round(s)) }) : s < 48 * 60 ? fmt(k.h, { n: Math.round(s / 60) }) : fmt(k.d, { n: Math.round(s / 1440) });
  };

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
    if (x.from === 'ours') meta.push(label('oursLabel')); if (x.from === 'amber') meta.push(label('amberLabel'));
    if (o.directOnly) meta.push(k.directOnly);
    const cond = zh() ? o.conditionsZh || o.conditions : o.conditions || o.conditionsZh; if (cond) meta.push(cond);
    if (o.paid) meta.push(fmt(k.paid, { p: o.paid })); if (o.until) meta.push(fmt(k.until, { d: o.until }));
    li.append(el('small', 'oc-meta', meta.filter(Boolean).join(' · ')));
    return li;
  }
  let lastSt = {};
  function open(h, roomName, opt) {
    const k = w(); opt = opt || {};
    if (!h) return pickHome();
    const d = dataOf(h);
    const m = BT.modal({ eyebrow: k.eyebrow, title: fmt(k.heading, { home: h.name }) });
    m.box.classList.add('oc-box');
    if (!d || !d.rooms || !d.rooms.length) { m.body.append(el('p', 'bt-lede', zh() ? '这栋楼的官网价格和优惠还在整理中。订房专家可以马上帮你查。' : 'We are still collecting this building’s official prices and offers. A booking expert can check them for you now.')); footer(m, h, null, null); return; }
    const pr = prefs.get() || {};
    const st = { room: 0, cashOnly: !!pr.cashOnly, wk: opt.wk || '', weeks: opt.weeks || '' };
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
      // 三种方式
      const res = channels(d).map(c => compute(d, r, c, st.cashOnly));
      const bestNet = Math.min(...res.map(x => x.net));
      const grid = el('div', 'oc-cols');
      res.forEach(x => {
        const col = el('section', 'oc-col oc-c-' + x.channel + (x.net === bestNet && res.some(y => y.net !== bestNet) ? ' oc-top' : ''));
        const head = el('header');
        head.append(el('b', 'oc-ch', x.channel === 'official' ? k.official : x.channel === 'ours' ? label('oursLabel') : label('amberLabel')));
        if (x.channel === 'amber') head.append(el('span', 'oc-badge', 'Amber'));
        if (col.classList.contains('oc-top')) head.append(el('span', 'oc-best', '★ ' + k.best));
        col.append(head);
        const big = el('div', 'oc-big'); big.append(el('small', '', k.perWeek), el('strong', '', money(x.perWeek, 2)));
        col.append(big);
        const dl = el('dl', 'oc-sum');
        const row = (a, b, cls) => { const dt = el('dt', '', a), dd = el('dd', cls || '', b); dl.append(dt, dd); };
        row(k.gross, money(x.gross)); row(k.pay, money(x.net), 'oc-net');
        if (x.off) row('', fmt(k.save, { v: money(x.off) }), 'oc-save');
        col.append(dl);
        const ul = el('ul', 'oc-list');
        const own = x.counted.filter(y => y.from === x.channel || x.channel === 'official');
        if (x.channel !== 'official' && x.counted.some(y => y.from === 'official')) ul.append(el('li', 'oc-o inc', '✓ ' + k.officialToo + ' ' + money(x.counted.filter(y => y.from === 'official').reduce((a, y) => a + y.v, 0))));
        own.concat(x.unknown.filter(y => y.from === x.channel || x.channel === 'official')).forEach(y => ul.append(offerLine(y, r, k)));
        x.excluded.forEach(o => ul.append(el('li', 'oc-o none', '✕ ' + fmt(k.notHere, { o: t(o) }))));
        if (!ul.children.length) ul.append(el('li', 'oc-o none', x.channel === 'official' ? k.noOffer : k.same));
        col.append(ul);
        if (x.channel === 'ours' && label('oursService')) col.append(el('p', 'oc-service', '🤝 ' + label('oursService')));
        if (x.channel === 'amber' && label('amberNote')) col.append(el('p', 'oc-service', label('amberNote')));
        grid.append(col);
      });
      m.body.append(grid);
      // 合同总价怎么来的
      const how = el('p', 'oc-how'); how.append(fmt(k.grossHow, { rent: money(r.rent), w: r.weeks }));
      (d.fees || []).forEach(f => how.append(' + ' + (zh() ? f.nameZh || f.name : f.name) + ' ' + money(f.amount)));
      how.append(' = ' + money(res[0].gross));
      m.body.append(how);
      // 有条件的、福利
      const cond = [], seen = new Set();
      res.forEach(x => x.cond.forEach(y => { if (!seen.has(y.o.id)) { seen.add(y.o.id); cond.push(y); } }));
      if (cond.length) { const box = el('div', 'oc-extra'); box.append(el('b', '', k.conditional)); const ul = el('ul', 'oc-list'); cond.forEach(y => ul.append(offerLine(y, r, k))); box.append(ul); m.body.append(box); }
      const perks = []; res.forEach(x => x.perks.forEach(y => { if (!seen.has(y.o.id)) { seen.add(y.o.id); perks.push(y); } }));
      if (perks.length) m.body.append(el('p', 'oc-perks', '✨ ' + k.perks + '：' + perks.map(y => t(y.o)).join(zh() ? '、' : ', ')));
      // 别的平台
      m.body.append(platform(d, r, res, st));
      // 来源
      const src = el('p', 'oc-src');
      if (d.confirmedAt) src.append(fmt(k.checked, { d: ago(d.confirmedAt) }) + ' · ');
      src.append(k.checkedAuto);
      if (d.url) { src.append(' · '); const a = el('a', '', k.source); a.href = d.url; a.target = '_blank'; a.rel = 'noopener'; src.append(a); }
      m.body.append(src, el('p', 'bt-note', k.note));
      lastSt = { h, r, res };
      footer(m, h, r, res);
    };
    draw();
  }
  const typeOf = n => { const s = String(n || '').toLowerCase().replace(/[^a-z0-9]/g, ''); return /studio/.test(s) ? 'studio' : /nonensuite|shared/.test(s) ? 'nonensuite' : /ensuite/.test(s) ? 'ensuite' : /1bed|apartment|flat/.test(s) ? 'apartment' : ''; };

  /* 别的平台报价：按官网价拆开 */
  function platform(d, r, res, st) {
    const k = w(), box = el('details', 'oc-plat'); box.open = !!st.wk;
    box.append(el('summary', '', '✂️ ' + k.platH));
    box.append(el('p', 'bt-note', k.platLede));
    const grid = el('div', 'qc-grid'), out = el('div', 'qc-out');
    const field = (label, val, step, on) => { const f = el('label', 'qc-f'), i = el('input'); f.append(el('span', '', label)); i.type = 'number'; i.inputMode = 'decimal'; i.min = '0'; i.step = step; i.value = val; i.addEventListener('input', () => on(i.value)); f.append(i); return f; };
    grid.append(field(k.platWk, st.wk, '0.01', v => { st.wk = v; calc(); }), field(k.platWeeks, st.weeks || r.weeks, '1', v => { st.weeks = v; calc(); }));
    box.append(grid, out);
    function calc() {
      out.replaceChildren();
      const wk = parseFloat(st.wk), weeks = Math.round(parseFloat(st.weeks || r.weeks));
      if (!(wk > 0) || !(weeks > 0)) return;
      // 按学生填的周数重算官网价
      const rr = { ...r, weeks }, off = compute(d, rr, 'ours', st.cashOnly), gross = off.gross, offOfficial = off.counted.filter(y => y.from === 'official').reduce((a, y) => a + y.v, 0);
      const total = wk * weeks, sub = gross - offOfficial - total, ours = compute(d, rr, 'ours', st.cashOnly);
      const v = { v: money(Math.abs(sub)), gross: money(gross), off: money(offOfficial), wk: money(wk, 2), w: weeks };
      const card = el('div', 'qc-line' + (sub < -15 ? ' qc-warn' : ''));
      const head = el('b', 'qc-head'), p = el('p', 'qc-explain');
      const dpw = (total - ours.net) / weeks;
      const oursLine = fmt(k.oursLine, { wk: money(ours.perWeek, 2), d: money(Math.abs(dpw), 2), dir: dpw >= 0 ? k.cheaper : k.dearer });
      if (sub > 15) { head.textContent = fmt(k.platSub, v); p.textContent = fmt(k.platSubP, v) + ' ' + oursLine; }
      else if (sub < -15) { head.textContent = fmt(k.platOver, v); p.textContent = fmt(k.platOverP, v) + ' ' + oursLine; }
      else { head.textContent = k.platZero; p.textContent = fmt(k.platZeroP, { oursLine }); }
      const bar = el('div', 'qc-bar' + (sub < -15 ? ' over' : ''));
      const part = (cls, val, lab) => { if (val <= 0) return; const x = el('span', cls); x.style.flexGrow = String(val); x.append(el('i', '', lab), el('b', '', money(val))); bar.append(x); };
      part('off', offOfficial, k.bOff); if (sub > 15) part('sub', sub, k.bSub); part('pay', total, k.bPay);
      card.append(head, bar, p, el('p', 'qc-offline', fmt(k.platTotal, { v: money(total), wk: money(wk, 2), w: weeks })));
      out.append(card);
    }
    calc();
    return box;
  }

  function footer(m, h, r, res) {
    const k = w(), budget = btn('bt-link', k.budget), expert = btn('bt-btn', k.expert);
    budget.addEventListener('click', () => { BT.close(); try { window.QuoteCheck.open(null, null, 'budget'); } catch (_) { /* 没有按预算看房 */ } });
    expert.addEventListener('click', async () => {
      if (r && res) {
        const of = res[0], ou = res.find(x => x.channel === 'ours') || of;
        await BT.copy(fmt(k.sum, { home: h.name, room: r.name, w: r.weeks, g: money(of.gross), og: money(of.net), ow: money(of.perWeek, 2), ours: label('oursLabel'), ug: money(ou.net), uw: money(ou.perWeek, 2) }));
      }
      BT.close();
      try { openContact(h); } catch (_) { return; }
      if (r) BT.say(k.copied);
    });
    if (window.QuoteCheck) m.foot.append(budget);
    m.foot.append(expert);
  }

  /* 没选公寓（开场页进来）：列出已整理官网优惠的公寓 */
  function pickHome() {
    const k = w(), m = BT.modal({ eyebrow: k.eyebrow, title: k.title });
    m.body.append(el('p', 'bt-lede', k.homesWith));
    const ul = el('div', 'qc-homes');
    Object.keys(DATA.homes).map(homeById).filter(Boolean).map(h => ({ h, p: bestPerWeek(h) })).sort((a, b) => (a.p || 1e9) - (b.p || 1e9)).forEach(({ h, p }) => {
      const row = btn('qc-home'), s = el('span'); s.append(el('b', '', h.name), el('small', '', h.area || ''));
      row.append(s, el('span', 'qc-p', p ? fmt(k.miniFrom, { wk: money(p, 2) }).replace('💷 ', '') : ''));
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

  /* ?offer=公寓编号 直接打开这栋楼的价格卡（后台「在学生网站上看」用） */
  const want = new URLSearchParams(location.search).get('offer');
  if (want) setTimeout(() => { const h = homeById(want); if (h) { try { window.HomeMatch.exit(); } catch (_) { /* 没有 */ } open(h); } }, 600);

  window.OfferCard = { open, compute, bestPerWeek, data: () => DATA, setData: d => { DATA = d; source = 'preview'; }, DEMO };
})();
