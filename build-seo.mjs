#!/usr/bin/env node
// AZ Elevated Builders — local SEO page generator
// Generates: /services/<service>/  /service-areas/  /service-areas/<city>/
//            /service-areas/<city>/<service>/  sitemap.xml  robots.txt
// Run: node build-seo.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { drivewayBody } from "./build-driveway.mjs";
import { BRAND, CITIES, SERVICES, OPENERS, SERVICE_LOCAL, WHY_VARIANTS, SERVICE_IMAGES, PROFILE_NOTES } from "./data/site-data.mjs";

// Join a list into readable prose: "a, b and c"
const listPhrase = (arr) =>
  arr.length <= 1 ? (arr[0] || "") : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];

const ROOT = dirname(fileURLToPath(import.meta.url));
const esc = (s) => String(s).replace(/&(?![a-z]+;)/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Minify the stylesheet at build time and fingerprint the result, so pages
// ship less CSS and a deploy never serves a stale copy. Conservative minify:
// strips comments and collapses whitespace but never touches calc() operators.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const cssSource = readFileSync(join(ROOT, "css/style.css"), "utf8");
const cssMin = cssSource
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/ ?([{};,>]) ?/g, "$1")
  .replace(/;}/g, "}")
  .trim();
writeFileSync(join(ROOT, "css/style.min.css"), cssMin);
const ASSET_V = createHash("sha1").update(cssMin).digest("hex").slice(0, 8);

/* ---------- shared partials ---------- */

const head = ({ title, desc, path, jsonld, image, robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1", extraStyles = "", extraHead = "" }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${BRAND.domain}${path}" />
<meta name="robots" content="${robots}" />
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
<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/InterTight-var.woff2" />
<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/Inter-var.woff2" />${image ? `
<link rel="preconnect" href="https://images.unsplash.com" crossorigin />` : ""}
<link rel="stylesheet" href="/css/style.min.css?v=${ASSET_V}" />
${extraStyles}
${extraHead}
<link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml" />
  <link rel="alternate icon" href="/assets/brand/favicon.ico" sizes="16x16 32x32 48x48" />
  <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png" />
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body class="seo-page">
<a class="skip-link" href="#main">Skip to content</a>`;

// Build a responsive candidate set from an Unsplash URL (it resizes via &w=).
const srcsetFor = (url) => {
  if (url.startsWith("/assets/projects/")) return [480, 800, 1200, 1600].map((w) => `${url.replace(/-\d+\.webp$/, `-${w}.webp`)} ${w}w`).join(", ");
  const base = url.replace(/[?&]w=\d+/, "");
  const join = base.includes("?") ? "&" : "?";
  return [480, 800, 1200, 1600].map((w) => `${base}${join}w=${w} ${w}w`).join(", ");
};
const concretePhoto = "/assets/projects/walnut-creek-exterior__after-wide-1600.webp";
const SIZES = "(max-width: 900px) 100vw, 900px";

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
  <form class="leadform__form" data-lead data-source="website-service" method="post">
    <label class="lead-field">Your name<input type="text" name="name" maxlength="100" placeholder="Your name" required autocomplete="name"></label>
    <label class="lead-field">Phone number<input type="tel" name="phone" maxlength="25" placeholder="(925) 555-0123" required autocomplete="tel" inputmode="tel"></label>
    <button type="submit" class="btn btn--solid" disabled>Request My Free Estimate</button>
    <p class="lead-privacy">By submitting, you ask ${esc(BRAND.name)} to contact you about your project. <a href="/privacy.html">Privacy policy</a>.</p>
    <p class="lead-status" data-lead-status role="status" aria-live="polite" tabindex="-1"></p>
  </form>
  <noscript><p>To request your free estimate, please call <a href="tel:${BRAND.phoneHref}">${BRAND.phone}</a>.</p></noscript>
  <a class="leadform__call" href="tel:${BRAND.phoneHref}" data-cta="form-call">${PHONE_SVG} Or call ${esc(BRAND.phone)}</a>
</section>`;

const nav = `
<header class="nav">
  <div class="nav__pill">
    <a href="/" class="nav__brand" aria-label="AZ Elevated Builders — home">
      <img class="brandmark" src="/assets/brand/mark-white.svg" alt="" width="96" height="77" />
      <img class="brandword" src="/assets/brand/wordmark-white.svg" alt="" width="132" height="30" />
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

const renderFooter = (leadEndpoint = BRAND.leadWebhook) => `
<div class="page-footer-pad"></div>
<footer class="simple-footer">
  <span>© 2026 ${BRAND.name} · ${BRAND.city}, ${BRAND.state} · ${BRAND.license}</span>
  <span><a href="tel:${BRAND.phoneHref}">${BRAND.phone}</a> · <a href="mailto:${BRAND.email}">${BRAND.email}</a> · <a href="/services/">Services</a> · <a href="/service-areas/">Service Areas</a> · <a href="/privacy.html">Privacy</a> · <a href="/">Home</a></span>
  <span class="foot__credit">Website by <a href="https://tothemaxmedia.com" target="_blank" rel="noopener">To The Max Media</a></span>
</footer>
<script>window.AZEB_LEAD_ENDPOINT=${JSON.stringify(leadEndpoint || "")};</script>
<script defer src="/js/leads.js?v=${createHash("sha1").update(readFileSync(join(ROOT, "js/leads.js"))).digest("hex").slice(0, 8)}"></script>
</body>
</html>`;
const footer = renderFooter();

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
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "license",
    recognizedBy: { "@type": "Organization", name: "California Contractors State License Board" },
    identifier: "1106795",
  },
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
  writeFileSync(full, html.replace(/[ \t]+$/gm, ""));
  return relPath;
};

