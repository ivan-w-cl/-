# Generates assets/bgm.wav: a light, original background loop (soft piano-like plucks + pad, 92 bpm, C–G–Am–F).
# Written for this video; no third-party music. Usage: python3 tools/bgm.py [seconds=125]
import sys, wave, struct, math, random, os
SR = 48000; SEC = float(sys.argv[1]) if len(sys.argv) > 1 else 125.0; N = int(SR * SEC)
random.seed(7); L = [0.0] * N; R = [0.0] * N
def note(m): return 440.0 * 2 ** ((m - 69) / 12)
def add(f, start, dur, amp, kind, pan):
    s0 = int(start * SR); n = int(dur * SR)
    for i in range(n):
        j = s0 + i
        if j >= N: break
        t = i / SR
        if kind == 'pluck':
            env = math.exp(-t * 3.2) * min(1, t * 200)
            v = (math.sin(2 * math.pi * f * t) + 0.35 * math.sin(4 * math.pi * f * t) + 0.12 * math.sin(6 * math.pi * f * t)) * env
        else:
            env = min(1, t / 0.6) * min(1, (dur - t) / 0.8)
            v = (math.sin(2 * math.pi * f * t) + 0.5 * math.sin(2 * math.pi * f * 1.003 * t)) * env * 0.5
        v *= amp; L[j] += v * (1 - pan); R[j] += v * pan
beat = 60 / 92; bar = beat * 4
chords = [[48, 55, 60, 64], [43, 50, 55, 59], [45, 52, 57, 60], [41, 48, 53, 57]]  # C G Am F
pattern = [0, 2, 1, 3, 2, 1, 3, 2]
t = 0.0; k = 0
while t < SEC:
    ch = chords[k % 4]
    for m in ch[1:]: add(note(m), t, bar, 0.035, 'pad', 0.5)
    add(note(ch[0] - 12), t, bar, 0.05, 'pad', 0.5)
    for i, p in enumerate(pattern):
        m = ch[p % 4] + 12 + (12 if i == 6 else 0)
        add(note(m), t + i * beat / 2, beat * 1.5, 0.06 * (1.0 if i % 2 == 0 else 0.7), 'pluck', 0.35 + 0.3 * (i % 2))
    t += bar; k += 1
peak = max(max(abs(x) for x in L), max(abs(x) for x in R)) or 1
g = 0.5 / peak  # about −6 dBFS peak; the export mixes it as a bed under captions
os.makedirs('assets', exist_ok=True)
with wave.open('assets/bgm.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b''.join(struct.pack('<hh', int(L[i] * g * 32767), int(R[i] * g * 32767)) for i in range(N)))
print('wrote assets/bgm.wav', SEC, 's')
