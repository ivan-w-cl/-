# Liverpool Student Map · Web Demo

给投资人演示、团队内部讨论用的完整流程原型：学生在 App 里看房、简单沟通，点「我要建群咨询」后，顾问在后台收到提醒，人工建群，再把群二维码发进对话框，学生扫码进入专属预定专家团队群。

纯前端，没有服务器，不用安装任何依赖。

## 打开方式

- 直接用浏览器打开 `web-demo/index.html`（双击即可）；或者
- 在仓库根目录运行 `python3 -m http.server`，然后访问 `http://localhost:8000/web-demo/`。

顶部可以切换三种视图：

| 视图 | 用途 |
|---|---|
| 并排演示 | 左边学生手机 App，右边顾问后台。适合给投资人现场演示整个闭环 |
| 学生 App | 只看手机端；手机浏览器打开时默认就是这个视图 |
| 顾问后台 | 只看后台（会话 + 数据看板） |

也可以在同一台电脑上开两个标签页，一个停在 `#student`，一个停在 `#admin`，两边会实时同步。数据都保存在浏览器本地，点「重置演示数据」恢复初始状态。

## 推荐演示路线（约 3 分钟）

1. 学生端首页：手绘地图 + 47 套公寓，按预算、房型、步行时间筛选。
2. 点 **1 号 iQ Great Newton House**：看房型卡片，点「Gold En Suite」打开相册（卧室 / 浴室 / 共用厨房分组）。
3. 相册底部点「咨询这个房型」：对话框里自动带上房型卡片，顾问不用再问一遍。随便发一句话。
4. 点「我要建群咨询」，填称呼、入学时间、学校、预算，选 WhatsApp（新加坡）或微信（中国），提交。
5. 右边后台：铃铛响、顶部出现「新的建群请求」，会话排到最前。右栏能看到这个学生看过的房、收藏、测试结果和建群请求。
6. 点「建群并发送 QR」：选专家团队、群类型，粘贴群邀请链接（演示已预填），发送。
7. 左边学生端马上收到群二维码卡片。后台在学生进群后点「标记已进群」「标记已预定」。
8. 后台切到「数据看板」：获客漏斗、按地区（新加坡 / 中国 / 日本）、按来源渠道。

另外可以演示两个测试：生活测试（6 道情景题 → 15 种生活角色）和找房测试（8 道题），结果卡给出 Top 3、推荐理由和需要取舍的地方，可以在地图上高亮或三套对比。

## 数据从哪来

| 内容 | 来源 |
|---|---|
| 47 套公寓、历史参考价、评分、步行时间、周边设施 | 小程序 `miniprogram/utils/data/homes.js`（网页版提取，Amber 2026-10-17 核对） |
| 找房测试、生活测试的题目、文案和打分 | 小程序 `miniprogram/utils/`，原样打包进 `js/vendor/core.js`，结果与小程序一致 |
| 1 号公寓的 3 个房型、14 张照片、价格档期 | AmberStudent，2026-10-21 采集（设计稿 `design/room-photos/`） |
| 其他 46 套公寓的房型 | 按历史参考价生成「独卫单间 / Studio」，照片显示「照片整理中」 |
| 后台会话、专家团队、看板数字 | **虚构的演示数据**，页面上已标明 |
| 手绘地图 | 网页原版 `web-original/liverpool-life-map-en` 渲染出的底图、地标插画和公寓位置（游客地图变形投影 + 防重叠排布），由 `scripts/build-basemap.cjs` 导出到 `js/vendor/basemap.js`。Map data © OpenStreetMap contributors |

演示里的二维码是假的群链接，扫码不会进入真实群。

## 目录

```
index.html          入口（演示外框）
css/app.css         纸张手绘风格样式
js/vendor/core.js   【自动生成】小程序的数据与打分逻辑
js/vendor/qrcode.js qrcode-generator 1.4.4（MIT）
js/data.js          房型照片、地图地理、专家团队、文案、模拟会话
js/store.js         学生端与后台共用的状态（localStorage，跨标签页同步）
js/vendor/basemap.js 【自动生成】原版手绘底图
js/map.js           地图交互（拖动、缩放、公寓标记）
js/student.js       学生端 App
js/admin.js         顾问后台与数据看板
js/ui.js main.js    共用工具、视图切换
scripts/build-core.cjs     小程序数据更新后重新生成 core.js
scripts/build-basemap.cjs  原版地图更新后重新导出 basemap.js（需要 Playwright）
```

源数据更新后运行：

```bash
node web-demo/scripts/build-core.cjs      # 小程序 utils/ 有改动时
node web-demo/scripts/build-basemap.cjs   # 原版 index.html 的地图有改动时
```

## 还没做 / 下一步

- **更多房源照片**：当前环境的网络策略不允许访问 amberstudent.com，所以只有 1 号公寓有照片。放行这个域名后，可以批量抓取其余公寓的房型和照片，填进 `js/data.js` 的 `ROOMS`。
- **真实后端**：会话、提醒、二维码目前都只在浏览器本地。正式版可以在 `web-original/consult-server` 的基础上扩展：它已有网页聊天、小程序客服渠道和顾问工作台，需要加上「建群请求」和「发送群二维码」两种消息。
- **AI 回复**：后台「AI 建议回复」现在是按上下文拼出的占位文案，以后接入模型。
- **进群状态**：WhatsApp 和微信都不会通知谁扫码进群，目前由顾问手动标记；QR 发出 24 小时未进群会提示跟进。
- **日语版**：文案已集中在 `js/data.js` 和小程序 `i18n.js`，以后加一份 `ja` 即可。
