#!/bin/sh
# 新配乐 30 秒版（AudioEra「Stylish Trailer Percussion」，120 拍/分）：把音乐放到 music/track2.mp3。
# 第 1 步（录制前）：拟合节拍网格、在小节第一拍拼出 29.6 秒配乐（raw30b.wav），打印每小节第一拍。
#   拼接：原曲 0.25–4.55（前奏 2 小节）+ 8.50–24.50（律动 4 + 过门 1 + 强段 3 小节）+ 34.55–40.56（断拍小节 + 重拍后 2 小节）+ 74.58–77.95（最后一小节和余音）
# 第 2 步（录制后，SFX_LOG 写出音效时间表）：sh prepare30b.sh mix <音效时间表.json> [输出文件名，默认 mix30b.wav]
#   合成音效、混进配乐、限幅、统一到 -14 LUFS，输出给 encode.sh 用（亮点版 timeline-30c 同一首配乐：mix sfx30c.json mix30c.wav）。
set -e
cd "$(dirname "$0")"
if [ "$1" = mix ]; then
  OUT=${3:-mix30b.wav}
  ffmpeg -hide_banner -loglevel error -y -i raw30b.wav -af "volume=-6dB" -c:a pcm_s24le music30b-pre.wav
  python3 -I mix.py music30b-pre.wav "$2" mix30b-raw.wav
  I=$(ffmpeg -hide_banner -i mix30b-raw.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n 's/.*"input_i" : "\([^"]*\)".*/\1/p')
  ffmpeg -hide_banner -loglevel error -y -i mix30b-raw.wav -af "volume=$(awk "BEGIN{print -14-($I)}")dB,alimiter=limit=0.84:attack=1:release=60:level=false,aresample=48000" -c:a pcm_s16le "$OUT"
  rm -f music30b-pre.wav mix30b-raw.wav; echo "$OUT ready"
else
  python3 -I fit_grid.py
  python3 -I assemble30b.py
fi
