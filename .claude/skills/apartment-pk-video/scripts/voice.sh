#!/bin/sh
# 旁白：合成男声 + 逐句用语音识别回听，找出读错、读含糊的句子。
# 用法（仓库根目录）：sh .claude/skills/apartment-pk-video/scripts/voice.sh ep02 [说话人编号，默认 52]
# 第一次会下载两个离线模型到 ~/.cache/apartment-pk（语音合成约 350 MB，语音识别约 230 MB）。
set -e
EP=$1; SID=${2:-52}; [ -n "$EP" ] || { echo "用法：voice.sh <期号> [说话人]"; exit 1; }
HERE=$(cd "$(dirname "$0")" && pwd); M=$HOME/.cache/apartment-pk; mkdir -p "$M"
REL=https://github.com/k2-fsa/sherpa-onnx/releases/download
[ -d "$M/kokoro-multi-lang-v1_0" ] || (cd "$M" && curl -sSL $REL/tts-models/kokoro-multi-lang-v1_0.tar.bz2 | tar xj)
[ -d "$M/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17" ] || (cd "$M" && curl -sSL $REL/asr-models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17.tar.bz2 | tar xj)
python3 -c "import sherpa_onnx, soundfile, scipy" 2>/dev/null || pip install -q sherpa-onnx soundfile scipy
KOKORO="$M/kokoro-multi-lang-v1_0" python3 promo-video/episodes/tts.py "$EP" "$SID"
python3 "$HERE/check_voice.py" "$EP"
