#!/usr/bin/env node
// AZ Elevated Builders — local SEO page generator
// Generates: /services/<service>/  /service-areas/  /service-areas/<city>/
//            /service-areas/<city>/<service>/  sitemap.xml  robots.txt
// Run: node build-seo.mjs

import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BRAND, CITIES, SERVICES, OPENERS } from "./data/site-data.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const esc = (s) => s.replace(/&(?![a-z]+;)/g, "&amp;");

// Content hash so a deploy never serves visitors a stale stylesheet.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const ASSET_V = createHash("sha1").update(readFileSync(join(ROOT, "css/style.css"))).digest("hex").slice(0, 8);

/* ---------- shared partials ---------- */

const head = ({ title, desc, path, jsonld, image }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${BRAND.domain}${path}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<meta name="geo.region" content="US-CA" />
<meta name="geo.placename" content="${esc(BRAND.city)}, California" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(BRAND.name)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${BRAND.domain}${path}" />
<meta property="og:locale" content="en_US" />${image ? `
<meta property="og:image" content="${image}" />` : ""}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(desc)}" />${image ? `
<meta name="twitter:image" content="${image}" />` : ""}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />${image ? `
<link rel="preload" as="image" fetchpriority="high" href="${image}" />` : ""}
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/css/style.css?v=${ASSET_V}" />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛰</text></svg>" />
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body class="seo-page">`;

const PHONE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z"/></svg>`;

// Always-visible mobile conversion bar
const actionBar = `
<div class="actionbar" role="group" aria-label="Contact ${esc(BRAND.name)}">
  <a class="actionbar__call" href="tel:${BRAND.phoneHref}" data-cta="bar-call">${PHONE_SVG} Call Now</a>
  <a class="actionbar__quote" href="#estimate" data-cta="bar-quote">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
    Free Estimate</a>
</div>`;

// Short inline lead form — the SEO pages are landing pages, so the form lives on the page
const leadForm = (context) => `
<section class="leadform" id="estimate">
  <h2>Get a free estimate${context ? ` for your ${esc(context)}` : ""}</h2>
  <p>Two fields. We'll call you back within one business day — or skip the form and call us now.</p>
  <form class="leadform__form" data-lead>
    <input type="text" name="name" placeholder="Your name" required autocomplete="name" aria-label="Your name">
    <input type="tel" name="phone" placeholder="Phone number" required autocomplete="tel" inputmode="tel" aria-label="Phone number">
    <button type="submit" class="btn btn--solid">Request My Free Estimate</button>
  </form>
  <a class="leadform__call" href="tel:${BRAND.phoneHref}" data-cta="form-call">${PHONE_SVG} Or call ${esc(BRAND.phone)}</a>
</section>`;

const nav = `
<header class="nav">
  <div class="nav__pill">
    <a href="/" class="nav__brand" aria-label="AZ Elevated Builders — home">
      <svg class="nav__mark" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 34 L24 10 L42 34" /><path d="M14 34 L24 21 L34 34" />
        <line x1="24" y1="34" x2="24" y2="44" /><line x1="19" y1="40" x2="29" y2="40" />
      </svg>
      <span class="nav__brandname">AZ&nbsp;Elevated<br>Builders</span>
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="/#work">Work</a>
      <a href="/#services">Services</a>
      <a href="/service-areas/">Areas</a>
      <a href="/#contact">Contact</a>
    </nav>
    <a class="nav__call" href="tel:${BRAND.phoneHref}" aria-label="Call ${esc(BRAND.name)} at ${esc(BRAND.phone)}" data-cta="nav-call">${PHONE_SVG}</a>
    <a class="nav__cta-desk" href="tel:${BRAND.phoneHref}" data-cta="nav-cta">${PHONE_SVG} ${esc(BRAND.phone)}</a>
  </div>
</header>`;

