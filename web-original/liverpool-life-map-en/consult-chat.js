/* 在线咨询 (web channel of the consult prototype). Replaces the old WhatsApp/AI demo.
   Talks to the same-origin backend (consult-server). If it is unreachable (e.g. the static site is
   opened on its own), the dialog says so politely and nothing is lost. */
(() => {
  'use strict';
  const KEY = 'lsm-consult-v1', API = (window.CONSULT_API || '/api').replace(/\/$/, '');
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  const T = {
    zh: { who: '在线咨询 · 真人客服', ctx: '你在咨询', also: '你的推荐', quiz: '测验结果', prompt: '告诉我们你想了解什么。客服看到后会在这里回复，通常会发给你这套房的咨询群二维码。',
      quick: ['我想咨询这套房', '帮我建群', '现在还有空房吗？', '可以视频看房吗？'], nick: '怎么称呼你？（选填）', nickPh: '例如：小王 / 2026 秋季入学', input: '输入你的问题…', send: '发送',
      you: '我', staff: '客服', sending: '发送中…', sent: '已发送，客服会尽快回复。可以关掉窗口，稍后回来查看。', waiting: '等待客服回复…', newSession: '开始新的咨询',
      offline: '咨询服务暂时连接不上。', offlineTip: '这个页面可能是单独打开的静态版本，或网络有问题。请稍后重试；你的地图、收藏和测验结果都不受影响。', retry: '重试', failed: '发送失败，请重试。',
      qrTipWx: '长按识别二维码进群', qrTip: '请保存图片，再打开微信「扫一扫」→ 右上角「相册」选择这张图进群。', save: '保存图片', privacy: '只会发送你填写的内容和上面的房源/测验摘要，不收集手机号。' },
    en: { who: 'Live chat · real people', ctx: 'You’re asking about', also: 'Your picks', quiz: 'Quiz result', prompt: 'Tell us what you’d like to know. Our team replies right here, usually with a WeChat group QR code for this home.',
      quick: ['I’d like to ask about this home', 'Please set up a group for me', 'Are rooms still available?', 'Can I have a video viewing?'], nick: 'What should we call you? (optional)', nickPh: 'e.g. Wang / starting Sept 2026', input: 'Type your question…', send: 'Send',
      you: 'You', staff: 'Team', sending: 'Sending…', sent: 'Sent. We’ll reply as soon as we can — you can close this and come back later.', waiting: 'Waiting for a reply…', newSession: 'Start a new chat',
      offline: 'The chat service can’t be reached right now.', offlineTip: 'This page may be the stand-alone static version, or the network is down. Please try again later; your map, saved homes and quiz results are unaffected.', retry: 'Retry', failed: 'Couldn’t send. Please try again.',
      qrTipWx: 'Press and hold the QR code to join the group', qrTip: 'Save the image, then in WeChat open Scan → Album and pick it to join the group.', save: 'Save image', privacy: 'Only what you type plus the home/quiz summary above is sent. No phone number is collected.' }
  };
  const load = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && v.id && v.token ? v : null; } catch (_) { return null; } };
  const store = v => { try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch (_) {} };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const fmt = t => { const d = new Date(t); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); };
  async function call(path, opts = {}) {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 8000);
    try {
      const r = await fetch(API + path, { ...opts, signal: ctl.signal, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
      const j = await r.json().catch(() => null); if (!r.ok || !j) throw Object.assign(new Error(j?.error || 'http_' + r.status), { status: r.status }); return j;
    } finally { clearTimeout(timer); }
  }

  let view = null, pollTimer = 0;
  function context(home, lang) {
    const hm = window.HomeMatch, snap = hm?.isActive?.() ? hm.getSnapshot() : null, life = window.LifeQuiz?.summary?.();
    const homes = home ? [{ id: home.id, n: home.n, name: home.name, addr: home.addr || '', price: priceOf(home, lang) }] : [];
    return { homes, picks: snap ? snap.picks.map(p => ({ n: p.n, name: p.name })) : [], lifeCharacter: life?.name || '', homeMatch: snap?.persona || '', lang, page: location.pathname };
  }
  function priceOf(h, lang) {
    const zh = lang === 'zh', p = [];
    if (h.pe) p.push((zh ? '独卫 £' : 'En-suite £') + h.pe); if (h.ps) p.push((zh ? '套间 £' : 'Studio £') + h.ps); if (!p.length && h.plo) p.push((zh ? '房间 £' : 'Room £') + h.plo);
    return p.length ? p.join(' · ') + (zh ? '／周（历史参考）' : ' / wk (past ref.)') : '';
  }

  function open(home, lang, opts = {}) {
    lang = lang === 'zh' ? 'zh' : 'en'; const w = T[lang], root = document.getElementById('contactDemo'); if (!root) return;
    clearTimeout(pollTimer);
    const ctx = context(home, lang); ctx.source = opts.source || 'home-card';
    root.textContent = ''; root.className = 'cc'; root.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    // context card
    const card = el('section', 'cc-ctx');
    if (ctx.homes[0]) { card.append(el('p', 'cc-k', w.ctx)); const b = el('p', 'cc-home'); b.append(el('span', 'cc-n', String(ctx.homes[0].n || '')), el('b', '', ctx.homes[0].name)); card.append(b); if (ctx.homes[0].price) card.append(el('p', 'cc-sub', ctx.homes[0].price)); }
    const quiz = [ctx.lifeCharacter, ctx.homeMatch].filter(Boolean).join(' · ');
    if (quiz) card.append(el('p', 'cc-sub', `${w.quiz}：${quiz}`));
    const others = ctx.picks.filter(p => !ctx.homes[0] || p.name !== ctx.homes[0].name);
    if (others.length) card.append(el('p', 'cc-sub', `${w.also}：${others.map(p => p.n + '. ' + p.name).join('、')}`));
    const status = el('div', 'cc-status'); status.setAttribute('role', 'status');
    const log = el('div', 'cc-log'); log.setAttribute('aria-live', 'polite');
    const prompt = el('p', 'cc-prompt', w.prompt);
    const quick = el('div', 'cc-quick'); w.quick.forEach(q => { const b = el('button', 'cc-chip', q); b.type = 'button'; b.addEventListener('click', () => submit(q)); quick.append(b); });
    const nickWrap = el('label', 'cc-nick'); nickWrap.append(el('span', '', w.nick)); const nick = el('input'); nick.maxLength = 40; nick.placeholder = w.nickPh; nick.autocomplete = 'nickname'; nickWrap.append(nick);
    const form = el('form', 'cc-form'); const input = el('textarea'); input.rows = 2; input.maxLength = 1000; input.placeholder = w.input; input.setAttribute('aria-label', w.input);
    const sendBtn = el('button', 'cc-send', w.send); sendBtn.type = 'submit'; form.append(input, sendBtn);
    const fine = el('p', 'cc-fine', w.privacy);
    root.append(card, prompt, log, status, quick, nickWrap, form, fine);
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });
    form.addEventListener('submit', e => { e.preventDefault(); submit(input.value); });

    let saved = load(), busy = false, online = null, lastCount = -1;
    view = { root, refresh: () => poll(true) };
    function setOnline(ok) {
      online = ok; status.textContent = ''; status.className = 'cc-status';
      [sendBtn, ...quick.querySelectorAll('button')].forEach(b => { b.disabled = !ok; });
      if (!ok) { status.className = 'cc-status cc-offline'; status.append(el('b', '', w.offline), el('span', '', ' ' + w.offlineTip)); const r = el('button', 'cc-retry', w.retry); r.type = 'button'; r.addEventListener('click', boot); status.append(r); }
    }
    function render(session) {
      const msgs = session?.messages || [];
      nickWrap.hidden = !!session; prompt.hidden = !!session && msgs.length > 0;
      if (msgs.length === lastCount) return; lastCount = msgs.length;
      log.textContent = '';
      msgs.forEach(m => {
        const item = el('div', `cc-msg cc-${m.from}`); item.append(el('span', 'cc-who', `${m.from === 'staff' ? w.staff : w.you} · ${fmt(m.at)}`));
        if (m.image) {
          const fig = el('figure', 'cc-qr'), img = el('img'); img.src = API.replace(/\/api$/, '') + m.image; img.alt = lang === 'zh' ? '咨询群二维码' : 'WeChat group QR code'; img.loading = 'lazy';
          fig.append(img); fig.append(el('figcaption', 'cc-qr-tip', isWeChat ? w.qrTipWx : w.qrTipWx + '（' + (lang === 'zh' ? '微信内' : 'inside WeChat') + '）'));
          if (!isWeChat) { fig.append(el('p', 'cc-qr-alt', w.qrTip)); const a = el('a', 'cc-save', w.save); a.href = img.src; a.download = 'wechat-group-qr' + (m.image.endsWith('.jpg') ? '.jpg' : '.png'); fig.append(a); }
          item.append(fig);
        }
        if (m.text) item.append(el('p', '', m.text));
        log.append(item);
      });
      const last = msgs[msgs.length - 1];
      if (last && last.from === 'student') { const wt = el('p', 'cc-wait', w.waiting); log.append(wt); }
      if (session) { const again = el('button', 'cc-new', w.newSession); again.type = 'button'; again.addEventListener('click', () => { store(null); saved = null; lastCount = -1; render(null); log.textContent = ''; }); log.append(again); }
      const box = root.closest('.contact'); if (box && msgs.length) requestAnimationFrame(() => { box.scrollTop = box.scrollHeight; });
    }
    async function poll(force) {
      clearTimeout(pollTimer);
      if (!document.body.contains(root) || document.getElementById('contactWrap')?.hidden) return;
      if (saved) {
        try { const s = await call(`/consult/sessions/${encodeURIComponent(saved.id)}?token=${encodeURIComponent(saved.token)}`); if (online !== true) setOnline(true); render(s); }
        catch (e) { if (e.status === 404) { store(null); saved = null; render(null); } else if (online !== false) setOnline(false); }
      }
      pollTimer = setTimeout(poll, document.hidden ? 15000 : 3000);
    }
    async function boot() {
      try { await call('/health'); setOnline(true); } catch (_) { setOnline(false); return; }
      render(null); if (saved) await poll(true); else pollTimer = setTimeout(poll, 3000);
    }
    async function submit(text) {
      text = String(text || '').trim(); if (!text || busy || online === false) return;
      busy = true; sendBtn.disabled = true; status.className = 'cc-status'; status.textContent = w.sending;
      try {
        let s;
        if (saved) s = await call(`/consult/sessions/${encodeURIComponent(saved.id)}/messages?token=${encodeURIComponent(saved.token)}`, { method: 'POST', body: JSON.stringify({ text, context: ctx }) });
        else { const r = await call('/consult/sessions', { method: 'POST', body: JSON.stringify({ text, nickname: nick.value.trim(), context: ctx }) }); saved = { id: r.id, token: r.token }; store(saved); s = r.session; }
        input.value = ''; status.textContent = w.sent; render(s); poll();
      } catch (e) { status.className = 'cc-status cc-error'; status.textContent = w.failed; if (!e.status) setOnline(false); }
      finally { busy = false; if (online) sendBtn.disabled = false; }
    }
    boot();
  }
  window.ConsultChat = Object.freeze({ open, title: lang => T[lang === 'zh' ? 'zh' : 'en'].who });
})();
