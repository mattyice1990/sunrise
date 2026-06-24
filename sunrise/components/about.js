(function(){
/* about.jsx — AboutSection (+ stats) + ProcessSteps */

const STATS = [{
  n: "20+",
  l: "Years of roofing experience"
}, {
  n: "5.0★",
  l: "Rated across 41 Google reviews"
}, {
  n: "ROC #358079",
  l: "Licensed, bonded & insured"
}, {
  n: "GAF",
  l: "Certified roofing contractor"
}];
function AboutSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "about"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container about"
  }, /*#__PURE__*/React.createElement("div", {
    className: "about__media"
  }, /*#__PURE__*/React.createElement(Slot, {
    id: "about-crew",
    src: "uploads/sunrise-crew.webp",
    ph: "Crew / founder photo",
    alt: "Sunrise Roofers family-owned crew in Tucson, AZ",
    radius: "16"
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
  }, "Local Roofing. Honest Work."), /*#__PURE__*/React.createElement("h2", {
    className: "h2",
    style: {
      marginBottom: 22
    }
  }, "The Kind of Roof You Stop Thinking About"), /*#__PURE__*/React.createElement("p", null, "We keep it simple around here: do the job right, tell you the truth, and leave you with a roof you don't have to think about anymore. That's the whole plan."), /*#__PURE__*/React.createElement("p", null, "Small leak or a whole new roof, we treat your place like it's our own — because for the next 20 years you're trusting it to keep the rain off your family. No storm-chasers knocking after a monsoon, no pressure. Just solid work and somebody who actually picks up when you call."), /*#__PURE__*/React.createElement("div", {
    className: "stats"
  }, STATS.map(s => /*#__PURE__*/React.createElement("div", {
    className: "stat-card",
    key: s.l
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, s.n), /*#__PURE__*/React.createElement("div", {
    className: "l"
  }, s.l)))))));
}
const STEPS = [{
  ic: "search",
  t: "Schedule a Roof Inspection",
  d: "We get up there, find everything that's wrong, and document it all with photos so you can see it too."
}, {
  ic: "doc",
  t: "Get a Clear Estimate",
  d: "You get repair or replacement options in plain English, priced line by line, with nothing buried in the fine print."
}, {
  ic: "shield",
  t: "Protect Your Property",
  d: "Our crew does the work clean, safe and on schedule, then walks the whole thing with you when it's done."
}];
function ProcessSteps() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section deep"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow eyebrow--center"
  }, "How To Get Started"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Three Simple Steps to a Better Roof")), /*#__PURE__*/React.createElement("div", {
    className: "process"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proc-connect"
  }), STEPS.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "proc-step",
    key: s.t
  }, /*#__PURE__*/React.createElement("div", {
    className: "proc-step__num"
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
    className: "proc-step__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.ic
  })), /*#__PURE__*/React.createElement("h3", null, s.t), /*#__PURE__*/React.createElement("p", null, s.d)))), /*#__PURE__*/React.createElement("div", {
    className: "process-cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary",
    href: "#contact"
  }, "Schedule My Roof Inspection ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })))));
}
Object.assign(window, {
  AboutSection,
  ProcessSteps
});
})();