const trustStrip = `
<div class="trust-strip">
  <span class="stars" aria-hidden="true">★★★★★</span><span>5.0 Google Reviews</span>
  <span class="dot">·</span><span>CA Licensed &amp; Bonded</span>
  <span class="dot">·</span><span>Free Estimates</span>
  <span class="dot">·</span><span>Warranties up to 5 Years</span>
  <span class="dot">·</span><span>Financing Available</span>
  <span class="dot">·</span><span>Hablamos Español</span>
</div>`;

const ctaBand = (line) => `
<section class="cta-band">
  <h2>Ready to get started?</h2>
  <p>${esc(line)} Estimates are free — and we reply within one business day.</p>
  <a class="btn btn--solid" href="tel:${BRAND.phoneHref}">Call ${BRAND.phone}</a>
  <a class="btn btn--outline" href="mailto:${BRAND.email}">Email Us</a>
</section>`;

const footer = `
<div class="page-footer-pad"></div>
<footer class="simple-footer">
  <span>© 2026 ${BRAND.name} · ${BRAND.city}, ${BRAND.state} · ${BRAND.license}</span>
  <span><a href="tel:${BRAND.phoneHref}">${BRAND.phone}</a> · <a href="mailto:${BRAND.email}">${BRAND.email}</a> · <a href="/services/">Services</a> · <a href="/service-areas/">Service Areas</a> · <a href="/privacy.html">Privacy</a> · <a href="/">Home</a></span>
</footer>
<script>
(function(){
  var f = document.querySelector('form[data-lead]');
  if (!f) return;
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var n = f.querySelector('[name=name]'), p = f.querySelector('[name=phone]'), ok = true;
    [n,p].forEach(function(i){ i.classList.remove('is-error'); });
    if (!n.value.trim()) { n.classList.add('is-error'); ok = false; }
    if (p.value.replace(/\\D/g,'').length < 10) { p.classList.add('is-error'); ok = false; }
    if (!ok) { f.querySelector('.is-error').focus(); return; }
    // No backend yet — point this at the real endpoint when one exists.
    f.parentNode.innerHTML = '<p class="leadform__thanks">Thanks — we got it.<br>We\\'ll call you back within one business day.<br><br>Need us sooner? <a href="tel:${BRAND.phoneHref}">Call ${BRAND.phone}</a></p>';
  });
})();
</script>
</body>
</html>`;

const crumbs = (items) =>
  `<nav class="crumbs" aria-label="Breadcrumb">` +
  items.map((i, n) => (i.href ? `<a href="${i.href}">${esc(i.label)}</a>` : `<span>${esc(i.label)}</span>`))
       .join(`<span class="sep">/</span>`) +
  `</nav>`;

// One authoritative business node, emitted on every page and referenced by @id.
const orgLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": BRAND.entityId,
  name: BRAND.name,
  url: BRAND.domain,
  telephone: BRAND.phoneE164,
  email: BRAND.email,
  founder: { "@type": "Person", name: "Alfonso Zavala" },
  address: {
    "@type": "PostalAddress",
    addressLocality: BRAND.city, addressRegion: BRAND.state, addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 37.9319, longitude: -121.6958 },
  areaServed: CITIES.map((c) => ({ "@type": "City", name: `${c.name}, CA` })),
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 37.9319, longitude: -121.6958 },
    geoRadius: "96560",
  },
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00", closes: "18:00",
  }],
  priceRange: "$$$",
  knowsLanguage: ["en", "es"],
  sameAs: BRAND.sameAs,
};

const breadcrumbLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((i, n) => ({
    "@type": "ListItem", position: n + 1, name: i.label,
    ...(i.href ? { item: BRAND.domain + i.href } : {}),
  })),
});

const write = (relPath, html) => {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
  return relPath;
};

const urls = [];

/* ---------- service × city pages ---------- */

