/* servicearea.jsx — "Areas We Serve" section: a Google Maps service-area
   radius map (40-mile coverage circle + office and Benson markers), lazy-loaded
   on scroll, beside a list of the cities we cover. Restored from the pre-redesign
   site and re-skinned to the new theme. */

const SA = {
  key: "AIzaSyBvvwXnVB5WxLjHG091gU0R-uOBodS8pMM",
  mapId: "SUNRISE_ROOFERS_MAP",
  radiusMiles: 40,
  business: {
    title: "Sunrise Roofers LLC",
    address1: "7320 N La Cholla Blvd, Ste 154-276",
    address2: "Tucson, AZ 85741",
    coords: { lat: 32.3399923325422, lng: -111.0119592071643 },
  },
  benson: {
    title: "Benson Service Area",
    address: "Benson, AZ 85602",
    coords: { lat: 31.9678809, lng: -110.2945396 },
  },
};

const SA_AREAS = [
  { t: "Tucson", s: "roofing-tucson" },
  { t: "Oro Valley", s: "roofing-oro-valley" },
  { t: "Marana", s: "roofing-marana" },
  { t: "Sahuarita", s: "roofing-sahuarita-green-valley" },
  { t: "Green Valley", s: "roofing-sahuarita-green-valley" },
  { t: "Vail", s: "roofing-vail-az" },
  { t: "Catalina Foothills" },
  { t: "Rita Ranch" },
  { t: "Benson" },
];

function ServiceArea() {
  const secRef = useRef(null);
  const mapRef = useRef(null);
  const U = (slug) => (window.SUNRISE ? window.SUNRISE.url(slug) : slug + ".html");

  useEffect(() => {
    const sec = secRef.current, host = mapRef.current;
    if (!sec || !host) return;
    let started = false;

    window.__sunriseInitMap = async function () {
      if (!window.google || !google.maps) return;
      try {
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

        const map = new Map(host, {
          center: SA.business.coords,
          mapTypeControl: false, streetViewControl: false,
          fullscreenControl: true, zoomControl: true, mapId: SA.mapId,
        });

        const circle = new google.maps.Circle({
          strokeColor: "#F0801C", strokeOpacity: 0.85, strokeWeight: 2,
          fillColor: "#F0801C", fillOpacity: 0.12, map,
          center: SA.business.coords, radius: SA.radiusMiles * 1609.34,
        });
        map.fitBounds(circle.getBounds());
        setTimeout(() => { const z = map.getZoom(); if (z) map.setZoom(z - 0.2); }, 120);

        const pin = new PinElement({ background: "#F0801C", borderColor: "#fff", glyphColor: "#fff", scale: 1.3 });
        const marker = new AdvancedMarkerElement({ position: SA.business.coords, map, title: SA.business.title, content: pin.element });
        const info = new google.maps.InfoWindow({ content:
          '<div style="font-family:Barlow,Arial,sans-serif;padding:8px 10px;max-width:280px">' +
          '<h3 style="margin:0 0 6px;color:#C2620E;font-family:&quot;Barlow Condensed&quot;,sans-serif;font-size:20px;letter-spacing:.4px">' + SA.business.title + '</h3>' +
          '<p style="margin:2px 0;font-size:13px;color:#555;line-height:1.5">' + SA.business.address1 + '<br>' + SA.business.address2 + '</p>' +
          '<p style="margin:8px 0 0;color:#1f1f1f;font-weight:700;font-size:13px">&#9679; ' + SA.radiusMiles + '-mile service radius</p></div>' });
        marker.addListener("click", () => info.open(map, marker));
        setTimeout(() => info.open(map, marker), 600);

        const bpin = new PinElement({ background: "#C2620E", borderColor: "#fff", glyphColor: "#fff", scale: 1.1 });
        const bmarker = new AdvancedMarkerElement({ position: SA.benson.coords, map, title: SA.benson.title, content: bpin.element });
        const binfo = new google.maps.InfoWindow({ content:
          '<div style="font-family:Barlow,Arial,sans-serif;padding:8px 10px;max-width:240px">' +
          '<h3 style="margin:0 0 6px;color:#C2620E;font-family:&quot;Barlow Condensed&quot;,sans-serif;font-size:18px">' + SA.benson.title + '</h3>' +
          '<p style="margin:2px 0;font-size:13px;color:#555">' + SA.benson.address + '</p>' +
          '<p style="margin:8px 0 0;color:#1f1f1f;font-weight:700;font-size:13px">&#10003; Full service coverage</p></div>' });
        bmarker.addListener("click", () => binfo.open(map, bmarker));
      } catch (e) { /* if Maps fails to load, the area list below still renders */ }
    };

    const load = () => {
      if (started) return;
      started = true;
      if (window.google && window.google.maps) { window.__sunriseInitMap(); return; }
      const s = document.createElement("script");
      s.src = "https://maps.googleapis.com/maps/api/js?key=" + SA.key + "&loading=async&callback=__sunriseInitMap";
      s.async = true;
      document.head.appendChild(s);
    };

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((ents) => {
        ents.forEach((en) => { if (en.isIntersecting) { load(); obs.disconnect(); } });
      }, { rootMargin: "300px" });
      obs.observe(sec);
      return () => obs.disconnect();
    }
    load();
  }, []);

  return (
    <section className="section svc-area" id="service-area" ref={secRef}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Where We Work</p>
          <h2 className="h2">Roofing Across Tucson &amp; Southern Arizona</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            Based in Tucson and covering a {SA.radiusMiles}-mile radius — from Oro Valley
            and Marana down through Sahuarita, Green Valley and Vail, out to Benson.
          </p>
        </div>
        <div className="svc-area__grid">
          <div className="svc-area__map" ref={mapRef} role="img"
               aria-label="Map of the Sunrise Roofers 40-mile service area around Tucson, Arizona"></div>
          <div className="svc-area__side">
            <h3 className="svc-area__h3">Areas We Serve</h3>
            <div className="svc-area__chips">
              {SA_AREAS.map((a) => (
                a.s
                  ? <a key={a.t} className="svc-chip svc-chip--link" href={U(a.s)}><Icon name="pin" /> {a.t}</a>
                  : <span key={a.t} className="svc-chip"><Icon name="pin" /> {a.t}</span>
              ))}
            </div>
            <p className="svc-area__note">Not sure if you're in range? Just ask — if you're anywhere in the Tucson metro, odds are we've got you covered.</p>
            <a className="btn btn--primary" href="#contact">Check Your Address <Icon name="arrow" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ServiceArea });
