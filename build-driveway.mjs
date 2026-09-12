// Paid-search destination. Rendered by build-seo.mjs; deliberately excluded from the organic sitemap.
export function drivewayBody({ brand, cities, phoneIcon, footer, wizardScript }) {
  const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const counties = [...new Set(cities.map(city => city.county))];
  const sketch = (type) => `<svg class="wizard-sketch" viewBox="0 0 100 76" fill="none" aria-hidden="true"><path d="M20 29 50 12l30 17v20L50 67 20 49Z" fill="currentColor" opacity=".06"/><path d="m20 29 30-17 30 17M28 33V22m44 11V22M20 29v20l30 18 30-18V29M20 49l30-17 30 17M50 32v35" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>${type === 'replace' ? '<path d="m44 38 9 4-7 6 10 4-5 8" stroke="currentColor" stroke-width="2"/>' : type === 'widen' ? '<path d="m80 37 13 8-30 17M84 30l9 5m-4-8 4 8-9 1" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>' : '<circle cx="73" cy="28" r="13" fill="#172033" stroke="currentColor"/><path d="M70 24c0-4 7-4 7 0 0 3-4 3-4 6m0 3v1" stroke="currentColor" stroke-width="1.8"/>'}</svg>`;
  const garage = (count) => `<svg class="wizard-garage" viewBox="0 0 110 64" fill="none" aria-hidden="true"><path d="m10 22 45-16 45 16v32H10Z" stroke="currentColor" stroke-width="1.5"/><path d="m4 23 51-19 51 19" stroke="currentColor" stroke-width="1.5"/>${Array.from({ length: count }, (_, i) => { const width = 72 / count; const x = 19 + i * width; return `<path d="M${x} 54V27h${width - 6}v27M${x + 3} 33h${width - 12}m-${width - 12} 6h${width - 12}m-${width - 12} 6h${width - 12}" stroke="currentColor"/>`; }).join('')}</svg>`;
  const choice = (name, value, title, description, art = '') => `<label class="wizard-choice"><input type="radio" name="${name}" value="${esc(value)}" required><span class="wizard-choice__surface">${art}<span class="wizard-choice__text"><strong>${title}</strong>${description ? `<span>${description}</span>` : ''}</span><span class="wizard-choice__check" aria-hidden="true"></span></span></label>`;
  // Height is passed in rather than guessed from the filename, so the reserved
  // space always matches the real image and nothing shifts as it loads.
  const photo = (name, alt, height = 1800, eager = false) => `<img src="/assets/projects/${name}-1200.webp" srcset="/assets/projects/${name}-480.webp 480w, /assets/projects/${name}-800.webp 800w, /assets/projects/${name}-1200.webp 1200w, /assets/projects/${name}-1600.webp 1600w" sizes="(max-width: 800px) 100vw, 55vw" width="1200" height="${height}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  const questions = [
    ["How much does a concrete driveway replacement cost?", "The size of the driveway, demolition and disposal, access for equipment, base condition, drainage and finish all affect the price. We measure the site and provide a written scope with your estimate. An on-site assessment is needed to price your project accurately."],
    ["What is included in the replacement?", "We assess the existing driveway and discuss removal, hauling, grading, base preparation, reinforcement, the new concrete and finish. Your written proposal identifies the work included for your property before demolition begins."],
    ["Should I repair the driveway or replace it?", "That depends on the cause and extent of the damage. Surface wear may need a different solution from settling, recurring cracks or drainage problems. We look at the existing slab and site during the estimate and explain the proposed scope."],
    ["When can I park on the new driveway?", "Plan to park elsewhere during removal, installation and curing. The concrete mix, weather and intended vehicle loads affect when the driveway can be used. We discuss access before work begins and provide instructions for your specific pour."],
    ["Can I widen the driveway or change the finish?", "Tell us what you have in mind during the estimate. We can discuss layout and broom-finished, exposed-aggregate or stamped concrete options. Property limits, drainage, local requirements and any HOA review can affect the final design."],
    ["Do you serve my city?", `We serve ${cities.length} cities and communities across the East Bay, Tri-Valley, Delta, Solano and Napa areas. The full list is below, grouped by county. Add your project city to the estimate form and we’ll discuss your property and scheduling.`],
  ];
  return `
<header class="drive-nav">
  <a href="/" class="drive-brand" aria-label="AZ Elevated Builders home"><img src="/assets/brand/mark-white.svg" alt="" width="60" height="48"><img src="/assets/brand/wordmark-white.svg" alt="" width="148" height="34"></a>
  <a class="drive-nav__phone" href="tel:${brand.phoneHref}" data-cta="driveway-header">${phoneIcon}<span>${brand.phone}</span></a>
</header>
<main class="drive" id="main" tabindex="-1">
  <section class="drive-hero" aria-labelledby="drive-title">
    <div class="drive-hero__copy">
      <h1 id="drive-title">Concrete driveway <em>replacement.</em></h1>
      <p class="drive-hero__intro">Tell us about your driveway. We’ll arrange your free on-site estimate.</p>
    </div>
    <section class="drive-estimate" id="estimate" aria-labelledby="estimate-title">
      <div class="wizard-topline"><h2 id="estimate-title">Plan your driveway</h2><span>Free on-site estimate</span></div>
      <form data-lead data-wizard data-source="driveway-landing" class="drive-form" method="post">
        <input type="hidden" name="service" value="Concrete driveway replacement">
        <input type="hidden" name="details">
        <ol class="wizard-progress" aria-label="Estimate steps" hidden>${['Project', 'Size', 'Location', 'Contact'].map((label, i) => `<li${i === 0 ? ' aria-current="step"' : ''}><span class="wizard-progress__number" aria-hidden="true">${i + 1}</span><span>${label}</span></li>`).join('')}</ol>
        <div class="wizard-panels">
          <fieldset class="wizard-step" data-step="0">
            <legend class="wizard-heading" tabindex="-1"><span class="wizard-eyebrow">Step 1 of 4 / Your project</span>What’s the plan?</legend>
            <p class="wizard-hint">Choose the option that sounds most like your project.</p>
            <div class="wizard-choices">
              ${choice('project', 'Replace my driveway', 'Replace my driveway', 'Out with the old concrete. In with a fresh start.', sketch('replace'))}
              ${choice('project', 'Replace and widen', 'Replace &amp; widen', 'A new driveway, with a little more room.', sketch('widen'))}
              ${choice('project', 'Help me decide', 'Help me decide', 'Let’s look at the condition and talk through options.', sketch('advice'))}
            </div>
            <p class="wizard-error" id="wizard-error-0" hidden></p>
          </fieldset>
          <fieldset class="wizard-step" data-step="1">
            <legend class="wizard-heading" tabindex="-1"><span class="wizard-eyebrow">Step 2 of 4 / The footprint</span>About how wide is it?</legend>
            <p class="wizard-hint">Think about cars parked side by side. A rough idea is plenty.</p>
            <div class="wizard-choices wizard-choices--size">
              ${choice('size', 'Single-car width', 'Single-car', 'One car wide', garage(1))}
              ${choice('size', 'Two-car width', 'Two-car', 'Two cars wide', garage(2))}
              ${choice('size', 'Three-plus-car width', 'Three or more', 'A wider driveway', garage(3))}
              ${choice('size', 'Not sure', 'Not sure yet', 'We’ll measure on site', '<span class="wizard-unsure" aria-hidden="true">?</span>')}
            </div>
            <p class="wizard-error" id="wizard-error-1" hidden></p>
          </fieldset>
          <fieldset class="wizard-step" data-step="2">
            <legend class="wizard-heading" tabindex="-1"><span class="wizard-eyebrow">Step 3 of 4 / A little closer</span>Where are we headed?</legend>
            <p class="wizard-hint">We serve ${cities.length} communities across the East Bay, Tri-Valley, Delta, Solano and Napa areas.</p>
            <label class="lead-field">Project city<input name="city" list="driveway-cities" autocomplete="address-level2" maxlength="100" required placeholder="Start typing your city"></label>
            <datalist id="driveway-cities">${cities.map(city => `<option value="${esc(city.name)}"></option>`).join('')}</datalist>
            <p class="wizard-error" id="wizard-error-2" hidden></p>
            <fieldset class="wizard-timing"><legend>When are you thinking? <span>(optional)</span></legend><div class="wizard-timing__options">${['As soon as practical', 'In 1–3 months', 'Just planning'].map(value => `<label><input type="radio" name="timing" value="${value}"><span>${value}</span></label>`).join('')}</div></fieldset>
            <p class="wizard-location-note">No street address needed yet. We’ll confirm the details when we call.</p>
          </fieldset>
          <fieldset class="wizard-step" data-step="3">
            <legend class="wizard-heading" tabindex="-1"><span class="wizard-eyebrow">Step 4 of 4 / Let’s connect</span>Let’s make a plan.</legend>
            <p class="wizard-hint">Leave your details. We’ll call within one business day to discuss your driveway and arrange a free on-site estimate.</p>
            <div class="wizard-contact">
              <label class="lead-field">Your name<input name="name" autocomplete="name" maxlength="100" required placeholder="Your name"></label>
              <label class="lead-field">Phone number<input type="tel" name="phone" autocomplete="tel" inputmode="tel" maxlength="25" required placeholder="(925) 555-0123"></label>
            </div>
            <div class="wizard-review" hidden><p>Your project, at a glance</p><dl>
              <div><dt>Project</dt><dd data-review="project"></dd><button type="button" data-edit="0" aria-label="Edit project">Edit</button></div>
              <div><dt>Size</dt><dd data-review="size"></dd><button type="button" data-edit="1" aria-label="Edit driveway size">Edit</button></div>
              <div><dt>Location</dt><dd data-review="city"></dd><button type="button" data-edit="2" aria-label="Edit location and timing">Edit</button></div>
              <div><dt>Timing</dt><dd data-review="timing"></dd></div>
            </dl></div>
            <details class="drive-details"><summary>Anything else we should know? <span>(optional)</span></summary><label class="lead-field">Project notes<textarea name="notes" rows="2" maxlength="1500" placeholder="Damage, access, a finish you like…"></textarea></label></details>
            <p class="lead-privacy">By submitting, you ask AZ Elevated Builders to contact you about your project. <a href="/privacy.html">Privacy policy</a>.</p>
          </fieldset>
        </div>
        <div class="wizard-actions"><button class="wizard-back" type="button" data-back hidden><span aria-hidden="true">←</span> Back</button><button type="button" class="btn btn--solid wizard-next" data-next hidden>Continue <span aria-hidden="true">→</span></button><button type="submit" class="btn btn--solid" disabled>Request my free estimate <span aria-hidden="true">↗</span></button></div>
        <p class="wizard-reassurance">Free estimate · No obligation</p>
        <div class="wizard-success" hidden><span class="wizard-success__mark" aria-hidden="true">✓</span><p class="wizard-eyebrow">You’re all set</p><h3>One step closer<br>to a new driveway.</h3><p>Your next step: a call with our team to talk through your project.</p></div>
        <p class="lead-status" data-lead-status role="status" aria-live="polite" tabindex="-1"></p>
      </form>
      <noscript><p>Please call us to request your estimate.</p></noscript>
      <a class="drive-form-call" href="tel:${brand.phoneHref}" data-cta="driveway-form">Prefer to talk? ${brand.phone}</a>
    </section>
  </section>
  <section class="drive-project drive-section" aria-label="Our work and experience">
  <div class="drive-trust"><span>Family-run in Brentwood</span><span>${esc(brand.license)}</span><span>Hablamos español</span></div>
  <figure class="drive-result" id="project">
    ${photo('vacaville-driveway__replacement-wide', 'AZ Elevated Builders crew removing an old concrete driveway with a skid steer, ready for the new pour', 800)}
    <figcaption><span>Actual AZ Elevated Builders project</span><span>Vacaville · Driveway replacement</span></figcaption>
  </figure>
  </section>
  <section class="drive-scope drive-section" id="scope">
    <div><p class="drive-kicker">More than a new surface</p><h2>The work underneath<br>makes the difference.</h2><p>A cracked, uneven or worn driveway deserves a closer look. We assess the existing concrete, access and drainage before recommending a replacement scope.</p></div>
    <ol class="drive-scope__list">
      <li><span>01</span><div><h3>Remove &amp; prepare</h3><p>Discuss demolition, hauling and site access. Evaluate the base and grading for the new driveway.</p></div></li>
      <li><span>02</span><div><h3>Form &amp; pour</h3><p>Plan the layout, drainage, reinforcement and finish to suit your property and intended use.</p></div></li>
      <li><span>03</span><div><h3>Finish &amp; hand over</h3><p>Walk through the finished work and get guidance on curing, vehicle access and care.</p></div></li>
    </ol>
  </section>
  <section class="drive-proof drive-section" aria-labelledby="proof-title">
    <div class="drive-proof__image">${photo('walnut-creek-exterior__finishing-slab', 'Concrete being hand-finished by the AZ Elevated Builders crew')}<p>Concrete finishing · Walnut Creek project</p></div>
    <div class="drive-proof__copy"><p class="drive-kicker">Real people. Real work.</p><h2 id="proof-title">Know who you’re<br>building with.</h2><p>AZ Elevated Builders is a family-run general contractor based in Brentwood. Alfonso Zavala and the team bring the same attention to the concrete beneath your feet as the rest of your home.</p><ul><li>A free on-site assessment</li><li>A written scope before work begins</li><li>A clear plan for access and scheduling</li><li>English and Spanish spoken</li></ul><a class="drive-review" href="${brand.gbp}" target="_blank" rel="noopener">Read our Google reviews <span aria-hidden="true">↗</span></a><a class="btn btn--outline" href="#estimate">Plan my driveway replacement</a></div>
  </section>
  <section class="drive-answers drive-section" id="questions"><div><p class="drive-kicker">Before you replace it</p><h2>Good questions.<br>Straight answers.</h2><p>Every property is different. Start with the essentials, then let’s look at yours.</p></div><div class="faq">${questions.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>
  <section class="drive-area drive-section" id="service-area" aria-labelledby="area-title">
    <p class="drive-kicker">Based in Brentwood · Serving ${cities.length} communities</p>
    <h2 id="area-title">A better driveway,<br>closer to home.</h2>
    <p>From the East Bay and Tri-Valley to the Delta, Solano and Napa areas, we serve the communities below.</p>
    <div class="drive-city-groups">${counties.map(county => `<details class="drive-city-group"><summary>${esc(county)} <span>${cities.filter(city => city.county === county).length} communities</span></summary><ul>${cities.filter(city => city.county === county).map(city => `<li data-service-city="${esc(city.slug)}">${esc(city.name)}</li>`).join('')}</ul></details>`).join('')}</div>
    <p>Add your city to the form and we’ll discuss your driveway, access and scheduling.</p>
    <div class="drive-area__actions"><a class="btn btn--solid" href="#estimate">Get my free estimate</a><a class="drive-area__call" href="tel:${brand.phoneHref}" data-cta="driveway-bottom">${brand.phone}</a></div>
  </section>
</main>
${wizardScript}
${footer}`;
}
