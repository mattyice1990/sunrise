/* owner.jsx — MeetOwner (name kept so app.js keeps mounting it): the dark
   trust band after About. Same jagged hand-cut "sticker" + comic speech
   bubble, but it now speaks for the crew, not a named owner — the company
   asked (Nov 2026) that the site be team-focused and name no individuals.
   Photo is baked in via Slot src= but stays swappable in the editor. */
function MeetOwner() {
  const POINTS = [
    "20-plus years on Arizona roofs — roofing's a family trade for us, and our crew has spent its career learning what holds up against our heat and monsoons.",
    "GAF-certified, and particular about it. We won't put anything up there we wouldn't put on our own houses.",
    "No commission reps, no closers. You call, you get the people who do the work — usually with our boots still on.",
  ];
  return (
    <section className="section dark owner" id="owner">
      <div className="container owner__grid">
        <div className="owner__media">
          <div className="owner__bubble">
            <p className="owner__bubble-hi">Mornin'&hellip;</p>
            <p className="owner__bubble-line">We've caught more sunrises up here than on our own porches.</p>
          </div>
          <div className="owner__photo">
            <Slot id="owner-eddie" src="uploads/roof-installation-tucson.jpg" ph="Crew on a roof" alt="Sunrise Roofers crew working on a roof in Tucson, AZ" />
          </div>
        </div>

        <div className="owner__copy">
          <p className="eyebrow">Meet the Team</p>
          <h2 className="h2">The crew that quotes your roof is the crew that builds it.</h2>
          <p className="owner__lead">
            Sunrise Roofers started because we got tired of watching folks get talked
            into roofs they didn't need. Roofing's a family trade for us, and our team
            has spent its career on Arizona rooftops &mdash; learning firsthand what
            actually holds up against our heat and monsoons. Quick leak or a full
            tear-off, one of our own roofers comes out to look at it, tells you straight
            what it needs, and gives you a price that doesn't move. No salesmen, no
            runaround &mdash; just a local crew that takes every job personally.
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
