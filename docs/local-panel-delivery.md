# 周边与评价 · Web Demo 交付说明 / Area & Reviews · Web Demo Delivery

2026-10-28 · 按团队《Web Demo 需求》实现 / built to the team's Web Demo spec

## 中文

### 1. 怎么打开

| 方式 | 命令 / 地址 | 周边治安和餐饮的数据 |
| --- | --- | --- |
| 完整运行（推荐） | 仓库根目录：`SITE_DIR=web-live node web-original/consult-server/server.js`，打开 `http://localhost:8765/` | 服务器实时读取 data.police.uk 和 FSA，缓存 24 小时。服务器必须能访问这两个网站 |
| 只放静态文件 | `cd web-live && python3 -m http.server`，打开 `http://localhost:8000/` | 读 `web-live/local-snapshots/` 里的真实快照；没有快照时显示「数据源尚未接通」 |
| 状态演示 | 任一地址后面加 `?demo=1` | 面板底部有「状态演示」，可以逐个看读取中、后台更新、零结果、失败、旧数据、部分结果、未接通 |
| 演示审核台 | `/reviews-admin.html` | 和网页共用这台浏览器里的演示评价 |
| 转发到团队接口 | 启动服务器时加 `LOCAL_UPSTREAM=https://home.gxernv.cn` | 转发到 `/api/safety`、`/api/food` |

入口：点开任意公寓 → 「展开详情」→「周边与评价」四个按钮；收起的卡片上有「📍 周边与评价」。

### 2. 数据清单（实时 / 缓存 / 模拟）

| 内容 | 类型 | 说明 |
| --- | --- | --- |
| 周边治安 | 实时 + 缓存 | data.police.uk 最新月份，公寓参考坐标周围 1 英里。服务器缓存 24 小时，过期先显示旧数据并后台更新。OGL v3 |
| 周边餐饮 | 实时 + 缓存 | FSA 食品卫生评级 API（餐厅/咖啡馆、外卖、酒吧），1 英里内，直线距离。OGL v3 |
| 静态快照 | 带日期的真实快照 | `node web-original/consult-server/scripts/snapshot-local.cjs` 生成，每个文件带读取时间。**目前还没有快照**（见第 4 节） |
| 中餐名单 | 人工核实 | `lib/chinese-food.json`，FSA 编号和邮编都对上才标。**目前是空的** |
| 公寓坐标和参考邮编 | 固定数据 | 47 栋楼的稳定编号（`lib/homes-geo.json`）。4 处多栋房屋用街区参考，只写邮编区（如 L7） |
| 住户评价、团队探访、资料解读 | 模拟 | 只在虚构的「演示公寓 Demo Court」上，标「演示内容」，不计入真实统计；存在这台浏览器里（`lsm-reviews-demo-v1`），不写任何生产评价库 |
| 身份和核实 | 模拟 | 演示用户和演示审核员；不收集证件、合同或地址。审核台没有密码，正式版的审核员登录放在服务器上 |
| Amber / StudentCrowd | 只有链接 | 「在其他网站查看（不计入本站评分）」，不转载摘录 |

真实公寓的「住户评价」显示「暂无评分」，「团队探访与资料解读」显示空状态，因为现在还没有真实的已发布评价和真实探访。

### 3. 验收 A1–A8

截图里的治安和餐饮数字是**测试数据**（店名是 “Fixture venue”），用来检查排版和规则，不是真实记录。

