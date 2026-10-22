# 线上版网页（干净源码）

来源：https://liverpool-student-map.wy16875.chatgpt.site/ ，2026-10-22 在浏览器里"另存为网页"后还原。

浏览器另存的是页面运行之后的状态（地图、按钮已经画好），直接打开会重复绘制。这里的 `index.html` 按网页原版 `web-original/liverpool-life-map-en/index.html` 的静态骨架重建，换入线上版的脚本、样式和文件，布局与线上版一致。

与另存文件相比，去掉了 ChatGPT 网站自带的"编辑网站"小部件（`/_sites/dispatch-assets/sites-widget.js`），它不属于本页面。

另存时没有一起保存 `sw.js`（离线缓存用的 Service Worker），缺少时页面照常运行，只是没有离线缓存。

## 在线版布局之上补充的功能

线上版原有文件只改了 `index.html` 里的几行引用，新功能都在新文件里，不改变原有布局：

| 文件 | 作用 |
|---|---|
| `room-photos.js` / `.css` | 公寓卡片「展开详情」里加「房型与照片」：房型卡片 + 按卧室 / 浴室 / 厨房分组的相册；相册里「咨询这个房型」会打开对话框并预填问题。收起状态下有照片的公寓多一行照片数量提示 |
| `booking-handoff.js` / `.css` | 对话框里加「我要建群咨询」：资料选填，提交后顾问后台收到提醒；顾问发出的群二维码回到同一个对话框。新加坡默认 WhatsApp 群，中国默认微信群 |
| `adviser.html` + `adviser/` | 顾问后台：会话列表、学生上下文、建群并发送二维码、状态流转、数据看板（`adviser/` 下的脚本复制自 `web-demo/`） |
| `handoff-demo.html` | 对话框里「两端流程演示：人工建群 → 群码回传」链接的页面：左边学生网站，右边顾问后台 |
| `photos/`、`vendor/qrcode.js` | 1 号公寓的房型照片（AmberStudent，2026-10-21）、二维码生成库 qrcode-generator 1.4.4（MIT） |

演示数据只存在浏览器本地（`lsm-live-me-v1` 学生会话、`lsm-live-admin-v1` 顾问后台），同一浏览器里的学生网站和顾问后台通过 storage 事件实时同步；二维码是演示链接，扫码不会进入真实群。其余 46 套公寓的房型按历史参考价列出，照片显示「照片整理中」，补照片时在 `room-photos.js` 的 `ROOMS` 里添加。

打开方式：在本目录运行 `python3 -m http.server`，访问 `http://localhost:8000/`（学生网站）、`/adviser.html`（顾问后台）、`/handoff-demo.html`（两端流程演示）。
