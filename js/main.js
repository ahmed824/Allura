// Wait for loader to complete before initializing app features
let appInitialized = false;

function initApp() {
  if (appInitialized) return;
  appInitialized = true;

  // Helper function to safely animate with existence check
  function safeTween(target, fromVars, toVars) {
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    if (!el) {
      console.warn(`GSAP target not found: ${target}`);
      return; // Skip animation
    }
    gsap.fromTo(el, fromVars, toVars);
  }

  // Initialize AOS after loader
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
  });

  // Hero Swiper - Initialize after loader
  const heroSwiper = new Swiper(".hero-swiper", {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".hero-pagination",
      clickable: true,
      bulletClass: "hero-bullet",
      bulletActiveClass: "hero-bullet-active",
    },
  });

  // Brand Swiper - Initialize after loader
  const brandSwiper = new Swiper(".brandSwiper", {
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    slidesPerView: 2,
    breakpoints: {
      640: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      1024: { slidesPerView: 6 },
    },
  });

  // Instagram Swiper - Initialize after loader
  const instagramSwiper = new Swiper(".instagramSwiper", {
    loop: true,
    effect: "fade",
    fadeEffect: { crossFade: true },
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    speed: 1000,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // Register GSAP ScrollTo Plugin after loader
  gsap.registerPlugin(ScrollToPlugin);

  // All GSAP ScrollTrigger animations after loader - with safe checks
  const heroGradient = document.querySelector(".hero-gradient");
  if (heroGradient) {
    gsap.to(heroGradient, {
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: 100,
      opacity: 0.8,
      ease: "none",
    });
  }

  // Enhanced slide text animations on load - with safe checks
  gsap.utils.toArray(".swiper-slide").forEach((slide) => {
    if (!slide) return;
    ScrollTrigger.create({
      trigger: slide,
      start: "top 80%",
      onEnter: () => {
        const texts = slide.querySelectorAll("h1, p, button");
        if (texts.length > 0) {
          gsap.fromTo(
            texts,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.out",
            }
          );
        }
      },
    });
  });

  // Scroll to Top Button logic after loader
  const scrollTopBtn = document.getElementById("scrollTop");
  if (scrollTopBtn) {
    let scrollTimeout;
    let isScrolling = false;

    // Optimized scroll handler with debouncing and requestAnimationFrame
    const handleScroll = () => {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }

      scrollTimeout = window.requestAnimationFrame(() => {
        if (isScrolling) return;

        const scrollPercent =
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
          100;

        if (scrollPercent > 20) {
          scrollTopBtn.classList.remove("hidden");
          scrollTopBtn.classList.add("flex");
          gsap.to(scrollTopBtn, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(scrollTopBtn, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              if (window.scrollY < window.innerHeight * 0.2) {
                scrollTopBtn.classList.add("hidden");
                scrollTopBtn.classList.remove("flex");
              }
            },
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Smooth scroll with GSAP
    scrollTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (isScrolling) return;
      isScrolling = true;

      gsap.to(scrollTopBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });

      gsap.to(window, {
        duration: 1,
        scrollTo: { y: 0, autoKill: false },
        ease: "power2.inOut",
        onComplete: () => {
          isScrolling = false;
          handleScroll();
        },
      });
    });
  }

  // Add to cart animation after loader
  document.querySelectorAll(".btn-primary").forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      if (this.textContent.includes("أضف للسلة")) {
        e.preventDefault();
        gsap.to(this, {
          scale: 0.9,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check ml-2"></i> تمت الإضافة';
            this.style.background = "#10b981";
            setTimeout(() => {
              this.innerHTML = originalText;
              this.style.background = "";
            }, 2000);
          },
        });
      }
    });
  });

  // Navbar scroll effect after loader
  const navbar = document.querySelector("nav");
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }
      lastScroll = currentScroll;
    });
  }

  // Smooth scroll for navigation links after loader
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (!anchor) return;
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // GSAP entrance animation for logo after loader (if needed)
  const logoWrapper = document.querySelector(".logo-wrapper");
  if (logoWrapper) {
    gsap.from(logoWrapper, {
      scale: 0,
      rotation: 180,
      duration: 1,
      ease: "back.out(1.7)",
      delay: 0.2,
    });
  }

  const loadingText = document.querySelector(".loading-text");
  if (loadingText) {
    gsap.from(loadingText, { opacity: 0, y: 20, duration: 0.8, delay: 0.8 });
  }

  const progressContainer = document.querySelector(".progress-container");
  if (progressContainer) {
    gsap.from(progressContainer, {
      opacity: 0,
      scaleX: 0,
      duration: 0.8,
      delay: 1,
    });
  }
}

// Loader with GSAP animations - Call initApp on completion
const loader = document.getElementById("loader");
const progressBar = document.getElementById("progressBar");
const percentage = document.getElementById("percentage");

if (loader && progressBar && percentage) {
  let progress = 0;
  const duration = 2500; // 2.5 seconds
  const interval = 50; // Update every 50ms
  const increment = (100 / duration) * interval;

  // Simulate loading progress
  const progressInterval = setInterval(() => {
    progress += increment;

    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);

      // Hide loader after completion with GSAP
      setTimeout(() => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            loader.classList.add("hidden");
            document.body.style.overflow = "auto";
            // Initialize app after loader fully hidden
            initApp();
          },
        });
      }, 500);
    }

    // Update progress bar and percentage
    progressBar.style.width = progress + "%";
    percentage.textContent = Math.floor(progress) + "%";
  }, interval);
}

// Prevent scrolling while loading
document.body.style.overflow = "hidden";

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

// Close sidebar when clicking on overlay
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("sidebarOverlay");

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      toggleSidebar();
    }
  });

  // Close sidebar on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const sidebar = document.getElementById("sidebar");
      if (sidebar.classList.contains("active")) {
        toggleSidebar();
      }
    }
  });
});

// GSAP Animations on Scroll
gsap.registerPlugin();

// Animate footer sections on load
gsap.from(".footer-section", {
  opacity: 0,
  y: 30,
  duration: 0.8,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "footer",
    start: "top 80%",
  },
});

// Animate payment methods
gsap.from(".payment-methods img", {
  opacity: 0,
  y: 20,
  duration: 0.5,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".payment-methods",
    start: "top 90%",
  },
});

// Social media icons hover effect with GSAP
document.querySelectorAll(".social-link").forEach((link) => {
  link.addEventListener("mouseenter", function () {
    gsap.to(this, {
      scale: 1.2,
      rotation: 360,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
  });

  link.addEventListener("mouseleave", function () {
    gsap.to(this, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  });
});

// Newsletter input focus animation
const newsletterInput = document.querySelector(".newsletter-input");
newsletterInput.addEventListener("focus", function () {
  gsap.to(this, {
    scale: 1.02,
    duration: 0.3,
    ease: "power2.out",
  });
});

newsletterInput.addEventListener("blur", function () {
  gsap.to(this, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out",
  });
});
