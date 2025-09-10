/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Strict three-color palette
        background: '#19183B', // Dark blue background
        text: '#F5EFE6',      // Light cream text/font color
        button: '#E7F2EF',    // Button color
        accent: '#6D94C5',    // Accent/borders color
        // Aliases for consistency
        foreground: '#F5EFE6',
        primary: '#E7F2EF',
        border: '#6D94C5',
        surface: '#19183B',
      },
      fontFamily: {
        sans: ['Merriweather', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}