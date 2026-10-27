/* 住户评价、团队探访与资料解读：周边与评价面板（local-panel.js）里的两页。数据在 reviews-store.js（演示，只在本浏览器）。
   - 「所有评论」只指本站已发布的第一方住户评价；不搬运、不翻译、不用 AI 改写其他网站的评价。
     Amber / StudentCrowd 只给直达链接，写明「在其他网站查看（不计入本站评分）」。
   - 评分只用已发布、非团队、非演示的住户评价，写样本数；没有就写「暂无评分」；样本少时提示不能下结论。
   - 提交：选公寓 → 入住年份和房型 → 各项评分和文字 → 预览 → 同意原创内容条款 → 提交，之后是「待审核」，
     可以看状态、修改后重新提交、撤回。演示阶段只能提交到虚构的演示公寓，所有内容标「演示内容」，不计入真实统计。
   - 徽章：审核员核实后才显示「入住信息已核实」，否则「入住信息未核实」；团队成员必须写明身份。 */
(() => {
  'use strict';
  const BT = window.BookingTools, LP = window.LocalPanel, S = window.ReviewsStore;
  if (!BT || !LP || !S) return;
  const { el, btn, fmt, pick } = BT;
  const T = {
    zh: {
      demoTag: '演示内容', demoOnly: '仅演示，未提交真实申请：内容只存在这台设备的浏览器里，不会进入真实评价库。',
      demoHomeNote: '这是虚构的演示公寓，用来演示评价的提交、审核和显示。这里的内容都标「演示内容」，不计入任何真实公寓的评分、数量或排名。',
      sumH: '本站住户评分', sumDemoH: '演示评分（不计入真实统计）', noScore: '暂无评分', basedOn: '基于 {n} 条已发布的住户评价', small: '样本较少，只作参考，不能据此下结论。',
      sumNote: '只统计本站已发布的匿名住户评价；团队探访和资料解读不计入。某一项没评的不算进那一项。', dimN: '{v}（{n} 条）', dimNone: '未评',
      dims: { noise: '隔音', repair: '维修响应', clean: '公共卫生', net: '网络', value: '性价比' },
      write: '写评价', mine: '我的评价', allH: '所有评论', allSub: '本站已发布的住户评价', none: '这栋楼还没有已发布的住户评价。',
      realWrite: '演示阶段，评价只能提交到演示公寓，真实公寓暂不接收。', goDemo: '去演示公寓试试 →',
      extH: '在其他网站查看（不计入本站评分）', extNote: '这些网站的评价属于原网站，本站不转载、不翻译，点链接到原网站看。',
      ok: '入住信息已核实', no: '入住信息未核实', team: '团队成员', stay: '{y} 入住 · {r}',
      rooms: { ensuite: '独立卫浴单间', studio: 'Studio', twodio: 'Twodio', shared: '共用卫浴单间', other: '其他' },
      report: '举报', reportH: '举报这条评价', reportWhy: '原因', reportReasons: { personal: '包含个人信息', fake: '不像真实入住体验', abuse: '辱骂或歧视', ad: '广告', other: '其他' }, reportGo: '确认举报', cancel: '取消',
      reported: '已收到举报。审核员会按同一标准处理，作者看不到是谁举报的。',
      // 提交
      step: '第 {n} / 3 步', fHome: '评价哪栋楼', fHomeNote: '真实公寓暂不接收演示提交。', fAlias: '昵称（公开显示，不要用真名）', fYear: '入住年份', fRoom: '房型', next: '下一步', prev: '上一步',
      fScores: '各项评分（1–5，没体验过的可以不评）', fClear: '不评', fText: '文字评价（至少 20 字，写自己的真实体验）', fTextNote: '不要写真名、联系方式、房号；不要上传证件或合同。',
      preview: '预览', terms: '我确认这是我自己写的原创内容，是我真实的入住体验；我知道审核员会按同一标准审核，正面和负面评价都可以发布。',
      submit: '提交', resubmit: '重新提交', needText: '文字至少 20 字。', needAlias: '请填一个昵称。', needScore: '至少评一项。', needTerms: '请先勾选同意原创内容条款。',
      sent: '已提交，状态是「待审核」。审核通过后才公开显示、计入评分。', mineH: '我的评价（只有你和审核员能看到未发布的内容）', mineNone: '还没有提交过评价。',
      st: { pending: '待审核', changes: '需修改', published: '已发布', rejected: '未通过', withdrawn: '已撤回' },
      stNote: { pending: '审核员还没处理，暂不公开，不计入评分。', changes: '审核员请你修改后重新提交；暂不公开，不计入评分。', published: '已公开显示，计入评分。', rejected: '没有通过审核，不公开，不计入评分。', withdrawn: '你已撤回，不公开，不计入评分。' },
      edit: '修改', withdraw: '撤回', withdrawQ: '确定撤回这条评价吗？撤回后不再显示。', history: '记录', feedback: '审核意见：{r}',
      acts: { submitted: '提交', resubmitted: '修改后重新提交', published: '发布', changes: '请作者修改', rejected: '不通过', withdrawn: '撤回', verified: '核实入住信息', unverified: '取消核实' },
      by: { author: '作者', moderator: '审核员' }, back: '← 返回评价', adminLink: '打开演示审核台 ↗',
      // 团队
      teamH: '团队探访', teamNone: '团队还没有探访过这栋楼。有真实探访后才会显示，并写明探访人、探访日期和看过的范围。',
      insH: '资料解读', insNone: '暂时没有资料解读。有的话会写明来源、日期和分析依据。', notCounted: '不计入住户评分',
      visit: '探访日期 {d}', limits: '探访范围和局限', basis: '分析依据', sources: '来源', date: '整理日期 {d}', disclose: '{m} · {a}'
    },
    en: {
      demoTag: 'Demo content', demoOnly: 'Demo only, no real submission: content stays in this browser and never reaches a real review store.',
      demoHomeNote: 'This fictional demo property shows how reviews are submitted, moderated and displayed. Everything here is labelled “Demo content” and is excluded from the ratings, counts and rankings of real properties.',
      sumH: 'Resident ratings on this site', sumDemoH: 'Demo ratings (excluded from real figures)', noScore: 'No rating yet', basedOn: 'Based on {n} published resident reviews', small: 'Small sample: for reference only; no conclusions can be drawn.',
      sumNote: 'Only published anonymous resident reviews on this site are counted; team visits and insights are not. A skipped score is left out of that score.', dimN: '{v} ({n})', dimNone: 'Not rated',
      dims: { noise: 'Noise insulation', repair: 'Maintenance response', clean: 'Shared-area cleanliness', net: 'Internet', value: 'Value' },
      write: 'Write a review', mine: 'My reviews', allH: 'All reviews', allSub: 'Published resident reviews on this site', none: 'No published resident reviews for this property yet.',
      realWrite: 'In the demo, reviews can only be submitted to the demo property; real properties do not accept them yet.', goDemo: 'Try the demo property →',
      extH: 'View on other sites (not counted in ratings here)', extNote: 'Reviews on these sites belong to them; this site does not copy or translate them. Follow the links to read them there.',
      ok: 'Tenancy verified', no: 'Tenancy not verified', team: 'Team member', stay: 'Stayed {y} · {r}',
      rooms: { ensuite: 'En-suite', studio: 'Studio', twodio: 'Twodio', shared: 'Shared bathroom', other: 'Other' },
      report: 'Report', reportH: 'Report this review', reportWhy: 'Reason', reportReasons: { personal: 'Personal information', fake: 'Not a genuine stay', abuse: 'Abuse or discrimination', ad: 'Advertising', other: 'Other' }, reportGo: 'Confirm report', cancel: 'Cancel',
      reported: 'Report received. Moderators apply the same standard, and the author is not told who reported it.',
      step: 'Step {n} of 3', fHome: 'Property', fHomeNote: 'Real properties do not accept demo submissions.', fAlias: 'Alias (shown publicly; not your real name)', fYear: 'Year of stay', fRoom: 'Room type', next: 'Next', prev: 'Back',
      fScores: 'Scores (1–5; skip anything you did not experience)', fClear: 'Skip', fText: 'Your review (at least 20 characters, from your own stay)', fTextNote: 'No real names, contact details or room numbers; do not upload IDs or contracts.',
      preview: 'Preview', terms: 'I confirm this is my own original writing about my real stay, and I understand moderators apply the same standard to positive and negative reviews.',
      submit: 'Submit', resubmit: 'Resubmit', needText: 'Write at least 20 characters.', needAlias: 'Enter an alias.', needScore: 'Rate at least one item.', needTerms: 'Accept the original-content terms first.',
      sent: 'Submitted. Status: Pending. It appears publicly and counts towards ratings only after approval.', mineH: 'My reviews (unpublished items are visible only to you and moderators)', mineNone: 'You have not submitted a review yet.',
      st: { pending: 'Pending', changes: 'Changes requested', published: 'Published', rejected: 'Rejected', withdrawn: 'Withdrawn' },
      stNote: { pending: 'Not yet moderated; not public and not counted.', changes: 'The moderator asked for changes; not public and not counted.', published: 'Public and counted in ratings.', rejected: 'Not approved; not public and not counted.', withdrawn: 'You withdrew it; not public and not counted.' },
      edit: 'Edit', withdraw: 'Withdraw', withdrawQ: 'Withdraw this review? It will no longer be shown.', history: 'History', feedback: 'Moderator feedback: {r}',
      acts: { submitted: 'Submitted', resubmitted: 'Resubmitted after edits', published: 'Published', changes: 'Changes requested', rejected: 'Rejected', withdrawn: 'Withdrawn', verified: 'Tenancy verified', unverified: 'Verification removed' },
      by: { author: 'author', moderator: 'moderator' }, back: '← Back to reviews', adminLink: 'Open the demo moderation page ↗',
      teamH: 'Team visits', teamNone: 'The team has not visited this property. Real visits will appear here with the visitor, visit date and what was seen.',
      insH: 'Insights', insNone: 'No insights yet. Any insight will state its sources, dates and basis.', notCounted: 'Not counted in resident ratings',
      visit: 'Visited {d}', limits: 'Scope and limits of the visit', basis: 'Basis', sources: 'Sources', date: 'Compiled {d}', disclose: '{m} · {a}'
    }
  };
  const k = () => pick(T), zh = () => BT.lang() === 'zh';
  const L = v => (v && typeof v === 'object') ? pick(v) : v;
  const day = iso => String(iso || '').slice(0, 10);
  const when = iso => LP.when(iso);
  const demoHome = () => ({ ...S.DEMO_HOME, name: L(S.DEMO_HOME.name) });
  const badge = (cls, text) => el('span', 'rr-badge ' + cls, text);
  const YEARS = ['2023/24', '2024/25', '2025/26', '2026/27'];
  let fromHome = null;   // 从哪栋真实公寓点进演示公寓的（换回地图时用）

  /* ---------- 住户评价 ---------- */
  const views = new WeakMap();   // body → { view, draft }
  LP.register('reviews', ctx => { views.set(ctx.body, { view: 'list' }); drawReviews(ctx); });
  let own = false;   // 自己这一页的操作不触发重画（比如举报后要留着「已收到」提示）
  const mine1 = f => { own = true; try { return f(); } finally { own = false; } };
  S.on(() => { if (own) return; const c = LP.current(), b = document.querySelector('.lp:not([hidden]) .lp-body'); const v = b && views.get(b); if (c && v && v.view !== 'form') drawReviews({ home: c, body: b }); });

  function drawReviews(ctx) {
    const v = views.get(ctx.body) || { view: 'list' }; views.set(ctx.body, v);
    ctx.body.replaceChildren();
    if (v.view === 'form') return form(ctx, v);
    if (v.view === 'mine') return mine(ctx, v);
    list(ctx, v);
  }
  const go = (ctx, view, extra) => { views.set(ctx.body, { view, ...extra }); drawReviews(ctx); ctx.body.scrollTop = 0; };

  function list(ctx) {
    const K = k(), b = ctx.body, h = ctx.home, demo = !!h.demo;
    if (demo) b.append(el('p', 'lp-demo', '⚠️ ' + K.demoHomeNote));
    const agg = S.aggregate(h.id, { demo }), sum = el('section', 'lp-card rr-sum');
    sum.append(el('b', 'lp-h', demo ? K.sumDemoH : K.sumH));
    if (!agg.n) sum.append(el('strong', '', K.noScore));
    else {
      sum.append(el('span', '', fmt(K.basedOn, { n: agg.n })));
      const d = el('div', 'rr-dims');
      S.DIMS.forEach(id => { const x = agg.dims[id]; d.append(el('span', '', K.dims[id]), el('em', '', x.n ? fmt(K.dimN, { v: x.avg.toFixed(1) + ' / 5', n: x.n }) : K.dimNone)); });
      sum.append(d);
      if (agg.n < 5) sum.append(el('p', 'lp-state warn', K.small));
    }
    sum.append(el('p', 'bt-note', K.sumNote));
    b.append(sum);

    const acts = el('div', 'rr-acts'), w = btn('bt-btn', K.write), m = btn('bt-btn alt', K.mine);
    w.addEventListener('click', () => demo ? go(ctx, 'form', { draft: { homeId: h.id } }) : openDemo(h, 'form'));
    m.addEventListener('click', () => go(ctx, 'mine'));
    acts.append(w, m); b.append(acts);
    if (!demo) b.append(el('p', 'bt-note', K.realWrite));

    const items = S.publicFor(h.id).filter(x => x.kind === 'resident' && (demo || !x.demo));
    const sec = el('section', 'rr-sum'); sec.append(el('b', 'lp-h', K.allH), el('span', 'bt-note', K.allSub));
    if (!items.length) sec.append(el('p', 'lp-empty', K.none));
    items.forEach(x => sec.append(card(x, true)));
    b.append(sec);
    if (!demo && window.Reviews && window.Reviews.links) {
      const Lk = window.Reviews.links(h), ext = el('section', 'lp-card');
      ext.append(el('b', 'lp-h', K.extH));
      const row = el('div', 'rr-ext');
      [['Amber Student ↗', Lk.am], ['StudentCrowd ↗', Lk.sc]].forEach(([t, u]) => { if (!u) return; const x = el('a', '', t); x.href = u; x.target = '_blank'; x.rel = 'noopener'; row.append(x); });
      ext.append(row, el('p', 'bt-note', K.extNote)); b.append(ext);
    }
    b.append(el('p', 'bt-note', K.demoOnly));
  }
  function card(x, withReport) {
    const K = k(), c = el('article', 'rr-item'), who = el('div', 'rr-who');
    who.append(el('b', '', x.alias), badge(x.verified ? 'ok' : 'no', x.verified ? K.ok : K.no));
    if (x.demo) who.append(badge('demo', K.demoTag));
    who.append(el('span', 'bt-note', fmt(K.stay, { y: x.stayYear, r: K.rooms[x.roomType] || x.roomType }) + ' · ' + day(x.createdAt)));
    const sc = el('div', 'rr-scores'); S.DIMS.forEach(id => sc.append(el('span', '', `${K.dims[id]} ${typeof x.scores[id] === 'number' ? x.scores[id] + '/5' : K.dimNone}`)));
    c.append(who, sc, el('p', 'rr-text', x.text));
    if (withReport) {
      const r = btn('bt-link', K.report); r.addEventListener('click', () => reportBox(c, x, r)); c.append(r);
    }
    return c;
  }
  function reportBox(c, x, trigger) {
    const K = k(); if (c.querySelector('.rr-report')) return;
    const box = el('div', 'lp-card rr-report rr-form'), lab = el('label', '', K.reportWhy), sel = el('select');
    Object.entries(K.reportReasons).forEach(([v, t]) => { const o = el('option', '', t); o.value = v; sel.append(o); });
    lab.append(sel);
    const acts = el('div', 'rr-acts'), okb = btn('bt-btn', K.reportGo), no = btn('bt-btn alt', K.cancel);
    no.addEventListener('click', () => box.remove());
    okb.addEventListener('click', () => { mine1(() => S.report(x.id, sel.value)); box.replaceChildren(el('p', 'lp-state', K.reported)); trigger.remove(); });
    acts.append(okb, no); box.append(el('b', 'lp-h', K.reportH), lab, acts); c.append(box); sel.focus();
  }
  function openDemo(from, view) {
    fromHome = from; LP.open(demoHome(), 'reviews');
    const b = document.querySelector('.lp .lp-body'); if (b && view) go({ home: demoHome(), body: b }, view, { draft: { homeId: S.DEMO_HOME.id } });
  }

  /* 提交：3 步（公寓、年份、房型、昵称 → 评分和文字 → 预览、条款、提交） */
  function form(ctx, v) {
    const K = k(), b = ctx.body, d = v.draft || (v.draft = { homeId: S.DEMO_HOME.id });
    d.scores = d.scores || {}; d.step = d.step || 1;
    b.append(el('p', 'lp-demo', '⚠️ ' + K.demoOnly));
    const back = btn('bt-link', K.back); back.addEventListener('click', () => go(ctx, d.id ? 'mine' : 'list')); b.append(back);
    const f = el('div', 'rr-form'); b.append(f);
    f.append(el('b', 'lp-h', fmt(K.step, { n: d.step })));
    const err = el('p', 'lp-state warn'); err.hidden = true;
    const fail = m => { err.textContent = m; err.hidden = false; };
    const field = (label, input) => { const l = el('label', '', label); l.append(input); f.append(l); return input; };
    const select = (opts, val) => { const s = el('select'); opts.forEach(([v2, t, dis]) => { const o = el('option', '', t); o.value = v2; if (dis) o.disabled = true; s.append(o); }); if (val) s.value = val; return s; };
    if (d.step === 1) {
      let homes = []; try { homes = HOMES; } catch (_) { /* 没有地图数据 */ }
      const hs = field(K.fHome, select([[S.DEMO_HOME.id, L(S.DEMO_HOME.name) + ' · ' + K.demoTag], ...homes.map(h => [h.id, (typeof nameOf === 'function' ? nameOf(h) : h.name), true])], d.homeId));
      hs.disabled = !!d.id; f.append(el('small', 'bt-note', K.fHomeNote));
      const alias = el('input'); alias.type = 'text'; alias.maxLength = 24; alias.value = d.alias || ''; field(K.fAlias, alias);
      const yr = field(K.fYear, select(YEARS.map(y => [y, y]), d.stayYear || '2025/26'));
      const rm = field(K.fRoom, select(Object.entries(K.rooms), d.roomType || 'ensuite'));
      f.append(err);
      const nx = btn('bt-btn', K.next); nx.addEventListener('click', () => {
        if (!alias.value.trim()) return fail(K.needAlias);
        Object.assign(d, { homeId: hs.value, alias: alias.value.trim(), stayYear: yr.value, roomType: rm.value, step: 2 }); drawReviews(ctx);
      });
      f.append(nx);
    } else if (d.step === 2) {
      f.append(el('span', '', K.fScores));
      S.DIMS.forEach(id => {
        const row = el('div', 'rr-dim'), stars = el('div', 'rr-stars'); row.append(el('span', '', K.dims[id]), stars);
        const paint = () => stars.querySelectorAll('button[data-v]').forEach(x => { x.classList.toggle('on', typeof d.scores[id] === 'number' && +x.dataset.v <= d.scores[id]); x.setAttribute('aria-pressed', String(d.scores[id] === +x.dataset.v)); });
        for (let i = 1; i <= 5; i++) { const s = btn('', String(i)); s.dataset.v = i; s.setAttribute('aria-label', `${K.dims[id]} ${i}/5`); s.addEventListener('click', () => { d.scores[id] = i; paint(); }); stars.append(s); }
        const clr = btn('clr', K.fClear); clr.addEventListener('click', () => { d.scores[id] = null; paint(); }); stars.append(clr);
        paint(); f.append(row);
      });
      const ta = el('textarea'); ta.value = d.text || ''; field(K.fText, ta); f.append(el('small', 'bt-note', K.fTextNote), err);
      const acts = el('div', 'rr-acts'), pv = btn('bt-btn alt', K.prev), nx = btn('bt-btn', K.preview);
      pv.addEventListener('click', () => { d.text = ta.value; d.step = 1; drawReviews(ctx); });
      nx.addEventListener('click', () => {
        d.text = ta.value;
        if (!S.DIMS.some(id => typeof d.scores[id] === 'number')) return fail(K.needScore);
        if (d.text.trim().length < 20) return fail(K.needText);
        d.step = 3; drawReviews(ctx);
      });
      acts.append(pv, nx); f.append(acts);
    } else {
      f.append(el('b', '', K.preview), card({ ...d, scores: d.scores, verified: false, demo: true, createdAt: new Date().toISOString(), text: d.text.trim() }, false));
      const lab = el('label', 'rr-check'), cb = el('input'); cb.type = 'checkbox'; lab.append(cb, el('span', '', K.terms)); f.append(lab, err);
      const acts = el('div', 'rr-acts'), pv = btn('bt-btn alt', K.prev), go2 = btn('bt-btn ok', d.id ? K.resubmit : K.submit);
      pv.addEventListener('click', () => { d.step = 2; drawReviews(ctx); });
      go2.addEventListener('click', () => {
        if (!cb.checked) return fail(K.needTerms);
        const r = mine1(() => S.submit({ ...d, text: d.text.trim() })); if (!r) return fail('…');
        views.set(ctx.body, { view: 'mine', flash: K.sent }); drawReviews(ctx); ctx.body.scrollTop = 0;
      });
      acts.append(pv, go2); f.append(acts);
    }
  }

  /* 我的评价：状态、审核意见、记录；待审核或需修改时可以修改重交；可以撤回 */
  function mine(ctx, v) {
    const K = k(), b = ctx.body;
    b.append(el('p', 'lp-demo', '⚠️ ' + K.demoOnly));
    const back = btn('bt-link', K.back); back.addEventListener('click', () => go(ctx, 'list')); b.append(back);
    if (v.flash) b.append(el('p', 'lp-state', '✓ ' + v.flash));
    b.append(el('b', 'lp-h', K.mineH));
    const items = S.mine(); if (!items.length) b.append(el('p', 'lp-empty', K.mineNone));
    items.forEach(x => {
      const c = card(x, false), st = el('div', 'rr-who');
      st.append(badge('st', K.st[x.status]), el('span', 'bt-note', K.stNote[x.status]));
      c.prepend(st);
      const fb = [...x.history].reverse().find(hh => hh.by === 'moderator' && ['changes', 'rejected', 'published'].includes(hh.action) && hh.reason);
      if (fb && x.status !== 'pending') c.append(el('p', 'lp-state' + (x.status === 'published' ? '' : ' warn'), fmt(K.feedback, { r: fb.reason })));
      const det = el('details'), sum = el('summary', 'bt-note', K.history), ol = el('ol', 'lp-notes');
      x.history.forEach(hh => ol.append(el('li', '', `${when(hh.at)} · ${K.acts[hh.action] || hh.action} · ${K.by[hh.by] || hh.by}${hh.reason ? ' · ' + hh.reason : ''}`)));
      det.append(sum, ol); c.append(det);
      const acts = el('div', 'rr-acts');
      if (['pending', 'changes'].includes(x.status)) { const e = btn('bt-btn alt', K.edit); e.addEventListener('click', () => go(ctx, 'form', { draft: { id: x.id, homeId: x.homeId, alias: x.alias, stayYear: x.stayYear, roomType: x.roomType, scores: { ...x.scores }, text: x.text, step: 1 } })); acts.append(e); }
      if (!['withdrawn', 'rejected'].includes(x.status)) { const w = btn('bt-btn alt', K.withdraw); w.addEventListener('click', () => { if (confirm(K.withdrawQ)) { mine1(() => S.withdraw(x.id)); go(ctx, 'mine'); } }); acts.append(w); }
      if (acts.children.length) c.append(acts);
      b.append(c);
    });
    const adm = el('a', 'bt-note', K.adminLink); adm.href = './reviews-admin.html'; adm.target = '_blank'; adm.rel = 'noopener'; b.append(adm);
  }

  /* ---------- 团队探访与资料解读 ---------- */
  LP.register('team', ctx => {
    const K = k(), b = ctx.body, h = ctx.home;
    if (h.demo) b.append(el('p', 'lp-demo', '⚠️ ' + K.demoHomeNote));
    const pub = S.publicFor(h.id), team = pub.filter(x => x.kind === 'team' && (h.demo || !x.demo)), ins = pub.filter(x => x.kind === 'insight' && (h.demo || !x.demo));
    const s1 = el('section', 'rr-sum'); s1.append(el('b', 'lp-h', K.teamH));
    if (!team.length) s1.append(el('p', 'lp-empty', K.teamNone));
    team.forEach(x => {
      const c = el('article', 'rr-item team'), who = el('div', 'rr-who');
      who.append(el('b', '', fmt(K.disclose, { m: x.member, a: L(x.affiliation) })), badge('team', K.team), badge('no', K.notCounted)); if (x.demo) who.append(badge('demo', K.demoTag));
      c.append(who, el('span', 'bt-note', fmt(K.visit, { d: x.visitDate })), el('p', 'rr-text', L(x.text)));
      const lim = el('p', 'lp-state warn'); lim.append(el('b', '', K.limits + '：'), L(x.limits)); c.append(lim);
      s1.append(c);
    });
    const s2 = el('section', 'rr-sum'); s2.append(el('b', 'lp-h', K.insH));
    if (!ins.length) s2.append(el('p', 'lp-empty', K.insNone));
    ins.forEach(x => {
      const c = el('article', 'rr-item insight'), who = el('div', 'rr-who');
      who.append(el('b', '', fmt(K.disclose, { m: x.member, a: L(x.affiliation) })), badge('no', K.notCounted)); if (x.demo) who.append(badge('demo', K.demoTag));
      c.append(who, el('span', 'bt-note', fmt(K.date, { d: x.date })), el('p', 'rr-text', L(x.text)));
      const bs = el('p', 'bt-note'); bs.append(el('b', '', K.basis + '：'), L(x.basis)); c.append(bs);
      const ul = el('ul', 'lp-notes'); (x.sources || []).forEach(s => { const li = el('li'), a = el('a', '', L(s.label)); a.href = s.url; a.target = '_blank'; a.rel = 'noopener'; li.append(a, ` · ${s.date}`); ul.append(li); });
      c.append(el('b', 'bt-note', K.sources), ul); s2.append(c);
    });
    b.append(s1, s2);
    if (!h.demo) { const g = btn('bt-link', k().goDemo); g.addEventListener('click', () => { fromHome = h; LP.open(demoHome(), 'team'); }); b.append(g); }
  });

  window.ResidentReviews = { openDemo: (view) => openDemo(LP.current(), view), demoHome, fromHome: () => fromHome };
})();
