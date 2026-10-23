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

const S = window.S = {
  actions: [], titles: [], taps: [], tracks: {}, done: 0, ready: false,
  at(t, fn) { this.actions.push({ t, fn }); this.actions.sort((a, b) => a.t - b.t); },
  /* 点按：t-0.32 出现点按圈，t 时真的点 */
  tap(t, sel, opts) {
    opts = opts || {};
    this.at(t - 0.32, () => {
      const w = this.win(opts.frame), el = typeof sel === 'function' ? sel(w) : w.document.querySelector(sel);
      if (!el) return;
      const r = el.getBoundingClientRect();
      this.taps.push({ t: t - 0.32, x: r.left + r.width * (opts.ax == null ? 0.5 : opts.ax), y: r.top + r.height * (opts.ay == null ? 0.5 : opts.ay), frame: opts.frame || 'app' });
      this.pending = el;
    });
    this.at(t, () => {
      let el = this.pending;
      if (!el) {   // 点按圈出现时按钮还没渲染出来（上一题还在翻页）：现在再找一次，点按圈从这一刻开始
        const w = this.win(opts.frame); el = typeof sel === 'function' ? sel(w) : w.document.querySelector(sel);
        if (el) { const r = el.getBoundingClientRect(); this.taps.push({ t: t - 0.12, x: r.left + r.width * (opts.ax == null ? 0.5 : opts.ax), y: r.top + r.height * (opts.ay == null ? 0.5 : opts.ay), frame: opts.frame || 'app' }); }
        else console.warn('tap: still no element', sel);
      }
      if (el) { if (opts.fn) opts.fn(el); else el.click(); }
      this.pending = null;
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
    const rep = v => v.replace(/env\(\s*safe-area-inset-(top|bottom|left|right)\s*(,\s*[^)]*)?\)/g, (_, side) => (ins[side] || 0) + 'px');
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
    const cam = T.cam ? T.cam(t) : { x: 960, y: 540, s: 1 };
    document.getElementById('cam').style.transform = `translate(960px,540px) scale(${cam.s}) translate(${-cam.x}px,${-cam.y}px)`;
    for (const id of ['phone', 'tablet', 'fold']) {
      if (!T[id]) continue;
      const d = T[id](t), el = document.getElementById(id);
      el.style.opacity = d.o == null ? 1 : d.o;
      el.style.transform = `translate(${d.x || 0}px,${d.y || 0}px) perspective(2400px) rotateY(${d.ry || 0}deg) rotateX(${d.rx || 0}deg) rotate(${d.r || 0}deg) scale(${d.s == null ? 1 : d.s})`;
    }
    if (T.veil) document.getElementById('veil').style.opacity = T.veil(t).o;
    this.paintTitles(t);
    this.paintTap(t);
    if (dt > 0) for (const id of ['app', 'appT', 'appF']) { try { this.stepAnims(this.doc(id), dt); } catch (e) { /* 还没载入 */ } }
  },
  paintTitles(t) {
    const box = document.getElementById('titles');
    this.titles.forEach((o, i) => {
      let el = o.el;
      if (!el) {
        el = o.el = document.createElement('div'); el.className = 'tt ' + (o.cls || '');
        el.innerHTML = (o.k ? `<div class="k">${o.k}</div>` : '') + `<div class="h">${o.h}</div>` + (o.s ? `<div class="s">${o.s}</div>` : '');
        Object.assign(el.style, { left: (o.x || 0) + 'px', top: (o.y || 0) + 'px', width: (o.w || 760) + 'px' });
        box.appendChild(el);
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
      const u = (t - p.t) / 0.75; if (u < 0 || u > 1) continue;
      // 0–0.4：落下（缩小 + 变实）；0.4–1：抬起淡出
      const down = clamp01(u / 0.42), up = clamp01((u - 0.42) / 0.58);
      el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
      el.style.opacity = E.out(down) * (1 - E.out(up));
      el.style.transform = `scale(${1.35 - 0.45 * E.out(down) + 0.5 * E.out(up)})`;
      shown = true;
    }
    if (!shown) el.style.opacity = 0;
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
