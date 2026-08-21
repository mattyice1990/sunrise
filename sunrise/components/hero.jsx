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
/* Liability coverage shown in the hero. Kept as one constant so the figure is
   a one-line change if the policy ever does. Confirmed by Matt 2026-08-20. */
const HERO_INSURANCE = { big: "$2M", small: "Liability Insured" };

/* Proof shown in the first hero state, before any scrolling. These replace the
   old Get-a-Free-Estimate / Call button pair: the estimate CTA now lives in the
   form to the right, and the phone stays as a text link underneath, because
   calls remain the dominant lead channel (16 of 17 last week came by phone).
   "1,000+ Roofs in 20+ Years" is framed as Eddie's career, not the LLC's, so it
   does not contradict foundingDate 2025 in seo/nap.json. */
const HERO_TRUST = [
  { big: "Lifetime", small: "Guarantee" },
  HERO_INSURANCE,
  { big: "1,000+", small: "Roofs in 20+ Years" },
];

const HERO_SERVICES = [
  "Roof Repair", "Roof Replacement", "Metal Roof Installation", "Tile Roofing",
  "Flat Roof / Coatings", "Commercial Roofing", "Roof Inspection", "Storm / Monsoon Damage",
];

const CLIP_MIN = 4;   // seconds — minimum time on a clip (+1s after dropping the fire clip)
const CLIP_MAX = 7;   // seconds — maximum time on a clip (+1s after dropping the fire clip)

/* Compact three-field version of the main contact form, pinned beside the hero
   on desktop. Posts to the same Web3Forms key and fires the same generate_lead
   key event, tagged form_id "hero-form" so GA4 can tell the two apart.

   NOTE: the access key is duplicated from contact.jsx. If it ever changes in the
   Web3Forms dashboard it must be updated in BOTH files. Left duplicated on
   purpose rather than refactoring the live, already-verified contact form. */
function HeroForm() {
  const [vals, setVals] = useState({ name: "", phone: "", service: "" });
  const [errs, setErrs] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const set = (k) => (e) => setVals((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!vals.name.trim()) er.name = "Your name";
    if (!/^[\d\s()+-]{7,}$/.test(vals.phone)) er.phone = "Valid phone";
    if (!vals.service) er.service = "Pick one";
    setErrs(er);
    if (Object.keys(er).length > 0) return;

    setSending(true);
    setSubmitErr("");

    try {
      if (window.PursuitAttribution) {
        window.PursuitAttribution.submit({
          name: vals.name, phone: vals.phone, service: vals.service, source: "hero-form",
        });
      }
    } catch (err) {}

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "bb31a1fd-2cf0-4ea5-8920-18cad8059ed4",
          subject: "New Roofing Estimate Request (Hero) - Sunrise Roofers",
          from_name: "Sunrise Roofers Website",
          name: vals.name, phone: vals.phone, service: vals.service,
        }),
      });
      const result = await res.json();
      if (result.success) {
        try {
          if (typeof window.gtag === "function") {
            window.gtag("event", "generate_lead", { form_id: "hero-form", page_location: window.location.href });
          }
        } catch (err) {}
        setSent(true);
      } else {
        setSubmitErr(result.message || "Couldn't send. Call or text 520-753-1758.");
      }
    } catch (err) {
      setSubmitErr("Couldn't send right now. Call or text 520-753-1758.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="heroform heroform--done" role="status">
        <Icon name="check-c" />
        <h3>Got it — thank you.</h3>
        <p>Eddie will reach out shortly. Need us sooner? Call or text <a href="tel:5207531758">520-753-1758</a>.</p>
      </div>
    );
  }

  return (
    <form className="heroform" onSubmit={submit} noValidate>
      <div className="heroform__head">
        <p className="heroform__eyebrow">Free · No Pressure</p>
        <h3 className="heroform__title">Get Your Free Roof Estimate</h3>
        <p className="heroform__sub">Most estimates come back within a day.</p>
      </div>

      <label className="heroform__field">
        <span>Name</span>
        <input type="text" value={vals.name} onChange={set("name")} placeholder="Jane Doe" aria-label="Full name" />
        {errs.name && <em>{errs.name}</em>}
      </label>

      <label className="heroform__field">
        <span>Phone</span>
        <input type="tel" value={vals.phone} onChange={set("phone")} placeholder="(520) 555-0123" aria-label="Phone number" />
        {errs.phone && <em>{errs.phone}</em>}
      </label>

      <label className="heroform__field">
        <span>Service Needed</span>
        <select value={vals.service} onChange={set("service")} aria-label="Service needed">
          <option value="">Select a service…</option>
          {HERO_SERVICES.map((sv) => <option key={sv} value={sv}>{sv}</option>)}
        </select>
        {errs.service && <em>{errs.service}</em>}
      </label>

      <button className="btn btn--primary heroform__submit" type="submit" disabled={sending}>
        {sending ? "Sending\u2026" : "Request My Free Estimate"} <Icon name="arrow" />
      </button>

      {submitErr && <p className="heroform__err">{submitErr}</p>}

      <p className="heroform__fine">
        Or call/text <a href="tel:5207531758">520-753-1758</a> · ROC #358079
      </p>
    </form>
  );
}