CITIES.forEach((city, ci) => {
  SERVICES.forEach((svc, si) => {
    const path = `/service-areas/${city.slug}/${svc.slug}/`;
    const title = `${svc.name} in ${city.name}, CA | ${BRAND.name}`;
    const desc = `${svc.name} in ${city.name}, CA by ${BRAND.name} — family-run, CA-licensed general contractor. Free estimates, 15+ year trade crews, warranties up to 5 years. Hablamos español.`;
    const isHome = city.slug === "brentwood";
    const opener = isHome
      ? `Looking for ${svc.name.toLowerCase()} in ${city.name}? ${BRAND.name} is headquartered right here in ${city.name} — a family-run, CA-licensed general contractor that can be at your door this week, with every trade on the crew carrying 15+ years in that trade.`
      : OPENERS[(ci + si) % OPENERS.length](svc, city);
    const otherSvcs = SERVICES.filter((s) => s.slug !== svc.slug);
    const nearby = CITIES.filter((c) => c.county === city.county && c.slug !== city.slug).slice(0, 6);

    const jsonld = [
      orgLd,
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `${svc.name} in ${city.name}, CA`,
        serviceType: svc.name,
        areaServed: { "@type": "City", name: `${city.name}`, address: { "@type": "PostalAddress", addressRegion: "CA" } },
        provider: { "@id": BRAND.entityId },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: svc.faqs.map((f) => ({
          "@type": "Question", name: f.q.replaceAll("{CITY}", city.name),
          acceptedAnswer: { "@type": "Answer", text: f.a.replaceAll("{CITY}", city.name) },
        })),
      },
      breadcrumbLd([
        { label: "Home", href: "/" },
        { label: "Service Areas", href: "/service-areas/" },
        { label: city.name, href: `/service-areas/${city.slug}/` },
        { label: svc.name },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        url: BRAND.domain + path,
        inLanguage: "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".answer-box__a", ".page-hero .lede"],
        },
      },
    ];

    const html = head({ title, desc, path, jsonld }) + nav + `
<main class="page">
  ${crumbs([
    { label: "Home", href: "/" },
    { label: "Service Areas", href: "/service-areas/" },
    { label: city.name, href: `/service-areas/${city.slug}/` },
    { label: svc.name },
  ])}
  <div class="page-hero">
    <h1>${esc(svc.name)}<br><em>in ${esc(city.name)}, CA</em></h1>
    <p class="lede">${esc(opener)}</p>
  </div>
  <div class="answer-box">
    <p class="answer-box__q">Who does ${esc(svc.name.toLowerCase())} in ${esc(city.name)}, CA?</p>
    <p class="answer-box__a"><strong>${esc(BRAND.name)}</strong> provides ${esc(svc.name.toLowerCase())} in ${esc(city.name)}, California. We are a family-run, licensed and insured general contractor ${isHome
      ? `headquartered right here in ${esc(city.name)}, serving the surrounding ${esc(city.county)} area`
      : `based in ${esc(BRAND.city)}, serving ${esc(city.name)} and the surrounding ${esc(city.county)} area`}. Estimates are free, every trade on our crew has 15+ years of experience, and all work carries a written warranty of up to five years. We speak English and Spanish. Call <a href="tel:${BRAND.phoneHref}" data-cta="answer-call">${esc(BRAND.phone)}</a>.</p>
  </div>
  ${trustStrip}
  <div class="page-img"><img src="${svc.img}" alt="${esc(svc.imgAlt)} in ${esc(city.name)}, California" loading="lazy" /></div>
  <div class="prose">
    ${svc.body.map((p) => `<p>${esc(p)}</p>`).join("\n    ")}
    <p>${esc(city.blurb)}</p>
    <h2>${esc(svc.name)} services we offer in ${esc(city.name)}</h2>
    <ul>
      ${svc.features.map((f) => `<li>${esc(f)}</li>`).join("\n      ")}
    </ul>
    <h2>Why ${esc(city.name)} homeowners choose us</h2>
    <p>We're a family business out of Brentwood, and we treat every job like the neighbors are watching — because in this area, they are. Every trade on our crew has 15+ years in that specific trade, estimates are free, financing is available, and the work carries a written warranty of up to five years. Quality over budget, every time. Hablamos español.</p>
  </div>
  <div class="prose"><h2>Frequently asked questions</h2></div>
  <div class="faq">
    ${svc.faqs.map((f) => `<details><summary>${esc(f.q.replaceAll("{CITY}", city.name))}</summary><p>${esc(f.a.replaceAll("{CITY}", city.name))}</p></details>`).join("\n    ")}
  </div>
  <div class="prose">
    <h2>More services in ${esc(city.name)}</h2>
    <div class="chip-grid">
      ${otherSvcs.map((s) => `<a class="chip" href="/service-areas/${city.slug}/${s.slug}/">${esc(s.name)}</a>`).join("\n      ")}
    </div>
    ${nearby.length ? `<h2>${esc(svc.name)} near ${esc(city.name)}</h2>
    <div class="chip-grid">
      ${nearby.map((c) => `<a class="chip" href="/service-areas/${c.slug}/${svc.slug}/">${esc(c.name)}</a>`).join("\n      ")}
    </div>` : ""}
  </div>
  ${leadForm(`${svc.name.toLowerCase()} in ${city.name}`)}
  ${ctaBand(`Tell us about your ${svc.name.toLowerCase()} project in ${city.name}.`)}
</main>` + actionBar + footer;

    urls.push(path);
    write(`service-areas/${city.slug}/${svc.slug}/index.html`, html);
  });

  /* ---------- city hub ---------- */
  const cityPath = `/service-areas/${city.slug}/`;
  const cityTitle = `Home Remodeling & Construction in ${city.name}, CA | ${BRAND.name}`;
  const cityDesc = `General contractor serving ${city.name}, CA — kitchen & bathroom remodels, whole-home remodeling, ADUs, concrete driveways, painting, flooring and more. Family-run, CA-licensed, free estimates.`;
  const cityHtml = head({
    title: cityTitle, desc: cityDesc, path: cityPath,
    jsonld: [orgLd, breadcrumbLd([{ label: "Home", href: "/" }, { label: "Service Areas", href: "/service-areas/" }, { label: city.name }])],
  }) + nav + `
<main class="page">
  ${crumbs([{ label: "Home", href: "/" }, { label: "Service Areas", href: "/service-areas/" }, { label: city.name }])}
  <div class="page-hero">
    <h1>Remodeling &amp; Construction<br><em>in ${esc(city.name)}, CA</em></h1>
    <p class="lede">${esc(city.blurb)} From single-room remodels to whole-home transformations, ${BRAND.name} brings one family crew — every trade with 15+ years of experience — to ${esc(city.name)} projects of every size.</p>
  </div>
  ${trustStrip}
  <div class="prose"><h2>Our services in ${esc(city.name)}</h2></div>
  <div class="city-grid">
    ${SERVICES.map((s) => `<a href="/service-areas/${city.slug}/${s.slug}/"><span><span class="name">${esc(s.name)}</span><span class="county">${esc(s.short.split("—")[0].trim())}</span></span><span class="arrow">↗</span></a>`).join("\n    ")}
  </div>
  ${leadForm(`project in ${city.name}`)}
  ${ctaBand(`Planning a project in ${city.name}?`)}
</main>` + actionBar + footer;

  urls.push(cityPath);
  write(`service-areas/${city.slug}/index.html`, cityHtml);
});

