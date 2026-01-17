/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3b82f6', 50: '#eff6ff', 900: '#1e3a8a' },
        islamic: { DEFAULT: '#10b981', 50: '#ecfdf5', 900: '#064e3b' },
        dark: '#0f172a',
        surface: '#1e293b',
        muted: '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
