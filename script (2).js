/**
 * Tribute to Sardar Vallabhbhai Patel - Interactive Script
 * Features: Responsive mobile navigation, active scroll spy,
 * quote copy-to-clipboard, and historical photo gallery lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNavHighlight();
  initQuotesInteractivity();
  initGalleryLightbox();
});

/* --------------------------------------------------------------------------
   1. Mobile Navigation Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking on any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Scroll Spy / Active Nav Link Highlight
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120; // Offset for sticky navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Quotes Interactivity: Copy to Clipboard
   -------------------------------------------------------------------------- */
function initQuotesInteractivity() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toastNotification');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-target');
      const quoteEl = document.getElementById(targetId);
      if (!quoteEl) return;

      const quoteText = quoteEl.innerText.trim();
      const attribution = " — Sardar Vallabhbhai Patel";

      try {
        await navigator.clipboard.writeText(`${quoteText}${attribution}`);
        showToast("Quote copied to clipboard!");

        // Temporarily change button label
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span class="btn-icon-symbol">&#10003;</span> Copied!';
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2000);
      } catch (err) {
        showToast("Could not copy quote to clipboard.");
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/* --------------------------------------------------------------------------
   4. Historical Photo Gallery Lightbox Modal
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxClose');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');

  if (!modal || !img || !caption) return;

  function openModal(fullSrc, captionText) {
    img.src = fullSrc;
    img.alt = captionText;
    caption.innerText = captionText;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      img.src = '';
    }, 300);
  }

  galleryItems.forEach(item => {
    const fullSrc = item.getAttribute('data-full');
    const captionText = item.getAttribute('data-caption');

    item.addEventListener('click', () => openModal(fullSrc, captionText));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(fullSrc, captionText);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
