"""Generate the English voiceover per caption line with Kokoro (British male), then lay the lines end to end.
Usage: python3 tts.py <model.onnx> <voices.bin> script.json out_dir
Writes out_dir/voice.wav (48 kHz mono), out_dir/timing.json (per line: scene, text, start, end) and narration.srt"""
import sys, json, os, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
model, voices, script, out = sys.argv[1:5]
S = json.load(open(script)); os.makedirs(out, exist_ok=True)
k = Kokoro(model, voices)
SR = 48000
def trim(a, sr, thr=0.004, pad=0.03):
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx): return a
    return a[max(0, idx[0] - int(pad * sr)): min(len(a), idx[-1] + int(pad * sr))]
import librosa
t = 0.6; parts = []; timing = []
for sc in S['scenes']:
    for i, line in enumerate(sc['lines']):
        a, sr = k.create(line, voice=S['voice'], speed=S['speed'], lang=S['lang'])
        a = trim(np.asarray(a, dtype=np.float32), sr)
        a = librosa.resample(a, orig_sr=sr, target_sr=SR)
        timing.append({'scene': sc['id'], 'text': line, 'start': round(t, 3), 'end': round(t + len(a) / SR, 3)})
        parts.append((t, a)); t += len(a) / SR + (0.16 if i < len(sc['lines']) - 1 else sc.get('gap', 0.3) + 0.25)
total = t + 0.8
buf = np.zeros(int(total * SR), dtype=np.float32)
for t0, a in parts: i = int(t0 * SR); buf[i:i + len(a)] += a
buf *= 0.89 / max(1e-6, np.abs(buf).max())
sf.write(os.path.join(out, 'voice.wav'), buf, SR, subtype='PCM_16')
json.dump({'duration': round(total, 3), 'lines': timing}, open(os.path.join(out, 'timing.json'), 'w'), indent=1, ensure_ascii=False)
def ts(x): ms = int(round(x * 1000)); return '%02d:%02d:%02d,%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)
open(os.path.join(out, 'narration.srt'), 'w').write('\n'.join(f"{i+1}\n{ts(l['start'])} --> {ts(l['end'])}\n{l['text']}\n" for i, l in enumerate(timing)))
print('duration', round(total, 2), 'lines', len(timing), 'words', sum(len(l['text'].split()) for l in timing))
for sc in S['scenes']:
    ls = [l for l in timing if l['scene'] == sc['id']]; print(' ', sc['id'], ls[0]['start'], '→', ls[-1]['end'])
