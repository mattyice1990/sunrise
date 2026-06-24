(function(){
/* property.jsx — PropertyTypeSection (interactive tabs, dark) */

const PROP_DATA = [{
  ic: "home",
  t: "Homeowners",
  h: "Protect Your Home & Your Budget",
  p: "From a surprise leak to a roof that's just plain done, we give homeowners honest answers and clear options, never a sales pitch.",
  b: ["Free, fully-documented roof inspections", "Repair-first guidance to avoid premature replacement", "Energy-efficient metal & tile upgrades for AZ heat", "Flexible financing on approved credit"],
  slot: "prop-home",
  src: "uploads/aerial-home.jpg"
}, {
  ic: "users",
  t: "HOAs & Property Managers",
  h: "Roofing That Keeps Boards & Residents Happy",
  p: "We take the guesswork out of multi-unit roofing, clear scheduling, clean paperwork, and one person who's accountable across every building.",
  b: ["Phased scheduling across multiple units", "Detailed service logs & condition reports", "Budget planning & reserve-study support", "Proactive maintenance to extend roof life"],
  slot: "prop-hoa",
  src: "uploads/prop-hoa.webp"
}, {
  ic: "building",
  t: "Commercial Buildings",
  h: "Low-Disruption Commercial Roofing",
  p: "Offices and facilities need a roof that protects what goes on under it. We work around your hours and keep the building dry and running.",
  b: ["Flat-roof coatings & restoration vs. tear-off", "Leak prevention & drainage correction", "Scheduled maintenance programs", "Emergency response for active leaks"],
  slot: "prop-comm",
  src: "uploads/aerial-commercial.jpg"
}, {
  ic: "factory",
  t: "Multi-Family Communities",
  h: "Safe, Phased Roofing for Residents",
  p: "Apartments and condos take real coordination. We keep tenants safe and stay out of everyone's way across big roof areas.",
  b: ["Phased roofing to keep units occupied", "Tenant-safety planning & site protection", "Rapid monsoon-damage response", "Preventative maintenance contracts"],
  slot: "prop-multi",
  src: "uploads/prop-multi.jpg"
}, {
  ic: "store",
  t: "Retail Centers & Plazas",
  h: "Keep Every Storefront Open",
  p: "Retail roofing can't shut stores down. We schedule and stage the work so customers keep coming and tenants stay happy.",
  b: ["Work staged to keep stores open", "Minimized noise & disruption windows", "Drainage & ponding-water solutions", "Fast leak response for tenants"],
  slot: "prop-retail",
  src: "uploads/prop-retail.jpg"
}, {
  ic: "truck",
  t: "New Construction",
  h: "Clean Roofing Handoffs for Builders",
  p: "Developers and GCs get a roofer who hits the schedule, works off the plans, and hands over a clean, inspected roof.",
  b: ["On-time coordination with the build schedule", "Plan & material spec coordination", "Inspections & code compliance", "Clean handoff & warranty documentation"],
  slot: "prop-new",
  src: "uploads/prop-new.webp"
}];
function PropertyTypeSection() {
  const [i, setI] = useState(0);
  const d = PROP_DATA[i];
  return /*#__PURE__*/React.createElement("section", {
    className: "section dark prop-sec",
    id: "property"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prop-sec__bg",
    style: {
      backgroundImage: "url('uploads/Tile%20Roof%20Replacement%20in%20Marana.jpg')"
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "prop-sec__scrim",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "Who We Serve"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Roofing Built Around Your Property"), /*#__PURE__*/React.createElement("p", {
    className: "lead",
    style: {
      marginTop: 16
    }
  }, "We talk to every kind of property owner in their own terms, because a homeowner's leak and a 40-unit reroof are two very different jobs.")), /*#__PURE__*/React.createElement("div", {
    className: "prop"
  }, /*#__PURE__*/React.createElement("div", {
    className: "prop__list"
  }, PROP_DATA.map((x, idx) => /*#__PURE__*/React.createElement("button", {
    key: x.t,
    className: "prop__tab" + (idx === i ? " is-active" : ""),
    onClick: () => setI(idx)
  }, /*#__PURE__*/React.createElement("span", {
    className: "pic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: x.ic
  })), /*#__PURE__*/React.createElement("span", {
    className: "pt"
  }, x.t)))), /*#__PURE__*/React.createElement("div", {
    className: "prop__panel",
    key: i
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, d.h), /*#__PURE__*/React.createElement("p", null, d.p), /*#__PURE__*/React.createElement("div", {
    className: "prop__bullets"
  }, d.b.map(b => /*#__PURE__*/React.createElement("div", {
    className: "prop__bullet",
    key: b
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-c"
  }), " ", /*#__PURE__*/React.createElement("span", null, b)))), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary btn--sm",
    href: "#contact"
  }, "Talk to Us About ", d.t, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "prop__media"
  }, /*#__PURE__*/React.createElement(Slot, {
    id: d.slot,
    src: d.src,
    ph: d.t + " photo",
    alt: `Roofing for ${d.t.toLowerCase()} in Tucson, AZ — Sunrise Roofers`,
    radius: "10"
  }))))));
}
Object.assign(window, {
  PropertyTypeSection
});
})();
