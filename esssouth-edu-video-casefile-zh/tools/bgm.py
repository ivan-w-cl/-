# Generates public/bgm.wav: an original, quiet "investigation" bed for the Case File video —
# minor-key plucks over a soft pulsing bass (Am–F–C–E, 84 bpm). No third-party music. Usage: python3 tools/bgm.py [seconds]
import sys, wave, struct, math, os
SR = 48000; SEC = float(sys.argv[1]) if len(sys.argv) > 1 else 130.0; N = int(SR * SEC)
L = [0.0] * N; R = [0.0] * N
note = lambda m: 440.0 * 2 ** ((m - 69) / 12)
def add(f, start, dur, amp, kind, pan):
    s0 = int(start * SR)
    for i in range(int(dur * SR)):
        j = s0 + i
        if j >= N: break
        t = i / SR
        if kind == 'pluck':
            env = math.exp(-t * 4.0) * min(1, t * 300); v = (math.sin(2 * math.pi * f * t) + 0.3 * math.sin(4 * math.pi * f * t)) * env
        elif kind == 'bass':
            env = math.exp(-t * 2.2) * min(1, t * 80); v = math.sin(2 * math.pi * f * t) * env
        else:
            env = min(1, t / 0.8) * min(1, (dur - t) / 0.8); v = (math.sin(2 * math.pi * f * t) + 0.4 * math.sin(2 * math.pi * f * 1.004 * t)) * env * 0.5
        v *= amp; L[j] += v * (1 - pan); R[j] += v * pan
beat = 60 / 84; bar = beat * 4
chords = [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [40, 47, 52, 56]]  # Am F C E
arp = [0, 2, 3, 2, 1, 2, 3, 2]
t = 0.0; k = 0
while t < SEC:
    ch = chords[k % 4]
    for m in ch[1:]: add(note(m), t, bar, 0.028, 'pad', 0.5)
    for b in range(4): add(note(ch[0] - 12), t + b * beat, beat * 0.9, 0.09 if b % 2 == 0 else 0.05, 'bass', 0.5)
    for i, p in enumerate(arp): add(note(ch[p] + 12), t + i * beat / 2, beat, 0.05 * (1.0 if i % 2 == 0 else 0.65), 'pluck', 0.3 + 0.4 * (i % 2))
    t += bar; k += 1
peak = max(max(abs(x) for x in L), max(abs(x) for x in R)) or 1; g = 0.5 / peak
os.makedirs('public', exist_ok=True)
with wave.open('public/bgm.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b''.join(struct.pack('<hh', int(L[i] * g * 32767), int(R[i] * g * 32767)) for i in range(N)))
print('wrote public/bgm.wav', SEC, 's')
