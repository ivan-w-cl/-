"""完整版配乐：AudioEra「Stylish Trailer Percussion」（120 拍/分，一小节 2.001 秒，原曲小节第一拍 = 0.498 + 2.001·n 秒）
按小节重新排段落，拼成约 1 分 53 秒（段落都从小节第一拍开始、整小节长，接口 6 毫秒淡入淡出，不重叠，所以视频里的小节线一直在网格上）：
  前奏 b0–1 → 律动 A b2–7 → 冲击 b8 → 律动 B b9–16 → 断拍 b17 → 强段 C b18–25 → 强段 D b30–37
  → 律动 B b9–16 → 低段 b26–29 → 断拍 b17 → 强段 C b18–25 → 最后一下 b38 + 余音
用法：python3 -I assemble-full.py [full|60|30]，输出 full-mix-src.wav / mix-src-60.wav / mix-src-30.wav（48 kHz）。60 秒版、30 秒版按同样的段落缩短。视频第 n 小节 = n × 2.00104 + 0.05 秒（第 55 小节是最后一下）。"""
import subprocess
A, BAR = 0.498, 4 * 0.50026
import sys
PLANS = {   # 每段：(原曲第几小节开始, 几小节)
  'full': [(0, 2), (2, 6), (8, 1), (9, 8), (17, 1), (18, 8), (30, 8), (9, 8), (26, 4), (17, 1), (18, 8)],
  '60': [(0, 2), (2, 4), (8, 1), (9, 8), (17, 1), (18, 8), (30, 4)],   # 28 小节 + 最后一下 ≈ 59 秒
  '30': [(0, 1), (2, 2), (9, 4), (17, 1), (18, 4), (30, 2)],           # 14 小节 + 最后一下 ≈ 31 秒
}
KEY = sys.argv[1] if len(sys.argv) > 1 else 'full'
PLAN = PLANS[KEY]
f, labels = [], []
for i, (b, n) in enumerate(PLAN):
    a = A + b * BAR
    f.append(f"[0:a]atrim=start={a:.4f}:duration={n * BAR:.4f},asetpts=PTS-STARTPTS,afade=t=in:d=0.006,afade=t=out:st={n * BAR - 0.006:.4f}:d=0.006[p{i}]")
    labels.append(f"[p{i}]")
tail = A + 38 * BAR
f.append(f"[0:a]atrim=start={tail:.4f},asetpts=PTS-STARTPTS,afade=t=in:d=0.006[p{len(PLAN)}]"); labels.append(f"[p{len(PLAN)}]")
f.append(''.join(labels) + f"concat=n={len(labels)}:v=0:a=1,aresample=48000[o]")
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', 'track2.mp3', '-filter_complex', ';'.join(f), '-map', '[o]', '-c:a', 'pcm_f32le', f'mix-src-{KEY}.wav' if KEY != 'full' else 'full-mix-src.wav'], check=True)
bars = sum(n for _, n in PLAN)
print('bars', bars, 'final hit at %.3f s' % (bars * BAR))
