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
