DATA IN THIS PACKAGE (open the .csv files in Excel, Numbers or Google Sheets)

homes.csv
  The 47 student homes shown on the map: fixed map number and ID, area, address, coordinates,
  "from" prices per week, rating and review count.
  Source: Amber (amberstudent.com) listings, checked 17 October 2026. Historical, not live availability.
  "No rooms listed" means no bookable room was listed on that date.
  Used by: index.html (the map) and every quiz version.

nearby-places-openstreetmap.csv
  1,406 everyday places within 1.5 km of a home: supermarkets, food shops, restaurants, cafés,
  takeaways, pubs/bars, libraries, gyms, shops, museums/cinemas. Flags show places tagged as
  East/Southeast Asian, South Asian/Middle Eastern, vegan-friendly or open 24/7.
  Source: OpenStreetMap (© OpenStreetMap contributors), fetched 19 October 2026. Some places may be
  missing, mis-tagged or closed. Chung Wah and Sida Express were flagged as Asian grocers by name.
  Used by: home-match.js to pick the homes that suit each result.

characters.csv
  The 15 Life Quiz characters (5 lifestyles x 3 food styles) and their one-liners.
  Used by: life-c-model.js, which also holds the questions, keywords, "day in Liverpool" lines,
  comparison sentences and weekend plans. Edit wording there.

These files are exports for review. The website reads its data from the .js / .html files,
so changing a .csv does not change the site.
