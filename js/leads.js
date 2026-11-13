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
    if (typeof window.gtag === "function") {
      window.gtag("event", event, { lead_source: source, ...(leadId ? { lead_id: leadId } : {}) });
    }
    // Ad-platform conversion, only where a tag is configured (the paid landing
    // page). leadId doubles as the dedupe key so a retry is not counted twice.
    if (event === "generate_lead" && window.AZEB_ADS_CONVERSION && typeof window.gtag === "function") {
      window.gtag("event", "conversion", { send_to: window.AZEB_ADS_CONVERSION, transaction_id: leadId });
    }
  }
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener("click", () => track("phone_click", link.dataset.cta || "phone"));
  });
  // Defensive clean-up of what homeowners type. Today Make parses this JSON
  // properly and forwards it form-encoded, so nothing breaks on a quote; this
  // is kept so a future scenario that splices values into a raw JSON body by
  // string interpolation (an earlier version did) cannot drop a lead on a
  // straight quote or a backslash. A typographic quote reads the same.
  // Newlines carry the shape of the answers, so they stay; every other control
  // character and the backslash do not.
  const jsonSafe = (value) => String(value || "")
    .replace(/[\\\u0000-\u0009\u000b-\u001f]/g, " ")
    .replace(/"/g, "\u201D")
    .replace(/[ \t]+$/gm, "");

  // Spam screening in the browser: a hidden honeypot field, a minimum fill time
  // and a no-links rule. It stops the common form-filling bot without a puzzle
  // for the homeowner. It cannot stop a bot that posts straight to the webhook,
  // whose address is public; that needs the matching filter in the Make
  // scenario (form version "2" and elapsed >= 3), which is set up separately.
  const FORM_VERSION = "2";
  const MIN_FILL_MS = 3000;          // no person fills this form in under 3 seconds
  const pageStart = performance.now();   // monotonic: a clock change can't trip it
  // Links, including bare domains with a path (bit.ly/x, zillow.com/homedetails),
  // but not "www" inside a word.
  const LINK = /(https?:\/\/|\bwww\.|\[url|<a\s|\b[a-z0-9-]+\.(?:com|net|org|info|biz|io|co|ly|me|xyz|top|ru)\/\S)/i;
  const HONEYPOT = "azeb_check";
  const DEFAULT_SUCCESS = "Thank you. Your request has been sent. We’ll call you back within one business day. Need us sooner? Call (925) 812-3150 below.";

  document.querySelectorAll("form[data-lead]").forEach((form, formIndex) => {
    const button = form.querySelector('button[type="submit"]');
    const originalContent = button.innerHTML;
    const status = form.querySelector("[data-lead-status]");
    const fields = [...form.querySelectorAll(`input:not([type=hidden]):not([name=${HONEYPOT}]), textarea, select`)];
    const trap = form.elements.namedItem(HONEYPOT);
    const source = form.dataset.source || "website";
    const leadId = window.crypto?.randomUUID?.() || `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let sending = false;
    let complete = false;
    // Fill time counts from the first time someone touches this form, not from
    // page load, so a visitor who reads the page first is never held up and a
    // script that loads, waits and submits untouched still gets the full check.
    let firstTouch = null;
    const touched = () => { if (firstTouch === null) firstTouch = performance.now(); };
    ["focusin", "pointerdown", "input"].forEach((type) => form.addEventListener(type, touched, true));
    const successText = form.dataset.success || DEFAULT_SUCCESS;
    button.disabled = false;
    form.noValidate = true;

    // A field may already point at a hint; errors are added to that, not over it.
    fields.forEach((field) => { field.dataset.hint = field.getAttribute("aria-describedby") || ""; });
    function clear(field) {
      field.removeAttribute("aria-invalid");
      field.classList.remove("is-error");
      const errorId = field.dataset.errorId;
      if (errorId) {
        document.getElementById(errorId)?.remove();
        delete field.dataset.errorId;
        if (field.dataset.hint) field.setAttribute("aria-describedby", field.dataset.hint);
        else field.removeAttribute("aria-describedby");
      }
    }
    function error(field, message) {
      const id = `lead-${formIndex}-${field.name}-error`;
      field.dataset.errorId = id;
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", [field.dataset.hint, id].filter(Boolean).join(" "));
      field.classList.add("is-error");
      const note = document.createElement("span");
      note.id = id;
      note.className = "field-error";
      note.textContent = message;
      field.insertAdjacentElement("afterend", note);
    }
    // Fixing a field clears its error; once none are left, the "check N fields"
    // line goes too.
    const fixed = (field) => {
      clear(field);
      if (!/^Please check the \d+ highlighted fields\.$/.test(status.textContent)) return;
      const left = form.querySelectorAll('[aria-invalid="true"]').length;
      status.textContent = left > 1 ? `Please check the ${left} highlighted fields.` : "";
    };
    fields.forEach((field) => {
      field.addEventListener("input", () => fixed(field));
      field.addEventListener("change", () => fixed(field));
    });

    // A bot that fills the hidden field gets the same thank-you a person would,
    // so it has nothing to learn from, and nothing is sent. Only a contact-free
    // analytics event records that it happened, so a rise is visible in GA.
    function quietlyAccept() {
      complete = true;
      fields.forEach((field) => { field.readOnly = true; });
      button.disabled = true;
      button.textContent = "Request sent";
      status.textContent = successText;
      track("lead_honeypot", source);
      form.dispatchEvent(new CustomEvent("lead:state", { detail: { state: "success" } }));
      status.focus();
    }

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
      else if (LINK.test(name.value)) error(name, "Please enter just your name.");
      if (!/^(1)?[2-9]\d{2}[2-9]\d{6}$/.test(digits)) error(phone, "Enter a valid 10-digit US phone number, including area code.");
      if (city?.required && !city.value.trim()) error(city, "Please enter your project city.");
      const email = form.elements.namedItem("email");
      if (email?.required && !email.value.trim()) error(email, "Please enter your email address.");
      else if (email?.required && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        error(email, "Check the email address, for example name@gmail.com.");
      }
      // General estimate form (homepage pop-up and landing pages). The ad
      // page's wizard has its own steps and is checked below.
      const projectType = form.querySelector('select[name="service"]');
      const timeline = form.querySelector('select[name="timeline"]');
      const description = form.querySelector('textarea[name="details"]');
      if (projectType?.required && !projectType.value) error(projectType, "Please choose the type of project.");
      if (timeline?.required && !timeline.value) error(timeline, "Please choose when you'd like to start.");
      if (description?.required) {
        const text = description.value.trim();
        if (text.length < 20) error(description, "Please add a little more detail (at least 20 characters).");
        else if (LINK.test(text)) error(description, "Please describe the project without links. You can send photos after we call.");
      }
      const notes = form.elements.namedItem("notes");
      if (notes && LINK.test(notes.value)) error(notes, "Please leave links out of your notes. You can send photos after we call.");
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
        const count = form.querySelectorAll('[aria-invalid="true"]').length;
        if (count > 1) status.textContent = `Please check the ${count} highlighted fields.`;
        form.dispatchEvent(new CustomEvent("lead:invalid", { detail: { field: invalid } }));
        // An error inside a closed "optional notes" panel must be visible.
        const panel = invalid.closest("details");
        if (panel) panel.open = true;
        track("lead_invalid", source);
        invalid.focus(); return;
      }

      if (trap && trap.value) { quietlyAccept(); return; }
      const elapsed = performance.now() - (firstTouch ?? pageStart);
      if (elapsed < MIN_FILL_MS) {
        status.textContent = "One moment, then send your request again.";
        status.focus();
        return;
      }

      // Lead the message with the answers so the notification email shows the
      // job, the timing and the place even where it only prints `details`.
      let details = form.elements.namedItem("details")?.value.trim() || "";
      if (!form.hasAttribute("data-wizard") && (projectType || timeline)) {
        const summary = [
          projectType?.value ? `Project: ${projectType.value}` : "",
          timeline?.value ? `Start: ${timeline.value}` : "",
          city?.value.trim() ? `City: ${city.value.trim()}` : "",
        ].filter(Boolean).join("\n");
        details = summary + (details ? `\n\n${details}` : "");
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
            leadId, name: jsonSafe(name.value.trim()), phone: phone.value.trim(),
            city: jsonSafe(city?.value.trim() || ""),
            email: jsonSafe(form.elements.namedItem("email")?.value.trim() || ""),
            details: jsonSafe(details),
            service: jsonSafe(form.elements.namedItem("service")?.value || ""),
            timeline: jsonSafe(timeline?.value || form.querySelector('input[name="timing"]:checked')?.value || ""),
            v: FORM_VERSION, elapsed: Math.round(elapsed / 1000),
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
        status.textContent = successText;
        track("generate_lead", source, leadId);
      } catch (err) {
        track("lead_error", source);
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
