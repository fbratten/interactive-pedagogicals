/* Gränssnitt: tidslinje, händelsekort, flikar, om-sidan, HUD. Språk via FA.t / FA.tx (js/i18n.js). */
(function (FA) {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  FA.esc = esc;
  function kindLabel(k) { return FA.t("kind_" + k); }
  function statusLabel(s) { return FA.t("st_" + s); }
  function srcKind(k) { return FA.t("src_" + k); }

  function UI(app) {
    this.app = app;
    this.tree = null;
    this.build();
  }

  UI.prototype.build = function () {
    this.cards = {};
    this.latestId = null;
    this.userOpened = {};
    this.chapterIdx = -1;
    $("chapterBand").innerHTML = ""; $("ticks").innerHTML = ""; $("markers").innerHTML = ""; $("cards").innerHTML = "";
    this.buildTimeline();
    this.buildCards();
    this.buildAbout();
    this.buildLegend();
    if (!this._tabsBound) { this.bindTabs(); this._tabsBound = true; }
    this.tree = new FA.Tree($("tree"));
    this.buildTreeNotes();
    $("introArt").innerHTML = FA.art("mammut");
  };
  UI.prototype.rebuild = UI.prototype.build;

  /* ---------- Tidslinje ---------- */
  UI.prototype.buildTimeline = function () {
    var band = $("chapterBand"), app = this.app;
    FA.STORY.chapters.forEach(function (c, i) {
      var d = document.createElement("div");
      var u0 = FA.uAt(c.from), u1 = FA.uAt(Math.max(c.to, FA.END_BP));
      d.style.width = ((u1 - u0) * 100) + "%";
      d.textContent = (i + 1) + ". " + FA.tx(c, "title");
      d.title = FA.tx(c, "title");
      d.addEventListener("click", function () { app.seek(u0 + 0.0005); });
      band.appendChild(d);
    });
    var ticks = $("ticks"), en = FA.lang === "en";
    [[40000, 1, 0], [26000, 0, 1], [20000, 0, 2], [16000, 0, 1], [14000, 0, 0], [12500, 0, 1],
     [10000, 0, 2], [5000, 0, 1], [2000, "0", 0], [1100, "850", 1], [450, "1500", 0]].forEach(function (t) {
      var s = document.createElement("span");
      s.style.left = (FA.uAt(t[0]) * 100) + "%";
      if (typeof t[1] === "string") s.textContent = en ? (t[1] === "0" ? "year 0" : t[1] + " CE") : "år " + t[1];
      else s.textContent = FA.num(t[0]);
      if (t[2]) s.className = t[2] === 1 ? "minor" : "nomob";
      if (t[0] === 40000) s.style.transform = "none";
      if (t[0] === 450) s.style.transform = "translateX(-100%)";
      ticks.appendChild(s);
    });
    var mk = $("markers"), self = this;
    this.markerEls = {};
    FA_EVENTS.forEach(function (ev) {
      var b = document.createElement("button");
      var u = FA.uAt(Math.min(ev.age_bp.show, FA.START_BP));
      b.style.left = (u * 100) + "%";
      b.style.background = FA.KIND_COLOR[ev.kind];
      if (ev.status === "omstritt") b.style.boxShadow = "inset 0 0 0 1.5px rgba(10,14,26,0.85)";
      b.title = FA.tx(ev, "title") + " - " + FA.formatRange(ev);
      b.setAttribute("aria-label", FA.tx(ev, "title") + ", " + FA.formatRange(ev));
      b.addEventListener("click", function () { app.gotoEvent(ev.id, true); });
      mk.appendChild(b);
      self.markerEls[ev.id] = b;
    });
  };

  /* ---------- Kort ---------- */
  UI.prototype.buildCards = function () {
    var list = $("cards"), self = this, app = this.app;
    var ordered = FA_EVENTS.slice().sort(function (a, b) { return a.age_bp.show - b.age_bp.show; });
    ordered.forEach(function (ev) {
      var li = document.createElement("li");
      li.className = "card";
      li.dataset.id = ev.id;
      li.hidden = true;
      li.innerHTML =
        '<button class="card-head" aria-expanded="false">' +
        '<span class="thumb">' + FA.art(ev.illustration, ev.kind) + "</span>" +
        "<span><span class=\"card-title\">" + esc(FA.tx(ev, "title")) + "</span>" +
        '<span class="card-meta"><span class="badge b-' + ev.kind + '">' + kindLabel(ev.kind) + "</span>" +
        '<span class="badge b-' + ev.status + '">' + statusLabel(ev.status) + "</span><span>" + esc(FA.formatRange(ev)) + "</span></span></span>" +
        "</button>" +
        '<div class="card-body"></div>';
      li.querySelector(".card-head").addEventListener("click", function () {
        var open = !li.classList.contains("open");
        self.userOpened[ev.id] = open;
        self.setOpen(ev.id, open);
        if (open) app.select(ev.id, false);
      });
      list.appendChild(li);
      self.cards[ev.id] = li;
    });
    var hint = document.createElement("li");
    hint.className = "future-hint";
    hint.id = "futureHint";
    list.appendChild(hint);
  };

  UI.prototype.fillBody = function (ev, li) {
    var body = li.querySelector(".card-body");
    if (body.dataset.filled) return;
    var srcs = (ev.sources || []).map(function (s) {
      return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + "</a> <span>(" + srcKind(s.kind) + ")</span></li>";
    }).join("");
    var place = FA.tx(ev, "place"), debate = FA.tx(ev, "debate"), why = FA.tx(ev, "why");
    body.innerHTML =
      '<div class="art-wrap">' + FA.art(ev.illustration, ev.kind) + "</div>" +
      '<div class="place">' + esc(place) + (place ? " · " : "") + esc(FA.formatRange(ev)) + "</div>" +
      "<p>" + esc(FA.tx(ev, "summary")) + "</p>" +
      (debate ? '<div class="debate"><b>' + (ev.status === "omstritt" ? FA.t("disputed_why") : FA.t("uncertainty")) + "</b>" + esc(debate) + "</div>" : "") +
      (why ? '<div class="why"><b>' + FA.t("why") + "</b>" + esc(why) + "</div>" : "") +
      '<ol class="sources">' + srcs + "</ol>" +
      '<div class="card-actions">' +
      (ev.lat != null ? '<button data-act="map">' + FA.t("show_map") + "</button>" : "") +
      '<button data-act="time">' + FA.t("goto_time") + "</button></div>";
    var app = this.app;
    body.querySelectorAll("button[data-act]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.dataset.act === "map") app.select(ev.id, true);
        else app.gotoEvent(ev.id, false);
      });
    });
    body.dataset.filled = "1";
  };

  UI.prototype.setOpen = function (id, open) {
    var li = this.cards[id];
    if (!li) return;
    if (open) this.fillBody(FA.byId[id], li);
    li.classList.toggle("open", open);
    li.querySelector(".card-head").setAttribute("aria-expanded", open ? "true" : "false");
  };

  // Uppdaterar vilka kort som syns. Returnerar id för senaste händelsen.
  UI.prototype.updateCards = function (bp, entered) {
    var latest = null, latestShow = Infinity, nextEv = null, nextShow = -Infinity;
    for (var i = 0; i < FA_EVENTS.length; i++) {
      var ev = FA_EVENTS[i], li = this.cards[ev.id], vis = ev.age_bp.show >= bp;
      if (li.hidden === vis) li.hidden = !vis;
      this.markerEls[ev.id].classList.toggle("past", vis);
      if (vis) { if (ev.age_bp.show < latestShow) { latestShow = ev.age_bp.show; latest = ev.id; } }
      else if (ev.age_bp.show > nextShow) { nextShow = ev.age_bp.show; nextEv = ev; }
    }
    if (latest !== this.latestId) {
      if (this.latestId && this.cards[this.latestId]) {
        this.cards[this.latestId].classList.remove("latest");
        if (!this.userOpened[this.latestId]) this.setOpen(this.latestId, false);
      }
      this.latestId = latest;
      if (latest) {
        var li2 = this.cards[latest];
        li2.classList.add("latest");
        this.setOpen(latest, true);
        if (entered) { li2.classList.remove("enter"); void li2.offsetWidth; li2.classList.add("enter"); }
      }
      if (entered || this.app.playing) $("pane-events").scrollTop = 0;
    }
    $("futureHint").textContent = nextEv ? FA.t("next", { t: FA.tx(nextEv, "title"), d: FA.formatRange(nextEv) }) : FA.t("the_end");
    return latest;
  };

  UI.prototype.reveal = function (id) {
    this.showTab("events");
    this.setOpen(id, true);
    this.userOpened[id] = true;
    var li = this.cards[id];
    Object.keys(this.cards).forEach(function (k) { this.cards[k].classList.toggle("sel", k === id); }, this);
    if (li && !li.hidden) li.scrollIntoView({ block: "nearest", behavior: "smooth" });
    var p = $("panel");
    if (p.classList.contains("collapsed")) { p.classList.remove("collapsed"); this.app.layoutChanged(); }
  };

  /* ---------- Flikar ---------- */
  UI.prototype.bindTabs = function () {
    var self = this;
    ["events", "tree", "about"].forEach(function (t) {
      $("tab-" + t).addEventListener("click", function () { self.showTab(t); });
    });
  };
  UI.prototype.showTab = function (t) {
    ["events", "tree", "about"].forEach(function (k) {
      $("tab-" + k).setAttribute("aria-selected", k === t ? "true" : "false");
      $("pane-" + k).hidden = k !== t;
    });
  };

  /* ---------- Legend och trädanteckningar ---------- */
  UI.prototype.buildLegend = function () {
    $("legendMini").innerHTML =
      '<span><i class="k k-ark"></i>' + kindLabel("arkeologi") + '</span><span><i class="k k-gen"></i>' + kindLabel("genetik") + "</span>" +
      '<span><i class="k k-kon"></i>' + kindLabel("kontakt") + '</span><span><i class="k k-mil"></i>' + FA.t("lg_klimat") + "</span>" +
      '<span><i class="st st-belagt"></i>' + FA.t("lg_belagt") + '</span><span><i class="st st-antytt"></i>' + FA.t("lg_antytt") +
      '</span><span><i class="st st-omstritt"></i>' + FA.t("lg_omstritt") + "</span>";
  };

  var TREE_NOTES = {
    sv: "<p><b>Två klockor.</b> Genetiken räknar bakåt från dagens och forntida arvsmassa och ser bara grupper som lämnat ättlingar. Arkeologin daterar spår i marken. Därför kan de ge olika svar, som när fotspåren i White Sands är äldre än genetikens tidigaste fönster.</p>" +
      "<p><b>Osäkra splittringar.</b> När de sydamerikanska grenarna skildes åt är omstritt: en studie från 2025 säger 13 900-10 000 år sedan, en från 2026 säger främst 5 000-3 000 år sedan.</p>" +
      "<p><b>Population Y.</b> En liten australasiskt besläktad signal hos vissa folk i Sydamerika har okänt ursprung. Den är inte belägg för en resa över Stilla havet.</p>",
    en: "<p><b>Two clocks.</b> Genetics counts backward from present-day and ancient genomes and only sees groups that left descendants. Archaeology dates traces in the ground. So they can give different answers, as when the White Sands footprints are older than the earliest genetic window.</p>" +
      "<p><b>Uncertain splits.</b> When the South American lineages separated is disputed: a 2025 study says 13,900-10,000 years ago, a 2026 study says mostly 5,000-3,000 years ago.</p>" +
      "<p><b>Population Y.</b> A small Australasian-related signal in some peoples of South America has an unknown origin. It is not evidence of a voyage across the Pacific.</p>"
  };
  UI.prototype.buildTreeNotes = function () { $("treeNotes").innerHTML = TREE_NOTES[FA.lang] || TREE_NOTES.sv; };

  /* ---------- Om källorna ---------- */
  UI.prototype.buildAbout = function () {
    var all = {}, list = [];
    FA_EVENTS.forEach(function (ev) {
      (ev.sources || []).forEach(function (s) {
        if (!all[s.url]) { all[s.url] = { s: s, ev: [] }; list.push(all[s.url]); }
        all[s.url].ev.push(FA.tx(ev, "title"));
      });
    });
    list.sort(function (a, b) { return a.s.label.localeCompare(b.s.label, FA.lang); });
    var src = list.map(function (x) {
      return '<li><a href="' + esc(x.s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(x.s.label) + "</a> <span>(" + srcKind(x.s.kind) + "; " + esc(x.ev.join(", ")) + ")</span></li>";
    }).join("");
    var envSrc = (window.FA_ENV && FA_ENV.sea_level_source) || {};
    var seaLink = '<a href="' + esc(envSrc.url || "") + '" target="_blank" rel="noopener noreferrer">';
    var html = FA.lang === "en" ?
      "<h3>What the page shows</h3><p>The page follows how people reached the Americas, from the oldest traces the finds <i>suggest</i> to the year 1500. Two kinds of evidence are combined: archaeology (finds in the ground) and genetics (ancient and present-day genomes). Genetic readings have their own layers, routes and a family tree.</p>" +
      "<h3>How to read the markings</h3><ul>" +
      "<li><b>Established</b> (solid line and ring): broad support in research.</li>" +
      "<li><b>Suggested</b> (dashed): a reasonable reading, often from genetics or single finds.</li>" +
      "<li><b>Disputed</b> (dotted, with a question mark): researchers disagree on the dating or the reading. Every such card explains why.</li>" +
      "<li>Arrows and routes are teaching aids. They show a reading of direction and approximate time, not exact paths.</li></ul>" +
      "<h3>Where genetics and archaeology meet and rub</h3><p>A 2026 review places the ancestors of today's Indigenous peoples south of the ice no earlier than about 21,000 years ago, while the White Sands footprints are dated to about 23,000-21,000 years ago. Both can be right if the earliest groups left no descendants. Monte Verde, long a cornerstone for an early arrival, was challenged in 2026 and is now disputed.</p>" +
      "<h3>Dates</h3><p>Older times are given as calibrated years before 1950 (the standard for radiocarbon dating), rounded to \"years ago\". From year 0, years are given as CE. Ranges show uncertainty or how long something lasted.</p>" +
      "<h3>The map</h3><ul>" +
      "<li>Coastlines, lakes and the 200 m depth contour: Natural Earth (public domain).</li>" +
      "<li>Sea level: global mean curve 30,000-6,000 years ago after " + seaLink + "Spratt and Lisiecki 2016</a>. Before 30,000 years ago the value is held constant. Exposed sea floor is drawn within the 200 m depth and is approximate.</li>" +
      "<li>The Bering land bridge forms about 35,700 years ago and breaks about 11,000 years ago, per the sources in the cards.</li>" +
      "<li>Ice sheets: a simplified model of our own that follows the main features of Dalton et al. 2020 (coastal route ice-free about 17,000-16,000 years ago, the corridor about 14,000-13,500, Hudson Bay opens about 8,200, the ice gone about 6,500 years ago). Margins may be off by 100-300 km.</li>" +
      "<li>Sound is made in the browser with Web Audio. No audio files or external libraries are used.</li></ul>" +
      "<h3>Indigenous perspectives</h3><p>Many Indigenous peoples have their own histories of their origins, tied to their lands. The page shows what archaeology and genetics suggest, which is one perspective among several. Kennewick Man is called the Ancient One by the tribes concerned. The year 1492 is only an end point here, not a discovery.</p>" +
      "<h3>How the page was made</h3><p>The information was gathered and checked against sources in November 2026 (last check 2026-11-21), and 16 of the most sensitive events were then spot-checked independently against their sources. Every card links to its sources. The raw data is in the project's research/ folder. Event texts were written in Swedish and translated into English.</p>" +
      "<h3>All sources (" + list.length + ")</h3><ol class=\"srcs\">" + src + "</ol>"
      :
      "<h3>Vad sidan visar</h3><p>Sidan följer hur människor kom till Amerika, från de äldsta spår som fynden <i>antyder</i> till år 1500. Två slags belägg vägs samman: arkeologi (fynd i marken) och genetik (forntida och nutida arvsmassa). Genetiska tolkningar har egna lager, rutter och ett eget släktträd.</p>" +
      "<h3>Så läser du markeringarna</h3><ul>" +
      "<li><b>Belagt</b> (heldragen linje och ring): brett stöd i forskningen.</li>" +
      "<li><b>Antytt</b> (streckad): rimlig tolkning, ofta från genetik eller enstaka fynd.</li>" +
      "<li><b>Omstritt</b> (prickad, med frågetecken): forskare är oense om datering eller tolkning. Varje sådant kort förklarar varför.</li>" +
      "<li>Pilar och rutter är pedagogiska. De visar en tolkning av riktning och ungefärlig tid, inte exakta vägar.</li></ul>" +
      "<h3>Där genetik och arkeologi möts och skaver</h3><p>En översikt från 2026 placerar förfäderna till dagens ursprungsfolk söder om isarna tidigast för cirka 21 000 år sedan, medan fotspåren i White Sands dateras till omkring 23 000-21 000 år sedan. Båda kan stämma om de tidigaste grupperna inte lämnade några ättlingar. Monte Verde, länge en hörnsten för tidig ankomst, ifrågasattes 2026 och är nu omstritt.</p>" +
      "<h3>Datum</h3><p>Äldre tider anges som kalibrerade år före 1950 (standard för kol-14-datering), avrundat till \"år sedan\". Från år 0 anges årtal e.Kr. Spann visar osäkerhet eller hur länge något pågick.</p>" +
      "<h3>Kartan</h3><ul>" +
      "<li>Kustlinjer, sjöar och 200-metersdjupkurvan: Natural Earth (public domain).</li>" +
      "<li>Havsnivå: global medelkurva 30 000-6 000 år sedan efter " + seaLink + "Spratt och Lisiecki 2016</a>. Före 30 000 år sedan hålls värdet konstant. Torrlagd havsbotten ritas inom 200-metersdjupet och är ungefärlig.</li>" +
      "<li>Beringias landbrygga: bildas ca 35 700 år sedan och bryts ca 11 000 år sedan, enligt källorna i korten.</li>" +
      "<li>Istäcken: en förenklad, egen modell som följer huvuddragen i Dalton m.fl. 2020 (kustvägen isfri ca 17 000-16 000 år sedan, korridoren ca 14 000-13 500, Hudson Bay öppnas ca 8 200, isen borta ca 6 500 år sedan). Gränserna kan avvika 100-300 km.</li>" +
      "<li>Ljudet skapas i webbläsaren med Web Audio. Inga ljudfiler eller externa bibliotek används.</li></ul>" +
      "<h3>Ursprungsfolkens perspektiv</h3><p>Många ursprungsfolk har egna historier om sitt ursprung, knutna till sina länder. Sidan visar vad arkeologi och genetik antyder, vilket är ett perspektiv bland flera. Kennewickmannen kallas av de berörda stammarna för Den forntida. År 1492 är här bara en slutpunkt, ingen upptäckt.</p>" +
      "<h3>Hur sidan togs fram</h3><p>Uppgifterna samlades in och kontrollerades mot källor i november 2026 (senaste kontroll 2026-11-21), och 16 av de känsligaste händelserna stickprovsgranskades därefter oberoende mot sina källor. Varje kort länkar till sina källor. Rådata finns i mappen research/ i projektet.</p>" +
      "<h3>Alla källor (" + list.length + ")</h3><ol class=\"srcs\">" + src + "</ol>";
    $("about").innerHTML = html;
  };

  /* ---------- HUD ---------- */
  UI.prototype.updateHud = function (bp) {
    var f = FA.formatNow(bp);
    $("nowBig").textContent = f.big;
    $("nowSmall").textContent = f.small;
    var ph = FA.climatePhase(bp);
    var chip = $("climateChip");
    chip.textContent = ph.name;
    chip.className = "chip " + (ph.tone === "warm" ? "warm" : ph.tone === "cool" ? "cool" : "");
    var sl = Math.round(FA.seaLevel(bp));
    $("seaChip").textContent = Math.abs(sl) < 2 ? FA.t("sea_now") : FA.t("sea", { v: (sl < 0 ? "-" + Math.abs(sl) : "+" + sl) });
    var idx = 0, C = FA.STORY.chapters;
    for (var i = 0; i < C.length; i++) if (bp <= C[i].from) idx = i;
    if (idx !== this.chapterIdx) {
      var changed = this.chapterIdx !== -1;
      this.chapterIdx = idx;
      $("chapterNo").textContent = FA.t("chapter_of", { n: idx + 1, m: C.length });
      $("chapterTitle").textContent = FA.tx(C[idx], "title");
      $("chapterLead").textContent = FA.tx(C[idx], "lead");
      var box = $("chapterBox");
      box.classList.remove("flash"); void box.offsetWidth; box.classList.add("flash");
      var band = $("chapterBand").children;
      for (var j = 0; j < band.length; j++) band[j].classList.toggle("on", j === idx);
      return changed;
    }
    return false;
  };

  UI.prototype.toast = function (k, t) {
    var el = $("toast");
    el.innerHTML = '<div class="t-k">' + esc(k) + '</div><div class="t-t">' + esc(t) + "</div>";
    el.classList.add("show");
    clearTimeout(this._toastT);
    this._toastT = setTimeout(function () { el.classList.remove("show"); }, 2300);
  };

  FA.UI = UI;
})(window.FA = window.FA || {});
