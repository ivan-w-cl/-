/* 抓一份带读取时间的真实快照，给没有服务器的静态 demo 用：
     node scripts/snapshot-local.cjs [输出目录，默认 ../../web-live/local-snapshots] [公寓编号…]
   需要能访问 data.police.uk、api.ratings.food.gov.uk 和 overpass-api.de。只写成功读到的数据；读不到的楼不写文件（网页上显示「未接通」），不会写 0。 */
'use strict';
const path = require('path'), fs = require('fs'), os = require('os');
const { createLocalData } = require('../lib/local-data');
const out = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', '..', 'web-live', 'local-snapshots'));
const only = process.argv.slice(3);
(async () => {
  const L = createLocalData({ dataDir: fs.mkdtempSync(path.join(os.tmpdir(), 'lsm-snap-')) });
  const homes = L.homes.filter(h => !only.length || only.includes(h.id));
  let ok = 0, bad = 0;
  for (const kind of ['police', 'food', 'neighbourhood', 'amenities', 'building']) fs.mkdirSync(path.join(out, kind), { recursive: true });
  for (const h of homes) {
    const p = await L.police(h);
    if (p.status === 'ok') { fs.writeFileSync(path.join(out, 'police', h.id + '.json'), JSON.stringify(p, null, 1)); ok++; } else { console.log('police 未读到', h.id, p.error || p.status); bad++; }
    for (const kind of ['neighbourhood', 'amenities', 'building']) {
      const r = await L[kind](h);
      if (r.status === 'ok' || r.status === 'partial') { fs.writeFileSync(path.join(out, kind, h.id + '.json'), JSON.stringify(r, null, 1)); ok++; } else { console.log(kind, '未读到', h.id, r.error || r.status); bad++; }
    }
    const first = await L.food(h, { pageSize: 50 });
    if (first.status === 'ok' || first.status === 'partial') {
      let items = first.items;
      for (let pg = 2; pg <= first.pages; pg++) items = items.concat((await L.food(h, { pageSize: 50, page: pg })).items);
      const { page, pages, pageSize, total, ...rest } = first;
      fs.writeFileSync(path.join(out, 'food', h.id + '.json'), JSON.stringify({ ...rest, items }, null, 1)); ok++;
    } else { console.log('food 未读到', h.id, first.error || first.status); bad++; }
  }
  await L.flush();
  console.log(`写入 ${ok} 个快照，${bad} 个未读到 → ${out}`);
})();
