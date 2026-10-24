/* 报价核算器，两页：
   - 拆解一个报价：学生只填平台报给他的价格，用公寓的官方周租和官方优惠一减，剩下的就是平台自己补的部分（大多是私下给的返现），
     并提醒这部分通常要入住后才到账。官方价和官方优惠由订房专家维护在 OFFICIAL 里，没录入的公寓用历史参考价 + 示例优惠。
   - 比较几个报价：平台、官网、群里谈的报价统一算成「整个合同实际要付多少」和「真实每周价」，差别很小时提醒先订房。
   不公布、不汇总任何平台的价格，只给学生自己看。报价只存在当前浏览器（lsm-quote-v1）。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, money, pick } = BT;
  const W = {
    zh: {
      title: '🧮 报价核算器', desc: '拆开平台报价，看清谁补了多少', mini: '🧮 拆解报价', intro: '🧮 报价核算器',
      eyebrow: '订房小工具', heading: '报价核算器',
      lede: '把你拿到的报价填进来：平台、公寓官网、群里谈的都可以。这里统一算成「整个合同实际要付多少」和「真实每周价」，看清楚每家的优惠到底差多少。',
      privacy: '报价只保存在这台设备上，不会发给任何平台。算出来的是按你填的条件估算，以合同为准。',
      q: '报价 {x}', namePh: '报价 {x}：平台 / 官网 / 群里',
      rent: '周租', weeks: '合同周数', free: '免租周数', off: '公寓立减', cash: '平台返现', when: '返现什么时候到账', fees: '手续费 / 分期费', ad: '广告上写的每周价（选填）',
      upfront: '必须一次付清全部房租',
      whenSign: '签约后马上', whenMove: '入住以后', whenReview: '入住并写评价以后', whenUnsure: '不清楚',
      condMove: '要入住以后才到账', condReview: '要入住并写评价以后才到账', condUnsure: '到账时间不确定',
      remove: '删除', add: '＋ 再加一个报价', example: '看一个例子', clear: '清空',
      total: '合同总价', perWk: '真实每周 {wk} · 每周付 {rent} × {w} 周，一次性优惠合计 {d}', perWkNone: '真实每周 {wk} · 每周付 {rent} × {w} 周',
      best: '最省', fill: '填好周租和合同周数就能算',
      fCond: '⚠️ 返现 {cash} {cond}；拿不到的话，总价是 {worst}。',
      fAd: '⚠️ 广告写每周 {ad}，是把一次性优惠平摊到每周算出来的；你每周实际要付的还是 {rent}。',
      fAdLow: '⚠️ 广告写每周 {ad}，按你填的条件算下来是每周 {real}，差了 {d}。',
      fUp: '💷 要一次付清 {pay}，先确认银行卡额度和汇款时间。',
      fFee: '🧾 手续费 / 分期费 {fees} 已算进总价。',
      vEmpty: '先填至少两个报价', vEmptyP: '每个报价填周租和合同周数就能算，优惠和返现有就填。',
      vSmall: '这几个报价其实差不多',
      vSmallP: '最省和最贵相差 {d}，平均每周只差 {dw}。差这么一点，不值得为了比价一直等；热门房型放出来常常几周就订满，先把房定下来更重要。',
      vSmallPw: '按真实每周价，最多只差 {dw}。差这么一点，不值得为了比价一直等；热门房型放出来常常几周就订满，先把房定下来更重要。',
      vBig: '{name} 最省', vBigP: '比最贵的少 {d}，平均每周少 {dw}。下单前再看一眼它的条件：返现什么时候到账、要不要一次付清。',
      vBigPw: '按真实每周价，比最贵的每周少 {dw}。下单前再看一眼它的条件：返现什么时候到账、要不要一次付清。',
      vWeeks: '这几个报价的合同周数不一样，所以按「真实每周价」比较；总价还要看你实际要住多久。',
      vCondBest: '最省的报价里有还没到账的返现，拿不到的话总价是 {worst}。',
      expert: '💬 请专家帮我核对', copied: '核算结果已复制。进群以后粘贴给专家，专家会帮你核对每个报价的条件。',
      pickHome: '在地图上打开一处公寓，就能把核算结果交给这处公寓的专家。',
      sumHead: '【报价核算】{home}', sumLine: '{name}：周租 {rent} × {w} 周，合同总价 {total}，真实每周 {wk}{extra}', sumCond: '（含返现 {cash}，{cond}）',
      tabDec: '🔍 拆解一个报价', tabCmp: '⚖️ 比较几个报价',
      decLede: '把平台报给你的价格填进来。我们用公寓的官方周租和官方优惠一减，剩下的就是平台自己补的部分，大多是它私下给的返现。',
      decNoHome: '在地图上打开一处公寓，就能自动填入它的官方价；也可以自己填官方周租和官方优惠。',
      room: '房型', offRent: '官方周租', offOff: '官方优惠（整个合同）', offTag: '官方价', demoTag: '示例数据', demoOffer: '示例优惠：{name}',
      platform: '平台给你的报价', kind: '平台报的是', kindWk: '每周价', kindTotal: '合同总价', price: '平台报价', extra: '平台另外说的返现（选填）', decWhen: '平台补的钱什么时候到账',
      rGross: '官方原价', rGrossN: '{rent} × {w} 周', rOff: '公寓官方优惠', rSub: '平台自己补的', rOver: '比官方价多出', rSubIn: '其中 {a} 已经算进报价，{e} 是另外的返现', rPay: '你最后实际付', rWk: '真实每周 {wk}',
      hSub: '平台自己补了约 {y}', hSubP: '约每周 {yw}。这部分不是公寓降价：你每周付给公寓的还是 {rent}，差价一般是平台事后返给你的，{cond}。没到账的话，你实际要付 {worst}。',
      hZero: '平台没有额外补贴', hZeroP: '这个报价就是官方价加官方优惠，和直接在公寓官网订差不多。',
      hOver: '这个报价比官方价还高 {y}', hOverP: '可能含了服务费，或者房型、合同周数、入住日期不一样，先核对一下再决定。',
      condSign: '签约后就到账',
      toCompare: '＋ 加入比较', decName: '拆解的报价', decFill: '填好官方周租、合同周数和平台报价就能拆解',
      decNote: '拆解只在这台设备上计算，我们不收集、也不公开任何平台的报价。官方价和官方优惠由订房专家整理（演示里是示例数据），以公寓官网为准；房型、合同周数或入住日期不一样，结果会不准。',
      sumDec: '【报价拆解】{home} · {room}\n官方周租 {rent} × {w} 周 = {g}，官方优惠 {off}\n平台报价 {p}{ex}\n平台自己补了约 {y}，我最后实际付 {f}（真实每周 {wk}）',
      sumEx: '，另外返现 {e}', offerNames: ['早鸟立减', '新生优惠', '限时立减'],
      ensuite: '独卫单间', studio: 'Studio 套间', roomAny: '房间',
      exNames: ['平台 A', '平台 B', '公寓官网'], anyHome: '还没选公寓'
    },
    en: {
      title: '🧮 Quote check', desc: 'See who pays for each discount', mini: '🧮 Break down a quote', intro: '🧮 Quote check',
      eyebrow: 'Booking tools', heading: 'Quote check',
      lede: 'Add the quotes you have been given: from a platform, the building’s own site or a group chat. They are turned into what the whole contract really costs and the real price per week, so you can see how far apart the offers actually are.',
      privacy: 'Quotes stay on this device and are not sent to any platform. Figures are estimates from what you enter; the contract is what counts.',
      q: 'Quote {x}', namePh: 'Quote {x}: platform / building site / chat',
      rent: 'Rent per week', weeks: 'Contract weeks', free: 'Rent-free weeks', off: 'Building discount', cash: 'Platform cashback', when: 'When the cashback is paid', fees: 'Fees / instalment charges', ad: 'Weekly price in the ad (optional)',
      upfront: 'Whole rent must be paid up front',
      whenSign: 'Right after signing', whenMove: 'After moving in', whenReview: 'After moving in and a review', whenUnsure: 'Not sure',
      condMove: 'is only paid after you move in', condReview: 'is only paid after you move in and leave a review', condUnsure: 'has no clear payment date',
      remove: 'Remove', add: '＋ Add a quote', example: 'See an example', clear: 'Clear',
      total: 'Contract total', perWk: 'Real {wk}/wk · you pay {rent} × {w} weeks, one-off savings {d}', perWkNone: 'Real {wk}/wk · you pay {rent} × {w} weeks',
      best: 'Lowest', fill: 'Add the weekly rent and contract weeks',
      fCond: '⚠️ The {cash} cashback {cond}. Without it the total is {worst}.',
      fAd: '⚠️ The ad says {ad}/wk because one-off savings are spread across the weeks. You still pay {rent} every week.',
      fAdLow: '⚠️ The ad says {ad}/wk, but with these terms it works out at {real}/wk, {d} more.',
      fUp: '💷 {pay} has to be paid in one go. Check your card limit and transfer times first.',
      fFee: '🧾 Fees of {fees} are included in the total.',
      vEmpty: 'Add at least two quotes', vEmptyP: 'Weekly rent and contract weeks are enough; add discounts and cashback if there are any.',
      vSmall: 'These quotes are almost the same',
      vSmallP: 'The lowest and highest are {d} apart, only {dw} a week. That is not worth waiting for: popular rooms often sell out within weeks of release, so securing the room matters more.',
      vSmallPw: 'On the real weekly price they are at most {dw} apart. That is not worth waiting for: popular rooms often sell out within weeks of release, so securing the room matters more.',
      vBig: '{name} is the lowest', vBigP: '{d} less than the highest, {dw} a week. Before booking, check its terms: when the cashback is paid and whether you must pay up front.',
      vBigPw: 'On the real weekly price it is {dw} a week less than the highest. Before booking, check its terms: when the cashback is paid and whether you must pay up front.',
      vWeeks: 'These quotes have different contract lengths, so they are compared on the real weekly price. The total also depends on how long you need to stay.',
      vCondBest: 'The lowest quote relies on cashback you have not received yet. Without it the total is {worst}.',
      expert: '💬 Ask an expert to check', copied: 'Your quote check is copied. Paste it in your group and an expert will check the terms of each quote.',
      pickHome: 'Open a home on the map to send your quote check to its expert.',
      sumHead: '[Quote check] {home}', sumLine: '{name}: {rent}/wk × {w} weeks, total {total}, real {wk}/wk{extra}', sumCond: ' (includes {cash} cashback that {cond})',
      tabDec: '🔍 Break down a quote', tabCmp: '⚖️ Compare quotes',
      decLede: 'Enter the price a platform quoted you. We take off the building’s official weekly rent and official discount; what is left is what the platform adds itself, usually its own cashback.',
      decNoHome: 'Open a home on the map to fill in its official price automatically, or enter the official rent and discount yourself.',
      room: 'Room type', offRent: 'Official weekly rent', offOff: 'Official discount (whole contract)', offTag: 'Official price', demoTag: 'Sample data', demoOffer: 'Sample offer: {name}',
      platform: 'The platform’s quote', kind: 'The quote is', kindWk: 'Per week', kindTotal: 'Contract total', price: 'Quoted price', extra: 'Extra cashback they mention (optional)', decWhen: 'When the platform pays its part',
      rGross: 'Official price', rGrossN: '{rent} × {w} weeks', rOff: 'Official building discount', rSub: 'Added by the platform', rOver: 'Above the official price', rSubIn: '{a} is already in the quote, {e} is extra cashback', rPay: 'You actually pay', rWk: 'Real {wk}/wk',
      hSub: 'The platform adds about {y} itself', hSubP: 'About {yw} a week. The building is not cutting the rent: you still pay it {rent} a week, and the platform usually pays the difference back later; it {cond}. If it never arrives you pay {worst}.',
      hZero: 'The platform adds nothing extra', hZeroP: 'This quote is the official price with the official discount, about the same as booking on the building’s site.',
      hOver: 'This quote is {y} above the official price', hOverP: 'It may include a service fee, or a different room type, contract length or move-in date. Check before you decide.',
      condSign: 'is paid once you sign',
      toCompare: '＋ Add to comparison', decName: 'Broken-down quote', decFill: 'Add the official rent, contract weeks and the quoted price',
      decNote: 'The breakdown is worked out on this device only; we do not collect or publish any platform’s quotes. Official prices and discounts are kept by our booking experts (sample data in this demo); the building’s site is what counts. A different room type, contract length or move-in date makes the result inaccurate.',
      sumDec: '[Quote breakdown] {home} · {room}\nOfficial rent {rent} × {w} weeks = {g}, official discount {off}\nPlatform quote {p}{ex}\nThe platform adds about {y}; I actually pay {f} (real {wk}/wk)',
      sumEx: ', plus {e} cashback', offerNames: ['Early-bird discount', 'New-student offer', 'Limited-time discount'],
      ensuite: 'En-suite', studio: 'Studio', roomAny: 'Room',
      exNames: ['Platform A', 'Platform B', 'Building site'], anyHome: 'No home picked yet'
    }
  };
  const w = () => pick(W);
  const ABC = 'ABC';
  const data = BT.store('lsm-quote-v1');
  const num = v => { const n = parseFloat(v); return Number.isFinite(n) && n > 0 ? n : 0; };
  const guide = h => (h ? Number(h.pe || h.plo || h.ps) || '' : '');
  const blank = (h, i) => ({ name: '', rent: i === 0 ? guide(h) : '', weeks: 51, free: '', off: '', cash: '', when: 'move', fees: '', ad: '', upfront: false });
  const rec = h => { const r = (data.get() || {})[h ? h.id : '_']; return Array.isArray(r) ? { list: r } : (r || {}); };   // 旧版只存了比较列表
  const put = (h, patch) => { const all = data.get() || {}; all[h ? h.id : '_'] = Object.assign(rec(h), patch); data.set(all); };
  const load = h => { const l = rec(h).list; return Array.isArray(l) && l.length ? l : [blank(h, 0), blank(h, 1)]; };
  const save = (h, list) => put(h, { list });

  /* 官方价和官方优惠：正式版由订房专家维护，例如
     'iq-great-newton-house': { weeks: 51, ensuite: 160, studio: 0, offer: { amount: 150, zh: '早鸟立减', en: 'Early-bird discount' } }
     没录入的公寓用页面里的历史参考价，优惠按公寓编号生成示例（标「示例数据」）。 */
  const OFFICIAL = {};
  const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  function roomsOf(h) {
    const k = w(), out = [];
    if (h.pe) out.push(['ensuite', k.ensuite, h.pe]);
    if (h.ps) out.push(['studio', k.studio, h.ps]);
    if (!out.length) out.push(['room', k.roomAny, h.plo || '']);
    return out;
  }
  function official(h, room) {
    const k = w(), o = OFFICIAL[h.id], x = hash(h.id), r = roomsOf(h).find(e => e[0] === room) || roomsOf(h)[0];
    if (o) return { room: r[0], rent: o[r[0]] || r[2], weeks: o.weeks || 51, off: o.offer ? o.offer.amount : 0, offerName: o.offer ? pick(o.offer) : '', demo: false };
    const amount = [0, 100, 150, 200][x % 4];
    return { room: r[0], rent: r[2], weeks: 51, off: amount, offerName: amount ? k.offerNames[(x >>> 3) % 3] : '', demo: true };
  }
  /* 拆解：官方原价 − 官方优惠 − 平台报价 = 平台自己补的（报价里已经算进去的部分 + 另外的返现） */
  function decompose(d) {
    const rent = num(d.rent), weeks = Math.round(num(d.weeks)), price = num(d.price);
    if (!rent || !weeks || !price) return null;
    const gross = rent * weeks, off = num(d.off), quoted = d.kind === 'total' ? price : price * weeks, extra = num(d.extra);
    const inQuote = gross - off - quoted, sub = inQuote + extra, pay = quoted - extra;
    return { rent, weeks, gross, off, quoted, extra, inQuote, sub, pay, wk: pay / weeks, worst: gross - off };
  }
  function example(h) {
    const k = w(), base = Math.round(Number(h && (h.pe || h.plo || h.ps))) || 185;
    return [
      { name: k.exNames[0], rent: base, weeks: 51, free: '', off: '', cash: 300, when: 'move', fees: '', ad: base - 6, upfront: false },
      { name: k.exNames[1], rent: base + 2, weeks: 51, free: 1, off: '', cash: 100, when: 'sign', fees: '', ad: '', upfront: false },
      { name: k.exNames[2], rent: base - 3, weeks: 51, free: '', off: 150, cash: '', when: 'sign', fees: '', ad: '', upfront: true }
    ];
  }

  /* 一个报价的真实成本 */
  function calc(q) {
    const rent = num(q.rent), weeks = Math.round(num(q.weeks));
    if (!rent || !weeks) return null;
    const gross = rent * weeks, free = rent * Math.min(num(q.free), weeks), off = num(q.off), cash = num(q.cash), fees = num(q.fees);
    const total = gross - free - off - cash + fees, cond = cash > 0 && q.when !== 'sign';
    return { rent, weeks, gross, oneOff: free + off + cash, cash, fees, total, wk: total / weeks, worst: cond ? total + cash : total, cond, pay: gross - free - off + fees, ad: num(q.ad) };
  }
  const condText = (k, q) => ({ move: k.condMove, review: k.condReview, unsure: k.condUnsure })[q.when] || k.condUnsure;
  const nameOf = (k, q, i) => (q.name || '').trim() || fmt(k.q, { x: ABC[i] });
  function flags(k, q, r) {
    const out = [];
    if (r.cond) out.push(fmt(k.fCond, { cash: money(r.cash), cond: condText(k, q), worst: money(r.worst) }));
    if (r.ad) {
      if (r.ad < r.wk - 1.5) out.push(fmt(k.fAdLow, { ad: money(r.ad, 2), real: money(r.wk, 2), d: money(r.wk - r.ad, 2) }));
      else if (r.ad < r.rent - 0.5) out.push(fmt(k.fAd, { ad: money(r.ad, 2), rent: money(r.rent, 2) }));
    }
    if (q.upfront) out.push(fmt(k.fUp, { pay: money(r.pay) }));
    if (r.fees) out.push(fmt(k.fFee, { fees: money(r.fees) }));
    return out;
  }

  function drawCompare(h, m, k) {
    let list = load(h);
    const lede = el('p', 'bt-lede', k.lede), verdict = el('div', 'qc-verdict'), sum = el('div', 'qc-sum'), eds = el('div', 'qc-sum');
    const acts = el('div', 'qc-actions');
    const addB = btn('bt-btn alt', k.add), exB = btn('bt-link', k.example), clrB = btn('bt-link', k.clear);
    acts.append(addB, exB, clrB);
    m.body.append(lede, verdict, sum, eds, acts, el('p', 'bt-note', k.privacy));
    const status = el('span', 'bt-status');
    const expert = btn('bt-btn', k.expert);
    m.foot.append(status, expert);

    function field(label, q, key, type, opts) {
      const f = el('label', 'qc-f'); f.append(el('span', '', label));
      let inp;
      if (type === 'select') {
        inp = el('select'); opts.forEach(([v, t]) => { const o = el('option', '', t); o.value = v; inp.append(o); }); inp.value = q[key];
      } else {
        inp = el('input'); inp.type = 'number'; inp.inputMode = 'decimal'; inp.min = '0'; inp.step = key === 'weeks' || key === 'free' ? '1' : '0.01'; inp.value = q[key];
      }
      inp.addEventListener('input', () => { q[key] = inp.value; changed(); });
      if (type === 'money') { const u = el('span', 'qc-unit'); u.append(inp); f.append(u); } else f.append(inp);
      return f;
    }
    function drawEditors() {
      eds.replaceChildren();
      list.forEach((q, i) => {
        const box = el('div', 'qc-ed'), top = el('div', 'qc-edtop'), nm = el('input');
        nm.value = q.name; nm.placeholder = fmt(k.namePh, { x: ABC[i] }); nm.maxLength = 30; nm.setAttribute('aria-label', fmt(k.q, { x: ABC[i] }));
        nm.addEventListener('input', () => { q.name = nm.value; changed(); });
        top.append(nm);
        if (list.length > 1) { const rm = btn('bt-link', k.remove); rm.addEventListener('click', () => { list.splice(i, 1); drawEditors(); changed(); }); top.append(rm); }
        const g = el('div', 'qc-grid');
        g.append(field(k.rent, q, 'rent', 'money'), field(k.weeks, q, 'weeks'), field(k.free, q, 'free'), field(k.off, q, 'off', 'money'),
          field(k.cash, q, 'cash', 'money'), field(k.when, q, 'when', 'select', [['sign', k.whenSign], ['move', k.whenMove], ['review', k.whenReview], ['unsure', k.whenUnsure]]),
          field(k.fees, q, 'fees', 'money'), field(k.ad, q, 'ad', 'money'));
        const up = el('label', 'qc-check'), cb = el('input'); cb.type = 'checkbox'; cb.checked = !!q.upfront;
        cb.addEventListener('change', () => { q.upfront = cb.checked; changed(); });
        up.append(cb, el('span', '', k.upfront));
        box.append(top, g, up); eds.append(box);
      });
      addB.disabled = list.length >= 3;
    }
    function drawResults() {
      const rs = list.map(calc), ok = rs.map((r, i) => ({ r, i })).filter(x => x.r);
      sum.replaceChildren(); verdict.className = 'qc-verdict';
      const sameWeeks = ok.length && ok.every(x => x.r.weeks === ok[0].r.weeks);
      const best = ok.length >= 2 ? ok.reduce((a, b) => (b.r.wk < a.r.wk ? b : a)) : null;
      list.forEach((q, i) => {
        const r = rs[i], line = el('div', 'qc-line' + (best && best.i === i ? ' qc-best' : ''));
        const nm = el('span', 'qc-name', nameOf(k, q, i));
        if (best && best.i === i) { nm.append(' '); nm.append(el('span', 'bt-tag good', k.best)); }
        if (!r) { line.append(nm, el('span', 'qc-wk', k.fill)); sum.append(line); return; }
        line.append(nm, el('span', 'qc-total', money(r.total)));
        line.append(el('span', 'qc-wk', fmt(r.oneOff ? k.perWk : k.perWkNone, { wk: money(r.wk, 2), rent: money(r.rent, 2), w: r.weeks, d: money(r.oneOff) })));
        const fl = flags(k, q, r);
        if (fl.length) { const box = el('div', 'qc-flags'); fl.forEach(t => box.append(el('p', '', t))); line.append(box); }
        sum.append(line);
      });
      verdict.replaceChildren();
      if (ok.length < 2) { verdict.classList.add('empty'); verdict.append(el('b', '', k.vEmpty), el('p', '', k.vEmptyP)); return; }
      const worst = ok.reduce((a, b) => (b.r.wk > a.r.wk ? b : a)), dw = worst.r.wk - best.r.wk, d = worst.r.total - best.r.total;
      const v = { d: money(d), dw: money(dw, 2), name: nameOf(k, list[best.i], best.i) };
      if (dw <= 5) verdict.append(el('b', '', k.vSmall), el('p', '', fmt(sameWeeks ? k.vSmallP : k.vSmallPw, v)));
      else { verdict.classList.add('big'); verdict.append(el('b', '', fmt(k.vBig, v)), el('p', '', fmt(sameWeeks ? k.vBigP : k.vBigPw, v))); }
      if (!sameWeeks) verdict.append(el('p', '', k.vWeeks));
      if (best.r.cond) verdict.append(el('p', '', fmt(k.vCondBest, { worst: money(best.r.worst) })));
    }
    function changed() { save(h, list); drawResults(); }
    function summary() {
      const lines = [fmt(k.sumHead, { home: h ? h.name : k.anyHome })];
      list.forEach((q, i) => {
        const r = calc(q); if (!r) return;
        lines.push(fmt(k.sumLine, { name: nameOf(k, q, i), rent: money(r.rent, 2), w: r.weeks, total: money(r.total), wk: money(r.wk, 2),
          extra: r.cond ? fmt(k.sumCond, { cash: money(r.cash), cond: condText(k, q) }) : '' }));
      });
      const v = verdict.querySelector('b'); if (v) lines.push(v.textContent);
      return lines.join('\n');
    }
    addB.addEventListener('click', () => { if (list.length < 3) { list.push(blank(h, list.length)); drawEditors(); changed(); } });
    exB.addEventListener('click', () => { list = example(h); drawEditors(); changed(); m.body.scrollTo({ top: 0, behavior: 'smooth' }); });
    clrB.addEventListener('click', () => { list = [blank(h, 0), blank(h, 1)]; drawEditors(); changed(); });
    expert.addEventListener('click', async () => {
      if (!h) { status.textContent = k.pickHome; return; }
      await BT.copy(summary());
      BT.close();
      try { openContact(h); } catch (_) { return; }
      BT.say(k.copied);
    });
    drawEditors(); drawResults();
  }

  function drawDecompose(h, m, k, go) {
    const r0 = rec(h), base = h ? official(h, r0.dec && r0.dec.room) : null;
    const d = Object.assign({ room: base ? base.room : '', rent: base ? base.rent : '', weeks: base ? base.weeks : 51, off: base ? base.off : '', kind: 'wk', price: '', extra: '', when: 'move' }, r0.dec || {});
    m.body.append(el('p', 'bt-lede', k.decLede));
    if (!h) m.body.append(el('p', 'bt-note', k.decNoHome));
    const offBox = el('div', 'qc-ed'), pBox = el('div', 'qc-ed'), out = el('div', 'qc-sum');
    const mk = (label, key, type) => {
      const f = el('label', 'qc-f'), inp = el('input'); f.append(el('span', '', label));
      inp.type = 'number'; inp.inputMode = 'decimal'; inp.min = '0'; inp.step = key === 'weeks' ? '1' : '0.01'; inp.value = d[key];
      inp.addEventListener('input', () => { d[key] = inp.value; changed(); });
      if (type === 'money') { const u = el('span', 'qc-unit'); u.append(inp); f.append(u); } else f.append(inp);
      return f;
    };
    const tagRow = el('div', 'br-facts');
    function drawOfficial() {
      offBox.replaceChildren();
      const top = el('div', 'qc-edtop'); top.append(el('b', 'qc-name', k.offTag)); offBox.append(top);
      const g = el('div', 'qc-grid');
      if (h) {
        const f = el('label', 'qc-f'), sel = el('select'); f.append(el('span', '', k.room));
        roomsOf(h).forEach(([id, label, price]) => { const o = el('option', '', price ? `${label} · ${money(price)}` : label); o.value = id; sel.append(o); });
        sel.value = d.room || roomsOf(h)[0][0];
        sel.addEventListener('change', () => { const b = official(h, sel.value); Object.assign(d, { room: b.room, rent: b.rent, weeks: b.weeks, off: b.off }); drawOfficial(); changed(); });
        f.append(sel); g.append(f);
      }
      g.append(mk(k.weeks, 'weeks'), mk(k.offRent, 'rent', 'money'), mk(k.offOff, 'off', 'money'));
      offBox.append(g);
      tagRow.replaceChildren();
      if (base && base.demo) { tagRow.append(el('span', 'bt-tag demo', k.demoTag)); const b = official(h, d.room); if (b.offerName) tagRow.append(el('span', 'bt-tag', fmt(k.demoOffer, { name: b.offerName }))); }
      if (tagRow.childNodes.length) offBox.append(tagRow);
    }
    function drawPlatform() {
      const top = el('div', 'qc-edtop'); top.append(el('b', 'qc-name', k.platform)); pBox.append(top);
      const seg = el('div', 'br-chips'); seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', k.kind);
      [['wk', k.kindWk], ['total', k.kindTotal]].forEach(([v, t]) => {
        const b = btn('bt-chipbtn' + (d.kind === v ? ' on' : ''), t); b.setAttribute('aria-pressed', String(d.kind === v));
        b.addEventListener('click', () => { d.kind = v; seg.querySelectorAll('.bt-chipbtn').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); }); changed(); });
        seg.append(b);
      });
      const g = el('div', 'qc-grid'), wf = el('label', 'qc-f'), ws = el('select');
      wf.append(el('span', '', k.decWhen));
      [['sign', k.whenSign], ['move', k.whenMove], ['review', k.whenReview], ['unsure', k.whenUnsure]].forEach(([v, t]) => { const o = el('option', '', t); o.value = v; ws.append(o); });
      ws.value = d.when; ws.addEventListener('change', () => { d.when = ws.value; changed(); }); wf.append(ws);
      g.append(mk(k.price, 'price', 'money'), mk(k.extra, 'extra', 'money'), wf);
      pBox.append(el('span', 'qc-f', k.kind), seg, g);
    }
    const roomName = () => { if (!h) return ''; const r = roomsOf(h).find(e => e[0] === d.room) || roomsOf(h)[0]; return r[1]; };
    const condOf = () => (d.when === 'sign' ? k.condSign : condText(k, d));
    function drawOut() {
      out.replaceChildren();
      const r = decompose(d);
      if (!r) { const v = el('div', 'qc-verdict empty'); v.append(el('b', '', k.decFill)); out.append(v); return null; }
      const v = el('div', 'qc-verdict' + (r.sub > 20 ? ' big' : r.sub < -20 ? ' warn' : ''));
      const vals = { y: money(Math.abs(r.sub)), yw: money(Math.abs(r.sub) / r.weeks, 2), rent: money(r.rent, 2), cond: condOf(), worst: money(r.worst) };
      if (r.sub > 20) v.append(el('b', '', fmt(k.hSub, vals)), el('p', '', fmt(k.hSubP, vals)));
      else if (r.sub < -20) v.append(el('b', '', fmt(k.hOver, vals)), el('p', '', k.hOverP));
      else v.append(el('b', '', k.hZero), el('p', '', k.hZeroP));
      const line = el('div', 'qc-line'), rows = el('div', 'qc-break');
      const row = (a, b, cls, note) => { const x = el('div', 'qc-brow' + (cls ? ' ' + cls : '')), t = el('span', '', a); if (note) t.append(el('small', '', note)); x.append(t, el('b', '', b)); rows.append(x); };
      row(k.rGross, money(r.gross), '', fmt(k.rGrossN, { rent: money(r.rent, 2), w: r.weeks }));
      if (r.off) row(k.rOff, '− ' + money(r.off), 'minus');
      if (Math.abs(r.sub) >= 1) row(r.sub > 0 ? k.rSub : k.rOver, (r.sub > 0 ? '− ' : '+ ') + money(Math.abs(r.sub)), r.sub > 0 ? 'minus hi' : 'plus', r.extra ? fmt(k.rSubIn, { a: money(r.inQuote), e: money(r.extra) }) : '');
      row(k.rPay, money(r.pay), 'total', fmt(k.rWk, { wk: money(r.wk, 2) }));
      line.append(rows); out.append(v, line);
      return r;
    }
    let last = null;
    function changed() { put(h, { dec: d }); last = drawOut(); toCmp.disabled = !last; }
    drawOfficial(); drawPlatform();
    m.body.append(offBox, pBox, out, el('p', 'bt-note', k.decNote));
    const status = el('span', 'bt-status'), toCmp = btn('bt-btn alt', k.toCompare), expert = btn('bt-btn', k.expert);
    toCmp.addEventListener('click', () => {
      if (!last) return;
      // 留下学生自己填过的报价（没动过的空白报价不要），再放上这次拆解的；不够两个就加一个「公寓官网直订」作对照
      const touched = q => calc(q) && ((q.name || '').trim() || num(q.off) || num(q.cash) || num(q.free) || num(q.fees));
      const list = load(h).filter(touched), name = k.decName + (roomName() ? ' · ' + roomName() : '');
      list.unshift({ name, rent: last.rent, weeks: last.weeks, free: '', off: last.off, cash: last.sub > 0 ? Math.round(last.sub * 100) / 100 : '', when: d.when, fees: last.sub < 0 ? Math.round(-last.sub * 100) / 100 : '', ad: d.kind === 'wk' ? d.price : '', upfront: false });
      if (list.length < 2) list.push({ name: k.exNames[2], rent: last.rent, weeks: last.weeks, free: '', off: last.off, cash: '', when: 'sign', fees: '', ad: '', upfront: false });
      save(h, list.slice(0, 3));
      go('cmp');
    });
    expert.addEventListener('click', async () => {
      if (!h) { status.textContent = k.pickHome; return; }
      if (last) await BT.copy(fmt(k.sumDec, { home: h.name, room: roomName(), rent: money(last.rent, 2), w: last.weeks, g: money(last.gross), off: money(last.off),
        p: d.kind === 'wk' ? money(num(d.price), 2) + (k === W.zh ? '/周' : '/wk') : money(last.quoted), ex: last.extra ? fmt(k.sumEx, { e: money(last.extra) }) : '',
        y: money(last.sub), f: money(last.pay), wk: money(last.wk, 2) }));
      BT.close();
      try { openContact(h); } catch (_) { return; }
      if (last) BT.say(k.copied);
    });
    m.foot.append(status, toCmp, expert);
    last = drawOut(); toCmp.disabled = !last;
  }

  let mode = 'dec';
  function open(h, which) {
    const k = w(); if (which) mode = which;
    const m = BT.modal({ eyebrow: k.eyebrow + (h ? ' · ' + h.name : ''), title: k.heading });
    const tabs = el('div', 'br-tabs'); tabs.setAttribute('role', 'tablist');
    const go = id => {
      mode = id; tabs.querySelectorAll('.br-tab').forEach(x => x.setAttribute('aria-selected', String(x.dataset.id === id)));
      m.body.replaceChildren(); m.foot.replaceChildren(); m.body.scrollTop = 0;
      if (id === 'dec') drawDecompose(h, m, k, go); else drawCompare(h, m, k);
    };
    [['dec', k.tabDec], ['cmp', k.tabCmp]].forEach(([id, label]) => {
      const b = btn('br-tab', label); b.dataset.id = id; b.setAttribute('role', 'tab'); b.addEventListener('click', () => go(id)); tabs.append(b);
    });
    m.box.insertBefore(tabs, m.body);
    go(mode);
  }

  BT.add({
    id: 'quote', order: 1,
    card: () => ({ title: w().title, desc: w().desc, mini: w().mini }),
    intro: () => w().intro,
    open
  });
  window.QuoteCheck = { open, calc, decompose, OFFICIAL };
})();
