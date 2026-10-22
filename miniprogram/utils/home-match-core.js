/* 自动生成，请勿手改：node scripts/extract-data.cjs
   内容原样截取自网页版 home-match.js（题目、中英文文案、权重、打分、人物画像），外面包一层无 DOM 的工厂函数。 */
'use strict';
module.exports = function createCore(HOMES, opts) {
  opts = opts || {};
  const lang = opts.lang === 'en' ? 'en' : 'zh';
  const isChinese = () => lang === 'zh';
  const local = (en, zh) => isChinese() ? zh : en;
  const state = { answers: opts.answers || {} };
  const subject = null, subjName = s => s.name;
  const matchesHomeFilters = opts.filter || (() => true);
  const LON0 = -3.015, LAT0 = 53.448, KX = 6638.0, KY = 11132.0;
  const raw = (lat, lon) => [(lon - LON0) * KX, (LAT0 - lat) * KY];
  const walkMin = (a, b) => Math.round(Math.hypot(a[0] - b[0], a[1] - b[1]) * 10 * 1.3 / 80);
  const walking = (a, b) => Math.max(1, walkMin(a, b));
  const CAMPUSES = {
    uol: ['University of Liverpool main campus', 53.4065, -2.9663],
    'ljmu-city': ['LJMU City campus', 53.4127, -2.9838],
    'ljmu-mp': ['LJMU Mount Pleasant campus', 53.4030, -2.9725],
    'hope-park': ['Liverpool Hope University Hope Park campus', 53.3905, -2.8917],
    'hope-creative': ['Hope University Creative campus', 53.4190, -2.9688],
    lipa: ['Liverpool Institute for Performing Arts', 53.3996, -2.9700],
    unsure: ['Liverpool city centre reference point', 53.4035, -2.9868],
  };
  const QUESTIONS = [
    { id: 'campus', q: 'Which campus will you mainly study at?', hint: 'Used to estimate your commute. With the University of Liverpool you can also use the side panel "My subject" to locate the teaching building for your course.', opts: [
      ['uol', '🎓', 'University of Liverpool', 'Main city-centre campus'], ['ljmu-city', '🎓', 'Liverpool John Moores · City', 'Byrom Street'],
      ['ljmu-mp', '🎓', 'Liverpool John Moores · Mount Pleasant', 'Mount Pleasant campus'], ['hope-park', '🎓', 'Liverpool Hope University', 'Hope Park, Childwall'],
      ['hope-creative', '🎭', 'Hope University · Creative Campus', 'Everton'], ['lipa', '🎤', 'Liverpool Institute for Performing Arts', 'Mount Street'], ['unsure', '🤔', 'Not sure yet', 'Use Liverpool city centre as a reference'] ] },
    { id: 'dinner', q: 'When you are hungry at 7pm, you usually…', opts: [
      ['cook', '🍳', 'Cook for yourself', 'An easy grocery run matters'], ['out', '🍽️', 'Go out to eat with friends', 'You want to explore nearby restaurants'],
      ['takeaway', '🥡', 'Grab takeaway or order in', 'Quick and easy, fewer dishes'], ['mix', '🎲', 'Any of these, depending on mood', 'Cook, eat out and takeaway take turns'] ] },
    { id: 'shop', q: 'How do you like to stock up on food?', opts: [
      ['topup', '🧺', 'A little at a time, as you need it', 'A nearby food shop makes life easy'], ['weekly', '🛒', 'One big weekly shop', 'You want to be close to a supermarket'],
      ['special', '🌶️', 'You hunt down familiar ingredients', 'Asian or international food shops are a plus'], ['rarely', '🙃', 'You rarely buy groceries', 'You mostly eat out'] ] },
    { id: 'flavour', multi: true, max: 3, q: 'What kinds of food do you want nearby?', hint: 'Multi-select; choosing "Anything goes" clears the other picks.', opts: [
      ['east', '🍜', 'East & Southeast Asian', 'Chinese, Japanese, Korean, Thai and more'], ['south', '🍛', 'South Asian & Middle Eastern', 'Curry, kebabs, Lebanese dishes and more'],
      ['veg', '🥗', 'Plant-based', 'Places flagged in the reference data'], ['any', '😋', 'Anything goes', 'No real preference'] ] },
    { id: 'study', q: 'Where do you settle into study mode most easily?', opts: [
      ['library', '📚', 'A library', 'You like a dedicated study space'], ['cafe', '☕', 'A café', 'A laptop and a coffee'],
      ['desk', '🪑', 'Your own desk', 'You focus better at home'], ['any', '🎒', 'Anywhere works', 'You are not fussy about where you study'] ] },
    { id: 'free', multi: true, max: 2, q: 'On a free Saturday afternoon, you would rather…', hint: 'Pick up to two.', opts: [
      ['shops', '🛍️', 'Wander the shops', 'Clothes, bookshops, little finds'], ['park', '🌳', 'Walk or run in a park', 'Get some fresh air'],
      ['gym', '🏋️', 'Work out or play a sport', 'Keep the energy up'], ['culture', '🎨', 'See an exhibition, a film or a show', 'Add a little inspiration'], ['home', '🛋️', 'Stay cosy at home', 'Recharge the batteries'] ] },
    { id: 'night', q: 'How would you describe your evenings?', hint: 'This only compares how many night-time venues are listed; it does not rate street noise or safety.', opts: [
      ['calm', '🌙', 'Early to bed', 'You do not need to be near pubs and clubs'], ['some', '🎶', 'Out occasionally', 'It does not have to be busy every day'], ['lots', '🪩', 'Often out at night', 'You want plenty of night venues close by'] ] },
    { id: 'walk', q: 'How long are you happy to walk to class?', hint: 'Walk time is a distance estimate, not a live route; "within 15 minutes" will not relax automatically.', opts: [
      ['close', '🏃', 'The shorter the better', 'Short-commute homes come first'], ['mid', '🚶', 'Around 15 minutes', 'Only homes that meet this cap'],
      ['far', '🚌', 'A bit further is fine', 'Day-to-day life matters more — check transport separately'] ] },
  ];

  const CAMPUS_ZH = {
    uol:'利物浦大学主校区', 'ljmu-city':'利物浦约翰摩尔大学 City 校区',
    'ljmu-mp':'利物浦约翰摩尔大学 Mount Pleasant 校区', 'hope-park':'利物浦希望大学 Hope Park 校区',
    'hope-creative':'利物浦希望大学 Creative 校区', lipa:'利物浦表演艺术学院', unsure:'利物浦市中心参考点'
  };
  // Only display copy is translated; option IDs and the original scoring stay unchanged.
  const QUESTION_ZH = {
    campus:{q:'你主要会在哪个校区上课？',hint:'用于估算通勤。利物浦大学学生还可以通过侧边“我的专业”找到专业对应的教学楼。',opts:[
      ['利物浦大学','市中心主校区'],['利物浦约翰摩尔大学 · City','Byrom Street'],
      ['利物浦约翰摩尔大学 · Mount Pleasant','Mount Pleasant 校区'],['利物浦希望大学','Childwall 的 Hope Park 校区'],
      ['利物浦希望大学 · Creative 校区','Everton'],['利物浦表演艺术学院','Mount Street'],['还不确定','先以利物浦市中心作为参考']]},
    dinner:{q:'晚上七点饿了，你通常会……',opts:[['自己下厨','买菜方便很重要'],['和朋友出去吃','想探索附近的餐厅'],['买外卖或点餐到家','省时省心，少洗碗'],['看心情，哪种都行','做饭、外食和外卖轮着来']]},
    shop:{q:'你习惯怎样采购食材？',opts:[['需要时买一点','家附近有食品店就方便'],['每周一次大采购','希望离超市近一些'],['专门寻找熟悉的食材','亚洲或国际食品店是加分项'],['很少买菜','大多在外面吃']]},
    flavour:{q:'你希望附近有哪些口味？',hint:'可以多选；选择“都可以”会清除其他选项。',opts:[['东亚与东南亚美食','中餐、日料、韩餐、泰餐等'],['南亚与中东美食','咖喱、烤肉、黎巴嫩菜等'],['植物性饮食','按参考资料中的标记筛选'],['都可以','没有特别偏好']]},
    study:{q:'你在哪里最容易进入学习状态？',opts:[['图书馆','喜欢专门的学习空间'],['咖啡馆','一台电脑，一杯咖啡'],['自己的书桌','在家更容易专注'],['哪里都行','不太挑学习地点']]},
    free:{q:'周六下午有空，你更想……',hint:'最多选两项。',opts:[['逛逛商店','衣服、书店和小惊喜'],['在公园散步或跑步','出去呼吸新鲜空气'],['健身或运动','保持活力'],['看展、电影或演出','给生活添点灵感'],['舒服地待在家','休息一下，恢复精力']]},
    night:{q:'你的夜晚通常是什么样？',hint:'这里只比较已记录夜间场所的数量，不评价街道噪音或安全。',opts:[['早睡早起','不需要住在酒吧和夜店旁'],['偶尔出去玩','不用每天都很热闹'],['经常享受夜生活','希望附近有丰富的夜间去处']]},
    walk:{q:'你愿意步行多久去上课？',hint:'步行时间按距离估算，并非实时路线；选择“15 分钟以内”后不会自动放宽条件。',opts:[['越近越好','优先考虑通勤短的公寓'],['15 分钟左右','只保留符合这个上限的公寓'],['远一点也可以','更看重日常生活便利，交通需另行确认']]}
  };
  function displayQuestion(question) {
    if (!isChinese()) return question;
    const copy = QUESTION_ZH[question.id];
    return {...question, q:copy.q, hint:copy.hint, opts:question.opts.map(([id,emoji],index)=>[id,emoji,...copy.opts[index]])};
  }


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

  const countOf = (home, key) => home.hm.cnt[key] || 0;
  const PLACE_ZH = {super:'超市',topup:'食品店',intl:'国际食品店',asianGroc:'亚洲食品店',cafe:'咖啡馆',lib:'图书馆',park:'绿地',gym:'健身房'};
  const placeName = (place, fallback) => place.n === 'Green-space boundary reference point' ? local(place.n,'绿地边界参考点') : (place.n || fallback);
  const nearText = (home, key, fallback) => {
    const place = home.hm.near[key], label = local(fallback,PLACE_ZH[key] || fallback);
    return place ? local(`${placeName(place.p,label)}: about ${place.m} min on foot`,`${placeName(place.p,label)}：预计步行约 ${place.m} 分钟`) : local(`No usable distance recorded for the ${fallback}`,`暂无${label}的有效距离记录`);
  };
  const usesSubject = () => state.answers.campus === 'uol' && !!subject;
  const campusName = () => usesSubject() ? local(`nearest teaching building for ${subjName(subject)}`,`${subjName(subject)}最近的教学楼`) : local((CAMPUSES[state.answers.campus] || CAMPUSES.unsure)[0],CAMPUS_ZH[state.answers.campus] || CAMPUS_ZH.unsure);
  const campusText = home => {
    const prefix = usesSubject() ? `${campusName()}${home.subjB ? `（${home.subjB}）` : ''}` : campusName();
    return local(`${prefix}: about ${home.hm.campus} min on foot${home.hm.campus > 30 ? ', consider public transport' : ''}`,`${prefix}：预计步行约 ${home.hm.campus} 分钟${home.hm.campus > 30 ? '，建议另查公共交通' : ''}`);
  };
  const metrics = {
    super: {dir:-1, value:h=>h.hm.near.super?.m ?? 999, spot:'super', ico:'🛒', good:h=>nearText(h,'super','supermarket'), bad:h=>nearText(h,'super','supermarket')},
    super10: {dir:1, value:h=>countOf(h,'super10')},
    topup: {dir:-1, value:h=>h.hm.near.topup?.m ?? 999, spot:'topup', ico:'🧺', good:h=>nearText(h,'topup','food shop'), bad:h=>nearText(h,'topup','food shop')},
    intl: {dir:-1, value:h=>h.hm.near.intl?.m ?? 999, spot:'intl', ico:'🌶️', good:h=>local(`International grocery reference: ${nearText(h,'intl','international food shop')}`,`国际食材购物参考：${nearText(h,'intl','international food shop')}`), bad:h=>nearText(h,'intl','international food shop')},
    asianGroc: {dir:-1, value:h=>h.hm.near.asianGroc?.m ?? 999, spot:'asianGroc', ico:'🥢', good:h=>local(`Asian grocery reference: ${nearText(h,'asianGroc','Asian food shop')}`,`亚洲食材购物参考：${nearText(h,'asianGroc','Asian food shop')}`), bad:h=>nearText(h,'asianGroc','Asian food shop')},
    rest10: {dir:1, value:h=>countOf(h,'rest10'), ico:'🍽️', good:h=>local(`About a 10-minute radius holds ${countOf(h,'rest10')} restaurants`,`约 10 分钟范围内记录有 ${countOf(h,'rest10')} 家餐厅`), bad:h=>local(`Fewer restaurants listed within about 10 minutes (${countOf(h,'rest10')} places)`,`约 10 分钟范围内记录的餐厅较少（${countOf(h,'rest10')} 家）`)},
    cafe10: {dir:1, value:h=>countOf(h,'cafe10'), spot:'cafe', ico:'☕', good:h=>local(`About a 10-minute radius holds ${countOf(h,'cafe10')} cafés; ${nearText(h,'cafe','café')}`,`约 10 分钟范围内记录有 ${countOf(h,'cafe10')} 家咖啡馆；${nearText(h,'cafe','café')}`), bad:h=>local(`About a 10-minute radius holds ${countOf(h,'cafe10')} cafés`,`约 10 分钟范围内记录有 ${countOf(h,'cafe10')} 家咖啡馆`)},
    take10: {dir:1, value:h=>countOf(h,'take10'), ico:'🥡', good:h=>local(`About a 10-minute radius holds ${countOf(h,'take10')} takeaway spots`,`约 10 分钟范围内记录有 ${countOf(h,'take10')} 家外卖店`), bad:h=>local(`Fewer takeaway places listed within about 10 minutes (${countOf(h,'take10')} places)`,`约 10 分钟范围内记录的外卖店较少（${countOf(h,'take10')} 家）`)},
    asian10: {dir:1, value:h=>countOf(h,'asian10'), ico:'🍜', good:h=>local(`About a 10-minute radius holds ${countOf(h,'asian10')} East and Southeast Asian places`,`约 10 分钟范围内记录有 ${countOf(h,'asian10')} 家东亚与东南亚餐饮店`), bad:h=>local(`Fewer East and Southeast Asian places nearby (${countOf(h,'asian10')} listed)`,`附近记录的东亚与东南亚餐饮店较少（${countOf(h,'asian10')} 家）`)},
    sa10: {dir:1, value:h=>countOf(h,'sa10'), ico:'🍛', good:h=>local(`About a 10-minute radius holds ${countOf(h,'sa10')} South Asian and Middle Eastern places`,`约 10 分钟范围内记录有 ${countOf(h,'sa10')} 家南亚与中东餐饮店`), bad:h=>local(`Fewer South Asian and Middle Eastern places nearby (${countOf(h,'sa10')} listed)`,`附近记录的南亚与中东餐饮店较少（${countOf(h,'sa10')} 家）`)},
    veg10: {dir:1, value:h=>countOf(h,'veg10'), ico:'🥗', good:h=>local(`About a 10-minute radius has ${countOf(h,'veg10')} plant-based listings - check menus to be sure`,`约 10 分钟范围内有 ${countOf(h,'veg10')} 处植物性饮食记录，请另行确认菜单`), bad:h=>local('Few plant-based listings nearby - ask the venues about their menus','附近植物性饮食记录较少，请向店家确认菜单')},
    lib: {dir:-1, value:h=>h.hm.near.lib?.m ?? 999, spot:'lib', ico:'📚', good:h=>nearText(h,'lib','A library'), bad:h=>nearText(h,'lib','A library')},
    nightFew: {dir:-1, value:h=>countOf(h,'night3'), ico:'🌙', good:h=>local(`About a 3-minute radius holds ${countOf(h,'night3')} night venues; this is not a noise rating`,`约 3 分钟范围内记录有 ${countOf(h,'night3')} 处夜间场所，这不是噪音评分`), bad:h=>local(`About a 3-minute radius holds ${countOf(h,'night3')} night venues — check real noise when you view`,`约 3 分钟范围内记录有 ${countOf(h,'night3')} 处夜间场所，请在看房时确认实际噪音`)},
    night10: {dir:1, value:h=>countOf(h,'night10'), ico:'🪩', good:h=>local(`About a 10-minute radius holds ${countOf(h,'night10')} pubs and night venues`,`约 10 分钟范围内记录有 ${countOf(h,'night10')} 处酒吧和夜间场所`), bad:h=>local(`Fewer night venues listed within about 10 minutes (${countOf(h,'night10')} places)`,`约 10 分钟范围内记录的夜间场所较少（${countOf(h,'night10')} 处）`)},
    shop10: {dir:1, value:h=>countOf(h,'shop10'), ico:'🛍️', good:h=>local(`About a 10-minute radius holds ${countOf(h,'shop10')} retail shops`,`约 10 分钟范围内记录有 ${countOf(h,'shop10')} 家零售商店`), bad:h=>local(`Fewer retail shops nearby (about a 10-minute radius, ${countOf(h,'shop10')} places)`,`附近记录的零售商店较少（约 10 分钟范围内 ${countOf(h,'shop10')} 家）`)},
    park: {dir:-1, value:h=>h.hm.near.park?.m ?? 999, spot:'park', ico:'🌳', good:h=>`${nearText(h,'park','green space')}${local('; check where the entrance is','；请另行确认入口位置')}`, bad:h=>`${nearText(h,'park','green space')}${local('; this is not the entrance route','；此距离并非到入口的实际路线')}`},
    gym: {dir:-1, value:h=>h.hm.near.gym?.m ?? 999, spot:'gym', ico:'🏋️', good:h=>nearText(h,'gym','gym'), bad:h=>nearText(h,'gym','gym')},
    culture15: {dir:1, value:h=>countOf(h,'culture15'), ico:'🎨', good:h=>local(`About a 15-minute radius holds ${countOf(h,'culture15')} museums, galleries or performance venues`,`约 15 分钟范围内记录有 ${countOf(h,'culture15')} 处博物馆、画廊或演出场所`), bad:h=>local(`Fewer cultural venues nearby (about a 15-minute radius, ${countOf(h,'culture15')} places)`,`附近记录的文化场所较少（约 15 分钟范围内 ${countOf(h,'culture15')} 处）`)},
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
    // "The shorter the better" promises short-commute homes first: homes within a few minutes of the
    // shortest available commute (or within 10 minutes) form the first tier; lifestyle score orders each tier.
    const shortest = pool.reduce((m,home)=>Math.min(m,home.hm.campus),Infinity), shortCap = Math.max(10, shortest + 4);
    const tier = home => state.answers.walk === 'close' && home.hm.campus > shortCap ? 1 : 0;
    const scored = pool.map(home=>({h:home,score:keys.reduce((sum,key)=>sum+weights[key]*percentiles[key].get(home.id),0)/total})).sort((a,b)=>tier(a.h)-tier(b.h) || b.score-a.score || a.h.hm.campus-b.h.hm.campus || a.h.n-b.h.n);
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
    const modifier = flavours.includes('east') ? local('Flavour seeker','亚洲美食爱好者') : flavours.includes('south') ? local('Spice lover','香料爱好者') : flavours.includes('veg') ? local('Plant-based eater','植物性饮食爱好者') : '';
    const food = {cook:local('Home cook','居家主厨'),out:local('Restaurant hunter','餐厅探索家'),takeaway:local('Takeaway connoisseur','外卖行家'),mix:local('Easy-going foodie','随性美食家')}[a.dinner] || local('Everyday explorer','日常探索家');
    const title = {library:local('Library regular','图书馆常客'),cafe:local('Café scholar','咖啡馆学习派'),desk:local('Study-at-home type','居家学习派'),any:local('Free-roaming explorer','自由探索家')}[a.study] || local('City explorer','城市探索家');
    const bits = [{cook:local('you like cooking for yourself','喜欢自己下厨'),out:local('you like eating out','喜欢在外用餐'),takeaway:local('you lean on easy takeaway','偏爱省心的外卖'),mix:local('you are open to all kinds of dining','用餐方式随心选择')}[a.dinner],{topup:local('you shop a little at a time','习惯少量多次采购'),weekly:local('you prefer one big weekly shop','喜欢每周一次大采购'),special:local('you seek out familiar ingredients','会寻找熟悉的食材'),rarely:local('you rarely grocery shop','很少采购食材')}[a.shop],{library:local('you study best in a library','在图书馆学习更专注'),cafe:local('you like studying in cafés','喜欢在咖啡馆学习'),desk:local('you are most comfortable at your own desk','在自己的书桌前最自在'),any:local('you are not fussy about where you study','不太挑学习地点')}[a.study]].filter(Boolean);
    const activities = (a.free || []).map(key=>({shops:local('shopping','逛商店'),park:local('going to the park','去公园'),gym:local('sport','运动'),culture:local('exhibitions and shows','看展览和演出'),home:local('recharging at home','在家休息')}[key])).filter(Boolean);
    return {title:[title,modifier,food].filter(Boolean).join(' · '),stamp:{library:'📚',cafe:'☕',desk:'🪑',any:'🎒'}[a.study] || '🏠',desc:local(`${bits.join(', ')}${activities.length?`; at weekends ${activities.join(', ')}`:''}.`,`你${bits.join('，')}${activities.length?`；周末喜欢${activities.join('、')}`:''}。`)};
  }


  function priceText(home) {
    const prices=[];
    if(home.pe)prices.push(local(`En-suite from £${home.pe}`,`独卫单间 £${home.pe} 起`));
    if(home.ps)prices.push(local(`Studio from £${home.ps}`,`独立套间 £${home.ps} 起`));
    if(!prices.length && home.plo)prices.push(local(`Room from £${home.plo}`,`房间 £${home.plo} 起`));
    return prices.length?`${prices.join(' · ')}${local(' / week (past reference price)','／周（历史参考价）')}`:local('No reference starting price recorded','暂无参考起价记录');
  }

  return { CAMPUSES, CAMPUS_ZH, QUESTIONS, displayQuestion, cleanAnswers, metrics, weightsFor, matchHomes, persona, priceText, state };
};
