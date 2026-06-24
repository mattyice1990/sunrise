(function(){
/* nav.jsx — TopBar + sticky HeaderNav + MegaMenus */

/* Menus are driven by the central page registry in seo-links.js so nav
   links always resolve to real pages. */
const SERVICES = window.SUNRISE && window.SUNRISE.SERVICES || [];
const PROPS = window.SUNRISE && window.SUNRISE.SEGMENTS || [];
const AREAS = window.SUNRISE && window.SUNRISE.AREAS || [];
const U = slug => window.SUNRISE ? window.SUNRISE.url(slug) : "/" + slug;

/* Cross-page links. On the homepage __home is unset, so section links stay
   in-page hashes ("#services"). On sub-pages (Projects.html) __home points
   back at the homepage so the same links resolve to "home.html#services". */
const HOME = window.__home || "";
const HOME_URL = HOME || "#top";
const PROJECTS_URL = U("portfolio");
const sec = id => HOME + "#" + id;

// One run of the marquee content; rendered twice back-to-back so the
// translateX(-50%) loop is seamless.
function TopbarTickerRun() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    className: "ti",
    href: "tel:5207531758"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " 520-753-1758"), /*#__PURE__*/React.createElement("span", {
    className: "ti topbar__emergency"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " 24/7 Emergency Roof Repair"), /*#__PURE__*/React.createElement("a", {
    className: "ti",
    href: "mailto:sunriseroofer@outlook.com"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail"
  }), " sunriseroofer@outlook.com"), /*#__PURE__*/React.createElement("span", {
    className: "ti"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "badge"
  }), " ROC #358079 · Licensed & Insured"), /*#__PURE__*/React.createElement("span", {
    className: "topbar__socials"
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
  }))));
}
function TopBar() {
  return /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container topbar__row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar__left"
  }, /*#__PURE__*/React.createElement("a", {
    className: "ti",
    href: "tel:5207531758"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " 520-753-1758"), /*#__PURE__*/React.createElement("a", {
    className: "ti ti--hide",
    href: "mailto:sunriseroofer@outlook.com"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail"
  }), " sunriseroofer@outlook.com"), /*#__PURE__*/React.createElement("span", {
    className: "ti topbar__emergency"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " 24/7 Emergency Roof Repair")), /*#__PURE__*/React.createElement("div", {
    className: "topbar__right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "topbar__badge"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "badge"
  }), " ROC #358079 · Licensed & Insured"), /*#__PURE__*/React.createElement("div", {
    className: "topbar__socials"
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
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "topbar__ticker"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar__track"
  }, /*#__PURE__*/React.createElement(TopbarTickerRun, null), /*#__PURE__*/React.createElement(TopbarTickerRun, null))));
}
function Logo() {
  return /*#__PURE__*/React.createElement("a", {
    className: "logo",
    href: HOME_URL
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo__svg"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "logo__mark",
    viewBox: "0 0 48 48",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "48",
    height: "48",
    rx: "11",
    fill: "var(--terra)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 25 24 13l15 12",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 24v11h24V24",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 35v-6h8v6",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), /*#__PURE__*/React.createElement("span", {
    className: "logo__text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "logo__name"
  }, "Sunrise Roofers"), /*#__PURE__*/React.createElement("span", {
    className: "logo__sub"
  }, "Installations · Tucson AZ"))), /*#__PURE__*/React.createElement("span", {
    className: "logo__photo"
  }, /*#__PURE__*/React.createElement("img", {
    className: "logo__pimg logo__pimg--color",
    src: window.__resources && window.__resources.logoColor || "sunrise-assets/logo-color.png",
    alt: "Sunrise Roofers LLC"
  }), /*#__PURE__*/React.createElement("img", {
    className: "logo__pimg logo__pimg--light",
    src: window.__resources && window.__resources.logoCreamSolid || "sunrise-assets/logo-cream-solid.png",
    alt: "Sunrise Roofers LLC"
  })));
}
function MNavSection({
  id,
  label,
  items,
  href,
  withDesc,
  open,
  onToggle,
  onClose
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "mnav__acc" + (open ? " is-open" : ""),
    "aria-expanded": open,
    onClick: () => onToggle(id)
  }, label, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "caret"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mnav__sub" + (open ? " is-open" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "mnav__sub-in",
    onClick: onClose
  }, items.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.t,
    className: "mnav__sublink",
    href: s.slug ? U(s.slug) : href
  }, /*#__PURE__*/React.createElement("span", {
    className: "mnav__subic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.ic
  })), /*#__PURE__*/React.createElement("span", {
    className: "mnav__subtxt"
  }, s.t, withDesc && s.d ? /*#__PURE__*/React.createElement("span", {
    className: "mnav__subd"
  }, s.d) : null))))));
}
function MobileMenu({
  open,
  onClose
}) {
  const [openSec, setOpenSec] = useState(null);
  // collapse any expanded section whenever the drawer closes
  useEffect(() => {
    if (!open) setOpenSec(null);
  }, [open]);
  // Lock background scroll on phones so the menu acts as a self-contained
  // modal. On larger screens we leave it scrollable on purpose, so the page
  // glides behind the glassy fly-out. iOS-safe: pin the body, then restore.
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    const y = window.scrollY;
    const b = document.body;
    Object.assign(b.style, {
      position: "fixed",
      top: "-" + y + "px",
      left: "0",
      right: "0",
      overflow: "hidden"
    });
    return () => {
      Object.assign(b.style, {
        position: "",
        top: "",
        left: "",
        right: "",
        overflow: ""
      });
      window.scrollTo(0, y);
    };
  }, [open]);
  const toggle = key => setOpenSec(cur => cur === key ? null : key);

  // Render through a portal on <body> so the drawer isn't trapped by the
  // header's backdrop-filter (which would make it the containing block for
  // this position:fixed element) or its stacking context.
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    className: "mnav " + (open ? "is-open" : ""),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "mnav__scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "mnav__panel",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mnav__top"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("button", {
    className: "mnav__close",
    "aria-label": "Close menu",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x"
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "mnav__links"
  }, /*#__PURE__*/React.createElement(MNavSection, {
    id: "services",
    label: "Services",
    items: SERVICES,
    href: sec("services"),
    withDesc: true,
    open: openSec === "services",
    onToggle: toggle,
    onClose: onClose
  }), /*#__PURE__*/React.createElement(MNavSection, {
    id: "property",
    label: "Property Type",
    items: PROPS,
    href: sec("property"),
    withDesc: true,
    open: openSec === "property",
    onToggle: toggle,
    onClose: onClose
  }), /*#__PURE__*/React.createElement(MNavSection, {
    id: "areas",
    label: "Service Areas",
    items: AREAS,
    href: U("contact"),
    withDesc: true,
    open: openSec === "areas",
    onToggle: toggle,
    onClose: onClose
  }), /*#__PURE__*/React.createElement("a", {
    className: "mnav__link",
    href: U("portfolio"),
    onClick: onClose
  }, "Portfolio"), /*#__PURE__*/React.createElement("a", {
    className: "mnav__link",
    href: U("about"),
    onClick: onClose
  }, "About"), /*#__PURE__*/React.createElement("a", {
    className: "mnav__link",
    href: U("resources"),
    onClick: onClose
  }, "Resources"), /*#__PURE__*/React.createElement("a", {
    className: "mnav__link",
    href: "/blog",
    onClick: onClose
  }, "Blog"), /*#__PURE__*/React.createElement("a", {
    className: "mnav__link",
    href: U("contact"),
    onClick: onClose
  }, "Contact")), /*#__PURE__*/React.createElement("div", {
    className: "mnav__foot"
  }, /*#__PURE__*/React.createElement("a", {
    className: "mnav__call",
    href: "tel:5207531758"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), " 520-753-1758"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary btn--block",
    href: sec("contact"),
    onClick: onClose
  }, "Free Roof Estimate"), /*#__PURE__*/React.createElement("span", {
    className: "mnav__emergency"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " 24/7 Emergency Roof Repair")))), document.body);
}
function HeaderNav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    // Homepage has the tall pinned video hero (.hero) → header stays
    // transparent over it, then turns solid (light) on scroll. Every other
    // page gets a solid light header immediately so the full-color logo sits
    // on a light surface and reads crisply.
    const pinnedHero = document.querySelector(".hero");
    if (!pinnedHero) {
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.88);
    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // close the drawer if the viewport grows back to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1081px)");
    const onChange = e => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    className: "header " + (solid ? "header--solid" : "header--over")
  }, /*#__PURE__*/React.createElement("div", {
    className: "container nav"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("nav", {
    className: "nav__menu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: sec("services")
  }, "Services ", /*#__PURE__*/React.createElement(Icon, {
    name: "caret"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mega mega--services"
  }, SERVICES.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.t,
    className: "mega__link",
    href: U(s.slug)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mega__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.ic
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "mega__t"
  }, s.t), /*#__PURE__*/React.createElement("span", {
    className: "mega__d"
  }, s.d)))), /*#__PURE__*/React.createElement("div", {
    className: "mega__foot"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Not sure what you need?"), " Book a free, no-pressure roof inspection."), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary btn--sm",
    href: U("contact")
  }, "Free Inspection")))), /*#__PURE__*/React.createElement("div", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: sec("property")
  }, "Property Type ", /*#__PURE__*/React.createElement(Icon, {
    name: "caret"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mega mega--prop"
  }, PROPS.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.t,
    className: "mega__link",
    href: U(s.slug)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mega__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.ic
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "mega__t"
  }, s.t), /*#__PURE__*/React.createElement("span", {
    className: "mega__d"
  }, s.d)))))), /*#__PURE__*/React.createElement("div", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: U("contact")
  }, "Service Areas ", /*#__PURE__*/React.createElement(Icon, {
    name: "caret"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mega mega--prop"
  }, AREAS.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.t,
    className: "mega__link",
    href: U(s.slug)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mega__ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.ic
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "mega__t"
  }, s.t), /*#__PURE__*/React.createElement("span", {
    className: "mega__d"
  }, s.d)))))), /*#__PURE__*/React.createElement("div", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: U("portfolio")
  }, "Portfolio")), /*#__PURE__*/React.createElement("div", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: U("about")
  }, "About")), /*#__PURE__*/React.createElement("div", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: U("resources")
  }, "Resources")), /*#__PURE__*/React.createElement("div", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: "/blog"
  }, "Blog")), /*#__PURE__*/React.createElement("div", {
    className: "nav__item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__link",
    href: U("contact")
  }, "Contact"))), /*#__PURE__*/React.createElement("div", {
    className: "nav__right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav__cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__phone",
    href: "tel:5207531758"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }), /*#__PURE__*/React.createElement("span", null, "520-753-1758")), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--primary btn--sm",
    href: sec("contact")
  }, "Free Roof Estimate"), /*#__PURE__*/React.createElement("a", {
    className: "nav__call",
    href: "tel:5207531758",
    "aria-label": "Call 520-753-1758"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "burger " + (menuOpen ? "is-open" : ""),
    "aria-label": menuOpen ? "Close menu" : "Open menu",
    "aria-expanded": menuOpen,
    onClick: () => setMenuOpen(v => !v)
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)))), /*#__PURE__*/React.createElement(MobileMenu, {
    open: menuOpen,
    onClose: () => setMenuOpen(false)
  }));
}
Object.assign(window, {
  TopBar,
  HeaderNav,
  MobileMenu,
  Logo,
  SERVICES,
  PROPS
});
})();
