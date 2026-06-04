/**
 * Sunrise Roofers — contact form: Pursuit attribution + Web3Forms.
 * Requires pursuit-form.js loaded first (PursuitAttribution global).
 */
(function () {
  function init() {
    var form = document.getElementById("contact-form");
    if (!form || form.dataset.pursuitSubmitBound === "1") return;
    form.dataset.pursuitSubmitBound = "1";

    var submitBtn = form.querySelector('[type="submit"]');
    var successEl = document.getElementById("success-message");
    var errorEl = document.getElementById("error-message");

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (submitBtn) {
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;
      }
      if (errorEl) errorEl.style.display = "none";

      var fd = new FormData(form);

      if (window.PursuitAttribution) {
        try {
          await window.PursuitAttribution.submit({
            name: fd.get("name") || "",
            phone: fd.get("phone") || "",
            email: fd.get("email") || "",
            address: fd.get("address") || "",
            service: fd.get("service") || "",
            message: fd.get("message") || "",
          });
        } catch (err) {
          console.warn("Pursuit ingest failed", err);
        }
      }

      try {
        var w3 = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: fd,
        });
        var result = await w3.json();
        if (result.success) {
          form.reset();
          if (successEl) {
            successEl.style.display = "block";
            form.style.display = "none";
          } else {
            window.location.href = "https://roofwithsunrise.com/thank-you.html";
          }
        } else {
          throw new Error(result.message || "Web3Forms error");
        }
      } catch (err) {
        console.error("Form submit error", err);
        if (errorEl) errorEl.style.display = "block";
        if (submitBtn) {
          submitBtn.textContent = "Get Free Estimate";
          submitBtn.disabled = false;
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
