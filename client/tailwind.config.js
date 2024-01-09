/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: {
          warning: '#E57373',
          avoq: '#2e8857',
        },
      },
    },
  },
  plugins: [],
}
