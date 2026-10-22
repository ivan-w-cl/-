/* 复制自 web-original/consult-server/lib/email-template.js。顾问邮件提醒的内容（主题、HTML、纯文本）。Node 端由 notifiers.js 使用；同一份文件也能在浏览器里用
   （web-live/adviser/email-template.js 是它的副本），顾问后台演示里的邮件预览和真实邮件长得一样。
   事件格式与企业微信通知相同：{ title, session: { id, nickname, channel, context }, text, at, adminUrl }。 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api; else root.EmailTemplate = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CHANNEL = { miniprogram: '微信小程序', web: '网页', app: 'App' };

  function rows(e) {
    const s = e.session || {}, c = s.context || {};
    const homes = (c.homes || []).map(h => `${h.n ? h.n + '. ' : ''}${h.name}`).join('、') || '（未指定）';
    const quiz = [c.lifeCharacter && `生活测验：${c.lifeCharacter}`, c.homeMatch && `找房测验：${c.homeMatch}`].filter(Boolean).join('；') || '（未做测验）';
    const time = new Date(e.at || Date.now()).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });
    return [['学生', s.nickname || '匿名同学'], ['来源', CHANNEL[s.channel] || s.channel || '网页'], ['房源', homes], ['测验', quiz], ['内容', String(e.text || '').slice(0, 300)], ['时间', time + '（北京时间）']];
  }
  function emailContent(e) {
    const s = e.session || {}, list = rows(e);
    const subject = `【Liverpool Student Map】${e.title || '新的住宿咨询'} · ${s.nickname || '匿名同学'}`;
    const link = e.adminUrl ? e.adminUrl + (s.id ? '#' + encodeURIComponent(s.id) : '') : '';
    const html = `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#e9dcbc;font-family:-apple-system,'PingFang SC','Microsoft YaHei',Arial,sans-serif;color:#3b2a1a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fffaf0;border:3px solid #3b2a1a;border-radius:16px">
<tr><td style="padding:18px 22px 8px;font-size:13px;letter-spacing:.08em;color:#b5462f">LIVERPOOL STUDENT MAP · 顾问提醒</td></tr>
<tr><td style="padding:0 22px 12px;font-size:24px;font-weight:700;line-height:1.3">${esc(e.title || '新的住宿咨询')}</td></tr>
<tr><td style="padding:0 22px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px dashed #dcc8a0">
${list.map(([k, v]) => `<tr><td style="padding:8px 10px 8px 0;font-size:13px;color:#6e5538;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;font-size:15px;line-height:1.5">${esc(v)}</td></tr>`).join('\n')}
</table></td></tr>
${link ? `<tr><td style="padding:16px 22px 6px"><a href="${esc(link)}" style="display:inline-block;background:#b5462f;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:10px 20px;border-radius:10px;border:2px solid #3b2a1a">打开顾问后台处理</a></td></tr>` : ''}
<tr><td style="padding:10px 22px 20px;font-size:12px;color:#6e5538;line-height:1.5">建议尽快处理：学生在等待专属群二维码。此邮件由系统自动发送，请勿直接回复。</td></tr>
</table></td></tr></table></body></html>`;
    const text = [subject, '', ...list.map(([k, v]) => `${k}：${v}`), link ? `\n打开顾问后台：${link}` : ''].join('\n');
    return { subject, html, text };
  }
  return { emailContent };
});
