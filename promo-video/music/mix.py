"""音效合成 + 混音（全部用代码合成，没有版权问题）。
用法：python3 -I mix.py <配乐.wav> <音效时间表.json> <输出.wav>
音效时间表由 record.cjs 录制时写出（SFX_LOG=…），每条 { t: 秒, name, gain }。
音效：tick 点按（轻、清脆）/ tick-s 快速连点（更轻）/ pop 卡片弹出 / whoosh 镜头转换 / whoosh-up 手机升起 / ding 群码到了 / hit 片名重拍。
「叮」出现时音乐压低 3 dB 约 0.8 秒，让铃声清楚。最后整体响度统一到 -14 LUFS、峰值限制在 -1.5 dB（由 prepare30b.sh 里的 ffmpeg 完成）。"""
import json, sys
import numpy as np, soundfile as sf

SR = 48000
rng = np.random.default_rng(7)
t_ = lambda d: np.arange(int(d * SR)) / SR


def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y


def tick(pitch=3200, dur=0.03, level=0.32):
    t = t_(dur); click = np.sin(2 * np.pi * pitch * t) * env(len(t), 0.0008, 0.008)
    n = rng.standard_normal(len(t)) * env(len(t), 0.0003, 0.002); n = n - lowpass(n, 2500)   # 只留高频的「嗒」
    s = (click * 0.8 + n * 0.35) * level
    return np.stack([s, s], 1)


def pop(level=0.36):
    d = 0.12; t = t_(d); f = 520 + 900 * (1 - np.exp(-t / 0.02))                              # 音高快速往上，像气泡
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.035) * level
    return np.stack([s, s], 1)


def whoosh(d=0.5, level=0.42, up=False, pan=(-0.6, 0.6)):
    n = int(d * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    # 带通扫频：用两个一阶低通相减，中心频率随时间变化（分段处理）
    out = np.zeros(n); seg = 512
    lo_s = hi_s = 0.0
    for i in range(0, n, seg):
        u = i / n; fc = (600 + 3200 * u) if up else (500 + 2600 * np.sin(np.pi * u))
        a_hi = np.exp(-2 * np.pi * fc * 1.6 / SR); a_lo = np.exp(-2 * np.pi * fc * 0.6 / SR)
        for j in range(i, min(n, i + seg)):
            hi_s = (1 - a_hi) * noise[j] + a_hi * hi_s; lo_s = (1 - a_lo) * noise[j] + a_lo * lo_s; out[j] = hi_s - lo_s
    shape = np.sin(np.pi * np.clip(t / d, 0, 1)) ** (1.6 if not up else 1.0) * (np.clip(t / d, 0, 1) ** 0.6 if up else 1)
    s = out / (np.abs(out).max() + 1e-9) * shape * level
    p = np.linspace(pan[0], pan[1], n)                                                          # 跟着镜头从左扫到右
    return np.stack([s * np.sqrt((1 - p) / 2) * 1.41, s * np.sqrt((1 + p) / 2) * 1.41], 1)


def bell(f0, d=1.6, level=0.5):
    t = t_(d); s = np.zeros_like(t)
    for ratio, amp, dec in ((1, 1, 0.9), (2.0, 0.32, 0.5), (2.76, 0.22, 0.35), (5.4, 0.08, 0.15), (8.93, 0.03, 0.08)):
        s += amp * np.sin(2 * np.pi * f0 * ratio * t) * np.exp(-t / dec)
    s *= np.minimum(1, t / 0.002) * level / 1.6
    return s


def ding(level=0.78):
    """两个音的「叮」：E6，70 毫秒后 B6（五度，更亮），像收到消息的提示音"""
    a = bell(1318.5, level=level); b = bell(1975.5, d=1.4, level=level * 0.62)
    out = np.zeros(len(a) + int(0.07 * SR)); out[:len(a)] += a; out[int(0.07 * SR):int(0.07 * SR) + len(b)] += b
    return np.stack([out * 0.95, out], 1)


def hit(level=0.7):
    """片名的低频重拍：音高从 95 Hz 落到 42 Hz 的正弦 + 很短的噪声起音 + 一点空间感"""
    d = 2.2; t = t_(d); f = 42 + 53 * np.exp(-t / 0.09)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.65)
    n = rng.standard_normal(len(t)); click = lowpass(n, 1800) * np.exp(-t / 0.012) * 0.8
    s = (body + click) * np.minimum(1, t / 0.003) * level
    tail = np.convolve(s, np.exp(-np.arange(int(0.25 * SR)) / (0.08 * SR)) * rng.standard_normal(int(0.25 * SR)) * 0.004, mode='full')[:len(s)]
    return np.stack([s + tail, s - tail * 0.7], 1)


MAKE = {
    'tick': lambda: tick(), 'tick-s': lambda: tick(3900, 0.022, 0.2), 'pop': lambda: pop(),
    'whoosh': lambda: whoosh(), 'whoosh-up': lambda: whoosh(0.75, 0.38, up=True, pan=(0, 0)),
    'ding': lambda: ding(), 'hit': lambda: hit(),
}


def main(music, events, out):
    m, sr = sf.read(music, always_2d=True); assert sr == SR, sr
    if m.shape[1] == 1: m = np.repeat(m, 2, 1)
    ev = json.load(open(events)); cache = {}
    sfx = np.zeros((len(m) + 3 * SR, 2))
    duck = np.ones(len(m))
    for e in ev:
        name = e['name']; cache.setdefault(name, MAKE[name]()); s = cache[name] * e.get('gain', 1)
        start = int(round(e['t'] * SR))
        if name.startswith('whoosh'): start -= int(len(s) * 0.55)    # whoosh 的最响处对准镜头转换那一刻
        start = max(0, start); sfx[start:start + len(s)] += s[:len(sfx) - start]
        if name == 'ding':                                            # 叮的时候音乐让开 3 dB
            a, b = start, min(len(m), start + int(0.9 * SR)); g = 10 ** (-3 / 20)
            duck[a:b] = np.minimum(duck[a:b], g + (1 - g) * np.clip((np.arange(b - a) - 0.6 * SR) / (0.3 * SR), 0, 1))
    mix = m * duck[:, None] + sfx[:len(m)]
    peak = np.abs(mix).max()
    sf.write(out, mix.astype(np.float32), SR, subtype='FLOAT')   # 浮点保存，不会削波；最后一步再限幅、统一响度
    print(f'{len(ev)} sfx mixed, peak {20 * np.log10(peak + 1e-9):.1f} dBFS ->', out)


if __name__ == '__main__':
    main(*sys.argv[1:4])
