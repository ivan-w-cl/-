"""重新打拍子：在拼好的配乐上做节拍检测，核对 120 拍/分的小节网格，并找出每小节里鼓真正落下的十六分音符位置。
用法：python3 -I rebeat.py mix-src-60.wav > hits-60.json"""
import sys, json, librosa, numpy as np
y, sr = librosa.load(sys.argv[1], sr=22050, mono=True)
hop = 128
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, hop_length=hop, units='time', start_bpm=120, tightness=400)
BAR, LAG = 4 * 0.50026, 0.05
grid = lambda n: n * BAR + LAG
# 节拍检测结果离网格多远（毫秒）
q = BAR / 4
off = [((b - LAG + q / 2) % q - q / 2) * 1000 for b in beats]
S = np.abs(librosa.stft(y, n_fft=1024, hop_length=hop)); f = librosa.fft_frequencies(sr=sr, n_fft=1024)
t = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=hop)
def flux(band):
    x = S[band].sum(0); d = np.maximum(0, np.diff(x, prepend=x[0])); return d / (np.percentile(d, 99) + 1e-9)
kick, snare, hat = flux(f < 150), flux((f > 180) & (f < 2500)), flux(f > 6000)
def pk(arr, tt): i = np.searchsorted(t, tt); return float(arr[max(0, i - 3):i + 4].max())
bars = []
n = 0
while grid(n) + BAR <= len(y) / sr + 0.01:
    row = {'bar': n, 't': round(grid(n), 3), 'kick': [], 'snare': [], 'loud': 0}
    for s in range(16):
        tt = grid(n) + s * BAR / 16
        if pk(kick, tt) > 0.45: row['kick'].append(s)
        if pk(snare, tt) > 0.45: row['snare'].append(s)
    seg = y[int(grid(n) * sr):int((grid(n) + BAR) * sr)]
    row['loud'] = round(float(20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-9)), 1)
    bars.append(row); n += 1
print(json.dumps({'tempo': float(np.atleast_1d(tempo)[0]), 'beat_offset_ms': {'median': round(float(np.median(off)), 1), 'max_abs': round(float(np.max(np.abs(off))), 1)}, 'bars': bars}, ensure_ascii=False))
