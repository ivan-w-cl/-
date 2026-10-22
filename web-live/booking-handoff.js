/* "我要建群咨询" inside the contact panel: the student asks for a booking group, an adviser creates it by hand in
   adviser.html and sends the group QR code back into this panel.
   Add-on only: it watches #contactDemo and adds one section between the chat and the contact options.
   Demo transport: the student's conversation lives in localStorage ('lsm-live-me-v1'), shared with adviser.html in the
   same browser (other tabs and frames update through the storage event). No message leaves the browser. */
(() => {
  'use strict';
  const KEY = 'lsm-live-me-v1';
  const REGIONS = { SG: { flag: '🇸🇬', channel: 'whatsapp' }, CN: { flag: '🇨🇳', channel: 'wechat' }, JP: { flag: '🇯🇵', channel: 'whatsapp' } };
  const TEAMS = {
    A: { zh: '专家团队 A · 市中心与绳索街区', en: 'Team A · City Centre & Ropewalks', ja: 'チームA · シティセンター', members: ['Grace Wong', '陈思琪', 'Tom Hughes'] },
    B: { zh: '专家团队 B · 知识区与乔治亚街区', en: 'Team B · Knowledge & Georgian Quarter', ja: 'チームB · ナレッジ・クォーター', members: ['Daniel Lim', '刘佳', 'Sophie Clarke'] },
    C: { zh: '专家团队 C · 日本学生', en: 'Team C · Students from Japan', ja: 'チームC · 日本人学生', members: ['Kenji Mori', 'Emma Brown'] },
    D: { zh: '专家团队 D · 边山与肯辛顿合租房', en: 'Team D · Edge Hill & Kensington houses', ja: 'チームD · エッジヒル', members: ['Priya Shah', '王磊'] }
  };
  const W = {
    zh: { title: '想正式预定？建一个专属群', lead: '一位学生一个专属群。提交后，顾问会人工为你建群，并把群二维码发回这里。资料都可以不填。',
      want: '🙋 我要建群咨询', name: '怎么称呼你（选填）', region: '你来自', channel: '用哪个 App 进群', intake: '入学时间', budget: '每周预算（选填）', any: '不限',
      submit: '提交建群请求', cancel: '取消', sent: '建群请求已提交。顾问收到提醒后会人工建群，群二维码会出现在这里。', waiting: '等待顾问建群…',
      adviser: '顾问', qrTitle: '你的预定专家群', qrWa: '用手机扫码，或点下方按钮加入 WhatsApp 群。', qrWx: '用微信扫码或长按二维码加入群聊。',
      openWa: '在 WhatsApp 中打开', openNote: '演示：正式版会在这里打开 WhatsApp。', team: '你的团队', demo: '演示二维码，扫码不会进入真实群。',
      SG: '新加坡', CN: '中国', JP: '日本', whatsapp: 'WhatsApp 群', wechat: '微信群', about: '关于：' },
    en: { title: 'Ready to book? Get your own group', lead: 'One group per student. After you ask, an adviser creates your group by hand and sends its QR code back here. Every detail is optional.',
      want: '🙋 Get my booking group', name: 'Your name (optional)', region: 'You are from', channel: 'Join the group on', intake: 'Start date', budget: 'Weekly budget (optional)', any: 'Any',
      submit: 'Send request', cancel: 'Cancel', sent: 'Request sent. An adviser will create your group by hand and the QR code will appear here.', waiting: 'Waiting for the adviser…',
      adviser: 'Adviser', qrTitle: 'Your booking expert group', qrWa: 'Scan with your phone, or tap the button to join the WhatsApp group.', qrWx: 'Scan or long-press the QR code in WeChat to join.',
      openWa: 'Open in WhatsApp', openNote: 'Demo: the real app opens WhatsApp here.', team: 'Your team', demo: 'Demo QR code. It does not open a real group.',
      SG: 'Singapore', CN: 'China', JP: 'Japan', whatsapp: 'WhatsApp group', wechat: 'WeChat group', about: 'About: ' },
    ja: { title: '予約したい方へ：専用グループ', lead: '学生ごとに専用グループを作ります。送信すると担当者が手動でグループを作り、QR コードをここに送ります。入力はすべて任意です。',
      want: '🙋 専用グループを依頼する', name: 'お名前（任意）', region: '出身', channel: '参加するアプリ', intake: '入学時期', budget: '週の予算（任意）', any: '指定なし',
      submit: '依頼を送る', cancel: 'キャンセル', sent: '依頼を送りました。担当者がグループを作成すると、ここに QR コードが表示されます。', waiting: '担当者の対応待ち…',
      adviser: '担当者', qrTitle: 'あなたの予約サポートグループ', qrWa: 'スマホで読み取るか、ボタンから WhatsApp グループに参加できます。', qrWx: 'WeChat で読み取ってグループに参加してください。',
      openWa: 'WhatsApp で開く', openNote: 'デモ：正式版ではここで WhatsApp が開きます。', team: '担当チーム', demo: 'デモ用 QR コードです。実際のグループには参加しません。',
      SG: 'シンガポール', CN: '中国', JP: '日本', whatsapp: 'WhatsApp グループ', wechat: 'WeChat グループ', about: '物件：' }
  };
  const lang = () => { try { return W[LANG] ? LANG : 'zh'; } catch (_) { return 'zh'; } };
  const w = () => W[lang()];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const home = () => { try { return ctHome; } catch (_) { return null; } };
  const clock = at => { const d = new Date(at); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

  function load() { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && v.id === 'me' ? v : null; } catch (_) { return null; } }
  function save(me) { try { localStorage.setItem(KEY, JSON.stringify(me)); } catch (_) { /* private mode: demo only on this page */ } }
  function favorites() { try { const v = JSON.parse(localStorage.getItem('lsm-favorites-v1')); return Array.isArray(v) ? v.filter(x => typeof x === 'string').slice(0, 10) : []; } catch (_) { return []; } }

  function qrSvg(text) {
    try { const q = window.qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); } catch (_) { return ''; }
  }

  let formOpen = false;
  function render(box) {
    const k = w(), me = load(), h = home();
    box.replaceChildren();
    box.append(el('h4', 'cd-section-title', k.title));
    if (!me || !me.request) {
      box.append(el('p', 'bh-lead', k.lead));
      if (!formOpen) {
        const b = el('button', 'bh-want', k.want); b.type = 'button';
        b.addEventListener('click', () => { formOpen = true; render(box); box.querySelector('select, input')?.focus(); });
        box.append(b);
        return;
      }
      box.append(form(box, h));
      return;
    }
    const log = el('div', 'bh-log');
    const req = me.request;
    log.append(el('p', 'bh-sys', k.sent));
    const reqLine = el('div', 'bh-req');
    reqLine.append(el('b', '', k.want), el('span', '', [req.name, k[req.region], req.intake, req.budget ? '≤ £' + req.budget : '', k[req.channel]].filter(Boolean).join(' · ')));
    if (req.homeName) reqLine.append(el('span', '', k.about + req.homeName));
    log.append(reqLine);
    me.messages.filter(m => m.from === 'agent').forEach(m => {
      if (m.type === 'qr' && me.group) log.append(qrCard(me.group, k));
      else if (m.text) { const b = el('div', 'bh-msg'); b.append(el('span', 'bh-who', `${k.adviser} · ${clock(m.at)}`), el('p', '', m.text)); log.append(b); }
    });
    if (!me.group) log.append(el('p', 'bh-wait', k.waiting));
    box.append(log);
    if (me.studentUnread) { me.studentUnread = 0; save(me); }
  }
  function qrCard(g, k) {
    const team = TEAMS[g.team] || TEAMS.A, wa = g.channel === 'whatsapp';
    const c = el('div', 'bh-qr ' + (wa ? 'wa' : 'wx'));
    c.append(el('span', 'bh-tape'), el('b', 'bh-qrtitle', k.qrTitle), el('span', 'bh-chan', wa ? 'WhatsApp' : '微信 WeChat'));
    const q = el('div', 'bh-code'); q.innerHTML = qrSvg(g.link); c.append(q);
    c.append(el('b', '', g.name), el('p', 'bh-small', wa ? k.qrWa : k.qrWx), el('p', 'bh-small', `${k.team}: ${team[lang()] || team.en} · ${team.members.join(' · ')}`));
    if (wa) {
      const b = el('button', 'bh-open', k.openWa); b.type = 'button';
      const note = el('p', 'bh-small', ''); note.setAttribute('role', 'status');
      b.addEventListener('click', () => { note.textContent = k.openNote; });
      c.append(b, note);
    }
    c.append(el('p', 'bh-small', k.demo));
    return c;
  }
  function field(label, control) { const l = el('label', 'bh-field'); l.append(el('span', '', label), control); return l; }
  function select(id, opts, val) {
    const s = el('select'); s.id = id;
    opts.forEach(([v, t]) => { const o = el('option', '', t); o.value = v; if (String(v) === String(val)) o.selected = true; s.append(o); });
    return s;
  }
  function form(box, h) {
    const k = w(), f = el('form', 'bh-form');
    const region = { en: 'SG', zh: 'CN', ja: 'JP' }[lang()];
    const name = el('input'); name.id = 'bhName'; name.maxLength = 40; name.autocomplete = 'off';
    const reg = select('bhRegion', Object.keys(REGIONS).map(r => [r, `${REGIONS[r].flag} ${k[r]}`]), region);
    const ch = select('bhChannel', [['whatsapp', k.whatsapp], ['wechat', k.wechat]], REGIONS[region].channel);
    reg.addEventListener('change', () => { ch.value = REGIONS[reg.value].channel; });
    const intake = select('bhIntake', ['Sep 2027', 'Jan 2027', 'Sep 2026', 'Jan 2028'].map(v => [v, v]), 'Sep 2027');
    const budget = select('bhBudget', [['', k.any]].concat([180, 200, 250, 300, 400].map(v => [v, '≤ £' + v])), '');
    const grid = el('div', 'bh-grid');
    grid.append(field(k.name, name), field(k.region, reg), field(k.channel, ch), field(k.intake, intake), field(k.budget, budget));
    const row = el('div', 'bh-row'), cancel = el('button', 'cd-quiet', k.cancel), submit = el('button', 'bh-want', k.submit);
    cancel.type = 'button'; submit.type = 'submit';
    cancel.addEventListener('click', () => { formOpen = false; render(box); });
    row.append(cancel, submit);
    f.append(grid, row);
    f.addEventListener('submit', e => {
      e.preventDefault();
      const now = Date.now(), prev = load() || {};
      const viewed = [h && h.id].concat(prev.viewed || []).filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 6);
      const me = { id: 'me', me: true, name: name.value.trim(), region: reg.value, lang: lang(), source: 'Website', status: 'requested',
        viewed, favorites: favorites(), quiz: '', group: null, unread: 1, studentUnread: 0, updated: now,
        request: { name: name.value.trim() || (lang() === 'en' ? 'Student' : lang() === 'ja' ? '学生' : '同学'), region: reg.value, channel: ch.value, intake: intake.value,
          budget: budget.value ? Number(budget.value) : 0, uni: 'uol', room: 'any', homeId: h && h.id, homeName: h && h.name, at: now },
        messages: (prev.messages || []).concat(h ? [{ from: 'student', type: 'home', homeId: h.id, at: now - 1 }] : [], [{ from: 'student', type: 'request', at: now }]) };
      save(me); formOpen = false; render(box);
    });
    return f;
  }

  /* add the section whenever the contact panel is drawn */
  const root = document.getElementById('contactDemo');
  if (!root) return;
  function decorate() {
    if (root.querySelector('.bh')) return;
    const chat = root.querySelector('.cd-chat'); if (!chat) return;
    const box = el('section', 'bh'); box.setAttribute('aria-live', 'polite');
    chat.after(box); render(box);
  }
  new MutationObserver(decorate).observe(root, { childList: true });
  decorate();
  addEventListener('storage', e => { if (e.key === KEY || e.key === null) { const box = root.querySelector('.bh'); if (box) render(box); } });
})();