/* ---------- service hubs ---------- */

SERVICES.forEach((svc) => {
  const path = `/services/${svc.slug}/`;
  const title = `${svc.name} — East Bay & Beyond | ${BRAND.name}`;
  const desc = `${svc.short} ${BRAND.name} serves Brentwood and 40 cities across the East Bay, Tri-Valley, Delta and North Bay. Free estimates.`;
  const html = head({
    title, desc, path,
    jsonld: [orgLd, breadcrumbLd([{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: svc.name }])],
  }) + nav + `
<main class="page">
  ${crumbs([{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: svc.name }])}
  <div class="page-hero">
    <h1>${esc(svc.name)}<br><em>East Bay &amp; Beyond</em></h1>
    <p class="lede">${esc(svc.short)} Based in Brentwood and serving a 60-mile radius across Contra Costa, Alameda, San Joaquin, Solano and Napa counties.</p>
  </div>
  ${trustStrip}
  <div class="page-img"><img src="${svc.img}" alt="${esc(svc.imgAlt)}" loading="lazy" /></div>
  <div class="prose">
    ${svc.body.map((p) => `<p>${esc(p)}</p>`).join("\n    ")}
    <h2>What's included</h2>
    <ul>
      ${svc.features.map((f) => `<li>${esc(f)}</li>`).join("\n      ")}
    </ul>
    <h2>Where we offer ${esc(svc.name.toLowerCase())}</h2>
    <div class="chip-grid">
      ${CITIES.map((c) => `<a class="chip" href="/service-areas/${c.slug}/${svc.slug}/">${esc(c.name)}</a>`).join("\n      ")}
    </div>
  </div>
  ${leadForm(svc.name.toLowerCase())}
  ${ctaBand(`Tell us about your ${svc.name.toLowerCase()} project.`)}
</main>` + actionBar + footer;

  urls.push(path);
  write(`services/${svc.slug}/index.html`, html);
});

