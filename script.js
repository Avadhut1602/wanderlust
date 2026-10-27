/* ============================================================
   WANDERLUST — script.js
   All interactive behaviour: navbar, hamburger, scroll,
   destination modal, contact form validation, back-to-top.
============================================================ */

'use strict';

// ── Destination Data ─────────────────────────────────────────
const DESTINATIONS_DATA = {
  'Bali, Indonesia': {
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80',
    badge: '🏝 Beach',
    price: '₹45,000',
    description:
      'Bali is a tropical paradise of lush rice terraces, sacred Hindu temples, and warm turquoise waters. Whether you want to surf at Kuta, meditate in Ubud, or explore ancient temples at dawn — Bali has it all.',
    highlights: ['Ubud Monkey Forest', 'Tanah Lot Temple', 'Tegallalang Rice Terraces', 'Kuta Beach', 'Besakih Mother Temple', 'Tirta Empul'],
  },
  'Manali, India': {
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=700&q=80',
    badge: '🏔 Mountains',
    price: '₹18,000',
    description:
      'Nestled in the Beas River Valley, Manali is the gateway to the Himalayas. It offers stunning snow-capped peaks, thrilling adventure sports from skiing to river rafting, and serene pine-scented valleys.',
    highlights: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'Old Manali', 'Beas River Rafting', 'Paragliding'],
  },
  'Paris, France': {
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=700&q=80',
    badge: '🗼 Culture',
    price: '₹75,000',
    description:
      'The City of Light captivates with its iconic Eiffel Tower, world-class art museums like the Louvre, cobblestone boulevards, café culture, and extraordinary cuisine. Paris is a dream destination like no other.',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Notre-Dame Cathedral', 'Champs-Élysées', 'Palace of Versailles'],
  },
  'Goa, India': {
    image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=700&q=80',
    badge: '🌊 Beach',
    price: '₹12,000',
    description:
      "India's most beloved beach destination blends golden sandy shores, vibrant nightlife, Portuguese colonial heritage, and some of the freshest seafood you'll ever taste. Goa is sunshine in a destination.",
    highlights: ['Calangute Beach', 'Fort Aguada', 'Basilica of Bom Jesus', 'Anjuna Flea Market', 'Dudhsagar Falls', 'Vagator Cliffs'],
  },
};

// ── Helpers ──────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Navbar: scroll → scrolled class ──────────────────────────
const navbar = $('#navbar');

function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // initial

// ── Hamburger menu ────────────────────────────────────────────
const hamburger = $('#hamburger');
const navLinks  = $('#nav-links');

function openMenu() {
  navLinks.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});

// Close when a nav link is tapped (mobile)
$$('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on outside click
document.addEventListener('click', e => {
  if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    closeMenu();
  }
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ── Active nav link on scroll ─────────────────────────────────
const sections = $$('section[id]');
const navLinkEls = $$('.nav-link');

function updateActiveLink() {
  const scrollY = window.scrollY + 90;
  let current = '';

  sections.forEach(section => {
    if (scrollY >= section.offsetTop) {
      current = section.getAttribute('id');
    }
  });

  navLinkEls.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ── Back-to-top button ────────────────────────────────────────
const backToTopBtn = $('#back-to-top');

window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Destination Modal ─────────────────────────────────────────
const modalOverlay = $('#modal-overlay');
const modalBody    = $('#modal-body');
const modalClose   = $('#modal-close');

function openModal(destinationName) {
  const data = DESTINATIONS_DATA[destinationName];
  if (!data) return;

  const highlightItems = data.highlights
    .map(h => `<li>${h}</li>`)
    .join('');

  modalBody.innerHTML = `
    <img
      src="${data.image}"
      alt="${destinationName}"
      class="modal-img"
      onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80'"
    />
    <div class="modal-content">
      <span class="modal-badge">${data.badge}</span>
      <h2 class="modal-title" id="modal-title">${destinationName}</h2>
      <p class="modal-desc">${data.description}</p>
      <div class="modal-highlights">
        <h4>Top Highlights</h4>
        <ul>${highlightItems}</ul>
      </div>
      <div class="modal-footer">
        <div class="modal-price">
          ${data.price} <small>Indicative starting price</small>
        </div>
        <button class="btn btn-primary" onclick="closeModal(); scrollToContact();">Plan This Trip</button>
      </div>
    </div>
  `;

  modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = '';
}

// Global — called from inline onclick
window.showDestinationAlert = function(name) {
  openModal(name);
};

window.closeModal = closeModal;

window.scrollToContact = function() {
  const contactSection = $('#contact');
  if (contactSection) {
    setTimeout(() => {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
};

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
});

// ── Contact Form Validation ───────────────────────────────────
const contactForm  = $('#contact-form');
const formSuccess  = $('#form-success');

function getVal(id) { return $('#' + id, contactForm)?.value.trim() ?? ''; }

function setError(fieldId, msg) {
  const field = $('#' + fieldId, contactForm);
  const errEl = $('#' + fieldId + '-error', contactForm);
  if (!field || !errEl) return;

  if (msg) {
    field.classList.add('error');
    errEl.textContent = msg;
  } else {
    field.classList.remove('error');
    errEl.textContent = '';
  }
}

function clearErrors() {
  ['name', 'email', 'message'].forEach(id => setError(id, ''));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Live validation — clear error as user types
['name', 'email', 'message'].forEach(id => {
  const el = $('#' + id, contactForm);
  if (!el) return;
  el.addEventListener('input', () => setError(id, ''));
});

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  clearErrors();
  formSuccess.hidden = true;

  const name    = getVal('name');
  const email   = getVal('email');
  const message = getVal('message');
  let   valid   = true;

  if (!name) {
    setError('name', 'Please enter your full name.');
    valid = false;
  }

  if (!email) {
    setError('email', 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setError('email', 'Please enter a valid email address (e.g. you@example.com).');
    valid = false;
  }

  if (!message) {
    setError('message', 'Please write a message before submitting.');
    valid = false;
  } else if (message.length < 10) {
    setError('message', 'Your message should be at least 10 characters long.');
    valid = false;
  }

  if (!valid) return;

  // Simulate async submission
  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message ✈';
    contactForm.reset();
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide success after 8 seconds
    setTimeout(() => { formSuccess.hidden = true; }, 8000);
  }, 1200);
});

// ── Intersection Observer — fade-in cards ─────────────────────
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Prepare cards for animation
  $$('.card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    observer.observe(card);
  });

  // Feature items
  $$('.feature-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.45s ease ${i * 0.08}s, transform 0.45s ease ${i * 0.08}s`;
    observer.observe(item);
  });

  // About section
  $$('.about-img-wrap, .about-content').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.55s ease ${i * 0.15}s, transform 0.55s ease ${i * 0.15}s`;
    observer.observe(el);
  });
}

// ── Prevent hero background-attachment: fixed on iOS ─────────
// (iOS doesn't support background-attachment: fixed well on small screens)
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  const hero = $('.hero');
  if (hero) hero.style.backgroundAttachment = 'scroll';
}
