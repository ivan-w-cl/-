/* Room types and photo albums inside the home card ("展开详情" / Details).
   Add-on only: it watches #cardBody and inserts one section into #propertyDetails; the card's own layout is untouched.
   Photos and room types for iQ Great Newton House are from AmberStudent (taken 21 Oct 2026, design/room-photos).
   Other homes list room types from the recorded guide prices until their photos are added to ROOMS. */
(() => {
  'use strict';
  const PHOTO = p => './photos/' + p + '.jpg';
  const ROOMS = {
    'iq-great-newton-house': {
      totalTypes: 9,
      building: [['bldg-exterior', 'courtyard'], ['bldg-common', 'common'], ['bldg-amenities', 'amenities']],
      types: [
        { name: { en: 'Gold En Suite', zh: '金级独卫单间', ja: 'ゴールド・エンスイート' }, price: '£160–185', ok: true,
          status: { en: 'From 9 Jan 2027', zh: '2027 年 1 月 9 日起可入住', ja: '2027年1月9日から入居可' },
          facts: ['privBath', 'sharedKitchen', 'deposit'],
          photos: [['ensuite-bedroom', 'bedroom'], ['ensuite-bedroom2', 'bedroom'], ['ensuite-bathroom', 'bathroom'], ['ensuite-kitchen', 'sharedKitchen']] },
        { name: { en: 'Gold 1 Bed Apartment', zh: '金级一居室公寓', ja: 'ゴールド 1ベッドアパートメント' }, price: '£243', ok: false,
          status: { en: 'Fully booked 26/27', zh: '26/27 学年已满', ja: '26/27年度は満室' },
          facts: ['privKitchen', 'privBath', 'living', 'couples', 'deposit'],
          photos: [['1bed-bedroom', 'bedroom'], ['1bed-living', 'living'], ['1bed-kitchen', 'kitchen'], ['1bed-bathroom', 'bathroom']] },
        { name: { en: 'Silver 2 Bed Apartment', zh: '银级两居室公寓', ja: 'シルバー 2ベッドアパートメント' }, price: '£222', ok: false,
          status: { en: 'Fully booked 26/27', zh: '26/27 学年已满', ja: '26/27年度は満室' },
          facts: ['privBath', 'sharedKitchen', 'deposit'],
          photos: [['2bed-bedroom', 'bedroom'], ['2bed-kitchen', 'kitchen'], ['2bed-bathroom', 'bathroom']] }
      ]
    }
  };
  const W = {
    zh: { roomTypes: '房型与照片', pick: '点房型查看照片', photos: '{n} 张', pending: '照片整理中', pendingNote: '这套公寓的房型照片正在整理，先看价格和位置，或直接咨询。',
      source: '照片与房型来自 AmberStudent，2026-10-21 采集；共 {n} 个房型，这里展示 {m} 个。', building: '公寓环境', perWeek: '/周', ask: '咨询这个房型',
      close: '关闭相册', hint: '📷 {n} 张房型照片 · 展开详情查看', askDraft: '我想咨询 {room}（{price}/周），请问还有房吗？',
      courtyard: '庭院', common: '公共休息区', amenities: '设施', bedroom: '卧室', bathroom: '浴室', kitchen: '厨房', sharedKitchen: '共用厨房', living: '客厅',
      privBath: '独立卫浴', sharedKitchenF: '共用厨房', privKitchen: '独立厨房', livingF: '独立客厅', couples: '可情侣入住', deposit: '押金 £125',
      ensuite: '独卫单间', studio: 'Studio 套间', room: '房间', hist: '27/28 学年档期待确认', histNone: '历史记录无房' },
    en: { roomTypes: 'Room types & photos', pick: 'Tap a room type to see its photos', photos: '{n} photos', pending: 'Photos coming', pendingNote: 'Room photos for this home are being added. Check prices and location for now, or ask us.',
      source: 'Photos and room types from AmberStudent, taken 21 Oct 2026. Showing {m} of {n} room types.', building: 'The building', perWeek: '/wk', ask: 'Ask about this room',
      close: 'Close album', hint: '📷 {n} room photos · open Details', askDraft: "I'd like to ask about the {room} ({price}/week). Is it still available?",
      courtyard: 'Courtyard', common: 'Common room', amenities: 'Amenities', bedroom: 'Bedroom', bathroom: 'Bathroom', kitchen: 'Kitchen', sharedKitchen: 'Shared kitchen', living: 'Living room',
      privBath: 'Private bathroom', sharedKitchenF: 'Shared kitchen', privKitchen: 'Private kitchen', livingF: 'Living room', couples: 'Couples welcome', deposit: 'Deposit £125',
      ensuite: 'En-suite', studio: 'Studio', room: 'Room', hist: 'Ask for 27/28 dates', histNone: 'No rooms listed (historic)' },
    ja: { roomTypes: '部屋タイプと写真', pick: '部屋タイプを選ぶと写真が見られます', photos: '{n} 枚', pending: '写真準備中', pendingNote: 'この寮の部屋写真は準備中です。料金と場所を確認するか、相談してください。',
      source: '写真と部屋タイプは AmberStudent より（2026年10月21日取得）。全 {n} タイプのうち {m} タイプを表示。', building: '建物', perWeek: '/週', ask: 'この部屋を相談する',
      close: 'アルバムを閉じる', hint: '📷 部屋写真 {n} 枚 · 詳細で見る', askDraft: '{room}（{price}/週）について相談したいです。まだ空きはありますか？',
      courtyard: '中庭', common: '共用ラウンジ', amenities: '設備', bedroom: '寝室', bathroom: 'バスルーム', kitchen: 'キッチン', sharedKitchen: '共用キッチン', living: 'リビング',
      privBath: '専用バスルーム', sharedKitchenF: '共用キッチン', privKitchen: '専用キッチン', livingF: '専用リビング', couples: 'カップル入居可', deposit: 'デポジット £125',
      ensuite: 'エンスイート', studio: 'スタジオ', room: '部屋', hist: '27/28年度の空きは要確認', histNone: '記録上は満室' }
  };
  const lang = () => { try { return W[LANG] ? LANG : 'zh'; } catch (_) { return 'zh'; } };
  const w = () => W[lang()];
  const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '');
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const homeNow = () => { try { return current && current.t === 'home' ? current : null; } catch (_) { return null; } };
  const L = o => o[lang()] || o.en;

  function roomsFor(h) {
    if (ROOMS[h.id]) return ROOMS[h.id];
    const status = { en: h.pso ? W.en.histNone : W.en.hist, zh: h.pso ? W.zh.histNone : W.zh.hist, ja: h.pso ? W.ja.histNone : W.ja.hist };
    const mk = (key, v, facts) => ({ name: { en: W.en[key], zh: W.zh[key], ja: W.ja[key] }, price: '£' + v, ok: !h.pso, status, facts, photos: [] });
    const types = [];
    if (h.pe) types.push(mk('ensuite', h.pe, ['privBath', 'sharedKitchen']));
    if (h.ps) types.push(mk('studio', h.ps, ['privKitchen', 'privBath']));
    if (!types.length && h.plo) types.push(mk('room', h.plo, []));
    return { types, building: [], totalTypes: types.length, pending: true };
  }
  const photoCount = r => r.types.reduce((s, t) => s + t.photos.length, 0) + r.building.length;

  function section(h) {
    const k = w(), r = roomsFor(h), box = el('section', 'rp');
    box.append(el('h4', 'rp-title', k.roomTypes), el('p', 'rp-note', r.pending ? k.pendingNote : k.pick));
    const strip = el('div', 'rp-strip');
    r.types.forEach((t, i) => {
      const b = el('button', 'rp-card'); b.type = 'button'; b.setAttribute('aria-label', L(t.name));
      const stack = el('span', 'rp-stack');
      if (t.photos.length) {
        stack.append(el('span', 'rp-count', fmt(k.photos, { n: t.photos.length })));
        t.photos.slice(0, 3).reverse().forEach(p => { const img = el('img'); img.src = PHOTO(p[0]); img.alt = ''; img.loading = 'lazy'; stack.append(img); });
      } else stack.append(el('span', 'rp-empty', '📷 ' + k.pending));
      const meta = el('span', 'rp-meta');
      const price = el('span', 'rp-price', t.price); price.append(el('small', '', k.perWeek));
      meta.append(price, el('span', 'rp-chip ' + (t.ok ? 'ok' : 'full'), L(t.status)));
      b.append(stack, el('b', 'rp-name', L(t.name)), meta);
      b.addEventListener('click', e => { e.stopPropagation(); openAlbum(h, i); });
      strip.append(b);
    });
    box.append(strip);
    if (r.building.length) {
      const bl = el('div', 'rp-bldg');
      r.building.forEach(([p, key]) => { const f = el('figure'); const img = el('img'); img.src = PHOTO(p); img.alt = k[key]; img.loading = 'lazy'; f.append(img, el('figcaption', '', k[key])); bl.append(f); });
      box.append(el('p', 'rp-sub', k.building), bl);
    }
    if (!r.pending) box.append(el('p', 'rp-src', fmt(k.source, { n: r.totalTypes, m: r.types.length })));
    return box;
  }

  /* full-screen album, styled like the contact panel */
  const wrap = el('div', 'rp-wrap'); wrap.hidden = true;
  wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true');
  document.body.append(wrap);
  wrap.addEventListener('click', e => { e.stopPropagation(); if (e.target === wrap) closeAlbum(); });
  wrap.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); closeAlbum(); } });
  let lastFocus = null;
  function closeAlbum() { wrap.hidden = true; wrap.replaceChildren(); if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  function openAlbum(h, i) {
    const k = w(), t = roomsFor(h).types[i], groups = new Map();
    t.photos.forEach(p => { if (!groups.has(p[1])) groups.set(p[1], []); groups.get(p[1]).push(p); });
    lastFocus = document.activeElement;
    const box = el('div', 'rp-album');
    const head = el('div', 'rp-ahead'), titles = el('div', 'rp-atitles');
    titles.append(el('h3', '', L(t.name)), el('p', 'rp-note', h.n + ' · ' + h.name));
    const x = el('button', 'x', '×'); x.type = 'button'; x.setAttribute('aria-label', k.close); x.addEventListener('click', closeAlbum);
    head.append(titles, x);
    wrap.setAttribute('aria-label', L(t.name));
    const jump = el('div', 'rp-jump'), body = el('div', 'rp-abody');
    [...groups.entries()].forEach(([key, list], j) => {
      const id = 'rpg' + j, chip = el('button', 'rp-jchip', `${k[key]} · ${list.length}`); chip.type = 'button';
      chip.addEventListener('click', () => { const g = body.querySelector('#' + id); if (g) body.scrollTo({ top: g.offsetTop - body.offsetTop - 4, behavior: 'smooth' }); });
      jump.append(chip);
      body.append(Object.assign(el('h4', '', k[key]), { id }));
      list.forEach((p, n) => {
        const f = el('figure', 'rp-pol'), img = el('img'); img.src = PHOTO(p[0]); img.alt = `${L(t.name)}: ${k[key]}`;
        const cap = el('figcaption'); cap.append(el('span', '', k[key]), el('span', '', `${n + 1}/${list.length}`));
        f.append(img, cap); body.append(f);
      });
    });
    if (!t.photos.length) body.append(el('p', 'rp-empty big', '📷 ' + k.pendingNote));
    const facts = el('div', 'rp-facts');
    facts.append(el('span', 'rp-chip ' + (t.ok ? 'ok' : 'full'), L(t.status)));
    t.facts.forEach(f => facts.append(el('span', 'rp-chip', k[f === 'sharedKitchen' ? 'sharedKitchenF' : f === 'living' ? 'livingF' : f])));
    body.append(facts);
    const foot = el('div', 'rp-afoot'), price = el('span', 'rp-price big', t.price); price.append(el('small', '', k.perWeek));
    const ask = el('button', 'rp-ask', '💬 ' + k.ask); ask.type = 'button';
    ask.addEventListener('click', () => {
      closeAlbum();
      try { openContact(h); } catch (_) { return; }
      const input = document.getElementById('cdMessage');
      if (input) { input.value = fmt(k.askDraft, { room: L(t.name), price: t.price }); input.dispatchEvent(new Event('input', { bubbles: true })); input.focus({ preventScroll: true }); }
    });
    foot.append(price, ask);
    box.append(head);
    if (groups.size) box.append(jump);
    box.append(body, foot);
    wrap.replaceChildren(box); wrap.hidden = false; x.focus();
  }

  /* insert into the card each time it is drawn */
  const cardBody = document.getElementById('cardBody');
  if (!cardBody) return;
  function decorate() {
    const h = homeNow(); if (!h) return;
    const details = cardBody.querySelector('#propertyDetails');
    if (details && !details.querySelector('.rp')) {
      const after = details.querySelector('.txt');
      details.insertBefore(section(h), after ? after.nextSibling : details.firstChild);
    }
    const compact = cardBody.querySelector('.compact-summary'), r = roomsFor(h);
    if (compact && !compact.querySelector('.rp-hint') && !r.pending) compact.append(el('p', 'rp-hint', fmt(w().hint, { n: photoCount(r) })));
  }
  new MutationObserver(decorate).observe(cardBody, { childList: true });
  decorate(); // the card may already be open from the link (#home=…) before this script ran
})();
