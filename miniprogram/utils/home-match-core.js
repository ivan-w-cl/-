/* 自动生成：scripts/export-match.cjs 从网页版 home-match.js 原样摘出。不要手改。 */
'use strict';
module.exports = function createCore(HOMES, opts) {
  opts = opts || {};
  const state = { answers: opts.answers || {} };
  let subject = opts.subject || null;
  const subjName = s => (s.name && s.name.zh) || s.name;
  const areaOf = a => (opts.areaOf ? opts.areaOf(a) : a);
  const matchesHomeFilters = opts.filter || (() => true);
  const LON0 = -3.015, LAT0 = 53.448, KX = 6638.0, KY = 11132.0;
  const raw = (lat, lon) => [(lon - LON0) * KX, (LAT0 - lat) * KY];
  const walkMin = (a, b) => Math.round(Math.hypot(a[0] - b[0], a[1] - b[1]) * 10 * 1.3 / 80);
  const walking = (a, b) => Math.max(1, walkMin(a, b));
  const CAMPUSES = {
    uol: ['利物浦大学主校区', 53.4065, -2.9663],
    'ljmu-city': ['约翰摩尔大学城市校区', 53.4127, -2.9838],
    'ljmu-mp': ['约翰摩尔大学 Mount Pleasant 校区', 53.4030, -2.9725],
    'hope-park': ['利物浦希望大学 Hope Park 校区', 53.3905, -2.8917],
    'hope-creative': ['希望大学创意校区', 53.4190, -2.9688],
    lipa: ['利物浦表演艺术学院', 53.3996, -2.9700],
    unsure: ['利物浦市中心参考点', 53.4035, -2.9868],
  };
  const QUESTIONS = [
    { id: 'campus', q: '你主要会在哪个校区上课？', hint: '用来估算通勤距离。利物浦大学还可以配合侧边「我的专业」，定位到专业教学楼。', opts: [
      ['uol', '🎓', '利物浦大学', '市中心主校区'], ['ljmu-city', '🎓', '约翰摩尔大学 · 城市校区', 'Byrom Street'],
      ['ljmu-mp', '🎓', '约翰摩尔大学 · Mount Pleasant', 'Mount Pleasant 校区'], ['hope-park', '🎓', '利物浦希望大学', 'Hope Park，Childwall'],
      ['hope-creative', '🎭', '希望大学 · 创意校区', 'Everton'], ['lipa', '🎤', '利物浦表演艺术学院', 'Mount Street'], ['unsure', '🤔', '暂时还不确定', '先参考利物浦市中心'] ] },
    { id: 'dinner', q: '晚上七点肚子饿了，你通常会……', opts: [
      ['cook', '🍳', '自己下厨', '买菜方便很重要'], ['out', '🍽️', '约朋友出去吃', '想探索附近的餐厅'],
      ['takeaway', '🥡', '打包或点外卖', '方便快捷，少洗碗'], ['mix', '🎲', '都可以，看心情', '下厨、下馆子、外卖轮着来'] ] },
    { id: 'shop', q: '你习惯怎样采购食物？', opts: [
      ['topup', '🧺', '少量多次，随用随买', '附近有食品店就很方便'], ['weekly', '🛒', '每周集中采购一次', '希望离超市近一点'],
      ['special', '🌶️', '喜欢找熟悉的食材', '亚洲或国际食品店很加分'], ['rarely', '🙃', '其实不太买菜', '大多数时候在外面吃'] ] },
    { id: 'flavour', multi: true, max: 3, q: '你希望附近有哪些口味？', hint: '最多选 3 项，选满自动进入下一题；选「都可以」直接下一题，少选可以点「下一题」。', opts: [
      ['east', '🍜', '东亚与东南亚风味', '中餐、日料、韩餐、泰餐等'], ['south', '🍛', '南亚与中东风味', '咖喱、烤肉、黎巴嫩菜等'],
      ['veg', '🥗', '植物性饮食', '参考资料中有相关标记的店'], ['any', '😋', '都可以', '没有特别偏好'] ] },
    { id: 'study', q: '你在哪里最容易进入学习状态？', opts: [
      ['library', '📚', '图书馆', '喜欢专门的学习空间'], ['cafe', '☕', '咖啡馆', '一台电脑，一杯咖啡'],
      ['desk', '🪑', '自己的书桌', '更喜欢在家专注'], ['any', '🎒', '在哪里都可以', '不太挑学习场所'] ] },
    { id: 'free', multi: true, max: 2, q: '空闲的周六下午，你更想……', hint: '最多选 2 项，选满自动进入下一题；只想选一项就点「下一题」。', opts: [
      ['shops', '🛍️', '逛逛街', '衣服、书店、小玩意'], ['park', '🌳', '去公园散步或跑步', '换换空气'],
      ['gym', '🏋️', '健身或运动', '保持活力'], ['culture', '🎨', '看展、看电影或演出', '给生活添点灵感'], ['home', '🛋️', '舒服地待在家', '给自己充充电'] ] },
    { id: 'night', q: '到了晚上，你的生活节奏是？', hint: '这里只比较收录的夜间场所数量，不代表街道噪声或安全评价。', opts: [
      ['calm', '🌙', '早点休息', '不需要靠近酒吧等夜间场所'], ['some', '🎶', '偶尔出去玩', '不必每天都热闹'], ['lots', '🪩', '经常夜间出门', '希望附近夜间场所选择多'] ] },
    { id: 'walk', q: '你愿意花多久步行去上课？', hint: '步行时间为距离估算，不是实时路线；「15 分钟内」不会自动放宽。', opts: [
      ['close', '🏃', '越近越好', '优先考虑通勤短的公寓'], ['mid', '🚶', '预计 15 分钟以内', '只推荐符合这个上限的公寓'],
      ['far', '🚌', '远一点也可以', '更看重日常生活，交通另行确认'] ] },
  ];


  const cleanAnswers = input => {
    const out = {};
    if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
    QUESTIONS.forEach(q => {
      const allowed = new Set(q.opts.map(o => o[0])), value = input[q.id];
      if (q.multi && Array.isArray(value)) {
        const selected = [...new Set(value.filter(v => typeof v === 'string' && allowed.has(v)))].slice(0, q.max);
        if (selected.length) out[q.id] = selected.includes('any') ? ['any'] : selected;
      } else if (!q.multi && typeof value === 'string' && allowed.has(value)) out[q.id] = value;
    });
    return out;
  };

  const answered = q => q.multi ? Array.isArray(state.answers[q.id]) && state.answers[q.id].length > 0 : !!state.answers[q.id];
  const complete = () => QUESTIONS.every(answered);

  const countOf = (home, key) => home.hm.cnt[key] || 0;
  const nearText = (home, key, fallback) => {
    const place = home.hm.near[key];
    return place ? `${place.p.n || fallback}，预计步行约 ${place.m} 分钟` : `参考资料中未找到可用的${fallback}距离`;
  };
  const usesSubject = () => state.answers.campus === 'uol' && !!subject;
  const campusName = () => usesSubject() ? `${subjName(subject)}的最近教学楼` : (CAMPUSES[state.answers.campus] || CAMPUSES.unsure)[0];
  const campusText = home => {
    const prefix = usesSubject() ? `${campusName()}${home.subjB ? `（${home.subjB}）` : ''}` : campusName();
    return `${prefix}：预计步行约 ${home.hm.campus} 分钟${home.hm.campus > 30 ? '，建议另查公共交通' : ''}`;
  };
  const metrics = {
    super: {dir:-1, value:h=>h.hm.near.super?.m ?? 999, spot:'super', ico:'🛒', good:h=>nearText(h,'super','超市'), bad:h=>nearText(h,'super','超市')},
    super10: {dir:1, value:h=>countOf(h,'super10')},
    topup: {dir:-1, value:h=>h.hm.near.topup?.m ?? 999, spot:'topup', ico:'🧺', good:h=>nearText(h,'topup','食品店'), bad:h=>nearText(h,'topup','食品店')},
    intl: {dir:-1, value:h=>h.hm.near.intl?.m ?? 999, spot:'intl', ico:'🌶️', good:h=>`国际食材采购参考：${nearText(h,'intl','国际食品店')}`, bad:h=>nearText(h,'intl','国际食品店')},
    asianGroc: {dir:-1, value:h=>h.hm.near.asianGroc?.m ?? 999, spot:'asianGroc', ico:'🥢', good:h=>`亚洲食材采购参考：${nearText(h,'asianGroc','亚洲食品店')}`, bad:h=>nearText(h,'asianGroc','亚洲食品店')},
    rest10: {dir:1, value:h=>countOf(h,'rest10'), ico:'🍽️', good:h=>`约 10 分钟范围收录 ${countOf(h,'rest10')} 家餐厅`, bad:h=>`约 10 分钟范围的餐厅记录较少（${countOf(h,'rest10')} 家）`},
    cafe10: {dir:1, value:h=>countOf(h,'cafe10'), spot:'cafe', ico:'☕', good:h=>`约 10 分钟范围收录 ${countOf(h,'cafe10')} 家咖啡馆；${nearText(h,'cafe','咖啡馆')}`, bad:h=>`约 10 分钟范围收录 ${countOf(h,'cafe10')} 家咖啡馆`},
    take10: {dir:1, value:h=>countOf(h,'take10'), ico:'🥡', good:h=>`约 10 分钟范围收录 ${countOf(h,'take10')} 家外带餐饮店`, bad:h=>`约 10 分钟范围的外带餐饮记录较少（${countOf(h,'take10')} 家）`},
    asian10: {dir:1, value:h=>countOf(h,'asian10'), ico:'🍜', good:h=>`约 10 分钟范围收录 ${countOf(h,'asian10')} 处东亚／东南亚餐饮`, bad:h=>`附近收录的东亚／东南亚餐饮较少（${countOf(h,'asian10')} 处）`},
    sa10: {dir:1, value:h=>countOf(h,'sa10'), ico:'🍛', good:h=>`约 10 分钟范围收录 ${countOf(h,'sa10')} 处南亚／中东餐饮`, bad:h=>`附近收录的南亚／中东餐饮较少（${countOf(h,'sa10')} 处）`},
    veg10: {dir:1, value:h=>countOf(h,'veg10'), ico:'🥗', good:h=>`约 10 分钟范围有 ${countOf(h,'veg10')} 处植物性饮食标记，菜单需再确认`, bad:h=>`附近植物性饮食标记较少，建议向店家确认菜单`},
    lib: {dir:-1, value:h=>h.hm.near.lib?.m ?? 999, spot:'lib', ico:'📚', good:h=>nearText(h,'lib','图书馆'), bad:h=>nearText(h,'lib','图书馆')},
    nightFew: {dir:-1, value:h=>countOf(h,'night3'), ico:'🌙', good:h=>`约 3 分钟范围收录 ${countOf(h,'night3')} 处夜间场所；不等于噪声评价`, bad:h=>`约 3 分钟范围收录 ${countOf(h,'night3')} 处夜间场所，实际噪声需看房确认`},
    night10: {dir:1, value:h=>countOf(h,'night10'), ico:'🪩', good:h=>`约 10 分钟范围收录 ${countOf(h,'night10')} 处酒吧等夜间场所`, bad:h=>`约 10 分钟范围的夜间场所记录较少（${countOf(h,'night10')} 处）`},
    shop10: {dir:1, value:h=>countOf(h,'shop10'), ico:'🛍️', good:h=>`约 10 分钟范围收录 ${countOf(h,'shop10')} 家零售商店`, bad:h=>`附近零售商店记录较少（约 10 分钟范围 ${countOf(h,'shop10')} 家）`},
    park: {dir:-1, value:h=>h.hm.near.park?.m ?? 999, spot:'park', ico:'🌳', good:h=>`${nearText(h,'park','绿地')}；入口需确认`, bad:h=>`${nearText(h,'park','绿地')}；不是入口路线`},
    gym: {dir:-1, value:h=>h.hm.near.gym?.m ?? 999, spot:'gym', ico:'🏋️', good:h=>nearText(h,'gym','健身场所'), bad:h=>nearText(h,'gym','健身场所')},
    culture15: {dir:1, value:h=>countOf(h,'culture15'), ico:'🎨', good:h=>`约 15 分钟范围收录 ${countOf(h,'culture15')} 处博物馆、画廊或演出场所`, bad:h=>`附近文化场所记录较少（约 15 分钟范围 ${countOf(h,'culture15')} 处）`},
    campus: {dir:-1, value:h=>h.hm.campus, ico:'🎓', good:campusText, bad:campusText},
  };
  function weightsFor(answers) {
    const weights = {}, add = (key, weight) => { weights[key] = (weights[key] || 0) + weight; };
    ({cook:()=>{add('super',2);add('super10',.5);},out:()=>{add('rest10',2);add('cafe10',.5);},takeaway:()=>{add('take10',2);add('topup',.5);},mix:()=>{add('rest10',.7);add('take10',.7);add('super',.7);}})[answers.dinner]?.();
    const flavours = answers.flavour || [];
    ({topup:()=>add('topup',1.5),weekly:()=>{add('super',1.5);add('super10',.5);},special:()=>add(flavours.includes('east') && !flavours.includes('south') ? 'asianGroc' : 'intl',2)})[answers.shop]?.();
    if (flavours.includes('east')) add('asian10',1.5);
    if (flavours.includes('south')) add('sa10',1.5);
    if (flavours.includes('veg')) add('veg10',1);
    ({library:()=>add('lib',2),cafe:()=>add('cafe10',1.8),desk:()=>add('nightFew',.6)})[answers.study]?.();
    (answers.free || []).forEach(choice=>({shops:()=>add('shop10',1.4),park:()=>add('park',1.4),gym:()=>add('gym',1.4),culture:()=>add('culture15',1.4),home:()=>add('nightFew',.3)})[choice]?.());
    ({calm:()=>add('nightFew',1.5),some:()=>add('night10',.4),lots:()=>add('night10',2)})[answers.night]?.();
    add('campus',{close:3,mid:1.6,far:.5}[answers.walk] || 1);
    return weights;
  }
  function matchHomes() {
    const campus = CAMPUSES[state.answers.campus] || CAMPUSES.unsure, campusPoint = raw(campus[1],campus[2]);
    HOMES.forEach(home => {home.hm.campus = usesSubject() && Number.isFinite(home.subj) ? Math.max(1,home.subj) : walking(home.hm.r,campusPoint);});
    const weights = weightsFor(state.answers), keys = Object.keys(weights), percentiles = {};
    keys.forEach(key => {
      const values = HOMES.map(home => metrics[key].value(home) * metrics[key].dir), ranks = new Map();
      HOMES.forEach((home,i) => {let lower=0,ties=0;values.forEach(value=>{if(value<values[i])lower++;else if(value===values[i])ties++;});ranks.set(home.id,(lower+(ties-1)/2)/Math.max(1,HOMES.length-1));});
      percentiles[key] = ranks;
    });
    const filtered = HOMES.filter(matchesHomeFilters);
    // Historical sold-out labels are not live inventory; keep them and disclose on each result.
    const pool = state.answers.walk === 'mid' ? filtered.filter(home => home.hm.campus <= 15) : filtered;
    const total = keys.reduce((sum,key)=>sum+weights[key],0);
    const scored = pool.map(home=>({h:home,score:keys.reduce((sum,key)=>sum+weights[key]*percentiles[key].get(home.id),0)/total})).sort((a,b)=>b.score-a.score || a.h.n-b.h.n);
    const picks = [];
    // Prefer distinct blocks; when fewer than three qualify, show the actual number without widening filters.
    for (const entry of scored) {
      if (picks.length === 3) break;
      if (picks.some(p=>Math.hypot(p.h.hm.r[0]-entry.h.hm.r[0],p.h.hm.r[1]-entry.h.hm.r[1])<12)) continue;
      picks.push(entry);
    }
    // Nearby homes can still be useful alternatives if no other block qualifies.
    if (picks.length < Math.min(3,scored.length)) scored.forEach(entry=>{if(picks.length<3 && !picks.includes(entry)) picks.push(entry);});
    picks.forEach(entry => {
      const ranked = keys.filter(key=>metrics[key].good).map(key=>({key,weight:weights[key],rank:percentiles[key].get(entry.h.id)}));
      entry.good = ranked.filter(item=>item.rank>=.6).sort((a,b)=>b.weight*b.rank-a.weight*a.rank).slice(0,4);
      if (!entry.good.some(item=>item.key==='campus')) entry.good = [{key:'campus'},...entry.good].slice(0,4);
      entry.trade = ranked.filter(item=>item.rank<.35 && item.weight>=1).sort((a,b)=>b.weight-a.weight)[0] || null;
    });
    return {picks,weights,eligible:pool.length,filterCount:filtered.length};
  }
  function persona() {
    const a = state.answers, flavours = a.flavour || [];
    const modifier = flavours.includes('east') ? '寻味' : flavours.includes('south') ? '香料' : flavours.includes('veg') ? '蔬食' : '';
    const food = {cook:'下厨派',out:'探店家',takeaway:'外卖鉴赏家',mix:'随性美食家'}[a.dinner] || '生活探索家';
    const title = {library:'图书馆常客',cafe:'咖啡馆学者',desk:'居家学习派',any:'自在探索家'}[a.study] || '城市探索家';
    const bits = [{cook:'喜欢自己下厨',out:'喜欢出门吃饭',takeaway:'偏爱方便的外卖',mix:'愿意尝试不同用餐方式'}[a.dinner],{topup:'习惯随用随买',weekly:'喜欢每周集中采购',special:'会寻找熟悉的食材',rarely:'不常买菜'}[a.shop],{library:'在图书馆更有学习状态',cafe:'喜欢在咖啡馆学习',desk:'在自己的书桌最自在',any:'学习场所不设限'}[a.study]].filter(Boolean);
    const activities = (a.free || []).map(key=>({shops:'逛街',park:'去公园',gym:'运动',culture:'看展或看演出',home:'在家充电'}[key])).filter(Boolean);
    return {title:`${title} · ${modifier}${food}`,stamp:{library:'📚',cafe:'☕',desk:'🪑',any:'🎒'}[a.study] || '🏠',desc:`你${bits.join('，')}${activities.length?`；周末想${activities.join('、')}`:''}。`};
  }


  function priceText(home) {
    const prices=[];
    if(home.pe)prices.push(`独卫单间 £${home.pe} 起`);
    if(home.ps)prices.push(`独立套间 £${home.ps} 起`);
    if(!prices.length && home.plo)prices.push(`房间 £${home.plo} 起`);
    return prices.length?`${prices.join(' · ')}／周（历史参考价）`:'未记录参考起价';
  }

  function resultScope() {
    return `${usesSubject()?'通勤参考已选专业的最近教学楼；不代表全部课程都在那里。':'通勤参考：'+campusName()+'。'} 当前地图筛选继续生效${state.answers.walk==='mid'?'，并严格限制预计步行 15 分钟以内':''}。`;
  }

  return { CAMPUSES, QUESTIONS, cleanAnswers, answered, complete, metrics, weightsFor, matchHomes, persona, priceText, resultScope, state,
    setSubject(s) { subject = s; }, setFilter(f) { opts.filter = f; } };
};
