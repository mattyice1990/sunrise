/* reviews.jsx — Google Reviews floating carousel */

const GoogleG = ({ size = 22 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: "block", flex: "none" }}>
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
    <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
  </svg>
);

const GStars = () => (
  <div className="grev-stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" width="17" height="17"><path fill="#FBBC05" d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z"/></svg>
    ))}
  </div>
);

const REVIEWS = [
  { n: "Dana Reyes", c: "#4285F4", t: "2 weeks ago", q: "Found the actual source of our monsoon leak after two other companies just patched the surface. Honest, fast, and the crew left the yard spotless." },
  { n: "Marcus Tran", c: "#EA4335", t: "1 month ago", q: "The only roofer we trust with phased work across our HOA communities. Clear service logs, clear pricing, and the board never gets surprises." },
  { n: "Lena Koch", c: "#34A853", t: "3 weeks ago", q: "Recoated our warehouse roof instead of pushing a full tear-off — saved us thousands and it hasn't leaked since. That kind of honesty earns repeat business." },
  { n: "Robert Hale", c: "#FBBC05", dark: true, t: "1 week ago", q: "Our new concrete tile roof looks incredible. The crew was respectful, on time every single day, and cleaned up like they were never here." },
  { n: "Sandra Mireles", c: "#4285F4", t: "2 months ago", q: "They walked me through repair vs. replacement with zero pressure. Turned out I just needed a repair — they easily could have sold me a whole roof." },
  { n: "James Powell", c: "#EA4335", t: "5 days ago", q: "Metal roof install was flawless and the house already stays cooler in the afternoon. Worth every penny and the financing made it easy." },
  { n: "Olivia Castro", c: "#34A853", t: "3 days ago", q: "A storm knocked tiles loose right before monsoon season. They came out the next day, sealed everything up, and put my mind at ease." },
  { n: "Daniel Vega", c: "#4285F4", t: "1 month ago", q: "Professional from the estimate to the final walkthrough. Fair price, great communication, and they actually answer the phone when you call." },
];

function ReviewCard({ r }) {
  return (
    <article className="grev-card">
      <div className="grev-card__top">
        <span className="grev-av" style={{ background: r.c, color: r.dark ? "#1E1E1E" : "#fff" }}>{r.n[0]}</span>
        <div className="grev-card__id">
          <span className="grev-card__nm">{r.n}</span>
          <span className="grev-card__t">{r.t}</span>
        </div>
        <GoogleG size={20} />
      </div>
      <GStars />
      <p className="grev-card__q">{r.q}</p>
    </article>
  );
}

function GoogleReviews() {
  const loop = REVIEWS.concat(REVIEWS);
  return (
    <section className="section grev" id="reviews">
      <div className="container">
        <div className="grev-head">
          <div className="grev-rating">
            <GoogleG size={40} />
            <div>
              <div className="grev-rating__row">
                <span className="grev-rating__num">5.0</span>
                <GStars />
              </div>
              <p className="grev-rating__sub"><b>5-Star Rated</b> on Google</p>
            </div>
          </div>
          <div className="grev-head__txt">
            <p className="eyebrow">What Tucson Says</p>
            <h2 className="h2">Reviewed &amp; Rated on Google</h2>
          </div>
          <a className="grev-btn" href="https://www.google.com/maps?cid=2878962440155556072" target="_blank" rel="noopener">
            <GoogleG size={20} /> <span>Read all reviews</span>
          </a>
        </div>
      </div>
      <div className="grev-marquee">
        <div className="grev-track">
          {loop.map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>
      <div className="container grev-cta">
        <span className="grev-cta__txt">Joined hundreds of happy Tucson homeowners &amp; property managers.</span>
        <a className="grev-btn grev-btn--solid" href="https://www.google.com/maps?cid=2878962440155556072" target="_blank" rel="noopener">
          <GoogleG size={20} /> <span>Leave Us a Review</span>
        </a>
      </div>
    </section>
  );
}

Object.assign(window, { GoogleReviews });
