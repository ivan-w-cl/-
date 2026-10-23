"""新配乐（120 拍/分的打击乐）：找出所有明显的击打，拟合八分音符网格 t = a + p·k，写 grid.json（assemble30b.py 用）。"""
import json, librosa, numpy as np
y, sr = librosa.load('track2.mp3', sr=44100, mono=True)
env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=128); te = librosa.frames_to_time(np.arange(len(env)), sr=sr, hop_length=128)
pk = librosa.util.peak_pick(env, pre_max=10, post_max=10, pre_avg=20, post_avg=20, delta=env.max() * 0.12, wait=20)
t = np.array([te[i] for i in pk if env[i] / env.max() > 0.2])
k = np.round((t - 0.033) / 0.25); a, p = np.linalg.lstsq(np.vstack([np.ones_like(k), k]).T, t, rcond=None)[0]
json.dump({'a': float(a), 'p': float(p)}, open('grid.json', 'w'))
print('eighth-note grid a=%.4f p=%.5f -> %.2f BPM' % (a, p, 60 / (2 * p)))
