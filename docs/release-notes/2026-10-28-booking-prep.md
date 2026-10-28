# 抢房准备 · 订房顾问 · 计划分享 更新说明 / Release Notes

2026-10-28

> 本包只含上次打包（选房工具与地图联动）之后改动或新增的 37 个文件，保持原来的目录结构；`截图-screenshots/` 里是现在版本的截图（18 张）。放进项目时，把 `web-live/`、`web-original/`、`miniprogram/`、`docs/` 合并进项目根目录即可。截图里的开放日期、状态和「几分钟前检查过官网」是演示数据，不是真实房态。
>
> This package contains only the 37 files added or changed since the last package (Home tools & map), in their original folders; `截图-screenshots/` has 18 screenshots of the current version. To apply, merge `web-live/`, `web-original/`, `miniprogram/` and `docs/` into the project root. Release dates, statuses and "checked N minutes ago" in the screenshots are demo data, not live availability.

## 中文

### 1. 这次商量定下来的方案

| 决定 | 怎么做的 |
| --- | --- |
| 工具的刚需是「抢房」 | 新增 🏁 抢房准备：第一时间知道开放了 + 开放那一刻知道自己要订哪间 |
| Amber 不同意给数据 → 用 2 号方案 | 服务器定时查各公寓**官网公开页面**，发现开放 / 有房 / 价格变化就发邮件。只提醒，不替学生下单，不绕过排队和验证码 |
| 不需要的去掉 | 资料清单、订房步骤（交押金后的流程）、开放当天准备清单都已删除 |
| 两手准备：引导人工服务 | 抢房计划里提示「找订房顾问一起盯」，点了直接进原有的一键进群；进群后顾问后台直接看到学生的抢房计划 |
| 分享 | 网页生成这份计划的**二维码**，微信一扫进小程序就是这份计划；朋友在小程序里可以复制到自己的计划，也能「转发给朋友」继续传 |
| 小程序也能做计划 | 小程序新增抢房计划，可以加入公寓、排房型、转发给朋友 |

### 2. 网页：🏁 抢房准备

入口：地图上的选房工具栏「🏁 抢房准备」，以及公寓卡片里的选房小工具。三页：

| 页 | 内容 |
| --- | --- |
| **开放日历** | 每栋公寓：预计开放日、倒计时、状态（已开放 / 即将开放 / 候补 / 售罄 / 待核对）、官网最低周租、监测情况（如「监测中 · 5 分钟前检查过官网 · 平时每 45 分钟查一次」）、官网预订页链接；可以「关注」。7 天内开放会提示排好首选备选、找顾问一起抢；售罄会提示找顾问候补 |
| **抢房计划** | 每栋关注的公寓：房型顺序（点一下加入，标「首选 / 备选 1 / 备选 2…」）、最高周租（官网最低价超出时提醒）。下面是 🤝 两手准备（找订房顾问 / 复制我的抢房计划）和 📲 分享到微信小程序（生成分享二维码） |
| **开放提醒** | 留邮箱「开启邮件提醒」：关注的公寓开放、或售罄后又有房时发邮件（每封有退订链接）。页面开着时每分钟刷新，状态一变马上提示 |
| **朋友的计划** | 打开带 `?ps=分享码` 或 `?plan=计划码` 的网址（没配小程序时扫二维码会打开这里）：显示「小林的抢房计划」，可以复制整份到自己的计划 |

没连服务器时（例如演示链接），开放信息用 `booking-prep.json` 的演示数据，「开放提醒」有「模拟开放」按钮。

### 3. 服务器：官网监测（2 号方案）

