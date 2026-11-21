"""Slår ihop de källsatta forskningsfilerna till data/events.js.

Indata:  research/archaeology_contacts.json, research/genetics_env.json (forskningsagenternas resultat)
Utdata:  data/events.js (window.FA_EVENTS, window.FA_ENV)

Kurering som görs här (allt annat kommer oförändrat från forskningsfilerna):
- dubbletter tas bort (samma studie i båda filerna),
- några kartpunkter flyttas en aning så att markörer inte täcker varandra,
- illustrationer väljs för händelser som saknar en,
- en rad läggs till om Monte Verde-debatten i oktober 2026 (nyhetsnivå, Science),
- rättelser efter en oberoende stickprovsgranskning 2026-11-21 (åldrar, status, formuleringar, källor).
Kör:  python3 -I tools/build_events.py  (från mappen forsta-amerikanerna)
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = json.load(open(os.path.join(ROOT, "research", "archaeology_contacts.json"), encoding="utf-8"))
G = json.load(open(os.path.join(ROOT, "research", "genetics_env.json"), encoding="utf-8"))

DROP = {
    "polynesien-amerika-dna": "samma studie som polynesia-native-american-contact (Ioannidis 2020)",
    "rapa-nui-genom": "samma studie som rapa-nui-genomes-2024 (Moreno-Mayar 2024)",
}
MOVE = {  # id: (lat, lon) bara för läsbarhet på kartan
    "usr1-upward-sun-river": (64.7, -147.6),
    "holzman-alaska": (64.0, -145.4),
    "corridor-biologically-viable": (53.8, -115.6),
    "bering-strait-floods": (66.4, -167.2),
    "saqqaq-genome": (68.2, -52.4),
    "ana-formation-beringia-25ka": (65.6, -174.5),
}
ART = {
    "bering-land-bridge-emerges": "mammut", "last-glacial-maximum": "is", "pacific-coast-deglaciation": "kelp",
    "bering-strait-floods": "is", "anzick-1-genome": "spets", "ice-free-corridor-opens": "is",
    "corridor-biologically-viable": "mammut", "event-8-2-ka": "is", "laurentide-gone": "is",
    "meltwater-pulse-1a": "is", "younger-dryas": "is", "bolling-allerod": "is",
    "polynesia-native-american-contact": "kanot", "rapa-nui-genomes-2024": "kanot",
    "inuit-replace-paleo-inuit": "umiak", "kennewick": "grotta", "columbus-1492": "none",
}
PATCH = {  # språkliga rättelser och arbetsanteckningar som inte hör hemma i läsarens text
    "kennewick": {"title_sv": "Den forntida (Kennewickmannen)"},
    "rapa-nui-genomes-2024": {"title_sv": "Rapa Nui: kontakt, ingen kollaps"},
    "fells-cave": {"title_sv": "Fell-grottan och fiskstjärtsspetsar"},
    "colombia-altiplano-turnover": {"debate_sv": "Studien bygger på 21 genom från fem platser, och exakt när och hur utbytet skedde är oklart."},
    "beringian-standstill": {"debate_sv": "Hur länge pausen varade och om den skedde i Beringia eller i Sibirien är omdiskuterat. Tamm m.fl. angav inga datum; tidsspannet här bygger på senare genomdateringar och är osäkert."},
    "population-y-ypykuera": {"debate_sv": "Hur signalen uppstod är okänt, och den syns inte i alla dataset; en exomstudie 2020 fann den bara svagt och utan statistisk säkerhet och bedömde att den kan vara en artefakt. Den är inte belägg för en tidig sjöresa från Australasien."},
    # Rättelser efter oberoende stickprovsgranskning 2026-11-21 (16 händelser kontrollerade mot källorna)
    "holzman-alaska": {"debate_sv": "Att Clovis teknik skulle ha sina rötter här är en tolkning byggd på likheter i hantverket. Utomstående forskare har påpekat att fynden inte utesluter tidigare människor längre söderut, och att DNA och mer klimatdata behövs."},
    "glyptodont-reconquista": {"status": "antytt", "age_bp": {"from": 21090, "to": 20811, "show": 21000},
        "summary_sv": "Vid Reconquistafloden nära Buenos Aires har man hittat ben av en glyptodont, ett jättelikt pansardjur, med skärmärken på bäcken, svans och pansar. Märkenas placering tyder på styckning, och en datering av bäckenet ger en ålder på omkring 21 000 år (fynd publicerat 2024).",
        "debate_sv": "Beläggen är skärmärken på ben, som kan vara svåra att skilja från naturliga skador, och fyndet har ännu inte prövats lika hårt som äldre platser."},
    "genetic-entry-window-potter-2026": {
        "summary_sv": "En översikt från 2026 av det genetiska underlaget drar slutsatsen att förfäderna till dagens ursprungsfolk delade upp sig i olika linjer tidigast för 21 000 år sedan. Norra och södra grenen skildes strax före 15 500 år sedan, enligt tidigare studier troligen söder om isarna, så ankomsten bör ha skett däremellan.",
        "debate_sv": "Underlaget har stora luckor, och arkeologiska fynd som fotspåren i White Sands, daterade till omkring 23 000 år sedan, pekar på tidigare närvaro. Genetiken kan bara se befolkningar som lämnat ättlingar, så en tidig grupp utan ättlingar skulle vara osynlig i DNA."},
    "sa-lineages-split-gusareva-2025": {
        "summary_sv": "En stor studie av 1 537 nu levande personer från 139 folkgrupper i norra Eurasien och Amerika fann att människor nådde Sydamerika via Mellanamerika och Panamanäset för omkring 14 000 år sedan. Den sydamerikanska linjen delades sedan i fyra grenar, i Amazonas, Anderna, Chaco och Patagonien, för omkring 13 900 till 10 000 år sedan."},
    "population-y-ypykuera": {
        "summary_sv": "Vissa folk i Amazonas, och enligt senare studier även vid Stillahavskusten, delar något fler genvarianter med folk i Australien, Nya Guinea och på Andamanerna än andra ursprungsamerikaner. Signalen utgör omkring 1 till 3 procent av arvsmassan och finns redan hos en 10 400 år gammal individ från Lagoa Santa. Forskarna bakom Nature-studien 2026 tolkar den som spår av en osamplad forntida asiatisk befolkning, som de kallar Ypykuéra.",
        "debate_sv": "Hur signalen uppstod är okänt, och den syns inte i alla dataset; en exomstudie 2020 fann den bara svagt och utan statistisk säkerhet och bedömde att den kan vara en artefakt. Den är inte belägg för en tidig sjöresa från Australasien."},
    "bering-land-bridge-emerges": {"age_bp": {"from": 39000, "to": 33300, "show": 35700},
        "debate_sv": "Äldre rekonstruktioner antog att bryggan låg torr betydligt längre. Resultatet bygger på en ny metod och ett fåtal borrkärnor, och osäkerheten är flera tusen år (cirka 2 400 år åt ena hållet och 3 300 åt det andra)."},
    "inuit-replace-paleo-inuit": {"age_bp": {"from": 950, "to": 650, "show": 700}},
    "lanse-aux-meadows": {"why_sv": "Det äldsta säkert daterade beviset för européer i Nordamerika söder om Grönland, nästan 500 år före Columbus."},
    "back-gene-flow-koryak-inuit": {"debate_sv": "Siffrorna kommer från en enda studie och har här kontrollerats mot sammanfattningar av den, inte mot hela artikeln. Hur de förhåller sig till paleo-inuiternas och inuiternas historia är inte utrett här."},
}
EXTRA_SOURCES = {
    "holzman-alaska": [{"label": "ScienceAlert 2026 (utomstående kommentarer)", "url": "https://www.sciencealert.com/?p=190943", "kind": "nyhet"}],
    "colombia-altiplano-turnover": [{"label": "Krettek et al. 2025, Science Advances", "url": "https://doi.org/10.1126/sciadv.ads6284", "kind": "primar"}],
    "sa-lineages-split-gusareva-2025": [{"label": "EurekAlert 2025 (NTU Singapore)", "url": "https://www.eurekalert.org/news-releases/1083389", "kind": "nyhet"}],
}
EXTRA_DEBATE = {
    "monte-verde": (
        " Enligt en nyhetsartikel i Science (20 oktober 2026) beskrev försvararna också en ny utgrävning, avslutad"
        " veckorna innan, som de menar bekräftar de äldre dateringarna; den var då bara känd genom nyhetsrapportering.",
        {"label": "Science (nyhet) 2026-10-20: Archaeology fight reopens wounds over peopling of the Americas",
         "url": "https://www.science.org/content/article/archaeologists-spar-over-age-key-south-american-dig-site",
         "kind": "nyhet"},
    )
}

events = []
seen = set()
for src in (A, G):
    for e in src["events"]:
        if e["id"] in DROP or e["id"] in seen:
            continue
        seen.add(e["id"])
        e = dict(e)
        e["origin"] = src["agent"]
        if e["id"] in MOVE:
            e["lat"], e["lon"] = MOVE[e["id"]]
        if not e.get("illustration") or e["id"] in ART:
            e["illustration"] = ART.get(e["id"], e.get("illustration") or "none")
        e.update(PATCH.get(e["id"], {}))
        if e["id"] in EXTRA_SOURCES:
            e["sources"] = list(e["sources"]) + EXTRA_SOURCES[e["id"]]
        if e["id"] in EXTRA_DEBATE:
            txt, s = EXTRA_DEBATE[e["id"]]
            e["debate_sv"] = (e.get("debate_sv") or "") + txt
            e["sources"] = list(e["sources"]) + [s]
        events.append(e)

events.sort(key=lambda e: -e["age_bp"]["show"])

bad = [e["id"] for e in events for k, v in e.items() if isinstance(v, str) and (chr(0x2013) in v or chr(0x2014) in v)]
if bad:
    sys.exit("Streck (en/em) hittades i: %s" % bad)
for e in events:
    assert e["status"] in ("belagt", "antytt", "omstritt"), e["id"]
    assert e["kind"] in ("arkeologi", "genetik", "miljo", "kontakt"), e["id"]
    if e["status"] != "belagt":
        assert e.get("debate_sv"), "debatt saknas: " + e["id"]
    assert e["sources"], "källa saknas: " + e["id"]

env = {
    "sea_level": [[p["bp"], p["m"]] for p in G["sea_level"]["points"]] + [[0, 0]],
    "sea_level_source": G["sea_level"]["source"],
    "notes": G.get("notes", ""),
}
out = os.path.join(ROOT, "data", "events.js")
with open(out, "w", encoding="utf-8") as f:
    f.write("/* Genererad av tools/build_events.py ur research/*.json. Redigera forskningsfilerna eller skriptet, inte denna fil. */\n")
    f.write("window.FA_EVENTS = " + json.dumps(events, ensure_ascii=False, indent=1) + ";\n")
    f.write("window.FA_ENV = " + json.dumps(env, ensure_ascii=False) + ";\n")
print("events:", len(events), "dropped:", list(DROP), "->", out)
