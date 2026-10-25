'use strict';
/* 拍一下 · 看懂公寓网页：把学生拍的屏幕照片、截图或粘贴的网址交给 Claude 读懂，返回结构化结果给网页（web-live/snap-read.js）。
   - 需要环境变量 ANTHROPIC_API_KEY（或 ANTHROPIC_AUTH_TOKEN），并在本目录运行过一次 npm install；没有就返回 enabled: false，网页继续用演示数据。
   - 模型默认 claude-opus-5-5，可用 SNAP_MODEL 改；拒答时用服务器端的默认备选模型重试（fallbacks: "default"）。
   - 只读学生主动提交的这一张图或这一个网址；图片不保存，网址只抓这一页的文字。 */
const MODEL = process.env.SNAP_MODEL || 'claude-opus-5-5';
const MAX_TEXT = 60000;   // 网址抓下来的页面文字最多发这么多字

let sdk = null;
function load() {
  if (sdk !== null) return sdk;
  try {
    const Anthropic = require('@anthropic-ai/sdk').default;
    const { betaZodOutputFormat } = require('@anthropic-ai/sdk/helpers/beta/zod');
    const z = require('zod');
    sdk = { Anthropic, betaZodOutputFormat, z };
  } catch (e) { sdk = false; }   // 没有 npm install：不报错，网页用演示数据
  return sdk;
}
const enabled = () => !!(load() && (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN));

/* 返回给网页的结构：和演示数据同一种格式，网页用同一套界面显示 */
function schema(z) {
  const note = z.object({ zh: z.string(), ja: z.string(), en: z.string() });
  return z.object({
    kind: z.enum(['official', 'platform', 'other', 'not_listing']),
    site_name: z.string(),
    site_url: z.string(),
    building_name: z.string(),
    room_type: z.string(),
    weekly_price: z.number().nullable(),
    weeks: z.number().nullable(),
    cashback: z.number().nullable(),
    buildings: z.array(z.object({ name: z.string(), price_from: z.number().nullable(), area: z.string() })),
    sentences: z.array(z.object({ en: z.string(), zh: z.string(), ja: z.string(), flag: z.enum(['warn', 'info', 'none']), note })),
    questions: z.array(z.object({ en: z.string(), zh: z.string() })),
    uncertain: z.string()
  });
}

const SYSTEM = `You help students from China, Japan and Singapore understand UK student accommodation listings. You receive one input from a student: a phone photo of a computer screen, a phone screenshot, or the text of a web page. Return the structured result.

Read only what the input shows. Never invent buildings, prices, dates or terms; if something is not visible, leave the string empty or the number null.

- kind: "official" if the page is the accommodation operator's own website, "platform" if it is a third-party booking platform, marketplace or agent listing, "other" for any other housing page, "not_listing" if it is not about accommodation. A photo of a screen may show glare, angles or browser chrome; read through them.
- site_name, site_url: as shown (the address bar or logo). building_name and room_type: as shown on the page.
- buildings: when the page lists several buildings (a city or search results page), each building as shown, with its "from" weekly price in pounds (null if not shown) and the area or distance text shown; leave building_name and room_type empty in that case. Empty array for a single-building page.
- weekly_price, weeks, cashback: numbers in pounds and weeks for the main room on the page. If a platform shows a weekly price "after cashback", give that figure as weekly_price and the cashback separately.
- sentences: up to 12 sentences from the page that matter for renting, in reading order, each quoted in its original English (lightly cleaned of layout noise). Prefer prices, fees, deposits, cashback and its conditions, payment and instalments, guarantors, cancellation, cooling-off, visa refusal (No Visa No Pay), replacement tenants, early leaving and check-out. Give each a natural translation in Simplified Chinese (zh) and Japanese (ja).
- flag: "warn" when the sentence costs the student money or limits cancelling (non-refundable fees, conditions on cashback, deadlines, replacement tenant requirements, paying rent after leaving early, guarantor requirements); "info" for useful facts; "none" otherwise. note: one short plain sentence each in zh, ja and en saying what the student should notice or ask, empty for "none".
- questions: 2 to 4 questions the student should ask the booking adviser, based on what the page leaves unclear, each in English (en) and Simplified Chinese (zh).
- uncertain: if you are not sure which building or room this is, one short question in Simplified Chinese to confirm it, otherwise an empty string.`;

