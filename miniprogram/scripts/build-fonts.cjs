/* 生成小程序用的手绘字体（放到服务器 web-live/fonts/，小程序用 wx.loadFontFace 从 config.FONT_BASE 加载）：
   - 中文手写体 ZCOOL KuaiLe 原文件 1.5 MB，只保留小程序里实际出现的汉字和标点；
   - 英文字体只保留拉丁字符。
   原始字体在 server-fonts/（Google Fonts，SIL Open Font License）。需要 Python 的 fonttools：pip install fonttools
   用法：node scripts/build-fonts.cjs */
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..'), SRC = path.join(ROOT, 'server-fonts'), OUT = path.resolve(ROOT, '..', 'web-live', 'fonts');
fs.mkdirSync(OUT, { recursive: true });
/* 收集所有会显示的文字：数据、文案、页面 */
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (/node_modules|server-fonts|scripts|tools|\.git/.test(p)) continue;
  if (fs.statSync(p).isDirectory()) walk(p); else if (/\.(js|wxml|json)$/.test(f)) files.push(p); } })(ROOT);
const text = files.map(f => fs.readFileSync(f, 'utf8')).join('');
const cjk = new Set([...text].filter(ch => /[ -⁯　-鿿＀-￯]/.test(ch)));
const latin = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~£€·–—‘’“”…★☆✓×→←↑↓°•';
const sub = (font, chars, out) => {
  const tmp = path.join(OUT, '.chars.txt'); fs.writeFileSync(tmp, chars);
  execFileSync('python3', ['-m', 'fontTools.subset', path.join(SRC, font), `--text-file=${tmp}`, `--output-file=${path.join(OUT, out)}`, '--layout-features=*', '--no-hinting']);
  fs.unlinkSync(tmp); return fs.statSync(path.join(OUT, out)).size;
};
const report = [];
report.push(['ZCOOLKuaiLe-400.ttf', sub('ZCOOLKuaiLe-400.ttf', latin + [...cjk].join(''), 'ZCOOLKuaiLe-400.ttf')]);
for (const f of ['GochiHand-400.ttf', 'PatrickHand-400.ttf', 'Nunito-400.ttf', 'Nunito-700.ttf', 'Nunito-800.ttf']) report.push([f, sub(f, latin, f)]);
console.log('中文字符', cjk.size, report.map(([f, n]) => `${f} ${(n / 1024).toFixed(0)}KB`).join(', '));
