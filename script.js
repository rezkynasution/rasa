const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const bookingLinks = document.querySelectorAll('a[href*="wa.me"]');
bookingLinks.forEach((link) => {
  link.setAttribute("aria-label", "Book a RASA Studio session on WhatsApp");
});

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    mobileMenu.classList.toggle("hidden", isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      mobileMenu.classList.add("hidden");
      document.body.classList.remove("menu-open");
    });
  });
}

let lenis;

if (!prefersReducedMotion && window.Lenis) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
    });
  });
}

if (window.Swiper) {
  new Swiper(".hero-swiper", {
    effect: "fade",
    loop: true,
    speed: 1800,
    allowTouchMove: false,
    autoplay: prefersReducedMotion
      ? false
      : {
          delay: 5600,
          disableOnInteraction: false
        },
    fadeEffect: {
      crossFade: true
    }
  });
}

if (window.GLightbox) {
  GLightbox({
    selector: ".glightbox",
    touchNavigation: true,
    loop: true,
    openEffect: "fade",
    closeEffect: "fade",
    slideEffect: "fade",
    moreLength: 0
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryCards = document.querySelectorAll(".gallery-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    galleryCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !shouldShow);
      card.setAttribute("aria-hidden", String(!shouldShow));
      card.tabIndex = shouldShow ? 0 : -1;
    });

    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  });
});

if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(".reveal", {
    y: 34,
    opacity: 0,
    filter: "blur(16px)"
  });

  ScrollTrigger.batch(".reveal", {
    start: "top 86%",
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.05,
        ease: "power3.out",
        stagger: 0.08
      });
    }
  });

  gsap.to(".about-image img", {
    yPercent: -7,
    ease: "none",
    scrollTrigger: {
      trigger: "#about",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".cta-panel", {
    scale: 0.985,
    ease: "none",
    scrollTrigger: {
      trigger: ".cta-panel",
      start: "top bottom",
      end: "bottom center",
      scrub: true
    }
  });

  gsap.to(".nav-shell", {
    backgroundColor: "rgba(7,7,7,0.68)",
    borderColor: "rgba(255,255,255,0.24)",
    scrollTrigger: {
      trigger: "body",
      start: "80px top",
      end: "180px top",
      scrub: true
    }
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "none";
    element.style.filter = "none";
  });
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  if (window.ScrollTrigger) {
    ScrollTrigger.refresh();
  }
});
