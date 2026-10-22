/* 「我的专业」下拉框换成地图同款的手绘样式，不再用 iOS / Android 原生的滚轮选择器。
   原 <select id="subject"> 保留在页面里并继续驱动原有逻辑（只是视觉上隐藏），这里只负责显示和选择：
   选中后改写 select.value 并派发 change 事件。语言切换重建选项时，按钮文字自动跟着更新。 */
(() => {
  'use strict';
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  let uid = 0;

  function enhance(select) {
    if (!select || select.dataset.fancy) return;
    select.dataset.fancy = '1';
    const id = 'fs' + (++uid);
    const wrap = el('div', 'fs'), button = el('button', 'fs-btn'), text = el('span', 'fs-text'), caret = el('span', 'fs-caret', '▾');
    const list = el('div', 'fs-list'); list.id = id + '-list'; list.setAttribute('role', 'listbox'); list.hidden = true; list.tabIndex = -1;
    button.type = 'button'; button.setAttribute('aria-haspopup', 'listbox'); button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-controls', list.id);
    button.append(text, caret); wrap.append(button, list);
    select.classList.add('fs-native'); select.tabIndex = -1; select.setAttribute('aria-hidden', 'true');
    const label = select.id && document.querySelector(`label[for="${select.id}"]`);
    // Keep the new control outside the <label>: a tap on anything inside a label "activates" the hidden native
    // select, which on iPhone opens the system wheel picker on top of this list.
    if (label && label.contains(select)) { label.after(wrap); label.classList.add('fs-label'); } else select.after(wrap);
    if (label) { label.addEventListener('click', e => { e.preventDefault(); button.focus(); }); const span = label.querySelector('span'); if (span) { span.id = span.id || id + '-label'; button.setAttribute('aria-labelledby', span.id + ' ' + id + '-text'); text.id = id + '-text'; list.setAttribute('aria-labelledby', span.id); } }

    let items = [], active = -1;
    function build() {
      list.replaceChildren(); items = [];
      [...select.children].forEach(node => {
        if (node.tagName === 'OPTGROUP') { list.append(el('div', 'fs-group', node.label)); [...node.children].forEach(add); }
        else add(node);
      });
      sync();
    }
    function add(opt) {
      const item = el('div', 'fs-opt', opt.textContent); item.setAttribute('role', 'option'); item.id = id + '-o' + items.length;
      item.dataset.value = opt.value; if (opt.disabled) item.setAttribute('aria-disabled', 'true');
      if (opt.value === '') item.classList.add('fs-placeholder');
      item.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); if (!opt.disabled) choose(opt.value); });
      item.addEventListener('pointermove', () => mark(items.indexOf(item)));
      list.append(item); items.push(item);
    }
    function sync() {
      const opt = select.options[select.selectedIndex];
      text.textContent = opt ? opt.textContent : '';
      button.classList.toggle('fs-empty', !opt || opt.value === '');
      items.forEach(i => i.setAttribute('aria-selected', String(i.dataset.value === select.value)));
    }
    function mark(i) {
      if (i < 0 || i >= items.length) return;
      items.forEach(n => n.classList.remove('active')); active = i; items[i].classList.add('active');
      list.setAttribute('aria-activedescendant', items[i].id); items[i].scrollIntoView({ block: 'nearest' });
    }
    function open() {
      if (!list.hidden) return;
      list.hidden = false; button.setAttribute('aria-expanded', 'true'); wrap.classList.add('open');
      const cur = items.findIndex(i => i.dataset.value === select.value);
      mark(cur >= 0 ? cur : items.findIndex(i => i.getAttribute('aria-disabled') !== 'true'));
      list.focus({ preventScroll: true });
    }
    function close(focus) { if (list.hidden) return; list.hidden = true; button.setAttribute('aria-expanded', 'false'); wrap.classList.remove('open'); if (focus) button.focus({ preventScroll: true }); }
    function choose(value) {
      if (select.value !== value) { select.value = value; select.dispatchEvent(new Event('input', { bubbles: true })); select.dispatchEvent(new Event('change', { bubbles: true })); }
      sync(); close(true);
    }
    function step(d) { let i = active; do { i += d; } while (i >= 0 && i < items.length && items[i].getAttribute('aria-disabled') === 'true'); mark(Math.max(0, Math.min(items.length - 1, i))); }
    button.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); if (list.hidden) open(); else close(true); });
    button.addEventListener('keydown', e => { if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); open(); } });
    list.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); step(-1); }
      else if (e.key === 'Home') { e.preventDefault(); mark(0); }
      else if (e.key === 'End') { e.preventDefault(); mark(items.length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (items[active] && items[active].getAttribute('aria-disabled') !== 'true') choose(items[active].dataset.value); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
      else if (e.key === 'Tab') close(false);
      else if (e.key.length === 1) { const k = e.key.toLowerCase(), i = items.findIndex((n, j) => j > active && n.textContent.toLowerCase().startsWith(k)); if (i >= 0) mark(i); }
    });
    wrap.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('click', () => close(false));
    select.addEventListener('change', sync);
    new MutationObserver(build).observe(select, { childList: true, subtree: true, characterData: true });
    build();
  }
  function init() { enhance(document.getElementById('subject')); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.FancySelect = { enhance };
})();
