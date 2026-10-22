/* 自动生成，请勿手改：node web-demo/scripts/build-core.cjs
   来源：miniprogram/utils/（data/homes.js、home-match-core.js、home-tools.js、life-model.js、home-match.js、life-quiz.js、i18n.js、compare.js） */
(function (root) {
  'use strict';
  var defs = {}, cache = {};
  function resolve(from, to) {
    var base = from.split('/').slice(0, -1), segs = to.split('/');
    segs.forEach(function (s) { if (s === '..') base.pop(); else if (s !== '.') base.push(s); });
    var p = base.join('/');
    if (p.indexOf('./') !== 0) p = './' + p;
    return /\.js$/.test(p) ? p : p + '.js';
  }
  function load(id) {
    if (cache[id]) return cache[id].exports;
    if (!defs[id]) throw new Error('core: missing module ' + id);
    var module = cache[id] = { exports: {} };
    defs[id].call(root, module, module.exports, function (to) { return load(resolve(id, to)); });
    return module.exports;
  }
defs["./data/homes.js"] = function (module, exports, require) {
/* 自动生成，请勿手改。来源：../ui-project/liverpool-life-map-en/index.html + home-match.js
   重新生成：node scripts/extract-data.cjs
   价格与评分为网页版记录的历史数据（Amber，2026-10-17 核对），不是实时库存。 */
module.exports = [
 {
  "id": "iq-great-newton-house",
  "n": 1,
  "name": "iQ Great Newton House",
  "lat": 53.4082769,
  "lng": -2.9707094,
  "addr": "7 Lower Gill Street, L3 5BB",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "Next to the Liverpool School of Tropical Medicine and close to the Royal Liverpool Hospital, so ideal for medicine and health students. Breakfast bar, terrace and 24/7 staff.",
  "textZh": "紧邻利物浦热带医学院，靠近皇家利物浦大学医院，非常适合医学和健康专业的学生。有早餐吧、露台和24小时驻场员工。",
  "uol": 6,
  "ljmu": 10,
  "lime": 8,
  "centre": 19,
  "hm": {
   "r": [
    294.00100280000044,
    442.1975492000372
   ],
   "cnt": {
    "asian10": 6,
    "cafe10": 23,
    "culture15": 16,
    "night10": 36,
    "night3": 1,
    "rest10": 19,
    "sa10": 3,
    "shop10": 15,
    "super10": 3,
    "take10": 18,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 3,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "Cafe Marmalade"
     }
    },
    "gym": {
     "m": 5,
     "p": {
      "n": "Momentum Leisure"
     }
    },
    "intl": {
     "m": 3,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 6,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 8,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 2,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Lidl"
     }
    }
   }
  },
  "pe": 152,
  "plo": 152,
  "rr": 4.6,
  "rn": 11,
  "pso": false
 },
 {
  "id": "capital-gate",
  "n": 2,
  "name": "Capital Gate",
  "lat": 53.4094759,
  "lng": -2.9682951,
  "addr": "20 Daulby Street, L3 5NT",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "Practically on the University of Liverpool’s doorstep and two minutes from the hospital, with a 24/7 on-site team. Listed as alcohol-free.",
  "textZh": "几乎就在利物浦大学门口，两分钟到医院，有24小时驻场团队。楼内禁酒。",
  "uol": 6,
  "ljmu": 13,
  "lime": 11,
  "centre": 23,
  "hm": {
   "r": [
    310.0271261999996,
    428.85028120004023
   ],
   "cnt": {
    "asian10": 5,
    "cafe10": 16,
    "culture15": 10,
    "night10": 8,
    "night3": 2,
    "rest10": 6,
    "sa10": 3,
    "shop10": 10,
    "super10": 1,
    "take10": 14,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 1,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "SanSan Bubble Tea"
     }
    },
    "gym": {
     "m": 2,
     "p": {
      "n": "Momentum Leisure"
     }
    },
    "intl": {
     "m": 1,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 6,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 8,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 2,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    }
   }
  },
  "pe": 167,
  "plo": 167,
  "rr": 4.7,
  "rn": 6,
  "pso": false
 },
 {
  "id": "pembroke-studios",
  "n": 3,
  "name": "Pembroke Studios",
  "lat": 53.4087829,
  "lng": -2.9714336,
  "addr": "2 Lower Gill Street, L3 5BB",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "A smaller, quieter studio building beside the Liverpool School of Tropical Medicine. A good pick if you want your own space close to campus and the hospital.",
  "textZh": "紧邻利物浦热带医学院的小型 Studio 公寓，安静。适合想要独立空间、又想靠近校园和医院的同学。",
  "uol": 7,
  "ljmu": 11,
  "lime": 7,
  "centre": 19,
  "hm": {
   "r": [
    289.19376320000003,
    436.56475720002106
   ],
   "cnt": {
    "asian10": 7,
    "cafe10": 25,
    "culture15": 15,
    "night10": 35,
    "night3": 2,
    "rest10": 18,
    "sa10": 3,
    "shop10": 15,
    "super10": 4,
    "take10": 22,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 3,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "BÃªkas CafÃª"
     }
    },
    "gym": {
     "m": 4,
     "p": {
      "n": "Power & Fitness"
     }
    },
    "intl": {
     "m": 3,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 7,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 7,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 2,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Lidl"
     }
    }
   }
  },
  "rr": 3.5,
  "rn": 2,
  "pso": true
 },
 {
  "id": "albert-court",
  "n": 4,
  "name": "Albert Court",
  "lat": 53.4104203,
  "lng": -2.9681853,
  "addr": "211 London Road, L3 8JD",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "On busy London Road, with supermarkets and takeaways outside the door. Free 24/7 gym, study spaces and a shop on site.",
  "textZh": "位于热闹的伦敦路上，出门就是超市和外卖店。有24小时免费健身房、自习区和楼内商店。",
  "uol": 7,
  "ljmu": 14,
  "lime": 12,
  "centre": 24,
  "hm": {
   "r": [
    310.7559786000007,
    418.33722040002215
   ],
   "cnt": {
    "asian10": 5,
    "cafe10": 14,
    "culture15": 9,
    "night10": 7,
    "night3": 1,
    "rest10": 6,
    "sa10": 3,
    "shop10": 7,
    "super10": 1,
    "take10": 14,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 2,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "SanSan Bubble Tea"
     }
    },
    "gym": {
     "m": 1,
     "p": {
      "n": "Momentum Leisure"
     }
    },
    "intl": {
     "m": 2,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 7,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 6,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 3,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Best-one"
     }
    }
   }
  },
  "pe": 138,
  "plo": 138,
  "rr": 4.5,
  "rn": 39,
  "pso": false
 },
 {
  "id": "st-andrews-gardens",
  "n": 5,
  "name": "St Andrew’s Gardens",
  "lat": 53.408071,
  "lng": -2.9718807,
  "addr": "21 Moor Place, L3 5XA",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "Known locally as “the Bullring”: a curved 1930s building turned into flats around a courtyard garden. Seven minutes from campus; classic/shared rooms from about £99/wk in the Oct 2026 snapshot.",
  "textZh": "当地人称“斗牛场”：一栋1930年代的弧形建筑，改造成围绕庭院花园的公寓。步行约七分钟到校园；2026年10月快照里经典/合租房型约 £99/周起。",
  "uol": 7,
  "ljmu": 9,
  "lime": 6,
  "centre": 18,
  "hm": {
   "r": [
    286.225913400002,
    444.48962800000857
   ],
   "cnt": {
    "asian10": 11,
    "cafe10": 30,
    "culture15": 17,
    "night10": 54,
    "night3": 1,
    "rest10": 30,
    "sa10": 5,
    "shop10": 21,
    "super10": 5,
    "take10": 27,
    "veg10": 2
   },
   "near": {
    "asianGroc": {
     "m": 4,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "BÃªkas CafÃª"
     }
    },
    "gym": {
     "m": 5,
     "p": {
      "n": "Power & Fitness"
     }
    },
    "intl": {
     "m": 4,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 7,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 8,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 3,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 3,
     "p": {
      "n": "Lidl"
     }
    }
   }
  },
  "plo": 99,
  "rr": 4.6,
  "rn": 23,
  "pso": false
 },
 {
  "id": "windsor-court",
  "n": 6,
  "name": "Windsor Court",
  "lat": 53.4087791,
  "lng": -2.972294,
  "addr": "128 London Road, L3 5NL",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "Good value on London Road, seven minutes from campus, with bus stops and shops right outside. Games area, study area and an outdoor courtyard.",
  "textZh": "位于伦敦路，性价比高，到校园七分钟，门口就有公交站和商店。有游戏区、自习区和户外庭院。",
  "uol": 8,
  "ljmu": 10,
  "lime": 6,
  "centre": 18,
  "hm": {
   "r": [
    283.4824279999994,
    436.6070588000408
   ],
   "cnt": {
    "asian10": 8,
    "cafe10": 28,
    "culture15": 16,
    "night10": 39,
    "night3": 1,
    "rest10": 20,
    "sa10": 3,
    "shop10": 19,
    "super10": 5,
    "take10": 23,
    "veg10": 2
   },
   "near": {
    "asianGroc": {
     "m": 4,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "BÃªkas CafÃª"
     }
    },
    "gym": {
     "m": 4,
     "p": {
      "n": "Power & Fitness"
     }
    },
    "intl": {
     "m": 4,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 8,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 7,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 2,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Lidl"
     }
    }
   }
  },
  "plo": 225,
  "rr": 4.9,
  "rn": 9,
  "pso": false
 },
 {
  "id": "plato-house",
  "n": 7,
  "name": "Plato House",
  "lat": 53.4085004,
  "lng": -2.9726016,
  "addr": "11 Greek Street, L3 5QJ",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "A smaller, homely building just off London Road, with a cinema room, games room and a cleaner for the shared areas. Eight minutes from campus.",
  "textZh": "紧邻伦敦路的小型公寓，温馨舒适。有影音室、游戏室，公共区域有专人清洁，到校园八分钟。",
  "uol": 8,
  "ljmu": 10,
  "lime": 6,
  "centre": 18,
  "hm": {
   "r": [
    281.44057920000114,
    439.709547199991
   ],
   "cnt": {
    "asian10": 12,
    "cafe10": 30,
    "culture15": 17,
    "night10": 47,
    "night3": 1,
    "rest10": 25,
    "sa10": 4,
    "shop10": 27,
    "super10": 5,
    "take10": 28,
    "veg10": 2
   },
   "near": {
    "asianGroc": {
     "m": 4,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "BÃªkas CafÃª"
     }
    },
    "gym": {
     "m": 5,
     "p": {
      "n": "Power & Fitness"
     }
    },
    "intl": {
     "m": 4,
     "p": {
      "n": "International Food Store"
     }
    },
    "lib": {
     "m": 8,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 7,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 3,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "ps": 170,
  "plo": 170,
  "rr": 4.5,
  "rn": 10,
  "pso": false
 },
 {
  "id": "one-islington-plaza",
  "n": 8,
  "name": "One Islington Plaza",
  "lat": 53.4113572,
  "lng": -2.9688253,
  "addr": "1 Devon Street, L3 8HA",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "A large modern tower north of London Road with a gym, cinema room and games room. Around ten minutes’ walk to the University of Liverpool.",
  "textZh": "伦敦路北边的大型现代高楼，有健身房、影音室和游戏室，步行约十分钟到利物浦大学。",
  "uol": 9,
  "ljmu": 16,
  "lime": 12,
  "centre": 24,
  "hm": {
   "r": [
    306.5076586000023,
    407.9076496000306
   ],
   "cnt": {
    "asian10": 4,
    "cafe10": 10,
    "culture15": 8,
    "night10": 4,
    "night3": 1,
    "rest10": 6,
    "sa10": 3,
    "shop10": 8,
    "super10": 1,
    "take10": 12,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 3,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 3,
     "p": {
      "n": "SanSan Bubble Tea"
     }
    },
    "gym": {
     "m": 1,
     "p": {
      "n": "Momentum Leisure"
     }
    },
    "intl": {
     "m": 3,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 9,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 5,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 4,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Emilia's"
     }
    }
   }
  },
  "pe": 145,
  "ps": 180,
  "plo": 145,
  "rr": 4.3,
  "rn": 31,
  "pso": false
 },
 {
  "id": "shamrock-house",
  "n": 9,
  "name": "Shamrock House",
  "lat": 53.4104088,
  "lng": -2.9713698,
  "addr": "21 Gildart Street, L3 8ET",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "Shared apartments on a side street off London Road, good for living with a small group of friends. Eight minutes from campus.",
  "textZh": "伦敦路旁小街上的合租公寓，适合和几位朋友一起住，到校园八分钟。",
  "uol": 9,
  "ljmu": 14,
  "lime": 9,
  "centre": 21,
  "hm": {
   "r": [
    289.6172675999997,
    418.4652384000153
   ],
   "cnt": {
    "asian10": 4,
    "cafe10": 17,
    "culture15": 8,
    "night10": 8,
    "night3": 2,
    "rest10": 6,
    "sa10": 3,
    "shop10": 10,
    "super10": 2,
    "take10": 14,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 2,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "SanSan Bubble Tea"
     }
    },
    "gym": {
     "m": 1,
     "p": {
      "n": "Power & Fitness"
     }
    },
    "intl": {
     "m": 2,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 9,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 5,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 2,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Taza Supermarket"
     }
    }
   }
  },
  "pso": true
 },
 {
  "id": "innovo-house",
  "n": 10,
  "name": "Innovo House",
  "lat": 53.4108522,
  "lng": -2.972185,
  "addr": "60 Devon Street, L3 8AJ",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "A relaxed, mid-sized building on a quiet road off London Road. A TV in every kitchen, a lounge and a pool table, ten minutes from campus.",
  "textZh": "位于伦敦路旁安静小街上的中型公寓，氛围轻松。每个厨房都有电视，另有休息室和台球桌，到校园十分钟。",
  "uol": 10,
  "ljmu": 13,
  "lime": 9,
  "centre": 21,
  "hm": {
   "r": [
    284.2059700000003,
    413.52930959999577
   ],
   "cnt": {
    "asian10": 4,
    "cafe10": 18,
    "culture15": 8,
    "night10": 8,
    "night3": 1,
    "rest10": 6,
    "sa10": 3,
    "shop10": 9,
    "super10": 2,
    "take10": 12,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 3,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 3,
     "p": {
      "n": "Cu Cafe"
     }
    },
    "gym": {
     "m": 1,
     "p": {
      "n": "Power & Fitness"
     }
    },
    "intl": {
     "m": 3,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 9,
     "p": {
      "n": "Liverpool Central Library"
     }
    },
    "park": {
     "m": 3,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 3,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Shop'N Drive"
     }
    }
   }
  },
  "ps": 225,
  "plo": 225,
  "rr": 5,
  "rn": 2,
  "pso": false
 },
 {
  "id": "calico",
  "n": 11,
  "name": "Calico",
  "lat": 53.4108157,
  "lng": -2.9746962,
  "addr": "52 Islington, L3 8LG",
  "area": "Knowledge Quarter & London Road",
  "areaZh": "知识区与伦敦路",
  "text": "A modern building with a sky lounge, games pods, cinema room and gym. About ten minutes from both universities and Lime Street.",
  "textZh": "现代化公寓，配有空中休息室、游戏舱、影音室和健身房，到两所大学和莱姆街都约十分钟。",
  "uol": 12,
  "ljmu": 10,
  "lime": 7,
  "centre": 19,
  "hm": {
   "r": [
    267.5366244000015,
    413.93562759999816
   ],
   "cnt": {
    "asian10": 6,
    "cafe10": 22,
    "culture15": 10,
    "night10": 23,
    "rest10": 8,
    "sa10": 3,
    "shop10": 17,
    "super10": 4,
    "take10": 14,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 6,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "Cu Cafe"
     }
    },
    "gym": {
     "m": 4,
     "p": {
      "n": "Power & Fitness"
     }
    },
    "intl": {
     "m": 4,
     "p": {
      "n": "International Food Store"
     }
    },
    "lib": {
     "m": 7,
     "p": {
      "n": "Liverpool Central Library"
     }
    },
    "park": {
     "m": 3,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 5,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "pe": 165,
  "ps": 225,
  "plo": 165,
  "rr": 4.6,
  "rn": 14,
  "pso": false
 },
 {
  "id": "lennon-studios",
  "n": 12,
  "name": "Lennon Studios",
  "lat": 53.40282,
  "lng": -2.9684499,
  "addr": "109 Cambridge Court, L7 7AG",
  "area": "Georgian Quarter & Chinatown",
  "areaZh": "乔治亚区与唐人街",
  "text": "Studios just south of the University of Liverpool, about five minutes from lectures. Pool and foosball tables, outdoor space and a 24/7 team.",
  "textZh": "位于利物浦大学南侧的 Studio 公寓，约五分钟到教室。有台球桌和桌上足球、户外空间和24小时团队。",
  "uol": 7,
  "ljmu": 5,
  "lime": 13,
  "centre": 20,
  "hm": {
   "r": [
    308.999563800001,
    502.9437600000222
   ],
   "cnt": {
    "asian10": 16,
    "cafe10": 29,
    "culture15": 14,
    "night10": 67,
    "night3": 13,
    "rest10": 65,
    "sa10": 8,
    "shop10": 15,
    "super10": 4,
    "take10": 20,
    "veg10": 6
   },
   "near": {
    "asianGroc": {
     "m": 4,
     "p": {
      "n": "Sida Express"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "Piazza Café"
     }
    },
    "gym": {
     "m": 3,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 4,
     "p": {
      "n": "Sida Express"
     }
    },
    "lib": {
     "m": 4,
     "p": {
      "n": "Aldham Robarts Library"
     }
    },
    "park": {
     "m": 12,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 4,
     "p": {
      "n": "Sida Express"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "The Wild Loaf"
     }
    }
   }
  },
  "ps": 172,
  "plo": 172,
  "rr": 4.8,
  "rn": 6,
  "pso": false
 },
 {
  "id": "hope-street",
  "n": 13,
  "name": "Hope Street",
  "lat": 53.4017252,
  "lng": -2.9696389,
  "addr": "29F Hope Street, L1 9BR",
  "area": "Georgian Quarter & Chinatown",
  "areaZh": "乔治亚区与唐人街",
  "text": "On one of Liverpool’s prettiest streets, between the two cathedrals and surrounded by restaurants. Gym, cinema room and a sun terrace.",
  "textZh": "位于两座大教堂之间，是利物浦最漂亮的街道之一，周围餐厅林立。有健身房、影音室和阳光露台。",
  "uol": 9,
  "ljmu": 4,
  "lime": 13,
  "centre": 19,
  "hm": {
   "r": [
    301.1069818000003,
    515.1310735999896
   ],
   "cnt": {
    "asian10": 22,
    "cafe10": 33,
    "culture15": 13,
    "night10": 85,
    "night3": 21,
    "rest10": 82,
    "sa10": 9,
    "shop10": 19,
    "super10": 4,
    "take10": 26,
    "veg10": 8
   },
   "near": {
    "asianGroc": {
     "m": 4,
     "p": {
      "n": "Sida Express"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "Starbucks"
     }
    },
    "gym": {
     "m": 5,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 4,
     "p": {
      "n": "Sida Express"
     }
    },
    "lib": {
     "m": 3,
     "p": {
      "n": "Aldham Robarts Library"
     }
    },
    "park": {
     "m": 13,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 4,
     "p": {
      "n": "Sida Express"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Philharmonic Mini Market"
     }
    }
   }
  },
  "pe": 135,
  "ps": 195,
  "plo": 135,
  "rr": 4.2,
  "rn": 9,
  "pso": false
 },
 {
  "id": "haigh-court",
  "n": 14,
  "name": "Haigh Court",
  "lat": 53.4020105,
  "lng": -2.9713173,
  "addr": "South Hunter Street, L1 9JG",
  "area": "Georgian Quarter & Chinatown",
  "areaZh": "乔治亚区与唐人街",
  "text": "In the Georgian Quarter near Hope Street and LIPA, with lounges, green outdoor areas and lifts to every floor.",
  "textZh": "位于乔治亚区，靠近希望街和 LIPA，有休息室、绿色户外空间，每层都有电梯。",
  "uol": 10,
  "ljmu": 3,
  "lime": 12,
  "centre": 17,
  "hm": {
   "r": [
    289.96576260000126,
    511.9551139999718
   ],
   "cnt": {
    "asian10": 25,
    "cafe10": 40,
    "culture15": 17,
    "night10": 118,
    "night3": 24,
    "rest10": 92,
    "sa10": 11,
    "shop10": 34,
    "super10": 4,
    "take10": 31,
    "veg10": 11
   },
   "near": {
    "asianGroc": {
     "m": 5,
     "p": {
      "n": "Sida Express"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "92°"
     }
    },
    "gym": {
     "m": 6,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 5,
     "p": {
      "n": "Sida Express"
     }
    },
    "lib": {
     "m": 2,
     "p": {
      "n": "Aldham Robarts Library"
     }
    },
    "park": {
     "m": 15,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 5,
     "p": {
      "n": "Sida Express"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Philharmonic Mini Market"
     }
    }
   }
  },
  "rr": 4.6,
  "rn": 11,
  "pso": true
 },
 {
  "id": "maple-house",
  "n": 15,
  "name": "Maple House",
  "lat": 53.4006699,
  "lng": -2.9679872,
  "addr": "25 Caledonia Street, L7 7DX",
  "area": "Georgian Quarter & Chinatown",
  "areaZh": "乔治亚区与唐人街",
  "text": "A small, calm building in the quiet streets between Hope Street and Myrtle Street. Eight minutes from campus, with a lift and outdoor space.",
  "textZh": "位于希望街和桃金娘街之间安静住宅区的小型公寓，到校园八分钟，有电梯和户外空间。",
  "uol": 11,
  "ljmu": 7,
  "lime": 16,
  "centre": 21,
  "hm": {
   "r": [
    312.0709664000005,
    526.8786732000387
   ],
   "cnt": {
    "asian10": 16,
    "cafe10": 23,
    "culture15": 11,
    "night10": 54,
    "night3": 11,
    "rest10": 55,
    "sa10": 6,
    "shop10": 7,
    "super10": 4,
    "take10": 19,
    "veg10": 3
   },
   "near": {
    "asianGroc": {
     "m": 1,
     "p": {
      "n": "Sida Express"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "Caffè Nero"
     }
    },
    "gym": {
     "m": 6,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 1,
     "p": {
      "n": "Sida Express"
     }
    },
    "lib": {
     "m": 6,
     "p": {
      "n": "Aldham Robarts Library"
     }
    },
    "park": {
     "m": 11,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 1,
     "p": {
      "n": "Sida Express"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Co-op Food"
     }
    }
   }
  },
  "pe": 150,
  "plo": 150,
  "rr": 5,
  "rn": 3,
  "pso": false
 },
 {
  "id": "the-electra",
  "n": 16,
  "name": "The Electra",
  "lat": 53.4007953,
  "lng": -2.9701131,
  "addr": "Caledonia Street, L7 7ED",
  "area": "Georgian Quarter & Chinatown",
  "areaZh": "乔治亚区与唐人街",
  "text": "Near Hope Street and handy for both the University of Liverpool and LJMU. Lounge, games area and a study zone, with 24/7 support.",
  "textZh": "靠近希望街，往返利物浦大学和 LJMU 都方便。有休息室、游戏区、自习区和24小时支持。",
  "uol": 11,
  "ljmu": 5,
  "lime": 14,
  "centre": 19,
  "hm": {
   "r": [
    297.9592422000019,
    525.4827204000196
   ],
   "cnt": {
    "asian10": 20,
    "cafe10": 29,
    "culture15": 12,
    "night10": 85,
    "night3": 19,
    "rest10": 80,
    "sa10": 9,
    "shop10": 18,
    "super10": 4,
    "take10": 23,
    "veg10": 8
   },
   "near": {
    "asianGroc": {
     "m": 4,
     "p": {
      "n": "Sida Express"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "Starbucks"
     }
    },
    "gym": {
     "m": 7,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 4,
     "p": {
      "n": "Sida Express"
     }
    },
    "lib": {
     "m": 4,
     "p": {
      "n": "Aldham Robarts Library"
     }
    },
    "park": {
     "m": 13,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 4,
     "p": {
      "n": "Sida Express"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Co-op Food"
     }
    }
   }
  },
  "rr": 4.5,
  "rn": 4,
  "pso": true
 },
 {
  "id": "chatham-lodge",
  "n": 17,
  "name": "Chatham Lodge",
  "lat": 53.4005645,
  "lng": -2.9646749,
  "addr": "140 Chatham Street, L7 7BA",
  "area": "Georgian Quarter & Chinatown",
  "areaZh": "乔治亚区与唐人街",
  "text": "Studios and shared flats in the leafy streets just south of campus, near Abercromby Square. Gym, lift and laundry on site.",
  "textZh": "位于校园南侧、阿伯克龙比广场附近绿树成荫的街道，提供 Studio 和合租公寓，有健身房、电梯和洗衣房。",
  "uol": 11,
  "ljmu": 10,
  "lime": 19,
  "centre": 24,
  "hm": {
   "r": [
    334.05801380000156,
    528.0519859999872
   ],
   "cnt": {
    "asian10": 2,
    "cafe10": 19,
    "culture15": 11,
    "night10": 29,
    "rest10": 22,
    "sa10": 2,
    "shop10": 3,
    "super10": 3,
    "take10": 14,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 1,
     "p": {
      "n": "eJoy Asian Foods"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "92 Degrees"
     }
    },
    "gym": {
     "m": 6,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 1,
     "p": {
      "n": "eJoy Asian Foods"
     }
    },
    "lib": {
     "m": 4,
     "p": {
      "n": "Sydney Jones Library"
     }
    },
    "park": {
     "m": 7,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 1,
     "p": {
      "n": "Heron Foods"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "ps": 199,
  "plo": 199,
  "pso": false
 },
 {
  "id": "hayward-house",
  "n": 18,
  "name": "Hayward House",
  "lat": 53.4010918,
  "lng": -2.961914,
  "addr": "117 Grove Street, L7",
  "area": "Georgian Quarter & Chinatown",
  "areaZh": "乔治亚区与唐人街",
  "text": "Studios and three-bedroom flats ten minutes from campus. Good bus links into town and out to south Liverpool.",
  "textZh": "提供 Studio 和三居室公寓，到校园十分钟，往返市中心和利物浦南部的公交都很方便。",
  "uol": 11,
  "ljmu": 12,
  "lime": 20,
  "centre": 27,
  "hm": {
   "r": [
    352.38486799999976,
    522.1820823999686
   ],
   "cnt": {
    "asian10": 1,
    "cafe10": 15,
    "culture15": 8,
    "night10": 21,
    "rest10": 14,
    "sa10": 3,
    "shop10": 3,
    "super10": 5,
    "take10": 10
   },
   "near": {
    "asianGroc": {
     "m": 4,
     "p": {
      "n": "eJoy Asian Foods"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": ""
     }
    },
    "gym": {
     "m": 7,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 4,
     "p": {
      "n": "eJoy Asian Foods"
     }
    },
    "lib": {
     "m": 3,
     "p": {
      "n": "Sydney Jones Library"
     }
    },
    "park": {
     "m": 4,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 4,
     "p": {
      "n": "Heron Foods"
     }
    },
    "topup": {
     "m": 3,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "pe": 139,
  "ps": 203,
  "plo": 139,
  "pso": false
 },
 {
  "id": "the-hahnemann-building",
  "n": 19,
  "name": "The Hahnemann Building",
  "lat": 53.400596,
  "lng": -2.971214,
  "addr": "42 Hope Street, L1 9AJ",
  "area": "Georgian Quarter & Chinatown",
  "areaZh": "乔治亚区与唐人街",
  "text": "A converted Victorian hospital on Hope Street, full of period character. Cinema, games room and study room, close to LIPA and LJMU.",
  "textZh": "由希望街上的维多利亚时代医院改建而成，充满历史韵味。有影院、游戏室和自习室，靠近 LIPA 和 LJMU。",
  "uol": 12,
  "ljmu": 5,
  "lime": 14,
  "centre": 18,
  "hm": {
   "r": [
    290.6514680000022,
    527.7013280000025
   ],
   "cnt": {
    "asian10": 21,
    "cafe10": 32,
    "culture15": 14,
    "night10": 104,
    "night3": 17,
    "rest10": 89,
    "sa10": 10,
    "shop10": 26,
    "super10": 4,
    "take10": 26,
    "veg10": 10
   },
   "near": {
    "asianGroc": {
     "m": 5,
     "p": {
      "n": "Sida Express"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "Moose Coffee"
     }
    },
    "gym": {
     "m": 8,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 5,
     "p": {
      "n": "Sida Express"
     }
    },
    "lib": {
     "m": 4,
     "p": {
      "n": "Aldham Robarts Library"
     }
    },
    "park": {
     "m": 14,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 5,
     "p": {
      "n": "Sida Express"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Philharmonic Mini Market"
     }
    }
   }
  },
  "ps": 189,
  "plo": 189,
  "rr": 3,
  "rn": 1,
  "pso": false
 },
 {
  "id": "fusion-liverpool",
  "n": 20,
  "name": "Fusion Liverpool",
  "lat": 53.4000941,
  "lng": -2.9759037,
  "addr": "5 Upper Duke Street, L1 9DU",
  "area": "Georgian Quarter & Chinatown",
  "areaZh": "乔治亚区与唐人街",
  "text": "Self-contained apartments with a basketball court, karaoke room and free laundry. Between Chinatown, the Georgian Quarter and the cathedral.",
  "textZh": "独立公寓，配有篮球场、卡拉OK房和免费洗衣，位于唐人街、乔治亚区和大教堂之间。",
  "uol": 16,
  "ljmu": 6,
  "lime": 13,
  "centre": 13,
  "hm": {
   "r": [
    259.5212394000013,
    533.288478800039
   ],
   "cnt": {
    "asian10": 26,
    "cafe10": 45,
    "culture15": 16,
    "night10": 149,
    "night3": 21,
    "rest10": 103,
    "sa10": 11,
    "shop10": 38,
    "super10": 5,
    "take10": 43,
    "veg10": 12
   },
   "near": {
    "asianGroc": {
     "m": 6,
     "p": {
      "n": "Chung Wah"
     }
    },
    "cafe": {
     "m": 3,
     "p": {
      "n": "The Bagelry"
     }
    },
    "gym": {
     "m": 9,
     "p": {
      "n": "PureGym"
     }
    },
    "intl": {
     "m": 1,
     "p": {
      "n": "Euro Wines"
     }
    },
    "lib": {
     "m": 7,
     "p": {
      "n": "Aldham Robarts Library"
     }
    },
    "park": {
     "m": 19,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 4,
     "p": {
      "n": "Misu"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Euro Wines"
     }
    }
   }
  },
  "pe": 175,
  "plo": 175,
  "rr": 4.3,
  "rn": 6,
  "pso": false
 },
 {
  "id": "the-arch",
  "n": 21,
  "name": "The Arch",
  "lat": 53.3999832,
  "lng": -2.9771357,
  "addr": "2 Nelson Street, L1 5DR",
  "area": "Georgian Quarter & Chinatown",
  "areaZh": "乔治亚区与唐人街",
  "text": "Named after the Chinatown Arch just outside, with Chinese restaurants and supermarkets on the doorstep. Cinema area, study zones and a courtyard.",
  "textZh": "名字来自门外的唐人街牌楼，中餐馆和亚洲超市就在家门口。有影音区、自习区和庭院。",
  "uol": 17,
  "ljmu": 7,
  "lime": 13,
  "centre": 12,
  "hm": {
   "r": [
    251.34322340000196,
    534.523017599991
   ],
   "cnt": {
    "asian10": 29,
    "cafe10": 47,
    "culture15": 15,
    "night10": 157,
    "night3": 22,
    "rest10": 112,
    "sa10": 12,
    "shop10": 44,
    "super10": 4,
    "take10": 48,
    "veg10": 13
   },
   "near": {
    "asianGroc": {
     "m": 5,
     "p": {
      "n": "Chung Wah"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "The Bagelry"
     }
    },
    "gym": {
     "m": 9,
     "p": {
      "n": "PureGym"
     }
    },
    "intl": {
     "m": 1,
     "p": {
      "n": "Euro Wines"
     }
    },
    "lib": {
     "m": 8,
     "p": {
      "n": "Aldham Robarts Library"
     }
    },
    "park": {
     "m": 21,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 5,
     "p": {
      "n": "Misu"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Euro Wines"
     }
    }
   }
  },
  "rr": 4.9,
  "rn": 9,
  "pso": true
 },
 {
  "id": "benson-yard",
  "n": 22,
  "name": "Benson Yard",
  "lat": 53.4040242,
  "lng": -2.9757586,
  "addr": "18 Benson Street, L1 2ST",
  "area": "Lime Street & Ropewalks",
  "areaZh": "莱姆街与绳道区",
  "text": "On a quiet Ropewalks side street near Bold Street’s cafés, with a cinema room, sky lounge, music room and gym. Five minutes from LJMU’s Mount Pleasant buildings.",
  "textZh": "位于绳道区一条安静小街，靠近博尔德街的咖啡馆。有影音室、空中休息室、音乐室和健身房，到 LJMU 快乐山校区五分钟。",
  "uol": 11,
  "ljmu": 4,
  "lime": 6,
  "centre": 12,
  "hm": {
   "r": [
    260.4844132000021,
    489.53860559998157
   ],
   "cnt": {
    "asian10": 33,
    "cafe10": 60,
    "culture15": 21,
    "night10": 177,
    "night3": 18,
    "rest10": 115,
    "sa10": 15,
    "shop10": 115,
    "super10": 7,
    "take10": 59,
    "veg10": 13
   },
   "near": {
    "asianGroc": {
     "m": 6,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "The Egg Cafe"
     }
    },
    "gym": {
     "m": 3,
     "p": {
      "n": "PureGym"
     }
    },
    "intl": {
     "m": 6,
     "p": {
      "n": "Euro Wines"
     }
    },
    "lib": {
     "m": 5,
     "p": {
      "n": "Aldham Robarts Library"
     }
    },
    "park": {
     "m": 15,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 3,
     "p": {
      "n": "Misu"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Go Local Extra"
     }
    }
   }
  },
  "pe": 168,
  "plo": 168,
  "rr": 4.6,
  "rn": 16,
  "pso": false
 },
 {
  "id": "grand-central",
  "n": 23,
  "name": "Grand Central",
  "lat": 53.4061952,
  "lng": -2.9773485,
  "addr": "Skelhorne Street, L3 5GA",
  "area": "Lime Street & Ropewalks",
  "areaZh": "莱姆街与绳道区",
  "text": "A big, lively hall next to Lime Street Station, ideal if you’ll travel by train. Games tables, an outdoor social space and a 24/7 team.",
  "textZh": "紧邻莱姆街火车站的大型公寓，氛围热闹，适合常坐火车出行的同学。有游戏桌、户外社交空间和24小时团队。",
  "uol": 12,
  "ljmu": 7,
  "lime": 2,
  "centre": 11,
  "hm": {
   "r": [
    249.93065699999966,
    465.3710336000146
   ],
   "cnt": {
    "asian10": 30,
    "cafe10": 66,
    "culture15": 21,
    "night10": 175,
    "night3": 26,
    "rest10": 110,
    "sa10": 16,
    "shop10": 150,
    "super10": 8,
    "take10": 71,
    "veg10": 13
   },
   "near": {
    "asianGroc": {
     "m": 3,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 3,
     "p": {
      "n": "Key Lime Coffee"
     }
    },
    "gym": {
     "m": 3,
     "p": {
      "n": "PureGym"
     }
    },
    "intl": {
     "m": 3,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "lib": {
     "m": 8,
     "p": {
      "n": "Liverpool Central Library"
     }
    },
    "park": {
     "m": 11,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 1,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Lidl"
     }
    }
   }
  },
  "pe": 143,
  "ps": 208,
  "plo": 99,
  "rr": 4.8,
  "rn": 16,
  "pso": false
 },
 {
  "id": "horizon-heights",
  "n": 24,
  "name": "Horizon Heights",
  "lat": 53.4069252,
  "lng": -2.9784915,
  "addr": "Skelhorne Street, L3 5LX",
  "area": "Lime Street & Ropewalks",
  "areaZh": "莱姆街与绳道区",
  "text": "A newer tower right behind Lime Street Station, with a sky lounge, cinema room and private dining room. About ten minutes’ walk up to the University of Liverpool.",
  "textZh": "紧挨莱姆街火车站的新高楼，有空中休息室、影音室和私人餐厅。步行约十分钟上坡即到利物浦大学。",
  "uol": 13,
  "ljmu": 9,
  "lime": 1,
  "centre": 11,
  "hm": {
   "r": [
    242.34342300000037,
    457.2446735999663
   ],
   "cnt": {
    "asian10": 29,
    "cafe10": 70,
    "culture15": 21,
    "night10": 180,
    "night3": 24,
    "rest10": 108,
    "sa10": 15,
    "shop10": 166,
    "super10": 8,
    "take10": 70,
    "veg10": 13
   },
   "near": {
    "asianGroc": {
     "m": 3,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "92 Degrees"
     }
    },
    "gym": {
     "m": 3,
     "p": {
      "n": "The Gym"
     }
    },
    "intl": {
     "m": 3,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "lib": {
     "m": 6,
     "p": {
      "n": "Liverpool Central Library"
     }
    },
    "park": {
     "m": 10,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 2,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "pe": 187,
  "ps": 232,
  "plo": 187,
  "rr": 4.4,
  "rn": 7,
  "pso": false
 },
 {
  "id": "the-lantern",
  "n": 25,
  "name": "The Lantern",
  "lat": 53.406372,
  "lng": -2.9783742,
  "addr": "6 Bolton Street, L3 5AA",
  "area": "Lime Street & Ropewalks",
  "areaZh": "莱姆街与绳道区",
  "text": "Between Lime Street and Central stations, close to Bold Street and Chinatown. Gym, games room and a regular residents’ events programme.",
  "textZh": "位于莱姆街站和中央车站之间，靠近博尔德街和唐人街。有健身房、游戏室和定期住户活动。",
  "uol": 13,
  "ljmu": 8,
  "lime": 2,
  "centre": 10,
  "hm": {
   "r": [
    243.12206039999953,
    463.4028960000321
   ],
   "cnt": {
    "asian10": 32,
    "cafe10": 71,
    "culture15": 21,
    "night10": 187,
    "night3": 29,
    "rest10": 115,
    "sa10": 16,
    "shop10": 169,
    "super10": 8,
    "take10": 80,
    "veg10": 13
   },
   "near": {
    "asianGroc": {
     "m": 2,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "Key Lime Coffee"
     }
    },
    "gym": {
     "m": 2,
     "p": {
      "n": "The Gym"
     }
    },
    "intl": {
     "m": 2,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "lib": {
     "m": 7,
     "p": {
      "n": "Liverpool Central Library"
     }
    },
    "park": {
     "m": 11,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 1,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "rr": 4.9,
  "rn": 10,
  "pso": true
 },
 {
  "id": "iconinc-the-ascent",
  "n": 26,
  "name": "Iconinc The Ascent",
  "lat": 53.4041719,
  "lng": -2.9775791,
  "addr": "30 Renshaw Street, L1 2SD",
  "area": "Lime Street & Ropewalks",
  "areaZh": "莱姆街与绳道区",
  "text": "A premium building with a large gym, sauna, steam room and private cinema. A minute from Bold Street and Central station.",
  "textZh": "高端公寓，配有大型健身房、桑拿、蒸汽房和私人影院，一分钟即到博尔德街和中央车站。",
  "uol": 13,
  "ljmu": 5,
  "lime": 6,
  "centre": 10,
  "hm": {
   "r": [
    248.39993420000206,
    487.89440919998805
   ],
   "cnt": {
    "asian10": 37,
    "cafe10": 73,
    "culture15": 23,
    "night10": 181,
    "night3": 46,
    "rest10": 136,
    "sa10": 17,
    "shop10": 156,
    "super10": 7,
    "take10": 77,
    "veg10": 15
   },
   "near": {
    "asianGroc": {
     "m": 5,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "The Egg Cafe"
     }
    },
    "gym": {
     "m": 1,
     "p": {
      "n": "PureGym"
     }
    },
    "intl": {
     "m": 5,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "lib": {
     "m": 7,
     "p": {
      "n": "Aldham Robarts Library"
     }
    },
    "park": {
     "m": 15,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 4,
     "p": {
      "n": "Misu"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Go Local Extra"
     }
    }
   }
  },
  "ps": 199,
  "plo": 199,
  "rr": 4.9,
  "rn": 8,
  "pso": false
 },
 {
  "id": "byrom-point",
  "n": 27,
  "name": "Byrom Point",
  "lat": 53.411214,
  "lng": -2.9830975,
  "addr": "72 Great Crosshall Street, L3 2AT",
  "area": "City Centre",
  "areaZh": "市中心",
  "text": "One of the closest homes to LJMU’s City Campus, with a gym, a library-style study area and strong security, including a night patrol. Listed as alcohol-free.",
  "textZh": "离 LJMU 城市校区最近的公寓之一，有健身房、图书馆式自习区，安保完善，包括夜间巡逻。楼内禁酒。",
  "uol": 20,
  "ljmu": 3,
  "lime": 9,
  "centre": 15,
  "hm": {
   "r": [
    211.76879500000112,
    409.5017519999924
   ],
   "cnt": {
    "asian10": 6,
    "cafe10": 30,
    "culture15": 13,
    "night10": 82,
    "night3": 2,
    "rest10": 27,
    "sa10": 12,
    "shop10": 53,
    "super10": 3,
    "take10": 26,
    "veg10": 2
   },
   "near": {
    "asianGroc": {
     "m": 10,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 3,
     "p": {
      "n": "Core Cafe at Byrom Street"
     }
    },
    "gym": {
     "m": 3,
     "p": {
      "n": "HEAL Studios"
     }
    },
    "intl": {
     "m": 8,
     "p": {
      "n": "International Food Store"
     }
    },
    "lib": {
     "m": 4,
     "p": {
      "n": "Liverpool Central Library"
     }
    },
    "park": {
     "m": 9,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 8,
     "p": {
      "n": "M&S Simply Food"
     }
    },
    "topup": {
     "m": 4,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "pe": 156,
  "plo": 156,
  "rr": 5,
  "rn": 12,
  "pso": false
 },
 {
  "id": "vita-student-crosshall-street",
  "n": 28,
  "name": "Vita Student Crosshall Street",
  "lat": 53.4085111,
  "lng": -2.9851158,
  "addr": "5–7 Crosshall Street, L1 6DQ",
  "area": "City Centre",
  "areaZh": "市中心",
  "text": "A premium, hotel-style option near Liverpool ONE, with breakfast, housekeeping, gym classes and free bikes included. Priced at the higher end.",
  "textZh": "靠近 Liverpool ONE 的高端酒店式公寓，含早餐、保洁、健身课程和免费单车，价格偏高。",
  "uol": 21,
  "ljmu": 8,
  "lime": 8,
  "centre": 9,
  "hm": {
   "r": [
    198.37131960000093,
    439.59043480002276
   ],
   "cnt": {
    "asian10": 23,
    "cafe10": 71,
    "culture15": 21,
    "night10": 156,
    "night3": 16,
    "rest10": 93,
    "sa10": 16,
    "shop10": 192,
    "super10": 7,
    "take10": 74,
    "veg10": 6
   },
   "near": {
    "asianGroc": {
     "m": 7,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "Lovelocks"
     }
    },
    "gym": {
     "m": 5,
     "p": {
      "n": "HEAL Studios"
     }
    },
    "intl": {
     "m": 7,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "lib": {
     "m": 5,
     "p": {
      "n": "Liverpool Central Library"
     }
    },
    "park": {
     "m": 13,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 6,
     "p": {
      "n": "Aldi"
     }
    },
    "topup": {
     "m": 3,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "rr": 4.5,
  "rn": 10,
  "pso": true
 },
 {
  "id": "the-bridewell",
  "n": 29,
  "name": "The Bridewell",
  "lat": 53.4092146,
  "lng": -2.9870948,
  "addr": "Cheapside, L2 2DH",
  "area": "City Centre",
  "areaZh": "市中心",
  "text": "In the heart of the business district, close to the Cavern Quarter and Liverpool ONE. On-site gym, a comfy lounge and a desk workstation in every room.",
  "textZh": "位于商业区中心，靠近洞穴俱乐部一带和 Liverpool ONE。有健身房、舒适的休息区，每个房间都配有书桌工作区。",
  "uol": 23,
  "ljmu": 7,
  "lime": 11,
  "centre": 10,
  "hm": {
   "r": [
    185.23471760000123,
    431.7590728000207
   ],
   "cnt": {
    "asian10": 19,
    "cafe10": 64,
    "culture15": 19,
    "night10": 130,
    "night3": 17,
    "rest10": 72,
    "sa10": 12,
    "shop10": 172,
    "super10": 4,
    "take10": 56,
    "veg10": 3
   },
   "near": {
    "asianGroc": {
     "m": 9,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "Costa"
     }
    },
    "gym": {
     "m": 4,
     "p": {
      "n": "HEAL Studios"
     }
    },
    "intl": {
     "m": 9,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "lib": {
     "m": 4,
     "p": {
      "n": "Avril Robarts Library - LJMU"
     }
    },
    "park": {
     "m": 14,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 8,
     "p": {
      "n": "M&S Food"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "rr": 4,
  "rn": 6,
  "pso": true
 },
 {
  "id": "marybone-student-village",
  "n": 30,
  "name": "Marybone Student Village",
  "lat": 53.4115387,
  "lng": -2.9871833,
  "addr": "7 Marybone, L3 2BX",
  "area": "City Centre",
  "areaZh": "市中心",
  "text": "A large, sociable hall on the edge of the business district, a couple of minutes from LJMU’s City Campus and Moorfields station. Gym, cinema room and a staffed reception.",
  "textZh": "位于商业区边缘的大型公寓，社交氛围浓，几分钟即可到 LJMU 城市校区和 Moorfields 站。设有健身房、影音室和有人值守的前台。",
  "uol": 24,
  "ljmu": 4,
  "lime": 13,
  "centre": 15,
  "hm": {
   "r": [
    184.64725460000165,
    405.88719159999044
   ],
   "cnt": {
    "asian10": 6,
    "cafe10": 33,
    "culture15": 14,
    "night10": 87,
    "night3": 4,
    "rest10": 42,
    "sa10": 11,
    "shop10": 35,
    "take10": 20,
    "veg10": 3
   },
   "near": {
    "asianGroc": {
     "m": 12,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "Costa"
     }
    },
    "gym": {
     "m": 2,
     "p": {
      "n": "HEAL Studios"
     }
    },
    "intl": {
     "m": 12,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "lib": {
     "m": 1,
     "p": {
      "n": "Avril Robarts Library - LJMU"
     }
    },
    "park": {
     "m": 12,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 12,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "plo": 98,
  "rr": 4,
  "rn": 1,
  "pso": false
 },
 {
  "id": "moorfield",
  "n": 31,
  "name": "Moorfield",
  "lat": 53.4105348,
  "lng": -2.9874811,
  "addr": "29 Hatton Garden, L3 2EZ",
  "area": "City Centre",
  "areaZh": "市中心",
  "text": "Right beside LJMU’s City Campus, with a cinema room, study area and outdoor social space. The waterfront and Liverpool ONE are about ten minutes’ walk.",
  "textZh": "就在 LJMU 城市校区旁边，设有影音室、自习区和户外社交空间。步行约十分钟可到滨水区和 Liverpool ONE。",
  "uol": 24,
  "ljmu": 6,
  "lime": 12,
  "centre": 13,
  "hm": {
   "r": [
    182.6704582000001,
    417.06260639999726
   ],
   "cnt": {
    "asian10": 10,
    "cafe10": 41,
    "culture15": 17,
    "night10": 101,
    "night3": 8,
    "rest10": 54,
    "sa10": 11,
    "shop10": 69,
    "take10": 40,
    "veg10": 3
   },
   "near": {
    "asianGroc": {
     "m": 11,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "Costa"
     }
    },
    "gym": {
     "m": 2,
     "p": {
      "n": "HEAL Studios"
     }
    },
    "intl": {
     "m": 11,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "lib": {
     "m": 2,
     "p": {
      "n": "Avril Robarts Library - LJMU"
     }
    },
    "park": {
     "m": 13,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 11,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "GoLocalExtra"
     }
    }
   }
  },
  "pe": 115,
  "plo": 115,
  "rr": 4.5,
  "rn": 21,
  "pso": false
 },
 {
  "id": "yugo-ablett-house",
  "n": 32,
  "name": "Yugo Ablett House",
  "lat": 53.4109178,
  "lng": -2.9872847,
  "addr": "2 Great Crosshall Street, L3 2AF",
  "area": "City Centre",
  "areaZh": "市中心",
  "text": "Next to LJMU’s City Campus, with skyline views from the upper floors, study rooms and a 24-hour reception. Well set up for accessibility.",
  "textZh": "紧邻 LJMU 城市校区，高层可俯瞰城市天际线，有自习室和24小时前台，无障碍设施完善。",
  "uol": 24,
  "ljmu": 5,
  "lime": 12,
  "centre": 13,
  "hm": {
   "r": [
    183.97416140000072,
    412.79905040000443
   ],
   "cnt": {
    "asian10": 9,
    "cafe10": 38,
    "culture15": 17,
    "night10": 94,
    "night3": 4,
    "rest10": 51,
    "sa10": 11,
    "shop10": 56,
    "take10": 36,
    "veg10": 3
   },
   "near": {
    "asianGroc": {
     "m": 11,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "Costa"
     }
    },
    "gym": {
     "m": 2,
     "p": {
      "n": "HEAL Studios"
     }
    },
    "intl": {
     "m": 11,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "lib": {
     "m": 1,
     "p": {
      "n": "Avril Robarts Library - LJMU"
     }
    },
    "park": {
     "m": 13,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 11,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "GoLocalExtra"
     }
    }
   }
  },
  "pe": 137,
  "ps": 189,
  "plo": 137,
  "rr": 5,
  "rn": 10,
  "pso": false
 },
 {
  "id": "atlantic-point",
  "n": 33,
  "name": "Atlantic Point",
  "lat": 53.4143925,
  "lng": -2.9856727,
  "addr": "Naylor Street, L3 6LS",
  "area": "City Centre",
  "areaZh": "市中心",
  "text": "On a quieter street just north of the centre, five minutes from LJMU’s City Campus. Common room with a pool table, outdoor space and an on-site team.",
  "textZh": "位于市中心北边一条安静的街道上，到 LJMU 城市校区五分钟。有带台球桌的公共休息室、户外空间和驻场团队。",
  "uol": 25,
  "ljmu": 4,
  "lime": 15,
  "centre": 20,
  "hm": {
   "r": [
    194.67461740000184,
    374.11869000002486
   ],
   "cnt": {
    "cafe10": 9,
    "culture15": 10,
    "night10": 10,
    "rest10": 3,
    "sa10": 1,
    "shop10": 3,
    "take10": 3
   },
   "near": {
    "asianGroc": {
     "m": 16,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 6,
     "p": {
      "n": "Core Cafe at Byrom Street"
     }
    },
    "gym": {
     "m": 6,
     "p": {
      "n": "HEAL Studios"
     }
    },
    "intl": {
     "m": 14,
     "p": {
      "n": "International Food Store"
     }
    },
    "lib": {
     "m": 6,
     "p": {
      "n": "Avril Robarts Library - LJMU"
     }
    },
    "park": {
     "m": 10,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 14,
     "p": {
      "n": "M&S Simply Food"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Echo Shop"
     }
    }
   }
  },
  "pe": 123,
  "plo": 123,
  "rr": 4.5,
  "rn": 22,
  "pso": false
 },
 {
  "id": "glassworks",
  "n": 34,
  "name": "Glassworks",
  "lat": 53.4119698,
  "lng": -2.9877441,
  "addr": "36 Vauxhall Road, L3 6AU",
  "area": "City Centre",
  "areaZh": "市中心",
  "text": "A smaller, no-fuss hall on Vauxhall Road with a gym, lounge and study space. A few minutes from LJMU’s City Campus and Moorfields station.",
  "textZh": "位于沃克斯霍尔路的小型公寓，简单实用，设有健身房、休息室和自习区。几分钟即可到 LJMU 城市校区和 Moorfields 站。",
  "uol": 25,
  "ljmu": 4,
  "lime": 14,
  "centre": 15,
  "hm": {
   "r": [
    180.92466420000073,
    401.088186399989
   ],
   "cnt": {
    "asian10": 4,
    "cafe10": 26,
    "culture15": 14,
    "night10": 74,
    "night3": 4,
    "rest10": 32,
    "sa10": 9,
    "shop10": 19,
    "take10": 17,
    "veg10": 2
   },
   "near": {
    "asianGroc": {
     "m": 13,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "cafe": {
     "m": 3,
     "p": {
      "n": "Costa"
     }
    },
    "gym": {
     "m": 3,
     "p": {
      "n": "HEAL Studios"
     }
    },
    "intl": {
     "m": 13,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "lib": {
     "m": 1,
     "p": {
      "n": "Avril Robarts Library - LJMU"
     }
    },
    "park": {
     "m": 13,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 13,
     "p": {
      "n": "Seoul Plaza"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "GoLocalExtra"
     }
    }
   }
  },
  "pe": 140,
  "plo": 140,
  "rr": 4.8,
  "rn": 5,
  "pso": false
 },
 {
  "id": "europa",
  "n": 35,
  "name": "Europa",
  "lat": 53.4115982,
  "lng": -2.9647326,
  "addr": "Erskine Street, L6 1AH",
  "area": "Everton & Erskine Street",
  "areaZh": "埃弗顿与厄斯金街",
  "text": "One of the more affordable purpose-built options near the centre. Lounge, games area and residents’ events, about twelve minutes from campus.",
  "textZh": "市中心附近较实惠的学生公寓之一，有休息室、游戏区和住户活动，到校园约十二分钟。",
  "uol": 9,
  "ljmu": 18,
  "lime": 16,
  "centre": 28,
  "hm": {
   "r": [
    333.6750012000005,
    405.2248376000017
   ],
   "cnt": {
    "asian10": 6,
    "cafe10": 8,
    "culture15": 5,
    "night10": 3,
    "rest10": 6,
    "shop10": 5,
    "super10": 1,
    "take10": 8,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 6,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "Starbucks"
     }
    },
    "gym": {
     "m": 4,
     "p": {
      "n": "Momentum Leisure"
     }
    },
    "intl": {
     "m": 6,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 9,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 4,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 7,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Spar"
     }
    }
   }
  },
  "pe": 95,
  "plo": 95,
  "rr": 4.4,
  "rn": 19,
  "pso": false
 },
 {
  "id": "prospect-point",
  "n": 36,
  "name": "Prospect Point",
  "lat": 53.4113005,
  "lng": -2.9652135,
  "addr": "Moira Street, L6 1BA",
  "area": "Everton & Erskine Street",
  "areaZh": "埃弗顿与厄斯金街",
  "text": "A friendly building with communal kitchens, a dining area and regular social events. Strong security with a 24-hour team.",
  "textZh": "氛围友好的公寓，有公共厨房、用餐区和定期社交活动，24小时安保团队让人安心。",
  "uol": 9,
  "ljmu": 17,
  "lime": 15,
  "centre": 27,
  "hm": {
   "r": [
    330.48278700000117,
    408.53883399997153
   ],
   "cnt": {
    "asian10": 6,
    "cafe10": 10,
    "culture15": 5,
    "night10": 3,
    "rest10": 6,
    "shop10": 6,
    "super10": 1,
    "take10": 10,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 5,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 1,
     "p": {
      "n": "Starbucks"
     }
    },
    "gym": {
     "m": 3,
     "p": {
      "n": "Momentum Leisure"
     }
    },
    "intl": {
     "m": 5,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 8,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 4,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 6,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 1,
     "p": {
      "n": "Spar"
     }
    }
   }
  },
  "pe": 132,
  "plo": 132,
  "rr": 4.3,
  "rn": 19,
  "pso": false
 },
 {
  "id": "true-liverpool",
  "n": 37,
  "name": "true Liverpool",
  "lat": 53.411765,
  "lng": -2.9629261,
  "addr": "192 Erskine Street, L6 1AJ",
  "area": "Everton & Erskine Street",
  "areaZh": "埃弗顿与厄斯金街",
  "text": "A big, sociable building with a rooftop terrace and outdoor cinema, a 24/7 gym and free printing. About twelve minutes’ walk from campus.",
  "textZh": "大型公寓，社交氛围浓厚，有屋顶露台和露天影院、24小时健身房和免费打印，步行约十二分钟到利物浦大学。",
  "uol": 10,
  "ljmu": 19,
  "lime": 18,
  "centre": 30,
  "hm": {
   "r": [
    345.66654820000224,
    403.36801999997544
   ],
   "cnt": {
    "asian10": 4,
    "cafe10": 4,
    "culture15": 3,
    "night10": 2,
    "rest10": 6,
    "sa10": 1,
    "shop10": 6,
    "super10": 1,
    "take10": 7,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 8,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 3,
     "p": {
      "n": "Starbucks"
     }
    },
    "gym": {
     "m": 6,
     "p": {
      "n": "Momentum Leisure"
     }
    },
    "intl": {
     "m": 8,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 10,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 4,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 9,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "pe": 161,
  "ps": 205,
  "plo": 161,
  "rr": 4.8,
  "rn": 20,
  "pso": false
 },
 {
  "id": "unity-square",
  "n": 38,
  "name": "Unity Square",
  "lat": 53.4138525,
  "lng": -2.9678769,
  "addr": "26 Shaw Street, L6 1AA",
  "area": "Everton & Erskine Street",
  "areaZh": "埃弗顿与厄斯金街",
  "text": "On Shaw Street in Everton, close to Liverpool Hope’s Creative Campus. Courtyards, social spaces with big smart TVs and a 24/7 on-site team.",
  "textZh": "位于埃弗顿的肖街，靠近利物浦希望大学创意校区。有庭院、配大屏智能电视的社交空间和24小时驻场团队。",
  "uol": 13,
  "ljmu": 17,
  "lime": 16,
  "centre": 28,
  "hm": {
   "r": [
    312.80313780000205,
    380.1299700000346
   ],
   "cnt": {
    "asian10": 4,
    "cafe10": 6,
    "culture15": 5,
    "night10": 2,
    "rest10": 5,
    "shop10": 5,
    "super10": 1,
    "take10": 7,
    "veg10": 1
   },
   "near": {
    "asianGroc": {
     "m": 7,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 6,
     "p": {
      "n": "Starbucks"
     }
    },
    "gym": {
     "m": 3,
     "p": {
      "n": "Salisbury Amateur Boxing Club"
     }
    },
    "intl": {
     "m": 7,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 13,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 1,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 8,
     "p": {
      "n": "Lidl"
     }
    },
    "topup": {
     "m": 4,
     "p": {
      "n": "Emilia's"
     }
    }
   }
  },
  "pe": 129,
  "plo": 129,
  "rr": 4.6,
  "rn": 20,
  "pso": false
 },
 {
  "id": "city-point",
  "n": 39,
  "name": "City Point",
  "lat": 53.4176742,
  "lng": -2.9772191,
  "addr": "2 Great Homer Street, L5 3LD",
  "area": "Great Homer Street",
  "areaZh": "大荷马街",
  "text": "North of the centre, with lower rents and free car parking. Gym, concierge and a TV in every room, with buses into town.",
  "textZh": "位于市中心以北，租金较低，并有免费停车位。有健身房、礼宾服务，每间房都有电视，坐公交即可进城。",
  "uol": 23,
  "ljmu": 11,
  "lime": 19,
  "centre": 28,
  "hm": {
   "r": [
    250.78961420000005,
    337.58680559999954
   ],
   "cnt": {
    "cafe10": 2,
    "culture15": 2,
    "shop10": 2,
    "super10": 1
   },
   "near": {
    "asianGroc": {
     "m": 16,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 10,
     "p": {
      "n": "Core Cafe at Byrom Street"
     }
    },
    "gym": {
     "m": 11,
     "p": {
      "n": "Salisbury Amateur Boxing Club"
     }
    },
    "intl": {
     "m": 15,
     "p": {
      "n": "International Food Store"
     }
    },
    "lib": {
     "m": 15,
     "p": {
      "n": "Liverpool Central Library"
     }
    },
    "park": {
     "m": 2,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 10,
     "p": {
      "n": "Sainsbury's"
     }
    },
    "topup": {
     "m": 6,
     "p": {
      "n": "Everydayz — The Brow"
     }
    }
   }
  },
  "pe": 115,
  "plo": 115,
  "rr": 4.1,
  "rn": 7,
  "pso": false
 },
 {
  "id": "phoenix-place",
  "n": 40,
  "name": "Phoenix Place",
  "lat": 53.4178565,
  "lng": -2.9756642,
  "addr": "5 Prince Edwin Street, L5 3SJ",
  "area": "Great Homer Street",
  "areaZh": "大荷马街",
  "text": "A calmer spot north of the city centre, with a games room, picnic area and dishwashers in the flats. A short bus ride into town.",
  "textZh": "位于市中心以北较安静的区域，有游戏室、野餐区，每套公寓配洗碗机，坐公交很快进城。",
  "uol": 23,
  "ljmu": 13,
  "lime": 19,
  "centre": 29,
  "hm": {
   "r": [
    261.11104039999947,
    335.55744200001345
   ],
   "cnt": {
    "cafe10": 1,
    "culture15": 1,
    "shop10": 2,
    "super10": 1
   },
   "near": {
    "asianGroc": {
     "m": 16,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 9,
     "p": {
      "n": "May Duncans"
     }
    },
    "gym": {
     "m": 11,
     "p": {
      "n": "Salisbury Amateur Boxing Club"
     }
    },
    "intl": {
     "m": 16,
     "p": {
      "n": "International Food Store"
     }
    },
    "lib": {
     "m": 15,
     "p": {
      "n": "Liverpool Central Library"
     }
    },
    "park": {
     "m": 2,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 10,
     "p": {
      "n": "Sainsbury's"
     }
    },
    "topup": {
     "m": 4,
     "p": {
      "n": "Everydayz — The Brow"
     }
    }
   }
  },
  "pe": 125,
  "plo": 125,
  "rr": 4.8,
  "rn": 13,
  "pso": false
 },
 {
  "id": "poets-place",
  "n": 41,
  "name": "Poets Place",
  "lat": 53.4184095,
  "lng": -2.9774955,
  "addr": "6 Great Homer Street, L5 3AB",
  "area": "Great Homer Street",
  "areaZh": "大荷马街",
  "text": "Bright, self-contained studios with full-length windows and brand-new appliances. A 24-hour concierge and secure parking; good for postgraduates.",
  "textZh": "明亮的独立 Studio 套间，落地窗、全新家电，配24小时礼宾服务和安全停车位，适合研究生。",
  "uol": 25,
  "ljmu": 12,
  "lime": 20,
  "centre": 29,
  "hm": {
   "r": [
    248.95487100000182,
    329.40144599997365
   ],
   "cnt": {
    "cafe10": 1,
    "culture15": 1,
    "shop10": 2,
    "super10": 1,
    "take10": 1
   },
   "near": {
    "asianGroc": {
     "m": 18,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 10,
     "p": {
      "n": "May Duncans"
     }
    },
    "gym": {
     "m": 9,
     "p": {
      "n": "The Gym"
     }
    },
    "intl": {
     "m": 17,
     "p": {
      "n": "International Food Store"
     }
    },
    "lib": {
     "m": 16,
     "p": {
      "n": "Liverpool Central Library"
     }
    },
    "park": {
     "m": 1,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 9,
     "p": {
      "n": "Sainsbury's"
     }
    },
    "topup": {
     "m": 7,
     "p": {
      "n": "Everydayz — The Brow"
     }
    }
   }
  },
  "pso": true
 },
 {
  "id": "paddington-park-house",
  "n": 42,
  "name": "Paddington Park House",
  "lat": 53.4059726,
  "lng": -2.9574436,
  "addr": "1 Paddington Village, L7 3RG",
  "area": "Edge Hill & Kensington",
  "areaZh": "埃奇山与肯辛顿",
  "text": "Part of the new Paddington Village innovation district, eight minutes from campus. Very fast wired internet, a courtyard and 24-hour security.",
  "textZh": "位于新的帕丁顿村创新区，到校园八分钟。有超高速有线网络、庭院和24小时安保。",
  "uol": 10,
  "ljmu": 18,
  "lime": 22,
  "centre": 32,
  "hm": {
   "r": [
    382.05938320000115,
    467.8490168000228
   ],
   "cnt": {
    "asian10": 2,
    "cafe10": 8,
    "culture15": 4,
    "night10": 6,
    "night3": 2,
    "rest10": 3,
    "sa10": 1,
    "shop10": 2,
    "super10": 2,
    "take10": 4
   },
   "near": {
    "asianGroc": {
     "m": 13,
     "p": {
      "n": "eJoy Asian Foods"
     }
    },
    "cafe": {
     "m": 8,
     "p": {
      "n": "Caffè Nero"
     }
    },
    "gym": {
     "m": 10,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 13,
     "p": {
      "n": "eJoy Asian Foods"
     }
    },
    "lib": {
     "m": 9,
     "p": {
      "n": "Harold Cohen Library"
     }
    },
    "park": {
     "m": 7,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 2,
     "p": {
      "n": ""
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Go Local"
     }
    }
   }
  },
  "pe": 141,
  "plo": 141,
  "rr": 4.3,
  "rn": 28,
  "pso": false
 },
 {
  "id": "edge-hill-6-bed-student-houses",
  "n": 43,
  "name": "Edge Hill 6-bed student houses",
  "lat": 53.4088423,
  "lng": -2.9564328,
  "addr": "Empress Road, L7",
  "area": "Edge Hill & Kensington",
  "areaZh": "埃奇山与肯辛顿",
  "text": "Six-bedroom houses for larger friendship groups, near Edge Hill station. Living room, rear yard and fast Wi-Fi.",
  "textZh": "适合多人朋友合住的六居室独栋房屋，靠近埃奇山站，有客厅、后院和高速 Wi-Fi。",
  "uol": 11,
  "ljmu": 21,
  "lime": 23,
  "centre": 34,
  "hm": {
   "r": [
    388.76907360000104,
    435.9035163999662
   ],
   "cnt": {
    "asian10": 3,
    "cafe10": 6,
    "culture15": 4,
    "night10": 6,
    "rest10": 6,
    "sa10": 4,
    "shop10": 4,
    "super10": 2,
    "take10": 9
   },
   "near": {
    "asianGroc": {
     "m": 14,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 10,
     "p": {
      "n": "Starbucks"
     }
    },
    "gym": {
     "m": 13,
     "p": {
      "n": "Momentum Leisure"
     }
    },
    "intl": {
     "m": 14,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 6,
     "p": {
      "n": "Kensington Library"
     }
    },
    "park": {
     "m": 4,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 6,
     "p": {
      "n": ""
     }
    },
    "topup": {
     "m": 3,
     "p": {
      "n": "Hall Lane News"
     }
    }
   }
  },
  "plo": 130,
  "pso": false
 },
 {
  "id": "the-railyard",
  "n": 44,
  "name": "The Railyard",
  "lat": 53.4019166,
  "lng": -2.9584701,
  "addr": "Crown Station Place, L7 3LA",
  "area": "Edge Hill & Kensington",
  "areaZh": "埃奇山与肯辛顿",
  "text": "Near the site of the historic Crown Street station, a few minutes from the University of Liverpool. BBQ area, outdoor space and social events.",
  "textZh": "靠近历史悠久的皇冠街车站旧址，几分钟即到利物浦大学。有烧烤区、户外空间和楼内社交活动。",
  "uol": 12,
  "ljmu": 16,
  "lime": 23,
  "centre": 31,
  "hm": {
   "r": [
    375.2454762000009,
    513.0004088000062
   ],
   "cnt": {
    "asian10": 1,
    "cafe10": 9,
    "culture15": 6,
    "night10": 7,
    "rest10": 3,
    "shop10": 1,
    "super10": 5,
    "take10": 5
   },
   "near": {
    "asianGroc": {
     "m": 8,
     "p": {
      "n": "eJoy Asian Foods"
     }
    },
    "cafe": {
     "m": 5,
     "p": {
      "n": ""
     }
    },
    "gym": {
     "m": 9,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 8,
     "p": {
      "n": "eJoy Asian Foods"
     }
    },
    "lib": {
     "m": 6,
     "p": {
      "n": "Sydney Jones Library"
     }
    },
    "park": {
     "m": 2,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 7,
     "p": {
      "n": "Tesco"
     }
    },
    "topup": {
     "m": 7,
     "p": {
      "n": "Tesco Express"
     }
    }
   }
  },
  "pe": 169,
  "plo": 169,
  "rr": 5,
  "rn": 10,
  "pso": false
 },
 {
  "id": "queensland-place",
  "n": 45,
  "name": "Queensland Place",
  "lat": 53.4035256,
  "lng": -2.9549952,
  "addr": "2 Chatham Place, L7 3AA",
  "area": "Edge Hill & Kensington",
  "areaZh": "埃奇山与肯辛顿",
  "text": "One of the more affordable options near campus, on the Edge Hill side. Gym, media room and games room, close to Edge Hill station.",
  "textZh": "校园附近较实惠的公寓之一，位于埃奇山一侧。有健身房、媒体室和游戏室，靠近埃奇山站。",
  "uol": 13,
  "ljmu": 19,
  "lime": 25,
  "centre": 34,
  "hm": {
   "r": [
    398.31186240000125,
    495.0890207999842
   ],
   "cnt": {
    "cafe10": 2,
    "culture15": 4,
    "night10": 5,
    "night3": 1,
    "rest10": 2,
    "sa10": 1,
    "shop10": 2,
    "super10": 2,
    "take10": 2
   },
   "near": {
    "asianGroc": {
     "m": 13,
     "p": {
      "n": "eJoy Asian Foods"
     }
    },
    "cafe": {
     "m": 9,
     "p": {
      "n": ""
     }
    },
    "gym": {
     "m": 12,
     "p": {
      "n": "Sports and Fitness Centre"
     }
    },
    "intl": {
     "m": 13,
     "p": {
      "n": "eJoy Asian Foods"
     }
    },
    "lib": {
     "m": 9,
     "p": {
      "n": "Sydney Jones Library"
     }
    },
    "park": {
     "m": 4,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 2,
     "p": {
      "n": "Tesco"
     }
    },
    "topup": {
     "m": 2,
     "p": {
      "n": "Tesco"
     }
    }
   }
  },
  "pe": 89,
  "plo": 89,
  "rr": 4.7,
  "rn": 27,
  "pso": false
 },
 {
  "id": "kensington-5-bed-student-houses",
  "n": 46,
  "name": "Kensington 5-bed student houses",
  "lat": 53.4088249,
  "lng": -2.9544264,
  "addr": "Jubilee Drive, L7",
  "area": "Edge Hill & Kensington",
  "areaZh": "埃奇山与肯辛顿",
  "text": "Five-bedroom houses with brand-new kitchens and shared bathrooms. Around fifteen minutes’ walk to campus, with buses on Edge Lane.",
  "textZh": "配全新厨房的五居室独栋房屋（共用卫生间），步行约十五分钟到校园，Edge Lane 上有公交。",
  "uol": 13,
  "ljmu": 23,
  "lime": 25,
  "centre": 36,
  "hm": {
   "r": [
    402.08755680000075,
    436.09721320001506
   ],
   "cnt": {
    "asian10": 2,
    "cafe10": 2,
    "culture15": 3,
    "night10": 7,
    "rest10": 8,
    "sa10": 6,
    "shop10": 5,
    "super10": 3,
    "take10": 8
   },
   "near": {
    "asianGroc": {
     "m": 16,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 7,
     "p": {
      "n": "The Croissant of Inequality"
     }
    },
    "gym": {
     "m": 15,
     "p": {
      "n": "Momentum Leisure"
     }
    },
    "intl": {
     "m": 16,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 5,
     "p": {
      "n": "Kensington Library"
     }
    },
    "park": {
     "m": 1,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 6,
     "p": {
      "n": ""
     }
    },
    "topup": {
     "m": 5,
     "p": {
      "n": "Hall Lane News"
     }
    }
   }
  },
  "plo": 140,
  "pso": false
 },
 {
  "id": "kensington-4-bed-student-houses",
  "n": 47,
  "name": "Kensington 4-bed student houses",
  "lat": 53.413861,
  "lng": -2.9475852,
  "addr": "Halsbury Road, L6",
  "area": "Edge Hill & Kensington",
  "areaZh": "埃奇山与肯辛顿",
  "text": "Four-bedroom houses in Kensington, a popular student area east of the centre. Modern kitchens, a cosy living room and a rear yard.",
  "textZh": "位于市中心以东、深受学生欢迎的肯辛顿的四居室独栋房屋，配现代厨房、温馨客厅和后院。",
  "uol": 24,
  "ljmu": 34,
  "lime": 34,
  "centre": 46,
  "hm": {
   "r": [
    447.4994424000022,
    380.03534800003615
   ],
   "cnt": {
    "asian10": 5,
    "cafe10": 6,
    "culture15": 1,
    "night10": 9,
    "night3": 1,
    "rest10": 10,
    "sa10": 6,
    "shop10": 14,
    "super10": 3,
    "take10": 15
   },
   "near": {
    "asianGroc": {
     "m": 25,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "cafe": {
     "m": 2,
     "p": {
      "n": "Molly Cafe"
     }
    },
    "gym": {
     "m": 18,
     "p": {
      "n": "JD Gyms"
     }
    },
    "intl": {
     "m": 25,
     "p": {
      "n": "SIDA - Chinese Supermarket"
     }
    },
    "lib": {
     "m": 8,
     "p": {
      "n": "Kensington Library"
     }
    },
    "park": {
     "m": 7,
     "p": {
      "n": "Green-space boundary reference point"
     }
    },
    "super": {
     "m": 3,
     "p": {
      "n": "Fresh One"
     }
    },
    "topup": {
     "m": 3,
     "p": {
      "n": "Best Butchers"
     }
    }
   }
  },
  "plo": 130,
  "pso": false
 }
];

};
defs["./home-match-core.js"] = function (module, exports, require) {
/* 自动生成，请勿手改：node scripts/extract-data.cjs
   内容原样截取自网页版 home-match.js（题目、中英文文案、权重、打分、人物画像），外面包一层无 DOM 的工厂函数。 */
'use strict';
module.exports = function createCore(HOMES, opts) {
  opts = opts || {};
  const lang = opts.lang === 'en' ? 'en' : 'zh';
  const isChinese = () => lang === 'zh';
  const local = (en, zh) => isChinese() ? zh : en;
  const state = { answers: opts.answers || {} };
  const subject = null, subjName = s => s.name;
  const matchesHomeFilters = opts.filter || (() => true);
  const LON0 = -3.015, LAT0 = 53.448, KX = 6638.0, KY = 11132.0;
  const raw = (lat, lon) => [(lon - LON0) * KX, (LAT0 - lat) * KY];
  const walkMin = (a, b) => Math.round(Math.hypot(a[0] - b[0], a[1] - b[1]) * 10 * 1.3 / 80);
  const walking = (a, b) => Math.max(1, walkMin(a, b));
  const CAMPUSES = {
    uol: ['University of Liverpool main campus', 53.4065, -2.9663],
    'ljmu-city': ['LJMU City campus', 53.4127, -2.9838],
    'ljmu-mp': ['LJMU Mount Pleasant campus', 53.4030, -2.9725],
    'hope-park': ['Liverpool Hope University Hope Park campus', 53.3905, -2.8917],
    'hope-creative': ['Hope University Creative campus', 53.4190, -2.9688],
    lipa: ['Liverpool Institute for Performing Arts', 53.3996, -2.9700],
    unsure: ['Liverpool city centre reference point', 53.4035, -2.9868],
  };
  const QUESTIONS = [
    { id: 'campus', q: 'Which campus will you mainly study at?', hint: 'Used to estimate your commute. With the University of Liverpool you can also use the side panel "My subject" to locate the teaching building for your course.', opts: [
      ['uol', '🎓', 'University of Liverpool', 'Main city-centre campus'], ['ljmu-city', '🎓', 'Liverpool John Moores · City', 'Byrom Street'],
      ['ljmu-mp', '🎓', 'Liverpool John Moores · Mount Pleasant', 'Mount Pleasant campus'], ['hope-park', '🎓', 'Liverpool Hope University', 'Hope Park, Childwall'],
      ['hope-creative', '🎭', 'Hope University · Creative Campus', 'Everton'], ['lipa', '🎤', 'Liverpool Institute for Performing Arts', 'Mount Street'], ['unsure', '🤔', 'Not sure yet', 'Use Liverpool city centre as a reference'] ] },
    { id: 'dinner', q: 'When you are hungry at 7pm, you usually…', opts: [
      ['cook', '🍳', 'Cook for yourself', 'An easy grocery run matters'], ['out', '🍽️', 'Go out to eat with friends', 'You want to explore nearby restaurants'],
      ['takeaway', '🥡', 'Grab takeaway or order in', 'Quick and easy, fewer dishes'], ['mix', '🎲', 'Any of these, depending on mood', 'Cook, eat out and takeaway take turns'] ] },
    { id: 'shop', q: 'How do you like to stock up on food?', opts: [
      ['topup', '🧺', 'A little at a time, as you need it', 'A nearby food shop makes life easy'], ['weekly', '🛒', 'One big weekly shop', 'You want to be close to a supermarket'],
      ['special', '🌶️', 'You hunt down familiar ingredients', 'Asian or international food shops are a plus'], ['rarely', '🙃', 'You rarely buy groceries', 'You mostly eat out'] ] },
    { id: 'flavour', multi: true, max: 3, q: 'What kinds of food do you want nearby?', hint: 'Multi-select; choosing "Anything goes" clears the other picks.', opts: [
      ['east', '🍜', 'East & Southeast Asian', 'Chinese, Japanese, Korean, Thai and more'], ['south', '🍛', 'South Asian & Middle Eastern', 'Curry, kebabs, Lebanese dishes and more'],
      ['veg', '🥗', 'Plant-based', 'Places flagged in the reference data'], ['any', '😋', 'Anything goes', 'No real preference'] ] },
    { id: 'study', q: 'Where do you settle into study mode most easily?', opts: [
      ['library', '📚', 'A library', 'You like a dedicated study space'], ['cafe', '☕', 'A café', 'A laptop and a coffee'],
      ['desk', '🪑', 'Your own desk', 'You focus better at home'], ['any', '🎒', 'Anywhere works', 'You are not fussy about where you study'] ] },
    { id: 'free', multi: true, max: 2, q: 'On a free Saturday afternoon, you would rather…', hint: 'Pick up to two.', opts: [
      ['shops', '🛍️', 'Wander the shops', 'Clothes, bookshops, little finds'], ['park', '🌳', 'Walk or run in a park', 'Get some fresh air'],
      ['gym', '🏋️', 'Work out or play a sport', 'Keep the energy up'], ['culture', '🎨', 'See an exhibition, a film or a show', 'Add a little inspiration'], ['home', '🛋️', 'Stay cosy at home', 'Recharge the batteries'] ] },
    { id: 'night', q: 'How would you describe your evenings?', hint: 'This only compares how many night-time venues are listed; it does not rate street noise or safety.', opts: [
      ['calm', '🌙', 'Early to bed', 'You do not need to be near pubs and clubs'], ['some', '🎶', 'Out occasionally', 'It does not have to be busy every day'], ['lots', '🪩', 'Often out at night', 'You want plenty of night venues close by'] ] },
    { id: 'walk', q: 'How long are you happy to walk to class?', hint: 'Walk time is a distance estimate, not a live route; "within 15 minutes" will not relax automatically.', opts: [
      ['close', '🏃', 'The shorter the better', 'Short-commute homes come first'], ['mid', '🚶', 'Around 15 minutes', 'Only homes that meet this cap'],
      ['far', '🚌', 'A bit further is fine', 'Day-to-day life matters more — check transport separately'] ] },
  ];

  const CAMPUS_ZH = {
    uol:'利物浦大学主校区', 'ljmu-city':'利物浦约翰摩尔大学 City 校区',
    'ljmu-mp':'利物浦约翰摩尔大学 Mount Pleasant 校区', 'hope-park':'利物浦希望大学 Hope Park 校区',
    'hope-creative':'利物浦希望大学 Creative 校区', lipa:'利物浦表演艺术学院', unsure:'利物浦市中心参考点'
  };
  // Only display copy is translated; option IDs and the original scoring stay unchanged.
  const QUESTION_ZH = {
    campus:{q:'你主要会在哪个校区上课？',hint:'用于估算通勤。利物浦大学学生还可以通过侧边“我的专业”找到专业对应的教学楼。',opts:[
      ['利物浦大学','市中心主校区'],['利物浦约翰摩尔大学 · City','Byrom Street'],
      ['利物浦约翰摩尔大学 · Mount Pleasant','Mount Pleasant 校区'],['利物浦希望大学','Childwall 的 Hope Park 校区'],
      ['利物浦希望大学 · Creative 校区','Everton'],['利物浦表演艺术学院','Mount Street'],['还不确定','先以利物浦市中心作为参考']]},
    dinner:{q:'晚上七点饿了，你通常会……',opts:[['自己下厨','买菜方便很重要'],['和朋友出去吃','想探索附近的餐厅'],['买外卖或点餐到家','省时省心，少洗碗'],['看心情，哪种都行','做饭、外食和外卖轮着来']]},
    shop:{q:'你习惯怎样采购食材？',opts:[['需要时买一点','家附近有食品店就方便'],['每周一次大采购','希望离超市近一些'],['专门寻找熟悉的食材','亚洲或国际食品店是加分项'],['很少买菜','大多在外面吃']]},
    flavour:{q:'你希望附近有哪些口味？',hint:'可以多选；选择“都可以”会清除其他选项。',opts:[['东亚与东南亚美食','中餐、日料、韩餐、泰餐等'],['南亚与中东美食','咖喱、烤肉、黎巴嫩菜等'],['植物性饮食','按参考资料中的标记筛选'],['都可以','没有特别偏好']]},
    study:{q:'你在哪里最容易进入学习状态？',opts:[['图书馆','喜欢专门的学习空间'],['咖啡馆','一台电脑，一杯咖啡'],['自己的书桌','在家更容易专注'],['哪里都行','不太挑学习地点']]},
    free:{q:'周六下午有空，你更想……',hint:'最多选两项。',opts:[['逛逛商店','衣服、书店和小惊喜'],['在公园散步或跑步','出去呼吸新鲜空气'],['健身或运动','保持活力'],['看展、电影或演出','给生活添点灵感'],['舒服地待在家','休息一下，恢复精力']]},
    night:{q:'你的夜晚通常是什么样？',hint:'这里只比较已记录夜间场所的数量，不评价街道噪音或安全。',opts:[['早睡早起','不需要住在酒吧和夜店旁'],['偶尔出去玩','不用每天都很热闹'],['经常享受夜生活','希望附近有丰富的夜间去处']]},
    walk:{q:'你愿意步行多久去上课？',hint:'步行时间按距离估算，并非实时路线；选择“15 分钟以内”后不会自动放宽条件。',opts:[['越近越好','优先考虑通勤短的公寓'],['15 分钟左右','只保留符合这个上限的公寓'],['远一点也可以','更看重日常生活便利，交通需另行确认']]}
  };
  function displayQuestion(question) {
    if (!isChinese()) return question;
    const copy = QUESTION_ZH[question.id];
    return {...question, q:copy.q, hint:copy.hint, opts:question.opts.map(([id,emoji],index)=>[id,emoji,...copy.opts[index]])};
  }


  const cleanAnswers = input => {
    const out = {};
    if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
    QUESTIONS.forEach(q => {
      const allowed = new Set(q.opts.map(o => o[0])), value = input[q.id];
      if (q.multi && Array.isArray(value)) {
        const selected = [...new Set(value.filter(v => typeof v === 'string' && allowed.has(v)))].slice(0, q.max);
        if (selected.length) out[q.id] = selected.includes('any') ? ['any'] : selected;
      } else if (!q.multi && typeof value === 'string' && allowed.has(value)) out[q.id] = value;
    });
    return out;
  };

  const countOf = (home, key) => home.hm.cnt[key] || 0;
  const PLACE_ZH = {super:'超市',topup:'食品店',intl:'国际食品店',asianGroc:'亚洲食品店',cafe:'咖啡馆',lib:'图书馆',park:'绿地',gym:'健身房'};
  const placeName = (place, fallback) => place.n === 'Green-space boundary reference point' ? local(place.n,'绿地边界参考点') : (place.n || fallback);
  const nearText = (home, key, fallback) => {
    const place = home.hm.near[key], label = local(fallback,PLACE_ZH[key] || fallback);
    return place ? local(`${placeName(place.p,label)}: about ${place.m} min on foot`,`${placeName(place.p,label)}：预计步行约 ${place.m} 分钟`) : local(`No usable distance recorded for the ${fallback}`,`暂无${label}的有效距离记录`);
  };
  const usesSubject = () => state.answers.campus === 'uol' && !!subject;
  const campusName = () => usesSubject() ? local(`nearest teaching building for ${subjName(subject)}`,`${subjName(subject)}最近的教学楼`) : local((CAMPUSES[state.answers.campus] || CAMPUSES.unsure)[0],CAMPUS_ZH[state.answers.campus] || CAMPUS_ZH.unsure);
  const campusText = home => {
    const prefix = usesSubject() ? `${campusName()}${home.subjB ? `（${home.subjB}）` : ''}` : campusName();
    return local(`${prefix}: about ${home.hm.campus} min on foot${home.hm.campus > 30 ? ', consider public transport' : ''}`,`${prefix}：预计步行约 ${home.hm.campus} 分钟${home.hm.campus > 30 ? '，建议另查公共交通' : ''}`);
  };
  const metrics = {
    super: {dir:-1, value:h=>h.hm.near.super?.m ?? 999, spot:'super', ico:'🛒', good:h=>nearText(h,'super','supermarket'), bad:h=>nearText(h,'super','supermarket')},
    super10: {dir:1, value:h=>countOf(h,'super10')},
    topup: {dir:-1, value:h=>h.hm.near.topup?.m ?? 999, spot:'topup', ico:'🧺', good:h=>nearText(h,'topup','food shop'), bad:h=>nearText(h,'topup','food shop')},
    intl: {dir:-1, value:h=>h.hm.near.intl?.m ?? 999, spot:'intl', ico:'🌶️', good:h=>local(`International grocery reference: ${nearText(h,'intl','international food shop')}`,`国际食材购物参考：${nearText(h,'intl','international food shop')}`), bad:h=>nearText(h,'intl','international food shop')},
    asianGroc: {dir:-1, value:h=>h.hm.near.asianGroc?.m ?? 999, spot:'asianGroc', ico:'🥢', good:h=>local(`Asian grocery reference: ${nearText(h,'asianGroc','Asian food shop')}`,`亚洲食材购物参考：${nearText(h,'asianGroc','Asian food shop')}`), bad:h=>nearText(h,'asianGroc','Asian food shop')},
    rest10: {dir:1, value:h=>countOf(h,'rest10'), ico:'🍽️', good:h=>local(`About a 10-minute radius holds ${countOf(h,'rest10')} restaurants`,`约 10 分钟范围内记录有 ${countOf(h,'rest10')} 家餐厅`), bad:h=>local(`Fewer restaurants listed within about 10 minutes (${countOf(h,'rest10')} places)`,`约 10 分钟范围内记录的餐厅较少（${countOf(h,'rest10')} 家）`)},
    cafe10: {dir:1, value:h=>countOf(h,'cafe10'), spot:'cafe', ico:'☕', good:h=>local(`About a 10-minute radius holds ${countOf(h,'cafe10')} cafés; ${nearText(h,'cafe','café')}`,`约 10 分钟范围内记录有 ${countOf(h,'cafe10')} 家咖啡馆；${nearText(h,'cafe','café')}`), bad:h=>local(`About a 10-minute radius holds ${countOf(h,'cafe10')} cafés`,`约 10 分钟范围内记录有 ${countOf(h,'cafe10')} 家咖啡馆`)},
    take10: {dir:1, value:h=>countOf(h,'take10'), ico:'🥡', good:h=>local(`About a 10-minute radius holds ${countOf(h,'take10')} takeaway spots`,`约 10 分钟范围内记录有 ${countOf(h,'take10')} 家外卖店`), bad:h=>local(`Fewer takeaway places listed within about 10 minutes (${countOf(h,'take10')} places)`,`约 10 分钟范围内记录的外卖店较少（${countOf(h,'take10')} 家）`)},
    asian10: {dir:1, value:h=>countOf(h,'asian10'), ico:'🍜', good:h=>local(`About a 10-minute radius holds ${countOf(h,'asian10')} East and Southeast Asian places`,`约 10 分钟范围内记录有 ${countOf(h,'asian10')} 家东亚与东南亚餐饮店`), bad:h=>local(`Fewer East and Southeast Asian places nearby (${countOf(h,'asian10')} listed)`,`附近记录的东亚与东南亚餐饮店较少（${countOf(h,'asian10')} 家）`)},
    sa10: {dir:1, value:h=>countOf(h,'sa10'), ico:'🍛', good:h=>local(`About a 10-minute radius holds ${countOf(h,'sa10')} South Asian and Middle Eastern places`,`约 10 分钟范围内记录有 ${countOf(h,'sa10')} 家南亚与中东餐饮店`), bad:h=>local(`Fewer South Asian and Middle Eastern places nearby (${countOf(h,'sa10')} listed)`,`附近记录的南亚与中东餐饮店较少（${countOf(h,'sa10')} 家）`)},
    veg10: {dir:1, value:h=>countOf(h,'veg10'), ico:'🥗', good:h=>local(`About a 10-minute radius has ${countOf(h,'veg10')} plant-based listings - check menus to be sure`,`约 10 分钟范围内有 ${countOf(h,'veg10')} 处植物性饮食记录，请另行确认菜单`), bad:h=>local('Few plant-based listings nearby - ask the venues about their menus','附近植物性饮食记录较少，请向店家确认菜单')},
    lib: {dir:-1, value:h=>h.hm.near.lib?.m ?? 999, spot:'lib', ico:'📚', good:h=>nearText(h,'lib','A library'), bad:h=>nearText(h,'lib','A library')},
    nightFew: {dir:-1, value:h=>countOf(h,'night3'), ico:'🌙', good:h=>local(`About a 3-minute radius holds ${countOf(h,'night3')} night venues; this is not a noise rating`,`约 3 分钟范围内记录有 ${countOf(h,'night3')} 处夜间场所，这不是噪音评分`), bad:h=>local(`About a 3-minute radius holds ${countOf(h,'night3')} night venues — check real noise when you view`,`约 3 分钟范围内记录有 ${countOf(h,'night3')} 处夜间场所，请在看房时确认实际噪音`)},
    night10: {dir:1, value:h=>countOf(h,'night10'), ico:'🪩', good:h=>local(`About a 10-minute radius holds ${countOf(h,'night10')} pubs and night venues`,`约 10 分钟范围内记录有 ${countOf(h,'night10')} 处酒吧和夜间场所`), bad:h=>local(`Fewer night venues listed within about 10 minutes (${countOf(h,'night10')} places)`,`约 10 分钟范围内记录的夜间场所较少（${countOf(h,'night10')} 处）`)},
    shop10: {dir:1, value:h=>countOf(h,'shop10'), ico:'🛍️', good:h=>local(`About a 10-minute radius holds ${countOf(h,'shop10')} retail shops`,`约 10 分钟范围内记录有 ${countOf(h,'shop10')} 家零售商店`), bad:h=>local(`Fewer retail shops nearby (about a 10-minute radius, ${countOf(h,'shop10')} places)`,`附近记录的零售商店较少（约 10 分钟范围内 ${countOf(h,'shop10')} 家）`)},
    park: {dir:-1, value:h=>h.hm.near.park?.m ?? 999, spot:'park', ico:'🌳', good:h=>`${nearText(h,'park','green space')}${local('; check where the entrance is','；请另行确认入口位置')}`, bad:h=>`${nearText(h,'park','green space')}${local('; this is not the entrance route','；此距离并非到入口的实际路线')}`},
    gym: {dir:-1, value:h=>h.hm.near.gym?.m ?? 999, spot:'gym', ico:'🏋️', good:h=>nearText(h,'gym','gym'), bad:h=>nearText(h,'gym','gym')},
    culture15: {dir:1, value:h=>countOf(h,'culture15'), ico:'🎨', good:h=>local(`About a 15-minute radius holds ${countOf(h,'culture15')} museums, galleries or performance venues`,`约 15 分钟范围内记录有 ${countOf(h,'culture15')} 处博物馆、画廊或演出场所`), bad:h=>local(`Fewer cultural venues nearby (about a 15-minute radius, ${countOf(h,'culture15')} places)`,`附近记录的文化场所较少（约 15 分钟范围内 ${countOf(h,'culture15')} 处）`)},
    campus: {dir:-1, value:h=>h.hm.campus, ico:'🎓', good:campusText, bad:campusText},
  };
  function weightsFor(answers) {
    const weights = {}, add = (key, weight) => { weights[key] = (weights[key] || 0) + weight; };
    ({cook:()=>{add('super',2);add('super10',.5);},out:()=>{add('rest10',2);add('cafe10',.5);},takeaway:()=>{add('take10',2);add('topup',.5);},mix:()=>{add('rest10',.7);add('take10',.7);add('super',.7);}})[answers.dinner]?.();
    const flavours = answers.flavour || [];
    ({topup:()=>add('topup',1.5),weekly:()=>{add('super',1.5);add('super10',.5);},special:()=>add(flavours.includes('east') && !flavours.includes('south') ? 'asianGroc' : 'intl',2)})[answers.shop]?.();
    if (flavours.includes('east')) add('asian10',1.5);
    if (flavours.includes('south')) add('sa10',1.5);
    if (flavours.includes('veg')) add('veg10',1);
    ({library:()=>add('lib',2),cafe:()=>add('cafe10',1.8),desk:()=>add('nightFew',.6)})[answers.study]?.();
    (answers.free || []).forEach(choice=>({shops:()=>add('shop10',1.4),park:()=>add('park',1.4),gym:()=>add('gym',1.4),culture:()=>add('culture15',1.4),home:()=>add('nightFew',.3)})[choice]?.());
    ({calm:()=>add('nightFew',1.5),some:()=>add('night10',.4),lots:()=>add('night10',2)})[answers.night]?.();
    add('campus',{close:3,mid:1.6,far:.5}[answers.walk] || 1);
    return weights;
  }
  function matchHomes() {
    const campus = CAMPUSES[state.answers.campus] || CAMPUSES.unsure, campusPoint = raw(campus[1],campus[2]);
    HOMES.forEach(home => {home.hm.campus = usesSubject() && Number.isFinite(home.subj) ? Math.max(1,home.subj) : walking(home.hm.r,campusPoint);});
    const weights = weightsFor(state.answers), keys = Object.keys(weights), percentiles = {};
    keys.forEach(key => {
      const values = HOMES.map(home => metrics[key].value(home) * metrics[key].dir), ranks = new Map();
      HOMES.forEach((home,i) => {let lower=0,ties=0;values.forEach(value=>{if(value<values[i])lower++;else if(value===values[i])ties++;});ranks.set(home.id,(lower+(ties-1)/2)/Math.max(1,HOMES.length-1));});
      percentiles[key] = ranks;
    });
    const filtered = HOMES.filter(matchesHomeFilters);
    // Historical sold-out labels are not live inventory; keep them and disclose on each result.
    const pool = state.answers.walk === 'mid' ? filtered.filter(home => home.hm.campus <= 15) : filtered;
    const total = keys.reduce((sum,key)=>sum+weights[key],0);
    // "The shorter the better" promises short-commute homes first: homes within a few minutes of the
    // shortest available commute (or within 10 minutes) form the first tier; lifestyle score orders each tier.
    const shortest = pool.reduce((m,home)=>Math.min(m,home.hm.campus),Infinity), shortCap = Math.max(10, shortest + 4);
    const tier = home => state.answers.walk === 'close' && home.hm.campus > shortCap ? 1 : 0;
    const scored = pool.map(home=>({h:home,score:keys.reduce((sum,key)=>sum+weights[key]*percentiles[key].get(home.id),0)/total})).sort((a,b)=>tier(a.h)-tier(b.h) || b.score-a.score || a.h.hm.campus-b.h.hm.campus || a.h.n-b.h.n);
    const picks = [];
    // Prefer distinct blocks; when fewer than three qualify, show the actual number without widening filters.
    for (const entry of scored) {
      if (picks.length === 3) break;
      if (picks.some(p=>Math.hypot(p.h.hm.r[0]-entry.h.hm.r[0],p.h.hm.r[1]-entry.h.hm.r[1])<12)) continue;
      picks.push(entry);
    }
    // Nearby homes can still be useful alternatives if no other block qualifies.
    if (picks.length < Math.min(3,scored.length)) scored.forEach(entry=>{if(picks.length<3 && !picks.includes(entry)) picks.push(entry);});
    picks.forEach(entry => {
      const ranked = keys.filter(key=>metrics[key].good).map(key=>({key,weight:weights[key],rank:percentiles[key].get(entry.h.id)}));
      entry.good = ranked.filter(item=>item.rank>=.6).sort((a,b)=>b.weight*b.rank-a.weight*a.rank).slice(0,4);
      if (!entry.good.some(item=>item.key==='campus')) entry.good = [{key:'campus'},...entry.good].slice(0,4);
      entry.trade = ranked.filter(item=>item.rank<.35 && item.weight>=1).sort((a,b)=>b.weight-a.weight)[0] || null;
    });
    return {picks,weights,eligible:pool.length,filterCount:filtered.length};
  }
  function persona() {
    const a = state.answers, flavours = a.flavour || [];
    const modifier = flavours.includes('east') ? local('Flavour seeker','亚洲美食爱好者') : flavours.includes('south') ? local('Spice lover','香料爱好者') : flavours.includes('veg') ? local('Plant-based eater','植物性饮食爱好者') : '';
    const food = {cook:local('Home cook','居家主厨'),out:local('Restaurant hunter','餐厅探索家'),takeaway:local('Takeaway connoisseur','外卖行家'),mix:local('Easy-going foodie','随性美食家')}[a.dinner] || local('Everyday explorer','日常探索家');
    const title = {library:local('Library regular','图书馆常客'),cafe:local('Café scholar','咖啡馆学习派'),desk:local('Study-at-home type','居家学习派'),any:local('Free-roaming explorer','自由探索家')}[a.study] || local('City explorer','城市探索家');
    const bits = [{cook:local('you like cooking for yourself','喜欢自己下厨'),out:local('you like eating out','喜欢在外用餐'),takeaway:local('you lean on easy takeaway','偏爱省心的外卖'),mix:local('you are open to all kinds of dining','用餐方式随心选择')}[a.dinner],{topup:local('you shop a little at a time','习惯少量多次采购'),weekly:local('you prefer one big weekly shop','喜欢每周一次大采购'),special:local('you seek out familiar ingredients','会寻找熟悉的食材'),rarely:local('you rarely grocery shop','很少采购食材')}[a.shop],{library:local('you study best in a library','在图书馆学习更专注'),cafe:local('you like studying in cafés','喜欢在咖啡馆学习'),desk:local('you are most comfortable at your own desk','在自己的书桌前最自在'),any:local('you are not fussy about where you study','不太挑学习地点')}[a.study]].filter(Boolean);
    const activities = (a.free || []).map(key=>({shops:local('shopping','逛商店'),park:local('going to the park','去公园'),gym:local('sport','运动'),culture:local('exhibitions and shows','看展览和演出'),home:local('recharging at home','在家休息')}[key])).filter(Boolean);
    return {title:[title,modifier,food].filter(Boolean).join(' · '),stamp:{library:'📚',cafe:'☕',desk:'🪑',any:'🎒'}[a.study] || '🏠',desc:local(`${bits.join(', ')}${activities.length?`; at weekends ${activities.join(', ')}`:''}.`,`你${bits.join('，')}${activities.length?`；周末喜欢${activities.join('、')}`:''}。`)};
  }


  function priceText(home) {
    const prices=[];
    if(home.pe)prices.push(local(`En-suite from £${home.pe}`,`独卫单间 £${home.pe} 起`));
    if(home.ps)prices.push(local(`Studio from £${home.ps}`,`独立套间 £${home.ps} 起`));
    if(!prices.length && home.plo)prices.push(local(`Room from £${home.plo}`,`房间 £${home.plo} 起`));
    return prices.length?`${prices.join(' · ')}${local(' / week (past reference price)','／周（历史参考价）')}`:local('No reference starting price recorded','暂无参考起价记录');
  }

  return { CAMPUSES, CAMPUS_ZH, QUESTIONS, displayQuestion, cleanAnswers, metrics, weightsFor, matchHomes, persona, priceText, state };
};

};
defs["./home-tools.js"] = function (module, exports, require) {
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

};
defs["./life-model.js"] = function (module, exports, require) {
/* 自动生成，请勿手改：node scripts/extract-data.cjs。原样复制自网页版 life-c-model.js */
var __root = {};
/* Version C · Liverpool Life Quiz: 6 everyday scenarios -> one of 15 lifestyle characters.
   A playful summary of six choices, not a personality test. No campus, budget or contact details are asked here. */
(function (root) {
  'use strict';

  // Lifestyle traits (5) and food styles (3). A character is "The {life word} {food word}".
  var LIFE = {
    library: { word: 'Library-Loving', icon: '📚', color: '#e0e7cf', keyword: 'library study sessions',
      morning: ['10:00', 'A window seat in the Picton Reading Room', 'Central Library on William Brown Street. Free, quiet, beautiful.'] },
    cafe: { word: 'Café-Hopping', icon: '☕', color: '#f1dcc8', keyword: 'café working',
      morning: ['10:00', 'Laptop open in a Bold Street café', 'A flat white, a window table, the essay slowly taking shape.'] },
    air: { word: 'Fresh-Air', icon: '🌳', color: '#dce8df', keyword: 'fresh air',
      morning: ['08:00', 'A lap of Princes Park before class', 'Clear head first, lectures after.'] },
    culture: { word: 'Culture-Chasing', icon: '🎨', color: '#ecd4de', keyword: 'galleries and gigs',
      morning: ['12:00', 'Lunch break in the Walker Art Gallery', 'Free entry, five minutes from Lime Street.'] },
    night: { word: 'Night-Owl', icon: '🌙', color: '#d9dfe8', keyword: 'late nights',
      morning: ['11:00', 'First coffee. Mornings are a rumour', 'The day starts when it starts.'] }
  };
  var LIFE_ORDER = ['library', 'cafe', 'air', 'culture', 'night'];
  var FOOD = {
    cook: { word: 'Home Chef', icon: '🍳', keyword: 'home cooking',
      evening: ['19:00', 'Something good on the hob', 'Flatmates hovering, asking what smells so good.'] },
    out: { word: 'Foodie', icon: '🍜', keyword: 'trying new places',
      evening: ['19:00', 'A new table on Bold Street or in Chinatown', 'There is always one more place on the list.'] },
    takeaway: { word: 'Takeaway Connoisseur', icon: '🥡', keyword: 'takeaway nights',
      evening: ['21:00', 'Takeaway, sofa, the next episode', 'Zero washing up. No regrets.'] }
  };

  var QUOTES = {
    'library-cook': 'The essay can wait for another revision. A good dinner can’t.',
    'library-out': 'Study hard, then eat somewhere new. That’s the deal.',
    'library-takeaway': 'Chapter four done. Noodles are on their way.',
    'cafe-cook': 'Flat white by day, risotto by night. Balance.',
    'cafe-out': 'Rate every café on Bold Street? Already on it.',
    'cafe-takeaway': 'Laptop open until closing time, chips on the walk home.',
    'air-cook': 'A morning lap of the park, a pot of something good by six.',
    'air-out': 'Walk the waterfront, earn the dinner.',
    'air-takeaway': 'Ten thousand steps. I’ve earned this delivery.',
    'culture-cook': 'Gallery in the afternoon, cooking up a storm by evening.',
    'culture-out': 'A gig, a new restaurant, a story for Monday.',
    'culture-takeaway': 'Front row at the gig, chips on the way home.',
    'night-cook': 'Everyone ends up at mine, and I’m cooking.',
    'night-out': 'Table booked for eight, plans until whenever.',
    'night-takeaway': 'Home at 2am. The noodle shop already knows my order.'
  };

  function opt(id, icon, label, detail, pts, one, both, extra) {
    var o = { id: id, icon: icon, label: label, detail: detail, pts: pts || {}, one: one, both: both };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  // one = "one of you ___"; both = "you both ___"
  var QUESTIONS = [
    { id: 'friday', title: 'You unexpectedly have two free hours after class on Friday. Where do you go?', opening: 'With two free hours on Friday', options: [
      opt('cafe', '☕', 'A corner table in a Bold Street café', 'Coffee, people-watching, maybe some reading', { cafe: 2 }, 'grabs a corner table on Bold Street', 'grab a corner table on Bold Street'),
      opt('library', '📚', 'The Picton Reading Room at Central Library', 'The domed reading room everyone photographs', { library: 2 }, 'heads to the Picton Reading Room', 'head to the Picton Reading Room'),
      opt('dock', '⚓', 'A slow walk along the Albert Dock waterfront', 'River air and old warehouses', { air: 2 }, 'walks the Albert Dock waterfront', 'walk the Albert Dock waterfront'),
      opt('gallery', '🎨', 'A gallery, a record shop, whatever’s on', 'Something new to look at or listen to', { culture: 2 }, 'goes looking for a gallery or record shop', 'go looking for a gallery or record shop')
    ] },
    { id: 'dinner', title: 'It’s 7pm and you’re starving. What happens next?', opening: 'At 7pm', options: [
      opt('cook', '🍳', 'I cook something properly', 'A real dinner, maybe enough for tomorrow', {}, 'cooks something properly', 'cook something properly', { food: 'cook' }),
      opt('out', '🍜', 'Out with friends to try somewhere new', 'There’s a place on Bold Street I keep hearing about', {}, 'goes out to try somewhere new', 'go out to try somewhere new', { food: 'out' }),
      opt('takeaway', '🥡', 'Takeaway, sofa, next episode', 'Zero washing up', {}, 'orders a takeaway to the sofa', 'order a takeaway to the sofa', { food: 'takeaway' })
    ] },
    { id: 'essay', title: 'An essay is due on Monday. Where does it get written?', opening: 'When an essay is due', options: [
      opt('library', '📚', 'In the library, phone in my bag', 'Silent floor, no distractions', { library: 2 }, 'heads to the library', 'head to the library'),
      opt('cafe', '☕', 'In a café with a flat white', 'A little background noise helps', { cafe: 2 }, 'finds a café', 'find a café'),
      opt('desk', '🎧', 'At my own desk, headphones on', 'My room, my playlist', { library: 1 }, 'stays at their own desk', 'stay at your own desks'),
      opt('lastnight', '🌙', 'The night before, with friends and snacks', 'Pressure is a great motivator', { night: 1 }, 'writes it the night before with friends', 'write it the night before with friends')
    ] },
    { id: 'saturday', title: 'A free Saturday afternoon looks like…', opening: 'On a free Saturday', options: [
      opt('park', '🌳', 'A picnic or a run in Sefton Park', 'The Palm House if it rains', { air: 2 }, 'is in Sefton Park', 'are in Sefton Park', { act: 'a picnic in Sefton Park', kw: 'unwinding in the park at weekends', sat: ['Saturday', 'A picnic in Sefton Park', 'The Palm House if it rains.'] }),
      opt('museum', '🎟️', 'The Museum of Liverpool, then a gig', 'Pier Head by day, live music by night', { culture: 2 }, 'is at the museum, then a gig', 'are at the museum, then a gig', { act: 'the Museum of Liverpool, then a gig', kw: 'museum-and-gig Saturdays', sat: ['Saturday', 'Museum of Liverpool at the Pier Head', 'Then a gig somewhere in town.'] }),
      opt('wander', '🧭', 'Wandering Lark Lane or the Baltic Triangle', 'Little shops, street art, somewhere for lunch', { culture: 1, cafe: 1 }, 'is wandering Lark Lane or the Baltic Triangle', 'are wandering Lark Lane or the Baltic Triangle', { act: 'wandering Lark Lane and the Baltic Triangle', kw: 'wandering new streets', sat: ['Saturday', 'Lark Lane cafés, then the Baltic Triangle', 'No plan, just good streets.'] }),
      opt('sport', '⚽', 'Five-a-side or the gym', 'Moving is the best way to switch off', { air: 1 }, 'is playing five-a-side or at the gym', 'are playing five-a-side or at the gym', { act: 'five-a-side or the gym', kw: 'weekend sport', sat: ['Saturday', 'Five-a-side, then a well-earned brunch', 'Muddy boots optional.'] })
    ] },
    { id: 'night', title: 'And after dark?', opening: 'After dark', options: [
      opt('early', '🛏️', 'Early night, big day tomorrow', 'Future me will thank me', { library: 1 }, 'has an early night', 'have an early night'),
      opt('one', '🫖', 'One drink, then home', 'A catch-up, nothing wild', { cafe: 1, culture: 1 }, 'has one drink, then heads home', 'have one drink, then head home'),
      opt('late', '🪩', 'Out until the city goes quiet', 'Liverpool knows how to do a night out', { night: 3 }, 'stays out until the city goes quiet', 'stay out until the city goes quiet')
    ] },
    { id: 'firstweek', title: 'Your first week in a new city. You…', opening: 'In a new city', options: [
      opt('explore', '🗺️', 'Explore every street you can find', 'Getting lost is half the fun', { culture: 1, air: 1 }, 'explores every street', 'explore every street'),
      opt('regular', '🏡', 'Find your regular spots and settle in', 'Your café, your supermarket, your route', { cafe: 1, library: 1 }, 'finds their regular spots', 'find your regular spots'),
      opt('chat', '💬', 'Start the group chat and plan a night out', 'Someone has to', { night: 2 }, 'starts the group chat', 'start the group chat')
    ] }
  ];
  var N = QUESTIONS.length;

  var PLAN_END = {
    'cook|cook': 'then back to one of your kitchens to cook together.',
    'out|out': 'then a new table in Chinatown.',
    'takeaway|takeaway': 'then order in and argue over the film.',
    'cook|out': 'then ingredients from Chinatown and dinner at whoever’s is closer.',
    'cook|takeaway': 'then one of you cooks and the other brings dessert.',
    'out|takeaway': 'then street food on Bold Street, eaten on the walk.'
  };

  function valid(a) {
    if (!Array.isArray(a) || a.length !== N) return false;
    for (var i = 0; i < N; i++) if (!(Number.isInteger(a[i]) && a[i] >= 0 && a[i] < QUESTIONS[i].options.length)) return false;
    return true;
  }
  function pick(a, i) { return QUESTIONS[i].options[a[i]]; }

  function lifeOf(a) {
    var score = { library: 0, cafe: 0, air: 0, culture: 0, night: 0 };
    a.forEach(function (v, i) { var p = QUESTIONS[i].options[v].pts; for (var k in p) score[k] += p[k]; });
    var max = Math.max.apply(null, LIFE_ORDER.map(function (k) { return score[k]; }));
    var tied = LIFE_ORDER.filter(function (k) { return score[k] === max; });
    if (tied.length === 1) return tied[0];
    // ties: the Saturday answer wins, then the Friday answer, then the fixed order
    var tb = [pick(a, 3).pts, pick(a, 0).pts];
    for (var t = 0; t < tb.length; t++) {
      var best = tied.slice().sort(function (x, y) { return (tb[t][y] || 0) - (tb[t][x] || 0); });
      if ((tb[t][best[0]] || 0) > (tb[t][best[1]] || 0)) return best[0];
    }
    return tied[0];
  }

  function result(a) {
    if (!valid(a)) return null;
    var life = lifeOf(a), food = pick(a, 1).food, L = LIFE[life], F = FOOD[food], sat = pick(a, 3);
    var id = life + '-' + food;
    var name = characterName(life, food);
    var keywords = [F.keyword, L.keyword, sat.kw];
    return {
      id: id, life: life, food: food, name: name, icons: L.icon + F.icon, color: L.color,
      quote: QUOTES[id], keywords: keywords, tags: keywords,
      english: language === 'zh' ? name : name.toUpperCase(),
      description: language === 'zh' ? '你的生活关键词：' + keywords.join('、') + '。这是六个选择组成的趣味生活画像，不是性格测试。' : 'Your lifestyle keywords: ' + keywords.join(', ') + '. A playful summary of six choices, not a personality test.',
      day: [L.morning, sat.sat, F.evening],
      answers: a.slice()
    };
  }

  function allCharacters() {
    var out = [];
    LIFE_ORDER.forEach(function (l) { ['cook', 'out', 'takeaway'].forEach(function (f) {
      out.push({ id: l + '-' + f, life: l, food: f, name: characterName(l, f), icons: LIFE[l].icon + FOOD[f].icon, color: LIFE[l].color, quote: QUOTES[l + '-' + f] });
    }); });
    return out;
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // "Where we're alike / where we differ" from the actual choices. No score.
  function compare(a, b) {
    if (!valid(a) || !valid(b)) return null;
    var same = [], diff = [];
    QUESTIONS.forEach(function (q, i) {
      var x = q.options[a[i]], y = q.options[b[i]];
      if (a[i] === b[i]) same.push(language === 'zh' ? q.opening + '，你们都会' + x.both + '。' : q.opening + ', you both ' + x.both + '.');
      else diff.push(language === 'zh' ? q.opening + '，你们中的一个会' + x.one + '；另一个会' + y.one + '。' : q.opening + ', one of you ' + x.one + '; the other ' + y.one + '.');
    });
    var sa = pick(a, 3), sb = pick(b, 3), fa = pick(a, 1).food, fb = pick(b, 1).food;
    var key = [fa, fb].sort(function (x, y) { return ['cook', 'out', 'takeaway'].indexOf(x) - ['cook', 'out', 'takeaway'].indexOf(y); }).join('|');
    var plan = a[3] === b[3] ? 'Saturday sorted: ' + sa.act + ' together, ' + PLAN_END[key]
      : 'Morning: ' + sa.act + '. Afternoon: ' + sb.act + '. Then ' + PLAN_END[key].replace(/^then /, '');
    if (language === 'zh') plan = a[3] === b[3] ? '周六安排好了：一起' + sa.act + '，' + PLAN_END[key] : '上午：' + sa.act + '。下午：' + sb.act + '。' + PLAN_END[key];
    else plan = cap(plan);
    return { same: same, different: diff, plan: plan, sameCount: same.length, total: N,
      none: same.length === 0 ? (language === 'zh' ? '六道题你们都选得不一样，正好交换彼此的推荐。' : 'You’re opposites on all six. Perfect for swapping recommendations.') : '' };
  }

  // share codes: c1.<6 digits>; a pair is c1.<mine>~<theirs>
  function encode(a) { return valid(a) ? 'c1.' + a.join('') : ''; }
  function decode(code) {
    var m = /^c1\.([0-9]{6})$/.exec(String(code || ''));
    if (!m) return null;
    var a = m[1].split('').map(Number);
    return valid(a) ? a : null;
  }
  function decodeHash(hash) {
    var h = String(hash || '').replace(/^#/, '');
    var q = /(?:^|&)friend=([^&]+)/.exec(h); if (q) h = decodeURIComponent(q[1]);
    var pair = /^c1\.([0-9]{6})~([0-9]{6})$/.exec(h);
    if (pair) { var x = decode('c1.' + pair[1]), y = decode('c1.' + pair[2]); return x && y ? { pair: [x, y] } : null; }
    var one = decode(h); return one ? { friend: one } : null;
  }

  /* Hidden map signals: the six answers become the Home Match settings used by the map.
     Campus, walking distance and food-nearby choices come only from the optional "where to live" step. */
  function toMapAnswers(a, extra) {
    if (!valid(a)) return null;
    extra = extra || {};
    var food = pick(a, 1).food, free = [];
    var addFree = function (v) { if (v && free.indexOf(v) === -1 && free.length < 2) free.push(v); };
    addFree({ park: 'park', museum: 'culture', wander: 'shops', sport: 'gym' }[pick(a, 3).id]);
    addFree({ dock: 'park', gallery: 'culture', cafe: null, library: null }[pick(a, 0).id]);
    if (!free.length) free.push('home');
    var flavour = Array.isArray(extra.flavour) && extra.flavour.length ? extra.flavour.slice(0, 3) : ['any'];
    return {
      campus: extra.campus || 'unsure',
      dinner: food,
      shop: food === 'cook' ? (flavour.indexOf('east') > -1 || flavour.indexOf('south') > -1 ? 'special' : 'weekly') : food === 'takeaway' ? 'topup' : 'rarely',
      flavour: flavour,
      study: { library: 'library', cafe: 'cafe', desk: 'desk', lastnight: 'any' }[pick(a, 2).id],
      free: free,
      night: { early: 'calm', one: 'some', late: 'lots' }[pick(a, 4).id],
      walk: extra.walk || 'far'
    };
  }

  var NEIGHBOURHOOD = {
    library: ['Knowledge Quarter & London Road', 'Closest to the main university libraries.'],
    cafe: ['Lime Street & Ropewalks', 'Bold Street’s cafés on your doorstep.'],
    air: ['Georgian Quarter & Chinatown', 'The nearest homes to Princes Park and the route to Sefton Park.'],
    culture: ['Lime Street & Ropewalks', 'Walking distance to museums, galleries and venues.'],
    night: ['City Centre and Ropewalks', 'The most bars and venues within a 10-minute walk.']
  };

  // Only display copy is localized. Choice IDs, scores and c1 share codes are language-independent.
  // Keep the exposed object/array identities stable for consumers holding references to them.
  var language = 'en';
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  var EN = { life: clone(LIFE), food: clone(FOOD), questions: clone(QUESTIONS), quotes: clone(QUOTES), plans: clone(PLAN_END), neighbourhood: clone(NEIGHBOURHOOD) };
  var ZH = clone(EN);

  var ZH_LIFE = {
    library: { word: '图书馆常客', keyword: '图书馆自习', morning: ['10:00', '在皮克顿阅览室找一个靠窗座位', '威廉·布朗街上的中央图书馆，免费、安静又漂亮。'] },
    cafe: { word: '咖啡馆漫游者', keyword: '咖啡馆办公', morning: ['10:00', '在博尔德街的咖啡馆打开电脑', '一杯馥芮白，一张靠窗桌，论文慢慢成形。'] },
    air: { word: '户外爱好者', keyword: '户外新鲜空气', morning: ['08:00', '上课前先绕王子公园一圈', '先让头脑清醒，再去听课。'] },
    culture: { word: '文艺探索家', keyword: '画廊与现场演出', morning: ['12:00', '午休去沃克美术馆逛逛', '免费入场，距莱姆街车站步行约五分钟。'] },
    night: { word: '夜猫子', keyword: '夜间生活', morning: ['11:00', '第一杯咖啡，早晨仿佛只是传说', '想什么时候开始，就什么时候开始。'] }
  };
  var ZH_FOOD = {
    cook: { word: '居家大厨', keyword: '自己下厨', evening: ['19:00', '炉灶上正煮着好吃的', '室友闻着香味凑过来，问你在做什么。'] },
    out: { word: '探店美食家', keyword: '探索新餐馆', evening: ['19:00', '去博尔德街或唐人街试一家新店', '收藏清单里总有下一家想去的餐馆。'] },
    takeaway: { word: '外卖鉴赏家', keyword: '外卖之夜', evening: ['21:00', '外卖、沙发，再看一集', '不用洗碗，快乐加倍。'] }
  };
  Object.keys(ZH_LIFE).forEach(function (key) { Object.assign(ZH.life[key], ZH_LIFE[key]); });
  Object.keys(ZH_FOOD).forEach(function (key) { Object.assign(ZH.food[key], ZH_FOOD[key]); });
  ZH.quotes = {
    'library-cook': '论文还可以再改一版，好好吃饭可不能等。',
    'library-out': '认真学习，然后去一家新餐馆，就这么说定了。',
    'library-takeaway': '第四章写完了，面条也快送到了。',
    'cafe-cook': '白天喝馥芮白，晚上做烩饭，生活刚刚好。',
    'cafe-out': '给博尔德街每家咖啡馆打分？已经开始了。',
    'cafe-takeaway': '抱着电脑坐到咖啡馆打烊，回家路上买份薯条。',
    'air-cook': '早上绕公园一圈，傍晚六点锅里就有好吃的。',
    'air-out': '沿河边散散步，再犒劳自己一顿晚餐。',
    'air-takeaway': '今天走了一万步，这份外卖我值得。',
    'culture-cook': '下午逛画廊，晚上在厨房大显身手。',
    'culture-out': '一场演出，一家新餐馆，周一又有故事可讲。',
    'culture-takeaway': '看演出站前排，回家路上吃薯条。',
    'night-cook': '最后大家都来我家，而我负责下厨。',
    'night-out': '八点订好了餐桌，之后玩到几点再说。',
    'night-takeaway': '凌晨两点回家，面馆老板已经知道我要点什么。'
  };

  // Each option supplies label, detail and a verb phrase used in friend comparisons.
  var ZH_QUESTIONS = [
    { title: '周五下课后，突然空出两个小时。你会去哪儿？', opening: '周五空出两小时的时候', options: [
      ['博尔德街咖啡馆的角落桌', '喝咖啡、看看路人，也许读会儿书', '在博尔德街找张角落桌'],
      ['中央图书馆的皮克顿阅览室', '就是大家都会拍照的圆顶阅览室', '去皮克顿阅览室'],
      ['沿阿尔伯特码头慢慢散步', '吹吹河风，看看老仓库', '沿阿尔伯特码头散步'],
      ['画廊、唱片店，有什么就逛什么', '找点新鲜的东西看看或听听', '去找画廊或唱片店']
    ] },
    { title: '晚上七点，肚子饿了。接下来怎么安排？', opening: '到了晚上七点', options: [
      ['认真给自己做顿饭', '好好吃一顿，也许顺便做出明天的份', '认真做顿饭'],
      ['和朋友出去试一家新餐馆', '博尔德街有家店，听人推荐好几次了', '出门试一家新餐馆'],
      ['点外卖、窝沙发，再看一集', '不用洗碗', '点份外卖窝在沙发上吃']
    ] },
    { title: '周一要交论文，你会在哪儿写？', opening: '要赶论文的时候', options: [
      ['图书馆，手机收进包里', '安静楼层，不受打扰', '去图书馆'],
      ['咖啡馆，再来一杯馥芮白', '一点背景音反而更容易专注', '找家咖啡馆'],
      ['自己的书桌前，戴上耳机', '自己的房间，自己的歌单', '待在自己的书桌前'],
      ['截止前一晚，和朋友一起备好零食', '压力就是最好的动力', '前一晚和朋友一起赶论文']
    ] },
    { title: '空闲的周六下午，你想这样度过……', opening: '空闲的周六', options: [
      ['去塞夫顿公园野餐或跑步', '下雨就去棕榈温室', '去塞夫顿公园'],
      ['先逛利物浦博物馆，再看演出', '白天逛码头顶，晚上听现场音乐', '先逛博物馆，再去看演出'],
      ['逛逛拉克巷或波罗的海三角区', '小店、街头艺术，再找个地方吃午饭', '闲逛拉克巷或波罗的海三角区'],
      ['踢五人制足球，或者去健身房', '运动最能让大脑放松', '踢五人制足球或去健身房']
    ] },
    { title: '天黑以后呢？', opening: '天黑以后', options: [
      ['早点睡，明天还有好多事', '明天的自己会感谢我', '早早睡觉'],
      ['喝一杯就回家', '聊聊天，不用太疯狂', '喝一杯就回家'],
      ['玩到整座城市安静下来', '利物浦的夜生活可不会让人失望', '玩到整座城市安静下来']
    ] },
    { title: '来到新城市的第一周，你会……', opening: '来到新城市', options: [
      ['尽可能多地探索每一条街', '迷路也是乐趣的一半', '探索每一条街'],
      ['找到常去的地方，慢慢安顿下来', '熟悉的咖啡馆、超市和路线', '找到自己常去的地方'],
      ['建个群，约大家一起出去玩', '总得有人来张罗', '建个群约大家出去玩']
    ] }
  ];
  ZH_QUESTIONS.forEach(function (q, i) {
    ZH.questions[i].title = q.title;
    ZH.questions[i].opening = q.opening;
    q.options.forEach(function (o, j) {
      Object.assign(ZH.questions[i].options[j], { label: o[0], detail: o[1], one: o[2], both: o[2] });
    });
  });
  var ZH_SATURDAY = [
    { act: '去塞夫顿公园野餐', kw: '周末在公园放松', sat: ['周六', '去塞夫顿公园野餐', '下雨就去棕榈温室。'] },
    { act: '逛利物浦博物馆，再看一场演出', kw: '博物馆与演出的周六', sat: ['周六', '逛码头顶的利物浦博物馆', '然后去市区看一场演出。'] },
    { act: '闲逛拉克巷和波罗的海三角区', kw: '探索陌生街道', sat: ['周六', '先逛拉克巷咖啡馆，再去波罗的海三角区', '不用计划，沿着喜欢的街走就好。'] },
    { act: '踢五人制足球或去健身房', kw: '周末运动', sat: ['周六', '踢完五人制足球，再吃顿早午餐', '鞋上沾点泥也没关系。'] }
  ];
  ZH_SATURDAY.forEach(function (sat, i) { Object.assign(ZH.questions[3].options[i], sat); });
  ZH.plans = {
    'cook|cook': '然后回其中一人的厨房，一起做饭。',
    'out|out': '然后去唐人街试一家新餐馆。',
    'takeaway|takeaway': '然后点外卖，商量今晚看哪部电影。',
    'cook|out': '然后去唐人街买食材，谁家近就去谁家做饭。',
    'cook|takeaway': '然后一个人做饭，另一个人带甜点。',
    'out|takeaway': '然后在博尔德街买点街头小吃，边走边吃。'
  };
  ZH.neighbourhood = {
    library: ['知识区与伦敦路', '离主要大学图书馆最近。'],
    cafe: ['莱姆街与绳索街区', '出门就能逛博尔德街的咖啡馆。'],
    air: ['乔治亚街区与唐人街', '这些住处离王子公园和通往塞夫顿公园的路线最近。'],
    culture: ['莱姆街与绳索街区', '步行可到博物馆、画廊和演出场所。'],
    night: ['市中心与绳索街区', '步行十分钟内，酒吧与演出场所最集中。']
  };
  function applyCopy(target, source) {
    Object.keys(source).forEach(function (key) {
      if (source[key] && typeof source[key] === 'object') applyCopy(target[key], source[key]);
      else target[key] = source[key];
    });
  }
  function characterName(life, food) {
    return language === 'zh' ? LIFE[life].word + ' · ' + FOOD[food].word : 'The ' + LIFE[life].word + ' ' + FOOD[food].word;
  }
  function setLanguage(lang) {
    language = /^zh(?:$|[-_])/i.test(String(lang || 'en')) ? 'zh' : 'en';
    var copy = language === 'zh' ? ZH : EN;
    applyCopy(LIFE, copy.life);
    applyCopy(FOOD, copy.food);
    applyCopy(QUESTIONS, copy.questions);
    applyCopy(QUOTES, copy.quotes);
    applyCopy(PLAN_END, copy.plans);
    applyCopy(NEIGHBOURHOOD, copy.neighbourhood);
    model.language = language;
    return model;
  }

  var model = {
    variant: 'life', language: language, setLanguage: setLanguage, questions: QUESTIONS, life: LIFE, food: FOOD, lifeOrder: LIFE_ORDER,
    valid: valid, result: result, allCharacters: allCharacters, compare: compare,
    encode: encode, decode: decode, decodeHash: decodeHash, toMapAnswers: toMapAnswers, neighbourhood: NEIGHBOURHOOD,
    sample: [1, 0, 0, 0, 0, 1]
  };
  root.LifeCModel = model;

  // Let the shared map result understand this version's answers.
  var base = root.LifeMapModel;
  if (base) {
    root.LifeMapModel = Object.freeze({
      toMapAnswers: function (answers, variant) {
        if (variant === 'life') return answers && answers.answers ? toMapAnswers(answers.answers, answers.extra) : null;
        return base.toMapAnswers(answers, variant);
      },
      explanation: function (answers, variant) {
        if (variant === 'life' && language === 'zh') return '生活测试根据六个日常选择所对应的地点（咖啡馆、图书馆、公园、食品杂货店和夜生活场所），结合你在这一步选择的校区与步行距离，为地图上的住处排序。这里不询问预算，请到各房源页面查看价格。';
        if (variant === 'life') return 'Version C ranks homes on the map by the everyday places your six choices point to (cafés, libraries, parks, groceries, nightlife), plus the campus and walking distance you chose in this step. Budget is not asked; check prices on each listing.';
        return base.explanation(answers, variant);
      }
    });
  }
})(__root);

module.exports = __root.LifeCModel;

};
defs["./home-match.js"] = function (module, exports, require) {
/* 小程序端的找房匹配 API（纯 CommonJS，无 DOM、无 wx 依赖，可在 Node 中测试）。
   打分逻辑来自 home-match-core.js（自动从网页版截取），这里只做数据整形。 */
'use strict';
var HOMES = require('./data/homes.js');
var createCore = require('./home-match-core.js');
var HomeTools = require('./home-tools.js');

function cloneHomes() {
  return HOMES.map(function (h) { return Object.assign({}, h, { hm: { r: h.hm.r, cnt: h.hm.cnt, near: h.hm.near } }); });
}
function byId(id) { for (var i = 0; i < HOMES.length; i++) if (HOMES[i].id === id) return HOMES[i]; return null; }
function byIds(ids) { return (ids || []).map(byId).filter(Boolean); }

function questions(lang) {
  var c = createCore(HOMES, { lang: lang });
  return c.QUESTIONS.map(function (q) {
    var d = c.displayQuestion(q);
    return { id: q.id, multi: !!q.multi, max: q.max || 1, q: d.q, hint: d.hint || '',
      opts: d.opts.map(function (o) { return { id: o[0], emoji: o[1], label: o[2], detail: o[3] }; }) };
  });
}
function cleanAnswers(answers) { return createCore(HOMES).cleanAnswers(answers); }
function isComplete(answers) {
  var c = createCore(HOMES), a = c.cleanAnswers(answers);
  return c.QUESTIONS.every(function (q) { return q.multi ? Array.isArray(a[q.id]) && a[q.id].length > 0 : !!a[q.id]; });
}
function priceText(home, lang) { return createCore(HOMES, { lang: lang }).priceText(home); }

/* answers: 与网页版相同的 8 题答案对象；options.filters 可选（与网页版列表筛选同义） */
function match(answers, options) {
  options = options || {};
  var homes = cloneHomes();
  var filters = options.filters, favorites = options.favorites || new Set();
  var c = createCore(homes, { lang: options.lang,
    filter: filters ? function (h) { return HomeTools.matchesHome(h, filters, favorites); } : null });
  c.state.answers = c.cleanAnswers(answers);
  var r = c.matchHomes();
  var picks = r.picks.map(function (e, i) {
    return { rank: i + 1, id: e.h.id, n: e.h.n, name: e.h.name, area: e.h.area, areaZh: e.h.areaZh,
      score: e.score, campusMin: e.h.hm.campus, price: c.priceText(e.h),
      reasons: e.good.map(function (g) { return { key: g.key, ico: c.metrics[g.key].ico, text: c.metrics[g.key].good(e.h) }; }),
      trade: e.trade ? { key: e.trade.key, ico: c.metrics[e.trade.key].ico, text: c.metrics[e.trade.key].bad(e.h) } : null,
      historicalUnavailable: !!e.h.pso };
  });
  return { picks: picks, ids: picks.map(function (p) { return p.id; }), persona: c.persona(),
    eligible: r.eligible, filterCount: r.filterCount, answers: c.state.answers };
}
module.exports = { HOMES: HOMES, byId: byId, byIds: byIds, questions: questions, cleanAnswers: cleanAnswers,
  isComplete: isComplete, priceText: priceText, match: match, matchesHome: HomeTools.matchesHome };

};
defs["./life-quiz.js"] = function (module, exports, require) {
/* 生活测试：6 道情景题 -> 15 种生活角色；再把答案换算成找房答案，得到 Top 3（与网页版 life-c-map 相同的换算）。 */
'use strict';
var model = require('./life-model.js');
var HM = require('./home-match.js');
function use(lang) { model.setLanguage(lang === 'en' ? 'en' : 'zh'); return model; }
function questions(lang) {
  use(lang);
  return model.questions.map(function (q) {
    return { id: q.id, q: q.title, opts: q.options.map(function (o) { return { id: o.id, emoji: o.icon, label: o.label, detail: o.detail }; }) };
  });
}
function valid(a) { return model.valid(a); }
/* a: 6 个选项下标；extra: { campus, walk, flavour } */
function run(a, extra, lang) {
  use(lang);
  var character = model.result(a);
  if (!character) return null;
  var mapAnswers = model.toMapAnswers(a, extra || {});
  var m = HM.match(mapAnswers, { lang: lang });
  return { character: { id: character.id, name: character.name, icons: character.icons, color: character.color,
    quote: character.quote, keywords: character.keywords, description: character.description,
    day: character.day.map(function (d) { return { time: d[0], title: d[1], text: d[2] }; }) },
    mapAnswers: mapAnswers, match: m, code: model.encode(a) };
}
module.exports = { questions: questions, valid: valid, run: run, model: model };

};
defs["./i18n.js"] = function (module, exports, require) {
'use strict';
var S = {
  zh: {
    appName: '利物浦学生生活地图', lifeQuiz: '生活测试', homeQuiz: '找房测试', lifeQuizSub: '6 道情景题 · 测你的利物浦生活角色',
    homeQuizSub: '8 道题 · 按日常生活找公寓', homes: '公寓列表', search: '输入名称、街道或编号…', budget: '每周预算', room: '房型',
    walk: '步行到利大', any: '不限', ensuite: '独卫单间', studio: 'Studio 套间', favOnly: '只看收藏', count: '找到 {n} / 47 处公寓',
    empty: '没有符合这些条件的公寓。', reset: '重置筛选', minutes: '{n} 分钟', walkUol: '步行到利大约 {n} 分钟', fromWeek: '£{v}/周起',
    noPrice: '暂无参考价', soldOut: '历史记录无房', yourTop3: '你的推荐 Top 3', viewResult: '查看结果', showAll: '显示全部',
    question: '第 {i} 题 / 共 {n} 题', back: '上一题', next: '下一题', finish: '看结果', multiHint: '可多选', start: '开始 · 约 2 分钟',
    homeIntro: '回答 8 个关于校区、吃饭、学习和周末的小问题，按你的日常生活推荐 3 处公寓。答案只保存在本机。',
    lifeIntro: '六个日常情景，测出你在利物浦的生活角色，并顺便推荐 3 处适合你的公寓。这是趣味画像，不是性格测试。',
    extraCampus: '最后两步：你主要在哪个校区上课？', extraWalk: '你愿意步行多久去上课？',
    resultTitle: '你的利物浦找房卡', top3: '推荐的 3 处公寓', compare3: '对比这三套', onMap: '在地图上看', consult: '咨询顾问',
    retake: '重新测试', tradeoff: '需要取舍', reasons: '推荐理由', compare: '对比', detail: '详情', fav: '收藏', faved: '已收藏',
    addCompare: '加入对比', inCompare: '已在对比中', navigate: '打开导航', nearby: '周边设施（估算步行）', prices: '参考价格（历史记录）',
    rating: '评分', reviews: '{n} 条评价', walks: '步行时间（按直线距离估算）', uol: '利物浦大学', ljmu: '最近的 LJMU 校区', lime: '莱姆街火车站', centre: '市中心',
    priceNote: '价格与评分为网页版记录的历史参考（Amber，2026-10-17 核对），不是实时库存，请以房东官网为准。',
    walkNote: '步行时间按直线距离估算，并非实时路线。', lang: 'EN',
    consultTitle: '咨询住宿顾问', consultLead: '点击下方按钮进入微信官方客服会话，顾问会在会话里回复你。',
    consultCtx: '本次咨询会附带', consultHomes: '房源', consultQuiz: '测试结果', consultNone: '暂无（可直接咨询）',
    consultBtn: '进入客服会话', consultSteps: ['点击“进入客服会话”，进入微信官方客服聊天', '随便发一句话，比如“我想咨询这几套房”', '顾问会在聊天里发给你学生群二维码，长按图片即可识别进群'],
    consultFine: '按微信规则，顾问只能在你发消息后的 48 小时内回复你；二维码 7 天内有效，过期可以再发消息要新的。',
    lifeCharacter: '你的生活角色', homesFor: '适合你的公寓', mapNote: '地图：腾讯地图底图；编号与网页版一致。',
    cmpTitle: '公寓对比', rowArea: '区域', rowEnsuite: '独卫单间', rowStudio: 'Studio', rowLowest: '最低房价', rowRating: '评分',
    rowSuper: '最近超市', rowTopup: '最近食品店', rowCafe10: '10 分钟内咖啡馆', rowRest10: '10 分钟内餐厅', rowAsian10: '10 分钟内亚洲餐饮',
    noPicks: '暂时没有同时符合全部条件的公寓。可以把步行时间放宽到“远一点也行”，或换个校区再试。', rowNight10: '10 分钟内夜间场所', rowLib: '最近图书馆', rowPark: '最近绿地', rowGym: '最近健身房', places: '{n} 家'
  },
  en: {
    appName: 'Liverpool Student Life Map', lifeQuiz: 'Life Quiz', homeQuiz: 'Home Match', lifeQuizSub: '6 scenarios · your Liverpool character',
    homeQuizSub: '8 questions · homes that fit your days', homes: 'Homes', search: 'Name, street or number…', budget: 'Budget / wk', room: 'Room',
    walk: 'Walk to UoL', any: 'Any', ensuite: 'En-suite', studio: 'Studio', favOnly: 'Saved only', count: '{n} of 47 homes',
    empty: 'No homes match these filters.', reset: 'Reset filters', minutes: '{n} min', walkUol: 'UoL ~{n} min walk', fromWeek: 'From £{v}/wk',
    noPrice: 'No reference price', soldOut: 'No rooms listed (historic)', yourTop3: 'Your top 3', viewResult: 'View result', showAll: 'Show all',
    question: 'Question {i} of {n}', back: 'Back', next: 'Next', finish: 'See results', multiHint: 'Multi-select', start: 'Start · about 2 minutes',
    homeIntro: 'Answer 8 short questions about campus, meals, study and weekends. We suggest 3 homes. Answers stay on this device.',
    lifeIntro: 'Six everyday scenarios reveal your Liverpool lifestyle character, plus 3 homes that suit it. A playful summary, not a personality test.',
    extraCampus: 'Last two: which campus will you mainly study at?', extraWalk: 'How long are you happy to walk to class?',
    resultTitle: 'Your Liverpool home card', top3: 'Your 3 homes', compare3: 'Compare these 3', onMap: 'View on map', consult: 'Ask an adviser',
    retake: 'Retake', tradeoff: 'Trade-off', reasons: 'Why', compare: 'Compare', detail: 'Details', fav: 'Save', faved: 'Saved',
    addCompare: 'Add to compare', inCompare: 'In compare', navigate: 'Directions', nearby: 'Nearby (estimated walk)', prices: 'Reference prices (historic)',
    rating: 'Rating', reviews: '{n} reviews', walks: 'Walk times (straight-line estimate)', uol: 'University of Liverpool', ljmu: 'Nearest LJMU campus', lime: 'Lime Street station', centre: 'City centre',
    priceNote: 'Prices and ratings as recorded on Amber, checked 17 Oct 2026. Not live availability.',
    walkNote: 'Walk times are distance estimates, not live routes.', lang: '中文',
    consultTitle: 'Ask a housing adviser', consultLead: 'Tap below to open the official WeChat customer-service chat.',
    consultCtx: 'This request includes', consultHomes: 'Homes', consultQuiz: 'Quiz', consultNone: 'None (ask anything)',
    consultBtn: 'Open chat', consultSteps: ['Tap "Open chat" to enter the WeChat service chat', 'Send any message, e.g. "I\'d like to ask about these homes"', 'The adviser replies in the chat with a student group QR code — long-press to join'],
    consultFine: 'WeChat only allows replies within 48 hours of your last message; group QR codes expire after 7 days.',
    lifeCharacter: 'Your character', homesFor: 'Homes for you', mapNote: 'Map: Tencent base map; numbers match the website.',
    cmpTitle: 'Compare', rowArea: 'Area', rowEnsuite: 'En-suite', rowStudio: 'Studio', rowLowest: 'Lowest room', rowRating: 'Rating',
    rowSuper: 'Nearest supermarket', rowTopup: 'Nearest food shop', rowCafe10: 'Cafés ≤10 min', rowRest10: 'Restaurants ≤10 min', rowAsian10: 'Asian food ≤10 min',
    noPicks: 'No home meets every condition yet. Try relaxing the walk time or picking another campus.', rowNight10: 'Night venues ≤10 min', rowLib: 'Nearest library', rowPark: 'Nearest green space', rowGym: 'Nearest gym', places: '{n}'
  }
};
function dict(lang) { return S[lang === 'en' ? 'en' : 'zh']; }
function fmt(s, v) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return v && v[k] != null ? v[k] : ''; }); }
module.exports = { dict: dict, fmt: fmt, S: S };

};
defs["./compare.js"] = function (module, exports, require) {
/* 对比表行定义（纯函数） */
'use strict';
var i18n = require('./i18n.js');
function rows(homes, lang) {
  const T = i18n.dict(lang), mins = v => v == null ? '—' : i18n.fmt(T.minutes, { n: v }), gbp = v => v ? '£' + v : '—';
  const near = (h, k) => { const x = h.hm.near[k]; return x ? mins(x.m) : '—'; };
  const cnt = (h, k) => i18n.fmt(T.places, { n: h.hm.cnt[k] || 0 });
  const def = [
    [T.rowArea, h => lang === 'en' ? h.area : h.areaZh],
    [T.rowEnsuite, h => gbp(h.pe)], [T.rowStudio, h => gbp(h.ps)], [T.rowLowest, h => gbp(h.plo)],
    [T.rowRating, h => h.rr ? h.rr.toFixed(1) + '★ (' + (h.rn || 0) + ')' : '—'],
    [T.uol, h => mins(h.uol)], [T.ljmu, h => mins(h.ljmu)], [T.lime, h => mins(h.lime)], [T.centre, h => mins(h.centre)],
    [T.rowSuper, h => near(h, 'super')], [T.rowTopup, h => near(h, 'topup')], [T.rowLib, h => near(h, 'lib')],
    [T.rowPark, h => near(h, 'park')], [T.rowGym, h => near(h, 'gym')],
    [T.rowCafe10, h => cnt(h, 'cafe10')], [T.rowRest10, h => cnt(h, 'rest10')], [T.rowAsian10, h => cnt(h, 'asian10')], [T.rowNight10, h => cnt(h, 'night10')]
  ];
  return def.map(([label, f], i) => ({ key: 'r' + i, label, cells: homes.map(h => f(h)) }));
}
module.exports = { rows: rows };

};
  root.Core = {
    HM: load('./home-match.js'), LQ: load('./life-quiz.js'), i18n: load('./i18n.js'), compare: load('./compare.js'),
    createCore: load('./home-match-core.js')
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
