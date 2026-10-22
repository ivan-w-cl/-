/* 「咨询公寓」弹窗 = 进群（照搬网页版 booking-handoff.js）：
   进群前：立即进群（不填资料）、改用 WhatsApp / 微信、先问一个小问题（只按房源资料回答，问到房态合同就请进群）；
   进群后：咨询编号、等群码、群码卡片（微信群码图片 / WhatsApp 链接二维码）、7 天过期后申请新码、专家留言。 */
const core = require('../../utils/handoff-core.js');
const api = require('../../utils/case-api.js');
const qrcode = require('../../utils/qrcode.js');
const qa = [];   // 这次打开小程序问过的问题，进群时一起交给专家

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const day = (ms, lang) => { const d = new Date(ms); return lang === 'en' ? `${d.getDate()} ${MONTHS[d.getMonth()]}` : `${d.getMonth() + 1}月${d.getDate()}日`; };
const clock = ms => { const d = new Date(ms); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => (v[k] != null ? v[k] : ''));
function tz() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } }

Component({
  properties: { show: { type: Boolean, value: false }, home: { type: Object, value: null }, lang: { type: String, value: 'zh' } },
  data: { padTop: 16, k: {}, channel: '', other: '', stage: 'ask', busy: '', qa: [], nudge2: '', input: '', c: null, qrLink: '' },
  lifetimes: {
    attached() {
      this.off = api.on(() => this.sync()); api.start();
      // 对话框从微信胶囊按钮下面开始，右上角的关闭按钮才点得到
      try { const m = wx.getMenuButtonBoundingClientRect(); this.setData({ padTop: m.bottom + 8 }); } catch (e) { /* 忽略 */ }
    },
    detached() { this.off && this.off(); }
  },
  observers: {
    'show, home, lang'(show) { if (show) { this.setData({ k: core.W[this.data.lang] || core.W.zh }); this.sync(); } }
  },
  methods: {
    defaultChannel() { return this.data.lang === 'zh' ? 'wechat' : 'whatsapp'; },
    /* 把服务器上的状态整理成页面要显示的样子 */
    sync() {
      const L = this.data.lang, k = core.W[L] || core.W.zh, h = this.data.home, c = api.current, stored = api.stored();
      const channel = this.chosen || this.defaultChannel(), other = channel === 'wechat' ? 'whatsapp' : 'wechat';
      const asked = qa.filter(x => !h || x.home === h.id);
      const view = { k, channel, other, via: fmt(k.via, { app: k[channel] + ' ' }), switchTo: fmt(k.switchTo, { app: k[other] }), qa: asked,
        nudge2: asked.length >= 2 && !asked.some(x => x.push) && h ? fmt(k.nudge2, { home: h.name }) : '' };
      if (!stored) return this.setData(Object.assign(view, { stage: 'ask', c: null }));
      if (!c) return this.setData(Object.assign(view, { stage: 'waiting', c: { code: fmt(k.code, { code: stored.code }), msgs: [] } }));
      const g = c.group, T = core.TEAMS[(g && g.team) || 'A'] || core.TEAMS.A;
      const cv = { code: fmt(k.code, { code: c.code }), msgs: (c.messages || []).map(m => ({ who: `${k.adviser} · ${clock(Date.parse(m.at))}`, text: m.text })) };
      if (g) {
        const exp = g.expiresAt ? Date.parse(g.expiresAt) : null, expired = !!(exp && Date.now() > exp);
        Object.assign(cv, { wa: g.channel === 'whatsapp', name: g.name, image: g.image ? api.media(g.image) : '', link: g.link || '',
          hint: g.channel === 'whatsapp' ? k.qrWa : k.qrWx, team: `${k.team}: ${T[L] || T.en} · ${T.members.join(' · ')}`,
          valid: exp && !expired ? fmt(k.validTill, { d: day(exp, L) }) : '', expired });
      }
      // 已经有群了，又在看另一套公寓：转给同一个群
      if (g && h && !(c.homes || []).some(x => x.id === h.id) && !this.forwarding) {
        this.forwarding = true; api.addHome({ id: h.id, n: h.n, name: h.name }).catch(() => {}).then(() => { this.forwarding = false; });
      }
      cv.forwarded = g && h && (c.homes || []).slice(1).some(x => x.id === h.id) ? fmt(k.forwarded, { home: h.name }) : '';
      this.setData(Object.assign(view, { stage: g ? 'ready' : 'waiting', c: cv }), () => { if (g && g.channel === 'whatsapp' && g.link && this.data.qrLink !== g.link) this.drawQr(g.link); });
    },
    switchChannel() { this.chosen = this.data.other; this.sync(); },
    async join() {
      if (this.data.busy === 'sending') return;
      const h = this.data.home, L = this.data.lang;
      this.setData({ busy: 'sending' });
      try {
        await api.create({ lang: L, tz: tz(), channel: this.data.channel, homes: h ? [{ id: h.id, n: h.n, name: h.name }] : [], qa: qa.map(x => ({ q: x.q, a: x.a })), source: 'miniprogram' });
        this.setData({ busy: '' }); this.sync();
      } catch (e) { this.setData({ busy: 'failed' }); }
    },
    async renew() { try { await api.renew(); wx.showToast({ title: this.data.k.renewed, icon: 'none' }); } catch (e) { wx.showToast({ title: this.data.k.failed, icon: 'none' }); } this.sync(); },
    /* 进群前的小问题 */
    onInput(e) { this.setData({ input: e.detail.value }); },
    askChip(e) { this.ask(e.currentTarget.dataset.q); },
    askInput() { this.ask(this.data.input); this.setData({ input: '' }); },
    ask(q) {
      q = String(q || '').trim().slice(0, 120); if (!q) return;
      const h = this.data.home, r = core.answer(q, h, this.data.lang);
      qa.push({ q, a: r.text, push: r.push, home: h && h.id }); this.sync();
    },
    /* 微信群码：点开大图，长按识别；WhatsApp：复制链接（小程序里打不开外部 App） */
    preview() { const img = this.data.c && this.data.c.image; if (img) wx.previewImage({ urls: [img], current: img, showmenu: true }); },
    copyLink() { const l = this.data.c && this.data.c.link; if (l) wx.setClipboardData({ data: l }); },
    drawQr(link) {
      this.createSelectorQuery().select('#qr').fields({ node: true, size: true }).exec(res => {
        const r = res && res[0]; if (!r || !r.node) return;
        const cv = r.node, ctx = cv.getContext('2d'), dpr = (wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()).pixelRatio || 2;
        cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.scale(dpr, dpr);
        const q = qrcode(0, 'M'); q.addData(link); q.make();
        const n = q.getModuleCount(), m = 2, s = r.width / (n + m * 2);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, r.width, r.height); ctx.fillStyle = '#000000';
        for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) ctx.fillRect((x + m) * s, (y + m) * s, Math.ceil(s), Math.ceil(s));
        this.setData({ qrLink: link });
      });
    },
    close() { this.triggerEvent('close'); },
    noop() {}
  }
});
