document.documentElement.classList.add('js');

const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

const revealElements = [
  ...document.querySelectorAll('.reveal')
];

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (
  reducedMotion ||
  !('IntersectionObserver' in window)
) {
  revealElements.forEach((element) => {
    element.classList.add('is-visible');
  });
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}