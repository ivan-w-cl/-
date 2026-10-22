/* 复制自 web-demo/js/admin.js（没有选中会话时默认打开第一条待建群）。顾问后台（网页版）：会话列表、学生上下文、建群并发送 QR、状态流转；数据看板。 */
(function (root) {
  'use strict';
  const { HM } = root.Core;
  const D = root.DemoData, U = root.UI, Store = root.Store;
  const { esc, fmt } = U;

  let el, tab = 'inbox', current = 'me', filter = 'all', query = '', modal = null, reply = '';
  const lang = () => Store.s.demoLang;
  const a = () => U.A(lang());
  const isDone = c => ['joined', 'booked'].includes(c.status);
  const nameOf = c => c.me ? (c.name ? c.name + ' · ' : '') + a().you : c.name;

  function statusPill(s) { return `<span class="pill st-${s}">${esc(a()['st_' + s])}</span>`; }
  function regionTag(c) { const r = D.REGIONS[c.region]; return `<span class="rtag">${r.flag} ${esc(U.L(r, lang()))}</span>`; }

  function list() {
    const A = a();
    let cs = Store.s.conversations.slice();
    if (filter === 'need') cs = cs.filter(c => c.status === 'requested');
    if (filter === 'active') cs = cs.filter(c => ['chatting', 'qr_sent'].includes(c.status));
    if (filter === 'done') cs = cs.filter(isDone);
    if (query) cs = cs.filter(c => nameOf(c).toLowerCase().includes(query.toLowerCase()));
    cs.sort((x, y) => (y.status === 'requested') - (x.status === 'requested') || y.updated - x.updated);
    const need = Store.s.conversations.filter(c => c.status === 'requested').length;
    return `<div class="convlist">
      <div class="lhead"><label class="sr" for="convSearch">${esc(A.search)}</label><input id="convSearch" type="search" placeholder="${esc(A.search)}" value="${esc(query)}">
        <div class="segs" role="tablist">${[['all', A.all], ['need', A.needGroup + (need ? ' · ' + need : '')], ['active', A.active], ['done', A.done]].map(([k, l]) =>
          `<button role="tab" aria-selected="${filter === k}" class="${filter === k ? 'on' : ''} ${k === 'need' && need ? 'alert' : ''}" data-filter="${k}">${esc(l)}</button>`).join('')}</div></div>
      <ul>${cs.map(c => { const last = c.messages[c.messages.length - 1];
        return `<li><button class="conv ${c.id === current ? 'on' : ''} ${c.status === 'requested' ? 'needs' : ''}" data-conv="${c.id}">
          <span class="av ${c.me ? 'me' : ''}">${esc(nameOf(c).slice(0, 1))}</span>
          <span class="grow"><span class="row between"><b>${esc(nameOf(c))}</b><span class="fine">${esc(U.ago(c.updated, lang()))}</span></span>
          <span class="row between"><span class="fine trunc">${esc(preview(last))}</span>${c.unread ? `<span class="badge-dot">${c.unread}</span>` : ''}</span>
          <span class="row gap">${regionTag(c)}${statusPill(c.status)}</span></span></button></li>`; }).join('')}</ul></div>`;
  }
  function preview(m) {
    if (!m) return '';
    const lg = lang();
    if (m.type === 'welcome') return lg === 'en' ? 'Welcome message' : '欢迎语';
    if (m.type === 'home') { const h = HM.byId(m.homeId); return '🏠 ' + (h ? h.name : ''); }
    if (m.type === 'request') return '🙋 ' + a().newReq;
    if (m.type === 'qr') return '▦ ' + a().sentQr;
    return m.text || '';
  }

  function thread() {
    const c = Store.conv(current), A = a(), lg = lang();
    if (!c) return `<div class="thread empty"><p class="muted">${esc(A.noConv)}</p></div>`;
    const msgs = c.messages.map(m => {
      const side = m.from === 'agent' ? 'out' : 'in';
      let body;
      if (m.type === 'welcome') body = `<div class="bubble">${esc(U.T(c.lang).welcome)}</div>`;
      else if (m.type === 'home') { const h = HM.byId(m.homeId), r = m.room != null ? D.roomsFor(h).types[m.room] : null, cover = D.coverPhoto(h);
        body = `<div class="ctxcard">${cover ? `<img src="${cover}" alt="">` : `<span class="hc-num">${h.n}</span>`}<span><span class="fine">${esc(A.viewed)}</span><b>${h.n} · ${esc(h.name)}</b><span>${r ? esc(r.name + ' · ' + r.price + '/wk') : esc(U.fromPrice(h, lg))}</span></span></div>`; }
      else if (m.type === 'request') body = `<div class="bubble req"><b>🙋 ${esc(A.newReq)}</b>${reqLines(c)}</div>`;
      else if (m.type === 'qr') body = c.group ? `<div class="bubble qrmini"><div class="qr">${U.qrSvg(c.group.link, 2)}</div><span><b>${esc(c.group.name)}</b><br><span class="fine">${esc(U.L(D.CHANNELS[c.group.channel], lg))} · ${esc(U.L(D.TEAMS.find(x => x.id === c.group.team).name, lg))}${c.group.auto ? (lg === 'en' ? ' · sent from the pre-built pool' : ' · 预建群池自动派发') : ''}</span></span></div>` : '';
      else body = `<div class="bubble${m.ai ? ' ai' : ''}">${m.ai ? `<span class="fine">🤖 ${esc(lg === 'en' ? 'AI assistant, before the group' : 'AI 助手 · 进群前')}</span><br>` : ''}${esc(m.text)}</div>`;
      return `<div class="msg ${side}">${body}<time>${U.clock(m.at)} · ${esc(U.ago(m.at, lg))}</time></div>`;
    }).join('');
    const stale = c.status === 'qr_sent' && c.group && Date.now() - c.group.at > 864e5;
    const exp = c.group && c.group.expiresAt, expSoon = exp && Date.now() > exp - 864e5;
    const expLine = exp ? (Date.now() > exp ? (lg === 'en' ? 'This WeChat group QR code has expired. Send a fresh code if the student still needs it.' : '这个微信群二维码已过期，如学生还没进群，请重新发送群码。')
      : (lg === 'en' ? `WeChat group QR code valid until ${new Date(exp).toLocaleDateString('en-GB')}` : `微信群二维码有效期至 ${new Date(exp).toLocaleDateString('zh-CN')}（7 天）`)) : '';
    return `<div class="thread">
      <div class="thead"><div class="grow"><b class="h3">${esc(nameOf(c))}</b><div class="row gap">${regionTag(c)}${statusPill(c.status)}</div></div>
        ${c.status === 'requested' ? `<button class="btn main small" data-act="build">▦ ${esc(A.buildGroup)}</button>` : ''}
        ${c.status !== 'requested' && expSoon ? `<button class="btn main small" data-act="build">▦ ${esc(lg === 'en' ? 'Send a new code' : '重新发送群码')}</button>` : ''}
        ${c.status === 'qr_sent' ? `<button class="btn small" data-status="joined">✓ ${esc(A.markJoined)}</button>` : ''}
        ${c.status === 'joined' ? `<button class="btn small" data-status="booked">✓ ${esc(A.markBooked)}</button>` : ''}</div>
      ${stale ? `<p class="warnline">⏰ ${esc(A.remind)}</p>` : ''}
      ${expLine ? `<p class="warnline ${expSoon ? '' : 'calm'}">${expSoon ? '⚠️' : '🕒'} ${esc(expLine)}</p>` : ''}
      <div class="amsgs" id="amsgs">${msgs}</div>
      <div class="suggest"><button class="chip" data-act="ai">✨ ${esc(A.aiSuggest)}</button></div>
      <form class="composer" id="acomposer"><label class="sr" for="aIn">${esc(A.reply)}</label><input id="aIn" autocomplete="off" placeholder="${esc(A.reply)}" value="${esc(reply)}"><button class="btn small main" type="submit">${esc(U.T(lg).send)}</button></form>
    </div>`;
  }
  function reqLines(c) {
    const q = c.request; if (!q) return '';
    const lg = lang(), T = U.T(lg);
    if (q.oneTap) return `<span>${esc(lg === 'en' ? 'One tap, no details asked' : '一键进群，未填资料')} · ${esc(U.L(D.CHANNELS[q.channel], lg))}</span>${q.homeName ? `<span>${esc(lg === 'en' ? 'From: ' : '来自：')}${esc(q.homeName)}</span>` : ''}`;
    return `<span>${esc(q.name)} · ${esc(q.intake)} · ${esc(U.campusName(q.uni, lg))}</span><span>${q.budget ? '≤ £' + q.budget + esc(T.perWeek) : esc(T.any)} · ${esc(T[q.room] || '')} · ${esc(U.L(D.CHANNELS[q.channel], lg))}</span>`;
  }
  function context() {
    const c = Store.conv(current), A = a(), lg = lang();
    if (!c) return '<aside class="ctx"></aside>';
    const homes = ids => HM.byIds(ids || []).map(h => `<span class="chip">${h.n} · ${esc(h.name)}</span>`).join('') || `<span class="muted">${esc(A.none)}</span>`;
    const team = c.group && D.TEAMS.find(x => x.id === c.group.team);
    return `<aside class="ctx">
      <b class="h3">${esc(A.ctx)}</b>
      <dl>
        <dt>${esc(A.region)}</dt><dd>${regionTag(c)}</dd>
        <dt>${esc(A.lang)}</dt><dd>${c.lang === 'en' ? 'English' : '中文'}</dd>
        <dt>${esc(A.source)}</dt><dd>${esc(c.source)}</dd>
        <dt>${esc(A.quiz)}</dt><dd>${esc(c.quiz || A.none)}</dd>
        <dt>${esc(A.viewed)}</dt><dd class="row wrap">${homes(c.viewed)}</dd>
        <dt>${esc(A.favs)}</dt><dd class="row wrap">${homes(c.favorites)}</dd>
        ${c.request ? `<dt>${esc(A.request)}</dt><dd class="reqbox">${reqLines(c)}<span class="fine">${esc(fmt(A.waitHours, { n: U.ago(c.request.at, lg) }))}</span></dd>` : ''}
        ${c.group ? `<dt>${esc(A.mTeam)}</dt><dd><b>${esc(U.L(team.name, lg))}</b><br><span class="fine">${team.members.map(esc).join(' · ')}</span><br><span class="fine">${esc(c.group.name)}</span></dd>` : ''}
      </dl>
      ${c.status === 'qr_sent' || c.status === 'joined' ? `<p class="fine">${esc(A.joinedNote)}</p>` : ''}
    </aside>`;
  }

  function modalHtml() {
    const c = Store.conv(current), A = a(), lg = lang(), m = modal;
    const team = D.TEAMS.find(x => x.id === m.team);
    return `<div class="modalwrap" role="dialog" aria-modal="true" aria-labelledby="mT"><form class="modal" id="gform">
      <b class="h2" id="mT">${esc(fmt(A.mTitle, { name: c.request ? c.request.name : nameOf(c) }))}</b>
      <div class="mgrid"><div class="stack">
        <label class="field"><span>${esc(A.mTeam)}</span><select id="g-team">${D.TEAMS.map(x => `<option value="${x.id}" ${x.id === m.team ? 'selected' : ''}>${esc(U.L(x.name, lg))}</option>`).join('')}</select></label>
        <p class="fine">${team.members.map(esc).join(' · ')} · ${esc(team.langs)}</p>
        <fieldset class="field"><legend>${esc(A.mChannel)}</legend><div class="row gap">${['whatsapp', 'wechat'].map(ch => `<label class="radio"><input type="radio" name="g-ch" value="${ch}" ${ch === m.channel ? 'checked' : ''}> ${esc(U.L(D.CHANNELS[ch], lg))}</label>`).join('')}</div></fieldset>
        <label class="field"><span>${esc(A.mGroupName)}</span><input id="g-name" value="${esc(m.name)}"></label>
        <label class="field"><span>${esc(A.mLink)}</span><input id="g-link" value="${esc(m.link)}"></label>
        <p class="fine">${esc(A.mLinkHint)}</p>
      </div>
      <div class="mprev"><span class="fine">${esc(A.mPreview)}</span><div class="qr" id="g-qr">${U.qrSvg(m.link, 3)}</div><b>${esc(m.name)}</b><span class="fine">${esc(U.L(D.CHANNELS[m.channel], lg))}</span></div></div>
      <div class="row gap end"><button class="btn" type="button" data-act="closemodal">${esc(U.T(lg).cancel)}</button><button class="btn main" type="submit">${esc(A.mSend)}</button></div>
    </form></div>`;
  }
  function openModal() {
    const c = Store.conv(current), ch = (c.request && c.request.channel) || D.REGIONS[c.region].channel;
    modal = { team: c.region === 'JP' ? 'C' : 'A', channel: ch, name: ['LSM', c.request ? c.request.name : c.name, c.request && (c.request.homeName || c.request.intake)].filter(Boolean).join(' · '), link: D.demoLink(ch, c.id + Date.now().toString(36).slice(-4)) };
    render();
  }

  /* ---------- 数据看板 ---------- */
  function dashboard() {
    const A = a(), lg = lang(), cs = Store.s.conversations;
    const reached = (c, s) => D.STATUSES.indexOf(c.status) >= D.STATUSES.indexOf(s);
    const steps = [['kpiChats', 'chatting'], ['kpiReq', 'requested'], ['kpiQr', 'qr_sent'], ['kpiJoined', 'joined'], ['kpiBooked', 'booked']];
    const visitors = Object.values(D.VISITORS).reduce((s, v) => s + v, 0) + 1;
    const counts = steps.map(([k, s]) => [k, cs.filter(c => reached(c, s)).length]);
    const all = [['kpiVisitors', visitors]].concat(counts);
    const max = visitors;
    const pct = (n, d) => d ? (n / d * 100).toFixed(n / d < .1 ? 1 : 0) + '%' : '—';
    const regions = Object.keys(D.REGIONS).map(r => {
      const rc = cs.filter(c => c.region === r), v = D.VISITORS[r] + (Store.me().region === r ? 1 : 0);
      return { r, v, chats: rc.filter(c => reached(c, 'chatting')).length, req: rc.filter(c => reached(c, 'requested')).length, joined: rc.filter(c => reached(c, 'joined')).length, booked: rc.filter(c => reached(c, 'booked')).length };
    });
    const sources = D.SOURCES.map(s => { const sc = cs.filter(c => c.source === s); return { s, n: sc.length, req: sc.filter(c => reached(c, 'requested')).length, booked: sc.filter(c => reached(c, 'booked')).length }; });
    const smax = Math.max(...sources.map(s => s.n), 1);
    return `<div class="dash">
      <p class="demo-note">${esc(A.demoData)}</p>
      <div class="kpis">${all.map(([k, n], i) => `<div class="kpi"><span class="fine">${esc(A[k])}</span><b>${n.toLocaleString()}</b>${i ? `<span class="fine">${esc(A.conv)} ${pct(n, all[i - 1][1])}</span>` : '<span class="fine">&nbsp;</span>'}</div>`).join('')}</div>
      <section class="panel"><div class="row between"><b class="h3">${esc(A.funnel)}</b><span class="fine">${esc(A.funnelNote)}</span></div>
        <div class="funnel">${all.map(([k, n]) => { const w = Math.max(1.5, Math.sqrt(n / max) * 100);
          return `<div class="frow" title="${esc(A[k])}: ${n} (${pct(n, visitors)})"><span class="flabel">${esc(A[k])}</span><span class="ftrack"><span class="fbar" style="width:${w.toFixed(1)}%"></span></span><span class="fval">${n.toLocaleString()} <span class="fine">${pct(n, visitors)}</span></span></div>`; }).join('')}</div>
        <p class="fine">${lg === 'en' ? 'Bar length uses a square-root scale so the small later steps stay visible; the numbers are exact.' : '条形长度按平方根缩放，后几步人数少也能看清；数字为实际值。'}</p></section>
      <div class="two-col">
        <section class="panel"><b class="h3">${esc(A.byRegion)}</b><div class="tablebox"><table class="dt"><thead><tr><th></th><th>${esc(A.kpiVisitors)}</th><th>${esc(A.kpiChats)}</th><th>${esc(A.kpiReq)}</th><th>${esc(A.kpiJoined)}</th><th>${esc(A.kpiBooked)}</th></tr></thead>
          <tbody>${regions.map(x => `<tr><th scope="row">${D.REGIONS[x.r].flag} ${esc(U.L(D.REGIONS[x.r], lg))}</th><td>${x.v.toLocaleString()}</td><td>${x.chats}</td><td>${x.req} <span class="fine">${pct(x.req, x.chats)}</span></td><td>${x.joined}</td><td>${x.booked}</td></tr>`).join('')}</tbody></table></div></section>
        <section class="panel"><b class="h3">${esc(A.bySource)}</b><div class="bars">${sources.map(x => `<div class="frow" title="${esc(x.s)}: ${x.n}"><span class="flabel">${esc(x.s)}</span><span class="ftrack"><span class="fbar alt" style="width:${(x.n / smax * 100).toFixed(1)}%"></span></span><span class="fval">${x.n} <span class="fine">→ ${x.req} / ${x.booked}</span></span></div>`).join('')}</div>
          <p class="fine">${lg === 'en' ? 'Conversations → group requests / booked' : '会话数 → 建群请求 / 已预定'}</p></section>
      </div>
    </div>`;
  }

  /* ---------- 渲染与事件 ---------- */
  function render() {
    if (!Store.conv(current)) current = (Store.s.conversations.find(c => c.status === 'requested') || Store.s.conversations[0] || {}).id;
    const A = a(), need = Store.s.notices.filter(n => !n.seen);
    el.innerHTML = `<div class="adminbar"><b class="h3">${lang() === 'en' ? 'Adviser console' : '顾问后台'}</b>
      <div class="segs">${[['inbox', A.inbox], ['dash', A.dash]].map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" data-tab="${k}">${esc(l)}</button>`).join('')}</div>
      <span class="grow"></span>
      <button class="bell ${need.length ? 'ring' : ''}" data-act="bell" aria-label="${esc(A.newReq)}">🔔${need.length ? `<span class="badge-dot">${need.length}</span>` : ''}</button></div>
      ${need.length ? `<div class="alertbar" role="alert">🙋 <b>${esc(A.newReq)}</b>：${esc(fmt(A.newReqText, { name: (Store.conv(need[need.length - 1].conv).request || {}).name || '' }))}<button class="btn small main" data-open="${need[need.length - 1].conv}">${esc(A.open)}</button></div>` : ''}
      ${tab === 'inbox' ? `<div class="inbox">${list()}${thread()}${context()}</div>` : dashboard()}
      ${modal ? modalHtml() : ''}`;
    const box = el.querySelector('#amsgs'); if (box) box.scrollTop = box.scrollHeight;
  }
  function select(id) { current = id; Store.markRead(id); reply = ''; render(); }
  function aiText(c) {
    const lg = c.lang, h = HM.byId((c.viewed || [])[c.viewed.length - 1] || (c.messages.find(m => m.homeId) || {}).homeId);
    if (!h) return lg === 'en' ? 'Thanks for your message! Which campus will you study at? I can suggest homes within a short walk.' : '谢谢你的消息！你会在哪个校区上课？我可以推荐步行近的公寓。';
    const p = U.fromPrice(h, lg);
    return lg === 'en' ? `${h.name} is about a ${h.uol}-minute walk to the University of Liverpool, ${p}. Want me to check 27/28 dates? When you're ready, tap "Get my booking team" and I'll set up your group.`
      : `${h.name} 步行到利物浦大学约 ${h.uol} 分钟，${p}。需要我帮你查 27/28 学年的档期吗？准备预定时点「我要建群咨询」，我帮你建专属群。`;
  }
  function onClick(e) {
    const b = e.target.closest('button'); if (!b || !el.contains(b)) return;
    const d = b.dataset;
    if (d.tab) { tab = d.tab; return render(); }
    if (d.filter) { filter = d.filter; return render(); }
    if (d.conv) return select(d.conv);
    if (d.open) { tab = 'inbox'; filter = 'all'; Store.seeNotices(); return select(d.open); }
    if (d.status) { Store.setStatus(current, d.status); return render(); }
    switch (d.act) {
      case 'build': return openModal();
      case 'closemodal': modal = null; return render();
      case 'bell': { const n = Store.s.notices.filter(x => !x.seen).pop(); tab = 'inbox'; if (n) { filter = 'all'; Store.seeNotices(); return select(n.conv); } filter = 'need'; return render(); }
      case 'ai': reply = aiText(Store.conv(current)); render(); { const i = el.querySelector('#aIn'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); } return;
    }
  }
  function onInput(e) {
    const x = e.target;
    if (x.id === 'convSearch') { query = x.value; const pos = x.selectionStart; render(); const s = el.querySelector('#convSearch'); s.focus(); s.setSelectionRange(pos, pos); }
    if (x.id === 'aIn') reply = x.value;
    if (modal && (x.id === 'g-link' || x.id === 'g-name')) { modal[x.id === 'g-link' ? 'link' : 'name'] = x.value; el.querySelector('#g-qr').innerHTML = U.qrSvg(modal.link, 3); el.querySelector('.mprev b').textContent = modal.name; }
  }
  function onChange(e) {
    const x = e.target; if (!modal) return;
    if (x.id === 'g-team') { modal.team = x.value; render(); }
    if (x.name === 'g-ch') { modal.channel = x.value; modal.link = D.demoLink(x.value, current + Date.now().toString(36).slice(-4)); render(); }
  }
  function onSubmit(e) {
    e.preventDefault();
    if (e.target.id === 'acomposer') { const v = reply.trim(); if (!v) return; reply = ''; Store.agentSend(current, { text: v }); render(); el.querySelector('#aIn').focus(); }
    if (e.target.id === 'gform') { Store.sendGroup(current, { team: modal.team, channel: modal.channel, name: modal.name, link: modal.link }); modal = null; render(); U.toast(a().sentQr); }
  }
  function onKey(e) { if (e.key === 'Escape' && modal) { modal = null; render(); } }
  function mount(node) {
    el = node;
    ['click', 'input', 'change', 'submit', 'keydown'].forEach((t, i) => el.addEventListener(t, [onClick, onInput, onChange, onSubmit, onKey][i]));
    render();
  }
  /* 学生端有新动作时刷新，但不打断正在输入的回复或打开的弹窗 */
  function refresh() {
    if (!el || modal) return;
    const focused = document.activeElement && el.contains(document.activeElement) ? document.activeElement.id : '';
    render();
    if (focused) { const f = el.querySelector('#' + focused); if (f) { f.focus(); if (f.setSelectionRange && f.value) f.setSelectionRange(f.value.length, f.value.length); } }
  }
  root.Admin = { mount, refresh, render, select(id) { if (Store.conv(id)) { tab = 'inbox'; filter = 'all'; select(id); } }, reset() { tab = 'inbox'; current = 'me'; filter = 'all'; query = ''; modal = null; reply = ''; } };
})(typeof globalThis !== 'undefined' ? globalThis : this);
