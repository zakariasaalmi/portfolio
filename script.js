(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('navMobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Process line fill ---------- */
  const processTrack = document.querySelector('.process-track');
  const processFill = document.getElementById('processFill');
  if (processTrack && processFill) {
    const fillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          processFill.style.width = '100%';
          fillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    fillObserver.observe(processTrack);
  }

  /* ---------- Cursor glow + dot ---------- */
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasFinePointer && glow && dot) {
    window.addEventListener('mousemove', (e) => {
      glow.style.setProperty('--x', e.clientX + 'px');
      glow.style.setProperty('--y', e.clientY + 'px');
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    }, { passive: true });

    document.querySelectorAll('[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
      el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
    });
  } else if (dot) {
    dot.style.display = 'none';
  }

  /* ---------- Magnetic buttons ---------- */
  if (hasFinePointer && !prefersReduced) {
    document.querySelectorAll('.magnetic').forEach(el => {
      let bounds;
      el.addEventListener('mouseenter', () => { bounds = el.getBoundingClientRect(); });
      el.addEventListener('mousemove', (e) => {
        if (!bounds) bounds = el.getBoundingClientRect();
        const relX = e.clientX - bounds.left - bounds.width / 2;
        const relY = e.clientY - bounds.top - bounds.height / 2;
        el.style.transform = `translate(${relX * 0.28}px, ${relY * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------- Hero title staggered line reveal ---------- */
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hero-title .line').forEach((line, i) => {
      line.style.transitionDelay = `${i * 0.12 + 0.1}s`;
    });
  });

  /* ---------- Contact form ----------
     Submits to Formspree (https://formspree.io) so messages actually
     reach your inbox. Sign up for a free account, create a form, and
     replace YOUR_FORM_ID in index.html's <form action="..."> with the
     ID Formspree gives you. Until that ID is set, this falls back to
     opening the visitor's email client with a pre-filled message. */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const formButton = form ? form.querySelector('button[type="submit"]') : null;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const isConfigured = form.action && !form.action.includes('YOUR_FORM_ID');

      if (!isConfigured) {
        // Fallback: open the visitor's mail app with the message pre-filled.
        const subject = encodeURIComponent(`Project inquiry from ${name || 'your website'}`);
        const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
        window.location.href = `mailto:zakariasaalmi@gmail.com?subject=${subject}&body=${body}`;
        if (formNote) {
          formNote.textContent = 'Opening your email app to send this message...';
          formNote.style.color = 'var(--gold-soft)';
        }
        return;
      }

      if (formButton) { formButton.disabled = true; formButton.style.opacity = '.6'; }
      if (formNote) { formNote.textContent = 'Sending...'; formNote.style.color = 'var(--text-gray)'; }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          if (formNote) {
            formNote.textContent = `Thanks${name ? ', ' + name : ''} — your message is on its way. I'll get back to you shortly.`;
            formNote.style.color = 'var(--gold-soft)';
          }
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        if (formNote) {
          formNote.textContent = `Something went wrong sending that. You can email me directly at zakariasaalmi@gmail.com`;
          formNote.style.color = 'var(--gold-soft)';
        }
      } finally {
        if (formButton) { formButton.disabled = false; formButton.style.opacity = '1'; }
      }
    });
  }

  /* ---------- Subtle parallax on hero blobs ---------- */
  if (!prefersReduced) {
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (blob1) blob1.style.transform = `translateY(${y * 0.15}px)`;
      if (blob2) blob2.style.transform = `translateY(${y * -0.1}px)`;
    }, { passive: true });
  }
})();
