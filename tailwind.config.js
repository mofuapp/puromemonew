/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B9BD5',
        'primary-light': '#A8C8F0',
        accent: '#F9A8A8',
        surface: '#FFFFFF',
        bg: '#F2F2F7',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"', 'Meiryo', 'sans-serif'
        ]
      }
    }
  },
  plugins: []
}
