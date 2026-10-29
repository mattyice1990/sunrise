/* services.jsx — ServiceCardGrid + WhyChooseUs */

/* Order matters: full roof replacement is the job Sunrise wants most, so it
   leads, followed by the three systems a replacement is built in. Repair stays
   on the page (it is the second-biggest lead source) but no longer leads. */
const SVC_CARDS = [
  { tag: "Our Specialty", t: "Full Roof Replacement", slug: "roof-replacement", d: "Complete tear-off, new high-temp underlayment and a tile, shingle or metal roof built to take Arizona's sun for decades. Itemized quote, financing available.", slot: "svc-replace", ph: "Replacement photo", src: "uploads/roof-replacement-service-tucson.webp" },
  { tag: "Tile", t: "Tile Roof Replacement & Re-Felt", slug: "tile-roofing", d: "Tile looks fine but leaks? Usually the underlayment is done. We lift the tile, lay new underlayment and set it back, or replace the whole tile roof when it's time.", slot: "svc-tile", ph: "Tile roof photo", src: "uploads/tile-roofing-service-tucson.webp" },
  { tag: "Shingle", t: "Shingle Roof Replacement", slug: "shingle-roofing", d: "Tear-off to the deck, decking repairs, new underlayment and architectural shingles, with the attic ventilation sorted so the new roof lasts.", slot: "svc-shingle", ph: "Shingle roof photo", src: "uploads/shingle-roof-installation-tucson.jpg" },
  { tag: "Metal", t: "Metal Roof Installation", slug: "metal-roofing", d: "Standing-seam metal that bounces the heat and shrugs off monsoons — for Tucson homes and businesses alike.", slot: "svc-metal", ph: "Metal roof photo", src: "uploads/metal-roofing-service-tucson.webp" },
  { tag: "Repairs", t: "Roof Repair", slug: "roof-repair", d: "Leaks, busted flashing, storm damage, cracked tile — we track down what's actually wrong and fix it, and tell you honestly when a roof is past repairing.", slot: "svc-repair", ph: "Roof repair photo", src: "uploads/roof-repair-service-tucson.webp" },
  { tag: "Flat / Commercial", t: "Flat Roofs & Commercial", slug: "flat-roofing", d: "Flat roof replacement, coatings and commercial systems for homes, HOAs, offices and warehouses, scheduled around your hours.", slot: "svc-flat", ph: "Flat roof / coating photo", src: "uploads/flat-roofing-service-tucson.webp" },
];
const svcUrl = (slug) => (window.SUNRISE ? window.SUNRISE.url(slug) : "/" + slug);

function ServiceCardGrid() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="svc-head">
          <div>
            <p className="eyebrow">What We Do</p>
            <h2 className="h2">Roof Replacement Specialists,<br />One Local Crew</h2>
          </div>
          <p className="lead" style={{ maxWidth: 380 }}>
            Most of our work is full tear-offs and new roofs in tile, shingle and metal.
            We'll still tell you straight if yours only needs a repair or a coating —
            but when it's time for a new roof, you want the crew that puts them on every week.
          </p>
        </div>
        <div className="svc-grid">
          {SVC_CARDS.map((c) => (
            <article className="svc-card" key={c.t}>
              <div className="svc-card__media">
                <span className="tag svc-card__tag">{c.tag}</span>
                <Slot id={c.slot} ph={c.ph} alt={`${c.t} in Tucson, AZ — Sunrise Roofers`} radius="0" src={c.src} />
              </div>
              <div className="svc-card__body">
                <h3 className="svc-card__title">{c.t}</h3>
                <p className="svc-card__desc">{c.d}</p>
                <a className="link-arrow" href={svcUrl(c.slug)} aria-label={`Learn more about ${c.t} in Tucson`}>Learn More <Icon name="arrow" /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const WHY = [
  { ic: "check-c", t: "No Hidden Fees", d: "The number I quote you is the number you pay — no surprises waiting at the end." },
  { ic: "search", t: "Free Roof Inspections & Estimates", d: "We don't charge you to climb up and take an honest look at your roof." },
  { ic: "badge", t: "Properly Licensed", d: "Arizona ROC #358079 — bonded, insured, and built to local code." },
  { ic: "shield", t: "GAF-Certified Systems", d: "GAF-certified work with a manufacturer warranty behind every roof we put on." },
  { ic: "sun", t: "Built for the Arizona Sun", d: "We build for our weather — the heat, the UV, and that sideways monsoon rain." },
  { ic: "star", t: "5-Star Rated on Google", d: "A 5.0 rating earned one honest job at a time, from the first look to the final walkthrough." },
];

/* Merged section: folds "Who We Serve", "Local Roofing / Honest Work" and
   "What Sets Us Apart" into one owner-led "Why Choose Us" — crew photo + roof
   backdrop + a clear benefit list (no vanity stats). */
function WhyChooseUs() {
  return (
    <section className="section dark whyx" id="why">
      <div className="whyx__bg" style={{ backgroundImage: "url('uploads/tile-roof-replacement-marana.jpg')" }} aria-hidden="true"></div>
      <div className="whyx__scrim" aria-hidden="true"></div>
      <div className="container about whyx__grid">
        <div className="about__media">
          <Slot id="about-crew" ph="Crew / founder photo" alt="Sunrise Roofers owner-led crew on a roof in Tucson, AZ" radius="16" src="uploads/sunrise-roofers-crew-tucson.webp" />
          <div className="about__badge">
            <div className="n">100%</div>
            <div className="t">Locally owned &amp; operated</div>
          </div>
        </div>
        <div className="about__copy">
          <p className="eyebrow">Why Choose Sunrise Roofers</p>
          <h2 className="h2" style={{ marginBottom: 18 }}>The Local, Owner-Led Difference</h2>
          <p className="whyx__lead">
            A lot of roofing outfits in town are national chains chasing a sales number.
            We're not. We're a family-owned, owner-led Tucson crew — and whether it's a
            full replacement or a stubborn leak, you get a roofer who's done this a
            thousand times and cares about getting it right the first.
          </p>
          <ul className="whyx__list">
            {WHY.map((w) => (
              <li className="whyx__item" key={w.t}>
                <span className="whyx__ic"><Icon name={w.ic} /></span>
                <span className="whyx__txt"><b>{w.t}</b>{w.d}</span>
              </li>
            ))}
          </ul>
          <div className="whyx__cta">
            <a className="btn btn--primary" href="#contact">Get a Free Estimate <Icon name="arrow" /></a>
            <a className="btn btn--on-dark" href="tel:5207531758"><Icon name="phone" /> 520-753-1758</a>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ServiceCardGrid, WhyChooseUs });
