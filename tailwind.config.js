/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"EB Garamond"', 'Literata', 'Georgia', 'serif'],
        sans: ['"EB Garamond"', 'Literata', 'Georgia', 'serif'],
      },
      colors: {
        history: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#3b82f6',
          800: '#1e3a8a',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
