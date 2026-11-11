---
name: apartment-pk-video
description: 制作「公寓 PK」竖屏短视频（留学住宿通 · 利物浦学生住宿地图）：在真实地图网页里筛选出两栋公寓，再用数据画面对比价格、步行距离、评分和楼内配置，配男声旁白（1.25 倍速）、字幕和音效，输出 1080×1920 MP4。用户说做新一期公寓 PK、公寓对比视频、两栋公寓比一比、按某个条件筛出两栋做视频，或者要微调已有的某一期（改文案、换数据、换声音、调速度、调镜头）时使用。
---

# 公寓 PK 视频

每一期回答一个学生会问的问题，例如「同样走路 10 分钟到利大、都带独卫，最便宜的两栋每周差 £37，差在哪？」。
画面分两半：前半段是网页的**真实操作**（筛选、排序），观众照着在小程序里点能得到同样的结果；后半段是**数据画面**，最后回到地图引导去用。

第 1 期（快版）就是模板：
- 镜头：`promo-video/stage/timeline-ep01b.js`（所有每期要改的东西都在顶部的 `EP` 一块里）
- 旁白：`promo-video/episodes/ep01b/script.json`
- 成片：`promo-video/out/apartment-pk-ep01-fast-1080x1920.mp4`（不进仓库）

## 原则（每期都要守）

1. **屏幕上的筛选结果必须是真的。** 先用 `check_filter.cjs` 在网页里跑一遍，筛出来的前两名就是要比的两栋；网页只有 5/10/15/20/30/45 分钟这几档。
2. **数字只用仓库里的数据**：`data/homes.json`（步行分钟、评分、评价数、简介）和 `web-live/index.html` 里的 `PRICES`（Amber 起价，有核对日期）。画面底部写明来源和日期。
3. **不编原因。** 公开数据解释不了的差价，就说「解释不了」，并提醒学生该比什么；用户给了内部经验（比如房间小、楼老、合同周数不同）再写进旁白。
4. **内容完整，不留钩子。** 小程序的出现方式是「画面就是在小程序里操作的」，结尾一句引导即可。
5. **旁白要回听。** 我们听不到声音，靠语音识别逐句核对；英文楼名的发音请用户自己听。

## 做新一期

期号用 `ep02`、`ep03`……下面的命令都在仓库根目录跑。

### 1. 定问题，核对筛选

```
NODE_PATH=$(npm root -g) node .claude/skills/apartment-pk-video/scripts/check_filter.cjs room=ensuite walk=10 rank=ensuite
```
看输出的「47 栋 → N 栋」和前两名。好问题的特征：两栋看起来差不多（同区域、同距离、评分接近）但价格差很多，或者反过来。
再从 `data/homes.json` 和 `PRICES` 里取这两栋的数字（价格、到利大 / LJMU / 莱姆街 / 市中心的步行分钟、评分、评价数、楼内配置）。

### 2. 写旁白 `promo-video/episodes/<期号>/script.json`

复制 `ep01b/script.json` 改。**十句的 `id` 和顺序不能变**（镜头按 id 找时间），每句的字幕段数也有要求：

| id | 内容 | 字幕 `cap` 段数 | 镜头卡在哪一段 |
|---|---|---|---|
| hook | 抛问题，说出差价 | 5 | 第 4 段砸下大字，第 5 段盖红章 |
| open | 「筛选。独卫单间。十分钟。」 | 3 | 第 2、3 段分别点两个选项 |
| count | 「四十七栋，只剩 N 栋。」 | 2 | 整句滚动大数字 |
| sort | 排序，报第一名、第二名 | 3 | 第 2、3 段推近两行 |
| gap | 差价 + 两栋离多远 | 3 | 第 1 段标出多出来的一截，第 3 段出现距离 |
| dist | 走到学校、其他目的地 | 4 | 第 1–2 段赛跑，第 3 段出现其他目的地 |
| rate | 评分、评价数 | 2–3 | 整句天平 |
| life | 楼里有什么 | 4 | 第 2 段 A 的配置，第 3–4 段 B 的配置 |
| verdict | 结论 + 订房前比什么 | 5 | 第 2 段大字结论，第 3 段小标题，后面翻卡片 |
| cta | 引导去地图选专业 | 2 | 第 2 段选专业 |

