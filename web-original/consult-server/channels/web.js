'use strict';
// "web" channel: the prototype. Staff replies are stored on the session; the student's chat dialog
// polls GET /api/consult/sessions/:id and renders them. Nothing has to be pushed.
module.exports = {
  name: 'web',
  enabled: true,
  // Called by the core after a staff message has been stored. Must not throw for the web channel.
  async deliver(/* session, message, ctx */) { return { ok: true, via: 'poll' }; }
};
