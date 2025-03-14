/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', './src/**/*.{html,js,ts,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
