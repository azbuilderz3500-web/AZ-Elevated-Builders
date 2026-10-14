/*!
 * scroll-scrub.js — scroll-driven image-sequence scrubber on a <canvas>.
 *
 * The "AI video" that actually works on phones: the morph is exported as 60–120 WebP frames
 * (scripts/extract-frames.sh) and drawn onto a canvas from decoded bitmaps as the page scrolls.
 * Because nothing seeks a <video> element, the frame follows the finger on iOS.
 *
 * Requires GSAP 3.13+ with ScrollTrigger (free since 3.13). Load them before this module or pass
 * them in via options ({ gsap, ScrollTrigger }) when bundling.
 *
 * Usage:
 *   import { createScrollScrub } from './scroll-scrub.js';
 *   const scrub = createScrollScrub({ container: '#morph', manifest: '/morph/frames.json' });
 *
 * Markup (see scroll-scrub.css):
 *   <section id="morph" class="scrub" style="--scrub-length: 400vh">
 *     <div class="scrub__stage">
 *       <img class="scrub__poster" src="/morph/poster.webp" alt="">
 *       <canvas class="scrub__canvas"></canvas>
 *       <div class="scrub__ui"> ...captions... </div>
 *     </div>
 *   </section>
 */

const DEFAULTS = {
  container: null,        // element or selector: the tall section that defines the scroll length
  canvas: null,           // element or selector (default: first <canvas> inside container)
  manifest: null,         // URL of frames.json written by scripts/extract-frames.sh
  frames: null,           // alternative: { count, path: 'frames/frame_{i}.webp' | (i) => url, pad, start, width, height }
  variant: 'auto',        // manifest variant name, or 'auto' (by orientation + pixel width)
  fit: 'cover',           // 'cover' | 'contain'
  focal: [0.5, 0.5],      // where the frame anchors when cropped (0..1, x then y)
  background: '#000',     // letterbox colour for fit: 'contain'
  dprCap: 2,              // cap devicePixelRatio; 3x phones gain nothing visible and pay 2.25x memory
  scrub: true,            // true = locked to the finger; a number (seconds) adds smoothing lag
  start: 'top top',       // ScrollTrigger start/end relative to container
  end: 'bottom bottom',
  holdStart: 0,           // fraction of the scroll that rests on the first frame
  holdEnd: 0,             // fraction of the scroll that rests on the last frame (0.1–0.15 reads well)
  map: null,              // optional (progress 0..1) => progress remap after the holds
  decode: 'auto',         // 'auto' | 'all' | 'window' — how many decoded bitmaps to keep
  decodeWindow: 0,        // frames kept decoded around the current one in 'window' mode (0 = auto)
  memoryBudgetMB: 0,      // decoded-pixel budget used by 'auto' (0 = 260MB desktop / 120MB touch)
  concurrency: 6,         // parallel frame downloads
  preload: 'eager',       // 'eager' | 'visible' (start downloading when the section nears the viewport)
  reducedMotion: 'scrub', // 'scrub' keeps the scroll-linked scrub; 'static' shows the final frame instead
  prelude: null,          // live zoom drawn from one high-res image before the frames start (see below)
  //   { src, srcSmall, to: [x, y], endWidth, share: 0.34, startCenter: null, blend: 6 }
  //   src: image URL (3840px wide is plenty); srcSmall: optional lighter one for touch devices;
  //   to/endWidth: same numbers as the brief's zoom stage; share: fraction of the scroll the zoom
  //   takes; blend: frames over which the live crop crossfades into frame 0. The math matches
  //   scripts/gen/zoom-frames.py, so the zoom ends exactly on the crop the first take starts from.
  gsap: null,
  ScrollTrigger: null,
  onProgress: null,       // (loaded, total)
  onReady: null,          // (api) once every frame is downloaded
  onFrame: null,          // (drawnIndex, wantedIndex) after each draw
  onScrub: null,          // (scrollProgress, mappedProgress, frameIndex) on every scroll update
};

const isCoarse = () => typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
const prefersReduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const resolveEl = (x, root = document) => (typeof x === 'string' ? root.querySelector(x) : x);
const padNum = (n, pad) => String(n).padStart(pad, '0');

// Download order: first, last, middle, quarters, eighths... so a visitor who scrolls before the
// sequence finishes loading sees a coarse-but-complete morph instead of only the first N frames.
function bisectionOrder(n) {
  if (n <= 0) return [];
  const out = [0];
  if (n === 1) return out;
  out.push(n - 1);
  const seen = new Set(out);
  const queue = [[0, n - 1]];
  while (queue.length) {
    const [a, b] = queue.shift();
    if (b - a < 2) continue;
    const m = (a + b) >> 1;
    if (!seen.has(m)) { seen.add(m); out.push(m); }
    queue.push([a, m], [m, b]);
  }
  return out;
}

