/* seo-links.js — canonical page registry + nav/footer link map.
   Loaded FIRST (before nav.jsx) on every page so navigation, breadcrumbs,
   related-link grids and the footer all resolve to real page URLs. */
(function () {
  const S = (window.SUNRISE = window.SUNRISE || {});

  S.HOME = "/";
  S.PHONE = "520-753-1758";
  S.PHONE_HREF = "tel:5207531758";
  S.EMAIL = "sunriseroofer@outlook.com";

  // slug -> page URL. "home" is special. Absolute + extensionless to match Vercel
  // cleanUrls, the sitemap, canonicals and the static boot-splash links (so every
  // internal link is one consistent crawlable form, never relative or *.html).
  S.url = (slug) => (slug === "home" ? S.HOME : "/" + encodeURIComponent(slug));

  // Service pages (13) — grouped into mega-menu columns.
  S.SERVICES = [
    { slug: "roof-repair",          t: "Roof Repair",            ic: "wrench",   d: "Leaks, flashing, storm & cracked-tile fixes", grp: "Repair & Restore" },
    { slug: "roof-replacement",     t: "Roof Replacement",       ic: "hammer",   d: "Full tear-offs built for the long haul",      grp: "Replace & Install" },
    { slug: "roof-installation",    t: "New Roof Installation",  ic: "home",     d: "New-build & re-roof systems, done right",     grp: "Replace & Install" },
    { slug: "roof-inspection",      t: "Roof Inspection",        ic: "search",   d: "Free, documented condition reports",          grp: "Repair & Restore" },
    { slug: "emergency-roof-repair",t: "Emergency & Storm Damage",ic: "alert",   d: "24/7 response, tarping & insurance support",  grp: "Repair & Restore" },
    { slug: "tile-roofing",         t: "Tile Roofing",           ic: "layers",   d: "Repair, re-felt, underlayment & install",     grp: "Roof Types" },
    { slug: "flat-roofing",         t: "Flat Roofing",           ic: "ruler",    d: "TPO, modified bitumen & built-up systems",    grp: "Roof Types" },
    { slug: "foam-roofing",         t: "Foam Roofing (SPF)",     ic: "droplet",  d: "Seamless spray foam for flat & low-slope",    grp: "Roof Types" },
    { slug: "roof-coatings",        t: "Roof Coatings",          ic: "shield",   d: "Elastomeric & silicone reflective coatings",  grp: "Roof Types" },
    { slug: "metal-roofing",        t: "Metal Roofing",          ic: "factory",  d: "Standing seam, durable & energy-efficient",   grp: "Roof Types" },
    { slug: "shingle-roofing",      t: "Shingle Roofing",        ic: "home",     d: "Architectural asphalt shingle systems",       grp: "Roof Types" },
    { slug: "gutter-installation",  t: "Gutter Installation",    ic: "droplet",  d: "Seamless gutters, guards & drainage",         grp: "Add-ons" },
    { slug: "skylight-installation",t: "Skylight Installation",  ic: "sun",      d: "Skylights, solar tubes & natural light",      grp: "Add-ons" },
  ];

  // Property / segment hubs (2)
  S.SEGMENTS = [
    { slug: "residential-roofing", t: "Residential Roofing", ic: "home",     d: "Homes, HOAs & multi-family" },
    { slug: "commercial-roofing",  t: "Commercial Roofing",  ic: "building", d: "Offices, retail, warehouse & industrial" },
  ];

  // Service areas (5)
  S.AREAS = [
    { slug: "roofing-tucson",                t: "Tucson",                ic: "pin", d: "Roofing across Tucson, AZ" },
    { slug: "roofing-oro-valley",            t: "Oro Valley",            ic: "pin", d: "Roofing in Oro Valley, AZ" },
    { slug: "roofing-marana",                t: "Marana",                ic: "pin", d: "Roofing in Marana, AZ" },
    { slug: "roofing-sahuarita-green-valley",t: "Sahuarita / Green Valley", ic: "pin", d: "Roofing in Sahuarita & Green Valley" },
    { slug: "roofing-vail-az",               t: "Vail / Corona de Tucson", ic: "pin", d: "Roofing in Vail, AZ" },
  ];

  S.CORE = [
    { slug: "portfolio", t: "Portfolio" },
    { slug: "about",     t: "About" },
    { slug: "resources", t: "Resources" },
    { slug: "contact",   t: "Contact" },
  ];

  // quick lookup slug -> {t}
  S.ALL = {};
  [...S.SERVICES, ...S.SEGMENTS, ...S.AREAS, ...S.CORE].forEach((p) => (S.ALL[p.slug] = p));
})();
