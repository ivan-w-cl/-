/* 报价拆解：平台常说「每周只要 £79.9」，可这里面大部分优惠往往是公寓官方的返现，在哪个平台订都有。
   例：£125/周 × 51 周 = £6,375，公寓官方返现 £2,000，平台自己补 £300 → 学生付 £4,075，平台说成「每周 £79.9」。
   学生只填平台说的每周价，这里用公寓的官方周租、合同周数和官方返现（订房专家维护在 OFFICIAL 里）拆成「官方返现 + 平台自己补的」，
   多拆几个平台，就看得出每家自己到底补了多少。不收集、不公开任何平台的报价，数字只存在当前浏览器（lsm-quote-v2）。
   入口：公寓卡片「房型与照片」里每个房型下面一个「✂️ 拆开这个价」价签、房型相册底部、收起状态的卡片、生活选房开场页。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, money, pick } = BT;
  const W = {
    zh: {
      title: '✂️ 报价拆解', desc: '平台说的低价里，多少是官方返现', mini: '✂️ 平台更便宜？拆开看看', tagRoom: '✂️ 拆开这个价', tagAlbum: '✂️ 拆价', intro: '✂️ 报价拆解',
      updated: '官方价 {d} 更新', site: '去官网核对 ↗',
      eyebrow: '订房小工具', heading: '报价拆解',
      lede: '平台说「每周只要 £79.9」，其中大部分优惠往往是公寓官方的返现，在哪个平台订都有。把平台报的每周价填进来，看看它自己到底补了多少。',
      offH: '公寓官方价（每个平台都一样）', rent: '官方周租', weeks: '合同周数', cash: '官方返现（整个合同）', edit: '修改', done: '完成', demo: '示例数据',
      gross: '原价', grossN: '{rent}/周 × {w} 周', offCash: '官方返现', net: '扣掉官方返现', netN: '相当于每周 {wk}',
      platH: '平台报给你的价格', namePh: '平台 {x}', wk: '平台说每周只要', perWk: '/周',
      add: '＋ 再拆一个平台', remove: '删除', example: '看例子', fill: '填上平台说的每周价，就能拆开',
      bOff: '官方返现', bSub: '平台补', bPay: '你实际付',
      rSub: '{name} 自己补了 {y}', rSubP: '每周 {wk} 里，有 {offw} 是官方返现折下来的，哪个平台都有；{name} 自己只补了每周 {yw}。',
      rZero: '{name} 没有自己补贴', rZeroP: '每周 {wk} 就是官方价扣掉官方返现，直接在公寓官网订也是这个价。',
      rOver: '{name} 比「官方价扣返现」还贵 {y}', rOverP: '可能没把官方返现 {off} 全部给你，或者含了服务费。下单前问清楚：官方返现我能拿到吗？',
      vOne: '你看到的优惠里，{off} 是公寓官方给的', vOneP: '官方返现在哪个平台订都有。{name} 自己补的是 {y}，每周约 {yw}。',
      vMulti: '几个平台自己补的：{list}', vMultiP: '最多和最少只差 {d}，每周约 {dw}。官方返现 {off} 哪个平台都有，真正的差别就只有这一点。',
      note: '官方返现和平台补贴通常要入住以后才到账，下单前问清楚什么时候、怎么到账。数字只在这台设备上计算，我们不收集、也不公开任何平台的报价；官方价和官方返现由订房专家整理，以公寓官网为准。',
      expert: '💬 请专家帮我核对', copied: '拆解结果已复制。进群以后粘贴给专家，专家会帮你核对。', pickHome: '在地图上打开一处公寓，就能自动填入它的官方价。',
      sumHead: '【报价拆解】{home} · {room}', sumOff: '官方：{rent}/周 × {w} 周 = {g}，官方返现 {off}，扣完 {net}（每周 {netw}）', sumRow: '{name}：每周 {wk}，平台自己补 {y}',
      offerless: '这处公寓目前没有官方返现', ensuite: '独卫单间', studio: 'Studio 套间', roomAny: '房间', sep: '、'
    },
    en: {
      title: '✂️ Quote breakdown', desc: 'How much of a low price is official cashback', mini: '✂️ Cheaper elsewhere? Break it down', tagRoom: '✂️ Break down this price', tagAlbum: '✂️ Break down', intro: '✂️ Quote breakdown',
      updated: 'Official price updated {d}', site: 'Check the official site ↗',
      eyebrow: 'Booking tools', heading: 'Quote breakdown',
      lede: 'A platform says “only £79.90 a week”, but most of that saving is often the building’s official cashback, which you get on any platform. Enter the weekly price the platform quoted to see how much it really adds itself.',
      offH: 'Official price (the same on every platform)', rent: 'Official weekly rent', weeks: 'Contract weeks', cash: 'Official cashback (whole contract)', edit: 'Edit', done: 'Done', demo: 'Sample data',
      gross: 'Full price', grossN: '{rent}/wk × {w} weeks', offCash: 'Official cashback', net: 'After official cashback', netN: '{wk} a week',
      platH: 'What platforms quoted you', namePh: 'Platform {x}', wk: 'Platform says per week', perWk: '/wk',
      add: '＋ Break down another platform', remove: 'Remove', example: 'Example', fill: 'Enter the weekly price the platform quoted',
      bOff: 'Official', bSub: 'Platform', bPay: 'You pay',
      rSub: '{name} adds {y} itself', rSubP: 'Of the {wk} a week, {offw} comes from the official cashback, which you get anywhere; {name} itself only adds {yw} a week.',
      rZero: '{name} adds nothing itself', rZeroP: '{wk} a week is just the official price after the official cashback, the same as booking on the building’s site.',
      rOver: '{name} is {y} above the official price after cashback', rOverP: 'It may not be passing on all of the {off} official cashback, or it includes a fee. Ask before booking: do I get the official cashback?',
      vOne: '{off} of the saving you see comes from the building', vOneP: 'You get the official cashback on any platform. {name} itself adds {y}, about {yw} a week.',
      vMulti: 'What each platform adds itself: {list}', vMultiP: 'The most and least are only {d} apart, about {dw} a week. The {off} official cashback comes with every platform; this is the only real difference.',
      note: 'Official cashback and platform extras are usually paid after you move in, so ask when and how before booking. Figures are worked out on this device only; we do not collect or publish any platform’s quotes. Official prices and cashback are kept by our booking experts; the building’s site is what counts.',
      expert: '💬 Ask an expert to check', copied: 'Your breakdown is copied. Paste it in your group and an expert will check it.', pickHome: 'Open a home on the map to fill in its official price automatically.',
      sumHead: '[Quote breakdown] {home} · {room}', sumOff: 'Official: {rent}/wk × {w} weeks = {g}, official cashback {off}, leaving {net} ({netw}/wk)', sumRow: '{name}: {wk}/wk, platform adds {y}',
      offerless: 'No official cashback at this home right now', ensuite: 'En-suite', studio: 'Studio', roomAny: 'Room', sep: ', '
    }
  };
  const w = () => pick(W);
  const ABC = 'ABC';
  const data = BT.store('lsm-quote-v2');
  const num = v => { const n = parseFloat(v); return Number.isFinite(n) && n > 0 ? n : 0; };

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
  function official(h, room) {
    const r = roomsOf(h).find(e => e[0] === room) || roomsOf(h)[0], o = OFFICIAL[h.id];
    if (o) return { room: r[0], rent: (o.rent && o.rent[r[0]]) || r[2], weeks: o.weeks || 51, cash: o.cashback || 0, url: o.url || '', updated: o.updated || '', demo: false };
    const weeks = 51, share = [0.1, 0.15, 0.2, 0.3][hash(h.id) % 4];
    return { room: r[0], rent: r[2], weeks, cash: r[2] ? Math.round(r[2] * weeks * share / 50) * 50 : 0, demo: true };
  }
  /* 平台说每周 wk → 学生实际付 wk × 周数；平台自己补的 = 官方价扣掉官方返现 − 学生实际付 */
  function split(o, wk) {
    const rent = num(o.rent), weeks = Math.round(num(o.weeks)), cash = num(o.cash), p = num(wk);
    if (!rent || !weeks || !p) return null;
    const gross = rent * weeks, net = gross - cash, pay = p * weeks, sub = net - pay;
    return { rent, weeks, cash, gross, net, pay, sub, wk: p };
  }
  const SMALL = 15;   // 平台补贴在 £15 以内，算「没有自己补贴」（每周价四舍五入的零头）

  function open(h, room) {
    const k = w(), saved = (data.get() || {})[h ? h.id : '_'] || {};
    if (h && room && room !== saved.room) Object.assign(saved, { room, edited: false });   // 从某个房型的价签点进来，就拆这个房型
    const base = h ? official(h, saved.room) : { room: '', rent: '', weeks: 51, cash: '', demo: false };
    const st = Object.assign({ room: base.room, rent: base.rent, weeks: base.weeks, cash: base.cash, rows: [{ name: '', wk: '' }], edit: !h }, saved);
    if (h && !roomsOf(h).some(e => e[0] === st.room)) st.room = base.room;
    if (h && !st.edited) Object.assign(st, { rent: base.rent, weeks: base.weeks, cash: base.cash });   // 没改过就跟着专家维护的官方价走
    const save = () => { const all = data.get() || {}; all[h ? h.id : '_'] = st; data.set(all); };
    const roomName = () => { if (!h) return ''; const r = roomsOf(h).find(e => e[0] === st.room) || roomsOf(h)[0]; return r[1]; };

    const m = BT.modal({ eyebrow: k.eyebrow + (h ? ' · ' + h.name : ''), title: k.heading });
    const offBox = el('div', 'qc-ed'), sumRows = el('div', 'qc-break'), verdict = el('div', 'qc-verdict'), rowsBox = el('div', 'qc-sum');
    m.body.append(el('p', 'bt-lede', k.lede), offBox, verdict, rowsBox);
    const acts = el('div', 'qc-actions'), addB = btn('bt-btn alt', k.add), exB = btn('bt-link', k.example);
    acts.append(addB, exB);
    m.body.append(acts, el('p', 'bt-note', k.note));
    const status = el('span', 'bt-status'), expert = btn('bt-btn', k.expert);
    m.foot.append(status, expert);

    const input = (label, key, isMoney) => {
      const f = el('label', 'qc-f'), inp = el('input'); f.append(el('span', '', label));
      inp.type = 'number'; inp.inputMode = 'decimal'; inp.min = '0'; inp.step = key === 'weeks' ? '1' : '0.01'; inp.value = st[key];
      inp.addEventListener('input', () => { st[key] = inp.value; st.edited = true; changed(); });
      if (isMoney) { const u = el('span', 'qc-unit'); u.append(inp); f.append(u); } else f.append(inp);
      return f;
    };
    /* 官方价：平时只显示算式，点「修改」才出现输入框 */
    function drawOfficial() {
      offBox.replaceChildren();
      const top = el('div', 'qc-edtop'); top.append(el('b', 'qc-name', k.offH));
      if (base.demo && !st.edited) top.append(el('span', 'bt-tag demo', k.demo));
      const eb = btn('bt-link', st.edit ? k.done : k.edit); eb.addEventListener('click', () => { st.edit = !st.edit; save(); drawOfficial(); });
      top.append(eb); offBox.append(top);
      if (h && roomsOf(h).length > 1) {
        const chips = el('div', 'br-chips');
        roomsOf(h).forEach(([id, label]) => {
          const b = btn('bt-chipbtn' + (st.room === id ? ' on' : ''), label); b.setAttribute('aria-pressed', String(st.room === id));
          b.addEventListener('click', () => { const o = official(h, id); Object.assign(st, { room: id, rent: o.rent, weeks: o.weeks, cash: o.cash, edited: false }); save(); drawOfficial(); changed(); });
          chips.append(b);
        });
        offBox.append(chips);
      }
      if (st.edit) { const g = el('div', 'qc-grid'); g.append(input(k.rent, 'rent', true), input(k.weeks, 'weeks'), input(k.cash, 'cash', true)); offBox.append(g); }
      offBox.append(sumRows); drawOfficialSum();
      if (h && (base.updated || base.url)) {   // 专家录入的官方价：显示更新日期和官网链接，学生可以自己核对
        const src = el('p', 'bt-note qc-src');
        if (base.updated) src.append(fmt(k.updated, { d: base.updated }));
        if (base.url) { const a = el('a', '', k.site); a.href = base.url; a.target = '_blank'; a.rel = 'noopener'; if (base.updated) src.append(' · '); src.append(a); }
        offBox.append(src);
      }
    }
    function drawOfficialSum() {
      sumRows.replaceChildren();
      const rent = num(st.rent), weeks = Math.round(num(st.weeks)), cash = num(st.cash);
      if (!rent || !weeks) return;
      const row = (a, b, cls, note) => { const x = el('div', 'qc-brow' + (cls ? ' ' + cls : '')), t = el('span', '', a); if (note) t.append(el('small', '', note)); x.append(t, el('b', '', b)); sumRows.append(x); };
      row(k.gross, money(rent * weeks), '', fmt(k.grossN, { rent: money(rent, 2), w: weeks }));
      if (cash) row(k.offCash, '− ' + money(cash), 'minus'); else sumRows.append(el('p', 'bt-note', k.offerless));
      row(k.net, money(rent * weeks - cash), 'total', fmt(k.netN, { wk: money((rent * weeks - cash) / weeks, 2) }));
    }
    /* 每个平台一张卡：名字 + 每周价 → 一条拆开的色条 + 一句话 */
    function drawRows() {
      rowsBox.replaceChildren(el('p', 'br-sub', k.platH));
      st.rows.forEach((r, i) => {
        const box = el('div', 'qc-line qc-plat'), head = el('div', 'qc-edtop'), nm = el('input');
        nm.value = r.name; nm.placeholder = fmt(k.namePh, { x: ABC[i] }); nm.maxLength = 24; nm.setAttribute('aria-label', fmt(k.namePh, { x: ABC[i] }));
        nm.addEventListener('input', () => { r.name = nm.value; changed(); });
        head.append(nm);
        if (st.rows.length > 1) { const rm = btn('bt-link', k.remove); rm.addEventListener('click', () => { st.rows.splice(i, 1); save(); drawRows(); }); head.append(rm); }
        const f = el('label', 'qc-f qc-wkf'), u = el('span', 'qc-unit'), inp = el('input');
        inp.type = 'number'; inp.inputMode = 'decimal'; inp.min = '0'; inp.step = '0.01'; inp.value = r.wk;
        inp.addEventListener('input', () => { r.wk = inp.value; changed(); });
        u.append(inp); f.append(el('span', '', k.wk), u, el('small', '', k.perWk));
        const res = el('div', 'qc-res'); res.dataset.i = i;
        box.append(head, f, res); rowsBox.append(box);
      });
      addB.disabled = st.rows.length >= 3;
      drawResults();
    }
    const nameOf = (r, i) => (r.name || '').trim() || fmt(k.namePh, { x: ABC[i] });
    function drawResults() {
      const done = [];
      st.rows.forEach((r, i) => {
        const res = rowsBox.querySelector(`.qc-res[data-i="${i}"]`); if (!res) return;
        res.replaceChildren();
        const s = split(st, r.wk);
        if (!s) { res.append(el('p', 'bt-note', k.fill)); return; }
        done.push({ s, name: nameOf(r, i) });
        const v = { name: nameOf(r, i), y: money(Math.abs(s.sub)), yw: money(Math.abs(s.sub) / s.weeks, 2), wk: money(s.wk, 2), offw: money(s.cash / s.weeks, 2), off: money(s.cash) };
        // 色条：原价 = 官方返现 + 平台自己补 + 你实际付
        const bar = el('div', 'qc-bar' + (s.sub < -SMALL ? ' over' : ''));
        const part = (cls, val, label) => { if (val <= 0) return; const x = el('span', cls); x.style.flexGrow = String(val); x.title = `${label} ${money(val)}`; x.append(el('i', '', label), el('b', '', money(val))); bar.append(x); };
        part('off', s.cash, k.bOff);
        if (s.sub > SMALL) part('sub', s.sub, k.bSub);
        part('pay', s.pay, k.bPay);
        const say = el('div', 'qc-say');
        if (s.sub > SMALL) say.append(el('b', '', fmt(k.rSub, v)), el('p', '', fmt(k.rSubP, v)));
        else if (s.sub < -SMALL) say.append(el('b', '', fmt(k.rOver, v)), el('p', '', fmt(k.rOverP, v)));
        else say.append(el('b', '', fmt(k.rZero, v)), el('p', '', fmt(k.rZeroP, v)));
        res.append(bar, say);
      });
      verdict.replaceChildren(); verdict.hidden = !done.length || !num(st.cash) || (done.length === 1 && done[0].s.sub < -SMALL);   // 只有一个报价且比官方价还贵时，卡片里那句话就够了
      if (verdict.hidden) return;
      const off = money(num(st.cash));
      if (done.length === 1) {
        const d = done[0], y = Math.max(0, d.s.sub);
        verdict.append(el('b', '', fmt(k.vOne, { off })), el('p', '', fmt(k.vOneP, { off, name: d.name, y: money(y), yw: money(y / d.s.weeks, 2) })));
      } else {
        const subs = done.map(d => Math.max(0, d.s.sub)), hi = Math.max(...subs), lo = Math.min(...subs);
        verdict.append(el('b', '', fmt(k.vMulti, { list: done.map((d, i) => `${d.name} ${money(subs[i])}`).join(k.sep) })),
          el('p', '', fmt(k.vMultiP, { off, d: money(hi - lo), dw: money((hi - lo) / done[0].s.weeks, 2) })));
      }
    }
    function changed() { save(); drawOfficialSum(); drawResults(); }
    addB.addEventListener('click', () => {
      if (st.rows.length >= 3) return;
      st.rows.push({ name: '', wk: '' }); save(); drawRows();
      const ins = rowsBox.querySelectorAll('.qc-wkf input'); ins[ins.length - 1].focus();
    });
    // 例子：£125 × 51 周 = £6,375，官方返现 £2,000；平台 A 说每周 £79.90（自己补 £300），平台 B 说每周 £70.10（自己补 £800）
    exB.addEventListener('click', () => {
      Object.assign(st, { rent: 125, weeks: 51, cash: 2000, edited: true, rows: [{ name: fmt(k.namePh, { x: 'A' }), wk: '79.90' }, { name: fmt(k.namePh, { x: 'B' }), wk: '70.10' }] });
      save(); drawOfficial(); drawRows(); m.body.scrollTo({ top: 0, behavior: 'smooth' });
    });
    expert.addEventListener('click', async () => {
      if (!h) { status.textContent = k.pickHome; return; }
      const rent = num(st.rent), weeks = Math.round(num(st.weeks)), cash = num(st.cash);
      const lines = [fmt(k.sumHead, { home: h.name, room: roomName() })];
      if (rent && weeks) lines.push(fmt(k.sumOff, { rent: money(rent, 2), w: weeks, g: money(rent * weeks), off: money(cash), net: money(rent * weeks - cash), netw: money((rent * weeks - cash) / weeks, 2) }));
      st.rows.forEach((r, i) => { const s = split(st, r.wk); if (s) lines.push(fmt(k.sumRow, { name: nameOf(r, i), wk: money(s.wk, 2), y: money(s.sub) })); });
      await BT.copy(lines.join('\n'));
      BT.close();
      try { openContact(h); } catch (_) { return; }
      BT.say(k.copied);
    });
    drawOfficial(); drawRows();
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
      tag.addEventListener('click', e => { e.stopPropagation(); open(h, key); });
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
    tag.addEventListener('click', () => { const x = album.querySelector('.x'); if (x) x.click(); open(h, r && r[0]); });
    foot.insertBefore(tag, foot.lastElementChild);
  }).observe(album, { childList: true });
  window.QuoteCheck = { open, split, official, OFFICIAL };
})();
