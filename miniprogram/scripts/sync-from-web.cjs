/* 网页版更新后，一条命令把小程序的数据、地图和字体同步过来：
     cd web-live && python3 -m http.server 8769     （另开一个终端）
     cd miniprogram && NODE_PATH=$(npm root -g) node scripts/sync-from-web.cjs */
'use strict';
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
fs.copyFileSync(path.resolve(ROOT, '..', 'web-live', 'home-tools.js'), path.join(ROOT, 'utils', 'home-tools.js'));
for (const s of ['export-scene.cjs', 'export-data.cjs', 'export-handoff.cjs', 'export-addons.cjs', 'build-fonts.cjs']) execFileSync('node', [path.join(__dirname, s)], { stdio: 'inherit', env: process.env });
