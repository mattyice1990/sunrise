/* data-areas.js — 4 service-area (local SEO) pages. */
window.SEO = window.SEO || {};

/* shared builder keeps area pages consistent while letting each one carry
   its own neighborhoods, landmarks and keyword targets. */
function areaPage(o) {
  return {
    slug: o.slug, cat: "area", crumb: "Service Areas",
    title: `${o.city} Roofing Contractor — Sunrise Roofers`,
    desc: o.desc,
    kw: o.kw, secondary: o.secondary,
    hero: {
      eyebrow: `Roofing · ${o.city}, AZ`,
      h1: o.h1,
      sub: o.sub,
      chips: ["Local Tucson-area roofers", "Free inspections", "Licensed & Insured · ROC #358079", "Tile, shingle, metal & flat"],
    },
    intro: {
      kicker: `Serving ${o.city}`,
      h: `Your local roofer in ${o.city}`,
      lead: o.lead,
      bullets: ["Repairs, replacements & new roofs", "Tile, shingle, metal, foam & flat", "Storm & monsoon damage response", "Free, documented inspections"],
    },
    highlights: [
      { ic: "pin", t: `${o.city} Local`, d: `We know ${o.city}'s neighborhoods, HOAs and the way desert roofs age out here.` },
      { ic: "alert", t: "Storm Response", d: "Fast monsoon and storm damage response with emergency tarping and claim support." },
      { ic: "badge", t: "Licensed & Insured", d: "ROC #358079 — fully licensed, bonded and insured for your protection." },
    ],
    sections: [
      {
        kicker: "Full Service", h: `Everything ${o.city} roofs need`,
        p: [
          `From the first little leak all the way to a full replacement, we handle whatever ${o.city} roofs need, here and in the towns around it. Tile underlayment, shingle and metal installs, flat-roof coatings, emergency repairs, all from one local roofer you can actually count on.`,
          o.neigh ? `We're out in ${o.neigh} and the areas around them all the time, so we know the HOA rules and the kind of homes you tend to see around ${o.city}.` : "",
        ].filter(Boolean),
        cards: [
          { ic: "wrench", t: "Roof Repair", d: "Leaks, cracked tile, flashing and storm damage fixed to last." },
          { ic: "hammer", t: "Replacement", d: "Full re-roofs in tile, shingle, metal and foam." },
          { ic: "search", t: "Inspections", d: "Free, photo-documented condition reports and claim help." },
          { ic: "building", t: "Commercial", d: "Flat-roof systems and maintenance for local businesses." },
        ],
      },
    ],
    process: [
      { t: "Call or Book", d: `Reach us at 520-753-1758 to schedule your free ${o.city} roof inspection.` },
      { t: "Inspection", d: "We document the roof's condition with photos and clear findings." },
      { t: "Written Estimate", d: "Itemized pricing and honest repair-vs-replace guidance, with financing options." },
      { t: "Quality Work", d: "Our own crews, clean job sites and warranty-backed workmanship." },
    ],
    faqs: o.faqs,
    related: ["roof-repair", "roof-replacement", "tile-roofing", "roof-inspection"],
    ctaH: `Need a roofer in ${o.city}?`,
    ctaSub: `Free inspection and an honest estimate from a licensed local roofer who works ${o.city} and the rest of Pima County.`,
  };
}

