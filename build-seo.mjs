#!/usr/bin/env node
// AZ Elevated Builders — local SEO page generator
// Generates: /services/<service>/  /service-areas/  /service-areas/<city>/
//            /service-areas/<city>/<service>/  sitemap.xml  robots.txt
// Run: node build-seo.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { drivewayBody } from "./build-driveway.mjs";
import { BRAND, CITIES, SERVICES, OPENERS, SERVICE_LOCAL, WHY_VARIANTS, SERVICE_IMAGES, PROFILE_NOTES, PHOTO_ALT, CITY_PHOTOS } from "./data/site-data.mjs";

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

// gtag.js loads once and carries whichever properties this page reports to:
// GA4 everywhere, plus the Google Ads account on the paid landing page. The
// conversion destination is only declared once a label exists, so nothing fires
// half-formed before then.
const analyticsTag = (ads = false) => {
  if (!BRAND.gaMeasurementId && !(ads && BRAND.adsConversionId)) return "";
  const loaderId = BRAND.gaMeasurementId || BRAND.adsConversionId;
  const configs = [];
  if (BRAND.gaMeasurementId) configs.push(`gtag("config",${JSON.stringify(BRAND.gaMeasurementId)});`);
  if (ads && BRAND.adsConversionId) configs.push(`gtag("config",${JSON.stringify(BRAND.adsConversionId)});`);
  if (ads && BRAND.adsConversionId && BRAND.adsConversionLabel) {
    configs.push(`window.AZEB_ADS_CONVERSION=${JSON.stringify(BRAND.adsConversionId + "/" + BRAND.adsConversionLabel)};`);
  }
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${loaderId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());${configs.join("")}</script>`;
};

const head = ({ title, desc, path, jsonld, image, robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1", extraStyles = "", extraHead = "", ads = false }) => `<!DOCTYPE html>
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
<meta property="og:image" content="${shareImage(image)}" />` : ""}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(desc)}" />${image ? `
<meta name="twitter:image" content="${shareImage(image)}" />` : ""}
<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/InterTight-var.woff2" />
<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/Inter-var.woff2" />${image && image.includes("images.unsplash.com") ? `
<link rel="preconnect" href="https://images.unsplash.com" crossorigin />` : ""}
<link rel="stylesheet" href="/css/style.min.css?v=${ASSET_V}" />
${extraStyles}
${extraHead}
${analyticsTag(ads)}
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
// Share previews need an absolute URL, and JPEG reaches every platform
// (several link unfurlers still drop WebP). A shared link has no room for the
// on-page "Illustration" note, so pages whose banner is an AI illustration
// share the real yard-sign photo instead (TEMPORARY: swap with the homepage hero once the sign is reprinted with LIC 1106795).
const SHARE_FALLBACK = "/assets/projects/yard-sign__home-front-1200.jpg";
const shareImage = (url) => {
  const u = url.includes("/concept__") ? SHARE_FALLBACK : url;
  return u.startsWith("/assets/projects/") ? BRAND.domain + u.replace(/\.webp$/, ".jpg") : u;
};
// Service-page banner. AI illustrations (concept__ files, used only where AZ has
// no job photo yet) carry a visible note and an "Illustration:" alt, so nobody
// reads them as a specific AZ project.
const isIllustration = (url) => url.includes("/concept__");
const banner = (url, alt, note = PHOTO_NOTE[url] || "") => {
  const ill = isIllustration(url);
  const a = ill && !/^Illustration/i.test(alt) ? `Illustration: ${alt}` : alt;
  const caption = ill ? "Illustration of this kind of project, not a photo of a specific AZ job." : note;
  return `<div class="page-img"><img src="${url}" srcset="${srcsetFor(url)}" sizes="${SIZES}" width="1600" height="900" alt="${esc(a)}" fetchpriority="high" decoding="async" /></div>${caption ? `
  <p class="page-img__note">${esc(caption)}</p>` : ""}`;
};
// A real photo that needs a word of context wherever it appears.
const PHOTO_NOTE = {
  "/assets/projects/walnut-creek-backyard__first-section-wide-1200.webp": "Our Walnut Creek backyard slab, in progress: the first section is poured.",
};
// City hubs where AZ has a photographed job lead with that job.
const CITY_JOBS = {
  oakland: { img: "/assets/projects/oakland-kitchen-bath__kitchen-table-wide-1200.webp", note: "Our kitchen and bath remodel in Oakland." },
  "walnut-creek": { img: "/assets/projects/walnut-creek-backyard__first-section-wide-1200.webp", note: "Our Walnut Creek backyard slab, in progress: the first section is poured." },
  lafayette: { img: "/assets/projects/lafayette-primary-bath__vanity-run-wide-1200.webp", note: "Our primary bathroom remodel in Lafayette." },
};
// Services where the site, slope and weather change the plan; interior jobs skip that paragraph.
const EXTERIOR = new Set(["concrete-driveways", "painting", "pergolas-outdoor-living", "additions-adus", "whole-home-remodeling"]);
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

// The estimate form's fields, shared by the homepage pop-up and every landing
// page so the two can't drift apart. Every field is required: Alfonso calls back
// knowing the job, the place and the timing instead of starting from a name.
// Service and city pages arrive with what the page already knows filled in.
// `azeb_check` is a honeypot: hidden from people and screen readers, named so
// browser autofill leaves it alone, and anything typed into it marks a bot.
// Labels sit beside their controls (for/id) rather than wrapping them, so the
// error text leads.js adds after a control is not read as part of its name.
const PROJECT_TYPES = [...SERVICES.map((s) => s.name), "Something else"];
const TIMELINES = ["As soon as possible", "Within 1–3 months", "In 3–6 months", "Just planning for now"];
const field = (id, label, control, wide = false) =>
  `<div class="lead-field${wide ? " lead-field--wide" : ""}"><label for="${id}">${label}</label>${control}</div>`;
const estimateFields = ({ service = "", city = "" } = {}) => `<p class="lead-required">All fields are required.</p>
    <div class="lead-grid">
      ${field("lead-name", "Your name", `<input id="lead-name" type="text" name="name" maxlength="100" placeholder="First and last name" required autocomplete="name">`)}
      ${field("lead-phone", "Phone number", `<input id="lead-phone" type="tel" name="phone" maxlength="25" placeholder="(925) 555-0123" required autocomplete="tel" inputmode="tel">`)}
      ${field("lead-email", "Email", `<input id="lead-email" type="email" name="email" maxlength="150" placeholder="you@example.com" required autocomplete="email" inputmode="email">`)}
      ${field("lead-city", "Project city", `<input id="lead-city" type="text" name="city" list="lead-cities" maxlength="100" placeholder="Start typing your city" required autocomplete="address-level2"${city ? ` value="${esc(city)}"` : ""}>`)}
      ${field("lead-service", "Type of project", `<select id="lead-service" name="service" required><option value=""${service ? "" : " selected"}>Choose one</option>${PROJECT_TYPES.map((p) => `<option${p === service ? " selected" : ""}>${esc(p)}</option>`).join("")}</select>`)}
      ${field("lead-timeline", "When would you like to start?", `<select id="lead-timeline" name="timeline" required><option value="" selected>Choose one</option>${TIMELINES.map((t) => `<option>${esc(t)}</option>`).join("")}</select>`)}
      ${field("lead-details", "Tell us about the project", `<textarea id="lead-details" name="details" rows="4" minlength="20" maxlength="2000" required aria-describedby="lead-details-hint" placeholder="Which rooms or areas, the rough size, and what you'd like changed."></textarea><span class="lead-hint" id="lead-details-hint">A sentence or two (at least 20 characters). Please leave out links.</span>`, true)}
    </div>
    <datalist id="lead-cities">${CITIES.map((c) => `<option value="${esc(c.name)}"></option>`).join("")}</datalist>
    <div class="lead-hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="azeb_check" tabindex="-1" autocomplete="off"></label></div>`;

// Inline lead form — the SEO pages are landing pages, so the form lives on the page
const leadForm = ({ service, city } = {}) => `
<section class="leadform" id="estimate">
  <h2>Get a free estimate</h2>
  <p>Tell us about the project and we'll call you back within one business day. Hablamos español.</p>
  <form class="leadform__form" data-lead data-source="website-service" method="post">
    ${estimateFields({ service, city })}
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
    <button class="nav__menu" id="menuBtn" type="button" aria-controls="menu" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button>
    <a class="nav__cta-desk" href="tel:${BRAND.phoneHref}" data-cta="nav-cta">${PHONE_SVG} ${esc(BRAND.phone)}</a>
  </div>
</header>
<div class="menu" id="menu" aria-hidden="true" inert>
  <div class="menu__inner">
    <nav class="menu__links" aria-label="Menu">
      <a href="/">Home</a>
      <a href="/#work">Our work</a>
      <a href="/services/">Services</a>
      <a href="/service-areas/">Service areas</a>
      <a href="#estimate">Free estimate</a>
      <a href="/#contact">Contact</a>
    </nav>
    <div class="menu__meta">
      <div class="menu__meta-block">
        <span class="label">Contact</span>
        <a href="tel:${BRAND.phoneHref}" data-cta="menu-call">${esc(BRAND.phone)}</a>
        <a href="mailto:${BRAND.email}">${esc(BRAND.email)}</a>
      </div>
      <div class="menu__meta-block">
        <span class="label">Company</span>
        <p>${esc(BRAND.city)}, California<br>${esc(BRAND.license)}<br>Hablamos español</p>
      </div>
    </div>
  </div>
</div>`;

const trustStrip = `
<div class="trust-strip">
  <span class="stars" aria-hidden="true">★★★★★</span><span>5.0 from 6 Google reviews</span>
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

// Separators are their own elements, so a wrapped footer line never ends on a dot.
const SEP = ' <span class="sep" aria-hidden="true">·</span> ';
const renderFooter = (leadEndpoint = BRAND.leadWebhook) => `
<div class="page-footer-pad"></div>
<footer class="simple-footer">
  <span><span>© 2026 ${BRAND.name}</span>${SEP}<span>${BRAND.city}, ${BRAND.state}</span>${SEP}<span>${BRAND.license}</span></span>
  <span><a href="tel:${BRAND.phoneHref}">${BRAND.phone}</a>${SEP}<a class="foot-email" href="mailto:${BRAND.email}">${BRAND.email}</a>${SEP}<a href="/services/">Services</a>${SEP}<a href="/service-areas/">Service Areas</a>${SEP}<a href="/privacy.html">Privacy</a>${SEP}<a href="/">Home</a></span>
  <span class="foot__credit">Website by <a href="https://tothemaxmedia.com" target="_blank" rel="nofollow noopener">To The Max Media</a></span>
</footer>
<script>window.AZEB_LEAD_ENDPOINT=${JSON.stringify(leadEndpoint || "")};</script>
<script defer src="/js/leads.js?v=${createHash("sha1").update(readFileSync(join(ROOT, "js/leads.js"))).digest("hex").slice(0, 8)}"></script>
<script defer src="/js/nav.js?v=${createHash("sha1").update(readFileSync(join(ROOT, "js/nav.js"))).digest("hex").slice(0, 8)}"></script>
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

// Uppercase headings would show "ADUs" as "ADUS". In visible text only (not tags, attributes,
// scripts, JSON-LD, <title>, <option> or <textarea>), the plural s gets its own lowercase span.
const keepPluralS = (html) => html.replace(/<(script|style|title|option|textarea)\b[\s\S]*?<\/\1>|<[^>]*>|\bADUs\b/g, (m) => (m === "ADUs" ? 'ADU<span class="lc">s</span>' : m));
const write = (relPath, html) => {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, (relPath.endsWith(".html") ? keepPluralS(html) : html).replace(/[ \t]+$/gm, ""));
  return relPath;
};

