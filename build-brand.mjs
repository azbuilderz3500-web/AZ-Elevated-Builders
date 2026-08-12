#!/usr/bin/env node
// AZ Elevated Builders — brand asset generator.
// Emits every SVG variant + lockup from one geometry definition.
// PNG/ICO rasterisation is handled by build-brand-raster.py (PIL).
// Run: node build-brand.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "assets/brand");

export const PALETTE = {
  navy:  "#18203A",
  cream: "#F5EFE6",
  brass: "#C8A96A",
  ink:   "#0A0C14",
  slate: "#8B93A7",
};

/* ------------------------------------------------------------------
   THE MARK — one geometry, 48×48 box.
   An A-frame roofline (the "A") with a Z locked inside it (Zavala).
   The Z's diagonal is the accent stroke: it is the only part that
   takes brass, so the monogram reads A-Z even at favicon size.
------------------------------------------------------------------ */
export const GEO = {
  box: 48,
  // A-frame: apex, left foot, right foot
  frame: [[6, 39], [24, 8], [42, 39]],
  zTop:  [[16.5, 21], [31.5, 21]],
  zDiag: [[31.5, 21], [16.5, 34]],   // accent
  zBase: [[16.5, 34], [31.5, 34]],
  stroke: 2.6,
};

const pts = (a) => a.map(([x, y]) => `${x} ${y}`).join(" L ");
const poly = (a) => `M ${pts(a)}`;

const markPaths = ({ stroke = GEO.stroke, accent = null, color = "currentColor" } = {}) => `
  <path d="${poly(GEO.frame)}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="square" stroke-linejoin="miter"/>
  <path d="${poly(GEO.zTop)}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="square"/>
  <path d="${poly(GEO.zDiag)}" fill="none" stroke="${accent || color}" stroke-width="${stroke}" stroke-linecap="square"/>
  <path d="${poly(GEO.zBase)}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="square"/>`;

const svg = (body, { w = 48, h = 48, vb = "0 0 48 48" } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}" fill="none" role="img" aria-label="AZ Elevated Builders">
${body}
</svg>\n`;

/* ---------------- Mark variants ---------------- */
const VARIANTS = {
  "mark-mono-cream":  svg(markPaths({ color: PALETTE.cream })),
  "mark-mono-navy":   svg(markPaths({ color: PALETTE.navy })),
  "mark-mono-black":  svg(markPaths({ color: "#000000" })),
  "mark-mono-white":  svg(markPaths({ color: "#FFFFFF" })),
  "mark-accent-dark": svg(markPaths({ color: PALETTE.cream, accent: PALETTE.brass })),
  "mark-accent-light":svg(markPaths({ color: PALETTE.navy,  accent: PALETTE.brass })),

  "badge-square-navy": svg(
    `  <rect width="48" height="48" fill="${PALETTE.navy}"/>` + markPaths({ color: PALETTE.cream, accent: PALETTE.brass })),
  "badge-square-brass": svg(
    `  <rect width="48" height="48" fill="${PALETTE.brass}"/>` + markPaths({ color: PALETTE.navy })),
  "badge-circle-navy": svg(
    `  <circle cx="24" cy="24" r="24" fill="${PALETTE.navy}"/>
  <circle cx="24" cy="24" r="21.5" fill="none" stroke="${PALETTE.brass}" stroke-width="0.9" opacity="0.55"/>` +
    markPaths({ color: PALETTE.cream, accent: PALETTE.brass, stroke: 2.4 })),

  // Solid/knockout — for embroidery, stamps, single-colour print
  "mark-solid-navy": svg(
    `  <path d="${poly(GEO.frame)} Z" fill="${PALETTE.navy}"/>
  <path d="${poly(GEO.zTop)} L 16.5 24 L 27 24 L 16.5 31 L 31.5 31 L 31.5 34 L 12 34 L 12 30 L 22 24 L 12.5 24 Z" fill="${PALETTE.cream}" opacity="0"/>` +
    markPaths({ color: PALETTE.cream, stroke: 2.8 })),
};

/* ---------------- Lockups (text kept as live SVG text; PNG versions
   are rendered with the real font by the raster step) ---------------- */
const wordmark = (fill, x, y, size = 7.4, lead = 8.6) => `
  <text x="${x}" y="${y}" font-family="Inter Tight, Inter, Helvetica, Arial, sans-serif" font-weight="700"
        font-size="${size}" letter-spacing="0.5" fill="${fill}">AZ ELEVATED</text>
  <text x="${x}" y="${y + lead}" font-family="Inter Tight, Inter, Helvetica, Arial, sans-serif" font-weight="700"
        font-size="${size}" letter-spacing="0.5" fill="${fill}">BUILDERS</text>`;

const LOCKUPS = {
  "lockup-horizontal-dark": svg(
    markPaths({ color: PALETTE.cream, accent: PALETTE.brass }) + wordmark(PALETTE.cream, 58, 22),
    { w: 190, h: 48, vb: "0 0 190 48" }),
  "lockup-horizontal-light": svg(
    markPaths({ color: PALETTE.navy, accent: PALETTE.brass }) + wordmark(PALETTE.navy, 58, 22),
    { w: 190, h: 48, vb: "0 0 190 48" }),
  "lockup-stacked-dark": svg(
    `  <g transform="translate(31 0)">${markPaths({ color: PALETTE.cream, accent: PALETTE.brass })}</g>
  <text x="55" y="62" text-anchor="middle" font-family="Inter Tight, Inter, Helvetica, Arial, sans-serif"
        font-weight="700" font-size="9" letter-spacing="1.6" fill="${PALETTE.cream}">AZ ELEVATED</text>
  <text x="55" y="73" text-anchor="middle" font-family="Inter Tight, Inter, Helvetica, Arial, sans-serif"
        font-weight="700" font-size="9" letter-spacing="1.6" fill="${PALETTE.cream}">BUILDERS</text>`,
    { w: 110, h: 82, vb: "0 0 110 82" }),
};

mkdirSync(join(OUT, "svg"), { recursive: true });
let n = 0;
for (const [name, content] of Object.entries({ ...VARIANTS, ...LOCKUPS })) {
  writeFileSync(join(OUT, "svg", `azeb-${name}.svg`), content);
  n++;
}

// Favicon SVG (navy tile so it reads on any browser chrome)
writeFileSync(join(OUT, "svg", "favicon.svg"), VARIANTS["badge-square-navy"]);
n++;

console.log(`brand: ${n} SVG files -> assets/brand/svg/`);
