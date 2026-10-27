/* 周边与评价面板：点开公寓后，详情里的「周边治安 / 周边餐饮 / 住户评价 / 团队探访与资料解读」都在这里打开。
   - 面板绑定当前公寓（名称 + 参考邮编），不用输入邮编；地图上换一栋公寓，面板跟着换；切换时丢弃上一栋迟到的响应（A1）。
   - 电脑上是右侧侧栏，手机上是全屏面板；关闭不动地图视角、语言、收藏和选房状态（A2）。
   - 数据按需读取：打开某一页时才请求，同一栋楼读过就先显示，后台更新时保留已有结果。
   - 状态：读取中 / 后台更新 / 真实零结果 / 失败（不变成 0，可重试）/ 旧数据（带日期）/ 部分结果 / 未接通（不显示数字）。
     链接加 ?demo=1 时面板底部有「状态演示」，可以逐个查看这些状态（A5），演示状态会醒目标注。
   - 数据来源：和 consult-server 一起部署时读 /api/local/*（服务器代取 data.police.uk 和 FSA，并缓存）；没有服务器时读
     local-snapshots/<police|food>/<公寓编号>.json 里带读取时间的真实快照；都没有就显示「数据源尚未接通」，不填任何数字。
   住户评价、团队探访与资料解读由 resident-reviews.js 注册（LocalPanel.register）。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, pick } = BT;
  const T = {
    zh: {
      entryH: '周边与评价', mini: '📍 周边与评价', eyebrow: '周边与评价', back: '← 返回地图', close: '关闭',
      pc: '参考邮编 {p}', pcArea: '参考邮编 {p}（街区参考）',
      tabs: { police: '周边治安', food: '周边餐饮', reviews: '住户评价', team: '团队探访与资料解读' },
      entryDesc: { police: '警方公开的月度记录', food: '食品卫生评级 · 中餐', reviews: '本站住户匿名评价', team: '实地探访 · 有来源的解读' },
      loading: '正在读取…', refreshing: '后台更新中，先显示已有结果', retry: '重试', fetched: '读取时间：{t}', source: '来源', licence: '许可',
      unavailable: '数据源尚未接通，暂不显示数字。接通后这里会显示官方记录。', failed: '这次没读到数据（{e}）。没有数据不代表 0。', failedOld: '这次更新失败，下面是 {t} 读取的旧数据。',
      stale: '这是 {t} 读取的数据，正在后台更新。', partial: '只读到了部分数据，结果不完整。', demoHome: '演示公寓是虚构的，没有官方数据。',
      // 治安
      pMonth: '数据月份', pRadius: '查询范围', pRadiusV: '公寓参考点周围 1 英里（约 1.6 公里）', pCenter: '参考点', pCenterB: '这栋楼的固定参考坐标', pCenterS: '街区参考点（多栋房屋，取所在街区）',
      pTotal: '条登记记录', pTotalSub: '犯罪及反社会行为，该月份在范围内登记的总数', pTop: '数量最多的三类', pAll: '展开全部 {n} 类', pLess: '收起',
      pZero: '该月份在这个范围内没有登记记录。这只说明当月没有登记，不代表没有风险。', pArea: '范围示意（圆圈是查询范围，不是案件位置）',
      pNotes: ['这是警方按月公开的犯罪及反社会行为登记记录，位置已经匿名化处理，只精确到附近的参考点。', '记录发生在公寓周边，不代表发生在公寓内；数量是登记的事件数，不是受害人数。', '这些数字不能用来给公寓打「安全分」或做安全排名。'],
      pMissing: '缺报说明：个别月份可能有警队缺报或延迟，以 data.police.uk 的更新记录为准。', pMissingLink: '查看更新记录',
      pDemoShare: '{p}%',
      // 餐饮
      fAll: '全部餐饮', fChinese: '中餐', fSearch: '搜索店名、地址或邮编', fNone: '没有符合条件的店。', fCount: '共 {n} 家（1 英里内）', fPage: '第 {p} / {n} 页', fPrev: '上一页', fNext: '下一页',
      fDist: '直线 {d}', fRating: '卫生等级', fDate: '评级日期 {d}', fStatus: { 'awaiting-inspection': '等待检查', 'awaiting-publication': '等待公布', exempt: '豁免评级', other: '其他状态' },
      fNotes: ['0–5 是食品卫生等级，不是口味评分或顾客星级。', '距离是到公寓参考点的直线距离，不是步行距离。', '卫生记录不保证店铺目前仍在营业。'],
      fChineseNote: '中餐标签来自独立核实的餐厅官网或官方商户页面，按 FSA 商户编号和邮编匹配。首批名单不完整，没有标签不代表不是中餐。目前已核实 {n} 家。',
      fChineseEmpty: '中餐名单还在整理，目前还没有已核实的店。可以先在「全部餐饮」里搜索。',
      // 状态演示
      sdH: '状态演示', sdNote: '演示状态：下面不是真实数据', sd: { real: '真实结果', loading: '读取中', refreshing: '后台更新', zero: '真实零结果', failed: '失败', stale: '旧数据', partial: '部分结果', unavailable: '未接通' }
    },
    en: {
      entryH: 'Area & reviews', mini: '📍 Area & reviews', eyebrow: 'Area & reviews', back: '← Back to map', close: 'Close',
      pc: 'Reference postcode {p}', pcArea: 'Reference postcode {p} (street-area reference)',
      tabs: { police: 'Local police records', food: 'Nearby food', reviews: 'Resident reviews', team: 'Team visits and insights' },
      entryDesc: { police: 'Monthly public police records', food: 'Food hygiene ratings · Chinese', reviews: 'Anonymous reviews on this site', team: 'Real visits · sourced notes' },
      loading: 'Loading…', refreshing: 'Updating in the background; showing current results', retry: 'Retry', fetched: 'Retrieved: {t}', source: 'Source', licence: 'Licence',
      unavailable: 'The data source is not connected yet, so no figures are shown. Official records will appear here once it is.', failed: 'Could not load the data ({e}). Missing data is not zero.', failedOld: 'The update failed; below is data retrieved on {t}.',
      stale: 'This data was retrieved on {t} and is being updated.', partial: 'Only part of the data loaded; results are incomplete.', demoHome: 'The demo property is fictional and has no official data.',
      pMonth: 'Data month', pRadius: 'Search area', pRadiusV: '1 mile (about 1.6 km) around the property reference point', pCenter: 'Reference point', pCenterB: 'The building’s fixed reference coordinate', pCenterS: 'Street-area reference (several houses; the street area is used)',
      pTotal: 'recorded incidents', pTotalSub: 'Crime and anti-social behaviour recorded in the area that month', pTop: 'Three largest categories', pAll: 'Show all {n} categories', pLess: 'Show less',
      pZero: 'No records in this area for that month. This only means none were recorded; it does not mean there is no risk.', pArea: 'Area illustration (the circle is the search area, not incident locations)',
      pNotes: ['These are monthly police records of crime and anti-social behaviour. Locations are anonymised to nearby reference points.', 'Nearby records are not necessarily incidents inside the property, and counts are incidents, not victims.', 'These figures must not be turned into a safety score or ranking for the property.'],
      pMissing: 'Missing data: some months may have late or missing returns from a force; see the data.police.uk changelog.', pMissingLink: 'View changelog',
      pDemoShare: '{p}%',
      fAll: 'All food', fChinese: 'Chinese', fSearch: 'Search name, address or postcode', fNone: 'No matching venues.', fCount: '{n} venues within 1 mile', fPage: 'Page {p} of {n}', fPrev: 'Previous', fNext: 'Next',
      fDist: '{d} straight-line', fRating: 'Hygiene rating', fDate: 'Rated {d}', fStatus: { 'awaiting-inspection': 'Awaiting inspection', 'awaiting-publication': 'Awaiting publication', exempt: 'Exempt', other: 'Other status' },
      fNotes: ['Ratings from 0 to 5 describe food hygiene, not taste or customer stars.', 'Distances are straight-line from the property reference point, not walking distances.', 'A hygiene record does not guarantee that a venue is still trading.'],
      fChineseNote: 'Chinese tags come from independently checked restaurant or official venue websites, matched by FSA business ID and postcode. The first list is incomplete; no tag does not mean a venue is not Chinese. {n} venues checked so far.',
      fChineseEmpty: 'The Chinese list is still being compiled and has no checked venues yet. Try searching All food.',
      sdH: 'State demo', sdNote: 'Demo state: what follows is not real data', sd: { real: 'Real result', loading: 'Loading', refreshing: 'Refreshing', zero: 'Valid zero', failed: 'Failure', stale: 'Stale data', partial: 'Partial', unavailable: 'Not connected' }
    }
  };
  const k = () => pick(T), zh = () => BT.lang() === 'zh';
  const demoMode = new URLSearchParams(location.search).get('demo') === '1';
  const postcodeOf = h => {
    if (h.postcode) return { p: h.postcode, area: !!h.area };
    const full = /[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}/i.exec(h.addr || ''), district = /\bL\d{1,2}\b/.exec(h.addr || '');
    return { p: full ? full[0].toUpperCase() : district ? district[0] : '—', area: !full || /houses/.test(h.id) };
  };
  const when = iso => { try { return new Date(iso).toLocaleString(zh() ? 'zh-CN' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }); } catch (_) { return iso; } };
  const monthName = m => { const [y, mo] = String(m).split('-'); return zh() ? `${y} 年 ${Number(mo)} 月` : new Date(Date.UTC(+y, +mo - 1, 1)).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }); };
  const a = (text, href) => { const x = el('a', '', text); x.href = href; x.target = '_blank'; x.rel = 'noopener'; return x; };

  /* ---------- 数据：服务器 → 真实快照 → 未接通 ---------- */
  const mem = new Map();   // kind:homeId(:query) → 最近一次可用结果
  async function load(kind, home, params, signal) {
    const qs = new URLSearchParams({ homeId: home.id, ...(params || {}) }); let server = null;
    if (/^https?:$/.test(location.protocol)) {
      try {
        const r = await fetch(`./api/local/${kind}?${qs}`, { signal, cache: 'no-store' });
        if (r.ok) { const j = await r.json(); if (j && j.status) { if (j.status !== 'failed') return j; server = j; } }
      } catch (e) { if (e.name === 'AbortError') throw e; /* 没有服务器：看快照 */ }
      try {
        const r = await fetch(`./local-snapshots/${kind}/${encodeURIComponent(home.id)}.json`, { signal });
        if (r.ok) {
          const j = await r.json(); j.snapshot = true;
          if (server) { j.status = 'stale'; j.refreshFailed = true; }   // 服务器这次没读到：显示带日期的快照，不显示 0
          return kind === 'food' ? pageLocally(j, params) : j;
        }
      } catch (e) { if (e.name === 'AbortError') throw e; }
    }
    return server || { status: 'unavailable' };
  }
  /* 快照里是完整列表：在本机筛选和分页 */
  function pageLocally(j, p) {
    let items = j.items || [];
    const totalAll = items.length, totalChinese = items.filter(i => i.cuisine === 'chinese').length;
    if (p.cuisine === 'chinese') items = items.filter(i => i.cuisine === 'chinese');
    const q = String(p.q || '').trim().toLowerCase(); if (q) items = items.filter(i => (i.name + ' ' + i.address + ' ' + i.postcode).toLowerCase().includes(q));
    const size = 20, pages = Math.max(1, Math.ceil(items.length / size)), pg = Math.min(pages, Math.max(1, Number(p.page) || 1));
    return { ...j, totalAll, totalChinese, total: items.length, page: pg, pages, pageSize: size, items: items.slice((pg - 1) * size, pg * size) };
  }

  /* ---------- 面板外壳 ---------- */
  const panels = {};   // 其他模块注册的页：reviews、team
  let root = null, cur = null, tab = 'police', reqSeq = 0, ctl = null, sdState = 'real', demoFrom = null;
  function open(home, which) {
    if (!home) return;
    if (which) tab = which;
    demoFrom = home.demo ? (BT.homeNow() || {}).id : null;   // 从哪栋楼点进演示公寓：那栋楼的卡片重画时不算「换了公寓」
    if (!root) build();
    root.hidden = false; document.body.classList.add('lp-open');
    bind(home); dodge();
  }
  /* 电脑上：公寓卡片如果被侧栏挡住，就往左挪到侧栏旁边；关闭时放回原处 */
  let moved = null;
  function dodge() {
    const card = document.getElementById('card'); if (!card || !root || root.hidden || innerWidth <= 640) return;
    requestAnimationFrame(() => {
      const r = card.getBoundingClientRect(), edge = innerWidth - root.offsetWidth - 12;
      if (r.width && r.right > edge) { if (!moved || moved.card !== card) moved = { card, left: card.style.left }; card.style.left = Math.max(12, edge - r.width) + 'px'; }
    });
  }
  function build() {
    root = el('aside', 'lp'); root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'false'); root.hidden = true;
    root.addEventListener('click', e => e.stopPropagation());
    root.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
    document.body.append(root);
  }
  function close() { if (!root) return; if (moved) { moved.card.style.left = moved.left; moved = null; } root.hidden = true; document.body.classList.remove('lp-open'); if (ctl) ctl.abort(); reqSeq++; }
  function bind(home) {
    cur = home; const K = k(), pc = postcodeOf(home);
    root.replaceChildren();
    const head = el('header', 'lp-head'), titles = el('div', 'lp-titles');
    titles.append(el('p', 'bt-eyebrow', K.eyebrow), el('h3', 'lp-title', home.name), el('p', 'lp-pc', home.demo ? '' : fmt(pc.area ? K.pcArea : K.pc, { p: pc.p })));
    const x = btn('x', '×'); x.setAttribute('aria-label', K.close); x.addEventListener('click', close);
    head.append(titles, x);
    const back = btn('bt-link lp-back', K.back); back.addEventListener('click', close);
    const tabs = el('div', 'br-tabs lp-tabs'); tabs.setAttribute('role', 'tablist');
    Object.entries(K.tabs).forEach(([id, label]) => { const b = btn('br-tab', label); b.dataset.id = id; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(id === tab)); b.addEventListener('click', () => { tab = id; tabs.querySelectorAll('.br-tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.id === id))); draw(); }); tabs.append(b); });
    const body = el('div', 'lp-body'); body.id = 'lpBody';
    root.append(head, back, tabs);
    if (home.demo) root.append(el('p', 'lp-demo lp-demohead', zh() ? '演示公寓（虚构）· 演示内容，不计入真实统计' : 'Fictional demo property · demo content, excluded from real figures'));
    root.append(body);
    if (demoMode && !home.demo) root.append(stateDemo());
    root.setAttribute('aria-label', home.name);
    draw();
    x.focus({ preventScroll: true });
  }
  const body = () => root && root.querySelector('.lp-body');
  function draw() {
    const b = body(); if (!b) return;
    if (ctl) ctl.abort(); ctl = new AbortController(); const id = ++reqSeq;
    b.replaceChildren(); b.scrollTop = 0;
    const ctx = { home: cur, signal: ctl.signal, live: () => id === reqSeq && root && !root.hidden, body: b };
    if (tab === 'police') police(ctx); else if (tab === 'food') food(ctx, { cuisine: 'all', q: '', page: 1 });
    else if (panels[tab]) panels[tab](ctx); else b.append(el('p', 'bt-note', '…'));
  }
  /* 状态演示（?demo=1） */
  function stateDemo() {
    const K = k(), bar = el('div', 'lp-sd'); bar.append(el('b', '', K.sdH));
    const sel = el('select'); Object.entries(K.sd).forEach(([v, t]) => { const o = el('option', '', t); o.value = v; sel.append(o); }); sel.value = sdState;
    sel.addEventListener('change', () => { sdState = sel.value; draw(); });
    bar.append(sel); return bar;
  }
  /* 把真实结果按「状态演示」改造；real 不改 */
  function applyDemo(r) {
    if (!demoMode || sdState === 'real' || cur.demo) return r;
    const base = { ...r, demoState: true };
    if (sdState === 'loading') return { status: 'loading', demoState: true };
    if (sdState === 'unavailable') return { status: 'unavailable', demoState: true };
    if (sdState === 'failed') return { status: 'failed', error: 'timeout', demoState: true };
    if (sdState === 'zero') return { ...base, status: 'ok', total: 0, categories: [], items: [], totalAll: 0, totalChinese: 0, pages: 1, page: 1, fetchedAt: r.fetchedAt || new Date().toISOString(), month: r.month || '2026-08' };
    if (r.status === 'unavailable' || r.status === 'failed') return r;   // 没有真实数据时，其他演示状态没有东西可显示
    if (sdState === 'stale') return { ...base, status: 'stale', refreshPending: true };
    if (sdState === 'refreshing') return { ...base, refreshPending: true };
    if (sdState === 'partial') return { ...base, status: 'partial', coverage: 'partial' };
    return r;
  }
  function stateBanner(r, wrap) {
    const K = k();
    if (r.demoState) wrap.append(el('p', 'lp-demo', '⚠️ ' + K.sdNote));
    if (r.refreshFailed) wrap.append(el('p', 'lp-state warn', fmt(K.failedOld, { t: when(r.fetchedAt) })));
    else if (r.status === 'stale') wrap.append(el('p', 'lp-state warn', fmt(K.stale, { t: when(r.fetchedAt) })));
    else if (r.refreshPending) wrap.append(el('p', 'lp-state', '⟳ ' + K.refreshing));
    if (r.status === 'partial' || r.coverage === 'partial') wrap.append(el('p', 'lp-state warn', K.partial));
  }
  function errorBox(r, retry) {
    const K = k(), box = el('div', 'lp-empty');
    if (r.status === 'unavailable') box.append(el('p', '', K.unavailable));
    else { box.append(el('p', '', fmt(K.failed, { e: r.error || 'error' }))); const b = btn('bt-btn alt', K.retry); b.addEventListener('click', retry); box.append(b); }
    if (r.demoState) box.prepend(el('p', 'lp-demo', '⚠️ ' + K.sdNote));
    return box;
  }
  const loadingBox = () => { const b = el('div', 'lp-loading'); b.append(el('i'), el('span', '', k().loading)); return b; };
  function footer(r, links) {
    const K = k(), f = el('div', 'lp-src');
    if (r.fetchedAt) f.append(el('span', '', fmt(K.fetched, { t: when(r.fetchedAt) }) + (r.snapshot ? (zh() ? '（快照）' : ' (snapshot)') : '')));
    links.forEach(([lab, text, href]) => { const s = el('span'); s.append(lab + '：'.replace('：', zh() ? '：' : ': ')); s.append(a(text, href)); f.append(s); });
    return f;
  }

  /* ---------- 周边治安 ---------- */
  async function police(ctx) {
    const K = k(), b = ctx.body;
    if (ctx.home.demo) { b.append(el('div', 'lp-empty', K.demoHome)); return; }
    const key = 'police:' + ctx.home.id, had = mem.get(key);
    if (had) renderPolice(ctx, applyDemo({ ...had, refreshPending: true }));
    else b.append(loadingBox());
    if (demoMode && sdState === 'loading') { b.replaceChildren(el('p', 'lp-demo', '⚠️ ' + K.sdNote), loadingBox()); return; }
    let r;
    try { r = await load('police', ctx.home, {}, ctx.signal); } catch (e) { return; }   // 已取消（换了公寓）
    if (!ctx.live()) return;   // A1：迟到的响应不覆盖当前公寓
    if (r.status === 'ok' || r.status === 'stale') mem.set(key, r);
    else if (r.status === 'failed' && had) { renderPolice(ctx, applyDemo({ ...had }), fmt(K.failedOld, { t: when(had.fetchedAt) })); return; }
    renderPolice(ctx, applyDemo(r));
  }
  function renderPolice(ctx, r, note) {
    const K = k(), b = ctx.body; b.replaceChildren();
    if (r.status === 'loading') { b.append(loadingBox()); return; }
    if (r.status === 'unavailable' || r.status === 'failed') { b.append(errorBox(r, () => draw())); return; }
    if (note) b.append(el('p', 'lp-state warn', note));
    stateBanner(r, b);
    const meta = el('dl', 'lp-meta');
    [[K.pMonth, monthName(r.month)], [K.pRadius, K.pRadiusV], [K.pCenter, r.centerBasis === 'street-area' || /houses/.test(ctx.home.id) ? K.pCenterS : K.pCenterB]].forEach(([dt, dd]) => meta.append(el('dt', '', dt), el('dd', '', dd)));
    const top = el('section', 'lp-card lp-ptop');
    const big = el('div', 'lp-big'); big.append(el('strong', '', String(r.total)), el('span', '', K.pTotal), el('small', '', K.pTotalSub));
    top.append(big, areaSvg(K.pArea));
    b.append(meta, top);
    if (!r.total) { b.append(el('p', 'lp-state', K.pZero)); }
    else {
      const cats = r.categories || [], list = el('section', 'lp-card');
      list.append(el('b', 'lp-h', K.pTop));
      const rows = el('div', 'lp-bars'); list.append(rows);
      const drawRows = all => { rows.replaceChildren(); (all ? cats : cats.slice(0, 3)).forEach(c => { const row = el('div', 'lp-bar'), tr = el('i'), f = el('b'); f.style.width = (c.share * 100).toFixed(1) + '%'; tr.append(f); row.append(el('span', '', zh() ? c.nameZh || c.name : c.name), tr, el('em', '', `${c.count} · ${(c.share * 100).toFixed(1)}%`)); rows.append(row); }); };
      drawRows(false);
      if (cats.length > 3) { let all = false; const t = btn('bt-link', fmt(K.pAll, { n: cats.length })); t.addEventListener('click', () => { all = !all; drawRows(all); t.textContent = all ? K.pLess : fmt(K.pAll, { n: cats.length }); }); list.append(t); }
      b.append(list);
    }
    const notes = el('ul', 'lp-notes'); K.pNotes.forEach(n => notes.append(el('li', '', n))); b.append(notes);
    const miss = el('p', 'lp-miss'); miss.append(K.pMissing + ' '); miss.append(a(K.pMissingLink, r.missingDataUrl || 'https://data.police.uk/changelog/')); b.append(miss);
    b.append(footer(r, [[K.source, 'data.police.uk', r.sourceUrl || 'https://data.police.uk/'], [K.licence, (r.licence && r.licence.name) || 'Open Government Licence v3.0', (r.licence && r.licence.url) || 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/']]));
  }
  /* 范围示意：一个圆圈 + 中心点，没有任何案件点位 */
  function areaSvg(label) {
    const wrap = el('figure', 'lp-area'), NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 120 120'); svg.setAttribute('aria-hidden', 'true');
    const m = (t, at) => { const n = document.createElementNS(NS, t); Object.entries(at).forEach(([x, y]) => n.setAttribute(x, y)); svg.append(n); };
    m('circle', { cx: 60, cy: 60, r: 52, fill: 'rgba(181,70,47,.10)', stroke: '#b5462f', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
    m('circle', { cx: 60, cy: 60, r: 6, fill: '#2c5c8a', stroke: '#fffaf0', 'stroke-width': 2 });
    m('text', { x: 60, y: 20, 'text-anchor': 'middle', 'font-size': 9, fill: '#7a6650' }); svg.lastChild.textContent = '1 mi';
    wrap.append(svg, el('figcaption', '', label)); return wrap;
  }

  /* ---------- 周边餐饮 ---------- */
  async function food(ctx, st) {
    const K = k(), b = ctx.body;
    if (ctx.home.demo) { b.append(el('div', 'lp-empty', K.demoHome)); return; }
    b.replaceChildren();
    const ctrl = el('div', 'lp-fctrl'), seg = el('div', 'br-chips'), search = el('input'), list = el('div', 'lp-flist');
    search.type = 'search'; search.placeholder = K.fSearch; search.value = st.q; search.setAttribute('aria-label', K.fSearch);
    ctrl.append(seg, search); b.append(ctrl, list);
    let t = null; search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { st.q = search.value; st.page = 1; fetchList(); }, 300); });
    const drawSeg = r => {
      seg.replaceChildren();
      [['all', K.fAll, r && r.totalAll], ['chinese', K.fChinese, r && r.totalChinese]].forEach(([v, lab, n]) => { const x = btn('bt-chipbtn' + (st.cuisine === v ? ' on' : ''), lab + (n != null ? ` ${n}` : '')); x.setAttribute('aria-pressed', String(st.cuisine === v)); x.addEventListener('click', () => { st.cuisine = v; st.page = 1; fetchList(); }); seg.append(x); });
    };
    drawSeg(null);
    async function fetchList() {
      if (ctl) ctl.abort(); ctl = new AbortController(); const id = ++reqSeq, signal = ctl.signal;
      const key = `food:${ctx.home.id}:${st.cuisine}:${st.q}:${st.page}`, had = mem.get(key);
      if (had) renderFood(applyDemo({ ...had, refreshPending: true })); else { list.replaceChildren(loadingBox()); }
      if (demoMode && sdState === 'loading') { list.replaceChildren(el('p', 'lp-demo', '⚠️ ' + K.sdNote), loadingBox()); return; }
      let r; try { r = await load('food', ctx.home, { cuisine: st.cuisine, q: st.q, page: st.page }, signal); } catch (e) { return; }
      if (id !== reqSeq || !root || root.hidden) return;   // A1
      if (r.status === 'ok' || r.status === 'stale' || r.status === 'partial') mem.set(key, r);
      else if (r.status === 'failed' && had) { renderFood(applyDemo({ ...had }), fmt(K.failedOld, { t: when(had.fetchedAt) })); return; }
      renderFood(applyDemo(r));
    }
    function renderFood(r, note) {
      list.replaceChildren(); drawSeg(r.status === 'ok' || r.status === 'stale' || r.status === 'partial' ? r : null);
      if (r.status === 'loading') { list.append(loadingBox()); return; }
      if (r.status === 'unavailable' || r.status === 'failed') { list.append(errorBox(r, fetchList)); return; }
      if (note) list.append(el('p', 'lp-state warn', note));
      stateBanner(r, list);
      if (st.cuisine === 'chinese') list.append(el('p', 'lp-state', (r.chineseDirectorySize || r.totalChinese) ? fmt(K.fChineseNote, { n: r.totalChinese || 0 }) : K.fChineseEmpty));
      list.append(el('p', 'lp-count', fmt(K.fCount, { n: r.total ?? 0 })));
      if (!r.items || !r.items.length) list.append(el('p', 'lp-empty', K.fNone));
      (r.items || []).forEach(it => list.append(foodCard(it)));
      if ((r.pages || 1) > 1) {
        const pg = el('div', 'lp-pager'), prev = btn('bt-btn alt', K.fPrev), next = btn('bt-btn alt', K.fNext);
        prev.disabled = r.page <= 1; next.disabled = r.page >= r.pages;
        prev.addEventListener('click', () => { st.page = r.page - 1; fetchList(); body().scrollTop = 0; });
        next.addEventListener('click', () => { st.page = r.page + 1; fetchList(); body().scrollTop = 0; });
        pg.append(prev, el('span', '', fmt(K.fPage, { p: r.page, n: r.pages })), next); list.append(pg);
      }
      const notes = el('ul', 'lp-notes'); K.fNotes.forEach(n => notes.append(el('li', '', n))); list.append(notes);
      list.append(footer(r, [[K.source, zh() ? '英国食品标准局 FSA 食品卫生评级' : 'Food Standards Agency food hygiene ratings', r.sourceUrl || 'https://ratings.food.gov.uk/'], [K.licence, (r.licence && r.licence.name) || 'Open Government Licence v3.0', 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/']]));
    }
    function foodCard(it) {
      const c = el('article', 'lp-food'), left = el('div', 'lp-fl'), badge = el('div', 'lp-fsa');
      const rated = it.ratingStatus === 'rated' && it.ratingValue != null;
      badge.classList.add(rated ? 'r' + it.ratingValue : 'na');
      badge.append(el('small', '', K.fRating), el('strong', '', rated ? String(it.ratingValue) : '—'));
      if (!rated) badge.append(el('em', '', K.fStatus[it.ratingStatus] || K.fStatus.other));
      const name = el('b', '', it.name); if (it.cuisine === 'chinese') name.append(el('span', 'lp-cn', K.fChinese));
      left.append(name, el('small', '', [it.address, it.postcode].filter(Boolean).join(' · ')));
      const meta = [it.distanceMeters != null ? fmt(K.fDist, { d: it.distanceMeters < 1000 ? it.distanceMeters + (zh() ? ' 米' : ' m') : (it.distanceMeters / 1000).toFixed(2) + (zh() ? ' 公里' : ' km') }) : '', it.ratingDate ? fmt(K.fDate, { d: it.ratingDate }) : ''].filter(Boolean).join(' · ');
      left.append(el('small', 'lp-fmeta', meta));
      const src = a('FSA ↗', it.sourceUrl || 'https://ratings.food.gov.uk/'); src.className = 'lp-fsrc';
      left.append(src);
      c.append(badge, left); return c;
    }
    fetchList();
  }

  /* ---------- 入口：公寓详情里一块「周边与评价」+ 收起卡片上一个小按钮 ---------- */
  const cardBody = document.getElementById('cardBody');
  function decorate() {
    const h = BT.homeNow(); if (!h || !cardBody) return;
    if (root && !root.hidden && cur && cur.id !== h.id && !(cur.demo && demoFrom === h.id)) bind(h);
    if (root && !root.hidden) { moved = null; dodge(); }   // 地图上换了公寓：面板跟着换（A1）
    const details = cardBody.querySelector('#propertyDetails');
    if (details && !details.querySelector('.lp-entry')) {
      const K = k(), sec = el('section', 'lp-entry'); sec.append(el('h4', '', K.entryH));
      const row = el('div', 'lp-erow');
      Object.keys(K.tabs).forEach(id => { const b2 = btn('bt-tool'); b2.append(el('b', '', K.tabs[id]), el('span', '', K.entryDesc[id])); b2.addEventListener('click', e => { e.stopPropagation(); open(h, id); }); row.append(b2); });
      sec.append(row);
      const after = details.querySelector('.rp') || details.querySelector('.txt');
      details.insertBefore(sec, after ? after.nextSibling : details.firstChild);
    }
  }
  if (cardBody) new MutationObserver(decorate).observe(cardBody, { childList: true, subtree: false });
  BT.add({ id: 'local', order: 0, details: false, card: () => ({ title: k().entryH, desc: '', mini: k().mini, cls: 'bt-chipbtn' }), open: h => open(h, tab) });
  addEventListener('keydown', e => { if (e.key === 'Escape' && root && !root.hidden && !document.querySelector('.bt-wrap:not([hidden])')) close(); });

  window.LocalPanel = { open, close, register: (id, fn) => { panels[id] = fn; }, current: () => cur, redraw: () => draw(), isDemo: () => demoMode, postcodeOf, when };
})();
