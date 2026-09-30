const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
);

const revealElements = document.querySelectorAll('.reveal');

if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => {
    element.classList.add('visible');
  });
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -48px 0px'
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}
