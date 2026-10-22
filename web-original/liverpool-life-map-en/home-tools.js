/* Shared, dependency-free home discovery helpers. Keep existing IDs and numbers when editing listings. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HomeTools = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // These are fixed identities, not positions in an array or current sort results.
  // For a new home, add a unique slug and the next unused number; never renumber existing homes.
  const HOME_IDENTITIES = Object.freeze({
    "iQ Great Newton House": Object.freeze({ id: 'iq-great-newton-house', n: 1 }),
    "Capital Gate": Object.freeze({ id: 'capital-gate', n: 2 }),
    "Pembroke Studios": Object.freeze({ id: 'pembroke-studios', n: 3 }),
    "Albert Court": Object.freeze({ id: 'albert-court', n: 4 }),
    "St Andrew’s Gardens": Object.freeze({ id: 'st-andrews-gardens', n: 5 }),
    "Windsor Court": Object.freeze({ id: 'windsor-court', n: 6 }),
    "Plato House": Object.freeze({ id: 'plato-house', n: 7 }),
    "One Islington Plaza": Object.freeze({ id: 'one-islington-plaza', n: 8 }),
    "Shamrock House": Object.freeze({ id: 'shamrock-house', n: 9 }),
    "Innovo House": Object.freeze({ id: 'innovo-house', n: 10 }),
    "Calico": Object.freeze({ id: 'calico', n: 11 }),
    "Lennon Studios": Object.freeze({ id: 'lennon-studios', n: 12 }),
    "Hope Street": Object.freeze({ id: 'hope-street', n: 13 }),
    "Haigh Court": Object.freeze({ id: 'haigh-court', n: 14 }),
    "Maple House": Object.freeze({ id: 'maple-house', n: 15 }),
    "The Electra": Object.freeze({ id: 'the-electra', n: 16 }),
    "Chatham Lodge": Object.freeze({ id: 'chatham-lodge', n: 17 }),
    "Hayward House": Object.freeze({ id: 'hayward-house', n: 18 }),
    "The Hahnemann Building": Object.freeze({ id: 'the-hahnemann-building', n: 19 }),
    "Fusion Liverpool": Object.freeze({ id: 'fusion-liverpool', n: 20 }),
    "The Arch": Object.freeze({ id: 'the-arch', n: 21 }),
    "Benson Yard": Object.freeze({ id: 'benson-yard', n: 22 }),
    "Grand Central": Object.freeze({ id: 'grand-central', n: 23 }),
    "Horizon Heights": Object.freeze({ id: 'horizon-heights', n: 24 }),
    "The Lantern": Object.freeze({ id: 'the-lantern', n: 25 }),
    "Iconinc The Ascent": Object.freeze({ id: 'iconinc-the-ascent', n: 26 }),
    "Byrom Point": Object.freeze({ id: 'byrom-point', n: 27 }),
    "Vita Student Crosshall Street": Object.freeze({ id: 'vita-student-crosshall-street', n: 28 }),
    "The Bridewell": Object.freeze({ id: 'the-bridewell', n: 29 }),
    "Marybone Student Village": Object.freeze({ id: 'marybone-student-village', n: 30 }),
    "Moorfield": Object.freeze({ id: 'moorfield', n: 31 }),
    "Yugo Ablett House": Object.freeze({ id: 'yugo-ablett-house', n: 32 }),
    "Atlantic Point": Object.freeze({ id: 'atlantic-point', n: 33 }),
    "Glassworks": Object.freeze({ id: 'glassworks', n: 34 }),
    "Europa": Object.freeze({ id: 'europa', n: 35 }),
    "Prospect Point": Object.freeze({ id: 'prospect-point', n: 36 }),
    "true Liverpool": Object.freeze({ id: 'true-liverpool', n: 37 }),
    "Unity Square": Object.freeze({ id: 'unity-square', n: 38 }),
    "City Point": Object.freeze({ id: 'city-point', n: 39 }),
    "Phoenix Place": Object.freeze({ id: 'phoenix-place', n: 40 }),
    "Poets Place": Object.freeze({ id: 'poets-place', n: 41 }),
    "Paddington Park House": Object.freeze({ id: 'paddington-park-house', n: 42 }),
    "Edge Hill 6-bed student houses": Object.freeze({ id: 'edge-hill-6-bed-student-houses', n: 43 }),
    "The Railyard": Object.freeze({ id: 'the-railyard', n: 44 }),
    "Queensland Place": Object.freeze({ id: 'queensland-place', n: 45 }),
    "Kensington 5-bed student houses": Object.freeze({ id: 'kensington-5-bed-student-houses', n: 46 }),
    "Kensington 4-bed student houses": Object.freeze({ id: 'kensington-4-bed-student-houses', n: 47 }),
  });

  function normalizeQuery(value) {
    if (typeof value !== 'string') return '';
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/[’'‘]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }

  function matchesHome(home, filters = {}, favorites = new Set()) {
    if (!home || typeof home !== 'object') return false;
    const query = normalizeQuery(filters.query);
    const haystack = normalizeQuery([home.name, home.addr, home.area, home.n].filter(v => v != null).join(' '));
    if (query && !query.split(' ').every(token => haystack.includes(token))) return false;

    const room = filters.room === 'ensuite' || filters.room === 'studio' ? filters.room : 'any';
    const price = room === 'ensuite' ? home.pe : room === 'studio' ? home.ps : home.plo;
    const knownPrice = typeof price === 'number' && Number.isFinite(price) && price > 0;
    // A missing price means the selected room type has not been established, not a free room.
    if (room !== 'any' && !knownPrice) return false;
    const budget = Number(filters.budget);
    if (Number.isFinite(budget) && budget > 0 && (!knownPrice || price > budget)) return false;

    const destination = filters.destination === 'ljmu' ? 'ljmu' : filters.destination === 'subject' ? 'subj' : 'uol';
    const walk = Number(filters.walk), minutes = home[destination];
    if (Number.isFinite(walk) && walk > 0 &&
      (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes < 0 || minutes > walk)) return false;
    if (filters.favoritesOnly && (!favorites || typeof favorites.has !== 'function' || !favorites.has(home.id))) return false;
    return true;
  }

  function readSaved(storage, key, validIds, max = Infinity) {
    try {
      const saved = JSON.parse(storage.getItem(key));
      if (!Array.isArray(saved)) return [];
      const allowed = new Set(validIds), unique = new Set();
      const limit = max === Infinity ? Infinity : Math.max(0, Math.floor(Number(max) || 0));
      for (const id of saved) {
        if (unique.size >= limit) break;
        if (typeof id === 'string' && allowed.has(id)) unique.add(id);
      }
      return [...unique];
    } catch (_) { return []; }
  }

  const validLanguage = value => typeof value === 'string' && ['en', 'zh'].includes(value.toLowerCase()) ? value.toLowerCase() : null;
  const validHome = value => typeof value === 'string' && value.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : null;
  function readRoute(hash) {
    const raw = typeof hash === 'string' ? hash.replace(/^#/, '') : '';
    const legacy = validLanguage(raw);
    if (legacy) return { lang: legacy, home: null };
    try {
      const params = new URLSearchParams(raw);
      return { lang: validLanguage(params.get('lang')), home: validHome(params.get('home')) };
    } catch (_) { return { lang: null, home: null }; }
  }
  function makeHash(lang, home) {
    const params = new URLSearchParams({ lang: validLanguage(lang) || 'en' });
    const id = validHome(home);
    if (id) params.set('home', id);
    return '#' + params.toString();
  }

  return Object.freeze({ HOME_IDENTITIES, normalizeQuery, matchesHome, readSaved, readRoute, makeHash });
});
