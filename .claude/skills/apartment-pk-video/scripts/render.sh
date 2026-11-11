#!/bin/sh
# 录制 + 混音 + 合成。仓库根目录运行。
#   草稿：sh .claude/skills/apartment-pk-video/scripts/render.sh ep02 draft
#         每秒 6 帧、1 倍分辨率，约 2 分钟；输出联系表 promo-video/out/<期号>-draft-sheet-*.png 用来检查排版
#   成片：sh .claude/skills/apartment-pk-video/scripts/render.sh ep02 final
#         每秒 30 帧、1.5 倍分辨率，分三段同时录（约 15 分钟）；补齐分段交界的帧；配乐垫底 + 旁白 + 音效，响度 -16 LUFS；
#         输出 promo-video/out/apartment-pk-<期号>-1080x1920.mp4
# 需要：node + 全局 playwright（Chromium）、ffmpeg、python3（numpy scipy soundfile pillow）、promo-video/fonts（sh promo-video/fetch-fonts.sh）
set -e
EP=$1; MODE=${2:-draft}; [ -n "$EP" ] || { echo "用法：render.sh <期号> draft|final"; exit 1; }
HERE=$(cd "$(dirname "$0")" && pwd); PV=promo-video
[ -f $PV/stage/timeline-$EP.js ] || { echo "缺少 $PV/stage/timeline-$EP.js"; exit 1; }
[ -f $PV/stage/$EP-cues.json ] || { echo "缺少旁白时间，先跑 voice.sh $EP"; exit 1; }
[ -d $PV/fonts/noto-sans-sc ] || sh $PV/fetch-fonts.sh
curl -sf -o /dev/null http://localhost:8780/web/index.html || { setsid nohup node $PV/server.cjs > /tmp/pk-server.log 2>&1 < /dev/null & sleep 1; }
END=$(python3 -c "import json,math;print(math.ceil((json.load(open('$PV/stage/$EP-cues.json'))['voiceEnd']+3.4)*30)/30)")
export PORTRAIT=1 FS=1 TL=timeline-$EP PRE=300 NODE_PATH=$(npm root -g)
mkdir -p $PV/out
if [ "$MODE" = draft ]; then
  rm -rf $PV/frames/$EP-draft
  node $PV/record.cjs $PV/frames/$EP-draft 6 0 $END 1 | grep -v 'http 404' || true
  python3 - "$EP" "$END" "$HERE" <<'PY'
import json, subprocess, sys
ep, end, here = sys.argv[1], float(sys.argv[2]), sys.argv[3]
c = {x['id']: x for x in json.load(open(f'promo-video/stage/{ep}-cues.json'))['cues']}
mid = lambda i: round((c[i]['t0'] + c[i]['t1']) / 2, 2)
rows = [[c['hook']['cap'][3]['t'] + 0.5, mid('open'), c['count']['t1'] - 0.3, c['sort']['cap'][1]['t'] + 0.4, c['sort']['cap'][2]['t'] + 0.5],
        [c['gap']['t1'] - 0.2, c['dist']['t1'] - 0.2, c['rate']['t1'] - 0.2, c['life']['t1'] - 0.2, c['verdict']['t1'] - 0.2, end - 1]]
for i, ts in enumerate(rows):
    subprocess.run(['python3', f'{here}/sheet.py', f'promo-video/frames/{ep}-draft', '6', f'promo-video/out/{ep}-draft-sheet-{i + 1}.png'] + [str(round(t, 2)) for t in ts], check=True)
PY
  exit 0
fi
# 成片：三段同时录，最后一段写音效时间表（录到片尾，所有音效都会经过）
F=$PV/frames/$EP; rm -rf $F
A=$(python3 -c "print(round($END/3,4))"); B=$(python3 -c "print(round($END*2/3,4))")
node $PV/record.cjs $F 30 0 $A 1.5 > /tmp/pk-rec1.log 2>&1 &
node $PV/record.cjs $F 30 $A $B 1.5 > /tmp/pk-rec2.log 2>&1 &
SFX_LOG=$PV/episodes/$EP/sfx.json node $PV/record.cjs $F 30 $B $END 1.5 > /tmp/pk-rec3.log 2>&1
wait
python3 - "$F" "$END" <<'PY'
import os, shutil, sys
d, end = sys.argv[1], float(sys.argv[2]); n = round(end * 30)
have = {int(f[:5]) for f in os.listdir(d)}
for i in range(1, n + 1):   # 分段交界可能差一帧：用前一帧补上
    if i not in have:
        shutil.copy(f'{d}/{i - 1:05d}.jpg', f'{d}/{i:05d}.jpg'); have.add(i); print('filled frame', i)
PY
E=$PV/episodes/$EP
# 配乐垫底：开场轻（强度 2），筛选开始后满（3），片名处收（1）
SEG=$(python3 -c "import json;c=json.load(open('$PV/stage/$EP-cues.json'))['cues'];o=c[1]['t0'];e=$END;print(f'0:0.3:0,0.3:{o}:2,{o}:{e-3.6:.2f}:3,{e-3.6:.2f}:{e}:1')")
python3 -I $PV/music/compose.py $E/bed.wav $END "$SEG"
ffmpeg -y -loglevel error -i $E/voice.wav -i $E/bed.wav -filter_complex "[0:a]apad=whole_dur=$END[v];[1:a]volume=0.2[b];[v][b]amix=inputs=2:duration=first:normalize=0,aresample=48000[o]" -map "[o]" -ac 2 $E/pre.wav
(cd $PV/music && python3 -I mix.py ../episodes/$EP/pre.wav ../episodes/$EP/sfx.json ../episodes/$EP/raw.wav)
ffmpeg -y -loglevel error -i $E/raw.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" -ac 2 $E/mix.wav
ffmpeg -y -loglevel error -framerate 30 -i $F/%05d.jpg -i $E/mix.wav -shortest -vf "scale=1080:1920:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset medium -crf 18 -profile:v high -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart -c:a aac -b:a 192k \
  $PV/out/apartment-pk-$EP-1080x1920.mp4
rm -f $E/pre.wav $E/raw.wav
echo "成片：$PV/out/apartment-pk-$EP-1080x1920.mp4（$END 秒）"