- **查什么**：`lib/availability-sources.json` 里每栋楼的官网房型页。只读公开页面，不登录、不提交表单。
- **多久查一次**：平时每 45 分钟；预计开放日前 3 天到后 2 天每 7 分钟；连续失败自动放慢。同一网站两次访问至少隔 15 秒，遵守 robots.txt。
- **怎么判断**：只看页面上目标学年（2027/28）附近的文字。出现 Book now 一类按钮 → 已开放；Sold out → 售罄；waitlist / register interest / coming soon → 候补；页面上还没有这个学年 → 即将开放。顺便读出最低周租。今年能订、明年写着 coming soon 的页面不会误判成已开放。
- **提醒**：状态变成已开放（包括售罄后又有房）时，给关注的学生发邮件。判断不了的，订房专家在后台手动改状态，改成已开放同样会发邮件。
- **安全**：只接受已知公寓；网址必须是 https 且域名在白名单（`allowedHosts`）里，不能被拿去访问任意网址。

### 4. 顾问后台：直接看到学生的抢房计划

- 学生点「立即进群」时，抢房计划跟着建群请求一起交给顾问；之后学生再改计划，一秒内自动同步。建群通知里也写着「抢房计划：iQ Great Newton House（2026-11-03 开放）」。
- 学生资料最上方是「🏁 抢房计划」：按开放日排序，每栋显示状态、开放日和倒计时（3 天内开放或已开放标红 🔥）、房型顺序（首选标绿）、最高周租，官网最低价超出预算时提醒。
- 会话列表里有计划的学生标 🏁 和公寓数，3 天内有公寓开放的变成 🔥，顾问可以先联系。
- 只同步公寓、状态、房型和预算，不含学生邮箱。

### 5. 小程序：抢房计划和分享

| 功能 | 内容 |
| --- | --- |
| **入口** | 地图左下角「🏁 抢房计划」（显示几栋）；公寓卡片上「🏁 加入抢房」 |
| **我的计划** | 每栋：开放日、倒计时、状态、房型顺序、最高周租；从收藏里添加；最多 10 栋 |
| **转发我的计划** | 填署名（可选）→ 转发到微信聊天，卡片标题如「小林在抢这 3 栋：…，看看我的抢房计划」 |
| **朋友的计划** | 点开朋友的转发卡片，或扫网页的二维码，直接进入「小林的抢房计划」：「复制整份到我的计划」/「复制这栋」/「转发给朋友」 |
| **复制规则** | 没有的公寓加进来；已经关注但没排房型的用朋友的顺序；自己排过房型的保留自己的（单栋复制会先问要不要替换） |
| **看朋友的计划** | 也可以输入 6 位分享码，或粘贴朋友发来的链接 / 文字 |

### 6. 数据

| 数据 | 在哪里 | 说明 |
| --- | --- | --- |
| 官网监测来源表 | `web-original/consult-server/lib/availability-sources.json` | 学年 2027/28、域名白名单、每栋楼的官网页和预计开放日。**现在只有 iQ、Yugo、Vita 填了运营商首页当占位**，上线前要换成各楼盘自己的房型页 |
| 来源填写表（给团队） | `docs/availability-sources-todo.csv` | 47 栋公寓：编号、名称、官网房型页、预计开放日、现在的来源和备注。填好后照着改上面的 JSON |
| 演示开放信息 | `web-live/booking-prep.json` | 6 栋楼的演示开放日和状态（`demo: true`），只在没连服务器时用 |
| 监测状态和关注者 | 服务器 `DATA_DIR/availability.json` | 每栋楼的状态、上次检查时间、状态变化记录（最近 30 条）、关注的邮箱和退订令牌 |
| 分享码 | 服务器 `DATA_DIR/plan-shares.json` | 只存计划编码和可选署名；同一份计划同一个码；180 天没人打开自动清掉 |
| 抢房计划（顾问看） | 服务器咨询记录里的 `plans` | 公寓、状态、开放日、房型顺序、最高周租；不含邮箱 |
| 学生自己的关注和计划 | 浏览器 `lsm-prep-v1`；小程序存储 `lsm-prep-v1` | 只在这台设备上 |

