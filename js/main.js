/* ============================================================
   NAIM PORTFOLIO — MAIN JAVASCRIPT
   Author: Md. Nahiduzzaman (Naim)
   ============================================================ */

'use strict';

/* ── SPINNER ── */
window.addEventListener('load', () => {
  const spinner = document.getElementById('spinner');
  if (spinner) {
    setTimeout(() => spinner.classList.add('hide'), 400);
    setTimeout(() => spinner.remove(), 950);
  }
});

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  // back to top
  const btn = document.getElementById('back-top');
  if (btn) btn.classList.toggle('show', window.scrollY > 420);
});

/* ── HAMBURGER / MOBILE NAV ── */
const ham = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (ham && mobileNav) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

/* ── ACTIVE NAV LINK (single-page) ── */
function setActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });
}
window.addEventListener('scroll', setActiveNav);

/* ── BACK TO TOP ── */
const backTop = document.getElementById('back-top');
if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── INTERSECTION OBSERVER — Fade animations ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => io.observe(el));

/* ── SKILL BARS ── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-panel').forEach(el => skillObserver.observe(el));

/* ── COUNTERS ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const suffix = el.dataset.suffix || '';
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const counterBand = document.getElementById('counter-band');
if (counterBand) counterObserver.observe(counterBand);

/* ── TYPED EFFECT (hero subtitle) ── */
function typedEffect(el, texts, speed = 80, pause = 2000) {
  if (!el) return;
  let ti = 0, ci = 0, deleting = false;
  function tick() {
    const text = texts[ti];
    el.textContent = deleting ? text.slice(0, ci--) : text.slice(0, ci++);
    if (!deleting && ci > text.length) {
      setTimeout(() => { deleting = true; tick(); }, pause);
      return;
    }
    if (deleting && ci < 0) {
      deleting = false;
      ci = 0;
      ti = (ti + 1) % texts.length;
    }
    setTimeout(tick, deleting ? speed / 2 : speed);
  }
  tick();
}
typedEffect(document.getElementById('typed-text'), [
  'VLSI Enthusiast',
  'IEEE Chapter Chairperson',
  'Campus Ambassador',
  'EEE Student @ AIUB',
  'Circuit Designer'
]);

/* ── CONTACT FORM ── */
const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !subject || !message) {
      showFeedback('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending (replace with real fetch/AJAX)
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      showFeedback('✅ Message sent successfully! Naim will get back to you soon.', 'success');
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 1200);
  });
}
function showFeedback(msg, type) {
  if (!feedback) return;
  feedback.textContent = msg;
  feedback.className = type;
  feedback.style.display = 'block';
  setTimeout(() => { feedback.style.display = 'none'; }, 5000);
}

/* ── PROJECT FILTER ── */
const filterBtns = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('[data-category]');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.opacity = show ? '1' : '0.2';
      card.style.pointerEvents = show ? 'auto' : 'none';
      card.style.transform = show ? '' : 'scale(0.95)';
    });
  });
});

/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 10 : 70;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ── YEAR in footer ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
