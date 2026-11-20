# 案件档案 · 多参加一场面试，到底有没有用？

中文版升学科普短视频，沿用英文版的"案件档案"创意，用 Remotion 制作。竖屏 1080×1920，30 fps，约 1 分 51 秒。画面、字幕、配音全部是中文。

## 创意
把家长的问题当成一桩"案子"来调查：
- 官方简章是**证物**（证物甲—丁）：直接引用简章中文原文，用荧光笔划出关键字；
- 假设算例在白板上**还原案情**，盖"假设算例"章；
- 真实产品画面作为**查证照片**钉在板上；
- 得出**结论一 / 结论二**，最后给出结论，盖"结案"章。

画面底部的标签区分四类内容：
- **证物 · 官方规定**：附依据（学校 · 年份 · 省份简章）；
- **还原 · 假设算例**：不预测任何人的录取结果；
- **办案笔记 · 我们的解读**：esssouth 整理，与学校无官方合作关系；
- **查证 · 真实产品画面**：网页测试版，演示账号。

## 结构
| 段落 | 内容 | 产品画面 |
|---|---|---|
| open | 家长的便签提问，立案 | — |
| exhibitA | 西浦 2026 江苏：满分 100，高考 65%，面试 35% | — |
| recon | 假设：学生甲 600 + 90，学生乙 615 + 70 | — |
| tool1 | 计算器查证：83.50 对 77.80 | 计算器 |
| finding1 | 面试是可以靠准备拿到的分数 | — |
| caveats | 算例不预测录取；要先过特殊类型招生控制线 | — |
| exhibitBC | 西浦、港中深：没被综评录取不影响后续批次 | — |
| jurisdiction | 广东：65 / 30 / 5，5 月 20 日截止 | 切换省份 |
| calendar | 4 月报名，高考后不久面试 | — |
| exhibitD | 面试不考专业知识 → 观点 + because + 理由 | — |
| tool2 | 练习：补上理由后提示消失 | 5 分钟练习 |
| verdict | 多一次评价、多一次机会；报名前先查三件事 | — |

政策依据与前几版相同：西浦、港中深 2026 年江苏、广东官方简章，见 `../esssouth-edu-video-demo-v1/docs/政策来源.md`。

## 配音与音乐
- **配音**：Kokoro v1.0 开源语音模型（Apache-2.0）的中文男声 `zm_yunyang`，原速。选它是因为它的平均音高（约 122 Hz）和英文版的 `am_michael` 一样，听感都是沉稳的男声。中文转音素用 misaki。
- 数字、日期和英文单词，模型读不准时，在 `script.json` 里用 `say` 字段写出读法（例如"五月二十号""一个英文的因为"），字幕仍显示 `t`。
- **音乐**：与英文版相同的原创配乐（`tools/bgm.py`），有配音时音量约为原来的 14%。

## 字体
都在 `public/fonts/`，都是 SIL 开源字体许可：
- Noto Sans SC：标题、正文、字幕；
- Noto Serif SC：印章、标签；
- 站酷快乐体（ZCOOL KuaiLe）：手写便签；
- 拉丁字母和数字沿用英文版的 Archivo Black、Special Elite、Caveat、Nunito。

中文字体是只包含片中用字的子集，体积很小。**改了中文文案后要先运行 `tools/fonts.sh` 重新下载子集**，否则新字会显示成系统字体。

## 修改和渲染
```
npm install
npm run studio                 # Remotion Studio 预览
tools/fonts.sh                 # 改中文文案后重新下载字体子集
/path/to/venv/bin/python -I tools/tts.py kokoro-v1.0.onnx voices-v1.0.bin   # 改文案后重新生成配音
node tools/render.mjs stills   # 每段检查截图
node tools/render.mjs          # 两个 MP4（配音 + 音乐 / 只有配音）、SRT、时间轴
```
- 文案在 `src/script.json`，画面在 `src/CaseFileZh.tsx`。
- 中文配音的 venv 需要 `kokoro-onnx soundfile "misaki[zh]"`。模型文件来自 GitHub 上的 thewh1teagle/kokoro-onnx（model-files-v1.0），体积较大，没有放进仓库。
