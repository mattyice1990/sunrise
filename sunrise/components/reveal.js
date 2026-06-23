/* reveal.js — premium scroll choreography
   ------------------------------------------------------------------
   Plain vanilla JS (loaded as a normal <script>, NOT through Babel) so
   it runs independently of the React render. It:
     1. Marks content blocks with `.reveal` so they start hidden.
     2. Fades + rises them into view via IntersectionObserver.
     3. Cascades grid children with a small stagger.
     4. Counts stat numbers up from zero the first time they appear.
   Respects prefers-reduced-motion (CSS neutralizes .reveal there; we
   also skip the count-up).
   ------------------------------------------------------------------ */
(function () {
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Single blocks — each matched element fades up on its own.
  var SINGLES = [
    ".section-head",
    ".svc-head",
    ".grev-head",
    ".about__media",
    ".about__copy",
    ".owner__media",
    ".owner__copy",
    ".prop",
    ".ba-info",
    ".ba-wrap",
    ".contact",
    ".process-cta",
  ];

  // Stagger groups — when the PARENT enters, its children cascade in.
  // [parentSelector, childSelector, stepMs]
  var GROUPS = [
    [".svc-grid", ".svc-card", 90],
    [".why-grid", ".why-cell", 70],
    [".process", ".proc-step", 110],
    [".pf-grid", ".pf-card", 80],
    [".tst-grid", ".tst-card", 90],
    [".stats", ".stat-card", 90],
    [".faq-wrap", ".faq-item", 60],
  ];

  function makeObserver(onIn) {
    return new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { onIn(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  }

  function initReveal() {
    // Singles
    var singleObs = makeObserver(function (el) { el.classList.add("is-in"); });
    SINGLES.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.dataset.rev) return;
        el.dataset.rev = "1";
        el.classList.add("reveal");
        singleObs.observe(el);
      });
    });

    // Stagger groups — observe the parent, cascade the children.
    var groupObs = makeObserver(function (parent) {
      var kids = parent.__revKids || [];
      kids.forEach(function (kid, i) {
        var delay = Math.min(i, 8) * (parent.__revStep || 80);
        kid.style.transitionDelay = delay + "ms";
        kid.classList.add("is-in");
      });
    });
    GROUPS.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (parent) {
        if (parent.dataset.rev) return;
        var kids = Array.prototype.slice.call(parent.querySelectorAll(g[1]));
        if (!kids.length) return;
        parent.dataset.rev = "1";
        kids.forEach(function (k) { k.classList.add("reveal"); });
        parent.__revKids = kids;
        parent.__revStep = g[2];
        groupObs.observe(parent);
      });
    });

    initCountUp();
  }

  /* ---- Stat count-up ------------------------------------------------ */
  function parseStat(raw) {
    var m = raw.match(/-?[\d.,]+/);
    if (!m) return null;
    var numStr = m[0];
    var hasComma = numStr.indexOf(",") !== -1;
    var decimals = (numStr.split(".")[1] || "").length;
    var value = parseFloat(numStr.replace(/,/g, ""));
    if (isNaN(value)) return null;
    return {
      value: value,
      prefix: raw.slice(0, m.index),
      suffix: raw.slice(m.index + numStr.length),
      decimals: decimals,
      comma: hasComma,
    };
  }

  function fmt(n, info) {
    var s = info.decimals ? n.toFixed(info.decimals) : String(Math.round(n));
    if (info.comma) {
      var parts = s.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      s = parts.join(".");
    }
    return info.prefix + s + info.suffix;
  }

  function animateCount(el, info) {
    var dur = 1200, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = fmt(info.value * eased, info);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(info.value, info);
    }
    requestAnimationFrame(step);
  }

  function initCountUp() {
    if (REDUCE) return;
    var nodes = document.querySelectorAll(".stat-card .n, .trust-item__big");
    var obs = makeObserver(function (el) {
      var info = el.__stat;
      if (info) animateCount(el, info);
    });
    nodes.forEach(function (el) {
      if (el.dataset.cu) return;
      var info = parseStat(el.textContent.trim());
      if (!info) return;
      el.dataset.cu = "1";
      el.__stat = info;
      el.textContent = fmt(0, info);
      obs.observe(el);
    });
  }

  /* ---- Wait for React to render, then init -------------------------- */
  function ready() {
    var root = document.getElementById("root");
    return root && root.children.length > 0 && document.querySelector(".section-head");
  }
  var tries = 0;
  (function waitForRender() {
    if (ready()) { initReveal(); return; }
    if (tries++ > 60) { initReveal(); return; } // give up gracefully
    setTimeout(waitForRender, 100);
  })();
})();
