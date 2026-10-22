# 利物浦学生生活地图 · 微信小程序版

网页版 `ui-project/liverpool-life-map-en/` 的原生微信小程序移植。界面以中文为主，首页右上角可切换 EN。
无 npm 依赖，无需地图 API Key。

## 一、在微信开发者工具中打开

1. 安装「微信开发者工具」（稳定版），选择 **导入项目**，目录选本文件夹 `miniprogram/`（含 `project.config.json` 的那一层）。
2. AppID：`project.config.json` 里的 `"appid": "touristappid"` 是 **占位符（游客模式）**。
   - 游客模式可在模拟器里浏览全部页面、地图和测验；
   - **不能** 真机预览、上传，也 **不能** 使用客服会话（`open-type="contact"`）。
   - 正式使用：在导入时填写你的小程序 AppID，或把 `project.config.json` 中的 `touristappid` 改为你的 AppID（`wx` 开头）。
3. 本地设置建议：基础库 ≥ 2.20（项目默认 3.0.0）；保持「将 JS 编译成 ES5」与「增强编译」勾选（代码使用了 `?.`、`??`、展开语法）。
4. 点「编译」即可。首页是地图 + 公寓列表 + 筛选。

## 二、目录结构

```
app.js / app.json / app.wxss     全局状态（本机存储）、页面路由、纸张风格样式
project.config.json               项目配置（appid 占位符）
sitemap.json
images/                           地图 marker 图标（普通 / Top3 / 校区）
pages/
  index/        地图（原生 <map>）+ 公寓列表 + 搜索/预算/房型/步行/收藏筛选；测验后 Top3 珊瑚色高亮并自动缩放到这三套
  quiz-life/    生活测试：6 道情景题 + 校区、步行两步补充；进度点、选项卡片、单选自动进入下一题
  quiz-home/    找房测试：8 题；单选自动前进，多选（口味、周末）手动“下一题”，“都可以”会清除其他选项
  result/       结果卡（人物画像 / 生活角色）+ Top3 推荐理由与取舍 + 「对比这三套」「在地图上看」「咨询顾问」
  compare/      三套横向对比表（价格、评分、步行、周边设施）
  home-detail/  公寓详情：小地图、中文简介、历史参考价、步行时间、周边设施、收藏、加入对比、导航
  consult/      咨询页：显示本次附带的房源与测试摘要，<button open-type="contact" session-from=JSON> 进入官方客服会话
utils/
  home-match-core.js   【自动生成】原样截取网页版 home-match.js 的题目、文案、权重、打分、画像
  life-model.js        【自动生成】原样复制网页版 life-c-model.js（改为 CommonJS 导出）
  home-tools.js        【自动生成】原样复制网页版 home-tools.js（筛选、固定编号）
  data/homes.js        【自动生成】47 套房源 + 预计算的周边设施距离/数量
  home-match.js        找房匹配 API（match / questions / byId …）
  life-quiz.js         生活测试 API（questions / run）
  compare.js view.js consult.js i18n.js   展示整形、session-from 生成、中英文案
scripts/
  extract-data.cjs     从网页版重新生成上面 4 个自动生成文件
  web-harness.cjs      在 Node 中加载网页版（不需要浏览器），供提取与测试共用
tests/run-all.cjs      Node 测试
```

## 三、数据与逻辑如何与网页版保持一致

- 网页版更新房源、价格或打分后，运行：
  ```bash
  node scripts/extract-data.cjs           # 默认读取 ../ui-project/liverpool-life-map-en
  WEB_DIR=/path/to/liverpool-life-map-en node scripts/extract-data.cjs
  node tests/run-all.cjs                  # 对照网页版验证 Top3
  ```
- 周边设施（约 1,800 条 OSM 记录）在提取时一次算好，小程序端只带结果（homes.js 约 76KB），不再携带原始 POI。
- 说明：需求里提到的 `life-home-model.js` 在网页版目录中并不存在；生活测试 → 找房的换算在 `life-c-model.js` 的 `toMapAnswers` 里，已原样使用。

## 四、地图

- 首页使用原生 `<map>`（腾讯地图底图），marker = 47 套公寓的经纬度，callout 显示固定编号（与网页版相同）；三个主要校区单独标注。
- 测验后 Top3 marker 变为珊瑚色、callout 显示「★名次 · 编号 名称」，并用 `include-points` 自动缩放；「Top 3」按钮可只显示这三套。
- 基础 `<map>` 不需要 Key。若以后要用个性化地图样式（`layer-style`）或路线规划，需要在腾讯位置服务申请 Key 并在小程序后台绑定。
- **后续可选：手绘地图**。网页版的手绘 SVG 地图（`index.html` 中 `GEO` + 扭曲投影）可以：
  1. 用浏览器把 SVG 导出为大图（如 1600×1800 PNG，放 CDN），在小程序中用 `<movable-area>/<movable-view>` + `<image>` 做可缩放图层，marker 位置用网页版同一套 `raw()`→`W()` 投影换算；或
  2. 用 `<canvas type="2d">` 直接绘制 `GEO` 路径（数据约 100KB，需注意包体积 2MB 限制）。
  做成首页「腾讯地图 / 手绘地图」切换即可，打分逻辑不受影响。

