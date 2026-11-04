/* 宣传片引擎：画面全部是时间 t（秒）的函数。
   - track(keys)：关键帧 [{ t, v: {…数值}, e: 缓动 }]，按 t 插值
   - S.at(t, fn)：t 秒时对网页做一次操作（点按、打开卡片……）
   - S.tap(t, selector)：t 秒时手指点一下某个元素（先出现点按圈，再真的 click）
   - S.title(in, out, {...})：标题淡入淡出
   - S.frame(t, dt)：录制脚本每一帧调用；网页里的 CSS 动画按 dt 推进（JS 计时器和 requestAnimationFrame 由 Playwright 的假时钟推进） */
'use strict';
const E = {
  lin: t => t,
  io: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: t => 1 - Math.pow(1 - t, 3),
  out5: t => 1 - Math.pow(1 - t, 5),
  in: t => t * t * t,
  // 苹果常用的「慢进慢出、尾部很长」
  apple: t => (t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2),
};
const clamp01 = x => Math.max(0, Math.min(1, x));
function track(keys) {
  keys = keys.slice().sort((a, b) => a.t - b.t);
  return t => {
    if (t <= keys[0].t) return Object.assign({}, keys[0].v);
    for (let i = 1; i < keys.length; i++) {
      const a = keys[i - 1], b = keys[i];
      if (t <= b.t) {
        const p = (E[b.e || 'apple'])(clamp01((t - a.t) / (b.t - a.t))), o = Object.assign({}, a.v);
        for (const k in b.v) o[k] = (a.v[k] == null ? b.v[k] : a.v[k] + (b.v[k] - a.v[k]) * p);
        return o;
      }
    }
    return Object.assign({}, keys[keys.length - 1].v);
  };
}
/* 连续写关键帧：K(0, {...}).to(2, {...}, 'io').hold(3)… 每一步只写变化的值 */
function K(t, v) {
  const keys = [{ t, v: Object.assign({}, v) }];
  const api = {
    to(t2, v2, e) { keys.push({ t: t2, v: Object.assign({}, keys[keys.length - 1].v, v2), e }); return api; },
    hold(t2) { return api.to(t2, {}, 'lin'); },
    fn() { return track(keys); }
  };
  return api;
}

/* 竖版（?p=1）：画面 1080×1920。舞台上的设备坐标不变，整体映射到竖屏：标题在上方一条，手机占下面；
   镜头推近时以目标点为中心放大（放大幅度收一些，避免盖住标题）；片尾三台设备改成前后叠放。 */
const PORTRAIT = new URLSearchParams(location.search).get('p') === '1';
const QS = new URLSearchParams(location.search), PK = +QS.get('pk') || 1.42, PAY = +QS.get('pay') || 1185, PZ = 0.45;   // 竖版：基础缩放、手机中心的高度、镜头放大幅度的折算（?pk= ?pay= 可改：手机放大一些，字更清楚）
/* 铺满版（?p=1&fs=1）：不画手机外框，网页铺满标题下面的整块画面（网页按 432×672 排版，放大 2.5 倍）；
   片尾 tracks.fs 从 0 到 1：镜头慢慢拉远，画面收成手机（外框、状态栏渐显），接着设备变形（S.morph） */
const FS = PORTRAIT && QS.get('fs') === '1', FS_BAND = 240, FS_VW = 432, FS_VH = (1920 - FS_BAND) * FS_VW / 1080;
/* 显示器版（?p=1&dk=1）：一开头是一台显示器，网页按电脑版排版（1440×900）；镜头推近到某一个功能演示（S.cam），
   有特色的功能加标注（S.note）；片尾镜头拉远，同一个网页的窗口变成手机、再变成平板（S.geom，网页跟着重新排版）。
   镜头 { fx, fy, k }：网页里的点 (fx, fy) 放在画面 (540, DK_CY)，放大 k 倍；字幕在上面一条（中心 y = DK_TY） */
