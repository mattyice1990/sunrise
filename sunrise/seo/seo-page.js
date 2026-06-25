(function(){
/* seo-page.jsx — data-driven SEO landing-page template.
   Reads window.SEO[window.__page] and renders a full, schema-rich page that
   reuses the shared chrome (TopBar, HeaderNav, ContactForm, Footer, Chat).
   Each page object supplies its own copy — see sunrise/seo/data-*.js. */

const PAGE = (window.SEO || {})[window.__page] || {};
const U = slug => window.SUNRISE.url(slug);

/* Per-page hero background photo (real roofing job shots). Falls back to the
   CSS gradient when a slug has no mapping. */
const HERO_IMG = {
  "roof-repair": "uploads/pf-repair.jpg",
  "roof-replacement": "uploads/aerial-home.jpg",
  "roof-installation": "uploads/prop-new.webp",
  "roof-inspection": "uploads/sunrise-crew.webp",
  "emergency-roof-repair": "uploads/wind-damage.jpg",
  "tile-roofing": "uploads/pf-tile-refelt.jpg",
  "flat-roofing": "uploads/pf-flat-tpo.jpg",
  "roof-coatings": "uploads/prop-retail.jpg",
  "metal-roofing": "uploads/aerial-metal.jpg",
  "shingle-roofing": "uploads/pf-shingle.jpg",
  "gutter-installation": "uploads/Roofing%20on%20Steep%20Roof%20Pitch.jpeg",
  "skylight-installation": "uploads/skylight.jpg",
  "roofing-tucson": "uploads/aerial-home.jpg",
  "roofing-oro-valley": "uploads/pf-tile-refelt.jpg",
  "roofing-marana": "uploads/pf-shingle.jpg",
  "roofing-sahuarita-green-valley": "uploads/Tile%20Roof%20Replacement%20in%20Marana.jpg",
  "roofing-vail-az": "uploads/Roofing%20on%20Steep%20Roof%20Pitch.jpeg",
  "residential-roofing": "uploads/aerial-home.jpg",
  "commercial-roofing": "uploads/aerial-commercial.jpg",
  "about": "uploads/sunrise-crew.webp",
  "contact": "uploads/aerial-home.jpg",
  "resources": "uploads/Roof%20Coating.jpeg"
};

/* ---------- head: <title>, meta description, JSON-LD ---------- */
function injectSeoHead(p) {
  if (!p || !p.slug) return;
  document.title = p.title;
  const setMeta = (name, content, attr = "name") => {
    let m = document.head.querySelector(`meta[${attr}="${name}"]`);
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute(attr, name);
      document.head.appendChild(m);
    }
    m.setAttribute("content", content);
  };
  setMeta("description", p.desc);
  setMeta("og:title", p.title, "property");
  setMeta("og:description", p.desc, "property");
  setMeta("og:type", "website", "property");
  const base = "https://roofwithsunrise.com/";
  const shortHere = window.SUNRISE.ALL[p.slug] && window.SUNRISE.ALL[p.slug].t || p.hero.h1;
  const crumbs = [{
    name: "Home",
    slug: "home"
  }];
  if (p.crumb) crumbs.push({
    name: p.crumb,
    slug: p.crumbSlug || null
  });
  crumbs.push({
    name: shortHere,
    slug: p.slug
  });
  const ld = [{
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: p.kw && p.kw.primary,
    name: p.hero.h1,
    areaServed: {
      "@type": "City",
      name: "Tucson",
      "@id": "https://www.wikidata.org/wiki/Q5712"
    },
    provider: {
      "@type": "RoofingContractor",
      name: "Sunrise Roofers LLC",
      telephone: window.SUNRISE.PHONE,
      email: window.SUNRISE.EMAIL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tucson",
        addressRegion: "AZ",
        addressCountry: "US"
      },
      areaServed: "Tucson & Pima County, AZ"
    },
    description: p.desc
  }, {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.slug ? base + window.SUNRISE.url(c.slug) : undefined
    }))
  }];
  if (p.faqs && p.faqs.length) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: p.faqs.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a
        }
      }))
    });
  }
  let s = document.getElementById("seo-jsonld");
  if (!s) {
    s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "seo-jsonld";
    document.head.appendChild(s);
  }
  s.textContent = JSON.stringify(ld);
}

/* ---------- breadcrumb ---------- */
function Crumb({
  p
}) {
  const here = window.SUNRISE.ALL[p.slug] && window.SUNRISE.ALL[p.slug].t || p.hero.h1;
  return /*#__PURE__*/React.createElement("nav", {
    className: "crumb",
    "aria-label": "Breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    href: U("home")
  }, "Home"), /*#__PURE__*/React.createElement(Icon, {
    name: "caret"
  }), p.crumb && (p.crumbSlug ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    href: U(p.crumbSlug)
  }, p.crumb), /*#__PURE__*/React.createElement(Icon, {
    name: "caret"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, p.crumb), /*#__PURE__*/React.createElement(Icon, {
    name: "caret"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "crumb__here"
  }, here));
}

