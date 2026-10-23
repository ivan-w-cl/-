#!/bin/sh
# 帧序列 + 配乐 → MP4：1080p（主版本）和 4K。
#   默认（62.6 秒版）：sh encode.sh
#   30 秒版：FRAMES=frames/f30 MUSIC=music/music30.wav NAME=30s sh encode.sh
# 没有配乐文件时用静音音轨。
set -e
cd "$(dirname "$0")"
FRAMES=${FRAMES:-frames/final}; MUSIC=${MUSIC:-music/music-62.wav}; NAME=${NAME:-full}
mkdir -p out
if [ -f "$MUSIC" ]; then A="-i $MUSIC"; AN=music; else A="-f lavfi -i anullsrc=r=48000:cl=stereo"; AN=silent; fi
for v in 1080p 4k; do
  if [ $v = 1080p ]; then VF="scale=1920:1080:flags=lanczos,format=yuv420p"; CRF=16; else VF="format=yuv420p"; CRF=18; fi
  ffmpeg -y -loglevel error -framerate 30 -i "$FRAMES/%05d.jpg" $A -shortest -vf "$VF" -c:v libx264 -preset slow -crf $CRF -profile:v high -tune film \
    -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart -c:a aac -b:a 256k "out/liverpool-student-map-promo-$NAME-$v-$AN.mp4"
done
ls -la out/
