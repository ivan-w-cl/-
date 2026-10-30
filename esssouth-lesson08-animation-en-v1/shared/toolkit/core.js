/*
 * Lesson 02 · Section 05 audio-envelope core (UMD: browser and Node). Only the two helpers this section uses, taken unchanged
 * from the shared Lesson 01 core: amplitudeEnvelope() (tools/attach-audio.mjs, for mouth opening from REAL recordings) and
 * envelopeAt() (player). The shared core's old lesson compiler, decision and branch code are deliberately NOT included here.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EsssouthCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function amplitudeEnvelope(channels, sampleRate, o) {
    // release applies while sound continues; quietRelease applies once the input drops below the
    // silence gate, so the mouth settles closed within about 0.15 s of a pause or the end of a line
    o = Object.assign({ rate: 100, silenceDb: -32, attack: 0.03, release: 0.09, quietRelease: 0.04 }, o || {});
    const ch = Array.isArray(channels) ? channels : [channels];
    const n = ch[0].length, hop = Math.max(1, Math.round(sampleRate / o.rate)), frames = Math.ceil(n / hop);
    const rms = new Float32Array(frames);
    for (let f = 0; f < frames; f++) {
      let s = 0, c = 0;
      for (let i = f * hop, e = Math.min(n, i + hop); i < e; i++) { let v = 0; for (let k = 0; k < ch.length; k++) v += ch[k][i]; v /= ch.length; s += v * v; c++; }
      rms[f] = Math.sqrt(s / Math.max(1, c));
    }
    const sorted = Array.from(rms).sort((a, b) => a - b);
    const ref = sorted[Math.floor(0.95 * (sorted.length - 1))] || 0;
    const out = new Float32Array(frames);
    if (ref <= 1e-6) return { rate: o.rate, values: out, ref: 0 };
    const gate = ref * Math.pow(10, o.silenceDb / 20);
    const k = (s) => 1 - Math.exp(-1 / (s * o.rate));
    const ka = k(o.attack), kr = k(o.release), kq = k(o.quietRelease);
    let y = 0;
    for (let f = 0; f < frames; f++) {
      const x = rms[f] < gate ? 0 : Math.min(1, (rms[f] - gate) / (ref - gate));
      y += (x > y ? ka : x === 0 ? kq : kr) * (x - y);
      out[f] = y < 0.02 ? 0 : y;
    }
    return { rate: o.rate, values: out, ref };
  }
  function envelopeAt(env, u) {
    if (!env || u < 0) return 0;
    const x = u * env.rate, i = Math.floor(x);
    if (i >= env.values.length - 1) return i === env.values.length - 1 ? env.values[i] : 0;
    return env.values[i] + (env.values[i + 1] - env.values[i]) * (x - i);
  }

  return { amplitudeEnvelope, envelopeAt };
});