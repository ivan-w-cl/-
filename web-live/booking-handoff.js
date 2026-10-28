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
      code: '你的咨询编号 {code}', codeNote: '不用登录、不用留资料，专家用这个编号为你建群。', sending: '正在通知专家…', failed: '没连上服务器，请稍后再试。',
      askH: '先问一个小问题', askPh: '比如：还有房吗？', ask: '问', ai: 'AI 助手（演示）', you: '你',
      chips: ['还有房吗？', '每周多少钱？', '离学校多远？', '包水电网吗？', '可以两个人住吗？'],
      nudge: '这类问题需要专家查实时房态和合同，进群直接问最快：', nudge2: '看起来你在认真考虑「{home}」，要不要直接进群和专家确认？',
      validTill: '群二维码有效期至 {d}（微信群码 7 天有效）', expired: '这个群二维码已过期。', renew: '申请新群码', renewed: '已通知专家，新的群码会发到这里。',
      fab: '我的专家群', fabWait: '等待群码', fabReady: '群码已到', fabNew: '新消息', toastQr: '顾问发来了你的专家群二维码', toastMsg: '顾问发来一条消息', open: '打开', show: '显示消息提醒' },
    en: { title: 'Chat with booking experts in your own group', lead: 'One group per student. Ask about prices, dates, rooms and contracts right in the group. No forms here.',
      join: 'Join my group now', via: 'You will join on {app}', switchTo: 'Use {app} instead', whatsapp: 'WhatsApp', wechat: 'WeChat',
      waiting: 'An adviser has been notified and is setting up your group…', waitingNote: 'We will flag it at the bottom right when the code arrives. Keep browsing in the meantime.',
      qrTitle: 'Your booking expert group', qrWa: 'Scan with your phone, or tap the button to join the WhatsApp group.', qrWx: 'Scan or long-press the QR code in WeChat to join.',
      openWa: 'Open in WhatsApp', openNote: 'Demo: the real app opens WhatsApp here.', team: 'Your team', demo: 'Demo QR code. It does not open a real group.',
      forwarded: 'We sent "{home}" to your expert group. The experts will pick it up with you there.', adviser: 'Adviser',
      code: 'Your request code {code}', codeNote: 'No sign-up, no personal details. The experts use this code to set up your group.', sending: 'Notifying the experts…', failed: 'Could not reach the server. Please try again.',
      askH: 'Ask a quick question first', askPh: 'e.g. Is a room still available?', ask: 'Ask', ai: 'AI assistant (demo)', you: 'You',
      chips: ['Any rooms left?', 'How much per week?', 'How far from campus?', 'Are bills included?', 'Can two people share?'],
      nudge: 'Live availability and contracts need an expert. The quickest way is to ask in your group:', nudge2: 'Looks like you are serious about "{home}". Confirm it with an expert in your group?',
      validTill: 'QR code valid until {d} (WeChat group codes last 7 days)', expired: 'This group QR code has expired.', renew: 'Ask for a new code', renewed: 'The experts have been notified. A new code will appear here.',
      fab: 'My expert group', fabWait: 'Waiting for code', fabReady: 'Group code ready', fabNew: 'New message', toastQr: 'Your expert group QR code has arrived', toastMsg: 'New message from your adviser', open: 'Open', show: 'Show message reminder' },
    ja: { title: '専用グループで予約サポートと話す', lead: '学生ごとに専用グループを用意します。料金・空室・部屋・契約はグループで直接質問できます。入力は不要です。',
      join: '今すぐグループに参加', via: '{app} で参加します', switchTo: '{app} に変更', whatsapp: 'WhatsApp', wechat: 'WeChat',
      waiting: '担当者に通知しました。グループを作成中です…', waitingNote: 'QR コードが届いたら右下でお知らせします。その間も物件を見られます。',
      qrTitle: 'あなたの予約サポートグループ', qrWa: 'スマホで読み取るか、ボタンから WhatsApp グループに参加できます。', qrWx: 'WeChat で読み取ってグループに参加してください。',
      openWa: 'WhatsApp で開く', openNote: 'デモ：正式版ではここで WhatsApp が開きます。', team: '担当チーム', demo: 'デモ用 QR コードです。実際のグループには参加しません。',
      forwarded: '「{home}」をあなたのグループに共有しました。グループで続きを相談できます。', adviser: '担当者',
      code: 'あなたの相談番号 {code}', codeNote: '登録も個人情報も不要です。担当者はこの番号でグループを作ります。', sending: '担当者に通知中…', failed: 'サーバーに接続できませんでした。もう一度お試しください。',
      askH: 'まずは気軽に質問', askPh: '例：まだ空いていますか？', ask: '質問', ai: 'AI アシスタント（デモ）', you: 'あなた',
      chips: ['まだ空いていますか？', '週いくらですか？', '大学まで遠いですか？', '光熱費込みですか？', '2人で住めますか？'],
      nudge: '最新の空室や契約は担当者の確認が必要です。グループで聞くのが一番早いです：', nudge2: '「{home}」を本気で検討中のようです。グループで担当者に確認しませんか？',
      validTill: 'QR コードの有効期限：{d}（WeChat グループのコードは 7 日間）', expired: 'このグループ QR コードは期限切れです。', renew: '新しいコードを依頼', renewed: '担当者に通知しました。新しいコードはここに届きます。',
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

  /* ---------- 进群前的小问题：AI 助手先回答，再引导进群 ----------
     演示用规则回答，只用页面里已有的数据（价格、步行时间）。正式版可换成 AI（例如 Claude），规则不变：
     只根据房源资料回答，不承诺空房和价格；问到房态、预定、合同，或聊了两轮，就请学生进群找专家确认。 */
  const qa = [];   // 这次对话的问答，进群时一起交给专家
  function answer(q, h) {
    const t = q.toLowerCase(), lg = lang(), name = h ? h.name : '';
    const price = h ? [h.pe && (lg === 'en' ? `en-suite from £${h.pe}` : `独卫 £${h.pe} 起`), h.ps && (lg === 'en' ? `studio from £${h.ps}` : `Studio £${h.ps} 起`), !h.pe && !h.ps && h.plo && `£${h.plo}`].filter(Boolean).join(lg === 'en' ? ', ' : '，') : '';
    const L3 = (zh, en, ja) => ({ zh, en, ja }[lg] || en);
    if (/有房|空房|还有|满了|available|any rooms|vacan|空き|空いて|book|预定|预订|订|合同|contract|契約/.test(t))
      return { text: L3(`${name} 的房态每天都在变，我这里只有 2026-10-17 的历史记录${h && h.pso ? '（当时显示无房）' : ''}，没法确认现在有没有房。`, `Availability at ${name} changes daily. I only have a record from 17 Oct 2026${h && h.pso ? ' (no rooms listed then)' : ''}, so I can't confirm what's free now.`, `${name} の空室は毎日変わります。手元には 2026/10/17 の記録しかなく、現在の空室は確認できません。`), push: true };
    if (/多少钱|价格|租金|贵|便宜|price|cost|rent|how much|per week|いくら|料金|家賃/.test(t))
      return { text: price ? L3(`${name} 的历史参考价：${price}／周。账单、合同长度和房型会影响总价。`, `Recorded prices at ${name}: ${price} per week. Bills, contract length and room type change the total.`, `${name} の参考価格：${price}／週。光熱費や契約期間で総額が変わります。`) : L3(`${name} 暂时没有记录参考价。`, `No recorded price for ${name} yet.`, `${name} の参考価格は未記録です。`), push: false };
    if (/远|多久|步行|学校|大学|far|walk|campus|distance|uni|遠い|徒歩|大学/.test(t))
      return { text: h ? L3(`步行到利物浦大学约 ${h.uol} 分钟，到 LJMU 约 ${h.ljmu} 分钟，到莱姆街火车站约 ${h.lime} 分钟（按距离估算）。`, `About ${h.uol} min walk to the University of Liverpool, ${h.ljmu} min to LJMU and ${h.lime} min to Lime Street (distance estimates).`, `リバプール大学まで徒歩約 ${h.uol} 分、LJMU まで約 ${h.ljmu} 分（距離からの推定）。`) : '', push: false };
    if (/水电|网|账单|bill|wifi|utilit|光熱|ネット/.test(t))
      return { text: L3('利物浦的学生公寓大多包水电网，但每家合同不一样，需要按这一套的合同确认。', 'Most Liverpool student homes include bills and Wi-Fi, but each contract differs, so it needs checking for this one.', 'リバプールの学生寮は多くが光熱費込みですが、契約ごとに異なるため確認が必要です。'), push: true };
    if (/两个人|情侣|伴侣|couple|two people|share|2人|カップル/.test(t))
      return { text: L3('部分公寓的一居室或 Studio 可以两人入住，要看具体房型和公寓规定。', 'Some one-bed flats and studios allow two people, depending on the room type and building rules.', '一部の 1ベッドやスタジオは 2 人入居可能です。部屋タイプと規約によります。'), push: true };
    return { text: L3('这个问题专家在群里回答会更准确。', 'An expert in your group can answer that more accurately.', 'この質問はグループで担当者が答える方が正確です。'), push: true };
  }

  /* ---------- 咨询编号：学生不注册，一个编号 = 一个专属群 ---------- */
  const ABC = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  const demoCode = () => 'LSM-' + Array.from(crypto.getRandomValues(new Uint8Array(4)), b => ABC[b % ABC.length]).join('');
  const API = () => window.CaseAPI && window.CaseAPI.enabled;
  /* 抢房计划（booking-prep.js）：进群时一起交给顾问；之后学生改计划，syncPlans 同步过去 */
  const plansNow = () => { try { return window.BookingPrep ? window.BookingPrep.plans() : []; } catch (_) { return []; } };
  function syncPlans(list) {
    const me = load(); if (!me || !me.request) return;
    if (me.server) { if (API()) window.CaseAPI.plans(list).catch(() => { /* 下次改计划再同步 */ }); return; }
    me.plans = list; me.plansAt = Date.now(); me.updated = Date.now(); save(me);
  }
  window.BookingHandoff = { syncPlans, joined: () => { const me = load(); return !!(me && me.request); } };
  /* 服务器返回的 case → 本页使用的会话格式（和演示模式相同，渲染代码不用分两套） */
  function toMe(c, prev) {
    const t = x => (x ? Date.parse(x) : null), first = c.homes && c.homes[0], prevAgent = prev ? prev.messages.filter(m => m.from === 'agent' && !m.ai).length : 0;
    const msgs = (c.homes || []).map((hh, i) => ({ from: 'student', type: 'home', homeId: hh.id, at: t(c.createdAt) - 10 + i, forwarded: i > 0 }))
      .concat([{ from: 'student', type: 'request', at: t(c.requestedAt) }]);
    if (c.group) msgs.push({ from: 'agent', type: 'qr', at: t(c.group.at) });
    (c.messages || []).forEach(m => msgs.push({ from: 'agent', text: m.text, at: t(m.at) }));
    const agentNow = msgs.filter(m => m.from === 'agent').length;
    return { id: 'me', me: true, server: true, caseId: c.id, code: c.code, region: c.region, lang: c.lang, status: c.status, channel: c.channel,
      viewed: (c.homes || []).map(hh => hh.id), messages: msgs, updated: Date.now(),
      studentUnread: ((prev && prev.studentUnread) || 0) + Math.max(0, prev ? agentNow - prevAgent : 0),
      request: { name: c.code, channel: c.channel, homeId: first && first.id, homeName: first && first.name, at: t(c.requestedAt), oneTap: true },
      group: c.group ? { ...c.group, image: c.group.image ? window.CaseAPI.media(c.group.image) : '', at: t(c.group.at), expiresAt: t(c.group.expiresAt) } : null };
  }
  let busy = '';
  function setBusy(v) { busy = v; const box = root.querySelector('.bh'); if (box) render(box); }
  async function poll() {
    if (!API() || !window.CaseAPI.stored() || document.hidden) return;
    try { const c = await window.CaseAPI.get(); if (!c) return; const prev = load(), next = toMe(c, prev);
      if (!prev || JSON.stringify([prev.status, prev.group, prev.messages.length, prev.viewed]) !== JSON.stringify([next.status, next.group, next.messages.length, next.viewed])) save(next); } catch (_) { /* offline: try again later */ }
  }

  /* ---------- 一键进群 ---------- */
  let chosen = null;   // channel picked in this panel; null = default for the language
  async function join(h) {
    if (busy) return;
    if (API()) {
      setBusy('sending');
      try {
        const sp = new URLSearchParams(location.search);
        const c = await window.CaseAPI.create({ lang: lang(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone || '', channel: chosen || defaultChannel(),
          homes: h ? [{ id: h.id, n: h.n, name: h.name }] : [], qa: qa.map(x => ({ q: x.q, a: x.a })), plans: plansNow(), source: sp.get('ref') || sp.get('utm_source') || '' });
        busy = ''; save(toMe(c, null));
      } catch (_) { setBusy('failed'); }
      return;
    }
    const now = Date.now(), channel = chosen || defaultChannel(), prev = load(), code = (prev && prev.code) || demoCode();
    const viewed = [h && h.id].concat((prev && prev.viewed) || []).filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 6);
    const me = { id: 'me', me: true, code, name: '', region: regionOf(), lang: lang(), source: 'Website', status: 'requested',
      viewed, favorites: favorites(), quiz: '', plans: plansNow(), plansAt: now, group: null, unread: 1, studentUnread: 0, updated: now,
      request: { name: code, region: regionOf(), channel, intake: '', budget: 0, uni: 'uol', room: 'any',
        homeId: h && h.id, homeName: h && h.name, at: now, oneTap: true },
      messages: (h ? [{ from: 'student', type: 'home', homeId: h.id, at: now - 1 - qa.length * 2 }] : []).concat(qa.flatMap((x, i) => [{ from: 'student', text: x.q, at: now - (qa.length - i) * 2 }, { from: 'agent', text: x.a, ai: true, at: now - (qa.length - i) * 2 + 1 }]), [{ from: 'student', type: 'request', at: now }]) };
    const g = window.GroupPool && window.GroupPool.take(channel);
    if (g) {
      me.group = { team: g.team, channel: g.channel, name: g.name, link: g.link, at: now, auto: true, expiresAt: g.channel === 'wechat' ? now + 7 * 864e5 : null };
      me.status = 'qr_sent';
      me.messages.push({ from: 'agent', type: 'qr', at: now + 1, auto: true });
    }
    save(me);
    const homes = h ? [{ n: h.n, name: h.name }] : [];
    if (window.MailOutbox) window.MailOutbox.add(me.group ? 'auto' : 'request', me, homes);
  }
  /* 微信群码过期：学生一键申请新群码，专家收到提醒后重新发 */
  function renew() {
    const me = load(); if (!me) return;
    if (me.server) { window.CaseAPI.renew().then(c => save(toMe(c, load()))).catch(() => setBusy('failed')); return; }
    const now = Date.now();
    me.status = 'requested'; me.request = Object.assign({}, me.request, { at: now, renew: true }); me.unread = (me.unread || 0) + 1; me.updated = now;
    me.messages.push({ from: 'student', type: 'request', at: now, renew: true });
    me.group = null;
    save(me);
    if (window.MailOutbox) window.MailOutbox.add('request', me, me.request.homeName ? [{ n: '', name: me.request.homeName }] : []);
  }
  /* 已经有群时，再咨询别的公寓：转给同一个群 */
  function forward(me, h) {
    if (!h || me.messages.some(m => m.type === 'home' && m.homeId === h.id)) return;
    me.messages.push({ from: 'student', type: 'home', homeId: h.id, at: Date.now(), forwarded: true });
    me.viewed = [h.id].concat(me.viewed || []).filter((x, i, a) => a.indexOf(x) === i).slice(0, 6);
    me.unread = (me.unread || 0) + 1; me.updated = Date.now();
    save(me);
    if (me.server) { window.CaseAPI.addHome({ id: h.id, n: h.n, name: h.name }).catch(() => {}); return; }
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
      if (busy) { go.disabled = busy === 'sending'; box.append(go, el('p', busy === 'failed' ? 'bh-small bh-warn' : 'bh-small', busy === 'failed' ? k.failed : k.sending)); if (busy === 'failed') busy = ''; }
      else box.append(go);
      box.append(via, askBlock(box, h));
      return;
    }
    if (me.group && h && h.id !== me.request.homeId) forward(me, h);
    const log = el('div', 'bh-log');
    if (me.group) log.append(qrCard(me.group, k));
    else { log.append(el('p', 'bh-wait', k.waiting), el('p', 'bh-small', k.waitingNote)); }
    if (me.code) { const cd = el('div', 'bh-codebox'); cd.append(el('b', '', fmt(k.code, { code: me.code })), el('span', '', k.codeNote)); log.append(cd); }
    if (me.group && h && me.messages.some(m => m.forwarded && m.homeId === h.id)) log.append(el('p', 'bh-sys', fmt(k.forwarded, { home: h.name })));
    me.messages.filter(m => m.from === 'agent' && m.text && !m.ai).forEach(m => {
      const b = el('div', 'bh-msg'); b.append(el('span', 'bh-who', `${k.adviser} · ${clock(m.at)}`), el('p', '', m.text)); log.append(b);
    });
    box.append(log);
    if (me.studentUnread) { me.studentUnread = 0; save(me); }
  }
  function askBlock(box, h) {
    const k = w(), sec = el('div', 'bh-ask');
    sec.append(el('p', 'bh-askh', k.askH));
    const log = el('div', 'bh-qa');
    qa.filter(x => !h || x.home === h.id).forEach(x => {
      const me = el('div', 'bh-q'); me.append(el('span', 'bh-who', k.you), el('p', '', x.q));
      const ai = el('div', 'bh-a'); ai.append(el('span', 'bh-who', k.ai), el('p', '', x.a));
      log.append(me, ai);
      if (x.push) { const n = el('div', 'bh-nudge'); n.append(el('p', '', k.nudge)); const g = btn('bh-join small ' + (chosen || defaultChannel()), k.join); g.addEventListener('click', () => join(h)); n.append(g); log.append(n); }
    });
    const asked = qa.filter(x => !h || x.home === h.id);
    if (asked.length >= 2 && !asked.some(x => x.push) && h) { const n = el('div', 'bh-nudge'); n.append(el('p', '', fmt(k.nudge2, { home: h.name }))); const g = btn('bh-join small ' + (chosen || defaultChannel()), k.join); g.addEventListener('click', () => join(h)); n.append(g); log.append(n); }
    if (log.childNodes.length) sec.append(log);
    const chips = el('div', 'bh-chips');
    k.chips.forEach(c => { const b = btn('bh-chip', c); b.addEventListener('click', () => ask(c)); chips.append(b); });
    const f = el('form', 'bh-askf'), inp = el('input'); inp.id = 'bhAsk'; inp.placeholder = k.askPh; inp.maxLength = 120; inp.autocomplete = 'off';
    inp.setAttribute('aria-label', k.askH);
    const s2 = el('button', 'bh-askb', k.ask); s2.type = 'submit'; f.append(inp, s2);
    f.addEventListener('submit', e => { e.preventDefault(); ask(inp.value); });
    function ask(q) {
      q = String(q || '').trim().slice(0, 120); if (!q) return;
      const r = answer(q, h); qa.push({ q, a: r.text, push: r.push, home: h && h.id });
      render(box);
      const last = box.querySelector('.bh-qa'); if (last) last.lastElementChild.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    sec.append(chips, f);
    return sec;
  }
  function qrCard(g, k) {
    const team = TEAMS[g.team] || TEAMS.A, wa = g.channel === 'whatsapp';
    const c = el('div', 'bh-qr ' + (wa ? 'wa' : 'wx'));
    c.append(el('span', 'bh-tape'), el('b', 'bh-qrtitle', k.qrTitle), el('span', 'bh-chan', wa ? 'WhatsApp' : '微信 WeChat'));
    const q = el('div', 'bh-code');
    if (g.image) { const img = el('img'); img.src = g.image; img.alt = k.qrTitle; q.append(img); } else q.innerHTML = qrSvg(g.link);   // 微信：专家上传的群二维码图片
    c.append(q);
    c.append(el('b', '', g.name), el('p', 'bh-small', wa ? k.qrWa : k.qrWx), el('p', 'bh-small', `${k.team}: ${team[lang()] || team.en} · ${team.members.join(' · ')}`));
    if (g.expiresAt) {
      const expired = Date.now() > g.expiresAt, d = new Date(g.expiresAt).toLocaleDateString(lang() === 'en' ? 'en-GB' : lang() === 'ja' ? 'ja-JP' : 'zh-CN', { month: 'short', day: 'numeric' });
      if (expired) { c.classList.add('expired'); const r = btn('bh-open', k.renew); r.addEventListener('click', renew); c.append(el('p', 'bh-small bh-warn', k.expired), r); }
      else c.append(el('p', 'bh-small', fmt(k.validTill, { d })));
    }
    const real = !!(API() && (load() || {}).server);
    if (wa && real && /^https:\/\/chat\.whatsapp\.com\//.test(g.link)) { const a = el('a', 'bh-open', k.openWa); a.href = g.link; a.target = '_blank'; a.rel = 'noopener'; c.append(a); }
    else if (wa) {
      const b = btn('bh-open', k.openWa), note = el('p', 'bh-small', ''); note.setAttribute('role', 'status');
      b.addEventListener('click', () => { note.textContent = k.openNote; });
      c.append(b, note);
    }
    if (!real) c.append(el('p', 'bh-small', k.demo));
    return c;
  }

  /* ---------- 对话框：只保留进群 ---------- */
  const root = document.getElementById('contactDemo');
  if (!root) return;
  function decorate() {
    const who = document.getElementById('ctWho');
    if (who) who.textContent = API() ? { zh: '预定专家群', en: 'Booking expert group', ja: '予約サポートグループ' }[lang()] : { zh: '预定专家群 · 演示', en: 'Booking expert group · demo', ja: '予約サポートグループ · デモ' }[lang()];
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
  /* 连着服务器时：每 6 秒查一次群码（页面在后台时暂停），回到页面时马上查 */
  if (window.CaseAPI) window.CaseAPI.ready.then(on => {
    if (!on) return;
    const cur = load(); if (cur && !cur.server) localStorage.removeItem(KEY);   // 本地演示留下的数据不要混进真实咨询
    poll(); setInterval(poll, 6000); document.addEventListener('visibilitychange', poll); fab.sync();
  });
  const wrap = document.getElementById('contactWrap');
  if (wrap) new MutationObserver(() => fab.sync()).observe(wrap, { attributes: true, attributeFilter: ['hidden'] });
  fab.sync();
})();
