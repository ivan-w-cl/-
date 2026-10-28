/* 抢房计划：存储、分享编码、开放信息（和网页 booking-prep.js 同一个存储结构 lsm-prep-v1：watch / plan / day）。
   分享给朋友时，计划直接编码进小程序路径，不经过服务器、不带个人信息：
     每栋公寓「编号.房型字母.最高周租」，用 _ 连起来，例如 1.se.180_7.e（iQ：Studio > En-suite，最高 £180；Yugo：En-suite）。
   房型字母：e 独卫单间 s Studio p 高楼层/大房间 t 双人间 f 合租整套。 */
const ROOMS = ['ensuite', 'studio', 'premium', 'twodio', 'flat'];
const LETTER = { ensuite: 'e', studio: 's', premium: 'p', twodio: 't', flat: 'f' };
const FROM_LETTER = { e: 'ensuite', s: 'studio', p: 'premium', t: 'twodio', f: 'flat' };
const MAX_HOMES = 10;

function encode(items, byId) {
  return items.slice(0, MAX_HOMES).map(x => {
    const h = byId(x.id); if (!h) return '';
    const max = Number(x.max) >= 60 && Number(x.max) <= 600 ? Math.round(Number(x.max)) : '';
    return [h.n, (x.order || []).map(r => LETTER[r] || '').join(''), max].join('.').replace(/\.+$/, '');
  }).filter(Boolean).join('_');
}
/* 解码时只接受已知公寓编号和房型，坏数据直接跳过 */
function decode(code, byN) {
  const seen = {};
  return String(code || '').slice(0, 300).split('_').map(part => {
    const [n, rooms, max] = part.split('.'), h = byN(Number(n));
    if (!h || seen[h.id]) return null; seen[h.id] = 1;
    const order = String(rooms || '').split('').map(c => FROM_LETTER[c]).filter((r, i, a) => r && a.indexOf(r) === i);
    const m = Number(max);
    return { id: h.id, order, max: m >= 60 && m <= 600 ? m : null };
  }).filter(Boolean).slice(0, MAX_HOMES);
}

/* 存储（结构同网页）：watch {id: {since}}, plan {id: {order, max}}, day {id: {...}} */
function load(store) {
  const v = store('lsm-prep-v1') || {};
  return { watch: v.watch || {}, plan: v.plan || {}, day: v.day || {}, name: v.name || '' };
}
function save(store, st) { store('lsm-prep-v1', st); }
function items(st) { return Object.keys(st.watch).map(id => ({ id, order: (st.plan[id] && st.plan[id].order) || [], max: (st.plan[id] && st.plan[id].max) || null })); }
/* 复制朋友的计划：没有的公寓加进来；已经有、但自己还没排房型的，用朋友的；自己排过的保留自己的 */
function merge(st, list, onlyId) {
  let added = 0, filled = 0, kept = 0;
  list.filter(x => !onlyId || x.id === onlyId).forEach(x => {
    const mine = st.plan[x.id], had = !!st.watch[x.id];
    if (!had) { st.watch[x.id] = { since: new Date().toISOString(), from: 'friend' }; st.plan[x.id] = { order: x.order.slice(), max: x.max }; added++; }
    else if (onlyId || !mine || !(mine.order || []).length) { st.plan[x.id] = { order: x.order.slice(), max: x.max != null ? x.max : (mine && mine.max) || null }; filled++; }
    else kept++;
  });
  return { added, filled, kept };
}
module.exports = { ROOMS, encode, decode, load, save, items, merge, MAX_HOMES };
