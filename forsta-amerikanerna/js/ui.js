/* Gränssnitt: tidslinje, händelsekort, flikar, om-sidan, HUD. */
(function (FA) {
  "use strict";

  var KIND_LABEL = { arkeologi: "Arkeologi", genetik: "Genetik", miljo: "Klimat och miljö", kontakt: "Kontakt" };
  var STATUS_LABEL = { belagt: "Belagt", antytt: "Antytt", omstritt: "Omstritt" };
  var SRC_KIND = { primar: "forskningsartikel", oversikt: "översikt", nyhet: "nyhet" };
  FA.KIND_LABEL = KIND_LABEL; FA.STATUS_LABEL = STATUS_LABEL;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  FA.esc = esc;

  function UI(app) {
    this.app = app;
    this.cards = {};
    this.latestId = null;
    this.userOpened = {};
    this.chapterIdx = -1;
    this.buildTimeline();
    this.buildCards();
    this.buildAbout();
    this.buildLegend();
    this.bindTabs();
    this.tree = new FA.Tree($("tree"));
    this.buildTreeNotes();
    $("introArt").innerHTML = FA.art("mammut");
  }

  /* ---------- Tidslinje ---------- */
  UI.prototype.buildTimeline = function () {
    var band = $("chapterBand"), app = this.app;
    FA.STORY.chapters.forEach(function (c, i) {
      var d = document.createElement("div");
      var u0 = FA.uAt(c.from), u1 = FA.uAt(Math.max(c.to, FA.END_BP));
      d.style.width = ((u1 - u0) * 100) + "%";
      d.textContent = (i + 1) + ". " + c.title;
      d.title = c.title;
      d.addEventListener("click", function () { app.seek(u0 + 0.0005); });
      band.appendChild(d);
    });
    var ticks = $("ticks");
    [[40000, "40 000"], [26000, "26 000", 1], [20000, "20 000", 2], [16000, "16 000", 1], [14000, "14 000"], [12500, "12 500", 1],
     [10000, "10 000", 2], [5000, "5 000", 1], [2000, "år 0"], [1100, "år 850", 1], [450, "år 1500"]].forEach(function (t) {
      var s = document.createElement("span");
      s.style.left = (FA.uAt(t[0]) * 100) + "%";
      s.textContent = t[1];
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
      b.title = ev.title_sv + " - " + FA.formatRange(ev);
      b.setAttribute("aria-label", ev.title_sv + ", " + FA.formatRange(ev));
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
      var date = FA.formatRange(ev);
      li.innerHTML =
        '<button class="card-head" aria-expanded="false">' +
        '<span class="thumb">' + FA.art(ev.illustration, ev.kind) + "</span>" +
        "<span><span class=\"card-title\">" + esc(ev.title_sv) + "</span>" +
        '<span class="card-meta"><span class="badge b-' + ev.kind + '">' + KIND_LABEL[ev.kind] + "</span>" +
        '<span class="badge b-' + ev.status + '">' + STATUS_LABEL[ev.status] + "</span><span>" + esc(date) + "</span></span></span>" +
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
      return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + "</a> <span>(" + (SRC_KIND[s.kind] || s.kind) + ")</span></li>";
    }).join("");
    body.innerHTML =
      '<div class="art-wrap">' + FA.art(ev.illustration, ev.kind) + "</div>" +
      '<div class="place">' + esc(ev.place_sv || "") + (ev.place_sv ? " · " : "") + esc(FA.formatRange(ev)) + "</div>" +
      "<p>" + esc(ev.summary_sv) + "</p>" +
      (ev.debate_sv ? '<div class="debate"><b>' + (ev.status === "omstritt" ? "Därför är det omstritt" : "Osäkerhet") + "</b>" + esc(ev.debate_sv) + "</div>" : "") +
      (ev.why_sv ? '<div class="why"><b>Varför det spelar roll</b>' + esc(ev.why_sv) + "</div>" : "") +
      '<ol class="sources">' + srcs + "</ol>" +
      '<div class="card-actions">' +
      (ev.lat != null ? '<button data-act="map">Visa på kartan</button>' : "") +
      '<button data-act="time">Gå till tidpunkten</button></div>';
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
    var latest = null, latestShow = Infinity, count = 0, nextEv = null, nextShow = -Infinity;
    for (var i = 0; i < FA_EVENTS.length; i++) {
      var ev = FA_EVENTS[i], li = this.cards[ev.id], vis = ev.age_bp.show >= bp;
      if (li.hidden === vis) li.hidden = !vis;
      this.markerEls[ev.id].classList.toggle("past", vis);
      if (vis) { count++; if (ev.age_bp.show < latestShow) { latestShow = ev.age_bp.show; latest = ev.id; } }
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
        // flytta senaste överst
        var list = $("cards");
        list.insertBefore(li2, list.firstChild);
        if (entered) { li2.classList.remove("enter"); void li2.offsetWidth; li2.classList.add("enter"); }
      }
      this.reorder();
      if (entered || this.app.playing) $("pane-events").scrollTop = 0;
    }
    var hint = $("futureHint");
    hint.textContent = nextEv ? "Nästa: " + nextEv.title_sv + " (" + FA.formatRange(nextEv) + ")" : "Slutet av tidslinjen.";
    return latest;
  };

  // Ordning: nyast överst
  UI.prototype.reorder = function () {
    var list = $("cards"), self = this;
    var ordered = FA_EVENTS.slice().sort(function (a, b) { return a.age_bp.show - b.age_bp.show; });
    ordered.forEach(function (ev) { list.appendChild(self.cards[ev.id]); });
    list.appendChild($("futureHint"));
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

  /* ---------- Legend ---------- */
  UI.prototype.buildLegend = function () {
    $("legendMini").innerHTML =
      '<span><i class="k k-ark"></i>Arkeologi</span><span><i class="k k-gen"></i>Genetik</span>' +
      '<span><i class="k k-kon"></i>Kontakt</span><span><i class="k k-mil"></i>Klimat</span>' +
      '<span><i class="st st-belagt"></i>belagt</span><span><i class="st st-antytt"></i>antytt</span><span><i class="st st-omstritt"></i>omstritt</span>';
  };

  UI.prototype.buildTreeNotes = function () {
    $("treeNotes").innerHTML =
      "<p><b>Två klockor.</b> Genetiken räknar bakåt från dagens och forntida arvsmassa och ser bara grupper som lämnat ättlingar. Arkeologin daterar spår i marken. Därför kan de ge olika svar, som när fotspåren i White Sands är äldre än genetikens tidigaste fönster.</p>" +
      "<p><b>Osäkra splittringar.</b> När de sydamerikanska grenarna skildes åt är omstritt: en studie från 2025 säger 13 900-10 000 år sedan, en från 2026 säger främst 5 000-3 000 år sedan.</p>" +
      "<p><b>Population Y.</b> En liten australasiskt besläktad signal hos vissa folk i Sydamerika har okänt ursprung. Den är inte belägg för en resa över Stilla havet.</p>";
  };

  /* ---------- Om källorna ---------- */
  UI.prototype.buildAbout = function () {
    var all = {}, list = [];
    FA_EVENTS.forEach(function (ev) {
      (ev.sources || []).forEach(function (s) {
        if (!all[s.url]) { all[s.url] = { s: s, ev: [] }; list.push(all[s.url]); }
        all[s.url].ev.push(ev.title_sv);
      });
    });
    list.sort(function (a, b) { return a.s.label.localeCompare(b.s.label, "sv"); });
    var src = list.map(function (x) {
      return '<li><a href="' + esc(x.s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(x.s.label) + "</a> <span>(" + (SRC_KIND[x.s.kind] || "") + "; " + esc(x.ev.join(", ")) + ")</span></li>";
    }).join("");
    var envSrc = (window.FA_ENV && FA_ENV.sea_level_source) || {};
    $("about").innerHTML =
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
      "<li>Havsnivå: global medelkurva 30 000-6 000 år sedan efter <a href=\"" + esc(envSrc.url || "") + "\" target=\"_blank\" rel=\"noopener noreferrer\">Spratt och Lisiecki 2016</a>. Före 30 000 år sedan hålls värdet konstant. Torrlagd havsbotten ritas inom 200-metersdjupet och är ungefärlig.</li>" +
      "<li>Beringias landbrygga: bildas ca 35 700 år sedan och bryts ca 11 000 år sedan, enligt källorna i korten.</li>" +
      "<li>Istäcken: en förenklad, egen modell som följer huvuddragen i Dalton m.fl. 2020 (kustvägen isfri ca 17 000-16 000 år sedan, korridoren ca 14 000-13 500, Hudson Bay öppnas ca 8 200, isen borta ca 6 500 år sedan). Gränserna kan avvika 100-300 km.</li>" +
      "<li>Ljudet skapas i webbläsaren med Web Audio. Inga ljudfiler eller externa bibliotek används.</li></ul>" +
      "<h3>Ursprungsfolkens perspektiv</h3><p>Många ursprungsfolk har egna historier om sitt ursprung, knutna till sina länder. Sidan visar vad arkeologi och genetik antyder, vilket är ett perspektiv bland flera. Kennewickmannen kallas av de berörda stammarna för Den forntida. År 1492 är här bara en slutpunkt, ingen upptäckt.</p>" +
      "<h3>Hur sidan togs fram</h3><p>Uppgifterna samlades in och kontrollerades mot källor i november 2026 (senaste kontroll 2026-11-21). Varje kort länkar till sina källor. Rådata finns i mappen research/ i projektet.</p>" +
      "<h3>Alla källor (" + list.length + ")</h3><ol class=\"srcs\">" + src + "</ol>";
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
    $("seaChip").textContent = Math.abs(sl) < 2 ? "Havsnivå nära dagens" : "Havsnivå " + (sl < 0 ? "-" + Math.abs(sl) : "+" + sl) + " m";
    var idx = 0, C = FA.STORY.chapters;
    for (var i = 0; i < C.length; i++) if (bp <= C[i].from) idx = i;
    if (idx !== this.chapterIdx) {
      var changed = this.chapterIdx !== -1;
      this.chapterIdx = idx;
      $("chapterNo").textContent = "Kapitel " + (idx + 1) + " av " + C.length;
      $("chapterTitle").textContent = C[idx].title;
      $("chapterLead").textContent = C[idx].lead;
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
