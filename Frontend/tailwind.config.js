/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#63786b',
        cream: '#f8f7e5',
      },
      fontFamily: {
        sans: ['Merriweather', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}