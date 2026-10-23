import librosa, numpy as np, json
y, sr = librosa.load('track.mp3', sr=22050, mono=True)
B = json.load(open('beats.json'))['beats']
# low-frequency (kick) onset strength at each beat → which beat phase (0..3) is the bar's first beat
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=256)); freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
low = S[freqs < 150].sum(axis=0); lt = librosa.frames_to_time(np.arange(len(low)), sr=sr, hop_length=256)
full = librosa.onset.onset_strength(y=y, sr=sr, hop_length=256)
def at(arr, t): i = np.searchsorted(lt, t); return float(arr[max(0, i - 2):i + 3].max())
for ph in range(4):
    v = [at(low, b) for b in B[ph::4] if b < 50]; print('phase', ph, 'mean kick', round(float(np.mean(v)), 1))
# accent pattern of bars: onset strength over 8-beat windows around 46-58s
print('beats 44-60:', [(round(b, 3), round(at(full, b), 1)) for b in B if 44 < b < 60])
