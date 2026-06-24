/* contact.jsx — ContactForm (validation + success) + Footer */

function Field({ k, label, type = "text", req, full, ph, value, onChange, err }) {
  return (
    <div className={"field" + (full ? " field--full" : "") + (err ? " has-error" : "")}>
      <label>{label} {req && <span className="req">*</span>}</label>
      <input type={type} value={value} onChange={onChange} placeholder={ph} />
      {err && <span className="field__err">{err}</span>}
    </div>
  );
}

function ContactForm() {
  const [type, setType] = useState("Residential");
  const [sent, setSent] = useState(false);
  const [vals, setVals] = useState({ name: "", phone: "", email: "", address: "", service: "", message: "" });
  const [errs, setErrs] = useState({});
  const [sending, setSending] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const set = (k) => (e) => setVals((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e) => {
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
          name: vals.name, phone: vals.phone, email: vals.email,
          address: vals.address, service: vals.service,
          message: vals.message, property_type: type,
        });
      }
    } catch (err) {}

    // Web3Forms → emails sunriseroofer@outlook.com. This is the same backend
    // the original roofwithsunrise.com contact form used and is what actually
    // delivers the lead. Only show success when the email truly goes out.
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "bb31a1fd-2cf0-4ea5-8920-18cad8059ed4",
          subject: "New Roofing Estimate Request - Sunrise Roofers",
          from_name: "Sunrise Roofers Website",
          property_type: type,
          name: vals.name, phone: vals.phone, email: vals.email,
          address: vals.address, service: vals.service, message: vals.message,
        }),
      });
      const result = await res.json();
      if (result.success) {
        try {
          if (typeof window.gtag === "function") {
            window.gtag("event", "generate_lead", { form_id: "contact-form", page_location: window.location.href });
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

  const F = (p) => <Field {...p} value={vals[p.k]} onChange={set(p.k)} err={errs[p.k]} />;

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact">
          <div className="contact__side">
            <p className="eyebrow">Let's Talk</p>
            <h2 className="h2" style={{ marginBottom: 16 }}>Let's Take a Look at Your Roof</h2>
            <p className="lead">Tell me what's going on up there &mdash; a leak, storm damage, an old roof that's seen better days, or a full replacement &mdash; and we'll get you on the books for a free inspection.</p>
            <div className="contact__info">
              <div className="contact__row">
                <span className="ic"><Icon name="phone" /></span>
                <span><span className="k">Call or text</span><span className="v" style={{ display: "block" }}>520-753-1758</span></span>
              </div>
              <div className="contact__row">
                <span className="ic"><Icon name="mail" /></span>
                <span><span className="k">Email</span><span className="v" style={{ display: "block" }}>sunriseroofer@outlook.com</span></span>
              </div>
              <div className="contact__row">
                <span className="ic"><Icon name="pin" /></span>
                <span><span className="k">Serving</span><span className="v" style={{ display: "block" }}>Tucson &amp; all of Pima County</span></span>
              </div>
              <div className="contact__row">
                <span className="ic"><Icon name="clock" /></span>
                <span><span className="k">Hours</span><span className="v" style={{ display: "block" }}>Mon–Fri 7–6 · Sat 8–4 · 24/7 Emergency</span></span>
              </div>
            </div>
            <div className="contact__trust">
              <span className="ti"><Icon name="badge" /> ROC #358079</span>
              <span className="ti"><Icon name="shield" /> Licensed &amp; Insured</span>
              <span className="ti"><Icon name="star" /> 5-Star Rated on Google</span>
            </div>
          </div>

          <div className="contact__form">
            {sent ? (
              <div className="form-success">
                <div className="ic"><Icon name="check-c" /></div>
                <h3>Request Received</h3>
                <p>Thanks, {vals.name.split(" ")[0] || "there"}! I'll get back to you within a business day to set up your free inspection. If it's leaking right now, don't wait on email &mdash; call or text 520-753-1758.</p>
                <button className="btn btn--ghost btn--sm" style={{ marginTop: 24 }} onClick={() => { setSent(false); setVals({ name: "", phone: "", email: "", address: "", service: "", message: "" }); }}>Submit Another Request</button>
              </div>
            ) : (
              <form className="form-grid" onSubmit={submit} noValidate>
                {F({ k: "name", label: "Full Name", req: true, ph: "Jane Doe" })}
                {F({ k: "phone", label: "Phone", type: "tel", req: true, ph: "(520) 555-0123" })}
                {F({ k: "email", label: "Email", type: "email", req: true, full: true, ph: "jane@email.com" })}
                {F({ k: "address", label: "Property Address", full: true, ph: "123 E Speedway Blvd, Tucson" })}
                <div className={"field" + (errs.service ? " has-error" : "")}>
                  <label>Service Needed <span className="req">*</span></label>
                  <select value={vals.service} onChange={set("service")}>
                    <option value="">Select a service…</option>
                    <option>Roof Repair</option>
                    <option>Roof Replacement</option>
                    <option>Metal Roof Installation</option>
                    <option>Tile Roofing</option>
                    <option>Flat Roof / Coatings</option>
                    <option>Commercial Roofing</option>
                    <option>Roof Inspection</option>
                    <option>Storm / Monsoon Damage</option>
                  </select>
                  {errs.service && <span className="field__err">{errs.service}</span>}
                </div>
                <div className="field">
                  <label>Property Type</label>
                  <div className="seg">
                    {["Residential", "Commercial"].map((t) => (
                      <button type="button" key={t} className={type === t ? "is-on" : ""} onClick={() => setType(t)}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="field field--full">
                  <label>Message</label>
                  <textarea value={vals.message} onChange={set("message")} placeholder="Tell us what's going on with your roof…"></textarea>
                </div>
                <div className="field field--full">
                  <label>Photos (optional)</label>
                  <label className="upload"><Icon name="camera" /> Drag roof photos here, or click to upload</label>
                </div>
                <div className="field--full">
                  {submitErr && <p className="field__err" style={{ marginBottom: 12, display: "block" }}>{submitErr}</p>}
                  <button className="btn btn--primary btn--block" type="submit" disabled={sending}>
                    {sending ? "Sending…" : <>Request My Free Roof Estimate <Icon name="arrow" /></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const U = (slug) => (window.SUNRISE ? window.SUNRISE.url(slug) : "/" + slug);
  const col = (h, items) => (
    <div className="footer__col">
      <h4>{h}</h4>
      {items.map((x) => <a key={x.t} href={x.href || U(x.s)}>{x.t}</a>)}
    </div>
  );
  return (
    <footer className="footer" id="footer">
      <Roofline />
      <div className="container">
        <div className="footer__main">
          <div className="footer__brand">
            <Logo />
            <p>Tucson roofers, family-owned. Repair, replacement, metal, tile, flat roofs and commercial systems &mdash; all built for the desert.</p>
            <div className="footer__socials">
              <a href="https://www.facebook.com/people/Sunrise-Roofers-LLC/61580211666613/" target="_blank" rel="noopener" aria-label="Facebook"><Icon name="fb" /></a>
              <a href="https://www.instagram.com/sunriseroofersllc/" target="_blank" rel="noopener" aria-label="Instagram"><Icon name="ig" /></a>
              <a href="https://www.google.com/maps?cid=2878962440155556072" target="_blank" rel="noopener" aria-label="Google"><Icon name="google" /></a>
              <a href="https://www.youtube.com/@Sunriseroofers520" target="_blank" rel="noopener" aria-label="YouTube"><Icon name="yt" /></a>
            </div>
          </div>
          {col("Roofing Services", [
            { t: "Roof Repair", s: "roof-repair" },
            { t: "Roof Replacement", s: "roof-replacement" },
            { t: "Roof Installation", s: "roof-installation" },
            { t: "Roof Inspection", s: "roof-inspection" },
            { t: "Emergency Repair", s: "emergency-roof-repair" },
            { t: "Gutter Installation", s: "gutter-installation" },
            { t: "Skylight Installation", s: "skylight-installation" },
          ])}
          {col("Roof Types", [
            { t: "Metal Roofing", s: "metal-roofing" },
            { t: "Tile Roofing", s: "tile-roofing" },
            { t: "Shingle Roofing", s: "shingle-roofing" },
            { t: "Flat Roofing", s: "flat-roofing" },
            { t: "Foam Roofing", s: "foam-roofing" },
            { t: "Roof Coatings", s: "roof-coatings" },
          ])}
          {col("Service Areas", [
            { t: "Tucson", s: "roofing-tucson" },
            { t: "Oro Valley", s: "roofing-oro-valley" },
            { t: "Marana", s: "roofing-marana" },
            { t: "Sahuarita / Green Valley", s: "roofing-sahuarita-green-valley" },
            { t: "Vail", s: "roofing-vail-az" },
            { t: "Residential", s: "residential-roofing" },
            { t: "Commercial", s: "commercial-roofing" },
          ])}
          {col("Company", [
            { t: "About Us", s: "about" },
            { t: "Roofing Projects", s: "portfolio" },
            { t: "Reviews", s: "reviews" },
            { t: "Resources", s: "resources" },
            { t: "Blog", href: "/blog" },
            { t: "Contact", s: "contact" },
          ])}
        </div>
        <div className="footer__bottom">
          <span>© 2026 Sunrise Roofers LLC. All rights reserved.</span>
          <div className="lic">
            <span>ROC #358079 · Licensed, Bonded &amp; Insured</span>
            <span>Tucson, Arizona</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { ContactForm, Footer });
