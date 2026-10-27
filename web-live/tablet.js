/* 平板（iPad 横竖屏、iPhone Duo 内屏：有触屏、屏幕短边 ≥ 700）：地图两边各有一个面板，地图只剩中间一小块。
   「找公寓」面板默认收起（点「展开」再打开），竖屏时「公寓列表」也默认收起，让地图更宽；记住用户自己的选择。
   电脑（没有触屏）和手机不受影响。平板的其他布局见 home-insights.css 的「平板」部分。 */
(() => {
  'use strict';
  const tablet = (navigator.maxTouchPoints > 0 || matchMedia('(any-pointer: coarse)').matches) && Math.min(innerWidth, innerHeight) >= 700 && Math.max(innerWidth, innerHeight) <= 1500;
  const KEY = 'lsm-tablet-filters-v1';
  if (!tablet) return;
  let pref = null; try { pref = localStorage.getItem(KEY); } catch (_) { /* 不记也行 */ }
  const btn = document.querySelector('.pbtn.collapse[data-panel="controls"]'), panel = document.getElementById('controls');
  if (!btn || !panel) return;
  if (pref !== 'open' && !panel.classList.contains('collapsed')) btn.click();
  /* 记住用户自己的选择 */
  btn.addEventListener('click', () => setTimeout(() => { try { localStorage.setItem(KEY, panel.classList.contains('collapsed') ? 'closed' : 'open'); } catch (_) { /* 忽略 */ } }));
  /* 竖屏：「公寓列表」也先收起（地图只有 700–1000 宽），点「展开」再打开 */
  const KEY2 = 'lsm-tablet-homes-v1', hb = document.querySelector('.pbtn.collapse[data-panel="homesPanel"]'), hp = document.getElementById('homesPanel');
  let pref2 = null; try { pref2 = localStorage.getItem(KEY2); } catch (_) { /* 不记也行 */ }
  if (hb && hp && innerHeight > innerWidth && pref2 !== 'open' && !hp.classList.contains('collapsed')) hb.click();
  if (hb && hp) hb.addEventListener('click', () => setTimeout(() => { try { localStorage.setItem(KEY2, hp.classList.contains('collapsed') ? 'closed' : 'open'); } catch (_) { /* 忽略 */ } }));
})();
