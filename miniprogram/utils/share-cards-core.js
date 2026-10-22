/* 自动生成：scripts/export-share.cjs 从网页版 share-cards.js 原样摘出。不要手改。 */
'use strict';
module.exports = function createShare(deps) {
  const refCode = deps.refCode, shareUrl = deps.shareUrl, loadImg = deps.loadImg, mapImage = deps.mapImage;
  // 小程序码（扫码直接打开小程序）已准备好就画它，否则和网页一样画普通二维码
  const qr = (ctx, text, x, y, size) => { const img = deps.code && deps.code(text); if (img) { ctx.fillStyle = '#fff'; ctx.fillRect(x, y, size, size); ctx.drawImage(img, x + 6, y + 6, size - 12, size - 12); } else qrDraw(ctx, text, x, y, size); };
  const REF_KEY = 'lsm-ref-v1', W = 1080, H = 1350;
  const INK = '#3b2a1a', SOFT = '#6e5538', PAPER = '#f1e4c3', PANEL = '#fffaf0', CORAL = '#b5462f', CORAL2 = '#e8735a', YELLOW = '#f2c14e', MERSEY = '#4f8f98', GRASS = '#b9cf9a';
  const T = {
    zh: { make: '🎴 生成分享卡片', title: '分享我的生活选房卡', styles: { map: '手绘地图', polaroid: '拍立得', ticket: '车票', notes: '便利贴' },
      save: '保存图片', share: '分享', copy: '复制分享链接', copied: '分享链接已复制', hold: '手机上长按图片即可保存或转发。', close: '关闭',
      kicker: '我的利物浦生活选房卡', picks: '我想先看的 3 处公寓', scan: '扫码测测你的利物浦生活风格', footer: 'Liverpool Student Map · 历史参考价，不代表实时空房',
      from: '出发', to: '到达', home: '我的新家', passenger: '旅客类型', stops: '停靠站', boarding: '登车口', ref: '推广码', first: '优先看看', also: '也想看看',
      shareText: '我测了我的利物浦生活选房卡，你也来试试：' },
    en: { make: '🎴 Make a share card', title: 'Share my Home Match card', styles: { map: 'Hand-drawn map', polaroid: 'Polaroid', ticket: 'Train ticket', notes: 'Sticky notes' },
      save: 'Save image', share: 'Share', copy: 'Copy share link', copied: 'Share link copied', hold: 'On a phone, press and hold the image to save or send it.', close: 'Close',
      kicker: 'My Liverpool Home Match card', picks: 'The 3 homes I want to see first', scan: 'Scan to find your own Liverpool style', footer: 'Liverpool Student Map · Recorded prices, not live availability',
      from: 'From', to: 'To', home: 'My new home', passenger: 'Traveller', stops: 'Stops', boarding: 'Platform', ref: 'Ref', first: 'First look', also: 'Also on my list',
      shareText: 'I found my Liverpool lifestyle on the student map. Try yours: ' }
  };

  const DISPLAY = "'Gochi Hand', 'ZCOOL KuaiLe', cursive", HAND = "'Patrick Hand', 'ZCOOL KuaiLe', cursive", BODY = "'Nunito', 'Noto Sans SC', 'PingFang SC', sans-serif";

  /* ---------- 画图工具 ---------- */
  function wrap(ctx, text, maxW) {
    const out = []; let line = '';
    const tokens = String(text).match(/[　-鿿＀-￯]|[^\s　-鿿＀-￯]+\s*|\s+/g) || [];
    tokens.forEach(tok => { const test = line + tok; if (ctx.measureText(test).width > maxW && line) { out.push(line.trimEnd()); line = tok.trimStart(); } else line = test; });
    if (line.trim()) out.push(line.trimEnd());
    return out;
  }
  function textBlock(ctx, text, x, y, maxW, lh, maxLines) {
    let lines = wrap(ctx, text, maxW);
    if (maxLines && lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/.{0,2}$/, '…'); }
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
    return y + lines.length * lh;
  }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function card(ctx, x, y, w, h, fill, r, shadow) {
    ctx.save(); if (shadow !== false) { ctx.fillStyle = 'rgba(59,42,26,.22)'; rr(ctx, x + 8, y + 10, w, h, r || 26); ctx.fill(); }
    ctx.fillStyle = fill; ctx.strokeStyle = INK; ctx.lineWidth = 5; rr(ctx, x, y, w, h, r || 26); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  function tape(ctx, x, y, w, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot || -0.05); ctx.fillStyle = 'rgba(242,193,78,.82)'; ctx.fillRect(-w / 2, -18, w, 36); ctx.restore(); }
  function paper(ctx, color) {
    ctx.fillStyle = color || PAPER; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(201,180,141,.35)';
    for (let i = 0; i < 1400; i++) { const x = (i * 97.3) % W, y = (i * 61.7 + (i % 7) * 13) % H; ctx.fillRect(x, y, 2, 2); }
  }
  function qrDraw(ctx, text, x, y, size) {
    let q; try { q = deps.qrcode(0, 'M'); q.addData(text); q.make(); } catch (_) { return; }
    const n = q.getModuleCount(), m = 2, cell = size / (n + m * 2);
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, size, size); ctx.fillStyle = INK;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) ctx.fillRect(x + (c + m) * cell, y + (r + m) * cell, Math.ceil(cell), Math.ceil(cell));
  }
  function badge(ctx, x, y, r, n, color) {
    ctx.save(); ctx.fillStyle = color || CORAL2; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = `800 ${Math.round(r * 1.05)}px ${BODY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), x, y + 2); ctx.restore();
  }
  function footer(ctx, d, k, y, dark) {
    const size = 170, x = W - 90 - size;
    ctx.save(); ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 5; rr(ctx, x - 14, y - 14, size + 28, size + 28, 18); ctx.fill(); ctx.stroke(); ctx.restore();
    qr(ctx, d.link || shareUrl(), x, y, size);
    ctx.fillStyle = dark ? PANEL : INK; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.font = `44px ${DISPLAY}`; textBlock(ctx, d.scan || k.scan, 90, y + 52, x - 140, 54, 2);
    ctx.font = `600 26px ${BODY}`; ctx.fillStyle = dark ? '#e9dcbc' : SOFT;
    ctx.fillText(`${k.ref} ${refCode()}`, 90, y + 162);
    ctx.font = `22px ${BODY}`; ctx.fillText(k.footer, 90, H - 52);
  }

  function cover(ctx, img, x, y, w, h) {
    const s = Math.max(w / img.width, h / img.height), sw = w / s, sh = h / s;
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
  }
  const PHOTO_OF = { 'iq-great-newton-house': './photos/ensuite-bedroom.jpg' };


  /* ---------- 4 种样式 ---------- */
  async function drawMap(ctx, d, k) {
    paper(ctx);
    ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.font = `30px ${HAND}`; ctx.fillText((d.kicker || k.kicker).toUpperCase(), 90, 120);
    ctx.font = `70px ${DISPLAY}`; let y = textBlock(ctx, `${d.stamp} ${d.title}`, 90, 205, W - 180, 80, 2);
    const mx = 90, my = y + 10, mw = W - 180, mh = 400;
    card(ctx, mx, my, mw, mh, PANEL, 22);
    const m = await mapImage(d.picks);
    ctx.save(); rr(ctx, mx + 12, my + 12, mw - 24, mh - 24, 14); ctx.clip();
    if (m) {
      cover(ctx, m.img, mx + 12, my + 12, mw - 24, mh - 24);
      const sx = (mw - 24) / m.vb[2], sy = (mh - 24) / m.vb[3], s = Math.max(sx, sy), ox = mx + 12 + ((mw - 24) - m.vb[2] * s) / 2, oy = my + 12 + ((mh - 24) - m.vb[3] * s) / 2;
      m.pts.forEach((p, i) => { if (p) badge(ctx, ox + (p[0] - m.vb[0]) * s, oy + (p[1] - m.vb[1]) * s - 20, 30, i + 1); });
    } else { ctx.fillStyle = '#e9dcbc'; ctx.fillRect(mx, my, mw, mh); }
    ctx.restore(); tape(ctx, W / 2, my, 180, -0.04);
    y = my + mh + 60;
    ctx.fillStyle = INK; ctx.font = `34px ${HAND}`; ctx.fillText(k.picks, 90, y); y += 18;
    d.picks.forEach((p, i) => { y += 70; badge(ctx, 116, y - 12, 24, i + 1); ctx.fillStyle = INK; ctx.font = `40px ${DISPLAY}`; ctx.fillText(p.name, 160, y); ctx.font = `600 22px ${BODY}`; ctx.fillStyle = SOFT; ctx.textAlign = 'right'; ctx.fillText([p.price, p.walk].filter(Boolean).join(' · '), W - 90, y); ctx.textAlign = 'left'; });
    footer(ctx, d, k, H - 240);
  }
  async function drawPolaroid(ctx, d, k) {
    paper(ctx, '#d9c9a3');
    const first = d.picks[0] || {}, photo = await loadImg(PHOTO_OF[first.id]), m = photo ? null : await mapImage(d.picks.slice(0, 1));
    ctx.save(); ctx.translate(W / 2, 520); ctx.rotate(-0.035);
    const pw = 820, ph = 760; ctx.fillStyle = 'rgba(59,42,26,.25)'; ctx.fillRect(-pw / 2 + 12, -ph / 2 + 16, pw, ph);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.fillRect(-pw / 2, -ph / 2, pw, ph); ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
    const ix = -pw / 2 + 34, iy = -ph / 2 + 34, iw = pw - 68, ih = 520;
    if (photo) cover(ctx, photo, ix, iy, iw, ih); else if (m) cover(ctx, m.img, ix, iy, iw, ih); else { ctx.fillStyle = '#e9dcbc'; ctx.fillRect(ix, iy, iw, ih); }
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(ix, iy, iw, ih);
    ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.font = `54px ${DISPLAY}`; textBlock(ctx, `${d.stamp} ${d.title}`, ix, iy + ih + 80, iw, 60, 2);
    ctx.restore(); tape(ctx, W / 2 - 250, 150, 200, -0.3); tape(ctx, W / 2 + 270, 160, 200, 0.35);
    ctx.textAlign = 'left'; ctx.fillStyle = INK; ctx.font = `30px ${HAND}`; ctx.fillText((d.kicker || k.kicker), 110, 70);
    let y = 955;
    d.picks.forEach((p, i) => { ctx.font = `36px ${DISPLAY}`; ctx.fillStyle = INK; ctx.fillText(`${['①', '②', '③'][i]} ${p.name}`, 110, y); ctx.font = `600 22px ${BODY}`; ctx.fillStyle = SOFT; ctx.textAlign = 'right'; ctx.fillText(p.price, W - 110, y); ctx.textAlign = 'left'; y += 44; });
    footer(ctx, d, k, H - 240);
  }
  async function drawTicket(ctx, d, k) {
    paper(ctx, '#2f4f5a');
    const x = 70, y = 110, w = W - 140, h = 1120, stub = 300;
    card(ctx, x, y, w, h, PANEL, 30);
    ctx.save(); ctx.setLineDash([16, 14]); ctx.strokeStyle = SOFT; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 30, y + h - stub); ctx.lineTo(x + w - 30, y + h - stub); ctx.stroke(); ctx.restore();
    ['#2f4f5a'].forEach(c => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y + h - stub, 34, 0, Math.PI * 2); ctx.arc(x + w, y + h - stub, 34, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = CORAL; rr(ctx, x, y, w, 130, 30); ctx.fill(); ctx.fillRect(x, y + 60, w, 70);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.font = `30px ${HAND}`; ctx.fillText('LIVERPOOL STUDENT MAP · ' + (d.kicker || k.kicker), x + 50, y + 80);
    ctx.fillStyle = SOFT; ctx.font = `600 24px ${BODY}`; ctx.fillText(k.from.toUpperCase(), x + 50, y + 200); ctx.fillText(k.to.toUpperCase(), x + w / 2 + 40, y + 200);
    ctx.fillStyle = INK; ctx.font = `64px ${DISPLAY}`; ctx.fillText('LIME ST', x + 50, y + 270); ctx.fillText(d.picks[0] ? `No.${d.picks[0].n}` : k.home, x + w / 2 + 40, y + 270);
    ctx.font = `40px ${HAND}`; ctx.fillStyle = CORAL; ctx.fillText('— — ✈ — —', x + w / 2 - 110, y + 262);
    ctx.fillStyle = SOFT; ctx.font = `600 24px ${BODY}`; ctx.fillText(k.passenger.toUpperCase(), x + 50, y + 350);
    ctx.fillStyle = INK; ctx.font = `52px ${DISPLAY}`; let yy = textBlock(ctx, `${d.stamp} ${d.title}`, x + 50, y + 415, w - 100, 60, 2);
    ctx.font = `26px ${BODY}`; ctx.fillStyle = SOFT; yy = textBlock(ctx, d.desc, x + 50, yy + 10, w - 100, 38, 3);
    ctx.fillStyle = SOFT; ctx.font = `600 24px ${BODY}`; ctx.fillText(k.stops.toUpperCase(), x + 50, yy + 40);
    yy += 60;
    d.picks.forEach((p, i) => { yy += 58; ctx.fillStyle = i ? MERSEY : CORAL; ctx.beginPath(); ctx.arc(x + 70, yy - 12, 14, 0, Math.PI * 2); ctx.fill(); if (i < d.picks.length - 1) { ctx.fillRect(x + 66, yy, 8, 44); }
      ctx.fillStyle = INK; ctx.font = `38px ${DISPLAY}`; ctx.fillText(p.name, x + 110, yy); ctx.font = `600 22px ${BODY}`; ctx.fillStyle = SOFT; ctx.textAlign = 'right'; ctx.fillText(p.price, x + w - 50, yy); ctx.textAlign = 'left'; });
    const size = 200, qx = x + w - 50 - size, qy = y + h - stub + 50; qr(ctx, d.link || shareUrl(), qx, qy, size);
    ctx.fillStyle = INK; ctx.font = `44px ${DISPLAY}`; textBlock(ctx, d.scan || k.scan, x + 50, qy + 60, qx - x - 100, 54, 2);
    ctx.fillStyle = SOFT; ctx.font = `600 24px ${BODY}`; ctx.fillText(`${k.boarding} 2027 · ${k.ref} ${refCode()}`, x + 50, qy + 190);
    ctx.fillStyle = '#c9d6d9'; ctx.font = `22px ${BODY}`; ctx.fillText(k.footer, x, H - 26);
  }
  async function drawNotes(ctx, d, k) {
    paper(ctx, '#e9dcbc');
    ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.font = `30px ${HAND}`; ctx.fillText((d.kicker || k.kicker), 90, 110);
    ctx.save(); ctx.translate(90, 150); ctx.rotate(-0.02); card(ctx, 0, 0, W - 180, 300, YELLOW, 8);
    ctx.fillStyle = INK; ctx.font = `100px ${DISPLAY}`; ctx.fillText(d.stamp, 40, 130); ctx.font = `62px ${DISPLAY}`; textBlock(ctx, d.title, 170, 110, W - 180 - 210, 72, 2);
    ctx.font = `26px ${BODY}`; ctx.fillStyle = SOFT; textBlock(ctx, d.desc, 40, 230, W - 260, 36, 2); ctx.restore();
    const colors = ['#fbd3c6', '#cfe3a8', '#cde3ea'], rots = [0.03, -0.035, 0.025];
    d.picks.forEach((p, i) => {
      const nx = 90 + i * 310, ny = 520 + (i % 2) * 40;
      ctx.save(); ctx.translate(nx + 140, ny + 160); ctx.rotate(rots[i]); card(ctx, -140, -160, 280, 330, colors[i], 6);
      ctx.fillStyle = CORAL; ctx.beginPath(); ctx.arc(0, -150, 16, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = SOFT; ctx.font = `24px ${HAND}`; ctx.textAlign = 'center'; ctx.fillText(i ? k.also : k.first, 0, -95);
      ctx.fillStyle = INK; ctx.font = `40px ${DISPLAY}`; textBlock(ctx, p.name, 0, -40, 240, 46, 3);
      ctx.font = `700 26px ${BODY}`; ctx.fillStyle = CORAL; ctx.fillText(p.price, 0, 110); ctx.font = `20px ${BODY}`; ctx.fillStyle = SOFT; ctx.fillText(p.n ? `No.${p.n}` : '', 0, 145);
      ctx.restore();
    });
    ctx.textAlign = 'left';
    footer(ctx, d, k, H - 240);
  }
  const STYLES = { map: drawMap, polaroid: drawPolaroid, ticket: drawTicket, notes: drawNotes };


  return { T, W, H, STYLES };
};
