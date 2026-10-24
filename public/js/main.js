// main.js runs on every page.
// It handles 4 small things: the theme button, the mobile menu,
// the typing text on the Home page, and the year in the footer.

// ---------- 1. Light / dark theme ----------
// The theme is saved in localStorage so it stays the same on every page.
// localStorage can fail in private browsing, so we wrap it in try/catch.
function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    // Saving failed. The theme still works for this page.
  }
}

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    saveTheme(isDark ? 'dark' : 'light');
  });
});

// ---------- 2. Mobile menu ----------
const menuButton = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.getElementById('mobile-menu');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    mobileMenu.classList.toggle('hidden', isOpen);
    mobileMenu.classList.toggle('flex', !isOpen);
  });
}

// ---------- 3. Typing text (Home page only) ----------
// The words come from the data-typing attribute, split by "|".
const typingEl = document.querySelector('[data-typing]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typingEl && !reduceMotion) {
  const words = typingEl.dataset.typing.split('|');
  let wordIndex = 0;
  let letterCount = words[0].length; // start with the first word fully typed
  let deleting = true;

  function tick() {
    let delay = deleting ? 45 : 85;

    if (deleting) {
      letterCount -= 1;
      if (letterCount === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }
    } else {
      letterCount += 1;
      if (letterCount === words[wordIndex].length) {
        deleting = true;
        delay = 2200; // pause on the full word
      }
    }

    typingEl.textContent = words[wordIndex].slice(0, letterCount);
    setTimeout(tick, delay);
  }

  setTimeout(tick, 2200);
}

// ---------- 4. Footer year ----------
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});
