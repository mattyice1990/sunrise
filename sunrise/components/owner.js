(function(){
/* owner.jsx — MeetOwner (name kept so app.js keeps mounting it): the dark
   trust band after About. Same jagged hand-cut "sticker" + comic speech
   bubble, but it now speaks for the crew, not a named owner — the company
   asked (Nov 2026) that the site be team-focused and name no individuals.
   Photo is baked in via Slot src= but stays swappable in the editor. */
function MeetOwner() {
  const POINTS = ["20-plus years on Arizona roofs — roofing's a family trade for us, and our crew has spent its career learning what holds up against our heat and monsoons.", "GAF-certified, and particular about it. We won't put anything up there we wouldn't put on our own houses.", "No commission reps, no closers. You call, you get the people who do the work — usually with our boots still on."];
  return /*#__PURE__*/React.createElement("section", {
    className: "section dark owner",
    id: "owner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container owner__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "owner__media"
  }, /*#__PURE__*/React.createElement("div", {
    className: "owner__bubble"
  }, /*#__PURE__*/React.createElement("p", {
    className: "owner__bubble-hi"
  }, "Mornin'\u2026"), /*#__PURE__*/React.createElement("p", {
    className: "owner__bubble-line"
  }, "We've caught more sunrises up here than on our own porches.")), /*#__PURE__*/React.createElement("div", {
    className: "owner__photo"
  }, /*#__PURE__*/React.createElement(Slot, {
    id: "owner-eddie",
    src: "uploads/roof-installation-tucson.jpg",
    ph: "Crew on a roof",
    alt: "Sunrise Roofers crew working on a roof in Tucson, AZ"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "owner__copy"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "Meet the Team"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "The crew that quotes your roof is the crew that builds it."), /*#__PURE__*/React.createElement("p", {
    className: "owner__lead"
  }, "Sunrise Roofers started because we got tired of watching folks get talked into roofs they didn't need. Roofing's a family trade for us, and our team has spent its career on Arizona rooftops \u2014 learning firsthand what actually holds up against our heat and monsoons. Quick leak or a full tear-off, one of our own roofers comes out to look at it, tells you straight what it needs, and gives you a price that doesn't move. No salesmen, no runaround \u2014 just a local crew that takes every job personally."), /*#__PURE__*/React.createElement("ul", {
    className: "owner__points"
  }, POINTS.map(t => /*#__PURE__*/React.createElement("li", {
    key: t
  }, /*#__PURE__*/React.createElement("span", {
    className: "owner__tick"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check"
  })), /*#__PURE__*/React.createElement("span", null, t)))), /*#__PURE__*/React.createElement("div", {
    className: "owner__foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "owner__roc"
  }, /*#__PURE__*/React.createElement(PlaqueIcon, {
    size: 42
  }), /*#__PURE__*/React.createElement("div", {
    className: "owner__roc-txt"
  }, "Licensed, bonded & insured", /*#__PURE__*/React.createElement("b", null, "ROC #358079"))), /*#__PURE__*/React.createElement("div", {
    className: "owner__cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary",
    href: "#contact"
  }, "Get My Free Estimate ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--on-dark",
    href: "tel:520-753-1758"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " (520) 753-1758"))))));
}
Object.assign(window, {
  MeetOwner
});
})();
