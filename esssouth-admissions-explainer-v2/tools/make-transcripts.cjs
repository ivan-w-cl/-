// Builds the 逐字稿 from the same timeline the animation plays (data.js + explainer.js segmentation and timing).
// Usage: node tools/make-transcripts.cjs   → writes 逐字稿/*.md
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { window: {} }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8') + ';this.SOURCES=SOURCES;this.CHAPTERS=CHAPTERS;this.SCHOOLS=SCHOOLS;this.CAST=CAST;this.QUESTIONS=QUESTIONS;', ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'explainer.js'), 'utf8').replace(/\}\)\(window\);\s*$/, '})(this.window);').replace(/SCHOOLS\b|QUESTIONS\b|CHAPTERS\b|CAST\b/g, m => m), ctx);
const X = ctx.window.EsssouthExplainer;
const strip = s => String(s).replace(/<[^>]+>/g, '');
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function onScreen(s) {
  if (s.type === 'title' || s.type === 'cta') return [strip(s.big), ...s.chips];
  if (s.type === 'table') return s.rows.map(r => `${r[0]} ｜ ${r[1]} ｜ ${r[2]}`);
  if (s.type === 'formula') return s.parts.map(p => `${p[0]} ${p[1]}%（${p[2]}）`);
  if (s.type === 'steps') return s.items.map((x, i) => `${i + 1}. ${x[0]}${x[1] ? '：' + x[1] : ''}${x[2] ? '（' + x[2] + '）' : ''}`);
  if (s.type === 'qa') return s.items.map(x => `[${x[1]}] ${x[0]}`);
  return s.items.map(x => `${x[0]}${x[1] ? '：' + x[1] : ''}`);
}
for (const [id, S] of Object.entries(ctx.SCHOOLS)) {
  const provs = S.provinces ? Object.entries(S.provinces) : [['all', '全国']];
  let md = `# ${S.short} · 考情与流程解析 · 逐字稿\n\n${S.name} · ${S.kind}\n\n> 字幕即旁白，与动画逐句对应（每集开头由一位同学提问，其余为「讲解」）。时间码与动画、MP4 和 SRT 一致。\n> 依据 2026 年官方简章；2027 年简章发布后需逐条核对更新。练习题为 esssouth 原创，不是真题。esssouth 与学校无官方合作关系。\n\n`;
  for (const [p, pn] of provs) {
    const TL = X.build(id, p), src = ctx.SOURCES[id][p] || ctx.SOURCES[id].all;
    md += `## ${pn}${S.provinces ? '考生版' : ''}（${mmss(TL.duration)}）\n\n依据：[${src[0]}](${src[1]})\n\n`;
    let lastCh = '';
    TL.items.forEach(it => {
      if (it.ch !== lastCh) { lastCh = it.ch; md += `### 第 ${it.ci + 1} 集 · ${it.chName}（${mmss(it.start)} 起）\n\n`; }
      if (it.kind === 'ask') { const c = ctx.CAST.find(x => x.id === it.who); md += `**${mmss(it.start)}　开场提问**（三位同学围坐，${c.name}提问）\n\n- ${c.name}：${it.q}\n\n`; return; }
      const s = it.s, headl = s.type === 'title' || s.type === 'cta' ? strip(s.big) : s.title;
      md += `**${mmss(it.start)}　${headl}**${s.kicker && s.type !== 'title' ? `（${s.kicker}）` : ''}\n\n画面文字：\n${onScreen(s).map(x => `- ${x}`).join('\n')}\n\n讲解：\n${s.say.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n`;
    });
  }
  fs.writeFileSync(path.join(root, '逐字稿', `${S.short.replace(/\s+/g, '')}-逐字稿.md`), md);
  console.log(id, md.length);
}
