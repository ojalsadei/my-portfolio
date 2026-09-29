/* ==========================================
   SETTINGS
========================================== */

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
);


/* ==========================================
   REVEAL ON SCROLL
========================================== */

const revealElements =
  document.querySelectorAll('.reveal');


if (reducedMotion.matches) {

  revealElements.forEach(
    (element) => {
      element.classList.add('visible');
    }
  );

} else {

  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              'visible'
            );

            revealObserver.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.1,
        rootMargin:
          '0px 0px -48px 0px',
      }
    );


  revealElements.forEach(
    (element) => {

      revealObserver.observe(
        element
      );

    }
  );

}


/* ==========================================
   HERO INITIAL ANIMATION
========================================== */

window.addEventListener(
  'load',
  () => {

    if (reducedMotion.matches) {
      return;
    }


    const heroElements =
      document.querySelectorAll(
        '.hero .reveal'
      );


    heroElements.forEach(
      (element, index) => {

        window.setTimeout(
          () => {

            element.classList.add(
              'visible'
            );

          },
          70 + index * 70
        );

      }
    );

  },
  {
    once: true,
  }
);


/* ==========================================
   SMOOTH INTERNAL NAVIGATION
========================================== */

document.addEventListener(
  'click',
  (event) => {

    const anchor =
      event.target.closest(
        'a[href^="#"]'
      );


    if (!anchor) {
      return;
    }


    const href =
      anchor.getAttribute(
        'href'
      );


    if (
      !href ||
      href === '#'
    ) {
      return;
    }


    const target =
      document.querySelector(
        href
      );


    if (!target) {
      return;
    }


    event.preventDefault();


    target.scrollIntoView(
      {
        behavior:
          reducedMotion.matches
            ? 'auto'
            : 'smooth',

        block: 'start',
      }
    );


    if (
      window.history &&
      window.history.replaceState
    ) {

      window.history.replaceState(
        null,
        '',
        href
      );

    }

  }
);


/* ==========================================
   MOBILE NAVIGATION
========================================== */

const mobileMenuButton =
  document.getElementById(
    'mobileMenuButton'
  );


const mobileMenu =
  document.getElementById(
    'mobileMenu'
  );


const closeMobileMenu =
  () => {

    if (
      !mobileMenuButton ||
      !mobileMenu
    ) {
      return;
    }


    document.body.classList.remove(
      'menu-open'
    );


    mobileMenuButton.setAttribute(
      'aria-expanded',
      'false'
    );


    mobileMenuButton.setAttribute(
      'aria-label',
      'Open navigation'
    );


    mobileMenu.setAttribute(
      'aria-hidden',
      'true'
    );

  };


const openMobileMenu =
  () => {

    if (
      !mobileMenuButton ||
      !mobileMenu
    ) {
      return;
    }


    document.body.classList.add(
      'menu-open'
    );


    mobileMenuButton.setAttribute(
      'aria-expanded',
      'true'
    );


    mobileMenuButton.setAttribute(
      'aria-label',
      'Close navigation'
    );


    mobileMenu.setAttribute(
      'aria-hidden',
      'false'
    );

  };


if (
  mobileMenuButton &&
  mobileMenu
) {

  mobileMenuButton.addEventListener(
    'click',
    () => {

      const isOpen =
        document.body.classList.contains(
          'menu-open'
        );


      if (isOpen) {

        closeMobileMenu();

      } else {

        openMobileMenu();

      }

    }
  );


  mobileMenu
    .querySelectorAll('a')
    .forEach(
      (link) => {

        link.addEventListener(
          'click',
          () => {

            closeMobileMenu();

          }
        );

      }
    );


  document.addEventListener(
    'keydown',
    (event) => {

      if (
        event.key === 'Escape'
      ) {

        closeMobileMenu();

      }

    }
  );


  window.addEventListener(
    'resize',
    () => {

      if (
        window.innerWidth > 760
      ) {

        closeMobileMenu();

      }

    },
    {
      passive: true,
    }
  );

}


/* ==========================================
   NAV SECTION HIGHLIGHTING
========================================== */

const sections =
  document.querySelectorAll(
    'main section[id]'
  );


const desktopNavLinks =
  document.querySelectorAll(
    '.nav-links a'
  );


const mobileNavLinks =
  document.querySelectorAll(
    '.mobile-menu a'
  );


const allNavLinks =
  [
    ...desktopNavLinks,
    ...mobileNavLinks,
  ];


