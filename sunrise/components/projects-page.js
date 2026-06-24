(function(){
/* projects-page.jsx — the standalone Projects page body.
   Reuses BACompare + ProjectsGrid from portfolio.jsx and the shared
   nav / footer / chat. Renders into #root via projects-app.jsx. */

const HOME_HREF = window.__home || "";
const contactHref = HOME_HREF + "#contact";

/* Recent finished-roof showcase (real drone aerials). The page's featured
   before/after slider above carries the one matched before/after pair. */
const BA_GALLERY = [{
  t: "Standing-Seam Metal Reroof",
  loc: "Oro Valley",
  sys: "24-ga Standing Seam",
  slot: "recent-metal",
  src: "uploads/aerial-metal.jpg"
}, {
  t: "Flat Roof Coating & Restoration",
  loc: "Midtown Tucson",
  sys: "Foam + Elastomeric Coat",
  slot: "recent-flat",
  src: "uploads/aerial-commercial.jpg"
}, {
  t: "Concrete Tile Roof Replacement",
  loc: "Catalina Foothills",
  sys: "Tile Lift & New Underlayment",
  slot: "recent-tile",
  src: "uploads/aerial-home.jpg"
}];
function ProjectsHero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "page-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "crumbs",
    "aria-label": "Breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    href: HOME_HREF || "#top"
  }, "Home"), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  }), /*#__PURE__*/React.createElement("span", null, "Projects")), /*#__PURE__*/React.createElement("p", {
    className: "eyebrow page-hero__eyebrow"
  }, "Our Recent Work"), /*#__PURE__*/React.createElement("h1", {
    className: "h-display page-hero__title"
  }, "Tucson Roofing Projects & ", /*#__PURE__*/React.createElement("em", null, "Before / After")), /*#__PURE__*/React.createElement("p", {
    className: "page-hero__body"
  }, "Drag any slider and watch the before turn into the after, then look through the whole lineup of repairs, replacements, metal, tile, flat and commercial roofs we've done across Tucson and Pima County."), /*#__PURE__*/React.createElement("div", {
    className: "page-hero__cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary",
    href: contactHref
  }, "Get a Free Roof Estimate ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--on-dark",
    href: "#all-projects"
  }, "Browse All Projects"))));
}
function BAGallery() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "before-after"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "Recent Work"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "More Tucson Roofs We’ve Finished")), /*#__PURE__*/React.createElement("div", {
    className: "ba-gallery"
  }, BA_GALLERY.map(g => /*#__PURE__*/React.createElement("article", {
    className: "pf-card",
    key: g.slot
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-card__media"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pf-card__tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pf-pill pf-pill--terra"
  }, g.sys)), /*#__PURE__*/React.createElement(Slot, {
    id: g.slot,
    ph: g.t,
    radius: "0",
    src: g.src
  })), /*#__PURE__*/React.createElement("div", {
    className: "pf-card__body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pf-card__loc"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin"
  }), " ", g.loc, ", AZ"), /*#__PURE__*/React.createElement("h3", {
    className: "pf-card__title"
  }, g.t)))))));
}
function ProjectsCTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "proj-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container proj-cta__in"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "h2",
    style: {
      marginBottom: 10
    }
  }, "Want your roof to be our next project?"), /*#__PURE__*/React.createElement("p", {
    className: "lead",
    style: {
      maxWidth: 540
    }
  }, "Free, fully-documented inspections all over Tucson, honest options, no pressure.")), /*#__PURE__*/React.createElement("div", {
    className: "proj-cta__btns"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary",
    href: contactHref
  }, "Free Roof Estimate ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--on-dark",
    href: "tel:5207531758"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " 520-753-1758"))));
}
function ProjectsPage() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, null), /*#__PURE__*/React.createElement(HeaderNav, null), /*#__PURE__*/React.createElement("main", {
    className: "projects-main"
  }, /*#__PURE__*/React.createElement(ProjectsHero, null), /*#__PURE__*/React.createElement(PortfolioFeature, {
    ctaHref: "#all-projects",
    ctaLabel: "Browse All Projects"
  }), /*#__PURE__*/React.createElement(BAGallery, null), /*#__PURE__*/React.createElement(ProjectsGrid, null), /*#__PURE__*/React.createElement(ProjectsCTA, null)), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  ProjectsPage
});
})();
