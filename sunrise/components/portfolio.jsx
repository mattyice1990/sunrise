/* portfolio.jsx — reusable Before/After slider, homepage feature, and filterable grid.
   - BACompare      : the draggable before/after slider (reused on home + Projects page)
   - PortfolioFeature: homepage section (one featured slider + "See more recent projects")
   - ProjectsGrid    : the filterable project grid (lives on the Projects page now) */

function BACompare({ beforeSrc, afterSrc, beforeSlot, afterSlot, beforePh, afterPh, height }) {
  const [split, setSplit] = useState(50);
  return (
    <div className="ba" style={{ "--split": split + "%", height: height || undefined }}>
      <div className="ba__layer ba__before"><Slot id={beforeSlot} ph={beforePh || "BEFORE"} radius="0" src={beforeSrc} /></div>
      <div className="ba__layer ba__after"><Slot id={afterSlot} ph={afterPh || "AFTER"} radius="0" src={afterSrc} /></div>
      <span className="ba__lbl ba__lbl--b">Before</span>
      <span className="ba__lbl ba__lbl--a">After</span>
      <div className="ba__handle" style={{ left: split + "%" }}>
        <div className="ba__grip"><Icon name="split" /></div>
      </div>
      <input className="ba__range" type="range" min="0" max="100" value={split}
        onChange={(e) => setSplit(+e.target.value)} aria-label="Drag to compare before and after" />
    </div>
  );
}

/* Homepage: a single featured comparison + a clear path to the full Projects page. */
function PortfolioFeature({ ctaHref, ctaLabel }) {
  const PROJECTS_URL = ctaHref || (window.__projects || "Projects.html");
  return (
    <section className="section" id="portfolio">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Recent Work</p>
          <h2 className="h2">See the Difference, Drag for Drag</h2>
        </div>
        <div className="ba-wrap">
          <BACompare
            beforeSlot="ba-before" afterSlot="ba-after"
            beforePh="BEFORE — worn roof" afterPh="AFTER — new install"
            beforeSrc={(window.__resources && window.__resources.baBefore) || "uploads/Clay%20Tile%20Before.jpg"}
            afterSrc={(window.__resources && window.__resources.baAfter) || "uploads/Concrete%20Tile%20After.jpg"}
          />
          <div className="ba-info">
            <span className="tag" style={{ marginBottom: 14 }}>Featured Project</span>
            <h3 className="pf-card__title" style={{ fontSize: 30 }}>Foothills Tile Roof Replacement</h3>
            <p className="pf-card__loc"><Icon name="pin" /> Catalina Foothills, Tucson</p>
            <p className="pf-card__meta" style={{ marginTop: 10 }}>
              This old clay-tile roof was leaking every monsoon, so we rebuilt it with a new
              <b> concrete tile system</b> over high-temp Polyglass underlayment — refreshing
              the home's look and ending the leaks for good. <b>Drag the slider to compare.</b>
            </p>
            <a className="btn btn--primary btn--sm" href={PROJECTS_URL}>{ctaLabel || "See More Recent Projects"} <Icon name="arrow" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

const FILTERS = ["All Projects", "Metal Roofing", "Tile Roofing", "Shingle Roofing", "Flat & Coatings", "Commercial", "Roof Repairs"];
const PROJECTS = [
  { cat: "Metal Roofing", t: "Standing-Seam Ranch Reroof", loc: "Oro Valley", sys: "24-ga standing-seam metal", prob: "Aging shingles failing under UV; upgraded to a 40-year metal system.", slot: "pf1", src: "uploads/aerial-metal.jpg", ph: "Metal roof project" },
  { cat: "Tile Roofing", t: "Concrete Tile Re-Felt", loc: "Sahuarita", sys: "Tile lift & new underlayment", prob: "Original 1998 underlayment cracked; tiles salvaged and re-laid.", slot: "pf2", src: "uploads/pf-tile-refelt.jpg", ph: "Tile roof project" },
  { cat: "Flat & Coatings", t: "Foam Roof Recoat", loc: "Midtown Tucson", sys: "SPF foam + elastomeric coat", prob: "Ponding water and blisters sealed with a fresh foam-and-coat system.", slot: "pf3", src: "uploads/pf-foam-recoat.jpg", ph: "Foam / flat roof project" },
  { cat: "Commercial", t: "Retail Plaza TPO System", loc: "East Tucson", sys: "60-mil TPO membrane", prob: "Leaking built-up roof replaced with no disruption to open storefronts.", slot: "pf4", src: "uploads/pf-flat-tpo.jpg", ph: "Commercial roof project" },
  { cat: "Shingle Roofing", t: "Architectural Shingle Reroof", loc: "Marana", sys: "Class-4 impact shingles", prob: "Storm-damaged roof rebuilt with impact-rated architectural shingles.", slot: "pf5", src: "uploads/pf-shingle.jpg", ph: "Shingle roof project" },
  { cat: "Roof Repairs", t: "Monsoon Leak Repair", loc: "Vail", sys: "Flashing & valley rebuild", prob: "Emergency leak traced to failed valley flashing; repaired in one visit.", slot: "pf6", src: "uploads/pf-repair.jpg", ph: "Repair project" },
  { cat: "Metal Roofing", t: "Modern Home Metal Accent", loc: "Catalina Foothills", sys: "Mixed metal & flat", prob: "New-build roofline combining metal slopes with a coated flat section.", slot: "pf7", src: "uploads/pf-metal.jpg", ph: "Metal accent project" },
  { cat: "Commercial", t: "Warehouse Coating Restoration", loc: "South Tucson", sys: "Silicone restoration coat", prob: "30,000 sq ft warehouse roof restored without a costly tear-off.", slot: "pf8", src: "uploads/pf-warehouse-coat.jpg", ph: "Warehouse roof project" },
  { cat: "Tile Roofing", t: "Clay Tile Repair & Match", loc: "Civano", sys: "Clay tile repair", prob: "Cracked tiles replaced with period-matched clay after a wind event.", slot: "pf9", src: "uploads/pf-clay-repair.jpg", ph: "Clay tile project" },
];

function ProjectsGrid() {
  const [active, setActive] = useState("All Projects");
  const shown = active === "All Projects" ? PROJECTS : PROJECTS.filter((p) => p.cat === active);
  return (
    <section className="section" id="all-projects">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">The Full Portfolio</p>
          <h2 className="h2">Roofing Projects Across Tucson</h2>
        </div>
        <div className="pf-filters">
          {FILTERS.map((f) => (
            <button key={f} className={"pf-filter" + (active === f ? " is-active" : "")} onClick={() => setActive(f)}>{f}</button>
          ))}
        </div>
        <div className="pf-grid">
          {shown.map((p) => (
            <article className="pf-card" key={p.t}>
              <div className="pf-card__media">
                <div className="pf-card__tags">
                  <span className="pf-pill pf-pill--terra">{p.cat}</span>
                  <span className="pf-pill">{p.sys}</span>
                </div>
                <Slot id={p.slot} src={p.src} ph={p.ph} radius="0" />
              </div>
              <div className="pf-card__body">
                <p className="pf-card__loc"><Icon name="pin" /> {p.loc}, AZ</p>
                <h3 className="pf-card__title">{p.t}</h3>
                <p className="pf-card__meta">{p.prob}</p>
                <a className="link-arrow" href="#contact">See Project <Icon name="arrow" /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { BACompare, PortfolioFeature, ProjectsGrid, PROJECTS, FILTERS });
