# 住宿咨询原型后端（consult-server）

一条命令同时提供：**静态地图站点** + **学生咨询接口** + **客服工作台** + **通知**（日志 / 企业微信群机器人 / 邮件）+ **渠道适配层**（网页 `web` 已可用；微信小程序 `miniprogram` 已写好代码，待配置后联调）。
无任何第三方依赖，只需 Node.js 18 及以上版本。

## 一、如何运行

```bash
# 在 ui-project 目录（liverpool-life-map-en/ 与 consult-server/ 并列）
node consult-server/server.js
```

- 学生端（地图）：http://localhost:8765/
- 客服工作台：http://localhost:8765/admin.html　默认密码 **123456**
- 默认监听 `0.0.0.0:8765`，同一局域网的手机可用 `http://电脑IP:8765/` 访问。

可选环境变量：

| 变量 | 作用 | 默认 |
|---|---|---|
| `PORT` / `HOST` | 端口 / 绑定地址 | `8765` / `0.0.0.0` |
| `ADMIN_PASSWORD` | 工作台密码 | `123456`（上线前务必修改）|
| `WECOM_WEBHOOK_URL` | 企业微信群机器人 Webhook 地址；不填则只在控制台打印 | 空 |
| `NOTIFY_EMAIL_TO` | 邮件提醒的收件人（多个用逗号分隔），配合下面任一种发信方式 | 空 |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | **Google 邮箱（推荐）**：`smtp.gmail.com`、`465`、你的 Gmail / Workspace 邮箱、应用专用密码（账号需开启两步验证，在 Google 账号「安全性 → 应用专用密码」生成）。其他邮箱同理 | 空 |
| `EMAIL_API_KEY` `EMAIL_API_URL` | 或者用邮件服务的 HTTP 接口发信（默认 Resend 格式）。设置了 `SMTP_HOST` 时优先用 SMTP | 空 |
| `NOTIFY_EMAIL_FROM` | 发件人，如 `Liverpool Student Map <bookings@你的域名>`；用 Gmail 时须是该账号或其已验证的别名 | `SMTP_USER` |
| `PUBLIC_URL` | 对外访问地址，用于通知里的“打开工作台”链接，例如 `https://consult.example.com` | 按请求 Host 推断 |
| `DATA_DIR` | 会话 JSON 与上传图片的保存目录 | `consult-server/data` |
| `SITE_DIR` | 静态站点目录 | `../liverpool-life-map-en` |
| `SESSION_SECRET` | 工作台登录 Cookie 签名密钥 | 由密码派生 |
| `WX_APPID` `WX_APPSECRET` `WX_TOKEN` `WX_ENCODING_AES_KEY` | 小程序渠道（见第四节）| 空 = 不启用 |
| `WX_SUB_TEMPLATE_ID` `WX_SUB_TEMPLATE_DATA` | 新版小程序：专家发出群码时给学生推送订阅消息（需要 `WX_APPID` `WX_APPSECRET`），字段见 miniprogram/README.md | 空 = 不推送 |
| `WEATHER_URL` | `/api/weather` 代取的天气地址（默认 Open-Meteo 利物浦） | Open-Meteo |
| `WECHAT_QR_DAYS` | 微信群二维码有效天数（测试「过期 → 申请新码」时可设 `0.003`，约 4 分钟） | `7` |
| `WX_MINIPROGRAM_STATE` | 小程序码打开哪个版本：`formal`（正式版，默认）/ `trial`（体验版）/ `developer`（开发版）。`/api/wxacode` 给分享卡片生成小程序码，需要 `WX_APPID` `WX_APPSECRET`，没配时小程序自动改用普通二维码 | `formal` |

示例：
```bash
ADMIN_PASSWORD=换成你的密码 WECOM_WEBHOOK_URL='https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx' PUBLIC_URL=https://你的域名 node consult-server/server.js
```

自检：`node consult-server/test/smoke.cjs`（不访问微信服务器，用临时目录和假的 Webhook / 邮件接口）、`node consult-server/test/smtp.cjs`（假的 SMTP 服务器）。

