/* ==========================================
   REVEAL ON SCROLL
========================================== */

const revealElements =
  document.querySelectorAll(
    '.reveal'
  );


const revealObserver =
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

            revealObserver.unobserve(
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

    revealObserver.observe(
      element
    );

  }
);


/* ==========================================
   HERO INITIAL ANIMATION
========================================== */

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


/* ==========================================
   NAV SECTION HIGHLIGHTING
========================================== */

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


/* ==========================================
   FEATURED PHONE PARALLAX
========================================== */

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
        coverPhone
          .getBoundingClientRect();


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


/* ==========================================
   MEMOJI EYE + HEAD TRACKING
========================================== */

const heroMemoji =
  document.getElementById(
    'heroMemoji'
  );


const reduceMotion =
  window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );


const hasFinePointer =
  window.matchMedia(
    '(pointer: fine)'
  );


if (
  heroMemoji &&
  hasFinePointer.matches &&
  !reduceMotion.matches
) {

  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;

  let frameId = null;


  const updateMemoji =
    () => {

      /*
       * Smooth follow rather than
       * snapping directly to cursor.
       */

      currentX +=
        (
          targetX -
          currentX
        ) * 0.12;


      currentY +=
        (
          targetY -
          currentY
        ) * 0.12;


      const headX =
        currentX * 9;


      const headY =
        currentY * 6;


      const rotation =
        currentX * 2.2;


      const eyeX =
        currentX * 4.5;


      const eyeY =
        currentY * 3;


      heroMemoji.style.setProperty(
        '--head-x',
        `${headX}px`
      );


      heroMemoji.style.setProperty(
        '--head-y',
        `${headY}px`
      );


      heroMemoji.style.setProperty(
        '--head-rotate',
        `${rotation}deg`
      );


      heroMemoji.style.setProperty(
        '--eye-x',
        `${eyeX}px`
      );


      heroMemoji.style.setProperty(
        '--eye-y',
        `${eyeY}px`
      );


      frameId =
        requestAnimationFrame(
          updateMemoji
        );

    };


  const handlePointerMove =
    (event) => {

      const rect =
        heroMemoji
          .getBoundingClientRect();


      const centerX =
        rect.left +
        rect.width / 2;


      const centerY =
        rect.top +
        rect.height / 2;


      const dx =
        event.clientX -
        centerX;


      const dy =
        event.clientY -
        centerY;


      const distanceX =
        window.innerWidth * 0.5;


      const distanceY =
        window.innerHeight * 0.5;


      targetX =
        Math.max(
          -1,
          Math.min(
            1,
            dx / distanceX
          )
        );


      targetY =
        Math.max(
          -1,
          Math.min(
            1,
            dy / distanceY
          )
        );


      const distanceToMemoji =
        Math.hypot(
          dx,
          dy
        );


      if (
        distanceToMemoji <
        430
      ) {

        heroMemoji.classList.add(
          'is-curious'
        );

      } else {

        heroMemoji.classList.remove(
          'is-curious'
        );

      }

    };


  const handlePointerLeave =
    () => {

      targetX = 0;
      targetY = 0;

      heroMemoji.classList.remove(
        'is-curious'
      );

    };


  document.addEventListener(
    'pointermove',
    handlePointerMove,
    {
      passive: true,
    }
  );


  document.addEventListener(
    'mouseleave',
    handlePointerLeave
  );


  frameId =
    requestAnimationFrame(
      updateMemoji
    );


  window.addEventListener(
    'beforeunload',
    () => {

      if (
        frameId
      ) {

        cancelAnimationFrame(
          frameId
        );

      }

    }
  );

}
