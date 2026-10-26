/**
 * Sunrise Roofers — GA4 event when a visitor clicks or copies Eddie's email.
 *
 * Sends `email_contact` with `method` = click | copy and `link_location` =
 * nav | footer | contact | body. GA4 attributes each event to the visit's own
 * source (Ads, organic, GBP, AI, referral), and once `email_contact` is a key
 * event imported into Google Ads, Ads only counts the ones from an ad click.
 *
 * Loaded site-wide, right after the GA4 tag:
 *   <script src="/js/contact-tracking.js" defer></script>
 */
(function () {
  var EMAIL = /@roofwithsunrise\.com/i;
  var sent = {};

  function send(method, el) {
    // One per method per page view — a double-tap or re-copy isn't a second lead.
    if (sent[method]) return;
    sent[method] = true;
    window.dataLayer = window.dataLayer || [];
    var gtag =
      typeof window.gtag === "function"
        ? window.gtag
        : function () { window.dataLayer.push(arguments); };
    gtag("event", "email_contact", {
      method: method,
      link_location: locate(el),
    });
  }

  function locate(el) {
    var node = el && el.nodeType === 3 ? el.parentElement : el;
    if (!node || !node.closest) return "body";
    if (node.closest("footer")) return "footer";
    if (node.closest("header, nav, .topbar, .top-contact")) return "nav";
    if (node.closest("#contact, .contact, [class*='contact']")) return "contact";
    return "body";
  }

  document.addEventListener(
    "click",
    function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href^="mailto:"]');
      if (a && EMAIL.test(a.getAttribute("href"))) send("click", a);
    },
    true,
  );

  document.addEventListener("copy", function () {
    var sel = window.getSelection && window.getSelection();
    if (sel && EMAIL.test(String(sel))) send("copy", sel.anchorNode);
  });
})();
