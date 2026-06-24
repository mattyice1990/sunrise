(function(){
/* contact.jsx — ContactForm (validation + success) + Footer */

function Field({
  k,
  label,
  type = "text",
  req,
  full,
  ph,
  value,
  onChange,
  err
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "field" + (full ? " field--full" : "") + (err ? " has-error" : "")
  }, /*#__PURE__*/React.createElement("label", null, label, " ", req && /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: onChange,
    placeholder: ph
  }), err && /*#__PURE__*/React.createElement("span", {
    className: "field__err"
  }, err));
}
function ContactForm() {
  const [type, setType] = useState("Residential");
  const [sent, setSent] = useState(false);
  const [vals, setVals] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: "",
    message: ""
  });
  const [errs, setErrs] = useState({});
  const [sending, setSending] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const set = k => e => setVals(v => ({
    ...v,
    [k]: e.target.value
  }));
  const submit = async e => {
    e.preventDefault();
    const er = {};
    if (!vals.name.trim()) er.name = "Please enter your name";
    if (!/^[\d\s()+-]{7,}$/.test(vals.phone)) er.phone = "Enter a valid phone number";
    if (!/^\S+@\S+\.\S+$/.test(vals.email)) er.email = "Enter a valid email";
    if (!vals.service) er.service = "Choose a service";
    setErrs(er);
    if (Object.keys(er).length > 0) return;
    setSending(true);
    setSubmitErr("");

    // First-touch attribution / CRM (best-effort — never blocks the email).
    try {
      if (window.PursuitAttribution) {
        window.PursuitAttribution.submit({
          name: vals.name,
          phone: vals.phone,
          email: vals.email,
          address: vals.address,
          service: vals.service,
          message: vals.message,
          property_type: type
        });
      }
    } catch (err) {}

    // Web3Forms → emails sunriseroofer@outlook.com. This is the same backend
    // the original roofwithsunrise.com contact form used and is what actually
    // delivers the lead. Only show success when the email truly goes out.
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "bb31a1fd-2cf0-4ea5-8920-18cad8059ed4",
          subject: "New Roofing Estimate Request - Sunrise Roofers",
          from_name: "Sunrise Roofers Website",
          property_type: type,
          name: vals.name,
          phone: vals.phone,
          email: vals.email,
          address: vals.address,
          service: vals.service,
          message: vals.message
        })
      });
      const result = await res.json();
      if (result.success) {
        try {
          if (typeof window.gtag === "function") {
            window.gtag("event", "generate_lead", {
              form_id: "contact-form",
              page_location: window.location.href
            });
          }
        } catch (err) {}
        setSent(true);
      } else {
        setSubmitErr(result.message || "Something went wrong sending your request. Please call or text 520-753-1758.");
      }
    } catch (err) {
      setSubmitErr("Couldn't send your request right now. Please call or text 520-753-1758 and we'll get right on it.");
    } finally {
      setSending(false);
    }
  };
  const F = p => /*#__PURE__*/React.createElement(Field, {
    ...p,
    value: vals[p.k],
    onChange: set(p.k),
    err: errs[p.k]
  });
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact__side"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "Let's Talk"), /*#__PURE__*/React.createElement("h2", {
    className: "h2",
    style: {
      marginBottom: 16
    }
  }, "Let's Take a Look at Your Roof"), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, "Tell me what's going on up there — a leak, storm damage, an old roof that's seen better days, or a full replacement — and we'll get you on the books for a free inspection."), /*#__PURE__*/React.createElement("div", {
    className: "contact__info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Call or text"), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      display: "block"
    }
  }, "520-753-1758"))), /*#__PURE__*/React.createElement("div", {
    className: "contact__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail"
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Email"), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      display: "block"
    }
  }, "sunriseroofer@outlook.com"))), /*#__PURE__*/React.createElement("div", {
    className: "contact__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin"
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Serving"), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      display: "block"
    }
  }, "Tucson & all of Pima County"))), /*#__PURE__*/React.createElement("div", {
    className: "contact__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock"
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "k"
  }, "Hours"), /*#__PURE__*/React.createElement("span", {
    className: "v",
    style: {
      display: "block"
    }
  }, "Mon–Fri 7–6 · Sat 8–4 · 24/7 Emergency")))), /*#__PURE__*/React.createElement("div", {
    className: "contact__trust"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "badge"
  }), " ROC #358079"), /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield"
  }), " Licensed & Insured"), /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star"
  }), " 5-Star Rated on Google"))), /*#__PURE__*/React.createElement("div", {
    className: "contact__form"
  }, sent ? /*#__PURE__*/React.createElement("div", {
    className: "form-success"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-c"
  })), /*#__PURE__*/React.createElement("h3", null, "Request Received"), /*#__PURE__*/React.createElement("p", null, "Thanks, ", vals.name.split(" ")[0] || "there", "! I'll get back to you within a business day to set up your free inspection. If it's leaking right now, don't wait on email — call or text 520-753-1758."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm",
    style: {
      marginTop: 24
    },
    onClick: () => {
      setSent(false);
      setVals({
        name: "",
        phone: "",
        email: "",
        address: "",
        service: "",
        message: ""
      });
    }
  }, "Submit Another Request")) : /*#__PURE__*/React.createElement("form", {
    className: "form-grid",
    onSubmit: submit,
    noValidate: true
  }, F({
    k: "name",
    label: "Full Name",
    req: true,
    ph: "Jane Doe"
  }), F({
    k: "phone",
    label: "Phone",
    type: "tel",
    req: true,
    ph: "(520) 555-0123"
  }), F({
    k: "email",
    label: "Email",
    type: "email",
    req: true,
    full: true,
    ph: "jane@email.com"
  }), F({
    k: "address",
    label: "Property Address",
    full: true,
    ph: "123 E Speedway Blvd, Tucson"
  }), /*#__PURE__*/React.createElement("div", {
    className: "field" + (errs.service ? " has-error" : "")
  }, /*#__PURE__*/React.createElement("label", null, "Service Needed ", /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, "*")), /*#__PURE__*/React.createElement("select", {
    value: vals.service,
    onChange: set("service")
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a service…"), /*#__PURE__*/React.createElement("option", null, "Roof Repair"), /*#__PURE__*/React.createElement("option", null, "Roof Replacement"), /*#__PURE__*/React.createElement("option", null, "Metal Roof Installation"), /*#__PURE__*/React.createElement("option", null, "Tile Roofing"), /*#__PURE__*/React.createElement("option", null, "Flat Roof / Coatings"), /*#__PURE__*/React.createElement("option", null, "Commercial Roofing"), /*#__PURE__*/React.createElement("option", null, "Roof Inspection"), /*#__PURE__*/React.createElement("option", null, "Storm / Monsoon Damage")), errs.service && /*#__PURE__*/React.createElement("span", {
    className: "field__err"
  }, errs.service)), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Property Type"), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, ["Residential", "Commercial"].map(t => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: t,
    className: type === t ? "is-on" : "",
    onClick: () => setType(t)
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "field field--full"
  }, /*#__PURE__*/React.createElement("label", null, "Message"), /*#__PURE__*/React.createElement("textarea", {
    value: vals.message,
    onChange: set("message"),
    placeholder: "Tell us what's going on with your roof…"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field field--full"
  }, /*#__PURE__*/React.createElement("label", null, "Photos (optional)"), /*#__PURE__*/React.createElement("label", {
    className: "upload"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "camera"
  }), " Drag roof photos here, or click to upload")), /*#__PURE__*/React.createElement("div", {
    className: "field--full"
  }, submitErr && /*#__PURE__*/React.createElement("p", {
    className: "field__err",
    style: {
      marginBottom: 12,
      display: "block"
    }
  }, submitErr), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary btn--block",
    type: "submit",
    disabled: sending
  }, sending ? "Sending…" : /*#__PURE__*/React.createElement(React.Fragment, null, "Request My Free Roof Estimate ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })))))))));
}
function Footer() {
  const U = slug => window.SUNRISE ? window.SUNRISE.url(slug) : "/" + slug;
  const col = (h, items) => /*#__PURE__*/React.createElement("div", {
    className: "footer__col"
  }, /*#__PURE__*/React.createElement("h4", null, h), items.map(x => /*#__PURE__*/React.createElement("a", {
    key: x.t,
    href: x.href || U(x.s)
  }, x.t)));
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer",
    id: "footer"
  }, /*#__PURE__*/React.createElement(Roofline, null), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__brand"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("p", null, "Tucson roofers, family-owned. Repair, replacement, metal, tile, flat roofs and commercial systems — all built for the desert."), /*#__PURE__*/React.createElement("div", {
    className: "footer__socials"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.facebook.com/people/Sunrise-Roofers-LLC/61580211666613/",
    target: "_blank",
    rel: "noopener",
    "aria-label": "Facebook"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "fb"
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com/sunriseroofersllc/",
    target: "_blank",
    rel: "noopener",
    "aria-label": "Instagram"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ig"
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://www.google.com/maps?cid=2878962440155556072",
    target: "_blank",
    rel: "noopener",
    "aria-label": "Google"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "google"
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://www.youtube.com/@Sunriseroofers520",
    target: "_blank",
    rel: "noopener",
    "aria-label": "YouTube"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "yt"
  })))), col("Services", [{
    t: "Roof Repair",
    s: "roof-repair"
  }, {
    t: "Roof Replacement",
    s: "roof-replacement"
  }, {
    t: "Metal Roofing",
    s: "metal-roofing"
  }, {
    t: "Tile Roofing",
    s: "tile-roofing"
  }, {
    t: "Flat & Coatings",
    s: "flat-roofing"
  }, {
    t: "Commercial Roofing",
    s: "commercial-roofing"
  }]), col("Explore", [{
    t: "Residential Roofing",
    s: "residential-roofing"
  }, {
    t: "Roof Inspection",
    s: "roof-inspection"
  }, {
    t: "Emergency Repair",
    s: "emergency-roof-repair"
  }, {
    t: "Gutters",
    s: "gutter-installation"
  }, {
    t: "Skylights",
    s: "skylight-installation"
  }, {
    t: "Resources",
    s: "resources"
  }, {
    t: "Blog",
    href: "/blog"
  }]), col("Service Areas", [{
    t: "Tucson",
    s: "home"
  }, {
    t: "Oro Valley",
    s: "roofing-oro-valley"
  }, {
    t: "Marana",
    s: "roofing-marana"
  }, {
    t: "Sahuarita / Green Valley",
    s: "roofing-sahuarita-green-valley"
  }, {
    t: "Vail",
    s: "roofing-vail-az"
  }, {
    t: "Contact Us",
    s: "contact"
  }])), /*#__PURE__*/React.createElement("div", {
    className: "footer__bottom"
  }, /*#__PURE__*/React.createElement("span", null, "© 2026 Sunrise Roofers LLC. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    className: "lic"
  }, /*#__PURE__*/React.createElement("span", null, "ROC #358079 · Licensed, Bonded & Insured"), /*#__PURE__*/React.createElement("span", null, "Tucson, Arizona")))));
}
Object.assign(window, {
  ContactForm,
  Footer
});
})();
