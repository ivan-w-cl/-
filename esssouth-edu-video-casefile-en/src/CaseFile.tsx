// CASE FILE — "Does the extra interview actually change anything?"  1080×1920 @ 30 fps.
// A parent's question is opened as a case on a corkboard. Official brochures are exhibits (highlighted, translated
// excerpts), the hypothetical is reconstructed on a whiteboard, real product screens are pinned as "tool check"
// photos, and the verdict closes the file. Everything is a function of the current frame.
import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/fonts';
import script from './script.json';
import durations from './durations.json';
import captureMeta from './capture-meta.json';
import { buildTimeline, FPS } from './timeline.js';

// Fonts ship in public/fonts (all SIL Open Font License): display, typewriter, handwriting, body.
loadFont({ family: 'Archivo Black', url: staticFile('fonts/ArchivoBlack.woff2') });
loadFont({ family: 'Special Elite', url: staticFile('fonts/SpecialElite.woff2') });
loadFont({ family: 'Caveat', url: staticFile('fonts/Caveat.woff2'), weight: '400 700' });
loadFont({ family: 'Nunito', url: staticFile('fonts/Nunito-latin.woff2'), weight: '200 1000' });
const F = { display: '"Archivo Black", sans-serif', type: '"Special Elite", monospace', hand: 'Caveat, cursive', body: 'Nunito, sans-serif' };
const C = { cork: '#B4895C', paper: '#FBF7EE', manila: '#E9C987', ink: '#1E1B18', red: '#C8362B', hi: 'rgba(255,224,58,.85)', marker: '#2F5BD3', green: '#2E7D57', sticky: '#FFE27A', muted: '#6E6253' };
const TL = buildTimeline(script as any, durations as Record<string, number>);

