/* 学生端（手机 App 原型）：地图与列表、两个测试、结果卡、公寓详情（房型与相册）、对比、收藏、对话与建群。 */
(function (root) {
  'use strict';
  const { HM, LQ, compare: CMP } = root.Core;
  const D = root.DemoData, U = root.UI, Store = root.Store;
  const { esc, fmt } = U;

  let el, route = { name: 'map' }, stack = [], map = null, selected = '', onlyTop = false;
  const filters = { q: '', budget: 0, room: 'any', walk: 0, fav: false };
  let quiz = null, album = null, sheet = null, draft = '';

  const st = () => Store.s.student;
  const lang = () => st().lang;
  const t = () => U.T(lang());
  const homeById = id => HM.byId(id);
  const area = h => lang() === 'en' ? h.area : h.areaZh;
  const roomName = r => lang() === 'en' ? r.name : r.zh;
  const colon = () => lang() === 'en' ? ': ' : '：';

  /* ---------- 路由 ---------- */
  function go(name, params, opts) {
    opts = opts || {};
    if (!opts.replace && !opts.tab) stack.push(route);
    if (opts.tab) stack = [];
    route = Object.assign({ name }, params || {});
    album = null; sheet = null;
    render();
    const sc = el.querySelector('.screen'); if (sc) sc.scrollTop = 0;
  }
  function back() { route = stack.pop() || { name: 'map' }; album = null; sheet = null; render(); }
  const TAB_OF = { map: 'map', home: 'map', compare: 'saved', quizzes: 'quiz', quiz: 'quiz', result: 'quiz', saved: 'saved', chat: 'chat' };

  /* ---------- 外框 ---------- */
  function shell(inner, title) {
    const T = t(), me = Store.me(), unread = route.name === 'chat' ? 0 : (me.studentUnread || 0);
    const tab = TAB_OF[route.name];
    const R = D.REGIONS;
    const top = ['map', 'quizzes', 'saved', 'chat'].includes(route.name);
    return `
      <header class="appbar">
        ${top ? `<span class="logo" aria-hidden="true">${logo()}</span><b class="apptitle">${esc(title || T.appName)}</b>`
              : `<button class="iconbtn" data-act="back" aria-label="${esc(T.back)}">‹</button><b class="apptitle">${esc(title || T.appName)}</b>`}
        <label class="sr" for="regionSel">${esc(T.region)}</label>
        <select id="regionSel" class="regsel" data-act="region" aria-label="${esc(T.region)}">
          ${Object.keys(R).map(k => `<option value="${k}" ${st().region === k ? 'selected' : ''}>${R[k].flag} ${esc(U.L(R[k], lang()))}</option>`).join('')}
        </select>
        <button class="langbtn" data-act="lang">${esc(T.lang)}</button>
      </header>
      <main class="screen ${route.name === 'map' ? 'noscroll' : ''}">${inner}</main>
      <nav class="tabbar" aria-label="Main">
        ${[['map', '🗺️', T.tabMap], ['quiz', '🎭', T.tabQuiz], ['saved', '♡', T.tabSaved], ['chat', '💬', T.tabChat]].map(([k, ico, label]) =>
          `<button class="${tab === k ? 'on' : ''}" data-tab="${k}" ${tab === k ? 'aria-current="page"' : ''}><span class="ti" aria-hidden="true">${ico}</span>${esc(label)}${k === 'chat' && unread ? `<span class="badge-dot">${unread}</span>` : ''}</button>`).join('')}
      </nav>
      ${album ? albumHtml() : ''}${sheet ? sheetHtml() : ''}`;
  }
  function logo() { return '<svg width="26" height="26" viewBox="12 12 96 96"><defs><clipPath id="lgc"><circle cx="46" cy="60" r="30"/></clipPath></defs><circle cx="46" cy="60" r="30" fill="#b5462f"/><circle cx="74" cy="60" r="30" fill="#f2c14e"/><circle cx="74" cy="60" r="30" fill="#3b2a1a" clip-path="url(#lgc)"/></svg>'; }

  /* ---------- 首页：地图 + 列表 ---------- */
  function filterObj() { return { query: filters.q, budget: filters.budget, room: filters.room, destination: 'uol', walk: filters.walk, favoritesOnly: filters.fav }; }
  function visibleHomes() {
    const fav = new Set(st().favorites), last = st().lastResult, topIds = last ? last.ids : [];
    let list = HM.HOMES.filter(h => HM.matchesHome(h, filterObj(), fav));
    if (onlyTop && topIds.length) list = list.filter(h => topIds.includes(h.id));
    return { list, topIds };
  }
  function mapScreen() {
    const T = t(), last = st().lastResult, topIds = last ? last.ids : [];
    const BUD = [0, 150, 180, 200, 250, 300], ROOMS = ['any', 'ensuite', 'studio'], WALKS = [0, 10, 15, 20, 30];
    return `
      <div class="mapwrap"><div class="mapbox" id="mapbox"></div><div id="peek"></div></div>
      <div class="sheetlist" id="sheetlist">
        <span class="grab" aria-hidden="true"></span>
        ${topIds.length ? `<div class="card topcard"><div class="row between"><b class="h3">${esc(T.yourTop3)}</b>
            <button class="chip ${onlyTop ? 'on' : ''}" data-act="onlytop">${esc(onlyTop ? T.allHomes : T.topOnly)}</button></div>
            <p class="muted">${esc(last.lifeCharacter || last.persona || '')}</p>
            <div class="row wrap">${HM.byIds(topIds).map((h, i) => `<button class="chip on" data-home="${h.id}">★${i + 1} · ${h.n} ${esc(h.name)}</button>`).join('')}</div>
            <button class="btn small main" data-act="result">${esc(T.viewResult)}</button></div>` : ''}
        <div class="quizrow">
          <button class="card quizcard" data-quiz="life"><b class="h3">🎭 ${esc(T.lifeQuiz)}</b><span class="muted">${esc(T.lifeQuizSub)}</span></button>
          <button class="card quizcard" data-quiz="home"><b class="h3">🏠 ${esc(T.homeQuiz)}</b><span class="muted">${esc(T.homeQuizSub)}</span></button>
        </div>
        <div class="filters">
          <label class="sr" for="searchIn">${esc(T.search)}</label>
          <input id="searchIn" class="search" type="search" placeholder="${esc(T.search)}" value="${esc(filters.q)}">
          <div class="row wrap">
            ${sel('budget', T.budget, BUD.map(v => [v, v ? '£' + v : T.any]), filters.budget)}
            ${sel('room', T.room, ROOMS.map(r => [r, T[r]]), filters.room)}
            ${sel('walk', T.walk, WALKS.map(v => [v, v ? fmt(T.minutes, { n: v }) : T.any]), filters.walk)}
            <button class="chip ${filters.fav ? 'on' : ''}" data-act="favonly">♥ ${esc(T.favOnly)}</button>
          </div>
          <div class="row between"><span class="muted" id="countTxt"></span><button class="linkbtn" data-act="reset">${esc(T.reset)}</button></div>
        </div>
        <div id="homelist" class="homelist"></div>
        <p class="fine">${esc(T.priceNote)}</p>
      </div>`;
  }
  function sel(key, label, opts, val) {
    return `<label class="chipsel ${val && val !== 'any' ? 'on' : ''}"><span>${esc(label)}</span>
      <select id="f-${key}" data-filter="${key}">${opts.map(([v, l]) => `<option value="${v}" ${String(v) === String(val) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
  }
  function homeCard(h, rank) {
    const T = t(), fav = st().favorites.includes(h.id), cover = D.coverPhoto(h), rooms = D.roomsFor(h);
    return `<div class="card homecard ${h.id === selected ? 'sel' : ''}" id="hc-${h.id}">
      <button class="hc-main" data-home="${h.id}">
        ${cover ? `<img class="hc-img" src="${cover}" alt="" loading="lazy">` : `<span class="hc-num ${rank ? 'top' : ''}">${h.n}</span>`}
        <span class="hc-body">
          <b class="hc-name">${cover ? `<span class="pinno ${rank ? 'top' : ''}">${h.n}</span>` : ''}${esc(h.name)}${rank ? ` <span class="badge">★${rank}</span>` : ''}</b>
          <span class="muted">${esc(area(h))} · ${esc(fmt(T.walkUol, { n: h.uol }))}</span>
          <span class="hc-price">${esc(U.fromPrice(h, lang()))}${h.pso ? ` <span class="badge">${esc(T.soldOut)}</span>` : ''}</span>
          <span class="fine">${rooms.pending ? esc(T.photosPending) : esc(fmt(T.photos, { n: rooms.types.reduce((s, r) => s + r.photos.length, 0) + rooms.building.length }))} · ${rooms.types.length} ${esc(T.roomTypes)}</span>
        </span>
      </button>
      <button class="fav" data-fav="${h.id}" aria-pressed="${fav}" aria-label="${esc(T.fav)}">${fav ? '♥' : '♡'}</button>
    </div>`;
  }
  function renderList() {
    const T = t(), { list, topIds } = visibleHomes();
    const ordered = list.slice().sort((a, b) => {
      const ra = topIds.indexOf(a.id), rb = topIds.indexOf(b.id);
      if ((ra >= 0) !== (rb >= 0)) return ra >= 0 ? -1 : 1;
      if (ra >= 0) return ra - rb;
      return (b.id === 'iq-great-newton-house') - (a.id === 'iq-great-newton-house') || a.uol - b.uol || a.n - b.n;
    });
    const box = el.querySelector('#homelist'); if (!box) return;
    box.innerHTML = ordered.length ? ordered.map(h => homeCard(h, topIds.indexOf(h.id) + 1)).join('') : `<div class="card muted">${esc(T.empty)}</div>`;
    el.querySelector('#countTxt').textContent = fmt(T.count, { n: list.length });
    if (map) map.render({ homes: list, topIds, selected, lang: lang() });
    renderPeek();
  }
  function renderPeek() {
    const box = el.querySelector('#peek'); if (!box) return;
    const h = selected && homeById(selected);
    if (!h) { box.innerHTML = ''; return; }
    const T = t(), cover = D.coverPhoto(h);
    box.innerHTML = `<div class="peekcard">
      ${cover ? `<figure class="polaroid mini"><img src="${cover}" alt=""></figure>` : `<span class="hc-num">${h.n}</span>`}
      <div class="grow"><b>${h.n} · ${esc(h.name)}</b><div class="muted">${esc(U.fromPrice(h, lang()))} · ${esc(fmt(T.walkUol, { n: h.uol }))}</div></div>
      <button class="btn small main" data-home="${h.id}">${esc(T.seeHome)}</button>
      <button class="iconbtn x" data-act="unpeek" aria-label="Close">×</button></div>`;
  }
  function mountMap() {
    const box = el.querySelector('#mapbox'); if (!box) { map = null; return; }
    const { list, topIds } = visibleHomes();
    map = root.MapView.mount(box, { homes: list, topIds, selected, lang: lang(),
      onPick: id => { selected = id; renderList(); const c = el.querySelector('#hc-' + id); if (c) c.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } });
    if (route.focusTop && topIds.length) { map.focus(topIds); route.focusTop = false; }
    renderList();
  }

  /* ---------- 测试 ---------- */
  function quizzesScreen() {
    const T = t(), last = st().lastResult;
    return `<div class="pad stack">
      <div><h1 class="h1">${esc(T.quizzes)}</h1><p class="muted">${esc(T.quizzesLead)}</p></div>
      <button class="card quizbig" data-quiz="life"><span class="tape"></span><span class="eyebrow">Liverpool Life Quiz</span><b class="h2">🎭 ${esc(T.lifeQuiz)}</b><span>${esc(T.lifeIntro)}</span><span class="btn small main">${esc(T.start)} ↗</span></button>
      <button class="card quizbig" data-quiz="home"><span class="tape"></span><span class="eyebrow">Liverpool Home Match</span><b class="h2">🏠 ${esc(T.homeQuiz)}</b><span>${esc(T.homeIntro)}</span><span class="btn small main">${esc(T.start)} ↗</span></button>
      ${last ? `<button class="btn" data-act="result">${esc(T.viewResult)} · ${esc(last.lifeCharacter || last.persona || '')}</button>` : ''}
    </div>`;
  }
  function startQuiz(kind) {
    const T = t(), lg = lang();
    let questions;
    if (kind === 'home') questions = HM.questions(lg).map(q => Object.assign({ kind: 'home' }, q));
    else {
      const life = LQ.questions(lg), home = HM.questions(lg), campus = home.find(q => q.id === 'campus'), walk = home.find(q => q.id === 'walk');
      questions = life.map(q => ({ kind: 'life', id: q.id, q: q.q, hint: '', opts: q.opts.map((o, i) => Object.assign({}, o, { id: String(i) })) }))
        .concat([{ kind: 'extra', id: 'campus', q: T.extraCampus, hint: campus.hint, opts: campus.opts }, { kind: 'extra', id: 'walk', q: T.extraWalk, hint: walk.hint, opts: walk.opts }]);
    }
    quiz = { kind, step: 0, questions, home: HM.cleanAnswers(st().homeAnswers || {}), life: (st().lifeAnswers || []).slice(0, 6), extra: Object.assign({}, st().lifeExtra || {}) };
  }
  function qValue(i) {
    const q = quiz.questions[i];
    if (q.kind === 'home') return quiz.home[q.id];
    if (q.kind === 'life') return quiz.life[i] != null ? String(quiz.life[i]) : '';
    return quiz.extra[q.id] || '';
  }
  function quizScreen() {
    const T = t(), q = quiz.questions[quiz.step], v = qValue(quiz.step), n = quiz.questions.length;
    const selSet = new Set(q.multi ? (v || []) : (v ? [v] : []));
    const isLast = quiz.step === n - 1, canNext = q.multi ? !!(v && v.length) : !!v;
    return `<div class="pad stack quiz">
      <div class="dots" aria-hidden="true">${quiz.questions.map((_, i) => `<span class="d ${i <= quiz.step ? 'on' : ''}"></span>`).join('')}</div>
      <p class="muted center">${esc(fmt(T.question, { i: quiz.step + 1, n }))}${q.multi ? ' · ' + esc(T.multiHint) : ''}</p>
      <h2 class="h2 qtitle">${esc(q.q)}</h2>
      ${q.hint ? `<p class="fine">${esc(q.hint)}</p>` : ''}
      <div class="opts" role="${q.multi ? 'group' : 'radiogroup'}">
        ${q.opts.map(o => `<button class="opt ${selSet.has(o.id) ? 'on' : ''}" data-opt="${esc(o.id)}" role="${q.multi ? 'checkbox' : 'radio'}" aria-checked="${selSet.has(o.id)}">
          <span class="emoji" aria-hidden="true">${o.emoji}</span><span class="grow"><b>${esc(o.label)}</b><span class="muted">${esc(o.detail)}</span></span><span class="tick" aria-hidden="true">${selSet.has(o.id) ? '✓' : ''}</span></button>`).join('')}
      </div>
      <div class="row gap">
        <button class="btn grow" data-act="qback">← ${esc(T.back)}</button>
        ${q.multi || isLast ? `<button class="btn main grow" data-act="qnext" ${canNext ? '' : 'disabled'}>${esc(isLast ? T.finish : T.next)} →</button>` : ''}
      </div>
    </div>`;
  }
  let advTimer;
  function pickOpt(id) {
    const q = quiz.questions[quiz.step];
    if (q.kind === 'home' && q.multi) {
      let cur = (quiz.home[q.id] || []).slice();
      if (id === 'any') cur = cur.includes('any') ? [] : ['any'];
      else {
        cur = cur.filter(x => x !== 'any');
        if (cur.includes(id)) cur = cur.filter(x => x !== id);
        else if (cur.length < q.max) cur.push(id);
        else { U.toast((lang() === 'en' ? 'Up to ' : '最多选 ') + q.max); return; }
      }
      quiz.home[q.id] = cur; persistQuiz(); render(); return;
    }
    if (q.kind === 'home') quiz.home[q.id] = id;
    else if (q.kind === 'life') quiz.life[quiz.step] = Number(id);
    else quiz.extra[q.id] = id;
    persistQuiz(); render();
    clearTimeout(advTimer); advTimer = setTimeout(qNext, 280);
  }
  function persistQuiz() {
    if (quiz.kind === 'home') st().homeAnswers = quiz.home; else { st().lifeAnswers = quiz.life; st().lifeExtra = quiz.extra; }
    Store.save();
  }
  function qNext() {
    clearTimeout(advTimer);
    const q = quiz.questions[quiz.step], v = qValue(quiz.step);
    if (q.multi ? !(v && v.length) : !v) return;
    if (quiz.step === quiz.questions.length - 1) return finishQuiz();
    quiz.step++; render(); el.querySelector('.screen').scrollTop = 0;
  }
  function qBack() { clearTimeout(advTimer); if (quiz.step > 0) { quiz.step--; render(); } else back(); }
  function finishQuiz() {
    const lg = lang();
    if (quiz.kind === 'home') {
      const r = HM.match(quiz.home, { lang: lg });
      st().lastResult = { source: 'home', ids: r.ids, persona: r.persona.title, lifeCharacter: '', answers: r.answers, at: Date.now() };
    } else {
      const r = LQ.run(quiz.life, quiz.extra, lg);
      if (!r) { U.toast(lg === 'en' ? 'Answer every question first' : '请先答完全部题目'); return; }
      st().lastResult = { source: 'life', ids: r.match.ids, persona: '', lifeCharacter: r.character.name, lifeAnswers: quiz.life.slice(), extra: quiz.extra, answers: r.mapAnswers, at: Date.now() };
    }
    Store.syncContext(); Store.save();
    go('result', {}, { replace: true });
  }

  /* ---------- 结果卡 ---------- */
  function resultScreen() {
    const T = t(), last = st().lastResult, lg = lang();
    if (!last) return `<div class="pad"><div class="card"><b class="h2">${esc(T.resultTitle)}</b><button class="btn main" data-quiz="life">${esc(T.lifeQuiz)}</button></div></div>`;
    let m, x;
    if (last.source === 'life') {
      const r = LQ.run(last.lifeAnswers, last.extra, lg); m = r.match;
      x = { title: r.character.name, stamp: r.character.icons, desc: r.character.description, quote: r.character.quote, keywords: r.character.keywords, day: r.character.day, color: r.character.color };
      last.lifeCharacter = r.character.name;
    } else {
      m = HM.match(last.answers, { lang: lg });
      x = { title: m.persona.title, stamp: m.persona.stamp, desc: m.persona.desc, quote: '', keywords: [], day: [], color: '#fffaf0' };
      last.persona = m.persona.title;
    }
    last.ids = m.ids;
    return `<div class="pad stack">
      <div class="card rc" style="background:${esc(x.color)}"><span class="tape"></span>
        <span class="muted">${esc(last.source === 'life' ? T.lifeCharacter : T.resultTitle)}</span>
        <div class="row gap"><span class="stamp">${esc(x.stamp)}</span><h1 class="h1 grow">${esc(x.title)}</h1></div>
        ${x.quote ? `<p class="quote">“${esc(x.quote)}”</p>` : ''}
        <p>${esc(x.desc)}</p>
        ${x.keywords.length ? `<div class="row wrap">${x.keywords.map(k => `<span class="chip">#${esc(k)}</span>`).join('')}</div>` : ''}
        ${x.day.map(d => `<div class="dayrow"><span class="time">${esc(d.time)}</span> ${esc(d.title)}</div>`).join('')}
      </div>
      <h2 class="h2">${esc(T.top3)}</h2>
      ${m.picks.length ? '' : `<div class="card muted">${esc(T.noPicks)}</div>`}
      ${m.picks.map(p => { const h = homeById(p.id), cover = D.coverPhoto(h); return `<button class="card pick" data-home="${p.id}">
        <div class="row gap">${cover ? `<img class="pick-img" src="${cover}" alt="">` : ''}<span class="hc-num top">${p.n}</span><span class="grow"><b class="h3">★${p.rank} ${esc(p.name)}</b><span class="muted">${esc(lg === 'en' ? p.area : p.areaZh)}</span></span></div>
        <span class="hc-price">${esc(p.price)}${p.historicalUnavailable ? ` <span class="badge">${esc(T.soldOut)}</span>` : ''}</span>
        <span class="divider"></span>
        ${p.reasons.map(r => `<span class="reason">${r.ico} ${esc(r.text)}</span>`).join('')}
        ${p.trade ? `<span class="trade">⚖️ ${esc(T.tradeoff)}${colon()}${esc(p.trade.text)}</span>` : ''}
      </button>`; }).join('')}
      <button class="btn main" data-cmp="${m.ids.join(',')}" ${m.picks.length < 2 ? 'disabled' : ''}>⚖️ ${esc(T.compare3)}</button>
      <div class="row gap"><button class="btn grow" data-act="onmap">🗺️ ${esc(T.onMap)}</button><button class="btn grow" data-act="askresult">💬 ${esc(T.consult)}</button></div>
      <button class="btn" data-quiz="${last.source === 'life' ? 'life' : 'home'}">↺ ${esc(T.retake)}</button>
      <p class="fine">${esc(T.priceNote)} ${esc(T.walkNote)}</p>
    </div>`;
  }

  /* ---------- 公寓详情 ---------- */
  const NEAR = [['super', '🛒', 'rowSuper'], ['topup', '🧺', 'rowTopup'], ['cafe', '☕', 'cafe'], ['lib', '📚', 'rowLib'], ['park', '🌳', 'rowPark'], ['gym', '🏋️', 'rowGym'], ['asianGroc', '🥢', 'asianGroc']];
  const CNT = [['rest10', '🍽️', 'rowRest10'], ['cafe10', '☕', 'rowCafe10'], ['asian10', '🍜', 'rowAsian10'], ['night10', '🪩', 'rowNight10']];
  const EXTRA = { zh: { cafe: '最近咖啡馆', asianGroc: '最近亚洲食品店' }, en: { cafe: 'Nearest café', asianGroc: 'Nearest Asian grocery' } };
  function homeScreen() {
    const T = t(), lg = lang(), h = homeById(route.id), rooms = D.roomsFor(h), last = st().lastResult;
    const rank = last ? last.ids.indexOf(h.id) + 1 : 0, fav = st().favorites.includes(h.id), inCmp = st().compare.includes(h.id);
    const label = k => T[k] || EXTRA[lg][k];
    const near = NEAR.filter(([k]) => h.hm.near[k]).map(([k, ico, l]) => { const x = h.hm.near[k], nm = x.p.n === 'Green-space boundary reference point' ? (lg === 'en' ? 'Green-space edge' : '绿地边界参考点') : x.p.n;
      return `<div class="kv"><span>${ico} ${esc(label(l))}</span><span>${esc(nm)} · ${esc(fmt(T.minutes, { n: x.m }))}</span></div>`; }).join('');
    const cnt = CNT.map(([k, ico, l]) => `<div class="kv"><span>${ico} ${esc(label(l))}</span><span>${esc(fmt(T.places, { n: h.hm.cnt[k] || 0 }))}</span></div>`).join('');
    const walks = [['uol', h.uol], ['ljmu', h.ljmu], ['lime', h.lime], ['centre', h.centre]].map(([k, v]) => `<div class="kv"><span>${esc(T[k])}</span><span>${esc(fmt(T.minutes, { n: v }))}</span></div>`).join('');
    const hero = rooms.building.length ? `<figure class="polaroid hero"><span class="tape"></span><img src="${D.PHOTO(rooms.building[0][0])}" alt="${esc(h.name)}"><figcaption><span>${esc(T[rooms.building[0][1]])}</span><span>${esc(area(h))}</span></figcaption></figure>`
      : `<div class="hero-ph"><span class="hc-num big ${rank ? 'top' : ''}">${h.n}</span><span class="muted">${esc(area(h))}</span></div>`;
    return `<div class="pad stack detail">
      ${hero}
      <div class="card">
        <div class="row gap"><span class="hc-num ${rank ? 'top' : ''}">${h.n}</span><h1 class="h1 grow">${esc(h.name)}</h1></div>
        <p class="muted">📍 ${esc(h.addr)} · ${esc(area(h))}</p>
        ${rank ? `<span class="chip on">★ ${esc(T.yourTop3)} #${rank}</span>` : ''}
        <p>${esc(lg === 'en' ? h.text : (h.textZh || h.text))}</p>
        ${h.rr ? `<p class="muted">${esc(T.rating)}${colon()}${h.rr.toFixed(1)}★ · ${esc(fmt(T.reviews, { n: h.rn || 0 }))}</p>` : ''}
      </div>
      <section class="stack">
        <div><p class="label">${esc(T.roomTypes)}</p><p class="fine">${esc(rooms.pending ? T.photosPendingNote : T.pickRoom)}</p></div>
        <div class="rcards">${rooms.types.map((r, i) => `<button class="rcard" data-room="${i}" aria-label="${esc(roomName(r))}">
          <span class="stackimg">${r.photos.length ? `<span class="count">${esc(fmt(T.photos, { n: r.photos.length }))}</span>${r.photos.slice(0, 3).reverse().map(p => `<img src="${D.PHOTO(p[0])}" alt="">`).join('')}` : `<span class="ph-empty">📷<br>${esc(T.photosPending)}</span>`}</span>
          <b>${esc(roomName(r))}</b>
          <span class="meta"><span class="price">${esc(r.price)}<small>${esc(T.perWeek)}</small></span><span class="chip ${r.ok ? 'ok' : 'full'}">${esc(U.L(r.status, lg))}</span></span>
        </button>`).join('')}</div>
        ${rooms.amber ? `<p class="fine">${esc(fmt(T.fromAmber, { n: rooms.totalTypes, m: rooms.types.length }))}</p>` : ''}
      </section>
      ${rooms.building.length ? `<section class="stack"><p class="label">${esc(T.building)}</p><div class="bldg">${rooms.building.map(b => `<figure><img src="${D.PHOTO(b[0])}" alt="${esc(T[b[1]])}"><figcaption>${esc(T[b[1]])}</figcaption></figure>`).join('')}</div></section>` : ''}
      <div class="card"><b class="h3">${esc(T.walks)}</b>${walks}<p class="fine">${esc(T.walkNote)}</p></div>
      <div class="card"><b class="h3">${esc(T.nearby)}</b>${near}<span class="divider"></span>${cnt}</div>
      <p class="fine">${esc(T.priceNote)}</p>
    </div>
    <div class="actionbar">
      <button class="btn small ${fav ? 'main' : ''}" data-fav="${h.id}" aria-pressed="${fav}">${fav ? '♥ ' + esc(T.faved) : '♡ ' + esc(T.fav)}</button>
      <button class="btn small" data-cmpadd="${h.id}" aria-pressed="${inCmp}">${inCmp ? '✓ ' + esc(T.inCompare) : '+ ' + esc(T.compare)}</button>
      <button class="btn small main grow" data-ask="${h.id}">💬 ${esc(T.askHome)}</button>
    </div>`;
  }
  function albumHtml() {
    const T = t(), lg = lang(), h = homeById(album.home), r = D.roomsFor(h).types[album.room], groups = {};
    r.photos.forEach(p => { (groups[p[1]] = groups[p[1]] || []).push(p); });
    const keys = Object.keys(groups);
    const facts = r.facts.map(f => `<span class="chip">${esc(T[f === 'sharedKitchen' ? 'sharedKitchenF' : f === 'living' ? 'livingF' : f])}</span>`).join('');
    return `<div class="album" role="dialog" aria-modal="true" aria-label="${esc(roomName(r))}">
      <div class="ahead"><div class="grow"><b class="h3">${esc(roomName(r))}</b><div class="muted">${h.n} · ${esc(h.name)}</div></div><button class="iconbtn x" data-act="closealbum" aria-label="Close">×</button></div>
      ${keys.length ? `<div class="ajump">${keys.map((k, j) => `<button class="chip" data-jump="g${j}">${esc(T[k])} · ${groups[k].length}</button>`).join('')}</div>` : ''}
      <div class="abody" id="abody">
        ${keys.length ? keys.map((k, j) => `<h4 id="g${j}">${esc(T[k])}</h4>` + groups[k].map((p, n) => `<figure class="polaroid"><img src="${D.PHOTO(p[0])}" alt="${esc(roomName(r))}: ${esc(T[k])}"><figcaption><span>${esc(T[k])}</span><span>${n + 1}/${groups[k].length}</span></figcaption></figure>`).join('')).join('')
          : `<div class="ph-empty big">📷<br>${esc(T.photosPendingNote)}</div>`}
        <div><span class="chip ${r.ok ? 'ok' : 'full'}">${esc(U.L(r.status, lg))}</span></div>
        <div class="row wrap">${facts}</div>
      </div>
      <div class="afoot"><span class="price">${esc(r.price)}<small>${esc(T.perWeek)}</small></span><button class="btn main" data-askroom="${album.room}">💬 ${esc(T.askRoom)}</button></div>
    </div>`;
  }

  /* ---------- 对比、收藏 ---------- */
  function compareScreen() {
    const T = t(), homes = HM.byIds(route.ids || []), rows = CMP.rows(homes, lang());
    return `<div class="pad stack"><h1 class="h1">${esc(T.cmpTitle)}</h1>
      <div class="tablebox"><table class="cmp"><thead><tr><th></th>${homes.map(h => `<th><button class="cmphd" data-home="${h.id}">${D.coverPhoto(h) ? `<img src="${D.coverPhoto(h)}" alt="">` : ''}<span class="hc-num top">${h.n}</span><span>${esc(h.name)}</span></button></th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr><th scope="row">${esc(r.label)}</th>${r.cells.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <button class="btn main" data-act="askcmp">💬 ${esc(T.consult)}</button>
      <p class="fine">${esc(T.priceNote)} ${esc(T.walkNote)}</p></div>`;
  }
  function savedScreen() {
    const T = t(), favs = HM.byIds(st().favorites), cmp = HM.byIds(st().compare);
    return `<div class="pad stack"><h1 class="h1">${esc(T.savedTitle)}</h1>
      <div class="card"><b class="h3">${esc(fmt(T.compareTray, { n: cmp.length }))}</b>
        <div class="row wrap">${cmp.map(h => `<button class="chip on" data-cmpadd="${h.id}">${h.n} ${esc(h.name)} ×</button>`).join('') || '<span class="muted">—</span>'}</div>
        <button class="btn small main" data-cmp="${cmp.map(h => h.id).join(',')}" ${cmp.length < 2 ? 'disabled' : ''}>${esc(T.openCompare)}</button></div>
      ${favs.length ? favs.map(h => homeCard(h, 0)).join('') : `<div class="card muted">${esc(T.savedEmpty)}</div>`}
    </div>`;
  }

  /* ---------- 对话 ---------- */
  function chatScreen() {
    const T = t();
    return `<div class="chat">
      <div class="chathead"><span class="avatar" aria-hidden="true">A</span><div class="grow"><b>Amy · ${esc(T.chatTitle)}</b><div class="fine">${esc(T.chatSub)}</div></div></div>
      <div class="msgs" id="msgs" aria-live="polite"></div>
      <div id="chatcta"></div>
      <form class="composer" id="composer"><label class="sr" for="chatIn">${esc(T.chatPh)}</label><input id="chatIn" autocomplete="off" placeholder="${esc(T.chatPh)}" value="${esc(draft)}"><button class="btn small main" type="submit">${esc(T.send)}</button></form>
    </div>`;
  }
  function msgHtml(m) {
    const T = t(), lg = lang(), me = Store.me(), cls = m.from === 'student' ? 'out' : 'in';
    if (m.type === 'welcome') return `<div class="msg in"><div class="bubble">${esc(T.welcome)}</div><time>${U.clock(m.at)}</time></div>`;
    if (m.type === 'home') {
      const h = homeById(m.homeId); if (!h) return '';
      const r = m.room != null ? D.roomsFor(h).types[m.room] : null, cover = r && r.photos[0] ? D.PHOTO(r.photos[0][0]) : D.coverPhoto(h);
      return `<div class="msg ${cls}"><button class="ctxcard" data-home="${h.id}">${cover ? `<img src="${cover}" alt="">` : `<span class="hc-num">${h.n}</span>`}<span><span class="fine">${esc(T.ctxCard)}</span><b>${h.n} · ${esc(h.name)}</b>${r ? `<span>${esc(roomName(r))} · ${esc(r.price)}${esc(T.perWeek)}</span>` : `<span>${esc(U.fromPrice(h, lg))}</span>`}</span></button><time>${U.clock(m.at)}</time></div>`;
    }
    if (m.type === 'request') {
      const q = me.request || {};
      return `<div class="msg out"><div class="bubble req"><b>🙋 ${esc(T.wantGroup)}</b><span>${esc(q.name || '')} · ${esc(q.intake || '')} · ${esc(U.campusName(q.uni, lg))}</span><span>${q.budget ? '£' + q.budget + esc(T.perWeek) : ''} · ${esc(T[q.room] || '')} · ${esc(U.L(D.CHANNELS[q.channel], lg))}</span></div><time>${U.clock(m.at)}</time></div>
        <div class="sysnote">${esc(T.reqSent)}</div>`;
    }
    if (m.type === 'qr') {
      const g = me.group; if (!g) return '';
      const team = D.TEAMS.find(x => x.id === g.team), wa = g.channel === 'whatsapp';
      return `<div class="msg in"><div class="qrcard ${wa ? 'wa' : 'wx'}"><span class="tape"></span>
        <b class="h3">${esc(T.qrTitle)}</b><span class="chan">${wa ? 'WhatsApp' : '微信 WeChat'}</span>
        <div class="qr">${U.qrSvg(g.link, 4)}</div>
        <b>${esc(g.name)}</b>
        <span class="muted">${esc(wa ? T.qrLeadWa : T.qrLeadWx)}</span>
        <span class="fine">${esc(T.team)}${colon()}${esc(U.L(team.name, lg))}<br>${team.members.map(esc).join(' · ')}</span>
        ${wa ? `<button class="btn small main" data-act="openwa">${esc(T.openWa)}</button>` : ''}
        <span class="fine">${esc(T.qrDemo)}</span></div><time>${U.clock(m.at)}</time></div>`;
    }
    return `<div class="msg ${cls}"><div class="bubble">${esc(m.text)}</div><time>${U.clock(m.at)}</time></div>`;
  }
  function renderChat() {
    const box = el.querySelector('#msgs'); if (!box) return;
    const T = t(), me = Store.me();
    box.innerHTML = me.messages.map(msgHtml).join('');
    box.scrollTop = box.scrollHeight;
    const cta = el.querySelector('#chatcta');
    const canReq = ['browsing', 'chatting'].includes(me.status);
    cta.innerHTML = (canReq ? `<button class="groupcta" data-act="wantgroup"><b>🙋 ${esc(T.wantGroup)}</b><span>${esc(T.wantGroupSub)}</span></button>` : '')
      + (root.App && root.App.mode() === 'student' ? `<p class="fine tip">${esc(T.demoTipChat)}</p>` : '');
    if (me.studentUnread) { me.studentUnread = 0; Store.save(); }
  }
  function sheetHtml() {
    const T = t(), lg = lang(), R = D.REGIONS, region = sheet.region, last = st().lastResult;
    const uni = (last && last.answers && last.answers.campus) || 'uol';
    const campuses = ['uol', 'ljmu-city', 'ljmu-mp', 'hope-park', 'hope-creative', 'lipa', 'unsure'];
    const fav = st().favorites[0] || st().viewed[st().viewed.length - 1];
    return `<div class="sheetwrap" role="dialog" aria-modal="true" aria-labelledby="reqT"><form class="reqsheet" id="reqform">
      <span class="grab" aria-hidden="true"></span>
      <b class="h2" id="reqT">${esc(T.reqTitle)}</b><p class="muted">${esc(T.reqLead)}</p>
      <label class="field"><span>${esc(T.fName)}</span><input id="rq-name" required value="${esc(sheet.name || '')}" placeholder="${lg === 'en' ? 'e.g. Ethan' : '例如：小王'}"></label>
      <label class="field"><span>${esc(T.fRegion)}</span><select id="rq-region">${Object.keys(R).map(k => `<option value="${k}" ${k === region ? 'selected' : ''}>${R[k].flag} ${esc(U.L(R[k], lg))}</option>`).join('')}</select></label>
      <div class="two"><label class="field"><span>${esc(T.fIntake)}</span><select id="rq-intake">${['Sep 2027', 'Jan 2027', 'Sep 2026', 'Jan 2028'].map(v => `<option>${v}</option>`).join('')}</select></label>
        <label class="field"><span>${esc(T.fBudget)}</span><select id="rq-budget">${[180, 200, 250, 300, 400].map(v => `<option value="${v}" ${v === 250 ? 'selected' : ''}>≤ £${v}</option>`).join('')}</select></label></div>
      <label class="field"><span>${esc(T.fUni)}</span><select id="rq-uni">${campuses.map(c => `<option value="${c}" ${c === uni ? 'selected' : ''}>${esc(U.campusName(c, lg))}</option>`).join('')}</select></label>
      <label class="field"><span>${esc(T.fRoom)}</span><select id="rq-room">${['ensuite', 'studio', 'any'].map(r => `<option value="${r}">${esc(T[r])}</option>`).join('')}</select></label>
      <fieldset class="field"><legend>${esc(T.fChannel)}</legend><div class="row gap">
        ${['whatsapp', 'wechat'].map(c => `<label class="radio"><input type="radio" name="rq-ch" value="${c}" ${c === R[region].channel ? 'checked' : ''}> ${esc(U.L(D.CHANNELS[c], lg))}</label>`).join('')}</div></fieldset>
      ${fav ? `<p class="fine">${esc(T.viewing)}${colon()}${esc(homeById(fav).name)}</p>` : ''}
      <div class="row gap"><button class="btn grow" type="button" data-act="closesheet">${esc(T.cancel)}</button><button class="btn main grow" type="submit">${esc(T.submitReq)}</button></div>
    </form></div>`;
  }

  function ask(homeId, room) {
    const me = Store.me(), lastM = me.messages[me.messages.length - 1];
    if (!(lastM && lastM.type === 'home' && lastM.homeId === homeId && lastM.room === room)) Store.studentSend({ type: 'home', homeId, room });
    go('chat', {}, { tab: true });
  }

  /* ---------- 渲染与事件 ---------- */
  function render() {
    const T = t();
    let inner, title;
    if (route.name === 'map') inner = mapScreen();
    else if (route.name === 'quizzes') inner = quizzesScreen();
    else if (route.name === 'quiz') { inner = quizScreen(); title = quiz.kind === 'life' ? T.lifeQuiz : T.homeQuiz; }
    else if (route.name === 'result') { inner = resultScreen(); title = T.resultTitle; Store.save(); }
    else if (route.name === 'home') { const h = homeById(route.id); inner = homeScreen(); title = h.n + ' · ' + h.name; }
    else if (route.name === 'compare') { inner = compareScreen(); title = T.cmpTitle; }
    else if (route.name === 'saved') inner = savedScreen();
    else if (route.name === 'chat') { inner = chatScreen(); title = T.chatTitle; }
    el.innerHTML = shell(inner, title);
    if (route.name === 'map') mountMap(); else map = null;
    if (route.name === 'chat') renderChat();
    if (album) { const ab = el.querySelector('.album .x'); if (ab) ab.focus(); }
  }
  function onClick(e) {
    const b = e.target.closest('button, [data-act]'); if (!b || !el.contains(b)) return;
    const d = b.dataset;
    if (d.tab) { const n = { map: 'map', quiz: 'quizzes', saved: 'saved', chat: 'chat' }[d.tab]; return go(n, {}, { tab: true }); }
    if (d.home) { Store.viewHome(d.home); return go('home', { id: d.home }); }
    if (d.quiz) { startQuiz(d.quiz); return go('quiz', {}, { replace: route.name === 'result' || route.name === 'quiz' }); }
    if (d.opt != null) return pickOpt(d.opt);
    if (d.fav) { const on = Store.toggleFav(d.fav); U.toast(on ? t().faved : '♡'); return route.name === 'map' ? renderList() : render(); }
    if (d.cmpadd) { Store.toggleCompare(d.cmpadd); return render(); }
    if (d.cmp) return go('compare', { ids: d.cmp.split(',').filter(Boolean) });
    if (d.room != null) { album = { home: route.id, room: +d.room }; return render(); }
    if (d.jump) { const g = el.querySelector('#' + d.jump), body = el.querySelector('#abody'); if (g && body) body.scrollTop = g.offsetTop - body.offsetTop - 4; return; }
    if (d.askroom != null) return ask(album.home, +d.askroom);
    if (d.ask) return ask(d.ask);
    switch (d.act) {
      case 'back': return back();
      case 'lang': st().lang = st().lang === 'en' ? 'zh' : 'en'; Store.syncContext(); Store.save(); if (quiz && route.name === 'quiz') { const s = quiz.step; startQuiz(quiz.kind); quiz.step = s; } return render();
      case 'onlytop': onlyTop = !onlyTop; return renderList();
      case 'favonly': filters.fav = !filters.fav; b.classList.toggle('on', filters.fav); return renderList();
      case 'reset': Object.assign(filters, { q: '', budget: 0, room: 'any', walk: 0, fav: false }); onlyTop = false; selected = ''; return render();
      case 'result': return go('result');
      case 'unpeek': selected = ''; return renderList();
      case 'qback': return qBack();
      case 'qnext': return qNext();
      case 'onmap': route = { name: 'map', focusTop: true }; stack = []; return render();
      case 'askresult': { const ids = (st().lastResult || {}).ids || []; return ids.length ? ask(ids[0]) : go('chat', {}, { tab: true }); }
      case 'askcmp': return ask((route.ids || [])[0]);
      case 'closealbum': album = null; return render();
      case 'wantgroup': sheet = { region: st().region, name: Store.me().name }; return render();
      case 'closesheet': sheet = null; return render();
      case 'openwa': return U.toast(lang() === 'en' ? 'Demo: the real app opens WhatsApp here.' : '演示：正式版会在这里打开 WhatsApp。');
    }
  }
  function onChange(e) {
    const x = e.target;
    if (x.dataset.filter) { const k = x.dataset.filter; filters[k] = k === 'room' ? x.value : Number(x.value); x.closest('.chipsel').classList.toggle('on', !!filters[k] && filters[k] !== 'any'); return renderList(); }
    if (x.dataset.act === 'region') { st().region = x.value; Store.syncContext(); Store.save(); return; }
    if (x.id === 'rq-region') { const ch = D.REGIONS[x.value].channel; el.querySelectorAll('input[name="rq-ch"]').forEach(r => { r.checked = r.value === ch; }); }
  }
  function onInput(e) {
    if (e.target.id === 'searchIn') { filters.q = e.target.value; renderList(); }
    if (e.target.id === 'chatIn') draft = e.target.value;
  }
  function onSubmit(e) {
    e.preventDefault();
    if (e.target.id === 'composer') {
      const v = draft.trim(); if (!v) return;
      draft = ''; Store.studentSend({ text: v }); renderChat(); el.querySelector('#chatIn').value = ''; el.querySelector('#chatIn').focus();
    }
    if (e.target.id === 'reqform') {
      const v = id => el.querySelector('#' + id).value, ch = el.querySelector('input[name="rq-ch"]:checked');
      const name = v('rq-name').trim(); if (!name) { el.querySelector('#rq-name').focus(); return; }
      Store.requestGroup({ name, region: v('rq-region'), intake: v('rq-intake'), budget: Number(v('rq-budget')), uni: v('rq-uni'), room: v('rq-room'), channel: ch ? ch.value : 'whatsapp' });
      sheet = null; render();
    }
  }
  function onKey(e) { if (e.key === 'Escape' && (album || sheet)) { album = null; sheet = null; render(); } }

  function mount(node) {
    el = node;
    el.addEventListener('click', onClick);
    el.addEventListener('change', onChange);
    el.addEventListener('input', onInput);
    el.addEventListener('submit', onSubmit);
    el.addEventListener('keydown', onKey);
    Store.syncContext();
    render();
  }
  /* 后台发消息、或另一个标签页改了数据时：只刷新受影响的部分，不打断正在看的页面 */
  function refresh() {
    if (!el) return;
    if (route.name === 'chat') renderChat();
    const me = Store.me(), badge = el.querySelector('[data-tab="chat"]');
    if (badge && route.name !== 'chat') {
      const n = me.studentUnread || 0, dot = badge.querySelector('.badge-dot');
      if (n && !dot) badge.insertAdjacentHTML('beforeend', `<span class="badge-dot">${n}</span>`); else if (dot) { if (n) dot.textContent = n; else dot.remove(); }
    }
  }
  root.Student = { mount, refresh, render, reset() { route = { name: 'map' }; stack = []; quiz = null; album = null; sheet = null; selected = ''; draft = ''; root.MapView.resetView(); } };
})(typeof globalThis !== 'undefined' ? globalThis : this);
