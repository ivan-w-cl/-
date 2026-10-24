/* 订房小工具的公共部分：弹窗、入口、本机存储、复制。
   报价核算器（quote-check.js）和开订提醒与订房资料卡（booking-ready.js）各自用 BookingTools.add() 注册一个工具，
   这里把入口放进公寓卡片（「展开详情」里一块「订房小工具」、收起状态下一行小按钮；工具设 details: false 就不进「展开详情」）和生活选房的开场页。
   只是加在页面上，不改原有布局；数据只存在当前浏览器。 */
(() => {
  'use strict';
  const lang = () => { try { return LANG === 'zh' ? 'zh' : 'en'; } catch (_) { return 'zh'; } };   // 日文界面先用英文
  const pick = o => o[lang()] || o.en;
  const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '');
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const btn = (cls, text) => { const b = el('button', cls, text); b.type = 'button'; return b; };
  const homeNow = () => { try { return current && current.t === 'home' ? current : null; } catch (_) { return null; } };
  const money = (v, dp = 0) => '£' + Number(v || 0).toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
  const store = key => ({
    get() { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { return null; } },
    set(v) { try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch (_) { return false; } }
  });
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) { /* 旧浏览器或没有权限：退回到选中复制 */ }
    const ta = el('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
    ta.remove(); return ok;
  }
  const say = text => { try { homeNotice(text); } catch (_) { /* 页面还没准备好 */ } };
  const T = {
    zh: { tools: '订房小工具', close: '关闭' },
    en: { tools: 'Booking tools', close: 'Close' }
  };

  /* ---------- 弹窗：同一时间只开一个 ---------- */
  const wrap = el('div', 'bt-wrap'); wrap.hidden = true;
  wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true');
  document.body.append(wrap);
  // 弹窗里的点击和按键不能冒泡到页面：页面点空白处会关掉公寓卡片，按 Esc 也会
  wrap.addEventListener('click', e => { e.stopPropagation(); if (e.target === wrap) close(); });
  wrap.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
  let lastFocus = null, onClose = null;
  function close() {
    if (wrap.hidden) return;
    wrap.hidden = true; wrap.replaceChildren();
    const f = onClose; onClose = null; if (f) f();
    if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
    refresh();
  }
  function modal({ eyebrow, title, closed }) {
    if (!wrap.hidden) { const f = onClose; onClose = null; if (f) f(); }
    else lastFocus = document.activeElement;
    onClose = closed || null;
    const box = el('div', 'bt-box'), head = el('header', 'bt-head'), titles = el('div');
    if (eyebrow) titles.append(el('p', 'bt-eyebrow', eyebrow));
    const h3 = el('h3', '', title); h3.id = 'btTitle'; titles.append(h3);
    const x = btn('x', '×'); x.setAttribute('aria-label', pick(T).close); x.addEventListener('click', close);
    head.append(titles, x);
    const body = el('div', 'bt-body'), foot = el('div', 'bt-foot');
    box.append(head, body, foot);
    wrap.setAttribute('aria-labelledby', 'btTitle');
    wrap.replaceChildren(box); wrap.hidden = false; x.focus({ preventScroll: true });
    return { box, head, body, foot, close };
  }

  /* ---------- 入口 ---------- */
  const tools = [];
  const hmBody = document.getElementById('hmBody');
  function add(tool) { tools.push(tool); tools.sort((a, b) => a.order - b.order); refresh(); }
  const cardBody = document.getElementById('cardBody');
  function decorate() {
    const h = homeNow(); if (!h || !cardBody || !tools.length) return;
    const details = cardBody.querySelector('#propertyDetails');
    const inDetails = tools.filter(t => t.details !== false);
    if (details && inDetails.length && !details.querySelector('.bt-tools')) {
      const sec = el('section', 'bt-tools'), row = el('div', 'bt-row');
      sec.append(el('h4', '', pick(T).tools));
      inDetails.forEach(t => {
        const c = t.card(h), b = btn('bt-tool' + (c.on ? ' on' : ''));
        b.append(el('b', '', c.title), el('span', '', c.desc));
        b.addEventListener('click', e => { e.stopPropagation(); t.open(h); });
        row.append(b);
      });
      sec.append(row);
      const after = details.querySelector('.rp') || details.querySelector('.txt');   // 房型与照片下面
      details.insertBefore(sec, after ? after.nextSibling : details.firstChild);
    }
    const compact = cardBody.querySelector('.compact-summary');
    if (compact && !compact.querySelector('.bt-mini')) {
      const row = el('div', 'bt-mini');
      tools.forEach(t => {
        const c = t.card(h), b = btn((c.cls || 'bt-chipbtn') + (c.on ? ' on' : ''), c.mini);
        b.addEventListener('click', e => { e.stopPropagation(); t.open(h); });
        row.append(b);
      });
      compact.append(row);
    }
  }
  /* 状态变了（比如关注了开订）就重画入口 */
  function refresh() {
    if (cardBody) cardBody.querySelectorAll('.bt-tools, .bt-mini').forEach(n => n.remove());
    if (hmBody) hmBody.querySelectorAll('.bt-entry').forEach(n => n.remove());
    decorate(); addIntro();
  }
  if (cardBody) new MutationObserver(decorate).observe(cardBody, { childList: true });

  /* 生活选房开场页：「更多好玩的测试」下面一行 */
  function addIntro() {
    const intro = hmBody && hmBody.querySelector('.hm-intro');
    if (!intro || intro.querySelector('.hm-top') || intro.querySelector('.bt-entry') || !tools.length) return;
    const box = el('div', 'bt-entry'), row = el('div', 'bt-entry-row');
    box.append(el('span', 'bt-entry-h', pick(T).tools));
    tools.forEach(t => {
      const b = btn('fq-entry-b', t.intro());
      b.addEventListener('click', e => { e.stopPropagation(); try { window.HomeMatch.exit(); } catch (_) { /* 没有生活选房模块 */ } setTimeout(() => t.open(null), 60); });
      row.append(b);
    });
    box.append(row); intro.append(box);
  }
  if (hmBody) new MutationObserver(addIntro).observe(hmBody, { childList: true });

  window.BookingTools = { add, modal, close, refresh, store, copy, say, el, btn, fmt, money, lang, pick, homeNow };
})();
