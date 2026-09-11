/* AZ Elevated Builders — interactions */
(function () {
  "use strict";

  /* ---------- Preloader ----------
     Nothing above this may throw. Storage access raises SecurityError when a
     browser is set to block all cookies (and in some embedded webviews), which
     previously killed this whole script and left the preloader covering the
     page forever — including the tap-to-call button. */
  // Storage that can never throw. Defined first — it cannot fail at definition
  // time, so everything below is safe to arm.
  const store = {
    get(k, session) {
      try { return (session ? sessionStorage : localStorage).getItem(k); }
      catch (_) { return null; }
    },
    set(k, v, session) {
      try { (session ? sessionStorage : localStorage).setItem(k, v); }
      catch (_) { /* private mode / blocked storage — non-fatal */ }
    },
  };

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (window.Lenis && !prefersReduced) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const scrollTo = (target) => {
    if (lenis) { lenis.scrollTo(target, { offset: 0 }); return; }
    // Without Lenis, target may be the number 0 (scroll-to-top) — which has no
    // scrollIntoView. Handle both shapes.
    if (typeof target === "number") window.scrollTo({ top: target, behavior: prefersReduced ? "instant" : "smooth" });
    else if (target && target.scrollIntoView) target.scrollIntoView({ behavior: prefersReduced ? "instant" : "smooth" });
  };

  /* ---------- Anchor links ---------- */
  document.querySelectorAll('a[href^="#"]:not(#heroQuote):not(#barQuote)').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      // A bare "#" is not a valid selector — querySelector would throw and the
      // click would fall through to a jump-to-top.
      if (!id || id === "#") { e.preventDefault(); return; }
      const el = id === "#top" ? document.body : document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      closeMenu();
      scrollTo(id === "#top" ? 0 : el);
      if (id !== "#top") { el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); }
    });
  });

  /* ---------- Nav hide/show on scroll ---------- */
  const nav = document.getElementById("nav");
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    // Never hide the nav while the menu is open — its close button lives there,
    // and hiding it stranded the user with no way out.
    const menuOpen = menu && menu.classList.contains("is-open");
    const hide = !menuOpen && y > 140 && y > lastY;
    nav.classList.toggle("is-hidden", hide);
    // Body flag lets sticky elements (case-study titles) follow the nav:
    // when the bar slides away, they slide up to top:0 so no gap opens
    // above them where content scrolls through.
    document.body.classList.toggle("nav-hidden", hide);
    lastY = y;
    if (fab) fab.classList.toggle("is-in", y > window.innerHeight * 0.6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu overlay ---------- */
  const menu = document.getElementById("menu");
  const menuBtn = document.getElementById("menuBtn");
  const openMenu = () => {
    menu.classList.add("is-open");
    nav.classList.remove("is-hidden");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
    menu.setAttribute("aria-hidden", "false");
    menu.removeAttribute("inert");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");
    const first = menu.querySelector("a");
    if (first) setTimeout(() => first.focus(), 120);
  };
  const closeMenu = () => {
    const wasOpen = menu.classList.contains("is-open");
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    // inert keeps the 12 links out of the tab order while hidden; CSS clip-path
    // alone left them focusable inside an aria-hidden container.
    menu.setAttribute("inert", "");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    if (wasOpen) {
      document.body.style.overflow = "";
      if (lenis) lenis.start();
      menuBtn.focus();
    }
  };
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !menu.classList.contains("is-open")) return;
    const items = [menuBtn, ...menu.querySelectorAll('a[href], button')];
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !items.includes(document.activeElement))) {
      e.preventDefault(); first.focus();
    }
  });
  // A desktop breakpoint hides the mobile close button. Close its overlay too.
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches && menu.classList.contains("is-open")) {
      closeMenu();
      document.querySelector(".bar__brand").focus();
    }
  });
  menu.setAttribute("inert", "");   // starts closed
  menuBtn.addEventListener("click", () =>
    menu.classList.contains("is-open") ? closeMenu() : openMenu()
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeMenu(); closeModals(); }
  });

  /* ---------- Editorial index: hover swaps a preview image ---------- */
  const idxPreview = document.getElementById("idxPreview");
  if (idxPreview && window.matchMedia("(min-width: 901px)").matches) {
    const idxImg = idxPreview.querySelector("img");
    document.querySelectorAll(".index__row").forEach((row) => {
      row.addEventListener("mouseenter", () => {
        const src = row.dataset.preview;
        if (!src) return;
        if (idxImg.getAttribute("src") !== src) idxImg.setAttribute("src", src);
        idxPreview.classList.add("on");
      });
      row.addEventListener("mouseleave", () => idxPreview.classList.remove("on"));
    });
    const list = document.querySelector(".index__list");
    if (list) list.addEventListener("mouseleave", () => idxPreview.classList.remove("on"));
  }

  /* ---------- Cinema: clip-wipe reveals, parallax, counters ----------
     Same drama as the first design, driven differently: images arrive as a
     curtain wipe rather than a word-by-word fade. */
  const revealables = document.querySelectorAll(".r-up, .r-clip, .r-mask");
  const revealAll = () => revealables.forEach((el) => el.classList.add("on"));
  // Opt in to the hidden-by-default states only now that JS is confirmed running.
  if (!prefersReduced && "IntersectionObserver" in window) {
    document.documentElement.classList.add("cinema");
    // Belt and braces: if anything is still hidden after 4s, show it.
    setTimeout(revealAll, 4000);
  }
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    const cine = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("on"); cine.unobserve(en.target); }
      }),
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    revealables.forEach((el) => cine.observe(el));
  }

  /* Parallax — hero art and the full-bleed band drift against the scroll. */
  const parallax = [...document.querySelectorAll("[data-parallax]")];
  if (parallax.length && !prefersReduced) {
    let ticking = false;
    const runParallax = () => {
      const vh = window.innerHeight;
      parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const depth = parseFloat(el.dataset.parallax) || 0.12;
        // -1 .. 1 across the viewport
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${(p * depth * 100).toFixed(2)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(runParallax); }
    }, { passive: true });
    runParallax();
  }

  /* Stat counters tick up once, when they first come into view. */
  const stats = document.querySelectorAll("[data-count]");
  if (stats.length) {
    const countUp = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      if (prefersReduced) { el.textContent = target.toFixed(decimals) + suffix; return; }
      const final = target.toFixed(decimals) + suffix;
      el.textContent = (0).toFixed(decimals) + suffix;   // only zero it once we can animate
      // Guarantee the true value lands even if rAF is throttled or the tab is
      // backgrounded mid-count — a frozen counter would read "0 yr warranty".
      const dur = 1100, t0 = performance.now();
      setTimeout(() => { el.textContent = final; }, dur + 400);
      const step = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / dur));
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const so = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { countUp(en.target); so.unobserve(en.target); }
    }), { threshold: 0.6 });
    stats.forEach((el) => so.observe(el));
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Word-by-word reveal ---------- */
  document.querySelectorAll("[data-word-reveal]").forEach((block) => {
    const words = block.textContent.trim().split(/\s+/);
    block.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
  });
  const wordBlocks = [...document.querySelectorAll("[data-word-reveal]")];
  const updateWords = () => {
    const vh = window.innerHeight;
    wordBlocks.forEach((block) => {
      const r = block.getBoundingClientRect();
      if (r.top > vh || r.bottom < 0) return;
      // progress: 0 when block top hits 85% of viewport, 1 when top reaches 30%
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.55)));
      const ws = block.querySelectorAll(".w");
      const cut = Math.floor(p * ws.length);
      ws.forEach((w, i) => w.classList.toggle("on", i <= cut && p > 0));
    });
    requestAnimationFrame(updateWords);
  };
  if (!prefersReduced) requestAnimationFrame(updateWords);
  else wordBlocks.forEach((b) => b.querySelectorAll(".w").forEach((w) => w.classList.add("on")));

  /* ---------- Services accordion ---------- */
  document.querySelectorAll(".service__row").forEach((row) => {
    row.addEventListener("click", () => {
      const body = row.nextElementSibling;
      const open = row.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".service__row").forEach((r) => {
        r.setAttribute("aria-expanded", "false");
        r.nextElementSibling.style.maxHeight = null;
      });
      if (!open) {
        row.setAttribute("aria-expanded", "true");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  /* ---------- Modals ---------- */
  const fab = document.getElementById("fab");
  const contactModal = document.getElementById("contactModal");
  const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, summary, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const openModal = (m) => {
    if (!m) return;
    lastFocused = document.activeElement;
    m.classList.add("is-open");
    m.removeAttribute("inert");
    m.setAttribute("aria-hidden", "false");
    m.setAttribute("aria-modal", "true");
    document.body.style.overflow = "hidden";      // stop the page scrolling behind
    if (lenis) lenis.stop();
    const first = m.querySelector(FOCUSABLE);
    if (first) setTimeout(() => first.focus(), 60);
  };

  const closeModals = () => {
    if (!contactModal) return;
    contactModal.classList.remove("is-open");
    contactModal.setAttribute("inert", "");
    contactModal.setAttribute("aria-hidden", "true");
    contactModal.removeAttribute("aria-modal");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
    if (lastFocused && lastFocused.focus) lastFocused.focus();   // restore focus
    lastFocused = null;
  };

  // Keep Tab inside an open dialog.
  if (contactModal) {
    contactModal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !contactModal.classList.contains("is-open")) return;
      const items = [...contactModal.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  if (fab) fab.addEventListener("click", () => openModal(contactModal));
  document.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModals));

  // Sticky mobile bar → estimate modal, focus the first field immediately
  const openEstimate = (e) => {
    if (e) e.preventDefault();
    openModal(contactModal);
    const first = contactModal.querySelector('input[name="name"]');
    if (first) setTimeout(() => first.focus(), 350);
  };
  ["barQuote", "heroQuote"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", openEstimate);
  });

})();
