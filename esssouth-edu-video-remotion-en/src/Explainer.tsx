// What does comprehensive evaluation actually give you? — English explainer, 1080×1920 @ 30 fps.
// Flash-style 2D: cream ground, ink outlines, offset shadows. Every visual is a function of time (useCurrentFrame),
// voice clips sit at their line starts, product footage is the real esssouth web beta captured frame by frame.
import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/fonts';
import script from './script.json';
import durations from './durations.json';
import captureMeta from './capture-meta.json';
import { buildTimeline, FPS, plain } from './timeline.js';

// Nunito (SIL Open Font License), shipped in public/fonts so renders never depend on a font server.
const fontFamily = 'Nunito';
loadFont({ family: 'Nunito', url: staticFile('fonts/Nunito-latin.woff2'), weight: '200 1000' });
const C = { cream: '#FFF4E0', ink: '#1F1A17', coral: '#EF6A4B', yellow: '#FFC93C', blue: '#4B7BE5', teal: '#2E8C8C', rose: '#D45D7A', green: '#3C9D6B', muted: '#6B6259' };
const TL = buildTimeline(script as any, durations as Record<string, number>);

/* ---------- motion helpers ---------- */
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const back = (x: number) => { x = clamp(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const P = (u: number, a: number, d = 0.45) => clamp((u - a) / d);
const pop = (p: number, extra = ''): React.CSSProperties => ({ opacity: p > 0 ? 1 : 0, transform: `${extra} scale(${0.6 + 0.4 * back(p)})` });
const slide = (p: number, dx = 0, dy = 60): React.CSSProperties => { const e = ease(p); return { opacity: e, transform: `translate(${(1 - e) * dx}px,${(1 - e) * dy}px)` }; };

/* ---------- shapes ---------- */
const abs = (x: number, y: number, s: React.CSSProperties = {}): React.CSSProperties => ({ position: 'absolute', left: x, top: y, ...s });
const boxS: React.CSSProperties = { background: '#fff', border: `5px solid ${C.ink}`, borderRadius: 30, boxShadow: `10px 10px 0 ${C.ink}`, boxSizing: 'border-box' };
const chipS = (bg = '#fff', color = C.ink, fs = 40): React.CSSProperties => ({ border: `4px solid ${C.ink}`, borderRadius: 20, padding: '10px 22px', fontSize: fs, fontWeight: 900, background: bg, color, boxShadow: `6px 6px 0 ${C.ink}`, whiteSpace: 'nowrap' });
const stampS = (fs = 52): React.CSSProperties => ({ border: `7px solid ${C.coral}`, color: C.coral, borderRadius: 22, padding: '8px 26px', fontSize: fs, fontWeight: 900, background: 'rgba(255,255,255,.92)', whiteSpace: 'nowrap' });
const Hl: React.FC<{ text: string }> = ({ text }) => <>{text.split(/\[\[(.+?)\]\]/).map((s, i) => (i % 2 ? <span key={i} style={{ color: C.coral, fontWeight: 900 }}>{s}</span> : <React.Fragment key={i}>{s}</React.Fragment>))}</>;

const Kid: React.FC<{ color: string; label: string; scale?: number }> = ({ color, label, scale = 1 }) => (
  <svg width={230 * scale} height={330 * scale} viewBox="0 0 230 330" aria-hidden="true">
    <g stroke={C.ink} strokeWidth={7} strokeLinejoin="round">
      <rect x={35} y={150} width={160} height={170} rx={60} fill={color} /><circle cx={115} cy={95} r={70} fill="#F6CFA8" />
      <path d="M45 85 Q115 0 185 85 Q150 55 115 62 Q80 55 45 85Z" fill="#2F2722" />
      <circle cx={92} cy={105} r={7} fill={C.ink} stroke="none" /><circle cx={138} cy={105} r={7} fill={C.ink} stroke="none" />
      <path d="M98 130 Q115 142 132 130" fill="none" strokeWidth={6} strokeLinecap="round" />
    </g>
    <text x={115} y={262} textAnchor="middle" fontSize={50} fontWeight={900} fill="#fff" fontFamily={fontFamily}>{label}</text>
  </svg>
);

/* ---------- real product footage: frames placed by anchors so results land when the voice says them ---------- */
type Frame = { file: string; note: string; tap: { x: number; y: number } | null };
const META = captureMeta as Record<string, { scale: number; frames: Frame[] }>;
function schedule(name: string, a: number, anchors: [number, number][], dt: number) {
  const frames = META[name].frames, times = frames.map(() => a); let prev = -1, prevT = a;
  anchors.forEach(([k, at]) => { for (let j = prev + 1; j <= k; j++) times[j] = Math.max(prevT + (j === prev + 1 && prev >= 0 ? 0.3 : 0), at - (k - j) * dt); prev = k; prevT = at; });
  return times;
}
const Product: React.FC<{ u: number; name: string; top: number; h: number; a: number; anchors: [number, number][]; dt?: number; label: string; crop: (f: Frame) => number }> = ({ u, name, top, h, a, anchors, dt = 0.07, label, crop }) => {
  const meta = META[name], times = useMemo(() => schedule(name, a, anchors, dt), [name, a, anchors, dt]);
  let i = 0; while (i + 1 < times.length && u >= times[i + 1]) i++;
  const f = meta.frames[i], sc = 900 / 1080, y0 = crop(f), pin = ease(P(u, a - 0.5, 0.5));
  const tapP = f.tap && u - times[i] < 0.9 ? (u - times[i]) / 0.9 : -1;
  return (
    <>
      <div style={abs(90, top - 60, { background: C.ink, color: '#fff', borderRadius: 14, padding: '6px 18px', fontSize: 28, fontWeight: 900, opacity: pin })}>Real product screen · {label}</div>
      <div style={abs(90, top, { width: 900, height: h, background: '#fff', border: `6px solid ${C.ink}`, borderRadius: 36, boxShadow: `12px 12px 0 ${C.ink}`, overflow: 'hidden', opacity: pin, transform: `translateY(${(1 - pin) * 50}px)` })}>
        <Img src={staticFile(`capture/${name}/${f.file}`)} style={{ position: 'absolute', left: 0, top: 0, width: 1080, transformOrigin: '0 0', transform: `scale(${sc}) translate(0,${-y0}px)` }} />
        {tapP >= 0 && f.tap ? <div style={{ position: 'absolute', left: f.tap.x * meta.scale * sc - 45, top: (f.tap.y * meta.scale - y0) * sc - 45, width: 90, height: 90, borderRadius: '50%', border: `8px solid ${C.coral}`, boxSizing: 'border-box', opacity: 1 - tapP, transform: `scale(${0.6 + tapP * 0.7})` }} /> : null}
      </div>
    </>
  );
};

/* ---------- scenes (u = seconds since scene start, L[i] = line i start in scene time) ---------- */
type SceneProps = { u: number; L: number[]; sc: any };
const SCENES: Record<string, React.FC<SceneProps>> = {
  hook: ({ u, L }) => {
    const d = P(u, L[0] + 1.6, 0.6);
    return (<>
      <div style={abs(170, 520, slide(P(u, 0), -60, 0))}><Kid color={C.blue} label="A" /></div>
      <div style={abs(680, 520, slide(P(u, 0.15), 60, 0))}><Kid color={C.teal} label="B" /></div>
      <div style={abs(180, 420, { ...chipS(), ...pop(P(u, 0.4)) })}>Gaokao</div>
      <div style={abs(690, 420, { ...chipS(), ...pop(P(u, 0.5)) })}>Gaokao</div>
      <div style={abs(90, 260, { ...chipS(C.yellow), opacity: d > 0 ? 1 : 0, transform: `translateY(${(1 - back(d)) * -220}px) rotate(-4deg)` })}>+ University interview</div>
      <div style={abs(740, 20, { fontSize: 300, fontWeight: 900, color: C.coral, WebkitTextStroke: `8px ${C.ink}`, ...pop(P(u, L[1]), `rotate(${Math.sin(u * 3) * 6}deg)`) })}>?</div>
      <div style={abs(90, 900, { ...boxS, width: 900, padding: '26px 34px', textAlign: 'center', fontSize: 62, fontWeight: 900, lineHeight: 1.15, ...slide(P(u, L[1] + 0.3)) })}>What does that interview<br /><span style={{ color: C.coral }}>actually give them?</span></div>
    </>);
  },
  define: ({ u, L }) => {
    const w1 = 890 * 0.65 * ease(P(u, L[2], 0.9)), w2 = 890 * 0.35 * ease(P(u, L[2] + 2.2, 0.9));
    return (<>
      <div style={abs(60, 90, { display: 'flex', gap: '18px 14px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', width: 960 })}>
        <span style={{ ...chipS(C.blue, '#fff', 38), ...pop(P(u, 0.3)) }}>Gaokao score</span>
        <span style={{ fontSize: 70, fontWeight: 900, ...pop(P(u, 0.7)) }}>+</span>
        <span style={{ ...chipS(C.teal, '#fff', 38), ...pop(P(u, 1.0)) }}>University assessment</span>
        <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}><span style={{ fontSize: 70, fontWeight: 900, ...pop(P(u, 2.0)) }}>=</span>
        <span style={{ ...chipS(C.yellow, C.ink, 38), ...pop(P(u, 2.3)) }}>Composite score</span></span>
      </div>
      <div style={abs(90, 400, { ...chipS('#fff', C.ink, 34), borderRadius: 999, ...pop(P(u, L[1])) })}>XJTLU · 2026 · Jiangsu</div>
      <div style={abs(560, 400, { ...chipS(C.yellow, C.ink, 34), borderRadius: 999, ...pop(P(u, L[1] + 1.2)) })}>Out of 100</div>
      <div style={abs(90, 580, { ...boxS, width: 900, height: 200, overflow: 'hidden', borderRadius: 26, ...slide(P(u, L[1] + 1.6), 0, 40) })}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: w1, background: C.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, fontWeight: 900, borderRight: `5px solid ${C.ink}`, boxSizing: 'border-box', overflow: 'hidden', whiteSpace: 'nowrap' }}>Gaokao 65%</div>
        <div style={{ position: 'absolute', left: w1, top: 0, height: '100%', width: w2, background: C.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 900, overflow: 'hidden', whiteSpace: 'nowrap' }}>Interview 35%</div>
      </div>
      <div style={abs(90, 830, { fontSize: 34, fontWeight: 800, ...slide(P(u, L[2] + 0.6)) })}>Gaokao: scaled to 100 points</div>
      <div style={abs(90, 885, { fontSize: 34, fontWeight: 800, width: 900, textAlign: 'right', ...slide(P(u, L[2] + 2.6)) })}>Interview: scored out of 100</div>
    </>);
  },
  example: ({ u, L }) => {
    const card = (k: string, col: string, g: number, iv: number, x: number, delay: number) => {
      const n = ease(P(u, L[0] + 0.5 + delay, 1.2));
      return (<div style={abs(x, 300, { ...boxS, width: 450, padding: 26, display: 'flex', gap: 18, alignItems: 'center', ...slide(P(u, L[0] + delay), x < 300 ? -80 : 80, 0) })}>
        <Kid color={col} label={k} scale={0.6} />
        <div style={{ display: 'grid', gap: 6, fontWeight: 900, whiteSpace: 'nowrap' }}><span style={{ fontSize: 46 }}>Student {k}</span><span style={{ fontSize: 34 }}>Gaokao {Math.round(g * n)}</span><span style={{ fontSize: 34 }}>Interview {Math.round(iv * n)}</span></div>
      </div>);
    };
    return (<>
      <div style={abs(300, 60, { ...stampS(), ...pop(P(u, 0.1), 'rotate(-6deg)') })}>Hypothetical</div>
      {card('A', C.blue, 600, 90, 70, 0)}{card('B', C.teal, 615, 70, 570, 0.4)}
    </>);
  },
  calc: ({ u, sc }) => {
    const g = sc.lines[0].segs, rel = (x: number) => x - sc.start;
    const anchors: [number, number][] = [[8, rel(g[0].start) + 1.5], [16, rel(g[g.length - 1].end) - 1.2]];
    const times = schedule('A-calculator', 0, anchors, 0.07);
    const shownA = u >= times[8], shownB = u >= times[16];
    return (<>
      <Product u={u} name="A-calculator" top={90} h={900} a={0} anchors={anchors} label="score calculator (web beta)" crop={() => 520} />
      <div style={abs(90, 1040, { ...chipS(C.blue, '#fff'), ...pop(shownA ? P(u, times[8]) : 0) })}>A 83.50</div>
      <div style={abs(380, 1040, { ...chipS(C.teal, '#fff'), ...pop(shownB ? P(u, times[16]) : 0) })}>B 77.80</div>
      <div style={abs(670, 1058, { fontSize: 27, fontWeight: 800, color: C.muted, opacity: shownA ? 1 : 0 })}>Gaokao scaled from 750 · illustration</div>
    </>);
  },
  first: ({ u }) => {
    const tilt = Math.sin(u * 2.2) * 3;
    return (<>
      <div style={abs(90, 40, { ...chipS(C.yellow, C.ink, 46), borderRadius: 999, ...pop(P(u, 0)) })}>First</div>
      <div style={abs(160, 600, { width: 760, height: 26, background: C.ink, borderRadius: 13, ...slide(P(u, 0.2), 0, 30), transform: `${slide(P(u, 0.2), 0, 30).transform} rotate(${tilt}deg)` })} />
      <div style={abs(470, 626, { width: 0, height: 0, borderLeft: '70px solid transparent', borderRight: '70px solid transparent', borderBottom: `120px solid ${C.ink}`, ...slide(P(u, 0.2), 0, 30) })} />
      <div style={abs(170, 470, { ...chipS(C.blue, '#fff', 44), ...pop(P(u, 0.5), `translateY(${-tilt * 6}px)`) })}>Gaokao</div>
      <div style={abs(700, 470, { ...chipS(C.teal, '#fff', 44), ...pop(P(u, 0.8), `translateY(${tilt * 6}px)`) })}>Interview</div>
      <div style={abs(90, 820, { ...boxS, width: 900, padding: '26px 34px', textAlign: 'center', fontSize: 56, fontWeight: 900, lineHeight: 1.15, ...slide(P(u, 1.2)) })}>Beyond the gaokao:<br /><span style={{ color: C.coral }}>points you can earn</span><br />by preparing</div>
    </>);
  },
  caveat: ({ u, L }) => {
    const j = clamp((u - L[0] - 1.6) / 1.4);
    return (<>
      <div style={abs(170, 50, { ...stampS(50), ...pop(P(u, 0.1), 'rotate(-5deg)') })}>Example ≠ admission result</div>
      <div style={abs(90, 720, { width: 900, height: 12, background: C.coral, borderRadius: 6, ...slide(P(u, L[0] + 0.6), -200, 0) })} />
      <div style={abs(230, 750, { ...chipS('#fff', C.ink, 34), borderRadius: 999, ...pop(P(u, L[0] + 1.0)) })}>Special-category control line</div>
      <div style={abs(120, 380, { opacity: u > L[0] + 0.5 ? 1 : 0, transform: `translate(${j * 640}px,${-Math.sin(j * Math.PI) * 260}px)` })}><Kid color={C.blue} label="A" /></div>
      <div style={abs(90, 930, { ...boxS, width: 900, padding: '22px 30px', fontSize: 44, fontWeight: 900, ...slide(P(u, L[0] + 3.0)) })}>Weak interview → <span style={{ color: C.coral }}>you can be overtaken</span></div>
    </>);
  },
  second: ({ u, L }) => {
    const pr = (a: number) => ease(P(u, a, 0.8));
    return (<>
      <div style={abs(90, 30, { ...chipS(C.yellow, C.ink, 42), borderRadius: 999, ...pop(P(u, 0)) })}>Second: one more admission chance</div>
      <div style={abs(170, 190, { ...chipS(C.yellow, C.ink, 38), ...pop(P(u, 0.6)) })}>Comprehensive evaluation round</div>
      <svg width={1080} height={700} style={abs(0, 0)} aria-hidden="true"><g fill="none" stroke={C.ink} strokeWidth={10} strokeLinecap="round">
        <path d="M500 280 C 420 340 300 360 240 450" pathLength={1} strokeDasharray={`${pr(1.0)} 1`} />
        <path d="M580 280 C 660 340 760 360 800 450" pathLength={1} strokeDasharray={`${pr(L[1])} 1`} />
        <path d="M800 560 C 780 640 700 660 640 700" pathLength={1} strokeDasharray={`${pr(L[1] + 0.8)} 1`} /></g></svg>
      <div style={abs(110, 470, { ...chipS(C.green, '#fff', 40), ...pop(P(u, 1.6)) })}>✓ Admitted</div>
      <div style={abs(650, 470, { ...chipS('#fff', C.ink, 40), ...pop(P(u, L[1] + 0.3)) })}>Not admitted</div>
      <div style={abs(250, 720, { ...chipS(C.blue, '#fff', 38), ...pop(P(u, L[1] + 1.2)) })}>Later rounds go on as normal</div>
      <div style={abs(90, 900, { ...chipS('#fff', C.ink, 32), borderColor: C.teal, ...slide(P(u, L[1] + 1.6), -80, 0) })}>XJTLU: you can still apply in the regular round</div>
      <div style={abs(90, 1010, { ...chipS('#fff', C.ink, 32), borderColor: C.rose, ...slide(P(u, L[2]), -80, 0) })}>CUHK-Shenzhen: later applications not affected</div>
    </>);
  },
  province: ({ u, L, sc }) => {
    const l1 = L[1], anchors: [number, number][] = [[1, l1 - 0.9], [2, l1 - 0.2], [3, l1 + 0.6]];
    const times = schedule('B-province', 0.9, anchors, 0.07);
    return (<>
      <div style={abs(170, 40, { ...chipS(C.blue, '#fff', 48), ...pop(P(u, 0)) })}>Jiangsu</div>
      <div style={abs(505, 26, { fontSize: 90, fontWeight: 900, ...pop(P(u, 0.6)) })}>≠</div>
      <div style={abs(640, 40, { ...chipS(C.coral, '#fff', 48), ...pop(P(u, 0.3)) })}>Guangdong</div>
      <Product u={u} name="B-province" top={260} h={760} a={0.9} anchors={anchors} label="switching province (web beta)" crop={(f) => (/速记/.test(f.note) ? 300 : 0)} />
      <div style={abs(90, 1060, { ...chipS('#fff', C.ink, 32), ...slide(P(u, l1 + 0.2), -60, 0) })}>Jiangsu · 65% + 35% · deadline May 10</div>
      <div style={abs(90, 1150, { ...chipS('#FFF0E8', C.ink, 32), ...pop(u >= times[3] ? 1 : 0) })}>Guangdong · 65% + 30% + 5% · deadline May 20</div>
    </>);
  },
  time: ({ u }) => {
    const M: [string, string, number, string][] = [['Apr 20', 'Applications open', 170, C.yellow], ['May 10 / 20', 'Deadline (JS / GD)', 410, C.yellow], ['Jun 7', 'Gaokao begins', 650, C.blue], ['Jun 16–18', 'Interview (planned)', 890, C.teal]];
    return (<>
      <div style={abs(90, 40, { ...chipS('#fff', C.ink, 34), borderRadius: 999, ...pop(P(u, 0)) })}>XJTLU 2026 as an example</div>
      <div style={abs(90, 560, { width: 900, height: 14, background: C.ink, borderRadius: 7, transformOrigin: '0 50%', transform: `scaleX(${ease(P(u, 0.2, 1.2))})` })} />
      {M.map(([d, w, x, c], i) => (
        <div key={d} style={abs(x, 540, { width: 210, marginLeft: -105, display: 'grid', justifyItems: 'center', gap: 6, ...slide(P(u, 0.6 + i * 0.7), 0, -40) })}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: c, border: `6px solid ${C.ink}` }} />
          <div style={{ fontSize: 34, fontWeight: 900, whiteSpace: 'nowrap' }}>{d}</div>
          <div style={{ fontSize: 26, fontWeight: 800, textAlign: 'center', lineHeight: 1.2, color: C.muted }}>{w}</div>
        </div>))}
      <div style={abs(90, 880, { ...boxS, width: 900, padding: '22px 30px', fontSize: 40, fontWeight: 900, ...slide(P(u, 3.4)) })}>CUHK-Shenzhen: entrance test <span style={{ color: C.coral }}>after the gaokao, before scores</span></div>
    </>);
  },
  interview: ({ u, L }) => (<>
    <div style={abs(90, 60, { ...boxS, width: 900, padding: '30px 38px', display: 'grid', gap: 12, ...slide(P(u, 0)) })}>
      <div style={{ fontSize: 28, fontWeight: 800, color: C.muted }}>XJTLU 2026 Jiangsu brochure · interview (translated)</div>
      <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.2 }}>“Assesses English proficiency, overall competence and general ability. Subject knowledge is not tested.”</div>
    </div>
    <div style={abs(470, 560, { ...stampS(50), ...pop(P(u, L[0] + 3.4), 'rotate(-6deg)') })}>No subject knowledge</div>
    <div style={abs(110, 800, { ...chipS(C.blue, '#fff', 46), ...pop(P(u, L[1])) })}>A view</div>
    <div style={abs(410, 812, { fontSize: 48, fontWeight: 900, color: C.coral, ...pop(P(u, L[1] + 0.6)) })}>because</div>
    <div style={abs(700, 800, { ...chipS(C.teal, '#fff', 46), ...pop(P(u, L[1] + 1.1)) })}>A reason</div>
  </>),
  drill: ({ u, sc }) => {
    const L0 = sc.lines[0], rel = (x: number) => x - sc.start;
    const anchors: [number, number][] = [[35, rel(L0.start) + 2.0], [76, rel(L0.end) - 0.1]];
    const times = schedule('C-drill', 0, anchors, 0.045);
    return (<>
      <Product u={u} name="C-drill" top={70} h={960} a={0} dt={0.045} anchors={anchors} label="5-minute practice (web beta)" crop={(f) => (/练习题/.test(f.note) ? 120 : 180)} />
      <div style={abs(120, 1075, { ...stampS(38), ...pop(u >= times[76] ? 1 : 0, 'rotate(-3deg)') })}>Practice hint · not a score · not a prediction</div>
    </>);
  },
  end: ({ u, L }) => {
    const rows = ['Your province: read its own brochure', 'Can you clear the control line?', 'Time to prepare for the interview?'];
    return (<>
      <div style={abs(70, 60, { ...chipS(C.yellow, C.ink, 46), ...pop(P(u, 0.3)) })}>+1 assessment</div>
      <div style={abs(500, 60, { ...chipS(C.yellow, C.ink, 46), ...pop(P(u, 0.9)) })}>+1 admission chance</div>
      <div style={abs(140, 230, { ...chipS('#fff', C.ink, 38), borderRadius: 999, ...pop(P(u, 2.6)) })}>Cost: thresholds · time · preparation</div>
      {rows.map((r, i) => {
        const on = u > L[1] + 1.6 + i * 1.5;
        return (<div key={r} style={abs(90, 430 + i * 170, { ...boxS, width: 900, padding: '22px 28px', display: 'flex', gap: 22, alignItems: 'center', fontSize: 42, fontWeight: 900, ...slide(P(u, L[1] + 1.1 + i * 1.5), 80, 0) })}>
          <span style={{ width: 56, height: 56, borderRadius: 14, border: `5px solid ${C.ink}`, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 38, background: on ? C.green : '#fff', flex: 'none' }}>✓</span>{r}</div>);
      })}
      <div style={abs(90, 1000, { width: 900, textAlign: 'center', fontSize: 28, fontWeight: 800, color: C.muted, ...slide(P(u, L[1] + 6)) })}>Rules: each university's official brochure for that year · by esssouth, not affiliated with the universities</div>
    </>);
  },
};