const DK = PORTRAIT && QS.get('dk') === '1', DK_CY = 1190, DK_TY = 330;
const GEO = {
  monitor: { sw: 1440, sh: 900, pad: 16, R: 24, r: 8, stand: 1, ph: 0 },
  phone: { sw: 390, sh: 844, pad: 14, R: 66, r: 53, stand: 0, ph: 1 },
  tablet: { sw: 1180, sh: 820, pad: 20, R: 46, r: 28, stand: 0, ph: 0 }
};
const S = window.S = {
  portrait: PORTRAIT, fs: FS, dk: DK, GEO,
  actions: [], titles: [], taps: [], tracks: {}, done: 0, ready: false,
  /* 音效：录制时记下每个音效的时间，录完由 music/mix.py 按时间混进配乐（tick 点按、pop、whoosh、ding、hit…） */
  sfxLog: [], tapSfx: null,
  sfx(t, name, gain) { this.at(t, () => this.sfxLog.push({ t, name, gain: gain == null ? 1 : gain })); },
  at(t, fn) { this.actions.push({ t, fn }); this.actions.sort((a, b) => a.t - b.t); },
  /* 点按：t-lead 出现点按圈（默认 0.32 秒），t 时真的点。每个点按记住自己找到的按钮，快速连点时互不干扰 */
  tap(t, sel, opts) {
    opts = opts || {};
    const tb = t; t -= opts.early == null ? (this.tapEarly || 0) : opts.early;   // tapEarly：网页的弹出 / 展开动画要 0.2 秒左右，提前一点点下去，画面变化正好落在拍子上（点按声还在拍子上）
    const lead = opts.lead == null ? 0.32 : opts.lead, dur = Math.max(0.4, lead * 2.35);
    const host = () => { const w = this.win(opts.frame); if (!opts.inner) return { w, dx: 0, dy: 0 }; const f = w.document.querySelector(opts.inner); const r = f.getBoundingClientRect(); return { w: f.contentWindow, dx: r.left, dy: r.top }; };   // opts.inner：点 app 里嵌套的 iframe（周边报告）
    const find = () => { const { w } = host(); return typeof sel === 'function' ? sel(w) : w.document.querySelector(sel); };
    const ring = (t0, el) => { const r = el.getBoundingClientRect(), o = host(); this.taps.push({ t: t0, dur, x: o.dx + r.left + r.width * (opts.ax == null ? 0.5 : opts.ax), y: o.dy + r.top + r.height * (opts.ay == null ? 0.5 : opts.ay), frame: opts.frame || 'app' }); };
    let found = null;
    this.at(t - lead, () => { found = find(); if (found) ring(t - lead, found); });
    this.at(t, () => {
      let el = found;
      if (el && !el.isConnected) el = null;   // 找到的是上一题的按钮，页面已经翻过去了
      if (!el) {   // 点按圈出现时按钮还没渲染出来：现在再找一次，点按圈从这一刻开始
        el = find();
        if (el) ring(t - Math.min(0.12, lead), el); else console.warn('tap: still no element', sel);
      }
      if (el) { if (opts.fn) opts.fn(el); else el.click(); if (this.tapSfx && opts.sfx !== false) this.sfxLog.push({ t: tb, name: opts.sfx || this.tapSfx, gain: opts.gain == null ? 1 : opts.gain }); }
    });
  },
  title(tin, tout, o) { this.titles.push(Object.assign({ tin, tout }, o)); },
  /* 网页时间快进：t0–t1 之间网页里的计时器和 requestAnimationFrame 按 k 倍速走（CSS 动画照常） */
  speeds: [],
  speed(t0, t1, k, ramp) { this.speeds.push({ t0, t1, k, ramp: ramp == null ? 0.8 : ramp }); },
  speedAt(t) {
    let k = 1;
    for (const s of this.speeds) {
      if (t < s.t0 || t > s.t1) continue;
      const r = Math.min(1, (t - s.t0) / s.ramp, (s.t1 - t) / s.ramp);   // 前后各留一点渐变
      k = 1 + (s.k - 1) * E.io(Math.max(0, r));
    }
    return k;
  },
  /* 每帧都跑：t0–t1 之间调用 fn(u, t)，u 是 0–1 的进度 */
  hooks: [],
  during(t0, t1, fn) { this.hooks.push({ t0, t1, fn, last: false }); },
  /* 网页地图自己平滑移动到目标视角（网页自带的动画只有 0.16 秒，太快，这里逐帧推进）。
     target(w) 在网页里算出 { z, tx, ty }；网页的 z / tx / ty / render 是页面脚本里的全局变量 */
  mapGlide(t0, dur, target, ease) {
    let from = null, to = null;
    this.during(t0, t0 + dur, (u) => {
      const w = this.win();
      if (!from) { from = w.eval('({ z, tx, ty })'); to = target(w); }
      const p = (E[ease || 'apple'])(u), lz = Math.log(from.z) + (Math.log(to.z) - Math.log(from.z)) * p, z = Math.exp(lz);
      // 平移按屏幕中心对应的地图点插值，缩放时不会先偏出去再回来
      const vw = w.eval('viewW'), vh = w.eval('viewH'), fk = w.eval('fitK');
      const c0 = [(vw / 2 - from.tx) / (fk * from.z), (vh / 2 - from.ty) / (fk * from.z)], c1 = [(vw / 2 - to.tx) / (fk * to.z), (vh / 2 - to.ty) / (fk * to.z)];
      const cx = c0[0] + (c1[0] - c0[0]) * p, cy = c0[1] + (c1[1] - c0[1]) * p;
      w.eval(`z = ${z}; tx = ${vw / 2 - cx * fk * z}; ty = ${vh / 2 - cy * fk * z}; render(false);`);
    });
  },
  /* 平滑滚动：t0–t1 把容器滚到 target（数字，或返回数字的函数，例如让某一行滚到中间） */
  scroll(t0, t1, box, target, ease) {
    let from = null, to = null;
    this.during(t0, t1, u => {
      const el = typeof box === 'function' ? box(this.win()) : this.doc().querySelector(box); if (!el) return;
      if (from == null) { from = el.scrollTop; to = typeof target === 'function' ? target(el, this.win()) : target; }
      el.scrollTop = from + (to - from) * (E[ease || 'apple'])(u);
    });
  },
  /* 拖滑块：t0 手指按下（点按圈出现并停住），t0–t1 把 range 从 a 拖到 b，松手后点按圈淡出 */
  holds: [],
  slide(t0, t1, sel, a, b, ease) {
    const get = () => (typeof sel === 'function' ? sel(this.win()) : this.doc().querySelector(sel));
    const h = { t0: t0 - 0.25, t1: t1 + 0.35, x: 0, y: 0 }; this.holds.push(h);
    const thumb = el => { const r = el.getBoundingClientRect(), f = (el.value - el.min) / (el.max - el.min); h.x = r.left + 10 + (r.width - 20) * f; h.y = r.top + r.height / 2; };
    this.at(t0 - 0.25, () => { const el = get(); if (el) thumb(el); });
    this.during(t0, t1, u => {
      const el = get(); if (!el) return;
      const v = Math.round(a + (b - a) * (E[ease || 'io'])(u));
      if (+el.value !== v) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }
      thumb(el);
    });
    this.at(t1, () => { const el = get(); if (el) el.dispatchEvent(new Event('change', { bubbles: true })); });
  },
  /* 拖动：t0 手指按下（点按圈停在按下的位置），t0–t1 拖过 (dx, dy) 像素，t1 松手。用合成的 PointerEvent，
     所以先把网页里的 setPointerCapture 换成空操作（合成事件没有真实指针，原生方法会报错）。ax / ay：按在元素的哪个位置（像素） */
  drag(t0, t1, sel, dx, dy, opts) {
    opts = opts || {};
    const h = { t0: t0 - 0.25, t1: t1 + 0.35, x: 0, y: 0 }; this.holds.push(h);
    let el = null, x0 = 0, y0 = 0, tgt = null;
    const ev = (type, x, y) => new (this.win().PointerEvent)(type, { bubbles: true, cancelable: true, pointerId: 7, isPrimary: true, pointerType: 'touch', clientX: x, clientY: y, button: 0, buttons: type === 'pointerup' ? 0 : 1 });
    this.at(t0 - 0.25, () => {
      const w = this.win(); for (const k of ['setPointerCapture', 'releasePointerCapture']) w.Element.prototype[k] = function () {};
      el = typeof sel === 'function' ? sel(w) : w.document.querySelector(sel); if (!el) { console.warn('drag: missing', sel); return; }
      const r = el.getBoundingClientRect(); x0 = r.left + (opts.ax == null ? r.width / 2 : opts.ax); y0 = r.top + (opts.ay == null ? r.height / 2 : opts.ay); h.x = x0; h.y = y0;
      tgt = w.document.elementFromPoint(x0, y0) || el;
    });
    this.at(t0, () => { if (tgt) tgt.dispatchEvent(ev('pointerdown', x0, y0)); });
    this.during(t0, t1, u => { if (!tgt) return; const p = (E[opts.ease || 'io'])(u), x = x0 + dx * p, y = y0 + dy * p; h.x = x; h.y = y; tgt.dispatchEvent(ev('pointermove', x, y)); });
    this.at(t1, () => { if (tgt) tgt.dispatchEvent(ev('pointerup', x0 + dx, y0 + dy)); });
  },
  /* 高亮框：t0–t1 在 app 里某个元素外面画一个圆角框（只是镜头上的标注，不改网页） */
  marks: [],
  mark(t0, t1, sel, o) { this.marks.push(Object.assign({ t0, t1, sel, pad: 6 }, o || {})); },
  win(f) { return document.getElementById(f || 'app').contentWindow; },
  doc(f) { return this.win(f).document; },

  /* ---------- 载入网页 ---------- */
  async load(frames) {
    const els = {};
    for (const [id, src] of Object.entries(frames)) {
      const f = document.getElementById(id);
      await new Promise(res => { f.onload = res; f.src = src; });
      this.patchSafeArea(f.contentDocument, id === 'app' ? { top: 47, bottom: 34 } : { top: 0, bottom: 0 });
      els[id] = f;
    }
    this.ready = true;
    return Object.keys(els);
  },
  /* iframe 里 env(safe-area-inset-*) 是 0：换成真机的刘海和底部横条高度 */
  patchSafeArea(doc, ins) {
    const rep = v => v.replace(/env\(\s*safe-area-inset-(top|bottom|left|right)\s*(,\s*[^)]*)?\)/g, (_, side) => (FS || DK ? `var(--sa-${side}, 0px)` : (ins[side] || 0) + 'px'));   // 铺满版：没有刘海，拉远成手机时再渐渐让出状态栏
    const walk = rules => { for (const r of rules) {
      if (r.style) for (let i = 0; i < r.style.length; i++) { const p = r.style[i], v = r.style.getPropertyValue(p); if (v.includes('safe-area-inset')) r.style.setProperty(p, rep(v), r.style.getPropertyPriority(p)); }
      if (r.cssRules) walk(r.cssRules);
    } };
    for (const s of doc.styleSheets) { try { walk(s.cssRules); } catch (e) { /* 跨域样式表 */ } }
  },

  /* 字体按需下载：新文字出现时先等字体到位再截图，避免某一帧闪出系统字体 */
  async fontsReady() {
    const docs = [document];
    for (const id of ['app', 'appT', 'appF']) { try { const d = this.doc(id); if (d && d.body) docs.push(d); } catch (e) { /* 没载入 */ } }
    for (const d of docs) { void d.body.offsetHeight; await d.fonts.ready; }
  },
  /* ---------- 每一帧 ---------- */
  frame(t, dt) {
    while (this.done < this.actions.length && this.actions[this.done].t <= t + 1e-6) {
      const a = this.actions[this.done++];
      try { a.fn(); } catch (e) { console.error('action @' + a.t, e); }
    }
    for (const h of this.hooks) {
      if (t >= h.t0 && t <= h.t1) { try { h.fn(clamp01((t - h.t0) / Math.max(1e-6, h.t1 - h.t0)), t); } catch (e) { console.error('hook', e); } }
      else if (t > h.t1 && !h.last) { h.last = true; try { h.fn(1, t); } catch (e) { console.error('hook', e); } }
    }
    const T = this.tracks;
    if (DK) { this.paintDK(t); this.paintTitles(t); this.paintTap(t); this.paintMarks(t); if (T.veil) document.getElementById('veil').style.opacity = T.veil(t).o; if (dt > 0) for (const id of ['app']) { try { this.stepAnims(this.doc(id), dt); } catch (e) { /* 还没载入 */ } } return; }
    if (FS && (!this.morph || t < this.morph.t0)) { this.paintFS(t); this.paintTitles(t); this.paintTap(t); this.paintMarks(t); if (dt > 0) for (const id of ['app', 'appT', 'appF']) { try { this.stepAnims(this.doc(id), dt); } catch (e) { /* 还没载入 */ } } return; }
    const cam = T.cam ? T.cam(t) : { x: 960, y: 540, s: 1 };
    if (PORTRAIT) {   // 横向的镜头偏移是给侧边标题让位置的，竖版不需要；只保留推近的高度和幅度
      const k = PK * (1 + (cam.s - 1) * PZ), ay = PAY + (cam.y - 540) * PK;
      document.getElementById('cam').style.transform = `translate(${540 - 960 * k}px,${ay - cam.y * k}px) scale(${k})`;
    } else document.getElementById('cam').style.transform = `translate(960px,540px) scale(${cam.s}) translate(${-cam.x}px,${-cam.y}px)`;
    for (const id of ['phone', 'tablet', 'fold']) {
      if (!T[id]) continue;
      let d = T[id](t); const el = document.getElementById(id);
      if (PORTRAIT) d = this.portraitDevice(id, d);
      el.style.opacity = d.o == null ? 1 : d.o;
      el.style.transform = `translate(${d.x || 0}px,${d.y || 0}px) perspective(2400px) rotateY(${d.ry || 0}deg) rotateX(${d.rx || 0}deg) rotate(${d.r || 0}deg) scale(${d.s == null ? 1 : d.s})`;
    }
    if (this.morph) this.paintMorph(t);
    if (T.veil) document.getElementById('veil').style.opacity = T.veil(t).o;
    this.paintTitles(t);
    this.paintTap(t);
    this.paintMarks(t);
    if (dt > 0) for (const id of ['app', 'appT', 'appF']) { try { this.stepAnims(this.doc(id), dt); } catch (e) { /* 还没载入 */ } }
  },
  /* 设备变形：手机 → 折叠屏 → 平板（S.morph = { t0, t1, t2, t3, G }，t0–t1 手机变折叠屏，t2–t3 折叠屏变平板）。
     三台设备叠在同一处，外框尺寸、边框、圆角、位置、缩放一起插值；上层设备的屏幕内容渐隐，露出下层更宽的界面。
     深色外框和阴影只画在最下面的平板上，上面两台只留屏幕内容，所以看起来是同一台设备在变形。
     G = { phone, fold, tablet }：每台的屏幕宽高 sw/sh、边框 pad、屏幕圆角 r、外框圆角 R、中心 cx/cy、缩放 sc（舞台坐标）；
     竖版用 GP（平板要缩小才放得下，位置也另排），没有 GP 就用 G */
  morph: null,
  paintMorph(t) {
    const m = this.morph; if (t < m.t0) return;
    const seg = (a, b) => E.apple(clamp01((t - a) / (b - a)));
    const p = seg(m.t0, m.t1) + seg(m.t2, m.t3);   // 0 手机 · 1 折叠屏 · 2 平板
    const G = PORTRAIT && m.GP ? m.GP : m.G;
    const A = p < 1 ? G.phone : G.fold, Z = p < 1 ? G.fold : G.tablet, f = p < 1 ? p : p - 1;
    const g = {}; for (const k in A) g[k] = A[k] + (Z[k] - A[k]) * f;
    const W = g.sw + 2 * g.pad, H = g.sh + 2 * g.pad;
    const fade = (a, b) => E.io(clamp01((p - a) / (b - a)));
    const op = { phone: 1 - fade(0.4, 0.8), fold: 1 - fade(1.4, 1.8), tablet: 1 };
    const native = { phone: [390, 844], fold: [746, 676], tablet: [1174, 834] }, zi = { phone: 5, fold: 4, tablet: 3 };
    for (const id of ['phone', 'fold', 'tablet']) {
      const el = document.getElementById(id), body = el.querySelector('.body'), screen = el.querySelector('.screen'), fr = screen.querySelector('iframe');
      const framed = id === 'tablet';
      Object.assign(el.style, { left: (g.cx - W / 2) + 'px', top: (g.cy - H / 2) + 'px', width: W + 'px', height: H + 'px', opacity: op[id], zIndex: zi[id], transform: `scale(${g.sc})` });
      Object.assign(body.style, { padding: g.pad + 'px', borderRadius: g.R + 'px', background: framed ? '' : 'none',
        boxShadow: framed ? '0 50px 90px -30px rgba(60,40,20,.45), 0 20px 40px -20px rgba(60,40,20,.35), inset 0 0 0 1.5px rgba(255,255,255,.12)' : 'none' });
      Object.assign(screen.style, { width: g.sw + 'px', height: g.sh + 'px', borderRadius: g.r + 'px', background: framed ? '' : 'transparent' });
      const [nw, nh] = native[id];
      Object.assign(fr.style, { left: (g.sw - nw) / 2 + 'px', top: (g.sh - nh) / 2 + 'px' });   // 界面保持原尺寸居中，外框变大时露出更宽的布局
    }
    document.querySelectorAll('#phone .btn').forEach(b => { b.style.opacity = 1 - fade(0, 0.25); });
    const crease = document.querySelector('#fold .crease'); if (crease) crease.style.opacity = clamp01(1 - Math.abs(p - 1) / 0.45);
  },
  /* 铺满版：u = tracks.fs（0 铺满 → 1 手机），rise = tracks.rise（开场从下面升起，舞台像素）。
     手机放在设备变形的起点（GP.phone），镜头从「屏幕铺满标题下面」插值到默认镜头，接上 paintMorph 不跳 */
  paintFS(t) {
    const T = this.tracks, u = T.fs ? T.fs(t).u : 0, rise = T.rise ? T.rise(t).y : 0, L = (a, b) => a + (b - a) * u;
    const g = (this.morph && (this.morph.GP || this.morph.G) || {}).phone || { cx: 960, cy: 600, sc: 0.88 };
    const sw = L(FS_VW, 390), sh = L(FS_VH, 844), pad = L(0, 14), W = sw + 2 * pad, H = sh + 2 * pad;
    const el = document.getElementById('phone'), body = el.querySelector('.body'), screen = el.querySelector('.screen'), fr = document.getElementById('app');
    Object.assign(el.style, { left: (g.cx - W / 2) + 'px', top: (g.cy - H / 2) + 'px', width: W + 'px', height: H + 'px', opacity: 1, transform: `translate(0px,${rise}px) scale(${g.sc})` });
    Object.assign(body.style, { padding: pad + 'px', borderRadius: L(0, 66) + 'px',
      boxShadow: `0 50px 90px -30px rgba(60,40,20,${0.45 * u}), 0 20px 40px -20px rgba(60,40,20,${0.35 * u}), inset 0 0 0 1.5px rgba(255,255,255,${0.12 * u})` });
    Object.assign(screen.style, { width: sw + 'px', height: sh + 'px', borderRadius: L(0, 53) + 'px' });
    const fw = Math.round(sw), fh = Math.round(sh);
    if (fr.__w !== fw || fr.__h !== fh) { fr.__w = fw; fr.__h = fh; Object.assign(fr.style, { width: fw + 'px', height: fh + 'px', left: '0px', top: '0px' }); }
    const ui = clamp01((u - 0.55) / 0.4);
    document.querySelectorAll('#phone .status, #phone .island, #phone .homebar').forEach(b => { b.style.opacity = ui; });
    document.querySelectorAll('#phone .btn').forEach(b => { b.style.opacity = u; });
    try { const de = this.doc().documentElement, st = Math.round(47 * ui), sb = Math.round(34 * ui);
      if (de.__st !== st || de.__sb !== sb) { de.__st = st; de.__sb = sb; de.style.setProperty('--sa-top', st + 'px'); de.style.setProperty('--sa-bottom', sb + 'px'); } } catch (e) { /* 还没载入 */ }
    const k0 = 1080 / (FS_VW * g.sc), k = Math.exp(Math.log(k0) + (Math.log(PK) - Math.log(k0)) * u);
    const cx = L(540, 540 + (g.cx - 960) * PK), cy = L(FS_BAND + (1920 - FS_BAND) / 2, PAY + (g.cy - 540) * PK);
    document.getElementById('cam').style.transform = `translate(${cx - g.cx * k}px,${cy - g.cy * k}px) scale(${k})`;
  },
  /* ---------- 显示器版 ---------- */
  geoms: [], cams: [], tilts: [], pulses: [], cuts: [], flashes: [],
  flash(t, amt, dur) { this.flashes.push({ t, amt: amt == null ? 0.35 : amt, dur: dur || 0.22 }); },
  /* 一刀切：t 这一帧镜头直接到位（不推不移） */
  cut(t, target) { this.cuts.push(t); this.cam(t - 0.001, 0.001, target, 'lin'); },
  tilt(t, deg, dur) { this.tilts.push({ t, deg, dur: dur || 0.6 }); },
  pulse(t, amt, dur) { this.pulses.push({ t, amt: amt == null ? 0.02 : amt, dur: dur || 0.35 }); },
  geom(t0, dur, target, ease) { this.geoms.push({ t0, dur, target: typeof target === 'string' ? GEO[target] : target, ease }); this.geoms.sort((a, b) => a.t0 - b.t0); },
  /* target：{ fx, fy, k }、'fit'（整台设备放进画面，设备变形时一直跟着）、或 (w, g, cur) => { fx, fy, k }（开始那一刻算：对准某个元素，或在当前镜头上慢慢推近） */
  cam(t0, dur, target, ease) { this.cams.push({ t0, dur, target, ease }); this.cams.sort((a, b) => a.t0 - b.t0); },
  fitCam(g) { const H = g.sh + 2 * g.pad + g.stand * 170; return { k: Math.min(1000 / (g.sw + 2 * g.pad), 1300 / H), fx: g.sw / 2, fy: g.sh / 2 + g.stand * 85 }; },
  /* 对准一个元素：sel 是选择器或 w => 元素；k 放大倍数；o.ox / o.oy 对准元素的哪个位置（0–1），o.dx / o.dy 再偏移（网页像素）。画面边上不露出网页外面 */
  focus(sel, k, o) {
    o = o || {};
    return (w, g) => {
      const e = typeof sel === 'function' ? sel(w) : w.document.querySelector(sel); if (!e) { console.warn('focus: missing', sel); return null; }
      const r = e.getBoundingClientRect();
      let fx = r.left + r.width * (o.ox == null ? 0.5 : o.ox) + (o.dx || 0), fy = r.top + r.height * (o.oy == null ? 0.5 : o.oy) + (o.dy || 0);
      const hw = 540 / k, vt = (DK_CY - 470) / k, vb = (1920 - DK_CY) / k;
      fx = g.sw > 2 * hw ? Math.max(hw, Math.min(g.sw - hw, fx)) : g.sw / 2;
      fy = g.sh > vt + vb ? Math.max(vt, Math.min(g.sh - vb, fy)) : g.sh / 2;
      return { fx, fy, k };
    };
  },
  runGlides(list, t, cur, resolve, lerp) {
    for (const gl of list) {
      if (t < gl.t0) break;
      if (!gl.from) { gl.from = Object.assign({}, cur); gl.to = resolve(gl.target, cur) || cur; }
      const p = (E[gl.ease || 'apple'])(clamp01((t - gl.t0) / Math.max(1e-6, gl.dur)));
      cur = lerp(gl.from, gl.target === 'fit' ? resolve('fit', cur) : gl.to, p);
    }
    return cur;
  },
  paintDK(t) {
    const T = this.tracks, rise = T.rise ? T.rise(t).y : 0;
    const lin = (a, b, p) => { const o = {}; for (const k in b) o[k] = a[k] + (b[k] - a[k]) * p; return o; };
    const g0 = GEO[QS.get('dkstart') || 'monitor'];   // ?dkstart=phone：一开头就是手机
    const g = this.runGlides(this.geoms, t, Object.assign({}, g0), x => x, lin);
    const c = this.runGlides(this.cams, t, this.fitCam(g0), (x, cur) => (x === 'fit' ? this.fitCam(g) : typeof x === 'function' ? x(this.win(), g, cur) : x),
      (a, b, p) => ({ fx: a.fx + (b.fx - a.fx) * p, fy: a.fy + (b.fy - a.fy) * p, k: Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * p) }));
    this.dkCam = c;
    const el = document.getElementById('phone'), body = el.querySelector('.body'), screen = el.querySelector('.screen'), fr = document.getElementById('app');
    Object.assign(el.style, { left: -g.pad + 'px', top: -g.pad + 'px', width: (g.sw + 2 * g.pad) + 'px', height: (g.sh + 2 * g.pad) + 'px', opacity: 1, transform: 'none' });
    Object.assign(body.style, { padding: g.pad + 'px', borderRadius: g.R + 'px' });
    Object.assign(screen.style, { width: g.sw + 'px', height: g.sh + 'px', borderRadius: g.r + 'px' });
    const fw = Math.round(g.sw), fh = Math.round(g.sh);
    if (fr.__w !== fw || fr.__h !== fh) { fr.__w = fw; fr.__h = fh; Object.assign(fr.style, { width: fw + 'px', height: fh + 'px', left: '0px', top: '0px' }); }
    const ui = clamp01((g.ph - 0.6) / 0.4);
    document.querySelectorAll('#phone .status, #phone .island, #phone .homebar').forEach(b => { b.style.opacity = ui; });
    document.querySelectorAll('#phone .btn').forEach(b => { b.style.opacity = ui; });
    try { const de = this.doc().documentElement, st = Math.round(47 * ui), sb = Math.round(34 * ui);
      if (de.__st !== st || de.__sb !== sb) { de.__st = st; de.__sb = sb; de.style.setProperty('--sa-top', st + 'px'); de.style.setProperty('--sa-bottom', sb + 'px'); } } catch (e) { /* 还没载入 */ }
    const st = document.getElementById('stand');   // 显示器支架：变成手机时收掉
    Object.assign(st.style, { display: g.stand > 0.01 ? 'block' : 'none', left: (g.sw / 2) + 'px', top: (g.sh + g.pad) + 'px', opacity: Math.min(1, g.stand * 1.6), transform: `translateX(-50%) scaleY(${g.stand})` });
    /* 动态一点：S.tilt 重拍时画面轻轻一斜再回来，S.pulse 跟着鼓点轻推一下；镜头移动快时加一点运动模糊 */
    let rz = 0, pz = 1;
    for (const q of this.tilts) { const u = (t - q.t) / q.dur; if (u >= 0 && u <= 1) rz += q.deg * Math.sin(Math.PI * u) * (1 - u * 0.35); }
    for (const q of this.pulses) { const u = (t - q.t) / q.dur; if (u >= 0 && u <= 1) pz *= 1 + q.amt * Math.exp(-u * 5) * Math.min(1, u * 12); }
    const fxs = c.fx * c.k, fys = c.fy * c.k, prev = this.dkPrev;
    let blur = 0;
    const cutNow = prev && this.cuts.some(x => x > prev.t - 1e-6 && x <= t + 1e-6);   // 一刀切：这一帧不加运动模糊
    if (prev && t > prev.t && !cutNow) { const v = Math.hypot(fxs - prev.x, fys - prev.y) + Math.abs(Math.log(c.k / prev.k)) * 900; blur = Math.max(0, Math.min(3.2, (v - 18) / 22)); }
    this.dkPrev = { t, x: fxs, y: fys, k: c.k };
    const camEl = document.getElementById('cam');
    camEl.style.transform = `translate(540px,${DK_CY}px) rotate(${rz}deg) scale(${pz}) translate(-540px,${-DK_CY}px) translate(${540 - c.fx * c.k}px,${DK_CY + rise - c.fy * c.k}px) scale(${c.k})`;
    camEl.style.filter = blur > 0.25 ? `blur(${blur.toFixed(2)}px)` : 'none';
    let fl = 0; for (const q of this.flashes) { const u = (t - q.t) / q.dur; if (u >= 0 && u <= 1) fl = Math.max(fl, q.amt * (1 - u) * (1 - u)); }
    const fe = document.getElementById('flash'); if (fe) fe.style.opacity = fl;   // 镲上闪一下白
    const tap = document.getElementById('tap'), ts = 64 / c.k;   // 点按圈、标注在画面上保持差不多大
    Object.assign(tap.style, { width: ts + 'px', height: ts + 'px', margin: (-ts / 2) + 'px 0 0 ' + (-ts / 2) + 'px', borderWidth: (2.5 / c.k) + 'px' });
  },
  /* 标注：t0–t1 在元素外面画框，旁边挂一个标签（o.pos：top / bottom / left / right） */
  note(t0, t1, sel, text, o) { this.marks.push(Object.assign({ t0, t1, sel, pad: 6, label: text, pos: 'top' }, o || {})); },
  /* 竖版片尾：平板在上方，手机在左前，折叠屏在右下（手机片尾的 y 0→30 当作进度） */
  portraitDevice(id, d) {
    const o = d.o == null ? 1 : d.o;
    if (id === 'tablet') return { o, x: 0, y: -384 - (1 - o) * 50, s: 0.52 * (0.94 + 0.06 * o) };
    if (id === 'fold') return { o, x: 144 + (1 - o) * 60, y: 187, s: 0.52 * (0.94 + 0.06 * o) };
    if ((d.y || 0) > 200) return Object.assign({}, d, { x: 0, s: d.s == null ? 1 : 1 - (1 - d.s) * 1.45 });   // 升起
    if (this.morph) return Object.assign({}, d, { x: 0 });   // 有设备变形的片尾（亮点版）：手机留在中间，交给 paintMorph
    const e = clamp01((d.y || 0) / 30);
    return Object.assign({}, d, { x: -148 * e, y: 116 * e, s: 1 - 0.25 * e });
  },
  paintTitles(t) {
    const box = document.getElementById('titles');
    this.titles.forEach((o, i) => {
      let el = o.el;
      if (!el) {
        el = o.el = document.createElement('div'); el.className = 'tt ' + (o.cls || '');
        const hh = PORTRAIT && QS.get('tt1') && o.h.replace(/<br>/g, '').length <= 11 ? o.h.replace(/<br>/g, '') : o.h;   // 竖版（?tt1=1）：短标题放一行，手机上方留出空间
        const hc = o.beats ? hh.split(/ |<br>/).map((w, j, arr) => `<span class="w" data-i="${j}">${w}</span>`).join(hh.includes('<br>') ? '<br>' : ' ') : hh;   // o.beats：一句话按空格分块，每块落在一个拍子上
        el.innerHTML = (o.k ? `<div class="k">${o.k}</div>` : '') + `<div class="h">${hc}</div>` + (o.s ? `<div class="s">${o.s}</div>` : '');
        if (PORTRAIT) {   // 竖版：标题都居中，放在手机上方；开场大标题在画面中间
          const big = /big/.test(o.cls || ''), end = /end/.test(o.cls || '');
          el.classList.add('c');
          Object.assign(el.style, { left: '60px', width: '960px', top: (big ? 720 : end ? 150 : QS.get('tt1') ? 130 : 175) + 'px' });
          if (FS && !big) { box.appendChild(el); el.style.top = Math.round(FS_BAND / 2 - el.offsetHeight / 2) + 'px'; }
          if (DK) { box.appendChild(el); el.style.top = Math.round((o.cy || (big ? 610 : DK_TY)) - el.offsetHeight / 2) + 'px'; }   // o.cy：标题中心放在哪个高度   // 显示器版：字幕放在上面偏中间   // 铺满版：标题在网页上方那一条里上下居中
        } else Object.assign(el.style, { left: (o.x || 0) + 'px', top: (o.y || 0) + 'px', width: (o.w || 760) + 'px' });
        box.appendChild(el);
      }
      if (o.beats) {   // 跟着鼓点砸出来：每块放大一点落下、立刻到位；离场快速往上收
        const out = clamp01((t - (o.tout - 0.16)) / 0.16), vis0 = t >= o.beats[0] - 1e-6 && out < 1;
        el.style.display = vis0 ? '' : 'none'; if (!vis0) return;
        el.style.opacity = 1 - out; el.style.filter = 'none'; el.style.transform = `translateY(${-E.in(out) * 26}px)`;
        el.querySelectorAll('.w').forEach(w => { const bt = o.beats[Math.min(+w.dataset.i, o.beats.length - 1)], u = clamp01((t - bt) / 0.16);
          w.style.opacity = t < bt ? 0 : Math.min(1, u * 3); w.style.display = 'inline-block'; w.style.transform = `scale(${t < bt ? 1.3 : 1 + 0.3 * (1 - E.out5(u))})`; });
        const k = el.querySelector('.k'), s2 = el.querySelector('.s');
        if (k) k.style.opacity = clamp01((t - o.beats[0]) / 0.1);
        if (s2) s2.style.opacity = clamp01((t - o.beats[o.beats.length - 1] - 0.1) / 0.2);
        return;
      }
      const fi = o.fade || 0.7, pin = clamp01((t - o.tin) / fi), pout = clamp01((t - (o.tout - fi * 0.8)) / (fi * 0.8));
      const a = E.out(pin) * (1 - E.in(pout));
      el.style.opacity = a;
      el.style.transform = `translateY(${(1 - E.out5(pin)) * 34 - E.in(pout) * 18}px)`;
      el.style.filter = a > 0.995 ? 'none' : `blur(${(1 - a) * 10}px)`;
      el.style.display = a <= 0.001 ? 'none' : '';
    });
  },
  paintTap(t) {
    const el = document.getElementById('tap'); let shown = false;
    for (const p of this.taps) {
      if (p.frame !== 'app') continue;
      const u = (t - p.t) / (p.dur || 0.75); if (u < 0 || u > 1) continue;
      // 0–0.4：落下（缩小 + 变实）；0.4–1：抬起淡出
      const down = clamp01(u / 0.42), up = clamp01((u - 0.42) / 0.58);
      el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
      el.style.opacity = E.out(down) * (1 - E.out(up));
      el.style.transform = `scale(${1.35 - 0.45 * E.out(down) + 0.5 * E.out(up)})`;
      shown = true;
    }
    for (const h of this.holds) {   // 按住拖动：按下 → 停住 → 抬起
      if (t < h.t0 || t > h.t1) continue;
      const down = clamp01((t - h.t0) / 0.22), up = clamp01((t - (h.t1 - 0.3)) / 0.3);
      el.style.left = h.x + 'px'; el.style.top = h.y + 'px';
      el.style.opacity = E.out(down) * (1 - E.out(up));
      el.style.transform = `scale(${1.35 - 0.45 * E.out(down) + 0.5 * E.out(up)})`;
      shown = true;
    }
    if (!shown) el.style.opacity = 0;
  },
  paintMarks(t) {
    for (const m of this.marks) {
      if (!m.el) { m.el = document.createElement('div'); m.el.className = 'mark'; document.getElementById('scr').appendChild(m.el);
        if (m.label) { m.lb = document.createElement('div'); m.lb.className = 'note ' + m.pos; m.lb.textContent = m.label; m.el.appendChild(m.lb); } }
      const a = Math.min(clamp01((t - m.t0) / 0.35), clamp01((m.t1 - t) / 0.35));
      m.el.style.opacity = E.io(a); if (a <= 0) continue;
      const e = typeof m.sel === 'function' ? m.sel(this.win()) : this.doc().querySelector(m.sel); if (!e) continue;
      const r = e.getBoundingClientRect();
      Object.assign(m.el.style, { left: (r.left - m.pad) + 'px', top: (r.top - m.pad) + 'px', width: (r.width + 2 * m.pad) + 'px', height: (r.height + 2 * m.pad) + 'px' });
      if (m.box === false) Object.assign(m.el.style, { border: 'none', background: 'none', boxShadow: 'none' });
      else if (DK && this.dkCam) { const k = this.dkCam.k; m.el.style.borderWidth = (4 / k) + 'px'; m.el.style.borderRadius = (14 / k) + 'px';
      }
      if (DK && this.dkCam && m.lb) { const k = this.dkCam.k;
        Object.assign(m.lb.style, { fontSize: (30 / k) + 'px', padding: (8 / k) + 'px ' + (20 / k) + 'px', ['--g']: (14 / k) + 'px' }); }
      if (m.lb) m.lb.style.transform = (m.pos === 'top' ? 'translate(-50%, calc(-100% - var(--g)))' : m.pos === 'bottom' ? 'translate(-50%, var(--g))' : m.pos === 'left' ? 'translate(calc(-100% - var(--g)), -50%)' : 'translate(var(--g), -50%)') + ` scale(${0.85 + 0.15 * E.out(a)})`;
    }
  },
  /* CSS 动画 / 过渡：全部暂停，每帧手动往前推 dt，录出来和真实播放一样流畅、每次录都一样 */
  stepAnims(doc, dt) {
    for (const a of doc.getAnimations()) {
      if (a.playState === 'finished' && !a.__v) continue;
      if (!a.__v) { a.__v = true; a.pause(); }
      const ct = (a.currentTime || 0) + dt * 1000;
      const tm = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
      if (tm && isFinite(tm.endTime) && ct >= tm.endTime) { try { a.finish(); } catch (e) { a.currentTime = tm.endTime; } }   // 走完了：正常结束，transitionend 照常触发
      else a.currentTime = ct;
    }
  }
};
