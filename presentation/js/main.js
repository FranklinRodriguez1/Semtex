/* Interacciones vanilla JS: nav scroll-spy, scroll-reveal, smooth scroll y menú móvil. */

// TODO: pegar aquí la URL donde quede desplegada la app (ej. https://semtex.vercel.app)
const APP_URL = '';

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main section[id]');

  // Botón "Hablemos de tu operación": redirige a la app en cuanto se defina APP_URL
  const appLink = document.getElementById('app-link');
  if (appLink) {
    if (APP_URL) {
      appLink.href = APP_URL;
    } else {
      appLink.removeAttribute('target');
      appLink.removeAttribute('rel');
      appLink.href = 'mailto:franklinrodriguezdev@gmail.com';
    }
  }

  // Menú hamburguesa (móvil)
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('is-open'));
    });
  }

  // Scroll-spy: resalta el link de la sección visible
  if ('IntersectionObserver' in window && sections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }

  // Scroll-reveal: aparición progresiva de bloques marcados con .reveal
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }
});
