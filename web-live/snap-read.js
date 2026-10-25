/* 拍一下 · 看懂公寓网页（演示版）
   学生在电脑上看公寓网站时，用手机拍一下屏幕；在手机上看时截图或粘贴网址。我们认出是哪个网站、哪栋公寓，
   按来源给不同的内容：
   - 已收录的公寓官网：阅读模式。用我们的排版重新呈现那一页，每一句都配翻译（中文 / 日本語），重点词带解释，
     这一页的重点列在最上面，价格旁边能直接拆开报价，链接点进去下一页也用阅读模式；到预订和付款就停下，请学生去官网完成。
   - 租房平台的截图：不转载平台页面，只用截图里的信息（哪栋楼、什么价格、写了多少返现），按这栋楼的官方价拆开。
   - 还没收录的网站：翻译截图里的文字、标出重点词，记进「待收录」。
   演示版的识别结果和示例网页都是写好的示例数据（页面上有标注），正式版接入 AI 看图服务识别任意截图。
   入口：顶部栏的📷按钮、生活选房开场页的「订房小工具」，链接 ?snap=1 直接打开。 */
(() => {
  'use strict';
  const BT = window.BookingTools; if (!BT) return;
  const { el, btn, fmt, money, pick } = BT;
  const W = {
    zh: {
      intro: '📷 拍一下 · 看懂公寓网页', pill: '📷 拍一下，看懂网页', aria: '拍一下，看懂公寓网页', eyebrow: '订房小工具 · 演示版', heading: '拍一下，看懂公寓网页',
      lede: '在电脑上看公寓网站？用手机拍一下屏幕。在手机上看？截图或复制网址。我们认出是哪个网站、哪栋公寓，重新排好版，每一句都配翻译，重点帮你标出来。',
      camera: '📷 拍电脑屏幕', cameraSub: '用手机摄像头拍正在看的网页', upload: '🖼 上传截图', uploadSub: '手机上看网页或 App 时截的图',
      link: '🔗 粘贴网址', linkSub: '最准：复制网页地址粘贴进来', linkPh: '粘贴公寓网页的网址', go: '识别',
      tryH: '没有图？试试示例', ex1: '公寓官网（拍电脑屏幕）', ex2: '租房平台 App 截图', ex3: '还没收录的网站',
      demoNote: '演示版：识别结果和示例网页都是写好的示例数据，示例网页内容不是官网原文。正式版接入 AI 看图服务，能识别任意截图。',
      scanning: '正在识别…', s1: '认出网站', s2: '认出公寓和房型', s3: '读出价格和条款',
      yourPhoto: '演示版暂时把你的照片当作「公寓官网」示例来处理。', badLink: '这个网址看不懂，请检查一下再粘贴。',
      back: '‹ 返回', again: '📷 再拍一张',
      srcOfficial: '公寓官网 · 已收录', srcPlatform: '租房平台截图', srcUnknown: '还没收录的网站', sample: '示例内容，不是官网原文',
      transTo: '翻译', zh: '中文', ja: '日本語', off: '只看原文', tapHint: '带下划线的是重点词，点一下看解释。',
      keyH: '这一页的 {n} 个重点', cardH: '公寓透明卡', operator: '运营商', area: '位置', walk: '步行约 {n} 分钟到利物浦大学',
      opened: '首次开放', refurb: '最近翻新', noRecord: '暂未找到可靠公开记录',
      askH: '可以问顾问的问题', copy: '复制英文', copyBoth: '复制中英文', copied: '已复制',
      splitPrice: '✂️ 拆开这个价', openPage: '在这里打开 ›',
      bookStopH: '预订和付款请在官网完成', bookStopP: '这一步要填个人资料和付款，我们不经手。看懂了再去官网继续。', toSite: '去官网继续 ↗',
      platformLede: '这是租房平台的页面。我们不转载平台的页面，只用你截图里的信息。',
      recognized: '认出：{home} · {room}', recogPrice: '截图里写着：每周 {wk} · {weeks} 周 · 返现 {cash}',
      platformSplit: '按这栋楼的官方价拆开', platformSay: '平台说的返现是 {cash}；按官方价算，平台自己补了约 {sub}，两者基本一致。其余 {off} 是公寓的官方返现，在哪个平台订都有。',
      openSplit: '✂️ 打开报价拆解', seeOfficial: '这栋楼在我们这里有完整资料 → 在地图上看',
      unknownLede: '这个网站还没有收录。先把截图里的文字翻译出来，并标出重点：', queued: '已记入「待收录」，订房专家会补上这个网站的资料。',
      steps: '正式版会怎么识别', how: '网址最准；照片和截图由 AI 看图识别网站标志、网址栏、公寓名和价格，认不准时只问一句「是这栋楼吗？」'
    },
    en: {
      intro: '📷 Snap a listing', pill: '📷 Snap a listing', aria: 'Snap a listing to understand it', eyebrow: 'Booking tools · Demo', heading: 'Snap a listing, understand it',
      lede: 'Looking at a housing site on a computer? Take a photo of the screen with your phone. On your phone? Take a screenshot or copy the link. We recognise the site and the building, lay the page out again, translate every sentence and point out what matters.',
      camera: '📷 Photo of a screen', cameraSub: 'Use your camera on the page you are reading', upload: '🖼 Upload a screenshot', uploadSub: 'From a website or an app on your phone',
      link: '🔗 Paste a link', linkSub: 'Most accurate: paste the page address', linkPh: 'Paste the link of a housing page', go: 'Read it',
      tryH: 'No picture? Try an example', ex1: 'Building website (photo of a screen)', ex2: 'Booking platform app screenshot', ex3: 'A site we have not added yet',
      demoNote: 'Demo: recognition results and the sample page are written examples; the sample page is not the operator’s own wording. The live version uses an AI vision service to read any screenshot.',
      scanning: 'Reading…', s1: 'Website recognised', s2: 'Building and room type found', s3: 'Prices and terms read',
      yourPhoto: 'In this demo your photo is treated as the building-website example.', badLink: 'That link could not be read. Check it and paste again.',
      back: '‹ Back', again: '📷 Snap another',
      srcOfficial: 'Building website · in our database', srcPlatform: 'Booking platform screenshot', srcUnknown: 'Site not added yet', sample: 'Sample content, not the operator’s wording',
      transTo: 'Translate', zh: '中文', ja: '日本語', off: 'Original only', tapHint: 'Underlined words matter. Tap one for an explanation.',
      keyH: '{n} things to notice on this page', cardH: 'Building facts', operator: 'Operator', area: 'Location', walk: 'About {n} min walk to the University of Liverpool',
      opened: 'First opened', refurb: 'Last refurbished', noRecord: 'No reliable public record found yet',
      askH: 'Questions to ask the adviser', copy: 'Copy English', copyBoth: 'Copy both', copied: 'Copied',
      splitPrice: '✂️ Break down this price', openPage: 'Open here ›',
      bookStopH: 'Book and pay on the official site', bookStopP: 'This step asks for your details and payment, which we never handle. Carry on on the official site once you understand the terms.', toSite: 'Continue on the official site ↗',
      platformLede: 'This is a booking platform page. We do not copy platform pages; we only use what is in your screenshot.',
      recognized: 'Recognised: {home} · {room}', recogPrice: 'The screenshot says: {wk}/week · {weeks} weeks · {cash} cashback',
      platformSplit: 'Broken down against the official price', platformSay: 'The platform says {cash} cashback; against the official price it adds about {sub} itself, which matches. The other {off} is the building’s official cashback, available on any platform.',
      openSplit: '✂️ Open the quote breakdown', seeOfficial: 'We have full details for this building → show on map',
      unknownLede: 'We have not added this site yet. Here is the text from your screenshot, translated, with the key words marked:', queued: 'Added to our to-do list; our booking experts will add this site.',
      steps: 'How the live version recognises pages', how: 'A link is most accurate. For photos and screenshots, AI reads the logo, address bar, building name and price, and asks one question when unsure: “Is it this building?”'
    }
  };
  const w = () => pick(W);
  const homes = () => { try { return HOMES; } catch (_) { return []; } };
  const homeById = id => homes().find(h => h.id === id);
  const L3 = o => o[lang3()] || o.en;   // 说明文字跟着翻译语言走：中文 / 日本語，只看原文时用界面语言
  let trans = null;
  const lang3 = () => (trans === 'zh' || trans === 'ja' ? trans : BT.lang());

  /* ---------- 重点词：英文原文里自动加下划线，点一下看解释 ---------- */
  const TERMS = [
    { k: 'cashback', re: /cashback/i, zh: '返现：一次性返还的钱。看清楚什么时候到账、要满足什么条件。', ja: 'キャッシュバック：一度だけ戻ってくるお金。いつ、どんな条件で支払われるかを確認しましょう。', en: 'Cashback: a one-off payment back to you. Check when it is paid and on what conditions.' },
    { k: 'booking', re: /booking fee/i, zh: '预订费：订房时付的手续费，通常不退，也不抵房租。', ja: '予約料：予約時に払う手数料。通常は返金されず、家賃にも充当されません。', en: 'Booking fee: a charge to reserve the room, usually non-refundable and not counted towards rent.' },
    { k: 'holding', re: /holding deposit/i, zh: '订金：用来保留房间，常见是一周房租。能不能退、能不能抵房租，要看条款。', ja: 'ホールディング・デポジット：部屋を押さえるためのお金（家賃1週間分が多い）。返金や家賃への充当は規約次第です。', en: 'Holding deposit: money to hold the room, often one week’s rent. Whether it is refunded or set against rent depends on the terms.' },
    { k: 'instal', re: /instalments?/i, zh: '分期：把房租分几次付，通常需要担保人。', ja: '分割払い：家賃を数回に分けて払う方法。通常は保証人が必要です。', en: 'Instalments: paying rent in several parts, usually only with a guarantor.' },
    { k: 'guarantor', re: /guarantor(?: service)?/i, zh: '担保人：你付不出房租时替你付的人。没有英国担保人，可以用担保服务公司（另付费）。', ja: '保証人：家賃を払えない時に代わりに払う人。英国在住の保証人がいなければ、保証サービス（有料）を使えます。', en: 'Guarantor: someone who pays if you cannot. Without a UK guarantor you can use a guarantor service, for a fee.' },
    { k: 'cooling', re: /cooling-off period/i, zh: '冷静期：签约后一段时间内可以无理由取消，记下截止日期。', ja: 'クーリングオフ期間：契約後の一定期間は理由なく取り消せます。期限をメモしましょう。', en: 'Cooling-off period: a window after signing when you can cancel for any reason. Note the deadline.' },
    { k: 'nvnp', re: /No Visa No Pay/i, zh: '签证被拒免付：签证被拒可以取消合同，通常要交拒签证明，而且有截止时间。', ja: 'ビザなし支払いなし：ビザが却下されたら契約を取り消せる制度。却下の証明と期限があるのが一般的です。', en: 'No Visa No Pay: you can cancel if your visa is refused, usually with proof and by a deadline.' },
    { k: 'replace', re: /replacement tenant/i, zh: '替代租客：你想退租时，找人接手你的合同。', ja: '代わりの入居者：退去したい時に契約を引き継ぐ人。', en: 'Replacement tenant: someone who takes over your contract if you want to leave.' },
    { k: 'deposit', re: /security deposit/i, zh: '押金：退房后退还，可能因为损坏或清洁被扣。退房时拍照留证。', ja: '保証金：退去後に返金。破損や清掃で差し引かれることがあります。退去時に写真を残しましょう。', en: 'Security deposit: returned after you move out, minus any damage or cleaning. Take photos when you leave.' },
    { k: 'bills', re: /bills included/i, zh: '包账单：房租已经包含网络、水、电和暖气。', ja: '光熱費込み：家賃にWi-Fi、水道、電気、暖房が含まれます。', en: 'Bills included: rent already covers Wi-Fi, water, electricity and heating.' },
    { k: 'billsx', re: /bills extra/i, zh: '账单另付：水电网暖不含在房租里，要另外算。', ja: '光熱費別：Wi-Fi・水道・電気・暖房は家賃に含まれず、別途かかります。', en: 'Bills extra: utilities are not in the rent and cost more on top.' }
  ];

  /* ---------- 示例：已收录的公寓官网（两页）。内容是写好的示例，不是官网原文 ---------- */
  const OFFICIAL_HOME = 'iq-great-newton-house', OFFICIAL_SITE = 'https://www.iqstudentaccommodation.com/';
  const S_ = (en, zh, ja, flag, note) => ({ en, zh, ja, flag, note });
  const PAGES = {
    overview: {
      url: 'iqstudentaccommodation.com/liverpool/great-newton-house',
      blocks: [
        { h: 'Great Newton House, Liverpool' },
        S_('Modern en-suite rooms and studios in Liverpool’s Knowledge Quarter, a short walk from the University of Liverpool.', '利物浦知识区的现代独卫单间和 Studio，步行很快就到利物浦大学。', 'リバプールのナレッジ・クオーターにあるモダンなエンスイートとスタジオ。リバプール大学まで徒歩すぐ。'),
        { price: true, room: 'Gold En Suite', en: 'Gold En Suite from £160 per week · 51-week tenancy', zh: '金级独卫单间每周 £160 起 · 合同 51 周', ja: 'ゴールド・エンスイート 週£160から・51週間契約' },
        S_('Book now and get £250 cashback*', '现在预订，返现 £250*', '今予約すると£250キャッシュバック*', 'warn', { zh: '返现带星号，条件在下一句。', ja: 'キャッシュバックには条件があります（次の文）。', en: 'The cashback has an asterisk; the condition is in the next line.' }),
        S_('*Cashback is paid after check-in, once your tenancy has started and your account is up to date.', '*返现在入住后发放，前提是合同已经开始、账户没有欠款。', '*キャッシュバックは入居後、契約開始かつ未払いがない場合に支払われます。', 'warn', { zh: '返现要入住以后才到账，有欠款就拿不到。', ja: 'キャッシュバックは入居後。未払いがあると受け取れません。', en: 'Cashback only arrives after you move in, and not if anything is unpaid.' }),
        S_('A non-refundable booking fee of £99 is payable when you reserve your room.', '预订房间时要付 £99 预订费，不予退还。', '部屋の予約時に返金不可の予約料£99が必要です。', 'warn', { zh: '£99 预订费不退；签证被拒时能不能退，要先问清楚。', ja: '£99の予約料は返金不可。ビザ却下時に返金されるか確認を。', en: 'The £99 booking fee is non-refundable; ask whether a visa refusal changes that.' }),
        S_('Rent can be paid in full or in three instalments. Instalment plans require a UK-based guarantor or an approved guarantor service.', '房租可以一次付清或分三期。分期需要英国担保人，或者认可的担保服务公司。', '家賃は一括または3回の分割払い。分割払いには英国在住の保証人か認定保証サービスが必要です。', 'info', { zh: '没有英国担保人又想分期，要用担保公司，会多一笔费用。', ja: '英国の保証人がいないまま分割にするなら保証サービスが必要で、費用が増えます。', en: 'Without a UK guarantor, paying in instalments means a guarantor service and an extra cost.' }),
        S_('All bills included: Wi-Fi, water, electricity and heating.', '包所有账单：网络、水、电和暖气。', '光熱費込み：Wi-Fi、水道、電気、暖房。'),
        { links: [['terms', 'Booking terms & FAQ'], ['book', 'Book now']] }
      ],
      ask: [
        ['Is the £99 booking fee refundable if my visa is refused?', '签证被拒的话，£99 预订费能退吗？'],
        ['When exactly will the £250 cashback be paid, and are there any conditions?', '£250 返现具体什么时候到账？有什么条件？'],
        ['Can I pay in instalments without a UK guarantor?', '没有英国担保人，可以分期付款吗？']
      ]
    },
    terms: {
      url: 'iqstudentaccommodation.com/booking-terms',
      blocks: [
        { h: 'Booking terms & FAQ' },
        S_('You have a 14-day cooling-off period after signing your tenancy agreement.', '签约后有 14 天冷静期。', '契約署名後14日間のクーリングオフ期間があります。', 'info', { zh: '冷静期内可以取消，记下截止日期。', ja: 'この期間ならキャンセル可能。期限をメモしましょう。', en: 'You can cancel within this window; note the deadline.' }),
        S_('If your visa is refused, you may cancel under our No Visa No Pay policy, provided you send us the refusal letter before your tenancy starts.', '如果签证被拒，可以按「签证被拒免付」政策取消，前提是在合同开始前把拒签信发给公寓。', 'ビザが却下された場合、契約開始前に却下通知を送れば「ビザなし支払いなし」ポリシーでキャンセルできます。', 'warn', { zh: '拒签信要在合同开始前发到，晚了就不算。', ja: '却下通知は契約開始前に。遅れると対象外です。', en: 'The refusal letter must arrive before the tenancy starts.' }),
        S_('After the cooling-off period, you will only be released from your tenancy if a replacement tenant is found and approved.', '冷静期过后，只有找到并通过审核的替代租客，才能解除合同。', 'クーリングオフ期間後は、代わりの入居者が見つかり承認された場合のみ契約を解除できます。', 'warn', { zh: '过了冷静期想退，要找人接手，否则还要付房租。', ja: '期間後に解約するなら引き継ぐ人が必要。いなければ家賃は続きます。', en: 'After the window, leaving needs someone to take over, or the rent continues.' }),
        S_('A security deposit of £250 is returned within 28 days of check-out, less any deductions.', '£250 押金在退房后 28 天内退还，会扣除相关费用。', '£250の保証金は、差し引き分を除き退去後28日以内に返金されます。', 'info', { zh: '退房时拍照留证，避免押金被扣。', ja: '退去時に写真を残して、差し引きに備えましょう。', en: 'Take photos at check-out to protect your deposit.' }),
        S_('Leaving early does not reduce the rent payable for the full tenancy.', '提前搬走，不会减少整个合同期要付的房租。', '早期退去しても契約期間全体の家賃は減額されません。', 'warn', { zh: '提前走也要付满整份合同。', ja: '早く出ても契約期間分の家賃は全額です。', en: 'Leaving early still means paying the whole contract.' }),
        { links: [['overview', 'Great Newton House'], ['book', 'Book now']] }
      ],
      ask: [
        ['Could you confirm the exact deadline for sending a visa refusal letter under No Visa No Pay?', '「签证被拒免付」的拒签信，最晚什么时候要发到？'],
        ['If I find a replacement tenant, are there any fees for transferring the contract?', '如果找到替代租客，转合同要收费吗？']
      ]
    }
  };
  /* 示例：还没收录的网站 */
  const UNKNOWN = [
    S_('Double room in a shared house, £140 pw, bills extra.', '合租房里的双人床房间，每周 £140，账单另付。', 'シェアハウスのダブルルーム、週£140、光熱費別。', 'info', { zh: '账单另付，要另算水电网暖。', ja: '光熱費は別途。', en: 'Bills are on top of the rent.' }),
    S_('A holding deposit of one week’s rent is required to reserve the room.', '预订房间要付一周房租作为订金。', '部屋を押さえるには家賃1週間分のホールディング・デポジットが必要です。', 'warn', { zh: '订金能不能退、能不能抵房租，先问清楚。', ja: '返金や家賃への充当ができるか確認を。', en: 'Ask whether the holding deposit is refundable or set against rent.' }),
    S_('Minimum 6-month tenancy. References and a UK guarantor are required.', '最短租期 6 个月，需要推荐信和英国担保人。', '最短6か月契約。推薦状と英国在住の保証人が必要です。', 'warn', { zh: '最短 6 个月；没有英国担保人要另想办法。', ja: '最短6か月。英国の保証人がいない場合は要相談。', en: 'Six months minimum; without a UK guarantor you need another option.' })
  ];
  /* 示例：租房平台截图里读出的信息 */
  const PLATFORM = { home: 'capital-gate', room: 'En-suite', wk: 111, weeks: 51, cash: 300 };

  /* ---------- 示例截图（SVG 画的，没有任何品牌标志） ---------- */
  const svgUrl = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  const SHOTS = {
    official: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320"><rect width="480" height="320" fill="#2b2b2e"/><g transform="rotate(-2 240 160)"><rect x="34" y="28" width="412" height="262" rx="10" fill="#1c1c1e"/><rect x="44" y="38" width="392" height="242" fill="#fff"/><rect x="44" y="38" width="392" height="22" fill="#eef0f2"/><rect x="96" y="44" width="230" height="10" rx="5" fill="#fff"/><text x="102" y="52.5" font-family="Arial" font-size="7.5" fill="#666">iqstudentaccommodation.com/liverpool/great-newton-house</text><rect x="44" y="60" width="392" height="70" fill="#d9e6ef"/><text x="60" y="94" font-family="Arial" font-weight="700" font-size="18" fill="#1f2d3a">Great Newton House</text><text x="60" y="114" font-family="Arial" font-size="9" fill="#3b4b58">Liverpool · Knowledge Quarter</text><text x="60" y="152" font-family="Arial" font-weight="700" font-size="12" fill="#1f2d3a">Gold En Suite from £160 / week</text><text x="60" y="168" font-family="Arial" font-size="8.5" fill="#444">51-week tenancy · Book now and get £250 cashback*</text><text x="60" y="186" font-family="Arial" font-size="7.5" fill="#777">A non-refundable booking fee of £99 is payable…</text><rect x="60" y="200" width="70" height="20" rx="4" fill="#1f2d3a"/><text x="72" y="213.5" font-family="Arial" font-size="8.5" fill="#fff">Book now</text><rect x="300" y="140" width="120" height="84" fill="#c9d4dc"/></g><path d="M0 0 L220 0 L80 320 L0 320 Z" fill="#fff" opacity=".06"/></svg>`),
    platform: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 420"><rect width="240" height="420" rx="18" fill="#f6f6f8"/><text x="18" y="22" font-family="Arial" font-size="10" font-weight="700" fill="#111">9:41</text><rect x="14" y="40" width="212" height="120" rx="10" fill="#cfd8e0"/><text x="18" y="184" font-family="Arial" font-weight="700" font-size="15" fill="#111">Capital Gate</text><text x="18" y="202" font-family="Arial" font-size="9.5" fill="#555">Liverpool · En-suite</text><text x="18" y="232" font-family="Arial" font-weight="700" font-size="20" fill="#111">£111</text><text x="66" y="232" font-family="Arial" font-size="10" fill="#555">/ week</text><text x="18" y="250" font-family="Arial" font-size="9.5" fill="#555">51 weeks · price after cashback</text><rect x="18" y="262" width="96" height="20" rx="10" fill="#ffe7a8"/><text x="28" y="276" font-family="Arial" font-size="9.5" fill="#6b4b00">£300 cashback</text><rect x="14" y="368" width="212" height="34" rx="17" fill="#222"/><text x="96" y="389" font-family="Arial" font-size="11" fill="#fff">Book</text></svg>`),
    unknown: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 420"><rect width="240" height="420" rx="18" fill="#fff"/><text x="18" y="22" font-family="Arial" font-size="10" font-weight="700" fill="#111">9:41</text><text x="18" y="56" font-family="Georgia" font-size="16" fill="#333">Example Lettings</text><rect x="18" y="68" width="204" height="110" fill="#e4e0d8"/><text x="18" y="202" font-family="Arial" font-size="9.5" fill="#222">Double room in a shared house,</text><text x="18" y="216" font-family="Arial" font-size="9.5" fill="#222">£140 pw, bills extra.</text><text x="18" y="240" font-family="Arial" font-size="9.5" fill="#222">A holding deposit of one week’s rent</text><text x="18" y="254" font-family="Arial" font-size="9.5" fill="#222">is required to reserve the room.</text><text x="18" y="278" font-family="Arial" font-size="9.5" fill="#222">Minimum 6-month tenancy. References</text><text x="18" y="292" font-family="Arial" font-size="9.5" fill="#222">and a UK guarantor are required.</text></svg>`)
  };

  /* ---------- 弹窗里的几个画面 ---------- */
  let m = null, stack = [], imgUrl = null;
  function open() {
    const k = w();
    if (trans == null) { let l = 'zh'; try { l = LANG; } catch (_) { /* 页面还没准备好 */ } trans = l === 'ja' ? 'ja' : l === 'en' ? 'off' : 'zh'; }   // 默认：日文界面译成日文，中文界面译成中文，英文界面只看原文
    m = BT.modal({ eyebrow: k.eyebrow, title: k.heading, closed: () => { m = null; stack = []; } });
    m.box.classList.add('sr-box');
    stack = []; home();
  }
  const clear = () => { m.body.replaceChildren(); m.foot.replaceChildren(); m.body.scrollTop = 0; };

  /* 第 1 步：三种入口 + 示例 */
  function home() {
    const k = w(); clear();
    m.body.append(el('p', 'bt-lede', k.lede));
    const grid = el('div', 'sr-entries');
    const fileEntry = (title, sub, capture) => {
      const lab = el('label', 'sr-entry'), inp = el('input'); inp.type = 'file'; inp.accept = 'image/*'; if (capture) inp.setAttribute('capture', 'environment');
      inp.addEventListener('change', () => { const f = inp.files && inp.files[0]; if (!f) return; if (imgUrl) URL.revokeObjectURL(imgUrl); imgUrl = URL.createObjectURL(f); scan(imgUrl, 'official', true); });
      lab.append(inp, el('b', '', title), el('span', '', sub)); return lab;
    };
    grid.append(fileEntry(k.camera, k.cameraSub, true), fileEntry(k.upload, k.uploadSub, false));
    const linkBox = el('div', 'sr-entry sr-link'), row = el('form', 'sr-linkrow'), inp = el('input'), go = el('button', 'bt-btn', k.go);
    inp.type = 'url'; inp.id = 'srLink'; inp.placeholder = k.linkPh; inp.autocomplete = 'off'; go.type = 'submit';
    const err = el('p', 'sr-err');
    row.append(inp, go);
    row.addEventListener('submit', e => {
      e.preventDefault(); err.textContent = '';
      const v = inp.value.trim(); let u = null; try { u = new URL(/^https?:/i.test(v) ? v : 'https://' + v); } catch (_) { u = null; }
      if (!u || !/\./.test(u.hostname)) { err.textContent = k.badLink; return; }
      const s = u.href;
      scan(null, /iq|great-?newton/i.test(s) ? 'official' : /amber|uhomes|unilodgers|casita|student\.com|studentcrowd|platform/i.test(s) ? 'platform' : 'unknown');
    });
    linkBox.append(el('b', '', k.link), el('span', '', k.linkSub), row, err);
    grid.append(linkBox);
    m.body.append(grid, el('p', 'br-sub', k.tryH));
    const ex = el('div', 'sr-examples');
    [['official', k.ex1], ['platform', k.ex2], ['unknown', k.ex3]].forEach(([kind, label]) => {
      const b = btn('sr-example'); const img = el('img'); img.src = SHOTS[kind]; img.alt = '';
      b.append(img, el('span', '', label)); b.addEventListener('click', () => scan(SHOTS[kind], kind)); ex.append(b);
    });
    m.body.append(ex);
    const how = el('details', 'sr-how'); how.append(el('summary', '', k.steps), el('p', '', k.how));
    m.body.append(how, el('p', 'bt-note', k.demoNote));
  }

  /* 第 2 步：识别动画（演示：约 1.6 秒） */
  function scan(src, kind, own) {
    const k = w(); clear();
    const box = el('div', 'sr-scan'), pic = el('div', 'sr-pic');
    if (src) { const img = el('img'); img.src = src; img.alt = ''; pic.append(img); } else pic.append(el('span', 'sr-linkpic', '🔗'));
    pic.append(el('i', 'sr-beam'));
    const list = el('ul', 'sr-steps');
    [k.s1, k.s2, k.s3].forEach(s => list.append(el('li', '', s)));
    box.append(pic, el('p', 'sr-scanning', k.scanning), list);
    m.body.append(box);
    const fast = matchMedia('(prefers-reduced-motion: reduce)').matches, step = fast ? 120 : 480;
    [...list.children].forEach((li, i) => setTimeout(() => li.classList.add('on'), step * (i + 1)));
    setTimeout(() => { if (!m) return; stack = []; if (kind === 'official') reader('overview', own); else if (kind === 'platform') platform(src); else unknown(src); }, step * 3 + 300);
  }

  /* 一句英文：重点词加下划线；下面一行是翻译；重点句左边有色条 */
  function sentence(s) {
    const row = el('div', 'sr-s' + (s.flag ? ' ' + s.flag : '')), p = el('p', 'sr-en'), expl = el('div', 'sr-expl'); expl.hidden = true;
    let rest = s.en;
    while (rest) {
      let best = null;
      TERMS.forEach(t => { const r = t.re.exec(rest); if (r && (!best || r.index < best.r.index)) best = { t, r }; });
      if (!best) { p.append(rest); break; }
      p.append(rest.slice(0, best.r.index));
      const b = btn('sr-term', best.r[0]); const t = best.t;
      b.addEventListener('click', e => { e.stopPropagation(); const same = !expl.hidden && expl.dataset.k === t.k; expl.hidden = same; expl.dataset.k = t.k; expl.textContent = L3(t); });
      p.append(b); rest = rest.slice(best.r.index + best.r[0].length);
    }
    row.append(p);
    if (trans !== 'off' && s[trans]) row.append(el('p', 'sr-tr', s[trans]));
    if (s.note) row.append(el('p', 'sr-note', (s.flag === 'warn' ? '⚠️ ' : '💡 ') + L3(s.note)));
    row.append(expl);
    return row;
  }
  function transBar(redraw) {
    const k = w(), bar = el('div', 'sr-transbar'); bar.append(el('span', '', k.transTo));
    [['zh', k.zh], ['ja', k.ja], ['off', k.off]].forEach(([v, label]) => {
      const b = btn('bt-chipbtn' + (trans === v ? ' on' : ''), label); b.setAttribute('aria-pressed', String(trans === v));
      b.addEventListener('click', () => { trans = v; redraw(); }); bar.append(b);
    });
    return bar;
  }
  function header(kind, url) {
    const k = w(), top = el('div', 'sr-src');
    const back = btn('bt-link', k.back); back.addEventListener('click', () => { stack.pop(); const prev = stack.pop(); if (prev) reader(prev); else home(); });
    const chip = el('span', 'bt-tag ' + (kind === 'official' ? 'good' : kind === 'platform' ? '' : 'warn'), kind === 'official' ? k.srcOfficial : kind === 'platform' ? k.srcPlatform : k.srcUnknown);
    top.append(back, chip);
    if (url) top.append(el('span', 'sr-url', url));
    return top;
  }
  async function copyText(b, text) { const k = w(); if (await BT.copy(text)) { const o = b.textContent; b.textContent = k.copied; setTimeout(() => { b.textContent = o; }, 1300); } }

  /* 第 3 步 · 已收录的公寓官网：阅读模式 */
  function reader(page, own) {
    const k = w(), P = PAGES[page], h = homeById(OFFICIAL_HOME); clear();
    stack.push(page);
    m.body.append(header('official', P.url));
    if (own) m.body.append(el('p', 'bt-note', k.yourPhoto));
    m.body.append(el('span', 'bt-tag demo sr-sampletag', k.sample), transBar(() => { stack.pop(); reader(page); }));
    // 这一页的重点
    const warn = P.blocks.filter(b => b.flag === 'warn');
    if (warn.length) {
      const sum = el('div', 'sr-keys'); sum.append(el('b', '', fmt(k.keyH, { n: warn.length })));
      const ol = el('ol'); warn.forEach(b => ol.append(el('li', '', L3(b.note)))); sum.append(ol); m.body.append(sum);
    }
    // 公寓透明卡（第一页）
    if (page === 'overview' && h) {
      const c = el('div', 'sr-card'); c.append(el('b', '', k.cardH));
      const dl = el('dl');
      [[k.operator, 'iQ Student Accommodation'], [k.area, fmt(k.walk, { n: h.uol })], [k.opened, k.noRecord], [k.refurb, k.noRecord]].forEach(([a, b]) => { dl.append(el('dt', '', a)); const dd = el('dd', b === k.noRecord ? 'sr-norec' : '', b); dl.append(dd); });
      c.append(dl); m.body.append(c);
    }
    m.body.append(el('p', 'bt-note', k.tapHint));
    const page_ = el('article', 'sr-page');
    P.blocks.forEach(b => {
      if (b.h) page_.append(el('h4', 'sr-h', b.h));
      else if (b.price) {
        const box = el('div', 'sr-price'); box.append(el('p', 'sr-en', b.en));
        if (trans !== 'off' && b[trans]) box.append(el('p', 'sr-tr', b[trans]));
        const s = btn('qt-tag small', k.splitPrice);
        s.addEventListener('click', () => { const hh = h; BT.close(); try { window.QuoteCheck.open(hh, b.room, 'split'); } catch (_) { /* 没有报价拆解 */ } });
        box.append(s); page_.append(box);
      } else if (b.links) {
        const row = el('div', 'sr-links');
        b.links.forEach(([to, label]) => {
          const a = btn('sr-linkbtn' + (to === 'book' ? ' book' : ''));
          a.append(el('span', '', label), el('small', '', to === 'book' ? '🔒' : k.openPage));
          a.addEventListener('click', () => (to === 'book' ? bookStop() : reader(to)));
          row.append(a);
        });
        page_.append(row);
      } else page_.append(sentence(b));
    });
    m.body.append(page_);
    // 可以问顾问的问题
    const ask = el('div', 'sr-ask'); ask.append(el('b', '', k.askH));
    P.ask.forEach(([en, zh]) => {
      const q = el('div', 'sr-q'); q.append(el('p', 'sr-en', en), el('p', 'sr-tr', zh));
      const r = el('div', 'sr-qbtns'), c1 = btn('br-copy', k.copy), c2 = btn('br-copy', k.copyBoth);
      c1.addEventListener('click', () => copyText(c1, en)); c2.addEventListener('click', () => copyText(c2, en + '\n' + zh));
      r.append(c1, c2); q.append(r); ask.append(q);
    });
    m.body.append(ask, el('p', 'bt-note', k.demoNote));
    footer();
  }
  /* 到「Book now」就停下：预订和付款请在官网完成 */
  function bookStop() {
    const k = w(), box = el('div', 'sr-stop');
    box.append(el('b', '', '🔒 ' + k.bookStopH), el('p', '', k.bookStopP));
    const a = el('a', 'bt-btn', k.toSite); a.href = OFFICIAL_SITE; a.target = '_blank'; a.rel = 'noopener';
    box.append(a);
    const old = m.body.querySelector('.sr-stop'); if (old) old.remove();
    m.body.querySelector('.sr-page').after(box); box.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  /* 第 3 步 · 租房平台截图：只用截图里的信息 */
  function platform(src) {
    const k = w(), h = homeById(PLATFORM.home); clear(); stack.push('platform');
    m.body.append(header('platform'));
    m.body.append(el('p', 'bt-lede', k.platformLede));
    const row = el('div', 'sr-plat');
    if (src) { const img = el('img', 'sr-thumb'); img.src = src; img.alt = ''; row.append(img); }
    const info = el('div');
    const roomName = (() => { try { const t = window.RoomPhotos.types(h).find(x => x.key === PLATFORM.room); return t ? t.name : PLATFORM.room; } catch (_) { return PLATFORM.room; } })();
    info.append(el('b', '', fmt(k.recognized, { home: h ? h.name : 'Capital Gate', room: roomName })), el('p', '', fmt(k.recogPrice, { wk: money(PLATFORM.wk), weeks: PLATFORM.weeks, cash: money(PLATFORM.cash) })));
    row.append(info); m.body.append(row, el('span', 'bt-tag demo sr-sampletag', k.sample));
    let s = null;
    try { const o = window.QuoteCheck.official(h, PLATFORM.room); s = window.QuoteCheck.split(o, PLATFORM.wk, PLATFORM.weeks); } catch (_) { s = null; }
    if (s) {
      const card = el('div', 'qc-line'); card.append(el('b', 'qc-head', k.platformSplit));
      const bar = el('div', 'qc-bar'), part = (cls, val, label) => { if (val <= 0) return; const x = el('span', cls); x.style.flexGrow = String(val); x.append(el('i', '', label), el('b', '', money(val))); bar.append(x); };
      part('off', s.cash, BT.lang() === 'en' ? 'Official' : '官方返现'); part('sub', s.sub, BT.lang() === 'en' ? 'Platform' : '平台补'); part('pay', s.pay, BT.lang() === 'en' ? 'You pay' : '你实际付');
      card.append(bar, el('p', 'qc-explain', fmt(k.platformSay, { cash: money(PLATFORM.cash), sub: money(s.sub), off: money(s.cash) })));
      m.body.append(card);
    }
    const acts = el('div', 'qc-actions'), o1 = btn('bt-btn', k.openSplit), o2 = btn('bt-link sr-seeofficial', k.seeOfficial);
    o1.addEventListener('click', () => {
      const store = BT.store('lsm-quote-v3'), all = store.get() || {}; Object.assign(all, { wk: String(PLATFORM.wk), weeks: PLATFORM.weeks, room: PLATFORM.room }); store.set(all);
      BT.close(); try { window.QuoteCheck.open(h, PLATFORM.room, 'split'); } catch (_) { /* 没有报价拆解 */ }
    });
    o2.addEventListener('click', () => { BT.close(); try { show(h, true); } catch (_) { /* 页面还没准备好 */ } });
    acts.append(o1); m.body.append(acts, o2, el('p', 'bt-note', k.demoNote));
    footer();
  }

  /* 第 3 步 · 还没收录的网站：翻译 + 标重点 + 记进待收录 */
  function unknown(src) {
    const k = w(); clear(); stack.push('unknown');
    m.body.append(header('unknown'));
    const row = el('div', 'sr-plat');
    if (src) { const img = el('img', 'sr-thumb'); img.src = src; img.alt = ''; row.append(img); }
    const info = el('div'); info.append(el('p', '', k.unknownLede)); row.append(info);
    m.body.append(row, transBar(() => { stack.pop(); unknown(src); }));
    const page_ = el('article', 'sr-page'); UNKNOWN.forEach(s => page_.append(sentence(s))); m.body.append(page_);
    m.body.append(el('p', 'sr-queued', '📌 ' + k.queued), el('p', 'bt-note', k.demoNote));
    footer();
  }
  function footer() {
    const k = w(), again = btn('bt-btn alt', k.again);
    again.addEventListener('click', () => { stack = []; home(); });
    m.foot.append(again);
  }

  /* ---------- 入口：顶部栏📷按钮 + 开场页的订房小工具 + ?snap=1 ---------- */
  BT.add({ id: 'snap', order: 0, intro: () => w().intro, open: () => open() });
  const bar = document.querySelector('.brandbar'), info = document.getElementById('infobtn');
  if (bar && info) {   // 电脑：顶部栏里一个圆按钮
    const b = btn('infobtn sr-camera', '📷'); b.setAttribute('aria-label', w().aria); b.title = w().aria;
    b.addEventListener('click', e => { e.stopPropagation(); open(); });
    info.before(b);
  }
  const pill = btn('sr-pill', w().pill);   // 手机：顶部栏放不下，天气标签下面一个小按钮
  pill.addEventListener('click', e => { e.stopPropagation(); open(); });
  document.body.append(pill);
  if (new URLSearchParams(location.search).get('snap') === '1') setTimeout(() => { try { window.HomeMatch.exit(); } catch (_) { /* 没有 */ } open(); }, 500);
  window.SnapRead = { open };
})();
