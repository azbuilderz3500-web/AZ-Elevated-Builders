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
    if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else if (target && target.scrollIntoView) target.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------- Anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
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
    if (!menuOpen && y > 140 && y > lastY) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
    if (fab) fab.classList.toggle("is-in", y > window.innerHeight * 0.6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu overlay ---------- */
  const menu = document.getElementById("menu");
  const menuBtn = document.getElementById("menuBtn");
  const openMenu = () => {
    menu.classList.add("is-open");
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
    if (wasOpen) menuBtn.focus();
  };
  menu.setAttribute("inert", "");   // starts closed
  menuBtn.addEventListener("click", () =>
    menu.classList.contains("is-open") ? closeMenu() : openMenu()
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeMenu(); closeModals(); }
  });

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
      el.textContent = (0).toFixed(decimals) + suffix;   // only zero it once we can animate
      const dur = 1100, t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
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

  /* ---------- Estimate form: validate, show errors, confirm ---------- */
  const form = document.getElementById("estimateForm");
  let submitting = false;   // guards the keyboard "send" path too, not just the button
  if (form) {
    const showError = (input, msg) => {
      input.classList.add("is-error");
      input.setAttribute("aria-invalid", "true");
      let e = input.nextElementSibling;
      if (!e || !e.classList.contains("field-error")) {
        e = document.createElement("p");
        e.className = "field-error";
        input.insertAdjacentElement("afterend", e);
      }
      e.textContent = msg;
    };
    const clearError = (input) => {
      input.classList.remove("is-error");
      input.removeAttribute("aria-invalid");
      const e = input.nextElementSibling;
      if (e && e.classList.contains("field-error")) e.remove();
    };
    form.querySelectorAll("input").forEach((i) =>
      i.addEventListener("input", () => clearError(i))
    );

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector('input[name="name"]');
      const phone = form.querySelector('input[name="phone"]');
      let ok = true;

      if (!name.value.trim()) { showError(name, "Please enter your name."); ok = false; }
      // accept 10+ digits in any common US format
      const digits = phone.value.replace(/\D/g, "");
      if (!digits) { showError(phone, "Please enter a phone number."); ok = false; }
      else if (digits.length < 10) { showError(phone, "That number looks too short — 10 digits please."); ok = false; }

      if (!ok) { form.querySelector(".is-error").focus(); return; }
      if (submitting) return;
      submitting = true;

      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
      btn.textContent = "One moment…";

      // There is no submission endpoint yet, so we must NOT tell the visitor the
      // request was received. Hand them straight to a channel that actually works.
      // When a real endpoint exists, POST here and restore a true confirmation.
      setTimeout(() => {
        form.innerHTML =
          '<p class="modal__thanks" role="status" tabindex="-1">' +
          "<strong>Almost there — our online form isn't live yet.</strong><br>" +
          "Call or text us and we'll pick it up today:<br><br>" +
          '<a class="btn btn--solid" href="tel:+19258123150" data-cta="form-fallback-call" ' +
          'style="justify-content:center">Call (925) 812-3150</a><br>' +
          '<a href="mailto:Azbuild3rs@gmail.com" style="text-decoration:underline">Azbuild3rs@gmail.com</a></p>';
        const msg = form.querySelector(".modal__thanks");
        if (msg) msg.focus();   // move focus so screen readers land on the message
      }, 400);
    });
  }

  /* ---------- Cookies ---------- */
  const cookies = document.getElementById("cookies");
  if (cookies) {
    if (store.get("azeb-consent")) cookies.classList.add("is-hidden");
    cookies.querySelectorAll("[data-consent]").forEach((btn) =>
      btn.addEventListener("click", () => {
        store.set("azeb-consent", btn.dataset.consent);
        cookies.classList.add("is-hidden");
      })
    );
  }
})();
