// Paid-search destination. Rendered by build-seo.mjs; deliberately excluded from the organic sitemap.
// Persuade surface: the visitor decides and acts, so the estimate wizard sits beside the first
// screenful on desktop and directly under the headline on mobile, and every section below it
// answers the objection that stops a homeowner booking — price, trust, and who turns up.
export function drivewayBody({ brand, cities, phoneIcon, footer, wizardScript }) {
  const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const counties = [...new Set(cities.map(city => city.county))];
  const sketch = (type) => `<svg class="wizard-sketch" viewBox="0 0 100 76" fill="none" aria-hidden="true"><path d="M20 29 50 12l30 17v20L50 67 20 49Z" fill="currentColor" opacity=".06"/><path d="m20 29 30-17 30 17M28 33V22m44 11V22M20 29v20l30 18 30-18V29M20 49l30-17 30 17M50 32v35" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>${type === 'replace' ? '<path d="m44 38 9 4-7 6 10 4-5 8" stroke="currentColor" stroke-width="2"/>' : type === 'widen' ? '<path d="m80 37 13 8-30 17M84 30l9 5m-4-8 4 8-9 1" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>' : '<circle cx="73" cy="28" r="13" fill="#172033" stroke="currentColor"/><path d="M70 24c0-4 7-4 7 0 0 3-4 3-4 6m0 3v1" stroke="currentColor" stroke-width="1.8"/>'}</svg>`;
  const garage = (count) => `<svg class="wizard-garage" viewBox="0 0 110 64" fill="none" aria-hidden="true"><path d="m10 22 45-16 45 16v32H10Z" stroke="currentColor" stroke-width="1.5"/><path d="m4 23 51-19 51 19" stroke="currentColor" stroke-width="1.5"/>${Array.from({ length: count }, (_, i) => { const width = 72 / count; const x = 19 + i * width; return `<path d="M${x} 54V27h${width - 6}v27M${x + 3} 33h${width - 12}m-${width - 12} 6h${width - 12}m-${width - 12} 6h${width - 12}" stroke="currentColor"/>`; }).join('')}</svg>`;
  // Drawn rather than a "?" character: the choice tiles share one icon system.
  const ruler = `<svg class="wizard-garage" viewBox="0 0 110 64" fill="none" aria-hidden="true"><rect x="12" y="24" width="86" height="22" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M26 24v8m12-8v11m12-11v8m12-8v11m12-11v8m12-8v11" stroke="currentColor" stroke-width="1.5"/></svg>`;
  const choice = (name, value, title, description, art = '') => `<label class="wizard-choice"><input type="radio" name="${name}" value="${esc(value)}" required><span class="wizard-choice__surface">${art}<span class="wizard-choice__text"><strong>${title}</strong>${description ? `<span>${description}</span>` : ''}</span><span class="wizard-choice__check" aria-hidden="true"></span></span></label>`;
  // Height is passed in rather than guessed from the filename, so the reserved
  // space always matches the real image and nothing shifts as it loads.
  const photo = (name, alt, height = 1800, eager = false) => `<img src="/assets/projects/${name}-1200.webp" srcset="/assets/projects/${name}-480.webp 480w, /assets/projects/${name}-800.webp 800w, /assets/projects/${name}-1200.webp 1200w, /assets/projects/${name}-1600.webp 1600w" sizes="(max-width: 900px) 100vw, 46vw" width="1200" height="${height}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

  const assurance = (icon, title, body) => `<li><span class="drive-assure__icon" aria-hidden="true">${icon}</span><div><strong>${title}</strong><span>${body}</span></div></li>`;
  const iconBadge = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.4 3.2 7.9 8 9 4.8-1.1 8-4.6 8-9V6Z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>`;
  const iconScope = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>`;
  const iconClock = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/></svg>`;

  const drivers = [
    ['Size and shape', 'Square footage, plus the aprons, walkways and turnarounds most people forget to count.'],
    ['Taking out the old slab', 'Demolition, hauling and disposal. Thickness, reinforcement and how close a truck can get all change the effort.'],
    ['What sits underneath', 'Base condition, grading and drainage. The part nobody sees is the part that decides how long the new one lasts.'],
    ['The finish', 'Broom, exposed aggregate or a stamped pattern like the one above. Each carries a different price and a different upkeep.'],
  ];

  const questions = [
    ["How much does a driveway replacement cost?", "We do not quote driveways by the square foot over the phone, because the number would be wrong. Size, demolition and disposal, equipment access, the base underneath, drainage and the finish all move the price. We measure your driveway on site and hand you a written scope, free, with no obligation to book."],
    ["Do you charge for the estimate?", "No. The on-site assessment and the written scope that follows are free, and you are under no obligation. Financing options are available if you would rather spread the cost of the work."],
    ["Should I repair the driveway or replace it?", "It depends on what caused the damage. Surface wear is a different problem from settling, recurring cracks or water pooling against the garage. We look at the slab and the site during the estimate and tell you honestly if a repair would serve you better."],
    ["How long will I be without the driveway?", "Plan to park elsewhere through removal, the pour and curing. The mix, the weather and the vehicles you park on it decide when it can take weight, and we give you the dates and the curing instructions for your specific pour before we start."],
    ["Can I widen it or change the finish?", "Tell us at the estimate. We can talk through layout, a wider approach, and broom, exposed-aggregate or stamped finishes. Property lines, drainage, local requirements and any HOA review can shape what is possible."],
    ["Do you serve my city?", `We are based in Brentwood and serve ${cities.length} cities and communities across the East Bay, Tri-Valley, Delta, Solano and Napa areas. The full list is below. Add your city to the form and we will confirm scheduling when we call.`],
  ];

  return `
<main class="drive" id="main" tabindex="-1">
  <section class="drive-hero" aria-labelledby="drive-title">
    <div class="drive-estimate" id="estimate">
      <p class="drive-badge"><span aria-hidden="true">${iconBadge}</span>CSLB #1106795 &middot; Licensed &amp; insured</p>
      <h1 id="drive-title">Get your free driveway estimate.</h1>
      <p class="drive-hero__intro">Tell us about your driveway. We call back <strong>within two hours</strong>, Mon&ndash;Fri, 8am&ndash;6pm.</p>
      <form data-lead data-wizard data-source="driveway-landing" data-success="Thank you. Your request is in. We will call you back within two hours, Monday to Friday, 8am to 6pm. Need us sooner? Call ${brand.phone} below." class="drive-form" method="post">
        <input type="hidden" name="service" value="Concrete driveway replacement">
        <input type="hidden" name="details">
        <ol class="wizard-progress" aria-label="Estimate steps" hidden>${['Project', 'Size', 'Location', 'Contact'].map((label, i) => `<li${i === 0 ? ' aria-current="step"' : ''}><span class="wizard-progress__number" aria-hidden="true">${i + 1}</span><span>${label}</span></li>`).join('')}</ol>
        <div class="wizard-panels">
          <fieldset class="wizard-step" data-step="0">
            <legend class="wizard-heading" tabindex="-1"><span class="wizard-eyebrow">Step 1 of 4 / Your project</span>What are we replacing?</legend>
            <div class="wizard-choices">
              ${choice('project', 'Replace my driveway', 'Replace my driveway', 'Out with the old concrete. In with a fresh start.', sketch('replace'))}
              ${choice('project', 'Replace and widen', 'Replace &amp; widen', 'A new driveway, with a little more room.', sketch('widen'))}
              ${choice('project', 'Help me decide', 'Help me decide', 'Let us look at the condition and talk through options.', sketch('advice'))}
            </div>
            <p class="wizard-error" id="wizard-error-0" hidden></p>
          </fieldset>
          <fieldset class="wizard-step" data-step="1">
            <legend class="wizard-heading" tabindex="-1"><span class="wizard-eyebrow">Step 2 of 4 / The footprint</span>About how wide is it?</legend>
            <div class="wizard-choices wizard-choices--size">
              ${choice('size', 'Single-car width', 'Single-car', 'One car wide', garage(1))}
              ${choice('size', 'Two-car width', 'Two-car', 'Two cars wide', garage(2))}
              ${choice('size', 'Three-plus-car width', 'Three or more', 'A wider driveway', garage(3))}
              ${choice('size', 'Not sure', 'Not sure yet', 'We measure it on site', ruler)}
            </div>
            <p class="wizard-error" id="wizard-error-1" hidden></p>
          </fieldset>
          <fieldset class="wizard-step" data-step="2">
            <legend class="wizard-heading" tabindex="-1"><span class="wizard-eyebrow">Step 3 of 4 / A little closer</span>Where is the driveway?</legend>
            <label class="lead-field">Project city<input name="city" list="driveway-cities" autocomplete="address-level2" maxlength="100" required placeholder="Start typing your city"></label>
            <datalist id="driveway-cities">${cities.map(city => `<option value="${esc(city.name)}"></option>`).join('')}</datalist>
            <p class="wizard-error" id="wizard-error-2" hidden></p>
            <fieldset class="wizard-timing"><legend>When are you thinking? <span>(optional)</span></legend><div class="wizard-timing__options">${['As soon as practical', 'In 1&ndash;3 months', 'Just planning'].map(value => `<label><input type="radio" name="timing" value="${value}"><span>${value}</span></label>`).join('')}</div></fieldset>
          </fieldset>
          <fieldset class="wizard-step" data-step="3">
            <legend class="wizard-heading" tabindex="-1"><span class="wizard-eyebrow">Step 4 of 4 / Where to reach you</span>Who should we call?</legend>
            <div class="wizard-contact">
              <label class="lead-field">Your name<input name="name" autocomplete="name" maxlength="100" required placeholder="Your name"></label>
              <label class="lead-field">Phone number<input type="tel" name="phone" autocomplete="tel" inputmode="tel" maxlength="25" required placeholder="(925) 555-0123"></label>
              <label class="lead-field lead-field--wide">Email<input type="email" name="email" autocomplete="email" inputmode="email" maxlength="150" required placeholder="you@example.com"></label>
            </div>
            <div class="wizard-review" hidden><p>Your project, at a glance</p><dl>
              <div><dt>Project</dt><dd data-review="project"></dd><button type="button" data-edit="0" aria-label="Edit project">Edit</button></div>
              <div><dt>Size</dt><dd data-review="size"></dd><button type="button" data-edit="1" aria-label="Edit driveway size">Edit</button></div>
              <div><dt>Location</dt><dd data-review="city"></dd><button type="button" data-edit="2" aria-label="Edit location and timing">Edit</button></div>
              <div><dt>Timing</dt><dd data-review="timing"></dd></div>
            </dl></div>
            <details class="drive-details"><summary>Anything else we should know? <span>(optional)</span></summary><label class="lead-field">Project notes<textarea name="notes" rows="2" maxlength="1500" placeholder="Damage, access, a finish you like&hellip;"></textarea></label></details>
            <p class="lead-privacy">By submitting, you ask AZ Elevated Builders to contact you about your project. <a href="/privacy.html">Privacy policy</a>.</p>
          </fieldset>
        </div>
        <div class="wizard-actions"><button class="wizard-back" type="button" data-back hidden><span aria-hidden="true">&larr;</span> Back</button><button type="button" class="btn btn--solid wizard-next" data-next hidden>Continue <span aria-hidden="true">&rarr;</span></button><button type="submit" class="btn btn--solid" disabled>Request my free estimate</button></div>
        <p class="wizard-reassurance">Free &middot; No obligation &middot; Takes about 2 minutes</p>
        <div class="wizard-success" hidden><span class="wizard-success__mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span><h3>Your request is in.</h3><p>We will call you back within two hours, Monday to Friday, 8am to 6pm.</p></div>
        <p class="lead-status" data-lead-status role="status" aria-live="polite" tabindex="-1"></p>
      </form>
      <noscript><p>Please call us to request your estimate.</p></noscript>
      <a class="drive-form-call" href="tel:${brand.phoneHref}" data-cta="driveway-form">Prefer to talk? ${brand.phone}</a>
    </div>
  </section>

  <section class="drive-steps" aria-labelledby="steps-title">
    <h2 id="steps-title">Most driveways: three days on site.<a class="drive-fn" href="#turnaround-note" aria-label="See turnaround conditions">*</a></h2>
    <ol class="drive-steps__list">
      <li><span>Day 1</span><div><h3>Out with the old</h3><p>Demolition, hauling and disposal, then the base and grading prepared for the new pour.</p></div></li>
      <li><span>Day 2</span><div><h3>Form &amp; pour</h3><p>Layout, drainage and reinforcement set, then the concrete placed and finished by hand.</p></div></li>
      <li><span>Day 3</span><div><h3>Finish &amp; hand over</h3><p>Joints cut, the site left clean, and a walk through the work with your curing instructions.</p></div></li>
    </ol>
    <p class="drive-fineprint" id="turnaround-note">*A typical single- or two-car driveway with good equipment access. Extra demolition, drainage work, a stamped finish or weather can add days, and concrete keeps curing after we leave &mdash; your written scope confirms the dates before anything starts.</p>
  </section>
</main>
<div class="drive-bar">
  <a class="drive-bar__call" href="tel:${brand.phoneHref}" data-cta="driveway-sticky">${phoneIcon}<span>Call ${brand.phone}</span></a>
</div>
${wizardScript}
${footer}`;
}
