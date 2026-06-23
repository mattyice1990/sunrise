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

// Real Google reviews (seed). GoogleReviews refreshes these live from
// /api/reviews on mount so the carousel always reflects the current Google
// Business Profile. Colors cycle through the Google palette for the avatars.
const GREV_COLORS = ["#4285F4", "#EA4335", "#34A853", "#FBBC05"];
const REVIEWS = [
  { n: "Julie McIntyre", c: "#4285F4", t: "a month ago", q: "Eddie and his crew were responsive, kind, and prompt. Eddie took time to come to my home on the edge of town and communicate about all the options. My second story pitch is steep with older tiles, and he and his crew were safety conscious and careful and they cleaned up the work site perfectly. Their knowledge and skill are reflected in the final outcome of my roof repair and I am very pleased!" },
  { n: "Maryfaith Marshall", c: "#EA4335", t: "2 months ago", q: "Eddie Guillen and all of the people with whom he works are outstanding: one thousand percent competent, and skilled, kind, generous, so clearly honest that I could just take a deep breath and trust whatever Eddie told me. They did a meticulous job on replacing our roof and it is beautiful. And he is very reasonably priced." },
  { n: "Alexis Fahlman", c: "#34A853", t: "3 months ago", q: "They were very responsive and quick to help me get an estimate on my client's roof! Provided a very detailed inspection with photos and videos explaining what work needs to be done! On top of being knowledgeable and diligent, he also was willing to work on the aluminum which is super helpful." },
  { n: "Sheryl Cain", c: "#FBBC05", dark: true, t: "2 months ago", q: "From start to finish, Sunrise Roofers gave a solid performance. Eddie Guillen gave our tile roof a thorough inspection, detailed estimate with pictures, and promptly replied to any questions. The materials used are of the highest quality, chosen to best endure our desert climate. I could not be happier. They deserve far more than five stars!" },
  { n: "Ernesto Ortega", c: "#4285F4", t: "11 months ago", q: "Eddie Guillen from Sunrise Roofers LLC did an outstanding job on my full roof replacement. He was professional, efficient, and paid close attention to every detail. He also gave me great preventative maintenance tips. Highly recommend Eddie and his team for anyone needing reliable, high-quality roofing services!" },
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
      <p className="grev-card__q">{r.q && r.q.length > 230 ? r.q.slice(0, 220).trim() + "…" : r.q}</p>
    </article>
  );
}

function GoogleReviews() {
  const [reviews, setReviews] = useState(REVIEWS);
  const [rating, setRating] = useState(5.0);
  const [total, setTotal] = useState(41);
  useEffect(() => {
    let alive = true;
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d) return;
        const mapped = (d.reviews || [])
          .filter((rv) => rv && rv.text && rv.rating >= 4)
          .map((rv, i) => ({ n: rv.author_name, c: GREV_COLORS[i % 4], dark: GREV_COLORS[i % 4] === "#FBBC05", t: rv.relative_time_description || "Google review", q: rv.text }));
        if (mapped.length) setReviews(mapped);
        if (d.rating) setRating(d.rating);
        if (d.totalReviews) setTotal(d.totalReviews);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  const loop = reviews.concat(reviews);
  return (
    <section className="section grev" id="reviews">
      <div className="container">
        <div className="grev-head">
          <div className="grev-rating">
            <GoogleG size={40} />
            <div>
              <div className="grev-rating__row">
                <span className="grev-rating__num">{Number(rating).toFixed(1)}</span>
                <GStars />
              </div>
              <p className="grev-rating__sub"><b>5-Star Rated</b> on Google · {total} reviews</p>
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
        <span className="grev-cta__txt">Rated 5.0 across {total} Google reviews from Tucson homeowners &amp; property managers.</span>
        <a className="grev-btn grev-btn--solid" href="https://www.google.com/maps?cid=2878962440155556072" target="_blank" rel="noopener">
          <GoogleG size={20} /> <span>Leave Us a Review</span>
        </a>
      </div>
    </section>
  );
}

Object.assign(window, { GoogleReviews });
