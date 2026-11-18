#!/bin/sh
# After set-voice + export: lays each voice/<lineId>.wav at its start time from out/配音时间轴.json under the video.
# Usage: sh tools/mix-voice.sh   → out/综评到底多给了考生什么机会-配音-配乐.mp4 and -配音-无配乐.mp4
cd "$(dirname "$0")/.." || exit 1
N=综评到底多给了考生什么机会
node -e '
const tl=require("./out/配音时间轴.json"),fs=require("fs");const ins=[],f=[];let k=0;
tl.lines.forEach(l=>{for(const e of ["wav","mp3"]){const p="voice/"+l.id+"."+e;if(fs.existsSync(p)){ins.push("-i",p);f.push(`[${k+1}:a]adelay=${Math.round(l.start*1000)}|${Math.round(l.start*1000)}[v${k}]`);k++;break;}}});
fs.writeFileSync("out/.mix.json",JSON.stringify({ins,f,k}));'
ARGS=$(node -e 'const m=require("./out/.mix.json");console.log(m.ins.map(x=>JSON.stringify(x)).join(" "))')
FILT=$(node -e 'const m=require("./out/.mix.json");let s=m.f.join(";")+";"+[...Array(m.k).keys()].map(i=>"[v"+i+"]").join("")+"amix=inputs="+m.k+":normalize=0[voice]";console.log(s)')
eval ffmpeg -y -loglevel error -i "out/$N-无配乐.mp4" $ARGS -filter_complex "\"$FILT\"" -map 0:v -map "[voice]" -c:v copy -c:a aac -b:a 160k -shortest "out/$N-配音-无配乐.mp4"
ffmpeg -y -loglevel error -i "out/$N-配音-无配乐.mp4" -i assets/bgm.wav -filter_complex "[1:a]volume=0.18[b];[0:a][b]amix=inputs=2:duration=first:normalize=0[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k "out/$N-配音-配乐.mp4"
echo done
