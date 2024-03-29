const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Neue', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        buttons: {
          main: '#003366',
          secondary: '#F5F5DC',
          disabled: '#9798A1',
          tip: '#F6F6F9',
        },
        texts: {
          primary: '#1F2937',
          secondary: '#4B5563',
          disabled: '#9CA3AF',
          avoqado: '#336B42',
          success: '#2E3A23',
          error: '#E57373',
        },
        borders: {
          button: '#D3D3D3',
          selected: '#4B5563',
          disabled: '#EBECF1',
        },
        background: {
          primary: '#F6F6F9',
          success: '#D1FFDD',
          warning: '#E57373',
        },
        main: {
          warning: '#E57373',
        },
      },
    },
  },
  plugins: [],
}

//Color main: #003366
//Color mas clarito de main: #0055A4