Object.assign(window.SEO, {
  "roofing-tucson": areaPage({
    slug: "roofing-tucson", city: "Tucson",
    h1: "Roofing in Tucson, AZ",
    desc: "Trusted roofing contractor in Tucson, AZ. Roof repair, replacement, tile, metal, foam and commercial roofing built for the desert.",
    kw: { primary: "roofing contractors tucson", vol: 150, kd: 37, cpc: 1.1 },
    secondary: ["roofers tucson", "roofing tucson", "roofing companies tucson", "roof repair tucson"],
    sub: "From the Foothills to the west side, Tucson roofs catch the full brunt of the sun and the monsoons. We keep them watertight with repairs, replacements, tile work and commercial systems.",
    lead: [
      "Tucson's home base for us, and we know exactly how roofs wear out here. Underlayment baked brittle by the sun, tile that looks perfect but leaks, flat roofs that pond up after every monsoon. We've seen it and fixed it all over town.",
      "Being a local Tucson outfit, we do all of it under one roof: repairs, full replacements, tile underlayment, metal and foam, coatings, commercial flat roofs. Honest assessments, and the work's backed by warranty.",
    ],
    neigh: "the Catalina Foothills, Midtown, the east and west sides, Rita Ranch and downtown Tucson",
    faqs: [
      { q: "What areas of Tucson do you serve?", a: "All of it. Midtown, the Foothills, east and west Tucson, downtown, Rita Ranch and everything around them, plus the rest of Pima County, Oro Valley, Marana, Vail, Sahuarita." },
      { q: "What roofing services do you offer in Tucson?", a: "Roof repair, full replacements, tile underlayment, shingle, metal and foam installs, flat-roof coatings, gutters, skylights, commercial roofing, and 24/7 emergency storm response." },
      { q: "My Tucson tile roof looks fine but leaks — why?", a: "The tile can go 50-plus years, but the waterproof underlayment under it usually gives out around 20 to 25. That's almost always why a good-looking tile roof leaks. We pull your tile, lay new underlayment, and set the same tile back down, way cheaper than a whole new roof." },
      { q: "How fast can you respond to a roof leak in Tucson?", a: "Live leaks jump the line, same-week appointments and 24/7 tarping through monsoon season. Call 520-753-1758 and we'll give you a real window." },
      { q: "Are you a licensed Tucson roofing contractor?", a: "Yep. Sunrise Roofers LLC is licensed, bonded and insured under ROC #358079, and we're based right here in Tucson." },
    ],
  }),

  "roofing-oro-valley": areaPage({
    slug: "roofing-oro-valley", city: "Oro Valley",
    h1: "Roofing in Oro Valley, AZ",
    desc: "Trusted roofing contractor in Oro Valley, AZ. Roof repair, replacement, tile, metal and flat roofs for homes and businesses. Free estimate: 520-753-1758.",
    kw: { primary: "roof repair oro valley", vol: 60, kd: 0, cpc: 12 },
    secondary: ["roofing oro valley", "roofing companies oro valley", "roofers oro valley", "oro valley roofing contractors"],
    sub: "From Rancho Vistoso to the foothills homes, Oro Valley roofs take a beating from the sun and the monsoons. We keep them watertight with repairs, replacements and inspections.",
    lead: [
      "Oro Valley's full of beautiful tile-roofed homes and HOA communities, and they've got their own needs, mainly tile underlayment that wears out around 20 to 25 years even while the tile still looks perfect.",
      "We repair, re-felt and replace roofs all over Oro Valley, with the documentation and the show-up-when-we-say reliability HOAs and homeowners expect.",
    ],
    neigh: "Rancho Vistoso, Sun City Oro Valley, and the Catalina foothills communities",
    faqs: [
      { q: "Do you serve all of Oro Valley?", a: "Yep, all of Oro Valley, Rancho Vistoso, Sun City, the foothills communities, plus the rest of the Tucson area." },
      { q: "My Oro Valley tile roof looks fine but leaks — why?", a: "The tile can go 50-plus years, but the underlayment under it usually gives out around 20 to 25. That's the usual reason an otherwise good-looking tile roof leaks. We can pull your tile and re-lay it over new underlayment." },
      { q: "Do you work with Oro Valley HOAs?", a: "Yep. We know how HOA requirements work and we bring the documentation, scheduling and steady quality those communities need." },
      { q: "How much does roof repair cost in Oro Valley?", a: "Depends what's going on. A few tiles or a flashing fix is modest; underlayment or water-intrusion work runs more. Inspections are free and the estimate's itemized in writing." },
      { q: "Are you licensed and insured?", a: "Yep. Sunrise Roofers LLC is licensed, bonded and insured, ROC #358079." },
    ],
  }),

  "roofing-marana": areaPage({
    slug: "roofing-marana", city: "Marana",
    h1: "Roofing in Marana, AZ",
    desc: "Reliable roofing contractor in Marana, AZ. Roof repair, replacement, tile, shingle and metal roofs for homes and businesses. Free estimate: 520-753-1758.",
    kw: { primary: "roofing marana", vol: null, kd: null, cpc: null },
    secondary: ["roof repair marana", "roofing companies marana", "roofers marana az", "marana roofing contractors"],
    sub: "Marana's growing fast and a lot of it's newer builds, but it still deals with the same desert realities, UV, heat and monsoon storms. We keep Marana roofs protected with honest repairs, replacements and inspections.",
    lead: [
      "From Dove Mountain to Gladden Farms, Marana homes run from brand-new builds to older established neighborhoods, and every one of them needs a roof that can take the heat and the monsoon.",
      "We're a local crew covering Marana with the whole range: repairs, replacements, new installs, and free inspections with photos and a writeup.",
    ],
    neigh: "Dove Mountain, Gladden Farms, Continental Ranch and the Tortolita area",
    faqs: [
      { q: "Do you provide roofing in Marana?", a: "Yep, all of Marana, Dove Mountain, Gladden Farms, Continental Ranch and the areas around them, plus greater Tucson and Pima County." },
      { q: "My Marana home is newer — could it already need roof work?", a: "It can. The UV and monsoon storms are hard on even newer roofs, and builder-grade installs sometimes need the flashing or ventilation corrected. A free inspection tells you exactly where yours stands." },
      { q: "What roofing services do you offer in Marana?", a: "Roof repair, full replacements, tile underlayment, shingle and metal installs, flat-roof coatings, gutters, skylights, and emergency storm-damage response." },
      { q: "How fast can you respond to a roof leak in Marana?", a: "Live leaks jump the line, same-week appointments and 24/7 tarping through storm season." },
      { q: "Are you licensed and insured?", a: "Yep. Sunrise Roofers LLC is fully licensed, bonded and insured, ROC #358079." },
    ],
  }),

  "roofing-sahuarita-green-valley": areaPage({
    slug: "roofing-sahuarita-green-valley", city: "Sahuarita & Green Valley",
    h1: "Roofing in Sahuarita & Green Valley, AZ",
    desc: "Roofing contractor serving Sahuarita and Green Valley, AZ. Roof repair, replacement and inspections for homes, retirees and businesses.",
    kw: { primary: "roofing green valley az", vol: null, kd: null, cpc: 13 },
    secondary: ["roofing sahuarita", "roof repair sahuarita", "roofers green valley az", "sahuarita roofing companies"],
    sub: "We cover the Sahuarita and Green Valley communities south of Tucson, from Rancho Sahuarita's family neighborhoods to the established retirement communities in Green Valley. Honest roofing, done right.",
    lead: [
      "Folks in Sahuarita and Green Valley deserve a roofer who actually shows up, tells you what's going on in plain terms, and charges fair, and that goes double in Green Valley's retirement communities where trust really matters.",
      "We cover both communities with the whole range: repairs, replacements, tile underlayment work, and free inspections with photos and no pressure.",
    ],
    neigh: "Rancho Sahuarita, Quail Creek, Madera Highlands and the Green Valley retirement communities",
    faqs: [
      { q: "Do you serve Sahuarita and Green Valley?", a: "Yep, all over Sahuarita and Green Valley, Rancho Sahuarita, Quail Creek, Madera Highlands and the Green Valley retirement communities." },
      { q: "Do you offer honest, no-pressure estimates?", a: "Always. The inspection's free and the estimate's itemized and straightforward, no scare tactics. We're especially careful about that in the Green Valley retirement communities." },
      { q: "Can you replace tile underlayment in Green Valley?", a: "Yep. A lot of tile roofs around Green Valley and Sahuarita need new underlayment around the 20 to 25 year mark. We pull the existing tile and re-lay it over fresh underlayment, way cheaper than a whole new tile roof." },
      { q: "Do you handle insurance claims for storm damage?", a: "We do. We document monsoon and storm damage with photos and we'll work with your adjuster to back up the claim." },
      { q: "Are you licensed and insured?", a: "Yep. Sunrise Roofers LLC is licensed, bonded and insured, ROC #358079." },
    ],
  }),

  "roofing-vail-az": areaPage({
    slug: "roofing-vail-az", city: "Vail",
    h1: "Roofing in Vail & Corona de Tucson, AZ",
    desc: "Roofing contractor in Vail and Corona de Tucson, AZ. Roof repair, replacement, tile and metal roofs for homes and businesses. Free estimate: 520-753-1758.",
    kw: { primary: "roofing vail az", vol: null, kd: null, cpc: null },
    secondary: ["roof repair vail az", "roofers vail az", "roofing corona de tucson", "vail az roofing contractors"],
    sub: "We cover Vail and Corona de Tucson east of the city, the newer master-planned neighborhoods and the rural desert homes both. We keep your roof protected from sun, wind and monsoon storms.",
    lead: [
      "Vail and Corona de Tucson have grown fast, master-planned communities like Rancho del Lago sitting right alongside older rural properties, and all of them deal with the same desert sun and monsoon stress.",
      "We cover Vail with repairs, replacements, new roofs and free inspections with photos, and you get a real local crew you can actually get on the phone.",
    ],
    neigh: "Rancho del Lago, Del Webb at Rancho del Lago, and the Corona de Tucson area",
    faqs: [
      { q: "Do you provide roofing in Vail and Corona de Tucson?", a: "Yep, Vail, Corona de Tucson and the communities around them including Rancho del Lago and Del Webb, plus greater Tucson and Pima County." },
      { q: "My Vail home is in a newer community — what roof issues are common?", a: "Even newer roofs can pick up flashing, ventilation or storm-related issues in this climate. A free inspection catches anything that needs attention before it turns into a leak." },
      { q: "What roofing services do you offer in Vail?", a: "Roof repair, full replacements, tile underlayment, shingle and metal installs, flat-roof coatings, gutters, skylights, and 24/7 emergency storm response." },
      { q: "How quickly can you get to a leak in Vail?", a: "Live leaks jump the line, same-week appointments and 24/7 tarping through monsoon season." },
      { q: "Are you licensed and insured?", a: "Yep. Sunrise Roofers LLC is licensed, bonded and insured, ROC #358079." },
    ],
  }),
});
