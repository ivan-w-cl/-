/* Discussion language layer: one vocabulary (discussion-moves.js) across lessons, AI practice and teacher mocks.
   Adds 讨论语言 (#moves), 5-minute drills (#drill-<move>), the mock prep card (#prep-<booking>), the teacher's
   review form (#teacher-<booking>, demo of the teacher console) and the student's review card (#review-<booking>);
   tags each student turn in discussion records; surfaces prep/review on 今天, 我的, records and booking details.
   Loaded last. Prep notes and reviews are kept in this browser until the booking API stores them (see 交接说明). */
(function () {
  'use strict';
  const M = window.ZPMoves; if (!M) return;
  const Z = () => window.ZP || {};
  const STORE = 'zp-mock-cards-v1';
  const readCards = () => { try { return JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (_) { return {}; } };
  const writeCards = c => { try { localStorage.setItem(STORE, JSON.stringify(c)); } catch (_) {} };
  const cardOf = bid => readCards()[bid] || {};
  const putCard = (bid, patch) => { const all = readCards(); all[bid] = { ...(all[bid] || {}), ...patch }; writeCards(all); };

  /* ---------- small renderers ---------- */
  const name = id => (M.byId[id] || {}).name || id;
  const moveChip = (id, cls = '') => `<span class="chip dl-move ${cls}">${esc(name(id))}</span>`;
  function lessonLink(id, label) {
    const s = M.sectionOf(id);
    if (!s) return '<span class="dl-pending">对应课程待录入</span>';
    return `<a class="dl-lesson" href="${esc(s.href)}"><span class="mono">${esc(s.lesson.id)}·S${String(s.number).padStart(2, '0')}</span>${esc(label || `回看 第 ${s.number} 节 ${s.section.title}`)}</a>`;
  }
  const back = (href, t) => `<a class="link" href="${href}">${ic('back', 14)}${t}</a>`;
  const note = t => `<p class="dl-note">${t}</p>`;

  /* ---------- practice records → moves ---------- */
  function turnsOf(r) {
    if (r.msgs) return r.msgs.filter(m => !m.typing).map(m => ({ who: m.who === 'me' ? '你' : m.who, me: m.who === 'me', text: m.text || '' }));
    if (r.room && r.room.lines) return r.room.lines.map(l => ({ who: l.me ? '你' : l.who, me: !!l.me, text: l.text || '' }));
    return null;
  }
  const dialogRecords = () => (S.records || []).filter(r => turnsOf(r)).sort((a, b) => (b.ts || 0) - (a.ts || 0));
  function summarize(records) {
    const moves = {}, slips = {};
    records.forEach(r => turnsOf(r).filter(t => t.me).forEach(t => {
      const g = M.tag(t.text);
      g.moves.forEach(id => { (moves[id] ||= { n: 0, quote: t.text, ts: r.ts }).n++; });
      g.slips.forEach(id => { (slips[id] ||= { n: 0, quote: t.text, ts: r.ts }).n++; });
    }));
    return { moves, slips, count: records.length };
  }
  function focusFrom(sum) {
    const out = [];
    Object.entries(sum.slips).sort((a, b) => b[1].n - a[1].n).forEach(([id]) => { const f = M.slip(id).fix; if (!out.includes(f)) out.push(f); });
    ['invite', 'build', 'ask', 'summary'].forEach(id => { if (!sum.moves[id] && !out.includes(id)) out.push(id); });
    return out.slice(0, 2);
  }

  function recordPanel(r) {
    const turns = turnsOf(r); if (!turns || !turns.some(t => t.me)) return '';
    const mine = turns.filter(t => t.me).map(t => ({ ...t, g: M.tag(t.text) }));
    const sum = summarize([r]);
    const done = Object.keys(sum.moves), slips = Object.keys(sum.slips);
    return `<section class="sec dl-rec"><div class="sec-h"><h2>这次用到的讨论动作</h2><span class="aside">和课程里用的是同一套词 · <a class="link" href="#moves" style="display:inline">看全部</a></span></div>
      <div class="card dl-pad">
        <div class="chips">${done.length ? done.map(id => moveChip(id, 'ok')).join('') : '<span class="muted" style="font-size:13px">这次没有标出讨论动作。</span>'}${slips.map(id => `<span class="chip dl-move warn">可以再试 · ${esc(M.slip(id).name)}</span>`).join('')}</div>
        <ol class="dl-turns">${mine.map(t => `<li><p lang="en">${esc(t.text)}</p><div class="chips">${t.g.moves.map(id => moveChip(id, 'ok')).join('')}${t.g.slips.map(id => `<span class="chip dl-move warn">${esc(M.slip(id).name)}</span>`).join('')}</div>
          ${t.g.slips.map(id => { const s = M.slip(id); return `<div class="dl-try"><span>${esc(s.why)}</span><span class="chips">${lessonLink(s.fix)}<a class="btn sm ghost" href="#drill-${s.fix}">练一次「${esc(name(s.fix))}」</a></span></div>`; }).join('')}</li>`).join('')}</ol>
        ${note('练习反馈，不是评分。演示版按关键词标注；正式版由 AI 按同一套讨论动作标注，可能有误。')}
      </div></section>`;
  }

  /* ---------- views ---------- */
  function viewMoves() {
    const sum = summarize(dialogRecords().slice(0, 10));
    return `${back('#practice', '练习')}
      <header class="page-h"><div class="eyebrow">课程 · AI 反馈 · 老师复盘共用</div><h1>讨论语言</h1><p>课程里教的每一个讨论动作。AI 练习反馈和老师复盘都用这些词，你在哪里看到同一个词，都能回到同一节课。</p></header>
      <section class="sec"><div class="dl-grid">${M.MOVES.map(m => `<div class="card dl-pad dl-word">
        <div class="chips">${moveChip(m.id)}<span class="mono faint" style="font-size:12px">${esc(m.en)}</span></div>
        <p style="font-size:14px">${esc(m.what)}</p><p class="dl-ex" lang="en">${esc(m.example)}</p>
        <div class="dl-foot">${lessonLink(m.id, m.lesson ? null : '')}<span class="faint" style="font-size:12.5px">${sum.moves[m.id] ? `最近练习里用过 ${sum.moves[m.id].n} 次` : '最近练习里还没用过'}</span></div>
        <div><a class="btn sm ghost" href="#drill-${m.id}">练一次 · 5 分钟</a></div></div>`).join('')}</div>
      ${note('目前只接入了第一课；其他课程录入后，每个动作会链接到教它的那一节。')}</section>`;
  }

  function viewDrill(id) {
    const m = M.byId[id], d = M.DRILLS[id];
    if (!m || !d) return viewMoves();
    const st = (S._dl ||= {})[id] || {};
    return `${back('#moves', '讨论语言')}
      <header class="page-h"><div class="eyebrow">专项练习 · 5 分钟 · ${esc(m.name)}</div><h1>${esc(d.prompt)}</h1><p>只读下面的原话，写一句英文。不录音，不打分。</p></header>
      <div class="two"><section class="sec"><div class="card dl-pad">
        <div class="dl-ctx">${d.context.map(([w, t]) => `<div class="dl-q"><b>${esc(w)}</b>${t ? `<span lang="en">${esc(t)}</span>` : ''}</div>`).join('')}</div>
        <label class="field"><span>你的一句话</span><textarea id="dl-in" data-dl="${id}" rows="3" placeholder="用英文写一句">${esc(st.text || '')}</textarea></label>
        <div class="chips"><button class="btn" data-a="dl-check" data-id="${id}">看反馈</button><button class="btn ghost" data-a="dl-sample" data-id="${id}">看一个示例</button></div>
        <div id="dl-out" aria-live="polite">${st.shown ? drillOut(id, st.text) : ''}</div></div></section>
      <aside class="stack"><div class="card dl-pad"><b>这个动作</b><p style="font-size:14px">${esc(m.what)}</p><p class="dl-ex" lang="en">${esc(m.example)}</p>${lessonLink(id)}</div>
        <div class="card dl-pad"><b>反馈是怎么来的</b><p class="muted" style="font-size:13px">演示版只检查几个关键词，用来展示反馈的样子；正式版由 AI 生成，用同一套讨论动作描述，不判断英语水平。</p></div></aside></div>`;
  }
  function drillOut(id, text) {
    const c = M.checkDrill(id, text);
    if (!c) return '<p class="empty" style="padding:12px 0">先写一句，再看反馈。</p>';
    const rows = [];
    rows.push(c.met ? ['ok', `做到了「${name(id)}」。`] : ['warn', `还没看出「${name(id)}」。${M.byId[id].what}`]);
    if (c.slipped) rows.push(['warn', '这句话里有一个要避免的说法，再读一下题目要求。']);
    if (c.tooShort) rows.push(['warn', '这句话有点短，试着说完整一点。']);
    c.tagged.moves.filter(x => x !== id).forEach(x => rows.push(['ok', `还用到了「${name(x)}」。`]));
    c.tagged.slips.forEach(x => rows.push(['warn', M.slip(x).why]));
    return `<div class="dl-fb">${rows.map(([k, t]) => `<div class="dl-fbrow ${k}"><span class="chip dl-move ${k}">${k === 'ok' ? '做到了' : '可以再试'}</span><span>${esc(t)}</span></div>`).join('')}</div>${note('演示：关键词规则，不是 AI，也不是评分。')}`;
  }

  /* ---------- bookings ---------- */
  const bookings = () => ((Z().ACC && Z().ACC.mine && Z().ACC.mine.bookings) || []).filter(b => b.kind === 'coach' && b.status !== 'cancelled' && b.status !== 'expired');
  const bookingOf = id => bookings().find(b => b.id === id);
  const upcomingCoach = () => bookings().filter(b => b.start + b.durationMin * 60e3 > Date.now()).sort((a, b) => a.start - b.start);
  const pastCoach = () => bookings().filter(b => b.start + b.durationMin * 60e3 <= Date.now()).sort((a, b) => b.start - a.start);
  const when = b => `${fmtD(b.start)} ${fmtT(b.start)}`;
  const missing = t => `${back('#me', '我的')}<header class="page-h"><h1>${t}</h1><p>预约信息还没读到，或这个预约已取消。</p></header>`;

  function viewPrep(bid) {
    const b = bookingOf(bid); if (!b) return missing('找不到这个预约');
    const c = cardOf(bid), recs = dialogRecords().slice(0, 3), sum = summarize(recs), focus = c.focus || focusFrom(sum);
    const prev = pastCoach().map(x => cardOf(x.id).review && { b: x, r: cardOf(x.id).review }).filter(Boolean)[0];
    const slipRows = Object.entries(sum.slips).sort((a, b) => b[1].n - a[1].n).map(([id, v]) => { const s = M.slip(id); return `<li><div class="t"><span class="chip dl-move warn">${esc(s.name)}</span><span class="muted">出现 ${v.n} 次 · 例：<span lang="en">${esc(v.quote)}</span></span></div>${lessonLink(s.fix, `回看「${name(s.fix)}」`)}</li>`; });
    const goodRows = Object.entries(sum.moves).sort((a, b) => b[1].n - a[1].n).slice(0, 3).map(([id, v]) => `<li><div class="t">${moveChip(id, 'ok')}<span class="muted">做到 ${v.n} 次</span></div>${lessonLink(id, '回看')}</li>`);
    return `${back('#me', '我的')}
      <header class="page-h"><div class="eyebrow">准备卡 · ${esc(when(b))}</div><h1>${esc(b.title)}</h1><p>上课前花两分钟看一下。老师会在上课前看到这张卡${c.share === false ? '（你已关闭练习记录共享，老师只看到你写的话）' : ''}。</p></header>
      <div class="two"><section class="stack">
        <div class="card dl-pad"><div class="sec-h"><h2>根据你最近 ${recs.length || 0} 次讨论练习</h2></div>
          ${recs.length ? `<ul class="dl-list">${slipRows.join('')}${goodRows.join('')}</ul>${!slipRows.length && !goodRows.length ? '<p class="muted">这几次练习里没有标出讨论动作。</p>' : ''}` : `<p class="muted">还没有讨论练习记录。做一次 AI 小组讨论，准备卡会更有针对性。</p><div><button class="btn sm ghost" data-a="open" data-id="xj-group">做一次 AI 小组讨论</button></div>`}
          ${prev ? `<div class="dl-try"><span>上次（${esc(fmtD(prev.b.start))}）老师说下次重点：</span><span class="chips">${(prev.r.next || []).map(id => moveChip(id)).join('')}</span></div>` : ''}</div>
        <div class="card dl-pad"><div class="sec-h"><h2>这次想重点练</h2><span class="aside">点选，最多 2 个</span></div>
          <div class="chips" role="group" aria-label="这次重点">${M.MOVES.map(m => `<button class="chip dl-pick ${focus.includes(m.id) ? 'on' : ''}" aria-pressed="${focus.includes(m.id)}" data-a="dl-focus" data-id="${bid}" data-m="${m.id}">${esc(m.name)}</button>`).join('')}</div>
          <label class="field"><span>我最想请老师帮我看的（会给老师看）</span><textarea id="dl-prep-note" rows="3" placeholder="例如：别人跑题时，我不知道怎么礼貌地拉回来。">${esc(c.note || '')}</textarea></label>
          <label class="dl-toggle"><input type="checkbox" id="dl-share" ${c.share === false ? '' : 'checked'}><span>同意老师上课前查看我最近的练习原话和讨论动作（可以随时关闭）</span></label>
          <div class="chips"><button class="btn" data-a="dl-prep-save" data-id="${bid}">保存准备卡</button>${c.prepAt ? `<span class="muted" style="font-size:13px">已保存 · ${esc(fmtD(c.prepAt))} ${esc(fmtT(c.prepAt))}</span>` : ''}</div></div>
      </section>
      <aside class="stack"><div class="card dl-pad"><b>上课信息</b><dl class="dl-kv"><dt>时间</dt><dd>${esc(when(b))} · ${b.durationMin} 分钟</dd><dt>老师</dt><dd>${esc(b.teacher || '待安排')}</dd><dt>方式</dt><dd>腾讯会议 · 开始前 15 分钟在「今天」出现「进入课堂」</dd></dl>
          <button class="btn sm ghost" data-a="pf-booking" data-id="${bid}">预约详情</button></div>
        <div class="card dl-pad"><b>上课须知</b><ul class="dl-rules"><li>会议里只用昵称，不交换联系方式。</li><li>未经双方同意不录音录像；未满 18 周岁需监护人同意。</li><li>本工具提供练习与反馈，不对考试或录取结果作任何承诺。</li></ul></div>
        <div class="card dl-pad dl-demo"><b>演示：老师端</b><p class="muted" style="font-size:13px">正式版中老师在老师后台写复盘，学生看不到这个入口。</p><a class="btn sm ghost" href="#teacher-${bid}">以老师身份写复盘</a></div></aside></div>`;
  }

  function viewTeacher(bid) {
    const b = bookingOf(bid); if (!b) return missing('找不到这个预约');
    const c = cardOf(bid), r = c.review || {}, sum = c.share === false ? null : summarize(dialogRecords().slice(0, 3));
    const T = S._dlT && S._dlT.bid === bid ? S._dlT : (S._dlT = { bid, good: [...(r.good || [])], next: [...(r.next || c.focus || [])] });
    const pick = (key, list) => `<div class="chips">${M.MOVES.map(m => `<button class="chip dl-pick ${list.includes(m.id) ? 'on' : ''}" aria-pressed="${list.includes(m.id)}" data-a="dl-tpick" data-k="${key}" data-m="${m.id}">${esc(m.name)}</button>`).join('')}</div>`;
    return `${back(`#prep-${bid}`, '回到学生视图')}
      <div class="notice dl-demo-bar">${ic('pen')}<div><b>演示：老师端复盘</b> 正式版放在老师后台。动作词和课程、AI 反馈是同一套，老师点选即可。</div></div>
      <header class="page-h"><div class="eyebrow">${esc(b.teacher || '老师')} · ${esc(when(b))}</div><h1>写复盘：${esc(b.title)}</h1></header>
      <div class="two"><section class="card dl-pad">
        <div class="field"><span>这次做得好的动作</span>${pick('good', T.good)}</div>
        <label class="field"><span>学生的一句原话（可选）</span><input id="dl-t-quote" value="${esc(r.quote || '')}" placeholder="例如：Leo supports phones with rules, and Sam suggested lockers."></label>
        <div class="field"><span>下次重点</span>${pick('next', T.next)}</div>
        <label class="field"><span>一句话给学生</span><textarea id="dl-t-comment" rows="3" placeholder="具体说一个做得好的地方，再说一个下次可以试的做法。">${esc(r.comment || '')}</textarea></label>
        <div class="chips"><button class="btn" data-a="dl-t-send" data-id="${bid}">提交复盘，发给学生</button></div>
        ${note('复盘只记录练习情况，不打分，不预测考试结果。')}</section>
      <aside class="stack"><div class="card dl-pad"><b>学生的准备卡</b>
        ${c.note ? `<div class="dl-try"><span class="muted">学生最想练的</span><span>${esc(c.note)}</span></div>` : '<p class="muted" style="font-size:13px">学生还没写准备卡。</p>'}
        ${(c.focus || []).length ? `<div class="chips">${c.focus.map(id => moveChip(id)).join('')}</div>` : ''}
        ${sum ? `<p class="muted" style="font-size:13px">最近 ${sum.count} 次练习</p><div class="chips">${Object.entries(sum.slips).map(([id, v]) => `<span class="chip dl-move warn">${esc(M.slip(id).name)} ×${v.n}</span>`).join('')}${Object.entries(sum.moves).map(([id, v]) => `<span class="chip dl-move ok">${esc(name(id))} ×${v.n}</span>`).join('')}</div>` : '<p class="muted" style="font-size:13px">学生没有共享练习记录。</p>'}</div></aside></div>`;
  }

  function viewReview(bid) {
    const b = bookingOf(bid); if (!b) return missing('找不到这个复盘');
    const r = cardOf(bid).review;
    if (!r) return `${back('#me', '我的')}<header class="page-h"><div class="eyebrow">${esc(when(b))}</div><h1>${esc(b.title)}</h1><p>老师还没写复盘。写好后会出现在「今天」和「我的」。</p></header>`;
    return `${back('#me', '我的')}
      <header class="page-h"><div class="eyebrow">${esc(b.teacher || '老师')}的复盘 · ${esc(fmtD(r.at))}</div><h1>${esc(b.title)}</h1></header>
      <div class="two"><section class="card dl-pad">
        <b>老师的话</b><p>${esc(r.comment || '（老师没有填写）')}</p>
        <div class="field"><span>这次做得好的</span><div class="chips">${(r.good || []).map(id => moveChip(id, 'ok')).join('') || '<span class="muted">未选择</span>'}</div></div>
        ${r.quote ? `<div class="dl-try"><span class="muted">你在模拟里说的一句</span><span lang="en">“${esc(r.quote)}”</span></div>` : ''}
        <div class="field"><span>下次重点</span><ul class="dl-list">${(r.next || []).map(id => `<li><div class="t">${moveChip(id)}<span class="muted">${esc((M.byId[id] || {}).what || '')}</span></div><span class="chips">${lessonLink(id, '回看')}<a class="btn sm" href="#drill-${id}">练一次</a></span></li>`).join('') || '<li class="muted">未选择</li>'}</ul></div>
        ${note('复盘只记录练习情况，不是评分，也不预测考试结果。')}</section>
      <aside class="stack"><div class="tile accent" style="gap:10px"><div class="k">接下来</div><b style="font-size:17px">先练「${esc(name((r.next || [])[0] || 'build'))}」，再做一次 AI 小组讨论</b><div><button class="btn light" data-a="open" data-id="xj-group">AI 小组讨论</button></div></div>
        <p class="muted" style="font-size:13px">下次预约时，准备卡会把这次的复盘一起带上。</p></aside></div>`;
  }

  /* ---------- routing: new routes render through the existing shell via viewToday's fallback ---------- */
  const ROUTE = [
    [/^moves$/, () => viewMoves(), 'practice'],
    [/^drill-([a-z]+)$/, m => viewDrill(m[1]), 'practice'],
    [/^prep-(.+)$/, m => viewPrep(m[1]), 'me'],
    [/^teacher-(.+)$/, m => viewTeacher(m[1]), 'me'],
    [/^review-(.+)$/, m => viewReview(m[1]), 'me'],
  ];
  const match = r => { for (const [re, fn, tab] of ROUTE) { const m = re.exec(r); if (m) return { fn: () => fn(m), tab }; } return null; };

  const prevToday = viewToday;
  viewToday = function () {
    const hit = match(route());
    if (hit) return hit.fn();
    return withAfterHeader(prevToday(), todayCard());
  };
  function withAfterHeader(html, extra) {
    if (!extra) return html;
    const i = html.indexOf('</header>');
    return i < 0 ? extra + html : html.slice(0, i + 9) + extra + html.slice(i + 9);
  }
  function todayCard() {
    const items = [];
    const next = upcomingCoach()[0];
    if (next) { const c = cardOf(next.id); items.push(`<div class="irow"><div class="ico">${ic('talk')}</div><div class="t"><b>${c.prepAt ? '准备卡已填好' : '填写准备卡'} · ${esc(next.title)}</b><span>${esc(when(next))}${next.teacher ? ' · ' + esc(next.teacher) : ''}</span></div><div class="act"><a class="btn sm ${c.prepAt ? 'ghost' : ''}" href="#prep-${next.id}">${c.prepAt ? '查看' : '去填写'}</a></div></div>`); }
    const rev = pastCoach().find(b => cardOf(b.id).review && !cardOf(b.id).seen);
    if (rev) items.push(`<div class="irow"><div class="ico">${ic('check')}</div><div class="t"><b>老师的复盘到了 · ${esc(rev.title)}</b><span>下次重点：${(cardOf(rev.id).review.next || []).map(name).map(esc).join('、') || '—'}</span></div><div class="act"><a class="btn sm" href="#review-${rev.id}">查看</a></div></div>`);
    const sum = summarize(dialogRecords().slice(0, 5)), used = Object.keys(sum.moves);
    items.push(`<div class="irow"><div class="ico">${ic('pen')}</div><div class="t"><b>讨论语言</b><span>${used.length ? `最近用到：${used.slice(0, 4).map(name).map(esc).join('、')}` : '课程、AI 反馈和老师复盘用同一套讨论动作'}</span></div><div class="act"><a class="btn sm ghost" href="#moves">查看</a></div></div>`);
    return `<section class="sec dl-today"><div class="card items">${items.join('')}</div></section>`;
  }

  const prevRecord = viewRecord;
  viewRecord = function (rid) {
    const html = prevRecord(rid), r = (S.records || []).find(x => x.id === rid);
    return r ? withAfterHeader(html, recordPanel(r)) : html;
  };
  const prevRecords = viewRecords;
  viewRecords = function () {
    const sum = summarize(dialogRecords().slice(0, 10)), ids = Object.keys(sum.moves), slips = Object.keys(sum.slips);
    if (!sum.count) return prevRecords();
    return withAfterHeader(prevRecords(), `<section class="sec dl-rec"><div class="card dl-pad"><div class="sec-h"><h2>最近 ${sum.count} 次讨论里的动作</h2><a class="link" href="#moves">讨论语言</a></div>
      <div class="chips">${ids.map(id => `<span class="chip dl-move ok">${esc(name(id))} ×${sum.moves[id].n}</span>`).join('')}${slips.map(id => `<a class="chip dl-move warn" href="#drill-${M.slip(id).fix}">可以再试 · ${esc(M.slip(id).name)} ×${sum.slips[id].n}</a>`).join('')}</div></div></section>`);
  };

  /* 我的 is rendered inside platform-client; add the mock section after it draws. */
  function meSection() {
    const up = upcomingCoach(), past = pastCoach();
    const row = (b, past) => { const c = cardOf(b.id); const act = past ? (c.review ? `<a class="btn sm" href="#review-${b.id}">复盘卡</a>` : `<a class="btn sm ghost" href="#review-${b.id}">等老师复盘</a>`) : `<a class="btn sm ${c.prepAt ? 'ghost' : ''}" href="#prep-${b.id}">${c.prepAt ? '准备卡' : '填准备卡'}</a>`;
      return `<div class="irow"><div class="ico">${ic(past ? 'check' : 'talk')}</div><div class="t"><b>${esc(b.title)}</b><span>${esc(when(b))}${b.teacher ? ' · ' + esc(b.teacher) : ''}</span></div><div class="act">${act}</div></div>`; };
    return `<section class="sec dl-me"><div class="sec-h"><h2>真人模拟 · 准备与复盘</h2><a class="link" href="#moves">讨论语言</a></div>
      <div class="card items">${up.map(b => row(b, false)).join('')}${past.slice(0, 3).map(b => row(b, true)).join('')}${!up.length && !past.length ? `<div class="empty">预约一对一模拟后，这里会出现准备卡；结束后老师的复盘也放在这里。<div style="margin-top:8px"><a class="btn sm ghost" href="#course-p_1v1">预约老师</a></div></div>` : ''}</div></section>`;
  }

  // Route changes may draw inside a view transition (experience.js), so decorate whenever #app is redrawn.
  function decorate() {
    const r = route(), hit = match(r);
    if (hit) {
      document.querySelectorAll('.rail .nav a, .cx-top nav a, nav[aria-label="主导航"] a').forEach(a => {
        const on = a.getAttribute('href') === '#' + hit.tab;
        a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
    }
    if (r === 'me') { const main = document.querySelector('.me-main'); if (main && !main.querySelector('.dl-me')) main.insertAdjacentHTML('afterbegin', meSection()); }
    if (/^review-/.test(r)) { const bid = r.slice(7); if (cardOf(bid).review && !cardOf(bid).seen) putCard(bid, { seen: true }); }
  }
  const app = document.getElementById('app');
  if (app) new MutationObserver(decorate).observe(app, { childList: true });
  const prevRender = render;
  render = function () { prevRender(); decorate(); };

  /* booking details sheet: add prep / review entry */
  const prevBooking = ACT['pf-booking'];
  if (prevBooking) ACT['pf-booking'] = function (d) {
    prevBooking.apply(this, arguments);
    const b = bookingOf(d.id), sh = document.querySelector('#sheet .sheet'); if (!b || !sh || sh.querySelector('.dl-sheet')) return;
    const past = b.start + b.durationMin * 60e3 <= Date.now(), c = cardOf(b.id);
    sh.insertAdjacentHTML('beforeend', `<div class="notice dl-sheet">${ic(past ? 'check' : 'talk')}<div><b>${past ? (c.review ? '老师已写复盘' : '等老师写复盘') : (c.prepAt ? '准备卡已填好' : '上课前填一下准备卡')}</b><p class="muted">${past ? '复盘里的重点会链接回课程和练习。' : '老师上课前会看到你最想练的内容。'}</p><div style="margin-top:8px"><a class="btn sm" href="#${past ? 'review' : 'prep'}-${b.id}" data-a="close-sheet">${past ? '查看复盘卡' : '打开准备卡'}</a></div></div></div>`);
  };

  /* ---------- actions ---------- */
  ACT['dl-check'] = d => { const t = document.getElementById('dl-in').value; (S._dl ||= {})[d.id] = { text: t, shown: true }; document.getElementById('dl-out').innerHTML = drillOut(d.id, t); };
  ACT['dl-sample'] = d => { const el = document.getElementById('dl-in'); el.value = M.DRILLS[d.id].sample; ACT['dl-check'](d); };
  ACT['dl-focus'] = d => {
    const c = cardOf(d.id), sum = summarize(dialogRecords().slice(0, 3)); let f = [...(c.focus || focusFrom(sum))];
    const i = f.indexOf(d.m); if (i >= 0) f.splice(i, 1); else { f.push(d.m); if (f.length > 2) f.shift(); }
    putCard(d.id, { focus: f, note: document.getElementById('dl-prep-note').value, share: document.getElementById('dl-share').checked }); render();
  };
  ACT['dl-prep-save'] = d => {
    const c = cardOf(d.id), sum = summarize(dialogRecords().slice(0, 3));
    putCard(d.id, { focus: c.focus || focusFrom(sum), note: document.getElementById('dl-prep-note').value.trim(), share: document.getElementById('dl-share').checked, prepAt: Date.now() });
    toast('准备卡已保存'); render();
  };
  ACT['dl-tpick'] = d => { const T = S._dlT; if (!T) return; const list = T[d.k]; const i = list.indexOf(d.m); if (i >= 0) list.splice(i, 1); else list.push(d.m); keepTeacherInputs(); render(); };
  function keepTeacherInputs() { const T = S._dlT, bid = T.bid; const q = document.getElementById('dl-t-quote'), cm = document.getElementById('dl-t-comment'); const r = cardOf(bid).review || {}; putCard(bid, { draft: true }); T.quote = q ? q.value : r.quote; T.comment = cm ? cm.value : r.comment; }
  ACT['dl-t-send'] = d => {
    const T = S._dlT || { good: [], next: [] };
    putCard(d.id, { review: { good: T.good, next: T.next, quote: document.getElementById('dl-t-quote').value.trim(), comment: document.getElementById('dl-t-comment').value.trim(), at: Date.now() }, seen: false });
    S._dlT = null; toast('复盘已发给学生（演示）'); location.hash = '#review-' + d.id;
  };
  // Keep teacher text fields across chip re-renders.
  const prevTeacher = viewTeacher;
  viewTeacher = function (bid) {
    const html = prevTeacher(bid), T = S._dlT;
    if (!T || T.bid !== bid) return html;
    return html.replace(/(id="dl-t-quote" value=")[^"]*"/, (_, a) => `${a}${esc(T.quote || '')}"`).replace(/(id="dl-t-comment"[^>]*>)[^<]*</, (_, a) => `${a}${esc(T.comment || '')}<`);
  };
  ROUTE[3][1] = m => viewTeacher(m[1]);

  window.ZPDiscussion = { summarize, turnsOf, recordPanel, cardOf, putCard };
})();