**计划编码**（网页和小程序通用）：每栋「公寓编号.房型字母.最高周租」，用 `_` 连起来，例如 `1.se.180_32.e` = 1 号楼 Studio > 独卫单间、最高 £180；32 号楼独卫单间。房型字母：e 独卫单间、s Studio、p 高楼层 / 大房间、t 双人间、f 合租整套。

### 7. 上线前要配置的

| 项目 | 做什么 | 没配时 |
| --- | --- | --- |
| 官网地址 | 按 `docs/availability-sources-todo.csv` 填各楼盘房型页，加进 `availability-sources.json` 和 `allowedHosts` | 只有填了的楼会被监测；其他显示「待核对」 |
| 服务器网络 | 部署环境允许访问 `allowedHosts` 里的官网域名 | 检查失败，状态停在上一次（这个开发环境就访问不了官网，所以还没真正抓过官网） |
| 发邮件 | `SMTP_HOST` 等（和优惠提醒同一套） | 网页提示「服务器还没配好邮件」，只在页面里提醒 |
| 小程序 AppID | 服务器设 `WX_APPID`、`WX_APPSECRET` | 网页二维码是普通二维码 |
| 扫普通链接二维码 | 小程序后台「开发管理 → 开发设置 → 扫普通链接二维码打开小程序」：前缀 `https://<网页域名>/?ps=`，页面 `pages/index/index`，校验文件放网页根目录 | 扫码打开网页版的朋友计划（同样能看、能复制） |
| 监测频率（可选） | `AVAILABILITY_NORMAL_MIN`、`AVAILABILITY_FAST_MIN`；`AVAILABILITY=off` 关闭 | 默认 45 / 7 分钟 |

### 8. 改动的文件

| 文件 | 改动 |
| --- | --- |
| `web-live/booking-prep.js` / `.css` / `.json` | 新增：抢房准备（开放日历、抢房计划、开放提醒、两手准备、分享二维码、朋友的计划） |
| `web-live/home-insights.js` · `index.html` | 工具栏加「🏁 抢房准备」，加载新文件 |
| `web-live/booking-handoff.js` · `case-api.js` | 进群时带上抢房计划，之后自动同步 |
| `web-live/adviser/admin.js` · `app.css` · `store-server.js` | 顾问后台显示抢房计划，会话列表 🏁 / 🔥 标记 |
| `web-live/sw.js` · `README.md` | 缓存版本、功能说明 |
| `web-original/consult-server/lib/availability.js` · `availability-sources.json` | 新增：官网监测、邮件提醒、接口 |
| `web-original/consult-server/lib/plan-shares.js` | 新增：分享码 |
| `web-original/consult-server/lib/cases.js` · `server.js` · `package.json` · `README.md` | 抢房计划同步接口、接上新模块、部署说明 |
| `web-original/consult-server/test/availability.cjs` · `plan-shares.cjs` · `cases.cjs` | 自检（`npm test` 全部通过） |
| `miniprogram/components/plan/*` · `utils/plan-core.js` | 新增：小程序抢房计划、朋友的计划、复制、转发 |
| `miniprogram/pages/index/*` · `utils/i18n.js` · `utils/share-link.js` | 入口按钮、卡片「加入抢房」、扫码 / 转发打开计划 |
| `miniprogram/README.md` · `TESTING.md` · `tools/wx-preview.cjs` | 说明、测试清单第 18–21 项、预览工具支持转发按钮 |
| `docs/availability-sources-todo.csv` | 新增：官网地址填写表 |

### 9. 测试情况和注意

