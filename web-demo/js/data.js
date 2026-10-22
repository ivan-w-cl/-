/* Demo 专用数据：房型与照片、地图地理、专家团队、扩展文案、模拟会话。
   房源本身（47 套、价格、步行、周边）来自 js/vendor/core.js，即小程序同一份数据。 */
(function (root) {
  'use strict';
  const { HM } = root.Core;

  /* ---------- 房型与照片 ----------
     1 号 iQ Great Newton House：照片、房型、价格、档期来自 AmberStudent（2026-10-21 采集，设计稿 design/room-photos）。
     Amber 上共 9 个房型，这里是其中 3 个。其他公寓暂时按小程序里的历史参考价生成房型，照片待补充。 */
  const PHOTO = p => 'assets/photos/' + p + '.jpg';
  const ROOMS = {
    'iq-great-newton-house': {
      amber: 'https://amberstudent.com/places/iq-great-newton-house-liverpool-1608304787060',
      totalTypes: 9,
      building: [['bldg-exterior', 'courtyard'], ['bldg-common', 'common'], ['bldg-amenities', 'amenities']],
      types: [
        { id: 'gold-ensuite', name: 'Gold En Suite', zh: '金级独卫单间', price: '£160–185', from: 160, ok: true,
          status: { en: 'From 9 Jan 2027', zh: '2027 年 1 月 9 日起可入住' },
          facts: ['privBath', 'sharedKitchen', 'deposit125'],
          photos: [['ensuite-bedroom', 'bedroom'], ['ensuite-bedroom2', 'bedroom'], ['ensuite-bathroom', 'bathroom'], ['ensuite-kitchen', 'sharedKitchen']] },
        { id: 'gold-1bed', name: 'Gold 1 Bed Apartment', zh: '金级一居室公寓', price: '£243', from: 243, ok: false,
          status: { en: 'Fully booked 26/27', zh: '26/27 学年已满' },
          facts: ['privKitchen', 'privBath', 'living', 'couples', 'deposit125'],
          photos: [['1bed-bedroom', 'bedroom'], ['1bed-living', 'living'], ['1bed-kitchen', 'kitchen'], ['1bed-bathroom', 'bathroom']] },
        { id: 'silver-2bed', name: 'Silver 2 Bed Apartment', zh: '银级两居室公寓', price: '£222', from: 222, ok: false,
          status: { en: 'Fully booked 26/27', zh: '26/27 学年已满' },
          facts: ['privBath', 'sharedKitchen', 'deposit125'],
          photos: [['2bed-bedroom', 'bedroom'], ['2bed-kitchen', 'kitchen'], ['2bed-bathroom', 'bathroom']] }
      ]
    }
  };
  function roomsFor(h) {
    if (ROOMS[h.id]) return ROOMS[h.id];
    const types = [];
    const hist = { en: h.pso ? 'No rooms listed (historic)' : 'Ask for 27/28 dates', zh: h.pso ? '历史记录无房' : '27/28 学年档期待确认' };
    if (h.pe) types.push({ id: 'ensuite', name: 'En-suite', zh: '独卫单间', price: '£' + h.pe, from: h.pe, ok: !h.pso, status: hist, facts: ['privBath', 'sharedKitchen'], photos: [] });
    if (h.ps) types.push({ id: 'studio', name: 'Studio', zh: 'Studio 套间', price: '£' + h.ps, from: h.ps, ok: !h.pso, status: hist, facts: ['privKitchen', 'privBath'], photos: [] });
    if (!types.length && h.plo) types.push({ id: 'room', name: 'Room', zh: '房间', price: '£' + h.plo, from: h.plo, ok: !h.pso, status: hist, facts: [], photos: [] });
    return { types, building: [], totalTypes: types.length, pending: true };
  }
  function coverPhoto(h) {
    const r = ROOMS[h.id];
    return r ? PHOTO(r.types[0].photos[0][0]) : '';
  }

  /* ---------- 预定专家团队（每个案件分配一组，在群里服务该学生） ---------- */
  const TEAMS = [
    { id: 'A', name: { zh: '专家团队 A · 市中心与绳索街区', en: 'Team A · City Centre & Ropewalks' }, members: ['Grace Wong', '陈思琪', 'Tom Hughes'], langs: 'EN / 中文' },
    { id: 'B', name: { zh: '专家团队 B · 知识区与乔治亚街区', en: 'Team B · Knowledge & Georgian Quarter' }, members: ['Daniel Lim', '刘佳', 'Sophie Clarke'], langs: 'EN / 中文' },
    { id: 'C', name: { zh: '专家团队 C · 日本学生（英文服务）', en: 'Team C · Students from Japan (English)' }, members: ['Kenji Mori', 'Emma Brown'], langs: 'EN / 日本語（筹备中）' },
    { id: 'D', name: { zh: '专家团队 D · 边山与肯辛顿合租房', en: 'Team D · Edge Hill & Kensington houses' }, members: ['Priya Shah', '王磊'], langs: 'EN / 中文' }
  ];
  const REGIONS = {
    SG: { flag: '🇸🇬', en: 'Singapore', zh: '新加坡', channel: 'whatsapp', lang: 'en' },
    CN: { flag: '🇨🇳', en: 'China', zh: '中国', channel: 'wechat', lang: 'zh' },
    JP: { flag: '🇯🇵', en: 'Japan', zh: '日本', channel: 'whatsapp', lang: 'en' }
  };
  const CHANNELS = { whatsapp: { en: 'WhatsApp group', zh: 'WhatsApp 群' }, wechat: { en: 'WeChat group', zh: '微信群' } };
  const SOURCES = ['Instagram', 'TikTok', '小红书', 'Google', 'Referral'];
  const STATUSES = ['browsing', 'chatting', 'requested', 'qr_sent', 'joined', 'booked'];

  /* ---------- 扩展文案（与小程序 i18n.js 合并使用） ---------- */
  const EXT = {
    zh: {
      tabMap: '地图', tabQuiz: '测试', tabSaved: '收藏', tabChat: '对话', back: '返回',
      quizzes: '两个小测试', quizzesLead: '不知道从哪套看起？花两分钟，按你的日常生活推荐 3 套公寓。',
      roomTypes: '房型', pickRoom: '选一个房型看照片', photos: '{n} 张照片', photosPending: '照片整理中',
      photosPendingNote: '这套公寓的房型照片正在从 Amber 整理，先看价格和位置，或者直接问顾问。',
      fromAmber: '照片与房型来自 AmberStudent，2026-10-21 采集；Amber 上共 {n} 个房型，这里展示 {m} 个。',
      building: '公寓环境', courtyard: '庭院', common: '公共休息区', amenities: '设施',
      bedroom: '卧室', bathroom: '浴室', kitchen: '厨房', sharedKitchen: '共用厨房', living: '客厅',
      privBath: '独立卫浴', sharedKitchenF: '共用厨房', privKitchen: '独立厨房', livingF: '独立客厅', couples: '可情侣入住', deposit125: '押金 £125',
      askRoom: '咨询这个房型', askHome: '问问这套公寓', perWeek: '/周', full: '已满',
      chatTitle: '住宿顾问', chatSub: '一般几分钟内回复 · 英文 / 中文', chatPh: '输入你的问题…', send: '发送',
      wantGroup: '我要建群咨询', wantGroupSub: '顾问会为你建立专属预定专家团队，发群二维码给你',
      reqTitle: '建立你的预定专家群', reqLead: '填几项信息，顾问收到后会为你建群，并在这个对话框里发二维码。',
      fName: '怎么称呼你', fIntake: '入学时间', fUni: '学校', fBudget: '每周预算', fRoom: '想要的房型', fChannel: '用哪个 App 进群',
      fRegion: '你来自', submitReq: '提交建群请求', cancel: '取消',
      reqSent: '建群请求已提交。顾问正在为你安排预定专家团队，二维码会发在这里。',
      qrTitle: '你的预定专家群', qrLeadWa: '用手机扫码，或直接点下方按钮加入 WhatsApp 群。', qrLeadWx: '长按或用微信扫码加入群聊。',
      openWa: '在 WhatsApp 中打开', qrDemo: '演示二维码，扫码不会进入真实群。', team: '你的团队',
      ctxCard: '我在看', viewing: '正在看', welcome: '你好！我是你的住宿顾问 Amy。看到喜欢的房子可以直接问我，价格、档期、离学校多远都可以。想正式预定时点「我要建群咨询」，我帮你拉专属专家群。',
      demoTipChat: '演示提示：切到「顾问后台」或「并排演示」，以顾问身份回复和发送二维码。',
      savedTitle: '收藏的公寓', savedEmpty: '还没有收藏。在公寓详情里点「收藏」。', compareTray: '对比栏（{n}/3）', openCompare: '打开对比',
      settings: '设置', region: '地区', language: '语言', seeHome: '查看详情', mapReset: '复位',
      allHomes: '全部公寓', topOnly: '只看 Top 3', nearbyTitle: '周边',
      stamp: '演示'
    },
    en: {
      tabMap: 'Map', tabQuiz: 'Quizzes', tabSaved: 'Saved', tabChat: 'Chat', back: 'Back',
      quizzes: 'Two short quizzes', quizzesLead: 'Not sure where to start? Two minutes, three homes that suit your days.',
      roomTypes: 'Room types', pickRoom: 'Pick a room type to see its photos', photos: '{n} photos', photosPending: 'Photos coming',
      photosPendingNote: 'Room photos for this home are being added from Amber. Check prices and location for now, or ask an adviser.',
      fromAmber: 'Photos and room types from AmberStudent, taken 21 Oct 2026. Showing {m} of {n} room types.',
      building: 'The building', courtyard: 'Courtyard', common: 'Common room', amenities: 'Amenities',
      bedroom: 'Bedroom', bathroom: 'Bathroom', kitchen: 'Kitchen', sharedKitchen: 'Shared kitchen', living: 'Living room',
      privBath: 'Private bathroom', sharedKitchenF: 'Shared kitchen', privKitchen: 'Private kitchen', livingF: 'Living room', couples: 'Couples welcome', deposit125: 'Deposit £125',
      askRoom: 'Ask about this room', askHome: 'Ask about this home', perWeek: '/week', full: 'Full',
      chatTitle: 'Housing adviser', chatSub: 'Usually replies in minutes · English / 中文', chatPh: 'Type your question…', send: 'Send',
      wantGroup: 'Get my booking team', wantGroupSub: 'An adviser sets up your own booking expert group and sends you the QR code',
      reqTitle: 'Set up your booking group', reqLead: 'A few details, then an adviser creates your group and sends the QR code in this chat.',
      fName: 'Your name', fIntake: 'Start date', fUni: 'University', fBudget: 'Budget per week', fRoom: 'Room type', fChannel: 'Join the group on',
      fRegion: 'You are from', submitReq: 'Send request', cancel: 'Cancel',
      reqSent: 'Request sent. An adviser is setting up your booking team and will post the QR code here.',
      qrTitle: 'Your booking expert group', qrLeadWa: 'Scan with your phone, or tap the button to join the WhatsApp group.', qrLeadWx: 'Long-press or scan in WeChat to join the group.',
      openWa: 'Open in WhatsApp', qrDemo: 'Demo QR code. It does not open a real group.', team: 'Your team',
      ctxCard: "I'm looking at", viewing: 'Viewing', welcome: "Hi! I'm Amy, your housing adviser. Ask me anything about a home: prices, dates, how far it is from campus. When you're ready to book, tap \"Get my booking team\" and I'll set up your own expert group.",
      demoTipChat: 'Demo tip: switch to "Adviser console" or "Side by side" to reply and send the QR code as the adviser.',
      savedTitle: 'Saved homes', savedEmpty: 'Nothing saved yet. Tap "Save" on a home.', compareTray: 'Compare ({n}/3)', openCompare: 'Open compare',
      settings: 'Settings', region: 'Region', language: 'Language', seeHome: 'See details', mapReset: 'Reset',
      allHomes: 'All homes', topOnly: 'Top 3 only', nearbyTitle: 'Nearby',
      stamp: 'Demo'
    }
  };
  const ADMIN = {
    zh: {
      inbox: '会话', dash: '数据看板', all: '全部', needGroup: '待建群', active: '跟进中', done: '已完成', search: '搜索姓名…',
      st_browsing: '浏览中', st_chatting: '已对话', st_requested: '待建群', st_qr_sent: 'QR 已发送', st_joined: '已进群', st_booked: '已预定',
      ctx: '用户资料', region: '地区', lang: '界面语言', source: '来源', quiz: '测试结果', viewed: '看过的公寓', favs: '收藏', request: '建群请求',
      buildGroup: '建群并发送 QR', markJoined: '标记已进群', markBooked: '标记已预定', reply: '回复…', aiSuggest: 'AI 建议回复（占位）',
      newReq: '新的建群请求', newReqText: '{name} 需要一个预定专家群', open: '查看',
      mTitle: '为 {name} 建群', mTeam: '分配专家团队', mChannel: '群类型', mLink: '群邀请链接', mLinkHint: '在 WhatsApp / 微信里建好群后，把邀请链接粘贴到这里，系统生成二维码。演示中已预填示例链接。',
      mGroupName: '群名称', mSend: '发送二维码到对话框', mPreview: '学生将收到', none: '—', noConv: '选择左侧一个会话',
      sentQr: '已向学生发送群二维码', joinedNote: 'WhatsApp 和微信不会通知谁扫码进群，进群后请手动标记。',
      kpiVisitors: '访问用户', kpiChats: '发起对话', kpiReq: '建群请求', kpiQr: '已发 QR', kpiJoined: '已进群', kpiBooked: '已预定',
      funnel: '获客漏斗', funnelNote: '每一步占访问用户的比例', byRegion: '按地区', bySource: '按来源渠道', conv: '转化率',
      demoData: '演示数据：会话为虚构的示例用户，你在学生端的操作会实时计入。', waitHours: '已等待 {n}', timeAgo: '{n} 前', you: '你（演示学生）',
      minutes: '{n} 分钟', hours: '{n} 小时', days: '{n} 天', rate: '占比', count: '人数', remind: 'QR 已发出超过 24 小时，学生还没进群，建议跟进。'
    },
    en: {
      inbox: 'Inbox', dash: 'Dashboard', all: 'All', needGroup: 'Needs a group', active: 'In progress', done: 'Done', search: 'Search names…',
      st_browsing: 'Browsing', st_chatting: 'Chatting', st_requested: 'Needs a group', st_qr_sent: 'QR sent', st_joined: 'In group', st_booked: 'Booked',
      ctx: 'Student', region: 'Region', lang: 'App language', source: 'Source', quiz: 'Quiz result', viewed: 'Homes viewed', favs: 'Saved', request: 'Group request',
      buildGroup: 'Create group & send QR', markJoined: 'Mark as in group', markBooked: 'Mark as booked', reply: 'Reply…', aiSuggest: 'AI suggested reply (placeholder)',
      newReq: 'New group request', newReqText: '{name} needs a booking group', open: 'Open',
      mTitle: 'Group for {name}', mTeam: 'Expert team', mChannel: 'Group type', mLink: 'Group invite link', mLinkHint: 'Create the group in WhatsApp or WeChat, paste its invite link here and the QR code is generated. The demo fills in a sample link.',
      mGroupName: 'Group name', mSend: 'Send QR code to chat', mPreview: 'The student will see', none: '—', noConv: 'Pick a conversation on the left',
      sentQr: 'Group QR code sent to the student', joinedNote: 'WhatsApp and WeChat do not tell us who scanned the code. Mark it by hand once they join.',
      kpiVisitors: 'Visitors', kpiChats: 'Started a chat', kpiReq: 'Group requests', kpiQr: 'QR sent', kpiJoined: 'Joined group', kpiBooked: 'Booked',
      funnel: 'Lead funnel', funnelNote: 'Share of visitors reaching each step', byRegion: 'By region', bySource: 'By source', conv: 'Conversion',
      demoData: 'Demo data: conversations are made-up sample students. What you do in the student app is counted live.', waitHours: 'Waiting {n}', timeAgo: '{n} ago', you: 'You (demo student)',
      minutes: '{n} min', hours: '{n} h', days: '{n} d', rate: 'Share', count: 'People', remind: 'QR sent over 24 hours ago and the student has not joined yet. Follow up.'
    }
  };

  /* ---------- 模拟会话（顾问后台和数据看板用；全部虚构） ---------- */
  const PEOPLE = [
    ['Ethan Tan', 'SG'], ['Chloe Lim', 'SG'], ['Ryan Ng', 'SG'], ['Sarah Goh', 'SG'], ['Marcus Lee', 'SG'], ['Hui Min Ong', 'SG'], ['Darren Koh', 'SG'],
    ['Jia Yi Teo', 'SG'], ['Nicole Chua', 'SG'], ['Aaron Seah', 'SG'], ['Rachel Yeo', 'SG'], ['Gabriel Toh', 'SG'],
    ['王思远', 'CN'], ['李欣怡', 'CN'], ['陈子豪', 'CN'], ['张雨桐', 'CN'], ['刘一鸣', 'CN'], ['赵可欣', 'CN'], ['孙浩然', 'CN'], ['周静怡', 'CN'], ['吴俊杰', 'CN'], ['郑佳琪', 'CN'],
    ['Yuki Sato', 'JP'], ['Haruto Suzuki', 'JP'], ['Aoi Takahashi', 'JP'], ['Ren Tanaka', 'JP'], ['Mei Watanabe', 'JP'], ['Sota Ito', 'JP']
  ];
  const STATUS_PLAN = ['requested', 'requested', 'chatting', 'qr_sent', 'joined', 'booked', 'chatting', 'joined', 'browsing', 'qr_sent', 'booked', 'chatting',
    'requested', 'chatting', 'joined', 'qr_sent', 'booked', 'chatting', 'browsing', 'joined', 'chatting', 'qr_sent',
    'chatting', 'requested', 'joined', 'browsing', 'chatting', 'booked'];
  const OPENERS = {
    en: ['Hi, is {home} still available for September 2027?', 'How far is {home} from the University of Liverpool?', 'Does {home} have studios under £250 a week?',
      'Can I see more photos of the en-suite at {home}?', 'Is {home} quiet at night? I like to study at home.', 'Are bills included at {home}?'],
    zh: ['你好，{home} 2027 年 9 月还有房吗？', '{home} 离利物浦大学走路要多久？', '{home} 有没有每周 £250 以下的 Studio？', '想看看 {home} 独卫单间的更多照片', '{home} 晚上吵吗？我喜欢在家学习。', '{home} 包水电网吗？']
  };
  const REPLIES = {
    en: ['Yes, a few en-suites are open for 27/28. Want me to hold the price for you?', 'About a 6-minute walk to the main campus.', 'There are two studio types in budget. I can send both.'],
    zh: ['有的，27/28 学年还有几间独卫单间，需要我帮你锁定价格吗？', '步行到主校区大约 6 分钟。', '预算内有两种 Studio，我都发给你看看。']
  };
  function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
  function seedConversations(now) {
    const rand = rng(20261022), homes = HM.HOMES, out = [];
    PEOPLE.forEach(([name, region], i) => {
      const status = STATUS_PLAN[i], lang = REGIONS[region].lang, h = homes[Math.floor(rand() * homes.length)];
      const viewed = [h.id, homes[Math.floor(rand() * homes.length)].id, homes[Math.floor(rand() * homes.length)].id].filter((x, j, a) => a.indexOf(x) === j);
      const ago = Math.round((0.2 + rand() * (status === 'booked' ? 14 : status === 'requested' ? 0.6 : 5)) * 864e5) / 1;
      const start = now - ago, msgs = [], src = SOURCES[Math.floor(rand() * SOURCES.length)];
      const life = rand() < .55 ? pickCharacter(rand, lang) : '';
      const conv = { id: 'c' + (i + 1), name, region, lang, source: src, status, viewed, favorites: rand() < .6 ? [h.id] : [],
        quiz: life, request: null, group: null, unread: 0, updated: start, seed: true, messages: msgs };
      if (status === 'browsing') { conv.updated = start; out.push(conv); return; }
      msgs.push({ from: 'agent', text: lang === 'zh' ? '你好！我是你的住宿顾问，有问题随时问我。' : "Hi! I'm your housing adviser. Ask me anything.", at: start });
      msgs.push({ from: 'student', type: 'home', homeId: h.id, at: start + 6e4 });
      msgs.push({ from: 'student', text: OPENERS[lang][i % 6].replace('{home}', h.name), at: start + 7e4 });
      if (status !== 'chatting' || rand() < .5) msgs.push({ from: 'agent', text: REPLIES[lang][i % 3], at: start + 5 * 6e4 });
      else conv.unread = 1;
      if (['requested', 'qr_sent', 'joined', 'booked'].includes(status)) {
        const at = start + (status === 'requested' ? 9 * 6e4 : 36e5);
        conv.request = { name, intake: rand() < .7 ? 'Sep 2027' : 'Jan 2027', uni: ['uol', 'ljmu-city', 'ljmu-mp', 'uol'][i % 4], budget: [180, 200, 250, 300][i % 4],
          room: ['ensuite', 'studio', 'any'][i % 3], channel: REGIONS[region].channel, at };
        msgs.push({ from: 'student', type: 'request', at });
        if (status !== 'requested') {
          const team = TEAMS[region === 'JP' ? 2 : i % 4 === 3 ? 3 : i % 2];
          conv.group = { team: team.id, channel: REGIONS[region].channel, name: 'LSM · ' + name + ' · ' + conv.request.intake, link: demoLink(REGIONS[region].channel, conv.id), at: at + 25 * 6e4 };
          msgs.push({ from: 'agent', type: 'qr', at: at + 25 * 6e4 });
        }
        if (status === 'requested') conv.unread = 1;
      }
      conv.updated = msgs[msgs.length - 1].at;
      out.push(conv);
    });
    return out;
  }
  function pickCharacter(rand, lang) {
    const LQ = root.Core.LQ, a = [0, 1, 2, 3, 4, 5].map(() => Math.floor(rand() * 3));
    const r = LQ.model.setLanguage(lang).result(a);
    return r ? r.name : '';
  }
  function demoLink(channel, id) {
    const code = ('LSMDEMO' + id + 'X7Q2K9').toUpperCase().slice(0, 18);
    return channel === 'wechat' ? 'https://weixin.qq.com/g/' + code : 'https://chat.whatsapp.com/' + code;
  }
  /* 访问量（看板分母）：演示用的固定数字 */
  const VISITORS = { SG: 1460, CN: 1180, JP: 410 };

  root.DemoData = { ROOMS, roomsFor, coverPhoto, PHOTO, TEAMS, REGIONS, CHANNELS, SOURCES, STATUSES, EXT, ADMIN, seedConversations, demoLink, VISITORS };
})(typeof globalThis !== 'undefined' ? globalThis : this);
