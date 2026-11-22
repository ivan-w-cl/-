# 试听：用 Kokoro 的 8 个中文音色读同一段文案，输出 voice-samples/<音色>.mp3。
# 用法：<venv>/bin/python -I tools/samples.py <kokoro-v1.0.onnx> <voices-v1.0.bin>
import sys, os, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from misaki import zh
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXT = ['常有家长问：高考之外，孩子还要去参加一场大学面试，这到底有没有用？',
        '高考投档成绩折成百分制，占百分之六十五，学校面试占百分之三十五。']
VOICES = ['zm_yunyang', 'zm_yunjian', 'zm_yunxi', 'zm_yunxia', 'zf_xiaobei', 'zf_xiaoni', 'zf_xiaoxiao', 'zf_xiaoyi']
k = Kokoro(sys.argv[1], sys.argv[2]); g2p = zh.ZHG2P(); out = os.path.join(root, 'voice-samples')
for v in VOICES:
    parts = []
    for t in TEXT:
        r = g2p(t); ph = r if isinstance(r, str) else r[0]
        s, sr = k.create(ph, voice=v, speed=1.0, is_phonemes=True); parts += [s, np.zeros(int(sr * 0.45), dtype=s.dtype)]
    wav = os.path.join(out, v + '.wav'); sf.write(wav, np.concatenate(parts), sr)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', wav, '-b:a', '96k', os.path.join(out, v + '.mp3')], check=True); os.remove(wav)
    print(v)
