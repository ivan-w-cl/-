/* iPad 横屏：地图两边各有一个面板，地图只剩中间一小块。触屏平板横屏时「找公寓」面板默认收起（点「展开」再打开），
   让地图更宽；电脑（有鼠标）和手机不受影响。iPad 竖屏用手机版布局，见各文件里的 (orientation: portrait) and (hover: none) 规则。 */
(() => {
  'use strict';
  const tabletLand = matchMedia('(hover: none) and (orientation: landscape) and (min-width: 1000px) and (max-width: 1400px) and (min-height: 600px)');
  const KEY = 'lsm-tablet-filters-v1';
  if (!tabletLand.matches) return;
  let pref = null; try { pref = localStorage.getItem(KEY); } catch (_) { /* 不记也行 */ }
  const btn = document.querySelector('.pbtn.collapse[data-panel="controls"]'), panel = document.getElementById('controls');
  if (!btn || !panel) return;
  if (pref !== 'open' && !panel.classList.contains('collapsed')) btn.click();
  /* 记住用户自己的选择 */
  btn.addEventListener('click', () => setTimeout(() => { try { localStorage.setItem(KEY, panel.classList.contains('collapsed') ? 'closed' : 'open'); } catch (_) { /* 忽略 */ } }));
})();
