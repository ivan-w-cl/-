# 公寓 PK 系列（竖屏，带旁白）

每期一个问题：在地图里真实筛选，筛出两栋，再用数据画面对比。画面沿用宣传片的舞台和录制脚本（`../stage`、`../record.cjs`），多了旁白和字幕。

| 文件 | 内容 |
|---|---|
| `ep01/script.json` | 第 1 期旁白：每句的朗读文本 `say`、字幕分段 `cap`、句后停顿 `gap` |
| `tts.py` | 把旁白合成男声（离线模型 Kokoro，说话人 `zm_yunyang`），输出 `ep01/voice.wav` 和 `../stage/ep01-cues.json`（每句起止时间） |
| `../stage/timeline-ep01.js` | 第 1 期的镜头：网页操作、字幕、数据画面。时间全部跟着 `ep01-cues.json` 走，改旁白不用改镜头时间 |

## 第 1 期：同样 10 分钟到利大、都带独卫，最便宜的两栋每周差 £37，差在哪？

筛选条件和网页一致：筛选 → 房型「独卫单间」→ 步行到利物浦大学「10 分钟」→ 47 栋剩 9 栋 → 排序「独卫单间最便宜」→ 第 1 名 Europa £95/周、第 2 名 Prospect Point £132/周。
数据来自 `data/homes.json` 和网页里的 `PRICES`（Amber 平台起价，2026-10-17 核对）。价格更新后要重新核对再发。

## 重新生成

```
# 1. 旁白（第一次要下载模型，约 350 MB）
curl -L -O https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2 && tar xjf kokoro-multi-lang-v1_0.tar.bz2
pip install sherpa-onnx soundfile scipy
KOKORO=$PWD/kokoro-multi-lang-v1_0 python3 promo-video/episodes/tts.py ep01        # 换声音：最后加说话人编号 49 / 50 / 51 / 52

# 2. 画面（片长看 tts.py 生成的 voiceEnd + 3.4 秒）
node promo-video/server.cjs &
PORTRAIT=1 FS=1 TL=timeline-ep01 PRE=300 NODE_PATH=$(npm root -g) node promo-video/record.cjs promo-video/frames/ep01 30 0 70.2 1.5

# 3. 配乐垫底 + 混音 + 合成
cd promo-video
python3 -I music/compose.py episodes/ep01/bed.wav 70.2 "0:0.4:0,0.4:10.2:1,10.2:25.4:2,25.4:60:3,60:67:2,67:70.2:1"
ffmpeg -y -i episodes/ep01/voice.wav -i episodes/ep01/bed.wav -filter_complex "[0:a]apad=whole_dur=70.2[v];[1:a]volume=0.16[b];[v][b]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[o]" -map "[o]" -ac 2 episodes/ep01/mix.wav
PORTRAIT=1 FRAMES=frames/ep01 MUSIC=episodes/ep01/mix.wav NAME=ep01 sh encode.sh
```

## 做下一期

复制 `ep01/script.json` 和 `timeline-ep01.js`，改三处：筛选条件（网页操作那一段）、`DATA`（两栋的数字）、旁白。先在网页里实际筛一遍，确认筛出来的就是要比的两栋。
