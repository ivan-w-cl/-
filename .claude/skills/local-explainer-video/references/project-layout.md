# 工程结构和命令

## 结构

    promo-video/
      explainers/
        ep01-weather/          ← 第一期，作为模板
          script.json          旁白：一句一行，按场景分组；音色、语速、语言
          tts.py               生成配音和每句起止时间（Kokoro）
          scenes.js            全部画面；顶部 TXT 表是画面文字
          build.py             合成时间表、拆分长字幕、计算日出日落
          audio/               voice.wav、timing.json、两份 SRT、音效时间表
          SOURCES.md           事实、素材、配音、音乐来源
          README.md            这一期的重新生成步骤
      stage/                   录制舞台和引擎；build.py 把时间表写到 stage/timeline-<期号>.js
      record.cjs               逐帧录制
      server.cjs               本地服务器（WEB_ROOT 指向离线 Web 包）
      music/                   背景音乐、音效合成与混音脚本
      fonts/                   画面字体

## 新建一期

1. 复制 `explainers/ep01-weather/` 为 `explainers/epNN-<主题>/`。
2. 改 `script.json`：标题和各场景旁白。场景 id 自己取，产品中插的场景 id 保持 `insert`。
3. 改 `scenes.js`：
   - `TXT` 表换成新一期的画面文字；
   - `SCENES` 里每个场景 id 对应一个绘图函数，函数名和 `script.json` 的场景 id 一致；
   - 文件末尾的产品中插部分换成新功能的真实操作。
4. 改 `build.py` 里输出的时间表文件名（`timeline-epNN.js`），删掉用不上的计算。
5. 新建 `SOURCES.md`。

## 命令

在这一期的文件夹里运行：

    # 配音和时间（模型文件：github.com/thewh1teagle/kokoro-onnx 的 Releases，kokoro-v1.0.onnx 和 voices-v1.0.bin）
    python3 tts.py <kokoro-v1.0.onnx> <voices-v1.0.bin> script.json audio

    # 时间表和字幕
    python3 -I build.py

    # 本地服务器
    WEB_ROOT=<离线Web包目录> PORT=8781 node ../../server.cjs &

    # 草稿：每秒 5 帧、半分辨率，用来抽帧检查
    PORT=8781 PORTRAIT=1 DK=1 DKSTART=phone TL=timeline-ep01 PRE=300 DATE=2026-11-03T12:00:00Z node ../../record.cjs <草稿帧目录> 5 0 <总时长> 0.5

    # 正式：带字幕
    PORT=8781 PORTRAIT=1 DK=1 DKSTART=phone TL=timeline-ep01 PRE=300 DATE=2026-11-03T12:00:00Z SFX_LOG=audio/sfx.json node ../../record.cjs <帧目录A> 30 0 <总时长> 1

    # 正式：不带字幕
    PORT=8781 PORTRAIT=1 DK=1 DKSTART=phone TL=timeline-ep01 EXTRA='&nocap=1' PRE=300 DATE=2026-11-03T12:00:00Z node ../../record.cjs <帧目录B> 30 0 <总时长> 1

`DATE` 是网页里的「现在」，固定它可以让每次录出来的界面一致。两遍正式渲染可以同时跑。

## 混音

- 音效：`python3 -I ../../music/mix.py <静音.wav> audio/sfx.json <音效.wav>`。
- 音乐：截到总时长，开头淡入 0.8 秒，结尾淡出 3 秒，用人声做侧链压缩。
- 成片音轨：人声 + 音乐 + 音效，`loudnorm=I=-14:TP=-1.5`。
- 无音乐版：人声 + 音效。干净画面版：音乐 + 音效，不含人声。
- 用 ffmpeg 把帧序列和音轨合成 H.264 MP4（`-crf 18`，`yuv420p`，`+faststart`）。

## 画面代码里常用的写法

- `LN(id)`：某个场景的全部旁白句子；`L[i].start` 是第 i 句开始的时间。
- `ramp(t, t0, d)`：从 t0 开始、用 d 秒从 0 平滑变到 1，用来控制元素出现。
- `head(T, a)`：画小标题和大标题；`src(文字, a)`：画来源小字。
- 产品中插：
  - `S.tap(时间, 选择器)`：点按；
  - `S.slide(开始, 结束, 选择器, 从, 到)`：拖滑块；
  - `S.scroll(...)`：滚动；
  - `S.note(开始, 结束, 选择器, 文字)`：标注；
  - `S.mark(...)`：高亮框；
  - `S.cam(...)`：镜头。
- 选择器找不到元素时录制日志会报警告。草稿阶段要清零。
