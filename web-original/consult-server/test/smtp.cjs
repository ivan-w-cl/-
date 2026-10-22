// SMTP 发信自检：本地起一个假的 SMTP 服务器（明文、AUTH LOGIN），确认握手、认证、MIME 和中文主题都正确。
const assert = require('assert'), net = require('net');
const { sendMail } = require('../lib/smtp');
(async () => {
  const seen = { cmds: [], data: '' };
  const server = net.createServer(s => {
    let buf = '', inData = false; s.write('220 fake ESMTP\r\n');
    s.on('data', d => {
      buf += d.toString();
      let i;
      while ((i = buf.indexOf('\r\n')) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 2);
        if (inData) { if (line === '.') { inData = false; s.write('250 queued\r\n'); } else seen.data += line + '\n'; continue; }
        seen.cmds.push(line);
        if (/^EHLO/.test(line)) s.write('250-fake\r\n250 AUTH LOGIN\r\n');
        else if (line === 'AUTH LOGIN') s.write('334 VXNlcm5hbWU6\r\n');
        else if (seen.cmds[seen.cmds.length - 2] === 'AUTH LOGIN') s.write('334 UGFzc3dvcmQ6\r\n');
        else if (seen.cmds[seen.cmds.length - 3] === 'AUTH LOGIN') s.write(Buffer.from(line, 'base64').toString() === 'app-pass' ? '235 ok\r\n' : '535 bad\r\n');
        else if (/^MAIL FROM|^RCPT TO/.test(line)) s.write('250 ok\r\n');
        else if (line === 'DATA') { inData = true; s.write('354 go\r\n'); }
        else if (line === 'QUIT') { s.write('221 bye\r\n'); s.end(); }
      }
    });
  }).listen(0);
  await new Promise(r => server.once('listening', r));
  await sendMail({ host: '127.0.0.1', port: server.address().port, secure: false, user: 'team@example.com', pass: 'app-pass' },
    { from: 'Liverpool Student Map <team@example.com>', to: ['a@example.com', 'b@example.com'], subject: '【提醒】新的建群请求', text: '学生在等群码', html: '<b>学生在等群码</b>' });
  assert(seen.cmds.includes('MAIL FROM:<team@example.com>'));
  assert(seen.cmds.filter(c => c.startsWith('RCPT TO')).length === 2);
  assert(/Subject: =\?UTF-8\?B\?/.test(seen.data), 'encoded subject');
  const parts = seen.data.split(/\n\n/);
  assert(seen.data.includes('Content-Type: multipart/alternative') && seen.data.includes('text/html'));
  assert(Buffer.from(parts.find(p => /^[A-Za-z0-9+/=\n]+$/.test(p.trim()) && p.trim().length > 4).replace(/\n/g, ''), 'base64').toString().includes('学生在等群码'));
  console.log('PASS smtp: EHLO, AUTH LOGIN, two recipients, UTF-8 subject, multipart text+html');
  server.close();
})().catch(e => { console.error(e); process.exit(1); });
