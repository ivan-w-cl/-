/* 咨询 = 进群。学生在公寓卡片点「咨询公寓」后，对话框里只有一件事：立即进群。
   - 不填任何资料；按界面语言默认 WhatsApp（英文 / 日文）或微信（中文），可以一键改。
   - 预建群池（group-pool.js）有群时立刻拿到群码；池子空了就通知顾问人工建群，群码稍后回到这里。
   - 一位学生只有一个群：之后再咨询别的公寓，直接显示同一个群码，并把这套公寓转给群里的专家。
   - 右下角有一个消息气泡：顾问发来群码或消息时出现红点和提示；可以拖动，拖到屏幕边缘会收成小箭头。
   Add-on only: the original chat demo stays in the page but is hidden while this mode is on.
   Demo transport: the student's conversation lives in localStorage ('lsm-live-me-v1'), shared with adviser.html. */
(() => {
  'use strict';
  const KEY = 'lsm-live-me-v1', FAB_KEY = 'lsm-chat-fab-v1';
  const TEAMS = {
    A: { zh: '专家团队 A · 市中心与绳索街区', en: 'Team A · City Centre & Ropewalks', ja: 'チームA · シティセンター', members: ['Grace Wong', '陈思琪', 'Tom Hughes'] },
    B: { zh: '专家团队 B · 知识区与乔治亚街区', en: 'Team B · Knowledge & Georgian Quarter', ja: 'チームB · ナレッジ・クォーター', members: ['Daniel Lim', '刘佳', 'Sophie Clarke'] },
    C: { zh: '专家团队 C · 日本学生', en: 'Team C · Students from Japan', ja: 'チームC · 日本人学生', members: ['Kenji Mori', 'Emma Brown'] },
    D: { zh: '专家团队 D · 边山与肯辛顿合租房', en: 'Team D · Edge Hill & Kensington houses', ja: 'チームD · エッジヒル', members: ['Priya Shah', '王磊'] }
  };
  const W = {
    zh: { title: '进群，直接和预定专家聊', lead: '一位学生一个专属群。价格、档期、房型、合同，进群直接问专家，不用在这里填资料。',
      join: '立即进群', via: '将通过 {app} 进群', switchTo: '改用{app}', whatsapp: 'WhatsApp', wechat: '微信',
      waiting: '已通知顾问，正在为你建群…', waitingNote: '群码到了会在右下角提醒你，可以先继续看房。',
      qrTitle: '你的预定专家群', qrWa: '用手机扫码，或点下方按钮加入 WhatsApp 群。', qrWx: '用微信扫码或长按二维码加入群聊。',
      openWa: '在 WhatsApp 中打开', openNote: '演示：正式版会在这里打开 WhatsApp。', team: '你的团队', demo: '演示二维码，扫码不会进入真实群。',
      forwarded: '已把「{home}」发给你的专家群，进群后专家会接着跟你聊。', adviser: '顾问',
      fab: '我的专家群', fabWait: '等待群码', fabReady: '群码已到', fabNew: '新消息', toastQr: '顾问发来了你的专家群二维码', toastMsg: '顾问发来一条消息', open: '打开', show: '显示消息提醒' },
    en: { title: 'Chat with booking experts in your own group', lead: 'One group per student. Ask about prices, dates, rooms and contracts right in the group. No forms here.',
      join: 'Join my group now', via: 'You will join on {app}', switchTo: 'Use {app} instead', whatsapp: 'WhatsApp', wechat: 'WeChat',
      waiting: 'An adviser has been notified and is setting up your group…', waitingNote: 'We will flag it at the bottom right when the code arrives. Keep browsing in the meantime.',
      qrTitle: 'Your booking expert group', qrWa: 'Scan with your phone, or tap the button to join the WhatsApp group.', qrWx: 'Scan or long-press the QR code in WeChat to join.',
      openWa: 'Open in WhatsApp', openNote: 'Demo: the real app opens WhatsApp here.', team: 'Your team', demo: 'Demo QR code. It does not open a real group.',
      forwarded: 'We sent "{home}" to your expert group. The experts will pick it up with you there.', adviser: 'Adviser',
      fab: 'My expert group', fabWait: 'Waiting for code', fabReady: 'Group code ready', fabNew: 'New message', toastQr: 'Your expert group QR code has arrived', toastMsg: 'New message from your adviser', open: 'Open', show: 'Show message reminder' },
    ja: { title: '専用グループで予約サポートと話す', lead: '学生ごとに専用グループを用意します。料金・空室・部屋・契約はグループで直接質問できます。入力は不要です。',
      join: '今すぐグループに参加', via: '{app} で参加します', switchTo: '{app} に変更', whatsapp: 'WhatsApp', wechat: 'WeChat',
      waiting: '担当者に通知しました。グループを作成中です…', waitingNote: 'QR コードが届いたら右下でお知らせします。その間も物件を見られます。',
      qrTitle: 'あなたの予約サポートグループ', qrWa: 'スマホで読み取るか、ボタンから WhatsApp グループに参加できます。', qrWx: 'WeChat で読み取ってグループに参加してください。',
      openWa: 'WhatsApp で開く', openNote: 'デモ：正式版ではここで WhatsApp が開きます。', team: '担当チーム', demo: 'デモ用 QR コードです。実際のグループには参加しません。',
      forwarded: '「{home}」をあなたのグループに共有しました。グループで続きを相談できます。', adviser: '担当者',
      fab: '専用グループ', fabWait: 'QR 待ち', fabReady: 'QR が届きました', fabNew: '新着', toastQr: 'グループの QR コードが届きました', toastMsg: '担当者からメッセージ', open: '開く', show: 'メッセージ通知を表示' }
  };
  const lang = () => { try { return W[LANG] ? LANG : 'zh'; } catch (_) { return 'zh'; } };
  const w = () => W[lang()];
  const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '');
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const btn = (cls, text) => { const b = el('button', cls, text); b.type = 'button'; return b; };
  const ctxHome = () => { try { return ctHome; } catch (_) { return null; } };
  const homeById = id => { try { return HOMES.find(h => h.id === id) || null; } catch (_) { return null; } };
  const clock = at => { const d = new Date(at); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const defaultChannel = () => lang() === 'zh' ? 'wechat' : 'whatsapp';
  const regionOf = () => ({ en: 'SG', zh: 'CN', ja: 'JP' }[lang()]);

  function load() { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && v.id === 'me' ? v : null; } catch (_) { return null; } }
  function save(me) { try { localStorage.setItem(KEY, JSON.stringify(me)); } catch (_) { /* private mode: demo only on this page */ } changed(); }
  function favorites() { try { const v = JSON.parse(localStorage.getItem('lsm-favorites-v1')); return Array.isArray(v) ? v.filter(x => typeof x === 'string').slice(0, 10) : []; } catch (_) { return []; } }
  function qrSvg(text) { try { const q = window.qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); } catch (_) { return ''; } }

  /* ---------- 一键进群 ---------- */
  let chosen = null;   // channel picked in this panel; null = default for the language
  function join(h) {
    const now = Date.now(), channel = chosen || defaultChannel(), prev = load();
    const viewed = [h && h.id].concat((prev && prev.viewed) || []).filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 6);
    const me = { id: 'me', me: true, name: '', region: regionOf(), lang: lang(), source: 'Website', status: 'requested',
      viewed, favorites: favorites(), quiz: '', group: null, unread: 1, studentUnread: 0, updated: now,
      request: { name: { en: 'Website student', zh: '网站学生', ja: 'サイトの学生' }[lang()], region: regionOf(), channel, intake: '', budget: 0, uni: 'uol', room: 'any',
        homeId: h && h.id, homeName: h && h.name, at: now, oneTap: true },
      messages: (h ? [{ from: 'student', type: 'home', homeId: h.id, at: now - 1 }] : []).concat([{ from: 'student', type: 'request', at: now }]) };
    const g = window.GroupPool && window.GroupPool.take(channel);
    if (g) {
      me.group = { team: g.team, channel: g.channel, name: g.name, link: g.link, at: now, auto: true };
      me.status = 'qr_sent';
      me.messages.push({ from: 'agent', type: 'qr', at: now + 1, auto: true });
    }
    save(me);
    const homes = h ? [{ n: h.n, name: h.name }] : [];
    if (window.MailOutbox) window.MailOutbox.add(me.group ? 'auto' : 'request', me, homes);
  }
  /* 已经有群时，再咨询别的公寓：转给同一个群 */
  function forward(me, h) {
    if (!h || me.messages.some(m => m.type === 'home' && m.homeId === h.id)) return;
    me.messages.push({ from: 'student', type: 'home', homeId: h.id, at: Date.now(), forwarded: true });
    me.viewed = [h.id].concat(me.viewed || []).filter((x, i, a) => a.indexOf(x) === i).slice(0, 6);
    me.unread = (me.unread || 0) + 1; me.updated = Date.now();
    save(me);
    if (window.MailOutbox) window.MailOutbox.add('forward', me, [{ n: h.n, name: h.name }]);
  }

  function render(box) {
    const k = w(), me = load(), h = ctxHome();
    box.replaceChildren();
    if (!me || !me.request) {
      const channel = chosen || defaultChannel(), other = channel === 'wechat' ? 'whatsapp' : 'wechat';
      box.append(el('h4', 'bh-title', k.title), el('p', 'bh-lead', k.lead));
      const go = btn('bh-join ' + channel, k.join);
      go.addEventListener('click', () => join(h));
      const sw = btn('bh-switch', fmt(k.switchTo, { app: k[other] }));
      sw.addEventListener('click', () => { chosen = other; render(box); box.querySelector('.bh-join').focus(); });
      const via = el('p', 'bh-via', fmt(k.via, { app: k[channel] + ' ' })); via.append(' · ', sw);
      box.append(go, via);
      return;
    }
    if (me.group && h && h.id !== me.request.homeId) forward(me, h);
    const log = el('div', 'bh-log');
    if (me.group) log.append(qrCard(me.group, k));
    else { log.append(el('p', 'bh-wait', k.waiting), el('p', 'bh-small', k.waitingNote)); }
    if (me.group && h && me.messages.some(m => m.forwarded && m.homeId === h.id)) log.append(el('p', 'bh-sys', fmt(k.forwarded, { home: h.name })));
    me.messages.filter(m => m.from === 'agent' && m.text).forEach(m => {
      const b = el('div', 'bh-msg'); b.append(el('span', 'bh-who', `${k.adviser} · ${clock(m.at)}`), el('p', '', m.text)); log.append(b);
    });
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
      const b = btn('bh-open', k.openWa), note = el('p', 'bh-small', ''); note.setAttribute('role', 'status');
      b.addEventListener('click', () => { note.textContent = k.openNote; });
      c.append(b, note);
    }
    c.append(el('p', 'bh-small', k.demo));
    return c;
  }

  /* ---------- 对话框：只保留进群 ---------- */
  const root = document.getElementById('contactDemo');
  if (!root) return;
  function decorate() {
    const who = document.getElementById('ctWho');
    if (who) who.textContent = { zh: '预定专家群 · 演示', en: 'Booking expert group · demo', ja: '予約サポートグループ · デモ' }[lang()];
    if (root.querySelector('.bh')) return;
    const chat = root.querySelector('.cd-chat'); if (!chat) return;
    root.classList.add('bh-only');
    const box = el('section', 'bh'); box.setAttribute('aria-live', 'polite');
    chat.before(box); render(box);
  }
  const panelOpen = () => { const wrap = document.getElementById('contactWrap'); return wrap && !wrap.hidden; };

  /* ---------- 消息气泡：可拖动，拖到边缘收成小箭头 ---------- */
  const fab = (() => {
    const node = btn('bh-fab'), tip = el('div', 'bh-tip'); tip.hidden = true; node.hidden = true;
    const ico = el('span', 'bh-fab-ico', '💬'), label = el('span', 'bh-fab-label'), dot = el('span', 'bh-dot');
    node.append(ico, label, dot); document.body.append(node, tip);
    let pos = null; try { pos = JSON.parse(localStorage.getItem(FAB_KEY)); } catch (_) { pos = null; }
    const vw = () => document.documentElement.clientWidth, vh = () => window.innerHeight;
    const persist = () => { try { localStorage.setItem(FAB_KEY, JSON.stringify(pos)); } catch (_) { /* ignore */ } };
    function place() {
      const r = node.getBoundingClientRect(), wdt = r.width || 160, hgt = r.height || 48;
      if (!pos) { node.style.left = ''; node.style.top = ''; node.style.right = ''; node.style.bottom = ''; return; }
      const y = Math.max(70, Math.min(pos.y, vh() - hgt - 90));
      node.style.top = y + 'px'; node.style.bottom = 'auto';
      if (pos.dock === 'left') { node.style.left = '0px'; node.style.right = 'auto'; }
      else if (pos.dock === 'right') { node.style.right = '0px'; node.style.left = 'auto'; }
      else { node.style.left = Math.max(8, Math.min(pos.x, vw() - wdt - 8)) + 'px'; node.style.right = 'auto'; }
    }
    function sync() {
      const me = load(), k = w();
      node.hidden = !(me && me.request) || panelOpen();
      if (node.hidden) { tip.hidden = true; return; }
      const unread = me.studentUnread || 0;
      label.textContent = unread ? k.fabNew : me.group ? k.fabReady : k.fabWait;
      dot.textContent = unread ? String(unread) : ''; dot.hidden = !unread;
      node.classList.toggle('docked', !!(pos && pos.dock)); node.classList.toggle('left', !!(pos && pos.dock === 'left')); node.classList.toggle('right', !!(pos && pos.dock === 'right'));
      node.classList.toggle('waiting', !me.group);
      ico.textContent = pos && pos.dock ? (pos.dock === 'left' ? '▶' : '◀') : '💬';
      node.setAttribute('aria-label', (pos && pos.dock ? k.show + ' · ' : '') + k.fab + ' · ' + label.textContent);
      node.title = k.fab;
      place();
    }
    function say(text) {
      const k = w(); tip.replaceChildren(el('span', '', text)); const o = btn('bh-tip-open', k.open); o.addEventListener('click', openIt); tip.append(o);
      tip.hidden = false; const r = node.getBoundingClientRect();
      tip.style.top = Math.max(8, r.top - 54) + 'px';
      if (r.left > vw() / 2) { tip.style.right = Math.max(8, vw() - r.right) + 'px'; tip.style.left = 'auto'; } else { tip.style.left = Math.max(8, r.left) + 'px'; tip.style.right = 'auto'; }
      clearTimeout(say.t); say.t = setTimeout(() => { tip.hidden = true; }, 6000);
    }
    function openIt() {
      tip.hidden = true;
      const me = load(), h = me && (homeById(me.request.homeId) || homeById((me.viewed || [])[0]));
      if (h) { try { openContact(h); } catch (_) { /* page not ready */ } }
    }
    let drag = null, tapped = 0;
    node.addEventListener('pointerdown', e => { if (e.button > 0) return; const r = node.getBoundingClientRect(); drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, moved: false }; try { node.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } });
    node.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.moved) { if (Math.hypot(dx, dy) < 8) return; drag.moved = true; node.classList.add('dragging'); node.classList.remove('docked', 'left', 'right'); ico.textContent = '💬'; }
      e.preventDefault();
      node.style.left = (drag.ox + dx) + 'px'; node.style.top = (drag.oy + dy) + 'px'; node.style.right = 'auto'; node.style.bottom = 'auto';
    });
    const end = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null;
      if (!d.moved) { tapped = Date.now(); if (pos && pos.dock) { pos.dock = null; pos.x = pos.x == null ? 16 : pos.x; persist(); sync(); } else openIt(); return; }
      node.classList.remove('dragging'); tapped = Date.now();   // the click that follows a drag is not a tap
      const r = node.getBoundingClientRect();
      const dock = r.left < 24 ? 'left' : r.right > vw() - 24 ? 'right' : null;
      pos = { x: dock === 'left' ? 16 : dock === 'right' ? vw() - r.width - 16 : r.left, y: r.top, dock };
      persist(); sync();
    };
    node.addEventListener('pointerup', end); node.addEventListener('pointercancel', () => { drag = null; node.classList.remove('dragging'); sync(); });
    node.addEventListener('click', e => { e.stopPropagation(); if (Date.now() - tapped < 600) return; if (pos && pos.dock) { pos.dock = null; persist(); sync(); } else openIt(); });
    tip.addEventListener('click', e => e.stopPropagation());
    addEventListener('resize', place);
    return { sync, say };
  })();

  /* ---------- 同步：顾问后台在别的标签页 / 框架里改了数据 ---------- */
  let lastAgent = (() => { const me = load(); return me ? me.messages.filter(m => m.from === 'agent').length : 0; })();
  function changed() {
    const box = root.querySelector('.bh');
    if (box && panelOpen()) render(box);
    const me = load(), n = me ? me.messages.filter(m => m.from === 'agent').length : 0;
    if (n > lastAgent && !panelOpen()) { const m = me.messages[me.messages.length - 1]; fab.sync(); fab.say(m.type === 'qr' ? w().toastQr : w().toastMsg); }
    lastAgent = n;
    fab.sync();
  }
  addEventListener('storage', e => { if (e.key === KEY || e.key === null) changed(); });
  new MutationObserver(decorate).observe(root, { childList: true });
  decorate();
  const wrap = document.getElementById('contactWrap');
  if (wrap) new MutationObserver(() => fab.sync()).observe(wrap, { attributes: true, attributeFilter: ['hidden'] });
  fab.sync();
})();
