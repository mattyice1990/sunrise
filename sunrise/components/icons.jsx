/* icons.jsx — inline line-icon set + small shared primitives */
const { useState, useEffect, useRef } = React;
window.useState = useState; window.useEffect = useEffect; window.useRef = useRef;

const I = ({ d, fill, w = 24, sw = 1.9, children, vb = 24 }) => (
  <svg viewBox={`0 0 ${vb} ${vb}`} width="1em" height="1em" fill={fill ? "currentColor" : "none"}
       stroke={fill ? "none" : "currentColor"} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
       style={{ width: "1em", height: "1em" }}>
    {d ? <path d={d} /> : children}
  </svg>
);

function Icon({ name, ...p }) {
  switch (name) {
    case "phone": return <I {...p} d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L17 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 1-2z" />;
    case "mail": return <I {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></I>;
    case "alert": return <I {...p}><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4"/><path d="M12 17h.01"/></I>;
    case "pin": return <I {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></I>;
    case "clock": return <I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></I>;
    case "shield": return <I {...p}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z"/><path d="m9.2 12 2 2 3.6-3.8"/></I>;
    case "badge": return <I {...p}><circle cx="12" cy="9" r="5.5"/><path d="m9 13-1.5 7L12 18l4.5 2L15 13"/><path d="m9.6 9 1.6 1.6L14.4 7.4" /></I>;
    case "check": return <I {...p} d="M4 12.5 9 17.5 20 6.5" />;
    case "check-c": return <I {...p}><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.4 2.4 4.6-4.8"/></I>;
    case "caret": return <I {...p} sw="2.4" d="m6 9 6 6 6-6" />;
    case "arrow": return <I {...p} d="M5 12h14M13 6l6 6-6 6" />;
    case "plus": return <I {...p} d="M12 5v14M5 12h14" />;
    case "star": return <I {...p} fill d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z" />;
    case "wrench": return <I {...p}><path d="M15.5 7.5a4 4 0 0 1-5 5l-6 6 2 2 6-6a4 4 0 0 0 5-5l-2 2-2-2 2-2z"/></I>;
    case "hammer": return <I {...p}><path d="M14 6l4 4"/><path d="M3 21l9-9"/><path d="M14.5 5.5 18 2l4 4-3.5 3.5-1.5-1.5-3-3z"/></I>;
    case "home": return <I {...p}><path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/></I>;
    case "building": return <I {...p}><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/><path d="M10 21v-3h4v3"/></I>;
    case "store": return <I {...p}><path d="M4 9 5 4h14l1 5"/><path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/><path d="M5 9.5V20h14V9.5"/><path d="M9 20v-5h4v5"/></I>;
    case "layers": return <I {...p}><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/></I>;
    case "sun": return <I {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></I>;
    case "droplet": return <I {...p}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></I>;
    case "truck": return <I {...p}><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/></I>;
    case "users": return <I {...p}><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.8"/><path d="M17 14a6 6 0 0 1 4 6"/></I>;
    case "factory": return <I {...p}><path d="M3 21V9l5 3V9l5 3V6l5 3v12H3z"/><path d="M7 21v-4M12 21v-4M17 21v-4"/></I>;
    case "leaf": return <I {...p}><path d="M5 19C4 12 9 5 19 5c0 10-7 15-14 14z"/><path d="M5 19 12 12"/></I>;
    case "msg": return <I {...p}><path d="M4 5h16v11H9l-5 4V5z"/></I>;
    case "search": return <I {...p}><circle cx="11" cy="11" r="6"/><path d="m20 20-3.5-3.5"/></I>;
    case "camera": return <I {...p}><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.2"/></I>;
    case "ruler": return <I {...p}><rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></I>;
    case "chat": return <I {...p}><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1.2-4.8A8 8 0 1 1 21 12z"/></I>;
    case "doc": return <I {...p}><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 13h6M10 16h6"/></I>;
    case "split": return <I {...p}><path d="M8 7 4 12l4 5M16 7l4 5-4 5"/></I>;
    case "fb": return <I {...p} fill d="M14 9V7c0-1 .5-1.5 1.5-1.5H17V2.5h-2.5C12 2.5 11 4 11 6.5V9H9v3h2v9.5h3V12h2.2l.5-3H14z"/>;
    case "ig": return <I {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/></I>;
    case "x": return <I {...p} fill d="M17.5 3h3l-7 8 8 10h-6l-4.5-6-5 6H3l7.5-9L3 3h6l4 5.5L17.5 3z"/>;
    case "yt": return <I {...p}><rect x="3" y="6" width="18" height="12" rx="3"/><path d="m10 9 5 3-5 3V9z" fill="currentColor" stroke="none"/></I>;
    case "google": return <I {...p} fill d="M21 12.2c0-.7-.06-1.2-.2-1.8H12v3.4h5.1c-.1.9-.7 2.2-1.9 3.1l-.02.1 2.8 2.1.2.02C19.9 17.4 21 15 21 12.2zM12 21c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8l-.1.01-3 2.3-.04.1C5.3 19 8.4 21 12 21zM6.9 13.7c-.2-.6-.3-1.1-.3-1.7s.1-1.2.3-1.7v-.1l-3-2.3-.1.05C3.3 9.2 3 10.6 3 12s.3 2.8.8 4l3.1-2.3zM12 6.6c1.7 0 2.8.7 3.5 1.3l2.5-2.5C16.5 4 14.4 3 12 3 8.4 3 5.3 5 3.8 8l3.1 2.4C7.6 8.2 9.6 6.6 12 6.6z"/>;
    default: return <I {...p}><circle cx="12" cy="12" r="9"/></I>;
  }
}

const Stars = ({ n = 5, cls = "" }) => (
  <div className={cls} style={{ display: "flex", gap: 2 }}>
    {Array.from({ length: n }).map((_, i) => <Icon key={i} name="star" />)}
  </div>
);

/* roofline zig-zag divider */
const Roofline = ({ color }) => (
  <div className="roofline" style={color ? { color } : null}>
    <svg viewBox="0 0 1200 14" preserveAspectRatio="none">
      <path d="M0 14 L40 2 L80 14 L120 2 L160 14 L200 2 L240 14 L280 2 L320 14 L360 2 L400 14 L440 2 L480 14 L520 2 L560 14 L600 2 L640 14 L680 2 L720 14 L760 2 L800 14 L840 2 L880 14 L920 2 L960 14 L1000 2 L1040 14 L1080 2 L1120 14 L1160 2 L1200 14"
        fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  </div>
);

const Slot = ({ id, ph, alt, style, shape = "rounded", radius, src }) => (
  <image-slot id={id} placeholder={ph} alt={alt || ph} shape={shape} radius={radius} src={src} style={style}></image-slot>
);

/* Brand: 4-color Google G */
const GoogleGColor = ({ size = 30 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} style={{ display: "block", flex: "none" }}>
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
    <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
  </svg>
);

/* Brand: BBB Accredited seal (stylized) */
const BBBLogo = ({ size = 44 }) => (
  <svg viewBox="0 0 64 44" width={size} height={size * 44 / 64} style={{ display: "block", flex: "none" }}>
    <rect width="64" height="44" rx="6" fill="#00558C"/>
    <path d="M14 13h7c2.4 0 4 1.2 4 3.2 0 1.3-.7 2.2-1.8 2.7 1.4.4 2.3 1.4 2.3 3 0 2.2-1.7 3.5-4.4 3.5H14V13zm6.3 5c1 0 1.6-.4 1.6-1.2s-.6-1.2-1.6-1.2h-2.6V18h2.6zm.3 5c1.1 0 1.7-.4 1.7-1.3 0-.8-.6-1.3-1.8-1.3h-2.8V23h2.9z" fill="#fff"/>
    <path d="M27.5 13h7c2.4 0 4 1.2 4 3.2 0 1.3-.7 2.2-1.8 2.7 1.4.4 2.3 1.4 2.3 3 0 2.2-1.7 3.5-4.4 3.5h-7.1V13zm6.3 5c1 0 1.6-.4 1.6-1.2s-.6-1.2-1.6-1.2h-2.6V18h2.6zm.3 5c1.1 0 1.7-.4 1.7-1.3 0-.8-.6-1.3-1.8-1.3h-2.8V23h2.9z" fill="#fff"/>
    <path d="M41 13h7c2.4 0 4 1.2 4 3.2 0 1.3-.7 2.2-1.8 2.7 1.4.4 2.3 1.4 2.3 3 0 2.2-1.7 3.5-4.4 3.5h-7.1V13zm6.3 5c1 0 1.6-.4 1.6-1.2s-.6-1.2-1.6-1.2h-2.6V18h2.6zm.3 5c1.1 0 1.7-.4 1.7-1.3 0-.8-.6-1.3-1.8-1.3h-2.8V23h2.9z" fill="#fff"/>
    <text x="32" y="38" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="1.5">A- RATED</text>
  </svg>
);

/* Custom: ROC license wall plaque */
const PlaqueIcon = ({ size = 42 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" style={{ display: "block", flex: "none", color: "var(--terra)" }}>
    <rect x="6" y="7" width="36" height="34" rx="3.5" fill="currentColor" opacity=".10"/>
    <rect x="6" y="7" width="36" height="34" rx="3.5" stroke="currentColor" strokeWidth="2"/>
    <rect x="12" y="13" width="24" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" opacity=".5"/>
    <circle cx="24" cy="24" r="6.4" stroke="currentColor" strokeWidth="2"/>
    <path d="M21.3 24.2l1.9 1.9 3.6-3.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 31.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
    <circle cx="10.5" cy="11.5" r="1.3" fill="currentColor"/>
    <circle cx="37.5" cy="11.5" r="1.3" fill="currentColor"/>
    <circle cx="10.5" cy="36.5" r="1.3" fill="currentColor"/>
    <circle cx="37.5" cy="36.5" r="1.3" fill="currentColor"/>
  </svg>
);

/* Custom: years-of-service medal */
const MedalIcon = ({ size = 42 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" style={{ display: "block", flex: "none", color: "var(--terra)" }}>
    <path d="M17 6l5.5 13-4 2L13 9z" fill="currentColor" opacity=".45"/>
    <path d="M31 6l-5.5 13 4 2L35 9z" fill="currentColor"/>
    <circle cx="24" cy="31" r="11.5" fill="currentColor" opacity=".12"/>
    <circle cx="24" cy="31" r="11.5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="24" cy="31" r="7.5" stroke="currentColor" strokeWidth="1.4" opacity=".55"/>
    <path d="M24 25.6l1.5 3.1 3.4.5-2.45 2.4.58 3.4L24 36.8l-3.03 1.6.58-3.4L19.1 32.7l3.4-.5z" fill="currentColor"/>
  </svg>
);

Object.assign(window, { Icon, Stars, Roofline, Slot, GoogleGColor, BBBLogo, PlaqueIcon, MedalIcon });
