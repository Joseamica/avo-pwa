/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        buttons: {
          main: '#1a593b',
        },
        borders: {
          button: '#2e8857',
        },
        background: {
          primary: '#F6F6F9',
        },
        main: {
          warning: '#E57373',
        },
      },
    },
  },
  plugins: [],
}
