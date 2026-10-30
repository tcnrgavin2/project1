const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.step').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('li');
    const wasOpen = item.classList.contains('is-open');

    document.querySelectorAll('.steps li').forEach((step) => step.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});

// Keep the first guide item open on initial load.
document.querySelector('.steps li').classList.add('is-open');

document.querySelector('.back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealTargets = document.querySelectorAll('.manifesto, .gallery-card, .guide-image, .guide-content');
revealTargets.forEach((target) => target.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach((target) => observer.observe(target));
