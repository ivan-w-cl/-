/* 选房卡推荐后的对比 + 排序更明显（不改原页面布局，只在原有面板里加东西）：
   1. 生活选房 / 人格测试推荐 3 处公寓后，结果卡最上面多一块「3 处速览 + 并排对比」，一键打开对比表。
   2. 「排序方式」从「找公寓」面板移到「公寓列表」顶部（排序本来就只作用于这个列表）；排序后列表每行前面显示名次，
      地图上前 3 名的房子挂金色名次标签。地图上的蓝色编号是固定房源编号，不随排序变。 */
(() => {
  'use strict';
  const T = {
    zh: { cmpH: '推荐的 {n} 处，一眼对比', cmpGo: '并排对比这 {n} 处', from: '£{p}/周起', noPrice: '暂无价格', uol: '到利大 {m} 分钟', rate: '{r}★',
          sortedBy: '已按「{k}」排序', topNote: '地图上的金色标签是前 3 名。', rank: ['第1', '第2', '第3'] },
    en: { cmpH: 'Your {n} picks at a glance', cmpGo: 'Compare these {n} side by side', from: 'From £{p}/wk', noPrice: 'No price yet', uol: 'UoL {m} min', rate: '{r}★',
          sortedBy: 'Sorted by “{k}”', topNote: 'Gold tags on the map mark the top 3.', rank: ['1st', '2nd', '3rd'] },
    ja: { cmpH: 'おすすめ {n} 件をひと目で比較', cmpGo: 'この {n} 件を並べて比較', from: '£{p}/週〜', noPrice: '家賃未登録', uol: 'リバプール大学まで {m} 分', rate: '{r}★',
          sortedBy: '「{k}」で並べ替え中', topNote: '地図の金色タグが上位3件です。', rank: ['1位', '2位', '3位'] }
  };
  const L = () => { try { return T[LANG] ? LANG : 'zh'; } catch (_) { return 'zh'; } };
  const k = () => T[L()];
  const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (_, x) => o[x]);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let H; try { H = HOMES; } catch (_) { return; }
  const byName = name => H.find(h => h.name === name);

  /* ---------- 1. 推荐结果：速览 + 并排对比 ---------- */
  function decorate(body) {
    if (!body || body.querySelector('.pc-box')) return;
    const cards = [...body.querySelectorAll('.mcard')];
    const picks = cards.map(c => byName((c.querySelector('h3') || {}).textContent || '')).filter(Boolean);
    if (picks.length < 2) return;
    const K = k(), box = document.createElement('section');
    box.className = 'pc-box';
    box.innerHTML = `<b class="pc-h">${esc(fmt(K.cmpH, { n: picks.length }))}</b>
      <div class="pc-cols" style="--n:${picks.length}">${picks.map((h, i) => `<div class="pc-col${i === 0 ? ' top' : ''}"><span class="pc-rank">${i + 1}</span><b>${esc(h.name)}</b>
        <span class="pc-v">${h.plo ? esc(fmt(K.from, { p: h.plo })) : esc(K.noPrice)}</span><span class="pc-v">${esc(fmt(K.uol, { m: h.uol }))}</span>${h.rn ? `<span class="pc-v">${esc(fmt(K.rate, { r: Number(h.rr).toFixed(1) }))}</span>` : ''}</div>`).join('')}</div>
      <button type="button" class="pc-go">⚖️ ${esc(fmt(K.cmpGo, { n: picks.length }))}</button>`;
    box.querySelector('.pc-go').addEventListener('click', e => {
      try { compare.clear(); picks.forEach(h => compare.add(h.id)); syncCompare(); openCompare(e.currentTarget); } catch (_) { /* 原页面的对比表不可用 */ }
    });
    cards[0].before(box);
  }
  ['hmResBody', 'fqResBody'].forEach(id => {
    const watch = () => {
      const body = document.getElementById(id); if (!body) return false;
      new MutationObserver(() => decorate(body)).observe(body, { childList: true });
      decorate(body); return true;
    };
    if (!watch()) { const mo = new MutationObserver(() => { if (watch()) mo.disconnect(); }); mo.observe(document.body, { childList: true, subtree: true }); }
  });

  /* ---------- 2. 排序放到公寓列表顶部 + 名次 ---------- */
  const rankLabel = document.querySelector('label[for="rank"]'), panel = document.getElementById('homesPanel'), groups = document.getElementById('groups');
  const sel = document.getElementById('rank');
  if (!rankLabel || !panel || !groups || !sel) return;
  const bar = document.createElement('div'); bar.className = 'pc-sort';
  const note = document.createElement('p'); note.className = 'pc-sortnote'; note.setAttribute('role', 'status');
  rankLabel.classList.add('pc-sortfield');
  bar.append(rankLabel, note);
  const search = panel.querySelector('.home-search');
  (search || panel.querySelector('.pbody')).after(bar);

  const NS = 'http://www.w3.org/2000/svg';
  function mapTags(top) {
    document.querySelectorAll('.pc-tag').forEach(n => n.remove());
    top.forEach((h, i) => {
      const host = h.visualEl; if (!host) return;
      const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'pc-tag'); g.setAttribute('aria-hidden', 'true');
      const r = document.createElementNS(NS, 'rect'), t = document.createElementNS(NS, 'text');
      const label = k().rank[i], w = 16 + label.length * (L() === 'en' ? 10 : 15);
      Object.entries({ x: -w / 2 - 4, y: -58, width: w, height: 24, rx: 12 }).forEach(([a, v]) => r.setAttribute(a, v));
      Object.entries({ x: -4, y: -40.5 }).forEach(([a, v]) => t.setAttribute(a, v));
      t.textContent = label; g.append(r, t); host.append(g);
    });
  }
  function refresh() {
    let key = 'area'; try { key = rankKey; } catch (_) { /* 原页面变量不可用 */ }
    const ranked = key !== 'area' && key !== 'az';
    panel.classList.toggle('pc-ranked', ranked);
    groups.querySelectorAll('.rlist > li').forEach((li, i) => { li.dataset.rank = ranked ? String(i + 1) : ''; });
    let top = [];
    if (ranked) { try { top = visibleHomes().slice(0, 3); } catch (_) { top = []; } }
    mapTags(top);
    const opt = sel.options[sel.selectedIndex];
    note.textContent = ranked && opt ? `${fmt(k().sortedBy, { k: opt.textContent })} · ${k().topNote}` : '';
  }
  new MutationObserver(refresh).observe(groups, { childList: true });
  sel.addEventListener('change', () => setTimeout(refresh));
  new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  refresh();
})();
