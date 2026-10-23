#!/bin/sh
# 帧序列 → MP4：1080p（主版本）和 4K。带一条静音音轨，方便剪映 / 视频号等直接替换配乐。
set -e
cd "$(dirname "$0")"
IN=frames/final/%05d.jpg
ffmpeg -y -loglevel error -framerate 30 -i $IN -f lavfi -i anullsrc=r=48000:cl=stereo -shortest \
  -vf "scale=1920:1080:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 16 -profile:v high -tune film \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart -c:a aac -b:a 128k out/liverpool-student-map-promo-1080p.mp4
ffmpeg -y -loglevel error -framerate 30 -i $IN -f lavfi -i anullsrc=r=48000:cl=stereo -shortest \
  -vf "format=yuv420p" -c:v libx264 -preset slow -crf 18 -profile:v high -tune film \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart -c:a aac -b:a 128k out/liverpool-student-map-promo-4k.mp4
ls -la out/
