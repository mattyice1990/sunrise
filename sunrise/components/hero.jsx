/* hero.jsx — Hero (video playlist bg) + TrustBar */

/* Hero background plays through this list, 3–6s each, HARD-CUTTING to the
   next (no fade/flash) via a preloaded dual-video buffer, then loops the
   whole sequence forever. Add/remove clips here. */
const HERO_CLIPS = [
  "uploads/AdobeStock_1831107909_compressed.mp4",
  "uploads/AdobeStock_1879827039_compressed.mp4",
  "uploads/AdobeStock_786610596_compressed.mp4",
  "uploads/AdobeStock_353379036_compressed.mp4",
];
const CLIP_MIN = 4;   // seconds — minimum time on a clip (+1s after dropping the fire clip)
const CLIP_MAX = 7;   // seconds — maximum time on a clip (+1s after dropping the fire clip)

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
    const hero = heroRef.current, brand = brandRef.current, text = textRef.current;
    if (!hero || !brand || !text) return;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      hero.classList.add("hero--static");
      brand.style.opacity = "0"; brand.style.visibility = "hidden";
      text.style.opacity = "1"; text.style.transform = "none";
      return;
    }
    let raf = 0;
    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      const total = Math.max(hero.offsetHeight - vh, 1);
      const p = clamp(-hero.getBoundingClientRect().top / total, 0, 1);
      const bp = clamp(p / 0.42, 0, 1);            // brand exits over first 42%
      brand.style.opacity = String(1 - bp);
      brand.style.transform = "translateY(" + (-46 * bp) + "px) scale(" + (1 + 0.13 * bp) + ")";
      brand.style.pointerEvents = bp > 0.6 ? "none" : "";
      const tp = clamp((p - 0.32) / 0.4, 0, 1);    // text enters 32%—72%
      text.style.opacity = String(tp);
      text.style.transform = "translateY(" + (46 * (1 - tp)) + "px)";
      text.style.pointerEvents = tp > 0.4 ? "" : "none";
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
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
    // On phones, data-saver, or reduced-motion: skip the video entirely and let
    // the poster image stand in — saves mobile bandwidth and improves LCP.
    const lite = window.matchMedia("(max-width: 760px)").matches
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || (navigator.connection && navigator.connection.saveData);
    if (lite) return;
    vids.forEach((v) => { v.muted = true; v.playsInline = true; });
    let timer;

    // single-clip: just loop it, no buffering needed
    if (HERO_CLIPS.length === 1) {
      const v = vids[0];
      v.loop = true; v.src = HERO_CLIPS[0]; v.style.opacity = "1"; v.load();
      v.addEventListener("canplay", () => v.play().catch(() => {}), { once: true });
      return () => {};
    }

    let cur = 0;   // which video element is visible (0|1)
    let clip = 0;  // which HERO_CLIPS index is visible
    const capOf = (v) => Math.min(Math.max(v.duration || CLIP_MAX, CLIP_MIN), CLIP_MAX);
    const preload = (el, ci) => { el.src = HERO_CLIPS[ci]; el.load(); };

    const advance = () => {
      const nextClip = (clip + 1) % HERO_CLIPS.length;
      const incoming = vids[cur ^ 1];
      const swap = () => {
        incoming.currentTime = 0;
        incoming.play().catch(() => {});
        incoming.style.opacity = "1";      // instant hard cut
        vids[cur].style.opacity = "0";
        cur ^= 1; clip = nextClip;
        preload(vids[cur ^ 1], (clip + 1) % HERO_CLIPS.length); // buffer the following clip
        clearTimeout(timer);
        timer = setTimeout(advance, capOf(incoming) * 1000);
      };
      if (incoming.readyState >= 2) swap();
      else incoming.addEventListener("canplay", swap, { once: true });
    };

    const begin = () => {
      cur = 0; clip = 0;
      vids[0].style.opacity = "1"; vids[1].style.opacity = "0";
      vids[0].currentTime = 0; vids[0].play().catch(() => {});
      preload(vids[1], 1 % HERO_CLIPS.length);
      clearTimeout(timer);
      timer = setTimeout(advance, capOf(vids[0]) * 1000);
    };

    vids[0].src = HERO_CLIPS[0]; vids[0].load();
    if (vids[0].readyState >= 2) begin();
    else vids[0].addEventListener("canplay", begin, { once: true });

    return () => { clearTimeout(timer); };
  }, []);

  const logoColor = (window.__resources && window.__resources.logoColor) || "sunrise-assets/logo-color.png";
  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero__stage">
        <div className="hero__media">
          <video ref={aRef} muted playsInline preload="auto" poster="uploads/aerial-home.jpg"></video>
          <video ref={bRef} muted playsInline preload="auto" poster="uploads/aerial-home.jpg" style={{ opacity: 0 }}></video>
        </div>
        <div className="hero__scrim"></div>

        {/* Big centered brand intro — fades + scales away on scroll */}
        <div className="hero__brand" ref={brandRef}>
          <img className="hero__logo" src={(window.__resources && window.__resources.logoCream) || "sunrise-assets/logo-cream.png"} alt="Sunrise Roofers LLC" />
          <p className="hero__tagline">Tucson's Trusted Roofing Experts</p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--xl" href="#contact">Get a Free Estimate <Icon name="arrow" /></a>
            <a className="btn btn--on-dark btn--xl" href="tel:5207531758"><Icon name="phone" /> Call 520-753-1758</a>
          </div>
          <div className="hero__scroll"><span>Scroll</span><span className="mouse"></span></div>
        </div>

        {/* Hero message — rises into view as the logo exits */}
        <div className="hero__inner" ref={textRef} style={{ opacity: 0 }}>
          <div className="container">
            <p className="eyebrow hero__eyebrow">Tucson's Trusted Roofing Experts</p>
            <h1 className="h-display">Roof Repair, Replacement &amp; <em>Metal Roof</em> Installation in Tucson</h1>
            <p className="hero__body">
              Built for our heat, our monsoons, and the long haul. Quick leak or a
              full tear-off, you get clean work, straight talk, and a roof that
              finally quits leaking.
            </p>
            <div className="hero__cta">
              <a className="btn btn--primary" href="#contact">Get a Free Roof Estimate <Icon name="arrow" /></a>
              <a className="btn btn--on-dark" href={(window.__projects || "Projects.html")}>View Roofing Projects</a>
            </div>
            <div className="hero__badges">
              {["Licensed & Insured", "Local Tucson Company", "Free Roof Inspections", "Financing Available", "Residential & Commercial", "5-Star Rated on Google"].map((b) => (
                <span className="hero__badge" key={b}><Icon name="check-c" /> {b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="trustbar">
      <div className="container">
        <p className="trustbar__label">Trusted by Tucson homeowners, property managers &amp; businesses</p>
        <div className="trustbar__row">
          <div className="trust-item">
            <GoogleGColor size={32} />
            <div>
              <Stars cls="stars" />
              <div className="trust-item__lbl">5-Star rated on Google</div>
            </div>
          </div>
          <div className="trust-item">
            <span className="gaf-badge"><b>GAF</b></span>
            <div className="trust-item__lbl">GAF-Certified Contractor</div>
          </div>
          <div className="trust-item">
            <BBBLogo size={46} />
            <div className="trust-item__lbl">A- Rated &middot; BBB Accredited</div>
          </div>
          <div className="trust-item">
            <PlaqueIcon size={44} />
            <div className="trust-item__lbl">ROC #358079 · Licensed, Bonded &amp; Insured</div>
          </div>
          <div className="trust-item">
            <MedalIcon size={44} />
            <div><span className="trust-item__big" style={{fontSize:26}}>20+</span><div className="trust-item__lbl">Years roofing Tucson</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, TrustBar });
