#!/bin/sh
# 配乐：把音乐文件放到 promo-video/music/track.mp3，然后运行本脚本。
# 1) 测节拍（analyze.py → beats.json，downbeats.py → grid.json，打印每小节第一拍的时间，用来写 stage/timeline.js 里的 BEATS）
# 2) 剪到片长、最后 3 秒淡出、响度统一到 -14 LUFS（视频平台通用），输出 music-62.wav 给 encode.sh 用
# 需要：pip install librosa soundfile；ffmpeg
set -e
cd "$(dirname "$0")"
LEN=${LEN:-62.6}
python3 -I analyze.py track.mp3
python3 -I downbeats.py
M=$(ffmpeg -hide_banner -i track.mp3 -t $LEN -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
v() { echo "$M" | sed -n "s/.*\"$1\" : \"\([^\"]*\)\".*/\1/p"; }
ffmpeg -hide_banner -loglevel error -y -i track.mp3 -t $LEN -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(v input_i):measured_TP=$(v input_tp):measured_LRA=$(v input_lra):measured_thresh=$(v input_thresh):offset=$(v target_offset):linear=true,afade=t=out:st=$(awk "BEGIN{print $LEN-3}"):d=3,aresample=48000" -c:a pcm_s16le music-62.wav
echo "music-62.wav ready"
