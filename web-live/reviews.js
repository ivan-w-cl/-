/* 口碑与公开记录（演示）：
   - 学生评价：只收学校邮箱（.ac.uk）验证过的学生评价，按 8 项打分（性价比、位置、保洁、社交空间、Wi-Fi、管理、安全、安静），
     可以只看中国 / 日本 / 新加坡同学的评价；公寓不能花钱买排名。
   - 公开记录：把官方公开数据变成一眼能看懂的体检单——周边治安（police.uk 公开案件数据）、能耗证书（gov.uk EPC 登记）、
     合租房的 HMO 执照（利物浦市议会登记）。
   - 排行榜：按某一项分数给公寓排名，也可以只按某国同学的评价排。
   演示版的评价和记录都是按公寓编号生成的示例数据（页面上标「示例数据」），不是真实学生的评价，也不是真实的官方记录。
   入口：公寓卡片「展开详情」的订房小工具、收起卡片上的「🏅 口碑」、生活选房开场页。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, pick } = BT;
  const W = {
    zh: {
      intro: '🏅 口碑与公开记录', title: '🏅 口碑与公开记录', desc: '验证学生的评价 + 官方公开记录', mini: '🏅 口碑 {s}', miniNone: '🏅 口碑与记录',
      eyebrow: '口碑与公开记录', tabRev: '学生评价', tabRec: '公开记录', tabRank: '排行榜',
      demo: '示例数据（演示用，不是真实学生评价或官方记录）', overall: '综合', nRev: '{n} 条验证评价', verified: '✓ 学校邮箱已验证',
      who: { all: '全部', cn: '🇨🇳 中国同学', jp: '🇯🇵 日本同学', sg: '🇸🇬 新加坡同学', uk: '🇬🇧 英国同学', other: '🌍 其他' },
      cats: { value: '性价比', location: '位置', clean: '保洁', social: '社交空间', wifi: 'Wi-Fi', manage: '管理', safety: '安全', quiet: '安静' },
      none: '这个筛选下还没有评价。', write: '✍️ 写一条评价', wEmail: '学校邮箱（.ac.uk，只用来验证，不公开）', wText: '住得怎么样？', wScore: '打分',
      wSend: '提交', wBadEmail: '请用以 .ac.uk 结尾的学校邮箱', wShort: '多写几句吧（至少 15 个字）', wDone: '收到！验证邮箱并通过审核后会显示。（演示版只存在本机）', mine: '我的评价 · 审核中',
      rules: '规则：只有学校邮箱验证过的学生能写；每人每栋楼一条；公寓不能付费置顶或删除差评。',
      recLede: '把官方公开数据整理成一眼能看懂的样子。点来源可以自己去官网核对。',
      crime: '周边治安', crimeP: '公寓 500 米内，过去 12 个月登记的案件', crimeVs: '利物浦学生区平均的 {p}%', crimeLow: '低于平均', crimeMid: '接近平均', crimeHigh: '高于平均',
      crimeCats: { asb: '扰民', theft: '盗窃', bike: '自行车被盗', burglary: '入室盗窃', violence: '暴力', vehicle: '车辆相关' },
      epc: '能耗证书（EPC）', epcP: '能耗等级越高（A 最好），冬天越省暖气费', epcNa: '大型学生公寓通常整栋登记为非住宅，这里显示同类公寓的常见等级',
      hmo: '合租房执照（HMO）', hmoOk: '已登记执照，有效期至 {d}', hmoNo: '没有查到执照登记，签约前请问清楚',
      repairs: '维修响应', repairsP: '来自评价：报修后平均 {d} 天处理', src: '来源：{s}', checkSelf: '去官网自己查 ↗',
      rankLede: '按一项分数给公寓排名（只算验证过的评价，至少 3 条才上榜）。', rankBy: '按', rankWho: '评价来自', rankOpen: '查看',
      year: '{y} 入住', room: '{r}'
    },
    en: {
      intro: '🏅 Reviews & public records', title: '🏅 Reviews & records', desc: 'Verified student reviews + official records', mini: '🏅 Reviews {s}', miniNone: '🏅 Reviews & records',
      eyebrow: 'Reviews & public records', tabRev: 'Student reviews', tabRec: 'Public records', tabRank: 'Rankings',
      demo: 'Sample data (demo only, not real student reviews or official records)', overall: 'Overall', nRev: '{n} verified reviews', verified: '✓ University email verified',
      who: { all: 'All', cn: '🇨🇳 Chinese students', jp: '🇯🇵 Japanese students', sg: '🇸🇬 Singaporean students', uk: '🇬🇧 UK students', other: '🌍 Others' },
      cats: { value: 'Value', location: 'Location', clean: 'Cleaning', social: 'Social space', wifi: 'Wi-Fi', manage: 'Management', safety: 'Safety', quiet: 'Quiet' },
      none: 'No reviews for this filter yet.', write: '✍️ Write a review', wEmail: 'University email (.ac.uk, for verification only, never shown)', wText: 'How was it?', wScore: 'Score',
      wSend: 'Submit', wBadEmail: 'Use a university email ending in .ac.uk', wShort: 'Tell us a bit more (at least 15 characters)', wDone: 'Thanks! It will appear once your email is verified and it passes review. (Demo: saved on this device only)', mine: 'My review · in review',
      rules: 'Rules: only students verified by university email can review; one review per person per building; buildings cannot pay to rank higher or remove bad reviews.',
      recLede: 'Official public data, laid out so you can read it at a glance. Tap a source to check it yourself.',
      crime: 'Crime nearby', crimeP: 'Recorded crimes within 500 m in the past 12 months', crimeVs: '{p}% of the Liverpool student-area average', crimeLow: 'Below average', crimeMid: 'Around average', crimeHigh: 'Above average',
      crimeCats: { asb: 'Anti-social behaviour', theft: 'Theft', bike: 'Bike theft', burglary: 'Burglary', violence: 'Violence', vehicle: 'Vehicle crime' },
      epc: 'Energy certificate (EPC)', epcP: 'A higher rating (A is best) means lower heating bills in winter', epcNa: 'Large student buildings are usually registered as non-domestic; this shows the usual rating for similar buildings',
      hmo: 'Shared-house licence (HMO)', hmoOk: 'Licensed, valid until {d}', hmoNo: 'No licence found; ask before you sign',
      repairs: 'Repairs', repairsP: 'From reviews: repairs take {d} days on average', src: 'Source: {s}', checkSelf: 'Check it yourself ↗',
      rankLede: 'Homes ranked by one score (verified reviews only, at least 3 to be listed).', rankBy: 'By', rankWho: 'Reviews from', rankOpen: 'View',
      year: 'Moved in {y}', room: '{r}'
    }
  };
  const w = () => pick(W), zh = () => BT.lang() === 'zh';
  const homes = () => { try { return HOMES; } catch (_) { return []; } };
  const CATS = ['value', 'location', 'clean', 'social', 'wifi', 'manage', 'safety', 'quiet'];
  const hash = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rng = seed => () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mine = BT.store('lsm-reviews-mine-v1');

  /* ---------- 示例评价：按公寓编号生成（同一栋楼每次都一样） ---------- */
  const SNIP = {
    value: [['房租不便宜，但包所有账单，算下来还行。', 'Not cheap, but all bills are included so it works out fine.'], ['同样的价钱，附近能找到更大的房间。', 'For the same money you can find bigger rooms nearby.']],
    location: [['走路去上课十分钟，下雨天也不怕。', 'Ten minutes’ walk to lectures, fine even in the rain.'], ['离亚洲超市很近，买菜方便。', 'Close to the Asian supermarket, easy for groceries.']],
    clean: [['公共区域每周打扫，厨房还算干净。', 'Common areas are cleaned weekly; the kitchen stays fairly clean.'], ['厨房要靠室友自觉，有时候有点乱。', 'The kitchen depends on flatmates and gets messy sometimes.']],
    social: [['有自习室和电影室，周末经常有活动。', 'There is a study room and cinema room, with events most weekends.'], ['公共空间不大，平时人不多。', 'The common room is small and usually quiet.']],
    wifi: [['网速稳定，上网课没问题。', 'Wi-Fi is stable, fine for online classes.'], ['晚上高峰时网速会慢一点。', 'Wi-Fi slows down a bit in the evening.']],
    manage: [['前台很友好，报修第二天就有人来。', 'Reception is friendly; repairs were done the next day.'], ['报修要等好几天，邮件回复慢。', 'Repairs take days and emails are slow.']],
    safety: [['门禁严格，晚上回来也安心。', 'Strict entry control, I feel safe coming back at night.'], ['附近晚上有点吵，要注意安全。', 'The area gets rowdy at night; take care.']],
    quiet: [['房间隔音不错，考试周能睡好。', 'Good soundproofing, I could sleep during exams.'], ['周末楼下酒吧有点吵。', 'The bar below is noisy at weekends.']]
  };
  const WHO = ['cn', 'cn', 'cn', 'jp', 'sg', 'uk', 'uk', 'other'];
  const NAMES = { cn: ['小林', 'Yuki', 'Chen', '阿杰', 'Mia', '小鱼'], jp: ['Haruka', 'Sota', 'Mei'], sg: ['Jun Wei', 'Shannon', 'Ravi'], uk: ['Tom', 'Ellie', 'Sam'], other: ['Lucas', 'Aisha', 'Marta'] };
  const cache = new Map();
  function reviewsOf(h) {
    if (cache.has(h.id)) return cache.get(h.id);
    const r = rng(hash(h.id)), base = (h.rr ? Number(h.rr) : 3.9 + r() * 0.6) - 0.6, n = 5 + Math.floor(r() * 9), list = [];
    const bias = {}; CATS.forEach(c => { bias[c] = (r() - 0.5) * 1.6; });
    bias.location += h.uol <= 10 ? 0.5 : h.uol >= 20 ? -0.5 : 0;
    for (let i = 0; i < n; i++) {
      const who = WHO[Math.floor(r() * WHO.length)], sc = {};
      CATS.forEach(c => { sc[c] = clamp(Math.round(base + bias[c] + (r() - 0.5) * 2.2), 1, 5); });
      const order = CATS.slice().sort((a, b) => sc[b] - sc[a] || r() - 0.5), good = order.slice(0, 1 + Math.floor(r() * 2)), bad = order[order.length - 1];
      const lines = good.map(c => SNIP[c][sc[c] >= 4 ? 0 : 1]).concat(sc[bad] <= 3 ? [SNIP[bad][1]] : []);
      list.push({ who, name: NAMES[who][Math.floor(r() * NAMES[who].length)], year: r() < 0.6 ? '2025/26' : '2024/25', sc,
        zh: lines.map(l => l[0]).join(''), en: lines.map(l => l[1]).join(' '), repair: 1 + Math.round(r() * (sc.manage >= 4 ? 2 : 5)) });
    }
    cache.set(h.id, list); return list;
  }
  const avg = (list, c) => (list.length ? list.reduce((a, x) => a + (c ? x.sc[c] : CATS.reduce((s, k) => s + x.sc[k], 0) / CATS.length), 0) / list.length : null);
  const stars = v => '★★★★★'.slice(0, Math.round(v)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(v));

  /* ---------- 示例公开记录 ---------- */
  function recordsOf(h) {
    const r = rng(hash('rec:' + h.id)), central = h.centre <= 12 ? 1.35 : h.centre <= 20 ? 1 : 0.7;
    const total = Math.round((120 + r() * 160) * central), pct = Math.round(total / 190 * 100);
    const split = { asb: 0.34, theft: 0.18, violence: 0.22, bike: 0.07, burglary: 0.08, vehicle: 0.11 }, cats = {};
    Object.entries(split).forEach(([k, v]) => { cats[k] = Math.max(1, Math.round(total * v * (0.75 + r() * 0.5))); });
    const house = /houses/.test(h.id);
    return { total, pct, cats, epc: house ? 'DCDE'[Math.floor(r() * 4)] : 'BBC'[Math.floor(r() * 3)], house,
      hmo: house ? (r() < 0.8 ? `${2027 + Math.floor(r() * 3)}-0${1 + Math.floor(r() * 8)}-30` : '') : null,
      repair: (reviewsOf(h).reduce((a, x) => a + x.repair, 0) / reviewsOf(h).length).toFixed(1) };
  }

  /* ---------- 弹窗 ---------- */
  let tab = 'rev', who = 'all', rankCat = 'overall', rankWho = 'all';
  function open(h, which) {
    const k = w(); if (which) tab = which; if (!h && tab !== 'rank') tab = 'rank';
    const m = BT.modal({ eyebrow: k.eyebrow, title: h ? h.name : k.title }); m.box.classList.add('rv-box');
    const tabs = el('div', 'br-tabs'); tabs.setAttribute('role', 'tablist');
    const go = id => {
      tab = id; tabs.querySelectorAll('.br-tab').forEach(x => x.setAttribute('aria-selected', String(x.dataset.id === id)));
      m.body.replaceChildren(); m.foot.replaceChildren(); m.body.scrollTop = 0;
      m.body.append(el('span', 'bt-tag demo rv-demo', k.demo));
      if (id === 'rev') drawReviews(m, h); else if (id === 'rec') drawRecords(m, h); else drawRank(m);
    };
    (h ? [['rev', k.tabRev], ['rec', k.tabRec], ['rank', k.tabRank]] : [['rank', k.tabRank]]).forEach(([id, label]) => {
      const b = btn('br-tab', label); b.dataset.id = id; b.setAttribute('role', 'tab'); b.addEventListener('click', () => go(id)); tabs.append(b);
    });
    m.box.insertBefore(tabs, m.body);
    go(tab);
  }
  function whoChips(cur, on) {
    const k = w(), row = el('div', 'br-chips rv-who');
    ['all', 'cn', 'jp', 'sg', 'uk', 'other'].forEach(x => { const b = btn('bt-chipbtn' + (cur === x ? ' on' : ''), k.who[x]); b.setAttribute('aria-pressed', String(cur === x)); b.addEventListener('click', () => on(x)); row.append(b); });
    return row;
  }
  function drawReviews(m, h) {
    const k = w(), all = reviewsOf(h), box = el('div', 'rv-wrap');
    const draw = () => {
      box.replaceChildren();
      const list = who === 'all' ? all : all.filter(x => x.who === who);
      box.append(whoChips(who, x => { who = x; draw(); }));
      const head = el('div', 'rv-head'), o = avg(list);
      const big = el('div', 'rv-big'); big.append(el('strong', '', o != null ? o.toFixed(1) : '–'), el('span', 'rv-stars', o != null ? stars(o) : ''), el('small', '', fmt(k.nRev, { n: list.length })));
      const bars = el('div', 'rv-bars');
      CATS.forEach(c => { const v = avg(list, c), row = el('div', 'rv-bar'), tr = el('i'), fill = el('b'); fill.style.width = v ? (v / 5 * 100) + '%' : '0'; tr.append(fill); row.append(el('span', '', k.cats[c]), tr, el('em', '', v ? v.toFixed(1) : '–')); bars.append(row); });
      head.append(big, bars); box.append(head);
      const ul = el('div', 'rv-list');
      const my = (mine.get() || {})[h.id];
      if (my) { const it = el('article', 'rv-item mine'); it.append(el('header', '', k.mine), el('p', '', my.text)); ul.append(it); }
      if (!list.length) ul.append(el('p', 'bt-note', k.none));
      list.forEach(x => {
        const it = el('article', 'rv-item'), hd = el('header');
        const o2 = CATS.reduce((a, c) => a + x.sc[c], 0) / CATS.length;
        hd.append(el('b', '', x.name), el('span', 'rv-flag', k.who[x.who].split(' ')[0]), el('span', 'rv-ver', k.verified), el('span', 'rv-meta', fmt(k.year, { y: x.year })), el('span', 'rv-stars small', stars(o2)));
        const tr = zh() ? x.who !== 'cn' : x.who === 'cn' || x.who === 'jp';
        it.append(hd, el('p', '', (zh() ? x.zh : x.en) + (tr ? (zh() ? '（已翻译）' : ' (translated)') : ''))); ul.append(it);
      });
      box.append(ul, el('p', 'bt-note', k.rules));
    };
    draw(); m.body.append(box);
    const wbtn = btn('bt-btn alt', k.write); wbtn.addEventListener('click', () => writeForm(m, h, () => draw()));
    m.foot.append(wbtn);
  }
  function writeForm(m, h, done) {
    const k = w(), f = el('form', 'rv-form'), email = el('input'), text = el('textarea'), msg = el('p', 'bt-note'), send = el('button', 'bt-btn', k.wSend);
    email.type = 'email'; email.placeholder = 'name@student.liverpool.ac.uk'; text.rows = 3; send.type = 'submit';
    const lab = (t, i) => { const l = el('label', 'qc-f'); l.append(el('span', '', t), i); return l; };
    f.append(lab(k.wEmail, email), lab(k.wText, text), send, msg);
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.ac\.uk$/i.test(email.value.trim())) { msg.textContent = k.wBadEmail; return; }
      if (text.value.trim().length < 15) { msg.textContent = k.wShort; return; }
      const all = mine.get() || {}; all[h.id] = { text: text.value.trim(), at: Date.now() }; mine.set(all);
      msg.textContent = k.wDone; f.querySelectorAll('input,textarea,button').forEach(x => { x.disabled = true; }); done();
    });
    const old = m.body.querySelector('.rv-form'); if (old) old.remove();
    m.body.prepend(f); m.body.scrollTop = 0; email.focus();
  }
  function drawRecords(m, h) {
    const k = w(), R = recordsOf(h), box = el('div', 'rv-recs');
    box.append(el('p', 'bt-lede', k.recLede));
    const card = (title, sub, body, src, url) => {
      const c = el('section', 'rv-rec'); c.append(el('b', '', title), el('p', 'bt-note', sub)); if (body) c.append(body);
      const s = el('p', 'rv-src'); s.append(fmt(k.src, { s: src }));
      if (url) { const a = el('a', '', k.checkSelf); a.href = url; a.target = '_blank'; a.rel = 'noopener'; s.append(' · ', a); }
      c.append(s); return c;
    };
    // 治安
    const lvl = R.pct < 85 ? ['low', k.crimeLow] : R.pct <= 115 ? ['mid', k.crimeMid] : ['high', k.crimeHigh];
    const cb = el('div', 'rv-crime'), top = el('div', 'rv-ctop');
    top.append(el('strong', '', String(R.total)), el('span', 'rv-lvl ' + lvl[0], lvl[1] + ' · ' + fmt(k.crimeVs, { p: R.pct })));
    const bars = el('div', 'rv-bars'), mx = Math.max(...Object.values(R.cats));
    Object.entries(R.cats).sort((a, b) => b[1] - a[1]).forEach(([c, v]) => { const row = el('div', 'rv-bar'), tr = el('i'), fill = el('b'); fill.style.width = (v / mx * 100) + '%'; tr.append(fill); row.append(el('span', '', k.crimeCats[c]), tr, el('em', '', String(v))); bars.append(row); });
    cb.append(top, bars);
    box.append(card('🚓 ' + k.crime, k.crimeP, cb, 'police.uk', 'https://www.police.uk/'));
    // EPC
    const eb = el('div', 'rv-epc'); 'ABCDEFG'.split('').forEach(x => eb.append(el('span', 'e' + x + (x === R.epc ? ' on' : ''), x)));
    box.append(card('🔥 ' + k.epc, k.epcP + (R.house ? '' : (zh() ? '。' : '. ') + k.epcNa), eb, 'GOV.UK Find an energy certificate', 'https://www.gov.uk/find-energy-certificate'));
    // HMO（只有合租房）
    if (R.house) box.append(card('📄 ' + k.hmo, R.hmo ? fmt(k.hmoOk, { d: R.hmo }) : k.hmoNo, null, 'Liverpool City Council', 'https://liverpool.gov.uk/'));
    // 维修
    box.append(card('🔧 ' + k.repairs, fmt(k.repairsP, { d: R.repair }), null, zh() ? '本站验证学生评价' : 'verified reviews on this site', ''));
    m.body.append(box);
  }
  function drawRank(m) {
    const k = w(), box = el('div', 'rv-rank');
    const draw = () => {
      box.replaceChildren();
      box.append(el('p', 'bt-lede', k.rankLede));
      const row = el('div', 'br-chips rv-cats');
      [['overall', k.overall]].concat(CATS.map(c => [c, k.cats[c]])).forEach(([c, t]) => { const b = btn('bt-chipbtn' + (rankCat === c ? ' on' : ''), t); b.addEventListener('click', () => { rankCat = c; draw(); }); row.append(b); });
      box.append(el('span', 'qc-f', k.rankBy), row, el('span', 'qc-f', k.rankWho), whoChips(rankWho, x => { rankWho = x; draw(); }));
      const list = homes().map(h => { const rs = reviewsOf(h).filter(x => rankWho === 'all' || x.who === rankWho); return { h, n: rs.length, v: rs.length >= 3 ? avg(rs, rankCat === 'overall' ? null : rankCat) : null }; })
        .filter(x => x.v != null).sort((a, b) => b.v - a.v).slice(0, 15);
      const ol = el('ol', 'rv-rlist');
      list.forEach(({ h, n, v }, i) => {
        const li = el('li'), b = btn('qc-home'), s = el('span');
        s.append(el('b', '', (i + 1) + '. ' + h.name), el('small', '', fmt(k.nRev, { n })));
        b.append(s, el('span', 'qc-p', v.toFixed(2) + ' ★'));
        b.addEventListener('click', () => open(h, 'rev')); li.append(b); ol.append(li);
      });
      if (!list.length) ol.append(el('p', 'bt-note', k.none));
      box.append(ol);
    };
    draw(); m.body.append(box);
  }

  BT.add({
    id: 'reviews', order: 3,
    card: h => { const o = avg(reviewsOf(h)); return { title: w().title, desc: w().desc, mini: o ? fmt(w().mini, { s: o.toFixed(1) + '★' }) : w().miniNone, cls: 'bt-chipbtn' }; },
    intro: () => w().intro,
    open: h => open(h)
  });
  window.Reviews = { open, reviewsOf, avg };
})();
