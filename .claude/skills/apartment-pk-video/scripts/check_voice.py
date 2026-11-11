"""逐句回听旁白：把 voice.wav 按 <期号>-cues.json 切开，每句用离线语音识别（SenseVoice）转成文字，和原文并排打印。
识别结果里数字会写成阿拉伯数字、英文楼名常常拼错，这些不用管；要看的是中文词有没有读错或含糊（例如「要比的是」被识别成别的词）。
有问题就改 script.json 的措辞，或者那一句单独加 "speed": 1.15 放慢一点，再跑一次 voice.sh。
用法：python3 check_voice.py ep02（仓库根目录）"""
import json, os, sys
import soundfile as sf, sherpa_onnx
EP = sys.argv[1]
D = os.path.expanduser('~/.cache/apartment-pk/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17')
r = sherpa_onnx.OfflineRecognizer.from_sense_voice(model=D + '/model.int8.onnx', tokens=D + '/tokens.txt', use_itn=True, num_threads=4)
cues = json.load(open(f'promo-video/stage/{EP}-cues.json', encoding='utf8'))
script = {l['id']: l for l in json.load(open(f'promo-video/episodes/{EP}/script.json', encoding='utf8'))}
a, sr = sf.read(f'promo-video/episodes/{EP}/voice.wav', dtype='float32')
if a.ndim > 1: a = a[:, 0]
print(f"旁白总长 {cues['voiceEnd']} 秒，视频约 {cues['voiceEnd'] + 3.4:.1f} 秒\n")
for c in cues['cues']:
    s = r.create_stream(); s.accept_waveform(sr, a[int(c['t0'] * sr):int(c['t1'] * sr)]); r.decode_stream(s)
    print(f"[{c['id']}] {c['t0']:.1f}–{c['t1']:.1f}s\n  原文：{script[c['id']]['say']}\n  听到：{s.result.text}\n")