const sectionObserver =
  new IntersectionObserver(
    (entries) => {

      const visibleEntry =
        entries
          .filter(
            (entry) =>
              entry.isIntersecting
          )
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          )[0];


      if (!visibleEntry) {
        return;
      }


      const id =
        `#${visibleEntry.target.id}`;


      allNavLinks.forEach(
        (link) => {

          const isActive =
            link.getAttribute(
              'href'
            ) === id;


          link.toggleAttribute(
            'data-active',
            isActive
          );

        }
      );

    },
    {
      threshold: [
        0.2,
        0.4,
        0.6,
      ],

      rootMargin:
        '-15% 0px -55% 0px',
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
   COPY CONTACT DETAILS
========================================== */

const copyButtons =
  document.querySelectorAll(
    '.copy-contact'
  );


/*
  Modern clipboard first.
  If the browser blocks it,
  automatically use the legacy
  selection-based fallback.
*/

const copyWithFallback =
  async (value) => {

    /*
      Method 1:
      Modern Clipboard API
    */

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText ===
        'function'
    ) {

      try {

        await navigator.clipboard.writeText(
          value
        );

        return true;

      } catch (error) {

        /*
          Don't stop here.

          Some desktop browsers expose
          navigator.clipboard but block
          writeText depending on permissions.

          Continue to the fallback.
        */

      }

    }


    /*
      Method 2:
      Hidden textarea fallback
    */

    const textarea =
      document.createElement(
        'textarea'
      );


    textarea.value =
      value;


    textarea.setAttribute(
      'readonly',
      ''
    );


    textarea.setAttribute(
      'aria-hidden',
      'true'
    );


    textarea.style.position =
      'fixed';


    textarea.style.top =
      '0';


    textarea.style.left =
      '-9999px';


    textarea.style.width =
      '1px';


    textarea.style.height =
      '1px';


    textarea.style.padding =
      '0';


    textarea.style.border =
      '0';


    textarea.style.outline =
      '0';


    textarea.style.opacity =
      '0';


    textarea.style.pointerEvents =
      'none';


    document.body.appendChild(
      textarea
    );


    textarea.focus();


    textarea.select();


    textarea.setSelectionRange(
      0,
      textarea.value.length
    );


    let copied = false;


    try {

      copied =
        document.execCommand(
          'copy'
        );

    } catch (error) {

      copied = false;

    }


    textarea.remove();


    return copied;

  };


copyButtons.forEach(
  (button) => {

    let resetTimer =
      null;


    button.addEventListener(
      'click',
      async () => {

        const value =
          button.dataset.copy;


        const feedback =
          button.querySelector(
            '.copy-feedback'
          );


        if (
          !value ||
          !feedback
        ) {
          return;
        }


        const originalText =
          'Copy';


        try {

          const copied =
            await copyWithFallback(
              value
            );


          if (!copied) {

            throw new Error(
              'Copy failed'
            );

          }


          button.classList.add(
            'is-copied'
          );


          feedback.textContent =
            'Copied ✓';


          window.clearTimeout(
            resetTimer
          );


          resetTimer =
            window.setTimeout(
              () => {

                button.classList.remove(
                  'is-copied'
                );


                feedback.textContent =
                  originalText;

              },
              1400
            );

        } catch (error) {

          button.classList.remove(
            'is-copied'
          );


          feedback.textContent =
            'Try again';


          window.clearTimeout(
            resetTimer
          );


          resetTimer =
            window.setTimeout(
              () => {

                feedback.textContent =
                  originalText;

              },
              1400
            );

        }

      }
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


if (
  coverPhone &&
  !reducedMotion.matches
) {

  let ticking =
    false;


  const updatePhoneParallax =
    () => {

      ticking =
        false;


      if (
        window.innerWidth <= 760
      ) {

        coverPhone.style.removeProperty(
          '--phone-shift'
        );

        return;

      }


      const rect =
        coverPhone.getBoundingClientRect();


      if (
        rect.bottom <= 0 ||
        rect.top >=
          window.innerHeight
      ) {

        return;

      }


      const viewportCenter =
        window.innerHeight / 2;


      const phoneCenter =
        rect.top +
        rect.height / 2;


      const normalized =
        Math.max(
          -1,
          Math.min(
            1,
            (
              phoneCenter -
              viewportCenter
            ) /
            window.innerHeight
          )
        );


      const shift =
        normalized * -16;


      coverPhone.style.setProperty(
        '--phone-shift',
        `${shift}px`
      );

    };


  const requestPhoneUpdate =
    () => {

      if (ticking) {
        return;
      }


      ticking =
        true;


      window.requestAnimationFrame(
        updatePhoneParallax
      );

    };


  window.addEventListener(
    'scroll',
    requestPhoneUpdate,
    {
      passive: true,
    }
  );


  window.addEventListener(
    'resize',
    requestPhoneUpdate,
    {
      passive: true,
    }
  );


  requestPhoneUpdate();

}
