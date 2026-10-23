#!/bin/sh
# 30 秒版配乐（节奏不变）：原曲 33.760–56.933 秒（渐强 8 小节 → 无声 1 小节 → 高潮 2 小节）
# 接原曲 150.062 秒起的最后两小节（鼓点 + 收尾的最后一下）和余音，接口在小节第一拍、15 毫秒交叉淡化。
# 剪点都在真实鼓点前几毫秒。两边都是副歌的音色（MFCC 相似度 0.99），听不出接缝。
# 输出 music30.wav（-14 LUFS）和 beats30.json。需要：ffmpeg；pip install librosa soundfile
set -e
cd "$(dirname "$0")"
ffmpeg -hide_banner -loglevel error -y -i track.mp3 -filter_complex \
  "[0:a]atrim=start=33.760:end=56.933,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.006[a];[0:a]atrim=start=150.062:end=156.30,asetpts=PTS-STARTPTS,afade=t=out:st=5.0:d=1.238[b];[a][b]acrossfade=d=0.015:c1=tri:c2=tri,aresample=48000[o]" \
  -map "[o]" -c:a pcm_s16le raw30.wav
M=$(ffmpeg -hide_banner -i raw30.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
v() { echo "$M" | sed -n "s/.*\"$1\" : \"\([^\"]*\)\".*/\1/p"; }
ffmpeg -hide_banner -loglevel error -y -i raw30.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(v input_i):measured_TP=$(v input_tp):measured_LRA=$(v input_lra):measured_thresh=$(v input_thresh):offset=$(v target_offset):linear=true" -c:a pcm_s16le music30.wav
rm -f raw30.wav
python3 -I beats30.py
