/*
 * esssouth animation style · text slots (copied from the approved Lesson 02 · Section 05 content/slots.json; lesson notes removed).
 * fs = nominal px, minFs / minPx = the floor the fitter may shrink to, maxLines = lines allowed. Overflow is reported, never hidden.
 * Layout contract: diagram labels 34 preferred / 26 min · dialogue 40 / 30 · captions 42 / 32 · titles 58 / 42 · status labels 26 / 22.
 */
window.EsssouthStyleSlots = {
 "header.num": {
  "bounds": {
   "x": 96,
   "y": 52,
   "w": 60,
   "h": 44
  },
  "fs": 22,
  "minFs": 18,
  "maxLines": 1
 },
 "header.section": {
  "bounds": {
   "x": 170,
   "y": 52,
   "w": 760,
   "h": 44
  },
  "fs": 30,
  "minFs": 24,
  "maxLines": 1
 },
 "header.chip": {
  "bounds": {
   "x": 980,
   "y": 54,
   "w": 844,
   "h": 44
  },
  "fs": 21,
  "minFs": 17,
  "maxLines": 1
 },
 "caption": {
  "bounds": {
   "x": 260,
   "y": 884,
   "w": 1560,
   "h": 140
  },
  "fs": 42,
  "minFs": 32,
  "maxLines": 2
 },
 "bubble": {
  "bounds": {
   "x": 96,
   "y": 116,
   "w": 1060,
   "h": 240
  },
  "fs": 40,
  "minFs": 40,
  "maxLines": 3
 },
 "token.default": {
  "travelling": true,
  "minScale": 0.8,
  "maxLines": 2
 },
 "token.kicker": {
  "travelling": true,
  "minScale": 0.85,
  "maxLines": 1
 },
 "token.title": {
  "travelling": true,
  "minScale": 0.75,
  "maxLines": 2,
  "minPx": 42
 },
 "token.chip": {
  "travelling": true,
  "minScale": 0.87,
  "maxLines": 2,
  "minPx": 26
 },
 "token.idea": {
  "travelling": true,
  "minScale": 0.87,
  "maxLines": 2,
  "minPx": 26
 },
 "token.question": {
  "travelling": true,
  "minScale": 0.87,
  "maxLines": 3,
  "minPx": 26
 },
 "token.note": {
  "travelling": true,
  "minScale": 0.87,
  "maxLines": 2,
  "minPx": 26
 },
 "token.step": {
  "travelling": true,
  "minScale": 0.87,
  "maxLines": 3,
  "minPx": 26
 },
 "token.colhead": {
  "travelling": true,
  "minScale": 0.87,
  "maxLines": 1,
  "minPx": 26
 },
 "token.quote": {
  "travelling": true,
  "minScale": 0.94,
  "maxLines": 6,
  "minPx": 30
 },
 "token.hold": {
  "travelling": true,
  "minScale": 0.8,
  "maxLines": 2
 },
 "token.hint": {
  "travelling": true,
  "minScale": 0.85,
  "maxLines": 2
 },
 "tag.small": {
  "travelling": true,
  "minScale": 1,
  "maxLines": 1
 },
 "token.frame": {
  "travelling": true,
  "minScale": 0.85,
  "maxLines": 2,
  "minPx": 22
 },
 "token.hchip": {
  "travelling": true,
  "minScale": 0.8,
  "maxLines": 1
 }
};
window.EsssouthStyleContract = { diagram: [34, 26, 3], dialogue: [40, 30, 6], caption: [42, 32, 2], title: [58, 42, 2], status: [26, 22, 2], note: "[preferred px, minimum px, max lines]" };