Google 邮箱示例：
```bash
SMTP_HOST=smtp.gmail.com SMTP_PORT=465 SMTP_USER=bookings@你的域名 SMTP_PASS=应用专用密码 NOTIFY_EMAIL_TO=专家A@你的域名,专家B@你的域名 \
  PUBLIC_URL=https://你的域名 ADMIN_PASSWORD=换成你的密码 node consult-server/server.js
```

## 二（新）、配合线上版网页：咨询编号 + 群码（`/api/cases`）

线上版网页（`web-live/`）和顾问后台（`web-live/adviser.html`）用的是这一组接口。学生不注册、不留任何资料：

```bash
# 在仓库根目录
SITE_DIR=web-live ADMIN_PASSWORD=换成你的密码 node web-original/consult-server/server.js
# 学生网站 http://localhost:8765/   顾问后台 http://localhost:8765/adviser.html
```

1. 学生点 **立即进群** → `POST /api/cases`。服务器发一个 **咨询编号**（如 `LSM-7K2Q`）和只有这台设备知道的令牌，按浏览器时区和语言猜地区（新加坡 / 中国 / 香港 / 台湾 / 日本 / 英国），并发邮件或企业微信提醒：「LSM-7K2Q · SG」。
2. 专家在后台登录，看到「LSM-7K2Q · 新加坡 · 当地时间 21:05」，在 WhatsApp 或微信里**新建一个群**，然后：
   - WhatsApp：群组信息 → 通过链接邀请 → 复制链接，贴进后台（必须是 `https://chat.whatsapp.com/…`），系统自动生成二维码。
   - 微信：聊天信息 → 群二维码 → 保存图片，上传到后台（png/jpg ≤ 4MB）。微信群码 7 天后失效，学生端会显示「申请新的二维码」。
3. 学生网页每 6 秒查询一次 `GET /api/cases/:id?token=…`，群码和专家留言一到就显示；关掉网页下次打开再查（编号存在这台设备的浏览器里）。
4. 群名带编号（`LSM-7K2Q · Capital Gate`），一个编号只对应一个群：谁扫码进了这个群，谁就是这位学生。

接口：`POST /api/cases`、`GET /api/cases/:id`、`POST /api/cases/:id/homes`、`POST /api/cases/:id/renew`；后台（需登录）`GET /api/admin/cases`、`POST /api/admin/cases/:id/group | status | reply`。测试：`npm test`（`test/cases.cjs`）。

网页没连上服务器（例如只放在静态网站上）时，学生端和后台会自动退回浏览器本地演示模式。

## 二、流程（旧版小程序原型的「在线咨询」对话框）

1. 学生在房源卡片、对比表、测验结果卡上点 **咨询这处公寓**，弹出“在线咨询”对话框：显示房源、测验摘要、快捷回复（我想咨询这套房 / 帮我建群 …）、可选昵称和输入框。
2. 发送后，后端创建会话（`data/sessions.json`），返回会话 ID 和访问令牌；浏览器把它们存在 `localStorage`（`lsm-consult-v1`），关掉再打开能看到历史记录。
3. 后端发通知：控制台日志 + （若配置）企业微信群机器人 markdown 消息，包含 学生昵称 / 房源 / 测验摘要 / 原话 / 时间（北京时间）/ 工作台链接。
4. 客服打开工作台，看到待处理会话，选择群二维码图片（png/jpg，≤4MB）并可附一句说明，点 **发送给学生**，再点 **标记完成**。
5. 学生对话框每 3 秒轮询一次，显示二维码和说明：微信内提示“长按识别二维码进群”；微信外提示保存图片再用微信“扫一扫 → 相册”，并提供“保存图片”按钮。
6. 如果后端连不上（例如只部署了静态站点），对话框会友好提示“咨询服务暂时连接不上”，地图其他功能不受影响。

## 三、目录结构

