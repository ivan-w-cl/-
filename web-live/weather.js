/* 利物浦实时天气：地图上方一个手绘小标签（当地时间 + 天气 + 气温），点开看今天最高/最低、降雨概率、天黑时间和时差。
   天气也会画到地图上：下雨、下雪、起雾、阴天云更多、晚上地图变暗。
   数据来自 Open-Meteo（免 key，浏览器直接请求），15 分钟更新一次；连不上网时显示示例天气，点「换一种」可以预览各种效果。
   不改原页面布局：只在地图上加一个浮动标签和一层不挡点击的效果层。 */
(() => {
  'use strict';
  const API = 'https://api.open-meteo.com/v1/forecast?latitude=53.4084&longitude=-2.9916'
    + '&current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m'
    + '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunset&timezone=Europe%2FLondon&forecast_days=1';
  const KEY = 'lsm-weather-v1', TZ = 'Europe/London', EVERY = 15 * 60e3;
  const mapbox = document.getElementById('mapbox'), app = document.getElementById('app'), brand = document.querySelector('.brandbar');
  if (!mapbox || !app || !brand) return;

  const W = {
    zh: { city: '利物浦', now: '现在', sample: '示例天气', another: '换一种', live: 'Open-Meteo 实时天气', hi: '最高', lo: '最低', rain: '降雨概率', wind: '风',
          dark: '天黑', feels: '体感', behind: '比{c}晚 {n} 小时', home: { CN: '北京', SG: '新加坡', JP: '东京' }, open: '利物浦天气', close: '收起',
          offline: '预览里连不上天气服务，这里先用示例；放到正式网站上就是实时天气。',
          k: { clear: '晴', partly: '多云', cloudy: '阴', fog: '有雾', drizzle: '毛毛雨', rain: '下雨', snow: '下雪', storm: '雷雨' },
          tip: { clear: '难得的晴天，适合去码头走走。', partly: '天气多变，出门带件外套。', cloudy: '典型的利物浦阴天，带件防风外套。', fog: '有雾，过马路注意车。',
                 drizzle: '毛毛雨，带把折叠伞。', rain: '下雨了，记得带伞，步行去学校会湿鞋。', snow: '下雪了，路面滑，慢慢走。', storm: '雷雨天，尽量待在室内。', cold: '很冷，围巾手套都带上。' } },
    en: { city: 'Liverpool', now: 'now', sample: 'Sample weather', another: 'Try another', live: 'Live weather from Open-Meteo', hi: 'High', lo: 'Low', rain: 'Chance of rain', wind: 'Wind',
          dark: 'Dark at', feels: 'Feels like', behind: '{n} h behind {c}', home: { CN: 'Beijing', SG: 'Singapore', JP: 'Tokyo' }, open: 'Liverpool weather', close: 'Close',
          offline: 'The preview cannot reach the weather service, so this is a sample. On the real site it is live.',
          k: { clear: 'Sunny', partly: 'Partly cloudy', cloudy: 'Overcast', fog: 'Foggy', drizzle: 'Drizzle', rain: 'Rain', snow: 'Snow', storm: 'Thunderstorm' },
          tip: { clear: 'A rare sunny day. Good for a walk by the docks.', partly: 'Changeable. Take a jacket.', cloudy: 'Classic Liverpool grey. A windproof jacket helps.', fog: 'Foggy. Take care crossing roads.',
                 drizzle: 'Drizzle. A small umbrella is enough.', rain: 'Raining. Take an umbrella for the walk to campus.', snow: 'Snow. Pavements are slippery.', storm: 'Thunderstorms. Best to stay inside.', cold: 'Very cold. Scarf and gloves.' } },
    ja: { city: 'リバプール', now: '現在', sample: 'サンプル天気', another: '切り替え', live: 'Open-Meteo のリアルタイム天気', hi: '最高', lo: '最低', rain: '降水確率', wind: '風',
          dark: '日没', feels: '体感', behind: '{c}より {n} 時間遅い', home: { CN: '北京', SG: 'シンガポール', JP: '東京' }, open: 'リバプールの天気', close: '閉じる',
          offline: 'プレビューでは天気サービスに接続できないため、サンプルを表示しています。本番サイトではリアルタイムです。',
          k: { clear: '晴れ', partly: '晴れ時々くもり', cloudy: 'くもり', fog: '霧', drizzle: '霧雨', rain: '雨', snow: '雪', storm: '雷雨' },
          tip: { clear: '珍しい晴れの日。港の散歩にぴったり。', partly: '変わりやすい天気。上着を持って。', cloudy: 'リバプールらしい曇り空。防風ジャケットを。', fog: '霧が出ています。道路の横断に注意。',
                 drizzle: '霧雨。折りたたみ傘で十分。', rain: '雨です。通学には傘を。', snow: '雪です。足元に注意。', storm: '雷雨。なるべく屋内で。', cold: 'とても寒いです。マフラーと手袋を。' } }
  };
  const lang = () => { try { return W[LANG] ? LANG : 'zh'; } catch (_) { return 'zh'; } };
  const k = () => W[lang()];
  const kind = c => c === 0 ? 'clear' : c <= 2 ? 'partly' : c === 3 ? 'cloudy' : c <= 48 ? 'fog' : c <= 57 ? 'drizzle' : c <= 67 || (c >= 80 && c <= 82) ? 'rain' : c <= 77 || c === 85 || c === 86 ? 'snow' : c >= 95 ? 'storm' : 'cloudy';

  /* 手绘风小图标 */
  const ST = 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const ln = (d, c = 'currentColor', wdt = 2) => `<path d="${d}" fill="none" stroke="${c}" ${ST.replace('2', wdt)}/>`;
  const sh = (tag, f) => tag.replace('/>', ` fill="${f}" stroke="currentColor" ${ST}/>`);
  const cloud = (f = '#fffaf0') => sh('<path d="M8 19 h13 a4.5 4.5 0 0 0 0 -9 a6 6 0 0 0 -11.5 -1.5 A4.5 4.5 0 0 0 8 19 Z"/>', f);
  const moon = (d, f = '#f2d98a') => sh(`<path d="${d}"/>`, f);
  const ICON = {
    clear: n => n ? moon('M19 15.5 A7.5 7.5 0 1 1 12.5 5 a6 6 0 0 0 6.5 10.5 Z')
                  : sh('<circle cx="14" cy="14" r="5"/>', '#f2c14e') + ln('M14 3v3M14 22v3M3 14h3M22 14h3M6.2 6.2l2 2M19.8 19.8l2 2M6.2 21.8l2-2M19.8 8.2l2-2'),
    partly: n => (n ? moon('M16 9 A5 5 0 1 1 10 4 a4 4 0 0 0 6 5 Z') : sh('<circle cx="10" cy="9" r="4.5"/>', '#f2c14e')) + cloud(),
    cloudy: () => cloud('#e7e0d0'),
    fog: () => cloud('#e7e0d0') + ln('M5 23h16M8 26h13'),
    drizzle: () => cloud('#e7e0d0') + ln('M11 22v2M17 22v2', '#3d7fa6'),
    rain: () => cloud('#d9d3c4') + ln('M10 22l-1.5 4M15 22l-1.5 4M20 22l-1.5 4', '#3d7fa6'),
    snow: () => cloud('#e7e0d0') + ln('M10 23h.01M15 25h.01M20 23h.01', '#7aa7c4', 3.2),
    storm: () => cloud('#cfc8b8') + ln('M15 20l-3 4h4l-2 4', '#b5462f')
  };
  const icon = (w, night) => `<svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">${ICON[w](night)}</svg>`;

  /* 预览环境连不上网时用的示例（都是利物浦常见的天气） */
  const SAMPLES = [
    { code: 61, temp: 11, feels: 8, wind: 24, hi: 12, lo: 7, rain: 80 }, { code: 3, temp: 13, feels: 11, wind: 18, hi: 14, lo: 9, rain: 30 },
    { code: 2, temp: 16, feels: 15, wind: 12, hi: 18, lo: 10, rain: 10 }, { code: 45, temp: 6, feels: 4, wind: 6, hi: 9, lo: 3, rain: 20 },
    { code: 71, temp: 0, feels: -4, wind: 15, hi: 2, lo: -2, rain: 60 }, { code: 0, temp: 19, feels: 19, wind: 9, hi: 21, lo: 12, rain: 0 }
  ];
  let sampleAt = 0;
  const sample = () => Object.assign({ sample: true, day: null, sunset: null }, SAMPLES[sampleAt % SAMPLES.length]);

  const cached = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && Date.now() - v.at < EVERY ? v.w : null; } catch (_) { return null; } };
  async function fetchLive() {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 6000);
    try {
      const r = await fetch(API, { signal: ctl.signal }); if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json(), c = j.current, d = j.daily;
      const w = { code: c.weather_code, temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature), wind: Math.round(c.wind_speed_10m), day: !!c.is_day,
        hi: Math.round(d.temperature_2m_max[0]), lo: Math.round(d.temperature_2m_min[0]), rain: d.precipitation_probability_max[0], sunset: d.sunset[0] };
      try { localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), w })); } catch (_) { /* 不缓存也能用 */ }
      return w;
    } finally { clearTimeout(t); }
  }

  /* ---------- 时间 ---------- */
  const hm = (d, tz) => d.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
  const offsetH = tz => { const d = new Date(), f = z => new Date(d.toLocaleString('en-US', { timeZone: z })); return Math.round((f(tz) - f(TZ)) / 36e5); };
  const homeRegion = () => { const z = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; return /Singapore/.test(z) ? 'SG' : /Tokyo/.test(z) || lang() === 'ja' ? 'JP' : /Shanghai|Chongqing|Hong_Kong|Taipei|Macau/.test(z) || lang() === 'zh' ? 'CN' : 'SG'; };
  const isNight = w => (w.day === null ? (() => { const h = +hm(new Date(), TZ).slice(0, 2); return h < 7 || h >= 18; })() : !w.day);

  /* ---------- 界面 ---------- */
  const chip = document.createElement('button');
  chip.type = 'button'; chip.className = 'wx-chip'; chip.setAttribute('aria-expanded', 'false');
  const pop = document.createElement('div'); pop.className = 'wx-pop'; pop.hidden = true; pop.setAttribute('role', 'dialog');
  const fx = document.createElement('div'); fx.className = 'wx-fx'; fx.setAttribute('aria-hidden', 'true');
  chip.classList.add('float'); pop.classList.add('float');
  mapbox.append(fx); app.append(chip, pop);
  let w = null;

  /* 位置：电脑上放在标题栏右边（放不下就放到地图底部中间）；手机上放在标题栏下面靠右 */
  const narrow = matchMedia('(max-width: 760px), (max-height: 500px), (max-width: 1024px) and (hover: none)');
  function place() {
    const A = app.getBoundingClientRect(), B = brand.getBoundingClientRect(), ctl = document.querySelector('.controls');
    chip.style.cssText = ''; pop.style.cssText = '';
    let top;
    if (narrow.matches) { top = B.bottom - A.top + 8; chip.style.top = top + 'px'; chip.style.right = 'calc(10px + env(safe-area-inset-right, 0px))'; pop.style.right = chip.style.right; }
    else {
      const cr = ctl && ctl.offsetParent ? ctl.getBoundingClientRect() : null;
      const room = (cr && cr.top < B.bottom ? cr.left : A.right) - B.right - 24;   // 「找公寓」面板收起时也还在右上角
      if (room >= chip.offsetWidth) { top = B.top - A.top; chip.style.top = top + 'px'; chip.style.left = (B.right - A.left + 12) + 'px'; pop.style.left = chip.style.left; }
      else { chip.style.bottom = 'calc(14px + env(safe-area-inset-bottom, 0px))'; chip.style.left = '50%'; chip.style.transform = 'translateX(-50%)'; pop.style.left = '50%'; pop.style.transform = 'translateX(-50%)'; }
    }
    if (top != null) pop.style.top = (top + chip.offsetHeight + 8) + 'px';
    else pop.style.bottom = `calc(${chip.offsetHeight + 24}px + env(safe-area-inset-bottom, 0px))`;
  }
  addEventListener('resize', place);
  document.addEventListener('click', e => { if (e.target.closest('.pbtn')) setTimeout(place, 350); });   // 面板展开 / 收起后重新摆
  new ResizeObserver(place).observe(brand);

  function paint() {
    if (!w) return;
    const K = k(), kd = kind(w.code), night = isNight(w), tip = w.temp <= 2 && kd !== 'snow' ? K.tip.cold : K.tip[kd];
    chip.innerHTML = `${icon(kd, night)}<span class="wx-txt"><span class="wx-l1">${K.city} · ${K.now} ${hm(new Date(), TZ)}</span><span class="wx-l2"><b>${w.temp}°</b> ${K.k[kd]}${w.sample ? ` · <i>${K.sample}</i>` : ''}</span></span>`;
    chip.setAttribute('aria-label', `${K.open}: ${K.k[kd]} ${w.temp}°C`);
    const reg = homeRegion(), off = offsetH({ CN: 'Asia/Shanghai', SG: 'Asia/Singapore', JP: 'Asia/Tokyo' }[reg]);
    const sunset = w.sunset ? w.sunset.slice(11, 16) : null;
    pop.innerHTML = `<div class="wx-ph">${icon(kd, night)}<b>${K.city} ${w.temp}°C · ${K.k[kd]}</b><button type="button" class="wx-x" aria-label="${K.close}">×</button></div>
      <p class="wx-tip">${tip}</p>
      <dl><dt>${K.hi} / ${K.lo}</dt><dd>${w.hi}° / ${w.lo}°</dd><dt>${K.feels}</dt><dd>${w.feels}°</dd>
      <dt>${K.rain}</dt><dd>${w.rain == null ? '—' : w.rain + '%'}</dd><dt>${K.wind}</dt><dd>${w.wind} km/h</dd>
      ${sunset ? `<dt>${K.dark}</dt><dd>${sunset}</dd>` : ''}
      <dt>${K.now}</dt><dd>${hm(new Date(), TZ)}${off > 0 ? ` <span>(${K.behind.replace('{c}', K.home[reg]).replace('{n}', off)})</span>` : ''}</dd></dl>
      ${w.sample ? `<p class="wx-src">${K.offline}</p><button type="button" class="wx-next">${K.another} →</button>` : `<p class="wx-src">${K.live}</p>`}`;
    /* 地图效果 */
    app.classList.remove('wx-rain', 'wx-drizzle', 'wx-snow', 'wx-fog', 'wx-cloudy', 'wx-storm', 'wx-night', 'wx-windy');
    if (['rain', 'drizzle', 'snow', 'fog', 'storm'].includes(kd)) app.classList.add('wx-' + kd);
    if (['cloudy', 'rain', 'drizzle', 'fog', 'storm', 'snow'].includes(kd)) app.classList.add('wx-cloudy');
    if (night) app.classList.add('wx-night');
    if (w.wind >= 30) app.classList.add('wx-windy');
    place();
  }
  function toggle(open) {
    pop.hidden = !open; chip.setAttribute('aria-expanded', String(open));
    if (open) { pop.querySelector('.wx-x').focus({ preventScroll: true }); }
  }
  chip.addEventListener('click', () => toggle(pop.hidden));
  pop.addEventListener('click', e => {
    if (e.target.closest('.wx-x')) { toggle(false); chip.focus(); }
    if (e.target.closest('.wx-next')) { sampleAt++; w = sample(); paint(); pop.querySelector('.wx-next').focus(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) { toggle(false); chip.focus(); } });
  document.addEventListener('pointerdown', e => { if (!pop.hidden && !pop.contains(e.target) && !chip.contains(e.target)) toggle(false); });
  new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  async function load() {
    const c = cached(); if (c) { w = c; paint(); return; }
    try { w = await fetchLive(); } catch (_) { if (!w || w.sample) w = sample(); }
    paint();
  }
  load();
  setInterval(() => { if (!document.hidden) load(); }, EVERY);
  setInterval(() => { if (!document.hidden && pop.hidden) paint(); }, 60e3);   // 每分钟刷新当地时间
})();
