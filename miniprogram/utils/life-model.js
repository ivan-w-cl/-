/* 自动生成，请勿手改：node scripts/extract-data.cjs。原样复制自网页版 life-c-model.js */
var __root = {};
/* Version C · Liverpool Life Quiz: 6 everyday scenarios -> one of 15 lifestyle characters.
   A playful summary of six choices, not a personality test. No campus, budget or contact details are asked here. */
(function (root) {
  'use strict';

  // Lifestyle traits (5) and food styles (3). A character is "The {life word} {food word}".
  var LIFE = {
    library: { word: 'Library-Loving', icon: '📚', color: '#e0e7cf', keyword: 'library study sessions',
      morning: ['10:00', 'A window seat in the Picton Reading Room', 'Central Library on William Brown Street. Free, quiet, beautiful.'] },
    cafe: { word: 'Café-Hopping', icon: '☕', color: '#f1dcc8', keyword: 'café working',
      morning: ['10:00', 'Laptop open in a Bold Street café', 'A flat white, a window table, the essay slowly taking shape.'] },
    air: { word: 'Fresh-Air', icon: '🌳', color: '#dce8df', keyword: 'fresh air',
      morning: ['08:00', 'A lap of Princes Park before class', 'Clear head first, lectures after.'] },
    culture: { word: 'Culture-Chasing', icon: '🎨', color: '#ecd4de', keyword: 'galleries and gigs',
      morning: ['12:00', 'Lunch break in the Walker Art Gallery', 'Free entry, five minutes from Lime Street.'] },
    night: { word: 'Night-Owl', icon: '🌙', color: '#d9dfe8', keyword: 'late nights',
      morning: ['11:00', 'First coffee. Mornings are a rumour', 'The day starts when it starts.'] }
  };
  var LIFE_ORDER = ['library', 'cafe', 'air', 'culture', 'night'];
  var FOOD = {
    cook: { word: 'Home Chef', icon: '🍳', keyword: 'home cooking',
      evening: ['19:00', 'Something good on the hob', 'Flatmates hovering, asking what smells so good.'] },
    out: { word: 'Foodie', icon: '🍜', keyword: 'trying new places',
      evening: ['19:00', 'A new table on Bold Street or in Chinatown', 'There is always one more place on the list.'] },
    takeaway: { word: 'Takeaway Connoisseur', icon: '🥡', keyword: 'takeaway nights',
      evening: ['21:00', 'Takeaway, sofa, the next episode', 'Zero washing up. No regrets.'] }
  };

  var QUOTES = {
    'library-cook': 'The essay can wait for another revision. A good dinner can’t.',
    'library-out': 'Study hard, then eat somewhere new. That’s the deal.',
    'library-takeaway': 'Chapter four done. Noodles are on their way.',
    'cafe-cook': 'Flat white by day, risotto by night. Balance.',
    'cafe-out': 'Rate every café on Bold Street? Already on it.',
    'cafe-takeaway': 'Laptop open until closing time, chips on the walk home.',
    'air-cook': 'A morning lap of the park, a pot of something good by six.',
    'air-out': 'Walk the waterfront, earn the dinner.',
    'air-takeaway': 'Ten thousand steps. I’ve earned this delivery.',
    'culture-cook': 'Gallery in the afternoon, cooking up a storm by evening.',
    'culture-out': 'A gig, a new restaurant, a story for Monday.',
    'culture-takeaway': 'Front row at the gig, chips on the way home.',
    'night-cook': 'Everyone ends up at mine, and I’m cooking.',
    'night-out': 'Table booked for eight, plans until whenever.',
    'night-takeaway': 'Home at 2am. The noodle shop already knows my order.'
  };

  function opt(id, icon, label, detail, pts, one, both, extra) {
    var o = { id: id, icon: icon, label: label, detail: detail, pts: pts || {}, one: one, both: both };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  // one = "one of you ___"; both = "you both ___"
  var QUESTIONS = [
    { id: 'friday', title: 'You unexpectedly have two free hours after class on Friday. Where do you go?', opening: 'With two free hours on Friday', options: [
      opt('cafe', '☕', 'A corner table in a Bold Street café', 'Coffee, people-watching, maybe some reading', { cafe: 2 }, 'grabs a corner table on Bold Street', 'grab a corner table on Bold Street'),
      opt('library', '📚', 'The Picton Reading Room at Central Library', 'The domed reading room everyone photographs', { library: 2 }, 'heads to the Picton Reading Room', 'head to the Picton Reading Room'),
      opt('dock', '⚓', 'A slow walk along the Albert Dock waterfront', 'River air and old warehouses', { air: 2 }, 'walks the Albert Dock waterfront', 'walk the Albert Dock waterfront'),
      opt('gallery', '🎨', 'A gallery, a record shop, whatever’s on', 'Something new to look at or listen to', { culture: 2 }, 'goes looking for a gallery or record shop', 'go looking for a gallery or record shop')
    ] },
    { id: 'dinner', title: 'It’s 7pm and you’re starving. What happens next?', opening: 'At 7pm', options: [
      opt('cook', '🍳', 'I cook something properly', 'A real dinner, maybe enough for tomorrow', {}, 'cooks something properly', 'cook something properly', { food: 'cook' }),
      opt('out', '🍜', 'Out with friends to try somewhere new', 'There’s a place on Bold Street I keep hearing about', {}, 'goes out to try somewhere new', 'go out to try somewhere new', { food: 'out' }),
      opt('takeaway', '🥡', 'Takeaway, sofa, next episode', 'Zero washing up', {}, 'orders a takeaway to the sofa', 'order a takeaway to the sofa', { food: 'takeaway' })
    ] },
    { id: 'essay', title: 'An essay is due on Monday. Where does it get written?', opening: 'When an essay is due', options: [
      opt('library', '📚', 'In the library, phone in my bag', 'Silent floor, no distractions', { library: 2 }, 'heads to the library', 'head to the library'),
      opt('cafe', '☕', 'In a café with a flat white', 'A little background noise helps', { cafe: 2 }, 'finds a café', 'find a café'),
      opt('desk', '🎧', 'At my own desk, headphones on', 'My room, my playlist', { library: 1 }, 'stays at their own desk', 'stay at your own desks'),
      opt('lastnight', '🌙', 'The night before, with friends and snacks', 'Pressure is a great motivator', { night: 1 }, 'writes it the night before with friends', 'write it the night before with friends')
    ] },
    { id: 'saturday', title: 'A free Saturday afternoon looks like…', opening: 'On a free Saturday', options: [
      opt('park', '🌳', 'A picnic or a run in Sefton Park', 'The Palm House if it rains', { air: 2 }, 'is in Sefton Park', 'are in Sefton Park', { act: 'a picnic in Sefton Park', kw: 'unwinding in the park at weekends', sat: ['Saturday', 'A picnic in Sefton Park', 'The Palm House if it rains.'] }),
      opt('museum', '🎟️', 'The Museum of Liverpool, then a gig', 'Pier Head by day, live music by night', { culture: 2 }, 'is at the museum, then a gig', 'are at the museum, then a gig', { act: 'the Museum of Liverpool, then a gig', kw: 'museum-and-gig Saturdays', sat: ['Saturday', 'Museum of Liverpool at the Pier Head', 'Then a gig somewhere in town.'] }),
      opt('wander', '🧭', 'Wandering Lark Lane or the Baltic Triangle', 'Little shops, street art, somewhere for lunch', { culture: 1, cafe: 1 }, 'is wandering Lark Lane or the Baltic Triangle', 'are wandering Lark Lane or the Baltic Triangle', { act: 'wandering Lark Lane and the Baltic Triangle', kw: 'wandering new streets', sat: ['Saturday', 'Lark Lane cafés, then the Baltic Triangle', 'No plan, just good streets.'] }),
      opt('sport', '⚽', 'Five-a-side or the gym', 'Moving is the best way to switch off', { air: 1 }, 'is playing five-a-side or at the gym', 'are playing five-a-side or at the gym', { act: 'five-a-side or the gym', kw: 'weekend sport', sat: ['Saturday', 'Five-a-side, then a well-earned brunch', 'Muddy boots optional.'] })
    ] },
    { id: 'night', title: 'And after dark?', opening: 'After dark', options: [
      opt('early', '🛏️', 'Early night, big day tomorrow', 'Future me will thank me', { library: 1 }, 'has an early night', 'have an early night'),
      opt('one', '🫖', 'One drink, then home', 'A catch-up, nothing wild', { cafe: 1, culture: 1 }, 'has one drink, then heads home', 'have one drink, then head home'),
      opt('late', '🪩', 'Out until the city goes quiet', 'Liverpool knows how to do a night out', { night: 3 }, 'stays out until the city goes quiet', 'stay out until the city goes quiet')
    ] },
    { id: 'firstweek', title: 'Your first week in a new city. You…', opening: 'In a new city', options: [
      opt('explore', '🗺️', 'Explore every street you can find', 'Getting lost is half the fun', { culture: 1, air: 1 }, 'explores every street', 'explore every street'),
      opt('regular', '🏡', 'Find your regular spots and settle in', 'Your café, your supermarket, your route', { cafe: 1, library: 1 }, 'finds their regular spots', 'find your regular spots'),
      opt('chat', '💬', 'Start the group chat and plan a night out', 'Someone has to', { night: 2 }, 'starts the group chat', 'start the group chat')
    ] }
  ];
  var N = QUESTIONS.length;

  var PLAN_END = {
    'cook|cook': 'then back to one of your kitchens to cook together.',
    'out|out': 'then a new table in Chinatown.',
    'takeaway|takeaway': 'then order in and argue over the film.',
    'cook|out': 'then ingredients from Chinatown and dinner at whoever’s is closer.',
    'cook|takeaway': 'then one of you cooks and the other brings dessert.',
    'out|takeaway': 'then street food on Bold Street, eaten on the walk.'
  };

  function valid(a) {
    if (!Array.isArray(a) || a.length !== N) return false;
    for (var i = 0; i < N; i++) if (!(Number.isInteger(a[i]) && a[i] >= 0 && a[i] < QUESTIONS[i].options.length)) return false;
    return true;
  }
  function pick(a, i) { return QUESTIONS[i].options[a[i]]; }

  function lifeOf(a) {
    var score = { library: 0, cafe: 0, air: 0, culture: 0, night: 0 };
    a.forEach(function (v, i) { var p = QUESTIONS[i].options[v].pts; for (var k in p) score[k] += p[k]; });
    var max = Math.max.apply(null, LIFE_ORDER.map(function (k) { return score[k]; }));
    var tied = LIFE_ORDER.filter(function (k) { return score[k] === max; });
    if (tied.length === 1) return tied[0];
    // ties: the Saturday answer wins, then the Friday answer, then the fixed order
    var tb = [pick(a, 3).pts, pick(a, 0).pts];
    for (var t = 0; t < tb.length; t++) {
      var best = tied.slice().sort(function (x, y) { return (tb[t][y] || 0) - (tb[t][x] || 0); });
      if ((tb[t][best[0]] || 0) > (tb[t][best[1]] || 0)) return best[0];
    }
    return tied[0];
  }

  function result(a) {
    if (!valid(a)) return null;
    var life = lifeOf(a), food = pick(a, 1).food, L = LIFE[life], F = FOOD[food], sat = pick(a, 3);
    var id = life + '-' + food;
    var name = characterName(life, food);
    var keywords = [F.keyword, L.keyword, sat.kw];
    return {
      id: id, life: life, food: food, name: name, icons: L.icon + F.icon, color: L.color,
      quote: QUOTES[id], keywords: keywords, tags: keywords,
      english: language === 'zh' ? name : name.toUpperCase(),
      description: language === 'zh' ? '你的生活关键词：' + keywords.join('、') + '。这是六个选择组成的趣味生活画像，不是性格测试。' : 'Your lifestyle keywords: ' + keywords.join(', ') + '. A playful summary of six choices, not a personality test.',
      day: [L.morning, sat.sat, F.evening],
      answers: a.slice()
    };
  }

  function allCharacters() {
    var out = [];
    LIFE_ORDER.forEach(function (l) { ['cook', 'out', 'takeaway'].forEach(function (f) {
      out.push({ id: l + '-' + f, life: l, food: f, name: characterName(l, f), icons: LIFE[l].icon + FOOD[f].icon, color: LIFE[l].color, quote: QUOTES[l + '-' + f] });
    }); });
    return out;
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // "Where we're alike / where we differ" from the actual choices. No score.
  function compare(a, b) {
    if (!valid(a) || !valid(b)) return null;
    var same = [], diff = [];
    QUESTIONS.forEach(function (q, i) {
      var x = q.options[a[i]], y = q.options[b[i]];
      if (a[i] === b[i]) same.push(language === 'zh' ? q.opening + '，你们都会' + x.both + '。' : q.opening + ', you both ' + x.both + '.');
      else diff.push(language === 'zh' ? q.opening + '，你们中的一个会' + x.one + '；另一个会' + y.one + '。' : q.opening + ', one of you ' + x.one + '; the other ' + y.one + '.');
    });
    var sa = pick(a, 3), sb = pick(b, 3), fa = pick(a, 1).food, fb = pick(b, 1).food;
    var key = [fa, fb].sort(function (x, y) { return ['cook', 'out', 'takeaway'].indexOf(x) - ['cook', 'out', 'takeaway'].indexOf(y); }).join('|');
    var plan = a[3] === b[3] ? 'Saturday sorted: ' + sa.act + ' together, ' + PLAN_END[key]
      : 'Morning: ' + sa.act + '. Afternoon: ' + sb.act + '. Then ' + PLAN_END[key].replace(/^then /, '');
    if (language === 'zh') plan = a[3] === b[3] ? '周六安排好了：一起' + sa.act + '，' + PLAN_END[key] : '上午：' + sa.act + '。下午：' + sb.act + '。' + PLAN_END[key];
    else plan = cap(plan);
    return { same: same, different: diff, plan: plan, sameCount: same.length, total: N,
      none: same.length === 0 ? (language === 'zh' ? '六道题你们都选得不一样，正好交换彼此的推荐。' : 'You’re opposites on all six. Perfect for swapping recommendations.') : '' };
  }

  // share codes: c1.<6 digits>; a pair is c1.<mine>~<theirs>
  function encode(a) { return valid(a) ? 'c1.' + a.join('') : ''; }
  function decode(code) {
    var m = /^c1\.([0-9]{6})$/.exec(String(code || ''));
    if (!m) return null;
    var a = m[1].split('').map(Number);
    return valid(a) ? a : null;
  }
  function decodeHash(hash) {
    var h = String(hash || '').replace(/^#/, '');
    var q = /(?:^|&)friend=([^&]+)/.exec(h); if (q) h = decodeURIComponent(q[1]);
    var pair = /^c1\.([0-9]{6})~([0-9]{6})$/.exec(h);
    if (pair) { var x = decode('c1.' + pair[1]), y = decode('c1.' + pair[2]); return x && y ? { pair: [x, y] } : null; }
    var one = decode(h); return one ? { friend: one } : null;
  }

  /* Hidden map signals: the six answers become the Home Match settings used by the map.
     Campus, walking distance and food-nearby choices come only from the optional "where to live" step. */
  function toMapAnswers(a, extra) {
    if (!valid(a)) return null;
    extra = extra || {};
    var food = pick(a, 1).food, free = [];
    var addFree = function (v) { if (v && free.indexOf(v) === -1 && free.length < 2) free.push(v); };
    addFree({ park: 'park', museum: 'culture', wander: 'shops', sport: 'gym' }[pick(a, 3).id]);
    addFree({ dock: 'park', gallery: 'culture', cafe: null, library: null }[pick(a, 0).id]);
    if (!free.length) free.push('home');
    var flavour = Array.isArray(extra.flavour) && extra.flavour.length ? extra.flavour.slice(0, 3) : ['any'];
    return {
      campus: extra.campus || 'unsure',
      dinner: food,
      shop: food === 'cook' ? (flavour.indexOf('east') > -1 || flavour.indexOf('south') > -1 ? 'special' : 'weekly') : food === 'takeaway' ? 'topup' : 'rarely',
      flavour: flavour,
      study: { library: 'library', cafe: 'cafe', desk: 'desk', lastnight: 'any' }[pick(a, 2).id],
      free: free,
      night: { early: 'calm', one: 'some', late: 'lots' }[pick(a, 4).id],
      walk: extra.walk || 'far'
    };
  }

  var NEIGHBOURHOOD = {
    library: ['Knowledge Quarter & London Road', 'Closest to the main university libraries.'],
    cafe: ['Lime Street & Ropewalks', 'Bold Street’s cafés on your doorstep.'],
    air: ['Georgian Quarter & Chinatown', 'The nearest homes to Princes Park and the route to Sefton Park.'],
    culture: ['Lime Street & Ropewalks', 'Walking distance to museums, galleries and venues.'],
    night: ['City Centre and Ropewalks', 'The most bars and venues within a 10-minute walk.']
  };

  // Only display copy is localized. Choice IDs, scores and c1 share codes are language-independent.
  // Keep the exposed object/array identities stable for consumers holding references to them.
  var language = 'en';
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  var EN = { life: clone(LIFE), food: clone(FOOD), questions: clone(QUESTIONS), quotes: clone(QUOTES), plans: clone(PLAN_END), neighbourhood: clone(NEIGHBOURHOOD) };
  var ZH = clone(EN);

  var ZH_LIFE = {
    library: { word: '图书馆常客', keyword: '图书馆自习', morning: ['10:00', '在皮克顿阅览室找一个靠窗座位', '威廉·布朗街上的中央图书馆，免费、安静又漂亮。'] },
    cafe: { word: '咖啡馆漫游者', keyword: '咖啡馆办公', morning: ['10:00', '在博尔德街的咖啡馆打开电脑', '一杯馥芮白，一张靠窗桌，论文慢慢成形。'] },
    air: { word: '户外爱好者', keyword: '户外新鲜空气', morning: ['08:00', '上课前先绕王子公园一圈', '先让头脑清醒，再去听课。'] },
    culture: { word: '文艺探索家', keyword: '画廊与现场演出', morning: ['12:00', '午休去沃克美术馆逛逛', '免费入场，距莱姆街车站步行约五分钟。'] },
    night: { word: '夜猫子', keyword: '夜间生活', morning: ['11:00', '第一杯咖啡，早晨仿佛只是传说', '想什么时候开始，就什么时候开始。'] }
  };
  var ZH_FOOD = {
    cook: { word: '居家大厨', keyword: '自己下厨', evening: ['19:00', '炉灶上正煮着好吃的', '室友闻着香味凑过来，问你在做什么。'] },
    out: { word: '探店美食家', keyword: '探索新餐馆', evening: ['19:00', '去博尔德街或唐人街试一家新店', '收藏清单里总有下一家想去的餐馆。'] },
    takeaway: { word: '外卖鉴赏家', keyword: '外卖之夜', evening: ['21:00', '外卖、沙发，再看一集', '不用洗碗，快乐加倍。'] }
  };
  Object.keys(ZH_LIFE).forEach(function (key) { Object.assign(ZH.life[key], ZH_LIFE[key]); });
  Object.keys(ZH_FOOD).forEach(function (key) { Object.assign(ZH.food[key], ZH_FOOD[key]); });
  ZH.quotes = {
    'library-cook': '论文还可以再改一版，好好吃饭可不能等。',
    'library-out': '认真学习，然后去一家新餐馆，就这么说定了。',
    'library-takeaway': '第四章写完了，面条也快送到了。',
    'cafe-cook': '白天喝馥芮白，晚上做烩饭，生活刚刚好。',
    'cafe-out': '给博尔德街每家咖啡馆打分？已经开始了。',
    'cafe-takeaway': '抱着电脑坐到咖啡馆打烊，回家路上买份薯条。',
    'air-cook': '早上绕公园一圈，傍晚六点锅里就有好吃的。',
    'air-out': '沿河边散散步，再犒劳自己一顿晚餐。',
    'air-takeaway': '今天走了一万步，这份外卖我值得。',
    'culture-cook': '下午逛画廊，晚上在厨房大显身手。',
    'culture-out': '一场演出，一家新餐馆，周一又有故事可讲。',
    'culture-takeaway': '看演出站前排，回家路上吃薯条。',
    'night-cook': '最后大家都来我家，而我负责下厨。',
    'night-out': '八点订好了餐桌，之后玩到几点再说。',
    'night-takeaway': '凌晨两点回家，面馆老板已经知道我要点什么。'
  };

  // Each option supplies label, detail and a verb phrase used in friend comparisons.
  var ZH_QUESTIONS = [
    { title: '周五下课后，突然空出两个小时。你会去哪儿？', opening: '周五空出两小时的时候', options: [
      ['博尔德街咖啡馆的角落桌', '喝咖啡、看看路人，也许读会儿书', '在博尔德街找张角落桌'],
      ['中央图书馆的皮克顿阅览室', '就是大家都会拍照的圆顶阅览室', '去皮克顿阅览室'],
      ['沿阿尔伯特码头慢慢散步', '吹吹河风，看看老仓库', '沿阿尔伯特码头散步'],
      ['画廊、唱片店，有什么就逛什么', '找点新鲜的东西看看或听听', '去找画廊或唱片店']
    ] },
    { title: '晚上七点，肚子饿了。接下来怎么安排？', opening: '到了晚上七点', options: [
      ['认真给自己做顿饭', '好好吃一顿，也许顺便做出明天的份', '认真做顿饭'],
      ['和朋友出去试一家新餐馆', '博尔德街有家店，听人推荐好几次了', '出门试一家新餐馆'],
      ['点外卖、窝沙发，再看一集', '不用洗碗', '点份外卖窝在沙发上吃']
    ] },
    { title: '周一要交论文，你会在哪儿写？', opening: '要赶论文的时候', options: [
      ['图书馆，手机收进包里', '安静楼层，不受打扰', '去图书馆'],
      ['咖啡馆，再来一杯馥芮白', '一点背景音反而更容易专注', '找家咖啡馆'],
      ['自己的书桌前，戴上耳机', '自己的房间，自己的歌单', '待在自己的书桌前'],
      ['截止前一晚，和朋友一起备好零食', '压力就是最好的动力', '前一晚和朋友一起赶论文']
    ] },
    { title: '空闲的周六下午，你想这样度过……', opening: '空闲的周六', options: [
      ['去塞夫顿公园野餐或跑步', '下雨就去棕榈温室', '去塞夫顿公园'],
      ['先逛利物浦博物馆，再看演出', '白天逛码头顶，晚上听现场音乐', '先逛博物馆，再去看演出'],
      ['逛逛拉克巷或波罗的海三角区', '小店、街头艺术，再找个地方吃午饭', '闲逛拉克巷或波罗的海三角区'],
      ['踢五人制足球，或者去健身房', '运动最能让大脑放松', '踢五人制足球或去健身房']
    ] },
    { title: '天黑以后呢？', opening: '天黑以后', options: [
      ['早点睡，明天还有好多事', '明天的自己会感谢我', '早早睡觉'],
      ['喝一杯就回家', '聊聊天，不用太疯狂', '喝一杯就回家'],
      ['玩到整座城市安静下来', '利物浦的夜生活可不会让人失望', '玩到整座城市安静下来']
    ] },
    { title: '来到新城市的第一周，你会……', opening: '来到新城市', options: [
      ['尽可能多地探索每一条街', '迷路也是乐趣的一半', '探索每一条街'],
      ['找到常去的地方，慢慢安顿下来', '熟悉的咖啡馆、超市和路线', '找到自己常去的地方'],
      ['建个群，约大家一起出去玩', '总得有人来张罗', '建个群约大家出去玩']
    ] }
  ];
  ZH_QUESTIONS.forEach(function (q, i) {
    ZH.questions[i].title = q.title;
    ZH.questions[i].opening = q.opening;
    q.options.forEach(function (o, j) {
      Object.assign(ZH.questions[i].options[j], { label: o[0], detail: o[1], one: o[2], both: o[2] });
    });
  });
  var ZH_SATURDAY = [
    { act: '去塞夫顿公园野餐', kw: '周末在公园放松', sat: ['周六', '去塞夫顿公园野餐', '下雨就去棕榈温室。'] },
    { act: '逛利物浦博物馆，再看一场演出', kw: '博物馆与演出的周六', sat: ['周六', '逛码头顶的利物浦博物馆', '然后去市区看一场演出。'] },
    { act: '闲逛拉克巷和波罗的海三角区', kw: '探索陌生街道', sat: ['周六', '先逛拉克巷咖啡馆，再去波罗的海三角区', '不用计划，沿着喜欢的街走就好。'] },
    { act: '踢五人制足球或去健身房', kw: '周末运动', sat: ['周六', '踢完五人制足球，再吃顿早午餐', '鞋上沾点泥也没关系。'] }
  ];
  ZH_SATURDAY.forEach(function (sat, i) { Object.assign(ZH.questions[3].options[i], sat); });
  ZH.plans = {
    'cook|cook': '然后回其中一人的厨房，一起做饭。',
    'out|out': '然后去唐人街试一家新餐馆。',
    'takeaway|takeaway': '然后点外卖，商量今晚看哪部电影。',
    'cook|out': '然后去唐人街买食材，谁家近就去谁家做饭。',
    'cook|takeaway': '然后一个人做饭，另一个人带甜点。',
    'out|takeaway': '然后在博尔德街买点街头小吃，边走边吃。'
  };
  ZH.neighbourhood = {
    library: ['知识区与伦敦路', '离主要大学图书馆最近。'],
    cafe: ['莱姆街与绳索街区', '出门就能逛博尔德街的咖啡馆。'],
    air: ['乔治亚街区与唐人街', '这些住处离王子公园和通往塞夫顿公园的路线最近。'],
    culture: ['莱姆街与绳索街区', '步行可到博物馆、画廊和演出场所。'],
    night: ['市中心与绳索街区', '步行十分钟内，酒吧与演出场所最集中。']
  };
  function applyCopy(target, source) {
    Object.keys(source).forEach(function (key) {
      if (source[key] && typeof source[key] === 'object') applyCopy(target[key], source[key]);
      else target[key] = source[key];
    });
  }
  function characterName(life, food) {
    return language === 'zh' ? LIFE[life].word + ' · ' + FOOD[food].word : 'The ' + LIFE[life].word + ' ' + FOOD[food].word;
  }
  function setLanguage(lang) {
    language = /^zh(?:$|[-_])/i.test(String(lang || 'en')) ? 'zh' : 'en';
    var copy = language === 'zh' ? ZH : EN;
    applyCopy(LIFE, copy.life);
    applyCopy(FOOD, copy.food);
    applyCopy(QUESTIONS, copy.questions);
    applyCopy(QUOTES, copy.quotes);
    applyCopy(PLAN_END, copy.plans);
    applyCopy(NEIGHBOURHOOD, copy.neighbourhood);
    model.language = language;
    return model;
  }

  var model = {
    variant: 'life', language: language, setLanguage: setLanguage, questions: QUESTIONS, life: LIFE, food: FOOD, lifeOrder: LIFE_ORDER,
    valid: valid, result: result, allCharacters: allCharacters, compare: compare,
    encode: encode, decode: decode, decodeHash: decodeHash, toMapAnswers: toMapAnswers, neighbourhood: NEIGHBOURHOOD,
    sample: [1, 0, 0, 0, 0, 1]
  };
  root.LifeCModel = model;

  // Let the shared map result understand this version's answers.
  var base = root.LifeMapModel;
  if (base) {
    root.LifeMapModel = Object.freeze({
      toMapAnswers: function (answers, variant) {
        if (variant === 'life') return answers && answers.answers ? toMapAnswers(answers.answers, answers.extra) : null;
        return base.toMapAnswers(answers, variant);
      },
      explanation: function (answers, variant) {
        if (variant === 'life' && language === 'zh') return '生活测试根据六个日常选择所对应的地点（咖啡馆、图书馆、公园、食品杂货店和夜生活场所），结合你在这一步选择的校区与步行距离，为地图上的住处排序。这里不询问预算，请到各房源页面查看价格。';
        if (variant === 'life') return 'Version C ranks homes on the map by the everyday places your six choices point to (cafés, libraries, parks, groceries, nightlife), plus the campus and walking distance you chose in this step. Budget is not asked; check prices on each listing.';
        return base.explanation(answers, variant);
      }
    });
  }
})(__root);

module.exports = __root.LifeCModel;
