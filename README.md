# Interactive Pedagogicals

Interactive, teaching-oriented web pages that make research visible: you press play, time runs, and
the evidence appears where and when it belongs. Every page is self-contained static HTML, CSS and
JavaScript with no external libraries, fonts, images or audio files, so it runs from disk, on GitHub
Pages or on any static host.

*Svenska längre ned.*

## What this repository shows

| Page | Play | What it is |
|---|---|---|
| [**De första amerikanerna / The First Americans**](forsta-amerikanerna/) | [Swedish](https://fbratten.github.io/interactive-pedagogicals/forsta-amerikanerna/?lang=sv) · [English](https://fbratten.github.io/interactive-pedagogicals/forsta-amerikanerna/?lang=en) | How people reached the Americas, from the oldest traces the finds *suggest* to the year 1500: an interactive globe and timeline where archaeology and genetics are shown side by side |

*The play links work once GitHub Pages is enabled for this repository.*

### De första amerikanerna / The First Americans

- A WebGL globe drawn from Natural Earth coastlines. Sea level falls and rises, the Bering land
  bridge forms and breaks, and the ice sheets grow and melt through 40,000 years.
- A play button and a time slider from 40,000 years ago to 1500 CE, slowing down at every event,
  with a story camera that follows the action. You can also drag, pinch and zoom freely.
- 65 sourced events (archaeology, genetics, climate, late contacts), each marked **established**,
  **suggested** or **disputed**, with the reason for any uncertainty and links to the research.
- A genetic family tree that grows with time, original SVG illustrations, and sound synthesised in
  the browser.
- Swedish and English (`?lang=sv` / `?lang=en`, or the SV/EN button).

## Purpose

1. **Show the evidence, not just the story.** Popular accounts of prehistory often present one tidy
   narrative. These pages show the individual finds and genetic results, how strong each one is, and
   where researchers disagree, such as the White Sands footprints versus the genetic time window, or
   the 2026 dispute over Monte Verde.
2. **Put genetics next to archaeology.** Ancient DNA has changed the picture since 2010. Genetic
   readings get their own layers, routes and family tree, so the two kinds of evidence can be compared.
3. **Be checkable.** Every event links to its sources, the raw research data is in the repository,
   and the build scripts regenerate the page data from it.
4. **Be reusable.** Open licenses (MIT for code, CC BY 4.0 for content) so teachers, students and
   developers can use and adapt the material.

## Run locally

```bash
cd forsta-amerikanerna
python3 -m http.server 8000     # or just open index.html in a browser
```

Each page folder has its own README with structure, data sources, method and known limitations.

## Next steps (possible next MVPs)

Ordered roughly by value for the effort. None of these is started.

| # | MVP | What it adds | Why |
|---|---|---|---|
| 1 | **Digitized ice margins** | Replace the simplified ice-dome model with the published Dalton et al. 2020 ice-sheet reconstructions (converted from radiocarbon to calendar years) | Ice margins become exact instead of approximate (today they can be off by 100-300 km) |
| 2 | **Real sea-floor depth** | A bathymetry grid (for example a GEBCO or ETOPO subset) so coasts flood depth by depth | Beringia and other shelves drown realistically instead of through the 200 m contour proxy |
| 3 | **Culture areas around 500 CE** | An optional layer with hunter-gatherers, farmers, chiefdoms and high cultures, as in classic school atlases | Connects the migrations to the societies that followed |
| 4 | **Level switch** | A second text level for pupils aged about 10-15, next to the current adult level | Makes the page usable in school |
| 5 | **Narration** | Spoken narration for the film mode and the YouTube versions, in Swedish and English | Better for viewing without reading |
| 6 | **Teacher pack** | Quiz, printable worksheet and a lesson plan linked to the timeline | Ready-made classroom use |
| 7 | **More sites** | Pedra Furada, Taima-Taima, Triquet Island, Broken Mammoth and other sites not yet researched | Wider coverage, especially of South America |
| 8 | **Indigenous voices** | Links to, and ideally collaboration with, Indigenous-authored sources and histories | The science is one perspective among several |
| 9 | **Quality gates in CI** | Headless browser smoke test, data validation and a source link checker on every pull request | Keeps the page working and the sources alive |
| 10 | **Low-power mode** | Lower render resolution and a 2D fallback map for old phones and browsers without WebGL | Wider reach |
| 11 | **Source freshness check** | A scheduled review of the live disputes (Monte Verde, early South American sites, genetic dating) | Fast-moving field; 2026 findings will be followed by replies |
| 12 | **More pages** | The same engine for Oceania (Lapita and Polynesian voyaging) and Africa | The atlas spread that inspired this page covers Oceania, the Americas and Africa |

## License

- Code: MIT, see [LICENSE](LICENSE).
- Texts, illustrations and research data: CC BY 4.0, see [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
- Map data: Natural Earth (public domain).

Security: see [SECURITY.md](SECURITY.md). Public release review and settings checklist:
[docs/public-release-review.md](docs/public-release-review.md).

---

## På svenska

**interactive-pedagogicals** är interaktiva, pedagogiska webbsidor som gör forskning synlig: du trycker
på play, tiden löper och beläggen dyker upp där och när de hör hemma. Varje sida är fristående HTML,
CSS och JavaScript utan externa bibliotek, typsnitt, bilder eller ljudfiler.

**Första sidan, *De första amerikanerna*,** visar hur människor kom till Amerika. Tidslinjen börjar vid de
äldsta spår som fynden *antyder* och slutar år 1500. Sidan har:
- en glob där havet sjunker och stiger och istäckena växer och smälter,
- 65 källsatta händelser märkta belagt, antytt eller omstritt,
- ett genetiskt släktträd och syntetiserat ljud,
- svenska och engelska.

**Syftet** är att:
- visa beläggen och inte bara berättelsen,
- ställa genetik bredvid arkeologi,
- vara kontrollerbar, eftersom varje händelse länkar till sina källor och rådata ligger i repot,
- vara fri att återanvända (MIT för kod, CC BY 4.0 för innehåll).

**Nästa steg** finns i tabellen ovan, *Next steps*. De viktigaste är:
- digitaliserade isgränser (Dalton m.fl. 2020),
- verkligt havsdjup,
- ett lager med kulturområden kring år 500,
- en nivåväljare för skolelever,
- berättarröst, lärarmaterial och fler fyndplatser.
