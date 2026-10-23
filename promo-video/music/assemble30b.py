"""新配乐 30 秒版：原曲四段在小节第一拍拼接（15 毫秒交叉淡化），输出 raw30b.wav 和 beats30b.json（视频时间里的每一拍、每小节第一拍、关键鼓点）。"""
import json, subprocess, numpy as np, librosa
PIECES = [(0.25, 4.546), (8.500, 24.500), (34.546, 40.555), (74.584, 77.95)]   # 原曲秒数：前奏 2 小节 / 律动 + 过门 + 强段 8 小节 / 断拍小节 + 重拍后 2 小节 / 最后一小节 + 余音
XF = 0.015
f = []
for i, (a, b) in enumerate(PIECES):
    f.append(f"[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS" + (",afade=t=out:st=%.3f:d=0.8" % (b - a - 0.8) if i == len(PIECES) - 1 else "") + f"[p{i}]")
chain = "[p0][p1]acrossfade=d=%s:c1=tri:c2=tri[x1];[x1][p2]acrossfade=d=%s:c1=tri:c2=tri[x2];[x2][p3]acrossfade=d=%s:c1=tri:c2=tri,aresample=48000[o]" % (XF, XF, XF)
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', 'track2.mp3', '-filter_complex', ';'.join(f) + ';' + chain, '-map', '[o]', '-c:a', 'pcm_s16le', 'raw30b.wav'], check=True)
# 每段在视频里的起点
starts, v = [], 0.0
for i, (a, b) in enumerate(PIECES):
    starts.append(v); v += (b - a) - (XF if i < len(PIECES) - 1 else 0)
total = v
g = json.load(open('grid.json')); A, P = g['a'], g['p']
y, sr = librosa.load('track2.mp3', sr=48000, mono=True); w = int(0.002 * sr)
def hit(t):   # 原曲 t 附近最陡的上升沿
    s = int((t - 0.05) * sr); seg = y[s:int((t + 0.07) * sr)]
    e = np.array([np.sqrt(np.mean(seg[i:i + w] ** 2)) for i in range(0, len(seg) - w, w)]); return (t - 0.05) + int(np.argmax(np.diff(e))) * 0.002
beats, down = [], []   # 视频时间的每一拍（四分音符）和每小节第一拍；每段从它自己的小节第一拍开始，按那一下鼓点的实际时间对齐
for i, (a, b) in enumerate(PIECES):
    k0 = int(round((a - A) / (2 * P)))                      # 这一段开头的那一拍（剪点就在它前面几毫秒）
    if (A + 2 * P * k0) < a - 0.08: k0 += 1                 # 开头不是整拍（第一段从 0.25 秒开始）：取下一拍
    lag = hit(A + 2 * P * k0) - (A + 2 * P * k0) if i != 2 else hit(36.517) - 36.517   # 第三段开头是断拍（无声），用重拍那一下对齐
    k = k0
    while A + 2 * P * k + lag < b - 0.02:
        vt = round(starts[i] + (A + 2 * P * k + lag) - a, 4)
        beats.append(vt)
        if (k - 1) % 4 == 0: down.append(vt)               # 原曲小节第一拍 = 0.498 + 2n 秒（第 1、5、9… 个四分音符）
        k += 1
beats = sorted(set(beats)); down = sorted(set(down))
info = {'total': round(total, 4), 'starts': [round(s, 4) for s in starts], 'beats': beats, 'downbeats': down}
json.dump(info, open('beats30b.json', 'w'))
print('total %.3f s, piece starts %s' % (total, info['starts'])); print('downbeats:', down)

# 核对 stage/timeline-30b.js 里的 D（每小节第一拍，按波形测的）：打印每个 D 前 160 毫秒到后 80 毫秒的音量条，
# 每个字符 10 毫秒，第 17 个字符就是 D。正常情况下 D 前面 30–50 毫秒有一个「.」（重拍前的空），D 前后是「@」（重拍）。
import re
z, _ = librosa.load('raw30b.wav', sr=48000, mono=True); w5 = int(0.005 * 48000)
src = open('../stage/timeline-30b.js', encoding='utf-8').read()
used = [float(x) for x in re.search(r'const D = \[([^\]]*)\]', src).group(1).split(',')]
for d in used:
    ts = np.arange(d - 0.16, d + 0.08, 0.01); e = np.array([np.sqrt(np.mean(z[int(x * 48000):int(x * 48000) + w5] ** 2)) for x in ts])
    print('%6.3f  %s' % (d, ''.join(' .:-=+*#%@'[min(9, int(9.99 * v / e.max()))] for v in e)))