const urls = [];

/* ---------- service × city pages ---------- */

CITIES.forEach((city, ci) => {
  SERVICES.forEach((svc, si) => {
    const path = `/service-areas/${city.slug}/${svc.slug}/`;
    const title = `${svc.name} in ${city.name}, CA | ${BRAND.name}`;
    // Phone number early: Google cuts descriptions at about 155 characters.
    const desc = `${svc.name} in ${city.name}, CA. Free estimates: ${BRAND.phone}. Family-run, licensed, based in Brentwood. Warranty up to 5 years.`;
    const lens = SERVICE_LOCAL[svc.slug];
    const profileNote = PROFILE_NOTES[svc.slug][city.profile];
    // rotate the hero photo so adjacent city pages don't share an image
    const imgSet = SERVICE_IMAGES[svc.slug] || [svc.img];
    const img = CITY_PHOTOS[city.slug]?.[svc.slug] || imgSet[ci % imgSet.length];
    const isHome = city.slug === "brentwood";
    const opener = isHome
      ? `${svc.short} We're based right here in Brentwood, so a free on-site estimate is easy to arrange.`
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
    <p class="answer-box__q">Who offers ${esc(svc.phrase)} in ${esc(city.name)}, CA?</p>
    <p class="answer-box__a"><strong>${esc(BRAND.name)}</strong> provides ${esc(svc.phrase)} in ${esc(city.name)}, California. We are a family-run, licensed and bonded general contractor ${isHome
      ? `based in ${esc(city.name)}, serving the surrounding ${esc(city.county)} area`
      : `based in ${esc(BRAND.city)}, serving ${esc(city.name)} and the surrounding ${esc(city.county)} area`}. Estimates are free, most of our crew have more than 15 years in their trade, and all work carries a written warranty of up to five years. We speak English and Spanish. Call <a href="tel:${BRAND.phoneHref}" data-cta="answer-call">${esc(BRAND.phone)}</a>.</p>
  </div>
  ${trustStrip}
  ${banner(img, PHOTO_ALT[img] || svc.imgAlt)}
  <div class="prose">
    ${svc.body.map((p) => `<p>${esc(p)}</p>`).join("\n    ")}

    <h2>Planning your project in ${esc(city.name)}</h2>
    <p>The local housing includes ${esc(city.era)}. ${esc(profileNote)}</p>
    <p>We serve ${esc(city.name)}, including ${esc(listPhrase(city.hoods))}.${city.adjacent ? ` We also cover neighboring ${esc(listPhrase(city.adjacent))}. ${city.adjacent.length === 1 ? "This unincorporated area handles" : "These unincorporated areas handle"} permits through ${esc(city.county)}.` : ""}${EXTERIOR.has(svc.slug) ? `${!city.terrainFor || city.terrainFor.includes(svc.slug) ? ` Project planning here accounts for ${esc(city.terrain)}.` : ""} ${esc(lens.terrain)}` : ""}</p>

    <h2>${esc(lens.permitHeading || "Permits and inspections")} in ${esc(city.name)}</h2>
    <p>Permits for work in ${esc(city.name)} go through ${esc(city.permit)}. ${esc(lens.permit)}${(lens.permitClose ?? "We handle the permit application and coordinate inspections.") ? " " + esc(lens.permitClose ?? "We handle the permit application and coordinate inspections.") : ""}</p>

    <h2>What's included</h2>
    <ul>
      ${svc.features.map((f) => `<li>${esc(f)}</li>`).join("\n      ")}
    </ul>

    <h2>What to expect</h2>
    <p>${esc(WHY_VARIANTS[(ci * 7 + si * 3) % WHY_VARIANTS.length](city))} Hablamos español.</p>
  </div>
  <div class="prose"><h2>Frequently asked questions</h2></div>
  <div class="faq">
    ${svc.faqs.map((f) => `<details><summary><span>${esc(f.q.replaceAll("{CITY}", city.name))}</span></summary><p>${esc(f.a.replaceAll("{CITY}", city.name))}</p></details>`).join("\n    ")}
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
  ${leadForm({ service: svc.name, city: city.name })}
  ${ctaBand(`Tell us about your ${svc.project} project in ${city.name}.`)}
</main>` + actionBar + footer;

    urls.push(path);
    write(`service-areas/${city.slug}/${svc.slug}/index.html`, html);
  });

  /* ---------- city hub ---------- */
  const cityPath = `/service-areas/${city.slug}/`;
  const cityTitle = `Home Remodeling & Construction in ${city.name}, CA | ${BRAND.name}`;
  const cityDesc = `Remodeling and construction in ${city.name}, CA: kitchens, baths, ADUs, driveways and more. Family-run, licensed, based in Brentwood. Free estimates.`;
  // Cities where AZ has a photographed job lead with it; the rest share the yard-sign photo.
  const ownJob = CITY_JOBS[city.slug];
  const cityHtml = head({
    title: cityTitle, desc: cityDesc, path: cityPath, image: ownJob ? ownJob.img : SHARE_FALLBACK,
    jsonld: [orgLd, breadcrumbLd([{ label: "Home", href: "/" }, { label: "Service Areas", href: "/service-areas/" }, { label: city.name }])],
  }) + nav + `
<main class="page" id="main" tabindex="-1">
  ${crumbs([{ label: "Home", href: "/" }, { label: "Service Areas", href: "/service-areas/" }, { label: city.name }])}
  <div class="page-hero">
    <h1>Remodeling &amp; Construction<br><em>in ${esc(city.name)}, CA</em></h1>
    <p class="lede">${esc(city.blurb)} Our family-run team handles individual rooms and whole-home projects, and most of our crew have more than 15 years in their trade.</p>
  </div>
  ${trustStrip}
  ${ownJob ? banner(ownJob.img, PHOTO_ALT[ownJob.img] || ownJob.note, ownJob.note) : ""}
  <div class="prose"><h2>Our services in ${esc(city.name)}</h2></div>
  <div class="city-grid">
    ${SERVICES.map((s) => `<a href="/service-areas/${city.slug}/${s.slug}/"><span><span class="name">${esc(s.name)}</span><span class="card-note">${esc(s.card)}</span></span><span class="arrow">↗</span></a>`).join("\n    ")}
  </div>
  ${leadForm({ city: city.name })}
  ${ctaBand(`Planning a project in ${city.name}?`)}
</main>` + actionBar + footer;

  urls.push(cityPath);
  write(`service-areas/${city.slug}/index.html`, cityHtml);
});

/* ---------- service hubs ---------- */

SERVICES.forEach((svc) => {
  const path = `/services/${svc.slug}/`;
  const title = `${svc.name} — East Bay & Beyond | ${BRAND.name}`;
  const desc = `${svc.short} Based in Brentwood. Free estimates: ${BRAND.phone}.`;
  const html = head({
    title, desc, path, image: svc.img,
    jsonld: [orgLd, breadcrumbLd([{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: svc.name }])],
  }) + nav + `
<main class="page" id="main" tabindex="-1">
  ${crumbs([{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: svc.name }])}
  <div class="page-hero">
    <h1>${esc(svc.name)}<br><em>in the East Bay</em></h1>
    <p class="lede">${esc(svc.short)} Based in Brentwood and serving a 60-mile radius across Contra Costa, Alameda, San Joaquin, Solano and Napa counties.</p>
  </div>
  ${trustStrip}
  ${banner(svc.img, PHOTO_ALT[svc.img] || svc.imgAlt)}
  <div class="prose">
    ${svc.body.map((p) => `<p>${esc(p)}</p>`).join("\n    ")}
    <h2>What's included</h2>
    <ul>
      ${svc.features.map((f) => `<li>${esc(f)}</li>`).join("\n      ")}
    </ul>
    <h2>Where we offer ${esc(svc.phrase)}</h2>
    <div class="chip-grid">
      ${CITIES.map((c) => `<a class="chip" href="/service-areas/${c.slug}/${svc.slug}/">${esc(c.name)}</a>`).join("\n      ")}
    </div>
  </div>
  <section aria-labelledby="service-faq"><div class="prose"><h2 id="service-faq">Frequently asked questions</h2></div><div class="faq">
    ${svc.faqs.map((f) => `<details><summary><span>${esc(f.q.replaceAll("{CITY}", "the East Bay"))}</span></summary><p>${esc(f.a.replaceAll("{CITY}", "the East Bay"))}</p></details>`).join("\n    ")}
  </div></section>
  ${svc.slug === "concrete-driveways" ? `<div class="prose"><h2>Replacing an existing driveway?</h2><p><a href="/driveway-replacement/">Request a driveway replacement estimate</a> with our short four-step form.</p></div>` : ""}
  ${leadForm({ service: svc.name })}
  ${ctaBand(`Tell us about your ${svc.project} project.`)}
</main>` + actionBar + footer;

  urls.push(path);
  write(`services/${svc.slug}/index.html`, html);
});

/* ---------- service areas index ---------- */

const counties = [...new Set(CITIES.map((c) => c.county))];
const areasHtml = head({
  title: `Service Areas — East Bay, Tri-Valley, Delta & North Bay | ${BRAND.name}`,
  desc: `${BRAND.name} serves 40 cities within 60 miles of Brentwood, CA, across Contra Costa, Alameda, San Joaquin, Solano and Napa counties. Free estimates.`,
  path: "/service-areas/", image: SHARE_FALLBACK,
  jsonld: [orgLd, breadcrumbLd([{ label: "Home", href: "/" }, { label: "Service Areas" }])],
}) + nav + `
<main class="page" id="main" tabindex="-1">
  ${crumbs([{ label: "Home", href: "/" }, { label: "Service Areas" }])}
  <div class="page-hero">
    <h1>Service<br><em>Areas</em></h1>
    <p class="lede">Based in Brentwood, we serve a 60-mile radius across the East Bay, Tri-Valley, the Delta, wine country and over the Altamont.</p>
  </div>
  ${trustStrip}
  ${counties.map((county) => `
  <div class="prose"><h2>${esc(county)}</h2></div>
  <div class="city-grid city-grid--names">
    ${CITIES.filter((c) => c.county === county).map((c) => `<a href="/service-areas/${c.slug}/"><span><span class="name">${esc(c.name)}</span></span><span class="arrow">↗</span></a>`).join("\n    ")}
  </div>`).join("\n")}
  ${leadForm()}
  ${ctaBand("Don't see your city? If it's within an hour of Brentwood, call us anyway.")}
</main>` + actionBar + footer;

urls.push("/service-areas/");
write("service-areas/index.html", areasHtml);

/* ---------- services index (was a 404) ---------- */

const servicesHtml = head({
  title: `Remodeling & Construction Services — East Bay | ${BRAND.name}`,
  desc: `Kitchen and bath remodeling, whole-home remodels, ADUs, driveways, painting, flooring and more from ${BRAND.name}. Free estimates: ${BRAND.phone}.`,
  path: "/services/", image: SHARE_FALLBACK,
  jsonld: [orgLd, breadcrumbLd([{ label: "Home", href: "/" }, { label: "Services" }])],
}) + nav + `
<main class="page" id="main" tabindex="-1">
  ${crumbs([{ label: "Home", href: "/" }, { label: "Services" }])}
  <div class="page-hero">
    <h1>Our<br><em>Services</em></h1>
    <p class="lede">Our family-run team provides interior and exterior remodeling from ${esc(BRAND.city)}, California, and most of our crew have more than 15 years in their trade. Estimates are free, and our work carries a written warranty of up to five years.</p>
  </div>
  ${trustStrip}
  <div class="city-grid">
    ${SERVICES.map((s) => `<a href="/services/${s.slug}/"><span><span class="name">${esc(s.name)}</span><span class="card-note">${esc(s.card)}</span></span><span class="arrow">↗</span></a>`).join("\n    ")}
  </div>
  ${leadForm()}
  ${ctaBand("Not sure which service you need? Describe the project and we'll tell you.")}
</main>` + actionBar + footer;

urls.push("/services/");
write("services/index.html", servicesHtml);

/* ---------- custom 404: Netlify serves /404.html for any unmatched path ---------- */
// Kept out of `urls`, so it is not in the sitemap or llms.txt.
const notFoundHtml = head({
  title: `Page not found | ${BRAND.name}`,
  desc: `That page isn't on the ${BRAND.name} site. Browse our services and service areas, or call ${BRAND.phone}.`,
  path: "/404.html", robots: "noindex, follow", image: SHARE_FALLBACK,
  jsonld: [orgLd],
}) + nav + `
<main class="page" id="main" tabindex="-1">
  <div class="page-hero">
    <h1>That page<br><em>isn't here.</em></h1>
    <p class="lede">The link may be old or mistyped. Everything we do is one tap away below, or call us at <a href="tel:${BRAND.phoneHref}" data-cta="404-call">${esc(BRAND.phone)}</a>.</p>
  </div>
  <div class="city-grid">
    <a href="/"><span><span class="name">Home</span><span class="card-note">Our recent projects and how we work</span></span><span class="arrow">↗</span></a>
    <a href="/services/"><span><span class="name">Services</span><span class="card-note">Kitchens, baths, ADUs, concrete and more</span></span><span class="arrow">↗</span></a>
    <a href="/service-areas/"><span><span class="name">Service areas</span><span class="card-note">40 cities within 60 miles of Brentwood</span></span><span class="arrow">↗</span></a>
  </div>
  ${leadForm()}
</main>` + actionBar + footer;
write("404.html", notFoundHtml);

/* ---------- focused Google Ads destination ---------- */
const drivewayCssHash = createHash("sha1").update(readFileSync(join(ROOT, "css/driveway.css"))).digest("hex").slice(0, 8);
const drivewayScriptHash = createHash("sha1").update(readFileSync(join(ROOT, "js/driveway-wizard.js"))).digest("hex").slice(0, 8);
const drivewayHtml = head({
  title: "Concrete Driveway Replacement | AZ Elevated Builders",
  desc: `Concrete driveway replacement across the East Bay, Tri-Valley, Delta, Solano and Napa areas. Serving ${CITIES.length} communities. Request a free on-site estimate.`,
  path: "/driveway-replacement/",
  robots: "noindex, follow",
  image: BRAND.domain + "/assets/projects/stamped-driveway__pattern-wide-1200.jpg",
  jsonld: [orgLd, { "@context": "https://schema.org", "@type": "Service", name: "Concrete driveway replacement", provider: { "@id": BRAND.entityId }, areaServed: CITIES.map(city => `${city.name}, CA`) }],
  extraStyles: `<link rel="stylesheet" href="/css/driveway.css?v=${drivewayCssHash}">`,
  ads: true,
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

> Family-owned, licensed and bonded general contractor (CSLB #1106795) based in ${BRAND.city}, California, serving a 60-mile radius across the East Bay, Tri-Valley, Delta, Solano and Napa counties. Founded and run by Alfonso Zavala. Phone ${BRAND.phone} · ${BRAND.email}.

Key facts: free on-site estimates with a written scope; written warranty of up to 5 years on all work; financing available; most of the crew have more than 15 years of experience in their trade; the team speaks English and Spanish (hablamos español). Services include kitchen and bathroom remodeling, whole-home remodels, additions and ADUs, concrete driveways and retaining walls, interior and exterior painting, flooring, drywall, cabinetry and countertops, finish carpentry, steam showers and saunas, and outdoor living. Business hours Monday-Friday 8am-6pm.

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
for (const file of ["main.js", "leads.js", "lenis.min.js", "morph.js", "scroll-scrub.js"]) {
  const hash = createHash("sha1").update(readFileSync(join(ROOT, "js", file))).digest("hex").slice(0, 8);
  home = home.replace(new RegExp(`/js/${file.replaceAll(".", "\\.")}(?:\\?v=[a-f0-9]+)?`, "g"), `/js/${file}?v=${hash}`);
}
// The pop-up form on the homepage uses the same fields as every landing page.
home = home.replace(/<!-- lead-fields -->[\s\S]*?<!-- \/lead-fields -->/, `<!-- lead-fields -->\n    ${estimateFields()}\n    <!-- /lead-fields -->`);
home = home.replace(/<script>window\.AZEB_LEAD_ENDPOINT=.*?;<\/script>/, `<script>window.AZEB_LEAD_ENDPOINT=${JSON.stringify(BRAND.leadWebhook || "")};</script>`);
home = home.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(orgLd)}</script>`);
writeFileSync(homePath, keepPluralS(home));
