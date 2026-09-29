const revealElements =
  document.querySelectorAll(
    '.reveal'
  );

const observer =
  new IntersectionObserver(
    (entries) => {
      entries.forEach(
        (entry) => {
          if (
            entry.isIntersecting
          ) {
            entry.target.classList.add(
              'visible'
            );

            observer.unobserve(
              entry.target
            );
          }
        }
      );
    },
    {
      threshold: 0.12,
      rootMargin:
        '0px 0px -60px 0px',
    }
  );

revealElements.forEach(
  (element) => {
    observer.observe(
      element
    );
  }
);


/*
 * Show the first viewport
 * immediately instead of
 * waiting for the observer.
 */

window.addEventListener(
  'load',
  () => {
    const heroElements =
      document.querySelectorAll(
        '.hero .reveal'
      );

    heroElements.forEach(
      (
        element,
        index
      ) => {
        setTimeout(
          () => {
            element.classList.add(
              'visible'
            );
          },
          index * 90
        );
      }
    );
  }
);


/*
 * Highlight navigation item
 * based on the visible section.
 */

const sections =
  document.querySelectorAll(
    'main section[id]'
  );

const navLinks =
  document.querySelectorAll(
    '.nav-links a'
  );

const sectionObserver =
  new IntersectionObserver(
    (entries) => {
      entries.forEach(
        (entry) => {
          if (
            !entry.isIntersecting
          ) {
            return;
          }

          navLinks.forEach(
            (link) => {
              link.removeAttribute(
                'data-active'
              );

              const href =
                link.getAttribute(
                  'href'
                );

              if (
                href ===
                `#${entry.target.id}`
              ) {
                link.setAttribute(
                  'data-active',
                  'true'
                );
              }
            }
          );
        }
      );
    },
    {
      threshold: 0.35,
    }
  );

sections.forEach(
  (section) => {
    sectionObserver.observe(
      section
    );
  }
);


/*
 * Slight parallax effect
 * for the featured phone.
 */

const coverPhone =
  document.querySelector(
    '.cover-phone'
  );

if (coverPhone) {
  window.addEventListener(
    'scroll',
    () => {
      if (
        window.innerWidth <=
        760
      ) {
        coverPhone.style.transform =
          '';
        return;
      }

      const rect =
        coverPhone.getBoundingClientRect();

      if (
        rect.bottom > 0 &&
        rect.top <
          window.innerHeight
      ) {
        const progress =
          (
            window.innerHeight -
            rect.top
          ) /
          (
            window.innerHeight +
            rect.height
          );

        const translate =
          (
            progress -
            0.5
          ) * 25;

        coverPhone.style.transform =
          `rotate(3deg) translateY(${translate}px)`;
      }
    },
    {
      passive: true,
    }
  );
}