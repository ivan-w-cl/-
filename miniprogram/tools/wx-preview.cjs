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
const cssRaw = () => [fs.readFileSync(path.join(ROOT, 'app.wxss'), 'utf8'), fs.readFileSync(path.join(ROOT, pagePath + '.wxss'), 'utf8'), compCss].join('\n');
let css = '';
const fixCss = c => c
  .replace(/(-?[\d.]+)rpx/g, (_, n) => `calc(${n} * var(--rpx))`).replace(/(^|[},\s])page(\s*[{,])/g, '$1.wx-page$2')
  .replace(/(^|[\s,{}>+~])(view|text|button|input|image|scroll-view|canvas)(?=[\s,{:.>+~\[])/g, '$1.wx-$2');   // 标签选择器 → 预览里的类名
const wxml = fs.readFileSync(path.join(ROOT, pagePath + '.wxml'), 'utf8');
/* 页面用到的自定义组件 */
const pageJson = JSON.parse(fs.readFileSync(path.join(ROOT, pagePath + '.json'), 'utf8'));
const comps = {};
let compCss = '';
for (const [tag, ref] of Object.entries(pageJson.usingComponents || {})) {
  const base = path.join(ROOT, ref.replace(/^\//, ''));
  comps[tag] = { mod: add(base + '.js'), wxml: fs.readFileSync(base + '.wxml', 'utf8') };
  compCss += '\n' + fs.readFileSync(base + '.wxss', 'utf8');
}

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
  const devUrl = u => String(u).replace(/^http:\/\/localhost:8765/, PREVIEW.api || 'http://localhost:8765');   // 预览：把开发服务器地址换成同源代理
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
    request: o => { fetch(devUrl(o.url), { method: o.method || 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, o.header || {}), body: o.data && o.method && o.method !== 'GET' ? JSON.stringify(o.data) : undefined })
      .then(async r => { const data = await r.json().catch(() => null); o.success && o.success({ statusCode: r.status, data }); }).catch(e => o.fail && o.fail({ errMsg: String(e) })).finally(() => o.complete && o.complete()); },
    login: o => o.success && o.success({ code: 'preview-code' }), requestSubscribeMessage: o => o.success && o.success({}), removeStorageSync: k => localStorage.removeItem('wx:' + k),
    previewImage() {}, navigateTo: o => { window.__nav = o.url; }, setClipboardData: o => { window.__clip = o.data; o.success && o.success(); },
    downloadFile: o => { fetch(devUrl(o.url)).then(async r => { const b = await r.blob(); o.success && o.success({ statusCode: r.status, tempFilePath: URL.createObjectURL(b) }); }).catch(e => o.fail && o.fail({ errMsg: String(e) })); },
    canvasToTempFilePath: o => setTimeout(() => { try { o.success && o.success({ tempFilePath: o.canvas.toDataURL('image/png') }); } catch (e) { o.fail && o.fail({ errMsg: String(e) }); } }),
    saveImageToPhotosAlbum: o => { window.__saved = o.filePath; o.success && o.success(); }, showShareImageMenu: o => { window.__shareImg = o.path; },
    showModal: o => o.success && o.success({ confirm: false }), openSetting() {}
  };
  /* 小程序 canvas 的 createImage（预览里就是普通的 Image，地址换成同源代理） */
  HTMLCanvasElement.prototype.createImage = function () { const img = new Image(); img.crossOrigin = 'anonymous'; const d = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(img, 'src', { set(v) { d.set.call(img, devUrl(v)); }, get() { return d.get.call(img); } }); return img; };
  /* ---------- WXML ---------- */
  const parse = (WXML) => {
    const fixed = WXML.replace(/\s(wx:else|disable-scroll|scroll-y|enhanced)(?=[\s>/])/g, ' $1="true"').replace(/\{\{([\s\S]*?)\}\}/g, m => m.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    const doc = new DOMParser().parseFromString('<root xmlns:wx="urn:wx" xmlns:bind="urn:bind" xmlns:catch="urn:catch">' + fixed.replace(/<!--[\s\S]*?-->/g, '') + '</root>', 'text/xml');
    const err = doc.querySelector('parsererror'); if (err) throw new Error('WXML parse error: ' + err.textContent);
    return doc.documentElement;
  };
  const tpl = parse(WXML);
  const compTpl = {}; for (const k in COMPS) compTpl[k] = parse(COMPS[k].wxml);
  const fnCache = {};
  const ev = (expr, scope) => { let f = fnCache[expr]; if (!f) { try { f = new Function('__s', 'with(__s){return (' + expr + ')}'); } catch (e) { console.error('WXML expr: ' + expr); f = () => undefined; } fnCache[expr] = f; } try { return f(scope); } catch (e) { return undefined; } };
  const interp = (str, scope) => {
    const m = str.match(/^\s*\{\{([\s\S]*?)\}\}\s*$/); if (m && !m[1].includes('}}')) return ev(m[1], scope);
    return str.replace(/\{\{([\s\S]*?)\}\}/g, (_, e) => { const v = ev(e, scope); return v == null ? '' : v; });
  };
  const TAG = { view: 'div', text: 'span', image: 'img', 'scroll-view': 'div', canvas: 'canvas', input: 'input', button: 'button' };
  const keep = {};
  let page;
  function renderList(nodes, scope, out, owner) {
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
        (Array.isArray(list) ? list : Object.values(list)).forEach((v, i) => renderEl(n, Object.assign(Object.create(scope), { [it]: v, [ix]: i }), out, owner));
      } else renderEl(n, scope, out, owner);
    }
  }
  function renderEl(n, scope, out, owner) {
    owner = owner || page;
    const tag = n.tagName;
    if (tag === 'block') { renderList(n.childNodes, scope, out, owner); return; }
    if (COMPS[tag]) { out.push(renderComp(tag, n, scope, owner)); return; }
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
      if (evm) { bindEvent(el, evm[2], val, evm[1] === 'catch', ds, owner); continue; }
      if (name === 'src' && tag === 'image') { el.src = devUrl(val); continue; }
      if (name === 'mode' && tag === 'image') { el.style.objectFit = /aspectFill/.test(val) ? 'cover' : /aspectFit/.test(val) ? 'contain' : ''; continue; }
      if (name === 'value' && tag === 'input') { el.value = val == null ? '' : val; continue; }
      if (name === 'scroll-y' && val) { el.style.overflowY = 'auto'; continue; }
      if (name === 'open-type') { if (val === 'share') bindEvent(el, 'tap', '__share', false, ds, owner); continue; }
      if (val === false || val == null) continue;
      el.setAttribute(name, val === true ? '' : val);
    }
    el.__ds = ds;
    if (tag !== 'canvas' && tag !== 'input') { const kids = []; renderList(n.childNodes, scope, kids, owner); kids.forEach(k => el.appendChild(k)); }
    out.push(el);
  }
  /* 自定义组件：每个组件一个持久实例，属性变了就跑 observers */
  const insts = {}, byId = {}; let rendering = false;
  let compSeq = 0;
  function renderComp(tag, n, scope, owner) {
    const key = tag + '#' + (compSeq++);
    let inst = insts[key];
    const def = COMP_DEFS[tag];
    if (!inst) {
      inst = insts[key] = { data: {}, __props: {}, __el: null, __owner: owner, __binds: {} };
      // 微信组件自带的只读属性（同名赋值不生效）
      ['renderer', 'is', 'id', 'dataset', 'router', 'pageRouter'].forEach(k => Object.defineProperty(inst, k, { value: k === 'renderer' ? 'webview' : k === 'is' ? 'components/' + tag : '', writable: false, enumerable: false }));
      Object.entries(def.properties || {}).forEach(([k, v]) => { inst.data[k] = v && typeof v === 'object' && 'value' in v ? v.value : null; });
      Object.assign(inst.data, JSON.parse(JSON.stringify(def.data || {})));
      Object.entries(def.methods || {}).forEach(([k, f]) => { inst[k] = f; });
      inst.setData = (obj, cb) => { for (const k in obj) setPath(inst.data, k, obj[k]); if (rendering) { if (!queued) { queued = true; setTimeout(paint); } } else paint(); cb && setTimeout(cb); };
      inst.triggerEvent = (name, detail) => { const h = inst.__binds[name]; const o = inst.__owner; if (h && o[h]) o[h].call(o, { detail: detail || {} }); };
      inst.createSelectorQuery = () => { const q = { select: sel => ({ fields: () => ({ exec: cb => setTimeout(() => { const el = inst.__el && inst.__el.querySelector(sel); if (!el) return cb([null]); const r = el.getBoundingClientRect(); el.requestAnimationFrame = f => requestAnimationFrame(f); cb([{ node: el, width: r.width, height: r.height }]); }) }) }) }; return q; };
      inst.__attach = true;
    }
    const cid = n.getAttribute('id'); if (cid) byId['#' + cid] = inst;
    const changed = [];
    for (const a of n.attributes) {
      if (a.name === 'id') continue;
      const m = a.name.match(/^bind:?(\w+)$/); if (m) { inst.__binds[m[1]] = a.value; continue; }
      if (/^wx:|^class$|^style$/.test(a.name)) continue;
      const prop = a.name.replace(/-(\w)/g, (_, c) => c.toUpperCase()), v = interp(a.value, scope);
      if (JSON.stringify(inst.__props[prop]) !== JSON.stringify(v)) { inst.__props[prop] = v; inst.data[prop] = v; changed.push(prop); }
    }
    if (inst.__attach) { inst.__attach = false; def.lifetimes && def.lifetimes.attached && def.lifetimes.attached.call(inst); }
    if (changed.length && def.observers) Object.entries(def.observers).forEach(([keys, f]) => { const ks = keys.split(',').map(x => x.trim()); if (ks.some(x => changed.includes(x))) setTimeout(() => f.apply(inst, ks.map(x => inst.data[x]))); });
    const root = document.createElement('div'); root.className = 'wx-comp wx-' + tag;
    const kids = []; renderList(compTpl[tag].childNodes, inst.data, kids, inst); kids.forEach(k => root.appendChild(k));
    inst.__el = root; return root;
  }
  function bindEvent(el, type, handler, stop, ds, owner) {
    const dom = { tap: 'click', input: 'input', confirm: 'change', touchstart: 'pointerdown', touchmove: 'pointermove', touchend: 'pointerup', touchcancel: 'pointercancel', longpress: 'contextmenu' }[type];
    if (!dom) return;
    el.addEventListener(dom, e => {
      if (stop) e.stopPropagation();
      if (/^touch/.test(type)) { touchEvent(e, el, handler, owner); return; }
      const fn = handler === '__share' ? null : owner[handler]; if (!fn && handler !== '__share') return;
      const event = { type, currentTarget: { dataset: el.__ds, id: el.id }, target: { dataset: el.__ds }, detail: { value: e.target.value } };
      if (fn) fn.call(owner, event);
    });
  }
  /* 鼠标 / 触摸 → 小程序的 touches（多点：按住 Shift 拖动模拟双指缩放） */
  const pts = new Map();
  function touchEvent(e, el, handler, owner) {
    const r = el.getBoundingClientRect(), p = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (e.type === 'pointerdown') { el.setPointerCapture && el.setPointerCapture(e.pointerId); pts.set(e.pointerId, p); }
    else if (e.type === 'pointermove') { if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, p); }
    else pts.delete(e.pointerId);
    const touches = [...pts.values()];
    owner[handler] && owner[handler].call(owner, { touches, changedTouches: [p] });
  }
  let queued = false;
  function paint() {
    queued = false; const root = document.getElementById('wx-root'); const out = [];
    compSeq = 0; rendering = true; try { renderList(tpl.childNodes, page.data, out, page); } finally { rendering = false; } root.replaceChildren(...out);
  }
  /* ---------- App / Page ---------- */
  let appInst;
  window.App = def => { appInst = def; };
  window.getApp = () => appInst;
  const COMP_DEFS = {}; let loadingComp = null;
  window.Component = def => { COMP_DEFS[loadingComp] = def; };
  const setPath = (obj, key, val) => { const parts = key.replace(/\[(\d+)\]/g, '.$1').split('.'); let o = obj; parts.slice(0, -1).forEach(p => { if (o[p] == null || typeof o[p] !== 'object') o[p] = {}; o = o[p]; }); o[parts[parts.length - 1]] = val; };
  window.Page = def => {
    page = Object.assign({}, def); page.data = JSON.parse(JSON.stringify(def.data || {}));
    page.selectComponent = sel => byId[sel] || null;
    page.setData = (obj, cb) => { for (const k in obj) setPath(page.data, k, obj[k]); paint(); cb && cb(); };
    window.__page = page;
  };
  load(APP); appInst.onLaunch && appInst.onLaunch();
  for (const k in COMPS) { loadingComp = k; load(COMPS[k].mod); }
  load(PAGE);
  // 和微信一样：this.options 是启动参数、this.route 是页面路径（同名方法会被覆盖）
  page.options = PREVIEW.query || {}; page.route = PAGE_PATH;
  paint(); page.onLoad && page.onLoad(PREVIEW.query || {}); page.onShow && page.onShow(); setTimeout(() => { page.onReady && page.onReady(); }, 30);
};

css = fixCss(cssRaw());
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
const APP = ${JSON.stringify(appMod)}, PAGE = ${JSON.stringify(pageMod)}, COMPS = ${JSON.stringify(comps)}, PAGE_PATH = ${JSON.stringify(pagePath)};
const PREVIEW = (() => { const q = new URLSearchParams(location.search); return { api: q.get('api') || '', lang: q.get('lang') || 'zh', query: Object.fromEntries([...q].filter(([k]) => k.startsWith('q_')).map(([k, v]) => [k.slice(2), v])) }; })();
(() => { const W = innerWidth, c = document.getElementById('wx-capsule'); Object.assign(c.style, { width: '87px', height: '32px', top: '48px', left: (W - 94) + 'px' }); })();
(${runtime.toString()})();
</script></body></html>`;
process.stdout.write(html);
