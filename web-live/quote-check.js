/* 报价拆解 + 按预算看房（同一个弹窗里两页）：
   - 拆解报价：学生只填平台报的每周租金和周数，系统用这个房型的官方周租和官方返现（订房专家维护在 OFFICIAL 里）直接算出：
     平台自己补了多少、多少是官方返现（哪个平台都有）。例：£125 × 51 周 = £6,375，官方返现 £2,000，平台说每周 £79.90 → 平台自己补 £300。
   - 按预算看房：学生填全年预算、房型和周数，看预算相当于每周多少、这类房型的租金区间，以及预算内有哪些公寓。
   不收集、不公开任何平台的报价，数字只存在当前浏览器（lsm-quote-v3）。
   入口：公寓卡片「房型与照片」里每个房型下面的「✂️ 拆开这个价」价签、房型相册底部、收起状态的卡片、生活选房开场页。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, money, pick } = BT;
  const W = {
    zh: {
      title: '✂️ 报价拆解', desc: '平台说的低价里，多少是官方返现', mini: '✂️ 平台更便宜？拆开看看', tagRoom: '✂️ 拆开这个价', tagAlbum: '✂️ 拆价', intro: '✂️ 报价拆解 · 按预算看房',
      eyebrow: '订房小工具', heading: '报价拆解', tabSplit: '✂️ 拆解报价', tabBudget: '💷 按预算看房',
      splitLede: '填上平台报给你的每周租金和周数，马上告诉你：这个价格里多少是公寓官方返现（哪个平台都有），平台自己又补了多少。',
      home: '公寓', homePick: '选一处公寓', room: '房型', wk: '每周租金', weeks: '周数', perWk: '/周',
      demo: '示例数据', updated: '官方价 {d} 更新', site: '去官网核对 ↗',
      official: '官方价 {rent}/周 × {w} 周 = {g}，官方返现 {cash}', officialNone: '官方价 {rent}/周 × {w} 周 = {g}，目前没有官方返现',
      bOff: '官方返现', bSub: '平台补', bPay: '你实际付',
      rSub: '平台自己补了 {y}', rSubP: '你实际付 {pay}（每周 {wk}）。其中 {cash} 是公寓官方返现，在哪个平台订都有；平台自己补了 {y}，每周约 {yw}。',
      rZero: '平台没有自己补贴', rZeroP: '你实际付 {pay}（每周 {wk}），就是官方价扣掉官方返现，直接在公寓官网订也是这个价。',
      rOver: '比「官方价扣返现」还贵 {y}', rOverP: '你要付 {pay}（每周 {wk}）。可能没把官方返现 {cash} 全部给你，或者含了服务费。下单前问清楚：官方返现我能拿到吗？',
      fill: '填上每周租金和周数，就能看到结果', noHome: '先选一处公寓',
      note: '官方返现和平台补贴通常要入住以后才到账。数字只在这台设备上计算，我们不收集、也不公开任何平台的报价；官方价和官方返现由订房专家整理，以公寓官网为准。',
      expert: '💬 请专家帮我核对', copied: '结果已复制。进群以后粘贴给专家，专家会帮你核对。',
      sum: '【报价拆解】{home} · {room}\n官方价 {rent}/周 × {w} 周 = {g}，官方返现 {cash}\n平台报价 {wk}/周 × {w} 周 = {pay}，平台自己补 {y}',
      budgetLede: '填上全年预算和想住的房型，看看预算相当于每周多少、这类房型一般什么价，预算内有哪些公寓。',
      budget: '全年预算', roomType: '房型', any: '都可以', ensuite: '独卫单间', studio: 'Studio 套间', roomAny: '房间', nonEnsuite: '非独卫单间', oneBed: '一居室',
      noRec: '待录入', offRent: '官方周租（按官网填）', noRecNote: '这个房型的官方价还没录入，按公寓官网的价格填上就能算。',
      perWeekIs: '相当于每周 {v}', range: '{room}的租金区间：{lo} – {hi}/周', rangeN: '共 {n} 处公寓有记录',
      within: '预算内有 {n} 处', withinNone: '预算内暂时没有', cheapest: '最便宜的是 {name}，{p}/周，比你的预算每周多 {d}。',
      walk: '步行到利大约 {n} 分钟', show: '在地图上看', budgetFill: '填上全年预算，就能看到区间和预算内的公寓',
      budgetNote: '已整理官网优惠的公寓按「官网优惠后真实周价」算（每天检查官网、专家核对）；其余公寓按页面记录的历史参考价，实际花费可能更低。', realTag: '官网优惠后', refTag: '参考价',
      sep: '、'
    },
    en: {
      title: '✂️ Quote breakdown', desc: 'How much of a low price is official cashback', mini: '✂️ Cheaper elsewhere? Break it down', tagRoom: '✂️ Break down this price', tagAlbum: '✂️ Break down', intro: '✂️ Quote breakdown · Budget',
      eyebrow: 'Booking tools', heading: 'Quote breakdown', tabSplit: '✂️ Break down a quote', tabBudget: '💷 Search by budget',
      splitLede: 'Enter the weekly rent a platform quoted and the number of weeks. You will see how much of that price is the building’s official cashback, which you get on any platform, and how much the platform adds itself.',
      home: 'Home', homePick: 'Pick a home', room: 'Room type', wk: 'Weekly rent', weeks: 'Weeks', perWk: '/wk',
      demo: 'Sample data', updated: 'Official price updated {d}', site: 'Check the official site ↗',
      official: 'Official price {rent}/wk × {w} weeks = {g}, official cashback {cash}', officialNone: 'Official price {rent}/wk × {w} weeks = {g}, no official cashback right now',
      bOff: 'Official', bSub: 'Platform', bPay: 'You pay',
      rSub: 'The platform adds {y} itself', rSubP: 'You pay {pay} ({wk} a week). {cash} of the saving is the building’s official cashback, which you get on any platform; the platform itself adds {y}, about {yw} a week.',
      rZero: 'The platform adds nothing itself', rZeroP: 'You pay {pay} ({wk} a week): the official price after the official cashback, the same as booking on the building’s site.',
      rOver: '{y} above the official price after cashback', rOverP: 'You pay {pay} ({wk} a week). It may not pass on all of the {cash} official cashback, or it includes a fee. Ask before booking: do I get the official cashback?',
      fill: 'Enter the weekly rent and weeks to see the result', noHome: 'Pick a home first',
      note: 'Official cashback and platform extras are usually paid after you move in. Figures are worked out on this device only; we do not collect or publish any platform’s quotes. Official prices and cashback are kept by our booking experts; the building’s site is what counts.',
      expert: '💬 Ask an expert to check', copied: 'Your result is copied. Paste it in your group and an expert will check it.',
      sum: '[Quote breakdown] {home} · {room}\nOfficial {rent}/wk × {w} weeks = {g}, official cashback {cash}\nQuote {wk}/wk × {w} weeks = {pay}, platform adds {y}',
      budgetLede: 'Enter your budget for the year and the room type you want. You will see what that is per week, the usual price range for that room type and the homes within budget.',
      budget: 'Budget for the year', roomType: 'Room type', any: 'Any', ensuite: 'En-suite', studio: 'Studio', roomAny: 'Room', nonEnsuite: 'Non en-suite', oneBed: '1-bed flat',
      noRec: 'not recorded', offRent: 'Official weekly rent (from the building site)', noRecNote: 'The official price for this room type is not recorded yet. Enter the price from the building’s site to work it out.',
      perWeekIs: '{v} a week', range: '{room}: {lo} – {hi} a week', rangeN: '{n} homes with recorded prices',
      within: '{n} homes within budget', withinNone: 'No homes within budget yet', cheapest: 'The cheapest is {name} at {p}/wk, {d} a week over your budget.',
      walk: 'About {n} min walk to Uni of Liverpool', show: 'Show on map', budgetFill: 'Enter your budget for the year to see the range and homes',
      budgetNote: 'Homes with checked official offers use the real weekly price after those offers (official sites checked daily, confirmed by an expert); other homes use the recorded guide price and may cost less in practice.', realTag: 'after official offers', refTag: 'guide price',
      sep: ', '
    }
  };
  const w = () => pick(W);
  const data = BT.store('lsm-quote-v3');
  const num = v => { const n = parseFloat(v); return Number.isFinite(n) && n > 0 ? n : 0; };
  const homes = () => { try { return HOMES; } catch (_) { return []; } };

  /* 官方价和官方返现：正式版由订房专家维护，按公寓编号一行，房型用英文名（和「房型与照片」里的一样：En-suite / Studio / Room，或 Gold En Suite 这类）：
     'iq-great-newton-house': { weeks: 51, cashback: 2000, rent: { 'Gold En Suite': 160 }, url: 'https://公寓官网', updated: '2026-10-24' }
     没录入的公寓用页面里的历史参考价，官方返现按公寓编号生成示例（标「示例数据」）。 */
  const OFFICIAL = {};
  const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const firstNum = v => parseFloat(String(v).replace(/[^\d.]+/g, ' ').trim()) || '';   // '£160–185' → 160
  /* 房型：和卡片上「房型与照片」一样的列表 [英文名, 显示名, 参考周租] */
  function roomsOf(h) {
    const k = w();
    if (window.RoomPhotos) { const t = window.RoomPhotos.types(h); if (t.length) return t.map(x => [x.key, x.name, firstNum(x.price)]); }
    const out = [];
    if (h.pe) out.push(['En-suite', k.ensuite, h.pe]);
    if (h.ps) out.push(['Studio', k.studio, h.ps]);
    if (!out.length) out.push(['Room', k.roomAny, h.plo || '']);
    return out;
  }
  /* 拆解时可选的房型：这处公寓有记录的房型在前，再补上常见房型（没有官方价的，学生按官网价格自己填） */
  function allRooms(h) {
    const k = w(), rs = roomsOf(h), norm = x => String(x).toLowerCase().replace(/[^a-z0-9]/g, '');
    const has = word => rs.some(r => { const n = norm(r[0]); return n.includes(word) && !(word === 'ensuite' && n.includes('nonensuite')); });
    [['En-suite', k.ensuite, 'ensuite'], ['Studio', k.studio, 'studio'], ['Non en-suite', k.nonEnsuite, 'nonensuite'], ['1 Bed', k.oneBed, '1bed']]
      .forEach(([key, name, word]) => { if (!has(word)) rs.push([key, name, '']); });
    return rs;
  }
  function official(h, room, ownRent) {
    const rs = allRooms(h), r = rs.find(e => e[0] === room) || rs[0], o = OFFICIAL[h.id];
    const rent = (o && o.rent && o.rent[r[0]]) || r[2] || num(ownRent) || '';
    if (o) return { room: r[0], name: r[1], rent, recorded: !!((o.rent && o.rent[r[0]]) || r[2]), cash: o.cashback || 0, url: o.url || '', updated: o.updated || '', demo: false };
    const share = [0.1, 0.15, 0.2, 0.3][hash(h.id) % 4];
    return { room: r[0], name: r[1], rent, recorded: !!r[2], cash: rent ? Math.round(rent * 51 * share / 50) * 50 : 0, demo: true };
  }
  /* 官方价 × 学生填的周数 − 官方返现 − 学生实际付 = 平台自己补的 */
  function split(o, wk, weeks) {
    const rent = num(o.rent), n = Math.round(num(weeks)), p = num(wk), cash = num(o.cash);
    if (!rent || !n || !p) return null;
    const gross = rent * n, pay = p * n, sub = gross - cash - pay;
    return { rent, weeks: n, cash, gross, pay, sub, wk: p };
  }
  const SMALL = 15;   // 平台补贴在 £15 以内，算「没有自己补贴」（每周价四舍五入的零头）

  const BUDGET_ONLY = true;
  let tab = 'split';
  function open(h, room, which) {
    const k = w(), saved = data.get() || {};
    const only = BUDGET_ONLY;
    if (which) tab = which;
    if (only) tab = 'budget';
    const m = BT.modal({ eyebrow: k.eyebrow + (h ? ' · ' + h.name : ''), title: only ? k.tabBudget.replace(/^\S+\s/, '') : k.heading });
    const tabs = el('div', 'br-tabs'); tabs.setAttribute('role', 'tablist');
    const go = id => {
      tab = id; tabs.querySelectorAll('.br-tab').forEach(x => x.setAttribute('aria-selected', String(x.dataset.id === id)));
      m.body.replaceChildren(); m.foot.replaceChildren(); m.body.scrollTop = 0;
      if (id === 'split') drawSplit(); else drawBudget();
    };
    [['split', k.tabSplit], ['budget', k.tabBudget]].forEach(([id, label]) => {
      const b = btn('br-tab', label); b.dataset.id = id; b.setAttribute('role', 'tab'); b.addEventListener('click', () => go(id)); tabs.append(b);
    });
    if (!only) m.box.insertBefore(tabs, m.body);
    const save = patch => { const all = data.get() || {}; Object.assign(all, patch); data.set(all); };
    const numInput = (id, label, value, onInput, isMoney, step) => {
      const f = el('label', 'qc-f'), inp = el('input'); f.append(el('span', '', label));
      inp.id = id; inp.type = 'number'; inp.inputMode = 'decimal'; inp.min = '0'; inp.step = step || '0.01'; inp.value = value || '';
      inp.addEventListener('input', () => onInput(inp.value));
      if (isMoney) { const u = el('span', 'qc-unit'); u.append(inp); f.append(u); } else f.append(inp);
      return { f, inp };
    };
    const select = (id, label, opts, value, onChange) => {
      const f = el('label', 'qc-f'), s = el('select'); f.append(el('span', '', label)); s.id = id;
      opts.forEach(([v, t]) => { const o = el('option', '', t); o.value = v; s.append(o); }); s.value = value;
      s.addEventListener('change', () => onChange(s.value)); f.append(s);
      return f;
    };
    const weekChips = (inp, onPick) => {
      const c = el('div', 'br-chips qc-weekchips');
      [44, 51].forEach(n => { const b = btn('bt-chipbtn', fmt('{n} ' + (k === W.zh ? '周' : 'wks'), { n })); b.addEventListener('click', () => { inp.value = n; onPick(String(n)); }); c.append(b); });
      return c;
    };

    /* ---------- 拆解报价：每周租金 + 周数 ---------- */
    function drawSplit() {
      let home = h || homes().find(x => x.id === saved.home) || null;
      const st = { room: room || saved.room, wk: saved.wk || '', weeks: saved.weeks || 51, own: saved.own || '' };
      m.body.append(el('p', 'bt-lede', k.splitLede));
      const form = el('div', 'qc-ed'), grid = el('div', 'qc-grid'), out = el('div', 'qc-out');
      if (!h) {
        const list = homes().slice().sort((a, b) => a.name.localeCompare(b.name));
        form.append(select('qcHome', k.home, [['', k.homePick]].concat(list.map(x => [x.id, x.name])), home ? home.id : '', v => { home = homes().find(x => x.id === v) || null; st.room = ''; save({ home: v }); drawRoom(); calc(); }));
      }
      const roomSlot = el('div', 'qc-roomslot');
      form.append(roomSlot);
      const wkF = numInput('qcWk', k.wk, st.wk, v => { st.wk = v; save({ wk: v }); calc(); }, true);
      const wsF = numInput('qcWeeks', k.weeks, st.weeks, v => { st.weeks = v; save({ weeks: v }); calc(); }, false, '1');
      grid.append(wkF.f, wsF.f);
      form.append(grid, weekChips(wsF.inp, v => { st.weeks = v; save({ weeks: v }); calc(); }));
      m.body.append(form, out, el('p', 'bt-note', k.note));
      function drawRoom() {
        roomSlot.replaceChildren();
        if (!home) return;
        const rs = allRooms(home);
        if (!rs.some(r => r[0] === st.room)) st.room = rs[0][0];
        roomSlot.append(el('span', 'qc-f', k.room));
        const chips = el('div', 'br-chips'); chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', k.room);
        rs.forEach(([key, name, price]) => {
          const on = st.room === key, b = btn('bt-chipbtn' + (on ? ' on' : '') + (price ? '' : ' norec'));
          b.append(name + ' '); b.append(el('small', '', price ? money(price) : k.noRec)); b.setAttribute('aria-pressed', String(on));
          b.addEventListener('click', () => { st.room = key; save({ room: key }); drawRoom(); calc(); });
          chips.append(b);
        });
        roomSlot.append(chips);
        if (!official(home, st.room).recorded) {   // 没有官方价的房型：学生按官网价格自己填
          const own = numInput('qcOwnRent', k.offRent, st.own || '', v => { st.own = v; save({ own: v }); calc(); }, true);
          roomSlot.append(own.f, el('p', 'bt-note', k.noRecNote));
        }
      }
      let last = null;
      function calc() {
        out.replaceChildren(); last = null;
        if (!home) { out.append(el('p', 'bt-note', k.noHome)); return; }
        const o = official(home, st.room, st.own), s = split(o, st.wk, st.weeks);
        const card = el('div', 'qc-line');
        const off = el('p', 'qc-offline');
        if (o.rent && num(st.weeks)) off.append(fmt(o.cash ? k.official : k.officialNone, { rent: money(o.rent, 2), w: Math.round(num(st.weeks)), g: money(o.rent * Math.round(num(st.weeks))), cash: money(o.cash) }));
        if (o.demo) { off.append(' '); off.append(el('span', 'bt-tag demo', k.demo)); }
        if (o.updated || o.url) {
          const src = el('span', 'qc-src');
          if (o.updated) src.append(fmt(k.updated, { d: o.updated }));
          if (o.url) { const a = el('a', '', k.site); a.href = o.url; a.target = '_blank'; a.rel = 'noopener'; if (o.updated) src.append(' · '); src.append(a); }
          off.append(' '); off.append(src);
        }
        if (!s) { card.append(off, el('p', 'bt-note', k.fill)); out.append(card); return; }
        last = { s, o };
        const v = { y: money(Math.abs(s.sub)), yw: money(Math.abs(s.sub) / s.weeks, 2), wk: money(s.wk, 2), pay: money(s.pay), cash: money(s.cash) };
        const head = el('b', 'qc-head'), p = el('p', 'qc-explain');
        if (s.sub > SMALL) { head.textContent = fmt(k.rSub, v); p.textContent = fmt(k.rSubP, v); }
        else if (s.sub < -SMALL) { head.textContent = fmt(k.rOver, v); p.textContent = fmt(k.rOverP, v); card.classList.add('qc-warn'); }
        else { head.textContent = k.rZero; p.textContent = fmt(k.rZeroP, v); }
        // 色条：官方原价 = 官方返现 + 平台自己补 + 你实际付
        const bar = el('div', 'qc-bar' + (s.sub < -SMALL ? ' over' : ''));
        const part = (cls, val, label) => { if (val <= 0) return; const x = el('span', cls); x.style.flexGrow = String(val); x.title = `${label} ${money(val)}`; x.append(el('i', '', label), el('b', '', money(val))); bar.append(x); };
        part('off', s.cash, k.bOff); if (s.sub > SMALL) part('sub', s.sub, k.bSub); part('pay', s.pay, k.bPay);
        card.append(head, bar, p, off); out.append(card);
      }
      const status = el('span', 'bt-status'), expert = btn('bt-btn', k.expert);
      expert.addEventListener('click', async () => {
        if (!home) { status.textContent = k.noHome; return; }
        if (last) await BT.copy(fmt(k.sum, { home: home.name, room: last.o.name, rent: money(last.s.rent, 2), w: last.s.weeks, g: money(last.s.gross), cash: money(last.s.cash), wk: money(last.s.wk, 2), pay: money(last.s.pay), y: money(last.s.sub) }));
        BT.close();
        try { openContact(home); } catch (_) { return; }
        if (last) BT.say(k.copied);
      });
      m.foot.append(status, expert);
      drawRoom(); calc();
      if (!st.wk) setTimeout(() => wkF.inp.focus({ preventScroll: true }), 50);
    }

    /* ---------- 按预算看房：全年预算 + 房型 + 周数 ---------- */
    function drawBudget() {
      const st = { budget: saved.budget || '', type: saved.type || 'e', weeks: saved.weeks || 51 };
      m.body.append(el('p', 'bt-lede', k.budgetLede));
      const form = el('div', 'qc-ed'), grid = el('div', 'qc-grid'), out = el('div', 'qc-out');
      const bF = numInput('qcBudget', k.budget, st.budget, v => { st.budget = v; save({ budget: v }); calc(); }, true, '100');
      const wsF = numInput('qcBWeeks', k.weeks, st.weeks, v => { st.weeks = v; save({ weeks: v }); calc(); }, false, '1');
      grid.append(bF.f, select('qcType', k.roomType, [['e', k.ensuite], ['s', k.studio], ['any', k.any]], st.type, v => { st.type = v; save({ type: v }); calc(); }), wsF.f);
      form.append(grid, weekChips(wsF.inp, v => { st.weeks = v; save({ weeks: v }); calc(); }));
      m.body.append(form, out, el('p', 'bt-note', k.budgetNote));
      const ref = x => (st.type === 'e' ? x.pe : st.type === 's' ? x.ps : Math.min(...[x.pe, x.ps, x.plo].map(Number).filter(v => v > 0)));
      /* 有官网优惠数据的公寓用「官网优惠后真实周价」（offer-card.js），其余用页面记录的参考价 */
      const real = x => { try { return window.OfferCard ? window.OfferCard.realWeek(x, st.type === 'e' ? 'ensuite' : st.type === 's' ? 'studio' : '') : null; } catch (_) { return null; } };
      const priceOf = x => { const r = real(x); return r != null ? r : ref(x); };
      function calc() {
        out.replaceChildren();
        const list = homes().map(x => ({ x, p: Number(priceOf(x)), real: real(x) != null })).filter(e => Number.isFinite(e.p) && e.p > 0 && !e.x.pso).sort((a, b) => a.p - b.p);
        const budget = num(st.budget), n = Math.round(num(st.weeks));
        if (!list.length) return;
        const lo = list[0].p, hi = list[list.length - 1].p, roomLabel = st.type === 'e' ? k.ensuite : st.type === 's' ? k.studio : k.any;
        const card = el('div', 'qc-line');
        if (!budget || !n) {
          card.append(el('b', 'qc-head', fmt(k.range, { room: roomLabel, lo: money(lo), hi: money(hi) })), el('p', 'bt-note', k.budgetFill));
          out.append(card); return;
        }
        const per = budget / n, inBudget = list.filter(e => e.p <= per);
        card.append(el('b', 'qc-head', fmt(k.perWeekIs, { v: money(per, 2) })));
        // 区间条：最便宜到最贵，标出预算的位置
        const rng = el('div', 'qc-range'), track = el('div', 'qc-track'), fill = el('i'), mark = el('span', 'qc-mark');
        const pos = Math.max(0, Math.min(1, (per - lo) / Math.max(1, hi - lo)));
        fill.style.width = (pos * 100) + '%'; mark.style.left = (pos * 100) + '%'; mark.textContent = money(per);
        track.append(fill, mark);
        const ends = el('div', 'qc-ends'); ends.append(el('span', '', money(lo)), el('span', '', money(hi)));
        rng.append(el('p', 'qc-explain', fmt(k.range, { room: roomLabel, lo: money(lo), hi: money(hi) }) + ' · ' + fmt(k.rangeN, { n: list.length })), track, ends);
        card.append(rng);
        if (inBudget.length) {
          card.append(el('p', 'qc-sub', fmt(k.within, { n: inBudget.length })));
          const ul = el('div', 'qc-homes');
          inBudget.slice().reverse().slice(0, 8).forEach(({ x, p, real: isReal }) => {   // 预算内最贵的几处在前：同样的钱能住到的最好选择
            const row = btn('qc-home');
            const t = el('span'); t.append(el('b', '', x.name), el('small', '', fmt(k.walk, { n: x.uol }) + ' · ' + (isReal ? k.realTag : k.refTag)));
            row.append(t, el('span', 'qc-p' + (isReal ? ' real' : ''), money(p, isReal ? 2 : 0) + k.perWk));
            row.addEventListener('click', () => { BT.close(); try { show(x, true); } catch (_) { /* 页面还没准备好 */ } });
            ul.append(row);
          });
          card.append(ul);
        } else {
          card.append(el('p', 'qc-sub', k.withinNone), el('p', 'qc-explain', fmt(k.cheapest, { name: list[0].x.name, p: money(lo), d: money(lo - per, 2) })));
        }
        out.append(card);
      }
      calc();
      if (!st.budget) setTimeout(() => bF.inp.focus({ preventScroll: true }), 50);
    }
    go(tab);
  }

  /* 报价拆解已停用，只留「按预算看房」（BUDGET_ONLY 改成 false 可恢复旧的拆解入口） */
  if (BUDGET_ONLY) {
    BT.add({ id: 'budget', order: 2, intro: () => (BT.lang() === 'zh' ? '💷 按预算看房' : '💷 Search by budget'), open: () => open(null, null, 'budget') });
    window.QuoteCheck = { open, split, official, OFFICIAL };
    return;
  }
  BT.add({
    id: 'quote', order: 1, details: false,   // 「展开详情」里不另放一块，价签直接挂在每个房型下面
    card: () => ({ title: w().title, desc: w().desc, mini: w().mini, cls: 'qt-tag' }),
    intro: () => w().intro,
    open: h => open(h)
  });

  /* 每个房型卡片下面挂一个价签：把卡片包进 .rp-item，价签放在卡片下面（按钮里不能再套按钮） */
  const cardBody = document.getElementById('cardBody');
  function tagRooms() {
    const h = BT.homeNow(), strip = cardBody && cardBody.querySelector('.rp-strip');
    if (!h || !strip) return;
    const types = roomsOf(h);
    [...strip.children].forEach((card, i) => {
      if (!card.classList.contains('rp-card')) return;
      const item = el('div', 'rp-item'), tag = btn('qt-tag small', w().tagRoom), key = types[i] && types[i][0];
      tag.addEventListener('click', e => { e.stopPropagation(); open(h, key, 'split'); });
      card.before(item); item.append(card, tag);
    });
  }
  if (cardBody) new MutationObserver(tagRooms).observe(cardBody, { childList: true, subtree: true });
  /* 房型相册底部，「咨询这个房型」旁边 */
  const album = document.querySelector('.rp-wrap');
  if (album) new MutationObserver(() => {
    const foot = album.querySelector('.rp-afoot'), h = BT.homeNow();
    if (!foot || !h || foot.querySelector('.qt-tag')) return;
    const title = album.querySelector('.rp-atitles h3'), r = roomsOf(h).find(e => title && e[1] === title.textContent);
    const tag = btn('qt-tag small', w().tagAlbum);
    tag.addEventListener('click', () => { const x = album.querySelector('.x'); if (x) x.click(); open(h, r && r[0], 'split'); });
    foot.insertBefore(tag, foot.lastElementChild);
  }).observe(album, { childList: true });

  window.QuoteCheck = { open, split, official, OFFICIAL };
})();
