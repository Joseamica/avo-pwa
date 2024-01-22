/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        buttons: {
          main: '#1a593b',
          disabled: '#9798A1',
          tip: '#F6F6F9',
        },
        texts: {
          primary: '#1F2937',
          secondary: '#4B5563',
          disabled: '#9CA3AF',
          avoqado: '#2e8857',
        },
        borders: {
          button: '#2e8857',
          selected: '#4B5563',
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
