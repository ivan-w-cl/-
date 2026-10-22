'use strict';
// JSON-file session store. Single process, writes are serialised and atomic (tmp file + rename).
const fs = require('fs'), path = require('path'), crypto = require('crypto');

class Store {
  constructor(file) {
    this.file = file; this.data = { sessions: {} }; this.queue = Promise.resolve();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    try { this.data = JSON.parse(fs.readFileSync(file, 'utf8')); if (!this.data.sessions) this.data.sessions = {}; } catch (_) {}
  }
  save() {
    const json = JSON.stringify(this.data, null, 1);
    this.queue = this.queue.then(() => new Promise(res => {
      const tmp = this.file + '.tmp';
      fs.writeFile(tmp, json, err => { if (err) { console.error('[store] write failed', err); return res(); } fs.rename(tmp, this.file, () => res()); });
    }));
    return this.queue;
  }
  createSession({ channel = 'web', nickname = '', context = {}, externalId = '' }) {
    const id = 'c_' + Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
    const token = crypto.randomBytes(18).toString('base64url');
    const now = new Date().toISOString();
    const s = { id, token, channel, externalId, nickname: String(nickname).slice(0, 40), context, status: 'pending', createdAt: now, updatedAt: now, lastStudentAt: now, messages: [] };
    this.data.sessions[id] = s; this.save(); return s;
  }
  get(id) { return this.data.sessions[id] || null; }
  findByExternal(channel, externalId) { return Object.values(this.data.sessions).find(s => s.channel === channel && s.externalId === externalId && s.status !== 'done') || null; }
  addMessage(id, msg) {
    const s = this.get(id); if (!s) return null;
    const m = { id: 'm_' + crypto.randomBytes(5).toString('hex'), at: new Date().toISOString(), ...msg };
    s.messages.push(m); s.updatedAt = m.at;
    if (msg.from === 'student') { s.lastStudentAt = m.at; if (s.status === 'done') s.status = 'pending'; }
    if (msg.from === 'staff' && s.status === 'pending') s.status = 'replied';
    this.save(); return m;
  }
  setStatus(id, status) { const s = this.get(id); if (!s) return null; s.status = status; s.updatedAt = new Date().toISOString(); this.save(); return s; }
  list() { return Object.values(this.data.sessions).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }
}
module.exports = { Store };
