(function(){
/* owner.jsx — MeetOwner: the primary founder section, now built around the
   jagged hand-cut "sticker" of Eddie + a comic speech bubble (moved down from the
   old post-hero peek) PLUS the real blurb about who Eddie is. Dark band placed
   after About so Eddie anchors the homepage's trust story. Photo is baked in via
   Slot src= but stays swappable in the editor. */
function MeetOwner() {
  const POINTS = ["20-plus years on Arizona roofs — roofing's a family trade for us, and I've spent my career learning what holds up against our heat and monsoons.", "GAF-certified, and particular about it. I won't put anything up there I wouldn't put on my own house.", "No commission reps, no closers. You call, you get me — usually with my boots still on."];
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
  }, "Mornin'…"), /*#__PURE__*/React.createElement("p", {
    className: "owner__bubble-line"
  }, "Caught more sunrises up here than on my own porch.")), /*#__PURE__*/React.createElement("div", {
    className: "owner__photo"
  }, /*#__PURE__*/React.createElement(Slot, {
    id: "owner-eddie",
    src: "uploads/Roof%20Installation_edited.jpg",
    ph: "Eddie on a roof",
    alt: "Eddie Guillen, owner of Sunrise Roofers, working on a roof in Tucson, AZ"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "owner__copy"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "Meet the Owner"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Hi, I'm Eddie — I'll be the one up on your roof."), /*#__PURE__*/React.createElement("p", {
    className: "owner__lead"
  }, "I started Sunrise Roofers because I got tired of watching folks get talked into roofs they didn't need. Roofing's a family trade for us, and I've spent my career on Arizona rooftops — learning firsthand what actually holds up against our heat and monsoons. Quick leak or a full tear-off, I'll come look at it myself, tell you straight what it needs, and give you a price that doesn't move. No salesmen, no runaround — just me and a crew that takes every job personally."), /*#__PURE__*/React.createElement("ul", {
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
