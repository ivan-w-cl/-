/* 留学一年总花费（演示）：房租 + 入住时的一次性花费 + 每月生活费，算出每月和全年要准备多少钱，
   并换算成人民币 / 日元 / 新加坡元。
   - 房租：选公寓和房型时用地图记录的起价（有官网优惠数据时用「官网优惠后真实周价」），也可以自己填。
   - 生活费默认值是利物浦学生的大致水平，只是起点，学生按自己的情况改；汇率是示例，可以改成当天汇率。
   数字只在这台设备上计算（lsm-cost-v1），不收集。
   入口：公寓卡片「展开详情」的订房小工具、生活选房开场页、按预算看房。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, money, pick } = BT;
  const T = {
    zh: {
      intro: '🧮 留学一年总花费', title: '🧮 一年总花费', desc: '房租 + 生活费，换算成人民币 / 日元 / 新元', eyebrow: '留学一年总花费', heading: '一年要准备多少钱',
      lede: '房租只是一部分。把入住时的一次性花费和每月生活费加上，看看一年总共要准备多少钱。',
      rent: '房租', home: '公寓', homePick: '自己填房租', room: '房型', ensuite: '独卫单间', studio: 'Studio', wk: '每周房租', weeks: '租约周数',
      once: '入住时一次性', deposit: '押金 / 预订费', setup: '床品、厨具等入住用品', monthly: '每月生活费', months: '按 {n} 个月算',
      food: '饮食（自己做饭为主）', transport: '交通（公交为主）', phone: '手机话费', social: '社交娱乐', study: '学习用品', other: '其他（衣物、日用品）',
      yearTotal: '一年总共', perMonth: '平均每月', rentShare: '房租占 {p}%', breakdown: '花在哪里', bRent: '房租', bLive: '生活费', bOnce: '一次性',
      cur: '换算成', rateL: '汇率：1 英镑 =', rateEdit: '改汇率', demoRate: '示例汇率，请按当天汇率修改',
      note: '生活费默认值是利物浦学生的大致水平，只是起点，请按自己的情况改。房租用地图记录的起价，以公寓官网和合同为准。',
      copy: '📋 复制这份预算', copied: '已复制', toBudget: '💷 按预算看房 ›', realTag: '官网优惠后', refTag: '参考起价',
      sum: '【留学一年总花费】{home}\n房租 {rent}（{wk}/周 × {w} 周）\n一次性 {once}，生活费 {live}（{m} 个月）\n一年总共 {total}，平均每月 {pm}\n约 {cur}'
    },
    en: {
      intro: '🧮 Yearly cost calculator', title: '🧮 Yearly cost', desc: 'Rent + living costs, in CNY / JPY / SGD', eyebrow: 'Yearly cost calculator', heading: 'How much you need for the year',
      lede: 'Rent is only part of it. Add the one-off costs when you move in and your monthly living costs to see what the whole year takes.',
      rent: 'Rent', home: 'Home', homePick: 'Enter my own rent', room: 'Room', ensuite: 'En-suite', studio: 'Studio', wk: 'Weekly rent', weeks: 'Contract weeks',
      once: 'One-off when you move in', deposit: 'Deposit / booking fee', setup: 'Bedding, kitchen kit and so on', monthly: 'Monthly living costs', months: 'over {n} months',
      food: 'Food (mostly cooking)', transport: 'Transport (mostly bus)', phone: 'Phone', social: 'Going out', study: 'Study materials', other: 'Other (clothes, toiletries)',
      yearTotal: 'Year total', perMonth: 'Per month on average', rentShare: 'Rent is {p}%', breakdown: 'Where it goes', bRent: 'Rent', bLive: 'Living', bOnce: 'One-off',
      cur: 'Show in', rateL: 'Rate: £1 =', rateEdit: 'Edit rate', demoRate: 'Sample rate; change it to today’s rate',
      note: 'Living-cost defaults are a rough guide for students in Liverpool, only a starting point; change them to suit you. Rent uses the recorded starting price; the building’s website and contract are what count.',
      copy: '📋 Copy this budget', copied: 'Copied', toBudget: '💷 Search by budget ›', realTag: 'after official offers', refTag: 'guide price',
      sum: '[Yearly cost] {home}\nRent {rent} ({wk}/wk × {w} weeks)\nOne-off {once}, living {live} ({m} months)\nYear total {total}, {pm} a month\nAbout {cur}'
    }
  };
  const k = () => pick(T), zh = () => BT.lang() === 'zh';
  const homes = () => { try { return HOMES; } catch (_) { return []; } };
  const store = BT.store('lsm-cost-v1');
  const CUR = { CNY: { sym: '¥', name: '人民币', en: 'CNY', rate: 9.2, dp: 0 }, JPY: { sym: '¥', name: '日元', en: 'JPY', rate: 200, dp: 0 }, SGD: { sym: 'S$', name: '新加坡元', en: 'SGD', rate: 1.72, dp: 0 }, GBP: { sym: '£', name: '英镑', en: 'GBP', rate: 1, dp: 0 } };
  const LIVE = [['food', 200], ['transport', 30], ['phone', 15], ['social', 80], ['study', 20], ['other', 40]];
  const defCur = () => { let l = 'zh'; try { l = LANG; } catch (_) { /* 没有 */ } return l === 'ja' ? 'JPY' : l === 'en' ? 'SGD' : 'CNY'; };
  const num = v => { const x = parseFloat(v); return Number.isFinite(x) && x >= 0 ? x : 0; };

  function rentOf(h, type) {
    if (!h) return null;
    try { const r = window.OfferCard && window.OfferCard.realWeek(h, type === 's' ? 'studio' : 'ensuite'); if (r != null) return { v: Math.round(r * 100) / 100, real: true }; } catch (_) { /* 没有价格卡 */ }
    const v = type === 's' ? h.ps : h.pe || h.plo; return v ? { v: Number(v), real: false } : null;
  }

  function open(h) {
    const K = k(), saved = store.get() || {};
    const st = { home: h ? h.id : saved.home || '', type: saved.type || 'e', wk: saved.wk || '', weeks: saved.weeks || 51, deposit: saved.deposit ?? 250, setup: saved.setup ?? 80,
      live: Object.assign(Object.fromEntries(LIVE), saved.live || {}), cur: saved.cur || defCur(), rates: Object.assign({}, saved.rates || {}) };
    const m = BT.modal({ eyebrow: K.eyebrow, title: K.heading }); m.box.classList.add('cc-box');
    const save = () => store.set({ home: st.home, type: st.type, wk: st.wk, weeks: st.weeks, deposit: st.deposit, setup: st.setup, live: st.live, cur: st.cur, rates: st.rates });
    m.body.append(el('p', 'bt-lede', K.lede));
    const f = (label, input, unit) => { const l = el('label', 'qc-f'); l.append(el('span', '', label)); if (unit) { const u = el('span', 'qc-unit'); u.append(input); l.append(u); } else l.append(input); return l; };
    const ninput = (val, on, step) => { const i = el('input'); i.type = 'number'; i.min = '0'; i.step = step || '1'; i.inputMode = 'decimal'; i.value = val; i.addEventListener('input', () => { on(i.value); save(); calc(); }); return i; };
    // 房租
    const rentBox = el('section', 'cc-sec'); rentBox.append(el('b', 'cc-h', '🏠 ' + K.rent));
    const sel = el('select'); const o0 = el('option', '', K.homePick); o0.value = ''; sel.append(o0);
    homes().slice().sort((a, b) => a.name.localeCompare(b.name)).forEach(x => { const o = el('option', '', x.name); o.value = x.id; sel.append(o); });
    sel.value = st.home;
    const type = el('select'); [['e', K.ensuite], ['s', K.studio]].forEach(([v, t]) => { const o = el('option', '', t); o.value = v; type.append(o); }); type.value = st.type;
    const wk = ninput(st.wk, v => { st.wk = v; st.home = ''; sel.value = ''; tag.textContent = ''; }, '0.01'), weeks = ninput(st.weeks, v => { st.weeks = v; });
    const tag = el('span', 'cc-tag');
    const fill = () => { const hh = homes().find(x => x.id === st.home), r = rentOf(hh, st.type); if (r) { st.wk = String(r.v); wk.value = st.wk; tag.textContent = r.real ? K.realTag : K.refTag; tag.className = 'cc-tag' + (r.real ? ' real' : ''); } else tag.textContent = ''; };
    sel.addEventListener('change', () => { st.home = sel.value; fill(); save(); calc(); });
    type.addEventListener('change', () => { st.type = type.value; fill(); save(); calc(); });
    const g1 = el('div', 'qc-grid'); g1.append(f(K.home, sel), f(K.room, type));
    const g2 = el('div', 'qc-grid'); const wkF = f(K.wk, wk, true); wkF.append(tag); g2.append(wkF, f(K.weeks, weeks));
    rentBox.append(g1, g2);
    // 一次性
    const onceBox = el('section', 'cc-sec'); onceBox.append(el('b', 'cc-h', '📦 ' + K.once));
    const g3 = el('div', 'qc-grid'); g3.append(f(K.deposit, ninput(st.deposit, v => { st.deposit = v; }), true), f(K.setup, ninput(st.setup, v => { st.setup = v; }), true));
    onceBox.append(g3);
    // 每月
    const liveBox = el('section', 'cc-sec'), monthsLbl = el('small', 'cc-months'); const lh = el('b', 'cc-h', '🍜 ' + K.monthly + ' '); lh.append(monthsLbl); liveBox.append(lh);
    const g4 = el('div', 'qc-grid cc-live'); LIVE.forEach(([key]) => g4.append(f(K[key], ninput(st.live[key], v => { st.live[key] = v; }), true))); liveBox.append(g4);
    // 结果
    const out = el('section', 'cc-out');
    m.body.append(rentBox, onceBox, liveBox, out, el('p', 'bt-note', K.note));
    if (st.home && !st.wk) fill();
    let last = null;
    function calc() {
      out.replaceChildren();
      const w = Math.round(num(st.weeks)), months = Math.max(1, Math.round(w / 4.345));
      monthsLbl.textContent = fmt(K.months, { n: months });
      const rent = num(st.wk) * w, once = num(st.deposit) + num(st.setup), live = LIVE.reduce((a, [key]) => a + num(st.live[key]), 0) * months, total = rent + once + live;
      const c = CUR[st.cur], rate = num(st.rates[st.cur] ?? c.rate) || c.rate, conv = v => c.sym + Math.round(v * rate).toLocaleString('en-GB');
      const top = el('div', 'cc-top');
      const a = el('div', 'cc-big'); a.append(el('small', '', K.yearTotal), el('strong', '', money(total)), el('span', 'cc-conv', st.cur === 'GBP' ? '' : '≈ ' + conv(total)));
      const b = el('div', 'cc-big'); b.append(el('small', '', K.perMonth), el('strong', '', money(total / months)), el('span', 'cc-conv', st.cur === 'GBP' ? '' : '≈ ' + conv(total / months)));
      top.append(a, b); out.append(top);
      // 色条
      const bar = el('div', 'qc-bar cc-bar'), part = (cls, v, l) => { if (v <= 0) return; const x = el('span', cls); x.style.flexGrow = String(v); x.append(el('i', '', l), el('b', '', money(v))); bar.append(x); };
      part('pay', rent, K.bRent); part('off', live, K.bLive); part('sub', once, K.bOnce);
      out.append(el('span', 'qc-f', K.breakdown + (total ? ' · ' + fmt(K.rentShare, { p: Math.round(rent / total * 100) }) : '')), bar);
      // 币种
      const curRow = el('div', 'br-chips'); curRow.append(el('span', 'qc-f', K.cur));
      Object.keys(CUR).forEach(x => { const bb = btn('bt-chipbtn' + (st.cur === x ? ' on' : ''), zh() ? CUR[x].name : CUR[x].en); bb.addEventListener('click', () => { st.cur = x; save(); calc(); }); curRow.append(bb); });
      out.append(curRow);
      if (st.cur !== 'GBP') {
        const rr = el('div', 'cc-rate'), ri = el('input'); ri.type = 'number'; ri.step = '0.01'; ri.min = '0'; ri.value = rate; ri.setAttribute('aria-label', K.rateEdit);
        ri.addEventListener('change', () => { st.rates[st.cur] = ri.value; save(); calc(); });
        rr.append(el('span', '', K.rateL), ri, el('span', '', zh() ? c.name : c.en), el('small', '', K.demoRate));
        out.append(rr);
      }
      const hh = homes().find(x => x.id === st.home);
      last = { home: hh ? hh.name : '—', rent: money(rent), wk: money(num(st.wk), 2), w, once: money(once), live: money(live), m: months, total: money(total), pm: money(total / months), cur: st.cur === 'GBP' ? money(total) : conv(total) };
    }
    calc();
    const cp = btn('bt-btn alt', K.copy); cp.addEventListener('click', async () => { if (last && await BT.copy(fmt(K.sum, last))) { const o = cp.textContent; cp.textContent = K.copied; setTimeout(() => { cp.textContent = o; }, 1300); } });
    const bud = btn('bt-link', K.toBudget); bud.addEventListener('click', () => { BT.close(); try { window.QuoteCheck.open(null, null, 'budget'); } catch (_) { /* 没有 */ } });
    if (window.QuoteCheck) m.foot.append(bud);
    m.foot.append(cp);
  }

  BT.add({ id: 'cost', order: 5, mini: false, card: () => ({ title: k().title, desc: k().desc }), intro: () => k().intro, open: h => open(h) });
  window.CostCalc = { open };
})();
