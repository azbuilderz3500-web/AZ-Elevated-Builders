/* Shared estimate handling. No analytics vendor is loaded by this file. */
(function () {
  "use strict";
  const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "adgroup_id", "matchtype", "device", "gclid", "gbraid", "wbraid"];
  const params = new URLSearchParams(window.location.search);
  const attribution = {};
  attributionKeys.forEach((key) => {
    const value = params.get(key);
    if (value && value.length <= 200 && !/[<>\r\n]/.test(value)) attribution[key] = value;
  });
  // A local integration hook only. Never include contact data or query strings.
  function track(event, source, leadId) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, lead_source: source, page_path: window.location.pathname, ...(leadId ? { lead_id: leadId } : {}) });
    // Ad-platform conversion, only where a tag is configured (the paid landing
    // page). leadId doubles as the dedupe key so a retry is not counted twice.
    if (event === "generate_lead" && window.AZEB_ADS_CONVERSION && typeof window.gtag === "function") {
      window.gtag("event", "conversion", { send_to: window.AZEB_ADS_CONVERSION, transaction_id: leadId });
    }
  }
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener("click", () => track("phone_click", link.dataset.cta || "phone"));
  });
  document.querySelectorAll("form[data-lead]").forEach((form, formIndex) => {
    const button = form.querySelector('button[type="submit"]');
    const originalContent = button.innerHTML;
    const status = form.querySelector("[data-lead-status]");
    const fields = [...form.querySelectorAll("input:not([type=hidden]), textarea")];
    const source = form.dataset.source || "website";
    const leadId = window.crypto?.randomUUID?.() || `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let sending = false;
    let complete = false;
    button.disabled = false;
    form.noValidate = true;

    function clear(field) {
      field.removeAttribute("aria-invalid");
      field.classList.remove("is-error");
      const errorId = field.dataset.errorId;
      if (errorId) {
        document.getElementById(errorId)?.remove();
        field.removeAttribute("aria-describedby");
      }
    }
    function error(field, message) {
      const id = `lead-${formIndex}-${field.name}-error`;
      field.dataset.errorId = id;
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", id);
      field.classList.add("is-error");
      const note = document.createElement("span");
      note.id = id;
      note.className = "field-error";
      note.textContent = message;
      field.insertAdjacentElement("afterend", note);
    }
    fields.forEach((field) => field.addEventListener("input", () => clear(field)));

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sending || complete) return;
      status.textContent = "";
      fields.forEach(clear);
      const name = form.elements.namedItem("name");
      const phone = form.elements.namedItem("phone");
      const city = form.elements.namedItem("city");
      const digits = phone.value.replace(/\D/g, "");
      if (!name.value.trim()) error(name, "Please enter your name.");
      if (!/^(1)?[2-9]\d{2}[2-9]\d{6}$/.test(digits)) error(phone, "Enter a valid 10-digit US phone number, including area code.");
      if (city?.required && !city.value.trim()) error(city, "Please enter your project city.");
      const email = form.elements.namedItem("email");
      if (email?.required && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        error(email, "Enter an email address we can send the written scope to.");
      }
      if (form.hasAttribute("data-wizard")) {
        const value = key => form.elements.namedItem(key)?.value.trim() || "";
        if (!value("project")) error(form.querySelector('[name="project"]'), "Please choose a project option.");
        if (!value("size")) error(form.querySelector('[name="size"]'), "Please choose a width or ‘Not sure yet’.");
        // Compose at delivery so even the full-form fallback retains every answer.
        form.elements.namedItem("details").value = [
          `Project: ${value("project")}`,
          `Approximate driveway width: ${value("size")}`,
          `Timing: ${value("timing") || "To be discussed"}`,
          value("notes") ? `Notes: ${value("notes")}` : "",
        ].filter(Boolean).join("\n");
      }
      const invalid = form.querySelector('[aria-invalid="true"]');
      if (invalid) {
        form.dispatchEvent(new CustomEvent("lead:invalid", { detail: { field: invalid } }));
        invalid.focus(); return;
      }

      const endpoint = window.AZEB_LEAD_ENDPOINT;
      if (!endpoint) {
        status.textContent = "Online estimates are unavailable. Please call (925) 812-3150 using the link below.";
        status.focus();
        return;
      }
      sending = true;
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      button.textContent = "Sending…";
      form.dispatchEvent(new CustomEvent("lead:state", { detail: { state: "sending" } }));
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            leadId, name: name.value.trim(), phone: phone.value.trim(),
            city: city?.value.trim() || "",
            email: form.elements.namedItem("email")?.value.trim() || "",
            details: form.elements.namedItem("details")?.value.trim() || "",
            service: form.elements.namedItem("service")?.value || "",
            page: window.location.pathname,
            url: window.location.origin + window.location.pathname,
            source, attribution, submittedAt: new Date().toISOString(),
          }),
        });
        if (!response.ok) throw new Error("Lead request failed");
        complete = true;
        fields.forEach((field) => { field.readOnly = true; });
        button.textContent = "Request sent";
        // Pages can promise their own callback window; the default is the site-wide one.
        status.textContent = form.dataset.success || "Thank you. Your request has been sent. We’ll call you back within one business day. Need us sooner? Call (925) 812-3150 below.";
        track("generate_lead", source, leadId);
      } catch (err) {
        status.textContent = err.name === "AbortError"
          ? "We couldn’t confirm delivery. Your details are still here. Please call (925) 812-3150 below, or try again."
          : "Your request didn’t send. Your details are still here. Try again or call (925) 812-3150 below.";
        button.innerHTML = originalContent;
      } finally {
        clearTimeout(timeout);
        sending = false;
        button.disabled = complete;
        button.removeAttribute("aria-busy");
        form.dispatchEvent(new CustomEvent("lead:state", { detail: { state: complete ? "success" : "error" } }));
        status.focus();
      }
    });
  });
})();