/* ---------- service areas index ---------- */

const counties = [...new Set(CITIES.map((c) => c.county))];
const areasHtml = head({
  title: `Service Areas — East Bay, Tri-Valley, Delta & North Bay | ${BRAND.name}`,
  desc: `${BRAND.name} serves 40 cities within 60 miles of Brentwood, CA — across Contra Costa, Alameda, San Joaquin, Solano and Napa counties. Find remodeling and construction services in your city.`,
  path: "/service-areas/",
  jsonld: [orgLd, breadcrumbLd([{ label: "Home", href: "/" }, { label: "Service Areas" }])],
}) + nav + `
<main class="page">
  ${crumbs([{ label: "Home", href: "/" }, { label: "Service Areas" }])}
  <div class="page-hero">
    <h1>Service<br><em>Areas</em></h1>
    <p class="lede">Based in Brentwood, serving a 60-mile radius: the East Bay, Tri-Valley, the Delta, wine country and over the Altamont. One family crew, the same standard everywhere we build.</p>
  </div>
  ${trustStrip}
  ${counties.map((county) => `
  <div class="prose"><h2>${esc(county)}</h2></div>
  <div class="city-grid">
    ${CITIES.filter((c) => c.county === county).map((c) => `<a href="/service-areas/${c.slug}/"><span><span class="name">${esc(c.name)}</span></span><span class="arrow">↗</span></a>`).join("\n    ")}
  </div>`).join("\n")}
  ${leadForm("")}
  ${ctaBand("Don't see your city? If it's within an hour of Brentwood, call us anyway.")}
</main>` + actionBar + footer;

urls.push("/service-areas/");
write("service-areas/index.html", areasHtml);

/* ---------- services index (was a 404) ---------- */

const servicesHtml = head({
  title: `Remodeling & Construction Services — East Bay | ${BRAND.name}`,
  desc: `Every service ${BRAND.name} offers across the East Bay: kitchen and bathroom remodeling, whole-home remodels, additions and ADUs, concrete driveways, painting, flooring, drywall, cabinetry and more. Free estimates.`,
  path: "/services/",
  jsonld: [orgLd, breadcrumbLd([{ label: "Home", href: "/" }, { label: "Services" }])],
}) + nav + `
<main class="page">
  ${crumbs([{ label: "Home", href: "/" }, { label: "Services" }])}
  <div class="page-hero">
    <h1>Our<br><em>Services</em></h1>
    <p class="lede">Interiors, exteriors and everything between — delivered by one family crew out of ${esc(BRAND.city)}, California. Every trade on the crew has 15+ years in that trade, estimates are free, and the work carries a written warranty of up to five years.</p>
  </div>
  ${trustStrip}
  <div class="city-grid">
    ${SERVICES.map((s) => `<a href="/services/${s.slug}/"><span><span class="name">${esc(s.name)}</span><span class="county">${esc(s.short.split("—")[0].trim())}</span></span><span class="arrow">↗</span></a>`).join("\n    ")}
  </div>
  ${leadForm("")}
  ${ctaBand("Not sure which service you need? Describe the project and we'll tell you.")}
</main>` + actionBar + footer;