| 编号 | 结果 | 怎么验证的 |
| --- | --- | --- |
| A1 换公寓一致，迟到的响应不覆盖 | ✅ 通过 | 公寓 A 的响应故意延迟 1.5 秒（总数 999），中途换到 B：面板显示 B 的名称和 B 的总数 120。每次请求带编号并可取消；地图上换公寓时面板自动换 |
| A2 关闭保留状态，地图手势不变慢 | ✅ 通过 | 关闭前后地图位置、语言、收藏数相同；面板打开时地图仍可拖动。数据只在打开某一页时读取，拖地图不发请求。电脑上公寓卡片被侧栏挡住时会挪到侧栏左边，关闭后放回 |
| A3 治安月份、范围、合计和占比一致，没有安全分 | ✅ 通过 | 6 类合计 120 = 总数；占比按总数算；首屏是月份、总数、范围示意和最多的三类；范围示意只有圆圈和中心点，没有案件点；没有任何评分或排名 |
| A4 卫生 0 分保留、未评级不是 0、中餐覆盖说明 | ✅ 通过 | 0 分显示为红色「0」；等待检查 / 等待公布 / 豁免单独显示「—」加状态；中餐页说明名单不完整、没有标签不代表不是中餐 |
| A5 成功、零、失败、旧数据、部分、更新中可演示 | ✅ 通过 | `?demo=1` 的状态演示逐个截图；真实服务器读不到时显示「这次没读到数据（fetch failed）。没有数据不代表 0。」和重试 |
| A6 昵称、核实状态、团队身份区分；评分排除正确 | ✅ 通过 | 住户卡片：昵称 + 「入住信息已核实 / 未核实」；团队卡片：成员 + 所属身份 + 「不计入住户评分」。评分只用已发布的住户评价：演示公寓 4 条评价中 3 条已发布、1 条待审核，评分基于 3 条；某一项没评不算进那一项 |
| A7 提交、待审核、发布、举报、撤回，不写生产 | ✅ 通过 | 3 步提交 → 未勾选条款时拦下 → 提交后「待审核」→ 审核台不写原因不能处理 → 写原因发布后网页显示 4 条；举报后显示「已收到」，不记录举报人；撤回、修改重交可用。全部只写浏览器本地 |
| A8 中英文、手机和电脑、搜索、分页、关闭、重试 | ✅ 通过 | 360 / 390 / 440 / 1280 截图，中英文各一套；搜索 “dragon” 得 1 家；27 家分 2 页；返回地图 / × / Esc 关闭；重试按钮可用 |

自动测试：`cd web-original/consult-server && npm test`（含 `test/local-data.cjs`：合计和占比、缓存、街区参考、失败不是 0、零结果、旧数据和后台更新、FSA 1 英里 / 排序 / 去重、0 分保留、未评级状态、中餐匹配、搜索、分页、部分结果、未接通、只接受已知公寓），全部通过。

### 4. 还没接通的

1. **data.police.uk 和 api.ratings.food.gov.uk**：开发环境的网络不允许访问，所以现在没有真实快照，静态 demo 显示「数据源尚未接通」。部署到能上网的服务器后会直接读取；或在能上网的电脑上运行一次 `node web-original/consult-server/scripts/snapshot-local.cjs` 生成快照。
2. **home.gxernv.cn**：同样访问不到，没有核对 `/api/safety`、`/api/food` 的返回格式。我们的字段按需求文档写，如果团队接口字段名不同，需要在 `lib/local-data.js` 的转发部分对一下。
3. **中餐名单**：需要人工核实餐厅官网或官方商户页面后填进 `lib/chinese-food.json`。
4. **真实评价库和审核员登录**：演示版只在浏览器本地。正式版需要服务器端存储、审核员账号、核实流程（只收必要证据，核实后删除原件）。
5. **趋势图**：需求要求有真实多个月数据才显示，目前没有，所以不显示。

### 5. 改动的文件

| 文件 | 改动 |
| --- | --- |
| `web-live/local-panel.js` / `.css` | 新增：周边与评价面板（入口、侧栏 / 全屏、治安、餐饮、各种状态、状态演示） |
| `web-live/reviews-store.js` · `resident-reviews.js` · `reviews-admin.html` | 新增：本站住户评价、团队探访与资料解读、演示审核台 |
| `web-live/reviews.js` | 有新面板时只提供 Amber / StudentCrowd 直达链接，不再显示旧评价弹窗和排版示例 |
| `web-live/booking-tools.js` | 没有开场页入口的工具不放在开场页 |
| `web-live/index.html` · `sw.js` | 加载新文件；快照先走网络 |
| `web-original/consult-server/lib/local-data.js` · `homes-geo.json` · `chinese-food.json` | 新增：周边数据接口、缓存、47 栋楼坐标、中餐名单 |
| `web-original/consult-server/server.js` · `package.json` · `test/local-data.cjs` · `scripts/snapshot-local.cjs` | 接口路由、测试、快照脚本 |
| 两个 `README.md` | 功能说明 |

价格、咨询、通勤、一年总花费、按预算看房的逻辑没有改。新增文字只有中文和英文。

## English

### 1. How to open it

