/* nav.jsx — TopBar + sticky HeaderNav + MegaMenus */

/* Menus are driven by the central page registry in seo-links.js so nav
   links always resolve to real pages. */
const SERVICES = (window.SUNRISE && window.SUNRISE.SERVICES) || [];
const PROPS    = (window.SUNRISE && window.SUNRISE.SEGMENTS) || [];
const AREAS    = (window.SUNRISE && window.SUNRISE.AREAS) || [];
const U = (slug) => (window.SUNRISE ? window.SUNRISE.url(slug) : slug + ".html");

/* Cross-page links. On the homepage __home is unset, so section links stay
   in-page hashes ("#services"). On sub-pages (Projects.html) __home points
   back at the homepage so the same links resolve to "home.html#services". */
const HOME = window.__home || "";
const HOME_URL = HOME || "#top";
const PROJECTS_URL = U("portfolio");
const sec = (id) => HOME + "#" + id;

// One run of the marquee content; rendered twice back-to-back so the
// translateX(-50%) loop is seamless.
function TopbarTickerRun() {
  return (
    <React.Fragment>
      <a className="ti" href="tel:5207531758"><Icon name="phone" /> 520-753-1758</a>
      <span className="ti topbar__emergency"><span className="dot"></span> 24/7 Emergency Roof Repair</span>
      <a className="ti" href="mailto:sunriseroofer@outlook.com"><Icon name="mail" /> sunriseroofer@outlook.com</a>
      <span className="ti"><Icon name="badge" /> ROC #358079 · Licensed &amp; Insured</span>
      <span className="topbar__socials">
        <a href="https://www.facebook.com/people/Sunrise-Roofers-LLC/61580211666613/" target="_blank" rel="noopener" aria-label="Facebook"><Icon name="fb" /></a>
        <a href="https://www.instagram.com/sunriseroofersllc/" target="_blank" rel="noopener" aria-label="Instagram"><Icon name="ig" /></a>
        <a href="https://www.google.com/maps?cid=2878962440155556072" target="_blank" rel="noopener" aria-label="Google"><Icon name="google" /></a>
      </span>
    </React.Fragment>
  );
}

function TopBar() {
  return (
    <div className="topbar">
      {/* desktop: static split row */}
      <div className="container topbar__row">
        <div className="topbar__left">
          <a className="ti" href="tel:5207531758"><Icon name="phone" /> 520-753-1758</a>
          <a className="ti ti--hide" href="mailto:sunriseroofer@outlook.com"><Icon name="mail" /> sunriseroofer@outlook.com</a>
          <span className="ti topbar__emergency"><span className="dot"></span> 24/7 Emergency Roof Repair</span>
        </div>
        <div className="topbar__right">
          <span className="topbar__badge"><Icon name="badge" /> ROC #358079 · Licensed &amp; Insured</span>
          <div className="topbar__socials">
            <a href="https://www.facebook.com/people/Sunrise-Roofers-LLC/61580211666613/" target="_blank" rel="noopener" aria-label="Facebook"><Icon name="fb" /></a>
            <a href="https://www.instagram.com/sunriseroofersllc/" target="_blank" rel="noopener" aria-label="Instagram"><Icon name="ig" /></a>
            <a href="https://www.google.com/maps?cid=2878962440155556072" target="_blank" rel="noopener" aria-label="Google"><Icon name="google" /></a>
          </div>
        </div>
      </div>
      {/* mobile: everything in a right-to-left scrolling ticker so nothing is clipped */}
      <div className="topbar__ticker">
        <div className="topbar__track">
          <TopbarTickerRun />
          <TopbarTickerRun />
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <a className="logo" href={HOME_URL}>
      <span className="logo__svg">
        <svg className="logo__mark" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="11" fill="var(--terra)"/>
          <path d="M9 25 24 13l15 12" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 24v11h24V24" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 35v-6h8v6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="logo__text">
          <span className="logo__name">Sunrise Roofers</span>
          <span className="logo__sub">Installations · Tucson AZ</span>
        </span>
      </span>
      <span className="logo__photo">
        <img className="logo__pimg logo__pimg--color" src={(window.__resources && window.__resources.logoColor) || "sunrise-assets/logo-color.png"} alt="Sunrise Roofers LLC" />
        <img className="logo__pimg logo__pimg--light" src={(window.__resources && window.__resources.logoCreamSolid) || "sunrise-assets/logo-cream-solid.png"} alt="Sunrise Roofers LLC" />
      </span>
    </a>
  );
}

