/* ── Nav scroll handler ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});

/* ── Logo trace animation ── */
const logoPath = document.querySelector('.nav-logo-img .cls-3');
if (logoPath) {
  const len = logoPath.getTotalLength();
  logoPath.style.strokeDasharray = len;
  logoPath.style.strokeDashoffset = len;
  logoPath.style.animation = 'trace-logo 2s ease forwards';
}

/* ── Custom cursor tracking + on-dark toggle ── */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.querySelectorAll('.stats-bar, footer, #contact, .resume-download-wrap, .code-block, .coming-soon').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('on-dark'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('on-dark'));
});

/* ── IntersectionObserver for .reveal elements ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Nav transition overlay ── */
const overlay    = document.getElementById('contact-overlay');
const overlayPath = overlay ? overlay.querySelector('.cls-3-ov') : null;
let overlayLen   = null;

document.querySelectorAll('nav a, a.nav-transition').forEach(link => {
  link.addEventListener('click', e => {
    if (!overlay || !overlayPath) return;
    e.preventDefault();
    const dest = link.getAttribute('href');

    // Reset any previous animation state
    overlayPath.style.animation = 'none';
    overlayPath.getBoundingClientRect(); // force reflow
    overlay.classList.remove('fade-out');

    // Measure path length once
    if (!overlayLen) overlayLen = overlayPath.getTotalLength();
    overlayPath.style.strokeDasharray  = overlayLen;
    overlayPath.style.strokeDashoffset = overlayLen;

    // Fade in
    overlay.classList.add('active');

    // Start trace after overlay is visible
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlayPath.style.animation = 'trace-overlay 0.9s ease forwards';
      });
    });

    setTimeout(() => {
      if (dest && dest.startsWith('#')) {
        // Same-page: fade out overlay and scroll to section
        overlay.classList.add('fade-out');
        overlay.classList.remove('active');
        document.querySelector(dest)?.scrollIntoView({ behavior: 'smooth' });
        // Reset for next use
        setTimeout(() => {
          overlay.classList.remove('fade-out');
          overlayPath.style.animation = 'none';
          overlayPath.style.strokeDashoffset = overlayLen;
        }, 250);
      } else {
        // Cross-page navigation
        window.location.href = dest;
      }
    }, 1100);
  });
});

/* ── Mark active nav link based on current page ── */
(function markActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (
      (page === 'portfolio.html'  && href === 'portfolio.html')  ||
      (page === 'experience.html' && href === 'experience.html')
    ) {
      a.classList.add('active');
    }
  });
})();
