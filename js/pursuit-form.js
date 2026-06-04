/*
 * Pursuit Scoreboard — first-touch attribution + form ingest.
 *
 * Site-wide (before </body>):
 *   <script
 *     src="/js/pursuit-form.js"
 *     data-client-id="<CLIENT_UUID>"
 *     data-endpoint="https://<app>/api/public/ingest/form"
 *     data-auto-bind="false"
 *     defer></script>
 */
(function () {
  var script = document.currentScript;
  var CLIENT_ID = script && script.getAttribute("data-client-id");
  var ENDPOINT =
    (script && script.getAttribute("data-endpoint")) ||
    "/api/public/ingest/form";
  var AUTO_BIND = (script && script.getAttribute("data-auto-bind")) !== "false";
  var FORM_SELECTOR =
    (script && script.getAttribute("data-form")) || "#contact-form";
  var STORAGE_KEY = "pursuit_attribution_v2";
  var TTL_MS = 90 * 24 * 60 * 60 * 1000;

  function readParams() {
    var qs = new URLSearchParams(window.location.search);
    var keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
      "fbclid",
      "msclkid",
    ];
    var found = {};
    var any = false;
    keys.forEach(function (k) {
      var v = qs.get(k);
      if (v) {
        found[k] = v;
        any = true;
      }
    });
    return any ? found : null;
  }

  function persist(data) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data: data, saved_at: Date.now() }),
      );
    } catch (e) {}
  }

  function loadRaw() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (Date.now() - parsed.saved_at > TTL_MS) return null;
      return parsed.data || null;
    } catch (e) {
      return null;
    }
  }

  function inferChannel(data) {
    data = data || {};
    var medium = (data.utm_medium || "").toLowerCase();
    var source = (data.utm_source || "").toLowerCase();
    var ref = (data.referrer || "").toLowerCase();

    if (data.gclid || data.msclkid || /cpc|ppc|paid|sem/.test(medium)) {
      return "paid_search";
    }
    if (
      data.fbclid ||
      /social|facebook|instagram|meta/.test(source + " " + medium)
    ) {
      return "paid_social";
    }
    if (/referral/.test(medium) || (ref && !/google\.|bing\./.test(ref))) {
      if (ref && /facebook|instagram|t\.co|linkedin/.test(ref)) {
        return "paid_social";
      }
      return "referral_reactivation";
    }
    if (
      /organic|seo/.test(medium) ||
      /google\.|bing\.|yahoo\./.test(ref) ||
      source === "google"
    ) {
      return "maps_organic";
    }
    if (medium || source) return "direct";
    return "direct";
  }

  function initFirstTouch() {
    var stored = loadRaw();
    if (stored) return stored;

    var fromUrl = readParams() || {};
    var data = {
      utm_source: fromUrl.utm_source || null,
      utm_medium: fromUrl.utm_medium || null,
      utm_campaign: fromUrl.utm_campaign || null,
      utm_content: fromUrl.utm_content || null,
      utm_term: fromUrl.utm_term || null,
      gclid: fromUrl.gclid || null,
      fbclid: fromUrl.fbclid || null,
      msclkid: fromUrl.msclkid || null,
      referrer: document.referrer || null,
      landing_page: window.location.href,
      ts: new Date().toISOString(),
    };
    persist(data);
    return data;
  }

  var firstTouchData = initFirstTouch();

  function firstTouch() {
    var d = loadRaw() || firstTouchData || {};
    return {
      channel: inferChannel(d),
      utm_source: d.utm_source || null,
      utm_medium: d.utm_medium || null,
      utm_campaign: d.utm_campaign || null,
      utm_content: d.utm_content || null,
      utm_term: d.utm_term || null,
      gclid: d.gclid || null,
      fbclid: d.fbclid || null,
      msclkid: d.msclkid || null,
      referrer: d.referrer || null,
      landing_page: d.landing_page || null,
      ts: d.ts || null,
    };
  }

  function submit(fields) {
    fields = fields || {};
    var ft = firstTouch();
    var payload = {
      client_id: CLIENT_ID,
      channel: ft.channel,
      utm_source: ft.utm_source,
      utm_medium: ft.utm_medium,
      utm_campaign: ft.utm_campaign,
      utm_content: ft.utm_content,
      utm_term: ft.utm_term,
      gclid: ft.gclid,
      fbclid: ft.fbclid,
      msclkid: ft.msclkid,
      referrer: ft.referrer,
      landing_page: ft.landing_page,
      first_seen: ft.ts,
      page: window.location.pathname,
      form_page: window.location.href,
      name: fields.name || "",
      phone: fields.phone || "",
      email: fields.email || "",
    };
    Object.keys(fields).forEach(function (k) {
      if (fields[k] !== undefined && fields[k] !== null) {
        payload[k] = fields[k];
      }
    });

    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).then(function (r) {
      return r.json();
    });
  }

  function bind(form) {
    if (!form || form.dataset.pursuitBound === "1") return;
    form.dataset.pursuitBound = "1";
    form.addEventListener("submit", function () {
      var fd = new FormData(form);
      submit({
        name: fd.get("name") || fd.get("full_name") || "",
        phone: fd.get("phone") || fd.get("tel") || "",
        email: fd.get("email") || "",
        address: fd.get("address") || "",
        service: fd.get("service") || "",
        message: fd.get("message") || "",
      });
    });
  }

  var api = {
    clientId: CLIENT_ID,
    endpoint: ENDPOINT,
    firstTouch: firstTouch,
    submit: submit,
    capture: firstTouch,
  };

  window.PursuitAttribution = api;
  window.PursuitForm = api;

  if (AUTO_BIND) {
    document.addEventListener("DOMContentLoaded", function () {
      var el = document.querySelector(FORM_SELECTOR);
      bind(el);
    });
  }
})();