const urls = [];

/* ---------- service × city pages ---------- */

CITIES.forEach((city, ci) => {
  SERVICES.forEach((svc, si) => {
    const path = `/service-areas/${city.slug}/${svc.slug}/`;
    const title = `${svc.name} in ${city.name}, CA | ${BRAND.name}`;
    const desc = `${svc.name} in ${city.name}, CA. ${BRAND.name} is a family-run, licensed general contractor working across ${listPhrase(city.hoods.slice(0, 3))}. Free estimates, 15+ years per trade, written warranty up to 5 years. Call ${BRAND.phone}.`;
    const lens = SERVICE_LOCAL[svc.slug];
    const profileNote = PROFILE_NOTES[svc.slug][city.profile];
    // rotate the hero photo so adjacent city pages don't share an image
    const imgSet = SERVICE_IMAGES[svc.slug] || [svc.img];
    const img = imgSet[ci % imgSet.length];
    const isHome = city.slug === "brentwood";
    const opener = isHome
      ? `Looking for ${svc.name.toLowerCase()} in ${city.name}? ${BRAND.name} is headquartered right here in ${city.name} — a family-run, CA-licensed general contractor serving local homeowners, with every trade on the crew carrying 15+ years in that trade.`
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
      },
    ];

    const html = head({ title, desc, path, jsonld, image: img }) + nav + `
<main class="page" id="main" tabindex="-1">
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
  <div class="page-img"><img src="${svc.slug === "concrete-driveways" ? concretePhoto : img}" srcset="${srcsetFor(svc.slug === "concrete-driveways" ? concretePhoto : img)}" sizes="${SIZES}" width="1600" height="900" alt="${esc(svc.slug === "concrete-driveways" ? "AZ Elevated Builders concrete work at the Walnut Creek exterior project" : svc.imgAlt)}" loading="lazy" decoding="async" /></div>
  <div class="prose">
    ${svc.body.map((p) => `<p>${esc(p)}</p>`).join("\n    ")}

    <h2>${esc(svc.name)} in ${esc(city.name)}: what's different here</h2>
    <p>${esc(city.blurb)}</p>
    <p>Most of ${esc(city.name)} is ${esc(city.era)}. ${esc(profileNote)}</p>
    <p>We work throughout ${esc(city.name)}, including ${esc(listPhrase(city.hoods))}.${city.adjacent ? ` We also cover neighboring ${esc(listPhrase(city.adjacent))} — those are unincorporated, so permits there run through ${esc(city.county)} rather than the city.` : ""} The local constant is ${esc(city.terrain)}. ${esc(lens.terrain)}</p>

    <h2>Permits and inspections in ${esc(city.name)}</h2>
    <p>Permits for work in ${esc(city.name)} go through ${esc(city.permit)}. ${esc(lens.permit)} You should never be the one standing at a counter or waiting on an inspector — that is part of what you hire a licensed contractor for.</p>

    <h2>${esc(svc.name)} services we offer in ${esc(city.name)}</h2>
    <ul>
      ${svc.features.map((f) => `<li>${esc(f)}</li>`).join("\n      ")}
    </ul>

    <h2>Why ${esc(city.name)} homeowners choose us</h2>
    <p>${esc(WHY_VARIANTS[(ci * 7 + si * 3) % WHY_VARIANTS.length](city))} Hablamos español.</p>
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
<main class="page" id="main" tabindex="-1">
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
    title, desc, path, image: svc.img,
    jsonld: [orgLd, breadcrumbLd([{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: svc.name }])],
  }) + nav + `
<main class="page" id="main" tabindex="-1">
  ${crumbs([{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: svc.name }])}
  <div class="page-hero">
    <h1>${esc(svc.name)}<br><em>East Bay &amp; Beyond</em></h1>
    <p class="lede">${esc(svc.short)} Based in Brentwood and serving a 60-mile radius across Contra Costa, Alameda, San Joaquin, Solano and Napa counties.</p>
  </div>
  ${trustStrip}
  <div class="page-img"><img src="${svc.slug === "concrete-driveways" ? concretePhoto : svc.img}" srcset="${srcsetFor(svc.slug === "concrete-driveways" ? concretePhoto : svc.img)}" sizes="${SIZES}" width="1600" height="900" alt="${esc(svc.slug === "concrete-driveways" ? "Completed AZ Elevated Builders exterior project with concrete driveway in Walnut Creek" : svc.imgAlt)}" loading="lazy" decoding="async" /></div>
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
  <section aria-labelledby="service-faq"><div class="prose"><h2 id="service-faq">Frequently asked questions</h2></div><div class="faq">
    ${svc.faqs.map((f) => `<details><summary>${esc(f.q.replaceAll("{CITY}", "the East Bay"))}</summary><p>${esc(f.a.replaceAll("{CITY}", "the East Bay"))}</p></details>`).join("\n    ")}
  </div></section>
  ${svc.slug === "concrete-driveways" ? `<div class="prose"><h2>Replacing an existing driveway?</h2><p>See our <a href="/driveway-replacement/">concrete driveway replacement guide and estimate form</a> for demolition, preparation, finish options and what affects the cost.</p></div>` : ""}
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
<main class="page" id="main" tabindex="-1">
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
<main class="page" id="main" tabindex="-1">
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

/* ---------- focused Google Ads destination ---------- */
const drivewayCssHash = createHash("sha1").update(readFileSync(join(ROOT, "css/driveway.css"))).digest("hex").slice(0, 8);
const drivewayScriptHash = createHash("sha1").update(readFileSync(join(ROOT, "js/driveway-wizard.js"))).digest("hex").slice(0, 8);
const drivewayHtml = head({
  title: "Concrete Driveway Replacement | AZ Elevated Builders",
  desc: `Concrete driveway replacement across the East Bay, Tri-Valley, Delta, Solano and Napa areas. Serving ${CITIES.length} communities. Request a free on-site estimate.`,
  path: "/driveway-replacement/",
  robots: "noindex, follow",
  image: BRAND.domain + "/assets/projects/stamped-driveway__after-wide-1200.jpg",
  jsonld: [orgLd, { "@context": "https://schema.org", "@type": "Service", name: "Concrete driveway replacement", provider: { "@id": BRAND.entityId }, areaServed: CITIES.map(city => `${city.name}, CA`) }],
  extraStyles: `<link rel="stylesheet" href="/css/driveway.css?v=${drivewayCssHash}">`,
  // Ad-platform tag, this page only, and only once a conversion ID is configured.
  extraHead: BRAND.adsConversionId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${BRAND.adsConversionId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config",${JSON.stringify(BRAND.adsConversionId)});window.AZEB_ADS_CONVERSION=${JSON.stringify(BRAND.adsConversionId + "/" + BRAND.adsConversionLabel)};</script>` : "",
}) + drivewayBody({ brand: BRAND, cities: CITIES, phoneIcon: PHONE_SVG, footer: renderFooter(BRAND.drivewayLeadWebhook), wizardScript: `<script defer src="/js/driveway-wizard.js?v=${drivewayScriptHash}"></script>` });
write("driveway-replacement/index.html", drivewayHtml);

/* ---------- sitemap & robots ---------- */

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${BRAND.domain}/</loc></url>
${urls.map((u) => `<url><loc>${BRAND.domain}${u}</loc></url>`).join("\n")}
</urlset>
`;
write("sitemap.xml", sitemap);

// Keep the existing crawler permissions. Access is not a ranking guarantee.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User",
  "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended",
  "Applebot", "Applebot-Extended", "CCBot", "Bingbot", "DuckAssistBot", "cohere-ai", "meta-externalagent"];
// Only the client-facing pitch decks. The privacy policy must stay crawlable —
// it is a legal document, and a robots block would also hide its noindex tag.
const DISALLOW = [];
write("robots.txt",
  `# ${BRAND.name} — ${BRAND.city}, ${BRAND.state}\nUser-agent: *\nAllow: /\n` +
  DISALLOW.map((d) => `Disallow: ${d}`).join("\n") + `\n\n` +
  `# Answer engines / AI assistants — allowed\n` +
  AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /\n` + DISALLOW.map((d) => `Disallow: ${d}`).join("\n")).join("\n\n") +
  `\n\nSitemap: ${BRAND.domain}/sitemap.xml\n`);

// Host cache policy. The sha1 fingerprint on CSS makes immutable safe.
write("_headers",
  `/css/*\n  Cache-Control: public, max-age=31536000, immutable\n\n` +
  `/js/*\n  Cache-Control: public, max-age=31536000, immutable\n\n` +
  `/assets/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n\n` +
  `/assets/*\n  Cache-Control: public, max-age=2592000\n\n` +
  `/*.html\n  Cache-Control: public, max-age=0, must-revalidate\n\n` +
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n`);

// Optional machine-readable summary; Google Search does not use llms.txt for ranking.
const llms = `# ${BRAND.name}

> Family-run, licensed and insured general contractor (CSLB #1106795) based in ${BRAND.city}, California, serving a 60-mile radius across the East Bay, Tri-Valley, Delta, Solano and Napa counties. Founded and run by Alfonso Zavala. Phone ${BRAND.phone} · ${BRAND.email}.

Key facts: free on-site estimates with a written scope; written warranty of up to 5 years on all work; financing available; every trade on the crew has 15+ years of experience in that specific trade; the team speaks English and Spanish (hablamos español). Services include kitchen and bathroom remodeling, whole-home remodels, additions and ADUs, concrete driveways and retaining walls, interior and exterior painting, flooring, drywall, cabinetry and countertops, finish carpentry, steam showers and saunas, and outdoor living. Business hours Monday-Friday 8am-6pm.

## Services

${SERVICES.map((sv) => `- [${sv.name}](${BRAND.domain}/services/${sv.slug}/): ${sv.short}`).join("\n")}

## Service areas

${CITIES.map((c) => `- [${c.name}, CA](${BRAND.domain}/service-areas/${c.slug}/): ${c.county}`).join("\n")}

## Optional

- [All services index](${BRAND.domain}/services/): every service in one list
- [All service areas](${BRAND.domain}/service-areas/): all ${CITIES.length} cities
- [Sitemap](${BRAND.domain}/sitemap.xml): every page on the site
`;
write("llms.txt", llms);

console.log(`Generated ${urls.length + 1} pages (incl. homepage in sitemap):`);
console.log(`  ${CITIES.length * SERVICES.length} service×city pages`);
console.log(`  ${CITIES.length} city hubs`);
console.log(`  ${SERVICES.length} service hubs`);
console.log(`  1 service-areas index + sitemap.xml + robots.txt`);

const homePath = join(ROOT, "index.html");
let home = readFileSync(homePath, "utf8");
home = home.replace(/\/css\/style\.min\.css(?:\?v=[a-f0-9]+)?/g, `/css/style.min.css?v=${ASSET_V}`);
for (const file of ["main.js", "leads.js", "lenis.min.js"]) {
  const hash = createHash("sha1").update(readFileSync(join(ROOT, "js", file))).digest("hex").slice(0, 8);
  home = home.replace(new RegExp(`/js/${file.replaceAll(".", "\\.")}(?:\\?v=[a-f0-9]+)?`, "g"), `/js/${file}?v=${hash}`);
}
home = home.replace(/<script>window\.AZEB_LEAD_ENDPOINT=.*?;<\/script>/, `<script>window.AZEB_LEAD_ENDPOINT=${JSON.stringify(BRAND.leadWebhook || "")};</script>`);
home = home.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(orgLd)}</script>`);
writeFileSync(homePath, home);
