"""原创配乐（全部用代码合成，没有版权问题）：克制的电钢琴琶音 + 暖垫音 + 低音 + 很轻的沙锤，92 BPM，F 大调。
用法：python3 -I compose.py <输出.wav> <片长秒> <段落>
段落写成「开始秒:结束秒:强度」用逗号连起来，强度 0 静默 · 1 只有垫音 · 2 加琶音 · 3 加低音和沙锤。
例：0:0.8:0,0.8:4:1,4:8:2,8:9.6:1,9.6:23:3,23:25:1,25:27:2,27:30:1
最后在片长前 3 秒落到主和弦，延音收尾。"""
import sys
import numpy as np, soundfile as sf
from scipy.signal import lfilter, butter

SR = 48000
BPM = 92
BEAT = 60 / BPM
rng = np.random.default_rng(11)
NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)

# 和弦（MIDI）：F  C/E  Dm7  B♭maj7（每小节一个）
CHORDS = [
    [53, 60, 65, 69, 72],   # F
    [52, 60, 64, 67, 72],   # C/E
    [50, 57, 62, 65, 69],   # Dm7
    [46, 58, 62, 65, 69],   # B♭maj7
]
FINAL = [41, 53, 60, 65, 69, 72, 77]   # 片尾：F（加高八度）


def lp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2)); return lfilter(b, a, x)


def hp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), 'high'); return lfilter(b, a, x)


def rhodes(f, d, vel):
    """电钢琴：正弦 + 轻微调频，起音快、衰减慢"""
    t = np.arange(int(d * SR)) / SR
    mod = np.sin(2 * np.pi * f * 14 * t) * np.exp(-t / 0.12) * 0.9
    s = np.sin(2 * np.pi * f * t + mod) + 0.18 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / 0.4)
    env = np.minimum(1, t / 0.004) * np.exp(-t / 0.9)
    return s * env * vel


def pad_voice(f, n):
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * (1 + dt) * t + ph) for dt, ph in ((-0.0035, 0), (0.0035, 1.3), (0, 2.1))) / 3
    s += 0.25 * np.sin(2 * np.pi * f * 2 * t + 0.4)
    return s


def reverb(x, mix=0.28):
    """简单的混响：几路反馈延迟 + 全通，够给垫音和琶音一点空间"""
    out = np.zeros_like(x)
    for dl, g in ((0.0297, 0.77), (0.0371, 0.74), (0.0411, 0.72), (0.0437, 0.7)):
        d = int(dl * SR); y = lfilter([1], np.r_[1, np.zeros(d - 1), -g], x); out += y
    out /= 4
    for dl, g in ((0.005, 0.7), (0.0017, 0.7)):
        d = int(dl * SR); out = lfilter(np.r_[-g, np.zeros(d - 1), 1], np.r_[1, np.zeros(d - 1), -g], out)
    return x * (1 - mix) + lp(out, 5000) * mix


def level_at(sections, t):
    for a, b, v in sections:
        if a <= t < b: return v
    return sections[-1][2]


