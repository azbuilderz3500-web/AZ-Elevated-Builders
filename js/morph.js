/* AZ Elevated Builders — drawing-to-room scroll morph.
   GSAP and the frame scrubber load only when the section is about one
   screen away, so the homepage's first paint pays nothing for them. The
   frames are drawn on a canvas (not a <video>) so the picture follows the
   finger on iOS and runs backwards when scrolling up. */
(function () {
  "use strict";
  const section = document.getElementById("drawn");
  if (!section) return;

  const beats = [...section.querySelectorAll("[data-beat]")];
  const setBeat = (p) => {
    const i = p < 0.34 ? 0 : p < 0.74 ? 1 : 2;
    beats.forEach((b, k) => b.classList.toggle("on", k === i));
    section.style.setProperty("--morph-p", p.toFixed(3));
  };
  setBeat(0);

  // Anything goes wrong (offline CDN, old browser): show the finished room.
  const fallback = () => {
    section.classList.add("is-static");
    const poster = section.querySelector(".scrub__poster");
    if (poster && poster.dataset.final) poster.src = poster.dataset.final;
    setBeat(1);
  };

  const GSAP = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/";
  const load = (src) => new Promise((ok, fail) => {
    const s = document.createElement("script");
    s.src = src; s.async = true; s.onload = ok; s.onerror = fail;
    document.head.appendChild(s);
  });

  let started = false;
  const start = async () => {
    if (started) return;
    started = true;
    try {
      if (!window.gsap) await load(GSAP + "gsap.min.js");
      if (!window.ScrollTrigger) await load(GSAP + "ScrollTrigger.min.js");
      window.gsap.registerPlugin(window.ScrollTrigger);
      // Lenis moves the page itself; tell ScrollTrigger on every Lenis tick.
      if (window.AZEB_LENIS) window.AZEB_LENIS.on("scroll", window.ScrollTrigger.update);
      const { createScrollScrub } = await import(section.dataset.module);
      const scrub = createScrollScrub({
        container: section,
        manifest: section.dataset.manifest,
        gsap: window.gsap,
        ScrollTrigger: window.ScrollTrigger,
        fit: "cover",
        holdStart: 0.05,
        holdEnd: 0.14,
        reducedMotion: "static",
        concurrency: 4,   // leave room for the page's own photos
        onScrub: (p, mapped) => setBeat(mapped),
      });
      scrub.ready.catch(fallback);
    } catch (err) {
      fallback();
    }
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); start(); }
    }, { rootMargin: "120% 0px" });
    io.observe(section);
  } else {
    fallback();
  }
})();
