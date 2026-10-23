/* 开订提醒与订房资料卡：帮学生「抢到房」，但不做自动抢房。
   - 开订提醒：关注一处公寓的房型，开订、放房或降价时通知（正式版由服务器统一查看官网和合作方房态，通过专家群 / 小程序消息发出；
     演示里开订时间是按公寓生成的示例数据，可以点「模拟一次放房通知」看效果）。
   - 订房资料卡：护照拼音姓名、生日、入住日期等提前填好，每一项一键复制，开订当天直接粘到官网表格里；不填护照号和银行卡号。
   - 开订当天：一步步的流程和英国 / 北京时差，最后的提交和付款由学生自己点，专家在群里陪着。
   数据只存在当前浏览器（lsm-ready-v1）。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, money, pick } = BT;
  const W = {
    zh: {
      title: '🔔 开订提醒 · 资料卡', desc: '放房就通知你，提前备好资料', mini: '🔔 关注开订', miniOn: '🔔 已关注开订', intro: '🔔 开订提醒与订房资料卡',
      eyebrow: '订房小工具', heading: '帮你抢到房', tabWatch: '🔔 开订提醒', tabCard: '🪪 订房资料卡', tabDay: '⏱ 开订当天',
      demo: '示例数据', openNow: '27/28 学年已开订', openAt: '27/28 学年预计 {when} 开订', sellOut: '往年热门房型约 {n} 周内订满',
      watchRooms: '想关注的房型', any: '都可以', via: '通知方式', viaGroup: '专家群（推荐）', viaMp: '小程序消息', viaMail: '邮件',
      watch: '🔔 关注开订', update: '✓ 保存修改', unwatch: '取消关注', watching: '已关注：{rooms} · 通过{via}通知你', simulate: '演示：模拟一次放房通知',
      watchHow: '正式版由我们的服务器统一查看公寓官网和合作平台的房态，几分钟一次；开订、放房或降价时通过你选的方式通知你，不用自己一直刷网页。',
      mine: '我的关注', none: '还没有关注任何公寓。在地图上打开一处公寓，点「开订提醒 · 资料卡」就能关注。', show: '查看', pickHome: '在地图上打开一处公寓，就能关注它的开订时间。',
      cardLede: '开订那一刻最花时间的是填表。把这些先填好，到时候每一项点「复制」，粘到公寓官网的表格里就行。',
      cardSafe: '为了安全，这里不填护照号和银行卡号，开订当天在官网直接填。资料只保存在这台设备上，不会上传。',
      plugin: '电脑版浏览器插件（规划中）：在公寓官网一键填入这些资料；最后的「提交」和「付款」仍由你自己点，不会替你自动下单。',
      ready: '已准备 {n}/{m}', copy: '复制', copied: '已复制', copyAll: '复制全部资料', copiedAll: '全部资料已复制', clear: '清空资料',
      checks: '订房前要准备好', f: {
        family: '姓（护照拼音）', given: '名（护照拼音）', dob: '出生日期', nation: '国籍', email: '邮箱', phone: '手机（含国家区号）', uni: '学校', course: '专业',
        year: '学位 / 年级', movein: '入住日期', moveout: '退房日期', guarantor: '担保方式', emergency: '紧急联系人（姓名 + 电话）' },
      ph: { family: 'ZHANG', given: 'SAN', nation: '中国', email: 'name@example.com', phone: '+86 138 0000 0000', uni: '利物浦大学', course: '例：计算机科学', year: '例：硕士一年级', emergency: '例：张父 +86 139 0000 0000' },
      guar: [['', '请选择'], ['uk', '英国担保人'], ['service', '担保服务公司'], ['prepay', '预付全部房租'], ['unsure', '还没想好']],
      list: { offer: '录取通知书或 CAS', passport: '护照照片页扫描件（PDF 或照片）', guar: '担保方案已确定', card: '能付英镑的银行卡，额度够付定金', account: '公寓官网账号已注册，能正常登录', room: '已确定房型、合同周数和预算上限', quote: '报价已经核算过（报价核算器）' },
      dayLede: '开订当天照着这个顺序来。最后的提交和付款由你自己点；遇到问题马上在专家群里发截图。',
      tz: '时差：英国冬令时（10 月最后一个周日到 3 月最后一个周日）比北京晚 8 小时，夏令时晚 7 小时。比如英国上午 10:00 开订，冬天是北京时间 18:00。',
      steps: [
        ['开订前 3 天', '资料和清单都备齐', '资料卡填完、清单全部打勾；在官网注册账号并试一次登录；和专家确认房型、合同周数和预算上限。'],
        ['开订前 1 天', '确认准确时间', '问清楚开订的英国时间，换算成北京时间，定两个闹钟；确认银行卡已开通境外支付。'],
        ['开订前 30 分钟', '提前登录', '电脑和手机都打开官网并登录；打开这张资料卡准备复制；在专家群里说一声「我准备好了」。'],
        ['开订那一刻', '先选房，再填表', '先选房型和合同周数，再用资料卡一项项复制；页面卡住或报错，马上截图发到群里，专家帮你判断。'],
        ['提交并付定金', '由你自己确认', '核对房型、周数和总价后，自己点提交和付款；付款成功的页面截图保存。'],
        ['收到确认邮件', '交给专家核对', '把确认邮件截图发给专家，核对合同、入住日期和返现条件。']
      ],
      dayExpert: '💬 开订当天请专家陪我订',
      toastT: '{home} · {room} 开订了', toastP: '演示通知：正式版通过{via}发给你。你的订房资料已准备 {n}/{m}。', toastDay: '打开开订步骤', toastCard: '看资料卡',
      months: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'], when: '{y} 年 {m}',
      ensuite: '独卫单间', studio: 'Studio 套间', room: '房间', perWk: '/周', sep: '、'
    },
    en: {
      title: '🔔 Release alerts · Booking card', desc: 'Get told when rooms go live, with your details ready', mini: '🔔 Watch releases', miniOn: '🔔 Watching', intro: '🔔 Release alerts & booking card',
      eyebrow: 'Booking tools', heading: 'Get the room you want', tabWatch: '🔔 Release alerts', tabCard: '🪪 Booking card', tabDay: '⏱ Release day',
      demo: 'Sample data', openNow: '27/28 bookings are open', openAt: '27/28 bookings expected to open in {when}', sellOut: 'Popular rooms sold out within about {n} weeks in past years',
      watchRooms: 'Rooms to watch', any: 'Any', via: 'Tell me by', viaGroup: 'Expert group (recommended)', viaMp: 'Mini program message', viaMail: 'Email',
      watch: '🔔 Watch releases', update: '✓ Save changes', unwatch: 'Stop watching', watching: 'Watching: {rooms} · we will tell you by {via}', simulate: 'Demo: simulate a release alert',
      watchHow: 'In the live version our server checks the building sites and partner platforms every few minutes, so you don’t have to keep refreshing. When bookings open, rooms are released or prices drop, you hear about it the way you chose.',
      mine: 'Watching', none: 'You are not watching any homes yet. Open a home on the map and tap “Release alerts · Booking card”.', show: 'Show', pickHome: 'Open a home on the map to watch when its bookings open.',
      cardLede: 'Filling in forms is what takes longest when bookings open. Fill these in now; on the day, tap Copy on each line and paste it into the building’s form.',
      cardSafe: 'For safety there is no passport number or card number here: enter those on the building’s site on the day. Your details stay on this device and are not uploaded.',
      plugin: 'Desktop browser extension (planned): fill these details into the building’s site in one tap. You still press Submit and Pay yourself; it never books for you.',
      ready: '{n}/{m} ready', copy: 'Copy', copied: 'Copied', copyAll: 'Copy all details', copiedAll: 'All details copied', clear: 'Clear details',
      checks: 'Have these ready before booking', f: {
        family: 'Surname (as on passport)', given: 'Given names (as on passport)', dob: 'Date of birth', nation: 'Nationality', email: 'Email', phone: 'Mobile (with country code)', uni: 'University', course: 'Course',
        year: 'Level / year', movein: 'Move-in date', moveout: 'Move-out date', guarantor: 'Guarantor', emergency: 'Emergency contact (name + phone)' },
      ph: { family: 'ZHANG', given: 'SAN', nation: 'China', email: 'name@example.com', phone: '+86 138 0000 0000', uni: 'University of Liverpool', course: 'e.g. Computer Science', year: 'e.g. MSc, year 1', emergency: 'e.g. Parent +86 139 0000 0000' },
      guar: [['', 'Choose'], ['uk', 'UK guarantor'], ['service', 'Guarantor service'], ['prepay', 'Pay all rent up front'], ['unsure', 'Not decided yet']],
      list: { offer: 'Offer letter or CAS', passport: 'Scan of your passport photo page (PDF or photo)', guar: 'Guarantor sorted', card: 'A card that can pay in pounds, with enough limit for the deposit', account: 'Account on the building’s site, and you can log in', room: 'Room type, contract weeks and budget limit decided', quote: 'Quotes checked (Quote check)' },
      dayLede: 'Follow these steps on release day. You press Submit and Pay yourself; if anything goes wrong, send a screenshot to your expert group straight away.',
      tz: 'Time difference: in UK winter time (last Sunday of October to last Sunday of March) Beijing is 8 hours ahead; in summer time it is 7 hours. A 10:00 UK release in winter is 18:00 in Beijing.',
      steps: [
        ['3 days before', 'Get everything ready', 'Finish the booking card and tick the checklist; register on the building’s site and test your login; confirm room type, contract weeks and budget limit with your expert.'],
        ['1 day before', 'Confirm the exact time', 'Find out the UK release time, convert it to your time zone and set two alarms; make sure your card works for overseas payments.'],
        ['30 minutes before', 'Log in early', 'Open the site on both laptop and phone and log in; open this booking card ready to copy; tell your expert group you are ready.'],
        ['When bookings open', 'Pick the room, then fill in', 'Choose the room type and contract weeks first, then copy your details line by line. If the page freezes or errors, screenshot it to the group and your expert will help.'],
        ['Submit and pay the deposit', 'You confirm it', 'Check room, weeks and total, then press Submit and Pay yourself; save a screenshot of the payment confirmation.'],
        ['Confirmation email', 'Let your expert check it', 'Send a screenshot of the email to your expert to check the contract, move-in date and any cashback terms.']
      ],
      dayExpert: '💬 Ask an expert to book with me',
      toastT: '{home} · {room} bookings are open', toastP: 'Demo alert: in the live version this comes by {via}. Your booking details are {n}/{m} ready.', toastDay: 'Release-day steps', toastCard: 'Booking card',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], when: '{m} {y}',
      ensuite: 'En-suite', studio: 'Studio', room: 'Room', perWk: '/wk', sep: ', '
    }
  };
  const w = () => pick(W);
  const db = BT.store('lsm-ready-v1');
  const state = () => { const s = db.get() || {}; return { watch: s.watch || {}, card: s.card || {}, checks: s.checks || {} }; };
  const save = s => db.set(s);
  const homes = () => { try { return HOMES; } catch (_) { return []; } };
  const FIELDS = ['family', 'given', 'dob', 'nation', 'email', 'phone', 'uni', 'course', 'year', 'movein', 'moveout', 'guarantor', 'emergency'];
  const NEED = ['family', 'given', 'dob', 'nation', 'email', 'phone', 'course', 'movein', 'guarantor'];   // 进度条按这几项和清单算
  const CHECKS = ['offer', 'passport', 'guar', 'card', 'account', 'room', 'quote'];
  const progress = s => ({ n: NEED.filter(f => String(s.card[f] || '').trim()).length + CHECKS.filter(c => s.checks[c]).length, m: NEED.length + CHECKS.length });

  /* 示例开订时间：按公寓编号生成，固定不变；正式版由订房专家维护 */
  function release(h) {
    const x = [...h.id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const m = [10, 11, 11, 12, 1][x % 5];
    return { m, y: m >= 10 ? 2026 : 2027, weeks: 2 + (x >>> 4) % 6, open: m === 10 };
  }
  const releaseText = (k, r) => (r.open ? k.openNow : fmt(k.openAt, { when: fmt(k.when, { y: r.y, m: k.months[r.m - 1] }) }));
  function rooms(h) {
    const k = w(), out = [];
    if (h.pe) out.push({ id: 'ensuite', label: `${k.ensuite} ${money(h.pe)}${k.perWk}` });
    if (h.ps) out.push({ id: 'studio', label: `${k.studio} ${money(h.ps)}${k.perWk}` });
    if (!out.length && h.plo) out.push({ id: 'room', label: `${k.room} ${money(h.plo)}${k.perWk}` });
    out.push({ id: 'any', label: k.any });
    return out;
  }
  const roomNames = (h, ids) => { const k = w(); return ids.map(id => (id === 'any' ? k.any : k[id] || id)).join(k.sep); };
  const viaName = (k, v) => ({ group: k.viaGroup, mp: k.viaMp, mail: k.viaMail })[v] || k.viaGroup;

  let tab = 'watch';
  function open(h, which) {
    const k = w();
    if (which) tab = which;
    const m = BT.modal({ eyebrow: k.eyebrow + (h ? ' · ' + h.name : ''), title: k.heading });
    const tabs = el('div', 'br-tabs'); tabs.setAttribute('role', 'tablist');
    [['watch', k.tabWatch], ['card', k.tabCard], ['day', k.tabDay]].forEach(([id, label]) => {
      const b = btn('br-tab', label); b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(tab === id));
      b.addEventListener('click', () => { tab = id; tabs.querySelectorAll('.br-tab').forEach(x => x.setAttribute('aria-selected', String(x === b))); draw(); });
      tabs.append(b);
    });
    m.box.insertBefore(tabs, m.body);
    function draw() {
      m.body.replaceChildren(); m.foot.replaceChildren(); m.body.scrollTop = 0;
      ({ watch: drawWatch, card: drawCard, day: drawDay })[tab](h, m, k);
    }
    draw();
  }

  function drawWatch(h, m, k) {
    const s = state();
    if (h) {
      const r = release(h), card = el('div', 'br-card paper'), mine = s.watch[h.id];
      card.append(el('h4', '', h.name));
      const facts = el('div', 'br-facts');
      facts.append(el('span', 'bt-tag' + (r.open ? ' good' : ''), releaseText(k, r)), el('span', 'bt-tag', fmt(k.sellOut, { n: r.weeks })), el('span', 'bt-tag demo', k.demo));
      card.append(facts);
      const sel = { rooms: mine ? mine.rooms.slice() : [], via: mine ? mine.via : 'group' };
      card.append(el('p', 'br-sub', k.watchRooms));
      const rc = el('div', 'br-chips');
      rooms(h).forEach(o => {
        const b = btn('bt-chipbtn' + (sel.rooms.includes(o.id) ? ' on' : ''), o.label); b.setAttribute('aria-pressed', String(sel.rooms.includes(o.id)));
        b.addEventListener('click', () => {
          if (o.id === 'any') sel.rooms = sel.rooms.includes('any') ? [] : ['any'];
          else { sel.rooms = sel.rooms.filter(x => x !== 'any'); sel.rooms = sel.rooms.includes(o.id) ? sel.rooms.filter(x => x !== o.id) : sel.rooms.concat(o.id); }
          rc.querySelectorAll('.bt-chipbtn').forEach((x, i) => { const on = sel.rooms.includes(rooms(h)[i].id); x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); });
        });
        rc.append(b);
      });
      card.append(rc, el('p', 'br-sub', k.via));
      const vc = el('div', 'br-chips');
      ['group', 'mp', 'mail'].forEach(v => {
        const b = btn('bt-chipbtn' + (sel.via === v ? ' on' : ''), viaName(k, v)); b.setAttribute('aria-pressed', String(sel.via === v));
        b.addEventListener('click', () => { sel.via = v; vc.querySelectorAll('.bt-chipbtn').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); }); });
        vc.append(b);
      });
      card.append(vc);
      if (mine) card.append(el('p', '', fmt(k.watching, { rooms: roomNames(h, mine.rooms), via: viaName(k, mine.via) })));
      m.body.append(card);
      const go = btn('bt-btn' + (mine ? ' ok' : ''), mine ? k.update : k.watch);
      go.addEventListener('click', () => {
        const st = state(); st.watch[h.id] = { rooms: sel.rooms.length ? sel.rooms : ['any'], via: sel.via, at: Date.now() }; save(st);
        drawWatchAgain();
      });
      if (mine) {
        const un = btn('bt-btn alt', k.unwatch);
        un.addEventListener('click', () => { const st = state(); delete st.watch[h.id]; save(st); drawWatchAgain(); });
        const sim = btn('bt-link', k.simulate); sim.addEventListener('click', () => { BT.close(); toast(h); });
        m.foot.append(sim, un);
      }
      m.foot.append(go);
    } else m.body.append(el('p', 'bt-lede', k.pickHome));
    m.body.append(el('p', 'bt-note', k.watchHow));
    const list = el('div', 'br-card'), ids = Object.keys(s.watch);
    list.append(el('h4', '', k.mine));
    if (!ids.length) list.append(el('p', 'bt-note', k.none));
    ids.forEach(id => {
      const hh = homes().find(x => x.id === id); if (!hh) return;
      const row = el('div', 'br-watch'), txt = el('div');
      txt.append(el('b', '', hh.name), el('span', '', roomNames(hh, s.watch[id].rooms) + ' · ' + releaseText(k, release(hh))));
      row.append(txt);
      if (!h || h.id !== id) {
        const go = btn('bt-chipbtn', k.show);
        go.addEventListener('click', () => { BT.close(); try { show(hh, true); } catch (_) { /* 页面还没准备好 */ } });
        row.append(go);
      }
      list.append(row);
    });
    m.body.append(list);
    function drawWatchAgain() { m.body.replaceChildren(); m.foot.replaceChildren(); drawWatch(h, m, k); }
  }

  function drawCard(h, m, k) {
    const s = state(), p = progress(s);
    const prog = el('div', 'br-progress'), bar = el('span', 'br-bar'), fill = el('i'), lbl = el('b', '', fmt(k.ready, p));
    fill.style.width = (100 * p.n / p.m) + '%'; bar.append(fill); prog.append(bar, lbl);
    const upd = () => { const st = state(), q = progress(st); fill.style.width = (100 * q.n / q.m) + '%'; lbl.textContent = fmt(k.ready, q); };
    m.body.append(el('p', 'bt-lede', k.cardLede), prog);
    const grid = el('div', 'br-fields');
    FIELDS.forEach(f => {
      const lab = el('label', 'br-f' + (f === 'emergency' ? ' wide' : '')), row = el('span', 'br-in');
      lab.append(el('span', '', k.f[f]));
      let inp;
      if (f === 'guarantor') { inp = el('select'); k.guar.forEach(([v, t]) => { const o = el('option', '', t); o.value = v; inp.append(o); }); }
      else {
        inp = el('input'); inp.type = f === 'dob' || f === 'movein' || f === 'moveout' ? 'date' : f === 'email' ? 'email' : f === 'phone' ? 'tel' : 'text';
        inp.placeholder = k.ph[f] || ''; inp.maxLength = 80; inp.autocomplete = 'off';
        if (f === 'family' || f === 'given') inp.autocapitalize = 'characters';
      }
      inp.value = s.card[f] || '';
      inp.addEventListener('input', () => { const st = state(); st.card[f] = f === 'family' || f === 'given' ? inp.value.toUpperCase() : inp.value; save(st); upd(); });
      inp.addEventListener('change', () => { if (f === 'family' || f === 'given') inp.value = inp.value.toUpperCase(); });
      const c = btn('br-copy', k.copy);
      c.addEventListener('click', async e => {
        e.preventDefault();
        const v = f === 'guarantor' ? (inp.selectedOptions[0] && inp.value ? inp.selectedOptions[0].textContent : '') : inp.value;
        if (!v) { inp.focus(); return; }
        if (await BT.copy(v)) { c.textContent = k.copied; c.classList.add('done'); setTimeout(() => { c.textContent = k.copy; c.classList.remove('done'); }, 1400); }
      });
      row.append(inp, c); lab.append(row); grid.append(lab);
    });
    m.body.append(grid);
    const ck = el('div', 'br-card paper'), ul = el('ul', 'br-list');
    ck.append(el('h4', '', k.checks));
    CHECKS.forEach(c => {
      const li = el('li'), lab = el('label'), cb = el('input'); cb.type = 'checkbox'; cb.checked = !!s.checks[c];
      cb.addEventListener('change', () => { const st = state(); st.checks[c] = cb.checked; save(st); upd(); });
      lab.append(cb, el('span', '', k.list[c])); li.append(lab); ul.append(li);
    });
    ck.append(ul);
    m.body.append(ck, el('p', 'bt-note', k.cardSafe), el('p', 'bt-note', k.plugin));
    const status = el('span', 'bt-status'), clr = btn('bt-link', k.clear), all = btn('bt-btn', k.copyAll);
    clr.addEventListener('click', () => { const st = state(); st.card = {}; st.checks = {}; save(st); m.body.replaceChildren(); m.foot.replaceChildren(); drawCard(h, m, k); });
    all.addEventListener('click', async () => {
      const st = state();
      const text = FIELDS.map(f => {
        let v = st.card[f] || '';
        if (f === 'guarantor') { const g = k.guar.find(x => x[0] === v); v = v && g ? g[1] : ''; }
        return v ? `${k.f[f]}: ${v}` : '';
      }).filter(Boolean).join('\n');
      if (text && await BT.copy(text)) status.textContent = k.copiedAll;
    });
    m.foot.append(status, clr, all);
  }

  function drawDay(h, m, k) {
    m.body.append(el('p', 'bt-lede', k.dayLede));
    const ol = el('ol', 'br-steps');
    k.steps.forEach(([when, t, p], i) => { const li = el('li'); li.dataset.n = i + 1; li.append(el('span', 'when', when), el('b', '', t), el('p', '', p)); ol.append(li); });
    m.body.append(ol, el('p', 'bt-note', k.tz));
    const go = btn('bt-btn', k.dayExpert), status = el('span', 'bt-status');
    go.addEventListener('click', () => {
      if (!h) { status.textContent = k.pickHome; return; }
      BT.close(); try { openContact(h); } catch (_) { /* 页面还没准备好 */ }
    });
    m.foot.append(status, go);
  }

  /* 放房通知（演示） */
  const toastEl = el('div', 'br-toast'); toastEl.hidden = true; toastEl.setAttribute('role', 'status');
  document.body.append(toastEl);
  toastEl.addEventListener('click', e => e.stopPropagation());
  let toastTimer = 0;
  function toast(h) {
    const k = w(), s = state(), mine = s.watch[h.id] || { rooms: ['any'], via: 'group' }, p = progress(s);
    const x = btn('x', '×'); x.setAttribute('aria-label', 'Close');
    const acts = el('div', 'acts'), day = btn('bt-btn', k.toastDay), card = btn('bt-btn alt', k.toastCard);
    acts.append(day, card);
    toastEl.replaceChildren(el('span', 'bell', '🔔'), el('b', '', fmt(k.toastT, { home: h.name, room: roomNames(h, mine.rooms) })), x,
      el('p', '', fmt(k.toastP, { via: viaName(k, mine.via), n: p.n, m: p.m })), acts);
    const hideToast = () => { toastEl.classList.remove('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastEl.hidden = true; }, 350); };
    x.addEventListener('click', hideToast);
    day.addEventListener('click', () => { hideToast(); open(h, 'day'); });
    card.addEventListener('click', () => { hideToast(); open(h, 'card'); });
    clearTimeout(toastTimer); toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    toastTimer = setTimeout(hideToast, 12000);
  }

  BT.add({
    id: 'ready', order: 2,
    card: h => { const on = !!state().watch[h.id]; return { title: w().title, desc: w().desc, mini: on ? w().miniOn : w().mini, on }; },
    intro: () => w().intro,
    open: h => open(h)
  });
  window.BookingReady = { open, toast, release };
})();
