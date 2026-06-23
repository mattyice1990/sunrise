/* about.jsx — AboutSection (+ stats) + ProcessSteps */

const STATS = [
  { n: "20+", l: "Years of roofing experience" },
  { n: "6,400+", l: "Roofs repaired across Tucson" },
  { n: "1,900+", l: "Full roof replacements" },
  { n: "5★", l: "Rated on Google" },
];

function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="container about">
        <div className="about__media">
          <Slot id="about-crew" src="uploads/sunrise-crew.webp" ph="Crew / founder photo" radius="16" />
          <div className="about__badge">
            <div className="n">100%</div>
            <div className="t">Locally owned &amp; operated</div>
          </div>
        </div>
        <div className="about__copy">
          <p className="eyebrow">Local Roofing. Honest Work.</p>
          <h2 className="h2" style={{ marginBottom: 22 }}>The Kind of Roof You Stop Thinking About</h2>
          <p>
            We keep it simple around here: do the job right, tell you the truth, and
            leave you with a roof you don't have to think about anymore. That's the
            whole plan.
          </p>
          <p>
            Small leak or a whole new roof, we treat your place like it's our own &mdash;
            because for the next 20 years you're trusting it to keep the rain off your
            family. No storm-chasers knocking after a monsoon, no pressure. Just solid
            work and somebody who actually picks up when you call.
          </p>
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat-card" key={s.l}>
                <div className="n">{s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { ic: "search", t: "Schedule a Roof Inspection", d: "We get up there, find everything that's wrong, and document it all with photos so you can see it too." },
  { ic: "doc", t: "Get a Clear Estimate", d: "You get repair or replacement options in plain English, priced line by line, with nothing buried in the fine print." },
  { ic: "shield", t: "Protect Your Property", d: "Our crew does the work clean, safe and on schedule, then walks the whole thing with you when it's done." },
];

function ProcessSteps() {
  return (
    <section className="section deep">
      <div className="container">
        <div className="section-head center">
          <p className="eyebrow eyebrow--center">How To Get Started</p>
          <h2 className="h2">Three Simple Steps to a Better Roof</h2>
        </div>
        <div className="process">
          <div className="proc-connect"></div>
          {STEPS.map((s, i) => (
            <div className="proc-step" key={s.t}>
              <div className="proc-step__num">{String(i + 1).padStart(2, "0")}</div>
              <div className="proc-step__ic"><Icon name={s.ic} /></div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
        <div className="process-cta">
          <a className="btn btn--primary" href="#contact">Schedule My Roof Inspection <Icon name="arrow" /></a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { AboutSection, ProcessSteps });
