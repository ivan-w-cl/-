# 中文配音：Kokoro v1.0（开源，Apache-2.0）+ misaki 中文转音素，每行一个 WAV：
# public/voice/S01L1.wav … 和 src/durations.json（每行秒数）。行里有 "say" 时按 "say" 读（用于日期、英文单词等），否则读 "t"。
# 用法：<venv>/bin/python -I tools/tts.py <kokoro-v1.0.onnx> <voices-v1.0.bin>
import json, re, sys, os
import soundfile as sf
from kokoro_onnx import Kokoro
from misaki import zh
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
script = json.load(open(os.path.join(root, 'src', 'script.json'), encoding='utf-8'))
v = script['voice']; k = Kokoro(sys.argv[1], sys.argv[2]); g2p = zh.ZHG2P(); out = {}
for si, sc in enumerate(script['scenes']):
    for li, ln in enumerate(sc['lines']):
        lid = f"S{si + 1:02d}L{li + 1}"
        text = ln.get('say') or re.sub(r'\[\[|\]\]', '', ln['t'])
        r = g2p(text); ph = r if isinstance(r, str) else r[0]
        left = re.findall(r'[一-鿿]', ph)
        if left: raise SystemExit(f'{lid}: 有汉字没有转成音素（{"".join(left)}），请在 "say" 里改写这一句')
        samples, sr = k.create(ph, voice=v['voice'], speed=v['speed'], is_phonemes=True)
        sf.write(os.path.join(root, 'public', 'voice', lid + '.wav'), samples, sr)
        out[lid] = round(len(samples) / sr, 3); print(lid, out[lid], text[:30])
json.dump(out, open(os.path.join(root, 'src', 'durations.json'), 'w'), indent=1)
print('total speech', round(sum(out.values()), 1), 's')
