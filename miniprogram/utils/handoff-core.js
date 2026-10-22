/* 自动生成：scripts/export-handoff.cjs 从网页版 booking-handoff.js 摘出。不要手改。 */
let LANG = 'zh';
  const TEAMS = {
    A: { zh: '专家团队 A · 市中心与绳索街区', en: 'Team A · City Centre & Ropewalks', ja: 'チームA · シティセンター', members: ['Grace Wong', '陈思琪', 'Tom Hughes'] },
    B: { zh: '专家团队 B · 知识区与乔治亚街区', en: 'Team B · Knowledge & Georgian Quarter', ja: 'チームB · ナレッジ・クォーター', members: ['Daniel Lim', '刘佳', 'Sophie Clarke'] },
    C: { zh: '专家团队 C · 日本学生', en: 'Team C · Students from Japan', ja: 'チームC · 日本人学生', members: ['Kenji Mori', 'Emma Brown'] },
    D: { zh: '专家团队 D · 边山与肯辛顿合租房', en: 'Team D · Edge Hill & Kensington houses', ja: 'チームD · エッジヒル', members: ['Priya Shah', '王磊'] }
  };
  const W = {
    zh: { title: '进群，直接和预定专家聊', lead: '一位学生一个专属群。价格、档期、房型、合同，进群直接问专家，不用在这里填资料。',
      join: '立即进群', via: '将通过 {app} 进群', switchTo: '改用{app}', whatsapp: 'WhatsApp', wechat: '微信',
      waiting: '已通知顾问，正在为你建群…', waitingNote: '群码到了会在右下角提醒你，可以先继续看房。',
      qrTitle: '你的预定专家群', qrWa: '用手机扫码，或点下方按钮加入 WhatsApp 群。', qrWx: '用微信扫码或长按二维码加入群聊。',
      openWa: '在 WhatsApp 中打开', openNote: '演示：正式版会在这里打开 WhatsApp。', team: '你的团队', demo: '演示二维码，扫码不会进入真实群。',
      forwarded: '已把「{home}」发给你的专家群，进群后专家会接着跟你聊。', adviser: '顾问',
      code: '你的咨询编号 {code}', codeNote: '不用登录、不用留资料，专家用这个编号为你建群。', sending: '正在通知专家…', failed: '没连上服务器，请稍后再试。',
      askH: '先问一个小问题', askPh: '比如：还有房吗？', ask: '问', ai: 'AI 助手（演示）', you: '你',
      chips: ['还有房吗？', '每周多少钱？', '离学校多远？', '包水电网吗？', '可以两个人住吗？'],
      nudge: '这类问题需要专家查实时房态和合同，进群直接问最快：', nudge2: '看起来你在认真考虑「{home}」，要不要直接进群和专家确认？',
      validTill: '群二维码有效期至 {d}（微信群码 7 天有效）', expired: '这个群二维码已过期。', renew: '申请新群码', renewed: '已通知专家，新的群码会发到这里。',
      fab: '我的专家群', fabWait: '等待群码', fabReady: '群码已到', fabNew: '新消息', toastQr: '顾问发来了你的专家群二维码', toastMsg: '顾问发来一条消息', open: '打开', show: '显示消息提醒' },
    en: { title: 'Chat with booking experts in your own group', lead: 'One group per student. Ask about prices, dates, rooms and contracts right in the group. No forms here.',
      join: 'Join my group now', via: 'You will join on {app}', switchTo: 'Use {app} instead', whatsapp: 'WhatsApp', wechat: 'WeChat',
      waiting: 'An adviser has been notified and is setting up your group…', waitingNote: 'We will flag it at the bottom right when the code arrives. Keep browsing in the meantime.',
      qrTitle: 'Your booking expert group', qrWa: 'Scan with your phone, or tap the button to join the WhatsApp group.', qrWx: 'Scan or long-press the QR code in WeChat to join.',
      openWa: 'Open in WhatsApp', openNote: 'Demo: the real app opens WhatsApp here.', team: 'Your team', demo: 'Demo QR code. It does not open a real group.',
      forwarded: 'We sent "{home}" to your expert group. The experts will pick it up with you there.', adviser: 'Adviser',
      code: 'Your request code {code}', codeNote: 'No sign-up, no personal details. The experts use this code to set up your group.', sending: 'Notifying the experts…', failed: 'Could not reach the server. Please try again.',
      askH: 'Ask a quick question first', askPh: 'e.g. Is a room still available?', ask: 'Ask', ai: 'AI assistant (demo)', you: 'You',
      chips: ['Any rooms left?', 'How much per week?', 'How far from campus?', 'Are bills included?', 'Can two people share?'],
      nudge: 'Live availability and contracts need an expert. The quickest way is to ask in your group:', nudge2: 'Looks like you are serious about "{home}". Confirm it with an expert in your group?',
      validTill: 'QR code valid until {d} (WeChat group codes last 7 days)', expired: 'This group QR code has expired.', renew: 'Ask for a new code', renewed: 'The experts have been notified. A new code will appear here.',
      fab: 'My expert group', fabWait: 'Waiting for code', fabReady: 'Group code ready', fabNew: 'New message', toastQr: 'Your expert group QR code has arrived', toastMsg: 'New message from your adviser', open: 'Open', show: 'Show message reminder' },
    ja: { title: '専用グループで予約サポートと話す', lead: '学生ごとに専用グループを用意します。料金・空室・部屋・契約はグループで直接質問できます。入力は不要です。',
      join: '今すぐグループに参加', via: '{app} で参加します', switchTo: '{app} に変更', whatsapp: 'WhatsApp', wechat: 'WeChat',
      waiting: '担当者に通知しました。グループを作成中です…', waitingNote: 'QR コードが届いたら右下でお知らせします。その間も物件を見られます。',
      qrTitle: 'あなたの予約サポートグループ', qrWa: 'スマホで読み取るか、ボタンから WhatsApp グループに参加できます。', qrWx: 'WeChat で読み取ってグループに参加してください。',
      openWa: 'WhatsApp で開く', openNote: 'デモ：正式版ではここで WhatsApp が開きます。', team: '担当チーム', demo: 'デモ用 QR コードです。実際のグループには参加しません。',
      forwarded: '「{home}」をあなたのグループに共有しました。グループで続きを相談できます。', adviser: '担当者',
      code: 'あなたの相談番号 {code}', codeNote: '登録も個人情報も不要です。担当者はこの番号でグループを作ります。', sending: '担当者に通知中…', failed: 'サーバーに接続できませんでした。もう一度お試しください。',
      askH: 'まずは気軽に質問', askPh: '例：まだ空いていますか？', ask: '質問', ai: 'AI アシスタント（デモ）', you: 'あなた',
      chips: ['まだ空いていますか？', '週いくらですか？', '大学まで遠いですか？', '光熱費込みですか？', '2人で住めますか？'],
      nudge: '最新の空室や契約は担当者の確認が必要です。グループで聞くのが一番早いです：', nudge2: '「{home}」を本気で検討中のようです。グループで担当者に確認しませんか？',
      validTill: 'QR コードの有効期限：{d}（WeChat グループのコードは 7 日間）', expired: 'このグループ QR コードは期限切れです。', renew: '新しいコードを依頼', renewed: '担当者に通知しました。新しいコードはここに届きます。',
      fab: '専用グループ', fabWait: 'QR 待ち', fabReady: 'QR が届きました', fabNew: '新着', toastQr: 'グループの QR コードが届きました', toastMsg: '担当者からメッセージ', open: '開く', show: 'メッセージ通知を表示' }
  };

