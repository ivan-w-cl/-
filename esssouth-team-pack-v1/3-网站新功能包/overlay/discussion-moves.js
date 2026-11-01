/* Shared discussion language: the one list of discussion moves used by lesson section cards, AI practice
   feedback, the mock prep card and the teacher's review card. Plain data, loaded by the website and by lesson pages.

   Course team: to connect a lesson, add it to LESSONS (lessonId as in course-data.js, one entry per section with
   the move ids it teaches) and set `lesson` on each move it teaches. Moves without a lesson show "对应课程待录入".
   Only Lesson 01 is connected; its section → move mapping is a first draft for the course team to confirm. */
(function (root) {
  'use strict';

  const MOVES = [
    { id: 'task', name: '看清共同任务', en: 'Clarify the task',
      what: '开口前先确认大家要一起完成什么，避免各说各的。',
      example: 'So our task is to choose one plan for the class trip, right?',
      lesson: { id: 'L01', section: 's02' },
      cue: /\b(our task|we need to (decide|choose|agree)|the (goal|question) is|we have to (decide|choose))\b/i },
    { id: 'propose', name: '提出具体建议', en: 'Make a concrete proposal',
      what: '给出一个具体做法，让讨论有东西可以推进。',
      example: 'What if we keep phones in lockers during lessons?',
      lesson: { id: 'L01', section: 's03' },
      cue: /\b(what if|how about|maybe we (could|can)|i suggest|let'?s|we could)\b/i },
    { id: 'build', name: '接住别人的话', en: 'Build on a point',
      what: '先回应上一位同学说的，再加上自己的内容。',
      example: 'I agree with Mia, because many students check messages in class.',
      lesson: { id: 'L01', section: 's04' },
      cue: /\b(i (partly )?agree with|as \w+ said|building on|to add to|that'?s a good point|i see your point)\b/i },
    { id: 'ask', name: '追问澄清', en: 'Ask to clarify',
      what: '没听懂或意思不确定时，请对方说具体一点。',
      example: 'When you say "clear rules", what kind of rules do you mean?',
      lesson: { id: 'L01', section: 's04' },
      cue: /\b(what do you mean|could you explain|when you say|do you mean|why do you think)\b/i },
    { id: 'invite', name: '邀请发言', en: 'Invite a contribution',
      what: '给还没说话的同学一个可以接、也可以不接的机会。',
      example: "Sam, what do you think? It's fine to pass.",
      lesson: { id: 'L01', section: 's05' },
      cue: /\b(what do you think|how about you|what about you|would you like to|any thoughts)\b/i },
    { id: 'adjust', name: '条件变化后调整方案', en: 'Adjust the plan',
      what: '出现新限制时，保留目标，只改具体安排。',
      example: 'If the hall is not free, we could keep the talk and move it online.',
      lesson: { id: 'L01', section: 's06' },
      cue: /\b(in that case|instead|then we could|we could change|if .{3,40}, (then )?we)\b/i },
    { id: 'reason', name: '观点加理由', en: 'Give a reason',
      what: '说出立场后，马上补一句为什么。',
      example: 'I think phones should be allowed, because parents may need to reach us.',
      lesson: null,
      cue: /\b(because|since|the reason is)\b/i },
    { id: 'summary', name: '忠实总结', en: 'Summarise faithfully',
      what: '说清楚谁支持了什么、带着什么条件、还剩什么没定。',
      example: 'So we have support for rules in class; the emergency question is still open.',
      lesson: null,
      cue: /\b(so we have|to sum up|so far we|in summary|still open)\b/i },
  ];

  /* Things the practice feedback flags as "可以再试", each pointing at the move that fixes it. */
  const SLIPS = [
    { id: 'overclaim', name: '把部分同意说成全体同意', fix: 'summary',
      cue: /\b(we all agree|everyone agrees|all of us agree|we all think)\b/i,
      why: '其他人可能只是有条件地支持，或还没表态。总结时说清楚谁同意了哪一部分。' },
    { id: 'noreason', name: '只有观点，没有理由', fix: 'reason',
      test: t => /\b(i think|i believe|in my opinion)\b/i.test(t) && !/\b(because|since|so that|the reason)\b/i.test(t),
      why: '说出立场后补一句为什么，别人才接得上。' },
  ];

  const LESSONS = [
    { id: 'L01', title: '看懂小组讨论，找到自己的参与方式', href: '/lessons/lesson01/index.html',
      sections: [
        { id: 's01', title: '先看一场讨论', moves: [] },
        { id: 's02', title: '看清共同任务', moves: ['task'] },
        { id: 's03', title: '判断一句话的作用', moves: ['propose'] },
        { id: 's04', title: '接住别人的话', moves: ['build', 'ask'] },
        { id: 's05', title: '找到不同的参与方式', moves: ['invite'] },
        { id: 's06', title: '条件变化后，调整方案', moves: ['adjust'] },
        { id: 's07', title: '回看自己的参与方式', moves: [] },
      ] },
    // { id: 'L02', title: '…', href: '/lessons/lesson02/index.html', sections: [{ id: 's01', title: '…', moves: [] }, …] },
  ];

  /* 5-minute drills, one per move. Sample practice content written for the website, not taken from the lessons.
     `need`: at least one must match; `avoid`: flagged if matched. Rules here only demonstrate the feedback shape. */
  const DRILLS = {
    task: { context: [['Leo', 'We could do a sports day.'], ['Mia', 'Or a trip to the science museum.']],
      prompt: '两个人直接开始提方案了。用一句英文，先确认大家要一起决定的是什么。',
      need: [/\b(task|decide|choose|goal|question)\b/i], avoid: [], sample: 'Before we choose, is our task to pick one activity for the whole class?' },
    propose: { context: [['Mia', 'Phones are a problem in class.'], ['Sam', 'Yes, but banning them is too strict.']],
      prompt: '大家都在说问题，没人给办法。用一句英文提出一个具体做法。',
      need: [/\b(what if|how about|we could|let'?s|i suggest|maybe we)\b/i], avoid: [], sample: 'What if we keep phones in lockers during lessons and use them at lunch?' },
    build: { context: [['Mia', 'I think phones are a big distraction in class.']],
      prompt: '用一句英文回应 Mia：先接住她的话，再加上你的内容。',
      need: [/\b(agree|mia|as you said|your point|good point)\b/i], avoid: [], sample: 'I agree with Mia, and I would add that teachers spend time asking students to put them away.' },
    ask: { context: [['Leo', 'Phones should be allowed, but with clear rules.']],
      prompt: '"clear rules" 是什么规则还不清楚。用一句英文请 Leo 说具体一点。',
      need: [/\b(what do you mean|could you|when you say|what kind|for example|do you mean)\b/i], avoid: [], sample: 'When you say clear rules, what kind of rules do you mean?' },
    invite: { context: [['Leo', 'So lockers could work.'], ['Mia', 'I like that idea too.'], ['(Sam 还没说话)', '']],
      prompt: 'Sam 一直没有开口。用一句英文邀请他，同时让他可以不接。',
      need: [/\bsam\b/i], avoid: [/\byou must\b|\byou have to\b/i], sample: "Sam, what do you think? It's fine if you want to hear more first." },
    adjust: { context: [['Teacher', 'Update: the school hall is not available on Friday.'], ['Leo', 'Then our plan is ruined.']],
      prompt: '条件变了。用一句英文保留目标，只调整具体安排。',
      need: [/\b(instead|could|move|change|still|keep)\b/i], avoid: [/\bcancel\b/i], sample: 'We can still hold the talk; we could move it to the library instead.' },
    reason: { context: [['Leo', 'Should students bring phones to school?']],
      prompt: '用一两句英文说出你的立场，并马上补一个理由。',
      need: [/\b(because|since|the reason)\b/i], avoid: [], sample: 'I think students should bring phones, because parents may need to reach them after school.' },
    summary: { context: [['Leo', 'I support phones, but only with clear rules.'], ['Sam', 'Lockers during lessons could be one rule.'], ['Mia', 'I am not sure about emergencies yet.']],
      prompt: '用一两句英文总结：保留每个人的条件，把还没定的事单独说出来。',
      need: [/\b(rules?|lockers?)\b/i, /\b(open|not sure|not decided|still|yet)\b/i], avoid: [/\b(we all agree|everyone agrees)\b/i],
      sample: 'So Leo supports phones with clear rules, Sam suggested lockers during lessons, and emergencies are still open.' },
  };

  const byId = Object.fromEntries(MOVES.map(m => [m.id, m]));
  const lessonOf = id => LESSONS.find(l => l.id === id) || null;
  function sectionOf(move) {
    const m = byId[move]; if (!m || !m.lesson) return null;
    const L = lessonOf(m.lesson.id); if (!L) return null;
    const i = L.sections.findIndex(s => s.id === m.lesson.section); if (i < 0) return null;
    return { lesson: L, section: L.sections[i], number: i + 1, href: `${L.href}?mode=watch&chapter=${L.sections[i].id}` };
  }

  /* Demo tagger for one student turn. Production: the AI returns the same move ids for each turn. */
  function tag(text) {
    const t = String(text || '');
    return {
      moves: MOVES.filter(m => m.cue.test(t)).map(m => m.id),
      slips: SLIPS.filter(s => (s.cue ? s.cue.test(t) : s.test(t))).map(s => s.id),
    };
  }

  function checkDrill(move, text) {
    const d = DRILLS[move], t = String(text || '').trim();
    if (!d || !t) return null;
    const words = t.split(/\s+/).filter(Boolean).length;
    return {
      met: d.need.every(re => re.test(t)),
      slipped: d.avoid.some(re => re.test(t)),
      tooShort: words < 5,
      tagged: tag(t),
    };
  }

  root.ZPMoves = { MOVES, SLIPS, LESSONS, DRILLS, byId, slip: id => SLIPS.find(s => s.id === id), lessonOf, sectionOf, tag, checkDrill };
})(typeof window !== 'undefined' ? window : globalThis);