| Mode | Command / URL | Police and food data |
| --- | --- | --- |
| Full (recommended) | From the repo root: `SITE_DIR=web-live node web-original/consult-server/server.js`, then open `http://localhost:8765/` | The server reads data.police.uk and the FSA live and caches for 24 hours. It must be able to reach both sites |
| Static files only | `cd web-live && python3 -m http.server`, then open `http://localhost:8000/` | Reads dated real snapshots in `web-live/local-snapshots/`; without them, shows "not connected" |
| State demo | Add `?demo=1` to either URL | A "State demo" bar at the bottom of the panel shows loading, refreshing, zero, failure, stale, partial and not connected |
| Demo moderation | `/reviews-admin.html` | Shares the demo reviews stored in this browser |
| Team endpoints | Start the server with `LOCAL_UPSTREAM=https://home.gxernv.cn` | Forwards to `/api/safety` and `/api/food` |

Entry: open any home → "Details" → the four "Area & reviews" buttons; the collapsed card has "📍 Area & reviews".

### 2. Data inventory (live / cached / simulated)

| Content | Type | Notes |
| --- | --- | --- |
| Local police records | Live + cached | data.police.uk latest month, 1 mile around the property reference point. Cached 24 hours on the server; when expired, old data is shown while it refreshes. OGL v3 |
| Nearby food | Live + cached | FSA food hygiene rating API (restaurants/cafés, takeaways, pubs), within 1 mile, straight-line distance. OGL v3 |
| Static snapshots | Dated real snapshots | Made with `node web-original/consult-server/scripts/snapshot-local.cjs`; each file records when it was retrieved. **None yet** (see section 4) |
| Chinese list | Checked by hand | `lib/chinese-food.json`; tagged only when FSA ID and postcode both match. **Empty for now** |
| Coordinates and reference postcodes | Fixed | The 47 stable IDs (`lib/homes-geo.json`). Four multi-house listings use a street-area reference with only the district (e.g. L7) |
| Resident reviews, team visits, insights | Simulated | Only on the fictional "Demo Court" property, labelled "Demo content" and excluded from real figures; stored in this browser (`lsm-reviews-demo-v1`), never in a production review store |
| Identity and verification | Simulated | A demo user and a demo moderator; no IDs, contracts or addresses collected. The moderation page has no password; production moderator sign-in lives on the server |
| Amber / StudentCrowd | Links only | "View on other sites (not counted in ratings here)"; no excerpts |

Real properties show "No rating yet" for resident reviews and an empty state for team visits and insights, because there are no real published reviews or visits yet.

### 3. Acceptance A1–A8

The police and food figures in the screenshots are **test data** (venues are named "Fixture venue"), used to check layout and rules. They are not real records.

| ID | Result | How it was checked |
| --- | --- | --- |
| A1 Property switching matches; late responses do not overwrite | ✅ Pass | Property A's response was delayed 1.5 s (total 999) and the user switched to B: the panel showed B's name and B's total of 120. Each request is numbered and can be cancelled; switching homes on the map rebinds the panel |
| A2 Closing keeps state; map gestures are not slowed | ✅ Pass | Map position, language and favourites were the same before and after closing; the map can still be dragged with the panel open. Data loads only when a tab opens, never on map drags. On desktop the home card moves left of the sidebar if covered and returns on close |
| A3 Police month, radius, sums and shares agree; no safety score | ✅ Pass | Six categories sum to 120 = total; shares use the total; first screen shows month, total, area illustration and top three; the illustration is only a circle and centre point, with no incident dots; no score or ranking |
| A4 Hygiene 0 kept; unrated is not 0; Chinese coverage explained | ✅ Pass | A 0 rating shows as a red "0"; awaiting inspection, awaiting publication and exempt show "—" with their status; the Chinese tab says the list is incomplete and a missing tag does not mean a venue is not Chinese |
| A5 Success, zero, failure, stale, partial and refresh each demonstrable | ✅ Pass | Each `?demo=1` state is screenshotted; when the real server cannot reach the source it shows "Could not load the data (fetch failed). Missing data is not zero." with Retry |
| A6 Alias, verification and team identity distinct; score exclusions correct | ✅ Pass | Resident cards: alias plus "Tenancy verified / not verified"; team cards: member, affiliation and "Not counted in resident ratings". Ratings use published resident reviews only: of 4 demo reviews, 3 are published and 1 is pending, so the rating is based on 3; a skipped score is left out of that score |
| A7 Submit, pending, publish, report, withdraw without production writes | ✅ Pass | Three-step submission → blocked until terms are accepted → "Pending" → the moderation page refuses actions without a reason → after publishing with a reason, the site shows 4; reporting shows a confirmation and stores no reporter; withdraw and edit-and-resubmit work. Everything stays in the browser |
| A8 zh/en, mobile and desktop, search, paging, closing, retry | ✅ Pass | Screenshots at 360 / 390 / 440 / 1280 in Chinese and English; searching "dragon" finds 1; 27 venues over 2 pages; Back to map, × and Esc close; Retry works |

