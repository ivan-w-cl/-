/* Home-finding UI. Data stays in this browser; no account or tracking service. */
'use strict';
const HOME_COPY = {
  en: {search:'Search homes', placeholder:'Name, street or fixed number…', budget:'Maximum budget / week', unlimited:'No limit', room:'Room type', any:'Any room', ensuite:'En-suite', studio:'Studio', destination:'Walking destination', uol:'University of Liverpool', ljmu:'Nearest LJMU campus', subject:'My subject buildings', walk:'Maximum estimated walk', minutes:'{n} minutes', favorites:'Saved only', save:'Save', saved:'Saved', share:'Share home', count:'{n} of 47 homes', empty:'No homes match these filters.', reset:'Reset filters', view:'View {n} homes', note:'Filters use recorded starting prices, not live availability. Unknown prices are excluded when a price or room-type filter is used.', local:'Saved homes and comparisons stay in this browser only.', full:'You already have 3 homes to compare. Remove one from the comparison tray first.', copied:'Home link copied. Your friend will open this home directly.', copyFail:'Select and copy this home link:', copyLink:'Copy link', storageFail:'This browser could not save your choices. They will last only until you leave this page.', badLink:'This home link is no longer recognised. You can search the full list.', stable:'Numbers are fixed IDs, not rankings.', filterMap:'Matching homes are shown on the map.', snapshot:'Historical listing; confirm availability', details:'Listing details'},
  zh: {search:'搜索公寓', placeholder:'输入名称、街道或固定编号…', budget:'每周预算上限', unlimited:'不限', room:'房型', any:'所有房型', ensuite:'独卫单间 En-suite', studio:'Studio 套间', destination:'步行目的地', uol:'利物浦大学', ljmu:'最近的 LJMU 校区', subject:'我的专业教学楼', walk:'预计步行时间上限', minutes:'{n} 分钟', favorites:'只看收藏', save:'收藏', saved:'已收藏', share:'分享这处公寓', count:'找到 {n} / 47 处公寓', empty:'没有符合这些条件的公寓。', reset:'重置筛选', view:'查看 {n} 处公寓', note:'按已记录的起价筛选，不代表实时有房。设置预算或房型后，缺少对应价格的房源不计入结果。', local:'收藏和对比仅保存在当前浏览器，不会同步到其他手机。', full:'最多对比 3 处。请先在下方对比栏移除一处，再添加。', copied:'房源链接已复制，朋友打开即可看到这处公寓。', copyFail:'请选择并复制这条房源链接：', copyLink:'复制链接', storageFail:'当前浏览器无法保存，离开页面后选择可能丢失。', badLink:'这条房源链接已无法识别，可在完整列表中搜索。', stable:'编号是固定房源编号，不随排序改变。', filterMap:'地图同步显示符合条件的公寓。', snapshot:'历史房源记录，请确认空房', details:'房源资料'},
  ja: {search:'寮を検索', placeholder:'名前・住所・固定番号…', budget:'週の家賃上限', unlimited:'指定なし', room:'部屋タイプ', any:'すべて', ensuite:'専用バス・トイレ付き', studio:'スタジオ', destination:'徒歩の目的地', uol:'リバプール大学', ljmu:'最寄りのLJMUキャンパス', subject:'専攻の校舎', walk:'徒歩時間の目安上限', minutes:'{n} 分', favorites:'保存した寮のみ', save:'保存', saved:'保存済み', share:'この寮を共有', count:'47件中 {n} 件', empty:'条件に合う寮がありません。', reset:'条件をリセット', view:'{n} 件を見る', note:'記録された最低家賃による絞り込みです。空室はリアルタイムではありません。家賃や部屋タイプを指定すると、対応する家賃が不明な物件は除外されます。', local:'保存と比較はこのブラウザー内のみ。他の端末とは同期しません。', full:'比較は3件までです。比較欄から1件外してから追加してください。', copied:'寮のリンクをコピーしました。相手はこの寮を直接開けます。', copyFail:'このリンクを選択してコピーしてください：', copyLink:'リンクをコピー', storageFail:'このブラウザーに保存できません。ページを閉じると選択が失われます。', badLink:'この寮のリンクを認識できません。一覧から検索してください。', stable:'番号は固定IDで、順位ではありません。', filterMap:'地図にも条件に合う寮のみ表示します。', snapshot:'過去の掲載情報・空室要確認', details:'物件情報'}
};
const ht = (key, values = {}) => (HOME_COPY[LANG] || HOME_COPY.en)[key].replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');
const defaultHomeFilters = () => ({query:'', budget:0, room:'any', destination:'uol', walk:0, favoritesOnly:false});
let homeFilters = defaultHomeFilters(), favorites = new Set(), homeUiReady = false, homeNoticeTimer;
function saveHomeChoices(key, values) {
  try { localStorage.setItem(key, JSON.stringify([...values])); }
  catch (_) { homeNotice(ht('storageFail')); }
}
function homeNotice(message) {
  const box = document.getElementById('homeNotice');
  if (!box) return;
  box.textContent = message; box.hidden = false;
  clearTimeout(homeNoticeTimer); homeNoticeTimer = setTimeout(() => {box.hidden = true;}, 6000);
}
function matchesHomeFilters(h) { return HomeTools.matchesHome(h, homeFilters, favorites); }
function visibleHomes() { return rankOrder(rankKey).filter(matchesHomeFilters); }
function favoriteButton(h, compact = false) {
  const b = document.createElement('button'); b.type = 'button'; b.className = compact ? 'fav-mini' : 'home-action favorite-action';
  b.dataset.favorite = h.id;
  const on = favorites.has(h.id); b.setAttribute('aria-pressed', String(on));
  b.textContent = compact ? (on ? '★' : '☆') : (on ? '★ ' + ht('saved') : '☆ ' + ht('save'));
  b.title = b.ariaLabel = `${on ? ht('saved') : ht('save')}: ${h.name}`;
  b.addEventListener('click', e => {
    e.stopPropagation();
    if (favorites.has(h.id)) favorites.delete(h.id); else favorites.add(h.id);
    saveHomeChoices('lsm-favorites-v1', favorites);
    renderIndex(); refreshHomeFilters();
    if (current?.id === h.id) show(h, pinned);
  });
  return b;
}
function homeShareURL(h) {
  const url = new URL(location.href); url.search = ''; url.hash = HomeTools.makeHash(LANG, h.id); return url.href;
}
async function shareHome(h) {
  const url = homeShareURL(h);
  if (navigator.share) {
    try { await navigator.share({title:`${h.n}. ${h.name} · Liverpool Student Map`, url}); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(url); homeNotice(ht('copied')); }
  catch (_) {
    const box = document.getElementById('shareFallback'); box.hidden = false;
    box.querySelector('label').textContent = ht('copyFail');
    const input = box.querySelector('input'); input.value = url; input.focus(); input.select();
  }
}
function homeActions(h) {
  const row = document.createElement('div'); row.className = 'home-secondary-actions';
  const share = document.createElement('button'); share.type = 'button'; share.className = 'home-action'; share.textContent = ht('share');
  share.addEventListener('click', e => {e.stopPropagation(); shareHome(h);});
  row.append(favoriteButton(h), share); return row;
}
function updateHomeRoute(h) {
  try { history.replaceState(null, '', HomeTools.makeHash(LANG, h?.id || '')); } catch (_) {}
}
function openLinkedHome(id) {
  if (!id) return;
  const h = HOMES.find(item => item.id === id);
  if (!h) {homeNotice(ht('badLink')); return;}
  homeFilters = defaultHomeFilters(); renderHomeFilterLabels(); renderIndex(); refreshHomeFilters();
  if (hidden.has('home')) setLayer('home', true);
  welcome.hidden = true; closeSheets(); bringIntoView(h);
  show(h, true);
}
function renderHomeFilterLabels() {
  if (!homeUiReady) return;
  document.querySelectorAll('[data-home-copy]').forEach(n => {n.textContent = ht(n.dataset.homeCopy);});
  document.getElementById('homeSearch').placeholder = ht('placeholder');
  document.getElementById('homeSearch').value = homeFilters.query;
  const options = (id, values, value) => {
    const select = document.getElementById(id); select.replaceChildren();
    values.forEach(([v, text]) => select.append(opt(v, text))); select.value = value;
  };
  options('homeBudget', [[0,ht('unlimited')], ...[100,125,150,175,200,250,300].map(n=>[n,`£${n}`])], homeFilters.budget);
  options('homeRoom', ['any','ensuite','studio'].map(k=>[k,ht(k)]), homeFilters.room);
  if (!subject && homeFilters.destination === 'subject') homeFilters.destination = 'uol';
  options('homeDestination', ['uol','ljmu', ...(subject ? ['subject'] : [])].map(k=>[k,ht(k)]), homeFilters.destination);
  options('homeWalk', [[0,ht('unlimited')], ...[5,10,15,20,30,45].map(n=>[n,ht('minutes',{n})])], homeFilters.walk);
  document.getElementById('favoritesOnly').setAttribute('aria-pressed', String(homeFilters.favoritesOnly));
  refreshHomeFilters();
}
function refreshHomeFilters() {
  if (!homeUiReady) return;
  const count = HOMES.filter(matchesHomeFilters).length;
  document.getElementById('filterCount').textContent = ht('count',{n:count});
  document.getElementById('viewResults').textContent = ht('view',{n:count});
  document.getElementById('mbHomes').textContent = `${t('homesBtn')} (${count})`;
  HOMES.forEach(h => {
    const visible = matchesHomeFilters(h);
    const el = els.get(h.id); el?.classList.toggle('home-filtered', !visible);
    document.querySelectorAll(`[data-home-leader="${h.id}"]`).forEach(n => n.classList.toggle('home-filtered', !visible));
    if (!visible && current?.id === h.id) hide();
  });
}
function resetHomeFilters() {homeFilters = defaultHomeFilters(); renderHomeFilterLabels(); renderIndex(); refreshHomeFilters();}
function initHomeUI() {
  homeUiReady = true;
  const bind = (id, key, event='change') => document.getElementById(id).addEventListener(event, e => {
    homeFilters[key] = ['budget','walk'].includes(key) ? Number(e.target.value) : e.target.value;
    renderIndex(); refreshHomeFilters();
  });
  bind('homeSearch','query','input'); bind('homeBudget','budget'); bind('homeRoom','room'); bind('homeDestination','destination'); bind('homeWalk','walk');
  document.getElementById('favoritesOnly').addEventListener('click', () => {
    homeFilters.favoritesOnly = !homeFilters.favoritesOnly;
    document.getElementById('favoritesOnly').setAttribute('aria-pressed', String(homeFilters.favoritesOnly)); renderIndex(); refreshHomeFilters();
  });
  document.getElementById('resetHomeFilters').addEventListener('click', resetHomeFilters);
  document.getElementById('viewResults').addEventListener('click', () => {
    closeSheets(); const panel = document.getElementById('homesPanel'); panel.classList.remove('collapsed');
    if (isNarrow()) panel.classList.add('open');
    const collapse = panel.querySelector('.collapse'); collapse.textContent = t('hide'); collapse.setAttribute('aria-expanded','true');
    const heading = document.getElementById('idx-h'); heading.tabIndex = -1; heading.focus({preventScroll:true});
  });
  document.getElementById('closeShareFallback').addEventListener('click', () => {document.getElementById('shareFallback').hidden = true;});
  renderHomeFilterLabels(); renderIndex(); syncCompare();
  addEventListener('hashchange', () => {
    const route = HomeTools.readRoute(location.hash); if (route.lang) setLang(route.lang, true); openLinkedHome(route.home);
  });
  openLinkedHome(HomeTools.readRoute(location.hash).home);
}
