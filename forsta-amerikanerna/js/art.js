/* Egna, enkla SVG-illustrationer (inga externa bilder). Varje funktion returnerar en SVG-sträng. */
(function (FA) {
  "use strict";

  var uid = 0;
  function wrap(inner, sky) {
    sky = sky || ["#1b2a44", "#0d1626"];
    var id = "fa_sky" + (++uid);
    return '<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" class="art">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/>' +
      '<stop offset="1" stop-color="' + sky[1] + '"/></linearGradient></defs>' +
      '<rect width="320" height="140" fill="url(#' + id + ')"/>' + inner + "</svg>";
  }
  function stars(n, seed) {
    var s = "", x = seed || 7;
    for (var i = 0; i < n; i++) {
      x = (x * 9301 + 49297) % 233280;
      var px = (x / 233280) * 320;
      x = (x * 9301 + 49297) % 233280;
      var py = (x / 233280) * 60;
      s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="' + (i % 3 === 0 ? 1.1 : 0.6) + '" fill="#e8f0ff" opacity="' + (0.4 + (i % 4) * 0.15) + '"/>';
    }
    return s;
  }
  var INK = 'stroke="#f1e6cf" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';

  var A = {};
  A.fotspar = function () {
    var feet = "";
    for (var i = 0; i < 6; i++) {
      var x = 40 + i * 44, y = 104 - i * 9 + (i % 2 ? 10 : 0), rot = -18;
      feet += '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')">' +
        '<ellipse cx="0" cy="0" rx="7" ry="12" fill="#2a1d14" opacity="0.75"/>' +
        '<circle cx="-5" cy="-15" r="2.2" fill="#2a1d14" opacity="0.75"/><circle cx="0" cy="-17" r="2.4" fill="#2a1d14" opacity="0.75"/>' +
        '<circle cx="5" cy="-15" r="2" fill="#2a1d14" opacity="0.75"/></g>';
    }
    var big = '<circle cx="250" cy="122" r="11" fill="#2a1d14" opacity="0.5"/><circle cx="290" cy="110" r="11" fill="#2a1d14" opacity="0.5"/>';
    return wrap('<rect y="72" width="320" height="68" fill="#b49a73"/><path d="M0 72 Q80 64 160 72 T320 70 V78 H0Z" fill="#c9b18a"/>' +
      '<path d="M0 90 Q120 84 320 96" stroke="#9c835e" stroke-width="1.5" fill="none" opacity="0.6"/>' + feet + big +
      '<circle cx="268" cy="30" r="13" fill="#ffe6ad" opacity="0.9"/>', ["#7fa6c9", "#e9d8b4"]);
  };
  A.mammut = function () {
    return wrap(stars(18, 3) + '<path d="M0 112 Q90 100 170 108 T320 104 V140 H0Z" fill="#3c4a33"/>' +
      '<path d="M120 108 C118 84 124 66 146 60 C160 52 186 52 200 62 C212 70 214 86 210 108 L202 108 L200 92 L192 108 L184 108 L182 90 L160 92 L158 108 L150 108 L148 92 L140 108 L132 108 Z" fill="#20180f"/>' +
      '<path d="M146 62 C134 64 126 74 128 88 C129 96 124 104 116 106" ' + INK + ' stroke="#20180f" stroke-width="6"/>' +
      '<path d="M132 84 C120 92 110 92 104 84" stroke="#f1e6cf" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M10 110 l4 -10 M30 112 l3 -12 M260 106 l4 -11 M290 108 l3 -9 M300 107 l-2 -8" stroke="#6f7f52" stroke-width="2"/>' +
      '<circle cx="60" cy="34" r="12" fill="#f4f1e6" opacity="0.85"/>', ["#24334d", "#5d6b7a"]);
  };
  A.spets = function () {
    return wrap('<g transform="translate(160 72) rotate(-28)">' +
      '<path d="M0 -58 C16 -34 20 10 12 46 L-12 46 C-20 10 -16 -34 0 -58Z" fill="#c9c2b2" stroke="#f1e6cf" stroke-width="1.5"/>' +
      '<path d="M0 46 L0 -6" stroke="#8d8576" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M-10 -20 L4 -12 M-13 0 L6 8 M-12 20 L5 26 M10 -26 L-2 -18 M13 -6 L-2 2 M12 14 L-1 20" stroke="#8d8576" stroke-width="1.2"/></g>' +
      '<path d="M20 120 H300" stroke="#f1e6cf" stroke-opacity="0.25"/>' +
      '<text x="20" y="132" font-size="10" fill="#f1e6cf" opacity="0.6" font-family="system-ui">5 cm</text><path d="M20 124 H70" stroke="#f1e6cf" stroke-width="2" opacity="0.6"/>',
      ["#2c2a33", "#141319"]);
  };
  A.kanot = function () {
    return wrap(stars(30, 11) + '<path d="M0 102 Q40 96 80 102 T160 102 T240 102 T320 102 V140 H0Z" fill="#0b3a4f"/>' +
      '<path d="M70 96 Q160 112 250 96 L244 104 Q160 118 76 104Z" fill="#2b1c12"/>' +
      '<path d="M82 88 Q160 100 238 88 L234 94 Q160 106 86 94Z" fill="#3a2718"/>' +
      '<path d="M96 92 L224 92" stroke="#c7a46b" stroke-width="3"/>' +
      '<path d="M150 92 L150 26 M150 26 C186 34 196 64 172 90 C168 70 160 50 150 26Z" fill="#e6d3a8" stroke="#f1e6cf" stroke-width="1.5"/>' +
      '<path d="M150 26 C122 36 112 64 132 88" stroke="#f1e6cf" stroke-width="1.5" fill="none"/>' +
      '<path d="M0 112 Q40 108 80 112 T160 112 T240 112 T320 112" stroke="#52e3c6" stroke-opacity="0.35" fill="none"/>' +
      '<circle cx="270" cy="30" r="10" fill="#f4f1e6" opacity="0.9"/>', ["#0e1a33", "#1f3a5a"]);
  };
  A.knarr = function () {
    return wrap('<path d="M0 104 Q40 98 80 104 T160 104 T240 104 T320 104 V140 H0Z" fill="#2c4256"/>' +
      '<path d="M80 98 Q160 120 250 98 Q258 84 266 74 L256 76 Q248 92 236 96 Q160 108 92 96 Q82 90 76 78 L68 80 Q74 90 80 98Z" fill="#3b2a1d"/>' +
      '<path d="M162 96 V24" stroke="#3b2a1d" stroke-width="4"/>' +
      '<path d="M116 30 H210 V82 H116Z" fill="#d9cdb3"/><path d="M116 44 H210 M116 58 H210 M116 72 H210" stroke="#b5483a" stroke-width="7" opacity="0.8"/>' +
      '<path d="M162 24 L116 30 M162 24 L210 30" stroke="#f1e6cf" stroke-width="1"/>' +
      '<path d="M20 70 l18 -10 l14 6 l20 -12" stroke="#f1e6cf" stroke-opacity="0.3" fill="none"/>', ["#7d93a8", "#c9d4dc"]);
  };
  A.umiak = function () {
    return wrap('<path d="M0 100 H320 V140 H0Z" fill="#1d3550"/>' +
      '<path d="M20 98 l30 -8 l26 8Z M230 100 l40 -12 l40 12Z M150 120 l20 -5 l22 5Z" fill="#e9f3fa"/>' +
      '<path d="M70 98 Q150 112 236 98 L230 106 Q150 118 76 106Z" fill="#8a6a46"/>' +
      '<path d="M100 98 l-3 -16 M128 100 l-2 -18 M156 101 l-1 -18 M184 100 l0 -18 M210 99 l1 -16" stroke="#2b1f15" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="97" cy="79" r="5" fill="#2b1f15"/><circle cx="126" cy="79" r="5" fill="#2b1f15"/><circle cx="155" cy="80" r="5" fill="#2b1f15"/><circle cx="184" cy="79" r="5" fill="#2b1f15"/><circle cx="211" cy="80" r="5" fill="#2b1f15"/>' +
      '<path d="M120 92 l30 22 M180 92 l-28 22" stroke="#c9a77a" stroke-width="2"/>' +
      '<path d="M0 60 Q80 40 160 52 T320 44" stroke="#9fdcff" stroke-opacity="0.35" stroke-width="10" fill="none"/>', ["#2a3a5c", "#a9c6dc"]);
  };
  A.kelp = function () {
    var fronds = "";
    for (var i = 0; i < 7; i++) {
      var x = 20 + i * 46;
      fronds += '<path d="M' + x + ' 140 C' + (x - 14) + ' 120 ' + (x + 16) + ' 106 ' + (x - 4) + ' 86 S' + (x + 10) + ' 64 ' + (x + 2) + ' 56" stroke="#5f8a3a" stroke-width="4" fill="none"/>' +
        '<ellipse cx="' + (x + 6) + '" cy="96" rx="6" ry="3" fill="#7aa64a"/><ellipse cx="' + (x - 6) + '" cy="118" rx="6" ry="3" fill="#7aa64a"/>';
    }
    return wrap('<rect y="50" width="320" height="90" fill="#0f3f4e"/>' + fronds +
      '<path d="M0 50 Q40 46 80 50 T160 50 T240 50 T320 50" stroke="#9fe6ff" stroke-width="2" fill="none" opacity="0.6"/>' +
      '<path d="M200 48 Q232 56 266 48 L262 42 Q232 48 204 42Z" fill="#3a2718"/><path d="M226 44 l-6 -14 M240 45 l2 -14" stroke="#2b1f15" stroke-width="3"/>' +
      '<circle cx="60" cy="22" r="10" fill="#fff2c4" opacity="0.85"/>', ["#5e88a8", "#a6c6d4"]);
  };
  A.grotta = function () {
    return wrap('<path d="M0 140 V40 Q60 10 160 14 Q260 10 320 40 V140Z" fill="#4a3b2e"/>' +
      '<path d="M90 140 Q92 62 160 52 Q228 62 230 140Z" fill="#120d09"/>' +
      '<path d="M100 120 H220 M96 104 H224 M100 88 H220" stroke="#6d5843" stroke-width="2" stroke-dasharray="6 5"/>' +
      '<circle cx="160" cy="118" r="5" fill="#ff9d42"/><path d="M156 118 q4 -12 8 0" fill="#ffd27a"/>' +
      '<path d="M30 60 l10 6 M270 56 l-12 8 M40 90 l14 -4" stroke="#6d5843" stroke-width="2"/>', ["#3b3430", "#1a1613"]);
  };
  A.batata = function () {
    return wrap('<path d="M0 106 Q80 98 160 106 T320 104 V140 H0Z" fill="#4a3424"/>' +
      '<path d="M120 112 C120 92 160 86 196 96 C226 104 228 124 200 128 C170 134 122 132 120 112Z" fill="#b5563f"/>' +
      '<path d="M140 104 l4 2 M176 100 l3 3 M200 112 l4 1" stroke="#7a3328" stroke-width="2"/>' +
      '<path d="M160 92 C150 70 132 60 110 58 M160 92 C168 66 190 52 214 50 M160 92 C160 70 160 54 166 40" stroke="#5f8a3a" stroke-width="3" fill="none"/>' +
      '<path d="M110 58 c-14 -2 -22 8 -12 16 c10 6 18 -4 12 -16Z M214 50 c14 -4 24 6 14 14 c-10 8 -20 -2 -14 -14Z M166 40 c-6 -12 6 -22 14 -12 c6 8 -4 16 -14 12Z" fill="#7aa64a"/>',
      ["#6f8fa6", "#d9cdb3"]);
  };
  A.ben = function () {
    return wrap('<g transform="translate(160 76) rotate(-12)">' +
      '<path d="M-110 -10 C-130 -30 -100 -42 -92 -22 C-80 -10 -70 -12 -50 -12 H50 C70 -12 80 -10 92 -22 C100 -42 130 -30 110 -10 C130 8 100 22 92 4 C80 -4 70 -6 50 -6 H-50 C-70 -6 -80 -4 -92 4 C-100 22 -130 8 -110 -10Z" fill="#e7dcc2" stroke="#f1e6cf"/>' +
      '<path d="M-30 -12 l6 6 M-20 -12 l6 6 M-10 -12 l6 6 M14 -12 l5 6" stroke="#7a3328" stroke-width="1.6"/></g>' +
      '<text x="196" y="124" font-size="10" fill="#f1e6cf" opacity="0.65" font-family="system-ui">snittmärken?</text>',
      ["#2f2b2a", "#171515"]);
  };
  A.lager = function () {
    var layers = ["#6d5843", "#7d6750", "#5a4837", "#8a7458", "#4b3c2e"], s = "";
    for (var i = 0; i < layers.length; i++) s += '<rect y="' + (40 + i * 20) + '" width="320" height="20" fill="' + layers[i] + '"/>';
    return wrap(s + '<path d="M60 58 v-24 M80 58 v-22 M100 58 v-24" stroke="#2b1f15" stroke-width="4"/>' +
      '<path d="M54 36 Q80 12 106 36" stroke="#2b1f15" stroke-width="3" fill="none"/>' +
      '<circle cx="200" cy="90" r="6" fill="#ffb44d"/><path d="M206 90 H270" stroke="#ffb44d" stroke-dasharray="3 3"/>' +
      '<circle cx="230" cy="130" r="6" fill="#ff8fb8"/><path d="M236 130 H290" stroke="#ff8fb8" stroke-dasharray="3 3"/>' +
      '<text x="274" y="93" font-size="9" fill="#ffe1a8" font-family="system-ui">datering?</text>', ["#8aa0b4", "#cdd8e2"]);
  };
  A.dna = function () {
    var s = "";
    for (var i = 0; i <= 24; i++) {
      var x = 30 + i * 11, y1 = 70 + Math.sin(i * 0.55) * 34, y2 = 70 - Math.sin(i * 0.55) * 34;
      s += '<path d="M' + x + ' ' + y1.toFixed(1) + ' L' + x + ' ' + y2.toFixed(1) + '" stroke="' + (i % 2 ? "#c4a3ff" : "#52e3c6") + '" stroke-width="2" opacity="0.7"/>';
    }
    var p1 = "", p2 = "";
    for (var k = 0; k <= 240; k += 4) {
      p1 += (k ? " L" : "M") + (30 + k * 1.1).toFixed(1) + " " + (70 + Math.sin(k / 20 * 0.55 * 1) * 34).toFixed(1);
      p2 += (k ? " L" : "M") + (30 + k * 1.1).toFixed(1) + " " + (70 - Math.sin(k / 20 * 0.55 * 1) * 34).toFixed(1);
    }
    return wrap(stars(24, 5) + s + '<path d="' + p1 + '" stroke="#e8dcff" stroke-width="3" fill="none"/><path d="' + p2 + '" stroke="#bff5ea" stroke-width="3" fill="none"/>',
      ["#1a1633", "#0e0c1f"]);
  };
  A.is = function () {
    return wrap('<path d="M0 60 Q60 20 140 26 Q220 30 300 70 L320 80 V100 H0Z" fill="#e9f3fa"/>' +
      '<path d="M0 100 H320 V140 H0Z" fill="#163a55"/>' +
      '<path d="M0 84 H320" stroke="#52e3c6" stroke-dasharray="6 5"/><text x="8" y="80" font-size="9" fill="#bff5ea" font-family="system-ui">havsnivå då</text>' +
      '<path d="M0 100 H320" stroke="#9fdcff"/><text x="8" y="112" font-size="9" fill="#cfe9ff" font-family="system-ui">havsnivå i dag</text>' +
      '<path d="M40 60 l20 -10 M100 40 l16 -6 M200 38 l20 4" stroke="#a9c6dc" stroke-width="2"/>', ["#5f7a96", "#a9bfd2"]);
  };
  A.none = function () {
    return wrap(stars(30, 19) + '<circle cx="160" cy="70" r="38" stroke="#f1e6cf" stroke-opacity="0.5" fill="none"/>' +
      '<path d="M160 26 L168 70 L160 114 L152 70Z" fill="#ffb44d" opacity="0.85"/><path d="M116 70 L160 62 L204 70 L160 78Z" fill="#f1e6cf" opacity="0.5"/>',
      ["#18233a", "#0b1120"]);
  };

  FA.art = function (name, kind) {
    if (!name || name === "none") {
      if (kind === "genetik") name = "dna";
      else if (kind === "miljo") name = "is";
    }
    return (A[name] || A.none)();
  };
})(window.FA = window.FA || {});
