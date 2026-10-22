/* 利物浦实时天气（网页版 weather.js 的小程序版）：经服务器 /api/weather 代取 Open-Meteo，15 分钟更新；
   连不上时用示例天气，可以「换一种」预览各种效果。文案、分类、图标都来自网页（utils/weather-core.js）。 */
const { API_BASE } = require('../config.js');
const C = require('./weather-core.js');
const KEY = 'lsm-weather-v1', EVERY = 15 * 60e3;
let sampleAt = 0;

/* 英国时间：3 月最后一个周日 01:00 UTC 到 10 月最后一个周日 01:00 UTC 是夏令时（UTC+1） */
function lastSunday(y, m) { const d = new Date(Date.UTC(y, m + 1, 0, 1)); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return d.getTime(); }
function londonOffset(t) { const y = new Date(t).getUTCFullYear(); return t >= lastSunday(y, 2) && t < lastSunday(y, 9) ? 1 : 0; }
const pad = n => String(n).padStart(2, '0');
function londonTime(t) { const d = new Date(t + londonOffset(t) * 36e5); return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`; }
/* 学生在哪：手机时区（分钟偏移）+ 语言 */
function homeRegion(lang) {
  const off = -new Date().getTimezoneOffset() / 60;
  if (off === 9 || lang === 'ja') return { reg: 'JP', off: 9 };
  if (off === 8) return { reg: lang === 'en' ? 'SG' : 'CN', off: 8 };
  return { reg: lang === 'zh' ? 'CN' : 'SG', off: 8 };
}

function fromApi(j) {
  const c = j.current, d = j.daily || {};
  return { code: c.weather_code, temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature), wind: Math.round(c.wind_speed_10m), day: !!c.is_day,
    hi: d.temperature_2m_max ? Math.round(d.temperature_2m_max[0]) : null, lo: d.temperature_2m_min ? Math.round(d.temperature_2m_min[0]) : null,
    rain: d.precipitation_probability_max ? d.precipitation_probability_max[0] : null, sunset: d.sunset ? d.sunset[0] : null };
}
const sample = () => Object.assign({ sample: true, day: null, sunset: null }, C.SAMPLES[sampleAt % C.SAMPLES.length]);

function load() {
  return new Promise(ok => {
    try { const v = wx.getStorageSync(KEY); if (v && Date.now() - v.at < EVERY) return ok(v.w); } catch (e) { /* 忽略 */ }
    wx.request({ url: API_BASE + '/api/weather', timeout: 8000,
      success: r => { if (r.statusCode === 200 && r.data && r.data.current) { const w = fromApi(r.data); try { wx.setStorageSync(KEY, { at: Date.now(), w }); } catch (e) { /* 忽略 */ } ok(w); } else ok(sample()); },
      fail: () => { hint(); ok(sample()); } });
  });
}
/* 连不上服务器时在调试面板里说清楚原因（开发者工具会另外打出一行 ERR_CONNECTION_REFUSED） */
let hinted = false;
function hint() {
  if (hinted) return; hinted = true;
  console.warn(`连不上服务器 ${API_BASE}：请先运行 start-demo（Windows 双击 start-demo.cmd，Mac 运行 sh start-demo.sh），窗口保持打开。` +
    '真机预览时 localhost 指的是手机自己，要先运行 node miniprogram/scripts/set-server.cjs 换成电脑的局域网 IP。现在先显示示例天气，进群等功能要等服务器连上才能用。');
}

/* 页面要显示的内容 + 地图效果的 class */
function view(w, lang) {
  const K = C.W[lang] || C.W.zh, kd = C.kind(w.code), now = Date.now(), lt = londonTime(now);
  const night = w.day === null ? (() => { const h = +lt.slice(0, 2); return h < 7 || h >= 18; })() : !w.day;
  const tip = w.temp <= 2 && kd !== 'snow' ? K.tip.cold : K.tip[kd];
  const { reg, off } = homeRegion(lang), diff = off - londonOffset(now);
  const fx = [];
  if (['rain', 'drizzle', 'snow', 'fog', 'storm'].includes(kd)) fx.push('wx-' + kd);
  if (['cloudy', 'rain', 'drizzle', 'fog', 'storm', 'snow'].includes(kd)) fx.push('wx-cloudy');
  if (night) fx.push('wx-night'); if (w.wind >= 30) fx.push('wx-windy');
  return {
    icon: C.ICONS[kd + (night ? '-n' : '')] || C.ICONS[kd], l1: `${K.city} · ${K.now} ${lt}`, temp: `${w.temp}°`, label: K.k[kd], sample: w.sample ? K.sample : '',
    title: `${K.city} ${w.temp}°C · ${K.k[kd]}`, tip,
    rows: [[`${K.hi} / ${K.lo}`, w.hi == null ? '—' : `${w.hi}° / ${w.lo}°`], [K.feels, `${w.feels}°`], [K.rain, w.rain == null ? '—' : w.rain + '%'], [K.wind, `${w.wind} km/h`]]
      .concat(w.sunset ? [[K.dark, w.sunset.slice(11, 16)]] : []).concat([[K.now, lt, diff > 0 ? `(${K.behind.replace('{c}', K.home[reg]).replace('{n}', diff)})` : '']]),
    src: w.sample ? K.offline : K.live, another: w.sample ? K.another + ' →' : '', close: K.close, fx: fx.join(' ')
  };
}
module.exports = { load, view, next() { sampleAt++; return sample(); }, londonTime };
