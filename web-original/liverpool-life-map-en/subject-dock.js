/* Subject selection reuses the map's existing data and distance calculation. */
(() => {
  'use strict';
  const copy = {
    zh:{title:'我的专业',label:'利物浦大学专业',intro:'选择专业，查看教学楼与附近公寓。',foot:'选好自动收起；点击侧边标签可随时更换。',close:'收起 ‹',selected:'已选',hint:'选专业，找教学楼。随时点这里更换。',dismiss:'关闭提示',open:'打开我的专业',current:'当前专业：'},
    en:{title:'My subject',label:'University of Liverpool subject',intro:'Find your teaching buildings and nearby homes.',foot:'Closes after choosing. Use the side tab to change it anytime.',close:'Hide ‹',selected:'Set',hint:'Choose a subject to find your buildings. Change it here anytime.',dismiss:'Dismiss tip',open:'Open my subject',current:'Current subject: '},
    ja:{title:'専攻',label:'リバプール大学の専攻',intro:'専攻を選んで校舎と近くの寮を確認。',foot:'選択後は自動で閉じます。横のタブからいつでも変更できます。',close:'閉じる ‹',selected:'選択済',hint:'専攻を選んで校舎を表示。ここでいつでも変更できます。',dismiss:'ヒントを閉じる',open:'専攻を開く',current:'選択中：'}
  };
  const byId = id => document.getElementById(id);
  const dock = byId('subjectDock'), panel = byId('subjectPanel'), toggle = byId('subjectToggle'), hint = byId('subjectHint');
  const hintKey = 'lsm-subject-tip-v1';
  let hintTimer, hintSeen = false, keyboardSelection = false;
  try {hintSeen = localStorage.getItem(hintKey) === '1';} catch (_) {}
  function dismissHint() {
    clearTimeout(hintTimer); hint.hidden = true; hintSeen = true;
    try {localStorage.setItem(hintKey, '1');} catch (_) {}
  }
  function render() {
    const c = copy[LANG === 'zh' ? 'zh' : 'en'];
    [['subjectTabLabel','title'],['subjectHeading','title'],['subjectSelectLabel','label'],['subjectIntro','intro'],['subjectFootnote','foot'],['subjectClose','close'],['subjectTabState','selected'],['subjectHintText','hint']].forEach(([id,key]) => {byId(id).textContent = c[key];});
    dock.setAttribute('aria-label', c.title);
    byId('subjectHintClose').setAttribute('aria-label', c.dismiss);
    byId('subjectTabState').hidden = !subject;
    const label = c.open + (subject ? ' · ' + c.current + subjName(subject) : '');
    toggle.setAttribute('aria-label', label); toggle.title = label;
  }
  function close(restoreFocus = false) {
    if (panel.hidden) return;
    const hadFocus = panel.contains(document.activeElement);
    panel.hidden = true; toggle.setAttribute('aria-expanded','false'); byId('subjectArrow').textContent = '›';
    if (restoreFocus || hadFocus) toggle.focus({preventScroll:true});
  }
  function open() {
    dismissHint(); closeSheets(); hide(); welcome.hidden = true;
    window.HomeMatch?.minimize();
    panel.hidden = false; toggle.setAttribute('aria-expanded','true'); byId('subjectArrow').textContent = '‹';
    subjSel.focus({preventScroll:true});
  }
  function showHint() {
    if (hintSeen || !panel.hidden || !welcome.hidden) return;
    hint.hidden = false; hintTimer = setTimeout(dismissHint, 8000);
  }
  window.SubjectDock = {render, close, open};
  toggle.addEventListener('click', () => panel.hidden ? open() : close(true));
  byId('subjectClose').addEventListener('click', () => close(true));
  byId('subjectHintClose').addEventListener('click', dismissHint);
  // The original change handler applies the subject first; then reveal its campus.
  subjSel.addEventListener('keydown', () => {keyboardSelection = true;});
  subjSel.addEventListener('pointerdown', () => {keyboardSelection = false;});
  subjSel.addEventListener('change', () => {
    render();
    if (subject && hidden.has('uni')) setLayer('uni', true);
    // Native selects can emit change for every arrow key. Keep keyboard users
    // in the picker until they choose Show on map, Hide or Escape.
    if (keyboardSelection) return;
    if (subject) {
      byId('showcampus').click();
    }
    close(true);
  });
  document.addEventListener('pointerdown', e => {
    if (!dock.contains(e.target)) {
      close();
      if (!hint.hidden) dismissHint();
    }
  }, {passive:true});
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) {e.stopPropagation(); close(true);}
  });
  // Mobile system pickers may temporarily move focus outside the document.
  dock.addEventListener('focusout', e => {if (e.relatedTarget && !dock.contains(e.relatedTarget)) close();});
  mapbox.addEventListener('wheel', () => {close(); if (!hint.hidden) dismissHint();}, {passive:true});
  byId('gotit').addEventListener('click', showHint);
  document.addEventListener('llc-language-change',render);
  render(); showHint();
})();
