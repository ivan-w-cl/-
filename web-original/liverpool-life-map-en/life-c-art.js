/* Version C characters: one figure + a lifestyle scene + a food prop, drawn in the same ink-and-paper style as life-art.js.
   15 combinations (5 lifestyles x 3 food styles) from about 8 drawn parts. */
(function () {
  'use strict';
  const ink = '#243e35', paper = '#fff9ed', sage = '#b8cbbb', coral = '#df775e', yellow = '#efbd5d', pink = '#e8bccc', blue = '#aac9ce', skin = '#e9b897', darkSkin = '#ba7958';

  const svg = (label, box, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" role="img" aria-label="${label}" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const star = (x, y, color = yellow, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="m0-10 3 7 8 3-8 3-3 8-3-8-7-3 7-3Z" fill="${color}" stroke-width="1.8"/>`;
  const leaf = (x, y, r = 0, color = sage) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 25C-17 16-18-6 0-21 17-7 18 12 0 25Z" fill="${color}"/><path d="M0 27V-10"/></g>`;
  const mug = (x, y, color = yellow, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M10 2c16-5 18 15 1 14" fill="${paper}"/><path d="M-12 0h25v17c-1 11-24 11-25 0Z" fill="${color}"/><path d="M-5-9c-6-6 5-10 0-16m11 16c-6-6 5-10 0-16" stroke-width="1.7"/></g>`;
  const book = (x, y, color = coral, r = 0, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M-23-30h42v57h-41c-8 0-8-10-1-10h42v-47Z" fill="${color}"/><path d="M-23 17v-47m0 47c-8 0-8 10 0 10m3-5h34"/><path d="M-11-17H7m-18 7H3" stroke="${paper}" stroke-width="2.4"/></g>`;
  function face(x, y, s = 1, complexion = skin, hair = 'short') {
    const crown = hair === 'curly'
      ? `<path d="M-27 0c-10-13-2-21 6-22-4-12 9-20 18-13 9-9 23-5 23 5 13-3 23 10 15 21 5 9-2 17-8 19L23-8C12-4 3-14-4-13-12-6-19-5-24-9Z" fill="${ink}"/>`
      : hair === 'long' ? `<path d="M-28 13c-6-26 1-45 24-46 28-4 36 14 32 45l9 24-22 7-44-9Z" fill="${ink}"/>`
      : `<path d="M-26-3c-6-22 9-34 28-31 20-5 32 10 25 35L18-12C6-8 4-19-7-14c-3 10-15 11-19 11Z" fill="${ink}"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${crown}<path d="M-21-10c0-9 9-13 20-13 17 0 23 6 24 20l-2 17C15 34-17 35-23 14l-2-9c-10-1-9-14-1-14Z" fill="${complexion}"/><path d="M-18-12c9 2 13-6 17-10 7 8 16 10 24 7" fill="${ink}" stroke="${ink}"/><path d="M-11 2h.2m20 0h.2" stroke-width="4"/><path d="m1 4-2 7 4 1m-9 8c5 3 10 2 13-1" stroke-width="1.8"/><path d="M-16 12h3m26 0h3" stroke="${coral}" stroke-width="3.5" opacity=".7"/></g>`;
  }
  const base = color => `<path d="M58 178C20 123 53 47 120 47c38-33 125-35 161 7 67-6 109 49 90 109 32 66-19 133-94 131-43 29-122 26-156-2-56 8-94-52-63-114Z" fill="${color}" stroke="none"/><ellipse cx="206" cy="301" rx="143" ry="13" fill="#e4ddc9" stroke="none"/>`;

  /* lifestyle: background scene, figure look, table prop */
  const LIFE = {
    library: {
      bg: '#dfe6d2', top: sage, hair: 'short', tone: darkSkin,
      scene: `<path d="M66 58h76v100H66Z" fill="${paper}"/><path d="M66 91h76m-76 33h76"/>
        <path d="M72 60h8v30h-8Zm10 4h9v26h-9Zm11-2h7v28h-7Zm10 6 8-2 6 24-8 2Zm17-6h9v28h-9Z" fill="${coral}" stroke-width="1.6"/>
        <path d="M72 95h9v28h-9Zm11 3h8v25h-8Zm10-3h10v28H93Zm13 4h8v24h-8Zm11-4h9v28h-9Zm11 2h8v26h-8Z" fill="${yellow}" stroke-width="1.6"/>
        <path d="M74 128h10v28H74Zm12 2h8v26h-8Zm10-2h9v28h-9Zm11 4 9-2 4 26-8 1Zm15-4h9v28h-9Z" fill="${blue}" stroke-width="1.6"/>
        <path d="M262 150V84c0-38 72-38 72 0v66Z" fill="${paper}"/><path d="M298 50v100m-36-40h72"/><path d="M272 100c10-14 22-12 26-2 9-7 22-4 26 6" stroke="${blue}" stroke-width="2"/>`,
      prop: `${book(108, 228, coral, 90, .55)}${book(110, 212, yellow, 90, .5)}`,
      label: 'books and a library window'
    },
    cafe: {
      bg: '#f1e0cb', top: coral, hair: 'long', tone: skin,
      scene: `<path d="M248 66h96l-6 26H254Z" fill="${paper}"/><path d="M252 70l-6 22m22-26-5 26m22-26-3 26m22-26-2 26m22-26 1 26m14-26 4 26" stroke="${coral}" stroke-width="7"/>
        <path d="M262 92v58m72-58v58"/><path d="M272 104h52v34h-52Z" fill="${paper}"/><path d="M286 112h24m-24 10h18" stroke-width="1.8"/>
        <path d="M70 62h62v52H70Z" fill="${ink}"/><path d="M80 76h30m-30 10h40m-40 10h24" stroke="${paper}" stroke-width="2"/><path d="M84 62l17-16 17 16" stroke-width="2"/>
        ${mug(100, 140, paper, .6)}`,
      prop: `${mug(112, 226, yellow, .85)}<path d="M138 246l6-22h40l-4 22Z" fill="${blue}"/>`,
      label: 'a café awning, a menu board and coffee'
    },
    air: {
      bg: '#dcebdc', top: yellow, hair: 'curly', tone: skin,
      scene: `<circle cx="305" cy="78" r="26" fill="${yellow}" stroke="none"/><path d="M305 36v-8m30 24 6-6m4 32h8m-78-26-6-6" stroke="#d4a247"/>
        <path d="M262 132c8-14 26-14 32-2 14-8 30-2 32 12h-64Z" fill="${paper}" stroke="none"/>
        <path d="M100 168v-70" stroke-width="3"/>${leaf(84, 92, -40)}${leaf(116, 86, 38)}${leaf(100, 70, 0, '#9fbf9f')}${leaf(80, 122, -60, '#9fbf9f')}${leaf(120, 118, 60)}
        <path d="M60 170c30-18 70-18 100 0" stroke="#8fae8a" stroke-width="2"/>`,
      prop: `<path d="M100 246v-30c0-6 4-9 8-10v-6h10v6c4 1 8 4 8 10v30Z" fill="${blue}"/><path d="M104 224h18" stroke="${paper}" stroke-width="2"/>`,
      label: 'a tree, the sun and a water bottle'
    },
    culture: {
      bg: '#efdbe2', top: pink, hair: 'long', tone: darkSkin,
      scene: `<path d="M66 62h76v62H66Z" fill="${paper}"/><path d="M72 68h64v50H72Z" fill="${blue}" stroke-width="1.6"/><path d="m74 114 22-26 16 18 10-10 14 18" fill="${sage}" stroke-width="1.8"/><circle cx="122" cy="80" r="6" fill="${yellow}" stroke-width="1.6"/>
        <path d="M282 70v44m0 0c-8-6-20 0-14 8 5 6 14 2 14-8m28-48v40m0 0c-8-6-20 0-14 8 5 6 14 2 14-8m-28-36 28-8" stroke-width="3"/>
        ${star(330, 130, coral, .7)}`,
      prop: `<g transform="rotate(-12 116 232)"><path d="M86 220h62v26H86Z" fill="${yellow}"/><path d="M128 220v26" stroke-dasharray="3 3"/><path d="M94 229h24m-24 8h16" stroke-width="1.8"/></g>`,
      label: 'a framed painting, music notes and a gig ticket'
    },
    night: {
      bg: '#dbe1ea', top: blue, hair: 'short', tone: skin, headphones: true,
      scene: `<path d="M312 54c-22 4-30 32-14 48 12 12 34 10 42-6-18 6-36-16-28-42Z" fill="${yellow}"/>
        ${star(262, 70, paper, .7)}${star(96, 70, yellow, .6)}${star(130, 110, paper, .5)}
        <path d="M58 44c50 26 120 28 170 8 40-16 80-16 120 4" stroke-width="1.6"/>
        <circle cx="86" cy="58" r="6" fill="${yellow}" stroke-width="1.5"/><circle cx="128" cy="66" r="6" fill="${coral}" stroke-width="1.5"/><circle cx="172" cy="66" r="6" fill="${yellow}" stroke-width="1.5"/><circle cx="246" cy="52" r="6" fill="${pink}" stroke-width="1.5"/><circle cx="292" cy="48" r="6" fill="${yellow}" stroke-width="1.5"/>`,
      prop: `<path d="M98 246v-34h30v34Z" fill="${ink}"/><path d="M102 216h22v22h-22Z" fill="${yellow}" stroke-width="1.5"/><path d="M108 228h10" stroke="${ink}" stroke-width="1.5"/>`,
      label: 'string lights, the moon and a glowing phone'
    }
  };

  /* food: the dish on the table */
  const FOOD = {
    cook: { draw: `<ellipse cx="272" cy="238" rx="38" ry="10" fill="${ink}"/><path d="M234 236c0 10 76 10 76 0" fill="${ink}"/><path d="M310 236l32-10" stroke-width="5"/><ellipse cx="266" cy="235" rx="15" ry="6" fill="${paper}" stroke-width="1.8"/><circle cx="268" cy="234" r="4.5" fill="${yellow}" stroke-width="1.5"/><ellipse cx="288" cy="236" rx="7" ry="3.5" fill="${coral}" stroke-width="1.5"/><path d="M262 220c-6-7 6-13 0-20m16 20c-6-7 6-13 0-20" stroke-width="2"/>`, label: 'a frying pan with breakfast' },
    out: { draw: `<path d="M232 218h80c0 22-17 30-40 30s-40-8-40-30Z" fill="${coral}"/><path d="M236 218c8-6 14 4 20-2s12 4 18-2 12 4 18-2 12 4 16 0" stroke="${yellow}" stroke-width="3"/><path d="M286 214l34-36m-24 38 32-34" stroke-width="3"/><circle cx="252" cy="214" r="5" fill="${paper}" stroke-width="1.5"/>`, label: 'a bowl of noodles with chopsticks' },
    takeaway: { draw: `<path d="M244 204h56l-8 44h-40Z" fill="${paper}"/><path d="M244 204l8-14h40l8 14" fill="${paper}"/><circle cx="272" cy="226" r="8" fill="${coral}" stroke-width="1.6"/><path d="M262 190l-14-24m30 24 6-28" stroke-width="3"/><path d="M248 204h48" stroke-width="1.6"/>`, label: 'a takeaway box with chopsticks' }
  };

  function figure(L) {
    const tone = L.tone, top = L.top;
    return `<path d="M158 258v39l-10 7h40l10-46m14 0 6 41 39 5c-2-9-17-10-20-11l-2-35" fill="${ink}"/>
      <path d="M135 184c0-36 13-50 39-53l41 1c28 3 35 26 35 52l-9 85h-96Z" fill="${top}"/>
      <path d="M176 125v20c11 9 25 8 37-1v-19" fill="${tone}"/>
      ${face(194, 95, 1.01, tone, L.hair)}
      ${L.headphones ? `<path d="M162 103V88c0-41 66-40 66 0v15" stroke-width="8"/><path d="M161 95h9v24h-9Zm59 0h10v24h-10Z" fill="${yellow}"/>` : ''}
      <path d="m144 175-8 43 45 11m57-53 9 43-37 13" stroke="${ink}" stroke-width="21"/><path d="m144 175-8 43 45 11m57-53 9 43-37 13" stroke="${top}" stroke-width="16"/>
      <path d="m178 221 14 1c8-5 17 7 7 12l-21-6m35-6-13 3c-11-2-13 12 0 13l16-8" fill="${tone}"/>`;
  }

  function character(life, food, label) {
    const L = LIFE[life] || LIFE.cafe, F = FOOD[food] || FOOD.cook;
    return svg(label || `Hand-drawn student with ${L.label}, and ${F.label}`, '0 0 400 330', `
      ${base(L.bg)}${L.scene}${figure(L)}
      <path d="M67 246h268v13H67Zm14 13-5 48m247-48 4 48" fill="#d6aa78"/>
      ${L.prop}${F.draw}
      ${star(59, 190, yellow, .7)}${star(348, 196, coral, .55)}`);
  }

  window.LifeCArt = Object.freeze({ character, lifeIcon: life => character(life, 'cook') });
  // the shared map result asks window.LifeArt for a character by id; teach it this version's ids
  const prev = window.LifeArt;
  if (prev) window.LifeArt = Object.freeze({ city: prev.city, character(kind) {
    const m = /^(library|cafe|air|culture|night)-(cook|out|takeaway)$/.exec(String(kind || ''));
    return m ? character(m[1], m[2]) : prev.character(kind);
  } });
})();
