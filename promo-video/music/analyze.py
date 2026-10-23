import librosa, numpy as np, json, sys
y, sr = librosa.load(sys.argv[1], sr=22050, mono=True)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time', tightness=200)
tempo = float(np.atleast_1d(tempo)[0])
onset_env = librosa.onset.onset_strength(y=y, sr=sr)
# energy per second (RMS) and spectral brightness, to find sections
hop = 512; rms = librosa.feature.rms(y=y, hop_length=hop)[0]; t = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
sec = [float(np.mean(rms[(t >= s) & (t < s + 1)])) for s in range(int(t[-1]))]
mx = max(sec)
print('tempo', round(tempo, 2), 'beats', len(beats), 'first beats', [round(b, 3) for b in beats[:12]])
ib = np.diff(beats); print('beat interval median', round(float(np.median(ib)), 4), 'std', round(float(np.std(ib)), 4))
print('energy per second (0-9):')
print(' '.join(f'{i}:{int(9.99 * v / mx)}' for i, v in enumerate(sec)))
# novelty: big changes in energy (section boundaries)
S = np.abs(librosa.stft(y, hop_length=hop)); chroma = librosa.feature.chroma_stft(S=S, sr=sr)
bounds = librosa.segment.agglomerative(np.vstack([librosa.feature.mfcc(S=librosa.power_to_db(S**2), n_mfcc=13), chroma]), 12)
print('segment boundaries (s):', [round(float(x), 2) for x in librosa.frames_to_time(bounds, sr=sr, hop_length=hop)])
json.dump({'tempo': tempo, 'beats': [float(b) for b in beats], 'energy': sec}, open('beats.json', 'w'))
