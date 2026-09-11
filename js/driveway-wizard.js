/* Progressive enhancement for the paid-search estimate. Answers stay in this form only. */
(function () {
  "use strict";
  const form = document.querySelector("form[data-wizard]");
  if (!form) return;
  const steps = [...form.querySelectorAll(".wizard-step")];
  const progress = form.querySelector(".wizard-progress");
  const progressItems = [...progress.children];
  const next = form.querySelector("[data-next]");
  const back = form.querySelector("[data-back]");
  const submit = form.querySelector('button[type="submit"]');
  const status = form.querySelector("[data-lead-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let editing = false;
  let busy = false;
  let complete = false;
  let animation;
  const value = name => form.elements.namedItem(name)?.value.trim() || "";

  function clearError(index) {
    const note = steps[index].querySelector(".wizard-error");
    if (!note) return;
    note.hidden = true;
    note.textContent = "";
    steps[index].removeAttribute("aria-describedby");
    steps[index].querySelectorAll('[data-wizard-invalid]').forEach(field => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
      field.removeAttribute("data-wizard-invalid");
    });
  }

  function validate(index, focus = true) {
    clearError(index);
    const name = ["project", "size", "city"][index];
    if (!name || value(name)) return true;
    const note = steps[index].querySelector(".wizard-error");
    note.textContent = ["Choose an option. It’s fine if you’re still deciding.", "Choose a width, or select ‘Not sure yet’.", "Please enter your project city."][index];
    note.hidden = false;
    steps[index].setAttribute("aria-describedby", note.id);
    const field = steps[index].querySelector("input");
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", note.id);
    field.setAttribute("data-wizard-invalid", "");
    if (focus) field.focus();
    return false;
  }

  function updateReview() {
    form.querySelectorAll("[data-review]").forEach(item => {
      item.textContent = value(item.dataset.review) || "To be discussed";
    });
  }

  function show(index, { focus = true, motion = false } = {}) {
    if (busy || complete) return;
    const direction = index < current ? -1 : 1;
    current = index;
    animation?.cancel();
    steps.forEach((step, i) => { step.hidden = i !== current; });
    progressItems.forEach((item, i) => {
      item.classList.toggle("is-complete", i < current);
      if (i === current) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    back.hidden = current === 0 && !editing;
    back.innerHTML = `<span aria-hidden="true">←</span> ${editing ? 'Review' : 'Back'}`;
    back.setAttribute("aria-label", editing ? "Back to review" : "Previous step");
    next.hidden = current === steps.length - 1;
    next.innerHTML = `${editing ? 'Save &amp; review' : 'Continue'} <span aria-hidden="true">→</span>`;
    submit.hidden = current !== steps.length - 1;
    updateReview();
    if (focus) {
      const heading = steps[current].querySelector("legend");
      heading.focus({ preventScroll: true });
      const bounds = form.closest(".drive-estimate").getBoundingClientRect();
      if (bounds.top < 0 || bounds.top > window.innerHeight / 2) {
        form.closest(".drive-estimate").scrollIntoView({ block: "start", behavior: "instant" });
      }
    }
    if (motion && !reducedMotion.matches && steps[current].animate) {
      animation = steps[current].animate([
        { opacity: .5, transform: `translateX(${direction * 14}px)` },
        { opacity: 1, transform: "translateX(0)" },
      ], { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    }
  }

  function advance(motion) {
    if (busy || complete || !validate(current)) return;
    const target = editing ? steps.length - 1 : Math.min(current + 1, steps.length - 1);
    editing = false;
    status.textContent = "";
    show(target, { motion });
  }

  next.addEventListener("click", event => advance(event.detail > 0));
  back.addEventListener("click", event => {
    if (busy || complete) return;
    clearError(current);
    const target = editing ? steps.length - 1 : Math.max(0, current - 1);
    editing = false;
    status.textContent = "";
    show(target, { motion: event.detail > 0 });
  });
  form.querySelectorAll("[data-edit]").forEach(button => {
    button.addEventListener("click", event => {
      if (busy || complete) return;
      editing = true;
      status.textContent = "";
      show(Number(button.dataset.edit), { motion: event.detail > 0 });
    });
  });
  steps.forEach((step, index) => step.addEventListener("input", () => clearError(index)));

  // Capture Enter as well as clicks before the shared delivery handler can run.
  form.addEventListener("submit", event => {
    if (busy || complete || current < steps.length - 1) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!busy && !complete) advance(false);
      return;
    }
    for (let index = 0; index < steps.length - 1; index++) {
      if (!validate(index, false)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        editing = true;
        show(index, { focus: false });
        steps[index].querySelector('[aria-invalid="true"]').focus();
        return;
      }
    }
  }, true);

  form.addEventListener("lead:invalid", event => {
    const step = event.detail.field.closest(".wizard-step");
    if (step) show(Number(step.dataset.step), { focus: false });
  });
  form.addEventListener("lead:state", event => {
    busy = event.detail.state === "sending";
    complete = event.detail.state === "success";
    steps.forEach(step => { step.disabled = busy || complete; });
    form.querySelectorAll(".wizard-actions button").forEach(button => { button.disabled = busy || complete; });
    if (complete) {
      animation?.cancel();
      form.querySelector(".wizard-panels").hidden = true;
      form.querySelector(".wizard-actions").hidden = true;
      form.querySelector(".wizard-reassurance").hidden = true;
      form.querySelector(".wizard-success").hidden = false;
      progress.setAttribute("aria-label", "Estimate request sent");
      progressItems.forEach(item => { item.classList.add("is-complete"); item.removeAttribute("aria-current"); });
    }
  });
  // All fields remain visible if enhancement fails; the call fallback always works.
  form.classList.add("is-wizard-ready");
  progress.hidden = false;
  form.querySelector(".wizard-review").hidden = false;
  show(0, { focus: false });
})();
