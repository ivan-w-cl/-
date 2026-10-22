/* 分享卡片（网页版 share-cards.js 的小程序版）：4 种样式，1080×1350 竖图，带码。
   画法和文案来自网页（utils/share-cards-core.js，scripts/export-share.cjs 生成）；这里只负责弹窗、画布、保存和转发。
   码：服务器配置了小程序 AppID 时用小程序码（微信扫码直接打开这个小程序，带上测试和推广码），否则和网页一样用普通二维码。 */
const config = require('../../config.js');
const scene = require('../../data/scene.js');
const fonts = require('../../utils/fonts.js');
const qrcode = require('../../utils/qrcode.js');
const link = require('../../utils/share-link.js');
const { createRenderer } = require('../../map/render.js');
const createShare = require('../../utils/share-cards-core.js');
const markerOf = id => scene.markers.find(m => m.id === id);
const HIDE = { home: 1, uni: 1, rail: 1, bus: 1, food: 1, sight: 1 };   // 网页截的是底图（#base），不含图标
const STYLE_KEYS = ['map', 'polaroid', 'ticket', 'notes'];

Component({
  properties: { lang: { type: String, value: 'zh' }, padTop: { type: Number, value: 16 } },
  data: { open: false, style: 'map', tabs: [], k: {}, img: '', busy: false },
  lifetimes: {
    attached() {
      this.codes = {};
      this.core = createShare({ qrcode, refCode: link.refCode, shareUrl: () => link.link({ lang: this.data.lang }),
        loadImg: src => this.loadImg(src ? config.API_BASE.replace(/\/$/, '') + '/' + src.replace(/^\.\//, '') : ''),
        mapImage: picks => this.mapImage(picks), code: text => this.codes[text] || null });
    }
  },
  methods: {
    /* d = { kicker, stamp, title, desc, picks: [{ name, n, id, price, walk }], link, scan, shareText, quiz, duo }；生活选房卡不带 kicker / link */
    open(d) {
      if (!d || !d.title) return;
      this.d = d; const k = this.core.T[this.data.lang === 'en' ? 'en' : 'zh'];
      this.setData({ open: true, k, tabs: STYLE_KEYS.map(key => ({ key, label: k.styles[key] })), img: '' });
      wx.nextTick(() => this.paint());
    },
    close() { this.setData({ open: false, img: '' }); },
    pickStyle(e) { this.setData({ style: e.currentTarget.dataset.s }); this.paint(); },
    canvas() {
      if (this.cv) return Promise.resolve(this.cv);
      return new Promise(res => this.createSelectorQuery().select('#sc').fields({ node: true, size: true }).exec(r => {
        const n = r && r[0] && r[0].node; if (!n) return res(null);
        n.width = this.core.W; n.height = this.core.H; this.cv = n; res(n);
      }));
    },
    loadImg(src) {
      return new Promise(res => {
        if (!src || !this.cv) return res(null);
        const img = this.cv.createImage(), t = setTimeout(() => res(null), 8000);
        img.onload = () => { clearTimeout(t); res(img); }; img.onerror = () => { clearTimeout(t); res(null); }; img.src = src;
      });
    },
    /* 网页把 SVG 底图截一块；这里用同一个地图渲染器把那一块画到离屏画布上，坐标系完全相同 */
    mapImage(picks) {
      const pts = picks.map(p => { const m = markerOf(p.id); return m ? [m.x, m.y] : null; }), ok = pts.filter(Boolean);
      if (!ok.length || !wx.createOffscreenCanvas) return Promise.resolve(null);
      const xs = ok.map(p => p[0]), ys = ok.map(p => p[1]);
      let w = Math.max(520, Math.max(...xs) - Math.min(...xs) + 360), h = w * 0.72;
      if (Math.max(...ys) - Math.min(...ys) + 300 > h) { h = Math.max(...ys) - Math.min(...ys) + 300; w = h / 0.72; }
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2, vb = [cx - w / 2, cy - h / 2, w, h];
      const PW = 1200, PH = Math.round(1200 * h / w), k = PW / w;
      try {
        const make = (cw, ch) => wx.createOffscreenCanvas({ type: '2d', width: cw, height: ch });
        const img = make(PW, PH), c = img.getContext('2d');
        if (!this.renderer) this.renderer = createRenderer(scene, { dpr: 1, makeCanvas: make, font: fonts.pick });
        this.renderer.setLang(this.data.lang); this.renderer.relayout();
        this.renderer.draw(c, { k, tx: -vb[0] * k, ty: -vb[1] * k, w: PW, h: PH }, { hidden: HIDE, relayout: true });
        return Promise.resolve({ img, vb, pts });
      } catch (e) { return Promise.resolve(null); }
    },
    /* 小程序码：服务器 /api/wxacode 生成（要配 WX_APPID / WX_APPSECRET）；拿不到就用普通二维码 */
    prepareCode(d) {
      const text = d.link || link.link({ lang: this.data.lang });
      if (this.codes[text] !== undefined) return Promise.resolve();
      return new Promise(res => wx.downloadFile({ url: config.API_BASE.replace(/\/$/, '') + '/api/wxacode?scene=' + encodeURIComponent(link.scene({ quiz: d.quiz, duo: d.duo })),
        success: r => { if (r.statusCode !== 200) { this.codes[text] = null; return res(); } this.loadImg(r.tempFilePath).then(img => { this.codes[text] = img; res(); }); },
        fail: () => { this.codes[text] = null; res(); } }));
    },
    async paint() {
      const cv = await this.canvas(); if (!cv) return;
      const seq = (this.seq || 0) + 1; this.seq = seq;
      this.setData({ busy: true });
      await new Promise(r => fonts.ready(r));
      await this.prepareCode(this.d);
      const ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, this.core.W, this.core.H);
      await this.core.STYLES[this.data.style](ctx, this.d, this.data.k);
      if (seq !== this.seq) return;
      wx.canvasToTempFilePath({ canvas: cv, fileType: 'png', success: r => { if (seq === this.seq) this.setData({ img: r.tempFilePath, busy: false }); }, fail: () => this.setData({ busy: false }) }, this);
    },
    /* 保存到相册 / 转发给朋友（微信的分享图片菜单：发给朋友、收藏、保存） */
    save() {
      if (!this.data.img) return;
      wx.saveImageToPhotosAlbum({ filePath: this.data.img, success: () => wx.showToast({ title: this.data.lang === 'en' ? 'Saved to Photos' : '已保存到相册', icon: 'none' }),
        fail: e => { if (/auth|deny/i.test(e.errMsg || '')) wx.showModal({ content: this.data.lang === 'en' ? 'Allow saving to Photos in Settings, then try again.' : '请在设置里允许保存到相册，再试一次。', confirmText: this.data.lang === 'en' ? 'Settings' : '去设置', success: m => m.confirm && wx.openSetting() }); } });
    },
    shareImg() { if (this.data.img && wx.showShareImageMenu) wx.showShareImageMenu({ path: this.data.img }); else this.save(); },
    preview() { if (this.data.img) wx.previewImage({ urls: [this.data.img], current: this.data.img, showmenu: true }); },
    copy() { const d = this.d, url = d.link || link.link({ lang: this.data.lang }); wx.setClipboardData({ data: (d.shareText || this.data.k.shareText) + url, success: () => wx.showToast({ title: this.data.k.copied, icon: 'none' }) }); },
    noop() {}
  }
});
