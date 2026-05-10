(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var nav = document.querySelector("[data-nav]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var hero = document.querySelector("[data-parallax]");
  var yearEl = document.querySelector("[data-year]");

  function setHeaderScrolled() {
    if (!header) return;
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 24);
  }

  function setupNav() {
    if (!navToggle || !nav) return;

    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  function setupReveal() {
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;

    nodes.forEach(function (el) {
      var d = el.getAttribute("data-reveal-delay");
      if (d) {
        el.style.setProperty("--reveal-delay", d + "ms");
      }
    });

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  function setupParallax() {
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var bg = hero.querySelector(".hero__bg");
    if (!bg) return;

    var ticking = false;
    function update() {
      ticking = false;
      var rect = hero.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var progress = 1 - Math.min(Math.max((rect.bottom - 0) / (rect.height + vh), 0), 1);
      var y = (progress - 0.5) * 40;
      bg.style.transform = "translate3d(0, " + y.toFixed(2) + "px, 0)";
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  function setYear() {
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  setYear();
  setHeaderScrolled();
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });
  setupNav();
  setupReveal();
  setupParallax();
})();
