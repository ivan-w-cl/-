/* 顾问后台的「邮件提醒」：设置收件人和提醒类型，查看已发送的提醒邮件并预览。
   演示里邮件记录在浏览器本地；正式版由 consult-server 发送（EMAIL_API_KEY / NOTIFY_EMAIL_TO，见其 README）。 */
(function () {
  'use strict';
  const M = window.MailOutbox, E = window.EmailTemplate;
  const C = {
    zh: { btn: '📧 邮件提醒', title: '邮件提醒', to: '收件人（多个用逗号分隔）', when: '什么时候发邮件', request: '学生申请建群、需要人工建群时', auto: '预建群池自动派发群码后（知会）', forward: '学生在已有群里又咨询了别的公寓',
      stale: '群码发出 24 小时学生还没进群（正式版由服务器定时检查）', save: '保存设置', saved: '已保存', sent: '已发送的提醒', none: '还没有提醒邮件。到学生网站点「立即进群」试试。', preview: '邮件预览', close: '关闭',
      note: '演示：邮件只记录在本浏览器，不会真的发出。正式版由 consult-server 通过邮件服务发送，内容与这里的预览相同。', clear: '清空记录' },
    en: { btn: '📧 Email alerts', title: 'Email alerts', to: 'Recipients (comma separated)', when: 'Send an email when', request: 'A student asks for a group and one must be created by hand', auto: 'A pre-built group code was sent automatically (FYI)', forward: 'A student in an existing group asks about another home',
      stale: 'A group code was sent 24 hours ago and the student has not joined (server-side check in production)', save: 'Save', saved: 'Saved', sent: 'Sent alerts', none: 'No alert emails yet. Tap "Join my group now" on the student site.', preview: 'Email preview', close: 'Close',
      note: 'Demo: emails are only recorded in this browser. In production consult-server sends them through an email service with the same content as this preview.', clear: 'Clear log' }
  };
  const lang = () => (window.Store && window.Store.s.demoLang === 'en') ? 'en' : 'zh';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const time = at => new Date(at).toLocaleString(lang() === 'en' ? 'en-GB' : 'zh-CN', { hour12: false, month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const wrap = document.createElement('div'); wrap.className = 'mp-wrap'; wrap.hidden = true; document.body.append(wrap);
  let selected = null;
  function render() {
    const k = C[lang()], cfg = M.config(), list = M.list();
    if (!selected && list[0]) selected = list[0].id;
    const cur = list.find(x => x.id === selected);
    const preview = cur ? E.emailContent(cur.event) : null;
    wrap.innerHTML = `<div class="mp" role="dialog" aria-modal="true" aria-labelledby="mpT">
      <div class="mp-head"><b class="h3" id="mpT">${k.title}</b><button type="button" class="mp-x" data-act="close" aria-label="${k.close}">×</button></div>
      <div class="mp-body">
        <form class="mp-cfg" id="mpForm">
          <label class="field"><span>${k.to}</span><input id="mpTo" type="text" value="${esc(cfg.to)}" autocomplete="off"></label>
          <fieldset class="field"><legend>${k.when}</legend>
            ${['request', 'auto', 'forward'].map(x => `<label class="mp-check"><input type="checkbox" name="mpOn" value="${x}" ${cfg.on[x] ? 'checked' : ''}> ${k[x]}</label>`).join('')}
            <label class="mp-check off"><input type="checkbox" checked disabled> ${k.stale}</label>
          </fieldset>
          <div class="row gap"><button class="btn small main" type="submit">${k.save}</button><span class="fine" id="mpSaved" role="status"></span></div>
          <p class="fine">${k.note}</p>
        </form>
        <div class="mp-log">
          <div class="row between"><b>${k.sent} · ${list.length}</b>${list.length ? `<button type="button" class="linkbtn" data-act="clear">${k.clear}</button>` : ''}</div>
          ${list.length ? `<ul>${list.map(x => `<li><button type="button" class="mp-item ${x.id === selected ? 'on' : ''}" data-mail="${x.id}"><b>${esc(E.emailContent(x.event).subject)}</b><span class="fine">${esc(x.to)} · ${time(x.at)}</span></button></li>`).join('')}</ul>` : `<p class="muted">${k.none}</p>`}
          ${preview ? `<p class="fine">${k.preview}</p><div class="mp-preview"><div class="mp-subject">${esc(preview.subject)}</div><iframe title="${k.preview}" sandbox="" srcdoc="${esc(preview.html)}"></iframe></div>` : ''}
        </div>
      </div></div>`;
  }
  function open() { selected = null; render(); wrap.hidden = false; const x = wrap.querySelector('.mp-x'); if (x) x.focus(); }
  wrap.addEventListener('click', e => {
    if (e.target === wrap) { wrap.hidden = true; return; }
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.act === 'close') wrap.hidden = true;
    if (b.dataset.act === 'clear') { M.clear(); selected = null; render(); }
    if (b.dataset.mail) { selected = b.dataset.mail; render(); }
  });
  wrap.addEventListener('submit', e => {
    e.preventDefault();
    const on = {}; wrap.querySelectorAll('input[name="mpOn"]').forEach(i => { on[i.value] = i.checked; });
    M.saveConfig({ to: wrap.querySelector('#mpTo').value.trim(), on }); render();
    wrap.querySelector('#mpSaved').textContent = C[lang()].saved;
  });
  wrap.addEventListener('keydown', e => { if (e.key === 'Escape') wrap.hidden = true; });
  addEventListener('storage', e => { if (e.key === M.KEY && !wrap.hidden) render(); });
  window.MailPanel = { open, label: () => C[lang()].btn + ' · ' + M.list().length };
})();
