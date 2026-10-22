'use strict';
// Pluggable notifiers. Each has notify(event) -> Promise. Add more (email, 飞书, 钉钉…) by pushing to the list.
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
function createNotifiers(env) {
  const list = [log];
  if (env.WECOM_WEBHOOK_URL) list.push(wecom(env.WECOM_WEBHOOK_URL));
  return {
    names: list.map(n => n.name),
    async notify(e) { await Promise.all(list.map(n => n.notify(e).catch(err => console.error(`[notify:${n.name}] 失败：`, err.message)))); }
  };
}
module.exports = { createNotifiers, wecomMarkdown };
