(function(){
/* hero.jsx — Hero (video playlist bg) + TrustBar */

/* Hero background plays through this list, 3–6s each, HARD-CUTTING to the
   next (no fade/flash) via a preloaded dual-video buffer, then loops the
   whole sequence forever. Add/remove clips here. */
const HERO_CLIPS = ["uploads/AdobeStock_1831107909_compressed.mp4", "uploads/AdobeStock_1879827039_compressed.mp4", "uploads/AdobeStock_786610596_compressed.mp4", "uploads/AdobeStock_353379036_compressed.mp4"];
const CLIP_MIN = 4; // seconds — minimum time on a clip (+1s after dropping the fire clip)
const CLIP_MAX = 7; // seconds — maximum time on a clip (+1s after dropping the fire clip)

function Hero() {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const heroRef = useRef(null);
  const brandRef = useRef(null);
  const textRef = useRef(null);

  /* ---- Scroll-reveal choreography ----------------------------------
     The hero is a tall scroll track with a pinned stage. As you scroll,
     the big centered brand logo fades + scales away while the headline,
     copy and CTAs rise into view. Reduced-motion shows the text state. */
  useEffect(() => {
    const hero = heroRef.current,
      brand = brandRef.current,
      text = textRef.current;
    if (!hero || !brand || !text) return;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      hero.classList.add("hero--static");
      brand.style.opacity = "0";
      brand.style.visibility = "hidden";
      text.style.opacity = "1";
      text.style.transform = "none";
      return;
    }
    let raf = 0;
    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      const total = Math.max(hero.offsetHeight - vh, 1);
      const p = clamp(-hero.getBoundingClientRect().top / total, 0, 1);
      const bp = clamp(p / 0.42, 0, 1); // brand exits over first 42%
      brand.style.opacity = String(1 - bp);
      brand.style.transform = "translateY(" + -46 * bp + "px) scale(" + (1 + 0.13 * bp) + ")";
      brand.style.pointerEvents = bp > 0.6 ? "none" : "";
      const tp = clamp((p - 0.32) / 0.4, 0, 1); // text enters 32%—72%
      text.style.opacity = String(tp);
      text.style.transform = "translateY(" + 46 * (1 - tp) + "px)";
      text.style.pointerEvents = tp > 0.4 ? "" : "none";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  useEffect(() => {
    const vids = [aRef.current, bRef.current];
    if (!vids[0] || !vids[1]) return;
    // Play the (now ~5MB total, 720p) hero video on mobile too. Still respect
    // an explicit reduced-motion preference and data-saver — those users get
    // the poster image instead.
    const skipVideo = window.matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.connection && navigator.connection.saveData;
    if (skipVideo) return;
    vids.forEach(v => {
      v.muted = true;
      v.playsInline = true;
    });
    let timer;

    // single-clip: just loop it, no buffering needed
    if (HERO_CLIPS.length === 1) {
      const v = vids[0];
      v.loop = true;
      v.src = HERO_CLIPS[0];
      v.style.opacity = "1";
      v.load();
      v.addEventListener("canplay", () => v.play().catch(() => {}), {
        once: true
      });
      return () => {};
    }
    let cur = 0; // which video element is visible (0|1)
    let clip = 0; // which HERO_CLIPS index is visible
    const capOf = v => Math.min(Math.max(v.duration || CLIP_MAX, CLIP_MIN), CLIP_MAX);
    const preload = (el, ci) => {
      el.src = HERO_CLIPS[ci];
      el.load();
    };
    const advance = () => {
      const nextClip = (clip + 1) % HERO_CLIPS.length;
      const incoming = vids[cur ^ 1];
      const swap = () => {
        incoming.currentTime = 0;
        incoming.play().catch(() => {});
        incoming.style.opacity = "1"; // instant hard cut
        vids[cur].style.opacity = "0";
        cur ^= 1;
        clip = nextClip;
        preload(vids[cur ^ 1], (clip + 1) % HERO_CLIPS.length); // buffer the following clip
        clearTimeout(timer);
        timer = setTimeout(advance, capOf(incoming) * 1000);
      };
      if (incoming.readyState >= 2) swap();else incoming.addEventListener("canplay", swap, {
        once: true
      });
    };
    const begin = () => {
      cur = 0;
      clip = 0;
      vids[0].style.opacity = "1";
      vids[1].style.opacity = "0";
      vids[0].currentTime = 0;
      vids[0].play().catch(() => {});
      preload(vids[1], 1 % HERO_CLIPS.length);
      clearTimeout(timer);
      timer = setTimeout(advance, capOf(vids[0]) * 1000);
    };
    vids[0].src = HERO_CLIPS[0];
    vids[0].load();
    if (vids[0].readyState >= 2) begin();else vids[0].addEventListener("canplay", begin, {
      once: true
    });
    return () => {
      clearTimeout(timer);
    };
  }, []);
  const logoColor = window.__resources && window.__resources.logoColor || "sunrise-assets/logo-color.png";
  return /*#__PURE__*/React.createElement("section", {
    className: "hero",
    id: "top",
    ref: heroRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__media"
  }, /*#__PURE__*/React.createElement("video", {
    ref: aRef,
    muted: true,
    playsInline: true,
    preload: "auto",
    poster: "uploads/aerial-home.jpg"
  }), /*#__PURE__*/React.createElement("video", {
    ref: bRef,
    muted: true,
    playsInline: true,
    preload: "auto",
    poster: "uploads/aerial-home.jpg",
    style: {
      opacity: 0
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero__scrim"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero__brand",
    ref: brandRef
  }, /*#__PURE__*/React.createElement("img", {
    className: "hero__logo",
    src: window.__resources && window.__resources.logoCream || "sunrise-assets/logo-cream.png",
    alt: "Sunrise Roofers LLC"
  }), /*#__PURE__*/React.createElement("p", {
    className: "hero__tagline"
  }, "Roofing Done Right by a Tucson Family"), /*#__PURE__*/React.createElement("div", {
    className: "hero__actions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary btn--xl",
    href: "#contact"
  }, "Get a Free Estimate ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--on-dark btn--xl",
    href: "tel:5207531758"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " Call 520-753-1758")), /*#__PURE__*/React.createElement("div", {
    className: "hero__scroll"
  }, /*#__PURE__*/React.createElement("span", null, "Scroll"), /*#__PURE__*/React.createElement("span", {
    className: "mouse"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hero__inner",
    ref: textRef,
    style: {
      opacity: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow hero__eyebrow"
  }, "Family-Owned by Eddie & Viky Guillen · ROC #358079"), /*#__PURE__*/React.createElement("h1", {
    className: "h-display"
  }, "Roof Repair, Replacement & ", /*#__PURE__*/React.createElement("em", null, "Metal Roof"), " Installation in Tucson"), /*#__PURE__*/React.createElement("p", {
    className: "hero__body"
  }, "Sunrise is Eddie and Viky Guillen — a Tucson family, not a call center. Eddie's been on these roofs 20-plus years and runs every job like his name's on it, because it is. Leak or full tear-off, you get a straight answer, clean work, and a roof that finally quits leaking. No pressure, no closers, no sign-today games."), /*#__PURE__*/React.createElement("div", {
    className: "hero__cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary",
    href: "#contact"
  }, "Get a Free Roof Estimate ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--on-dark",
    href: window.__projects || "Projects.html"
  }, "View Roofing Projects")), /*#__PURE__*/React.createElement("div", {
    className: "hero__badges"
  }, ["Licensed & Insured", "Local Tucson Company", "Free Roof Inspections", "Financing Available", "Residential & Commercial", "5-Star Rated on Google"].map(b => /*#__PURE__*/React.createElement("span", {
    className: "hero__badge",
    key: b
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-c"
  }), " ", b)))))));
}
function TrustBar() {
  return /*#__PURE__*/React.createElement("section", {
    className: "trustbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("p", {
    className: "trustbar__label"
  }, "Trusted by Tucson homeowners, property managers & businesses"), /*#__PURE__*/React.createElement("div", {
    className: "trustbar__row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement(GoogleGColor, {
    size: 32
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Stars, {
    cls: "stars"
  }), /*#__PURE__*/React.createElement("div", {
    className: "trust-item__lbl"
  }, "5-Star rated on Google"))), /*#__PURE__*/React.createElement("div", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "gaf-badge"
  }, /*#__PURE__*/React.createElement("b", null, "GAF")), /*#__PURE__*/React.createElement("div", {
    className: "trust-item__lbl"
  }, "GAF-Certified Contractor")), /*#__PURE__*/React.createElement("div", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement(BBBLogo, {
    size: 46
  }), /*#__PURE__*/React.createElement("div", {
    className: "trust-item__lbl"
  }, "A- Rated · BBB Accredited")), /*#__PURE__*/React.createElement("div", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement(PlaqueIcon, {
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    className: "trust-item__lbl"
  }, "ROC #358079 · Licensed, Bonded & Insured")), /*#__PURE__*/React.createElement("div", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement(MedalIcon, {
    size: 44
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "trust-item__big",
    style: {
      fontSize: 26
    }
  }, "20+"), /*#__PURE__*/React.createElement("div", {
    className: "trust-item__lbl"
  }, "Years roofing Tucson"))))));
}
Object.assign(window, {
  Hero,
  TrustBar
});
})();
