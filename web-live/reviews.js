/* 评价与公开记录：只放有出处的信息，每一项都写明来源，点链接去原网站看。
   - 评分：地图里记录的 Amber 评分和评价数（2026-10-17 快照，和公寓卡片上的同一份数据）。
   - 去权威网站看完整评价：StudentCrowd（只收学校邮箱验证过的学生评价）、Google 地图评价、Amber 页面。
     StudentCrowd 和 Amber 用必应站内搜索打开（国内也能访问必应；Google 地图在国内可能打不开）。
   - 官方公开记录，自己查：police.uk（周边治安，输入邮编）、GOV.UK 能耗证书（EPC），合租房另有利物浦市议会的 HMO 执照登记。
     本站不转载这些数据，只给入口和这栋楼的邮编。
   - 排行榜：按记录的评分排（至少 5 条评价才上榜）。
   入口：公寓卡片「展开详情」的选房小工具、收起卡片上的「🏅 评分」、生活选房开场页。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, pick } = BT;
  const W = {
    zh: {
      intro: '🏅 评价与公开记录', title: '🏅 评价与公开记录', desc: '有出处的评分 + 权威网站入口', mini: '🏅 评分 {s}', miniNone: '🏅 评价与记录',
      eyebrow: '评价与公开记录', tabRev: '评价', tabRec: '官方公开记录', tabRank: '排行榜',
      rating: '记录的评分', nRev: '{n} 条评价', noRating: '还没有记录到这栋楼的评分，可以去下面的网站看看。',
      ratingSrc: '来源：Amber 公寓页面（2026 年 10 月 17 日记录），不是实时数据。',
      outH: '去权威网站看完整评价', outNote: '下面的链接打开的是外部网站，内容以原网站为准；本站不转载评价。',
      sites: {
        sc: ['StudentCrowd', '英国学生评价网站，只收学校邮箱验证过的学生评价，按性价比、位置、保洁、Wi-Fi、管理等打分'],
        gm: ['Google 地图评价', '住户和访客的评价与照片（国内可能需要特殊网络才能打开）'],
        am: ['Amber Student', '本站评分的来源页面，可以看到逐条评价']
      },
      recLede: '这些是英国政府和警方公开的数据。本站不转载，只给你入口和这栋楼的邮编，点进去自己查。',
      postcode: '这栋楼的邮编：{p}', copyPc: '复制邮编', copied: '已复制',
      recs: {
        police: ['🚓 周边治安', 'police.uk（英国警方官网）', '输入邮编，可以看到附近每个月登记的案件数量和类别'],
        epc: ['🔥 能耗证书（EPC）', 'GOV.UK Find an energy certificate', '输入邮编查能耗等级，等级越高（A 最好）冬天越省暖气费；大型学生公寓有时整栋按非住宅登记'],
        hmo: ['📄 合租房执照（HMO）', '利物浦市议会（Liverpool City Council）', '多人合租的房子需要 HMO 执照，签约前可以查是否登记']
      },
      open: '打开 ↗', rankLede: '按记录的评分排（至少 5 条评价才上榜）。', rankSrc: '来源：Amber 公寓页面（2026 年 10 月 17 日记录）。', rankOpen: '查看'
    },
    en: {
      intro: '🏅 Reviews & public records', title: '🏅 Reviews & records', desc: 'Sourced ratings + links to trusted sites', mini: '🏅 Rated {s}', miniNone: '🏅 Reviews & records',
      eyebrow: 'Reviews & public records', tabRev: 'Reviews', tabRec: 'Official records', tabRank: 'Rankings',
      rating: 'Recorded rating', nRev: '{n} reviews', noRating: 'No rating recorded for this building yet; try the sites below.',
      ratingSrc: 'Source: the building’s Amber page (recorded 17 October 2026), not live data.',
      outH: 'Read full reviews on trusted sites', outNote: 'These links open external sites; what they say is what counts. We do not copy reviews.',
      sites: {
        sc: ['StudentCrowd', 'UK student review site that only accepts reviews from students verified by university email, scored on value, location, cleaning, Wi-Fi, management and more'],
        gm: ['Google Maps reviews', 'Reviews and photos from residents and visitors'],
        am: ['Amber Student', 'Where our recorded rating comes from, with individual reviews']
      },
      recLede: 'Public data from the UK government and police. We do not copy it; here are the links and this building’s postcode so you can check it yourself.',
      postcode: 'Postcode: {p}', copyPc: 'Copy postcode', copied: 'Copied',
      recs: {
        police: ['🚓 Crime nearby', 'police.uk (UK police)', 'Enter the postcode to see recorded crimes nearby by month and type'],
        epc: ['🔥 Energy certificate (EPC)', 'GOV.UK Find an energy certificate', 'Enter the postcode to see the energy rating; a higher rating (A is best) means lower heating bills. Large student buildings are sometimes registered as non-domestic'],
        hmo: ['📄 Shared-house licence (HMO)', 'Liverpool City Council', 'Shared houses need an HMO licence; check it is registered before you sign']
      },
      open: 'Open ↗', rankLede: 'Ranked by recorded rating (at least 5 reviews).', rankSrc: 'Source: building pages on Amber (recorded 17 October 2026).', rankOpen: 'View'
    }
  };
  const w = () => pick(W);
  const homes = () => { try { return HOMES; } catch (_) { return []; } };
  const stars = v => '★★★★★'.slice(0, Math.round(v)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(v));
  const postcodeOf = h => (/[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}/i.exec(h.addr || '') || [''])[0].toUpperCase();
  const bing = q => 'https://www.bing.com/search?q=' + encodeURIComponent(q);
  const links = h => ({
    sc: bing(`site:studentcrowd.com "${h.name}" Liverpool`),
    gm: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${h.name}, ${h.addr || 'Liverpool'}`),
    am: bing(`site:amberstudent.com "${h.name}" Liverpool`)
  });
  const REC_URL = { police: 'https://www.police.uk/', epc: 'https://www.gov.uk/find-energy-certificate', hmo: 'https://liverpool.gov.uk/' };
  const a = (cls, text, href) => { const x = el('a', cls, text); x.href = href; x.target = '_blank'; x.rel = 'noopener'; return x; };

  let tab = 'rev';
  function open(h, which) {
    const k = w(); if (which) tab = which; if (!h) tab = 'rank';
    const m = BT.modal({ eyebrow: k.eyebrow, title: h ? h.name : k.title }); m.box.classList.add('rv-box');
    const tabs = el('div', 'br-tabs'); tabs.setAttribute('role', 'tablist');
    const go = id => {
      tab = id; tabs.querySelectorAll('.br-tab').forEach(x => x.setAttribute('aria-selected', String(x.dataset.id === id)));
      m.body.replaceChildren(); m.foot.replaceChildren(); m.body.scrollTop = 0;
      if (id === 'rev') drawReviews(m, h); else if (id === 'rec') drawRecords(m, h); else drawRank(m);
    };
    (h ? [['rev', k.tabRev], ['rec', k.tabRec], ['rank', k.tabRank]] : [['rank', k.tabRank]]).forEach(([id, label]) => {
      const b = btn('br-tab', label); b.dataset.id = id; b.setAttribute('role', 'tab'); b.addEventListener('click', () => go(id)); tabs.append(b);
    });
    m.box.insertBefore(tabs, m.body);
    go(tab);
  }
  function drawReviews(m, h) {
    const k = w(), head = el('section', 'rv-head rv-one');
    if (h.rn) {
      const big = el('div', 'rv-big'); big.append(el('small', '', k.rating), el('strong', '', Number(h.rr).toFixed(1)), el('span', 'rv-stars', stars(h.rr)), el('small', '', fmt(k.nRev, { n: h.rn })));
      head.append(big, el('p', 'rv-src', k.ratingSrc));
    } else head.append(el('p', 'bt-note', k.noRating));
    m.body.append(head);
    const out = el('section', 'rv-out'); out.append(el('b', 'rv-h', k.outH));
    const L = links(h);
    ['sc', 'gm', 'am'].forEach(id => {
      const [name, desc] = k.sites[id], row = a('rv-link', '', L[id]);
      const t = el('span'); t.append(el('b', '', name), el('small', '', desc)); row.append(t, el('em', '', k.open)); out.append(row);
    });
    out.append(el('p', 'bt-note', k.outNote));
    m.body.append(out);
  }
  function drawRecords(m, h) {
    const k = w(), pc = postcodeOf(h), box = el('div', 'rv-recs');
    box.append(el('p', 'bt-lede', k.recLede));
    if (pc) {
      const row = el('div', 'rv-pc'), cp = btn('bt-chipbtn', k.copyPc);
      cp.addEventListener('click', async () => { if (await BT.copy(pc)) { cp.textContent = k.copied; setTimeout(() => { cp.textContent = k.copyPc; }, 1300); } });
      row.append(el('b', '', fmt(k.postcode, { p: pc })), cp); box.append(row);
    }
    const ids = ['police', 'epc'].concat(/houses/.test(h.id) ? ['hmo'] : []);
    ids.forEach(id => {
      const [title, src, desc] = k.recs[id], c = a('rv-link rv-rec', '', REC_URL[id]);
      const t = el('span'); t.append(el('b', '', title), el('small', '', desc), el('small', 'rv-src', src)); c.append(t, el('em', '', k.open)); box.append(c);
    });
    m.body.append(box);
  }
  function drawRank(m) {
    const k = w(), box = el('div', 'rv-rank');
    box.append(el('p', 'bt-lede', k.rankLede));
    const ol = el('ol', 'rv-rlist');
    homes().filter(h => h.rn >= 5 && h.rr).sort((x, y) => y.rr - x.rr || y.rn - x.rn).slice(0, 20).forEach((h, i) => {
      const li = el('li'), b = btn('qc-home'), s = el('span');
      s.append(el('b', '', (i + 1) + '. ' + h.name), el('small', '', fmt(k.nRev, { n: h.rn })));
      b.append(s, el('span', 'qc-p', Number(h.rr).toFixed(1) + ' ★'));
      b.addEventListener('click', () => open(h, 'rev')); li.append(b); ol.append(li);
    });
    box.append(ol, el('p', 'rv-src', k.rankSrc));
    m.body.append(box);
  }

  BT.add({
    id: 'reviews', order: 3,
    card: h => ({ title: w().title, desc: w().desc, mini: h.rn ? fmt(w().mini, { s: Number(h.rr).toFixed(1) + '★' }) : w().miniNone, cls: 'bt-chipbtn' }),
    intro: () => w().intro,
    open: h => open(h)
  });
  window.Reviews = { open, links };
})();