## 五、服务器域名

当前小程序 **不发任何网络请求**（数据全部内置；咨询走微信官方客服会话），所以不配置域名也能运行。
如果以后要从 consult-server 拉取数据或提交表单（`wx.request`）：
- 小程序后台 → 开发管理 → 开发设置 → **服务器域名** → `request 合法域名` 填 `https://你的域名`（必须 HTTPS、已备案、不能带端口以外的 IP）；
- 开发阶段可在开发者工具「详情 → 本地设置」勾选「不校验合法域名」（`project.private.config.json` 已设置 `urlCheck: false`，只影响本机）。

## 六、咨询：与 consult-server 的 miniprogram 渠道对接

流程：学生在咨询页点「进入客服会话」→ 微信打开官方客服聊天 → 微信把 `user_enter_tempsession` 事件（带 `SessionFrom`）推送到你的服务器 → consult-server 创建 `channel: "miniprogram"` 会话 → 学生发消息后工作台（`admin.html`）收到通知 → 客服在工作台选择群二维码图片点「发送给学生」→ 服务器上传临时素材并调用客服消息接口，**二维码出现在学生的客服聊天里**，长按识别进群。

1. 部署 consult-server 到 HTTPS 域名：`node consult-server/server.js`，设置 `PUBLIC_URL=https://你的域名`。
2. 小程序后台 → 开发管理 → 开发设置 → **消息推送**：
   - URL：`https://你的域名/api/wx/callback`
   - Token：自定义（与 `WX_TOKEN` 相同）
   - EncodingAESKey：随机生成（与 `WX_ENCODING_AES_KEY` 相同），加密方式建议「安全模式」，数据格式 **JSON**。
3. 环境变量后重启服务（保存「消息推送」时微信会 GET 校验，服务会自动回 `echostr`）：
   ```bash
   WX_APPID=wx你的AppID WX_APPSECRET=你的AppSecret WX_TOKEN=你的Token WX_ENCODING_AES_KEY=43位Key \
   PUBLIC_URL=https://你的域名 ADMIN_PASSWORD=换成强密码 node consult-server/server.js
   ```
4. 开发设置 → **IP 白名单**：加入服务器出口 IP（获取 access_token 需要）。
5. `session-from` 内容（由 `utils/consult.js` 生成，≤900 字节）示例：
   ```json
   {"source":"miniprogram","lang":"zh","homeId":"chatham-lodge","quizSummary":"图书馆常客 · 居家大厨",
    "homes":[{"id":"chatham-lodge","n":17,"name":"Chatham Lodge"}],"lifeCharacter":"图书馆常客 · 居家大厨","homeMatch":"…"}
   ```
   `homes` / `lifeCharacter` / `homeMatch` 与网页版咨询上下文字段一致，工作台可直接显示；`homeId`、`quizSummary` 是小程序额外字段。
6. 规则：只能在学生最后一次发消息/进入会话后的 **48 小时** 内回复（超时错误码 45015）；群二维码 7 天过期。咨询页已向学生说明。

## 七、已完成 / 待办

已完成：
- 7 个页面全部可在模拟器中走通（游客模式）：地图、列表、筛选、收藏、两套测验、结果卡、三套对比、详情、咨询入口；中英切换。
- 打分逻辑与网页版逐字一致（自动截取），Node 测试对照网页版：4 组固定答案 + 500 组随机答案 + 生活测试全部 1728 种组合的 Top3 完全一致。
- 测验答案、上次结果、收藏、对比保存在本机（`wx.setStorageSync`），不收集个人信息。

待办 / 已知差距：
- 尚未在真实微信开发者工具 / 真机中运行（本次只做了 Node 校验），首次打开请留意控制台报错。
- 网页版「我的专业」（按专业教学楼计算步行）、「科目停靠栏」、生活测试的分享二维码图、PWA 离线功能未移植；找房测试不叠加首页筛选（网页版会叠加列表筛选）。
- 手绘地图未移植（见第四节）。
- `home-tools.js` 的搜索用到 Unicode 属性正则 `\p{L}`，iOS 11.3 以下极旧系统可能不支持。
- 客服二维码需真实 AppID + 已部署的 consult-server 才能联调；未实现订阅消息、分享卡片海报。
