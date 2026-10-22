'use strict';
// Pluggable notifiers. Each has notify(event) -> Promise. Add more (email, 飞书, 钉钉…) by pushing to the list.
const { emailContent } = require('./email-template');
const log = { name: 'console', async notify(e) { console.log(`[notify] ${e.title} | 会话 ${e.session.id} | ${e.session.nickname || '匿名同学'} | ${e.text}`); } };

function wecomMarkdown(e) {
  const s = e.session, c = s.context || {};
  const homes = (c.homes || []).map(h => `${h.n ? h.n + '. ' : ''}${h.name}`).join('、') || '（未指定）';
  const quiz = [c.lifeCharacter && `生活测验：${c.lifeCharacter}`, c.homeMatch && `找房测验：${c.homeMatch}`].filter(Boolean).join('；') || '（未做测验）';
  const time = new Date(e.at || Date.now()).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
  return [
    `### ${e.title}`,
    `> 学生昵称：<font color="info">${s.nickname || '匿名同学'}</font>`,
    `> 渠道：${s.channel === 'miniprogram' ? '微信小程序' : '网页'}`,
    `> 房源：${homes}`,
    `> 测验摘要：${quiz}`,
    `> 原话：<font color="warning">${String(e.text).slice(0, 300)}</font>`,
    `> 时间：${time}（北京时间）`,
    e.adminUrl ? `[打开客服工作台](${e.adminUrl}#${s.id})` : ''
  ].filter(Boolean).join('\n');
}
function wecom(url) {
  return { name: 'wecom', async notify(e) {
    const body = JSON.stringify({ msgtype: 'markdown', markdown: { content: wecomMarkdown(e) } });
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    const j = await r.json().catch(() => ({}));
    if (j.errcode) throw new Error(`企业微信机器人返回 ${j.errcode} ${j.errmsg}`);
  } };
}
/* 邮件提醒：通过邮件服务的 HTTP 接口发送（默认 Resend 的格式：POST {from, to, subject, html, text}，Bearer 密钥）。
   换成其他服务（SendGrid、Mailgun、阿里云邮件推送等）时，改 EMAIL_API_URL 和下面的请求体即可。 */
function email(env) {
  const url = env.EMAIL_API_URL || 'https://api.resend.com/emails';
  const to = env.NOTIFY_EMAIL_TO.split(',').map(x => x.trim()).filter(Boolean);
  return { name: 'email', async notify(e) {
    const { subject, html, text } = emailContent(e);
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.EMAIL_API_KEY}` },
      body: JSON.stringify({ from: env.NOTIFY_EMAIL_FROM || 'Liverpool Student Map <notify@example.com>', to, subject, html, text }) });
    if (!r.ok) throw new Error(`邮件接口返回 ${r.status} ${(await r.text().catch(() => '')).slice(0, 200)}`);
  } };
}
function createNotifiers(env) {
  const list = [log];
  if (env.WECOM_WEBHOOK_URL) list.push(wecom(env.WECOM_WEBHOOK_URL));
  if (env.EMAIL_API_KEY && env.NOTIFY_EMAIL_TO) list.push(email(env));
  return {
    names: list.map(n => n.name),
    async notify(e) { await Promise.all(list.map(n => n.notify(e).catch(err => console.error(`[notify:${n.name}] 失败：`, err.message)))); }
  };
}
module.exports = { createNotifiers, wecomMarkdown };
