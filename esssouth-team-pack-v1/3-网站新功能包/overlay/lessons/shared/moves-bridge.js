/* Lesson page → discussion language. Shows the moves a section teaches under the player, and a
   "本节学到的讨论动作" card when a section ends, with a link to the 5-minute drill on the website.
   Needs /discussion-moves.js and the lesson's course-data.js (lessonId, chapters). Reads course events only;
   it never sends commands to the player. Sections without moves in discussion-moves.js show nothing. */
(function () {
  'use strict';
  const M = window.ZPMoves, D = window.ESSSOUTH_COURSE;
  if (!M || !D) return;
  const L = M.lessonOf(D.lessonId); if (!L) return;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const movesOf = id => ((L.sections.find(s => s.id === id) || {}).moves || []).filter(m => M.byId[m]);
  const below = document.querySelector('.below');
  const strip = document.createElement('div'); strip.className = 'mb-strip'; strip.setAttribute('aria-label', '本节讨论动作');
  const end = document.createElement('section'); end.className = 'mb-end'; end.hidden = true; end.setAttribute('aria-live', 'polite');
  if (below) below.after(strip, end); else document.querySelector('main').append(strip, end);
  let shown = '';

  function current() {
    const st = window.__esssouthCourse && window.__esssouthCourse.getState && window.__esssouthCourse.getState();
    return st && st.chapter;
  }
  function drawStrip(id) {
    if (id === shown) return; shown = id;
    const m = movesOf(id);
    strip.hidden = !m.length;
    strip.innerHTML = m.length ? `<span>本节讨论动作</span>${m.map(x => `<span class="mb-chip">${esc(M.byId[x].name)}</span>`).join('')}<a href="/#moves">讨论语言</a>` : '';
  }
  function drawEnd(id) {
    const m = movesOf(id); if (!m.length) return;
    const s = L.sections.find(x => x.id === id);
    end.innerHTML = `<h3>本节学到的讨论动作 · ${esc(s.title)}</h3>
      <p>${m.map(x => esc(M.byId[x].what)).join(' ')}</p>
      <div class="mb-row">${m.map(x => `<a class="mb-go" href="/#drill-${x}">马上练「${esc(M.byId[x].name)}」· 5 分钟</a>`).join('')}<button class="mb-close" type="button">继续看课</button></div>`;
    end.hidden = false;
    end.querySelector('.mb-close').addEventListener('click', () => { end.hidden = true; });
  }
  addEventListener('message', e => {
    const d = e.data; if (!d || typeof d.channel !== 'string' || !/course-v1$/.test(d.channel)) return;
    if (d.type === 'ended' && d.chapter) drawEnd(d.chapter);
    setTimeout(() => drawStrip(current() || d.chapter), 0);
  });
  setInterval(() => { const c = current(); if (c && c !== shown) { drawStrip(c); end.hidden = true; } }, 1000);
  drawStrip(current() || (new URLSearchParams(location.search).get('chapter')) || L.sections[0].id);
})();
