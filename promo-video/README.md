# 宣传片（62.6 秒，16:9，中文，按配乐剪辑）

画面全部是网页（`web-live/`）的真实操作录屏：舞台页 `stage/index.html` 里放一台手机（片尾加平板和折叠屏），网页在 iframe 里运行；
`stage/timeline.js` 写好每个镜头的点按、镜头推拉和标题，`record.cjs` 逐帧推进时间、截图，`encode.sh` 合成 MP4。
分镜、屏幕文字和配乐建议见 [分镜与配乐说明.md](分镜与配乐说明.md)。

## 重新渲染

需要 Node.js 18+、`npm i -g playwright`（Chromium）、ffmpeg。

```
sh promo-video/fetch-fonts.sh                 # 第一次：下载字体（开源授权）
node promo-video/server.cjs &                  # 本地服务器 :8780（网页 + 舞台 + 字体）
NODE_PATH=$(npm root -g) node promo-video/record.cjs promo-video/frames/draft 10 0 62.6 1   # 草稿：10 帧/秒、1 倍分辨率，约 2 分钟
NODE_PATH=$(npm root -g) node promo-video/record.cjs promo-video/frames/final 30 0 62.6 2   # 成片：30 帧/秒、2 倍分辨率，约 15 分钟
sh promo-video/music/prepare.sh                # 配乐：先把音乐放到 music/track.mp3；测节拍、剪到片长、淡出、统一响度
sh promo-video/encode.sh                       # 输出 out/…-1080p-music.mp4 和 …-4k-music.mp4（没有配乐时是静音版）
```

参数：`record.cjs <输出目录> <帧率> <从第几秒开始保存> <到第几秒> <分辨率倍数>`。只改了某一段时，可以只重渲那几秒（前面的时间照样推进、不保存），覆盖到同一个目录再合成。

## 30 秒版

```
sh promo-video/music/prepare30.sh             # 剪出 30 秒配乐（music30.wav）并测出节拍（beats30.json）
TL=timeline-30 NODE_PATH=$(npm root -g) node promo-video/record.cjs promo-video/frames/f30 30 0 29.39 2
```

合成：`FRAMES=frames/f30 MUSIC=music/music30.wav NAME=30s sh promo-video/encode.sh`

## 30 秒版 · 新配乐（带音效）

```
sh promo-video/music/prepare30b.sh             # 新音乐放到 music/track2.mp3：拟合节拍、拼出 30 秒配乐、核对重拍位置
TL=timeline-30b SFX_LOG=promo-video/music/sfx30b.json NODE_PATH=$(npm root -g) node promo-video/record.cjs promo-video/frames/f30b 30 0 29.6 2
sh promo-video/music/prepare30b.sh mix promo-video/music/sfx30b.json    # 合成音效、混音、-14 LUFS → music/mix30b.wav
FRAMES=frames/f30b MUSIC=music/mix30b.wav NAME=30s-b sh promo-video/encode.sh
```

## 30 秒亮点版（给上级汇报，timeline-30c）

同一首新配乐、同样的小节，按团队整理的九个亮点重新剪：动态天气与清晰地图、按专业 / 按生活选房、公寓列表筛选、多房对比、报价拆解（正着拆 + 按总预算反着算）、二维码进群、顺利入住，片尾一台手机变形成折叠屏再变成平板（`engine.js` 的 `S.morph`）。

```
TL=timeline-30c SFX_LOG=promo-video/music/sfx30c.json NODE_PATH=$(npm root -g) node promo-video/record.cjs promo-video/frames/c30 30 0 29.626 2
sh promo-video/music/prepare30b.sh mix promo-video/music/sfx30c.json mix30c.wav
FRAMES=frames/c30 MUSIC=music/mix30c.wav NAME=30s-highlights sh promo-video/encode.sh
```

## 竖版 9:16（1080×1920）

两个 30 秒版都有竖版，时间线、配乐、音效完全一样，只是舞台换成竖的（`PORTRAIT=1`，页面参数 `?p=1`）：
手机放大居中，标题都居中放在手机上方，镜头只保留推近的幅度；片尾平板在上、手机在左前、折叠屏在右下。

```
PORTRAIT=1 TL=timeline-30b NODE_PATH=$(npm root -g) node promo-video/record.cjs promo-video/frames/p30b 30 0 29.626 2
PORTRAIT=1 FRAMES=frames/p30b MUSIC=music/mix30b.wav NAME=30s-b-vertical sh promo-video/encode.sh
PORTRAIT=1 TL=timeline-30 NODE_PATH=$(npm root -g) node promo-video/record.cjs promo-video/frames/p30 30 0 29.4 2
PORTRAIT=1 FRAMES=frames/p30 MUSIC=music/music30.wav NAME=30s-vertical sh promo-video/encode.sh
```

## 按配乐剪辑

`stage/timeline.js` 开头的 `BEATS` 是 `music/analyze.py` 测出的每一拍的时间，镜头切换写成 `bar(n)`（第 n 小节第一拍）、点按写成 `beat(n)`，所以都卡在拍子上。答题的两段用 `S.speed(…, 1.5)` 让网页翻页快 1.5 倍，再加上每拍答一题。

## 为什么每次录出来都一样、而且很顺

- 网页里的计时器和 `requestAnimationFrame` 用 Playwright 的假时钟，**暂停**着，每帧只往前走 1/30 秒（河面那一段 6 倍速，让渡轮和海鸥看得出在动）。
- CSS 动画和过渡全部暂停，每帧手动推进同样的时间。
- 每帧截图前等字体下载完，不会闪出系统字体。
- 天气固定为「利物浦 12° 下雨」（拦截天气接口），手机状态栏时间固定 9:41。
- 网页的 `env(safe-area-inset-*)` 在 iframe 里是 0，舞台载入网页后换成真机的刘海和底部横条高度。
