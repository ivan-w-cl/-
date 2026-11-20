---
name: esssouth-casefile-video
description: Make esssouth "Case File" (案件档案) admissions explainer videos with Remotion — 1080×1920 vertical shorts where a parent's question is investigated like a case on a corkboard, official brochures are exhibits, a hypothetical is reconstructed, real product screens are pinned as "tool check" photos, and a verdict closes the file. English or Chinese voiceover via the open-source Kokoro TTS model. Use when asked for a Case File / 案件档案 style video, a Remotion admissions explainer, or a new topic "像英文版那样" for esssouth.
---

# esssouth 案件档案视频（Remotion）

样片和模板就是这个包里的 `项目源码/`（英文版）。中文版在仓库的 `esssouth-edu-video-casefile-zh/`。新选题从复制模板开始，不要从零写。
内容规则（政策核实、产品画面、禁用词）以 `references/esssouth-制作标准（通用）.md` 为准，本文件只补充"案件档案"这一形式和 Remotion 流程。

## 创意结构（12 段，约 2 分钟）
| 段 | 作用 | 画面道具 |
|---|---|---|
| open | 家长的问题写在便签上；打开卷宗 | 便签、档案夹、"OPEN/立案"章 |
| exhibitA | 第一条官方依据（计分方式等） | 证物纸 + 荧光笔 + 手写示意图 |
| recon | 假设算例 | 白板 + 两个学生卡片 + "HYPOTHETICAL/假设算例"章 |
| tool1 | 用真实产品验证算例 | 钉住的产品截图（查证照片）+ 便签结果 |
| finding1 | 结论一 | 大字结论纸 |
| caveats | 限制条件、门槛 | "不预测录取"章 + 简章原文 + 放大镜 |
| exhibitBC | 第二、三条依据（多校对照） | 两张证物 + 红线连到结论二 |
| jurisdiction | 省份 / 年份差异 | 省份标签页 + 切换省份的真实画面 |
| calendar | 时间成本 | 日历格子 + 红圈 |
| exhibitD | 面试考什么 → 准备方法 | 简章原文 + 便签公式 |
| tool2 | 真实练习操作 | 练习截图 + "练习提示 · 不是评分"章 |
| verdict | 结论 + 报名前检查清单 | 勾选清单 + "CASE CLOSED/结案"章 |

新选题可以增删段落，但要保留：证物（官方原文）→ 还原（假设）→ 查证（真实产品）→ 结论 这条线。

## 内容标签（画面底部，每句都有）
`script.json` 每行的 `kind` 决定标签：
- `policy` → EVIDENCE / 证物 · 官方规定，自动附上该段 `src` 的简称（学校 · 年份 · 省份）；
- `example` → RECONSTRUCTION / 还原 · 假设算例（不预测录取）；
- `advice` → CASE NOTE / 办案笔记 · 我们的解读（esssouth 整理，与学校无官方合作关系）；
- `product` → TOOL CHECK / 查证 · 真实产品画面（网页测试版 · 演示账号）。

证物上的文字：中文版直接引用简章原文，用「」括起来；只是整理要点时，写"简章要点"，不能写成"原文"。英文版标"translated"。

## 文件和数据流
```
src/script.json      文案：scenes[].lines[] = { kind, t, say? }；[[ ]] = 荧光笔高亮；sources = { key: [全称, 链接, 简称] }
tools/tts.py         Kokoro 逐行生成 public/voice/SxxLy.wav 和 src/durations.json
src/timeline.js      按配音实际时长排时间轴：LEAD 0.6s，句间 GAP 0.32s，EXTRA 给产品段留尾；字幕按标点切段
src/CaseFile.tsx     全部画面（Sheet / Stamp / Hi / Hand / String_ / Kid / ToolPhoto），一切只由当前帧决定
src/capture-meta.json + public/capture/   真实产品截图（每帧附点击坐标 tap，scale = 1080/390）
tools/render.mjs     渲染两个 MP4（配音+音乐 / 只有配音）、SRT、timeline.json；`stills` 参数只出每段检查图
tools/bgm.py         原创背景音乐（有配音时音量 0.14）
```

## 流程
1. **核实政策**（按通用标准）：官网、简章、考试院；记录链接、年份、省份、核对日期、PDF 的 SHA-256。
2. **写 script.json**，先给用户看分镜和文案再做画面。英文 1.25 倍语速约 2.4 词/秒；中文原速约 4.5 字/秒。目标 100–125 秒。
3. **生成配音**：
   - 环境：`python -m venv venv && venv/bin/pip install kokoro-onnx soundfile "misaki[zh]"`；模型 `kokoro-v1.0.onnx`、`voices-v1.0.bin` 来自 GitHub thewh1teagle/kokoro-onnx 的 release `model-files-v1.0`。
   - 运行：`venv/bin/python -I tools/tts.py kokoro-v1.0.onnx voices-v1.0.bin`。
   - 声音：英文 `am_michael`（沉稳美式男声，speed 1.25）；中文 `zm_yunyang`（平均音高约 122 Hz，与 am_michael 相同，speed 1.0）。**换声音前先告诉用户，不要静默替换。**
   - 中文：数字日期、百分号、英文单词读不准时，在该行加 `say` 写出读法（"五月二十号""百分之六十五"），字幕仍显示 `t`；tts.py 发现没转成音素的汉字会报错停下。学生代号用"甲/乙"，不用 A/B。
4. **画面**：改 `SCENES` 里对应段落。动画时间用 `L[i]`（第 i 句开始）或中文版的 `W(sc, i, '词')`（按字数估算某词被读到的时刻），让高亮和道具跟着旁白出现。
5. **产品画面声画同步**：`ToolPhoto` 的 `anchors = [[帧序号, 场景内秒数], …]` 把"结果帧"放在旁白说出结果的时刻，前面的打字帧按 `dt` 紧排。只用真实截图，只加点击圈。
6. **检查**：`node tools/render.mjs stills` → 拼成联系表逐张看：文字溢出、遮挡、孤字换行、红线是否连到纸上、印章是否盖住正文。
7. **渲染**：`node tools/render.mjs`（两版约 20–40 分钟，放后台）。用 ffprobe 核对时长，用 volumedetect 核对音量。
8. **交付**：在线页（`online/index.html`，可切换"配音 + 音乐 / 只有配音"）；在线用的副本用 `ffmpeg -crf 25 -preset slow -movflags +faststart` 压到 15 MB 以下；附 README、SRT、文字稿。

## 已踩过的坑
- **字体必须放本地**：无头浏览器经代理访问 fonts.gstatic.com 会证书报错。用 curl 下载 woff2 到 `public/fonts`，用 `@remotion/fonts` 的 `loadFont` 加载。中文字体用 Google Fonts 的 `&text=` 参数只下载用到的字（中文版 `tools/fonts.sh`）；**改中文文案后要重跑**。
- 所有 `@remotion/*` 版本必须完全一致（4.0.539，`--save-exact`），否则会报 `startFontLoad is not a function`。
- 渲染浏览器：`/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`，`chromiumOptions: { gl: 'swangle' }`。
- 字幕切段时 `[[ ]]` 可能被切开，timeline.js 里有平衡处理；中文按 `，。；：？！` 切，`captionMax` 28；字幕容器加 `text-wrap: balance`，避免末行只剩一个字。
- 只有一个字重的中文字体（如站酷快乐体），声明 `weight: '400 700'`，避免浏览器加粗时笔画糊掉。
- 产品画面要是落后于旁白，就调 anchors，不要整体平移。
