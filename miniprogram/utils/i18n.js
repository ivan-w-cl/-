'use strict';
var S = {
  zh: {
    appName: '利物浦学生生活地图', lifeQuiz: '生活测试', homeQuiz: '找房测试', lifeQuizSub: '6 道情景题 · 测你的利物浦生活角色',
    homeQuizSub: '8 道题 · 按日常生活找公寓', homes: '公寓列表', search: '输入名称、街道或编号…', budget: '每周预算', room: '房型',
    walk: '步行到利大', any: '不限', ensuite: '独卫单间', studio: 'Studio 套间', favOnly: '只看收藏', count: '找到 {n} / 47 处公寓',
    empty: '没有符合这些条件的公寓。', reset: '重置筛选', minutes: '{n} 分钟', walkUol: '步行到利大约 {n} 分钟', fromWeek: '£{v}/周起',
    noPrice: '暂无参考价', soldOut: '历史记录无房', yourTop3: '你的推荐 Top 3', viewResult: '查看结果', showAll: '显示全部',
    question: '第 {i} 题 / 共 {n} 题', back: '上一题', next: '下一题', finish: '看结果', multiHint: '可多选', start: '开始 · 约 2 分钟',
    homeIntro: '回答 8 个关于校区、吃饭、学习和周末的小问题，按你的日常生活推荐 3 处公寓。答案只保存在本机。',
    lifeIntro: '六个日常情景，测出你在利物浦的生活角色，并顺便推荐 3 处适合你的公寓。这是趣味画像，不是性格测试。',
    extraCampus: '最后两步：你主要在哪个校区上课？', extraWalk: '你愿意步行多久去上课？',
    resultTitle: '你的利物浦找房卡', top3: '推荐的 3 处公寓', compare3: '对比这三套', onMap: '在地图上看', consult: '咨询顾问',
    retake: '重新测试', tradeoff: '需要取舍', reasons: '推荐理由', compare: '对比', detail: '详情', fav: '收藏', faved: '已收藏',
    addCompare: '加入对比', inCompare: '已在对比中', navigate: '打开导航', nearby: '周边设施（估算步行）', prices: '参考价格（历史记录）',
    rating: '评分', reviews: '{n} 条评价', walks: '步行时间（按直线距离估算）', uol: '利物浦大学', ljmu: '最近的 LJMU 校区', lime: '莱姆街火车站', centre: '市中心',
    priceNote: '价格与评分为网页版记录的历史参考（Amber，2026-10-17 核对），不是实时库存，请以房东官网为准。',
    walkNote: '步行时间按直线距离估算，并非实时路线。', lang: 'EN',
    consultTitle: '咨询住宿顾问', consultLead: '点击下方按钮进入微信官方客服会话，顾问会在会话里回复你。',
    consultCtx: '本次咨询会附带', consultHomes: '房源', consultQuiz: '测试结果', consultNone: '暂无（可直接咨询）',
    consultBtn: '进入客服会话', consultSteps: ['点击“进入客服会话”，进入微信官方客服聊天', '随便发一句话，比如“我想咨询这几套房”', '顾问会在聊天里发给你学生群二维码，长按图片即可识别进群'],
    consultFine: '按微信规则，顾问只能在你发消息后的 48 小时内回复你；二维码 7 天内有效，过期可以再发消息要新的。',
    lifeCharacter: '你的生活角色', homesFor: '适合你的公寓', mapNote: '地图：腾讯地图底图；编号与网页版一致。',
    cmpTitle: '公寓对比', rowArea: '区域', rowEnsuite: '独卫单间', rowStudio: 'Studio', rowLowest: '最低房价', rowRating: '评分',
    rowSuper: '最近超市', rowTopup: '最近食品店', rowCafe10: '10 分钟内咖啡馆', rowRest10: '10 分钟内餐厅', rowAsian10: '10 分钟内亚洲餐饮',
    noPicks: '暂时没有同时符合全部条件的公寓。可以把步行时间放宽到“远一点也行”，或换个校区再试。', rowNight10: '10 分钟内夜间场所', rowLib: '最近图书馆', rowPark: '最近绿地', rowGym: '最近健身房', places: '{n} 家'
  },
  en: {
    appName: 'Liverpool Student Life Map', lifeQuiz: 'Life Quiz', homeQuiz: 'Home Match', lifeQuizSub: '6 scenarios · your Liverpool character',
    homeQuizSub: '8 questions · homes that fit your days', homes: 'Homes', search: 'Name, street or number…', budget: 'Budget / wk', room: 'Room',
    walk: 'Walk to UoL', any: 'Any', ensuite: 'En-suite', studio: 'Studio', favOnly: 'Saved only', count: '{n} of 47 homes',
    empty: 'No homes match these filters.', reset: 'Reset filters', minutes: '{n} min', walkUol: 'UoL ~{n} min walk', fromWeek: 'From £{v}/wk',
    noPrice: 'No reference price', soldOut: 'No rooms listed (historic)', yourTop3: 'Your top 3', viewResult: 'View result', showAll: 'Show all',
    question: 'Question {i} of {n}', back: 'Back', next: 'Next', finish: 'See results', multiHint: 'Multi-select', start: 'Start · about 2 minutes',
    homeIntro: 'Answer 8 short questions about campus, meals, study and weekends. We suggest 3 homes. Answers stay on this device.',
    lifeIntro: 'Six everyday scenarios reveal your Liverpool lifestyle character, plus 3 homes that suit it. A playful summary, not a personality test.',
    extraCampus: 'Last two: which campus will you mainly study at?', extraWalk: 'How long are you happy to walk to class?',
    resultTitle: 'Your Liverpool home card', top3: 'Your 3 homes', compare3: 'Compare these 3', onMap: 'View on map', consult: 'Ask an adviser',
    retake: 'Retake', tradeoff: 'Trade-off', reasons: 'Why', compare: 'Compare', detail: 'Details', fav: 'Save', faved: 'Saved',
    addCompare: 'Add to compare', inCompare: 'In compare', navigate: 'Directions', nearby: 'Nearby (estimated walk)', prices: 'Reference prices (historic)',
    rating: 'Rating', reviews: '{n} reviews', walks: 'Walk times (straight-line estimate)', uol: 'University of Liverpool', ljmu: 'Nearest LJMU campus', lime: 'Lime Street station', centre: 'City centre',
    priceNote: 'Prices and ratings as recorded on Amber, checked 17 Oct 2026. Not live availability.',
    walkNote: 'Walk times are distance estimates, not live routes.', lang: '中文',
    consultTitle: 'Ask a housing adviser', consultLead: 'Tap below to open the official WeChat customer-service chat.',
    consultCtx: 'This request includes', consultHomes: 'Homes', consultQuiz: 'Quiz', consultNone: 'None (ask anything)',
    consultBtn: 'Open chat', consultSteps: ['Tap "Open chat" to enter the WeChat service chat', 'Send any message, e.g. "I\'d like to ask about these homes"', 'The adviser replies in the chat with a student group QR code — long-press to join'],
    consultFine: 'WeChat only allows replies within 48 hours of your last message; group QR codes expire after 7 days.',
    lifeCharacter: 'Your character', homesFor: 'Homes for you', mapNote: 'Map: Tencent base map; numbers match the website.',
    cmpTitle: 'Compare', rowArea: 'Area', rowEnsuite: 'En-suite', rowStudio: 'Studio', rowLowest: 'Lowest room', rowRating: 'Rating',
    rowSuper: 'Nearest supermarket', rowTopup: 'Nearest food shop', rowCafe10: 'Cafés ≤10 min', rowRest10: 'Restaurants ≤10 min', rowAsian10: 'Asian food ≤10 min',
    noPicks: 'No home meets every condition yet. Try relaxing the walk time or picking another campus.', rowNight10: 'Night venues ≤10 min', rowLib: 'Nearest library', rowPark: 'Nearest green space', rowGym: 'Nearest gym', places: '{n}'
  }
};
function dict(lang) { return S[lang === 'en' ? 'en' : 'zh']; }
function fmt(s, v) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return v && v[k] != null ? v[k] : ''; }); }
module.exports = { dict: dict, fmt: fmt, S: S };
