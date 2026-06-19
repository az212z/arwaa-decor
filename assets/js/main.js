/* ===== Arwaa Lamasat — main.js ===== */
(function () {
  "use strict";

  /* ---- Preloader (hard fallback) ---- */
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (!preloader) return;
    preloader.style.opacity = "0";
    setTimeout(function () { preloader.style.display = "none"; }, 500);
  }
  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 1200); // fallback if 'load' never fires

  /* ---- Sticky header shrink ---- */
  var header = document.getElementById("site-header");
  window.addEventListener("scroll", function () {
    if (!header) return;
    header.classList.toggle("shrink", window.scrollY > 40);
  });

  /* ---- Full-screen mobile menu ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobile-menu");
  var menuClose = document.getElementById("menu-close");

  function openMenu() {
    if (!menu) return;
    menu.classList.add("open");
    document.body.style.overflow = "hidden";
    if (burger) burger.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    document.body.style.overflow = "";
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) burger.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (menu) {
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeMenu(); closeLightbox(); }
  });

  /* ---- Scroll reveal (with fallback) ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    // safety: reveal everything after 2.5s no matter what
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("visible"); });
    }, 2500);
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Lightbox ---- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = lightbox ? lightbox.querySelector("img") : null;
  var lbClose = lightbox ? lightbox.querySelector(".lb-close") : null;

  function openLightbox(src, alt) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.querySelectorAll(".g-item").forEach(function (fig) {
    fig.addEventListener("click", function () {
      var src = fig.getAttribute("data-img");
      var img = fig.querySelector("img");
      openLightbox(src, img ? img.alt : "");
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---- Toast ---- */
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 4200);
  }

  /* ---- Quote form ---- */
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.name.value || "").trim();
      var phone = (form.phone.value || "").trim();
      var service = (form.service.value || "").trim();
      var notes = (form.notes.value || "").trim();

      if (!name || !phone || !service) {
        showToast("الرجاء تعبئة الاسم والجوال والخدمة المطلوبة.");
        return;
      }

      // Save demo copy to localStorage
      try {
        var store = JSON.parse(localStorage.getItem("arwaa_quotes") || "[]");
        store.push({ name: name, phone: phone, service: service, notes: notes, at: new Date().toISOString() });
        localStorage.setItem("arwaa_quotes", JSON.stringify(store));
      } catch (err) { /* ignore storage errors */ }

      // Build WhatsApp message
      var text =
        "السلام عليكم، أرغب في طلب عرض سعر من أروع لمسات للديكور:%0A" +
        "• الاسم: " + encodeURIComponent(name) + "%0A" +
        "• الجوال: " + encodeURIComponent(phone) + "%0A" +
        "• الخدمة: " + encodeURIComponent(service) + "%0A" +
        (notes ? "• ملاحظات: " + encodeURIComponent(notes) + "%0A" : "");

      showToast("تم تجهيز طلبك — يتم تحويلك إلى واتساب الآن.");
      setTimeout(function () {
        window.open("https://wa.me/966530676558?text=" + text, "_blank");
      }, 700);
      form.reset();
    });
  }

  /* ---- Footer year (defensive, copy already says 2026) ---- */
})();
