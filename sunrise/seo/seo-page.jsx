/* seo-page.jsx — data-driven SEO landing-page template.
   Reads window.SEO[window.__page] and renders a full, schema-rich page that
   reuses the shared chrome (TopBar, HeaderNav, ContactForm, Footer, Chat).
   Each page object supplies its own copy — see sunrise/seo/data-*.js. */

const PAGE = (window.SEO || {})[window.__page] || {};
const U = (slug) => window.SUNRISE.url(slug);

/* Per-page hero background photo (real roofing job shots). Falls back to the
   CSS gradient when a slug has no mapping. */
const HERO_IMG = {
  "roof-repair": "uploads/roof-repair-tucson.jpg",
  "roof-replacement": "uploads/residential-roofing-tucson-aerial.jpg",
  "roof-installation": "uploads/new-construction-roofing-tucson.webp",
  "roof-inspection": "uploads/sunrise-roofers-team-tucson.webp",
  "emergency-roof-repair": "uploads/clay-tile-roof-repair-tucson.jpg",
  "storm-damage-roof-repair-tucson": "uploads/storm-damage-roof-tucson.jpg",
  "tile-roofing": "uploads/tile-roof-underlayment-tucson.jpg",
  "flat-roofing": "uploads/flat-roof-tpo-tucson.jpg",
  "roof-coatings": "uploads/retail-roof-coating-tucson.jpg",
  "metal-roofing": "uploads/metal-roofing-tucson-aerial.jpg",
  "shingle-roofing": "uploads/shingle-roof-installation-tucson.jpg",
  "gutter-installation": "uploads/steep-pitch-roofing-tucson.jpeg",
  "skylight-installation": "uploads/skylight-installation-tucson.jpg",
  "roofing-tucson": "uploads/residential-roofing-tucson-aerial.jpg",
  "roofing-oro-valley": "uploads/tile-roof-underlayment-tucson.jpg",
  "roofing-marana": "uploads/shingle-roof-installation-tucson.jpg",
  "roofing-sahuarita-green-valley": "uploads/tile-roof-replacement-marana.jpg",
  "roofing-vail-az": "uploads/steep-pitch-roofing-tucson.jpeg",
  "residential-roofing": "uploads/residential-roofing-tucson-aerial.jpg",
  "commercial-roofing": "uploads/commercial-roofing-tucson-aerial.jpg",
  "about": "uploads/sunrise-roofers-team-tucson.webp",
  "contact": "uploads/residential-roofing-tucson-aerial.jpg",
  "resources": "uploads/roof-coating-application-tucson.jpeg",
};

/* Alt text for the hero photo. Describes what the image actually shows and
   carries the service + city keyword, so the hero is indexable in Google Images
   instead of being an unreachable CSS background. */
const HERO_ALT = {
  "roof-repair": "Sunrise Roofers technician repairing a cracked tile roof in Tucson, AZ",
  "roof-replacement": "Aerial view of a completed roof replacement on a Tucson, AZ home",
  "roof-installation": "New roof installation on a newly built home in Tucson, AZ",
  "roof-inspection": "Sunrise Roofers crew carrying out a free roof inspection in Tucson, AZ",
  "emergency-roof-repair": "Emergency clay tile roof repair on a Tucson, AZ home",
  "storm-damage-roof-repair-tucson": "Wind and monsoon storm damage on a Tucson, AZ roof before repair",
  "tile-roofing": "Tile roof underlayment replacement on a Tucson, AZ home",
  "flat-roofing": "TPO flat roof installation on a Tucson, AZ building",
  "roof-coatings": "Reflective elastomeric roof coating applied to a flat roof in Tucson, AZ",
  "metal-roofing": "Standing seam metal roof on a Tucson, AZ property",
  "shingle-roofing": "Asphalt shingle roof installation in Tucson, AZ",
  "gutter-installation": "Seamless gutter and steep-pitch roofing work in Tucson, AZ",
  "skylight-installation": "Skylight installed during a roof replacement in Tucson, AZ",
  "roofing-tucson": "Aerial view of a Tucson, AZ home roofed by Sunrise Roofers",
  "roofing-oro-valley": "Tile roof work on an Oro Valley, AZ home",
  "roofing-marana": "Shingle roof replacement on a Marana, AZ home",
  "roofing-sahuarita-green-valley": "Tile roof replacement near Sahuarita and Green Valley, AZ",
  "roofing-vail-az": "Steep-pitch roofing work on a home in Vail, AZ",
  "residential-roofing": "Residential tile roof on a Tucson, AZ home",
  "commercial-roofing": "Commercial flat roof on a Tucson, AZ building",
  "about": "The Sunrise Roofers crew on a job site in Tucson, AZ",
  "contact": "Tucson, AZ home with a new roof installed by Sunrise Roofers",
  "resources": "Roof coating being applied on a Tucson, AZ roof",
};

