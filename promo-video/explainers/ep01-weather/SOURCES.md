# Episode 01 · Sources and checks

Checked on 2026-11-10. The Met Office site could not be opened directly from the production environment (network policy), so each Met Office fact below was taken from search excerpts of the official page. Please open the links once and confirm before publishing.

## Facts used in the narration

| Claim in the video | Source | Notes |
|---|---|---|
| Britain sits where different air masses meet; polar maritime air from the north-west is the most common; it warms and picks up moisture over the Atlantic, becomes unstable and gives showers | Met Office, "Air masses" learn-about pages and Factsheet 10 "Air masses and weather fronts" (2023): https://weather.metoffice.gov.uk/learn-about/weather/atmosphere and https://www.metoffice.gov.uk/binaries/content/assets/metofficegovuk/pdf/research/library-and-archive/library/publications/factsheets/factsheet_10-air-masses-and-weather-fronts_2023.pdf | "Most common air mass affecting the UK" is the Met Office wording for polar maritime |
| A shower can cover as little as one square kilometre and moves with the wind | Met Office, "What is the difference between rain and showers?" https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/rain/rain-and-showers and blog "Rain or showers? What's the difference?" (2025) https://www.metoffice.gov.uk/blog/2025/rain-or-showers-whats-the-difference | |
| Sunshine hours count only the time the sun actually shines through | Met Office, "How we measure sunshine" https://weather.metoffice.gov.uk/guides/observations/how-we-measure-sunshine | Sunshine = direct solar irradiance above 120 W/m² (WMO definition). The threshold itself is not mentioned in the video |
| December averages about 40 hours of sunshine in the whole month (England NW & N Wales) | Met Office district climate averages, England NW & N Wales, 1991–2020 (about 40 h in December, about 173 h in June, 1374 h a year): https://www.metoffice.gov.uk/research/climate/maps-and-data/location-specific-long-term-averages/index.html | District average, not a Liverpool station figure. The Met Office Crosby station table has no sunshine value, so no Liverpool-only number is used |
| On the Met Office forecast, 70% means a 7 in 10 chance that some rain (at least 0.1 mm) falls within that hour | Met Office, "What does this forecast mean?" https://www.metoffice.gov.uk/weather/guides/what-does-this-forecast-mean | The search result showed this page as several years old; wording may have changed |
| Daylight in Liverpool: about 7½ hours in late December, about 17 hours in late June; midday sun about 13° in midwinter and about 60° in midsummer; midday shadow about 4× and about 0.6× your height | Calculated, not quoted: standard sunrise/sunset formula for 53.41°N, 2.98°W (see `build.py`); noon altitude = 90° − latitude ± 23.44°; shadow = height ÷ tan(altitude) | Results: 21 Dec 08:25–15:55 (7.49 h), 21 Jun 04:43–21:44 (17.02 h); 13.2° and 60.0°; 1/tan = 4.26 and 0.58 |
| "Out of about 230 hours of daylight" (graphic only) | Derived: 31 days × about 7½ h | Marked as an approximation on screen |

## Product insert (0:55–1:17)

- Real operation of the "日照" (sunlight reference) tool in the 留学住宿通 offline web package dated 2026-11-03, building "true Liverpool". The online entrance https://home.gxernv.cn/map-preview/ was blocked by the production environment's network policy, so the offline package was used as the brief allows.
- What the tool itself shows and says: sun direction and height through the day, solstice / equinox / today presets, which outer walls are lit, and its own note "仅计算图示楼体的外墙，不代表楼群内其他楼栋或具体房间". The narration states the same limits (no neighbouring buildings, cloud or indoor light).
- The tool's sunrise/sunset labels (08:30–15:50, 04:45–21:40) are its own rounded values; the explainer bars use the calculated times above.
- The shadow diagram at 1:18–1:34 is an illustration of geometry and is labelled as such; it is not a tool output.

## Illustrations that are not data

- The map at 0:08–0:23 is a schematic (labelled "Schematic map").
- The hourly forecast at 1:34–1:46 is labelled "ILLUSTRATION · not a real forecast".

## Voice, music, sound

- Voice: Kokoro-82M text-to-speech (open model, Apache-2.0), British male voice `bm_george`, speed 1.25. Model files from https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0). I could not listen to the audio in this environment: please play it once to check pronunciation.
- Music: paulyudin, "The Tech", the royalty-free track supplied by the team earlier (`promo-video/music/track.mp3`). Please keep the team's licence record for it.
- Tap, pop and whoosh sounds: synthesised by `promo-video/music/mix.py`.
- Map data in the app: © OpenStreetMap contributors (ODbL), as shown in the app.
