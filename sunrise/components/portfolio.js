(function(){
/* portfolio.jsx — reusable Before/After slider, homepage feature, and filterable grid.
   - BACompare      : the draggable before/after slider (reused on home + Projects page)
   - PortfolioFeature: homepage section (one featured slider + "See more recent projects")
   - ProjectsGrid    : the filterable project grid (lives on the Projects page now) */

function BACompare({
  beforeSrc,
  afterSrc,
  beforeSlot,
  afterSlot,
  beforePh,
  afterPh,
  beforeAlt,
  afterAlt,
  height
}) {
  const [split, setSplit] = useState(50);
  return /*#__PURE__*/React.createElement("div", {
    className: "ba",
    style: {
      "--split": split + "%",
      height: height || undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ba__layer ba__before"
  }, /*#__PURE__*/React.createElement(Slot, {
    id: beforeSlot,
    ph: beforePh || "BEFORE",
    alt: beforeAlt,
    radius: "0",
    src: beforeSrc
  })), /*#__PURE__*/React.createElement("div", {
    className: "ba__layer ba__after"
  }, /*#__PURE__*/React.createElement(Slot, {
    id: afterSlot,
    ph: afterPh || "AFTER",
    alt: afterAlt,
    radius: "0",
    src: afterSrc
  })), /*#__PURE__*/React.createElement("span", {
    className: "ba__lbl ba__lbl--b"
  }, "Before"), /*#__PURE__*/React.createElement("span", {
    className: "ba__lbl ba__lbl--a"
  }, "After"), /*#__PURE__*/React.createElement("div", {
    className: "ba__handle",
    style: {
      left: split + "%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ba__grip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "split"
  }))), /*#__PURE__*/React.createElement("input", {
    className: "ba__range",
    type: "range",
    min: "0",
    max: "100",
    value: split,
    onChange: e => setSplit(+e.target.value),
    "aria-label": "Drag to compare before and after"
  }));
}

/* Homepage: a single featured comparison + a clear path to the full Projects page. */
function PortfolioFeature({
  ctaHref,
  ctaLabel
}) {
  const PROJECTS_URL = ctaHref || window.__projects || "Projects.html";
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "portfolio"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "Recent Work"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "See the Difference, Drag for Drag")), /*#__PURE__*/React.createElement("div", {
    className: "ba-wrap"
  }, /*#__PURE__*/React.createElement(BACompare, {
    beforeSlot: "ba-before",
    afterSlot: "ba-after",
    beforePh: "BEFORE — worn roof",
    afterPh: "AFTER — new install",
    beforeAlt: "Worn, leaking clay tile roof before replacement — Catalina Foothills, Tucson AZ",
    afterAlt: "New concrete tile roof after replacement by Sunrise Roofers — Catalina Foothills, Tucson AZ",
    beforeSrc: window.__resources && window.__resources.baBefore || "uploads/Clay%20Tile%20Before.jpg",
    afterSrc: window.__resources && window.__resources.baAfter || "uploads/Concrete%20Tile%20After.jpg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ba-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      marginBottom: 14
    }
  }, "Featured Project"), /*#__PURE__*/React.createElement("h3", {
    className: "pf-card__title",
    style: {
      fontSize: 30
    }
  }, "Foothills Tile Roof Replacement"), /*#__PURE__*/React.createElement("p", {
    className: "pf-card__loc"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin"
  }), " Catalina Foothills, Tucson"), /*#__PURE__*/React.createElement("p", {
    className: "pf-card__meta",
    style: {
      marginTop: 10
    }
  }, "This old clay-tile roof was leaking every monsoon, so we rebuilt it with a new", /*#__PURE__*/React.createElement("b", null, " concrete tile system"), " over high-temp Polyglass underlayment — refreshing the home's look and ending the leaks for good. ", /*#__PURE__*/React.createElement("b", null, "Drag the slider to compare.")), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary btn--sm",
    href: PROJECTS_URL
  }, ctaLabel || "See More Recent Projects", " ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  }))))));
}
const FILTERS = ["All Projects", "Metal Roofing", "Tile Roofing", "Shingle Roofing", "Flat & Coatings", "Commercial", "Roof Repairs"];
const PROJECTS = [{
  cat: "Metal Roofing",
  t: "Standing-Seam Ranch Reroof",
  loc: "Oro Valley",
  sys: "24-ga standing-seam metal",
  prob: "Aging shingles failing under UV; upgraded to a 40-year metal system.",
  slot: "pf1",
  src: "uploads/aerial-metal.jpg",
  ph: "Metal roof project"
}, {
  cat: "Tile Roofing",
  t: "Concrete Tile Re-Felt",
  loc: "Sahuarita",
  sys: "Tile lift & new underlayment",
  prob: "Original 1998 underlayment cracked; tiles salvaged and re-laid.",
  slot: "pf2",
  src: "uploads/pf-tile-refelt.jpg",
  ph: "Tile roof project"
}, {
  cat: "Flat & Coatings",
  t: "Foam Roof Recoat",
  loc: "Midtown Tucson",
  sys: "SPF foam + elastomeric coat",
  prob: "Ponding water and blisters sealed with a fresh foam-and-coat system.",
  slot: "pf3",
  src: "uploads/pf-foam-recoat.jpg",
  ph: "Foam / flat roof project"
}, {
  cat: "Commercial",
  t: "Retail Plaza TPO System",
  loc: "East Tucson",
  sys: "60-mil TPO membrane",
  prob: "Leaking built-up roof replaced with no disruption to open storefronts.",
  slot: "pf4",
  src: "uploads/pf-flat-tpo.jpg",
  ph: "Commercial roof project"
}, {
  cat: "Shingle Roofing",
  t: "Architectural Shingle Reroof",
  loc: "Marana",
  sys: "Class-4 impact shingles",
  prob: "Storm-damaged roof rebuilt with impact-rated architectural shingles.",
  slot: "pf5",
  src: "uploads/pf-shingle.jpg",
  ph: "Shingle roof project"
}, {
  cat: "Roof Repairs",
  t: "Monsoon Leak Repair",
  loc: "Vail",
  sys: "Flashing & valley rebuild",
  prob: "Emergency leak traced to failed valley flashing; repaired in one visit.",
  slot: "pf6",
  src: "uploads/pf-repair.jpg",
  ph: "Repair project"
}, {
  cat: "Metal Roofing",
  t: "Modern Home Metal Accent",
  loc: "Catalina Foothills",
  sys: "Mixed metal & flat",
  prob: "New-build roofline combining metal slopes with a coated flat section.",
  slot: "pf7",
  src: "uploads/pf-metal.jpg",
  ph: "Metal accent project"
}, {
  cat: "Commercial",
  t: "Warehouse Coating Restoration",
  loc: "South Tucson",
  sys: "Silicone restoration coat",
  prob: "30,000 sq ft warehouse roof restored without a costly tear-off.",
  slot: "pf8",
  src: "uploads/pf-warehouse-coat.jpg",
  ph: "Warehouse roof project"
}, {
  cat: "Tile Roofing",
  t: "Clay Tile Repair & Match",
  loc: "Civano",
  sys: "Clay tile repair",
  prob: "Cracked tiles replaced with period-matched clay after a wind event.",
  slot: "pf9",
  src: "uploads/pf-clay-repair.jpg",
  ph: "Clay tile project"
}];
function ProjectsGrid() {
  const [active, setActive] = useState("All Projects");
  const shown = active === "All Projects" ? PROJECTS : PROJECTS.filter(p => p.cat === active);
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "all-projects"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "The Full Portfolio"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Roofing Projects Across Tucson")), /*#__PURE__*/React.createElement("div", {
    className: "pf-filters"
  }, FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    className: "pf-filter" + (active === f ? " is-active" : ""),
    onClick: () => setActive(f)
  }, f))), /*#__PURE__*/React.createElement("div", {
    className: "pf-grid"
  }, shown.map(p => /*#__PURE__*/React.createElement("article", {
    className: "pf-card",
    key: p.t
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-card__media"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-card__tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-pill pf-pill--terra"
  }, p.cat), /*#__PURE__*/React.createElement("span", {
    className: "pf-pill"
  }, p.sys)), /*#__PURE__*/React.createElement(Slot, {
    id: p.slot,
    src: p.src,
    ph: p.ph,
    alt: `${p.t} in ${p.loc}, AZ — ${p.sys} by Sunrise Roofers`,
    radius: "0"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-card__body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pf-card__loc"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin"
  }), " ", p.loc, ", AZ"), /*#__PURE__*/React.createElement("h3", {
    className: "pf-card__title"
  }, p.t), /*#__PURE__*/React.createElement("p", {
    className: "pf-card__meta"
  }, p.prob), /*#__PURE__*/React.createElement("a", {
    className: "link-arrow",
    href: "#contact"
  }, "See Project ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  }))))))));
}
Object.assign(window, {
  BACompare,
  PortfolioFeature,
  ProjectsGrid,
  PROJECTS,
  FILTERS
});
})();
