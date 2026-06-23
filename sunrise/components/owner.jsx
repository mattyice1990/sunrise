/* owner.jsx — MeetOwner: the primary founder section, now built around the
   jagged hand-cut "sticker" of Eddie + a comic speech bubble (moved down from the
   old post-hero peek) PLUS the real blurb about who Eddie is. Dark band placed
   after About so Eddie anchors the homepage's trust story. Photo is baked in via
   Slot src= but stays swappable in the editor. */
function MeetOwner() {
  const POINTS = [
    "20-plus years on Arizona roofs — roofing's a family trade for us, and I've spent my career learning what holds up against our heat and monsoons.",
    "GAF-certified, and particular about it. I won't put anything up there I wouldn't put on my own house.",
    "No commission reps, no closers. You call, you get me — usually with my boots still on.",
  ];
  return (
    <section className="section dark owner" id="owner">
      <div className="container owner__grid">
        <div className="owner__media">
          <div className="owner__bubble">
            <p className="owner__bubble-hi">Mornin'&hellip;</p>
            <p className="owner__bubble-line">Caught more sunrises up here than on my own porch.</p>
          </div>
          <div className="owner__photo">
            <Slot id="owner-eddie" src="uploads/Roof%20Installation_edited.jpg" ph="Eddie on a roof" alt="Eddie Guillen, owner of Sunrise Roofers, working on a roof in Tucson, AZ" />
          </div>
        </div>

        <div className="owner__copy">
          <p className="eyebrow">Meet the Owner</p>
          <h2 className="h2">Hi, I'm Eddie &mdash; I'll be the one up on your roof.</h2>
          <p className="owner__lead">
            I started Sunrise Roofers because I got tired of watching folks get talked
            into roofs they didn't need. Roofing's a family trade for us, and I've spent
            my career on Arizona rooftops &mdash; learning firsthand what actually holds
            up against our heat and monsoons. Quick leak or a full tear-off, I'll come
            look at it myself, tell you straight what it needs, and give you a price that
            doesn't move. No salesmen, no runaround &mdash; just me and a crew that takes
            every job personally.
          </p>
          <ul className="owner__points">
            {POINTS.map((t) => (
              <li key={t}><span className="owner__tick"><Icon name="check" /></span><span>{t}</span></li>
            ))}
          </ul>
          <div className="owner__foot">
            <div className="owner__roc">
              <PlaqueIcon size={42} />
              <div className="owner__roc-txt">Licensed, bonded &amp; insured<b>ROC #358079</b></div>
            </div>
            <div className="owner__cta">
              <a className="btn btn--primary" href="#contact">Get My Free Estimate <Icon name="arrow" /></a>
              <a className="btn btn--on-dark" href="tel:520-753-1758"><Icon name="phone" /> (520) 753-1758</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { MeetOwner });
