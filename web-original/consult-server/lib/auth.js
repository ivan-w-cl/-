'use strict';
// Very small admin auth: password (ADMIN_PASSWORD, default 123456) -> signed, expiring cookie.
const crypto = require('crypto');
function createAuth(env) {
  const password = env.ADMIN_PASSWORD || '123456';
  const secret = env.SESSION_SECRET || crypto.createHash('sha256').update('consult:' + password).digest('hex');
  const sign = v => crypto.createHmac('sha256', secret).update(v).digest('base64url');
  const eq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
  return {
    usingDefault: !env.ADMIN_PASSWORD,
    check: p => eq(p, password),
    issue() { const exp = String(Date.now() + 12 * 3600e3); return exp + '.' + sign(exp); },
    verify(cookieHeader) {
      const m = /(?:^|;\s*)consult_admin=([^;]+)/.exec(cookieHeader || ''); if (!m) return false;
      const [exp, sig] = decodeURIComponent(m[1]).split('.');
      return !!exp && !!sig && eq(sig, sign(exp)) && Number(exp) > Date.now();
    }
  };
}
module.exports = { createAuth };
