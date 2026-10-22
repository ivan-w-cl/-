'use strict';
/* 极简 SMTP 发信（无第三方依赖），用于 Google Workspace / Gmail 等邮箱直接发提醒邮件。
   - 465 端口：一连上就是 TLS（SMTP_SECURE=true，Gmail 推荐）
   - 587 端口：先明文再 STARTTLS
   - 认证：AUTH LOGIN（Gmail / Workspace 用「应用专用密码」，需要账号开启两步验证）
   只实现发提醒邮件需要的部分：单封 multipart/alternative（纯文本 + HTML），UTF-8。 */
const net = require('net'), tls = require('tls'), crypto = require('crypto');

const b64 = s => Buffer.from(String(s), 'utf8').toString('base64');
const encWord = s => /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`;
const wrap76 = s => s.replace(/.{1,76}/g, '$&\r\n');
function addrOnly(a) { const m = /<([^>]+)>/.exec(a); return (m ? m[1] : a).trim(); }
function fromHeader(a) { const m = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(a); return m && m[1] ? `${encWord(m[1].replace(/^"|"$/g, ''))} <${m[2]}>` : a; }

function buildMessage({ from, to, subject, text, html }) {
  const boundary = 'lsm-' + crypto.randomBytes(8).toString('hex');
  return [
    `From: ${fromHeader(from)}`, `To: ${to.join(', ')}`, `Subject: ${encWord(subject)}`,
    `Date: ${new Date().toUTCString()}`, `Message-ID: <${crypto.randomBytes(12).toString('hex')}@${addrOnly(from).split('@')[1] || 'localhost'}>`,
    'MIME-Version: 1.0', `Content-Type: multipart/alternative; boundary="${boundary}"`, '',
    `--${boundary}`, 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', wrap76(b64(text)),
    `--${boundary}`, 'Content-Type: text/html; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', wrap76(b64(html)),
    `--${boundary}--`, ''
  ].join('\r\n');
}

/* 读一条完整的 SMTP 回复（可能多行：250-xxx … 250 xxx） */
function reader(socket) {
  let buf = '', waiting = null;
  const tryTake = () => {
    const lines = buf.split('\r\n'); let end = -1;
    for (let i = 0; i < lines.length - 1; i++) if (/^\d{3} /.test(lines[i])) { end = i; break; }
    if (end < 0 || !waiting) return;
    const reply = lines.slice(0, end + 1); buf = lines.slice(end + 1).join('\r\n');
    const w = waiting; waiting = null; w.resolve({ code: Number(reply[end].slice(0, 3)), text: reply.join('\n') });
  };
  const onData = d => { buf += d.toString('utf8'); tryTake(); };
  socket.on('data', onData);
  return { next: () => new Promise((resolve, reject) => { waiting = { resolve, reject }; tryTake(); }), detach: () => socket.removeListener('data', onData), fail: e => { if (waiting) { const w = waiting; waiting = null; w.reject(e); } } };
}

async function sendMail(opt, mail) {
  const host = opt.host, port = Number(opt.port || 465), secure = opt.secure !== false && String(opt.secure) !== 'false';
  const timeout = opt.timeout || 20000;
  let socket = await new Promise((resolve, reject) => {
    const s = secure ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });
    s.once(secure ? 'secureConnect' : 'connect', () => resolve(s)); s.once('error', reject);
    s.setTimeout(timeout, () => s.destroy(new Error('SMTP 连接超时')));
  });
  let r = reader(socket);
  socket.on('error', e => r.fail(e));
  const cmd = async (line, expect) => {
    if (line != null) socket.write(line + '\r\n');
    const res = await r.next();
    if (!expect.includes(res.code)) throw new Error(`SMTP ${line ? line.split(' ')[0] : 'greeting'} → ${res.text.replace(/\n/g, ' ').slice(0, 200)}`);
    return res;
  };
  try {
    await cmd(null, [220]);
    const name = opt.helo || 'liverpool-student-map';
    let ehlo = await cmd(`EHLO ${name}`, [250]);
    if (!secure && /STARTTLS/i.test(ehlo.text)) {
      await cmd('STARTTLS', [220]); r.detach();
      socket = await new Promise((resolve, reject) => { const t = tls.connect({ socket, servername: host }, () => resolve(t)); t.once('error', reject); });
      r = reader(socket); socket.on('error', e => r.fail(e));
      ehlo = await cmd(`EHLO ${name}`, [250]);
    }
    if (opt.user) { await cmd('AUTH LOGIN', [334]); await cmd(b64(opt.user), [334]); await cmd(b64(opt.pass || ''), [235]); }
    await cmd(`MAIL FROM:<${addrOnly(mail.from)}>`, [250]);
    for (const a of mail.to) await cmd(`RCPT TO:<${addrOnly(a)}>`, [250, 251]);
    await cmd('DATA', [354]);
    const body = buildMessage(mail).replace(/^\./gm, '..');   // dot-stuffing
    await cmd(body + '\r\n.', [250]);
    await cmd('QUIT', [221]).catch(() => {});
  } finally { socket.end(); }
}
module.exports = { sendMail, buildMessage };
