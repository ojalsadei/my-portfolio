const menuButton = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');
const header = document.getElementById('siteHeader');
const toast = document.getElementById('toast');
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

let lastFocusedElement = null;
let toastTimer = null;

function setMenu(open, { restoreFocus = false } = {}) {
  if (!menuButton || !mobileMenu) return;

  if (open) {
    lastFocusedElement = document.activeElement;
    document.body.classList.add('menu-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close navigation');
    mobileMenu.setAttribute('aria-hidden', 'false');

    const firstLink = mobileMenu.querySelector('a');
    firstLink?.focus();
    return;
  }

  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileMenu.setAttribute('aria-hidden', 'true');

  if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  setMenu(!isOpen, { restoreFocus: isOpen });
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
    setMenu(false, { restoreFocus: true });
  }
});

document.addEventListener('click', (event) => {
  if (!document.body.classList.contains('menu-open')) return;
  if (header?.contains(event.target)) return;
  setMenu(false);
});

window.addEventListener(
  'resize',
  () => {
    if (
      window.innerWidth > 760 &&
      document.body.classList.contains('menu-open')
    ) {
      setMenu(false);
    }
  },
  { passive: true }
);

// Keep navigation state aligned with the section currently in view.
const navLinks = [
  ...document.querySelectorAll('.nav-links a[href^="#"]'),
  ...document.querySelectorAll('.mobile-menu a[href^="#"]')
];

const sections = [...document.querySelectorAll('main section[id]')].filter(
  (section) => section.id !== 'top'
);

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const href = `#${visible.target.id}`;

      navLinks.forEach((link) => {
        if (link.getAttribute('href') === href) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    },
    {
      threshold: [0.15, 0.35, 0.55],
      rootMargin: '-12% 0px -56% 0px'
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('is-visible');

  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 1600);
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_) {
      // Fall through to the selection-based fallback.
    }
  }

  const textarea = document.createElement('textarea');

  textarea.value = value;
  textarea.readOnly = true;
  textarea.setAttribute('aria-hidden', 'true');

  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);

  textarea.select();

  let copied = false;

  try {
    copied = document.execCommand('copy');
  } catch (_) {
    copied = false;
  }

  textarea.remove();

  return copied;
}

document.querySelectorAll('.copy-button[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;

    if (!value) return;

    const original = button.textContent;
    const copied = await copyText(value);

    if (copied) {
      button.textContent = 'Copied';
      showToast('Copied to clipboard');
    } else {
      button.textContent = 'Try again';
      showToast('Copy was blocked by the browser');
    }

    window.setTimeout(() => {
      button.textContent = original;
    }, 1400);
  });
});
