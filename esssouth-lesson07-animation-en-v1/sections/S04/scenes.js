/*
 * L07.S04 · Invite a Contribution Without Pressure. Section adapter (tokens, rects, timing by cue starts and anchors).
 * A fresh comparison excerpt: F04 and F05 are shown as earlier, unadopted proposal cards (not new speech). The only
 * observable fact about Maya is "No comparison comment yet"; no motive, trait or meter is drawn. Contribute / pass /
 * come in later are equal neutral choices; Maya's pass is accepted and nothing is inferred or added to the timeline.
 * c009 returns explicitly to the moment before the invitation; private areas stay blank.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C3 = [150, 700, 1250];
  const G = {
    qH: R(150, 400, 1620, 44, 28), qBox: R(150, 456, 1620, 190, 30), ob: [R(150, 680, 760, 70, 26), R(1010, 680, 760, 70, 26)],
    caseB: R(150, 290, 460, 50, 24), reset: R(630, 290, 620, 50, 24), pM: R(150, 370, 760, 110, 28), pN: R(1010, 370, 760, 110, 28),
    status: R(560, 546, 800, 56, 26), obs: R(560, 632, 800, 76, 28),
    prompt: R(150, 370, 1620, 190, 30), gM: R(150, 610, 760, 76, 26), gG: R(1010, 610, 760, 76, 26), obsT: R(150, 716, 760, 76, 26), focus: R(1010, 716, 760, 76, 26),
    o1: R(150, 400, 760, 100, 30), o2: R(1010, 400, 760, 100, 30), ch: C3.map((x) => R(x, 580, 520, 76, 28)),
    sCase: R(1140, 150, 690, 50, 24), sM: R(1140, 214, 690, 84, 26), sN: R(1140, 308, 690, 110, 26), sG: R(1140, 428, 690, 60, 26),
    sInv: R(1140, 500, 690, 50, 22), sPass: R(1140, 560, 690, 60, 26), sAck: R(1140, 630, 690, 60, 26),
    bM: R(150, 330, 760, 110, 28), bN: R(1010, 330, 760, 110, 28), bStatus: R(560, 470, 800, 56, 26), resp: R(150, 560, 760, 90, 28), mean: R(1010, 560, 760, 90, 28),
    illus: R(150, 330, 620, 50, 24), lead: R(150, 400, 760, 100, 30), open: R(1010, 400, 760, 100, 30), want: R(150, 530, 760, 76, 26), room: R(1010, 530, 760, 76, 26),
    spH: R(150, 330, 1100, 44, 26), space: R(150, 386, 1100, 300, 30), later: R(1290, 386, 480, 110, 26), limit: R(150, 704, 1100, 60, 26),
    brief: R(150, 380, 500, 84, 26), longer: R(700, 380, 1070, 180, 28), pc: R(150, 620, 760, 66, 26), pn: R(1010, 620, 760, 66, 26),
    rReset: R(150, 290, 620, 50, 24), rM: R(150, 370, 760, 110, 28), rN: R(150, 520, 760, 110, 28), rObs: R(150, 680, 760, 76, 26), blank: R(1010, 370, 760, 386, 30),
    rf: R(150, 420, 760, 100, 30), rc: R(1010, 420, 760, 100, 30)
  };

  function setup(E, ctx) {
    const K = global.L07Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('qBox', G.qBox, 'note', '', 'token.note'); tok('space', G.space, 'note', '', 'token.note'); tok('blank', G.blank, 'note', '', 'token.note'); // containers first
    tok('qH', G.qH, 'colhead', L('x.curQ'), 'token.colhead'); tok('ob0', G.ob[0], 'question', L('x.obs1'), 'token.question'); tok('ob1', G.ob[1], 'question', L('x.obs2'), 'token.question');
    tok('caseL', G.caseB, 'framehead', L('x.caseLabel'), 'token.frame'); tok('reset', G.reset, 'framehead', L('excerpt.reset'), 'token.frame');
    tok('pM', G.pM, 'proposal', L('proposal.maya'), 'token.step', { tag: 'x.prior' }); tok('pN', G.pN, 'proposal', L('proposal.noah'), 'token.step', { tag: 'x.prior' });
    tok('status', G.status, 'chipcard margin', L('comparison.status'), 'token.chip'); tok('obs', G.obs, 'fact', L('maya.observable'), 'token.step');
    tok('prompt', G.prompt, 'example', L('prompt.exact'), 'token.quoteLong', { tag: 'x.ref' });
    tok('gM', G.gM, 'question', L('goal.meet'), 'token.question'); tok('gG', G.gG, 'question', L('goal.group'), 'token.question');
    tok('focus', G.focus, 'chipcard margin', L('invitation.focus'), 'token.chip');
    tok('o1', G.o1, 'step plan', L('x.open'), 'token.step'); tok('o2', G.o2, 'step plan', L('x.named'), 'token.step');
    ['x.c.contrib', 'x.c.pass', 'x.c.later'].forEach((k, i) => tok('ch' + i, G.ch[i], 'step plan', L(k), 'token.step'));
    tok('inv', G.sInv, 'framehead', L('model.invitation'), 'token.frame'); tok('pass', G.sPass, 'step', L('model.pass'), 'token.step'); tok('ack', G.sAck, 'idea', L('model.acknowledge'), 'token.idea');
    tok('resp', G.resp, 'idea', L('pass.response'), 'token.idea'); tok('mean', G.mean, 'step gap', L('pass.meaning'), 'token.step');
    tok('illus', G.illus, 'framehead', L('x.illus'), 'token.frame'); tok('lead', G.lead, 'step changed', L('contrast.leading'), 'token.step'); tok('open', G.open, 'question', L('contrast.open'), 'token.question');
    tok('want', G.want, 'step gap', L('x.want'), 'token.step'); tok('roomC', G.room, 'step', L('x.room'), 'token.step');
    tok('spH', G.spH, 'colhead', L('participation.space'), 'token.colhead'); tok('later', G.later, 'proposal', L('x.later'), 'token.step'); tok('limit', G.limit, 'chipcard margin', L('participation.limit'), 'token.chip');
    tok('brief', G.brief, 'step', L('x.brief'), 'token.step'); tok('longer', G.longer, 'step', L('x.longer'), 'token.step');
    tok('pc', G.pc, 'chipcard', L('participation.check'), 'token.chip'); tok('pn', G.pn, 'chipcard margin', L('participation.not'), 'token.chip');
    tok('rReset', G.rReset, 'framehead', L('reflection.reset'), 'token.frame');
    tok('rf', G.rf, 'question', L('review.focus'), 'token.question'); tok('rc', G.rc, 'question', L('review.choice'), 'token.question');
    K.finishTokens();
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L07.S04.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a formal comparison board with an empty current-question space ----
    S.head(X0('c001') + 0.1, B(1), null); S.title(at('s4_inv') + 0.6, 'invitation.purpose');
    S.rise('qH', at('s4_start') - 0.4, G.qH); S.rise('qBox', at('s4_start') - 0.2, G.qBox, { text: '' });
    S.rise('ob0', a('c001') + 0.8, G.ob[0]); S.rise('ob1', a('c001') + 1.2, G.ob[1]);
    // ---- c002: explicit reset; F04/F05 as earlier proposal cards; one observable fact about Maya ----
    let t = X0('c002'); S.title(t, null); X.clearAll(t);
    S.rise('caseL', at('s4_fresh'), G.caseB); S.rise('reset', at('s4_fresh') + 0.2, G.reset);
    S.rise('pM', at('s4_both') - 0.6, G.pM); S.rise('pN', at('s4_both') - 0.3, G.pN); S.rise('status', at('s4_neither'), G.status); S.rise('obs', at('s4_notYet'), G.obs);
    // ---- c003 + h101: the exact source prompt as a reference panel; the two aims; the observable statement ----
    t = X0('c003'); S.hide(['pM', 'pN', 'status'], t);
    S.rise('prompt', at('s4_keep'), G.prompt); S.rise('gM', at('s4_meet'), G.gM); S.rise('gG', at('s4_find'), G.gG);
    S.to('obs', t + 0.2, G.obsT); S.rise('focus', at('s4_ask'), G.focus);
    X.hold('h101');
    // ---- B02 · c004: open or named invitation; contribute / pass / later as equal choices ----
    t = X0('c004'); S.head(t, B(2), null); X.clearAll(t);
    S.rise('o1', at('s4_offer'), G.o1); S.rise('o2', at('s4_invite'), G.o2); S.title(at('s4_invite') + 1.2, 'invitation.options');
    ['ch0', 'ch1', 'ch2'].forEach((id, i) => S.rise(id, at('s4_pass') + i * 0.3, G.ch[i])); S.title(a('c004') - 0.3, 'invitation.choice');
    // ---- d001–d003 · the authored invitation, a pass, an acknowledgement ----
    t = X0('d001'); S.head(t, null, null); S.title(t, null); X.clearAll(t);
    S.rise('caseL', t + 0.3, G.sCase); S.rise('pM', t + 0.4, G.sM, { tag: '' }); S.rise('pN', t + 0.5, G.sN, { tag: '' }); S.rise('gG', t + 0.6, G.sG);
    X.line('d001', 'ask:maya', ['how these ideas could connect to the drawing group', 'fine to pass or come in later'], { headFirst: true }); S.rise('inv', a('d001') + 0.4, G.sInv);
    X.line('d002', 'explain:learner', ['listen for now'], {}); S.rise('pass', a('d002') + 0.2, G.sPass);
    X.line('d003', 'explain:maya', ['Of course'], {}); S.rise('ack', a('d003') + 0.2, G.sAck);
    // ---- c005: accept the pass; no position inferred ----
    t = X0('c005'); X.roomOut(t); X.clearAll(t); S.head(t + 0.1, B(2), null);
    S.rise('pM', t + 0.3, G.bM, { tag: '' }); S.rise('pN', t + 0.4, G.bN, { tag: '' }); S.rise('status', t + 0.5, G.bStatus);
    S.rise('resp', at('s4_declined') + 0.8, G.resp); S.rise('mean', at('s4_dont'), G.mean);
    // ---- B03 · c006: a leading question vs an open one (separate illustrative phrases) ----
    t = X0('c006'); S.head(t, B(3), null); X.clearAll(t);
    S.rise('illus', at('s4_hide'), G.illus); S.rise('lead', at('s4_leading'), G.lead); S.rise('want', at('s4_leading') + 1.2, G.want);
    S.rise('open', at('s4_asking'), G.open); S.rise('roomC', a('c006'), G.room);
    // ---- c007: an open discussion space; a later contribution only if offered ----
    t = X0('c007'); X.clearAll(t);
    S.rise('spH', at('s4_give'), G.spH); S.rise('space', at('s4_give') + 0.2, G.space, { text: '' }); S.rise('later', a('c007') - 0.4, G.later); S.rise('limit', at('s4_noRet') + 0.6, G.limit);
    // ---- c008: different-sized contributions; access and relevance, no quota ----
    t = X0('c008'); X.clearAll(t);
    S.rise('pn', at('s4_equal') + 0.6, G.pn); S.rise('brief', at('s4_brief'), G.brief); S.rise('longer', at('s4_another'), G.longer); S.rise('pc', at('s4_stay'), G.pc);
    // ---- B04 · c009 + h102: the moment before the invitation; a blank private area ----
    t = X0('c009'); S.head(t, B(4), null); X.clearAll(t);
    S.rise('rReset', at('s4_return'), G.rReset); S.rise('pM', at('s4_return') + 0.3, G.rM, { tag: 'x.prior' }); S.rise('pN', at('s4_return') + 0.5, G.rN, { tag: 'x.prior' });
    S.rise('obs', at('s4_return') + 0.7, G.rObs); S.rise('blank', at('s4_form'), G.blank, { text: '' }); S.title(at('s4_form') + 0.3, 'reflection.prompt');
    X.hold('h102');
    // ---- c010: optional self-checks; recap ----
    t = X0('c010'); S.title(t, null); X.clearAll(t);
    S.rise('rf', at('s4_check'), G.rf); S.rise('rc', at('s4_check') + 0.8, G.rc); S.title(a('c010') - 0.2, 'recap');
  }
  global.L07Scenes = { setup };
})(window);
