"""实测每一小节的第一拍（底鼓起音）：拼好的配乐里小节线会慢慢偏离 120 拍/分的网格（最多早 30–40 毫秒），
用实测时间给时间表定位。没有底鼓的小节（前奏、断拍后的余音）用宽频起音，再没有就按前后插值。
用法：python3 -I downbeat-table.py mix-src-60.wav → 打印 JS 数组"""
import sys, json, librosa, numpy as np
y, sr = librosa.load(sys.argv[1], sr=22050, mono=True)
hop = 64
S = np.abs(librosa.stft(y, n_fft=1024, hop_length=hop)); f = librosa.fft_frequencies(sr=sr, n_fft=1024)
t = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=hop)
def flux(m): x = S[m].sum(0); return np.maximum(0, np.diff(x, prepend=x[0]))
low, full = flux(f < 150), flux(f > 0)
BAR, LAG = 4 * 0.50026, 0.05
N = int((len(y) / sr - LAG) / BAR) + 1
out = []
for n in range(N + 1):
    g = n * BAR + LAG; m = (t > g - 0.07) & (t < g + 0.05)
    v = None
    if m.any():
        for arr, th in ((low, 0.3), (full, 0.3)):
            if arr[m].max() > np.percentile(arr, 99.5) * th:
                # 起音的前沿：峰值之前第一次升到峰值一半的位置
                seg, ts = arr[m], t[m]; i = int(np.argmax(seg)); j = i
                while j > 0 and seg[j - 1] > seg[i] * 0.5: j -= 1
                v = float(ts[j]); break
    out.append(v)
# 缺的用前后插值（按网格间距）
for n, v in enumerate(out):
    if v is None:
        prev = next((k for k in range(n - 1, -1, -1) if out[k] is not None), None)
        nxt = next((k for k in range(n + 1, len(out)) if out[k] is not None), None)
        if prev is not None and nxt is not None: out[n] = out[prev] + (out[nxt] - out[prev]) * (n - prev) / (nxt - prev)
        elif prev is not None: out[n] = out[prev] + (n - prev) * BAR
        else: out[n] = n * BAR + LAG
err = [round((v - (n * BAR + LAG)) * 1000) for n, v in enumerate(out)]
print('// ' + ' '.join(map(str, err)), file=sys.stderr)
print(json.dumps([round(v, 4) for v in out]))
