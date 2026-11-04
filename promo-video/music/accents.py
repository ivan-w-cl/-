"""每小节的重音表：在实测小节线（db-*.json）里，按十六分音符算底鼓 / 小鼓 / 踩镲的起音强度，
挑出明显的重音位置；小节开头踩镲特别响（镲）的小节记为乐句开头。
用法：python3 -I accents.py mix-src-60.wav db-60.json → JSON { acc: [[十六分位置…]…], crash: [小节…] }"""
import sys, json, librosa, numpy as np
y, sr = librosa.load(sys.argv[1], sr=22050, mono=True); DB = json.load(open(sys.argv[2]))
hop = 64
S = np.abs(librosa.stft(y, n_fft=1024, hop_length=hop)); f = librosa.fft_frequencies(sr=sr, n_fft=1024)
t = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=hop)
def fl(m): x = np.log1p(S[m]).sum(0); d = np.maximum(0, np.diff(x, prepend=x[0])); return d / np.percentile(d, 99.7)
K, Sn, H = fl(f < 150), fl((f > 200) & (f < 3000)), fl(f > 7000)
def pk(a, tt): m = (t > tt - 0.03) & (t < tt + 0.03); return float(a[m].max()) if m.any() else 0.0
acc, crash = [], []
for b in range(len(DB) - 1):
    t0, t1 = DB[b], DB[b + 1]
    sc = [0.35 * pk(K, t0 + (t1 - t0) * k / 16) + 0.4 * pk(Sn, t0 + (t1 - t0) * k / 16) + 0.25 * pk(H, t0 + (t1 - t0) * k / 16) for k in range(16)]
    top = max(sc) or 1
    acc.append([k for k in range(16) if sc[k] > 0.62 * top])
    if pk(H, t0) > 0.85: crash.append(b)
print(json.dumps({'acc': acc, 'crash': crash}))
