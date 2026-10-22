# Liverpool Student Life · shared quiz entry
# 利物浦学生生活 · 同一入口，两种测验

Open `index.html` using the included local-server launcher. On macOS use `Open in Browser.command`; on Windows use `Start server (Windows).bat`; on Linux run `sh start-server.sh`. Python 3 or a static web server is required for the complete experience.

请通过随附的本地服务器启动脚本打开 `index.html`。macOS 使用 `Open in Browser.command`，Windows 使用 `Start server (Windows).bat`，Linux 运行 `sh start-server.sh`。完整功能需要 Python 3 或静态网页服务器。

## What changed / 本次修改

- One shared entry, “Find my Liverpool”, opens a chooser with two independent options. On mobile the same entry lives in the bottom toolbar; on desktop it lives in the top toolbar.
- Life Quiz retains its original six lifestyle questions, 15 characters, Life Card, friend comparison and map-based recommendations.
- Home Match retains its original eight housing questions, multi-select questions, matching logic, result card and shortlist.
- Questions, scores and saved answers have NOT been merged. Life Card’s existing recommendation adapter no longer replaces an in-progress native Home Match draft in memory.
- English and Simplified Chinese are available across the chooser, both tests, results, cards, recommendation explanations and share controls. Language switching inside either quiz keeps the current question and choices.
- Japanese is no longer an interface option or supported route language. A previous Japanese setting/link safely falls back to English.
- The full map is still available without taking either quiz. Use “Browse the map”; the shared entry remains available afterwards.
- Automatic A/B assignment was removed. Visitors choose the experience themselves.

- 同一个“寻找我的利物浦”入口内，提供“生活测验”和“住宿匹配”两个独立选项。手机版入口在底部工具栏，电脑版在顶部工具栏。
- 生活测验保留原来的 6 道题、15 种角色、生活卡、朋友对比和地图推荐。
- 住宿匹配保留原来的 8 道题、多选设置、推荐逻辑和找房结果卡。
- 没有合并题目、评分或保存的答案。生活卡调用推荐引擎时，不会覆盖住宿匹配尚未完成的答案。
- 入口、两种测验、结果卡、推荐理由和分享界面均支持英文与简体中文。答题中切换语言会保留当前问题和选择。
- 已移除日语界面入口及日语路由支持；旧日语设置或链接会安全回退到英文。
- 无需答题即可浏览完整地图，之后仍能通过同一个入口选择测验。
- 已取消随机 A/B 分流，由访客自行选择。

## Data and compatibility / 数据与兼容性

The supplied property, nearby-place and character CSV files are unchanged. Listings and prices remain historical reference data dated 17 October 2026, not live availability. Recommendations remain a shortlist of up to three homes, with no invented compatibility percentages.

Existing `c1` Life Quiz invite/comparison links continue to open on the map. `life-quiz-c.html` forwards to the current Life Quiz. The older `life-home-test.html` forwards complete single `h1` answer links to the current map’s Home Match engine. Older pair/unknown hashes are retained in the link, and a bilingual notice requires an explicit click before continuing; the old standalone friend-comparison experience is not recreated. The original upload is preserved separately as the original source archive.

All answer storage remains on the visitor’s browser. Life Quiz and Home Match use separate storage keys. The optional campus/walking controls already present on the Life Card remain available; they are not new compulsory quiz questions. Life Card recommendations use the original six-answer-to-housing mapping, whereas the independent Home Match questionnaire uses its own eight explicit answers.

房源、周边地点和角色 CSV 数据未改动。价格仍为 2026 年 10 月 17 日的历史参考信息，不代表实时空房。最多推荐 3 处公寓，不添加虚构匹配百分比。

原有 `c1` 生活测验分享链接继续有效。旧页面 `life-quiz-c.html` 会跳转到地图中的生活测验。旧 `life-home-test.html` 的完整单人 `h1` 答案可以转入当前地图的住宿匹配；旧双人或未知链接会保留原始内容，并显示中英提示，点击后才继续。旧独立版的朋友对比界面未迁移。原始上传包另行保留。

两种测验分别保存答案。生活卡原有的校区和步行偏好仍为可选调整，不是新增必答题。

## Verification / 验证说明

See `QA-REPORT.md` for exactly what was checked and what could not be checked. The package includes reproducible test scripts. No deployment or public publication was performed.

请参阅 `QA-REPORT.md`，了解实际已完成及尚未完成的验证。附有可复现的测试脚本。本次未发布或覆盖任何线上站点。

## Consult chat / 在线咨询

“咨询这处公寓” now opens a live chat that talks to `../consult-server` (run `node consult-server/server.js` from the parent folder; it serves this site on port 8765 too). Opened as a plain static site, the chat shows a friendly offline notice. WhatsApp has been removed.

“咨询这处公寓”现在打开在线咨询对话框，由同级目录的 `consult-server` 提供后端（在上级目录运行 `node consult-server/server.js`，同时提供本站点，端口 8765）。单独作为静态站点打开时，对话框会提示咨询服务暂不可用。已移除 WhatsApp。

## PWA / 添加到桌面（2026-10-20）

- `sw.js` 使用版本号缓存（`lsm-v20261020c`），安装时缓存页面壳资源，激活时清除旧缓存。
- 静态 JS/CSS 带 `?v=20261020c` 防微信/CDN 混用旧文件。
- `manifest.webmanifest` 的 `start_url` 为 `./index.html#explore=1`（跳过测验选择层；语言优先用已保存的 `lsm-lang`，否则默认中文）。
- 离线仅覆盖页面壳与静态资源；预订链接与在线咨询仍需联网。

## 数据债（仍未完成）

运行时数据仍硬编码在 `index.html`（`HOMES` / `PRICES`），`data/homes.csv` 不参与运行。详见 `data/README.md`。已修正 #5 / #23 价格口径展示与 #41 Poets Place（标记为当日无房型）。下一步应用构建脚本从 CSV 生成 JSON 作为唯一数据源。
