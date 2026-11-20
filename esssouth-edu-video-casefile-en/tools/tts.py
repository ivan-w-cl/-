# Generates the English voiceover with Kokoro v1.0 (open source, Apache-2.0), one WAV per line:
# public/voice/S01L1.wav … and src/durations.json (seconds per line). The video timeline is built from these durations.
# Usage: <venv>/bin/python -I tools/tts.py <kokoro-v1.0.onnx> <voices-v1.0.bin>
import json, re, sys, os
import soundfile as sf
from kokoro_onnx import Kokoro
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
script = json.load(open(os.path.join(root, 'src', 'script.json'), encoding='utf-8'))
v = script['voice']; k = Kokoro(sys.argv[1], sys.argv[2]); out = {}
for si, sc in enumerate(script['scenes']):
    for li, ln in enumerate(sc['lines']):
        lid = f"S{si + 1:02d}L{li + 1}"
        text = re.sub(r'\[\[|\]\]', '', ln['t'])
        samples, sr = k.create(text, voice=v['voice'], speed=v['speed'], lang=v['lang'])
        sf.write(os.path.join(root, 'public', 'voice', lid + '.wav'), samples, sr)
        out[lid] = round(len(samples) / sr, 3); print(lid, out[lid], text[:50])
json.dump(out, open(os.path.join(root, 'src', 'durations.json'), 'w'), indent=1)
print('total speech', round(sum(out.values()), 1), 's')
