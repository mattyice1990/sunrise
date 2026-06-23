/* projects-page.jsx — the standalone Projects page body.
   Reuses BACompare + ProjectsGrid from portfolio.jsx and the shared
   nav / footer / chat. Renders into #root via projects-app.jsx. */

const HOME_HREF = window.__home || "";
const contactHref = HOME_HREF + "#contact";

/* Recent finished-roof showcase (real drone aerials). The page's featured
   before/after slider above carries the one matched before/after pair. */
const BA_GALLERY = [
  { t: "Standing-Seam Metal Reroof", loc: "Oro Valley", sys: "24-ga Standing Seam", slot: "recent-metal", src: "uploads/aerial-metal.jpg" },
  { t: "Flat Roof Coating & Restoration", loc: "Midtown Tucson", sys: "Foam + Elastomeric Coat", slot: "recent-flat", src: "uploads/aerial-commercial.jpg" },
  { t: "Concrete Tile Roof Replacement", loc: "Catalina Foothills", sys: "Tile Lift & New Underlayment", slot: "recent-tile", src: "uploads/aerial-home.jpg" },
];

function ProjectsHero() {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href={HOME_HREF || "#top"}>Home</a>
          <Icon name="arrow" />
          <span>Projects</span>
        </nav>
        <p className="eyebrow page-hero__eyebrow">Our Recent Work</p>
        <h1 className="h-display page-hero__title">Tucson Roofing Projects &amp; <em>Before / After</em></h1>
        <p className="page-hero__body">
          Drag any slider and watch the before turn into the after, then look through the whole
          lineup of repairs, replacements, metal, tile, flat and commercial roofs
          we've done across Tucson and Pima County.
        </p>
        <div className="page-hero__cta">
          <a className="btn btn--primary" href={contactHref}>Get a Free Roof Estimate <Icon name="arrow" /></a>
          <a className="btn btn--on-dark" href="#all-projects">Browse All Projects</a>
        </div>
      </div>
    </section>
  );
}

function BAGallery() {
  return (
    <section className="section" id="before-after">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Recent Work</p>
          <h2 className="h2">More Tucson Roofs We&rsquo;ve Finished</h2>
        </div>
        <div className="ba-gallery">
          {BA_GALLERY.map((g) => (
            <article className="pf-card" key={g.slot}>
              <div className="pf-card__media">
                <div className="pf-card__tags"><span className="pf-pill pf-pill--terra">{g.sys}</span></div>
                <Slot id={g.slot} ph={g.t} radius="0" src={g.src} />
              </div>
              <div className="pf-card__body">
                <p className="pf-card__loc"><Icon name="pin" /> {g.loc}, AZ</p>
                <h3 className="pf-card__title">{g.t}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsCTA() {
  return (
    <section className="proj-cta">
      <div className="container proj-cta__in">
        <div>
          <h2 className="h2" style={{ marginBottom: 10 }}>Want your roof to be our next project?</h2>
          <p className="lead" style={{ maxWidth: 540 }}>Free, fully-documented inspections all over Tucson, honest options, no pressure.</p>
        </div>
        <div className="proj-cta__btns">
          <a className="btn btn--primary" href={contactHref}>Free Roof Estimate <Icon name="arrow" /></a>
          <a className="btn btn--on-dark" href="tel:5207531758"><Icon name="phone" /> 520-753-1758</a>
        </div>
      </div>
    </section>
  );
}

function ProjectsPage() {
  return (
    <React.Fragment>
      <TopBar />
      <HeaderNav />
      <main className="projects-main">
        <ProjectsHero />
        <PortfolioFeature ctaHref="#all-projects" ctaLabel="Browse All Projects" />
        <BAGallery />
        <ProjectsGrid />
        <ProjectsCTA />
      </main>
      <Footer />
      <ChatWidget />
    </React.Fragment>
  );
}

Object.assign(window, { ProjectsPage });
