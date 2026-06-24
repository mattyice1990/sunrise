(function(){
/* services.jsx — ServiceCardGrid + WhyChooseUs */

const SVC_CARDS = [{
  tag: "Repairs",
  t: "Roof Repair",
  slug: "roof-repair",
  d: "Leaks, busted flashing, storm damage, cracked tile — we track down what's actually wrong and fix it fast.",
  slot: "svc-repair",
  ph: "Roof repair photo",
  src: "uploads/svc-repair.webp"
}, {
  tag: "Replacement",
  t: "Roof Replacement",
  slug: "roof-replacement",
  d: "Full tear-offs and new roofs built to take Arizona's sun and last decades, not just a few seasons.",
  slot: "svc-replace",
  ph: "Replacement photo",
  src: "uploads/svc-replace.webp"
}, {
  tag: "Metal",
  t: "Metal Roof Installation",
  slug: "metal-roofing",
  d: "Standing-seam metal that bounces the heat and shrugs off monsoons — for Tucson homes and businesses alike.",
  slot: "svc-metal",
  ph: "Metal roof photo",
  src: "uploads/svc-metal.webp"
}, {
  tag: "Tile",
  t: "Tile Roofing",
  slug: "tile-roofing",
  d: "Concrete and clay tile — repairs, re-felts, new underlayment, and upkeep that keeps it watertight.",
  slot: "svc-tile",
  ph: "Tile roof photo",
  src: "uploads/svc-tile.webp"
}, {
  tag: "Flat / Foam",
  t: "Flat Roof & Coatings",
  slug: "flat-roofing",
  d: "Foam roofs, elastomeric coatings, and fixing the spots where water pools before they turn into leaks.",
  slot: "svc-flat",
  ph: "Flat roof / coating photo",
  src: "uploads/svc-flat.webp"
}, {
  tag: "Commercial",
  t: "Commercial Roofing",
  slug: "commercial-roofing",
  d: "Offices, retail, warehouses and multi-family — roofs we work around your hours, not the other way around.",
  slot: "svc-comm",
  ph: "Commercial roof photo",
  src: "uploads/svc-comm.webp"
}];
const svcUrl = slug => window.SUNRISE ? window.SUNRISE.url(slug) : "/" + slug;
function ServiceCardGrid() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "services"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "What We Do"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Complete Roofing Services,", /*#__PURE__*/React.createElement("br", null), "One Local Crew")), /*#__PURE__*/React.createElement("p", {
    className: "lead",
    style: {
      maxWidth: 380
    }
  }, "No two roofs are the same. We'll give it to you straight and point you to what yours actually needs — a repair, a coating, or a full replacement — not whatever rings up the biggest.")), /*#__PURE__*/React.createElement("div", {
    className: "svc-grid"
  }, SVC_CARDS.map(c => /*#__PURE__*/React.createElement("article", {
    className: "svc-card",
    key: c.t
  }, /*#__PURE__*/React.createElement("div", {
    className: "svc-card__media"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag svc-card__tag"
  }, c.tag), /*#__PURE__*/React.createElement(Slot, {
    id: c.slot,
    ph: c.ph,
    alt: `${c.t} in Tucson, AZ — Sunrise Roofers`,
    radius: "0",
    src: c.src
  })), /*#__PURE__*/React.createElement("div", {
    className: "svc-card__body"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "svc-card__title"
  }, c.t), /*#__PURE__*/React.createElement("p", {
    className: "svc-card__desc"
  }, c.d), /*#__PURE__*/React.createElement("a", {
    className: "link-arrow",
    href: svcUrl(c.slug)
  }, "Learn More ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  }))))))));
}
const WHY = [{
  ic: "check-c",
  t: "No Hidden Fees",
  d: "The number I quote you is the number you pay — no surprises waiting at the end."
}, {
  ic: "search",
  t: "Free Roof Inspections & Estimates",
  d: "We don't charge you to climb up and take an honest look at your roof."
}, {
  ic: "badge",
  t: "Properly Licensed",
  d: "Arizona ROC #358079 — bonded, insured, and built to local code."
}, {
  ic: "shield",
  t: "GAF-Certified Systems",
  d: "GAF-certified work with a manufacturer warranty behind every roof we put on."
}, {
  ic: "sun",
  t: "Built for the Arizona Sun",
  d: "We build for our weather — the heat, the UV, and that sideways monsoon rain."
}, {
  ic: "star",
  t: "5-Star Rated on Google",
  d: "A 5.0 rating earned one honest job at a time, from the first look to the final walkthrough."
}];

/* Merged section: folds "Who We Serve", "Local Roofing / Honest Work" and
   "What Sets Us Apart" into one owner-led "Why Choose Us" — crew photo + roof
   backdrop + a clear benefit list (no vanity stats). */
function WhyChooseUs() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section dark whyx",
    id: "why"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyx__bg",
    style: {
      backgroundImage: "url('uploads/Tile%20Roof%20Replacement%20in%20Marana.jpg')"
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "whyx__scrim",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container about whyx__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "about__media"
  }, /*#__PURE__*/React.createElement(Slot, {
    id: "about-crew",
    ph: "Crew / founder photo",
    alt: "Sunrise Roofers owner-led crew on a roof in Tucson, AZ",
    radius: "16",
    src: "uploads/about-crew.webp"
  }), /*#__PURE__*/React.createElement("div", {
    className: "about__badge"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, "100%"), /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, "Locally owned & operated"))), /*#__PURE__*/React.createElement("div", {
    className: "about__copy"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "Why Choose Sunrise Roofers"), /*#__PURE__*/React.createElement("h2", {
    className: "h2",
    style: {
      marginBottom: 18
    }
  }, "The Local, Owner-Led Difference"), /*#__PURE__*/React.createElement("p", {
    className: "whyx__lead"
  }, "A lot of roofing outfits in town are national chains chasing a sales number. We're not. We're a family-owned, owner-led Tucson crew — and whether it's a simple leak or a full replacement, you get a roofer who's done this a thousand times and cares about getting it right the first."), /*#__PURE__*/React.createElement("ul", {
    className: "whyx__list"
  }, WHY.map(w => /*#__PURE__*/React.createElement("li", {
    className: "whyx__item",
    key: w.t
  }, /*#__PURE__*/React.createElement("span", {
    className: "whyx__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: w.ic
  })), /*#__PURE__*/React.createElement("span", {
    className: "whyx__txt"
  }, /*#__PURE__*/React.createElement("b", null, w.t), w.d)))), /*#__PURE__*/React.createElement("div", {
    className: "whyx__cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary",
    href: "#contact"
  }, "Get a Free Estimate ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--on-dark",
    href: "tel:5207531758"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " 520-753-1758")))));
}
Object.assign(window, {
  ServiceCardGrid,
  WhyChooseUs
});
})();
