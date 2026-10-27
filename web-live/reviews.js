/* 评价与公开记录：只放有出处的信息，每一项都写明来源，点链接去原网站看。
   - 评分：地图里记录的 Amber 评分和评价数（2026-10-17 快照，和公寓卡片上的同一份数据）。
   - 去权威网站看完整评价：StudentCrowd（只收学校邮箱验证过的学生评价）、Google 地图评价、Amber 页面。
     StudentCrowd 直接打开这栋楼的页面（下面 SC 表）；Amber 用 Google 站内搜索打开。
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
        sc: ['StudentCrowd', '英国学生评价网站，只收学校邮箱验证过的学生评价，按性价比、位置、保洁、Wi-Fi、管理等打分'], scCity: 'StudentCrowd 上还没有这栋楼的页面，先打开利物浦的公寓列表',
        gm: ['Google 地图评价', '住户和访客的评价与照片'],
        am: ['Amber Student', '本站评分的来源页面，可以看到逐条评价']
      },
      recLede: '这些是英国政府和警方公开的数据。本站不转载，只给你入口和这栋楼的邮编，点进去自己查。',
      postcode: '这栋楼的邮编：{p}', copyPc: '复制邮编', copied: '已复制',
      recs: {
        police: ['🚓 周边治安', 'police.uk（英国警方官网）', '输入邮编，可以看到附近每个月登记的案件数量和类别'],
        epc: ['🔥 能耗证书（EPC）', 'GOV.UK Find an energy certificate', '输入邮编查能耗等级，等级越高（A 最好）冬天越省暖气费；大型学生公寓有时整栋按非住宅登记'],
        hmo: ['📄 合租房执照（HMO）', '利物浦市议会（Liverpool City Council）', '多人合租的房子需要 HMO 执照，签约前可以查是否登记']
      },
      src2: {
        am: { logo: 'Amber', name: 'Amber Student', when: '评分来自 Amber 公寓页面（2026 年 10 月 17 日记录），不是实时数据。' },
        sc: { logo: 'SC', name: 'StudentCrowd', desc: '英国学生评价网站，只收学校邮箱验证过的学生评价，按性价比、位置、保洁、Wi-Fi、管理等打分。' }
      },
      fromSite: '评价来自 {s}', goSite: '去 {s} 看全部 ↗', viaSite: '摘自 {s}', sampleTag: '排版示例', copyright: '评价内容来自 {s}，版权归原网站；上面的摘录目前是排版示例，正式版显示原网站的真实评价。', moreMaps: '还可以看',
      open: '打开 ↗', rankLede: '按记录的评分排（至少 5 条评价才上榜）。', rankSrc: '来源：Amber 公寓页面（2026 年 10 月 17 日记录）。', rankOpen: '查看'
    },
    en: {
      intro: '🏅 Reviews & public records', title: '🏅 Reviews & records', desc: 'Sourced ratings + links to trusted sites', mini: '🏅 Rated {s}', miniNone: '🏅 Reviews & records',
      eyebrow: 'Reviews & public records', tabRev: 'Reviews', tabRec: 'Official records', tabRank: 'Rankings',
      rating: 'Recorded rating', nRev: '{n} reviews', noRating: 'No rating recorded for this building yet; try the sites below.',
      ratingSrc: 'Source: the building’s Amber page (recorded 17 October 2026), not live data.',
      outH: 'Read full reviews on trusted sites', outNote: 'These links open external sites; what they say is what counts. We do not copy reviews.',
      sites: {
        sc: ['StudentCrowd', 'UK student review site that only accepts reviews from students verified by university email, scored on value, location, cleaning, Wi-Fi, management and more'], scCity: 'StudentCrowd has no page for this building yet; opens the Liverpool list',
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
      src2: {
        am: { logo: 'Amber', name: 'Amber Student', when: 'Rating from the building’s Amber page (recorded 17 October 2026), not live data.' },
        sc: { logo: 'SC', name: 'StudentCrowd', desc: 'UK student review site that only accepts reviews from students verified by university email, scored on value, location, cleaning, Wi-Fi, management and more.' }
      },
      fromSite: 'Reviews from {s}', goSite: 'See all on {s} ↗', viaSite: 'from {s}', sampleTag: 'Layout sample', copyright: 'Reviews come from {s}, which owns them. The excerpts above are layout samples; the live version shows real reviews from the site.', moreMaps: 'Also see',
      open: 'Open ↗', rankLede: 'Ranked by recorded rating (at least 5 reviews).', rankSrc: 'Source: building pages on Amber (recorded 17 October 2026).', rankOpen: 'View'
    }
  };
  const w = () => pick(W);
  const homes = () => { try { return HOMES; } catch (_) { return []; } };
  const stars = v => '★★★★★'.slice(0, Math.round(v)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(v));
  const postcodeOf = h => (/[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}/i.exec(h.addr || '') || [''])[0].toUpperCase();
  /* StudentCrowd 每栋楼的页面（2026-10-27 通过搜索核对）；没有页面的楼打开 StudentCrowd 的利物浦公寓列表 */
  const SC = {
    'iq-great-newton-house': 's1045272-iq-great-newton-house-liverpool',
    'capital-gate': 's1043653-capital-gate-liverpool',
    'pembroke-studios': 's1049399-pembroke-studios-liverpool',
    'albert-court': 's1045099-albert-court-liverpool',
    'st-andrews-gardens': 's1044943-st-andrews-gardens-liverpool',
    'windsor-court': 's1044942-windsor-court-liverpool',
    'plato-house': 's1045243-plato-house-liverpool',
    'one-islington-plaza': 's1045607-one-islington-plaza-liverpool',
    'innovo-house': 's1055210-innovo-house-liverpool',
    'calico': 's1046004-calico-liverpool',
    'lennon-studios': 's1045881-lennon-studios-liverpool',
    'hope-street': 's1046061-hope-street-liverpool',
    'haigh-court': 's1044940-haigh-court-liverpool',
    'maple-house': 's1045913-maple-house-liverpool',
    'the-electra': 's1045139-the-electra-liverpool',
    'chatham-lodge': 's1045917-chatham-lodge-liverpool',
    'hayward-house': 's1045916-hayward-house-liverpool',
    'the-hahnemann-building': 's1045620-the-hahnemann-building-liverpool',
    'fusion-liverpool': 's1116067-fusion-liverpool-liverpool',
    'the-arch': 's1045093-the-arch-liverpool',
    'benson-yard': 's1101484-benson-yard-liverpool',
    'grand-central': 's1043654-grand-central-liverpool',
    'horizon-heights': 's1049122-horizon-heights-liverpool',
    'the-lantern': 's1045600-the-lantern-liverpool',
    'iconinc-the-ascent': 's1045526-iconinc-the-ascent-liverpool',
    'byrom-point': 's1045374-byrom-point-liverpool',
    'vita-student-crosshall-street': 's1044952-vita-student-liverpool-crosshall-st-liverpool',
    'the-bridewell': 's1049496-the-bridewell-liverpool',
    'marybone-student-village': 's1043655-marybone-1-liverpool',
    'moorfield': 's1043659-moorfield-liverpool',
    'yugo-ablett-house': 's1045250-ablett-house-liverpool',
    'atlantic-point': 's1043648-atlantic-point-liverpool',
    'glassworks': 's1045327-glassworks-liverpool',
    'europa': 's1043651-europa-liverpool',
    'prospect-point': 's1043657-prospect-point-liverpool',
    'true-liverpool': 's1055205-true-liverpool-liverpool',
    'unity-square': 's1051988-unity-square-liverpool',
    'city-point': 's1049563-city-point-liverpool',
    'phoenix-place': 's1045614-phoenix-place-liverpool',
    'paddington-park-house': 's1045280-paddington-park-house-liverpool',
    'the-railyard': 's1045112-the-railyard-liverpool',
    'queensland-place': 's1054734-queensland-place-liverpool'
  };
  const SC_CITY = 'https://www.studentcrowd.com/student-accommodation-l1003919-liverpool';
  /* Amber 每栋楼的页面（2026-10-27 通过搜索核对）；没有的用 Google 站内搜索 */
  const AM = {
    'iq-great-newton-house': 'iq-great-newton-house-liverpool-1608304787060',
    'capital-gate': 'capital-gate-liverpool-1805181274399',
    'pembroke-studios': 'pembroke-studios-liverpool-2312084927246',
    'albert-court': 'albert-court-liverpool-1708313372308',
    'st-andrews-gardens': 'st-andrews-gardens-liverpool-1608300954368',
    'windsor-court': 'windsor-court-liverpool-1608300118755',
    'plato-house': 'plato-house-liverpool-1907092608404',
    'one-islington-plaza': 'one-islington-plaza-liverpool-1904197662379',
    'shamrock-house': 'shamrock-house-liverpool-2602175567266',
    'innovo-house': 'innovo-house-liverpool-2408091670454',
    'calico': 'calico-liverpool-1903075725801',
    'lennon-studios': 'lennon-studios-liverpool-1710235109897',
    'hope-street': 'hope-street-apartments-1608303656939',
    'haigh-court': 'haigh-court-1712093876177',
    'the-electra': 'the-electra-liverpool-1608304352045',
    'chatham-lodge': 'chatham-lodge-liverpool-2604141742477',
    'hayward-house': 'hayward-house-liverpool-2604141954830',
    'fusion-liverpool': 'fusion-liverpool-liverpool-2501292534399',
    'the-arch': 'the-arch-liverpool-1608300157225',
    'benson-yard': 'benson-yard-liverpool-2303310251551',
    'grand-central': 'grand-central-liverpool-1710239775834',
    'horizon-heights': 'horizon-heights-liverpool-1902159623509',
    'the-lantern': 'the-lantern-liverpool-1802071640404',
    'iconinc-the-ascent': 'the-ascent-liverpool-1805077073045',
    'byrom-point': 'byrom-point-liverpool-1608306844687',
    'vita-student-crosshall-street': 'vita-student-crosshall-street-liverpool-1608304728969',
    'the-bridewell': 'the-bridewell-liverpool-2105215018814',
    'marybone-student-village': 'marybone-1-liverpool-2505058433552',
    'moorfield': 'moorfield-liverpool-2002141197351',
    'yugo-ablett-house': 'ablett-house-1608308330826',
    'atlantic-point': 'atlantic-point-liverpool-2002135955868',
    'glassworks': 'glassworks-liverpool-1912183989486',
    'europa': 'europa-liverpool-1608302250167',
    'prospect-point': 'prospect-point-liverpool-2002134204705',
    'true-liverpool': 'true-liverpool-2011117953561',
    'unity-square': 'unity-square-liverpool-2102097289359',
    'city-point': 'city-point-liverpool-2105217197377',
    'phoenix-place': 'phoenix-place-liverpool-2312144200606',
    'poets-place': 'poets-place-liverpool-2605196272100',
    'paddington-park-house': 'paddington-park-house-liverpool-2002130098795',
    'the-railyard': 'the-railyard-liverpool-1805189329851',
    'queensland-place': 'queensland-place-2101309236510'
  };
  const google = q => 'https://www.google.com/search?q=' + encodeURIComponent(q);
  const links = h => ({
    sc: SC[h.id] ? 'https://www.studentcrowd.com/hall-l1003919-' + SC[h.id] : SC_CITY,
    gm: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${h.name}, ${h.addr || 'Liverpool'}`),
    am: AM[h.id] ? 'https://amberstudent.com/places/' + AM[h.id] : google(`site:amberstudent.com "${h.name}" Liverpool`)
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
  /* 评价摘录的排版示例：正式版换成原网站授权的真实评价（按公寓编号生成，每次一样） */
  const SAMPLE = {
    zh: ['前台很友好，报修第二天就有人来。', '走路去上课十分钟，下雨天也不怕。', '公共区域每周打扫，厨房还算干净。', '房间隔音不错，考试周能睡好。', '有自习室和电影室，周末经常有活动。', '晚上高峰时网速会慢一点。'],
    en: ['Reception is friendly; repairs were done the next day.', 'Ten minutes’ walk to lectures, fine even in the rain.', 'Common areas are cleaned weekly; the kitchen stays fairly clean.', 'Good soundproofing, I could sleep during exams.', 'There is a study room and cinema room, with events most weekends.', 'Wi-Fi slows down a bit in the evening.']
  };
  const hash = s => [...String(s)].reduce((x, c) => (x * 31 + c.charCodeAt(0)) >>> 0, 7);
  function samples(h, src) { const lst = SAMPLE[BT.lang() === 'zh' ? 'zh' : 'en'], i = hash(h.id) % lst.length + (src === 'sc' ? 3 : 0); return [lst[i % lst.length], lst[(i + 1) % lst.length]]; }   // 两个来源各取不同的两句
  /* 一个来源一块：顶部醒目写明来自哪个网站 + 直达链接，里面是评分和评价摘录 */
  function sourcePanel(h, src, url, k) {
    const S = k.src2[src], box = el('section', 'rv-srcp rv-' + src), top = el('header', 'rv-srctop');
    const who = el('div', 'rv-who2'); who.append(el('span', 'rv-logo', S.logo), el('span', '', fmt(k.fromSite, { s: S.name })));
    top.append(who, a('bt-btn rv-go', fmt(k.goSite, { s: S.name }), url));
    box.append(top);
    const body = el('div', 'rv-srcbody');
    if (src === 'am' && h.rn) {
      const big = el('div', 'rv-big'); big.append(el('strong', '', Number(h.rr).toFixed(1)), el('span', 'rv-stars', stars(h.rr)), el('small', '', fmt(k.nRev, { n: h.rn })));
      body.append(big, el('p', 'rv-src', S.when));
    } else body.append(el('p', 'rv-srcdesc', S.desc));
    box.append(body);
    const ex = el('div', 'rv-ex');
    samples(h, src).forEach(t => { const c = el('blockquote', 'rv-q'); c.append(el('span', 'rv-sample', k.sampleTag), el('p', '', t), el('cite', '', '— ' + fmt(k.viaSite, { s: S.name }))); ex.append(c); });
    box.append(ex, el('p', 'rv-src', fmt(k.copyright, { s: S.name })));
    return box;
  }
  function drawReviews(m, h) {
    const k = w(), L = links(h);
    m.body.append(sourcePanel(h, 'am', L.am, k), sourcePanel(h, 'sc', L.sc, k));
    const more = el('p', 'rv-more'); more.append(k.moreMaps + ' '); more.append(a('', k.sites.gm[0] + ' ↗', L.gm)); m.body.append(more);
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

  if (!window.LocalPanel) BT.add({   // 有「周边与评价」面板时，这里只提供 Amber / StudentCrowd 的直达链接（Reviews.links）
    id: 'reviews', order: 3,
    card: h => ({ title: w().title, desc: w().desc, mini: h.rn ? fmt(w().mini, { s: Number(h.rr).toFixed(1) + '★' }) : w().miniNone, cls: 'bt-chipbtn' }),
    intro: () => w().intro,
    open: h => open(h)
  });
  window.Reviews = { open, links };
})();