function Hero() {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const heroRef = useRef(null);
  const brandRef = useRef(null);
  const textRef = useRef(null);
  const asideRef = useRef(null);
  const trustRef = useRef(null);

  /* ---- Scroll-reveal choreography ----------------------------------
     The hero is a tall scroll track with a pinned stage. As you scroll,
     the big centered brand logo fades + scales away while the headline,
     copy and CTAs rise into view. Reduced-motion shows the text state. */
  useEffect(() => {
    const hero = heroRef.current, brand = brandRef.current, text = textRef.current;
    const aside = asideRef.current;
    const trust = trustRef.current;
    if (!hero || !brand || !text) return;

    /* The stage is height:100vh but starts below the 45px topbar, so at
       scrollY 0 its bottom sits that far under the fold and anything pinned
       to bottom:0 is clipped — exactly the load-in view we want the trust
       strip visible in. Measure the overflow each frame instead of hardcoding
       a topbar height: it resolves to 0 as soon as the topbar scrolls away. */
    const seatTrust = () => {
      if (!trust) return;
      const over = Math.max(0, brand.getBoundingClientRect().bottom - window.innerHeight);
      trust.style.bottom = over + "px";
      /* hero__brand centres its column over the whole stage, which at shorter
         viewports runs the phone link straight into the trust strip below it.
         Reserve the strip's height (plus the off-screen overhang) as padding so
         the column centres in the space ABOVE the strip instead. Measured, not
         hardcoded — the strip's height changes with breakpoint and badge count. */
      const shown = window.getComputedStyle(trust).display !== "none";
      brand.style.paddingBottom = shown ? (over + trust.offsetHeight) + "px" : "";
    };
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      hero.classList.add("hero--static");
      brand.style.opacity = "0"; brand.style.visibility = "hidden";
      text.style.opacity = "1"; text.style.transform = "none";
      if (aside) { aside.style.opacity = "1"; aside.style.transform = "none"; }
      seatTrust();
      window.addEventListener("resize", seatTrust);
      return () => window.removeEventListener("resize", seatTrust);
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
      // Rail holds full opacity until the hero is nearly done, then fades out
      // over the last 12%. Pointer events stay on for as long as it is visible.
      if (aside) {
        const ap = 1 - clamp((p - 0.88) / 0.12, 0, 1);
        aside.style.opacity = String(ap);
        aside.style.pointerEvents = ap < 0.15 ? "none" : "";
      }
      seatTrust();
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
    // Play the (now ~5MB total, 720p) hero video on mobile too. Still respect
    // an explicit reduced-motion preference and data-saver — those users get
    // the poster image instead.
    const skipVideo = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || (navigator.connection && navigator.connection.saveData);
    if (skipVideo) return;
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
          <video ref={aRef} muted playsInline preload="auto" poster="uploads/residential-roofing-tucson-aerial.jpg"></video>
          <video ref={bRef} muted playsInline preload="auto" poster="uploads/residential-roofing-tucson-aerial.jpg" style={{ opacity: 0 }}></video>
        </div>
        <div className="hero__scrim"></div>

        {/* Form rail — deliberately OUTSIDE hero__brand so it keeps its own
            opacity curve and stays interactive while the stage is pinned.
            Putting it inside the brand layer would fade it (and kill pointer
            events) the moment someone scrolled while typing. */}
        <aside className="hero__aside" ref={asideRef}>
          <HeroForm />
        </aside>

        {/* Brand intro — fades + scales away on scroll */}
        <div className="hero__brand" ref={brandRef}>
          <img className="hero__logo" src={(window.__resources && window.__resources.logoCream) || "sunrise-assets/logo-cream.png"} alt="Sunrise Roofers LLC" />
          <p className="hero__tagline">Roofing Done Right by a Tucson Family</p>
          <ul className="hero__trust">
            {HERO_TRUST.map((t) => (
              <li className="hero__trust-item" key={t.big + t.small}>
                <span className="hero__trust-big">{t.big}</span>
                <span className="hero__trust-small">{t.small}</span>
              </li>
            ))}
          </ul>
          <a className="btn btn--primary btn--xl hero__tel" href="tel:5207531758">
            <Icon name="phone" /> Call or Text 520-753-1758
          </a>
          {/* Desktop gets the form in the rail to the right; on phones the rail
              is hidden (a 100vh stage can't hold both), so keep a real CTA. */}
          <a className="btn btn--on-dark btn--xl hero__mobile-cta" href="#contact">
            Get a Free Estimate <Icon name="arrow" />
          </a>
          {/* Trust strip pinned to the base of the first hero state. Lives inside
              hero__brand so it belongs to the load-in view and fades out with
              it; left/right:0 resolve against the padding box, so on desktop it
              stops short of the form rail instead of sliding underneath it. */}
          <div className="hero__trustbar" ref={trustRef}><TrustBar /></div>
        </div>

        {/* Hero message — rises into view as the logo exits */}
        <div className="hero__inner" ref={textRef} style={{ opacity: 0 }}>
          <div className="container">
            <p className="eyebrow hero__eyebrow">Family-Owned by Eddie &amp; Viky Guillen · ROC #358079</p>
            <h1 className="h-display">Roof Repair, Replacement &amp; <em>Metal Roof</em> Installation in Tucson</h1>
            <p className="hero__body">
              Sunrise is Eddie and Viky Guillen &mdash; a Tucson family business.
              Eddie's been on these roofs 20-plus years and runs every job
              like his name's on it, because it is. Leak or full tear-off, you get a
              straight answer, clean work, and a roof that finally quits leaking. No
              pressure, no closers, no sign-today games.
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
