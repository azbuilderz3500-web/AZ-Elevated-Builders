#!/usr/bin/env python3
"""AZ Elevated Builders — raster brand exports.

SUPERSEDED (Sep 2026): the approved final identity ships as vectors in
assets/brand/final/. This script still draws the earlier navy/cream/brass
geometry and would overwrite assets/brand/ with superseded artwork.
Port the final geometry before running it again.

Draws the mark from the same geometry as build-brand.mjs, supersampled 4x and
downsampled, so every PNG is crisp at its own size rather than a blurry
resize of one master. Emits web PNGs, print-resolution PNGs (300dpi), app
icons and a multi-resolution .ico.

Run: python3 build-brand-raster.py
"""
from PIL import Image, ImageDraw, ImageFont
import os, math

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(ROOT, "assets", "brand")
FONTS = os.path.join(OUT, "fonts")

NAVY  = (24, 32, 58)
CREAM = (245, 239, 230)
BRASS = (200, 169, 106)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

BOX = 48.0
FRAME = [(6, 39), (24, 8), (42, 39)]
Z_TOP  = [(16.5, 21), (31.5, 21)]
Z_DIAG = [(31.5, 21), (16.5, 34)]
Z_BASE = [(16.5, 34), (31.5, 34)]
STROKE = 2.6

SS = 4  # supersample factor


def draw_mark(size, color, accent=None, bg=None, shape=None, ring=None, pad=0.0):
    """Render the mark at `size` px. pad = fraction of size to inset the art."""
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    if bg is not None:
        if shape == "circle":
            d.ellipse([0, 0, s - 1, s - 1], fill=bg)
        else:
            d.rectangle([0, 0, s, s], fill=bg)
    if ring is not None:
        inset = s * 0.055
        d.ellipse([inset, inset, s - inset, s - inset], outline=ring,
                  width=max(1, int(s * 0.012)))

    art = s * (1 - 2 * pad)
    off = s * pad
    k = art / BOX
    w = max(1, int(round(STROKE * k)))

    def line(p, col):
        d.line([(off + x * k, off + y * k) for x, y in p], fill=col, width=w, joint="curve")

    line(FRAME, color)
    line(Z_TOP, color)
    line(Z_DIAG, accent or color)
    line(Z_BASE, color)

    return img.resize((size, size), Image.LANCZOS)


def save(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG", optimize=True)


VARIANTS = {
    # name: (color, accent, bg, shape, ring, pad)
    "mark-cream-transparent": (CREAM, BRASS, None, None, None, 0.0),
    "mark-navy-transparent":  (NAVY,  BRASS, None, None, None, 0.0),
    "mark-black-transparent": (BLACK, None,  None, None, None, 0.0),
    "mark-white-transparent": (WHITE, None,  None, None, None, 0.0),
    "badge-square-navy":      (CREAM, BRASS, NAVY, "square", None, 0.16),
    "badge-square-brass":     (NAVY,  None,  BRASS,"square", None, 0.16),
    "badge-circle-navy":      (CREAM, BRASS, NAVY, "circle", BRASS, 0.20),
}

WEB_SIZES   = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512, 1024]
PRINT_SIZES = [1200, 2400, 4096]   # 4in/8in/13.6in at 300dpi

count = 0
for name, (color, accent, bg, shape, ring, pad) in VARIANTS.items():
    for sz in WEB_SIZES:
        save(draw_mark(sz, color, accent, bg, shape, ring, pad),
             os.path.join(OUT, "png", "web", f"azeb-{name}-{sz}.png"))
        count += 1
    for sz in PRINT_SIZES:
        img = draw_mark(sz, color, accent, bg, shape, ring, pad)
        p = os.path.join(OUT, "png", "print", f"azeb-{name}-{sz}px-300dpi.png")
        os.makedirs(os.path.dirname(p), exist_ok=True)
        img.save(p, "PNG", optimize=True, dpi=(300, 300))
        count += 1

# ---- favicon.ico (multi-resolution) ----
ico = draw_mark(256, CREAM, BRASS, NAVY, "square", None, 0.16)
ico_path = os.path.join(OUT, "favicon.ico")
ico.save(ico_path, sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
count += 1

# ---- Lockups rendered with the real brand font ----
def font(weight, px):
    f = os.path.join(FONTS, f"InterTight-{weight}.ttf")
    return ImageFont.truetype(f, px) if os.path.exists(f) else ImageFont.load_default()


def lockup_horizontal(height, color, accent, bg, path):
    h = height * SS
    mark = draw_mark(int(h), color, accent, None, None, None, 0.0).resize((h, h), Image.LANCZOS)
    fs = int(h * 0.245)
    fnt = font(700, fs)
    lines = ["AZ ELEVATED", "BUILDERS"]
    tw = max(ImageDraw.Draw(Image.new("RGB", (1, 1))).textlength(t, font=fnt) for t in lines)
    gap = int(h * 0.22)
    W = int(h + gap + tw + h * 0.08)
    img = Image.new("RGBA", (W, h), bg if bg else (0, 0, 0, 0))
    img.paste(mark, (0, 0), mark)
    d = ImageDraw.Draw(img)
    lead = fs * 1.18
    top = (h - lead * 2) / 2 + lead * 0.06
    for i, t in enumerate(lines):
        d.text((h + gap, top + i * lead), t, font=fnt, fill=color)
    out = img.resize((max(1, W // SS), height), Image.LANCZOS)
    save(out, path)


def lockup_stacked(width, color, accent, bg, path):
    w = width * SS
    msz = int(w * 0.42)
    mark = draw_mark(msz, color, accent, None, None, None, 0.0)
    fs = int(w * 0.105)
    fnt = font(700, fs)
    lines = ["AZ ELEVATED", "BUILDERS"]
    lead = fs * 1.3
    H = int(msz + w * 0.11 + lead * 2)
    img = Image.new("RGBA", (w, H), bg if bg else (0, 0, 0, 0))
    img.paste(mark, ((w - msz) // 2, 0), mark)
    d = ImageDraw.Draw(img)
    y = msz + w * 0.10
    for i, t in enumerate(lines):
        tw = d.textlength(t, font=fnt)
        d.text(((w - tw) / 2, y + i * lead), t, font=fnt, fill=color)
    save(img.resize((width, max(1, H // SS)), Image.LANCZOS), path)


for h in (96, 192, 384, 768):
    lockup_horizontal(h, CREAM, BRASS, None,
                      os.path.join(OUT, "png", "web", f"azeb-lockup-horizontal-cream-{h}.png")); count += 1
    lockup_horizontal(h, NAVY, BRASS, None,
                      os.path.join(OUT, "png", "web", f"azeb-lockup-horizontal-navy-{h}.png")); count += 1
for w in (600, 1200, 2400):
    lockup_stacked(w, CREAM, BRASS, None,
                   os.path.join(OUT, "png", "print", f"azeb-lockup-stacked-cream-{w}.png")); count += 1
    lockup_stacked(w, NAVY, BRASS, None,
                   os.path.join(OUT, "png", "print", f"azeb-lockup-stacked-navy-{w}.png")); count += 1

print(f"brand raster: {count} files -> assets/brand/png/ + favicon.ico")
