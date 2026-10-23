"""30 秒版的节拍：沿着实际鼓点一拍一拍往后找（每拍约 0.527 秒，前后 50 毫秒内取最强的击打；无声的那一小节照常往后数）。
输出 beats30.json，就是 stage/timeline-30.js 开头的 BEATS。"""
import json, librosa, numpy as np
y, sr = librosa.load('music30.wav', sr=44100, mono=True)
env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=128); te = librosa.frames_to_time(np.arange(len(env)), sr=sr, hop_length=128)
P = 0.5272
def snap(t, w=0.05):
    m = (te > t - w) & (te < t + w)
    if not m.any(): return t, 0.0
    i = int(np.argmax(env[m])); return float(te[m][i]), float(env[m][i])
beats = [snap(0.01, 0.03)[0]]
while beats[-1] + P < len(y) / sr - 0.2:
    exp = beats[-1] + P; t, s = snap(exp)
    beats.append(t if s > np.median(env) * 3 else exp)
beats = [round(b, 4) for b in beats]
json.dump(beats, open('beats30.json', 'w'))
print(len(beats), 'beats; downbeats:', beats[::4])
