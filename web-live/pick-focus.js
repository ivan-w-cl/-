/* 生活选房（和留学人格测试）的结果在地图上会把非推荐的公寓调淡（#mapbox.hm-on）。
   当学生点开一处不在推荐里的公寓时，说明他在自己逛了：地图上所有公寓恢复正常不透明。
   想再看推荐时，点「生活选房卡」重新打开结果，home-match.js 会照常把非推荐公寓调淡。其他行为不变。 */
(() => {
  'use strict';
  const mapbox = document.getElementById('mapbox'), cardBody = document.getElementById('cardBody');
  if (!mapbox || !cardBody) return;
  function check() {
    let h = null; try { h = current && current.t === 'home' ? current : null; } catch (_) { return; }
    if (!h || !mapbox.classList.contains('hm-on')) return;
    const fq = window.FunQuizzes && window.FunQuizzes.activeIds();
    const picks = fq && fq.length ? fq : (window.HomeMatch ? window.HomeMatch.getState().homeIds || [] : []);
    if (picks.length && !picks.includes(h.id)) mapbox.classList.remove('hm-on');
  }
  new MutationObserver(check).observe(cardBody, { childList: true });
})();
