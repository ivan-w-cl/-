# Liverpool Student Map

帮中国、新加坡、日本的学生在去利物浦上学之前选好房子。App 只负责展示房源和简单沟通，用户确定要详细咨询时，顾问把专属预定专家团队的群二维码发进对话框。

**English guide for the team: [GUIDE-EN.md](GUIDE-EN.md)（带截图的版本：`GUIDE-EN.html`）。一键运行：`./start-demo.sh`（Windows：`start-demo.cmd`）。**

| 目录 | 内容 |
|---|---|
| `web-live/` | **线上版网页**（布局与线上一致）+ 房型照片、建群咨询、顾问后台、两端流程演示，见 [web-live/README.md](web-live/README.md) |
| `web-demo/` | 早前自行设计的手机 App 风格 Demo（学生 App + 顾问后台 + 数据看板），见 [web-demo/README.md](web-demo/README.md) |
| `web-original/liverpool-life-map-en/` | 网页原版：手绘地图、两个测试、在线咨询、PWA |
| `web-original/consult-server/` | 客服后台：网页聊天、小程序客服渠道、顾问工作台 |
| `miniprogram/` | 微信小程序版（中 / 英，按网页版 1:1 还原，见 [miniprogram/README.md](miniprogram/README.md)；给测试团队的说明：[MINIPROGRAM-TESTING.html](MINIPROGRAM-TESTING.html)） |
| `design/room-photos/` | 房型照片设计稿（iQ Great Newton House） |
| `data/` | 房源数据表：`homes.csv`（47 处公寓）、`room-types.csv`、`homes.json` |
| `docs/screenshots/` | 各页面截图（英文界面） |
| `design/demo-package/` | 单文件演示包（`Liverpool Student Map.html`、地图预览图、打开说明） |