def main(out, dur, spec):
    dur = float(dur); n = int((dur + 2.5) * SR)
    sections = [tuple(map(float, s.split(':'))) for s in spec.split(',')]
    end_chord = dur - 3.0
    # 每层的强度曲线（平滑过渡 0.4 秒）
    tt = np.arange(n) / SR
    lv = np.array([level_at(sections, x) for x in tt[::480]])
    lv = np.repeat(lv, 480)[:n]
    lv = lfilter([1 - np.exp(-1 / (0.4 * 100))], [1, -np.exp(-1 / (0.4 * 100))], lv[::480].astype(float)); lv = np.repeat(lv, 480)[:n]
    g_pad = np.clip(lv, 0, 1); g_arp = np.clip(lv - 1, 0, 1); g_low = np.clip(lv - 2, 0, 1)
    pad = np.zeros(n); arp = np.zeros(n); bass = np.zeros(n); shk = np.zeros(n)
    bar = 4 * BEAT; nb = int(np.ceil(end_chord / bar))
    for i in range(nb):
        t0 = i * bar; ch = CHORDS[i % 4]
        a, b = int(t0 * SR), min(n, int(min(t0 + bar + 0.6, end_chord + 0.3) * SR))
        seg = sum(pad_voice(NOTE(m + 12), b - a) for m in ch[1:]) / 4
        fade = np.minimum(1, np.arange(b - a) / (0.35 * SR)) * np.minimum(1, (b - a - np.arange(b - a)) / (0.5 * SR))
        pad[a:b] += seg * fade
        # 琶音：八分音符，上行再下行
        order = [1, 2, 3, 4, 3, 2, 4, 3]
        for k in range(8):
            ts = t0 + k * BEAT / 2
            if ts >= end_chord - 0.05: break
            m = ch[order[k]] + 12; v = 0.42 if k % 2 == 0 else 0.3
            s = rhodes(NOTE(m), 1.6, v); a2 = int(ts * SR); arp[a2:a2 + len(s)] += s[:n - a2]
        # 低音：第 1、3 拍
        for k in (0, 2):
            ts = t0 + k * BEAT
            if ts >= end_chord - 0.05: break
            d = BEAT * 1.8; t = np.arange(int(d * SR)) / SR
            s = (np.sin(2 * np.pi * NOTE(ch[0]) * t) + 0.3 * np.sin(2 * np.pi * NOTE(ch[0]) * 2 * t)) * np.minimum(1, t / 0.01) * np.exp(-t / 0.7) * 0.55
            a2 = int(ts * SR); bass[a2:a2 + len(s)] += s[:n - a2]
        # 沙锤：十六分，重音在反拍
        for k in range(16):
            ts = t0 + k * BEAT / 4
            if ts >= end_chord - 0.05: break
            d = 0.06; m_ = int(d * SR); s = hp(rng.standard_normal(m_), 6000) * np.exp(-np.arange(m_) / (0.012 * SR)) * (0.16 if k % 4 == 2 else 0.07)
            a2 = int(ts * SR); shk[a2:a2 + m_] += s[:n - a2]
    # 片尾主和弦：垫音 + 琶音最后一扫 + 低音，长延音
    a = int(end_chord * SR); L = n - a; t = np.arange(L) / SR
    fin_env = np.minimum(1, t / 0.08) * np.exp(-t / 2.4)
    for m in FINAL:
        pad[a:] += pad_voice(NOTE(m + 12 if m < 60 else m), L) * fin_env * 0.22
    for k, m in enumerate(FINAL[2:]):
        s = rhodes(NOTE(m + 12), 3.0, 0.38); a2 = a + int(k * 0.07 * SR); arp[a2:a2 + len(s)] += s[:n - a2]
    s = np.sin(2 * np.pi * NOTE(FINAL[0]) * t) * np.exp(-t / 2.0) * 0.6; bass[a:] += s
    g_fin = (tt >= end_chord - 0.02).astype(float)
    mix = (lp(pad, 2600) * 0.34 * np.maximum(g_pad, g_fin)
           + arp * 0.34 * np.maximum(g_arp, g_fin)
           + lp(bass, 320) * 0.24 * np.maximum(g_low, g_fin)
           + shk * 0.55 * g_low * (1 - g_fin))
    st = np.stack([mix, mix], 1)
    # 琶音左右轻微错开，增加宽度
    st[:, 0] += np.r_[np.zeros(int(0.011 * SR)), arp[:-int(0.011 * SR)]] * 0.06
    wet = np.stack([reverb(st[:, 0]), reverb(np.r_[np.zeros(37), st[:-37, 1]])], 1)
    wet = wet[:int((dur + 0.2) * SR)]
    fade = np.ones(len(wet)); k = int(1.6 * SR); fade[-k:] = np.linspace(1, 0, k) ** 2
    wet *= fade[:, None]
    wet /= np.abs(wet).max() + 1e-9; wet *= 0.7
    sf.write(out, wet.astype(np.float32), SR, subtype='FLOAT')
    print('music', out, f'{len(wet) / SR:.2f}s')


if __name__ == '__main__':
    main(*sys.argv[1:4])