- 服务器自检 `npm test` 全部通过（监测判断、频率、robots.txt、白名单、邮件和退订、计划同步、分享码）。
- 在浏览器里实际跑通：网页生成二维码 → 网页朋友页 → 小程序扫码打开 → 复制 → 转发 → 第三个人打开；学生进群 → 顾问后台看到计划 → 学生改计划后自动更新。
- 小程序部分是用项目自带的浏览器预览工具测的，只是近似模拟；真实的转发、扫码要在微信开发者工具和真机上用两个微信号测（`miniprogram/TESTING.md` 第 18–21 项）。
- 还没有真正抓过官网（开发环境访问不了），判断规则是用模拟的官网页面测的；接上真实官网后，建议订房专家先在后台看一周判断结果，再对学生开放邮件提醒。
- 顾问能提高成功率，但页面上写明了「不保证一定订到」。

## English

### 1. What we agreed

| Decision | How it is built |
| --- | --- |
| The core need is getting a room when bookings open | New 🏁 Booking prep: know the moment bookings open, and know which room you will book |
| Amber declined to share data → option 2 | The server checks each building's **official public pages** on a schedule and emails students when rooms open, come back or change price. It only alerts; it never books for students or bypasses queues and captchas |
| Remove what is not needed | The document checklist, post-deposit booking steps and release-day checklist are gone |
| Two tracks: point students to human help | The booking plan suggests a booking adviser; the button opens the existing one-tap group join, and the adviser console then shows the student's plan |
| Sharing | The website creates a **QR code** of the plan; scanning it in WeChat opens that plan in the mini program, where friends can copy it or forward it on |
| Plans in the mini program too | The mini program gets its own booking plan: add homes, rank room types, forward to friends |

### 2. Website: 🏁 Booking prep

Open it from "🏁 Booking prep" on the map toolbar, or from the tools on a home card. Three tabs:

| Tab | Contents |
| --- | --- |
| **Release dates** | For each home: expected release date, countdown, status (open / opening soon / waitlist / sold out / to check), lowest official weekly rent, monitoring (e.g. "Monitored · official site checked 5 min ago · checked every 45 min") and the official booking link; "Watch" button. Within 7 days of release it suggests ranking choices and getting an adviser; when sold out it suggests an adviser for the waitlist |
| **Booking plan** | For each watched home: room order (tap to add; labelled 1st / Backup 1 / Backup 2…) and highest weekly rent (warns when the lowest official price is above it). Below: 🤝 Two tracks (talk to a booking adviser / copy my plan) and 📲 Share to the WeChat mini program (create a share QR code) |
| **Alerts** | Leave an email to get alerts when a watched home opens or has rooms again after selling out (each email has an unsubscribe link). While the page is open it refreshes every minute |
| **A friend's plan** | A link with `?ps=<share code>` or `?plan=<plan code>` (what a QR scan opens when the mini program is not set up for QR links) shows e.g. "Lin's booking plan" with copy-to-mine |

Without a server (e.g. the demo link) release info comes from the demo data in `booking-prep.json`, and Alerts has a "Simulate opening" button.

### 3. Server: monitoring official pages (option 2)

- **What**: each building's official rooms page listed in `lib/availability-sources.json`. Public pages only; it never signs in or submits forms.
- **How often**: every 45 minutes normally; every 7 minutes from 3 days before to 2 days after the expected release date; slower after repeated failures. At least 15 seconds between visits to the same site; robots.txt is respected.
- **How it decides**: it only reads text near the target year (2027/28). "Book now"-style buttons → open; "Sold out" → sold out; waitlist / register interest / coming soon → waitlist; target year not on the page yet → opening soon. It also reads the lowest weekly rent. A page that sells this year but says "coming soon" for next year is not mistaken for open.
- **Alerts**: when a home becomes open (including rooms back after selling out), watchers are emailed. Booking experts can set the status by hand in the console when the page is unclear; setting it to open also emails watchers.
- **Safety**: known homes only; URLs must be https on an allowed host (`allowedHosts`), so it cannot be used to fetch arbitrary URLs.

### 4. Adviser console: the student's booking plan

