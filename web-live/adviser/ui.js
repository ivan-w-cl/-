/* 复制自 web-demo/js/ui.js。两端共用的小工具：转义、文案、时间、二维码、提示条。 */
(function (root) {
  'use strict';
  const { i18n } = root.Core;
  const D = root.DemoData;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = i18n.fmt;
  const T = lang => Object.assign({}, i18n.dict(lang), D.EXT[lang === 'en' ? 'en' : 'zh']);
  const A = lang => D.ADMIN[lang === 'en' ? 'en' : 'zh'];
  const L = (o, lang) => o ? (lang === 'en' ? o.en : o.zh) : '';

  function ago(at, lang) {
    const a = A(lang), m = Math.max(1, Math.round((Date.now() - at) / 6e4));
    if (m < 60) return fmt(a.minutes, { n: m });
    if (m < 60 * 24) return fmt(a.hours, { n: Math.round(m / 60) });
    return fmt(a.days, { n: Math.round(m / 1440) });
  }
  function clock(at) { const d = new Date(at); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }

  function qrSvg(text, cell) {
    try {
      const q = root.qrcode(0, 'M'); q.addData(text); q.make();
      return q.createSvgTag({ cellSize: cell || 4, margin: 2, scalable: true });
    } catch (e) { return ''; }
  }

  let toastTimer;
  function toast(msg, host) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.hidden = false; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.classList.remove('show'); }, 2600);
  }

  /* 一张房源卡里用到的价格："£152/周起" */
  function fromPrice(h, lang) {
    const t = T(lang), vals = [h.pe, h.ps, h.plo].filter(Boolean);
    return vals.length ? fmt(t.fromWeek, { v: Math.min.apply(null, vals) }) : t.noPrice;
  }
  function campusName(id, lang) {
    const c = root.Core.createCore(root.Core.HM.HOMES, { lang });
    return lang === 'en' ? (c.CAMPUSES[id] || c.CAMPUSES.unsure)[0] : (c.CAMPUS_ZH[id] || c.CAMPUS_ZH.unsure);
  }
  root.UI = { esc, fmt, T, A, L, ago, clock, qrSvg, toast, fromPrice, campusName };
})(typeof globalThis !== 'undefined' ? globalThis : this);
