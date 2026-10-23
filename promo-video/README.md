# 宣传片（约 60 秒，16:9，中文）

画面全部是网页（`web-live/`）的真实操作录屏：舞台页 `stage/index.html` 里放一台手机（片尾加平板和折叠屏），网页在 iframe 里运行；
`stage/timeline.js` 写好每个镜头的点按、镜头推拉和标题，`record.cjs` 逐帧推进时间、截图，`encode.sh` 合成 MP4。
分镜、屏幕文字和配乐建议见 [分镜与配乐说明.md](分镜与配乐说明.md)。

## 重新渲染

需要 Node.js 18+、`npm i -g playwright`（Chromium）、ffmpeg。

```
sh promo-video/fetch-fonts.sh                 # 第一次：下载字体（开源授权）
node promo-video/server.cjs &                  # 本地服务器 :8780（网页 + 舞台 + 字体）
NODE_PATH=$(npm root -g) node promo-video/record.cjs promo-video/frames/draft 10 0 60 1   # 草稿：10 帧/秒、1 倍分辨率，约 2 分钟
NODE_PATH=$(npm root -g) node promo-video/record.cjs promo-video/frames/final 30 0 60 2   # 成片：30 帧/秒、2 倍分辨率，约 15 分钟
sh promo-video/encode.sh                       # 输出 out/…-1080p.mp4 和 …-4k.mp4
```

参数：`record.cjs <输出目录> <帧率> <从第几秒开始保存> <到第几秒> <分辨率倍数>`。只改了某一段时，可以只重渲那几秒（前面的时间照样推进、不保存），覆盖到同一个目录再合成。

## 为什么每次录出来都一样、而且很顺

- 网页里的计时器和 `requestAnimationFrame` 用 Playwright 的假时钟，**暂停**着，每帧只往前走 1/30 秒（河面那一段 6 倍速，让渡轮和海鸥看得出在动）。
- CSS 动画和过渡全部暂停，每帧手动推进同样的时间。
- 每帧截图前等字体下载完，不会闪出系统字体。
- 天气固定为「利物浦 12° 下雨」（拦截天气接口），手机状态栏时间固定 9:41。
- 网页的 `env(safe-area-inset-*)` 在 iframe 里是 0，舞台载入网页后换成真机的刘海和底部横条高度。