- When a student taps "Join now", their booking plan goes with the group request; later changes sync within a second. The new-request notification also lists it, e.g. "Booking plan: iQ Great Newton House (opens 2026-11-03)".
- The top of the student panel shows "🏁 Booking plan", sorted by release date: status, release date and countdown (red with 🔥 when opening within 3 days or open), ranked room types (first choice in green), max rent, and a warning when the lowest official price is over budget.
- In the conversation list, students with a plan get 🏁 and the number of homes; 🔥 when a home opens within 3 days, so advisers know whom to contact first.
- Only homes, statuses, room types and budget are shared, never the student's email.

### 5. Mini program: booking plan and sharing

| Feature | Details |
| --- | --- |
| **Entry** | "🏁 Booking plan" at the bottom left of the map (with a count); "🏁 Add to plan" on home cards |
| **My plan** | For each home: release date, countdown, status, room order, max rent; add from saved homes; up to 10 homes |
| **Send my plan** | Optional name → forward to a WeChat chat; the card reads e.g. "Lin is going for 3 homes: … · see the booking plan" |
| **A friend's plan** | Opening a forwarded card, or scanning the website's QR code, goes straight to "Lin's booking plan": "Copy the whole plan to mine" / "Copy this home" / "Forward to friends" |
| **Copy rules** | Homes you don't have are added; homes you watch without a room order take your friend's order; homes you already ranked keep yours (copying a single home asks before replacing) |
| **See a friend's plan** | You can also type a 6-character share code, or paste the link or message a friend sent |

### 6. Data

| Data | Where | Notes |
| --- | --- | --- |
| Monitoring sources | `web-original/consult-server/lib/availability-sources.json` | Year 2027/28, allowed hosts, each building's official page and expected release date. **Only iQ, Yugo and Vita have URLs so far, and they are operator home pages used as placeholders**; replace them with each building's own rooms page before going live |
| Sources sheet for the team | `docs/availability-sources-todo.csv` | All 47 homes: number, name, official rooms page, expected release date, current source and note. Fill it in, then update the JSON above |
| Demo release info | `web-live/booking-prep.json` | Demo dates and statuses for 6 homes (`demo: true`), used only without a server |
| Monitoring state and watchers | Server `DATA_DIR/availability.json` | Status per building, last check, status history (last 30), watcher emails and unsubscribe tokens |
| Share codes | Server `DATA_DIR/plan-shares.json` | Only the plan code and optional name; the same plan gets the same code; removed after 180 days without being opened |
| Booking plans for advisers | Server case records, field `plans` | Homes, status, release date, room order, max rent; no email |
| Students' own watch list and plans | Browser `lsm-prep-v1`; mini program storage `lsm-prep-v1` | On that device only |

**Plan code** (shared by website and mini program): for each home "home number.room letters.max rent", joined with `_`, e.g. `1.se.180_32.e` = home 1: Studio > En-suite, max £180; home 32: En-suite. Room letters: e en-suite, s studio, p high floor / larger room, t twodio, f whole flat.

### 7. Configuration before launch

| Item | What to do | Without it |
| --- | --- | --- |
| Official URLs | Fill each building's rooms page in `docs/availability-sources-todo.csv`, then add them to `availability-sources.json` and `allowedHosts` | Only listed buildings are monitored; others show "to check" |
| Server network | Allow the deployment to reach the hosts in `allowedHosts` | Checks fail and the last status is kept (this development environment cannot reach the operator sites, so no live page has been fetched yet) |
| Email | `SMTP_HOST` etc. (same as offer alerts) | The page says email is not set up and alerts show on the page only |
| Mini program AppID | Set `WX_APPID` and `WX_APPSECRET` on the server | The website QR code is a regular QR code |
| Regular QR links | Mini program console → Development → Development settings → "Scan regular QR code to open mini program": prefix `https://<site domain>/?ps=`, page `pages/index/index`, verification file in the site root | Scanning opens the friend's plan on the website (still viewable and copyable) |
| Check frequency (optional) | `AVAILABILITY_NORMAL_MIN`, `AVAILABILITY_FAST_MIN`; `AVAILABILITY=off` to turn off | Defaults 45 / 7 minutes |