const lang = () => (W[LANG] ? LANG : 'zh');
  function answer(q, h) {
    const t = q.toLowerCase(), lg = lang(), name = h ? h.name : '';
    const price = h ? [h.pe && (lg === 'en' ? `en-suite from £${h.pe}` : `独卫 £${h.pe} 起`), h.ps && (lg === 'en' ? `studio from £${h.ps}` : `Studio £${h.ps} 起`), !h.pe && !h.ps && h.plo && `£${h.plo}`].filter(Boolean).join(lg === 'en' ? ', ' : '，') : '';
    const L3 = (zh, en, ja) => ({ zh, en, ja }[lg] || en);
    if (/有房|空房|还有|满了|available|any rooms|vacan|空き|空いて|book|预定|预订|订|合同|contract|契約/.test(t))
      return { text: L3(`${name} 的房态每天都在变，我这里只有 2026-10-17 的历史记录${h && h.pso ? '（当时显示无房）' : ''}，没法确认现在有没有房。`, `Availability at ${name} changes daily. I only have a record from 17 Oct 2026${h && h.pso ? ' (no rooms listed then)' : ''}, so I can't confirm what's free now.`, `${name} の空室は毎日変わります。手元には 2026/10/17 の記録しかなく、現在の空室は確認できません。`), push: true };
    if (/多少钱|价格|租金|贵|便宜|price|cost|rent|how much|per week|いくら|料金|家賃/.test(t))
      return { text: price ? L3(`${name} 的历史参考价：${price}／周。账单、合同长度和房型会影响总价。`, `Recorded prices at ${name}: ${price} per week. Bills, contract length and room type change the total.`, `${name} の参考価格：${price}／週。光熱費や契約期間で総額が変わります。`) : L3(`${name} 暂时没有记录参考价。`, `No recorded price for ${name} yet.`, `${name} の参考価格は未記録です。`), push: false };
    if (/远|多久|步行|学校|大学|far|walk|campus|distance|uni|遠い|徒歩|大学/.test(t))
      return { text: h ? L3(`步行到利物浦大学约 ${h.uol} 分钟，到 LJMU 约 ${h.ljmu} 分钟，到莱姆街火车站约 ${h.lime} 分钟（按距离估算）。`, `About ${h.uol} min walk to the University of Liverpool, ${h.ljmu} min to LJMU and ${h.lime} min to Lime Street (distance estimates).`, `リバプール大学まで徒歩約 ${h.uol} 分、LJMU まで約 ${h.ljmu} 分（距離からの推定）。`) : '', push: false };
    if (/水电|网|账单|bill|wifi|utilit|光熱|ネット/.test(t))
      return { text: L3('利物浦的学生公寓大多包水电网，但每家合同不一样，需要按这一套的合同确认。', 'Most Liverpool student homes include bills and Wi-Fi, but each contract differs, so it needs checking for this one.', 'リバプールの学生寮は多くが光熱費込みですが、契約ごとに異なるため確認が必要です。'), push: true };
    if (/两个人|情侣|伴侣|couple|two people|share|2人|カップル/.test(t))
      return { text: L3('部分公寓的一居室或 Studio 可以两人入住，要看具体房型和公寓规定。', 'Some one-bed flats and studios allow two people, depending on the room type and building rules.', '一部の 1ベッドやスタジオは 2 人入居可能です。部屋タイプと規約によります。'), push: true };
    return { text: L3('这个问题专家在群里回答会更准确。', 'An expert in your group can answer that more accurately.', 'この質問はグループで担当者が答える方が正確です。'), push: true };
  }
module.exports = { TEAMS, W, answer(q, h, l) { LANG = l || 'zh'; return answer(q, h); } };
