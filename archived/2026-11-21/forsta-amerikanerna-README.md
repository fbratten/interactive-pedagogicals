# De första amerikanerna

Interaktiv glob och tidslinje om hur människor kom till Amerika, från de äldsta spår som fynden *antyder*
till år 1500. Arkeologi och genetik visas sida vid sida, och genetiska tolkningar har egna lager, rutter
och ett eget släktträd.

- Play-knapp och tidsreglage spelar upp 40 000 år (uppspelningen saktar in vid varje händelse).
- Havet sjunker och stiger, Beringias landbrygga bildas och bryts, istäckena växer och smälter.
- 65 källsatta händelser med statusmärkning: **belagt**, **antytt** eller **omstritt**.
- Egna SVG-illustrationer och ljud som skapas i webbläsaren med Web Audio.
- Inga externa bibliotek, typsnitt, bilder eller ljudfiler.

## Kör

Öppna `index.html` direkt i webbläsaren (fungerar även från disk, `file://`), eller:

```bash
cd forsta-amerikanerna
python3 -m http.server 8000
# öppna http://localhost:8000/
```

Kräver WebGL för globen. Utan WebGL fungerar tidslinjen, korten och släktträdet ändå.

Tangentbord: mellanslag spelar och pausar, vänster och höger pil hoppar mellan händelser, Home och End
går till början och slutet, plus och minus zoomar. Länkar kan peka på en tidpunkt och en händelse:
`index.html#t=14500&e=monte-verde`.

## Filer

| Sökväg | Innehåll |
|---|---|
| `index.html`, `css/style.css` | Sidan och dess stil |
| `js/time.js` | Tidsskala (berättelsetid mot år), havsnivå, landbrygga, klimatfaser |
| `js/ice.js` | Förenklad ismodell: yttre isgräns vid istidsmaximum plus krympande isdomer |
| `js/globe.js` | WebGL-glob: masktextur ur Natural Earth, ortografisk rendering per pixel |
| `js/camera.js` | Berättelsekamera och fri kamera (dra, nyp, scrolla) |
| `js/overlay.js` | Rutter, fyndplatser, etiketter och pulser i ett 2D-lager |
| `js/story.js` | Kapitel, kamerabana, etiketter, rutter och släktträdets data |
| `js/ui.js`, `js/main.js` | Gränssnitt, uppspelning, interaktion |
| `js/art.js`, `js/audio.js`, `js/tree.js` | Illustrationer, ljud, släktträd |
| `data/geo.js` | Kustlinjer, sjöar och 200-metersdjupkurvan (genererad) |
| `data/events.js` | Händelserna (genererad ur `research/`) |
| `research/*.json` | Forskningsunderlaget med källor och kontrollnoteringar per händelse |
| `tools/build_events.py` | Bygger `data/events.js` ur `research/` (dubbletter, kartjusteringar, illustrationer) |
| `tools/build_geo.py` | Bygger `data/geo.js` ur Natural Earth GeoJSON (kräver `shapely`) |
| `tools/dev-globe.html` | Utvecklingsvy för att stämma av ismodellen vid en viss tidpunkt (`?bp=14000&lat=55&lon=-115&zoom=1.4`) |

Bygg om data:

```bash
python3 -I tools/build_events.py
# geometri: ladda ner ne_50m_land, ne_50m_lakes och ne_10m_bathymetry_K_200 (GeoJSON) från
# github.com/nvkelso/natural-earth-vector till en egen mapp, sedan:
python3 -I tools/build_geo.py <mapp-med-geojson> data/geo.js
```

## Underlag och metod

- **Händelser:** framtagna och kontrollerade mot källor 2026-11-21 i två parallella forskningspass
  (genetik och miljö, respektive arkeologi och sena kontakter), plus en oberoende stickprovsgranskning.
  Varje händelse har 1-3 källor, oftast DOI till originalartikeln. Fältet `verified` i `research/*.json`
  säger vad som faktiskt kontrollerades.
- **Status:** belagt = brett stöd; antytt = rimlig tolkning (ofta genetik eller enstaka fynd); omstritt =
  aktiv oenighet om datering eller tolkning. Alla antydda och omstridda händelser förklarar osäkerheten.
- **Datum:** kalibrerade år före 1950 (BP); från år 0 anges år e.Kr.
- **Havsnivå:** Spratt och Lisiecki 2016, 30 000-6 000 år sedan. Före 30 000 år sedan hålls värdet konstant.
- **Landbryggan:** bildas ca 35 700 år sedan (Farmer, Pico m.fl. 2022), bryts ca 11 000 år sedan
  (Jakobsson m.fl. 2017).
- **Istäcken:** egen förenklad modell som följer huvuddragen i Dalton m.fl. 2020. Gränserna kan avvika
  100-300 km. Nästa steg för större precision är att digitalisera Daltons tidsskivor (obs: de är i
  okalibrerade kol-14-år).
- **Kartdata:** Natural Earth (public domain).
- **Rutter:** pedagogiska pilar som visar en tolkning av riktning och ungefärlig tid, inte exakta vägar.

## Kända begränsningar

- Monte Verde är omstritt sedan mars 2026; uppgiften om en ny utgrävning i oktober 2026 bygger på en
  nyhetsartikel i Science och är inte publicerad som studie.
- Torrlagd havsbotten ritas inom 200-metersdjupet, vilket ger en ungefärlig bild.
- Ljudet startar först efter ett klick (webbläsarnas regler för autouppspelning).

## Ursprungsfolkens perspektiv

Många ursprungsfolk har egna historier om sitt ursprung. Sidan visar vad arkeologi och genetik antyder,
vilket är ett perspektiv bland flera. Kennewickmannen kallas av de berörda stammarna för Den forntida.
År 1492 är här bara en slutpunkt.
