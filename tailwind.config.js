/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        primary: 'var(--primary)',
        'accent-coin': 'var(--accent-coin)',
        success: 'var(--success)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        display: ['var(--font-display)'],
      }
    },
  },
  plugins: [],
}
