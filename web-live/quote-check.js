/* 报价核算器：学生把拿到的报价（平台、公寓官网、群里谈的都可以）填进来，统一算成「整个合同实际要付多少」和「真实每周价」。
   不公布任何平台的价格，也不排「谁最便宜」：只帮学生看懂一次性返现、免租周、立减被平摊到每周以后的真实差别，
   差别很小时提醒先订房，别为了几镑一直比价。报价只存在当前浏览器（lsm-quote-v1）。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, money, pick } = BT;
  const W = {
    zh: {
      title: '🧮 报价核算器', desc: '把几个报价算成真实总价', mini: '🧮 算真实价格', intro: '🧮 报价核算器',
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
      exNames: ['平台 A', '平台 B', '公寓官网'], anyHome: '还没选公寓'
    },
    en: {
      title: '🧮 Quote check', desc: 'Turn quotes into the real total', mini: '🧮 Real price', intro: '🧮 Quote check',
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
      exNames: ['Platform A', 'Platform B', 'Building site'], anyHome: 'No home picked yet'
    }
  };
  const w = () => pick(W);
  const ABC = 'ABC';
  const data = BT.store('lsm-quote-v1');
  const num = v => { const n = parseFloat(v); return Number.isFinite(n) && n > 0 ? n : 0; };
  const guide = h => (h ? Number(h.pe || h.plo || h.ps) || '' : '');
  const blank = (h, i) => ({ name: '', rent: i === 0 ? guide(h) : '', weeks: 51, free: '', off: '', cash: '', when: 'move', fees: '', ad: '', upfront: false });
  const load = h => { const all = data.get() || {}, list = all[h ? h.id : '_']; return Array.isArray(list) && list.length ? list : [blank(h, 0), blank(h, 1)]; };
  const save = (h, list) => { const all = data.get() || {}; all[h ? h.id : '_'] = list; data.set(all); };
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

  function open(h) {
    const k = w(); let list = load(h);
    const m = BT.modal({ eyebrow: k.eyebrow + (h ? ' · ' + h.name : ''), title: k.heading });
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

  BT.add({
    id: 'quote', order: 1,
    card: () => ({ title: w().title, desc: w().desc, mini: w().mini }),
    intro: () => w().intro,
    open
  });
  window.QuoteCheck = { open, calc };
})();
