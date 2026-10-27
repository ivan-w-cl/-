/* 本站住户评价：演示用的本地存储。住户评价面板（resident-reviews.js）和审核台（reviews-admin.html）共用。
   - 只存在这台设备的浏览器里（localStorage「lsm-reviews-demo-v1」），不连任何生产评价库，不提交真实申请。
   - 身份是模拟的：住户是「演示用户」，审核员是「演示审核员」；不收集姓名、联系方式、房号、证件或合同。
   - 三种内容：resident 住户匿名评价（计入评分）、team 团队探访、insight 资料解读（这两种都不计入评分）。
   - 状态：pending 待审核 / changes 需修改 / published 已发布 / rejected 未通过 / withdrawn 已撤回。
     只有 published 公开显示；评分只用 published + resident + 非演示内容（演示公寓另算「演示评分」，同样只用 published + resident）。
   - 缺的维度是「未评」（null），不是 0。 */
(() => {
  'use strict';
  const KEY = 'lsm-reviews-demo-v1';
  const DEMO_HOME = { id: 'demo-court', demo: true, name: { zh: '演示公寓 Demo Court（虚构）', en: 'Demo Court (fictional demo property)' } };
  const DIMS = ['noise', 'repair', 'clean', 'net', 'value'];
  const now = () => new Date().toISOString();
  const uid = () => Math.random().toString(36).slice(2, 10);
  const days = n => new Date(Date.now() - n * 864e5).toISOString();
  let mem = null;   // 本地存储不可用时（隐私模式等）只放内存

  function seed() {
    const r = (o) => ({ id: uid(), homeId: DEMO_HOME.id, demo: true, kind: 'resident', author: 'seed-' + uid(), verified: false, scores: {}, history: [], reports: 0, ...o });
    const h = (at, action, by, reason) => ({ at, action, by, reason: reason || '' });
    return {
      v: 1, user: 'demo-user-' + uid(), reports: [],
      reviews: [
        r({ alias: '利物浦小熊', verified: true, stayYear: '2025/26', roomType: 'ensuite', scores: { noise: 3, repair: 4, clean: 4, net: 5, value: 4 }, text: '演示内容：隔音一般，晚上能听到走廊关门声。报修第二天就有人来，公共厨房每天打扫。网速稳定，打游戏没问题。', status: 'published', createdAt: days(40), history: [h(days(40), 'submitted', 'author'), h(days(38), 'verified', 'moderator', '入住信息已核实（演示）'), h(days(38), 'published', 'moderator', '符合发布规则')] }),
        r({ alias: 'Mersey 夜猫', stayYear: '2024/25', roomType: 'studio', scores: { noise: 4, repair: 2, clean: null, net: 3, value: 3 }, text: '演示内容：Studio 很安静。热水器坏了等了一周才修好。卫生这项我没用过公共区域，不评。', status: 'published', createdAt: days(25), history: [h(days(25), 'submitted', 'author'), h(days(24), 'published', 'moderator', '符合发布规则')] }),
        r({ alias: 'Anfield 晨跑', stayYear: '2025/26', roomType: 'ensuite', scores: { noise: 2, repair: 3, clean: 3, net: 4, value: 3 }, text: '演示内容：靠马路的房间早上有车声，想安静的话选背面。前台态度好。', status: 'published', createdAt: days(12), history: [h(days(12), 'submitted', 'author'), h(days(11), 'published', 'moderator', '符合发布规则')] }),
        r({ alias: '新同学 A', stayYear: '2025/26', roomType: 'twodio', scores: { noise: 1, repair: 1, clean: 2, net: null, value: 1 }, text: '演示内容：楼上一直装修，问了几次都没人管，非常失望。', status: 'pending', createdAt: days(1), history: [h(days(1), 'submitted', 'author')] }),
        { id: uid(), homeId: DEMO_HOME.id, demo: true, kind: 'team', status: 'published', member: '小林', affiliation: { zh: '本站选房团队成员', en: 'Member of this site’s housing team' }, visitDate: '2026-09-18', limits: { zh: '只看了一间 En-suite 样板间和公共厨房，没在楼里过夜，没有测试晚上的噪音。', en: 'Saw one en-suite show room and the shared kitchen only; did not stay overnight or test noise at night.' }, text: { zh: '演示内容：前台 24 小时有人；公共厨房 6 人一间，两台烤箱；洗衣房在地下一层，用手机 App 付费。', en: 'Demo content: 24-hour reception; shared kitchens for six with two ovens; laundry in the basement, paid by app.' }, createdAt: days(39), history: [] },
        { id: uid(), homeId: DEMO_HOME.id, demo: true, kind: 'insight', status: 'published', member: '小林', affiliation: { zh: '本站选房团队成员', en: 'Member of this site’s housing team' }, date: '2026-10-01', basis: { zh: '对照公寓官网的租约条款和 2026/27 价格表整理；没有核实合同原件。', en: 'Based on the property’s published tenancy terms and 2026/27 price list; original contracts were not checked.' }, sources: [{ label: { zh: '公寓官网租约条款（示例链接）', en: 'Property tenancy terms (sample link)' }, url: 'https://example.com/demo-court/terms', date: '2026-10-01' }], text: { zh: '演示内容：51 周租约包含水电网；提前退租需要自己找人转租。', en: 'Demo content: the 51-week tenancy includes bills; leaving early requires finding a replacement tenant.' }, createdAt: days(26), history: [] }
      ]
    };
  }
  function read() {
    if (mem) return mem;
    try { const j = JSON.parse(localStorage.getItem(KEY) || 'null'); if (j && j.v === 1) return (mem = j); } catch (_) { /* 用种子 */ }
    mem = seed(); write(true); return mem;
  }
  function write(quiet) { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (_) { /* 只放内存 */ } if (!quiet) emit(); }   // 第一次放种子数据时不通知（正在画的页面会重复画）
  const subs = new Set(); function emit() { subs.forEach(f => { try { f(); } catch (_) { /* 忽略 */ } }); }
  addEventListener('storage', e => { if (e.key === KEY) { mem = null; emit(); } });   // 审核台在另一个标签页里操作后同步

  const all = () => read().reviews;
  const get = id => all().find(x => x.id === id);
  const forHome = (homeId, f) => all().filter(x => x.homeId === homeId && (!f || f(x)));
  const publicFor = homeId => forHome(homeId, x => x.status === 'published').sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const mine = () => all().filter(x => x.author === read().user).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  /* 评分：只用已发布的住户评价；真实统计不含演示内容。缺的维度不算进那一项的平均和样本数。 */
  function aggregate(homeId, { demo = false } = {}) {
    const list = forHome(homeId, x => x.status === 'published' && x.kind === 'resident' && (demo || !x.demo));
    const dims = {}; DIMS.forEach(d => { const v = list.map(x => x.scores[d]).filter(n => typeof n === 'number'); dims[d] = { n: v.length, avg: v.length ? v.reduce((a, b) => a + b, 0) / v.length : null }; });
    return { n: list.length, dims };
  }
  function submit(data) {
    const s = read(), id = data.id;
    if (id) {   // 修改后重新提交
      const x = get(id); if (!x || x.author !== s.user || !['pending', 'changes'].includes(x.status)) return null;
      Object.assign(x, pickFields(data), { status: 'pending', updatedAt: now() }); x.history.push({ at: now(), action: 'resubmitted', by: 'author', reason: '' });
      write(); return x;
    }
    if (data.homeId !== DEMO_HOME.id) return null;   // 演示阶段只收演示公寓
    const x = { id: uid(), homeId: data.homeId, demo: true, kind: 'resident', author: s.user, verified: false, reports: 0, ...pickFields(data), status: 'pending', createdAt: now(), history: [{ at: now(), action: 'submitted', by: 'author', reason: '' }] };
    s.reviews.push(x); write(); return x;
  }
  const pickFields = d => ({ alias: String(d.alias || '').slice(0, 24), stayYear: d.stayYear, roomType: d.roomType, scores: Object.fromEntries(DIMS.map(k => [k, typeof d.scores[k] === 'number' ? d.scores[k] : null])), text: String(d.text || '').slice(0, 2000) });
  function withdraw(id) { const x = get(id); if (!x || x.author !== read().user || x.status === 'withdrawn') return; x.status = 'withdrawn'; x.history.push({ at: now(), action: 'withdrawn', by: 'author', reason: '' }); write(); }
  /* 审核：发布 / 需修改 / 不通过都要写原因并记时间；正面和负面评价同一个标准 */
  function moderate(id, action, reason) {
    const x = get(id), map = { publish: 'published', changes: 'changes', reject: 'rejected' };
    if (!x || !map[action] || !String(reason || '').trim()) return false;
    x.status = map[action]; x.history.push({ at: now(), action: map[action], by: 'moderator', reason: String(reason).trim() }); write(); return true;
  }
  function setVerified(id, v, note) { const x = get(id); if (!x) return; x.verified = !!v; x.history.push({ at: now(), action: v ? 'verified' : 'unverified', by: 'moderator', reason: note || '' }); write(); }
  /* 举报：不记录举报人 */
  function report(id, reason) { const x = get(id); if (!x) return; x.reports = (x.reports || 0) + 1; read().reports.push({ id: uid(), reviewId: id, reason, at: now(), open: true }); write(); }
  function resolveReport(rid, note) { const r = read().reports.find(x => x.id === rid); if (r) { r.open = false; r.resolvedAt = now(); r.note = note || ''; write(); } }
  function reset() { mem = seed(); write(); }

  window.ReviewsStore = { KEY, DEMO_HOME, DIMS, read, all, get, forHome, publicFor, mine, aggregate, submit, withdraw, moderate, setVerified, report, resolveReport, reset, on: f => { subs.add(f); return () => subs.delete(f); } };
})();