/* ---------- motion ---------- */
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const back = (x: number) => { x = clamp(x); const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const P = (u: number, a: number, d = 0.45) => clamp((u - a) / d);
const abs = (x: number, y: number, s: React.CSSProperties = {}): React.CSSProperties => ({ position: 'absolute', left: x, top: y, ...s });

/* ---------- board pieces ---------- */
// A sheet pinned to the board: drops in from above with a small settle.
const Sheet: React.FC<{ x: number; y: number; w: number; h?: number; rot?: number; p: number; bg?: string; pin?: boolean; tape?: boolean; children?: React.ReactNode; pad?: number }> = ({ x, y, w, h, rot = 0, p, bg = C.paper, pin = true, tape = false, children, pad = 34 }) => {
  const e = back(p);
  return (
    <div style={abs(x, y, { width: w, height: h, background: bg, padding: pad, boxSizing: 'border-box', borderRadius: 6, boxShadow: '0 18px 30px rgba(30,20,10,.35), 0 3px 6px rgba(30,20,10,.25)', opacity: p > 0 ? 1 : 0, transform: `translateY(${(1 - e) * -120}px) rotate(${rot + (1 - e) * -4}deg)` })}>
      {pin ? <div style={{ position: 'absolute', left: '50%', top: -16, width: 34, height: 34, marginLeft: -17, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, #ff8a7a, ${C.red} 60%, #7a1d15)`, boxShadow: '0 4px 6px rgba(0,0,0,.35)' }} /> : null}
      {tape ? <div style={{ position: 'absolute', left: '50%', top: -22, width: 170, height: 44, marginLeft: -85, background: 'rgba(243,235,211,.85)', transform: 'rotate(-3deg)', boxShadow: '0 2px 4px rgba(0,0,0,.15)' }} /> : null}
      {children}
    </div>
  );
};
// Rubber stamp: slams down (scale 1.7 → 1) at its start time.
const Stamp: React.FC<{ x: number; y: number; text: string; p: number; rot?: number; color?: string; size?: number }> = ({ x, y, text, p, rot = -8, color = C.red, size = 64 }) => (
  <div style={abs(x, y, { fontFamily: F.display, fontSize: size, color, border: `8px double ${color}`, borderRadius: 14, padding: '6px 24px', letterSpacing: '.04em', whiteSpace: 'nowrap', background: 'rgba(251,247,238,.55)', opacity: p > 0 ? clamp(p * 3) * 0.92 : 0, transform: `rotate(${rot}deg) scale(${1 + (1 - ease(p)) * 0.7})`, mixBlendMode: 'multiply' })}>{text}</div>
);
// Highlighter sweep over a phrase.
const Hi: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ backgroundImage: `linear-gradient(${C.hi}, ${C.hi})`, backgroundRepeat: 'no-repeat', backgroundSize: `${ease(p) * 100}% 72%`, backgroundPosition: '0 70%', padding: '0 4px' }}>{children}</span>
);
// Handwriting that writes itself on (left-to-right reveal).
const Hand: React.FC<{ p: number; size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ p, size = 56, color = C.marker, children, style }) => (
  <div style={{ fontFamily: F.hand, fontWeight: 700, fontSize: size, color, lineHeight: 1.05, clipPath: `inset(-20% ${100 - ease(p) * 100}% -20% 0)`, whiteSpace: 'nowrap', ...style }}>{children}</div>
);
const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.red }) => (
  <div style={{ fontFamily: F.type, fontSize: 26, color, letterSpacing: '.08em', marginBottom: 10 }}>{children}</div>
);
// Red string between two board points, drawn on.
const String_: React.FC<{ pts: [number, number][]; p: number }> = ({ pts, p }) => {
  const d = pts.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');
  return (<svg width={1080} height={1270} style={abs(0, 0, { pointerEvents: 'none' })} aria-hidden="true">
    <path d={d} fill="none" stroke={C.red} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${ease(p)} 1`} style={{ filter: 'drop-shadow(0 3px 2px rgba(0,0,0,.35))' }} />
    {pts.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={ease(p) > (i ? 0.98 : 0.01) ? 12 : 0} fill={C.red} />)}
  </svg>);
};
const Kid: React.FC<{ color: string; label: string; s?: number }> = ({ color, label, s = 1 }) => (
  <svg width={160 * s} height={210 * s} viewBox="0 0 230 300" aria-hidden="true"><g stroke={C.ink} strokeWidth={8} strokeLinejoin="round">
    <rect x={35} y={150} width={160} height={150} rx={60} fill={color} /><circle cx={115} cy={95} r={70} fill="#F2CBA4" />
    <path d="M45 85 Q115 0 185 85 Q150 55 115 62 Q80 55 45 85Z" fill="#2F2722" />
    <circle cx={92} cy={105} r={7} fill={C.ink} stroke="none" /><circle cx={138} cy={105} r={7} fill={C.ink} stroke="none" />
    <path d="M98 130 Q115 142 132 130" fill="none" strokeWidth={6} strokeLinecap="round" /></g>
    <text x={115} y={255} textAnchor="middle" fontSize={56} fill="#fff" fontFamily={F.display}>{label}</text></svg>
);

/* ---------- real product screens, pinned as photos; result frames land when the voice says them ---------- */
type Frame = { file: string; note: string; tap: { x: number; y: number } | null };
const META = captureMeta as Record<string, { scale: number; frames: Frame[] }>;
function schedule(name: string, a: number, anchors: [number, number][], dt: number) {
  const frames = META[name].frames, times = frames.map(() => a); let prev = -1, prevT = a;
  anchors.forEach(([k, at]) => { for (let j = prev + 1; j <= k; j++) times[j] = Math.max(prevT + (j === prev + 1 && prev >= 0 ? 0.3 : 0), at - (k - j) * dt); prev = k; prevT = at; });
  return times;
}
const ToolPhoto: React.FC<{ u: number; name: string; x: number; y: number; w: number; h: number; rot?: number; a: number; anchors: [number, number][]; dt?: number; caption: string; crop: (f: Frame) => number }> = ({ u, name, x, y, w, h, rot = -1.5, a, anchors, dt = 0.07, caption, crop }) => {
  const meta = META[name], times = useMemo(() => schedule(name, a, anchors, dt), [name, a, anchors, dt]);
  let i = 0; while (i + 1 < times.length && u >= times[i + 1]) i++;
  const f = meta.frames[i], sc = (w - 36) / 1080, y0 = crop(f), tapP = f.tap && u - times[i] < 0.9 ? (u - times[i]) / 0.9 : -1;
  return (
    <Sheet x={x} y={y} w={w} rot={rot} p={P(u, a - 0.4, 0.5)} pin={false} tape pad={18} bg="#FFFFFF">
      <div style={{ position: 'relative', width: w - 36, height: h, overflow: 'hidden', background: '#f3f3f3' }}>
        <Img src={staticFile(`capture/${name}/${f.file}`)} style={{ position: 'absolute', left: 0, top: 0, width: 1080, transformOrigin: '0 0', transform: `scale(${sc}) translate(0,${-y0}px)` }} />
        {tapP >= 0 && f.tap ? <div style={{ position: 'absolute', left: f.tap.x * meta.scale * sc - 42, top: (f.tap.y * meta.scale - y0) * sc - 42, width: 84, height: 84, borderRadius: '50%', border: `7px solid ${C.red}`, boxSizing: 'border-box', opacity: 1 - tapP, transform: `scale(${0.6 + tapP * 0.7})` }} /> : null}
      </div>
      <div style={{ fontFamily: F.type, fontSize: 24, color: C.ink, marginTop: 12, letterSpacing: '.04em' }}>TOOL CHECK · {caption}</div>
    </Sheet>
  );
};

/* ---------- scenes (u = seconds into the scene, L[i] = start of line i in scene time) ---------- */
type SP = { u: number; L: number[]; sc: any };
const doc = (size = 40): React.CSSProperties => ({ fontFamily: F.body, fontWeight: 800, fontSize: size, color: C.ink, lineHeight: 1.35 });
const SCENES: Record<string, React.FC<SP>> = {
  open: ({ u, L }) => {
    const fold = ease(P(u, L[1] + 0.2, 0.7));
    return (<>
      <Sheet x={120} y={60} w={840} rot={-3} p={P(u, 0.1, 0.6)} bg={C.sticky} pin pad={44}>
        <div style={{ fontFamily: F.hand, fontWeight: 700, fontSize: 64, lineHeight: 1.12, color: C.ink }}>“My kid is sitting an extra university interview on top of the gaokao. Does it actually change anything?”</div>
        <div style={{ fontFamily: F.hand, fontSize: 44, color: C.muted, marginTop: 14, textAlign: 'right' }}>— a parent</div>
      </Sheet>
      <div style={abs(140, 700, { width: 800, height: 470, opacity: P(u, L[1] - 0.2) > 0 ? 1 : 0, transform: `translateY(${(1 - ease(P(u, L[1] - 0.2, 0.5))) * 200}px)` })}>
        <div style={{ position: 'absolute', left: 0, top: 40, width: 800, height: 430, background: '#D9B672', borderRadius: 10, boxShadow: '0 20px 34px rgba(0,0,0,.35)' }} />
        <div style={{ position: 'absolute', left: 30, top: 70, width: 740, height: 380, background: C.paper, borderRadius: 4, padding: 30, boxSizing: 'border-box' }}>
          <Label>CASE NO. 2026-JS-01</Label><div style={doc(44)}>Subject: comprehensive evaluation admissions</div>
          <div style={{ ...doc(34), color: C.muted, marginTop: 10 }}>Jurisdictions: Jiangsu, Guangdong</div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 40, width: 800, height: 430, background: C.manila, borderRadius: 10, transformOrigin: '50% 0', transform: `perspective(1600px) rotateX(${fold * 82}deg)`, boxShadow: 'inset 0 -6px 0 rgba(0,0,0,.08)', display: 'grid', placeItems: 'center' }}>
          <div style={{ fontFamily: F.display, fontSize: 64, color: '#7A5B26', letterSpacing: '.06em' }}>CASE FILE</div>
        </div>
        <div style={{ position: 'absolute', left: 40, top: 0, width: 260, height: 56, background: C.manila, borderRadius: '10px 10px 0 0', fontFamily: F.type, fontSize: 26, display: 'grid', placeItems: 'center', color: '#5c4319' }}>ADMISSIONS</div>
      </div>
      <Stamp x={600} y={1010} text="OPEN" p={P(u, L[1] + 0.9, 0.35)} rot={-10} />
    </>);
  },
  exhibitA: ({ u, L }) => (<>
    <Sheet x={80} y={40} w={920} rot={1.2} p={P(u, 0.1, 0.6)}>
      <Label>EXHIBIT A · TRANSLATED EXCERPT</Label>
      <div style={{ ...doc(34), color: C.muted }}>XJTLU · 2026 · Jiangsu comprehensive evaluation brochure, section 8</div>
      <div style={{ ...doc(44), marginTop: 22 }}>Composite score: <Hi p={P(u, L[0] + 2.4, 0.6)}>out of 100</Hi></div>
      <div style={{ ...doc(44), marginTop: 10 }}>Gaokao score, scaled to 100: <Hi p={P(u, L[1] + 0.9, 0.6)}>65%</Hi></div>
      <div style={{ ...doc(44), marginTop: 10 }}>University interview: <Hi p={P(u, L[1] + 2.6, 0.6)}>35%</Hi></div>
    </Sheet>
    <Sheet x={140} y={640} w={800} rot={-2} p={P(u, L[1] + 0.4, 0.6)} bg="#FFFFFF" pin={false} tape pad={30}>
      <Hand p={P(u, L[1] + 0.8, 0.8)} size={52} color={C.ink}>the composite, drawn out:</Hand>
      <div style={{ display: 'flex', height: 120, marginTop: 18, border: `5px solid ${C.ink}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ flexBasis: `${ease(P(u, L[1] + 1.2, 1)) * 65}%`, background: C.marker, color: '#fff', fontFamily: F.display, fontSize: 40, display: 'grid', placeItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden' }}>GAOKAO 65</div>
        <div style={{ flexBasis: `${ease(P(u, L[1] + 2.8, 1)) * 35}%`, background: C.red, color: '#fff', fontFamily: F.display, fontSize: 30, display: 'grid', placeItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden' }}>INTERVIEW 35</div>
      </div>
    </Sheet>
  </>),
  recon: ({ u, L }) => {
    const card = (k: string, col: string, g: number, iv: number, x: number, d: number) => (
      <Sheet x={x} y={250} w={420} rot={k === 'A' ? -2 : 2} p={P(u, L[0] + d, 0.6)} pad={26}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}><Kid color={col} label={k} s={0.8} /><Label color={C.ink}>STUDENT {k}</Label></div>
        <Hand p={P(u, L[0] + d + 1.6, 0.7)} size={58}>gaokao {g}</Hand>
        <Hand p={P(u, L[0] + d + 2.4, 0.7)} size={58}>interview {iv}</Hand>
      </Sheet>);
    return (<>
      <div style={abs(50, 30, { width: 980, height: 820, background: '#FDFDFB', border: '14px solid #9EA3A8', borderRadius: 14, boxShadow: '0 18px 30px rgba(0,0,0,.3)', opacity: ease(P(u, 0, 0.4)) })}>
        <div style={{ position: 'absolute', left: 30, top: 24, fontFamily: F.type, fontSize: 30, color: C.muted, letterSpacing: '.08em' }}>RECONSTRUCTION</div>
      </div>
      {card('A', C.marker, 600, 90, 80, 1.2)}{card('B', '#2E8C8C', 615, 70, 570, 2.2)}
      <Stamp x={300} y={900} text="HYPOTHETICAL" p={P(u, 0.6, 0.35)} rot={-6} />
    </>);
  },
  tool1: ({ u, sc }) => {
    const g = sc.lines[0].segs, rel = (x: number) => x - sc.start;
    const anchors: [number, number][] = [[8, rel(g[0].start) + 1.3], [16, rel(g[g.length - 1].end) - 1.0]];
    const t = schedule('A-calculator', 0, anchors, 0.07), L1 = sc.lines[1].start - sc.start;
    return (<>
      <ToolPhoto u={u} name="A-calculator" x={70} y={30} w={640} h={700} rot={-1.5} a={0} anchors={anchors} caption="score calculator · web beta" crop={() => 560} />
      <Sheet x={740} y={120} w={280} rot={3} p={u >= t[8] ? P(u, t[8], 0.4) : 0} bg={C.sticky} pad={22}><Hand p={P(u, t[8] + 0.1, 0.5)} size={60}>A = 83.50</Hand></Sheet>
      <Sheet x={740} y={380} w={280} rot={-3} p={u >= t[16] ? P(u, t[16], 0.4) : 0} bg={C.sticky} pad={22}><Hand p={P(u, t[16] + 0.1, 0.5)} size={60}>B = 77.80</Hand></Sheet>
      <Sheet x={160} y={860} w={760} rot={-1} p={P(u, L1, 0.5)} pad={28}><div style={{ fontFamily: F.hand, fontWeight: 700, fontSize: 56, color: C.ink, lineHeight: 1.1 }}>B led by 15 gaokao points — and still finishes <span style={{ color: C.red }}>behind</span>.</div></Sheet>
      <String_ pts={[[880, 230], [880, 480]]} p={P(u, t[16] + 0.4, 0.6)} />
      <div style={abs(470, 800, { fontFamily: F.type, fontSize: 22, color: '#fff', opacity: u >= t[8] ? 0.9 : 0 })}>gaokao scaled from 750 · illustration</div>
    </>);
  },
  finding1: ({ u }) => (<>
    <Sheet x={110} y={200} w={860} rot={-1.5} p={P(u, 0.1, 0.6)} pad={46}>
      <Label>FINDING 1</Label>
      <div style={{ fontFamily: F.display, fontSize: 76, lineHeight: 1.05, color: C.ink }}>The interview is points you can <span style={{ color: C.red }}>prepare for.</span></div>
    </Sheet>
    <Sheet x={560} y={760} w={380} rot={4} p={P(u, 1.2, 0.5)} bg={C.sticky} pad={26}><Hand p={P(u, 1.5, 0.8)} size={50} color={C.ink}>(the gaokao still</Hand><Hand p={P(u, 2.1, 0.8)} size={50} color={C.ink}>counts for more)</Hand></Sheet>
  </>),
  caveats: ({ u, L }) => {
    const mx = interpolate(u, [L[1], L[1] + 1.4], [120, 520], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return (<>
      <Stamp x={170} y={60} text="PREDICTS NOTHING" p={P(u, 1.6, 0.35)} rot={-7} size={70} />
      <Sheet x={80} y={360} w={920} rot={1} p={P(u, L[1] - 0.4, 0.6)}>
        <Label>EXHIBIT A · SECTION 8.1 · TRANSLATED</Label>
        <div style={doc(44)}>The gaokao score must be no lower than the <Hi p={P(u, L[1] + 1.6, 0.7)}>special-category control line</Hi> for the province.</div>
      </Sheet>
      <div style={abs(mx, 380, { width: 230, height: 230, borderRadius: '50%', border: `16px solid ${C.ink}`, background: 'rgba(255,255,255,.18)', boxShadow: 'inset 0 0 0 4px rgba(255,255,255,.5), 0 10px 18px rgba(0,0,0,.3)', opacity: P(u, L[1], 0.3) })}>
        <div style={{ position: 'absolute', right: -86, bottom: -86, width: 120, height: 30, background: C.ink, borderRadius: 15, transform: 'rotate(45deg)' }} />
      </div>
      <Sheet x={160} y={860} w={760} rot={-2} p={P(u, L[1] + 2.4, 0.5)} bg={C.sticky} pad={26}><Hand p={P(u, L[1] + 2.7, 0.7)} size={52} color={C.ink}>miss the line →</Hand><Hand p={P(u, L[1] + 3.3, 0.8)} size={52} color={C.ink}>comprehensive evaluation can't help</Hand></Sheet>
    </>);
  },
  exhibitBC: ({ u, L }) => (<>
    <Sheet x={50} y={30} w={480} rot={-2} p={P(u, 0.2, 0.6)} pad={28}>
      <Label>EXHIBIT B · XJTLU</Label>
      <div style={doc(34)}>Not admitted through comprehensive evaluation? You can still apply in the <Hi p={P(u, L[0] + 3, 0.7)}>regular undergraduate round</Hi>.</div>
    </Sheet>
    <Sheet x={560} y={70} w={470} rot={2} p={P(u, L[1] - 0.3, 0.6)} pad={28}>
      <Label>EXHIBIT C · CUHK-SHENZHEN</Label>
      <div style={doc(34)}>Not admitted? It <Hi p={P(u, L[1] + 1.2, 0.6)}>does not affect</Hi> your later applications.</div>
      <div style={{ fontFamily: F.type, fontSize: 20, color: C.muted, marginTop: 10 }}>Jiangsu and Guangdong brochures, translated</div>
    </Sheet>
    <String_ pts={[[290, 470], [540, 860]]} p={P(u, L[2] - 0.2, 0.7)} />
    <String_ pts={[[795, 470], [540, 860]]} p={P(u, L[2], 0.7)} />
    <Sheet x={190} y={840} w={700} rot={-1} p={P(u, L[2] + 0.4, 0.5)} pad={36}>
      <Label>FINDING 2</Label>
      <div style={{ fontFamily: F.display, fontSize: 64, lineHeight: 1.05 }}>One more <span style={{ color: C.red }}>chance</span> to be admitted.</div>
    </Sheet>
  </>),
  jurisdiction: ({ u, L }) => {
    const l1 = L[1], anchors: [number, number][] = [[1, l1 - 0.9], [2, l1 - 0.2], [3, l1 + 0.7]];
    const t = schedule('B-province', 0.8, anchors, 0.07);
    const tab = (x: number, text: string, d: number, col: string) => (
      <div style={abs(x, 20, { width: 420, height: 120, background: col, borderRadius: '14px 14px 6px 6px', boxShadow: '0 12px 20px rgba(0,0,0,.3)', fontFamily: F.display, fontSize: 52, display: 'grid', placeItems: 'center', color: '#3d2c10', ...{ opacity: P(u, d) > 0 ? 1 : 0, transform: `translateY(${(1 - back(P(u, d, 0.5))) * -100}px)` } })}>{text}</div>);
    return (<>
      {tab(70, 'JIANGSU', 0, C.manila)}{tab(590, 'GUANGDONG', 0.3, '#F2B48A')}
      <ToolPhoto u={u} name="B-province" x={150} y={200} w={780} h={640} rot={1} a={0.8} anchors={anchors} caption="switching province · web beta" crop={(f) => (/速记/.test(f.note) ? 310 : 0)} />
      <Sheet x={60} y={960} w={460} rot={-3} p={P(u, l1 + 0.2, 0.5)} bg={C.sticky} pad={22}><Hand p={P(u, l1 + 0.4, 0.8)} size={48} color={C.ink}>JS: 65 / 35 · May 10</Hand></Sheet>
      <Sheet x={560} y={960} w={480} rot={2} p={u >= t[3] ? P(u, t[3], 0.5) : 0} bg="#FFD2B8" pad={22}><Hand p={P(u, t[3] + 0.2, 0.8)} size={48} color={C.ink}>GD: 65 / 30 / 5 · May 20</Hand></Sheet>
    </>);
  },
  calendar: ({ u }) => {
    const days: [string, string, number][] = [['APR 20', 'applications open', 0.6], ['MAY 10 / 20', 'deadline (JS / GD)', 1.5], ['JUN 7', 'gaokao begins', 2.4], ['JUN 16–18', 'interview (planned)', 3.3]];
    return (<>
      <Sheet x={70} y={30} w={940} rot={0.8} p={P(u, 0, 0.5)} pad={34}>
        <Label>EXHIBIT A · TIMELINE · XJTLU 2026</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22, marginTop: 10 }}>
          {days.map(([d, w, at]) => (
            <div key={d} style={{ position: 'relative', border: `4px solid ${C.ink}`, borderRadius: 10, padding: '18px 20px', background: '#fff' }}>
              <div style={{ fontFamily: F.display, fontSize: 44 }}>{d}</div>
              <div style={{ ...doc(30), color: C.muted }}>{w}</div>
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: -10, width: 'calc(100% + 20px)', height: 'calc(100% + 20px)' }} aria-hidden="true">
                <ellipse cx={50} cy={50} rx={47} ry={44} fill="none" stroke={C.red} strokeWidth={2.2} pathLength={1} strokeDasharray={`${ease(P(u, at, 0.6))} 1`} vectorEffect="non-scaling-stroke" style={{ strokeWidth: 6 }} />
              </svg>
            </div>))}
        </div>
      </Sheet>
      <Sheet x={140} y={760} w={800} rot={-2} p={P(u, 4.0, 0.5)} bg={C.sticky} pad={28}><Hand p={P(u, 4.2, 0.9)} size={48} color={C.ink}>CUHK-Shenzhen: test after the gaokao,</Hand><Hand p={P(u, 4.9, 0.8)} size={48} color={C.ink}>before scores come out</Hand></Sheet>
    </>);
  },
  exhibitD: ({ u, L }) => (<>
    <Sheet x={70} y={40} w={940} rot={-1} p={P(u, 0.1, 0.6)} pad={40}>
      <Label>EXHIBIT D · INTERVIEW · TRANSLATED</Label>
      <div style={doc(46)}>“The interview assesses English proficiency, overall competence and general ability. It <Hi p={P(u, L[0] + 4.2, 0.7)}>does not test subject knowledge</Hi>.”</div>
      <div style={{ fontFamily: F.type, fontSize: 22, color: C.muted, marginTop: 14 }}>XJTLU 2026 brochures, Jiangsu and Guangdong</div>
    </Sheet>
    <Sheet x={150} y={680} w={780} rot={2} p={P(u, L[1], 0.5)} bg={C.sticky} pad={34}>
      <Hand p={P(u, L[1] + 0.3, 0.6)} size={70} color={C.ink}>a view</Hand>
      <Hand p={P(u, L[1] + 1.0, 0.5)} size={70} color={C.red} style={{ marginLeft: 120 }}>+ because</Hand>
      <Hand p={P(u, L[1] + 1.6, 0.6)} size={70} color={C.ink} style={{ marginLeft: 240 }}>+ the reason</Hand>
    </Sheet>
  </>),
  tool2: ({ u, sc }) => {
    const L0 = sc.lines[0], rel = (x: number) => x - sc.start;
    const anchors: [number, number][] = [[35, rel(L0.start) + 2.0], [76, rel(L0.end) - 0.1]];
    const t = schedule('C-drill', 0, anchors, 0.045);
    return (<>
      <ToolPhoto u={u} name="C-drill" x={110} y={20} w={860} h={900} rot={-1} a={0} dt={0.045} anchors={anchors} caption="5-minute practice · web beta" crop={(f) => (/练习题/.test(f.note) ? 120 : 180)} />
      <Stamp x={150} y={1060} text="PRACTICE NOTE · NOT A SCORE" p={u >= t[76] ? P(u, t[76] + 0.4, 0.35) : 0} rot={-4} size={44} />
    </>);
  },
  verdict: ({ u, L }) => {
    const rows = ['your province', 'the control line', 'time to prepare'];
    return (<>
      <Sheet x={70} y={30} w={940} rot={0.6} p={P(u, 0.1, 0.6)} pad={44}>
        <Label>VERDICT · CASE NO. 2026-JS-01</Label>
        <div style={{ fontFamily: F.display, fontSize: 70, lineHeight: 1.05 }}>+1 assessment.<br />+1 <span style={{ color: C.red }}>chance</span>.</div>
        <div style={{ ...doc(36), color: C.muted, marginTop: 14 }}>Paid for with a threshold, time and preparation.</div>
        <div style={{ borderTop: `3px dashed ${C.muted}`, marginTop: 26, paddingTop: 20, display: 'grid', gap: 12 }}>
          <div style={{ fontFamily: F.type, fontSize: 28, letterSpacing: '.06em' }}>BEFORE YOU APPLY, CHECK:</div>
          {rows.map((r, i) => (
            <div key={r} style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <span style={{ width: 54, height: 54, border: `5px solid ${C.ink}`, borderRadius: 8, position: 'relative', flex: 'none' }}>
                <span style={{ position: 'absolute', left: -2, top: -16, fontFamily: F.hand, fontWeight: 700, fontSize: 80, color: C.red, lineHeight: 1, clipPath: `inset(0 ${100 - ease(P(u, L[1] + 2.0 + i * 1.3, 0.4)) * 100}% 0 0)` }}>✓</span>
              </span>
              <span style={{ ...doc(46), opacity: ease(P(u, L[1] + 1.4 + i * 1.3, 0.4)) }}>{r}</span>
            </div>))}
        </div>
      </Sheet>
      <Stamp x={330} y={960} text="CASE CLOSED" p={P(u, L[1] + 6.0, 0.35)} rot={-9} size={80} />
    </>);
  },
};

