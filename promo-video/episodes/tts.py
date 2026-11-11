"""旁白：把 <集>/script.json 的每一句合成男声（Kokoro 多语言模型，离线），按顺序排好时间，输出
   <集>/voice.wav（整条旁白，48 kHz）和 ../stage/<集>-cues.json（每句的起止时间和字幕，时间线按它排镜头）。
   用法：KOKORO=<模型目录> python3 tts.py ep01 [说话人编号，默认 52 = zm_yunyang；49 yunjian · 50 yunxi · 51 yunxia]
   模型：https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2 ；pip install sherpa-onnx soundfile scipy"""
import json, os, sys
import numpy as np, soundfile as sf, sherpa_onnx
from scipy.signal import resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); EP = sys.argv[1]; SID = int(sys.argv[2]) if len(sys.argv) > 2 else 52
M = os.environ['KOKORO']; LEAD = 0.4; SR = 48000
tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=M + '/model.onnx', voices=M + '/voices.bin', tokens=M + '/tokens.txt',
        data_dir=M + '/espeak-ng-data', dict_dir=M + '/dict', lexicon=M + '/lexicon-us-en.txt,' + M + '/lexicon-zh.txt'), num_threads=4),
    rule_fsts=','.join(M + '/' + f for f in ['phone-zh.fst', 'date-zh.fst', 'number-zh.fst']), max_num_sentences=1))
script = json.load(open(os.path.join(HERE, EP, 'script.json'), encoding='utf8'))
t, cues, parts = LEAD, [], []
for l in script:
    a = tts.generate(l['say'], sid=SID, speed=float(l.get('speed', 1.0))); x = np.asarray(a.samples, dtype='float64')
    nz = np.where(np.abs(x) > 0.004)[0]; x = x[max(nz[0] - 400, 0):nz[-1] + 1600]          # 去掉句首句尾的静音
    x = resample_poly(x, SR, a.sample_rate); d = len(x) / SR
    w = [len(c) for c in l['cap']]; acc = np.cumsum([0] + w) / sum(w)                       # 字幕按字数分配这一句的时间
    cues.append({'id': l['id'], 't0': round(t, 3), 't1': round(t + d, 3), 'cap': [{'t': round(t + acc[i] * d, 3), 'text': c} for i, c in enumerate(l['cap'])]})
    parts.append((t, x)); t += d + l.get('gap', 0.4)
out = np.zeros(int((t + 0.5) * SR))
for t0, x in parts: out[int(t0 * SR):int(t0 * SR) + len(x)] += x
out *= 0.89 / np.abs(out).max()
sf.write(os.path.join(HERE, EP, 'voice.wav'), out, SR)
json.dump({'voiceEnd': round(parts[-1][0] + len(parts[-1][1]) / SR, 3), 'cues': cues}, open(os.path.join(HERE, '..', 'stage', EP + '-cues.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
for c in cues: print(c['id'], c['t0'], c['t1'])
