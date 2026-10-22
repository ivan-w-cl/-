/* 开发用：在浏览器里近似运行小程序页面（WXML / WXSS / JS），用来截图检查布局。不打包进小程序。
   这不是微信的真实渲染，只模拟了这个项目用到的组件和接口：view text image scroll-view input button canvas block，
   wx:if / wx:elif / wx:else / wx:for、bind / catch 事件、setData、Canvas 2D 节点、存储、胶囊按钮位置。
   最终效果以微信开发者工具和真机为准。
   用法：node tools/wx-preview.cjs pages/index/index > /tmp/preview.html（再用浏览器打开，或交给 Playwright） */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const pagePath = process.argv[2] || 'pages/index/index';

/* 打包：从 app.js 和页面 js 出发，收集 require 到的所有模块 */
const mods = {};
function add(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (mods[rel]) return rel;
  const src = fs.readFileSync(file, 'utf8'); mods[rel] = null;
  const deps = {};
  src.replace(/require\(['"]([^'"]+)['"]\)/g, (_, r) => { let f = path.resolve(path.dirname(file), r); if (!/\.js$/.test(f)) f += '.js'; deps[r] = add(f); });
  mods[rel] = { src, deps };
  return rel;
}
const appMod = add(path.join(ROOT, 'app.js')), pageMod = add(path.join(ROOT, pagePath + '.js'));
const css = [fs.readFileSync(path.join(ROOT, 'app.wxss'), 'utf8'), fs.readFileSync(path.join(ROOT, pagePath + '.wxss'), 'utf8')].join('\n')
  .replace(/(-?[\d.]+)rpx/g, (_, n) => `calc(${n} * var(--rpx))`).replace(/(^|[},\s])page(\s*[{,])/g, '$1.wx-page$2')
  .replace(/(^|[\s,{}>+~])(view|text|button|input|image|scroll-view|canvas)(?=[\s,{:.>+~\[])/g, '$1.wx-$2');   // 标签选择器 → 预览里的类名
const wxml = fs.readFileSync(path.join(ROOT, pagePath + '.wxml'), 'utf8');

const runtime = function () {
  'use strict';
  /* ---------- 模块 ---------- */
  const cache = {};
  function load(name) {
    if (cache[name]) return cache[name].exports;
    const m = MODS[name], module = { exports: {} }; cache[name] = module;
    new Function('module', 'exports', 'require', m.src)(module, module.exports, r => load(m.deps[r]));
    return module.exports;
  }
  /* ---------- wx 接口（只做这个项目用到的） ---------- */
  const W = innerWidth, Hh = innerHeight, capsule = { width: 87, height: 32, top: 48, right: W - 7, left: W - 94, bottom: 80 };
  document.documentElement.style.setProperty('--rpx', (W / 750) + 'px');
  let toastTimer;
  window.wx = {
    getMenuButtonBoundingClientRect: () => capsule,
    getWindowInfo: () => ({ windowWidth: W, windowHeight: Hh, pixelRatio: devicePixelRatio, safeArea: { bottom: Hh } }),
    getSystemInfoSync: () => ({ windowWidth: W, windowHeight: Hh, pixelRatio: devicePixelRatio, language: PREVIEW.lang === 'en' ? 'en' : 'zh_CN' }),
    getAppBaseInfo: () => ({ language: PREVIEW.lang === 'en' ? 'en' : 'zh_CN' }),
    getStorageSync: k => { try { const v = localStorage.getItem('wx:' + k); return v == null ? '' : JSON.parse(v); } catch (e) { return ''; } },
    setStorageSync: (k, v) => localStorage.setItem('wx:' + k, JSON.stringify(v)),
    showToast: o => { const el = document.getElementById('wx-toast'); el.textContent = o.title; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 1500); },
    vibrateShort() {}, nextTick: f => setTimeout(f),
    loadFontFace: o => { document.fonts.load(`20px "${o.family}"`, '中文Aa').then(() => o.success && o.success(), () => o.fail && o.fail()).finally(() => o.complete && o.complete()); },
    createOffscreenCanvas: o => { const c = document.createElement('canvas'); c.width = o.width; c.height = o.height; return c; },
    createSelectorQuery: () => {
      const q = { in: () => q, select: sel => ({ fields: () => ({ exec: cb => setTimeout(() => { const el = document.querySelector(sel); const r = el.getBoundingClientRect();
        el.requestAnimationFrame = f => requestAnimationFrame(f); cb([{ node: el, width: r.width, height: r.height }]); }) }), boundingClientRect: () => ({ exec: cb => setTimeout(() => cb([document.querySelector(sel).getBoundingClientRect()])) }) }) };
      return q;
    },
    request: o => { fetch(o.url, { method: o.method || 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, o.header || {}), body: o.data && o.method && o.method !== 'GET' ? JSON.stringify(o.data) : undefined })
      .then(async r => { const data = await r.json().catch(() => null); o.success && o.success({ statusCode: r.status, data }); }).catch(e => o.fail && o.fail({ errMsg: String(e) })).finally(() => o.complete && o.complete()); },
    previewImage() {}, navigateTo: o => { window.__nav = o.url; }, setClipboardData: o => o.success && o.success()
  };
  /* ---------- WXML ---------- */
  const tpl = (() => {
    const fixed = WXML.replace(/\s(wx:else|disable-scroll|scroll-y|enhanced)(?=[\s>/])/g, ' $1="true"').replace(/\{\{([\s\S]*?)\}\}/g, m => m.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    const doc = new DOMParser().parseFromString('<root xmlns:wx="urn:wx">' + fixed.replace(/<!--[\s\S]*?-->/g, '') + '</root>', 'text/xml');
    const err = doc.querySelector('parsererror'); if (err) throw new Error('WXML parse error: ' + err.textContent);
    return doc.documentElement;
  })();
  const fnCache = {};
  const ev = (expr, scope) => { const f = fnCache[expr] || (fnCache[expr] = new Function('__s', 'with(__s){return (' + expr + ')}')); try { return f(scope); } catch (e) { return undefined; } };
  const interp = (str, scope) => {
    const m = str.match(/^\s*\{\{([\s\S]*?)\}\}\s*$/); if (m) return ev(m[1], scope);
    return str.replace(/\{\{([\s\S]*?)\}\}/g, (_, e) => { const v = ev(e, scope); return v == null ? '' : v; });
  };
  const TAG = { view: 'div', text: 'span', image: 'img', 'scroll-view': 'div', canvas: 'canvas', input: 'input', button: 'button' };
  const keep = {};
  let page;
  function renderList(nodes, scope, out) {
    let chain = null;
    for (const n of nodes) {
      if (n.nodeType === 3) { const s = interp(n.nodeValue, scope); if (String(s).trim() || /\S/.test(n.nodeValue) === false && n.parentNode.tagName === 'text') out.push(document.createTextNode(s)); continue; }
      if (n.nodeType !== 1) continue;
      if (n.hasAttribute('wx:if')) { chain = !!interp(n.getAttribute('wx:if'), scope); if (!chain) continue; }
      else if (n.hasAttribute('wx:elif')) { if (chain) continue; chain = !!interp(n.getAttribute('wx:elif'), scope); if (!chain) continue; }
      else if (n.hasAttribute('wx:else')) { if (chain) { chain = null; continue; } chain = null; }
      else chain = null;
      if (n.hasAttribute('wx:for')) {
        const list = interp(n.getAttribute('wx:for'), scope) || [], it = n.getAttribute('wx:for-item') || 'item', ix = n.getAttribute('wx:for-index') || 'index';
        (Array.isArray(list) ? list : Object.values(list)).forEach((v, i) => renderEl(n, Object.assign(Object.create(scope), { [it]: v, [ix]: i }), out));
      } else renderEl(n, scope, out);
    }
  }
  function renderEl(n, scope, out) {
    const tag = n.tagName;
    if (tag === 'block') { renderList(n.childNodes, scope, out); return; }
    const id = n.getAttribute('id');
    const el = (tag === 'canvas' && id && keep[id]) || document.createElement(TAG[tag] || 'div');
    if (tag === 'canvas' && id) keep[id] = el;
    el.className = 'wx-' + tag;
    const ds = {};
    for (const a of n.attributes) {
      const name = a.name, val = interp(a.value, scope);
      if (/^wx:/.test(name) || name === 'xmlns:wx') continue;
      if (name === 'class') { el.className += ' ' + (val || ''); continue; }
      if (name === 'style') { el.setAttribute('style', val || ''); continue; }
      if (/^data-/.test(name)) { ds[name.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase())] = val; continue; }
      const evm = name.match(/^(bind|catch):?(\w+)$/);
      if (evm) { bindEvent(el, evm[2], val, evm[1] === 'catch', ds, n); continue; }
      if (name === 'src' && tag === 'image') { el.src = val; continue; }
      if (name === 'mode' && tag === 'image') { el.style.objectFit = /aspectFill/.test(val) ? 'cover' : /aspectFit/.test(val) ? 'contain' : ''; continue; }
      if (name === 'value' && tag === 'input') { el.value = val == null ? '' : val; continue; }
      if (name === 'scroll-y' && val) { el.style.overflowY = 'auto'; continue; }
      if (name === 'open-type') { if (val === 'share') bindEvent(el, 'tap', '__share', false, ds, n); continue; }
      if (val === false || val == null) continue;
      el.setAttribute(name, val === true ? '' : val);
    }
    el.__ds = ds;
    if (tag !== 'canvas' && tag !== 'input') { const kids = []; renderList(n.childNodes, scope, kids); kids.forEach(k => el.appendChild(k)); }
    out.push(el);
  }
  function bindEvent(el, type, handler, stop, ds, n) {
    const dom = { tap: 'click', input: 'input', confirm: 'change', touchstart: 'pointerdown', touchmove: 'pointermove', touchend: 'pointerup', touchcancel: 'pointercancel', longpress: 'contextmenu' }[type];
    if (!dom) return;
    el.addEventListener(dom, e => {
      if (stop) e.stopPropagation();
      if (/^touch/.test(type)) { touchEvent(e, el, handler); return; }
      const fn = handler === '__share' ? null : page[handler]; if (!fn && handler !== '__share') return;
      const event = { type, currentTarget: { dataset: el.__ds, id: el.id }, target: { dataset: el.__ds }, detail: { value: e.target.value } };
      if (fn) fn.call(page, event);
    });
  }
  /* 鼠标 / 触摸 → 小程序的 touches（多点：按住 Shift 拖动模拟双指缩放） */
  const pts = new Map();
  function touchEvent(e, el, handler) {
    const r = el.getBoundingClientRect(), p = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (e.type === 'pointerdown') { el.setPointerCapture && el.setPointerCapture(e.pointerId); pts.set(e.pointerId, p); }
    else if (e.type === 'pointermove') { if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, p); }
    else pts.delete(e.pointerId);
    const touches = [...pts.values()];
    page[handler] && page[handler].call(page, { touches, changedTouches: [p] });
  }
  let queued = false;
  function paint() {
    queued = false; const root = document.getElementById('wx-root'); const out = [];
    renderList(tpl.childNodes, page.data, out); root.replaceChildren(...out);
  }
  /* ---------- App / Page ---------- */
  let appInst;
  window.App = def => { appInst = def; };
  window.getApp = () => appInst;
  const setPath = (obj, key, val) => { const parts = key.replace(/\[(\d+)\]/g, '.$1').split('.'); let o = obj; parts.slice(0, -1).forEach(p => { if (o[p] == null || typeof o[p] !== 'object') o[p] = {}; o = o[p]; }); o[parts[parts.length - 1]] = val; };
  window.Page = def => {
    page = Object.assign({}, def); page.data = JSON.parse(JSON.stringify(def.data || {}));
    page.setData = (obj, cb) => { for (const k in obj) setPath(page.data, k, obj[k]); paint(); cb && cb(); };
    window.__page = page;
  };
  load(APP); appInst.onLaunch && appInst.onLaunch();
  load(PAGE);
  paint(); page.onLoad && page.onLoad(PREVIEW.query || {}); setTimeout(() => { page.onReady && page.onReady(); }, 30);
};

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Patrick+Hand&family=Nunito:wght@400;700;800&family=ZCOOL+KuaiLe&display=swap">
<style>
html,body{margin:0;height:100%;overflow:hidden}
.wx-page{display:block}
.wx-view,.wx-scroll-view{display:block}
.wx-text{display:inline;white-space:pre-wrap}
.wx-button{display:block;border:0;background:none;font:inherit;color:inherit;padding:0;text-align:center;cursor:pointer}
.wx-input{display:block;font:inherit;box-sizing:border-box}
.wx-image{display:block}
#wx-toast{position:fixed;left:50%;top:45%;transform:translateX(-50%);background:rgba(0,0,0,.75);color:#fff;padding:10px 16px;border-radius:8px;font:14px sans-serif;z-index:9999}
#wx-capsule{position:fixed;z-index:9998;border-radius:16px;background:rgba(255,255,255,.75);border:1px solid rgba(0,0,0,.15);display:flex;align-items:center;justify-content:space-around;font:16px sans-serif;color:#000}
#wx-status{position:fixed;left:0;right:0;top:0;height:44px;z-index:9997;pointer-events:none;font:600 15px -apple-system,sans-serif;display:flex;align-items:center;padding:0 28px;color:#000}
${css}
</style></head><body class="wx-page"><div id="wx-status">9:41</div><div id="wx-root" class="wx-page" style="height:100%"></div>
<div id="wx-capsule"><span>•••</span><span>◉</span></div><div id="wx-toast" hidden></div>
<script>
const MODS = ${JSON.stringify(mods)};
const WXML = ${JSON.stringify(wxml)};
const APP = ${JSON.stringify(appMod)}, PAGE = ${JSON.stringify(pageMod)};
const PREVIEW = (() => { const q = new URLSearchParams(location.search); return { lang: q.get('lang') || 'zh', query: Object.fromEntries([...q].filter(([k]) => k.startsWith('q_')).map(([k, v]) => [k.slice(2), v])) }; })();
(() => { const W = innerWidth, c = document.getElementById('wx-capsule'); Object.assign(c.style, { width: '87px', height: '32px', top: '48px', left: (W - 94) + 'px' }); })();
(${runtime.toString()})();
</script></body></html>`;
process.stdout.write(html);
