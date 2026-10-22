/* Browser-only conversation prototype. No AI service, message transport or persistent storage. */
(() => {
  'use strict';
  const conversations = new Map();
  const MAX_LENGTH = 500, MAX_MESSAGES = 40;
  const words = {
    zh: {
      badge: '对话演示 · 尚未接入 AI', privacy: '内容仅在当前页面演示，不会发送给顾问。关闭网页后清空，请勿填写手机号、证件或其他隐私信息。',
      greeting: name => `你好！这里是 ${name} 的咨询对话演示。你可以试着问价格、预算或位置；下面是预设回复，不代表实时房态。`,
      demo: '演示回复', you: '你', log: '咨询演示记录', clear: '清空本房源对话', cleared: '本房源的演示对话已清空。',
      input: '想问什么？', placeholder: '例如：每周 £180 左右，有什么需要确认？', send: '发送（演示）', hint: '最多 500 字 · Ctrl / ⌘ + Enter 发送',
      chips: [['price','看看价格'],['budget','预算怎么选'],['location','公寓在哪'],['group','了解入群']],
      price: h => `${h.name} 的历史参考价${priceLine(h,'zh')}。数据查询日期为 2026 年 10 月 17 日，不是实时报价；学年、房型、租期、账单和是否有房都需要向公寓确认。`,
      budget: '可以先确定每周预算、Ensuite（独立卫浴，共用厨房）或 Studio（独立卫浴和厨房），再使用地图的预算和房型筛选。这里只演示对话，不会替你匹配或预订房源。',
      location: h => `${h.name} 的地址是 ${h.addr || '待确认'}。地图上的步行时间是距离估算，并非真实步行路线；上课楼宇和实际路线请另外确认。`,
      group: '预算、需求和称呼都可以不填。你愿意进群后，顾问收到建群提示，人工为你建专属群，把群码回复给建群助手，再由系统回到你的网站对话。点击下方“两端流程演示”可以体验；目前没有真实连接微信。',
      fallback: '收到，这是预设的演示回复，还没有连接 AI 或顾问。你可以试试“价格”“预算”“位置”，或在下方了解微信入群流程；实际房态暂时无法在这里确认。',
      channels: '继续联系', wechat: '微信 WeChat', whatsapp: 'WhatsApp', wechatNote: '面向中国学生的微信交流入口。',
      noWechat: '个人微信联系方式待配置，暂时无法添加。', noWhatsapp: '号码待配置，暂时无法发起联系。',
      personal: '个人微信尚未接入自动回复。', copy: '复制微信号', copied: '微信号已复制。', copyFailed: '无法自动复制，请手动选择上方微信号。', realQr: '微信联系二维码',
      waGo: '前往 WhatsApp', waNote: '将打开 WhatsApp；只有你主动发送后，对方才会收到。', waMessage: h => `你好！我想咨询 ${h.name}（${h.addr || ''}）的学生住宿，请问有房吗？`,
      groupPrivacy: '一位学生一个专属群：人工建群，把群码回复给助手，再回传学生对话。资料选填、入群自愿。此处仅演示，未连接微信。',
      groupButton: '两端流程演示：人工建群 → 群码回传', count: n => `${n} / 500 字`,
    },
    en: {
      badge: 'Conversation demo · AI not connected', privacy: 'This stays on this page and is not sent to an adviser. It clears when the page closes. Do not enter phone numbers, ID details or private information.',
      greeting: name => `Welcome to the conversation demo for ${name}. Try asking about price, budget or location. Replies are scripted, not live availability.`,
      demo: 'Demo reply', you: 'You', log: 'Demo conversation', clear: 'Clear this home’s chat', cleared: 'This home’s demo conversation was cleared.',
      input: 'What would you like to ask?', placeholder: 'For example: what should I check with a £180 weekly budget?', send: 'Send (demo)', hint: '500 characters max · Ctrl / ⌘ + Enter to send',
      chips: [['price','Price'],['budget','Budget'],['location','Location'],['group','Joining a group']],
      price: h => `Historical guide prices for ${h.name}${priceLine(h,'en')}. The recorded check date is 17 October 2026, not a live quote. Confirm the academic year, room, tenancy, bills and availability with the property.`,
      budget: 'Start with your weekly budget and an ensuite (private bathroom, shared kitchen) or studio (private bathroom and kitchen), then use the map filters. This demo does not match or reserve rooms for you.',
      location: h => `${h.name} is listed at ${h.addr || 'address to be confirmed'}. Walking times on the map are distance estimates, not routed journeys. Check your teaching building and actual route separately.`,
      group: 'Your name, budget and requirements are optional. An adviser would receive a request, manually create your own group and reply to the assistant with its code; that code would return to your website chat. The two-sided walkthrough below simulates this, without connecting to WeChat.',
      fallback: 'This is a scripted demo reply; no AI or adviser is connected. Try price, budget or location, or preview the WeChat group flow below. Live room availability cannot be confirmed here.',
      channels: 'Contact options', wechat: 'WeChat 微信', whatsapp: 'WhatsApp', wechatNote: 'A WeChat contact option for Chinese students.',
      noWechat: 'Personal WeChat details are not configured yet.', noWhatsapp: 'No number configured; contact is not available yet.',
      personal: 'Personal WeChat auto-replies are not connected.', copy: 'Copy WeChat ID', copied: 'WeChat ID copied.', copyFailed: 'Please select and copy the WeChat ID manually.', realQr: 'WeChat contact QR code',
      waGo: 'Open WhatsApp', waNote: 'Opens WhatsApp. The recipient only receives a message when you choose to send it.', waMessage: h => `Hello! I’m interested in ${h.name} (${h.addr || ''}). Do you have student rooms available?`,
      groupPrivacy: 'One group per student: an adviser creates it manually, replies to the assistant with the code, and the code returns to that student’s chat. Details and joining are optional. No WeChat connection.',
      groupButton: 'Two-sided walkthrough (Chinese): create & return code', count: n => `${n} / 500 characters`,
    },
    ja: {
      badge: '会話デモ · AI 未接続', privacy: '入力はこのページ内だけで表示され、担当者には送信されません。ページを閉じると消えます。電話番号・身分証などの個人情報は入力しないでください。',
      greeting: name => `${name} の相談デモです。料金・予算・場所について試せます。定型文による返信で、最新の空室情報ではありません。`,
      demo: 'デモ返信', you: 'あなた', log: '相談デモの履歴', clear: 'この物件の会話を消去', cleared: 'この物件のデモ会話を消去しました。',
      input: '何を知りたいですか？', placeholder: '例：週 £180 の予算で何を確認すべきですか？', send: '送信（デモ）', hint: '最大 500 文字 · Ctrl / ⌘ + Enter で送信',
      chips: [['price','料金'],['budget','予算'],['location','場所'],['group','グループ参加']],
      price: h => `${h.name} の過去の参考料金${priceLine(h,'ja')}。確認日は 2026 年 10 月 17 日で、最新の見積もりではありません。学年・部屋・契約期間・光熱費・空室は物件にご確認ください。`,
      budget: '週の予算と Ensuite（専用バスルーム・共用キッチン）または Studio（専用バスルーム・キッチン）を決め、地図の条件検索を使えます。このデモでは物件のマッチングや予約はできません。',
      location: h => `${h.name} の住所：${h.addr || '要確認'}。地図の徒歩時間は距離からの推定で、実際の経路ではありません。授業の建物と歩く経路を別途ご確認ください。`,
      group: '名前・予算・希望条件は任意です。担当者が通知を受け、専用グループを手動で作成し、そのコードをアシスタントに返信すると、学生の元の会話に届く流れです。下の中国語デモで両側を体験できます。WeChat には未接続です。',
      fallback: '定型文によるデモ返信です。AI や担当者には接続していません。「料金」「予算」「場所」を試すか、下の WeChat グループ参加デモをご覧ください。最新の空室は確認できません。',
      channels: '連絡方法', wechat: 'WeChat 微信', whatsapp: 'WhatsApp', wechatNote: '中国人学生向けの WeChat 連絡窓口。',
      noWechat: '個人 WeChat の連絡先は未設定です。', noWhatsapp: '番号未設定のため、まだ連絡できません。',
      personal: '個人 WeChat の自動返信は未接続です。', copy: 'WeChat ID をコピー', copied: 'WeChat ID をコピーしました。', copyFailed: '上の WeChat ID を手動で選択してコピーしてください。', realQr: 'WeChat 連絡用 QR コード',
      waGo: 'WhatsApp を開く', waNote: 'WhatsApp を開きます。送信を選んだときだけ相手に届きます。', waMessage: h => `こんにちは。${h.name}（${h.addr || ''}）の学生向け部屋の空き状況を知りたいです。`,
      groupPrivacy: '学生ごとに専用グループを手動で作り、コードをアシスタント経由で元の会話へ返す流れです。情報入力・参加は任意です。WeChat には未接続です。',
      groupButton: '両側の流れを見る（中国語）', count: n => `${n} / 500 文字`,
    },
  };

  function priceLine(home, lang) {
    const parts = [];
    if (Number.isFinite(home.pe)) parts.push(`Ensuite £${home.pe}`);
    if (Number.isFinite(home.ps)) parts.push(`Studio £${home.ps}`);
    if (!parts.length && Number.isFinite(home.plo)) parts.push(`£${home.plo}`);
    if (!parts.length) return lang === 'zh' ? '暂缺' : lang === 'ja' ? 'は未記録です' : ' are not recorded';
    return lang === 'zh' ? `为 ${parts.join('，')} 起／周` : lang === 'ja' ? `は ${parts.join('、')}〜／週です` : ` start at ${parts.join(', ')} per week`;
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(className, text) {
    const node = element('button', className, text); node.type = 'button'; return node;
  }
  function intent(text) {
    if (/入群|群聊|二维码|加群|wechat|微信|join|group|グループ|参加|qr/i.test(text)) return 'group';
    if (/预算|budget|予算/.test(text.toLowerCase())) return 'budget';
    if (/价格|价钱|租金|费用|多少钱|price|cost|rent|料金|家賃|£|\d+\s*(镑|磅|英镑)/i.test(text)) return 'price';
    if (/在哪|地址|位置|学校|步行|上课|location|address|walk|university|where|場所|住所|大学|徒歩/i.test(text)) return 'location';
    return 'fallback';
  }
  function reply(kind, home, w) { return typeof w[kind] === 'function' ? w[kind](home) : w[kind]; }
  function safeImagePath(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try { const url = new URL(value, window.location.href); return /^https?:$/.test(url.protocol) ? url.href : null; }
    catch (_) { return null; }
  }
  function open(home, language, config = {}) {
    const root = document.getElementById('contactDemo');
    if (!root || !home) return;
    const lang = words[language] ? language : 'zh', w = words[lang];
    const key = String(home.id || home.name);
    if (!conversations.has(key)) conversations.set(key,{messages:[],draft:''});
    const state = conversations.get(key);
    root.replaceChildren(); root.className = 'contact-demo';
    const flowUrl = './handoff-demo.html?home=' + encodeURIComponent(String(home.name || '').slice(0,100));
    function flowLink() { const link=element('a','cd-flow-link',w.groupButton);link.href=flowUrl;return link; }
    const notice = element('div','cd-notice'); notice.append(element('strong','cd-demo-badge',w.badge),element('p','',w.privacy),flowLink());
    const chat = element('section','cd-chat'); chat.setAttribute('aria-label',w.log);
    const toolbar = element('div','cd-chat-toolbar'), clear = button('cd-quiet',w.clear);
    toolbar.append(element('span','cd-chat-caption',w.log),clear);
    const log = element('div','cd-log'); log.setAttribute('role','log'); log.setAttribute('aria-label',w.log); log.setAttribute('aria-live','polite'); log.setAttribute('aria-relevant','additions'); log.tabIndex=0;
    function bubble(role,text) { const item=element('div',`cd-bubble cd-${role}`); item.append(element('span','cd-speaker',role==='user'?w.you:w.demo),element('p','',text)); return item; }
    log.append(bubble('reply',w.greeting(home.name)));
    state.messages.forEach(m => log.append(bubble(m.role,m.text)));
    const chips=element('div','cd-chips');
    const form=element('form','cd-composer'), label=element('label','cd-input-label',w.input);
    label.htmlFor='cdMessage';
    const input=element('textarea','cd-input'); input.id='cdMessage'; input.rows=2; input.maxLength=MAX_LENGTH; input.placeholder=w.placeholder; input.value=state.draft; input.setAttribute('aria-describedby','cdInputHint cdInputCount');
    const controls=element('div','cd-composer-controls'), hint=element('span','cd-input-hint',w.hint); hint.id='cdInputHint';
    const count=element('span','cd-count',w.count(input.value.length)); count.id='cdInputCount';
    const submit=element('button','cd-send',w.send); submit.type='submit'; submit.disabled=!input.value.trim();
    controls.append(count,submit); form.append(label,input,hint,controls);
    function send(text,kind) {
      const message=String(text).trim().slice(0,MAX_LENGTH); if (!message) return;
      const answer=reply(kind || intent(message),home,w);
      state.messages.push({role:'user',text:message},{role:'reply',text:answer});
      if (state.messages.length>MAX_MESSAGES) state.messages.splice(0,state.messages.length-MAX_MESSAGES);
      log.replaceChildren(bubble('reply',w.greeting(home.name)),...state.messages.map(m=>bubble(m.role,m.text)));
      state.draft=''; input.value=''; count.textContent=w.count(0); submit.disabled=true;
      log.scrollTop=log.scrollHeight; input.focus({preventScroll:true});
    }
    w.chips.forEach(([kind,text]) => { const chip=button('cd-chip',text); chip.addEventListener('click',()=>send(text,kind)); chips.append(chip); });
    input.addEventListener('input',()=>{state.draft=input.value.slice(0,MAX_LENGTH);count.textContent=w.count(input.value.length);submit.disabled=!input.value.trim();});
    input.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)&&!e.isComposing&&e.keyCode!==229){e.preventDefault();send(input.value);}});
    form.addEventListener('submit',e=>{e.preventDefault();send(input.value);});
    const status=element('p','cd-status'); status.setAttribute('role','status');
    clear.addEventListener('click',()=>{state.messages=[];state.draft='';input.value='';count.textContent=w.count(0);submit.disabled=true;log.replaceChildren(bubble('reply',w.greeting(home.name)));status.textContent=w.cleared;});
    chat.append(toolbar,log,chips,form);

    const channels=element('section','cd-channels'); channels.setAttribute('aria-label',w.channels);
    channels.append(element('h4','cd-section-title',w.channels));
    const grid=element('div','cd-channel-grid'), wechat=element('div','cd-channel cd-wechat'), whatsapp=element('div','cd-channel cd-whatsapp');
    wechat.append(element('h4','',w.wechat),element('p','cd-channel-note',w.wechatNote));
    const wechatId=typeof config.wechatId==='string'?config.wechatId.trim():'';
    const qr=safeImagePath(config.wechatQr);
    if(wechatId){
      const row=element('div','cd-id-row'), id=element('code','',wechatId), copy=button('cd-quiet',w.copy);
      copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(wechatId);status.textContent=w.copied;}catch(_){status.textContent=w.copyFailed;}});
      row.append(id,copy);wechat.append(row);
    }
    if(qr){const img=element('img','cd-real-qr');img.src=qr;img.alt=w.realQr;img.loading='lazy';wechat.append(img);}
    if(!wechatId&&!qr)wechat.append(element('p','cd-unconfigured',w.noWechat));
    wechat.append(element('p','cd-channel-note',w.personal));
    wechat.append(element('p','cd-group-privacy',w.groupPrivacy),flowLink());
    whatsapp.append(element('h4','',w.whatsapp));
    const rawPhone=typeof config.whatsapp==='string'?config.whatsapp.trim():'';
    const phone=rawPhone.replace(/[\s()+-]/g,'');
    if(/^\d{7,15}$/.test(phone)){
      whatsapp.append(element('p','cd-phone',rawPhone));
      const link=element('a','cd-wa-link',w.waGo);link.href=`https://wa.me/${phone}?text=${encodeURIComponent(w.waMessage(home))}`;link.target='_blank';link.rel='noopener noreferrer';
      whatsapp.append(link,element('p','cd-channel-note',w.waNote));
    } else whatsapp.append(element('p','cd-unconfigured',w.noWhatsapp));
    grid.append(wechat,whatsapp);channels.append(grid);
    root.append(notice,chat,channels,status);
  }
  window.ContactDemo=Object.freeze({open});
})();
