/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind looks inside these files to find the classes you use.
  content: ['./public/**/*.html', './public/js/**/*.js'],

  // Dark mode turns on when <html> has the "dark" class (main.js adds or removes it).
  darkMode: 'class',

  theme: {
    extend: {
      // These names point to CSS variables in src/input.css.
      // The variables change between light and dark mode, so one class works in both.
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        line: 'var(--line)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '1200px',
      },
    },
  },
  plugins: [],
};