const TAGS: Record<string, [string, string]> = {
  product: ['TOOL CHECK', 'real product screen · esssouth web beta · demo account'],
  example: ['RECONSTRUCTION', 'hypothetical · predicts nothing'],
  advice: ['CASE NOTE', 'our reading · esssouth, not affiliated with the universities'],
};
const Cap: React.FC<{ text: string }> = ({ text }) => <>{text.split(/\[\[(.+?)\]\]/).map((s, i) => (i % 2 ? <span key={i} style={{ backgroundImage: `linear-gradient(${C.hi}, ${C.hi})`, backgroundSize: '100% 70%', backgroundPosition: '0 75%', backgroundRepeat: 'no-repeat', padding: '0 4px' }}>{s}</span> : <React.Fragment key={i}>{s}</React.Fragment>))}</>;

export const CaseFile: React.FC<{ music: boolean; voice: boolean }> = ({ music, voice }) => {
  const frame = useCurrentFrame(), t = frame / FPS, total = TL.total * FPS;
  const sc = TL.scenes.find((s) => t >= s.start && t < s.end) || TL.scenes[TL.scenes.length - 1];
  const u = t - sc.start, L = sc.lines.map((l) => l.start - sc.start), Scene = SCENES[sc.id];
  const ln = sc.lines.find((l) => t >= l.start && t < l.end + TL.GAP) || sc.lines.filter((l) => t >= l.start).pop() || sc.lines[0];
  const seg = ln.segs.find((s) => t >= s.start && t < s.end + TL.GAP * 0.9);
  const tag = ln.kind === 'policy' ? ['EVIDENCE', 'official rule · ' + (sc.src || []).map((k: string) => (script as any).sources[k][2]).join(' / ')] : TAGS[ln.kind];
  const out = 1 - ease(P(u, sc.end - sc.start - 0.3, 0.3)), into = ease(P(u, 0, 0.3));
  return (
    <AbsoluteFill style={{ background: C.cork, fontFamily: F.body, color: C.ink }}>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(70,40,15,.28) 2px, transparent 2.6px), radial-gradient(rgba(255,235,200,.18) 1.5px, transparent 2px)', backgroundSize: '23px 19px, 31px 37px', backgroundPosition: '0 0, 11px 7px' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(40,22,8,.45) 100%)' }} />
      <div style={abs(50, 52, { display: 'flex', alignItems: 'stretch', width: 980 })}>
        <div style={{ background: C.manila, borderRadius: '12px 0 0 12px', padding: '12px 18px', fontFamily: F.type, fontSize: 24, color: '#5c4319', display: 'grid', placeItems: 'center', boxShadow: '0 8px 14px rgba(0,0,0,.25)' }}>CASE FILE</div>
        <div style={{ background: C.paper, borderRadius: '0 12px 12px 0', padding: '12px 20px', fontFamily: F.display, fontSize: 30, lineHeight: 1.15, boxShadow: '0 8px 14px rgba(0,0,0,.25)', flex: 1 }}>Does the extra interview actually change anything?</div>
      </div>
      <div style={abs(0, 200, { width: 1080, height: 1270, opacity: Math.min(into, out), transform: `translateX(${(1 - out) * -60}px)` })}><Scene u={u} L={L} sc={sc} /></div>
      <div style={abs(60, 1496, { width: 960, minHeight: 236, background: C.paper, borderRadius: 6, boxShadow: '0 16px 26px rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 44px', boxSizing: 'border-box', fontSize: 50, fontWeight: 800, lineHeight: 1.3, opacity: seg ? 1 : 0 })}>
        <div style={{ position: 'absolute', left: 60, top: -20, width: 150, height: 40, background: 'rgba(243,235,211,.9)', transform: 'rotate(-4deg)' }} />
        <div style={{ position: 'absolute', right: 60, top: -20, width: 150, height: 40, background: 'rgba(243,235,211,.9)', transform: 'rotate(5deg)' }} />
        <div>{seg ? <Cap text={seg.text} /> : null}</div>
      </div>
      <div style={abs(60, 1800, { width: 960, display: 'flex', gap: 14, alignItems: 'center', fontFamily: F.type, fontSize: 24, color: '#FFF4E0' })}>
        <b style={{ background: C.ink, color: '#FFF4E0', padding: '4px 14px', borderRadius: 6, whiteSpace: 'nowrap', fontWeight: 400 }}>{tag[0]}</b>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 2px 3px rgba(0,0,0,.4)' }}>{tag[1]}</span>
      </div>
      {voice ? TL.lines.map((l) => (
        <Sequence key={l.id} from={Math.round(l.start * FPS)} durationInFrames={Math.ceil((l.end - l.start) * FPS) + 3}><Audio src={staticFile(`voice/${l.id}.wav`)} /></Sequence>
      )) : null}
      {music ? <Audio src={staticFile('bgm.wav')} volume={(f) => interpolate(f, [0, 45, total - 90, total], [0, voice ? 0.14 : 0.5, voice ? 0.14 : 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /> : null}
    </AbsoluteFill>
  );
};
