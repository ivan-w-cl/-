/* 演示外框：学生 App / 顾问后台 / 并排演示 三种视图，后台语言切换，重置演示数据。 */
(function (root) {
  'use strict';
  const Store = root.Store, U = root.UI;
  const MODES = ['split', 'student', 'admin'];
  let mode = 'split', resetArmed = false;

  const COPY = {
    zh: { split: '并排演示', student: '学生 App', admin: '顾问后台', reset: '重置演示数据', confirm: '确定重置？', lang: 'EN', capS: '学生手机 App', capA: '顾问后台（网页）', brand: 'Liverpool Student Map', tag: 'Web Demo' },
    en: { split: 'Side by side', student: 'Student app', admin: 'Adviser console', reset: 'Reset demo', confirm: 'Really reset?', lang: '中文', capS: "Student's phone app", capA: 'Adviser console (web)', brand: 'Liverpool Student Map', tag: 'Web Demo' }
  };
  const c = () => COPY[Store.s.demoLang === 'en' ? 'en' : 'zh'];

  function bar() {
    const C = c(), b = document.getElementById('demobar');
    b.innerHTML = `<span class="brand">${C.brand} <small>${C.tag}</small></span>
      <div class="segs" role="tablist" aria-label="View">${MODES.map(m => `<button role="tab" aria-selected="${m === mode}" class="${m === mode ? 'on' : ''}" data-mode="${m}">${C[m]}</button>`).join('')}</div>
      <div class="tools"><button data-act="lang">${C.lang}</button><button data-act="reset" class="${resetArmed ? 'warn' : ''}">${resetArmed ? C.confirm : C.reset}</button></div>`;
    document.getElementById('capS').textContent = C.capS;
    document.getElementById('capA').textContent = C.capA;
  }
  function setMode(m, push) {
    mode = MODES.includes(m) ? m : 'split';
    document.body.dataset.mode = mode;
    try { localStorage.setItem('lsm-demo-mode', mode); } catch (e) { /* 忽略 */ }
    if (push) { try { history.replaceState(null, '', '#' + mode); } catch (e) { /* 忽略 */ } }
    bar(); root.Student.render();
  }
  function titleBadge() {
    const n = Store.s.notices.filter(x => !x.seen).length;
    document.title = (n ? '(' + n + ') ' : '') + 'Liverpool Student Map Demo';
  }

  document.getElementById('demobar').addEventListener('click', e => {
    const btn = e.target.closest('button'); if (!btn) return;
    if (btn.dataset.mode) return setMode(btn.dataset.mode, true);
    if (btn.dataset.act === 'lang') { Store.s.demoLang = Store.s.demoLang === 'en' ? 'zh' : 'en'; Store.save(); bar(); root.Admin.render(); return; }
    if (btn.dataset.act === 'reset') {
      if (!resetArmed) { resetArmed = true; bar(); setTimeout(() => { resetArmed = false; bar(); }, 3500); return; }
      resetArmed = false; Store.reset(); root.Student.reset(); root.Admin.reset(); root.Student.render(); root.Admin.render(); bar();
      U.toast(Store.s.demoLang === 'en' ? 'Demo data reset' : '演示数据已重置');
    }
  });

  root.App = { mode: () => mode };
  root.Student.mount(document.getElementById('student'));
  root.Admin.mount(document.getElementById('admin'));
  Store.on(() => { root.Student.refresh(); root.Admin.refresh(); titleBadge(); });

  let start = (location.hash || '').slice(1);
  if (!MODES.includes(start)) { try { start = localStorage.getItem('lsm-demo-mode') || ''; } catch (e) { start = ''; } }
  if (!MODES.includes(start)) start = window.innerWidth < 900 ? 'student' : 'split';
  setMode(start);
  titleBadge();
})(typeof globalThis !== 'undefined' ? globalThis : this);
