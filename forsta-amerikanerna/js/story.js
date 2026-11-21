/* Berättelsens ramverk: kapitel, kamera, etiketter, rutter. Händelserna (fynd, genetik) finns i data/events.js.
   Rutter är pedagogiska pilar: de visar en tolkning, inte exakta vägar. Status följer samma skala som
   händelserna: belagt (heldragen), antytt (streckad), omstritt (prickad). */
(function (FA) {
  "use strict";

  FA.STORY = {
    chapters: [
      { from: 40000, to: 26001, title: "Nordostasien i istidens grepp", title_en: "Northeast Asia in the grip of the Ice Age", lead_en: "The ancestors of the Indigenous peoples of the Americas still live in Asia. Genetics shows that they begin to diverge from other East Asians.",
        lead: "Förfäderna till Amerikas urfolk lever ännu i Asien. Genetiken visar att de börjar skilja sig från andra östasiater." },
      { from: 26000, to: 19001, title: "Istidens kärna och Beringia", title_en: "The heart of the Ice Age and Beringia", lead_en: "The sea stands more than 120 meters lower than today. Between Siberia and Alaska lies a dry steppe: Beringia. The way south is closed by ice.",
        lead: "Havet står över 120 meter lägre än i dag. Mellan Sibirien och Alaska ligger en torr stäpp: Beringia. Vägen söderut är stängd av is." },
      { from: 19000, to: 14501, title: "Kusten öppnas", title_en: "The coast opens", lead_en: "The ice releases the Pacific coast. Boats and kelp forests may have made the coastal route possible, and genetics splits the people into a northern and a southern branch.",
        lead: "Isen släpper Stillahavskusten. Båtar och kelpskogar kan ha gjort kustvägen möjlig, och genetiken delar folket i en nordlig och en sydlig gren." },
      { from: 14500, to: 12501, title: "Snabb spridning över två kontinenter", title_en: "Rapid spread across two continents", lead_en: "Within a few thousand years there are people from Alaska to the southern tip of Chile. The Clovis culture appears in North America.",
        lead: "På några få årtusenden finns människor från Alaska till Chiles sydspets. Clovis-kulturen syns i Nordamerika." },
      { from: 12500, to: 8001, title: "En ny värld tar form", title_en: "A new world takes shape", lead_en: "The climate shifts, the big game disappears and the Bering Strait floods. Genomes show new movements within the continents.",
        lead: "Klimatet slår om, storviltet försvinner och Beringsundet svämmar över. Genomen visar nya flöden inom kontinenterna." },
      { from: 8000, to: 2001, title: "En andra våg från Asien", title_en: "A second wave from Asia", lead_en: "The ice is gone. New groups arrive from Siberia across the Arctic, the first to settle Canada\'s Arctic islands and Greenland.",
        lead: "Isen är borta. Över Arktis kommer nya grupper från Sibirien, de första som bebor Kanadas arktiska öar och Grönland." },
      { from: 2000, to: 450, title: "Havens folk möts", title_en: "Peoples of the oceans meet", lead_en: "Polynesians reach the coast of South America, Norse reach Vinland and the ancestors of the Inuit spread across the Arctic. The timeline ends in the year 1500.",
        lead: "Polynesier når Sydamerikas kust, nordbor når Vinland och inuiternas förfäder sprider sig över Arktis. Tidslinjen slutar år 1500." }
    ],

    // Berättelsekamera (BP fallande). zoom 1 = globen fyller vyn.
    camera: [
      { bp: 40000, lat: 50, lon: 135, zoom: 1.05 },
      { bp: 34000, lat: 57, lon: 160, zoom: 1.3 },
      { bp: 28000, lat: 61, lon: 178, zoom: 1.55 },
      { bp: 24000, lat: 61, lon: -168, zoom: 2.0 },
      { bp: 21000, lat: 52, lon: -140, zoom: 1.25 },
      { bp: 18000, lat: 55, lon: -142, zoom: 1.55 },
      { bp: 16300, lat: 45, lon: -124, zoom: 1.45 },
      { bp: 15000, lat: 12, lon: -92, zoom: 1.0 },
      { bp: 14000, lat: 30, lon: -100, zoom: 1.1 },
      { bp: 13300, lat: 48, lon: -112, zoom: 1.3 },
      { bp: 12700, lat: 12, lon: -88, zoom: 1.0 },
      { bp: 11500, lat: 58, lon: -160, zoom: 1.45 },
      { bp: 10300, lat: -12, lon: -66, zoom: 1.2 },
      { bp: 8600, lat: 52, lon: -85, zoom: 1.15 },
      { bp: 6500, lat: 30, lon: -80, zoom: 1.0 },
      { bp: 5200, lat: 68, lon: -125, zoom: 1.35 },
      { bp: 4300, lat: 70, lon: -70, zoom: 1.35 },
      { bp: 2900, lat: -17, lon: -172, zoom: 1.4 },
      { bp: 2000, lat: -5, lon: -80, zoom: 1.0 },
      { bp: 1250, lat: 5, lon: -100, zoom: 0.95 },
      { bp: 1080, lat: 62, lon: -30, zoom: 1.4 },
      { bp: 935, lat: 56, lon: -52, zoom: 1.6 },
      { bp: 900, lat: -12, lon: -152, zoom: 1.1 },
      { bp: 770, lat: -5, lon: -125, zoom: 0.95 },
      { bp: 700, lat: -18, lon: -165, zoom: 0.95 },
      { bp: 655, lat: 70, lon: -100, zoom: 1.25 },
      { bp: 520, lat: 62, lon: -45, zoom: 1.35 },
      { bp: 450, lat: 18, lon: -100, zoom: 0.95 }
    ],

    // Standstill: genetisk tolkning av en lång isolering i eller nära Beringia
    standstill: { from: 25000, to: 16000, lat: 63, lon: -172, radius: 9, status: "antytt",
      label_sv: "Beringisk standstill (genetisk tolkning)", label_en: "Beringian standstill (genetic reading)", },

    labels: [
      { text: "ASIEN", text_en: "ASIA", lat: 52, lon: 112, size: 16, spacing: 6 },
      { text: "SIBIRIEN", text_en: "SIBERIA", lat: 66, lon: 128, size: 12, spacing: 4, italic: true },
      { text: "NORDAMERIKA", text_en: "NORTH AMERICA", lat: 42, lon: -101, size: 16, spacing: 6 },
      { text: "SYDAMERIKA", text_en: "SOUTH AMERICA", lat: -14, lon: -60, size: 16, spacing: 6 },
      { text: "STILLA HAVET", text_en: "PACIFIC OCEAN", lat: 18, lon: -143, size: 15, spacing: 7, italic: true, color: "#bcd7ff" },
      { text: "STILLA HAVET", text_en: "PACIFIC OCEAN", lat: -30, lon: -125, size: 15, spacing: 7, italic: true, color: "#bcd7ff" },
      { text: "ATLANTEN", text_en: "ATLANTIC OCEAN", lat: 28, lon: -45, size: 15, spacing: 7, italic: true, color: "#bcd7ff" },
      { text: "EUROPA", text_en: "EUROPE", lat: 51, lon: 14, size: 14, spacing: 5 },
      { text: "POLYNESIEN", text_en: "POLYNESIA", lat: -21, lon: -152, size: 12, spacing: 4, italic: true, color: "#bff5ea", to: 450 },
      { text: "BERINGIA", text_en: "BERINGIA", lat: 63.5, lon: -171, size: 14, spacing: 5, color: "#f6e7c4", from: 38000, to: 11000 },
      { text: "Beringsundet", text_en: "Bering Strait", lat: 65.8, lon: -168.5, size: 12, spacing: 1, italic: true, color: "#bcd7ff", from: 11500, minZoom: 1.2 },
      { text: "LAURENTIDISKA ISTÄCKET", text_en: "LAURENTIDE ICE SHEET", lat: 59, lon: -88, size: 12, spacing: 3, color: "#29425e", from: 30000, to: 8300 },
      { text: "KORDILLERISKA ISTÄCKET", text_en: "CORDILLERAN ICE SHEET", lat: 55.5, lon: -124.5, size: 11, spacing: 2, color: "#29425e", from: 27000, to: 13000, minZoom: 1.2 },
      { text: "GRÖNLAND", text_en: "GREENLAND", lat: 73, lon: -40, size: 12, spacing: 4, color: "#29425e" },
      { text: "isfri korridor", text_en: "ice-free corridor", lat: 56.5, lon: -115.5, size: 12, spacing: 1, italic: true, color: "#ffe1a8", from: 13900, to: 11500 }
    ],

    // Rutter. tone: human | genetic | contested | arctic | norse | pacific
    // kind används för filtrering mot händelsetyperna.
    routes: [
      { id: "to-beringia", label_sv: "Mot Beringia", label_en: "Toward Beringia", tone: "genetic", kind: "genetik", status: "antytt",
        start: 30000, end: 24500, fade: 15000, labelAt: 0.55,
        waypoints: [{ lat: 52.5, lon: 104 }, { lat: 62, lon: 122 }, { lat: 69.5, lon: 136 }, { lat: 68.5, lon: 158 }, { lat: 66.5, lon: 174 }, { lat: 64.5, lon: -172 }] },
      { id: "coast", label_sv: "Kustvägen", label_en: "Coastal route", tone: "human", kind: "arkeologi", status: "antytt",
        start: 17200, end: 14600, fade: 11000, labelAt: 0.22,
        waypoints: [{ lat: 63, lon: -168 }, { lat: 58.5, lon: -160 }, { lat: 59.4, lon: -150 }, { lat: 58, lon: -138 }, { lat: 53.2, lon: -132.6 },
          { lat: 49, lon: -126.5 }, { lat: 44, lon: -124.6 }, { lat: 37, lon: -122.8 }, { lat: 32, lon: -117.8 }, { lat: 24, lon: -112 },
          { lat: 17, lon: -101 }, { lat: 11, lon: -87.5 }, { lat: 5, lon: -78.2 }, { lat: -3, lon: -81 }, { lat: -12, lon: -77.4 },
          { lat: -24, lon: -70.8 }, { lat: -33, lon: -71.9 }, { lat: -41.5, lon: -73.2 }] },
      { id: "inland-columbia", tone: "human", kind: "arkeologi", status: "antytt",
        start: 16700, end: 16000, fade: 11000,
        waypoints: [{ lat: 46.2, lon: -123.8 }, { lat: 45.7, lon: -120.5 }, { lat: 46.0, lon: -117.6 }, { lat: 45.9, lon: -116.4 }] },
      { id: "north-america-east", label_sv: "Inåt landet", label_en: "Inland", tone: "human", kind: "arkeologi", status: "antytt",
        start: 16000, end: 14500, fade: 11000, labelAt: 0.5,
        waypoints: [{ lat: 36, lon: -119 }, { lat: 35, lon: -110 }, { lat: 32.5, lon: -101 }, { lat: 30.9, lon: -97.7 }, { lat: 31, lon: -90 }, { lat: 30.4, lon: -83.8 }] },
      { id: "corridor", label_sv: "Genom korridoren", label_en: "Through the corridor", tone: "human", kind: "arkeologi", status: "antytt",
        start: 13600, end: 12700, fade: 9000, labelAt: 0.45,
        waypoints: [{ lat: 66, lon: -136 }, { lat: 61.5, lon: -123 }, { lat: 57, lon: -118 }, { lat: 53, lon: -115 }, { lat: 49.5, lon: -112 }, { lat: 46, lon: -108 }] },
      { id: "south-america", label_sv: "Över Sydamerika", label_en: "Across South America", tone: "human", kind: "arkeologi", status: "antytt",
        start: 14700, end: 12900, fade: 9500, labelAt: 0.35,
        waypoints: [{ lat: 6, lon: -75 }, { lat: -1, lon: -66 }, { lat: -8, lon: -58 }, { lat: -19.5, lon: -44 }, { lat: -30, lon: -54 }, { lat: -38, lon: -62 },
          { lat: -46, lon: -68 }, { lat: -52, lon: -69.8 }] },
      { id: "south-9ka", label_sv: "Nytt flöde söderut", label_en: "New flow south", tone: "genetic", kind: "genetik", status: "antytt",
        start: 9800, end: 8600, fade: 6500, labelAt: 0.5,
        waypoints: [{ lat: 14, lon: -89 }, { lat: 6, lon: -77 }, { lat: -6, lon: -78.5 }, { lat: -16, lon: -71 }, { lat: -28, lon: -69 }] },
      { id: "third-wave", label_sv: "Tredje vågen", label_en: "Third wave", tone: "genetic", kind: "genetik", status: "antytt",
        start: 1400, end: 1250, fade: 700, labelAt: 0.5,
        waypoints: [{ lat: 16, lon: -91 }, { lat: 9, lon: -80 }, { lat: 4.5, lon: -74.5 }] },
      // Sena vandringar och kontakter. Waypoints med bp styr tempot längs rutten.
      { id: "paleo-inuit", label_sv: "Paleo-inuiter", label_en: "Paleo-Inuit", tone: "arctic", kind: "kontakt", status: "belagt",
        start: 5600, end: 4500, fade: 2500, labelAt: 0.45,
        waypoints: [{ lat: 66.5, lon: 172, bp: 5600 }, { lat: 66, lon: -169 }, { lat: 66.5, lon: -162, bp: 5000 }, { lat: 69, lon: -118 },
          { lat: 70, lon: -95 }, { lat: 72, lon: -80 }, { lat: 68.8, lon: -51, bp: 4500 }] },
      { id: "thule", label_sv: "Thule (inuiternas förfäder)", label_en: "Thule (Inuit ancestors)", tone: "arctic", kind: "kontakt", status: "belagt",
        start: 850, end: 650, fade: 450, labelAt: 0.4,
        waypoints: [{ lat: 66, lon: -166, bp: 850 }, { lat: 71.3, lon: -156.7 }, { lat: 70, lon: -125, bp: 750 }, { lat: 69, lon: -100 },
          { lat: 73, lon: -85 }, { lat: 77.5, lon: -69, bp: 650 }] },
      { id: "norse", label_sv: "Nordbor", label_en: "Norse", tone: "norse", kind: "kontakt", status: "belagt",
        start: 1100, end: 929, fade: 470, labelAt: 0.3,
        waypoints: [{ lat: 61, lon: 5, bp: 1100 }, { lat: 62, lon: -7 }, { lat: 64.1, lon: -21.9, bp: 1073 },
          { lat: 61.15, lon: -45.5, bp: 965 }, { lat: 51.6, lon: -55.5, bp: 929 }] },
      { id: "lapita", label_sv: "Lapita", label_en: "Lapita", tone: "pacific", kind: "kontakt", status: "belagt",
        start: 2860, end: 2750, fade: 1000, labelAt: 0.5,
        waypoints: [{ lat: -21.1, lon: -175.1 }, { lat: -13.8, lon: -172 }] },
      { id: "poly-society", label_sv: "Mot östra Polynesien", label_en: "Toward East Polynesia", tone: "pacific", kind: "kontakt", status: "belagt",
        start: 1000, end: 925, fade: 450, labelAt: 0.5,
        waypoints: [{ lat: -13.8, lon: -172 }, { lat: -21.2, lon: -159.8 }, { lat: -17.5, lon: -149.8 }] },
      { id: "poly-hawaii", tone: "pacific", kind: "kontakt", status: "belagt",
        start: 900, end: 760, fade: 450,
        waypoints: [{ lat: -17.5, lon: -149.8 }, { lat: -9.5, lon: -140 }, { lat: 20, lon: -156 }] },
      { id: "poly-rapanui", tone: "pacific", kind: "kontakt", status: "belagt",
        start: 880, end: 750, fade: 450,
        waypoints: [{ lat: -17.5, lon: -149.8 }, { lat: -17, lon: -142 }, { lat: -23.1, lon: -134.9 }, { lat: -27.1, lon: -109.4 }] },
      { id: "poly-nz", tone: "pacific", kind: "kontakt", status: "belagt",
        start: 780, end: 700, fade: 450,
        waypoints: [{ lat: -21.2, lon: -159.8 }, { lat: -30, lon: -172 }, { lat: -41, lon: 174 }] },
      { id: "contact", label_sv: "Möte ca år 1200 (riktning okänd)", label_en: "Contact c. 1200 (direction unknown)", tone: "pacific", kind: "kontakt", status: "antytt",
        start: 800, end: 750, fade: 450, labelAt: 0.5,
        waypoints: [{ lat: 2.5, lon: -78.5 }, { lat: -4, lon: -105 }, { lat: -10.5, lon: -138.7 }] }
    ]
  };

  /* Genetiskt släktträd. Datum och status från research/genetics_env.json. Rader uppifrån och ned. */
  FA.TREE = {
    lineages: [
      { id: "ane", row: 0, label: "Forntida nordeurasier (Yana, Mal'ta)", label_en: "Ancient North Eurasians (Yana, Mal'ta)", note_en: "Paleolithic northern population that contributed part of Native American ancestry.", from: 40000, to: 16000, color: "#d9b77e", status: "belagt",
        note: "Paleolitisk nordlig befolkning som bidrog med en del av ursprungsamerikanernas anor." },
      { id: "paleosib", row: 1, label: "Forntida paleosibirier", label_en: "Ancient Paleo-Siberians", note_en: "Siberian sister lineage, the closest relatives of Native Americans outside the Americas (Kolyma, 9,800 years).", parent: "ana", from: 24000, to: 9800, color: "#a996d8", status: "antytt",
        note: "Sibirisk syskonlinje, närmast släkt med ursprungsamerikaner utanför Amerika (Kolyma, 9 800 år)." },
      { id: "beringians", row: 2, label: "Forntida beringier", label_en: "Ancient Beringians", note_en: "Stayed in Alaska; the USR1 infant 11,500 years ago.", endLabel_en: "no known living descendants", parent: "ana", from: 20900, to: 11500, endLabel: "inga kända nu levande ättlingar",
        color: "#b9a2f0", status: "antytt", note: "Stannade i Alaska; USR1-barnet för 11 500 år sedan." },
      { id: "nadene", row: 3, label: "Na-dene", label_en: "Na-Dene", note_en: "Northern peoples who also carry ancestry related to the Paleo-Inuit.", parent: "nna", from: 5000, to: 450, color: "#9fdcff", status: "belagt",
        note: "Nordliga folk som också bär paleo-inuitiskt besläktade anor." },
      { id: "nna", row: 4, label: "Nordlig gren (NNA)", label_en: "Northern branch (NNA)", note_en: "Ancestors of, among others, Algonquian- and Na-Dene-speaking peoples.", parent: "ana", from: 15700, to: 450, color: "#c4a3ff", status: "antytt",
        note: "Förfäder till bland annat algonkin- och na-dene-talande folk." },
      { id: "ana", row: 5, label: "Förfäder till urfolken i Amerika", label_en: "Ancestors of the Indigenous peoples of the Americas", note_en: "Diverged from East Asians around 36,000 years ago, with gene flow until about 25,000 years ago.", parent: "eastasia", from: 36000, to: 15700, color: "#e3d4ff", status: "antytt",
        note: "Skiljs från östasiater kring 36 000 år sedan, genflöde till ca 25 000 år sedan." },
      { id: "sna", row: 6, label: "Sydlig gren (SNA)", label_en: "Southern branch (SNA)", note_en: "Ancestors of most peoples of Central and South America; Anzick-1 belongs here.", parent: "ana", from: 15700, to: 450, color: "#ffb44d", status: "antytt",
        note: "Förfäder till de flesta folk i Mellan- och Sydamerika; Anzick-1 hör hit." },
      { id: "salin", row: 7, label: "Sydamerikanska grenar", label_en: "South American lineages", note_en: "One study dates the split to 13,900-10,000 years ago, another to 5,000-3,000 years ago.", parent: "sna", from: 13900, to: 450, color: "#ffcf8a", status: "omstritt",
        note: "En studie daterar uppdelningen till 13 900-10 000 år sedan, en annan till 5 000-3 000 år sedan." },
      { id: "popy", row: 8, label: "Population Y (okänd källa)", label_en: "Population Y (unknown source)", note_en: "Hypothetical unsampled population with Australasian affinity; about 1-3% in some peoples.", from: 16000, to: 10400, color: "#ff8fb8", status: "omstritt",
        note: "Hypotetisk osamplad befolkning med australasisk släktskap; ca 1-3 % hos vissa folk." },
      { id: "eastasia", row: 9, label: "Östasiater", label_en: "East Asians", note_en: "The East Asian-related population from which most of the ancestry derives.", from: 40000, to: 450, color: "#9aa7bf", status: "belagt",
        note: "Den östasiatiskt besläktade befolkning som största delen av anorna kommer från." },
      { id: "sibarc", row: 10, label: "Sibirisk arktisk källa", label_en: "Siberian Arctic source", note_en: "Gave rise to both the Paleo-Inuit and the later Inuit, in separate waves (simplified).", parent: "eastasia", from: 6000, to: 450, color: "#86c9e8", status: "antytt",
        note: "Gav upphov till både paleo-inuiter och senare inuiter, i separata vågor (förenklat)." },
      { id: "paleoinuit", row: 11, label: "Paleo-inuiter (Saqqaq, Dorset)", label_en: "Paleo-Inuit (Saqqaq, Dorset)", note_en: "Came from Siberia 5,500-5,000 years ago; disappeared as a population about 700 years ago.", endLabel_en: "replaced", parent: "sibarc", from: 5500, to: 700, endLabel: "ersätts",
        color: "#9fdcff", status: "belagt", note: "Kom från Sibirien för 5 500-5 000 år sedan, försvann som befolkning för ca 700 år sedan." },
      { id: "inuit", row: 12, label: "Inuiter (Thule)", label_en: "Inuit (Thule)", note_en: "A new wave from Alaska that replaced the Paleo-Inuit 1,000-700 years ago.", parent: "sibarc", from: 1000, to: 450, color: "#cfeeff", status: "belagt",
        note: "Ny våg från Alaska som ersatte paleo-inuiterna för 1 000-700 år sedan." },
      { id: "poly", row: 13, label: "Polynesier", label_en: "Polynesians", note_en: "Descendants of the Lapita culture; East Polynesians received Native American gene flow before the Europeans.", from: 2838, to: 450, color: "#52e3c6", status: "belagt",
        note: "Lapita-kulturens ättlingar; östpolynesier fick ursprungsamerikanskt genflöde före européerna." }
    ],
    admixtures: [
      { from: "ane", to: "ana", bp: 24000, status: "antytt", label: "nordeurasiskt inflöde", label_en: "North Eurasian influx" },
      { from: "popy", to: "salin", bp: 10400, status: "omstritt", label: "ca 1-3 %", label_en: "c. 1-3%" },
      { from: "paleoinuit", to: "nadene", bp: 5000, status: "belagt", label: "till na-dene", label_en: "into Na-Dene" },
      { from: "nna", to: "sibarc", bp: 3000, status: "antytt", label: "tillbaka mot Asien", label_en: "back toward Asia" },
      { from: "sna", to: "poly", bp: 750, status: "belagt", label: "ca år 1200", label_en: "c. 1200 CE" }
    ]
  };
})(window.FA = window.FA || {});
