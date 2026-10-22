# Liverpool Student Map: Product and Demo Guide

Version: 22 October 2026 · Branch `claude/serene-faraday-1ktbef`

Liverpool Student Map helps students from Singapore, China and Japan choose student housing in Liverpool before they arrive. The website shows 47 student homes on a hand-drawn map. When a student wants help, one tap puts them in touch with a booking expert team through a WhatsApp group (Singapore and English speakers) or a WeChat group (China).

The product does three jobs only:

1. **Show the homes.** Map, prices, walking times, room photos, and fun matching quizzes.
2. **Get the student into a group chat quickly.** There is no sign-up and no form, and students don't leave a name or phone number.
3. **Tell the expert team, and let them send the group QR code back to the student's page.**

There are no payments and no accounts. Bookings happen inside the group chat with a human expert.

---

## 1. What is in this package

| Folder / file | What it is | Status |
|---|---|---|
| `web-live/` | **The student website** (the live site's layout, unchanged) plus all new features, and the **booking expert console** (`adviser.html`) | **Final version, use this** |
| `web-original/consult-server/` | **The server**: request codes, expert login, email / WeCom alerts, group QR delivery | **Final version, use this** |
| `data/` | The listing data as spreadsheets: `homes.csv` (47 homes), `room-types.csv`, `homes.json` | Exported from the website |
| `GUIDE-EN.md` (this file), `GUIDE-EN.html` (same, with pictures), `docs/screenshots/` | This guide and screenshots of every screen | |
| `start-demo.sh` / `start-demo.cmd` | One command to run the full system on a laptop | |
| `web-demo/` | An earlier phone-app style prototype (student app, adviser console, dashboard) | Reference only |
| `web-original/liverpool-life-map-en/` | The original website source before the live-site edits | Reference only |
| `miniprogram/` | WeChat Mini Program version (code ready, not connected to WeChat yet) | Later |
| `design/` | Room-photo design drafts and an older single-file demo | Reference only |

Most of the code comments and the older READMEs are in Chinese. This guide covers everything the Singapore team needs in English.

---

## 2. How to demo it

### Option A: open the online preview (no setup)

Open the preview link we shared on claude.ai. Add these to the end of the link to jump straight to a view:

- `#adviser`: the booking expert console
- `#flow`: the two-sided walkthrough (student site on the left, expert console on the right)

In the preview everything runs in your own browser, using sample conversations. The student page and the expert console talk to each other through the browser, so the demo works on one computer. The preview cannot reach outside services, so the weather shows **sample weather** (tap the weather label, then "Try another", to see rain, fog, snow and sun on the map).

### Option B: run the real system on a laptop (two devices)

You need [Node.js](https://nodejs.org) 18 or newer. Nothing else needs installing.

```bash
# macOS / Linux, from the package folder
./start-demo.sh
# Windows
start-demo.cmd
```

Then open:

- **Student website:** `http://localhost:8765/`
- **Booking expert console:** `http://localhost:8765/adviser.html` (password `123456`)

On the same Wi-Fi, a phone can open `http://<laptop IP>:8765/` to play the student, while the laptop plays the expert. This is the best live demo. The student taps **Join my group now** on the phone, the expert sees the request on the laptop, sends a WhatsApp link, and the QR code appears on the phone within a few seconds.

### Suggested 5-minute demo script

1. **Map** (`01`, `02`): 47 homes, campuses, stations, food streets. Cars, the Mersey ferry and gulls move. The weather label shows Liverpool's time and weather.
2. **A home** (`03`, `04`): tap home 1 (iQ Great Newton House), then **Details** for room types and photos by bedroom / bathroom / kitchen.
3. **Quizzes** (`15`, `11`, `12`, `13`): try the study-buddy quiz (English). Home Match (8 picture cards, Chinese only for now) highlights the best 3 homes on the map, and the student can make a share card for Instagram or WeChat.
4. **Ask about a home** (`05`, `06`): tap **Ask about this home**. The student can ask a quick question (price, distance, bills), then taps **Join my group now**. They get a request code such as `LSM-7K2Q`.
5. **Expert side** (`07`, `08`): the request appears in the console as `🇸🇬 LSM-7K2Q · Singapore · local time 21:05`. The expert creates a new WhatsApp group, pastes the invite link, and taps **Send QR code to chat**.
6. **Student receives the group** (`09`): the QR code and the expert's message appear on the student's page. The student scans it and is in the group.
7. **Dashboard** (`10`): visitors → chats → group requests → joined → booked, by region and by traffic source.

---

## 3. Student website (`web-live/index.html`)

The layout is exactly the live site's. New features were added in separate files so the original stays intact.

| Feature | What the student sees | File |
|---|---|---|
| Hand-drawn map | 47 homes, campuses, stations, bus hubs, food streets and landmarks. Zoom, pan, filters and sorting by price, walking time, rating | `index.html` (original) |
| Home numbers and sorting | The blue number on each house is a **fixed home number**, grouped by area (1–11 Knowledge Quarter, and so on). It never changes, so students and experts can say "home 2". **Sort by** sits at the top of the home list: price, walking time to a campus, station or city centre, reviews, rating. The list shows each home's place, and the top 3 get gold "1st / 2nd / 3rd" tags on the map. Filters (budget, room type, walking time) hide homes that don't match | `index.html`, `rank-compare.js` |
| Animation | Two cars, the Mersey ferry, gulls and a flock of gulls crossing the river. Now also on phones; pauses while dragging and when the phone asks for reduced motion | `index.html`, `map-life.js` |
| **Live Liverpool weather** | A label with Liverpool's local time, weather and temperature. Tap for high / low, chance of rain, wind, sunset, the time difference with Singapore, Beijing or Tokyo, and a tip ("Take an umbrella for the walk to campus"). Rain, snow, fog, cloud and night are drawn on the map | `weather.js`, `weather.css` |
| Room types and photos | Inside a home's details: room-type cards (price, availability) and a photo album grouped by bedroom / bathroom / kitchen. Home 1 has real photos; the other 46 show prices and "photos coming soon" | `room-photos.js` |
| Home Match (life-style quiz) | 8 picture cards; tapping an answer moves to the next one automatically. Shows the 3 best homes on the map with reasons. The top of the result has a quick comparison (price, walk, rating) and a **Compare these 3 side by side** button that opens the full comparison table. The personality quizzes have the same | `home-match.js`, `rank-compare.js` |
| Personality quizzes | Four short, shareable quizzes in the same style: introvert / extrovert flatmate type, study-abroad chill level, study buddy (invite a friend to compare), booking decision style. Each ends with 3 home picks and a share card. Direct links: `?quiz=ie`, `?quiz=soft`, `?quiz=buddy`, `?quiz=booking` | `fun-quizzes.js` |
| Share cards | Four styles (map, polaroid, ticket, sticky notes), 1080×1350 images, with a QR code that carries the sharer's referral code (`?ref=`) so we can see which students bring friends | `share-cards.js` |
| Subject picker | "My subject" list in the hand-drawn style (no iPhone system wheel). Shows which campus the student will walk to | `fancy-select.js`, `subject-dock.js` |
| Draggable panels | "Find a home", "Home list" and the quiz card can be dragged; drag to the screen edge to tuck them away as a small arrow | `panel-drag.js` |
| Highlight focus | After a quiz, tapping a home that is not recommended un-dims the map | `pick-focus.js` |
| **Join the booking group** | See section 5 | `booking-handoff.js`, `case-api.js` |
| Chat bubble | A floating bubble shows a red dot when the expert sends the QR code or a message. It can be dragged and docks to the screen edge | `booking-handoff.js` |
| Install as an app | Can be added to the home screen and works offline for browsing | `pwa.js`, `sw.js`, `manifest.webmanifest` |
| Languages | English, Chinese and Japanese buttons. Everything is in English and Chinese **except Home Match (生活选房), which is Chinese only for now**; the other personality quizzes are in English. The Japan team will translate the Japanese content | all files |

---

## 4. Booking expert console (`web-live/adviser.html`)

A web page for the experts. It works on a laptop and on a tablet.

| Area | What it does |
|---|---|
| Sign-in | Password sign-in when connected to the server (default `123456`, change it before launch with `ADMIN_PASSWORD`) |
| Alert bar and bell | "New group request: LSM-7K2Q needs a booking group" with an **Open** button. The browser tab title shows the number waiting |
| Inbox | Every student is shown by **request code, flag and status**: waiting for a group, QR sent, joined, booked. Filters: All, Needs a group, In progress, Done. Search by code |
| Conversation | What the student did: the home they asked about, the questions they asked the AI helper before joining (and its answers), the QR code sent, messages |
| Student context | Region (guessed from the browser's time zone), language, **the student's local time**, traffic source, quiz result, homes viewed, favourites, request time, assigned team |
| **Create group & send QR** | Pick the expert team, WhatsApp or WeChat, group name (pre-filled with the code and home, e.g. `LSM-7K2Q · Capital Gate`). For **WhatsApp**, paste the group invite link; the QR code is generated. For **WeChat**, upload the group QR image (WeChat → group info → Group QR code → Save image) |
| Status | Mark joined, mark booked. WeChat codes expire after 7 days: the console warns and offers **Send a new code** |
| Reply | Send a short text to the student's page |
| Dashboard | Funnel (visitors → chats → requests → QR sent → joined → booked), by region and by traffic source. In the demo this uses sample numbers |
| Email alerts panel (demo only) | Choose recipients and which events send an email, and preview the email |
| Open from email | The alert email links to `adviser.html#<id>` and opens that student directly |

---

## 5. The booking-group flow, step by step

```
Student taps "Join my group now"
   │  (no name, no phone number, no account)
   ▼
Server creates a request code, e.g. LSM-7K2Q, and a secret token kept on the student's device
   │  region guessed from time zone + language (SG, CN, HK, TW, JP, UK)
   ▼
Expert team gets an email / WeCom alert: "New group request: LSM-7K2Q · SG"
   ▼
Expert creates a NEW WhatsApp or WeChat group named "LSM-7K2Q · <home>"
   │  WhatsApp: paste invite link   ·   WeChat: upload group QR image
   ▼
Student's page checks every 6 seconds and shows the QR code and message
   │  (closing the page is fine: the code is kept on the device and shown next time)
   ▼
Student scans and joins. One code = one group, so whoever joins that group is that student.
```

**How we tell students apart without collecting personal data.** Each student only has an anonymous request code. Two students asking at the same moment from Singapore and Shanghai get different codes (for example `LSM-7K2Q` and `LSM-P4XD`), different flags, and their own local times. The group name carries the code, so the expert always knows which group belongs to which request.

**Channels.** English and Japanese pages default to WhatsApp; Chinese defaults to WeChat. The student can switch with one tap.

**WhatsApp vs WeChat codes.** A WhatsApp invite link does not expire (unless reset in the group). A WeChat group QR code **expires after 7 days**; the student's page then shows **Ask for a new code**, which alerts the expert again.

**Before joining.** The student can ask one or two quick questions (Is there a room? How much? How far? Are bills included?). The helper answers only from our listing data. For availability or contracts, or after two rounds, it points the student to the group. These answers are a rule-based demo for now; a real AI can replace them later. The questions are passed to the expert.

**One student, more homes.** If a student already has a group and asks about another home, it is added to the same request and the expert is told.

**Pre-built group pool (off by default).** For very busy periods, experts can prepare groups in advance and send them automatically. It is off because WeChat codes expire after 7 days; creating a new group per student is the default.

---

## 6. Two modes: demo and real

The pages check for the server when they open (`./api/health`):

| | Demo mode | Real mode |
|---|---|---|
| When | Page opened as files, or on a static host without the server (like the online preview) | Page served by `consult-server` |
| Data | Stays in the browser; sample conversations are included | Saved on the server (`data/` folder) |
| Devices | One browser (student tab + expert tab) | Any devices: student on a phone, expert on a laptop |
| Expert sign-in | None | Password |
| Group codes | Demo links (scanning doesn't join a real group) | Real WhatsApp links / WeChat QR images |
| Alerts | Shown in the console's email panel | Real email (Gmail / Google Workspace or an email API) and WeCom |

The screens are the same in both modes.

---

## 7. Server setup (`web-original/consult-server`)

Node.js 18+, no other software or packages.

```bash
# from the package folder
SITE_DIR=web-live ADMIN_PASSWORD=<choose a password> node web-original/consult-server/server.js
```

Settings (environment variables):

| Setting | What it does | Default |
|---|---|---|
| `PORT`, `HOST` | Port and address | `8765`, `0.0.0.0` |
| `SITE_DIR` | Which website to serve. Use `web-live` | the original site |
| `ADMIN_PASSWORD` | Expert console password | `123456` (**must change**) |
| `PUBLIC_URL` | Public address, used in alert links, e.g. `https://book.example.com` | from the request |
| `NOTIFY_EMAIL_TO` | Who receives alerts (comma-separated) | none |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Send email through Google: `smtp.gmail.com`, `465`, the mailbox, and a Google **app password** (needs 2-step verification on that account) | none |
| `NOTIFY_EMAIL_FROM` | Sender name and address | `SMTP_USER` |
| `EMAIL_API_KEY`, `EMAIL_API_URL` | Or send through an email API (Resend format by default) | none |
| `WECOM_WEBHOOK_URL` | WeCom (WeChat Work) group bot for alerts | none |
| `DATA_DIR` | Where requests and uploaded QR images are saved | `consult-server/data` |
| `WX_APPID`, `WX_APPSECRET`, `WX_TOKEN`, `WX_ENCODING_AES_KEY` | WeChat Mini Program channel (later) | off |

Example with Google email:

```bash
SITE_DIR=web-live PUBLIC_URL=https://book.example.com ADMIN_PASSWORD=<password> \
SMTP_HOST=smtp.gmail.com SMTP_PORT=465 SMTP_USER=bookings@example.com SMTP_PASS=<app password> \
NOTIFY_EMAIL_TO=expert1@example.com,expert2@example.com \
node web-original/consult-server/server.js
```

Self-tests: `cd web-original/consult-server && npm test` runs offline tests for the server, email sending and the request-code flow. All pass.

Server API, for developers:

- Student: `POST /api/cases` (create request), `GET /api/cases/:id?token=` (check for the group code), `POST /api/cases/:id/homes` (asked about another home), `POST /api/cases/:id/renew` (new WeChat code)
- Expert (signed in): `GET /api/admin/cases`, `POST /api/admin/cases/:id/group` (WhatsApp `link` or WeChat `image`), `POST /api/admin/cases/:id/status`, `POST /api/admin/cases/:id/reply`

---

## 8. Data

| File | Contents |
|---|---|
| `data/homes.csv` | 47 homes: number, name, area, address, coordinates, from-price per week (38 homes have a recorded price), en-suite and studio prices, rating and number of reviews, walking minutes to the University of Liverpool, LJMU City Campus, Lime Street station and the city centre, short description. Opens in Excel / Google Sheets |
| `data/homes.json` | The same, for developers |
| `data/room-types.csv` | Room types with English / Chinese / Japanese names, weekly price, availability and photo files. Only home 1 (iQ Great Newton House) has room types and photos so far (3 of its 9 types) |
| `web-live/photos/` | The room photos for home 1 |

Sources: listings and photos from our partner AmberStudent (collected 21 October 2026). Prices are past "from" prices for reference and are not live availability. To add photos for more homes, add them to `ROOMS` in `web-live/room-photos.js`.

---

## 9. Privacy

- Students don't register, and we don't collect names, phone numbers or email addresses on the website.
- The device keeps only the request code and a random token. The server keeps the code, guessed region, time zone, language, the homes asked about, the quick questions, and the group code sent.
- Personal contact happens inside WhatsApp / WeChat once the student chooses to join.
- Share-card links carry a referral code only, not personal data.

---

## 10. Before going live

- [ ] Choose the alert mailbox (likely Google) and create an app password. Set `NOTIFY_EMAIL_TO`.
- [ ] Get a server (any small cloud server that runs Node.js) and a domain with HTTPS (Nginx or Caddy in front of port 8765). Set `PUBLIC_URL`.
- [ ] Change `ADMIN_PASSWORD`. Back up the `data/` folder regularly.
- [ ] Remove the demo links (`web-live/demo-links.js`: the "Booking expert console" and "Two-sided walkthrough" entries in the map's **i** panel).
- [ ] Weather: Open-Meteo's free plan is for non-commercial use. Buy its commercial plan, or switch to the UK Met Office API.
- [ ] English version of Home Match (生活选房) for Singapore students.
- [ ] Japanese: the Japan team translates all Japanese text (we will send a Chinese / English / Japanese translation sheet).
- [ ] Optional later: a real AI for the pre-group questions, more room photos, and the WeChat Mini Program for China.

---

## 11. Screenshots (`docs/screenshots/`)

| File | Screen |
|---|---|
| `00-welcome.png` | First visit: Home Match welcome (Chinese only for now) |
| `01-map-desktop.png`, `02-map-phone.png` | The map on a laptop and an iPhone |
| `03-home-details.png`, `04-room-photos.png` | A home's details, room types and photo album |
| `05-student-join.png` | "Ask about this home": join the booking group in one tap |
| `06-student-waiting-code.png` | Waiting for the group, with the request code |
| `07a-adviser-login.png`, `07-adviser-inbox.png` | Expert sign-in and inbox |
| `08-adviser-send-group.png` | Build the group and send the WhatsApp link |
| `09a-adviser-sent.png`, `09-student-gets-qr.png` | QR sent; the student's phone receives it |
| `10-adviser-dashboard.png` | Dashboard (sample numbers) |
| `11-home-match-question.png`, `12-home-match-result.png` | Home Match quiz and its 3 picks (Chinese only for now) |
| `13-share-card.png`, `13b-share-card-image.png` | Share card maker and the image it makes |
| `14-weather.png` | Live Liverpool weather (sample in screenshots) |
| `15-personality-quiz.png` | Study-buddy personality quiz |
| `16-two-sided-walkthrough.png` | Student site and expert console side by side |

The screenshots in sections 5 and 7 come from real-mode runs, with the student on a phone and the expert on a laptop.