/* ---------- hero ---------- */
function SeoHero({
  p
}) {
  const kw = p.kw || {};
  return /*#__PURE__*/React.createElement("header", {
    className: "shero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "shero__bg",
    style: HERO_IMG[p.slug] ? {
      backgroundImage: "linear-gradient(160deg, rgba(20,17,14,.82) 0%, rgba(12,10,8,.66) 100%), url('" + HERO_IMG[p.slug] + "')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    } : undefined
  }), /*#__PURE__*/React.createElement("div", {
    className: "shero__scrim"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container shero__inner"
  }, /*#__PURE__*/React.createElement(Crumb, {
    p: p
  }), /*#__PURE__*/React.createElement("p", {
    className: "eyebrow shero__eyebrow"
  }, p.hero.eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "shero__h1"
  }, p.hero.h1), /*#__PURE__*/React.createElement("p", {
    className: "shero__sub"
  }, p.hero.sub), /*#__PURE__*/React.createElement("div", {
    className: "shero__cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary btn--lg",
    href: U("contact")
  }, "Get a Free Estimate ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--on-dark btn--lg",
    href: window.SUNRISE.PHONE_HREF
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " ", window.SUNRISE.PHONE)), /*#__PURE__*/React.createElement("ul", {
    className: "shero__chips"
  }, (p.hero.chips || ["Licensed & Insured · ROC #358079", "Free Roof Inspections", "5-Star Rated on Google", "Financing Available"]).map(c => /*#__PURE__*/React.createElement("li", {
    key: c
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-c"
  }), " ", c)))));
}

/* ---------- intro + highlight cards ---------- */
function Intro({
  p
}) {
  if (!p.intro) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "section sintro",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "container sintro__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sintro__lead"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, p.intro.kicker || "Overview"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, p.intro.h || p.hero.h1), p.intro.lead.map((t, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    className: "lead sintro__p"
  }, t)), p.intro.bullets && /*#__PURE__*/React.createElement("ul", {
    className: "ticks"
  }, p.intro.bullets.map(b => /*#__PURE__*/React.createElement("li", {
    key: b
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check"
  }), " ", b))), p.guide && /*#__PURE__*/React.createElement("p", {
    className: "sintro__guide"
  }, /*#__PURE__*/React.createElement("a", {
    className: "link-arrow",
    href: p.guide.url
  }, p.guide.label, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sintro__actions"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary",
    href: U("contact")
  }, "Request Free Estimate ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--ghost",
    href: window.SUNRISE.PHONE_HREF
  }, "Call ", window.SUNRISE.PHONE))), p.highlights && /*#__PURE__*/React.createElement("div", {
    className: "sintro__cards"
  }, p.highlights.map(h => /*#__PURE__*/React.createElement("div", {
    className: "hcard",
    key: h.t
  }, /*#__PURE__*/React.createElement("span", {
    className: "hcard__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: h.ic
  })), /*#__PURE__*/React.createElement("h3", null, h.t), /*#__PURE__*/React.createElement("p", null, h.d))))));
}

/* ---------- body sections (alternating) ---------- */
function Sections({
  p
}) {
  if (!p.sections) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, p.sections.map((s, i) => /*#__PURE__*/React.createElement("section", {
    className: "section sbody" + (i % 2 ? " sbody--alt" : ""),
    key: s.h,
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "container sbody__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sbody__txt"
  }, s.kicker && /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, s.kicker), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, s.h), s.p.map((t, j) => /*#__PURE__*/React.createElement("p", {
    key: j,
    className: "sbody__p"
  }, t)), s.bullets && /*#__PURE__*/React.createElement("ul", {
    className: "ticks ticks--2"
  }, s.bullets.map(b => /*#__PURE__*/React.createElement("li", {
    key: b
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check"
  }), " ", b)))), s.cards && /*#__PURE__*/React.createElement("div", {
    className: "sbody__cards"
  }, s.cards.map(c => /*#__PURE__*/React.createElement("div", {
    className: "minicard",
    key: c.t
  }, /*#__PURE__*/React.createElement("span", {
    className: "minicard__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.ic || "check-c"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, c.t), /*#__PURE__*/React.createElement("span", null, c.d)))))))));
}

/* ---------- options / materials grid ---------- */
function Options({
  p
}) {
  if (!p.options) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sec-head"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, p.options.kicker || "Options"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, p.options.h), p.options.sub && /*#__PURE__*/React.createElement("p", {
    className: "lead sec-head__sub"
  }, p.options.sub)), /*#__PURE__*/React.createElement("div", {
    className: "optgrid"
  }, p.options.items.map(o => /*#__PURE__*/React.createElement("div", {
    className: "optcard",
    key: o.t
  }, /*#__PURE__*/React.createElement("span", {
    className: "optcard__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: o.ic || "layers"
  })), /*#__PURE__*/React.createElement("h3", null, o.t), /*#__PURE__*/React.createElement("p", null, o.d))))));
}

