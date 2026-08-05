/* AZ Elevated Builders — interactions */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  // Phone users are here to call, not to watch an intro — keep it brief on small
  // screens and skip it entirely for repeat visits in the same session.
  const preloader = document.getElementById("preloader");
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const seen = sessionStorage.getItem("azeb-seen");
  const hold = prefersReduced || seen ? 0 : isMobile ? 550 : 1400;
  const dismiss = () => {
    preloader.classList.add("is-done");
    sessionStorage.setItem("azeb-seen", "1");
  };
  window.addEventListener("load", () => setTimeout(dismiss, hold));
  // Safety: never trap the user behind the loader
  setTimeout(dismiss, 3000);

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (window.Lenis && !prefersReduced) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else target.scrollIntoView({ behavior: "smooth" });
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
    if (y > 140 && y > lastY) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
    fab.classList.toggle("is-in", y > window.innerHeight * 0.6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu overlay ---------- */
  const menu = document.getElementById("menu");
  const menuBtn = document.getElementById("menuBtn");
  const openMenu = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");
  };
  const closeMenu = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  };
  menuBtn.addEventListener("click", () =>
    menu.classList.contains("is-open") ? closeMenu() : openMenu()
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeMenu(); closeModals(); }
  });

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
  const reelModal = document.getElementById("reelModal");
  const openModal = (m) => { m.classList.add("is-open"); m.setAttribute("aria-hidden", "false"); };
  const closeModals = () => {
    [contactModal, reelModal].forEach((m) => {
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
      const v = m.querySelector("video");
      if (v) v.pause();
    });
  };
  fab.addEventListener("click", () => openModal(contactModal));
  document.getElementById("reelBtn").addEventListener("click", () => openModal(reelModal));
  document.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModals));

  // Sticky mobile bar → estimate modal, focus the first field immediately
  const barQuote = document.getElementById("barQuote");
  if (barQuote) {
    barQuote.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(contactModal);
      const first = contactModal.querySelector('input[name="name"]');
      if (first) setTimeout(() => first.focus(), 350);
    });
  }

  /* ---------- Estimate form: validate, show errors, confirm ---------- */
  const form = document.getElementById("estimateForm");
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

      const btn = form.querySelector("button[type=submit]");
      btn.setAttribute("aria-busy", "true");
      btn.textContent = "Sending…";

      // No backend yet — swap this for the real endpoint (Netlify Forms / Formspree / webhook)
      setTimeout(() => {
        form.innerHTML =
          '<p class="modal__thanks">Thanks — we got it.<br>' +
          "We'll call you back within one business day.<br><br>" +
          'Need us sooner? <a href="tel:+19258123150" style="text-decoration:underline">Call (925) 812-3150</a></p>';
      }, 600);
    });
  }

  /* ---------- Cookies ---------- */
  const cookies = document.getElementById("cookies");
  if (localStorage.getItem("azeb-consent")) cookies.classList.add("is-hidden");
  cookies.querySelectorAll("[data-consent]").forEach((btn) =>
    btn.addEventListener("click", () => {
      localStorage.setItem("azeb-consent", btn.dataset.consent);
      cookies.classList.add("is-hidden");
    })
  );
})();
