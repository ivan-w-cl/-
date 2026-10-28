/* 🏁 抢房计划（网页「抢房准备 → 抢房计划」的小程序版）：
   - 我的计划：关注的公寓、开放日和状态、房型顺序（首选 / 备选）、最高周租；可以转发给朋友。
   - 朋友的计划：朋友转发过来的卡片点开就是这里；可以整份复制，或者只复制某一栋到自己的计划。
   开放日和状态读服务器 /api/availability（定时查官网公开页面），连不上就用 booking-prep.json 的演示数据。 */
const P = require('../../utils/plan-core.js');
const H = require('../../utils/homes.js');
const { API_BASE } = require('../../config.js');
const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => (v[k] != null ? v[k] : ''));
const app = getApp();
const byN = n => H.HOMES.find(h => h.n === n);

const W = {
  zh: { eyebrow: '抢房准备', mine: '我的抢房计划', friendT: '{name}的抢房计划', friendDef: '朋友',
    lede: '开放那一刻没时间犹豫：每栋公寓先排好首选和备选，首选没了马上订备选。', friendLede: '{name}在抢这些公寓。觉得不错，可以复制到你自己的计划里。',
    empty: '还没有关注的公寓。在公寓卡片上点「🏁 加入抢房」，或者从下面的收藏里添加。', addH: '从收藏添加', noFav: '还没有收藏的公寓。',
    order: '房型顺序（点一下加入，再点移除）', first: '首选', backup: '备选 {n}', max: '最高周租 £', maxPh: '比如 220', remove: '移出计划', map: '地图上看',
    rooms: { ensuite: '独卫单间', studio: 'Studio', premium: '高楼层/大房间', twodio: '双人间', flat: '合租整套' }, noOrder: '还没排房型', maxShow: '最高 £{n}/周',
    st: { open: '已开放', soon: '即将开放', waitlist: '候补', soldout: '售罄', unknown: '待核对', blocked: '待核对', error: '待核对' },
    opens: '{d} 开放', inDays: '还有 {n} 天', today: '今天开放', demo: '演示数据：开放日期和状态是示例。',
    shareH: '分享给朋友', shareName: '署名（可选）', shareNamePh: '比如 小林', share: '转发我的计划', shareNote: '朋友点开卡片就能看到你在抢哪些公寓、什么房型，可以一键复制。只分享公寓和房型，不带你的个人信息。',
    copyAll: '复制整份到我的计划', copyOne: '复制这栋', inMine: '已在我的计划', copied: '已复制 {a} 栋', filled: '，补上 {f} 栋的房型', kept: '，{k} 栋保留你自己排的',
    replaceT: '替换这栋的计划？', replaceC: '你已经给这栋排了房型，用朋友的顺序替换吗？', goMine: '看我的计划', back: '‹ 返回', invalid: '这个分享链接里没有可用的计划。',
    adviser: '🤝 两手准备：找订房顾问一起盯', note: '开放日期和状态以公寓官网为准。' },
  en: { eyebrow: 'Booking prep', mine: 'My booking plan', friendT: '{name}’s booking plan', friendDef: 'A friend',
    lede: 'No time to think when bookings open: rank a first choice and backups for each home, and switch the moment the first one goes.', friendLede: '{name} is going for these homes. Like them? Copy them into your own plan.',
    empty: 'No homes in your plan yet. Tap “🏁 Add to plan” on a home card, or add from your saved homes below.', addH: 'Add from saved', noFav: 'No saved homes yet.',
    order: 'Room order (tap to add, tap again to remove)', first: '1st', backup: 'Backup {n}', max: 'Max rent £', maxPh: 'e.g. 220', remove: 'Remove', map: 'Show on map',
    rooms: { ensuite: 'En-suite', studio: 'Studio', premium: 'High floor / larger', twodio: 'Twodio', flat: 'Whole flat' }, noOrder: 'no room order yet', maxShow: 'max £{n}/wk',
    st: { open: 'Open', soon: 'Opening soon', waitlist: 'Waitlist', soldout: 'Sold out', unknown: 'To check', blocked: 'To check', error: 'To check' },
    opens: 'opens {d}', inDays: 'in {n} days', today: 'opens today', demo: 'Demo data: release dates and statuses are examples.',
    shareH: 'Share with friends', shareName: 'Your name (optional)', shareNamePh: 'e.g. Lin', share: 'Send my plan', shareNote: 'Friends open the card to see which homes and room types you are going for, and can copy them in one tap. Only homes and room types are shared, nothing personal.',
    copyAll: 'Copy the whole plan to mine', copyOne: 'Copy this home', inMine: 'In my plan', copied: 'Copied {a} homes', filled: ', filled room order for {f}', kept: ', kept your own order for {k}',
    replaceT: 'Replace this home’s plan?', replaceC: 'You already ranked rooms for this home. Use your friend’s order instead?', goMine: 'See my plan', back: '‹ Back', invalid: 'This share link has no usable plan.',
    adviser: '🤝 Two tracks: get a booking adviser to watch with you', note: 'Always confirm dates and availability on the official site.' }
};

