/*
 * L07.S05 · Bring a Sidetrack Back to the Task. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Noah's sign question is an authored side topic shown as an exact quote card (no picture of a real sign). Its link to
 * the two aims is drawn as an open, dashed relation with question marks, never as an irrelevance verdict or a trait.
 * The names-on-paper idea sits inside a "Hypothetical connection" frame; d003 is a separately headed alternative from the
 * reset baseline. The 20 minutes appears only on the welcome-activity frame, never on the discussion.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    task: R(150, 420, 700, 110, 30), topic: R(1070, 420, 700, 110, 30),
    caseB: R(150, 290, 460, 50, 24), reset: R(630, 290, 620, 50, 24), prompt: R(150, 370, 1620, 190, 30), need: R(150, 620, 760, 84, 28), status: R(1010, 620, 760, 84, 26),
    sCase: R(1140, 150, 690, 50, 24), sTs: R(1140, 214, 690, 50, 22), sQuote: R(1140, 278, 690, 110, 26),
    quoteC: R(560, 300, 800, 100, 28), aM: R(150, 560, 760, 76, 26), aF: R(1010, 560, 760, 76, 26), cStat: R(560, 680, 800, 56, 26),
    sQ2: R(1140, 214, 690, 110, 26), sLink: R(1140, 340, 690, 84, 26),
    qLink: R(560, 300, 800, 84, 28), relOpen: R(150, 440, 760, 100, 28), noLink: R(1010, 440, 760, 100, 28), ref: R(560, 590, 800, 56, 26),
    hF: R(150, 300, 1100, 300), hH: R(190, 316, 560, 50, 24), names: R(190, 400, 1020, 90, 28), pp: R(190, 510, 1020, 50, 22), dist: R(1290, 400, 480, 120, 28),
    cond: R(150, 320, 760, 50, 24), quoteL: R(150, 400, 760, 110, 28), nextR: R(1010, 400, 760, 110, 28),
    mStat: R(1140, 150, 690, 50, 22), mRet: R(1140, 340, 690, 84, 26),
    vague: R(150, 420, 560, 100, 32), spec: R(860, 420, 910, 100, 28),
    actF: R(150, 320, 760, 330), actH: R(190, 336, 560, 50, 24), tScope: R(190, 420, 680, 66, 26), discF: R(1010, 320, 760, 330), discH: R(1050, 336, 560, 50, 24), tNot: R(1050, 420, 680, 66, 26),
    rr: R(150, 290, 760, 50, 24), rQuote: R(150, 370, 760, 110, 28), rM: R(150, 520, 760, 76, 26), rF: R(150, 616, 760, 76, 26), blank: R(1010, 370, 760, 400, 30),
    rt: R(150, 420, 760, 100, 30), ro: R(1010, 420, 760, 100, 30), needE: R(560, 580, 800, 84, 28)
  };

  function setup(E, ctx) {
    const K = global.L07Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('hF', G.hF, 'ctx frame', '', 'token.default'); tok('actF', G.actF, 'ctx frame', '', 'token.default'); tok('discF', G.discF, 'ctx frame', '', 'token.default');
    tok('blank', G.blank, 'note', '', 'token.note'); // containers first
    tok('need', G.task, 'goal', L('decision.need'), 'token.step'); tok('topic', G.topic, 'step', L('x.newTopic'), 'token.step');
    tok('caseL', G.caseB, 'framehead', L('x.caseLabel'), 'token.frame'); tok('reset', G.reset, 'framehead', L('excerpt.reset'), 'token.frame');
    tok('prompt', G.prompt, 'example', L('prompt.exact'), 'token.quoteLong', { tag: 'x.ref' }); tok('status', G.status, 'chipcard margin', L('decision.status'), 'token.chip');
    tok('ts', G.sTs, 'framehead', L('topic.status'), 'token.frame'); tok('quote', G.sQuote, 'excerpt', L('topic.quote'), 'token.step');
    tok('aM', G.aM, 'goal', L('x.aim.meet'), 'token.step'); tok('aF', G.aF, 'goal', L('x.aim.find'), 'token.step'); tok('cStat', G.cStat, 'chipcard margin', L('connection.status'), 'token.chip');
    tok('qLink', G.sLink, 'question', L('question.link'), 'token.question');
    tok('relOpen', G.relOpen, 'proposal', L('relevance.open'), 'token.step'); tok('noLink', G.noLink, 'step gap', L('x.noLink'), 'token.step'); tok('ref', G.ref, 'chipcard margin', L('relevance.reference'), 'token.chip');
    tok('hH', G.hH, 'framehead', L('hypothetical.label'), 'token.frame'); tok('names', G.names, 'question', L('hypothetical.names'), 'token.question'); tok('pp', G.pp, 'hint', L('x.paperPens'), 'token.hint');
    tok('dist', G.dist, 'step gap', L('topic.distinction'), 'token.step');
    tok('cond', G.cond, 'framehead', L('redirect.condition'), 'token.frame'); tok('nextR', G.nextR, 'proposal', L('redirect.next'), 'token.step');
    tok('mStat', G.mStat, 'framehead', L('model.status'), 'token.frame'); tok('mRet', G.mRet, 'idea', L('model.return'), 'token.idea');
    tok('vague', G.vague, 'step gap', L('contrast.vague'), 'token.step'); tok('spec', G.spec, 'question', L('contrast.specific'), 'token.question');
    tok('actH', G.actH, 'framehead', L('x.activity'), 'token.frame'); tok('tScope', G.tScope, 'chipcard', L('time.scope'), 'token.chip');
    tok('discH', G.discH, 'framehead', L('x.discussion'), 'token.frame'); tok('tNot', G.tNot, 'chipcard margin', L('time.not'), 'token.chip');
    tok('rr', G.rr, 'framehead', L('reflection.reset'), 'token.frame');
    tok('rt', G.rt, 'idea', L('review.task'), 'token.idea'); tok('ro', G.ro, 'proposal', L('review.open'), 'token.step');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('link'); Rx.dline(E, l, 'link.a', 'M 858 475 L 1062 475', '#B9C5D6'); Rx.qmark(E, l, 'link.q', 960, 448);
    l = ly('cn'); Rx.dline(E, l, 'cn.a', 'M 900 404 C 900 480, 530 470, 530 552', '#B9C5D6'); Rx.dline(E, l, 'cn.b', 'M 1020 404 C 1020 480, 1390 470, 1390 552', '#B9C5D6');
    Rx.qmark(E, l, 'cn.q1', 690, 480); Rx.qmark(E, l, 'cn.q2', 1230, 480);
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L07.S05.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: the task and a new-topic card; their relation open ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('need', at('s5_drift') + 0.4, G.task); S.rise('topic', at('s5_before'), G.topic);
    S.addLayer('link', a('c001') - 0.2); S.title(a('c001') + 0.4, 'relevance.check');
    // ---- c002: explicit reset; the exact prompt as a reference; nothing chosen ----
    let t = X0('c002'); S.title(t, null); X.clearAll(t); S.dropLayer('link', t);
    S.rise('caseL', at('s5_fresh'), G.caseB); S.rise('reset', at('s5_fresh') + 0.2, G.reset); S.rise('prompt', at('s5_still'), G.prompt);
    S.rise('need', at('s5_still') + 0.8, G.need); S.rise('status', at('s5_none'), G.status);
    // ---- d001 · Noah's authored side-topic question ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t, ['caseL']); S.to('caseL', t + 0.1, G.sCase); S.rise('ts', t + 0.3, G.sTs);
    X.line('d001', 'ask:learner', ['Which lettering style would be better?'], { headFirst: true }); S.rise('quote', a('d001') + 0.6, G.sQuote);
    // ---- c003 + h101: the quote and the two aims; the connection left unfilled ----
    t = X0('c003'); X.roomOut(t); S.head(t + 0.1, B(1), null); S.hide(['ts', 'caseL'], t); S.to('quote', t + 0.2, G.quoteC);
    S.rise('aM', at('s5_notHeard') - 0.3, G.aM); S.rise('aF', at('s5_notHeard'), G.aF); S.addLayer('cn', at('s5_notHeard') + 0.5);
    S.rise('cStat', a('c003') - 0.3, G.cStat); S.title(a('c003') + 0.6, 'connection.question');
    X.hold('h101');
    // ---- B02 · d002 · a relevance question about the content ----
    t = X0('d002'); S.head(t, null, null); S.title(t, null); X.clearAll(t); S.dropLayer('cn', t);
    S.rise('caseL', t + 0.3, G.sCase); S.rise('quote', t + 0.4, G.sQ2);
    X.line('d002', 'ask:noah', ['help new members meet'], { headFirst: true }); S.rise('qLink', a('d002') + 0.6, G.sLink);
    // ---- c004: a possible relation and an absent one, against the task ----
    t = X0('c004'); X.roomOut(t); S.head(t + 0.1, B(2), null); S.hide(['caseL', 'quote'], t); S.to('qLink', t + 0.2, G.qLink);
    S.rise('relOpen', a('c004'), G.relOpen); S.rise('noLink', at('s5_without'), G.noLink); S.rise('ref', at('s5_keep'), G.ref);
    // ---- c005: a hypothetical task-related design question; sign redesign kept separate ----
    t = X0('c005'); X.clearAll(t);
    S.rise('hF', at('s5_example'), G.hF); S.rise('hH', at('s5_example') + 0.2, G.hH); S.rise('names', at('s5_example') + 0.6, G.names); S.rise('pp', at('s5_example') + 1.0, G.pp);
    S.rise('dist', at('s5_redesign'), G.dist);
    // ---- c006: alternative example from the reset baseline; a return to an unresolved question ----
    t = X0('c006'); X.clearAll(t);
    S.rise('cond', at('s5_alt'), G.cond); S.rise('quote', at('s5_alt') + 0.3, G.quoteL); S.rise('nextR', a('c006') + 1.0, G.nextR);
    // ---- B03 · d003 · the specific return, under the persisting alternative heading ----
    t = X0('d003'); S.head(t, null, null); X.clearAll(t);
    S.rise('mStat', t + 0.3, G.mStat); S.rise('quote', t + 0.4, G.sQ2);
    X.line('d003', 'ask:noah', ['We still need that link'], { headFirst: true }); S.rise('mRet', a('d003') + 0.4, G.mRet);
    // ---- c007: vague "Focus" versus the precise unresolved question ----
    t = X0('c007'); X.roomOut(t); S.head(t + 0.1, B(3), null); X.clearAll(t);
    S.rise('spec', at('s5_specific') + 0.5, G.spec); S.rise('vague', at('s5_simply'), G.vague);
    // ---- c008: 20 minutes belongs to the activity frame only ----
    t = X0('c008'); X.clearAll(t);
    S.rise('actF', at('s5_remember'), G.actF); S.rise('actH', at('s5_remember') + 0.2, G.actH); S.rise('tScope', at('s5_limits'), G.tScope);
    S.rise('discF', a('c008') - 0.4, G.discF); S.rise('discH', a('c008') - 0.2, G.discH); S.rise('tNot', a('c008') + 0.4, G.tNot);
    // ---- B04 · c009 + h102: back to the baseline after the lettering question; a blank private area ----
    t = X0('c009'); S.head(t, B(4), null); X.clearAll(t);
    S.rise('rr', at('s5_return'), G.rr); S.rise('quote', at('s5_return') + 0.3, G.rQuote); S.rise('aM', at('s5_return') + 0.5, G.rM); S.rise('aF', at('s5_return') + 0.6, G.rF);
    S.rise('blank', at('s5_choose'), G.blank, { text: '' }); S.title(at('s5_choose') + 0.3, 'reflection.prompt');
    X.hold('h102');
    // ---- c010: close on the task relationship ----
    t = X0('c010'); S.title(t, null); X.clearAll(t);
    S.rise('rt', at('s5_check'), G.rt); S.rise('ro', at('s5_creative'), G.ro); S.rise('need', a('c010') + 0.4, G.needE);
  }
  global.L07Scenes = { setup };
})(window);
