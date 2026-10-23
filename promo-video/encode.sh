#!/bin/sh
# 帧序列 + 配乐 → MP4：1080p（主版本）和 4K。
# 配乐在 music/music-62.wav（music/prepare.sh 生成）；没有配乐时用静音音轨。
set -e
cd "$(dirname "$0")"
IN=frames/final/%05d.jpg; mkdir -p out
if [ -f music/music-62.wav ]; then A="-i music/music-62.wav"; AN=music; else A="-f lavfi -i anullsrc=r=48000:cl=stereo"; AN=silent; fi
for v in 1080p 4k; do
  [ $v = 1080p ] && VF="scale=1920:1080:flags=lanczos,format=yuv420p" CRF=16 || VF="format=yuv420p" CRF=18
  ffmpeg -y -loglevel error -framerate 30 -i $IN $A -shortest -vf "$VF" -c:v libx264 -preset slow -crf $CRF -profile:v high -tune film \
    -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart -c:a aac -b:a 256k out/liverpool-student-map-promo-$v-$AN.mp4
done
ls -la out/