Automated tests: `cd web-original/consult-server && npm test` (includes `test/local-data.cjs`), all passing.

### 4. Not connected yet

1. **data.police.uk and api.ratings.food.gov.uk**: the development environment's network blocks them, so there are no real snapshots yet and the static demo shows "not connected". A server with internet access reads them directly; alternatively run `node web-original/consult-server/scripts/snapshot-local.cjs` once on a connected machine.
2. **home.gxernv.cn**: also unreachable, so the `/api/safety` and `/api/food` response formats were not checked. Our fields follow the spec; if the team's names differ, adjust the forwarding code in `lib/local-data.js`.
3. **Chinese list**: needs hand-checking against restaurant or official venue websites, then entries in `lib/chinese-food.json`.
4. **Real review store and moderator sign-in**: the demo stays in the browser. Production needs server storage, moderator accounts and a verification process (only necessary evidence, originals deleted after checking).
5. **Trend chart**: the spec allows it only with real multi-month data, which does not exist yet, so it is not shown.

### 5. Changed files

See the table in the Chinese section. Price, consultation, commute, yearly cost and budget search logic is unchanged. New copy is in Chinese and English only.

## 2026-10-29 更新：安全与支持、周边配套、Google 地图评价 / Update: Safety & support, Nearby amenities, Google Maps reviews

### 中文

团队反馈：警方的犯罪记录让每栋公寓看起来都有问题。这次改成先展示"有人在管、出事找谁"，再给配套信息；原始记录仍然保留，但收起来。

| 页面 | 改动 | 数据来源（都不需要授权，注明出处即可） |
| --- | --- | --- |
| 安全与支持（原「周边治安」） | 首屏：社区警务团队（成员、联系方式、警队公布的工作重点、社区活动）+ 求助渠道（999 / 101、Liverpool Student Homes 免费合同检查和纠纷帮助、入住前可以问公寓的 3 个问题）。警方原始记录收起来，点开才读取，只写月份、总数和各类条数，**不再显示占比**，并说明市中心人流大、记录通常更多 | data.police.uk 社区接口和街头记录（OGL v3）；LSH 介绍来自利物浦大学官网 |
| 周边配套（新增） | 直线 800 米（步行约 10 分钟）内的超市和便利店、药店、诊所、公交站、火车站、健身房、公园、图书馆、银行和取款机、邮局：数量、最近一家和距离，可以展开看最近 5 个 | OpenStreetMap（ODbL，署名 © OpenStreetMap contributors） |
| 住户评价 | 新增「Google 地图上的评价（不计入本站评分）」：填了 `web-live/site-config.js` 的嵌入密钥就显示 Google 地图官方嵌入框，没填就给 Google 地图链接。不抓取、不转载评价 | Google Maps Embed API（官方写明免费、不限次数，需要 API 密钥） |

接口：`/api/local/neighbourhood`、`/api/local/amenities`（见 consult-server README）。快照脚本也会抓这两项。`npm test` 全部通过。截图里的团队、工作重点和配套名称是测试数据（带 "Test" 字样）。

还没接通：开发环境访问不了 data.police.uk 和 overpass-api.de，所以真实数据要等部署到能上网的服务器，或者网络放开后抓快照。Google 地图嵌入需要团队在 Google Cloud 申请密钥，并限制为只能用于 Maps Embed API 和本站域名。人口普查的"学生比例"这次没做：需要先核对 ONS 的数据表编号，没法联网核对。

### English

Team feedback: police crime records made every property look risky. The panel now leads with who looks after the area and where to get help, followed by amenities; the raw records are still available but collapsed.

