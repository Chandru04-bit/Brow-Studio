/**
 * Lash & Brow Studio — Gallery, Filter & Lightbox Script
 * Manages gallery category filtering, modal lightbox, keyboard navigation, and interactive before/after sliders.
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initGalleryLightbox();
  initBeforeAfterSlider();
  initImageErrorFallbacks();
});

let currentGalleryItems = [];
let activeLightboxIndex = 0;
let refreshLightboxItems = null;

/**
 * Filter gallery cards by category
 */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('is-hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.97)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.classList.add('is-hidden');
        }
      });

      // Update lightbox items to match visible set
      if (typeof refreshLightboxItems === 'function') {
        refreshLightboxItems();
      }
    });
  });
}

/**
 * Initialize Lightbox Modal for Gallery Cards
 */
function initGalleryLightbox() {
  const modalEl = document.getElementById('galleryModal');
  const allCards = document.querySelectorAll('.gallery-card[data-lightbox="true"]');
  if (!modalEl || !allCards.length) return;

  const modalImg = modalEl.querySelector('#modalLightboxImage');
  const modalTitle = modalEl.querySelector('#modalLightboxTitle');
  const modalDesc = modalEl.querySelector('#modalLightboxDesc');
  const prevBtn = modalEl.querySelector('#lightboxPrevBtn');
  const nextBtn = modalEl.querySelector('#lightboxNextBtn');

  // Function to refresh the active collection of visible cards
  refreshLightboxItems = function() {
    const visibleCards = Array.from(document.querySelectorAll('.gallery-card[data-lightbox="true"]')).filter(card => {
      const parentItem = card.closest('.gallery-item');
      return !parentItem || !parentItem.classList.contains('is-hidden');
    });

    currentGalleryItems = visibleCards.map(card => {
      const img = card.querySelector('img');
      const title = card.getAttribute('data-title') || (card.querySelector('.gallery-title') ? card.querySelector('.gallery-title').textContent.trim() : 'Lash & Brow Style');
      const desc = card.getAttribute('data-desc') || (card.querySelector('.gallery-sub') ? card.querySelector('.gallery-sub').textContent.trim() : '');
      const src = card.getAttribute('data-large-src') || (img ? img.getAttribute('src') : '');
      return { card, src, title, desc };
    });
  };

  refreshLightboxItems();

  // Attach click & keyboard listeners to all cards
  allCards.forEach(card => {
    const handleCardActivate = () => {
      refreshLightboxItems();
      const clickIdx = currentGalleryItems.findIndex(item => item.card === card);
      if (clickIdx !== -1) {
        openLightbox(clickIdx);
      } else {
        openLightbox(0);
      }
    };

    card.addEventListener('click', handleCardActivate);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const title = card.getAttribute('data-title') || 'Lash & Brow Style';
    card.setAttribute('aria-label', `View details for ${title}`);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardActivate();
      }
    });
  });

  function updateLightboxContent(index) {
    if (!currentGalleryItems.length) return;
    if (index < 0) index = currentGalleryItems.length - 1;
    if (index >= currentGalleryItems.length) index = 0;
    activeLightboxIndex = index;

    const item = currentGalleryItems[activeLightboxIndex];
    if (!item) return;

    if (modalImg) {
      modalImg.src = item.src;
      modalImg.alt = item.title;
    }
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalDesc) modalDesc.textContent = item.desc;
  }

  function openLightbox(index) {
    updateLightboxContent(index);
    if (typeof bootstrap !== 'undefined') {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateLightboxContent(activeLightboxIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateLightboxContent(activeLightboxIndex + 1);
    });
  }

  // Keyboard navigation inside lightbox
  modalEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateLightboxContent(activeLightboxIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateLightboxContent(activeLightboxIndex + 1);
    }
  });
}

/**
 * Interactive Before / After Comparison Slider
 */
function initBeforeAfterSlider() {
  const sliders = document.querySelectorAll('.ba-slider-container');
  if (!sliders.length) return;

  sliders.forEach(slider => {
    const beforeWrap = slider.querySelector('.ba-slider-before');
    const handle = slider.querySelector('.ba-slider-handle');
    if (!beforeWrap || !handle) return;

    let isDown = false;

    const setPosition = (x) => {
      const rect = slider.getBoundingClientRect();
      let posX = x - rect.left;
      if (posX < 0) posX = 0;
      if (posX > rect.width) posX = rect.width;

      const percentage = (posX / rect.width) * 100;
      beforeWrap.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      setPosition(e.clientX);
    });

    // Touch events for mobile/tablet
    slider.addEventListener('touchstart', (e) => {
      isDown = true;
      if (e.touches.length > 0) {
        setPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDown = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDown || e.touches.length === 0) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });
  });
}

/**
 * Graceful image fallbacks if any image asset fails to load
 */
function initImageErrorFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23FAF2F2' width='800' height='600'/%3E%3Ctext fill='%23C98291' font-family='Georgia,serif' font-size='26' x='50%25' y='48%25' text-anchor='middle'%3ELash %26 Brow Studio%3C/text%3E%3Ctext fill='%2382767A' font-family='sans-serif' font-size='15' x='50%25' y='55%25' text-anchor='middle'%3EBeauty Imagery%3C/text%3E%3C/svg%3E";
    }, { once: true });
  });
}
