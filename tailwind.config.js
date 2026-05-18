/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        club: {
          red: '#CC0000',
          dark: '#0d0d0d',
        },
      },
      fontFamily: {
        amharic: ['"Noto Sans Ethiopic"', 'Ethiopic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
