/* Phone menu for the service and city pages. The homepage has its own (in
   main.js, tied to its smooth scrolling); these pages load only this file and
   leads.js, so the menu is self-contained: open/close, focus trap, Escape,
   and focus back to the button when it closes. */
(function () {
  "use strict";
  const menu = document.getElementById("menu");
  const btn = document.getElementById("menuBtn");
  if (!menu || !btn) return;

  const isOpen = () => menu.classList.contains("is-open");
  const open = () => {
    menu.classList.add("is-open");
    menu.removeAttribute("inert");
    menu.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
    const first = menu.querySelector("a");
    if (first) setTimeout(() => first.focus(), 120);
  };
  const close = (restoreFocus = true) => {
    if (!isOpen()) return;
    menu.classList.remove("is-open");
    menu.setAttribute("inert", "");
    menu.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
    if (restoreFocus) btn.focus();
  };

  btn.addEventListener("click", () => (isOpen() ? close() : open()));
  // Following a link closes the menu; same-page links (#estimate) then scroll.
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) close(false); });
  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    const items = [btn, ...menu.querySelectorAll("a[href], button")];
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !items.includes(document.activeElement))) {
      e.preventDefault(); first.focus();
    }
  });
  // The button disappears above the phone breakpoint; don't leave the overlay up.
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => { if (e.matches) close(false); });
})();
