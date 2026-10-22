/* 测试用：把小程序连接的服务器地址换成这台电脑的局域网 IP（手机真机预览连不上 localhost），也可以顺便填 AppID。
   用法（在仓库根目录）：
     node miniprogram/scripts/set-server.cjs                      自动找本机局域网 IP，端口 8765
     node miniprogram/scripts/set-server.cjs http://192.168.1.20:8765
     node miniprogram/scripts/set-server.cjs --appid wx1234567890abcdef
     node miniprogram/scripts/set-server.cjs --local              改回 http://localhost:8765（只用开发者工具模拟器时） */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.resolve(__dirname, '..'), args = process.argv.slice(2);
const flag = n => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : null; };
const appid = flag('--appid'), local = args.includes('--local');
let base = args.find(a => /^https?:\/\//.test(a));
if (!base) {
  if (local) base = 'http://localhost:8765';
  else {
    const ips = Object.values(os.networkInterfaces()).flat().filter(n => n && n.family === 'IPv4' && !n.internal).map(n => n.address);
    const lan = ips.find(ip => /^(192\.168|10\.|172\.(1[6-9]|2\d|3[01]))\./.test(ip)) || ips[0];
    if (!lan) { console.error('没找到局域网 IP，请手动写：node miniprogram/scripts/set-server.cjs http://你的IP:8765'); process.exit(1); }
    base = `http://${lan}:${process.env.PORT || 8765}`;
  }
}
base = base.replace(/\/$/, '');
const cfgPath = path.join(ROOT, 'config.js');
let cfg = fs.readFileSync(cfgPath, 'utf8');
cfg = cfg.replace(/API_BASE: '[^']*'/, `API_BASE: '${base}'`).replace(/FONT_BASE: '[^']*'/, `FONT_BASE: '${base}/fonts/'`);
fs.writeFileSync(cfgPath, cfg);
console.log('小程序服务器地址 →', base);
if (appid) {
  const pPath = path.join(ROOT, 'project.config.json'), p = JSON.parse(fs.readFileSync(pPath, 'utf8'));
  p.appid = appid; fs.writeFileSync(pPath, JSON.stringify(p, null, 2) + '\n');
  console.log('AppID →', appid);
}
console.log('在微信开发者工具里点「编译」即可生效。');
