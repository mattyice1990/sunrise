/* social.jsx — Testimonials + FAQ accordion */

const TST = [
  { q: "They found the actual source of our monsoon leak after two other companies just patched the surface. Honest, fast, and the crew left the yard spotless.", n: "Dana R.", r: "Homeowner · Catalina Foothills", i: "DR" },
  { q: "We manage six HOA communities and Sunrise is the only roofer we trust with phased work. Clear logs, clear pricing, and the board never gets surprises.", n: "Marcus T.", r: "Property Manager · Oro Valley", i: "MT" },
  { q: "Recoated our warehouse roof instead of pushing a full tear-off — saved us thousands and it hasn't leaked since. That kind of honesty earns repeat business.", n: "Lena K.", r: "Facilities Director · South Tucson", i: "LK" },
];

function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow eyebrow--center">What Tucson Says</p>
          <h2 className="h2">Reviews From Real Roofs</h2>
        </div>
        <div className="tst-grid">
          {TST.map((t) => (
            <article className="tst-card" key={t.n}>
              <Stars cls="tst-card__stars" />
              <p className="tst-card__quote">"{t.q}"</p>
              <div className="tst-card__who">
                <span className="tst-card__av">{t.i}</span>
                <span>
                  <span className="tst-card__nm" style={{ display: "block" }}>{t.n}</span>
                  <span className="tst-card__rl">{t.r}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "How do I know if I need a roof repair or a full replacement?", a: "Comes down to the roof's age, how bad the damage is, and the shape the underlayment's in. We look first, show you photos of what we find, and recommend the most cost-effective fix, which is often a repair or a coating, not a full replacement." },
  { q: "Do you offer free roof inspections?", a: "Yep. Every inspection's free and you get photos and a written summary, whether you hire us or not." },
  { q: "Do you install metal roofing in Tucson?", a: "For sure, standing-seam metal is one of our specialties. It reflects the heat, shrugs off UV and monsoon rain, and'll go 40-plus years out here." },
  { q: "What roofing material is best for Arizona heat?", a: "Metal and tile both hold up great against the heat and UV, and foam-and-coating systems are the move on flat roofs. We'll match the right one to your building, budget and goals." },
  { q: "How long does a roof replacement take?", a: "Most houses take 2 to 4 days depending on size, material and weather. We give you a real timeline up front and keep you posted every day." },
  { q: "Can you help with storm or monsoon damage?", a: "Yep, 24/7 emergency response, temporary protection to stop a live leak, and we'll help document the damage for your insurance claim." },
  { q: "Do you work with HOAs or commercial properties?", a: "We do a ton of HOA, multi-family, retail and commercial work, with phased scheduling, detailed service logs, and one person you call for every property." },
  { q: "Do you offer financing?", a: "Yep. We've got flexible financing on approved credit so a new roof fits the budget, just ask us during your estimate." },
  { q: "Are you licensed and insured?", a: "Sunrise Roofers LLC is fully licensed (ROC #358079), bonded, and insured for both residential and commercial roofing across the Tucson area." },
];

function FAQItem({ item }) {
  return (
    <div className="faq-item is-open">
      <h3 className="faq-q">
        <span className="faq-bullet"><Icon name="check-c" /></span>
        <span>{item.q}</span>
      </h3>
      <div className="faq-a">
        <div className="faq-a__inner">{item.a}</div>
      </div>
    </div>
  );
}

function FAQAccordion() {
  return (
    <section className="section deep" id="faq">
      <div className="container faq-wrap">
        <div>
          <p className="eyebrow">Resources</p>
          <h2 className="h2" style={{ marginBottom: 18 }}>Roofing Questions, Answered</h2>
          <p className="lead">Straight answers to what folks around Tucson ask us most. Still wondering about something? We're a phone call away.</p>
          <a className="btn btn--primary" style={{ marginTop: 26 }} href="#contact">Ask Us Anything <Icon name="arrow" /></a>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <FAQItem key={i} item={f} />
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Testimonials, FAQAccordion });