| Page | Change | Data source (no permission needed; attribution required) |
| --- | --- | --- |
| Safety & support (was "Local police records") | First screen: the neighbourhood police team (members, contact, the force's published priorities, community events) and where to get help (999 / 101, Liverpool Student Homes' free contract checks and dispute advice, three questions to ask the property). Raw police records are collapsed and load only when opened, showing the month, total and count per category, **with no percentages**, and noting that busy city-centre areas usually have more records | data.police.uk neighbourhood and street-level APIs (OGL v3); the LSH description comes from the University of Liverpool website |
| Nearby amenities (new) | Within 800 m straight-line (about a 10-minute walk): supermarkets and convenience shops, pharmacies, GP surgeries and clinics, bus stops, train stations, gyms, parks, libraries, banks and cash machines, post offices. Each shows the count, the nearest one with its distance, and up to five nearest on expand | OpenStreetMap (ODbL, attribution © OpenStreetMap contributors) |
| Resident reviews | New "Reviews on Google Maps (not counted in ratings here)": with an embed key in `web-live/site-config.js` it shows Google's official map embed; without one it links to Google Maps. Reviews are never scraped or copied | Google Maps Embed API (free with no usage limit according to Google; needs an API key) |

Endpoints: `/api/local/neighbourhood` and `/api/local/amenities` (see the consult-server README); the snapshot script captures both. `npm test` passes. Team members, priorities and amenity names in the screenshots are test data (marked "Test").

Not connected yet: the development environment cannot reach data.police.uk or overpass-api.de, so real data needs a connected server or snapshots once the network allows it. The Google embed needs the team to create a key in Google Cloud, restricted to the Maps Embed API and this site's domain. The census "student share" was not built this time: the ONS table IDs need checking online first.

## 2026-10-30 更新：警方公开记录的亮点和图表 / Update: highlights and charts for police records

### 中文

「安全与支持」页里的警方公开记录改成先讲数据里积极的一面，再给完整数字：

- **亮点（只在数据支持时出现）**：
  - 最新月份比前几个月平均少 5% 以上 →「比前 5 个月平均少 x%」；相差不到 5% →「和前 5 个月平均差不多」；比平均多时不显示这一条（走势图照常显示）。
  - 已有处理结果 →「x 条已有处理结果」（起诉、警告、罚款等），取走势里最早的月份，因为处理结果要几个月才更新。
  - 反社会行为 →「x 条是反社会行为」，如噪音、扰民，和刑事犯罪分开统计。
- **三张图**：近 6 个月走势（柱状图，最新月份深色并标数，悬停或点按看每个月）、当月刑事犯罪和反社会行为构成、刑事记录的处理情况（已处理 / 调查中 / 调查结束未找到嫌疑人 / 其他）。
- **各类别条数**收起，点「查看各类别条数」展开。不再显示类别占比。
- 说明照旧：位置匿名化、不代表发生在公寓内、市中心记录通常更多、本站不打安全分也不排名。

这些都是 data.police.uk 的真实字段算出来的，不编造、不挑月份；颜色按数据可视化规则选定并通过色盲校验。截图里的数字是测试数据。

### English

Police records on the Safety & support page now lead with what the data shows on the positive side, followed by the full figures:

- **Highlights (shown only when the data supports them):**
  - Latest month at least 5% below the previous months' average → "x% below the previous 5-month average"; within 5% → "About the same as the previous 5-month average"; above the average → no highlight (the trend chart still shows it).
  - Outcomes → "x with an outcome" (charged, cautioned, fined, etc.), taken from the oldest month in the trend because outcomes take months to update.
  - Anti-social behaviour → "x were anti-social behaviour", such as noise and nuisance, counted separately from crime.
- **Three charts:** records over the last 6 months (columns, latest month dark and labelled, hover or tap for each month), crime vs anti-social behaviour that month, and outcomes of crimes (dealt with / under investigation / no suspect identified / other).
- **Counts by category** are collapsed behind "Show counts by category". Category percentages are no longer shown.
- The notes stay: locations are anonymised, records are not necessarily inside the property, city-centre areas usually have more records, and this site does not score or rank properties.

Everything is calculated from real data.police.uk fields, with no invented figures and no cherry-picked months; the colours follow the data-visualisation rules and pass a colour-blindness check. Figures in the screenshots are test data.
