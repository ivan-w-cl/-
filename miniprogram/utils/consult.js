/* 生成 <button open-type="contact" session-from> 的 JSON。
   consult-server/channels/miniprogram.js 在 user_enter_tempsession 事件里 JSON.parse(SessionFrom) 作为会话上下文。
   字段同时兼容网页版 consult-chat 的上下文（homes / lifeCharacter / homeMatch），工作台可直接显示。
   微信对 session-from 长度有限制（约 1000 字节），这里截断到 900 字节以内。 */
'use strict';
var MAX = 900;
function buildSessionFrom(opts) {
  var last = opts.last || null, homes = opts.homes || [];
  var quizSummary = [last && last.lifeCharacter, last && last.persona].filter(Boolean).join(' · ');
  var ctx = { source: 'miniprogram', lang: opts.lang === 'en' ? 'en' : 'zh', homeId: opts.homeId || '', quizSummary: quizSummary,
    homes: homes.slice(0, 3).map(function (h) { return { id: h.id, n: h.n, name: h.name }; }),
    lifeCharacter: (last && last.lifeCharacter) || '', homeMatch: (last && last.persona) || '' };
  var json = JSON.stringify(ctx);
  while (utf8Len(json) > MAX && ctx.homes.length > 1) { ctx.homes.pop(); json = JSON.stringify(ctx); }
  if (utf8Len(json) > MAX) { ctx.quizSummary = ctx.quizSummary.slice(0, 40); ctx.homeMatch = ctx.homeMatch.slice(0, 40); ctx.lifeCharacter = ctx.lifeCharacter.slice(0, 40); json = JSON.stringify(ctx); }
  return { ctx: ctx, json: json, quizSummary: quizSummary };
}
function utf8Len(s) { var n = 0; for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); n += c < 0x80 ? 1 : c < 0x800 ? 2 : (c >= 0xd800 && c < 0xdc00) ? (i++, 4) : 3; } return n; }
module.exports = { buildSessionFrom: buildSessionFrom, utf8Len: utf8Len, MAX: MAX };
