/* 周边与评价面板：点开公寓后，详情里的「安全与支持 / 周边配套 / 周边餐饮 / 住户评价 / 团队探访与资料解读」都在这里打开。
   - 安全与支持：首屏是社区警务团队（成员、联系方式、警队公布的工作重点和社区活动）和求助渠道；警方原始记录收起来，点开才读，只写条数不画占比。
   - 周边配套：OpenStreetMap 里直线 800 米内的超市、药店、诊所、公交站、火车站、健身房、公园、图书馆、银行、邮局。
   - 面板绑定当前公寓（名称 + 参考邮编），不用输入邮编；地图上换一栋公寓，面板跟着换；切换时丢弃上一栋迟到的响应（A1）。
   - 电脑上是右侧侧栏，手机上是全屏面板；关闭不动地图视角、语言、收藏和选房状态（A2）。
   - 数据按需读取：打开某一页时才请求，同一栋楼读过就先显示，后台更新时保留已有结果。
   - 状态：读取中 / 后台更新 / 真实零结果 / 失败（不变成 0，可重试）/ 旧数据（带日期）/ 部分结果 / 未接通（不显示数字）。
     链接加 ?demo=1 时面板底部有「状态演示」，可以逐个查看这些状态（A5），演示状态会醒目标注。
   - 数据来源：和 consult-server 一起部署时读 /api/local/*（服务器代取 data.police.uk、FSA 和 OpenStreetMap，并缓存）；没有服务器时读
     local-snapshots/<police|food|neighbourhood|amenities>/<公寓编号>.json 里带读取时间的真实快照；都没有就显示「数据源尚未接通」，不填任何数字。
   住户评价、团队探访与资料解读由 resident-reviews.js 注册（LocalPanel.register）。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, pick } = BT;
  const T = {
    zh: {
      entryH: '周边与评价', mini: '📍 周边与评价', eyebrow: '周边与评价', back: '← 返回地图', close: '关闭',
      pc: '参考邮编 {p}', pcArea: '参考邮编 {p}（街区参考）',
      tabs: { safety: '安全与支持', area: '周边配套', food: '周边餐饮', reviews: '住户评价', team: '团队探访与资料解读' },
      entryDesc: { safety: '社区警务团队 · 求助渠道', area: '超市 · 药店 · 公交 · 公园', food: '食品卫生评级 · 中餐', reviews: '本站和 Google 地图评价', team: '实地探访 · 有来源的解读' },
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
      // 安全与支持
      sH: '社区警务团队', sMembers: '团队成员', sTeamNone: '这个社区暂时没有公布团队成员。', sContact: '联系：{c}', sForce: '查看这个社区的警队页面 ↗',
      sPri: '当前工作重点（警队公布）', sPriNone: '这个社区目前没有公布工作重点。', sAction: '警队措施：', sEvents: '社区活动', sEventsNone: '近期没有公布社区活动。',
      sHelpH: '需要帮助时', sHelp: [['紧急情况', '拨打 999'], ['非紧急报警或咨询', '拨打 101，或在警队网站上报']],
      sLsh: '利物浦学生住房（Liverpool Student Homes）由利物浦大学、LJMU、Hope 和 LIPA 共同运营，提供免费合同检查，以及押金、维修和房东纠纷方面的建议；房源没在 LSH 登记也可以求助。', sLshLink: '了解 Liverpool Student Homes ↗',
      sAsk: '入住前可以向公寓确认', sAskList: ['前台或管理员在岗时间', '门禁和访客登记方式', '报修渠道和一般多久上门'],
      recH: '警方公开记录（原始数据）', recIntro: '警方按月公开的犯罪及反社会行为登记记录，点开才读取。', recOpen: '查看警方公开记录', recClose: '收起',
      recTotal: '{m}，公寓参考点周围 1 英里（约 1.6 公里）内共登记 {n} 条记录。', recCats: '按类别（条数）',
      recNotes: ['位置已匿名化，只精确到附近的参考点；记录不代表发生在公寓内，数量是事件数，不是受害人数。', '城市中心人流量大，登记记录通常比住宅区多，数字大小不能直接说明一栋楼是否安全。', '本站不用这些数字给公寓打「安全分」或排名。'],
      // 周边配套
      aH: '步行约 10 分钟范围内', aSub: '公寓参考点周围直线 800 米内', aNearest: '最近：{n} · 直线 {d}', aNone: '800 米内没有记录', aMore: '看最近 {n} 个', aLess: '收起', aUnnamed: '（没有名称）',
      aCats: { supermarket: ['🛒', '超市和便利店'], pharmacy: ['💊', '药店'], doctors: ['🩺', '诊所'], bus: ['🚌', '公交站'], rail: ['🚆', '火车站'], gym: ['🏋️', '健身房和运动中心'], park: ['🌳', '公园'], library: ['📚', '图书馆'], bank: ['🏧', '银行和取款机'], post: ['📮', '邮局'] },
      aNotes: ['数据来自 OpenStreetMap，由志愿者维护，可能有遗漏或过时，出发前请以地图为准。', '距离是到公寓参考点的直线距离，不是步行路线。'],
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
      tabs: { safety: 'Safety & support', area: 'Nearby amenities', food: 'Nearby food', reviews: 'Resident reviews', team: 'Team visits and insights' },
      entryDesc: { safety: 'Neighbourhood police team · where to get help', area: 'Shops · pharmacies · buses · parks', food: 'Food hygiene ratings · Chinese', reviews: 'Reviews here and on Google Maps', team: 'Real visits · sourced notes' },
      loading: 'Loading…', refreshing: 'Updating in the background; showing current results', retry: 'Retry', fetched: 'Retrieved: {t}', source: 'Source', licence: 'Licence',
      unavailable: 'The data source is not connected yet, so no figures are shown. Official records will appear here once it is.', failed: 'Could not load the data ({e}). Missing data is not zero.', failedOld: 'The update failed; below is data retrieved on {t}.',
      stale: 'This data was retrieved on {t} and is being updated.', partial: 'Only part of the data loaded; results are incomplete.', demoHome: 'The demo property is fictional and has no official data.',
      pMonth: 'Data month', pRadius: 'Search area', pRadiusV: '1 mile (about 1.6 km) around the property reference point', pCenter: 'Reference point', pCenterB: 'The building’s fixed reference coordinate', pCenterS: 'Street-area reference (several houses; the street area is used)',
      pTotal: 'recorded incidents', pTotalSub: 'Crime and anti-social behaviour recorded in the area that month', pTop: 'Three largest categories', pAll: 'Show all {n} categories', pLess: 'Show less',
      pZero: 'No records in this area for that month. This only means none were recorded; it does not mean there is no risk.', pArea: 'Area illustration (the circle is the search area, not incident locations)',
      pNotes: ['These are monthly police records of crime and anti-social behaviour. Locations are anonymised to nearby reference points.', 'Nearby records are not necessarily incidents inside the property, and counts are incidents, not victims.', 'These figures must not be turned into a safety score or ranking for the property.'],
      pMissing: 'Missing data: some months may have late or missing returns from a force; see the data.police.uk changelog.', pMissingLink: 'View changelog',
      pDemoShare: '{p}%',
      sH: 'Neighbourhood police team', sMembers: 'Team', sTeamNone: 'This neighbourhood has not published its team.', sContact: 'Contact: {c}', sForce: 'Open this neighbourhood on the force website ↗',
      sPri: 'Current priorities (published by the force)', sPriNone: 'No priorities published for this neighbourhood right now.', sAction: 'Police action: ', sEvents: 'Community events', sEventsNone: 'No upcoming community events published.',
      sHelpH: 'Getting help', sHelp: [['Emergency', 'Call 999'], ['Non-emergency report or advice', 'Call 101 or report on the force website']],
      sLsh: 'Liverpool Student Homes, run jointly by the University of Liverpool, LJMU, Liverpool Hope and LIPA, offers free contract checks and advice on deposits, repairs and landlord disputes, even if a home is not registered with LSH.', sLshLink: 'About Liverpool Student Homes ↗',
      sAsk: 'Questions to ask the property before moving in', sAskList: ['When reception or staff are on site', 'How door entry and visitor sign-in work', 'How to report repairs and how quickly they are usually handled'],
      recH: 'Police records (raw data)', recIntro: 'Monthly police records of crime and anti-social behaviour, loaded only when opened.', recOpen: 'View police records', recClose: 'Hide',
      recTotal: '{m}: {n} records within 1 mile (about 1.6 km) of the property reference point.', recCats: 'By category (number of records)',
      recNotes: ['Locations are anonymised to nearby reference points; records are not necessarily inside the property, and counts are incidents, not victims.', 'Busy city-centre areas usually have more records than residential streets, so the figure alone does not show whether a building is safe.', 'This site does not use these figures to score or rank properties.'],
      aH: 'Within about a 10-minute walk', aSub: 'Within 800 m in a straight line of the property reference point', aNearest: 'Nearest: {n} · {d} straight-line', aNone: 'None recorded within 800 m', aMore: 'Show nearest {n}', aLess: 'Hide', aUnnamed: '(no name)',
      aCats: { supermarket: ['🛒', 'Supermarkets and convenience shops'], pharmacy: ['💊', 'Pharmacies'], doctors: ['🩺', 'GP surgeries and clinics'], bus: ['🚌', 'Bus stops'], rail: ['🚆', 'Train stations'], gym: ['🏋️', 'Gyms and sports centres'], park: ['🌳', 'Parks'], library: ['📚', 'Libraries'], bank: ['🏧', 'Banks and cash machines'], post: ['📮', 'Post offices'] },
      aNotes: ['Data from OpenStreetMap, maintained by volunteers; it may be incomplete or out of date, so check a map before you go.', 'Distances are straight-line from the property reference point, not walking routes.'],
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
  let root = null, cur = null, tab = 'safety', reqSeq = 0, ctl = null, sdState = 'real', demoFrom = null;
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
    if (tab === 'safety') safety(ctx); else if (tab === 'area') area(ctx); else if (tab === 'food') food(ctx, { cuisine: 'all', q: '', page: 1 });
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
    if (sdState === 'zero') return { ...base, status: 'ok', total: 0, categories: [], team: [], priorities: [], events: [], items: [], totalAll: 0, totalChinese: 0, pages: 1, page: 1, fetchedAt: r.fetchedAt || new Date().toISOString(), month: r.month || '2026-08' };
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

  const distTxt = m => m < 1000 ? m + (zh() ? ' 米' : ' m') : (m / 1000).toFixed(2) + (zh() ? ' 公里' : ' km');
  const OGL_URL = 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/';
  /* 一块数据：先显示读过的结果，再读新的；迟到的响应不覆盖（A1）；失败不变成 0 */
  async function section(ctx, kind, box, render) {
    const K = k(), key = kind + ':' + ctx.home.id, had = mem.get(key);
    const paint = (r, note) => {
      box.replaceChildren();
      if (r.status === 'loading') { box.append(loadingBox()); return; }
      if (r.status === 'unavailable' || r.status === 'failed') { box.append(errorBox(r, () => section(ctx, kind, box, render))); return; }
      if (note) box.append(el('p', 'lp-state warn', note));
      stateBanner(r, box); render(r, box);
    };
    if (had) paint(applyDemo({ ...had, refreshPending: true })); else box.replaceChildren(loadingBox());
    if (demoMode && sdState === 'loading') { box.replaceChildren(el('p', 'lp-demo', '⚠️ ' + K.sdNote), loadingBox()); return; }
    let r;
    try { r = await load(kind, ctx.home, {}, ctx.signal); } catch (e) { return; }   // 已取消（换了公寓）
    if (!ctx.live()) return;
    if (r.status === 'ok' || r.status === 'stale' || r.status === 'partial') mem.set(key, r);
    else if (r.status === 'failed' && had) { paint(applyDemo({ ...had }), fmt(K.failedOld, { t: when(had.fetchedAt) })); return; }
    paint(applyDemo(r));
  }

  /* ---------- 安全与支持：社区警务团队 + 求助渠道；警方原始记录收起来，点开才读 ---------- */
  function safety(ctx) {
    const K = k(), b = ctx.body;
    if (ctx.home.demo) { b.append(el('div', 'lp-empty', K.demoHome), helpCard()); return; }
    const team = el('div', 'lp-sec'); b.append(team); section(ctx, 'neighbourhood', team, renderTeam);
    b.append(helpCard());
    const rec = el('section', 'lp-card'), box = el('div', 'lp-sec'), t = btn('bt-btn alt', K.recOpen);
    rec.append(el('b', 'lp-h', K.recH), el('p', 'bt-note', K.recIntro), t, box); box.hidden = true;
    t.addEventListener('click', () => { box.hidden = !box.hidden; t.textContent = box.hidden ? K.recOpen : K.recClose; if (!box.hidden && !box.childNodes.length) section(ctx, 'police', box, renderRecords); });
    b.append(rec);
  }
  function renderTeam(r, box) {
    const K = k(), c = el('section', 'lp-card');
    c.append(el('b', 'lp-h', K.sH), el('strong', 'lp-nb', r.name || '—'), el('span', 'bt-note', r.forceName || ''));
    if (r.team && r.team.length) { const ul = el('ul', 'lp-plain'); r.team.forEach(p => ul.append(el('li', '', [p.rank, p.name].filter(Boolean).join(' · ')))); c.append(el('small', 'lp-sub', K.sMembers), ul); }
    else c.append(el('p', 'bt-note', K.sTeamNone));
    const ct = [r.contact && r.contact.telephone, r.contact && r.contact.email].filter(Boolean).join(' · ');
    if (ct) c.append(el('p', 'bt-note', fmt(K.sContact, { c: ct })));
    if (r.url) c.append(a(K.sForce, r.url));
    const pri = el('section', 'lp-card'); pri.append(el('b', 'lp-h', K.sPri));
    if (!r.priorities || !r.priorities.length) pri.append(el('p', 'bt-note', K.sPriNone));
    (r.priorities || []).forEach(x => {
      const it = el('div', 'lp-pri'); it.append(el('p', 'lp-pri-i', clip(x.issue)));
      if (x.action) { const ac = el('p', 'bt-note'); ac.append(el('b', '', K.sAction), clip(x.action)); it.append(ac); }
      if (x.actionDate || x.issueDate) it.append(el('small', 'bt-note', x.actionDate || x.issueDate));
      pri.append(it);
    });
    const ev = el('section', 'lp-card'); ev.append(el('b', 'lp-h', K.sEvents));
    if (!r.events || !r.events.length) ev.append(el('p', 'bt-note', K.sEventsNone));
    (r.events || []).forEach(x => ev.append(el('p', 'lp-ev', [x.title, x.start ? when(x.start) : '', x.address].filter(Boolean).join(' · '))));
    box.append(c, pri, ev, footer(r, [[K.source, 'data.police.uk', r.sourceUrl || 'https://data.police.uk/'], [K.licence, 'Open Government Licence v3.0', OGL_URL]]));
  }
  const clip = t => { t = String(t || ''); return t.length > 320 ? t.slice(0, 317) + '…' : t; };
  function helpCard() {
    const K = k(), c = el('section', 'lp-card lp-help');
    c.append(el('b', 'lp-h', K.sHelpH));
    const dl = el('dl', 'lp-meta'); K.sHelp.forEach(([dt, dd]) => dl.append(el('dt', '', dt), el('dd', '', dd))); c.append(dl);
    c.append(el('p', 'bt-note', K.sLsh), a(K.sLshLink, 'https://www.liverpool.ac.uk/accommodation/find-accommodation/liverpool-student-homes/'));
    const ul = el('ul', 'lp-notes'); K.sAskList.forEach(x => ul.append(el('li', '', x)));
    c.append(el('small', 'lp-sub', K.sAsk), ul);
    return c;
  }
  /* 警方原始记录：只写月份、范围、总数和各类条数，不画占比 */
  function renderRecords(r, box) {
    const K = k();
    box.append(el('p', '', fmt(K.recTotal, { m: monthName(r.month), n: r.total })));
    if (!r.total) box.append(el('p', 'lp-state', K.pZero));
    else {
      const dl = el('dl', 'lp-meta lp-cats'); (r.categories || []).forEach(c => dl.append(el('dt', '', zh() ? c.nameZh || c.name : c.name), el('dd', '', String(c.count))));
      box.append(el('small', 'lp-sub', K.recCats), dl);
    }
    const notes = el('ul', 'lp-notes'); K.recNotes.forEach(n => notes.append(el('li', '', n))); box.append(notes);
    const miss = el('p', 'lp-miss'); miss.append(K.pMissing + ' '); miss.append(a(K.pMissingLink, r.missingDataUrl || 'https://data.police.uk/changelog/')); box.append(miss);
    box.append(footer(r, [[K.source, 'data.police.uk', r.sourceUrl || 'https://data.police.uk/'], [K.licence, (r.licence && r.licence.name) || 'Open Government Licence v3.0', (r.licence && r.licence.url) || OGL_URL]]));
  }

  /* ---------- 周边配套（OpenStreetMap）---------- */
  function area(ctx) {
    const K = k(), b = ctx.body;
    if (ctx.home.demo) { b.append(el('div', 'lp-empty', K.demoHome)); return; }
    const box = el('div', 'lp-sec'); b.append(box); section(ctx, 'amenities', box, renderArea);
  }
  function renderArea(r, box) {
    const K = k(), by = new Map((r.categories || []).map(c => [c.id, c]));
    box.append(el('b', 'lp-h', K.aH), el('span', 'bt-note', K.aSub));
    const grid = el('div', 'lp-am');
    Object.entries(K.aCats).forEach(([id, [icon, label]]) => {
      const c = by.get(id) || { count: 0, nearest: [] }, card = el('article', 'lp-amc' + (c.count ? '' : ' none'));
      const head = el('div', 'lp-amh'); head.append(el('span', 'lp-ami', icon), el('b', '', label), el('strong', '', String(c.count)));
      card.append(head);
      const n0 = c.nearest && c.nearest[0];
      card.append(el('small', 'bt-note', n0 ? fmt(K.aNearest, { n: n0.name || K.aUnnamed, d: distTxt(n0.distanceMeters) }) : K.aNone));
      if (c.nearest && c.nearest.length > 1) {
        const ul = el('ul', 'lp-plain'); ul.hidden = true;
        c.nearest.forEach(x => { const li = el('li'); li.append(a((x.name || K.aUnnamed) + ' ↗', x.osmUrl), ' · ' + distTxt(x.distanceMeters)); ul.append(li); });
        const t = btn('bt-link', fmt(K.aMore, { n: c.nearest.length })); t.addEventListener('click', () => { ul.hidden = !ul.hidden; t.textContent = ul.hidden ? fmt(K.aMore, { n: c.nearest.length }) : K.aLess; });
        card.append(t, ul);
      }
      grid.append(card);
    });
    box.append(grid);
    const notes = el('ul', 'lp-notes'); K.aNotes.forEach(n => notes.append(el('li', '', n))); box.append(notes);
    box.append(footer(r, [[K.source, 'OpenStreetMap', r.sourceUrl || 'https://www.openstreetmap.org/'], [K.licence, (r.licence && r.licence.name) || 'ODbL · © OpenStreetMap contributors', (r.licence && r.licence.url) || 'https://www.openstreetmap.org/copyright']]));
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