/* 把网页抓成纯文字（只抓学生给的这一页） */
async function pageText(url) {
  const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LiverpoolStudentMap/1.0; +reader)', 'Accept-Language': 'en-GB,en;q=0.9' } });
  if (!r.ok) throw Object.assign(new Error('fetch ' + r.status), { code: 'fetch_failed' });
  const html = (await r.text()).slice(0, 2e6);
  const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html) || [])[1] || '';
  const text = html.replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, ' ').replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr|section)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&pound;/g, '£').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
  return `URL: ${url}\nTitle: ${title.trim()}\n\n${text.slice(0, MAX_TEXT)}`;
}

/* input = { image: {media_type, data} } 或 { url } → 结构化结果 */
async function read(input) {
  const s = load();
  if (!s || !enabled()) throw Object.assign(new Error('not configured'), { code: 'not_configured' });
  const client = new s.Anthropic();
  const content = input.image
    ? [{ type: 'image', source: { type: 'base64', media_type: input.image.media_type, data: input.image.data } }, { type: 'text', text: 'Here is the photo or screenshot the student took.' }]
    : [{ type: 'text', text: 'Here is the text of the page the student linked:\n\n' + await pageText(input.url) }];
  const msg = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM,
    output_config: { effort: 'medium', format: s.betaZodOutputFormat(schema(s.z)) },
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    messages: [{ role: 'user', content }]
  });
  if (msg.stop_reason === 'refusal') throw Object.assign(new Error('refused'), { code: 'refused' });
  if (msg.stop_reason === 'max_tokens' || !msg.parsed_output) throw Object.assign(new Error('incomplete'), { code: 'incomplete' });
  return { ...msg.parsed_output, model: msg.model };
}

/* 路由：GET /api/snap/status，POST /api/snap { image: dataURL } 或 { url } */
function createSnapApi({ send, readBody, json, limited }) {
  return async function snapApi(req, res, url) {
    const p = url.pathname;
    if (p === '/api/snap/status' && req.method === 'GET') return send(res, 200, { enabled: enabled(), model: enabled() ? MODEL : null });
    if (p !== '/api/snap' || req.method !== 'POST') return send(res, 404, { error: 'not_found' });
    if (!enabled()) return send(res, 503, { error: 'not_configured' });
    if (limited(req, 'snap', 12, 10 * 60e3)) return send(res, 429, { error: 'too_many' });
    let body;
    try { body = json(await readBody(req, 8 * 1024 * 1024)); } catch (e) { return send(res, e.code === 413 ? 413 : 400, { error: e.code === 413 ? 'too_large' : 'bad_request' }); }
    if (!body) return send(res, 400, { error: 'bad_request' });
    let input = null;
    const m = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(String(body.image || ''));
    if (m) input = { image: { media_type: m[1], data: m[2] } };
    else if (body.url) {
      let u = null; try { u = new URL(String(body.url)); } catch (_) { u = null; }
      if (!u || !/^https?:$/.test(u.protocol) || /^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[?::1)/i.test(u.hostname)) return send(res, 400, { error: 'bad_url' });
      input = { url: u.href };
    }
    if (!input) return send(res, 400, { error: 'bad_request' });
    try { return send(res, 200, await read(input)); } catch (e) {
      const sdkErr = load() && e instanceof load().Anthropic.APIError;
      console.error('snap:', e.code || (sdkErr ? e.status : ''), e.message);
      if (sdkErr && e instanceof load().Anthropic.AuthenticationError) return send(res, 502, { error: 'bad_key' });
      if (sdkErr && e instanceof load().Anthropic.RateLimitError) return send(res, 429, { error: 'busy' });
      return send(res, 502, { error: e.code || 'ai_failed' });
    }
  };
}
module.exports = { createSnapApi, read, enabled };
