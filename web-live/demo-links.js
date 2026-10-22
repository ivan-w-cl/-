/* 演示入口：在地图的「i」说明里放顾问后台和两端流程演示的链接，不改变页面布局。正式上线时删除本文件即可。 */
(() => {
  'use strict';
  const pop = document.getElementById('infopop'); if (!pop) return;
  const p = document.createElement('p'); p.className = 'demo-links';
  p.innerHTML = '演示 Demo：<a href="./adviser.html">订房专家后台 Adviser console</a> · <a href="./handoff-demo.html">两端流程演示 Two-sided demo</a>';
  pop.append(p);
})();
