# 线上版网页（干净源码）

来源：https://liverpool-student-map.wy16875.chatgpt.site/ ，2026-10-22 在浏览器里"另存为网页"后还原。

浏览器另存的是页面运行之后的状态（地图、按钮已经画好），直接打开会重复绘制。这里的 `index.html` 按网页原版 `web-original/liverpool-life-map-en/index.html` 的静态骨架重建，换入线上版的脚本、样式和文件，布局与线上版一致。

与另存文件相比，去掉了 ChatGPT 网站自带的"编辑网站"小部件（`/_sites/dispatch-assets/sites-widget.js`），它不属于本页面。

缺少的文件（另存时没有一起保存）：

- `handoff-demo.html`：对话框里"两端流程演示：人工建群 → 群码回传"链接指向的页面
- `sw.js`：离线缓存用的 Service Worker，缺少时页面照常运行，只是没有离线缓存

打开方式：在本目录运行 `python3 -m http.server`，访问 `http://localhost:8000/`。
