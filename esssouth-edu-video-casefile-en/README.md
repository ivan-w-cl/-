# Case File · Does the extra interview actually change anything?

英文升学科普短视频，按"案件档案"创意重新设计，用 Remotion 制作。竖屏 1080×1920，30 fps，约 2 分 03 秒。英文文案，英文配音。

## 创意
把家长的问题当成一桩"案子"来调查：
- 官方简章是**证物**（Exhibit A–D）：用荧光笔划出关键原文，原文为中文，画面标注"translated"（译文）；
- 假设算例在白板上**还原案情**，并盖上"HYPOTHETICAL"章；
- 真实产品画面作为**查证照片**钉在板上（TOOL CHECK）；
- 得出 **Finding 1 / 2** 两条结论，最后 **Verdict** 给出判断，盖"CASE CLOSED"章收尾。

画面底部的标签区分四类内容：
- **EVIDENCE**：官方规定，附依据；
- **RECONSTRUCTION**：假设算例；
- **CASE NOTE**：我们的解读；
- **TOOL CHECK**：真实产品画面。

## 结构
| 段落 | 内容 | 用到的产品画面 |
|---|---|---|
| open | 家长的便签提问，打开案卷 | — |
| exhibitA | 西浦 2026 江苏：满分 100，高考 65%，面试 35% | — |
| recon | 假设：A 600 + 90，B 615 + 70 | — |
| tool1 | 计算器查证：83.50 对 77.80 | 计算器 |
| finding1 | 面试是可以靠准备拿到的分数 | — |
| caveats | 算例不预测录取；要先过特殊类型招生控制线 | — |
| exhibitBC | 西浦、港中深：没被综评录取不影响后续批次 | — |
| jurisdiction | 广东：65 / 30 / 5，5 月 20 日截止 | 切换省份 |
| calendar | 4 月报名，高考后不久面试 | — |
| exhibitD | 面试不考专业知识 → 观点 + because + 理由 | — |
| tool2 | 练习：补上理由后提示消失 | 5 分钟练习 |
| verdict | 多一次评价、多一次机会；报名前先查三件事 | — |

政策依据和中文版相同：西浦、港中深 2026 年江苏、广东官方简章，见 `../esssouth-edu-video-demo-v1/docs/政策来源.md`。

## 配音与音乐
- **配音**：Kokoro v1.0 开源语音模型（Apache-2.0）的 `am_michael`，沉稳的美式男声，1.25 倍语速，每行一个文件，存在 `public/voice/`。画面按实际配音时长对齐。
- **音乐**：`tools/bgm.py` 生成的原创小调配乐，有"查案"的氛围。有配音时音量约为原来的 14%。

## 字体
都放在 `public/fonts/`，都是 SIL 开源字体许可：
- Archivo Black：标题；
- Special Elite：打字机风格的标签；
- Caveat：手写笔记；
- Nunito：字幕和正文。

## 修改和渲染
```
npm install
npm run studio                 # Remotion Studio 预览
npm run render                 # 两个 MP4（配音 + 音乐 / 只有配音）、SRT、时间轴
node tools/render.mjs stills   # 每段检查截图
/path/to/venv/bin/python -I tools/tts.py kokoro-v1.0.onnx voices-v1.0.bin   # 改文案后重新生成配音
```
- 文案在 `src/script.json`，画面在 `src/CaseFile.tsx`。
- Kokoro 模型文件来自 GitHub 上的 thewh1teagle/kokoro-onnx（model-files-v1.0），体积较大，没有放进仓库。
