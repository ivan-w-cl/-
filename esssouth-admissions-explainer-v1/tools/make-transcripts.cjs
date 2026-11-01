// Builds the 逐字稿 (narration = on-screen subtitles) from the same data block the animation plays.
// Usage: node tools/make-transcripts.cjs   → writes 逐字稿/*.md
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const code = html.match(/<script id="explainer-data">([\s\S]*?)<\/script>/)[1];
const ctx = {}; vm.createContext(ctx); vm.runInContext(code + ';this.D={SOURCES,CHAPTERS,SCHOOLS};', ctx);
const { SOURCES, CHAPTERS, SCHOOLS } = ctx.D;
const strip = s => String(s).replace(/<[^>]+>/g, '');
const secs = t => Math.max(2.6, t.replace(/\s/g, '').length / 4.6);
const mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
function onScreen(s) {
  if (s.type === 'title' || s.type === 'cta') return [strip(s.big), ...s.chips];
  if (s.type === 'table') return s.rows.map(r => `${r[0]} ｜ ${r[1]} ｜ ${r[2]}`);
  if (s.type === 'formula') return s.parts.map(p => `${p[0]} ${p[1]}%（${p[2]}）`);
  if (s.type === 'steps') return s.items.map((x, i) => `${i + 1}. ${x[0]}${x[1] ? '：' + x[1] : ''}${x[2] ? '（' + x[2] + '）' : ''}`);
  if (s.type === 'qa') return s.items.map(x => `[${x[1]}] ${x[0]}`);
  return s.items.map(x => `${x[0]}${x[1] ? '：' + x[1] : ''}`);
}
for (const [id, S] of Object.entries(SCHOOLS)) {
  const provs = S.provinces ? Object.entries(S.provinces) : [['all', '全国']];
  let md = `# ${S.short} · 考情与流程解析 · 逐字稿\n\n${S.name} · ${S.kind}\n\n`;
  md += `> 旁白即画面字幕，和动画逐句对应。依据 2026 年官方简章；2027 年简章发布后需逐条核对更新。时长按约 4.6 字/秒的语速估算。\n> 练习题为 esssouth 原创，不是真题。esssouth 与学校无官方合作关系。\n\n`;
  for (const [p, pn] of provs) {
    const src = SOURCES[id][p] || SOURCES[id].all;
    const scenes = S.scenes(p);
    const total = scenes.reduce((a, s) => a + s.say.reduce((b, t) => b + secs(t), 0), 0);
    md += `## ${pn}${S.provinces ? '考生版' : ''}（约 ${mmss(total)}）\n\n依据：[${src[0]}](${src[1]})\n\n`;
    CHAPTERS.forEach(([cid, cn], ci) => {
      const list = scenes.filter(s => s.ch === cid); if (!list.length) return;
      md += `### 第 ${ci + 1} 集 · ${cn}\n\n`;
      list.forEach((s, k) => {
        const head = s.type === 'title' || s.type === 'cta' ? strip(s.big) : s.title;
        md += `**画面 ${ci + 1}.${k + 1}　${head}**${s.kicker && s.type !== 'title' ? `（${s.kicker}）` : ''}\n\n画面文字：\n${onScreen(s).map(x => `- ${x}`).join('\n')}\n\n旁白：\n${s.say.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n`;
      });
    });
  }
  fs.writeFileSync(path.join(root, '逐字稿', `${S.short.replace(/\s+/g, '')}-逐字稿.md`), md);
  console.log(id, md.length);
}
