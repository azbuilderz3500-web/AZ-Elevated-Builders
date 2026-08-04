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

/* ---------- shared partials ---------- */

const head = ({ title, desc, path, jsonld }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${BRAND.domain}${path}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/css/style.css" />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛰</text></svg>" />
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body class="seo-page">`;

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
    <a class="nav__menu-btn" style="display:grid;place-items:center;text-decoration:none" href="tel:${BRAND.phoneHref}" aria-label="Call us">✆</a>
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
  <span><a href="tel:${BRAND.phoneHref}">${BRAND.phone}</a> · <a href="mailto:${BRAND.email}">${BRAND.email}</a> · <a href="/service-areas/">Service Areas</a> · <a href="/">Home</a></span>
</footer>
</body>
</html>`;

const crumbs = (items) =>
  `<nav class="crumbs" aria-label="Breadcrumb">` +
  items.map((i, n) => (i.href ? `<a href="${i.href}">${esc(i.label)}</a>` : `<span>${esc(i.label)}</span>`))
       .join(`<span class="sep">/</span>`) +
  `</nav>`;

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
    const opener = OPENERS[(ci + si) % OPENERS.length](svc, city);
    const otherSvcs = SERVICES.filter((s) => s.slug !== svc.slug);
    const nearby = CITIES.filter((c) => c.county === city.county && c.slug !== city.slug).slice(0, 6);

    const jsonld = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `${svc.name} in ${city.name}, CA`,
        serviceType: svc.name,
        areaServed: { "@type": "City", name: `${city.name}`, address: { "@type": "PostalAddress", addressRegion: "CA" } },
        provider: {
          "@type": "GeneralContractor", name: BRAND.name, telephone: BRAND.phone, email: BRAND.email,
          address: { "@type": "PostalAddress", addressLocality: BRAND.city, addressRegion: BRAND.state, addressCountry: "US" },
        },
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
  ${ctaBand(`Tell us about your ${svc.name.toLowerCase()} project in ${city.name}.`)}
</main>` + footer;

    urls.push(path);
    write(`service-areas/${city.slug}/${svc.slug}/index.html`, html);
  });

  /* ---------- city hub ---------- */
  const cityPath = `/service-areas/${city.slug}/`;
  const cityTitle = `Home Remodeling & Construction in ${city.name}, CA | ${BRAND.name}`;
  const cityDesc = `General contractor serving ${city.name}, CA — kitchen & bathroom remodels, whole-home remodeling, ADUs, concrete driveways, painting, flooring and more. Family-run, CA-licensed, free estimates.`;
  const cityHtml = head({
    title: cityTitle, desc: cityDesc, path: cityPath,
    jsonld: [breadcrumbLd([{ label: "Home", href: "/" }, { label: "Service Areas", href: "/service-areas/" }, { label: city.name }])],
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
  ${ctaBand(`Planning a project in ${city.name}?`)}
</main>` + footer;

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
    jsonld: [breadcrumbLd([{ label: "Home", href: "/" }, { label: "Services", href: "/#services" }, { label: svc.name }])],
  }) + nav + `
<main class="page">
  ${crumbs([{ label: "Home", href: "/" }, { label: "Services", href: "/#services" }, { label: svc.name }])}
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
  ${ctaBand(`Tell us about your ${svc.name.toLowerCase()} project.`)}
</main>` + footer;

  urls.push(path);
  write(`services/${svc.slug}/index.html`, html);
});

/* ---------- service areas index ---------- */

const counties = [...new Set(CITIES.map((c) => c.county))];
const areasHtml = head({
  title: `Service Areas — East Bay, Tri-Valley, Delta & North Bay | ${BRAND.name}`,
  desc: `${BRAND.name} serves 40 cities within 60 miles of Brentwood, CA — across Contra Costa, Alameda, San Joaquin, Solano and Napa counties. Find remodeling and construction services in your city.`,
  path: "/service-areas/",
  jsonld: [breadcrumbLd([{ label: "Home", href: "/" }, { label: "Service Areas" }])],
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
  ${ctaBand("Don't see your city? If it's within an hour of Brentwood, call us anyway.")}
</main>` + footer;

urls.push("/service-areas/");
write("service-areas/index.html", areasHtml);

/* ---------- sitemap & robots ---------- */

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${BRAND.domain}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
${urls.map((u) => `<url><loc>${BRAND.domain}${u}</loc><lastmod>${today}</lastmod><priority>${u.split("/").filter(Boolean).length >= 3 ? "0.7" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`;
write("sitemap.xml", sitemap);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${BRAND.domain}/sitemap.xml\n`);

console.log(`Generated ${urls.length + 1} pages (incl. homepage in sitemap):`);
console.log(`  ${CITIES.length * SERVICES.length} service×city pages`);
console.log(`  ${CITIES.length} city hubs`);
console.log(`  ${SERVICES.length} service hubs`);
console.log(`  1 service-areas index + sitemap.xml + robots.txt`);
