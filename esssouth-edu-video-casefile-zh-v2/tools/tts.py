# 中文配音：Kokoro v1.0（开源，Apache-2.0）+ misaki 中文转音素，每行一个 WAV：public/voice/S01L1.wav … 和 src/durations.json。
# 节奏：每句按标点切成小段分别合成，切掉每段首尾的静音，再按 script.json 里 voice.pauses 的秒数补上停顿，
# 这样 1.25 倍速时，句号、问号、冒号处仍有清楚的换气。行里有 "say" 时按 "say" 读，否则读 "t"。
# 用法：<venv>/bin/python -I tools/tts.py <kokoro-v1.0.onnx> <voices-v1.0.bin>
import json, re, sys, os
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from misaki import zh
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
script = json.load(open(os.path.join(root, 'src', 'script.json'), encoding='utf-8'))
v = script['voice']; P = v['pauses']; k = Kokoro(sys.argv[1], sys.argv[2]); g2p = zh.ZHG2P(); out = {}

def trim(x, sr, th=0.012, keep=0.03):
    idx = np.where(np.abs(x) > th)[0]
    if not len(idx): return x[:0]
    a = max(0, idx[0] - int(sr * keep)); b = min(len(x), idx[-1] + int(sr * keep)); return x[a:b]

def say(chunk, lid):
    r = g2p(chunk); ph = r if isinstance(r, str) else r[0]
    left = re.findall(r'[一-鿿]', ph)
    if left: raise SystemExit(f'{lid}: 有汉字没有转成音素（{"".join(left)}），请在 "say" 里改写这一句')
    return k.create(ph, voice=v['voice'], speed=v['speed'], is_phonemes=True)

for si, sc in enumerate(script['scenes']):
    for li, ln in enumerate(sc['lines']):
        lid = f"S{si + 1:02d}L{li + 1}"
        text = ln.get('say') or re.sub(r'\[\[|\]\]', '', ln['t'])
        # 在句号、问号、叹号、分号、冒号、逗号后切开，逗号短停，句末长停
        chunks = [c for c in re.findall(r'[^，、：；。？！]+[，、：；。？！]?', text) if c.strip()]
        parts, sr = [], 24000
        for j, c in enumerate(chunks):
            s, sr = say(c, lid); s = trim(s, sr); parts.append(s)
            if j < len(chunks) - 1: parts.append(np.zeros(int(sr * P.get(c[-1], 0.08)), dtype=s.dtype))
        audio = np.concatenate(parts)
        sf.write(os.path.join(root, 'public', 'voice', lid + '.wav'), audio, sr)
        out[lid] = round(len(audio) / sr, 3); print(lid, out[lid], len(chunks), text[:24])
json.dump(out, open(os.path.join(root, 'src', 'durations.json'), 'w'), indent=1)
print('total speech', round(sum(out.values()), 1), 's')
