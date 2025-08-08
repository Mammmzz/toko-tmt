/* eslint-disable no-undef */
(function () {
  "use strict";

  const SLIDES_URL = "./assets/data/slides.json";

  /**
   * Fetch slides data from JSON.
   * Returns an array of objects: { image: string, link: string, alt?: string }
   */
  async function fetchSlidesData() {
    try {
      // Add cache-busting parameter to force fresh load
      const cacheBuster = `?v=${Date.now()}`;
      const response = await fetch(SLIDES_URL + cacheBuster, { 
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (!response.ok) {
        throw new Error(`Gagal memuat slides.json: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Format slides.json tidak valid. Harus berupa array.");
      }
      console.log("Berhasil memuat slides.json dengan", data.length, "gambar");
      return data;
    } catch (error) {
      console.warn("Gagal memuat slides dari JSON, fallback ke default.", error);
      // Fallback: contoh default (gunakan gambar online supaya langsung tampil)
      return [
        {
          image: "https://picsum.photos/seed/slide1/2000/1200",
          link: "https://example.com/feature-1",
          alt: "Fitur 1",
        },
        {
          image: "https://picsum.photos/seed/slide2/2000/1200",
          link: "https://example.com/feature-2",
          alt: "Fitur 2",
        },
        {
          image: "https://picsum.photos/seed/slide3/2000/1200",
          link: "https://example.com/feature-3",
          alt: "Fitur 3",
        },
      ];
    }
  }

  /** Preload one image source. */
  function preloadImage(sourceUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ url: sourceUrl, ok: true });
      img.onerror = () => resolve({ url: sourceUrl, ok: false });
      img.src = sourceUrl;
    });
  }

  /** Add slides into DOM. */
  function buildSlides(slides) {
    const container = document.getElementById("slides-container");
    container.textContent = "";

    slides.forEach((slide, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "swiper-slide";

      const anchor = document.createElement("a");
      anchor.className = "slide-link";
      anchor.href = slide.link || "#";
      anchor.rel = "noopener noreferrer";
      anchor.target = "_self";
      anchor.setAttribute("aria-label", slide.alt || `Slide ${index + 1}`);

      const image = document.createElement("img");
      // Add cache-busting for local images
      const imageSrc = slide.image.startsWith('./') ? 
        slide.image + `?v=${Date.now()}` : 
        slide.image;
      image.src = imageSrc;
      image.alt = slide.alt || "";
      image.decoding = "async";
      image.loading = "eager"; // first slide needs to show fast

      anchor.appendChild(image);
      wrapper.appendChild(anchor);
      container.appendChild(wrapper);
    });
  }

  /** Initialize Swiper slider. */
  function initSwiper() {
    return new Swiper(".swiper", {
      // Core UX
      direction: "horizontal",
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 600,
      centeredSlides: false,
      loop: false,
      grabCursor: true,

      // Input & Accessibility
      keyboard: {
        enabled: true,
        onlyInViewport: true,
        pageUpDown: true,
      },
      a11y: {
        enabled: true,
      },

      // Controls
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        disabledClass: "swiper-button-disabled",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },

      // Effects
      effect: "fade", // Smooth fade transition
      fadeEffect: { 
        crossFade: true 
      },

      // Responsive breakpoints (kept simple as we want full-bleed)
      breakpoints: {
        768: { speed: 650 },
        1024: { speed: 700 },
      },
    });

    return swiperInstance;
  }

  /** Hide loading overlay */
  function hideLoadingOverlay() {
    const overlay = document.getElementById("loading-overlay");
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-busy", "false");
  }

  /** Toggle Fullscreen */
  function attachFullscreenHandler() {
    const button = document.getElementById("fullscreen-toggle");
    if (!button) return;

    function isFullscreen() {
      return (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    }

    function requestFs(target) {
      if (target.requestFullscreen) return target.requestFullscreen();
      if (target.webkitRequestFullscreen) return target.webkitRequestFullscreen();
      if (target.msRequestFullscreen) return target.msRequestFullscreen();
      return Promise.resolve();
    }

    function exitFs() {
      if (document.exitFullscreen) return document.exitFullscreen();
      if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
      if (document.msExitFullscreen) return document.msExitFullscreen();
      return Promise.resolve();
    }

    button.addEventListener("click", async () => {
      try {
        if (!isFullscreen()) {
          await requestFs(document.documentElement);
        } else {
          await exitFs();
        }
      } catch (e) {
        console.warn("Fullscreen gagal:", e);
      }
    });
  }

  /** Enhanced keyboard navigation */
  function attachKeyboardHandler(swiperInstance) {
    document.addEventListener('keydown', (e) => {
      // Only handle if swiper is focused or no specific element is focused
      if (document.activeElement === document.body || 
          document.activeElement.classList.contains('swiper') ||
          document.activeElement.closest('.swiper')) {
        
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            swiperInstance.slidePrev();
            break;
          case 'ArrowRight':
            e.preventDefault();
            swiperInstance.slideNext();
            break;
          case 'Home':
            e.preventDefault();
            swiperInstance.slideTo(0);
            break;
          case 'End':
            e.preventDefault();
            swiperInstance.slideTo(swiperInstance.slides.length - 1);
            break;
        }
      }
    });
  }

  /** Custom arrow button handlers */
  function attachCustomArrowHandlers(swiperInstance) {
    const prevButton = document.getElementById('custom-prev');
    const nextButton = document.getElementById('custom-next');
    const mobilePrevButton = document.getElementById('mobile-prev');
    const mobileNextButton = document.getElementById('mobile-next');

    // Desktop buttons
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        swiperInstance.slidePrev();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        swiperInstance.slideNext();
      });
    }

    // Mobile buttons
    if (mobilePrevButton) {
      mobilePrevButton.addEventListener('click', () => {
        swiperInstance.slidePrev();
      });
    }

    if (mobileNextButton) {
      mobileNextButton.addEventListener('click', () => {
        swiperInstance.slideNext();
      });
    }

    // Update button states based on swiper position
    swiperInstance.on('slideChange', () => {
      if (prevButton) {
        prevButton.disabled = swiperInstance.isBeginning;
        prevButton.style.opacity = swiperInstance.isBeginning ? '0.3' : '1';
      }
      if (nextButton) {
        nextButton.disabled = swiperInstance.isEnd;
        nextButton.style.opacity = swiperInstance.isEnd ? '0.3' : '1';
      }
      if (mobilePrevButton) {
        mobilePrevButton.disabled = swiperInstance.isBeginning;
        mobilePrevButton.style.opacity = swiperInstance.isBeginning ? '0.3' : '1';
      }
      if (mobileNextButton) {
        mobileNextButton.disabled = swiperInstance.isEnd;
        mobileNextButton.style.opacity = swiperInstance.isEnd ? '0.3' : '1';
      }
    });
  }

  /** Lightbox functionality */
  function initLightbox(slides) {
    const modal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    let currentLightboxIndex = 0;

    function openLightbox(index) {
      currentLightboxIndex = index;
      const slide = slides[index];
      lightboxImage.src = slide.image;
      lightboxImage.alt = slide.alt || `Menu ${index + 1}`;
      lightboxCounter.textContent = `${index + 1} / ${slides.length}`;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
      if (direction === 'next') {
        currentLightboxIndex = (currentLightboxIndex + 1) % slides.length;
      } else {
        currentLightboxIndex = (currentLightboxIndex - 1 + slides.length) % slides.length;
      }
      openLightbox(currentLightboxIndex);
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape':
          e.preventDefault();
          closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateLightbox('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateLightbox('next');
          break;
      }
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('lightbox-overlay')) {
        closeLightbox();
      }
    });

    return { openLightbox };
  }

  /** Main boot */
  async function boot() {
    const slides = await fetchSlidesData();

    // Preload all images, but don't block forever if some fail
    await Promise.race([
      Promise.all(slides.map((s) => preloadImage(s.image))),
      new Promise((resolve) => setTimeout(resolve, 2500)), // safety timeout
    ]);

    buildSlides(slides);
    const swiperInstance = initSwiper();
    const { openLightbox } = initLightbox(slides);
    
    // Add click handlers to slides
    document.querySelectorAll('.slide-link').forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    attachFullscreenHandler();
    attachKeyboardHandler(swiperInstance);
    attachCustomArrowHandlers(swiperInstance);
    hideLoadingOverlay();
  }

  // Start when DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();