```
consult-server/
  server.js              HTTP 服务：静态站点 + API + 工作台
  lib/store.js           JSON 文件会话存储（原子写入）
  lib/notifiers.js       可插拔通知：console、企业微信群机器人
  lib/auth.js            工作台密码登录（签名 Cookie，12 小时）
  channels/web.js        网页渠道（当前原型，学生端轮询）
  channels/miniprogram.js 小程序客服消息渠道（签名校验、解密、access_token、上传临时素材、发送客服消息）
  public/admin.html      客服工作台
  test/smoke.cjs         冒烟测试
  data/                  运行时数据（会话、上传的二维码），不要提交到代码仓库
```

接口一览：`GET /api/health`；学生端 `POST /api/consult/sessions`、`GET /api/consult/sessions/:id?token=`、`POST /api/consult/sessions/:id/messages?token=`、`GET /api/consult/media/:file`；工作台 `POST /api/admin/login`、`GET /api/admin/sessions`、`POST /api/admin/sessions/:id/reply`、`POST /api/admin/sessions/:id/status`；小程序 `GET|POST /api/wx/callback`。

## 四、接入微信小程序客服消息（以后要做的配置）

核心逻辑不用改：工作台点“发送”时，服务器按会话的 `channel` 调用对应适配器的 `deliver(session, message)`。网页会话走 `web`（存起来等学生轮询），小程序会话走 `miniprogram`（上传临时素材 → 调用客服消息接口发图片 / 文字）。

**需要你在小程序后台做的事：**
1. 准备一个 **HTTPS 域名**（需备案），把本服务部署在上面，设置 `PUBLIC_URL`。
2. 小程序后台 → 开发管理 → 开发设置 → **消息推送**：URL 填 `https://你的域名/api/wx/callback`，自定义 Token，随机生成 EncodingAESKey，加密方式建议“安全模式”，数据格式选 **JSON**。
3. 设置环境变量 `WX_APPID`、`WX_APPSECRET`、`WX_TOKEN`、`WX_ENCODING_AES_KEY` 后重启；保存“消息推送”时微信会发 GET 校验请求，本服务会自动回 `echostr`。
4. 在 开发设置 → **IP 白名单** 中加入服务器出口 IP（获取 access_token 需要）。
5. 小程序页面里用 `<button open-type="contact" session-from='{"homes":[{"n":25,"name":"The Lantern"}],"lifeCharacter":"咖啡馆学习派"}'>咨询</button>` 打开客服会话；`session-from` 会随“进入会话”事件推送到后端，作为工作台里的上下文（长度有限，请只放房源编号和测验摘要）。
6. 也可在小程序后台“客服”里添加客服人员（用微信直接回复），与本工作台互不冲突。

**规则与限制（请以微信官方最新文档为准）：**
- **48 小时回复窗口**：用户在客服会话里发消息（或进入会话）后的 48 小时内，才能通过“发送客服消息”接口回复他；超时微信返回错误码 `45015`，工作台会显示“发送失败”。工作台对小程序会话会显示“48 小时回复窗口至 …”。
- 消息推送必须在 **5 秒内** 回复 `success`（本服务先回再处理）；微信可能重试推送，同一消息可能收到多次。
- 图片要先 **上传临时素材**（`media/upload`，有效期 3 天）拿到 `media_id` 再发送。
- `access_token` 有效期 2 小时，本服务使用 `stable_token` 接口并缓存；如有多台服务器共用一个 AppID，请集中存储 token。
- 不得用客服消息做营销群发；二维码图片里的群二维码 7 天会过期，请让客服及时更新。

**代码状态：** `channels/miniprogram.js` 里的签名校验、安全模式加解密、access_token、上传临时素材、发送客服消息都是真实代码，签名与加解密已用自测（`test/smoke.cjs`）验证，但**尚未在真实微信环境联调**；所有待确认之处都用 `TODO` 标出。

## 五、上线前清单

- 修改 `ADMIN_PASSWORD`（默认 123456 只用于本地原型）。
- 用 Nginx/Caddy 做 HTTPS 反向代理，转发到 8765 端口。
- 定期备份 `data/`；会话里有学生昵称和留言，请按隐私要求保存与删除。
- 当前存储是单进程 JSON 文件，适合原型和小流量；量大时可把 `lib/store.js` 换成数据库，接口不变。
