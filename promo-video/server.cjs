/* 视频用的静态服务器：/web → web-live，/stage → 舞台页，/font → Noto Sans SC，同源方便舞台控制 iframe 里的网页 */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOTS = { web: path.resolve(__dirname, '..', 'web-live'), stage: __dirname + '/stage', font: __dirname + '/fonts/noto-sans-sc', wf: __dirname + '/fonts' };
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.webmanifest': 'application/manifest+json' };
http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]), m = u.match(/^\/(web|stage|font|wf)(\/.*)?$/);
  if (!m) { res.writeHead(404); return res.end(); }
  if (u === '/web/fonts-google.css') { res.writeHead(200, { 'Content-Type': 'text/css' }); return res.end(fs.readFileSync(__dirname + '/web-fonts.css')); }   // 谷歌字体换成本地同款
  let f = path.join(ROOTS[m[1]], path.normalize(m[2] || '/'));
  if (!f.startsWith(ROOTS[m[1]])) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b); });
}).listen(+process.env.PORT || 8780, () => console.log('video server :' + (process.env.PORT || 8780)));
