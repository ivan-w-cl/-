/* Liverpool Life Quiz, built into the map page (index.html).
   One page: the quiz and the friend cards appear as paper cards over the map; the finished Life Card sits in the
   map's left panel slot (a bottom sheet on phones), next to the filters, subject tab, compare tray and Home Match.
   Recommended homes come from the map's own Home Match engine, so they light up, open and compare like any home. */
(() => {
  'use strict';
  if (new URL(location.href).searchParams.get('lifeMap') === '1') return;   // the embedded quiz-result map stays as it was
  const M = window.LifeCModel, ART = window.LifeCArt;
  if (!M || !ART) return;
  // UI language is shared with the map; answers and the c1 share encoding never change.
  let language = /^zh/i.test(document.documentElement.lang) ? 'zh' : 'en';
  const UI_ZH = {
    "Liverpool Life Quiz": "利物浦生活测验",
    "Liverpool Student Life": "利物浦留学生活",
    "Find my Liverpool": "寻找我的利物浦",
    "Choose your next step": "选择你的下一步",
    "Two ways to explore student life. Choose a quiz, or head straight to the map.": "两种方式探索留学生活：选一个测验，或直接浏览地图。",
    "Life Quiz": "生活测验",
    "6 everyday choices · about 1 minute": "6 道生活情境题 · 约 1 分钟",
    "Meet your Liverpool character, share your card and compare with friends.": "发现你的利物浦生活角色，分享卡片并与朋友对比。",
    "Take the Life Quiz ↗": "解锁我的生活角色 ↗",
    "Home Match": "选房测验",
    "8 housing questions · your own shortlist": "8 道选房题 · 生成专属候选清单",
    "Explore homes using your campus, daily routine and preferences.": "根据校区、日常习惯和偏好，寻找合适的住宿。",
    "Start Home Match ↗": "探索我的理想住所 ↗",
    "Open my saved Life Card →": "查看已保存的生活卡片 →",
    "Browse the map ↘": "浏览地图 ↘",
    "Back to quiz choices": "返回测验选择",
    "My Life Card": "我的生活卡片",
    "My Liverpool life": "我的利物浦生活",
    "Fold ▾": "收起 ▾",
    "Open ▴": "展开 ▴",
    "Close my card": "关闭我的卡片",
    "Close": "关闭",
    "Share your Liverpool life": "分享你的利物浦生活",
    "Share your card": "分享生活卡片",
    "Share your comparison": "分享对比卡片",
    "Card size": "卡片尺寸",
    "Story · 9:16": "竖版 · 9:16",
    "Square · 1:1": "方形 · 1:1",
    "Background": "背景",
    "On my map": "搭配地图",
    "Just me": "只显示角色",
    "Drawing your card…": "正在绘制卡片…",
    "Press and hold (or right-click) the picture to save it.": "长按图片（或右键点击）即可保存。",
    "Your message": "分享文案",
    "Copy message and link": "复制文案和链接",
    "Share…": "分享…",
    "Save image ↓": "保存图片 ↓",
    "The link carries only your six quiz answers. No name, contact details or budget.": "链接只包含六道题的答案，不含姓名、联系方式或预算。",
    "Preview what a friend sees on this device →": "在本设备预览朋友看到的页面 →",
    "Lifestyle keywords": "生活关键词",
    "Just browse the map ↘": "先浏览地图 ↘",
    "Welcome back,": "欢迎回来，",
    "Open my card →": "打开我的卡片 →",
    "What kind of student life would you": "你会在利物浦",
    "unlock": "解锁",
    "in Liverpool?": "怎样的留学生活？",
    "Make 6 everyday choices to discover your own Liverpool lifestyle character. Your card lands right here on the map, with the homes that suit that life.": "做出 6 个日常选择，发现你的利物浦生活角色。卡片会出现在地图上，带你看看适合这种生活的住宿。",
    "Five of the fifteen characters": "十五种角色中的五种",
    "1 · Imagine": "1 · 想象",
    "A free Friday, a 7pm dinner, a deadline.": "空闲的周五、晚饭时间、临近的截止日期。",
    "2 · Meet": "2 · 相遇",
    "Your character, on this map.": "在地图上认识你的生活角色。",
    "3 · Compare": "3 · 对比",
    "Send it to friends and see who’s who.": "分享给朋友，看看大家有何不同。",
    "Start · about 1 minute ↗": "解锁我的生活角色 ↗",
    "No sign-up, no names, no budget. A playful summary of six choices, not a personality test.": "无需注册，不问姓名或预算。这是六个选择的趣味总结，并非科学性格测试。",
    "Close the questions": "关闭题目",
    "Friend preview on this device. Nothing is sent to anyone.": "本设备上的朋友视角预览，不会发送给任何人。",
    "Your friend’s answers stay hidden until you finish.": "完成测验后才会显示朋友的答案。",
    "Back": "上一步",
    "Show my card": "查看我的卡片",
    "Next": "下一步",
    "Next →": "下一步 →",
    "Show my card →": "查看我的卡片 →",
    "Language": "语言",
    "A friend sent you this": "朋友分享给你的卡片",
    "See the map ↘": "查看地图 ↘",
    "Friend preview: this is what someone sees when they open your link.": "朋友视角预览：这是打开你的链接后看到的页面。",
    "End preview": "结束预览",
    "Your friend is…": "你的朋友是…",
    "What about you?": "那你呢？",
    "Find my type · 6 questions ↗": "发现我的类型 · 6 道题 ↗",
    "Use my saved card to compare": "用已保存的卡片对比",
    "Their answers stay hidden until you finish. Then you’ll see where you’re alike and where you’re not. No sign-up, no names.": "完成测验后，你就能看到彼此的相同与不同之处。无需注册，也不需要姓名。",
    "Same city, two lives": "同一座城，两种生活",
    "Friend preview: “the friend” is the answers you just gave.": "朋友视角预览：“朋友”的卡片来自你刚填写的答案。",
    "Your shared weekend plan": "你们的周末计划",
    "Where you’re alike": "你们的共同点",
    "Where you differ": "你们的不同点",
    "You didn’t pick the same thing once.": "六道题没有一个相同选择。",
    "Identical on all six. Suspicious.": "六道题完全一样，默契满分。",
    "You": "你",
    "Your saved card": "已保存的卡片",
    "Your friend": "你的朋友",
    "Share our comparison ↗": "分享我们的对比 ↗",
    "Back to my card": "返回我的卡片",
    "Friend 1": "朋友 1",
    "Friend 2": "朋友 2",
    "Take the quiz and compare with them ↗": "完成测验，和他们对比 ↗",
    "Your friend’s card": "朋友的卡片",
    "Comparison": "生活对比",
    "Not sure yet": "还不确定",
    "University of Liverpool": "利物浦大学",
    "LJMU · City Campus": "利物浦约翰摩尔大学 · 市中心校区",
    "LJMU · Mount Pleasant": "利物浦约翰摩尔大学 · Mount Pleasant 校区",
    "Liverpool Hope · Hope Park": "利物浦希望大学 · Hope Park 校区",
    "Liverpool Hope · Creative Campus": "利物浦希望大学 · 创意校区",
    "LIPA": "利物浦表演艺术学院（LIPA）",
    "As short as possible": "越近越好",
    "Up to 15 minutes": "步行 15 分钟以内",
    "Further is fine": "远一点也可以",
    "Friend preview: these are the answers you just gave as “the friend”.": "朋友视角预览：这是你刚以“朋友”身份填写的答案。",
    "You’re…": "你是…",
    "Share my card ↗": "分享我的卡片 ↗",
    "Download ↓": "下载 ↓",
    "A day in Liverpool": "在利物浦的一天",
    "Homes that make this life easier": "让这种生活更轻松的住宿",
    "Picked by the cafés, libraries, parks and shops around them, not by price. They’re numbered on the map; tap one to open it. The map’s filters (budget, room type) apply too.": "根据周边咖啡馆、图书馆、公园和商店推荐。点击地图上的编号即可查看；地图上的预算和房型筛选也会生效。",
    "I’ll study at": "我的学校或校区",
    "Walk to class": "步行上课",
    "Finding homes on the map…": "正在地图上寻找住宿…",
    "Compare these side by side": "并排对比这些住宿",
    "Pick my subject building": "选择我的专业教学楼",
    "Prices are past listings from Amber (17 Oct 2026). Walking times are estimates. Asking us about a home is always optional.": "价格来自 Amber 的历史房源（2026 年 10 月 17 日），步行时间为估算。是否咨询住宿完全由你决定。",
    "Preview what a friend sees": "预览朋友看到的页面",
    "Retake the quiz": "重新测验",
    "Home matching isn’t available on this page.": "此页面暂时无法匹配住宿。",
    "These options couldn’t be applied. Try “Not sure yet”.": "无法应用这些选项，请尝试“还不确定”。",
    "Try this first": "优先看看",
    "Also worth a look": "也值得看看",
    "No home fits these options and the map’s filters. Try “Further is fine”, another campus, or reset the filters.": "没有住宿同时符合这些选项和地图筛选。请尝试“远一点也可以”、其他校区，或重置筛选。",
    "✳ Liverpool Life Club": "✳ 利物浦生活俱乐部",
    "Find out which type": "看看朋友们",
    "your friends are": "属于哪种生活类型",
    "My Liverpool, mapped": "我的利物浦生活地图",
    "M Y   L I V E R P O O L   L I F E": "我 的 利 物 浦 生 活",
    "MY LIVERPOOL LIFE": "我的利物浦生活",
    "SAME CITY, TWO LIVES": "同一座城，两种生活",
    "Where we’re alike": "我们的共同点",
    "Where we differ": "我们的不同点",
    "Our Liverpool weekend": "我们的利物浦周末",
    "Your comparison card": "你们的对比卡片",
    "The image couldn’t be drawn on this device, but the link below still works.": "此设备无法绘制图片，但下方链接仍然可用。",
    "This is a friend preview. End the preview to share your own card.": "当前为朋友视角预览。请先结束预览，再分享你自己的卡片。",
    "Copied. Paste it into any chat.": "已复制，可以粘贴到聊天中。",
    "Press and hold, or Ctrl / ⌘ + C, to copy.": "长按，或按 Ctrl / ⌘ + C 复制。",
    "This browser has no share sheet. Copy the message, or save the image.": "此浏览器没有分享菜单，请复制文案或保存图片。",
    "Compare these 3 side by side ↔": "对比这三套 ↔",
    "Compare these 2 side by side ↔": "对比这两套 ↔",
    "Sharing isn’t available here. Copy the message, or save the image.": "此处无法直接分享，请复制文案或保存图片。",
    "Saved to your downloads. If nothing appeared, press and hold (or right-click) the picture to save it.": "已保存到下载文件夹。若未出现，请长按图片（或右键点击）保存。",
    "In WeChat, long-press the picture to save or send to a friend. Or tap “Copy message and link” below.": "微信里请长按上方图片保存或发给朋友；也可以点下方「复制文案和链接」。",
    "In WeChat, long-press the picture above to save it to Photos, then send it to a friend.": "微信里请长按上方图片保存到相册，再发给朋友。"
};
  function tr(value) {
    const source = String(value ?? '');
    if (language !== 'zh') return source;
    const text = source.trim();
    let translated = UI_ZH[text];
    if (translated == null) {
      translated = text
        .replace(/^Question (\d+) of (\d+)$/, '第 $1 题，共 $2 题')
        .replace(/^(\d+) of (\d+)$/, '$1 / $2')
        .replace(/^Compare with your friend, (.+) →$/, '和朋友 $1 对比 →')
        .replace(/^Your card: (.+)$/, '你的卡片：$1');
    }
    return source.slice(0, source.indexOf(text)) + translated + source.slice(source.indexOf(text) + text.length);
  }
  function localizedHTML(markup) {
    if (language !== 'zh') return markup;
    const template = document.createElement('template'); template.innerHTML = markup;
    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
    let node; while ((node = walker.nextNode())) node.nodeValue = tr(node.nodeValue);
    template.content.querySelectorAll('[aria-label], [alt], [title], [placeholder]').forEach(el => {
      ['aria-label', 'alt', 'title', 'placeholder'].forEach(key => { if (el.hasAttribute(key)) el.setAttribute(key, tr(el.getAttribute(key))); });
    });
    return template.innerHTML;
  }
  M.setLanguage?.(language);
  const N = M.questions.length, KEY = 'lsm-life-c-v1', XKEY = 'lsm-life-c-extra-v1', EV_KEY = 'lsm-events-v1';
  const H0 = (window.LLC_HASH || location.hash || '').replace(/^#/, '');
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const base = () => window.LIFE_C_SHARE_BASE || location.href.split('#')[0];
  const HMa = () => window.HomeMatch;
  const narrow = () => isNarrow();
  const $ = id => document.getElementById(id);
  const store = {
    get() { try { return M.decode(localStorage.getItem(KEY)); } catch (_) { return null; } },
    set(a) { try { localStorage.setItem(KEY, M.encode(a)); } catch (_) {} },
    extra() { try { const x = JSON.parse(localStorage.getItem(XKEY) || 'null'); return x && typeof x === 'object' ? x : null; } catch (_) { return null; } },
    setExtra(x) { try { localStorage.setItem(XKEY, JSON.stringify(x)); } catch (_) {} }
  };
  let saved = store.get(), answers = saved ? saved.slice() : Array(N).fill(null), step = 0, view = null;
  let friend = null, pair = null, demo = false, ownBeforeDemo = null, advanceTimer = 0, toastTimer = 0;
  const extra = Object.assign({ campus: '', walk: 'far' }, store.extra() || {});
  const me = () => M.result(answers);

  /* ---------- analytics: window.dataLayer (GTM / GA4) + optional window.LLC_TRACK + a per-device tally ---------- */
  function track(name, props) {
    const ev = Object.assign({ event: 'llc_' + name, flow: 'card', page: 'map' }, props || {});
    try { (window.dataLayer = window.dataLayer || []).push(ev); } catch (_) {}
    try { if (typeof window.LLC_TRACK === 'function') window.LLC_TRACK(ev); } catch (_) {}
    try { const c = JSON.parse(localStorage.getItem(EV_KEY) || '{}'), k = ev.flow + ':' + name; c[k] = (c[k] || 0) + 1; localStorage.setItem(EV_KEY, JSON.stringify(c)); } catch (_) {}
  }

  /* ---------- DOM: overlay, card panel, share sheet, toast, entry buttons ---------- */
  const app = $('app');
  const wrap = document.createElement('div'); wrap.className = 'lc-wrap lc-root'; wrap.hidden = true;
  wrap.innerHTML = localizedHTML('<div class="lc-mc" role="dialog" aria-modal="true" aria-label="Liverpool Life Quiz"></div>');
  const mc = wrap.firstChild;
  const panel = document.createElement('section'); panel.className = 'lc-panel lc-root'; panel.id = 'lcPanel'; panel.hidden = true; panel.setAttribute('aria-label', tr('My Life Card'));
  panel.innerHTML = localizedHTML('<header class="lc-ph"><span class="lc-ph-title" id="lcPhTitle">My Liverpool life</span><button type="button" data-lc="fold" id="lcFold">Fold ▾</button><button type="button" data-lc="close-card" aria-label="Close my card">×</button></header><div class="lc-pbody" id="lcBody"></div>');
  app.appendChild(panel); document.body.appendChild(wrap);
  const sheet = document.createElement('dialog'); sheet.className = 'lc-sheet lc-root'; sheet.setAttribute('aria-labelledby', 'lcShareTitle');
  sheet.innerHTML = `<button class="lc-close" data-lc="close-share" aria-label="Close">×</button><span class="lc-stamp">Share your Liverpool life</span><h2 id="lcShareTitle">Share your card</h2>
    <div class="lc-segs"><div class="lc-seg" role="group" aria-label="Card size"><button type="button" data-format="story" aria-pressed="true">Story · 9:16</button><button type="button" data-format="square" aria-pressed="false">Square · 1:1</button></div>
      <div class="lc-seg" id="lcBgSeg" role="group" aria-label="Background"><button type="button" data-bg="map" aria-pressed="true">On my map</button><button type="button" data-bg="plain" aria-pressed="false">Just me</button></div></div>
    <div class="lc-preview"><img id="lcShareImg" alt="Drawing your card…"></div><p class="lc-save-hint">Press and hold (or right-click) the picture to save it.</p>
    <label for="lcShareText">Your message</label><textarea id="lcShareText" readonly></textarea>
    <div class="lc-sheet-actions"><button class="lc-btn lc-btn-main" data-lc="copy">Copy message and link</button><button class="lc-btn" data-lc="native-share">Share…</button><button class="lc-btn" data-lc="download-card">Save image ↓</button></div>
    <p id="lcShareStatus" class="lc-status" role="status"></p><p class="lc-fine">The link carries only your six quiz answers. No name, contact details or budget.</p>
    <div class="lc-extra" id="lcDemoFriend"><button class="lc-link" data-lc="demo">Preview what a friend sees on this device →</button></div>`;
  const SHARE_TEMPLATE = sheet.innerHTML;
  sheet.innerHTML = localizedHTML(languageControls() + SHARE_TEMPLATE);
  document.body.appendChild(sheet);
  const toastEl = document.createElement('div'); toastEl.className = 'lc-toast lc-root'; toastEl.hidden = true; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
  function toast(m) { toastEl.textContent = m; toastEl.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastEl.hidden = true; }, 4200); }
  const entryLabel = () => '✳ ' + tr('Find my Liverpool');
  function addEntryButtons() {
    const mk = cls => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.dataset.lc = 'entry'; b.textContent = entryLabel(); return b; };
    const bar = document.querySelector('.brandbar'); if (bar) bar.insertBefore(mk('lc-go'), bar.querySelector('h1') ? bar.querySelector('h1').nextSibling : bar.firstChild);
    const mbar = document.querySelector('.mbar'); if (mbar) mbar.insertBefore(mk('lc-go2'), mbar.firstChild);
  }
  const syncEntry = () => document.querySelectorAll('[data-lc="entry"]').forEach(b => { b.textContent = narrow() && b.classList.contains('lc-go2') ? (language === 'zh' ? '✳ 测验与选房' : '✳ Quiz & homes') : entryLabel(); });
  addEntryButtons(); syncEntry();

  /* ---------- overlay cards ---------- */
  const squiggle = '<svg class="lc-squiggle" viewBox="0 0 220 14" aria-hidden="true"><path d="M3 9c18-8 30 6 48-1s28-7 46 0 30 6 48-1 30-6 46 1 20 4 26 0" fill="none" stroke="#b5462f" stroke-width="3" stroke-linecap="round"/></svg>';
  const polaroid = p => `<div class="lc-polaroid" style="--life:${p.color}">${ART.character(p.life, p.food)}</div>`;
  const kw = p => `<ul class="lc-kw" aria-label="Lifestyle keywords">${p.keywords.map((k, i) => `<li style="--k:${['#f6dfa0', '#d7e8c4', '#f3cfc4'][i]}">${esc(k)}</li>`).join('')}</ul>`;
  function languageControls(showBack = false) {
    return `<div class="lc-language-tools">${showBack ? '<button class="lc-link" data-lc="choose">Back to quiz choices</button>' : '<span></span>'}<div class="lc-seg lc-language" role="group" aria-label="Language"><button type="button" data-lc-lang="en" lang="en" aria-pressed="${language === 'en'}">EN</button><button type="button" data-lc-lang="zh" lang="zh-Hans" aria-pressed="${language === 'zh'}">中文</button></div></div>`;
  }
  function chooserCard() {
    return `<div class="lc-top"><span class="lc-stamp">Liverpool Student Life</span><button class="lc-ghost" data-lc="close-overlay">Browse the map ↘</button></div>
      <h1 class="lc-title" tabindex="-1">Find my Liverpool</h1>${squiggle}
      <p class="lc-lede">Two ways to explore student life. Choose a quiz, or head straight to the map.</p>
      <div class="lc-choice-grid">
        <section class="lc-choice"><span class="lc-choice-icon" aria-hidden="true">✳</span><h2>Life Quiz</h2><p class="lc-kicker">6 everyday choices · about 1 minute</p><p>Meet your Liverpool character, share your card and compare with friends.</p><button class="lc-btn lc-btn-main" data-lc="life-choice">Take the Life Quiz ↗</button>${saved && M.result(saved) ? '<button class="lc-link" data-lc="open-card">Open my saved Life Card →</button>' : ''}</section>
        <section class="lc-choice"><span class="lc-choice-icon" aria-hidden="true">🏠</span><h2>Home Match</h2><p class="lc-kicker">8 housing questions · your own shortlist</p><p>Explore homes using your campus, daily routine and preferences.</p><button class="lc-btn lc-btn-main" data-lc="home-choice">Start Home Match ↗</button></section>
      </div>`;
  }
  function openChooser() {
    clearTimeout(advanceTimer);
    if (sheet.open) sheet.close();
    endDemo(false); closeCard(); HMa()?.exit();
    openOverlay('chooser');
  }
  function introCard() {
    const back = saved && M.result(saved), foods = M.lifeOrder.map(() => ['cook', 'out', 'takeaway'][Math.floor(Math.random() * 3)]);
    return `<div class="lc-top"><span class="lc-stamp">Liverpool Life Quiz</span><button class="lc-ghost" data-lc="close-overlay">Just browse the map ↘</button></div>
      ${back ? `<p class="lc-back"><span>Welcome back, <b>${esc(back.name)}</b>.</span><button class="lc-link" data-lc="open-card">Open my card →</button></p>` : ''}
      <div class="lc-left"><h1 class="lc-title" tabindex="-1">What kind of student life would you <em>unlock</em> in Liverpool?</h1>${squiggle}</div>
      <p class="lc-lede">Make 6 everyday choices to discover your own Liverpool lifestyle character. Your card lands right here on the map, with the homes that suit that life.</p>
      <div class="lc-cast" aria-label="Five of the fifteen characters">${M.lifeOrder.map((l, i) => `<figure style="--life:${M.life[l].color}">${ART.character(l, foods[i])}<figcaption>${esc(M.life[l].word)}</figcaption></figure>`).join('')}</div>
      <ol class="lc-steps"><li><b>1 · Imagine</b>A free Friday, a 7pm dinner, a deadline.</li><li><b>2 · Meet</b>Your character, on this map.</li><li><b>3 · Compare</b>Send it to friends and see who’s who.</li></ol>
      <div class="lc-btns"><button class="lc-btn lc-btn-main" data-lc="start">Start · about 1 minute ↗</button></div>
      <p class="lc-fine">No sign-up, no names, no budget. A playful summary of six choices, not a personality test.</p>`;
  }
  function quizCard() {
    const q = M.questions[step], cur = answers[step];
    return `<div class="lc-q-top"><span class="lc-dots" aria-hidden="true">${M.questions.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</span><span class="lc-q-step">${step + 1} of ${N}</span><button class="lc-ghost" data-lc="leave-quiz" aria-label="Close the questions">×</button></div>
      ${demo ? '<p class="lc-banner">Friend preview on this device. Nothing is sent to anyone.</p>' : ''}${friend && !demo ? '<p class="lc-banner">Your friend’s answers stay hidden until you finish.</p>' : ''}
      <h1 class="lc-q" tabindex="-1">${esc(q.title)}</h1>
      <div class="lc-opts" role="group" aria-label="${esc(q.title)}">${q.options.map((o, i) => `<button class="lc-opt" data-answer="${i}" aria-pressed="${cur === i}"><span class="e" aria-hidden="true">${o.icon}</span><b>${esc(o.label)}</b><small>${esc(o.detail)}</small></button>`).join('')}</div>
      <div class="lc-q-foot"><button class="lc-btn" data-lc="back">Back</button><button class="lc-btn lc-btn-main" style="flex:0 1 auto" data-lc="next" ${cur == null ? 'disabled' : ''}>${step === N - 1 ? 'Show my card' : 'Next'} →</button></div>`;
  }
  function inviteCard() {
    const f = M.result(friend);
    return `<div class="lc-top"><span class="lc-stamp">A friend sent you this</span><button class="lc-ghost" data-lc="close-overlay">See the map ↘</button></div>
      ${demo ? '<p class="lc-banner">Friend preview: this is what someone sees when they open your link. <button data-lc="end-demo">End preview</button></p>' : ''}
      <div class="lc-big">${polaroid(f)}<p class="lc-kicker">Your friend is…</p><h1 class="lc-name" tabindex="-1"><span class="lc-ico" aria-hidden="true">${f.icons}</span> ${esc(f.name)}</h1>${squiggle}</div>
      <div class="lc-center"><p class="lc-line">“${esc(f.quote)}”</p></div><div class="lc-center">${kw(f)}</div>
      <p class="lc-ask">What about you?</p>
      <div class="lc-btns"><button class="lc-btn lc-btn-main lc-btn-wide" data-lc="start">Find my type · 6 questions ↗</button></div>
      ${saved && !demo ? '<button class="lc-btn lc-btn-wide" data-lc="use-saved">Use my saved card to compare</button>' : ''}
      <p class="lc-fine">Their answers stay hidden until you finish. Then you’ll see where you’re alike and where you’re not. No sign-up, no names.</p>`;
  }
  function compareCard(a, b, labels, actions) {
    const A = M.result(a), B = M.result(b), c = M.compare(a, b);
    const list = (rows, empty) => `<ul>${(rows.length ? rows.slice(0, 3) : [empty]).map(r => `<li>${esc(r)}</li>`).join('')}</ul>`;
    return `<div class="lc-top"><span class="lc-stamp">Same city, two lives</span><button class="lc-ghost" data-lc="close-overlay">Close</button></div>
      ${demo ? '<p class="lc-banner">Friend preview: “the friend” is the answers you just gave. <button data-lc="end-demo">End preview</button></p>' : ''}
      <h1 class="lc-title" tabindex="-1" style="text-align:center;font-size:30px">${esc(A.name)} × ${esc(B.name)}</h1>
      <div class="lc-duo"><figure>${polaroid(A)}<figcaption><small>${labels[0]}</small>${esc(A.name)}</figcaption></figure><span class="lc-x" aria-hidden="true">×</span><figure>${polaroid(B)}<figcaption><small>${labels[1]}</small>${esc(B.name)}</figcaption></figure></div>
      <div class="lc-plan"><h2>Your shared weekend plan</h2><p>${esc(c.plan)}</p></div>
      <div class="lc-lists"><section><h3>Where you’re alike</h3>${list(c.same, c.none || 'You didn’t pick the same thing once.')}</section><section><h3>Where you differ</h3>${list(c.different, 'Identical on all six. Suspicious.')}</section></div>
      <div class="lc-btns">${actions}</div>`;
  }
  const OVERLAYS = {
    chooser: chooserCard, intro: introCard, quiz: quizCard, invite: inviteCard,
    compare: () => compareCard(answers, friend, ['You', demo ? 'Your saved card' : 'Your friend'], '<button class="lc-btn lc-btn-main" data-lc="share-pair">Share our comparison ↗</button><button class="lc-btn" data-lc="close-overlay">Back to my card</button>'),
    pairview: () => compareCard(pair[0], pair[1], ['Friend 1', 'Friend 2'], '<button class="lc-btn lc-btn-main" data-lc="join-pair">Take the quiz and compare with them ↗</button>')
  };
  function openOverlay(v) {
    if ((v === 'invite' || v === 'compare') && !friend) v = 'intro';
    if (v === 'pairview' && !pair) v = 'intro';
    view = v; hide(); closeSheets(); welcome.hidden = true;
    try { if (!$('hmWrap').hidden) $('hmX').click(); } catch (_) {}
    wrap.classList.toggle('is-wide', v === 'compare' || v === 'pairview' || v === 'chooser');
    mc.innerHTML = localizedHTML('<span class="lc-tape" aria-hidden="true"></span>' + languageControls(v !== 'chooser') + OVERLAYS[v]());
    mc.setAttribute('aria-label', tr({ chooser: 'Choose your next step', intro: 'Liverpool Life Quiz', quiz: `Question ${step + 1} of ${N}`, invite: 'Your friend’s card', compare: 'Comparison', pairview: 'Comparison' }[v]));
    wrap.hidden = false; mc.scrollTop = 0;
    mc.querySelector('h1')?.focus({ preventScroll: true });
  }
  function closeOverlay() {
    const was = view; view = null; wrap.hidden = true;
    if (was === 'compare' && me()) openCard();
  }

  /* ---------- the Life Card panel on the map ---------- */
  const CAMPUSES = [['', 'Not sure yet'], ['uol', 'University of Liverpool'], ['ljmu-city', 'LJMU · City Campus'], ['ljmu-mp', 'LJMU · Mount Pleasant'], ['hope-park', 'Liverpool Hope · Hope Park'], ['hope-creative', 'Liverpool Hope · Creative Campus'], ['lipa', 'LIPA']];
  const WALKS = [['close', 'As short as possible'], ['mid', 'Up to 15 minutes'], ['far', 'Further is fine']];
  const mapAnswers = () => M.toMapAnswers(answers, { campus: extra.campus || 'unsure', walk: extra.walk });
  let selectedHome = null;
  function cardHTML() {
    const p = me(), f = friend && !demo && M.result(friend);
    return `${demo ? '<p class="lc-banner">Friend preview: these are the answers you just gave as “the friend”. <button data-lc="end-demo">End preview</button></p>' : ''}
      <div class="lc-hero">${polaroid(p)}<div class="lc-who lc-left"><p class="lc-kicker">You’re…</p><h1 class="lc-name" id="lcName" tabindex="-1"><span class="lc-ico" aria-hidden="true">${p.icons}</span> ${esc(p.name)}</h1>${squiggle}</div></div>
      <p class="lc-line">“${esc(p.quote)}”</p>${kw(p)}
      <div class="lc-btns"><button class="lc-btn lc-btn-main" data-lc="share">Share my card ↗</button><button class="lc-btn" data-lc="download">Download ↓</button></div>
      ${f ? `<button class="lc-btn lc-btn-wide lc-btn-sun" data-lc="compare">Compare with your friend, ${esc(f.name)} →</button>` : ''}
      <details class="lc-day"><summary>A day in Liverpool</summary><ol>${p.day.map(([t, title, d]) => `<li><b>${esc(t)}</b>${esc(title)}. <small>${esc(d)}</small></li>`).join('')}</ol></details>
      <section class="lc-homes" aria-labelledby="lcHomesH"><h2 id="lcHomesH">Homes that make this life easier</h2>
        <p class="lc-sub">Picked by the cafés, libraries, parks and shops around them, not by price. They’re numbered on the map; tap one to open it. The map’s filters (budget, room type) apply too.</p>
        <div class="lc-refine"><label>I’ll study at<select data-lc-bind="campus">${CAMPUSES.map(([v, l]) => `<option value="${v}" ${extra.campus === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>
          <label>Walk to class<select data-lc-bind="walk">${WALKS.map(([v, l]) => `<option value="${v}" ${extra.walk === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label></div>
        <ol class="lc-home-list" id="lcHomeList"><li class="lc-wait">Finding homes on the map…</li></ol>
        <button class="lc-btn lc-btn-wide lc-btn-sun" data-lc="compare-homes" hidden>Compare these 3 side by side ↔</button>
        <div class="lc-tools"><button class="lc-link" data-lc="subject">Pick my subject building</button></div>
        <p class="lc-fine">Prices are past listings from Amber (17 Oct 2026). Walking times are estimates. Asking us about a home is always optional.</p></section>
      <footer class="lc-foot">${!demo ? '<button class="lc-link" data-lc="demo">Preview what a friend sees</button>' : ''}<button class="lc-link" data-lc="start">Retake the quiz</button></footer>`;
  }
  function setMini(on) {
    panel.classList.toggle('is-mini', on); document.body.classList.toggle('lc-mini', on);
    const p = me(); $('lcPhTitle').innerHTML = on && p ? `<span aria-hidden="true">${p.icons}</span> ${esc(p.name)}` : tr('My Liverpool life');
    $('lcFold').textContent = tr(on ? 'Open ▴' : 'Fold ▾');
    setTimeout(fitHomes, 60);
  }
  function openCard() {
    if (!me()) { openOverlay('intro'); return; }
    view = null; wrap.hidden = true;
    try { if (!$('hmWrap').hidden) $('hmX').click(); } catch (_) {}
    $('lcBody').innerHTML = localizedHTML(cardHTML()); $('lcBody').scrollTop = 0;
    panel.hidden = false; document.body.classList.add('lc-on'); setMini(false);
    hide(); closeSheets(); welcome.hidden = true;
    applyHomes();
    panel.querySelector('#lcName')?.focus({ preventScroll: true });
  }
  function closeCard() {
    if (panel.hidden) return;
    panel.hidden = true; document.body.classList.remove('lc-on', 'lc-mini', 'lc-away');
    delete window.LifeMapViewport;
    try { const hm = HMa(); if (hm && hm.isActive()) hm.exit(); } catch (_) {}
    render(true);
  }
  function applyHomes() {
    const hm = HMa(); if (!hm) { $('lcHomeList').innerHTML = localizedHTML('<li class="lc-wait">Home matching isn’t available on this page.</li>'); return; }
    const ok = hm.applyAnswers(mapAnswers());
    if (ok === false) { $('lcHomeList').innerHTML = localizedHTML('<li class="lc-wait">These options couldn’t be applied. Try “Not sure yet”.</li>'); return; }
    selectedHome = null; listHomes(); setTimeout(fitHomes, 30);
  }
  function listHomes() {
    const list = $('lcHomeList'), hm = HMa(); if (!list || !hm) return;
    const picks = hm.getSnapshot().picks.slice(0, 3);
    list.innerHTML = localizedHTML(picks.length ? picks.map((h, i) => `<li><button class="lc-home" data-home="${esc(h.id)}" aria-current="${selectedHome === h.id}"><span class="lc-num">${esc(h.n)}</span><span class="lc-home-txt"><small>${i === 0 ? 'Try this first' : 'Also worth a look'}</small><b>${esc(h.name)}</b><em>${esc(h.reasons[1] || h.reasons[0] || '')}</em></span><span aria-hidden="true">↗</span></button></li>`).join('')
      : '<li class="lc-wait">No home fits these options and the map’s filters. Try “Further is fine”, another campus, or reset the filters.</li>');
    const cmp = panel.querySelector('[data-lc="compare-homes"]'); if (cmp) { cmp.hidden = picks.length < 2; cmp.textContent = tr(picks.length === 3 ? 'Compare these 3 side by side ↔' : 'Compare these 2 side by side ↔'); }
  }
  // the part of the map not covered by the card, the filters or the button bar
  function freeArea() {
    const mb = mapbox.getBoundingClientRect(), w = viewW, h = viewH, pr = panel.getBoundingClientRect(), docked = panel.classList.contains('pd-docked'), open = !panel.hidden && !docked && !panel.classList.contains('is-mini');
    if (narrow()) {
      const bottom = panel.hidden || docked || pr.top - mb.top < 220 ? h - 70 : pr.top - mb.top - 10;
      return { left: 44, right: w - 12, top: 64, bottom: Math.max(150, bottom) };
    }
    const ctl = $('controls'), cr = ctl.getBoundingClientRect(), ctlOpen = !ctl.classList.contains('collapsed') && cr.width > 0;
    // a card dragged away from the left slot no longer blocks the left of the map
    const left = open && pr.left - mb.left < 120 ? pr.right - mb.left + 20 : 70;
    const right = ctlOpen ? Math.max(left + 220, cr.left - mb.left - 16) : w - 70;
    return { left, right, top: 84, bottom: h - 20 };
  }
  function fitPointsTo(pts, minZoom) {
    if (!pts.length) return;
    const r = freeArea();
    if (!panel.hidden) window.LifeMapViewport = { left: r.left - 30, right: r.right + 30, top: r.top - 20, bottom: r.bottom + 10 };
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    let zz = Math.min((r.right - r.left) / ((x1 - x0 + 90) * fitK), (r.bottom - r.top) / ((y1 - y0 + 90) * fitK));
    zz = Math.max(1, Math.min(zmax(), zz)); if (minZoom) zz = Math.max(zz, Math.min(zmax(), minZoom));
    z = zz; tx = (r.left + r.right) / 2 - (x0 + x1) / 2 * fitK * z; ty = (r.top + r.bottom) / 2 - (y0 + y1) / 2 * fitK * z;
    render(true);
  }
  function pickPoints(ids) {
    const pts = [];
    HOMES.filter(h => ids.includes(h.id)).forEach(h => { pts.push(h.p, h.a); });
    try { const bb = $('hmLayer').getBBox(); if (bb.width) pts.push([bb.x, bb.y], [bb.x + bb.width, bb.y + bb.height]); } catch (_) {}
    return pts;
  }
  function fitHomes() {
    if (panel.hidden) return;
    const hm = HMa(); if (!hm) return;
    const ids = selectedHome ? [selectedHome] : hm.getSnapshot().picks.map(p => p.id);
    fitPointsTo(pickPoints(ids), selectedHome ? 1.15 / fitK : 0);
  }
  function openHome(id) {
    const hm = HMa(); if (!hm) return;
    selectedHome = id; hm.selectHome(id); listHomes(); track('home_opened', { home: id });
    if (narrow()) document.body.classList.add('lc-away');
    setTimeout(() => { fitHomes(); }, 30);
  }
  // keep the card list in step when the map's filters or subject change Home Match's picks
  const hmBody = $('hmResBody'); if (hmBody) new MutationObserver(() => { if (!panel.hidden) listHomes(); }).observe(hmBody, { childList: true });
  // on phones, a home's own card replaces the Life Card sheet until it is closed
  const homeCard = $('card'); if (homeCard) new MutationObserver(() => { if (homeCard.hidden) document.body.classList.remove('lc-away'); else if (narrow() && !panel.hidden) document.body.classList.add('lc-away'); }).observe(homeCard, { attributes: true, attributeFilter: ['hidden'] });

  /* ---------- quiz flow ---------- */
  function start() { answers = Array(N).fill(null); step = 0; track('quiz_started', { via: friend ? 'invite' : pair ? 'comparison_link' : 'direct' }); openOverlay('quiz'); }
  function finish() {
    if (!me()) return;
    if (!demo) { saved = answers.slice(); store.set(answers); track('quiz_completed', { character: me().id, via: friend ? 'invite' : 'direct' }); }
    syncEntry(); openCard();
  }
  function endDemo(reopen) { if (!demo) return; demo = false; friend = null; if (ownBeforeDemo) answers = ownBeforeDemo; ownBeforeDemo = null; if (reopen) openCard(); }

  /* ---------- hand-drawn share images (canvas) ---------- */
  const INK = '#3b2a1a', SOFT = '#6e5538', CORAL = '#b5462f', PAPER = '#fffaf0', DESK = '#f1e4c3';
  const HAND = '"Patrick Hand", "Noto Sans SC", "Microsoft YaHei", sans-serif', DISPLAY = '"Gochi Hand", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  async function fontsReady() { try { await Promise.all(['40px "Gochi Hand"', '40px "Patrick Hand"'].map(f => document.fonts.load(f))); } catch (_) {} }
  async function svgImage(svg) {
    if (!/\bxmlns=/.test(svg)) svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    try { const img = new Image(); await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = url; }); return img; } finally { URL.revokeObjectURL(url); }
  }
  // a crop of the illustrated map around the picked homes, styles inlined so it draws as a picture
  const STYLE_PROPS = ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'opacity', 'fill-opacity', 'stroke-opacity', 'paint-order', 'font-size', 'font-weight', 'font-style', 'text-anchor', 'letter-spacing', 'visibility', 'display', 'transform', 'transform-box', 'transform-origin'];
  function copyStyled(src) {
    const tag = (src.localName || '').toLowerCase(); if (['script', 'foreignobject', 'image'].includes(tag) || src.id === 'movers') return null;
    const clone = src.cloneNode(false), st = getComputedStyle(src);
    for (const p of STYLE_PROPS) { let v = st.getPropertyValue(p); v = v.replace(/url\(["']?[^)"']*#([^)'"\s]+)["']?\)/g, 'url(#$1)'); if (v) clone.style.setProperty(p, v); }
    clone.style.setProperty('font-family', '"Segoe Print", "Comic Sans MS", sans-serif'); clone.style.setProperty('animation', 'none'); clone.style.setProperty('transition', 'none');
    if (src.classList && (src.classList.contains('drop') || src.classList.contains('in') || src.classList.contains('badge'))) { clone.style.setProperty('transform', 'none'); clone.style.setProperty('opacity', '1'); }
    if (src.classList && src.classList.contains('map-label-muted')) clone.style.setProperty('visibility', 'visible');
    for (const a of [...(clone.attributes || [])]) { if (a.name.startsWith('on') || ['tabindex', 'role', 'aria-label', 'aria-hidden'].includes(a.name)) clone.removeAttribute(a.name); if ((a.name === 'href' || a.name === 'xlink:href') && !a.value.startsWith('#')) clone.removeAttribute(a.name); }
    for (const ch of src.childNodes) { if (ch.nodeType === 1) { const c = copyStyled(ch); if (c) clone.appendChild(c); } else if (ch.nodeType === 3) clone.appendChild(ch.cloneNode(false)); }
    return clone;
  }
  function exportMapSVG() {
    const hm = HMa(); const ids = hm ? hm.getSnapshot().picks.map(p => p.id) : [];
    const pts = pickPoints(ids); if (!pts.length) return null;
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    let w = Math.max(700, Math.max(...xs) - Math.min(...xs) + 240), h = Math.max(600, Math.max(...ys) - Math.min(...ys) + 240); const asp = 1140 / 970;
    if (w / h < asp) w = h * asp; else h = w / asp;
    const b = { x: Math.max(0, Math.min(OUTW - w, cx - w / 2)), y: Math.max(0, Math.min(OUTH - h, cy - h / 2)), w, h };
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); svgEl.setAttribute('width', '1140'); svgEl.setAttribute('height', '970'); svgEl.setAttribute('viewBox', `${b.x} ${b.y} ${b.w} ${b.h}`);
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); bg.setAttribute('x', b.x); bg.setAttribute('y', b.y); bg.setAttribute('width', b.w); bg.setAttribute('height', b.h); bg.setAttribute('fill', '#f1e4c3'); svgEl.appendChild(bg);
    for (const s of [$('base'), $('over')]) for (const ch of s.children) { const c = copyStyled(ch); if (c) svgEl.appendChild(c); }
    return { svg: new XMLSerializer().serializeToString(svgEl), width: 1140, height: 970 };
  }
  function wobble(ctx, x, y, w, h, j = 3) {
    const pts = [], st = 40;
    for (let t = 0; t < w; t += st) pts.push([x + t, y + (rnd() - .5) * j]);
    for (let t = 0; t < h; t += st) pts.push([x + w + (rnd() - .5) * j, y + t]);
    for (let t = w; t > 0; t -= st) pts.push([x + t, y + h + (rnd() - .5) * j]);
    for (let t = h; t > 0; t -= st) pts.push([x + (rnd() - .5) * j, y + t]);
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath();
  }
  function paperSheet(ctx, x, y, w, h) { ctx.save(); ctx.fillStyle = 'rgba(59,42,26,.28)'; wobble(ctx, x + 12, y + 14, w, h); ctx.fill(); ctx.restore(); ctx.fillStyle = PAPER; wobble(ctx, x, y, w, h); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke(); }
  function tape(ctx, cx, cy, w, h, rot) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.fillStyle = 'rgba(242,193,78,.78)'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeStyle = 'rgba(122,90,18,.35)'; ctx.lineWidth = 2; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.restore(); }
  function wrapText(ctx, text, x, y, maxW, lh, align = 'center', maxLines = 4) {
    const cjk = /[\u3400-\u9fff]/.test(String(text));
    const words = cjk ? Array.from(String(text)) : String(text).split(' '); let line = '', lines = [];
    for (const w of words) { const t = line ? line + (cjk ? '' : ' ') + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
    if (line) lines.push(line); lines = lines.slice(0, maxLines);
    ctx.textAlign = align; lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh)); return y + lines.length * lh;
  }
  function pills(ctx, words, cx, y, maxW, size) {
    ctx.font = `${size}px ${HAND}`; const pad = size * .55, gap = size * .4, hgt = size * 1.5, cols = ['#f6dfa0', '#d7e8c4', '#f3cfc4'];
    const rows = [[]]; let w = 0;
    words.forEach((t, i) => { const pw = ctx.measureText(t).width + pad * 2; if (w + pw > maxW && rows[rows.length - 1].length) { rows.push([]); w = 0; } rows[rows.length - 1].push([t, pw, i]); w += pw + gap; });
    rows.forEach(r => { const total = r.reduce((s, p) => s + p[1], 0) + gap * (r.length - 1); let x = cx - total / 2;
      r.forEach(([t, pw, i]) => { ctx.fillStyle = cols[i % 3]; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, pw, hgt, hgt / 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText(t, x + pw / 2, y + hgt * .7); x += pw + gap; });
      y += hgt + gap; });
    return y;
  }
  function squiggleLine(ctx, cx, y, w) { ctx.strokeStyle = CORAL; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const x = cx - w / 2 + i * w / 24, yy = y + Math.sin(i * 1.3) * 5; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
  function star(ctx, x, y, r, color) { ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .38 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore(); }
  function deskBackground(ctx, W, H) { ctx.fillStyle = DESK; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 900; i++) { ctx.fillStyle = `rgba(110,85,56,${.05 + rnd() * .06})`; ctx.fillRect(rnd() * W, rnd() * H, 2, 2); } [[.1, .07, '#f2c14e'], [.9, .12, '#e07a5f'], [.08, .93, '#93b862'], [.92, .9, '#f2c14e']].forEach(([x, y, c]) => star(ctx, x * W, y * H, 22, c)); }
  function drawQR(ctx, text, x, y, size) {
    if (typeof window.qrcode !== 'function') return false;
    try { const qr = window.qrcode(0, 'M'); qr.addData(text); qr.make(); const n = qr.getModuleCount(), cell = size / (n + 4);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, size, size, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(x + (c + 2) * cell, y + (r + 2) * cell, Math.ceil(cell), Math.ceil(cell));
      return true; } catch (_) { return false; }
  }
  function cardFooter(ctx, x, y, w, url, qr) {
    ctx.strokeStyle = '#c9b48d'; ctx.lineWidth = 3; ctx.setLineDash([10, 9]); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke(); ctx.setLineDash([]);
    const has = drawQR(ctx, url, x + w - qr, y + 22, qr);
    ctx.textAlign = 'left'; ctx.fillStyle = INK; ctx.font = `${Math.round(qr * .26)}px ${DISPLAY}`; ctx.fillText(tr('✳ Liverpool Life Club'), x, y + 22 + qr * .34);
    ctx.fillStyle = CORAL; ctx.font = `${Math.round(qr * .2)}px ${HAND}`; ctx.fillText(tr('Find out which type'), x, y + 22 + qr * .62); ctx.fillText(tr('your friends are') + (has ? (language === 'zh' ? ' · 扫码看看' : ' · scan me') : ''), x, y + 22 + qr * .84);
  }
  function mapSticker(ctx, x, y, size) { ctx.save(); ctx.translate(x, y); ctx.rotate(-.04); ctx.font = `${size}px ${DISPLAY}`; const w = ctx.measureText(tr('My Liverpool, mapped')).width + size * 1.2; ctx.fillStyle = PAPER; wobble(ctx, 0, 0, w, size * 1.9); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.fillText(tr('My Liverpool, mapped'), size * .6, size * 1.3); ctx.restore(); }
  async function makeCard(kind, format, withMap) {
    await fontsReady(); seed = 11;
    const story = format === 'story', W = 1080, H = story ? 1920 : 1080;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
    const url = kind === 'one' ? inviteURL() : pairURL();
    if (kind === 'pair') return drawPair(ctx, cv, W, H, story, url);
    const p = me(); let mapDrawn = false;
    if (withMap && !panel.hidden) {
      try { const m = exportMapSVG(); if (m) { const img = await svgImage(m.svg);
        const s = Math.max(W / m.width, (story ? H * .62 : H) / m.height), mw = m.width * s, mh = m.height * s;
        ctx.fillStyle = DESK; ctx.fillRect(0, 0, W, H); ctx.drawImage(img, (W - mw) / 2, story ? 0 : (H - mh) / 2, mw, mh);
        if (story) { const g = ctx.createLinearGradient(0, H * .5, 0, H * .66); g.addColorStop(0, 'rgba(241,228,195,0)'); g.addColorStop(1, DESK); ctx.fillStyle = g; ctx.fillRect(0, H * .5, W, H * .5); }
        mapDrawn = true; } } catch (_) {}
    }
    if (!mapDrawn) deskBackground(ctx, W, H);
    const artImg = await svgImage(ART.character(p.life, p.food));
    if (story) {
      if (mapDrawn) mapSticker(ctx, 80, 80, 40);
      const x = 80, y = mapDrawn ? 600 : 150, w = 920, h = mapDrawn ? 1260 : 1620;
      ctx.save(); ctx.translate(W / 2, y + h / 2); ctx.rotate(-.018); ctx.translate(-W / 2, -(y + h / 2));
      paperSheet(ctx, x, y, w, h); tape(ctx, W / 2, y + 6, 230, 52, .03);
      ctx.fillStyle = CORAL; ctx.font = `34px ${HAND}`; ctx.textAlign = 'center'; ctx.fillText(tr('M Y   L I V E R P O O L   L I F E'), W / 2, y + 86);
      const aw = mapDrawn ? 380 : 620, ah = aw * 330 / 400, ay = y + 135;
      ctx.save(); ctx.translate(W / 2, ay + ah / 2); ctx.rotate(.025); ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.fillRect(-aw / 2 - 18, -ah / 2 - 18, aw + 36, ah + 60); ctx.strokeRect(-aw / 2 - 18, -ah / 2 - 18, aw + 36, ah + 60); ctx.fillStyle = p.color; ctx.fillRect(-aw / 2, -ah / 2, aw, ah); ctx.drawImage(artImg, -aw / 2, -ah / 2, aw, ah); ctx.restore();
      let ty = ay + ah + 100;
      ctx.fillStyle = SOFT; ctx.font = `40px ${HAND}`; ctx.textAlign = 'center'; ctx.fillText(tr('You’re…'), W / 2, ty); ty += 78;
      ctx.fillStyle = INK; ctx.font = `${mapDrawn ? 70 : 84}px ${DISPLAY}`; ty = wrapText(ctx, p.name, W / 2, ty, 820, mapDrawn ? 76 : 92, 'center', 3);
      squiggleLine(ctx, W / 2, ty - 30, 420); ty += 34;
      ctx.fillStyle = INK; ctx.font = `${mapDrawn ? 38 : 46}px ${HAND}`; ty = wrapText(ctx, '“' + p.quote + '”', W / 2, ty, 800, mapDrawn ? 48 : 58, 'center', 3) + 16;
      ty = pills(ctx, p.keywords, W / 2, ty, 820, mapDrawn ? 30 : 36);
      cardFooter(ctx, x + 60, ty + 24, w - 120, url, mapDrawn ? 190 : 220);
      ctx.restore();
    } else {
      const w = 560, h = 1000, x = mapDrawn ? W - w - 40 : (W - w) / 2, y = 40, cx = x + w / 2;
      ctx.save(); ctx.translate(cx, y + h / 2); ctx.rotate(.02); ctx.translate(-cx, -(y + h / 2));
      paperSheet(ctx, x, y, w, h); tape(ctx, cx, y + 4, 170, 42, -.04);
      ctx.fillStyle = CORAL; ctx.font = `26px ${HAND}`; ctx.textAlign = 'center'; ctx.fillText(tr('MY LIVERPOOL LIFE'), cx, y + 66);
      const aw = 340, ah = aw * 330 / 400, ay = y + 90;
      ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.fillRect(cx - aw / 2 - 12, ay - 12, aw + 24, ah + 40); ctx.strokeRect(cx - aw / 2 - 12, ay - 12, aw + 24, ah + 40); ctx.fillStyle = p.color; ctx.fillRect(cx - aw / 2, ay, aw, ah); ctx.drawImage(artImg, cx - aw / 2, ay, aw, ah);
      let ty = ay + ah + 80; ctx.fillStyle = SOFT; ctx.font = `30px ${HAND}`; ctx.fillText(tr('You’re…'), cx, ty); ty += 56;
      ctx.fillStyle = INK; ctx.font = `52px ${DISPLAY}`; ty = wrapText(ctx, p.name, cx, ty, 480, 56, 'center', 3); squiggleLine(ctx, cx, ty - 22, 260); ty += 24;
      ctx.font = `29px ${HAND}`; ty = wrapText(ctx, '“' + p.quote + '”', cx, ty, 470, 36, 'center', 3) + 8;
      ty = pills(ctx, p.keywords, cx, ty, 490, 22);
      cardFooter(ctx, x + 36, ty + 16, w - 72, url, 140);
      ctx.restore();
      if (mapDrawn) mapSticker(ctx, 40, 40, 34);
    }
    return cv;
  }
  async function drawPair(ctx, cv, W, H, story, url) {
    const A = me(), B = M.result(friend), c = M.compare(answers, friend);
    deskBackground(ctx, W, H);
    const x = 70, y = story ? 110 : 50, w = W - 140, h = story ? H - 220 : H - 100;
    paperSheet(ctx, x, y, w, h); tape(ctx, W / 2, y + 6, 220, 48, -.03);
    ctx.fillStyle = CORAL; ctx.font = `${story ? 34 : 28}px ${HAND}`; ctx.textAlign = 'center'; ctx.fillText(tr('SAME CITY, TWO LIVES'), W / 2, y + (story ? 86 : 70));
    const [ia, ib] = await Promise.all([svgImage(ART.character(A.life, A.food)), svgImage(ART.character(B.life, B.food))]);
    const aw = story ? 380 : 290, ah = aw * 330 / 400, top = y + (story ? 130 : 100);
    [[ia, A, W / 2 - aw / 2 - 40, -.04], [ib, B, W / 2 + aw / 2 + 40, .04]].forEach(([img, p, cx, r]) => {
      ctx.save(); ctx.translate(cx, top + ah / 2); ctx.rotate(r); ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.fillRect(-aw / 2 - 14, -ah / 2 - 14, aw + 28, ah + 44); ctx.strokeRect(-aw / 2 - 14, -ah / 2 - 14, aw + 28, ah + 44); ctx.fillStyle = p.color; ctx.fillRect(-aw / 2, -ah / 2, aw, ah); ctx.drawImage(img, -aw / 2, -ah / 2, aw, ah); ctx.restore();
    });
    ctx.fillStyle = CORAL; ctx.font = `${story ? 90 : 70}px ${DISPLAY}`; ctx.textAlign = 'center'; ctx.fillText('×', W / 2, top + ah / 2 + 30);
    ctx.fillStyle = INK; ctx.font = `${story ? 46 : 34}px ${DISPLAY}`;
    const ny = top + ah + (story ? 90 : 70), lh = story ? 52 : 38;
    let y2 = Math.max(wrapText(ctx, A.name, W / 2 - aw / 2 - 40, ny, aw + 20, lh, 'center', 3), wrapText(ctx, B.name, W / 2 + aw / 2 + 40, ny, aw + 20, lh, 'center', 3)) + (story ? 40 : 20);
    const section = (title, rows, max) => { if (!rows.length) return; ctx.fillStyle = CORAL; ctx.font = `${story ? 46 : 34}px ${DISPLAY}`; ctx.textAlign = 'left'; ctx.fillText(title, x + 60, y2); y2 += story ? 54 : 40;
      ctx.fillStyle = INK; ctx.font = `${story ? 36 : 27}px ${HAND}`; rows.slice(0, max).forEach(r => { y2 = wrapText(ctx, '• ' + r, x + 60, y2, w - 120, story ? 46 : 34, 'left', 3) + (story ? 12 : 4); }); y2 += story ? 26 : 8; };
    if (story) { section(tr('Where we’re alike'), c.same.length ? c.same : [c.none], 2); section(tr('Where we differ'), c.different, 2); }
    section(tr('Our Liverpool weekend'), [c.plan], 1);
    cardFooter(ctx, x + 60, y + h - (story ? 260 : 190), w - 120, url, story ? 200 : 140);
    return cv;
  }

  /* ---------- share sheet ---------- */
  const inviteURL = () => base() + '#' + M.encode(answers);
  const pairURL = () => base() + '#' + M.encode(answers) + '~' + friend.join('');
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  let shareKind = 'one', shareFormat = 'story', shareMap = true, shareCanvas = null, drawToken = 0;
  function shareText() {
    if (shareKind === 'one') { const p = me(); return language === 'zh' ? `我在利物浦生活测验中得到了“${p.name}” ${p.icons}。你是哪种类型？测一测，和我对比：${inviteURL()}` : `I got “${p.name}” ${p.icons} in the Liverpool Life Quiz. Which type are you? Take it, then we can compare: ${inviteURL()}`; }
    const A = me(), B = M.result(friend); return language === 'zh' ? `我们是 ${A.name} × ${B.name}，来看看我们的相同与不同：${pairURL()}` : `We’re ${A.name} × ${B.name}. Here’s where we’re alike and where we’re not: ${pairURL()}`;
  }
  async function drawShare() {
    const img = $('lcShareImg'), status = $('lcShareStatus'), token = ++drawToken;
    img.removeAttribute('src'); img.alt = tr('Drawing your card…'); status.textContent = ''; shareCanvas = null;
    try { const cv = await makeCard(shareKind, shareFormat, shareMap && shareKind === 'one'); if (token !== drawToken) return;
      shareCanvas = cv; img.src = cv.toDataURL('image/png'); img.alt = tr(shareKind === 'one' ? `Your card: ${me().name}` : 'Your comparison card');
    } catch (_) { if (token === drawToken) { img.alt = ''; status.textContent = tr('The image couldn’t be drawn on this device, but the link below still works.'); } }
  }
  function syncSeg() {
    sheet.querySelectorAll('[data-format]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.format === shareFormat)));
    sheet.querySelectorAll('[data-bg]').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.bg === 'map') === shareMap)));
    $('lcBgSeg').hidden = shareKind !== 'one';
  }
  async function openShare(kind, thenDownload) {
    if (demo && kind === 'one') { toast(tr('This is a friend preview. End the preview to share your own card.')); return; }
    shareKind = kind; $('lcShareTitle').textContent = tr(kind === 'one' ? 'Share your card' : 'Share your comparison');
    $('lcShareText').value = shareText(); $('lcDemoFriend').hidden = kind !== 'one';
    track('share_opened', { kind, demo }); syncSeg(); sheet.showModal(); await drawShare();
    if (thenDownload) downloadCard();
  }
  async function copyShare() {
    const t = $('lcShareText'), s = $('lcShareStatus'); track('share_copied', { kind: shareKind });
    const text = t.value;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); s.textContent = tr('Copied. Paste it into any chat.'); return; }
    } catch (_) {}
    try {
      t.focus(); t.select();
      if (document.execCommand('copy')) { s.textContent = tr('Copied. Paste it into any chat.'); return; }
    } catch (_) {}
    t.focus(); t.select(); s.textContent = tr('Press and hold, or Ctrl / ⌘ + C, to copy.');
  }
  async function nativeShare() {
    const text = shareText(), status = $('lcShareStatus');
    if (isWeChat) {
      status.textContent = tr('In WeChat, long-press the picture to save or send to a friend. Or tap “Copy message and link” below.');
      track('share_sent', { kind: shareKind, method: 'wechat_hint' });
      return;
    }
    try {
      if (shareCanvas && navigator.canShare) { const blob = await new Promise(r => shareCanvas.toBlob(r, 'image/png')); const file = new File([blob], 'my-liverpool-life.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); track('share_sent', { kind: shareKind, method: 'share_sheet_image' }); return; } }
      if (navigator.share) { await navigator.share({ text }); track('share_sent', { kind: shareKind, method: 'share_sheet_text' }); return; }
      status.textContent = tr('This browser has no share sheet. Copy the message, or save the image.');
    } catch (e) { if (e && e.name !== 'AbortError') status.textContent = tr('Sharing isn’t available here. Copy the message, or save the image.'); }
  }
  function downloadCard() {
    if (!shareCanvas) return; const a = document.createElement('a'), p = me();
    a.href = shareCanvas.toDataURL('image/png'); a.download = `My-Liverpool-life-${(shareKind === 'one' ? p.id : 'comparison').replace(/[^A-Za-z-]+/g, '-')}-${shareFormat}.png`;
    document.body.append(a); a.click(); a.remove(); track('image_saved', { kind: shareKind, format: shareFormat, background: shareMap ? 'map' : 'plain' });
    $('lcShareStatus').textContent = isWeChat
      ? tr('In WeChat, long-press the picture above to save it to Photos, then send it to a friend.')
      : tr('Saved to your downloads. If nothing appeared, press and hold (or right-click) the picture to save it.');
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-hmr="ask"],.cta');
    if (button) track('enquiry_opened', { flow: !panel.hidden ? 'card' : HMa()?.isActive() ? 'homematch' : 'map' });
  }, true);

  document.addEventListener('click', async e => {
    const langButton = e.target.closest('[data-lc-lang]');
    if (langButton) { setLang(langButton.dataset.lcLang, true); return; }
    const ans = e.target.closest('.lc-opt[data-answer]');
    if (ans && view === 'quiz') {
      answers[step] = Number(ans.dataset.answer);
      mc.querySelectorAll('[data-answer]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.answer) === answers[step])));
      mc.querySelector('[data-lc="next"]').disabled = false;
      const s = step; clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => { if (view === 'quiz' && step === s) { if (step < N - 1) { step++; openOverlay('quiz'); } else finish(); } }, 320);
      return;
    }
    const home = e.target.closest('.lc-home[data-home]'); if (home) { openHome(home.dataset.home); return; }
    const fmt = e.target.closest('.lc-sheet [data-format]'); if (fmt) { shareFormat = fmt.dataset.format; syncSeg(); drawShare(); return; }
    const bg = e.target.closest('.lc-sheet [data-bg]'); if (bg) { shareMap = bg.dataset.bg === 'map'; syncSeg(); drawShare(); return; }
    if (e.target === wrap && view !== 'quiz') { closeOverlay(); return; }
    const b = e.target.closest('[data-lc]'); if (!b) return;
    switch (b.dataset.lc) {
      case 'entry': case 'choose': openChooser(); break;
      case 'life-choice': openOverlay('intro'); break;
      case 'home-choice': closeOverlay(); closeCard(); HMa()?.open(); break;
      case 'close-overlay': if (view === 'quiz') return; track(view === 'intro' ? 'browse_opened' : 'overlay_closed'); closeOverlay(); break;
      case 'open-card': answers = saved.slice(); openCard(); break;
      case 'start': clearTimeout(advanceTimer); if (sheet.open) sheet.close(); start(); break;
      case 'use-saved': answers = saved.slice(); track('comparison_opened'); openOverlay('compare'); break;
      case 'back': clearTimeout(advanceTimer); if (step > 0) { step--; openOverlay('quiz'); } else openOverlay(friend ? 'invite' : pair ? 'pairview' : 'intro'); break;
      case 'leave-quiz': clearTimeout(advanceTimer); if (friend) openOverlay('invite'); else if (pair) openOverlay('pairview'); else if (saved && M.result(saved)) { answers = saved.slice(); openCard(); } else closeOverlay(); break;
      case 'next': clearTimeout(advanceTimer); if (answers[step] == null) return; if (step < N - 1) { step++; openOverlay('quiz'); } else finish(); break;
      case 'fold': setMini(!panel.classList.contains('is-mini')); break;
      case 'close-card': closeCard(); break;
      case 'compare': track('comparison_opened'); openOverlay('compare'); break;
      case 'share': openShare('one'); break;
      case 'download': openShare('one', true); break;
      case 'share-pair': openShare('pair'); break;
      case 'compare-homes': { const hm = HMa(); const picks = hm ? hm.getSnapshot().picks : []; if (picks.length < 2) break; if (!(hm.openCompare3 && hm.openCompare3(b))) { compare.clear(); picks.forEach(p => compare.add(p.id)); syncCompare(); openCompare(b); } track('homes_compared'); break; }
      case 'subject': if (narrow()) setMini(true); window.SubjectDock?.open(); break;
      case 'join-pair': friend = pair[0].slice(); pair = null; start(); break;
      case 'demo': if (!me()) return; ownBeforeDemo = answers.slice(); friend = answers.slice(); demo = true; if (sheet.open) sheet.close(); closeCard(); openOverlay('invite'); break;
      case 'end-demo': endDemo(true); break;
      case 'close-share': sheet.close(); break;
      case 'copy': await copyShare(); break;
      case 'native-share': await nativeShare(); break;
      case 'download-card': downloadCard(); break;

    }
  });
  document.addEventListener('change', e => {
    const k = e.target.dataset && e.target.dataset.lcBind;
    if (k === 'campus' || k === 'walk') { extra[k] = e.target.value; store.setExtra(extra); applyHomes(); }
  });
  wrap.addEventListener('keydown', e => { if (e.key === 'Escape' && view !== 'quiz') { e.stopPropagation(); closeOverlay(); } });
  sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
  let resizeT = 0; addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { syncEntry(); fitHomes(); }, 200); });
  addEventListener('hashchange', () => {
    const h = M.decodeHash(location.hash); if (!h) return;
    endDemo(false); closeCard();
    if (h.friend) { friend = h.friend; pair = null; track('invite_opened', { kind: 'invite' }); openOverlay('invite'); }
    else { pair = h.pair; friend = null; track('invite_opened', { kind: 'comparison' }); openOverlay('pairview'); }
  });

  // Keep the current answer, question, result and share format when switching languages.
  document.addEventListener('llc-language-change', event => {
    language = /^zh/i.test(event.detail?.lang || event.detail || document.documentElement.lang) ? 'zh' : 'en';
    M.setLanguage?.(language); clearTimeout(advanceTimer); syncEntry();
    panel.setAttribute('aria-label', tr('My Life Card'));
    panel.querySelector('[data-lc="close-card"]').setAttribute('aria-label', tr('Close my card'));
    if (view) {
      const scroll = mc.scrollTop;
      openOverlay(view); mc.scrollTop = scroll;
    }
    if (!panel.hidden && me()) {
      const body = $('lcBody'), scroll = body.scrollTop, mini = panel.classList.contains('is-mini');
      const dayOpen = !!body.querySelector('.lc-day[open]');
      body.innerHTML = localizedHTML(cardHTML());
      if (dayOpen) body.querySelector('.lc-day')?.setAttribute('open', '');
      listHomes(); setMini(mini); body.scrollTop = scroll;
    }
    const shareOpen = sheet.open;
    sheet.innerHTML = localizedHTML(languageControls() + SHARE_TEMPLATE); syncSeg();
    $('lcShareTitle').textContent = tr(shareKind === 'one' ? 'Share your card' : 'Share your comparison');
    $('lcDemoFriend').hidden = shareKind !== 'one';
    if (shareOpen && me()) { $('lcShareText').value = shareText(); drawShare(); }
  });

  /* ---------- first screen: shared links, map links, then the quiz chooser ---------- */
  const link = M.decodeHash(H0), mapOnly = /(^|&)(explore=1|home=|hmAnswers=)/.test(H0);
  track('landing', { entry: link ? (link.friend ? 'invite' : 'comparison_link') : mapOnly ? 'map_link' : 'direct' });
  window.LifeQuiz = Object.freeze({ open: openChooser, openCard, closeCard, track, summary: () => { const p = (saved && M.result(saved)) || me(); return p ? { id: p.id, name: p.name } : null; } });
  if (link && link.friend) { friend = link.friend; track('invite_opened', { kind: 'invite' }); openOverlay('invite'); }
  else if (link && link.pair) { pair = link.pair; track('invite_opened', { kind: 'comparison' }); openOverlay('pairview'); }
  else if (mapOnly) { /* A shared home or plain map link stays on the map. */ }
  else if (new URL(location.href).searchParams.get('quiz') === 'homematch') HMa()?.open();
  else if (new URL(location.href).searchParams.get('quiz') === 'life') openOverlay('intro');
  else openChooser();
})();