urls.push("/services/");
write("services/index.html", servicesHtml);

/* ---------- sitemap & robots ---------- */

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${BRAND.domain}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
${urls.map((u) => `<url><loc>${BRAND.domain}${u}</loc><lastmod>${today}</lastmod><priority>${u.split("/").filter(Boolean).length >= 3 ? "0.7" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`;
write("sitemap.xml", sitemap);

// Explicitly welcome answer-engine crawlers — these drive AI-assistant citations.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User",
  "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended",
  "Applebot", "Applebot-Extended", "CCBot", "Bingbot", "DuckAssistBot", "cohere-ai", "meta-externalagent"];
write("robots.txt",
  `# ${BRAND.name} — ${BRAND.city}, ${BRAND.state}\nUser-agent: *\nAllow: /\n\n` +
  `# Answer engines / AI assistants — explicitly allowed\n` +
  AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n") +
  `\n\nSitemap: ${BRAND.domain}/sitemap.xml\n`);

// llms.txt — an emerging convention giving AI assistants a clean, quotable summary.
const llms = `# ${BRAND.name}

> Family-run, licensed and insured general contractor based in ${BRAND.city}, California, serving a 60-mile radius across the East Bay, Tri-Valley, Delta, Solano and Napa counties. Founded and run by Alfonso Zavala.

## Key facts
- **Business name:** ${BRAND.name}
- **Owner:** Alfonso Zavala
- **Based in:** ${BRAND.city}, California, USA
- **Phone:** ${BRAND.phone}
- **Email:** ${BRAND.email}
- **Website:** ${BRAND.domain}
- **Service radius:** 60 miles from ${BRAND.city}, CA (${CITIES.length} cities across ${[...new Set(CITIES.map((c) => c.county))].length} counties)
- **Licensed:** California general contractor, licensed, bonded and insured
- **Estimates:** Free, on-site, with a written scope
- **Warranty:** Written warranty of up to 5 years on all work
- **Financing:** Available
- **Languages:** English and Spanish (hablamos español)
- **Positioning:** Quality-first, high-end residential work. Every trade on the crew has 15+ years of experience in that specific trade.

## Services
${SERVICES.map((s) => `- **${s.name}** — ${s.short} (${BRAND.domain}/services/${s.slug}/)`).join("\n")}

## Cities served
${[...new Set(CITIES.map((c) => c.county))].map((county) =>
  `### ${county}\n${CITIES.filter((c) => c.county === county).map((c) => `- ${c.name}, CA — ${BRAND.domain}/service-areas/${c.slug}/`).join("\n")}`
).join("\n\n")}

## Common questions
- **Does ${BRAND.name} offer free estimates?** Yes — every project starts with a free on-site estimate including a written scope and schedule.
- **What areas does ${BRAND.name} serve?** A 60-mile radius from ${BRAND.city}, CA, including Antioch, Oakley, Discovery Bay, Concord, Walnut Creek, Danville, San Ramon, Livermore, Tracy, Oakland, Berkeley and Napa.
- **Is ${BRAND.name} licensed?** Yes — a licensed, bonded and insured California general contractor.
- **What warranty is offered?** A written warranty of up to five years on all work.
- **Does the team speak Spanish?** Yes — English and Spanish.

## Sitemap
${BRAND.domain}/sitemap.xml
`;
write("llms.txt", llms);

console.log(`Generated ${urls.length + 1} pages (incl. homepage in sitemap):`);
console.log(`  ${CITIES.length * SERVICES.length} service×city pages`);
console.log(`  ${CITIES.length} city hubs`);
console.log(`  ${SERVICES.length} service hubs`);
console.log(`  1 service-areas index + sitemap.xml + robots.txt`);