async function decodeBlob(blob) {
  if (typeof createImageBitmap === 'function') {
    try { return await createImageBitmap(blob); } catch (_) { /* fall back to <img> */ }
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.src = url;
    if (img.decode) await img.decode();
    else await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Pick the variant that covers the stage at the capped DPR with the fewest pixels.
function pickVariant(variants, targetW, targetH, name) {
  if (!Array.isArray(variants) || !variants.length) return null;
  if (name && name !== 'auto') return variants.find(v => v.name === name) || variants[0];
  const orientation = targetH > targetW ? 'portrait' : 'landscape';
  const same = variants.filter(v => (v.orientation || (v.height > v.width ? 'portrait' : 'landscape')) === orientation);
  const pool = (same.length ? same : variants).slice();
  const coverage = v => Math.min(v.width / targetW, v.height / targetH);
  pool.sort((a, b) => a.width * a.height - b.width * b.height);
  return pool.find(v => coverage(v) >= 0.9) || pool.reduce((best, v) => (coverage(v) > coverage(best) ? v : best), pool[0]);
}

export function createScrollScrub(userOptions = {}) {
  const o = { ...DEFAULTS, ...userOptions };
  const container = resolveEl(o.container);
  if (!container) throw new Error('scroll-scrub: container not found');
  const canvas = resolveEl(o.canvas, container) || container.querySelector('canvas');
  if (!canvas) throw new Error('scroll-scrub: canvas not found');
  const stage = canvas.parentElement;
  const ctx = canvas.getContext('2d', { alpha: false });
  const gsap = o.gsap || globalThis.gsap;
  const ScrollTrigger = o.ScrollTrigger || globalThis.ScrollTrigger || (gsap && gsap.core && gsap.core.globals && gsap.core.globals().ScrollTrigger);
  const useScroll = !(o.reducedMotion === 'static' && prefersReduced());
  if (useScroll) {
    if (!gsap || !ScrollTrigger) throw new Error('scroll-scrub: gsap and ScrollTrigger are required (load them before this module or pass { gsap, ScrollTrigger })');
    gsap.registerPlugin(ScrollTrigger);
    // The iOS address bar collapsing must not trigger a full ScrollTrigger refresh mid-scrub.
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  // ---- state ---------------------------------------------------------------------------
  let count = 0, urlFor = null, frameW = 0, frameH = 0, variantName = null;
  const blobs = [];            // compressed bytes per frame (cheap: ~50-100KB each)
  const bitmaps = new Map();   // decoded frames currently held (expensive: w*h*4 bytes each)
  const decoding = new Set();
  let mode = o.decode;         // 'auto' -> 'all' | 'window'
  let windowSize = o.decodeWindow || 0;
  let loadedCount = 0, wantIndex = 0, drawnIndex = -1, direction = 1;
  let rect = null, sizeDirty = true, destroyed = false, pendingP = null;
  let order = [], cursor = 0, inflightFetch = 0;
  let trigger = null, ro = null, io = null;
  let preludeBmp = null, preludeT = null, drawnT = null;  // prelude state (null = past the prelude)
  const abort = new AbortController();
  let resolveReady, rejectReady;
  const ready = new Promise((res, rej) => { resolveReady = res; rejectReady = rej; });
  ready.catch(() => {});
  const MAX_DECODE = 4;

  // ---- source ----------------------------------------------------------------------------
  async function resolveSource() {
    const dpr = Math.min(globalThis.devicePixelRatio || 1, o.dprCap);
    const targetW = (stage.clientWidth || globalThis.innerWidth) * dpr;
    const targetH = (stage.clientHeight || globalThis.innerHeight) * dpr;
    if (o.frames) {
      const f = o.frames;
      count = f.count;
      urlFor = typeof f.path === 'function' ? f.path : i => f.path.replace('{i}', padNum(i + (f.start ?? 1), f.pad ?? 3));
      frameW = f.width || 0; frameH = f.height || 0;
      return;
    }
    if (!o.manifest) throw new Error('scroll-scrub: provide `manifest` (frames.json) or `frames`');
    const res = await fetch(o.manifest, { signal: abort.signal });
    if (!res.ok) throw new Error(`scroll-scrub: manifest ${res.status} ${o.manifest}`);
    const m = await res.json();
    const base = o.manifest.slice(0, o.manifest.lastIndexOf('/') + 1);
    count = m.count;
    const v = pickVariant(m.variants, targetW, targetH, o.variant);
    variantName = v ? v.name : null;
    frameW = v ? v.width : 0; frameH = v ? v.height : 0;
    const dir = v && v.dir ? v.dir.replace(/\/?$/, '/') : '';
    const file = m.file || 'frame_{i}.webp';
    const pad = m.pad ?? 3, start = m.start ?? 1;
    urlFor = i => base + dir + file.replace('{i}', padNum(i + start, pad));
  }

  // ---- sizing ----------------------------------------------------------------------------
  function resize() {
    if (destroyed) return;
    const dpr = Math.min(globalThis.devicePixelRatio || 1, o.dprCap);
    const cw = Math.max(1, Math.round(stage.clientWidth * dpr));
    const ch = Math.max(1, Math.round(stage.clientHeight * dpr));
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    if (frameW && frameH) {
      const scale = o.fit === 'contain' ? Math.min(cw / frameW, ch / frameH) : Math.max(cw / frameW, ch / frameH);
      const dw = frameW * scale, dh = frameH * scale;
      rect = { dx: (cw - dw) * o.focal[0], dy: (ch - dh) * o.focal[1], dw, dh };
    }
    sizeDirty = true;
    render();
  }

  // ---- drawing ---------------------------------------------------------------------------
  function nearestDecoded(i) {
    if (bitmaps.has(i)) return i;
    for (let d = 1; d < count; d++) {
      const back = i - d * direction, fwd = i + d * direction; // prefer the frame we just passed
      if (back >= 0 && back < count && bitmaps.has(back)) return back;
      if (fwd >= 0 && fwd < count && bitmaps.has(fwd)) return fwd;
    }
    return -1;
  }

  // Crop box of the prelude image at zoom progress t (0..1): same maths as zoom-frames.py.
  function preludeBox(t) {
    const pr = o.prelude;
    const W = preludeBmp.width, H = preludeBmp.height, aspect = rect.dw / rect.dh;
    const sw = Math.min(W, H * aspect), sh = sw / aspect;
    const scx = pr.startCenter ? pr.startCenter[0] * W : W / 2, scy = pr.startCenter ? pr.startCenter[1] * H : H / 2;
    const ew = (pr.endWidth || 0.15) * W;
    const e = t * t * (3 - 2 * t);
    let w = Math.min(W, sw * Math.pow(ew / sw, e)), h = Math.min(H, w / aspect);
    const cx = scx + (pr.to[0] * W - scx) * e, cy = scy + (pr.to[1] * H - scy) * e;
    const x0 = Math.max(0, Math.min(cx - w / 2, W - w)), y0 = Math.max(0, Math.min(cy - h / 2, H - h));
    void sh;
    return [x0, y0, w, h];
  }

  function drawPrelude(t) {
    const [x, y, w, h] = preludeBox(t);
    ctx.drawImage(preludeBmp, x, y, w, h, rect.dx, rect.dy, rect.dw, rect.dh);
  }

  function render() {
    if (destroyed || !rect) return;
    if (preludeT != null) {                       // inside the live zoom
      if (!preludeBmp) return;                    // poster stays visible until the image arrives
      if (preludeT === drawnT && !sizeDirty) return;
      if (o.fit === 'contain') { ctx.fillStyle = o.background; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      drawPrelude(preludeT);
      drawnT = preludeT; drawnIndex = -1; sizeDirty = false;
      if (canvas.dataset.scrubState !== 'ready') canvas.dataset.scrubState = 'ready';
      if (o.onFrame) o.onFrame(-1, -1);
      return;
    }
    const idx = nearestDecoded(wantIndex);
    if (idx < 0) return;
    if (idx === drawnIndex && !sizeDirty) return;
    const bmp = bitmaps.get(idx);
    if (o.fit === 'contain') { ctx.fillStyle = o.background; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    const blend = o.prelude && preludeBmp ? (o.prelude.blend ?? 6) : 0;
    if (blend && idx < blend) {                   // hand-off: live crop under the first frames
      drawPrelude(1);
      ctx.globalAlpha = (idx + 1) / (blend + 1);
      ctx.drawImage(bmp, rect.dx, rect.dy, rect.dw, rect.dh);
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(bmp, rect.dx, rect.dy, rect.dw, rect.dh);
    }
    drawnIndex = idx; drawnT = null; sizeDirty = false;
    if (canvas.dataset.scrubState !== 'ready') canvas.dataset.scrubState = 'ready';
    if (o.onFrame) o.onFrame(idx, wantIndex);
  }

  // ---- memory strategy -------------------------------------------------------------------
  function withinWindow(i) {
    if (mode === 'all') return true;
    if (!windowSize) return i === wantIndex;
    const ahead = Math.ceil(windowSize * 0.6), behind = windowSize - ahead;
    const d = (i - wantIndex) * direction; // > 0 means ahead in the direction of travel
    return d >= 0 ? d <= ahead : -d <= behind;
  }

  function ensureMode(bmp) {
    const perFrame = bmp.width * bmp.height * 4;
    let budget = o.memoryBudgetMB;
    if (!budget) {
      budget = isCoarse() ? 120 : 260;
      const dm = globalThis.navigator && navigator.deviceMemory; // Chromium only
      if (dm && dm <= 4) budget = Math.min(budget, 100);
    }
    const fits = perFrame * count <= budget * 1024 * 1024;
    if (mode === 'auto') mode = fits ? 'all' : 'window';
    if (mode === 'all') windowSize = count;
    else if (!windowSize) windowSize = Math.max(12, Math.min(count, Math.floor((budget * 1024 * 1024) / perFrame)));
    for (let i = 0; i < count; i++) if (blobs[i] && !bitmaps.has(i) && withinWindow(i)) decodeFrame(i);
  }

  function evict() {
    if (bitmaps.size <= windowSize) return;
    const keep = new Set([0, count - 1, wantIndex]);
    const victims = [...bitmaps.keys()]
      .filter(k => !keep.has(k) && !withinWindow(k))
      .sort((a, b) => Math.abs(b - wantIndex) - Math.abs(a - wantIndex));
    while (bitmaps.size > windowSize && victims.length) {
      const k = victims.shift();
      const bmp = bitmaps.get(k);
      bitmaps.delete(k);
      if (bmp && bmp.close) bmp.close();
    }
  }

  async function decodeFrame(i) {
    if (destroyed || bitmaps.has(i) || decoding.has(i) || !blobs[i]) return;
    decoding.add(i);
    try {
      const bmp = await decodeBlob(blobs[i]);
      if (destroyed) { if (bmp.close) bmp.close(); return; }
      bitmaps.set(i, bmp);
      if (!frameW || !frameH) { frameW = bmp.width; frameH = bmp.height; resize(); }
      if (mode === 'auto' || !windowSize) ensureMode(bmp);
      if (mode === 'window') evict();
    } catch (err) {
      console.warn('scroll-scrub: decode failed for frame', i, err);
    } finally {
      decoding.delete(i);
    }
    render();
  }

  function scheduleDecodes() {
    if (mode === 'all') return;
    const ahead = windowSize ? Math.ceil(windowSize * 0.6) : 4;
    const behind = windowSize ? windowSize - ahead : 2;
    for (let d = 0; d <= Math.max(ahead, behind); d++) {
      if (decoding.size >= MAX_DECODE) break;
      const a = wantIndex + d * direction, b = wantIndex - d * direction;
      if (d <= ahead && a >= 0 && a < count && !bitmaps.has(a)) decodeFrame(a);
      if (d > 0 && d <= behind && b >= 0 && b < count && !bitmaps.has(b)) decodeFrame(b);
    }
  }

  // ---- loading ---------------------------------------------------------------------------
  function pump() {
    while (inflightFetch < o.concurrency && cursor < order.length && !destroyed) {
      const i = order[cursor++];
      inflightFetch++;
      loadFrame(i)
        .catch(err => { if (!destroyed && err.name !== 'AbortError') console.warn('scroll-scrub: frame', i, err); })
        .finally(() => { inflightFetch--; pump(); });
    }
  }

  async function loadFrame(i) {
    const res = await fetch(urlFor(i), { signal: abort.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${urlFor(i)}`);
    blobs[i] = await res.blob();
    loadedCount++;
    if (o.onProgress) o.onProgress(loadedCount, count);
    if (mode === 'auto' || withinWindow(i)) await decodeFrame(i);
    if (loadedCount === count) { resolveReady(api); if (o.onReady) o.onReady(api); }
  }

  // ---- scroll ----------------------------------------------------------------------------
  function mapProgress(p) {
    let q = p;
    const hs = o.holdStart, he = o.holdEnd;
    if ((hs || he) && 1 - hs - he > 0) q = Math.min(1, Math.max(0, (p - hs) / (1 - hs - he)));
    if (o.map) q = o.map(q);
    return q;
  }

  function setProgress(p) {
    if (!count) { pendingP = p; return; }
    let q = mapProgress(p);
    if (o.prelude) {
      const share = o.prelude.share ?? 0.34;
      if (q < share) {
        preludeT = q / share;
        if (wantIndex !== 0) { direction = -1; wantIndex = 0; scheduleDecodes(); }
        render();
        if (o.onScrub) o.onScrub(p, q, -1);
        return;
      }
      preludeT = null;
      q = (q - share) / (1 - share);
    }
    const idx = Math.round(q * (count - 1));
    if (idx !== wantIndex || drawnT != null) {
      direction = idx > wantIndex ? 1 : -1;
      wantIndex = idx;
      scheduleDecodes();
      render();
    }
    if (o.onScrub) o.onScrub(p, q, idx);
  }

  async function loadPrelude() {
    const pr = o.prelude;
    const src = (pr.srcSmall && isCoarse()) ? pr.srcSmall : pr.src;
    try {
      const res = await fetch(src, { signal: abort.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${src}`);
      const bmp = await decodeBlob(await res.blob());
      if (destroyed) { if (bmp.close) bmp.close(); return; }
      preludeBmp = bmp;
      sizeDirty = true;
      render();
    } catch (err) {
      if (!destroyed && err.name !== 'AbortError') console.warn('scroll-scrub: prelude image failed', err);
    }
  }

  // Scroll -> progress. `scrub: true` is direct. A number is the time constant (seconds) of an
  // exponential catch-up on the GSAP ticker: the same feel as ScrollTrigger's scrub smoothing,
  // without a tween that could pre-render at its end state during init.
  const smooth = typeof o.scrub === 'number' && o.scrub > 0 ? o.scrub : 0;
  let target = 0, current = 0, tickerOn = false;
  function tick(_, deltaMs) {
    const d = target - current;
    if (Math.abs(d) < 0.0005) {
      current = target; gsap.ticker.remove(tick); tickerOn = false; setProgress(current); return;
    }
    current += d * (1 - Math.exp(-(deltaMs / 1000) / smooth));
    setProgress(current);
  }
  function onScroll(p) {
    if (!smooth) { setProgress(p); return; }
    target = p;
    if (!tickerOn) { tickerOn = true; gsap.ticker.add(tick); }
  }

  function startLoading() {
    if (io) { io.disconnect(); io = null; }
    pump();
  }

  async function init() {
    try {
      await resolveSource();
      if (destroyed) return;
      order = bisectionOrder(count);
      if (o.prelude) { preludeT = 0; loadPrelude(); }
      ro = new ResizeObserver(resize);
      ro.observe(stage);
      resize();
      if (useScroll) {
        trigger = ScrollTrigger.create({
          trigger: container,
          start: o.start,
          end: o.end,
          onUpdate: self => onScroll(self.progress),
          onRefresh: self => onScroll(self.progress),
        });
        onScroll(trigger.progress);
      } else {
        setProgress(1);
      }
      if (pendingP != null) { setProgress(pendingP); pendingP = null; }
      if (o.preload === 'visible' && typeof IntersectionObserver === 'function') {
        io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) startLoading(); }, { rootMargin: '100% 0px' });
        io.observe(container);
      } else {
        startLoading();
      }
    } catch (err) {
      if (!destroyed) { console.error(err); rejectReady(err); }
    }
  }

  const api = {
    ready,
    get frame() { return wantIndex; },
    get count() { return count; },
    seek(p) { setProgress(Math.min(1, Math.max(0, p))); return api; },
    refresh() { if (useScroll) ScrollTrigger.refresh(); resize(); return api; },
    stats() {
      return { count, loaded: loadedCount, decoded: bitmaps.size, mode, windowSize, variant: variantName, prelude: preludeT,
        frame: { w: frameW, h: frameH }, canvas: { w: canvas.width, h: canvas.height }, drawn: drawnIndex, wanted: wantIndex };
    },
    destroy() {
      destroyed = true;
      abort.abort();
      if (trigger) { trigger.kill(); trigger = null; }
      if (tickerOn) { gsap.ticker.remove(tick); tickerOn = false; }
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      for (const b of bitmaps.values()) if (b && b.close) b.close();
      if (preludeBmp && preludeBmp.close) preludeBmp.close();
      bitmaps.clear();
      blobs.length = 0;
    },
  };

  init();
  return api;
}

export default createScrollScrub;
