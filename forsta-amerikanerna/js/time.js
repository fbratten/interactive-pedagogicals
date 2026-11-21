/* Tidsskala, formattering och miljökurvor.
   All tid lagras som kalibrerade år före 1950 (BP). Reglaget arbetar i "berättelsetid" u (0..1),
   som är styckvis linjär mot BP så att täta perioder får mer skärmtid. */
(function (FA) {
  "use strict";

  // [u, BP] - stigande u, fallande BP
  var ANCHORS = [
    [0.00, 40000],
    [0.07, 26000],
    [0.18, 20000],
    [0.31, 16000],
    [0.44, 14000],
    [0.53, 12500],
    [0.61, 10000],
    [0.70, 5000],
    [0.76, 2000],
    [0.82, 1100],
    [1.00, 450]
  ];
  FA.START_BP = 40000;
  FA.END_BP = 450;

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  FA.clamp = clamp;
  FA.lerp = function (a, b, t) { return a + (b - a) * t; };
  FA.smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

  FA.ageAt = function (u) {
    u = clamp(u, 0, 1);
    for (var i = 1; i < ANCHORS.length; i++) {
      var a = ANCHORS[i - 1], b = ANCHORS[i];
      if (u <= b[0]) {
        var t = (u - a[0]) / (b[0] - a[0]);
        return a[1] + (b[1] - a[1]) * t;
      }
    }
    return FA.END_BP;
  };

  FA.uAt = function (bp) {
    bp = clamp(bp, FA.END_BP, FA.START_BP);
    for (var i = 1; i < ANCHORS.length; i++) {
      var a = ANCHORS[i - 1], b = ANCHORS[i];
      if (bp >= b[1]) {
        var t = (bp - a[1]) / (b[1] - a[1]);
        return a[0] + (b[0] - a[0]) * t;
      }
    }
    return 1;
  };

  // Svenska tal med hårt mellanslag som tusentalsavgränsare
  FA.num = function (n) {
    var s = String(Math.round(n));
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  FA.ceOf = function (bp) { return 1950 - bp; };

  function roundAge(bp) {
    if (bp >= 20000) return Math.round(bp / 500) * 500;
    if (bp >= 5000) return Math.round(bp / 100) * 100;
    if (bp >= 2500) return Math.round(bp / 50) * 50;
    return Math.round(bp / 10) * 10;
  }

  // Huvudetikett för aktuell tid
  FA.formatNow = function (bp) {
    var ce = FA.ceOf(bp);
    if (ce >= 1) {
      return { big: "år " + Math.round(ce) + " e.Kr.", small: "ca " + FA.num(roundAge(bp + 75)) + " år sedan" };
    }
    if (bp < 2500) {
      return { big: "ca " + FA.num(roundAge(bp + 75)) + " år sedan", small: "ca " + FA.num(Math.round(-ce / 10) * 10) + " f.Kr." };
    }
    return { big: FA.num(roundAge(bp)) + " år sedan", small: "kalibrerade år före 1950" };
  };

  // Intervall för en händelse
  FA.formatRange = function (ev) {
    if (ev.ce && ev.ce.from != null) {
      if (ev.ce.to != null && ev.ce.to !== ev.ce.from) return ev.ce.from + "-" + ev.ce.to + " e.Kr.";
      return "år " + ev.ce.from + " e.Kr.";
    }
    var a = ev.age_bp || {};
    var f = a.from, t = a.to;
    if (f != null && t != null && Math.abs(f - t) >= 50) return FA.num(roundAge(f)) + "-" + FA.num(roundAge(t)) + " år sedan";
    if (a.show != null) return "ca " + FA.num(roundAge(a.show)) + " år sedan";
    if (f != null) return "ca " + FA.num(roundAge(f)) + " år sedan";
    return "";
  };

  /* ---- Miljökurvor (ersätts av källsatta värden från FA.ENV om de finns) ---- */
  var SEA = [
    [40000, -75], [35000, -80], [30000, -90], [26000, -120], [21000, -130], [19000, -125],
    [16500, -115], [14700, -105], [14300, -85], [13000, -75], [12000, -62], [11500, -58],
    [10000, -45], [9000, -32], [8000, -18], [7000, -8], [6000, -3], [5000, -1], [0, 0]
  ];

  function curve(points, bp) {
    if (bp >= points[0][0]) return points[0][1];
    for (var i = 1; i < points.length; i++) {
      if (bp >= points[i][0]) {
        var a = points[i - 1], b = points[i];
        var t = (a[0] - bp) / (a[0] - b[0]);
        return a[1] + (b[1] - a[1]) * t;
      }
    }
    return points[points.length - 1][1];
  }
  FA.curve = curve;

  FA.seaLevel = function (bp) {
    var env = window.FA_ENV;
    var pts = (env && env.sea_level && env.sea_level.length > 3) ? env.sea_level : SEA;
    return curve(pts, bp);
  };

  // Andel av kontinentalsockeln (0-200 m) som ritas som torrlagd
  FA.shelfExposure = function (bp) {
    var m = -FA.seaLevel(bp);
    return clamp((m - 18) / 112, 0, 1);
  };

  // Beringia: hur långt (i breddgrader från sundet vid 65,8 N) landbryggan når
  // Landbryggan bildas ca 35 700 år sedan (Farmer, Pico m.fl. 2022) och bryts ca 11 000 år sedan (Jakobsson m.fl. 2017).
  var BRIDGE = [[40000, -0.8], [36500, -0.3], [35700, 0.6], [34000, 4], [31000, 7], [27000, 9], [23000, 10], [19000, 9.6],
    [16000, 8], [14500, 5.5], [13000, 3.2], [12000, 1.6], [11300, 0.5], [11000, -0.4], [0, -1]];
  FA.bridgeReach = function (bp) { return curve(BRIDGE, bp); };

  // 0 = dagens klimat, 1 = istidsmaximum (för landfärger och ljud)
  var GLACIAL = [[40000, 0.7], [30000, 0.8], [26000, 0.95], [21000, 1], [18000, 0.95], [16000, 0.85],
    [14700, 0.55], [13000, 0.6], [12800, 0.75], [11700, 0.7], [11000, 0.45], [9000, 0.2], [7000, 0.05], [0, 0]];
  FA.glacial = function (bp) { return curve(GLACIAL, bp); };

  // Klimatfas för etikett
  FA.climatePhase = function (bp) {
    if (bp > 26500) return { name: "Sen istid (MIS 3)", tone: "cold" };
    if (bp > 19000) return { name: "Istidsmaximum (LGM)", tone: "cold" };
    if (bp > 14700) return { name: "Avsmältningen börjar", tone: "cool" };
    if (bp > 12900) return { name: "Bølling-Allerød, varmt", tone: "warm" };
    if (bp > 11700) return { name: "Yngre dryas, bakslag", tone: "cold" };
    if (bp > 8200) return { name: "Tidig holocen", tone: "warm" };
    return { name: "Holocen", tone: "warm" };
  };
})(window.FA = window.FA || {});