/* ---------- process ---------- */
function Process({
  p
}) {
  if (!p.process) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "section deep sprocess",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sec-head"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "How It Works"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, p.processH || "Our Roofing Process")), /*#__PURE__*/React.createElement("div", {
    className: "steps"
  }, p.process.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "step",
    key: s.t
  }, /*#__PURE__*/React.createElement("span", {
    className: "step__n"
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("h3", null, s.t), /*#__PURE__*/React.createElement("p", null, s.d))))));
}

/* ---------- FAQ (always expanded for readability + SEO) ---------- */
function Faqs({
  p
}) {
  if (!p.faqs) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "section sfaq",
    id: "faq",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "container sfaq__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sfaq__head"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "FAQ"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, p.faqH || "Roofing Questions, Answered"), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, "Still wondering about something? Call us at ", window.SUNRISE.PHONE, " — straight answers, no pressure."), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary",
    href: U("contact"),
    style: {
      marginTop: 8
    }
  }, "Ask Us Directly ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sfaq__list"
  }, p.faqs.map(f => /*#__PURE__*/React.createElement("div", {
    className: "faq",
    key: f.q
  }, /*#__PURE__*/React.createElement("h3", {
    className: "faq__q"
  }, /*#__PURE__*/React.createElement("span", {
    className: "faq__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check"
  })), /*#__PURE__*/React.createElement("span", null, f.q)), /*#__PURE__*/React.createElement("div", {
    className: "faq__a"
  }, /*#__PURE__*/React.createElement("p", null, f.a)))))));
}

/* ---------- related internal links ---------- */
function Related({
  p
}) {
  if (!p.related || !p.related.length) return null;
  const items = p.related.map(slug => window.SUNRISE.ALL[slug]).filter(Boolean);
  return /*#__PURE__*/React.createElement("section", {
    className: "section srelated",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sec-head"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "Explore More"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, p.relatedH || "Related Roofing Services")), /*#__PURE__*/React.createElement("div", {
    className: "relgrid"
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    className: "relcard",
    key: it.slug,
    href: U(it.slug)
  }, /*#__PURE__*/React.createElement("span", {
    className: "relcard__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.ic || "layers"
  })), /*#__PURE__*/React.createElement("span", {
    className: "relcard__t"
  }, it.t), it.d && /*#__PURE__*/React.createElement("span", {
    className: "relcard__d"
  }, it.d), /*#__PURE__*/React.createElement("span", {
    className: "relcard__arrow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })))))));
}

/* ---------- mid-page CTA band ---------- */
function CtaBand({
  p
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "ctaband",
    "data-reveal": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "container ctaband__in"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, p.ctaH || "Ready for a roof you can stop thinking about?"), /*#__PURE__*/React.createElement("p", null, p.ctaSub || "Free inspection, honest assessment, and a clear written estimate — usually within one business day.")), /*#__PURE__*/React.createElement("div", {
    className: "ctaband__btns"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary btn--lg",
    href: U("contact")
  }, "Get My Free Estimate ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--on-dark btn--lg",
    href: window.SUNRISE.PHONE_HREF
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " ", window.SUNRISE.PHONE))));
}
function SeoPage() {
  useEffect(() => {
    injectSeoHead(PAGE);
    // Reveal-on-scroll for [data-reveal]; reveal immediately if observer
    // is unavailable so content is never stuck hidden.
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach(e => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08
    });
    els.forEach(e => io.observe(e));
    const fb = setTimeout(() => els.forEach(e => e.classList.add("is-in")), 2500);
    return () => {
      io.disconnect();
      clearTimeout(fb);
    };
  }, []);
  if (!PAGE.slug) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 80,
        textAlign: "center",
        fontFamily: "sans-serif"
      }
    }, "Page data not found for “", window.__page, "”.");
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, null), /*#__PURE__*/React.createElement(HeaderNav, null), /*#__PURE__*/React.createElement("main", {
    className: "seopage"
  }, /*#__PURE__*/React.createElement(SeoHero, {
    p: PAGE
  }), /*#__PURE__*/React.createElement(Intro, {
    p: PAGE
  }), /*#__PURE__*/React.createElement(Sections, {
    p: PAGE
  }), /*#__PURE__*/React.createElement(Options, {
    p: PAGE
  }), /*#__PURE__*/React.createElement(Process, {
    p: PAGE
  }), PAGE.reviews !== false && /*#__PURE__*/React.createElement(GoogleReviews, null), /*#__PURE__*/React.createElement(Faqs, {
    p: PAGE
  }), /*#__PURE__*/React.createElement(Related, {
    p: PAGE
  }), !PAGE.noCta && /*#__PURE__*/React.createElement(CtaBand, {
    p: PAGE
  }), /*#__PURE__*/React.createElement(ContactForm, null)), /*#__PURE__*/React.createElement(Footer, null));
}
Object.assign(window, {
  SeoPage
});
const _root = document.getElementById("root");
if (_root && window.__page) ReactDOM.createRoot(_root).render(/*#__PURE__*/React.createElement(SeoPage, null));
})();
