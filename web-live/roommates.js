/* 找室友（演示）：填一份生活习惯问卷（作息、整洁、做饭、安静还是热闹、访客、室温、语言），
   看同一栋楼里打算入住的同学和你合不合得来，按匹配度排序，写明哪里合拍、哪里要商量。
   - 只显示昵称、国家 / 地区、专业领域和入住年份，不显示联系方式；对方同意后才互相加好友（演示版用「打招呼」示意）。
   - 演示版的同学是按公寓编号生成的示例（页面上标「示例数据」），问卷答案只存在本机（lsm-roommate-v1）。
   入口：公寓卡片「展开详情」的订房小工具、生活选房开场页。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, pick } = BT;
  const T = {
    zh: {
      intro: '🤝 找室友', title: '🤝 找室友', desc: '按生活习惯，看同楼同学合不合拍', eyebrow: '找室友', heading: '找合拍的室友',
      lede: '回答 7 个生活习惯问题，看看这栋楼里打算入住的同学和你合不合拍。只显示昵称，不显示联系方式。',
      start: '开始', redo: '重新填问卷', next: '下一题', back: '上一题', done: '看匹配结果', pickHome: '先选一栋公寓', home: '公寓',
      resH: '{home} · {n} 位同学也在看这栋楼', match: '匹配 {p}%', good: '合拍：', talk: '要商量：', hi: '👋 打招呼', hiDone: '已打招呼（演示）：对方同意后你们可以互相加好友。',
      major: '{m}', year: '{y} 入住', demo: '示例数据（演示用，不是真实同学）', privacy: '你的问卷答案只存在这台设备上；正式版只有你选择公开后，别人才看得到你的昵称和习惯。',
      wantLang: '想住在一起的人说', all: '都可以',
      Q: [
        ['sleep', '平时几点睡？', [['early', '🌅 11 点前'], ['mid', '🌙 11 点到 1 点'], ['late', '🦉 1 点以后']]],
        ['clean', '厨房和公共区域，你希望多干净？', [['high', '✨ 用完马上收拾'], ['mid', '🧽 当天收拾'], ['low', '🙂 差不多就行']]],
        ['cook', '多久做一次饭？', [['daily', '🍳 几乎每天'], ['some', '🥡 一周几次'], ['rare', '🍔 很少做']]],
        ['vibe', '你喜欢的公寓氛围？', [['quiet', '📚 安静，各自学习'], ['mix', '☕ 偶尔一起吃饭聊天'], ['social', '🎉 热闹，常常一起玩']]],
        ['guests', '朋友来访？', [['rare', '🚪 很少带人来'], ['some', '👋 偶尔'], ['often', '🏠 经常有朋友来']]],
        ['temp', '室温偏好？', [['cool', '❄️ 凉一点'], ['mid', '🌡️ 适中'], ['warm', '🔥 暖和一点']]],
        ['lang', '平时主要说什么语言？', [['zh', '中文'], ['ja', '日本語'], ['en', 'English'], ['any', '都可以']]]
      ],
      tags: { sleep: '作息', clean: '整洁', cook: '做饭', vibe: '氛围', guests: '访客', temp: '室温', lang: '语言' },
      who: { cn: '🇨🇳', jp: '🇯🇵', sg: '🇸🇬', uk: '🇬🇧', other: '🌍' },
      majors: ['商科', '计算机', '医学', '工程', '法律', '建筑', '传媒', '心理学', '金融', '音乐']
    },
    en: {
      intro: '🤝 Find flatmates', title: '🤝 Find flatmates', desc: 'See who in the building shares your habits', eyebrow: 'Find flatmates', heading: 'Find flatmates who fit',
      lede: 'Answer 7 questions about how you live and see how well you would get on with students planning to live in this building. Only nicknames are shown, never contact details.',
      start: 'Start', redo: 'Redo the questions', next: 'Next', back: 'Back', done: 'See matches', pickHome: 'Pick a building first', home: 'Building',
      resH: '{home} · {n} students are looking at this building', match: '{p}% match', good: 'In common: ', talk: 'To talk about: ', hi: '👋 Say hi', hiDone: 'Said hi (demo): once they agree you can add each other.',
      major: '{m}', year: 'Moving in {y}', demo: 'Sample data (demo only, not real students)', privacy: 'Your answers stay on this device. In the live version others only see your nickname and habits if you choose to share them.',
      wantLang: 'Language', all: 'Any',
      Q: [
        ['sleep', 'When do you usually go to bed?', [['early', '🌅 Before 11pm'], ['mid', '🌙 11pm to 1am'], ['late', '🦉 After 1am']]],
        ['clean', 'How clean should the kitchen and shared areas be?', [['high', '✨ Tidy straight away'], ['mid', '🧽 Tidy the same day'], ['low', '🙂 Roughly clean is fine']]],
        ['cook', 'How often do you cook?', [['daily', '🍳 Almost every day'], ['some', '🥡 A few times a week'], ['rare', '🍔 Rarely']]],
        ['vibe', 'What kind of flat do you want?', [['quiet', '📚 Quiet, everyone studies'], ['mix', '☕ Meals and chats now and then'], ['social', '🎉 Lively, lots together']]],
        ['guests', 'Friends visiting?', [['rare', '🚪 Rarely'], ['some', '👋 Sometimes'], ['often', '🏠 Often']]],
        ['temp', 'Room temperature?', [['cool', '❄️ Cooler'], ['mid', '🌡️ In between'], ['warm', '🔥 Warmer']]],
        ['lang', 'Which language do you mostly speak?', [['zh', '中文'], ['ja', '日本語'], ['en', 'English'], ['any', 'Any']]]
      ],
      tags: { sleep: 'Sleep', clean: 'Tidiness', cook: 'Cooking', vibe: 'Vibe', guests: 'Guests', temp: 'Temperature', lang: 'Language' },
      who: { cn: '🇨🇳', jp: '🇯🇵', sg: '🇸🇬', uk: '🇬🇧', other: '🌍' },
      majors: ['Business', 'Computer science', 'Medicine', 'Engineering', 'Law', 'Architecture', 'Media', 'Psychology', 'Finance', 'Music']
    }
  };
  const k = () => pick(T);
  const homes = () => { try { return HOMES; } catch (_) { return []; } };
  const store = BT.store('lsm-roommate-v1');
  const ORDER = { sleep: ['early', 'mid', 'late'], clean: ['high', 'mid', 'low'], cook: ['daily', 'some', 'rare'], vibe: ['quiet', 'mix', 'social'], guests: ['rare', 'some', 'often'], temp: ['cool', 'mid', 'warm'] };
  const WEIGHT = { sleep: 3, clean: 3, cook: 1, vibe: 2, guests: 2, temp: 1, lang: 2 };
  const hash = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rng = seed => () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const NAMES = { cn: ['小林', '阿杰', 'Mia', '小鱼', 'Kevin', '橙子', 'Luna'], jp: ['Haruka', 'Sota', 'Mei', 'Ren'], sg: ['Jun Wei', 'Shannon', 'Ravi'], uk: ['Tom', 'Ellie', 'Sam'], other: ['Lucas', 'Aisha', 'Marta'] };
  const LANG_OF = { cn: 'zh', jp: 'ja', sg: 'en', uk: 'en', other: 'en' };

  /* 示例同学：按公寓编号生成 */
  function poolOf(h) {
    const r = rng(hash('mate:' + h.id)), n = 5 + Math.floor(r() * 6), out = [], WHO = ['cn', 'cn', 'cn', 'jp', 'sg', 'uk', 'other'];
    for (let i = 0; i < n; i++) {
      const who = WHO[Math.floor(r() * WHO.length)], a = {};
      Object.keys(ORDER).forEach(q => { a[q] = ORDER[q][Math.floor(r() * 3)]; });
      a.lang = r() < 0.25 ? 'any' : LANG_OF[who];
      const used = out.map(x => x.name), left = NAMES[who].filter(x => !used.includes(x)), name = left.length ? left[Math.floor(r() * left.length)] : NAMES[who][0] + ' ' + (i + 1);
      out.push({ id: h.id + i, who, name, major: Math.floor(r() * 10), year: '2026/27', a });
    }
    return out;
  }
  /* 匹配度：每题相同满分，差一档得一半，差两档 0；语言「都可以」算相同 */
  function score(me, o) {
    let got = 0, max = 0; const good = [], talk = [];
    Object.keys(WEIGHT).forEach(q => {
      const w = WEIGHT[q]; max += w; let s;
      if (q === 'lang') s = me.lang === 'any' || o.lang === 'any' || me.lang === o.lang ? 1 : 0;
      else s = [1, 0.5, 0][Math.abs(ORDER[q].indexOf(me[q]) - ORDER[q].indexOf(o[q]))];
      got += s * w; if (s === 1) good.push(q); else if (s === 0) talk.push(q);
    });
    return { p: Math.round(got / max * 100), good, talk };
  }

  function open(h) {
    const K = k(), m = BT.modal({ eyebrow: K.eyebrow, title: K.heading }); m.box.classList.add('rm-box');
    let home = h || null, me = (store.get() || {}).a || null, step = 0, ans = Object.assign({}, me || {});
    const clear = () => { m.body.replaceChildren(); m.foot.replaceChildren(); m.body.scrollTop = 0; };
    function intro() {
      clear(); m.body.append(el('p', 'bt-lede', K.lede), el('p', 'bt-note', K.privacy));
      const go = btn('bt-btn', K.start); go.addEventListener('click', () => { step = 0; quiz(); }); m.foot.append(go);
    }
    function quiz() {
      clear();
      const [id, q, opts] = K.Q[step];
      const prog = el('div', 'rm-prog'); K.Q.forEach((_, i) => prog.append(el('i', i <= step ? 'on' : '')));
      m.body.append(prog, el('b', 'rm-q', (step + 1) + '. ' + q));
      const list = el('div', 'rm-opts');
      opts.forEach(([v, t]) => { const b = btn('rm-opt' + (ans[id] === v ? ' on' : ''), t); b.setAttribute('aria-pressed', String(ans[id] === v)); b.addEventListener('click', () => { ans[id] = v; if (step < K.Q.length - 1) { step++; quiz(); } else finish(); }); list.append(b); });
      m.body.append(list);
      if (step > 0) { const b = btn('bt-link', K.back); b.addEventListener('click', () => { step--; quiz(); }); m.foot.append(b); }
      if (ans[id]) { const n = btn('bt-btn', step < K.Q.length - 1 ? K.next : K.done); n.addEventListener('click', () => { if (step < K.Q.length - 1) { step++; quiz(); } else finish(); }); m.foot.append(n); }
    }
    function finish() { me = Object.assign({}, ans); store.set({ a: me }); results(); }
    function results() {
      clear();
      if (!home) {
        m.body.append(el('p', 'bt-lede', K.pickHome));
        const sel = el('select'); const o0 = el('option', '', '—'); o0.value = ''; sel.append(o0);
        homes().slice().sort((a, b) => a.name.localeCompare(b.name)).forEach(x => { const o = el('option', '', x.name); o.value = x.id; sel.append(o); });
        sel.addEventListener('change', () => { home = homes().find(x => x.id === sel.value) || null; if (home) results(); });
        const l = el('label', 'qc-f'); l.append(el('span', '', K.home), sel); m.body.append(l); return;
      }
      const pool = poolOf(home).map(o => ({ o, ...score(me, o.a) })).sort((a, b) => b.p - a.p);
      m.body.append(el('span', 'bt-tag demo', K.demo), el('b', 'rm-h', fmt(K.resH, { home: home.name, n: pool.length })));
      const ul = el('div', 'rm-list');
      pool.forEach(({ o, p, good, talk }) => {
        const it = el('article', 'rm-item' + (p >= 75 ? ' top' : '')), hd = el('header');
        hd.append(el('span', 'rm-flag', K.who[o.who]), el('b', '', o.name), el('span', 'rm-meta', K.majors[o.major] + ' · ' + fmt(K.year, { y: o.year })), el('span', 'rm-pct', fmt(K.match, { p })));
        const meter = el('div', 'rm-meter'), fillb = el('i'); fillb.style.width = p + '%'; meter.append(fillb);
        it.append(hd, meter);
        if (good.length) it.append(el('p', 'rm-good', K.good + good.map(q => K.tags[q]).join(BT.lang() === 'zh' ? '、' : ', ')));
        if (talk.length) it.append(el('p', 'rm-talk', K.talk + talk.map(q => K.tags[q]).join(BT.lang() === 'zh' ? '、' : ', ')));
        const hi = btn('bt-btn alt rm-hi', K.hi);
        hi.addEventListener('click', () => { hi.disabled = true; hi.textContent = '✓'; it.append(el('p', 'bt-note', K.hiDone)); });
        it.append(hi); ul.append(it);
      });
      m.body.append(ul, el('p', 'bt-note', K.privacy));
      const redo = btn('bt-link', K.redo); redo.addEventListener('click', () => { step = 0; quiz(); });
      m.foot.append(redo);
    }
    if (me) results(); else intro();
  }

  BT.add({ id: 'roommates', order: 6, mini: false, card: () => ({ title: k().title, desc: k().desc }), intro: () => k().intro, open: h => open(h) });
  window.Roommates = { open, score };
})();
