/* 自动生成：scripts/export-fun.cjs 从网页版 fun-quizzes.js 原样摘出。不要手改。 */
'use strict';
module.exports = function createFun(HOMES, getLang) {
  const L = () => (getLang() === 'en' ? 'en' : 'zh');
  const tx = o => (o && typeof o === 'object' && !Array.isArray(o) ? (o[L()] || o.zh) : o);
  const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] != null ? v[k] : '');
  const homes = () => HOMES;
  const minPrice = h => { const v = [h.pe, h.ps, h.plo].map(Number).filter(x => Number.isFinite(x) && x > 0); return v.length ? Math.min(...v) : null; };
  const near = (h, k) => (h.hm && h.hm.near && h.hm.near[k] ? h.hm.near[k].m : 40);
  const cnt = (h, k) => (h.hm && h.hm.cnt ? h.hm.cnt[k] || 0 : 0);
  const METRIC = {
    uol: h => h.uol, centre: h => h.centre, lime: h => h.lime, price: h => minPrice(h) || 320, studio: h => (h.ps ? 1 : 0), rating: h => h.rr || 4,
    night10: h => cnt(h, 'night10'), night3: h => cnt(h, 'night3'), cafe10: h => cnt(h, 'cafe10'), rest10: h => cnt(h, 'rest10'), asian10: h => cnt(h, 'asian10'),
    take10: h => cnt(h, 'take10'), culture15: h => cnt(h, 'culture15'), shop10: h => cnt(h, 'shop10'),
    super: h => near(h, 'super'), gym: h => near(h, 'gym'), park: h => near(h, 'park'), lib: h => near(h, 'lib')
  };
  const WHY = {
    uol: { zh: h => `步行到利物浦大学约 ${h.uol} 分钟`, en: h => `About ${h.uol} min walk to the University of Liverpool` },
    centre: { zh: h => `步行到市中心约 ${h.centre} 分钟`, en: h => `About ${h.centre} min walk to the city centre` },
    lime: { zh: h => `步行到莱姆街火车站约 ${h.lime} 分钟，说走就走`, en: h => `About ${h.lime} min walk to Lime Street station` },
    price: { zh: h => `£${minPrice(h)}/周起，预算友好`, en: h => `From £${minPrice(h)}/week, easy on the budget` },
    studio: { zh: () => '有 Studio 套间，独立卫浴和厨房', en: () => 'Has studios with a private bathroom and kitchen' },
    rating: { zh: h => `住客评分 ${Number(h.rr || 0).toFixed(1)}★`, en: h => `Rated ${Number(h.rr || 0).toFixed(1)}★ by residents` },
    night10: { zh: h => `10 分钟内 ${cnt(h, 'night10')} 处酒吧和 live`, en: h => `${cnt(h, 'night10')} bars and venues within 10 min` },
    night3: { zh: () => '楼下附近夜店少，晚上比较安静', en: () => 'Few late-night venues right outside, so evenings are calmer' },
    cafe10: { zh: h => `10 分钟内 ${cnt(h, 'cafe10')} 家咖啡馆`, en: h => `${cnt(h, 'cafe10')} cafés within 10 min` },
    rest10: { zh: h => `10 分钟内 ${cnt(h, 'rest10')} 家餐厅`, en: h => `${cnt(h, 'rest10')} restaurants within 10 min` },
    asian10: { zh: h => `10 分钟内 ${cnt(h, 'asian10')} 家亚洲餐饮`, en: h => `${cnt(h, 'asian10')} Asian places to eat within 10 min` },
    take10: { zh: h => `10 分钟内 ${cnt(h, 'take10')} 家外卖`, en: h => `${cnt(h, 'take10')} takeaways within 10 min` },
    culture15: { zh: h => `15 分钟内 ${cnt(h, 'culture15')} 处博物馆、画廊和剧场`, en: h => `${cnt(h, 'culture15')} museums, galleries and theatres within 15 min` },
    shop10: { zh: h => `10 分钟内 ${cnt(h, 'shop10')} 家商店`, en: h => `${cnt(h, 'shop10')} shops within 10 min` },
    super: { zh: h => `最近的超市步行约 ${near(h, 'super')} 分钟`, en: h => `Nearest supermarket about ${near(h, 'super')} min away` },
    gym: { zh: h => `最近的健身房步行约 ${near(h, 'gym')} 分钟`, en: h => `Nearest gym about ${near(h, 'gym')} min away` },
    park: { zh: h => `最近的绿地步行约 ${near(h, 'park')} 分钟`, en: h => `Nearest green space about ${near(h, 'park')} min away` },
    lib: { zh: h => `最近的图书馆步行约 ${near(h, 'lib')} 分钟`, en: h => `Nearest library about ${near(h, 'lib')} min away` }
  };
  /* 每个指标在 47 套公寓里的百分位（0–1，数值越大百分位越高） */
  let pctCache = null;
  function pct() {
    if (pctCache) return pctCache;
    const list = homes(); pctCache = {};
    Object.keys(METRIC).forEach(k => {
      const vals = list.map(METRIC[k]), m = new Map();
      list.forEach((h, i) => { let lo = 0, eq = 0; vals.forEach(v => { if (v < vals[i]) lo++; else if (v === vals[i]) eq++; }); m.set(h.id, (lo + (eq - 1) / 2) / Math.max(1, list.length - 1)); });
      pctCache[k] = m;
    });
    return pctCache;
  }
  function recommend(weights) {
    const P = pct(), keys = Object.keys(weights);
    const scored = homes().map(h => ({ h, s: keys.reduce((a, k) => a + weights[k] * P[k].get(h.id), 0) })).sort((a, b) => b.s - a.s || a.h.uol - b.h.uol);
    const picks = [];
    for (const e of scored) { if (picks.length === 3) break; if (picks.some(p => Math.hypot(p.h.lat - e.h.lat, p.h.lng - e.h.lng) < 0.0012)) continue; picks.push(e); }
    return picks.map(({ h }) => {
      const best = keys.filter(k => WHY[k]).map(k => ({ k, v: weights[k] * (weights[k] > 0 ? P[k].get(h.id) : P[k].get(h.id) - 1) })).sort((a, b) => b.v - a.v).slice(0, 2);
      return { h, why: best.map(b => tx(WHY[b.k])(h)) };
    });
  }
  const blend = (a, b) => { const o = {}; [a, b].forEach(w => Object.keys(w).forEach(k => { o[k] = (o[k] || 0) + w[k] / 2; })); return o; };

  /* ---------- 4 套测试 ---------- */
  const Q = (q, opts) => ({ q, opts: opts.map(([t, v]) => ({ t, v })) });
  const QUIZZES = {
    ie: {
      emoji: '🫧', title: { zh: 'i 人还是 e 人？你的利物浦室友人格', en: 'Introvert or extrovert? Your Liverpool flatmate type' },
      blurb: { zh: '6 题测出你是哪种室友：社交电量 × 计划性', en: '6 questions: social battery × how much you plan' },
      kicker: { zh: '我的利物浦室友人格', en: 'My Liverpool flatmate type' },
      questions: [
        Q({ zh: '周五晚上没课，你会……', en: 'Friday night, no classes. You…' }, [[{ zh: '叫上整层楼一起煮火锅', en: 'Invite the whole floor for hotpot' }, 'e'], [{ zh: '一个人追剧点外卖', en: 'Series and a takeaway, solo' }, 'i'], [{ zh: '约两三个熟人去小酌', en: 'Drinks with two or three friends' }, 'e'], [{ zh: '戴上耳机画画写东西', en: 'Headphones on, draw or write' }, 'i']]),
        Q({ zh: '共享厨房里第一次遇到新室友', en: 'You meet a new flatmate in the shared kitchen' }, [[{ zh: '主动介绍自己，顺手拉了个群', en: 'Introduce yourself and start a group chat' }, 'e'], [{ zh: '微笑点头，等对方先开口', en: 'Smile, nod, let them talk first' }, 'i'], [{ zh: '请对方尝尝你做的菜', en: 'Offer them a taste of what you cooked' }, 'e'], [{ zh: '默默错峰做饭', en: 'Quietly cook at a different time' }, 'i']]),
        Q({ zh: '理想的周末充电方式', en: 'Your ideal way to recharge at the weekend' }, [[{ zh: '去 Baltic Market 人挤人', en: 'Squeeze into Baltic Market' }, 'e'], [{ zh: '一个人去王子公园散步', en: 'A solo walk in Princes Park' }, 'i'], [{ zh: '参加社团活动认识新朋友', en: 'Join a society event' }, 'e'], [{ zh: '在家睡到自然醒', en: 'Sleep in at home' }, 'i']]),
        Q({ zh: '出发去利物浦前三个月，你……', en: 'Three months before flying to Liverpool, you…' }, [[{ zh: '已经做好 Excel 行李清单', en: 'Already have a packing spreadsheet' }, 'J'], [{ zh: '落地再说', en: 'Will figure it out on arrival' }, 'P'], [{ zh: '先订好房，其他慢慢来', en: 'Book the room first, the rest later' }, 'J'], [{ zh: '刷到哪买到哪', en: 'Buy whatever pops up on my feed' }, 'P']]),
        Q({ zh: '第一次去 Tesco', en: 'Your first trip to Tesco' }, [[{ zh: '按清单买完就走', en: 'Stick to the list and leave' }, 'J'], [{ zh: '逛到哪买到哪，结账发现拿了三包薯片', en: 'Wander, and somehow buy three bags of crisps' }, 'P'], [{ zh: '比价后用会员价买', en: 'Compare prices and use the Clubcard' }, 'J'], [{ zh: '在亚洲货架前挪不动脚', en: 'Get stuck at the Asian aisle' }, 'P']]),
        Q({ zh: '作业截止在下周五', en: 'An essay is due next Friday' }, [[{ zh: '这周三就交了', en: 'Submit it this Wednesday' }, 'J'], [{ zh: '周四通宵', en: 'All-nighter on Thursday' }, 'P'], [{ zh: '列好每天的进度表', en: 'Make a day-by-day plan' }, 'J'], [{ zh: '先去 city walk 找灵感', en: 'City walk first, for inspiration' }, 'P']])
      ],
      result: s => ((s.e || 0) > (s.i || 0) ? 'e' : 'i') + ((s.J || 0) > (s.P || 0) ? 'J' : 'P'),
      types: {
        iJ: { stamp: '📚', name: { zh: '图书馆守夜人', en: 'The Library Night Owl' }, tag: { zh: '安静、有计划，书桌就是你的城堡', en: 'Quiet, organised, your desk is your castle' },
          desc: { zh: '你需要一个安静的房间和一张大书桌，离图书馆和教学楼越近越安心。不爱热闹，但会是整层楼最靠谱的那个人。', en: 'You need a quiet room and a big desk, close to the library and lectures. Not one for crowds, but the most reliable person on the floor.' },
          traits: { zh: ['#社交电量省着用', '#提前交作业', '#独处充电'], en: ['#SocialBatterySaver', '#EarlySubmitter', '#SoloRecharge'] }, w: { lib: -2, night3: -1.5, uol: -1, studio: 1 } },
        iP: { stamp: '🛋️', name: { zh: '宅家漫游者', en: 'The Cosy Drifter' }, tag: { zh: '能宅能逛，外卖和沙发是本命', en: 'Home or out, takeaway and a sofa are life' },
          desc: { zh: '你喜欢舒服、自在的节奏：想出门就出门，想宅就宅。外卖多、房租别太贵、楼下别太吵，就是理想生活。', en: 'You like an easy rhythm: out when you feel like it, home when you don\'t. Plenty of takeaways, sensible rent and a quiet street is the dream.' },
          traits: { zh: ['#随性', '#外卖鉴赏家', '#睡到自然醒'], en: ['#GoWithTheFlow', '#TakeawayExpert', '#NoAlarms'] }, w: { take10: 1.5, night3: -1, price: -1.5, studio: 0.5 } },
        eJ: { stamp: '🎉', name: { zh: '派对策划人', en: 'The Party Planner' }, tag: { zh: '整层楼的群主，活动排到下个月', en: 'Runs the floor group chat, plans a month ahead' },
          desc: { zh: '你是天生的组织者：聚餐、生日、看球都由你张罗。住在市中心、楼下餐厅多，才配得上你的社交日程表。', en: 'A born organiser: dinners, birthdays and match nights all go through you. You need the city centre and plenty of restaurants nearby.' },
          traits: { zh: ['#群主', '#社交日程表', '#永远有局'], en: ['#GroupChatAdmin', '#SocialCalendar', '#AlwaysAPlan'] }, w: { rest10: 1.5, night10: 1, centre: -1, rating: 0.5 } },
        eP: { stamp: '🚶', name: { zh: 'City Walk 特种兵', en: 'The City Walk Explorer' }, tag: { zh: '说走就走，每条街都想逛一遍', en: 'Off on a whim, every street is worth a look' },
          desc: { zh: '你的周末从不重样：美术馆、二手店、码头日落一个不落。离火车站近、附近咖啡馆和展馆多，随时出发。', en: 'No two weekends are alike: galleries, vintage shops, sunset at the docks. Close to the station with cafés and museums nearby, ready to go.' },
          traits: { zh: ['#citywalk', '#说走就走', '#打卡王'], en: ['#CityWalk', '#Spontaneous', '#CheckInKing'] }, w: { culture15: 1.5, cafe10: 1, shop10: 1, lime: -1 } }
      }
    },
    soft: {
      emoji: '🌿', title: { zh: '留学松弛感测试：你是松弛派还是特种兵？', en: 'Soft life or full speed? Your study-abroad energy' },
      blurb: { zh: '5 题测出你的留学节奏', en: '5 questions on your study-abroad pace' },
      kicker: { zh: '我的留学松弛感', en: 'My study-abroad energy' },
      questions: [
        Q({ zh: '落地利物浦的第一天', en: 'Your first day in Liverpool' }, [[{ zh: '先睡一觉倒时差', en: 'Sleep off the jet lag' }, 'soft'], [{ zh: '去 Liverpool ONE 买齐床品和香薰', en: 'Liverpool ONE for bedding and candles' }, 'chic'], [{ zh: '放下行李就去 Albert Dock 打卡', en: 'Drop the bags, straight to Albert Dock' }, 'trooper'], [{ zh: '先把学生卡和图书馆卡办了', en: 'Get the student and library cards sorted' }, 'grind']]),
        Q({ zh: '周末下雨了', en: 'It is raining at the weekend' }, [[{ zh: '窝在窗边听雨喝茶', en: 'Tea by the window, listening to the rain' }, 'soft'], [{ zh: '去喝一杯手冲配甜点', en: 'A pour-over and a pastry somewhere nice' }, 'chic'], [{ zh: '冒雨去看球赛', en: 'Go to the match anyway' }, 'trooper'], [{ zh: '刚好在家刷题', en: 'Perfect, more time to study' }, 'grind']]),
        Q({ zh: '你的房间最重要的是', en: 'What matters most in your room' }, [[{ zh: '有阳光和植物', en: 'Sunlight and plants' }, 'soft'], [{ zh: '独立卫浴和好看的装修', en: 'Private bathroom and a nice finish' }, 'chic'], [{ zh: '离车站近，说走就走', en: 'Close to the station' }, 'trooper'], [{ zh: '一张大书桌和安静', en: 'A big desk and quiet' }, 'grind']]),
        Q({ zh: '你的朋友圈最常发', en: 'What you post most' }, [[{ zh: '公园日落和猫', en: 'Park sunsets and cats' }, 'soft'], [{ zh: '精致早午餐', en: 'Beautiful brunches' }, 'chic'], [{ zh: '一天去三个城市的九宫格', en: 'Three cities in one day, nine-photo grid' }, 'trooper'], [{ zh: '凌晨两点的图书馆', en: 'The library at 2am' }, 'grind']]),
        Q({ zh: '被问"毕业后打算做什么"', en: '"What are you doing after graduation?"' }, [[{ zh: '走一步看一步，开心最重要', en: 'One step at a time, being happy matters most' }, 'soft'], [{ zh: '先把生活过好看', en: 'Make life look good first' }, 'chic'], [{ zh: '趁年轻多去几个国家', en: 'See as many countries as I can' }, 'trooper'], [{ zh: '已经在准备实习面试了', en: 'Already preparing for internship interviews' }, 'grind']])
      ],
      types: {
        soft: { stamp: '🌿', name: { zh: '松弛派', en: 'Soft Life' }, tag: { zh: '情绪稳定，慢慢来比较快', en: 'Calm, steady, slow is fast' },
          desc: { zh: '你的松弛感是留学最好的护身符。离公园近、楼下安静、转角有咖啡馆，就能把每一天过得舒舒服服。', en: 'Your calm is your superpower abroad. A park nearby, a quiet street and a café round the corner make every day easy.' },
          traits: { zh: ['#情绪稳定', '#公园日落', '#慢生活'], en: ['#Unbothered', '#ParkSunsets', '#SlowLiving'] }, w: { park: -2, cafe10: 1, night3: -1 } },
        chic: { stamp: '💅', name: { zh: '精致派', en: 'Main Character' }, tag: { zh: '留学也要有仪式感', en: 'Life abroad deserves a little ceremony' },
          desc: { zh: '好看的房间、独立卫浴、评分高的公寓，是你对生活的基本尊重。住得体面，心情才会好。', en: 'A beautiful room, a private bathroom and a well-rated building are your baseline. Live well, feel well.' },
          traits: { zh: ['#仪式感', '#独卫党', '#颜值即正义'], en: ['#Aesthetic', '#EnSuiteOnly', '#MainCharacter'] }, w: { rating: 2, studio: 1.5, centre: -0.5 } },
        trooper: { stamp: '⚡', name: { zh: '特种兵派', en: 'Full-Speed Trooper' }, tag: { zh: '一天打卡八个地方', en: 'Eight places in one day' },
          desc: { zh: '你把每个周末都过成旅行。离莱姆街火车站近、房租省下来买车票，才是正确打开方式。', en: 'Every weekend is a trip. Live close to Lime Street and save on rent for train tickets.' },
          traits: { zh: ['#特种兵旅游', '#说走就走', '#车票收藏家'], en: ['#WeekendTrips', '#Spontaneous', '#TicketCollector'] }, w: { lime: -1.5, culture15: 1, centre: -1, price: -1 } },
        grind: { stamp: '📈', name: { zh: '卷王派', en: 'Top of the Class' }, tag: { zh: 'GPA 和 offer 都要', en: 'Grades and offers, both' },
          desc: { zh: '你来利物浦是认真的。离图书馆和教学楼近、晚上安静，每一分钟都花在刀刃上。', en: 'You came to Liverpool to win. Near the library and lectures, quiet at night, no minute wasted.' },
          traits: { zh: ['#图书馆常驻', '#早八不迟到', '#offer收割机'], en: ['#LibraryResident', '#NeverLate', '#OfferHunter'] }, w: { lib: -2, uol: -1.5, night3: -1 } }
      }
    },
    buddy: {
      emoji: '🤝', duo: true, title: { zh: '你是哪种留学搭子？', en: 'What kind of study-abroad buddy are you?' },
      blurb: { zh: '5 题测搭子类型，还能和朋友测合拍度', en: '5 questions, then check your match with a friend' },
      kicker: { zh: '我的留学搭子类型', en: 'My study-abroad buddy type' },
      questions: [
        Q({ zh: '朋友约你，你最先答应的是', en: 'A friend invites you. You say yes first to…' }, [[{ zh: '唐人街新开的火锅', en: 'The new hotpot place in Chinatown' }, 'food'], [{ zh: '一起去图书馆赶 essay', en: 'Essay session at the library' }, 'study'], [{ zh: '早上七点去王子公园跑步', en: 'A 7am run in Princes Park' }, 'gym'], [{ zh: 'Tate 的新展', en: 'The new show at Tate' }, 'art'], [{ zh: '周五 Concert Square 的 live', en: 'Friday live music on Concert Square' }, 'night']]),
        Q({ zh: '你手机相册里最多的是', en: 'Your camera roll is mostly…' }, [[{ zh: '食物', en: 'Food' }, 'food'], [{ zh: '笔记截图', en: 'Lecture notes' }, 'study'], [{ zh: '健身打卡', en: 'Workout check-ins' }, 'gym'], [{ zh: '展览和建筑', en: 'Exhibitions and buildings' }, 'art'], [{ zh: '夜景和演出', en: 'Night views and gigs' }, 'night']]),
        Q({ zh: '搭子最欣赏你的是', en: 'Your buddies love you because you…' }, [[{ zh: '永远知道哪家好吃', en: 'Always know where to eat' }, 'food'], [{ zh: '永远有复习资料', en: 'Always have the revision notes' }, 'study'], [{ zh: '能把人从床上拉起来运动', en: 'Get people out of bed to train' }, 'gym'], [{ zh: '总能找到好看的去处', en: 'Always find somewhere beautiful' }, 'art'], [{ zh: '永远最后一个离场', en: 'Always leave last' }, 'night']]),
        Q({ zh: '宿舍里只能留一样', en: 'You can keep one thing in your room' }, [[{ zh: '电饭煲', en: 'Rice cooker' }, 'food'], [{ zh: '降噪耳机', en: 'Noise-cancelling headphones' }, 'study'], [{ zh: '跑鞋', en: 'Running shoes' }, 'gym'], [{ zh: '博物馆会员卡', en: 'Museum membership card' }, 'art'], [{ zh: '蓝牙音箱', en: 'Bluetooth speaker' }, 'night']]),
        Q({ zh: '理想的周六晚上', en: 'The perfect Saturday night' }, [[{ zh: '一桌人一起做饭', en: 'Cooking for a full table' }, 'food'], [{ zh: '在咖啡馆把下周任务排好', en: 'Planning next week in a café' }, 'study'], [{ zh: '打完球洗个热水澡', en: 'A game, then a hot shower' }, 'gym'], [{ zh: '看一场话剧', en: 'A night at the theatre' }, 'art'], [{ zh: '听 live 到凌晨', en: 'Live music till late' }, 'night']])
      ],
      types: {
        food: { stamp: '🍜', name: { zh: '饭搭子', en: 'Food Buddy' }, tag: { zh: '有你在，永远不用想吃什么', en: 'With you around, nobody asks "what\'s for dinner?"' },
          desc: { zh: '你是朋友圈里的美食雷达。住在唐人街和餐厅密集的地方，饭搭子才能随叫随到。', en: 'You are everyone\'s food radar. Live near Chinatown and plenty of restaurants so dinner plans are always on.' },
          traits: { zh: ['#美食雷达', '#火锅局', '#探店'], en: ['#FoodRadar', '#HotpotNights', '#NewSpots'] }, w: { asian10: 2, rest10: 1, super: -0.5 } },
        study: { stamp: '📖', name: { zh: '学习搭子', en: 'Study Buddy' }, tag: { zh: '一起卷，一起毕业', en: 'Grind together, graduate together' },
          desc: { zh: '有你在，ddl 不再可怕。离图书馆和咖啡馆近，约学习说走就走。', en: 'With you, deadlines are less scary. Near libraries and cafés, study sessions start in minutes.' },
          traits: { zh: ['#图书馆约', '#笔记共享', '#ddl战友'], en: ['#LibraryDates', '#SharedNotes', '#DeadlineSquad'] }, w: { lib: -1.5, cafe10: 1, uol: -1 } },
        gym: { stamp: '🏋️', name: { zh: '运动搭子', en: 'Workout Buddy' }, tag: { zh: '早上七点，公园见', en: 'See you in the park at 7am' },
          desc: { zh: '你是大家的自律担当。离健身房和公园近，晨跑和撸铁都不用找借口。', en: 'You keep everyone disciplined. Close to a gym and a park, no excuses for the morning run.' },
          traits: { zh: ['#自律', '#晨跑', '#撸铁'], en: ['#Disciplined', '#MorningRun', '#GymTime'] }, w: { gym: -2, park: -1 } },
        art: { stamp: '🎨', name: { zh: '逛展搭子', en: 'Culture Buddy' }, tag: { zh: '城市就是你的美术馆', en: 'The city is your gallery' },
          desc: { zh: '你总能找到最好看的地方。住在博物馆、剧场和咖啡馆附近，每个周末都有新灵感。', en: 'You always find the best-looking places. Near museums, theatres and cafés, every weekend brings something new.' },
          traits: { zh: ['#看展', '#文艺', '#拍照好看'], en: ['#Exhibitions', '#Arty', '#GoodAngles'] }, w: { culture15: 2, cafe10: 0.5 } },
        night: { stamp: '🌙', name: { zh: '夜猫搭子', en: 'Night Owl Buddy' }, tag: { zh: '夜晚才刚刚开始', en: 'The night is young' },
          desc: { zh: '你是派对的灵魂。离 live 场地和夜宵近，散场回家也只要几步路。', en: 'The soul of the party. Close to venues and late-night food, home is a short walk away.' },
          traits: { zh: ['#live', '#夜宵', '#最后离场'], en: ['#LiveMusic', '#LateBites', '#LastToLeave'] }, w: { night10: 2, take10: 1 } }
      },
      /* 两种搭子的合拍度（对称） */
      match: { 'food-food': 93, 'study-study': 90, 'gym-gym': 91, 'art-art': 92, 'night-night': 95, 'food-night': 88, 'food-art': 82, 'food-study': 74, 'food-gym': 70,
        'study-art': 80, 'study-gym': 84, 'study-night': 58, 'gym-art': 72, 'gym-night': 63, 'art-night': 79 }
    },
    booking: {
      emoji: '🧭', booking: true, title: { zh: '订房决策人格：佛系、稳健、激进还是精算？', en: 'Your booking personality: zen, steady, bold or savvy?' },
      blurb: { zh: '5 题测你的订房风格，看看专家怎么帮你', en: '5 questions on how you book, and how experts can help' },
      kicker: { zh: '我的订房决策人格', en: 'My booking personality' },
      questions: [
        Q({ zh: '看到一套很心动的公寓', en: 'You find a home you love' }, [[{ zh: '先收藏，过阵子再说', en: 'Save it and come back later' }, 'zen'], [{ zh: '拉表格和另外两套对比', en: 'Put it in a spreadsheet against two others' }, 'steady'], [{ zh: '马上问能不能交定金', en: 'Ask about the deposit right away' }, 'bold'], [{ zh: '先算一年总价和账单', en: 'Work out the yearly total and bills first' }, 'savvy']]),
        Q({ zh: '你的住宿预算', en: 'Your housing budget' }, [[{ zh: '差不多就行', en: 'Roughly is fine' }, 'zen'], [{ zh: '定一个范围，严格执行', en: 'A range, strictly kept' }, 'steady'], [{ zh: '好房子可以多花一点', en: 'Worth paying more for a great room' }, 'bold'], [{ zh: '精确到每周多少镑', en: 'Down to the pound per week' }, 'savvy']]),
        Q({ zh: '签合同之前', en: 'Before signing the contract' }, [[{ zh: '大概看一下', en: 'A quick look' }, 'zen'], [{ zh: '逐条看，做笔记', en: 'Read every clause, take notes' }, 'steady'], [{ zh: '先锁房再研究', en: 'Lock the room, read later' }, 'bold'], [{ zh: '重点看押金和退租条款', en: 'Focus on deposit and break clauses' }, 'savvy']]),
        Q({ zh: '有人说"这套快满了"', en: 'Someone says "it\'s nearly full"' }, [[{ zh: '那就看别的', en: 'Then look at others' }, 'zen'], [{ zh: '先确认是真是假', en: 'Check whether it\'s true' }, 'steady'], [{ zh: '立刻下单', en: 'Book immediately' }, 'bold'], [{ zh: '先问有没有优惠', en: 'Ask about discounts first' }, 'savvy']]),
        Q({ zh: '你理想的订房时间', en: 'When you would like to book' }, [[{ zh: '开学前一个月', en: 'A month before term' }, 'zen'], [{ zh: '开学前半年', en: 'Six months before term' }, 'steady'], [{ zh: '预定一开放就订', en: 'The day bookings open' }, 'bold'], [{ zh: '等早鸟折扣', en: 'When early-bird deals land' }, 'savvy']])
      ],
      types: {
        zen: { stamp: '😌', name: { zh: '佛系躺平派', en: 'The Zen Booker' }, tag: { zh: '有房住就行，缘分到了就订', en: 'A roof is enough, book when it feels right' },
          desc: { zh: '你不焦虑，这很好。但热门公寓通常提前半年就满了，让专家帮你盯着，到时候再轻松做决定。', en: 'No stress, which is great. Popular homes fill up six months ahead though, so let the experts watch them for you.' },
          tip: { zh: '进群后告诉专家你的入学时间，他们会在合适的时候提醒你。', en: 'Tell the experts your start date in the group and they will remind you at the right time.' },
          traits: { zh: ['#随缘', '#不焦虑', '#有房就行'], en: ['#NoStress', '#GoWithIt', '#AnyRoomWorks'] }, w: { price: -1, rating: 0.5, uol: -0.5 } },
        steady: { stamp: '🗓️', name: { zh: '稳健计划派', en: 'The Steady Planner' }, tag: { zh: '货比三家，按清单一步步来', en: 'Compare, then follow the checklist' },
          desc: { zh: '你相信信息和时间线。把三套候选和预算发到群里，专家帮你排一个从看房到签约的时间表。', en: 'You trust information and timelines. Share your shortlist and budget, and the experts will map out viewing to signing.' },
          tip: { zh: '把收藏的 3 套公寓发到群里，专家帮你逐项对比账单、合同和档期。', en: 'Send your 3 saved homes to the group and the experts will compare bills, contracts and dates.' },
          traits: { zh: ['#计划通', '#对比表', '#稳'], en: ['#Planner', '#ComparisonTable', '#Steady'] }, w: { rating: 1.5, uol: -1, super: -0.5 } },
        bold: { stamp: '🚀', name: { zh: '激进早鸟派', en: 'The Bold Early Bird' }, tag: { zh: '开放预定第一天就要抢到最好的房', en: 'Bookings open, best room secured' },
          desc: { zh: '你行动力满分。最热门的独卫和 Studio 会最先满，让专家第一时间通知你开放时间。', en: 'Full marks for action. The most popular en-suites and studios go first, so let the experts tell you the moment they open.' },
          tip: { zh: '进群告诉专家你的目标房型，开放当天第一时间帮你锁房。', en: 'Tell the experts your target room type and they will help you lock it on opening day.' },
          traits: { zh: ['#行动派', '#早鸟', '#手快有手慢无'], en: ['#ActionTaker', '#EarlyBird', '#FastFingers'] }, w: { studio: 1.5, rating: 1, uol: -1.5 } },
        savvy: { stamp: '🧮', name: { zh: '精打细算派', en: 'The Savvy Saver' }, tag: { zh: '每一镑都要花在刀刃上', en: 'Every pound has a job' },
          desc: { zh: '你最懂性价比。账单包不包、合同多长、押金多少，都会影响总价，专家能帮你把账算清楚。', en: 'You know value. Bills, contract length and deposits all change the total; the experts can help you do the maths.' },
          tip: { zh: '告诉专家你的预算上限，让他们帮你找包账单、有早鸟优惠的房型。', en: 'Give the experts your budget cap and they will look for bills-included rooms and early-bird offers.' },
          traits: { zh: ['#性价比', '#精算', '#早鸟折扣'], en: ['#Value', '#DoTheMaths', '#EarlyBirdDeals'] }, w: { price: -2.5, super: -1, take10: 0.5 } }
      }
    }
  };
  /* 每个选项的小图标（与生活选房的答题卡一样：图标 + 选项） */
  const EMO = {
    ie: [['🍲', '📺', '🍻', '🎧'], ['🙋', '🙂', '🥟', '🕰️'], ['🛍️', '🌳', '🎭', '😴'], ['📊', '🛬', '🏠', '📱'], ['📝', '🍟', '💳', '🥢'], ['✅', '🌙', '🗓️', '🚶']],
    soft: [['😴', '🕯️', '📸', '🪪'], ['🍵', '☕', '⚽', '📚'], ['🪴', '🛁', '🚉', '🪑'], ['🌇', '🥐', '🗺️', '🌃'], ['🌈', '💐', '✈️', '💼']],
    buddy: [['🍲', '📖', '🏃', '🖼️', '🎸'], ['🍜', '📝', '💪', '🏛️', '🌃'], ['🍽️', '📚', '⏰', '📍', '🕺'], ['🍚', '🎧', '👟', '🎫', '🔊'], ['👩‍🍳', '☕', '🏀', '🎭', '🎶']],
    booking: [['⭐', '📊', '💷', '🧮'], ['🤷', '📏', '💎', '🪙'], ['👀', '🖊️', '🔒', '🔍'], ['🔄', '🕵️', '⚡', '🏷️'], ['📅', '🗓️', '🚀', '🐦']]
  };
  Object.keys(EMO).forEach(id => QUIZZES[id].questions.forEach((q, i) => q.opts.forEach((o, j) => { o.e = (EMO[id][i] || [])[j] || '•'; })));

  const UI = {
    zh: { more: '更多好玩的测试', hubKicker: '利物浦 · 留学人格测试', hubTitle: '测测你是哪种利物浦留学生', hubLead: '和「生活选房」一样：点选项自动进入下一题，测完在地图上标出适合你的 3 处公寓，还能生成分享卡片。', home: '生活选房', homeBlurb: '8 题，按日常生活推荐公寓',
      start: '开始测试', last: '查看上次结果', all: '← 全部测试', back: '上一步', next: '下一题', finish: '生成我的结果卡', question: '第 {i} / {n} 题', picks: '适合你的 3 处公寓', map: '地图看看', card: '公寓详情', ask: '进群咨询',
      first: '优先看看这一处', also: '也值得放进备选', no: '地图编号', fits: '根据你的类型，优先参考这些配套', share: '生成分享卡片', invite: '邀请朋友测合拍度', copyLink: '复制测试链接', copied: '链接已复制，发给朋友吧',
      again: '再测一个', mini: '收起看地图', expand: '展开结果卡', close: '关闭', tip: '专家建议', duoIntro: '你的朋友是「{name}」，测测你们有多合拍？', duoTitle: '你和朋友的合拍度', duoHomes: '适合你们一起合租的 3 处公寓',
      note: '趣味测试，不是科学人格测试。公寓按地图上的步行时间和周边设施推荐，价格为历史参考，不代表实时空房。', intro: '点选项会自动进入下一题，答案只保存在当前浏览器。', scan: '扫码测测你是哪种类型',
      shareText: '我测出来是「{name}」，你也来测测：', inviteText: '我是「{name}」，来测测我们有多合拍：' },
    en: { more: 'More fun quizzes', hubKicker: 'Liverpool · Student personality quizzes', hubTitle: 'What kind of Liverpool student are you?', hubLead: 'Just like Home Match: tap an answer to move on, then see 3 homes for you on the map and make a share card.', home: 'Home Match', homeBlurb: '8 questions, homes that fit your days',
      start: 'Start', last: 'See last result', all: '← All quizzes', back: 'Back', next: 'Next', finish: 'Make my result card', question: 'Question {i} of {n}', picks: '3 homes for you', map: 'On the map', card: 'Home details', ask: 'Join my group',
      first: 'Start with this one', also: 'Also worth a look', no: 'Map no.', fits: 'Picked for your type', share: 'Make a share card', invite: 'Check your match with a friend', copyLink: 'Copy quiz link', copied: 'Link copied. Send it to a friend',
      again: 'Try another', mini: 'Fold to see the map', expand: 'Open result card', close: 'Close', tip: 'Expert tip', duoIntro: 'Your friend is "{name}". How well do you match?', duoTitle: 'Your match with your friend', duoHomes: '3 homes you could share',
      note: 'Just for fun, not a scientific personality test. Homes are suggested from walking times and nearby places on the map; prices are recorded, not live availability.', intro: 'Tap an answer to move on. Answers stay in this browser.', scan: 'Scan to find your own type',
      shareText: 'I got "{name}". Find yours: ', inviteText: 'I\'m "{name}". See how well we match: ' }
  };

  function typeOf(q, answers) {
    const sc = {}; answers.forEach((a, i) => { const v = q.questions[i].opts[a].v; sc[v] = (sc[v] || 0) + 1; });
    if (q.result) return q.result(sc);
    return Object.keys(q.types).sort((a, b) => (sc[b] || 0) - (sc[a] || 0))[0];
  }

  return { QUIZZES, UI, recommend, blend, typeOf, minPrice, tx, fmt, L };
};