### 8. Changed files

| File | Change |
| --- | --- |
| `web-live/booking-prep.js` / `.css` / `.json` | New: Booking prep (release dates, booking plan, alerts, two tracks, share QR code, a friend's plan) |
| `web-live/home-insights.js` · `index.html` | "🏁 Booking prep" on the toolbar; load the new files |
| `web-live/booking-handoff.js` · `case-api.js` | Send the booking plan when joining a group and keep it in sync |
| `web-live/adviser/admin.js` · `app.css` · `store-server.js` | Booking plan in the adviser console; 🏁 / 🔥 badges in the list |
| `web-live/sw.js` · `README.md` | Cache version, feature notes |
| `web-original/consult-server/lib/availability.js` · `availability-sources.json` | New: official page monitoring, email alerts, API |
| `web-original/consult-server/lib/plan-shares.js` | New: share codes |
| `web-original/consult-server/lib/cases.js` · `server.js` · `package.json` · `README.md` | Plan sync API, wiring, deployment notes |
| `web-original/consult-server/test/availability.cjs` · `plan-shares.cjs` · `cases.cjs` | Tests (`npm test` all pass) |
| `miniprogram/components/plan/*` · `utils/plan-core.js` | New: mini program booking plan, friend's plan, copy, forward |
| `miniprogram/pages/index/*` · `utils/i18n.js` · `utils/share-link.js` | Entry button, "Add to plan" on cards, opening plans from scans and forwards |
| `miniprogram/README.md` · `TESTING.md` · `tools/wx-preview.cjs` | Notes, test checklist items 18–21, preview tool handles share buttons |
| `docs/availability-sources-todo.csv` | New: official URL sheet |

### 9. Testing and notes

- Server tests (`npm test`) all pass: page classification, check frequency, robots.txt, allowed hosts, email and unsubscribe, plan sync, share codes.
- Run end to end in a browser: website QR code → website friend page → mini program opened from the scan → copy → forward → a third person opens it; student joins a group → adviser console shows the plan → the student's edits update it.
- The mini program was tested with the project's browser preview tool, which is only an approximation; real forwarding and scanning need WeChat DevTools and real phones with two WeChat accounts (`miniprogram/TESTING.md` items 18–21).
- No live official page has been fetched yet (this environment cannot reach them); the rules were tested with simulated pages. After connecting real sites, have the booking experts review the results in the console for a week before turning on student email alerts.
- An adviser improves the chances but cannot guarantee a room, and the page says so.

### 截图 / Screenshots

| 文件 / File | 内容 / What it shows |
| --- | --- |
| `web-zh-1-release-dates.png` · `web-en-1-…` | 开放日历和监测状态 / Release dates with monitoring status |
| `web-zh-2-booking-plan.png` · `web-en-2-…` · `web-desktop-booking-plan.png` | 抢房计划（房型顺序、最高周租）/ Booking plan |
| `web-zh-3-two-tracks.png` · `web-en-3-…` | 两手准备：找订房顾问 / Two tracks: booking adviser |
| `web-zh-4-share-qr.png` · `web-en-4-…` | 分享二维码 / Share QR code |
| `web-zh-5-alerts.png` · `web-en-5-…` | 开放提醒 / Alerts |
| `web-zh-6-friend-plan.png` | 网页上的朋友计划 / A friend's plan on the website |
| `adviser-booking-plan.png` | 顾问后台的抢房计划 / Booking plan in the adviser console |
| `mp-1-card-add-to-plan.png` … `mp-5-copied-and-forward.png` | 小程序：加入抢房、我的计划、转发、扫码打开朋友计划、复制和转发 / Mini program: add to plan, my plan, send, friend's plan from a scan, copy and forward |
