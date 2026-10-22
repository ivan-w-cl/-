/* 生活测试：6 道情景题 -> 15 种生活角色；再把答案换算成找房答案，得到 Top 3（与网页版 life-c-map 相同的换算）。 */
'use strict';
var model = require('./life-model.js');
var HM = require('./home-match.js');
function use(lang) { model.setLanguage(lang === 'en' ? 'en' : 'zh'); return model; }
function questions(lang) {
  use(lang);
  return model.questions.map(function (q) {
    return { id: q.id, q: q.title, opts: q.options.map(function (o) { return { id: o.id, emoji: o.icon, label: o.label, detail: o.detail }; }) };
  });
}
function valid(a) { return model.valid(a); }
/* a: 6 个选项下标；extra: { campus, walk, flavour } */
function run(a, extra, lang) {
  use(lang);
  var character = model.result(a);
  if (!character) return null;
  var mapAnswers = model.toMapAnswers(a, extra || {});
  var m = HM.match(mapAnswers, { lang: lang });
  return { character: { id: character.id, name: character.name, icons: character.icons, color: character.color,
    quote: character.quote, keywords: character.keywords, description: character.description,
    day: character.day.map(function (d) { return { time: d[0], title: d[1], text: d[2] }; }) },
    mapAnswers: mapAnswers, match: m, code: model.encode(a) };
}
module.exports = { questions: questions, valid: valid, run: run, model: model };
