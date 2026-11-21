"""Slår ihop de källsatta forskningsfilerna till data/events.js.

Indata:  research/archaeology_contacts.json, research/genetics_env.json (forskningsagenternas resultat)
Utdata:  data/events.js (window.FA_EVENTS, window.FA_ENV)

Kurering som görs här (allt annat kommer oförändrat från forskningsfilerna):
- dubbletter tas bort (samma studie i båda filerna),
- några kartpunkter flyttas en aning så att markörer inte täcker varandra,
- illustrationer väljs för händelser som saknar en,
- en rad läggs till om Monte Verde-debatten i oktober 2026 (nyhetsnivå, Science).
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
PATCH = {
    "kennewick": {"title_sv": "Den forntida (Kennewickmannen)"},
    "rapa-nui-genomes-2024": {"title_sv": "Rapa Nui: kontakt, ingen kollaps"},
}
EXTRA_DEBATE = {
    "monte-verde": (
        " Enligt en nyhetsartikel i Science (20 oktober 2026) från en konferens i Santa Fe beskrev försvararna"
        " också en ny utgrävning, avslutad veckorna innan, som de menar bekräftar de äldre dateringarna.",
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
