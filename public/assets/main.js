/* =========================================================
   WISHBUSTERZ — behaviour
   1. digital rain (canvas, token-driven per variant)
   2. hero typewriter
   3. scramble-decode reveals
   4. scroll reveals
   5. wish filters
   6. preview-only variant switcher
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root.getAttribute("data-variant")) root.setAttribute("data-variant", "classic");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1 · Digital rain
     Reads its colours and density from the active variant's
     CSS custom properties, so switching variants restyles it.
     --------------------------------------------------------- */
  var GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲabcdefghijklmnopqrstuvwxyz0123456789<>[]{}/\\|=+*#".split("");

  var canvas = document.getElementById("rain");
  var ctx = canvas.getContext("2d", { alpha: false });
  var cols = [], colW = 16, fontPx = 15, dpr = 1, W = 0, H = 0, raf = null;
  var cfg = {};

  function readTokens() {
    var cs = getComputedStyle(root);
    cfg.rgb = (cs.getPropertyValue("--rain-rgb") || "0,255,65").trim();
    cfg.head = (cs.getPropertyValue("--rain-head") || "255,255,255").trim();
    cfg.gap = parseFloat(cs.getPropertyValue("--rain-density")) || 15;
    cfg.alpha = parseFloat(cs.getPropertyValue("--rain-alpha")) || .8;
    cfg.speed = parseFloat(cs.getPropertyValue("--rain-speed")) || 1;
    cfg.bg = (cs.getPropertyValue("--bg") || "#000").trim();
  }

  function build() {
    readTokens();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    colW = cfg.gap;
    fontPx = Math.round(colW * 1.05);
    var n = Math.ceil(W / colW);
    cols = [];
    for (var i = 0; i < n; i++) {
      cols.push({
        y: Math.random() * -H,
        v: (0.45 + Math.random() * 0.85) * cfg.speed,
        len: 6 + Math.floor(Math.random() * 20)
      });
    }
    ctx.fillStyle = cfg.bg;
    ctx.fillRect(0, 0, W, H);
  }

  function frame() {
    /* fade the previous frame instead of clearing — this is what
       leaves the trailing tail behind each falling glyph */
    ctx.fillStyle = cfg.bg;
    ctx.globalAlpha = 0.11;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;

    ctx.font = fontPx + "px " + "ui-monospace, Menlo, Consolas, monospace";
    ctx.textBaseline = "top";

    for (var i = 0; i < cols.length; i++) {
      var c = cols[i];
      var x = i * colW;
      var y = c.y;

      for (var k = 0; k < c.len; k++) {
        var gy = y - k * fontPx;
        if (gy < -fontPx || gy > H) continue;
        var ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        if (k === 0) {
          ctx.fillStyle = "rgba(" + cfg.head + ",1)";
        } else {
          var a = cfg.alpha * (1 - k / c.len);
          ctx.fillStyle = "rgba(" + cfg.rgb + "," + a.toFixed(3) + ")";
        }
        ctx.fillText(ch, x, gy);
      }

      c.y += c.v * fontPx * 0.42;
      if (y - c.len * fontPx > H) {
        c.y = Math.random() * -240;
        c.v = (0.45 + Math.random() * 0.85) * cfg.speed;
        c.len = 6 + Math.floor(Math.random() * 20);
      }
    }
    raf = requestAnimationFrame(frame);
  }

  function staticFrame() {
    /* reduced motion: one still frame, no loop */
    ctx.fillStyle = cfg.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.font = fontPx + "px ui-monospace, Menlo, Consolas, monospace";
    ctx.textBaseline = "top";
    for (var i = 0; i < cols.length; i++) {
      var x = i * colW;
      var top = Math.random() * H;
      for (var k = 0; k < 14; k++) {
        var a = cfg.alpha * (1 - k / 14) * 0.5;
        ctx.fillStyle = "rgba(" + cfg.rgb + "," + a.toFixed(3) + ")";
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, top + k * fontPx);
      }
    }
  }

  function start() {
    if (raf) cancelAnimationFrame(raf);
    build();
    if (reduced) staticFrame(); else raf = requestAnimationFrame(frame);
  }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(start, 180);
  });

  document.addEventListener("visibilitychange", function () {
    if (reduced) return;
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) raf = requestAnimationFrame(frame);
  });

  start();

  /* ---------------------------------------------------------
     2 · Hero typewriter
     --------------------------------------------------------- */
  var typeEl = document.querySelector("[data-type]");
  if (typeEl) {
    var full = typeEl.getAttribute("data-type");
    if (reduced) {
      typeEl.textContent = full;
    } else {
      var i = 0;
      typeEl.textContent = "";
      setTimeout(function tick() {
        typeEl.textContent = full.slice(0, ++i);
        if (i < full.length) setTimeout(tick, 42 + Math.random() * 55);
      }, 620);
    }
  }

  /* ---------------------------------------------------------
     3 · Scramble decode
     --------------------------------------------------------- */
  var SCRAM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/\\<>*";
  function scramble(el, done) {
    var text = el.dataset.text || el.textContent;
    el.dataset.text = text;
    var frames = 0, total = 13;
    var id = setInterval(function () {
      frames++;
      var cut = Math.floor((frames / total) * text.length);
      var out = "";
      for (var j = 0; j < text.length; j++) {
        if (j < cut || text[j] === " ") out += text[j];
        else out += SCRAM[(Math.random() * SCRAM.length) | 0];
      }
      el.textContent = out;
      if (frames >= total) { clearInterval(id); el.textContent = text; if (done) done(); }
    }, 34);
  }

  document.querySelectorAll(".nav-links a[data-scramble]").forEach(function (a) {
    if (reduced) return;
    var busy = false;
    a.addEventListener("mouseenter", function () {
      if (busy) return;
      busy = true;
      scramble(a, function () { busy = false; });
    });
  });

  /* ---------------------------------------------------------
     4 · Scroll reveals (section headings decode on entry)
     --------------------------------------------------------- */
  var revealables = document.querySelectorAll(".band .sec-h, .band .sec-sub, .steps li, .card, .wiki li, .about > *, .fbtn");
  revealables.forEach(function (el) { el.classList.add("reveal"); });

  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var delay = parseInt(el.dataset.delay || "0", 10);
        setTimeout(function () {
          el.classList.add("in");
          if (el.matches("[data-scramble]")) scramble(el);
        }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    /* stagger siblings so grids cascade rather than pop */
    document.querySelectorAll(".steps, .cards, .wiki, .follow").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, n) {
        child.dataset.delay = String(Math.min(n, 6) * 65);
      });
    });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     5 · Wish filters
     --------------------------------------------------------- */
  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll("#cards .card");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-on"); });
      chip.classList.add("is-on");
      var want = chip.dataset.filter;
      cards.forEach(function (card) {
        card.hidden = !(want === "all" || card.dataset.state === want);
      });
    });
  });

  /* ---------------------------------------------------------
     6 · Variant switcher — PREVIEW ONLY.
     Delete this block, the .switch markup and the .switch CSS
     once a direction is picked.
     --------------------------------------------------------- */
  var NAMES = {
    classic: "Classic Cascade",
    terminal: "Terminal Discipline",
    redpill: "Red Pill",
    rabbit: "White Rabbit",
    construct: "Deep Construct"
  };
  var toggle = document.getElementById("switchToggle");
  var panel = document.getElementById("switchPanel");
  var nameEl = document.getElementById("switchName");

  function setVariant(v) {
    if (!NAMES[v]) v = "classic";
    root.setAttribute("data-variant", v);
    nameEl.textContent = NAMES[v];
    try { localStorage.setItem("wb-variant", v); } catch (e) {}
    start();          /* rebuild the rain in the new palette */
  }

  if (toggle) {
    try {
      var saved = localStorage.getItem("wb-variant");
      if (saved) setVariant(saved);
    } catch (e) {}

    toggle.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
    panel.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        setVariant(b.dataset.v);
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); }
      if (e.key >= "1" && e.key <= "5" && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
        setVariant(Object.keys(NAMES)[parseInt(e.key, 10) - 1]);
      }
    });
  }
})();
