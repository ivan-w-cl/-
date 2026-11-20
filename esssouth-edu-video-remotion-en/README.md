# 英文版 · What does comprehensive evaluation actually give you?

这是《综评到底多给了考生什么机会？》的英文 Remotion 版本，英文文案、英文配音。竖屏 1080×1920，30 fps，约 2 分钟。

## 交付物（`out/`）
| 文件 | 说明 |
|---|---|
| `What-does-comprehensive-evaluation-give-you-music.mp4` | 英文配音 + 背景音乐 |
| `What-does-comprehensive-evaluation-give-you-no-music.mp4` | 只有英文配音 |
| `What-does-comprehensive-evaluation-give-you.srt` | 英文字幕，和画面里的字幕是同一套时间 |
| `timeline.json` | 每行旁白的起止时间 |
| `stills/` | 每一段的检查截图 |

## 配音
- **声音**：Kokoro v1.0 开源语音模型（Apache-2.0 许可，可商用）的 `am_michael`，一个沉稳的美式男声。这是按你的要求从中文火山配音换成的英文声音。
- **语速**：1.2 倍。每行单独生成一个音频文件（`public/voice/S01L1.wav` 等）。画面和字幕按每行的实际时长排布，所以声音和画面始终对齐。
- **换声音**：改 `src/script.json` 里的 `voice`，运行 `python tools/tts.py <模型> <声音文件>` 重新生成，再渲染即可。模型文件来自 GitHub 上的 thewh1teagle/kokoro-onnx（model-files-v1.0），体积较大，没有放进仓库。

## 内容
- 结构、政策数字和三段真实产品画面，都和中文版一致：计算器、切换省份、5 分钟练习。依据同样是西浦、港中深 2026 年江苏、广东官方简章，见中文版的 `docs/政策来源.md`。
- 简章原文是中文。画面里引用的面试评估内容，标注了"translated"（译文）。
- 产品画面是中文界面的真实截图，没有翻译或改动。

## 用 Remotion 修改和渲染
```
npm install
npm run studio          # 打开 Remotion Studio 预览和修改
npm run render          # 渲染两个 MP4、SRT 和时间轴
node tools/render.mjs stills   # 只渲染每段的检查截图
```
- 文案在 `src/script.json`，画面在 `src/Explainer.tsx`，时间轴在 `src/timeline.js`。
- 字体是 Nunito（SIL 开源字体许可），已经放在 `public/fonts/`，渲染时不依赖网络。
- 背景音乐 `public/bgm.wav` 用 `tools/bgm.py` 生成，是原创配乐。
- 渲染用的是本机已有的 Chromium 无头浏览器，路径可以用 `BROWSER` 环境变量指定。