- 每句 `"speed": 1.25`（用户定的速度），`gap` 是句后停顿（0.15–0.5 秒）。
- 数字写成汉字给旁白读（「三十七镑」），字幕里写阿拉伯数字（`£37`），字幕里的数字会自动标红。
- 读快了容易含糊的短语换个说法（第 1 期把「要比的是」改成了「请对比三样」）。

### 3. 生成旁白并回听

```
sh .claude/skills/apartment-pk-video/scripts/voice.sh <期号>          # 默认男声 52（zm_yunyang）；可选 49 / 50 / 51
```
逐句对比「原文」和「听到」：数字、英文楼名识别不准没关系；中文词读错或含糊就改 `script.json` 再跑。总长 = 旁白 + 3.4 秒片名。

### 4. 改镜头

```
cp promo-video/stage/timeline-ep01b.js promo-video/stage/timeline-<期号>.js
```
只改顶部 `EP`：筛选值、A / B 两栋的数据（A = 第 1 名）、开场大字、计数、列表标签、各画面标题、走路比赛的目的地和三行、结论三行和三张卡片、片尾选的专业、数据来源。旁白时间文件按期号自动找，不用改。

### 5. 草稿 → 检查 → 成片

```
sh .claude/skills/apartment-pk-video/scripts/render.sh <期号> draft     # 约 2 分钟，出两张联系表
sh .claude/skills/apartment-pk-video/scripts/render.sh <期号> final     # 约 15 分钟，出 MP4
```
草稿看 `promo-video/out/<期号>-draft-sheet-1.png` 和 `-2.png`：字有没有重叠、推近时有没有把关键字裁掉、筛选结果是不是那两栋。改完再出成片，用 SendUserFile 发给用户。

## 常见微调

| 想改 | 改哪里 |
|---|---|
| 旁白文字、字幕分段、停顿 | `script.json`，然后重跑 voice.sh（镜头时间自动跟着变） |
| 语速 | 每句 `speed`（整体 1.25；个别句子含糊就 1.15–1.2） |
| 换声音 | `voice.sh <期号> 49`（云健）/ `50`（云希）/ `51`（云夏）/ `52`（云扬，默认） |
| 推近多少 | `EP.zoom`（filter 筛选项、button 查看按钮、rank 排名行、subject 选专业） |
| 某个画面的标题、文案 | `EP.price` / `EP.race` / `EP.rate` / `EP.life` / `EP.verdict` |
| 片名 | `EP.end` |
| 背景音乐音量 | render.sh 里 `[1:a]volume=0.2`（0.15 更轻，0.25 更响） |
| 音效 | timeline 里的 `S.sfx(时间, 名字, 音量)`；名字：tick / tick-s / pop / whoosh / whoosh-up / ding / hit |
| 颜色 | timeline 里 CSS：`#1f6f8b` 蓝（A）、`#c2522f` 红（B 和强调）、`#2c8a57` 绿（相同 / 平局） |
| 画面停留更久 | 在 `script.json` 对应句子加大 `gap`，或者加一句旁白 |

## 文件

- `scripts/check_filter.cjs`：在网页里跑筛选，打印结果
- `scripts/voice.sh`、`scripts/check_voice.py`：合成旁白、逐句回听
- `scripts/render.sh`、`scripts/sheet.py`：草稿联系表、成片（分段录制、补帧、配乐、音效、响度、编码）
- 仓库里的：`promo-video/episodes/tts.py`（合成旁白、算每句时间）、`promo-video/record.cjs`（逐帧录屏）、`promo-video/stage/engine.js`（点按、镜头、标注）、`promo-video/music/compose.py`（原创配乐）、`promo-video/music/mix.py`（合成音效）

声音模型：Kokoro 多语言（语音合成）、SenseVoice（语音识别），都是 sherpa-onnx 的离线模型，第一次运行 voice.sh 时下载到 `~/.cache/apartment-pk`。