function MNavSection({ id, label, items, href, withDesc, open, onToggle, onClose }) {
  return (
    <React.Fragment>
      <button
        className={"mnav__acc" + (open ? " is-open" : "")}
        aria-expanded={open}
        onClick={() => onToggle(id)}
      >
        {label} <Icon name="caret" />
      </button>
      <div className={"mnav__sub" + (open ? " is-open" : "")}>
        <div className="mnav__sub-in" onClick={onClose}>
          {items.map((s) => (
            <a key={s.t} className="mnav__sublink" href={s.slug ? U(s.slug) : href}>
              <span className="mnav__subic"><Icon name={s.ic} /></span>
              <span className="mnav__subtxt">
                {s.t}
                {withDesc && s.d ? <span className="mnav__subd">{s.d}</span> : null}
              </span>
            </a>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

function MobileMenu({ open, onClose }) {
  const [openSec, setOpenSec] = useState(null);
  // collapse any expanded section whenever the drawer closes
  useEffect(() => { if (!open) setOpenSec(null); }, [open]);
  // Lock background scroll on phones so the menu acts as a self-contained
  // modal. On larger screens we leave it scrollable on purpose, so the page
  // glides behind the glassy fly-out. iOS-safe: pin the body, then restore.
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    const y = window.scrollY;
    const b = document.body;
    Object.assign(b.style, { position: "fixed", top: "-" + y + "px", left: "0", right: "0", overflow: "hidden" });
    return () => {
      Object.assign(b.style, { position: "", top: "", left: "", right: "", overflow: "" });
      window.scrollTo(0, y);
    };
  }, [open]);
  const toggle = (key) => setOpenSec((cur) => (cur === key ? null : key));

  // Render through a portal on <body> so the drawer isn't trapped by the
  // header's backdrop-filter (which would make it the containing block for
  // this position:fixed element) or its stacking context.
  return ReactDOM.createPortal(
    <div className={"mnav " + (open ? "is-open" : "")} aria-hidden={!open}>
      <div className="mnav__scrim" onClick={onClose}></div>
      <aside className="mnav__panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="mnav__top">
          <Logo />
          <button className="mnav__close" aria-label="Close menu" onClick={onClose}><Icon name="x" /></button>
        </div>
        <nav className="mnav__links">
          <MNavSection id="services" label="Services" items={SERVICES} href={sec("services")} withDesc
            open={openSec === "services"} onToggle={toggle} onClose={onClose} />
          <MNavSection id="property" label="Property Type" items={PROPS} href={sec("property")} withDesc
            open={openSec === "property"} onToggle={toggle} onClose={onClose} />
          <MNavSection id="areas" label="Service Areas" items={AREAS} href={U("contact")} withDesc
            open={openSec === "areas"} onToggle={toggle} onClose={onClose} />
          <a className="mnav__link" href={U("portfolio")} onClick={onClose}>Portfolio</a>
          <a className="mnav__link" href={U("about")} onClick={onClose}>About</a>
          <a className="mnav__link" href={U("resources")} onClick={onClose}>Resources</a>
          <a className="mnav__link" href="/blog" onClick={onClose}>Blog</a>
          <a className="mnav__link" href={U("contact")} onClick={onClose}>Contact</a>
        </nav>
        <div className="mnav__foot">
          <a className="mnav__call" href="tel:5207531758"><Icon name="phone" /> 520-753-1758</a>
          <a className="btn btn--primary btn--block" href={sec("contact")} onClick={onClose}>Free Roof Estimate</a>
          <span className="mnav__emergency"><span className="dot"></span> 24/7 Emergency Roof Repair</span>
        </div>
      </aside>
    </div>,
    document.body
  );
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
    if (!pinnedHero) { setSolid(true); return; }
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.88);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // close the drawer if the viewport grows back to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1081px)");
    const onChange = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return (
    <header className={"header " + (solid ? "header--solid" : "header--over")}>
      <div className="container nav">
        <Logo />
        <nav className="nav__menu">
          <div className="nav__item">
            <a className="nav__link" href={sec("services")}>Services <Icon name="caret" /></a>
            <div className="mega mega--services">
              {SERVICES.map((s) => (
                <a key={s.t} className="mega__link" href={U(s.slug)}>
                  <span className="mega__ic"><Icon name={s.ic} /></span>
                  <span><span className="mega__t">{s.t}</span><span className="mega__d">{s.d}</span></span>
                </a>
              ))}
              <div className="mega__foot">
                <p><strong>Not sure what you need?</strong> Book a free, no-pressure roof inspection.</p>
                <a className="btn btn--primary btn--sm" href={U("contact")}>Free Inspection</a>
              </div>
            </div>
          </div>
          <div className="nav__item">
            <a className="nav__link" href={sec("property")}>Property Type <Icon name="caret" /></a>
            <div className="mega mega--prop">
              {PROPS.map((s) => (
                <a key={s.t} className="mega__link" href={U(s.slug)}>
                  <span className="mega__ic"><Icon name={s.ic} /></span>
                  <span><span className="mega__t">{s.t}</span><span className="mega__d">{s.d}</span></span>
                </a>
              ))}
            </div>
          </div>
          <div className="nav__item">
            <a className="nav__link" href={U("contact")}>Service Areas <Icon name="caret" /></a>
            <div className="mega mega--prop">
              {AREAS.map((s) => (
                <a key={s.t} className="mega__link" href={U(s.slug)}>
                  <span className="mega__ic"><Icon name={s.ic} /></span>
                  <span><span className="mega__t">{s.t}</span><span className="mega__d">{s.d}</span></span>
                </a>
              ))}
            </div>
          </div>
          <div className="nav__item"><a className="nav__link" href={U("portfolio")}>Portfolio</a></div>
          <div className="nav__item"><a className="nav__link" href={U("about")}>About</a></div>
          <div className="nav__item"><a className="nav__link" href={U("resources")}>Resources</a></div>
          <div className="nav__item"><a className="nav__link" href="/blog">Blog</a></div>
          <div className="nav__item"><a className="nav__link" href={U("contact")}>Contact</a></div>
        </nav>
        <div className="nav__right">
          <div className="nav__cta">
            <a className="nav__phone" href="tel:5207531758"><Icon name="phone" /><span>520-753-1758</span></a>
            <a className="btn btn--primary btn--sm" href={sec("contact")}>Free Roof Estimate</a>
            <a className="nav__call" href="tel:5207531758" aria-label="Call 520-753-1758"><Icon name="phone" /></a>
          </div>
          <button
            className={"burger " + (menuOpen ? "is-open" : "")}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

Object.assign(window, { TopBar, HeaderNav, MobileMenu, Logo, SERVICES, PROPS });