/* ---------- head: <title>, meta description, JSON-LD ---------- */
function injectSeoHead(p) {
  if (!p || !p.slug) return;
  document.title = p.title;
  const setMeta = (name, content, attr = "name") => {
    let m = document.head.querySelector(`meta[${attr}="${name}"]`);
    if (!m) { m = document.createElement("meta"); m.setAttribute(attr, name); document.head.appendChild(m); }
    m.setAttribute("content", content);
  };
  setMeta("description", p.desc);
  setMeta("og:title", p.title, "property");
  setMeta("og:description", p.desc, "property");
  setMeta("og:type", "website", "property");

  const base = "https://roofwithsunrise.com"; // no trailing slash: SUNRISE.url() already returns a leading "/"
  const shortHere = (window.SUNRISE.ALL[p.slug] && window.SUNRISE.ALL[p.slug].t) || p.hero.h1;
  const crumbs = [{ name: "Home", slug: "home" }];
  if (p.crumb) crumbs.push({ name: p.crumb, slug: p.crumbSlug || null });
  crumbs.push({ name: shortHere, slug: p.slug });

  // Core pages are not services. Typing About/Contact/Resources as Service told
  // Google that "About Us" was a product called "tucson roofing company".
  const CORE_TYPE = { about: "AboutPage", contact: "ContactPage", resources: "CollectionPage" };
  const primary = CORE_TYPE[p.slug]
    ? {
        "@context": "https://schema.org", "@type": CORE_TYPE[p.slug],
        name: p.hero.h1, description: p.desc,
        url: base + window.SUNRISE.url(p.slug),
        publisher: { "@id": base + "/#business" },
      }
    : {
      "@context": "https://schema.org", "@type": "Service",
      serviceType: p.kw && p.kw.primary, name: p.hero.h1,
      areaServed: { "@type": "City", name: "Tucson", "@id": "https://www.wikidata.org/wiki/Q5712" },
      // @id ties every service page's provider back to the single canonical
      // business node on the homepage instead of minting a new partial entity
      // per page. Address must stay complete + identical to GBP for NAP parity.
      provider: {
        "@type": "RoofingContractor", "@id": base + "/#business",
        name: "Sunrise Roofers LLC",
        telephone: window.SUNRISE.PHONE, email: window.SUNRISE.EMAIL,
        address: {
          "@type": "PostalAddress",
          streetAddress: "7320 N La Cholla Blvd Ste 154-276",
          addressLocality: "Tucson", addressRegion: "AZ",
          postalCode: "85741", addressCountry: "US",
        },
        areaServed: "Tucson & Pima County, AZ",
      },
      description: p.desc,
    };

  const ld = [
    primary,
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      // Only linked crumbs go in the JSON-LD: Google requires "item" on every
      // ListItem except the last, and an undefined item is dropped by
      // JSON.stringify, which fails validation. The unlinked middle label
      // ("Services", "Service Areas", ...) still renders in <Crumb> below.
      itemListElement: crumbs
        .filter((c) => c.slug)
        .map((c, i) => ({
          "@type": "ListItem", position: i + 1, name: c.name,
          item: base + window.SUNRISE.url(c.slug),
        })),
    },
  ];
  if (p.faqs && p.faqs.length) {
    ld.push({
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: p.faqs.map((f) => ({
        "@type": "Question", name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  let s = document.getElementById("seo-jsonld");
  if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = "seo-jsonld"; document.head.appendChild(s); }
  s.textContent = JSON.stringify(ld);
}

/* ---------- breadcrumb ---------- */
function Crumb({ p }) {
  const here = (window.SUNRISE.ALL[p.slug] && window.SUNRISE.ALL[p.slug].t) || p.hero.h1;
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      <a href={U("home")}>Home</a>
      <Icon name="caret" />
      {p.crumb && (p.crumbSlug
        ? <React.Fragment><a href={U(p.crumbSlug)}>{p.crumb}</a><Icon name="caret" /></React.Fragment>
        : <React.Fragment><span>{p.crumb}</span><Icon name="caret" /></React.Fragment>)}
      <span className="crumb__here">{here}</span>
    </nav>
  );
}

/* ---------- hero ---------- */
function SeoHero({ p }) {
  const kw = p.kw || {};
  return (
    <header className="shero">
      {HERO_IMG[p.slug] && (
        <img className="shero__photo" src={HERO_IMG[p.slug]}
             alt={HERO_ALT[p.slug] || p.hero.h1} fetchPriority="high" decoding="async" />
      )}
      <div className="shero__bg" style={HERO_IMG[p.slug] ? { backgroundImage: "linear-gradient(160deg, rgba(20,17,14,.82) 0%, rgba(12,10,8,.66) 100%)" } : undefined}></div>
      <div className="shero__scrim"></div>
      <div className="container shero__inner">
        <Crumb p={p} />
        <p className="eyebrow shero__eyebrow">{p.hero.eyebrow}</p>
        <h1 className="shero__h1">{p.hero.h1}</h1>
        <p className="shero__sub">{p.hero.sub}</p>
        <div className="shero__cta">
          <a className="btn btn--primary btn--lg" href={U("contact")}>Get a Free Estimate <Icon name="arrow" /></a>
          <a className="btn btn--on-dark btn--lg" href={window.SUNRISE.PHONE_HREF}><Icon name="phone" /> {window.SUNRISE.PHONE}</a>
        </div>
        <ul className="shero__chips">
          {(p.hero.chips || ["Licensed & Insured · ROC #358079", "Free Roof Inspections", "5-Star Rated on Google", "Financing Available"]).map((c) => (
            <li key={c}><Icon name="check-c" /> {c}</li>
          ))}
        </ul>
      </div>
    </header>
  );
}

/* ---------- intro + highlight cards ---------- */
function Intro({ p }) {
  if (!p.intro) return null;
  return (
    <section className="section sintro" data-reveal>
      <div className="container sintro__grid">
        <div className="sintro__lead">
          <p className="eyebrow">{p.intro.kicker || "Overview"}</p>
          <h2 className="h2">{p.intro.h || p.hero.h1}</h2>
          {p.intro.lead.map((t, i) => <p key={i} className="lead sintro__p">{t}</p>)}
          {p.intro.bullets && (
            <ul className="ticks">
              {p.intro.bullets.map((b) => <li key={b}><Icon name="check" /> {b}</li>)}
            </ul>
          )}
          {p.guide && (
            <p className="sintro__guide"><a className="link-arrow" href={p.guide.url}>{p.guide.label} <Icon name="arrow" /></a></p>
          )}
          <div className="sintro__actions">
            <a className="btn btn--primary" href={U("contact")}>Request Free Estimate <Icon name="arrow" /></a>
            <a className="btn btn--ghost" href={window.SUNRISE.PHONE_HREF}>Call {window.SUNRISE.PHONE}</a>
          </div>
        </div>
        {p.highlights && (
          <div className="sintro__cards">
            {p.highlights.map((h) => (
              <div className="hcard" key={h.t}>
                <span className="hcard__ic"><Icon name={h.ic} /></span>
                <h3>{h.t}</h3>
                <p>{h.d}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- body sections (alternating) ---------- */
function Sections({ p }) {
  if (!p.sections) return null;
  return (
    <React.Fragment>
      {p.sections.map((s, i) => (
        <section className={"section sbody" + (i % 2 ? " sbody--alt" : "")} key={s.h} data-reveal>
          <div className="container sbody__in">
            <div className="sbody__txt">
              {s.kicker && <p className="eyebrow">{s.kicker}</p>}
              <h2 className="h2">{s.h}</h2>
              {s.p.map((t, j) => <p key={j} className="sbody__p">{t}</p>)}
              {s.bullets && (
                <ul className="ticks ticks--2">
                  {s.bullets.map((b) => <li key={b}><Icon name="check" /> {b}</li>)}
                </ul>
              )}
            </div>
            {s.cards && (
              <div className="sbody__cards">
                {s.cards.map((c) => (
                  <div className="minicard" key={c.t}>
                    <span className="minicard__ic"><Icon name={c.ic || "check-c"} /></span>
                    <div><strong>{c.t}</strong><span>{c.d}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </React.Fragment>
  );
}

/* ---------- options / materials grid ---------- */
function Options({ p }) {
  if (!p.options) return null;
  return (
    <section className="section" data-reveal>
      <div className="container">
        <div className="sec-head">
          <p className="eyebrow">{p.options.kicker || "Options"}</p>
          <h2 className="h2">{p.options.h}</h2>
          {p.options.sub && <p className="lead sec-head__sub">{p.options.sub}</p>}
        </div>
        <div className="optgrid">
          {p.options.items.map((o) => (
            <div className="optcard" key={o.t}>
              <span className="optcard__ic"><Icon name={o.ic || "layers"} /></span>
              <h3>{o.t}</h3>
              <p>{o.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- process ---------- */
function Process({ p }) {
  if (!p.process) return null;
  return (
    <section className="section deep sprocess" data-reveal>
      <div className="container">
        <div className="sec-head">
          <p className="eyebrow">How It Works</p>
          <h2 className="h2">{p.processH || "Our Roofing Process"}</h2>
        </div>
        <div className="steps">
          {p.process.map((s, i) => (
            <div className="step" key={s.t}>
              <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ (always expanded for readability + SEO) ---------- */
function Faqs({ p }) {
  if (!p.faqs) return null;
  return (
    <section className="section sfaq" id="faq" data-reveal>
      <div className="container sfaq__in">
        <div className="sfaq__head">
          <p className="eyebrow">FAQ</p>
          <h2 className="h2">{p.faqH || "Roofing Questions, Answered"}</h2>
          <p className="lead">Still wondering about something? Call us at {window.SUNRISE.PHONE} — straight answers, no pressure.</p>
          <a className="btn btn--primary" href={U("contact")} style={{ marginTop: 8 }}>Ask Us Directly <Icon name="arrow" /></a>
        </div>
        <div className="sfaq__list">
          {p.faqs.map((f) => (
            <div className="faq" key={f.q}>
              <h3 className="faq__q">
                <span className="faq__ic"><Icon name="check" /></span>
                <span>{f.q}</span>
              </h3>
              <div className="faq__a"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- related internal links ---------- */
function Related({ p }) {
  if (!p.related || !p.related.length) return null;
  const items = p.related.map((slug) => window.SUNRISE.ALL[slug]).filter(Boolean);
  return (
    <section className="section srelated" data-reveal>
      <div className="container">
        <div className="sec-head">
          <p className="eyebrow">Explore More</p>
          <h2 className="h2">{p.relatedH || "Related Roofing Services"}</h2>
        </div>
        <div className="relgrid">
          {items.map((it) => (
            <a className="relcard" key={it.slug} href={U(it.slug)}>
              <span className="relcard__ic"><Icon name={it.ic || "layers"} /></span>
              <span className="relcard__t">{it.t}</span>
              {it.d && <span className="relcard__d">{it.d}</span>}
              <span className="relcard__arrow"><Icon name="arrow" /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- mid-page CTA band ---------- */
function CtaBand({ p }) {
  return (
    <section className="ctaband" data-reveal>
      <div className="container ctaband__in">
        <div>
          <h2>{p.ctaH || "Ready for a roof you can stop thinking about?"}</h2>
          <p>{p.ctaSub || "Free inspection, honest assessment, and a clear written estimate — usually within one business day."}</p>
        </div>
        <div className="ctaband__btns">
          <a className="btn btn--primary btn--lg" href={U("contact")}>Get My Free Estimate <Icon name="arrow" /></a>
          <a className="btn btn--on-dark btn--lg" href={window.SUNRISE.PHONE_HREF}><Icon name="phone" /> {window.SUNRISE.PHONE}</a>
        </div>
      </div>
    </section>
  );
}

function SeoPage() {
  useEffect(() => {
    injectSeoHead(PAGE);
    // Reveal-on-scroll for [data-reveal]; reveal immediately if observer
    // is unavailable so content is never stuck hidden.
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    const fb = setTimeout(() => els.forEach((e) => e.classList.add("is-in")), 2500);
    return () => { io.disconnect(); clearTimeout(fb); };
  }, []);
  if (!PAGE.slug) {
    return <div style={{ padding: 80, textAlign: "center", fontFamily: "sans-serif" }}>Page data not found for “{window.__page}”.</div>;
  }
  return (
    <React.Fragment>
      <TopBar />
      <HeaderNav />
      <main className="seopage">
        <SeoHero p={PAGE} />
        <Intro p={PAGE} />
        <Sections p={PAGE} />
        <Options p={PAGE} />
        <Process p={PAGE} />
        {PAGE.reviews !== false && <GoogleReviews />}
        <Faqs p={PAGE} />
        <Related p={PAGE} />
        {!PAGE.noCta && <CtaBand p={PAGE} />}
        <ContactForm />
      </main>
      <Footer />
    </React.Fragment>
  );
}

Object.assign(window, { SeoPage });

const _root = document.getElementById("root");
if (_root && window.__page) ReactDOM.createRoot(_root).render(<SeoPage />);
