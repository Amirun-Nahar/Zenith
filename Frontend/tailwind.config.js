/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          background: '#EBE9E1',
          font: '#E43D12',
          accent: '#EFB11D',
        },
        background: '#EBE9E1',
        foreground: '#E43D12',
        accent: '#EFB11D',
        surface: '#EBE9E1',
        border: '#EFB11D',
      },
      fontFamily: {
        sans: ['Merriweather', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}