const FOOT: Record<string, [string, string]> = {
  product: ['Product footage', 'esssouth web beta · real screen capture · demo account and sample data'],
  example: ['Hypothetical', 'shows how the weights work, not an admission prediction'],
  advice: ['Our advice', 'by esssouth, not affiliated with the universities'],
};

export const Explainer: React.FC<{ music: boolean; voice: boolean }> = ({ music, voice }) => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const sc = TL.scenes.find((s) => t >= s.start && t < s.end) || TL.scenes[TL.scenes.length - 1];
  const u = t - sc.start, L = sc.lines.map((l) => l.start - sc.start), Scene = SCENES[sc.id];
  const ln = sc.lines.find((l) => t >= l.start && t < l.end + TL.GAP) || sc.lines.filter((l) => t >= l.start).pop() || sc.lines[0];
  const seg = ln.segs.find((s) => t >= s.start && t < s.end + TL.GAP * 0.9);
  const foot = ln.kind === 'policy' ? ['Official rule', 'Source: ' + (sc.src || []).map((k: string) => (script as any).sources[k][2]).join('; ')] : FOOT[ln.kind];
  const fade = Math.min(ease(P(u, 0, 0.25)), 1 - ease(P(u, sc.end - sc.start - 0.25, 0.25)));
  const total = TL.total * FPS;
  return (
    <AbsoluteFill style={{ background: C.cream, fontFamily, color: C.ink }}>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(31,26,23,.07) 3px, transparent 3.5px)', backgroundSize: '46px 46px' }} />
      <div style={abs(60, 56, { display: 'flex', gap: 18, alignItems: 'center', width: 960 })}>
        <span style={{ background: C.yellow, border: `4px solid ${C.ink}`, borderRadius: 16, padding: '6px 16px', fontWeight: 900, fontSize: 26, boxShadow: `5px 5px 0 ${C.ink}`, whiteSpace: 'nowrap' }}>Admissions explained</span>
        <span style={{ fontWeight: 900, fontSize: 30, lineHeight: 1.15 }}>What does comprehensive evaluation actually give you?</span>
      </div>
      <div style={abs(0, 200, { width: 1080, height: 1270, opacity: fade })}><Scene u={u} L={L} sc={sc} /></div>
      <div style={abs(60, 1500, { width: 960, minHeight: 230, ...boxS, borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '22px 40px', fontSize: 50, fontWeight: 800, lineHeight: 1.3, opacity: seg ? 1 : 0 })}>
        <div>{seg ? <Hl text={seg.text} /> : null}</div>
      </div>
      <div style={abs(60, 1798, { width: 960, display: 'flex', gap: 12, alignItems: 'center', fontSize: 26, fontWeight: 800, color: C.muted })}>
        <b style={{ padding: '3px 14px', borderRadius: 10, border: `3px solid ${C.ink}`, color: C.ink, whiteSpace: 'nowrap' }}>{foot[0]}</b>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{foot[1]}</span>
      </div>
      {voice ? TL.lines.map((l) => (
        <Sequence key={l.id} from={Math.round(l.start * FPS)} durationInFrames={Math.ceil((l.end - l.start) * FPS) + 3}><Audio src={staticFile(`voice/${l.id}.wav`)} /></Sequence>
      )) : null}
      {music ? <Audio src={staticFile('bgm.wav')} volume={(f) => interpolate(f, [0, 45, total - 90, total], [0, voice ? 0.16 : 0.5, voice ? 0.16 : 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /> : null}
    </AbsoluteFill>
  );
};

export const lineText = (s: string) => plain(s);