/* 开放信息：服务器监测优先，没有就用演示数据（只请求一次） */
let INFO = null, LIVE = false, loading = null;
function loadInfo() {
  if (INFO) return Promise.resolve(INFO);
  if (loading) return loading;
  const get = path => new Promise(ok => wx.request({ url: API_BASE + path, timeout: 6000, success: r => ok(r.statusCode === 200 && r.data && r.data.homes ? r.data : null), fail: () => ok(null) }));
  loading = get('/api/availability').then(j => { if (j) { LIVE = true; return j; } return get('/booking-prep.json'); })
    .then(j => { INFO = (j && j.homes) || {}; loading = null; return INFO; });
  return loading;
}
const daysTo = d => { if (!d) return null; const t0 = new Date(); t0.setHours(0, 0, 0, 0); return Math.round((new Date(d + 'T00:00:00') - t0) / 864e5); };

Component({
  properties: { lang: { type: String, value: 'zh' }, padTop: { type: Number, value: 16 } },
  data: { open: false, mode: 'mine', k: {}, items: [], friend: null, favs: [], name: '', demo: false, copyMsg: '' },
  methods: {
    /* 打开我的计划；id：从公寓卡片点「加入抢房」时把这栋加进来 */
    openMine(id) {
      const st = P.load(app.store);
      if (id && H.byId(id) && !st.watch[id] && Object.keys(st.watch).length < P.MAX_HOMES) { st.watch[id] = { since: new Date().toISOString() }; P.save(app.store, st); }
      this.setData({ open: true, mode: 'mine', copyMsg: '' }); this.draw();
    },
    /* 朋友分享的卡片点进来：code 是路径里的计划编码，from 是朋友的署名 */
    openFriend(code, from) {
      const list = P.decode(code, byN);
      this.friendList = list; this.friendFrom = String(from || '').slice(0, 12);
      this.setData({ open: true, mode: list.length ? 'friend' : 'mine', copyMsg: '' });
      if (!list.length) wx.showToast({ title: this.k().invalid, icon: 'none' });
      this.draw();
    },
    close() { this.setData({ open: false }); this.triggerEvent('close'); },
    noop() {},
    k() { return W[this.data.lang] || W.zh; },
    inPlan(id) { return !!P.load(app.store).watch[id]; },
    when(K, i) {
      const n = daysTo(i.opens), s = i.status || 'unknown';
      const w = s === 'open' ? '' : i.opens ? fmt(K.opens, { d: i.opens.slice(5).replace('-', '/') }) + (n > 0 ? ' · ' + fmt(K.inDays, { n }) : n === 0 ? ' · ' + K.today : '') : '';
      return { st: K.st[s] || K.st.unknown, cls: s, when: w, hot: s === 'open' || (n != null && n >= 0 && n <= 3) };
    },
    draw() {
      const K = this.k();
      loadInfo().then(info => {
        const st = P.load(app.store), row = x => {
          const h = H.byId(x.id), i = info[x.id] || {}, w = this.when(K, i);
          return Object.assign({ id: x.id, n: h.n, name: h.name, max: x.max || '', price: i.price || null,
            orderText: x.order.length ? x.order.map(r => K.rooms[r]).join(' > ') : K.noOrder, maxText: x.max ? fmt(K.maxShow, { n: x.max }) : '',
            rooms: x.order.concat(P.ROOMS.filter(r => x.order.indexOf(r) < 0)).map(r => { const at = x.order.indexOf(r); return { r, label: K.rooms[r], on: at >= 0, tag: at === 0 ? K.first : at > 0 ? fmt(K.backup, { n: at }) : '' }; }) }, w);
        };
        const items = P.items(st).filter(x => H.byId(x.id)).map(row);
        const favIds = (app.store('lsm-favorites-v1') || []).filter(id => H.byId(id) && !st.watch[id]).slice(0, 12);
        const friend = this.data.mode === 'friend' && this.friendList ? {
          title: fmt(K.friendT, { name: this.friendFrom || K.friendDef }), lede: fmt(K.friendLede, { name: this.friendFrom || K.friendDef }),
          items: this.friendList.map(x => Object.assign(row(x), { mine: !!st.watch[x.id] })) } : null;
        this.setData({ k: K, items, friend, name: st.name || '', demo: !LIVE, favs: favIds.map(id => { const h = H.byId(id); return { id, n: h.n, name: h.name }; }) });
      });
    },
    /* ---------- 我的计划 ---------- */
    edit(fn) { const st = P.load(app.store); fn(st); P.save(app.store, st); this.draw(); },
    toggleRoom(e) {
      const { id, r } = e.currentTarget.dataset;
      this.edit(st => { const p = st.plan[id] = st.plan[id] || { order: [], max: null }; p.order = p.order.indexOf(r) >= 0 ? p.order.filter(x => x !== r) : p.order.concat(r); });
    },
    setMax(e) {
      const id = e.currentTarget.dataset.id, v = Math.round(Number(e.detail.value)) || null;
      const st = P.load(app.store), p = st.plan[id] = st.plan[id] || { order: [], max: null }; p.max = v; P.save(app.store, st);
    },
    removeHome(e) { const id = e.currentTarget.dataset.id; this.edit(st => { delete st.watch[id]; delete st.plan[id]; }); },
    addFav(e) {
      const id = e.currentTarget.dataset.id;
      this.edit(st => { if (Object.keys(st.watch).length < P.MAX_HOMES) st.watch[id] = { since: new Date().toISOString() }; });
    },
    setName(e) { const st = P.load(app.store); st.name = String(e.detail.value || '').slice(0, 12); P.save(app.store, st); this.setData({ name: st.name }); },
    /* 页面的 onShareAppMessage 用：转发卡片的标题和路径 */
    shareInfo() {
      const st = P.load(app.store), list = P.items(st).filter(x => H.byId(x.id)), code = P.encode(list, H.byId), L = this.data.lang;
      const who = st.name || (L === 'en' ? 'I' : '我'), names = list.slice(0, 2).map(x => H.byId(x.id).name).join(L === 'en' ? ', ' : '、');
      const title = L === 'en' ? `${st.name ? st.name + ' is' : 'I am'} going for ${list.length} homes: ${names}${list.length > 2 ? '…' : ''} · see the booking plan`
        : `${who}在抢这 ${list.length} 栋：${names}${list.length > 2 ? '等' : ''}，看看我的抢房计划`;
      return { title, path: `/pages/index/index?plan=${code}${st.name ? '&from=' + encodeURIComponent(st.name) : ''}`, code };
    },
    /* ---------- 朋友的计划 ---------- */
    copyAll() { this.copy(null); },
    copyOne(e) {
      const id = e.currentTarget.dataset.id, st = P.load(app.store), K = this.k();
      if (st.watch[id] && st.plan[id] && (st.plan[id].order || []).length) {
        wx.showModal({ title: K.replaceT, content: K.replaceC, success: r => { if (r.confirm) this.copy(id); } });
      } else this.copy(id);
    },
    copy(onlyId) {
      const K = this.k(), st = P.load(app.store), r = P.merge(st, this.friendList || [], onlyId);
      P.save(app.store, st);
      const msg = fmt(K.copied, { a: r.added + r.filled }) + (r.filled && r.added ? fmt(K.filled, { f: r.filled }) : '') + (r.kept ? fmt(K.kept, { k: r.kept }) : '');
      this.setData({ copyMsg: msg }); wx.showToast({ title: msg.length > 14 ? fmt(K.copied, { a: r.added + r.filled }) : msg, icon: 'success' });
      this.triggerEvent('copied', r); this.draw();
    },
    goMine() { this.setData({ mode: 'mine', copyMsg: '' }); this.draw(); },
    showMap(e) { this.setData({ open: false }); this.triggerEvent('card', { id: e.currentTarget.dataset.id }); },
    askAdviser() { const first = this.data.items[0]; this.setData({ open: false }); this.triggerEvent('ask', { id: first ? first.id : '' }); }
  },
  observers: { lang() { if (this.data.open) this.draw(); } }
});
